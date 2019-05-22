irf.pageCollection.factory(irf.page('customer360.loans.View'),
    ["PagesDefinition", "$log", "formHelper", "LoanAccount", "$state", "SessionStore", "$stateParams","PageHelper","$q","IndividualLoan",
        function(PagesDefinition, $log, formHelper, LoanAccount, $state, SessionStore, $stateParams, PageHelper,$q,IndividualLoan){
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
                            if (item && item.accountId) {
                                IndividualLoan.get({
                                    id: item.accountId
                                }).$promise.then(function (currentResp) {
                                    if(currentResp.currentStage == 'LoanInitiation' || currentResp.currentStage == 'DocumentUpload')
                                    item.applicationStatus='Pending upload queue';
                                    else if(currentResp.currentStage == 'Checker1')
                                    item.applicationStatus='Checker 1';
                                    else if(currentResp.currentStage == 'Checker2')
                                    item.applicationStatus='Checker 2';
                                    else if(currentResp.currentStage == 'Completed' || currentResp.currentStage == 'ReadyForDisbursement')
                                    item.applicationStatus='Open';                                   
                                });

                            }
                            
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
                            return  PagesDefinition.getUserAllowedQueueActionsDefinition([
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
                                    name: "COLLECTION_STATUS",
                                    desc: "",
                                    fn: function(item, index){
                                       // entityManager.setModel('loans.individual.collections.P2PUpdate', {_bounce:item,_screen:"BounceQueue"});
                                        $state.go('Page.Engine', {pageName: 'loans.individual.collections.P2PUpdate', pageId: item.accountNumber});
                                    },
                                    isApplicable: function(item, index){
                                        var siteCode = SessionStore.getGlobalSetting('siteCode');
                                        
                                        if(siteCode == 'witfin') { 
                                            return true
                                        }else{
                                            return false
                                        }
                                    }
                                },
                                {
                                    name: "COLLECT_ADHOC_CHARGES",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go("Page.Engine",{
                                            pageName:"loans.individual.collections.ChargeFee",
                                            pageId:item.accountNumber
                                        });
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
                                        if(siteCode == 'sambandh'||siteCode == 'KGFS') {
                                            return false;
                                        }
                                        return true;
                                    }
                                },
                                // { 
                                //     name: "Payer Datails",
                                //     desc: "",
                                //     fn: function(item, index){
                                //         $state.go('Page.Engine', {
                                //             pageName: 'loans.PayersDetails',
                                //             pageId: [item.accountNumber,item.urnNo].join(".")
                                //         })
                                //     },
                                //     isApplicable: function(item, index){
                                //         var siteCode = SessionStore.getGlobalSetting('siteCode');
                                //         if(siteCode == 'witfin') { 
                                //             return true
                                //         }else{
                                //             return false
                                //         }
                                //     }
                                // },
                                 { 
                                    name: "Unmark NPA",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'loans.UnmarkNPA',
                                            pageId: [item.accountNumber,item.urnNo].join(".")
                                        })
                                    },
                                    pagePermission:'Page/Engine/loans.UnmarkNPA',
                                    isApplicable: function(item, index){
                                            var siteCode = SessionStore.getGlobalSetting('siteCode');

                                            if(siteCode == 'KGFS')
                                            {
                                                return false;
                                            };
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
                                        return isApplicableValue('isFreezeAccountAccess');
                                    }
                                },{ 
                                    name: "ACTIVATE_ACCOUNT",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'loans.individual.ActivateLoan',
                                            pageId: [item.accountNumber,item.partner].join(".")
                                        })
                                    }
                                },
                                {
                                    name: "ACH_REGISTRATION",
                                    desc: "",
                                    fn: function(item, index){
                                        //EntityManager.setModel("loans.individual.achpdc.ACHRegistration",{_loanAch:item});
                                        $state.go("Page.Engine",{
                                            pageName:"loans.individual.achpdc.ACHRegistration",
                                            pageId:item.accountId, 
                                            pageData: item
                                        });
                                    },
                                    isApplicable: function(item, index){
                                        var siteCode = SessionStore.getGlobalSetting('siteCode');
                                        if(siteCode == 'witfin') { 
                                            return true
                                        }else{
                                            return false
                                        }
                                    }
                                },
                                {
                                    name: "PDC_REGISTRATION",
                                    desc: "",
                                    fn: function(item, index){
                                        //EntityManager.setModel("loans.individual.achpdc.PDCRegistration",{_pdc:item});
                                        $state.go("Page.Engine",{
                                            pageName:"loans.individual.achpdc.PDCRegistration",
                                            pageId:item.accountId,
                                            pageData: item
                                        });
                                    },
                                    isApplicable: function(item, index){
                                        var siteCode = SessionStore.getGlobalSetting('siteCode');
                                        if(siteCode == 'witfin') { 
                                            return true
                                        }else{
                                            return false
                                        }
        
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
                            ]
                            );
                        }
                    }
                }
            };
        }]);
