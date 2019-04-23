define(['perdix/infra/api/AngularResourceService'], function (AngularResourceService) {
    return {
        pageUID: "customer.banking.SBTransaction",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository","irfNavigator","Transaction","BranchCreationResource"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository,irfNavigator,Transaction,BranchCreationResource) {

            AngularResourceService.getInstance().setInjector($injector);
            return {
                "type": "schema-form",
                "title": "SB_ACCOUNT",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    };
                    /* Setting data recieved from Bundle */
                    // model.loanCustomerRelationType =getLoanCustomerRelation(bundlePageObj.pageClass);
                    // model.pageClass = bundlePageObj.pageClass;
                    // model.currentStage = bundleModel.currentStage;
                    model.sbTransaction={};
                  var getEnrollment=function(id){
                    var deferred=$q.defer();
                    Enrollment.getCustomerById(id).$promise
                    .then(function(resp,header){
                        deferred.resolve(resp)
                    },function(err){
                        deferred.reject(err);
                    })
                    return deferred.promise;
                  }

                    if($stateParams.pageId!=null || $stateParams.pageId!=undefined){
                       var res= getEnrollment({id:$stateParams.pageId});
                       res.then(function(resp){
                            // model.customer=resp;
                            model.sbTransaction.customerId=resp.id;
                            model.sbTransaction.urnNo=resp.urnNo;
                            model.sbTransaction.firstName=resp.firstName;
                        },function(err){
                            console.log(err);
                        });
                    }
                    else
                    {
                        irfNavigator.go({
                            "state": "Page.Engine",
                            "pageName": "customer.banking.Banking"
                        });
                    }

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
                   

                    /* Setting data for the form */
                    var branchId = SessionStore.getBranchId();
                    if (!model.customer) {

                    }

                    else if (branchId && !model.customer.customerBranchId) {
                        model.customer.customerBranchId = branchId;
                    };

                    var configFile = function () {
                        return {
                            "loanProcess.loanAccount.currentStage": {
                            }
                        }
                    }
                    var overridesFields = function (bundlePageObj) {
                        return {
        
                        }
                    }
                    var getIncludes = function (model) {
        
                        return [
                            "Bank",
                            "Bank.urn",
                            "Bank.name",
                            "Bank.accountNo",
                            "Bank.accountNo.search",
                            "Bank.transactionType",
                            "Bank.transactionAmount",
                            "Bank.remarks",
                            "Bank.validateFingerPrint",

                            "Biometric",
                            "Biometric.validateFingerPrint",
                        ];
        
                    }


                   
                    /* Form rendering starts */
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [
                           // "KYC.addressProofSameAsIdProof",
                        ],
                        "options": {
                            "repositoryAdditions": {
                             "Bank":{
                                 "type":"box",
                                 "orderNo": 1,
                                 "title":"BANK_DETAILS",
                                 "items":{
                                        "urn":{
                                            "key":"sbTransaction.urnNo",
                                            "type":"text",
                                            "title": "URN_NO",
                                            "readonly": true
                                        },
                                        "name":{
                                            "key":"sbTransaction.firstName",
                                            "type":"text",
                                            "title": "CUSTOMER_NAME",
                                            "readonly": true
                                        },
                                        // "accountNo":{
                                        //     "type": "lov",
                                        //     "title": "Account",
                                        //     "resolver": "CustomerBankAccountConfiguration"
                                        // },
                                        "accountNo": {
                                                type: "lov",
                                                lovonly: false,
                                                title: "ACCOUNT_NO",
                                                bindMap: {},
                                                key: "model.sbTransaction.customerId",
                                                "outputMap": {
                                                    "accountNo": "model.sbTransaction.customerBankAccounts",
                                                },
                                                "searchHelper": formHelper,
                                                "search": function(inputModel, form) {
                                                    // $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                                    // var branches = formHelper.enum('branch_id').data;
                                                    // var branchName;
                                                    // for (var i = 0; i < branches.length; i++) {
                                                    //     if (branches[i].code == inputModel.customerBranchId)
                                                    //         branchName = branches[i].name;
                                                    // }
                                                    var customerBankAccounts=[];
                                                    var promise=getEnrollment({id:$stateParams.pageId}).then(
                                                      function(resp){
                                                        customerBankAccounts=resp.customerBankAccounts;
                                                      },function(err){
                                                        customerBankAccounts=[];
                                                      }
                                                    );
                                                    // var promise = Enrollment.search({
                                                    //     'customerId': inputModel.customerId,
                                                    // }).$promise;
                                                    // return promise;
                                                    return $q.resolve({
                                                        headers: {
                                                            "x-total-count": customerBankAccounts.length
                                                        },
                                                        body: customerBankAccounts
                                                    });
                                                   
                                                  
                                                },
                                                getListDisplayItem: function(data, index) {
                                                    return [
                                                        [data.firstName, data.fatherFirstName].join(' | '),
                                                        data.firstName,
                                                        data.urnNo
                                                    ];
                                                },
                                                onSelect: function(valueObj, model, context) {
                                                    PageHelper.showProgress('customer-load', 'Loading customer...');
                                                    EnrolmentProcess.fromCustomerID(valueObj.id)
                                                        .finally(function() {
                                                            PageHelper.showProgress('customer-load', 'Done.', 5000);
                                                        })
                                                        .subscribe(function(enrolmentProcess) {
                                                            /* Setting on the current page */
                                                            model.enrolmentProcess = enrolmentProcess;
                                                            model.customer = enrolmentProcess.customer;

                                                            BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                                                        })
                                            }
                                        },
                                        // "accountNo":{
                                        //         key: "sbTransaction. customerBankAccounts",
                                        //         type: "lov",
                                        //         lovonly: true,
                                        //         bindMap: {},
                                        //         //key: "agent.customerId",
                                        //         "inputMap": {
                                        //             "customerId": {
                                        //                 "key": "sbTransaction.customerId",
                                        //                 "title": "CUSTOMER_ID",
                                        //                 "type": "string"
                                        //             }
                                        //         },
                                        //         "outputMap": {
                                        //             "urnNo": "customer.urnNo",
                                        //             "firstName": "customer.firstName"
                                        //         },
                                        //         "searchHelper": formHelper,
                                        //         "search": function(inputModel, form) {
                                                    
                                        //             var promise = Enrollment.search({
                                        //                 'customerId': inputModel.customerId,   
                                        //             }).$promise;
                                        //             return promise;
                                        //         },
                                        //         getListDisplayItem: function(data, index) {
                                        //             return [
                                        //                 [data.firstName, data.fatherFirstName].join(' | '),
                                        //                 data.firstName,
                                        //                 data.urnNo
                                        //             ];
                                        //         },
                                        //         onSelect: function(valueObj, model, context) {
                                        //             PageHelper.showLoader();
                                        //             EnrolmentProcess.fromCustomerID(valueObj.id)
                                        //                 .finally(function() {
                                        //                     PageHelper.showProgress('customer-load', 'Done.', 5000);
                                        //                 })
                                        //                 .subscribe(function(enrolmentProcess) {
                                        //                     /* Setting on the current page */
                                                            
                                        //                 })
                                                    
                                        //         }
                                                                
                                                                               
                                        // },
                                        "transactionType":{
                                            "key": "sbTransaction.transactionType",
                                            "type": "radios",
                                            "title":"TRANSACTION_TYPE",
                                            // "enumcode": "transaction_type"
                                            "titleMap":[{
                                                     "name": "Deposit",
                                                    "value": "DEPOSIT",
                                                }, {
                                                    "name": "Withdraw",
                                                    "value": "WITHDRAW"
                                                }]
                                        },
                                        "transactionAmount":{
                                            "key": "sbTransaction.transactionAmount",
                                            "type": "text",
                                            "title":"TRANSACTION AMOUNT",
                                        },
                                        "remarks":{
                                            "key": "sbTransaction.remarks",
                                            "type": "text",
                                            "title": "REMARKS"
                                        },
                                        "validateFingerPrint":{
                                            key:"sbTransaction.whichFinger",
                                            title: "Validate Fingerprint",
                                            type:"validatebiometric",
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
                                            }
                                        }
                                    }
                                },
                                // "Biometric":{
                                //     "type":"box",
                                //     "title":"BIOMETRIC",
                                //     "orderNo": 2,
                                // "items":{
                                //     "validateFingerPrint":{
                                //         key:"customer.isBiometricValidated",
                                //         title: "Validate Fingerprint",
                                //         type:"validatebiometric",
                                //         category: 'CustomerEnrollment',
                                //         subCategory: 'FINGERPRINT',
                                //         helper: formHelper,
                                //         biometricMap: {
                                //             leftThumb: "model.customer.leftHandThumpImageId",
                                //             leftIndex: "model.customer.leftHandIndexImageId",
                                //             leftMiddle: "model.customer.leftHandMiddleImageId",
                                //             leftRing: "model.customer.leftHandRingImageId",
                                //             leftLittle: "model.customer.leftHandSmallImageId",
                                //             rightThumb: "model.customer.rightHandThumpImageId",
                                //             rightIndex: "model.customer.rightHandIndexImageId",
                                //             rightMiddle: "model.customer.rightHandMiddleImageId",
                                //             rightRing: "model.customer.rightHandRingImageId",
                                //             rightLittle: "model.customer.rightHandSmallImageId"
                                //         },
                                //         viewParams: function(modelValue, form, model) {
                                //             return {
                                //                 customerId: model.customer.id
                                //             };
                                //         }
                                //     }
                                // }
                                
                                // }
                            },
                            "additions": [
                                {
                                    "type": "actionbox",
                                    // "condition": "(model.customer.id && model.currentStage!=='ScreeningReview')",
                                    "orderNo": 3,
                                    "items": [
                                        
                                            {
                                                "type": "submit",
                                                "title": "SUBMIT",
                                            },
                                        
                                        // {
                                        //     "type": "button",
                                        //     "title": "SUBMIT",
                                        //     "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                        // }
                                    ]
                                }
                            ]
                        }
                    };

                    UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function (repo) {
                            console.log(model.pageClass);
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function (form) {
                            self.form = form;
                            console.log(form);
                            console.log("_________________Testing form data___________");
                        });

                    /* Form rendering ends */
                },

                preDestroy: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // console.log("Inside preDestroy");
                    // console.log(arguments);
                    // if (bundlePageObj) {
                    //     var enrolmentDetails = {
                    //         'customerId': model.customer.id,
                    //         'customerClass': bundlePageObj.pageClass,
                    //         'firstName': model.customer.firstName
                    //     }
                    //     // BundleManager.pushEvent('new-enrolment',  {customer: model.customer})
                    //     BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails);
                    //     model.loanProcess.removeRelatedEnrolmentProcess(model.enrolmentProcess, model.loanCustomerRelationType);
                    // }
                    return $q.resolve();
                },
                eventListeners: {
                  
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                    return [
                        // item.customer.urnNo,
                        // Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                        // item.customer.villageName
                    ]
                },
                form: [
                        // {
                        //     "type": "box",
                        //     "title": "EDF",
                        //     "items": [{
                        //             "key": "customer.terms_and_conditions_explained",
                        //             title: "IS_TERMS_AND_CONDITIONS_EXPLAINED",
                        //             type: "radios",
                        //             titleMap: {
                        //                 "YES": "YES",
                        //                 "NO": "NO",
                        //             }
                        //         }, {
                        //             type: "fieldset",
                        //             condition: "model.customer.terms_and_conditions_explained =='YES'",
                        //             title: "VALIDATE_BIOMETRIC",
                        //             items: [
                        //             {
                        //                 key: "customer.isBiometricValidated",
                        //                 condition:"model.customer.iscordova",
                        //                 required:true,
                        //                 "title": "CHOOSE_A_FINGER_TO_VALIDATE",
                        //                 type: "validatebiometric",
                        //                 category: 'CustomerEnrollment',
                        //                 subCategory: 'FINGERPRINT',
                        //                 helper: formHelper,
                        //                 biometricMap: {
                        //                     leftThumb: "model.customer.leftHandThumpImageId",
                        //                     leftIndex: "model.customer.leftHandIndexImageId",
                        //                     leftMiddle: "model.customer.leftHandMiddleImageId",
                        //                     leftRing: "model.customer.leftHandRingImageId",
                        //                     leftLittle: "model.customer.leftHandSmallImageId",
                        //                     rightThumb: "model.customer.rightHandThumpImageId",
                        //                     rightIndex: "model.customer.rightHandIndexImageId",
                        //                     rightMiddle: "model.customer.rightHandMiddleImageId",
                        //                     rightRing: "model.customer.rightHandRingImageId",
                        //                     rightLittle: "model.customer.rightHandSmallImageId"
                        //                 },
                        //                 viewParams: function(modelValue, form, model) {
                        //                     return {
                        //                         customerId: model.customer.id
                        //                     };
                        //                 },
                        //             },
                        //             {
                        //                 type: "button",
                        //                 condition: "!model.customer.iscordova",
                        //                 title: "VALIDATE_BIOMETRIC",
                        //                 notitle: true,
                        //                 fieldHtmlClass: "btn-block",
                        //                 onClick: function(model, form, formName) {
                        //                     var fingerprintObj = {
                        //                         'LeftThumb': model.customer.leftHandThumpImageId,
                        //                         'LeftIndex': model.customer.leftHandIndexImageId,
                        //                         'LeftMiddle': model.customer.leftHandMiddleImageId,
                        //                         'LeftRing': model.customer.leftHandRingImageId,
                        //                         'LeftLittle': model.customer.leftHandSmallImageId,
                        //                         'RightThumb': model.customer.rightHandThumpImageId,
                        //                         'RightIndex': model.customer.rightHandIndexImageId,
                        //                         'RightMiddle': model.customer.rightHandMiddleImageId,
                        //                         'RightRing': model.customer.rightHandRingImageId,
                        //                         'RightLittle': model.customer.rightHandSmallImageId
                        //                     };
                        //                     if (model.fingerPrintDeviceType == "MANTRA") {
                        //                         BiometricService.validateFingerPrintByMantra(fingerprintObj).then(function (data) {
                        //                             model.customer.isBiometricMatched = data;
                        //                             if (data == "Match found") {
                        //                                 model.customer.isBiometricValidated = true;
                        //                             } else {
                        //                                 model.customer.isBiometricValidated = false;
                        //                             }
                        //                         }, function (reason) {
                        //                             console.log(reason);
                        //                         });
        
                        //                     }
                        //                     else{
                        //                         BiometricService.validate(fingerprintObj).then(function(data) {
                        //                             model.customer.isBiometricMatched = data;
                        //                             if (data == "Match found") {
                        //                                 model.customer.isBiometricValidated = true;
                        //                             } else {
                        //                                 model.customer.isBiometricValidated = false;
                        //                             }
                        //                         }, function(reason) {
                        //                             console.log(reason);
                        //                         });
                        //                     }
                        //                 }
                        //             }, {
                        //                 "key": "customer.isBiometricMatched",
                        //                 "title": "Is Biometric Matched",
                        //                 "readonly": true
                        //             },
                        //             {
                        //                 "key": "customer.biometricEnrollment",
                        //                 readonly:true,
                        //                 condition:"model.customer.biometricEnrollment == 'AUTHENTICATED'",
                        //                 title: "BIOMETRIC_AUTHENTICATION",
                        //                 type: "select",
                        //                 titleMap: {
                        //                     "NOT-ENABLE": "NOT-ENABLE",
                        //                     "PENDING": "PENDING",
                        //                     "AUTHENTICATED": "AUTHENTICATED"
                        //                 }
                        //             }, ]
                        //         },
        
                        //     ]
                        // },
        
                        // {
                        //     "type": "actionbox",
                        //     "items": [{
                        //         "type": "submit",
                        //         "title": "Submit"
                        //     }]
                        // }
        
                    ],
                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    save: function (model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }
                        // $q.all start
                      
                    },
                    proceed: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                      
                    },
                    submit: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }

                        if(model.sbTransaction.whichFinger == false){
                            model.sbTransaction.whichFinger = 0;
                        }else{
                            model.sbTransaction.whichFinger = 1;
                        }
                        Transaction.saveSBTransaction(model.sbTransaction).$promise.then(function(resp){
                            console.log("resp",resp);
                        },function(err){
                            console.log("ERR",err);
                        })
                       
                    }
                }
            };
        }
    }
})