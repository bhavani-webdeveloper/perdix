irf.pageCollection.factory(irf.page("loans.individual.writeoff.WriteOffQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "LoanAccount", "entityManager",
function($log, formHelper, Enrollment, $state, SessionStore, $q, LoanAccount, EntityManager){
    return {
        "type": "search-list",
        "title": "PENDING_WRITEOFF_QUEUE",
        "subTitle": "",
        "uri":"Loan WriteOff/Stage 1",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branchName = SessionStore.getBranch();
            model.stage = 'WriteOff';
            console.log(model);
        },

        offline: false,

        definition: {
            title: "SEARCH",
            autoSearch: false,
            sorting:true,
            sortByColumns:{
                "days":"OD Days"
            },
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": "VIEW_LOANS",
                "required":["branch"],
                "properties": {

                    "loan_product": {
                        "title": "Loan Product",
                        "type": "string",
                        "x-schema-form": {
                            "type": "select",
                            "enumCode": "loan_product"
                        }
                    },
                    "branchName": {
                        "title": "BRANCH_NAME",
                        "type": "integer",
                        "x-schema-form": {
                            "type": "select"
                        },
                        "enumCode": "branch_id"
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                return LoanAccount.writeOffQueue({
                    'Branches': searchOptions.branchName
                }).$promise;

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
                },
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.accountId,
                        item.amount1,
                        "<em>Write-off Amount: Rs."+item.amount3+", Interest: Rs."+item.amount2 + "</em>"
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "WRITE_OFF",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                EntityManager.setModel("loans.individual.writeoff.WriteOffExecution",{_loanAccount:item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.writeoff.WriteOffExecution', pageId: item.loanId});
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
