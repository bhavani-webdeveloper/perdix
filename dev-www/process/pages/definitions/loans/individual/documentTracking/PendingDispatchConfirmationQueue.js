irf.pageCollection.factory(irf.page("loans.individual.documentTracking.PendingDispatchConfirmationQueue"), 
    ["$log", "formHelper", "DocumentTracking", "$state", "SessionStore", "Utils","PageHelper","entityManager",
    function($log,formHelper,DocumentTracking,$state,SessionStore,Utils,PageHelper,entityManager) {
        var branch = SessionStore.getBranch();
        var branchId = SessionStore.getCurrentBranch().branchId;
        return {
            "type": "search-list",
            "title": "Pending_For_Dispatch",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.branch = branch;
                $log.info("Perding for Dispatch page got initiated");
            },
            definition: {
                title: "Search Customers",
                searchForm: [
                    "*"
                ], 
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "customer_name": {
                            "title": "CUSTOMER_NAME",
                            "type": "string"
                        },
                        "Business_name": {
                            "title": "Business_NAME",
                            "type": "string"
                        },
                        "Loan_id": {
                            "title": "LOAN_ID",
                            "type": "string"
                        },

                        "spoke_name": {
                            "title": "SPOKE_NAME",
                            "type": "string",
                            "enumCode": "centre",
                            "x-schema-form": {
                                "type": "select",
                                "filter": {
                                    "parentCode as branch": "model.branch"
                                },
                                "screenFilter": true
                            }
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

                    var promise = DocumentTracking.search({
                        'stage': 'BatchConfirmation',
                        'branchId': branchId,
                        'centerId': searchOptions.spoke_name,
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
                            name: "View Details",
                            desc: "",
                            icon: "fa fa-eye-slash",
                            fn: function(item, index) {
                                entityManager.setModel('loans.individual.documentTracking.ViewAccountDetails',{"_Account":item});
                                $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.ViewAccountDetails",pageId: item.id});
                            },
                            isApplicable: function(item, index) {
                                return true;
                            }
                        }];
                    },
                    getBulkActions: function() {
                        return [{
                                name: "Create Batch",
                                desc: "",
                                icon: "fa fa-plus",
                                fn: function(items) {
                                    if(items.length==0){
                                        PageHelper.showProgress("bulk-create","Atleast one loan should be selected for Batch creation",5000);
                                        return false;
                                    }
                                    Utils.confirm(items.length + " Loan selected. Do you wish to create a new Batch?").then(function(){
                                        var accountDocumentTracker=[];
                                        for (i=0; i<items.length; i++){
                                            accountDocumentTracker[i] = items[i];
                                        }
                                        var reqData = {accountDocumentTracker: accountDocumentTracker};
                                        reqData.accountDocumentTrackingAction = "PROCEED";
                                        $log.info(reqData);
                                        PageHelper.showLoader();
                                        PageHelper.showProgress("create-batch", "Working...");
                                        DocumentTracking.create(reqData)
                                            .$promise
                                            .then(function(res){
                                                PageHelper.showProgress("create-batch", "Done.", 3000);
                                                entityManager.setModel('loans.individual.documentTracking.PendingDispatch',{"_Accounts":items});
                                                $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.PendingDispatch",pageId: null});
                                            }, function(httpRes){
                                                PageHelper.showProgress("create-batch", "Oops. Some error occured.", 3000);
                                                PageHelper.showErrors(httpRes);
                                            })
                                            .finally(function(){
                                                PageHelper.hideLoader();
                                            })
                                    })
                                },
                                isApplicable: function(items) {
                                    return true;
                                }
                            }
                        ];
                    }
                }
            }
        };
    }
]);