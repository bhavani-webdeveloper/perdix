define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/domain/model/agent/AgentProcess'], function(EnrolmentProcess, AgentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    AgentProcess = AgentProcess['AgentProcess'];

    return {
        pageUID: "agent.IndividualAgentEnrollment",
        pageType: "Engine",
        dependencies: ["$log", "$state","irfNavigator", "$stateParams", "Enrollment", "Agent", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository"
        ],

        $pageFn: function($log, $state,irfNavigator, $stateParams, Enrollment, Agent, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository) {

            var self;
            var branch = SessionStore.getBranch();
            var pageParams = {
                readonly: true
            };

            var configFile = function() {
                return {
                    "agentProcess.agent.currentStage": {
                        "PendingForApproval": {
                            "excludes": [
                               "actionbox" 
                            ],
                            "overrides": {
                                "AgentInformation":{
                                    "readonly":true
                                },
                                "AgentFeeDetails":{
                                    "readonly":true
                                }
                            }
                        },
                        "Approved": {
                            "excludes": [
                                "actionbox"
                            ],
                            "overrides": {
                                // "AgentInformation":{
                                //     "readonly":true
                                // },
                                // "AgentFeeDetails":{
                                //     "readonly":true
                                // }
                            }
                        },
                        "Rejected": {
                            "excludes": [
                                "actionbox"
                            ],
                            "overrides": {
                                "AgentInformation":{
                                    "readonly":true
                                },
                                "AgentFeeDetails":{
                                    "readonly":true
                                }
                            }
                        }
                    }
                }
            }

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
                    },
                    "AgentInformation.agentCompanyId": {
                        "key": "agent.agentCompanyId",
                        "title": "AGENT_ENTERPRISE_ID"
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
                    "AgentFeeDetails.agentFeeDetails.dateOfIncorporation",
                    "PostReview",
                    "PostReview.action",
                    "PostReview.proceed",
                    "PostReview.proceed.remarks",
                    "PostReview.proceed.proceedButton",
                    "PostReview.sendBack",
                    "PostReview.sendBack.remarks",
                    "PostReview.sendBack.stage",
                    "PostReview.sendBack.sendBackButton",
                    "PostReview.reject",
                    "PostReview.reject.remarks",
                    "PostReview.reject.rejectReason",
                    "PostReview.reject.rejectButton",
                    "PostReview.hold",
                    "PostReview.hold.remarks",
                    "PostReview.hold.holdButton"
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
                                },
                                "PostReview": {
                                    "type": "box",
                                    "title": "POST_REVIEW",
                                    "condition": "model.agentProcess.agent.id",
                                    "orderNo": 600,
                                    "items": {
                                        "action": {
                                            "key": "review.action",
                                            "type": "radios",
                                            "titleMap": {
                                                "REJECT": "REJECT",
                                                "SEND_BACK": "SEND_BACK",
                                                "PROCEED": "PROCEED",
                                                "HOLD": "HOLD"
                                            }
                                        },
                                        "proceed": {
                                            "type": "section",
                                            "condition": "model.review.action=='PROCEED'",
                                            "items": {
                                                "remarks": {
                                                    "title": "REMARKS",
                                                    "key": "agentProcess.remarks",
                                                    "type": "textarea",
                                                    "required": true
                                                },
                                                "proceedButton": {
                                                    "key": "review.proceedButton",
                                                    "type": "button",
                                                    "title": "PROCEED",
                                                    "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                                }
                                            }
                                        },
                                        "sendBack": {
                                            "type": "section",
                                            "condition": "model.review.action=='SEND_BACK'",
                                            "items": {
                                                "remarks": {
                                                    "title": "REMARKS",
                                                    "key": "agentProcess.remarks",
                                                    "type": "textarea",
                                                    "required": true
                                                },
                                                "stage": {
                                                    "key": "agentProcess.stage",
                                                    "required": true,
                                                    "type": "lov",
                                                    "title": "SEND_BACK_TO_STAGE",
                                                    "resolver": "AgentSendBacktoStageLOVConfiguration"
                                                },
                                                "sendBackButton": {
                                                    "key": "review.sendBackButton",
                                                    "type": "button",
                                                    "title": "SEND_BACK",
                                                    "onClick": "actions.sendBack(model, formCtrl, form, $event)"
                                                }
                                            }
                                        },
                                        "reject": {
                                            "type": "section",
                                            "condition": "model.review.action=='REJECT'",
                                            "items": {
                                                "remarks": {
                                                    "title": "REMARKS",
                                                    "key": "agentProcess.remarks",
                                                    "type": "textarea",
                                                    "required": true
                                                },
                                                "rejectReason": {
                                                    "key": "agent.rejectReason",
                                                    "type": "lov",
                                                    "autolov": true,
                                                    "required": true,
                                                    "title": "REJECT_REASON",
                                                    "resolver": "AgentRejectReasonLOVConfiguration"
                                                },
                                                "rejectButton": {
                                                    "key": "review.rejectButton",
                                                    "type": "button",
                                                    "title": "REJECT",
                                                    "required": true,
                                                    "onClick": "actions.reject(model, formCtrl, form, $event)"
                                                }
                                            }
                                        },
                                        "hold": {
                                            "type": "section",
                                            "condition": "model.review.action=='HOLD'",
                                            "items": {
                                                "remarks": {
                                                    "title": "REMARKS",
                                                    "key": "agentProcess.remarks",
                                                    "type": "textarea",
                                                    "required": true
                                                },
                                                "holdButton": {
                                                    "key": "review.holdButton",
                                                    "type": "button",
                                                    "title": "HOLD",
                                                    "required": true,
                                                    "onClick": "actions.holdButton(model, formCtrl, form, $event)"
                                                }
                                            }
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
                                    "title": "SAVE",
                                    "onClick": "actions.save(model, formCtrl, form, $event)"
                                }]
                            }]
                        }
                    }

                    UIRepository.getAgentProcessUIRepository().$promise
                        .then(function(repo) {
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
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
                    "agent-loaded": function(bundleModel, model, obj) {
                        return $q.when()
                            .then(function() {
                                if (obj.applicantCustomerId) {
                                    return AgentProcess.fromCustomerID(obj.applicantCustomerId).toPromise();
                                } else {
                                    return null;
                                }
                            })
                            .then(function(enrolmentProcess) {
                                if (agentProcess != null) {
                                    model.agentProcess = agentProcess;
                                    model.agent = agentProcess.agent;
                                    BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, agentProcess);
                                }
                                model.agent.agentId1 = obj.id;
                            })
                    },
                    "agent-updated":function(bundleModel, model, obj) {
                    },
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
                    save: function(model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.agentProcess.save()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(agentProcess) {
                                $log.info(agentProcess);
                                $log.info("agentProcess");
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                model.agentProcess=agentProcess;
                                BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, agentProcess);
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    reject: function(model, formCtrl, form, $event) {
                        PageHelper.showLoader();
                        model.agentProcess.reject()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Agent Rejected', 5000);
                                irfNavigator.goBack();
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
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
                                $log.info(agentProcess);
                                $log.info("agentProcess");
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, agentProcess);
                                irfNavigator.goBack();
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    holdButton: function(model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.agentProcess.hold()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(agentProcess) {
                                $log.info(agentProcess);
                                $log.info("agentProcess");
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                model.agentProcess=agentProcess;
                                BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, agentProcess);
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    sendBack: function(model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Agent Send Back working');
                        PageHelper.showLoader();
                        model.agentProcess.sendBack()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(agentProcess) {
                                $log.info(agentProcess);
                                $log.info("agentProcess");
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, agentProcess);
                                irfNavigator.goBack();
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