irf.pageCollection.factory(irf.page('lender.enrolment.View'),
    ["$log", "formHelper", "LoanAccount", "$state", "SessionStore", "LoanAccount", "$stateParams","LiabilityAccountProcess",
        function($log, formHelper, LoanAccount, $state, SessionStore, LoanAccount, $stateParams,LiabilityAccountProcess){
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
                        var promise = LiabilityAccountProcess.getLiabilityAccountSearch({lenderId: $stateParams.pageId, status:'Completed'}).$promise;
                        return promise;
                    },
                    paginationOptions: {
                        //"viewMode": "page",
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
                                item.lenderAccountNumber,
                                'Lender Name: ' + item.lenderName
                            ]
                        },
                        getActions: function(){
                            return [
                                {
                                    name: "View Details",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'lender.liabilities.LiabilityLoanAccountBooking',
                                            pageId: item.id
                                        })
                                    },
                                    isApplicable: function(item, index){
                                        return true;
                                    }
                                },
                                {
                                    name: "Repay",
                                    desc: "",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'lender.liabilities.LiabilityRepaymentScreen',
                                            pageId: item.id
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
                            ];
                        }
                    }
                }
            };
        }]);
