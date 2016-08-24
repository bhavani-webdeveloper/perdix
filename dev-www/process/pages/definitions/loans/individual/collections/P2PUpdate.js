irf.pageCollection.factory(irf.page("loans.individual.collections.P2PUpdate"),
["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, ManagementHelper, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService){

	return {
		"type": "schema-form",
		"title": "PROMISE_TO_PAY_FOR_LOAN",
		initialize: function (model, form, formCtrl) {
            model = model._bounce;
            if (!model.loanacno) {
                $state.go('Page.Engine', {pageName: 'loans.individual.collections.BounceQueue', pageId: null});
            }
        },
		form: [
			{
				"type":"box",
				"title":"PROMISE_TO_PAY",
				"items":[
                    {
                        key:"custname",
                        title:"ENTERPRISE_NAME",
                        readonly:true
                    },
                    {
                        key:"applicant",
                        title:"APPLICANT",
                        readonly:true
                    },
                    {
                        key:"coApplicant",
                        title:"CO_APPLICANT",
                        readonly:true
                    },
                    {
                        key: "loanacno",
                        title: "LOAN_ACCOUNT_NUMBER",
                        readonly: true
                    },
                    {
                        key: "customerNotAvailable",
                        title: "CUSTOMER_NOT_AVAILABLE",
                        type: "checkbox",
                        schema: {
                            default: false
                        }
                    },
                    {
                        key:"Promise2PayDate",
                        title:"PROMISE_TO_PAY_DATE",
                        readonly:false,
                        type:"date",
                    },
                    {
                        key: "customerCategory",
                        title: "CUSTOMER_CATEGORY",
                        type: "select",
                        titleMap: {
                            "A": "A",
                            "B": "B",
                            "C": "C",
                            "D": "D"
                        }
                    },
                    {
                        key:"Reason",
                        title:"REASON",
                        type:"select",
                        titleMap: [{
                            "name":"Wilful default",
                            "value":"Wilfuldefault"
                        },
                        {
                            "name":"Hardship",
                            "value":"Hardship"
                        },
                        {
                            "name":"Able to Pay",
                            "value":"AbletoPay"
                        },
                        {
                            "name":"Others",
                            "value":"Others"
                        }]
                    },
					{
						key:"ReasonforOthers",
                        title:"OTHER_REASON",
						type:"textarea",
                        condition:"model.Reason=='Others'"
					},
                    {
                        key:"Remarks",
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
