irf.pageCollection.factory(irf.page("loans.individual.collections.BounceRecoveryQueue"),
["$log", "entityManager","formHelper", "LoanProcess", "$state", "SessionStore", "$q",
function($log, entityManager, formHelper, LoanProcess, $state, SessionStore,$q){
    return {
        "type": "search-list",
        "title": "BOUNCED_PAYMENTS",
        //"subTitle": "T_ENROLLMENTS_PENDING",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranchId();
        },
        /*offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                "Branch: " + item["branch"],
                "Centre: " + item["centre"]
            ]
        },
        getOfflinePromise: function(searchOptions){      \* Should return the Promise *\
            var promise = Enrollment.search({
                'branchName': searchOptions.branch,
                'centreCode': searchOptions.centre,
                'firstName': searchOptions.first_name,
                'lastName': searchOptions.last_name,
                'page': 1,
                'per_page': 100,
                'stage': "Stage02"
            }).$promise;

            return promise;
        },*/
        definition: {
            title: "SEARCH_BOUNCED_PAYMENTS",
            searchForm: [
                "*"
            ],
            autoSearch:true,
            searchSchema: {
                "type": 'object',
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
                var promise = LoanProcess.p2pKGFSList({
                    'accountNumber': searchOptions.loan_no,  /*Service missing_27082016*/
                    'branchId': searchOptions.branchId,
                    'centreCode': searchOptions.centre,
                    'customerName': searchOptions.first_name,
                    'customerCategoryHubManager':'C,D',
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage
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
                /*itemCallback: function(item, index) {
                    $log.info(item);
                    $log.info("Redirecting");
                    $state.go('Page.Engine', {pageName: 'AssetsLiabilitiesAndHealth', pageId: item.id});
                },*/
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                       item.customerName,
                        // "{{'APPLICANT'|translate}}: " + item.applicant,
                        // "{{'CO_APPLICANT'|translate}}: " + item.coApplicant,
                        "{{'LOAN_ACCOUNT_NUMBER'|translate}}: " + item.accountNumber, /*Service is missing*/
                        "{{'TOTAL_AMOUNT_DUE'|translate}}: " + item.amount1, /*amount1 is TotalDemandDue*/
                        "{{'INSTALLMENT_DATE'|translate}}: " + item.installmentDate,  /*Service is missing*/
                        "{{'PAYMENT_MODE'|translate}}: " + item.paymentMode,  /*Service is missing*/
                        "{{'CHEQUE_NO'|translate}}: " + item.chequeNo,  /*Service is missing*/
                        "{{'ISSUING_BANK'|translate}}: " + item.issuingBank,  /*Service is missing*/
                        "{{'ISSUING_BRANCH'|translate}}: " + item.issuingBranch,  /*Service is missing*/
                        "{{'PRINCIPAL'|translate}}: " + item.principal,          /*Service is missing*/
                        "{{'PTP_DATE'|translate}}: " + item.PTPDate,              /*Service is missing*/
                        "{{'REASONS'|translate}}: " + item.reasons,   /*Service is missing-Loan officer reasons*/
                        "{{'TYPE_OF_CUSTOMER'|translate}}: " + item.typeOfCustomer,  /*Service is missing*/
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
                                $state.go('Page.Engine', {pageName: 'loans.LoanRepay', pageId: item.accountNumber});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        },
                        {
                            name: "PROMISE_TO_PAY",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.collections.P2PUpdate', {_bounce:item,_screen:"BounceRecoveryQueue"});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.P2PUpdate', pageId: item.accountNumber});
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
