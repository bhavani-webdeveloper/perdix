define({
    pageUID: "MutualFund.MutualFundAdditionalPurchase",
    pageType: "Engine",
    dependencies: ["$log", "$q", "Enrollment", 'EnrollmentHelper', 'PageHelper', 'formHelper', "elementsUtils",

        'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "irfNavigator", "CustomerBankBranch","MutualFund"
    ],

    $pageFn: function($log, $q, Enrollment, EnrollmentHelper, PageHelper, formHelper, elementsUtils,
        irfProgressMessage, SessionStore, $state, $stateParams, irfNavigator, CustomerBankBranch,MutualFund) {

        var branch = SessionStore.getBranch();
        if(false) {

        return {
            "id": "ProfileInformation",
            "type": "schema-form",
            "name": "Stage2",
            "title": "MUTUAL_FUND_ADDITIONAL_PURCHASE",
            
            initialize: function(model, form, formCtrl) {
                model.customer = model.customer || {};
                model.customer.customerType = "Individual";
                var branch1 = formHelper.enum('branch_id').data;
                var allowedBranch = [];
                for (var i = 0; i < branch1.length; i++) {
                    if ((branch1[i].name) == SessionStore.getBranch()) {
                        allowedBranch.push(branch1[i]);
                        break;
                    }
                }
                model.customer.customerBranchId = allowedBranch.length ? allowedBranch[0].value : '';
                model.customer.kgfsBankName = SessionStore.getBankName();
                $log.info(model.customer.kgfsBankName);
                $log.info(formHelper.enum('bank'));
                $log.info("ProfileInformation page got initialized:" + model.customer.customerBranchId);

                var customerId = $stateParams.pageId;

                if (customerId) {
                    Enrollment.getCustomerById({
                        id: customerId
                    }, function(resp, header) {
                        model.customer = resp;
                        model.customer.addressProofSameAsIdProof = Boolean(model.customer.title);
                        model.customer.customerBranchId = model.customer.customerBranchId || _model.customer.customerBranchId;
                        model.customer.kgfsBankName = model.customer.kgfsBankName || SessionStore.getBankName();
                        model = EnrollmentHelper.fixData(model);
                        model.customer.addressProofSameAsIdProof = Boolean(model.customer.title);
                        if (model.customer.dateOfBirth) {
                            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                        if (model.customer.spouseDateOfBirth) {
                            model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                        PageHelper.hideLoader();
                    }, function(resp) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("enrollment-save", "An Error Occurred. Failed to fetch Data", 5000);
                    });

                }
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return [
                    item["customer"]["urnNo"],
                    item["customer"]["firstName"],
                    item["customer"]["villageName"]
                ]
            },
            form: [{
                    "type": "box",
                    "title": "CUSTOMER_INFORMATION",
                    "items": [
                            {
                                key: "customer.IsKycDone",                                
                                title: "IS_KYC_DONE",
                                type: "checkbox",
                                "schema": {
                                    "default": "0"
                                }
                            },
                            {
                            key: "customer.firstName",
                            title: "FULL_NAME",
                            type: "qrcode",
                            onCapture: EnrollmentHelper.customerAadhaarOnCapture
                            },
                    
                            {
                            key: "customer.centreId",
                            type: "select",
                            "enumCode": "centre",
                            "parentEnumCode": "branch_id",
                            "parentValueExpr": "model.customer.customerBranchId",
                            },

                            {
                            key: "customer.enrolledAs",
                            type: "radios"
                            },
                        
                            {
                            key: "customer.fatherFirstName",
                            title: "FATHER_FULL_NAME"
                            },
                           
                            {
                            key: "customer.mobilePhone",
                            required: true
                            }         
                                          
                          
                    ]
                },
                
                , {
                    type: "box",
                    title: "MUTUAL_FUND_ADDITIONAL_PURCHASE",
                    items: [/*{
                            key: "customer.aadhaarNo",
                            type: "qrcode",
                            onChange: "actions.setProofs(model)",
                            onCapture: EnrollmentHelper.customerAadhaarOnCapture
                            },*/

                            {
                            type: "fieldset",
                            title: "MUTUAL FUND SCHEMES",
                            items: [{
                                    title: "Mutual Fund Scheme",
                                    key: "customer.MutualFundScheme",
                                    type: ["string","null"]
                                },
                                {
                                    title: "Mutual Fund Scheme Type",
                                    key: "customer.MutualFundSchemeType",
                                    type: ["string","null"]
                                },
                                
                                {
                                    title: "Mutual Fund Scheme Name",
                                    key: "customer.MutualFundSchemeName",
                                    type: ["string","null"]
                                },
                                {
                                   title: "Mutual Fund Scheme Option",
                                   key: "customer.MutualFundSchemeOption",
                                   type: ["string","null"]
                                }, 
                                {
                                    title: "Mutual Fund Amount",
                                    key: "customer.MutualFundSchemeType",
                                    type: ["number","null"]
                                }
                            ]
                        }, 

               
                    ]
                },             
             


                {
                    "type": "actionbox",
                    "condition": "model._mode != 'EDIT'",
                    "items": [{
                        "type": "save",
                        "title": "SAVE_OFFLINE",
                    }, {
                        "type": "submit",
                        "title": "SUBMIT"
                    }]
                },

                {
                    "type": "actionbox",
                    "condition": "model._mode == 'EDIT'",
                    "items": [{
                        "type": "save",
                        "title": "SAVE_OFFLINE",
                    }, {
                        "type": "submit",
                        "title": "SUBMIT"
                    }, {
                        "type": "button",
                        "icon": "fa fa-user-plus",
                        "title": "ENROLL_CUSTOMER",
                        "onClick": "actions.proceed(model, formCtrl, form, $event)"
                    }, {
                        "type": "button",
                        "icon": "fa fa-refresh",
                        "title": "RELOAD",
                        "onClick": "actions.reload(model, formCtrl, form, $event)"
                    }]
                },



            ],
            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            actions: {

                setProofs: function(model) {
                    model.customer.addressProofNo = model.customer.aadhaarNo;
                    model.customer.identityProofNo = model.customer.aadhaarNo;
                    model.customer.identityProof = 'Aadhar card';
                    model.customer.addressProof = 'Aadhar card';
                    model.customer.addressProofSameAsIdProof = true;
                    if (model.customer.yearOfBirth) {
                        model.customer.dateOfBirth = model.customer.yearOfBirth + '-01-01';
                    }
                },
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.customer.firstName) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },
                submit: function(model, form, formName) {

                    $log.info("Inside submit()");
                    model.customer.customerType = "Individual";
                    model.customer.title = String(model.customer.addressProofSameAsIdProof);
                  
                    model.customer.miscellaneous = null;
                    $log.warn(model);
                    if (!EnrollmentHelper.validateData(model)) {
                        $log.warn("Invalid Data, returning false");
                        return false;
                    }
                    var sortFn = function(unordered) {
                        var out = {};
                        Object.keys(unordered).sort().forEach(function(key) {
                            out[key] = unordered[key];
                        });
                        return out;

                     
                    };



                    var reqData = _.cloneDeep(model);

                    EnrollmentHelper.fixData(reqData);
                    reqData.customer.addressProofSameAsIdProof = Boolean(reqData.customer.title);
                    $log.info(JSON.stringify(sortFn(reqData)));
                    EnrollmentHelper.saveData(reqData).then(function(res) {
                        model.customer = _.clone(res.customer);
                        model = EnrollmentHelper.fixData(model);
                        model.customer.addressProofSameAsIdProof = Boolean(model.customer.title);

                        /*reqData = _.cloneDeep(model);
                        EnrollmentHelper.proceedData(reqData).then(function(res){
                            irfNavigator.goBack();
                        });*/
                        $stateParams.confirmExit = false;
                        $state.go("Page.Engine", {
                            pageName: 'ProfileInformation',
                            pageId: model.customer.id
                        });
                          MutualFund.purchaseOrRedemption(reqData).then(function(res){
                        // $stateParams.confirmExit = false;

                    }); 
                    });
                },
                proceed: function(model, formCtrl, form, $event) {
                    formCtrl.scope.$broadcast('schemaFormValidate');

                    if (formCtrl && formCtrl.$invalid) {
                        PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                        return false;
                    }
                    model.customer.ageProof = model.customer.addressProofSameAsIdProof;
                    model.customer.customerType = "Individual";
                    var reqData = _.cloneDeep(model);
                    if (reqData.customer.id && reqData.customer.currentStage === 'Stage01') {
                        $log.info("Customer id not null, skipping save");
                        EnrollmentHelper.proceedData(reqData).then(function(res) {
                            $stateParams.confirmExit = false;
                            irfNavigator.goBack();
                        });
                    }
                },
                reload: function(model, formCtrl, form, $event) {
                    $stateParams.confirmExit = false;
                    $state.go("Page.Engine", {
                        pageName: 'ProfileInformation',
                        pageId: model.customer.id
                    }, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                }
            }
        };
    }
    else {

        initialize: function(form, model, formCtrl){
            $log.info("inside else")
        }
        form [
                {type : "box",
                 title: "your EKYC Registration is not complete",
                 items: [ {
                    type: "button",
                    title: "GO TO EKYC PAGE",
                    onClick:  irfNavigator.go({
                                    state: "Page.Adhoc",

                                    pageName: "MutualFund.MutualFundEKYC",
                                    pageId: $stateParams.pageId,
                                }
                                )
                 }


                 ]


                }
        ]

    }

 
    }
})