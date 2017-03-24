irf.pageCollection.factory(irf.page("loans.individual.documentTracking.PendingFilingQueue"), 
    ["$log", "formHelper", "DocumentTracking", "$state", "SessionStore", "Utils","PageHelper","entityManager",
    function($log,formHelper,DocumentTracking,$state,SessionStore,Utils,PageHelper,entityManager) {
        var branch = SessionStore.getBranch();
        var branchId = SessionStore.getCurrentBranch().branchId;
        return {
            "type": "search-list",
            "title": "QUALITY_CHECK_QUEUE",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.branch = branch;
                model.branchId = branchId;
                $log.info("Perding for Filing page got initiated");
            },
            definition: {
                title: "SEARCH_LOAN",
                searchForm: [
                    "*"
                ], 
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "branchId": {
                            "title": "BRANCH_NAME",
                            "type": ["integer", "null"],
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "spoke_name": {
                            "title": "SPOKE_NAME",
                            "type": ["integer", "null"],
                            "enumCode": "centre",
                            "parentEnumCode": "branch_id",
                            "x-schema-form": {
                                "type": "select",
                                "parentValueExpr": "model.branchId"
                            }
                        },
                        "customer_name": {
                            "title": "CUSTOMER_NAME",
                            "type": "string"
                        },
                        "business_name": {
                            "title": "BUSINESS_NAME",
                            "type": "string"
                        },
                        "account_number": {
                            "title": "ACCOUNT_NUMBER",
                            "type": "string"
                        },
                        "disbursement_date": {
                            "title": "DISBURSEMENT_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date"
                            }
                        }

                    },
                    "required": []
                },

                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) { 
                    console.log("searchOptions");

                    var promise = DocumentTracking.search({
                        'stage': 'PendingFiling',
                        'branchId': searchOptions.branchId,
                        'centreId': searchOptions.spoke_name,
                        'customerName':searchOptions.business_name,
                        'accountNumber':searchOptions.account_number,
                        'scheduledDispatchDate':searchOptions.disbursement_date,
                        'page': pageOpts.pageNo,
                        'itemsPerPage': pageOpts.itemsPerPage
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
                        return [];
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function() {
                        return [{
                            title: 'APPLICANT_NAME',
                            data: 'applicantName'
                        }, {
                            title: 'ENTITY_NAME',
                            data: 'customerName'
                        }, {
                            title: 'ACCOUNT_NUMBER',
                            data: 'accountNumber'
                        }, {
                            title: 'BRANCH',
                            data: 'branchName'
                        }, {
                            title: 'CENTRE_NAME',
                            data: 'centreName'
                        }, {
                            title: 'DISBURSEMENT_DATE',
                            data: 'scheduledDisbursementDate'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "File Account",
                            desc: "",
                            icon: "fa fa-eye-slash",
                            fn: function(item, index) {
                                entityManager.setModel('loans.individual.documentTracking.FileSingleAccountDetails',{"_Account":item});
                                $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.FileSingleAccountDetails",pageId: item.id});
                            },
                            isApplicable: function(item, index) {
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
]);