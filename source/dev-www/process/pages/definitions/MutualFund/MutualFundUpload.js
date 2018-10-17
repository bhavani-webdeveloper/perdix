define({
    pageUID: "MutualFund.MutualFundUpload",
    pageType: "Engine",
    dependencies: ["$log","Lead", "SessionStore", 'Utils', 'ACH', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q', 'ACHPDCBatchProcess'],

    $pageFn: function($log,Lead, SessionStore, Utils, ACH, AuthTokenHelper, PageHelper, formHelper, $filter, $q, ACHPDCBatchProcess) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "MUTUAL_FUND_UPLOAD",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Mutual Fund Upload Page got initialized");
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {},
            form: [{
                "type": "box",
                "title": "MUTUAL_FUND_UPLOAD",
                "colClass": "col-sm-6",
                "items": [{
                    "key": "lead.Bulkfile",
                    "notitle": true,
                    "title": "UPLOAD",
                    "category": "ACH",
                    "subCategory": "cat2",
                    "type": "file",
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    customHandle: function(file, progress, modelValue, form, model) {
                        Lead.leadBulkUpload(file, progress).then(function(resp){
                            $state.go('Page.LeadDashboard', null);
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