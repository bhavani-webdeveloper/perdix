irf.pageCollection.factory(irf.page("loans.individual.DepositQueue"),
["$log", "formHelper", "Enrollment", "$state", "SessionStore", "$q",
function($log, formHelper, Enrollment, $state, SessionStore,$q){
    return {
        "id": "DepositQueue",
        "type": "search-list",
        "name": "Deposit Cash",
        "title": "Deposit Cash Collected",
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
            title: "Search Cash Payments to be deposited",
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
                    "amount_collected": {
                        "title": "Amount Collected",
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
                        'x-total-count': 3
                    },
                    body:[
                        {
                            custname:"Kanimozhi",
                            loanacno:"508640101335",
                            paymenttype:"Cash",
                            amountdue:"1232",
                            installmentdate:"03-03-2016",
                            p2pdate:"15-03-2016"
                        },
                        {
                            custname:"Sudha",
                            loanacno:"508640108276",
                            paymenttype:"Cash",
                            amountdue:"1176",
                            installmentdate:"02-03-2016",
                            p2pdate:""
                        },
                        {
                            custname:"Rajesh",
                            loanacno:"508651508978",
                            paymenttype:"Cash",
                            amountdue:"3683",
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
                        item.custname,
                        'Loan Number : ' + item.loanacno,
                        'Amount Due: ' + item.amountdue
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Pay Cash",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'Repayment', pageId: item.loanacno});
                            },
                            isApplicable: function(item, index){
                                //if (index%2==0){
                                //  return false;
                                //}
                                return true;
                            }
                        },
                        {
                            name: "Promise to Pay",
                            desc: "",
                            fn: function(item, index){
                                $log.info("Redirecting");
                                $state.go('Page.Engine', {pageName: 'Promise2Pay', pageId: item.loanacno});
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
