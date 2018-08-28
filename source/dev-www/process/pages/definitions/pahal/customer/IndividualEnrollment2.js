define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "pahal.customer.IndividualEnrollment2",
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
            var adharAndPanVAlidation = function(customer,model){

                if (model.enrolmentProcess.customer.addressProof == 'Aadhar Card' &&
                    !_.isNull(model.enrolmentProcess.customer.addressProofNo)) {
                    model.enrolmentProcess.customer.aadhaarNo = customer.addressProofNo;
                }
                if (model.enrolmentProcess.customer.identityProof == 'Pan Card' &&
                    !_.isNull(model.enrolmentProcess.customer.identityProofNo)) {
                    model.enrolmentProcess.customer.panNo = customer.identityProofNo;
                }
                if (model.enrolmentProcess.customer.addressProof != 'Aadhar Card' &&
                    !_.isNull(model.enrolmentProcess.customer.addressProofNo)) {
                    model.enrolmentProcess.customer.aadhaarNo = null;
                }
                if (model.enrolmentProcess.customer.identityProof != 'Pan Card' &&
                    !_.isNull(model.enrolmentProcess.customer.identityProofNo)) {
                    model.enrolmentProcess.customer.panNo = null;
                }

            }

            var configFile = function () {
                return {
                    "loanProcess.loanAccount.currentStage": {
                        "Screening": {
                            "overrides": {

                            },
                            "excludes": [
                                "EnterpriseReferences",
                                "IndividualReferences",
                                "PhysicalAssets",
                                "ResidenceVerification"
                            ]
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
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "CustomerDocumentUpload": {
                                    "readonly": true
                                },
                                "CustomerLicenceDetails":{
                                    "readonly": true
                                },
                                "BankAccounts": {
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "EnterpriseReferences",
                                "IndividualReferences",
                                "PhysicalAssets",
                                "ResidenceVerification"
                            ]
                        },
                        "GoNoGoApproval1": {
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
                                "CustomerDocumentUpload": {
                                    "readonly": true
                                },
                                "CustomerLicenceDetails":{
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "BankAccounts": {
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "EnterpriseReferences",
                                "IndividualReferences",
                                "PhysicalAssets",
                                "ResidenceVerification"
                            ]
                        },
                        "GoNoGoApproval2": {
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
                                "CustomerDocumentUpload": {
                                    "readonly": true
                                },
                                "CustomerLicenceDetails":{
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "BankAccounts": {
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "EnterpriseReferences",
                                "IndividualReferences",
                                "PhysicalAssets",
                                "ResidenceVerification"
                            ]
                        },
                        "Application": {
                            "overrides": {

                            },
                            "excludes": [
                                "EnterpriseReferences",
                                "IndividualReferences",
                                "PhysicalAssets",
                                "ResidenceVerification"
                            ]
                        },
                        "ApplicationReview": {
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
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "CustomerDocumentUpload": {
                                    "readonly": true
                                },
                                "CustomerLicenceDetails":{
                                    "readonly": true
                                },
                                "BankAccounts": {
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "EnterpriseReferences",
                                "IndividualReferences",
                                "PhysicalAssets",
                                "ResidenceVerification"
                            ]
                        },
                        "TeleVerification": {
                            "overrides": {
                            },
                            "excludes": [
                                "ContactInformation.location",
                                "EnterpriseReferences",
                                "PhysicalAssets",
                                "ResidenceVerification",
                                "IndividualReferences"
                            ]
                        },
                        "FieldInvestigation1": {
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
                            ]
                        },
                        "FieldInvestigation2": {
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
                            ]
                        },
                        "FieldInvestigation3": {
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
                            ]
                        },
                        
                        "CreditAppraisal": {
                            "overrides": {
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "ResidenceVerification": {
                                    "readonly": true
                                },
                                "EnterpriseReferences":{
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "ContactInformation.location",
                            ]
                        },
                        "CreditApproval1": {
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
                                "CustomerDocumentUpload": {
                                    "readonly": true
                                },
                                "CustomerLicenceDetails":{
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "BankAccounts": {
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "ResidenceVerification": {
                                    "readonly": true
                                },
                                "EnterpriseReferences":{
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "ContactInformation.location"
                            ]
                        },
                        "CreditApproval2": {
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
                                "CustomerDocumentUpload": {
                                    "readonly": true
                                },
                                "CustomerLicenceDetails":{
                                    "readonly": true
                                },
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "BankAccounts": {
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "ResidenceVerification": {
                                    "readonly": true
                                },
                                "EnterpriseReferences":{
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "ContactInformation.location"
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
                                },
                                "CustomerDocumentUpload": {
                                    "readonly": true
                                },
                                "CustomerLicenceDetails":{
                                    "readonly": true
                                },
                                "BankAccounts": {
                                    "readonly": true
                                },
                                "KYC.identityProof": {
                                    "readonly": true
                                },
                                "EnterpriseReferences":{
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
                                "HouseVerification": {
                                    "readonly": true
                                },
                                "CustomerDocumentUpload": {
                                    "readonly": true
                                },
                                "CustomerLicenceDetails":{
                                    "readonly": true
                                },
                                "ResidenceVerification":{
                                    "readonly": true
                                },
                                "PhysicalAssets": {
                                    "readonly": true
                                },
                                "BankAccounts": {
                                    "readonly": true
                                },
                                "EnterpriseReferences":{
                                    "readonly": true
                                }
                            }
                        }
                    }
                }
            }
            var overridesFields = function (bundlePageObj) {
                return {
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
                    "IndividualInformation.spouseFirstName":{
                        "condition": "model.customer.maritalStatus.toLowerCase() == 'married'"
                    },
                    "IndividualInformation.spouseDateOfBirth":{
                        "condition": "model.customer.spouseDateOfBirth.toLowerCase() == 'married'"
                    },
                    "BankAccounts.customerBankAccounts": {
                        startEmpty: true
                    },
                    "BankAccounts.customerBankAccounts.bankStatements":{
                        startEmpty: true
                    },
                    "BankAccounts.customerBankAccounts.accountNumber": {
                        "type": "password",
                        "required": true
                    },
                    "BankAccounts.customerBankAccounts.confirmedAccountNumber": {
                        "type": "string",
                        "title": "CONFIRMED_ACCOUNT_NUMBER",
                        "required": true
                    },
                    // "TrackDetails.vehiclesFree": {
                    //     "readonly": true
                    // },
                    // "TrackDetails.vehiclesOwned": {
                    //     "onChange": calculateVehiclesFree
                    // },
                    // "TrackDetails.vehiclesFinanced": {

                    //     "onChange": calculateVehiclesFree
                    // },
                    "IndividualInformation.photoImageId": {
                        "required": true
                    },
                    "IndividualInformation.dateOfBirth": {
                        "onChange": function (modelValue, form, model) {
                            if (model.customer.dateOfBirth) {
                                model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                        }
                    },
                    "IndividualInformation.age": {
                        "onChange": function (modelValue, form, model) {
                            if (model.customer.age > 0) {
                                if (model.customer.dateOfBirth) {
                                    model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-') + moment(model.customer.dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                } else {
                                    model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-MM-DD');
                                }
                            }
                        }
                    },
                    "FamilyDetails.familyMembers.noOfDependents": {
                        "condition": "model.customer.familyMembers[arrayIndex].relationShip.toUpperCase() == 'SELF'"
                    },
                    "HouseVerification": {
                        "title": "RESIDENCE"
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
                    // "IndividualInformation.existingLoan" :{
                    //     "readonly": true
                    // },
                    "HouseVerification.inCurrentAddressSince": {
                        "key": "customer.udf.userDefinedFieldValues.udf29",
                    },
                    "HouseVerification.previousRentDetails": {
                        "condition": "model.customer.udf.userDefinedFieldValues.udf29 == '1 - <3 years' && model.customer.ownership == 'Rented' || model.customer.udf.userDefinedFieldValues.udf29 == '< 1 year' && model.customer.ownership == 'Rented'"
                    },
                    "HouseVerification.monthlyRent": {
                        "condition": "model.customer.ownership == 'Rented'"
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
                    "KYC.addressProofNo": {
                        onCapture: EnrollmentHelper.customerAadhaarOnCapture
                    },
                    "KYC.addressProof" :{
                        "readonly": true
                    },
                    "KYC.identityProof": {
                        //"readonly": true
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
                            
                            var enrolmentDetails = {
                                'customerId': model.customer.id,
                                'customerClass': model._bundlePageObj.pageClass,
                                'firstName': model.customer.firstName
                            };
                            if (_.hasIn(model, 'customer.id')){
                                BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails)
                            }
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
                                    BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
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
                   // "IndividualInformation.existingLoan",
                    "IndividualInformation.customerCategory",
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
                    "Liabilities.liabilities.loanAmountInPaisa",
                    "Liabilities.liabilities.installmentAmountInPaisa",
                    "Liabilities.liabilities.startDate",
                    "Liabilities.liabilities.noOfInstalmentPaid",
                    "Liabilities.liabilities.frequencyOfInstallment",
                    "Liabilities.liabilities.udf1",
                    "Liabilities.liabilities.customerLiabilityRepayments",
                    "Liabilities.liabilities.customerLiabilityRepayments.emiNo",
                    "Liabilities.liabilities.customerLiabilityRepayments.emiAmount",
                    "Liabilities.liabilities.customerLiabilityRepayments.emiDueDate",
                    "Liabilities.liabilities.customerLiabilityRepayments.actualRepaymentDate",
                    "HouseVerification",
                    "HouseVerification.ownership",
                    "HouseVerification.inCurrentAddressSince",
                    "HouseVerification.distanceFromBranch",
                    "HouseVerification.monthlyRent",
                    "HouseVerification.previousRentDetails",
                    "CustomerDocumentUpload",
                    "CustomerDocumentUpload.customerDocuments",
                    "CustomerDocumentUpload.customerDocuments.fileType",
                    "CustomerDocumentUpload.customerDocuments.fileId",
                    "CustomerDocumentUpload.customerDocuments.documentDate",
                    "CustomerDocumentUpload.customerDocuments.udfDate1",
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
                    "ResidenceVerification.HouseVerificationPhoto",
                    "ResidenceVerification.remarksOnBusiness",
                    "PhysicalAssets",
                    "PhysicalAssets.physicalAssets",
                    "PhysicalAssets.physicalAssets.nameOfOwnedAsset",
                    "PhysicalAssets.physicalAssets.numberOfOwnedAsset",
                    "PhysicalAssets.physicalAssets.ownedAssetValue",
                    "CustomerLicenceDetails",
                    "CustomerLicenceDetails.customerLicenceDetails",
                    "CustomerLicenceDetails.customerLicenceDetails.licence1Type",
                    "CustomerLicenceDetails.customerLicenceDetails.licence1ValidFrom",
                    "CustomerLicenceDetails.customerLicenceDetails.licence1ValidTo",
                    // "TrackDetails",
                    // "TrackDetails.vehiclesOwned",
                    // "TrackDetails.vehiclesFinanced",
                    // "TrackDetails.vehiclesFree",
                    "EnterpriseReferences",
                    "EnterpriseReferences.verifications",
                    "EnterpriseReferences.verifications.referenceFirstName",
                    "EnterpriseReferences.verifications.knownSince",
                    "EnterpriseReferences.verifications.customerResponse",
                    "EnterpriseReferences.verifications.opinion",
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
                    "BankAccounts.customerBankAccounts.isDisbersementAccount"
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
                    var self = this;
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
                                            "latitude": "customer.latitude",
                                            "longitude": "customer.longitude",
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
                                        "HouseVerificationPhoto": {
                                            "key": "customer.houseVerificationPhoto",
                                            "title": "HOUSE VERIFICATION PHOTO",
                                            "orderNo": 150,
                                            "type": "file",
                                            "fileType": "image/*",
                                            "category": "CustomerEnrollment",
                                            "subCategory": "PHOTO",
                                            "onChange": function(){
                                                console.log("INSIDE ONCHANGE1");
                                            },
                                            "viewParams" : function(modelValue, form, model) {
                                                    getLocation().then((pos)=>{
                                                        console.log("successful");
                                                        model.customer.latitude = pos.coords.latitude;
                                                        model.customer.longitude = pos.coords.longitude;
                                                    });
                                                    getLocation().catch((err)=>{
                                                        console.log(err);
                                                    });
                                                }

                                            //     "title": "HOUSE_VERIFICATION_PHOTO",
                                            //     "category": "CustomerEnrollment",
                                            //     "subCategory": "PHOTO",
                                            //     "onChange": function(){
                                            //         console.log("INSIDE ONCHANGE1");
                                            //     },
                                            //     "viewParams" : function(modelValue, form, model) {
                                            //         getLocation().then((pos)=>{
                                            //             console.log("successful");
                                            //             model.customer.latitude = pos.coords.latitude;
                                            //             model.customer.longitude = pos.coords.longitude;
                                            //         });
                                            //         getLocation().catch((err)=>{
                                            //             console.log(err);
                                            //         });
                                            //     }

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
                                "IndividualInformation": {
                                    "items": {
                                        "customerCategory": {
                                            "key": "customer.customerCategory",
                                            "title": "CUSTOMER_CATEGORY",
                                            "type": "select",
                                            "enumCode": "lead_category",
                                            "orderNo": 85,
                                            "required":true
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
                                                      "type": "date"
                                                },
                                                "licence1ValidTo": {
                                                      "key": "customer.customerLicenceDetails[].licence1ValidTo",
                                                      "title": "LICENCE_VALID_TO",
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
                                    "condition": "model.customer.currentStage && (model.loanProcess.loanAccount.currentStage=='Screening' || model.loanProcess.loanAccount.currentStage=='Application' || model.loanProcess.loanAccount.currentStage=='FieldInvestigation1' || model.loanProcess.loanAccount.currentStage=='FieldInvestigation2' || model.loanProcess.loanAccount.currentStage=='FieldInvestigation3' || model.loanProcess.loanAccount.currentStage=='CreditAppraisal' || model.loanProcess.loanAccount.currentStage=='TeleVerification')",
                                    "orderNo": 1200,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "UPDATE_ENROLMENT",
                                            "onClick": "actions.proceed(model, formCtrl, form, $event)",
                                            "buttonType": "submit"
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
                              //      model.customer.existingLoan = 'YES';
                                } else {
                              //      model.customer.existingLoan = 'NO';
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
                                model.customer.latitude = obj.latitude;
                                model.customer.longitude = obj.longitude;

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
                        adharAndPanVAlidation(model.enrolmentProcess.customer,model);
                        // $q.all start
                        model.enrolmentProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                formHelper.resetFormValidityState(formCtrl);
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Customer Saved.', 5000);

                               BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: value.customer});
                                PageHelper.clearErrors();
                                //BundleManager.pushEvent()
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
                        //EnrollmentHelper.fixData(reqData);
                        adharAndPanVAlidation(model.enrolmentProcess.customer,model);
                        model.enrolmentProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (enrolmentProcess) {
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                                //BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: value.customer});
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
