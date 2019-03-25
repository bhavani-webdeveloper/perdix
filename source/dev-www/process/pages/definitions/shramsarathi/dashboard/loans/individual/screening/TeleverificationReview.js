define(["perdix/domain/model/loan/LoanProcess",
    "perdix/domain/model/loan/LoanProcessFactory",
    'perdix/domain/model/customer/EnrolmentProcess',
    "perdix/domain/model/loan/LoanCustomerRelation",
    ], function (LoanProcess, LoanFactory, EnrolmentProcess, LoanCustomerRelation) {
        var LoanProcess = LoanProcess["LoanProcess"];
        var EnrolmentProcess = EnrolmentProcess["EnrolmentProcess"];
        var LoanCustomerRelationTypes = LoanCustomerRelation["LoanCustomerRelationTypes"];
        return {
             pageUID: "shramsarathi.dashboard.loans.individual.screening.TeleverificationReview",
            pageType: "Bundle",
            dependencies: ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "LoanAccount", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
    "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch", "Queries", "Utils", "IndividualLoan", "BundleManager", "Message", "irfNavigator"],
            $pageFn: function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, LoanAccount, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch, Queries, Utils, IndividualLoan, BundleManager, Message, irfNavigator) {
                var getBundleDefinition = function() {
                    var definition = [{
                        pageName: 'shramsarathi.dashboard.loans.individual.customer.IndividualEnrolment2',
                        title: 'APPLICANT',
                        pageClass: 'applicant',
                        minimum: 1,
                        maximum: 1,
                        order: 10
                    }, 
                    {
                        pageName: 'shramsarathi.dashboard.loans.individual.customer.IndividualEnrolment2',
                        title: 'CO_APPLICANT',
                        pageClass: 'co-applicant',
                        minimum: 1,
                        maximum: 1,
                        order: 20
                    },
                     {
                        pageName: 'shramsarathi.dashboard.loans.individual.customer.IndividualEnrolment2',
                        title: 'GUARANTOR',
                        pageClass: 'guarantor',
                        minimum: 1,
                        maximum: 1,
                        order: 30
                    }, 
                    // {
                    //     pageName: 'shramsarathi.dashboard.loans.individual.screening.detail.EnterpriseEnrollmentView',
                    //     title: 'BUSINESS',
                    //     pageClass: 'business',
                    //     minimum: 1,
                    //     maximum: 1,
                    //     order: 40
                    // }, 
                    {
                        pageName: 'shramsarathi.dashboard.loans.individual.screening.detail.EnterpriseFinancialView',
                        title: 'FINANCIAL_INFORMATION_SUMMARY',
                        pageClass: 'business-finance',
                        minimum: 1,
                        maximum: 1,
                        order: 51
                    }, {
                        pageName: 'shramsarathi.dashboard.loans.individual.screening.LoanRequest',
                        title: 'Loan Request',
                        pageClass: 'loan-recommendation',
                        minimum: 1,
                        maximum: 1,
                        order: 40
                    }, {
                        pageName: 'loans.individual.screening.CreditBureauView',
                        title: 'CREDIT_BUREAU',
                        pageClass: 'cbview',
                        minimum: 1,
                        maximum: 1,
                        order: 50
                    }, {
                        pageName: 'loans.individual.screening.Review',
                        title: 'REVIEW',
                        pageClass: 'loan-review',
                        minimum: 1,
                        maximum: 1,
                        order: 80
                    },
                    //  {
                    //     pageName: 'loans.individual.misc.BalanceSheetHistory',
                    //     title: 'BALANCE_SHEET_HISTORY',
                    //     pageClass: 'balance-sheet-history',
                    //     minimum: 1,
                    //     maximum: 1,
                    //     order: 90
                    // },
                    {
                        pageName: 'shramsarathi.dashboard.loans.individual.screening.televerification',
                        title: 'TELE_VERIFICATION',
                        pageClass: 'televerification',
                        minimum: 1,
                        maximum: 1,
                        order:80
                        }];
                    // if(SessionStore.getGlobalSetting('siteCode') != 'IREPDhan' || SessionStore.getGlobalSetting('siteCode') == 'IREPDhan') {
                    //     definition.push({
                    //         pageName: 'shramsarathi.dashboard.loans.individual.detail.SummaryView',
                    //         title: 'SummaryView',
                    //         pageClass: 'summaryView',
                    //         minimum: 1,
                    //         maximum: 1,
                    //         order: 5
                    //     });
                    // } 
                    return definition;
                };
                return {
                    "type": "page-bundle",
                    "title": "TELEVERIFICATION_REVIEW",
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
                        bundleModel.currentStage = "Televerification";
                        var deferred = $q.defer();

                        var $this = this;
                        if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)){
                            PageHelper.showLoader();
                            bundleModel.loanId = $stateParams.pageId;

                            LoanProcess.get(bundleModel.loanId)
                            .subscribe(function(loanProcess){
                                bundleModel.loanProcess = loanProcess;
                                var loanAccount = loanProcess;
                                loanAccount.applicantEnrolmentProcess.customer.customerId = loanAccount.customerId;

                                $this.bundlePages.push({
                                    pageClass: 'applicant',
                                    model: {
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

                              
                                $this.bundlePages.push({
                                    pageClass: 'business-finance',
                                    model: {
                                        customerId: loanProcess.loanAccount.customerId,
                                        enrolmentProcess: loanProcess.loanCustomerEnrolmentProcess
                                    }
                                });

                                $this.bundlePages.push({
                                    pageClass: 'loan-recommendation',
                                    model: {
                                        loanProcess: loanProcess
                                    }
                                });

                                $this.bundlePages.push({
                                    pageClass: 'loan-review',
                                    model: {
                                        loanAccount: loanAccount
                                    }
                                });

                               
                                 $this.bundlePages.push({
                                    pageClass: 'cbview',
                                    model: {
                                        loanAccount: loanAccount
                                    }
                                });  
                                $this.bundlePages.push({
                                    pageClass: 'televerification',
                                    model: {
                                    enrolmentProcess: loanProcess.loanCustomerEnrolmentProcess,
                                    loanProcess: loanProcess
                                    }
                                });

                            //  $this.bundlePages.push({
                            //             pageClass: 'business-financial',
                            //             model: {
                            //                 customerId: loanProcess.loanAccount.customerId,
                            //                 enrolmentProcess: loanProcess.loanCustomerEnrolmentProcess,
                            //                // loanProcess: loanProcess
                            //             }
                            //  });

                                deferred.resolve();                          
                            });
                          PageHelper.hideLoader();
                        }
                        return deferred.promise;
                    },
                    "post_pages_initialize": function(bundleModel) {
                        $log.info("Inside post_page_initialize");
                        BundleManager.broadcastEvent('origination-stage', 'Televerification');

                    },
                    eventListeners: {
                        "on-customer-load": function(pageObj, bundleModel, params) {
                            BundleManager.broadcastEvent("test-listener", {
                                name: "SHAHAL AGAIN"
                            });
                        },
                        "televerification": function(pageObj, bundleModel, params){
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
                        // "financialSummary": function(pageObj, bundleModel, params) {
                        //     BundleManager.broadcastEvent("financial-summary", params);
                        // },
                        "business": function(pageObj, bundleModel, params) {
                            BundleManager.broadcastEvent("business-customer", params);
                        }
                    }
                }
            }
        }
    }
);