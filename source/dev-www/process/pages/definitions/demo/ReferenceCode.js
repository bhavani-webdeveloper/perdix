irf.pageCollection.factory(irf.page("demo.ReferenceCode"),
["$log", "ReferenceCode", "SessionStore","Files","formHelper","PageHelper",
    function($log, ReferenceCode, SessionStore, Files, formHelper, PageHelper)
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
                        type:"lov",
                        lovonly:true,
                        outputmap:
                        {
                            "searchBy":"code.searchBy",
                            "Parent":"code.displayName",

                        },
                        searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                return ReferenceCode.allClassifier().$promise;
                            },
                           onSelect: function(valueObj, model, context)
                            {
                                            model.code.ReferenceCode = valueObj.value;
                            },
                            getListDisplayItem: function(item, index)
                            {
                                return [
                                    
                                    item.code,
                                    item.displayName,
                                    item.name,

                                   //item.parent
                                ];
                            }

                    },

                    {
                        key:"code.parent",
                        title:"Parent",
                       
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
                     Utils.confirm('Are you sure?').then(function() {
                        PageHelper.clearErrors();
                        PageHelper.showLoader();
                        ReferenceCode.postCategory(model.category).$promise.then(function(resp){
                            model.category= resp;
                            PageHelper.showProgress("category-pages","Category created/updated", 3000);
                        }, function(err){
                            PageHelper.showErrors(err);
                        }).finally(function(){
                            PageHelper.hideLoader();
                        });
                    });

            },
                submit: function(model, form, formName)
                {
                    $log.info('on submit action ....');
                },

            }
        };
    }
]);
