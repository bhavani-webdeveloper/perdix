define(
    [
        "perdix/domain/model/loan/LoanProcess",
        "perdix/infra/helpers/NGHelper",
    ],
    function (LoanProcess, NGHelper) {
        LoanProcess = LoanProcess["LoanProcess"];
        NGHelper = NGHelper["NGHelper"];
        return {
            pageUID: "witfin.customer.VehicleValuation",
            pageType: "Engine",
            dependencies: ["$log", "$q", "LoanAccount", 'Scoring', 'Enrollment', 'EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
                'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
                "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor", "UIRepository", "irfNavigator"],

            $pageFn: function ($log, $q, LoanAccount, Scoring, Enrollment, EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper, formHelper, elementsUtils,
                               irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
                               BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, irfNavigator) {
                var self;

                var overridesFields = function (bundlePageObj) {
                return {
                    "VehicleRegistrationDetails.cubicCapacity":{
                        "inputmode": "number",
                        "numberType": "number",
                        "type": "number"
                    },
                    "VehicleAsset.vehicleAssetConditions.componentCondition": {
                        "condition": "!(model.loanAccount.vehicleLoanDetails.vehicleAssetConditions[arrayIndex].componentType == 'LH Front' || model.loanAccount.vehicleLoanDetails.vehicleAssetConditions[arrayIndex].componentType == 'RH Front' || model.loanAccount.vehicleLoanDetails.vehicleAssetConditions[arrayIndex].componentType == 'LH Rear' || model.loanAccount.vehicleLoanDetails.vehicleAssetConditions[arrayIndex].componentType == 'RH Rear')",
                        "orderNo": 30
                    },
                    "VehicleAsset.vehicleAssetConditions.make": {
                        "condition": "model.loanAccount.vehicleLoanDetails.vehicleAssetConditions[arrayIndex].componentType == 'LH Front' || model.loanAccount.vehicleLoanDetails.vehicleAssetConditions[arrayIndex].componentType == 'LH Rear' || model.loanAccount.vehicleLoanDetails.vehicleAssetConditions[arrayIndex].componentType == 'RH Front' || model.loanAccount.vehicleLoanDetails.vehicleAssetConditions[arrayIndex].componentType == 'RH Rear'",
                        "enumCode": "vehicle_tyre_make",
                        "type":"select",
                        "orderNo": 20
                    },
                    "VehicleAsset.vehicleAssetConditions": {
                        "view": "fixed"
                    },
                    "VehicleAsset.vehicleAssetConditions.componentType": {
                        "orderNo": 10
                    },
                    "VehicleAsset.vehicleAssetConditions.componentCondition1": {
                        "orderNo": 40
                    },
                    "VehicleAsset.vehicleAssetConditions.componentRemarks": {
                        "orderNo": 50
                    },
                    "VehiclePrimaryInfo": {
                        "readonly":  true
                    },
                    "VehicleRegistrationDetails.reRegistered" :{
                        "orderNo":10
                    },
                    "VehicleRegistrationDetails.previousRegistrationNumber": {
                        "orderNo":20
                    },
                    "VehicleRegistrationDetails.registrationAsPerRcbook":{
                        "orderNo":30
                    },
                    "VehicleRegistrationDetails.registrationAsPerActual": {
                        "orderNo":40
                    },
                    "VehicleRegistrationDetails.numberPlateColour": {
                        "orderNo":50
                    },
                    "VehicleRegistrationDetails.registeredownersname": {
                        "orderNo":60
                    },
                    "VehicleRegistrationDetails.engineNo": {
                        "orderNo":70
                    },
                    "VehicleRegistrationDetails.registeredAddress": {
                        "orderNo":80
                    },
                    "VehicleRegistrationDetails.ownerSerialNo": {
                        "orderNo":90
                    },
                    "VehicleRegistrationDetails.registrationDate": {
                        "orderNo":100
                    }
                    
                }
            }
                var getIncludes = function (model) {

                    return [
                        "VehiclePrimaryInfo",
                        "VehiclePrimaryInfo.registrationNumber",
                        "VehiclePrimaryInfo.firstName",
                        "VehiclePrimaryInfo.mobileNo",
                        "VehiclePrimaryInfo.AlternatemobileNo",
                        "VehiclePrimaryInfo.doorNo",
                        "VehiclePrimaryInfo.street",
                        "VehiclePrimaryInfo.postOffice",
                        "VehiclePrimaryInfo.pincode",
                        "VehiclePrimaryInfo.district",
                        "VehiclePrimaryInfo.state",
                        "VehicleValuationPriliminaryInformation",
                        "VehicleValuationPriliminaryInformation.valuationPurpose",
                        "VehicleValuationPriliminaryInformation.valuationDate",
                        "VehicleValuationPriliminaryInformation.valuationPlace",
                        "VehicleValuationPriliminaryInformation.registeredOwnerName",
                        "VehicleValuationPriliminaryInformation.proposedOwnerName",
                        "VehicleValuationPriliminaryInformation.bankReferenceNumber",
                        "VehicleInspectionDetails",
                        "VehicleInspectionDetails.inspectionDate",
                        "VehicleInspectionDetails.inspectedBy",
                        "VehicleInspectionDetails.vehicleMoved",
                        "VehicleInspectionDetails.inspectionLatitude",
                        "VehicleInspectionDetails.inspectionAltitude",
                        "VehicleInspectionDetails.engineStarted",
                        "VehicleIdentityDetails",
                        "VehicleIdentityDetails.make",
                        "VehicleIdentityDetails.variant",
                        "VehicleIdentityDetails.colour",
                        "VehicleIdentityDetails.trailer",
                        "VehicleIdentityDetails.chasisNo",
                        "VehicleIdentityDetails.engineNo",
                        "VehicleIdentityDetails.odometerReading",
                        "VehicleIdentityDetails.estimatedReading",
                        "VehicleIdentityDetails.transmission",
                        "VehicleIdentityDetails.odometer",
                        "VehicleIdentityDetails.usedFor",
                        "VehicleRegistrationDetails",
                        "VehicleRegistrationDetails.reRegistered",
                        "VehicleRegistrationDetails.previousRegistrationNumber",
                        "VehicleRegistrationDetails.registrationAsPerRcbook",
                        "VehicleRegistrationDetails.registrationAsPerActual",
                        "VehicleRegistrationDetails.numberPlateColour",
                        "VehicleRegistrationDetails.registeredownersname",
                        "VehicleRegistrationDetails.engineNo",
                        "VehicleRegistrationDetails.registeredAddress",
                        "VehicleRegistrationDetails.ownerSerialNo",
                        "VehicleRegistrationDetails.registrationDate",
                        "VehicleRegistrationDetails.vehicleClass",
                        "VehicleRegistrationDetails.bodyType",
                        "VehicleRegistrationDetails.fuelUsed",
                        "VehicleRegistrationDetails.cubicCapacity",
                        "VehicleRegistrationDetails.makersClassification",
                        "VehicleRegistrationDetails.seatingCapacity",
                        "VehicleRegistrationDetails.unladenWeight",
                        "VehicleRegistrationDetails.hypothecatedTo",
                        "VehicleRegistrationDetails.fitnesscertifiedUpto",
                        "VehiclePermitAndTaxDetails",
                        "VehiclePermitAndTaxDetails.permitStatus",
                        "VehiclePermitAndTaxDetails.permitValidUpto",
                        "VehiclePermitAndTaxDetails.operationroute",
                        "VehiclePermitAndTaxDetails.taxPaid",
                        "VehiclePermitAndTaxDetails.taxValidUpto",
                        "VehicleInsuranceDetails",
                        "VehicleInsuranceDetails.insuranceCompany",
                        "VehicleInsuranceDetails.insurancePolicyNumber",
                        "VehicleInsuranceDetails.insuranceIdv",
                        "VehicleInsuranceDetails.taxPaid",
                        "VehicleInsuranceDetails.insuranceValidFrom",
                        "VehicleInsuranceDetails.insuranceValidTo",
                        "VehicleInsuranceDetails.insurancePolicyType",
                        "VehicleOtherRemarks",
                        "VehicleOtherRemarks.modelUnderProduction",
                        "VehicleOtherRemarks.accident",
                        "VehicleOtherRemarks.originalInvoiceValue",
                        "VehicleOtherRemarks.accidentRemarks",
                        "VehicleOtherRemarks.majorRepair",
                        "VehicleOtherRemarks.currentInvoiceValue",
                        "VehicleOtherRemarks.rcbookStatus",
                        "VehiclePastValuations",
                        "VehiclePastValuations.vehiclePastValuations",
                        "VehiclePastValuations.vehiclePastValuations.financier",
                        "VehiclePastValuations.vehiclePastValuations.valuationDate",
                        "VehiclePastValuations.vehiclePastValuations.valuation",
                        "VehicleAsset",
                        "VehicleAsset.vehicleAssetConditions",
                        "VehicleAsset.vehicleAssetConditions.make",
                        "VehicleAsset.vehicleAssetConditions.componentType",
                        "VehicleAsset.vehicleAssetConditions.componentCondition",
                        "VehicleAsset.vehicleAssetConditions.componentCondition1",
                        "VehicleAsset.vehicleAssetConditions.componentRemarks",
                        "VehicleAccessories",
                        "VehicleAccessories.vehicleAccessories",
                        "VehicleAccessories.vehicleAccessories.accessoryType",
                        "VehicleAccessories.vehicleAccessories.accessoryStatus",
                        "VehicleAccessories.vehicleAccessories.accessoryAvailable",
                        "VehicleValuation",
                        "VehicleValuation.valuationRating",
                        "VehicleValuation.futureLife",
                        "VehicleValuation.currentMarketValue",
                        "VehicleValuation.distressValue",
                        "VehiclePhotoCaptures",
                        "VehiclePhotoCaptures.vehiclePhotoCaptures",
                        "VehiclePhotoCaptures.vehiclePhotoCaptures.photoFileId",
                        "VehiclePhotoCaptures.vehiclePhotoCaptures.photoRemarks",
                        "VehicleRecommendation",
                        "VehicleRecommendation.recommendationStatus",
                        "VehicleRecommendation.recommendationRemarks",
                        "actionbox",
                        "actionbox.save"
                    ];
                }

                var configFile = function() {
                    return {
                        "loanProcess.loanAccount.currentStage": {
                            "Application": {
                                "excludes": [
                                    "actionbox"
                                ],
                                "overrides": {
                                    "VehiclePrimaryInfo": {
                                        "readonly": true
                                    },
                                    "VehicleValuationPriliminaryInformation": {
                                        "readonly": true
                                    },
                                    "VehicleInspectionDetails": {
                                        "readonly": true
                                    },
                                    "VehicleIdentityDetails": {
                                        "readonly": true
                                    },
                                    "VehicleRegistrationDetails": {
                                        "readonly": true
                                    },
                                    "VehiclePermitAndTaxDetails": {
                                        "readonly": true
                                    },
                                    "VehicleInsuranceDetails": {
                                        "readonly": true
                                    },
                                    "VehicleOtherRemarks": {
                                        "readonly": true
                                    },
                                    "VehiclePastValuations": {
                                        "readonly": true
                                    },
                                    "VehicleAsset": {
                                        "readonly": true
                                    },
                                    "VehicleAccessories": {
                                        "readonly": true
                                    },
                                    "VehicleValuation": {
                                        "readonly": true
                                    },
                                    "VehiclePhotoCaptures": {
                                        "readonly": true
                                    },
                                    "VehicleRecommendation": {
                                        "readonly": true
                                    }
                                }
                               
                            },
                            "ApplicationReview": {
                                "excludes": [
                                    "actionbox"
                                ],
                                "overrides": {
                                    "VehiclePrimaryInfo": {
                                        "readonly": true
                                    },
                                    "VehicleValuationPriliminaryInformation": {
                                        "readonly": true
                                    },
                                    "VehicleInspectionDetails": {
                                        "readonly": true
                                    },
                                    "VehicleIdentityDetails": {
                                        "readonly": true
                                    },
                                    "VehicleRegistrationDetails": {
                                        "readonly": true
                                    },
                                    "VehiclePermitAndTaxDetails": {
                                        "readonly": true
                                    },
                                    "VehicleInsuranceDetails": {
                                        "readonly": true
                                    },
                                    "VehicleOtherRemarks": {
                                        "readonly": true
                                    },
                                    "VehiclePastValuations": {
                                        "readonly": true
                                    },
                                    "VehicleAsset": {
                                        "readonly": true
                                    },
                                    "VehicleAccessories": {
                                        "readonly": true
                                    },
                                    "VehicleValuation": {
                                        "readonly": true
                                    },
                                    "VehiclePhotoCaptures": {
                                        "readonly": true
                                    },
                                    "VehicleRecommendation": {
                                        "readonly": true
                                    }
                                }
                               
                            },
                            "BranchCreditAppraisal": {
                                "excludes": [
                                    "actionbox"
                                ],
                                "overrides": {
                                    "VehiclePrimaryInfo": {
                                        "readonly": true
                                    },
                                    "VehicleValuationPriliminaryInformation": {
                                        "readonly": true
                                    },
                                    "VehicleInspectionDetails": {
                                        "readonly": true
                                    },
                                    "VehicleIdentityDetails": {
                                        "readonly": true
                                    },
                                    "VehicleRegistrationDetails": {
                                        "readonly": true
                                    },
                                    "VehiclePermitAndTaxDetails": {
                                        "readonly": true
                                    },
                                    "VehicleInsuranceDetails": {
                                        "readonly": true
                                    },
                                    "VehicleOtherRemarks": {
                                        "readonly": true
                                    },
                                    "VehiclePastValuations": {
                                        "readonly": true
                                    },
                                    "VehicleAsset": {
                                        "readonly": true
                                    },
                                    "VehicleAccessories": {
                                        "readonly": true
                                    },
                                    "VehicleValuation": {
                                        "readonly": true
                                    },
                                    "VehiclePhotoCaptures": {
                                        "readonly": true
                                    },
                                    "VehicleRecommendation": {
                                        "readonly": true
                                    }
                                }
                               
                            },
                            "HOCreditAppraisal": {
                                "excludes": [
                                    "actionbox"
                                ],
                                "overrides": {
                                    "VehiclePrimaryInfo": {
                                        "readonly": true
                                    },
                                    "VehicleValuationPriliminaryInformation": {
                                        "readonly": true
                                    },
                                    "VehicleInspectionDetails": {
                                        "readonly": true
                                    },
                                    "VehicleIdentityDetails": {
                                        "readonly": true
                                    },
                                    "VehicleRegistrationDetails": {
                                        "readonly": true
                                    },
                                    "VehiclePermitAndTaxDetails": {
                                        "readonly": true
                                    },
                                    "VehicleInsuranceDetails": {
                                        "readonly": true
                                    },
                                    "VehicleOtherRemarks": {
                                        "readonly": true
                                    },
                                    "VehiclePastValuations": {
                                        "readonly": true
                                    },
                                    "VehicleAsset": {
                                        "readonly": true
                                    },
                                    "VehicleAccessories": {
                                        "readonly": true
                                    },
                                    "VehicleValuation": {
                                        "readonly": true
                                    },
                                    "VehiclePhotoCaptures": {
                                        "readonly": true
                                    },
                                    "VehicleRecommendation": {
                                        "readonly": true
                                    }
                                }
                               
                            },
                            "ManagementCommittee": {
                                "excludes": [
                                    "actionbox"
                                ],
                                "overrides": {
                                    "VehiclePrimaryInfo": {
                                        "readonly": true
                                    },
                                    "VehicleValuationPriliminaryInformation": {
                                        "readonly": true
                                    },
                                    "VehicleInspectionDetails": {
                                        "readonly": true
                                    },
                                    "VehicleIdentityDetails": {
                                        "readonly": true
                                    },
                                    "VehicleRegistrationDetails": {
                                        "readonly": true
                                    },
                                    "VehiclePermitAndTaxDetails": {
                                        "readonly": true
                                    },
                                    "VehicleInsuranceDetails": {
                                        "readonly": true
                                    },
                                    "VehicleOtherRemarks": {
                                        "readonly": true
                                    },
                                    "VehiclePastValuations": {
                                        "readonly": true
                                    },
                                    "VehicleAsset": {
                                        "readonly": true
                                    },
                                    "VehicleAccessories": {
                                        "readonly": true
                                    },
                                    "VehicleValuation": {
                                        "readonly": true
                                    },
                                    "VehiclePhotoCaptures": {
                                        "readonly": true
                                    },
                                    "VehicleRecommendation": {
                                        "readonly": true
                                    }
                                }
                               
                            }
                        },
                        "loanProcess.loanAccount.isReadOnly": {
                            "Yes": {
                                "excludes": [
                                    "actionbox"
                                ],
                                "overrides": {
                                    "VehiclePrimaryInfo": {
                                        "readonly": true
                                    },
                                    "VehicleValuationPriliminaryInformation": {
                                        "readonly": true
                                    },
                                    "VehicleInspectionDetails": {
                                        "readonly": true
                                    },
                                    "VehicleIdentityDetails": {
                                        "readonly": true
                                    },
                                    "VehicleRegistrationDetails": {
                                        "readonly": true
                                    },
                                    "VehiclePermitAndTaxDetails": {
                                        "readonly": true
                                    },
                                    "VehicleInsuranceDetails": {
                                        "readonly": true
                                    },
                                    "VehicleOtherRemarks": {
                                        "readonly": true
                                    },
                                    "VehiclePastValuations": {
                                        "readonly": true
                                    },
                                    "VehicleAsset": {
                                        "readonly": true
                                    },
                                    "VehicleAccessories": {
                                        "readonly": true
                                    },
                                    "VehicleValuation": {
                                        "readonly": true
                                    },
                                    "VehiclePhotoCaptures": {
                                        "readonly": true
                                    },
                                    "VehicleRecommendation": {
                                        "readonly": true
                                    }
                                }
                            }
                        }
                    }
                }
                return {
                    "type": "schema-form",
                    "title": "VEHICLE_VALUATION",
                    "subTitle": "BUSINESS",
                    initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {

                        self = this;
                        PageHelper.showLoader();
                        var formRequest = {
                            "overrides": overridesFields(model),
                            "includes": getIncludes(model),
                            "excludes": [
                                "VehicleRegistrationDetails.engineNo",
                                "VehicleInsuranceDetails.taxPaid",
                                "VehiclePermitAndTaxDetails.taxPaid"
                            ],
                            "options": {
                            "repositoryAdditions": {
                                "VehiclePrimaryInfo": {
                                    "type": "box",
                                    "title": "PRIMARY_INFORMATION",
                                    "orderNo": 150,
                                    "items": {
                                        "registrationNumber": {
                                            "key": "loanAccount.vehicleLoanDetails.registrationNumber",
                                            "title": "REGISTRATION_NUMBER"
                                        },
                                        "firstName": {
                                            "key": "loanProcess.loanCustomerEnrolmentProcess.customer.firstName",
                                            "title": "BORROWER_NAME"
                                        },
                                        "mobileNo": {
                                            "key": "loanProcess.loanCustomerEnrolmentProcess.customer.mobilePhone",
                                            "title": "MOBILE_NO"
                                        },
                                        "AlternatemobileNo": {
                                            "key": "loanProcess.loanCustomerEnrolmentProcess.customer.landLineNo",
                                            "title": "ALTERNATE_MOBILE_NO"
                                        },
                                        "doorNo": {
                                            "key": "loanProcess.loanCustomerEnrolmentProcess.customer.doorNo",
                                            "title": "DOOR_NO"
                                        },
                                        "street": {
                                            "key": "loanProcess.loanCustomerEnrolmentProcess.customer.street",
                                            "title": "STREET"
                                        },
                                        "postOffice": {
                                            "key": "loanProcess.loanCustomerEnrolmentProcess.customer.postOffice",
                                            "title": "POST_OFFICE"
                                        },
                                        "pincode": {
                                            "key": "loanProcess.loanCustomerEnrolmentProcess.customer.pincode",
                                            "title": "PIN_CODE"
                                        },
                                        "district": {
                                            "key": "loanProcess.loanCustomerEnrolmentProcess.customer.district",
                                            "title": "DISTRICT"
                                        },
                                        "state": {
                                            "key": "loanProcess.loanCustomerEnrolmentProcess.customer.state",
                                            "title": "STATE"
                                        }
                                    }
                                },
                                "VehicleRecommendation": {
                                    "type": "box",
                                    "title": "RECOMMENDATION_STATUS",
                                    "orderNo": 1400,
                                    "items": {
                                        "recommendationStatus": {
                                            "key": "loanAccount.vehicleLoanDetails.recommendationStatus",
                                            "type": "radios",
                                            "required": true,
                                            "enumCode": "decisionmaker1",
                                            "title": "RECOMMENDED"
                                        },
                                        "recommendationRemarks": {
                                            "key": "loanProcess.remarks",
                                            "required": true,
                                            "title": "REMARKS"
                                        }
                                    }
                                },

                                "VehicleAsset": {
                                    "items": {
                                        "vehicleAssetConditions": {
                                            "items": {
                                                "componentCondition1": {
                                                    "key": "loanAccount.vehicleLoanDetails.vehicleAssetConditions[].componentCondition",
                                                    "title": "COMPONENT_CONDITION",
                                                    "type": "select",
                                                    "enumCode": "vehicle_tyre_condition",
                                                    "condition": "model.loanAccount.vehicleLoanDetails.vehicleAssetConditions[arrayIndex].componentType == 'LH Front' || model.loanAccount.vehicleLoanDetails.vehicleAssetConditions[arrayIndex].componentType == 'LH Rear' || model.loanAccount.vehicleLoanDetails.vehicleAssetConditions[arrayIndex].componentType == 'RH Front' || model.loanAccount.vehicleLoanDetails.vehicleAssetConditions[arrayIndex].componentType == 'RH Rear'"
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                                "additions": [
                                    {
                                        "targetID": "actionbox",
                                        "items": [
                                            {
                                                "type": "button",
                                                "title": "PROCEED",
                                                "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                            }
                                        ]
                                    }
                                ]
                            }
                        };

                        if(_.hasIn(model, 'loanProcess.loanAccount')) {
                            model.loanAccount = model.loanProcess.loanAccount;
                            var p1 = UIRepository.getLoanProcessUIRepository().$promise;;
                            p1.then(function(repo) {
                                self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
                                // NGHelper.refreshUI();
                            })
                        } else {
                            LoanProcess.get($stateParams.pageId)
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(data) {
                                model.loanProcess = data;
                                model.loanAccount = data.loanAccount;
                                   
                                var p1 = UIRepository.getLoanProcessUIRepository().$promise;;
                                p1.then(function(repo) {
                                    self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
                                    // NGHelper.refreshUI();
                                })
                            }, function(err) {
                                console.log(err);
                                PageHelper.hideLoader();
                            })
                        }
                       


                        // LoanProcess.get($stateParams.pageId)
                        //     .toPromise()
                        //     .then(function(loanProcess){
                        //         model.loanProcess = loanProcess;
                        //         model.loanAccount = loanProcess.loanAccount;
                        //         return model;
                        //     }, function(err){

                        //     })
                        //     .then(function(){
                        //         return UIRepository.getLoanProcessUIRepository().$promise;
                        //     })
                        //     .then(function(repo){
                        //         var formRequest = {
                        //             "overrides": "",
                        //             "includes": getIncludes(model),
                        //             "excludes": [
                        //                 ""
                        //             ],
                        //             "options": {
                        //                 "additions": [
                        //                     {
                        //                         "targetID": "actionbox",
                        //                         "items": [
                        //                             {
                        //                                 "type": "button",
                        //                                 "title": "PROCEED",
                        //                                 "onClick": "actions.proceed(model, formCtrl, form, $event)"
                        //                             }
                        //                         ]
                        //                     }
                        //                 ]
                        //             }
                        //         };
                        //         self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, null, model);
                        //         NGHelper.refreshUI();
                        //     });
                    },
                    offline: false,
                    getOfflineDisplayItem: function (item, index) {
                        return [
                            item.customer.firstName,
                            item.customer.centreCode,
                            item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                        ]
                    },
                    eventListeners: {},
                    form: [],
                    schema: function () {
                        return SchemaResource.getLoanAccountSchema().$promise;
                    },
                    actions: {
                        save: function(model, formCtrl, form, $event){
                            if(PageHelper.isFormInvalid(formCtrl)) {
                                return false;
                            }
                            PageHelper.showProgress('loan-process', 'Updating Loan');
                            model.loanProcess.save()
                                .finally(function () {
                                    PageHelper.hideLoader();
                                })
                                .subscribe(function (value) {
                                    // Utils.removeNulls(value, true);
                                    PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);
                                }, function (err) {
                                    PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                    PageHelper.showErrors(err);
                                    PageHelper.hideLoader();
                                });
                        },
                        proceed: function(model, formCtrl, form, $event){
                            if(PageHelper.isFormInvalid(formCtrl)) {
                                return false;
                            }
                            PageHelper.showLoader();
                            PageHelper.showProgress('loan-process', 'Updating Loan');
                            model.loanProcess.proceed()
                                .finally(function () {
                                    PageHelper.hideLoader();
                                })
                                .subscribe(function (value) {
                                    // Utils.removeNulls(value, true);
                                    PageHelper.showProgress('loan-process', 'Done.', 5000);
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
