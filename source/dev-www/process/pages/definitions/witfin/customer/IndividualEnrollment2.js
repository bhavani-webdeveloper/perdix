define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "witfin.customer.IndividualEnrollment2",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository) {

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
                                "PhysicalAssets",
                                "IndividualReferences",
                                "ResidenceVerification",
                                "assets",
                                "FamilyDetails.familyMembers.dateOfBirth",
                                "FamilyDetails.familyMembers.maritalStatus",
                                "FamilyDetails.familyMembers.primaryOccupation",
                                "FamilyDetails.familyMembers.familyMemberFirstName",
                                "FamilyDetails.familyMembers.anualEducationFee",
                                "FamilyDetails.familyMembers.salary",
                                "FamilyDetails.familyMembers.incomes",
                                "FamilyDetails.expenditures"
                            ],
                            "overrides": {
                                "FamilyDetails.familyMembers": {
                                    "add": null,
                                    "remove": null,
                                    "view": "fixed"
                                },
                                "FamilyDetails.familyMembers.relationShip": {
                                    "readonly": true
                                },
                                // "IndividualReferenes.verifications.referenceFirstName": {
                                //     "title":"NAME_OF_NEIGHBOUR"
                                // },
                                // "IndividualReferenes.verifications.customerResponse": {
                                //     "title":"NEIGHBOUR_REFERENCE"
                                // },
                                // "IndividualReferenes.verifications.opinion": {
                                //     "title":"COMMENTS_OF_NEIGHBOUR"
                                // }
                            }
                        },
                        "ScreeningReview": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "IndividualInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true,
                                    "title": "HOUSEHOLD_DETAILS"
                                },
                                "Liabilities": {
                                    "readonly": true
                                },
                                "IndividualReferences": {
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "IndividualInformation.customerCategory": {
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "ResidenceVerification",
                                "FamilyDetails.familyMembers.dateOfBirth",
                                "PhysicalAssets",
                                "FamilyDetails.familyMembers.dateOfBirth",
                                "FamilyDetails.familyMembers.maritalStatus",
                                "FamilyDetails.familyMembers.primaryOccupation",
                                "FamilyDetails.familyMembers.familyMemberFirstName",
                                "FamilyDetails.familyMembers.anualEducationFee",
                                "FamilyDetails.familyMembers.salary",
                                "FamilyDetails.familyMembers.incomes",
                                "FamilyDetails.expenditures",
                                "IndividualReferences",
                                "ContactInformation.whatsAppMobileNoOption"
                            ]
                        },
                        "Application": {
                            "overrides": {
                                "FamilyDetails": {
                                    "title": "HOUSEHOLD_DETAILS"
                                },
                                "KYC.customerId": {
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "ContactInformation.location"
                                // "IndividualReferences.verifications.ReferenceCheck"
                            ]
                        },
                        "ApplicationReview": {
                            "excludes": [
                                "ContactInformation.whatsAppMobileNoOption"
                                // "IndividualReferences.verifications.ReferenceCheck"
                            ],
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "IndividualInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true,
                                    "title": "HOUSEHOLD_DETAILS"
                                },
                                "Liabilities": {
                                    "readonly": true
                                },
                                "IndividualReferences": {
                                    "readonly": true
                                },
                                "reference": {
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "ResidenceVerification":{
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "IndividualInformation.customerCategory": {
                                    "readonly": true
                                }
                            }

                        },
                        "BranchCreditAppraisal": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "IndividualInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true,
                                    "title": "HOUSEHOLD_DETAILS"
                                },
                                "Liabilities": {
                                    "readonly": true
                                },
                                "IndividualReferences": {
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "ResidenceVerification":{
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "IndividualInformation.customerCategory": {
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "ContactInformation.whatsAppMobileNoOption"
                                // "IndividualReferences.verifications.ReferenceCheck"
                            ]
                        },
                        "HOCreditAppraisal": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "IndividualInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true,
                                    "title": "HOUSEHOLD_DETAILS"
                                },
                                "Liabilities": {
                                    "readonly": true
                                },
                                "IndividualReferences": {
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "ResidenceVerification":{
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "IndividualInformation.customerCategory": {
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "ContactInformation.whatsAppMobileNoOption"
                                // "IndividualReferences.verifications.ReferenceCheck"
                            ]
                        },
                        "ManagementCommittee": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "IndividualInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true,
                                    "title": "HOUSEHOLD_DETAILS"
                                },
                                "Liabilities": {
                                    "readonly": true
                                },
                                "IndividualReferences": {
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "ResidenceVerification":{
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "IndividualInformation.customerCategory": {
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "ContactInformation.whatsAppMobileNoOption"
                                // "IndividualReferences.verifications.ReferenceCheck"
                            ]
                        },
                        "REJECTED": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "IndividualInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true,
                                    "title": "HOUSEHOLD_DETAILS"
                                },
                                "Liabilities": {
                                    "readonly": true
                                },
                                "V": {
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "ResidenceVerification",
                                "FamilyDetails.familyMembers.relationShip",
                                "FamilyDetails.familyMembers.familyMemberFirstName",
                                "FamilyDetails.familyMembers.anualEducationFee",
                                "FamilyDetails.familyMembers.salary",
                                "FamilyDetails.familyMembers.incomes",
                                "IndividualFinancials.expenditures"
                            ]
                        }
                    },
                    "loanProcess.loanAccount.isReadOnly": {
                        "Yes": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "IndividualInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "FamilyDetails": {
                                    "readonly": true,
                                    "title": "HOUSEHOLD_DETAILS"
                                },
                                "Liabilities": {
                                    "readonly": true
                                },
                                "IndividualReferences": {
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "ResidenceVerification":{
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                }
                            }
                        }
                    }
                }
            }
            var overridesFields = function (bundlePageObj) {
                return {
                    "IndividualInformation.photoImageId": {
                        "required": true
                    },
                    "IndividualReferences.verifications": {
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
                    "FamilyDetails.familyMembers.noOfDependents": {
                        "condition": "model.customer.familyMembers[arrayIndex].relationShip.toUpperCase() == 'SELF'"
                    },
                    "HouseVerification": {
                        "title": "RESIDENCE"
                    },
                    "Liabilities.liabilities.loanSource1": {
                        orderNo : 12
                    },
                    "Liabilities.liabilities.loanSourceCategory": {
                        onChange: function(modelValue, form, model) {
                            if (modelValue == 'Friends') {
                                model.customer.liabilities[form.arrayIndex].loanSource = 'Friends';
                            } else if (modelValue == 'Relatives') {
                                model.customer.liabilities[form.arrayIndex].loanSource = 'Relatives';
                            }
                        }
                    },
                    "Liabilities.liabilities.loanSource": {
                        "condition" : "model.customer.liabilities[arrayIndex].loanSourceCategory == 'Bank/NBFC'"
                    },
                    "Liabilities.liabilities.liabilityLoanPurpose": {
                        "enumCode": "loan_purpose_1",
                        "type": "select"
                    },
                    "FamilyDetails.familyMembers.familyMemberFirstName": {
                        "condition": "model.customer.familyMembers[arrayIndex].relationShip.toUpperCase() != 'SELF'"
                    },
                    "FamilyDetails.familyMembers.dateOfBirth": {
                        "condition": "model.customer.familyMembers[arrayIndex].relationShip.toUpperCase() != 'SELF'"
                    },
                    "FamilyDetails.familyMembers.maritalStatus": {
                        "condition": "model.customer.familyMembers[arrayIndex].relationShip.toUpperCase() != 'SELF'"
                    },
                    "ContactInformation.locality": {
                        "readonly" : true
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
                    "IndividualInformation.existingLoan" :{
                        "readonly": true
                    },
                    "HouseVerification.inCurrentAddressSince": {
                        "key": "customer.udf.userDefinedFieldValues.udf29",
                    },
                    "HouseVerification.previousRentDetails": {
                        "condition": "model.customer.udf.userDefinedFieldValues.udf29 == '1 - <3 years' && model.customer.ownership == 'Rental' || model.customer.udf.userDefinedFieldValues.udf29 == '< 1 year' && model.customer.ownership == 'Rental'"
                    },
                    "HouseVerification.monthlyRent": {
                        "condition": "model.customer.ownership == 'Rental'"
                    },
                    "HouseVerification.distanceFromBranch": {
                        "required": true
                    },
                    "ContactInformation.pincode": {
                        fieldType: "number",
                        resolver: "PincodeLOVConfiguration"
                    },
                    "ContactInformation.mailingPincode": {
                        fieldType: "string",
                        "resolver": "MailingPincodeLOVConfiguration",
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "KYC.addressProof" :{
                        "readonly": true
                    },
                    "KYC.identityProof": {
                        "readonly": true
                    },
                    "IndividualInformation.centreId": {
                        key: "customer.centreId",
                        type: "lov",
                        autolov: true,
                        lovonly: true,
                        bindMap: {},
                        required: true,
                        searchHelper: formHelper,
                        search: function (inputModel, form, model, context) {
                            var centres = SessionStore.getCentres();
                            // $log.info("hi");
                            // $log.info(centres);

                            var centreCode = formHelper.enum('centre').data;
                            var out = [];
                            if (centres && centres.length) {
                                for (var i = 0; i < centreCode.length; i++) {
                                    for (var j = 0; j < centres.length; j++) {
                                        if (centreCode[i].value == centres[j].id) {

                                            out.push({
                                                name: centreCode[i].name,
                                                id: centreCode[i].value
                                            })
                                        }
                                    }
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
                            model.customer.centreId = valueObj.id;
                            model.customer.centreName = valueObj.name;
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.name
                            ];
                        }

                    },
                    "IndividualInformation.customerBranchId": {
                        "readonly": true
                    },
                    "ContactInformation.mailingDoorNo": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "ContactInformation.mailingStreet": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "ContactInformation.mailingPostoffice": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "ContactInformation.mailingLocality": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "ContactInformation.mailingDistrict": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "ContactInformation.mailingState": {
                        "condition": "!model.customer.mailSameAsResidence"
                    },
                    "KYC.customerId": {
                        type: "lov",
                        key: "customer.id",
                        "inputMap": {
                            "firstName": {
                                "key": "customer.firstName",
                                "title": "CUSTOMER_NAME"
                            },
                            "urnNo": {
                                "key": "customer.urnNo",
                                "title": "URN_NO",
                                "type": "string"
                            },
                            "customerBranchId": {
                                "key": "customer.customerBranchId",
                                "type": "select",
                                "screenFilter": true,
                                "readonly": true
                            },
                            "centreName": {
                                "key": "customer.place",
                                "title": "CENTRE_NAME",
                                "type": "string",
                                "readonly": true,

                            },
                            "centreId": {
                                key: "customer.centreId",
                                type: "lov",
                                autolov: true,
                                lovonly: true,
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function (inputModel, form, model, context) {
                                    var centres = SessionStore.getCentres();
                                    // $log.info("hi");
                                    // $log.info(centres);

                                    var centreCode = formHelper.enum('centre').data;
                                    var out = [];
                                    if (centres && centres.length) {
                                        for (var i = 0; i < centreCode.length; i++) {
                                            for (var j = 0; j < centres.length; j++) {
                                                if (centreCode[i].value == centres[j].id) {

                                                    out.push({
                                                        name: centreCode[i].name,
                                                        id: centreCode[i].value
                                                    })
                                                }
                                            }
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
                                    model.centreId = valueObj.id;
                                    model.centreName = valueObj.name;
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        item.name
                                    ];
                                }
                            },
                        },
                        "outputMap": {
                            "urnNo": "customer.urnNo",
                            "firstName": "customer.firstName"
                        },
                        "searchHelper": formHelper,
                        "search": function (inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var branches = formHelper.enum('branch_id').data;
                            var branchName;
                            for (var i = 0; i < branches.length; i++) {
                                if (branches[i].code == inputModel.customerBranchId)
                                    branchName = branches[i].name;
                            }
                            var promise = Enrollment.search({
                                'branchName': branchName || SessionStore.getBranch(),
                                'firstName': inputModel.firstName,
                                'centreId': inputModel.centreId,
                                'customerType': "individual",
                                'urnNo': inputModel.urnNo
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function (data, index) {
                            return [
                                [data.firstName, data.fatherFirstName].join(' | '),
                                data.firstName,
                                data.urnNo
                            ];
                        },
                        onSelect: function (valueObj, model, context) {
                            PageHelper.showProgress('customer-load', 'Loading customer...');
                            EnrolmentProcess.fromCustomerID(valueObj.id)
                                .finally(function(){
                                    PageHelper.showProgress('customer-load', 'Done.', 5000);
                                })
                                .subscribe(function(enrolmentProcess){
                                    /* Updating the loan process */
                                    model.loanProcess.removeRelatedEnrolmentProcess(model.enrolmentProcess, model.loanCustomerRelationType);
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
                    "IndividualInformation.customerCategory",
                    "IndividualInformation.parentLoanAccount",
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
                    "FamilyDetails.familyMembers.noOfDependents",
                    "IndividualFinancials.expenditures",
                    "IndividualFinancials.expenditures.expenditureSource",
                    "IndividualFinancials.expenditures.annualExpenses",
                    "IndividualFinancials.expenditures.frequency",
                    "Liabilities",
                    "Liabilities.liabilities",
                    "Liabilities.liabilities.loanSourceCategory",
                    "Liabilities.liabilities.loanSource",
                    "Liabilities.liabilities.loanSource1",
                    "Liabilities.liabilities.loanType",
                    "Liabilities.liabilities.loanAmountInPaisa",
                    "Liabilities.liabilities.installmentAmountInPaisa",
                    "Liabilities.liabilities.outstandingAmountInPaisa",
                    "Liabilities.liabilities.startDate",
                    "Liabilities.liabilities.maturityDate",
                    "Liabilities.liabilities.noOfInstalmentPaid",
                    "Liabilities.liabilities.frequencyOfInstallment",
                    "Liabilities.liabilities.liabilityLoanPurpose",
                    "Liabilities.liabilities.interestOnly",
                    "Liabilities.liabilities.interestRate",
                    "Liabilities.liabilities.proofDocuments",
                    "HouseVerification",
                    "HouseVerification.ownership",
                    "HouseVerification.inCurrentAddressSince",
                    "HouseVerification.distanceFromBranch",
                    "HouseVerification.monthlyRent",
                    "HouseVerification.previousRentDetails",
                    "HouseVerification.customerDocuments",
                    "HouseVerification.customerDocuments.fileType",
                    "HouseVerification.customerDocuments.fileId",
                    "HouseVerification.customerDocuments.documentDate",
                    "HouseVerification.customerDocuments.udfDate1",
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
                    "PhysicalAssets.physicalAssets.nameOfOwnedAsset",
                    "PhysicalAssets.physicalAssets.numberOfOwnedAsset",
                    "PhysicalAssets.physicalAssets.ownedAssetValue",
                    "IndividualReferences",
                    "IndividualReferences.verifications",
                    "IndividualReferences.verifications.referenceFirstName",
                    "IndividualReferences.verifications.mobileNo",
                    "IndividualReferences.verifications.knownSince",
                    "IndividualReferences.verifications.relationship"
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
                                            "type":"select",
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
                                            "enumCode":"decisionmaker",
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
                                            "enumCode":"years_residence",
                                            "title": "No_YEARS_AT_RESIDENCE",
                                            "schema": {
                                                "type": "string"
                                            }
                                        },
                                        "namePlate": {
                                            "key": "customer.udf.userDefinedFieldValues.udf7",
                                            "type": "select",
                                            "enumCode":"decisionmaker",
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
                                            "type":"select",
                                            "orderNo": 140,
                                            "enumCode":"area_sqft",
                                            "schema": {
                                                "type": "string"
                                            }
                                        },
                                        "remarksOnBusiness": {
                                            "key": "customer.udf.userDefinedFieldValues.udf9",
                                            "title": "REMAKRS_ON_BUISNESS",
                                            "orderNo": 150,
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
                                                "loanSource1": {
                                                    "condition":"model.customer.liabilities[arrayIndex].loanSourceCategory == 'Friends' ||  model.customer.liabilities[arrayIndex].loanSourceCategory == 'Relatives'",
                                                    "key": "customer.liabilities[].loanSource",
                                                    "title":"LOAN_SOURCE",
                                                    "readonly": true
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
                                            "orderNo": 85
                                        },
                                        "parentLoanAccount": {
                                            "key": "customer.parentLoanAccount",
                                            "title": "PARENT_LOAN_ACCOUNT"
                                        }
                                    }
                                },
                                "HouseVerification": {
                                    "items": {
                                        "customerDocuments": {
                                            "type": "array",
                                            "title": "PROOF_OF_RESIDENCE",
                                            "key": "customer.customerDocuments",
                                            "items": {
                                                "fileType": {
                                                    "type": "string",
                                                    "key": "customer.customerDocuments[].fileType",
                                                    "title": "DOCUMENT_NAME"
                                                },
                                                "fileId": {
                                                    "key": "customer.customerDocuments[].fileId",
                                                    "type": "file",
                                                    "fileType": "application/pdf",
                                                    "using": "scanner",
                                                    "title": "DOCUMENT_UPLOAD",
                                                    "category": "CustomerEnrollment",
                                                    "subCategory": "KYC1"
                                                },
                                                "documentDate": {
                                                    "key": "customer.customerDocuments[].documentDate",
                                                    "title": "ISSUE_DATE",
                                                    "type": "date"
                                                },
                                                "udfDate1": {
                                                    "key": "customer.customerDocuments[].udfDate1",
                                                    "title": "EXPIRY_DATE",
                                                    "type": "date"
                                                }
                                            }
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
                                    "targetID": "IndividualInformation",
                                    "items":[
                                        {
                                            "key": "customer.centreId",
                                            "type": "select",
                                            "enumCode": "centre",
                                            "title": "CENTRE_NAME",
                                            "orderNo": 21,
                                            "readonly": true
                                        }
                                    ]
                                },
                                {
                                    "type": "actionbox",
                                    "condition": "model.customer.currentStage && (model.loanProcess.loanAccount.currentStage=='Screening' || model.loanProcess.loanAccount.currentStage=='Application')",
                                    "orderNo": 1200,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "UPDATE_ENROLMENT",
                                            "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                        }
                                    ]
                                }
                            ]
                        }
                    };

                    UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function(repo){
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form){
                            self.form = form;
                        });

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

                        return $q.when()
                            .then(function(){
                                if (obj.applicantCustomerId){
                                    return EnrolmentProcess.fromCustomerID(obj.applicantCustomerId).toPromise();
                                } else {
                                    return null;
                                }
                            })
                            .then(function(enrolmentProcess){
                                if (enrolmentProcess!=null){
                                    model.enrolmentProcess = enrolmentProcess;
                                    model.customer = enrolmentProcess.customer;
                                    model.loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, model.loanCustomerRelationType);
                                    BundleManager.pushEvent(model.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                                }
                                if(obj.leadCategory == 'Existing' || obj.leadCategory == 'Return') {
                                    model.customer.existingLoan = 'YES';
                                } else {
                                    model.customer.existingLoan = 'NO';
                                }
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
                                model.customer.referredBy = obj.referredBy;
                                model.customer.landLineNo = obj.alternateMobileNo;
                                model.customer.landmark = obj.landmark;
                                model.customer.postOffice = obj.postOffice;
                                model.customer.customerCategory = obj.leadCategory;
                                model.customer.parentLoanAccount = obj.parentLoanAccount;

                                for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                    // $log.info(model.customer.familyMembers[i].relationShip);
                                    // model.customer.familyMembers[i].educationStatus = obj.educationStatus;
                                    if (model.customer.familyMembers[i].relationShip.toUpperCase() == "SELF") {
                                        model.customer.familyMembers[i].educationStatus=obj.educationStatus;
                                     }
                                }
                            })








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
                    proceed: function(model, form, formName){
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
                                model.enrolmentProcess.proceed()
                                .subscribe(function(enrolmentProcess) {
                                    PageHelper.showProgress('enrolment', 'Done.', 5000);
                                }, function(err) {
                                    PageHelper.showErrors(err);
                                    PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                })
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
