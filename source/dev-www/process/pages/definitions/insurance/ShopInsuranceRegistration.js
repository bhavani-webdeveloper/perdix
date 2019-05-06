define(['perdix/domain/model/insurance/InsuranceProcess'], function (InsuranceProcess) {
    InsuranceProcess = InsuranceProcess['InsuranceProcess'];   
   return {
       pageUID: "insurance.ShopInsuranceRegistration",
       pageType: "Engine",
       dependencies: ["$log", "$state", "$stateParams","Insurance", "SessionStore", "formHelper", "$q",
           "PageHelper", "Utils", "PagesDefinition", "Queries", "irfProgressMessage", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator","Enrollment","BranchCreationResource"],

       $pageFn: function ($log, $state, $stateParams, Insurance,SessionStore, formHelper, $q,
                          PageHelper, Utils, PagesDefinition, Queries, PM, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator,Enrollment,BranchCreationResource) {

             var configFile = function () {
               return { 
                   "idPresent":{
                       "true":{
                           "excludes":[],
                           "overrides":{
                               "InsurancePolicyInformation" : {
                                   "readonly" : true
                               },
                               "InsuranceNomineeDetails" : {
                                   "readonly" : true
                               },
                               "InsuranceTransactionDetails":{
                                   "readonly" : true
                               },                                
                           }
                       }
                   }                   
               }
           }

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
                   "InsurancePolicyInformation.recommendationStatus",
                   "InsurancePolicyInformation.question",
                   "InsurancePolicyInformation.accountNumber",
                   "InsurancePolicyInformation.accountType",
                   "InsurancePolicyInformation.customerNameAsInBank",
                   "InsurancePolicyInformation.ifscCode",
                   "InsurancePolicyInformation.customerBankName",
                   "InsurancePolicyInformation.customerBankBranchName",  
                   


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
                   "validateBiometric",
                   "validateBiometric.validate",
                   "validateBiometric.fpOverrideRequested",
                   "validateBiometric.fpOverrideRemarks",
                   "validateBiometric.fpOverrideStatus",
                   "shopInsuranceBox",
                   "shopInsuranceBox.shopInsurance",
                   "shopInsuranceBox.shopInsurance.shopType",
                   "shopInsuranceBox.shopInsurance.constructionType",
                   "shopInsuranceBox.shopInsurance.coverNoteNo",
                   "shopInsuranceBox.shopInsurance.shopPhotos",
                   "shopInsuranceBox.shopInsurance.shopPhotos.shopPhoto",
                   "shopInsuranceBox.shopInsurance.shopAddress",
                   "shopInsuranceBox.shopInsurance.shopAddress.address1",
                   "shopInsuranceBox.shopInsurance.shopAddress.address2",
                   "shopInsuranceBox.shopInsurance.shopAddress.address3",
                   "shopInsuranceBox.shopInsurance.shopAddress.village",
                   "shopInsuranceBox.shopInsurance.shopAddress.locality",
                   "shopInsuranceBox.shopInsurance.shopAddress.district",
                   "shopInsuranceBox.shopInsurance.shopAddress.pincode",
                   //"InsuranceTransactionDetails.insuranceTransactionDetailsDTO.transactionDate",

                   "actionboxBeforeSave",
                   "actionboxBeforeSave.save",
                   "actionboxAfterSave",
                   "actionboxAfterSave.OnlinePrint",
                   "actionboxAfterSave.Back"
               ];

           }



           return {
               "type": "schema-form",
               "title": "SHOP_INSURANCE_REGISTRATION",
             
               initialize: function (model, form, formCtrl) {
                   model.customer = {};
                   model.idPresent = "false";
                   
                   //start
            var branchId = SessionStore.getBranchId();
            if (!Utils.isCordova) {
                BranchCreationResource.getBranchByID({
                        id: branchId
                    },
                    function (branchDetails) {
                        if (branchDetails.fingerPrintDeviceType) {
                            if (branchDetails.fingerPrintDeviceType == "MANTRA") {
                                model.fingerPrintDeviceType = branchDetails.fingerPrintDeviceType;
                            }
                        }

                        PageHelper.hideLoader();
                    },
                    function (err) {
                        $log.info(err);
                    }
                );
            }
            //end
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
                                                   "type":"string",
                                               },
                                               "fullName":{
                                                   "key":"insurancePolicyDetailsDTO.fullName",
                                                   "title":"CUSTOMER_NAME",
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
                                               return Enrollment.search({
                                                   'branchName': SessionStore.getBranch(),
                                                   'firstName': inputModel.fullName,
                                                   'customerType':"individual",
                                                   'urnNo': inputModel.urnNo
                                               }).$promise;
                                               
                                           },
                                           onSelect: function (valueObj, model, context) {
                                               // model.customer = valueObj;
                                               Enrollment.getCustomerById({
                                                   id: valueObj.id
                                               }).$promise.then(function(resp) {
                                                   model.customer = resp;
                                                   
                                                   model.insurancePolicyDetailsDTO.fullName = resp.firstName,
                                                   model.insurancePolicyDetailsDTO.branchId =resp.customerBranchId,
                                                   model.insurancePolicyDetailsDTO.bankId = resp.customerBankId,
                                                   model.insurancePolicyDetailsDTO.centreId = resp.centreId,
                                                   model.insurancePolicyDetailsDTO.customerId = resp.id,
                                                   model.insurancePolicyDetailsDTO.urnNo =resp.urnNo,
                                                   model.insurancePolicyDetailsDTO.contactNumber = resp.mobilePhone
                                                   model.insurancePolicyDetailsDTO.trxnChannel = "BRANCH";
                                                   
                                                   if (resp.dateOfBirth) {
                                                    model.insurancePolicyDetailsDTO.age = moment().diff(moment(resp.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                                }
                                               })
                                           },
                                           getListDisplayItem: function(item, index) {
                                               return [
                                                   item.firstName,
                                                   item.urnNo
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
                                                       return Queries.getCustomerNomineeRelations(
                                                         model.insurancePolicyDetailsDTO.customerId,
                                                         model.insurancePolicyDetailsDTO.benificieryRelationship
                                                        );
                                                    },
                                                    onSelect: function(result, model, context){
                                                        model.insurancePolicyDetailsDTO.nomineeDetailsDTO[context.arrayIndex].nomineeName = result.familyMemberFirstName;
                                                        model.insurancePolicyDetailsDTO.nomineeDetailsDTO[context.arrayIndex].nomineeRelationship = result.realtionShip;
                                                        model.insurancePolicyDetailsDTO.nomineeDetailsDTO[context.arrayIndex].nomineeGender = result.gender;
                                                        model.insurancePolicyDetailsDTO.nomineeDetailsDTO[context.arrayIndex].nomineePercentage = 100;
                                                    },                                                   
                                                    getListDisplayItem: function(item, index) {
                                                        return [
                                                            item.familyMemberFirstName,item.realtionShip
                                                        ];
                                                    }
                                                }
                                            }
                                        }
                                     }
                                },
                               "validateBiometric":{
                                   "type":"box",
                                   "orderNo":4,
                                   "title":"VALIDATE_BIOMETRIC",                                   
                                   "items":{
                                       
                                       "fpOverrideRequested":{
                                               key:"insurancePolicyDetailsDTO.fpOverrideRequested",
                                               type: "checkbox",
                                               "orderNo" : 10,
                                               "title": "OVERRIDE_FINGERPRINT",
                                               schema: {
                                               "default": false
                                               }
                                           },
                                        "fpOverrideRemarks":{
                                            key:"insurancePolicyDetailsDTO.fpOverrideRemarks",
                                            type:"text",
                                            "orderNo":20,
                                            "title":"OVERRIDE_REMARKS",
                                            condition:"model.insurancePolicyDetailsDTO.fpOverrideRequested"
                                        },
                                        
                                       "fpOverrideStatus":{
                                           key:"insurancePolicyDetailsDTO.fpOverrideStatus",
                                           type: "select",
                                           "orderNo":30,
                                           required: true,                                            
                                           titleMap: {
                                               "Requested": "Requested",
                                               "Approved": "Approved"
                                           },
                                           "title": "OVERRIDE_STATUS",
                                           condition: "model.insurancePolicyDetailsDTO.fpOverrideRequested"
                                       },
                                       "validate": {
                                           condition: "!model.insurancePolicyDetailsDTO.fpOverrideRequested",
                                           key: "customer.isBiometricValidated",
                                           "title": "CHOOSE_A_FINGER_TO_VALIDATE",
                                           type: "validatebiometric",
                                           category: 'CustomerEnrollment',
                                           "orderNo":40,
                                           subCategory: 'FINGERPRINT',
                                           helper: formHelper,
                                           biometricMap: {
                                               leftThumb: "model.customer.leftHandThumpImageId",
                                               leftIndex: "model.customer.leftHandIndexImageId",
                                               leftMiddle: "model.customer.leftHandMiddleImageId",
                                               leftRing: "model.customer.leftHandRingImageId",
                                               leftLittle: "model.customer.leftHandSmallImageId",
                                               rightThumb: "model.customer.rightHandThumpImageId",
                                               rightIndex: "model.customer.rightHandIndexImageId",
                                               rightMiddle: "model.customer.rightHandMiddleImageId",
                                               rightRing: "model.customer.rightHandRingImageId",
                                               rightLittle: "model.customer.rightHandSmallImageId"
                                           },
                                           viewParams: function(modelValue, form, model) {
                                               return {
                                                   customerId: model.customer.id
                                               };
                                           },
                                       }
                                   }
                               },
                               "shopInsuranceBox":{
                                "type":"box",
                                orderNo:5,
                                items:{
                                    "shopInsurance":{
                                        "type":"array",
                                        "key"  : "insurancePolicyDetailsDTO.shopInsuranceDTO",
                                        startEmpty: false,
                                        add: null,
                                        remove :null,
                                        "orderNo": 90,
                                        "title":"SHOP_INSURANCE",
                                        "items":{
                                            "shopType": {
                                                order:100,
                                                "key"  : "insurancePolicyDetailsDTO.shopInsuranceDTO[].shopType",
                                                "title": "SHOP_TYPE",
                                                enumCode:"loan_purpose_3",
                                                type: "select",
                                                required: true,                                            
                                            },
                                            "constructionType": {
                                                order: 110,
                                                key: "insurancePolicyDetailsDTO.shopInsuranceDTO[].constructionType",
                                                title: "CONSTRUCTION_TYPE",
                                                "type": "select",
                                                "titleMap": {
                                                    "WOOD_TIN": "Wood Frame",
                                                    "CONCRETE_PUCCA": "Pucca"
                                                }
                                            },
                                            "coverNoteNo": {
                                                order: 120,
                                                key: "insurancePolicyDetailsDTO.shopInsuranceDTO[].coverNoteNo",
                                                title: "COVER_NOTE_NO",
                                                "type": "string"
                                            },   
                                            "shopPhotos":{
                                                key: "insurancePolicyDetailsDTO.insurancePhotosDTO",
                                                type: "array",
                                                startEmpty: false,
                                                title:"SHOP_PHOTO",
                                                add: null,
                                                remove :null,
                                                "view":"fixed",
                                                "notitle": true,
                                                "items": {
                                                    "shopPhoto":{
                                                        title:"SHOP_PHOTO",
                                                        key: "insurancePolicyDetailsDTO.insurancePhotosDTO[].photoCode",
                                                        offline: true,
                                                        type: "file",
                                                        fileType: "image/*",
                                                        "category": "CustomerEnrollment",
                                                        "subCategory": "PHOTO",
                                                  
                                                        
                                                    }, 
                                                }
                                            },
                                            // "shopPhoto":{
                                            //     title:"SHOP_PHOTO",
                                            //     key: "insurancePolicyDetailsDTO.urnNo",
                                            //     offline: true,
                                            //     type: "file",
                                            //     fileType: "image/*"
                                            // },        
                                            "shopAddress": {
                                                //"order": 53,
                                                "title": "SHOP_ADDRESS",
                                                "notitle" : true,
                                                "type": "fieldset",
                                                "items": {
                                                    "address1": {
                                                        "key"  : "insurancePolicyDetailsDTO.shopInsuranceDTO[].shopAddress1",
                                                        "title": "ADDRESS1",
                                                        "type": "string",
                                                    },
                                                    "address2": {
                                                        "key"  : "insurancePolicyDetailsDTO.shopInsuranceDTO[].shopAddress2",
                                                        "title": "ADDRESS2",
                                                        "type": "string",
                                                    },
                                                    "address3": {
                                                        "key"  : "insurancePolicyDetailsDTO.shopInsuranceDTO[].shopAddress3",
                                                        "title": "ADDRESS3",
                                                        "type": "string",
                                                    },
                                                    "village": {
                                                        "key"  : "insurancePolicyDetailsDTO.shopInsuranceDTO[].village",
                                                        "title": "VILLAGE",
                                                        required: false,
                                                        "readonly": false,
                                                        type: "select",
                                                        "enumCode": "village",
                                                        filter: {
                                                            parentCode: 'model.customer.customerBranchId'
                                                        },
                                                        screenFilter: true
                                                    },
                                                    "locality":{
                                                        "key"  : "insurancePolicyDetailsDTO.shopInsuranceDTO[].locality",
                                                        "title": "LOCALITY",
                                                        "type": "string",    
                                                    },
                                                    "district":{
                                                        "key"  : "insurancePolicyDetailsDTO.shopInsuranceDTO[].district",
                                                        "title": "DISTRICT",
                                                        type: "select",
                                                        "enumCode": "district_master",
                                                        screenFilter: true,
                                                        parentEnumCode: "bankname",
                                                        parentValueExpr: "model.customer.kgfsBankName",
                                                        "readonly": false 
                                                    },
                                                    "pincode":{
                                                        "key"  : "insurancePolicyDetailsDTO.shopInsuranceDTO[].pinCode",
                                                        "title": "PINCODE",
                                                        "type": "number"
                                                    }
                                                    // "address1":{
                                                    //     "title":"ADDRESS1",
                                                    //     "type": ["string","null"]
    
                                                    //     // "items":{
                                                    //     //     "centreId": {
                                                    //     //         orderNo: 60,
                                                    //     //         key: "customer.centreId",
                                                    //     //         "required": true,
                                                    //     //         type: "select",
                                                    //     //         enumCode: "centre",
                                                    //     //         parentEnumCode: "userbranches",
                                                    //     //         parentValueExpr: "model.customer.customerBranchId",
                                                    //     //     },
                                                    //     // }
                                                    //   }
                                                }
    
    
                                            },
                                            
                                        }
                                   },

                                    }
                               },


                           }
                           
                          

                       },
                        "overrides" : {
                           "InsurancePolicyInformation" : {
                               "orderNo":1,
                           },
                           "InsuranceNomineeDetails" : {
                                "orderNo":2,
                           },
                           "InsuranceTransactionDetails":{
                               "orderNo":3
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
                                      SessionStore.getCurrentBranch().branchId,
                                      'SHOP_INSURANCE'
                                   );
                               },
                               onSelect : function(result,model,context){
                                   model.insurancePolicyDetailsDTO.productCode = result.productCode,
                                   model.insurancePolicyDetailsDTO.partnerCode = result.partnerCode,
                                   model.insurancePolicyDetailsDTO.insuranceType = result.insuranceType,
                                   model.insurancePolicyDetailsDTO.premiumRateCode = result.premiumRateCode,
                                   model.insurancePolicyDetailsDTO.purchaseDate = moment(new Date()).format(SessionStore.getSystemDateFormat());
                                   model.insurancePolicyDetailsDTO.startDate = moment(new Date()).format(SessionStore.getSystemDateFormat());
                                   model.insurancePolicyDetailsDTO.moduleConfigId = result.moduleConfigId
                               },
                               getListDisplayItem : function(item,index){
                                   return[
                                       item.productCode +" "+ item.partnerCode
                                   ];
                               }
                               
                           },
                           "InsurancePolicyInformation.accountNumber" : {
                            "key" : "insurancePolicyDetailsDTO.accountNumber",
                            "type" : "lov",
                            /*"autolov" : true,*/
                            "required" :  true,
                            "title" : "BENEFIECIARY_ACCOUNT_NUMBER",
                            search : function(inputModel,form,model,context){
                                return Queries.getCustomerBankAccounts(
                                    model.insurancePolicyDetailsDTO.customerId
                                );
                            },
                            onSelect : function(result,model,context){
                                model.insurancePolicyDetailsDTO.accountNumber = result.account_number,
                                model.insurancePolicyDetailsDTO.customerBankName = result.customer_bank_name,
                                model.insurancePolicyDetailsDTO.customerBankBranchName = result.customer_bank_branch_name,
                                model.insurancePolicyDetailsDTO.ifscCode = result.ifsc_code,
                                model.insurancePolicyDetailsDTO.accountType = result.account_type,
                                model.insurancePolicyDetailsDTO.customerNameAsInBank = result.customer_name_as_in_bank
                                
                            },
                            getListDisplayItem : function(item,index){
                                return[
                                    item.account_number +" - "+ item.ifsc_code
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

                   if(_.hasIn($stateParams, "pageId") && !_.isNull($stateParams.pageId)) {
                       PageHelper.showLoader();
                       InsuranceProcess.fromInsurancePolicyID($stateParams.pageId)
                           .subscribe(function(insuranceProcess) {
                               model.insuranceProcess = insuranceProcess;
                               model.insurancePolicyDetailsDTO = model.insuranceProcess.insurancePolicyDetailsDTO;
                               Enrollment.getCustomerById({id:model.insurancePolicyDetailsDTO.customerId}).$promise.then(function(resp){
                                   model.customer = resp;
                               })
                               model.idPresent = "true";

                               UIRepository.getInsuranceProcessDetails().$promise
                               .then(function(repo){
                                   return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                               })
                               .then(function(form){
                                   console.log("Form:")
                                   console.log(form);
                                   self.form = form;
                               });
                               PageHelper.hideLoader();
                           });
                       
                   } else {
                        InsuranceProcess.createNewProcess()
                           .subscribe(function(insuranceProcess) {
                               console.log("else insuranceProcess");
                               console.log(insuranceProcess); 
                               model.insuranceProcess = insuranceProcess;
                               model.insurancePolicyDetailsDTO = model.insuranceProcess.insurancePolicyDetailsDTO;
                              // model.insurancePolicyDetailsDTO.insurancePhotosDTO=[];
                               //model.insurancePolicyDetailsDTO.insurancePhotosDTO.push({"fileId":""});
                              // model.insurancePolicyDetailsDTO.insurancePhotosDTO = [{fileId:null}];
            
                               UIRepository.getInsuranceProcessDetails().$promise
                               .then(function(repo){
                                   return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                               })
                               .then(function(form){
                                console.log("Form:")
                                console.log(form);
                                   self.form = form;
                               });
                           });
                   }
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
                      
                       PageHelper.showLoader();
                       

                                   model.insuranceProcess.getInsuranceRecommendation()
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

                   },
               OnlinePrint:function(model, formCtrl, form, $event){
               if(model.insurancePolicyDetailsDTO.id){
                   var requestObj=model.insurancePolicyDetailsDTO;
                   var opts = {
                       'centreId': requestObj.centreId,
                       'bankId': requestObj.bankId,
                       'branchId':requestObj.branchId,
                       'branchName':SessionStore.getBranch(),
                       'entityName': 'Dvara KGFS',
                       'benificieryName': requestObj.benificieryName,
                       'insuranceId': requestObj.id,
                       'urnNo': requestObj.urnNo,
                       'sumInsured': requestObj.sumInsured,
                       'premiumCollected': requestObj.insuranceTransactionDetailsDTO[0].totalPremium,
                       'policyNumber' :  requestObj.policyNumber,
                       'policyType' : "SHOP INSURANCE PREMIUM",
                       'company_name': "DVARA Kshetriya Gramin Financial Services Pvt. Ltd.",
                       'cin': 'U74990TN2011PTC081729',
                       'address1': 'IITM Research Park, Phase 1, 10th Floor',
                       'address2': 'Kanagam Village, Taramani',
                       'address3': 'Chennai - 600113, Phone: 91 44 66687000',
                       'website': "https://www.dvarakgfs.com/",
                       'helpline': '18001029370',
                   };
   
                   var print={};
                   print.paperReceipt= Insurance.getWebHeader(opts);
                   print.thermalReceipt= Insurance.getThermalHeader(opts);
                   print.paperReceipt= print.paperReceipt + Insurance.getWebFooter(opts);
                   print.thermalReceipt= Insurance.getThermalFooter(opts,print.thermalReceipt);
   
                   $log.info(print.paperReceipt);
                   $log.info(print.thermalReceipt);
   
                   //LoanProcess.PrintReceipt(print.thermalReceipt,print.paperReceipt);
   
                   Utils.confirm("Please Save the data offline,Page will redirected to Print Preview")
                           .then(function(){
                               irfNavigator.go({
                                   state: "Page.Engine",
                                   pageName: "management.ReceiptPrint",
                                   pageData: print
                               });
                           });


               }else{
                   PM.pop('insurance-registration', 'No data available to Print', 5000);
               }
           },
           Back: function(model, formCtrl, form, $event){
                irfNavigator.goBack();
           },
           print: function(model){
               console.log(model);
           
               var printData = [
                   {
                       "bFont": 2,
                       "text": "SAIJA FINANCE PVT. LTD",
                       "style": {
                           center: true
                       }
                   },
                   {
                       "bFont": 1,
                       "text": "RECIEPT",
                       "style": {
                           "center": true
                       }
                   },
                   {
                       "bFont": 3,
                       "text": "No: <Receipt No here>"
                   },
                   {
                       "bFont": 3,
                       "text": "Mr/Mrs. " + model.insurancePolicyDetailsDTO.benificieryName
                   },
                   {
                       "bFont": 3,
                       "text": "Customer UrnNo: "+ model.insurancePolicyDetailsDTO.urnNo
                   },
                  
                   {
                       "bFont": 4,
                       "text": "Received " + model.premiumCollected + " as Insurance Premium"
                   },
                  
                   {
                       "bFont": 3,
                       "text": "Group Head Sign  Local Representative Sign"
                   }

               ]
               var printObj = {
                   "data": printData
               };

               return;
           },
                    save: function (model, formCtrl, form, $event) {
                       PageHelper.clearErrors();
                       if(PageHelper.isFormInvalid(formCtrl)) {
                           return false;
                       }
                       var cbsdate = Utils.getCurrentDate();
                       if (model.insurancePolicyDetailsDTO.startDate && moment(model.insurancePolicyDetailsDTO.startDate, SessionStore.getSystemDateFormat()).diff(cbsdate, "days") <0) {
                           PageHelper.showProgress("insurance-create", "Start  date should be greater than or equal to system date", 5000);
                           return false;
                       }
                       
                       formCtrl.scope.$broadcast('schemaFormValidate');
                       if (formCtrl && formCtrl.$invalid) {
                           PageHelper.showProgress('Insurance', 'Insurance Registration Failed', 5000);
                           return false;
                       }

                       // $q.all start
                       PageHelper.showLoader();
                       
                       if (!(model.insurancePolicyDetailsDTO.fpOverrideRequested) && !(model.customer.isBiometricValidated)){
                           PageHelper.hideLoader();
                           PageHelper.showErrors({
                               data:{
                                   error:"Bio metric validation is required"
                               }
                           })
                           return false;
                       }

                      
                       if(model.insurancePolicyDetailsDTO.id){
                        model.insuranceProcess.update()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                                model.insurancePolicyDetailsDTO = value.insurancePolicyDetailsDTO;
                                model.submissionDone = true;
                                
                            }, function(err) {
                                PageHelper.showProgress('Insurance', 'Insurance Registration Failed', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                        }
                        else{
                            model.insuranceProcess.insurancePolicyDetailsDTO.telecallingDetails = model.telecalling;
                            model.insuranceProcess.save()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                                model.insurancePolicyDetailsDTO = value.insurancePolicyDetailsDTO;
                                model.submissionDone = true;
                                PageHelper.showProgress('Insurance', 'Insurance Registration Saved', 5000);
                            }, function(err) {
                                PageHelper.showProgress('Insurance', 'Insurance Registration Failed', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                        }
                   }
               }
           };
       }
   }
})
