define({
    pageUID: "loans.individual.screening.detail.LoanApplicationView",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "$stateParams", "$state",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe", "$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "SchemaResource"
    ],
    $pageFn: function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage, $stateParams, $state,
        PageHelper, Utils, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, Dedupe, $resource, $httpParamSerializer, BASE_URL, searchResource, SchemaResource) {
        return {
            "type": "schema-form",
            "title": "LOAN_RECOMMENDATION",
            "subTitle": "",
            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                model.bundleModel = bundleModel;
                model.loanAccount = bundleModel.loanAccount;

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

                model.updateChosenMitigant = function(checked,item) {
                    if (checked) {
                        // add item
                        item.selected=true;
                        $log.info( model.deviationDetails +"kishan");

                    } else {
                        // remove item
                       item.selected=false;
                       $log.info(model.deviationDetails+"yadav")
                    }
                };



                Enrollment.getCustomerById({
                    id: model.customerId
                }).$promise.then(function(res) {
                    model.customer = res;
                    BundleManager.pushEvent('loanRequest_customer', model._bundlePageObj, model.customer);
                });

            },
            form: [{
                    key: "loanAccount.linkedAccountNumber",
                    title: "LINKED_ACCOUNT_NUMBER",
                    type: "lov",
                    autolov: true,
                    searchHelper: formHelper,
                    search: function(inputModel, form, model, context) {
                        var promise = LoanProcess.viewLoanaccount({
                            urn: model.enterprise.urnNo
                        }).$promise;
                        return promise;
                    },
                    getListDisplayItem: function(item, index) {
                        $log.info(item);
                        return [
                            item.accountId,
                            item.glSubHead,
                            item.amount,
                            item.npa,
                        ];
                    },
                    onSelect: function(valueObj, model, context) {
                        model.loanAccount.npa = valueObj.npa;
                        model.loanAccount.linkedAccountNumber = valueObj.accountId;
                    }
                }, {
                    key: "loanAccount.npa",
                    title: "IS_NPA",
                },

                {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "PRELIMINARY_LOAN_INFORMATION",
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
                                "title": "Loan Amount Requested"
                            }, {
                                "key": "loanAccount.emiRequested",
                                "title": "Requested EMI Payment Date"
                            }, {
                                "key": "loanAccount.expectedPortfolioInsurancePremium",
                                "title": "Expected Portfolio Insurance Premium"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.frequencyRequested",
                                "title": "Requested Frequency"
                            }, {
                                "key": "loanAccount.tenureRequested",
                                "title": "Requested Tenure"
                            }, {
                                "key": "loanAccount.expectedInterestRate",
                                "title": "Expected Interest Rate"
                            }, {
                                "key": "loanAccount.expectedEmi",
                                "title": "Expected Kinara EMI"
                            }, {
                                "key": "loanAccount.emiRequested",
                                "title": "Requested EMI"
                            }]
                        }]
                    }]
                }, {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "Additional Loan Info",
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
                                "title": "Proposed Hires"
                            }, {
                                "key": "loanAccount.percentageIncreasedIncome",
                                "title": "% of Increased Income"
                            }, {
                                "key": "loanAccount.percentageInterestSaved",
                                "title": "% of Interest Saved"
                            }]
                        }]
                    }]
                }, {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "Deduction From Loan Amount",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.expectedProcessingFeePercentage",
                                "title": "Expected Processing Fee(in%)"
                            }, {
                                "key": "loanAccount.expectedCommercialCibilCharge",
                                "title": "Expected CIBIL Charges"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.estimatedEmi",
                                "title": "Expected Security EMI(in Rs.)"
                            }]
                        }]
                    }]
                }, {
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "Asset Purchase Detail",
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
                                "title": "Purchase Price"
                            }, {
                                "key": "asset_details.expectedIncome",
                                "title": "Expected Income"
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
                    "title": "Nominee Detail",
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
                },
                /*{
                                   "type": "box",
                                   "colClass": "col-sm-12",
                                   "title": "DEVIATION_AND_MITIGATIONS",
                                   "condition": "model.currentStage != 'ScreeningReview'",
                                   "items": [{
                                       "type": "section",
                                       "colClass": "col-sm-12",
                                       "html": '<table class="table"><colgroup><col width="20%"><col width="5%"><col width="20%"></colgroup><thead><tr><th>Parameter Name</th><th></th><th>Actual Value</th><th>Mitigant</th></tr></thead><tbody>'+
                                       '<tr ng-repeat="rowData in model.deviationDetails.data">'+
                                       '<td>{{ rowData["Parameter"] }}</td>'+
                                       '<td> <span class="square-color-box" style="background: {{ rowData.color_hexadecimal }}"> </span></td>'+
                                       '<td>{{ rowData["Deviation"] }}</td>'+
                                       '<td><ul class="list-unstyled">'+
                                       '<li ng-repeat="m in rowData.ListOfMitigants">'+
                                       '<input type="checkbox" ng-checked="m.selected"> {{ m }}'+
                                       '</li></ul></td></tr></tbody></table>'
                                   }]
                                   model.deviationDetails.push({
                            parameter: item.Parameter,
                            score: item.ParameterScore,
                            deviation: item.Deviation,
                            mitigants: mitigants,
                            color_english:item.color_english,
                            color_hexadecimal:item.color_hexadecimal

                        }
                        model.updateChosenMitigants(m.selected,m,$parent.$index)
                               }*/
                {
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
                            //'<input type="checkbox"  ng-model="m.selected" ng-checked="m.selected"> {{ m.mitigant }}' +
                            '<input type="checkbox"  ng-model="m.selected" ng-change="model.updateChosenMitigant(m.selected,m)"> {{ m.mitigant }}' +
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
                                "title": "Current Exposure"
                            }, {
                                "key": "loanAccount.loanAmount",
                                "title": "Loan Amount Recommended"
                            }, {
                                "key": "loanAccount.tenure",
                                "title": "Duration(months)"
                            }, {
                                "key": "loanAccount.interestRate",
                                "title": "Interest Rate"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.estimatedEmi",
                                "title": "Estimated Kinara EMI"
                            }, {
                                "key": "loanAccount.processingFeePercentage",
                                "title": "Processing Fee(in%)"
                            }, {
                                "key": "loanAccount.estimatedEmi",
                                "title": "Expected Security EMI"
                            }, {
                                "key": "loanAccount.commercialCibilCharge",
                                "title": "CIBIL Charges"
                            }]
                        }]
                    }]
                }, {
                    "type": "box",
                    "title": "POST_REVIEW",
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
                    }]
                }
            ],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            eventListeners: {
                "financial-summary": function(bundleModel, model, params) {
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
                            mitigants[j] =  allMitigants[mitigants[j]];
                        }
                        if (item.ChosenMitigant && item.ChosenMitigant !=null) {
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
                            color_english:item.color_english,
                            color_hexadecimal:item.color_hexadecimal
                        });
                    }

                    /*/*for (var i = 0; i < model.deviationDetails.data.length; i++) {
                        var d = model.deviationDetails.data[i];
                        /*  d.newData=[];*/
                        /*if (d.Mitigant && d.Mitigant.length != 00) {
                            if (d.Mitigant && d.Mitigant != null) {
                                d.ListOfMitigants = d.Mitigant.split("|");
                            }
*/
                            /*for(var i=0;i<d.ListOfMitigants.length;i++){
                                d.newData[i]={
                                    id:d.ListOfMitigants[i],
                                    selected:false
                                }
                            }*/
/*
                        }
                    }*/
                 /*   model.deviationParameter = [];
                    model.myvar = 0;
                    for (var i = 0; i < model.deviationDetails.data.length; i++) {
                        var d = model.deviationDetails.data[i];
                        model.deviationParameter.push(_.cloneDeep(model.deviationDetails.data[i]));
                        delete model.deviationParameter[model.deviationParameter.length - 1].ListOfMitigants;
                        delete model.deviationParameter[model.deviationParameter.length - 1].Mitigant;
                        model.deviationParameter[model.deviationParameter.length - 1].mitigants = [];
                        model.deviationParameter[model.deviationParameter.length - 1].ChosenMitigant = [];
                        if (d.Mitigant && d.Mitigant.length != 00) {
                            d.ListOfMitigants = d.Mitigant.split("|");
                            for (var j = 0; j < d.ListOfMitigants.length; j++) {
                                model.deviationParameter[model.deviationParameter.length - 1].mitigants.push({
                                    mitigantName: d.ListOfMitigants[j],
                                    chosen: true
                                });
                            }
                        }
                    }*/

                    model.additional = {};
                }
            },
            actions: {
                submit: function(model) {
                    // function: updateChosenMitigants // model.allMitigants is object
                    model.loanAccount.loanMitigants = [];
                    _.forOwn(model.allMitigants, function(v, k) {
                        if (v.selected) {
                            model.loanAccount.loanMitigants.push(v);
                        }
                    })
                }/*,
                updateChosenMitigants:function() {
                    
                }*/
            }
        }
    }
})