irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHMandateDownload"),
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "ACH_REGISTRATION",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("ACH Mandate Download Page got initialized");
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
                "type": "box",
                "title": "ACH_MANDATE_DOWNLOAD" ,
                "colClass":"col-sm-6",
                "items": [{
                            "key": "ach.achMandateFileId",
                            "notitle":true,
                            "category":"cat1",
                            "subCategory":"cat2",
                            "type": "file",
                            "fileType":"application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
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
            }
        }
    };
}]);