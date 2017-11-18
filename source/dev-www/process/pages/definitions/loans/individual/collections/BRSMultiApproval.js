define({
    pageUID: "loans.individual.collections.BRSMultiApproval",
    pageType: "Engine",
    dependencies: ["$log", "LoanCollection", "SessionStore", "PageHelper", "formHelper", "RolesPages", "Utils", "translateFilter", "$state"],
    $pageFn: function($log, LoanCollection, SessionStore, PageHelper, formHelper, RolesPages, Utils, translateFilter, $state) {
        var branch = SessionStore.getBranch();

        var loadBRSRecords = function(model){
            PageHelper.showBlockingLoader("Loading...");
            model.loanCollectionSummaryDTOs = {};
            LoanCollection.findDepositSummaries({
                'currentStage': "BRSValidation",
            }).$promise.then(function(result) {
                $log.info(result)
                $log.info("result")
                if (result && result.length) {
                    model.loanCollectionSummaryDTOs = [];
                    for (var i = 0; i < result.length; i++) {
                        model.loanCollectionSummaryDTOs.push(result[i]);
                    };
                }
            }).finally(function() {
                PageHelper.hideBlockingLoader();
            });
        }
        return {
            "type": "schema-form",
            "title": "BRS_MULTI_APPROVAL",
            initialize: function(model, form, formCtrl) {
                loadBRSRecords(model);
            },
            form: [{
                "type": "box",
                colClass: "col-sm-12",
                "title": "BRS_MULTI_APPROVAL",
                "items": [{
                    key: "loanCollectionSummaryDTOs",
                    condition: "model.loanCollectionSummaryDTOs.length",
                    type: "tableview",
                    "notitle": true,
                    "selectable": true,
                    "editable": true,
                    "tableConfig": {
                        "searching": true,
                        "paginate": true,
                        "pageLength": 10
                    },
                    getColumns: function() {
                        return [{
                            "title": "Account Number",
                            "data": "depositId_loanAccountNumber",
                            render: function(data, type, full, meta) {
                                return '<i class="' + full.icon_class + '">&nbsp;</i>' + translateFilter(data);
                            },
                            editable: false
                        }, {
                            "title": "Amount",
                            "data": "amount",
                            editable: false
                        }, {
                            "title": "Instrument Type",
                            "data": "instrumentType",
                            editable: false
                        }, {
                            "title": "Bank Account Number",
                            "data": "bankAccountNumber",
                            editable: false
                        }, {
                            "title": "Deposited BY",
                            "data": "depositedby",
                            editable: false
                        }, {
                            "title": "Deposited On",
                            "data": "depositedOn",
                            editable: false
                        }, {
                            "title": "Reference",
                            "data": "reference",
                            editable: false
                        }, {
                            "title": "Loan Collection Id",
                            "data": "loanCollectionId",
                            editable: false
                        }]
                    }
                }]
            }, {
                type: "actionbox",
                condition: "model.loanCollectionSummaryDTOs.length",
                items: [{
                    type: "submit",
                    title: "Update"
                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "loanCollectionSummaryDTOs": {
                        "type": "object",
                        "properties": {

                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    var temp = [];
                    for (var i = model.loanCollectionSummaryDTOs.length - 1; i >= 0; i--) {
                        var item = model.loanCollectionSummaryDTOs[i]
                        if (item.$selected) {
                            temp.push(item);
                        }
                    };

                    var reqData = {"loanCollectionSummaryDTOs": temp};
                    if (model.loanCollectionSummaryDTOs.length >= 1) {
                        Utils.confirm("Are You Sure?")
                            .then(function() {
                                PageHelper.showLoader();
                                PageHelper.showProgress("brs-update", "Working");
                                reqData.repaymentProcessAction = "PROCEED";
                                LoanCollection.batchUpdate(reqData, function(resp, header) {
                                    PageHelper.showProgress("brs-update", "Done", 5000);
                                    loadBRSRecords(model);
                                }, function(resp) {
                                    PageHelper.showProgress("brs-update", "Failed.");
                                    PageHelper.showErrors(resp);
                                }).$promise.finally(function() {
                                    PageHelper.hideLoader();
                                });
                            })
                    }

                }

            }
        }
    }
})
