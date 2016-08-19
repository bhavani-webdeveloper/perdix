

irf.pageCollection.factory(irf.page("loans.individual.collections.CollectPayment"),
["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, ManagementHelper, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService){

	return {
		"type": "schema-form",
		"title": "REPAYMENT_FOR_LOAN : " + $stateParams.pageId,
		initialize: function (model, form, formCtrl) {},
		
		form: [
			{
				"type":"box",
				"title":"Repayment",
				"items":[
                    {
                        key:"repaymentMode",
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
                        key:"AmountDue",
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
                        condition:"model.repaymentMode=='Cheque'"
					},
                    {
                        key:"ChequeDate",
                        title:"CHEQUE_DATE",
                        type:"date",
                        condition:"model.repaymentMode=='Cheque'"
                    },
                    {
                        key:"ChequeBank",
                        title:"ISSUING_BANK",
                        type:"text",
                        condition:"model.repaymentMode=='Cheque'"
                    },
                    {
                        key:"ChequeBranch",
                        title:"ISSUING_BRANCH",
                        type:"text",
                        condition:"model.repaymentMode=='Cheque'"
                    },
                    {
                        key:"NEFTReferenceNumber",
                        title:"REFERENCE_NUMBER",
                        type:"text",
                        condition:"model.repaymentMode=='NEFT'"
                    },
                    {
                        key:"NEFTDate",
                        title:"Date",
                        type:"text",
                        condition:"model.repaymentMode=='NEFT'"
                    },
                    {
                        key:"NEFTBankDetails",
                        title:"BANK_DETAILS",
                        type:"text",
                        condition:"model.repaymentMode=='NEFT'"
                    },
                    {
                        key:"NEFTBranchDetails",
                        title:"BRANCH_DETAILS",
                        type:"text",
                        condition:"model.repaymentMode=='NEFT'"
                    },
                    {
                        key:"RTGSReferenceNumber",
                        title:"REFERENCE_NUMBER",
                        type:"text",
                        condition:"model.repaymentMode=='RTGS'"
                    },
                    {
                        key:"RTGSDate",
                        title:"Date",
                        type:"text",
                        condition:"model.repaymentMode=='RTGS'"
                    },
                    {
                        key:"RTGSBankDetails",
                        title:"BANK_DETAILS",
                        type:"text",
                        condition:"model.repaymentMode=='RTGS'"
                    },
                    {
                        key:"RTGSBranchDetails",
                        title:"BRANCH_DETAILS",
                        type:"text",
                        condition:"model.repaymentMode=='RTGS'"
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
		schema: function() {
			return ManagementHelper.getVillageSchemaPromise();
		},
		actions: {
            generateFregCode:function(model,form){
                console.log(model);
                if(model.village.pincode>100000){
                    model.village.fregcode = Number(model.village.pincode+"001");
                }
                else {
                    model.village.fregcode="";
                }

            },
			submit: function(model, form, formName){
				$log.info("Inside submit()");
				console.warn(model);
				if (window.confirm("Save?") && model.village) {
					PageHelper.showLoader();
                    if(isNaN(model.village.version)) model.village.version=0;
                    model.village.version = Number(model.village.version)+1;
                    Masters.post({
                        action:"AddVillage",
                        data:model.village
                    },function(resp,head){
                        PageHelper.hideLoader();
                        PageHelper.showProgress("add-village","Done. Village ID :"+resp.id,2000);
                        console.log(resp);
                        ManagementHelper.backToDashboard();
                    },function(resp){
                        PageHelper.hideLoader();
                        PageHelper.showErrors(resp);
                        ManagementHelper.backToDashboard();
                        PageHelper.showProgress('error',"Oops. An error occurred.",2000);
                    });
				}
			}
		}
	};
}]);
