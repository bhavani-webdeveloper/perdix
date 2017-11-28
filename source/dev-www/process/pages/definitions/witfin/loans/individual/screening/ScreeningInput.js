define(["perdix/domain/model/loan/LoanProcess", "perdix/domain/model/loan/LoanProcessFactory"], function(LoanProcess, LoanFactory) {
    LoanProcess = LoanProcess["LoanProcess"];
    return {
        pageUID: "witfin.loans.individual.screening.ScreeningInput",
        pageType: "Bundle",
        dependencies: ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "LoanAccount", "Lead", "PageHelper", "irfStorageService", "$filter", "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch", "Queries", "Utils", "IndividualLoan", "BundleManager"],
        $pageFn: function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, LoanAccount, Lead, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch, Queries, Utils, IndividualLoan, BundleManager) {
            return {
                "type": "page-bundle",
                "title": "SCREENING",
                "subTitle": "LOAN_BOOKING_BUNDLE_SUB_TITLE",
                "bundleDefinitionPromise": function() {
                    return $q.resolve([
                        {
                            pageName: 'witfin.customer.IndividualEnrollment2',
                            title: 'APPLICANT',
                            pageClass: 'applicant',
                            minimum: 1,
                            maximum: 1,
                            order:10
                        },
                        {
                            pageName: 'witfin.customer.IndividualEnrollment2',
                            title: 'CO_APPLICANT',
                            pageClass: 'co-applicant',
                            minimum: 0,
                            maximum: 4,
                            order:20
                        },
                        {
                            pageName: 'witfin.customer.IndividualEnrollment2',
                            title: 'GUARANTOR',
                            pageClass: 'guarantor',
                            minimum: 0,
                            maximum: 3,
                            order:30
                        },
                        {
                            pageName: 'witfin.customer.EnterpriseEnrolment2',
                            title: 'BUSINESS',
                            pageClass: 'business',
                            minimum: 1,
                            maximum: 1,
                            order:40
                        },
                        {
                            pageName: 'witfin.loans.individual.screening.LoanRequest',
                            title: 'LOAN_REQUEST',
                            pageClass: 'loan-request',
                            minimum: 1,
                            maximum: 1,
                            order:50
                        },
                        {
                            pageName: 'loans.individual.screening.CBCheck',
                            title: 'CB_CHECK',
                            pageClass: 'cb-check',
                            minimum: 1,
                            maximum: 1,
                            order:60
                        },
                        {
                            pageName: 'loans.individual.screening.CreditBureauView',
                            title: 'CREDIT_BUREAU',
                            pageClass: 'cbview',
                            minimum: 1,
                            maximum: 1,
                            order:70
                        },
                        {
                            pageName: 'loans.individual.screening.Review',
                            title: 'REVIEW',
                            pageClass: 'loan-review',
                            minimum: 1,
                            maximum: 1,
                            order:80
                        }
                    ]);
                },
                "bundlePages": [],
                "offline": true,
                "getOfflineDisplayItem": function(value, index){
                    var out = new Array(2);
                    for (var i=0; i<value.bundlePages.length; i++){
                        var page = value.bundlePages[i];
                        if (page.pageClass == "applicant"){
                            out[0] = page.model.customer.firstName;
                        } else if (page.pageClass == "business"){
                            out[1] = page.model.customer.firstName;
                        }
                    }
                    return out;
                },
                "pre_pages_initialize": function(bundleModel){
                    $log.info("Inside pre_page_initialize");
                    bundleModel.currentStage = "Screening";
                    var deferred = $q.defer();

                    var $this = this;

                    if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)){
                        PageHelper.showLoader();
                        bundleModel.loanId = $stateParams.pageId;

                        LoanProcess.get(bundleModel.loanId)
                            .subscribe(function(loanProcess){
                                var loanAccount = loanProcess.loanAccount;
                                console.log("LOOK HERE");
                                if (loanAccount.currentStage != 'Screening'){
                                    PageHelper.showProgress('load-loan', 'Loan Application is in different Stage', 2000);
                                    irfNavigator.goBack();
                                    return;
                                }

                                $this.bundlePages.push({
                                    pageClass: 'applicant',
                                    model: {
                                        loanRelation: loanAccount
                                    }
                                });

                                if(_.hasIn(loanAccount, 'coApplicantCustomers')) {
                                    for (var i=0;i<loanAccount.coApplicantCustomers.length; i++){
                                        $this.bundlePages.push({
                                            pageClass: 'co-applicant',
                                            model: {
                                                loanRelation: loanAccount.coApplicantCustomers[i]
                                            }
                                        });
                                    }
                                }

                                if(_.hasIn(loanAccount, 'guarantorCustomers')) {
                                    for (var i=0;i<loanAccount.guarantorCustomers.length; i++){
                                        $this.bundlePages.push({
                                            pageClass: 'guarantor',
                                            model: {
                                                loanRelation: loanAccount.guarantorCustomers[i]
                                            }
                                        });
                                    }
                                }
                                

                                $this.bundlePages.push({
                                    pageClass: 'business',
                                    model: {
                                        loanRelation: {customerId:loanAccount.customerId}
                                    }
                                });

                                $this.bundlePages.push({
                                    pageClass: 'loan-request',
                                    model: {
                                        loanAccount: loanAccount
                                    }
                                });

                                $this.bundlePages.push({
                                    pageClass: 'cb-check',
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
                                    pageClass: 'loan-review',
                                    model: {
                                        loanAccount: loanAccount
                                    }
                                });

                                deferred.resolve();

                            });

                    } else {
                        var loanProcess = LoanFactory.newLoanProcess()
                            .subscribe(function(loanProcess){
                                bundleModel.loanProcess = loanProcess;
                                deferred.resolve();
                            });
                    }
                    return deferred.promise;

                },
                "post_pages_initialize": function(bundleModel){
                    $log.info("Inside post_page_initialize");
                    BundleManager.broadcastEvent('origination-stage', 'Screening');
                    if (_.hasIn($stateParams.pageData, 'lead_id') &&  _.isNumber($stateParams.pageData['lead_id'])){
                        PageHelper.showLoader();
                        PageHelper.showProgress("screening-input", 'Loading lead details');
                        var _leadId = $stateParams.pageData['lead_id'];
                        Lead.get({id: _leadId})
                            .$promise
                            .then(function(res){
                                PageHelper.showProgress('screening-input', 'Done.', 5000);
                                BundleManager.broadcastEvent('lead-loaded', res);
                            }, function(httpRes){
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                    }

                    Queries.getCibilHighmarkMandatorySettings()
                        .then(function(settings){
                            BundleManager.broadcastEvent("cibil-highmark-mandatory-settings", settings);
                        })

                },
                eventListeners: {
                    "on-customer-load": function(pageObj, bundleModel, params){
                        BundleManager.broadcastEvent("test-listener", {name: "SHAHAL AGAIN"});
                    },
                    "new-loan": function(pageObj, bundleModel, params){
                        $log.info("Inside new-loan of CBCheck");
                        BundleManager.broadcastEvent("new-loan", params);
                    },
                    "new-enrolment": function(pageObj, bundleModel, params){
                        switch (pageObj.pageClass){
                            case 'applicant':
                                $log.info("New applicant");
                                bundleModel.applicant = params.customer;
                                BundleManager.broadcastEvent("new-applicant", params);
                                break;
                            case 'co-applicant':
                                $log.info("New co-applicant");
                                if (!_.hasIn(bundleModel, 'coApplicants')) {
                                    bundleModel.coApplicants = [];
                                }
                                BundleManager.broadcastEvent("new-co-applicant", params);
                                bundleModel.coApplicants.push(params.customer);
                                break;
                            case 'guarantor':
                                $log.info("New guarantor");
                                if (!_.hasIn(bundleModel, 'guarantors')){
                                    bundleModel.guarantors = [];
                                }
                                bundleModel.guarantors.push(params.guarantor);
                                BundleManager.broadcastEvent('new-guarantor', params);
                                break;
                            case 'business':
                                $log.info("New Business Enrolment");
                                bundleModel.business = params.customer;
                                BundleManager.broadcastEvent("new-business", params);
                                break;
                            default:
                                $log.info("Unknown page class");
                                break;

                        }
                    },
                    "enrolment-removed": function(pageObj, bundlePageObj, enrolmentDetails){
                        if (enrolmentDetails.customerId){
                            BundleManager.broadcastEvent('remove-customer-relation', enrolmentDetails);
                        }
                    },
                    "cb-check-done": function(pageObj, bundlePageObj, cbCustomer){
                        $log.info(cbCustomer);
                        if(cbCustomer.customerId){
                            BundleManager.broadcastEvent('cb-check-update', cbCustomer);
                        }
                    }
                },
                preSave: function(offlineData) {
                    var defer = $q.defer();
                    for (var i=0; i<offlineData.bundlePages.length; i++){
                        var page = offlineData.bundlePages[i];
                        if (page.pageClass == "applicant" && !page.model.customer.firstName){
                            PageHelper.showProgress("screening", "Applicant first name is required to save offline", 5000);
                            defer.reject();
                        }
                    }
                    defer.resolve();
                    return defer.promise;
                }
            }
        }
    }
})
