define({
    pageUID: "loans.individual.securityEMIRefund.SecurityEMIRefund",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "PageHelper", "SecurityEMIRefundResource", "$state", "SessionStore", "Utils", "irfNavigator", "$stateParams", "RolesPages", "$filter", "Enrollment", "Queries", "$q"],
    $pageFn: function($log, formHelper, PageHelper, SecurityEMIRefundResource, $state, SessionStore, Utils, irfNavigator, $stateParams, RolesPages, $filter, Enrollment, Queries, $q) {
        return {
            "type": "schema-form",
            "title": "SECURITY_EMI_REFUND",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.securityRefund = model.securityRefund || {};
                var data = $stateParams.pageData;
                PageHelper.showLoader();
                model.securityRefund = data;
                Enrollment.getCustomerById({
                    id: data.customerId
                }, function(response) {
                    model.bankAccountList = response;
                }, function(resp) {});
                PageHelper.hideLoader();
            },
            form: [{
                "type": "box",
                "title": "DETAILS",
                "items": [{
                        key: "securityRefund.applicantName",
                        type: "string",
                        "readonly": true,
                        title: "APPLICANT_NAME"
                    }, {
                        key: "securityRefund.businessName",
                        type: "string",
                        title: "BUSINESS_NAME",
                        readonly: true
                    }, {
                        key: "securityRefund.hub",
                        readonly: true,
                        title: "BRANCH"
                    }, {
                        key: "securityRefund.spoke",
                        readonly: true,
                        title: "CENTRE"
                    }, {
                        key: "securityRefund.loanAccountNo",
                        readonly: true,
                        title: "LOAN_ACCOUNT_NO"
                    }, {
                        key: "securityRefund.loanClosingDate",
                        type: "date",
                        title: "LOAN_CLOSING_DATE"

                    }, {
                        key: "securityRefund.refundAmount",
                        type: "number",
                        title: "REFUND_AMOUNT",
                        readonly: true

                    }

                ]
            }, {
                "type": "box",
                "title": "CUSTOMER_ACCOUNT_DETAILS",
                "items": [{
                    key: "securityRefund.bankAccountNo",
                    title: "BANK_ACCOUNT_NO",
                    type: "lov",
                    lovonly: true,
                    required: true,
                    searchHelper: formHelper,
                    search: function(inputModel, form, model, context) {
                        var accountList = model.bankAccountList.customerBankAccounts;
                        var self = this;
                        var out = [];
                        if (accountList && accountList.length) {
                            for (var i = 0; i < accountList.length; i++) {
                                if (accountList[i].accountNumber) {
                                    out.push({
                                        bankAccountNo: accountList[i].accountNumber,
                                        accountHolderName: accountList[i].customerNameAsInBank,
                                        accountType: accountList[i].accountType,
                                        IFSCode: accountList[i].ifscCode,
                                        bankName: accountList[i].customerBankName,
                                        bankBranch: accountList[i].customerBankBranchName,
                                    })
                                }
                            }
                        }
                        return $q.resolve({
                            headers: {
                                "x-total-count": out.length
                            },
                            body: out
                        });
                    },
                    onSelect: function(result, model, context) {
                        console.log(result);
                        model.securityRefund.bankAccountNo = result.bankAccountNo;
                        model.securityRefund.accountHolderName = result.accountHolderName;
                        model.securityRefund.accountType = result.accountType;
                        model.securityRefund.IFSCode = result.IFSCode;
                        model.securityRefund.bankName = result.bankName;
                        model.securityRefund.bankBranch = result.bankBranch;
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.bankAccountNo,
                            item.accountHolderName,
                            item.accountType,
                            item.IFSCode,
                            item.bankName,
                            item.bankBranch

                        ];
                    }
                }, {
                    key: "securityRefund.accountHolderName",
                    type: "string",
                    title: "ACCOUNT_HOLDER_NAME",
                    readonly: true
                }, {
                    key: "securityRefund.IFSCode",
                    title: "IFSCODE",
                    readonly: true
                }, {
                    key: "securityRefund.bankName",
                    title: "BANK_NAME",
                    readonly: true
                }, {
                    key: "securityRefund.bankBranch",
                    title: "BANK_BRANCH",
                    readonly: true
                }, {
                    key: "securityRefund.refundAmount",
                    type: "number",
                    title: "REFUND_AMOUNT",
                    readonly: true
                }]
            }, {
                "type": "box",
                "title": "DISBURSE_FROM_ACCOUNT",
                "items": [{
                    key: "securityRefund.disbursementAccountNo",
                    type: "number",
                    title: "DISBURSEMENT_ACCOUNT_NUMBER"
                }, {
                    key: "securityRefund.disbursementBankName",
                    type: "string",
                    title: "DISBURSEMENT_BANK_NAME"
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "Submit"
                }, {
                    "type": "submit",
                    "title": "hold"
                }]
            }],
            schema: function() {
                return SecurityEMIRefundResource.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                    PageHelper.showLoader();
                    PageHelper.clearErrors();
                    PageHelper.showProgress('centreCreationSubmitRequest', 'Processing');
                    model.securityRefund.transactionName = "SecurityDepositRefund";
                    console.log(model.securityRefund);
                    var tempModelData = _.clone(model.securityRefund);
                    if ((model.securityRefund.disbursementAccountNo != "") && (model.securityRefund.bankAccountNo != "")) {
                        deferred = SecurityEMIRefundResource.processrepaymentcomposite(tempModelData).$promise;
                        PageHelper.hideLoader();
                    }
                    deferred.then(function(data) {
                        PageHelper.hideLoader();
                        PageHelper.showProgress('centreCreationSubmitRequest', 'Done', 5000);
                        form.$setPristine();
                        $state.go('Page.SecurityEMIRefundSearch', null);
                    }, function(data) {
                        PageHelper.hideLoader();
                        PageHelper.showProgress('SecurityEMIRefund', 'Oops some error happend', 5000);
                        PageHelper.showErrors(data);
                    });
                },
                hold: function(model, form, formName) {}
            }
        };
    }
})