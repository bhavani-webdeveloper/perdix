define([], function () {

    return {
        pageUID: "kgfs.loans.individual.booking.Dsc",
        pageType: "Engine",
        dependencies: ["$log", "$q", "LoanAccount", "LoanProcess", 'Scoring', 'Enrollment', 'EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
            'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor", "UIRepository", "$injector", "irfNavigator"
        ],

        $pageFn: function ($log, $q, LoanAccount, LoanProcess, Scoring, Enrollment, EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper, formHelper, elementsUtils,
            irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
            BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();
            var podiValue = SessionStore.getGlobalSetting("percentOfDisposableIncome");
            //pmt function completed

            var self;
            var validateForm = function (formCtrl) {
                formCtrl.scope.$broadcast('schemaFormValidate');
                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                    return false;
                }
                return true;
            };
            var getIncludes = function (model) {
                return [];
            }
            var configFile = function (model) {
                return []
            }
            var overridesFields = function (model) {
                return {};
            }

            return {
                "type": "schema-form",
                "title": "DSC",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {

                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }

                    model.customer = model.customer || {};
                    model.customer.coapplicants = model.customer.coapplicants || [];
                    model.customer.guarantors = model.customer.guarantors || [];
                    model.customer.loanSaved = false;
                    model.customer.cbcheckdone = false;

                    if (_.hasIn(model, "loanProcess")) {
                        var lp = model.loanProcess;
                        model.customer.applicantid = lp.applicantEnrolmentProcess.customer.id;
                        model.customer.applicantname = lp.applicantEnrolmentProcess.customer.firstName;

                        model.coapplicants = [];
                        _.forEach(lp.coApplicantsEnrolmentProcesses, function (ep) {
                            model.coapplicants.push({
                                coapplicantid: ep.customer.id,
                                coapplicantname: ep.customer.firstName
                            });
                        })
                        model.guarantors = [];
                        _.forEach(lp.guarantorsEnrolmentProcesses, function (ep) {
                            model.guarantors.push({
                                guarantorid: ep.customer.id,
                                guarantorname: ep.customer.firstName
                            });
                        })

                        model.customer.loanAmount = lp.loanAccount.loanAmount || lp.loanAccount.loanAmountRequested;
                        model.customer.loanPurpose1 = lp.loanAccount.loanPurpose1;
                        model.customer.loanSaved = true;
                    }

                    if (_.hasIn(model, 'loanAccount')) {
                        if (model.loanAccount.loanCustomerRelations && model.loanAccount.loanCustomerRelations.length > 0) {
                            for (var i = model.loanAccount.loanCustomerRelations.length - 1; i >= 0; i--) {
                                if (model.loanAccount.loanCustomerRelations[i].relation == 'Applicant') {
                                    PageHelper.showLoader();
                                    Enrollment.getCustomerById({ id: model.loanAccount.loanCustomerRelations[i].customerId })
                                        .$promise
                                        .then(function (res) {
                                            model.customer.applicantname = res.firstName;
                                        },
                                            function (httpRes) {
                                                PageHelper.showErrors(httpRes);
                                            })
                                        .finally(function () {
                                            PageHelper.hideLoader();
                                        })
                                    model.customer.applicantid = model.loanAccount.loanCustomerRelations[i].customerId;
                                    model.customer.loanAmount = model.loanAccount.loanAmountRequested;
                                    model.customer.loanPurpose1 = model.loanAccount.loanPurpose1;
                                    model.customer.loanSaved = true;
                                }
                                else if (model.loanAccount.loanCustomerRelations[i].relation == 'Co-Applicant') {
                                    Enrollment.getCustomerById({ id: model.loanAccount.loanCustomerRelations[i].customerId })
                                        .$promise
                                        .then(function (res) {
                                            model.customer.coapplicants.push({
                                                "coapplicantid": res.id,
                                                "coapplicantname": res.firstName,
                                                "loanAmount": model.loanAccount.loanAmountRequested,
                                                "loanPurpose1": model.loanAccount.loanPurpose1,
                                            });
                                            model.customer.loanSaved = true;

                                        }, function (httpRes) {
                                            PageHelper.showErrors(httpRes);
                                        })
                                        .finally(function () {
                                            PageHelper.hideLoader();
                                        })
                                }
                                else if (model.loanAccount.loanCustomerRelations[i].relation == 'Guarantor') {
                                    Enrollment.getCustomerById({ id: model.loanAccount.loanCustomerRelations[i].customerId })
                                        .$promise
                                        .then(function (res) {
                                            model.customer.guarantors.push({
                                                "guarantorid": res.id,
                                                "guarantorname": res.firstName,
                                                "loanAmount": model.loanAccount.loanAmountRequested,
                                                "loanPurpose1": model.loanAccount.loanPurpose1,
                                            });
                                            model.customer.loanSaved = true;

                                        }, function (httpRes) {
                                            PageHelper.showErrors(httpRes);
                                        })
                                        .finally(function () {
                                            PageHelper.hideLoader();
                                        })
                                }
                            }
                        }
                    }
                    console.log("Model from DSC");
                    console.log(model);
                    console.log(bundleModel);

                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                    return [
                        item.customer.firstName,
                        item.customer.centreCode,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "new-applicant": function (bundleModel, model, params) {
                        $log.info("Inside new-applicant of DscCheck");
                        model.customer.applicantname = params.customer.firstName;
                        model.customer.applicantid = params.customer.id;
                        model.customer.loanAmount = '';
                        model.customer.loanPurpose1 = '';
                        /* Assign more customer information to show */
                    },
                    "new-co-applicant": function (bundleModel, model, params) {
                        $log.info("Insdie new-co-applicant of DscCheck");
                        var recordExists = false;
                        for (var i = model.customer.coapplicants.length - 1; i >= 0; i--) {
                            if (model.customer.coapplicants[i].coapplicantid == params.customer.id)
                                recordExists = true;
                        }
                        if (!recordExists) {
                            model.customer.coapplicants.push({
                                "coapplicantid": params.customer.id,
                                "coapplicantname": params.customer.firstName
                            });
                        }
                    },
                    "new-guarantor": function (bundleModel, model, params) {
                        $log.info("Insdie new-guarantor of DscCheck");
                        var recordExists = false;
                        for (var i = model.customer.guarantors.length - 1; i >= 0; i--) {
                            if (model.customer.guarantors[i].guarantorid == params.customer.id)
                                recordExists = true;
                        }
                        if (!recordExists) {
                            model.customer.guarantors.push({
                                "guarantorid": params.customer.id,
                                "guarantorname": params.customer.firstName
                            });
                        }
                    },
                    "new-loan": function (bundleModel, model, params) {
                        $log.info("Inside new-loan of CBCheck");
                        model.customer.loanSaved = true;
                        model.customer.loanAmount = params.loanAccount.loanAmountRequested;
                        model.customer.loanPurpose1 = params.loanAccount.loanPurpose1;
                        for (var i = model.customer.coapplicants.length - 1; i >= 0; i--) {
                            model.customer.coapplicants[i].loanAmount = params.loanAccount.loanAmountRequested;
                            model.customer.coapplicants[i].loanPurpose1 = params.loanAccount.loanPurpose1;
                        }
                        for (var i = model.customer.guarantors.length - 1; i >= 0; i--) {
                            model.customer.guarantors[i].loanAmount = params.loanAccount.loanAmountRequested;
                            model.customer.guarantors[i].loanPurpose1 = params.loanAccount.loanPurpose1;
                        }
                    },
                    "remove-customer-relation": function (bundleModel, model, enrolmentDetails) {
                        $log.info("Inside remove-customer-relation of CBCheck");
                        if (enrolmentDetails.customerClass == 'co-applicant') {
                            _.remove(model.customer.coapplicants, function (g) {
                                if (g.coapplicantid == enrolmentDetails.customerId) {
                                    return true;
                                }
                                return false;
                            })
                        } else if (enrolmentDetails.customerClass == 'applicant') {
                            model.customer.applicantname = null;
                            model.customer.applicantid = null;
                        } else if (enrolmentDetails.customerClass == 'guarantor') {
                            _.remove(model.customer.guarantors, function (g) {
                                if (g.guarantorid == enrolmentDetails.customerId) {
                                    return true;
                                }
                                return false;
                            })
                        }
                    }
                },
                form: [
                    {
                        "type": "box",
                        "items": [
                            {
                                "type": "fieldset",
                                "title": "DSC_CHECK",
                                "items": [
                                    {
                                        key: "customer.applicantname",
                                        title: "ApplicantName",
                                        readonly: true,
                                        type: "string",

                                    },
                                    {
                                        "type": "button",
                                        "condition": "model.customer.loanSaved",
                                        "title": "DSC_REQUEST"
                                    },
                                    {
                                        key: "customer.coapplicants",
                                        type: "array",
                                        title: ".",
                                        view: "fixed",
                                        notitle: true,
                                        "startEmpty": true,
                                        "add": null,
                                        "remove": null,
                                        items: [{
                                            key: "customer.coapplicants[].coapplicantname",
                                            title: "Co ApplicantName",
                                            readonly: true,
                                            type: "string"
                                        },
                                        {
                                            "type": "button",
                                            "condition": "model.customer.loanSaved",
                                            "title": "DSC_REQUEST"
                                        },
                                        ]
                                    },
                                    {
                                        key: "customer.guarantors",
                                        type: "array",
                                        title: ".",
                                        view: "fixed",
                                        notitle: true,
                                        "startEmpty": true,
                                        "add": null,
                                        "remove": null,
                                        items: [{
                                            key: "customer.guarantors[].guarantorname",
                                            title: "Guarantor Name",
                                            readonly: true,
                                            type: "string"
                                        },
                                        {
                                            "type": "button",
                                            "condition": "model.customer.loanSaved",
                                            "title": "DSC_REQUEST"
                                        },
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                schema: function () {
                    console.log("First thing to excecute I guess");
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {},
            };

        }
    }
});
