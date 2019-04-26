irf.pageCollection.factory(irf.page('customer360.loans.View'),
    ["PagesDefinition", "$log", "formHelper", "LoanAccount", "$state", "SessionStore", "$stateParams","PageHelper","$q",
        function(PagesDefinition, $log, formHelper, LoanAccount, $state, SessionStore, $stateParams, PageHelper,$q){
            var pageConfig = {};
            var isPageConfigResolve = false;
            var isApplicableValue = function(param){
                var value = pageConfig != null ? (Object.keys(pageConfig).length > 0 ? ((pageConfig[param] != null) ? pageConfig[param] : false) : false ): false;
                return value;
            }
            var getRolePageConfig = function(param){
                var deferred = $q.defer();
                if(isPageConfigResolve){
                    var value = pageConfig != null ? (Object.keys(pageConfig).length > 0 ? ((pageConfig[param] != null) ? pageConfig[param] : false) : false ): true;
                      deferred.resolve(value);
                }
                getRolePageConfig(param).then(function(resp){
                    if(resp)
                        deferred.resolve(resp);
                })
                    // if(isPageConfigResolve) {
                    //   
                    // }
                    // else{
                    //     PagesDefinition.getRolePageConfig('Page/Engine/customer360.loans.View').then(function(resp){    
                    //         _.isNull(resp) ? pageConfig = null : pageConfig = resp;
                    //         var value = pageConfig != null ? (pageConfig.length> 0 ? ((pageConfig[param] != null) ? pageConfig[param] : false) : false ): true;
                    //         defer.resolve(value);
                    //     },defer.resolve(false))
                    // }
                return deferred.promise;
            }
            
            return {
                "type": "search-list",
                "title": "VIEW_LOANS",
                "subTitle": "VIEW_LOANS_SUB",
                initialize: function (model, form, formCtrl) {
                    $log.info("ViewLoans initialiized"); 
                    // PagesDefinition.getRolePageConfig('Page/Engine/customer360.loans.View').then(function(resp){    
                    //     _.isNull(resp) ? pageConfig = null : pageConfig = resp;
                    //     isPageConfigResolve = true;
                    // })          
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
                        var deferred = $q.defer();
                        var promise = LoanAccount.viewLoans({urn: $stateParams.pageId}).$promise;
                        promise.then(function(resp){
                            var data = resp;
                            PagesDefinition.getRolePageConfig("Page/Engine/customer360.loans.View").then(function(value){
                                pageConfig = value;
                                deferred.resolve(data);
                            })
                        })
                        //var urnNo = $stateParams.pageId;
                        return deferred.promise;
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
                        selectable: false,
                        expandable: true,
                        listStyle: "table",
                        itemCallback: function(item, index) {

                        },
                        getItems: function(response, headers){
                            if (response!=null && response.length && response.length!=0){
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
                        getTableConfig: function() {
                            return {
                                "serverPaginate": true,
                                "paginate": true,
                                "pageLength": 10
                            };
                        },
                        getColumns: function(){
                            var centres = formHelper.enum('centre').data;
                            return [
                                {
                                    title:'NAME',
                                    data: 'accountNumber',
                                },
                                {
                                    title:'Type',
                                    data: 'loanType'
                                },
                                {
                                    title:'Partner',	
                                    data: 'partner'
                                },
                                {
                                    title:'Product',
                                    data: 'productCode'
                                },
                                {
                                    title:'Application Status',
                                    data: 'applicationStatus',
                                }
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
                                        if(siteCode == 'sambandh'||siteCode == 'KGFS' || siteCode == 'shramsarathi') {
                                            return false;
                                        }
                                        return true;
                                    }
                                },
                                { 
                                    name: "Payer Datails",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'loans.PayersDetails',
                                            pageId: [item.accountNumber,item.urnNo].join(".")
                                        })
                                    },
                                    isApplicable: function(item, index){
                                        var siteCode = SessionStore.getGlobalSetting('siteCode');
                                        if(siteCode == 'witfin') { 
                                            return true
                                        }else{
                                            return false
                                        }                                     }
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
                                    pagePermission:'Page/Engine/loans.LoanAmend',
                                    isApplicable: function(item, index){
                                        var siteCode = SessionStore.getGlobalSetting('siteCode');
                                        if(siteCode == 'sambandh'||siteCode == 'KGFS' || siteCode == 'shramsarathi') {
                                            return false;
                                        }
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
                                        var model={};
                                        model.pageConfig = {};
                                        model.pageConfig.IsUnMarkNPA = true; // default value for IsunmarkNPA
                                        PagesDefinition.getRolePageConfig("Page/Engine/customer360.loans.View")
                                            .then(function(data){
                                                if(!_.isNull(data)){
                                                    model.pageConfig = data; //set from addl_param
                                                }
                                            },function(error){
                                                PageHelper.showErrors(error)
                                            }); 

                                            var siteCode = SessionStore.getGlobalSetting('siteCode');

                                            if(siteCode == 'KGFS')
                                            {
                                                return false;
                                            };
                                                    
                                            if (model.pageConfig.IsUnMarkNPA) {
                                                return true
                                            } else {
                                                return false
                                            };


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
                                        return isApplicableValue('isFreezeAccountAccess');
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
