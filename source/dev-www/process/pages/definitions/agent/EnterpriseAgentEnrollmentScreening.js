define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/domain/model/agent/AgentProcess'], function(EnrolmentProcess, AgentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    AgentProcess = AgentProcess['AgentProcess'];

    return {
        pageUID: "agent.EnterpriseAgentEnrollmentScreening",
        pageType: "Bundle",
        dependencies: ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "LoanAccount", "Lead", "PageHelper", "irfStorageService", "$filter", "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch", "Queries", "Utils", "IndividualLoan", "BundleManager", "irfNavigator"],
        $pageFn: function($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, LoanAccount, Lead, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch, Queries, Utils, IndividualLoan, BundleManager, irfNavigator) {
            return {
                "type": "page-bundle",
                "title": "ENTERPRISE_FOR_AGENT",
                // "subTitle": "LOAN_BOOKING_BUNDLE_SUB_TITLE",
                "bundleDefinitionPromise": function() {
                    return $q.resolve([{
                        pageName: 'agent.EnterpriseEnrollmentForAgent',
                        title: 'ENTERPRISE',
                        pageClass: 'business',
                        minimum: 1,
                        maximum: 1,
                        order: 10
                    }, {
                        pageName: 'agent.EnterpriseAgentEnrollment',
                        title: 'Agent',
                        pageClass: 'agent',
                        minimum: 1,
                        maximum: 0,
                        order: 20
                    }]);
                },
                "bundlePages": [],
                "offline": true,
                "getOfflineDisplayItem": function(value, index) {
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
                "onAddNewTab": function(definition, bundleModel) { /* returns model on promise resolution. */ },
                "pre_pages_initialize": function(bundleModel) {
                    $log.info("Inside pre_page_initialize");
                    // bundleModel.currentStage = "Screening";
                    var deferred = $q.defer();

                    var $this = this;

                    if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)) {
                        PageHelper.showLoader();
                        bundleModel.customerId = $stateParams.pageId;
                        AgentProcess.fromCustomerID(bundleModel.customerId)
                            .subscribe(function(enrolmentProcess) {
                                PageHelper.hideLoader();
                                bundleModel.agentProcess = agentProcess;
                                var agentProcess = agentProcess;


                                $this.bundlePages.push({
                                    pageClass: 'business',
                                    model: {
                                        agentProcess: agentProcess,
                                    }
                                });

                                $this.bundlePages.push({
                                    pageClass: 'agent',
                                    model: {
                                        agentProcess: agentProcess
                                    }
                                });

                                deferred.resolve();

                            });

                    } else {
                        AgentProcess.createNewProcess("Enterprise")
                            .subscribe(function(agentProcess) {
                                bundleModel.agentProcess = agentProcess;
                                // loanProcess.loanAccount.currentStage = 'Screening';

                                $this.bundlePages.push({
                                    pageClass: "business",
                                    model: {
                                        agentProcess: agentProcess,
                                    }
                                });

                                $this.bundlePages.push({
                                    pageClass: 'agent',
                                    model: {
                                        agentProcess: agentProcess
                                    }
                                });


                                deferred.resolve();
                            });
                    }
                    return deferred.promise;

                },
                "post_pages_initialize": function(bundleModel) {

                },
                eventListeners: {
                    "on-customer-load": function(pageObj, bundleModel, params) {
                        BundleManager.broadcastEvent("test-listener", {
                            name: "SHAHAL AGAIN"
                        });
                    },
                    "customer-loaded": function(pageObj, bundleModel, params) {
                        console.log("custome rloaded :: " + params.customer.firstName);
                        if (pageObj.pageClass == 'applicant') {
                            BundleManager.broadcastEvent("applicant-updated", params.customer);
                        }
                    },
                    "new-enrolment": function(pageObj, bundleModel, params) {
                        switch (pageObj.pageClass) {
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
                    // "new-loan": function(pageObj, bundleModel, params) {
                    //     $log.info("Inside new-loan of CBCheck");
                    //     BundleManager.broadcastEvent("new-loan", params);
                    // },
                    // "applicant-updated": function(pageObj, bundlePageObj, obj) {
                    //     /* Update other pages */
                    //     BundleManager.broadcastEvent("applicant-updated", obj);
                    // },
                    // "co-applicant-updated": function(pageObj, bundlePageObj, obj) {
                    //     /* Update other pages */
                    //     BundleManager.broadcastEvent("co-applicant-updated", obj);
                    // },
                    // "guarantor-updated": function(pageObj, bundlePageObj, obj) {
                    //     /* Update other pages */
                    //     BundleManager.broadcastEvent("guarantor-updated", obj);
                    // },
                    // "enrolment-removed": function(pageObj, bundlePageObj, enrolmentDetails) {
                    //     if (enrolmentDetails.customerId) {
                    //         BundleManager.broadcastEvent('remove-customer-relation', enrolmentDetails);
                    //     }
                    // },
                    // "cb-check-done": function(pageObj, bundlePageObj, cbCustomer) {
                    //     $log.info(cbCustomer);
                    //     if (cbCustomer.customerId) {
                    //         BundleManager.broadcastEvent('cb-check-update', cbCustomer);
                    //     }
                    // }
                },
                preSave: function(offlineData) {
                    var defer = $q.defer();
                    for (var i = 0; i < offlineData.bundlePages.length; i++) {
                        var page = offlineData.bundlePages[i];
                        if (page.pageClass == "applicant" && !page.model.customer.firstName) {
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