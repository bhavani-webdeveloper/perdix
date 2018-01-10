define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "witfin.customer.IndividualEnrollment2",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector) {

            var self;
            AngularResourceService.getInstance().setInjector($injector);
            var branch = SessionStore.getBranch();
            var pageParams = {
                readonly: true
            };

            var preSaveOrProceed = function (reqData) {
                if (_.hasIn(reqData, 'customer.familyMembers') && _.isArray(reqData.customer.familyMembers)) {
                    var selfExist = false
                    for (var i = 0; i < reqData.customer.familyMembers.length; i++) {
                        var f = reqData.customer.familyMembers[i];
                        if (_.isString(f.relationShip) && f.relationShip.toUpperCase() == 'SELF') {
                            selfExist = true;
                            break;
                        }
                    }
                    if (selfExist == false) {
                        PageHelper.showProgress("pre-save-validation", "Self Relationship is Mandatory", 5000);
                        return false;
                    }
                } else {
                    PageHelper.showProgress("pre-save-validation", "Family Members section is missing. Self Relationship is Mandatory", 5000);
                    return false;
                }
                return true;
            }

            var configFile = function () {
                return {
                    "loanProcess.loanAccount.currentStage": {
                        "Screening": {
                            "excludes": [
                                "reference.verifications.mobileNo",
                                "reference.verifications.occupation",
                                "reference.verifications.address",
                                "reference.verifications.referenceCheck.relationship",
                                "reference.verifications.referenceCheck.financialStatus",
                                "ResidenceVerification",
                                "assets",
                                "householdeDetails.familyMembers.relationShip",
                                "householdeDetails.familyMembers.maritalStatus",
                                "householdeDetails.familyMembers.primaryOccupation",
                                "householdeDetails.familyMembers.educationStatus",
                                "householdeDetails.familyMembers.familyMemberFirstName",
                                "householdeDetails.familyMembers.anualEducationFee",
                                "householdeDetails.familyMembers.salary",
                                "householdeDetails.familyMembers.incomes",
                                "householdeDetails.expenditures"



                            ],
                            "overrides": {
                                "householdeDetails.familyMembers": {
                                    "add": null,
                                    "remove": null
                                },
                                "reference.verifications.referenceFirstName": {
                                    "title":"NAME_OF_NEIGHBOUR"
                                },
                                "reference.verifications.referenceCheck.customerResponse": {
                                    "title":"NEIGHBOUR_REFERENCE"
                                },
                                "reference.verifications.referenceCheck.opinion": {
                                    "title":"COMMENTS_OF_NEIGHBOUR"
                                }
                            }
                        },
                        "ScreeningReview": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "personalInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "householdeDetails": {
                                    "readonly": true
                                },
                                "householdLiablities": {
                                    "readonly": true
                                },
                                "householdVerification": {
                                    "readonly": true
                                },
                                "trackDetails": {
                                    "readonly": true
                                },
                                "reference": {
                                    "readonly": true
                                },
                                "reference.verifications.referenceFirstName": {
                                    "title":"NAME_OF_NEIGHBOUR"
                                },
                                "reference.verifications.referenceCheck.customerResponse": {
                                    "title":"NEIGHBOUR_REFERENCE"
                                },
                                "reference.verifications.referenceCheck.opinion": {
                                    "title":"COMMENTS_OF_NEIGHBOUR"
                                }
                            },
                            "excludes": [
                                "ResidenceVerification",
                                "assets",
                                "householdeDetails.familyMembers.relationShip",
                                "householdeDetails.familyMembers.maritalStatus",
                                "householdeDetails.familyMembers.primaryOccupation",
                                "householdeDetails.familyMembers.educationStatus",
                                "householdeDetails.familyMembers.familyMemberFirstName",
                                "householdeDetails.familyMembers.anualEducationFee",
                                "householdeDetails.familyMembers.salary",
                                "householdeDetails.familyMembers.incomes",
                                "householdeDetails.expenditures",
                                "reference.mobileNo",
                                "reference.occupation",
                                "reference.address",
                                "reference.referenceCheck",
                                "reference.referenceCheck.relationship",
                                "reference.referenceCheck.financialStatus"
                            ]
                        },
                        "Application": {
                            "Includes": [
                                "reference"
                            ]
                        },
                        "ApplicationReview": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "personalInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "householdeDetails": {
                                    "readonly": true
                                },
                                "householdLiablities": {
                                    "readonly": true
                                },
                                "householdVerification": {
                                    "readonly": true
                                },
                                "trackDetails": {
                                    "readonly": true
                                },
                                "reference": {
                                    "readonly": true
                                },
                                "ResidenceVerification":{
                                    "readonly": true
                                }
                            },
                            "excludes": [

                            ]
                        },
                        "BranchCreditAppraisal": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "personalInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "householdeDetails": {
                                    "readonly": true
                                },
                                "householdLiablities": {
                                    "readonly": true
                                },
                                "householdVerification": {
                                    "readonly": true
                                },
                                "trackDetails": {
                                    "readonly": true
                                },
                                "ResidenceVerification":{
                                    "readonly": true
                                }
                            },
                            "excludes": [

                            ]
                        },
                        "HOCreditAppraisal": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "personalInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "householdeDetails": {
                                    "readonly": true
                                },
                                "householdLiablities": {
                                    "readonly": true
                                },
                                "householdVerification": {
                                    "readonly": true
                                },
                                "trackDetails": {
                                    "readonly": true
                                },
                                "ResidenceVerification":{
                                    "readonly": true
                                }
                            },
                            "excludes": [

                            ]
                        },
                        "ManagementCommittee": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "personalInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "householdeDetails": {
                                    "readonly": true
                                },
                                "householdLiablities": {
                                    "readonly": true
                                },
                                "householdVerification": {
                                    "readonly": true
                                },
                                "trackDetails": {
                                    "readonly": true
                                },
                                "ResidenceVerification":{
                                    "readonly": true
                                }
                            },
                            "excludes": [

                            ]
                        },
                        "REJECTED": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "personalInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "householdeDetails": {
                                    "readonly": true
                                },
                                "householdLiablities": {
                                    "readonly": true
                                },
                                "householdVerification": {
                                    "readonly": true
                                },
                                "trackDetails": {
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "ResidenceVerification",
                                "householdeDetails.familyMembers.relationShip",
                                "householdeDetails.familyMembers.familyMemberFirstName",
                                "householdeDetails.familyMembers.anualEducationFee",
                                "householdeDetails.familyMembers.salary",
                                "householdeDetails.familyMembers.incomes",
                                "householdeDetails.expenditures"
                            ]
                        }
                    }
                }
            }
            var overridesFields = function (bundlePageObj) {
                return {
                    "KYC.customerSearch": {
                        type: "lov",
                        key: "customer.id",
                        onSelect: function (valueObj, model, context) {
                            PageHelper.showProgress('customer-load', 'Loading customer...');
                            EnrolmentProcess.fromCustomerID(valueObj.id)
                                .finally(function(){
                                    PageHelper.showProgress('customer-load', 'Done.', 5000);
                                })
                                .subscribe(function(enrolmentProcess){
                                    /* Updating the loan process */
                                    model.loanProcess.removeRelatedEnrolmentProcess(model.customer.id, model.loanCustomerRelationType);
                                    model.loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, model.loanCustomerRelationType);

                                    /* Setting on the current page */
                                    model.enrolmentProcess = enrolmentProcess;
                                    model.customer = enrolmentProcess.customer;

                                    BundleManager.pushEvent(model.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                                })
                        }
                    }
                }
            }
            var getIncludes = function (model) {

                return [
                    "KYC",
                    "KYC.customerSearch",
                    "KYC.IdentityProof1",
                    "KYC.IdentityProof1.identityProof",
                    "KYC.IdentityProof1.identityProofImageId",
                    // "KYC.IdentityProof1.identityProofReverseImageId",
                    "KYC.IdentityProof1.identityProofNo",
                    "KYC.IdentityProof1.identityProofNo1",
                    "KYC.IdentityProof1.identityProofNo2",
                    "KYC.IdentityProof1.identityProofNo3",
                    // "KYC.IdentityProof1.idProofIssueDate",
                    // "KYC.IdentityProof1.idProofValidUptoDate",
                    "KYC.addressProof1",
                    "KYC.addressProof1.addressProof",
                    "KYC.addressProof1.addressProofImageId",
                    // "KYC.addressProof1.addressProofReverseImageId",
                    "KYC.addressProof1.addressProofNo",
                    "KYC.addressProof1.addressProofNo1",
                    "KYC.addressProof1.addressProofNo2",
                    // "KYC.addressProof1.addressProofIssueDate",
                    "KYC.addressProof1.addressProofValidUptoDate",
                    "KYC.AdditionalKYC",
                    "KYC.AdditionalKYC.additionalKYCs",
                    "KYC.AdditionalKYC.kyc1ProofNumber",
                    "KYC.AdditionalKYC.kyc1ProofNumber1",
                    "KYC.AdditionalKYC.kyc1ProofNumber2",
                    "KYC.AdditionalKYC.kyc1ProofNumber3",
                    "KYC.AdditionalKYC.kyc1ProofType",
                    "KYC.AdditionalKYC.kyc1ImagePath",
                    // "AdditionalKYC.additionalKYCs.kyc1IssueDate",
                    "KYC.AdditionalKYC.kyc1ValidUptoDate",
                    "personalInformation",
                    "personalInformation.customerBranchId",
                    "personalInformation.centerId",
                    "personalInformation.centerId1",
                    "personalInformation.centerId2",
                    "personalInformation.photoImageId",
                    "personalInformation.title",
                    "personalInformation.firstName",
                    // "personalInformation.enrolledAs",
                    "personalInformation.gender",
                    "personalInformation.dateOfBirth",
                    "personalInformation.age",
                    "personalInformation.language",
                    "personalInformation.fatherFirstName",
                    "personalInformation.motherName",
                    "personalInformation.maritalStatus",
                    "personalInformation.spouseFirstName",
                    "personalInformation.spouseDateOfBirth",
                    "personalInformation.weddingDate",
                    "ContactInformation",
                    "ContactInformation.contracInfo",
                    "ContactInformation.contracInfo.mobilePhone",
                    "ContactInformation.contracInfo.landLineNo",
                    "ContactInformation.contracInfo.whatsAppMobileNoOption",
                    "ContactInformation.contracInfo.whatsAppMobileNo",
                    "ContactInformation.contracInfo.email",
                    "ContactInformation.residentAddress",
                    "ContactInformation.residentAddress.careOf",
                    "ContactInformation.residentAddress.doorNo",
                    "ContactInformation.residentAddress.street",
                    "ContactInformation.residentAddress.postOffice",
                    "ContactInformation.residentAddress.landmark",
                    "ContactInformation.residentAddress.pincode",
                    "ContactInformation.residentAddress.locality",
                    "ContactInformation.residentAddress.villageName",
                    "ContactInformation.residentAddress.district",
                    "ContactInformation.residentAddress.state",
                    "ContactInformation.residentAddress.mailSameAsResidence",
                    "ContactInformation.permanentResidentAddress",
                    "ContactInformation.permanentResidentAddress.mailingDoorNo",
                    "ContactInformation.permanentResidentAddress.mailingStreet",
                    "ContactInformation.permanentResidentAddress.mailingPostoffice",
                    "ContactInformation.permanentResidentAddress.mailingPincode",
                    "ContactInformation.permanentResidentAddress.mailingLocality",
                    "ContactInformation.permanentResidentAddress.mailingDistrict",
                    "ContactInformation.permanentResidentAddress.mailingState",
                    "householdeDetails",
                    "householdeDetails.familyMembers",
                    "householdeDetails.familyMembers.relationShipself",
                    "householdeDetails.familyMembers.relationShip",
                    "householdeDetails.familyMembers.maritalStatus",
                    "householdeDetails.familyMembers.familyMemberFirstName",
                    "householdeDetails.familyMembers.primaryOccupation",
                    "householdeDetails.familyMembers.educationStatus",
                    "householdeDetails.familyMembers.anualEducationFee",
                    "householdeDetails.familyMembers.salary",
                    "householdeDetails.familyMembers.incomes",
                    "householdeDetails.familyMembers.incomes.incomeSource",
                    "householdeDetails.familyMembers.incomes.incomeEarned",
                    "householdeDetails.familyMembers.incomes.frequency",
                    "householdeDetails.expenditures",
                    "householdeDetails.expenditures.expenditureSource",
                    "householdeDetails.expenditures.annualExpenses",
                    "householdeDetails.expenditures.frequency",
                    "householdLiablities",
                    "householdLiablities.liabilities",
                    "householdLiablities.liabilities.loanSourceCategory",
                    "householdLiablities.liabilities.loanSource",
                    "householdLiablities.liabilities.loanType",
                    "householdLiablities.liabilities.loanAmountInPaisa",
                    "householdLiablities.liabilities.installmentAmountInPaisa",
                    "householdLiablities.liabilities.outstandingAmountInPaisa",
                    "householdLiablities.liabilities.startDate",
                    "householdLiablities.liabilities.maturityDate",
                    "householdLiablities.liabilities.noOfInstalmentPaid",
                    "householdLiablities.liabilities.frequencyOfInstallment",
                    "householdLiablities.liabilities.liabilityLoanPurpose",
                    "householdLiablities.liabilities.interestOnly",
                    "householdLiablities.liabilities.interestRate",
                    "householdLiablities.liabilities.proofDocuments",
                    "householdVerification",
                    "householdVerification.householdDetails",
                    "householdVerification.householdDetails.ownership",
                    "householdVerification.householdDetails.udf29",
                    "householdVerification.householdDetails.distanceFromBranch",
                    "householdVerification.householdDetails.monthlyRent",
                    "householdVerification.householdDetails.previousRentDetails",
                    "trackDetails",
                    "trackDetails.vehiclesOwned",
                    "trackDetails.vehiclesFinanced",
                    "trackDetails.vehiclesFree",
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
                    "ResidenceVerification.yearOfResidence",
                    "ResidenceVerification.namePlate",
                    "ResidenceVerification.localityType",
                    "ResidenceVerification.typeOfAccomodation",
                    "ResidenceVerification.areaSQFT",
                    "ResidenceVerification.remarksOnBusiness",
                    "assets",
                    "assets.physicalAssets",
                    "assets.physicalAssets.assetType",
                    "assets.physicalAssets.ownedAssetDetails",
                    "assets.physicalAssets.numberOfOwnedAsset",
                    "reference",
                    "reference.verifications",
                    "reference.verifications.referenceFirstName",
                    "reference.verifications.mobileNo",
                    "reference.verifications.occupation",
                    "reference.verifications.address",
                    "reference.verifications.referenceCheck",
                    "reference.verifications.referenceCheck.knownSince",
                    "reference.verifications.referenceCheck.relationship",
                    "reference.verifications.referenceCheck.customerResponse",
                    "reference.verifications.referenceCheck.opinion",
                    "reference.verifications.referenceCheck.financialStatus"

                ];

            }

            function getLoanCustomerRelation(pageClass){
                switch (pageClass){
                    case 'applicant':
                        return 'Applicant';
                        break;
                    case 'co-applicant':
                        return 'Co-Applicant';
                        break;
                    case 'guarantor':
                        return 'Guarantor';
                        break;
                    default:
                        return null;
                }
            }

            return {
                "type": "schema-form",
                "title": "INDIVIDUAL_ENROLLMENT_2",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }

                    /* Setting data recieved from Bundle */
                    model.loanCustomerRelationType =getLoanCustomerRelation(bundlePageObj.pageClass);
                    model.pageClass = bundlePageObj.pageClass;
                    model.currentStage = bundleModel.currentStage;
                    /* End of setting data recieved from Bundle */

                    /* Setting data for the form */
                    model.customer = model.enrolmentProcess.customer;
                    /* End of setting data for the form */


                    /* Form rendering starts */
                    self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [
                            "KYC.addressProofSameAsIdProof",
                        ],
                        "options": {
                            "repositoryAdditions": {
                                "ResidenceVerification": {
                                    "type": "box",
                                    "title": "RELATIONSSHIP_VERIFICATION",
                                    "orderNo": 999,
                                    "items": {
                                        "location": {
                                            "key": "customer.latitude",
                                            "title": "LOCATION",
                                            "type": "geotag",
                                            "latitude": "latitude",
                                            "longitude": "longitude",
                                        },
                                        "locatingHouse": {
                                            "key": "customer.udf.userDefinedFieldValues.udf1",
                                            "type": "text",
                                            "title": "LOCATING_HOUSE"
                                        },
                                        "distanceFromHouse": {
                                            "key": "customer.udf.userDefinedFieldValues.udf2",
                                            "type": "text",
                                            "title": "DISTANCE_FROM_HOUSE"
                                        },
                                        "visibleIndicator": {
                                            "key": "customer.udf.userDefinedFieldValues.udf3",
                                            "type": "text",
                                            "title": "VISIBLE_INDICATOR"
                                        },
                                        "commentOnLocality": {
                                            "key": "customer.udf.userDefinedFieldValues.udf4",
                                            "type": "text",
                                            "title": "COMMENT_ON_LOCALITY"
                                        },
                                        "residenceStatus": {
                                            "key": "customer.ownership",
                                            "type": "text",
                                            "title": "RESIDENCE_STATUS"
                                        },
                                        "contactInformationConfirmed": {
                                            "key": "customer.udf.userDefinedFieldValues.udf5",
                                            "type": "select",
                                            "title": "CONTACT_INFORMATION_CONFIRMED"
                                        },
                                        "remarks": {
                                            "key": "customer.udf.userDefinedFieldValues.udf5",
                                            "condition": "customer.udf.userDefinedFieldValues.udf5=='No'",
                                            "type": "text",
                                            "title": "REMARKS"
                                        },
                                        "stayAtResidence": {
                                            "key": "customer.udf.userDefinedFieldValues.udf6",
                                            "type": "select",
                                            "enumCode":"decisionmaker",
                                            "title": "STAY_AT_RESIDENCE"
                                        },
                                        "yearOfResidence": {
                                            "key": "customer.inCurrentAddressSince",
                                            "type": "select",
                                            "title": "YEAR_OF_RESIDENCE"
                                        },
                                        "namePlate": {
                                            "key": "customer.udf.userDefinedFieldValues.udf7",
                                            "type": "select",
                                            "enumCode":"decisionmaker",
                                            "title": "NAME_PLATE"
                                        },
                                        "localityType": {
                                            "key": "customer.localityType",
                                            "type": "select",
                                            "title": "LOCALITY_TYPE"
                                        },
                                        "typeOfAccomodation": {
                                            "key": "customer.accomodationType",
                                            "type": "select",
                                            "title": "ACCOMODATION_TYPE"
                                        },
                                        "areaSQFT": {
                                            "key": "customer.udf.userDefinedFieldValues.udf8",
                                            "title": "AREA_SQFT",
                                            "type":"select"
                                        },
                                        "remarksOnBusiness": {
                                            "key": "customer.udf.userDefinedFieldValues.udf9",
                                            "title": "REMAKRS_ON_BUISNESS"
                                        },
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
                                            "title": "SUBMIT"
                                        }
                                    ]
                                }
                            ]
                        }
                    };
                    self.form = IrfFormRequestProcessor.getFormDefinition('IndividualEnrollment2', formRequest, configFile(), model);
                    /* Form rendering ends */
                },

                preDestroy: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // console.log("Inside preDestroy");
                    // console.log(arguments);
                    if (bundlePageObj) {
                        var enrolmentDetails = {
                            'customerId': model.customer.id,
                            'customerClass': bundlePageObj.pageClass,
                            'firstName': model.customer.firstName
                        }
                        // BundleManager.pushEvent('new-enrolment',  {customer: model.customer})
                        BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails)
                    }
                    return $q.resolve();
                },
                eventListeners: {
                    "test-listener": function (bundleModel, model, obj) {

                    },
                    "lead-loaded": function (bundleModel, model, obj) {
                        model.customer.mobilePhone = obj.mobileNo;
                        model.customer.gender = obj.gender;
                        model.customer.firstName = obj.leadName;
                        model.customer.maritalStatus = obj.maritalStatus;
                        model.customer.customerBranchId = obj.branchId;
                        model.customer.centreId = obj.centreId;
                        model.customer.centreName = obj.centreName;
                        model.customer.street = obj.addressLine2;
                        model.customer.doorNo = obj.addressLine1;
                        model.customer.pincode = obj.pincode;
                        model.customer.district = obj.district;
                        model.customer.state = obj.state;
                        model.customer.locality = obj.area;
                        model.customer.villageName = obj.cityTownVillage;
                        model.customer.landLineNo = obj.alternateMobileNo;
                        model.customer.dateOfBirth = obj.dob;
                        model.customer.age = moment().diff(moment(obj.dob, SessionStore.getSystemDateFormat()), 'years');
                        model.customer.gender = obj.gender;
                        model.customer.landLineNo = obj.alternateMobileNo;


                        for (var i = 0; i < model.customer.familyMembers.length; i++) {
                            $log.info(model.customer.familyMembers[i].relationShip);
                            model.customer.familyMembers[i].educationStatus = obj.educationStatus;
                            /*if (model.customer.familyMembers[i].relationShip == "self") {
                             model.customer.familyMembers[i].educationStatus=obj.educationStatus;
                             break;
                             }*/
                        }
                        if(obj.applicantCustomerId) {
                             Enrollment.getCustomerById({id: obj.applicantCustomerId})
                            .$promise
                            .then(function (res) {
                                PageHelper.showProgress("customer-load", "Done..", 5000);
                                model.customer = Utils.removeNulls(res, true);
                                model.customer.identityProof = "Pan Card";
                                model.customer.addressProof = "Aadhar Card";
                                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                            }, function (httpRes) {
                                PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
                            })
                        }
                    },
                    "origination-stage": function (bundleModel, model, obj) {
                        model.currentStage = obj
                    }
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                    return [
                        item.customer.urnNo,
                        Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                        item.customer.villageName
                    ]
                },
                form: [],

                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    setProofs: function (model) {
                        model.customer.addressProofNo = model.customer.aadhaarNo;
                        model.customer.identityProofNo = model.customer.aadhaarNo;
                        model.customer.identityProof = 'Aadhar card';
                        model.customer.addressProof = 'Aadhar card';
                        model.customer.addressProofSameAsIdProof = true;
                        if (model.customer.yearOfBirth) {
                            model.customer.dateOfBirth = model.customer.yearOfBirth + '-01-01';
                        }
                    },
                    preSave: function (model, form, formName) {
                        var deferred = $q.defer();
                        if (model.customer.firstName) {
                            deferred.resolve();
                        } else {
                            PageHelper.showProgress('enrollment', 'Customer Name is required', 3000);
                            deferred.reject();
                        }
                        return deferred.promise;
                    },
                    reload: function (model, formCtrl, form, $event) {
                        $state.go("Page.Engine", {
                            pageName: 'customer.IndividualEnrollment',
                            pageId: model.customer.id
                        }, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    },
                    save: function (model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }

                        // $q.all start
                        model.enrolmentProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                formHelper.resetFormValidityState(formCtrl);
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Customer Saved.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent()
                            }, function (err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    submit: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.enrolmentProcess.save()
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
})
