define(['perdix/domain/model/insurance/InsuranceProcess'], function (InsuranceProcess) {
     InsuranceProcess = InsuranceProcess['InsuranceProcess'];   
    return {
        pageUID: "insurance.Registration",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams","Insurance", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator"],

        $pageFn: function ($log, $state, $stateParams, Insurance,SessionStore, formHelper, $q,
                           PageHelper, Utils, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator) {

              var configFile = function () {
                return {
                }
            }
var idPresent = false;
var getIncludes = function (model) {

                return [
                    "InsurancePolicyInformation",
                    "InsurancePolicyInformation.annuacomelIn",
                    "InsurancePolicyInformation.assetValue",
                    //"InsurancePolicyInformation.source",
                    "InsurancePolicyInformation.bankId",
                    "InsurancePolicyInformation.benificieryFamilyMemberId",
                    "InsurancePolicyInformation.benificieryName",
                    "InsurancePolicyInformation.benificieryRelationship",
                    "InsurancePolicyInformation.branchId",
                    "InsurancePolicyInformation.centreId",
                    "InsurancePolicyInformation.certificateNo",
                    "InsurancePolicyInformation.contactNumber",
                    "InsurancePolicyInformation.currentStage",
                    "InsurancePolicyInformation.customerId",
                    "InsurancePolicyInformation.dateOfBirth",
                    "InsurancePolicyInformation.district",
                    "InsurancePolicyInformation.dscId",
                    "InsurancePolicyInformation.fullName",
                    "InsurancePolicyInformation.gender",
                    "InsurancePolicyInformation.insuranceType",
                    "InsurancePolicyInformation.leadId",
                    "InsurancePolicyInformation.maturityDate",
                    "InsurancePolicyInformation.occupation",
                    "InsurancePolicyInformation.parentPolicyNumber",
                    "InsurancePolicyInformation.partnerCode",
                    "InsurancePolicyInformation.pincode",
                    "InsurancePolicyInformation.policyNumber",
                    "InsurancePolicyInformation.premiumRateCode",
                    "InsurancePolicyInformation.productCode",
                    "InsurancePolicyInformation.purchaseDate",
                    "InsurancePolicyInformation.recommendationAmount",
                    "InsurancePolicyInformation.recommendationOverride",
                    "InsurancePolicyInformation.recommendationRemarks",
                    "InsurancePolicyInformation.remarks",
                    "InsurancePolicyInformation.startDate",
                    "InsurancePolicyInformation.state",
                    "InsurancePolicyInformation.status",
                    "InsurancePolicyInformation.sumInsured",
                    "InsurancePolicyInformation.tenureInYears",
                    "InsurancePolicyInformation.urnNo",
                    "InsurancePolicyInformation.insuranceRecommendations",
                    


                    "InsuranceNomineeDetails",
                    "InsuranceNomineeDetails.nomineeDetailsDTO",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.nomineeName",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.nomineeRelationship",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.nomineeGender",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.nomineeIsMinor",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.nomineeMinorDob",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.gauridianName",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.gauridianMinorRelationship",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.gauridianGender",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.nomineePercentage",

                    "InsuranceTransactionDetails",
                    "InsuranceTransactionDetails.insuranceTransactionDetailsDTO",
                    "InsuranceTransactionDetails.insuranceTransactionDetailsDTO.totalPremium",
                    "InsuranceTransactionDetails.insuranceTransactionDetailsDTO.transactionDate",

                    "actionbox",
                    "actionbox.save"
                ];

            }



            return {
                "type": "schema-form",
                "title": "INSURANCE_REGISTRATION",
              
                initialize: function (model, form, formCtrl) {
                     if(_.hasIn($stateParams, "pageId") && !_.isNull($stateParams.pageId)) {
                        PageHelper.showLoader();
                        InsuranceProcess.fromInsurancePolicyID($stateParams.pageId)
                            .subscribe(function(insuranceProcess) {
                                model.insuranceProcess = insuranceProcess;
                                model.insurancePolicyDetailsDTO = model.insuranceProcess.insurancePolicyDetailsDTO;
                                idPresent = true;
                                PageHelper.hideLoader();
                            });
                        
                    } else {
                         InsuranceProcess.createNewProcess()
                            .subscribe(function(insuranceProcess) {
                                console.log("else insuranceProcess");
                                console.log(insuranceProcess); 
                                model.insuranceProcess = insuranceProcess;
                                model.insurancePolicyDetailsDTO = model.insuranceProcess.insurancePolicyDetailsDTO;
                         
                            });
                    }
                    var self = this;
                    var formRequest = {
                        
                        "includes": getIncludes(model),
                        "overrides": {},
                        "excludes" : ["InsurancePolicyInformation.assetValue",
                        "InsurancePolicyInformation.annuacomelIn",
                        "InsurancePolicyInformation.bankId",
                        "InsurancePolicyInformation.branchId",
                        "InsurancePolicyInformation.centreId",
                        "InsurancePolicyInformation.certificateNo",
                        "InsurancePolicyInformation.contactNumber",
                        "InsurancePolicyInformation.currentStage",
                        "InsurancePolicyInformation.district",
                        "InsurancePolicyInformation.dscId",
                        "InsurancePolicyInformation.gender",
                       
                        "InsurancePolicyInformation.leadId",
                        "InsurancePolicyInformation.maturityDate",
                        "InsurancePolicyInformation.occupation",
                        "InsurancePolicyInformation.parentPolicyNumber",
                       
                        "InsurancePolicyInformation.pincode",
                        "InsurancePolicyInformation.policyNumber",            
                        
                      
                        "InsurancePolicyInformation.state",
                        "InsurancePolicyInformation.status",
                 
                        "InsurancePolicyInformation.tenureInYears"
                        ],
                         "options": {
                            "repositoryAdditions": {
                                "InsurancePolicyInformation": {
                                    "items" : {
                                        "urnNo" : {                               
                                            "type": "lov",
                                            "title" : "URN_NO",
                                            "orderNo" : 5,
                                            "key" : "insurancePolicyDetailsDTO.urnNo",
                                            "autolov": false,
                                            "lovonly": true,
                                            "bindMap": {},
                                            "inputMap": {
                                                "urnNo":{
                                                    "key":"insurancePolicyDetailsDTO.urnNo",
                                                    "title":"URN_NO",
                                                    "type":"string"
                                                }
                                            },
                                             "outputMap": {
                                                "firstName":  "insurancePolicyDetailsDTO.fullName",
                                                "customerBranchId" : "insurancePolicyDetailsDTO.branchId",
                                                "customerBankId" : "insurancePolicyDetailsDTO.bankId",
                                                "centreId" : "insurancePolicyDetailsDTO.centreId",
                                                "customerId" : "insurancePolicyDetailsDTO.customerId",
                                                "urnNo" : "insurancePolicyDetailsDTO.urnNo",
                                                "mobilePhone" : "insurancePolicyDetailsDTO.contactNumber"
                                            },
                                            "searchHelper": formHelper,

                                            search: function(inputModel, form, model, context) {
                                               
                                               return Queries.searchCustomerData(
                                                 inputModel.urnNo
                                                );
                                            },
                                           
                                            getListDisplayItem: function(item, index) {
                                                return [
                                                    item.urnNo + item.firstName + item.lastName
                                                ];
                                            }
                                        },
                                        "insuranceRecommendations" : {
                                            "title" : "Insurance Recommendations",
                                            "type" : "button",
                                            "orderNo" : 132,
                                            "onClick" : "actions.insuranceRecommendations(model,formRequest, formCtrl)"

                                        }

                                    }
                                 },
                                 "InsuranceNomineeDetails":{
                                    "items" : {
                                        "nomineeDetailsDTO":{
                                            "items" : {
                                                "nomineeName" : {                               
                                                    "type": "lov",
                                                    "title" : "NOMINEE_NAME",
                                                    "key" : "insurancePolicyDetailsDTO.nomineeDetailsDTO[].nomineeName",
                                                    "autolov": false,
                                                    "lovonly": true,
                                                    "bindMap": {},
                                                    "searchHelper": formHelper,
                                                    search: function(inputModel, form, model, context) {                                              
                                                       return Queries.getCustomerFamilyRelations(
                                                         model.insurancePolicyDetailsDTO.customerId
                                                        );
                                                    },
                                                    onSelect: function(result, model, context){
                                                        model.insurancePolicyDetailsDTO.nomineeDetailsDTO[context.arrayIndex].nomineeName = result.familyMemberFirstName;
                                                    },                                                   
                                                    getListDisplayItem: function(item, index) {
                                                        return [
                                                            item.familyMemberFirstName
                                                        ];
                                                    }
                                                }
                                            }
                                        }
                                     }
                                }
                            }
                           

                        },
                         "overrides" : {
                            "InsurancePolicyInformation" : {
                                "readonly" : idPresent
                            },
                            "actionbox":{
                                "condition" : "!model.insurancePolicyDetailsDTO.id"
                            },
                            "InsuranceNomineeDetails" : {
                                 "readonly" : idPresent
                            },
                            "InsuranceTransactionDetails":{
                                "readonly" : idPresent
                            },
                                "InsurancePolicyInformation.productCode" : {
                                    "key" : "insurancePolicyDetailsDTO.productCode",
                                    "type" : "lov",
                                    /*"autolov" : true,*/
                                    "required" :  true,
                                    "title" : "PRODUCT_CODE",
                                    search : function(inputModel,form,model,context){
                                        return Queries.getProductCode(
                                           SessionStore.getBankId(),
                                           SessionStore.getCurrentBranch().branchId
                                        );
                                    },
                                    onSelect : function(result,model,context){
                                        model.insurancePolicyDetailsDTO.productCode = result.productCode,
                                        model.insurancePolicyDetailsDTO.partnerCode = result.partnerCode,
                                        model.insurancePolicyDetailsDTO.insuranceType = result.insuranceType,
                                        model.insurancePolicyDetailsDTO.premiumRateCode = result.premiumRateCode,
                                        model.moduleConfigId = result.moduleConfigId
                                    },
                                    getListDisplayItem : function(item,index){
                                        return[
                                            item.productCode +" "+ item.partnerCode
                                        ];
                                    }
                                    
                                },
                               
                                "InsurancePolicyInformation.sumInsured" : {
                                    "onChange" : function(modelValue, form, model){
                                PageHelper.showLoader();

                                   model.insuranceProcess.getPremiumAmount()
                                .finally(function() {
                                    PageHelper.hideLoader();
                                })
                                .subscribe(function(value) {
                                   
                                    PageHelper.clearErrors();

                                }, function(err) {
                                    PageHelper.showProgress('Insurance', 'Insurance Registration Failed', 5000);
                                    PageHelper.showErrors(err);
                                    PageHelper.hideLoader();
                                });
                                    }
                                }
                         }
                    }

                     UIRepository.getInsuranceProcessDetails().$promise
                        .then(function(repo){
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form){
                            self.form = form;
                        });

                },

                preDestroy: function (model, form, formCtrl, bundlePageObj, bundleModel) {

                },
                eventListeners: {
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                },
                form: [],

                schema: function () {
                    return Insurance.getSchema().$promise;
                },
                actions: {
                    insuranceRecommendations : function(model, formRequest, formCtrl){
                       
                        insuranceProcess.getInsuranceRecommendation(

                            ).$promise.then(function(res){

                        })

                    },
                     save: function (model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress('Insurance', 'Insurance Registration Failed', 5000);
                            return false;
                        }

                        // $q.all start
                        PageHelper.showLoader();

                       
                            model.insuranceProcess.save()
                                .finally(function() {
                                    PageHelper.hideLoader();
                                })
                                .subscribe(function(value) {
                                     PageHelper.showProgress('Insurance', 'Insurance Registration Saved', 5000);
                                   irfNavigator.goBack();
                                    PageHelper.clearErrors();

                                }, function(err) {
                                    PageHelper.showProgress('Insurance', 'Insurance Registration Failed', 5000);
                                    PageHelper.showErrors(err);
                                    PageHelper.hideLoader();
                                });
                       
                    }
                }
            };
        }
    }
})
