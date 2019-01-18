define({
    pageUID: "loans.individual.collections.PreDepositQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "$state", "SessionStore", "Utils", "irfNavigator", "Queries","LoanCollection","PageHelper"],
    $pageFn: function($log, formHelper, $state, SessionStore, Utils, irfNavigator, Queries, LoanCollection,PageHelper) {
        return {
            "type": "search-list",
            "title": "PRE_DEPOSIT_QUEUE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Branch Deposit queue is initialised");
                model.branchName = SessionStore.getCurrentBranch().branchId;
                var centres = SessionStore.getCentres();
                model.centreName = Number(centres[0].centreCode);
                              
            },
            definition: {
                title: "SEARCH",
                searchForm: [
                    "*"
                ],
                autoSearch: false,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "branchName": {
                            "title": "Branch Name",
                            "readonly":true,
                            "type": ["integer", "null"],
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "centreName": {
                            "title": "Spoke Name",
                            "type": ["integer", "null"],
                            "enumCode": "centre",
                            "x-schema-form": {
                                "parentEnumCode": "branch_id",
                                "parentValueExpr": "model.branchName",
                                "type": "select",
                                "screenFilter": true
                            }
                        },
                        "instrument": {
                            "title": "Instrument Type",
                            "required":true,
                            "type": ["string", "null"],
                            "enumCode": "instrument_type3",
                            "x-schema-form": {
                                "type": "select",
                                "screenFilter": true
                            }
                        }
                    },
                    "required": []
                },

                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    let temp = searchOptions.instrument;
                    if(searchOptions.instrument == "Cheque")
                        temp = 'CHQ';
                    var promise=LoanCollection.query({
                        'currentStage':"PreDeposit",
                        'accountBranchId': searchOptions.branchName,
                        'accountCentreId': searchOptions.centreName,
                        'instrumentType': temp,
                        'page': pageOpts.pageNo,
	                    'per_page': pageOpts.itemsPerPage
                    }).$promise;

                    return promise;
                },
                paginationOptions: {
                    "getItemsPerPage": function(response, headers) {
                        return 100;
                    },
                    "getTotalItemsCount": function(response, headers) {
                        return headers['x-total-count']
                    }
                },
                listOptions: {
                    selectable: true,
                    expandable: true,
                    listStyle: "table",
                    itemCallback: function(item, index) {},
                    getItems: function(response, headers) {
                        if (response != null && response.length && response.length != 0) {
                            return response;
                        }
                        return [];
                    },
                    getListItem: function(item) {
                        return [
                            item.id
                        ]
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function() {
                        return [
                            {
                                title: 'Date',
                                data: 'repaymentDate'
                            },
                            {
                                title: 'BRANCH_NAME',
                                data: 'branchName'
                            },
                            {
                                title: 'SPOKE_NAME',
                                data: 'centreName'
                            },
                            {
                                title: 'BUSINESS_NAME',
                                data: 'customerName'
                            },
                            {
                                title: 'INSTRUMENT_TYPE',
                                data: 'instrumentType'
                            },
                            {
                                title: "LOAN_ACCOUNT_NO",
                                data: "accountNumber"
                            },
                            {
                                title: "COLLECTED_AMOUNT",
                                data: "repaymentAmount"
                            }
                        ]
                    },
                    getActions: function() {
                        return [];
                    },
                    getBulkActions: function() {
						return [{
							name: "Submit",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(items) {
                        /* Validation for cheque and cash instrument types :
                            1) At a time only one cheque should be selected , 
                            2) cash and cheque can not be selected together
                        */
								if (items.length == 0) {
									PageHelper.showProgress("bulk-selected", "Atleast one Branch Deposit detail should be selected", 5000);
									return false;
                                }
                                var countCHQ=0;
                                _.each(items, function(loanCollection){
                                        if(loanCollection.instrumentType=='CHQ'){
                                            countCHQ ++;
                                        }
                                        if(countCHQ >1)
                                            return countCHQ;
                                });
                                if(countCHQ>1) {
                                    PageHelper.showProgress("bulk-selected", "Only one Cheque Details can be selected at a time ", 5000);
                                    return false;
                                }
                                if(countCHQ==1 && items.length>1){
                                    PageHelper.showProgress("bulk-selected", "Cheque and Cash can not be selected together", 5000);
									return false;
                                };
                                irfNavigator.go({
                                    'state': 'Page.Engine',
                                    'pageName': 'loans.individual.collections.PreDepositDetail',
                                    'pageData': items
                                });
							},
							isApplicable: function(items) {
								return true;
							}
						}];
					}
                }
            }
        };
    }
})
