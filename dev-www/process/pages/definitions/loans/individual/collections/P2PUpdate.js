irf.pageCollection.factory(irf.page("loans.individual.collections.P2PUpdate"),
["$log","$q", 'Pages_ManagementHelper','LoanProcess','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService","Utils",
function($log, $q, ManagementHelper, LoanProcess, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService, Utils){

	return {
		"type": "schema-form",
		"title": "PROMISE_TO_PAY_FOR_LOAN",
		initialize: function (model, form, formCtrl) {
           
            if (!model._bounce) {
                $state.go('Page.Engine', {pageName: 'loans.individual.collections.BounceQueue', pageId: null});
            } else {
                 model.promise = model._bounce;
                model.promise.amountdue = model._bounce.amount1;
                model.promise.custname = model._bounce.customerName;
                model.promise.accountNumber = model._bounce.accountId;
                model.promise.transactionDate = Utils.getCurrentDate();
            }
            
            LoanProcess.p2pKGFSList({"accountNumber":model.promise.accountNumber}, function(response){
                if (response.body.length){
                    model.previousPromise = response.body[0];
                }

            });
        },
		form: [
			{
                "type":"box",
                "title":"LAST_P2P_DETAILS",
                "readonly":true,
                "condition": "model.previousPromise",
                "items":[
                    {
                        key: "previousPromise.customerNotAvailable",
                        title: "CUSTOMER_NOT_AVAILABLE",
                        type: "checkbox",
                        schema: {
                            default: false
                        }
                    },
                    {
                        key:"previousPromise.promiseToPayDate",
                        title:"PROMISE_TO_PAY_DATE",
                        readonly:false,
                        type:"date",
                    },
                    {
                        key: "previousPromise.customerCategoryLoanOfficer",
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
                        key:"previousPromise.reason",
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
                        key:"previousPromise.overdueReasons",
                        title:"OTHER_REASON",
                        type:"textarea",
                        condition:"model.previousPromise.reason=='Others'"
                    },
                    {
                        key:"previousPromise.remarks",
                        title:"REMARKS",
                        type:"textarea"
                    }
                ]
            },
            {
				"type":"box",
				"title":"PROMISE_TO_PAY",
				"items":[
                    {
                        key:"promise.custname",
                        title:"ENTERPRISE_NAME",
                        readonly:true
                    },
                    {
                        key:"promise.applicant",
                        title:"APPLICANT",
                        readonly:true
                    },
                    {
                        key:"promise.coApplicant",
                        title:"CO_APPLICANT",
                        readonly:true
                    },
                    {
                        key: "promise.accountNumber",
                        title: "LOAN_ACCOUNT_NUMBER",
                        readonly: true
                    },
                    {
                        key:"promise.amountdue",
                        title:"AMOUNT_DUE",
                        //type:"amount",
                        readonly:true
                    },
                    {
                        key: "promise.customerNotAvailable",
                        title: "CUSTOMER_NOT_AVAILABLE",
                        type: "checkbox",
                        schema: {
                            default: false
                        }
                    },
                    {
                        key:"promise.promiseToPayDate",
                        title:"PROMISE_TO_PAY_DATE",
                        readonly:false,
                        type:"date",
                    },
                    {
                        key: "promise.customerCategoryLoanOfficer",
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
                        key:"promise.reason",
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
						key:"promise.overdueReasons",
                        title:"OTHER_REASON",
						type:"textarea",
                        condition:"model.promise.reason=='Others'"
					},
                    {
                        key:"promise.remarks",
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
            },
			submit: function(model, form, formName){
				$log.info("Inside submit()");
				console.warn(model);
				PageHelper.showLoader();

                LoanProcess.p2pUpdate(model.promise, function(response){
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
