define(["perdix/domain/model/loan/LoanProcess",
    "perdix/domain/model/loan/LoanProcessFactory",
    'perdix/domain/model/customer/EnrolmentProcess',
    "perdix/domain/model/loan/LoanCustomerRelation",
    ], function (LoanProcess, LoanFactory, EnrolmentProcess, LoanCustomerRelation) {
        var LoanProcessts = LoanProcess["LoanProcess"];
        var EnrolmentProcess = EnrolmentProcess["EnrolmentProcess"];
        var LoanCustomerRelationTypes = LoanCustomerRelation["LoanCustomerRelationTypes"];
        return {
            pageUID: "shramsarathi.dashboard.loans.individual.screening.SanctionInput",
            pageType: "Bundle",
            dependencies: ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
            ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
            "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan", "BundleManager", "Message"],
            $pageFn: function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan, BundleManager, Message) {
                return {
                    "type": "page-bundle",
                    "title": "SANCTION",
                    "subTitle": "",
                    "readonly": true,
                    "bundleDefinitionPromise": function() {
                        return $q.resolve([
                            // {
                            //     pageName: 'shramsarathi.dashboard.loans.individual.screening.Summary',
                            //     title: 'SUMMARY',
                            //     pageClass: 'summary',
                            //     minimum: 1,
                            //     maximum: 1,
                            //     order:5
                            // },
                            {
                                pageName: 'shramsarathi.dashboard.loans.individual.screening.detail.IndividualEnrollmentView',
                                title: 'APPLICANT',
                                pageClass: 'applicant',
                                minimum: 1,
                                maximum: 1,
                                order:10
                            },
                            {
                                pageName: 'shramsarathi.dashboard.loans.individual.screening.detail.IndividualEnrollmentView',
                                title: 'CO_APPLICANT',
                                pageClass: 'co-applicant',
                                minimum: 5,
                                maximum: 0,
                                order:20
                            },
                            {
                                pageName: 'shramsarathi.dashboard.loans.individual.screening.detail.IndividualEnrollmentView',
                                title: 'GUARANTOR',
                                pageClass: 'guarantor',
                                minimum: 5,
                                maximum: 0,
                                order:30
                            },
                            // {
                            //     pageName: 'shramsarathi.dashboard.loans.individual.customer.EnterpriseEnrolment2',
                            //     title: 'BUSINESS',
                            //     pageClass: 'business',
                            //     minimum: 1,
                            //     maximum: 1,
                            //     order:40
                            // },
                            {
                                pageName: 'shramsarathi.dashboard.loans.individual.screening.detail.LoanApplicationView',
                                title: 'Loan Recommendation',
                                pageClass: 'loan-recommendation',
                                minimum: 1,
                                maximum: 1,
                                order: 50
                            },
                            {
                                pageName: 'loans.individual.screening.CreditBureauView',
                                title: 'CREDIT_BUREAU',
                                pageClass: 'cbview',
                                minimum: 1,
                                maximum: 1,
                                order:60
                            },
                            {
                                pageName: 'irep.loans.individual.origination.Review',
                                title: 'REVIEW',
                                pageClass: 'loan-review',
                                minimum: 1,
                                maximum: 1,
                                order:80
                            }
                            // {
                            //     pageName: 'loans.individual.misc.BalanceSheetHistory',
                            //     title: 'BALANCE_SHEET_HISTORY',
                            //     pageClass: 'balance-sheet-history',
                            //     minimum: 1,
                            //     maximum: 1,
                            //     order: 90
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

                    bundleActions: [
                    //     {
                    //     name: "Conversation",
                    //     desc: "",
                    //     icon: "fa fa-comment",
                    //     fn: function(bundleModel) {
                    //         Message.openOrCreateConversation("Loan", $stateParams.pageId);
                    //     },
                    //     isApplicable: function(bundleModel) {
                    //         return true;
                    //     }
                    // }
                ],
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
                        bundleModel.currentStage = "Sanction";
                        var deferred = $q.defer();

                        var $this = this;
                        if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)){
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

                                // $this.bundlePages.push({
                                //     pageClass: 'summary',
                                //     model: {
                                //         cbModel: {
                                //             customerId:loanProcess.loanAccount.customerId,
                                //             loanId:bundleModel.loanId,
                                //             scoreName:'RiskScore3'
                                //         }
                                //     }
                                // });

                                
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


                                // $this.bundlePages.push({
                                //     pageClass: 'business',
                                //     model: {
                                //         enrolmentProcess: loanProcess.loanCustomerEnrolmentProcess,
                                //         loanProcess: loanProcess
                                //     }
                                // });

                                $this.bundlePages.push({
                                    pageClass: 'loan-recommendation',
                                    model: {
                                        customerId: loanAccount.customerId,
                                        loanAccount: loanAccount
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

                            //    $this.bundlePages.push({
                            //         pageClass: 'balance-sheet-history',
                            //         model: {
                            //             customerUrn: loanAccount.applicantEnrolmentProcess.customer.urnNo,
                            //             loanId: bundleModel.loanId
                            //         }
                            //     });

                                deferred.resolve();

                            });

                        }
                        return deferred.promise;
                    },
                    "post_pages_initialize": function(bundleModel){
                        $log.info("Inside post_page_initialize");
                        BundleManager.broadcastEvent('origination-stage', 'Sanction');

                    },
                    eventListeners: {
                        "on-customer-load": function(pageObj, bundleModel, params){

                        },
                        "customer-loaded": function(pageObj, bundleModel, params){
                            switch (pageObj.pageClass){
                                case 'applicant':
                                    $log.info("Applicant loaded");
                                    BundleManager.broadcastEvent("applicant-updated", params.customer);
                                    break;
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
