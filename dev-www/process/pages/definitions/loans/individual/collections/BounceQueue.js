irf.pageCollection.factory(irf.page("loans.individual.collections.BounceQueue"),
["$log", "formHelper", "LoanProcess", "$state", "SessionStore", "$q", "entityManager",
function($log, formHelper, LoanProcess, $state, SessionStore,$q, entityManager){
    return {
        "type": "search-list",
        "title": "BOUNCED_PAYMENTS",
        //"subTitle": "T_ENROLLMENTS_PENDING",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            //model.branchId = SessionStore.getBranchId();
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
            autoSearch:false,
            searchSchema: {
                "type": 'object',
               // "required":["branch"],
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
                    },*/
                    "branchId": {
                        "title": "BRANCH_NAME",
                        "type": ["null","integer"],
                        "enumCode": "branch_id",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
                    "centre": {
                        "title": "CENTRE",
                        "type": ['null', "integer"],
                        "enumCode": "centre",
                        "x-schema-form": {
                            "type": "select",
                            "parentEnumCode": "branch_id"
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
                    'branchId': searchOptions.branchId || SessionStore.getBranchId(),
                    'centreCode': searchOptions.centre,
                    'customerName': searchOptions.first_name,
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
                        // "{{'APPLICANT'|translate}}: " + item.applicant,
                        // "{{'CO_APPLICANT'|translate}}: " + item.coApplicant,
                        "{{'LOAN_ACCOUNT_NUMBER'|translate}}: " + item.accountId, /*Service is missing*/
                        "{{'TOTAL_AMOUNT_DUE'|translate}}: " + item.amount1, /*amount1 is TotalDemandDue*/
                        "{{'PRINCIPAL_DUE'|translate}}: " + item.part1,          /*Service is missing*/
                        "{{'INTEREST_DUE'|translate}}: " + item.part2,              /*Service is missing*/
                        "{{'PENAL_INTEREST'|translate}}: " + item.part3,   /*Service is missing*/
                        "{{'CHARGES'|translate}}: " + item.part4,                /*Service is missing*/
                        "{{'FEES'|translate}}: " + item.amount2,                 /*amountt2 is TotalFeeDue*/
                        "{{'NUMBER_OF_DUES'|translate}}: " + item.numberOfDues     /*Service is missing*/
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "COLLECT_PAYMENT",
                            desc: "",
                            fn: function(item, index){
                                entityManager.setModel('loans.LoanRepay', {_bounce:item,_screen:"BounceQueue"});
                                $state.go('Page.Engine', {pageName: 'loans.LoanRepay', pageId: item.accountId});
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
                                entityManager.setModel('loans.individual.collections.P2PUpdate', {_bounce:item,_screen:"BounceQueue"});
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
