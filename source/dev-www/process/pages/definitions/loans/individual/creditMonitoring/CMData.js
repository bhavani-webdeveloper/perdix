define({
    pageUID: "loans.individual.creditMonitoring.CMData",
    pageType: "Engine",
    dependencies: ["$log", "$state", "$stateParams","LoanAccount", "LUC", "Enrollment", "IndividualLoan", "CMHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"],
    $pageFn: function($log, $state, $stateParams,LoanAccount, LUC, Enrollment, IndividualLoan, CMHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {
        var branch = SessionStore.getBranch();
        var validateDate = function(req) {
                if (req.loanMonitoringDetails && req.loanMonitoringDetails.lucRescheduledDate) {
                    var today = moment(new Date()).format("YYYY-MM-DD");
                    var rescheduledate=req.loanMonitoringDetails.lucRescheduledDate;
                    if (req.loanMonitoringDetails.lucRescheduledDate <= today) {
                        $log.info("bad night");
                        PageHelper.showProgress('validate-error', 'Rescheduled Date: Rescheduled Date must be a Future Date', 5000);
                        return false;
                    }
                    var date1 = moment(rescheduledate,SessionStore.getSystemDateFormat());
                    var date2 = moment(today,SessionStore.getSystemDateFormat());
                    var diffDays = date1.diff(date2, "days");
                    $log.info(diffDays);
                    if (diffDays >15) {
                        $log.info("bad night");
                        PageHelper.showProgress('validate-error', 'Rescheduled Date: Rescheduled Date should not exceed 15 days from today', 5000);
                        return false;
                    }
                }
                return true;
        }
           

        return {
            "type": "schema-form",
            "title": "CREDIT_MONITORING_DETAILS",
            "subTitle": "CREDIT_MONITORING",
            initialize: function(model, form, formCtrl) {
                model.Completed = ($stateParams.pageData && $stateParams.pageData._lucCompleted) ? true : false;
                model.loanMonitoringDetails = model.loanMonitoringDetails || {};
                model.loanDetails = model.loanDetails || {};
                model.loanAccount={};
                model.customer={};
                model.loanMonitoringDetails.loginName = SessionStore.getLoginname();
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
                            $log.info("res");
                            _.assign(model.loanMonitoringDetails, res.loanMonitoringDetails);
                            _.assign(model.loanDetails, res.loanOdSummaryWSDto);
                            model.loanMonitoringDetails.lucRescheduledDate = (model.loanMonitoringDetails.lucRescheduledDate != null) ? moment(model.loanMonitoringDetails.lucRescheduledDate).format("YYYY-MM-DD") : null;
                            var loanId = res.loanMonitoringDetails.loanId;
                            var accountNumber = res.loanMonitoringDetails.accountNumber;
                            model.loanMonitoringDetails.address=model.loanMonitoringDetails.address || (model.loanDetails.customer1Address1 + " " + model.loanDetails.customer1Address2 + " " + model.loanDetails.customer1Address3);
                            model.loanMonitoringDetails.presentOutStandingLoanAmount=Number(model.loanDetails.accountBalance);
                            model.loanMonitoringDetails.udf7=Number(model.loanMonitoringDetails.udf7);
                            model.loanMonitoringDetails.udf12=Number(model.loanMonitoringDetails.udf12);
                            model.loanMonitoringDetails.udf8=Number(model.loanMonitoringDetails.udf8);
                            model.loanMonitoringDetails.udf9=Number(model.loanMonitoringDetails.udf9);
                            model.loanMonitoringDetails.udf10=Number(model.loanMonitoringDetails.udf10);

                            var urn = model.loanMonitoringDetails.urn;
                            var linkedurns = [urn];
                            Queries.getCustomerBasicDetails({
                                "urns": linkedurns
                            }).then(function(result) {
                                if (result && result.urns) {
                                    var cust = result.urns[urn]
                                    if (cust) {
                                        Enrollment.getCustomerById({
                                                id: cust.id
                                            })
                                            .$promise
                                            .then(function(response2) {
                                                $log.info(response2);
                                                model.customer=response2;   
                                            }, function(httpRes) {
                                                PageHelper.showErrors(httpRes);
                                            })
                                            .finally(function() {
                                                PageHelper.hideLoader();
                                            });
                                    }
                                }
                            });
                            var loanresponse = LoanAccount.get({
                                accountId: accountNumber
                            }).$promise;
                            loanresponse.then(
                                function(response) {
                                    $log.info("printing loan account");
                                    $log.info(response);
                                    model.loanAccount=response;
                                    if(model.loanAccount.daysPastDue>0){
                                        model.loanMonitoringDetails.udf1="Overdue";
                                    }else{
                                        model.loanMonitoringDetails.udf1="Regular";
                                    }
                                },
                                function(httpRes) {
                                    PageHelper.showProgress('load-loan', 'Some error while loading the loan details', 2000);
                                });

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
                        key: "loanMonitoringDetails.branchName",
                        type: "string",
                        title: "BRANCH_NAME",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.bussinessName",
                        type: "string",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.urn",
                        type: "string",
                        title: "URN_NO",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.accountNumber",
                        type: "string",
                        "title": "ACCOUNT_NUMBER",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.address",
                        type: "string",
                        title: "SHOP_ADDR",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.loanAmount",
                        type: "amount",
                        title: "AVAILED_LOAN_AMOUNT",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.presentOutStandingLoanAmount",
                        type: "amount",
                        title: "PRESENT_OUTSTANDING_LOAN_AMOUNT",
                        "readonly": true
                    },{
                        key: "loanMonitoringDetails.udf1",
                        "readonly":true,
                        title: "STATUS_OF_LOAN_ACCOUNT",
                        type: "string",
                    }, {
                        key: "loanMonitoringDetails.numberOfInstallmentsDue",
                        type: "string",
                        title: "IF_OVERDUE_THE_NO_OF_INSTALLMENT_DUE",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.loginName",
                        type: "string",
                        title: "User Id And Name of SWM/ARM/RM",
                        "readonly": true
                    }, {
                        key: "loanMonitoringDetails.disbursementDate",
                        type: "date",
                        title: "DATE_WHEN_THE_BIOMETRIC_WAS_TAKEN",
                        "readonly": true
                    }, 
                    {
                        key: "loanMonitoringDetails.udf2",
                        type: "string",
                        title: "Reschedule Remarks",
                        "readonly": true
                    },
                    {
                        key: "loanMonitoringDetails.udf3",
                        "condition":"model.loanMonitoringDetails.currentStage!=='Completed'",
                        type: "select",
                        titleMap: {
                            "Hardship": "Hardship",
                            "Last two repayments pending": "Last two repayments pending",
                            "Can pay": "Can pay",
                            "Wilful default": "Wilful default",
                            "Others": "Others",
                            "Claim": "Claim"
                        },
                        title: "REASON_FOR_FOR_NON_REPAYMENT"
                    },
                    {
                        key: "loanMonitoringDetails.udf3",
                        "condition":"model.loanMonitoringDetails.currentStage =='Completed'",
                        "readonly":true,
                        type: "select",
                        titleMap: {
                            "Hardship": "Hardship",
                            "Last two repayments pending": "Last two repayments pending",
                            "Can pay": "Can pay",
                            "Wilful default": "Wilful default",
                            "Others": "Others",
                            "Claim": "Claim"
                        },
                        title: "REASON_FOR_FOR_NON_REPAYMENT"
                    },  
                    ]
                },
                {
                    "type":"box",
                    "condition": "model.lucCompleted",
                    "title":"VALIDATE_BIOMETRIC",
                    "items":[
                    {
                        key: "loanMonitoringDetails.udf13",
                        //required:true,
                        "title": "CHOOSE_A_FINGER_TO_VALIDATE",
                        type: "validatebiometric",
                        category: 'CustomerEnrollment',
                        subCategory: 'FINGERPRINT',
                        helper: formHelper,
                        biometricMap: {
                            leftThumb: "model.customer.leftHandThumpImageId",
                            leftIndex: "model.customer.leftHandIndexImageId",
                            leftMiddle: "model.customer.leftHandMiddleImageId",
                            leftRing: "model.customer.leftHandRingImageId",
                            leftLittle: "model.customer.leftHandSmallImageId",
                            rightThumb: "model.customer.rightHandThumpImageId",
                            rightIndex: "model.customer.rightHandIndexImageId",
                            rightMiddle: "model.customer.rightHandMiddleImageId",
                            rightRing: "model.customer.rightHandRingImageId",
                            rightLittle: "model.customer.rightHandSmallImageId"
                        },
                        viewParams: function(modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                    }
                    ]
                },
                
                {
                    "type": "box",
                    "title": "BUSINESS_DETAILS",
                    //"condition":"model.lucCompleted",
                    "items": [{
                        key: "loanMonitoringDetails.udf14",
                        type: "string",
                        title: "NATURE_OF_BUSINESS_AT_THE_TIME_OF_AVAILING_LOAN"
                    }, {
                        key: "loanMonitoringDetails.udf4",
                        type: "string",
                        title: "NATURE_OF_BUSINESS_AT_THE_TIME_OF_CURRENT_VERIFICATION"
                    }, {
                        key: "loanMonitoringDetails.udf5",
                        type: "string",
                        title: "DIFFERENCE_BETWEEN_THE_NATURE_AT_THE_TIME_OF_LOAN_AND_VERIFICATION"
                    }, {
                        key: "loanMonitoringDetails.udf6",
                        type: "string",
                        title: "REASON_FOR_DIFFERENCE_IN_NATURE_OF_BUSINESS"
                    }, {
                        key: "loanMonitoringDetails.udf7",
                        type: "number",
                        title: "SALES_PER_DAY_AS_PER_JUDGEMENT_OF_SWM/ARM"
                    },{
                        key: "loanMonitoringDetails.udf12",
                        type: "number",
                        title: "SALES_PER_DAY_AS_PER_BUSINESS_OWNER"
                    }, {
                        key: "loanMonitoringDetails.udf8",
                        type: "number",
                        title: "MONTHLY_STOCK_PURCHASE_VALUE"
                    }, {
                        key: "loanMonitoringDetails.loanAmountUsed",
                        type: "amount",
                        title: "Loan Amount Availed Used in the Business(Fully Used/Partly Used/Not Used)"
                    }, {
                        key: "loanMonitoringDetails.udf9",
                        type: "amount",
                        title: "VALUE_OF_THE_STOCK_AS_PER_JUDGEMENT_OF_SWM/ARM"
                    }, {
                        key: "loanMonitoringDetails.udf10",
                        type: "amount",
                        title: "VALUE_OF_THE_STOCK_AS_PER_BUSINESS_OWNER"
                    }, {
                        key: "loanMonitoringDetails.udf11",
                        type: "geotag",
                        // required: true,
                        title: "LOCATION_OF_THE_SHOP"
                    }, {
                        key: "loanMonitoringDetails.photoImageId1",
                        title: "UPLOAD",
                        type: "file",
                        required: true,
                        fileType: "image/*",
                        "category": "CustomerEnrollment",
                        "subCategory": "KYC1"
                    }]
                }, {
                    "type": "box",
                    //"condition":"model.lucCompleted",
                    "title": "CM_DETAILS",
                    "items": [{
                        key: "loanMonitoringDetails.lucDone",
                        "condition":"model.loanMonitoringDetails.currentStage !=='Completed'",
                        type: "select",
                        titleMap: {
                            "Yes": "Yes",
                            "No": "No"
                        },
                        //enumCode: "decisionmaker1",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucDone == "Yes") {
                                model.loanMonitoringDetails.CMReschedule = "No";
                                model.loanMonitoringDetails.CMEscalate = "No";
                            }
                        }
                    },{
                        key: "loanMonitoringDetails.lucDone",
                        "readonly":true,
                        "condition":"model.loanMonitoringDetails.currentStage =='Completed'",
                        type: "select",
                        titleMap: {
                            "Yes": "Yes",
                            "No": "No"
                        },
                        //enumCode: "decisionmaker1",
                        "onChange": function(modelValue, form, model) {
                            if (model.loanMonitoringDetails.lucDone == "Yes") {
                                model.loanMonitoringDetails.CMReschedule = "No";
                                model.loanMonitoringDetails.CMEscalate = "No";
                            }
                        }
                    }, {
                        key: "loanMonitoringDetails.lucRescheduled",
                        "title": "CM_RESCHEDULED",
                        condition: "model.loanMonitoringDetails.lucDone=='No'",
                        type: "select",
                        titleMap: {
                            "Yes": "Yes",
                            "No": "No"
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
                        condition: "model.loanMonitoringDetails.CMReschedule=='Yes'",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduleReason",
                        type: "string",
                        title: "CM_RESCHEDULED_REASON",
                        condition: "model.loanMonitoringDetails.CMReschedule=='Yes'",
                    }, {
                        key: "loanMonitoringDetails.lucRescheduledDate",
                        type: "date",
                        title: "CM_RESCHEDULED_DATE",
                        condition: "model.loanMonitoringDetails.CMReschedule=='Yes'",
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
                                // orderCMDocuments(model);
                                var reqData = _.cloneDeep(model);

                                if (!(validateDate(reqData))) {
                                    return;
                                }

                                if (reqData.loanMonitoringDetails.id) {
                                    CMHelper.reschedule(reqData).then(function(resp) {
                                        $state.go('Page.CreditMonitoringDashboard', null);
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
                                // orderCMDocuments(model);
                                var reqData = _.cloneDeep(model);
                                if (reqData.loanMonitoringDetails.id) {
                                    CMHelper.escalate(reqData).then(function(resp) {
                                       $state.go('Page.CreditMonitoringDashboard', null);
                                    });
                                } else {
                                    $log.info("Id is not in the model");
                                }
                            });
                        }
                    }]
                }, {
                    "type": "actionbox",
                    condition: "model.loanMonitoringDetails.lucDone== 'Yes' && model.loanMonitoringDetails.currentStage !=='Completed'",
                    "items": [{
                        "type": "submit",
                        "title": "Close"
                    }]
                }, {
                    "type": "actionbox",
                    condition: "!model.Completed",
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
                                // orderCMDocuments(model);
                                var reqData = _.cloneDeep(model);
                                if (reqData.loanMonitoringDetails.id) {
                                    CMHelper.goBack(reqData).then(function(resp) {
                                       $state.go('Page.CreditMonitoringDashboard', null);
                                    });
                                } else {
                                    $log.info("Id is not in the model");
                                }
                            });
                        }
                    }]
                }, {
                    "type": "actionbox",
                    condition: "model.Completed",
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
                    // orderCMDocuments(model);
                    var reqData = _.cloneDeep(model);
                    reqData.loanMonitoringDetails.currentStage = "CMSchedule";
                    if (reqData.loanMonitoringDetails.id) {
                        CMHelper.proceedData(reqData).then(function(resp) {
                            $state.go('Page.CreditMonitoringDashboard', null);
                        });

                    } else {
                        $log.info("Id is not in the model");
                    }
                }
            }
        }
    }
})