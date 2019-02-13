define({
    pageUID: "base.dashboard.loans.individual.screening.detail.BasicDetails",
    pageType: "Engine",
    dependencies: ["$log","$state", "Enrollment", "formHelper", "filterFilter", "irfCurrencyFilter", "Model_ELEM_FC", "CreditBureau", "irfElementsConfig", "$filter","SchemaResource","$q","SessionStore","BundleManager","PageHelper","Utils","IndividualLoan"],
    $pageFn: function($log,$state, Enrollment, formHelper, filterFilter, irfCurrencyFilter, Model_ELEM_FC, CreditBureau, irfElementsConfig, $filter,SchemaResource,$q,SessionStore,BundleManager,PageHelper,Utils,IndividualLoan) {
        var navigateToQueue = function(model) {
            BundleManager.deleteOffline().then(function() {
                PageHelper.showProgress("loan-offline", "Offline record cleared", 5000);
            });

            if (model.currentStage == 'Screening')
                $state.go('Page.Engine', {
                    pageName: 'base.dashboard.loans.individual.screening.ScreeningQueue',
                    pageId: null
                });
            if (model.currentStage == 'Dedupe')
                $state.go('Page.Engine', {
                    pageName: 'base.dashboard.loans.individual.screening.DedupeQueue',
                    pageId: null
                });
            if (model.currentStage == 'ScreeningReview')
                $state.go('Page.Engine', {
                    pageName: 'base.dashboard.loans.individual.screening.ScreeningReviewQueue',
                    pageId: null
                });
            if (model.currentStage == 'Application')
                $state.go('Page.Engine', {
                    pageName: 'base.dashboard.loans.individual.screening.ApplicationQueue',
                    pageId: null
                });
            if (model.currentStage == 'ApplicationReview')
                $state.go('Page.Engine', {
                    pageName: 'base.dashboard.loans.individual.screening.ApplicationReviewQueue',
                    pageId: null
                });
            if (model.currentStage == 'FieldAppraisal')
                $state.go('Page.Engine', {
                    pageName: 'base.dashboard.loans.individual.screening.FieldAppraisalQueue',
                    pageId: null
                });
            if (model.currentStage == 'RCU')
                $state.go('Page.Engine', {
                    pageName: 'base.dashboard.loans.individual.screening.RcuQueue',
                    pageId: null
                });
            if (model.currentStage == 'FieldAppraisalReview')
                $state.go('Page.Engine', {
                    pageName: 'base.dashboard.loans.individual.screening.FieldAppraisalReviewQueue',
                    pageId: null
                });
            if (model.currentStage == 'CreditCommitteeReview')
                $state.go('Page.Engine', {
                    pageName: 'base.dashboard.loans.individual.screening.CreditCommitteeReviewQueue',
                    pageId: null
                });
            if (model.currentStage == 'CentralRiskReview')
                $state.go('Page.Engine', {
                    pageName: 'base.dashboard.loans.individual.screening.CentralRiskReviewQueue',
                    pageId: null
                });
            if (model.currentStage == 'ZonalRiskReview')
                $state.go('Page.Engine', {
                    pageName: 'base.dashboard.loans.individual.screening.ZonalRiskReviewQueue',
                    pageId: null
                });
            if (model.currentStage == 'Sanction')
                $state.go('Page.Engine', {
                    pageName: 'base.dashboard.loans.individual.screening.LoanSanctionQueue',
                    pageId: null
                });
            if (model.currentStage == 'Rejected')
                $state.go('Page.LoanOriginationDashboard', null);
        }

        var getStageNameByStageCode = function(stageCode) {
            var stageName = $filter('translate')(stageCode) || stageCode;
            return stageName;
        };
        var appendPrefix = function(model, form) {
            if(model.loanAccount.currentStage == 'RCU') {
                if(model.loanAccount.documents.length != 0) {
                    model.loanAccount.documents[form.arrayIndex].remarks = "RCUStageDocuments-" + model.loanAccount.documents[form.arrayIndex].document;
                }
            }
        }
        var preLoanSaveOrProceed = function(model){
            var loanAccount = model.loanAccount;
    
            if (_.hasIn(loanAccount, 'status') && loanAccount.status == 'HOLD'){
                loanAccount.status = null;
            }
    
            if (_.hasIn(loanAccount, 'guarantors') && _.isArray(loanAccount.guarantors)){
                for (var i=0;i<loanAccount.guarantors.length; i++){
                    var guarantor = loanAccount.guarantors[i];
                    if (!_.hasIn(guarantor, 'guaUrnNo') || _.isNull(guarantor, 'guaUrnNo')){
                        PageHelper.showProgress("pre-save-validation", "All guarantors should complete the enrolment before proceed",5000);
                        return false;
                    }
    
                }
            }
    
            if (_.hasIn(loanAccount, 'collateral') && _.isArray(loanAccount.collateral)){
                _.forEach(loanAccount.collateral, function(collateral){
                    if (!_.hasIn(collateral, "id") || _.isNull(collateral.id)){
                        /* ITS A NEW COLLATERAL ADDED */
                        collateral.quantity = collateral.quantity || 1;
                        collateral.loanToValue = collateral.collateralValue;
                        collateral.totalValue = collateral.loanToValue * collateral.quantity;
                    }
                })
            }
            // Psychometric Required for applicants & co-applicants
            if (_.isArray(loanAccount.loanCustomerRelations)) {
                var psychometricIncomplete = false;
                var enterpriseCustomerRelations = model.customer.enterpriseCustomerRelations;
                for (i in loanAccount.loanCustomerRelations) {
                    if (loanAccount.loanCustomerRelations[i].relation == 'Applicant') {
                        loanAccount.loanCustomerRelations[i].psychometricRequired = 'YES';
                    } else if (loanAccount.loanCustomerRelations[i].relation == 'Co-Applicant') {
                        if (_.isArray(enterpriseCustomerRelations)) {
                            var psychometricRequiredUpdated = false;
                            for (j in enterpriseCustomerRelations) {
                                if (enterpriseCustomerRelations[j].linkedToCustomerId == loanAccount.loanCustomerRelations[i].customerId && _.lowerCase(enterpriseCustomerRelations[j].businessInvolvement) == 'full time') {
                                    loanAccount.loanCustomerRelations[i].psychometricRequired = 'YES';
                                    psychometricRequiredUpdated = true;
                                }
                            }
                            if (!psychometricRequiredUpdated) {
                                loanAccount.loanCustomerRelations[i].psychometricRequired = 'NO';
                            }
                        } else {
                            loanAccount.loanCustomerRelations[i].psychometricRequired = 'NO';
                        }
                    } else {
                        loanAccount.loanCustomerRelations[i].psychometricRequired = 'NO';
                    }
                    if (!loanAccount.loanCustomerRelations[i].psychometricCompleted) {
                        loanAccount.loanCustomerRelations[i].psychometricCompleted = 'NO';
                    }
                    if (loanAccount.loanCustomerRelations[i].psychometricRequired == 'YES' && loanAccount.loanCustomerRelations[i].psychometricCompleted == 'NO') {
                            psychometricIncomplete = true;
                    }
                }
                if (psychometricIncomplete) {
                    loanAccount.psychometricCompleted = 'N';
                }
            }
    
            return true;
        }
        return {
            "type": "schema-form",
            "title": "Basic Details",
            "subTitle": "",
            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                var self = this;
                model.bundlePageObj = bundlePageObj;
                model.bundleModel = bundleModel;
                model.currentStage = bundleModel.currentStage;
                model.linkedAccount={};
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                model.review = model.review || {};
                model.temp = model.temp || {}
                BundleManager.pushEvent('loanAccount', model._bundlePageObj, model.loanAccount);
                model.mitigantsChanged=0;
                model.loanMitigants= model.loanAccount.loanMitigants;
                          
                Enrollment.getCustomerById({
                    id: model.customerId
                }).$promise.then(function(res) {
                    console.log(res);
                    model.customer = res;
                    model.firstName = res.firstName;
                    model.customer.presetAddress = 'Present Address';
                });
              
            },

            form: [{
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "title": "Personal Details",
                    "overrideType": "default-view",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "customer.id",
                                "title": "CUSTOMER_ID"
                            }, {
                                "key": "customer.firstName",
                                "title": "FULL_NAME"
                            }, {
                                "key": "customer.gender"
                            }, {
                                "key": "customer.dateOfBirth"
                            }, {
                                "key": "customer.identityProofNo",
                                "title": "ID Proof N0."
                            }, {
                                "key": "customer.identityProof",
                                "title": "ID Proof Type"
                            }, {
                                "key": "customer.addressProofNo",
                                "title": "Address Proof No."
                            }, {
                                "key": "customer.addressProof",
                                "title":"Address Proof Type"
                            }, {
                                "key": "customer.language",
                                "title": "PREFERRED_LANGUAGE"
                            }, {
                                "key": "customer.mobilePhone",
                                "title": "MOBILE_NO",
                                "inputmode": "number",
                                "numberType": "tel"
                            }, {
                                "key": "customer.email",
                                "title": "EMAIL"
                            }, {  
                                "type": "section",                                
                                "htmlClass": "row",
                                "items": [
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-4",
                                        "html": '<h5>' + "Present Address" + '</h5>'
                                    },
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-8",
                                        "html": '<p style = "font-size: 14px; color: #555;"><strong>{{model.customer.doorNo}} <br />\
                                        {{model.customer.street}} <br />\
                                        {{model.customer.district}} <br />\
                                        {{model.customer.state}} <br /> \
                                        {{model.customer.pincode}} <br /> \
                                        <br /><strong></p>\
                                        '
                                    }]
                                       
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "customer.urnNo",
                                "title": "URN"
                            }, {
                                "key": "customer.religion"
                            }, {
                                "key": "customer.caste",
                                "title": "CASTE"
                            }, {
                                "key": "customer.fatherFirstName",
                                "title": "FATHER_FULL_NAME",
                            }, {
                                "key": "customer.motherName",
                                "title": "Mother's Full Name"
                            }, {
                                "key": "customer.maritalStatus"
                            }, {
                                "key": "customer.spouseFirstName",
                                "title": "SPOUSE_FULL_NAME",
                                "condition": "model.customer.maritalStatus && model.customer.maritalStatus.toUpperCase() == 'MARRIED'"
                            }, {
                                "key": "customer.spouseDateOfBirth",
                                "condition": "model.customer.maritalStatus && model.customer.maritalStatus.toUpperCase() == 'MARRIED' "
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "customer.photoImageId",
                                "type": "file",
                                "fileType": "image/*",
                                "notitle": true,
                                category: "Loan",
                                subCategory: "COLLATERALPHOTO"
                            }]

                        }]
                    }]
                },{
                    "type": "box",
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "Basic Business Information",
                    "readonly": true,
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "customer.id",
                                "title": "Entity ID"
                            }, {
                                "key": "customer.firstName",
                                "title": "Company Name"
                            }, {
                                "key": "customer.enterprise.businessType",
                                "title": "Business Type"
                            }, {
                                "key": "customer.enterprise.businessActivity",
                                "title": "Business Activity"
                            }, {
                                "key": "customer.enterprise.businessSector",
                                "title": "Business Sector"
                            }, {
                                "key": "customer.enterprise.businessSubsector",
                                "title": "Business Subsector"
                            }, {
                                "key": "customer.enterprise.referredBy",
                                "title": "Sourced by"
                            }, {
                                "key": "customer.enterprise.isGSTAvailable",
                                "title": "GST Available"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "customer.urnNo",
                                "title": "URN"
                            }, {
                                "key": "customer.enterprise.businessConstitution",
                                "title": "Constitution"
                            }, {
                                "key": "customer.enterprise.businessHistory",
                                "title": "Business History"
                            }, {
                                "key": "customer.enterprise.ownership",
                                "title": "Premises Ownership"
                            }, {
                                "key": "customer.enterprise.businessInPresentAreaSince",
                                "title": "Operating Since"
                            }, {
                                "key": "customer.enterprise.anyPartnerOfPresentBusiness",
                                "title": "Has anyone else been a partner of your present business ?"
                            }]
    
                        }]
                    }]
                }, {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "Contact Information",
                    "readonly": true,
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "customer.mobilePhone",
                                "title": "Mobile Phone"
                            }, {
                                "key": "customer.landLineNo",
                                "title": "Phone 2"
                            }, {
                                "key": "customer.distanceFromBranch",
                                "title": "Distance From Hub"
                            }, {
                                "key": "customer.enterprise.businessInPresentAreaSince",
                                "title": "YEARS_OF_BUSINESS_PRESENT_AREA"
                            }, {
                                "key": "customer.enterprise.businessInCurrentAddressSince",
                                "title": "YEARS_OF_BUSINESS_PRESENT_ADDRESS"
                            }, {
                                "key": "customer.enterprise.companyEmailId",
                                "title": "Email ID"
                            }, {
                                "title": "Present Address",
                                "key": "customer.presetAddress"
    
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "type": "section",
                                "html": '<div style="float:right"></div>',
                                "items": [{
                                    "key": "customer.latitude",
                                    "notitle": true,
                                    "type": "geotag",
                                    "latitude": "customer.latitude",
                                    "longitude": "customer.longitude"
                                }]
                            }]
                        }]
                    }]
                },{
                    "type": "box",
                    "readonly": true,
                    "colClass": "col-sm-12",
                    "overrideType": "default-view",
                    "title": "Preliminary Loan Information",
                    "items": [{
                        "type": "grid",
                        "orientation": "horizontal",
                        "items": [{
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.transactionType",
                                "title": "TRANSACTION_TYPE"
                            },
                            {
                                "key": "loanAccount.linkedAccountNumber",
                                "title": "LINKED_ACCOUNT_NUMBER",
                                "condition": "model.loanAccount.transactionType.toLowerCase() == 'renewal'"
                            },
                            {
                                "key": "loanAccount.baseLoanAccount",
                                "title": "BASE_LOAN_ACCOUNT",
                                "condition": "model.loanAccount.baseLoanAccount"
    
                            },
                            {
                                "key": "loanAccount.loanPurpose1",
                                "title": "Loan Purpose"
                            }, {
                                "key": "loanAccount.loanPurpose2",
                                "title": "Loan SubPurpose"
                            }, {
                                "key": "loanAccount.loanAmountRequested",
                                "title": "Loan Amount Requested",
                                "type": "amount"
                            }, {
                                "key": "loanAccount.emiPaymentDateRequested",
                                "title": "Requested EMI Payment Date"
                            }, {
                                "key": "loanAccount.expectedPortfolioInsurancePremium",
                                "title": "Expected Portfolio Insurance Premium",
                                "type": "amount"
                            }]
                        }, {
                            "type": "grid",
                            "orientation": "vertical",
                            "items": [{
                                "key": "loanAccount.frequencyRequested",
                                "title": "Requested Frequency",
                            }, {
                                "key": "loanAccount.tenureRequested",
                                "title": "Requested Tenure"/*,
                                "type": "number"*/
                            }, {
                                "key": "loanAccount.expectedInterestRate",
                                "title": "Expected Interest Rate",
                            }, {
                                "key": "loanAccount.estimatedEmi",
                                "title": "EXPECTED_MAITREYA_EMI",
                                "type": "amount"
                            }, {
                                "key": "loanAccount.emiRequested",
                                "title": "Requested EMI",
                                "type": "amount"
                            }]
                        }]
                    }]
                },{
                    "type": "box",
                    "title": "Documents",
                    "colClass": "col-sm-12",
                    "items": [  {
                        "key": "loanAccount.documents",
                        "type": "array",
                        "title": "Documents",
                        "items": [
                            {
                                key:"loanAccount.documents[].document",
                                type:"text",
                                title:"Document Name",
                                required: true,
                                onChange:function(value,form,model){
                                    appendPrefix(model, form);
                                }
                            },
                            {
                                key:"loanAccount.documents[].documentId",
                                title : "Upload",
                                type:"file",
                                required: true,
                                category: "Loan",
                                subCategory: "DOC3",
                            },
                            
                        ]
                    },]
                },{
                    "type": "box",
                    "title": "Post Review Decision",
                    "colClass": "col-sm-12",
                    "items": [{
                        key: "review.action",
                        type: "radios",
                        titleMap: {
                            "REJECT": "REJECT",
                            "SEND_BACK": "SEND_BACK",
                            "PROCEED": "PROCEED",
                            "HOLD": "HOLD"
                        }
                    }, {
                        type: "section",
                        htmlClass: "col-sm-8",
                        condition: "model.review.action=='REJECT'",
                        items: [{
                            title: "REMARKS",
                            key: "review.remarks",
                            type: "textarea",
                            required: true
                        }, {
                            key: "loanAccount.rejectReason",
                            type: "lov",
                            autolov: true,
                            required: true,
                            title: "REJECT_REASON",
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                var stage1 = model.currentStage;
    
                                if (model.currentStage == 'Application' || model.currentStage == 'ApplicationReview') {
                                    stage1 = "Application";
                                }
                                if (model.currentStage == 'FieldAppraisal' || model.currentStage == 'FieldAppraisalReview') {
                                    stage1 = "FieldAppraisal";
                                }
    
                                var rejectReason = formHelper.enum('application_reject_reason').data;
                                var out = [];
                                for (var i = 0; i < rejectReason.length; i++) {
                                    var t = rejectReason[i];
                                    if (t.field1 == stage1) {
                                        out.push({
                                            name: t.name,
                                        })
                                    }
                                }
                                return $q.resolve({
                                    headers: {
                                        "x-total-count": out.length
                                    },
                                    body: out
                                });
                            },
                            onSelect: function(valueObj, model, context) {
                                model.loanAccount.rejectReason = valueObj.name;
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.name
                                ];
                            }
                        }, {
                            key: "review.rejectButton",
                            type: "button",
                            title: "REJECT",
                            required: true,
                            onClick: "actions.reject(model, formCtrl, form, $event)"
                        }]
                    }, {
                        type: "section",
                        htmlClass: "col-sm-8",
                        condition: "model.review.action=='HOLD'",
                        items: [{
                            title: "REMARKS",
                            key: "review.remarks",
                            type: "textarea",
                            required: true
                        }, {
                            key: "review.holdButton",
                            type: "button",
                            title: "HOLD",
                            required: true,
                            onClick: "actions.hold(model, formCtrl, form, $event)"
                        }]
                    }, {
                        type: "section",
                        htmlClass: "col-sm-8",
                        condition: "model.review.action=='SEND_BACK'",
                        items: [{
                            title: "REMARKS",
                            key: "review.remarks",
                            type: "textarea",
                            required: true
                        }, {
                            key: "review.targetStage1",
                            type: "lov",
                            autolov: true,
                            lovonly:true,
                            title: "SEND_BACK_TO_STAGE",
                            bindMap: {},
                            searchHelper: formHelper,
                            search: function(inputModel, form, model, context) {
                                var stage1 = model.currentStage;
                                var targetstage = formHelper.enum('targetstage').data;
                                var out = [];
                                for (var i = 0; i < targetstage.length; i++) {
                                    var t = targetstage[i];
                                    if (t.field1 == stage1) {
                                        out.push({
                                            name: getStageNameByStageCode(t.name),
                                            value:t.code
                                        })
                                    }
                                }
                                return $q.resolve({
                                    headers: {
                                        "x-total-count": out.length
                                    },
                                    body: out
                                });
                            },
                            onSelect: function(valueObj, model, context) {
                                model.review.targetStage1 = valueObj.name;
                                model.review.targetStage = valueObj.value;
    
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.name
                                ];
                            }
                        }, {
                            key: "review.sendBackButton",
                            type: "button",
                            title: "SEND_BACK",
                            onClick: "actions.sendBack(model, formCtrl, form, $event)"
                        }]
                    }, {
                        type: "section",
                        htmlClass: "col-sm-8",
                        condition: "model.review.action=='PROCEED'",
                        items: [{
                            title: "REMARKS",
                            key: "review.remarks",
                            type: "textarea",
                            required: true
                        }, {
                            key: "review.proceedButton",
                            type: "button",
                            title: "PROCEED",
                            onClick: "actions.proceed(model, formCtrl, form, $event)"
                        }]
                    }]
                }, {
                    "type": "actionbox",
                    "condition": "model.customerId",
                    "items": [{
                        "type": "button",
                        "icon": "fa fa-circle-o",
                        "title": "SAVE",
                        "onClick": "actions.save(model, formCtrl, form, $event)"
                    }]
                }
            ],

            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            eventListeners: {
            },
            actions: {
                save: function(model, formCtrl, form, $event) {
                    $log.info("Inside save()");
                    PageHelper.clearErrors();
                    if(PageHelper.isFormInvalid(formCtrl)) {
                        return false;
                    }
                    model.loanAccount.loanMitigants = [];
                    
                    if (model.loanAccount.documents.length != 0) {
                        for (var i = 0; i < model.loanAccount.documents.length; i++) {
                            model.loanAccount.loanDocuments.push(model.loanAccount.documents[i]);
                        }
                    }
                    //model.loanAccount.loanDocuments = [];
                    if (model.loanAccount.loanDocuments.length) {
                        for (var i = 0; i < model.loanAccount.loanDocuments.length; i++) {
                            model.loanAccount.loanDocuments[i].loanId = model.loanAccount.id;
                            model.loanAccount.loanDocuments[i].documentStatus = null;
                            model.loanAccount.loanDocuments[i].version = 0;
                        }
                    }
                    console.log(_.cloneDeep(model.loanAccount));
                    _.forOwn(model.allMitigants, function(v, k) {
                        if (v.selected) {
                            model.loanAccount.loanMitigants.push(v);
                        }
                    })
                    if (!preLoanSaveOrProceed(model)){
                        return;
                    }
                    model.mitigantsChanged= (model.loanMitigants.length== model.loanAccount.loanMitigants.length)?0:1;
                    Utils.confirm(model.mitigantsChanged==0?"Are You Sure?":"Mitigants have chnaged . Are you sure?")
                    .then(
                        function() {
                            model.mitigantsChanged=0;
                            model.loanMitigants=model.loanAccount.loanMitigants;
                            model.temp.loanCustomerRelations = model.loanAccount.loanCustomerRelations;
                            var reqData = {
                                loanAccount: _.cloneDeep(model.loanAccount)
                            };
                            console.log(reqData);
                            reqData.loanProcessAction = "SAVE";
                           // reqData.loanAccount.screeningDate = reqData.loanAccount.screeningDate || Utils.getCurrentDate();
                          //  reqData.loanAccount.psychometricCompleted = reqData.loanAccount.psychometricCompleted || "N";

                            PageHelper.showLoader();
                         

                            var completeLead = false;
                            if (!_.hasIn(reqData.loanAccount, "id")) {
                                completeLead = true;
                            }
                            IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res) {

                                model.loanAccount = res.loanAccount;
                                if (model.temp.loanCustomerRelations && model.temp.loanCustomerRelations.length) {
                                    for (i in model.temp.loanCustomerRelations) {
                                        for (j in model.loanAccount.loanCustomerRelations) {
                                            if (model.temp.loanCustomerRelations[i].customerId == model.loanAccount.loanCustomerRelations[i].customerId) {
                                                model.loanAccount.loanCustomerRelations[i].name = model.temp.loanCustomerRelations[i].name;
                                            }
                                        }
                                    }
                                }

                                if (completeLead === true && _.hasIn(model, "lead.id")) {
                                    var reqData = {
                                        lead: _.cloneDeep(model.lead),
                                        stage: "Completed"
                                    }

                                    reqData.lead.leadStatus = "Complete";
                                    LeadHelper.proceedData(reqData)
                                }
                            }, function(httpRes) {
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function(httpRes) {
                                PageHelper.hideLoader();
                                BundleManager.updateOffline();
                            })
                        }
                    );
                },
                reject: function(model, formCtrl, form, $event) {
                    $log.info("Inside reject()");
                    if (model.review.remarks == null || model.review.remarks == "") {
                        PageHelper.showProgress("update-loan", "Remarks is mandatory");
                        return false;
                    }
                    if (model.loanAccount.rejectReason == null || model.loanAccount.rejectReason == "") {
                        PageHelper.showProgress("update-loan", "Reject Reason is mandatory");
                        return false;
                    }
                    Utils.confirm("Are You Sure?").then(function() {

                        var reqData = {
                            loanAccount: _.cloneDeep(model.loanAccount)
                        };
                        reqData.loanAccount.status = 'REJECTED';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.stage = "Rejected";
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                return navigateToQueue(model);
                            }, function(httpRes) {
                                PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                    })

                },
                hold: function(model, formCtrl, form, $event) {
                    $log.info("Inside Hold()");
                    PageHelper.clearErrors();
                    if (!preLoanSaveOrProceed(model)){
                    return;
                }

                    if (model.review.remarks == null || model.review.remarks == "") {
                        PageHelper.showProgress("update-loan", "Remarks is mandatory");
                        return false;
                    }

                    Utils.confirm("Are You Sure?")
                        .then(
                            function() {
                              var reqData = {
                                    loanAccount: _.cloneDeep(model.loanAccount)
                                };
                                reqData.loanAccount.status = 'HOLD';
                                reqData.loanProcessAction = "SAVE";
                                //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                                reqData.remarks = model.review.remarks;
                                PageHelper.showLoader();
                                IndividualLoan.create(reqData)
                                    .$promise
                                    .then(function(res) {

                                        BundleManager.pushEvent('new-loan', model._bundlePageObj, {
                                            loanAccount: model.loanAccount
                                        });
                                        return navigateToQueue(model);
                                    }, function(httpRes) {
                                        PageHelper.showErrors(httpRes);
                                    })
                                    .finally(function(httpRes) {
                                        PageHelper.hideLoader();
                                    })
                            }
                        );

                },
                sendBack: function(model, formCtrl, form, $event) {
                    $log.info("Inside sendBack()");
                    PageHelper.clearErrors();

                     if (model.review.remarks==null || model.review.remarks =="" || model.review.targetStage==null || model.review.targetStage==""){
                         PageHelper.showProgress("update-loan", "Send to Stage / Remarks is mandatory");
                         return false;
                     }

                     if (!preLoanSaveOrProceed(model)){
                         return;
                     }
                    Utils.confirm("Are You Sure?").then(function() {

                        var reqData = {
                            loanAccount: _.cloneDeep(model.loanAccount)
                        };
                        reqData.loanAccount.status = null;
                        if (model.loanAccount.currentStage == 'CreditCommitteeReview') {
                            reqData.loanAccount.status = 'REJECTED'
                        }

                        reqData.loanProcessAction = "PROCEED";
                        reqData.remarks = model.review.remarks;
                        reqData.stage = model.review.targetStage;
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        if (model.loanAccount.currentStage == "Rejected") {
                            model.loanAccount.status = null;
                            model.customer.properAndMatchingSignboard = null;
                            model.customer.bribeOffered = null;
                            model.customer.shopOrganized = null;
                            model.customer.isIndustrialArea = null;
                            model.customer.customerAttitudeToKinara = null;
                            model.customer.bookKeepingQuality = null;
                            model.customer.challengingChequeBounce = null;
                            model.customer.allMachinesAreOperational = null;
                            model.customer.employeeSatisfaction = null;
                            model.customer.politicalOrPoliceConnections = null;
                            model.customer.multipleProducts = null;
                            model.customer.multipleBuyers = null;
                            model.customer.seasonalBusiness = null;
                            model.customer.incomeStability = null;
                            model.customer.utilisationOfBusinessPremises = null;
                            model.customer.approachForTheBusinessPremises = null;
                            model.customer.safetyMeasuresForEmployees = null;
                            model.customer.childLabours = null;
                            model.customer.isBusinessEffectingTheEnvironment = null;
                            model.customer.stockMaterialManagement = null;
                            model.customer.customerWalkinToBusiness = null;
                            var cusData = {
                                customer: _.cloneDeep(model.customer)
                            };
                            EnrollmentHelper.proceedData(cusData).then(function(resp) {
                                formHelper.resetFormValidityState(form);
                            }, function(httpRes) {
                                PageHelper.showErrors(httpRes);
                            });
                        }
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                return navigateToQueue(model);
                            }, function(httpRes) {
                                PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                    })


                },
                proceed: function(model, formCtrl, form, $event) {
                    $log.info("Inside Proceed()");
                    PageHelper.clearErrors();
                    if(PageHelper.isFormInvalid(formCtrl)) {
                        return false;
                    }
                    var autoRejected = false;
                    if (!preLoanSaveOrProceed(model)) {
                        return;
                    }
                    model.mitigantsChanged= (model.loanMitigants.length== model.loanAccount.loanMitigants.length)?0:1;
                   
                    Utils.confirm(model.mitigantsChanged==0?"Are You Sure?":"Mitigants have Chanegd. Are you sure?").then(function() {
                        var mandatoryPromises = [];
                        var mandatoryToProceedLoan = {
                            "Dedupe": true
                        };

                        model.mitigantsChanged=0;
                                        model.loanMitigants=model.loanAccount.loanMitigants;
                        var reqData = {
                            loanAccount: _.cloneDeep(model.loanAccount)
                        };
                        //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        if (model.currentStage == 'Sanction') {
                            reqData.stage = 'LoanInitiation';
                        }
                        PageHelper.showProgress("update-loan", "Working...");

                        if (reqData.loanAccount.currentStage == 'Screening') {
                            
                            // Dedupe call
                            if (DedupeEnabled == 'Y') {
                                var p3 = Queries.getDedupeDetails({
                                    "ids": dedupeCustomerIdArray
                                }).then(function(d) {
                                    console.log(d);

                                    if (d.length != dedupeCustomerIdArray.length) {
                                        PageHelper.showProgress("dedupe-status", "Not all customers have done dedupe", 5000);
                                        mandatoryToProceedLoan['Dedupe'] = false;
                                        return;
                                    }

                                    for (var i = 0; i < d.length; i++) {
                                        var item = d[i];
                                        if (item.status != 'finished') {
                                            if (item.status == 'failed') {
                                                PageHelper.showProgress("dedupe-status", "Dedupe has failed. Please Contact IT", 5000);
                                            } else {
                                                PageHelper.showProgress("dedupe-status", "Dedupe process is not completed for all the customers. Please save & try after some time", 5000);
                                            }
                                            mandatoryToProceedLoan['Dedupe'] = false;
                                            break;
                                        }
                                    }

                                    for (var i = 0; i < d.length; i++) {
                                        item = d[i];
                                        if (item.duplicate_above_threshold_count != null && item.duplicate_above_threshold_count > 0) {
                                            reqData.stage = 'Dedupe';
                                            break;
                                        }
                                    }
                                })

                                mandatoryPromises.push(p3);
                            }
                        }

                        $q.all(mandatoryPromises)
                            .then(function() {
                                try {
                                    $log.info("All promises resolved. ")
                                    if (mandatoryToProceedLoan["Dedupe"] == false) {
                                        throw new Error("Dedupe is preventing Loan proceed");
                                    }

                                    reqData.loanAccount.psychometricCompleted = model.loanAccount.psychometricCompleted;
                                    reqData.loanAccount.loanCustomerRelations = _.cloneDeep(model.loanAccount.loanCustomerRelations);
                                    if (autoRejected) {
                                        reqData.loanAccount.rejectReason = reqData.remarks = "Loan Application Auto-Rejected due to Negative Proxy Indicators";
                                    }

                                    IndividualLoan.update(reqData)
                                        .$promise
                                        .then(function(res) {

                                            if (res.stage == "Rejected" && autoRejected) {
                                                Utils.alert("Loan Application Auto-Rejected due to Negative Proxy Indicators");
                                            }

                                            PageHelper.showProgress("update-loan", "Done.", 3000);
                                            return navigateToQueue(model);
                                        }, function(httpRes) {
                                            PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                            PageHelper.showErrors(httpRes);
                                        })
                                        .finally(function() {
                                            PageHelper.hideLoader();
                                        })
                                } catch (e) {
                                    PageHelper.hideLoader();
                                    PageHelper.showProgress("update-loan", "Unable to proceed Loan.", 3000);
                                }

                            }, function(res) {
                                PageHelper.hideLoader();
                                PageHelper.showErrors(res);
                            });

                    })
                }

            }
        }
    }
})