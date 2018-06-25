define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/domain/model/agent/AgentProcess'], function(EnrolmentProcess, AgentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    AgentProcess = AgentProcess['AgentProcess'];
    return {
        pageUID: "agent.IndividualAgentEnrollmentScreening",
        pageType: "Bundle",
        dependencies: ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "Agent", "formHelper", "$stateParams", "Enrollment", "Lead", "PageHelper", "irfStorageService", "$filter", "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch", "Queries", "Utils", "IndividualLoan", "BundleManager", "irfNavigator"],
        $pageFn: function($log, $q, $timeout, SessionStore, $state, entityManager, Agent, formHelper, $stateParams, Enrollment, Lead, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch, Queries, Utils, IndividualLoan, BundleManager, irfNavigator) {
            return {
                "type": "page-bundle",
                "title": "INDIVIDUAL_AGENT",
                "bundleDefinitionPromise": function() {
                    return $q.resolve([{
                        pageName: 'agent.IndividualEnrollmentForAgent',
                        title: 'CUSTOMER',
                        pageClass: 'applicant',
                        minimum: 1,
                        maximum: 1,
                        order: 10
                    }, {
                        pageName: 'agent.IndividualAgentEnrollment',
                        title: 'AGENT',
                        pageClass: 'agent',
                        minimum: 1,
                        maximum: 1,
                        order: 20
                    }]);
                },
                "bundlePages": [],
                "offline": true,
                "getOfflineDisplayItem": function(value, index) {
                    var out = new Array(2);
                    for (var i = 0; i < value.bundlePages.length; i++) {
                        var page = value.bundlePages[i];
                        if (page.pageClass == "customer") {
                            out[0] = page.model.customer.firstName;
                        } else if (page.pageClass == "agent") {
                            out[1] = page.model.customer.firstName;
                        }
                    }
                    return out;
                },
                "onAddNewTab": function(definition, bundleModel) { /* returns model on promise resolution. */

                },

                "pre_pages_initialize": function(bundleModel) {
                    $log.info("Inside pre_page_initialize");
                    // bundleModel.currentStage = "Screening";
                    var deferred = $q.defer();
                    var $this = this;

                    if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)) {
                        PageHelper.showLoader();
                        bundleModel.agentId = $stateParams.pageId;
                        AgentProcess.get(bundleModel.agentId)
                            .subscribe(function(agentProcess) {
                                PageHelper.hideLoader();
                                bundleModel.Agent = agentProcess;
                                var agentProcess = agentProcess;

                                if (_.hasIn($stateParams.pageData, 'agent_id') && _.isNumber($stateParams.pageData['agent_id'])) {
                                    var _agent_id = $stateParams.pageData['agent_id'];
                                    loanProcess.loanAccount.leadId = _agent_id;

                                }

                                $this.bundlePages.push({
                                    pageClass: 'applicant',
                                    model: {
                                        agentProcess: agentProcess,
                                        enrolmentProcess: agentProcess.applicantEnrolmentProcess
                                    }
                                });
                                $this.bundlePages.push({
                                    pageClass: 'agent',
                                    model: {
                                        agentProcess: agentProcess,
                                        enrolmentProcess: agentProcess.applicantEnrolmentProcess

                                    }
                                });
                                deferred.resolve();

                            });

                    } else {
                        AgentProcess.createNewProcess()
                            .subscribe(function(agentProcess) {
                                bundleModel.agentProcess = agentProcess;

                                // loanProcess.loanAccount.currentStage = 'Screening';
                                $this.bundlePages.push({
                                    pageClass: "applicant",
                                    model: {
                                        enrolmentProcess: agentProcess.applicantEnrolmentProcess,
                                        agentProcess: agentProcess,
                                    }
                                });
                                $this.bundlePages.push({
                                    pageClass: 'agent',
                                    model: {
                                        agentProcess: agentProcess,
                                        enrolmentProcess: agentProcess.applicantEnrolmentProcess

                                    }
                                });

                                deferred.resolve();
                            });
                    }
                    return deferred.promise;

                },
                // "post_pages_initialize": function(bundleModel) {
                //     $log.info("Inside post_page_initialize");
                //     BundleManager.broadcastEvent('origination-stage', 'Screening');
                //     if (_.hasIn($stateParams.pageData, 'lead_id') && _.isNumber($stateParams.pageData['lead_id'])) {
                //         PageHelper.showLoader();
                //         PageHelper.showProgress("screening-input", 'Loading lead details');
                //         var _leadId = $stateParams.pageData['lead_id'];
                //         Lead.get({
                //                 id: _leadId
                //             })
                //             .$promise
                //             .then(function(res) {
                //                 PageHelper.showProgress('screening-input', 'Done.', 5000);
                //                 BundleManager.broadcastEvent('lead-loaded', res);
                //             }, function(httpRes) {
                //                 PageHelper.showErrors(httpRes);
                //             })
                //             .finally(function() {
                //                 PageHelper.hideLoader();
                //             })
                //     }

                // },
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
                    "applicant-updated": function(pageObj, bundlePageObj, obj) {
                        /* Update other pages */
                        BundleManager.broadcastEvent("applicant-updated", obj);
                    },
                    "new-enrolment": function(pageObj, bundleModel, params) {
                        switch (pageObj.pageClass) {
                            case 'applicant':
                                $log.info("New applicant");
                                bundleModel.applicant = params.customer;
                                BundleManager.broadcastEvent("new-applicant", params);
                                break;
                            case 'agent':
                                $log.info("New Business Enrolment");
                                bundleModel.agent = params.customer;
                                BundleManager.broadcastEvent("new-business", params);
                                break;

                            default:
                                $log.info("Unknown page class");
                                break;
                        }
                    },
                    "enrolment-removed": function(pageObj, bundlePageObj, enrolmentDetails) {
                        if (enrolmentDetails.customerId) {
                            BundleManager.broadcastEvent('remove-customer-relation', enrolmentDetails);
                        }
                    },
                    "cb-check-done": function(pageObj, bundlePageObj, cbCustomer) {
                        $log.info(cbCustomer);
                        if (cbCustomer.customerId) {
                            BundleManager.broadcastEvent('cb-check-update', cbCustomer);
                        }
                    }
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