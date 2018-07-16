define(["perdix/domain/model/loan/LoanProcess",
    "perdix/domain/model/loan/LoanProcessFactory",
    'perdix/domain/model/customer/EnrolmentProcess',
    "perdix/domain/model/loan/LoanCustomerRelation",
    ], function (LoanProcess, LoanFactory, EnrolmentProcess, LoanCustomerRelation) {
        var LoanProcessts = LoanProcess["LoanProcess"];
        var EnrolmentProcess = EnrolmentProcess["EnrolmentProcess"];
        var LoanCustomerRelationTypes = LoanCustomerRelation["LoanCustomerRelationTypes"];
        return {
             pageUID: "irep.loans.individual.origination.AppraisalReview",
            pageType: "Bundle",
            dependencies: ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
    "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch", "Queries", "Utils", "IndividualLoan", "BundleManager", "Message", "irfNavigator"],
            $pageFn: function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch, Queries, Utils, IndividualLoan, BundleManager, Message, irfNavigator) {
                var getBundleDefinition = function() {
                    var definition = [{
                        pageName: 'irep.loans.individual.origination.detail.IndividualEnrollmentView',
                        title: 'APPLICANT',
                        pageClass: 'applicant',
                        minimum: 1,
                        maximum: 1,
                        order: 10
                    }, {
                        pageName: 'irep.loans.individual.origination.detail.IndividualEnrollmentView',
                        title: 'CO_APPLICANT',
                        pageClass: 'co-applicant',
                        minimum: 1,
                        maximum: 1,
                        order: 20
                    }, {
                        pageName: 'irep.loans.individual.origination.detail.IndividualEnrollmentView',
                        title: 'GUARANTOR',
                        pageClass: 'guarantor',
                        minimum: 1,
                        maximum: 1,
                        order: 30
                    }, {
                        pageName: 'irep.loans.individual.origination.detail.EnterpriseEnrollmentView',
                        title: 'BUSINESS',
                        pageClass: 'business',
                        minimum: 1,
                        maximum: 1,
                        order: 40
                    }, {
                        pageName: 'irep.loans.individual.origination.detail.EnterpriseFinancialView',
                        title: 'Business Financials',
                        pageClass: 'business-finance',
                        minimum: 1,
                        maximum: 1,
                        order: 50
                    }, {
                        pageName: 'irep.loans.individual.origination.detail.LoanApplicationView',
                        title: 'Loan Recommendation',
                        pageClass: 'loan-recommendation',
                        minimum: 1,
                        maximum: 1,
                        order: 70
                    }, {
                        pageName: 'loans.individual.screening.CreditBureauView',
                        title: 'CREDIT_BUREAU',
                        pageClass: 'cbview',
                        minimum: 1,
                        maximum: 1,
                        order: 100
                    }, {
                        pageName: 'irep.loans.individual.origination.Review',
                        title: 'REVIEW',
                        pageClass: 'loan-review',
                        minimum: 1,
                        maximum: 1,
                        order: 80
                    }, {
                        pageName: 'loans.individual.misc.BalanceSheetHistory',
                        title: 'BALANCE_SHEET_HISTORY',
                        pageClass: 'balance-sheet-history',
                        minimum: 1,
                        maximum: 1,
                        order: 90
                    }];
                    if(SessionStore.getGlobalSetting('siteCode') != 'IREPDhan' || SessionStore.getGlobalSetting('siteCode') == 'IREPDhan') {
                        definition.push({
                            pageName: 'irep.loans.individual.origination.detail.SummaryView',
                            title: 'SummaryView',
                            pageClass: 'summaryView',
                            minimum: 1,
                            maximum: 1,
                            order: 5
                        });
                    } 
                    return definition;
                };
                return {
                    "type": "page-bundle",
                    "title": "APPRAISAL_REVIEW",
                    "subTitle": "LOAN_BOOKING_BUNDLE_SUB_TITLE",
                    "subTitle": "",
                    "readonly": true,
                    "bundleDefinition": getBundleDefinition(),
                    "bundlePages": [],
                    "offline": true,
                    /* "getOfflineDisplayItem": function(value, index) {
                         var out = new Array(2);
                         for (var i = 0; i < value.bundlePages.length; i++) {
                             var page = value.bundlePages[i];
                             if (page.pageClass == "applicant") {
                                 out[0] = page.model.customer.firstName;
                             } else if (page.pageClass == "business") {
                                 out[1] = page.model.customer.firstName;
                             }
                         }
                         return out;
                     },*/

                    bundleActions: [{
                        name: "Conversation",
                        desc: "",
                        icon: "fa fa-comment",
                        fn: function(bundleModel) {
                            Message.openOrCreateConversation("Loan", $stateParams.pageId);
                        },
                        isApplicable: function(bundleModel) {
                            return true;
                        }
                    }],

                    "pre_pages_initialize": function(bundleModel) {
                        $log.info("Inside pre_page_initialize");
                        bundleModel.currentStage = "AppraisalReview";
                        var deferred = $q.defer();

                        var $this = this;
                        if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)) {
                            PageHelper.showLoader();
                            bundleModel.loanId = $stateParams.pageId;

                            LoanProcessts.get(bundleModel.loanId)
                            .subscribe(function(loanProcess){
                                var loanAccount = loanProcess.loanAccount;
                                loanProcess.applicantEnrolmentProcess.customer.customerId = loanAccount.customerId;
                                 bundleModel.loanAccount = loanAccount;

                                bundleModel.applicant = {};
                                bundleModel.coApplicants = [];
                                bundleModel.guarantors = [];
                                bundleModel.business = {};
                                bundleModel.urnNos = [];
                                bundleModel.customer_detail = {
                                    applicant: {},
                                    coApplicants: {
                                        id: [],
                                        urn: []
                                    },
                                    guarantors: {
                                        id: [],
                                        urn: []
                                    }
                                }
                                var customerIds = {
                                    coApplicants: [],
                                    guarantors: []
                                };


                                if (loanAccount.currentStage != 'AppraisalReview') {
                                    PageHelper.showProgress('load-loan', 'Loan Application is in different Stage', 2000);
                                    irfNavigator.goBack();
                                    return;
                                }

                                for (var i = 0; i < loanAccount.loanCustomerRelations.length; i++) {
                                    var cust = loanAccount.loanCustomerRelations[i];
                                    if (cust.relation == 'APPLICANT' || cust.relation == 'Applicant' || cust.relation == 'Sole Proprieter') {
                                        bundleModel.urnNos.push(cust.urn);
                                        customerIds.applicant = cust.customerId;
                                        bundleModel.customer_detail.applicant.id = cust.customerId;
                                        bundleModel.customer_detail.applicant.urn = cust.urn;
                                    } else if (cust.relation == 'COAPPLICANT' || cust.relation == 'Co-Applicant') {
                                        bundleModel.urnNos.push(cust.urn);
                                        customerIds.coApplicants.push(cust.customerId);
                                        bundleModel.customer_detail.coApplicants.id.push(cust.customerId);
                                        bundleModel.customer_detail.coApplicants.urn.push(cust.urn);

                                    } else if (cust.relation == 'GUARANTOR' || cust.relation == 'Guarantor') {
                                        customerIds.guarantors.push(cust.customerId);
                                        bundleModel.customer_detail.guarantors.id.push(cust.customerId);
                                        bundleModel.customer_detail.guarantors.urn.push(cust.urn);
                                    }
                                }
                                
                                 $this.bundlePages.push({
                                    pageClass: 'applicant',
                                    model: {
                                        customerId: loanAccount.customerId,
                                        enrolmentProcess: loanProcess.applicantEnrolmentProcess,
                                        loanProcess: loanProcess
                                    }
                                });

                                if(_.hasIn(loanAccount, 'coApplicantsEnrolmentProcesses')) {
                                    for (var i=0;i<loanAccount.coApplicantsEnrolmentProcesses.length; i++){
                                        $this.bundlePages.push({
                                            pageClass: 'co-applicant',
                                            model: {
                                                enrolmentProcess: loanAccount.coApplicantsEnrolmentProcesses[i],
                                                loanProcess: loanProcess
                                            }
                                        });
                                    }
                                }

                                if(_.hasIn(loanAccount, 'guarantorsEnrolmentProcesses')) {
                                    for (var i=0;i<loanAccount.guarantorsEnrolmentProcesses.length; i++){
                                        $this.bundlePages.push({
                                            pageClass: 'guarantor',
                                            model: {
                                                enrolmentProcess: loanAccount.guarantorsEnrolmentProcesses[i],
                                                loanProcess: loanProcess
                                            }
                                        });
                                    }
                                }

                                if(SessionStore.getGlobalSetting('siteCode') != 'IREPDhan' || SessionStore.getGlobalSetting('siteCode') == 'IREPDhan') {
                                    $this.bundlePages.push({
                                        pageClass: 'summaryView',
                                        model: {
                                            cbModel: {
                                                customerId: loanAccount.customerId,
                                                loanId: loanAccount.id,
                                                scoreName: 'RiskScore3',
                                                customerDetail: bundleModel.customer_detail
                                            }
                                        }
                                    });
                                }

                                $this.bundlePages.push({
                                    pageClass: 'business',
                                    model: {
                                        customerId: loanAccount.customerId,
                                        enrolmentProcess: loanProcess.loanCustomerEnrolmentProcess,
                                        loanProcess: loanProcess
                                    }
                                });

                                $this.bundlePages.push({
                                    pageClass: 'business-finance',
                                    model: {
                                        customerId: loanAccount.customerId,
                                        enrolmentProcess: loanProcess.loanCustomerEnrolmentProcess
                                    }
                                });

                                $this.bundlePages.push({
                                    pageClass: 'loan-recommendation',
                                    model: {
                                        customerId: loanAccount.customerId
                                    }
                                });

                                $this.bundlePages.push({
                                    pageClass: 'loan-review',
                                    model: {
                                        loanAccount: loanAccount
                                    }
                                });

                                $this.bundlePages.push({
                                    pageClass: 'balance-sheet-history',
                                    model: {
                                        customerUrn: loanAccount.urnNo,
                                        loanId: loanAccount.id
                                    }
                                });

                                 $this.bundlePages.push({
                                    pageClass: 'cbview',
                                    model: {
                                        loanAccount: loanAccount
                                    }
                                });      

                                deferred.resolve();                          
                            });
                        }
                        return deferred.promise;
                    },
                    "post_pages_initialize": function(bundleModel) {
                        $log.info("Inside post_page_initialize");
                        BundleManager.broadcastEvent('origination-stage', 'AppraisalReview');

                    },
                    eventListeners: {
                        "on-customer-load": function(pageObj, bundleModel, params) {
                            BundleManager.broadcastEvent("test-listener", {
                                name: "SHAHAL AGAIN"
                            });
                        },
                        "new-enrolment": function(pageObj, bundleModel, params) {
                            switch (pageObj.pageClass) {
                                case 'applicant':
                                    $log.info("New applicant");
                                    break;
                                case 'co-applicant':
                                    $log.info("New co-applicant");
                                    break;
                                case 'guarantor':
                                    $log.info("New guarantor");
                                    break;
                                default:
                                    $log.info("Unknown page class");

                            }
                        },
                        "deviation-loaded": function(pageObj, bundleModel, params) {
                            BundleManager.broadcastEvent("load-deviation", params);
                        },
                        "financialSummary": function(pageObj, bundleModel, params) {
                            BundleManager.broadcastEvent("financial-summary", params);
                        },
                        "business": function(pageObj, bundleModel, params) {
                            BundleManager.broadcastEvent("business-customer", params);
                        }
                    }
                }
            }
        }
    }
);