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
                    "EnterpriseInformation.businessType",
                    "EnterpriseInformation.businessActivity",
                    "EnterpriseInformation.businessSector",
                    "EnterpriseInformation.businessSubsector",
                    "EnterpriseInformation.itrAvailable",
                    "EnterpriseInformation.enterpriseCustomerRelations",
                    "BusinessLiabilities",
                    "BusinessLiabilities.liabilities",
                    "BusinessLiabilities.liabilities.loanType",
                    "BusinessLiabilities.liabilities.loanSource",
                    "BusinessLiabilities.liabilities.loanAmountInPaisa",
                    "BusinessLiabilities.liabilities.installmentAmountInPaisa",
                    "BusinessLiabilities.liabilities.outstandingAmountInPaisa",
                    "BusinessLiabilities.liabilities.startDate",
                    "BusinessLiabilities.liabilities.maturityDate",
                    "BusinessLiabilities.liabilities.noOfInstalmentPaid",
                    "BusinessLiabilities.liabilities.frequencyOfInstallment",
                    "BusinessLiabilities.liabilities.liabilityLoanPurpose",
                    "BusinessLiabilities.liabilities.interestOnly",
                    "BusinessLiabilities.liabilities.interestRate",
                    "BusinessLiabilities.liabilities.proofDocuments",
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
                    "BankAccounts.customerBankAccounts.bankStatements",
                    "BankAccounts.customerBankAccounts.bankStatements.startMonth",
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.totalWithdrawals",
                    "BankAccounts.customerBankAccounts.bankStatements.balanceAsOn15th",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto"
                ];
            }

            var configFile = function() {
                return {
                        "currentStage": {
                            "Screening": {
                                "excludes": [
                                    "bankAccounts"
                                ]
                            },
                            "ScreeningReview": {
                                "excludes": [
                                    "bankAccounts"
                                ]
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
                                "EnterpriseInformation": {
                                    "condition": "model.customer.enterprise.enterpriseType=='Enterprise'"
                                },
                                "EnterpriseInformation.enterpriseType": {
                                    "title": "ENTERPRISE_TYPE",
                                    "resolver": "SoleProprietorshipBusinessConfiguration"
                                }
                            },
                            "includes": getIncludes(model),
                            "excludes": [],
                            "options": {
                                "additions": [
                                    {
                                        "type": "actionbox",
                                        "orderNo": 1000,
                                        "items": [
                                            {
                                                "type": "submit",
                                                "title": "SUBMIT"
                                            },
                                        ]
                                    },
                                    {
                                        "orderNo": 1,
                                        "type": "box",
                                        "title": "BUSINESS_SELECTION",
                                        "items":[
                                            {
                                                "condition": "model.loanProcess.applicantEnrolmentProcess.customer.id == null",
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
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();

                        model.enrolmentProcess.save()
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(){
                                model.loanProcess.refreshRelatedCustomers();
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                    },
                    proceed: function(model, form){

                    }

                }
            };
        }
    }
});
