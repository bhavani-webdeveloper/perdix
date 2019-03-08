define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "lender.enrolment.Profile",
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
                    "LenderContactInformation": {
                        "title": "ADDRESS_DETAILS",
                        "orderNo": 30
                    },
                    "BankAccounts": {
                        "orderNo": 30
                    },
                    "LenderInformation.leadName": {
                        "required": true
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
                    "LenderContactInformation.Address1.doorNo": {
                        "required": true
                    },
                    "LenderContactInformation.Address1.pincode": {
                        "required": true,
                        "resolver":"PincodeLOVConfiguration",
                    },
                    "LenderContactInformation.Address1.villageName": {
                        "readonly": true
                    },
                    "LenderContactInformation.Address1.district": {
                        "readonly": true
                    },
                    "LenderContactInformation.Address1.state": {
                        "readonly": true
                    },
                    "LenderContactInformation.Address2.mailingPincode": {
                        "readonly": true,
                        "required":false,
                        "resolver": "MailingPincodeLOVConfiguration",
                    },
                    "LenderContactInformation.Address2.mailingLocality": {
                        "readonly": true,
                        "required":false
                    },
                    "LenderContactInformation.Address2.mailingDoorNo": {
                        "readonly": true,
                        "required":false
                    },
                    "LenderContactInformation.Address2.mailingDistrict": {
                        "readonly": true,
                        "required":false
                    },
                    "LenderContactInformation.Address2.mailingState": {
                        "readonly": true,
                        "required":false
                    },
                    "BankAccounts.customerBankAccounts.ifscCode": {
                        "resolver": "BankIFSCLOVConfiguration",
                        "required": true
                    },
                    "BankAccounts.customerBankAccounts.accountType": {
                        "required": true
                    }
                }
            }
            var getIncludes = function (model) {

                return [
                    "LenderInformation",
                    "LenderInformation.firstName",
                    "LenderInformation.lenderType",
                    "LenderInformation.source",
                    "LenderInformation.companyOperatingSince",
                    "LenderInformation.businessConstitution",
                    "LenderInformation.enterpriseRegistrations",
                    "LenderInformation.enterpriseRegistrations.registrationType",
                    "LenderInformation.enterpriseRegistrations.registrationNumber",
                    "LenderInformation.enterpriseRegistrations.documentId",

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

                    "LenderContactInformation",
                    "LenderContactInformation.Address1",
                    "LenderContactInformation.Address1.addressType",
                    "LenderContactInformation.Address1.doorNo",
                    "LenderContactInformation.Address1.street",
                    "LenderContactInformation.Address1.postOffice",
                    "LenderContactInformation.Address1.landmark",
                    "LenderContactInformation.Address1.pincode",
                    "LenderContactInformation.Address1.locality",
                    "LenderContactInformation.Address1.villageName",
                    "LenderContactInformation.Address1.district",
                    "LenderContactInformation.Address1.state",
                    "LenderContactInformation.Address2",
                    "LenderContactInformation.Address2.addressType",
                    "LenderContactInformation.Address2.mailingDoorNo",
                    "LenderContactInformation.Address2.mailingStreet",
                    "LenderContactInformation.Address2.mailingPostoffice",
                    "LenderContactInformation.Address2.mailingPincode",
                    "LenderContactInformation.Address2.mailingLocality",
                    "LenderContactInformation.Address2.mailingDistrict",
                    "LenderContactInformation.Address2.mailingState",

                    "BankAccounts",
                    "BankAccounts.customerBankAccounts",
                    "BankAccounts.customerBankAccounts.ifscCode",
                    "BankAccounts.customerBankAccounts.customerBankName",
                    "BankAccounts.customerBankAccounts.customerBankBranchName",
                    "BankAccounts.customerBankAccounts.customerNameAsInBank",
                    "BankAccounts.customerBankAccounts.accountNumber",
                    "BankAccounts.customerBankAccounts.accountType"
                ];

            }

            return {
                "type": "schema-form",
                "title": "LENDER_PROFILE",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                
                   model.siteCode = SessionStore.getGlobalSetting("siteCode");

                    if(_.hasIn($stateParams, "pageId") && !_.isNull($stateParams.pageId)) {
                        PageHelper.showLoader();
                        EnrolmentProcess.fromCustomerID($stateParams.pageId)
                            .subscribe(function(enrolmentProcess) {
                                model.enrolmentProcess = enrolmentProcess;
                                model.customer = model.enrolmentProcess.customer;
                                
                                if(model.siteCode == 'KGFS'){
                                    model.customer.enterpriseRegistrations = model.customer.enterpriseRegistrations || [];
                                    
                                    model.customer.enterpriseRegistrations.push({
                                        'registrationType': 'GST',
                                    });
                                    model.customer.enterpriseRegistrations.push({
                                        'registrationType': 'PAN',
                                    });
                                }

                                PageHelper.hideLoader();
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
                                if(model.siteCode == 'KGFS'){
                                    model.customer.enterpriseRegistrations = model.customer.enterpriseRegistrations || [];
                                    model.customer.enterpriseRegistrations.push({
                                        'registrationType': 'GST',
                                    });
                                    model.customer.enterpriseRegistrations.push({
                                        'registrationType': 'PAN',
                                    });
                                }

                            });
                    }

                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {    
                              "LenderInformation": {
                                    "items": {
                                        "enterpriseRegistrations": {
                                            "key": "customer.enterpriseRegistrations",
                                            "type": "array",
                                            "condition":"model.siteCode == 'KGFS'",
                                            "startEmpty": true,
                                            "view": "fixed",
                                            "add": null,
                                            "remove": null,
                                            "title": "REGISTRATION_DETAILS",
                                            titleExpr: "model.customer.enterpriseRegistrations[arrayIndex].registrationType +  ' Deatils' | translate",
                                            "items": {
                                                "registrationType": {
                                                    "key": "customer.enterpriseRegistrations[].registrationType",
                                                    "type": "select",
                                                    "titleMap": {
                                                        "GST": "GST",
                                                        "PAN": "PAN"
                                                    },
                                                    "required": true,
                                                    "readonly": true,
                                                    "notitle": true,
                                                    "type": "hidden",
                                                    // "enumCode": "business_registration_type",
                                                    "orderNo": 220
                                                },
                                                "registrationNumber": {
                                                    "key": "customer.enterpriseRegistrations[].registrationNumber",
                                                    "title": "REGISTRATION_NUMBER",
                                                    "required": true,
                                                    "orderNo": 230
                                                },
                                                "documentId": {
                                                    "key": "customer.enterpriseRegistrations[].documentId",
                                                    "type": "file",
                                                    "title": "REGISTRATION_DOCUMENT",
                                                    "category": "CustomerEnrollment",
                                                    "subCategory": "REGISTRATIONDOCUMENT",
                                                    "fileType": "application/pdf",
                                                    "using": "scanner",
                                                    "orderNo": 260
                                                }
                                            }
                                        },
                                    }
                                },
                                "LenderContactInformation": {
                                    "type": "box",
                                    "title": "CONTACT_INFORMATION",
                                    "items": {
                                        "Address1": {
                                            "type": "fieldset",
                                            "title": "ADDRESS1",
                                            "items": {
                                                "addressType": {
                                                    "key": "customer.udf.userDefinedFieldValues.udf1",
                                                    "title": "ADDRESS_TYPE",
                                                    "type": "select",
                                                    "enumCode": "address_type",
                                                    "orderNo": 70
                                                },
                                                "doorNo": {
                                                    "key": "customer.doorNo",
                                                    "orderNo": 70
                                                },
                                                "street": {
                                                    "key": "customer.street",
                                                    "orderNo": 80
                                                },
                                                "postOffice": {
                                                    "key": "customer.postOffice",
                                                    "orderNo": 90
                                                },
                                                "landmark": {
                                                    "key": "customer.landmark",
                                                    "orderNo": 100
                                                },
                                                "pincode": {
                                                    "key": "customer.pincode",
                                                    "type": "lov",
                                                   // "inputmode": "number",
                                                    "title":"PIN_CODE",
                                                    "orderNo": 105
                                                    
                                                },
                                                "locality": {
                                                    "key": "customer.locality",
                                                    "orderNo": 110
                                                },
                                                "villageName": {
                                                    "key": "customer.villageName",
                                                    "orderNo": 120
                                                },
                                                "district": {
                                                    "key": "customer.district",
                                                    "orderNo": 130
                                                },
                                                "state": {
                                                    "key": "customer.state",
                                                    "orderNo": 140
                                                }
                                            }
                                        },
                                        "Address2": {
                                            "type": "fieldset",
                                            "title": "ADDRESS2",
                                            "items": {
                                                "addressType": {
                                                    "key": "customer.udf.userDefinedFieldValues.udf2",
                                                    "title": "ADDRESS_TYPE",
                                                    "type": "select",
                                                    "enumCode": "address_type",
                                                    "orderNo": 70
                                                },
                                                "mailingDoorNo": {
                                                    "key": "customer.mailingDoorNo",
                                                    "orderNo": 160
                                                },
                                                "mailingStreet": {
                                                    "key": "customer.mailingStreet",
                                                    "orderNo": 170
                                                },
                                                "mailingPostoffice": {
                                                    "key": "customer.mailingPostoffice",
                                                    "orderNo": 180
                                                },
                                                "mailingPincode": {
                                                    "key": "customer.mailingPincode",
                                                    "required":false,
                                                    "type": "lov",
                                                    "orderNo": 190
                                                },
                                                "mailingLocality": {
                                                    "key": "customer.mailingLocality",
                                                    "orderNo": 200
                                                },
                                                "mailingDistrict": {
                                                    "key": "customer.mailingDistrict",
                                                    "orderNo": 210
                                                },
                                                "mailingState": {
                                                    "key": "customer.mailingState",
                                                    "orderNo": 220
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "additions": [
                                {
                                    "type": "actionbox",
                                    "condition": "!model.customer.id",
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
                                    "condition": "model.customer.id && model.customer.currentStage != 'Completed'",
                                    "type": "actionbox",
                                    "orderNo": 10000,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "SAVE",
                                            "onClick": "actions.save(model, formCtrl, form, $event)"
                                        },
                                        {
                                            "type": "button",
                                            "title": "PROCEED",
                                            "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                        }
                                    ]
                                },
                                {
                                    "condition": "model.customer.id && model.customer.currentStage == 'Completed'",
                                    "type": "actionbox",
                                    "orderNo": 10000,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "UPDATE",
                                            "onClick": "actions.update(model, formCtrl, form, $event)"
                                        }
                                    ]
                                }
                            ]
                        }
                    };
                    UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function(repo){
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form){
                            self.form = form;
                            console.log("INSIDE HERE 111");
                        });

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
                        PageHelper.showLoader();
                        model.enrolmentProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                formHelper.resetFormValidityState(formCtrl);
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Lender Saved.', 5000);
                                if(!model.customer.id) {
                                    model.customer = value.customer;
                                    model.enrolmentProcess.customer = value.customer;
                                }
                                //irfNavigator.goBack();
                                PageHelper.clearErrors();
                            }, function (err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    proceed: function (model, formCtrl, form, $event) {
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
                        PageHelper.showLoader();
                        model.enrolmentProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                formHelper.resetFormValidityState(formCtrl);
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Lender Proceed.', 5000);
                                return irfNavigator.goBack();
                                PageHelper.clearErrors();
                            }, function (err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    update: function (model, formCtrl, form, $event) {
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
                        PageHelper.showLoader();
                        model.enrolmentProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                formHelper.resetFormValidityState(formCtrl);
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Profile Updated.', 5000);
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
