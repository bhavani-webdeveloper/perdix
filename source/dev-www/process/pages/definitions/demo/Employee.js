irf.pageCollection.factory(irf.page("demo.Emplyoee"),
["$log", "Enrollment", "SessionStore","Files",
    function($log, Enrollment, SessionStore,Files)
    {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Emplyoee Profile",
            
            "initialize":function (model, form, formCtrl) 
            {
                model.Emplyoee={};
                model.Emplyoee.Name="Selvan";
                model.Emplyoee.DOB= new Date("08-11-2016");
                model.Emplyoee.Department=[];
               // model.Emplyoee.Department[0].Departmentname="IT";
                //model.Emplyoee.Department[0].JoiningDate="18022016";
                model.Emplyoee.Department.push({Departmentname:"IT",JoiningDate:"08-11-2016"});
            },  

            "form":
            [
            {
                "type": "box",
                "title": "Emplyoee Profile",
                "items":
                 [
                    {
                    key:"Emplyoee.Name",
                       title:"Emplyoee Name"

                    },
                    {
                        key:"Emplyoee.Location",
                        title:"Location",
                        type:"radios",
                        titleMap:
                            {
                                "city_A":"Chennai",
                                "city_B":"Thiruvananthapuram",
                                "city_C":"Bangalore"                                    
                        
                            },

                    },
{
                        key:"Emplyoee.amount",
                        title:"Amount",
                        type:"amount"
                    },
                    {
                        key:"Emplyoee.Geotag",
                        title:"Geotag",
                        type:"geotag"
                    },

                    {
                        "key":"Emplyoee.qrcode",
                        "title":"QR-Code",
                        "type":"qrcode"
                    },
                    {
                        key:"Emplyoee.DOB",
                        title:"DOB",
                        type:"date"
                    },
                   
                   
                    {
                        key:"Emplyoee.Department",
                        type:"array",
                        notitle:true,
                        items:
                        [
                             { 
                                key:"Emplyoee.Department[].Departmentname",
                                title:"Department"

                             },
                              { 
                                key:"Emplyoee.Department[].JoiningDate",
                                title:"Joining Date",
                                type:"date"
                             },
                            { 
                                key:"Emply,oee.Department[].LeavingDate",
                                title:"Leaving Date"
                             },
                             
                             { 
                                key:"Emplyoee.Department[].EMPAddress",
                                title:"EmplyAddress",
                                type:"textarea"
                             },
                             { 
                                key:"Emplyoee.Department[].lov",
                                title:"Lov",
                                type:"Lov"
                             },
                             {
                            key:"Emplyoee.Department[].City",
                            type:"select",
                            title:"City",
                            titleMap:
                                    {
                                "city_A":"Chennai",
                                "city_B":"Thiruvananthapuram",
                                "city_C":"Bangalore"                                    
                        
                             }
                            },
                            { 
                                    key:"Emplyoee.Department[].Male",
                                    title:"Male",
                                   // type:"checkbox"
                               // default:false
                            },

                                { 
                                    key:"Emplyoee.Department[].FeMale",
                                    title:"FeMale",
                                    //type:"checkbox"
                               // default:false
                                },

                        ]



                    }
                ]
            },    

            {
                    type: "actionbox",
                    condition: "model.Emplyoee.config",
                    items: [
                        {
                            type: "submit",
                            title: "Update"
                        }
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
                   "Emplyoee":
                   {
                        "type":"object",
                        "properties":
                        {
                           
                            "Emplyoee.Department[]":
                            { 
                                    "type":"object",
                                        "properties":
                                        {
                                            "Male":
                                            {
                                                "type":"boolean",
                                                default:false

                                            },
                                            "FeMale":
                                            {
                                                "type":"boolean",
                                               default:false
                                            },
                                        }
                            }        
                            
                        }
                    }
                }
            },
            actions:{

titlename:function (model, form, formCtrl) 
            {
                $log.info("Demo Customer Page got initialized");
                model.psychometric = {};
                model.psychometric.config = [];
                model.psychometric.config[0] = {
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
