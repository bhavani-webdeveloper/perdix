irf.pageCollection.factory(irf.page('loans.Repossession'), ["$log", "$q", "$timeout", "SessionStore", "$state", "LoanProcess", "formHelper", "IndividualLoan", "$stateParams", "LoanAccount", "irfProgressMessage",
    "PageHelper", "irfStorageService", "$filter", "Files", "elementsUtils", "Queries", "Utils", "AuthTokenHelper","irfNavigator",
    function($log, $q, $timeout, SessionStore, $state, LoanProcess, formHelper, IndividualLoan, $stateParams, LoanAccount, irfProgressMessage, PageHelper, StorageService, $filter, Files, elementsUtils, Queries, Utils, AuthTokenHelper, irfNavigator) {
        return {
            "type": "schema-form",
            "title": "REPOSSESSION",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                var loanAccountId = $stateParams.pageId;
                model.loanAccount = model.loanAccount || [];
                model.reqData = model.reqData || {};
                model.reqData.loanAccount = model.reqData.loanAccount || {};
                IndividualLoan.get({
                        id: loanAccountId
                    })
                    .$promise
                    .then(function(res) {
                        model.loanAccount = res;
                    })
            },

            offline: false,
            form: [{
                "type": "box",
                "title": "REPOSSESSION_STATUS",
                "items": [{
                    "title": "Loan Account No",
                    "readonly": true,
                    "key": "loanAccount.accountNumber"
                }, {
                    "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf7",
                     "type": "select",
                     "enumCode": "repo_status",
                     "title": "REPOSSESSION_STATUS"
                }]
            },
            {
                "type": "actionbox",
                "items": [{
                    "type": "update",
                    "title": "UPDATE",
                    "onClick": "actions.update(model, formCtrl, form, $event)"
                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "amand": {
                        "type": "object",
                        "required": [],
                        "properties": {
                            "accountId": {
                                "type": "string",
                                "title": "ACCOUNT_ID"
                            },
                            "tenure": {
                                "type": "number",
                                "title": "TENURE"
                            }
                        }
                    }
                }
            },
            actions: {
                update: function(model, formCtrl, form, $event) {
                    /* 1)This update is used to update the Existing Document section ,
                    2) separate pageConfig is required to enable this button as it is role specific
                    */
                    $log.info(model);
                    PageHelper.clearErrors();
                    var reqData = {
                        loanAccount : null,
                        loanProcessAction : "SAVE"
                    };

                    reqData.loanAccount = _.cloneDeep(model.loanAccount);
                    
                    PageHelper.showLoader();
                    IndividualLoan.update(reqData).$promise.then(function(response) {
                        PageHelper.hideLoader();
                        $log.info(response);
                        PageHelper.showProgress("Loan_Document_Upload", "Update Successful", 5000);
                        PageHelper.hideLoader();
                        irfNavigator.goBack();
                    }, function(errorResponse) {
                        PageHelper.showErrors(errorResponse);
                        PageHelper.showProgress("Loan_Document_Upload", "Oops. An Error Occurred", 5000);
                        PageHelper.hideLoader();
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });

                }
            }
        };
    }
]);