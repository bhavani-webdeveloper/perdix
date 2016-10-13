irf.pageCollection.factory(irf.page("loans.individual.collections.BouncePromiseQueue"),
["$log", "entityManager", "formHelper", "LoanProcess", "$state", "SessionStore", "$q","Utils",
function($log, entityManager, formHelper, LoanProcess, $state, SessionStore,$q,Utils){
    return {
        "type": "search-list",
        "title": "BOUNCED_PAYMENTS",
        //"subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranchId();
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
                    /*"kyc_no": {
                        "title": "KYC_NO",
                        "type": "string"
                    },
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },*/
                    "centre": {
                        "title": "CENTRE",
                        "type": "integer",
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
                var promise = LoanProcess.bounceCollectionDemand({
                    'accountNumbers': searchOptions.loan_no,  /*Service missing_27082016*/
                    'branchId': searchOptions.branch,
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
                    return [
                        item.customerName,

                        "{{'LOAN_ACCOUNT_NUMBER'|translate}} : " +  item.accountId,  /*Service missing_27082016*/
                        // "{{'BANK'|translate}} : " + item.bankName,
                        // "{{'BRANCH_ID'|translate}} : " + item.branchName,
                        "{{'AMOUNT_DUE'|translate}} : " + Utils.ceil(item.amount1),
                        "{{'PRINCIPAL'|translate}} : " + item.part1,
                        "{{'INTEREST'|translate}} : " + item.part2,
                        "{{'PENAL_INTEREST'|translate}} : " + item.part3,
                        "{{'CHARGES'|translate}} : " + item.part4,
                        "{{'FEES'|translate}} : " + item.amount2,
                        "{{'NUMBER_OF_DUES'|translate}} : " + item.numberOfDues
                        //"{{'CENTRE_CODE'|translate}} : " + item.centre,
                        //"{{'CUSTOMER_AVAILABLE'|translate }} : " + item.customerAvailable,
                        //"{{'CUSTOMER_CATEGORY_LOAN_OFFICER'|translate}} : " + item.customerCategoryLoanOfficer,
                        //"{{'OVERDUE_REASONS'|translate}} : " + item.overdueReasons,
                        //"{{'PROMISETOPAY_DATE'|translate}} : " + item.promiseToPayDate

                    ]
                },
                getActions: function(){
                    return [
                        /*{
                            name: "COLLECT_PAYMENT",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.collections.CollectPayment', {_bounce:item});
                               $state.go('Page.Engine', {pageName: 'loans.individual.collections.CollectPayment', pageId: item.loanacno});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return false;
                            }
                        },*/
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
                                //if (index%2==0){
                                //  return false;
                                //}
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
