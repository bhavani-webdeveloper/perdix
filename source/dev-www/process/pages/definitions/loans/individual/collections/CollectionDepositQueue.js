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
                            "required": true,
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
                    var branchName=SessionStore.getCurrentBranch().branchName;
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
                                    branchName : branchName,
                                    instrumentType : "CASH",
                                    id : data.id,
                                    challanFileId: data.challanFileId,
                                    collectionDetail: data
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
                            PageHelper.showProgress("deposit-queue", "Error in getting data", 5000);
                            PageHelper.showErrors(res);
                            deferred.reject(res);
                        });

                    }else if(searchOptions.instrument && (searchOptions.instrument.toLowerCase() == 'cheque' || searchOptions.instrument.toLowerCase() == 'chq')){
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
                                    branchName : branchName,
                                    instrumentType : "CHQ",
                                    id : data.id,
                                    challanFileId: data.challanFileId,
                                    collectionDetail: data
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
                            PageHelper.showProgress("Deposit-queue", "Error in getting data", 5000);		
                            PageHelper.showErrors(res);
                            deferred.reject(res);
                        });

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
                                data: 'repaymentDate',
                                render: function(data, type, full, meta) {
                                    var yourDate = new Date(data);
                                    return yourDate.toISOString().slice(0, 10)
                                }
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
                                title: "COLLECTED_AMOUNT",
                                data: "repaymentAmount"
                            }
                        ]
                    },
                    getActions: function() {
                        return [{
                            name: "Submit",
                            desc: "",
                            icon: "fa fa-check-square-o",
                            fn: function(item, model) {
                                irfNavigator.go({
                                    'state': 'Page.Engine',
                                    'pageName': 'loans.individual.collections.DepositStageDetail',
                                    'pageData': item
                                });
                            },
                            isApplicable: function(item, model) {
                                return true;
                            }
                        }];
                    },
                    getBulkActions: function() {
						return [];
					}
                }
            }
        };
    }
})
