irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHMandateUpload"),
["$log", "Enrollment", "SessionStore","$state", "$stateParams", "ACH", function($log, Enrollment, SessionStore,$state,$stateParams, ACH){
/*
ACHMandateUpload.js is to Upload the ACH Mandate Registration Reverse Feed into the system(Status will be 
either approved by bank/ rejected by bank) 

*/
    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "ACH_REGISTRATION",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("ACH Mandate Upload Page got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            
                "type": "box",
                "title": "ACH_MANDATE_UPLOAD" ,
                "colClass":"col-sm-6",
                "items": [{
                            "key": "ach.achMandateReverseFileId",
                            "notitle":true,
                            "category":"ACH",
                            "subCategory":"cat2",
                            "type": "file",
                            "fileType":"application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            customHandle: function(file, progress, modelValue, form, model) {
                                ACH.achMandateUpload(file, progress);
                            }
                        },
                        {
                            "type": "button",
                            "icon": "fa fa-user-plus",
                            "title": "UPLOAD",
                            "onClick": "actions.proceed(model, formCtrl, form, $event)"
                        }]
            }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'loans.individual.achpdc.ACHMandateUpload',
                        pageId: model.customer.id
                    });
            },
            proceed: function(model, formCtrl, form, $event) {
            }
        }
    };
}]);