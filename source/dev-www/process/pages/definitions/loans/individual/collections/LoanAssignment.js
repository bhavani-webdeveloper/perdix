define({
    pageUID: "loans.individual.collections.LoanAssignment",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "LUC", "$state", "SessionStore", "Utils", "irfNavigator", "RepaymentReminder", "Queries", "LoanCollection"],
    $pageFn: function($log, formHelper, LUC, $state, SessionStore, Utils, irfNavigator, RepaymentReminder, Queries, LoanCollection) {
        return {
            "type": "schema-form",
            "title": "LOAN_ASSIGNMENT",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.upload={};
                $log.info("LoanAssignment Page got initialized");
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {},
            form: [{
                "type": "box",
                "title": "LOAN_ASSIGNMENT_UPLOAD",
                "colClass": "col-sm-6",
                "items": [{
                    "key": "upload.uploadApplication",
                    "title": "CHOOSE_YOUR_UPLOAD_FILE",
                    "category": "ACH",
                    "subCategory": "cat2",
                    "type": "file",
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    customHandle: function(file, progress, modelValue, form, model) {
                        LoanCollection.loanAssignmentUpload(file, progress).then(function(resp){
                            model.upload.uploadApplication = null;
                            // irfNavigator.go({
                            //         state: "Page.Engine",
                            //         pageName: "loans.individual.collections.LoanAssignment"
                            //     });
                            // //$state.go('Page.loans.individual.collections.LoanAssignment', null);
                        });
                    }
                }]
            },
            {
                "type": "actionbox",
                "items": [{
                    type: "button",
                    icon: "fa fa-step-backward",
                    title: "Go Back",
                    onClick: function(model, formCtrl) {
                        irfNavigator.goBack();
                    }
                }]
            }],

            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "upload": {
                        "type": "object",
                        "properties": {

                        }
                    }
                },
            },
        };
    }
})
