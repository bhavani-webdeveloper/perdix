

irf.pageCollection.factory(irf.page("loans.individual.collections.CollectPayment"),
["$log","$q", 'LoanProcess','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, LoanProcess, PageHelper,formHelper,irfProgressMessage,
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
                        type:"section",
                        html:"{{model.repayment}}"

                    },
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
                        readonly:false,
                        required:true,
                        type:"amount",
                    },
                    {
                        key:"repayment.amountPaid",
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
                        condition:"model.repayment.repaymentType=='Cheque'"
					},
                    {
                        key:"repayment.chequeDate",
                        title:"CHEQUE_DATE",
                        type:"date",
                        condition:"model.repayment.repaymentType=='Cheque'"
                    },
                    {
                        key:"repayment.chequeBank",
                        title:"ISSUING_BANK",
                        type:"text",
                        condition:"model.repayment.repaymentType=='Cheque'"
                    },
                    {
                        key:"repayment.chequeBranch",
                        title:"ISSUING_BRANCH",
                        type:"text",
                        condition:"model.repayment.repaymentType=='Cheque'"
                    },
                    {
                        key:"repayment.NEFTReferenceNumber",
                        title:"REFERENCE_NUMBER",
                        type:"text",
                        condition:"model.repayment.repaymentType=='NEFT'"
                    },
                    {
                        key:"repayment.NEFTDate",
                        title:"Date",
                        type:"text",
                        condition:"model.repayment.repaymentType=='NEFT'"
                    },
                    {
                        key:"repayment.NEFTBankDetails",
                        title:"BANK_DETAILS",
                        type:"text",
                        condition:"model.repayment.repaymentType=='NEFT'"
                    },
                    {
                        key:"repayment.NEFTBranchDetails",
                        title:"BRANCH_DETAILS",
                        type:"text",
                        condition:"model.repayment.repaymentType=='NEFT'"
                    },
                    {
                        key:"repayment.RTGSReferenceNumber",
                        title:"REFERENCE_NUMBER",
                        type:"text",
                        condition:"model.repayment.repaymentType=='RTGS'"
                    },
                    {
                        key:"repayment.RTGSDate",
                        title:"Date",
                        type:"text",
                        condition:"model.repayment.repaymentType=='RTGS'"
                    },
                    {
                        key:"repayment.RTGSBankDetails",
                        title:"BANK_DETAILS",
                        type:"text",
                        condition:"model.repayment.repaymentType=='RTGS'"
                    },
                    {
                        key:"repayment.RTGSBranchDetails",
                        title:"BRANCH_DETAILS",
                        type:"text",
                        condition:"model.repayment.repaymentType=='RTGS'"
                    },
                    {
                        key:"repayment.remarks",
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
                            enum: ["Cash","Cheque","NEFT","RTGS"]
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
