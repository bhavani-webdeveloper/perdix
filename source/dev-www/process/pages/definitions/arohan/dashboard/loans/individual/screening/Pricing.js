define(["perdix/domain/model/loan/LoanProcess",
    "perdix/domain/model/loan/LoanProcessFactory",
    'perdix/domain/model/customer/EnrolmentProcess',
    "perdix/domain/model/loan/LoanCustomerRelation",
    ], function (LoanProcess, LoanFactory, EnrolmentProcess, LoanCustomerRelation) {
        var LoanProcess = LoanProcess["LoanProcess"];
        var EnrolmentProcess = EnrolmentProcess["EnrolmentProcess"];
        var LoanCustomerRelationTypes = LoanCustomerRelation["LoanCustomerRelationTypes"];
        return {
            pageUID: "arohan.dashboard.loans.individual.screening.Pricing",
            pageType: "Bundle",
            dependencies: ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"IndividualLoan", "Lead", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan", "BundleManager", "Message"],
            $pageFn: function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,IndividualLoan, Lead, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan, BundleManager, Message) {
                return {
                    "type": "page-bundle",
                    "title": "PRICING",
                    "subTitle": "",
                    "bundleDefinitionPromise": function() {
                        return $q.resolve([
                            {
                                pageName: 'arohan.dashboard.loans.individual.screening.detail.IndividualEnrollmentView',
                                title: 'APPLICANT',
                                pageClass: 'applicant',
                                minimum: 1,
                                maximum: 1,
                                order:10
                            },
                            {
                                pageName: 'arohan.dashboard.loans.individual.screening.detail.IndividualEnrollmentView',
                                title: 'CO_APPLICANT',
                                pageClass: 'co-applicant',
                                minimum: 4,
                                maximum: 0,
                                order:20
                            },
                            {
                                pageName: 'arohan.dashboard.loans.individual.screening.detail.IndividualEnrollmentView',
                                title: 'GUARANTOR',
                                pageClass: 'guarantor',
                                minimum: 3,
                                maximum: 0,
                                order:30
                            },
                            {
                                pageName: 'arohan.dashboard.loans.individual.screening.detail.EnterpriseEnrollmentView',
                                title: 'BUSINESS',
                                pageClass: 'business',
                                minimum: 1,
                                maximum: 1,
                                order:40
                            },
                            // {
                            //     pageName: 'arohan.dashboard.loans.individual.screening.detail.EnterpriseFinancialView',
                            //     title: 'Business Financials',
                            //     pageClass: 'business-finance',
                            //     minimum: 1,
                            //     maximum: 1,
                            //     order:50
                            // },
                            // {
                            //     pageName: 'arohan.dashboard.loans.individual.screening.detail.PortfolioAnalysis',
                            //     title: 'Customer History',
                            //     pageClass: 'portfolio-analysis',
                            //     minimum: 1,
                            //     maximum: 1,
                            //     order: 52
                            // },
                            {
                                pageName: 'arohan.dashboard.loans.individual.screening.detail.LoanApplicationView',
                                title: 'Loan Recommendation',
                                pageClass: 'loan-recommendation',
                                minimum: 1,
                                maximum: 1,
                                order: 70
                            },
                            {
                                pageName: 'arohan.dashboard.loans.individual.screening.Summary',
                                title: 'SUMMARY',
                                pageClass: 'summary',
                                minimum: 1,
                                maximum: 1,
                                order: 6
                            },
                            {
                                pageName: 'loans.individual.screening.CreditBureauView',//CreditBureauView
                                title: 'CREDIT_BUREAU',
                                pageClass: 'cbview',
                                minimum: 1,
                                maximum: 1,
                                order:90
                            },
                            {
                                pageName: 'arohan.dashboard.CPV.Verification',
                                title: 'VERIFICATION',
                                pageClass: 'verification',
                                minimum: 1,
                                maximum: 1,
                                order:95
                            },
                            {
                                pageName: 'arohan.dashboard.loans.individual.screening.Review',
                                title: 'REVIEW',
                                pageClass: 'loan-review',
                                minimum: 1,
                                maximum: 1,
                                order:80
                            },
                            // {
                            //     pageName: 'arohan.dashboard.loans.individual.screening.detail.SummaryView',
                            //     title: 'SummaryView',
                            //     pageClass: 'summaryView',
                            //     minimum: 1,
                            //     maximum: 1,
                            //     order: 5
                            // },
                            // {
                            //     pageName: 'arohan.dashboard.loans.individual.screening.detail.PortfolioAnalyticsView',
                            //     title: 'Portfolio Analytics',
                            //     pageClass: 'portfolio-analytics',
                            //     minimum: 1,
                            //     maximum: 1,
                            //     order: 90
                            // }
                            // {
                            //     pageName: 'arohan.dashboard.loans.individual.customer.VehicleValuation',
                            //     title: 'VEHICLE_VALUATION',
                            //     pageClass: 'vehicle-valuation',
                            //     minimum: 1,
                            //     maximum: 1,
                            //     order:40
                            // },
                            // {
                            //     pageName: 'arohan.dashboard.loans.individual.screening.LoanRequest',
                            //     title: 'LOAN_REQUEST',
                            //     pageClass: 'loan-request',
                            //     minimum: 1,
                            //     maximum: 1,
                            //     order:50
                            // },
                            // {
                            //     pageName: 'loans.individual.screening.CreditBureauView',
                            //     title: 'CREDIT_BUREAU',
                            //     pageClass: 'cbview',
                            //     minimum: 1,
                            //     maximum: 1,
                            //     order:70
                            // },
                           
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
                            bundleModel.currentStage = "Pricing";
                            var deferred = $q.defer();

                            var $this = this;
                            if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)) {
                                PageHelper.showLoader();
                                bundleModel.loanId = $stateParams.pageId;
                                IndividualLoan.get({
                                    id: bundleModel.loanId
                                })
                                .$promise
                                .then(
                                    function(res) {
                                        LoanProcess.get(bundleModel.loanId)
                                        .subscribe(function(loanProcessts){
                                        bundleModel.loanAccount = res;

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


                                        // if (res.currentStage != 'ApplicationReview') {
                                        //     PageHelper.showProgress('load-loan', 'Loan Application is in different Stage', 2000);
                                        //     irfNavigator.goBack();
                                        //     return;
                                        // }

                                        for (var i = 0; i < res.loanCustomerRelations.length; i++) {
                                            var cust = res.loanCustomerRelations[i];
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
                                            pageClass: 'summary',
                                            model: {
                                                cbModel: {
                                                    customerId: res.customerId,
                                                    loanId: bundleModel.loanId,
                                                    scoreName: 'RiskScore3'
                                                }
                                            }
                                        });
                                        // if(SessionStore.getGlobalSetting('siteCode') != 'IREPDhan' || SessionStore.getGlobalSetting('siteCode') == 'IREPDhan') {
                                        //     $this.bundlePages.push({
                                        //         pageClass: 'summaryView',
                                        //         model: {
                                        //             cbModel: {
                                        //                 customerId: res.customerId,
                                        //                 loanId: bundleModel.loanId,
                                        //                 scoreName: 'RiskScore3',
                                        //                 customerDetail: bundleModel.customer_detail
                                        //             }
                                        //         }
                                        //     });
                                        // }

                                        $this.bundlePages.push({
                                            pageClass: 'applicant',
                                            model: {
                                                customerId: customerIds.applicant
                                            }
                                        });

                                        for (i in customerIds.coApplicants) {
                                            $this.bundlePages.push({
                                                pageClass: 'co-applicant',
                                                model: {
                                                    customerId: customerIds.coApplicants[i]
                                                }
                                            });
                                        }

                                        for (i in customerIds.guarantors) {
                                            $this.bundlePages.push({
                                                pageClass: 'guarantor',
                                                model: {
                                                    customerId: customerIds.guarantors[i]
                                                }
                                            });
                                        }

                                        $this.bundlePages.push({
                                            pageClass: 'business',
                                            model: {
                                                customerId: res.customerId,
                                                loanAccount: res
                                            }
                                        });

                                        // $this.bundlePages.push({
                                        //     pageClass: 'business-finance',
                                        //     model: {
                                        //         customerId: res.customerId
                                        //     }
                                        // });                                
                        
                                        // $this.bundlePages.push({
                                        //     pageClass: 'portfolio-analysis',
                                        //     model: {
                                        //         customerUrn: res.urnNo,
                                        //         cbModel: {
                                        //             customerId: res.customerId,
                                        //             loanId: bundleModel.loanId,
                                        //             scoreName: 'RiskScore3',
                                        //             customerDetail: bundleModel.customer_detail
                                        //         }
                                                
                                        //     }
                                        // });


                                        $this.bundlePages.push({
                                            pageClass: 'loan-recommendation',
                                            model: {
                                                customerId: res.customerId,
                                                loanAccount: res
                                            }
                                        });

                                        $this.bundlePages.push({
                                            pageClass: 'loan-review',
                                            model: {
                                                loanAccount: res
                                            }
                                        });


                                        $this.bundlePages.push({
                                            pageClass: 'cbview',
                                            model: {
                                                loanAccount: res
                                            }
                                        });
                                       
                                        $this.bundlePages.push({
                                            pageClass: 'verification',
                                            model: {
                                                enrolmentProcess:loanProcessts.loanCustomerEnrolmentProcess,
                                                loanProcess: loanProcessts,
                                                //loanAccount:res 
                                            }
                                        });
                                        // $this.bundlePages.push({
                                        //     pageClass: 'portfolio-analytics',
                                        //     model: {
                                        //         loanId: bundleModel.loanId
                                        //     }
                                        // });


                                        deferred.resolve();

                                        
                                    });
                                    },
                                    function(httpRes) {
                                        deferred.reject();
                                        PageHelper.showErrors(httpRes);
                                    }
                                )
                                .finally(function() {
                                    PageHelper.hideLoader();
                                })

                                
                            }
                            return deferred.promise;
                        // $log.info("Inside pre_page_initialize");
                        // bundleModel.currentStage = "ApplicationReview";
                        // var deferred = $q.defer();

                        // var $this = this;
                        // if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)){
                        //     PageHelper.showLoader();
                        //     bundleModel.loanId = $stateParams.pageId;

                        //     LoanProcessts.get(bundleModel.loanId)
                        //     .subscribe(function(loanProcess){
                        //         var loanAccount = loanProcess;
                        //         loanAccount.applicantEnrolmentProcess.customer.customerId = loanAccount.customerId;

                        //         $this.bundlePages.push({
                        //             pageClass: 'summary',
                        //             model: {
                        //                 cbModel: {
                        //                     customerId: loanProcess.loanAccount.customerId,
                        //                     loanId: bundleModel.loanId,
                        //                     scoreName: 'RiskScore3'
                        //                 }
                        //             }
                        //         });

                        //         if(SessionStore.getGlobalSetting('siteCode') != 'IREPDhan' || SessionStore.getGlobalSetting('siteCode') == 'IREPDhan') {
                        //             $this.bundlePages.push({
                        //                 pageClass: 'summaryView',
                        //                 model: {
                        //                     cbModel: {
                        //                         customerId: loanProcess.loanAccount.customerId,
                        //                         loanId: bundleModel.loanId,
                        //                         scoreName: 'RiskScore3',
                        //                         customerDetail: bundleModel.customer_detail
                        //                     }
                        //                 }
                        //             });
                        //         }
                        //         $this.bundlePages.push({
                        //             pageClass: 'applicant',
                        //             model: {
                        //                 enrolmentProcess: loanProcess.applicantEnrolmentProcess,
                        //                 loanProcess: loanProcess
                        //             }
                        //         });

                        //         if(_.hasIn(loanAccount, 'coApplicantsEnrolmentProcesses')) {
                        //             for (var i=0;i<loanAccount.coApplicantsEnrolmentProcesses.length; i++){
                        //                 $this.bundlePages.push({
                        //                     pageClass: 'co-applicant',
                        //                     model: {
                        //                         enrolmentProcess: loanAccount.coApplicantsEnrolmentProcesses[i]
                        //                     }
                        //                 });
                        //             }
                        //         }

                        //         if(_.hasIn(loanAccount, 'guarantorsEnrolmentProcesses')) {
                        //             for (var i=0;i<loanAccount.guarantorsEnrolmentProcesses.length; i++){
                        //                 $this.bundlePages.push({
                        //                     pageClass: 'guarantor',
                        //                     model: {
                        //                         enrolmentProcess: loanAccount.guarantorsEnrolmentProcesses[i]
                        //                     }
                        //                 });
                        //             }
                        //         }


                        //         $this.bundlePages.push({
                        //             pageClass: 'business',
                        //             model: {
                        //                 enrolmentProcess: loanProcess.loanCustomerEnrolmentProcess,
                        //                 loanProcess: loanProcess
                        //             }
                        //         });
                        //         // $this.bundlePages.push({
                        //         //     pageClass: 'vehicle-valuation',
                        //         //     model: {
                        //         //         loanProcess: loanProcess
                        //         //     }
                        //         // });
                        //         $this.bundlePages.push({
                        //             pageClass: 'business-finance',
                        //             model: {
                        //                 customerId: loanProcess.loanAccount.customerId
                        //             }
                        //         }); 

                        //         $this.bundlePages.push({
                        //             pageClass: 'portfolio-analysis',
                        //             model: {
                        //                 customerUrn: loanProcess.loanAccount.urnNo,
                        //                 cbModel: {
                        //                     customerId: loanProcess.loanAccount.customerId,
                        //                     loanId: bundleModel.loanId,
                        //                     scoreName: 'RiskScore3',
                        //                     customerDetail: bundleModel.customer_detail
                        //                 }
                                        
                        //             }
                        //         });

                        //         $this.bundlePages.push({
                        //             pageClass: 'loan-recommendation',
                        //             model: {
                        //                 customerId: loanProcess.loanAccount.customerId,
                        //                 loanAccount: loanProcess.loanAccount
                        //             }
                        //         });
                        //         // $this.bundlePages.push({
                        //         //     pageClass: 'loan-request',
                        //         //     model: {
                        //         //         loanProcess: loanProcess
                        //         //     }
                        //         // });

                        //         $this.bundlePages.push({
                        //             pageClass: 'loan-review',
                        //             model: {
                        //                 loanAccount: loanProcess.loanAccount
                        //             }
                        //         });

                        //          $this.bundlePages.push({
                        //             pageClass: 'cbview',
                        //             model: {
                        //                 loanAccount: loanProcess.loanAccount
                        //             }
                        //         });

                        //     //    $this.bundlePages.push({
                        //     //             pageClass: 'loan-review',
                        //     //             model: {
                        //     //                 loanAccount: loanProcess.loanAccount,
                        //     //             }
                        //     //         });
                        //     // $this.bundlePages.push({
                        //     //     pageClass: 'portfolio-analytics',
                        //     //     model: {
                        //     //         loanId: bundleModel.loanId
                        //     //     }
                        //     // });
                        //         deferred.resolve();

                        //     });

                        // }
                        // return deferred.promise;
                    },
                    "post_pages_initialize": function(bundleModel){
                        $log.info("Inside post_page_initialize");
                        BundleManager.broadcastEvent('origination-stage', 'Pricing');
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
                        },
                        "deviation-loaded": function(pageObj, bundleModel, params) {
                            BundleManager.broadcastEvent("load-deviation", params);
                        },
                        "financialSummary": function(pageObj, bundleModel, params) {
                            BundleManager.broadcastEvent("financial-summary", params);
                        },
                        "customer-history-data": function(pageObj, bundleModel, params){
                            BundleManager.broadcastEvent("customer-history-fin-snap", params);
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






