irf.pageCollection.factory(irf.page("loans.individual.collections.CreditValidation"), ["$log", "$q", 'Pages_ManagementHelper', 'LoanCollection', 'LoanAccount', 'PageHelper', 'formHelper', 'irfProgressMessage', "Locking",
    'SessionStore', "$state", "$stateParams", "Masters", "authService", "Utils", "Queries","IndividualLoan","irfNavigator", "PagesDefinition",
    function ($log, $q, ManagementHelper, LoanCollection, LoanAccount, PageHelper, formHelper, irfProgressMessage, Locking,
        SessionStore, $state, $stateParams, Masters, authService, Utils, Queries,IndividualLoan,irfNavigator, PagesDefinition) {

        return {
            "type": "schema-form",
            "title": "PAYMENT_DETAILS_FOR_LOAN",
            initialize: function (model, form, formCtrl) {
                $log.info("Credit Validation Page got initialized");
                Queries.getLoanIdByLoanCollectionId($stateParams.pageId).then(function(res) {
                    if (SessionStore.getGlobalSetting("lockingRequired") == "true") {
                        Locking.lock({
                            "processType": "Loan",
                            "processName": "Collections",
                            "recordId": res.id
                        }).$promise.then(function () {
                        }, function (err) {
                            Utils.alert(err.data.error).then(irfNavigator.goBack);
                        });
                    }
                });

                model.pageConfig = {
                    repaymentDateIsReadonly: false
                };
                
                PagesDefinition.getPageConfig("Page/Engine/loans.LoanRepay")
                .then(function(data){  
                    _.defaults(data, model.pageConfig);
                    model.pageConfig = data;
                });

                if (!model._credit) {
                    $log.info("Screen directly launched hence redirecting to queue screen");
                    $state.go('Page.Engine', {
                        pageName: 'loans.individual.collections.CreditValidationQueue',
                        pageId: null
                    });
                    return;
                }

                model.pageRules = {
                    forceToTransAuth: false
                }

                if (model._credit.unapprovedAmount != null && model._credit.unapprovedAmount > 0) {
                    model.pageRules.forceToTransAuth = true;
                    model.pageRules.forceToTransAuthMessage = "Unapproved payments found!";
                    model.pageRules.forceToTransAuthSubMessage = "On submit, transaction moves to Authorization Queue.";
                }

                model.workingDate = SessionStore.getCBSDate();
                
               
                PageHelper.showLoader();
                irfProgressMessage.pop('loading-Credit validation-details', 'Loading Credit validation Details');
                //PageHelper
                var loanAccountNo;
                var collectionId = $stateParams.pageId;

                var p2 = LoanCollection.get({
                    id: collectionId
                }).$promise.then(
                    function (resp) {
                        model.Collection = resp;
                        loanAccountNo = model.Collection.accountNumber;
                        if (model.Collection.instrumentType == 'CASH') {
                            LoanCollection.getDepositSummary({
                                depositSummaryId: model.Collection.bankDepositSummaryId
                            }).$promise.then(function (info) {
                                model.Collection.depositsummary = info;
                                $log.info(model.Collection);
                            })
                        }
                        Queries.getLoanCustomerRelations({
                            accountNumber: loanAccountNo
                        }).then(function (response) {
                            model.loanCustomerRelations = response;
                        });
                        LoanAccount.get({
                            accountId: loanAccountNo
                        }).$promise.then(
                            function (data) { /* SUCCESS */
                                model.loanAccount = data;
                                model.loanAccount.netPayoffAmount = Utils.roundToDecimal(data.payOffAmount + data.preclosureFee - data.securityDeposit);
                                model.loanAccount.netPayoffAmountDue = Utils.roundToDecimal(model.loanAccount.netPayoffAmount + model.loanAccount.totalDemandDue);
                                model.creditValidation = model.creditValidation || {};
                                /** added empty object in array to startEmpty */
                                model.collections=[{}];
                                model.creditValidation.notPaid="Approve";
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
                                if (model._credit)
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
                    .finally(function () {

                        if (Utils.compareDates(model.workingDate, model._credit.repaymentDate) == 1) {
                            model.pageRules.forceToTransAuth = true;
                            model.pageRules.forceToTransAuthMessage = "Backdated transaction";
                            model.pageRules.forceToTransAuthSubMessage = "On submit, transaction moves to Authorization Queue.";
                        }

                        if (model.creditValidation.amountDue > model.creditValidation.amountCollected) {
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
                        "html": "<h4><i class='icon fa fa-warning'></i>{{model.pageRules.forceToTransAuthMessage}}</h4>{{model.pageRules.forceToTransAuthSubMessage}}"
                    },
                    {
                        key: "_credit.instrumentType",
                        title: "REPAYMENT_MODE",
                        readonly: true,
                        //type:"amount"
                    },
                    {
                        key: "_credit.reference",
                        title: "REFERENCE_NUMBER",
                        readonly: true,
                        condition: "!model.Collection.depositsummary.depositId",
                        //type:"amount"
                    },
                    {
                        key: "Collection.depositsummary.depositId",
                        title: "REFERENCE_NUMBER",
                        readonly: true,
                        condition: "model.Collection.depositsummary.depositId",
                    },
                    {
                        key: "_credit.transactionName",
                        title: "TRANSACTION_NAME",
                        readonly: true,
                        //type:"amount"
                    },
                    {
                        key: "_credit.repaymentDate",
                        condition: "model.pageConfig.repaymentDateIsReadonly == true",
                        title: "REPAYMENT_DATE",
                        type: "date",
                        readonly: true
                    },
                    {
                        key: "_credit.repaymentDate",
                        condition: "model.pageConfig.repaymentDateIsReadonly == false",
                        title: "REPAYMENT_DATE",
                        type: "date"
                    },
                    {
                        type: "fieldset",
                        title: "PRECLOSURE_BREAKUP",
                        condition: "model._credit.transactionName=='Pre-closure'",
                        items: [
                            {
                                key: "loanAccount.totalPrincipalDue",
                                readonly: true,
                                title: "TOTAL_PRINCIPAL_DUE",
                                type: "amount"
                            },
                            {
                                key: "loanAccount.totalNormalInterestDue",
                                readonly: true,
                                title: "TOTAL_NORMAL_INTEREST_DUE",
                                type: "amount"
                            },
                            {
                                key: "loanAccount.totalPenalInterestDue",
                                readonly: true,
                                title: "TOTAL_PERNAL_INTEREST_DUE",
                                type: "amount"
                            },
                            {
                                key: "loanAccount.totalDemandDue",
                                readonly: true,
                                title: "TOTAL_DEMAND_DUE",
                                type: "amount"
                            },
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
                                title: "FEE_DUE",
                                type: "amount"
                            },
                            {
                                key: "loanAccount.netPayoffAmount",
                                readonly: true,
                                title: "NET_PAYOFF_AMOUNT",
                                type: "amount"
                            },
                            {
                                key: "loanAccount.netPayoffAmountDue",
                                readonly: true,
                                title: "NET_PAYOFF_AMOUNT_DUE",
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
                            }, {
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
                        type: "radios",
                        "title": "ACTION",
                        "default": "Approve",
                        "titleMap":{
                            "Approve":"Approve",
                            "Reject":"Reject",
                            "Correct":"Correct"
                        },
                        onChange:
                        function(result, model, context) {
                            model.securityRefund.bankAccountNo = result.bankAccountNo;
                            model.securityRefund.accountHolderName = result.accountHolderName;
                            model.securityRefund.accountType = result.accountType;
                            model.securityRefund.IFSCode = result.IFSCode;
                            model.securityRefund.bankName = result.bankName;
                            model.securityRefund.bankBranch = result.bankBranch;
                        }
                        
                    },
                    
                    {
                        key: "creditValidation.reject_reason",
                        title: "REJECT_REASON",
                        required: true,
                        type: "select",
                        condition: "model.creditValidation.notPaid == 'Reject'",
                        titleMap:{
                            "1":"Amount not credited in account",
                        }
                    }, {
                        key: "creditValidation.reject_remarks",
                        title: "REJECT_REMARKS",
                        readonly: false,
                        //required: true,
                        type: "textarea",
                        condition: "model.creditValidation.notPaid == 'Reject'"
                    },
                    {
                        type: "box",
                        title: "CORRECTION",
                        //view: "fixed",
                        startEmpty:true,
                        colClass: "col-sm-12",
                        condition: "model.creditValidation.notPaid == 'Correct'",                
                        items: [
                            {
                                key: "collections",
                                type: "array",
                                // title: "CORRECTION",
                                "titleExpr": "'Correction - '+ model.collections[arrayIndex].accountNumber",
                                startEmpty: true,
                                onArrayAdd: function (modelValue, form, model, formCtrl, $event) {
                                    var allocatedAmount = 0;
                                    if (model.collections.length > 1) {
                                        for (i = 0; i < model.collections.length - 1; i++) {
                                            allocatedAmount += parseFloat(model.collections[i].amount);
                                        }   
                                    }
                                    if (allocatedAmount > model.creditValidation.amountCollected) {
                                        PageHelper.showProgress("err", "Correct Amount should not be greater than Amount Collected", 5000);
                                        return false;
                                    }
                                },
                                items: [
                                    {
                                        key: "collections[].accountNumber",
                                        type: "lov",
                                        title: "CORRECT_ACCOUNT",
                                        required: true,
                                        lovonly: true,
                                        inputMap: {
                                            "accountNumber": {
                                                key: "collections[].accountNumber",
                                            },
                                            "customerName": {
                                                key: "collections[].customerName",
                                            },
                                            "branchName": {
                                                key: "collections[].branchName",
                                                "type": "select",
                                                "enumCode": "branch",
                                            },
                                            "centreName": {
                                                "key": "collections[].centreName",
                                                "type": "select",
                                                "enumCode": "centre",
                                                "parentEnumCode": "branch",
                                            },
                                        },
                                        outputMap: {
                                            "accountNumber": "collections[arrayIndex].accountNumber",
                                            "customerName":"collections[arrayIndex].customerName",
                                            "branchName":"collections[arrayIndex].branchName",
                                            "centreName":"collections[arrayIndex].centreName",
                                        },
                                        searchHelper: formHelper,
                                        initialize: function(inputModel) {
                                            $log.info(inputModel);
                                        },
                                        search: function(inputModel, form, model, context) {
                                            return IndividualLoan.search({
                                                   'stage': "Completed",
                                                   'accountNumber': inputModel.accountNumber,
                                                   'branchName': inputModel.branchName,
                                                   'centreCode': inputModel.centreName,
                                                   'customerName': inputModel.customerName,
                                                   'isClosed':false,
               
               
                                               }).$promise;
                                       },
                                       getListDisplayItem: function(item, index) {
                                           $log.info(item);
                                           return [
                                               item.accountNumber,
                                               item.customerName,
                                               item.branchName,
                                               item.centreName,
                                           ];
                                       },
                                        onSelect: function (valueObj, model, context) {
                                            model.loanAccount.linkedAccountNumber = valueObj.accountNumber;
                                            var allocatedAmount = 0;
                                            if (model.collections.length > 0) {
                                                for (i = 0; i < model.collections.length - 1; i++) {
                                                    allocatedAmount = parseFloat(allocatedAmount) + parseFloat(model.collections[i].amount);
                                                }
                                                if (allocatedAmount > parseFloat(_.toNumber(model.creditValidation.amountCollected))) {
                                                    PageHelper.showProgress("err", "Correct Amount should not be greater than Amount Collected", 5000);
                                                }
                                                else {
                                                    var lastElementAllocatedAmount = parseFloat(_.toNumber(model.creditValidation.amountCollected)) - (allocatedAmount);
                                                    model.collections[model.collections.length - 1].amount = parseFloat(_.toNumber(lastElementAllocatedAmount).toFixed(2));
                                                }
                                            }
                                        }
                                    },
                                    {
                                        key: "collections[].amount",
                                        readonly: false,
                                        required: true,
                                        type: "amount",
                                        title: "CORRECT_AMOUNT",
                                        onChange: function (result, model, context) {
                                            var totalAmount = 0;
                                            if (result >= 0) {
                                                for (var i = 0; i < context.collections.length; i++) {
                                                    totalAmount += context.collections[i].amount;
                                                }
                                                if (totalAmount > context.creditValidation.amountCollected) {
                                                    PageHelper.showProgress("err", "Correct Amount should not be greater than Amount Collected", 5000);
                                                }
                                            } else {
                                                PageHelper.showProgress("err", "Negative numbers are not allowed", 5000);
                                            }
                                        }
                                    },
                                ]
                            },
                        ]
                    },
                    
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
                            "readonly": true
                        },
                        {
                            "key": "loanCustomerRelations[].urn",
                            "type": "string",
                            "title": "URN_NO",
                            "readonly": true
                        }
                    ]
                },
                ]
            },
            {
                type: "box",
                title: "LOAN_COLLECTIONS",
                condition: "model._credit.instrumentType=='CASH'",
                items: [
                    {
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
                    var accountNumberArray = model.collections.map(function (item) { return item.accountNumber });
                    var isDuplicateAccount = accountNumberArray.some(function (item, idx) {
                        return accountNumberArray.indexOf(item) != idx
                    });
                    if (isDuplicateAccount == true) {
                        PageHelper.showErrors({
                            data: {
                                error: "Duplicate account numbers are not allowed"
                            }
                        })
                        return false;
                    } else {
                        for (i = 0; i < model.collections.length; i++) {
                            if (model.collections[i].amount <= 0) {
                                PageHelper.showErrors({
                                    data: {
                                        error: "Correct amount should not be zero"
                                    }
                                })
                                return false;
                            }
                        }
                    }
                    Utils.confirm("Are You Sure?")
                        .then(function () {
                            PageHelper.showLoader();
                            if(model.creditValidation.notPaid=='Correct'){
                                if(model.collections && model.collections.length>0){
                                    /** checking the correction details provided */
                                }else{
                                    PageHelper.hideLoader();
                                    PageHelper.setError({
                                        message: "Please give the correction details" 
                                    });
                                   return;
                                }
                            }
                            var loanCollection = _.cloneDeep(model._credit);
                            var reqParams = {};
                            reqParams.loanCollection = loanCollection;
                            reqParams.repaymentProcessAction = "PROCEED";
                            if (model.creditValidation.notPaid == 'Reject') {
                                reqParams.stage = "Rejected";
                                $log.info("Inside NoPayment()");
                            } else if (model.creditValidation.statusValue == 1 && model.pageRules.forceToTransAuth == false) {
                                $log.info("Inside FullPayment()");
                                reqParams.stage = "Completed";
                                reqParams.loanCollection.feeWaiverAmount = 0;
                                reqParams.loanCollection.penalInterestWaiverAmount = 0;
                                reqParams.loanCollection.feeAmount = model._credit.feeDue;
                                reqParams.loanCollection.securityEmiAmount = model.loanAccount.totalSecurityDepositDue;
                                if (model.loanAccount.totalDemandDue>0){
                                    reqParams.loanCollection.scheduleDemandAmount = math.round(model._credit.repaymentAmount - reqParams.loanCollection.feeAmount - reqParams.loanCollection.securityEmiAmount, 2);
                                } else {
                                    reqParams.loanCollection.scheduleDemandAmount = 0;
                                }
                                

                            } else if (model.creditValidation.statusValue == 2 || model.pageRules.forceToTransAuth == true) {
                                $log.info("Inside PartialPayment()");
                                reqParams.stage = "PartialPayment";
                            }

                            if (reqParams.loanCollection.instrumentType == 'SUSPENSE') {
                                reqParams.loanCollection.instrumentType = 'NEFT';
                            }
                            if (model.creditValidation.notPaid=='Correct') {
                                var postParams = {};
                                postParams.collections = model.collections;
                                postParams.loanCollectionId = model._credit.id;
                                postParams.stage = "BounceCorrection";
                                LoanCollection.postCorrectionDetailsOfCollection(postParams, function (resp, header) {
                                    $log.info("Inside postCorrectionDetails()");
                                    PageHelper.hideLoader();
                                    $state.go('Page.Engine', {
                                        pageName: 'loans.individual.collections.CreditValidationQueue',
                                        pageId: null
                                    });
                                }, function (resp) {
                                    PageHelper.showErrors(resp);
                                    return false;
                                }).$promise.finally(function () {
                                    PageHelper.hideLoader();
                                });
                            } else {
                                LoanCollection.update(reqParams, function (resp, header) {
                                    PageHelper.hideLoader();
                                    $state.go('Page.Engine', {
                                        pageName: 'loans.individual.collections.CreditValidationQueue',
                                        pageId: null
                                    });
                                }, function (resp) {
                                    PageHelper.showErrors(resp);
                                }).$promise.finally(function () {
                                    PageHelper.hideLoader();
                                });
                            }
                            /*
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
                            */
                        })

                }
            }
        };
    }
]);
