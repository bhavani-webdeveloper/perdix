define(["perdix/domain/model/loan/LoanProcess",
        "perdix/domain/model/loan/LoanProcessFactory",
        'perdix/domain/model/customer/EnrolmentProcess',
        "perdix/domain/model/loan/LoanCustomerRelation",
        ],
        function (LoanProcess, LoanFactory, EnrolmentProcess, LoanCustomerRelation) {
            var LoanProcess = LoanProcess["LoanProcess"];
            var EnrolmentProcess = EnrolmentProcess["EnrolmentProcess"];
            var LoanCustomerRelationTypes = LoanCustomerRelation["LoanCustomerRelationTypes"];
            return {
                        pageUID: "pahal.loans.individual.screening.LoanViewList",
                        pageType: "Engine",
                        dependencies: ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "LoanAccount", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
                            "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch", "Queries", "Utils", "IndividualLoan", "BundleManager", "irfNavigator"],
                        $pageFn: function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, LoanAccount, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch, Queries, Utils, IndividualLoan, BundleManager, irfNavigator) {
                            $log.info("Inside LoanBookingBundle");
                            return {
                                "type": "page-bundle",
                                "title": "VIEW_LOAN",
                                "subTitle": "",
                                "readonly": true,
                                "bundleDefinitionPromise": function() {
                                    return $q.resolve([
                                        {
                                            pageName: 'pahal.customer.IndividualEnrollment2',
                                            title: 'APPLICANT',
                                            pageClass: 'applicant',
                                            minimum: 1,
                                            maximum: 1,
                                            order: 10
                                        }, {
                                            pageName: 'pahal.customer.IndividualEnrollment2',
                                            title: 'CO_APPLICANT',
                                            pageClass: 'co-applicant',
                                            minimum: 5,
                                            maximum: 3,
                                            order: 20
                                        }, {
                                            pageName: 'pahal.customer.IndividualEnrollment2',
                                            title: 'GUARANTOR',
                                            pageClass: 'guarantor',
                                            minimum: 5,
                                            maximum: 3,
                                            order: 30
                                        }, {
                                            pageName: 'pahal.customer.EnterpriseEnrolment2',
                                            title: 'BUSINESS',
                                            pageClass: 'business',
                                            minimum: 1,
                                            maximum: 1,
                                            order: 40
                                        }, {
                                            pageName: 'pahal.customer.VehicleValuation',
                                            title: 'VEHICLE_VALUATION',
                                            pageClass: 'vehicle-valuation',
                                            minimum: 1,
                                            maximum: 1,
                                            order: 50
                                        }, {
                                            pageName: 'pahal.loans.individual.screening.LoanRequest',
                                            title: 'LOAN_REQUEST',
                                            pageClass: 'loan-request',
                                            minimum: 1,
                                            maximum: 1,
                                            order: 51
                                        },
                                        {
                                            pageName: 'pahal.loans.individual.screening.VehicleDetails',
                                            title: 'VEHICLE_DETAILS',
                                            pageClass: 'vehicle-details',
                                            minimum: 1,
                                            maximum: 1,
                                            order: 55
                                        }, {
                                            pageName: 'loans.individual.screening.CBCheck',
                                            title: 'CB_CHECK',
                                            pageClass: 'cb-check',
                                            minimum: 1,
                                            maximum: 1,
                                            order: 60
                                        }, {
                                            pageName: 'loans.individual.screening.CreditBureauView',
                                            title: 'CREDIT_BUREAU',
                                            pageClass: 'cbview',
                                            minimum: 1,
                                            maximum: 1,
                                            order: 70
                                        }, {
                                            pageName: 'loans.individual.screening.Review',
                                            title: 'REVIEW',
                                            pageClass: 'loan-review',
                                            minimum: 1,
                                            maximum: 1,
                                            order: 80
                                        }
                                    ])   
                                },
                                "bundlePages": [],
                                "offline": false,

                                "bundleActions": [{
                                    name: "Go Back",
                                    desc: "",
                                    icon: "fa fa-angle-left",
                                    fn: function (bundleModel) {

                                        irfNavigator.goBack();
                                    },
                                    isApplicable: function (bundleModel) {
                                        return true;
                                    }
                                }],

                                "getOfflineDisplayItem": function (value, index) {
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
                                },
                                "pre_pages_initialize": function (bundleModel) {
                                    $log.info("Inside pre_page_initialize");
                                    bundleModel.currentStage = "loanView";
                                    var deferred = $q.defer();

                                    var $this = this;
                                    if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)) {
                                        PageHelper.showLoader();
                                        bundleModel.loanId = $stateParams.pageId;
                                        LoanProcess.get(bundleModel.loanId)
                                            .subscribe(function (loanProcess) {
                                                loanProcess.loanAccount.currentStage = 'LoanView';
                                                bundleModel.loanProcess = loanProcess;
                                                bundleModel.loanProcess.loanAccount.isReadOnly = "Yes";
                                                var loanAccount = loanProcess;
                                                loanAccount.applicantEnrolmentProcess.customer.customerId = loanAccount.loanAccount.customerId;

                                                $this.bundlePages.push({
                                                    pageClass: 'applicant',
                                                    model: {
                                                        enrolmentProcess: loanProcess.applicantEnrolmentProcess,
                                                        loanProcess: loanProcess
                                                    }
                                                });

                                                if (_.hasIn(loanAccount, 'coApplicantsEnrolmentProcesses')) {
                                                    for (var i = 0; i < loanProcess.coApplicantsEnrolmentProcesses.length; i++) {
                                                        $this.bundlePages.push({
                                                            pageClass: 'co-applicant',
                                                            model: {
                                                                enrolmentProcess: loanProcess.coApplicantsEnrolmentProcesses[i],
                                                                loanProcess: loanProcess
                                                            }
                                                        });
                                                    }
                                                }

                                                if (_.hasIn(loanAccount, 'guarantorsEnrolmentProcesses')) {
                                                    for (var i = 0; i < loanProcess.guarantorsEnrolmentProcesses.length; i++) {
                                                        $this.bundlePages.push({
                                                            pageClass: 'guarantor',
                                                            model: {
                                                                enrolmentProcess: loanProcess.guarantorsEnrolmentProcesses[i],
                                                                loanProcess: loanProcess
                                                            }
                                                        });
                                                    }
                                                }

                                                $this.bundlePages.push({
                                                    pageClass: 'business',
                                                    model: {
                                                        enrolmentProcess: loanProcess.loanCustomerEnrolmentProcess,
                                                        loanProcess: loanProcess
                                                    }
                                                });
                                                
                                                $this.bundlePages.push({
                                                    pageClass: 'vehicle-valuation',
                                                    model: {
                                                        loanProcess: loanProcess
                                                    }
                                                });

                                                $this.bundlePages.push({
                                                    pageClass: 'loan-request',
                                                    model: {
                                                        loanProcess: loanProcess
                                                    }
                                                });

                                                $this.bundlePages.push({
                                                    pageClass: 'vehicle-details',
                                                    model: {
                                                        loanProcess: loanProcess
                                                    }
                                                });

                                                $this.bundlePages.push({
                                                    pageClass: 'cbview',
                                                    model: {
                                                        loanAccount: loanProcess.loanAccount
                                                    }
                                                });

                                                $this.bundlePages.push({
                                                    pageClass: 'loan-review',
                                                    model: {
                                                        loanAccount: loanProcess.loanAccount,
                                                    }
                                                });


                                                deferred.resolve();

                                            });
                                        }
                                    return deferred.promise;
                                },
                                "post_pages_initialize": function (bundleModel) {
                                    $log.info("Inside post_page_initialize");
                                    BundleManager.broadcastEvent('origination-stage', 'LoanView');

                                },
                                eventListeners: {
                                    "on-customer-load": function (pageObj, bundleModel, params) {
                                        BundleManager.broadcastEvent("test-listener", {
                                            name: "SHAHAL AGAIN"
                                        });
                                    },
                                    "new-enrolment": function (pageObj, bundleModel, params) {
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
                                    }
                                }
                            }
                        }
            } 
        }
)