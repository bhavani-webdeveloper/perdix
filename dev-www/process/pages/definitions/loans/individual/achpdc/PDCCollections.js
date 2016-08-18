irf.pageCollection.factory(irf.page("PDCCollections"),
["$log", "Enrollment", "SessionStore",'Utils', function($log, Enrollment, SessionStore,Utils){

    

    return {
        "id": "PDCCollections",
        "type": "schema-form",
        "name": "PDCCollections",
        "title": "PDC Collections",
        "subTitle": Utils.getCurrentDate(),
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");
            
            
            var docsTitles = [
                "Kaushik G | HPL | 9057328 | Trichy branch",
                "Bala R | GKMB Cotton Exports Pvt. Ltd. | 3562678 | Dindigul branch"
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
                                                        "title":"Cheque Number",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"Bank Name",
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
                                                    },
                                                    {
                                                        "title":"PDC Lost Reason",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"PDC Returned Reason",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"PDC Error Action",
                                                        "htmlClass":"btn-block",
                                                        "icon":"fa fa-download",
                                                        //"type":"button",
                                                        "readonly":false
                                                    },
                                                    {
                                                        "title":"Record PDC Non-payment",
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
