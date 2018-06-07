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
                    "AgentInformation.customerId": {
                        type: "lov",
                        lovonly: true,
                        bindMap: {},
                        key: "agent.customerId",
                        "inputMap": {
                            "firstName": {
                                "key": "customer.firstName",
                                "title": "CUSTOMER_NAME"
                            },
                            "urnNo": {
                                "key": "customer.urnNo",
                                "title": "URN_NO",
                                "type": "string"
                            },
                            "customerBranchId": {
                                "key": "customer.customerBranchId",
                                "type": "select",
                                "screenFilter": true,
                                "readonly": true
                            },
                            "centreName": {
                                "key": "customer.place",
                                "title": "CENTRE_NAME",
                                "type": "string",
                                "readonly": true,

                            },
                            "centreId": {
                                key: "customer.centreId",
                                type: "lov",
                                autolov: false,
                                lovonly: true,
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var centres = SessionStore.getCentres();
                                    var centreCode = formHelper.enum('centre').data;
                                    var out = [];
                                    if (centres && centres.length) {
                                        for (var i = 0; i < centreCode.length; i++) {
                                            for (var j = 0; j < centres.length; j++) {
                                                if (centreCode[i].value == centres[j].id) {

                                                    out.push({
                                                        name: centreCode[i].name,
                                                        id: centreCode[i].value
                                                    })
                                                }
                                            }
                                        }
                                    }
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.centreId = valueObj.id;
                                    model.centreName = valueObj.name;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.name
                                    ];
                                }
                            },
                        },
                        "outputMap": {
                            "urnNo": "customer.urnNo",
                            "firstName": "customer.firstName"
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var branches = formHelper.enum('branch_id').data;
                            var branchName;
                            for (var i = 0; i < branches.length; i++) {
                                if (branches[i].code == inputModel.customerBranchId)
                                    branchName = branches[i].name;
                            }
                            var promise = Enrollment.search({
                                'branchName': branchName || SessionStore.getBranch(),
                                'firstName': inputModel.firstName,
                                'centreId': inputModel.centreId,
                                'customerType': "individual",
                                'urnNo': inputModel.urnNo
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                [data.firstName, data.fatherFirstName].join(' | '),
                                data.firstName,
                                data.urnNo
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            PageHelper.showProgress('customer-load', 'Loading customer...');
                            EnrolmentProcess.fromCustomerID(valueObj.id)
                                .finally(function() {
                                    PageHelper.showProgress('customer-load', 'Done.', 5000);
                                })
                                .subscribe(function(enrolmentProcess) {
                                    /* Setting on the current page */
                                    model.enrolmentProcess = enrolmentProcess;
                                    model.customer = enrolmentProcess.customer;

                                    BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                                })

                            model.agent.customerId = valueObj.id;
                        }
                    },
                    "AgentInformation.agentId": {
                        type: "lov",
                        lovonly: true,
                        bindMap: {},
                        key: "agent.agentId",
                        "inputMap": {
                            "agentId": {
                                "key": "agent.agentId",
                                "type": "number"
                            },
                            // "agentName": {
                            //     "key": "agent.agentName", 
                            //     "type": "string"
                            // },            
                            "agentType": {
                                "key": "agent.agentType",
                                "type": "select",
                                "enumCode": "agent_type",
                                "title": "AGENT_TYPE"
                            },
                        },
                        "outputMap": {
                            "agentId": "agent.agentId",
                            'agentName': "agent.agentName",
                            'agentType': "agent.agentType"
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form) {
                            var promise = Agent.search({
                                'agentId': inputModel.agentId,
                                'agentName': inputModel.agentName,
                                'agentType': inputModel.agentType,
                                'currentStage': "",
                                'customerType': ""
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                data.agentId,
                                data.agentType,
                                data.agentName
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            PageHelper.showProgress('customer-load', 'Loading customer...');
                            model.agent.agentId = valueObj.id;
                            model.agent.agentCompanyId = valueObj.agentCompanyId;
                            model.agent.agentName = valueObj.agentName;
                            model.agent.agentRegistrationNumber = valueObj.agentRegistrationNumber;
                            model.agent.companyName = valueObj.companyName;
                        }

                    },
                    "AgentFeeDetails.agentFeeDetails.feeAmount": {
                        "key": "agent.feeAmount",
                        "title": "FEE_AMOUT",
                        "type": "amount"
                    },
                    "AgentFeeDetails.agentFeeDetails.agentId": {
                        "key": "agent.agentType",
                        "title": "AGENT_TYPE",
                        "type": "select",
                        "enumCode": "agent_type"
                    }
                }
            }

            var getIncludes = function(model) {

                return [
                    "AgentInformation",
                    "AgentInformation.agentId",
                    "AgentInformation.customerId",
                    "AgentInformation.agentCompanyId",
                    "AgentInformation.agentRegistrationNumber",
                    "AgentInformation.agentType",
                    "AgentInformation.companyName",

                    "AgentFeeDetails",
                    "AgentFeeDetails.agentFeeDetails",
                    "AgentFeeDetails.agentFeeDetails.agentId",
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
                                "agentInformation": {
                                    "type": "box",
                                    "title": "PERSIONAL_INFORMATION",
                                    "orderNo": 10,
                                    "items": {
                                        "customerId": {
                                            "key": "agent.id",
                                            "title": "CUSTOMER_ID",
                                            "type": "lov",
                                            "lovonly": false
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

                // preDestroy: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                //     // console.log("Inside preDestroy");
                //     // console.log(arguments);
                //     if (bundlePageObj) {
                //         var enrolmentDetails = {
                //                 'customerId': model.customer.id,
                //                 'customerClass': bundlePageObj.pageClass,
                //                 'firstName': model.customer.firstName
                //             }
                //             // BundleManager.pushEvent('new-enrolment',  {customer: model.customer})
                //         BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails)
                //     }
                //     return $q.resolve();
                // },
                eventListeners: {
                    "test-listener": function(bundleModel, model, obj) {

                    },
                    "lead-loaded": function(bundleModel, model, obj) {
                        return $q.when()
                            .then(function() {
                                if (obj.applicantCustomerId) {
                                    return EnrolmentProcess.fromCustomerID(obj.applicantCustomerId).toPromise();
                                } else {
                                    return null;
                                }
                            })
                            .then(function(enrolmentProcess) {
                                if (enrolmentProcess != null) {
                                    model.enrolmentProcess = enrolmentProcess;
                                    model.customer = enrolmentProcess.customer;
                                    BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                                }
                                model.agent.customerId = obj.id;


                            })
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