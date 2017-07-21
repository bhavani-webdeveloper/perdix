define({
    pageUID: "loans.individual.creditMonitoring.CMData",
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
        var orderCMDocuments = function(model) {
            var cmDocuments = model.loanMonitoringDetails.loanMonitoringDocuments || [];
            for (var i = 0; i < cmDocuments.length; i++) {
                cmDocuments[i]["documentSl"] = (i + 1);
            }
        }

        return {
            "type": "schema-form",
            "title": "CREDIT_MONITORING_DATA_CAPTURE",
            "subTitle": "CREDIT_MONITORING",
            initialize: function(model, form, formCtrl) {
                model.cmCompleted = ($stateParams.pageData && $stateParams.pageData._lucCompleted) ? true : false;
                model.loanMonitoringDetails = model.loanMonitoringDetails || {};
                // if (!_.hasIn(model.loanMonitoringDetails, 'socialImpactDetails') || model.loanMonitoringDetails.socialImpactDetails == null) {
                //     model.loanMonitoringDetails.socialImpactDetails = {};
                // }
                model = Utils.removeNulls(model, true);
                $log.info("luc page got initiated");

                if (!(model && model.loanMonitoringDetails && model.loanMonitoringDetails.id && model.$$STORAGE_KEY$$)) {
                    PageHelper.showLoader();
                    PageHelper.showProgress("page-init", "Loading...");
                    var cmId = $stateParams.pageId;
                    if (!cmId) {
                        PageHelper.hideLoader();
                    }
                    LUC.get({
                            id: cmId
                        },
                        function(res) {
                            $log.info(res);
                            _.assign(model.loanMonitoringDetails, res.loanMonitoringDetails);
                            model.loanMonitoringDetails.lucRescheduledDate = (model.loanMonitoringDetails.lucRescheduledDate != null) ? moment(model.loanMonitoringDetails.lucRescheduledDate).format("YYYY-MM-DD") : null;
                            var loanId = res.loanMonitoringDetails.loanId;
                            var loanresponse = IndividualLoan.get({
                                id: loanId
                            }).$promise;

                            loanresponse.then(
                                function(response) {
                                    $log.info("printing loan account");
                                    $log.info(response);
                                    var urn = response.urn;
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

                                                        // if (!_.hasIn(model.loanMonitoringDetails, 'socialImpactDetails') || model.loanMonitoringDetails.socialImpactDetails == null) {
                                                        //     model.loanMonitoringDetails.socialImpactDetails = {};
                                                        // }

                                                        // if (model.loanMonitoringDetails.currentStage == "CMSchedule") {
                                                        //     if (response2.familyMembers && response2.familyMembers.length) {
                                                        //         for (i = 0; i < response2.familyMembers.length; i++) {
                                                        //             if (response2.familyMembers[i].relationShip == "self") {
                                                        //                 model.loanMonitoringDetails.socialImpactDetails.preLoanProprietorSalary = response2.familyMembers[i].salary;
                                                        //             }
                                                        //         }
                                                        //     }
                                                        // }
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
                                    if (model.loanMonitoringDetails.currentStage == "CMSchedule" && !(model.loanMonitoringDetails.lucEscalatedReason)) {
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
                                                // if (!_.hasIn(model.loanMonitoringDetails, 'socialImpactDetails') || model.loanMonitoringDetails.socialImpactDetails == null) {
                                                //     model.loanMonitoringDetails.socialImpactDetails = {};
                                                // }
                                                // if (model.loanMonitoringDetails.currentStage == "CMSchedule") {
                                                //     model.loanMonitoringDetails.socialImpactDetails.preLoanMonthlyNetIncome = response1.enterprise.avgMonthlyNetIncome;
                                                //     model.loanMonitoringDetails.socialImpactDetails.preLoanMonthlyRevenue = response1.enterprise.monthlyTurnover;
                                                //     if (response1.buyerDetails && response1.buyerDetails.length) {
                                                //         model.loanMonitoringDetails.socialImpactDetails.preLoanNumberOfCustomersOrBuyers = response1.buyerDetails.length;
                                                //     }
                                                // }

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
                    "title": "CREDIT_MONITORING",
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
                },  {
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
                            title: "LOAN_PURPOSE_1",
                        }, {
                            key: "loanMonitoringDetails.loanPurpose",
                            title: "LOAN_SUB_PURPOSE",
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
                            },{
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
                                HYPOTHECATED_TO_KINARA: "%OF_AMOUNT_UTILISED_FOR_INTENDED_PURPOSE",
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
                            },{
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
                                type: "select",
                                titleMap:{
                                    "Yes":"Yes",
                                    "No":"No"
                                },
                                //enumCode: "decisionmaker1",
                                "onChange": function(modelValue, form, model) {
                                    if (model.loanMonitoringDetails.lucDone == "Yes") {
                                        model.loanMonitoringDetails.CMReschedule = "No";
                                        model.loanMonitoringDetails.CMEscalate = "No";
                                    }
                                }
                            }, {
                                key: "loanMonitoringDetails.CMReschedule",
                                "title": "CM_RESCHEDULED",
                                condition: "model.loanMonitoringDetails.lucDone=='No' && (model.loanMonitoringDetails.currentStage =='CMSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                                type: "select",
                                titleMap:{
                                    "Yes":"Yes",
                                    "No":"No"
                                },
                                //enumCode: "decisionmaker1",
                                "onChange": function(modelValue, form, model) {
                                    if (model.loanMonitoringDetails.CMReschedule == "Yes") {
                                        model.loanMonitoringDetails.CMEscalate = "No";
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
                                condition: "model.loanMonitoringDetails.CMReschedule=='Yes' && (model.loanMonitoringDetails.currentStage =='CMSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                            }, {
                                key: "loanMonitoringDetails.lucRescheduleReason",
                                type: "string",
                                condition: "model.loanMonitoringDetails.CMReschedule=='Yes' && (model.loanMonitoringDetails.currentStage =='CMSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                            }, {
                                key: "loanMonitoringDetails.lucRescheduledDate",
                                type: "date",
                                condition: "model.loanMonitoringDetails.CMReschedule=='Yes' && (model.loanMonitoringDetails.currentStage =='CMSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                            }, {
                                key: "loanMonitoringDetails.CMEscalate",
                                "title" : "CM_ESCALATED",
                                type: "select",
                                titleMap:{
                                    "Yes":"Yes",
                                    "No":"No"
                                },
                                //enumCode: "decisionmaker1",
                                condition: "model.loanMonitoringDetails.lucDone=='No' && model.loanMonitoringDetails.currentStage !=='CMLegalRecovery'",
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
                                condition: "model.loanMonitoringDetails.CMEscalate=='Yes' && model.loanMonitoringDetails.currentStage !=='CMLegalRecovery'",
                            }, {
                                key: "loanMonitoringDetails.udf3",
                                title: "ESCALATED_REMARKS",
                                condition: "model.loanMonitoringDetails.CMEscalate=='Yes' && model.loanMonitoringDetails.currentStage !=='CMLegalRecovery'",
                            }]
                        }, {
                            key: "loanMonitoringDetails.machineDetails",
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
                        }, 
                    ]
                }, {
                    "type": "box",
                    "title": "CREDIT_MONITORING_DOCUMENTS",
                    "readonly": true,
                    "condition": "model.cmCompleted",
                    "items": [{
                        "key": "loanMonitoringDetails.loanMonitoringDocuments",
                        "type": "array",
                        "title": "CREDIT_MONITORING_DOCUMENTS",
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
                    "title": "CREDIT_MONITORING_DOCUMENTS",
                    "condition": "!model.cmCompleted",
                    "items": [{
                        "key": "loanMonitoringDetails.loanMonitoringDocuments",
                        "type": "array",
                        "title": "CREDIT_MONITORING_DOCUMENTS",
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
                },

                {
                    "type": "actionbox",
                    condition: "model.loanMonitoringDetails.CMReschedule=='Yes' && model.loanMonitoringDetails.CMEscalate=='No' ",
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
                                orderCMDocuments(model);
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
                    condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='CMLegalRecovery'",
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
                                orderCMDocuments(model);
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
                    condition: "model.loanMonitoringDetails.lucDone== 'Yes' && !model.cmCompleted",
                    "items": [{
                        "type": "submit",
                        "title": "Close"
                    }]
                }, {
                    "type": "actionbox",
                    condition: "!model.cmCompleted",
                    "items": [{
                        "type": "save",
                        "title": "OffLine Save"
                    }]
                }, {
                    "type": "actionbox",
                    condition: "model.loanMonitoringDetails.currentStage=='CMEscalate'|| model.loanMonitoringDetails.currentStage=='CMLegalRecovery'",
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
                                orderCMDocuments(model);
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
                    condition: "model.cmCompleted",
                    "items": [{
                        type: "button",
                        icon: "fa fa-step-backward",
                        title: "Back",
                        onClick: function(model, formCtrl) {
                            irfNavigator.goBack();
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
                    orderCMDocuments(model);
                    var reqData = _.cloneDeep(model);

                    reqData.loanMonitoringDetails.currentStage = "CMSchedule";
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