define({
    pageUID: "loans.individual.collections.RejectedQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "$state", "SessionStore", "Utils", "irfNavigator", "Queries","LoanCollection","PageHelper"],
    $pageFn: function($log, formHelper, $state, SessionStore, Utils, irfNavigator, Queries, LoanCollection,PageHelper) {
        return {
            "type": "search-list",
            "title": "REJECTED_QUEUE_COLLECTION",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Branch Deposit queue is initialised");
                model.branch = SessionStore.getCurrentBranch().branchId;
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
						'branch': {
                            'title': "BRANCH",
                            'readonly':true,
	                    	"type": ["string", "null"],
							"x-schema-form": {
								"type":"userbranch",
								"screenFilter": true
							}
	                    },
                        "centre": {
							"title": "CENTRE",
							"type": ["integer", "null"],
							"x-schema-form": {
								"type": "select",
								"enumCode": "centre",
								"parentEnumCode": "branch",
								"parentValueExpr": "model.branch",
								"screenFilter": true
							}
                        },
                        "reference":{
                            "title": "REFERENCE_NUMBER",
                            "type": ["string","null"],
                            "x-schema-form": {
								"type": ["string","null"],
							}
                        },
                        "enterpriseName":{
                            "title": "ENTERPRISE_NAME",
                            "type": ["string","null"],
                            "x-schema-form":{
                                "type":["string","null"]
                            }

                        },
                        "instrument": {
                            "title": "Instrument Type",
                            "type": ["string", "null"],
                            "enumCode": "instrument_type5",
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
                    var temp=null;
                    if(typeof(searchOptions.instrument)!= 'undefined' && searchOptions.instrument !='Cheque')
                        temp=searchOptions.instrument;
                    else if(searchOptions.instrument == "Cheque")
                        temp = 'CHQ';
                    var promise = LoanCollection.query({
                        'currentStage': "Rejected",
                        'reference':searchOptions.reference,
                        'accountBranchId': searchOptions.branch,
                        'accountCentreId': searchOptions.centre,
                        'instrumentType': temp,
                        'customerName':searchOptions.enterpriseName
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
                    selectable: false,
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
                                title: "Reference",
                                data:"reference"
                            },
                            {
                                title: 'BUSINESS_NAME',
                                data: 'customerName'
                            },
                            {
                                title: 'INSTRUMENT_TYPE',
                                data: 'instrumentType'
                            }
                        ]
                    },
                    getActions: function() {
                        return [{
                            name: "Update",
                            desc: "",
                            icon: "fa fa-edit",
                            fn: function(item, model) {
                                PageHelper.showLoader();
                                var reqData = {
                                    "loanCollection":item,
                                    "repaymentProcessAction": "PROCEED",
                                    "stage": "RejectedProcess" 
                                };
                                LoanCollection.update(reqData,function(resp, header){
                                    PageHelper.showProgress('RejectedQueue', 'successfully changed to REJECTED-PROCESS', 5000);
                                    PageHelper.hideLoader();
                                    irfNavigator.goBack();
                                },function(resp){
                                    PageHelper.showErrors(resp);
                                }).$promise.finally(function(){
                                    PageHelper.hideLoader();
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

