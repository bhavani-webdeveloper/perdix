
define(['perdix/domain/model/lender/LoanBooking/LiabilityLoanAccountBookingProcess'], function(LiabilityLoanAccountBookingProcess) {
    LiabilityLoanAccountBookingProcess = LiabilityLoanAccountBookingProcess['LiabilityLoanAccountBookingProcess'];
    return {
        pageUID: "lender.liabilities.ScheduleUpload",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Utils", "Files", "LiabilityAccountProcess"],
        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Utils, Files, LiabilityAccountProcess) {

            var configFile = function() {
                return {}
            }

            var overridesFields = function(pageObj) {
                return {}
            }

            var getIncludes = function(model) {
                return [
                    "LenderAccountDetails",
                    "LenderAccountDetails.lenderName",
                    "LenderAccountDetails.lenderAccountNumber",
                    "LenderAccountDetails.repaymentTenure",
                    "ScheduleUpload.burlkFile"
                ]
            }

            return {
                "type": "schema-form",
                "title": "SCHEDULE_UPLOAD",
                "subTitle": "",

                initialize: function (model, form, formCtrl) {
                    if(_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId) ) {
                        PageHelper.showLoader();
                        LiabilityLoanAccountBookingProcess.get($stateParams.pageId)
                            .subscribe(function(res){
                                PageHelper.hideLoader();
                                if(res.liabilityAccount.currentStage != "ScheduleUpload") {
                                   irfNavigator.goBack();
                                }
                                model.LiabilityLoanAccountBookingProcess = res; 
                                model.liabilityAccount = res.liabilityAccount;
                            });
                    } else {
                       irfNavigator.goBack();
                    }

                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {                                
                                "LenderAccountDetails": {
                                    "type": "box",
                                    "title": "LENDER_ACCOUNT_DETAILS",
                                    "colClass": "col-sm-6",
                                    "items": {
                                        "lenderName":{
                                            "key": "schedule.Bulkfile",
                                            "title": "LENDER_NAME",
                                            "type": "string"
                                        },
                                        "lenderAccountNumber":{
                                            "key": "schedule.Bulkfile",
                                            "title": "LENDER_ACCOUNT_NUMBER",
                                            "type": "string"
                                        },
                                        "repaymentTenure":{
                                            "key": "schedule.Bulkfile",
                                            "title": "REPAYMENT_TENURE",
                                            "type": "string"
                                        }
                                    }
                                },
                                "ScheduleUpload": {
                                    "type": "box",
                                    "title": "SCHEDULE_UPLOAD",
                                    "colClass": "col-sm-6",
                                    "items": {
                                        "burlkFile":{
                                            "key": "schedule.Bulkfile",
                                            "notitle": true,
                                            "title": "SCHEDULE_UPLOAD",
                                            "category": "ACH",
                                            "subCategory": "cat2",
                                            "type": "file",
                                            "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                            customHandle: function(file, progress, modelValue, form, model) {
                                                Schedule.scheduleUpload(file, progress);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };
                    var p1 = UIRepository.getLenderLiabilitiesLoanAccountBookingProcess().$promise;
                    p1.then(function(repo){
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
                    });
                },
                offline: false,

                getOfflineDisplayItem: function(item, index) {},
                form: [
                    {
                        "type": "box",
                        "title": "LENDER_ACCOUNT_DETAILS",
                        "colClass": "col-sm-6",
                        "items": [
                            {
                                "key": "schedule.Bulkfile",
                                "title": "LENDER_NAME",
                                "type": "string"
                            },
                            {
                                "key": "schedule.Bulkfile",
                                "title": "LENDER_ACCOUNT_NUMBER",
                                "type": "string"
                            },
                            {
                                "key": "schedule.Bulkfile",
                                "title": "REPAYMENT_TENURE",
                                "type": "string"
                            }
                        ]
                    },
                    {
                        "type": "box",
                        "title": "SCHEDULE_UPLOAD",
                        "colClass": "col-sm-6",
                        "items": [{
                            "key": "schedule.Bulkfile",
                            "notitle": true,
                            "title": "SCHEDULE_UPLOAD",
                            "category": "ACH",
                            "subCategory": "cat2",
                            "type": "file",
                            "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            customHandle: function(file, progress, modelValue, form, model) {
                                Schedule.scheduleUpload(file, progress);
                            }
                        }]
                    }
                ],
                schema: function() {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                }
            };

        }
    }
})