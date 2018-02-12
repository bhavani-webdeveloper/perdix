irf.pageCollection.factory(irf.page('loans.FreezeAccount'), ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
    "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "Utils",
    function($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, Utils) {

        function backToLoansList() {
            try {
                var urnNo = ($stateParams.pageId.split("."))[1];
                $state.go("Page.Engine", {
                    pageName: "customer360.loans.View",
                    pageId: urnNo
                });
            } catch (err) {
                console.log(err);
                // @TODO : Where to redirect if no page params present
            }
        }
        return {
            "id": "FreezeAccount",
            "type": "schema-form",
            "name": "FreezeAccount",
            "title": "FREEZE_ACCOUNT",
            initialize: function(model, form, formCtrl) {
                PageHelper.showLoader();
                irfProgressMessage.pop('loading-loan-details', 'Loading Loan Details');
                model.bankName = SessionStore.getBankName();
                model.branch = SessionStore.getBranch();
                model.branchId = SessionStore.getBranchId();
                model.branchCode = SessionStore.getBranchCode();
                //PageHelper
                var loanAccountNo = ($stateParams.pageId.split("."))[0];
                console.log(model.freezeAcc.partner)
                console.log("model.freezeAcc.partner")
                var promise = LoanAccount.get({
                    accountId: loanAccountNo
                }).$promise;
                promise.then(function(data) {
                        model.loanAccount = data;
                        console.log(data);
                        model.freezeAcc = {
                            'accountId': data.accountId,
                            'urnNo': data.customerId1,
                            'productCode': data.productCode
                        };
                        model.freezeAcc.partner = ($stateParams.pageId.split("."))[1];
                        irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                    }, function(resData) {
                        irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                        PageHelper.showErrors(resData);
                    })
                    .finally(function() {
                        PageHelper.hideLoader();
                    })

            },
            offline: false,
            form: [{
                "type": "box",
                "title": "FREEZE_ACCOUNT",
                "items": [{
                        key: "freezeAcc.accountId",
                        readonly: true
                    }, {
                        key: "freezeAcc.productCode",
                        readonly: true
                    }, {
                        key: "freezeAcc.partner",
                        readonly: true
                    }, {
                        key: "freezeAcc.urnNo",
                        readonly: true
                    },
                    "freezeAcc.freezeAccount"
                ]
            }, {
                "type": "actionbox",
                "condition": "model.freezeAcc.freezeAccount",
                "items": [{
                    "type": "submit",
                    "style": "btn-theme",
                    "title": "SUBMIT"
                }]
            }],

            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "freezeAcc": {
                        "type": "object",
                        "properties": {
                            "accountId": {
                                "type": "string",
                                "title": "ACCOUNT_ID"
                            },
                            "productCode": {
                                "type": "string",
                                "title": "PRODUCT_CODE"
                            },
                            "partner": {
                                "type": "string",
                                "title": "PARTNER"
                            },
                            "urnNo": {
                                "type": "string",
                                "title": "URN_NO"
                            },
                            "freezeAccount": {
                                "type": "boolean",
                                "title": "Do you want to freeze account?",
                                "captureStages": [
                                    "Stage01"
                                ]
                            },
                        },
                    },
                },
            },
            actions: {
                submit: function(model, formCtrl, formName) {
                    $log.info("Inside submit");
                    PageHelper.showLoader();
                    var accountId = model.freezeAcc.accountId;
                    var promise = LoanAccount.freezeAccount({
                        accountId: accountId
                    }).$promise;
                    promise.then(function(data) { /* SUCCESS */
                            $log.info(data)
                            PageHelper.showProgress("freezeAccount", 'Account freezed successfully.', 5000);
                        }, function(resData) {
                            PageHelper.showProgress("freezeAccount", "Fail to freeze account", 5000);
                        })
                        .finally(function() {
                            PageHelper.hideLoader();
                        })


                }
            }
        }
    }
]);