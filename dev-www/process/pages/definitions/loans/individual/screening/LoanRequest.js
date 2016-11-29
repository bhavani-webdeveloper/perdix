irf.pageCollection.factory(irf.page("loans.individual.screening.LoanRequest"),
["$log", "$q","LoanAccount", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
function($log, $q, LoanAccount, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan){

    var branch = SessionStore.getBranch();

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
                //model.branchId = SessionStore.getBranchId() + '';
                //model.customer.kgfsName = SessionStore.getBranch();
                model.customer.customerType = "Enterprise";

                model.loanAccount = {};
                model.loanAccount.loanCustomerRelations = [];

                /* TODO REMOVE THIS CODE.. TEMP CODE ONLY */
                //model.loanAccount.productCode = 'TLAPS';
                //model.loanAccount.tenure = 12;
                model.loanAccount.frequency = 'M';
                model.loanAccount.isRestructure = false;
                model.loanAccount.documentTracking = "PENDING";    
                /* END OF TEMP CODE */
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
                // model.loanAccount.applicant = params.customer.id;
                /* Assign more customer information to show */
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
                    })    
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
                        type: "select",
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
                        type: "number",
                        title: "EMI_PAYMENT_DATE_REQUESTED"
                    },
                    {
                        key: "loanAccount.loanAmountRequested",
                        type: "amount",
                        title: "LOAN_AMOUNT_REQUESTED"
                    },
                    {
                        key: "loanAccount.expectedInterestRate",
                        type: "amount",
                        title: "EXPECTED_INTEREST_RATE"
                    },
                    {
                        key: "loanAccount.estimatedDateOfCompletion",
                        type: "amount",
                        title: "ESTIMATED_DATE_OF_COMPLETION"
                    },
                    {
                        key: "loanAccount.customerSignDateExpected",
                        type: "amount",
                        title: "CUSTOMER_SIGN_DATE_EXPECTED"
                    },
                    {
                        "type": "section",
                        "htmlClass": "alert alert-warning",
                        "condition": "!model.loanAccount.customerId",
                        "html":"<h4><i class='icon fa fa-warning'></i>Business not yet enrolled.</h4> Kindly save the business details before proceed."
                    },
                ]
            },
            {
                "type": "box",
                "title": "NEW_ASSET_DETAILS",
                "condition": "model.loanAccount.loanPurpose2=='New Asset' && model.loanAccount.currentStage=='Application'",
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
                                titleMap: {
                                    YES:"YES",
                                    NO:"NO"
                                }
                            },
                            {
                                key: "loanAccount.newassetdetails[].hypothecatedtoKinara",
                                title:"HYPOTHECATED_TO_KINARA",
                                type: "select",
                            },

                         ]
                     }
                ]
            },
            {
                "type": "box",
                "title": "SCREENING_REVIEW_REMARKS",
                "condition":"model.currentStage=='ScreeningReview'",
                "items": [
                    {
                        key: "loanAccount.screeningReviewRemarks"
                    },
                    {
                        key: "loanAccount.ScreeningDeviations"
                    },
                ]
            },
            {
                "type": "box",
                "title": "APPLICATION_REVIEW_REMARKS",
                "condition":"model.currentStage=='ApplicationReview'",
                "items": [
                    {
                        key: "loanAccount.ApplicationReviewRemarks"
                    },
                    {
                        key: "loanAccount.ApplicationDeviations"
                    },
                ]
            },
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
                "type": "actionbox",
                "condition": "model.loanAccount.id",
                "items": [
                    {
                        "type": "submit",
                        "title": "PROCEED"
                    }
                ]
            },
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
                    PageHelper.showLoader();
                    IndividualLoan.update(reqData)
                        .$promise
                        .then(function(res){
                            if(model.currentStage=='ScreeningReview')
                                $state.go('Page.Engine', {pageName: 'loans.individual.screening.ScreeningReviewQueue', pageId:null});
                            if(model.currentStage=='ApplicationReview')
                                $state.go('Page.Engine', {pageName: 'loans.individual.screening.ApplicationReviewQueue', pageId:null});
                            if(model.currentStage=='Screening')
                                $state.go("Page.Landing");
                            if(model.currentStage=='Application')
                                $state.go('Page.Engine', {pageName: 'loans.individual.booking.ApplicationQueue', pageId:null});
                        }, function(httpRes){
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
                            reqData.loanAccount.loanAmountRequested = reqData.loanAccount.loanAmount;
                            PageHelper.showLoader();
                            IndividualLoan.create(reqData)
                                .$promise
                                .then(function(res){
                                    model.loanAccount = res.loanAccount;    
                                }, function(httpRes){
                                    PageHelper.showErrors(httpRes);
                                })
                                .finally(function(httpRes){
                                    PageHelper.hideLoader();
                                })
                        }
                    );
            }
        }
    };
}]);
