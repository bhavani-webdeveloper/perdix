define({
    pageUID: "loans.individual.screening.detail.LoanApplicationView",
    pageType: "Engine",
    dependencies: ["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q","irfProgressMessage","$stateParams","$state",
    "PageHelper", "Utils","PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe","$resource","$httpParamSerializer","BASE_URL","searchResource","SchemaResource"],
    $pageFn: function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,irfProgressMessage,$stateParams,$state,
     PageHelper, Utils,PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, Dedupe,$resource,$httpParamSerializer,BASE_URL, searchResource,SchemaResource){
        return {
            "type": "schema-form",
            "title": "LOAN_RECOMMENDATION",
            "subTitle": "",
            initialize: function(model, form, formCtrl,bundlePageObj, bundleModel) {
                model.bundleModel = bundleModel;
                model.loanAccount=bundleModel.loanAccount;
                Enrollment.getCustomerById({id:model.customerId}).$promise.then(function(res){
                            model.customer=res;
                });
                
            },
            form: [ {
                        key:"loanAccount.linkedAccountNumber",
                        title:"LINKED_ACCOUNT_NUMBER",
                        type:"lov",
                        autolov: true,
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var promise = LoanProcess.viewLoanaccount(
                            {
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
                    },
                    {
                        key: "loanAccount.npa",
                        title: "IS_NPA",
                    },

            {
                "type":"box",
                "readonly":true,
                "colClass": "col-sm-12",
                "title":"PRELIMINARY_LOAN_INFORMATION",
                "items":[
                    {
                        "type": "grid",
                        "orientation":"horizontal",
                        "items": [
                            {
                                "type": "grid",
                                "orientation": "vertical",
                                "items":[
                                    {
                                        "key":"loanAccount.loanPurpose1",
                                        "title":"Loan Purpose"
                                    },
                                    {
                                        "key":"loanAccount.loanPurpose2",
                                        "title":"Loan SubPurpose"
                                    },
                                    {
                                        "key":"loanAccount.loanAmountRequested",
                                        "title":"Loan Amount Requested"
                                    },
                                    {
                                        "key":"loanAccount.emiRequested",
                                        "title":"Requested EMI Payment Date"
                                    },
                                    {
                                        "key":"loanAccount.expectedPortfolioInsurancePremium",
                                        "title":"Expected Portfolio Insurance Premium"
                                    }
                                ]
                            },
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"loanAccount.frequencyRequested",
                                        "title":"Requested Freequency"
                                    },
                                    {
                                        "key":"loanAccount.tenureRequested",
                                        "title":"Requested Tenure"
                                    },
                                    {
                                        "key":"loanAccount.expectedInterestRate",
                                        "title":"Expected Interest Rate"
                                    },
                                    {
                                        "key":"loanAccount.expectedEmi",
                                        "title":"Expected Kinara EMI"
                                    },
                                    {
                                        "key":"loanAccount.emiRequested",
                                        "title":"Requested EMI"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "readonly":true,
                "colClass": "col-sm-12",
                "title":"Additional Loan Info",
                "items":[
                    {
                        "type": "grid",
                        "orientation":"horizontal",
                        "items": [
                            {
                                "type": "grid",
                                "orientation": "vertical",
                                "items":[
                                    {
                                        "key":"loanAccount.estimatedDateOfCompletion",
                                        "title":"Estimated Date Of Completion"
                                    },
                                    {
                                        "key":"loanAccount.productCategory",
                                        "title":"Product Type"
                                    },
                                    {
                                        "key":"loanAccount.customerSignDateExpected",
                                        "title":"Expected Customer Signed Date"
                                    }
                                ]
                            },
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"loanAccount.proposedHires",
                                        "title":"Proposed Hires"
                                    },
                                    {
                                        "key":"loanAccount.percentageIncreasedIncome",
                                        "title":"% of Increased Income"
                                    },
                                    {
                                        "key":"loanAccount.percentageInterestSaved",
                                        "title":"% of Interest Saved"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "readonly":true,
                "colClass": "col-sm-12",
                "title":"Deduction From Loan Amount",
                "items":[
                    {
                        "type": "grid",
                        "orientation":"horizontal",
                        "items": [
                            {
                                "type": "grid",
                                "orientation": "vertical",
                                "items":[
                                    {
                                        "key":"loanAccount.expectedProcessingFeePercentage",
                                        "title":"Expected Processing Fee(in%)"
                                    },
                                    {
                                        "key":"loanAccount.expectedCommercialCibilCharge",
                                        "title":"Expected CIBIL Charges"
                                    }
                                ]
                            },
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"loanAccount.estimatedEmi",
                                        "title":"Expected Security EMI(in Rs.)"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "readonly":true,
                "colClass": "col-sm-12",
                "title":"Asset Purchase Detail",
                "items":[
                    {
                        "type": "grid",
                        "orientation":"horizontal",
                        "items": [
                            {
                                "type": "grid",
                                "orientation": "vertical",
                                "items":[
                                    {
                                        "key":"loanAccount.collateral[0].collateralDescription",
                                        "title":"Machine"
                                    },
                                    {
                                        "key":"loanAccount.collateral[0].collateralValue",
                                        "title":"Purchase Price"
                                    },
                                    {
                                        "key":"loanAccount.collateral[0].expectedIncome",
                                        "title":"Expected Income"
                                    },
                                    {
                                        "key":"loanAccount.collateral[0].collateralType",
                                        "title":"Machine Type"
                                    },
                                    {
                                        "key":"loanAccount.collateral[0].manufacturer",
                                        "title":"Manufacturer Name"
                                    },
                                    {
                                        "key":"loanAccount.collateral[0].modelNo",
                                        "title":"Machine Model"
                                    }
                                ]
                            },
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"loanAccount.collateral[0].serialNo",
                                        "title":"Serial No"
                                    },
                                    {
                                        "key":"loanAccount.collateral[0].expectedPurchaseDate",
                                        "title":"Expected Purchase Date"
                                    },
                                    {
                                        "key":"loanAccount.collateral[0].machineAttachedToBuilding",
                                        "title":"Machine Permanently Fixed To Building"
                                    },
                                    {
                                        "key":"loanAccount.collateral[0].hypothecatedToBank",
                                        "title":"Wheter Hypothecated To Kinara"
                                    },
                                    {
                                        "key":"loanAccount.collateral[0].electricityAvailable",
                                        "title":"Electricity Available"
                                    },
                                    {
                                        "key":"loanAccount.collateral[0].spaceAvailable",
                                        "title":"Space Available"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "readonly":true,
                "colClass": "col-sm-12",
                "title":"Nominee Detail",
                "items":[
                    {
                        "type": "grid",
                        "orientation":"horizontal",
                        "items": [
                            {
                                "type": "grid",
                                "orientation": "vertical",
                                "items":[
                                    {
                                        "key":"loanAccount.nominees[0].nomineeFirstName",
                                        "title":"Name"
                                    },
                                    {
                                        "key":"loanAccount.nominees[0].nomineeGender",
                                        "title":"Gender"
                                    },
                                    {
                                        "key":"loanAccount.nominees[0].nomineeDOB",
                                        "title":"Date Of Birth"
                                    }
                                ]
                            },
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"loanAccount.nominees[0].nomineeRelationship",
                                        "title":"Relationship To Insured"
                                    },
                                    {
                                        "key":"",
                                        "title":"Address"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "colClass":"col-sm-12",
                "readonly":true,
                "title":"Deviations and Mitigations",
                "items":[
                    {

                    }
                ]
            },
            {
                "type":"box",
                "colClass": "col-sm-12",
                "title":"Loan Recommendation",
                "items":[
                    {
                        "type": "grid",
                        "orientation":"horizontal",
                        "items": [
                            {
                                "type": "grid",
                                "orientation": "vertical",
                                "items":[
                                    {
                                        "key":"",
                                        "title":"Current Exposure"
                                    },
                                    {
                                        "key":"loanAccount.loanAmount",
                                        "title":"Loan Amount Recommended"
                                    },
                                    {
                                        "key":"loanAccount.tenure",
                                        "title":"Duration(months)"
                                    },
                                    {
                                        "key":"loanAccount.interestRate",
                                        "title":"Interest Rate"
                                    }
                                ]
                            },
                            {
                                "type":"grid",
                                "orientation":"vertical",
                                "items":[
                                    {
                                        "key":"loanAccount.estimatedEmi",
                                        "title":"Estimated Kinara EMI"
                                    },
                                    {
                                        "key":"loanAccount.processingFeePercentage",
                                        "title":"Processing Fee(in%)"
                                    },
                                    {
                                        "key":"loanAccount.estimatedEmi",
                                        "title":"Expected Security EMI"
                                    },
                                    {
                                        "key":"loanAccount.commercialCibilCharge",
                                        "title":"CIBIL Charges"
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "colClass":"col-sm-12",
                "title":"Post Review Decision",
                "items":[
                    {
                        
                    }
                ]
            }
        ],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;    
        },
        actions: {}
    }
}
})