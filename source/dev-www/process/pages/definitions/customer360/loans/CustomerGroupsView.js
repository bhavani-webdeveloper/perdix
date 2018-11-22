define({
    pageUID: "customer360.loans.CustomerGroupsView",
    pageType: "Engine",
    dependencies: ["$log","Queries","irfNavigator", "formHelper", "LoanAccount", "$state", "SessionStore", "LoanAccount", "$stateParams"],
    $pageFn: function($log,Queries, irfNavigator,formHelper, LoanAccount, $state, SessionStore, LoanAccount, $stateParams) {
            return {
                "type": "search-list",
                "title": "CUSTOMER_GROUPS",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    model.siteCode = SessionStore.getGlobalSetting("siteCode");
                    $log.info("Customer View Groups initialiized");
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
                    getResultsPromise: function(searchOptions, pageOpts){
                        var urn_no=$stateParams.pageId;
                        var promise = Queries.getCustomerGroups(urn_no);
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
                        expandable: true,
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
                                'Group Id: ' + item.group_id,
                                'Group Code:'+item.group_code,
                                'Group Name:'+item.group_name,
                                'Partner:' + item.partner,
                                'Group Category:' + item.group_category
                            ]
                        },
                        getActions: function(){
                            return [
                                {
                                    name: "VIEW_GROUP",
                                    desc: "",
                                    icon: "fa fa-pencil-square-o",
                                    fn: function(item, index) {
                                        irfNavigator.go({
                                            state: "Page.Engine",
                                            pageName: "loans.group.ViewGroup",
                                            pageId: item.group_id,
                                            pageData:{
                                                "close":false
                                            }
                                        });
                                    },
                                    isApplicable: function(item, index) {
        
                                        return true;
                                    }
                                }
                            ];
                        }
                    }
                }
            };
        }
    })
