irf.pageCollection.factory(irf.page('customer360.loans.View'),
    ["$log", "formHelper", "LoanAccount", "$state", "SessionStore", "LoanAccount", "$stateParams",
        function($log, formHelper, LoanAccount, $state, SessionStore, LoanAccount, $stateParams){
            return {
                "type": "search-list",
                "title": "VIEW_LOANS",
                "subTitle": "VIEW_LOANS_SUB",
                initialize: function (model, form, formCtrl) {
                    $log.info("ViewLoans initialiized");
                },
                offline: false,
                definition: {
                    title: "Loans",
                    autoSearch:true,
                    searchForm: [
                        //"*"
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
                                //var arrLength = response.length;
                                //for (var i=0; i<arrLength; i++){
                                //    if (!_.isNull(response[i]) && _.isObject(response[i])){
                                //        _.remove()
                                //    }
                                //}
                                _.pullAll(response, [null]);
                                return response;
                            }
                            return [];
                        },
                        getListItem: function(item){
                            return [
                                item.accountNumber,
                                'Type: ' + item.loanType + ', Partner: ' + item.partner + ', Product: ' + item.productCode
                            ]
                        },
                        getActions: function(){
                            return [
                                {
                                    name: "View Details",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'customer360.loans.LoanDetails',
                                            pageId: item.accountId
                                        })
                                    },
                                    isApplicable: function(item, index){
                                        if (item.accountNumber){
                                        	return true;
                                        }
                                        return false;
                                    }
                                },
                                {
                                    name: "Repay",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'loans.LoanRepay',
                                            pageId: [item.accountNumber,item.urnNo].join(".")
                                        })
                                    },
                                    isApplicable: function(item, index){
                                        var siteCode = SessionStore.getGlobalSetting('siteCode');
                                        if(siteCode == 'KGFS' || siteCode == 'sambandh' || siteCode == 'saija')
                                        {
                                            return false;
                                        } else {
                                            return true;
                                        }
                                    }
                                },
                                {
                                    name: "Amend",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'loans.LoanAmend',
                                            pageId: [item.accountNumber,item.urnNo].join(".")
                                        })
                                    },
                                    isApplicable: function(item, index){
                                        var siteCode = SessionStore.getGlobalSetting('siteCode');
                                        if(siteCode == 'sambandh') {
                                            return false;
                                        }
                                        return true;
                                    }
                                },
                                 {
                                    name: "Unmark NPA",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'loans.UnmarkNPA',
                                            pageId: [item.accountNumber,item.urnNo].join(".")
                                        })
                                    },
                                    isApplicable: function(item, index){
                                        return true;
                                    }
                                }, {
                                    name: "FREEZE_ACCOUNT",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'loans.FreezeAccount',
                                            pageId: [item.accountNumber,item.partner].join(".")
                                        })
                                    },
                                    isApplicable: function(item, index){
                                        return true;
                                    }
                                },
                                {
                                    name: "VIEW_LOAN",
                                    fn: function(item, index){
                                        var siteCode = SessionStore.getGlobalSetting('siteCode');
                                        if(siteCode == 'witfin') {
                                            $state.go('Page.Bundle', {
                                                pageName: 'witfin.loans.individual.screening.LoanView',
                                                pageId: item.accountId
                                            })
                                        } 
                                        else if (siteCode == 'pahal') {
                                            $state.go('Page.Bundle', {
                                                pageName: 'pahal.loans.individual.screening.LoanView',
                                                pageId: item.accountId
                                            })
                                        }   
                                        else {
                                            $state.go('Page.Bundle', {
                                                pageName: 'loans.individual.screening.LoanViewList',
                                                pageId: item.accountId
                                            })
                                        }
                                    },
                                    isApplicable: function(item, index){
                                        return true;
                                    }
                                },
                                {
                                    name: "REPOSSESSION_STATUS",
                                    fn: function(item, index) {
                                        $state.go('Page.Engine', {
                                            pageName: 'loans.Repossession',
                                            pageId: item.accountId
                                        })
                                    },
                                    isApplicable: function(item, index){
                                        var siteCode = SessionStore.getGlobalSetting('siteCode');
                                        if(siteCode == 'pahal') return true;
                                    }
                                }
                            ];
                        }
                    }
                }
            };
        }]);
