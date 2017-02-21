irf.pageCollection.factory(irf.page("loans.individual.disbursement.EMIScheduleGenQueue"),
["$log", "formHelper", "IndividualLoan", "$state", "SessionStore", "$q","entityManager",
function($log, formHelper, IndividualLoan, $state, SessionStore,$q,entityManager){
    return {
        "type": "search-list",
        "title": "EMI_SCH_GEN_QUEUE",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
            model.stage = 'DocumentUpload';
            model.branchId = SessionStore.getCurrentBranch().branchId;
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
                    'currentStage': 'DocumentUpload',
                    'customerSignatureDate': null,
                    'scheduledDisbursementDate': null,
                    'page': 1,
                    'per_page': 100,
                    'sortBy':null,
                    'branchId': searchOptions.branchId
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
                            name: "{{'UPLOAD_DOCUMENT'|translate}}",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.disbursement.GenerateEMISchedule',{"_EMIScheduleGenQueue":item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.GenerateEMISchedule', pageId: item.id});
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
