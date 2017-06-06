irf.pageCollection.factory(irf.page('customer360.loans.Service'),
    ["$log", "formHelper", "LoanAccount", "$state", "SessionStore", "LoanAccount", "$stateParams",
        function($log, formHelper, LoanAccount, $state, SessionStore, LoanAccount, $stateParams){
            return {
                "id": "ViewLoans",
                "type": "search-list",
                "name": "Service Loans",
                "title": "SERVICE_LOANS",
                "subTitle": "SERVICE_LOANS_SUB",
                "uri":"Loans/View Loans",
                initialize: function (model, form, formCtrl) {
                    $log.info("ServiceLoans initialiized");
                },
                offline: false,
                definition: {
                    title: "Loans",
                    autoSearch:true,
                    searchForm: [
                        "*"
                    ],
                    searchSchema: {
                        "type": 'object',
                        "title": 'SearchOptions',
                        "properties": {
                            "show_closed": {
                                "title": "SHOW_CLOSED_LOANS",
                                "type": "boolean",
                                "default": false
                            }
                        },
                        "required":["branch"]
                    },
                    getSearchFormHelper: function() {
                        return formHelper;
                    },
                    getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                        var promise = LoanAccount.viewLoans({urn: $stateParams.pageId}).$promise;
                        //var urnNo = $stateParams.pageId;
                        return promise;
                    },
                    paginationOptions: {
                        "viewMode": "page",
                        "getItemsPerPage": function(response, headers){
                            return 20;
                        },
                        "getTotalItemsCount": function(response, headers){
                            return response.length;
                        }
                    },
                    listOptions: {
                        itemCallback: function(item, index) {

                        },
                        getItems: function(response, headers){
                            if (response!=null && response.length && response.length!=0){
                                return response;
                            }
                            return [];
                        },
                        getListItem: function(item){
                            return [
                                item.accountNumber,
                                'Type: ' + item.loanType + ', Partner: ' + item.partner + ', Product: ' + item.productCode,
                                'Application Status: ' + item.applicationStatus
                            ]
                        },
                        getActions: function(){
                            return [
                                {
                                    name: "View Details",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: irf.page('loans.Service'),
                                            pageId: item.accountNumber
                                        })
                                    },
                                    isApplicable: function(item, index){
                                        //if (index%2==0){
                                        //	return false;
                                        //}
                                        return true;
                                    }
                                },
                                {
                                    name: "Repay",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'loans.LoanRepay',
                                            pageId: [item.accountNumber,item.urnNo,item.customerId].join(".")
                                        })
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
