irf.pageCollection.factory(irf.page("kinara.loans.individual.collections.CreditValidationQueue"),
["$log", "formHelper", "LoanCollection", "$state", "SessionStore", "$q", "entityManager","irfNavigator","Utils","PageHelper",
function($log, formHelper, LoanCollection, $state, SessionStore, $q, entityManager,irfNavigator,Utils,PageHelper){
    var localFormCtrl;
    return {
        "type": "search-list",
        "title": "CREDIT_VALIDATION_QUEUE",
        initialize: function (model, form, formCtrl) {
            localFormCtrl = formCtrl;
            model.branch = SessionStore.getCurrentBranch().branchId;
            $log.info("search-list sample got initialized");
        },
        definition: {
            title: "SEARCH_PAYMENTS",
            searchForm: [
                {
                    "key": "accountNumber"
                },
                {
                    "title": "TRANSACTION_TYPE",
                    "key":"instrumentType",
                    "type":"select",
                    "enumCode":"collection_instrument_type",

                },  //cash, cheque, NEFT, RTGS, ACH, security deposit, suspense and internal 
                {
                    "key": "branch",
                    "type":"userbranch"
                },
                {
                    "key": "centre",
                    "type": "select",
                    "parentEnumCode": "branch"
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
                    "instrumentType": {
                        "title": "TRANSACTION_TYPE",
                        "type": ["string","null"]
                        //"pattern": "^[0-9a-zA-Z]+$"
                    },
                    'branch': {
                        'title': "BRANCH",
                        "type": ["string", "null"],
                        "x-schema-form": {
                            "type":"userbranch",
                            "screenFilter": true
                        }
                    },
                    "centre": {
                        "title": "CENTRE",
                        "type": ["integer", "null"],
                        "x-schema-form": {
                            "type": "select",
                            "enumCode": "centre",
                            "parentEnumCode": "branch_id",
                            "parentValueExpr": "model.branch",
                            "screenFilter": true
                        }
                    },
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                if(searchOptions.instrumentType && searchOptions.instrumentType =='Cheque'){
                    searchOptions.instrumentType = 'CHQ'
                };      /* Should return the Promise */
                var promise = LoanCollection.query({
                    'currentStage':"CreditValidation",
                    'accountCentreId': searchOptions.centre,
                    'accountBranchId': searchOptions.branch,
                    'accountNumber': searchOptions.accountNumber,
                    'instrumentType':searchOptions.instrumentType,
                    'page': pageOpts.pageNo,
	                'per_page': pageOpts.itemsPerPage
                }).$promise;

                if(searchOptions.instrumentType && searchOptions.instrumentType == 'CHQ'){
                    searchOptions.instrumentType ='Cheque'
                };

                return promise;
            },
            paginationOptions: {
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 100;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers && headers['x-total-count']
                }
            },
            listOptions: {
                expandable:true,
                selectable: true,
                listStyle: "table",
                itemCallback: function(item, index) {},
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
                getTableConfig: function() {		
                    return {		
                        "serverPaginate": true,		
                        "paginate": true,		
                        "pageLength": 10		
                    };		
                },
                getColumns: function () {
                    return [
                        {
                            title: 'BRANCH_NAME',
                            data: 'branchName'
                        },
                        {
                            title: 'Spoke',
                            data: 'centreName'
                        },
                        {
                            title: 'Enterprise name',
                            data: 'customerName'
                        },
                        {
                            title: 'Loan account number',
                            data: 'accountNumber'
                        },
                        {
                            title: 'Repayment date',
                            data: 'repaymentDate'
                        },
                        {
                            title: 'Transaction type',
                            data: 'instrumentType'
                        },
                        {
                            title: 'Amount collected',
                            data: 'repaymentAmount'
                        },
                        {
                            title: 'Amount due',
                            data: 'overdueAmount'
                        }

// 1.	Branch    branchName
// 2.	Spoke
// 3.	Enterprise name
// 4.	Loan account number  accountNumber
// 5.	Repayment date  repaymentDate 
// 6.	Transaction type
// 7.	Amount collected
// 8.	Amount due overdueAmount

                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "Credit Validation",
                            desc: "",
                            fn: function(item, index){
                                entityManager.setModel('loans.individual.collections.CreditValidation', {_credit:item});
                                $state.go('Page.Engine', {pageName: 'loans.individual.collections.CreditValidation', pageId: item.id});
                            },
                            isApplicable: function(item, index){
                                return true;
                            }
                        }
                    ];
                },
                getBulkActions: function() {
                    return [{
                        name: "Submit",
                        desc: "",
                        icon: "fa fa-pencil-square-o",
                        fn: function(items) {
                            if (items.length == 0) {
                                PageHelper.showProgress("bulk-selected", "Atleast one Credit Validation detail should be selected", 5000);
                                return false;
                            }
                            Utils.confirm("Are You Sure?")
                            .then(function () {
                                var reqParams = [];
                                var loanCollection = _.cloneDeep(items);
                                var cashCollectionData = {
                                    "loanCollectionSummaryDTOs": [],
                                    "repaymentProcessAction": "PROCEED",
                                    "stage": "PartialPayment"
                                }
                                _.each(loanCollection, function (loanCollectionDetail) {
                                    cashCollectionData.loanCollectionSummaryDTOs.push({
                                        loanCollectionId: loanCollectionDetail.id
                                    });
                                })
                                LoanCollection.batchUpdate(cashCollectionData).$promise
                                .then(function (res, head) {
                                    PageHelper.showProgress('BranchDeposit', 'successfully moved to Transaction Authorization', 5000);
                                    localFormCtrl.submit();
                                }, function (httpres) {
                                    PageHelper.showProgress("BranchDeposit", "Error in proceeding to Transaction Authorization", 5000);

                                })
                                .finally(function () {
                                    PageHelper.hideBlockingLoader();
                                })
                                    
                                });
                    
                    /* Validation for cheque and cash instrument types :
                        1) At a time only one cheque should be selected , 
                        2) cash and cheque can not be selected together
                    */
                   //here
                            // if (items.length == 0) {
                            //     PageHelper.showProgress("bulk-selected", "Atleast one Branch Deposit detail should be selected", 5000);
                            //     return false;
                            // }
                            // var countCHQ=0;
                            // _.each(items, function(loanCollection){
                            //         if(loanCollection.instrumentType=='CHQ'){
                            //             countCHQ ++;
                            //         }
                            //         if(countCHQ >1)
                            //             return countCHQ;
                            // });
                            // if(countCHQ>1) {
                            //     PageHelper.showProgress("bulk-selected", "Only one Cheque Details can be selected at a time ", 5000);
                            //     return false;
                            // }
                            // if(countCHQ==1 && items.length>1){
                            //     PageHelper.showProgress("bulk-selected", "Cheque and Cash can not be selected together", 5000);
                            //     return false;
                            // };//end here
                            // irfNavigator.go({
                            //     'state': 'Page.Engine',
                            //     'pageName': 'kinara.loans.individual.collections.CreditValidationQueue',
                            //     'pageData': items
                            // });
                        },
                        isApplicable: function(items) {
                            return true;
                        }
                    }];
                }
            }
        }
    };
}]);
