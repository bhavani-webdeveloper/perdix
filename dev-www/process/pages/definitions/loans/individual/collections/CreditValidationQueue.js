irf.pageCollection.factory(irf.page("loans.individual.collections.CreditValidationQueue"),
["$log", "formHelper", "LoanProcess", "$state", "SessionStore", "$q", "entityManager",
function($log, formHelper, LoanProcess, $state, SessionStore, $q, entityManager){
    return {
        "type": "search-list",
        "title": "CREDIT_VALIDATION_QUEUE",
        //"subTitle": "T_ENROLLMENTS_PENDING",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
        },
        definition: {
            title: "SEARCH_PAYMENTS",
            searchForm: [
                "*"
            ],
            autoSearch:false,
            searchSchema: {
                "type": 'object',
                "title": 'SEARCH_OPTIONS',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "LOAN_ACCOUNT_NUMBER",
                        "type": "string"
                    },
                    "first_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                    },
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": ["null", "string"],
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre": {
                        "title": "CENTRE",
                        "type": ['null', 'number'],
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "filter": {
                                "parentCode as branch": "model.branch"
                            }
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var promise = LoanProcess.repaymentList({
                    'branchName': searchOptions.branch,
                    'centre': searchOptions.centre,
                    'customerName': searchOptions.first_name,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    'status': "Pending"
                }).$promise;

                return promise;
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 3;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count']
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
                        'Amount Due: ' + item.demandAmountInPaisa/100,
                        'Payment Type:' + item.paymentType
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
