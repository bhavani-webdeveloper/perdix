irf.pageCollection.factory(irf.page("loans.individual.achpdc.Collections"),
["$log", "Enrollment", "SessionStore",'Utils', function($log, Enrollment, SessionStore,Utils){

    

    return {
        "type": "schema-form",
        "title": "ACH_CLEARING_COLLECTION",
        "subTitle": Utils.getCurrentDate(),
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            
            
            var docsTitles = [
                "ACH Demand",
                "PDC Demand",
                "Combined (Daily) Demand"
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
                                                        "title":"Download",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
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
