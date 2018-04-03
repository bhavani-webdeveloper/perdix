define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "lender.enrolment.Registration",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator) {

            var configFile = function () {
                return {                    
                }
            }
            var overridesFields = function (bundlePageObj) {
                return {
                    "LenderInformation": {
                        "orderNo": 10
                    },
                    "LenderContactDetails": {
                        "orderNo": 20
                    },
                    "ContactInformation": {
                        "title": "ADDRESS_DETAILS",
                        "orderNo": 30
                    },
                    "LenderInformation.leadName": {
                        "required": true
                    },
                    "LenderInformation.source": {
                        "required": true,                                   
                        "titleMap": [
                            {
                                "name": "UC",
                                "value": "UC"
                            }
                        ]
                    },
                    "LenderInformation.companyOperatingSince": {
                        "required": true
                    },
                    "LenderContactDetails.LenderContactDetails.contactPersonName": {
                        "required": true
                    },
                    "LenderContactDetails.LenderContactDetails.mobilePhone1": {
                        "required": true
                    },
                    "ContactInformation.doorNo": {
                        "required": true
                    },
                    "ContactInformation.pincode": {
                        "resolver": "PincodeLOVConfiguration",
                        "required": true
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
                    "ContactInformation.mailingDoorNo": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "required": true
                    },
                    "ContactInformation.mailingStreet": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "ContactInformation.mailingPostoffice": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "ContactInformation.mailingPincode": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "resolver": "MailingPincodeLOVConfiguration",
                        "required": true
                    },
                    "ContactInformation.mailingLocality": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "readonly": true
                    },
                    "ContactInformation.mailingDistrict": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "readonly": true
                    },
                    "ContactInformation.mailingState": {
                        "condition": "!model.customer.mailSameAsResidence",
                        "readonly": true
                    }
                }
            }
            var getIncludes = function (model) {

                return [
                    "LenderInformation",
                    "LenderInformation.firstName",
                    "LenderInformation.lenderType",
                    "LenderInformation.source",
                    "LenderInformation.businessConstitution",
                    "LenderInformation.companyOperatingSince",

                    "LenderContactDetails",
                    "LenderContactDetails.LenderContactDetails",
                    "LenderContactDetails.LenderContactDetails.contactPersonName",
                    "LenderContactDetails.LenderContactDetails.designation",
                    "LenderContactDetails.LenderContactDetails.mobilePhone1",
                    "LenderContactDetails.LenderContactDetails.mobilePhone2",
                    "LenderContactDetails.LenderContactDetails.whatsappNo",
                    "LenderContactDetails.LenderContactDetails.landLineNo",
                    "LenderContactDetails.LenderContactDetails.faxNo",
                    "LenderContactDetails.LenderContactDetails.emailId",

                    "ContactInformation",
                    "ContactInformation.doorNo",
                    "ContactInformation.street",
                    "ContactInformation.postOffice",
                    "ContactInformation.landmark",
                    "ContactInformation.pincode",
                    "ContactInformation.locality",
                    "ContactInformation.villageName",
                    "ContactInformation.district",
                    "ContactInformation.state",
                    "ContactInformation.mailSameAsResidence",
                    "ContactInformation.mailingDoorNo",
                    "ContactInformation.mailingStreet",
                    "ContactInformation..mailingPostoffice",
                    "ContactInformation.mailingPincode",
                    "ContactInformation.mailingLocality",
                    "ContactInformation.mailingDistrict",
                    "ContactInformation.mailingState"
                ];

            }

            return {
                "type": "schema-form",
                "title": "LENDER_REGISTRATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    if(_.hasIn($stateParams, "pageId") && !_.isNull($stateParams.pageId)) {
                        EnrolmentProcess.fromCustomerID($stateParams.pageId)
                            .subscribe(function(enrolmentProcess) { 
                                model.enrolmentProcess = enrolmentProcess;
                                model.customer = model.enrolmentProcess.customer;
                            });
                    } else {
                         EnrolmentProcess.createNewProcess('Lender')
                            .subscribe(function(enrolmentProcess) { 
                                console.log("else enrolmentProcess");
                                console.log(enrolmentProcess);
                                model.enrolmentProcess = enrolmentProcess;

                                model.customer = model.enrolmentProcess.customer;
                                model.customer.customerType = "Lender";
                                model.customer.currentStage = 'BasicEnrolment';
                            });
                    }

                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "additions": [
                                {
                                    "type": "actionbox",
                                    "condition": "model.customer.currentStage=='BasicEnrolment'",
                                    "orderNo": 1000,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "SUBMIT",
                                            "onClick": "actions.save(model, formCtrl, form, $event)"
                                        }
                                    ]
                                },
                                {
                                    "type": "actionbox",
                                    "condition": "model.customer.currentStage=='Completed'",
                                    "orderNo": 1200,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "UPDATE_ENROLMENT",
                                            "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                        }
                                    ]
                                }
                            ]
                        }
                    };

                    var p1 = UIRepository.getEnrolmentProcessUIRepository().$promise;
                    p1.then(function(repo){
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
                    })

                    /* Form rendering ends */
                },

                preDestroy: function (model, form, formCtrl, bundlePageObj, bundleModel) {

                },
                eventListeners: {
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                },
                form: [],

                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    save: function (model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }

                        // $q.all start
                        model.enrolmentProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                formHelper.resetFormValidityState(formCtrl);
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Lender Saved.', 5000);
                                irfNavigator.goBack();
                                PageHelper.clearErrors();
                            }, function (err) {
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
