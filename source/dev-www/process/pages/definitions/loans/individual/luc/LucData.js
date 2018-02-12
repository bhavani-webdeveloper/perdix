define({
    pageUID: "loans.individual.luc.LucData",
    pageType: "Engine",
    dependencies: ["$log", "$state", "$stateParams", "LUC","LucFormRequestProcessor", "Enrollment", "IndividualLoan", "LucHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"],
    $pageFn: function($log, $state, $stateParams, LUC,LucFormRequestProcessor, Enrollment, IndividualLoan, LucHelper, SessionStore, formHelper, $q, irfProgressMessage,
            PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

            var branch = SessionStore.getBranch();

            var validateDate = function(req) {
                if (req.loanMonitoringDetails && req.loanMonitoringDetails.lucRescheduledDate) {
                    var today = moment(new Date()).format("YYYY-MM-DD");
                        if (req.loanMonitoringDetails.lucRescheduledDate <= today ) {
                            $log.info("bad night");
                            PageHelper.showProgress('validate-error', 'Rescheduled Date: Rescheduled Date must be a Future Date', 5000);
                            return false;
                        }    
                }
                return true;
            }

            var orderLUCDocuments = function(model){

                var lucDocuments = model.loanMonitoringDetails.loanMonitoringDocuments || [];

                for(var i = 0; i < lucDocuments.length; i++){

                    lucDocuments[i]["documentSl"] = (i + 1);
                }
            }

            var getOverrides = function (model) {
                return {

                }
            }

            var getIncludes = function(model) {
                return [
                    "LUC",
                    "LUC.id",
                    "LUC.customerId",
                    "LUC.customerName",
                    "LUC.address",
                    "LUC.proprietoryName",
                    "LUC.loanId",
                    "LUC.udf1",
                    "LoanUtilisation",
                    "LoanUtilisation.loanSeries",
                    "LoanUtilisation.loanProductName",
                    "LoanUtilisation.loanPurposeCategory",
                    "LoanUtilisation.loanPurpose",
                    "LoanUtilisation.loanAmount",
                    "LoanUtilisation.disbursementDate",
                    "LoanUtilisation.AssetPurchase",
                    "LoanUtilisation.AssetPurchase.numberOfAssetsDelivered",
                    "LoanUtilisation.AssetPurchase.amountUtilizedForAssetsPurchase",
                    "LoanUtilisation.AssetPurchase.percentage",
                    "LoanUtilisation.AssetPurchase.totalCreationAssetValue",
                    "LoanUtilisation.AssetPurchase.isAssetsOrdered",
                    "LoanUtilisation.AssetPurchase.reasonForNotOrderingAssets",
                    "LoanUtilisation.AssetPurchase.machineDetails",
                    "LoanUtilisation.AssetPurchase.machineDetails.make",
                    "LoanUtilisation.AssetPurchase.machineDetails.type",
                    "LoanUtilisation.AssetPurchase.machineDetails.year",
                    "LoanUtilisation.AssetPurchase.machineDetails.model",
                    "LoanUtilisation.AssetPurchase.machineDetails.serialNumber",
                    "LoanUtilisation.AssetPurchase.machineDetails.assetType",
                    "LoanUtilisation.AssetPurchase.machineDetails.udf1",
                    "LoanUtilisation.AssetPurchase.machineDetails.udf2",
                    "LoanUtilisation.AssetPurchase.machineDetails.hypothecationLabelBeenApplied",
                    "LoanUtilisation.AssetPurchase.machineDetails.companyNameInOriginalInvoice",
                    "LoanUtilisation.AssetPurchase.machineDetails.hypothecatedTo",
                    "LoanUtilisation.LoanDetails",
                    "LoanUtilisation.LoanDetails.loanAmountUsed",
                    "LoanUtilisation.LoanDetails.loanAmountPurpose",
                    "LoanUtilisation.LoanDetails.verifiedBy",
                    "LoanUtilisation.LoanDetails.amountUsedPercentage",
                    "LoanUtilisation.LoanDetails.intendedPurposeAmount",
                    "LoanUtilisation.LoanDetails.intendedPurposePercentage",
                    "LoanUtilisation.LoanDetails.nonIntendedPurposeAmount",
                    "LoanUtilisation.LoanDetails.nonIntendedPurposePercentage",
                    "LoanUtilisation.LoanDetails.nonIntendedPurposeAmountSpentOn",
                    "LoanUtilisation.MachineRefinanceDetails",
                    "LoanUtilisation.MachineRefinanceDetails.repayedDebitAmount",
                    "LoanUtilisation.MachineRefinanceDetails.monthlyInterestForDebit",
                    "LoanUtilisation.MachineRefinanceDetails.remainingAmountPurpose",
                    "LoanUtilisation.MachineRefinanceDetails.remainingAmountUtilizedOn",
                    "LoanUtilisation.MachineRefinanceDetails.amountUsedPercentage",
                    "LoanUtilisation.MachineRefinanceDetails.intendedPurposeAmount",
                    "LoanUtilisation.MachineRefinanceDetails.intendedPurposePercentage",
                    "LoanUtilisation.MachineRefinanceDetails.nonIntendedPurposeAmount",
                    "LoanUtilisation.MachineRefinanceDetails.nonIntendedPurposePercentage",
                    "LoanUtilisation.MachineRefinanceDetails.nonIntendedPurposeAmountSpentOn",
                    "LoanUtilisation.lucDone",
                    "LoanUtilisation.lucRescheduled",
                    "LoanUtilisation.udf2",
                    "LoanUtilisation.lucRescheduleReason",
                    "LoanUtilisation.lucRescheduledDate",
                    "LoanUtilisation.lucEscalated",
                    "LoanUtilisation.lucEscalatedReason",
                    "LoanUtilisation.udf3",
                    "LUCDocuments",
                    "LUCDocuments.loanMonitoringDocuments",
                    "LUCDocuments.loanMonitoringDocuments.documentName",
                    "LUCDocuments.loanMonitoringDocuments.documentId",
                    "socialImpact",
                    "socialImpact.Men",
                    "socialImpact.Men.totalNumberOfMen",
                    "socialImpact.Men.averageSalaryOfMen",
                    "socialImpact.Men.menPartTimeEmployee",
                    "socialImpact.Men.menFullTimeEmployee",
                    "socialImpact.Men.avgSkillLevelOfMen",
                    "socialImpact.Men.noOfFirstJobsMen",
                    "socialImpact.WOMEN",
                    "socialImpact.WOMEN.totalNumberOfWomen",
                    "socialImpact.WOMEN.averageSalaryOfWomen",
                    "socialImpact.WOMEN.womenPartTimeEmployee",
                    "socialImpact.WOMEN.womenFullTimeEmployee",
                    "socialImpact.WOMEN.avgSkillLevelOfWomen",
                    "socialImpact.WOMEN.noOfFirstJobsWomen",
                    "socialImpact.PreLoanDetails",
                    "socialImpact.PreLoanDetails.preLoanMonthlyRevenue",
                    "socialImpact.PreLoanDetails.preLoanMonthlyNetIncome",
                    "socialImpact.PreLoanDetails.preLoanProprietorSalary",
                    "socialImpact.PreLoanDetails.preLoanNumberOfCustomersOrBuyers",
                    "socialImpact.PostLoanDetails",
                    "socialImpact.PostLoanDetails.postLoanMonthlyRevenue",
                    "socialImpact.PostLoanDetails.postLoanMonthlyNetIncome",
                    "socialImpact.PostLoanDetails.postLoanProprietorSalary",
                    "socialImpact.PostLoanDetails.postLoanNumberOfCustomersOrBuyers",
                    "RescheduleActionBox",
                    "RescheduleActionBox.ReScheduleButton",
                    "EscalateActionbox",
                    "EscalateActionbox.Escalatebutton",
                    "submitactionbox",
                    "submitactionbox.submitbutton",
                    "saveactionbox",
                    "saveactionbox.save",
                    "SendBackactionbox",
                    "SendBackactionbox.sendbackbutton",
                    "Backactionbox",
                    "Backactionbox.backbutton",
                ];
            }

            var configFile = function() {
                return {
                    "loanMonitoringDetails.loanPurposeCategory":{
                            "Asset Purchase":{
                                "excludes": [
                                    "LoanUtilisation.LoanDetails",
                                    "LoanUtilisation.MachineRefinanceDetails"
                                ]
                            },
                            "Working Capital":{
                                "excludes": [
                                    "LoanUtilisation.AssetPurchase",
                                    "LoanUtilisation.MachineRefinanceDetails"
                                ]
                            },
                            "Business Development":{
                                "excludes": [
                                    "LoanUtilisation.AssetPurchase",
                                    "LoanUtilisation.MachineRefinanceDetails"
                                ]
                            },
                            "Line of credit":{
                                "excludes": [
                                    "LoanUtilisation.AssetPurchase",
                                    "LoanUtilisation.MachineRefinanceDetails"
                                ]
                            },
                            "Machine Refinance":{
                                "excludes": [
                                    "LoanUtilisation.AssetPurchase",
                                    "LoanUtilisation.LoanDetails",
                                ]
                            }    
                    },


                    "loanMonitoringDetails.currentStage": {
                        "Completed": {
                            "overrides": {
                                "LoanUtilisation": {
                                    "readonly": true
                                },
                                "socialImpact": {
                                    "readonly": true
                                },
                                "LUCDocuments": {
                                    "readonly": true
                                }
                            }
                        }
                    },
                    "loanMonitoringDetails.siteCode":{  
                       "KGFS":{  
                            "overrides":{  
                                "LoanUtilisation.AssetPurchase.numberOfAssetsDelivered":{ 
                                  "required":false 
                                 },
                               "LoanUtilisation.AssetPurchase.amountUtilizedForAssetsPurchase":{ 
                                 "required":false  
                                },
                                "LoanUtilisation.AssetPurchase.percentage":{  
                                  "required":false 
                                },
                                "LoanUtilisation.AssetPurchase.totalCreationAssetValue":{  
                                  "required":false 
                                },
                                "LoanUtilisation.AssetPurchase.isAssetsOrdered":{  
                                   "required":false 
                                }
                            }
                        }
                    }    
                }
            }

            return {
                "type": "schema-form",
                "title": "LUC Details",
                "subTitle": "LUC",
                initialize: function(model, form, formCtrl) {

  
                    model.lucCompleted = ($stateParams.pageData && $stateParams.pageData._lucCompleted) ? true : false;

                    model.loanMonitoringDetails = model.loanMonitoringDetails || {};
                    if (!_.hasIn(model.loanMonitoringDetails, 'socialImpactDetails') || model.loanMonitoringDetails.socialImpactDetails == null) {
                        model.loanMonitoringDetails.socialImpactDetails = {};
                    }
                    model = Utils.removeNulls(model, true);
                    $log.info("luc page got initiated");

                    model.loanMonitoringDetails.siteCode = SessionStore.getGlobalSetting("siteCode");

                    var self = this;
                    var formRequest = {
                        "overrides": getOverrides (model),
                        "includes": getIncludes (model),
                        "excludes": [
                            "",
                        ]
                    };


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
                                _.assign(model.loanMonitoringDetails, res.loanMonitoringDetails);
                                //model.loanMonitoringDetails.lucRescheduledDate = moment(model.loanMonitoringDetails.lucRescheduledDate).format("YYYY-MM-DD");
                                model.loanMonitoringDetails.lucRescheduledDate = (model.loanMonitoringDetails.lucRescheduledDate != null) ? moment(model.loanMonitoringDetails.lucRescheduledDate).format("YYYY-MM-DD") : null;
                                var loanId = res.loanMonitoringDetails.loanId;

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
                                                        if(response1.enterprise){
                                                             model.loanMonitoringDetails.socialImpactDetails.preLoanMonthlyNetIncome = response1.enterprise.avgMonthlyNetIncome;
                                                            model.loanMonitoringDetails.socialImpactDetails.preLoanMonthlyRevenue = response1.enterprise.monthlyTurnover;
                                                        }
                                                       
                                                        if (response1.buyerDetails && response1.buyerDetails.length) {
                                                            model.loanMonitoringDetails.socialImpactDetails.preLoanNumberOfCustomersOrBuyers = response1.buyerDetails.length;
                                                        }
                                                    }
                                                    self.form = LucFormRequestProcessor.getFormDefinition('LUC', formRequest,configFile(), model);
                                                }, function(httpRes) {
                                                    PageHelper.showErrors(httpRes);
                                                })
                                                .finally(function() {
                                                    PageHelper.hideLoader();
                                                });
                                        }
                                        else{
                                          this.form = LucFormRequestProcessor.getFormDefinition('LUC', formRequest);  
                                        }
                                    },
                                    function(httpRes) {
                                        PageHelper.showProgress('load-loan', 'Some error while loading the loan details', 2000);
                                    }
                                );

                                model = Utils.removeNulls(model, true);
                                PageHelper.hideLoader();
                            }
                        )
                    }
                },
                offline: true,
                getOfflineDisplayItem: function(item, index) {
                    return [
                        item.loanMonitoringDetails.customerName
                    ]
                },

                form: [
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
                        orderLUCDocuments(model);
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
            }
    }
})