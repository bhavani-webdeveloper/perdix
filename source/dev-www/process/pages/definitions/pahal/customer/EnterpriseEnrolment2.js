define(['perdix/domain/model/customer/EnrolmentProcess'], function(EnrolmentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];

    return {
        pageUID: "pahal.customer.EnterpriseEnrolment2",
        pageType: "Engine",
        dependencies: ["$log", "$q","Enrollment","IrfFormRequestProcessor", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "$filter", "$injector", "UIRepository"],

        $pageFn: function($log, $q, Enrollment,IrfFormRequestProcessor, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager, $filter, $injector, UIRepository) {

            // var getLocation = function() {
            //     var deferred = $q.defer();
            //     navigator.geolocation.getCurrentPosition((p) => {
            //         console.log(p);
            //         deferred.resolve(p);
            //     }, (err) => {
            //         console.log("Error");
            //         deferred.reject(err)
            //     })
            //     return deferred.promise;
            // }

            var calculateVehiclesFree = function(modelValue, form, model) {
                if( model.customer.vehiclesOwned >= model.customer.vehiclesFinanced){
                    model.customer.vehiclesFree = model.customer.vehiclesOwned - model.customer.vehiclesFinanced;
                }
                else {
                    PageHelper.showErrors({
                        data: {
                            error: "No of vehicle financed cannot be greater than no of vehicle owned."
                        }
                    });
                    return false;
                }
            }


            var getLocation = function() {
                return new Promise(function(resolve, reject) {
                    navigator.geolocation.getCurrentPosition(function(p) {
                        console.log(p);
                        resolve(p);
                    }, function(err) {
                        console.log("Error");
                        reject(err);
                    })
                });
            };

            var getIncludes = function (model) {
                return [
                    "EnterpriseInformation",
                    "EnterpriseInformation.firstName",
                    "EnterpriseInformation.customerId",
                    "EnterpriseInformation.customerBranchId",
                    "EnterpriseInformation.entityId",
                    "EnterpriseInformation.urnNo",
                    "EnterpriseInformation.centreId",
                    "EnterpriseInformation.firstName",
                    "EnterpriseInformation.referredBy",
                    "EnterpriseInformation.referredName",
                    "EnterpriseInformation.companyOperatingSince",
                    "EnterpriseInformation.companyEmailId",
                    "EnterpriseInformation.latitude",
                    "EnterpriseInformation.photoImageId",
                    "EnterpriseInformation.ownership",
                    "EnterpriseInformation.businessConstitution",
                    "EnterpriseInformation.businessHistory",
                    "EnterpriseInformation.noOfPartners",
                    "EnterpriseInformation.anyPartnerOfPresentBusiness",
                    "EnterpriseInformation.partnershipDissolvedDate",
                    "EnterpriseInformation.companyRegistered",
                    "EnterpriseInformation.isGSTAvailable",
                    "EnterpriseInformation.netBusinessIncome",
                    "EnterpriseInformation.enterpriseRegistrations",
                    "EnterpriseInformation.enterpriseRegistrations.registrationType",
                    "EnterpriseInformation.enterpriseRegistrations.registrationNumber",
                    "EnterpriseInformation.enterpriseRegistrations.registeredDate",
                    "EnterpriseInformation.enterpriseRegistrations.expiryDate",
                    "EnterpriseInformation.enterpriseRegistrations.documentId",
                    "EnterpriseInformation.businessType",
                    "EnterpriseInformation.businessActivity",
                    "EnterpriseInformation.businessSector",
                    "EnterpriseInformation.businessSubsector",
                    "EnterpriseInformation.itrAvailable",
               //     "EnterpriseInformation.HouseVerificationPhoto",
                    "EnterpriseInformation.enterpriseCustomerRelations",
                    "EnterpriseInformation.enterpriseCustomerRelations.relationshipType",
                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerId",
                    "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName",
                    "EnterpriseInformation.enterpriseCustomerRelations.experienceInBusiness",
                    "EnterpriseInformation.enterpriseCustomerRelations.businessInvolvement",
                    "EnterpriseInformation.enterpriseCustomerRelations.partnerOfAnyOtherCompany",
                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed",
                    "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate",
                    "ContactInformation",
                    "ContactInformation.mobilePhone",
                    "ContactInformation.landLineNo",
                    "ContactInformation.doorNo",
                    "ContactInformation.street",
                    "ContactInformation.postOffice",
                    "ContactInformation.pincode",
                    "ContactInformation.villageName",
                    "ContactInformation.district",
                    "ContactInformation.state",
                    "ContactInformation.distanceFromBranch",
                    "ContactInformation.businessInPresentAreaSince",
                    "ContactInformation.businessInCurrentAddressSince",
                    "Liabilities",
                    "Liabilities.liabilities",
                    // "Liabilities.liabilities.loanType",
                    // "Liabilities.liabilities.loanSourceCategory",
                    // "Liabilities.liabilities.loanSource",
                    // "Liabilities.liabilities.loanSource1",
                    "Liabilities.liabilities.loanAmountInPaisa",
                    "Liabilities.liabilities.installmentAmountInPaisa",
                    // "Liabilities.liabilities.outstandingAmountInPaisa",
                    "Liabilities.liabilities.startDate",
                    // "Liabilities.liabilities.maturityDate",
                    "Liabilities.liabilities.noOfInstalmentPaid",
                    "Liabilities.liabilities.frequencyOfInstallment",
                    "Liabilities.liabilities.udf1",
                    // "Liabilities.liabilities.liabilityLoanPurpose",
                    // "Liabilities.liabilities.interestOnly",
                    // "Liabilities.liabilities.interestRate",
                    // "Liabilities.liabilities.proofDocuments",
                    "Liabilities.liabilities.customerLiabilityRepayments",
                    "Liabilities.liabilities.customerLiabilityRepayments.emiNo",
                    "Liabilities.liabilities.customerLiabilityRepayments.emiAmount",
                    "Liabilities.liabilities.customerLiabilityRepayments.emiDueDate",
                    "Liabilities.liabilities.customerLiabilityRepayments.actualRepaymentDate",
                    "TrackDetails",
                    "TrackDetails.vehiclesOwned",
                    "TrackDetails.vehiclesFinanced",
                    "TrackDetails.vehiclesFree",
                    "IndividualReferences",
                    "IndividualReferences.verifications",
                    "IndividualReferences.verifications.referenceFirstName",
                    "IndividualReferences.verifications.mobileNo",
                    "IndividualReferences.verifications.knownSince",
                    "IndividualReferences.verifications.relationship",
                    "TangibleNetWorth",
                    "TangibleNetWorth.enterpriseNetworth",
                    "TangibleNetWorth.enterpriseNetworth.tangibleNetworth",
                    "TangibleNetWorth.enterpriseNetworth.financialYear",
                    "enterpriseDocuments",
                    "enterpriseDocuments.enterpriseDocuments",
                    "enterpriseDocuments.enterpriseDocuments.docType",
                    "enterpriseDocuments.enterpriseDocuments.fileId",
                    "BankAccounts",
                    "BankAccounts.customerBankAccounts",
                    "BankAccounts.customerBankAccounts.ifscCode",
                    "BankAccounts.customerBankAccounts.customerBankName",
                    "BankAccounts.customerBankAccounts.customerBankBranchName",
                    "BankAccounts.customerBankAccounts.customerNameAsInBank",
                    "BankAccounts.customerBankAccounts.accountNumber",
                    "BankAccounts.customerBankAccounts.confirmedAccountNumber",
                    "BankAccounts.customerBankAccounts.accountType",
                    "BankAccounts.customerBankAccounts.bankingSince",
                    "BankAccounts.customerBankAccounts.netBankingAvailable",
                    "BankAccounts.customerBankAccounts.sanctionedAmount",
                    "BankAccounts.customerBankAccounts.bankStatements",
                    "BankAccounts.customerBankAccounts.bankStatements.startMonth",
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.totalWithdrawals",
                    "BankAccounts.customerBankAccounts.bankStatements.balanceAsOn15th",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto",
                    "BankAccounts.customerBankAccounts.isDisbersementAccount",
                    "CommercialCBCheck",
                    "CommercialCBCheck.enterpriseBureauDetails",
                    "CommercialCBCheck.enterpriseBureauDetails.bureau",
                    "CommercialCBCheck.enterpriseBureauDetails.fileId",
                    "CommercialCBCheck.enterpriseBureauDetails.doubtful",
                    "CommercialCBCheck.enterpriseBureauDetails.loss",
                    "CommercialCBCheck.enterpriseBureauDetails.specialMentionAccount",
                    "CommercialCBCheck.enterpriseRegistrations.standard",
                    "CommercialCBCheck.enterpriseRegistrations.subStandard",
                    "EnterpriseAssets",
                    "EnterpriseAssets.enterpriseAssets",
                    "EnterpriseAssets.enterpriseAssets.udf5",
                    "EnterpriseAssets.enterpriseAssets.endUse",
                    "EnterpriseAssets.enterpriseAssets.natureOfUse",
                    "EnterpriseAssets.enterpriseAssets.udf3",
                    "EnterpriseAssets.enterpriseAssets.udf4",
                    "EnterpriseAssets.enterpriseAssets.manufacturer",
                    "EnterpriseAssets.enterpriseAssets.vehicleMakeModel",
                    "EnterpriseAssets.enterpriseAssets.udf1",
                    "EnterpriseAssets.enterpriseAssets.udf2",
                    "EnterpriseAssets.enterpriseAssets.valueOfAsset",
                    "EnterpriseAssets.enterpriseAssets.yearOfManufacture"
                ];
            }

            var configFile = function() {
                return {
                        "loanProcess.loanAccount.currentStage": {
                            "Screening": {
                                "overrides": {
                                    
                                },
                                "excludes": [
                                    "IndividualReferences"                                    
                                ]
                            },
                            "ScreeningReview": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "CommercialCBCheck.enterpriseBureauDetails":{
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "TrackDetails":{
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TangibleNetWorth": {
                                      "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    }
                                },
                                "excludes": [
                                    "IndividualReferences"                                    
                                ]
                            },
                            "GoNoGoApproval1": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "CommercialCBCheck.enterpriseBureauDetails":{
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "TrackDetails":{
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TangibleNetWorth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                "IndividualReferences"                                
                                ]
                            },
                            "GoNoGoApproval2": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "CommercialCBCheck.enterpriseBureauDetails":{
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "TrackDetails":{
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TangibleNetWorth": {
                                      "readonly": true
                                    }
                                },
                                "excludes": [
                                "IndividualReferences"                                    
                                ]
                            },
                            "Application": {
                                "overrides": {
                                    
                                },
                                "excludes": [                                   
                                ]
                            },
                            "ApplicationReview": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "CommercialCBCheck.enterpriseBureauDetails":{
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "TrackDetails":{
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TangibleNetWorth": {
                                      "readonly": true
                                    },
                                    "IndividualReferences":{
                                        "readonly": true 
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    }
                                },
                                "excludes": [
                                                                        
                                ]
                            },
                            "CreditApproval1": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "CommercialCBCheck.enterpriseBureauDetails":{
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "TrackDetails":{
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TangibleNetWorth": {
                                      "readonly": true
                                    },
                                    "IndividualReferences":{
                                        "readonly": true 
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    }
                                },
                                "excludes": [
                                    
                                ]
                            },
                            "CreditApproval2": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "CommercialCBCheck.enterpriseBureauDetails":{
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "TrackDetails":{
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TangibleNetWorth": {
                                      "readonly": true
                                    },
                                    "IndividualReferences":{
                                        "readonly": true 
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    }
                                },
                                "excludes": [
                                    
                                ]
                            },
                            "DeviationApproval": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "CommercialCBCheck.enterpriseBureauDetails":{
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "TrackDetails":{
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "TangibleNetWorth": {
                                      "readonly": true
                                    },
                                    "IndividualReferences":{
                                        "readonly": true 
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    }
                                },
                                "excludes": [
                                    
                                ]
                            },
                            "REJECTED": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "TrackDetails":{
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "IndividualReferences":{
                                        "readonly": true 
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    }
                                }
                            }

                        },
                        "loanProcess.loanAccount.isReadOnly": {
                            "Yes": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseInformation.enterpriseType" : {
                                        "readonly": true
                                    },
                                    "CommercialCBCheck.enterpriseBureauDetails":{
                                        "readonly": true
                                    },
                                    "Liabilities": {
                                        "readonly": true
                                    },
                                    "TrackDetails":{
                                        "readonly": true
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    }
                                }

                            }
                        }
                    }
            }

            return {
                "type": "schema-form",
                "title": "ENTITY_ENROLLMENT",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                    var self = this;
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }

                    /* Setting data recieved from Bundle */
                    model.loanCustomerRelationType = "Customer";
                    model.currentStage = bundleModel.currentStage;
                    /* End of setting data recieved from Bundle */


                    /* Setting data for the form */
                    model.customer = model.enrolmentProcess.customer;
                    /* End of setting data for the form */
                    var p1 = UIRepository.getEnrolmentProcessUIRepository().$promise;
                    p1
                    .then(function(repo){
                        var formRequest = {
                            "overrides": {
                                "CommercialCBCheck": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'"
                                },
                                "Liabilities": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'"
                                },
                                "IndividualReferences":{
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise' || model.customer.enterprise.enterpriseType.toLowerCase() == 'sole proprietorship'"
                                },
                                "TrackDetails":{
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise' || model.customer.enterprise.enterpriseType.toLowerCase() == 'sole proprietorship'"
                                },
                                "TangibleNetWorth": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'"
                                },
                                "BankAccounts.customerBankAccounts.accountNumber": {
                                    "type": "password",
                                    "required": true
                                },
                                "BankAccounts.customerBankAccounts.bankStatements":{
                                    startEmpty: true
                                },
                                "BankAccounts.customerBankAccounts.confirmedAccountNumber": {
                                    "type": "string",
                                    "title": "CONFIRMED_ACCOUNT_NUMBER",
                                    "required": true
                                },
                                "ContactInformation.locality": {
                                    "readonly": true
                                },
                                "ContactInformation.villageName": {
                                    "readonly": true
                                },
                                "ContactInformation.district": {
                                    "readonly": true
                                },
                                "ContactInformation.state": {
                                    "readonly": true
                                },
                                "ContactInformation.pincode": {
                                     fieldType: "number",
                                     resolver: "PincodeLOVConfiguration"
                                },
                                "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                                    "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                },
                                "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                                    "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                },
                                "EnterpriseInformation.enterpriseCustomerRelations.relationshipType": {
                                    "required": true
                                },
                                "EnterpriseInformation": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'"
                                },
                                "ContactInformation": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'"
                                },
                                "EnterpriseInformation.enterpriseType": {
                                    "title": "ENTERPRISE_TYPE",
                                    "resolver": "SoleProprietorshipBusinessConfiguration"
                                },
                                "EnterpriseInformation.centreId" : {
                                    "readonly": true
                                },
                                "EnterpriseInformation.customerBranchId" :{
                                    "readonly": true
                                },
                                "BankAccounts": {
                                    "condition" : "model.customer.enterprise.enterpriseType == 'Enterprise'"
                                },
                                "BankAccounts.customerBankAccounts": {
                                    startEmpty: true
                                },
                                "Liabilities.liabilities": {
                                    startEmpty: true
                                },

                                "Liabilities.liabilities.frequencyOfInstallment": {
                                    "title": "REPAYMENT_FREQUENCY",
                                    "required": true
                                },
                                "Liabilities.liabilities.noOfInstalmentPaid": {
                                    "title": "TENURE",
                                    "required": true
                                },
                                "Liabilities.liabilities.startDate": {
                                    "title": "LOAN_START_DATE",
                                    "required": true
                                },
                                "TrackDetails.vehiclesFree": {
                                    "readonly": true
                                },
                                "IndividualReferences.verifications": {
                                    "view":"fixed",
                                    "titleExpr": "model.customer.verifications[arrayIndexes[0]].relationship",
                                    "add": null,
                                    "remove": null
                                },
                                "IndividualReferences.verifications.relationship": {
                                    "type": "select",
                                    "enumCode": "reference_type",
                                    "title": "REFERENCE_TYPE",
                                    "orderNo": 10,
                                    "required": true
                                },
                                "IndividualReferences.verifications.referenceFirstName": {
                                    "orderNo": 20,
                                    "title": "NAME",
                                    "required": true
                                },
                                "IndividualReferences.verifications.mobileNo": {
                                    "orderNo": 30,
                                    "title": "PHONE_NO",
                                    "required": true
                                },
                                "IndividualReferences.verifications.knownSince": {
                                    "orderNo": 40
                                },
                                "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName" :{
                                    "readonly": true
                                },
                                "EnterpriseAssets.enterpriseAssets": {
                                    "startEmpty": true
                                },
                                "EnterpriseAssets.enterpriseAssets.udf5": {
                                    "orderNo": 10
                                },
                                "EnterpriseAssets.enterpriseAssets.endUse" : {
                                    "orderNo": 20
                                },
                                "EnterpriseAssets.enterpriseAssets.natureOfUse": {
                                    "orderNo": 30
                                },
                                "EnterpriseAssets.enterpriseAssets.udf3": {
                                    "orderNo": 40
                                },
                                "EnterpriseAssets.enterpriseAssets.udf4": {
                                    "orderNo": 50
                                },
                                "EnterpriseAssets.enterpriseAssets.manufacturer": {
                                    "title": "MAKE",
                                    "orderNo": 60
                                },
                                "EnterpriseAssets.enterpriseAssets.vehicleMakeModel": {
                                    "orderNo": 70
                                },
                                "EnterpriseAssets.enterpriseAssets.yearOfManufacture": {
                                    "orderNo": 80
                                },
                                "EnterpriseAssets.enterpriseAssets.udf1": {
                                    "orderNo": 90
                                },
                                "EnterpriseAssets.enterpriseAssets.udf2": {
                                    "orderNo": 100
                                },
                                "EnterpriseAssets.enterpriseAssets.valueOfAsset": {
                                    "orderNo": 110
                                }
                            },
                            "includes": getIncludes(model),
                            "excludes": [
                                "EnterpriseInformation.referredBy",
                                "EnterpriseInformation.referredName",
                                "EnterpriseInformation.businessHistory",
                                "EnterpriseInformation.noOfPartners",
                                "EnterpriseInformation.anyPartnerOfPresentBusiness",
                                "EnterpriseInformation.partnershipDissolvedDate",
                                "EnterpriseInformation.businessType",
                                "EnterpriseInformation.businessActivity",
                                "EnterpriseInformation.businessSector",
                                "EnterpriseInformation.businessSubsector"
                            ],
                            "options": {
                                "repositoryAdditions": {
                                    "Liabilities": {
                                        "items": {
                                            "liabilities": {
                                                "items": {
                                                    "udf1": {
                                                        "title": "VEHICLE_MODEL",
                                                        "type": "string",
                                                        "key": "customer.liabilities[].udf1"
                                                    },
                                                    "customerLiabilityRepayments" : {
                                                        "key": "customer.liabilities[].customerLiabilityRepayments",
                                                        "type": "array",
                                                        "startEmpty": true,
                                                        "title": "REPAYMENT_DETAILS",
                                                        "items": {
                                                            "emiNo": {
                                                                "key": "customer.liabilities[].customerLiabilityRepayments[].emiNo",
                                                                "title": "EMI_NO",
                                                                "type": "number",
                                                                "required": true
                                                            },
                                                            "emiAmount": {
                                                              "key": "customer.liabilities[].customerLiabilityRepayments[].emiAmount",
                                                              "title": "EMI_AMOUNT",
                                                              "type": "number",
                                                              "required": true
                                                            },
                                                            "emiDueDate": {
                                                              "key": "customer.liabilities[].customerLiabilityRepayments[].emiDueDate",
                                                              "title": "EMI_DUE_DATE",
                                                              "type": "date",
                                                              "required": true
                                                            },
                                                            "actualRepaymentDate": {
                                                                "key": "customer.liabilities[].customerLiabilityRepayments[].actualRepaymentDate",
                                                                "title": "ACTUAL_REPAYMENT_DATE",
                                                                "type": "date",
                                                                "required": true
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "EnterpriseInformation": {
                                        "items": {
                                            "netBusinessIncome": {
                                                "type": "number",
                                                "title": "CASH_PROFIT",
                                                "key": "customer.enterprise.netBusinessIncome"
                                                // "condition": "model.customer.customerCategory.toLowerCase() == 'captive - retail'"
                                            }
                                        }

                                    },
                                    "CommercialCBCheck": {
                                        "type": "box",
                                        "title": "COMMERCIAL_CB_CHECK",
                                        "orderNo": 25,
                                        "items": {
                                        "enterpriseBureauDetails" : {
                                            "key": "customer.enterpriseBureauDetails",
                                            "title":"CB Check",
                                            "type": "array",
                                            "add": null,
                                            "remove": null,
                                            "view": "fixed",
                                            "items": {
                                                "bureau" : {
                                                    "key":"customer.enterpriseBureauDetails[].bureau",
                                                    "title":"BUREAU",
                                                    "type":"select",
                                                    "titleMap": {
                                                          "CIBIL": "CIBIL",
                                                          "Highmark": "Highmark"
                                                    },
                                                    "required": true   
                                                },
                                                "fileId": {
                                                      key:"customer.enterpriseBureauDetails[].fileId",
                                                      title:"FILE",
                                                      type:"file",
                                                      fileType:"application/pdf",
                                                      using: "scanner",
                                                      offline:true,
                                                      "required": true
                                                },
                                                "doubtful": {
                                                    key:"customer.enterpriseBureauDetails[].doubtful",
                                                    title:"DOUBTFUL_ACS",
                                                    type:"number"
                                                },
                                                "loss": {
                                                    key:"customer.enterpriseBureauDetails[].loss",
                                                    title:"LOSS_ACS",
                                                    type:"number"
                                                },
                                                "specialMentionAccount": {
                                                    key:"customer.enterpriseBureauDetails[].specialMentionAccount",
                                                    title:"SPECIAL_MENTION_ACS",
                                                    type:"number"
                                                },
                                                "standard": {
                                                    key:"customer.enterpriseBureauDetails[].standard",
                                                    title:"STANDARD_ACS",
                                                    type:"number"
                                                },
                                                "subStandard": {
                                                    key:"customer.enterpriseBureauDetails[].subStandard",
                                                    title:"SUB_STANDARD_ACS",
                                                    type:"number"
                                                }
                                                }
                                            }
                                        }
                                    },
                                    "EnterpriseAssets": {
                                        "items": {
                                            "enterpriseAssets": {
                                                "items": {
                                                    "udf1": {
                                                        "key": "customer.enterpriseAssets[].udf1",
                                                        "type": "select",
                                                        "title": "BODY_TYPE",
                                                        "enumCode": "business_asset_description"
                                                    },
                                                    "udf2": {
                                                        "key": "customer.enterpriseAssets[].udf2",
                                                        "type": "select",
                                                        "title": "SUB_TYPE",
                                                        "enumCode": "business_asset_sub_description",
                                                        "parentEnumCode": "business_asset_description",
                                                        "parentValueExpr": "model.customer.enterpriseAssets[arrayIndexes[0]].udf1"  
                                                    },
                                                    "udf3": {
                                                        "key": "customer.enterpriseAssets[].udf3",
                                                        "title": "SEGMENT",
                                                    },
                                                    "udf4": {
                                                          "key": "customer.enterpriseAssets[].udf4",
                                                          "title": "CATEGORY"  
                                                    },
                                                    "udf5": {
                                                        "key": "customer.enterpriseAssets[].udf5",
                                                        "type": "select",
                                                        "enumCode": "new_vehicle_category",
                                                        "title": "VEHICLE_TYPE"
                                                    },
                                                    "yearOfManufacture": {
                                                        "title": "MANUFACTURER_YEAR",
                                                        "key": "customer.enterpriseAssets[].yearOfManufacture"

                                                    }
                                                },               
                                            }
                                        }
                                    }
                                },
                                "additions": [
                                    {
                                        "type": "actionbox",
                                        "condition": "!model.customer.currentStage",
                                        "orderNo": 1200,
                                        "items": [
                                            {
                                                "type": "submit",
                                                "title": "SUBMIT"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "actionbox",
                                        "condition": "model.customer.currentStage && (model.loanProcess.loanAccount.currentStage=='Screening' || model.loanProcess.loanAccount.currentStage=='Application' || model.loanProcess.loanAccount.currentStage=='FieldInvestigation1' || model.loanProcess.loanAccount.currentStage=='FieldInvestigation2' || model.loanProcess.loanAccount.currentStage=='FieldInvestigation3' || model.loanProcess.loanAccount.currentStage=='TeleVerification' || model.loanProcess.loanAccount.currentStage=='CreditAppraisal')",
                                        "orderNo": 1200,
                                        "items": [
                                            {
                                                "type": "button",
                                                "title": "UPDATE",
                                                "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                            }
                                        ]
                                    },
                                    {
                                        "orderNo": 1,   
                                        "type": "box",
                                        "title": "BUSINESS_SELECTION",
                                        "items":[
                                            {
                                                "condition": "model.loanProcess.applicantEnrolmentProcess.customer.id == null || model.loanProcess.applicantEnrolmentProcess.customer.currentStage != 'Completed'",
                                                "type": "section",
                                                "htmlClass": "alert alert-warning",
                                                "html":"<h4><i class='icon fa fa-warning'></i>Applicant not yet enrolled.</h4> Kindly save Applicant details.",
                                                "orderNo": 10
                                            },
                                            "EnterpriseInformation.enterpriseType"
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
                        item.customer.centreId,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "applicant-updated": function(bundleModel, model, params){
                        $log.info("inside applicant-updated of EnterpriseEnrolment2");
                        /* Load an existing customer associated with applicant, if exists. Otherwise default details*/
                        model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                    },
                    "co-applicant-updated": function(bundleModel, model, params){
                        model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                    },
                    "guarantor-updated": function(bundleModel, model, params){
                        model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                    }
                },
                form: [

                ],
                schema: function() {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    preSave: function(model, form, formName) {
                        var deferred = $q.defer();
                        if (model.customer.firstName) {
                            deferred.resolve();
                        } else {
                            PageHelper.showProgress('enrollment', 'Customer Name is required', 3000);
                            deferred.reject();
                        }
                        return deferred.promise;
                    },
                    save: function(model, formCtrl, formName){

                    },
                    submit: function(model, form, formName){
                        
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();

                        model.enrolmentProcess.save()
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(){
                                model.loanProcess.refreshRelatedCustomers();
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                model.enrolmentProcess.proceed()
                                    .subscribe(function(enrolmentProcess) {
                                        PageHelper.showProgress('enrolment', 'Done.', 5000);
                                    }, function(err) {
                                        PageHelper.showErrors(err);
                                        PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                    })
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                    },
                    proceed: function(model, form){

                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer',5000);
                        PageHelper.showLoader();
                        model.enrolmentProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (enrolmentProcess) {
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                            }, function (err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    }

                }
            };
        }
    }
});
