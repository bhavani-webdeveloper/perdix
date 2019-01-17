irf.pageCollection.factory(irf.page("loans.individual.writeoff.WriteOffQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "LoanAccount", "entityManager",
function($log, formHelper, Enrollment, $state, SessionStore, $q, LoanAccount, EntityManager){
    return {
        "type": "search-list",
        "title": "PENDING_WRITEOFF_QUEUE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");            
            model.branch = SessionStore.getCurrentBranch().branchId;
            model.stage = 'WriteOff';
            console.log(model);
        },

        offline: false,

        definition: {
            title: "SEARCH",
            autoSearch: false,
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": "VIEW_LOANS",
                "required":["branch"],
                "properties": {
                    'branch': {
                        'title': "BRANCH",
                        "required":true,
                        "type": ["string", "null"],
                        "x-schema-form": {
                            "type":"userbranch",
                            "screenFilter": true
                        }
                    },
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                return LoanAccount.writeOffQueue({
                    'Branches': searchOptions.branch
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
                        "<em>Account ID:" + item.accountId, //+ " | Customer Name:" + item.customerName + " | Customer URN:" + item.description + "</em>",
                        "<em>Total Demand Due:" + item.amount1 + " | Principal Due:" + item.part1 ,// + " | Interest Due:" + item.part2 + "</em>",
                        "<em>Product Code:" + item.param1 + "</em>"
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
