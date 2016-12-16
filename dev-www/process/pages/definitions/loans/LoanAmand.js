irf.pageCollection.factory(irf.page('loans.LoanAmand'), ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "LoanAccount", "irfProgressMessage",
    "PageHelper", "irfStorageService", "$filter", "Files", "elementsUtils", "Queries", "Utils", "AuthTokenHelper",
    function($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, LoanAccount, irfProgressMessage,
        PageHelper, StorageService, $filter, Files, elementsUtils, CustomerBankBranch, Queries, Utils, IndividualLoan, LoanCollection, AuthTokenHelper) {

        function backToLoansList() {
            try {
                var urnNo = ($stateParams.pageId.split("."))[1];
                $state.go("Page.Engine", {
                    pageName: "customer360.loans.View",
                    pageId: urnNo
                });
            } catch (err) {
                console.log(err);
            }
        }

        return {
            "type": "schema-form",
            "title": "LOAN_AMENDMENT",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {

                model.amand = {};
                //model.authToken = AuthTokenHelper.getAuthData().access_token;
                model.amand.amendmentType = "Tenure";
                var loanAccountNo = ($stateParams.pageId.split("."))[0];
                var promise = LoanAccount.get({
                    accountId: loanAccountNo
                }).$promise;

                promise.then(function(data) {
                    $log.info(data);
                    model.amand.accountId = data.accountId;
                    model.amand.frequency = data.tenureUnit;
                    model.amand.currentTenure = data.tenureMagnitude;



                    irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                }, function(resData) {
                    irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                    PageHelper.showErrors(resData);
                    backToLoansList();
                });

            },

            offline: false,
            form: [{
                "type": "box",
                "title": "TENURE_AMENDMENT",
                "items": [{
                    key: "amand.accountId",
                    readonly: true,
                    title: "ACCOUNT_ID",
                }, {
                    key: "amand.currentTenure",
                    readonly: true,
                    title: "CurrentTenure",
                }, {
                    key: "amand.frequency",
                    readonly: true,
                    title: "Frequency",
                }, {
                    type: "fieldset",
                    title: "New_TENURE",
                    items: [{
                        key: "amand.tenure",
                        title: "TENURE",
                    }]
                }, {
                    key: "amand.submit",
                    title: "SUBMIT",
                    type: "button",
                    onClick: function(model) {
                        $log.info("Inside submit()");
                        $log.warn(model);
                        var sortFn = function(unordered) {
                            var out = {};
                            Object.keys(unordered).sort().forEach(function(key) {
                                out[key] = unordered[key];
                            });
                            return out;
                        };
                        var reqData = _.cloneDeep(model.amand);

                        var promise = LoanAccount.updateTenure(reqData).$promise;
                        promise.then(
                            function(response) {
                                model.amand.tenuredownload = true;
                                $log.info(response);
                                irfProgressMessage.pop('New Tenure Updated', 'Loan Save', 2000);
                            },
                            function(error) {
                                irfProgressMessage.pop('Tenure Update', 'Error Updating new tenure details.', 4000);
                                PageHelper.showErrors(error);
                            });
                    }
                }, {
                    type: "fieldset",
                    condition: "model.amand.tenuredownload",
                    title: "DOWNLOAD_NEW_TENURE",
                    items: [{
                        "title": "DOWNLOAD",
                        "htmlClass": "btn-block",
                        "icon": "fa fa-download",
                        "type": "button",
                        "notitle": true,
                        "readonly": false,
                        /*"onClick": function(model, formCtrl, form, $event) {
                            PageHelper.clearErrors();
                            PageHelper.showLoader();
                            ACH.demandDownloadStatus({
                                "demandDate": model.achCollections.demandDate,
                                "branchId": branchIDArray.join(",")
                            }).$promise.then(
                                function(response) {
                                    window.open(irf.BI_BASE_URL + "/download.php?user_id=" + model.userLogin + "&auth_token=" + model.authToken + "&report_name=ach_demands&date=" + model.achCollections.demandDate);
                                    PageHelper.showProgress("page-init", "Success", 5000);
                                },
                                function(error) {
                                    PageHelper.showProgress("page-init", error, 5000);
                                }).finally(function() {
                                PageHelper.hideLoader();
                            });
                        }*/
                    }]
                }, ]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "style": "btn-theme",
                    "title": "SUBMIT"

                }, ]
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
                submit: function(model, form, formName) {
                    $log.info('on submit action ....');
                    $log.warn(model);
                    var sortFn = function(unordered) {
                        var out = {};
                        Object.keys(unordered).sort().forEach(function(key) {
                            out[key] = unordered[key];
                        });
                        return out;
                    };
                    var reqData = _.cloneDeep(model.customer);
                    Maintenance.updateSpoke(reqData, null).$promise.then(
                        function(response) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress("Spoke updated", "Done.", 2000);
                        },
                        function(errorResponse) {
                            PageHelper.hideLoader();
                            PageHelper.showErrors(errorResponse);
                        }
                    );
                },
            }
        };
    }
]);