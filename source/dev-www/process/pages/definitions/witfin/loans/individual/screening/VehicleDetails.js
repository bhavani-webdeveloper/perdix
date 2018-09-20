define(
    // [
    //     "perdix/domain/model/loan/LoanProcess",
    //     "perdix/infra/helpers/NGHelper",
    // ],
    function(){
        // LoanProcess = LoanProcess["LoanProcess"];
        // NGHelper = NGHelper["NGHelper"];
    return {
        pageUID: "witfin.loans.individual.screening.VehicleDetails",
        pageType: "Engine",
        dependencies: ["$log", "$q","LoanAccount","LoanProcess", 'Scoring', 'Enrollment','EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
            'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor","UIRepository", "$injector", "irfNavigator"],

        $pageFn: function($log, $q, LoanAccount,LoanProcess, Scoring, Enrollment,EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper,formHelper,elementsUtils,
                          irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
                          BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();


            var self;
            // var validateForm = function(formCtrl){
            //     formCtrl.scope.$broadcast('schemaFormValidate');
            //     if (formCtrl && formCtrl.$invalid) {
            //         PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
            //         return false;
            //     }
            //     return true;
            // };

            // var getRelationFromClass = function(relation){
            //     if (relation == 'guarantor'){
            //         return 'Guarantor';
            //     } else if (relation == 'applicant'){
            //         return 'Applicant';
            //     } else if (relation == 'co-applicant'){
            //         return 'Co-Applicant';
            //     }
            // };



            var configFile = function() {
                return {
                    "loanProcess.loanAccount.currentStage": {
                        "Screening": {
                            "excludes": [
                                "VehicleLoanIncomesInformation",
                                "VehicleLoanIncomesInformation1",
                                "VehicleViability",
                                "VehicleViability.calculateVehicleDetails"
                            ],
                            "overrides": {

                            }
                        },
                        "ScreeningReview": {
                            "excludes": [
                                "VehicleViability",

                            ],
                            "overrides": {
                                 "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "GoNoGoApproval1": {
                            "excludes": [
                                "VehicleViability",
                                "VehicleViability.calculateVehicleDetails",
                            ],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "GoNoGoApproval2": {
                            "excludes": [
                                "VehicleViability",
                                "VehicleViability.calculateVehicleDetails",
                            ],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "FieldInvestigation": {
                            "excludes": [
                                "VehicleViability",
                            ],
                            "overrides": {

                            }
                        },
                        "TeleVerification": {
                            "excludes": [
                                "VehicleViability",
                            ],
                            "overrides": {

                            }
                        },
                        "CreditAppraisal": {
                            "excludes": [

                            ],
                            "overrides": {

                            }
                        },
                        "DeviationApproval1": {
                            "excludes": [
                                "VehicleViability.calculateVehicleDetails"
                            ],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "DeviationApproval2": {
                            "excludes": [],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval1": {
                            "excludes": [
                                "VehicleViability.calculateVehicleDetails"
                            ],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval2": {
                            "excludes": [
                                "VehicleViability.calculateVehicleDetails"
                            ],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval3": {
                            "excludes": [
                               "VehicleViability.calculateVehicleDetails"
                            ],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval4": {
                            "excludes": [
                               "VehicleViability.calculateVehicleDetails"
                            ],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessApproval5": {
                            "excludes": [
                               "VehicleViability.calculateVehicleDetails"
                            ],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval1": {
                            "excludes": [
                              "VehicleViability.calculateVehicleDetails"  
                            ],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval2": {
                            "excludes": [
                              "VehicleViability.calculateVehicleDetails"  
                            ],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval3": {
                            "excludes": [
                              "VehicleViability.calculateVehicleDetails" 
                            ],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval4": {
                            "excludes": [
                              "VehicleViability.calculateVehicleDetails" 
                            ],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },
                        "CreditApproval5": {
                            "excludes": [
                              "VehicleViability",
                              "VehicleViability.calculateVehicleDetails" 
                            ],
                            "overrides": {
                                "VehicleLoanIncomesInformation": {
                                    "readonly": true
                                },
                                "VehicleExpensesInformation": {
                                    "readonly": true
                                },
                                "VehicleViability": {
                                    "readonly": true
                                },
                                "VehicleViability1": {
                                    "readonly": true
                                },
                                "NewVehicleDetails": {
                                    "readonly": true
                                },
                                "VehicleAssetUse": {
                                    "readonly": true
                                },
                                "VehicleRouteDetails": {
                                    "readonly": true
                                },
                                "vehicleLoanDocuments": {
                                    "readonly": true
                                },
                                "VehiclePhotoCaptures": {
                                    "readonly": true
                                }
                            }
                        },

                    }
                }
            }

            var getIncludes = function (model) {

                return [
                    "VehicleLoanIncomesInformation",
                    "VehicleLoanIncomesInformation.VehicleLoanIncomes",
                    "VehicleLoanIncomesInformation.VehicleLoanIncomes.incomeType",
                    "VehicleLoanIncomesInformation.VehicleLoanIncomes.incomeAmount",
                    "VehicleLoanIncomesInformation1",
                    "VehicleLoanIncomesInformation1.VehicleLoanIncomes1",
                    "VehicleLoanIncomesInformation1.VehicleLoanIncomes1.incomeType1",
                    "VehicleLoanIncomesInformation1.VehicleLoanIncomes1.incomeAmount1",
                    "VehicleExpensesInformation",
                    "VehicleExpensesInformation.VehicleExpenses",
                    "VehicleExpensesInformation.VehicleExpenses.expenseType",
                    "VehicleExpensesInformation.VehicleExpenses.expenseAmount",
                    "VehicleExpensesInformation1",
                    "VehicleExpensesInformation1.VehicleExpenses1",
                    "VehicleExpensesInformation1.VehicleExpenses1.expenseType1",
                    "VehicleExpensesInformation1.VehicleExpenses1.expenseAmount1",
                    "NewVehicleDetails",
                    "NewVehicleDetails.vehicleType",
                    "NewVehicleDetails.vehicleType1",
                    "NewVehicleDetails.endUse",
                    "NewVehicleDetails.usedFor",
                    "NewVehicleDetails.segment",
                    "NewVehicleDetails.category",
                    "NewVehicleDetails.yearOfManufacture",
                    "NewVehicleDetails.yearOfManufacture1",
                    "NewVehicleDetails.make",
                    "NewVehicleDetails.make1",
                    "NewVehicleDetails.vehicleModel",
                    "NewVehicleDetails.vehicleModel1",
                    "NewVehicleDetails.assetDetails",
                    "NewVehicleDetails.assetSubDetails",
                    "NewVehicleDetails.registrationNumber",
                    "NewVehicleDetails.originalInvoiceValue",
                    "NewVehicleDetails.permitType",
                    "NewVehicleDetails.price",
                    "NewVehicleDetails.udf1",
                    "NewVehicleDetails.insuredDeclaredValue",  
                    "VehicleViability",
                    "VehicleViability.viabilityCategory",
                    "VehicleViability.fuelConsumptionPerHour",
                    "VehicleViability.validation",
                    "VehicleViability.freeCashFlow",
                    "VehicleViability.fcfToEmi",
                    "VehicleViability.totalMonthlyExpense",
                    "VehicleViability1",
                    "VehicleViability1.grossVehicleWeight1",
                    "VehicleViability1.payLoad1",
                    "VehicleViability1.typeofLoad1",
                    "VehicleViability1.ratePerTrip1",
                    "VehicleViability1.mileage1",
                    "VehicleViability1.noOfTyres1",
                    "VehicleViability1.costOfTyre1",
                    "VehicleViability1.lifeOfTyre1",
                    "VehicleViability1.fuelConsumptionPerHour1",
                    "VehicleViability1.validation1",
                    "VehicleViability1.fcfToEmi1",
                    "VehicleViability1.freeCashFlow1",
                    "VehicleViability1.totalMonthlyExpense1",
                    "VehicleAssetUse",
                    "VehicleAssetUse.segment",
                    "VehicleAssetUse.subSegnment",
                    "VehicleAssetUse.entityType",
                    "VehicleAssetUse.attachedWith",
                    "VehicleAssetUse.attachedAddress",
                    "VehicleAssetUse.attachedContactNumber",
                    "VehicleAssetUse.locationAddress",
                    "VehicleAssetUse.locationContactName",
                    "VehicleAssetUse.locationContactNumber",
                    "VehicleAssetUse.dailyWorkingHours",
                    "VehicleAssetUse.monthlyWorkingDays",
                    "VehicleAssetUse.hourlyRate",
                    "VehicleRouteDetails",
                    "VehicleRouteDetails.vehicleRouteDetails",
                    "VehicleRouteDetails.vehicleRouteDetails.routeFrom",
                    "VehicleRouteDetails.vehicleRouteDetails.routeTo",
                    "VehicleRouteDetails.vehicleRouteDetails.ratePerTrip",
                    "VehicleRouteDetails.vehicleRouteDetails.trips",
                    "VehicleRouteDetails.vehicleRouteDetails.routesKms",
                    "VehicleRouteDetails.vehicleRouteDetails.kmPerMonth",
                    "vehicleLoanDocuments",
                    "vehicleLoanDocuments.vehicleLoanDocuments",
                    "vehicleLoanDocuments.vehicleLoanDocuments.docType",
                    "vehicleLoanDocuments.vehicleLoanDocuments.fileId",
                    "vehicleLoanDocuments.vehicleLoanDocuments.issueDate",
                    "vehicleLoanDocuments.vehicleLoanDocuments.expiryDate",
                    "VehiclePhotoCaptures",
                    "VehiclePhotoCaptures.vehiclePhotoCaptures",
                    "VehiclePhotoCaptures.vehiclePhotoCaptures.photoFileId",
                    "VehiclePhotoCaptures.vehiclePhotoCaptures.photoRemarks", 
                    "calculateVehicleDetails",
                    "calculateVehicleDetails.calculateVehicleDetails",
                    "calculateVehicleDetails1",
                    "calculateVehicleDetails1.calculateVehicleDetails1",        
                    "actionbox",
                    "actionbox.save",
                ];

            }

            return {
                "type": "schema-form",
                "title": "VEHICLE_DETAILS",
                "subTitle": "DETAILS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // AngularResourceService.getInstance().setInjector($injector);

                    /* Setting data recieved from Bundle */
                    model.loanAccount = model.loanProcess.loanAccount;

                    var self = this;
                    var formRequest = {
                        "overrides": {
                            "VehiclePhotoCaptures": {
                                "condition": "model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance'"
                            },
                            "VehicleViability1": {
                                "orderNo": 900
                            },
                            "VehicleViability":{
                                "orderNo": 900
                            },
                            "vehicleLoanDocuments": {
                                "condition": "model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance'"
                            },
                            "vehicleLoanDocuments.vehicleLoanDocuments": {
                                "view": "fixed",
                                "titleExpr": "model.loanAccount.vehicleLoanDetails.vehicleLoanDocuments[arrayIndexes[0]].docType",
                                "add": null,
                                "remove": null
                            },
                            "vehicleLoanDocuments.vehicleLoanDocuments.docType": {
                                // "required": true
                            },
                            "vehicleLoanDocuments.vehicleLoanDocuments.fileId": {
                                // "required": true
                            },
                            "VehicleRouteDetails": {
                                "condition": "(model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance')&& (model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'goods')"
                            },
                            "VehicleRouteDetails.vehicleRouteDetails.routeFrom": {
                                "required": true
                            },
                            "VehicleRouteDetails.vehicleRouteDetails.routeTo": {
                                "required": true
                            },
                            "VehicleRouteDetails.vehicleRouteDetails.ratePerTrip": {
                                "required": true
                            },
                            "VehicleRouteDetails.vehicleRouteDetails.trips": {
                                "required": true
                            },
                            "VehicleRouteDetails.vehicleRouteDetails.routesKms": {
                                "required": true
                            },
                            "VehicleAssetUse": {
                                "condition": "model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance'"
                            },
                            "VehicleAssetUse.dailyWorkingHours": {
                                "required": true
                            },
                            "VehicleAssetUse.monthlyWorkingDays": {
                                "required": true
                            },
                            "VehicleAssetUse.hourlyRate": {
                                "required": true
                            },
                            "NewVehicleDetails": {
                                "condition": "model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance'"
                            },
                            "NewVehicleDetails.permitType": {
                                "type": "select",
                                "enumCode": "permit_type",
                                "title": "PERMIT_TYPE",
                                "orderNo": 130
                            },
                            "NewVehicleDetails.vehicleType": {
                                "orderNo": 10,
                                "enumCode": "new_vehicle_category",
                                "required": true,
                                "condition": "model.loanAccount.loanPurpose1 == 'Refinance'"
                            },
                            "NewVehicleDetails.endUse": {
                                "orderNo": 30,
                                "required": true
                            },
                            "NewVehicleDetails.usedFor": {
                                "orderNo": 30,
                                "required": true
                            },
                            "NewVehicleDetails.segment": {
                                "orderNo": 40,
                                "enumCode": "vehicle_segment",
                                "readonly": true,
                                onChange: function(modelValue, form, model) {
                                    model.loanAccount.vehicleLoanDetails.category = null;
                                    model.loanAccount.vehicleLoanDetails.make = null;
                                    model.loanAccount.vehicleLoanDetails.make1 = null;
                                    model.loanAccount.vehicleLoanDetails.vehicleModel = null;
                                    model.loanAccount.vehicleLoanDetails.yearOfManufacture = null;
                                    model.loanAccount.vehicleLoanDetails.assetDetails = null;
                                    model.loanAccount.vehicleLoanDetails.assetSubDetails = null;
                                    model.loanAccount.vehicleLoanDetails.price = null;
                                    model.loanAccount.vehicleLoanDetails.registrationNumber = null;
                                    model.loanAccount.vehicleLoanDetails.permitType = null;
                                    model.loanAccount.vehicleLoanDetails.insuredDeclaredValue = null;
                                    model.loanAccount.vehicleLoanDetails.viabilityCategory = null;
                                    model.loanAccount.vehicleLoanDetails.grossVehicleWeight = null;
                                    model.loanAccount.vehicleLoanDetails.payLoad = null;
                                    model.loanAccount.vehicleLoanDetails.typeofLoad = null;
                                    model.loanAccount.vehicleLoanDetails.ratePerTrip = null;
                                    model.loanAccount.vehicleLoanDetails.mileage = null;
                                    model.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour = null;
                                    model.loanAccount.vehicleLoanDetails.noOfTyres = null;
                                    model.loanAccount.vehicleLoanDetails.costOfTyre = null;
                                    model.loanAccount.vehicleLoanDetails.lifeOfTyre = null;
                                    model.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour = null;
                                    model.loanAccount.vehicleLoanDetails.validation = null;
                                    model.loanAccount.vehicleLoanDetails.totalMonthlyExpense = null;
                                    model.loanAccount.vehicleLoanDetails.freeCashFlow = null;
                                    model.loanAccount.vehicleLoanDetails.fcfToEmi = null;
                                    model.loanAccount.vehicleLoanDetails.dailyWorkingHours = null;
                                    model.loanAccount.vehicleLoanDetails.monthlyWorkingDays = null;
                                    model.loanAccount.vehicleLoanDetails.hourlyRate = null;
                                    model.loanAccount.vehicleLoanDetails.monthlyWorkingHours = null;

                                    model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routeTo = null;
                                    model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].ratePerTrip = null;
                                    model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routeVia = null;
                                    model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms = null;
                                    model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips = null;
                                    model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth = null;

                                    if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses)) {
                                        for (var i=0;i<model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.length;i++) {
                                            var vehicleLoanExpense = model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[i];
                                            vehicleLoanExpense.expenseAmount = 0;
                                        }
                                    }

                                    if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes)) {
                                       for (var i=0;i<model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes.length;i++) {
                                            var vehicleLoanIncome = model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[i];
                                            vehicleLoanIncome.incomeAmount = 0;
                                        } 
                                    }
                                                    
                                },
                                "required": true
                            },
                            "NewVehicleDetails.category": {
                                "orderNo": 50,
                                "key": "loanAccount.vehicleLoanDetails.category",
                                "type": "lov",
                                "autolov": true,
                                "readonly": true,
                                "lovonly": true,
                                "title": "CATEGORY",
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var vehicleDetails = model.vehicleDetails;
                                    var out = [];
                                    var res = $filter('filter')(vehicleDetails, {
                                        'segment': model.loanAccount.vehicleLoanDetails.segment
                                    }, true);
                                    out = _.uniqBy(res, 'category');
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },                                
                                onSelect: function(valueObj, model, context) {
                                    model.loanAccount.vehicleLoanDetails.category = valueObj.category;
                                    model.loanAccount.vehicleLoanDetails.make = null;
                                    model.loanAccount.vehicleLoanDetails.vehicleModel = null;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.category
                                    ];
                                },
                                "required": true
                            },
                            "NewVehicleDetails.make": {
                                "orderNo": 60,
                                "key": "loanAccount.vehicleLoanDetails.make",
                                "type": "lov",
                                "autolov": true,
                                "lovonly": true,
                                "title": "MAKE",
                                "readonly": true,
                                "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'NO'",
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var vehicleDetails = model.vehicleDetails;
                                    var out = [];
                                    var res = $filter('filter')(vehicleDetails, {
                                        'segment': model.loanAccount.vehicleLoanDetails.segment,
                                        'category': model.loanAccount.vehicleLoanDetails.category
                                    }, true);
                                    out = _.uniqBy(res, 'manufacturer');
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.loanAccount.vehicleLoanDetails.make = valueObj.manufacturer;
                                    model.loanAccount.vehicleLoanDetails.vehicleModel = null;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.manufacturer
                                    ];
                                },
                                "required": true
                            },
                            "NewVehicleDetails.vehicleModel": {
                                "type": "lov",
                                "resolver": "VehicleDetailModelLOVConfiguration",
                                "orderNo": 70,
                                "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'NO'",
                                "required": true
                            },
                            "NewVehicleDetails.yearOfManufacture": {
                                "orderNo": 80,
                                "key": "loanAccount.vehicleLoanDetails.yearOfManufacture",
                                "title": "MANUFACTURER_YEAR",
                                "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'NO'",
                                "required": true
                            },
                            "NewVehicleDetails.assetDetails": {
                                "orderNo": 90
                            },
                            "NewVehicleDetails.assetSubDetails": {
                                "orderNo": 100,
                                "title": "SUB_DESCRIPTION"
                            },
                            "NewVehicleDetails.registrationNumber": {
                                "orderNo": 110,
                                "required": true
                            },
                            "NewVehicleDetails.originalInvoiceValue": {
                                "orderNo": 120,
                                "readonly": true,
                                "required": true
                            },
                            "VehicleExpensesInformation": {
                                "condition": "(model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance') && model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1.toUpperCase() == 'YES'",
                            },
                            "VehicleExpensesInformation.VehicleExpenses": {
                                "startEmpty": true
                            },
                            "VehicleExpensesInformation.VehicleExpenses.expenseAmount": {
                                "required": true
                            },
                            "VehicleLoanIncomesInformation": {
                                "condition": "(model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance') && model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1.toUpperCase() == 'YES'"
                            },
                            "VehicleLoanIncomesInformation.VehicleLoanIncomes": {
                                "startEmpty": true   
                            },
                            "VehicleLoanIncomesInformation.VehicleLoanIncomes.incomeAmount": {
                                "required": true
                            },
                            "actionbox": {
                                "orderNo": 999
                            }
                        },
                        "includes": getIncludes (model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "NewVehicleDetails": {
                                    "items": {
                                        "vehicleType1": {
                                            "orderNo": 20,
                                            "key": "loanAccount.vehicleLoanDetails.vehicleType",
                                            "type": "select",
                                            "enumCode": "new_vehicle_category",
                                            "title": "VEHICLE_TYPE",
                                            "required": true,
                                            "readonly": true,
                                            "condition": "model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle'",
                                        },
                                        "udf1": {
                                            "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1",
                                            "title": "MODEL_NOT_LISTED",
                                            "enumCode": "decisionmaker",
                                            "type": "radios",
                                            "orderNo": 75,
                                            onChange: function(modelValue, form, model) {

                                                    model.loanAccount.vehicleLoanDetails.viabilityCategory = "Non-Standard Asset";

                                                    model.loanAccount.vehicleLoanDetails.vehicleModel = null;
                                                    model.loanAccount.vehicleLoanDetails.price = null;
                                                    model.loanAccount.vehicleLoanDetails.viabilityCategory = null;
                                                    model.loanAccount.vehicleLoanDetails.grossVehicleWeight = null;
                                                    model.loanAccount.vehicleLoanDetails.payLoad = null;
                                                    model.loanAccount.vehicleLoanDetails.typeofLoad = null;
                                                    model.loanAccount.vehicleLoanDetails.ratePerTrip = null;
                                                    model.loanAccount.vehicleLoanDetails.mileage = null;
                                                    model.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour = null;
                                                    model.loanAccount.vehicleLoanDetails.noOfTyres = null;
                                                    model.loanAccount.vehicleLoanDetails.costOfTyre = null;
                                                    model.loanAccount.vehicleLoanDetails.lifeOfTyre = null;
                                                    model.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour = null;
                                                    model.loanAccount.vehicleLoanDetails.validation = null;
                                                    model.loanAccount.vehicleLoanDetails.totalMonthlyExpense = null;
                                                    model.loanAccount.vehicleLoanDetails.freeCashFlow = null;
                                                    model.loanAccount.vehicleLoanDetails.fcfToEmi = null;
                                                    model.loanAccount.vehicleLoanDetails.yearOfManufacture = null;
                                                    model.loanAccount.vehicleLoanDetails.registrationNumber = null;
                                                    model.loanAccount.vehicleLoanDetails.assetDetails = null;
                                                    model.loanAccount.vehicleLoanDetails.assetSubDetails = null;
                                                    model.loanAccount.vehicleLoanDetails.permitType = null;
                                                    model.loanAccount.vehicleLoanDetails.insuredDeclaredValue = null;
                                                    model.loanAccount.vehicleLoanDetails.dailyWorkingHours = null;
                                                    model.loanAccount.vehicleLoanDetails.monthlyWorkingDays = null;
                                                    model.loanAccount.vehicleLoanDetails.hourlyRate = null;
                                                    model.loanAccount.vehicleLoanDetails.monthlyWorkingHours = null;

                                                    if (model.loanAccount.vehicleLoanDetails.vehicleRouteDetails && _.isArray(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0]) {
                                                        model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routeTo = null;
                                                        model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].ratePerTrip = null;
                                                        model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routeVia = null;
                                                        model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms = null;
                                                        model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips = null;
                                                        model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth = null;
                                                    }

                                                    model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses = [];
                                                    model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.push(
                                                        {
                                                            'expenseType': "Fuel Cost per month",
                                                            'expenseAmount': 0
                                                        },
                                                        {
                                                            'expenseType': "Tyre Cost per month",
                                                            'expenseAmount': 0
                                                        },
                                                        {
                                                            'expenseType': "Lubricant Cost",
                                                            'expenseAmount': 0
                                                        },
                                                        {
                                                            'expenseType': "Driver\'s Salary",
                                                            'expenseAmount': 0
                                                        },
                                                        {
                                                            'expenseType': "Cleaner\'s Salary",
                                                            'expenseAmount': 0
                                                        },
                                                        {
                                                            'expenseType': "Permit Cost",
                                                            'expenseAmount': 0
                                                        },
                                                        {
                                                            'expenseType': "Taxes",
                                                            'expenseAmount': 0
                                                        },
                                                        {
                                                            'expenseType': "Maintenance",
                                                            'expenseAmount': 0
                                                        },
                                                        {
                                                            'expenseType': "Insurance",
                                                            'expenseAmount': 0
                                                        },
                                                        {
                                                            'expenseType': "Miscellaneous",
                                                            'expenseAmount': 0
                                                        }
                                                    );      

                                                   
                                                    model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes = [];
                                                    model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes.push({
                                                        'incomeType': 'Monthly Revenue',
                                                        'incomeAmount': 0
                                                    });
                                            }
                                        },
                                        "make1": {
                                            "orderNo": 60,
                                            "key": "loanAccount.vehicleLoanDetails.make",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'",
                                            "title": "MAKE",
                                            "required": true
                                        },
                                        "vehicleModel1": {
                                            "orderNo": 70,
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'",
                                            "key": "loanAccount.vehicleLoanDetails.vehicleModel",
                                            "required": true,
                                            "title": "MODEL"
                                        },
                                        "yearOfManufacture1": {
                                            "orderNo": 80,
                                            "key": "loanAccount.vehicleLoanDetails.yearOfManufacture",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'",
                                            "title": "MANUFACTURER_YEAR",
                                            "required": true
                                        },
                                        "insuredDeclaredValue": {
                                            "orderNo": 150,
                                            "key": "loanAccount.vehicleLoanDetails.insuredDeclaredValue",
                                            "title": "INSURED_DECLARED_VALUE"
                                        },
                                        "price":{
                                            "orderNo":140,
                                            "key":"loanAccount.vehicleLoanDetails.price",
                                            "title": "PRICE"
                                        }
                                    }
                                },
                                "VehicleViability": {
                                    "type": "box",
                                    "title": "VEHICLE_VIABILITY",
                                    "orderNo": 45,
                                    "condition": "(model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance') && model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'NO'",
                                    "items": {
                                        "viabilityCategory": {
                                           "key": "loanAccount.vehicleLoanDetails.viabilityCategory",
                                           "title": "VIABILITY_CATEGORY",
                                           "readonly": "true"
                                        },
                                        "grossVehicleWeight": {
                                           "key": "loanAccount.vehicleLoanDetails.grossVehicleWeight",
                                           "title": "GROSS_VEHICLE_WEIGHT",
                                           "type": "number",
                                           "readonly": "true",
                                           "condition": "model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'goods'"
                                        },
                                        "payLoad": {
                                           "key": "loanAccount.vehicleLoanDetails.payLoad",
                                           "title": "PAYLOAD",
                                           "type": "number",
                                           "readonly": "true",
                                           "condition": "model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'goods'"
                                        },
                                        "typeofLoad": {
                                           "key": "loanAccount.vehicleLoanDetails.typeofLoad",
                                           "title": "TYPE_OF_LOAD",
                                           "readonly": "true",
                                           "condition": "model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'goods'"
                                        },
                                        "ratePerTrip": {
                                           "key": "loanAccount.vehicleLoanDetails.ratePerTrip",
                                           "title": "RATE_PER_TRIP",
                                           "type": "number",
                                           "readonly": "true",
                                           "condition": "model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'goods'"
                                        },
                                        "mileage": {
                                           "key": "loanAccount.vehicleLoanDetails.mileage",
                                           "title": "MILEAGE",
                                           "type": "number",
                                           "readonly": "true",
                                           "condition": "model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'goods'"
                                        },
                                        "noOfTyres": {
                                           "key": "loanAccount.vehicleLoanDetails.noOfTyres",
                                           "title": "NO_OF_TYRES",
                                           "type": "number",
                                           "readonly": "true"
                                        },
                                        "costOfTyre": {
                                           "key": "loanAccount.vehicleLoanDetails.costOfTyre",
                                           "title": "COST_OF_TYRE",
                                           "type": "number",
                                           "readonly": "true"
                                        },
                                        "lifeOfTyre": {
                                           "key": "loanAccount.vehicleLoanDetails.lifeOfTyre",
                                           "title": "LIFE_OF_TYRE",
                                           "type": "number",
                                           "readonly": "true"
                                        },
                                        "fuelConsumptionPerHour": {
                                            "key": "loanAccount.vehicleLoanDetails.fuelConsumptionPerHour",
                                            "title": "FUEL_CONSUMPTION_PER_HOUR",
                                            "type": "number",
                                            "readonly": "true",
                                            "condition": "model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'construction equipment'"
                                        },
                                        "validation": {
                                            "key": "loanAccount.vehicleLoanDetails.validation",
                                            "title": "VALIDATION",
                                            "type": "string",
                                            "readonly": "true",
                                            "condition": "model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'goods'"
                                        },
                                        "totalMonthlyExpense": {
                                            "key": "loanAccount.vehicleLoanDetails.totalMonthlyExpense",
                                            "title": "TOTAL_MONTHLY_EXPENSE",
                                            "type": "number",
                                            "readonly": "true"
                                        },
                                        "freeCashFlow": {
                                            "key": "loanAccount.vehicleLoanDetails.freeCashFlow",
                                            "title": "FREE_CASH_FLOW",
                                            "type": "number",
                                            "readonly": "true"
                                        },
                                        "fcfToEmi": {
                                            "key": "loanAccount.vehicleLoanDetails.fcfToEmi",
                                            "title": "FCF_TO_EMI",
                                            "type": "number",
                                            "readonly": "true"
                                        }
                                    }
                                },
                                "VehicleViability1": {
                                    "type": "box",
                                    "title": "VEHICLE_VIABILITY",
                                    "orderNo": 45,
                                    "condition": "(model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance') && model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'",
                                    "items": {
                                        "grossVehicleWeight1": {
                                           "key": "loanAccount.vehicleLoanDetails.grossVehicleWeight",
                                           "title": "GROSS_VEHICLE_WEIGHT",
                                           "type": "number",
                                           "required": true,
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES' && model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'goods'"
                                        },
                                        "payLoad1": {
                                           "key": "loanAccount.vehicleLoanDetails.payLoad",
                                           "title": "PAYLOAD",
                                           "type": "number",
                                           "required": true,
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES' && model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'goods'"
                                        },
                                        "typeofLoad1": {
                                           "key": "loanAccount.vehicleLoanDetails.typeofLoad",
                                           "title": "TYPE_OF_LOAD",
                                           "required": true,
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES' && model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'goods'",
                                        },
                                        "ratePerTrip1": {
                                           "key": "loanAccount.vehicleLoanDetails.ratePerTrip",
                                           "title": "RATE_PER_TRIP",
                                           "type": "number",
                                           "required": true,
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES' && model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'goods'"
                                        },
                                        "mileage1": {
                                           "key": "loanAccount.vehicleLoanDetails.mileage",
                                           "title": "MILEAGE",
                                           "type": "number",
                                           "required": true,
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES' && model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'goods'"
                                        },
                                        "noOfTyres1": {
                                           "key": "loanAccount.vehicleLoanDetails.noOfTyres",
                                           "title": "NO_OF_TYRES",
                                           "type": "number",
                                           "required": true,
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "costOfTyre1": {
                                           "key": "loanAccount.vehicleLoanDetails.costOfTyre",
                                           "title": "COST_OF_TYRE",
                                           "type": "number",
                                           "required": true,
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "lifeOfTyre1": {
                                           "key": "loanAccount.vehicleLoanDetails.lifeOfTyre",
                                           "title": "LIFE_OF_TYRE",
                                           "type": "number",
                                           "required": true,
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "fuelConsumptionPerHour1": {
                                            "key": "loanAccount.vehicleLoanDetails.fuelConsumptionPerHour",
                                            "title": "FUEL_CONSUMPTION_PER_HOUR",
                                            "type": "number",
                                            "required": true,
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES' && model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'construction equipment'"
                                        },
                                        "validation1": {
                                            "key": "loanAccount.vehicleLoanDetails.validation",
                                            "title": "VALIDATION",
                                            "type": "string",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES' && model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'goods'",
                                            "readonly": true
                                        },
                                        "totalMonthlyExpense1": {
                                            "key": "loanAccount.vehicleLoanDetails.totalMonthlyExpense",
                                            "title": "TOTAL_MONTHLY_EXPENSE",
                                            "type": "number",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'",
                                            "readonly": true
                                        },
                                        "freeCashFlow1": {
                                            "key": "loanAccount.vehicleLoanDetails.freeCashFlow",
                                            "title": "FREE_CASH_FLOW",
                                            "type": "number",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'",
                                            "readonly": true
                                        },
                                        "fcfToEmi1": {
                                            "key": "loanAccount.vehicleLoanDetails.fcfToEmi",
                                            "title": "FCF_TO_EMI",
                                            "type": "number",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'",
                                            "readonly": true
                                        },
                                                  
                                    }
                                },
                                "VehicleAssetUse": {
                                    "items": {
                                        "dailyWorkingHours": {
                                            "key":  "loanAccount.vehicleLoanDetails.dailyWorkingHours",
                                            "title": "NO_OF_HOURS_RUNNING_PER_DAY",
                                            "type": "number",
                                            "condition": "model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'construction equipment'"
                                        },
                                        "monthlyWorkingDays": {
                                            "key": "loanAccount.vehicleLoanDetails.monthlyWorkingDays",
                                            "title": "NO_OF_DAYS_WORKING_PER_MONTH",
                                            "type": "number",
                                            "condition": "model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'construction equipment'"
                                        },
                                        "hourlyRate": {
                                            "key": "loanAccount.vehicleLoanDetails.hourlyRate",
                                            "title": "HIRING_RATE_PER_HOUR",
                                            "type": "number",
                                            "condition": "model.loanAccount.vehicleLoanDetails.segment.toLowerCase() == 'construction equipment'"
                                        }
                                    }
                                },
                                "VehicleRouteDetails": {
                                    "items": {
                                        "vehicleRouteDetails": {
                                            "items": {
                                                "kmPerMonth": {
                                                    "type": "string",
                                                    "key": "loanAccount.vehicleLoanDetails.vehicleRouteDetails[].kmPerMonth",
                                                    "title": "KM_PER_MONTH",
                                                    "readonly": true
                                                }
                                            }
                                        }
                                    }
                                },
                                "VehicleLoanIncomesInformation1": {
                                    "type": "box",
                                    "title": "VEHICLE_LOAN_INCOME",
                                    "orderNo": 310,
                                    "readonly": true,
                                    "condition": "(model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance') && model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1.toUpperCase() == 'NO'",
                                    "items": {
                                        "VehicleLoanIncomes1":{
                                            "key": "loanAccount.vehicleLoanDetails.vehicleLoanIncomes",
                                            "type":"array",
                                            "add": null,
                                            "remove": null,
                                            "view": "fixed",
                                            "startEmpty": true,
                                            "titleExpr": "model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[arrayIndexes[0]].incomeType",
                                            "items": {
                                                "incomeType1":{
                                                    "key": "loanAccount.vehicleLoanDetails.vehicleLoanIncomes[].incomeType",
                                                    "title": "VEHICLE_LOAN_INCOME_TYPE",
                                                    "type": "select",
                                                    "enumCode": "vehicle_income_types"
                                                },
                                                "incomeAmount1":{
                                                    "key": "loanAccount.vehicleLoanDetails.vehicleLoanIncomes[].incomeAmount",
                                                    "title": "VEHICLE_LOAN_INCOME_AMOUNT",
                                                    "type": "amount"
                                                }
                                            }
                                        }
                                    }
                                },
                                "VehicleExpensesInformation1": {
                                    "type": "box",
                                    "title": "VEHICLE_EXPENSE",
                                    "orderNo": 320,
                                    "readonly": true,
                                    "condition": "(model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance') && model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1.toUpperCase() == 'NO'",
                                    "items": {
                                        "VehicleExpenses1" :{
                                            "key": "loanAccount.vehicleLoanDetails.vehicleLoanExpenses",
                                            "title": "VEHICLE_EXPENSE",
                                            "type": "array",
                                            "add": null,
                                            "remove": null,
                                            "view": "fixed",
                                            "startEmpty": true,
                                            "titleExpr": "model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[arrayIndexes[0]].expenseType",
                                            "items": {
                                                "expenseType1" :{
                                                    "key": "loanAccount.vehicleLoanDetails.vehicleLoanExpenses[].expenseType",
                                                    "title": "VEHICLE_EXPENSE_TYPE",
                                                    "type": "select",
                                                    "enumCode": "vehicle_expense_types"
                                                },
                                                "expenseAmount1" :{
                                                    "key": "loanAccount.vehicleLoanDetails.vehicleLoanExpenses[].expenseAmount",
                                                    "type": "amount",
                                                    "title": "VEHICLE_EXPENSE_AMOUNT"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;

                    p1.then(function(repo) {
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
                    }, function(err){
                        console.log(err);
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
                "post_pages_initialize": function(bundleModel){
                    $log.info("Inside post_page_initialize");
                    BundleManager.broadcastEvent('origination-stage', 'Screening');
                    Queries.getVehicleDetails()
                        .then(function (response) {
                            model.vehicleDetails = responseobj.results;
                        });
                },
                eventListeners: {
                    "lead-loaded": function(bundleModel, model, obj) {
                        model.lead = obj;
                        model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                        model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                        model.loanAccount.loanPurpose2 = obj.loanPurpose2;
                        model.loanAccount.screeningDate = obj.screeningDate || moment().format("YYYY-MM-DD");
                    },
                    "get-vehicle-details": function(bundleModel, model, obj) {
                        $log.info(obj);
                        model.vehicleDetails = obj.results;
                    }
                },
                form: [],
                schema: function() {
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {
                    // preSave: function(model, form, formName) {
                    //     var deferred = $q.defer();
                    //     if (model.customer.firstName) {
                    //         deferred.resolve();
                    //     } else {
                    //         irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                    //         deferred.reject();
                    //     }
                    //     return deferred.promise;
                    // },

                    save: function(model, formCtrl, form, $event){
                        /* Loan SAVE */
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
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
                }
            };

        }
    }
});
