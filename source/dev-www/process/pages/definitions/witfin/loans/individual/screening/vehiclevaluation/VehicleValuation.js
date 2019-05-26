define(
    [
        "perdix/domain/model/loan/LoanProcess",
        "perdix/infra/helpers/NGHelper",
    ],
    function (LoanProcess, NGHelper) {
        LoanProcess = LoanProcess["LoanProcess"];
        NGHelper = NGHelper["NGHelper"];
        return {
            pageUID: "witfin.loans.individual.screening.vehiclevaluation.VehicleValuation",
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
                        "VehicleRegistrationDetails.hypothecatedTo":{
                            "type": "text"
                        }, 
                        "VehicleOtherRemarks.rcbookStatus":{
                            "required":"true"
                        },
                        "VehicleValuation.currentMarketValue":{
                            "numberType": "number",
                            "required": "true",
                            "type":"number",

                        },
                        "VehicleValuation.futureLife":{
                            "numberType": "number",
                            "type":"number"
                        },
                        "VehicleValuation.distressValue":{
                            "numberType": "number",
                            "type":"number"
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
                        },
                        "VehicleIdentityDetails": {
                            "items": {
                                "make": {
                                    "type": "text",
                                    "title": "MANUFACTURER",
                                    "readonly":  true
                                },
                                "vehicleModel": {
                                    "key": "loanAccount.vehicleLoanDetails.vehicleModel",
                                    "title": "MODEL",
                                    "type": "text",
                                    "required": "true",
                                    "readonly":  true
                                },
                                "yearOfManufacture": {
                                    "key": "loanAccount.vehicleLoanDetails.yearOfManufacture",
                                    "title": "YEAR_OF_MANUFACTURE",
                                    "type": "date",
                                    "required": "true",
                                    "readonly":  true
                                },
                                "trailerAttached": {
                                    "key": "loanAccount.vehicleLoanDetails.trailerAttached",
                                    "title": "TRAILER_ATTACHED",
                                    "type": "select",
                                    "required": "true",
                                    "enumCode": "vehicle_trailer_attached"
                                }
                            }
                        },
                        "VehicleRegistrationDetails":{
                            "items": {
                                "noOfCylinders":{
                                    "key": "loanAccount.vehicleLoanDetails.noOfCylinders",
                                    "title": "NO_OF_CYLINDERS",
                                    "inputmode": "number",
                                    "numberType": "number",
                                    "type": "number"
                                },
                                "grossVehicleWeight":{
                                    "key": "loanAccount.vehicleLoanDetails.grossVehicleWeight",
                                    "title": "GROSS_VEHICLE_WEIGHT",
                                    "type": "number"
                                },
                                "noOfAxles":{
                                    "key": "loanAccount.vehicleLoanDetails.noOfAxles",
                                    "title": "NO_OF_AXLES",
                                    "inputmode": "number",
                                    "numberType": "number",
                                    "type": "number"
                                },
                                "vehicleClass":{
                                    "readonly":  true
                                },
                                "bodyType":{
                                    "enumCode": "business_asset_description"
                                },
                                "unladenWeight":{
                                    "title": "UNLADEN_WEIGHT"
                                }
                            }
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
                        "VehicleIdentityDetails.transmission",
                        "VehicleIdentityDetails.odometer",
                        "VehicleIdentityDetails.usedFor",
                        "VehicleIdentityDetails.vehicleModel",
                        "VehicleIdentityDetails.yearOfManufacture",
                        "VehicleIdentityDetails.trailerAttached",                        
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
                        "VehicleRegistrationDetails.noOfCylinders",
                        "VehicleRegistrationDetails.grossVehicleWeight",
                        "VehicleRegistrationDetails.noOfAxles",
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
                        "VehicleValuation.valuationUpload",
                        "VehiclePhotoCaptures",
                        "VehiclePhotoCaptures.vehiclePhotoCaptures",
                        "VehiclePhotoCaptures.vehiclePhotoCaptures.photoFileId",
                        "VehiclePhotoCaptures.vehiclePhotoCaptures.photoRemarks",
                        "VehicleRecommendation",
                        "VehicleRecommendation.recommendationStatus",
                        "VehicleRecommendation.recommendationRemarks",
                        "actionbox",
                        "actionbox.submit",
                        "actionbox.save"
                    ];
                }

                var configFile = function() {
                    return {
                        "loanProcess.loanAccount.currentStage": {
                            "BusinessApproval1": {
                                "excludes": [
                                ],
                                "overrides": {
                                    "VehiclePrimaryInfo":{
                                        "readonly": true
                                    },
                                    "VehicleValuationPriliminaryInformation":{
                                        "readonly": true
                                    },
                                    "VehicleInspectionDetails":{
                                        "readonly": true
                                    },
                                    "VehicleIdentityDetails":{
                                        "readonly": true
                                    },
                                    "VehicleRegistrationDetails":{
                                        "readonly": true
                                    },
                                    "VehiclePermitAndTaxDetails":{
                                        "readonly": true
                                    },
                                    "VehicleInsuranceDetails":{
                                        "readonly": true
                                    },
                                    "VehicleOtherRemarks":{
                                        "readonly": true
                                    },
                                    "VehicleAsset":{
                                        "readonly": true
                                    },
                                    "VehicleAccessories":{
                                        "readonly": true
                                    },
                                    "VehicleValuation":{
                                        "readonly": true
                                    },
                                    "VehiclePhotoCaptures":{
                                        "readonly": true
                                    },
                                    "VehicleRecommendation":{
                                        "readonly": true
                                    }
                                }
                            },
                            "BusinessApproval2": {
                                "excludes": [
                                ],
                                "overrides": {
                                    "VehiclePrimaryInfo":{
                                        "readonly": true
                                    },
                                    "VehicleValuationPriliminaryInformation":{
                                        "readonly": true
                                    },
                                    "VehicleInspectionDetails":{
                                        "readonly": true
                                    },
                                    "VehicleIdentityDetails":{
                                        "readonly": true
                                    },
                                    "VehicleRegistrationDetails":{
                                        "readonly": true
                                    },
                                    "VehiclePermitAndTaxDetails":{
                                        "readonly": true
                                    },
                                    "VehicleInsuranceDetails":{
                                        "readonly": true
                                    },
                                    "VehicleOtherRemarks":{
                                        "readonly": true
                                    },
                                    "VehicleAsset":{
                                        "readonly": true
                                    },
                                    "VehicleAccessories":{
                                        "readonly": true
                                    },
                                    "VehicleValuation":{
                                        "readonly": true
                                    },
                                    "VehiclePhotoCaptures":{
                                        "readonly": true
                                    },
                                    "VehicleRecommendation":{
                                        "readonly": true
                                    }
                                }
                            },
                            "TeleVerification": {
                                "excludes": [
                                ],
                                "overrides": {
                                }
                            },
                            // "ScreeningReview": {
                            //     "excludes": [
                            //     ],
                            //     "overrides": {
                            //         "VehiclePrimaryInfo":{
                            //             "readonly": true
                            //         },
                            //         "VehicleValuationPriliminaryInformation":{
                            //             "readonly": true
                            //         },
                            //         "VehicleInspectionDetails":{
                            //             "readonly": true
                            //         },
                            //         "VehicleIdentityDetails":{
                            //             "readonly": true
                            //         },
                            //         "VehicleRegistrationDetails":{
                            //             "readonly": true
                            //         },
                            //         "VehiclePermitAndTaxDetails":{
                            //             "readonly": true
                            //         },
                            //         "VehicleInsuranceDetails":{
                            //             "readonly": true
                            //         },
                            //         "VehicleOtherRemarks":{
                            //             "readonly": true
                            //         },
                            //         "VehicleAsset":{
                            //             "readonly": true
                            //         },
                            //         "VehicleAccessories":{
                            //             "readonly": true
                            //         },
                            //         "VehicleValuation":{
                            //             "readonly": true
                            //         },
                            //         "VehiclePhotoCaptures":{
                            //             "readonly": true
                            //         },
                            //         "VehicleRecommendation":{
                            //             "readonly": true
                            //         }
                            //     }
                            // },
                            "CreditApproval1": {
                                "excludes": [
                                ],
                                "overrides": {
                                    "VehiclePrimaryInfo":{
                                        "readonly": true
                                    },
                                    "VehicleValuationPriliminaryInformation":{
                                        "readonly": true
                                    },
                                    "VehicleInspectionDetails":{
                                        "readonly": true
                                    },
                                    "VehicleIdentityDetails":{
                                        "readonly": true
                                    },
                                    "VehicleRegistrationDetails":{
                                        "readonly": true
                                    },
                                    "VehiclePermitAndTaxDetails":{
                                        "readonly": true
                                    },
                                    "VehicleInsuranceDetails":{
                                        "readonly": true
                                    },
                                    "VehicleOtherRemarks":{
                                        "readonly": true
                                    },
                                    "VehicleAsset":{
                                        "readonly": true
                                    },
                                    "VehicleAccessories":{
                                        "readonly": true
                                    },
                                    "VehicleValuation":{
                                        "readonly": true
                                    },
                                    "VehiclePhotoCaptures":{
                                        "readonly": true
                                    },
                                    "VehicleRecommendation":{
                                        "readonly": true
                                    }
                                }
                            },
                            "CreditApproval2": {
                                "excludes": [
                                ],
                                "overrides": {
                                    "VehiclePrimaryInfo":{
                                        "readonly": true
                                    },
                                    "VehicleValuationPriliminaryInformation":{
                                        "readonly": true
                                    },
                                    "VehicleInspectionDetails":{
                                        "readonly": true
                                    },
                                    "VehicleIdentityDetails":{
                                        "readonly": true
                                    },
                                    "VehicleRegistrationDetails":{
                                        "readonly": true
                                    },
                                    "VehiclePermitAndTaxDetails":{
                                        "readonly": true
                                    },
                                    "VehicleInsuranceDetails":{
                                        "readonly": true
                                    },
                                    "VehicleOtherRemarks":{
                                        "readonly": true
                                    },
                                    "VehicleAsset":{
                                        "readonly": true
                                    },
                                    "VehicleAccessories":{
                                        "readonly": true
                                    },
                                    "VehicleValuation":{
                                        "readonly": true
                                    },
                                    "VehiclePhotoCaptures":{
                                        "readonly": true
                                    },
                                    "VehicleRecommendation":{
                                        "readonly": true
                                    }
                                }
                            },
                            "CreditApproval3": {
                                "excludes": [
                                ],
                                "overrides": {
                                    "VehiclePrimaryInfo":{
                                        "readonly": true
                                    },
                                    "VehicleValuationPriliminaryInformation":{
                                        "readonly": true
                                    },
                                    "VehicleInspectionDetails":{
                                        "readonly": true
                                    },
                                    "VehicleIdentityDetails":{
                                        "readonly": true
                                    },
                                    "VehicleRegistrationDetails":{
                                        "readonly": true
                                    },
                                    "VehiclePermitAndTaxDetails":{
                                        "readonly": true
                                    },
                                    "VehicleInsuranceDetails":{
                                        "readonly": true
                                    },
                                    "VehicleOtherRemarks":{
                                        "readonly": true
                                    },
                                    "VehicleAsset":{
                                        "readonly": true
                                    },
                                    "VehicleAccessories":{
                                        "readonly": true
                                    },
                                    "VehicleValuation":{
                                        "readonly": true
                                    },
                                    "VehiclePhotoCaptures":{
                                        "readonly": true
                                    },
                                    "VehicleRecommendation":{
                                        "readonly": true
                                    }
                                }
                            }
                        },
                        "loanProcess.loanAccount.isValuator": {
                            "Yes": {
                                "excludes": [
                                    "actionbox"
                                ],
                                "overrides": {
                                    "VehiclePrimaryInfo":{
                                        "readonly": true
                                    },
                                    "VehicleValuationPriliminaryInformation":{
                                        "readonly": true
                                    },
                                    "VehicleInspectionDetails":{
                                        "readonly": true
                                    },
                                    "VehicleIdentityDetails":{
                                        "readonly": true
                                    },
                                    "VehicleRegistrationDetails":{
                                        "readonly": true
                                    },
                                    "VehiclePermitAndTaxDetails":{
                                        "readonly": true
                                    },
                                    "VehicleInsuranceDetails":{
                                        "readonly": true
                                    },
                                    "VehicleOtherRemarks":{
                                        "readonly": true
                                    },
                                    "VehicleAsset":{
                                        "readonly": true
                                    },
                                    "VehicleAccessories":{
                                        "readonly": true
                                    },
                                    "VehicleValuation":{
                                        "readonly": true
                                    },
                                    "VehiclePhotoCaptures":{
                                        "readonly": true
                                    },
                                    "VehicleRecommendation":{
                                        "readonly": true
                                    }
                                }
                            }
                        }
                    }
                }

                var formRequest = function(model) {
                    return {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [
                            "VehicleRegistrationDetails.engineNo",
                            "VehicleInsuranceDetails.taxPaid",
                            "VehiclePermitAndTaxDetails.taxPaid",
                            "VehicleRegistrationDetails.registeredownersname"
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
                            "VehicleInsuranceDetails": {
                                "type": "box",
                                "title": "INSURANCE_DETAILS",
                                "items": {
                                    "insuranceValidFrom": {
                                        "key": "loanAccount.vehicleLoanDetails.insuranceValidFrom",
                                        "type": "date",
                                        "title": "INSURANCE_VALID_FROM",
                                        "onChange": function (modelValue, form, model) {
                                            if (moment(model.loanAccount.vehicleLoanDetails.insuranceValidTo).format('YYYY-MM-DD') < moment(model.loanAccount.vehicleLoanDetails.insuranceValidFrom).format('YYYY-MM-DD')) {
                                                    model.loanAccount.vehicleLoanDetails.insuranceValidFrom = null;
                                                    PageHelper.showProgress('date', 'Please enter a date greater than from date', 5000);
                                                }
                                        }
                                    },
                                    "insuranceValidTo": {
                                        "key": "loanAccount.vehicleLoanDetails.insuranceValidTo",
                                        "type": "date",
                                        "title": "INSURANCE_VALID_TO",
                                        "onChange": function (modelValue, form, model) {
                                            if (moment(model.loanAccount.vehicleLoanDetails.insuranceValidTo).format('YYYY-MM-DD') < moment(model.loanAccount.vehicleLoanDetails.insuranceValidFrom).format('YYYY-MM-DD')) {
                                                    model.loanAccount.vehicleLoanDetails.insuranceValidTo = null;
                                                    PageHelper.showProgress('date', 'Please enter a date greater than from date', 5000);
                                                }
                                        }
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
                                        "key": "loanAccount.vehicleLoanDetails.recommendationRemarks",
                                        "required": true,
                                        "title": "REMARKS"
                                    }
                                }
                            },
                            "VehicleValuation": {
                                "items": {
                                    "valuationUpload": {
                                        title: "VALUATION_UPLOAD",
                                        key: "loanAccount.vehicleLoanDetails.vehicleValuationReportId",
                                        "required": true,
                                        type: "file",
                                        fileType: "application/pdf",
                                        category: "Loan",
                                        subCategory: "DOC1",
                                        using: "scanner"
                                    }
                                }
                            },
                            "VehicleAccessories": {
                                "items": {
                                    "vehicleAccessories": {
                                        "startEmpty": true,
                                        "items": {
                                          
                                        }
                                    }
                                }
                            },
                            "VehicleAsset": {
                                "items": {
                                    "vehicleAssetConditions": {
                                        "startEmpty": true,
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
                        }
                        }
                    };
                }

                return {
                    "type": "schema-form",
                    "title": "VEHICLE_VALUATION",
                    "subTitle": "BUSINESS",
                    initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {

                        self = this;
                        PageHelper.showLoader();
                        

                        if(_.hasIn(model, 'loanProcess.loanAccount')) {
                            model.loanAccount = model.loanProcess.loanAccount;

                            if (_.hasIn(model, 'loanAccount.vehicleLoanDetails.category') &&
                        model.loanAccount.vehicleLoanDetails.category !=null ) {
                                    model.loanAccount.vehicleLoanDetails.vehicleClass = model.loanAccount.vehicleLoanDetails.category;
                        }
                            var p1 = UIRepository.getLoanProcessUIRepository().$promise;;
                            p1.then(function(repo) {
                                self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest(model), configFile(), model);
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

                                if (_.hasIn(model, 'loanAccount.vehicleLoanDetails.category') &&
                                model.loanAccount.vehicleLoanDetails.category !=null ) {
                                            model.loanAccount.vehicleLoanDetails.vehicleClass = model.loanAccount.vehicleLoanDetails.category;
                                }

                                var p1 = UIRepository.getLoanProcessUIRepository().$promise;;
                                p1.then(function(repo) {
                                    self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest(model), configFile(), model);
                                    // NGHelper.refreshUI();
                                })
                            }, function(err) {
                                console.log(err);
                                PageHelper.hideLoader();
                            })
                        }

                    },
                    offlineInitialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                        model.loanProcess = bundleModel.loanProcess;
                        if(_.hasIn(model.loanProcess, 'loanAccount')) {
                            model.loanAccount = model.loanProcess.loanAccount;
                        }
                        var self = this;
                        var p1 = UIRepository.getLoanProcessUIRepository().$promise;
                        p1.then(function(repo) {
                            self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest(model), configFile(), model);
                        }, function(err) {
                            console.log(err);

                        })
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
                            var vehicleValuationDoneAt_time=new Date();
                            model.loanAccount.vehicleLoanDetails.vehicleValuationDoneAt=vehicleValuationDoneAt_time;
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
                        }
                    }
                };

            }

        }
    });
