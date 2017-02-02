irf.pageCollection.factory(irf.page("loans.individual.documentTracking.BatchInTransitQueue"), 
    ["$log", "formHelper", "DocumentTracking", "$state", "SessionStore", "Utils","PageHelper","entityManager",
    function($log,formHelper,DocumentTracking,$state,SessionStore,Utils,PageHelper,entityManager) {
        var branch = SessionStore.getBranch();
        var branchId = SessionStore.getCurrentBranch().branchId;
        return {
            "type": "search-list",
            "title": "BATCH_IN_TRANSIT",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.branch = branch;
                $log.info("Batch in Transit page got initiated");
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
                            "title": "BRANCH_ID",
                            "type": "string"
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
                        "courierDate": {
                            "title": "DISPATCH_DATE",
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
                        'stage': 'BatchInTransit',
                        'branchId': null,
                        'batchNumber': searchOptions.batchNumber,
                        'courierName': searchOptions.courierName,
                        'courierNumber': searchOptions.courierNumber,
                        'courierDate': searchOptions.courierDate,
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
                            title: 'BRANCH_NAME',
                            data: 'branchId'
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
                            title: 'DISPATCH_DATE',
                            data: 'courierDate'
                        }]
                    },
                    getActions: function() {
                        return [];
                    },
                    getBulkActions: function() {
                        return [{
                                name: "Accept POD",
                                desc: "",
                                icon: "fa fa-registered",
                                fn: function(items) {
                                    if(items.length==0){
                                        PageHelper.showProgress("bulk-process","Atleast one Batch should be selected",5000);
                                        return false;
                                    }
                                    if(items.length>1){
                                        PageHelper.showProgress("bulk-process","Only one Batch should be selected",5000);
                                        return false;
                                    }
                                    Utils.confirm("Do you wish to Accept the selected Batch?").then(function(){
                                    	var accountDocumentTracker=[];
                                    	PageHelper.showLoader();
                                        DocumentTracking.getBatch({batchNumber:items[0].batchNumber})
                                        .$promise
                                        .then(function(resp){
                                        	accountDocumentTracker = resp;
                                            if(accountDocumentTracker && accountDocumentTracker.length){
                                                for(i=0;i<accountDocumentTracker.length;i++){
                                                    accountDocumentTracker[i].receiveDate = Utils.getCurrentDate();
                                                }
                                            }
                                        	var reqData = {accountDocumentTracker: accountDocumentTracker};
                                        	reqData.accountDocumentTrackingAction = "PROCEED";
                                        	$log.info(reqData);
                                        	PageHelper.showProgress("process-batch", "Working...");
                                        	DocumentTracking.create(reqData)
                                        	.$promise
                                        	.then(function(res){
                                        		PageHelper.showProgress("process-batch", "Batch marked as Received", 3000);
                                                $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.BatchInTransitQueue",pageId: null});
                                            }, function(httpRes){
                                                PageHelper.showProgress("process-batch", "Oops. Some error occured.", 3000);
                                                PageHelper.showErrors(httpRes);
                                            })
                                        }, function(errResp){
                                        	PageHelper.showProgress("process-batch", "Oops. Some error occured while fetching the Batch details.", 3000);
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