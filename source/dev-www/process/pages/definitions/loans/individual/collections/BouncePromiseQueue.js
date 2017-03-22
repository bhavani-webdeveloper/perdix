irf.pageCollection.factory(irf.page("loans.individual.collections.BouncePromiseQueue"),
["$log", "entityManager", "formHelper", "LoanProcess", "$state", "SessionStore", "$q","Utils",
function($log, entityManager, formHelper, LoanProcess, $state, SessionStore,$q,Utils){
    return {
        "type": "search-list",
        "title": "BOUNCED_PAYMENTS",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getCurrentBranch().branchId;
        },
        definition: {
            title: "SEARCH_BOUNCED_PAYMENTS",
            searchForm: [
                "*"
            ],
            autoSearch:false,
            searchSchema: {
                "type": 'object',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "LOAN_ACCOUNT_NUMBER",
                        "type": "string",
                        "pattern": "^[0-9a-zA-Z]+$"
                    },
                    "first_name": {
                        "title": "CUSTOMER_NAME",
                        "type": "string"
                    },
                    "centre": {
                        "title": "CENTRE",
                        "type": "integer",
                        "enumCode": "centre",
                        "parentEnumCode": "branch_id",
                        "x-schema-form": {
                            "type": "select",
                            parentValueExpr: "model.branch"
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                var branchId = SessionStore.getCurrentBranch().branchId;
                
                var promise = LoanProcess.bounceCollectionDemand({
                    'accountNumbers': searchOptions.loan_no,  /*Service missing_27082016*/
                    'branchId': branchId,
                    'centreId': searchOptions.centre,
                    'customerName': searchOptions.first_name,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage
                }).$promise;

                return promise;
            },
            paginationOptions: {
                "getItemsPerPage": function(response, headers){
                    return 10;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers && headers['x-total-count'] || 10;
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
                    if (_.hasIn(item, 'amount1') && _.isString(item['amount1'])){
                        item.amount1 = parseFloat(item['amount1']);
                    }
                    if (_.hasIn(item, 'amount3') && _.isString(item['amount3'])){
                        item.amount3 = parseFloat(item['amount3']);
                    }
                    if (_.hasIn(item, 'amount2') && _.isString(item['amount2'])){
                        item.amount2 = parseFloat(item['amount2']);
                    }
                    return [
                        item.customerName,
                        "{{'LOAN_ACCOUNT_NUMBER'|translate}}: " + item.accountId,
                        "{{'TOTAL_AMOUNT_DUE'|translate}}: " + Utils.ceil(item.amount1 + item.amount2 + item.amount3),
                        "{{'PRINCIPAL_DUE'|translate}}: " + item.part1,         
                        "{{'INTEREST_DUE'|translate}}: " + item.part2,             
                        "{{'PENAL_INTEREST'|translate}}: " + item.part3,  
                        "{{'FEES_DUE'|translate}}: " + item.amount2,
                        "{{'UNAPPROVED_AMOUNT'|translate}}: " + item.repaidAmountSum
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "COLLECT_PAYMENT",
                            desc: "",
                            fn: function(item, index){
                                entityManager.setModel('loans.LoanRepay', {_bounce:item,_screen:"BounceQueue"});
                                $state.go('Page.Engine',
                                    {
                                        pageName: 'loans.LoanRepay',
                                        pageId: item.accountId,
                                        pageData: {
                                            'onlyDemandAllowed': true
                                        }
                                    }
                                );
                            },
                            isApplicable: function(item, index){
                                return true;
                            }
                        },{
                            name: "COLLECTION_STATUS",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.collections.P2PUpdate', {_bounce:item,_screen:"BouncePromiseQueue"});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.P2PUpdate', pageId: item.accountId});
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
