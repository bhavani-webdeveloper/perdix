define(['perdix/domain/model/customer/EnrolmentProcess'], function(EnrolmentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];

    return {
        pageUID: "witfin.customer360.BusinessProfile",
        pageType: "Engine",
        dependencies: ["$log", "$q","Enrollment","IrfFormRequestProcessor", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "$filter", "$injector", "UIRepository"],

        $pageFn: function($log, $q, Enrollment,IrfFormRequestProcessor, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager, $filter, $injector, UIRepository) {

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
                    // "Liabilities",
                    // "Liabilities.liabilities",
                    // "Liabilities.liabilities.loanType",
                    // "Liabilities.liabilities.loanSource",
                    // "Liabilities.liabilities.loanAmountInPaisa",
                    // "Liabilities.liabilities.installmentAmountInPaisa",
                    // "Liabilities.liabilities.outstandingAmountInPaisa",
                    // "Liabilities.liabilities.startDate",
                    // "Liabilities.liabilities.maturityDate",
                    // "Liabilities.liabilities.noOfInstalmentPaid",
                    // "Liabilities.liabilities.frequencyOfInstallment",
                    // "Liabilities.liabilities.liabilityLoanPurpose",
                    // "Liabilities.liabilities.interestOnly",
                    // "Liabilities.liabilities.interestRate",
                    // "Liabilities.liabilities.proofDocuments",
                    "BusinessVerification",
                    "BusinessVerification.businessVerification",
                    "BusinessVerification.businessVerification.personMet",
                    "BusinessVerification.businessVerification.personName",
                    "BusinessVerification.businessVerification.noOfEmployeesWorking",
                    "BusinessVerification.businessVerification.noofYearsWorking",
                    "BusinessVerification.businessVerification.incomeEarnedPerMonth",
                    "BusinessVerification.businessVerification.localityType",
                    "BusinessVerification.businessVerification.areaInSqFt",
                    "EnterpriseAssets",
                    "EnterpriseAssets.enterpriseAssets",
                    "EnterpriseAssets.enterpriseAssets.assetType",
                    "EnterpriseAssets.enterpriseAssets.endUse",
                    "EnterpriseAssets.enterpriseAssets.natureOfUse",
                    "EnterpriseAssets.enterpriseAssets.manufacturer",
                    // "EnterpriseAssets.enterpriseAssets.make",
                    // "EnterpriseAssets.enterpriseAssets.assetCategory",
                    "EnterpriseAssets.enterpriseAssets.vehicleMakeModel",
                    "EnterpriseAssets.enterpriseAssets.manufactureDate",
                    // "EnterpriseAssets.enterpriseAssets.details",
                    // "EnterpriseAssets.enterpriseAssets.subDetails",
                    "EnterpriseAssets.enterpriseAssets.assetregistrationNumber",
                    "EnterpriseAssets.enterpriseAssets.valueOfAsset",
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
                    "BankAccounts",
                    "BankAccounts.customerBankAccounts",
                    "BankAccounts.customerBankAccounts.ifscCode",
                    "BankAccounts.customerBankAccounts.customerBankName",
                    "BankAccounts.customerBankAccounts.customerBankBranchName",
                    "BankAccounts.customerBankAccounts.customerNameAsInBank",
                    "BankAccounts.customerBankAccounts.accountNumber",
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
                    "TangibleNetWorth",
                    "TangibleNetWorth.enterpriseNetworth",
                    "TangibleNetWorth.enterpriseNetworth.tangibleNetworth",
                    "TangibleNetWorth.enterpriseNetworth.financialYear",
                    "CommercialCBCheck",
                    "CommercialCBCheck.enterpriseBureauDetails",
                    "CommercialCBCheck.enterpriseBureauDetails.bureau",
                    "CommercialCBCheck.enterpriseBureauDetails.fileId",
                    "CommercialCBCheck.enterpriseBureauDetails.doubtful",
                    "CommercialCBCheck.enterpriseBureauDetails.loss",
                    "CommercialCBCheck.enterpriseBureauDetails.specialMentionAccount",
                    "CommercialCBCheck.enterpriseRegistrations.standard",
                    "CommercialCBCheck.enterpriseRegistrations.subStandard",
                    "enterpriseDocuments",
                    "enterpriseDocuments.enterpriseDocuments",
                    "enterpriseDocuments.enterpriseDocuments.docType",
                    "enterpriseDocuments.enterpriseDocuments.fileId"
                ];
            }

            return {
                "type": "schema-form",
                "title": "BUSINESS_PROFILE",
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
                                "BankAccounts.customerBankAccounts.bankStatements":{
                                    "startEmpty": true
                                },
                                "ContactInformation": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'"
                                },
                                "BankAccounts": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'"
                                },
                                "EnterpriseInformation": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'"
                                },
                                "CommercialCBCheck": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'",
                                    "orderNo": 130,
                                },
                                "Liabilities": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'"
                                },
                                "IndividualReferences": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise' || model.customer.enterprise.enterpriseType.toLowerCase() == 'sole proprietorship'"
                                },
                                "TrackDetails": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise' || model.customer.enterprise.enterpriseType.toLowerCase() == 'sole proprietorship'"
                                },
                                "TangibleNetWorth": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'"
                                }, 
                                "EnterpriseAssets.enterpriseAssets.assetType": {
                                    "required": true,
                                    "enumCode": "type_of_vehicle"
                                },
                                "EnterpriseAssets.enterpriseAssets.manufactureDate":{
                                    "key":"customer.enterpriseAssets[].yearOfManufacture",
                                    "title":"YEAR_AND_MONTH_OF_MANUFACTURE"
                                },
                                "EnterpriseAssets.enterpriseAssets.valueOfAsset": {
                                    "required": true,
                                     "title": "PURCHASE_PRICE"
                                },
                                "EnterpriseAssets.enterpriseAssets.endUse": {
                                    "type": "select",
                                    "enumCode": "vehicle_end_use"
                                },
                                "EnterpriseInformation.enterpriseType": {
                                    "title": "ENTERPRISE_TYPE",
                                    "resolver": "SoleProprietorshipBusinessConfiguration",
                                    "titleMap": [
                                        {
                                            "name": "Individual",
                                            "value": "Sole Proprietorship"
                                        },
                                        {
                                            "name": "Company",
                                            "value": "Enterprise"
                                        }
                                    ]
                                }
                            },
                            "options": {
                                "repositoryAdditions": {"BusinessVerification": {
                                    "type": "box",
                                    "title": "BUSINESS_VERIFICATION",
                                    "orderNo": 1300,
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise' || model.customer.enterprise.enterpriseType.toLowerCase() == 'sole proprietorship'",
                                    "items": {
                                        "businessVerification": {
                                            "key": "customer.fieldInvestigationDetails",
                                            "type": "array",
                                            "add": null,
                                            "remove": null,
                                            "view": "fixed",
                                            //"startEmpty": true,
                                            "items": {
                                                "personMet": {
                                                    "key": "customer.fieldInvestigationDetails[].category",
                                                    "type": "select",
                                                    "title": "PERSON_MET",
                                                    "enumCode": "person_met",
                                                    "required": "true"
                                                },
                                                "personName": {
                                                    "key": "customer.fieldInvestigationDetails[].name",
                                                    "title": "PERSON_NAME",
                                                    "type": "text",
                                                    "required": "true",
                                                    "condition": "model.customer.fieldInvestigationDetails[0].category=='Business Partner' || model.customer.fieldInvestigationDetails[0].category == 'Others'"
                                                },
                                                "noOfEmployeesWorking": {
                                                    "key": "customer.enterprise.noOfRegularEmployees",
                                                    "title": "NO_OF_EMPLOYEES_WORKING",
                                                    "type": "number",
                                                    "inputmode": "number",
                                                    "required": "true"
                                                },
                                                "noofYearsWorking": {
                                                    "key": "customer.fieldInvestigationDetails[].yearsOfExperience",
                                                    "type": "select",
                                                    "title": "NO_OF_YEARS_WORKING",
                                                    "enumCode": "no_of_years_working",
                                                    "required": "true"
                                                },
                                                "incomeEarnedPerMonth": {
                                                    "key": "customer.fieldInvestigationDetails[].incomeEarned",
                                                    "title": "INCOME_EARNED_PER_MONTH",
                                                    "type": "number",
                                                    "inputmode": "number",
                                                    "numberType": "number",
                                                    "required": "true"
                                                },
                                                "localityType": {
                                                    "key": "customer.localityType",
                                                    "type": "select",
                                                    "title": "LOCALITY_TYPE",
                                                    "enumCode": "locality_type",
                                                    "required": "true"
                                                },
                                                "areaInSqFt": {
                                                    "key": "customer.enterprise.floorArea",
                                                    "type": "select",
                                                    "title": "AREA_IN_SQ_FT",
                                                    "enumCode": "area_in_sq_ft",
                                                    "required": "true"
                                                }
                                            }
                                        }
                                    }
                                },
                                    "EnterpriseAssets": {
                                        "type": "box",
                                        "title": "EXISTING_VEHICLE_DETAILS",
                                        "orderNo": 400,
                                        "items": {
                                            "enterpriseAssets": {
                                                "key": "customer.enterpriseAssets",
                                                "type": "array",
                                                "startEmpty": true,
                                                "title": "EXISTING_VEHICLE_DETAILS",
                                                "items": {
                                                    "natureOfUse": {
                                                        "orderNo": 20
                                                    },
                                                    "endUse": {
                                                        "orderNo": 30,
                                                        "condition":"model.customer.enterpriseAssets[arrayIndex].natureOfUse == 'Commmercial'"
                                                    },
                                                    "status":{
                                                        "orderNo": 140,
                                                        "title":"STATUS",
                                                        "type": "select",
                                                        "enumCode": "existing_vehicle_status",
                                                        "key":"customer.enterpriseAssets[].isHypothecated"   
                                                    },
                                                    "vehicleDocuments": {
                                                        "type": "fieldset",
                                                        "title": "VEHICLE_DOCUMENTS",
                                                        "view": "fixed",
                                                        "items": {
                                                            "rc":{
                                                                "orderNo": 150,
                                                                "title":"RC",
                                                                "type": "file",
                                                                "category": "CustomerEnrollment",
                                                                "subCategory": "PHOTO",
                                                                "key":"customer.enterpriseAssets[].udf1"
                                                            },
                                                            "insurance":{
                                                                "orderNo": 160,
                                                                "title":"INSURANCE",
                                                                "type": "file",
                                                                "category": "CustomerEnrollment",
                                                                "subCategory": "PHOTO",
                                                                "key":"customer.enterpriseAssets[].udf2"
                                                            },
                                                            "soa":{
                                                                "orderNo": 170,
                                                                "title":"SOA",
                                                                "type": "file",
                                                                "category": "CustomerEnrollment",
                                                                "subCategory": "PHOTO",
                                                                "key":"customer.enterpriseAssets[].udf3"
                                                            }
                                                        }
                                                    }     
                                            }
                                        }
                                    }
                                }
                                },
                                "additions": [{
                                    "orderNo": 1,   
                                    "type": "box",
                                    "title": "BUSINESS_SELECTION",
                                    "items":[
                                        "EnterpriseInformation.enterpriseType"
                                    ]
                                },
                                    {
                                        "type": "actionbox",
                                        "orderNo": 2000,
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
