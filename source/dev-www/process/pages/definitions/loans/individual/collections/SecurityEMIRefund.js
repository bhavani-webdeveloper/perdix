define({
    pageUID: "loans.individual.collections.SecurityEMIRefund",
    pageType: "Engine",
    dependencies: ["$log", "formHelper","LoanAccount","irfProgressMessage", "IndividualLoan", "Queries", "PageHelper", "SecurityEMIRefundResource", "$state", "SessionStore", "Utils", "irfNavigator", "$stateParams", "RolesPages", "$filter", "Enrollment", "Queries", "$q"],
    $pageFn: function($log, formHelper,LoanAccount,irfProgressMessage, IndividualLoan, Queries, PageHelper, SecurityEMIRefundResource, $state, SessionStore, Utils, irfNavigator, $stateParams, RolesPages, $filter, Enrollment, Queries, $q) {
        return {
            "type": "schema-form",
            "title": "SECURITY_EMI_REFUND",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.securityRefund = model.securityRefund || {};
                if ($stateParams && $stateParams.pageData) {
                    var data = $stateParams.pageData;
                    model.securityRefund.amount = data.amount1;
                }

                if ($stateParams.pageId) {
                    PageHelper.showLoader();
                    IndividualLoan.search({
                        'accountNumber': $stateParams.pageId
                    }).$promise.then(function(res) {
                        $log.info(res);
                        model.securityRefund.applicantName = res.body[0].applicantName||"";
                        model.securityRefund.businessName = res.body[0].customerName||"";
                        model.securityRefund.hub = res.body[0].branchName;
                        model.securityRefund.spoke = res.body[0].centreName;
                        var promise = LoanAccount.get({
                            accountId: $stateParams.pageId
                        }).$promise;
                        promise.then(function(data) { /* SUCCESS */
                            model.cbsLoanData = data;
                            model.securityRefund.productCode = data.productCode;
                            model.securityRefund.urnNo = data.customerId1;
                            model.securityRefund.instrument = 'CASH';
                            model.securityRefund.authorizationUsing = '';
                            model.securityRefund.remarks = '';
                            model.securityRefund.accountNumber = data.accountId;
                            model.securityRefund.loanAccountNumber = data.accountId;
                            model.securityRefund.customerName = data.customer1FirstName;
                            model.securityRefund.productCode = data.productCode;
                            model.securityRefund.visitedDate = SessionStore.getCBSDate();
                            model.securityRefund.repaymentDate=SessionStore.getCBSDate();
                            model.securityRefund.urnNo = data.customerId1;
                            model.securityRefund.payOffAndDueAmount = Utils.ceil(data.payOffAndDueAmount);
                            model.securityRefund.totalFeeDue = Utils.roundToDecimal(data.totalFeeDue);
                            model.securityRefund.recoverableInterest = Utils.roundToDecimal(data.recoverableInterest);
                            model.securityRefund.principalNotDue = Utils.roundToDecimal(data.principalNotDue);
                            model.securityRefund.totalNormalInterestDue = Utils.roundToDecimal(data.totalNormalInterestDue);
                            model.securityRefund.preclosureFee = Utils.roundToDecimal(data.preclosureFee);
                            model.securityRefund.payOffAmount = Utils.roundToDecimal(data.payOffAmount);
                            model.securityRefund.totalDemandDue = Utils.roundToDecimal(data.totalDemandDue);
                            model.securityRefund.totalDue = Utils.roundToDecimal(data.totalDemandDue + data.totalFeeDue + data.totalSecurityDepositDue);
                            model.securityRefund.bookedNotDueNormalInterest = Utils.roundToDecimal(data.bookedNotDueNormalInterest);
                            model.securityRefund.bookedNotDuePenalInterest = Utils.roundToDecimal(data.bookedNotDuePenalInterest);
                            model.securityRefund.securityDeposit = Utils.roundToDecimal(data.securityDeposit);
                            model.securityRefund.netPayoffAmount = Utils.roundToDecimal(data.payOffAmount + data.preclosureFee - data.securityDeposit);
                            model.securityRefund.totalPayoffAmountToBePaid = Utils.roundToDecimal(data.payOffAndDueAmount + data.preclosureFee - data.securityDeposit);
                            model.securityRefund.totalSecurityDepositDue = Utils.roundToDecimal(data.totalSecurityDepositDue);

                            //_pageGlobals.totalDemandDue = data.totalDemandDue;

                            irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                        }, function(resData) {
                            irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                            PageHelper.showErrors(resData);
                        });
                        PageHelper.hideLoader();
                    }, function(err) {
                        PageHelper.hideLoader();
                    })


                }
            },
            form: [{
                "type": "box",
                "title": "DETAILS",
                "items": [ {
                        key: "securityRefund.hub",
                        readonly: true,
                        title: "BRANCH"
                    }, {
                        key: "securityRefund.spoke",
                        readonly: true,
                        title: "CENTRE"
                    },{
                        key: "securityRefund.urnNo",
                        readonly: true,
                        title: "URN_NO"
                    },{
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
                        key: "securityRefund.accountNumber",
                        readonly: true,
                        title: "LOAN_ACCOUNT_NO"
                    }, {
                        key: "cbsLoanData.closedOnValueDate",
                        "condition":"model.cbsLoanData.closedOnValueDate",
                        type: "date",
                        readonly:true,
                        title: "LOAN_CLOSING_DATE"
                    }, {
                        key: "securityRefund.amount",
                        title: "REFUND_AMOUNT",
                        readonly: true
                    }

                ]
            }, {
                "type": "box",
                "title": "REPAYMENT_TO_ACCOUNT",
                "items": [{
                    "key": "securityRefund.instrument",
                    "type": "select",
                    "title":"INSTRUMENT_TYPE",
                    "required": true,
                    "titleMap": [{
                        name: "Cash",
                        value: "CASH"
                    }, {
                        "name": "NEFT",
                        "value": "NEFT"
                    }]
                }, {
                    key: "securityRefund.bankAccountNumber",
                    type: "lov",
                    autolov: true,
                    //condition: "model.repayment.instrument=='NEFT' || model.repayment.instrument=='RTGS'||model.repayment.instrument=='ACH' || model.repayment.instrument == 'INTERNAL'",
                    title: "REPAYMENT_TO_ACCOUNT",
                    required: true,
                    bindMap: {

                    },
                    outputMap: {
                        "account_number": "securityRefund.bankAccountNumber"
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model) {
                        return Queries.getBankAccountsByPartnerForLoanRepay();
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.account_number,
                            item.ifsc_code + ', ' + item.bank_name,
                            item.branch_name
                        ];
                    }
                }, {
                    key: "securityRefund.instrumentDate",
                    title: "DATE",
                    condition: "model.securityRefund.instrument=='NEFT'",
                    type: "date",
                    required: true,
                }]
            }, 
            {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "Submit"
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
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.collections.SecurityEMIRefundQueue',
                            pageId: null
                        });
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