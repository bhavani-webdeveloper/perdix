define({
    pageUID: "loans.individual.collections.CollectionDepositQueue",
    pageType: "Engine",
    dependencies: ["$log", "$q", "formHelper", "$state", "SessionStore", "Utils", "irfNavigator", "Queries","LoanCollection","PageHelper"],
    $pageFn: function($log, $q, formHelper, $state, SessionStore, Utils, irfNavigator, Queries, LoanCollection,PageHelper) {
        return {
            "type": "search-list",
            "title": "COLLTN_DEPOSIT_QUEUE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Deposit queue is initialised");
                model.branchName = SessionStore.getCurrentBranch().branchId;
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
                        "depositId": {
                            "title": "Deposit_ID",
                            "type": ["integer", "null"]
                        },
                        "instrument": {
                            "title": "Instrument Type",
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
                    var deferred = $q.defer();
                    var out=[];
                    if(searchOptions.instrument && searchOptions.instrument.toLowerCase() == 'cash'){
                        LoanCollection.fetchDepositSummary({
                            'currentStage': "Deposit",
                            'branchName' : searchOptions.branchName,
                            'depositId': searchOptions.depositId,
                            'instrumentType': "CASH"
                        }, function(res, headers) {
                            _.each(res,function(data){
                                out.push({
                                    repaymentAmount : data.totalAmount,
                                    depositId : data.depositId,
                                    repaymentDate : data.createdDate,
                                    branchName : searchOptions.branchName,
                                    instrumentType : "CASH"
                                })
                            })
                            PageHelper.hideLoader();
                            deferred.resolve({
                                headers: {
                                    "x-total-count": out.length
                                },
                                body: out
                            });
                        }, function(res, headers){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('loan-Collection', 'Error in getting Data', 2000);
                            PageHelper.showErrors(res);
                            deferred.reject(res);
                        });

                    }else if(searchOptions.instrument && searchOptions.instrument.toLowerCase() == 'cheque'){
                        LoanCollection.query({
                            'currentStage':"Deposit",
                            'accountBranchId': searchOptions.branchName,
                            'chequeDepositId': searchOptions.depositId,
                            'instrumentType': "CHQ"
                        }, function(res, headers) {
                            _.each(res.body, function(data){
                                out.push({
                                    repaymentAmount : data.repaymentAmount,
                                    depositId : data.chequeDepositId,
                                    repaymentDate : data.repaymentDate,
                                    branchName : data.branchName,
                                    instrumentType : "CHQ"
                                })
                            })
                            PageHelper.hideLoader();
                            deferred.resolve({
                                headers: {
                                    "x-total-count": out.length
                                },
                                body: out
                            });
                        }, function(res, headers){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('loan-Collection', 'Oops. Some error.', 2000);
                            PageHelper.showErrors(res);
                            deferred.reject(res);
                        });

                    }else if(!searchOptions.instrument){
                        
                    }
                    

                    return deferred.promise;
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
                                title: 'INSTRUMENT_TYPE',
                                data: 'instrumentType'
                            },
                            {
                                title: 'DEPOSIT_ID',
                                data: "depositId"
                            },
                            {
                                title: "Collected Amount",
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
                                    'pageName': 'loans.individual.collections.DepositStageDetail',
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
