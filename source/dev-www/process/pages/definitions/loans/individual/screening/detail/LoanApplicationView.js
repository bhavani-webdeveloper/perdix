define({
    pageUID: "loans.individual.screening.detail.LoanApplicationView",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Enrollment", "IndividualLoan", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "$stateParams", "$state",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe", "$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "SchemaResource", "LoanProcess"
    ],
    $pageFn: function($log, $state, Enrollment, IndividualLoan, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage, $stateParams, $state,
        PageHelper, Utils, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, Dedupe, $resource, $httpParamSerializer, BASE_URL, searchResource, SchemaResource, LoanProcess) {
        
var navigateToQueue = function(model) {
                    // Considering this as the success callback
                    // Deleting offline record on success submission
                    BundleManager.deleteOffline().then(function() {
                        PageHelper.showProgress("loan-offline", "Offline record cleared", 5000);
                    });


                    /*if (model.currentStage == 'ApplicationReview')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.ApplicationReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'FieldAppraisalReview')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.FieldAppraisalReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'CreditCommitteeReview')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.CreditCommitteeReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'CentralRiskReview')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.CentralRiskReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'ZonalRiskReview')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.ZonalRiskReviewQueue',
                            pageId: null
                        });
*/

                    if (model.currentStage == 'Screening')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.ScreeningQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'Dedupe')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.DedupeQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'ScreeningReview')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.ScreeningReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'Application')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.ApplicationQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'ApplicationReview')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.ApplicationReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'FieldAppraisal')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.FieldAppraisalQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'FieldAppraisalReview')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.FieldAppraisalReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'CreditCommitteeReview')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.CreditCommitteeReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'CentralRiskReview')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.CentralRiskReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'ZonalRiskReview')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.ZonalRiskReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'Sanction')
                        $state.go('Page.Engine', {
                            pageName: 'loans.individual.screening.LoanSanctionQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'Rejected')
                        $state.go('Page.LoanOriginationDashboard', null);
                }


        return {
            "type": "schema-form",
            "title": "LOAN_RECOMMENDATION",
            "subTitle": "",
            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                model.currentStage = bundleModel.currentStage;
                model.bundleModel = bundleModel;
                model.loanAccount = bundleModel.loanAccount;
                model.review = model.review || {};
                model.temp = model.temp || {}
                BundleManager.pushEvent('loanAccount', model._bundlePageObj, model.loanAccount);

                

            /*Asset details*/
                if (model.loanAccount.collateral.length != 0) {
                    model.asset_details = {
                        "collateralDescription": model.loanAccount.collateral[0].collateralDescription,
                        "collateralValue": model.loanAccount.collateral[0].collateralValue,
                        "expectedIncome": model.loanAccount.collateral[0].expectedIncome,
                        "collateralType": model.loanAccount.collateral[0].collateralType,
                        "manufacturer": model.loanAccount.collateral[0].manufacturer,
                        "modelNo": model.loanAccount.collateral[0].modelNo,
                        "serialNo": model.loanAccount.collateral[0].serialNo,
                        "expectedPurchaseDate": model.loanAccount.collateral[0].expectedPurchaseDate,
                        "machineAttachedToBuilding": model.loanAccount.collateral[0].machineAttachedToBuilding,
                        "hypothecatedToBank": model.loanAccount.collateral[0].hypothecatedToBank,
                        "electricityAvailable": model.loanAccount.collateral[0].electricityAvailable,
                        "spaceAvailable": model.loanAccount.collateral[0].spaceAvailable
                    }
                }

                /*   model.updateChosenMitigant = function(checked, item) {
                    if (checked) {
                        // add item
                        item.selected = true;
                        $log.info(model.deviationDetails + "kishan");

                    } else {
                        // remove item
                        item.selected = false;
                        $log.info(model.deviationDetails + "yadav")
                    }
                };
*/


            Enrollment.getCustomerById({
                id: model.customerId
            }).$promise.then(function(res) {
                model.customer = res;
            });

        },
        form: [{
                "type": "section",
                "html": '<div class="col-xs-12">' +
                    '<div class="box no-border">' +
                    '<div class="box-body" style="padding-right: 0">' +
                    '<sf-decorator ng-repeat="item in form.items" form="item" class="ng-scope"></sf-decorator></div></div></div>',
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        key: "loanAccount.linkedAccountNumber",
                        title: "LINKED_ACCOUNT_NUMBER",
                        type: "lov",
                        autolov: true,
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            return LoanProcess.viewLoanaccount({
                                urn: model.customer.urnNo
                            }).$promise;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.accountId,
                                item.glSubHead,
                                item.amount,
                                item.npa
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            model.loanAccount.npa = valueObj.npa;
                            model.loanAccount.linkedAccountNumber = valueObj.accountId;
                        }
                    }, {
                        key: "loanAccount.npa",
                        title: "IS_NPA"
                    }]
                }]
            }, {
                "type": "box",
                "readonly": true,
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "Preliminary Loan Information",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.loanPurpose1",
                            "title": "Loan Purpose"
                        }, {
                            "key": "loanAccount.loanPurpose2",
                            "title": "Loan SubPurpose"
                        }, {
                            "key": "loanAccount.loanAmountRequested",
                            "title": "Loan Amount Requested",
                            "type": "amount"
                        }, {
                            "key": "loanAccount.emiPaymentDateRequested",
                            "title": "Requested EMI Payment Date"
                        }, {
                            "key": "loanAccount.expectedPortfolioInsurancePremium",
                            "title": "Expected Portfolio Insurance Premium",
                            "type": "amount"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.frequencyRequested",
                            "title": "Requested Frequency",
                            "type": "number"
                        }, {
                            "key": "loanAccount.tenureRequested",
                            "title": "Requested Tenure",
                            "type": "number"
                        }, {
                            "key": "loanAccount.expectedInterestRate",
                            "title": "Expected Interest Rate",
                            "type": "number"
                        }, {
                            "key": "loanAccount.expectedEmi",
                            "title": "Expected Kinara EMI",
                            "type": "amount"
                        }, {
                            "key": "loanAccount.emiRequested",
                            "title": "Requested EMI",
                            "type": "amount"
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "readonly": true,
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "Additional Loan Information",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.estimatedDateOfCompletion",
                            "title": "Estimated Date Of Completion"
                        }, {
                            "key": "loanAccount.productCategory",
                            "title": "Product Type"
                        }, {
                            "key": "loanAccount.customerSignDateExpected",
                            "title": "Expected customer sign date"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.proposedHires",
                            "title": "Proposed Hires",
                            "type": "number"
                        }, {
                            "key": "loanAccount.percentageIncreasedIncome",
                            "title": "% of Increased Income",
                            "type": "number"
                        }, {
                            "key": "loanAccount.percentageInterestSaved",
                            "title": "% of Interest Saved",
                            "type": "number"
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "readonly": true,
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "Deductions From Loan Amount",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.expectedProcessingFeePercentage",
                            "title": "Expected Processing Fee(in%)",
                            "type": "number"
                        }, {
                            "key": "loanAccount.expectedCommercialCibilCharge",
                            "title": "Expected CIBIL Charges",
                            "type": "amount"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.estimatedEmi",
                            "title": "Expected Security EMI(in Rs.)",
                            "type": "amount"
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "readonly": true,
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "Asset Purchase Details",
                /*
                                    "condition":"model.loanAccount.loanPurpose1==model.asset_Details.Assetpurchase"*/
                "condition": "model.loanAccount.collateral.length!=0",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "asset_details.collateralDescription",
                            "title": "Machine"
                        }, {
                            "key": "asset_details.collateralValue",
                            "title": "Purchase Price",
                            "type": "amount"
                        }, {
                            "key": "asset_details.expectedIncome",
                            "title": "Expected Income",
                            "type": "amount"
                        }, {
                            "key": "asset_details.collateralType",
                            "title": "Machine Type"
                        }, {
                            "key": "asset_details.manufacturer",
                            "title": "Manufacturer Name"
                        }, {
                            "key": "asset_details.modelNo",
                            "title": "Machine Model"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "asset_details.serialNo",
                            "title": "Serial No"
                        }, {
                            "key": "asset_details.expectedPurchaseDate",
                            "title": "Expected Purchase Date"
                        }, {
                            "key": "asset_details.machineAttachedToBuilding",
                            "title": "Machine Permanently Fixed To Building"
                        }, {
                            "key": "asset_details.hypothecatedToBank",
                            "title": "Wheter Hypothecated To Kinara"
                        }, {
                            "key": "asset_details.electricityAvailable",
                            "title": "Electricity Available"
                        }, {
                            "key": "asset_details.spaceAvailable",
                            "title": "Space Available"
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "readonly": true,
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "Nominee Details",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.nominees[0].nomineeFirstName",
                            "title": "Name"
                        }, {
                            "key": "loanAccount.nominees[0].nomineeGender",
                            "title": "Gender"
                        }, {
                            "key": "loanAccount.nominees[0].nomineeDOB",
                            "title": "Date Of Birth"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.nominees[0].nomineeRelationship",
                            "title": "Relationship To Insured"
                        }, {
                            "key": "",
                            "title": "Address"
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "colClass": "col-sm-12",
                "title": "DEVIATION_AND_MITIGATIONS",
                "condition": "model.currentStage != 'ScreeningReview'",
                "items": [{
                    "type": "section",
                    "colClass": "col-sm-12",
                    "html": '<table class="table"><colgroup><col width="20%"><col width="5%"><col width="20%"></colgroup><thead><tr><th>Parameter Name</th><th></th><th>Actual Value</th><th>Mitigant</th></tr></thead><tbody>' +
                        '<tr ng-repeat="item in model.deviationDetails">' +
                        '<td>{{ item["parameter"] }}</td>' +
                        '<td> <span class="square-color-box" style="background: {{ item.color_hexadecimal }}"> </span></td>' +
                        '<td>{{ item["deviation"] }}</td>' +
                        '<td><ul class="list-unstyled">' +
                        '<li ng-repeat="m in item.mitigants " id="{{m.mitigant}}">' +
                        '<input type="checkbox"  ng-model="m.selected" ng-checked="m.selected"> {{ m.mitigant }}' +
                        // '<input type="checkbox"  ng-model="m.selected" ng-change="model.updateChosenMitigant(m.selected,m)"> {{ m.mitigant }}' +
                        '</li></ul></td></tr></tbody></table>'

                }]
            }, {
                "type": "box",
                "colClass": "col-sm-12",
                "title": "Loan Recommendation",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "",
                            "title": "Current Exposure",
                            "type": "amount"
                        }, {
                            "key": "loanAccount.loanAmount",
                            "title": "Loan Amount Recommended",
                            "type": "amount"
                        }, {
                            "key": "loanAccount.tenure",
                            "title": "Duration(months)",
                            "type": "number"
                        }, {
                            "key": "loanAccount.interestRate",
                            "title": "Interest Rate",
                            "type": "number"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.estimatedEmi",
                            "title": "Estimated Kinara EMI",
                            "type": "amount"
                        }, {
                            "key": "loanAccount.processingFeePercentage",
                            "title": "Processing Fee(in%)"
                        }, {
                            "key": "loanAccount.estimatedEmi",
                            "title": "Expected Security EMI"
                        }, {
                            "key": "loanAccount.commercialCibilCharge",
                            "title": "CIBIL Charges",
                            "type": "amount"
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "title": "Post Review Decision",
                "colClass": "col-sm-12",
                "items": [{
                    key: "review.action",
                    type: "radios",
                    titleMap: {
                        "REJECT": "REJECT",
                        "SEND_BACK": "SEND_BACK",
                        "PROCEED": "PROCEED",
                        "HOLD": "HOLD"
                    }
                }, {
                    type: "section",
                    htmlClass: "col-sm-8",
                    condition: "model.review.action=='REJECT'",
                    items: [{
                        title: "REMARKS",
                        key: "review.remarks",
                        type: "textarea",
                        required: true
                    }, {
                        key: "loanAccount.rejectReason",
                        type: "lov",
                        autolov: true,
                        required: true,
                        title: "REJECT_REASON",
                        bindMap: {},
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var stage1 = model.currentStage;

                            if (model.currentStage == 'Application' || model.currentStage == 'ApplicationReview') {
                                stage1 = "Application";
                            }
                            if (model.currentStage == 'FieldAppraisal' || model.currentStage == 'FieldAppraisalReview') {
                                stage1 = "FieldAppraisal";
                            }

                            var rejectReason = formHelper.enum('application_reject_reason').data;
                            var out = [];
                            for (var i = 0; i < rejectReason.length; i++) {
                                var t = rejectReason[i];
                                if (t.field1 == stage1) {
                                    out.push({
                                        name: t.name,
                                    })
                                }
                            }
                            return $q.resolve({
                                headers: {
                                    "x-total-count": out.length
                                },
                                body: out
                            });
                        },
                        onSelect: function(valueObj, model, context) {
                            model.loanAccount.rejectReason = valueObj.name;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.name
                            ];
                        }
                    }, {
                        key: "review.rejectButton",
                        type: "button",
                        title: "REJECT",
                        required: true,
                        onClick: "actions.reject(model, formCtrl, form, $event)"
                    }]
                }, {
                    type: "section",
                    htmlClass: "col-sm-8",
                    condition: "model.review.action=='HOLD'",
                    items: [{
                        title: "REMARKS",
                        key: "review.remarks",
                        type: "textarea",
                        required: true
                    }, {
                        key: "review.holdButton",
                        type: "button",
                        title: "HOLD",
                        required: true,
                        onClick: "actions.hold(model, formCtrl, form, $event)"
                    }]
                }, {
                    type: "section",
                    htmlClass: "col-sm-8",
                    condition: "model.review.action=='SEND_BACK'",
                    items: [{
                        title: "REMARKS",
                        key: "review.remarks",
                        type: "textarea",
                        required: true
                    }, {
                        key: "review.targetStage1",
                        type: "lov",
                        autolov: true,
                        lovonly: true,
                        title: "SEND_BACK_TO_STAGE",
                        bindMap: {},
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var stage1 = model.currentStage;
                            var targetstage = formHelper.enum('targetstage').data;
                            var out = [];
                            for (var i = 0; i < targetstage.length; i++) {
                                var t = targetstage[i];
                                if (t.field1 == stage1) {
                                    out.push({
                                        name: t.name,
                                        value: t.code
                                    })
                                }
                            }
                            return $q.resolve({
                                headers: {
                                    "x-total-count": out.length
                                },
                                body: out
                            });
                        },
                        onSelect: function(valueObj, model, context) {
                            model.review.targetStage1 = valueObj.name;
                            model.review.targetStage = valueObj.value;

                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.name
                            ];
                        }
                    }, {
                        key: "review.sendBackButton",
                        type: "button",
                        title: "SEND_BACK",
                        onClick: "actions.sendBack(model, formCtrl, form, $event)"
                    }]
                }, {
                    type: "section",
                    htmlClass: "col-sm-8",
                    condition: "model.review.action=='PROCEED'",
                    items: [{
                        title: "REMARKS",
                        key: "review.remarks",
                        type: "textarea",
                        required: true
                    }, {
                        key: "review.proceedButton",
                        type: "button",
                        title: "PROCEED",
                        onClick: "actions.proceed(model, formCtrl, form, $event)"
                    }]
                }]
            }, {
                "type": "actionbox",
                "condition": "model.loanAccount.customerId && model.currentStage !== 'loanApplicationView'",
                "items": [{
                    "type": "button",
                    "icon": "fa fa-circle-o",
                    "title": "SAVE",
                    "onClick": "actions.save(model, formCtrl, form, $event)"
                }]
            }],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            eventListeners: {
                /*"new-business": function(bundleModel, model, params){
                $log.info("Inside new-business of LoanRequest");
                model.loanAccount.customerId = params.customer.id;
                model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                model.loanAccount.loanCentre.branchId = params.customer.customerBranchId;
                model.loanAccount.loanCentre.centreId = params.customer.centreId;
                model.enterprise = params.customer;
            },
*/                "financial-summary": function(bundleModel, model, params) {
                    model._scores = params;
                    model._deviationDetails = model._scores[12].data;

                    model.deviationDetails = [];
                    var allMitigants = {};
                    model.allMitigants = allMitigants;
                    for (i in model._deviationDetails) {
                        var item = model._deviationDetails[i];
                        var mitigants = item.Mitigant.split('|');
                        for (j in mitigants) {
                            allMitigants[mitigants[j]] = {
                                mitigant: mitigants[j],
                                parameter: item.Parameter,
                                score: item.ParameterScore,
                                selected: false
                            };
                            mitigants[j] = allMitigants[mitigants[j]];
                        }
                        if (item.ChosenMitigant && item.ChosenMitigant != null) {
                            var chosenMitigants = item.ChosenMitigant.split('|');
                            for (j in chosenMitigants) {
                                allMitigants[chosenMitigants[j]].selected = true;
                            }
                        }
                        model.deviationDetails.push({
                            parameter: item.Parameter,
                            score: item.ParameterScore,
                            deviation: item.Deviation,
                            mitigants: mitigants,
                            color_english: item.color_english,
                            color_hexadecimal: item.color_hexadecimal
                        });
                    }

                    model.additional = {};
                }
            },
            actions: {
                /*submit: function(model) {
                    // function: updateChosenMitigants // model.allMitigants is object
                    model.loanAccount.loanMitigants = [];
                    _.forOwn(model.allMitigants, function(v, k) {
                        if (v.selected) {
                            model.loanAccount.loanMitigants.push(v);
                        }
                    })
                },*/
                save: function(model, formCtrl, form, $event) {
                    $log.info("Inside save()");
                    PageHelper.clearErrors();

                    /*DEVIATION AND MITIGATION - SAVING SELECTED MITIGANTS*/

                    model.loanAccount.loanMitigants = [];
                    _.forOwn(model.allMitigants, function(v, k) {
                        if (v.selected) {
                            model.loanAccount.loanMitigants.push(v);
                        }
                    })

                    /* TODO Call save service for the loan */
                    /* if(!validateAndPopulateMitigants(model)){
                         return;
                     }*/
                    // if(isEnrollmentsSubmitPending(model)){
                    //     return;
                    // }
                    /*if (!preLoanSaveOrProceed(model)){
                        return;
                    }*/
                    Utils.confirm("Are You Sure?")
                        .then(
                            function() {
                                model.temp.loanCustomerRelations = model.loanAccount.loanCustomerRelations;
                                var reqData = {
                                    loanAccount: _.cloneDeep(model.loanAccount)
                                };
                                reqData.loanProcessAction = "SAVE";
                                //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                                // reqData.remarks = model.review.remarks;
                                reqData.loanAccount.screeningDate = reqData.loanAccount.screeningDate || Utils.getCurrentDate();
                                reqData.loanAccount.psychometricCompleted = reqData.loanAccount.psychometricCompleted || "N";

                                PageHelper.showLoader();

                                var completeLead = false;
                                if (!_.hasIn(reqData.loanAccount, "id")) {
                                    completeLead = true;
                                }
                                IndividualLoan.create(reqData)
                                    .$promise
                                    .then(function(res) {

                                        model.loanAccount = res.loanAccount;
                                        if (model.temp.loanCustomerRelations && model.temp.loanCustomerRelations.length) {
                                            for (i in model.temp.loanCustomerRelations) {
                                                for (j in model.loanAccount.loanCustomerRelations) {
                                                    if (model.temp.loanCustomerRelations[i].customerId == model.loanAccount.loanCustomerRelations[i].customerId) {
                                                        model.loanAccount.loanCustomerRelations[i].name = model.temp.loanCustomerRelations[i].name;
                                                    }
                                                }
                                            }
                                        }

                                        BundleManager.pushEvent('new-loan', model._bundlePageObj, {
                                            loanAccount: model.loanAccount
                                        });
                                        if (completeLead === true && _.hasIn(model, "lead.id")) {
                                            var reqData = {
                                                lead: _.cloneDeep(model.lead),
                                                stage: "Completed"
                                            }

                                            reqData.lead.leadStatus = "Complete";
                                            LeadHelper.proceedData(reqData)
                                        }
                                    }, function(httpRes) {
                                        PageHelper.showErrors(httpRes);
                                    })
                                    .finally(function(httpRes) {
                                        PageHelper.hideLoader();
                                        // Updating offline record on success submission
                                        BundleManager.updateOffline();
                                    })
                            }
                        );
                },
                reject: function(model, formCtrl, form, $event) {
                    $log.info("Inside reject()");
                    if (model.review.remarks == null || model.review.remarks == "") {
                        PageHelper.showProgress("update-loan", "Remarks is mandatory");
                        return false;
                    }
                    if (model.loanAccount.rejectReason == null || model.loanAccount.rejectReason == "") {
                        PageHelper.showProgress("update-loan", "Reject Reason is mandatory");
                        return false;
                    }
                    Utils.confirm("Are You Sure?").then(function() {

                        var reqData = {
                            loanAccount: _.cloneDeep(model.loanAccount)
                        };
                        reqData.loanAccount.status = 'REJECTED';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.stage = "Rejected";
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                return navigateToQueue(model);
                            }, function(httpRes) {
                                PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                    })

                },
                hold: function(model, formCtrl, form, $event) {
                    $log.info("Inside Hold()");
                    PageHelper.clearErrors();
                    /*if (!preLoanSaveOrProceed(model)){
                    return;
                }
*/
                    if (model.review.remarks == null || model.review.remarks == "") {
                        PageHelper.showProgress("update-loan", "Remarks is mandatory");
                        return false;
                    }

                    Utils.confirm("Are You Sure?")
                        .then(
                            function() {
                              var reqData = {
                                    loanAccount: _.cloneDeep(model.loanAccount)
                                };
                                reqData.loanAccount.status = 'HOLD';
                                reqData.loanProcessAction = "SAVE";
                                //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                                reqData.remarks = model.review.remarks;
                                PageHelper.showLoader();
                                IndividualLoan.create(reqData)
                                    .$promise
                                    .then(function(res) {

                                        BundleManager.pushEvent('new-loan', model._bundlePageObj, {
                                            loanAccount: model.loanAccount
                                        });
                                        return navigateToQueue(model);
                                    }, function(httpRes) {
                                        PageHelper.showErrors(httpRes);
                                    })
                                    .finally(function(httpRes) {
                                        PageHelper.hideLoader();
                                    })
                            }
                        );

                },
                sendBack: function(model, formCtrl, form, $event) {
                    $log.info("Inside sendBack()");
                    PageHelper.clearErrors();

                    /* if (model.review.remarks==null || model.review.remarks =="" || model.review.targetStage==null || model.review.targetStage==""){
                         PageHelper.showProgress("update-loan", "Send to Stage / Remarks is mandatory");
                         return false;
                     }*/

                    /* if (!preLoanSaveOrProceed(model)){
                         return;
                     }*/
                    Utils.confirm("Are You Sure?").then(function() {

                        var reqData = {
                            loanAccount: _.cloneDeep(model.loanAccount)
                        };
                        reqData.loanAccount.status = null;
                        if (model.loanAccount.currentStage == 'CreditCommitteeReview') {
                            reqData.loanAccount.status = 'REJECTED'
                        }

                        reqData.loanProcessAction = "PROCEED";
                        reqData.remarks = model.review.remarks;
                        reqData.stage = model.review.targetStage;
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        if (model.loanAccount.currentStage == "Rejected") {
                            model.loanAccount.status = null;
                            model.customer.properAndMatchingSignboard = null;
                            model.customer.bribeOffered = null;
                            model.customer.shopOrganized = null;
                            model.customer.isIndustrialArea = null;
                            model.customer.customerAttitudeToKinara = null;
                            model.customer.bookKeepingQuality = null;
                            model.customer.challengingChequeBounce = null;
                            model.customer.allMachinesAreOperational = null;
                            model.customer.employeeSatisfaction = null;
                            model.customer.politicalOrPoliceConnections = null;
                            model.customer.multipleProducts = null;
                            model.customer.multipleBuyers = null;
                            model.customer.seasonalBusiness = null;
                            model.customer.incomeStability = null;
                            model.customer.utilisationOfBusinessPremises = null;
                            model.customer.approachForTheBusinessPremises = null;
                            model.customer.safetyMeasuresForEmployees = null;
                            model.customer.childLabours = null;
                            model.customer.isBusinessEffectingTheEnvironment = null;
                            model.customer.stockMaterialManagement = null;
                            model.customer.customerWalkinToBusiness = null;
                            var cusData = {
                                customer: _.cloneDeep(model.customer)
                            };
                            EnrollmentHelper.proceedData(cusData).then(function(resp) {
                                formHelper.resetFormValidityState(form);
                            }, function(httpRes) {
                                PageHelper.showErrors(httpRes);
                            });
                        }
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                return navigateToQueue(model);
                            }, function(httpRes) {
                                PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                    })


                },
                proceed: function(model, formCtrl, form, $event) {
                    var DedupeEnabled = SessionStore.getGlobalSetting("DedupeEnabled") || 'N';
                    $log.info(DedupeEnabled);

                    $log.info("Inside Proceed()");
                    PageHelper.clearErrors();
                    var nextStage = null;
                    var dedupeCustomerIdArray = [];

                    /*if (!validateForm(formCtrl)){
                    return;
                }
                if(!validateAndPopulateMitigants(model)){
                    return;
                }
*/


                    var autoRejected = false;



                    if (model.currentStage == 'CreditCommitteeReview') {
                        model.loanAccount.status = 'APPROVED';
                    }
/*
                    if (!preLoanSaveOrProceed(model)) {
                        return;
                    }*/

                    Utils.confirm("Are You Sure?").then(function() {
                        var mandatoryPromises = [];
                        var mandatoryToProceedLoan = {
                            "Dedupe": true
                        };

                        var reqData = {
                            loanAccount: _.cloneDeep(model.loanAccount)
                        };
                        //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                        if (nextStage != null) {
                            reqData.stage = nextStage;
                        }
                        reqData.loanProcessAction = "PROCEED";
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        if (model.currentStage == 'Sanction') {
                            reqData.stage = 'LoanInitiation';
                        }
                        PageHelper.showProgress("update-loan", "Working...");

                        if (reqData.loanAccount.currentStage == 'Screening') {


                            var p2 = $q.when()
                                .then(function() {
                                    $log.info("p2_1 is resolved");
                                    var p2_1 = Scoring.get({
                                        auth_token: AuthTokenHelper.getAuthData().access_token,
                                        LoanId: reqData.loanAccount.id,
                                        ScoreName: "RiskScore1"
                                    }).$promise;
                                    return p2_1;
                                })
                                .then(function() {
                                    var p2_2 = Queries.getQueryForScore1(reqData.loanAccount.id);
                                    p2_2.then(function(result) {
                                        $log.info("p2_2 is resolved");
                                        reqData.loanAccount.literateWitnessFirstName = result.cbScore;
                                        reqData.loanAccount.literateWitnessMiddleName = result.businessInvolvement;
                                    }, function(response) {

                                    });
                                    return p2_2;
                                })

                            mandatoryPromises.push(p2);

                            // Dedupe call
                            if (DedupeEnabled == 'Y') {
                                var p3 = Queries.getDedupeDetails({
                                    "ids": dedupeCustomerIdArray
                                }).then(function(d) {
                                    console.log(d);

                                    if (d.length != dedupeCustomerIdArray.length) {
                                        PageHelper.showProgress("dedupe-status", "Not all customers have done dedupe", 5000);
                                        mandatoryToProceedLoan['Dedupe'] = false;
                                        return;
                                    }

                                    for (var i = 0; i < d.length; i++) {
                                        var item = d[i];
                                        if (item.status != 'finished') {
                                            if (item.status == 'failed') {
                                                PageHelper.showProgress("dedupe-status", "Dedupe has failed. Please Contact IT", 5000);
                                            } else {
                                                PageHelper.showProgress("dedupe-status", "Dedupe process is not completed for all the customers. Please save & try after some time", 5000);
                                            }
                                            mandatoryToProceedLoan['Dedupe'] = false;
                                            break;
                                        }
                                    }

                                    for (var i = 0; i < d.length; i++) {
                                        item = d[i];
                                        if (item.duplicate_above_threshold_count != null && item.duplicate_above_threshold_count > 0) {
                                            reqData.stage = 'Dedupe';
                                            break;
                                        }
                                    }
                                })

                                mandatoryPromises.push(p3);
                            }
                        }

                        $q.all(mandatoryPromises)
                            .then(function() {
                                try {
                                    $log.info("All promises resolved. ")
                                    if (mandatoryToProceedLoan["Dedupe"] == false) {
                                        throw new Error("Dedupe is preventing Loan proceed");
                                    }

                                    reqData.loanAccount.psychometricCompleted = model.loanAccount.psychometricCompleted;
                                    reqData.loanAccount.loanCustomerRelations = _.cloneDeep(model.loanAccount.loanCustomerRelations);
                                    if (autoRejected) {
                                        reqData.loanAccount.rejectReason = reqData.remarks = "Loan Application Auto-Rejected due to Negative Proxy Indicators";
                                    }

                                    IndividualLoan.update(reqData)
                                        .$promise
                                        .then(function(res) {

                                            if (res.stage = "Rejected" && autoRejected) {
                                                Utils.alert("Loan Application Auto-Rejected due to Negative Proxy Indicators");
                                            }

                                            PageHelper.showProgress("update-loan", "Done.", 3000);
                                            return navigateToQueue(model);
                                        }, function(httpRes) {
                                            PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                            PageHelper.showErrors(httpRes);
                                        })
                                        .finally(function() {
                                            PageHelper.hideLoader();
                                        })
                                } catch (e) {
                                    PageHelper.hideLoader();
                                    PageHelper.showProgress("update-loan", "Unable to proceed Loan.", 3000);
                                }

                            }, function(res) {
                                PageHelper.hideLoader();
                                PageHelper.showErrors(res);
                            });

                    })
                }



            }
    }
}
})