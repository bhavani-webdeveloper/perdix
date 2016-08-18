irf.pageCollection.factory(irf.page("ACHCollections"),
["$log", "Enrollment", "SessionStore",'Utils', function($log, Enrollment, SessionStore,Utils){

    

    return {
        "id": "ACHCollections",
        "type": "schema-form",
        "name": "ACHCollections",
        "title": "ACH Collections",
        "subTitle": Utils.getCurrentDate(),
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            
            
            var docsTitles = [
                "Ajay Karthik | GKB Industries Ltd. | 5607891 | Belgaum branch",
                "Ravi S | Key Metals Pvt. Ltd. | 8725678 | Hubli branch"
            ];

            for(var i=0;i<docsTitles.length;i++){


                model.loanDocs[i]= {
                    "title":docsTitles[i]
                }

            }
        },
        
        form: [

                {
                    "type":"box",
                    "title":"Daily Collections",
                    "items":[
                                    
                                    {
                                        "titleExpr":"model.loanDocs[arrayIndex].title",
                                        "type":"array",
                                        "key":"loanDocs",
                                        "add":null,
                                        "remove":null,
                                        "items":[

                                                    {
                                                        "title":"EMI",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"UMRN",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"Record Repayment",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-money",
                                                        "type":"button",
                                                        "readonly":false
                                                    }


                                                   ]
                                    }
                            ]

                }
           
              ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
            },
            approve:function(model,form){
                alert("Approved");
            },
            reject:function(model,form){
                alert("Rejected");
            }
        }
    };
}]);
