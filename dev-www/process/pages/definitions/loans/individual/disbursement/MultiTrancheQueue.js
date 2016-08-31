irf.pageCollection.factory(irf.page("loans.individual.disbursement.MultiTrancheQueue"),
["$log", "formHelper", "IndividualLoan", "$state", "SessionStore", "$q",
function($log, formHelper, IndividualLoan, $state, SessionStore,$q){
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
            title: "Choose Loan Type",
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
                    'currentStage': model.stage,
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
                itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name,
                        "Rs."+item.loan_amount+" | Sanction Date:"+item.sanction_date,
                        item.Tranche                        
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Book Loan",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        }
                    ];
                }
            }
        }
    };
}]);
