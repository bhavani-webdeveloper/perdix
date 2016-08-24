irf.pageCollection.factory(irf.page("loans.individual.collections.CreditValidationQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q", "entityManager",
function($log, formHelper, Enrollment, $state, SessionStore, $q, entityManager){
    return {
        "type": "search-list",
        "title": "Credit Validation Queue",
        //"subTitle": "T_ENROLLMENTS_PENDING",
        initialize: function (model, form, formCtrl) {
            $log.info("search-list sample got initialized");
            model.branch = SessionStore.getBranch();
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
            title: "Search Payments",
            searchForm: [
                "*"
            ],
            autoSearch:true,
            searchSchema: {
                "type": 'object',
                "title": 'SearchOptions',
                "required":["branch"],
                "properties": {
                    "loan_no": {
                        "title": "Loan Account Number",
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
                    "branch": {
                        "title": "BRANCH_NAME",
                        "type": "string",
                        "enumCode": "branch",
                        "x-schema-form": {
                            "type": "select"
                        }
                    },
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
                expandable:true,
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.custname,
                        'Loan Number: ' + item.loanacno,
                        'Amount Due: ' + item.amountdue,
                        'Payment Type:' + item.paymenttype
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Credit Validation",
                            desc: "",
                            fn: function(item, index){
                                entityManager.setModel('loans.individual.collections.CreditValidation', {_credit:item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.CreditValidation', pageId: item.loanacno});
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
