define([],function(){

    return {
        pageUID: "irep.loans.individual.origination.LoanRequest",
        pageType: "Engine",
        dependencies: ["$log", "$q","LoanAccount","LoanProcess", 'Scoring', 'Enrollment','EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
            'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor","UIRepository", "$injector", "irfNavigator"],

        $pageFn: function($log, $q, LoanAccount,LoanProcess, Scoring, Enrollment,EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper,formHelper,elementsUtils,
                          irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
                          BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();
            var podiValue = SessionStore.getGlobalSetting("percentOfDisposableIncome");
            //PMT calculation
            var pmt = function(rate, nper, pv, fv, type) {
                if (!fv) fv = 0;
                if (!type) type = 0;

                if (rate == 0) return -(pv + fv) / nper;

                var pvif = Math.pow(1 + rate, nper);
                var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

                if (type == 1) {
                    pmt /= (1 + rate);
                };

                return pmt;
            }
            //pmt function completed

            var self;
            var validateForm = function(formCtrl){
                formCtrl.scope.$broadcast('schemaFormValidate');
                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                    return false;
                }
                return true;
            };

            var getRelationFromClass = function(relation){
                if (relation == 'guarantor'){
                    return 'Guarantor';
                } else if (relation == 'applicant'){
                    return 'Applicant';
                } else if (relation == 'co-applicant'){
                    return 'Co-Applicant';
                }
            };
            var tempGlobalerrMsg = "";
            var policyByStage = function(model){
                if (model.loanAccount.currentStage == 'KYC'){
                    for (var i=0;i<model.loanAccount.loanCustomerRelations.length;i++){
                        if (model.loanAccount.loanCustomerRelations[i].relation == "Co-Applicant")
                            return true
                    }
                    tempGlobalerrMsg = "Atleast one Co-Applicant is  necessary";
                    return false;
                }
                else if (model.loanAccount.currentStage == 'GuarantorAddition'){
                    for (var i=0;i<model.loanAccount.loanCustomerRelations.length;i++){
                        if (model.loanAccount.loanCustomerRelations[i].relation == "Guarantor")
                            return true
                    }
                    tempGlobalerrMsg = "Atleast one Guarantor is  necessary";
                    return false;
                }
                else
                    return true;
            }



            var configFile = function() {
                return {
                    "loanAccount.currentStage": {
                        "KYC": {
                            "excludes": [
                                "LoanRecommendation",
                                "LoanSanction",
                                "LoanMitigants",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                    "LoanMitigants.deviationParameter",
                                "AdditionalLoanInformation",
                                "NomineeDetails",
                                "PreliminaryInformation.expectedPortfolioInsurancePremium",
                                "ProposedUtilizationPlan",                      
                                "CollateralDetails"
                            ],
                            "overrides": {                                
                                "PreliminaryInformation": {
                                    "orderNo": 1
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2
                                },
                                "DeductionsFromLoan": {
                                    "orderNo": 3
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "PreliminaryInformation.loanAmountRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.tenureRequested": {
                                    "type": "select",
                                    "schema": {
                                             "enumCode": "tenure_requested",
                                        }
                                },
                                "PreliminaryInformation.expectedEmi": {
                                    "readonly": true,
                                },
                                "PreliminaryInformation.emiRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.collectionPaymentType": {
                                    "required": true
                                },
                                "PreliminaryInformation.loanPurpose1": {
                                    "resolver": "LoanPurpose1LOVConfiguration"
                                },
                                "PreliminaryInformation.loanPurpose2": {
                                    "resolver": "LoanPurpose2LOVConfiguration"
                                },                                
                                "LoanCustomerRelations.loanCustomerRelations": {
                                    "add": null,
                                    "remove": null,
                                    "startEmpty": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.customerId": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.urn": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.name": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relation": {
                                   "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                   "required": true
                                }
                            }
                        },
                        "GuarantorAddition": {
                           "excludes": [
                                "ProposedUtilizationPlan",
                                "LoanSanction",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                                "LoanMitigants.deviationParameter",
                                "NomineeDetails.nominees.nomineeButton",
                                "PreliminaryInformation.actualAmountRequired",
                                "PreliminaryInformation.fundsFromDifferentSources", 
                                "LoanRecommendation"           
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6,
                                    "readonly": true
                                },
                                "CollateralDetails": {
                                    "orderNo": 7,
                                    "readonly": true
                                },
                                "NomineeDetails": {
                                    "orderNo": 8,
                                    "readonly": true
                                }, 
                                "LoanCustomerRelations.loanCustomerRelations.customerId":{
                                    "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.urn":{
                                    "readonly":true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.name":{
                                    "readonly":true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relation":{
                                    "readonly":true
                                },                               
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'&& model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Guarantor'",
                                   "readonly":true
                                }          
                            }
                        },
                        "KYCReview": {
                            "excludes": [
                                "LoanRecommendation",
                                "LoanSanction",
                                "LoanMitigants",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                    "LoanMitigants.deviationParameter",                                
                                "AdditionalLoanInformation",
                                "NomineeDetails",
                                "ProposedUtilizationPlan",
                                "CollateralDetails"
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "orderNo": 3,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "LoanRecommendation": {
                                    "orderNo": 6
                                },                                
                                "LoanCustomerRelations.loanCustomerRelations": {
                                    "add": null,
                                    "remove": null,
                                    "startEmpty": false
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'"
                                }
                            }
                        },
                        "Appraisal": {
                            "excludes": [
                                "LoanRecommendation",
                                "LoanSanction",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                    "LoanMitigants.deviationParameter"               
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6
                                },
                                "CollateralDetails": {
                                    "orderNo": 7
                                },
                                "NomineeDetails": {
                                    "orderNo": 8
                                },
                                "PreliminaryInformation.loanAmountRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.tenureRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.expectedEmi": {
                                    "readonly": true
                                },
                                "PreliminaryInformation.emiRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.collectionPaymentType": {
                                    "required": true
                                },
                                "PreliminaryInformation.expectedPortfolioInsurancePremium": {
                                    "readonly": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations": {
                                    "add": null,
                                    "remove": null,
                                    "startEmpty": true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                   "required": true
                                },
                                "AdditionalLoanInformation.productCategory": {
                                   "required":true,
                                   "type":"select",
                                   "enumCode":"loan_product_category"
                                },
                                "AdditionalLoanInformation.proposedHires": {
                                   "required":true
                                },
                                "NomineeDetails.nominees.nomineeFirstName": {
                                   "required":true,
                                   "resolver": "NomineeFirstNameLOVConfiguration"
                                },
                                "NomineeDetails.nominees.nomineeGender": {
                                   "required":true
                                },
                                "NomineeDetails.nominees.nomineeDOB": {
                                   "required":true
                                },
                                "NomineeDetails.nominees.nomineeButton": {
                                    "orderNo": 41,
                                },
                                "NomineeDetails.nominees.nomineeDoorNo": {
                                   "required":true
                                },
                                "NomineeDetails.nominees.nomineePincode": {
                                   "required": true,
                                   "resolver": "NomineePincodeLOVConfiguration"
                                },
                                "NomineeDetails.nominees.nomineeRelationship": {
                                   "required":true
                                },
                                "CollateralDetails.collateral.collateralDescription": {
                                    "required": true,
                                   "orderNo":10
                                },
                                "CollateralDetails.collateral.collateralValue": {
                                    "required": true,
                                   "orderNo":20
                                },
                                "CollateralDetails.collateral.expectedIncome": {
                                    "required": true,
                                   "orderNo":30
                                },
                                "CollateralDetails.collateral.collateralType": {
                                    "required": true,
                                   "orderNo":40
                                },
                                "CollateralDetails.collateral.manufacturer": {
                                    "required": true,
                                   "orderNo":50
                                },
                                "CollateralDetails.collateral.modelNo": {
                                    "required": true,
                                   "orderNo":60
                                },
                                "CollateralDetails.collateral.serialNo": {
                                   "orderNo":70
                                },
                                "CollateralDetails.collateral.expectedPurchaseDate": {
                                    "required": true,
                                   "orderNo":80
                                },
                                "CollateralDetails.collateral.machineAttachedToBuilding": {
                                    "required": true,
                                   "orderNo":90
                                },
                                "CollateralDetails.collateral.hypothecatedToBank": {
                                    "required": true,
                                   "orderNo":100
                                },
                                "CollateralDetails.collateral.electricityAvailable": {
                                    "required": true,
                                   "orderNo":110
                                },
                                "CollateralDetails.collateral.spaceAvailable": {
                                    "required": true,
                                   "orderNo":120
                                },
                                "CollateralDetails.collateral.collateral1FilePath": {
                                    "required": true,
                                   "orderNo":130
                                },

                            }
                        },
                        "AppraisalReview": {
                            "excludes": [
                                "LoanSanction",
                                "DeductionsFromLoan",
                                "NomineeDetails.nominees.nomineeButton",
                                "LoanMitigants",
                                "LoanRecommendation.udf8",
                                "LoanRecommendation.udf3",
                    "LoanMitigants.deviationParameter"             
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6,
                                    "readonly": true
                                },
                                "CollateralDetails": {
                                    "orderNo": 7,
                                    "readonly": true
                                },
                                "NomineeDetails": {
                                    "orderNo": 8,
                                    "readonly": true
                                },                                
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                }      
                            }
                        },
                        "Televerification": {
                            "excludes": [
                                "ProposedUtilizationPlan",
                                "LoanSanction",
                                "LoanMitigants",
                                "LoanRecommendation.udf8",
                                "LoanRecommendation.udf3",
                    "LoanMitigants.deviationParameter",
                                "PreliminaryInformation.actualAmountRequired",
                                "PreliminaryInformation.fundsFromDifferentSources",
                                "NomineeDetails.nominees.nomineeButton"                   
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6,
                                    "readonly": true
                                },
                                "CollateralDetails": {
                                    "orderNo": 7,
                                    "readonly": true
                                },
                                "NomineeDetails": {
                                    "orderNo": 8,
                                    "readonly": true
                                },                                
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                }      
                                    
                            }
                        },
                        "Evaluation": {
                            "excludes": [
                                "ProposedUtilizationPlan",
                                "LoanSanction",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                    "LoanMitigants.deviationParameter",
                                "PreliminaryInformation.actualAmountRequired",
                                 "PreliminaryInformation.fundsFromDifferentSources",
                                "NomineeDetails.nominees.nomineeButton"                   
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6,
                                    "readonly": true
                                },
                                "CollateralDetails": {
                                    "orderNo": 7,
                                    "readonly": true
                                },
                                "NomineeDetails": {
                                    "orderNo": 8,
                                    "readonly": true
                                },                                
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                } 

                            }       
                        },

                        "CreditCommitteeReview": {
                            "excludes": [
                                "ProposedUtilizationPlan",
                                "LoanSanction",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                    "LoanMitigants.deviationParameter",
                                "PreliminaryInformation.actualAmountRequired",
                                "PreliminaryInformation.fundsFromDifferentSources",
                                "NomineeDetails.nominees.nomineeButton"                   
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6,
                                    "readonly": true
                                },
                                "LoanRecommendation.udf8":{
                                    "readonly": true
                                },
                                "LoanRecommendation.udf3":{
                                    "readonly": true
                                },
                                "CollateralDetails": {
                                    "orderNo": 7,
                                    "readonly": true
                                },
                                "NomineeDetails": {
                                    "orderNo": 8,
                                    "readonly": true
                                },                                
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                }      
                                    
                            }
                        },
                        "Sanction": {
                            "excludes": [
                                "ProposedUtilizationPlan",
                                "DeductionsFromLoan",
                                "LoanMitigants",
                                "LoanMitigants.deviationParameter",
                                "PreliminaryInformation.actualAmountRequired",
                                "PreliminaryInformation.fundsFromDifferentSources",
                                "NomineeDetails.nominees.nomineeButton"                   
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanRecommendation.udf8":{
                                    "readonly": true
                                },
                                "LoanRecommendation.udf3":{
                                    "readonly": true
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6,
                                    "readonly": true
                                },
                                "CollateralDetails": {
                                    "orderNo": 7,
                                    "readonly": true
                                },
                                "NomineeDetails": {
                                    "orderNo": 8,
                                    "readonly": true
                                },
                                "LoanSanction":{
                                    "orderNo": 9
                                },                           
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                }      
                                    
                            }
                        }

                    }

                }
            }

             var overridesFields = function (bundlePageObj) {
                return {
                        "PreliminaryInformation.linkedAccountNumber": {
                            "resolver": "LinkedAccountNumberLOVConfiguration"
                        },
                        "LoanRecommendation.udf8": {
                            "title": "ELIGIBLE_DISPOSABLE_INCOME",
                            "onChange": function(modelValue, form, model, formCtrl, event) {                                
                                var eligibleDi = modelValue * podiValue / 100;
                                var rate =  model.loanAccount.expectedInterestRate / 100;
                                var ir = rate / 12;
                                var tenure = model.loanAccount.tenureRequested; 
                                var constant = 1; 
                                var pmt1 = pmt(ir, tenure, constant, 0, 0);
                                var maximumLoanEligible = eligibleDi / (-pmt(ir, tenure, constant, 0, 0)) * 1;
                                model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf3 = Math.round(maximumLoanEligible);  
                            }                          
                        },
                        "LoanRecommendation.udf3": {
                             "title": "MAXIMUM_ELIGIBLE_LOAN",
                             "readonly":true
                        },
                        "CollateralDetails.collateral.HYPOTHECATED_TO_IREPatedToBank" : {
                            "title": "HYPOTHECATED_TO_IREP"
                        },
                        "PreliminaryInformation.expectedInterestRate": {
                            "type": "select",
                            "enumCode": "customerinfo_expect_interestra"
                        },
                        "PreliminaryInformation.emiPaymentDateRequested": {
                            "enumCode": "customerinfo_emirequest_date"
                        },
                        "PreliminaryInformation.collectionPaymentType": {
                            "enumCode": "customerinfo_colctn_Pymt_type"
                        },
                        "LoanCustomerRelations.loanCustomerRelations": {
                            "add": null,
                            "remove": null,
                            "startEmpty": true
                        },
                        "ProposedUtilizationPlan.loanUtilisationDetail.utilisationType":{
                            "required":true
                        },
                        "ProposedUtilizationPlan.loanUtilisationDetail.fundAllocationPercentage":{
                            "required": true
                        },
                        "NomineeDetails.nominees.nomineeFirstName":{
                            "orderNo":10
                        },
                        "NomineeDetails.nominees.nomineeGender": {
                            "orderNo": 20
                        },
                        "NomineeDetails.nominees.nomineeDOB":{
                            "orderNo": 30
                        },
                        "NomineeDetails.nominees.nomineeRelationship": {
                            "orderNo": 40
                        },
                        "NomineeDetails.nominees.nomineePincode": {
                            "resolver": "PincodeLOVConfiguration",
                            "orderNo":50
                        },
                        "NomineeDetails.nominees.nomineeDoorNo": {
                            "orderNo": 60
                        },
                        "NomineeDetails.nominees.nomineeStreet":{
                            "orderNo": 70
                        },
                        "NomineeDetails.nominees.nomineeLocality": {
                            "orderNo":80
                        },
                        "NomineeDetails.nominees.nomineeDistrict":{
                            "orderNo":90
                        },
                        "NomineeDetails.nominees.nomineeState":{
                            "orderNo":100
                        }

                    }
                }

            var getIncludes = function (model) {

                return [
                    "PreliminaryInformation",
                    "PreliminaryInformation.linkedAccountNumber",
                    "PreliminaryInformation.loan",
                    "PreliminaryInformation.loanPurpose1",
                    "PreliminaryInformation.loanPurpose2",
                    "PreliminaryInformation.loanAmountRequested",
                    "PreliminaryInformation.loanToValue",
                    "PreliminaryInformation.frequencyRequested",
                    "PreliminaryInformation.tenureRequested",
                    "PreliminaryInformation.expectedInterestRate",
                    "PreliminaryInformation.expectedEmi",
                    "PreliminaryInformation.emiRequested",
                    "PreliminaryInformation.emiPaymentDateRequested",
                    "PreliminaryInformation.collectionPaymentType",
                    "PreliminaryInformation.expectedPortfolioInsurancePremium",
                    "PreliminaryInformation.actualAmountRequired",
                    "PreliminaryInformation.fundsFromDifferentSources",
                    

                    "LoanCustomerRelations",
                    "LoanCustomerRelations.loanCustomerRelations",
                    "LoanCustomerRelations.loanCustomerRelations.customerId",
                    "LoanCustomerRelations.loanCustomerRelations.urn",
                    "LoanCustomerRelations.loanCustomerRelations.name",
                    "LoanCustomerRelations.loanCustomerRelations.relation",
                    "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant",
                    "LoanCustomerRelations.loanCustomerRelations.relationShipWithApplicantv2",

                    "DeductionsFromLoan",
                    "DeductionsFromLoan.expectedProcessingFeePercentage",
                    "DeductionsFromLoan.expectedCommercialCibilCharge",
                    "DeductionsFromLoan.estimatedEmi",

                    "LoanMitigants",
                    "LoanMitigants.deviationParameter",
                    "LoanMitigants.deviationParameter.mitigants",
                    "LoanMitigants.deviationParameter.mitigants.mitigantsName",
                    "LoanMitigants.deviationParameter.mitigants.mitigantsName.sectionSelected",
                    "LoanMitigants.deviationParameter.mitigants.mitigantsName.sectionSelected.selected",
                    "LoanMitigants.deviationParameter.mitigants.mitigantsName.sectionMitigantName",
                    "LoanMitigants.deviationParameter.mitigants.mitigantsName.sectionMitigantName.mitigantName",

                    "LoanDocuments",
                    "LoanDocuments.loanDocuments",
                    "LoanDocuments.loanDocuments.document",
                    "LoanDocuments.loanDocuments.documentId",

                    "LoanRecommendation",
                    "LoanRecommendation.loanAmount",
                    "LoanRecommendation.tenure",
                    "LoanRecommendation.interestRate",
                    "LoanRecommendation.estimatedEmi",
                    "LoanRecommendation.processingFeePercentage",
                    "LoanRecommendation.securityEmiRequired",
                    "LoanRecommendation.commercialCibilCharge",
                    "LoanRecommendation.udf8",
                    "LoanRecommendation.udf3",

                    "LoanSanction",
                    "LoanSanction.sanctionDate",
                    "LoanSanction.numberOfDisbursements",
                    "LoanSanction.disbursementSchedules",
                    "LoanSanction.disbursementSchedules.disbursementAmount",

                    "AdditionalLoanInformation",
                    "AdditionalLoanInformation.estimatedDateOfCompletion",
                    "AdditionalLoanInformation.productCategory",
                    "AdditionalLoanInformation.customerSignDateExpected",
                    "AdditionalLoanInformation.proposedHires",
                    "AdditionalLoanInformation.percentageIncreasedIncome",
                    "AdditionalLoanInformation.percentageInterestSaved",

                    "CollateralDetails",
                    "CollateralDetails.collateral",
                    "CollateralDetails.collateral.collateralDescription",
                    "CollateralDetails.collateral.collateralValue",
                    "CollateralDetails.collateral.expectedIncome",
                    "CollateralDetails.collateral.collateralType",
                    "CollateralDetails.collateral.manufacturer",
                    "CollateralDetails.collateral.modelNo",
                    "CollateralDetails.collateral.serialNo",
                    "CollateralDetails.collateral.expectedPurchaseDate",
                    "CollateralDetails.collateral.machineAttachedToBuilding",
                    "CollateralDetails.collateral.hypothecatedToBank",
                    "CollateralDetails.collateral.electricityAvailable",
                    "CollateralDetails.collateral.spaceAvailable",
                    "CollateralDetails.collateral.collateral1FilePath",

                    "NomineeDetails",                    
                    "NomineeDetails.nominees",
                    "NomineeDetails.nominees.nomineeFirstName",
                    "NomineeDetails.nominees.nomineeGender",
                    "NomineeDetails.nominees.nomineeDOB",
                    "NomineeDetails.nominees.nomineeButton",
                    "NomineeDetails.nominees.nomineeDoorNo",
                    "NomineeDetails.nominees.nomineeLocality",
                    "NomineeDetails.nominees.nomineeStreet",
                    "NomineeDetails.nominees.nomineePincode",
                    "NomineeDetails.nominees.nomineeDistrict",
                    "NomineeDetails.nominees.nomineeState",
                    "NomineeDetails.nominees.nomineeRelationship",

                    "PostReview",
                    "PostReview.action",
                    "PostReview.proceed",
                    "PostReview.proceed.remarks",
                    "PostReview.proceed.proceedButton",
                    "PostReview.sendBack",
                    "PostReview.sendBack.remarks",
                    "PostReview.sendBack.stage",
                    "PostReview.sendBack.sendBackButton",
                    "PostReview.reject",
                    "PostReview.reject.remarks",
                    "PostReview.reject.rejectReason",
                    "PostReview.reject.rejectButton",
                    "PostReview.hold",
                    "PostReview.hold.remarks",
                    "PostReview.hold.holdButton",

                    "ProposedUtilizationPlan",
                    "ProposedUtilizationPlan.loanUtilisationDetail",
                    "ProposedUtilizationPlan.loanUtilisationDetail.utilisationType",
                    "ProposedUtilizationPlan.loanUtilisationDetail.fundAllocationPercentage",
                    "ProposedUtilizationPlan.loanUtilisationDetail.consumptionDetails"
                ];

            }

            return {
                "type": "schema-form",
                "title": "LOAN_REQUEST",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // AngularResourceService.getInstance().setInjector($injector);

                    /* Setting data recieved from Bundle */
                    model.loanAccount = model.loanProcess.loanAccount;
                    if (model.loanAccount.expectedInterestRate)
                        model.loanAccount.expectedInterestRate = model.loanAccount.expectedInterestRate.toString();
                    if (model.loanAccount.tenureRequested)
                        model.loanAccount.tenureRequested = model.loanAccount.tenureRequested.toString();
                    if (_.hasIn(model, 'loanAccount.loanCustomerRelations') &&
                        model.loanAccount.loanCustomerRelations!=null &&
                        model.loanAccount.loanCustomerRelations.length > 0) {
                        var lcr = model.loanAccount.loanCustomerRelations;
                        var idArr = [];
                    for (var i=0;i<lcr.length;i++){
                        idArr.push(lcr[i].customerId);
                    }
                    Queries.getCustomerBasicDetails({'ids': idArr})
                    .then(function(result){
                        if (result && result.ids){
                             for (var i = 0; i < lcr.length; i++) {
                                var cust = result.ids[lcr[i].customerId];
                            if (cust) {
                                lcr[i].name = cust.first_name;
                             }
                        }
                     }
                     });
                    }

                    BundleManager.broadcastEvent('loan-account-loaded', {loanAccount: model.loanAccount});                     

                     /* Deviations and Mitigations grouping */
                    if (_.hasIn(model.loanAccount, 'loanMitigants') && _.isArray(model.loanAccount.loanMitigants)){
                        var loanMitigantsGrouped = {};
                        for (var i=0; i<model.loanAccount.loanMitigants.length; i++){
                            var item = model.loanAccount.loanMitigants[i];
                            if (!_.hasIn(loanMitigantsGrouped, item.parameter)){
                                loanMitigantsGrouped[item.parameter] = [];
                            }
                            loanMitigantsGrouped[item.parameter].push(item);
                        }
                        model.loanMitigantsByParameter = [];
                        _.forOwn(loanMitigantsGrouped, function(mitigants, key){
                            var chosenMitigants = "<ul>";

                            for (var i=0; i<mitigants.length; i++){
                                chosenMitigants = chosenMitigants + "<li>" + mitigants[i].mitigant + "</li>";
                            }
                            chosenMitigants = chosenMitigants + "</ul>";
                            model.loanMitigantsByParameter.push({'Parameter': key, 'Mitigants': chosenMitigants})
                        })
                    }
                    /* End of Deviations and Mitigations grouping */

                    self = this;
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;
                    p1.then(function(repo) {                        
                        var formRequest = {
                            "overrides": overridesFields(model),
                            "includes": getIncludes(model),
                            "excludes": [
                            ],
                            "options": {
                                "repositoryAdditions": {
                                    "NomineeDetails": {
                                        "type": "box",
                                        "title": "NOMINEE_DETAILS",
                                        "orderNo": 300,
                                        "items": {
                                            "nominees": {
                                                "key": "loanAccount.nominees",
                                                "type": "array",
                                                "notitle": "true",
                                                "view": "fixed",
                                                "add": null,
                                                "remove": null,
                                                "items": {
                                                    "nomineeButton": {
                                                        "type": "button",
                                                        "title": "NOMINEE_ADDRESS_APPLICANT",
                                                        "onClick": "actions.nomineeAddress(model, formCtrl, form, $event)"
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "LoanCustomerRelations": {
                                        "items": {
                                            "loanCustomerRelations": {
                                                "items": {
                                                    "relationShipWithApplicantv2": {
                                                        condition:"model.loanAccount.currentStage == 'GuarantorAddition' && model.loanAccount.loanCustomerRelations[arrayIndex].relation == 'Guarantor'",
                                                        "key": "loanAccount.loanCustomerRelations[].relationshipWithApplicant",
                                                        "title": "RELATIONSHIP_WITH_APPLICATION",
                                                        "type": "select",
                                                        "enumCode": "relation",
                                                        "required":true
                                                    },
                                                }
                                            }
                                        }
                                    },
                                    "PostReview": {
                                        "type": "box",
                                        "title": "POST_REVIEW",
                                        "condition": "model.loanAccount.id",
                                        "orderNo": 600,
                                        "items": {
                                            "action": {
                                                "key": "review.action",
                                                "type": "radios",
                                                "titleMap": {
                                                    "REJECT": "REJECT",
                                                    "SEND_BACK": "SEND_BACK",
                                                    "PROCEED": "PROCEED",
                                                    "HOLD": "HOLD"
                                                }
                                            }, 
                                            "proceed": {
                                                "type": "section",
                                                "condition": "model.review.action=='PROCEED'",
                                                "items": {
                                                    "remarks": {
                                                        "title": "REMARKS",
                                                        "key": "loanProcess.remarks",
                                                        "type": "textarea",
                                                        "required": true
                                                    }, 
                                                    "proceedButton": {
                                                        "key": "review.proceedButton",
                                                        "type": "button",
                                                        "title": "PROCEED",
                                                        "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                                    }
                                                }
                                            },
                                            "sendBack": {
                                                "type": "section",
                                                "condition": "model.review.action=='SEND_BACK'",
                                                "items": {
                                                    "remarks": {
                                                        "title": "REMARKS",
                                                        "key": "loanProcess.remarks",
                                                        "type": "textarea",
                                                        "required": true
                                                    }, 
                                                   "stage": {
                                                        "key": "loanProcess.stage",
                                                        "required": true,
                                                        "type": "lov",
                                                        "title": "SEND_BACK_TO_STAGE",
                                                        "resolver": "IREPSendBacktoStageLOVConfiguration"
                                                    }, 
                                                   "sendBackButton": {
                                                        "key": "review.sendBackButton",
                                                        "type": "button",
                                                        "title": "SEND_BACK",
                                                        "onClick": "actions.sendBack(model, formCtrl, form, $event)"
                                                    }
                                                }
                                            },
                                            "reject": {
                                                "type": "section",
                                                "condition": "model.review.action=='REJECT'",
                                                "items": {
                                                    "remarks": {
                                                        "title": "REMARKS",
                                                        "key": "loanProcess.remarks",
                                                        "type": "textarea",
                                                        "required": true
                                                    }, 
                                                    "rejectReason": {
                                                        "key": "loanAccount.rejectReason",
                                                        "type": "lov",
                                                        "autolov": true,
                                                        "required":true,
                                                        "title": "REJECT_REASON",
                                                        "resolver": "IREPRejectReasonLOVConfiguration"
                                                    },
                                                    "rejectButton": {
                                                        "key": "review.rejectButton",
                                                        "type": "button",
                                                        "title": "REJECT",
                                                        "required": true,
                                                        "onClick": "actions.reject(model, formCtrl, form, $event)"
                                                    }
                                                }
                                            },
                                            "hold": {
                                                "type": "section",
                                                "condition": "model.review.action=='HOLD'",
                                                "items": {
                                                "remarks": {
                                                    "title": "REMARKS",
                                                    "key": "loanProcess.remarks",
                                                    "type": "textarea",
                                                    "required": true
                                                }, 
                                                "holdButton": {
                                                    "key": "review.holdButton",
                                                    "type": "button",
                                                    "title": "HOLD",
                                                    "required": true,
                                                    "onClick": "actions.holdButton(model, formCtrl, form, $event)"
                                                }
                                            }
                                            }
                                        }
                                    }
                                },
                                "additions": [
                                    {
                                        "type": "actionbox",
                                        "orderNo": 1000,
                                        "items": [
                                            {
                                                "type": "submit",
                                                "title": "SAVE"
                                            },
                                        ]
                                    }
                                ]
                            }
                        };
                        return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model);
                    })
                    .then(function(form){
                        self.form = form;
                    });
                },
                offline: false,
                getOfflineDisplayItem: function(item, index){
                    return [
                        item.customer.firstName,
                        item.customer.centreCode,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "lead-loaded": function(bundleModel, model, obj) {
                        model.lead = obj;
                        model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                        model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                        model.loanAccount.screeningDate = obj.screeningDate;
                    },
                    "new-business": function(bundleModel, model, params){
                        $log.info("Inside new-business of LoanRequest");
                        model.loanAccount.customerId = params.customer.id;
                        model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                        model.loanAccount.loanCentre.centreId = params.customer.centreId;
                        model.enterprise = params.customer;
                    },
                    "business-updated": function(bundleModel, model, obj){
                        $log.info("Inside business-update of IREP/LoanRequest");
                        model.loanAccount.customerId = obj.customer.id;
                        model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                        model.loanAccount.loanCentre.centreId = obj.customer.centreId;
                        model.loanAccount.loanCentre.loanId = model.loanAccount.id?model.loanAccount.id:null;
                        model.enterprise = obj.customer;

                    },
                    "load-deviation":function(bundleModel, model, params){
                        $log.info("Inside Deviation List");
                        model.deviations = {};
                        model.deviations.deviationParameter = [];
                        model.deviations.deviationParameter = params.deviations.deviationParameter;
                        model.deviations.scoreName = params.deviations.scoreName;

                        if (_.isArray(model.deviations.deviationParameter)){
                            _.forEach(model.deviations.deviationParameter, function(deviation){
                                if (_.hasIn(deviation, 'ChosenMitigants') && _.isArray(deviation.ChosenMitigants)){
                                    _.forEach(deviation.ChosenMitigants, function(mitigantChosen){
                                        for (var i=0; i< deviation.mitigants.length; i++){
                                            if (deviation.mitigants[i].mitigantName == mitigantChosen){
                                                deviation.mitigants[i].selected = true;
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    },
                    "cb-check-update": function(bundleModel, model, params){
                        $log.info("Inside cb-check-update of LoanRequest");
                        for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                            if (model.loanAccount.loanCustomerRelations[i].customerId == params.customerId) {
                                if(params.cbType == 'EQUIFAX')
                                    model.loanAccount.loanCustomerRelations[i].equifaxCompleted = true;                               
                            }
                        }
                    }
                },
                form: [],
                schema: function() {
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {
                    submit: function(model, formCtrl, form){
                        /* Loan SAVE */
                        if (!model.loanAccount.id){
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }
                        if (!policyByStage(model)){
                            PageHelper.showErrors({data:{error:tempGlobalerrMsg}})
                            PageHelper.hideLoader();
                            return false;
                        }
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                if (model.loanAccount.expectedInterestRate)
                                    model.loanAccount.expectedInterestRate = model.loanAccount.expectedInterestRate.toString();
                                if (model.loanAccount.tenureRequested)
                                    model.loanAccount.tenureRequested = model.loanAccount.tenureRequested.toString();
                                BundleManager.pushEvent('new-loan', model._bundlePageObj, {loanAccount: model.loanAccount});                                    
                                Utils.removeNulls(value, true);
                                
                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);

                            }, function (err) {
                                if((!err.data) && err.message)  
                                        err.data = {'error':err.message};
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);                                
                                PageHelper.hideLoader();
                            });

                    },
                    holdButton: function(model, formCtrl, form, $event){
                        $log.info("Inside save()");
                         if (!model.loanAccount.id){
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }
                        model.loanAccount.status = "HOLD";
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.hold()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan hold.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                if((!err.data) && err.message)  
                                        err.data = {'error':err.message};
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });

                    },
                    sendBack: function(model, formCtrl, form, $event){                        
                        PageHelper.showLoader();
                        model.loanProcess.sendBack()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                if((!err.data) && err.message)  
                                        err.data = {'error':err.message};
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });
                    },
                    proceed: function(model, formCtrl, form, $event){
                        var trancheTotalAmount=0;
                        if(model.loanAccount.currentStage && model.loanAccount.currentStage == 'Sanction' && model.loanAccount.disbursementSchedules && model.loanAccount.disbursementSchedules.length){
                            
                            for (var i = model.loanAccount.disbursementSchedules.length - 1; i >= 0; i--) {
                                model.loanAccount.disbursementSchedules[i].modeOfDisbursement = "CASH";
                                trancheTotalAmount+=(model.loanAccount.disbursementSchedules[i].disbursementAmount || 0);
                            }
                            if (trancheTotalAmount > model.loanAccount.loanAmount){
                                PageHelper.showProgress("loan-create","Total tranche amount is more than the Loan amount",5000);
                                return false;
                              }  
                            
                            if (trancheTotalAmount < model.loanAccount.loanAmount){
                                PageHelper.showProgress("loan-create","Total tranche amount should match with the Loan amount",5000);
                                return false;
                            }
                            
                        }
                        if(model.loanAccount.currentStage && model.loanAccount.currentStage == 'KYC'){
                            for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                                if (model.loanAccount.loanCustomerRelations[i].customerId) {
                                    if(model.loanAccount.loanCustomerRelations[i].relation!="Guarantor" && !model.loanAccount.loanCustomerRelations[i].equifaxCompleted){
                                        PageHelper.showProgress("loan-create","CB Check pending. Please do a CB check and then proceed",5000);
                                        return false;
                                    }                            
                                }
                            }
                        }
                        PageHelper.showProgress('enrolment', 'Updating Loan');
                        if (!policyByStage(model)){
                            PageHelper.showErrors({data:{error:tempGlobalerrMsg}});
                            PageHelper.hideLoader();
                            return false;
                        }
                        model.loanProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                if((!err.data) && err.message)  
                                        err.data = {'error':err.message};
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });
                    },
                    reject: function(model, formCtrl, form, $event){
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        PageHelper.showLoader();
                         model.loanProcess.reject()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });
                    },
                    nomineeAddress: function(model, formCtrl, form, $event){
                        PageHelper.showLoader();
                        if(model.loanProcess.applicantEnrolmentProcess){
                            model.loanAccount.nominees[0].nomineeDoorNo=  model.loanProcess.applicantEnrolmentProcess.customer.doorNo;
                            model.loanAccount.nominees[0].nomineeLocality= model.loanProcess.applicantEnrolmentProcess.customer.locality;
                            model.loanAccount.nominees[0].nomineeStreet= model.loanProcess.applicantEnrolmentProcess.customer.street;
                            model.loanAccount.nominees[0].nomineePincode= model.loanProcess.applicantEnrolmentProcess.customer.pincode;
                            model.loanAccount.nominees[0].nomineeDistrict= model.loanProcess.applicantEnrolmentProcess.customer.district;
                            model.loanAccount.nominees[0].nomineeState = model.loanProcess.applicantEnrolmentProcess.customer.state;
                        }else
                        {
                            PageHelper.hideLoader();
                        }
                        PageHelper.hideLoader();
                    }
                }
            };

        }
    }
});
