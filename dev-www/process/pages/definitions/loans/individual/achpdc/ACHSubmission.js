irf.pageCollection.factory(irf.page("ACHSubmission"),
["$log", "Enrollment", "SessionStore",'Utils', function($log, Enrollment, SessionStore,Utils){

    

    return {
        "id": "ACHSubmission",
        "type": "schema-form",
        "name": "ACHSubmission",
        "title": "ACH SUBMISSION",
        "subTitle": Utils.getCurrentDate(),
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            
            
            var docsTitles = [
                "Submit to Bank",
                "Update Status"

            ];

            for(var i=0;i<docsTitles.length;i++){
                var download=false;
                var upload=true;
                if (i==0) download = true;
                if (i==0) upload = false;

                model.loanDocs[i]= {
                    "title":docsTitles[i],
                    "download": download,
                    "upload": upload
                }

            }
        },
        
        form: [

                {
                    "type":"box",
                    "title":"ACH Submission and Status Update",
                    
                                        "htmlClass": "text-danger",
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
                                                        "readonly":false,
                                                        "condition": "model.loanDocs[arrayIndex].download"
                                                    },
                                                
                                                   
                                                    {
                                                        "key": "image1",
                                                        "type": "file",
                                                        "title": "Upload ACH Status",
                                                        "condition": "model.loanDocs[arrayIndex].upload"
                                                        

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
