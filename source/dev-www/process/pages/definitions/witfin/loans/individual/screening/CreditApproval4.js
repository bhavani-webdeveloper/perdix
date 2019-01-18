define(["perdix/domain/model/loan/LoanProcess",
    "perdix/domain/model/loan/LoanProcessFactory",
    'perdix/domain/model/customer/EnrolmentProcess',
    "perdix/domain/model/loan/LoanCustomerRelation",
    ], function (LoanProcess, LoanFactory, EnrolmentProcess, LoanCustomerRelation) {
        var LoanProcessts = LoanProcess["LoanProcess"];
        var EnrolmentProcess = EnrolmentProcess["EnrolmentProcess"];
        var LoanCustomerRelationTypes = LoanCustomerRelation["LoanCustomerRelationTypes"];
        return {
            pageUID: "witfin.loans.individual.screening.CreditApproval4",
            pageType: "Bundle",
            dependencies: ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
            ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
            "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan", "BundleManager", "Message"],
            $pageFn: function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan, BundleManager, Message) {
                return {
                    "type": "page-bundle",
                    "title": "CREDIT_APPROVAL",
                    "subTitle": "LOAN_BOOKING_BUNDLE_SUB_TITLE",
                    "readonly": true,
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
                                maximum: 1,
                                order:20
                            },
                            {
                                pageName: 'witfin.customer.IndividualEnrollment2',
                                title: 'GUARANTOR',
                                pageClass: 'guarantor',
                                minimum: 0,
                                maximum: 1,
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
                                pageName: 'witfin.loans.individual.screening.VehicleDetails',
                                title: 'VEHICLE_DETAILS',
                                pageClass: 'vehicle-details',
                                minimum: 1,
                                maximum: 1,
                                order:55
                            },
                            {
                                pageName: 'witfin.customer.VehicleValuation',
                                title: 'VEHICLE_VALUATION',
                                pageClass: 'vehicle-valuation',
                                minimum: 1,
                                maximum: 1,
                                order:57
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
                            },
                            {
                                pageName: 'witfin.loans.individual.screening.detail.Scoring',
                                title: 'Cam',
                                pageClass: 'scoring',
                                minimum: 1,
                                maximum: 1,
                                order: 5
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
                        bundleModel.currentStage = "CreditApproval4";
                        var deferred = $q.defer();

                        var $this = this;
                        if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)){
                            PageHelper.showLoader();
                            bundleModel.loanId = $stateParams.pageId;

                            LoanProcessts.get(bundleModel.loanId)
                            .subscribe(function(loanProcess){
                                var loanAccount = loanProcess;
                                loanAccount.applicantEnrolmentProcess.customer.customerId = loanAccount.customerId;

                                // $this.bundlePages.push({
                                //     pageClass: 'summary',
                                //     model: {
                                //         cbModel: {customerId:loanAccount.customerId,loanId:bundleModel.loanId, scoreName:'RiskScore1'}
                                //     }
                                // });

                                // $this.bundlePages.push({
                                //     pageClass: 'balance-sheet-history',
                                //     model: {customerUrn:loanAccount.urnNo, loanId:bundleModel.loanId}
                                // });

                                $this.bundlePages.push({
                                    pageClass: 'applicant',
                                    model: {
                                        enrolmentProcess: loanProcess.applicantEnrolmentProcess,
                                        loanProcess: loanProcess
                                    }
                                });

                                if(_.hasIn(loanAccount, 'coApplicantsEnrolmentProcesses')) {
                                    for (var i=0;i<loanProcess.coApplicantsEnrolmentProcesses.length; i++){
                                        $this.bundlePages.push({
                                            pageClass: 'co-applicant',
                                            model: {
                                                enrolmentProcess: loanProcess.coApplicantsEnrolmentProcesses[i],
                                                loanProcess: loanProcess
                                            }
                                        });
                                    }
                                }

                                if(_.hasIn(loanAccount, 'guarantorsEnrolmentProcesses')) {
                                    for (var i=0;i<loanProcess.guarantorsEnrolmentProcesses.length; i++){
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

                                $this.bundlePages.push({
                                    pageClass: 'scoring',
                                    model: {
                                        cbModel: {
                                            customerId: loanAccount.customerId,
                                            loanId: loanProcess.loanAccount.id,
                                            scoreName: 'ConsolidatedScore',
                                            customerDetail: bundleModel.customer_detail
                                        }
                                    }
                                });

                                deferred.resolve();

                            });

                        }
                        return deferred.promise;
                    },
                    "post_pages_initialize": function(bundleModel){
                        $log.info("Inside post_page_initialize");
                        BundleManager.broadcastEvent('origination-stage', 'CreditApproval4');

                    },
                    eventListeners: {
                        "on-customer-load": function(pageObj, bundleModel, params){
                            BundleManager.broadcastEvent("test-listener", {name: "SHAHAL AGAIN"});
                        },
                        "customer-loaded": function(pageObj, bundleModel, params){
                            console.log("custome rloaded :: " + params.customer.firstName);
                            if (pageObj.pageClass =='applicant'){
                                BundleManager.broadcastEvent("applicant-updated", params.customer);
                            }
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
                        "deviation-loaded":function(pageObj, bundleModel, params){
                            BundleManager.broadcastEvent("load-deviation", params);
                        }
                    }

                }
            }

        }
    }
    );

// irf.pageCollection.factory(irf.page('witfin.loans.individual.screening.ScreeningReview'),
//  ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
//         ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
//         "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan", "BundleManager", "Message",
//         function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan, BundleManager, Message) {
//          $log.info("Inside LoanBookingBundle");


//          return {
//              "type": "page-bundle",
//              "title": "SCREENING_REVIEW",
//              "subTitle": "LOAN_BOOKING_BUNDLE_SUB_TITLE",
//                 "readonly": true,
//                 "bundleDefinition": [
//                     {
//                         pageName: 'witfin.customer.IndividualEnrollment2',
//                         title: 'APPLICANT',
//                         pageClass: 'applicant',
//                         minimum: 1,
//                         maximum: 1
//                     },
//                     {
//                         pageName: 'witfin.customer.IndividualEnrolment2',
//                         title: 'CO_APPLICANT',
//                         pageClass: 'co-applicant',
//                         minimum: 0,
//                         maximum: 3
//                     },
//                     {
//                         pageName: 'witfin.customer.IndividualEnrolment2',
//                         title: 'GUARANTOR',
//                         pageClass: 'guarantor',
//                         minimum: 0,
//                         maximum: 3
//                     },
//                     {
//                         pageName: 'witfin.customer.EnterpriseEnrolment2',
//                         title: 'BUSINESS',
//                         pageClass: 'business',
//                         minimum: 1,
//                         maximum: 1
//                     },
//                     {
//                         pageName: 'witfin.loans.individual.screening.LoanRequest',
//                         title: 'LOAN_REQUEST',
//                         pageClass: 'loan-request',
//                         minimum: 1,
//                         maximum: 1
//                     },
//                     {
//                         pageName: 'loans.individual.screening.CBCheck',
//                         title: 'CB_CHECK',
//                         pageClass: 'cb-check',
//                         minimum: 1,
//                         maximum: 1
//                     },
//                     {
//                         pageName: 'loans.individual.screening.Summary',
//                         title: 'SUMMARY',
//                         pageClass: 'summary',
//                         minimum: 1,
//                         maximum: 1
//                     },
//                     {
//                         pageName: 'loans.individual.screening.CreditBureauView',
//                         title: 'CREDIT_BUREAU',
//                         pageClass: 'cbview',
//                         minimum: 1,
//                         maximum: 1
//                     },
//                     {
//                         pageName: 'loans.individual.screening.Review',
//                         title: 'REVIEW',
//                         pageClass: 'loan-review',
//                         minimum: 1,
//                         maximum: 1
//                     },
//                     {
//                         pageName: 'loans.individual.misc.BalanceSheetHistory',
//                         title: 'BALANCE_SHEET_HISTORY',
//                         pageClass: 'balance-sheet-history',
//                         minimum: 1,
//                         maximum: 1
//                     }
//                 ],
//              "bundlePages": [],
//                 "offline": true,
//                 "getOfflineDisplayItem": function(value, index){
//                     var out = new Array(2);
//                     for (var i=0; i<value.bundlePages.length; i++){
//                         var page = value.bundlePages[i];
//                         if (page.pageClass == "applicant"){
//                             out[0] = page.model.customer.firstName;
//                         } else if (page.pageClass == "business"){
//                             out[1] = page.model.customer.firstName;
//                         }
//                     }
//                     return out;
//                 },

//                 bundleActions: [{
//                     name: "Conversation",
//                     desc: "",
//                     icon: "fa fa-comment",
//                     fn: function(bundleModel) {
//                         Message.openOrCreateConversation("Loan", $stateParams.pageId);
//                     },
//                     isApplicable: function(bundleModel) {
//                         return true;
//                     }
//                 }],

//                 "pre_pages_initialize": function(bundleModel){
//                     $log.info("Inside pre_page_initialize");
//                     bundleModel.currentStage = "ScreeningReview";
//                     var deferred = $q.defer();

//                     var $this = this;
//                     if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)){
//                         PageHelper.showLoader();
//                         bundleModel.loanId = $stateParams.pageId;

//                         LoanProcess.get(bundleModel.loanId)
//                             .subscribe(function(loanProcess){
//                                 var loanAccount = loanProcess.loanAccount;
//                                 loanAccount.applicantEnrolmentProcess.customerId = loanAccount.customerId;

//                                 if (loanAccount.currentStage != 'Screening'){
//                                     PageHelper.showProgress('load-loan', 'Loan Application is in different Stage', 2000);
//                                     irfNavigator.goBack();
//                                     return;
//                                 }

//                                 $this.bundlePages.push({
//                                     pageClass: 'applicant',
//                                     model: {
//                                         loanRelation: loanAccount.applicantEnrolmentProcess
//                                     }
//                                 });

//                                 if(_.hasIn(loanAccount, 'coApplicantCustomers')) {
//                                     for (var i=0;i<loanAccount.coApplicantCustomers.length; i++){
//                                         $this.bundlePages.push({
//                                             pageClass: 'co-applicant',
//                                             model: {
//                                                 loanRelation: loanAccount.coApplicantCustomers[i]
//                                             }
//                                         });
//                                     }
//                                 }

//                                 if(_.hasIn(loanAccount, 'guarantorCustomers')) {
//                                     for (var i=0;i<loanAccount.guarantorCustomers.length; i++){
//                                         $this.bundlePages.push({
//                                             pageClass: 'guarantor',
//                                             model: {
//                                                 loanRelation: loanAccount.guarantorCustomers[i]
//                                             }
//                                         });
//                                     }
//                                 }


//                                 $this.bundlePages.push({
//                                     pageClass: 'business',
//                                     model: {
//                                         loanRelation: {customerId:loanAccount.customerId}
//                                     }
//                                 });

//                                 $this.bundlePages.push({
//                                     pageClass: 'loan-request',
//                                     model: {
//                                         loanAccount: loanAccount
//                                     }
//                                 });

//                                 $this.bundlePages.push({
//                                     pageClass: 'cb-check',
//                                     model: {
//                                         loanAccount: loanAccount
//                                     }
//                                 });

//                                 $this.bundlePages.push({
//                                     pageClass: 'cbview',
//                                     model: {
//                                         loanAccount: loanAccount
//                                     }
//                                 });

//                                 $this.bundlePages.push({
//                                     pageClass: 'loan-review',
//                                     model: {
//                                         loanAccount: loanAccount
//                                     }
//                                 });

//                                 deferred.resolve();

//                             });

//                     } else {
//                         LoanProcess.createNewProcess()
//                             .subscribe(function(loanProcess){
//                                 bundleModel.loanProcess = loanProcess;

//                                 if (loanProcess.applicantEnrolmentProcess){
//                                     $this.bundlePages.push({
//                                         pageClass: "applicant",
//                                         model: {
//                                             enrolmentProcess: loanProcess.applicantEnrolmentProcess,
//                                             loanProcess: loanProcess
//                                         }
//                                     });
//                                 }

//                                 if (loanProcess.loanCustomerEnrolmentProcess) {
//                                     $this.bundlePages.push({
//                                         pageClass: "business",
//                                         model: {
//                                             enrolmentProcess: loanProcess.loanCustomerEnrolmentProcess,
//                                             loanProcess: loanProcess
//                                         }
//                                     });
//                                 }

//                                 $this.bundlePages.push({
//                                     pageClass: 'loan-request',
//                                     model: {
//                                         loanProcess: loanProcess
//                                     }
//                                 });

//                                 $this.bundlePages.push({
//                                     pageClass: 'cbview',
//                                     model: {
//                                         loanAccount: loanProcess.loanAccount
//                                     }
//                                 });

//                                 $this.bundlePages.push({
//                                     pageClass: 'cb-check',
//                                     model: {
//                                         loanAccount: loanProcess.loanAccount
//                                     }
//                                 });

//                                 deferred.resolve();
//                             });
//                     }
//                     return deferred.promise;
//                 },
//                 "post_pages_initialize": function(bundleModel){
//                     $log.info("Inside post_page_initialize");
//                     BundleManager.broadcastEvent('origination-stage', 'ScreeningReview');

//                 },
//              eventListeners: {
//                  "on-customer-load": function(pageObj, bundleModel, params){
//                         BundleManager.broadcastEvent("test-listener", {name: "SHAHAL AGAIN"});
//                  },
//                     "customer-loaded": function(pageObj, bundleModel, params){
//                         console.log("custome rloaded :: " + params.customer.firstName);
//                         if (pageObj.pageClass =='applicant'){
//                             BundleManager.broadcastEvent("applicant-updated", params.customer);
//                         }
//                     },
//                     "new-enrolment": function(pageObj, bundleModel, params){
//                         switch (pageObj.pageClass){
//                             case 'applicant':
//                                 $log.info("New applicant");
//                                 bundleModel.applicant = params.customer;
//                                 BundleManager.broadcastEvent("new-applicant", params);
//                                 break;
//                             case 'co-applicant':
//                                 $log.info("New co-applicant");
//                                 if (!_.hasIn(bundleModel, 'coApplicants')) {
//                                     bundleModel.coApplicants = [];
//                                 }
//                                 BundleManager.broadcastEvent("new-co-applicant", params);
//                                 bundleModel.coApplicants.push(params.customer);
//                                 break;
//                             case 'guarantor':
//                                 $log.info("New guarantor");
//                                 if (!_.hasIn(bundleModel, 'guarantors')){
//                                     bundleModel.guarantors = [];
//                                 }
//                                 bundleModel.guarantors.push(params.guarantor);
//                                 break;
//                             case 'business':
//                                 $log.info("New Business Enrolment");
//                                 bundleModel.business = params.customer;
//                                 BundleManager.broadcastEvent("new-business", params);
//                                 break;
//                             default:
//                                 $log.info("Unknown page class");
//                                 break;

//                         }
//                     },
//                     "deviation-loaded":function(pageObj, bundleModel, params){
//                         BundleManager.broadcastEvent("load-deviation", params);
//                     }
//              }
//          }
//         }
//     ]
// )
