define(['perdix/domain/model/customer/EnrolmentProcess'], function(EnrolmentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];

    return {
        pageUID: "agent.IndividualAgentEnrollmentScreening",
        pageType: "Bundle",
        dependencies: ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "Lead", "PageHelper", "irfStorageService", "$filter", "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch", "Queries", "Utils", "IndividualLoan", "BundleManager", "irfNavigator"],
        $pageFn: function($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, Lead, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch, Queries, Utils, IndividualLoan, BundleManager, irfNavigator) {
            return {
                "type": "page-bundle",
                "title": "INDIVIDUAL_AGENT",
                // "subTitle": "LOAN_BOOKING_BUNDLE_SUB_TITLE",
                "bundleDefinitionPromise": function() {
                    return $q.resolve([{
                        pageName: 'agent.IndividualEnrollmentForAgent',
                        title: 'CUSTOMER',
                        pageClass: 'customer',
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
                    var deferred = $q.defer();
                    var model = null;
                    var enrolmentProcess = bundleModel.enrolmentProcess;

                    switch (definition.pageClass) {
                        case 'customer':
                            /* TODO Add new coApplicant to loan process and return the model accordingly */
                            EnrolmentProcess.createNewProcess()
                                .subscribe(function(enrolmentProcess) {
                                    deferred.resolve({
                                        enrolmentProcess: enrolmentProcess
                                    })
                                });
                            break;
                        case 'agent':
                            /* TODO Add new guarantor to loan process and return model accordingly */
                            EnrolmentProcess.createNewProcess()
                                .subscribe(function(enrolmentProcess) {
                                    deferred.resolve({
                                        enrolmentProcess: enrolmentProcess
                                    })
                                });
                            break;
                    }
                    deferred.resolve(model);
                    return deferred.promise;
                },

                "pre_pages_initialize": function(bundleModel) {
                    $log.info("Inside pre_page_initialize");
                    // bundleModel.currentStage = "Screening";
                    var deferred = $q.defer();

                    var $this = this;

                    if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)) {
                        PageHelper.showLoader();
                        bundleModel.customerId = $stateParams.pageId;

                        EnrolmentProcess.get({
                                id: bundleModel.customerId
                            })
                            .subscribe(function(enrolmentProcess) {
                                bundleModel.Enrollment = enrolmentProcess;
                                var enrolmentProcess = enrolmentProcess;

                                $this.bundlePages.push({
                                    pageClass: 'customer',
                                    model: {
                                        enrolmentProcess: enrolmentProcess,
                                    }
                                });

                                // $this.bundlePages.push({
                                //     pageClass: 'agent',
                                //     model: {
                                //         agentProcess: agentProcess.agentProcess,
                                //     }
                                // });
                                deferred.resolve();

                            });

                    } else {
                        EnrolmentProcess.createNewProcess()
                            .subscribe(function(enrolmentProcess) {
                                bundleModel.enrolmentProcess = enrolmentProcess;
                                // loanProcess.loanAccount.currentStage = 'Screening';


                                $this.bundlePages.push({
                                    pageClass: "customer",
                                    model: {
                                        enrolmentProcess: enrolmentProcess,
                                    }
                                });

                                deferred.resolve();
                            });
                    }
                    return deferred.promise;

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
            }
        }
    }
})