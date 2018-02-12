irf.pageCollection.factory(irf.page("loans.individual.disbursement.LOCDisbursementQueue"),
["$log", "formHelper", "IndividualLoan", "$state", "SessionStore", "$q","entityManager",
function($log, formHelper, IndividualLoan, $state, SessionStore,$q,entityManager){
    return {
        "type": "search-list",
        "title": "LOC_DISBURSEMENT_QUEUE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
            model.stage = 'LOCDisbursement';
        },
        definition: {
            title: "SEARCH_CONDITION",
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
                    "branch_name": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre_name": {
                        "title": "CENTRE_NAME",
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
                    'currentStage': 'LOCDisbursement',
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
                            name: "{{'UPDATE'|translate}}",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.disbursement.LOCDisbursement',{"_LOCDisbursementQueue":item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.LOCDisbursement', pageId: item.id});
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
