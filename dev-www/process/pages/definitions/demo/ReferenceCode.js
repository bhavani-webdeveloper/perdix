irf.pageCollection.factory(irf.page("demo.ReferenceCode"),
["$log", "SessionStore","Files",
    function($log, SessionStore,Files)
    {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Reference Code",
            
            "initialize":function (model, form, formCtrl) 
            {
                model.code={};
                model.code.Parameters=[{"cassifier":"A","name":"selvan","code":"001","parentClassifier":"ClassA","parentReferenceCode":"CodeA"}];
                
                
             },  

            "form":
            [
            {
                "type": "box",
                "title": "Reference Code",
                "colClass": "col-sm-12",
                "items":
                 [
                    {
                        key:"code.searchBy",
                        title:"Search By",
                        type:"select",
                        enumCode:""
                    },
                    {
                        key:"code.parent",
                        title:"Parent",
                        type:"select",
                        enumCode:"centre",
                        parentEnumCode: "branch_id",
                            parentValueExpr:"model.customer.branchId",
                            screenFilter: true
                    },
                    {
                                type:"tableview",
                                key:"code.Parameters",
                                "colClass": "col-sm-12",
                                // title:"SCORING_DETAILS",
                                selectable: false,
                                paginate: false,
                                searching: false,
                                getColumns: function()
                                {
                                    return [
                                    {
                                        title: 'Cassifier',
                                        data: 'cassifier'
                                    }, {
                                        title: 'Name',
                                        data: 'name'
                                    }, {
                                        title: 'Code',
                                        data: 'code'
                                    },
                                    {
                                        title: 'ParentClassifier',
                                        data: 'parentClassifier'
                                    },
                                    {
                                        title: 'ParentReferenceCode',
                                        data: 'parentReferenceCode'
                                    },
                                     {
                                    type: "button",
                                    data: "SFD",
                   //condition: "model.code.config",
                                            title: "SSS"
                                      },
                                      {
                                          type: "actionbox",
                   // condition: "model.spoke.config",
                                            items: [
                                                 {
                                                    type: "submit",
                                                    title: "view"
                                                 }
                                                 ]
                                      },
                


                                    ]
                                }
                            },
                                 

                   
                ]
            },    

        


            ],
            
            schema:
            {
                "$schema": "http://json-schema.org/draft-04/schema#",
              // "key":"Emplyoee.Department[]",
                "type": "object",
                "properties":                            
                {
                   "customer":
                   {
                        "type":"object",
                        "properties":
                        {
                           
                        }
                    }
                }
            },
            actions:{

titlename:function (model, form, formCtrl) 
            {
                $log.info("Spoke Merger Customer Page got initialized");
                model.customer = {};
                model.customer.config = [];
                model.customer.config[0] = {
                    key: "min_req",
                    value: "4",
                    description: "some sample config"
                };
            },
                submit: function(model, form, formName)
                {
                    $log.info('on submit action ....');
                },

            }
        };
    }
]);
