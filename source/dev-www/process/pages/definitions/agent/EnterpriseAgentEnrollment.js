define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/domain/model/agent/AgentProcess'], function(EnrolmentProcess, AgentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    AgentProcess = AgentProcess['AgentProcess'];
    return {
        pageUID: "agent.EnterpriseAgentEnrollment",
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
                    "AgentEmployees.agentEmployees.customerId": {
                        "orderNo":10,
                        type: "lov",
                        lovonly: true,
                        bindMap: {},
                        //key: "agent.customerId",
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
                    "AgentEmployees.agentEmployees.agentId": {
                        type: "lov",
                        "orderNo":5,
                        lovonly: true,
                        bindMap: {},
                        "inputMap": {
                            "agentId": {
                                "key": "agent.agentId",
                                "type": "number"
                            },           
                            "agentType": {
                                "key": "agent.agentType",
                                "type": "select",
                                "enumCode": "agent_type",
                                "title": "AGENT_TYPE"
                            },
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form) {
                            var promise = Agent.search({
                                'agentId': inputModel.agentId,
                                'agentName': inputModel.agentName,
                                'agentType': inputModel.agentType,
                                'currentStage': "",
                                'customerType': "individual"
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                "Agent Id:" + " " +data.id,
                                "Agent Name:" + " " +data.agentName,
                                "Agent Type:" + " " +data.agentType,
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            PageHelper.showProgress('customer-load', 'Loading customer...');
                            model.agent.agentEmployees[context.arrayIndex].agentId = valueObj.id;
                            model.agent.agentEmployees[context.arrayIndex].customerId= valueObj.customerId;
                            model.agent.agentEmployees[context.arrayIndex].agentCompanyId = valueObj.agentCompanyId;
                            model.agent.agentEmployees[context.arrayIndex].agentName = valueObj.agentName;
                            model.agent.agentEmployees[context.arrayIndex].agentRegistrationNumber = valueObj.agentRegistrationNumber;
                            model.agent.agentEmployees[context.arrayIndex].companyName = valueObj.companyName;
                            model.agent.agentEmployees[context.arrayIndex].designation = valueObj.designation;
                        }
                    },
                    "AgentFeeDetails.agentFeeDetails.feeAmount": {
                        "key": "agent.feeAmount",
                        "title": "FEE_AMOUT",
                        "type": "amount"
                    },
                    "AgentInformation.agentId": {
                        type: "lov",
                        "orderNo":5,
                        lovonly: true,
                        bindMap: {},
                        key: "agent.id",
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
                            model.agent.id = valueObj.id;
                            model.agent.agentCompanyId = valueObj.agentCompanyId;
                            model.agent.agentName = valueObj.agentName;
                            model.agent.agentRegistrationNumber = valueObj.agentRegistrationNumber;
                            model.agent.companyName = valueObj.companyName;
                            model.agent.designation = valueObj.designation;
                        }
                    }
                }
            }

            var getIncludes = function(model) {

                return [
                    "AgentInformation",
                    "AgentInformation.agentId1",
                    "AgentEmployees",
                    "AgentEmployees.agentEmployees",
                    "AgentEmployees.agentEmployees.agentId",
                    "AgentEmployees.agentEmployees.agentCompanyId",
                    "AgentEmployees.agentEmployees.agentRegistrationNumber",
                    "AgentEmployees.agentEmployees.agentType",
                    "AgentEmployees.agentEmployees.companyName",
                    "AgentEmployees.agentEmployees.designation",
                    "AgentFeeDetails",
                    "AgentFeeDetails.agentFeeDetails",
                    "AgentFeeDetails.agentFeeDetails.feeAmount",
                    "AgentFeeDetails.agentFeeDetails.feeName",
                    "AgentFeeDetails.agentFeeDetails.feeType",
                    "AgentFeeDetails.agentFeeDetails.frequency",
                    "AgentFeeDetails.agentFeeDetails.dateOfIncorporation",
                    "AgentInformation.customerId"
                ];
            }

            function getLoanCustomerRelation(pageClass) {

            }

            return {
                "type": "schema-form",
                "title": "ENTERPRISE_AGENT_ENROLLMENT",
                "subTitle": "",
                initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }


                    // /* Setting data recieved from Bundle */
                    model.pageClass = bundlePageObj.pageClass;
                    // /* End of setting data recieved from Bundle */

                    // /* Setting data for the form */
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
                                    "title": "PERSIONAL_INFORMATION",
                                    "orderNo": 10,
                                    "items": {
                                        "customerId": {
                                            "key": "agent.customerId",
                                            "title": "ENTITY_ID",
                                            "readonly":true
                                        },
                                        "agentId1": {
                                            "key": "agent.id",
                                            "title": "AGENT_ID",
                                            "type": "integer",
                                            "readonly": true,
                                            "orderNo": 10
                                        }
                                    }
                                },
                                "AgentEmployees": {
                                    "type": "box",
                                    "title": "AGENT_EMPLOYEES",
                                    "items": {
                                        "agentEmployees": {
                                            "type": "array",
                                            "startEmpty": true,
                                            "title": "AGENT_EMPLOYEES",
                                            "key": "agent.agentEmployees",
                                            "items": {
                                                "agentId": {
                                                    "key": "agent.agentEmployees[].agentId",
                                                    "title": "AGENT_ID"
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
                            PageHelper.hideLoader();
                        });

                    /* Form rendering ends */
                },

                preDestroy: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                    // console.log("Inside preDestroy");
                    // console.log(arguments);
                    if (bundlePageObj) {
                        var enrolmentDetails = {
                                'customerId': model.customer.id,
                                'customerClass': bundlePageObj.pageClass,
                                'firstName': model.customer.firstName
                            }
                            // BundleManager.pushEvent('new-enrolment',  {customer: model.customer})
                        BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails)
                    }
                    return $q.resolve();
                },
                eventListeners: {
                    "test-listener": function(bundleModel, model, obj) {

                    },
                    "business-updated": function(bundleModel, model, params) {
                        $log.info("inside applicant-updated of AgentEnrolment");
                        /* Load an existing customer associated with applicant, if exists. Otherwise default details*/
                       // model.enrolmentProcess.refreshEnterpriseCustomerAgentRelations(model.agentProcess);
                        model.agent.customerId = params.customer.id;
                    },

                    "origination-stage": function(bundleModel, model, obj) {
                        model.currentStage = obj
                    }
                },
                offline: false,
                getOfflineDisplayItem: function(item, index) {
                    return [
                        item.customer.urnNo,
                        Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                        item.customer.villageName
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
            };
        }
    }
})