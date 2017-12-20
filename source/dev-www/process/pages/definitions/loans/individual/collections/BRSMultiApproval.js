define({
    pageUID: "loans.individual.collections.BRSMultiApproval",
    pageType: "Engine",
    dependencies: ["$log", "LoanCollection", "SessionStore", "PageHelper", "formHelper", "RolesPages", "Utils", "translateFilter", "$state", "Queries"],
    $pageFn: function ($log, LoanCollection, SessionStore, PageHelper, formHelper, RolesPages, Utils, translateFilter, $state, Queries) {
        var branch = SessionStore.getBranch();

        var loadBRSRecords = function (model) {
            PageHelper.showBlockingLoader("Loading...");
            model.loanCollectionSummaryDTOs = {};
            LoanCollection.findDepositSummaries({
                'currentStage': "BRSValidation",
                'bankAccountNumber': model.bankAccountNumber
            }).$promise.then(function (results) {
                $log.info(results)
                model.loanCollectionSummaryDTOs = results;
            }).finally(function () {
                PageHelper.hideBlockingLoader();
            });
        }
        return {
            "type": "schema-form",
            "title": "BRS_MULTI_APPROVAL",
            initialize: function (model, form, formCtrl) {
                // loadBRSRecords(model);
            },
            form: [{
                "type": "box",
                colClass: "col-sm-8",
                "title": "SEARCH",
                "items": [
                    {
                        key: "bankAccountNumber",
                        type: "lov",
                        autolov: true,
                        title: "ACCOUNT_NUMBER",
                        required: true,
                        bindMap: {},
                        outputMap: {
                            "account_number": "bankAccountNumber"
                        },
                        searchHelper: formHelper,
                        search: function (inputModel, form, model) {
                            return Queries.getBankAccountsByPartnerForLoanRepay("Kinara");
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.account_number,
                                item.ifsc_code + ', ' + item.bank_name,
                                item.branch_name
                            ];
                        },
                        onSelect: function (valueObj, model, context) {
                            loadBRSRecords(model);
                            model.bankAccountGLCode = valueObj.account_code;
                        }
                    },
                    {
                        "key": "bankAccountGLCode",
                        "type": "string",
                        "title": "GL_CODE"
                    }
                ]
            },
                {
                    "type": "box",
                    colClass: "col-sm-12",
                    "title": "LIST",
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
                        getColumns: function () {
                            return [
                                {
                                    "title": "Date",
                                    "data": "depositedOn"
                                },
                                {
                                    "title": "Reference",
                                    "data": "reference",
                                    editable: false
                                },
                                {
                                    "title": "Amount",
                                    "data": "amount",
                                    editable: false
                                },
                                {
                                    "title": "Instrument Type",
                                    "data": "instrumentType",
                                    editable: false
                                },
                                {
                                    "title": "Deposited BY",
                                    "data": "depositedby",
                                    editable: false
                                },
                                {
                                    "title": "Deposited Branch",
                                    "data": "bankBranchDetails",
                                    editable: false
                                }
                            ]
                        }
                    }]
                }, {
                    type: "actionbox",
                    condition: "model.loanCollectionSummaryDTOs.length",
                    items: [{
                        type: "submit",
                        title: "Update"
                    }]
                }
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "loanCollectionSummaryDTOs": {
                        "type": "object",
                        "properties": {}
                    }
                }
            },
            actions: {
                submit: function (model, form, formName) {
                    var temp = [];
                    for (var i = model.loanCollectionSummaryDTOs.length - 1; i >= 0; i--) {
                        var item = model.loanCollectionSummaryDTOs[i]
                        if (item.$selected) {
                            temp.push(item);
                        }
                    }
                    ;

                    var reqData = {"loanCollectionSummaryDTOs": temp};
                    if (model.loanCollectionSummaryDTOs.length >= 1) {
                        Utils.confirm("Are You Sure?")
                            .then(function () {
                                PageHelper.showLoader();
                                PageHelper.showProgress("brs-update", "Working");
                                reqData.repaymentProcessAction = "PROCEED";
                                LoanCollection.batchUpdate(reqData, function (resp, header) {
                                    PageHelper.showProgress("brs-update", "Done", 5000);
                                    loadBRSRecords(model);
                                }, function (resp) {
                                    PageHelper.showProgress("brs-update", "Failed.");
                                    PageHelper.showErrors(resp);
                                }).$promise.finally(function () {
                                    PageHelper.hideLoader();
                                });
                            })
                    }

                }

            }
        }
    }
})
