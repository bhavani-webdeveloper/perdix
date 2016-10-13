irf.pageCollection.factory(irf.page("loans.individual.collections.CreditValidation"), ["$log", "$q", 'Pages_ManagementHelper', 'LoanProcess', 'LoanAccount', 'PageHelper', 'formHelper', 'irfProgressMessage',
    'SessionStore', "$state", "$stateParams", "Masters", "authService", "Utils", "Queries",
    function ($log, $q, ManagementHelper, LoanProcess, LoanAccount, PageHelper, formHelper, irfProgressMessage,
              SessionStore, $state, $stateParams, Masters, authService, Utils, Queries) {

        return {
            "type": "schema-form",
            "title": "PAYMENT_DETAILS_FOR_LOAN",
            initialize: function (model, form, formCtrl) {
                $log.info("Credit Validation Page got initialized");

                //PageHelper.showLoader();
                irfProgressMessage.pop('loading-Credit validation-details', 'Loading Credit validation Details');
                //PageHelper
                var loanAccountNo = $stateParams.pageId;
                var promise = LoanAccount.get({
                    accountId: loanAccountNo
                }).$promise;
                promise.then(
                    function (data) { /* SUCCESS */
                        model.loanAccount = data;
                        Queries.getLoanCustomerRelations({accountNumber: loanAccountNo})
                            .then(
                                function(response){
                                    model.loanCustomerRelations = response;
                                }, function(httpRes){

                                }
                            )

                        model.creditValidation = model.creditValidation || {};
                        model.creditValidation.enterprise_name = data.customer1FirstName;
                        model.creditValidation.productCode = data.productCode;
                        model.creditValidation.urnNo = data.customerId1;
                        model.creditValidation.instrument = 'CASH_IN';
                        model.creditValidation.authorizationUsing = 'Testing-Swapnil';
                        model.creditValidation.remarks = 'collections';
                        model.creditValidation.accountNumber = data.accountId;
                        model.creditValidation.amountDue = model._credit.demandAmountInPaisa/100;
                        model.creditValidation.principal = data.totalPrincipalDue;
                        model.creditValidation.interest = data.totalNormalInterestDue;
                        model.creditValidation.applicant_name = data.applicant;
                        model.creditValidation.applicant_name = data.coapplicant;
                        model.creditValidation.penal_interest = data.totalPenalInterestDue;
                        model.creditValidation.fee = data.totalFeeDue;
                        model.creditValidation.loanRepaymentDetailsId = model._credit.id;
                        model.creditValidation.reference = model._credit.reference;
                        model.creditValidation.instrument = data.instrument;
                        model.creditValidation.isCoApplicantarray = false;
                        model.creditValidation.amountCollected = model._credit.repaymentAmountInPaisa / 100;
                        //model.creditValidation.statusValue = 1 for fully paid, 2 for partially paid
                        if (Utils.ceil(model.creditValidation.amountDue) == model.creditValidation.amountCollected) {
                            model.creditValidation.status = "Fully Paid";
                            model.creditValidation.statusValue = 1;

                        } else {
                            model.creditValidation.status = "Partially Paid";
                            model.creditValidation.statusValue = 2;
                        }


                        Queries.getCustomerBasicDetails({
                            urns: [data.customerId1]
                        }).then(
                            function (resQuery) {
                                model.creditValidation.applicant_name = resQuery.urns[data.customerId1].first_name;
                            },
                            function (errQuery) {
                            }
                        );

                        irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                    }, function (resData) {
                        irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                        PageHelper.showErrors(resData);
                        backToLoansList();
                    })
                    .finally(function () {
                        PageHelper.hideLoader();
                    })
            },

            form: [{
                "type": "box",
                "title": "Payment",
                "items": [{
                    key: "creditValidation.instrument",
                    title: "REPAYMENT_MODE",
                    readonly: true,
                    //type:"amount"
                }, {
                    key: "creditValidation.reference",
                    title: "REFERENCE_NUMBER",
                    readonly: true,
                    //type:"amount"
                }, {
                    key: "creditValidation.principal",
                    title: "PRINCIPAL",
                    readonly: true,
                    type: "amount"
                }, {
                    key: "creditValidation.interest",
                    title: "INTEREST",
                    readonly: true,
                    type: "amount"
                }, {
                    key: "creditValidation.penal_interest",
                    title: "PENAL_INTEREST",
                    readonly: true,
                    type: "amount"
                }, {
                    key: "creditValidation.fee",
                    title: "FEES_AND_OTHER_CHARGES",
                    readonly: true,
                    type: "amount"
                }, {
                    key: "creditValidation.amountDue",
                    title: "TOTAL_AMOUNT_DUE",
                    readonly: true,
                    type: "amount"
                }, {
                    key: "creditValidation.amountCollected",
                    title: "AMOUNT_COLLECTED",
                    readonly: true,
                    type: "amount"
                }, {
                    key: "creditValidation.status",
                    title: "STATUS",
                    readonly: true
                },
                    // {
                    //     key:"creditValidation.status",
                    //     title:"",
                    //     notitle:true,
                    //     type:"radios",
                    //     titleMap:{
                    //         "1":"Fully Paid",
                    //         "2":"Partially Paid",
                    //         "3":"Not Paid"
                    //         //"4":"Incorrect Information"
                    //                               }
                    // },

                    {
                        key: "creditValidation.notPaid",
                        title: "NOT_PAID",
                        type: "checkbox",
                        "schema": {
                            "default": false
                        },
                    }, {
                        key: "creditValidation.reject_reason",
                        title: "REJECT_REASON",
                        type: "select",
                        titleMap: [{
                            "name": "Amount not credited in account",
                            "value": "1"
                        }],
                        condition: "model.creditValidation.notPaid"
                    }, {
                        key: "creditValidation.reject_remarks",
                        title: "REJECT_REMARKS",
                        readonly: false,
                        type: "textarea",
                        condition: "model.creditValidation.notPaid"
                    }
                ]
            }, {
                "type": "box",
                "title": "LOAN_INFORMATION",
                "items": [{
                    key: "creditValidation.enterprise_name",
                    title: "ENTERPRISE_NAME",
                    readonly: true
                },
                    {
                        key: "creditValidation.accountNumber",
                        title: "LOAN_ACCOUNT_NUMBER",
                        readonly: true,
                        //type:"amount"
                    },
                    {
                        "type": "array",
                        "key": "loanCustomerRelations",
                        "add": null,
                        "remove": null,
                        "view": "fixed",
                        "titleExpr": "model.loanCustomerRelations[arrayIndex].relation | translate",
                        "items": [
                            {
                                "key": "loanCustomerRelations[].first_name",
                                "type": "string",
                                "title": "NAME"
                            },
                            {
                                "key": "loanCustomerRelations[].urn",
                                "type": "string",
                                "title": "URN_NO"
                            }
                        ]
                    },
                    ]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }],
            schema: function () {
                return ManagementHelper.getVillageSchemaPromise();
            },
            actions: {
                submit: function (model, form, formName) {
                    $log.info("Inside submit()");
                    console.warn(model);
                    Utils.confirm("Are You Sure?")
                        .then(function () {
                            PageHelper.showLoader();
                            if (model.creditValidation.notPaid) {
                                $log.info("Inside NoPayment()");
                                var reqParams = {
                                    "loanRepaymentDetailsId": model.creditValidation.loanRepaymentDetailsId,
                                    "remarks": model.creditValidation.reject_remarks,
                                    "rejectReason": model.creditValidation.reject_reason
                                };
                                LoanProcess.reject(reqParams, null, function (response) {
                                    PageHelper.hideLoader();
                                    $state.go('Page.Engine', {
                                        pageName: 'loans.individual.collections.CreditValidationQueue',
                                        pageId: null
                                    });

                                }, function (errorResponse) {
                                    PageHelper.hideLoader();
                                    PageHelper.showErrors(errorResponse);
                                });
                            } else if (model.creditValidation.statusValue == 1) {
                                $log.info("Inside FullPayment()");
                                LoanProcess.approve({
                                    "loanRepaymentDetailsId": model.creditValidation.loanRepaymentDetailsId
                                }, null, function (response) {
                                    PageHelper.hideLoader();
                                    PageHelper.navigateGoBack();
                                }, function (errorResponse) {
                                    PageHelper.hideLoader();
                                    PageHelper.showErrors(errorResponse);
                                });

                            } else if (model.creditValidation.statusValue == 2) {
                                $log.info("Inside PartialPayment()");
                                var reqParams = {
                                    "id": model.creditValidation.loanRepaymentDetailsId
                                };
                                LoanProcess.partialPayment(reqParams, null, function (response) {
                                    PageHelper.hideLoader();
                                    $state.go('Page.Engine', {
                                        pageName: 'loans.individual.collections.CreditValidationQueue',
                                        pageId: null
                                    });

                                }, function (errorResponse) {
                                    PageHelper.hideLoader();
                                    PageHelper.showErrors(errorResponse);
                                });

                            }
                        })

                }
            }
        };
    }
]);
