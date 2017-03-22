irf.pageCollection.factory(irf.page("loans.individual.collections.CreditValidationQueue"),
["$log", "formHelper", "LoanCollection", "$state", "SessionStore", "$q", "entityManager",
function($log, formHelper, LoanCollection, $state, SessionStore, $q, entityManager){
    return {
        "type": "search-list",
        "title": "CREDIT_VALIDATION_QUEUE",
        //"subTitle": "T_ENROLLMENTS_PENDING",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
        },
        definition: {
            title: "SEARCH_PAYMENTS",
            searchForm: [
                {
                    "key": "accountNumber"
                },
                {
                    "key": "branch_id",
                    "type": "select"
                },
                {
                    "key": "centre",
                    "type": "select",
                    "parentEnumCode": "branch_id"
                }
            ],
            autoSearch:false,
            searchSchema: {
                "type": 'object',
                "title": 'SEARCH_OPTIONS',
                "required":[],
                "properties": {
                    "accountNumber": {
                        "title": "LOAN_ACCOUNT_NUMBER",
                        "type": "string",
                        "pattern": "^[0-9a-zA-Z]+$"
                    },
                    "branch_id": {
                        "title": "BRANCH_NAME",
                        "type": ["null", "number"],
                        "enumCode": "branch_id"
                    },
                    "centre": {
                        "title": "CENTRE",
                        "type": ['null', 'number'],
                        "enumCode": "centre"
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = LoanCollection.query({
                    'currentStage':"CreditValidation",
                    'accountCentreId': searchOptions.centre,
                    'accountBranchId': searchOptions.branch_id,
                    'accountNumber': searchOptions.accountNumber
                }).$promise;

                return promise;
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers && headers['x-total-count']
                }
            },
            listOptions: {
                expandable:true,
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.customerName,
                        'Loan Number: ' + item.accountNumber,
                        'Amount Due: ' + item.demandAmount,
                        'Amount Paid: ' + item.repaymentAmount,
                        'Payment Type: ' + item.instrumentType
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Credit Validation",
                            desc: "",
                            fn: function(item, index){
                                entityManager.setModel('loans.individual.collections.CreditValidation', {_credit:item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.CreditValidation', pageId: item.accountNumber});
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
