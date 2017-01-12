irf.pageCollection.factory(irf.page("loans.individual.luc.LucData"),

    ["$log", "$state", "$stateParams", "LUC", "Enrollment", "IndividualLoan", "LucHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries",

        function($log, $state, $stateParams, LUC, Enrollment, IndividualLoan, LucHelper, SessionStore, formHelper, $q, irfProgressMessage,
            PageHelper, Utils, PagesDefinition, Queries) {

            var branch = SessionStore.getBranch();
            return {
                "type": "schema-form",
                "title": "LUC_DATA_CAPTURE",
                "subTitle": "LUC",
                initialize: function(model, form, formCtrl) {

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
                        LUC.get({
                                id: lucId
                            },
                            function(res) {
                                $log.info(res);
                                _.assign(model.loanMonitoringDetails, res);
                                var loanId = res.loanId;

                                var loanresponse = IndividualLoan.get({
                                    id: loanId
                                }).$promise;

                                loanresponse.then(
                                    function(response) {
                                        $log.info("printing loan account");
                                        $log.info(response);
                                        var urn = response.applicant;
                                        var linkedurns = [urn];
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

                                                            if (model.loanMonitoringDetails.currentStage == "LUCSchedule") {
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
                                        if (model.loanMonitoringDetails.currentStage == "LUCSchedule" && !(model.loanMonitoringDetails.lucEscalatedReason)) {
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
                                            model.loanMonitoringDetails.loanPurpose = model.loanMonitoringDetails.loanPurpose || response.loanPurpose2;
                                            model.loanMonitoringDetails.loanPurposeCategory = model.loanMonitoringDetails.loanPurposeCategory || response.loanPurpose1;
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
                                                    if (model.loanMonitoringDetails.currentStage == "LUCSchedule") {
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
                                    }
                                );

                                model = Utils.removeNulls(model, true);
                                PageHelper.hideLoader();

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
                        }]
                    }, {
                        "type": "box",
                        "title": "LOAN_UTILIZATION",
                        "items": [{
                                key: "loanMonitoringDetails.loanSeries",
                                type: "number",
                                "readonly": true
                            }, {
                                key: "loanMonitoringDetails.loanProductName",
                                type: "string",
                                "readonly": true
                            }, {
                                key: "loanMonitoringDetails.loanPurposeCategory",
                                "readonly": true,
                                type: "select",
                                title: "LOAN_PURPOSE_1",
                                enumCode: "loan_purpose_1"
                            }, {
                                key: "loanMonitoringDetails.loanPurpose",
                                title: "LOAN_PURPOSE_2",
                                "readonly": true
                            }, {
                                key: "loanMonitoringDetails.loanAmount",
                                type: "amount",
                                //"readonly": true
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
                                    type: "select",
                                    titleMap: {
                                        "ALL": "All",
                                        "SOME": "Some",
                                        "NONE": "None",
                                    },
                                }, {
                                    key: "loanMonitoringDetails.amountUtilizedForAssetsPurchase",
                                    type: "amount",
                                    "onChange": function(modelValue, form, model) {
                                        var a = ((parseFloat(model.loanMonitoringDetails.amountUtilizedForAssetsPurchase) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                                        model.loanMonitoringDetails.percentage = parseInt(a.toFixed());
                                    }
                                }, {
                                    key: "loanMonitoringDetails.percentage",
                                    title: "%OF_AMOUNT_UTILISED",
                                    type: "integer",
                                    "readonly": true

                                }, {
                                    key: "loanMonitoringDetails.totalCreationAssetValue",
                                    type: "number"
                                }, {
                                    key: "loanMonitoringDetails.isAssetsOrdered",
                                    type: "radios",
                                    enumCode: "decisionmaker1",
                                }, {
                                    key: "loanMonitoringDetails.reasonForNotOrderingAssets",
                                    type: "string",
                                    condition: "model.loanMonitoringDetails.isAssetsOrdered==0",
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
                                }, {
                                    key: "loanMonitoringDetails.machineDetails[].type",
                                    type: "string",
                                }, {
                                    key: "loanMonitoringDetails.machineDetails[].year",
                                    type: "date",
                                }, {
                                    key: "loanMonitoringDetails.machineDetails[].model",
                                    type: "string",
                                }, {
                                    key: "loanMonitoringDetails.machineDetails[].serialNumber",
                                    type: "string",
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
                                    enumCode: "decisionmaker1",
                                }, {
                                    key: "loanMonitoringDetails.machineDetails[].udf2",
                                    type: "select",
                                    title: "HYPOTHECATED_TO_KINARA",
                                    enumCode: "decisionmaker1",
                                }, {
                                    key: "loanMonitoringDetails.machineDetails[].hypothecationLabelBeenApplied",
                                    type: "select",
                                    enumCode: "decisionmaker1",
                                }, {
                                    key: "loanMonitoringDetails.machineDetails[].companyNameInOriginalInvoice",
                                    type: "select",
                                    enumCode: "decisionmaker1",
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
                                condition: "model.loanMonitoringDetails.loanPurposeCategory == 'Working Capital'||model.loanMonitoringDetails.loanPurposeCategory == 'Business Development'",
                                items: [{
                                    key: "loanMonitoringDetails.loanAmountUsed",
                                    type: "amount",
                                    "onChange": function(modelValue, form, model) {
                                        var a = ((parseFloat(model.loanMonitoringDetails.loanAmountUsed) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                                        model.loanMonitoringDetails.amountUsedPercentage = parseInt(a.toFixed());
                                    }

                                }, {
                                    key: "loanMonitoringDetails.loanAmountPurpose",
                                    type: "select",
                                    titleMap: {
                                        "Raw material": "Raw material",
                                    },

                                }, {
                                    key: "loanMonitoringDetails.verifiedBy",
                                    type: "select",
                                    titleMap: {
                                        "Bill ": "Bill ",
                                    }
                                }, {
                                    key: "loanMonitoringDetails.amountUsedPercentage",
                                    "readonly": true,
                                    title: "%OF_AMOUNT_UTILISED",
                                    type: "integer"
                                }, {
                                    key: "loanMonitoringDetails.intendedPurposeAmount",
                                    type: "amount",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    "onChange": function(modelValue, form, model) {
                                        var a = ((parseFloat(model.loanMonitoringDetails.intendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                                        model.loanMonitoringDetails.intendedPurposePercentage = parseInt(a.toFixed());
                                        model.loanMonitoringDetails.nonIntendedPurposeAmount = model.loanMonitoringDetails.loanAmountUsed - model.loanMonitoringDetails.intendedPurposeAmount;
                                        var b = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                                        model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(b.toFixed());
                                    }
                                }, {
                                    key: "loanMonitoringDetails.intendedPurposePercentage",
                                    title: "%OF_AMOUNT_UTILISED_FOR_INTENDED_PURPOSE",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    type: "integer",
                                    "readonly": true,
                                }, {
                                    key: "loanMonitoringDetails.nonIntendedPurposeAmount",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    type: "amount",

                                    /* "onChange": function(modelValue, form, model) {
                                         var a = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                                         model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(a.toFixed());
                                     }*/
                                }, {
                                    key: "loanMonitoringDetails.nonIntendedPurposePercentage",
                                    title: "%OF_AMOUNT_UTILISED_FOR_UNINTENDED_PURPOSE",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    type: "integer",
                                    "readonly": true
                                }, {
                                    key: "loanMonitoringDetails.nonIntendedPurposeAmountSpentOn",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
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
                                    title: "%OF_AMOUNT_UTILISED",
                                    type: "integer",
                                    "readonly": true
                                }, {
                                    key: "loanMonitoringDetails.intendedPurposeAmount",
                                    type: "amount",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    "onChange": function(modelValue, form, model) {
                                        var a = ((parseFloat(model.loanMonitoringDetails.intendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.repayedDebitAmount)) * 100);
                                        model.loanMonitoringDetails.intendedPurposePercentage = parseInt(a.toFixed());
                                        model.loanMonitoringDetails.nonIntendedPurposeAmount = model.loanMonitoringDetails.repayedDebitAmount - model.loanMonitoringDetails.intendedPurposeAmount;
                                        var b = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.repayedDebitAmount)) * 100);
                                        model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(b.toFixed());
                                    }
                                }, {
                                    key: "loanMonitoringDetails.intendedPurposePercentage",
                                    title: "%OF_AMOUNT_UTILISED_FOR_INTENDED_PURPOSE",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    type: "integer",
                                    "readonly": true,
                                }, {
                                    key: "loanMonitoringDetails.nonIntendedPurposeAmount",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    type: "amount",
                                    "readonly": true,
                                    /*"onChange": function(modelValue, form, model) {
                                        var a = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                                        model.loanMonitoringDetails.nonIntendedPurposePercentage =parseInt(a.toFixed());
                                    }*/
                                }, {
                                    key: "loanMonitoringDetails.nonIntendedPurposePercentage",
                                    title: "%OF_AMOUNT_UTILISED_FOR_UNINTENDED_PURPOSE",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    type: "integer",
                                    "readonly": true
                                }, {
                                    key: "loanMonitoringDetails.nonIntendedPurposeAmountSpentOn",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
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
                                }]
                            },

                        ]
                    },

                    {
                        "type": "box",
                        "title": "SOCIAL_IMPACT",
                        "items": [{
                            type: "fieldset",
                            title: "MEN",
                            items: [{
                                key: "loanMonitoringDetails.socialImpactDetails.totalNumberOfMen",
                                type: "number"
                            }, {
                                key: "loanMonitoringDetails.socialImpactDetails.averageSalaryOfMen",
                                type: "amount"
                            }, {
                                key: "loanMonitoringDetails.socialImpactDetails.menPartTimeEmployee",
                                type: "number",
                                "onChange": function(modelValue, form, model) {
                                    model.loanMonitoringDetails.socialImpactDetails.menFullTimeEmployee = model.loanMonitoringDetails.socialImpactDetails.totalNumberOfMen -
                                        model.loanMonitoringDetails.socialImpactDetails.menPartTimeEmployee;
                                }
                            }, {
                                key: "loanMonitoringDetails.socialImpactDetails.menFullTimeEmployee",
                                type: "number"
                            }, {
                                key: "loanMonitoringDetails.socialImpactDetails.avgSkillLevelOfMen",
                                type: "select",
                                titleMap: {
                                    "SKILLED": "SKILLED",
                                    "UNSKILLED": "UNSKILLED",
                                },
                            }, {
                                key: "loanMonitoringDetails.socialImpactDetails.noOfFirstJobsMen",
                                type: "number"
                            }]
                        }, {
                            type: "fieldset",
                            title: "WOMEN",
                            items: [{
                                key: "loanMonitoringDetails.socialImpactDetails.totalNumberOfWomen",
                                type: "number"
                            }, {
                                key: "loanMonitoringDetails.socialImpactDetails.averageSalaryOfWomen",
                                type: "amount"
                            }, {
                                key: "loanMonitoringDetails.socialImpactDetails.womenPartTimeEmployee",
                                type: "number",
                                "onChange": function(modelValue, form, model) {
                                    model.loanMonitoringDetails.socialImpactDetails.womenFullTimeEmployee = model.loanMonitoringDetails.socialImpactDetails.totalNumberOfWomen -
                                        model.loanMonitoringDetails.socialImpactDetails.womenPartTimeEmployee;
                                }
                            }, {
                                key: "loanMonitoringDetails.socialImpactDetails.womenFullTimeEmployee",
                                type: "number"
                            }, {
                                key: "loanMonitoringDetails.socialImpactDetails.avgSkillLevelOfWomen",
                                type: "select",
                                titleMap: {
                                    "SKILLED": "SKILLED",
                                    "UNSKILLED": "UNSKILLED",
                                },
                            }, {
                                key: "loanMonitoringDetails.socialImpactDetails.noOfFirstJobsWomen",
                                type: "number"
                            }]
                        }, {
                            "type": "fieldset",
                            "title": "PRE_LOAN_DETAILS",
                            "items": [{
                                key: "loanMonitoringDetails.socialImpactDetails.preLoanMonthlyRevenue",
                                type: "number"
                            }, {
                                key: "loanMonitoringDetails.socialImpactDetails.preLoanMonthlyNetIncome",
                                type: "amount"
                            }, {
                                key: "loanMonitoringDetails.socialImpactDetails.preLoanProprietorSalary",
                                type: "amount"
                            }, {
                                key: "loanMonitoringDetails.socialImpactDetails.preLoanNumberOfCustomersOrBuyers",
                                type: "number"
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
                                var sortFn = function(unordered) {
                                    var out = {};
                                    Object.keys(unordered).sort().forEach(function(key) {
                                        out[key] = unordered[key];
                                    });
                                    return out;
                                };
                                formHelper.validate(formCtrl).then(function() {
                                    var reqData = _.cloneDeep(model);
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
                                var sortFn = function(unordered) {
                                    var out = {};
                                    Object.keys(unordered).sort().forEach(function(key) {
                                        out[key] = unordered[key];
                                    });
                                    return out;
                                };

                                formHelper.validate(formCtrl).then(function() {
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
                        condition: "model.loanMonitoringDetails.lucDone== 'Yes'",
                        "items": [{
                            "type": "submit",
                            "title": "Close"
                        }]
                    }, {
                        "type": "actionbox",
                        "items": [{
                            "type": "save",
                            "title": "OffLine Save"
                        }]
                    }, {
                        "type": "actionbox",
                        condition: "model.loanMonitoringDetails.currentStage=='LUCEscalate'|| model.loanMonitoringDetails.currentStage=='LUCLegalRecovery'",
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
                    },
                ],
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
                        var reqData = _.cloneDeep(model);

                        reqData.loanMonitoringDetails.currentStage = "LUCSchedule";
                        if (reqData.loanMonitoringDetails.id) {
                            LucHelper.proceedData(reqData).then(function(resp) {
                                $state.go('Page.LUCDashboard', null);
                            });

                        } else {
                            $log.info("Id is not in the model");
                        }
                    }
                }
            };
        }
    ]);