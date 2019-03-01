
define([],function(){
 
    return {
        pageUID: "shramsarathi.dashboard.loans.individual.screening.LoanRequest",
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

            var preLoanSaveOrProceed = function(model){
                var loanProcess = model.loanProcess;
               if(model.loanAccount.noOfGuarantersRequired > 0) {
                   if (_.hasIn(loanProcess, 'guarantorsEnrolmentProcesses') && _.isArray(loanProcess.guarantorsEnrolmentProcesses)){
                        if(model.loanAccount.noOfGuarantersRequired > loanProcess.guarantorsEnrolmentProcesses.length) {
                           PageHelper.showProgress("pre-save-validation", "You have to add atleast " + model.loanAccount.noOfGuarantersRequired + "guarantor before proceed",5000);
                           return false;
                        } else {
                            for (var i=0;i<loanProcess.guarantorsEnrolmentProcesses.length; i++){
                                var guarantor = loanProcess.guarantorsEnrolmentProcesses[i].customer;
                                if (!_.hasIn(guarantor, 'urnNo') || _.isNull(guarantor, 'urnNo')){
                                    PageHelper.showProgress("pre-save-validation", "All guarantors should complete the enrolment before proceed",5000);
                                    return false;
                                    break;
                                } else {
                                    if (_.hasIn(guarantor, 'cbCheckList') && _.isArray(guarantor.cbCheckList) && guarantor.cbCheckList.length != 0){
                                        for (var j=0;j<guarantor.cbCheckList.length; i++){
                                            if(guarantor.cbCheckList[j].cbCheckValid != true) {
                                                PageHelper.showProgress("pre-save-validation", "All guarantors should complete the CB Check before proceed",5000);
                                                return false;
                                                break;
                                            } else {
                                                return true; 
                                            }
                                        }
                                    } else {
                                        PageHelper.showProgress("pre-save-validation", "All guarantors should complete the CB Check before proceed",5000);
                                        return false;
                                        break;
                                    }
                                }
                            }
                        }
                    } else {
                        PageHelper.showProgress("pre-save-validation", "You have to add atleast " + model.loanAccount.noOfGuarantersRequired + "guarantor before proceed", 5000);
                        return false;
                    }
                }
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
                                "PostReview":{
                                    "orderNo":6
                                },
                                "PreliminaryInformation.loanAmountRequested": {
                                    "required": true
                                },
                                "PreliminaryInformation.tenureRequested": {
                                    "type": "select",
                                    "schema": {
                                             "enumCode": "tenure_requested"
                                        },
                                        "required":true,
                                        "title":"NO_OF_INSTALLMENTS",
                                        
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
                                "LoanRecommendation",
                                "CollateralDetails"          
                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "PreliminaryInformation.transactionType": {
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
                                "LoanMitigants.deviationParameter",
                                "CollateralDetails"              
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
                                "LoanMitigants.deviationParameter",
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
                                "NomineeDetails.nominees.nomineeButton",
                                "CollateralDetails"                  
                            ],
                            "overrides": {
                                // "PreliminaryInformation": {
                                //     "orderNo": 1,
                                //     "readonly": true
                                // },
                                // "LoanCustomerRelations": {
                                //     "orderNo": 2,
                                //     "readonly": true
                                // },
                                // "LoanMitigants": {
                                //     "orderNo": 4
                                // },
                                // "LoanDocuments": {
                                //     "orderNo": 5
                                // },
                                // "AdditionalLoanInformation": {
                                //     "orderNo": 6,
                                //     "readonly": true
                                // },
                                // "CollateralDetails": {
                                //     "orderNo": 7,
                                //     "readonly": true
                                // },
                                // "NomineeDetails": {
                                //     "orderNo": 8,
                                //     "readonly": true
                                // },                               
                                // "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                //    "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                // }     
                                    
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
                                "NomineeDetails.nominees.nomineeButton",
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
                                //"DeductionsFromLoan",
                                "LoanMitigants",
                                "LoanMitigants.deviationParameter",
                                "PreliminaryInformation.actualAmountRequired",
                                "PreliminaryInformation.fundsFromDifferentSources",
                                "NomineeDetails.nominees.nomineeButton", 
                                "AdditionalLoanInformation.productCategory",                  
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
                                },     
                                "LoanRecommendation":{
                                    "readonly": true
                                }, 
                            }
                        },
                        "Screening":{
                            "excludes": [
                                "ProposedUtilizationPlan",
                                //"DeductionsFromLoan",
                                 "LoanMitigants",
                                //"LoanMitigants.deviationParameter",
                                "PreliminaryInformation.actualAmountRequired",
                                "PreliminaryInformation.fundsFromDifferentSources",
                                "NomineeDetails",
                                "NomineeDetails.nominees",
                                "LoanSanction",
                                "LoanSanction.sanctionDate",
                                "LoanSanction.numberOfDisbursements",
                                "LoanSanction.disbursementSchedules",
                                "LoanSanction.disbursementSchedules.disbursementAmount",
                                "LoanSanction.disbursementSchedules.trancheNumber",
                                "LoanSanction.disbursementSchedules.tranchCondition",
                                "AdditionalLoanInformation",
                               // "NomineeDetails.nominees.nomineeButton",
                                "LoanRecommendation.securityEmiRequired",
                                "LoanMitigants.loanMitigantsByParameter",
                                "CollateralDetails",
                                "CBCheck",
                                "LoanCustomerRelations",


                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": false
                                },
                                "LoanRecommendation.udf8":{
                                    "readonly": false
                                },
                                "LoanRecommendation.udf3":{
                                    "readonly": false
                                },
                                "LoanCustomerRelations": {
                                    "orderNo": 2,
                                    "readonly": true
                                },
                                "DeductionsFromLoan": {
                                    "orderNo": 3,
                                },
                                "LoanMitigants": {
                                    "orderNo": 4
                                },
                                "LoanDocuments": {
                                    "orderNo": 5
                                },
                                "AdditionalLoanInformation": {
                                    "orderNo": 6,
                                    "readonly": false
                                },
                                "CollateralDetails": {
                                    "orderNo": 7,
                                    "readonly": false
                                },
                                "PreliminaryInformation.expectedPortfolioInsurancePremium": {
                                    "readonly": true
                                },
                                // "NomineeDetails": {
                                //     "orderNo": 8,
                                //     "readonly": false
                                // },
                                // "LoanSanction":{
                                //     "orderNo": 9
                                // },                          
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                }     
                                    
                            }
                        },
                        "ScreeningReview":{
                            "excludes": [
                                "ProposedUtilizationPlan",
                                //"DeductionsFromLoan",
                                //"LoanMitigants",
                                //"LoanMitigants.deviationParameter",
                                "PreliminaryInformation.actualAmountRequired",
                                "PreliminaryInformation.fundsFromDifferentSources",
                                "LoanSanction",
                                "LoanSanction.sanctionDate",
                                "LoanSanction.numberOfDisbursements",
                                "LoanSanction.disbursementSchedules",
                                "LoanSanction.disbursementSchedules.disbursementAmount",
                                "LoanSanction.disbursementSchedules.trancheNumber",
                                "LoanSanction.disbursementSchedules.tranchCondition",
                                "NomineeDetails",
                                "NomineeDetails.nominees",
                                "AdditionalLoanInformation",
                                "NomineeDetails.nominees.nomineeButton"   ,
                                //"LoanRecommendation.securityEmiRequired",
                                "LoanMitigants.loanMitigantsByParameter",
                                "CollateralDetails",
                                //"LoanRecommendation",

                            ],
                            "overrides": {
                                "PreliminaryInformation": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "DeductionsFromLoan":{
                                    "readonly": true,
                                    "orderNo":3
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
                                // "NomineeDetails": {
                                //     "orderNo": 8,
                                //     "readonly": true
                                // },
                                // "LoanSanction":{
                                //     "orderNo": 9
                                // },                          
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                }     
                                    
                            }
                        },
                        "ApplicationReview":
                        {
                            "excludes": [
                                "ProposedUtilizationPlan",
                                "DeductionsFromLoan",
                                // "LoanMitigants",
                                // "LoanMitigants.deviationParameter",
                                "PreliminaryInformation.actualAmountRequired",
                                "PreliminaryInformation.fundsFromDifferentSources",
                                "NomineeDetails.nominees.nomineeButton" ,
                                "LoanRecommendation.securityEmiRequired",
                                "LoanMitigants.loanMitigantsByParameter", 
                                "LoanSanction",
                                "LoanSanction.sanctionDate",
                                "LoanSanction.numberOfDisbursements",
                                "LoanSanction.disbursementSchedules",
                                "LoanSanction.disbursementSchedules.disbursementAmount",
                                "LoanSanction.disbursementSchedules.trancheNumber",
                                "LoanSanction.disbursementSchedules.tranchCondition",                       
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
                        },
                        "Application":{
                            "excludes": [
                                "LoanMitigants.deviationParameter",
                                "LoanSanction",
                                "LoanSanction.sanctionDate",
                                "LoanSanction.numberOfDisbursements",
                                "LoanSanction.disbursementSchedules",
                                "LoanSanction.disbursementSchedules.disbursementAmount",
                                "LoanSanction.disbursementSchedules.trancheNumber",
                                "LoanSanction.disbursementSchedules.tranchCondition",
                            ],
                            "overrides": {
                                "NomineeDetails.nominees.nomineeFirstName":{
                                    "required":true,
                                    "lovonly": false,
                                },
                                "NomineeDetails.nominees.nomineeGender":{
                                    "required":true
                                },
                                "NomineeDetails.nominees.nomineeDOB":{
                                    "required":true
                                },
                                "NomineeDetails.nominees.nomineeDoorNo":{
                                    "required":true
                                },
                                "NomineeDetails.nominees.nomineeRelationship":{
                                    "required":true
                                },
                                "NomineeDetails.nominees.nomineePincode":{
                                    "required":true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.customerId":
                                {
                                    "readonly":true
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
                                    "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                    "required":true
                                 }
                    
                                
                            }
                        },
                        "FieldAppraisal":{
                            "excludes":[
                                "LoanRecommendation.securityEmiRequired",
                                "LoanMitigants.deviationParameter",
                                "LoanSanction",
                                "LoanSanction.sanctionDate",
                                "LoanSanction.numberOfDisbursements",
                                "LoanSanction.disbursementSchedules",
                                "LoanSanction.disbursementSchedules.disbursementAmount",
                                "LoanSanction.disbursementSchedules.trancheNumber",
                                "LoanSanction.disbursementSchedules.tranchCondition",
                            ],
                            "overrides": {
                                "NomineeDetails.nominees.nomineeFirstName":{
                                    "required":true,
                                    "lovonly": false
                                },
                                "NomineeDetails.nominees.nomineeGender":{
                                    "required":true
                                },
                                "NomineeDetails.nominees.nomineeDOB":{
                                    "required":true
                                },
                                "NomineeDetails.nominees.nomineeDoorNo":{
                                    "required":true
                                },
                                "NomineeDetails.nominees.nomineeRelationship":{
                                    "required":true
                                },
                                "NomineeDetails.nominees.nomineePincode":{
                                    "required":true
                                },
                                "DeductionsFromLoan":{
                                    "readonly":true,
                                },
                                "PreliminaryInformation":{
                                    "readonly":true,
                                },
                                "LoanCustomerRelations":{
                                    "readonly":true,
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                   "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                   "required": true
                                },
                                "LoanMitigants":{
                                    "readonly":true,
                                }

                            }
                        },
                        "SanctionInput":{
                            "overrides":{
                                "LoanCustomerRelations": {
                                    "readonly": true
                                },
                            }
                        },
                        "ZonalRiskReview":{
                            "excludes":[
                                "LoanRecommendation.securityEmiRequired",
                                "LoanMitigants.loanMitigantsByParameter",
                            ],
                            "overrides":{
                                "AdditionalLoanInformation": {
                                    "readonly": true
                                },
                                "CollateralDetails":{
                                    "readonly":true
                                }
                            }
                        },
                        "FieldAppraisalReview":{
                            "excludes":[
                                "LoanMitigants.loanMitigantsByParameter",
                                "LoanSanction",
                                "LoanSanction.sanctionDate",
                                "LoanSanction.numberOfDisbursements",
                                "LoanSanction.disbursementSchedules",
                                "LoanSanction.disbursementSchedules.disbursementAmount",
                                "LoanSanction.disbursementSchedules.trancheNumber",
                                "LoanSanction.disbursementSchedules.tranchCondition",
                            ],
                            "overrides":{
                                "AdditionalLoanInformation": {
                                    "readonly": true
                                },
                                "CollateralDetails":{
                                    "readonly":true
                                }
                            }
                        },
                        "CentralRiskReview":{
                            "overrides":{
                                "CollateralDetails":{
                                    "readonly":true
                                }
                            }
                        },
                        "Rejected":{
                            "overrides":{
                                "CollateralDetails":{
                                    "readonly":true
                                },
                                "PreliminaryInformation":{
                                    "readonly":true
                                },
                                "LoanCustomerRelations":{
                                    "readonly":true
                                },
                                "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                                    "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                                 },
  
                                "DeductionsFromLoan":{
                                    "readonly":true
                                },
                                "LoanMitigants":{
                                    "readonly":true
                                },
                                "LoanDocuments":{
                                    "readonly":true
                                },
                                "AdditionalLoanInformation":{
                                    "readonly":true
                                },
                                "LoanSanction":{
                                    "readonly":true
                                },
                                "NomineeDetails":{
                                    "readonly":true
                                }
                            }
                        },
                        "loanView":{
                            "overrides":{
                                "AdditionalLoanInformation": {
                                    "readonly": true
                                },
                                "CollateralDetails":{
                                    "readonly":true
                                }
                            }
                        },
                        "Dedupe":{
                            "excludes": [
                                "LoanRecommendation.securityEmiRequired",
                                "LoanMitigants.loanMitigantsByParameter",  
                                "CollateralDetails"              
                            ],
                        }
                    }
 
                }
            }
            var computeEstimatedEMI = function(model){
                var fee = 0;
                if(model.loanAccount.commercialCibilCharge)
                    if(!_.isNaN(model.loanAccount.commercialCibilCharge))
                        fee+=model.loanAccount.commercialCibilCharge;
                $log.info(model.loanAccount.commercialCibilCharge);
   
                // Get the user's input from the form. Assume it is all valid.
                // Convert interest from a percentage to a decimal, and convert from
                // an annual rate to a monthly rate. Convert payment period in years
                // to the number of monthly payments.
   
                if(model.loanAccount.loanAmountRequested == '' || model.loanAccount.expectedInterestRate == '' || model.loanAccount.frequencyRequested == '' || model.loanAccount.tenureRequested == '')
                    return;
   
                var principal = model.loanAccount.loanAmountRequested;
                var interest = model.loanAccount.expectedInterestRate / 100 / 12;
                var payments;
                if (model.loanAccount.frequencyRequested == 'Yearly')
                    payments = model.loanAccount.tenureRequested * 12;
                else if (model.loanAccount.frequencyRequested == 'Monthly')
                    payments = model.loanAccount.tenureRequested;
   
                // Now compute the monthly payment figure, using esoteric math.
                var x = Math.pow(1 + interest, payments);
                var monthly = (principal*x*interest)/(x-1);
   
                // Check that the result is a finite number. If so, display the results.
                if (!isNaN(monthly) &&
                    (monthly != Number.POSITIVE_INFINITY) &&
                    (monthly != Number.NEGATIVE_INFINITY)) {
                        //model.loanAccount.expectedEmi=10;
                    model.loanAccount.expectedEmi = round(monthly);
                   // console.log(model.loanAccount.expectedEmi);
                    //document.loandata.total.value = round(monthly * payments);
                    //document.loandata.totalinterest.value = round((monthly * payments) - principal);
                }
                // Otherwise, the user's input was probably invalid, so don't
                // display anything.
                else {
                    model.loanAccount.expectedEmi  = "";
                    //document.loandata.total.value = "";
                    //document.loandata.totalinterest.value = "";
                }
   
            };
            function round(x) {
                return Math.ceil(x);
              }
            var computeEMI = function(model){
 
                // Get the user's input from the form. Assume it is all valid.
                // Convert interest from a percentage to a decimal, and convert from
                // an annual rate to a monthly rate. Convert payment period in years
                // to the number of monthly payments.
   
                if(model.loanAccount.loanAmount == '' || model.loanAccount.interestRate == '' || model.loanAccount.frequencyRequested == '' || model.loanAccount.tenure == '')
                    return;
   
                var principal = model.loanAccount.loanAmount;
                var interest = model.loanAccount.interestRate / 100 / 12;
                var payments;
                if (model.loanAccount.frequencyRequested == 'Yearly')
                    payments = model.loanAccount.tenure * 12;
                else if (model.loanAccount.frequencyRequested == 'Monthly')
                    payments = model.loanAccount.tenure;
   
                // Now compute the monthly payment figure, using esoteric math.
                var x = Math.pow(1 + interest, payments);
                var monthly = (principal*x*interest)/(x-1);
   
                // Check that the result is a finite number. If so, display the results.
                if (!isNaN(monthly) &&
                    (monthly != Number.POSITIVE_INFINITY) &&
                    (monthly != Number.NEGATIVE_INFINITY)) {
   
                    model.loanAccount.estimatedEmi = round(monthly);
                    //document.loandata.total.value = round(monthly * payments);
                    //document.loandata.totalinterest.value = round((monthly * payments) - principal);
                }
                // Otherwise, the user's input was probably invalid, so don't
                // display anything.
                else {
                    model.loanAccount.estimatedEmi  = "";
                    //document.loandata.total.value = "";
                    //document.loandata.totalinterest.value = "";
                }
   
            };
            var populateDisbursementSchedule=function (value,form,model){
                PageHelper.showProgress("loan-create","Verify Disbursement Schedules",5000);
                model.loanAccount.disbursementSchedules=[];
                for(var i=0;i<value;i++){
                    model.loanAccount.disbursementSchedules.push({
                        trancheNumber:""+(i+1),
                        disbursementAmount:0
                    });
                }
                if (value ==1){
                    model.loanAccount.disbursementSchedules[0].disbursementAmount = model.loanAccount.loanAmount;
                }
        
            }
             var overridesFields = function (bundlePageObj) {
                return {
                    // "PostReview.reject.rejectReason":{
                    //     "enumCode":"loan_rejection_reason"
                    // },
                    // "revertReject.rejectReason":{
                    //     "enumCode":"loan_rejection_reason"
                    // },
                        "PreliminaryInformation.linkedAccountNumber": {
                            "resolver": "LinkedAccountNumberLOVConfiguration",
                            "condition": "model.loanAccount.transactionType.toLowerCase() != 'renewal' && model.loanAccount.transactionType != 'New Loan'",
                        },
                        // "PreliminaryInformation.transactionType": {
                        //     "title": "TRANSACTION_TYPE",
                        // },
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
                            type: "number",
                            title: "EXPECTED_INTEREST_RATE",
                            onChange:function(value,form,model){
                                computeEstimatedEMI(model);
                            }
                            //"type": "select",
                            //"enumCode": "customerinfo_expect_interestra"
                        },
                      
                        "PreliminaryInformation.emiPaymentDateRequested": {
                            "enumCode": "customerinfo_emirequest_date"
                        },
                        "PreliminaryInformation.collectionPaymentType": {
                            "enumCode": "customerinfo_colctn_Pymt_type"
                        },
                        // "PreliminaryInformation.tenureRequested": {
                        //     "title":"NO_OF_INSTALLMENTS",
                        //     "required": true
                        // },
                        //over ride for ticket
                        "LoanSanction.numberOfDisbursements": {
                           // key:"loanAccount.numberOfDisbursements",
                            title:"NUM_OF_DISBURSEMENTS",
                            onChange:function(value,form,model){
                                populateDisbursementSchedule(value,form,model);
                            }
                        },
                        "LoanSanction.disbursementSchedules.tranchCondition": {
                            type: "lov",
                            autolov: true,
                            title: "TRANCHE_CONDITION",
                            bindMap: {
                            },
                            searchHelper: formHelper,//Verify Disbursement Schedules
                            search: function (inputModel, form, model, context) {

                                var trancheConditions = formHelper.enum('tranche_conditions').data;
                                var out = [];
                                for (var i = 0; i < trancheConditions.length; i++) {
                                    var t = trancheConditions[i];
                                    var min = _.hasIn(t, "field1") ? parseInt(t.field1) - 1 : 0;
                                    var max = _.hasIn(t, "field2") ? parseInt(t.field2) - 1 : 100;

                                    if (context.arrayIndex >= min && context.arrayIndex <= max) {
                                        out.push({
                                            name: trancheConditions[i].name,
                                            value: trancheConditions[i].value
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
                            onSelect: function (valueObj, model, context) {
                                model.loanAccount.disbursementSchedules[context.arrayIndex].tranchCondition = valueObj.value;
                            },
                            getListDisplayItem: function (item, index) {
                                return [
                                    item.name
                                ];
                            }
                        },
                        "LoanRecommendation":{
                            "title": "LOAN_RECOMMENDATION",
                            "condition": "model.currentStage=='ScreeningReview' || model.currentStage == 'Dedupe' || model.currentStage=='ApplicationReview'||model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='FieldAppraisal'||model.currentStage=='Application' || model.currentStage=='Sanction'"
                        },
                        "LoanRecommendation.loanAmount":{
                            title: "LOAN_AMOUNT",
                            "orderNo":10,
                            onChange:function(value,form,model){
                                computeEMI(model);
                            }
                        },
                        "LoanRecommendation.tenure":{
                            title:"DURATION_IN_MONTHS",
                            "orderNo":20,
                            onChange:function(value,form,model){
                                computeEMI(model);
                            },
                            "type":"select",
                            "enumCode":"duration"
                        },
                        "LoanRecommendation.interestRate":{
                            title:"INTEREST_RATE",
                            "orderNo":30,
                            onChange:function(value,form,model){
                                computeEMI(model);
                            }
                        },
                        "LoanRecommendation.processingFeePercentage":{
                            "title":"PROCESSING_FEES_IN_PERCENTAGE",
                            "orderNo":50,
                        },
                        "LoanRecommendation.securityEmiRequired":{
                            "title":"SECURITY_EMI_REQUIRED",
                            "orderNo":80,
                            "condition": "model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview'||model.currentStage == 'Rejected'||model.currentStage == 'loanView' || model.currentStage=='Sanction' || model.currentStage=='ScreeningReview'",
                        },
                        "LoanRecommendation.commercialCibilCharge":{
                            "title":"COMMERCIAL_CIBIL_CHARGE",
                            "orderNo":70,
                        },

                        "AdditionalLoanInformation":{
                            "title":"ADDITIONAL_LOAN_INFORMATION",
                           // "condition": "model.currentStage=='Application' || model.currentStage=='FieldAppraisal' || model.currentStage == 'SanctionInput'||model.currentStage == 'ZonalRiskReview'",
                        },
                        // "AdditionalLoanInformation":{
                        //     "title":"ADDITIONAL_LOAN_INFORMATION",
                        //     //condition: "model.currentStage !=  'Application'",
                        //     "condition": "model.currentStage =='Application' || model.currentStage=='FieldAppraisal' || model.currentStage == 'SanctionInput' ||model.currentStage == 'ZonalRiskReview' || model.currentStage=='ApplicationReview' || model.currentStage=='FieldAppraisalReview' ||model.currentStage=='Sanction' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview' ||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
                        // },
                        "AdditionalLoanInformation.productCategory":{
                            key: "loanAccount.productCategory",
                            title:"PRODUCT_TYPE",
                            readonly:true,
                            condition:"model.currentStage!='Application' && model.currentStage!='FieldAppraisal'"
                        },
                        "AdditionalLoanInformation.productCategory":{
                            key: "loanAccount.productCategory",
                            title:"PRODUCT_TYPE",
                            required:true,
                            type:"select",
                            enumCode:"loan_product_category",
                            condition:"model.currentStage=='Application' || model.currentStage=='FieldAppraisal'"
                        },
                        "PreliminaryInformation.tenureRequested": {
                            "required": true,
                            "title":"NO_OF_INSTALLMENTS"
                        },
                        "PreliminaryInformation.emiRequested": {
                            "required": true,
                            "title":"REPAYMENT_CAPACITY"
                        },
                        "PreliminaryInformation.loanPurpose2":{
                            "title":"LOAN_SUB_PURPOSE_1"
                        },
                        "PreliminaryInformation.collectionPaymentType": {
                            "required": true
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
                            "orderNo":10,
                            "resolver": "NomineeFirstNameLOVConfiguration"
                        },
                        "NomineeDetails.nominees.nomineeGender": {
                            "orderNo": 20
                        },
                        "NomineeDetails.nominees.nomineeDOB":{
                            "orderNo": 30
                        },
                        "NomineeDetails.nominees.nomineeRelationship": {
                            "orderNo": 100
                        },
                        "NomineeDetails.nominees.nomineePincode": {
                            "resolver": "NomineePincodeLOVConfiguration",
                            "orderNo":70
                        },
                        "NomineeDetails.nominees.nomineeDoorNo": {
                            "orderNo": 40
                        },
                        "NomineeDetails.nominees.nomineeStreet":{
                            "orderNo": 60
                        },
                        "NomineeDetails.nominees.nomineeLocality": {
                            "orderNo":50
                        },
                        "NomineeDetails.nominees.nomineeDistrict":{
                            "orderNo":80
                        },
                        "NomineeDetails.nominees.nomineeState":{
                            "orderNo":90
                        },
                        "CollateralDetails":{
                            "condition": "model.loanAccount.loanPurpose1=='Asset Purchase'"
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
                            "title":"HYPOTHECATED_TO_MAITREYA",
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
                            //"required": true,
                            "orderNo":130
                        },
                        "DeductionsFromLoan.estimatedEmi":{
                            "title": "EXPECTED_SECURITY_EMI",
                        },
                        "DeductionsFromLoan":{
                            "orderNo" : 30
                        },
                        "LoanMitigants":{
                            "orderNo" : 40
                        },
                        "LoanDocuments":{
                            "orderNo": 50
                        }
 
                    }
                }
 
            var getIncludes = function (model) {
 
                return [
                    "PreliminaryInformation",
                    "PreliminaryInformation.transactionType",
                    "PreliminaryInformation.transactionType2",
                    "PreliminaryInformation.groupID",
                    "PreliminaryInformation.groupName",
                    "PreliminaryInformation.linkedAccountNumber",
                    "PreliminaryInformation.linkedAccountNumber1",
                    "PreliminaryInformation.baseLoanAccount",
                    "PreliminaryInformation.npa",
                    "PreliminaryInformation.loan",
                    "PreliminaryInformation.loanPurpose1",
                    "PreliminaryInformation.loanPurpose2",
                    "PreliminaryInformation.loanPurpose3",
                    "PreliminaryInformation.referenceFrom",
                    "PreliminaryInformation.referenceCheck",
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
                    "PreliminaryInformation.BusinessSaveWarning",
                    "PreliminaryInformation.MedicalTestWarning",
                    //"PreliminaryInformation.actualAmountRequired",
                    //"PreliminaryInformation.fundsFromDifferentSources",
                   
 
                    "LoanCustomerRelations",
                    "LoanCustomerRelations.loanCustomerRelations",
                    "LoanCustomerRelations.loanCustomerRelations.customerId",
                    "LoanCustomerRelations.loanCustomerRelations.urn",
                    "LoanCustomerRelations.loanCustomerRelations.name",
                    "LoanCustomerRelations.loanCustomerRelations.relation",
                    "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant",
 
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
                    "LoanMitigants.loanMitigantsByParameter",
                    "LoanMitigants.loanMitigantsByParameter.Mitigants",


                    "LoanDocuments",
                    "LoanDocuments.loanDocuments",
                    "LoanDocuments.loanDocuments.document",
                    "LoanDocuments.loanDocuments.documentId",
 
                    "LoanRecommendation",
                    "LoanRecommendation.loanAmount",
                    "LoanRecommendation.tenure",
                    // "LoanRecommendation.interestRate",
                    "LoanRecommendation.estimatedEmi",
                    "LoanRecommendation.modeOfDisbursement",
                    "LoanRecommendation.remarksOfInFavourLoan",
                    "LoanRecommendation.potentialRisks",
                    "LoanRecommendation.collectionDate",
                    "LoanRecommendation.disbursementDate",
                    "LoanRecommendation.gracePeriod",
                    "LoanRecommendation.date",
                    // "LoanRecommendation.processingFeePercentage",
                    // "LoanRecommendation.estimatedEmi1",
                    // "LoanRecommendation.securityEmiRequired",
                    // "LoanRecommendation.commercialCibilCharge",
                    // "LoanRecommendation.udf8",
                    // "LoanRecommendation.udf3",
 
                     "LoanSanction",
                     "LoanSanction.sanctionDate",
                     "LoanSanction.numberOfDisbursements",
                     "LoanSanction.disbursementSchedules",
                     "LoanSanction.disbursementSchedules.disbursementAmount",
                     "LoanSanction.disbursementSchedules.trancheNumber",
                     "LoanSanction.disbursementSchedules.tranchCondition",
                    // loanAccount.disbursementSchedules[].disbursementAmount,

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
                    "PostReview.action1",
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
                    "CBCheck",
                    "CBCheck.CBCheckIgnore",
                    "revertReject",
                    "revertReject.remarks",
                    "revertReject.rejectReason",
                    "revertReject.targetStage",
                    "revertReject.sendBackButton"

 
                    // "ProposedUtilizationPlan",
                    // "ProposedUtilizationPlan.loanUtilisationDetail",
                    // "ProposedUtilizationPlan.loanUtilisationDetail.utilisationType",
                    // "ProposedUtilizationPlan.loanUtilisationDetail.fundAllocationPercentage",
                    // "ProposedUtilizationPlan.loanUtilisationDetail.consumptionDetails"
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
                    model.currentStage = model.loanAccount.currentStage;

                    console.log("jduehuohohoiewhwofhuoceheuhujfyoejcoueuoeijveieip",model.currentStage);

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
                     if(!_.hasIn(model.loanAccount,'transactionType')|| _.isNull(model.loanAccount.transactionType)){
                        model.loanAccount.transactionType = "New Loan";
                    }
                    if(model.loanAccount.transactionType == 'New Loan') {
                        model.loanAccount.linkedAccountNumber = null;
                    }
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
                    if (_.hasIn(model, 'loanAccount.id') && _.isNumber(model.loanAccount.id)){
                        $log.info('Printing Loan Account');
                        IndividualLoan.loanRemarksSummary({id: model.loanAccount.id})
                        .$promise
                        .then(function (resp){
                            model.loanSummary = resp;
                            if(model.loanSummary && model.loanSummary.length)
                            {
                                for(i=0;i<model.loanSummary.length;i++)
                                {
                                    if(model.loanSummary[i].postStage=="Rejected" &&
                                        model.loanSummary[i].preStage != "Rejected")
                                    {
                                        if(model.currentStage=='Rejected')
                                        {
                                            model.review={};
                                            model.review.preStage = model.loanSummary[i].preStage;
                                            model.review.targetStage = model.loanSummary[i].preStage;
                                        }
                                    }
                                }
                            }
                        },function (errResp){
        
                        });
                    }
 
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
                                    "PreliminaryInformation":{
                                        "items": {
                                            "loanPurpose3": {
                                                "key":"loanAccount.loanPurpose2",
                                              "title":"LOAN_SUB_PURPOSE_2",
                                              "type":"text",
                                              "orderNo":40
                                            },
                                            "referenceFrom": {
                                                "key":"loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf9",
                                              "title":"REFERENCE_FROM",
                                              "type":"text",
                                              "required":false,
                                              "readonly":false
                                            },
                                            "referenceCheck": {
                                              "key":"loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf8",
                                              "title":"REFERNECE_CHECK",
                                              "type":"radios",
                                              "titleMap":{"good":"Good","bad":"Bad"},
                                              "required":false,
                                              "readonly":false
                                            },
                                            "transactionType": {
                                                key: "loanAccount.transactionType",
                                                title: "TRANSACTION_TYPE",
                                                type: "select",
                                                required: true,
                                                "titleMap": {
                                                    "New Loan": "New Loan",
                                                    "Renewal": "Renewal",
                                                    "Loan Restructure": "Loan Restructure",
                                                    "Internal Foreclosure": "Internal Foreclosure"
                                                },
                                                "orderNo": 1,
                                                condition: "model.loanAccount.transactionType.toLowerCase() != 'renewal'",
                                                onChange:function(value,form,model){
                                                    if(_.hasIn(model, 'loanAccount') && model.loanAccount.transactionType == 'New Loan') {
                                                        model.loanAccount.linkedAccountNumber = null;
                                                    }
                                                }
                                            },
                                            // "expectedEmi": {
                                            //     "key": "loanAccount.expectedEmi",
                                            //     "title": "INSTALLMENT_AMOUNT",
                                            //     "orderNo": 91,
                                            //     type: "amount",
                                            //     "required":true
                                            // },
                                            "linkedAccountNumber1":{
                                                key:"loanAccount.linkedAccountNumber",
                                                title:"LINKED_ACCOUNT_NUMBER",
                                                readonly:true,
                                                required: false,
                                                "orderNo":11,
                                                condition: "model.loanAccount.transactionType.toLowerCase() == 'renewal'"
                                            },
                                            "baseLoanAccount":{
                                                key: "loanAccount.baseLoanAccount",
                                                title: "BASE_LOAN_ACCOUNT",
                                                readonly:true,
                                                required: false,
                                                "orderNo":12,
                                                condition: "model.loanAccount.transactionType.toLowerCase() == 'renewal'"
                        
                                             },
                                             "transactionType2":{
                                                key: "loanAccount.transactionType",
                                                title: "TRANSACTION_TYPE",
                                                readonly:true,
                                                required: false,
                                                "orderNo":13,
                                                condition: "model.loanAccount.transactionType.toLowerCase() == 'renewal'"
                                             },
                                            //  "BusinessSaveWarning":{
                                            //     "type": "section",
                                            //     "htmlClass": "alert alert-warning",
                                            //     "condition": "!model.loanAccount.customerId",
                                            //     "html":"<h4><i class='icon fa fa-warning'></i>Business not yet enrolled.</h4> Kindly save the business details before proceed."
                                            // },
                                            "MedicalTestWarning":{
                                                "type": "section",
                                                "htmlClass": "alert alert-warning",
                                                "condition": "model.applicant.age1 >= 41 && model.applicant.age1 <= 60 && model.loanAccount.loanAmountRequested >= 2000001 && model.loanAccount.loanAmountRequested <= 3000000 || model.applicant.age1 >= 61 && model.applicant.age1 <= 65 && model.loanAccount.loanAmountRequested < 3000000",
                                                "html":"<h4><i class='icon fa fa-warning'></i>Medical Test is Mandatory</h4>"
                                            },
                                            "groupName": {
                                                "key": "loanAccount.groupName",
                                                "title": "GROUP_NAME",
                                                "type": "string",
                                                "orderNo": 41
                                            },
                                            "groupID": {
                                                "key": "loanAccount.jlgGroupId ",
                                                "title": "GROUP_ID",
                                                "type": "string",
                                                "orderNo": 40,
                                            }
                                          
                                        }
                                      
                                    },
                                    "LoanRecommendation":{
                                        "items":{
                                            "estimatedEmi":{
                                                "key": "loanAccount.estimatedEmi",
                                                "type": "amount",
                                                "orderNo":40,
                                                "title": "INSTALLMENT_AMOUNT",
                                                "readonly": false
                                            },
                                            // "estimatedEmi1":{
                                            //     "key": "loanAccount.estimatedEmi",
                                            //     "type": "amount",
                                            //     "orderNo":60,
                                            //     "title": "EXPECTED_SECURITY_EMI",
                                            //     "readonly": true
                                            // },
                                            "modeOfDisbursement":{
                                                "key":"loanAccount.disbursementSchedules.modeOfDisbursement",
                                                "title":"MODE_OF_DISBURSEMENT",
                                                "type":"select",
                                                "enumCode":"mode_of_disbursement"
                                            },
                                        "remarksOfInFavourLoan":{
                                            "key":"loanAccount.udf.userDefinedFieldValues.udf10",
                                            "title":"REMARK_OF_IN_FAVOUR_LOAN",
                                            "type":"text",
                                            "required":true
                                        },
                                        "potentialRisks":{
                                            "key":"loanAccount.udf.userDefinedFieldValues.udf11",
                                            "title":"POTENTIAL_RISK",
                                            "type":"select",
                                            "required":true,
                                            "titleMap":{"yes":"yes","no":"no"}
                                        },
                                        "collectionDate":{
                                            "key":"loanAccount.disbursementSchedules.firstRepaymentDate",
                                            "title":"COLLECTION_DATE",
                                            "type":"date",
                                            "required":true
                                        },
                                        "disbursementDate":{
                                            "key":"loanAccount.disbursementSchedules.actualDisbursementDate",
                                            "title":"DISBURSEMENT_DATE",
                                            "type":"date",
                                            "required":true
                                        },
                                        "gracePeriod":{
                                            "key":"loanAccount.disbursementSchedules.moratoriumPeriodInDays",
                                            "title":"GRACE_PERIOD",
                                            "type":"text",
                                            "required":true
                                        },
                                        "date":{
                                            "key":"loanAccount.udf.userDefinedFieldValues.udf12",
                                            "title":"DATE",
                                            "type":"date",
                                            "required":true
                                        }
                                    
                                        }
 
                                    },
                                    // "NomineeDetails": {
                                    //     "type": "box",
                                    //     "title": "NOMINEE_DETAILS",
                                    //     "orderNo": 300,
                                    //     "items": {
                                    //         "nominees": {
                                    //             "key": "loanAccount.nominees",
                                    //             "type": "array",
                                    //             "notitle": "true",
                                    //             "view": "fixed",
                                    //             "add": null,
                                    //             "remove": null,
                                    //             "items": {
                                    //                 "nomineeButton": {
                                    //                     "type": "button",
                                    //                     "title": "NOMINEE_ADDRESS_APPLICANT",
                                    //                     "onClick": "actions.nomineeAddress(model, formCtrl, form, $event)"
                                    //                 }
                                    //             }
                                    //         }
                                    //     }
                                    // },
                                    "LoanMitigants":{
                                        "items": {
                                            "loanMitigantsByParameter":{
                                                key: "loanMitigantsByParameter",
                                                type: "array",
                                                startEmpty: true,
                                                add:null,
                                                remove:null,
                                                "view":"fixed",
                                                "titleExpr": "model.loanMitigantsByParameter[arrayIndex].Parameter",
                                                items: [{
                                                    key: "loanMitigantsByParameter[].Mitigants",
                                                    "type":"section",
                                                    "html": "<div ng-bind-html='model.loanMitigantsByParameter[arrayIndex].Mitigants'></div>    "
                                                }]
                                            }
                                        }
                                    },
                                    "CBCheck": {
                                        "type": "box",
                                        "title": "CB Check",
                                        "condition": "model.currentStage =='Screening'",
                                        "orderNo": 550,
                                        "items": {
                                           'CBCheckIgnore' : {
                                            "key": "loanAccount.cbCheckIgnore",
                                            "type": "radios",
                                            "titleMap": {
                                                "YES": "YES",
                                                "NO": "NO"
                                            },
                                            "title": "CB Check Ignore",
                                           }
                                        }
                                    },

                                    "PostReview": {
                                        "type": "box",
                                        "title": "POST_REVIEW",
                                        "condition": "model.loanAccount.id  && model.currentStage!=='Rejected'",
                                        "orderNo": 600,
                                        "items": {
                                            "action": {
                                                "key": "review.action",
                                                "type": "radios",
                                                "condition": "model.currentStage !== 'Screening'",
                                                "titleMap": {
                                                    "REJECT": "REJECT",
                                                    "SEND_BACK": "SEND_BACK",
                                                    "PROCEED": "PROCEED",
                                                    "HOLD": "HOLD"
                                                }
                                            },
                                            "action1": {
                                                "key": "review.action",
                                                "type": "radios",
                                                "condition": "model.currentStage == 'Screening'",
                                                "titleMap": {
                                                    "REJECT": "REJECT",
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
                                                        //"type": "lov",
                                                       // "autolov": true,
                                                       "type":"select",
                                                        "required":true,
                                                        "title": "REJECT_REASON",
                                                        "enumCode":"loan_rejection_reason"
                                                        //"resolver": "IREPRejectReasonLOVConfiguration"
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
                                    },
                                    "revertReject": {
                                        "type": "box",
                                        "title": "REVERT_REJECT",
                                        "orderNo":600,
                                        "condition": "model.currentStage=='Rejected'",
                                        "items": {
                                            "remarks": {
                                                title: "REMARKS",
                                                key: "review.remarks",
                                                type: "textarea",
                                                required: true
                                            },
                                            "rejectReason": {
                                                title: "Reject Reason",
                                                key: "loanAccount.rejectReason",
                                                readonly: true,
                                                type: "textarea",
                                            },
                                            "targetStage": {
                                                key: "review.targetStage",
                                                title: "SEND_BACK_TO_STAGE",
                                                type: "lov",
                                                lovonly:true,
                                                autolov: true,
                                                required: true,
                                                searchHelper: formHelper,
                                                search: function(inputModel, form, model, context) {
                                                    var stage1 = model.review.preStage;
                                                    var targetstage = formHelper.enum('targetstage').data;
                                                    var out = [{'name': stage1, 'value': stage1}];
                                                    for (var i = 0; i < targetstage.length; i++) {
                                                        var t = targetstage[i];
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
                                                    model.review.targetStage = valueObj.name;
                                                },
                                                getListDisplayItem: function(item, index) {
                                                    return [
                                                        item.name
                                                    ];
                                                }

                                            },
                                            "sendBackButton": {
                                                "key": "review.sendBackButton",
                                                "type": "button",
                                                "title": "SEND_BACK",
                                                "onClick": "actions.sendBack(model, formCtrl, form, $event)"
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
                    "new-applicant": function(bundleModel, model, params){
                        $log.info("Inside new-business of LoanRequest");
                        model.loanAccount.customerId = params.customer.id;
                        model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                        model.loanAccount.loanCentre.centreId = params.customer.centreId;
                        model.customer = params.customer;
                    },
                    "business-updated": function(bundleModel, model, obj){
                        $log.info("Inside business-update of IREP/LoanRequest");
                        model.loanAccount.customerId = obj.customer.id;
                        model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                        model.loanAccount.loanCentre.centreId = obj.customer.centreId;
                        model.loanAccount.loanCentre.loanId = model.loanAccount.id?model.loanAccount.id:null;
                        model.customer = obj.customer;
 
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
                        model.loanProcess.refreshRelatedCustomers();
                        model.loanAccount.noOfGuarantersRequired = -1;
                        var completeLead = false;
                        if (!_.hasIn(model.loanAccount, "id")){
                            completeLead = true;
                        }
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                if (completeLead===true && _.hasIn(model, "lead.id")){
                                    var reqData = {
                                        lead: _.cloneDeep(model.lead),
                                        stage: "Completed"
                                    }
                                    reqData.lead.leadStatus = "Complete";
                                    LeadHelper.proceedData(reqData)
                                }
                                BundleManager.pushEvent('new-loan', model._bundlePageObj, {loanAccount: model.loanAccount});                                   
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);
 
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);                               
                                PageHelper.hideLoader();
                            });
 
                    },
                    holdButton: function(model, formCtrl, form, $event){
                        $log.info("Inside HoldButton()");
                        if (model.loanProcess.remarks==null || model.loanProcess.remarks ==""){
                            PageHelper.showProgress("update-loan", "Remarks is mandatory", 3000);
                            return false;
                        }
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
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                               
                                PageHelper.hideLoader();
                            });
 
                    },
                    sendBack: function(model, formCtrl, form, $event){  
                        if (model.currentStage == "Rejected") {
                            if (typeof model.review.remarks === "undefined") {
                                PageHelper.showProgress("update-loan", "Send to Stage / Remarks is mandatory", 3000);
                                return false;
                            }
                            if (model.review.remarks == "" || model.review.targetStage == null && model.review.targetStage == "") {
                                PageHelper.showProgress("update-loan", "Send to Stage / Remarks is mandatory", 3000);
                                return false;
                            }
                        } 
                        else if (model.loanProcess.remarks==null || model.review.remarks =="" || model.review.targetStage1==null || model.review.targetStage1==""){
                            PageHelper.showProgress("update-loan", "Send to Stage / Remarks is mandatory", 3000);
                            return false;
                        }                    
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
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                               
                                PageHelper.hideLoader();
                            });
                    },
                    proceed: function(model, formCtrl, form, $event){
                        if (model.loanProcess.remarks==null || model.loanProcess.remarks ==""){
                            PageHelper.showProgress("update-loan", "Remarks is mandatory", 3000);
                            return false;
                        }
                        if (!validateForm(formCtrl)){
                            return;
                        }
                        if (!preLoanSaveOrProceed(model)){
                            return;
                        }
                        // var trancheTotalAmount=0;
                        // if(model.loanAccount.disbursementSchedules && model.loanAccount.disbursementSchedules.length){
                            
                        //     for (var i = model.loanAccount.disbursementSchedules.length - 1; i >= 0; i--) {
                        //         model.loanAccount.disbursementSchedules[i].modeOfDisbursement = "CASH";
                        //         trancheTotalAmount+=(model.loanAccount.disbursementSchedules[i].disbursementAmount || 0);
                        //     }
                        //     if (trancheTotalAmount > model.loanAccount.loanAmount){
                        //         PageHelper.showProgress("loan-create","Total tranche amount is more than the Loan amount",5000);
                        //         return false;
                        //       }  
                            
                        //     if (trancheTotalAmount < model.loanAccount.loanAmount){
                        //         PageHelper.showProgress("loan-create","Total tranche amount should match with the Loan amount",5000);
                        //         return false;
                        //     }
                        
                        // }
                        PageHelper.showProgress('enrolment', 'Updating Loan');
                        model.loanProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                if(model.loanAccount.cbCheckIgnore == "YES") {
                                    irfNavigator.goBack();
                                } else {
                                    if(model.currentStage != 'Screening') {
                                        irfNavigator.goBack(); 
                                    }
                                }
                                irfNavigator.goBack();

                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                               
                                PageHelper.hideLoader();
                            });
                    },
                    reject: function(model, formCtrl, form, $event){
                        // if(PageHelper.isFormInvalid(formCtrl)) {
                        //     return false;
                        // }
                        if (model.loanProcess.remarks==null || model.review.remarks =="" || 
                            model.loanAccount.rejectReason==null ||model.loanAccount.rejectReason=="")
                        {
                            PageHelper.showProgress("update-loan", "Reject Reason / Remarks is mandatory", 3000);
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