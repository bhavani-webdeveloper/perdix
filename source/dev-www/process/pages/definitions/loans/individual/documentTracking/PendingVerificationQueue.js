irf.pageCollection.factory(irf.page("loans.individual.documentTracking.PendingVerificationQueue"), 
    ["$log", "formHelper", "DocumentTracking", "$state", "SessionStore", "Utils","PageHelper","entityManager",
    function($log,formHelper,DocumentTracking,$state,SessionStore,Utils,PageHelper,entityManager) {
        var branch = SessionStore.getBranch();
        var branchId = SessionStore.getCurrentBranch().branchId;
        return {
            "type": "search-list",
            "title": "PENDING_FOR_VERIFICATION",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.branch = branch;
                $log.info("Pending for Verification page got initiated");
            },
            definition: {
                title: "SEARCH_BATCH",
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
                        },
                        "courierName": {
                            "title": "COURIER_NAME",
                            "type": "string"
                        },
                        "courierNumber": {
                            "title": "POD_NO",
                            "type": "string"
                        },
                        "receiveDate": {
                            "title": "RECEIVED_DATE",
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
                    var promise = DocumentTracking.findBatches({
                        'stage': 'PendingVerification',
                        'branchId': searchOptions.branchId,
                        'batchNumber': searchOptions.batchNumber,
                        'courierName': searchOptions.courierName,
                        'courierNumber': searchOptions.courierNumber,
                        'receiveDate': searchOptions.receiveDate,
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
                        }, {
                            title: 'COURIER_NAME',
                            data: 'courierName'
                        }, {
                            title: 'POD_NO',
                            data: 'courierNumber'
                        }, {
                            title: 'RECEIVED_DATE',
                            data: 'receiveDate'
                        }]
                    },
                    getActions: function() {
                        return [{
                            name:"Verify Batch",
                            desc:"",
                            icon:"fa fa-registered",
                            fn: function(item){
                                $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.ViewAccountDetails",pageId: item.batchNumber});
                            },
                            isApplicable: function(item, index) {
                                return true;
                            }
                        }];
                    },
                    getBulkActions: function() {
                        return [
                        ];
                    }
                }
            }
        };
    }
]);