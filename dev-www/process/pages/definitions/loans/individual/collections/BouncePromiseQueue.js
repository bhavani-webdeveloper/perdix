irf.pageCollection.factory(irf.page("loans.individual.collections.BouncePromiseQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q",
function($log, formHelper, Enrollment, $state, SessionStore,$q){
    return {
        "type": "search-list",
        "title": "BOUNCED_PAYMENTS",
        //"subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
        },
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
                        "type": "string",
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
                var promise = Enrollment.search({
                    'branchName': searchOptions.branch,
                    'centreCode': searchOptions.centre,
                    'firstName': searchOptions.first_name,
                    'lastName': searchOptions.last_name,
                    'page': pageOpts.pageNo,
                    'per_page': pageOpts.itemsPerPage,
                    'stage': "Stage02"
                }).$promise;


                return $q.resolve({
                    headers: {
                        'x-total-count': 5
                    },
                    body:[
                        {
                            custname:"GeeKay Industries",
                            applicant: "Kanimozhi",
                            coApplicant: "Raja",
                            loanacno:"508640101335",
                            paymenttype:"PDC",
                            amountdue: 19548,
                            principal: 14872.36,
                            interest: 4235.64,
                            penalInterest: 200,
                            charges: 200,
                            fees: 40,
                            numberOfDues: 2,
                            installmentdate:"03-03-2016",
                            p2pdate:"15-03-2016"
                        },
                        {
                            custname:"Manjunatha Hydroflexibles",
                            applicant: "Sudha",
                            coApplicant: "Ragunath",
                            loanacno:"508640108276",
                            paymenttype:"PDC",
                            amountdue: 19397,
                            principal: 14844.7,
                            interest: 4262.3,
                            penalInterest: 150,
                            charges: 100,
                            fees: 40,
                            numberOfDues: 1,
                            installmentdate:"02-03-2016",
                            p2pdate:""
                        },
                        {
                            custname:"VSR Engineering",
                            applicant: "Rajesh",
                            coApplicant: "Selvam",
                            loanacno:"508651508978",
                            paymenttype:"ACH",
                            amountdue: 49816,
                            principal: 37110.26,
                            interest: 10655.74,
                            penalInterest: 1200,
                            charges: 750,
                            fees: 100,
                            numberOfDues: 1,
                            installmentdate:"05-03-2016",
                            p2pdate:""
                        }
                    ]
                });
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
                        item.custname,
                        // "{{'APPLICANT'|translate}}: " + item.applicant,
                        // "{{'CO_APPLICANT'|translate}}: " + item.coApplicant,
                        "{{'LOAN_ACCOUNT_NUMBER'|translate}}: " + item.loanacno,
                        "{{'Total Amount Due'|translate}}: " + item.amountdue,
                        "{{'PRINCIPAL'|translate}}: " + item.principal,
                        "{{'INTEREST'|translate}}: " + item.interest,
                        "{{'Penal interest'|translate}}: " + item.penalInterest,
                        "{{'Charges'|translate}}: " + item.charges,
                        "{{'FEES'|translate}}: " + item.fees,
                        "{{'Number of dues'|translate}}: " + item.numberOfDues
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "ASIGN_TO_RECOVERY_AGENT",
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
                                return true;
                            }
                        },
                        {
                            name: "ASIGN_TO_LOAN_OFFICER",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                entityManager.setModel('loans.individual.collections.P2PUpdate', {_bounce:item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.P2PUpdate', pageId: item.loanacno});
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
