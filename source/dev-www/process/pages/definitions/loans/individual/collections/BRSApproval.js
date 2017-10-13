irf.pageCollection.factory(irf.page("loans.individual.collections.BRSApproval"), ["$log", "$q", 'Pages_ManagementHelper', 'LoanCollection', 'LoanAccount', 'PageHelper', 'formHelper', 'irfProgressMessage',
    'SessionStore', "$state", "$stateParams", "Masters", "authService", "Utils", "Queries",
    function ($log, $q, ManagementHelper, LoanCollection, LoanAccount, PageHelper, formHelper, irfProgressMessage,
              SessionStore, $state, $stateParams, Masters, authService, Utils, Queries) {

        return {
            "type": "schema-form",
            "title": "BRS_APPROVAL",
            initialize: function (model, form, formCtrl) {
                $log.info("BRS Approval Page got initialized");

                if (!model._credit) {
                    $log.info("Screen directly launched hence redirecting to queue screen");
                    $state.go('Page.Engine', {
                        pageName: 'loans.individual.collections.BRSApprovalQueue',
                        pageId: null
                    });
                    return;
                }

                console.log(model._credit);

                model.pageRules = {
                    forceToTransAuth: false
                }

                if (model._credit.unapprovedAmount!=null && model._credit.unapprovedAmount > 0){
                    model.pageRules.forceToTransAuth = true;
                    model.pageRules.forceToTransAuthMessage = "Unapproved payments found!";
                    model.pageRules.forceToTransAuthSubMessage = "On submit, transaction moves to Authorization Queue.";  
                }

                model.workingDate = SessionStore.getCBSDate();

                //PageHelper.showLoader();
                irfProgressMessage.pop('loading-BRS validation-details', 'Loading BRS validation Details');
                //PageHelper
                var loanAccountNo;
                var collectionId =$stateParams.pageId;

                var p2 =LoanCollection.get({
                    id:collectionId
                }).$promise.then(
                function(resp){
                    model.Collection=resp;
                    loanAccountNo=model.Collection.accountNumber;
                    if (model.Collection.instrumentType == 'CASH') {
                        LoanCollection.getDepositSummary({
                            depositSummaryId: model.Collection.bankDepositSummaryId
                        }).$promise.then(function(info) {
                            model.Collection.depositsummary = info;
                            $log.info(model.Collection);
                        })
                    }
                    LoanAccount.get({
                    accountId: loanAccountNo
                    }).$promise.then(
                    function (data) { /* SUCCESS */
                        model.loanAccount = data;
                        Queries.getLoanCustomerRelations({
                            accountNumber: loanAccountNo
                        }).then(
                            function(response) {
                                model.loanCustomerRelations = response;
                            }
                        )
                        model.loanAccount.netPayoffAmount = Utils.roundToDecimal(data.payOffAmount + data.preclosureFee - data.securityDeposit);
                        model.creditValidation = model.creditValidation || {};
                        model.creditValidation.enterprise_name = data.customer1FirstName;
                        model.creditValidation.productCode = data.productCode;
                        model.creditValidation.urnNo = data.customerId1;
                        model.creditValidation.accountNumber = data.accountId;
                        model.creditValidation.amountDue = model._credit.demandAmount;
                        model.creditValidation.principal = data.totalPrincipalDue;
                        model.creditValidation.interest = data.totalNormalInterestDue;
                        model.creditValidation.applicant_name = data.applicant;
                        model.creditValidation.applicant_name = data.coapplicant;
                        model.creditValidation.penal_interest = data.totalPenalInterestDue;
                        model.creditValidation.fee = data.totalFeeDue;
                        if(model._credit)
                        model.creditValidation.id = model._credit.id;
                        model.creditValidation.reference = model._credit.reference;
                        model.creditValidation.instrument = data.instrument;
                        model.creditValidation.isCoApplicantarray = false;
                        model.creditValidation.amountCollected = model._credit.repaymentAmount;
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
                })

                $q.all([p2])
                    .finally(function(){
                        if (Utils.compareDates(model.workingDate, model._credit.repaymentDate) == 1) {
                            model.pageRules.forceToTransAuth = true;
                            model.pageRules.forceToTransAuthMessage = "Backdated transaction";
                            model.pageRules.forceToTransAuthSubMessage = "On submit, transaction moves to Authorization Queue.";
                        }
                        if  (model.creditValidation.amountDue > model.creditValidation.amountCollected) {
                            model.creditValidation.status = "Partially Paid";
                            model.creditValidation.statusValue = 2;
                        } else {
                            model.creditValidation.status = "Fully Paid";
                            model.creditValidation.statusValue = 1;
                        }
                    })
            },

            form: [{
                "type": "box",
                "title": "Payment",
                "items": [
                {
                    "type": "section",
                    "htmlClass": "alert alert-warning",
                    "condition": "model.pageRules.forceToTransAuth == true",
                    "html":"<h4><i class='icon fa fa-warning'></i>{{model.pageRules.forceToTransAuthMessage}}</h4>{{model.pageRules.forceToTransAuthSubMessage}}"
                },
                {
                    key: "_credit.instrumentType",
                    title: "REPAYMENT_MODE",
                    readonly: true,
                    //type:"amount"
                }, 
                {
                    key: "_credit.reference",
                    condition:"model._credit.instrumentType !=='CASH'",
                    title: "REFERENCE_NUMBER",
                    readonly: true,
                    //type:"amount"
                },
                {
                    key: "_credit.transactionName",
                    title: "TRANSACTION_NAME",
                    readonly: true,
                    //type:"amount"
                },
                {
                    "key": "Collection.depositsummary.id",
                    condition:"model._credit.instrumentType =='CASH'",
                    "type": "string",
                    "title": "BANK_DEPOSIT_SUMMARY_ID",
                    "readonly": true
                },
                {
                    type: "fieldset",
                    title: "PRECLOSURE_BREAKUP",
                    condition: "model._credit.transactionName=='Pre-closure'",
                    items: [
                        {
                            key: "loanAccount.principalNotDue",
                            readonly: true,
                            title: "PRINCIPAL_NOT_DUE",
                            type: "amount"
                        },
                        {
                            key: "loanAccount.bookedNotDueNormalInterest",
                            readonly: true,
                            title: "BOOKED_NOT_DUE_NORMAL_INTEREST",
                            type: "amount"
                        },
                        {
                            key: "loanAccount.bookedNotDuePenalInterest",
                            readonly: true,
                            title: "BOOKED_NOT_DUE_PENAL_INTEREST",
                            type: "amount"
                        },
                        {
                            key: "loanAccount.recoverableInterest",
                            readonly: true,
                            title: "RECOVERABLE_INTEREST",
                            type: "amount"
                        },
                        {
                            key: "loanAccount.securityDeposit",
                            readonly: true,
                            title: "SECURITY_DEPOSIT",
                            type: "amount"
                        },
                        {
                            key: "loanAccount.preclosureFee",
                            readonly: true,
                            title: "PRECLOSURE_FEE",
                            type: "amount"
                        },
                        {
                            key: "loanAccount.totalFeeDue",
                            readonly: true,
                            title: "TOTAL_FEE_DUE",
                            type: "amount"
                        },
                        {
                            key: "loanAccount.netPayoffAmount",
                            readonly: true,
                            title: "NET_PAYOFF_AMOUNT",
                            type: "amount"
                        },
                        {
                            type: "section",
                            html: "<hr />"
                        }
                    ]
                },
                {
                    type: "fieldset",
                    condition: "model._credit.transactionName !='Pre-closure'",
                    items: [
                        {
                            key: "_credit.principalDue",
                            title: "PRINCIPAL",
                            readonly: true,
                            type: "amount"
                        }, {
                            key: "_credit.interestAmount",
                            title: "INTEREST",
                            readonly: true,
                            type: "amount"
                        }, {
                            key: "_credit.penalInterestDue",
                            title: "PENAL_INTEREST",
                            readonly: true,
                            type: "amount"
                        },{
                            key: "loanAccount.totalSecurityDepositDue",
                            title: "TOTAL_SECURITY_DEPOSIT_DUE",
                            readonly: true,
                            type: "amount"
                        }, {
                            key: "_credit.feeDue",
                            title: "FEES_AND_OTHER_CHARGES",
                            readonly: true,
                            type: "amount"
                        },
                        {
                            key: "creditValidation.amountDue",
                            title: "TOTAL_AMOUNT_DUE",
                            readonly: true,
                            type: "amount"
                        }
                    ]
                }, 
                {
                    key: "creditValidation.amountCollected",
                    title: "AMOUNT_COLLECTED",
                    readonly: true,
                    type: "amount"
                },{
                    key: "Collection.repaymentDate",
                    "title":"REPAYMENT_DATE",
                    readonly: true,
                    type: "date"
                },{
                    key: "Collection.bankAccountNumber",
                    title:"REPAYMENT_TO_ACCOUNT",
                    readonly: true,
                }, {
                    key: "creditValidation.status",
                    title: "STATUS",
                    readonly: true
                }, {
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
                                "title": "NAME",
                                "readonly":true
                            },
                            {
                                "key": "loanCustomerRelations[].urn",
                                "type": "string",
                                "title": "URN_NO",
                                "readonly":true
                            }
                        ]
                    },
                    ]
            },

            {
                type: "box",
                title: "LOAN_COLLECTIONS",
                condition:"model._credit.instrumentType=='CASH'",
                items: [
                {
                    key: "Collection.depositsummary.loanCollections",
                    type: "array",
                    "titleExpr":"model.Collection.depositsummary.loanCollections[arrayIndex].customerName",
                    add: null,
                    remove: null,
                    items: [{
                        key: "Collection.depositsummary.loanCollections[].accountNumber",
                        title: "LOAN_ACCOUNT_NUMBER",
                        readonly: true,
                    }, {
                        key: "Collection.depositsummary.loanCollections[].customerName",
                        title: "ENTERPRISE_NAME",
                        readonly: true,
                    }, {
                        key: "Collection.depositsummary.loanCollections[].repaymentAmount",
                        title: "AMOUNT_COLLECTED",
                        readonly: true,
                    }, {
                        key: "Collection.depositsummary.loanCollections[].transactionName",
                        "title":"TRANSACTION_NAME",
                        readonly: true,
                    }, {
                        key: "Collection.depositsummary.loanCollections[].repaymentDate",
                        type:"date",
                        "title":"REPAYMENT_DATE",
                        readonly: true,
                    }]
                }]
            },

            {
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

                            var loanCollection = _.cloneDeep(model._credit);
                            var reqParams = {};
                            reqParams.loanCollection = loanCollection;
                            if (model.creditValidation.notPaid) {
                               if(model._credit.instrumentType=='CASH'){
                                   reqParams.stage = "Deposit";  
                               }else{
                                reqParams.stage = "Rejected"; 
                               }
                                $log.info("Inside NoPayment()");     
                            }
                            reqParams.repaymentProcessAction = "PROCEED";
                            LoanCollection.update(reqParams,function(resp, header){
                                PageHelper.hideLoader();
                                $state.go('Page.Engine', {
                                    pageName: 'loans.individual.collections.BRSApprovalQueue',
                                    pageId: null
                                });
                            },function(resp){
                                PageHelper.showErrors(resp);
                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });   
                        })
                }
            }
        };
    }
]);
