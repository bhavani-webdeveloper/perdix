irf.pageCollection.factory(irf.page("loans.PayersDetails"),
    ["$log", "Queries", "SessionStore", "$state", "$stateParams", "formHelper", "LoanProcess", "LoanAccount", "Utils", "PageHelper", "$q",
        function ($log, Queries, SessionStore, $state, $stateParams, formHelper, LoanProcess, LoanAccount, Utils, PageHelper, $q) {

            var branch = SessionStore.getBranch();

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
                "title": "Payers Deatils",
                initialize: function (model, form, formCtrl) {
                    model.customer = model.customer || {};
                    model.loanAccount = model.loanAccount || [];
                    var loanAccountNo = ($stateParams.pageId.split("."))[0];

                    var promise = LoanAccount.get({
                        accountId: loanAccountNo
                    }).$promise;
                    IndividualLoan.get({
                        id: loanAccountId
                    })
                        .$promise
                        .then(function (res) {
                            model.loanAccount = res;
                        })
                    promise.then(function (data) {
                        $log.info(data);
                        model.customer.amount = data.amount;
                        model.customer.npa = data.npa;
                        model.customer.accountNumber = data.accountId;
                        //model.customer.valueDate=data.disbursementByDate;
                        model.customer.valueDate = (data.disbursementByDate != null) ? moment(data.disbursementByDate).format("YYYY-MM-DD") : null;
                        PageHelper.showProgress('loading-loan-details', 'Loaded.', 2000);
                    }, function (resData) {
                        PageHelper.showProgress('loading-loan-details', 'Error loading Loan details.', 4000);
                        PageHelper.showErrors(resData);
                        backToLoansList();
                    });
                    $log.info("Unmark NPA Screen got initialized");
                },
                form: [
                    {
                        "type": "box",
                        "title": "PAYER_DETAILS",
                        "condition": "model.siteCode != 'IREPDhan'",
                        "items": [
                            {
                                "key": "loanAccount.payeeName",
                                "title": "PAYEE_NAME",
                                "readonly": true
                            },
                            {
                                "key": "loanAccount.payeeMobileNumber",
                                "title": "PAYEE_MOBILE_NUMBER",
                                "inputmode": "number",
                                "numberType": "tel",
                                "readonly": true
                            },
                            {
                                "key": "loanAccount.payeeRelationToApplicant",
                                "title": "PAYEE_RELATION",
                                "type": "select",
                                "enumCode": "payerRelation",
                                "readonly": true
                            }
                        ]
                    }
                ],
                schema: {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "type": "object",
                    "properties": {
                        "customer": {
                            "type": "object",
                            "properties": {
                                "accountId": {
                                    "type": "string"
                                }
                            }
                        }
                    }
                },
                actions: {

                }
            };
        }]);


