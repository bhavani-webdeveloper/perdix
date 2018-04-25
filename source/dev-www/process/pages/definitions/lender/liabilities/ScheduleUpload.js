define(['perdix/domain/model/lender/LoanBooking/LiabilityLoanAccountBookingProcess'], function(LiabilityLoanAccountBookingProcess) {
    LiabilityLoanAccountBookingProcess = LiabilityLoanAccountBookingProcess['LiabilityLoanAccountBookingProcess'];
    return {
        pageUID: "lender.liabilities.ScheduleUpload",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator", "Utils", "Files", "LiabilityAccountProcess", "Schedule"
        ],
        $pageFn: function($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator, Utils, Files, LiabilityAccountProcess, Schedule) {

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
                    "ScheduleUpload",
                    "ScheduleUpload.burlkFile"
                ]
            }

            return {
                "type": "schema-form",
                "title": "SCHEDULE_UPLOAD",
                "subTitle": "",

                initialize: function(model, form, formCtrl) {
                    if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)) {
                        PageHelper.showLoader();
                        LiabilityLoanAccountBookingProcess.get($stateParams.pageId)
                            .subscribe(function(res) {
                                PageHelper.hideLoader();
                                if (res.liabilityAccount.currentStage != "ScheduleUpload" && res.liabilityAccount.currentStage != "Completed") {
                                    irfNavigator.goBack();
                                }
                                model.LiabilityLoanAccountBookingProcess = res;
                                model.liabilityAccount = res.liabilityAccount;
                                model.lenderEnrolmentProcess = res.lenderEnrolmentProcess;
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
                                        "lenderName": {
                                            "key": "lenderEnrolmentProcess.customer.firstName",
                                            "title": "LENDER_NAME",
                                            "type": "string",
                                            "readonly": true
                                        },
                                        "lenderAccountNumber": {
                                            "key": "liabilityAccount.lenderAccountNumber",
                                            "title": "LENDER_ACCOUNT_NUMBER",
                                            "type": "string",
                                            "readonly": true
                                        },
                                        "repaymentTenure": {
                                            "key": "liabilityAccount.repaymentTenure",
                                            "title": "REPAYMENT_TENURE",
                                            "type": "string",
                                            "readonly": true
                                        }
                                    }
                                },
                                "ScheduleUpload": {
                                    "type": "box",
                                    "title": "SCHEDULE_UPLOAD",
                                    "colClass": "col-sm-6",
                                    "items": {
                                        "burlkFile": {
                                            "key": "schedule.Bulkfile",
                                            "notitle": true,
                                            "title": "SCHEDULE_UPLOAD",
                                            "category": "ACH",
                                            "subCategory": "cat2",
                                            "type": "file",
                                            "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                            customHandle: function(file, progress, modelValue, form, model) {
                                                Schedule.scheduleUpload(file, progress, model.liabilityAccount.lenderAccountNumber).then(function(res) {
                                                    model.liabilityAccount.isPaymentScheduleUploaded = true;
                                                    model.LiabilityLoanAccountBookingProcess.proceed()
                                                        .finally(function() {
                                                            PageHelper.hideLoader();
                                                            irfNavigator.go({
                                                                state: 'Page.Adhoc',
                                                                pageName: "lender.liabilities.LoanBookingDashboard"
                                                            });
                                                        })
                                                        .subscribe(function(value) {
                                                            PageHelper.clearErrors();
                                                        }, function(err) {
                                                            PageHelper.showErrors({
                                                                    'message': "Please upload excel file only"
                                                                })
                                                            PageHelper.hideLoader();
                                                        });
                                                }, function(err) {
                                                    console.log("error");
                                                });
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    };
                    UIRepository.getLenderLiabilitiesLoanAccountBookingProcess().$promise
                        .then(function(repo) {
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form) {
                            self.form = form;
                        });
                },
                offline: false,

                getOfflineDisplayItem: function(item, index) {},
                form: [],
                schema: function() {
                    return Enrollment.getSchema().$promise;
                },
                actions: {}
            };

        }
    }
})