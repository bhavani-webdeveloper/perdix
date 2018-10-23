define([], function () {

    return {
        pageUID: "kgfs.loans.individual.booking.LoanBooking",
        pageType: "Engine",
        dependencies: ["$log", "$q", "LoanAccount", "LoanProcess", 'Scoring', 'Enrollment', 'EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
            'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor", "UIRepository", "$injector", "irfNavigator"
        ],

        $pageFn: function ($log, $q, LoanAccount, LoanProcess, Scoring, Enrollment, EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper, formHelper, elementsUtils,
            irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
            BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();
            var podiValue = SessionStore.getGlobalSetting("percentOfDisposableIncome");
            //PMT calculation
            var self;
            var getIncludes = function (model) {
                return [
                    "LoanDetails",
                    "LoanDetails.centreName",
                    "LoanDetails.loanType",
                    "LoanDetails.partner",
                    "LoanDetails.frequency",
                    "LoanDetails.loanProductCategory",
                    "LoanDetails.loanProductCode",
                    "LoanDetails.loanApplicationDate",
                    "LoanDetails.loanAmountRequested",
                    "LoanDetails.requestedTenure",
                    "LoanDetails.interestRate",
                    "LoanDetails.loanPurpose1",
                    "LoanDetails.loanPurpose2",
                    "LoanDetails.loanPurpose3",
                    "LoanDetails.borrowers",
                    "LoanDetails.borrowersFatherName",
                    "LoanDetails.borrowersHusbandName",
                    "LoanDetails.borrowersRelationship",
                    "LoanDetails.witnessDetails",
                    "LoanDetails.witnessDetails.witnessFirstName",
                    "LoanDetails.witnessDetails.witnessDOB",
                    "LoanDetails.witnessDetails.witnessRelationship",


                    "NomineeDetails",
                    "NomineeDetails.nominees",
                    "NomineeDetails.nominees.nomineeFirstName",
                    "NomineeDetails.nominees.nomineeGender",
                    "NomineeDetails.nominees.nomineeDOB",
                    "NomineeDetails.nominees.nomineeButton",
                    // "NomineeDetails.nominees.nomineeAddressSameasBorrower",
                    "NomineeDetails.nominees.nomineeDoorNo",
                    "NomineeDetails.nominees.nomineeLocality",
                    "NomineeDetails.nominees.nomineeStreet",
                    "NomineeDetails.nominees.nomineePincode",
                    "NomineeDetails.nominees.nomineeDistrict",
                    "NomineeDetails.nominees.nomineeState",
                    "NomineeDetails.nominees.nomineeRelationship",
                    "NomineeDetails.nominees.nomineeMinor",
                    "NomineeDetails.nominees.nomineeGuardian",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianFirstName",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianGender",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianDOB",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianDoorNo",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianLocality",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianStreet",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianPincode",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianDistrict",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianState",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianRelationship",

                    "JewelDetails",
                    "JewelDetails.jewelPouchNo",
                    "JewelDetails.ornamentDetails",
                    "JewelDetails.ornamentDetails.ornamentDescription",
                    "JewelDetails.ornamentDetails.stonDescription",
                    "JewelDetails.ornamentDetails.jewelDefects",
                    "JewelDetails.ornamentDetails.noOfArticles",
                    "JewelDetails.ornamentDetails.grossWeight",
                    "JewelDetails.ornamentDetails.netWeight",
                    "JewelDetails.ornamentDetails.carat",
                    "JewelDetails.ornamentDetails.rate",
                    "JewelDetails.ornamentDetails.marketValue",

                    "LoanSanction",
                    "LoanSanction.sanctionDate",
                    "LoanSanction.numberOfDisbursements",
                    "LoanSanction.scheduleDisbursementDate",
                    "LoanSanction.firstRepaymentDate",
                    "LoanSanction.customerSignatureDate",
                    "LoanSanction.disbursementSchedules",
                    "LoanSanction.disbursementSchedules.trancheNumber",
                    "LoanSanction.disbursementSchedules.disbursementAmount",
                    "LoanSanction.disbursementSchedules.tranchCondition"

                ]
            }
            var configFile = function (model) {
                return {
                    "loanProcess.loanAccount.currentStage": {
                        "LoanInitiation": {
                            "excludes": [],
                            "overrides": {
                                "LoanDetails": {
                                    "orderNo": 1
                                },
                                "LoanDetails.centreName": {
                                    "orderNo": 1,
                                    "type": "select",
                                    "enumCode": "centre"
                                },
                                "LoanDetails.loanType": {
                                    "orderNo": 2,
                                    "titleMap": [{
                                            value: "JEWEL",
                                            name: "Jewel Loan"
                                        },
                                        {
                                            value: "SECURED",
                                            name: "SECURED"
                                        },
                                        {
                                            value: "UNSECURED",
                                            name: "UNSECURED"
                                        }
                                    ]
                                },
                                "LoanDetails.partner": {
                                    "orderNo": 2,
                                    "enumCode": "partner"
                                },
                                "LoanDetails.frequency": {
                                    "enumCode": "loan_product_frequency"
                                },
                                "LoanDetails.loanProductCategory": {
                                    "orderNo": 4,
                                    "enumCode": "loan_product_category",
                                },
                                "LoanDetails.loanProductCode": {
                                    "orderNo": 4,
                                    bindMap: {
                                        "Partner": "loanAccount.partnerCode",
                                        // "ProductCategory": "loanAccount.productCategory",
                                        "Frequency": "loanAccount.frequency",
                                        "loanType": "loanAccount.loanType"
                                    },
                                    autolov: true,
                                    required: true,
                                    searchHelper: formHelper,
                                    search: function (inputModel, form, model, context) {

                                        return Queries.getLoanProductCodeByLoanType(model.loanAccount.productCategory, model.loanAccount.frequency, model.loanAccount.partnerCode, model.loanAccount.loanType);
                                    },
                                    onSelect: function (valueObj, model, context) {
                                        model.loanAccount.productCode = valueObj.productCode;
                                        model.additions.tenurePlaceHolder = valueObj.tenure_from + '-' + valueObj.tenure_to;
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.productCode
                                        ];
                                    },
                                    onChange: function (value, form, model) {
                                        // getProductDetails(value, model);
                                    },
                                },
                                "LoanDetails.interestRate":{
                                    "orderNo":6
                                },
                                "LoanDetails.loanPurpose1": {
                                    "orderNo": 6,
                                    "type": "lov",
                                    "autolov": true,
                                    "title": "LOAN_PURPOSE_1",
                                    bindMap: {},
                                    outputMap: {
                                        "purpose1": "loanAccount.loanPurpose1"
                                    },
                                    searchHelper: formHelper,
                                    search: function (inputModel, form, model) {
                                        if (model.loanAccount.productCode != null && model.siteCode != 'witfin')
                                            return Queries.getLoanPurpose1(model.loanAccount.productCode);
                                        else
                                            return Queries.getAllLoanPurpose1();
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.purpose1
                                        ];
                                    },
                                    onSelect: function (result, model, context) {
                                        model.loanAccount.loanPurpose2 = '';
                                    }
                                },
                                "LoanDetails.loanPurpose2": {
                                    "orderNo": 7,
                                    "title": "LOAN_PURPOSE_2",
                                    // title:"LOAN_PURPOSE_2",
                                    "type": "lov",
                                    bindMap: {},
                                    outputMap: {
                                        "purpose2": "loanAccount.loanPurpose2"
                                    },
                                    searchHelper: formHelper,
                                    search: function (inputModel, form, model) {
                                        if (model.loanAccount.productCode != null)
                                            return Queries.getLoanPurpose2(model.loanAccount.productCode, model.loanAccount.loanPurpose1);
                                        else
                                            return Queries.getAllLoanPurpose2(model.loanAccount.loanPurpose1);
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.purpose2
                                        ];
                                    },
                                    onSelect: function (result, model, context) {
                                        model.loanAccount.loanPurpose3 = '';
                                    }

                                },
                                "LoanDetails.loanPurpose3": {
                                    "orderNo": 8,
                                    "type": "lov",
                                    bindMap: {},
                                    outputMap: {
                                        "purpose3": "loanAccount.loanPurpose3"
                                    },
                                    searchHelper: formHelper,
                                    search: function (inputModel, form, model) {
                                        if (model.loanAccount.productCode != null)
                                            return Queries.getLoanPurpose3(model.loanAccount.productCode, model.loanAccount.loanPurpose1, model.loanAccount.loanPurpose2);
                                        else
                                            return Queries.getAllLoanPurpose3(model.loanAccount.loanPurpose1);
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.purpose3
                                        ];
                                    }
                                },
                                "LoanDetails.loanAmountRequested": {
                                    "orderNo": 5,
                                    onChange: function (value, form, model) {
                                        model.loanAccount.disbursementSchedules[0].disbursementAmount = value;
                                    }
                                },
                                "LoanDetails.loanApplicationDate": {
                                    "orderNo": 8
                                },
                                "LoanDetails.requestedTenure": {
                                    "orderNo": 6,
                                    "placeholderExpr": "model.additions.tenurePlaceHolder",
                                },
                                "LoanDetials.witnessDetails": {
                                    "type": "array",
                                    "view": "fixed"
                                },
                                "LoanDetails.witnessDetails.witnessFirstName": {
                                    "type": "lov",
                                    // "key": "model.LoanAccounts.witnessDetails[].witnessFirstName",
                                    searchHelper: formHelper,
                                    search: function (inputModel, form, model, context) {
                                        var out = [];
                                        if (!model.customer.familyMembers) {
                                            return out;
                                        }

                                        for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                            out.push({
                                                name: model.customer.familyMembers[i].familyMemberFirstName,
                                                dob: model.customer.familyMembers[i].dateOfBirth,
                                                relationship: model.customer.familyMembers[i].relationShip
                                            })
                                        }
                                        return $q.resolve({
                                            headers: {
                                                "x-total-count": out.length
                                            },
                                            body: out
                                        });
                                    },
                                    onSelect: function (valueObj, model, context) {
                                        //add to the witnees array.
                                        model.loanAccount.witnessFirstName = valueObj.name;
                                        model.loanAccount.witnessRelationship = valueObj.relationship;
                                        model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf3 = valueObj.dob;
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.name
                                        ];
                                    }
                                },
                                "LoanDetails.witnessDetails.witnessDOB": {
                                    "type": "date",
                                    "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf3"
                                },
                                "LoanDetails.witnessDetails.witnessRelationship": {
                                    "readonly": false,
                                    "require": false
                                },
                                "NomineeDetails": {
                                    "orderNo": 3
                                },
                                "JewelDetails": {
                                    "orderNo": 2,
                                    "condition": "model.loanAccount.loanType == 'JEWEL'"
                                },
                                "NomineeDetails.nominees.nomineeFirstName": {
                                    "orderNo": 1,
                                    "type": "lov",
                                    "title": "NAME",
                                    searchHelper: formHelper,
                                    search: function (inputModel, form, model, context) {
                                        var out = [];
                                        if (!model.customer.familyMembers) {
                                            return out;
                                        }

                                        for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                            out.push({
                                                name: model.customer.familyMembers[i].familyMemberFirstName,
                                                // value: model.customer.familyDetails[i].value,
                                                relationship: model.customer.familyMembers[i].relationShip,
                                                gender: model.customer.familyMembers[i].gender
                                            })
                                        }
                                        return $q.resolve({
                                            headers: {
                                                "x-total-count": out.length
                                            },
                                            body: out
                                        });
                                    },
                                    onSelect: function (valueObj, model, context) {
                                        //add to the witnees array.
                                        if (_.isUndefined(model.loanAccount.nominees[context.arrayIndex])) {
                                            model.loanAccount.nominees[context.arrayIndex] = [];
                                        }
                                        model.loanAccount.nominees[context.arrayIndex].nomineeFirstName = valueObj.name;
                                        model.loanAccount.nominees[context.arrayIndex].nomineeRelationship = valueObj.relationship;
                                        model.loanAccount.nominees[context.arrayIndex].nomineeGender = valueObj.gender;
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.name
                                        ];
                                    }

                                },
                                "NomineeDetails.nominees.nomineeDOB": {
                                    "orderNo": 2
                                },
                                "NomineeDetails.nominees.nomineeRelationship": {
                                    "readonly": true,
                                    "type": "text"
                                },
                                "NomineeDetails.nominees.nomineeGender": {
                                    "orderNo": 3,
                                    "readonly": true,
                                    "type": "text"
                                },
                                "NomineeDetails.nominees.nomineeDoorNo": {
                                    "orderNo": 4
                                },
                                "NomineeDetails.nominees.nomineeStreet": {
                                    "orderNo": 5,
                                },
                                "NomineeDetails.nominees.nomineePincode": {
                                    "orderNo": 6,
                                    fieldType: "number",
                                    autolov: true,
                                    inputMap: {
                                        "district": {
                                            key: "loanAccount.nominees[].nomineeDistrict"
                                        },
                                        "state": {
                                            key: "loanAccount.nominees[].nomineeState"
                                        },
                                        "pincode": {
                                            key: "loanAccount.nominees[].nomineePincode"
                                        }
                                    },
                                    outputMap: {
                                        "division": "loanAccount.nominees[arrayIndex].nomineeLocality",
                                        "pincode": "loanAccount.nominees[arrayIndex].nomineePincode",
                                        "district": "loanAccount.nominees[arrayIndex].nomineeDistrict",
                                        "state": "loanAccount.nominees[arrayIndex].nomineeState"
                                    },
                                    searchHelper: formHelper,
                                    // initialize: function(inputModel, form, model, context) {
                                    //     inputModel.pincode = model.loanAccount.nominees[context.arrayIndex].nomineePincode;
                                    // },
                                    search: function (inputModel, form, model, context) {
                                        return Queries.searchPincodes(
                                            inputModel.pincode || model.loanAccount.nominees[context.arrayIndex].nomineePincode,
                                            inputModel.district,
                                            inputModel.state
                                        );
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.division + ', ' + item.region,
                                            item.pincode,
                                            item.district + ', ' + item.state
                                        ];
                                    }
                                },
                                "NomineeDetails.nominees.nomineeGuardian": {

                                },
                                "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianFirstName": {
                                    "type": "lov",
                                    "title": "NAME",
                                    searchHelper: formHelper,
                                    search: function (inputModel, form, model, context) {
                                        var out = [];
                                        if (!model.customer.familyMembers) {
                                            return out;
                                        }

                                        for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                            out.push({
                                                name: model.customer.familyMembers[i].familyMemberFirstName,
                                                // value: model.customer.familyDetails[i].value,
                                                relationship: model.customer.familyMembers[i].relationShip,
                                                gender: model.customer.familyMembers[i].gender
                                            })
                                        }
                                        return $q.resolve({
                                            headers: {
                                                "x-total-count": out.length
                                            },
                                            body: out
                                        });
                                    },
                                    onSelect: function (valueObj, model, context) {
                                        //add to the witnees array.
                                        if (_.isUndefined(model.loanAccount.nominees[context.arrayIndex])) {
                                            model.loanAccount.nominees[context.arrayIndex] = [];
                                        }
                                        model.loanAccount.nominees[context.arrayIndex].guardianFirstName = valueObj.name;
                                        model.loanAccount.nominees[context.arrayIndex].guardianRelationWithMinor = "Relative";
                                        model.loanAccount.nominees[context.arrayIndex].guardianGender = valueObj.gender;
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.name
                                        ];
                                    }
                                },
                                "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianGender": {
                                    "readonly": true,
                                    "type": "text"
                                },
                                "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianRelationship": {
                                    "readonly": true,
                                    "type": "text"
                                },
                                "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianPincode": {
                                    autolov: true,
                                    inputMap: {
                                        "district": {
                                            key: "loanAccount.nominees[].guardianDistrict"
                                        },
                                        "state": {
                                            key: "loanAccount.nominees[].guardianState"
                                        },
                                        "pincode": {
                                            key: "loanAccount.nominees[].guardianPincode"
                                        }
                                    },
                                    outputMap: {
                                        "division": "loanAccount.nominees[arrayIndex].guardianLocality",
                                        "pincode": "loanAccount.nominees[arrayIndex].guardianPincode",
                                        "district": "loanAccount.nominees[arrayIndex].guardianDistrict",
                                        "state": "loanAccount.nominees[arrayIndex].guardianState"
                                    },
                                    searchHelper: formHelper,
                                    // initialize: function(inputModel, form, model, context) {
                                    //     inputModel.pincode = model.loanAccount.nominees[context.arrayIndex].guardianPincode;
                                    // },
                                    search: function (inputModel, form, model, context) {
                                        return Queries.searchPincodes(
                                            inputModel.pincode || model.loanAccount.nominees[context.arrayIndex].guardianPincode,
                                            inputModel.district,
                                            inputModel.state
                                        );
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.division + ', ' + item.region,
                                            item.pincode,
                                            item.district + ', ' + item.state
                                        ];
                                    }
                                },
                                "LoanSanction":{
                                    "condition": "model.loanAccount.id"
                                },
                                "LoanSanction.numberOfDisbursements": {
                                    
                                },
                                "LoanSanction.customerSignatureDate": {
                                    onChange: function (modelValue, form, model) {
                                        if (modelValue) {
                                            model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate = modelValue;
                                        }
                                    }
                                },
                                "LoanSanction.firstRepaymentDate": {
                                    onChange: function (value, form, model, event) {
                                        var repaymentDate = moment(model.loanAccount.firstRepaymentDate, SessionStore.getSystemDateFormat());
                                        var applicationDate = moment(model.loanAccount.loanApplicationDate, SessionStore.getSystemDateFormat());
                                        if (repaymentDate < applicationDate) {
                                            model.loanAccount.firstRepaymentDate = null;
                                            PageHelper.showProgress("loan-create", "Repayment date should be greater than Application date", 5000);
                                        }
                                    }

                                },
                                "LoanSanction.scheduleDisbursementDate": {
                                    onChange: function (value, form, model) {
                                        var repaymentDate = moment(model.loanAccount.firstRepaymentDate, SessionStore.getSystemDateFormat());
                                        var disbursementSchedules = moment(model.loanAccount.disbursementSchedules[form.arrayIndex].scheduledDisbursementDate, SessionStore.getSystemDateFormat());
                                        if (repaymentDate < disbursementSchedules) {
                                            // model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate = null;
                                            PageHelper.showProgress("loan-create", "Disbursement date should be lesser than Repayment date", 5000);
                                        }
                                    }
                                }
                            }
                        },
                        "DSCOverride": {
                            "excludes": [],
                            "overrides": {
                                "LoanDetails": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanDetails.frequency": {
                                    "enumCode": "loan_product_frequency"
                                },
                                "LoanDetails.loanProductCategory": {
                                    "enumCode": "loan_product_category",
                                },
                                "LoanDetails.loanType": {
                                    "orderNo": 2,
                                    "readonly": true,
                                    "titleMap": [{
                                            value: "JEWEL",
                                            name: "Jewel Loan"
                                        },
                                        {
                                            value: "SECURED",
                                            name: "SECURED"
                                        },
                                        {
                                            value: "UNSECURED",
                                            name: "UNSECURED"
                                        }
                                    ]
                                },
                                "LoanDetails.witnessDetails.witnessDOB": {
                                    "type": "date",
                                    "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf3"
                                },
                                "NomineeDetails": {
                                    "orderNo": 3,
                                    "readonly": true
                                },
                                "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianRelationship": {
                                    "readonly": true,
                                    "type": "text"
                                },
                                "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianGender": {
                                    "readonly": true,
                                    "type": "text"
                                },
                                "JewelDetails": {
                                    "orderNo": 2,
                                    "readonly": true,
                                    condition: "model.loanAccount.loanType == 'JEWEL'"
                                }
                            }
                        },
                        "DocumentUpload": {
                            "excludes": [],
                            "overrides": {
                                "LoanDetails": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanDetails.frequency": {
                                    "enumCode": "loan_product_frequency"
                                },
                                "LoanDetails.loanProductCategory": {
                                    "enumCode": "loan_product_category",
                                },
                                "LoanDetails.loanType": {
                                    "orderNo": 2,
                                    "readonly": true,
                                    "titleMap": [{
                                            value: "JEWEL",
                                            name: "Jewel Loan"
                                        },
                                        {
                                            value: "SECURED",
                                            name: "SECURED"
                                        },
                                        {
                                            value: "UNSECURED",
                                            name: "UNSECURED"
                                        }
                                    ]
                                },
                                "LoanDetails.witnessDetails.witnessDOB": {
                                    "type": "date",
                                    "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf3"
                                },
                                "NomineeDetails": {
                                    "orderNo": 3,
                                    "readonly": true
                                },
                                "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianRelationship": {
                                    "readonly": true,
                                    "type": "text"
                                },
                                "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianGender": {
                                    "readonly": true,
                                    "type": "text"
                                },

                                "JewelDetails": {
                                    "orderNo": 2,
                                    "readonly": true,
                                    condition: "model.loanAccount.loanType == 'JEWEL'"
                                }
                            }
                        },
                        "Checker1": {
                            "excludes": [],
                            "overrides": {
                                "LoanDetails": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanDetails.frequency": {
                                    "enumCode": "loan_product_frequency"
                                },
                                "LoanDetails.loanProductCategory": {
                                    "enumCode": "loan_product_category",
                                },
                                "LoanDetails.loanType": {
                                    "orderNo": 2,
                                    "readonly": true,
                                    "titleMap": [{
                                            value: "JEWEL",
                                            name: "Jewel Loan"
                                        },
                                        {
                                            value: "SECURED",
                                            name: "SECURED"
                                        },
                                        {
                                            value: "UNSECURED",
                                            name: "UNSECURED"
                                        }
                                    ]
                                },
                                "LoanDetails.witnessDetails.witnessDOB": {
                                    "type": "date",
                                    "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf3"
                                },
                                "NomineeDetails": {
                                    "orderNo": 3,
                                    "readonly": true
                                },
                                "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianRelationship": {
                                    "readonly": true,
                                    "type": "text"
                                },
                                "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianGender": {
                                    "readonly": true,
                                    "type": "text"
                                },

                                "JewelDetails": {
                                    "orderNo": 2,
                                    "readonly": true,
                                    condition: "model.loanAccount.loanType == 'JEWEL'"
                                }
                            }
                        },
                        "Checker2": {
                            "excludes": [],
                            "overrides": {
                                "LoanDetails": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanDetails.frequency": {
                                    "enumCode": "loan_product_frequency"
                                },
                                "LoanDetails.loanProductCategory": {
                                    "enumCode": "loan_product_category",
                                },
                                "LoanDetails.loanType": {
                                    "orderNo": 2,
                                    "readonly": true,
                                    "titleMap": [{
                                            value: "JEWEL",
                                            name: "Jewel Loan"
                                        },
                                        {
                                            value: "SECURED",
                                            name: "SECURED"
                                        },
                                        {
                                            value: "UNSECURED",
                                            name: "UNSECURED"
                                        }
                                    ]
                                },
                                "LoanDetails.witnessDetails.witnessDOB": {
                                    "type": "date",
                                    "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf3"
                                },
                                "NomineeDetails": {
                                    "orderNo": 3,
                                    "readonly": true
                                },
                                "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianRelationship": {
                                    "readonly": true,
                                    "type": "text"
                                },
                                "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianGender": {
                                    "readonly": true,
                                    "type": "text"
                                },

                                "JewelDetails": {
                                    "orderNo": 2,
                                    "readonly": true,
                                    condition: "model.loanAccount.loanType == 'JEWEL'"
                                }
                            }
                        }
                    }
                }
            }
            var overridesFields = function (model) {
                return {

                }
            }

            return {
                "type": "schema-form",
                "title": "LOAN_REQUEST",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // AngularResourceService.getInstance().setInjector($injector);
                    console.log("test");
                    console.log(model);
                    var familyDetails = [];
                    model.customer = {};
                    model.additions = {};
                    model.loanAccount = model.loanProcess.loanAccount;
                    model.loanAccount.bcAccount = {};
                    model.loanAccount.processType = "1";
                    if (typeof model.loanAccount.accountUserDefinedFields == "undefined") {
                        model.loanAccount.accountUserDefinedFields = {};
                        model.loanAccount.accountUserDefinedFields.userDefinedFieldValues = {};
                    }
                    model.loanAccount.remarksHistory = null;
                    if (typeof model.loanAccount.customerId != "undefined") {
                        $q.when(Enrollment.get({
                            'id': model.loanAccount.customerId
                        })).then(function (resp) {
                            model.customer = resp;
                        })
                    }
                    if (model.loanAccount && model.loanAccount.id) {
                        PageHelper.showLoader();
                        IndividualLoan.loanRemarksSummary({
                            id: model.loanAccount.id
                        }).$promise.then(function (resp) {
                            model.loanAccount.remarksHistory = resp;

                            console.log("resposne for CheckerHistory");
                            console.log(model);
                        }).finally(PageHelper.hideLoader);

                    }


                    BundleManager.broadcastEvent('loan-account-loaded', {
                        loanAccount: model.loanAccount
                    });

                    /* Deviations and Mitigations grouping */
                    if (_.hasIn(model.loanAccount, 'loanMitigants') && _.isArray(model.loanAccount.loanMitigants)) {
                        var loanMitigantsGrouped = {};
                        for (var i = 0; i < model.loanAccount.loanMitigants.length; i++) {
                            var item = model.loanAccount.loanMitigants[i];
                            if (!_.hasIn(loanMitigantsGrouped, item.parameter)) {
                                loanMitigantsGrouped[item.parameter] = [];
                            }
                            loanMitigantsGrouped[item.parameter].push(item);
                        }
                        model.loanMitigantsByParameter = [];
                        _.forOwn(loanMitigantsGrouped, function (mitigants, key) {
                            var chosenMitigants = "<ul>";

                            for (var i = 0; i < mitigants.length; i++) {
                                chosenMitigants = chosenMitigants + "<li>" + mitigants[i].mitigant + "</li>";
                            }
                            chosenMitigants = chosenMitigants + "</ul>";
                            model.loanMitigantsByParameter.push({
                                'Parameter': key,
                                'Mitigants': chosenMitigants
                            })
                        })
                    }
                    /* End of Deviations and Mitigations grouping */
                    if (model.loanAccount.loanApplicationDate == "undefined" || model.loanAccount.loanApplicationDate == "" || model.loanAccount.loanApplicationDate == null) {
                        model.loanAccount.loanApplicationDate = SessionStore.getCBSDate()
                    }
                    if (model.loanAccount.sanctionDate == "undefined" || model.loanAccount.sanctionDate == "" || model.loanAccount.sanctionDate == null) {
                        model.loanAccount.sanctionDate = SessionStore.getCBSDate()
                    }
                    if (model.loanAccount.numberOfDisbursements == "undefined" || model.loanAccount.numberOfDisbursements == "" || model.loanAccount.numberOfDisbursements == null) {
                        model.loanAccount.numberOfDisbursements = 1;
                        model.loanAccount.disbursementSchedules = [];
                        model.loanAccount.disbursementSchedules.push({
                            trancheNumber  : 1
                        })
                    }
                    model.loanAccount.securityEmiRequired = "No"

                    self = this;
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;
                    p1.then(function (repo) {
                            console.log("Text");
                            // console.log(repo);                       
                            var formRequest = {
                                "overrides": overridesFields(model),
                                "includes": getIncludes(model),
                                "excludes": [],
                                "options": {
                                    "repositoryAdditions": {
                                        "LoanDetails": {
                                            "orderNo": 7,
                                            "items": {
                                                "borrowers": {
                                                    "title": "BORROWERS",
                                                    "type": "radios",
                                                    "orderNo": 8,
                                                    "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4",
                                                    "titleMap": [{
                                                            value: "Father",
                                                            name: "Father"
                                                        },
                                                        {
                                                            value: "Husband",
                                                            name: "Husband"
                                                        }
                                                    ],
                                                    onChange: function (valueObj, form, model) {
                                                        if (typeof model.customer.familyMembers != "undefined") {
                                                            if (model.customer.familyMembers.length > 0) {
                                                                for (i = 0; i < model.customer.familyMembers.length; i++) {
                                                                    if (model.customer.familyMembers[i].relationShip == valueObj) {
                                                                        model.loanAccount.husbandOrFatherFirstName = model.customer.familyMembers[i].familyMemberFirstName;
                                                                    } else {
                                                                        model.loanAccount.husbandOrFatherFirstName = null;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                "borrowersHusbandName": {
                                                    "orderNo": 9,
                                                    "title": "HUSBAND_NAME",
                                                    "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4 == 'Husband'",
                                                    "type": "text",
                                                    "key": "loanAccount.husbandOrFatherFirstName",
                                                },
                                                "borrowersFatherName": {
                                                    "orderNo": 9,
                                                    "title": "FATHER_NAME",
                                                    "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4 == 'Father'",
                                                    "type": "text",
                                                    "key": "loanAccount.husbandOrFatherFirstName"
                                                },
                                                "borrowersRealtionship": {
                                                    "title": "RELATIONSHIP",

                                                    "type": "text",
                                                    "readonly": true,
                                                    "key": "yet to decide",
                                                }

                                            }

                                        },
                                        "LoanSanction": {
                                            "key": "loanAccount.disbursementSchedules",
                                            "items": {
                                                "scheduleDisbursementDate": {
                                                    "key": "loanAccount.disbursementSchedules[0].scheduledDisbursementDate",
                                                    "title": "SCHEDULE_DISBURSMENT_DATE",
                                                    "type": "date"
                                                },
                                                "firstRepaymentDate": {
                                                    "key": "loanAccount.firstRepaymentDate",
                                                    "type": "date",
                                                    "title": "FIRST_REPAYMENT_DATE"
                                                },
                                                "customerSignatureDate": {
                                                    "key": "loanAccount.disbursementSchedules[0].customerSignatureDate",
                                                    "type": "date",
                                                    "title": "CUSTOMER_SIGNATURE_DATE"
                                                }
                                            }
                                        },

                                        "NomineeDetails": {
                                            "items": {
                                                "nominees": {
                                                    "items": {
                                                        "nomineeAddressSameasBorrower": {
                                                            "type": "checkbox",
                                                            "title": "ADDRESS_SAME_AS_BORROWER",
                                                            "schema": {
                                                                "type": ["boolean", "null"]
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }




                                    },
                                    "additions": [{
                                            "title": "REMARKS_HISTORY",
                                            "type": "box",
                                            "orderNo": 10,
                                            condition: "model.loanAccount.remarksHistory && model.loanAccount.remarksHistory.length > 0",
                                            "items": [{
                                                "key": "loanAccount.remarksHistory",
                                                "type": "array",
                                                "view": "fixed",
                                                add: null,
                                                remove: null,
                                                "items": [{
                                                    "type": "section",
                                                    "htmlClass": "",
                                                    "html": '<i class="fa fa-user text-gray">&nbsp;</i> {{model.loanAccount.remarksHistory[arrayIndex].userId}}\
                                                    <br><i class="fa fa-clock-o text-gray">&nbsp;</i> {{model.loanAccount.remarksHistory[arrayIndex].createdDate}}\
                                                    <br><i class="fa fa-commenting text-gray">&nbsp;</i> <strong>{{model.loanAccount.remarksHistory[arrayIndex].remarks}}</strong>\
                                                    <br><i class="fa fa-pencil-square-o text-gray">&nbsp;</i>{{model.loanAccount.remarksHistory[arrayIndex].stage}}-{{model.loanAccount.remarksHistory[arrayIndex].action}}<br>'
                                                }]
                                            }]
                                        },
                                        {
                                            "type": "box",
                                            "title": "POST_REVIEW",
                                            condition: "model.loanAccount.currentStage != 'DocumentUpload' && model.loanAccount.id ",
                                            "items": [{
                                                    key: "review.action",
                                                    condition: "model.currentStage == 'PendingForPartner' && model.loanHoldRequired!='NO'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "SEND_BACK": "SEND_BACK",
                                                        "PROCEED": "PROCEED",
                                                        "HOLD": "HOLD"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.currentStage == 'LoanInitiation' && model.loanHoldRequired!='NO'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "PROCEED": "PROCEED",
                                                        "HOLD": "HOLD"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.currentStage == 'PendingForPartner' && model.siteCode=='YES'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "SEND_BACK": "SEND_BACK",
                                                        "PROCEED": "PROCEED"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.currentStage == 'LoanInitiation'&& model.siteCode=='YES'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "PROCEED": "PROCEED"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.loanAccount.currentStage == 'LoanInitiation'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "PROCEED": "PROCEED"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.loanAccount.currentStage != 'DocumentUplaod' && model.loanAccount.currentStage !='LoanInitiation'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "PROCEED": "PROCEED",
                                                        "SEND_BACK": "SEND_BACK",
                                                    }
                                                },
                                                {
                                                    type: "section",
                                                    condition: "model.review.action=='REJECT'",
                                                    items: [{
                                                            title: "REMARKS",
                                                            key: "review.remarks",
                                                            type: "textarea",
                                                            required: true
                                                        },
                                                        {
                                                            key: "loanAccount.rejectReason",
                                                            type: "lov",
                                                            autolov: true,
                                                            title: "REJECT_REASON",
                                                            bindMap: {},
                                                            searchHelper: formHelper,
                                                            search: function (inputModel, form, model, context) {
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
                                                            onSelect: function (valueObj, model, context) {
                                                                model.loanAccount.rejectReason = valueObj.name;
                                                            },
                                                            getListDisplayItem: function (item, index) {
                                                                return [
                                                                    item.name
                                                                ];
                                                            }
                                                        },

                                                        {
                                                            key: "review.rejectButton",
                                                            type: "button",
                                                            title: "REJECT",
                                                            required: true,
                                                            onClick: "actions.reject(model, formCtrl, form, $event)"
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: "section",
                                                    condition: "model.review.action=='HOLD'",
                                                    items: [{
                                                            title: "REMARKS",
                                                            key: "review.remarks",
                                                            type: "textarea",
                                                            required: true
                                                        },
                                                        {
                                                            key: "review.holdButton",
                                                            type: "button",
                                                            title: "HOLD",
                                                            required: true,
                                                            onClick: "actions.holdButton(model, formCtrl, form, $event)"
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: "section",
                                                    condition: "model.review.action=='SEND_BACK'",
                                                    items: [{
                                                            title: "REMARKS",
                                                            key: "review.remarks",
                                                            type: "textarea",
                                                            required: true
                                                        },
                                                        {
                                                            key: "review.targetStage",
                                                            required: true,
                                                            type: "lov",
                                                            autolov: true,
                                                            lovonly: true,
                                                            title: "SEND_BACK_TO_STAGE",
                                                            bindMap: {},
                                                            searchHelper: formHelper,
                                                            search: function (inputModel, form, model, context) {
                                                                var stage1 = model.loanAccount.currentStage;
                                                                var booking_target_stage = formHelper.enum('booking_target_stage').data;
                                                                var out = [];
                                                                for (var i = 0; i < booking_target_stage.length; i++) {
                                                                    var t = booking_target_stage[i];
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
                                                            onSelect: function (valueObj, model, context) {
                                                                model.review.targetStage = valueObj.name;
                                                                model.loanProcess.stage = valueObj.value;
                                                            },
                                                            getListDisplayItem: function (item, index) {
                                                                return [
                                                                    item.name
                                                                ];
                                                            }
                                                        },
                                                        {
                                                            key: "review.sendBackButton",
                                                            type: "button",
                                                            title: "SEND_BACK",
                                                            onClick: "actions.sendBack(model, formCtrl, form, $event)"
                                                        }
                                                    ]
                                                },

                                                {
                                                    type: "section",
                                                    condition: "model.review.action=='PROCEED'",
                                                    items: [{
                                                            title: "REMARKS",
                                                            key: "review.remarks",
                                                            type: "textarea",
                                                            required: true
                                                        },
                                                        {
                                                            key: "review.proceedButton",
                                                            type: "button",
                                                            title: "PROCEED",
                                                            onClick: "actions.proceed(model, formCtrl, form, $event)"
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "type": "actionbox",
                                            condition: "model.loanAccount.currentStage == 'LoanInitiation'",
                                            "items": [{
                                                "type": "submit",
                                                "title": "SAVE"
                                            }, ]
                                        }
                                    ]
                                }
                            };
                            var result = IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model);
                            console.log(result);
                            console.log("test");
                            return result;
                        })
                        .then(function (form) {
                            self.form = form;
                        });
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                    return [
                        item.customer.firstName,
                        item.customer.centreCode,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "new-applicant": function (bundleModel, model, obj) {
                        model.customer = obj.customer;
                        model.loanAccount.customerId = model.customer.id;
                        // $q.when(Enrollment.get({
                        //     'id': model.loanAccount.customerId
                        // })).then(function (resp) {
                        //     model.customer = resp;
                        // })
                    },
                    "dsc-response": function(bundleModel,model,obj){
                        model.loanAccount.loanCustomerRelations = obj;
                    },
                    "lead-loaded": function (bundleModel, model, obj) {
                        model.lead = obj;
                        model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                        model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                        model.loanAccount.screeningDate = obj.screeningDate;
                    },
                    "new-business": function (bundleModel, model, params) {
                        $log.info("Inside new-business of LoanRequest");
                        model.loanAccount.customerId = params.customer.id;
                        model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                        model.loanAccount.loanCentre.branchId = params.customer.customerBranchId;
                        model.loanAccount.loanCentre.centreId = params.customer.centreId;
                        model.enterprise = params.customer;
                    },
                    "load-deviation": function (bundleModel, model, params) {
                        $log.info("Inside Deviation List");
                        model.deviations = {};
                        model.deviations.deviationParameter = [];
                        model.deviations.deviationParameter = params.deviations.deviationParameter;
                        model.deviations.scoreName = params.deviations.scoreName;

                        if (_.isArray(model.deviations.deviationParameter)) {
                            _.forEach(model.deviations.deviationParameter, function (deviation) {
                                if (_.hasIn(deviation, 'ChosenMitigants') && _.isArray(deviation.ChosenMitigants)) {
                                    _.forEach(deviation.ChosenMitigants, function (mitigantChosen) {
                                        for (var i = 0; i < deviation.mitigants.length; i++) {
                                            if (deviation.mitigants[i].mitigantName == mitigantChosen) {
                                                deviation.mitigants[i].selected = true;
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                },
                form: [{
                    "title": "REMARKS_HISTORY",
                    "type": "box",
                    condition: "model.loanAccount.remarksHistory && model.loanAccount.remarksHistory.length > 0",
                    "items": [{
                        "key": "loanAccount.remarksHistory",
                        "type": "array",
                        "view": "fixed",
                        add: null,
                        remove: null,
                        "items": [{
                            "type": "section",
                            "htmlClass": "",
                            "html": '<i class="fa fa-user text-gray">&nbsp;</i> {{model.loanAccount.remarksHistory[arrayIndex].updatedBy}}\
                            <br><i class="fa fa-clock-o text-gray">&nbsp;</i> {{model.loanAccount.remarksHistory[arrayIndex].updatedOn}}\
                            <br><i class="fa fa-commenting text-gray">&nbsp;</i> <strong>{{model.loanAccount.remarksHistory[arrayIndex].remarks}}</strong>\
                            <br><i class="fa fa-pencil-square-o text-gray">&nbsp;</i>{{model.loanAccount.remarksHistory[arrayIndex].stage}}-{{model.loanAccount.remarksHistory[arrayIndex].action}}<br>'
                        }]
                    }]
                }, ],
                schema: function () {
                    console.log("First thing to excecute I guess");
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {
                    submit: function (model, formCtrl, form) {
                        /* Loan SAVE */
                        console.log("Model from Submit from LoanBooking ");
                        console.log(model);
                        if (typeof model.loanAccount.loanAmount != "undefined") {
                            model.loanAccount.loanAmountRequested = model.loanAccount.loanAmount;
                        }
                        if (typeof model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4 != "undefined") {
                            if (typeof model.loanAccount.husbandOrFatherFirstName == "undefined" || model.loanAccount.husbandOrFatherFirstName == null) {
                                model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4 = null;
                            }
                        }
                        if (!model.loanAccount.id) {
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                BundleManager.pushEvent('new-loan', model._bundlePageObj, {
                                    loanAccount: model.loanAccount
                                });
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);

                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.hideLoader();
                            });

                    },
                    holdButton: function (model, formCtrl, form, $event) {
                        $log.info("Inside save()");
                        if (!model.loanAccount.id) {
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
                    sendBack: function (model, formCtrl, form, $event) {
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
                    proceed: function (model, formCtrl, form, $event) {
                        PageHelper.showProgress('enrolment', 'Updating Loan');
                        if(model.loanAccount.currentStage=='Checker2'){
                            model.loanProcess.stage='Completed';
                        }
                        var toStage=model.loanProcess.stage||'';
                        model.loanProcess.proceed(toStage)
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
                    reject: function (model, formCtrl, form, $event) {
                        if (PageHelper.isFormInvalid(formCtrl)) {
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
                }
            };

        }
    }
});
