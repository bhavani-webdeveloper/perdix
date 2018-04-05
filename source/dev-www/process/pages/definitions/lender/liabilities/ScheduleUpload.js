

irf.pageCollection.factory(irf.page("lender.liabilities.ScheduleUpload"),
["$log", "Enrollment", "SessionStore","$state", "$stateParams", "ACH","Schedule", function($log, Enrollment, SessionStore,$state,$stateParams, ACH,Schedule){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "SCHEDULE_UPLOAD",
        "subTitle": "",

        initialize: function (model, form, formCtrl) {
            $log.info("ACH Mandate Upload Page got initialized");
        },
        offline: false,

         getOfflineDisplayItem: function(item, index) {},
            form: [{
                "type": "box",
                "title": "SCHEDULE_UPLOAD",
                "colClass": "col-sm-6",
                "items": [{
                    "key": "schedule.Bulkfile",
                    "notitle": true,
                    "title": "SCHEDULE_UPLOAD",
                    "category": "ACH",
                    "subCategory": "cat2",
                    "type": "file",
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    customHandle: function(file, progress, modelValue, form, model) {
                        Schedule.scheduleUpload(file, progress);
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
}]);