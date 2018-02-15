define(['perdix/domain/model/customer/EnrolmentProcess'], function(EnrolmentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];

    return {
        pageUID: "witfin.customer.EnterpriseEnrolment2",
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
                    "EnterpriseReferences",
                    "EnterpriseReferences.verifications",
                    "EnterpriseReferences.verifications.referenceFirstName",
                    "EnterpriseReferences.verifications.knownSince",
                    "EnterpriseReferences.verifications.customerResponse",
                    "EnterpriseReferences.verifications.opinion",
                    "Liabilities",
                    "Liabilities.liabilities",
                    "Liabilities.liabilities.loanType",
                    "Liabilities.liabilities.loanSourceCategory",
                    "Liabilities.liabilities.loanSource",
                    "Liabilities.liabilities.loanSource1",
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
                    "EnterpriseAssets",
                    "EnterpriseAssets.enterpriseAssets",
                    "EnterpriseAssets.enterpriseAssets.assetType",
                    "EnterpriseAssets.enterpriseAssets.endUse",
                    "EnterpriseAssets.enterpriseAssets.natureOfUse",
                    "EnterpriseAssets.enterpriseAssets.manufacturer",
                    "EnterpriseAssets.enterpriseAssets.make",
                    "EnterpriseAssets.enterpriseAssets.assetCategory",
                    "EnterpriseAssets.enterpriseAssets.vehicleMakeModel",
                    "EnterpriseAssets.enterpriseAssets.manufactureDate",
                    "EnterpriseAssets.enterpriseAssets.details",
                    "EnterpriseAssets.enterpriseAssets.subDetails",
                    "EnterpriseAssets.enterpriseAssets.assetregistrationNumber",
                    "EnterpriseAssets.enterpriseAssets.valueOfAsset",
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
                    "BankAccounts.customerBankAccounts.isDisbersementAccount"
                ];
            }

            var configFile = function() {
                return {
                        "loanProcess.loanAccount.currentStage": {
                            "Screening": {
                                "overrides": {
                                    "EnterpriseInformation": {
                                        "readonly": "true"
                                    },
                                    "Liabilities": {
                                        "readonly": "true"
                                    },
                                    "EnterpriseAssets": {
                                        "readonly": "true"
                                    }
                                },
                                "excludes": [
                                    "EnterpriseReferences"
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
                                    "Liabilities": {
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
                                },
                                "excludes": [
                                    "EnterpriseReferences"
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
                                    "Liabilities": {
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
                                    "EnterpriseReferences": {
                                        "readonly": true
                                    }
                                    
                                }
                            },
                            "BranchCreditAppraisal": {
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
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseReferences": {
                                        "readonly": true
                                    }
                                }
                            },
                            "HOCreditAppraisal": {
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
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseReferences": {
                                        "readonly": true
                                    }
                                }
                            },
                            "ManagementCommittee": {
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
                                    "EnterpriseAssets": {
                                        "readonly": true
                                    },
                                    "BankAccounts": {
                                        "readonly": true
                                    },
                                    "ContactInformation": {
                                        "readonly": true
                                    },
                                    "EnterpriseReferences": {
                                        "readonly": true
                                    }
                                }
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
                                    "Liabilities": {
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
                                    "EnterpriseReferences": {
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
                    var self = this;
                    p1.then(function(repo){
                        var formRequest = {
                            "overrides": {
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
                                "Liabilities.liabilities.liabilityLoanPurpose": {
                                    "type": "select",
                                    "enumCode": "loan_purpose_1"
                                },
                                "Liabilities.liabilities.loanSource1": {
                                    orderNo: 12
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
                                    "condition": "model.customer.liabilities[arrayIndex].loanSourceCategory == 'Bank/NBFC'"
                                },
                                "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosed": {
                                    "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                },
                                "EnterpriseInformation.enterpriseCustomerRelations.otherBusinessClosureDate": {
                                    "condition": "model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                                },
                                "EnterpriseAssets.enterpriseAssets.assetType": {
                                    "required": true
                                },
                                "EnterpriseAssets.enterpriseAssets.valueOfAsset": {
                                    "required": true
                                },
                                "EnterpriseAssets.enterpriseAssets.endUse": {
                                    "type": "select",
                                    "enumCode": "vehicle_end_use"
                                },
                                "BankAccounts.customerBankAccounts.isDisbersementAccount": {
                                    "type": "checkbox"
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
                                "EnterpriseAssets.enterpriseAssets": {
                                    startEmpty: true
                                },
                                "EnterpriseAssets.enterpriseAssets.subDetails": {
                                    "enumCode": "business_asset_sub_description",
                                    "parentEnumCode": "business_asset_description",
                                    "parentValueExpr": "model.customer.enterpriseAssets[arrayIndexes[0]].details"
                                },
                                "Liabilities.liabilities": {
                                    startEmpty: true
                                },
                                "EnterpriseInformation.enterpriseCustomerRelations.linkedToCustomerName" :{
                                    "readonly": true
                                },
                                "EnterpriseReferences": {
                                    "title": "NEIGHBOUR_CHECK",
                                    "condition" : "model.customer.enterprise.enterpriseType == 'Enterprise'"
                                },
                                "EnterpriseReferences.verifications.referenceFirstName": {
                                    "title":"NAME_OF_NEIGHBOUR"
                                },
                                "EnterpriseReferences.verifications.knownSince": {
                                    "title":"NEIGHBOUR_RECOGNIZE_BORROWER"
                                },
                                "EnterpriseReferences.verifications.customerResponse": {
                                    "title":"NEIGHBOUR_REFERENCE"
                                },
                                "EnterpriseReferences.verifications.opinion": {
                                    "title":"COMMENTS_OF_NEIGHBOUR"
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
                                                    "loanSource1": {
                                                        "condition": "model.customer.liabilities[arrayIndex].loanSourceCategory == 'Friends' ||  model.customer.liabilities[arrayIndex].loanSourceCategory == 'Relatives'",
                                                        "key": "customer.liabilities[].loanSource",
                                                        "title": "LOAN_SOURCE",
                                                        "readonly": true
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
                                        "type": "actionbox",
                                        "condition": "model.customer.currentStage && (model.loanProcess.loanAccount.currentStage=='Screening' || model.loanProcess.loanAccount.currentStage=='Application' || model.loanProcess.loanAccount.currentStage=='BranchCreditAppraisal')",
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
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
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
