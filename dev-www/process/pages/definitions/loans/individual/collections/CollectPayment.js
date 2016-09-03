irf.pageCollection.factory(irf.page("loans.individual.collections.CollectPayment"),
["$log","$q", 'LoanProcess','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService","Utils",
function($log, $q, LoanProcess, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService, Utils){

	return {
		"type": "schema-form",
		"title": "REPAYMENT_FOR_LOAN",
		initialize: function (model, form, formCtrl) {
            model.collectPayment = model.collectPayment||{};
            model.repayment = model.repayment || {};
            model.repayment.accountId = $stateParams.pageId;
            if (!model._bounce) {                
                $state.go('Page.Engine', {pageName: 'loans.individual.collections.BounceQueue', pageId: null});
            } else {
                model.collectPayment=model._bounce;
                model.collectPayment.amountdue=model._bounce.amount1;
            }
            model.repayment.instrument = "CASH_IN";
            model.repayment.transactionName = "Scheduled Demand"; //transactionName : Advance Repayment, Scheduled Demand, Fee Payment, Pre-closure, Prepayment
            //repaymentType applicable for KGFS - ADVANCED, SCHEDULED, OVERDUE
            model.repayment.authorizationRemark = "";
            model.repayment.authorizationUsing = "";
            model.repayment.productCode = "T901";
            model.repayment.urnNo = model._bounce.description;
            model.repayment.repaymentDate = Utils.getCurrentDate();
        },
		form: [
			{
				"type":"box",
				"title":"REPAYMENT",
				"items":[
                    {
                        key:"collectPayment.customerName",
                        title:"ENTERPRISE_NAME",
                        readonly:true
                    },
                    {
                        key:"collectPayment.applicant", /*applicant-field is missing in scheduledemandlist*/
                        title:"APPLICANT",
                        readonly:true
                    },
                    {
                        key:"collectPayment.coApplicant", /*coApplicant-field is missing in scheduledemandlist*/
                        title:"CO_APPLICANT",
                        readonly:true
                    },
                    {
                        key: "collectPayment.accountId", /*accountId is Loan Account Number*/
                        title: "LOAN_ACCOUNT_NUMBER",
                        readonly: true
                    },
                    {
                        key:"collectPayment.amountdue",
                        title:"AMOUNT_DUE",
                        //type:"amount",
                        readonly:true
                    },
                    {
                        key:"repayment.instrument",
                        title:"REPAYMENT_MODE",
                        type:"select",
                        titleMap: [{
                            "name":"Cash",
                            "value":"CASH_IN"
                        },
                        {
                            "name":"Cheque",
                            "value":"CHQ_IN"
                        },
                        {
                            "name":"NEFT",
                            "value":"NEFT_IN"
                        },
                        {
                            "name":"RTGS",
                            "value":"RTGS_IN"
                        }]
                    },
                    {
                        key:"repayment.amount",
                        title:"AMOUNT_PAID",
                        readonly:false,
                        required:true,
                        type:"amount"
                    },
					{
						key:"repayment.checqueNumber",
                        title:"CHEQUE_NUMBER",
						type:"text",
                        required:true,
                        condition:"model.repayment.instrument=='CHQ'"
					},
                    {
                        key:"repayment.chequeDate",
                        title:"CHEQUE_DATE",
                        type:"date",
                        required:true,
                        condition:"model.repayment.instrument=='CHQ'"
                    },
                    {
                        key:"repayment.chequeBank",
                        title:"ISSUING_BANK",
                        type:"text",
                        condition:"model.repayment.instrument=='CHQ'"
                    },
                    {
                        key:"repayment.chequeBranch",
                        title:"ISSUING_BRANCH",
                        type:"text",
                        condition:"model.repayment.instrument=='CHQ'"
                    },
                    {
                        key: "repayment.chequePhoto",
                        title: "CHEQUE_PHOTO",
                        condition:"model.repayment.instrument=='CHQ'",
                        type: "file",
                        fileType: "image/*",
                        category: "noidea",
                        subCategory: "absolutlynoidea"
                    },
                    {
                        key:"repayment.NEFTReferenceNumber",
                        title:"REFERENCE_NUMBER",
                        type:"text",
                        required: true,
                        condition:"model.repayment.instrument=='NEFT'"
                    },
                    {
                        key:"repayment.NEFTDate",
                        title:"DATE",
                        type:"text",
                        condition:"model.repayment.instrument=='NEFT'"
                    },
                    {
                        key:"repayment.NEFTBankDetails",
                        title:"BANK_DETAILS",
                        type:"text",
                        condition:"model.repayment.instrument=='NEFT'"
                    },
                    {
                        key:"repayment.NEFTBranchDetails",
                        title:"BRANCH_DETAILS",
                        type:"text",
                        condition:"model.repayment.instrument=='NEFT'"
                    },
                    {
                        key:"repayment.RTGSReferenceNumber",
                        title:"REFERENCE_NUMBER",
                        type:"text",
                        condition:"model.repayment.instrument=='RTGS'"
                    },
                    {
                        key:"repayment.RTGSDate",
                        title:"DATE",
                        type:"text",
                        condition:"model.repayment.instrument=='RTGS'"
                    },
                    {
                        key:"repayment.RTGSBankDetails",
                        title:"BANK_DETAILS",
                        type:"text",
                        condition:"model.repayment.instrument=='RTGS'"
                    },
                    {
                        key:"repayment.RTGSBranchDetails",
                        title:"BRANCH_DETAILS",
                        type:"text",
                        condition:"model.repayment.instrument=='RTGS'"
                    },
                    {
                        key:"repayment.cashCollectionRemark",
                        title:"REMARKS",
                        type:"textarea"
                    }
				]
			}
			,
			{
				"type": "actionbox",
				"items": [{
					"type": "submit",
					"title": "SUBMIT"
			}]
		}],
		schema: {
            type: "object",
            properties: {
                "repayment": {
                    type: "object",
                    properties: {
                        "instrument": {
                            type: "string"
                        }
                    }
                }
            }
        },
		actions: {
			submit: function(model, form, formName){
				$log.info("Inside submit()");
                PageHelper.showLoader();

                LoanProcess.repay(model.repayment, function(response){
                    PageHelper.hideLoader();
                    $state.go('Page.Engine', {pageName: 'loans.individual.collections.BounceQueue', pageId: null});

                }, function(errorResponse){
                    PageHelper.hideLoader();
                    PageHelper.showErrors(errorResponse);
                });
			}
		}
	};
}]);
