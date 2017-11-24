irf.pageCollection.factory("LucFormRequestProcessor", ["$log", "$state", "$stateParams",
    "LUC", "Enrollment", "IndividualLoan", "LucHelper", "SessionStore", "formHelper", "$q",
    "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator",
    function($log, $state, $stateParams,
        LUC, Enrollment, IndividualLoan, LucHelper, SessionStore, formHelper, $q,
        irfProgressMessage, PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {
        var formRepository = {}

        formRepository['LUC'] = {
            "LUC": {
                "type": "box",
                "title": "LUC",
                "items": {
                    "id": {
                        key: "loanMonitoringDetails.id",
                        orderNo: 10,
                        type: "number",
                        condition: "model.loanMonitoringDetails.id",
                        "readonly": true
                    },
                    "customerId": {
                        key: "loanMonitoringDetails.customerId",
                        orderNo: 20,
                        type: "number",
                        "readonly": true
                    },
                    "customerName": {
                        orderNo: 30,
                        key: "loanMonitoringDetails.customerName",
                        type: "string",
                        "readonly": true
                    },
                    "address": {
                        orderNo: 40,
                        key: "loanMonitoringDetails.address",
                        type: "string",
                        "readonly": true
                    },
                    "proprietoryName": {
                        orderNo: 50,
                        key: "loanMonitoringDetails.proprietoryName",
                        type: "string",
                        "readonly": true
                    },
                    "loanId": {
                        orderNo: 60,
                        key: "loanMonitoringDetails.loanId",
                        type: "number",
                        "readonly": true
                    },
                    "udf1": {
                        orderNo: 70,
                        key: "loanMonitoringDetails.udf1",
                        type: "string",
                        title: "ACCOUNT_NUMBER",
                        "readonly": true
                    }
                }
            },

            "LoanUtilisation": {
                "type": "box",
                "title": "LOAN_UTILIZATION",
                "items": {
                    "loanSeries": {
                        orderNo: 10,
                        key: "loanMonitoringDetails.loanSeries",
                        type: "number",
                        "readonly": true
                    },
                    "loanProductName": {
                        orderNo: 20,
                        key: "loanMonitoringDetails.loanProductName",
                        type: "string",
                        "readonly": true
                    },
                    "loanPurposeCategory": {
                        orderNo: 30,
                        key: "loanMonitoringDetails.loanPurposeCategory",
                        "readonly": true,
                        title: "LOAN_PURPOSE_1",
                    },
                    "loanPurpose": {
                        orderNo: 40,
                        key: "loanMonitoringDetails.loanPurpose",
                        title: "LOAN_SUB_PURPOSE",
                        "readonly": true
                    },
                    "loanAmount": {
                        orderNo: 50,
                        key: "loanMonitoringDetails.loanAmount",
                        type: "amount",
                        //"readonly": true
                    },
                    "disbursementDate": {
                        orderNo: 60,
                        key: "loanMonitoringDetails.disbursementDate",
                        type: "date",
                        "readonly": true
                    },
                    "AssetPurchase": {
                        orderNo: 70,
                        type: "fieldset",
                        title: "Asset Purchase",
                        items: {
                            "numberOfAssetsDelivered": {
                                key: "loanMonitoringDetails.numberOfAssetsDelivered",
                                type: "select",
                                titleMap: {
                                    "ALL": "All",
                                    "SOME": "Some",
                                    "NONE": "None",
                                },
                            },
                            "amountUtilizedForAssetsPurchase": {
                                key: "loanMonitoringDetails.amountUtilizedForAssetsPurchase",
                                type: "amount",
                                "onChange": function(modelValue, form, model) {
                                    var a = ((parseFloat(model.loanMonitoringDetails.amountUtilizedForAssetsPurchase) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                                    model.loanMonitoringDetails.percentage = parseInt(a.toFixed());
                                }
                            },
                            "percentage": {
                                key: "loanMonitoringDetails.percentage",
                                title: "%OF_AMOUNT_UTILISED",
                                type: "integer",
                                "readonly": true
                            },
                            "totalCreationAssetValue": {
                                key: "loanMonitoringDetails.totalCreationAssetValue",
                                type: "number"
                            },
                            "isAssetsOrdered": {
                                key: "loanMonitoringDetails.isAssetsOrdered",
                                type: "radios",
                                enumCode: "decisionmaker1",
                            },
                            "reasonForNotOrderingAssets": {
                                key: "loanMonitoringDetails.reasonForNotOrderingAssets",
                                type: "string",
                                condition: "model.loanMonitoringDetails.isAssetsOrdered==0",
                            },
                            "machineDetails": {
                                key: "loanMonitoringDetails.machineDetails",
                                type: "array",
                                startEmpty: true,
                                //view:"fixed",
                                title: "MACHINE",
                                items: {

                                    "make": {
                                        key: "loanMonitoringDetails.machineDetails[].make",
                                        type: "string",
                                    },
                                    "type": {
                                        key: "loanMonitoringDetails.machineDetails[].type",
                                        type: "string",
                                    },
                                    "year": {
                                        key: "loanMonitoringDetails.machineDetails[].year",
                                        type: "date",
                                    },
                                    "model": {
                                        key: "loanMonitoringDetails.machineDetails[].model",
                                        type: "string",
                                    },
                                    "serialNumber": {
                                        key: "loanMonitoringDetails.machineDetails[].serialNumber",
                                        type: "string",
                                    },
                                    "assetType": {
                                        key: "loanMonitoringDetails.machineDetails[].assetType",
                                        type: "select",
                                        titleMap: {
                                            "NEW": "NEW",
                                            "OLD": "OLD",
                                        },
                                    },
                                    "udf1": {
                                        key: "loanMonitoringDetails.machineDetails[].udf1",
                                        type: "select",
                                        title: "MACHINE_PERMANENTLY_FIXED_TO_BUILDING",
                                        enumCode: "decisionmaker1",
                                    },
                                    "udf2": {
                                        key: "loanMonitoringDetails.machineDetails[].udf2",
                                        type: "select",
                                        title: "HYPOTHECATED_TO_KINARA",
                                        enumCode: "decisionmaker1",
                                    },
                                    "hypothecationLabelBeenApplied": {
                                        key: "loanMonitoringDetails.machineDetails[].hypothecationLabelBeenApplied",
                                        type: "select",
                                        enumCode: "decisionmaker1",
                                    },
                                    "companyNameInOriginalInvoice": {
                                        key: "loanMonitoringDetails.machineDetails[].companyNameInOriginalInvoice",
                                        type: "select",
                                        enumCode: "decisionmaker1",
                                    },
                                    "hypothecatedTo": {
                                        key: "loanMonitoringDetails.machineDetails[].hypothecatedTo",
                                        type: "select",
                                        titleMap: {
                                            "VHFPL": "VHFPL",
                                        },
                                    }
                                }
                            },
                        }
                    },

                    "LoanDetails": {
                        orderNo: 80,
                        type: "fieldset",
                        title: "Loan Details",
                        items: {
                            "loanAmountUsed": {
                                key: "loanMonitoringDetails.loanAmountUsed",
                                type: "amount",
                                "onChange": function(modelValue, form, model) {
                                    var a = ((parseFloat(model.loanMonitoringDetails.loanAmountUsed) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                                    model.loanMonitoringDetails.amountUsedPercentage = parseInt(a.toFixed());
                                }
                            },
                            "loanAmountPurpose": {
                                key: "loanMonitoringDetails.loanAmountPurpose",
                                type: "select",
                                titleMap: {
                                    "Raw material": "Raw material",
                                },

                            },
                            "verifiedBy": {
                                key: "loanMonitoringDetails.verifiedBy",
                                type: "select",
                                titleMap: {
                                    "Bill ": "Bill ",
                                }
                            },
                            "amountUsedPercentage": {
                                key: "loanMonitoringDetails.amountUsedPercentage",
                                "readonly": true,
                                title: "%OF_AMOUNT_UTILISED",
                                type: "integer"
                            },
                            "intendedPurposeAmount": {
                                key: "loanMonitoringDetails.intendedPurposeAmount",
                                type: "amount",
                                //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                "onChange": function(modelValue, form, model) {
                                    var a = ((parseFloat(model.loanMonitoringDetails.intendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                                    model.loanMonitoringDetails.intendedPurposePercentage = parseInt(a.toFixed());
                                    model.loanMonitoringDetails.nonIntendedPurposeAmount = model.loanMonitoringDetails.loanAmountUsed - model.loanMonitoringDetails.intendedPurposeAmount;
                                    var b = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                                    model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(b.toFixed());
                                }
                            },
                            "intendedPurposePercentage": {
                                key: "loanMonitoringDetails.intendedPurposePercentage",
                                title: "%OF_AMOUNT_UTILISED_FOR_INTENDED_PURPOSE",
                                //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                type: "integer",
                                "readonly": true,
                            },
                            "nonIntendedPurposeAmount": {
                                key: "loanMonitoringDetails.nonIntendedPurposeAmount",
                                //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                type: "amount",

                                /* "onChange": function(modelValue, form, model) {
                                     var a = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                                     model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(a.toFixed());
                                 }*/
                            },
                            "nonIntendedPurposePercentage": {
                                key: "loanMonitoringDetails.nonIntendedPurposePercentage",
                                title: "%OF_AMOUNT_UTILISED_FOR_UNINTENDED_PURPOSE",
                                //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                type: "integer",
                                "readonly": true
                            },
                            "nonIntendedPurposeAmountSpentOn": {
                                key: "loanMonitoringDetails.nonIntendedPurposeAmountSpentOn",
                                //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                            },
                        }
                    },
                    "MachineRefinanceDetails": {
                        orderNo: 90,
                        type: "fieldset",
                        title: "Machine Refinance Details",
                        items: {
                            "repayedDebitAmount": {
                                key: "loanMonitoringDetails.repayedDebitAmount",
                                type: "amount",
                                "onChange": function(modelValue, form, model) {
                                    var a = ((parseFloat(model.loanMonitoringDetails.repayedDebitAmount) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                                    model.loanMonitoringDetails.amountUsedPercentage = parseInt(a.toFixed());
                                }
                            },
                            "monthlyInterestForDebit": {
                                key: "loanMonitoringDetails.monthlyInterestForDebit",
                                type: "amount"
                            },
                            "remainingAmountPurpose": {
                                key: "loanMonitoringDetails.remainingAmountPurpose",
                            },
                            "remainingAmountUtilizedOn": {
                                key: "loanMonitoringDetails.remainingAmountUtilizedOn",
                                type: "date"
                            },
                            "amountUsedPercentage": {
                                key: "loanMonitoringDetails.amountUsedPercentage",
                                title: "%OF_AMOUNT_UTILISED",
                                type: "integer",
                                "readonly": true
                            },
                            "intendedPurposeAmount": {
                                key: "loanMonitoringDetails.intendedPurposeAmount",
                                type: "amount",
                                //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                "onChange": function(modelValue, form, model) {
                                    var a = ((parseFloat(model.loanMonitoringDetails.intendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.repayedDebitAmount)) * 100);
                                    model.loanMonitoringDetails.intendedPurposePercentage = parseInt(a.toFixed());
                                    model.loanMonitoringDetails.nonIntendedPurposeAmount = model.loanMonitoringDetails.repayedDebitAmount - model.loanMonitoringDetails.intendedPurposeAmount;
                                    var b = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.repayedDebitAmount)) * 100);
                                    model.loanMonitoringDetails.nonIntendedPurposePercentage = parseInt(b.toFixed());
                                }
                            },
                            "intendedPurposePercentage": {
                                key: "loanMonitoringDetails.intendedPurposePercentage",
                                title: "%OF_AMOUNT_UTILISED_FOR_INTENDED_PURPOSE",
                                //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                type: "integer",
                                "readonly": true,
                            },
                            "nonIntendedPurposeAmount": {
                                key: "loanMonitoringDetails.nonIntendedPurposeAmount",
                                //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                type: "amount",
                                "readonly": true,
                                /*"onChange": function(modelValue, form, model) {
                                    var a = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                                    model.loanMonitoringDetails.nonIntendedPurposePercentage =parseInt(a.toFixed());
                                }*/
                            },
                            "nonIntendedPurposePercentage": {
                                key: "loanMonitoringDetails.nonIntendedPurposePercentage",
                                title: "%OF_AMOUNT_UTILISED_FOR_UNINTENDED_PURPOSE",
                                //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                type: "integer",
                                "readonly": true
                            },
                            "nonIntendedPurposeAmountSpentOn": {
                                key: "loanMonitoringDetails.nonIntendedPurposeAmountSpentOn",
                                //condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                            }
                        }
                    },
                    "lucDone": {
                        orderNo: 100,
                        key: "loanMonitoringDetails.lucDone",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucDone == "Yes") {
                                model.loanMonitoringDetails.lucRescheduled = "No";
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    },
                    "lucRescheduled": {
                        orderNo: 110,
                        key: "loanMonitoringDetails.lucRescheduled",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucRescheduled == "Yes") {
                                model.loanMonitoringDetails.lucEscalated = "No";
                            }
                        }
                    },
                    "udf2": {
                        orderNo: 120,
                        key: "loanMonitoringDetails.udf2",
                        type: "select",
                        title: "RESCHEDULED_REMARKS",
                        titleMap: {
                            "Partially utilized ": "Partially utilized ",
                            "Not utilized ": "Not utilized ",
                            "Customer not available": "Customer not available",
                        },
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    },
                    "lucRescheduleReason": {
                        orderNo: 130,
                        key: "loanMonitoringDetails.lucRescheduleReason",
                        type: "string",
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    },
                    "lucRescheduledDate": {
                        orderNo: 140,
                        key: "loanMonitoringDetails.lucRescheduledDate",
                        type: "date",
                        condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && (model.loanMonitoringDetails.currentStage =='LUCSchedule'||model.loanMonitoringDetails.currentStage =='LUCReschedule')",
                    },
                    "lucEscalated": {
                        orderNo: 150,
                        key: "loanMonitoringDetails.lucEscalated",
                        type: "radios",
                        enumCode: "decisionmaker1",
                        condition: "model.loanMonitoringDetails.lucDone=='No' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    },
                    "lucEscalatedReason": {
                        orderNo: 160,
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
                    },
                    "udf3": {
                        orderNo: 170,
                        key: "loanMonitoringDetails.udf3",
                        title: "ESCALATED_REMARKS",
                        condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                    }
                }
            },
            "RescheduleActionBox": {
                "type": "actionbox",
                condition: "model.loanMonitoringDetails.lucRescheduled=='Yes' && model.loanMonitoringDetails.lucEscalated=='No' ",
                "items": {
                    "ReScheduleButton": {
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
                    }
                }
            },
            "EscalateActionbox": {
                "type": "actionbox",
                condition: "model.loanMonitoringDetails.lucEscalated=='Yes' && model.loanMonitoringDetails.currentStage !=='LUCLegalRecovery'",
                "items": {
                    "Escalatebutton": {
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
                    }
                }
            },
            "submitactionbox": {
                "type": "actionbox",
                condition: "model.loanMonitoringDetails.lucDone== 'Yes' && !model.lucCompleted",
                "items": {
                    "submitbutton": {
                        "type": "submit",
                        "title": "Close"
                    }
                }
            },
            "saveactionbox": {
                "type": "actionbox",
                condition: "!model.lucCompleted",
                "items": {
                    "save": {
                        "type": "save",
                        "title": "OffLine Save"
                    }
                }
            },
            "SendBackactionbox": {
                "type": "actionbox",
                condition: "model.loanMonitoringDetails.currentStage=='LUCEscalate'|| model.loanMonitoringDetails.currentStage=='LUCLegalRecovery'",
                "items": {
                    "sendbackbutton": {
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
                    }
                }
            },
            "Backactionbox": {
                "type": "actionbox",
                condition: "model.lucCompleted",
                "items": {
                    "backbutton": {
                        type: "button",
                        icon: "fa fa-step-backward",
                        title: "Back",
                        onClick: function(model, formCtrl) {
                            irfNavigator.goBack();
                        }
                    }
                }
            },
        };


        return {
            getFormDefinition: function(formName, formRequest, configFile, model) {
                var form = [],
                    keys;
                if (Object.keys(formRepository).indexOf(formName) === -1)
                    return form;
                if (!formRequest || !_.isObject(formRequest)) {
                    return form;
                }
                keys = Object.keys(formRequest);
                if (!keys || keys.length < 0 || keys.indexOf("overrides") === -1 || keys.indexOf("includes") === -1 || keys.indexOf("excludes") === -1) {
                    return form;
                }
                var includes = formRequest.includes || [];
                var excludes = formRequest.excludes || [];
                var overrides = formRequest.overrides || {};

                if (_.isObject(configFile)) {
                    var configKeys = Object.keys(configFile)
                    for (var i = 0; i < configKeys.length; i++) {
                        var _k = jsonPath(model, configKeys[i])[0];
                        var configObject = jsonPath(configFile[configKeys[i]], _k)[0];

                        if (_.hasIn(configObject, "excludes")) {
                            configObject.excludes.map(function(v) {
                                excludes.push(v);
                            });

                        }
                        if (_.hasIn(configObject, "overrides")) {
                            overrides = _.merge(overrides, configObject.overrides);
                        }

                    }
                }


                // for(var i=0; i< requestParam.length; i++) {


                //      if(_.hasIn(configFile[requestParam[i]], "excludes")) {

                //         // configFile[requestParam[i]].excludes.map(function(v) {
                //         //     excludes.push(v);
                //         // });

                //         configFile[requestParam[i]].excludes.reduce(function(acc, curval) {
                //             excludes.push(curval);
                //         })

                //      }
                //      if(_.hasIn(configFile[requestParam[i]], "overrides")) {
                //          overrides = _.merge(overrides, configFile[requestParam[i]].overrides);
                //      }

                // }

                var getKeyString = function(parentKey, key) {
                    if (!parentKey || parentKey === "") {
                        return key;
                    }
                    return parentKey + "." + key;
                }
                var orderFormItems = function(objA, objB) {
                    if (_.isUndefined(objA.orderNo) && !_.isUndefined(objB.orderNo)) return 1;
                    if (!_.isUndefined(objA.orderNo) && _.isUndefined(objB.orderNo)) return -1;
                    if (_.isUndefined(objA.orderNo) && _.isUndefined(objB.orderNo)) return 0;
                    return (objA.orderNo - objB.orderNo);
                }
                var constructForm = function(repo, form, parent, main) {
                    var keylist = Object.keys(repo);
                    var _defn, _key, _items;
                    var _parentKey = parent ? parent : "";
                    for (var itr = 0; itr < keylist.length; itr++) {
                        _key = getKeyString(_parentKey, keylist[itr]);
                        if ((main && includes.indexOf(_key) === -1) || excludes.indexOf(_key) > -1) {
                            //if this is the outermost level of form definition, then include is mandatory
                            //All the excludes are not processed.
                            continue;
                        }

                        if (overrides[_key]) {
                            _defn = _.merge({}, repo[keylist[itr]], overrides[_key]);
                        } else {
                            _defn = _.merge({}, repo[keylist[itr]]);
                        }
                        if (_defn.items) {

                            _items = _.merge({}, _defn.items);
                            _defn.items = [];

                            constructForm(_items, _defn.items, _key, true);
                        }
                        form.push(_defn);
                    }
                    form.sort(orderFormItems);
                }
                constructForm(formRepository[formName], form, undefined, true);
                return form;
            }
        }
    }
]);