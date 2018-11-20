irf.pageCollection.factory(irf.page('loans.individual.screening.ApplicationReview'), ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
    "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch", "Queries", "Utils", "IndividualLoan", "BundleManager", "Message", "irfNavigator","Scoring",
    function($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch, Queries, Utils, IndividualLoan, BundleManager, Message, irfNavigator,Scoring) {
        $log.info("Inside LoanBookingBundle");
        var getBundleDefinition = function() {
            var definition = [{
                pageName: 'loans.individual.screening.detail.IndividualEnrollmentView',
                title: 'APPLICANT',
                pageClass: 'applicant',
                minimum: 1,
                maximum: 1,
                order: 10
            }, {
                pageName: 'loans.individual.screening.detail.IndividualEnrollmentView',
                title: 'CO_APPLICANT',
                pageClass: 'co-applicant',
                minimum: 1,
                maximum: 1,
                order: 20
            }, {
                pageName: 'loans.individual.screening.detail.IndividualEnrollmentView',
                title: 'GUARANTOR',
                pageClass: 'guarantor',
                minimum: 1,
                maximum: 1,
                order: 30
            }, {
                pageName: 'loans.individual.screening.detail.EnterpriseEnrollmentView',
                title: 'BUSINESS',
                pageClass: 'business',
                minimum: 1,
                maximum: 1,
                order: 40
            }, {
                pageName: 'loans.individual.screening.detail.EnterpriseFinancialView',
                title: 'Business Financials',
                pageClass: 'business-finance',
                minimum: 1,
                maximum: 1,
                order: 50
            }, {
                pageName: 'loans.individual.screening.detail.PortfolioAnalysis',
                title: 'CUSTOMER HISTORY',
                pageClass: 'portfolio-analysis',
                minimum: 1,
                maximum: 1,
                order: 52
            },{
                pageName: 'loans.individual.screening.detail.LoanApplicationView',
                title: 'Loan Recommendation',
                pageClass: 'loan-recommendation',
                minimum: 1,
                maximum: 1,
                order: 70
            }, {
                pageName: 'loans.individual.screening.Summary',
                title: 'SUMMARY',
                pageClass: 'summary',
                minimum: 1,
                maximum: 1,
                order: 6
            }, {
                pageName: 'loans.individual.screening.CreditBureauView',
                title: 'CREDIT_BUREAU',
                pageClass: 'cbview',
                minimum: 1,
                maximum: 1,
                order: 100
            }, {
                pageName: 'loans.individual.screening.Review',
                title: 'REVIEW',
                pageClass: 'loan-review',
                minimum: 1,
                maximum: 1,
                order: 80
            }];
            if(SessionStore.getGlobalSetting('siteCode') != 'IREPDhan' || SessionStore.getGlobalSetting('siteCode') == 'IREPDhan') {
                definition.push({
                    pageName: 'loans.individual.screening.detail.SummaryView',
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
            "title": "APPLICATION_REVIEW",
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
                bundleModel.currentStage = "ApplicationReview";
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


                            if (res.currentStage != 'ApplicationReview') {
                                PageHelper.showProgress('load-loan', 'Loan Application is in different Stage', 2000);
                                irfNavigator.goBack();
                                return;
                            }

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
                            if(SessionStore.getGlobalSetting('siteCode') != 'IREPDhan' || SessionStore.getGlobalSetting('siteCode') == 'IREPDhan') {
                                $this.bundlePages.push({
                                    pageClass: 'summaryView',
                                    model: {
                                        cbModel: {
                                            customerId: res.customerId,
                                            loanId: bundleModel.loanId,
                                            scoreName: 'RiskScore3',
                                            customerDetail: bundleModel.customer_detail
                                        }
                                    }
                                });
                            }

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

                            $this.bundlePages.push({
                                pageClass: 'business-finance',
                                model: {
                                    customerId: res.customerId
                                }
                            });                                
            
                            $this.bundlePages.push({
                                pageClass: 'portfolio-analysis',
                                model: {
                                    cbModel: {
                                        customerId: res.customerId,
                                        loanId: bundleModel.loanId,
                                        scoreName: 'RiskScore3',
                                        customerDetail: bundleModel.customer_detail
                                    }
                                    
                                }
                            });


                            $this.bundlePages.push({
                                pageClass: 'loan-recommendation',
                                model: {
                                    customerId: res.customerId
                                }
                            });

                            $this.bundlePages.push({
                                pageClass: 'loan-review',
                                model: {
                                    loanAccount: res
                                }
                            });

                            $this.bundlePages.push({
                                pageClass: 'balance-sheet-history',
                                model: {
                                    customerUrn: res.urnNo,
                                    loanId: bundleModel.loanId
                                }
                            });

                             $this.bundlePages.push({
                                pageClass: 'cbview',
                                model: {
                                    loanAccount: res
                                }
                            });



                            deferred.resolve();

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
            },
            "post_pages_initialize": function(bundleModel) {
                $log.info("Inside post_page_initialize");
                BundleManager.broadcastEvent('origination-stage', 'ApplicationReview');

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
                "customer-history-data": function(pageObj, bundleModel, params){
                    BundleManager.broadcastEvent("customer-history-fin-snap", params);
                },
                "business": function(pageObj, bundleModel, params) {
                    BundleManager.broadcastEvent("business-customer", params);
                }
            }
        }
    }
])