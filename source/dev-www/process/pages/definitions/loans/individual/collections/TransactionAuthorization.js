irf.pageCollection.factory(irf.page("loans.individual.collections.TransactionAuthorization"),
    ["$log", "$q", 'Pages_ManagementHelper', 'LoanCollection', 'LoanAccount', 'entityManager', 'PageHelper', 'formHelper', 'irfProgressMessage',
        'SessionStore', "$state", "$stateParams", "Masters", "authService", "Utils",
        function ($log, $q, ManagementHelper, LoanCollection, LoanAccount, entityManager, PageHelper, formHelper, irfProgressMessage,
                  SessionStore, $state, $stateParams, Masters, authService, Utils) {

            return {
                "type": "schema-form",
                "title": "PAYMENT_DETAILS_FOR_LOAN",
                initialize: function (model, form, formCtrl) {
                    $log.info("Transaction Authorization Page got initialized");

                    model.EMIAllocation = SessionStore.getGlobalSetting("EMIAllocation");

                    if (!model._transAuth) {
                        $log.info("Screen directly launched hence redirecting to queue screen");
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.collections.TransactionAuthorizationQueue',
                            pageId: null
                        });
                        return;
                    }

                    model.transInfo = {
                        backDatedTransaction: false,
                        unApprovedPaymentExists: false
                    };

                    model.workingDate = SessionStore.getCBSDate();

                    model.transAuth = model.transAuth || {};
                    model._input = {isPenalInterestWaivedOff: false, isFeeWaivedOff: false};
                    PageHelper.showLoader();

                    //PageHelper.showLoader();
                    irfProgressMessage.pop('loading-Transaction Authorization-details', 'Loading Transaction Authorization Details');
                    //PageHelper
                    var loanAccountNo;
                    var collectionId = $stateParams.pageId;

                    var p2 = LoanCollection.get({
                        id: collectionId
                    }).$promise.then(
                        function(resp) {
                            model.Collection = resp;
                            loanAccountNo = model.Collection.accountNumber;
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
                                function(data) {
                                    model.loanAccount = data;
                                    model.transAuth = model.transAuth || {};
                                    model.transAuth.customer_name = data.customer1FirstName;
                                    model.transAuth.productCode = data.productCode;
                                    model.transAuth.urnNo = data.customerId1;
                                    model._transAuth.urnNo = data.customerId1;
                                    //model.transAuth.instrument = 'CASH_IN';
                                    //model.transAuth.authorizationUsing = 'Testing-Swapnil';
                                    //model.transAuth.remarks = 'collections';
                                    model.transAuth.accountNumber = data.accountId;
                                    model.transAuth.amountDue = data.totalDemandDue;
                                    model.transAuth.principal = data.totalPrincipalDue;
                                    model.transAuth.interest = data.totalNormalInterestDue;
                                    model.transAuth.applicant_name = data.applicant;
                                    model.transAuth.applicant_name = data.coapplicant;
                                    model.transAuth.penal_interest = data.totalPenalInterestDue;
                                    model.transAuth.accountOpenDate = data.lastDemandRunDate;
                                    if (model._transAuth)
                                        model.transAuth.id = model._transAuth.id;
                                    model.transAuth.archiveDate = data.lastArchiveDate;
                                    model.transAuth.fromDate = data.lastArchiveDate;
                                    model.transAuth.fee = data.totalFeeDue;
                                    model.transAuth.amountCollected = model._transAuth.repaymentAmount;
                                    model.loanCollection = _.cloneDeep(model._transAuth);

                                    model._transAuth.penalInterestWaiverAmount = 0;
                                    model._transAuth.feeWaiverAmount = 0;
                                    model._transAuth.feeAmount = 0;
                                    model._transAuth.scheduleDemandAmount = 0;
                                    model._transAuth.securityEmiAmount = 0;
                                    model._transAuth.bookedNotDuePenalInterest=0;

                                    /* Amount Allocation */
                                    if (model._transAuth.transactionName == 'Scheduled Demand') {
                                        var amountAvailable = model._transAuth.repaymentAmount;

                                        /* Allocating Security EMI Demand */
                                        model._transAuth.securityEmiAmount = model.loanAccount.totalSecurityDepositDue;
                                        amountAvailable = amountAvailable - model._transAuth.securityEmiAmount;

                                        /* Allocating Demand */

                                        if (amountAvailable > 0) {
                                            if (model.EMIAllocation && !model._transAuth.penalInterestDue) {
                                                model._transAuth.scheduleDemandAmount = Utils.roundToDecimal(Math.min((model._transAuth.principalDue + model._transAuth.interestAmount), amountAvailable));
                                                amountAvailable = Utils.roundToDecimal(amountAvailable - model._transAuth.scheduleDemandAmount);
                                                model._transAuth.penalInterestWaiverAmount = 0;
                                            } else {
                                                model._transAuth.scheduleDemandAmount = Utils.roundToDecimal(Math.min((model._transAuth.principalDue + model._transAuth.interestAmount + model._transAuth.penalInterestDue), amountAvailable));
                                                amountAvailable = Utils.roundToDecimal(amountAvailable - model._transAuth.scheduleDemandAmount);
                                                model._transAuth.penalInterestWaiverAmount = 0;
                                            }
                                        }
                                        
                                        if(amountAvailable > 0 && model.EMIAllocation){
                                            model._transAuth.bookedNotDuePenalInterest = Utils.roundToDecimal(Math.min(amountAvailable, model.loanCollection.bookedNotDuePenalInterest));
                                            amountAvailable = Utils.roundToDecimal(amountAvailable - model._transAuth.bookedNotDuePenalInterest);
                                        }
                                        /* Allocating Fee */
                                        if (amountAvailable > 0) {
                                            model._transAuth.feeAmount = Utils.roundToDecimal(Math.min(amountAvailable, model._transAuth.feeDue));
                                            amountAvailable = Utils.roundToDecimal(amountAvailable - model._transAuth.feeAmount);
                                        }
                                        /* Allocating Future Principal */
                                        if (amountAvailable > 0) {
                                            model._transAuth.scheduleDemandAmount = Utils.roundToDecimal(model._transAuth.scheduleDemandAmount + amountAvailable);
                                        }
                                    }

                                    irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                                    PageHelper.hideLoader();
                                },
                                function(resData) {
                                    irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                                    PageHelper.showErrors(resData);
                                    backToLoansList();
                                })
                        })

                    $q.all([p2])
                        .finally(function(){
                            if (Utils.compareDates(model.workingDate, model._transAuth.repaymentDate) == 1) {
                                model.transInfo.backDatedTransaction = true;
                            }

                            if (model._transAuth.unapprovedAmount>0){
                                model.transInfo.unApprovedPaymentExists = true;
                            }
                        })
                },

                form: 
                [
                    
                    {
                        "type": "box",
                        "title": "PAYMENT",
                        "items": [
                            {
                                "type": "section",
                                "htmlClass": "alert alert-warning",
                                "condition": "model.transInfo.backDatedTransaction == true",
                                "html":"<h4><i class='icon fa fa-warning'></i>Backdated transaction</h4>This is a backdated transaction."
                            },
                            {
                                "type": "section",
                                "htmlClass": "alert alert-warning",
                                "condition": "model.transInfo.unApprovedPaymentExists == true",
                                "html":"<h4><i class='icon fa fa-warning'></i>Unappoved Payments exist during this Transaction</h4>There were some unapproved payments while this transaction was done."
                            },
                            {
                                key: "transAuth.customer_name",
                                title: "ENTERPRISE_NAME",
                                readonly: true
                            },
                            {
                                key: "_transAuth.transactionName",
                                title: "TRANSACTION_NAME",
                                readonly: true
                            },
                            {
                                key: "_transAuth.repaymentDate",
                                title: "REPAYMENT_DATE",
                                type: "date"
                            },
                            {
                                title: "DETAILS",
                                type: "fieldset",
                                condition: "model._transAuth.transactionName == 'Scheduled Demand'",
                                items: [
                                    {
                                        key: "_transAuth.principalDue",
                                        title: "PRINCIPAL",
                                        readonly: true,
                                        type: "amount"
                                    },
                                    {
                                        key: "_transAuth.interestAmount",
                                        title: "INTEREST",
                                        readonly: true,
                                        type: "amount"
                                    },
                                    {
                                        key: "loanAccount.totalSecurityDepositDue",
                                        title: "TOTAL_SECURITY_DEPOSIT_DUE",
                                        readonly: true,
                                        type: "amount"
                                    },
                                    {
                                        key: "_transAuth.penalInterestDue",
                                        title: "PENAL_INTEREST",
                                        readonly: true,
                                        type: "amount"
                                    },
                                    {
                                        "key": "loanCollection.bookedNotDuePenalInterest",
                                        "title": "BOOKED_NOT_DUE_PENAL_INTEREST",
                                        "type": "amount",
                                        readonly: true,
                                    },
                                    {
                                        key: "_transAuth.feeDue",
                                        title: "FEES_AND_OTHER_CHARGES",
                                        readonly: true,
                                        type: "amount"
                                    },
                                    {
                                        key: "_transAuth.demandAmount",
                                        title: "AMOUNT_DUE",
                                        readonly: true,
                                        type: "amount"
                                    },
                                    {
                                        key: "transAuth.amountCollected",
                                        title: "AMOUNT_COLLECTED",
                                        readonly: true,
                                        type: "amount"
                                    },
                                    {
                                        key: "_transAuth.penalInterestWaiverAmount",
                                        title: "WAIVE_PENAL",
                                        type: "number"
                                    },
                                    {
                                        key: "_transAuth.feeWaiverAmount",
                                        title: "WAIVE_FEE_CHARGE",
                                        type: "number"
                                    },
                                    {
                                        "type": "fieldset",
                                        "title": "AMOUNT_ALLOCATION",
                                        "items": [
                                            {
                                                "key": "_transAuth.securityEmiAmount",
                                                "title": "SECURITY_EMI_AMOUNT",
                                                "type": "number"
                                            },
                                            {
                                                "key": "_transAuth.feeAmount",
                                                "title": "FEE_AMOUNT",
                                                "type": "number"
                                            },
                                            {
                                                "key": "_transAuth.scheduleDemandAmount",
                                                "title": "DEMAND_AMOUNT",
                                                "type": "number"
                                            },
                                            {
                                                "key": "_transAuth.bookedNotDuePenalInterest",
                                                "title": "BOOKED_NOT_DUE_PENAL_INTEREST",
                                                "type": "number"
                                            }    
                                        ]
                                    }
                                ]
                            },
                            {
                                type: "fieldset",
                                condition: "model._transAuth.transactionName == 'Pre-closure' || model._transAuth.transactionName == 'PenalInterestPayment'",
                                items: [
                                    {
                                        key: "_transAuth.demandAmount",
                                        title: "AMOUNT_DUE",
                                        readonly: true,
                                        type: "amount"
                                    },
                                    {
                                        type: "fieldset",
                                        title: "PRECLOSURE_BREAKUP",
                                        condition: "model._transAuth.transactionName=='Pre-closure' || model._transAuth.transactionName=='PenalInterestPayment' ",
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
                                        key: "_transAuth.feeDue",
                                        title: "FEES_AND_OTHER_CHARGES",
                                        readonly: true,
                                        type: "amount"
                                    },
                                    {
                                        key: "transAuth.amountCollected",
                                        title: "AMOUNT_COLLECTED",
                                        readonly: true,
                                        type: "amount"
                                    },
                                    {
                                        key: "_transAuth.feeWaiverAmount",
                                        title: "WAIVE_FEE_CHARGE",
                                        type: "number"
                                    }
                                ]
                            },
                            {
                                type: "fieldset",
                                condition: "model._transAuth.transactionName == 'Fee Payment'",
                                items: [
                                    {
                                        key: "_transAuth.feeDue",
                                        title: "FEES_AND_OTHER_CHARGES",
                                        readonly: true,
                                        type: "amount"
                                    },
                                    {
                                        key: "transAuth.amountCollected",
                                        title: "AMOUNT_COLLECTED",
                                        readonly: true,
                                        type: "amount"
                                    },
                                    {
                                        key: "_transAuth.feeWaiverAmount",
                                        title: "WAIVE_FEE_CHARGE",
                                        type: "number"
                                    }
                                ]
                            },
                            {
                                type: "fieldset",
                                condition: "model._transAuth.transactionName == 'Prepayment' || mode._transAuth.transactionName =='Advance Repayment'",
                                items: [
                                    {
                                        key: "transAuth.amountCollected",
                                        title: "AMOUNT_COLLECTED",
                                        readonly: true,
                                        type: "amount"
                                    }
                                ]
                            }
                        ]
                    },

                    {
                        type: "box",
                        title: "LOAN_COLLECTIONS",
                        condition: "model._credit.instrumentType=='CASH'",
                        items: [{
                            key: "Collection.depositsummary.loanCollections",
                            type: "array",
                            "titleExpr": "model.Collection.depositsummary.loanCollections[arrayIndex].customerName",
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
                                "title": "TRANSACTION_NAME",
                                readonly: true,
                            }, {
                                key: "Collection.depositsummary.loanCollections[].repaymentDate",
                                type: "date",
                                "title": "REPAYMENT_DATE",
                                readonly: true,
                            }]
                        }]
                    },
                    // {
                    //     "type": "box",
                    //     "title": "LOAN_OVERVIEW",
                    //     "items": [
                    //         {
                    //             key: "loanAccount.securityDeposit"
                    //         },
                    //         {
                    //             key: "loanAccount.totalDemandDue"
                    //         },
                    //         {
                    //             key: "loanAccount.totalFeeDue"
                    //         }
                    //     ]
                    // },
                    {
                        "type": "actionbox",
                        "items": [
                            {
                                "type": "submit",
                                "title": "SUBMIT"
                            },
                            {
                                "type": "button",
                                "title": "SEND_BACK",
                                "onClick": "actions.sendBack(model, formCtrl, form, $event)"
                            }
                        ]
                    }],
                schema: function () {
                    return ManagementHelper.getVillageSchemaPromise();
                },
                actions: {
                    sendBack: function(model, form, formName){
                        $log.info("Inside sendBack()");
                        if(model._transAuth.transactionName == 'PenalInterestPayment'){
                            model._transAuth.bookedNotDuePenalInterest= model.loanAccount.bookedNotDuePenalInterest ||0;
                        }
                        var loanCollection = _.cloneDeep(model._transAuth);
                        var reqParams = {};
                        reqParams.loanCollection = loanCollection;
                        reqParams.repaymentProcessAction = "PROCEED",
                        reqParams.stage = "CreditValidation";
                        PageHelper.showLoader();
                        PageHelper.showProgress("move-to-credit-validation", "Working...");
                        LoanCollection.update(reqParams, function(res){
                            PageHelper.showProgress("move-to-credit-validation", "Done", 5000);
                            $state.go('Page.Engine', {
                                pageName: 'loans.individual.collections.TransactionAuthorizationQueue',
                                pageId: null
                            });
                        }, function(httpRes){
                            PageHelper.showProgress("move-to-credit-validation", "Some Error Occured", 5000);
                            PageHelper.showErrors(httpRes);
                        })
                        .$promise.finally(function(){
                            PageHelper.hideLoader();
                        })

                    },
                    submit: function (model, form, formName) {
                        $log.info("Inside submit()");
                        if (model.loanCollection.transactionName == 'Scheduled Demand') {
                            if(model._transAuth.penalInterestWaiverAmount > model._transAuth.penalInterestDue){
                                PageHelper.showProgress("waiver","Penal Interest waiver amount is more than the Penal Interest to be collected",5000);
                                return false;
                            }
                            if(model._transAuth.feeWaiverAmount > model._transAuth.feeDue){
                                PageHelper.showProgress("waiver","Fees * Charges waiver amount is more than the Fees & Charges to be collected",5000);
                                return false;
                            }
                            if ( math.add(math.bignumber(model._transAuth.feeAmount), math.bignumber(model._transAuth.scheduleDemandAmount), math.bignumber(model._transAuth.securityEmiAmount), math.bignumber(model._transAuth.bookedNotDuePenalInterest) ).toNumber() != model.loanCollection.repaymentAmount) {
                                PageHelper.showProgress("waiver", "Amount mismatch. Please verify the amount allocation breakup and amount collected.", 5000);
                                return false;
                            }
                        } else {
                            if (model._transAuth.repaymentAmount != model.transAuth.amountCollected) {
                                PageHelper.showProgress("waiver", "Amount Collected doesn't match the repayment Amount. Please verify.", 5000);
                                return false;
                            }
                        }

                        if(model._transAuth.transactionName == 'PenalInterestPayment'){
                            model._transAuth.bookedNotDuePenalInterest= model.loanAccount.bookedNotDuePenalInterest ||0;
                        }

                        if(model._transAuth.transactionName == 'Fee Payment'&& model._transAuth.instrumentType=='SECURITY_DEPOSIT'){
                            model._transAuth.feeAmount= model._transAuth.repaymentAmount ||0;
                        }

                        Utils.confirm("Are You Sure?")
                            .then(function () {
                                PageHelper.showLoader();
                                var loanCollection = _.cloneDeep(model._transAuth);
                                var reqParams = {};
                                reqParams.loanCollection = loanCollection;
                                reqParams.repaymentProcessAction = "PROCEED";
                                reqParams.stage = "Completed";
                                LoanCollection.update(reqParams,function(resp,header){
                                    PageHelper.hideLoader();
                                    $state.go('Page.Engine', {
                                        pageName: 'loans.individual.collections.TransactionAuthorizationQueue',
                                        pageId: null
                                    });
                                },function(resp){
                                    PageHelper.showErrors(resp);
                                }).$promise.finally(function(){
                                    PageHelper.hideLoader();
                                });
                                /*if (model._input.isFeeWaivedOff === true || model._input.isPenalInterestWaivedOff === true) {
                                    var archiveDate = Utils.convertJSONTimestampToDate(model.transAuth.archiveDate);
                                    var waiveFromDate = model.transAuth.fromDate;
                                    var compareOutput = Utils.compareDates(archiveDate, model.transAuth.fromDate);
                                    if (compareOutput == 1){
                                        waiveFromDate = archiveDate;
                                    }
                                    PageHelper.showLoader();
                                    PageHelper.showProgress("waiver","Please wait.",5000);
                                    LoanProcess.waiver({repaymentId: model.transAuth.loanRepaymentDetailsId, waivefee: model._input.isFeeWaivedOff, waivePenalty: model._input.isPenalInterestWaivedOff, fromDate: waiveFromDate}, null)
                                        .$promise
                                        .then(
                                            function (res) {
                                                PageHelper.showProgress("waiver","Waiver done successfully",5000);
                                                PageHelper.navigateGoBack();
                                            }, function (httpRes) {
                                                PageHelper.showErrors(httpRes);
                                                PageHelper.showProgress('waiver', 'Failed', 4000);
                                            }
                                        )
                                        .finally(function(){
                                            PageHelper.hideLoader();
                                        })

                                    return;
                                } else {
                                    PageHelper.showLoader();
                                    PageHelper.showProgress("approval","Please wait.",5000);
                                    LoanProcess.approve({loanRepaymentDetailsId: model.transAuth.loanRepaymentDetailsId}, null)
                                        .$promise
                                        .then(
                                            function (res) {
                                                PageHelper.showProgress("approval","Transaction Approval success",5000);
                                                PageHelper.navigateGoBack();
                                            }, function (httpRes) {
                                                PageHelper.showProgress('approval', 'Failed', 4000);
                                                PageHelper.showErrors(httpRes);
                                            }
                                        )
                                        .finally(function(){
                                            PageHelper.hideLoader();
                                        })
                                }*/
                            })


                    }
                }
            };
        }]);
