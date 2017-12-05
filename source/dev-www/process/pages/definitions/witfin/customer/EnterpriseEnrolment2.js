define([], function() {

    return {
        pageUID: "witfin.customer.EnterpriseEnrolment2",
        pageType: "Engine",
        dependencies: ["$log", "$q","Enrollment","IrfFormRequestProcessor", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "$filter", "$injector"],

        $pageFn: function($log, $q, Enrollment,IrfFormRequestProcessor, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager, $filter, $injector) {

            var getIncludes = function (model) {
                return [
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
                    "enterpriseAssets",
                    "enterpriseAssets.enterpriseAssets",
                    "enterpriseAssets.enterpriseAssets.assetType",
                    "enterpriseAssets.enterpriseAssets.endUse",
                    "enterpriseAssets.enterpriseAssets.natureOfUse",
                    "enterpriseAssets.enterpriseAssets.manufacturer",
                    "enterpriseAssets.enterpriseAssets.make",
                    "enterpriseAssets.enterpriseAssets.assetCategory",
                    "enterpriseAssets.enterpriseAssets.vehicleMakeModel",
                    "enterpriseAssets.enterpriseAssets.manufactureDate",
                    "enterpriseAssets.enterpriseAssets.details",
                    "enterpriseAssets.enterpriseAssets.subDetails",
                    "enterpriseAssets.enterpriseAssets.assetregistrationNumber",
                    "enterpriseAssets.enterpriseAssets.valueOfAsset",
                    "bankAccounts",
                    "bankAccounts.customerBankAccounts",
                    "bankAccounts.customerBankAccounts.bankStatements",
                    "bankAccounts.customerBankAccounts.bankStatements.startMonth",
                    "bankAccounts.customerBankAccounts.bankStatements.totalDeposits",
                    "bankAccounts.customerBankAccounts.bankStatements.totalWithdrawals",
                    "bankAccounts.customerBankAccounts.bankStatements.balanceAsOn15th",
                    "bankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced",
                    "bankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced",
                    "bankAccounts.customerBankAccounts.bankStatements.bankStatementPhoto"

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
                    model.currentStage = bundleModel.currentStage;

                    var branch = SessionStore.getBranch();
                    var centres = SessionStore.getCentres();
                    var centreName = [];
                    var allowedCentres = [];
                    if (centres && centres.length) {
                        for (var i = 0; i < centres.length; i++) {
                            centreName.push(centres[i].id);
                            allowedCentres.push(centres[i]);
                        }
                    }

                    var self = this;
                    var formRequest = {
                        "overrides": "",
                        "includes": getIncludes(model),
                        "excludes": [
                            "",
                        ]
                    };


                    this.form = IrfFormRequestProcessor.getFormDefinition('EnterpriseEnrollment2', formRequest, configFile(), model);
                },
                offline: false,
                getOfflineDisplayItem: function(item, index){
                    return [
                        item.customer.firstName,
                        item.customer.centreId,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {},
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
                        $log.info("Inside save()");
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                            return false;
                        }

                        PageHelper.showProgress('enrolment','Saving..');
                        EnrollmentHelper.saveData(reqData).then(function(resp){
                            formHelper.resetFormValidityState(formCtrl);
                            PageHelper.showProgress('enrolment', 'Done.', 5000);
                            Utils.removeNulls(resp.customer, true);
                            model.customer = resp.customer;
                            if (model._bundlePageObj){
                                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                            }
                        }, function(httpRes){
                            PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                            PageHelper.showErrors(httpRes);
                        });
                    },
                    submit: function(model, form, formName){
                        $log.info("Inside submit()");
                        $log.warn(model);
                        PageHelper.showProgress('enrolment','Updating...', 2000);
                        EnrollmentHelper.proceedData(reqData).then(function(resp){
                            formHelper.resetFormValidityState(form);
                            PageHelper.showProgress('enrolmet','Done.', 5000);
                            Utils.removeNulls(resp.customer,true);
                            model.customer = resp.customer;
                            if (model._bundlePageObj){
                                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                            }
                        }, function(httpRes){
                            PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                            PageHelper.showErrors(httpRes);
                        });
                    }
                }
            };
        }
    }
});
