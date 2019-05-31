define({
    pageUID: "arthan.loans.individual.screening.detail.LoanApplicationView",
    pageType: "Engine",
    dependencies: ["$log", "$state","LoanAccount", "Enrollment", "IndividualLoan", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "$stateParams", "$state",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe", "$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "SchemaResource", "LoanProcess", "irfCurrencyFilter", "irfElementsConfig"
    ],
    $pageFn: function($log, $state,LoanAccount, Enrollment, IndividualLoan, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage, $stateParams, $state,
        PageHelper, Utils, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, Dedupe, $resource, $httpParamSerializer, BASE_URL, searchResource, SchemaResource, LoanProcess, irfCurrencyFilter, irfElementsConfig) {
        var strongRender = function(data, type, full, meta) {
            return '<strong>'+data+'</strong>';
        }
        var currencyRightRender = function(data) {
            if(data<0)
                return '-'+irfElementsConfig.currency.iconHtml+irfCurrencyFilter(Math.abs(data), null, null, "decimal");
            if(data != "NA")
            return irfElementsConfig.currency.iconHtml+irfCurrencyFilter(data, null, null, "decimal");
            else
            return "NA";
        }
        var navigateToQueue = function(model) {
                    // Considering this as the success callback
                    // Deleting offline record on success submission
                    BundleManager.deleteOffline().then(function() {
                        PageHelper.showProgress("loan-offline", "Offline record cleared", 5000);
                    });

                    if (model.currentStage == 'Screening')
                        $state.go('Page.Engine', {
                            pageName: 'arthan.loans.individual.screening.ScreeningQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'Dedupe')
                        $state.go('Page.Engine', {
                            pageName: 'arthan.loans.individual.screening.DedupeQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'ScreeningReview')
                        $state.go('Page.Engine', {
                            pageName: 'arthan.loans.individual.screening.ScreeningReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'Application')
                        $state.go('Page.Engine', {
                            pageName: 'arthan.loans.individual.screening.ApplicationQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'ApplicationReview')
                        $state.go('Page.Engine', {
                            pageName: 'arthan.loans.individual.screening.ApplicationReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'Scrutiny')
                        $state.go('Page.Engine', {
                            pageName: 'arthan.loans.individual.screening.ScrutinyQueue',
                            pageId: null,
                        });
                    if (model.currentStage == 'FieldAppraisal')
                        $state.go('Page.Engine', {
                            pageName: 'arthan.loans.individual.screening.FieldAppraisalQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'FieldAppraisalReview')
                        $state.go('Page.Engine', {
                            pageName: 'arthan.loans.individual.screening.FieldAppraisalReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'CreditCommitteeReview')
                        $state.go('Page.Engine', {
                            pageName: 'arthan.loans.individual.screening.CreditCommitteeReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'CentralRiskReview')
                        $state.go('Page.Engine', {
                            pageName: 'arthan.loans.individual.screening.CentralRiskReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'ZonalRiskReview')
                        $state.go('Page.Engine', {
                            pageName: 'arthan.loans.individual.screening.ZonalRiskReviewQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'Sanction')
                        $state.go('Page.Engine', {
                            pageName: 'arthan.loans.individual.screening.LoanSanctionQueue',
                            pageId: null
                        });
                    if (model.currentStage == 'Rejected')
                        $state.go('Page.LoanOriginationDashboard', null);
                }

            var getStageNameByStageCode = function(stageCode) {
                var stageName = $filter('translate')(stageCode) || stageCode;
                return stageName;
            };
            var validateForm = function(formCtrl){
                formCtrl.scope.$broadcast('schemaFormValidate');
                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                    return false;
                }
                return true;
            };
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

    var validateCibilHighmark = function(model){
        var cibilMandatory = (_.hasIn(model.cibilHighmarkMandatorySettings, "cibilMandatory") && _.isString(model.cibilHighmarkMandatorySettings.cibilMandatory) && model.cibilHighmarkMandatorySettings.cibilMandatory=='N')?"N":"Y";
        var highmarkMandatory = (_.hasIn(model.cibilHighmarkMandatorySettings, "highmarkMandatory") && _.isString(model.cibilHighmarkMandatorySettings.highmarkMandatory) && model.cibilHighmarkMandatorySettings.highmarkMandatory=='N')?"N":"Y";

        if (model.loanAccount && model.loanAccount.loanCustomerRelations && model.loanAccount.loanCustomerRelations.length>0){
            for (i=0; i<model.loanAccount.loanCustomerRelations.length; i++){

                if((highmarkMandatory=='Y' && !model.loanAccount.loanCustomerRelations[i].highmarkCompleted)) {
                    PageHelper.showProgress("pre-save-validation", "Highmark not completed.",5000);
                    return false;
                }

                if( (cibilMandatory=='Y' && !model.loanAccount.loanCustomerRelations[i].cibilCompleted)) {
                    PageHelper.showProgress("pre-save-validation", "CIBIL not completed",5000);
                    return false;
                }

            }
        }
        return true;
    }

     var computeEMI = function(model){

            // Get the user's input from the form. Assume it is all valid.
            // Convert interest from a percentage to a decimal, and convert from
            // an annual rate to a monthly rate. Convert payment period in years
            // to the number of monthly payments.

            if(model.loanAccount.loanAmount == '' || model.loanAccount.interestRate == '' || model.loanAccount.frequencyRequested == '' || model.loanAccount.tenure == '')
                return;

            var principal = model.loanAccount.loanAmount;
            var interest = model.loanAccount.interestRate / 100 / 12;
            var payments;
            if (model.loanAccount.frequencyRequested == 'Yearly')
                payments = model.loanAccount.tenure * 12;
            else if (model.loanAccount.frequencyRequested == 'Monthly')
                payments = model.loanAccount.tenure;

            // Now compute the monthly payment figure, using esoteric math.
            var x = Math.pow(1 + interest, payments);
            var monthly = (principal*x*interest)/(x-1);

            // Check that the result is a finite number. If so, display the results.
            if (!isNaN(monthly) &&
                (monthly != Number.POSITIVE_INFINITY) &&
                (monthly != Number.NEGATIVE_INFINITY)) {

                model.loanAccount.estimatedEmi = round(monthly);
                //document.loandata.total.value = round(monthly * payments);
                //document.loandata.totalinterest.value = round((monthly * payments) - principal);
            }
            // Otherwise, the user's input was probably invalid, so don't
            // display anything.
            else {
                model.loanAccount.estimatedEmi  = "";
                //document.loandata.total.value = "";
                //document.loandata.totalinterest.value = "";
            }

        };

        // This simple method rounds a number to two decimal places.
        function round(x) {
          return Math.ceil(x);
        }

        documentArrayFormation = function(model) {
            if (_.hasIn(model.loanAccount, 'loanDocuments') && _.isArray(model.loanAccount.loanDocuments)){
                model.loanAccount.documents = [];
                _.filter(model.loanAccount.loanDocuments, function(doc) { 
                    if(_.includes(doc.remarks, 'RCUStageDocuments-') == true) {
                        model.loanAccount.documents.push(doc)
                    }
                });
              
                for(var j=0;j <model.loanAccount.loanDocuments.length; j++) {
                    if(_.includes(model.loanAccount.loanDocuments[j].remarks, 'RCUStageDocuments-') == true) {
                        model.loanAccount.loanDocuments.splice(j,1);
                    }
                }
            }
            if(model.loanAccount.noOfGuarantersRequired <= 0) {
                model.loanAccount.isGuarantorRequired = "NO";
            } else {
                model.loanAccount.isGuarantorRequired = "YES";
            }
        }


        return {
            "type": "schema-form",
            "title": "LOAN_RECOMMENDATION",
            "subTitle": "",
            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                model.currentStage = bundleModel.currentStage;
                model.bundleModel = bundleModel;
                //model.loanAccount = bundleModel.loanAccount;
                model.linkedAccount={};
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                model.review = model.review || {};
                model.temp = model.temp || {}
                BundleManager.pushEvent('loanAccount', model._bundlePageObj, model.loanAccount);
                model.mitigantsChanged=0;
                model.loanMitigants= model.loanAccount.loanMitigants;
                model.expectedTurnoverObj = {};
                documentArrayFormation(model);
            /*Asset details*/
                if (model.loanAccount.collateral.length != 0) {
                    model.asset_details = [];
                    for (i in model.loanAccount.collateral) {
                         model.asset_details.push({
                            "collateralDescription": model.loanAccount.collateral[i].collateralDescription,
                            "collateralValue": model.loanAccount.collateral[i].collateralValue,
                            "expectedIncome": model.loanAccount.collateral[i].expectedIncome,
                            "collateralType": model.loanAccount.collateral[i].collateralType,
                            "manufacturer": model.loanAccount.collateral[i].manufacturer,
                            "modelNo": model.loanAccount.collateral[i].modelNo,
                            "serialNo": model.loanAccount.collateral[i].serialNo,
                            "expectedPurchaseDate": model.loanAccount.collateral[i].expectedPurchaseDate,
                            "machineAttachedToBuilding": model.loanAccount.collateral[i].machineAttachedToBuilding,
                            "hypothecatedToBank": model.loanAccount.collateral[i].hypothecatedToBank,
                            "electricityAvailable": model.loanAccount.collateral[i].electricityAvailable,
                            "spaceAvailable": model.loanAccount.collateral[i].spaceAvailable
                        });
                    }
                }

              model.customerHistoryFinancials={
                    'tableData': [],
                    'tableData1':[]
            }

     
            Enrollment.getCustomerById({
                id: model.customerId
            }).$promise.then(function(res) {
                model.customer = res;
            });
            // calling individual loan api to get then result of loan amount requested
            if(_.isNull(model.loanAccount['transactionType'])) model.loanAccount.transactionType="New Loan";
            if (!(_.isNull(model.loanAccount.transactionType)) && model.loanAccount.transactionType.toLowerCase() == 'renewal') {
                 LoanAccount.get({
                    accountId: model.loanAccount.linkedAccountNumber
                })
                .$promise.then(function(res){
                    model.linkedAccount=res;
                    model.linkedLoanAmount = res.totalDisbursed;
                },function(err){
                    $log.info("loan request Individual/find api failure" + err);
                });
             }

        },
        form: [{
                "type": "section",
                "html": '<div class="col-xs-12">' +
                    '<div class="box no-border">' +
                    '<div class="box-body" style="padding-right: 0">' +
                    '<sf-decorator ng-repeat="item in form.items" form="item" class="ng-scope"></sf-decorator></div></div></div>',
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        key: "loanAccount.linkedAccountNumber",
                        title: "LINKED_ACCOUNT_NUMBER",
                        type: "lov",
                        autolov: true,
                        readonly:true,
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            return LoanProcess.viewLoanaccount({
                                urn: model.customer.urnNo
                            }).$promise;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.accountId,
                                item.glSubHead,
                                item.amount,
                                item.npa
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            model.loanAccount.npa = valueObj.npa;
                            model.loanAccount.linkedAccountNumber = valueObj.accountId;
                        }
                    }, {
                        key: "loanAccount.npa",
                        title: "IS_NPA"
                    }]
                }]
            }, {
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
            }, {
                "type": "box",
                "readonly": true,
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "Additional Loan Information",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.estimatedDateOfCompletion",
                            "title": "Estimated Date Of Completion"
                        }, {
                            "key": "loanAccount.productCategory",
                            "title": "Product Type"
                        }, {
                            "key": "loanAccount.customerSignDateExpected",
                            "title": "Expected customer sign date"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.proposedHires",
                            "title": "Proposed Hires",
                            "type": "number"
                        }, {
                            "key": "loanAccount.percentageIncreasedIncome",
                            "title": "% of Increased Income",
                            "type": "number"
                        }, {
                            "key": "loanAccount.percentageInterestSaved",
                            "title": "% of Interest Saved",
                            "type": "number"
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "readonly": true,
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "Deductions From Loan Amount",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.expectedProcessingFeePercentage",
                            "title": "Expected Processing Fee(in%)",
                            "type": "number"
                        }, {
                            "key": "loanAccount.expectedCommercialCibilCharge",
                            "title": "Expected CIBIL Charges",
                            "type": "amount"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.estimatedEmi",
                            "title": "Expected Security EMI(in Rs.)",
                            "type": "amount"
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "readonly": true,
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "Asset Purchase Details",
                /*
                                    "condition":"model.loanAccount.loanPurpose1==model.asset_Details.Assetpurchase"*/
                "condition": "model.loanAccount.collateral.length!=0",
                "items": [
                    {
                        "type": "tableview",
                        "key": "asset_details",
                        "notitle": true,
                        "transpose": true,
                        getColumns: function() {
                            return [{
                                "title": "Machine",
                                "data": "collateralDescription",
                                "render": strongRender
                            }, {
                                "title": "Purchase Price",
                                "data": "collateralValue",
                                 "className": "text-right",
                                "render": currencyRightRender
                            }, {
                                "data": "expectedIncome",
                                "title": "Expected Income",
                                "className": "text-right",
                                "render": currencyRightRender
                            }, {
                                "data": "collateralType",
                                "title": "Machine Type"
                            }, {
                                "data": "manufacturer",
                                "title": "Manufacturer Name"
                            }, {
                                "data": "modelNo",
                                "title": "Machine Model"
                            }, {
                                "data": "serialNo",
                                "title": "Serial No"
                            }, {
                                "data": "expectedPurchaseDate",
                                "title": "Expected Purchase Date"
                            }, {
                                "data": "machineAttachedToBuilding",
                                "title": "Machine Permanently Fixed To Building"
                            }, {
                                "data": "hypothecatedToBank",
                                "title": "HYPOTHECATED_TO_KINARA"
                            }, {
                                "data": "electricityAvailable",
                                "title": "Electricity Available"
                            }, {
                                "data": "spaceAvailable",
                                "title": "Space Available"
                            },];
                        }
                    }
                ]
            }, {
                "type": "box",
                "readonly": true,
                "colClass": "col-sm-12",
                "overrideType": "default-view",
                "title": "Nominee Details",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.nominees[0].nomineeFirstName",
                            "title": "Name"
                        }, {
                            "key": "loanAccount.nominees[0].nomineeGender",
                            "title": "Gender"
                        }, {
                            "key": "loanAccount.nominees[0].nomineeDOB",
                            "title": "Date Of Birth"
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.nominees[0].nomineeRelationship",
                            "title": "Relationship To Insured"
                        }, {  
                            "type": "section",                                
                            "htmlClass": "row",
                            "items": [
                                {
                                    "type": "section",
                                    "htmlClass": "col-sm-4",
                                    "html": '<h5>' + "Address" + '</h5>'
                                },
                                {
                                    "type": "section",
                                    "htmlClass": "col-sm-8",
                                    "html": '<p style = "font-size: 14px; color: #555;"><strong>{{model.loanAccount.nominees[0].nomineeDoorNo}} <br />\
                                    {{model.loanAccount.nominees[0].nomineeLocality}} <br />\
                                    {{model.loanAccount.nominees[0].nomineeDistrict}} <br />\
                                    {{model.loanAccount.nominees[0].nomineeState}} <br /> \
                                    {{model.loanAccount.nominees[0].nomineePincode}} <br /> \
                                    <br /><strong></p>\
                                    '
                                }]
                                   
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "colClass": "col-sm-12",
                "title": "DEVIATION_AND_MITIGATIONS",
                "condition": "model.currentStage != 'ScreeningReview'",
                "items": [{
                    "type": "section",
                    "colClass": "col-sm-12",
                    "html": '<table class="table"><colgroup><col width="20%"><col width="5%"><col width="20%"></colgroup><thead><tr><th>Parameter Name</th><th></th><th>Actual Value</th><th>Mitigant</th></tr></thead><tbody>' +
                        '<tr ng-repeat="item in model.deviationDetails">' +
                        '<td>{{ item["parameter"] }}</td>' +
                        '<td> <span class="square-color-box" style="background: {{ item.color_hexadecimal }}"> </span></td>' +
                        '<td>{{ item["deviation"] }}</td>' +
                        '<td><ul class="list-unstyled">' +
                        '<li ng-repeat="m in item.mitigants " id="{{m.mitigant}}">' +
                        '<input type="checkbox"  ng-model="m.selected" ng-checked="m.selected"> {{ m.mitigant }}' +
                        // '<input type="checkbox"  ng-model="m.selected" ng-change="model.updateChosenMitigant(m.selected,m)"> {{ m.mitigant }}' +
                        '</li></ul></td></tr></tbody></table>'

                }]
            }, {
            "type": "box",
            "colClass": "col-sm-12",
            "title": "LOAN_DOCUMENTS",
            "condition":"model.currentStage !== 'loanView'" ,
            "items": [
                {
                    "type": "array",
                    "key": "loanAccount.loanDocuments",
                    "view": "fixed",
                    "startEmpty": true,
                    "title": "LOAN_DOCUMENT",
                    "titleExpr": "model.loanAccount.loanDocuments[arrayIndex].document",
                    "items": [
                        {
                            "key": "loanAccount.loanDocuments[].document",
                            "title": "DOCUMENT_NAME",
                            "type": "string",
                            "required": true
                        },
                        {
                            title: "Upload",
                            key: "loanAccount.loanDocuments[].documentId",
                            "required": true,
                            type: "file",
                            fileType: "application/pdf",
                            category: "Loan",
                            subCategory: "DOC1",
                            using: "scanner"
                        }
                        // ,
                        // {
                        //     "key": "loanDocuments.newLoanDocuments[].documentStatus",
                        //     "type": "string"
                        // }
                    ]
                },
            ]

        }, {
                "type": "box",
                "colClass": "col-sm-12",
                "title": "Loan Recommendation",
                "items": [{
                    "type": "grid",
                    "orientation": "horizontal",
                    "items": [{
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "",
                            "title": "Current Exposure",
                            "type": "amount"
                        }, {
                            "key": "loanAccount.loanAmount",
                            "title": "Loan Amount Recommended",
                            "type": "amount",
                            onChange:function(value,form,model){
                                computeEMI(model);
                            }
                        }, {
                            "key": "loanAccount.tenure",
                            "title": "Duration(months)"/*,
                            "type": "number"*/
                            ,
                            onChange:function(value,form,model){
                                computeEMI(model);
                            }
                        }, {
                            "key": "loanAccount.interestRate",
                            "title": "Interest Rate",
                            "type": "number",
                            onChange:function(value,form,model){
                                computeEMI(model);
                            }
                        }]
                    }, {
                        "type": "grid",
                        "orientation": "vertical",
                        "items": [{
                            "key": "loanAccount.estimatedEmi",
                            "title": "ESTIMATED_KINARA_EMI",
                            "type": "amount"
                        }, {
                            "key": "loanAccount.processingFeePercentage",
                            "title": "Processing Fee(in%)"
                        }, {
                            "key": "loanAccount.estimatedEmi",
                            "title": "Expected Security EMI"
                        }, {
                            "key": "loanAccount.commercialCibilCharge",
                            "title": "CIBIL Charges",
                            "type": "amount"
                        }]
                    }]
                }]
            }, 
            {
                    "type": "box",
                    "title": "CUSTOMER_LOAN_HISTORY",
                    "readOnly": true,
                    "colClass": "col-sm-12",
                    "items":[{
                            "type": "tableview",
                            "key": "customerHistoryFinancials.tableData",
                            "transpose" : true,
                            "title": "",
                            "selectable": "false",
                            "editable": "false",
                            "tableConfig":{
                                "searching": false,
                                "paginate": false,
                                "pageLength": 10,
                            },
                            getColumns: function() {
                                return [{
                                    "title": "CATEGORY",
                                    "data": "Category",
                                    "render": self.strongRender
                                },{
                                    "title": "OUTSTANDING",
                                    "data": "Outstanding",
                                    "render": currencyRightRender
                                },
                                {
                                    "title": "DISBURSEMENT_AMOUNT",
                                    "data": "disbursement_amount",
                                    "render": currencyRightRender
                                },
                                {
                                    "title": "LOAN_PRODUCT",
                                    "data": "loan_product",
                                    "render": self.strongRender
                                },
                                {
                                    "title": "LOAN_STATUS",
                                    "data": "loan_status",
                                    "render": self.strongRender
                                },
                                {
                                    "title": "TENURE",
                                    "data": "tenure",
                                    "render": self.strongRender
                                },
                                {
                                    "title": "# of EMI Paid",
                                    "data": "no_of_emi_paid"
                                },
                                {
                                    "title": "Total Exposure of Turnover",
                                    "data": "exposer",
                                    "render": currencyRightRender
                                }
                            ];
                            },
                            getActions: function() {
                                return [];
                            }                            
                        }]
            },{
                "type": "box",
                "title": "Expected Turnover",
                "readOnly": true,
                "colClass": "col-sm-12",
                "items":[{
                        "type": "tableview",
                        "key": "customerHistoryFinancials.tableData1",
                        "transpose" : true,
                        "title": "",
                        "selectable": "false",
                        "editable": "false",
                        "tableConfig":{
                            "searching": false,
                            "paginate": false,
                            "pageLength": 10,
                        },
                        getColumns: function() {
                            return [{
                                "title": "Parameter",
                                "data": "actualValue",
                                "render": self.strongRender
                            },{
                                "title": "Total Outstanding Of All Existing Loan",
                                "data": "totalOutstandingAmount",
                                "render": currencyRightRender
                            },{
                                "title": "Current Recommended Loan Amount",
                                "data": "loanAmountRecommended",
                                "render": currencyRightRender
                            },
                            {
                                "title": "Annual Turnover",
                                "data": "annualTurnover",
                                "render": currencyRightRender
                            },
                            {
                                "title": "Exposure To Annual Turnover",
                                "data": "kinaraExposureToAnnualTurover"
                            }
                        ];
                        },
                        getActions: function() {
                            return [];
                        }                            
                    }]
        },
        {

            "type": "box",		
            "colClass": "col-sm-12",		
            "readonly": true,		
            "overrideType": "default-view",		
            condition: "model.currentStage !== 'ApplicationReview' && model.currentStage !== 'Scrutiny' && model.loanAccount.documents.length != 0",		
            "title": "RCU Documents",		
            "items": [  {		
                "key": "loanAccount.documents",		
                "type": "array",		
                "title": "Documents",	
                //startEmpty: true,		
                "items": [		
                {		
                    key:"loanAccount.documents[].document",		
                    type:"text",		
                    title:"Document Name",		
                    required: true,		
                },		
                {		
                    key:"loanAccount.documents[].documentId",		
                    title : "Upload",		
                    type:"file",		
                    required: true,		
                    category: "Loan",		
                    subCategory: "DOC3",
                }		
                ]		
                },]		
        }, 
        {
            "type": "box",
            "colClass": "col-sm-12",
            condition: "model.currentStage == 'FieldAppraisalReview'",
            "title": "Add Guarantor",
            "items": [
                {
                    key: "loanAccount.isGuarantorRequired",
                    type: "radios",
                    title:"Guarantor required",
                    titleMap: {
                        "YES": "YES",
                        "NO": "NO"
                    },
                    required: true,
                },
                {
                    key:"loanAccount.noOfGuarantersRequired",
                    title : "No.of Guarantors",
                    type:"select",
                    condition: "model.loanAccount.isGuarantorRequired == 'YES'",
                    titleMap: [{
                        value: 1,
                        name: 1
                    },{
                        value: 2,
                        name: 2
                    }],
                    required: true,
                }
            ]
        }, {

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
                "condition": "model.loanAccount.customerId && model.currentStage !== 'loanApplicationView'",
                "items": [{
                    "type": "button",
                    "icon": "fa fa-circle-o",
                    "title": "SAVE",
                    "onClick": "actions.save(model, formCtrl, form, $event)"
                }]
            }],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            eventListeners: {
                    "financial-summary": function(bundleModel, model, params) {
                    model._scores = params;
                    model._deviationDetails = model._scores[12].data;
                    model.expectedTurnoverObj['loanAmountRecommended']=  (params[0].data[0]['Recommended Loan Amount'] != null) ? Number((params[0].data[0]['Recommended Loan Amount']).replace(/,/g, '')) : null;
                    var monthTurnover =  (params[0].data[0]['Monthly Turnover'] != null) ? Number((params[0].data[0]['Monthly Turnover']).replace(/,/g, '')) : null;
                    model.expectedTurnoverObj['annualTurnover']=  ( monthTurnover * 12);
                    model.deviationDetails = [];
                    var allMitigants = {};
                    model.allMitigants = allMitigants;
                    for (i in model._deviationDetails) {
                        var item = model._deviationDetails[i];
                        var mitigants = item.Mitigant.split('|');
                        for (j in mitigants) {
                            allMitigants[mitigants[j]] = {
                                mitigant: mitigants[j],
                                parameter: item.Parameter,
                                score: item.ParameterScore,
                                selected: false
                            };
                            mitigants[j] = allMitigants[mitigants[j]];
                        }
                        if (item.ChosenMitigant && item.ChosenMitigant != null) {
                            var chosenMitigants = item.ChosenMitigant.split('|');
                            for (j in chosenMitigants) {
                                allMitigants[chosenMitigants[j]].selected = true;
                            }
                        }
                        model.deviationDetails.push({
                            parameter: item.Parameter,
                            score: item.ParameterScore,
                            deviation: item.Deviation,
                            mitigants: mitigants,
                            color_english: item.color_english,
                            color_hexadecimal: item.color_hexadecimal
                        });
                    }

                    model.additional = {};
                    let prepareFinancialData={};
                    if(params){
                        prepareFinancialData={
                            'Category': 'Current Application',
                            'Outstanding': 'NA',
                            'disbursement_amount': 'NA',
                            'loan_product': params[0].data[0]['Loan Product'],
                            'loan_status': 'NA',
                            'tenure': params[0].data[0]['Tenure'] 
                        }
                    }
                    model.customerHistoryFinancials['tableData'].push(prepareFinancialData);
                    
                },
                "customer-history-fin-snap": function(bundleModel, model, params){
                    let prepareFinancialData={
                        'tableData':[],
                        'financialsGraph':{}
                        };
                    var oustandingAmount = 0;
                    if(params){
                       _.forEach(params, function(param){
                        //param[5].data[0].exposer = (param[5].data[0].exposer).toFixed(2);
                            prepareFinancialData['tableData'].push(param[5].data[0]);
                            oustandingAmount = oustandingAmount + param[5].data[0].Outstanding;
                        });
                    };
                    model.expectedTurnoverObj['totalOutstandingAmount'] = oustandingAmount;
                    if(model.expectedTurnoverObj['annualTurnover'] && model.expectedTurnoverObj['annualTurnover'] != 0){
                        var kinaraExposureToAnnualTurovr = ((oustandingAmount + model.expectedTurnoverObj['loanAmountRecommended'])/model.expectedTurnoverObj['annualTurnover']).toFixed(2);
                        var kinaraExposureToAnnualTurnover = (kinaraExposureToAnnualTurovr*100)+"%";
                        model.expectedTurnoverObj['kinaraExposureToAnnualTurover'] = kinaraExposureToAnnualTurnover;
                    }
                    else{
                        model.expectedTurnoverObj['kinaraExposureToAnnualTurover']  = 0+'%'; 
                    }
                   
                    model.expectedTurnoverObj['actualValue'] = "ActualValue";
                    prepareFinancialData['tableData']=$filter("orderBy") (prepareFinancialData['tableData'], ['loanId']);
                    model.customerHistoryFinancials['tableData1'].push(model.expectedTurnoverObj);
                    _.forEach(prepareFinancialData['tableData'], function(histData){
                        model.customerHistoryFinancials['tableData'].push(histData);
                        });
                }
            },
            actions: {
                /*submit: function(model) {
                    // function: updateChosenMitigants // model.allMitigants is object
                    model.loanAccount.loanMitigants = [];
                    _.forOwn(model.allMitigants, function(v, k) {
                        if (v.selected) {
                            model.loanAccount.loanMitigants.push(v);
                        }
                    })
                },*/
                save: function(model, formCtrl, form, $event) {
                    $log.info("Inside save()");
                    PageHelper.clearErrors();

                    /*DEVIATION AND MITIGATION - SAVING SELECTED MITIGANTS*/
                    
                    model.loanAccount.loanMitigants = [];
                    _.forOwn(model.allMitigants, function(v, k) {
                        if (v.selected) {
                            model.loanAccount.loanMitigants.push(v);
                        }
                    })

                    /* TODO Call save service for the loan */
                    /* if(!validateAndPopulateMitigants(model)){
                         return;
                     }*/
                    // if(isEnrollmentsSubmitPending(model)){
                    //     return;
                    // }
                    if (!preLoanSaveOrProceed(model)){
                        return;
                    }
                    
                    if (_.hasIn(model.loanAccount, 'documents') && _.isArray(model.loanAccount.documents)){
                        for(var k=0;k <model.loanAccount.documents.length; k++) {
                            model.loanAccount.loanDocuments.push(model.loanAccount.documents[k]);
                        }
                    }
                    
                    model.mitigantsChanged= (model.loanMitigants.length== model.loanAccount.loanMitigants.length)?0:1;
                   // loanMitigants= [];

                    Utils.confirm(model.mitigantsChanged==0?"Are You Sure?":"Mitigants have chnaged . Are you sure?")
                        .then(
                            function() {

                                        model.mitigantsChanged=0;
                                        model.loanMitigants=model.loanAccount.loanMitigants;
                                model.temp.loanCustomerRelations = model.loanAccount.loanCustomerRelations;
                                var reqData = {
                                    loanAccount: _.cloneDeep(model.loanAccount)
                                };
                                reqData.loanProcessAction = "SAVE";
                                if(reqData.isGuarantorRequired == "NO") {
                                    reqData.noOfGuarantersRequired = 0;
                                }
                                //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                                // reqData.remarks = model.review.remarks;
                                reqData.loanAccount.screeningDate = reqData.loanAccount.screeningDate || Utils.getCurrentDate();
                                reqData.loanAccount.psychometricCompleted = reqData.loanAccount.psychometricCompleted || "N";

                                PageHelper.showLoader();

                                var completeLead = false;
                                if (!_.hasIn(reqData.loanAccount, "id")) {
                                    completeLead = true;
                                }
                                IndividualLoan.create(reqData)
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
                                        documentArrayFormation(model);
                                        BundleManager.pushEvent('new-loan', model._bundlePageObj, {
                                            loanAccount: model.loanAccount
                                        });
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
                                        // Updating offline record on success submission
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
                    if (_.hasIn(model.loanAccount, 'documents') && _.isArray(model.loanAccount.documents)){
                        for(var k=0;k <model.loanAccount.documents.length; k++) {
                            model.loanAccount.loanDocuments.push(model.loanAccount.documents[k]);
                        }
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
                    if (_.hasIn(model.loanAccount, 'documents') && _.isArray(model.loanAccount.documents)){
                        for(var k=0;k <model.loanAccount.documents.length; k++) {
                            model.loanAccount.loanDocuments.push(model.loanAccount.documents[k]);
                        }
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
                    if (_.hasIn(model.loanAccount, 'documents') && _.isArray(model.loanAccount.documents)){
                        for(var k=0;k <model.loanAccount.documents.length; k++) {
                            model.loanAccount.loanDocuments.push(model.loanAccount.documents[k]);
                        }
                    }
                    if (_.hasIn(model.loanAccount, 'noOfGuarantersRequired')) {
                        model.loanAccount.noOfGuarantersRequired = -1;
                    } 
                    Utils.confirm("Are You Sure?").then(function() {

                        var reqData = {
                            loanAccount: _.cloneDeep(model.loanAccount)
                        };
                        reqData.loanAccount.status = null;
                        if (model.loanAccount.currentStage == 'CreditCommitteeReview') {
                            reqData.loanAccount.status = 'SENT BACK'
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
                    var DedupeEnabled = SessionStore.getGlobalSetting("DedupeEnabled") || 'N';
                    $log.info(DedupeEnabled);
                    model.loanAccount.loanMitigants = [];
                    _.forOwn(model.allMitigants, function(v, k) {
                        if (v.selected) {
                            model.loanAccount.loanMitigants.push(v);
                        }
                    })

                    $log.info("Inside Proceed()");
                    PageHelper.clearErrors();
                    var nextStage = null;
                    var dedupeCustomerIdArray = [];
                    if (!validateForm(formCtrl)){
                        return;
                    }
                    if (_.hasIn(model.loanAccount, 'documents') && _.isArray(model.loanAccount.documents)){
                        for(var k=0;k <model.loanAccount.documents.length; k++) {
                            model.loanAccount.loanDocuments.push(model.loanAccount.documents[k]);
                        }
                    }
                    /*if (!validateForm(formCtrl)){
                    return;
                }
                if(!validateAndPopulateMitigants(model)){
                    return;
                }
*/
                    /* validating that loan AmountRequested should be greater than current loan amount*/
                    if(!_.isNull(model.loanAccount.transactionType) && model.loanAccount.transactionType.toLowerCase() =='renewal'){
                        if(model.linkedLoanAmount && (model.loanAccount.loanAmountRequested < model.linkedLoanAmount || ( !_.isNull(model.loanAccount.loanAmount) && model.loanAccount.loanAmount < model.linkedLoanAmount))){
                            var res = {
                                data: {
                                    error: 'RequestedLoanAmount or recommended loan amount should be greater than or equal current loan amount' +"  "+ model.linkedLoanAmount 
                                }
                            };
                            PageHelper.showErrors(res)
                            return;
                        }
                    }

                    var autoRejected = false;
                    if (model.currentStage == 'CreditCommitteeReview') {
                        model.loanAccount.status = 'APPROVED';
                    }

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
                        if (nextStage != null) {
                            reqData.stage = nextStage;
                        }
                        reqData.loanProcessAction = "PROCEED";
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        if (model.currentStage == 'Sanction') {
                            reqData.stage = 'LoanInitiation';
                        }                    
                        PageHelper.showProgress("update-loan", "Working...");
                        PageHelper.showLoader();
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
                                            PageHelper.hideLoader();
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