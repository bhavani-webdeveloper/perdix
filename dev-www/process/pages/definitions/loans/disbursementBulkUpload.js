irf.pageCollection.factory(irf.page("disbursementBulkUpload"),
["$log", "Enrollment", "SessionStore", function($log, Enrollment, SessionStore){

    var branch = SessionStore.getBranch();

    return {
        "id": "disbursementBulkUpload",
        "type": "schema-form",
        "name": "disbursementBulkUpload",
        "title": "Disbursement Bulk Upload",
        "subTitle": " ",
        initialize: function (model, form, formCtrl) {
            $log.info("Disbursement Bulk Upload");
         },
        offline: true,
        
        form: [
                
                {
                "type":"box",
                "title":"Download",
                items:[
                       
                        {
                            type:"button",
                            key:"download",
                            title:"Disbursement Download",
                            "htmlClass":"btn-block",
                            "icon":"fa fa-download"
                        }
                      ]

                },
                {
                "type":"box",
                "title":"Upload",
                items:[
                       
                        {
                            type:"file",
                            key:"upload",
                            title:"Disbursement Bulk Upload",
                            fileType:"application/vnd.ms-excel"
                        }
                      ]

                }

        ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
            }
        }
    };
}]);
