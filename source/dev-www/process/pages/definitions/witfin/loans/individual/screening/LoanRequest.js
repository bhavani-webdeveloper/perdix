define([],function(){

    return {
        pageUID: "witfin.loans.individual.screening.LoanRequest",
        pageType: "Engine",
        dependencies: ["$log", "$q","LoanAccount","LoanProcess", 'Scoring', 'Enrollment','EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
            'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor","UIRepository", "$injector", "irfNavigator"],

        $pageFn: function($log, $q, LoanAccount,LoanProcess, Scoring, Enrollment,EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper,formHelper,elementsUtils,
                          irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
                          BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();


            var self;
            var validateForm = function(formCtrl){
                formCtrl.scope.$broadcast('schemaFormValidate');
                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                    return false;
                }
                return true;
            };

            var getRelationFromClass = function(relation){
                if (relation == 'guarantor'){
                    return 'Guarantor';
                } else if (relation == 'applicant'){
                    return 'Applicant';
                } else if (relation == 'co-applicant'){
                    return 'Co-Applicant';
                }
            };



            var configFile = function() {
                return {
                    "loanProcess.loanAccount.currentStage": {
                        "Screening": {
                            "excludes": [
                                "LoanRecommendation",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "TeleVerification"
                            ]
                        },
                        "ScreeningReview": {
                            "excludes": [
                                "calculateEmi",
                                "VehicleRouteDetails",
                                "VehicleAssetUse",
                                "VehicleAssetViability",
                                "VehiclePhotoCaptures",
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "Application": {
                            "excludes": [
                                "LoanRecommendation",
                                "TeleVerification"
                            ]
                        },
                        "ApplicationReview": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi",
                                "TeleVerification"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetViability": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "BranchCreditAppraisal": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetViability": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "HOCreditAppraisal": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetViability": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "ManagementCommittee": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                },
                                "PayerDetails": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetViability": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "TeleVerification": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                }
                            }
                        },
                        "REJECTED": {
                            "excludes": [
                                "PreliminaryInformation.calculateEmi"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetViability": {
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                },
                                "LoanDocuments": {
                                    "readonly": true
                                }
                            }
                        }
                    }

                }
            }

            var getIncludes = function (model) {

                return [
                    "PreliminaryInformation",
                    "PreliminaryInformation.linkedAccountNumber",
                    "PreliminaryInformation.loan",
                    "PreliminaryInformation.loanPurpose1",
                    "PreliminaryInformation.loanPurpose2",
                    "PreliminaryInformation.loanAmountRequested",
                    "PreliminaryInformation.loanToValue",
                    "PreliminaryInformation.frequencyRequested",
                    "PreliminaryInformation.tenureRequested",
                    "PreliminaryInformation.expectedInterestRate",
                    "PreliminaryInformation.calculateEmi",
                    "PreliminaryInformation.estimatedEmi",
                    "DeductionsFromLoan",
                    "DeductionsFromLoan.expectedProcessingFeePercentage",
                    "DeductionsFromLoan.estimatedEmi",
                    "LoanDocuments",
                    "LoanDocuments.loanDocuments",
                    "LoanDocuments.loanDocuments.document",
                    "LoanDocuments.loanDocuments.documentId",
                    "PayerDetails",
                    "PayerDetails.payeeName",
                    "PayerDetails.payeeMobileNumber",
                    "PayerDetails.payeeRelationToApplicant",
                    "VehicleRouteDetails",
                    "VehicleRouteDetails.vehicleRouteDetails",
                    "VehicleRouteDetails.vehicleRouteDetails.routeFrom",
                    "VehicleRouteDetails.vehicleRouteDetails.routeTo",
                    "VehicleRouteDetails.vehicleRouteDetails.routeVia",
                    "VehicleAssetUse",
                    "VehicleAssetUse.segment",
                    "VehicleAssetUse.subSegnment",
                    "VehicleAssetUse.entityType",
                    "VehicleAssetUse.attachedwith",
                    "VehicleAssetUse.attachedAddress",
                    "VehicleAssetUse.attachedContactNumber",
                    "VehicleAssetUse.locationAddress",
                    "VehicleAssetUse.locationContactName",
                    "VehicleAssetUse.locationContactNumber",
                    "VehicleAssetViability",
                    "VehicleAssetViability.vehicleLoanIncomes",
                    "VehicleAssetViability.vehicleLoanIncomes.incomeType",
                    "VehicleAssetViability.vehicleLoanIncomes.incomeAmount",
                    "VehiclePhotoCaptures",
                    "VehiclePhotoCaptures.vehiclePhotoCaptures",
                    "VehiclePhotoCaptures.vehiclePhotoCaptures.photoFileId",
                    "VehiclePhotoCaptures.vehiclePhotoCaptures.photoRemarks",
                    "LoanRecommendation",
                    "LoanRecommendation.loanAmount",
                    "LoanRecommendation.tenure",
                    "LoanRecommendation.interestRate",
                    "LoanRecommendation.processingFeePercentage",
                    "LoanRecommendation.securityEmiRequired",
                    "LoanRecommendation.commercialCibilCharge",
                    "NewVehicleDetails",
                    "NewVehicleDetails.vehicleType",
                    "NewVehicleDetails.endUse",
                    "NewVehicleDetails.usedFor",
                    "NewVehicleDetails.segment",
                    "NewVehicleDetails.category",
                    "NewVehicleDetails.manufacturer",
                    "NewVehicleDetails.make",
                    "NewVehicleDetails.vehicleModel",
                    "NewVehicleDetails.manufactureDate",
                    "NewVehicleDetails.assetDetails",
                    "NewVehicleDetails.assetSubDetails",
                    "NewVehicleDetails.registrationNumber",
                    "NewVehicleDetails.originalInvoiceValue",
                    "TeleVerification",
                    "TeleVerification.verifications",
                    "TeleVerification.verifications.referenceFirstName",
                    "TeleVerification.verifications.mobileNo",
                    "TeleVerification.verifications.occupation",
                    "TeleVerification.verifications.address",
                    "TeleVerification.verifications.knownSince",
                    "TeleVerification.verifications.relationship",
                    "TeleVerification.verifications.opinion",
                    "TeleVerification.verifications.financialStatus",
                    "TeleVerification.verifications.customerResponse",
                    "TeleVerification.verifications.remarks",
                    "actionbox",
                    "actionbox.submit",
                    "actionbox.save"

                ];

            }

            return {
                "type": "schema-form",
                "title": "LOAN_REQUEST",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // AngularResourceService.getInstance().setInjector($injector);

                    /* Setting data recieved from Bundle */
                    model.loanAccount = model.loanProcess.loanAccount;

                    self = this;
                    var formRequest = {
                        "overrides": {
                            "DeductionsFromLoan.estimatedEmi": {
                                "readonly": true
                            },
                            "NewVehicleDetails": {
                                "condition": "model.loanAccount.loanPurpose1 == 'Purchase – New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase – Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance'"
                            },
                            "PreliminaryInformation.loanAmountRequested": {
                                onChange: function(modelValue, form, model) {
                                    model.loanAccount.estimatedEmi = null;
                                }
                            },
                            "PreliminaryInformation.estimatedEmi": {
                                "required": true,
                                "readonly" : true
                            },
                            "PreliminaryInformation.frequencyRequested": {
                                 onChange: function(modelValue, form, model) {
                                    model.loanAccount.estimatedEmi = null;
                                }
                            },
                            "PreliminaryInformation.tenureRequested": {
                                 onChange: function(modelValue, form, model) {
                                    model.loanAccount.estimatedEmi = null;
                                }
                            },
                            "PreliminaryInformation.expectedInterestRate": {
                                 onChange: function(modelValue, form, model) {
                                    model.loanAccount.estimatedEmi = null;
                                }
                            },
                        },
                        "includes": getIncludes (model),
                        "excludes": [
                            ""
                        ],
                        "options": {
                            "repositoryAdditions": {
                                "PreliminaryInformation": {
                                    "items": {
                                        "calculateEmi": {
                                            "title" : "CALCULATE_EMI",
                                            "type": "button",
                                            "onClick": function(model, formCtrl) {
                                                var frequencyRequested;
                                                if (model.loanAccount.expectedInterestRate && model.loanAccount.tenureRequested && model.loanAccount.frequencyRequested && model.loanAccount.loanAmountRequested) {
                                                    switch(model.loanAccount.frequencyRequested) {
                                                        case 'Daily':
                                                            frequencyRequested = 365;
                                                            break;
                                                        case 'Fortnightly':
                                                            frequencyRequested = parseInt(365/15);
                                                            break;
                                                        case 'Monthly':
                                                            frequencyRequested = 12;
                                                            break;
                                                        case 'Quarterly':
                                                            frequencyRequested = 4;
                                                            break;
                                                        case 'Weekly':
                                                            frequencyRequested = 4;
                                                            break;
                                                        case 'Yearly': 
                                                            frequencyRequested = 1;   
                                                    }
                                                    var rate = parseFloat((model.loanAccount.expectedInterestRate)/(100*frequencyRequested));
                                                    var n = parseFloat(model.loanAccount.tenureRequested);
                                                    var calculateEmi = (parseFloat(model.loanAccount.loanAmountRequested) * rate / parseFloat((1 - Math.pow(1 + rate, -n))));
                                                    model.loanAccount.estimatedEmi = parseInt(calculateEmi.toFixed());   
                                                }
                                            }
                                        }
                                    }
                                },
                                "TeleVerification": {
                                    "items": {
                                        "verifications": {
                                            "items": {
                                                "referenceFirstName": {
                                                    "key": "loanAccount.telecallingDetails[].referenceFirstName",
                                                    "title": "CONTACT_PERSON_NAME",
                                                    "orderNo": 10,
                                                    "type": "string"
                                                },
                                                "mobileNo": {
                                                    "key": "loanAccount.telecallingDetails[].mobileNo",
                                                    "orderNo": 20,
                                                    "title": "CONTACT_NUMBER",
                                                    "type": "string",
                                                    "inputmode": "number",
                                                    "numberType": "tel"
                                                },
                                                "occupation": {
                                                    "key": "loanAccount.telecallingDetails[].occupation",
                                                    "orderNo": 30,
                                                    "title": "OCCUPATION",
                                                    "type": "select",
                                                    "enumCode": "occupation"
                                                },
                                                "address": {
                                                    "key": "loanAccount.telecallingDetails[].address",
                                                    "orderNo": 40,
                                                    "title": "CUSTOMER_ADDRESS",
                                                    "type": "textarea"
                                                }
                                            }
                                        }
                                        
                                           
                                        
                                    }
                                }
                            },
                            "additions": [
                                {
                                    "type": "box",
                                    "orderNo": 999,
                                    "title": "POST_REVIEW",
                                    "condition": "model.loanAccount.id",
                                    "items": [{
                                        key: "review.action",
                                        type: "radios",
                                        titleMap: {
                                            "REJECT": "REJECT",
                                            "SEND_BACK": "SEND_BACK",
                                            "PROCEED": "PROCEED"
                                        }
                                    }, {
                                        type: "section",
                                        condition: "model.review.action=='PROCEED'",
                                        items: [{
                                            title: "REMARKS",
                                            key: "loanProcess.remarks",
                                            type: "textarea",
                                            required: true
                                        }, {
                                            "title": "VALUATOR",
                                            "key":"loanAccount.valuator",
                                            "type":"select",
                                            "condition": "model.loanProcess.loanAccount.currentStage == 'ScreeningReview'",
                                            "titleMap": {
                                                "test":"test"
                                            }
                                        }, {
                                            key: "review.proceedButton",
                                            type: "button",
                                            title: "PROCEED",
                                            onClick: "actions.proceed(model, formCtrl, form, $event)"
                                        }]

                                    }, {
                                        type: "section",
                                        condition: "model.review.action=='SEND_BACK'",
                                        items: [{
                                        title: "REMARKS",
                                        key: "loanProcess.remarks",
                                        type: "textarea",
                                        required: true
                                    }, {
                                        key: "loanProcess.stage",
                                        "required": true,
                                        type: "lov",
                                        autolov: true,
                                        lovonly:true,
                                        title: "SEND_BACK_TO_STAGE",
                                        bindMap: {},
                                        searchHelper: formHelper,
                                        search: function(inputModel, form, model, context) {
                                            var stage1 = model.loanProcess.loanAccount.currentStage;
                                            var targetstage = formHelper.enum('targetstage').data;
                                            var out = [];
                                            for (var i = 0; i < targetstage.length; i++) {
                                                var t = targetstage[i];
                                                if (t.field1 == stage1) {
                                                    out.push({
                                                        name: t.name,
                                                        value:t.code
                                                    })
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
                                            model.review.targetStage1 = valueObj.name;
                                            model.loanProcess.stage = valueObj.value;

                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.name
                                            ];
                                        }
                                    }, {
                                        key: "review.sendBackButton",
                                        type: "button",
                                        title: "SEND_BACK",
                                        onClick: "actions.sendBack(model, formCtrl, form, $event)"
                                    }]

                                    } , {
                                        type: "section",
                                        condition: "model.review.action=='REJECT'",
                                        items: [{
                                                title: "REMARKS",
                                                key: "loanProcess.remarks",
                                                type: "textarea",
                                                required: true
                                            }, {
                                                key: "loanAccount.rejectReason",
                                                type: "lov",
                                                autolov: true,
                                                required:true,
                                                title: "REJECT_REASON",
                                                bindMap: {},
                                                searchHelper: formHelper,
                                                search: function(inputModel, form, model, context) {
                                                    var stage1 = model.loanProcess.loanAccount.currentStage;

                                                    var rejectReason = formHelper.enum('application_reject_reason').data;
                                                    var out = [];
                                                    for (var i = 0; i < rejectReason.length; i++) {
                                                        var t = rejectReason[i];
                                                        if (t.field1 == stage1) {
                                                            out.push({
                                                                name: t.name,
                                                            })
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
                                                    model.loanAccount.rejectReason = valueObj.name;
                                                },
                                                getListDisplayItem: function(item, index) {
                                                    return [
                                                        item.name
                                                    ];
                                                }
                                            },

                                            {
                                                key: "review.rejectButton",
                                                type: "button",
                                                title: "REJECT",
                                                required: true,
                                                onClick: "actions.reject(model, formCtrl, form, $event)"
                                            }
                                        ]
                                    }]
                                }
                            ]
                        }
                    };
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;

                    p1.then(function(repo) {
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
                    })

                },
                offline: false,
                getOfflineDisplayItem: function(item, index){
                    return [
                        item.customer.firstName,
                        item.customer.centreCode,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "lead-loaded": function(bundleModel, model, obj) {
                        model.lead = obj;
                        model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                        model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                        model.loanAccount.screeningDate = obj.screeningDate || moment().format("YYYY-MM-DD");
                    }
                },
                form: [],
                schema: function() {
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {
                    preSave: function(model, form, formName) {
                        var deferred = $q.defer();
                        if (model.customer.firstName) {
                            deferred.resolve();
                        } else {
                            irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                            deferred.reject();
                        }
                        return deferred.promise;
                    },
                    save: function(model, formCtrl, form, $event){
                        /* Loan SAVE */
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        if (!model.loanAccount.id){
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }
                        PageHelper.showLoader();
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                               
                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);
                            }, function (err) {
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                    },
                    sendBack: function(model, formCtrl, form, $event){
                        PageHelper.showLoader();
                        model.loanProcess.sendBack()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                    },
                    proceed: function(model, formCtrl, form, $event){
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        PageHelper.clearErrors();
                        PageHelper.showLoader();
                        PageHelper.showProgress('enrolment', 'Updating Loan');
                        model.loanProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {

                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    reject: function(model, formCtrl, form, $event){
                        PageHelper.showLoader();
                         model.loanProcess.reject()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
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
});
