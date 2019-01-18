
define({
    pageUID: "witfin.lead.LeadBulkUpload",
    pageType: "Engine",
    dependencies: ["$log", "SessionStore", "$state", "$stateParams", "Lead", "irfNavigator", "Utils"],

    $pageFn: function($log, SessionStore, $state, $stateParams, Lead, irfNavigator, Utils) {

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
            },
            {
                "type": "box",
                "title": "LEAD_DOWNLOAD",
                "colClass": "col-sm-6",
                "items": [{
                    "type": "button",
                    "title":"DOWNLOAD",
                    "icon": "fa fa-download",
                    "notitle": true,
                    "readonly": false,
                     onClick: function(model, form, schemaForm, event) {
                        var file = irf.MANAGEMENT_BASE_URL + "/server-ext/template/LeadBulkUpload.xlsx";
                        Utils.downloadFile(file);
                        //Utils.downloadFile(irf.MANAGEMENT_BASE_URL + "/forms/AllFormsDownload.php?record_id=" + model.loanAccount.id);
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
