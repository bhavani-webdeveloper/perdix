irf.pageCollection.factory(irf.page("loans.individual.luc.LucData"),

    ["$log", "$state", "$stateParams", "LUC", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries",

        function($log, $state, $stateParams, LUC, SessionStore, formHelper, $q, irfProgressMessage,
            PageHelper, Utils, PagesDefinition, Queries) {

            var branch = SessionStore.getBranch();
            return {
                "type": "schema-form",
                "title": "LUC_DATA_CAPTURE",
                "subTitle": "LUC",
                initialize: function(model, form, formCtrl) {

                    model.luc = model.luc || {};
                    //model.branchId = SessionStore.getBranchId() + '';
                    //model.lead.currentDate = model.lead.currentDate || Utils.getCurrentDate();
                    model = Utils.removeNulls(model, true);
                    //model.lead.branchName = SessionStore.getBranch();
                    $log.info("lead generation page got initiated");

                    /* if (!(model && model.lead && model.lead.id && model.$$STORAGE_KEY$$)) {
                         PageHelper.showLoader();
                         PageHelper.showProgress("page-init", "Loading...");
                         var leadId = $stateParams.pageId;
                         if (!leadId) {
                             PageHelper.hideLoader();
                         }
                         Lead.get({
                                 id: leadId
                             },
                             function(res) {
                                 _.assign(model.lead, res);
                                 model = Utils.removeNulls(model, true);
                                 PageHelper.hideLoader();
                             }
                         );
                     }*/
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
                            key: "luc.loanMonitoringDetails[].customerId",
                            type: "number"
                        }, {
                            key: "luc.loanMonitoringDetails[].customerName",
                            type: "string"
                        }, {
                            key: "luc.loanMonitoringDetails[].address",
                            type: "string"
                        }, {
                            key: "luc.loanMonitoringDetails[].companyName",
                            type: "string"
                        }, {
                            key: "luc.loanMonitoringDetails[].proprietoryName",
                            type: "string"
                        }, {
                            key: "luc.loanMonitoringDetails[].loanId",
                            type: "number"
                        }]
                    }, {
                        "type": "box",
                        "title": "LOAN_UTILIZATION",
                        "items": [{
                                key: "luc.loanMonitoringDetails[].loanSeries",
                                type: "number"
                            }, {
                                key: "luc.loanMonitoringDetails[].loanProductName",
                                type: "string"
                            }, {
                                key: "luc.loanMonitoringDetails[].loanPurposeCategory",
                                type: "select"
                            }, {
                                key: "luc.loanMonitoringDetails[].loanPurpose",
                                type: "select"
                            }, {
                                key: "luc.loanMonitoringDetails[].loanAmount",
                                type: "amount"
                            }, {
                                key: "luc.loanMonitoringDetails[].disbursementDate",
                                type: "date"
                            }, {
                                key: "luc.loanMonitoringDetails[].numberOfAssetsDelivered",
                                type: "number"
                            }, {
                                key: "luc.loanMonitoringDetails[].amountUtilizedForAssetsPurchase",
                                type: "amount"
                            }, {
                                key: "luc.loanMonitoringDetails[].percentage",
                                type: "number"
                            }, {
                                key: "luc.loanMonitoringDetails[].totalCreationAssetValue",
                                type: "number"
                            }, {
                                key: "luc.loanMonitoringDetails[].isAssetsOrdered",
                                type: "radios"
                            }, {
                                key: "luc.loanMonitoringDetails[].reasonForNotOrderingAssets",
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
                                key: "luc.loanMonitoringDetails[].lucDone",
                                type: "radios"
                            }, {
                                key: "luc.loanMonitoringDetails[].lucRescheduled",
                                type: "radios"
                            }, {
                                key: "luc.loanMonitoringDetails[].lucRescheduleReason",
                                type: "string"
                            }, {
                                key: "luc.loanMonitoringDetails[].lucRescheduledDate",
                                type: "date"
                            }, {
                                key: "luc.loanMonitoringDetails[].lucEscalated",
                                type: "radios"
                            }, {
                                key: "luc.loanMonitoringDetails[].lucEscalatedReason",
                                type: "string"
                            }, {
                                key: "machineDetails",
                                type: "array",
                                startEmpty: true,
                                title: "Machines",
                                items: [{
                                    key: "luc.machineDetails[].make",
                                    type: "string",
                                }, {
                                    key: "luc.machineDetails[].type",
                                    type: "string",
                                }, {
                                    key: "luc.machineDetails[].year",
                                    type: "date",
                                }, {
                                    key: "luc.machineDetails[].model",
                                    type: "string",
                                }, {
                                    key: "luc.machineDetails[].serialNumber",
                                    type: "string",
                                }, {
                                    key: "luc.machineDetails[].assetType",
                                    type: "select",
                                }, {
                                    key: "luc.machineDetails[].hypothecationLabelBeenApplied",
                                    type: "radios",
                                }, {
                                    key: "luc.machineDetails[].companyNameInOriginalInvoice",
                                    type: "radios",
                                }, {
                                    key: "luc.machineDetails[].hypothecatedTo",
                                    type: "select",
                                }]
                            },

                        ]
                    },

                    {
                        "type": "box",
                        "title": "SOCIAL_IMPACT",
                        "items": [{
                            "type": "fieldset",
                            "title": "EMPLOYEE_INFORMATION",
                            "items": [{
                                type: "fieldset",
                                title: "MEN",
                                items: [{
                                    key: "luc.socialImpactDetails[].totalNumberOfMen",
                                    type: "number"
                                }, {
                                    key: "luc.socialImpactDetails[].averageSalaryOfMen",
                                    type: "amount"
                                }, {
                                    key: "luc.socialImpactDetails[].menPartTimeEmployee",
                                    type: "number"
                                }, {
                                    key: "luc.socialImpactDetails[].menFullTimeEmployee",
                                    type: "number"
                                }, {
                                    key: "luc.socialImpactDetails[].avgSkillLevelOfMen",
                                    type: "string"
                                }, {
                                    key: "luc.socialImpactDetails[].noOfFirstJobsMen",
                                    type: "number"
                                }]
                            }, {
                                type: "fieldset",
                                title: "WOMEN",
                                items: [{
                                    key: "luc.socialImpactDetails[].totalNumberOfWomen",
                                    type: "number"
                                }, {
                                    key: "luc.socialImpactDetails[].averageSalaryOfWomen",
                                    type: "amount"
                                }, {
                                    key: "luc.socialImpactDetails[].womenPartTimeEmployee",
                                    type: "number"
                                }, {
                                    key: "luc.socialImpactDetails[].womenFullTimeEmployee",
                                    type: "number"
                                }, {
                                    key: "luc.socialImpactDetails[].avgSkillLevelOfWomen",
                                    type: "string"
                                }, {
                                    key: "luc.socialImpactDetails[].noOfFirstJobsWomen",
                                    type: "number"
                                }]
                            }]
                        }, {
                            "type": "fieldset",
                            "title": "PRE_LOAN_DETAILS",
                            "items": [{
                                key: "luc.socialImpactDetails[].preLoanMonthlyRevenue",
                                type: "string"
                            }, {
                                key: "luc.socialImpactDetails[].preLoanMonthlyNetIncome",
                                type: "amount"
                            }, {
                                key: "luc.socialImpactDetails[].preLoanProprietorSalary",
                                type: "amount"
                            }, {
                                key: "luc.socialImpactDetails[].preLoanNumberOfCustomersOrBuyers",
                                type: "select"
                            }]
                        }, {
                            "type": "fieldset",
                            "title": "POST_LOAN_DETAILS",
                            "items": [{
                                key: "luc.socialImpactDetails[].postLoanMonthlyRevenue",
                                type: "string"
                            }, {
                                key: "luc.socialImpactDetails[].postLoanMonthlyNetIncome",
                                type: "amount"
                            }, {
                                key: "luc.socialImpactDetails[].postLoanProprietorSalary",
                                type: "amount"
                            }, {
                                key: "luc.socialImpactDetails[].postLoanNumberOfCustomersOrBuyers",
                                type: "select"
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
                        /*var sortFn = function(unordered) {
                            var out = {};
                            Object.keys(unordered).sort().forEach(function(key) {
                                out[key] = unordered[key];
                            });
                            return out;
                        };
                        var reqData = _.cloneDeep(model);
                        if (reqData.lead.id) {
                            if (reqData.lead.leadStatus == "FollowUp") {
                                LeadHelper.followData(reqData).then(function(resp) {
                                    $state.go('Page.Landing', null);
                                });
                            } else {
                                LeadHelper.proceedData(reqData).then(function(resp) {
                                    $state.go('Page.Landing', null);
                                }, function(err) {
                                    Utils.removeNulls(res.lead, true);
                                    model.lead = res.lead;
                                });
                            }
                        } else {
                            LeadHelper.saveData(reqData).then(function(res) {
                                LeadHelper.proceedData(res).then(function(resp) {
                                    $state.go('Page.Landing', null);
                                }, function(err) {
                                    Utils.removeNulls(res.lead, true);
                                    model.lead = res.lead;
                                });
                            });
                        }*/
                    }
                }
            };
        }
    ]);