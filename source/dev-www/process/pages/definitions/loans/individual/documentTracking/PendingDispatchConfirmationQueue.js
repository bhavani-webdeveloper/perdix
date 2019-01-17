irf.pageCollection.factory(irf.page("loans.individual.documentTracking.PendingDispatchConfirmationQueue"), 
    ["$log", "formHelper", "DocumentTracking", "$state", "SessionStore", "Utils","PageHelper","entityManager",
    function($log,formHelper,DocumentTracking,$state,SessionStore,Utils,PageHelper,entityManager) {
        var branch = SessionStore.getBranch();
        var branchId = SessionStore.getCurrentBranch().branchId;
        var localFormCtrl;
        return {
            "type": "search-list",
            "title": "Pending_For_Dispatch",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.branch = branch;
                model.branchId = branchId;
                localFormCtrl = formCtrl;
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
                        "branchId": {
                            "title": "BRANCH_NAME",
                            "type": ["integer", "null"],
                            "enumCode": "branch_id",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "batchNumber": {
                            "title": "BATCH_NUMBER",
                            "type": "string"
                        }

                    },
                    "required": []
                },

                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) { 

                    var promise = DocumentTracking.findBatches({
                        'stage': 'BatchConfirmation',
                        'branchId': searchOptions.branchId,
                        'batchNumber': searchOptions.batchNumber,
                        'courierName': null,
                        'courierNumber': null,
                        'courierDate': null,
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
                            title: 'BRANCH_NAME',
                            data: 'branchName'
                        }, {
                            title: 'BATCH_NUMBER',
                            data: 'batchNumber'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "Update",
                            desc: "",
                            icon: "fa fa-eye-slash",
                            fn: function(item, index) {
                                $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.PendingDispatch",pageId: item.batchNumber});
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