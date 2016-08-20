

irf.pageCollection.factory(irf.page("loans.individual.collections.CollectPayment"),
["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, ManagementHelper, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService){

	return {
		"type": "schema-form",
		"title": "REPAYMENT_FOR_LOAN",
		initialize: function (model, form, formCtrl) {
            model.repayment = {};
            model.repayment.repaymentType = "Cash";
        },
		form: [
			{
				"type":"box",
				"title":"Repayment",
				"items":[
                    {
                        key:"repayment.repaymentType",
                        title:"REPAYMENT_MODE",
                        type:"select",
                        titleMap: [{
                            "name":"Cash",
                            "value":"Cash"
                        },
                        {
                            "name":"Cheque",
                            "value":"Cheque"
                        },
                        {
                            "name":"NEFT",
                            "value":"NEFT"
                        },
                        {
                            "name":"RTGS",
                            "value":"RTGS"
                        }]
                    },
                    {
                        key:"repayment.amount",
                        title:"AMOUNT_DUE",
                        default:"1000",
                        readonly:false,
                        type:"amount",
                    },
                    {
                        key:"AmountPaid",
                        title:"AMOUNT_PAID",
                        readonly:false,
                        type:"amount"
                    },
					{
						key:"ChecqueNumber",
                        title:"CHEQUE_NUMBER",
						type:"text",
                        condition:"model.repayment.repaymentType=='Cheque'"
					},
                    {
                        key:"ChequeDate",
                        title:"CHEQUE_DATE",
                        type:"date",
                        condition:"model.repayment.repaymentType=='Cheque'"
                    },
                    {
                        key:"ChequeBank",
                        title:"ISSUING_BANK",
                        type:"text",
                        condition:"model.repayment.repaymentType=='Cheque'"
                    },
                    {
                        key:"ChequeBranch",
                        title:"ISSUING_BRANCH",
                        type:"text",
                        condition:"model.repayment.repaymentType=='Cheque'"
                    },
                    {
                        key:"NEFTReferenceNumber",
                        title:"REFERENCE_NUMBER",
                        type:"text",
                        condition:"model.repayment.repaymentType=='NEFT'"
                    },
                    {
                        key:"NEFTDate",
                        title:"Date",
                        type:"text",
                        condition:"model.repayment.repaymentType=='NEFT'"
                    },
                    {
                        key:"NEFTBankDetails",
                        title:"BANK_DETAILS",
                        type:"text",
                        condition:"model.repayment.repaymentType=='NEFT'"
                    },
                    {
                        key:"NEFTBranchDetails",
                        title:"BRANCH_DETAILS",
                        type:"text",
                        condition:"model.repayment.repaymentType=='NEFT'"
                    },
                    {
                        key:"RTGSReferenceNumber",
                        title:"REFERENCE_NUMBER",
                        type:"text",
                        condition:"model.repayment.repaymentType=='RTGS'"
                    },
                    {
                        key:"RTGSDate",
                        title:"Date",
                        type:"text",
                        condition:"model.repayment.repaymentType=='RTGS'"
                    },
                    {
                        key:"RTGSBankDetails",
                        title:"BANK_DETAILS",
                        type:"text",
                        condition:"model.repayment.repaymentType=='RTGS'"
                    },
                    {
                        key:"RTGSBranchDetails",
                        title:"BRANCH_DETAILS",
                        type:"text",
                        condition:"model.repayment.repaymentType=='RTGS'"
                    },
                    {
                        key:"Remarks",
                        title:"Remarks",
                        type:"textarea"
                    }
				]
			}
			,
			{
				"type": "actionbox",
				"items": [{
					"type": "submit",
					"title": "SAVE"
			}]
		}],
		schema: {
            type: "object",
            properties: {
                "repayment": {
                    type: "object",
                    properties: {
                        "repaymentType": {
                            type: "string",
                            enum: ["Cash", "NEFT"]
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

                }, function(errorResponse){
                    PageHelper.hideLoader();
                    PageHelper.showErrors(errorResponse);
                });
			}
		}
	};
}]);
