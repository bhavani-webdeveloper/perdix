define({
    pageUID: "MutualFund.MutualFundTransaction",
    pageType: "Engine",
    dependencies: ["$log", "$q", "Enrollment", "Utils",'EnrollmentHelper', 'PageHelper', 'formHelper', "elementsUtils",

        'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "irfNavigator", "CustomerBankBranch", "MutualFund","BiometricService","PrinterData"
    ],

    $pageFn: function($log, $q, Enrollment,Utils, EnrollmentHelper, PageHelper, formHelper, elementsUtils,
        irfProgressMessage, SessionStore, $state, $stateParams, irfNavigator, CustomerBankBranch, MutualFund,BiometricService,PrinterData) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "MUTUAL_FUND_TRANSACTION",
            initialize: function(model, form, formCtrl) {
                if (!$stateParams.pageData || !$stateParams.pageId) {
                    irfProgressMessage.pop("loading-error","pageData or pageId missing", 5000);
                    irfNavigator.goBack();
                } 
                model.isSubmitApllicable = true;
                model.pageType = $stateParams.pageData.type;
                model.customer=model.customer||{};
                model.transaction = { customerId: $stateParams.pageId};
                model.transaction.submissionDone=false;
                model.customerSummary = {
                    customerId: $stateParams.pageId
                };
                if ( model.pageType == 'additional') {
                    model.transaction.mfTransactionType = 'PURCHASE';
                } else if (model.pageType == 'redemption') {
                    model.transaction.mfTransactionType = 'REDEMPTION';
                }

                PageHelper.showLoader();               
                MutualFund.summary({
                    id: $stateParams.pageId
                }).$promise.then(function(resp) {
                    model.customerSummary = resp[0];
                    model.transaction.mutualFundAccountProfileId = model.customerSummary.id;
                    if (model.customerSummary.folioNo == null) {
                        model.isSubmitApllicable = false;
                        PageHelper.setError({message: "Folio number is not assigned for given mutualfundaccountprofile id"});
                    }
                        Enrollment.get({
                            id: $stateParams.pageId,
                        },
                        function(res) {
                            _.assign(model.customer, res);
                            $log.info(model.customer);
                            if (typeof(cordova) !== 'undefined' && cordova && cordova.plugins && cordova.plugins.irfBluetooth && _.isFunction(cordova.plugins.irfBluetooth.enroll)) {
                                model.customer.iscordova = true;
                            } else {
                                model.customer.iscordova = false;
                            }
                            model = Utils.removeNulls(model, true);
                            PageHelper.hideLoader();
                            PageHelper.showProgress("page-init", "Done.", 2000);
                        },
                        function(res) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress("page-init", "Error in loading customer.", 2000);
                            PageHelper.showErrors(res);
                        });
                }, function(err) {
                    model.isSubmitApllicable = false;
                    PageHelper.setError({message:"First purchase is not completed"});
                    PageHelper.hideLoader();
                    //irfNavigator.goBack();
                }
                );
            },
            form: [{
                    type: "box",
                    title: "KYC_REGISTRATION_INCOMPLETE",
                    condition: "model.customerSummary.accountClosed",
                    items: [{
                        "type": "section",
                        "html": '<hr><t><div>eKYC is incomplete.</t></div>',
                    }, {
                        "type": "button",
                        "title": "DO_EKYC",
                        "onClick": "actions.proceed(model, formCtrl, form, $event)"
                    }]
                }, {
                    "type": "box",
                    "title": "TRANSACTION",
                    "condition": "!model.customerSummary.accountClosed",
                    "items": [{
                        key: "customerSummary.firstName",
                        title: "FULL_NAME",
                        "readonly": true
                    }, {
                        key: "customerSummary.dateOfBirth",
                        title: "DOB",
                        type: "date",
                        "readonly": true
                    }, {
                        key: "customerSummary.pan",
                        title: "PAN",
                        "readonly": true
                    }, {
                        key: "customerSummary.pekrn",
                        condition:"customerSummary.pan == null",
                        title: "PEKRN",
                        "readonly": true
                    }, {
                        title: "AMOUNT",
                        key: "transaction.amount",
                        "readonly":true,
                        "condition":"model.transaction.submissionDone",
                        type: "amount"                        
                    },{
                        title: "AMOUNT",
                        key: "transaction.amount",
                        type: "amount", 
                        "condition":"!model.transaction.submissionDone"                        
                    },
                    
                    {
                        type: "fieldset",
                        condition: "model.customer.iscordova",
                        title: "VALIDATE_BIOMETRIC",
                        items: [{
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
                        }]
                    },
                    {
                        type: "button",
                        condition: "!model.customer.iscordova",
                        title: "VALIDATE_BIOMETRIC",
                        notitle: true,
                        fieldHtmlClass: "btn-block",
                        onClick: function(model, form, formName) {
                            var fingerprintObj = {
                                'LeftThumb': model.customer.leftHandThumpImageId,
                                'LeftIndex': model.customer.leftHandIndexImageId,
                                'LeftMiddle': model.customer.leftHandMiddleImageId,
                                'LeftRing': model.customer.leftHandRingImageId,
                                'LeftLittle': model.customer.leftHandSmallImageId,
                                'RightThumb': model.customer.rightHandThumpImageId,
                                'RightIndex': model.customer.rightHandIndexImageId,
                                'RightMiddle': model.customer.rightHandMiddleImageId,
                                'RightRing': model.customer.rightHandRingImageId,
                                'RightLittle': model.customer.rightHandSmallImageId
                            };

                            BiometricService.validate(fingerprintObj).then(function(data) {
                                model.customer.isBiometricMatched = data;
                                if (data == "Match found") {
                                    model.customer.isBiometricValidated = true;
                                } else {
                                    model.customer.isBiometricValidated = false;
                                }
                            }, function(reason) {
                                console.log(reason);
                            });
                        }
                    }, {
                        "key": "customer.isBiometricMatched",
                        condition: "(!model.additional.override_fp && model.siteCode=='KGFS') && !model.customer.iscordova",
                        "title": "Is Biometric Matched",
                        "readonly": true
                    }
                ]
                },{
                    "type": "actionbox",
                    //condition: " (!model.customerSummary.accountClosed && model.isSubmitApllicable)  && model.customer.isBiometricValidated ",
                    condition: " (!model.customerSummary.accountClosed && model.isSubmitApllicable) && !model.transaction.submissionDone",
                    "items": [{
                        "type": "submit",
                        "title": "SUBMIT"
                    }]
                },
                {
                    "type": "actionbox",
                    "condition": "model.transaction.submissionDone",
                    "items": [
                    {
                        "type": "button",
                        "style": "btn-theme",
                        "title": "Print",
                        "onClick": function(model, formCtrl, formName) {
                            var print={};
                            var repaymentInfo={
                                'customerName':model.customer.firstName,
                                'customerURN':model.customer.urnNo,
                                'branchId':model.customer.customerBranchId,
                                'repaymentAmount':model.repaymentresponse.amount,
                                'transactionType':model.repaymentresponse.mfTransactionType
                            };

                            if(model.customerSummary.folioNo == null){
                                repaymentInfo.folioNo='NEW';
                            }else{
                                repaymentInfo.folioNo=model.customerSummary.folioNo;
                            }

                            var opts = {
                                'branch': model.customer.kgfsName,
                                'entity_name': model.customer.kgfsBankName+ " KGFS",
                                'company_name': "IFMR Rural Channels and Services Pvt. Ltd.",
                                'cin': 'U74990TN2011PTC081729',
                                'address1': 'IITM Research Park, Phase 1, 10th Floor',
                                'address2': 'Kanagam Village, Taramani',
                                'address3': 'Chennai - 600113, Phone: 91 44 66687000',
                                'website': "http://ruralchannels.ifmr.co.in/",
                                'helpline': '18001029370',
                            };

                            print.thermalReceipt= MutualFund.getPrintReceipt(repaymentInfo, opts);
                            print.paperReceipt= MutualFund.getWebReceipt(repaymentInfo, opts);
                        
                            irfNavigator.go({
                                state: "Page.Engine",
                                pageName: "management.ReceiptPrint",
                                pageData: print
                            });
                        }
                    }]
                }
            ],
            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            actions: {
                submit: function(model) {
                    PageHelper.clearErrors();  
                    PageHelper.showLoader();              
                    var reqData = _.cloneDeep(model.transaction);
                    MutualFund.purchaseOrRedemption(reqData).$promise.then(function(res) {
                        model.transaction.submissionDone=true;
                        model.repaymentresponse=_.cloneDeep(res);
                        irfProgressMessage.pop("  ","transaction successful", 5000);
                    }, function(errResp) {
                        model.transaction.submissionDone=true;
                        delete model.repaymentresponse;
                        PageHelper.clearErrors();
                        PageHelper.setError({message: errResp.data.errors[Object.keys(errResp.data.errors)[0]]});
                        PageHelper.hideLoader();
                        model.isSubmitApllicable = false;
                    }).finally(PageHelper.hideLoader);
                },
                proceed: function(model, formCtrl, form, $event) {
                    PageHelper.showLoader();
                    irfNavigator.go({
                        'type': 'Page.Adhoc',
                        'PageName': 'MutualFund.MutualFundEKYC',
                    })
                    PageHelper.hideLoader();
                },
                checkIfRegistered: function(model, formCtrl, form, $event) {
                    
                        if (model.customerSummary.mutualFundSchemeMasterId == model.transaction.mutualFundSchemeId) {
                            model.transaction.mutualFundAccountProfileId = model.customerSummary.id;
                            return;
                        }                   
                    
                }
            }
        };
    }
})