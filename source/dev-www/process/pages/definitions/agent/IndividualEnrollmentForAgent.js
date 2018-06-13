define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/domain/model/agent/AgentProcess'], function(EnrolmentProcess, AgentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    AgentProcess = AgentProcess['AgentProcess'];
    return {
        pageUID: "agent.IndividualEnrollmentForAgent",
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

            var preSaveOrProceed = function(reqData) {}


            var overridesFields = function(bundlePageObj) {
                return {
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
                        fieldType: "number",
                        resolver: "PincodeLOVConfiguration"
                    },
                    "IndividualInformation.dateOfBirth": {
                        onChange: function(valueObj, model, context) {
                            context.customer.age = moment().diff(moment(valueObj, SessionStore.getSystemDateFormat()), 'years');

                        }
                    },
                    "BankAccounts.customerBankAccounts.accountNumber": {
                        "type": "password",
                        "required": true
                    },
                    "BankAccounts.customerBankAccounts.confirmedAccountNumber": {
                        "type": "string",
                        "required": true
                    },
                    "IndividualInformation.customerId": {
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
                        }
                    }
                }
            }
            var getIncludes = function(model) {

                return [
                    "IndividualInformation",
                    "IndividualInformation.customerId",
                    // "IndividualInformation.urnNo",
                    "IndividualInformation.firstName",
                    "IndividualInformation.gender",
                    "IndividualInformation.dateOfBirth",
                    "IndividualInformation.age",

                    "ContactInformation",
                    "ContactInformation.mobilePhone",
                    "ContactInformation.landLineNo",
                    "ContactInformation.whatsAppMobileNoOption",
                    "ContactInformation.whatsAppMobileNo",
                    "ContactInformation.location",
                    "ContactInformation.email",
                    "ContactInformation.careOf",
                    "ContactInformation.doorNo",
                    "ContactInformation.street",
                    "ContactInformation.postOffice",
                    "ContactInformation.landmark",
                    "ContactInformation.pincode",
                    "ContactInformation.locality",
                    "ContactInformation.villageName",
                    "ContactInformation.district",
                    "ContactInformation.state",

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
                    /* Setting data for the form */
                    model.customer = model.enrolmentProcess.customer;
                    /* End of setting data for the form */
                    // model.currentStage = bundleModel.currentStage;
                    /* End of setting data recieved from Bundle */

                    /* Form rendering starts */
                    self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "IndividualInformation": {
                                    "type": "box",
                                    "title": "PERSIONAL_INFORMATION",
                                    "orderNo": 1,
                                    "items": {
                                        "customerId": {
                                            "key": "customer.id",
                                            "title": "CUSTOMER_ID",
                                            "type": "lov",
                                            "lovonly": false
                                        }
                                    }
                                }
                            },
                            "additions": [{
                                "type": "actionbox",
                                "condition": "!model.customer.id",
                                "orderNo": 1200,
                                "items": [{
                                    "type": "submit",
                                    "title": "SUBMIT"
                                }]
                            }, {
                                "targetID": "IndividualInformation",
                                "items": [{
                                    "key": "customer.centreId",
                                    "type": "select",
                                    "enumCode": "centre",
                                    "title": "CENTRE_NAME",
                                    "orderNo": 21,
                                    "readonly": true
                                }]
                            }, {
                                "type": "actionbox",
                                "condition": "model.customer.currentStage && model.customer.id",
                                "orderNo": 1200,
                                "items": [{
                                    "type": "button",
                                    "title": "PROCEED",
                                    "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                }]
                            }]
                        }
                    }

                    UIRepository.getEnrolmentProcessUIRepository().$promise
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
                                if (obj.leadCategory == 'Existing' || obj.leadCategory == 'Return') {
                                    model.customer.existingLoan = 'YES';
                                } else {
                                    model.customer.existingLoan = 'NO';
                                }
                                model.customer.mobilePhone = obj.mobileNo;
                                model.customer.gender = obj.gender;
                                model.customer.firstName = obj.leadName;
                                model.customer.maritalStatus = obj.maritalStatus;
                                model.customer.customerBranchId = obj.branchId;
                                model.customer.centreId = obj.centreId;
                                model.customer.centreName = obj.centreName;
                                model.customer.street = obj.addressLine2;
                                model.customer.doorNo = obj.addressLine1;
                                model.customer.pincode = obj.pincode;
                                model.customer.district = obj.district;
                                model.customer.state = obj.state;
                                model.customer.locality = obj.area;
                                model.customer.villageName = obj.cityTownVillage;
                                model.customer.landLineNo = obj.alternateMobileNo;
                                model.customer.dateOfBirth = obj.dob;
                                model.customer.age = moment().diff(moment(obj.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                model.customer.gender = obj.gender;
                                model.customer.referredBy = obj.referredBy;
                                model.customer.landLineNo = obj.alternateMobileNo;
                                model.customer.landmark = obj.landmark;
                                model.customer.postOffice = obj.postOffice;
                                model.customer.customerCategory = obj.leadCategory;
                                model.customer.parentLoanAccount = obj.parentLoanAccount;

                            })

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
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    setProofs: function(model) {
                        if (model.customer.yearOfBirth) {
                            model.customer.dateOfBirth = model.customer.yearOfBirth + '-01-01';
                        }
                    },
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
                    reload: function(model, formCtrl, form, $event) {
                        $state.go("Page.Engine", {
                            pageName: 'agent.IndividualEnrollmentForAgent',
                            pageId: model.customer.id
                        }, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    },
                    save: function(model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        var reqData = _.cloneDeep(model);

                        if (!(validateRequest(reqData))) {
                            return;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }

                        // $q.all start
                        model.enrolmentProcess.save()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                                formHelper.resetFormValidityState(formCtrl);
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Customer Saved.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent()
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
                        var reqData = _.cloneDeep(model);

                        if (!(validateRequest(reqData))) {
                            return;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        // PageHelper.showLoader();
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
                    },
                    submit: function(model, form, formName) {
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
                        model.enrolmentProcess.save()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(enrolmentProcess) {
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
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
                    }

                }
            };
        }
    }
})