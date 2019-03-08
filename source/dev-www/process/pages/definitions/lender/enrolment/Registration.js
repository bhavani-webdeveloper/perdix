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
                    "LenderInformation.firstName":{
                        "type":"text"
                    },
                    "LenderContactDetails": {
                        "orderNo": 20
                    },
                    "LenderContactInformation": {
                        "title": "ADDRESS_DETAILS",
                        "orderNo": 40
                    },
                    "BankAccounts": {
                        "orderNo": 30
                    },
                    "LenderInformation.leadName": {
                        "required": true,
                    },
                    "LenderInformation.companyOperatingSince": {
                        "required": true
                    },
                    "LenderContactDetails.LenderContactDetails.contactPersonName": {
                        "required": true
                    },
                    "LenderContactDetails.LenderContactDetails.mobilePhone1": {
                        "required": true,
                        "type":"number",
                        "schema":{
                            "pattern":"^[0-9]{10}$"
                        }
                    },
                    "LenderContactDetails.LenderContactDetails.mobilePhone2": {

                        "type":"number",
                        "schema":{
                            "pattern":"^[0-9]{10}$"
                        }
                    },
                    "LenderContactInformation.Address1.doorNo": {
                        "required": true
                    },
                    "LenderContactInformation.Address1.pincode": {
                        "resolver":"PincodeLOVConfiguration",
                        "required": false,
                        "orderNo":100
                    },
                    "LenderContactInformation.Address1.villageName": {
                        "readonly": false,
                        "required": false,
                        "orderNo":110
                    },
                    "LenderContactInformation.Address1.district": {
                        "readonly": false,
                        "required": false,
                        "orderNo":120
                    },
                    "LenderContactInformation.Address1.state": {
                        "readonly": false,
                        "required": false,
                        "orderNo":130
                    },
                    "LenderContactInformation.Address2.mailingLocality": {
                        "readonly": false,
                        "required": false
                    },
                    "LenderContactInformation.Address2.mailingDistrict": {
                        "readonly": false,
                        "required": false
                    },
                    "LenderContactInformation.Address2.mailingState": {
                        "readonly": false,
                        "required": false
                    },
                    "BankAccounts.customerBankAccounts.ifscCode": {
                        "resolver": "BankIFSCLOVConfiguration",
                        "required": true
                    },
                    "BankAccounts.customerBankAccounts.accountType": {
                        "required": true
                    },
                    "BankAccounts.customerBankAccounts.customerBankName":{
                        "type" : "string"
                    },
                    "BankAccounts.customerBankAccounts.customerBankBranchName":{
                        "type" : "string"
                    },
                    "BankAccounts.customerBankAccounts.customerNameAsInBank":{
                        "type" : "string"
                    },
                    "BankAccounts.customerBankAccounts.accountNumber":{
                        "schema":{
                            "pattern":"^[0-9]{8,16}$"
                        }
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

            var operatingsinceDate = function(model){
                var operatingSinceDate = model.enrolmentProcess.customer.enterprise.companyOperatingSince;
                var dateA = new Date(operatingSinceDate);
                var dateB = new Date();
                if (dateA > dateB) {
                    PageHelper.showErrors({
                        'data': {
                            'error': "OperatingSinceDate can't be more than current Date"
                        }
                    })
                   // PageHelper.hideLoader();
                    return true
                }
                else{
                    return false
                }
            }

            return {
                "type": "schema-form",
                "title": "LENDER_REGISTRATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    model.siteCode = SessionStore.getGlobalSetting("siteCode");
                    if(_.hasIn($stateParams, "pageId") && !_.isNull($stateParams.pageId)) {
                        PageHelper.showLoader();
                        EnrolmentProcess.fromCustomerID($stateParams.pageId)
                            .subscribe(function(enrolmentProcess) {
                                model.enrolmentProcess = enrolmentProcess;
                                model.customer = model.enrolmentProcess.customer;
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
                                            // "startEmpty": true,
                                            "condition":"model.siteCode == 'KGFS'",
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
                                                    "fieldType": "number",
                                                    "title":"PINCODE",
                                                    "autolov":true,
                                                    "orderNo": 190
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
                                                    "orderNo": 160,
                                                     "required":false
                                                },
                                                "mailingStreet": {
                                                    "key": "customer.mailingStreet",
                                                    "orderNo": 170,
                                                    "required":false
                                                },
                                                "mailingPostoffice": {
                                                    "key": "customer.mailingPostoffice",
                                                    "orderNo": 180,
                                                    "required":false
                                                },
                                                "mailingPincode": {
                                                    "key": "customer.mailingPincode",
                                                    "required":false,
                                                    "type": "lov",
                                                    "resolver": "MailingPincodeLOVConfiguration",
                                                    "orderNo": 190
                                                },
                                                "mailingLocality": {
                                                    "key": "customer.mailingLocality",
                                                    "orderNo": 200,
                                                    "required":false
                                                },
                                                "mailingDistrict": {
                                                    "key": "customer.mailingDistrict",
                                                    "orderNo": 210,
                                                    "schema": {
                                                        "required":false
                                                    }
                                                },
                                                "mailingState": {
                                                    "key": "customer.mailingState",
                                                    "orderNo": 220,
                                                    "schema": {
                                                        "required":false
                                                    }
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

                    // var p1 = UIRepository.getEnrolmentProcessUIRepository().$promise;
                    // p1.then(function(repo){
                    //     self.form = IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model);
                    // })

                      UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function(repo){
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form){
                            self.form = form;
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

                        // var dateA = new Date(operatingSinceDate);
                        // var dateB = new Date();
                        var res = operatingsinceDate(model)
                        if (res) {
                           PageHelper.hideLoader();
                        } else {
                            model.enrolmentProcess.save()
                                .finally(function() {
                                    PageHelper.hideLoader();
                                })
                                .subscribe(function(value) {
                                    formHelper.resetFormValidityState(formCtrl);
                                    Utils.removeNulls(value, true);
                                    PageHelper.showProgress('enrolment', 'Lender Saved.', 5000);
                                    if (!model.customer.id) {
                                        model.customer = value.customer;
                                        model.enrolmentProcess.customer = value.customer;
                                    }
                                    PageHelper.clearErrors();

                                }, function(err) {
                                    PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                    PageHelper.showErrors(err);
                                    PageHelper.hideLoader();
                                });
                        }
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
                        PageHelper.showLoader();
                        var res = operatingsinceDate(model)
                        if (res) {
                           PageHelper.hideLoader();
                        } else
                        model.enrolmentProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                formHelper.resetFormValidityState(formCtrl);
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Lender Proceed.', 5000);
                                 irfNavigator.go({
                                    state: 'Page.Engine',
                                    pageName: "lender.enrolment.LenderSearch"
                                });
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
                        var res = operatingsinceDate(model)
                        if (res) {
                           PageHelper.hideLoader();
                        } else
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
