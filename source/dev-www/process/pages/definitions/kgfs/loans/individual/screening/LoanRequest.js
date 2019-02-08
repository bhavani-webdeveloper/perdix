define([],function(){

    return {
        pageUID: "kgfs.loans.individual.screening.LoanRequest",
        pageType: "Engine",
        dependencies: ["$log", "$q","LoanAccount","LoanProcess", 'Scoring', 'Enrollment','EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
            'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor","UIRepository", "$injector", "irfNavigator"],

        $pageFn: function($log, $q, LoanAccount,LoanProcess, Scoring, Enrollment,EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper,formHelper,elementsUtils,
                          irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
                          BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();
            var podiValue = SessionStore.getGlobalSetting("percentOfDisposableIncome");
            //PMT calculation
            var pmt = function(rate, nper, pv, fv, type) {
                if (!fv) fv = 0;
                if (!type) type = 0;

                if (rate == 0) return -(pv + fv) / nper;

                var pvif = Math.pow(1 + rate, nper);
                var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

                if (type == 1) {
                    pmt /= (1 + rate);
                };

                return pmt;
            }
            //pmt function completed

            var self;
            var validateForm = function(formCtrl){
                formCtrl.scope.$broadcast('schemaFormValidate');
                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                    return false;
                }
                return true;
            };

            var getRelationFromClass = function(relation){
                if (relation == 'guarantor'){
                    return 'Guarantor';
                } else if (relation == 'applicant'){
                    return 'Applicant';
                } else if (relation == 'co-applicant'){
                    return 'Co-Applicant';
                }
            };

            var computeEstimatedEMI = function(model){
                var fee = 0;
                if(model.loanAccount.commercialCibilCharge)
                    if(!_.isNaN(model.loanAccount.commercialCibilCharge))
                        fee+=model.loanAccount.commercialCibilCharge;
                $log.info(model.loanAccount.commercialCibilCharge);

                // Get the user's input from the form. Assume it is all valid.
                // Convert interest from a percentage to a decimal, and convert from
                // an annual rate to a monthly rate. Convert payment period in years
                // to the number of monthly payments.

                if(model.loanAccount.loanAmountRequested == '' || model.loanAccount.expectedInterestRate == '' || model.loanAccount.frequencyRequested == '' || model.loanAccount.tenureRequested == '')
                    return;

                var principal = model.loanAccount.loanAmountRequested;
                var interest = model.loanAccount.expectedInterestRate / 100 / 12;
                var payments;
                if (model.loanAccount.frequencyRequested == 'Yearly')
                    payments = model.loanAccount.tenureRequested * 12;
                else if (model.loanAccount.frequencyRequested == 'Monthly')
                    payments = model.loanAccount.tenureRequested;

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

                    model.loanAccount.emiRequested = round(monthly);
                    //document.loandata.total.value = round(monthly * payments);
                    //document.loandata.totalinterest.value = round((monthly * payments) - principal);
                }
                // Otherwise, the user's input was probably invalid, so don't
                // display anything.
                else {
                    model.loanAccount.emiRequested  = "";
                    //document.loandata.total.value = "";
                    //document.loandata.totalinterest.value = "";
                }

            };
                // This simple method rounds a number to two decimal places.
             var clearAll = function(baseKey,listOfKeys,model){
                if(listOfKeys != null && listOfKeys.length > 0){
                    for(var i =0 ;i<listOfKeys.length;i++){
                        if(typeof model[baseKey][listOfKeys[i]] !="undefined"){
                                model[baseKey][listOfKeys[i]] = null;
                        }
                    }
                }
                else{
                    model[baseKey] = {};
                }
            }
                function round(x) {
                  return Math.ceil(x);
                }

            var configFile = function() {
                return {

                }
            }

             var overridesFields = function (bundlePageObj) {
                return {
                        "LoanRecommendation.loanAmount": {
                           "title":"LOAN_AMOUNT_REQUEST",
                            "orderNo":10,
                            "required":true,
                            "readonly":true,
                            onChange:function(value,form,model){
                                computeEMI(model);
                            }
                        },
                        "LoanRecommendation.loanAmountRecommended": {
                            "required":true,
                            onChange:function(value,form,model){
                                computeEMI(model);
                            }
                        },
                        "LoanRecommendation.tenure": {
                            onChange:function(value,form,model){
                                computeEMI(model);
                            }
                        },
                        "LoanRecommendation.interestRate": {
                            onChange:function(value,form,model){
                                computeEMI(model);
                            }
                        },
                        "LoanRecommendation.expectedEmi": {
                            "required":true,
                            "readonly":true
                        },
                        "VehicleLoanIncomesInformation.VehicleLoanIncomes.incomeAmount": {
                            "required": true
                        },
                        "VehicleExpensesInformation.VehicleExpenses.expenseAmount": {
                            "required": true
                        },
                        
                        "DeductionsFromLoan.estimatedEmi": {
                            "readonly": true,
                            "condition": "model.loanAccount.securityEmiRequired == 'YES'"
                        },                            
                        "PreliminaryInformation.loanAmountRequested": {
                            onChange:function(value,form,model){
                                computeEstimatedEMI(model);
                            }
                        },
                        "PreliminaryInformation.estimatedEmi": {
                            "required": true,
                            "readonly": true
                        },
                        "PreliminaryInformation.frequencyRequested": {
                            "required": true,
                            onChange:function(value,form,model){
                                computeEstimatedEMI(model);
                            }
                        },
                        "PreliminaryInformation.udf5": {
                            "required": true,
                            onChange:function(value,form,model){
                                computeEstimatedEMI(model);
                            }
                        },
                        "PreliminaryInformation.tenureRequested": {
                            "required": true,
                            onChange:function(value,form,model){
                                computeEstimatedEMI(model);
                            }
                        },
                        
                        "PreliminaryInformation.expectedInterestRate": {
                            "required": true,
                            "title": "NOMINAL_RATE",
                            "readonly": true
                        },
                        "PreliminaryInformation.productType": {
                        "required": true,
                        "enumCode": "product_type",
                        "onChange": function(valueObj,context,model){
                                clearAll('loanAccount',['frequency','productCode',"loanAmount","tenure","interestRate","loanPurpose1","loanPurpose2","loanPurpose3"],model);
                                model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = null;
                                if(valueObj == "JEWEL"){
                                    getGoldRate(model);
                                    model.loanAccount.jewelLoanDetails = {};
                                    model.loanAccount.jewelLoanDetails.encoreClosed = false;
                                    model.loanAccount.jewelLoanDetails.jewelPouchLocationType = "BRANCH";
                                }
                                else{
                                    model.loanAccount.jewelLoanDetails = {};
                                }
                            }
                        },
                        "PreliminaryInformation.partner": {
                            "enumCode": "loan_partner",
                            "onChange": function(valueObj,context,model){
                                clearAll('loanAccount',['frequency','productCode',"loanAmount","tenure","interestRate","loanPurpose1","loanPurpose2","loanPurpose3"],model);
                                model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = null;
                                //clearAll('additions',['tenurePlaceHolder','interestPlaceHolder','amountPlaceHolder'],model)
                            },
                        },
                        "PreliminaryInformation.frequency": {
                            "required":true,
                            "enumCode": "loan_product_frequency",
                            "onChange": function(valueObj,context,model){
                                clearAll('loanAccount',['productCode',"loanAmount","tenure","interestRate","loanPurpose1","loanPurpose2","loanPurpose3"],model);
                                model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = null;
                                //clearAll('additions',['tenurePlaceHolder','interestPlaceHolder','amountPlaceHolder'],model)
                            }
                        },
                        "PreliminaryInformation.loanProduct": {
                            bindMap: {
                                "Partner": "loanAccount.partnerCode",
                                // "ProductCategory": "loanAccount.productCategory",
                                "Frequency": "loanAccount.frequency",
                                "loanType": "loanAccount.loanType"
                            },
                            autolov: true,
                            required: true,
                            searchHelper: formHelper,
                            search: function (inputModel, form, model, context) {
                                var deferred = $q.defer();
                                Queries.getLoanProductDetails(model.loanAccount.loanType, model.loanAccount.partnerCode, model.loanAccount.frequency).then(function(resp){
                                    for(var i = resp.body.length-1; i>= 0; i--){
                                        var date = moment(resp.body[i].expiry_date,"YYYY-MM-DD");
                                        var currentDate = moment(Utils.getCurrentDate(),"YYYY-MM-DD");
                                        if( date < currentDate)
                                            resp.body.splice(i,1);
                                    }
                                    deferred.resolve(resp);
                                }),function(err){
                                    deferred.reject(err);
                                };
                                return deferred.promise;
                            },
                            onSelect: function (valueObj, model, context) {
                                clearAll("loanAccount",["loanAmount","tenure","interestRate","loanPurpose1","loanPurpose2","loanPurpose3"],model);
                                model.loanAccount.productCode = valueObj.productCode;
                                // model.additions.tenurePlaceHolder = valueObj.tenure_from == valueObj.tenure_to ? valueObj.tenure_from : valueObj.tenure_from + '-' + valueObj.tenure_to;
                                // model.additions.amountPlaceHolder = valueObj.amount_from == valueObj.amount_to ? valueObj.amount_from : valueObj.amount_from + '-' + valueObj.amount_to;
                                // model.additions.interestPlaceHolder = valueObj.min_interest_rate == valueObj.max_interest_rate ? valueObj.min_interest_rate : valueObj.min_interest_rate + '-' + valueObj.max_interest_rate;
                                // if(valueObj.tenure_from == valueObj.tenure_to){
                                //     model.additions.tenurePlaceHolder = valueObj.tenure_from
                                // }
                                // if(valueObj.amount_from == valueObj.amount_to){
                                //     model.additions.amountPlaceHolder = valueObj.amount_from;
                                // }
                                model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = valueObj.product_name;
                                // model.additions.number_of_guarantors = valueObj.number_of_guarantors ? valueObj.number_of_guarantors : 0;
                                // model.additions.co_borrower_required = valueObj.co_borrower_required ? 1 : 0;
                            },
                            getListDisplayItem: function (item, index) {
                                return [
                                    item.productCode, 
                                    item.product_name
                                ];
                            },
                            onChange: function (value, form, model) {
                                console.log("Test");
                            //    clearAll("loanAccount",["loanAmountRequested","requestedTenure","interestRate","loanPurpose1","loanPurpose2","loanPurpose3"],model);
                            },
                        },                        
                        "PreliminaryInformation.comfortableEMI": {
                            "required": true
                        },
                        "PreliminaryInformation.modeOfDisbursement": {
                            "required": true
                        },
                        "LoanCustomerRelations": {
                            "orderNo": 2
                        },
                        "LoanCustomerRelations.loanCustomerRelations": {
                            "add": null,
                            "remove": null,
                            "startEmpty": true
                        },
                        "LoanCustomerRelations.loanCustomerRelations.customerId": {
                           "readonly": true
                        },
                        "LoanCustomerRelations.loanCustomerRelations.urn": {
                           "readonly": true
                        },
                        "LoanCustomerRelations.loanCustomerRelations.name": {
                           "readonly": true
                        },
                        "LoanCustomerRelations.loanCustomerRelations.relation": {
                           "readonly": true
                        },
                        "LoanCustomerRelations.loanCustomerRelations.relationshipWithApplicant": {
                           "condition": "model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                           "required": true
                        },
                        "LoanRecommendation.processingFee": {
                            "key": "loanAccount.vProcessingFee"
                        },
                        "LoanDocuments.loanDocuments.documentId": {
                            "offline": true
                        },
                        "LoanDocuments.loanDocuments": {
                            "title":"ADD_LOAN_DOCUMENT"
                        },
                        "CollateralInformation": {
                            "title":"COLLATERAL",
                            "orderNo":20
                        },
                        "CollateralInformation.collateral": {
                            "title":"ADD_COLLATERAL",
                            "required":true
                        },
                        "CollateralInformation.collateral.collateralType": {
                            "title":"COLLATERAL_TYPE",
                            "required":true
                        },
                        "CollateralInformation.collateral.nameOfOwner": {
                            "required":true
                        },
                        "CollateralInformation.collateral.collateralName": {
                             "required":true
                        },
                        "CollateralInformation.collateral.marketValueOfAsset": {
                             "required":true
                        },
                        "CollateralInformation.collateral.timeSinceTheAssetIsOwned": {
                             "required":true
                        },
                        "CollateralInformation.collateral.collateralDocuments": {
                             "required":true
                        }
                    }
                }

            var getIncludes = function (model) {

                return [
                    "PreliminaryInformation",
                    "PreliminaryInformation.partner",
                    "PreliminaryInformation.productType",
                    "PreliminaryInformation.frequency",
                    "PreliminaryInformation.loanProduct",
                    "PreliminaryInformation.productName",
                    "PreliminaryInformation.loanPurpose1",
                    "PreliminaryInformation.loanPurpose2",
                    "PreliminaryInformation.loanAmountRequested",
                    "PreliminaryInformation.frequencyRequested",
                    "PreliminaryInformation.tenureRequested",
                    "PreliminaryInformation.comfortableEMI",
                    "PreliminaryInformation.modeOfDisbursement",

                    "CollateralInformation",
                    "CollateralInformation.collateral",
                    "CollateralInformation.collateral.collateralType",
                    "CollateralInformation.collateral.nameOfOwner",
                    "CollateralInformation.collateral.collateralName",
                    "CollateralInformation.collateral.marketValueOfAsset",
                    "CollateralInformation.collateral.timeSinceTheAssetIsOwned",
                    "CollateralInformation.collateral.collateralDocuments",

                    "LoanDocuments",
                    "LoanDocuments.loanDocuments",
                    "LoanDocuments.loanDocuments.document",
                    "LoanDocuments.loanDocuments.documentId",

                    "LoanRecommendation",
                    "LoanRecommendation.loanAmountRecommended",
                    "LoanRecommendation.loanAmount",
                    "LoanRecommendation.tenure",
                    "LoanRecommendation.interestRate",
                    "LoanRecommendation.expectedEmi",

                    "LoanMitigants",
                    "LoanMitigants.deviationDetails",
                    "LoanMitigants.loanMitigants",
                    "LoanMitigants.loanMitigants.parameter",
                    "LoanMitigants.loanMitigants.mitigant",

                    "PostReview",
                    "PostReview.action",
                    "PostReview.proceed",
                    "PostReview.proceed.remarks",
                    "PostReview.proceed.proceedButton",
                    "PostReview.sendBack",
                    "PostReview.sendBack.remarks",
                    "PostReview.sendBack.stage",
                    "PostReview.sendBack.sendBackButton",
                    "PostReview.reject",
                    "PostReview.reject.remarks",
                    "PostReview.reject.rejectReason",
                    "PostReview.reject.rejectButton",

               ];

            }

            return {
                "type": "schema-form",
                "title": "LOAN_REQUEST",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // AngularResourceService.getInstance().setInjector($injector);

                    if(model.currentStage=='Screening' || model.currentStage=='ScreeningReview'|| model.currentStage=='Application') {
                        if(model.loanAccount.estimatedEmi){
                            model.loanAccount.estimatedEmi = model.loanAccount.estimatedEmi;
                        } else {
                            if(model.currentStage=='ScreeningReview') {
                                computeEMI(model);
                            } else {
                                computeEstimatedEMI(model);
                            }
                        }
                    }

                    /* Setting data recieved from Bundle */
                    model.loanAccount = model.loanProcess.loanAccount;

                    if (_.hasIn(model, 'loanAccount.loanCustomerRelations') &&
                        model.loanAccount.loanCustomerRelations!=null &&
                        model.loanAccount.loanCustomerRelations.length > 0) {
                        var lcr = model.loanAccount.loanCustomerRelations;
                        var idArr = [];
                    for (var i=0;i<lcr.length;i++){
                        idArr.push(lcr[i].customerId);
                    }
                    Queries.getCustomerBasicDetails({'ids': idArr})
                    .then(function(result){
                        if (result && result.ids){
                             for (var i = 0; i < lcr.length; i++) {
                                var cust = result.ids[lcr[i].customerId];
                            if (cust) {
                                lcr[i].name = cust.first_name;
                             }
                        }
                     }
                     });
                    }

                    BundleManager.broadcastEvent('loan-account-loaded', {loanAccount: model.loanAccount});                     

                     /* Deviations and Mitigations grouping */
                    if (_.hasIn(model.loanAccount, 'loanMitigants') && _.isArray(model.loanAccount.loanMitigants)){
                        var loanMitigantsGrouped = {};
                        for (var i=0; i<model.loanAccount.loanMitigants.length; i++){
                            var item = model.loanAccount.loanMitigants[i];
                            if (!_.hasIn(loanMitigantsGrouped, item.parameter)){
                                loanMitigantsGrouped[item.parameter] = [];
                            }
                            loanMitigantsGrouped[item.parameter].push(item);
                        }
                        model.loanMitigantsByParameter = [];
                        _.forOwn(loanMitigantsGrouped, function(mitigants, key){
                            var chosenMitigants = "<ul>";

                            for (var i=0; i<mitigants.length; i++){
                                chosenMitigants = chosenMitigants + "<li>" + mitigants[i].mitigant + "</li>";
                            }
                            chosenMitigants = chosenMitigants + "</ul>";
                            model.loanMitigantsByParameter.push({'Parameter': key, 'Mitigants': chosenMitigants})
                        })
                    }
                    /* End of Deviations and Mitigations grouping */

                    self = this;
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;
                    p1.then(function(repo) {                        
                        var formRequest = {
                            "overrides": overridesFields(model),
                            "includes": getIncludes(model),
                            "excludes": [
                            ],
                            "options": {
                                "repositoryAdditions": {
                                        "PreliminaryInformation": {
                                "items": {
                                    "partner": {
                                        "key":"loanAccount.partnerCode",
                                        "title": "PARTNER",
                                        "type": "select",
                                        "enumCode":"partner",
                                        "orderNo": 9
                                    },
                                    "productType": {
                                        "key":"loanAccount.loanType",
                                        "title": "PRODUCT_TYPE",
                                        "type": "select",
                                        "enumCode":"product_type",

                                        "orderNo": 9
                                    },
                                    "frequency": {
                                        "key":"loanAccount.frequency",
                                        "title": "FREQUENCY",
                                        "type": "select",
                                        "orderNo": 9
                                    },
                                    "loanProduct": {
                                        "key":"loanAccount.productCode",
                                        "title": "LOAN_PRODUCT",
                                        "type": "lov",
                                        "enumCode":"loan_product",
                                        "orderNo": 10
                                    },
                                    "productName":{
                                        "title": "PRODUCT_NAME",
                                        "readonly": true,
                                        "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6",
                                        "orderNo": 11
                                            
                                    },
                                    "comfortableEMI": {
                                        "key":"loanAccount.estimatedEmi",
                                        "title": "COMFORTABLE_EMI",
                                        "type": "string",
                                        "orderNo": 140
                                    },
                                    "modeOfDisbursement": {
                                        "key":"loanAccount.psychometricCompleted",
                                        "title": "MODE_OF_DISBURSEMENT",
                                        "type": "select",
                                        "enumCode":"mode_of_disbursement",
                                        "orderNo": 150
                                    }
                                }
                            },
                            "LoanRecommendation":{
                                "items":{
                                    "loanAmountRecommended":{
                                        "key":"loanAccount.loanAmount",
                                        "title":"LOAN_AMOUNT_RECOMMENDED",
                                        "type":"amount",
                                        "orderNo":20
                                    },
                                    "expectedEmi":{
                                        "key":"loanAccount.emiRequested",
                                        "title":"EXPECTED_EMI",
                                        "type":"string"
                                    }
                                }
                            },
                            "CollateralInformation":{
                                "items":{
                                    "collateral":{ 
                                        "items":{
                                            "nameOfOwner":{
                                                "key": "loanAccount.collateral[].propertyOwnerName",
                                                "title":"NAME_OF_OWNER",
                                                "type":"string"
                                            },
                                            "collateralName":{
                                                "key": "loanAccount.collateral[].udf1",
                                                "title":"COLLATERAL_NAME",
                                                "type":"string"
                                            },
                                            "marketValueOfAsset":{
                                                "key": "loanAccount.collateral[].udf2",
                                                "title":"MARKET_VALUE_OF_ASSET",
                                                "type":"numeric"
                                            },
                                            "timeSinceTheAssetIsOwned":{
                                                "key": "loanAccount.collateral[].udf3",
                                                "title":"TIME_SINCE_THE_ASSET_IS_OWNED",
                                                "type":"amount"
                                            },
                                            "collateralDocuments":{
                                                "title":"COLLATERAL_DOCUMENTS",
                                                "key": "loanAccount.collateral[].udf4",
                                                "type": "file",
                                                "fileType": "image/*",
                                                "category": "Loan",
                                                "subCategory": "DOC1",
                                                "using": "scanner"
                                            }
                                        }
                                    }
                                }
                            },
                            "LoanMitigants": {
                                "type": "box",
                                "orderNo": 310,
                                "colClass": "col-sm-6",
                                "title": "DEVIATION_AND_MITIGATION",
                                "items": {
                                    "deviationDetails": {
                                        "type": "section",
                                        "colClass": "col-sm-12",
                                        "html": '<table class="table"><colgroup><col width="20%"><col width="5%"><col width="20%"></colgroup><thead><tr><th>Parameter Name</th><th></th><th>Mitigation</th></tr></thead><tbody>' +
                                            '<tr ng-repeat="item in model.deviationDetails">' +
                                            '<td>{{ item["parameter"] }}</td>' +
                                            '<td>{{ item["deviation"] }}</td>' +
                                            '<td><ul class="list-unstyled">' +
                                            '<li ng-repeat="m in item.mitigants " id="{{m.mitigant}}">' +
                                            '<input type="checkbox"  ng-model="m.selected" ng-checked="m.selected"> {{ m.mitigant }}' +
                                            '</li></ul></td></tr></tbody></table>'
                                    },                                    
                                    "loanMitigants":{
                                        "key":"loanAccount.loanMitigants",
                                        "title":"ADD",
                                        "type":"array",
                                        "startEmpty": true,
                                        "items":{
                                            "parameter":{
                                               "key":"loanAccount.loanMitigants[].parameter",
                                               "title":"DEVIATION",
                                               "type":"string"
                                            },
                                            "mitigant":{
                                               "key":"loanAccount.loanMitigants[].mitigant",
                                               "title":"MITIGATION",
                                               "type":"string"
                                            }
                                        }
                                    }
                                }
                            },
                            "PostReview": {
                                        "type": "box",
                                        "title": "POST_REVIEW",
                                        "condition": "model.loanAccount.id",
                                        "orderNo": 600,
                                        "items": {
                                            "action": {
                                                "key": "review.action",
                                                "type": "radios",
                                                "titleMap": {
                                                    "REJECT": "REJECT",
                                                    "SEND_BACK": "SEND_BACK",
                                                    "PROCEED": "PROCEED"
                                                }
                                            }, 
                                            "proceed": {
                                                "type": "section",
                                                "condition": "model.review.action=='PROCEED'",
                                                "items": {
                                                    "remarks": {
                                                        "title": "REMARKS",
                                                        "key": "loanProcess.remarks",
                                                        "type": "textarea",
                                                        "required": true
                                                    }, 
                                                    "proceedButton": {
                                                        "key": "review.proceedButton",
                                                        "type": "button",
                                                        "title": "PROCEED",
                                                        "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                                    }
                                                }
                                            },
                                            "sendBack": {
                                                "type": "section",
                                                "condition": "model.review.action=='SEND_BACK'",
                                                "items": {
                                                    "remarks": {
                                                        "title": "REMARKS",
                                                        "key": "loanProcess.remarks",
                                                        "type": "textarea",
                                                        "required": true
                                                    }, 
                                                   "stage": {
                                                        "key": "loanProcess.stage",
                                                        "required": true,
                                                        "type": "lov",
                                                        "title": "SEND_BACK_TO_STAGE",
                                                        "resolver": "IREPSendBacktoStageLOVConfiguration"
                                                    }, 
                                                   "sendBackButton": {
                                                        "key": "review.sendBackButton",
                                                        "type": "button",
                                                        "title": "SEND_BACK",
                                                        "onClick": "actions.sendBack(model, formCtrl, form, $event)"
                                                    }
                                                }
                                            },
                                            "reject": {
                                                "type": "section",
                                                "condition": "model.review.action=='REJECT'",
                                                "items": {
                                                    "remarks": {
                                                        "title": "REMARKS",
                                                        "key": "loanProcess.remarks",
                                                        "type": "textarea",
                                                        "required": true
                                                    }, 
                                                    "rejectReason": {
                                                        "key": "loanAccount.rejectReason",
                                                        "type": "lov",
                                                        "autolov": true,
                                                        "required":true,
                                                        "title": "REJECT_REASON",
                                                        "resolver": "IREPRejectReasonLOVConfiguration"
                                                    },
                                                    "rejectButton": {
                                                        "key": "review.rejectButton",
                                                        "type": "button",
                                                        "title": "REJECT",
                                                        "required": true,
                                                        "onClick": "actions.reject(model, formCtrl, form, $event)"
                                                    }
                                                }
                                            },
                                            "hold": {
                                                "type": "section",
                                                "condition": "model.review.action=='HOLD'",
                                                "items": {
                                                "remarks": {
                                                    "title": "REMARKS",
                                                    "key": "loanProcess.remarks",
                                                    "type": "textarea",
                                                    "required": true
                                                }, 
                                                "holdButton": {
                                                    "key": "review.holdButton",
                                                    "type": "button",
                                                    "title": "HOLD",
                                                    "required": true,
                                                    "onClick": "actions.holdButton(model, formCtrl, form, $event)"
                                                }
                                            }
                                            }
                                        }
                                    }
                                },
                                "additions": [
                                    {
                                        "type": "actionbox",
                                        "orderNo": 1000,
                                        "items": [
                                            {
                                                "type": "submit",
                                                "title": "SAVE"
                                            },
                                        ]
                                    }
                                ]
                            }
                        };
                        return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model);
                    })
                    .then(function(form){
                        self.form = form;
                    });
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
                    "lead-loaded": function(bundleModel, model, obj) {
                        model.lead = obj;
                        model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                        model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                        model.loanAccount.screeningDate = obj.screeningDate;
                    },
                    "new-business": function(bundleModel, model, params){
                        $log.info("Inside new-business of LoanRequest");
                        model.loanAccount.customerId = params.customer.id;
                        model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                        model.loanAccount.loanCentre.centreId = params.customer.centreId;
                        model.enterprise = params.customer;
                    },
                    "business-updated": function(bundleModel, model, obj){
                        $log.info("Inside business-update of IREP/LoanRequest");
                        model.loanAccount.customerId = obj.customer.id;
                        model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                        model.loanAccount.loanCentre.centreId = obj.customer.centreId;
                        model.loanAccount.loanCentre.loanId = model.loanAccount.id?model.loanAccount.id:null;
                        model.enterprise = obj.customer;

                    },
                    "load-deviation":function(bundleModel, model, params){
                        $log.info("Inside Deviation List");
                        model.deviations = {};
                        model.deviations.deviationParameter = [];
                        model.deviations.deviationParameter = params.deviations.deviationParameter;
                        model.deviations.scoreName = params.deviations.scoreName;

                        if (_.isArray(model.deviations.deviationParameter)){
                            _.forEach(model.deviations.deviationParameter, function(deviation){
                                if (_.hasIn(deviation, 'ChosenMitigants') && _.isArray(deviation.ChosenMitigants)){
                                    _.forEach(deviation.ChosenMitigants, function(mitigantChosen){
                                        for (var i=0; i< deviation.mitigants.length; i++){
                                            if (deviation.mitigants[i].mitigantName == mitigantChosen){
                                                deviation.mitigants[i].selected = true;
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                },
                form: [],
                schema: function() {
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {
                    submit: function(model, formCtrl, form){
                        model.loanAccount.customerId=model.loanAccount.loanCustomerRelations[0].customerId;
                        /* Loan SAVE */
                        if (!model.loanAccount.id){
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }
                        
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                BundleManager.pushEvent('new-loan', model._bundlePageObj, {loanAccount: model.loanAccount});                                    
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);

                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);                                
                                PageHelper.hideLoader();
                            });

                    },
                    holdButton: function(model, formCtrl, form, $event){
                        $log.info("Inside save()");
                         if (!model.loanAccount.id){
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }
                        model.loanAccount.status = "HOLD";
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.hold()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan hold.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });

                    },
                    sendBack: function(model, formCtrl, form, $event){                        
                        PageHelper.showLoader();
                        model.loanProcess.sendBack()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });
                    },
                    proceed: function(model, formCtrl, form, $event){
                        var trancheTotalAmount=0;
                        if(model.loanAccount.currentStage && model.loanAccount.currentStage == 'Sanction' && model.loanAccount.disbursementSchedules && model.loanAccount.disbursementSchedules.length){
                            
                            for (var i = model.loanAccount.disbursementSchedules.length - 1; i >= 0; i--) {
                                model.loanAccount.disbursementSchedules[i].modeOfDisbursement = "CASH";
                                trancheTotalAmount+=(model.loanAccount.disbursementSchedules[i].disbursementAmount || 0);
                            }
                            if (trancheTotalAmount > model.loanAccount.loanAmount){
                                PageHelper.showProgress("loan-create","Total tranche amount is more than the Loan amount",5000);
                                return false;
                              }  
                            
                            if (trancheTotalAmount < model.loanAccount.loanAmount){
                                PageHelper.showProgress("loan-create","Total tranche amount should match with the Loan amount",5000);
                                return false;
                            }
                        
                        }
                        PageHelper.showProgress('enrolment', 'Updating Loan');
                        model.loanProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });
                    },
                    reject: function(model, formCtrl, form, $event){
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        PageHelper.showLoader();
                         model.loanProcess.reject()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });
                    },
                    nomineeAddress: function(model, formCtrl, form, $event){
                        PageHelper.showLoader();
                        if(model.loanProcess.applicantEnrolmentProcess){
                            model.loanAccount.nominees[0].nomineeDoorNo=  model.loanProcess.applicantEnrolmentProcess.customer.doorNo;
                            model.loanAccount.nominees[0].nomineeLocality= model.loanProcess.applicantEnrolmentProcess.customer.locality;
                            model.loanAccount.nominees[0].nomineeStreet= model.loanProcess.applicantEnrolmentProcess.customer.street;
                            model.loanAccount.nominees[0].nomineePincode= model.loanProcess.applicantEnrolmentProcess.customer.pincode;
                            model.loanAccount.nominees[0].nomineeDistrict= model.loanProcess.applicantEnrolmentProcess.customer.district;
                            model.loanAccount.nominees[0].nomineeState = model.loanProcess.applicantEnrolmentProcess.customer.state;
                        }else
                        {
                            PageHelper.hideLoader();
                        }
                        PageHelper.hideLoader();
                    }
                }
            };

        }
    }
});
