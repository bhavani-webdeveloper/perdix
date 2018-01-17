define(["perdix/domain/model/loan/LoanProcess",
    "perdix/domain/model/loan/LoanProcessFactory",
    'perdix/domain/model/customer/EnrolmentProcess',
    "perdix/domain/model/loan/LoanCustomerRelation",
    ], function (LoanProcess, LoanFactory, EnrolmentProcess, LoanCustomerRelation) {
        var LoanProcessts = LoanProcess["LoanProcess"];
        var EnrolmentProcess = EnrolmentProcess["EnrolmentProcess"];
        var LoanCustomerRelationTypes = LoanCustomerRelation["LoanCustomerRelationTypes"];
        return {
            pageUID: "witfin.loans.individual.screening.BranchCrAppraisal",
            pageType: "Bundle",
            dependencies: ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams",
                            "Enrollment", "LoanAccount", "Lead", "PageHelper", "irfStorageService", "$filter", "Groups",
                            "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch", "Queries",  "Utils", "IndividualLoan", "BundleManager"],
            $pageFn: function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams,
                            Enrollment, LoanAccount, Lead, PageHelper, irfStorageService, $filter, Groups,
                            AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch, Queries,  Utils, IndividualLoan, BundleManager) {
                return {
                    "type": "page-bundle",
                    "title": "CREDIT_APPRAISAL",
                    "subTitle": "",
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
                                pageName: 'witfin.loans.individual.screening.LoanRequest',
                                title: 'LOAN_REQUEST',
                                pageClass: 'loan-request',
                                minimum: 1,
                                maximum: 1
                            },
                            {
                                pageName: 'witfin.customer.IndividualEnrollment2',
                                title: 'GUARANTOR',
                                pageClass: 'guarantor',
                                minimum: 0,
                                maximum: 3
                            },
                            {
                                pageName: 'witfin.customer.EnterpriseEnrolment2',
                                title: 'BUSINESS',
                                pageClass: 'business',
                                minimum: 1,
                                maximum: 1
                            },
                            {
                                pageName: 'witfin.customer.VehicleValuation',
                                title: 'VEHICLE_VALUATION',
                                pageClass: 'vehicle-valuation',
                                minimum: 1,
                                maximum: 1,
                                order:40
                            },
                            {
                                pageName: 'witfin.customer.ReferenceCheck',
                                title: 'Tele-verification',
                                pageClass: 'reference-check',
                                minimum: 1,
                                maximum: 1
                            },
                            {
                                pageName: 'witfin.customer.FieldInvestigation',
                                title: 'Field Investigation',
                                pageClass: 'field-investigation',
                                minimum: 1,
                                maximum: 1
                            }


                            // {
                            //     pageName: 'loans.individual.screening.CBCheck',
                            //     title: 'CB_CHECK',
                            //     pageClass: 'cb-check',
                            //     minimum: 1,
                            //     maximum: 1
                            // },
                            // {
                            //     pageName: 'loans.individual.screening.CreditBureauView',
                            //     title: 'CREDIT_BUREAU',
                            //     pageClass: 'cbview',
                            //     minimum: 1,
                            //     maximum: 1
                            // },
                            // {
                            //     pageName: 'loans.individual.screening.Review',
                            //     title: 'REVIEW',
                            //     pageClass: 'loan-review',
                            //     minimum: 1,
                            //     maximum: 1
                            // }
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
                    "onAddNewTab": function(definition, bundleModel){ /* returns model on promise resolution. */
                        var deferred = $q.defer();
                        var model = null;
                        var loanProcess = bundleModel.loanProcess;

                        switch (definition.pageClass){
                            case 'co-applicant':
                                /* TODO Add new coApplicant to loan process and return the model accordingly */
                                EnrolmentProcess.createNewProcess()
                                    .subscribe(function(enrolmentProcess) {
                                        loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, LoanCustomerRelationTypes.CO_APPLICANT);
                                        deferred.resolve({
                                            enrolmentProcess: enrolmentProcess,
                                            loanProcess: loanProcess
                                        })
                                    });
                                break;
                            case 'guarantor':
                                /* TODO Add new guarantor to loan process and return model accordingly */
                                EnrolmentProcess.createNewProcess()
                                    .subscribe(function(enrolmentProcess) {
                                        loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, LoanCustomerRelationTypes.GUARANTOR);
                                        deferred.resolve({
                                            enrolmentProcess: enrolmentProcess,
                                            loanProcess: loanProcess
                                        })
                                    });
                                break;
                        }
                        deferred.resolve(model);
                        return deferred.promise;
                    },
                    "pre_pages_initialize": function(bundleModel){
                        $log.info("Inside pre_page_initialize");
                        var deferred = $q.defer();
                        var $this = this;
                        if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)){
                            PageHelper.showLoader();
                            bundleModel.loanId = $stateParams.pageId;

                            LoanProcessts.get(bundleModel.loanId)
                            .subscribe(function(loanProcess){
                                var loanAccount = loanProcess;
                                loanAccount.applicantEnrolmentProcess.customer.customerId = loanAccount.customerId;

                                $this.bundlePages.push({
                                    pageClass: 'applicant',
                                    model: {
                                        enrolmentProcess: loanProcess.applicantEnrolmentProcess,
                                        loanProcess: loanProcess
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
                                    pageClass: 'reference-check',
                                    model: {
                                        enrolmentProcess: loanProcess.applicantEnrolmentProcess,
                                        loanProcess: loanProcess
                                    }
                                });
                                $this.bundlePages.push({
                                    pageClass: 'field-investigation',
                                    model: {
                                        enrolmentProcess: loanProcess.applicantEnrolmentProcess,
                                        loanProcess: loanProcess
                                    }
                                });

                               //   $this.bundlePages.push({
                               //      pageClass: 'cbview',
                               //      model: {
                               //          loanAccount: loanProcess.loanAccount
                               //      }
                               //  });

                               // $this.bundlePages.push({
                               //          pageClass: 'loan-review',
                               //          model: {
                               //              loanAccount: loanProcess.loanAccount,
                               //          }
                               //      });

                                deferred.resolve();

                            });

                        }
                        return deferred.promise;
                    },
                    "post_pages_initialize": function(bundleModel){
                        $log.info("Inside post_page_initialize");
                        BundleManager.broadcastEvent('origination-stage', 'BranchCreditAppraisal');
                        PageHelper.hideLoader();
                    },
                    eventListeners: {
                        "on-customer-load": function(pageObj, bundleModel, params){
                            BundleManager.broadcastEvent("test-listener", {name: "SHAHAL AGAIN"});
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
                        }
                    }
                }
            }
        }
    }
);
