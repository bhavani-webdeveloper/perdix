irf.pageCollection.factory(irf.page('loans.CloseLoan'),
    ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan","LoanCollection",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan,LoanCollection) {
        	

        	var goToQueue = function(){
				return $state.go('Page.Engine', {
					pageName: 'loans.individual.Queue',
					pageId: null
				});
        	}

        	return {
                "type": "schema-form",
                "title": "CLOSE_LOAN",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
					model.loanId = $stateParams.pageId;
                    PageHelper.showLoader();
                    var p1 = IndividualLoan.get({id: model.loanId})
                        .$promise
                        .then(
                            function(res){
                                model.loanAccount = res;
                                if (model.loanAccount.accountNumber==null){
                                    model.loanAccount.accountNumber = "NA";
                                }

                                var urns = [];
                                for (var i=0; i<res.loanCustomerRelations.length;i++){
                                    urns.push(res.loanCustomerRelations[i].urn);
                                }
                                urns.push(res.urnNo);

                                Queries.getCustomerBasicDetails({
                                    urns: urns
                                }).then(
                                    function (resQuery) {
                                        model.loanAccount.customerDetails = resQuery.urns[res.urnNo];
                                        for (var i=0;i<res.loanCustomerRelations.length; i++){
                                            model.loanAccount.loanCustomerRelations[i].customerName = resQuery.urns[model.loanAccount.loanCustomerRelations[i].urn].first_name;
                                        }
                                    },
                                    function (errQuery) {
                                    }
                                );
                        }, function(httpRes){
                            PageHelper.showErrors(httpRes);
                        }
                    )

                    $q.all([p1])
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
				},
				form: [
					{
		                "type": "box",
		                "title": "LOAN_INFORMATION",
		                "items": 
		                [
			                {
			                    key: "loanAccount.accountNumber",
			                    title: "ACCOUNT_NUMBER",
			                    readonly: true,
			                    //type:"amount"
			                },
			                {
			                	key: "loanAccount.currentStage",
			                    title: "CURRENT_STAGE",
			                    readonly: true,
			                    //type:"amount"
			                },
                            {
                                key: "loanAccount.customerDetails.first_name",
                                title: "CUSTOMER_NAME",
                                readonly: true,
                                //type:"amount"
                            },
                            {
                                "type": "array",
                                "key": "loanAccount.loanCustomerRelations",
                                "add": null,
                                "remove": null,
                                "view": "fixed",
                                "titleExpr": "model.loanAccount.loanCustomerRelations[arrayIndex].relation | translate",
                                "items": [
                                    {
                                        "key": "loanAccount.loanCustomerRelations[].customerName",
                                        "type": "string",
                                        "title": "NAME",
                                        "readonly":true
                                    },
                                    {
                                        "key": "loanAccount.loanCustomerRelations[].urn",
                                        "type": "string",
                                        "title": "URN_NO",
                                        "readonly":true
                                    }
                                ]
                            }
	                	]
	           		},
                    {
                        "type": "actionbox",
                        "items": [
                            {
                                "type": "submit",
                                "title": "CLOSE_LOAN"
                            }
                        ]
                    }
                ],
                schema: {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "type": "object",
                    "properties": {
                        "loanAccount": {
                            "type": "object",
                            "properties": {
                                "accountNumber": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                },
                actions: {
                	submit: function(model, form, formName){
                		$log.info("Inside submit()");
                        if (model.loanAccount.currentStage=='Completed'){
                            PageHelper.showProgress('close-loan', 'Loan is already in Completed stage. Cannot be closed.');
                            return false;
                        }
                		Utils.confirm("Are you sure? This action cannot be rolled back")
                			.then(
                				function(){
                					PageHelper.showLoader();
                                    PageHelper.showProgress('loan-close', 'Closing Loan...');
                					var reqData = {
                						loanId: model.loanAccount.id,
                						stage: model.loanAccount.currentStage
                					};
                					IndividualLoan.close(reqData)
                                        .$promise
                						.then(
            								function(res){
            									PageHelper.showProgress("loan-close", 'Done', 2000);
            									return goToQueue();
            								},
            								function(httpRes){
            									PageHelper.showErrors(httpRes);
                                                PageHelper.showProgress('loan-close', 'Oops. An error occured!');
            								}
            							)
            							.finally(function(){
            								PageHelper.hideLoader();
            							})
                				}
            				)

                	}
                }
            }
        }
    ]
);