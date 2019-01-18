irf.pageCollection.factory(irf.page('customer360.ViewInsurance'),
    ["$log", "formHelper", "Insurance", "$state", "SessionStore","$stateParams",
        function($log, formHelper, Insurance, $state, SessionStore, $stateParams){
            return {
                "type": "search-list",
                "title": "VIEW_INSURANCE",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                },
                offline: false,
                definition: {
                    title: "INSURANCE",
                    autoSearch:true,
                    searchForm: [
                        //"*"
                    ],
                    searchSchema:{},
                    getSearchFormHelper: function() {
                        return formHelper;
                    },
                    getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
                        var promise = Insurance.search({
                            customerId: $stateParams.pageId,
                            Pages:1,
                            Per_Page:10
                            }
                        ).$promise;
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
                                    title:'INSURANCE_TYPE',
                                    data: 'insuranceType',
                                },
                                {
                                    title:'PRODUCT_CODE',
                                    data: 'productCode'
                                },
                                {
                                    title:'PARTNER',	
                                    data: 'partnerCode'
                                },
                                {
                                    title:'PREMIUM_RATE_CODE',
                                    data: 'premiumRateCode'
                                },
                                {
                                    title: 'STATUS',
                                    data: 'status'
                                }
                            ]
                        },
                        getActions: function(){
                            return [
                                {
                                    name: "View Insurance",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'customer360.Insurance',
                                            pageId: item.id
                                        })
                                    },
                                    isApplicable: function(item, index){
                                        if (item.status == 'ACTIVE'){
                                        	return true;
                                        }
                                        return false;
                                    }
                                }
                                // {
                                //     name: "Repay",
                                //     desc: "",
                                //     fn: function(item, index){
                                //         $state.go('Page.Engine', {
                                //             pageName: 'loans.LoanRepay',
                                //             pageId: [item.accountNumber,item.urnNo].join(".")
                                //         })
                                //     },
                                //     isApplicable: function(item, index){
                                //         var siteCode = SessionStore.getGlobalSetting('siteCode');
                                //         if(siteCode == 'KGFS' || siteCode == 'sambandh' || siteCode == 'saija')
                                //         {
                                //             return false;
                                //         } else {
                                //             return true;
                                //         }
                                //     }
                                // },
                                // {
                                //     name: "Amend",
                                //     desc: "",
                                //     fn: function(item, index){
                                //         $state.go('Page.Engine', {
                                //             pageName: 'loans.LoanAmend',
                                //             pageId: [item.accountNumber,item.urnNo].join(".")
                                //         })
                                //     },
                                //     isApplicable: function(item, index){
                                //         var siteCode = SessionStore.getGlobalSetting('siteCode');
                                //         if(siteCode == 'sambandh') {
                                //             return false;
                                //         }
                                //         return true;
                                //     }
                                // },
                                //  {
                                //     name: "Unmark NPA",
                                //     desc: "",
                                //     fn: function(item, index){
                                //         $state.go('Page.Engine', {
                                //             pageName: 'loans.UnmarkNPA',
                                //             pageId: [item.accountNumber,item.urnNo].join(".")
                                //         })
                                //     },
                                //     isApplicable: function(item, index){
                                //         return true;
                                //     }
                                // }, {
                                //     name: "FREEZE_ACCOUNT",
                                //     fn: function(item, index){
                                //         $state.go('Page.Engine', {
                                //             pageName: 'loans.FreezeAccount',
                                //             pageId: [item.accountNumber,item.partner].join(".")
                                //         })
                                //     },
                                //     isApplicable: function(item, index){
                                //         return true;
                                //     }
                                // },
                                // {
                                //     name: "VIEW_LOAN",
                                //     fn: function(item, index){
                                //         var siteCode = SessionStore.getGlobalSetting('siteCode');
                                //         if(siteCode == 'witfin') {
                                //             $state.go('Page.Bundle', {
                                //                 pageName: 'witfin.loans.individual.screening.LoanView',
                                //                 pageId: item.accountId
                                //             })
                                //         } 
                                //         else if (siteCode == 'pahal') {
                                //             $state.go('Page.Bundle', {
                                //                 pageName: 'pahal.loans.individual.screening.LoanView',
                                //                 pageId: item.accountId
                                //             })
                                //         }   
                                //         else {
                                //             $state.go('Page.Bundle', {
                                //                 pageName: 'loans.individual.screening.LoanViewList',
                                //                 pageId: item.accountId
                                //             })
                                //         }
                                //     },
                                //     isApplicable: function(item, index){
                                //         return true;
                                //     }
                                // },
                                // {
                                //     name: "REPOSSESSION_STATUS",
                                //     fn: function(item, index) {
                                //         $state.go('Page.Engine', {
                                //             pageName: 'loans.Repossession',
                                //             pageId: item.accountId
                                //         })
                                //     },
                                //     isApplicable: function(item, index){
                                //         var siteCode = SessionStore.getGlobalSetting('siteCode');
                                //         if(siteCode == 'pahal') return true;
                                //     }
                                // }
                            ];
                        }
                    }
                }
            };
        }]);
