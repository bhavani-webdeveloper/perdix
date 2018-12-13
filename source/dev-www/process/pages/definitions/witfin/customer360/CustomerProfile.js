define(['perdix/domain/model/customer/EnrolmentProcess'], function(EnrolmentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];

    return {
        pageUID: "witfin.customer360.CustomerProfile",
        pageType: "Engine",
        dependencies: ["$log", "$q","Enrollment","IrfFormRequestProcessor", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "$filter", "$injector", "UIRepository"],

        $pageFn: function($log, $q, Enrollment,IrfFormRequestProcessor, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager, $filter, $injector, UIRepository) {

            var getIncludes = function (model) {
                return [
                    "KYC",
                    "KYC.customerId",
                    "KYC.identityProof",
                    "KYC.identityProofImageId",
                    "KYC.identityProofNo",
                    "KYC.addressProof1",
                    "KYC.addressProof",
                    "KYC.addressProofImageId",
                    "KYC.addressProofNo",
                    "KYC.addressProofValidUptoDate",
                    "KYC.additionalKYCs",
                    "KYC.additionalKYCs.kyc1ProofType",
                    "KYC.additionalKYCs.kyc1ProofNumber",
                    "KYC.additionalKYCs.kyc1ImagePath",
                    "KYC.additionalKYCs.kyc1ValidUptoDate",
                    "IndividualInformation",
                    "IndividualInformation.existingLoan",
                    "IndividualInformation.customerBranchId",
                    "IndividualInformation.centreId",
                    "IndividualInformation.photoImageId",
                    "IndividualInformation.title",
                    "IndividualInformation.firstName",
                    "IndividualInformation.gender",
                    "IndividualInformation.dateOfBirth",
                    "IndividualInformation.age",
                    "IndividualInformation.language",
                    "IndividualInformation.fatherFirstName",
                    "IndividualInformation.motherName",
                    "IndividualInformation.maritalStatus",
                    "IndividualInformation.spouseFirstName",
                    "IndividualInformation.spouseDateOfBirth",
                    "IndividualInformation.weddingDate",
                    "ContactInformation",
                    "ContactInformation.mobilePhone",
                    "ContactInformation.landLineNo",
                    "ContactInformation.whatsAppMobileNoOption",
                    "ContactInformation.whatsAppMobileNo",
                    "ContactInformation.location",
                    "ContactInformation.email",
                    "ContactInformation.careOf",
                    "ContactInformation.doorNo",
                    "ContactInformation.street",
                    "ContactInformation.postOffice",
                    "ContactInformation.landmark",
                    "ContactInformation.pincode",
                    "ContactInformation.locality",
                    "ContactInformation.villageName",
                    "ContactInformation.district",
                    "ContactInformation.state",
                    "ContactInformation.mailSameAsResidence",
                    "ContactInformation",
                    "ContactInformation.mailingDoorNo",
                    "ContactInformation.mailingStreet",
                    "ContactInformation.mailingPostoffice",
                    "ContactInformation.mailingPincode",
                    "ContactInformation.mailingLocality",
                    "ContactInformation.mailingDistrict",
                    "ContactInformation.mailingState",
                    "FamilyDetails",
                    "FamilyDetails.familyMembers",
                    "FamilyDetails.familyMembers.relationShipself",
                    "FamilyDetails.familyMembers.relationShip",
                    "FamilyDetails.familyMembers.maritalStatus",
                    "FamilyDetails.familyMembers.familyMemberFirstName",
                    "FamilyDetails.familyMembers.dateOfBirth",
                    "FamilyDetails.familyMembers.primaryOccupation",
                    "FamilyDetails.familyMembers.educationStatus",
                    "FamilyDetails.familyMembers.anualEducationFee",
                    "FamilyDetails.familyMembers.salary",
                    "FamilyDetails.familyMembers.incomes",
                    "FamilyDetails.familyMembers.incomes.incomeSource",
                    "FamilyDetails.familyMembers.incomes.incomeEarned",
                    "FamilyDetails.familyMembers.incomes.frequency",
                    "IndividualFinancials.expenditures",
                    "IndividualFinancials.expenditures.expenditureSource",
                    "IndividualFinancials.expenditures.annualExpenses",
                    "IndividualFinancials.expenditures.frequency",
                    "HouseVerification",
                    "HouseVerification.ownership",
                    "HouseVerification.inCurrentAddressSince",
                    "HouseVerification.distanceFromBranch",
                    "HouseVerification.monthlyRent",
                    "HouseVerification.previousRentDetails",
                    "CustomerLicenceDetails",
                    "CustomerLicenceDetails.customerLicenceDetails",
                    "CustomerLicenceDetails.customerLicenceDetails.licence1Type",
                    "CustomerLicenceDetails.customerLicenceDetails.licence1ValidFrom",
                    "CustomerLicenceDetails.customerLicenceDetails.licence1ValidTo",
                    // "TrackDetails",
                    // "TrackDetails.vehiclesOwned",
                    // "TrackDetails.vehiclesFinanced",
                    // "TrackDetails.vehiclesFree",
                    "CustomerDocumentUpload",
                    "CustomerDocumentUpload.customerDocuments",
                    "CustomerDocumentUpload.customerDocuments.fileType",
                    "CustomerDocumentUpload.customerDocuments.fileId",
                    "CustomerDocumentUpload.customerDocuments.documentDate",
                    "CustomerDocumentUpload.customerDocuments.udfDate1",
                    "CustomerDocumentUpload.customerDocuments.checkNumber",
                    "ResidenceVerification",
                    "ResidenceVerification.location",
                    "ResidenceVerification.locatingHouse",
                    "ResidenceVerification.distanceFromHouse",
                    "ResidenceVerification.visibleIndicator",
                    "ResidenceVerification.commentOnLocality",
                    "ResidenceVerification.residenceStatus",
                    "ResidenceVerification.contactInformationConfirmed",
                    "ResidenceVerification.remarks",
                    "ResidenceVerification.stayAtResidence",
                    "ResidenceVerification.namePlate",
                    "ResidenceVerification.localityType",
                    "ResidenceVerification.typeOfAccomodation",
                    "ResidenceVerification.areaSQFT",
                    "ResidenceVerification.remarksOnBusiness",
                    "PhysicalAssets",
                    "PhysicalAssets.physicalAssets",
                    "PhysicalAssets.physicalAssets.assetType",
                    "PhysicalAssets.physicalAssets.nameOfOwnedAsset",
                    "PhysicalAssets.physicalAssets.numberOfOwnedAsset",
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
                    "EnterpriseReferences",
                    "EnterpriseReferences.verifications",
                    "EnterpriseReferences.verifications.referenceFirstName",
                    "EnterpriseReferences.verifications.knownSince",
                    "EnterpriseReferences.verifications.customerResponse",
                    "EnterpriseReferences.verifications.opinion"
                    // "IndividualReferences",
                    // "IndividualReferences.verifications",
                    // "IndividualReferences.verifications.referenceFirstName",
                    // "IndividualReferences.verifications.mobileNo",
                    // "IndividualReferences.verifications.occupation",
                    // "IndividualReferences.verifications.address",
                    // "IndividualReferences.verifications.ReferenceCheck",
                    // "IndividualReferences.verifications.ReferenceCheck.knownSince",
                    // "IndividualReferences.verifications.ReferenceCheck.relationship",
                    // "IndividualReferences.verifications.ReferenceCheck.customerResponse",
                    // "IndividualReferences.verifications.ReferenceCheck.opinion",
                    // "IndividualReferences.verifications.ReferenceCheck.financialStatus"

                ];
            }

            return {
                "type": "schema-form",
                "title": "CUSTOMER_PROFILE",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }
                    PageHelper.showLoader();

                    EnrolmentProcess.fromCustomerID($stateParams.pageId) 
                    .finally(function() {
                        PageHelper.hideLoader();
                    })
                    .subscribe(function(data) {
                        model.enrolmentProcess = data;
                        model.customer = data.customer;
                           
                    }, function(err) {
                        console.log(err);
                        PageHelper.hideLoader();
                    })
                    

                    var p1 = UIRepository.getEnrolmentProcessUIRepository().$promise;
                    var self = this;
                    p1.then(function(repo){
                        var formRequest = {
                            "includes": getIncludes(model),
                            "excludes": [
                            ],
                            "overrides": {
                                "KYC.addressProofNo": {
                                    onCapture: EnrollmentHelper.customerAadhaarOnCapture
                                },
                                "EnterpriseReferences": {
                                    "title": "NEIGHBOUR_CHECK"
                                }, 
                                "EnterpriseReferences.verifications.referenceFirstName": {
                                    "title":"NAME_OF_NEIGHBOUR",
                                    "required": true
                                },
                                "EnterpriseReferences.verifications.knownSince": {
                                    "title":"KNOWN_SINCE_(_IN_YEARS_)",
                                    "type" : "number",
                                    "required": true
                                },
                                "EnterpriseReferences.verifications.customerResponse": {
                                    "title":"NEIGHBOUR_REFERENCE",
                                    "type": "select",
                                    "enumCode": "customer_response"
                                },
                                "EnterpriseReferences.verifications.opinion": {
                                    "title":"COMMENTS_OF_NEIGHBOUR"
                                },
                                 "HouseVerification": {
                                    "title": "RESIDENCE"
                                }
                            },
                            "options": {
                                "repositoryAdditions": {
                                    "ResidenceVerification": {
                                        "type": "box",
                                        "title": "RESIDENCE_VERIFICATION",
                                        "orderNo": 999,
                                        "items": {
                                            "location": {
                                                "key": "customer.latitude",
                                                "title": "LOCATION",
                                                "type": "geotag",
                                                "orderNo": 10,
                                                "latitude": "latitude",
                                                "longitude": "longitude",
                                            },
                                            "locatingHouse": {
                                                "key": "customer.udf.userDefinedFieldValues.udf16",
                                                "title": "LOCATING_HOUSE",
                                                "type": "select",
                                                "orderNo": 20,
                                                "enumCode": "locating_house"
                                            },
                                            "distanceFromHouse": {
                                                "key": "customer.udf.userDefinedFieldValues.udf2",
                                                "type": "text",
                                                "orderNo": 30,
                                                "title": "DISTANCE_FROM_HOUSE",
                                                "schema": {
                                                    "type": "string"
                                                }
                                            },
                                            "visibleIndicator": {
                                                "key": "customer.udf.userDefinedFieldValues.udf3",
                                                "type": "radios",
                                                "enumCode": "decisionmaker",
                                                "orderNo": 40,
                                                "title": "VISIBLE_INDICATOR",
                                                "schema": {
                                                    "type": "string"
                                                }
                                            },
                                            "commentOnLocality": {
                                                "key": "customer.udf.userDefinedFieldValues.udf4",
                                                "type": "text",
                                                "orderNo": 50,
                                                "title": "COMMENT_ON_LOCALITY",
                                                "schema": {
                                                    "type": "string"
                                                }
                                            },
                                            "residenceStatus": {
                                                "key": "customer.ownership",
                                                "type": "select",
                                                "enumCode": "residence_status",
                                                "title": "RESIDENCE_STATUS",
                                                "orderNo": 60,
                                                "schema": {
                                                    "type": "string"
                                                }
                                            },
                                            "contactInformationConfirmed": {
                                                "key": "customer.udf.userDefinedFieldValues.udf5",
                                                "type": "radios",
                                                "title": "CONTACT_INFORMATION_CONFIRMED",
                                                "orderNo": 70,
                                                "enumCode": "decisionmaker",
                                                "schema": {
                                                    "type": "string"
                                                }
                                            },
                                            "remarks": {
                                                "key": "customer.udf.userDefinedFieldValues.udf11",
                                                "condition": "model.customer.udf.userDefinedFieldValues.udf5=='NO'",
                                                "type": "text",
                                                "title": "REMARKS",
                                                "orderNo": 80,
                                                "schema": {
                                                    "type": "string"
                                                }
                                            },
                                            "stayAtResidence": {
                                                "key": "customer.udf.userDefinedFieldValues.udf6",
                                                "type": "select",
                                                "enumCode": "decisionmaker",
                                                "orderNo": 90,
                                                "title": "STAY_AT_RESIDENCE",
                                                "schema": {
                                                    "type": "string"
                                                }
                                            },
                                            "noYearsAtResidence": {
                                                "key": "customer.udf.userDefinedFieldValues.udf10",
                                                "type": "select",
                                                "orderNo": 100,
                                                "enumCode": "years_residence",
                                                "title": "No_YEARS_AT_RESIDENCE",
                                                "schema": {
                                                    "type": "string"
                                                }
                                            },
                                            "namePlate": {
                                                "key": "customer.udf.userDefinedFieldValues.udf7",
                                                "type": "select",
                                                "enumCode": "decisionmaker",
                                                "title": "NAME_PLATE",
                                                "orderNo": 110,
                                                "schema": {
                                                    "type": "string"
                                                }
                                            },
                                            "localityType": {
                                                "key": "customer.localityType",
                                                "type": "select",
                                                "orderNo": 120,
                                                "enumCode": "locality_type",
                                                "title": "LOCALITY_TYPE",
                                                "schema": {
                                                    "type": "string"
                                                }
                                            },
                                            "typeOfAccomodation": {
                                                "key": "customer.accomodationType",
                                                "type": "select",
                                                "enumCode": "accomodation_type",
                                                "orderNo": 130,
                                                "title": "ACCOMODATION_TYPE",
                                                "schema": {
                                                    "type": "string"
                                                }
                                            },
                                            "areaSQFT": {
                                                "key": "customer.udf.userDefinedFieldValues.udf8",
                                                "title": "AREA_SQFT",
                                                "type": "select",
                                                "orderNo": 140,
                                                "enumCode": "area_sqft",
                                                "schema": {
                                                    "type": "string"
                                                }
                                            },
                                            "personMet": {
                                                "key": "customer.fieldInvestigationDetails[0].category",
                                                "orderNo": 145,
                                                "type": "select",
                                                "title": "PERSON_MET",
                                                "enumCode": "applicant_person_met"
                                            },
                                            "HouseVerificationPhoto": {
                                                "key": "customer.houseVerificationPhoto",
                                                "title": "HOUSE VERIFICATION PHOTO",
                                                "orderNo": 150,
                                                "type": "file",
                                                "category": "CustomerEnrollment",
                                                "subCategory": "PHOTO",
                                                "using": "scanner",
                                                "onChange": function () {
                                                    console.log("INSIDE ONCHANGE1");
                                                },
                                                "viewParams": function (modelValue, form, model) {
                                                    getLocation().then((pos) => {
                                                        console.log("successful");
                                                        model.customer.latitude = pos.coords.latitude;
                                                        model.customer.longitude = pos.coords.longitude;
                                                    });
                                                    getLocation().catch((err) => {
                                                        console.log(err);
                                                    });
                                                }
                                            },
                                            "remarksOnBusiness": {
                                                "key": "customer.udf.userDefinedFieldValues.udf9",
                                                "title": "REMAKRS_ON_BUISNESS",
                                                "orderNo": 160,
                                                "schema": {
                                                    "type": "string"
                                                }
                                            },
                                        }
                                    },
                                    "Liabilities": {
                                        "items": {
                                            "liabilities": {
                                                "items": {
                                                    "udf1": {
                                                        "title": "VEHICLE_MODEL",
                                                        "type": "string",
                                                        "key": "customer.liabilities[].udf1"
                                                    },
                                                    "customerLiabilityRepayments": {
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
                                    "IndividualInformation": {
                                        "items": {
                                            "customerCategory": {
                                                "key": "customer.customerCategory",
                                                "title": "CUSTOMER_CATEGORY",
                                                "type": "select",
                                                "enumCode": "lead_category",
                                                "orderNo": 85,
                                                "required": true
                                            },
                                            "state": {
                                                "title": "STATE"
                                            },
                                            "yearsOfExperience": {
                                                "key": "customer.yearsOfExperience",
                                                "title": "YEARS_OF_EXPERIENCE",
                                                "type": "string",
                                                fieldType: "number",
                                                "required": true
                                            }

                                        }
                                    },
                                    "CustomerDocumentUpload": {
                                        "type": "box",
                                        "title": "CUSTOMER_DOCUMENT_UPLOAD",
                                        "orderNo": 80,
                                        "items": {
                                            "customerDocuments": {
                                                "type": "array",
                                                "title": "DOCUMENT_UPLOAD",
                                                "key": "customer.customerDocuments",
                                                "view": "fixed",
                                                "items": {
                                                    "fileType": {
                                                        "type": "select",
                                                        "enumCode": "document_file_type",
                                                        "key": "customer.customerDocuments[].fileType",
                                                        "title": "DOCUMENT_NAME",
                                                        "required": true
                                                    },
                                                    "fileId": {
                                                        "key": "customer.customerDocuments[].fileId",
                                                        "type": "file",
                                                        "fileType": "application/pdf",
                                                        "using": "scanner",
                                                        "title": "DOCUMENT_UPLOAD",
                                                        "category": "CustomerEnrollment",
                                                        "subCategory": "KYC1",
                                                        "required": true
                                                    },
                                                    "documentDate": {
                                                        "key": "customer.customerDocuments[].documentDate",
                                                        "title": "ISSUE_DATE",
                                                        "type": "date",
                                                        "onChange": function (modelValue, form, model) {
                                                            if (moment(model.customer.customerDocuments[form.arrayIndex].udfDate1).format('YYYY-MM-DD') < moment(model.customer.customerDocuments[form.arrayIndex].documentDate).format('YYYY-MM-DD')) {
                                                                model.customer.customerDocuments[form.arrayIndex].documentDate = null;
                                                                PageHelper.showProgress('date', 'Please enter a date greater than from date', 5000);
                                                            }
                                                        }
                                                    },
                                                    "udfDate1": {
                                                        "key": "customer.customerDocuments[].udfDate1",
                                                        "title": "EXPIRY_DATE",
                                                        "type": "date",
                                                        "onChange": function (modelValue, form, model) {
                                                            if (moment(model.customer.customerDocuments[form.arrayIndex].udfDate1).format('YYYY-MM-DD') < moment(model.customer.customerDocuments[form.arrayIndex].documentDate).format('YYYY-MM-DD')) {
                                                                model.customer.customerDocuments[form.arrayIndex].udfDate1 = null;
                                                                PageHelper.showProgress('date', 'Please enter a date greater than from date', 5000);
                                                            }
                                                        }
                                                    },
                                                    "checkNumber": {
                                                        "key": "customer.customerDocuments[].documentNumber",
                                                        "title": "CHECK_NUMBER",
                                                        "type": "string",
                                                        fieldType: "number",
                                                        "condition": "model.customer.customerDocuments[arrayIndex].fileType=='Bank Signature Verification'",
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "CustomerLicenceDetails": {
                                        "title": "MUTLI_TYPE_LICENCE_CAPTURE",
                                        "type": "box",
                                        "orderNo": 85,
                                        "items": {
                                            "customerLicenceDetails": {
                                                "type": "array",
                                                "title": "MUTLI_TYPE_LICENCE_CAPTURE",
                                                "startEmpty": true,
                                                "key": "customer.customerLicenceDetails",
                                                "items": {
                                                    "licence1Type": {
                                                        "key": "customer.customerLicenceDetails[].licence1Type",
                                                        "title": "LICENCE_TYPE",
                                                        "type": "select",
                                                        "enumCode": "licence_type",
                                                        "required": true
                                                    },
                                                    "licence1ValidFrom": {
                                                        "key": "customer.customerLicenceDetails[].licence1ValidFrom",
                                                        "title": "LICENCE_VALID_FROM",
                                                        "type": "date",
                                                        "onChange": function (modelValue, form, model) {
                                                            if (moment(model.customer.customerLicenceDetails[form.arrayIndex].licence1ValidTo).format('YYYY-MM-DD') < moment(model.customer.customerLicenceDetails[form.arrayIndex].licence1ValidFrom).format('YYYY-MM-DD')) {
                                                                model.customer.customerLicenceDetails[form.arrayIndex].licence1ValidFrom = null;
                                                                PageHelper.showProgress('date', 'Please enter a date less than to date', 5000);
                                                            }
                                                        }
                                                    },
                                                    "licence1ValidTo": {
                                                        "key": "customer.customerLicenceDetails[].licence1ValidTo",
                                                        "title": "LICENCE_VALID_TO",
                                                        "type": "date",
                                                        "onChange": function (modelValue, form, model) {
                                                            if (moment(model.customer.customerLicenceDetails[form.arrayIndex].licence1ValidTo).format('YYYY-MM-DD') < moment(model.customer.customerLicenceDetails[form.arrayIndex].licence1ValidFrom).format('YYYY-MM-DD')) {
                                                                model.customer.customerLicenceDetails[form.arrayIndex].licence1ValidTo = null;
                                                                PageHelper.showProgress('date', 'Please enter a date greater than from date', 5000);
                                                            }
                                                        }
                                                    }
                                                }
                                            }

                                        }
                                    }
                                },
                                "additions": [
                                    {
                                        "type": "actionbox",
                                        "orderNo": 1200,
                                        "items": [
                                            {
                                                "type": "button",
                                                "title": "UPDATE",
                                                "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                            }
                                        ]
                                    }
                                ]
                            }
                        };
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, null, model);
                    })
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
                   
                    proceed: function(model, form){
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
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
