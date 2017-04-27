define({
    pageUID: "loans.individual.disbursement.MultiTrancheBookingQueue",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "IndividualLoan", "$state", "SessionStore", "$q","entityManager"],
    $pageFn: function($log, formHelper, IndividualLoan, $state, SessionStore,$q,entityManager){
        return {
            "type": "search-list",
            "title": "MULTI_TRANCHE_BOOKING_QUEUE",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                $log.info("search-list sample got initialized");
                model.branch = SessionStore.getBranch();
                model.branchId = SessionStore.getCurrentBranch().branchId;
            },
            definition: {
                title: "SEARCH",
                autoSearch: true,
                sorting:true,
                sortByColumns:{
                    "name":"Customer Name",
                    "centre_name":"Centre",
                    "sanction_date":"Sanction Date"
                },
                searchForm: [
                    "*"
                ],
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "required":["branch"],
                    "properties": {
                        "customer_name": {
                            "title": "Customer Name",
                            "type": "string",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "entity_name": {
                            "title": "Entity Name",
                            "type": "string",
                            "x-schema-form": {
                                "type": "select"
                            }
                        },
                        "sanction_date": {
                            "title": "Sanction Date",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date"
                            }
                        },
                        "branchId": {
                            "title": "BRANCH",
                            "type": "integer",
                            "enumCode": "branch_id",
                            "readonly": true,
                            "x-schema-form": {
                                "type": "select"
                            }
                        }
                    }
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts){
                    var promise = IndividualLoan.searchDisbursement({
                        'currentStage': 'MTBooking',
                        'customerSignatureDate': null,
                        'scheduledDisbursementDate': null,
                        'page': 1,
                        'per_page': 100,
                        'sortBy':null,
                        //'branchId': searchOptions.branchId
                    }).$promise;

                    return promise;
                },
                paginationOptions: {
                    "viewMode": "page",
                    "getItemsPerPage": function(response, headers){
                        return 20;
                    },
                    "getTotalItemsCount": function(response, headers){
                        return headers['x-total-count']
                    }
                },
                listOptions: {
                    expandable: true,
                    getItems: function(response, headers){
                        if (response!=null && response.length && response.length!=0){
                            return response;
                        }
                        return [];
                    },
                    getListItem: function(item){
                        return [
                            item.customerName + " ( Account #: "+item.accountNumber+")",
                            "<em>Disbursed Amount:  &#8377;"+(_.isEmpty(item.disbursedAmount)?0:item.disbursedAmount)+", Disbursement Amount :  &#8377;"+item.disbursementAmount+"</em>",
                            "{{'TRANCHE'|translate}} : &#8377;" + item.trancheNumber
                        ]
                    },
                    getActions: function(){
                        return [
                            {
                                name: "{{'CAPTURE_DISBURSEMENT_DATE'|translate}}",
                                desc: "",
                                fn: function(item, index){
                                    $log.info("Redirecting");
                                    $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.MultiTrancheBooking', pageId: item.id, pageData: item});
                                },
                                isApplicable: function(item, index){
                                    return true;
                                }
                            }
                        ];
                    }
                }
            }
        };
    }
});
