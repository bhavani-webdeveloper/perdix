define(['perdix/domain/model/insurance/InsuranceProcess'], function (InsuranceProcess) {
     InsuranceProcess = InsuranceProcess['InsuranceProcess'];   
    return {
        pageUID: "insurance.Registration",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams","Insurance", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "PagesDefinition", "Queries", "irfProgressMessage", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfNavigator","Enrollment"],

        $pageFn: function ($log, $state, $stateParams, Insurance,SessionStore, formHelper, $q,
                           PageHelper, Utils, PagesDefinition, Queries, PM, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository, irfNavigator,Enrollment) {

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
                    "InsurancePolicyInformation.recommendationStatus",
                    


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
                "title": "INSURANCE_REGISTRATION",
              
                initialize: function (model, form, formCtrl) {
                    model.customer = {};
                     if(_.hasIn($stateParams, "pageId") && !_.isNull($stateParams.pageId)) {
                        PageHelper.showLoader();
                        InsuranceProcess.fromInsurancePolicyID($stateParams.pageId)
                            .subscribe(function(insuranceProcess) {
                                model.insuranceProcess = insuranceProcess;
                                model.insurancePolicyDetailsDTO = model.insuranceProcess.insurancePolicyDetailsDTO;
                                Enrollment.getCustomerById({id:model.insurancePolicyDetailsDTO.customerId}).$promise.then(function(resp){
                                    model.customer = resp;
                                })
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
                                                    "type":"string",
                                                    "required":"true",
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
                                               
                                               return Queries.searchCustomerData(
                                                 inputModel.urnNo,
                                                 inputModel.fullName
                                                );
                                            },
                                            onSelect: function (valueObj, model, context) {
                                                Enrollment.getCustomerById({
                                                    id: valueObj.customerId
                                                }).$promise.then(function(resp) {
                                                    model.customer = resp;
                                                })
                                            },
                                            getListDisplayItem: function(item, index) {
                                                return [
                                                    item.urnNo +" "+item.firstName 
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
                                                            item.familyMemberFirstName+" "+item.realtionShip
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
                                        "validate": {
                                            key: "customer.isBiometricValidated",
                                            "title": "CHOOSE_A_FINGER_TO_VALIDATE",
                                            type: "validatebiometric",
                                            category: 'CustomerEnrollment',
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
                            }
                            
                           

                        },
                         "overrides" : {
                            "InsurancePolicyInformation" : {
                                "readonly" : idPresent,
                                "orderNo":1,
                            },
                            "InsuranceNomineeDetails" : {
                                 "readonly" : idPresent,
                                 "orderNo":2,
                            },
                            "InsuranceTransactionDetails":{
                                "readonly" : idPresent,
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
                                       SessionStore.getCurrentBranch().branchId
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
                        'entityName': SessionStore.getBankName(),
                        'benificieryName': requestObj.benificieryName,
                        'insuranceId': requestObj.id,
                        'urnNo': requestObj.urnNo,
                        'sumInsured': requestObj.sumInsured,
                        'premiumCollected': requestObj.insuranceTransactionDetailsDTO[0].totalPremium,
                        'policyNumber' :  requestObj.policyNumber,
                        'company_name': "IFMR Rural Channels and Services Pvt. Ltd.",
                        'cin': 'U74990TN2011PTC081729',
                        'address1': 'IITM Research Park, Phase 1, 10th Floor',
                        'address2': 'Kanagam Village, Taramani',
                        'address3': 'Chennai - 600113, Phone: 91 44 66687000',
                        'website': "http://ruralchannels.ifmr.co.in/",
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
                        if (!(model.isBiometricValidated)){
                            PageHelper.hideLoader();
                            PageHelper.showErrors({
                                data:{
                                    error:"Bio metric validation is required"
                                }
                            })
                            return false;
                        }

                       
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
            };
        }
    }
})
