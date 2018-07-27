define({
    pageUID: "MutualFund.MutualFundTransaction",
    pageType: "Engine",
    dependencies: ["$log", "$q", "Enrollment", 'EnrollmentHelper', 'PageHelper', 'formHelper', "elementsUtils",

        'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "irfNavigator", "CustomerBankBranch", "MutualFund",
    ],

    $pageFn: function($log, $q, Enrollment, EnrollmentHelper, PageHelper, formHelper, elementsUtils,
        irfProgressMessage, SessionStore, $state, $stateParams, irfNavigator, CustomerBankBranch, MutualFund) {

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
                model.transaction = { customerId: $stateParams.pageId};
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
                    PageHelper.hideLoader();
                    if (model.customerSummary.folioNo == null) {
                        model.isSubmitApllicable = false;
                        PageHelper.setError({message: "Folio number is not assigned for given mutualfundaccountprofile id"});
                    }
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
                        type: "amount",                          
                        
                    }]
                },  {
                    "type": "actionbox",
                    condition: " !model.customerSummary.accountClosed && model.isSubmitApllicable",
                    "items": [{
                        "type": "submit",
                        "title": "SUBMIT"
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
                        irfProgressMessage.pop("  ","transaction successful", 5000);
                    }, function(errResp) {
                        PageHelper.setError({message: "MutualFundNavHistory does not exist for given mutualfund scheme master id 1"});
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