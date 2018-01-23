
define({
    pageUID: "witfin.lead.LeadBulkUpload",
    pageType: "Engine",
    dependencies: ["$log", "SessionStore", "$state", "$stateParams", "Lead", "irfNavigator"],

    $pageFn: function($log, SessionStore, $state, $stateParams, Lead, irfNavigator) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "LEAD_DATA_BULK_UPLOAD",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("LeadBulkUpload  Page got initialized");
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {},
            form: [{
                "type": "box",
                "title": "LEAD_UPLOAD",
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
                        Lead.leadBulkUpload(file, progress).then(function(resp){
                            irfNavigator.go({
                                state: "Page.Adhoc",
                                pageName: "witfin.loans.LoanOriginationDashboard"
                            });
                        });
                    }
                }]
            }],
            schema: function() {
                return Lead.getLeadSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {

                },
                proceed: function(model, formCtrl, form, $event) {}
            }
        };
    }
})
