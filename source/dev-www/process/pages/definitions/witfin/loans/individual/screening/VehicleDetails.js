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

                            ],
                            "overrides": {

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
                    "VehicleExpensesInformation",
                    "VehicleExpensesInformation.VehicleExpenses",
                    "VehicleExpensesInformation.VehicleExpenses.expenseType",
                    "VehicleExpensesInformation.VehicleExpenses.expenseAmount",
                    "NewVehicleDetails",
                    "NewVehicleDetails.vehicleType",
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
                    "VehicleViability.grossVehicleWeight",
                    "VehicleViability.payLoad",
                    "VehicleViability.typeofLoad",
                    "VehicleViability.ratePerTrip",
                    "VehicleViability.mileage",
                    "VehicleViability.noOfTyres",
                    "VehicleViability.costOfTyre",
                    "VehicleViability.lifeOfTyre",
                    "VehicleViability.fuelConsumptionPerHour",
                    "VehicleViability.validation",
                    "VehicleViability.freeCashFlow",
                    "VehicleViability.fcfToEmi",
                    "VehicleViability.totalMonthlyExpense",
                    "VehicleViability.calculateVehicleDetails",
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
                    "VehicleViability1.calculateVehicleDetails1",
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
                    "VehicleAssetUse.dailyWorkingHours",
                    "VehicleAssetUse.monthlyWorkingDays",
                    "VehicleAssetUse.hourlyRate",
                    "VehicleRouteDetails",
                    "VehicleRouteDetails.vehicleRouteDetails",
                    "VehicleRouteDetails.vehicleRouteDetails.routeFrom",
                    "VehicleRouteDetails.vehicleRouteDetails.routeTo",
                    "VehicleRouteDetails.vehicleRouteDetails.routeVia",
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
                    "actionbox",
                    "actionbox.save"
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

                    self = this;
                    var formRequest = {
                        "overrides": {
                            "VehiclePhotoCaptures": {
                                "condition": "model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance'"
                            },
                            "VehicleViability1": {
                                "orderNo": 999
                            },
                            "VehicleViability":{
                                "orderNo": 999
                            },
                            "vehicleLoanDocuments.vehicleLoanDocuments": {
                                "view": "fixed",
                                "titleExpr": "model.loanAccount.vehicleLoanDetails.vehicleLoanDocuments[arrayIndexes[0]].docType",
                                "add": null,
                                "remove": null
                            },
                            "vehicleLoanDocuments.vehicleLoanDocuments.docType": {
                                "required": true
                            },
                            "vehicleLoanDocuments.vehicleLoanDocuments.fileId": {
                                "required": true
                            },
                            "VehicleRouteDetails": {
                                "condition": "model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance'"
                            },
                            "VehicleRouteDetails.vehicleRouteDetails.routeFrom": {
                                "required": true
                            },
                            "VehicleRouteDetails.vehicleRouteDetails.routeTo": {
                                "required": true
                            },
                            "VehicleAssetUse": {
                                "condition": "model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance'"
                            },
                            "NewVehicleDetails": {
                                "condition": "model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle' || model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanAccount.loanPurpose1 == 'Refinance'"
                            },
                            "NewVehicleDetails.permitType": {
                                "type": "select",
                                "enumCode": "permit_type",
                                "title": "PERMIT_TYPE"
                            },
                            "NewVehicleDetails.vehicleType": {
                                "orderNo": 10,
                                "enumCode": "new_vehicle_category",
                                "required": true
                            },
                            "NewVehicleDetails.endUse": {
                                "orderNo": 20,
                                "required": true
                            },
                            "NewVehicleDetails.usedFor": {
                                "orderNo": 30,
                                "required": true
                            },
                            "NewVehicleDetails.segment": {
                                "orderNo": 40,
                                "enumCode": "vehicle_segment",
                                onChange: function(modelValue, form, model) {
                                    model.loanAccount.vehicleLoanDetails.category = null;
                                    model.loanAccount.vehicleLoanDetails.make = null;
                                    model.loanAccount.vehicleLoanDetails.make1 = null;
                                    model.loanAccount.vehicleLoanDetails.vehicleModel = null;
                                    model.loanAccount.vehicleLoanDetails.price = null;
                                },
                                "required": true
                            },
                            "NewVehicleDetails.category": {
                                "orderNo": 50,
                                "key": "loanAccount.vehicleLoanDetails.category",
                                "type": "lov",
                                "autolov": true,
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
                                "orderNo": 70,
                                "key": "loanAccount.vehicleLoanDetails.vehicleModel",
                                "type": "lov",
                                "autolov": true,
                                "lovonly": true,
                                "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'NO'",
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var vehicleDetails = model.vehicleDetails;
                                    var out = [];
                                    var res = $filter('filter')(vehicleDetails, {
                                        'segment': model.loanAccount.vehicleLoanDetails.segment,
                                        'category': model.loanAccount.vehicleLoanDetails.category,
                                        'manufacturer': model.loanAccount.vehicleLoanDetails.make
                                    }, true);
                                    out = _.uniqBy(res, 'model');
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.loanAccount.vehicleLoanDetails.vehicleModel = valueObj.model;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.model
                                    ];
                                },
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
                            }
                        },
                        "includes": getIncludes (model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "NewVehicleDetails": {
                                    "items": {
                                        "udf1": {
                                            "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1",
                                            "title": "MODEL_NOT_LISTED",
                                            "enumCode": "decisionmaker",
                                            "type": "radios",
                                            "orderNo": 75,
                                            onChange: function(modelValue, form, model) {
                                                if(model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES') {
                                                    model.loanAccount.vehicleLoanDetails.viabilityCategory = "Non-Standard Asset";
                                                }
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
                                            "orderNo": 90,
                                            "key": "loanAccount.vehicleLoanDetails.insuredDeclaredValue",
                                            "title": "INSURED_DECLARED_VALUE"
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
                                           "readonly": "true"
                                        },
                                        "payLoad": {
                                           "key": "loanAccount.vehicleLoanDetails.payLoad",
                                           "title": "PAYLOAD",
                                           "type": "number",
                                           "readonly": "true"
                                        },
                                        "typeofLoad": {
                                           "key": "loanAccount.vehicleLoanDetails.typeofLoad",
                                           "title": "TYPE_OF_LOAD",
                                           "readonly": "true"
                                        },
                                        "ratePerTrip": {
                                           "key": "loanAccount.vehicleLoanDetails.ratePerTrip",
                                           "title": "RATE_PER_TRIP",
                                           "type": "number",
                                           "readonly": "true"
                                        },
                                        "mileage": {
                                           "key": "loanAccount.vehicleLoanDetails.mileage",
                                           "title": "MILEAGE",
                                           "type": "number",
                                           "readonly": "true"
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
                                            "readonly": "true"
                                        },
                                        "validation": {
                                            "key": "loanAccount.vehicleLoanDetails.validation",
                                            "title": "VALIDATION",
                                            "type": "string",
                                            "readonly": "true"
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
                                        },
                                        "calculateVehicleDetails": {
                                            "type": "button",
                                            "title": "CALCULATE_VEHICLE_DETAILS",
                                            onClick: function(model, formCtrl) { 
                                            console.log(model);

                                            for (var i=0;i<model.vehicleDetails.length;i++) {
                                                var vehicleDetail = model.vehicleDetails[i];
                                                    if (vehicleDetail.model == model.loanAccount.vehicleLoanDetails.vehicleModel) {

                                                           // Adding dummy fields for showing calculated values
                                                            var calculateFields = {
                                                                "validation": null,
                                                                "totalMonthlyExpense": null,
                                                                "freeCashFlow": null,
                                                                "fcfToEmi": null,
                                                                "emi": null,                                                         
                                                                "monthlyWorkingHours" : null
                                                            };
                                                            _.assign(model.loanAccount.vehicleLoanDetails, calculateFields);

                                                            var calculateFieldsForRoute = {
                                                                "kmPerMonth": null
                                                            };
                                                            _.assign(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0], calculateFieldsForRoute);


                                                            model.loanAccount.vehicleLoanDetails.vehicleModel = vehicleDetail.model;
                                                            model.loanAccount.vehicleLoanDetails.price = null;
                                                            model.loanAccount.vehicleLoanDetails.viabilityCategory = vehicleDetail.viability_category;
                                                            model.loanAccount.vehicleLoanDetails.grossVehicleWeight = vehicleDetail.gvw;
                                                            model.loanAccount.vehicleLoanDetails.payLoad = vehicleDetail.payload;
                                                            model.loanAccount.vehicleLoanDetails.typeofLoad = vehicleDetail.type_of_load;
                                                            model.loanAccount.vehicleLoanDetails.ratePerTrip = vehicleDetail.rate_per_trip;
                                                            model.loanAccount.vehicleLoanDetails.mileage = vehicleDetail.mileage;
                                                            model.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour = vehicleDetail.fuel_consumption;
                                                            model.loanAccount.vehicleLoanDetails.noOfTyres = vehicleDetail.no_of_tyres;
                                                            model.loanAccount.vehicleLoanDetails.costOfTyre = vehicleDetail.cost_of_tyre;
                                                            model.loanAccount.vehicleLoanDetails.lifeOfTyre = vehicleDetail.life_of_tyre;
                                                            
                                                            // vehicle Expense Details
                                                            if (model.loanAccount && model.loanAccount.vehicleLoanDetails && model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses && _.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses)) {
                                                                    model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses = [];
                                                                    model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.push(
                                                                        {
                                                                            'expenseType': "Fuel Cost per month",
                                                                            'expenseAmount': null
                                                                        },
                                                                        {
                                                                            'expenseType': "Tyre Cost per month",
                                                                            'expenseAmount': null
                                                                        },
                                                                        {
                                                                            'expenseType': "Lubricant Cost",
                                                                            'expenseAmount': null
                                                                        },
                                                                        {
                                                                            'expenseType': "Driver\'s Salary",
                                                                            'expenseAmount': vehicleDetail.driver_salary
                                                                        },
                                                                        {
                                                                            'expenseType': "Cleaner\'s Salary",
                                                                            'expenseAmount': vehicleDetail.cleaner_salary
                                                                        },
                                                                        {
                                                                            'expenseType': "Permit Cost",
                                                                            'expenseAmount': vehicleDetail.permit_cost
                                                                        },
                                                                        {
                                                                            'expenseType': "Taxes",
                                                                            'expenseAmount': vehicleDetail.taxes
                                                                        },
                                                                        {
                                                                            'expenseType': "Maintenance",
                                                                            'expenseAmount': vehicleDetail.maintenance
                                                                        },
                                                                        {
                                                                            'expenseType': "Insurance",
                                                                            'expenseAmount': vehicleDetail.insurance
                                                                        },
                                                                        {
                                                                            'expenseType': "Miscellaneous",
                                                                            'expenseAmount': vehicleDetail.miscellaneous_expense
                                                                        }
                                                                    );      
                                                                }

                                                        // Calculation for Km per month
                                                        if(_.isArray(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms && model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) {
                                                            model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth = model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms * model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips;
                                                        } else {
                                                            PageHelper.setError({message: "Please fill all details required for km per month"});
                                                            return false;
                                                        }

                                                        // Calculation for Fuel_Cost_per_month
                                                        if (vehicleDetail.calculation_method && vehicleDetail.calculation_method == "DISTANCE") {
                                                            if (vehicleDetail.fuel_cost && model.loanAccount.vehicleLoanDetails.mileage && _.isArray(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth)
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[0].expenseAmount = parseFloat(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth) * parseFloat(vehicleDetail.fuel_cost) / parseFloat(model.loanAccount.vehicleLoanDetails.mileage);
                                                            else {
                                                                PageHelper.setError({message: "Please fill all details required for fuel cost per month field"});
                                                                return false;
                                                            }                               
                                                        } else if (vehicleDetail.calculation_method == "TIME") {
                                                            if (model.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour && model.loanAccount.vehicleLoanDetails.monthlyWorkingDays && vehicleDetail.fuel_cost && _.isArray(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth)
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[0].expenseAmount = parseFloat(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth) * parseFloat(model.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour) * parseFloat(model.loanAccount.vehicleLoanDetails.monthlyWorkingDays) * parseFloat(vehicleDetail.fuel_cost);
                                                            else {
                                                                PageHelper.setError({message: "Please fill the fields required for fuel cost per month"});
                                                                return false;
                                                            }
                                                        }


                                                        // Calculation for Tyre_Cost_per_month
                                                        if(vehicleDetail.calculation_method && vehicleDetail.calculation_method == "DISTANCE") {
                                                            if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth && model.loanAccount.vehicleLoanDetails.noOfTyres && model.loanAccount.vehicleLoanDetails.costOfTyre && model.loanAccount.vehicleLoanDetails.lifeOfTyre)
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[1].expenseAmount = parseFloat(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth * model.loanAccount.vehicleLoanDetails.noOfTyres * model.loanAccount.vehicleLoanDetails.costOfTyre)/parseFloat(model.loanAccount.vehicleLoanDetails.lifeOfTyre);
                                                            else{
                                                                PageHelper.setError({message: "Please fill the fields required for fuel cost per month"});
                                                                return false;
                                                            }
                                                        } else {
                                                             model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[1].expenseAmount = 0;
                                                        }

                                                        // Calculation for lubricant
                                                        if(_.isArray(model.vehicleDetails) && vehicleDetail.calculation_method && vehicleDetail.calculation_method == "TIME") {
                                                            model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[2].expenseAmount = parseFloat(model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[0].expenseAmount * 0.1);
                                                        } else {
                                                            model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[2].expenseAmount = 0;
                                                        }


                                                        // Calculation for Monthly Working Hours
                                                        if (vehicleDetail.calculation_method == 'TIME'){
                                                            if(model.loanAccount.vehicleLoanDetails.dailyWorkingHours && model.loanAccount.vehicleLoanDetails.monthlyWorkingDays) {
                                                                model.loanAccount.vehicleLoanDetails.monthlyWorkingHours = parseFloat(model.loanAccount.vehicleLoanDetails.dailyWorkingHours * model.loanAccount.vehicleLoanDetails.monthlyWorkingDays);
                                                            } else {
                                                                PageHelper.setError({message: "Please fill fields, No of Hours running per day and No of days running per month"});
                                                                return false;
                                                            }
                                                        }


                                                        // Vehicle Income Details
                                                         if (vehicleDetail.calculation_method == 'DISTANCE') {
                                                            let incomeAmount = model.loanAccount.vehicleLoanDetails.ratePerTrip * model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips;
                                                            if (model.loanAccount && model.loanAccount.vehicleLoanDetails && model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes && _.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes)) {
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes = [];   
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes.push({
                                                                    'incomeType': 'Total Monthly Revenue',
                                                                    'incomeAmount': incomeAmount
                                                                });
                                                            };
                                                         } else if (vehicleDetail.calculation_method == 'TIME'){
                                                            let incomeAmount = model.loanAccount.vehicleLoanDetails.monthlyWorkingHours * model.loanAccount.vehicleLoanDetails.hourlyRate;
                                                            if (model.loanAccount && model.loanAccount.vehicleLoanDetails && model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes && _.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes)) {
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes = [];   
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes.push({
                                                                    'incomeType': 'Total Monthly Revenue',
                                                                    'incomeAmount': incomeAmount
                                                                });
                                                            };
                                                         }



                                                         // Calculation for validation
                                                         if (vehicleDetail.calculation_method == "DISTANCE") {
                                                            if (model.loanAccount.vehicleLoanDetails.ratePerTrip && _.isArray(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) {
                                                                if (parseFloat(model.loanAccount.vehicleLoanDetails.ratePerTrip) * parseFloat(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) > model.loanAccount.vehicleLoanDetails.payload) {
                                                                    model.loanAccount.vehicleLoanDetails.validation = "ERROR";
                                                                } else {
                                                                    model.loanAccount.vehicleLoanDetails.validation = "OK";
                                                                }    
                                                            } else {
                                                                PageHelper.setError({message: "Please fill the fields required for ratePerTrip"});
                                                                return false;
                                                            }     
                                                         }


                                                         // calculation for totalMonthlyExpense
                                                         if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses)) {
                                                             var sum = 0;   
                                                             for (i=0; i<model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.length; i++) {
                                                                var vehicleLoanExpense = model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[i];
                                                                sum = sum + vehicleLoanExpense.expenseAmount;
                                                             }
                                                             model.loanAccount.vehicleLoanDetails.totalMonthlyExpense = parseFloat(sum);
                                                         } else {
                                                            PageHelper.setError({message: "Please fill the fields required for ratePerTrip"});
                                                            return false;                                                            
                                                         }


                                                         // Calculation for free cash flow
                                                         if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes) && model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount && model.loanAccount.vehicleLoanDetails.totalMonthlyExpense)
                                                            model.loanAccount.vehicleLoanDetails.freeCashFlow = parseFloat(model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount - model.loanAccount.vehicleLoanDetails.totalMonthlyExpense);
                                                         else {
                                                            PageHelper.setError({message: "Please fill the fields required for freeCashFlow"});
                                                            return false;                                                              
                                                         }


                                                         // Calculation for fcfToEmi
                                                         if (model.loanAccount.vehicleLoanDetails.freeCashFlow && model.loanAccount.estimatedEmi)
                                                             model.loanAccount.vehicleLoanDetails.fcfToEmi = parseFloat(model.loanAccount.vehicleLoanDetails.freeCashFlow / parseFloat(model.loanAccount.estimatedEmi));
                                                         else {
                                                            PageHelper.setError({message: "Please fill the fields required for fcfToEmi"});
                                                            return false;                                                                                                                          
                                                         }
                                                            
                                                        break;

                                                    }

                                                }
                                            }      
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
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "payLoad1": {
                                           "key": "loanAccount.vehicleLoanDetails.payLoad",
                                           "title": "PAYLOAD",
                                           "type": "number",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "typeofLoad1": {
                                           "key": "loanAccount.vehicleLoanDetails.typeofLoad",
                                           "title": "TYPE_OF_LOAD",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'",
                                        },
                                        "ratePerTrip1": {
                                           "key": "loanAccount.vehicleLoanDetails.ratePerTrip",
                                           "title": "RATE_PER_TRIP",
                                           "type": "number",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "mileage1": {
                                           "key": "loanAccount.vehicleLoanDetails.mileage",
                                           "title": "MILEAGE",
                                           "type": "number",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "noOfTyres1": {
                                           "key": "loanAccount.vehicleLoanDetails.noOfTyres",
                                           "title": "NO_OF_TYRES",
                                           "type": "number",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "costOfTyre1": {
                                           "key": "loanAccount.vehicleLoanDetails.costOfTyre",
                                           "title": "COST_OF_TYRE",
                                           "type": "number",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "lifeOfTyre1": {
                                           "key": "loanAccount.vehicleLoanDetails.lifeOfTyre",
                                           "title": "LIFE_OF_TYRE",
                                           "type": "number",
                                           "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "fuelConsumptionPerHour1": {
                                            "key": "loanAccount.vehicleLoanDetails.fuelConsumptionPerHour",
                                            "title": "FUEL_CONSUMPTION_PER_HOUR",
                                            "type": "number",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "validation1": {
                                            "key": "loanAccount.vehicleLoanDetails.validation",
                                            "title": "VALIDATION",
                                            "type": "string",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "totalMonthlyExpense1": {
                                            "key": "loanAccount.vehicleLoanDetails.totalMonthlyExpense",
                                            "title": "TOTAL_MONTHLY_EXPENSE",
                                            "type": "number",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "freeCashFlow1": {
                                            "key": "loanAccount.vehicleLoanDetails.freeCashFlow",
                                            "title": "FREE_CASH_FLOW",
                                            "type": "number",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "fcfToEmi1": {
                                            "key": "loanAccount.vehicleLoanDetails.fcfToEmi",
                                            "title": "FCF_TO_EMI",
                                            "type": "number",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'"
                                        },
                                        "calculateVehicleDetails1": {
                                            "type": "button",
                                            "title": "CALCULATE_VEHICLE_DETAILS",
                                            "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf1 == 'YES'",
                                            onClick: function(model, formCtrl) { 
                                            console.log(model);

                                            for (var i=0;i<model.vehicleDetails.length;i++) {
                                                var vehicleDetail = model.vehicleDetails[i];
                                                    if (vehicleDetail.model == model.loanAccount.vehicleLoanDetails.vehicleModel) {

                                                           // Adding dummy fields for showing calculated values
                                                            var calculateFields = {
                                                                "validation": null,
                                                                "totalMonthlyExpense": null,
                                                                "freeCashFlow": null,
                                                                "fcfToEmi": null,
                                                                "emi": null,                                                         
                                                                "monthlyWorkingHours" : null
                                                            };
                                                            _.assign(model.loanAccount.vehicleLoanDetails, calculateFields);

                                                            var calculateFieldsForRoute = {
                                                                "kmPerMonth": null
                                                            };
                                                            _.assign(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0], calculateFieldsForRoute);


                                                            model.loanAccount.vehicleLoanDetails.vehicleModel = vehicleDetail.model;
                                                            model.loanAccount.vehicleLoanDetails.price = null;
                                                            model.loanAccount.vehicleLoanDetails.viabilityCategory = vehicleDetail.viability_category;
                                                            model.loanAccount.vehicleLoanDetails.grossVehicleWeight = vehicleDetail.gvw;
                                                            model.loanAccount.vehicleLoanDetails.payLoad = vehicleDetail.payload;
                                                            model.loanAccount.vehicleLoanDetails.typeofLoad = vehicleDetail.type_of_load;
                                                            model.loanAccount.vehicleLoanDetails.ratePerTrip = vehicleDetail.rate_per_trip;
                                                            model.loanAccount.vehicleLoanDetails.mileage = vehicleDetail.mileage;
                                                            model.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour = vehicleDetail.fuel_consumption;
                                                            model.loanAccount.vehicleLoanDetails.noOfTyres = vehicleDetail.no_of_tyres;
                                                            model.loanAccount.vehicleLoanDetails.costOfTyre = vehicleDetail.cost_of_tyre;
                                                            model.loanAccount.vehicleLoanDetails.lifeOfTyre = vehicleDetail.life_of_tyre;
                                                            
                                                            // vehicle Expense Details
                                                            if (model.loanAccount && model.loanAccount.vehicleLoanDetails && model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses && _.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses)) {
                                                                    model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses = [];
                                                                    model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.push(
                                                                        {
                                                                            'expenseType': "Fuel Cost per month",
                                                                            'expenseAmount': null
                                                                        },
                                                                        {
                                                                            'expenseType': "Tyre Cost per month",
                                                                            'expenseAmount': null
                                                                        },
                                                                        {
                                                                            'expenseType': "Lubricant Cost",
                                                                            'expenseAmount': null
                                                                        },
                                                                        {
                                                                            'expenseType': "Driver\'s Salary",
                                                                            'expenseAmount': vehicleDetail.driver_salary
                                                                        },
                                                                        {
                                                                            'expenseType': "Cleaner\'s Salary",
                                                                            'expenseAmount': vehicleDetail.cleaner_salary
                                                                        },
                                                                        {
                                                                            'expenseType': "Permit Cost",
                                                                            'expenseAmount': vehicleDetail.permit_cost
                                                                        },
                                                                        {
                                                                            'expenseType': "Taxes",
                                                                            'expenseAmount': vehicleDetail.taxes
                                                                        },
                                                                        {
                                                                            'expenseType': "Maintenance",
                                                                            'expenseAmount': vehicleDetail.maintenance
                                                                        },
                                                                        {
                                                                            'expenseType': "Insurance",
                                                                            'expenseAmount': vehicleDetail.insurance
                                                                        },
                                                                        {
                                                                            'expenseType': "Miscellaneous",
                                                                            'expenseAmount': vehicleDetail.miscellaneous_expense
                                                                        }
                                                                    );      
                                                                }

                                                        // Calculation for Km per month
                                                        if(_.isArray(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms && model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) {
                                                            model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth = model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].routesKms * model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips;
                                                        } else {
                                                            PageHelper.setError({message: "Please fill all details required for km per month"});
                                                            return false;
                                                        }

                                                        // Calculation for Fuel_Cost_per_month
                                                        if (vehicleDetail.calculation_method && vehicleDetail.calculation_method == "DISTANCE") {
                                                            if (vehicleDetail.fuel_cost && model.loanAccount.vehicleLoanDetails.mileage && _.isArray(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth)
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[0].expenseAmount = parseFloat(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth) * parseFloat(vehicleDetail.fuel_cost) / parseFloat(model.loanAccount.vehicleLoanDetails.mileage);
                                                            else {
                                                                PageHelper.setError({message: "Please fill all details required for fuel cost per month field"});
                                                                return false;
                                                            }                               
                                                        } else if (vehicleDetail.calculation_method == "TIME") {
                                                            if (model.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour && model.loanAccount.vehicleLoanDetails.monthlyWorkingDays && vehicleDetail.fuel_cost && _.isArray(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth)
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[0].expenseAmount = parseFloat(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth) * parseFloat(model.loanAccount.vehicleLoanDetails.fuelConsumptionPerHour) * parseFloat(model.loanAccount.vehicleLoanDetails.monthlyWorkingDays) * parseFloat(vehicleDetail.fuel_cost);
                                                            else {
                                                                PageHelper.setError({message: "Please fill the fields required for fuel cost per month"});
                                                                return false;
                                                            }
                                                        }


                                                        // Calculation for Tyre_Cost_per_month
                                                        if(vehicleDetail.calculation_method && vehicleDetail.calculation_method == "DISTANCE") {
                                                            if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth && model.loanAccount.vehicleLoanDetails.noOfTyres && model.loanAccount.vehicleLoanDetails.costOfTyre && model.loanAccount.vehicleLoanDetails.lifeOfTyre)
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[1].expenseAmount = parseFloat(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].kmPerMonth * model.loanAccount.vehicleLoanDetails.noOfTyres * model.loanAccount.vehicleLoanDetails.costOfTyre)/parseFloat(model.loanAccount.vehicleLoanDetails.lifeOfTyre);
                                                            else{
                                                                PageHelper.setError({message: "Please fill the fields required for fuel cost per month"});
                                                                return false;
                                                            }
                                                        } else {
                                                             model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[1].expenseAmount = 0;
                                                        }

                                                        // Calculation for lubricant
                                                        if(_.isArray(model.vehicleDetails) && vehicleDetail.calculation_method && vehicleDetail.calculation_method == "TIME") {
                                                            model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[2].expenseAmount = parseFloat(model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[0].expenseAmount * 0.1);
                                                        } else {
                                                            model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[2].expenseAmount = 0;
                                                        }


                                                        // Calculation for Monthly Working Hours
                                                        if (vehicleDetail.calculation_method == 'TIME'){
                                                            if(model.loanAccount.vehicleLoanDetails.dailyWorkingHours && model.loanAccount.vehicleLoanDetails.monthlyWorkingDays) {
                                                                model.loanAccount.vehicleLoanDetails.monthlyWorkingHours = parseFloat(model.loanAccount.vehicleLoanDetails.dailyWorkingHours * model.loanAccount.vehicleLoanDetails.monthlyWorkingDays);
                                                            } else {
                                                                PageHelper.setError({message: "Please fill fields, No of Hours running per day and No of days running per month"});
                                                                return false;
                                                            }
                                                        }


                                                        // Vehicle Income Details
                                                         if (vehicleDetail.calculation_method == 'DISTANCE') {
                                                            let incomeAmount = model.loanAccount.vehicleLoanDetails.ratePerTrip * model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips;
                                                            if (model.loanAccount && model.loanAccount.vehicleLoanDetails && model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes && _.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes)) {
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes = [];   
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes.push({
                                                                    'incomeType': 'Total Monthly Revenue',
                                                                    'incomeAmount': incomeAmount
                                                                });
                                                            };
                                                         } else if (vehicleDetail.calculation_method == 'TIME'){
                                                            let incomeAmount = model.loanAccount.vehicleLoanDetails.monthlyWorkingHours * model.loanAccount.vehicleLoanDetails.hourlyRate;
                                                            if (model.loanAccount && model.loanAccount.vehicleLoanDetails && model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes && _.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes)) {
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes = [];   
                                                                model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes.push({
                                                                    'incomeType': 'Total Monthly Revenue',
                                                                    'incomeAmount': incomeAmount
                                                                });
                                                            };
                                                         }



                                                         // Calculation for validation
                                                         if (vehicleDetail.calculation_method == "DISTANCE") {
                                                            if (model.loanAccount.vehicleLoanDetails.ratePerTrip && _.isArray(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails) && model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) {
                                                                if (parseFloat(model.loanAccount.vehicleLoanDetails.ratePerTrip) * parseFloat(model.loanAccount.vehicleLoanDetails.vehicleRouteDetails[0].trips) > model.loanAccount.vehicleLoanDetails.payload) {
                                                                    model.loanAccount.vehicleLoanDetails.validation = "ERROR";
                                                                } else {
                                                                    model.loanAccount.vehicleLoanDetails.validation = "OK";
                                                                }    
                                                            } else {
                                                                PageHelper.setError({message: "Please fill the fields required for ratePerTrip"});
                                                                return false;
                                                            }     
                                                         }


                                                         // calculation for totalMonthlyExpense
                                                         if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses)) {
                                                             var sum = 0;   
                                                             for (i=0; i<model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses.length; i++) {
                                                                var vehicleLoanExpense = model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[i];
                                                                sum = sum + vehicleLoanExpense.expenseAmount;
                                                             }
                                                             model.loanAccount.vehicleLoanDetails.totalMonthlyExpense = parseFloat(sum);
                                                         } else {
                                                            PageHelper.setError({message: "Please fill the fields required for ratePerTrip"});
                                                            return false;                                                            
                                                         }


                                                         // Calculation for free cash flow
                                                         if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes) && model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount && model.loanAccount.vehicleLoanDetails.totalMonthlyExpense)
                                                            model.loanAccount.vehicleLoanDetails.freeCashFlow = parseFloat(model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0].incomeAmount - model.loanAccount.vehicleLoanDetails.totalMonthlyExpense);
                                                         else {
                                                            PageHelper.setError({message: "Please fill the fields required for freeCashFlow"});
                                                            return false;                                                              
                                                         }


                                                         // Calculation for fcfToEmi
                                                         if (model.loanAccount.vehicleLoanDetails.freeCashFlow && model.loanAccount.estimatedEmi)
                                                             model.loanAccount.vehicleLoanDetails.fcfToEmi = parseFloat(model.loanAccount.vehicleLoanDetails.freeCashFlow / parseFloat(model.loanAccount.estimatedEmi));
                                                         else {
                                                            PageHelper.setError({message: "Please fill the fields required for fcfToEmi"});
                                                            return false;                                                                                                                          
                                                         }
                                                            
                                                        break;

                                                    }

                                                }
                                            }      
                                        }
                                    }
                                },
                                "VehicleAssetUse": {
                                    "items": {
                                        "dailyWorkingHours": {
                                            "key":  "loanAccount.vehicleLoanDetails.dailyWorkingHours",
                                            "title": "NO_OF_HOURS_RUNNING_PER_DAY",
                                            "type": "number"
                                        },
                                        "monthlyWorkingDays": {
                                            "key": "loanAccount.vehicleLoanDetails.monthlyWorkingDays",
                                            "title": "NO_OF_DAYS_WORKING_PER_MONTH",
                                            "type": "number"
                                        },
                                        "hourlyRate": {
                                            "key": "loanAccount.vehicleLoanDetails.hourlyRate",
                                            "title": "HIRING_RATE_PER_HOUR",
                                            "type": "number"
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
                        // if (!model.loanAccount.id){
                        //     model.loanAccount.isRestructure = false;
                        //     model.loanAccount.documentTracking = "PENDING";
                        //     model.loanAccount.psychometricCompleted = "NO";

                        // }
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
                    // sendBack: function(model, formCtrl, form, $event){
                    //     PageHelper.showLoader();
                    //     model.loanProcess.sendBack()
                    //         .finally(function () {
                    //             PageHelper.hideLoader();
                    //         })
                    //         .subscribe(function (value) {

                    //             PageHelper.showProgress('enrolment', 'Done.', 5000);
                    //             irfNavigator.goBack();
                    //         }, function (err) {
                    //             PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                    //             PageHelper.showErrors(err);
                    //             PageHelper.hideLoader();
                    //         });

                    // },
                    // proceed: function(model, formCtrl, form, $event){
                    //     if(PageHelper.isFormInvalid(formCtrl)) {
                    //         return false;
                    //     }
                    //     PageHelper.clearErrors();
                    //     PageHelper.showLoader();
                    //     PageHelper.showProgress('enrolment', 'Updating Loan');
                    //     model.loanProcess.proceed()
                    //         .finally(function () {
                    //             PageHelper.hideLoader();
                    //         })
                    //         .subscribe(function (value) {

                    //             Utils.removeNulls(value, true);
                    //             PageHelper.showProgress('enrolment', 'Done.', 5000);
                    //             irfNavigator.goBack();
                    //         }, function (err) {
                    //             PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                    //             PageHelper.showErrors(err);
                    //             PageHelper.hideLoader();
                    //         });
                    // },
                    // reject: function(model, formCtrl, form, $event){
                    //     PageHelper.showLoader();
                    //      model.loanProcess.reject()
                    //         .finally(function () {
                    //             PageHelper.hideLoader();
                    //         })
                    //         .subscribe(function (value) {
                    //             Utils.removeNulls(value, true);
                    //             PageHelper.showProgress('enrolment', 'Done.', 5000);
                    //             irfNavigator.goBack();
                    //         }, function (err) {
                    //             PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                    //             PageHelper.showErrors(err);
                    //             PageHelper.hideLoader();
                    //         });
                    // }
                }
            };

        }
    }
});
