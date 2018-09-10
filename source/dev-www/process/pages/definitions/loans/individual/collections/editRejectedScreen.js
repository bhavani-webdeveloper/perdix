define({
    pageUID: "loans.individual.collections.editRejectedScreen",
    pageType: "Engine",
    dependencies: ["$log","CustomerBankBranch","SessionStore", "formHelper", "$stateParams", "PageHelper", "Utils", "LoanCollection", "irfNavigator","Queries","Files"],
    $pageFn: function ($log,CustomerBankBranch,SessionStore, formHelper, $stateParams, PageHelper, Utils, LoanCollection, irfNavigator, Queries, Files) {
        return {
            "type": "schema-form",
            "title": "EDIT_REJECTED_SCREEN",
            initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                model.branchname = SessionStore.getCurrentBranch().branchId;
                model.loanDetails = $stateParams.pageData;
                $log.info(model.loanDetails);
            },
            form: [{
                "type": "box",
                "title": "LOAN_DETAIL",
                "items": [
                    {
                        "key": "loanDetails.accountNumber",
                        "title":"LOAN_ACCOUNT_NUMBER",
                        "type": "string",
                        "readonly": true
                    },
                    {
                        "key": "loanDetails.customerName",
                        "title":"CUSTOMER_NAME",
                        "type":"string",
                        "readonly": true
                    },
                    {
                        "key":"loanDetails.reference",
                        "title":"REFERENCE_NUMBER",
                        "type":"string",
                        "readonly": true
                    },
                    {
                        "type": "button",
                        "title": "submit",
                        "onClick": "actions.submit(model, formCtrl, form, $event)"
                    }
                ]
            }
        ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "collectionDetails1": {
                        "type": "object",
                        "properties": {
                            "customerName": {
                                "type": ["string", null],
                                "title": "BUSINESS_NAME"
                            },
                            "accountNumber": {
                                "type": ["string", null],
                                "title": "LOAN_ACCOUNT_NO"

                            },
                            "repaymentAmount": {
                                "type": ["string", null],
                                "title": "Collected Amount"
                            }
                        }
                    }
                },
                "required": [
                "review.remarks"
                ]
            },
            eventListeners: {},
            actions: {
                submit: function (model, formCtrl, form, $event) {

                }
            }
        }
    }
})