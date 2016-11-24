irf.pageCollection.factory(irf.page("loans.individual.luc.LucData"),

    ["$log", "$state", "$stateParams", "LUC", "LucHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries",

        function($log, $state, $stateParams, LUC, LucHelper, SessionStore, formHelper, $q, irfProgressMessage,
            PageHelper, Utils, PagesDefinition, Queries) {

            var branch = SessionStore.getBranch();
            return {
                "type": "schema-form",
                "title": "LUC_DATA_CAPTURE",
                "subTitle": "LUC",
                initialize: function(model, form, formCtrl) {

                    model.loanMonitoringDetails = model.loanMonitoringDetails || {};
                    //model.branchId = SessionStore.getBranchId() + '';
                    //model.lead.currentDate = model.lead.currentDate || Utils.getCurrentDate();
                    model = Utils.removeNulls(model, true);
                    //model.lead.branchName = SessionStore.getBranch();
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
                                model = Utils.removeNulls(model, true);
                                PageHelper.hideLoader();
                            }
                        );
                    }
                },
                offline: false,
                getOfflineDisplayItem: function(item, index) {
                    return [
                        //item.lead.leadName
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
                                type: "select",
                                enumCode: "loan_purpose_1"
                            }, {
                                key: "loanMonitoringDetails.loanPurpose",
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
                                    type: "integer",
                                    "readonly": true

                                }, {
                                    key: "loanMonitoringDetails.totalCreationAssetValue",
                                    type: "number"
                                }, {
                                    key: "loanMonitoringDetails.isAssetsOrdered",
                                    type: "radios",
                                    titleMap: {
                                        1: "Yes",
                                        0: "No",
                                    },
                                    // enumCode: "decisionmaker",
                                }, {
                                    key: "loanMonitoringDetails.reasonForNotOrderingAssets",
                                    type: "string",
                                    condition: "model.loanMonitoringDetails.isAssetsOrdered==0",
                                }, {
                                    key: "loanMonitoringDetails.lucDone",
                                    type: "radios",
                                    titleMap: {
                                        1: "Yes",
                                        0: "No",
                                    },
                                    //enumCode: "decisionmaker",
                                }, {
                                    key: "loanMonitoringDetails.lucRescheduled",
                                    condition: "model.loanMonitoringDetails.lucDone=='0'",
                                    type: "radios",
                                    titleMap: {
                                        1: "Yes",
                                        0: "No",
                                    },
                                    //enumCode: "decisionmaker",
                                }, {
                                    key: "loanMonitoringDetails.lucRescheduleReason",
                                    type: "string",
                                    condition: "model.loanMonitoringDetails.lucRescheduled==1",
                                }, {
                                    key: "loanMonitoringDetails.lucRescheduledDate",
                                    type: "date",
                                    condition: "model.loanMonitoringDetails.lucRescheduled==1",
                                }, {
                                    key: "loanMonitoringDetails.lucEscalated",
                                    type: "radios",
                                    titleMap: {
                                        1: "Yes",
                                        0: "No",
                                    },
                                    //enumCode: "decisionmaker",
                                    condition: "model.loanMonitoringDetails.lucDone=='0'",
                                }, {
                                    key: "loanMonitoringDetails.lucEscalatedReason",
                                    type: "string",
                                    condition: "model.loanMonitoringDetails.lucEscalated=='1'",
                                }, {
                                    key: "loanMonitoringDetails.machineDetails",
                                    type: "array",
                                    startEmpty: true,
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
                                        key: "loanMonitoringDetails.machineDetails[].hypothecationLabelBeenApplied",
                                        type: "radios",
                                        titleMap: {
                                            1: "Yes",
                                            0: "No",
                                        },
                                        //enumCode: "decisionmaker",
                                    }, {
                                        key: "loanMonitoringDetails.machineDetails[].companyNameInOriginalInvoice",
                                        type: "radios",
                                        titleMap: {
                                            1: "Yes",
                                            0: "No",
                                        },
                                        //enumCode: "decisionmaker",
                                    }, {
                                        key: "loanMonitoringDetails.machineDetails[].hypothecatedTo",
                                        type: "select",
                                        titleMap: {
                                            "NEW": "NEW",
                                            "OLD": "OLD",
                                        },
                                    }]
                                }]
                            }, {
                                type: "fieldset",
                                title: "",
                                condition: "model.loanMonitoringDetails.loanPurposeCategory == 'Working Capital'||model.loanMonitoringDetails.loanPurposeCategory == 'Business Development'",
                                items: [{
                                    key: "loanMonitoringDetails.loanAmountUsed",
                                    type: "number",
                                     "onChange": function(modelValue, form, model) {
                                        var a = ((parseFloat(model.loanMonitoringDetails.loanAmountUsed) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                                        model.loanMonitoringDetails.amountUsedPercentage = parseInt(a.toFixed());
                                    }

                                }, {
                                    key: "loanMonitoringDetails.loanAmountPurpose",

                                }, {
                                    key: "loanMonitoringDetails.verifiedBy",
                                }, {
                                    key: "loanMonitoringDetails.amountUsedPercentage",
                                    "readonly": true,
                                    type: "integer"
                                }, {
                                    key: "loanMonitoringDetails.intendedPurposeAmount",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                     "onChange": function(modelValue, form, model) {
                                        var a = ((parseFloat(model.loanMonitoringDetails.intendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                                        model.loanMonitoringDetails.intendedPurposePercentage = parseInt(a.toFixed());
                                    }
                                }, {
                                    key: "loanMonitoringDetails.intendedPurposePercentage",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    type: "integer",
                                    "readonly": true,
                                }, {
                                    key: "loanMonitoringDetails.nonIntendedPurposeAmount",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    type: "number",
                                     "onChange": function(modelValue, form, model) {
                                        var a = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                                        model.loanMonitoringDetails.nonIntendedPurposePercentage =parseInt(a.toFixed());
                                    }
                                }, {
                                    key: "loanMonitoringDetails.nonIntendedPurposePercentage",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    type: "integer",
                                    "readonly": true
                                }, {
                                    key: "loanMonitoringDetails.nonIntendedPurposeAmountSpentOn",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                }, {
                                    key: "loanMonitoringDetails.lucDone",
                                    type: "radios",
                                    titleMap: {
                                        1: "Yes",
                                        0: "No",
                                    },
                                    //enumCode: "decisionmaker",
                                }, {
                                    key: "loanMonitoringDetails.lucRescheduled",
                                    condition: "model.loanMonitoringDetails.lucDone=='0'",
                                    type: "radios",
                                    titleMap: {
                                        1: "Yes",
                                        0: "No",
                                    },
                                    //enumCode: "decisionmaker",
                                }, {
                                    key: "loanMonitoringDetails.lucRescheduleReason",
                                    type: "string",
                                    condition: "model.loanMonitoringDetails.lucRescheduled==1",
                                }, {
                                    key: "loanMonitoringDetails.lucRescheduledDate",
                                    type: "date",
                                    condition: "model.loanMonitoringDetails.lucRescheduled==1",
                                }, {
                                    key: "loanMonitoringDetails.lucEscalated",
                                    type: "radios",
                                    titleMap: {
                                        1: "Yes",
                                        0: "No",
                                    },
                                    //enumCode: "decisionmaker",
                                    condition: "model.loanMonitoringDetails.lucDone=='0'",
                                }, {
                                    key: "loanMonitoringDetails.lucEscalatedReason",
                                    type: "string",
                                    condition: "model.loanMonitoringDetails.lucEscalated=='1'",
                                }]
                            }, {
                                type: "fieldset",
                                title: "",
                                condition: "model.loanMonitoringDetails.loanPurposeCategory == 'Machine Refinance'",
                                items: [{
                                    key: "loanMonitoringDetails.repayedDebitAmount",
                                    type: "number",
                                     "onChange": function(modelValue, form, model) {
                                        var a = ((parseFloat(model.loanMonitoringDetails.repayedDebitAmount) / parseFloat(model.loanMonitoringDetails.loanAmount)) * 100);
                                        model.loanMonitoringDetails.amountUsedPercentage =parseInt(a.toFixed());
                                    }
                                }, {
                                    key: "loanMonitoringDetails.monthlyInterestForDebit",
                                    type: "number"
                                }, {
                                    key: "loanMonitoringDetails.remainingAmountPurpose",
                                }, {
                                    key: "loanMonitoringDetails.remainingAmountUtilizedOn",
                                    type: "date"
                                }, {
                                    key: "loanMonitoringDetails.amountUsedPercentage",
                                    type: "integer",
                                    "readonly": true
                                },{
                                    key: "loanMonitoringDetails.intendedPurposeAmount",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                     "onChange": function(modelValue, form, model) {
                                        var a = ((parseFloat(model.loanMonitoringDetails.intendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                                        model.loanMonitoringDetails.intendedPurposePercentage = parseInt(a.toFixed());
                                    }
                                }, {
                                    key: "loanMonitoringDetails.intendedPurposePercentage",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    type: "integer",
                                    "readonly": true,
                                }, {
                                    key: "loanMonitoringDetails.nonIntendedPurposeAmount",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    type: "number",
                                     "onChange": function(modelValue, form, model) {
                                        var a = ((parseFloat(model.loanMonitoringDetails.nonIntendedPurposeAmount) / parseFloat(model.loanMonitoringDetails.loanAmountUsed)) * 100);
                                        model.loanMonitoringDetails.nonIntendedPurposePercentage =parseInt(a.toFixed());
                                    }
                                }, {
                                    key: "loanMonitoringDetails.nonIntendedPurposePercentage",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                    type: "integer",
                                    "readonly": true
                                }, {
                                    key: "loanMonitoringDetails.nonIntendedPurposeAmountSpentOn",
                                    condition: "model.loanMonitoringDetails.amountUsedPercentage<100",
                                }, {
                                    key: "loanMonitoringDetails.lucDone",
                                    type: "radios",
                                    titleMap: {
                                        1: "Yes",
                                        0: "No",
                                    },
                                    //enumCode: "decisionmaker",
                                }, {
                                    key: "loanMonitoringDetails.lucRescheduled",
                                    condition: "model.loanMonitoringDetails.lucDone=='0'",
                                    type: "radios",
                                    titleMap: {
                                        1: "Yes",
                                        0: "No",
                                    },
                                    //enumCode: "decisionmaker",
                                }, {
                                    key: "loanMonitoringDetails.lucRescheduleReason",
                                    type: "string",
                                    condition: "model.loanMonitoringDetails.lucRescheduled==1",
                                }, {
                                    key: "loanMonitoringDetails.lucRescheduledDate",
                                    type: "date",
                                    condition: "model.loanMonitoringDetails.lucRescheduled==1",
                                }, {
                                    key: "loanMonitoringDetails.lucEscalated",
                                    type: "radios",
                                    titleMap: {
                                        1: "Yes",
                                        0: "No",
                                    },
                                    //enumCode: "decisionmaker",
                                    condition: "model.loanMonitoringDetails.lucDone=='0'",
                                }, {
                                    key: "loanMonitoringDetails.lucEscalatedReason",
                                    type: "string",
                                    condition: "model.loanMonitoringDetails.lucEscalated=='1'",
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
                                type: "number"
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
                                type: "number"
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
                        "items": [{
                            "type": "submit",
                            "title": "Submit"
                        }]
                    },
                ],
                schema: function() {
                    return LUC.getSchema().$promise;
                },

                actions: {
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
                                $state.go('Page.Landing', null);
                            });

                        } else {
                            $log.info("Id is not in the model");
                        }
                    }
                }
            };
        }
    ]);