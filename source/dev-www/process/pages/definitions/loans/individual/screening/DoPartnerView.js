irf.pageCollection.factory(irf.page('loans.individual.screening.DoPartnerView'), 
    ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
    "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch", "Queries", "Utils", "IndividualLoan", "BundleManager", "Message", "irfNavigator",
    function($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch, Queries, Utils, IndividualLoan, BundleManager, Message, irfNavigator) {
        $log.info("Inside LoanBookingBundle");
        var getBundleDefinition = function() {
            var definition = [{
                pageName: 'loans.individual.screening.DOPartner.DOPartnerIndividualEnrollmentView',
                title: 'APPLICANT',
                pageClass: 'applicant',
                minimum: 1,
                maximum: 1,
                order: 10
            }, {
                pageName: 'loans.individual.screening.DOPartner.DOPartnerIndividualEnrollmentView',
                title: 'CO_APPLICANT',
                pageClass: 'co-applicant',
                minimum: 1,
                maximum: 1,
                order: 20
            }, {
                pageName: 'loans.individual.screening.DOPartner.DOPartnerIndividualEnrollmentView',
                title: 'GUARANTOR',
                pageClass: 'guarantor',
                minimum: 1,
                maximum: 1,
                order: 30
            }, {
                pageName: 'loans.individual.screening.DOPartner.DOPartnerEnterpriseEnrollmentView',
                title: 'BUSINESS',
                pageClass: 'business',
                minimum: 1,
                maximum: 1,
                order: 40
            },{
                pageName: 'loans.individual.screening.DOPartnerSummary',
                title: 'SUMMARY',
                pageClass: 'summary',
                minimum: 1,
                maximum: 1,
                order: 6
            }];
            return definition;
        };
        return {
            "type": "page-bundle",
            "title": "VIEW_LOAN",
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
                //bundleModel.currentStage = "loanView";
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
                                        urn: [],
                                        name: []
                                    },
                                    guarantors: {
                                        id: [],
                                        urn: [],
                                        name: []
                                    }
                                }
                                var customerIds = {
                                    coApplicants: [],
                                    guarantors: []
                                };


                                /*if (res.currentStage != 'ApplicationReview') {
                                    PageHelper.showProgress('load-loan', 'Loan Application is in different Stage', 2000);
                                    irfNavigator.goBack();
                                    return;
                                }*/
                                if (_.hasIn(res, 'loanCustomerRelations') &&
                                    res.loanCustomerRelations != null &&
                                    res.loanCustomerRelations.length > 0) {
                                    var lcr = res.loanCustomerRelations;
                                    var idArr = [];
                                    for (var i = 0; i < lcr.length; i++) {
                                        idArr.push(lcr[i].customerId);
                                    }
                                    Queries.getCustomerBasicDetails({
                                            'ids': idArr
                                        })
                                        .then(function(result) {
                                            if (result && result.ids) {
                                                for (var i = 0; i < lcr.length; i++) {
                                                    var cust = result.ids[lcr[i].customerId];
                                                    if (cust) {
                                                        lcr[i].name = cust.first_name;
                                                    }

                                                    var custl = lcr[i];

                                                    if (custl.relation == 'APPLICANT' || custl.relation == 'Applicant' || custl.relation == 'Sole Proprieter') {
                                                        bundleModel.urnNos.push(custl.urn);
                                                        customerIds.applicant = custl.customerId;
                                                        bundleModel.customer_detail.applicant.id = custl.customerId;
                                                        bundleModel.customer_detail.applicant.urn = custl.urn;
                                                        bundleModel.customer_detail.applicant.name = custl.name;
                                                    } else if (custl.relation == 'COAPPLICANT' || custl.relation == 'Co-Applicant') {
                                                        bundleModel.urnNos.push(custl.urn);
                                                        customerIds.coApplicants.push(custl.customerId);
                                                        bundleModel.customer_detail.coApplicants.id.push(custl.customerId);
                                                        bundleModel.customer_detail.coApplicants.urn.push(custl.urn);
                                                        bundleModel.customer_detail.coApplicants.name.push(custl.name);

                                                    } else if (custl.relation == 'GUARANTOR' || custl.relation == 'Guarantor') {
                                                        customerIds.guarantors.push(custl.customerId);
                                                        bundleModel.customer_detail.guarantors.id.push(custl.customerId);
                                                        bundleModel.customer_detail.guarantors.urn.push(custl.urn);
                                                        bundleModel.customer_detail.guarantors.name.push(custl.name);
                                                    }
                                                }
                                            }

                                            $this.bundlePages.push({
                                                pageClass: 'summary',
                                                model: {
                                                    customerId: res.customerId,
                                                    cbModel: {
                                                        customerId: res.customerId,
                                                        loanId: bundleModel.loanId,
                                                        scoreName: 'RiskScore3',
                                                        customerDetail: bundleModel.customer_detail
                                                    }
                                                }
                                            });


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
                                            deferred.resolve();
                                        });
                                }

                               
                                
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
                "business": function(pageObj, bundleModel, params) {
                    BundleManager.broadcastEvent("business-customer", params);
                }
            }
        }
    }
])