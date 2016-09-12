irf.pageCollection.factory(irf.page("loans.individual.disbursement.MultiTrancheQueue"),
["$log", "formHelper", "IndividualLoan", "$state", "SessionStore", "$q","entityManager",
function($log, formHelper, IndividualLoan, $state, SessionStore,$q,entityManager){
    return {
        "type": "search-list",
        "title": "MULTI_TRANCHE_QUEUE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
            model.stage = 'MTDisbursementDataCapture';
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
                    "branch_name": {
                        "title": "Branch Name",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre_name": {
                        "title": "Centre Name",
                        "type": "string",
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
                    'currentStage': 'MTDisbursementDataCapture',
                    'customerSignatureDate': null,
                    'scheduledDisbursementDate': null,
                    'page': 1,
                    'per_page': 100,
                    'sortBy':null
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
                            name: "{{'CAPTURE_DISBURSEMENT'|translate}}",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.disbursement.MultiTranche',{"_MTQueue":item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.MultiTranche', pageId: item.id});
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
}]);
