irf.pageCollection.factory(irf.page("loans.individual.screening.LoanRequest"),
["$log", "$q","LoanAccount", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
"BundleManager", "PsychometricTestService",
function($log, $q, LoanAccount, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
    BundleManager, PsychometricTestService){

    var branch = SessionStore.getBranch();

    var validateForm = function(formCtrl){
        formCtrl.scope.$broadcast('schemaFormValidate');
        if (formCtrl && formCtrl.$invalid) {
            PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
            return false;
        }
        return true;
    }

    var navigateToQueue = function(model){
        if(model.currentStage=='Screening')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ScreeningQueue', pageId:null});
        if(model.currentStage=='ScreeningReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ScreeningReviewQueue', pageId:null});
        if(model.currentStage=='Application') {
            PsychometricTestService.start(model.loanAccount.applicant, model.loanAccount.id).then(function(resp){
                PageHelper.showLoader();
                IndividualLoan.get({
                    id: resp.applicationId
                }, function(reqData) {
                    reqData.psychometricCompleted = 'Completed';
                    IndividualLoan.update({
                        loanProcessAction: 'PROCEED',
                        loanAccount: reqData
                    }).$promise.then(function(loanResp){
                        $state.go('Page.Engine', {pageName: 'loans.individual.booking.ApplicationQueue', pageId:null});
                    }, function(loanErrResp) {
                        $log.error('IndividualLoan update failed');
                        $state.go('Page.Engine', {pageName: 'psychometric.Queue', pageId: null});
                        $log.error(loanErrResp);
                    }).finally(function(){
                        PageHelper.hideLoader();
                    });
                });
            }, function(errResp) {
                $log.error('Psychometric Test failed');
                $log.error(errResp);
                $state.go('Page.Engine', {pageName: 'psychometric.Queue', pageId: null});
            });
        }
        if(model.currentStage=='ApplicationReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ApplicationReviewQueue', pageId:null});
        if (model.currentStage == 'FieldAppraisal')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.FieldAppraisalQueue', pageId:null});
        if (model.currentStage == 'FieldAppraisalReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.FieldAppraisalReviewQueue', pageId:null});
        if (model.currentStage == 'CreditCommitteeReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.CreditCommitteeReviewQueue', pageId:null});
        if (model.currentStage == 'CentralRiskReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.CentralRiskReviewQueue', pageId:null});
        if (model.currentStage == 'Sanction')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.LoanSanctionQueue', pageId:null});
    }

    var populateDisbursementSchedule=function (value,form,model){
        PageHelper.showProgress("loan-create","Verify Disbursement Schedules",5000);
        model.loanAccount.disbursementSchedules=[];
        for(var i=0;i<value;i++){
            model.loanAccount.disbursementSchedules.push({
                trancheNumber:""+(i+1),
                disbursementAmount:0
            });
        }
        if (value ==1){
            model.loanAccount.disbursementSchedules[0].disbursementAmount = model.loanAccount.loanAmountRequested;
        }

    }

    return {
        "type": "schema-form",
        "title": "LOAN_REQUEST",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            model.currentStage = bundleModel.currentStage;
            if (_.hasIn(model, 'loanAccount')){
                $log.info('Printing Loan Account');
                $log.info(model.loanAccount);

            } else {
                model.customer = model.customer || {};
                model.customer.customerType = "Enterprise";
                model.loanAccount = {};
                model.loanAccount.loanCustomerRelations = [];
                model.loanAccount.frequency = 'M';
                model.loanAccount.isRestructure = false;
                model.loanAccount.documentTracking = "PENDING";    
                /* END OF TEMP CODE */
            }
            if (bundlePageObj){
                model._bundlePageObj = _.cloneDeep(bundlePageObj);
            }
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                item.customer.firstName,
                item.customer.centreCode,
                item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
            ]
        },
        eventListeners: {
            "new-applicant": function(bundleModel, model, params){
                $log.info("Inside new-applicant of LoanRequest");
                var addToRelation = true;
                for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                    if (model.loanAccount.loanCustomerRelations[i].customerId == params.customer.id) {
                        addToRelation = false;
                        if (params.customer.urnNo)
                            model.loanAccount.loanCustomerRelations[i].urn =params.customer.urnNo;
                        break;
                    }
                }

                if (addToRelation){
                    model.loanAccount.loanCustomerRelations.push({
                        'customerId': params.customer.id,
                        'relation': "Applicant",
                        'urn':params.customer.urnNo
                    });
                    model.loanAccount.applicant = params.customer.urnNo;
                }
                /* TODO remove this later */
                if (!_.hasIn(model.loanAccount, "customerId") || model.loanAccount.customerId == null){
                    model.loanAccount.customerId = params.customer.id;
                }
            },
            "new-co-applicant": function(bundleModel, model, params){
                $log.info("Insdie new-co-applicant of LoanRequest");
                // model.loanAccount.coApplicant = params.customer.id;
                var addToRelation = true;
                for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                    if (model.loanAccount.loanCustomerRelations[i].customerId == params.customer.id) {
                        addToRelation = false;
                        if (params.customer.urnNo)
                            model.loanAccount.loanCustomerRelations[i].urn =params.customer.urnNo;
                        break;
                    }
                }

                if (addToRelation) {
                    model.loanAccount.loanCustomerRelations.push({
                        'customerId': params.customer.id,
                        'relation': "Co-Applicant",
                        'urn':params.customer.urnNo
                    })    
                }
            },
            "new-business": function(bundleModel, model, params){
                $log.info("Inside new-business of LoanRequest");
                model.loanAccount.customerId = params.customer.id;
                model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                model.loanAccount.loanCentre.branchId = params.customer.customerBranchId;
                model.loanAccount.loanCentre.centreId = params.customer.centreId;
            },
            "new-guarantor": function(bundleModel, model, params){
                $log.info("Insdie guarantor of LoanRequest");
                // model.loanAccount.coApplicant = params.customer.id;
                var addToRelation = true;
                for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                    if (model.loanAccount.loanCustomerRelations[i].customerId == params.customer.id) {
                        addToRelation = false;
                        if (params.customer.urnNo)
                            model.loanAccount.loanCustomerRelations[i].urn =params.customer.urnNo;
                        break;
                    }
                }

                if (addToRelation) {
                    model.loanAccount.loanCustomerRelations.push({
                        'customerId': params.customer.id,
                        'relation': "GUARANTOR",
                        'urn':params.customer.urnNo
                    })    
                };

                if (!_.hasIn(model.loanAccount, 'guarantors')) {
                    model.loanAccount.guarantors = [];
                }
                model.loanAccount.guarantors.push({
                    'guaCustomerId': params.customer.id
                });
            }
        },
        form: [
            {
                "type": "box",
                "title": "PRELIMINARY_INFORMATION",
                "items": [
                    {
                        key: "loanAccount.loanPurpose1",
                        type: "lov",
                        autolov: true,
                        title:"LOAN_PURPOSE_1",
                        bindMap: {
                        },
                        outputMap: {
                            "purpose1": "loanAccount.loanPurpose1"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            return Queries.getAllLoanPurpose1();
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.purpose1
                            ];
                        },
                        onSelect: function(result, model, context) {
                            $log.info(result);
                            model.loanAccount.loanPurpose2 = '';
                        }
                    },
                    {
                        key: "loanAccount.loanPurpose2",
                        type: "lov",
                        autolov: true,
                        title:"LOAN_PURPOSE_2",
                        bindMap: {
                        },
                        outputMap: {
                            "purpose2": "loanAccount.loanPurpose2"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            return Queries.getAllLoanPurpose2(model.loanAccount.loanPurpose1);
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.purpose2
                            ];
                        }
                    },
                    /*{
                        key: "loanAccount.loanPurpose1",
                        type: "select",
                        enumCode: "loan_purpose_1"
                    },
                    {
                        key: "loanAccount.loanPurpose2",
                        type: "select",
                        enumCode: "loan_purpose_2",
                        parentEnumCode: "loan_purpose_1",
                        parentValueExpr: "model.loanAccount.loanPurpose2"
                    },*/
                    {
                        key: "loanAccount.assetAvailableForHypothecation",
                        type: "radios",
                        enumCode: "decisionmaker",
                        title: "ASSET_AVAILABLE_FOR_HYPOTHECATION"
                    },
                    {
                        key: "loanAccount.estimatedValueOfAssets",
                        type: "amount",
                        condition: "model.loanAccount.assetAvailableForHypothecation=='YES'",
                        title: "ESTIMATED_VALUE_OF_ASSETS"
                    },
                    {
                        key: "loanAccount.loanAmountRequested",
                        type: "amount",
                        title: "LOAN_AMOUNT_REQUESTED"
                    },
                    {
                        key: "loanAccount.frequencyRequested",
                        type: "select",
                        title: "FREQUENCY_REQUESTED",
                        enumCode: "frequency"
                    },
                    {
                        key: "loanAccount.tenureRequested",
                        type: "number",
                        title: "TENURE_REQUESETED"
                    },
                    {
                        key: "loanAccount.emiRequested",
                        type: "amount",
                        title: "EMI_REQUESTED"
                    },
                    {
                        key: "loanAccount.emiPaymentDateRequested",
                        type: "date",
                        title: "EMI_PAYMENT_DATE_REQUESTED"
                    },
                    {
                        "type": "section",
                        "htmlClass": "alert alert-warning",
                        "condition": "!model.loanAccount.customerId",
                        "html":"<h4><i class='icon fa fa-warning'></i>Business not yet enrolled.</h4> Kindly save the business details before proceed."
                    }
                ]
            },
            {
                "type": "box",
                "title": "ADDITIONAL_LOAN_INFORMATION",
                "condition": "model.currentStage=='Application' || model.currentStage=='FieldAppraisal' || model.currentStage == 'SanctionInput'",
                "items": [
                    {
                        key: "loanAccount.expectedInterestRate",
                        type: "number",
                        title: "EXPECTED_INTEREST_RATE"
                    },
                    {
                        key: "loanAccount.estimatedEmi",
                        type: "amount",
                        title: "ESTIMATED_KINARA_EMI"
                    },
                    {
                        key: "loanAccount.estimatedDateOfCompletion",
                        type: "date",
                        title: "ESTIMATED_DATE_OF_COMPLETION"
                    },
                    {
                       key: "loanAccount.productCategory",
                       title:"PRODUCT_TYPE",
                       readonly:true,
                       condition:"model.currentStage!='Application'"
                    },
                    {
                       key: "loanAccount.productCategory",
                       title:"PRODUCT_TYPE",
                       type:"select",
                       enumCode:"loan_purpose_1",
                       condition:"model.currentStage=='Application'"
                    },
                    {
                        key: "loanAccount.customerSignDateExpected",
                        type: "date",
                        title: "CUSTOMER_SIGN_DATE_EXPECTED"
                    },
                    {
                        key: "loanAccount.proposedHires",
                        type: "number",
                        title: "PROPOSED_HIRES"
                    },
                    {
                        key: "loanAccount.percentageIncreasedIncome",
                        type: "number",
                        title: "PERCENTAGE_INCREASED_INCOME"
                    },
                    {
                        key: "loanAccount.percentageInterestSaved",
                        type: "number",
                        title: "PERCENTAGE_INTEREST_SAVED"
                    }
                ]
            },
            {
                "type": "box",
                "title": "NEW_ASSET_DETAILS",
                "condition": "model.loanAccount.loanPurpose1=='Asset Purchase' && (model.currentStage=='Application' || model.currentStage=='FieldAppraisal' || model.currentStage=='Sanction' )",
                "items": [
                    {
                      key:"loanAccount.newassetdetails",
                       type:"array",
                       startEmpty: true,
                       title:"ASSET_DETAILS",
                       items:[
                            {
                                key: "loanAccount.newassetdetails[].machine",
                                title:"MACHINE",
                                type: "string"
                            },
                            {
                                key: "loanAccount.newassetdetails[].purchasePrice",
                                title:"PURCHASE_PRICE",
                                type: "number",
                            },
                            {
                                key: "loanAccount.newassetdetails[].expectedIncome",
                                title:"EXPECTED_INCOME",
                                type: "number",
                            },
                            {
                                key: "loanAccount.newassetdetails[].manfactureName",
                                title:"MANFACTURE_NAME",
                                type: "string",
                            },
                            {
                                key: "loanAccount.newassetdetails[].machineType",
                                title:"MACHINE_TYPE",
                                type: "select",
                            },
                            {
                                key: "loanAccount.newassetdetails[].machineModel",
                                title:"MACHINE_MODEL",
                                type: "string",
                            },
                            {
                                key: "loanAccount.newassetdetails[].serialNo",
                                title:"SERIAL_NO",
                                type: "string",
                            },
                            {
                                key: "loanAccount.newassetdetails[].expectedPurchaseDate",
                                title:"EXPECTED_PURCHASE_DATE",
                                type: "Date",
                            },
                            {
                                key: "loanAccount.newassetdetails[].machinePermanentlyfixedtobuilding",
                                title:"MACHINE_PERMANENTLY_FIXED_TO_BUILDING",
                                type: "radios",
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "loanAccount.newassetdetails[].hypothecatedtoKinara",
                                title:"HYPOTHECATED_TO_KINARA",
                                type: "select",
                            },

                         ]
                     }
                ]
            }/*,
            {
                "type": "box",
                "title": "SCREENING_REVIEW_REMARKS",
                "condition":"model.currentStage=='ScreeningReview'",
                "items": [
                    {
                        key: "loanAccount.screeningReviewRemarks",
                        title:"REMARKS"
                    },
                    {
                        key: "loanAccount.ScreeningDeviations",
                        title:"DEVIATIONS"
                    },
                ]
            },
            {
                "type": "box",
                "title": "APPLICATION_REVIEW_REMARKS",
                "condition":"model.currentStage=='ApplicationReview'",
                "items": [
                    {
                        key: "loanAccount.ApplicationReviewRemarks",
                        title:"REMARKS"
                    },
                    {
                        key: "loanAccount.ApplicationDeviations",
                        title:"DEVIATIONS"
                    },
                ]
            }*/,
            {
                "type": "actionbox",
                "condition": "model.loanAccount.customerId &&  !model.loanAccount.id && !(model.currentStage=='ScreeningReview')",
                "items": [
                    {
                        "type": "button",
                        "title": "SAVE",
                        "onClick": "actions.save(model, formCtrl, form, $event)"
                    }
                ]
            },
            {
                "type": "box",
                "title": "LOAN_SANCTION",
                "condition": "model.currentStage == 'Sanction'",
                "items": [
                    {
                        "key": "loanAccount.interestRate",
                        "type": "number",
                        "title": "INTEREST_RATE"
                    },
                    {
                        "key": "loanAccount.securityEmi",
                        "type": "amount",
                        "title": "SECURITY_EMI"
                    },
                    {
                        "key": "loanAccount.loanAmount",
                        "type": "amount",
                        "title": "LOAN_AMOUNT"
                    },
                    {
                        "key": "loanAccount.processingFeePercentage",
                        "type": "number",
                        "title": "PROCESSING_FEES_IN_PERCENTAGE"
                    },
                    {
                        "key": "loanAccount.commercialCibilCharge",
                        "type": "amount",
                        "title": "COMMERCIAL_CIBIL_CHARGE"
                    },
                    // {
                    //     "key": "loanAccount.portfolioInsuranceUrn",
                    //     "title": "INSURANCE_URN",
                    //     "type": "lov",
                    //     "lovonly": true,
                    //     "outputMap": {
                    //         "urnNo": "customer.urnNo",
                    //         "firstName":"customer.firstName"
                    //     },
                    //     "searchHelper": formHelper,
                    //     search: function(inputModel, form, model, context) {
                    //         var out = [];
                    //         for (var i=0; i<model.customersForInsurance.length; i++){
                    //             out.push({
                    //                 name: model.customersForInsurance[i].name,
                    //                 value: model.customersForInsurance[i].urnNo
                    //             })
                    //         }
                    //         return $q.resolve({
                    //             headers: {
                    //                 "x-total-count": out.length
                    //             },
                    //             body: out
                    //         });
                    //     },
                    //     getListDisplayItem: function(data, index) {
                    //         return [
                    //             data.name,
                    //             data.urnNo
                    //         ];
                    //     },
                    //     onSelect: function(valueObj, model, context){
                    //         model.loanAccount.portfolioInsuranceUrn = valueObj.urnNo;
                    //     }
                    // },
                    {
                        "key": "loanAccount.tenure",
                        "title":"DURATION_IN_MONTHS"
                    },
                    {
                        "type": "fieldset",
                        "title": "DISBURSEMENT_DETAILS",
                        "items": [
                            {
                                key:"loanAccount.sanctionDate",
                                type:"date",
                                title:"SANCTION_DATE"
                            },
                            {
                                key:"loanAccount.numberOfDisbursements",
                                title:"NUM_OF_DISBURSEMENTS",
                                onChange:function(value,form,model){
                                    populateDisbursementSchedule(value,form,model);
                                }
                            },
                            {
                                key:"loanAccount.disbursementSchedules",
                                title:"DISBURSEMENT_SCHEDULES",
                                add:null,
                                remove:null,
                                items:[
                                    {
                                        key:"loanAccount.disbursementSchedules[].trancheNumber",
                                        title:"TRANCHE_NUMBER",
                                        readonly:true
                                    },
                                    {
                                        key:"loanAccount.disbursementSchedules[].disbursementAmount",
                                        title:"DISBURSEMENT_AMOUNT",
                                        type:"amount"
                                    },
                                    {
                                        key: "loanAccount.disbursementSchedules[].tranchCondition",
                                        type: "lov",
                                        autolov: true,
                                        title:"TRANCHE_CONDITION",
                                        bindMap: {
                                        },
                                        searchHelper: formHelper,
                                        search: function(inputModel, form, model, context) {
                                            
                                            var trancheConditions = formHelper.enum('tranche_conditions').data;
                                            var out = [];
                                            for (var i=0;i<trancheConditions.length; i++){
                                                var t = trancheConditions[i];
                                                var min = _.hasIn(t, "field1")?parseInt(t.field1) - 1: 0;
                                                var max = _.hasIn(t, "field2")?parseInt(t.field2) - 1: 100;

                                                if (context.arrayIndex>=min && context.arrayIndex <=max){
                                                    out.push({
                                                        name: trancheConditions[i].name,
                                                        value: trancheConditions[i].value
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
                                        onSelect: function(valueObj, model, context){
                                            model.loanAccount.disbursementSchedules[context.arrayIndex].tranchCondition = valueObj.value;
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.name
                                            ];
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "box",
                "title": "POST_REVIEW",
                "condition": "model.loanAccount.id",
                "items": [
                    {
                        key: "review.action",
                        type: "radios",
                        titleMap: {
                            "REJECT": "REJECT",
                            "SEND_BACK": "SEND_BACK",
                            "PROCEED": "PROCEED",
                            "HOLD": "HOLD"
                        }
                    },
                    {
                        type: "section",
                        condition: "model.review.action=='REJECT'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                required: true
                            },
                            {
                                key: "review.rejectButton",
                                type: "button",
                                title: "REJECT",
                                required: true,
                                onClick: "actions.reject(model, formCtrl, form, $event)"
                            }
                        ]
                    },
                    {
                        type: "section",
                        condition: "model.review.action=='HOLD'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                required: true
                            },
                            {
                                key: "review.holdButton",
                                type: "button",
                                title: "HOLD",
                                required: true,
                                onClick: "actions.holdButton(model, formCtrl, form, $event)"
                            }
                        ]
                    },
                    {
                        type: "section",
                        condition: "model.review.action=='SEND_BACK'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                required: true
                            },
                   {
                    key: "review.targetStage",
                    title: "SEND_BACK_TO_STAGE",
                    type:"select",
                    condition: "model.currentStage == 'ScreeningReview'",
                    required: true,
                    titleMap: {
                        "Screening": "Screening",

                    },
                }, {
                    key: "review.targetStage",
                    title: "SEND_BACK_TO_STAGE",
                    type:"select",
                    condition: "model.currentStage == 'Application'",
                    required: true,
                    titleMap: {
                        "Screening": "Screening",
                        "ScreeningReview": "ScreeningReview",
                    }
                },{
                    key: "review.targetStage",
                    title: "SEND_BACK_TO_STAGE",
                    type:"select",
                    condition: "model.currentStage == 'Psychometric'",
                    required: true,
                    titleMap: {
                        "Screening": "Screening",
                        "ScreeningReview": "ScreeningReview",
                        "Application": "Application",
                    }
                },  {
                    key: "review.targetStage",
                    title: "SEND_BACK_TO_STAGE",
                    type:"select",
                    condition: "model.currentStage == 'ApplicationReview'",
                    required: true,
                    titleMap: {
                        "Screening": "Screening",
                        "ScreeningReview": "ScreeningReview",
                        "Application": "Application",
                    }
                }, {
                    key: "review.targetStage",
                    title: "SEND_BACK_TO_STAGE",
                    type:"select",
                    condition: "model.currentStage == 'FieldAppraisal'",
                    required: true,
                    titleMap: {
                        "Screening": "Screening",
                        "ScreeningReview": "ScreeningReview",
                        "Application": "Application",
                        "ApplicationReview": "ApplicationReview",
                    }
                }, {
                    key: "review.targetStage",
                    title: "SEND_BACK_TO_STAGE",
                    type:"select",
                    condition: "model.currentStage == 'FieldAppraisalReview'",
                    required: true,
                    titleMap: {
                        "Screening": "Screening",
                        "ScreeningReview": "ScreeningReview",
                        "Application": "Application",
                        "ApplicationReview": "ApplicationReview",
                        "FieldAppraisal": "FieldAppraisal",
                    }
                }, {
                    key: "review.targetStage",
                    title: "SEND_BACK_TO_STAGE",
                    type:"select",
                    condition: "model.currentStage == 'CentralRiskReview'",
                    required: true,
                    titleMap: {
                        "Screening": "Screening",
                        "ScreeningReview": "ScreeningReview",
                        "Application": "Application",
                        "ApplicationReview": "ApplicationReview",
                        "FieldAppraisal": "FieldAppraisal",
                        "FieldAppraisalReview": "FieldAppraisalReview",
                    },
                } ,{
                    key: "review.targetStage",
                    title: "SEND_BACK_TO_STAGE",
                    type:"select",
                    condition: "model.currentStage == 'CreditCommitteeReview'",
                    required: true,
                    titleMap: {
                        "Screening": "Screening",
                        "ScreeningReview": "ScreeningReview",
                        "Application": "Application",
                        "ApplicationReview": "ApplicationReview",
                        "FieldAppraisal": "FieldAppraisal",
                        "FieldAppraisalReview": "FieldAppraisalReview",
                        "CentralRiskReview": "CentralRiskReview"
                    },
                },
                            {
                                key: "review.sendBackButton",
                                type: "button",
                                title: "SEND_BACK",
                                onClick: "actions.sendBack(model, formCtrl, form, $event)"
                            }
                        ]
                    },
                    {
                        type: "section",
                        condition: "model.review.action=='PROCEED'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                required: true
                            },
                            {
                                key: "review.proceedButton",
                                type: "button",
                                title: "PROCEED",
                                onClick: "actions.proceed(model, formCtrl, form, $event)"
                            }
                        ]
                    }
                    
                ]
            }
        ],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
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
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                /* TODO Call proceed servcie for the loan account */
                
                Utils.confirm("Are You Sure?").then(function(){

                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanProcessAction = "PROCEED";
                    reqData.remarks = model.review.remarks;
                    PageHelper.showLoader();
                    if (model.currentStage == 'Sanction') {
                        reqData.stage = 'LoanInitiation';
                    }
                    PageHelper.showProgress("update-loan", "Working...");
                    IndividualLoan.update(reqData)
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress("update-loan", "Done.", 3000);
                            return navigateToQueue(model);
                        }, function(httpRes){
                            PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                })
            },
            save: function(model, formCtrl, form, $event){
                $log.info("Inside save()");
                /* TODO Call save service for the loan */
                Utils.confirm("Are You Sure?")
                    .then(
                        function(){
                            
                            var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                            reqData.loanProcessAction = "SAVE";
                            reqData.remarks = model.review.remarks;
                            PageHelper.showLoader();
                            IndividualLoan.create(reqData)
                                .$promise
                                .then(function(res){
                                    model.loanAccount = res.loanAccount;
                                    BundleManager.pushEvent('new-loan', model._bundlePageObj, {loanAccount: model.loanAccount});
                                }, function(httpRes){
                                    PageHelper.showErrors(httpRes);
                                })
                                .finally(function(httpRes){
                                    PageHelper.hideLoader();
                                })
                        }
                    );
            },
            holdButton: function(model, formCtrl, form, $event){
                $log.info("Inside save()");
                /* TODO Call save service for the loan */
                Utils.confirm("Are You Sure?")
                    .then(
                        function(){
                            
                            var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                            reqData.loanAccount.status = 'HOLD';
                            reqData.loanProcessAction = "SAVE";
                            reqData.remarks = model.review.remarks;
                            PageHelper.showLoader();
                            IndividualLoan.create(reqData)
                                .$promise
                                .then(function(res){
                                    BundleManager.pushEvent('new-loan', model._bundlePageObj, {loanAccount: model.loanAccount});
                                    return navigateToQueue(model);
                                }, function(httpRes){
                                    PageHelper.showErrors(httpRes);
                                })
                                .finally(function(httpRes){
                                    PageHelper.hideLoader();
                                })
                        }
                    );
            },
            sendBack: function(model, formCtrl, form, $event){
                $log.info("Inside sendBack()");
                if (!validateForm(formCtrl)){
                    return;
                }
                Utils.confirm("Are You Sure?").then(function(){
                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanProcessAction = "PROCEED";
                    reqData.remarks = model.review.remarks;
                    reqData.stage = model.review.targetStage;
                    reqData.remarks = model.review.remarks;
                    PageHelper.showLoader();
                    PageHelper.showProgress("update-loan", "Working...");
                    IndividualLoan.update(reqData)
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress("update-loan", "Done.", 3000);
                            return navigateToQueue(model);
                        }, function(httpRes){
                            PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                })

            },
            proceed: function(model, formCtrl, form, $event){
                $log.info("Inside submit()");
                /* TODO Call proceed servcie for the loan account */
                
                if (!validateForm(formCtrl)){
                    return;
                }
                
                Utils.confirm("Are You Sure?").then(function(){

                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanProcessAction = "PROCEED";
                    reqData.remarks = model.review.remarks;
                    PageHelper.showLoader();
                    if (model.currentStage == 'Sanction') {
                        reqData.stage = 'LoanInitiation';
                    }
                    PageHelper.showProgress("update-loan", "Working...");
                    IndividualLoan.update(reqData)
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress("update-loan", "Done.", 3000);
                            return navigateToQueue(model);
                        }, function(httpRes){
                            PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                })
            },
            reject: function(model, formCtrl, form, $event){
                $log.info("Inside reject()");
                if (!validateForm(formCtrl)){
                    return;
                }
                Utils.confirm("Are You Sure?").then(function(){

                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanProcessAction = "PROCEED";
                    reqData.stage = "Rejected";
                    reqData.remarks = model.review.remarks;
                    PageHelper.showLoader();
                    PageHelper.showProgress("update-loan", "Working...");
                    IndividualLoan.update(reqData)
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress("update-loan", "Done.", 3000);
                            return navigateToQueue(model);
                        }, function(httpRes){
                            PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                })
            },
            sentBack: function(model, formCtrl, form, $event){
                $log.info("Inside sentBack()");
                Utils.confirm("Are you sure?")
                    .then(
                        function(){
                            var reqData = {loanAccount: _.cloneDeep(model.loanAccount)}
                            reqData.loanProcessAction = 'PROCEED';
                            PageHelper.showLoader();
                            var targetStage = null;
                            switch(model.loanAccount.currentStage){
                                case "ScreeningReview":
                                    targetStage = "Screening";
                                    break;
                                case "Application":
                                    targetStage = "ScreeningReview";
                                    break;
                                case "Psychometric":
                                    targetStage = "Application";
                                    break;
                                case "ApplicationReview":
                                    targetStage = "Psychometric";
                                    break;
                                case "FieldAppraisal":
                                    targetStage = "ApplicationReview";
                                    break;
                                case "FieldAppraisalReview":
                                    targetStage = "FieldAppraisal";
                                    break;
                                case "CentralRiskReview":
                                    targetStage = "FieldAppraisalReview";
                                    break;
                                case "CreditCommitteeReview":
                                    targetStage = "CentralRiskReview";
                                    break;
                                default:
                                    targetStage = null;                                
                            }

                            if (targetStage == null){
                                PageHelper.showProgress("sent-back", "Unable to sent back from current stage.", 5000);
                                return;
                            }
                            reqData.stage = targetStage;
                            PageHelper.showLoader();
                            PageHelper.showProgress('sent-back', 'Working...');
                            IndividualLoan.create(reqData)
                                .$promise
                                .then(function(res){
                                    PageHelper.showProgress('sent-back', 'Sent back successful', 3000);
                                    return navigateToQueue();
                                }, function(httpRes){
                                    PageHelper.showProgress('sent-back', 'Oops. Some error occured.', 3000);
                                    PageHelper.showErrors(httpRes);
                                })
                                .finally(function(httpRes){
                                    PageHelper.hideLoader();
                                })
                        }
                    )
            }
        }
    };
}]);
