irf.pageCollection.factory(irf.page("loans.individual.reversal.Search"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "LoanAccount",
function($log, formHelper, Enrollment, $state, SessionStore, $q, LoanAccount){
    return {
        "type": "search-list",
        "title": "SEARCH_TRANSACTIONS",
        "subTitle": "",
        "uri":"REVERSAL/Stage 1",
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
                "account":"Account Number"
            },
            searchForm: [
                "*"
            ],
            searchSchema: {
                "type": 'object',
                "title": "VIEW_TRANSACTIONS",
                "required":["accountNumber"],
                "properties": {

                    "accountNumber": {
                        "title": "ACCOUNT_NUMBER",
                        "type": "string"
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                return LoanAccount.reversalSearch({
                    'Accounts': searchOptions.accountNumber
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
                        item.accountNumber,
                        item.customerName,
                        "<em>Transaction Amount: Rs."+item.writeOffAmount+", Transaction Date: "+item.writeOffDate + "</em>"
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "REVERSE",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'loans.individual.reversal.reversalExecution', pageId: item.loanId});
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
