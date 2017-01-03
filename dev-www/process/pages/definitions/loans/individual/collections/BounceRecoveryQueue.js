irf.pageCollection.factory(irf.page("loans.individual.collections.BounceRecoveryQueue"),
["$log", "entityManager","formHelper", "LoanProcess", "$state", "SessionStore", "$q","Utils",
function($log, entityManager, formHelper, LoanProcess, $state, SessionStore,$q,Utils){
    return {
        "type": "search-list",
        "title": "BOUNCED_PAYMENTS",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getCurrentBranch().branchId;
            model.branchName = SessionStore.getCurrentBranch().branchName;
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
                        "type": ["integer", "null"],
                        "enumCode": "centre",
                        "parentEnumCode": "branch_id",
                        "x-schema-form": {
                            type: "select",
                            "parentValueExpr": "model.branch"
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                /*var promise = LoanProcess.p2pKGFSList({
                    'accountNumber': searchOptions.loan_no,  
                    'branchId': searchOptions.branchId,
                    'centreCode': searchOptions.centre,
                    'customerName': searchOptions.first_name,
                    'customerCategoryHubManager':'C,D',
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage
                }).$promise;*/

                var branchId = SessionStore.getCurrentBranch().branchId;
                var promise = LoanProcess.bounceCollectionDemand({
                    'accountNumbers': searchOptions.loan_no,
                    'branchId': branchId,
                    'centreId': searchOptions.centre,
                    'customerName': searchOptions.first_name,
                    'promisreToPayDate': searchOptions.promisreToPayDate,
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
                    return [
                       /*item.customerName,
                        "{{'LOAN_ACCOUNT_NUMBER'|translate}}: " + (item.accountNumber||'-'),
                        "{{'AMOUNT_DUE'|translate}}: " + (Utils.ceil(item.amount1) ||'-'), 
                        "{{'PRINCIPAL'|translate}} : " + item.part1,
                        "{{'INTEREST'|translate}} : " + item.part2,
                        "{{'PENAL_INTEREST'|translate}} : " + item.part3,
                        "{{'CHARGES'|translate}} : " + item.part4,
                        "{{'FEES'|translate}} : " + item.amount2,
                        "{{'NUMBER_OF_DUES'|translate}} : " + item.numberOfDues*/

                        item.customerName,
                        "{{'LOAN_ACCOUNT_NUMBER'|translate}}: " + item.accountId, /*Service is missing*/
                        "{{'TOTAL_AMOUNT_DUE'|translate}}: " + Utils.ceil(item.amount1), /*amount1 is TotalDemandDue*/
                        "{{'PRINCIPAL_DUE'|translate}}: " + item.part1,          /*Service is missing*/
                        "{{'INTEREST_DUE'|translate}}: " + item.part2,              /*Service is missing*/
                        "{{'PENAL_INTEREST'|translate}}: " + item.part3,   /*Service is missing*/
                        "{{'CHARGES'|translate}}: " + (item.part4||'-'),                /*Service is missing*/
                        "{{'FEES'|translate}}: " + item.amount2,                 /*amountt2 is TotalFeeDue*/
                        "{{'AMOUNT_PAID'|translate}}: " + item.repaidAmountSum
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "COLLECT_PAYMENT",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.collections.CollectPayment', {_bounce:item,_screen:"BounceRecoveryQueue"});
                                $state.go('Page.Engine', {pageName: 'loans.LoanRepay', pageId: item.accountId});
                            },
                            isApplicable: function(item, index){
                                return true;
                            }
                        },
                        {
                            name: "COLLECTION_STATUS",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.collections.P2PUpdate', {_bounce:item,_screen:"BounceRecoveryQueue"});
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
