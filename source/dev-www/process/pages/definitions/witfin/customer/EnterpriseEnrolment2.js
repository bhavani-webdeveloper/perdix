
irf.pageCollection.factory(irf.page("witfin.customer.EnterpriseEnrolment2"),
["$log", "$q","Enrollment","IrfFormRequestProcessor", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "$filter",
function($log, $q, Enrollment,IrfFormRequestProcessor, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager, $filter){

    var validateRequest = function(req){
        if (req.customer && req.customer.customerBankAccounts) {
            for (var i=0; i<req.customer.customerBankAccounts.length; i++){
                var bankAccount = req.customer.customerBankAccounts[i];
                if (bankAccount.accountNumber!=bankAccount.confirmedAccountNumber){
                    PageHelper.showProgress('validate-error', 'Bank Accounts: Account Number doesnt match with Confirmed Account Number', 5000);
                    return false;
                }
            }
        }
        return true;
    }

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
                    "enterpriseAssets.enterpriseAssets.subDetails",
                    "enterpriseAssets.enterpriseAssets.assetregistrationNumber",
                    "enterpriseAssets.enterpriseAssets.valueOfAsset"
            ];    
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

            if (_.hasIn(model, 'loanRelation')){
                console.log(model.loanRelation);
                var custId = model.loanRelation.customerId;
                Enrollment.getCustomerById({id:custId})
                    .$promise
                    .then(function(res){
                        model.customer = res;

                        if (model.customer.stockMaterialManagement) {
                        model.proxyIndicatorsHasValue = true;
                        $log.debug('PROXY_INDICATORS already has value');
                        }
                        
                        bundleModel.business = model.customer;

                         if(model.customer.enterprise.isGSTAvailable == null || model.customer.enterprise.isGSTAvailable == undefined){
                                     model.customer.enterprise.isGSTAvailable = "No";
                         }
                         if(model.customer.enterprise.isGSTAvailable == "Yes"){
                             model.customer.enterprise.companyRegistered = "YES";    
                         }

                        if(model.customer.enterpriseCustomerRelations)
                        {
                            var linkedIds = [];
                            for(i=0;i<model.customer.enterpriseCustomerRelations.length;i++) {
                                linkedIds.push(model.customer.enterpriseCustomerRelations[i].linkedToCustomerId);
                            };
                            
                            Queries.getCustomerBasicDetails({
                                "ids": linkedIds
                            }).then(function(result) {
                                if (result && result.ids) {
                                    for (var i = 0; i < model.customer.enterpriseCustomerRelations.length; i++) {
                                        var cust = result.ids[model.customer.enterpriseCustomerRelations[i].linkedToCustomerId];
                                        if (cust) {
                                            model.customer.enterpriseCustomerRelations[i].linkedToCustomerName = cust.first_name;
                                        }
                                    }
                                }
                            });
                        }
                        var actualCentre = $filter('filter')(allowedCentres, {id: model.customer.centreId}, true);
                        model.customer.centreName = actualCentre && actualCentre.length > 0 ? actualCentre[0].centreName : model.customer.centreName;
                        BundleManager.broadcastEvent('business-loaded', model.customer);
                        
                    }, function(httpRes){
                        PageHelper.showErrors(httpRes);
                    })
                    .finally(function(){
                        PageHelper.hideLoader();
                    })
            } else {
                model.customer = model.customer || {};
                 if (!_.hasIn(model.customer, 'enterprise') || model.customer.enterprise==null){
                     model.customer.enterprise = {};
                 }
                //model.branchId = SessionStore.getBranchId() + '';
                //model.customer.kgfsName = SessionStore.getBranch();
                model.customer.customerType = "Enterprise";
                var branch1 = formHelper.enum('branch_id').data;
                for (var i = 0; i < branch1.length; i++) {
                    if ((branch1[i].name) == SessionStore.getBranch()) {
                        model.customer.customerBranchId = branch1[i].value;
                        model.customer.kgfsName = branch1[i].name;
                    }
                }
                
                model.customer.centreId = centreName[0];
                model.customer.centreName = (allowedCentres && allowedCentres.length > 0) ? allowedCentres[0].centreName : "";
                model.customer.enterpriseCustomerRelations = model.customer.enterpriseCustomerRelations || [];
                model.customer.enterprise.isGSTAvailable = 'YES';
                model.customer.enterprise.companyRegistered = "YES";
            }   
            if (bundlePageObj){
                model._bundlePageObj = bundlePageObj;
            }
            this.form = IrfFormRequestProcessor.getFormDefinition('EnterpriseEnrollment2', formRequest);
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
            "new-applicant": function(bundleModel, model, params){
                $log.info("Inside new-applicant of EnterpriseEnrollment");

                var addToRelation = true;
                for (var i=0;i<model.customer.enterpriseCustomerRelations.length; i++){
                    if (model.customer.enterpriseCustomerRelations[i].linkedToCustomerId == params.customer.id) {
                        addToRelation = false;
                        break;
                    }
                }
                if (addToRelation){
                    var newLinkedCustomer = {
                        "linkedToCustomerId": params.customer.id,
                        "linkedToCustomerName": params.customer.firstName
                    };

                    model.customer.enterpriseCustomerRelations.push(newLinkedCustomer);    
                }
            },
            "lead-loaded": function(bundleModel, model, obj){
                $log.info(obj);
                            model.customer.mobilePhone = obj.mobileNo;
                            model.customer.gender = obj.gender;
                            model.customer.firstName = obj.businessName;
                            model.customer.maritalStatus=obj.maritalStatus;
                            model.customer.customerBranchId=obj.branchId;
                            model.customer.centreId=obj.centreId;
                            model.customer.centreName=obj.centreName;
                            model.customer.street=obj.addressLine2;
                            model.customer.doorNo=obj.addressLine1;
                            model.customer.pincode=obj.pincode;
                            model.customer.district=obj.district;
                            model.customer.state=obj.state;
                            model.customer.locality=obj.area;
                            model.customer.villageName=obj.cityTownVillage;
                            model.customer.landLineNo=obj.alternateMobileNo;
                            model.customer.dateOfBirth=obj.dob;
                            model.customer.age=obj.age;
                            model.customer.mobilePhone = obj.mobileNo;
                            model.customer.latitude =obj.location;
                            if (!_.hasIn(model.customer, 'enterprise') || model.customer.enterprise==null){
                                model.customer.enterprise = {};
                            }
                            model.customer.enterprise.ownership =obj.ownership;
                            model.customer.enterprise.companyOperatingSince =obj.companyOperatingSince;
                            model.customer.enterprise.companyRegistered =obj.companyRegistered;
                            model.customer.enterprise.businessType =obj.businessType;
                            model.customer.enterprise.businessActivity=obj.businessActivity;
                        },
            "new-co-applicant": function(bundleModel, model, params){
                $log.info("Inside new co-applicant of EnterpriseEnrollment");

                var addToRelation = true;
                for (var i=0;i<model.customer.enterpriseCustomerRelations.length; i++){
                    if (model.customer.enterpriseCustomerRelations[i].linkedToCustomerId == params.customer.id) {
                        addToRelation = false;
                        break;
                    }
                }
                if (addToRelation){
                    var newLinkedCustomer = {
                        "linkedToCustomerId": params.customer.id,
                        "linkedToCustomerName": params.customer.firstName
                    };

                    model.customer.enterpriseCustomerRelations.push(newLinkedCustomer);    
                }
            },
            "new-guarantor": function(bundleModel, model, params){
                $log.info("Inside new guarantor of EnterpriseEnrollment");

                var addToRelation = true;
                for (var i=0;i<model.customer.enterpriseCustomerRelations.length; i++){
                    if (model.customer.enterpriseCustomerRelations[i].linkedToCustomerId == params.customer.id) {
                        addToRelation = false;
                        break;
                    }
                }
                if (addToRelation){
                    var newLinkedCustomer = {
                        "linkedToCustomerId": params.customer.id,
                        "linkedToCustomerName": params.customer.firstName
                    };

                    model.customer.enterpriseCustomerRelations.push(newLinkedCustomer);    
                }
            },
            "origination-stage": function(bundleModel, model, obj){
                model.currentStage = obj
            },
            "remove-customer-relation": function(bundleModel, model, enrolmentDetails){
                $log.info("Inside remove-customer-relation of EnterpriseEnrolment2");
                /**
                 * Following to be Done
                 * 
                 * 1. Remove customer from Enterprise Customer Relation if exists.
                 */

                _.remove(model.customer.enterpriseCustomerRelations, function(relation){
                    return relation.linkedToCustomerId==enrolmentDetails.customerId;
                })
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
                $log.info("Inside save()");
                formCtrl.scope.$broadcast('schemaFormValidate');

                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                    return false;
                }
                if (model.customer.enterprise.isGSTAvailable === "YES"){
                    try
                    {
                        var count = 0;
                        for (var i = 0; i < model.customer.enterpriseRegistrations.length; i++) {
                            if (model.customer.enterpriseRegistrations[i].registrationType === "GST No" 
                                && model.customer.enterpriseRegistrations[i].registrationNumber != ""
                                && model.customer.enterpriseRegistrations[i].registrationNumber != null
                                ) {
                                count++;
                            }
                        }
                        if (count < 1) {
                            PageHelper.showProgress("enrolment","Since GST is applicable so please select Registration type GST No and provide Registration details ",9000);
                            return false;
                        }
                    }
                    catch(err){
                        console.error(err);
                    }
                }

                if (model.customer.enterprise.companyRegistered != "YES"){
                    try
                    {
                        delete model.customer.enterpriseRegistrations;
                    }
                    catch(err){
                        console.error(err);
                    }
                }

                var reqData = _.cloneDeep(model);
                EnrollmentHelper.fixData(reqData);

                if (!(validateRequest(reqData))){
                    return;
                }
                if (model.currentStage == 'ApplicationReview') {
                    PageHelper.showProgress("enrolment","Loan must be saved/updated for psychometric test", 6000);
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
                
                var sortFn = function(unordered){
                    var out = {};
                    Object.keys(unordered).sort().forEach(function(key) {
                        out[key] = unordered[key];
                    });
                    return out;
                };
                if (model.customer.enterprise.companyRegistered != "YES"){
                    try
                    {
                        delete model.customer.enterpriseRegistrations;
                    }
                    catch(err){
                        console.error(err);
                    }
                }

                if (model.customer.enterprise.isGSTAvailable === "YES"){
                    try
                    {
                        var count = 0;
                        for (var i = 0; i < model.customer.enterpriseRegistrations.length; i++) {
                            if (model.customer.enterpriseRegistrations[i].registrationType === "GST No" 
                                && model.customer.enterpriseRegistrations[i].registrationNumber != ""
                                && model.customer.enterpriseRegistrations[i].registrationNumber != null
                                && model.customer.enterpriseRegistrations[i].registeredDate != ""
                                && model.customer.enterpriseRegistrations[i].registeredDate != null) {
                                count++;
                            }
                        }
                        if (count < 1) {
                            PageHelper.showProgress("enrolment","Since GST is applicable so please select Registration type GST No and provide Registration details ",9000);
                            return false;
                        }
                    }
                    catch(err){
                        console.error(err);
                    }
                }

                if (model.currentStage == 'Application') {
                    if (model.customer.verifications.length<2){
                        PageHelper.showProgress("enrolment","minimum two references are mandatory",5000);
                        return false;
                    }
                }
                if (model.currentStage == 'ApplicationReview') {
                    PageHelper.showProgress("enrolment","Loan must be saved/updated for psychometric test", 6000);
                }
                if(model.currentStage=='ScreeningReview'){
                    var commercialCheckFailed = false;
                    if(model.customer.enterpriseBureauDetails && model.customer.enterpriseBureauDetails.length>0){
                        for (var i = model.customer.enterpriseBureauDetails.length - 1; i >= 0; i--) {
                            if(!model.customer.enterpriseBureauDetails[i].fileId
                                || !model.customer.enterpriseBureauDetails[i].bureau
                                || model.customer.enterpriseBureauDetails[i].doubtful==null 
                                || model.customer.enterpriseBureauDetails[i].loss==null 
                                || model.customer.enterpriseBureauDetails[i].specialMentionAccount==null 
                                || model.customer.enterpriseBureauDetails[i].standard==null 
                                || model.customer.enterpriseBureauDetails[i].subStandard==null){
                                commercialCheckFailed = true;
                                break;
                            }
                        }
                    }
                    else
                        commercialCheckFailed = true;
                    if(commercialCheckFailed && model.customer.customerBankAccounts && model.customer.customerBankAccounts.length>0){
                        for (var i = model.customer.customerBankAccounts.length - 1; i >= 0; i--) {
                            if(model.customer.customerBankAccounts[i].accountType == 'OD' || model.customer.customerBankAccounts[i].accountType == 'CC'){
                                PageHelper.showProgress("enrolment","Commercial bureau check fields are mandatory",5000);
                                return false;
                            }
                        }
                    }
                }
                var reqData = _.cloneDeep(model);
                EnrollmentHelper.fixData(reqData);

                if (!(validateRequest(reqData))){
                    return;
                }

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
}]);
