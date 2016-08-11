irf.pageCollection.factory(irf.page("disbursementQueue"),
["$log", "formHelper", "CreditBureau", "CreditBureau", "SessionStore", "$state", "entityManager",
"irfProgressMessage", "irfSimpleModal", "PageHelper", "$q",
function($log, formHelper, CreditBureau, CreditBureau, SessionStore, $state, entityManager,
    PM, showModal, PageHelper,$q){
    var branch = SessionStore.getBranch();
    var nDays = 15;
    return {
        "type": "search-list",
        "title": "Disbursement Pending Queue",
        "subTitle": " ",
        initialize: function (model, form, formCtrl) {
            model.branchName = branch;
            $log.info("search-list sample got initialized");
        },
        definition: {
            title: "Disbursement Queue",
            pageName: "disbursementQueue",
            searchForm: [],
            searchSchema: 
            {
                "type": 'object',
                "title": 'SearchOptions',
                "required": ["branchName"],
                "properties": 
                {
                    "status": 
                    {
                        "title": "Customer Name",
                        "type": "string",
                        "x-schema-form": 
                        {
                            "type": "select",
                            "titleMap": [{
                                "name": "All",
                                "value": ""
                            }, {
                                "name": "Radha",
                                "value": "1"
                            }, {
                                "name": "Kamala",
                                "value": "2"
                            }, {
                                "name": "Rani",
                                "value": "3"
                            }]
                        }
                    },
                    "branch": {
                        "title": "Branch",
                        "type": "string",
                        "x-schema-form": 
                        {
                            "type": "select",
                            "titleMap": [{
                                "name": "All",
                                "value": ""
                            }, {
                                "name": "Karambayam",
                                "value": "1"
                            }, {
                                "name": "Sanjay Nagar",
                                "value": "2"
                            }, {
                                "name": "Elakurichi",
                                "value": "3"
                            }]
                        }        
                    },
                    "entity": {
                        "title": "Entity Name",
                        "type": "string",
                        "x-schema-form": 
                        {
                            "type": "select",
                            "titleMap": [{
                                "name": "All",
                                "value": ""
                            }, {
                                "name": "Entity 1",
                                "value": "1"
                            }, {
                                "name": "Entity 2",
                                "value": "2"
                            }, {
                                "name": "Entity 3",
                                "value": "3"
                            }]
                        },
                    },
                    "hub":{
                        "title": "Hub Name",
                       "type": "string",
                        "x-schema-form": 
                        {
                            "type": "select",
                            "titleMap": [{
                                "name": "All",
                                "value": ""}, 
                                {
                                "name": "Hub 1",
                                "value": "1"
                            }, {
                                "name": "Hub 2",
                                "value": "2"
                            }, {
                                "name": "Hub 3",
                                "value": "3"
                            }]
                        }
                    }
                }
            },
            getSearchFormHelper: function() {
                return formHelper;
            },
            getResultsPromise: function(searchOptions, pageOpts){
                var out = {
                    body: [
                        {
                           "Adate":"01-07-2016",
                           "name": "Ajay Karthik",
                            "id": 1224536272,
                            "pname":"Individual Loan"

                        },
                        {
                           "Adate":"02-07-2016",
                           "name": "Shahal",
                            "id": 1525876429,
                            "pname":"Business Extension Loan"
                        },
                        {
                           "Adate":"03-07-2016",
                           "name": "Sachin",
                            "id": 3546273628,
                            "pname":"Business Extension Loan"
                        }
                    ],
                    headers: {
                        "method": "GET",
                        "x-total-count": 20
                    }

                }
                return $q.resolve(out);
            },
            paginationOptions: {
                
                "viewMode": "page",
                "getItemsPerPage": function(response, headers){
                    return 20;
                },
                "getTotalItemsCount": function(response, headers){
                    return headers['x-total-count'];
                }
            },
            listOptions: {
                // listStyle: "simple",
                getItems: function(response, headers){
                    if (response!=null && response.length && response.length!=0){
                        return response;
                    }
                    return [];
                },
                getListItem: function(item){
                    return [
                        item.name,
                        item.Adate,
                        item.id,
                        item.pname
                    ]
                },
                getActions: function(){
                    return [
                        {
                            name: "DO VERIFICATION",
                            desc: "",
                            fn: function(item, index){
                                $state.go("Page.Engine",{
                                    pageName:"CustomerRUD",
                                    pageId:item.id,
                                    pageData:{
                                        intent:'EDIT'
                                    }
                                });
                            },
                            isApplicable: function(item, index){
                                if (item.currentStage==='Stage01')
                                    return false;
                                else return true;
                            }
                        }
                    ];
                }
            }
        }  
    }
    
}]);