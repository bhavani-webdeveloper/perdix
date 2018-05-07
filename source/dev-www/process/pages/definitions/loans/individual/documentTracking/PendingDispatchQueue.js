irf.pageCollection.factory(irf.page("loans.individual.documentTracking.PendingDispatchQueue"), 
    ["$log", "formHelper", "DocumentTracking", "$state", "SessionStore", "Utils","PageHelper","entityManager",
    function($log,formHelper,DocumentTracking,$state,SessionStore,Utils,PageHelper,entityManager) {
        var branch = SessionStore.getBranch();
        var branchId = SessionStore.getCurrentBranch().branchId;
        var localFormCtrl;
        return {
            "type": "search-list",
            "title": "PENDING_FOR_DISPATCH",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.branch = branch;
                model.branchId = branchId;
                localFormCtrl = formCtrl;
                $log.info("Perding for Dispatch page got initiated");
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
                        "customer_name": {
                            "title": "CUSTOMER_NAME",
                            "type": "string"
                        },
                        "Business_name": {
                            "title": "BUSINESS_NAME",
                            "type": "string"
                        },
                        "account_number": {
                            "title": "ACCOUNT_NUMBER",
                            "type": "string"
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
                        "disbursement_date": {
                            "title": "DISBURSEMENT_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date"
                            }
                        },
                        "rejectedAccount": {
                            "title": "REJECTED_ONLY",
                            "type": "boolean",
                            "x-schema-form": {
                                "type": "checkbox"
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
                        'stage': 'BatchInitiation',
                        'branchId': branchId,
                        'centreId': searchOptions.spoke_name,
                        'accountNumber': searchOptions.account_number,
                        'scheduledDispatchDate':searchOptions.disbursement_date,
                        'rejectedAccount':searchOptions.rejectedAccount,
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
                            name: "VIEW_DETAILS",
                            desc: "",
                            icon: "fa fa-eye-slash",
                            fn: function(item, index) {
                                entityManager.setModel('loans.individual.documentTracking.ViewSingleAccountDetails',{"_Account":item});
                                $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.ViewSingleAccountDetails",pageId: item.id});
                            },
                            isApplicable: function(item, index) {
                                return true;
                            }
                        }];
                    },
                    getBulkActions: function() {
                        return [{
                                name: "CREATE_BATCH",
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
                                                $log.info(res);
                                                $log.info(items);

                                                /*entityManager.setModel('loans.individual.documentTracking.PendingDispatch',{"_Accounts":res.accountDocumentTracker});
                                                $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.PendingDispatch",pageId: null});*/
                                                localFormCtrl.submit();
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