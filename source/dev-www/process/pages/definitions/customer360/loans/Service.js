irf.pageCollection.factory(irf.page('customer360.loans.Service'),
    ["$log", "formHelper", "LoanAccount", "$state", "SessionStore", "LoanAccount", "$stateParams","entityManager",
        function($log, formHelper, LoanAccount, $state, SessionStore, LoanAccount, $stateParams,EntityManager){
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
                                'Type: ' + item.loanType + ', Partner: ' + item.partner + ', Product: ' + item.productCode,
                                'Application Status: ' + item.applicationStatus
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
                                    icon: "fa fa-check-square-o",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'customer360.loans.LoanDetails',
                                            pageId: item.accountId
                                        })
                                    },
                                    isApplicable: function(item, index){
                                        return true;
                                               
                                    }
                                },
                                {
                                    name: "Repay",
                                    desc: "",
                                    icon: "fa fa-rupee",
                                    fn: function(item, index){
                                        $state.go('Page.Engine', {
                                            pageName: 'loans.DirectLoanRepay',
                                            pageId: [item.accountNumber,item.urnNo,item.customerId,item.bcAccountNumber,item.partner].join(".")
                                        })
                                    },
                                    isApplicable: function(item, index){
                                        var siteCode = SessionStore.getGlobalSetting('siteCode');
                                        if(siteCode == 'KGFS'){
                                            return true;
                                        }
                                        else{
                                          return false  
                                        }
                                    }
                                },
                                {
                                    name: "COLLECT_ADHOC_CHARGES",
                                    desc: "",
                                    icon: "fa fa-rupee",
                                    fn: function(item, index){
                                        EntityManager.setModel("loans.individual.collections.ChargeFee", {"_loan": item});
                                        $state.go("Page.Engine",{
                                            pageName:"loans.individual.collections.ChargeFee",
                                            pageId:item.accountNumber
                                        });
                                    },
                                    isApplicable: function(item, index){
                                        var siteCode = SessionStore.getGlobalSetting('siteCode');
                                        if(siteCode == 'KGFS'){
                                            return true;
                                        }
                                        else{
                                          return false  
                                        }
                                        
                                    }
                                },
                            ];
                        }
                    }
                }
            };
        }]);
