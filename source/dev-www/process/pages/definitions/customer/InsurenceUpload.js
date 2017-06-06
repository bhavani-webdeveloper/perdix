irf.pageCollection.factory("Pages__InsurenceUpload",
 ["$log", "SessionStore", "$state", "$stateParams","Enrollment",
    function($log, SessionStore, $state, $stateParams,Enrollment) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form", 
            "title": "INSURENCE_UPLOAD",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.lead={};
                $log.info("Insurence Upload  Page got initialized");
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {},
            form: [{
                "type": "box",
                "title": "INSURENCE_UPLOAD",
                "colClass": "col-sm-6",
                "items": [{
                    "key": "lead.Bulkfile",
                    "notitle": true,
                    "title": "LEAD_UPLOAD",
                    "category": "ACH",
                    "subCategory": "cat2",
                    "type": "file",
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    customHandle: function(file, progress, modelValue, form, model) {
                        Enrollment.insuranceUpload(file, progress).then(function(resp){
                           $state.go("Page.Landing");
                        });
                    }
                }]
            }],
            schema: function() {

               return Enrollment.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {

                },
                proceed: function(model, formCtrl, form, $event) {}
            }
        };
    }
]);