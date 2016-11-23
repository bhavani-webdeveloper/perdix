irf.pageCollection.factory(irf.page("loans.individual.luc.LucData"),

    ["$log", "$state", "$stateParams", "LUC","LucHelper","SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries",

        function($log, $state, $stateParams, LUC,LucHelper,SessionStore, formHelper, $q, irfProgressMessage,
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
                        }, {
                            key: "loanMonitoringDetails.customerId",
                            type: "number"
                        }, {
                            key: "loanMonitoringDetails.customerName",
                            type: "string"
                        }, {
                            key: "loanMonitoringDetails.address",
                            type: "string"
                        }, {
                            key: "loanMonitoringDetails.proprietoryName",
                            type: "string"
                        }, {
                            key: "loanMonitoringDetails.loanId",
                            type: "number",
                            "readonly":true
                        }]
                    }, {
                        "type": "box",
                        "title": "LOAN_UTILIZATION",
                        "items": [{
                                key: "loanMonitoringDetails.loanSeries",
                                type: "number"
                            }, {
                                key: "loanMonitoringDetails.loanProductName",
                                type: "string"
                            }, {
                                key: "loanMonitoringDetails.loanPurposeCategory",
                                type: "select",
                                enumCode:"loan_purpose_1"
                            }, {
                                key: "loanMonitoringDetails.loanPurpose",
                            }, {
                                key: "loanMonitoringDetails.loanAmount",
                                type: "amount"
                            }, {
                                key: "loanMonitoringDetails.disbursementDate",
                                type: "date"
                            }, {
                                key: "loanMonitoringDetails.numberOfAssetsDelivered",
                                type: "select",
                                titleMap: {
                                        "ALL": "All",
                                        "SOME": "Some",
                                        "NONE": "None",
                                    },
                            }, {
                                key: "loanMonitoringDetails.amountUtilizedForAssetsPurchase",
                                type: "amount"
                            }, {
                                key: "loanMonitoringDetails.percentage",
                                type: "number",
                            }, {
                                key: "loanMonitoringDetails.totalCreationAssetValue",
                                type: "number"
                            }, {
                                key: "loanMonitoringDetails.isAssetsOrdered",
                               /* type: "radios",
                                enumCode: "decisionmaker",*/
                            }, {
                                key: "loanMonitoringDetails.reasonForNotOrderingAssets",
                                type: "string"
                            },
                            /* {
                                                            key: "howMuchOfLoanAmountUsed?",
                                                            type: "select"
                                                        }, {
                                                            key: "whatWasItUsedFor?",
                                                            type: "select"
                                                        }, {
                                                            key: "verifiedBy",
                                                            type: "select"
                                                        }, {
                                                            key: "%ofAmountUsed",
                                                            type: "select"
                                                        }, {
                                                            key: "intendedPurpose(Amt)%",
                                                            type: "select"
                                                        }, {
                                                            key: "nonIntendedPurpose(Amt)%",
                                                            type: "select"
                                                        }, {
                                                            key: "IfTheAmountIsNotUsedForIntendedPurposeWhatWasItUsedFor?",
                                                            type: "select"
                                                        } , {
                                key: "howMuchAmountHasBeenUsedForRepayingDepit",
                                type: "number"
                            }, {
                                key: "whatWasTheMonthlyPaymentBeforeRefinance",
                                type: "select"
                            },*/
                            {
                                key: "loanMonitoringDetails.lucDone",
                                /*type: "radios",
                                enumCode: "decisionmaker",*/
                            }, {
                                key: "loanMonitoringDetails.lucRescheduled",
                               /* type: "radios",
                                enumCode: "decisionmaker",*/
                            }, {
                                key: "loanMonitoringDetails.lucRescheduleReason",
                                type: "string"
                            }, {
                                key: "loanMonitoringDetails.lucRescheduledDate",
                                type: "date"
                            }, {
                                key: "loanMonitoringDetails.lucEscalated",
                                /*type: "radios",
                                enumCode: "decisionmaker",*/
                            }, {
                                key: "loanMonitoringDetails.lucEscalatedReason",
                                type: "string"
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
                                    enumCode: "decisionmaker",
                                }, {
                                    key: "loanMonitoringDetails.machineDetails[].companyNameInOriginalInvoice",
                                    type: "radios",
                                    enumCode: "decisionmaker",
                                }, {
                                    key: "loanMonitoringDetails.machineDetails[].hypothecatedTo",
                                    type: "select",
                                     titleMap: {
                                        "NEW": "NEW",
                                        "OLD": "OLD",
                                    },
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
                    },
                    {
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
                        if (reqData.loanMonitoringDetails.id) {
                            LucHelper.proceedData(reqData).then(function(resp) {
                                //$state.go('Page.Landing', null);
                            });
                            
                        } else {
                            $log.info("Id is not in the model");
                        }
                    }
                }
            };
        }
    ]);