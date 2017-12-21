define({
    pageUID: "loans.individual.luc.LucData",
    pageType: "Engine",
    dependencies: ["$log", "$state", "$stateParams", "LUC", "Enrollment", "IndividualLoan", "LucHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"],
    $pageFn: function($log, $state, $stateParams, LUC, Enrollment, IndividualLoan, LucHelper, SessionStore, formHelper, $q, irfProgressMessage,
                      PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

        var branch = SessionStore.getBranch();

        var validateDate = function(req) {
            if (req.loanMonitoringDetails && req.loanMonitoringDetails.lucRescheduledDate) {
                var today = moment(new Date()).format("YYYY-MM-DD");
                if (req.loanMonitoringDetails.lucRescheduledDate <= today) {
                    $log.info("bad night");
                    PageHelper.showProgress('validate-error', 'Rescheduled Date: Rescheduled Date must be a Future Date', 5000);
                    return false;
                }
            }
            return true;
        }

        var orderLUCDocuments = function(model) {

            var lucDocuments = model.loanMonitoringDetails.loanMonitoringDocuments || [];

            for (var i = 0; i < lucDocuments.length; i++) {

                lucDocuments[i]["documentSl"] = (i + 1);
            }
        }


        return {
            "type": "schema-form",
            "title": "LUC Details",
            "subTitle": "LUC",
            initialize: function(model, form, formCtrl) {


                model.lucCompleted = ($stateParams.pageData && $stateParams.pageData._lucCompleted) ? true : false;
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                model.loanMonitoringDetails = model.loanMonitoringDetails || {};
                if (!_.hasIn(model.loanMonitoringDetails, 'socialImpactDetails') || model.loanMonitoringDetails.socialImpactDetails == null) {
                    model.loanMonitoringDetails.socialImpactDetails = {};
                }
                model = Utils.removeNulls(model, true);
                $log.info("luc page got initiated");


                if (!(model && model.loanMonitoringDetails && model.loanMonitoringDetails.id && model.$$STORAGE_KEY$$)) {
                    PageHelper.showLoader();
                    PageHelper.showProgress("page-init", "Loading...");
                    var lucId = $stateParams.pageId;
                    if (!lucId) {
                        PageHelper.hideLoader();
                    }
                    var machineDetails=[];
                    LUC.get({
                            id: lucId
                        },
                        function(res) {
                            $log.info(res);
                            _.assign(model.loanMonitoringDetails, res.loanMonitoringDetails);
                            machineDetails = model.loanMonitoringDetails.machineDetails;
                            //model.loanMonitoringDetails.lucRescheduledDate = moment(model.loanMonitoringDetails.lucRescheduledDate).format("YYYY-MM-DD");
                            model.loanMonitoringDetails.lucRescheduledDate = (model.loanMonitoringDetails.lucRescheduledDate != null) ? moment(model.loanMonitoringDetails.lucRescheduledDate).format("YYYY-MM-DD") : null;
                            var loanId = res.loanMonitoringDetails.loanId;
                            model.loanMonitoringDetails.nonIntendedPurposeAmount = 0;
                            var loanresponse = IndividualLoan.get({
                                id: loanId
                            }).$promise;

                            loanresponse.then(
                                function(response) {
                                    $log.info("printing loan account");
                                    $log.info(response);
                                    var urn = response.applicant;
                                    var linkedurns = [urn];
                                    model.loanMonitoringDetails.udf1 = model.loanMonitoringDetails.udf1 || response.accountNumber;
                                    Queries.getCustomerBasicDetails({
                                        "urns": linkedurns
                                    }).then(function(result) {
                                        if (result && result.urns) {
                                            var cust = result.urns[urn]
                                            if (cust) {
                                                //model.loanMonitoringDetails.customerName = cust.first_name;
                                                model.loanMonitoringDetails.proprietoryName = cust.first_name;

                                                Enrollment.getCustomerById({
                                                    id: cust.id
                                                })
                                                    .$promise
                                                    .then(function(response2) {
                                                        $log.info("printing customer2");
                                                        $log.info(response2);

                                                        if (!_.hasIn(model.loanMonitoringDetails, 'socialImpactDetails') || model.loanMonitoringDetails.socialImpactDetails == null) {
                                                            model.loanMonitoringDetails.socialImpactDetails = {};
                                                        }

                                                        if (model.loanMonitoringDetails.currentStage == "LUCSchedule" || model.loanMonitoringDetails.currentStage == 'LUCReview') {
                                                            if (response2.familyMembers && response2.familyMembers.length) {
                                                                for (i = 0; i < response2.familyMembers.length; i++) {
                                                                    if (response2.familyMembers[i].relationShip == "self") {
                                                                        model.loanMonitoringDetails.socialImpactDetails.preLoanProprietorSalary = response2.familyMembers[i].salary;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }, function(httpRes) {
                                                        PageHelper.showErrors(httpRes);
                                                    })
                                                    .finally(function() {
                                                        PageHelper.hideLoader();
                                                    });
                                            }
                                        }
                                    });

                                    var assetvalue = 0;

                                    if ((model.loanMonitoringDetails.currentStage == "LUCSchedule") && !(model.loanMonitoringDetails.lucEscalatedReason)) {
                                        $log.info("inside sc");
                                        if (response.collateral && response.collateral.length) {
                                            $log.info("inside col");
                                            model.loanMonitoringDetails.machineDetails = [];
                                            var machineModel = {};
                                            for (i = 0; i < response.collateral.length; i++) {
                                                $log.info("inside for");
                                                var machineModel = {};
                                                var machineModel1 = {};
                                                machineModel.type = response.collateral[i].collateralType;
                                                machineModel.model = response.collateral[i].modelNo;
                                                machineModel.udf1 = response.collateral[i].machineAttachedToBuilding;
                                                machineModel.udf2 = response.collateral[i].hypothecatedToBank;
                                                machineModel.serialNumber = response.collateral[i].serialNo;
                                                machineModel.make = response.collateral[i].manufacturer;
                                                machineModel.serialNumber = response.collateral[i].serialNo;
                                                machineModel1.date = response.collateral[i].expectedPurchaseDate;
                                                assetvalue = assetvalue + response.collateral[i].collateralValue;

                                                if (response.collateral[i].machineOld == false) {
                                                    machineModel.assetType = "OLD";
                                                } else {
                                                    machineModel.assetType = "NEW";
                                                }

                                                if (machineModel1.date !== null) {
                                                    model.loanMonitoringDetails.machineDetails.push(machineModel);
                                                }
                                            }
                                        }
                                        model.loanMonitoringDetails.totalCreationAssetValue = assetvalue;
                                    }

                                    model.loanMonitoringDetails.loanPurpose = model.loanMonitoringDetails.loanPurpose || response.loanPurpose2;
                                    model.loanMonitoringDetails.loanPurposeCategory = model.loanMonitoringDetails.loanPurposeCategory || response.loanPurpose1;
                                    model.loanMonitoringDetails.loanAmount = model.loanMonitoringDetails.loanAmount || response.loanAmount;
                                    if(machineDetails)
                                    {
                                        model.loanMonitoringDetails.machineDetails = machineDetails;
                                    }
                                    

                                    var custId = response.customerId;

                                    if (custId) {
                                        Enrollment.getCustomerById({
                                            id: custId
                                        })
                                            .$promise
                                            .then(function(response1) {
                                                $log.info("printing customer");
                                                $log.info(response1);
                                                model.loanMonitoringDetails.address = model.loanMonitoringDetails.address || (response1.doorNo + " " + response1.street + " " + response1.locality);
                                                model.loanMonitoringDetails.customerName = response1.firstName;
                                                if (!_.hasIn(model.loanMonitoringDetails, 'socialImpactDetails') || model.loanMonitoringDetails.socialImpactDetails == null) {
                                                    model.loanMonitoringDetails.socialImpactDetails = {};
                                                }
                                                if (model.loanMonitoringDetails.currentStage == "LUCSchedule" || model.loanMonitoringDetails.currentStage == 'LUCReview') {
                                                    model.loanMonitoringDetails.socialImpactDetails.preLoanMonthlyNetIncome = response1.enterprise.avgMonthlyNetIncome;
                                                    model.loanMonitoringDetails.socialImpactDetails.preLoanMonthlyRevenue = response1.enterprise.monthlyTurnover;
                                                    if (response1.buyerDetails && response1.buyerDetails.length) {
                                                        model.loanMonitoringDetails.socialImpactDetails.preLoanNumberOfCustomersOrBuyers = response1.buyerDetails.length;
                                                    }
                                                }

                                            }, function(httpRes) {
                                                PageHelper.showErrors(httpRes);
                                            })
                                            .finally(function() {
                                                PageHelper.hideLoader();
                                            });
                                    }
                                },
                                function(httpRes) {
                                    PageHelper.showProgress('load-loan', 'Some error while loading the loan details', 2000);
                                    PageHelper.showErrors(httpRes);
                                }
                            );

                            PageHelper.hideLoader();
                            /*model = Utils.removeNulls(model, true);*/
                        },
                        function(error) {
                            PageHelper.showErrors(error);
                            PageHelper.hideLoader();
                            PageHelper.showProgress('Load-LUC', 'Some error while loading the loan details', 2000);
                        }
                    );
                }
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return [
                    item.loanMonitoringDetails.customerName
                ]
            },

            form: [{
                "type": "box",
                "title": "LUC",
                "items": [{
                    key: "loanMonitoringDetails.id",
                    type: "number",
                    condition: "model.loanMonitoringDetails.id",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.customerId",
                    type: "number",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.customerName",
                    type: "string",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.address",
                    type: "string",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.proprietoryName",
                    type: "string",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.loanId",
                    type: "number",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.udf1",
                    type: "string",
                    title: "ACCOUNT_NUMBER",
                    "readonly": true
                }]
            }, {
                "type": "box",
                "title": "LOAN_UTILIZATION",
                "condition": "model.loanMonitoringDetails.currentStage=='LUCReview' || model.lucCompleted",
                "items": [{
                    key: "loanMonitoringDetails.loanProductName",
                    type: "string",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.loanPurposeCategory",
                    "readonly": true,
                    title: "LOAN_PURPOSE_1",
                }, {
                    key: "loanMonitoringDetails.loanPurpose",
                    title: "LOAN_SUB_PURPOSE",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.loanAmount",
                    type: "amount",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.disbursementDate",
                    type: "date",
                    "readonly": true
                }, {
                    type: "fieldset",
                    title: "",
                    condition: "model.loanMonitoringDetails.loanPurposeCategory == 'Asset Purchase'",
                    items: [{
                        key: "loanMonitoringDetails.numberOfAssetsDelivered",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.amountUtilizedForAssetsPurchase",
                        type: "amount",
                        "readonly": true,
                        "onChange": function(modelValue, form, model) {
                            var a = ((parseFloat(model.loanMonitoringDetails.amountUtilizedForAssetsPurchase) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                            model.loanMonitoringDetails.percentage = parseInt(a.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.percentage",
                        title: "%_OF_AMOUNT_UTILISED",
                        type: "integer",
                        "readonly": true

                    }, {
                        key: "loanMonitoringDetails.totalCreationAssetValue",
                        type: "number",
                        title: "TOTAL_ASSET_VALUE",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.isAssetNotDelivered",
                        title: "ARE_ASSETS_NOT_DELIVERED",
                        type: "select",
                        enumCode: "decisionmaker1",
                        "readonly": true
                    }]
                }, {
                    key: "loanMonitoringDetails.machineDetails",
                    condition: "model.loanMonitoringDetails.loanPurposeCategory == 'Asset Purchase'",
                    type: "array",
                    //startEmpty: true,
                    //view:"fixed",
                    title: "MACHINE",
                    items: [{
                        key: "loanMonitoringDetails.machineDetails[].make",
                        type: "string",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].type",
                        type: "string",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].year",
                        type: "date",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].model",
                        type: "string",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].serialNumber",
                        type: "string",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].assetType",
                        type: "select",
                        "readonly": true,
                        titleMap: {
                            "NEW": "NEW",
                            "OLD": "OLD",
                        },
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].udf1",
                        type: "select",
                        title: "MACHINE_PERMANENTLY_FIXED_TO_BUILDING",
                        enumCode: "decisionmaker1",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].udf2",
                        type: "select",
                        title: "HYPOTHECATED_TO_KINARA",
                        enumCode: "decisionmaker1",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].hypothecationLabelBeenApplied",
                        type: "select",
                        enumCode: "decisionmaker1",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].companyNameInOriginalInvoice",
                        type: "select",
                        enumCode: "decisionmaker1",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].hypothecatedTo",
                        type: "select",
                        "readonly": true,
                        titleMap: {
                            "VHFPL": "VHFPL",
                        },
                    }]
                }, {
                    type: "fieldset",
                    title: "",
                    condition: "model.loanMonitoringDetails.loanPurposeCategory == 'Asset Purchase'",
                    items: [{
                        key: "loanMonitoringDetails.lucDone",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        condition: "!model.lucCompleted",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucDone == "Yes") {
                                model.loanMonitoringDetails.lucRescheduled = "No";
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.lucRescheduled",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                        type: "radios",
                        "readonly": true,
                        enumCode: "decisionmaker1",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucRescheduled == "Yes") {
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.udf2",
                        type: "select",
                        title: "RESCHEDULED_REMARKS",
                        "readonly": true,
                        titleMap: {
                            "Partially utilized ": "Partially utilized ",
                            "Not utilized ": "Not utilized ",
                            "Customer not available": "Customer not available",
                        },
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduleReason",
                        type: "string",
                        "readonly": true,
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduledDate",
                        type: "date",
                        "readonly": true,
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucEscalated",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.lucEscalatedReason",
                        type: "select",
                        titleMap: {
                            "Value of the machine is less than the given quotation": "Value of the machine is less than the given quotation",
                            "Mis match in the Machine type & accessories": "Mis match in the Machine type & accessories",
                            "Mis match in no of Machineries": "Mis match in no of Machineries",
                            "Non operational Machinery": "Non operational Machinery",
                            "Non delivery of Machine": "Non delivery of Machine",
                        },
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.udf3",
                        title: "ESCALATED_REMARKS",
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'"
                    }]
                }, {
                    type: "fieldset",
                    title: "",
                    condition: "model.loanMonitoringDetails.loanPurposeCategory == 'Working Capital' || model.loanMonitoringDetails.loanPurposeCategory == 'Business Development' || model.loanMonitoringDetails.loanPurposeCategory == 'Line of credit'",
                    items: [{
                        key: "loanMonitoringDetails.loanAmountUsed",
                        type: "amount",
                        "readonly": true,
                        "onChange": function(modelValue, form, model) {
                            var a = ((parseFloat(model.loanMonitoringDetails.loanAmountUsed) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                            model.loanMonitoringDetails.amountUsedPercentage = parseInt(a.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.amountUsedPercentage",
                        "readonly": true,
                        title: "%_OF_AMOUNT_UTILISED",
                        type: "integer"
                    }, {
                        key: "loanMonitoringDetails.intendedPurposeAmount",
                        type: "amount",
                        "readonly": true,
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.intendedPurposeAmount > model.loanMonitoringDetails.loanAmountUsed) {
                                model.loanMonitoringDetails.intendedPurposeAmount = model.loanMonitoringDetails.loanAmountUsed;
                            }
                            var a = ((parseFloat(model.loanMonitoringDetails.intendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                            model.loanMonitoringDetails.intendedPurposePercentage = parseInt(a.toFixed());
                            model.loanMonitoringDetails.nonIntendedPurposeAmount = model.loanMonitoringDetails.loanAmountUsed - model.loanMonitoringDetails.intendedPurposeAmount;
                            var b = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                            model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(b.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.intendedPurposePercentage",
                        title: "%_OF_AMOUNT_UTILISED_FOR_INTENDED_PURPOSE",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "integer",
                        "readonly": true,
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposeAmount",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "amount",
                        "readonly": true,
                        "onChange": function(modelValue, form, model) {
                            var a = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                            model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(a.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposePercentage",
                        title: "%_OF_AMOUNT_UTILISED_FOR_UNINTENDED_PURPOSE",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "integer",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.loanAmountPurpose",
                        title: "LOAN_AMOUNT_UTILIZED_FOR",
                        type: "select",
                        condition: "model.loanMonitoringDetails.nonIntendedPurposeAmount > 0",
                        enumCode: "luc_loan_amount_Purpose",
                        readonly: true
                    }, {
                        key: "loanMonitoringDetails.verifiedBy",
                        type: "select",
                        title: "SOURCE_OF_VERIFICATION",
                        condition: "model.loanMonitoringDetails.nonIntendedPurposeAmount > 0",
                        //condition: "model.loanMonitoringDetails.loanAmountPurpose == 'Business Purpose' ",
                        enumCode: "luc_verified_by",
                        parentEnumCode: "luc_loan_amount_Purpose",
                        parentValueExpr: "model.loanMonitoringDetails.loanAmountPurpose",
                        readonly: true
                    }, {
                        key: "loanMonitoringDetails.lucDone",
                        type: "radios",
                        title: "LUC_COMPLETED",
                        enumCode: "decisionmaker1",
                        condition: "!model.lucCompleted",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucDone == "Yes") {
                                model.loanMonitoringDetails.lucRescheduled = "No";
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.lucRescheduled",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        "readonly": true,
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucRescheduled == "Yes") {
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.udf2",
                        type: "select",
                        title: "RESCHEDULED_REMARKS",
                        titleMap: {
                            "Partially utilized ": "Partially utilized ",
                            "Not utilized ": "Not utilized ",
                            "Customer not available": "Customer not available",
                        },
                        "readonly": true,
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduleReason",
                        type: "string",
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes'&& (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.lucRescheduledDate",
                        type: "date",
                        "readonly": true,
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucEscalated",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.lucEscalatedReason",
                        type: "select",
                        titleMap: {
                            "Mis utilized": "Mis utilized",
                            "Not utilized": "Not utilized",
                            "Partially utilized": "Partially utilized",
                        },
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.udf3",
                        title: "ESCALATED_REMARKS",
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }]
                }, {
                    type: "fieldset",
                    title: "",
                    condition: "model.loanMonitoringDetails.loanPurposeCategory == 'Machine Refinance'",
                    items: [{
                        key: "loanMonitoringDetails.repayedDebitAmount",
                        type: "amount",
                        "readonly": true,
                        "onChange": function(modelValue, form, model) {
                            var a = ((parseFloat(model.loanMonitoringDetails.repayedDebitAmount) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                            model.loanMonitoringDetails.amountUsedPercentage = parseInt(a.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.monthlyInterestForDebit",
                        type: "amount",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.remainingAmountPurpose",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.remainingAmountUtilizedOn",
                        type: "date",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.amountUsedPercentage",
                        title: "%_OF_AMOUNT_UTILISED",
                        type: "integer",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.intendedPurposeAmount",
                        type: "amount",
                        "readonly": true,
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.intendedPurposeAmount > model.loanMonitoringDetails.loanAmountUsed) {
                                model.loanMonitoringDetails.intendedPurposeAmount = model.loanMonitoringDetails.loanAmountUsed;
                            }
                            var a = ((parseFloat(model.loanMonitoringDetails.intendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.repayedDebitAmount)) * 100);
                            model.loanMonitoringDetails.intendedPurposePercentage = parseInt(a.toFixed());
                            model.loanMonitoringDetails.nonIntendedPurposeAmount = model.loanMonitoringDetails.repayedDebitAmount - model.loanMonitoringDetails.intendedPurposeAmount;
                            var b = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.repayedDebitAmount)) * 100);
                            model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(b.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.intendedPurposePercentage",
                        title: "%_OF_AMOUNT_UTILISED_FOR_INTENDED_PURPOSE",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "integer",
                        "readonly": true,
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposeAmount",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "amount",
                        "readonly": true,
                        "onChange": function(modelValue, form, model) {
                            var a = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                            model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(a.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.loanAmountPurpose",
                        condition: "model.loanMonitoringDetails.nonIntendedPurposeAmount > 0",
                        type: "select",
                        enumCode: "luc_loan_amount_Purpose"

                    }, {
                        key: "loanMonitoringDetails.verifiedBy",
                        type: "select",
                        title: "SOURCE_OF_VERIFICATION",
                        condition: "model.loanMonitoringDetails.nonIntendedPurposeAmount > 0",
                        //condition: "model.loanMonitoringDetails.loanAmountPurpose == 'Business Purpose' ",
                        enumCode: "luc_verified_by",
                        parentEnumCode: "luc_loan_amount_Purpose",
                        parentValueExpr: "model.loanMonitoringDetails.loanAmountPurpose"
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposePercentage",
                        title: "%_OF_AMOUNT_UTILISED_FOR_UNINTENDED_PURPOSE",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "integer",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.lucDone",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        title: "LUC_COMPLETED",
                        condition: "!model.lucCompleted",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucDone == "Yes") {
                                model.loanMonitoringDetails.lucRescheduled = "No";
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.lucRescheduled",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        "readonly": true,
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucRescheduled == "Yes") {
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.udf2",
                        type: "select",
                        "readonly": true,
                        title: "RESCHEDULED_REMARKS",
                        titleMap: {
                            "Partially utilized ": "Partially utilized ",
                            "Not utilized ": "Not utilized ",
                            "Customer not available": "Customer not available",
                        },
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduleReason",
                        type: "string",
                        "readonly": true,
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduledDate",
                        type: "date",
                        "readonly": true,
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucEscalated",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.lucEscalatedReason",
                        type: "select",
                        titleMap: {
                            "Mis utilized": "Mis utilized",
                            "Not utilized": "Not utilized",
                            "Partially utilized": "Partially utilized",
                        },
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.udf3",
                        title: "ESCALATED_REMARKS",
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }]
                }, {
                    type: "fieldset",
                    title: "",
                    condition: "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                    items: [{
                        key: "loanMonitoringDetails.loanAmountUsed",
                        type: "amount",
                        required: true,
                        "onChange": function(modelValue, form, model) {
                            var a = ((parseFloat(model.loanMonitoringDetails.loanAmountUsed) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                            model.loanMonitoringDetails.amountUsedPercentage = parseInt(a.toFixed());
                            model.loanMonitoringDetails.loanAmountNotUsed = model.loanMonitoringDetails.loanAmount - model.loanMonitoringDetails.loanAmountUsed;
                        }
                    }, {
                        key: "loanMonitoringDetails.loanAmountPurpose",
                        type: "select",
                        required: true,
                        enumCode: "loan_purpose_1"

                    }, {
                        key: "loanMonitoringDetails.verifiedBy",
                        type: "select",
                        titleMap: {
                            "Bill ": "Bill ",
                        }
                    }, {
                        key: "loanMonitoringDetails.amountUsedPercentage",
                        "readonly": true,
                        title: "%_OF_AMOUNT_UTILISED",
                        type: "integer"
                    }, {
                        key: "loanMonitoringDetails.loanAmountNotUsed",
                        "readonly": true,
                        type: "amount"
                    }, {
                        key: "loanMonitoringDetails.intendedPurposeAmount",
                        type: "amount",
                        required: true,
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.intendedPurposeAmount > model.loanMonitoringDetails.loanAmountUsed) {
                                model.loanMonitoringDetails.intendedPurposeAmount = model.loanMonitoringDetails.loanAmountUsed;
                            }
                            var a = ((parseFloat(model.loanMonitoringDetails.intendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                            model.loanMonitoringDetails.intendedPurposePercentage = parseInt(a.toFixed());
                            model.loanMonitoringDetails.nonIntendedPurposeAmount = model.loanMonitoringDetails.loanAmountUsed - model.loanMonitoringDetails.intendedPurposeAmount;
                            var b = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                            model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(b.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.intendedPurposePercentage",
                        title: "%_OF_AMOUNT_UTILISED_FOR_INTENDED_PURPOSE",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "integer",
                        "readonly": true,
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposeAmount",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "amount",
                        readonly: true
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposePercentage",
                        title: "%_OF_AMOUNT_UTILISED_FOR_UNINTENDED_PURPOSE",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "integer",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposeAmountSpentOn",
                        required: true,
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                    }, {
                        key: "loanMonitoringDetails.udf4",
                        required: true,
                        title: "BUSINESS_RUNNING_BY",
                    }, {
                        key: "loanMonitoringDetails.udf5",
                        required: true,
                        title: "BUSINESS_CONDITION",
                    }, {
                        key: "loanMonitoringDetails.udf6",
                        required: true,
                        title: "OBSERVATION",
                    }, {
                        key: "loanMonitoringDetails.lucDone",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucDone == "Yes") {
                                model.loanMonitoringDetails.lucRescheduled = "No";
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.lucRescheduled",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucRescheduled == "Yes") {
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.udf2",
                        type: "select",
                        title: "RESCHEDULED_REMARKS",
                        titleMap: {
                            "Partially utilized ": "Partially utilized ",
                            "Not utilized ": "Not utilized ",
                            "Customer not available": "Customer not available",
                        },
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduleReason",
                        type: "string",
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes'&& (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduledDate",
                        type: "date",
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucEscalated",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.lucEscalatedReason",
                        type: "select",
                        titleMap: {
                            "Mis utilized": "Mis utilized",
                            "Not utilized": "Not utilized",
                            "Partially utilized": "Partially utilized",
                        },
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.udf3",
                        title: "ESCALATED_REMARKS",
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }]
                }, ]
            }, {
                "type": "box",
                "title": "LOAN_UTILIZATION",
                "condition": "!(model.loanMonitoringDetails.currentStage=='LUCReview' || model.lucCompleted)",
                "items": [{
                    key: "loanMonitoringDetails.loanProductName",
                    type: "string",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.loanPurposeCategory",
                    "readonly": true,
                    title: "LOAN_PURPOSE_1",
                }, {
                    key: "loanMonitoringDetails.loanPurpose",
                    title: "LOAN_SUB_PURPOSE",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.loanAmount",
                    type: "amount",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.disbursementDate",
                    type: "date",
                    "readonly": true
                }, {
                    type: "fieldset",
                    title: "",
                    condition: "model.loanMonitoringDetails.loanPurposeCategory == 'Asset Purchase'",
                    items: [{
                        key: "loanMonitoringDetails.numberOfAssetsDelivered"
                    }, {
                        key: "loanMonitoringDetails.amountUtilizedForAssetsPurchase",
                        type: "amount",
                        "onChange": function(modelValue, form, model) {
                            var a = ((parseFloat(model.loanMonitoringDetails.amountUtilizedForAssetsPurchase) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                            model.loanMonitoringDetails.percentage = parseInt(a.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.percentage",
                        title: "%_OF_AMOUNT_UTILISED",
                        type: "integer",
                        "readonly": true

                    }, {
                        key: "loanMonitoringDetails.totalCreationAssetValue",
                        type: "number",
                        title: "TOTAL_ASSET_VALUE",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.isAssetNotDelivered",
                        title: "ARE_ASSETS_NOT_DELIVERED",
                        type: "select",
                        enumCode: "decisionmaker1"
                    }]
                }, {
                    key: "loanMonitoringDetails.machineDetails",
                    condition: "model.loanMonitoringDetails.loanPurposeCategory == 'Asset Purchase'",
                    type: "array",
                    //startEmpty: true,
                    //view:"fixed",
                    title: "MACHINE",
                    items: [{
                        key: "loanMonitoringDetails.machineDetails[].make",
                        type: "string"
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].type",
                        type: "string"
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].year",
                        type: "date"
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].model",
                        type: "string"
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].serialNumber",
                        type: "string"
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].assetType",
                        type: "select",
                        titleMap: {
                            "NEW": "NEW",
                            "OLD": "OLD",
                        },
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].udf1",
                        type: "select",
                        title: "MACHINE_PERMANENTLY_FIXED_TO_BUILDING",
                        enumCode: "decisionmaker1"
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].udf2",
                        type: "select",
                        title: "HYPOTHECATED_TO_KINARA",
                        enumCode: "decisionmaker1"
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].hypothecationLabelBeenApplied",
                        type: "select",
                        enumCode: "decisionmaker1"
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].companyNameInOriginalInvoice",
                        type: "select",
                        enumCode: "decisionmaker1"
                    }, {
                        key: "loanMonitoringDetails.machineDetails[].hypothecatedTo",
                        type: "select",
                        titleMap: {
                            "VHFPL": "VHFPL",
                        },
                    }]
                }, {
                    type: "fieldset",
                    title: "",
                    condition: "model.loanMonitoringDetails.loanPurposeCategory == 'Asset Purchase'",
                    items: [{
                        key: "loanMonitoringDetails.lucDone",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        condition: "!model.lucCompleted",
                        title: "LUC_COMPLETED",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucDone == "Yes") {
                                model.loanMonitoringDetails.lucRescheduled = "No";
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.lucRescheduled",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucRescheduled == "Yes") {
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.udf2",
                        type: "select",
                        title: "RESCHEDULED_REMARKS",
                        titleMap: {
                            "Partially utilized ": "Partially utilized ",
                            "Not utilized ": "Not utilized ",
                            "Customer not available": "Customer not available",
                        },
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduleReason",
                        type: "string",
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduledDate",
                        type: "date",
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucEscalated",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.lucEscalatedReason",
                        type: "select",
                        titleMap: {
                            "Value of the machine is less than the given quotation": "Value of the machine is less than the given quotation",
                            "Mis match in the Machine type & accessories": "Mis match in the Machine type & accessories",
                            "Mis match in no of Machineries": "Mis match in no of Machineries",
                            "Non operational Machinery": "Non operational Machinery",
                            "Non delivery of Machine": "Non delivery of Machine",
                        },
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.udf3",
                        title: "ESCALATED_REMARKS",
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'"
                    }]
                }, {
                    type: "fieldset",
                    title: "",
                    condition: "model.loanMonitoringDetails.loanPurposeCategory == 'Working Capital' || model.loanMonitoringDetails.loanPurposeCategory == 'Business Development' || model.loanMonitoringDetails.loanPurposeCategory == 'Line of credit'",
                    items: [{
                        key: "loanMonitoringDetails.loanAmountUsed",
                        type: "amount",
                        "onChange": function(modelValue, form, model) {
                            var a = ((parseFloat(model.loanMonitoringDetails.loanAmountUsed) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                            model.loanMonitoringDetails.amountUsedPercentage = parseInt(a.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.amountUsedPercentage",
                        "readonly": true,
                        title: "%_OF_AMOUNT_UTILISED",
                        type: "integer"
                    }, {
                        key: "loanMonitoringDetails.intendedPurposeAmount",
                        type: "amount",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.intendedPurposeAmount > model.loanMonitoringDetails.loanAmountUsed) {
                                model.loanMonitoringDetails.intendedPurposeAmount = model.loanMonitoringDetails.loanAmountUsed;
                            }
                            var a = ((parseFloat(model.loanMonitoringDetails.intendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                            model.loanMonitoringDetails.intendedPurposePercentage = parseInt(a.toFixed());
                            model.loanMonitoringDetails.nonIntendedPurposeAmount = model.loanMonitoringDetails.loanAmountUsed - model.loanMonitoringDetails.intendedPurposeAmount;
                            var b = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                            model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(b.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.intendedPurposePercentage",
                        title: "%_OF_AMOUNT_UTILISED_FOR_INTENDED_PURPOSE",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "integer",
                        "readonly": true,
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposeAmount",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "amount",
                        "readonly": true,
                        "onChange": function(modelValue, form, model) {
                            var a = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                            model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(a.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposePercentage",
                        title: "%_OF_AMOUNT_UTILISED_FOR_UNINTENDED_PURPOSE",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "integer",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.loanAmountPurpose",
                        title: "LOAN_AMOUNT_UTILIZED_FOR",
                        type: "select",
                        condition: "model.loanMonitoringDetails.nonIntendedPurposeAmount > 0",
                        enumCode: "luc_loan_amount_Purpose"
                    }, {
                        key: "loanMonitoringDetails.verifiedBy",
                        type: "select",
                        title: "SOURCE_OF_VERIFICATION",
                        condition: "model.loanMonitoringDetails.nonIntendedPurposeAmount > 0",
                        //condition: "model.loanMonitoringDetails.loanAmountPurpose == 'Business Purpose' ",
                        enumCode: "luc_verified_by",
                        parentEnumCode: "luc_loan_amount_Purpose",
                        parentValueExpr: "model.loanMonitoringDetails.loanAmountPurpose"
                    }, {
                        key: "loanMonitoringDetails.lucDone",
                        type: "radios",
                        title: "LUC_COMPLETED",
                        enumCode: "decisionmaker1",
                        condition: "!model.lucCompleted",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucDone == "Yes") {
                                model.loanMonitoringDetails.lucRescheduled = "No";
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.lucRescheduled",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucRescheduled == "Yes") {
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.udf2",
                        type: "select",
                        title: "RESCHEDULED_REMARKS",
                        titleMap: {
                            "Partially utilized ": "Partially utilized ",
                            "Not utilized ": "Not utilized ",
                            "Customer not available": "Customer not available",
                        },
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduleReason",
                        type: "string",
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes'&& (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')"
                    }, {
                        key: "loanMonitoringDetails.lucRescheduledDate",
                        type: "date",
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucEscalated",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.lucEscalatedReason",
                        type: "select",
                        titleMap: {
                            "Mis utilized": "Mis utilized",
                            "Not utilized": "Not utilized",
                            "Partially utilized": "Partially utilized",
                        },
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.udf3",
                        title: "ESCALATED_REMARKS",
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }]
                }, {
                    type: "fieldset",
                    title: "",
                    condition: "model.loanMonitoringDetails.loanPurposeCategory == 'Machine Refinance'",
                    items: [{
                        key: "loanMonitoringDetails.repayedDebitAmount",
                        type: "amount",
                        "onChange": function(modelValue, form, model) {
                            var a = ((parseFloat(model.loanMonitoringDetails.repayedDebitAmount) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                            model.loanMonitoringDetails.amountUsedPercentage = parseInt(a.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.monthlyInterestForDebit",
                        type: "amount"
                    }, {
                        key: "loanMonitoringDetails.remainingAmountPurpose",
                    }, {
                        key: "loanMonitoringDetails.remainingAmountUtilizedOn",
                        type: "date"
                    }, {
                        key: "loanMonitoringDetails.amountUsedPercentage",
                        title: "%_OF_AMOUNT_UTILISED",
                        type: "integer",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.intendedPurposeAmount",
                        type: "amount",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.intendedPurposeAmount > model.loanMonitoringDetails.loanAmountUsed) {
                                model.loanMonitoringDetails.intendedPurposeAmount = model.loanMonitoringDetails.loanAmountUsed;
                            }
                            var a = ((parseFloat(model.loanMonitoringDetails.intendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.repayedDebitAmount)) * 100);
                            model.loanMonitoringDetails.intendedPurposePercentage = parseInt(a.toFixed());
                            model.loanMonitoringDetails.nonIntendedPurposeAmount = model.loanMonitoringDetails.repayedDebitAmount - model.loanMonitoringDetails.intendedPurposeAmount;
                            var b = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.repayedDebitAmount)) * 100);
                            model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(b.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.intendedPurposePercentage",
                        title: "%_OF_AMOUNT_UTILISED_FOR_INTENDED_PURPOSE",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "integer",
                        "readonly": true,
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposeAmount",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "amount",
                        "readonly": true,
                        "onChange": function(modelValue, form, model) {
                            var a = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                            model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(a.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.loanAmountPurpose",
                        condition: "model.loanMonitoringDetails.nonIntendedPurposeAmount > 0",
                        type: "select",
                        enumCode: "luc_loan_amount_Purpose"

                    }, {
                        key: "loanMonitoringDetails.verifiedBy",
                        type: "select",
                        title: "SOURCE_OF_VERIFICATION",
                        condition: "model.loanMonitoringDetails.nonIntendedPurposeAmount > 0",
                        //condition: "model.loanMonitoringDetails.loanAmountPurpose == 'Business Purpose' ",
                        enumCode: "luc_verified_by",
                        parentEnumCode: "luc_loan_amount_Purpose",
                        parentValueExpr: "model.loanMonitoringDetails.loanAmountPurpose"
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposePercentage",
                        title: "%_OF_AMOUNT_UTILISED_FOR_UNINTENDED_PURPOSE",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "integer",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.lucDone",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        title: "LUC_COMPLETED",
                        condition: "!model.lucCompleted",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucDone == "Yes") {
                                model.loanMonitoringDetails.lucRescheduled = "No";
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.lucRescheduled",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucRescheduled == "Yes") {
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.udf2",
                        type: "select",
                        title: "RESCHEDULED_REMARKS",
                        titleMap: {
                            "Partially utilized ": "Partially utilized ",
                            "Not utilized ": "Not utilized ",
                            "Customer not available": "Customer not available",
                        },
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduleReason",
                        type: "string",
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduledDate",
                        type: "date",
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucEscalated",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.lucEscalatedReason",
                        type: "select",
                        titleMap: {
                            "Mis utilized": "Mis utilized",
                            "Not utilized": "Not utilized",
                            "Partially utilized": "Partially utilized",
                        },
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.udf3",
                        title: "ESCALATED_REMARKS",
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }]
                }, {
                    type: "fieldset",
                    title: "",
                    condition: "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                    items: [{
                        key: "loanMonitoringDetails.loanAmountUsed",
                        type: "amount",
                        required: true,
                        "onChange": function(modelValue, form, model) {
                            var a = ((parseFloat(model.loanMonitoringDetails.loanAmountUsed) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                            model.loanMonitoringDetails.amountUsedPercentage = parseInt(a.toFixed());
                            model.loanMonitoringDetails.loanAmountNotUsed = model.loanMonitoringDetails.loanAmount - model.loanMonitoringDetails.loanAmountUsed;
                        }
                    }, {
                        key: "loanMonitoringDetails.loanAmountPurpose",
                        type: "select",
                        required: true,
                        enumCode: "loan_purpose_1"

                    }, {
                        key: "loanMonitoringDetails.verifiedBy",
                        type: "select",
                        titleMap: {
                            "Bill ": "Bill ",
                        }
                    }, {
                        key: "loanMonitoringDetails.amountUsedPercentage",
                        "readonly": true,
                        title: "%_OF_AMOUNT_UTILISED",
                        type: "integer"
                    }, {
                        key: "loanMonitoringDetails.loanAmountNotUsed",
                        "readonly": true,
                        type: "amount"
                    }, {
                        key: "loanMonitoringDetails.intendedPurposeAmount",
                        type: "amount",
                        required: true,
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.intendedPurposeAmount > model.loanMonitoringDetails.loanAmountUsed) {
                                model.loanMonitoringDetails.intendedPurposeAmount = model.loanMonitoringDetails.loanAmountUsed;
                            }
                            var a = ((parseFloat(model.loanMonitoringDetails.intendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                            model.loanMonitoringDetails.intendedPurposePercentage = parseInt(a.toFixed());
                            model.loanMonitoringDetails.nonIntendedPurposeAmount = model.loanMonitoringDetails.loanAmountUsed - model.loanMonitoringDetails.intendedPurposeAmount;
                            var b = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                            model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(b.toFixed());
                        }
                    }, {
                        key: "loanMonitoringDetails.intendedPurposePercentage",
                        title: "%_OF_AMOUNT_UTILISED_FOR_INTENDED_PURPOSE",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "integer",
                        "readonly": true,
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposeAmount",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "amount",
                        readonly: true
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposePercentage",
                        title: "%_OF_AMOUNT_UTILISED_FOR_UNINTENDED_PURPOSE",
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                        type: "integer",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.nonIntendedPurposeAmountSpentOn",
                        required: true,
                        //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                    }, {
                        key: "loanMonitoringDetails.udf4",
                        required: true,
                        title: "BUSINESS_RUNNING_BY",
                    }, {
                        key: "loanMonitoringDetails.udf5",
                        required: true,
                        title: "BUSINESS_CONDITION",
                    }, {
                        key: "loanMonitoringDetails.udf6",
                        required: true,
                        title: "OBSERVATION",
                    }, {
                        key: "loanMonitoringDetails.lucDone",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucDone == "Yes") {
                                model.loanMonitoringDetails.lucRescheduled = "No";
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.lucRescheduled",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucRescheduled == "Yes") {
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.udf2",
                        type: "select",
                        title: "RESCHEDULED_REMARKS",
                        titleMap: {
                            "Partially utilized ": "Partially utilized ",
                            "Not utilized ": "Not utilized ",
                            "Customer not available": "Customer not available",
                        },
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduleReason",
                        type: "string",
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes'&& (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduledDate",
                        type: "date",
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    }, {
                        key: "loanMonitoringDetails.lucEscalated",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.lucEscalatedReason",
                        type: "select",
                        titleMap: {
                            "Mis utilized": "Mis utilized",
                            "Not utilized": "Not utilized",
                            "Partially utilized": "Partially utilized",
                        },
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }, {
                        key: "loanMonitoringDetails.udf3",
                        title: "ESCALATED_REMARKS",
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }]
                }, ]
            }, {
                "type": "box",
                "title": "LUC_DOCUMENTS",
                "condition": "model.loanMonitoringDetails.currentStage=='LUCReview' || model.lucCompleted",
                "items": [{
                    "key": "loanMonitoringDetails.loanMonitoringDocuments",
                    "type": "array",
                    "title": "LUC_DOCUMENTS",
                    readonly: true,
                    startEmpty: true,
                    "items": [{

                        key: "loanMonitoringDetails.loanMonitoringDocuments[].documentName",
                        title: "DOCUMENT_NAME",
                        required: true,
                        "type": ["string", "null"],
                    }, {
                        key: "loanMonitoringDetails.loanMonitoringDocuments[].documentId",
                        title: "UPLOAD",
                        type: "file",
                        required: true,
                        fileType: "application/pdf",
                        using: "scanner",
                    }]
                }]
            }, {
                "type": "box",
                "title": "LUC_DOCUMENTS",
                "condition": "!(model.loanMonitoringDetails.currentStage == 'LUCReview' || model.lucCompleted)",
                "items": [{
                    "key": "loanMonitoringDetails.loanMonitoringDocuments",
                    "type": "array",
                    "title": "LUC_DOCUMENTS",
                    startEmpty: true,
                    "items": [{

                        key: "loanMonitoringDetails.loanMonitoringDocuments[].documentName",
                        title: "DOCUMENT_NAME",
                        required: true,
                        "type": ["string", "null"],
                    }, {
                        key: "loanMonitoringDetails.loanMonitoringDocuments[].documentId",
                        title: "UPLOAD",
                        type: "file",
                        required: true,
                        fileType: "application/pdf",
                        using: "scanner",
                    }]
                }]
            }, {
                "type": "box",
                condition: "model.loanMonitoringDetails.isAssetNotDelivered == 'Yes' || model.loanMonitoringDetails.nonIntendedPurposeAmount > 0 && (model.lucCompleted || model.loanMonitoringDetails.currentStage =='LUCReview') && !(model.siteCode == 'sambandh' || model.siteCode == 'saija')",
                "title": "SOCIAL_IMPACT",
                readonly: true,
                "items": [{
                    key: "loanMonitoringDetails.socialImpactDetails.noOfJobsAdded",
                    title: "NO_OF_JOBS_ADDED",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.socialImpactDetails.totalNumberOfMen",
                    type: "number",
                    title: "MEN",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.socialImpactDetails.totalNumberOfWomen",
                    type: "number",
                    title: "WOMEN",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.socialImpactDetails.noOfFreshersInAddedJobs",
                    title: "FRESHERS",
                    "readonly": true
                }, {
                    key: "loanMonitoringDetails.socialImpactDetails.avgSalaryOfNewJoinees",
                    title: "AVERAGE_SALARY_OF_NEW_JOINEES",
                    "readonly": true
                }, {
                    "type": "fieldset",
                    "title": "PRE_LOAN_DETAILS",
                    "items": [{
                        key: "loanMonitoringDetails.socialImpactDetails.preLoanMonthlyRevenue",
                        //type: "number",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.socialImpactDetails.preLoanMonthlyNetIncome",
                        //type: "amount",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.socialImpactDetails.preLoanProprietorSalary",
                        //type: "amount",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.socialImpactDetails.preLoanNumberOfCustomersOrBuyers",
                        //type: "number",
                        "readonly": true
                    }]
                }, {
                    "type": "fieldset",
                    "title": "POST_LOAN_DETAILS",
                    "items": [{
                        key: "loanMonitoringDetails.socialImpactDetails.postLoanMonthlyRevenue",
                        type: "number",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.socialImpactDetails.postLoanMonthlyNetIncome",
                        type: "amount",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.socialImpactDetails.postLoanProprietorSalary",
                        type: "amount",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.socialImpactDetails.postLoanNumberOfCustomersOrBuyers",
                        type: "number",
                        "readonly": true
                    }]
                }]
            }, {
                "type": "box",
                condition: "(( model.loanMonitoringDetails.currentStage=='LUCSchedule' || model.loanMonitoringDetails.currentStage=='LUCReschedule') && (model.loanMonitoringDetails.lucDone=='Yes' || model.loanMonitoringDetails.lucEscalated=='Yes')) || model.loanMonitoringDetails.isAssetNotDelivered == 'Yes' || model.loanMonitoringDetails.nonIntendedPurposeAmount > 0 && !(model.loanMonitoringDetails.currentStage == 'LUCReview' || model.lucCompleted) && !(model.siteCode == 'sambandh' || model.siteCode == 'saija')",
                "title": "SOCIAL_IMPACT",
                "items": [{
                    key: "loanMonitoringDetails.socialImpactDetails.noOfJobsAdded",
                    title: "NO_OF_JOBS_ADDED"
                }, {
                    key: "loanMonitoringDetails.socialImpactDetails.totalNumberOfMen",
                    type: "number",
                    title: "MEN"
                }, {
                    key: "loanMonitoringDetails.socialImpactDetails.totalNumberOfWomen",
                    type: "number",
                    title: "WOMEN"
                }, {
                    key: "loanMonitoringDetails.socialImpactDetails.noOfFreshersInAddedJobs",
                    title: "FRESHERS"
                }, {
                    key: "loanMonitoringDetails.socialImpactDetails.avgSalaryOfNewJoinees",
                    title: "AVERAGE_SALARY_OF_NEW_JOINEES"
                }, {
                    "type": "fieldset",
                    "title": "PRE_LOAN_DETAILS",
                    "items": [{
                        key: "loanMonitoringDetails.socialImpactDetails.preLoanMonthlyRevenue",
                        //type: "number",
                        readonly: "true"
                    }, {
                        key: "loanMonitoringDetails.socialImpactDetails.preLoanMonthlyNetIncome",
                        //type: "amount",
                        readonly: "true"
                    }, {
                        key: "loanMonitoringDetails.socialImpactDetails.preLoanProprietorSalary",
                        //type: "amount",
                        readonly: "true"
                    }, {
                        key: "loanMonitoringDetails.socialImpactDetails.preLoanNumberOfCustomersOrBuyers",
                        //type: "number",
                        readonly: "true"
                    }]
                }, {
                    "type": "fieldset",
                    "title": "POST_LOAN_DETAILS",
                    "items": [{
                        key: "loanMonitoringDetails.socialImpactDetails.postLoanMonthlyRevenue",
                        type: "number"
                    }, {
                        key: "loanMonitoringDetails.socialImpactDetails.postLoanMonthlyNetIncome",
                        type: "amount"
                    }, {
                        key: "loanMonitoringDetails.socialImpactDetails.postLoanProprietorSalary",
                        type: "amount"
                    }, {
                        key: "loanMonitoringDetails.socialImpactDetails.postLoanNumberOfCustomersOrBuyers",
                        type: "number"
                    }]
                }]
            }, {
                "type": "actionbox",
                condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && model.loanMonitoringDetails.lucEscalated=='No' ",
                "items": [{
                    type: "button",
                    icon: "fa fa-step-backward",
                    title: "ReSchedule",
                    onClick: function(model, formCtrl) {
                        $log.info("Inside submit()");
                        $log.warn(model);
                        model.loanMonitoringDetails.udf5 = model.loanMonitoringDetails.currentStage;
                        var sortFn = function(unordered) {
                            var out = {};
                            Object.keys(unordered).sort().forEach(function(key) {
                                out[key] = unordered[key];
                            });
                            return out;
                        };
                        formHelper.validate(formCtrl).then(function() {
                            orderLUCDocuments(model);
                            var reqData = _.cloneDeep(model);

                            if (!(validateDate(reqData))) {
                                return;
                            }

                            if (reqData.loanMonitoringDetails.id) {
                                LucHelper.reschedule(reqData).then(function(resp) {
                                    $state.go('Page.LUCDashboard', null);
                                });

                            } else {
                                $log.info("Id is not in the model");
                            }
                        });
                    }
                }]
            }, {
                "type": "actionbox",
                condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                "items": [{
                    type: "button",
                    icon: "fa fa-step-forward",
                    title: "Escalate",
                    onClick: function(model, formCtrl) {
                        $log.info("Inside submit()");
                        $log.warn(model);
                        model.loanMonitoringDetails.udf5 = model.loanMonitoringDetails.currentStage;
                        var sortFn = function(unordered) {
                            var out = {};
                            Object.keys(unordered).sort().forEach(function(key) {
                                out[key] = unordered[key];
                            });
                            return out;
                        };
                        formHelper.validate(formCtrl).then(function() {
                            orderLUCDocuments(model);
                            var reqData = _.cloneDeep(model);
                            if (reqData.loanMonitoringDetails.id) {
                                LucHelper.escalate(reqData).then(function(resp) {
                                    $state.go('Page.LUCDashboard', null);
                                });
                            } else {
                                $log.info("Id is not in the model");
                            }
                        });
                    }
                }]
            }, {
                "type": "actionbox",
                condition: "model.loanMonitoringDetails.lucDone== 'Yes' && !(model.lucCompleted || model.loanMonitoringDetails.currentStage == 'LUCReview')",
                "items": [{
                    "type": "submit",
                    "title": "Close"
                }]
            }, {
                "type": "actionbox",
                "condition": "model.loanMonitoringDetails.lucDone== 'Yes' && model.loanMonitoringDetails.currentStage == 'LUCReview'",
                "items": [{
                    "type": "submit",
                    "title": "PROCEED"
                }]
            }, {
                "type": "actionbox",
                condition: "!model.lucCompleted",
                "items": [{
                    "type": "save",
                    "title": "OffLine Save"
                }]
            }, {
                "type": "actionbox",
                condition: "model.loanMonitoringDetails.currentStage=='LUCEscalate'|| model.loanMonitoringDetails.currentStage=='LUCLegalRecovery' || model.loanMonitoringDetails.currentStage=='LUCReview'",
                "items": [{
                    type: "button",
                    icon: "fa fa-step-backward",
                    title: "Sent Back",
                    onClick: function(model, formCtrl) {
                        $log.info("Inside submit()");
                        $log.warn(model);
                        var sortFn = function(unordered) {
                            var out = {};
                            Object.keys(unordered).sort().forEach(function(key) {
                                out[key] = unordered[key];
                            });
                            return out;
                        };
                        formHelper.validate(formCtrl).then(function() {
                            orderLUCDocuments(model);
                            var reqData = _.cloneDeep(model);
                            if (reqData.loanMonitoringDetails.id) {
                                LucHelper.goBack(reqData).then(function(resp) {
                                    $state.go('Page.LUCDashboard', null);
                                });
                            } else {
                                $log.info("Id is not in the model");
                            }
                        });
                    }
                }]
            }, {
                "type": "actionbox",
                condition: "model.lucCompleted",
                "items": [{
                    type: "button",
                    icon: "fa fa-step-backward",
                    title: "Back",
                    onClick: function(model, formCtrl) {
                        irfNavigator.goBack();
                    }
                }]
            }],

            schema: function() {
                return LUC.getSchema().$promise;
            },

            actions: {
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.loanMonitoringDetails.customerName) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('lUC-save', 'Customer Name is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },
                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    $log.warn(model);
                    var sortFn = function(unordered) {
                        var out = {};
                        Object.keys(unordered).sort().forEach(function(key) {
                            out[key] = unordered[key];
                        });
                        return out;
                    };

                    model.loanMonitoringDetails.udf5 = model.loanMonitoringDetails.currentStage;
                    orderLUCDocuments(model);
                    var reqData = _.cloneDeep(model);
                    // reqData.loanMonitoringDetails.currentStage = "LUCSchedule";
                    if (reqData.loanMonitoringDetails.id) {
                        LucHelper.proceedData(reqData).then(function(resp) {
                            $state.go('Page.LUCDashboard', null);
                        });

                    } else {
                        $log.info("Id is not in the model");
                    }
                }
            }
        }
    }
})
