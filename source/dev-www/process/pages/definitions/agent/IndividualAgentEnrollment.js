define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/domain/model/agent/AgentProcess'], function(EnrolmentProcess, AgentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    AgentProcess = AgentProcess['AgentProcess'];

    return {
        pageUID: "agent.IndividualAgentEnrollment",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "Agent", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository"
        ],

        $pageFn: function($log, $state, $stateParams, Enrollment, Agent, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository) {

            var self;
            var branch = SessionStore.getBranch();
            var pageParams = {
                readonly: true
            };

            var overridesFields = function(bundlePageObj) {
                return {
                    "AgentFeeDetails.agentFeeDetails.feeAmount": {
                        "key": "agent.feeAmount",
                        "title": "FEE_AMOUT",
                        "type": "amount"
                    },
                    "AgentInformation.customerId": {
                        "key": "agent.customerId",
                        "title": "CUSTOMER_ID",
                        "type": "integer",
                        "readonly": true
                    }
                }
            }

            var getIncludes = function(model) {

                return [
                    "AgentInformation",
                    "AgentInformation.agentId1",
                    "AgentInformation.customerId",
                    "AgentInformation.agentCompanyId",
                    "AgentInformation.agentRegistrationNumber",
                    "AgentInformation.agentType",
                    "AgentInformation.companyName",
                    "AgentFeeDetails",
                    "AgentFeeDetails.agentFeeDetails",
                    "AgentFeeDetails.agentFeeDetails.feeAmount",
                    "AgentFeeDetails.agentFeeDetails.feeName",
                    "AgentFeeDetails.agentFeeDetails.feeType",
                    "AgentFeeDetails.agentFeeDetails.frequency",
                    "AgentFeeDetails.agentFeeDetails.dateOfIncorporation"
                ];

            }

            function getLoanCustomerRelation(pageClass) {

            }

            return {
                "type": "schema-form",
                "title": "INDIVIDUAL_ENROLLMENT",
                "subTitle": "",
                initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }
                    /* Setting data recieved from Bundle */
                    model.pageClass = bundlePageObj.pageClass;
                    // model.currentStage = bundleModel.currentStage;
                    /* End of setting data recieved from Bundle */

                    /* Setting data for the form */
                    model.agent = model.agentProcess.agent;
                    /* End of setting data for the form */


                    /* Form rendering starts */
                    self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "AgentInformation": {
                                    "type": "box",
                                    "orderNo": 0,
                                    "items": {
                                        "agentId1": {
                                            "key": "agent.id",
                                            "title": "AGENT_ID",
                                            "type": "integer",
                                            "readonly": true,
                                            "orderNo": 10
                                        }
                                    }
                                }
                            },
                            "additions": [{
                                "type": "actionbox",
                                // "condition": "model.customer.currentStage && model.customer.id",
                                "orderNo": 1200,
                                "items": [{
                                    "type": "button",
                                    "title": "PROCEED",
                                    "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                }]
                            }]
                        }
                    }

                    UIRepository.getAgentProcessUIRepository().$promise
                        .then(function(repo) {
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, null, model)
                        })
                        .then(function(form) {
                            self.form = form;
                        });

                    /* Form rendering ends */
                },

                preDestroy: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                    // console.log("Inside preDestroy");
                    // console.log(arguments);
                    if (bundlePageObj) {
                        var enrolmentDetails = {
                                'customerId': model.agent.customerId,
                                'customerClass': bundlePageObj.pageClass,
                                'firstName': model.agent.firstName
                            }
                            // BundleManager.pushEvent('new-enrolment',  {customer: model.customer})
                        BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails)
                    }
                    return $q.resolve();
                },
                eventListeners: {
                    "applicant-updated": function(bundleModel, model, params) {
                        $log.info("inside applicant-updated of AgentEnrolment");
                        /* Load an existing customer associated with applicant, if exists. Otherwise default details*/
                        model.enrolmentProcess.refreshEnterpriseCustomerAgentRelations(model.agentProcess);
                        model.agent.customerId = params.customer.id;
                    },
                    "test-listener": function(bundleModel, model, obj) {

                    },
                    // "agent-loaded": function(bundleModel, model, obj) {
                    //     return $q.when()
                    //         .then(function() {
                    //             if (obj.applicantCustomerId) {
                    //                 return EnrolmentProcess.fromCustomerID(obj.applicantCustomerId).toPromise();
                    //             } else {
                    //                 return null;
                    //             }
                    //         })
                    //         .then(function(enrolmentProcess) {
                    //             if (enrolmentProcess != null) {
                    //                 model.enrolmentProcess = enrolmentProcess;
                    //                 model.customer = enrolmentProcess.customer;
                    //                 BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                    //             }
                    //             model.agent.customerId = obj.id;
                    //         })
                    // },
                    "origination-stage": function(bundleModel, model, obj) {
                        model.currentStage = obj
                    }
                },
                offline: false,
                getOfflineDisplayItem: function(item, index) {
                    return [
                        item.agent.urnNo,
                        Utils.getFullName(item.agent.firstName, item.agent.middleName, item.agent.lastName),
                        item.agent.villageName
                    ]
                },
                form: [],
                schema: function() {
                    return Agent.getSchema().$promise;
                },
                actions: {
                    proceed: function(model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.agentProcess.proceed()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(agentProcess) {
                                formHelper.resetFormValidityState(form);

                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, agentProcess);
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                }
            }
        }
    }
});