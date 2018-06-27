define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/domain/model/agent/AgentProcess'], function(EnrolmentProcess, AgentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    AgentProcess = AgentProcess['AgentProcess'];
    return {
        pageUID: "agent.EnterpriseEnrollmentForAgent",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository"
        ],

        $pageFn: function($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository) {

            var self;
            var branch = SessionStore.getBranch();
            var pageParams = {
                readonly: true
            };
            var validateRequest = function(req) {
                if (req.customer && req.customer.customerBankAccounts) {
                    for (var i = 0; i < req.customer.customerBankAccounts.length; i++) {
                        var bankAccount = req.customer.customerBankAccounts[i];
                        if (bankAccount.accountNumber != bankAccount.confirmedAccountNumber) {
                            PageHelper.showProgress('validate-error', 'Bank Accounts: Account Number doesnt match with Confirmed Account Number', 5000);
                            return false;
                        }
                    }
                }
                return true;
            }
            var getLocation = function() {
                return new Promise(function(resolve, reject) {
                    navigator.geolocation.getCurrentPosition(function(p) {
                        console.log(p);
                        resolve(p);
                    }, function(err) {
                        console.log("Error");
                        reject(err);
                    })
                });
            };
            var getIncludes = function(model) {
                return [
                    "EnterpriseInformation",
                    "EnterpriseInformation.firstName",
                    "EnterpriseInformation.customerId",
                    "EnterpriseInformation.customerBranchId",
                    "EnterpriseInformation.entityId",
                    "EnterpriseInformation.urnNo",
                    "EnterpriseInformation.centreId",
                    "EnterpriseInformation.firstName",
                    "EnterpriseInformation.companyOperatingSince",
                    "EnterpriseInformation.companyEmailId",
                    "EnterpriseInformation.ownership",
                    "EnterpriseInformation.businessConstitution",
                    "EnterpriseInformation.businessHistory",
                    "EnterpriseInformation.companyRegistered",
                    "EnterpriseInformation.isGSTAvailable",

                    "EnterpriseInformation.enterpriseRegistrations",
                    "EnterpriseInformation.enterpriseRegistrations.registrationType",
                    "EnterpriseInformation.enterpriseRegistrations.registrationNumber",
                    "EnterpriseInformation.enterpriseRegistrations.registeredDate",
                    "EnterpriseInformation.enterpriseRegistrations.expiryDate",
                    "EnterpriseInformation.enterpriseRegistrations.documentId",
                    "EnterpriseInformation.businessType",
                    "EnterpriseInformation.businessActivity",

                    "ContactInformation",
                    "ContactInformation.mobilePhone",
                    "ContactInformation.landLineNo",
                    "ContactInformation.doorNo",
                    "ContactInformation.street",
                    "ContactInformation.postOffice",
                    "ContactInformation.landmark",
                    "ContactInformation.pincode",
                    "ContactInformation.locality",
                    "ContactInformation.villageName",
                    "ContactInformation.district",
                    "ContactInformation.state",
                    "ContactInformation.distanceFromBranch",
                    "ContactInformation.businessInPresentAreaSince",
                    "ContactInformation.businessInCurrentAddressSince",

                    "BankAccounts",
                    "BankAccounts.customerBankAccounts",
                    "BankAccounts.customerBankAccounts.ifscCode",
                    "BankAccounts.customerBankAccounts.customerBankName",
                    "BankAccounts.customerBankAccounts.customerBankBranchName",
                    "BankAccounts.customerBankAccounts.customerNameAsInBank",
                    "BankAccounts.customerBankAccounts.accountNumber",
                    "BankAccounts.customerBankAccounts.confirmedAccountNumber",
                    "BankAccounts.customerBankAccounts.accountType"
                ];
            }

            var configFile = function() {
                return {
                    "agentProcess.agent.currentStage": {
                        "PendingForApproval": {
                            "excludes": [
                               "actionbox" 
                            ],
                            "overrides": {
                                "EnterpriseInformation":{
                                    "readonly":true
                                },
                                "ContactInformation":{
                                    "readonly":true
                                },
                                "BankAccounts":{
                                    "readonly":true
                                }
                            }
                        },
                        "Approved": {
                            "excludes": [
                                "actionbox"
                            ],
                            "overrides": {
                                "EnterpriseInformation":{
                                    "readonly":true
                                },
                                "ContactInformation":{
                                    "readonly":true
                                },
                                "BankAccounts":{
                                    "readonly":true
                                }
                            }
                        },
                        "Rejected": {
                            "excludes": [
                                "actionbox"
                            ],
                            "overrides": {
                                "EnterpriseInformation":{
                                    "readonly":true
                                },
                                "ContactInformation":{
                                    "readonly":true
                                },
                                "BankAccounts":{
                                    "readonly":true
                                }
                            }
                        }
                    }
                }
            }

            return {
                "type": "schema-form",
                "title": "ENTERPRISE_ENROLLMENT_FOR_AGENT",
                "subTitle": "",
                initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }

                    model.pageClass=bundlePageObj.pageClass;

                    /* Setting data recieved from Bundle */

                    model.currentStage = bundleModel.currentStage;
                    /* End of setting data recieved from Bundle */


                    /* Setting data for the form */
                    model.customer = model.enrolmentProcess.customer;
                    /* End of setting data for the form */
                    var calculateVehiclesFree = function(modelValue, form, model) {}
                    var p1 = UIRepository.getEnrolmentProcessUIRepository().$promise;
                    var self = this;
                    p1.then(function(repo) {
                        var formRequest = {
                            "overrides": {
                                "BankAccounts.customerBankAccounts.accountNumber": {
                                    "type": "password",
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.confirmedAccountNumber": {
                                    "type": "string",
                                    "title": "CONFIRMED_ACCOUNT_NUMBER",
                                    "required": true
                                },
                                "ContactInformation.locality": {
                                    "readonly": true
                                },
                                "ContactInformation.villageName": {
                                    "readonly": true
                                },
                                "ContactInformation.district": {
                                    "readonly": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true
                                },
                                "ContactInformation.pincode": {
                                    "fieldType": "number",
                                    "resolver": "PincodeLOVConfiguration"
                                },
                                "EnterpriseInformation.centreId": {
                                    "readonly": true
                                },
                                "EnterpriseInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts": {
                                    "startEmpty": true
                                },
                                "EnterpriseInformation.centreId": {
                                    "readonly": true
                                },
                                "EnterpriseInformation.customerBranchId": {
                                    "readonly": true
                                },
                                "BankAccounts.customerBankAccounts": {
                                    startEmpty: true
                                },
                                "EnterpriseInformation.customerId": {
                                    type: "lov",
                                    lovonly: true,
                                    bindMap: {},
                                    key: "customer.id",
                                    initialize: function(model, form, parentModel, context) {
                                        model.customerBranchId = parentModel.customer.customerBranchId;
                                        model.centreId = parentModel.customer.centreId;
                                        var centreCode = formHelper.enum('centre').data;

                                        var centreName = $filter('filter')(centreCode, {
                                            value: parentModel.customer.centreId
                                        }, true);
                                        if (centreName && centreName.length > 0) {
                                            model.centreName = centreName[0].name;
                                        }
                                    },
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
                                            autolov: true,
                                            lovonly: true,
                                            bindMap: {},
                                            searchHelper: formHelper,
                                            search: function(inputModel, form, model, context) {
                                                var centres = SessionStore.getCentres();
                                                // $log.info("hi");
                                                // $log.info(centres);

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
                                            'customerType': "Enterprise",
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
                                    }
                                }

                            },
                            "includes": getIncludes(model),
                            "excludes": [],
                            "options": {
                                "additions": [{
                                    "type": "actionbox",
                                    "condition": "!model.customer.id",
                                    "orderNo": 2000,
                                    "items": [{
                                        "type": "submit",
                                        "title": "SUBMIT"
                                    }]
                                }, {
                                    "type": "actionbox",
                                    "condition": "model.customer.currentStage && model.customer.id && !model.agentProcess.agent.currentStage",
                                    "orderNo": 2000,
                                    "items": [{
                                        "type": "button",
                                        "title": "UPDATE",
                                        "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                    }]
                                }]
                            }
                        };


                        IrfFormRequestProcessor.buildFormDefinition(repo, formRequest,configFile(), model)
                            .then(function(form) {
                                self.form = form;
                            });
                    })
                },
                offline: false,
                getOfflineDisplayItem: function(item, index) {
                    return [
                        item.customer.firstName,
                        item.customer.centreId,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "applicant-updated": function(bundleModel, model, params) {
                        $log.info("inside applicant-updated of EnterpriseEnrolment2");
                        /* Load an existing customer associated with applicant, if exists. Otherwise default details*/
                        model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                    },
                    "co-applicant-updated": function(bundleModel, model, params) {
                        model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                    },
                    "guarantor-updated": function(bundleModel, model, params) {
                        model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                    }
                },

                form: [],

                schema: function() {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    preSave: function(model, form, formName) {
                        var deferred = $q.defer();
                        if (model.customer.firstName) {
                            deferred.resolve();
                        } else {
                            PageHelper.showProgress('enrollment', 'Customer Name is required', 3000);
                            deferred.reject();
                        }
                        return deferred.promise;
                    },
                    save: function(model, formCtrl, formName) {

                    },
                    submit: function(model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        var reqData = _.cloneDeep(model);
                        if (!(validateRequest(reqData))) {
                            return;
                        }
                        model.enrolmentProcess.processType = 'AGENT'; 
                        model.enrolmentProcess.save()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function() {
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                model.enrolmentProcess.proceed()
                                    .subscribe(function(enrolmentProcess) {
                                        PageHelper.showProgress('enrolment', 'Done.', 5000);
                                    }, function(err) {
                                        PageHelper.showErrors(err);
                                        PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                    })
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    proceed: function(model, form) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        var reqData = _.cloneDeep(model);
                        if (!(validateRequest(reqData))) {
                            return;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.enrolmentProcess.processType = 'AGENT';
                        model.enrolmentProcess.proceed()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(enrolmentProcess) {
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    }

                }
            };
        }
    }
})