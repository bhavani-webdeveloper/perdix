define([], function() {

    return {
        pageUID: "kgfs.loans.individual.screening.LoanRequest",
        pageType: "Engine",
        dependencies: ["$log", "$q", "LoanAccount", "LoanProcess", 'Scoring', 'Enrollment', 'EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
            'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor", "UIRepository", "$injector", "irfNavigator"
        ],

        $pageFn: function($log, $q, LoanAccount, LoanProcess, Scoring, Enrollment, EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper, formHelper, elementsUtils,
            irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
            BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();


            var self;
            var validateForm = function(formCtrl) {
                formCtrl.scope.$broadcast('schemaFormValidate');
                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                    return false;
                }
                return true;
            };

            var getRelationFromClass = function(relation) {
                if (relation == 'guarantor') {
                    return 'Guarantor';
                } else if (relation == 'applicant') {
                    return 'Applicant';
                } else if (relation == 'co-applicant') {
                    return 'Co-Applicant';
                }
            };

            var isVehcileDetailsSaved = function(model) {
                var failed = false;
                var pageClassList = ['vehicle-details'];

                BundleManager.broadcastSchemaFormValidate(pageClassList);
                vehicleValidityState = BundleManager.getBundlePagesFormValidity(pageClassList);

                keys = Object.keys(vehicleValidityState);
                for(var idx = 0; idx < keys.length; idx++) {
                    if(vehicleValidityState[keys[idx]].invalid){
                        PageHelper.showProgress("LoanRequest","Some of the mandatory information of " + $filter('translate')(keys[idx].split("@")[0]) + " is not filled and submitted." , 5000);
                        failed = true;
                        break;
                    }
                }
                BundleManager.resetBundlePagesFormState(pageClassList);
                return failed;
            }

            var excelRate = function(nper, pmt, pv, fv, type, guess) {
                // Sets default values for missing parameters
                fv = typeof fv !== 'undefined' ? fv : 0;
                pv = typeof pv !== 'undefined' ? pv : 0;
                type = typeof type !== 'undefined' ? type : 0;
                guess = typeof guess !== 'undefined' ? guess : 0.1;

                // Sets the limits for possible guesses to any
                // number between 0% and 100%
                var lowLimit = 0;
                var highLimit = 1;

                // Defines a tolerance of up to +/- 0.00005% of pmt, to accept
                // the solution as valid.
                var tolerance = Math.abs(0.00000005 * pmt);

                // Tries at most 40 times to find a solution within the tolerance.
                for (var i = 0; i < 40; i++) {
                    // Resets the balance to the original pv.
                    var balance = pv;

                    // Calculates the balance at the end of the loan, based
                    // on loan conditions.
                    for (var j = 0; j < nper; j++) {
                        if (type == 0) {
                            // Interests applied before payment
                            balance = balance * (1 + guess) + pmt;
                        } else {
                            // Payments applied before insterests
                            balance = (balance + pmt) * (1 + guess);
                        }
                    }

                    // Returns the guess if balance is within tolerance.  If not, adjusts
                    // the limits and starts with a new guess.
                    if (Math.abs(balance + fv) < tolerance) {
                        return guess;
                    } else if (balance + fv > 0) {
                        // Sets a new highLimit knowing that
                        // the current guess was too big.
                        highLimit = guess;
                    } else {
                        // Sets a new lowLimit knowing that
                        // the current guess was too small.
                        lowLimit = guess;
                    }

                    // Calculates the new guess.
                    guess = (highLimit + lowLimit) / 2;
                }

                // Returns null if no acceptable result was found after 40 tries.
                return null;
            };

            var calculateNominalRate = function(loanAmount, frequency, tenure, flatRate) {
                var frequencyFactor;
                if (frequency && tenure && flatRate) {
                    switch (frequency) {
                        case 'D':
                        case 'Daily':
                            frequencyFactor = 365;
                            break;
                        case 'F':
                        case 'Fortnightly':
                            frequencyFactor = parseInt(365 / 15);
                            break;
                        case 'M':
                        case 'Monthly':
                            frequencyFactor = 12;
                            break;
                        case 'Q':
                        case 'Quarterly':
                            frequencyFactor = 4;
                            break;
                        case 'H':
                        case 'Half Yearly':
                            frequencyFactor = 2;
                            break;
                        case 'W':
                        case 'Weekly':
                            frequencyFactor = parseInt(365 / 7);
                            break;
                        case 'Y':
                        case 'Yearly':
                            frequencyFactor = 1;
                            break;
                        default:
                            throw new Error("Invalid frequency");
                    }
                    var nominalRate = Math.round(excelRate(parseFloat(tenure),  -Math.round(parseFloat(loanAmount) * (1 + (parseFloat(flatRate) / 100 * parseFloat(tenure) / frequencyFactor)) / parseFloat(tenure)), parseFloat(loanAmount)) * frequencyFactor * 1000000)/10000;
                    var someRate = parseFloat(nominalRate / (100 * frequencyFactor));
                    var estimatedEmi = (parseFloat(loanAmount) * someRate / parseFloat((1 - Math.pow(1 + someRate, -tenure))));
                    return {
                        nominalRate: nominalRate,
                        estimatedEmi: Math.round(estimatedEmi)
                    };
                } else {
                    throw new Error("Invalid input for nominal rate calculation");
                }
            }

            var configFile = function() {
                return {
                   
                }
            }

            var getIncludes = function(model) {

                return [
                    "PreliminaryInformation",
                    "PreliminaryInformation.partner",
                    "PreliminaryInformation.productType",
                    "PreliminaryInformation.frequency",
                    "PreliminaryInformation.loanProduct",
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
                    "LoanRecommendation.loanAmount",
                    "LoanRecommendation.loanAmountRecommended",
                    "LoanRecommendation.tenure",
                    "LoanRecommendation.interestRate",
                    "LoanRecommendation.expectedEmi",
                    "LoanMitigants",
                    "LoanMitigants.deviationParameter.mitigants",
                    "LoanMitigants.deviationParameter.mitigants",
                    "actionbox",
                    "actionbox.submit",
                    "actionbox.save",
                ];

            }

              var formRequest = function(model) { 
                return {
                    "overrides": {
                        "LoanRecommendation.loanChannels": {
                            "condition": "model.loanProcess.loanAccount.currentStage == 'CreditApproval2'",
                            "required": true
                        },
                        "LoanRecommendation.loanAmount": {
                           "title":"LOAN_AMOUNT_REQUEST",
                            "orderNo":10,
                            "required":true,
                            "readonly":true
                        },
                        "LoanRecommendation.loanAmountRecommended": {
                            "required":true
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
                            onChange: function(modelValue, form, model) {
                                model.loanAccount.estimatedEmi = null;
                            }
                        },
                        "PreliminaryInformation.estimatedEmi": {
                            "required": true,
                            "readonly": true
                        },
                        "PreliminaryInformation.frequencyRequested": {
                            "required": true,
                            onChange: function(modelValue, form, model) {
                                model.loanAccount.estimatedEmi = null;
                                model.loanAccount.expectedInterestRate = null;
                                model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = null;
                            }
                        },
                        "PreliminaryInformation.udf5": {
                            "required": true,
                            onChange: function(modelValue, form, model) {
                                model.loanAccount.estimatedEmi = null;
                                model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = null;
                                model.loanAccount.expectedInterestRate = null;
                            }
                        },
                        "PreliminaryInformation.tenureRequested": {
                            "required": true,
                            onChange: function(modelValue, form, model) {
                                model.loanAccount.estimatedEmi = null;
                                model.loanAccount.expectedInterestRate = null;
                            }
                        },
                        
                        "PreliminaryInformation.expectedInterestRate": {
                            "required": true,
                            "title": "NOMINAL_RATE",
                            "readonly": true
                        },
                        "PreliminaryInformation.partner": {
                            "required": true
                        },
                        "PreliminaryInformation.productType": {
                            "required": true
                        },
                        "PreliminaryInformation.frequency": {
                            "required": true
                        },
                        "PreliminaryInformation.loanProduct": {
                            "required": true
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
                        },
                        "actionbox.save": {
                            "buttonType": "submit"
                        }
                        
                    },
                    "includes": getIncludes(model),
                    "excludes": [
                        ""
                    ],
                    "options": {
                        "repositoryAdditions": {
                              "PreliminaryInformation": {
                                "items": {
                                    "partner": {
                                        "title": "PARTNER",
                                        "type": "select",
                                        "orderNo": 9
                                    },
                                    "productType": {
                                        "title": "PRODUCT_TYPE",
                                        "type": "select",
                                        "orderNo": 9
                                    },
                                    "frequency": {
                                        "title": "FREQUENCY",
                                        "type": "string",
                                        "orderNo": 9
                                    },
                                    "loanProduct": {
                                        "title": "LOAN_PRODUCT",
                                        "type": "string",
                                        "orderNo": 9
                                    },
                                    "comfortableEMI": {
                                        "title": "COMFORTABLE_EMI",
                                        "type": "string",
                                        "orderNo": 140
                                    },
                                    "modeOfDisbursement": {
                                        "title": "MODE_OF_DISBURSEMENT",
                                        "type": "select",
                                        "orderNo": 150
                                    }
                                }
                            },
                            "LoanRecommendation":{
                                "items":{
                                    "loanAmountRecommended":{
                                        "title":"LOAN_AMOUNT_RECOMMENDED",
                                        "type":"string",
                                        "orderNo":20
                                    },
                                    "expectedEmi":{
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
                                                "title":"NAME_OF_OWNER",
                                                "type":"string"
                                            },
                                            "collateralName":{
                                                "title":"COLLATERAL_NAME",
                                                "type":"string"
                                            },
                                            "marketValueOfAsset":{
                                                "title":"MARKET_VALUE_OF_ASSET",
                                                "type":"string"
                                            },
                                            "timeSinceTheAssetIsOwned":{
                                                "title":"TIME_SINCE_THE_ASSET_IS_OWNED",
                                                "type":"string"
                                            },
                                            "collateralDocuments":{
                                                "title":"COLLATERAL_DOCUMENTS",
                                                "key": "loanAccount.collateral[].collateralDocuments",
                                                "type": "file",
                                                "fileType": "image/*",
                                                "category": "Loan",
                                                "subCategory": "DOC1",
                                                "using": "scanner"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "additions": [
                            {
                            "type": "box",
                            "orderNo": 999,
                            "title": "REVIEW",
                            "condition": "model.loanAccount.id && model.loanAccount.isReadOnly!='Yes' && model.currentStage != 'Rejected'",
                            "items": [{
                                key: "review.action",
                                type: "radios",
                                titleMap: {
                                    "REJECT": "REJECT",
                                    "SEND_BACK": "SEND_BACK",
                                    "PROCEED": "PROCEED"
                                }
                            }, {
                                type: "section",
                                condition: "model.review.action=='PROCEED'",
                                items: [{
                                    title: "REMARKS",
                                    key: "loanProcess.remarks",
                                    type: "textarea",
                                    required: true
                                }, {
                                    key: "review.proceedButton",
                                    type: "button",
                                    title: "PROCEED",
                                    buttonType: "submit",
                                    onClick: "actions.proceed(model, formCtrl, form, $event)"
                                }]

                            }, {
                                type: "section",
                                condition: "model.review.action=='SEND_BACK'",
                                items: [{
                                    title: "REMARKS",
                                    key: "loanProcess.remarks",
                                    type: "textarea",
                                    required: true
                                }, {
                                    key: "loanProcess.stage",
                                    "required": true,
                                    type: "lov",
                                    autolov: true,
                                    lovonly: true,
                                    title: "SEND_BACK_TO_STAGE",
                                    bindMap: {},
                                    searchHelper: formHelper,
                                    search: function(inputModel, form, model, context) {
                                        var stage1 = model.loanProcess.loanAccount.currentStage;
                                        var targetstage = formHelper.enum('targetstage').data;
                                        var out = [];
                                        for (var i = 0; i < targetstage.length; i++) {
                                            var t = targetstage[i];
                                            if (t.field1 == stage1) {
                                                out.push({
                                                    name: t.name,
                                                    value: t.code
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
                                        model.loanProcess.stage = valueObj.value;

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
                                condition: "model.review.action=='REJECT'",
                                items: [{
                                        title: "REMARKS",
                                        key: "loanProcess.remarks",
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
                                            var stage1 = model.loanProcess.loanAccount.currentStage;

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
                                    },
                                    {
                                        key: "review.rejectButton",
                                        type: "button",
                                        title: "REJECT",
                                        required: true,
                                        onClick: "actions.reject(model, formCtrl, form, $event)"
                                    }
                                ]
                            }]
                            },
                            {
                                "type": "box",
                                "title": "REVERT_REJECT",
                                "condition": "model.currentStage=='Rejected'",
                                "items": [{
                                        type: "section",
                                        items: [{
                                            title: "REMARKS",
                                            key: "loanProcess.remarks",
                                            type: "textarea",
                                            required: true
                                        }, {
                                            title: "Reject Reason",
                                            key: "loanAccount.rejectReason",
                                            readonly: true,
                                            type: "textarea",
                                        }, {
                                            key: "loanProcess.stage",
                                            title: "SEND_BACK_TO_STAGE",
                                            type: "lov",
                                            lovonly:true,
                                            autolov: true,
                                            required: true,
                                            searchHelper: formHelper,
                                            search: function(inputModel, form, model, context) {
                                                var stage1 = model.review.preStage;
                                                var targetstage = formHelper.enum('targetstage').data;
                                                var out = [{'name': stage1, 'value': stage1}];
                                                for (var i = 0; i < targetstage.length; i++) {
                                                    var t = targetstage[i];
                                                    if (t.field1 == stage1) {
                                                        out.push({
                                                            name: t.name,
                                                            value: t.code
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
                                                model.loanProcess.stage = valueObj.value;
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
                                    },
                                ]
                            }
                        ]
                    }
                };
            }


            return {
                "type": "schema-form",
                "title": "LOAN_REQUEST",
                "subTitle": "BUSINESS",
                initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                                 
                    var self = this;
                   
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;

                    p1.then(function(repo) {
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest(model), configFile(), model);
                    }, function(err) {
                        console.log(err);

                    })

                },
                offlineInitialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                    model.loanProcess = bundleModel.loanProcess;
                    if(_.hasIn(model.loanProcess, 'loanAccount')) {
                        model.loanAccount = model.loanProcess.loanAccount;
                    }
                    var self = this;
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;
                    p1.then(function(repo) {
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest(model), configFile(), model);
                    }, function(err) {
                        console.log(err);

                    }) 
                },
                offline: false,
                getOfflineDisplayItem: function(item, index) {
                    return [
                        item.customer.firstName,
                        item.customer.centreCode,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                        "new-applicant": function(bundleModel, model, params){

                            $log.info(model.loanAccount.loanCustomerRelations);
            
                            $log.info("Inside new-applicant of LoanRequest");
                            var addToRelation = true;
                            for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                                if (model.loanAccount.loanCustomerRelations[i].customerId == params.customer.id) {
                                    addToRelation = false;
                                    if (params.customer.urnNo)
                                        model.loanAccount.loanCustomerRelations[i].urn =params.customer.urnNo;
                                        model.loanAccount.loanCustomerRelations[i].name =params.customer.firstName;
                                    break;
                                }
                            }
            
                            if (addToRelation){
                                model.loanAccount.loanCustomerRelations.push({
                                    'customerId': params.customer.id,
                                    'relation': "Applicant",
                                    'urn':params.customer.urnNo,
                                    'name':params.customer.firstName
                                });
                                model.loanAccount.applicant = params.customer.urnNo;
                            }
                            model.applicant = params.customer;
                            model.applicant.age1 = moment().diff(moment(model.applicant.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        },
                        "lead-loaded": function(bundleModel, model, obj) {
                            model.lead = obj;
                            model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                            model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                            model.loanAccount.loanPurpose2 = obj.loanPurpose2;
                            model.loanAccount.vehicleLoanDetails.registrationNumber = obj.vehicleRegistrationNumber;
                            model.loanAccount.screeningDate = obj.screeningDate || moment().format("YYYY-MM-DD");
                            model.loanAccount.parentLoanAccount = obj.parentLoanAccount;

                            if(model.loanAccount.loanPurpose1 == 'Purchase - New Vehicle'){
                                model.loanAccount.vehicleLoanDetails.vehicleType = 'New';
                            }else if (model.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle'){
                                model.loanAccount.vehicleLoanDetails.vehicleType = 'Used';
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
                                        model.loanAccount.loanCustomerRelations[i].name =params.customer.firstName;
                                    break;
                                }
                            }
            
                            if (addToRelation) {
                                model.loanAccount.loanCustomerRelations.push({
                                    'customerId': params.customer.id,
                                    'relation': "Co-Applicant",
                                    'urn':params.customer.urnNo,
                                    'name':params.customer.firstName
                                })
                            }
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
                                        model.loanAccount.loanCustomerRelations[i].name =params.customer.firstName;
                                    break;
                                }
                            }
            
                            if (addToRelation) {
                                model.loanAccount.loanCustomerRelations.push({
                                    'customerId': params.customer.id,
                                    'relation': "Guarantor",
                                    'urn': params.customer.urnNo,
                                    'name':params.customer.firstName
                                })
                            };
            
                            model.loanAccount.guarantors = model.loanAccount.guarantors || [];
            
                            var existingGuarantorIndex = _.findIndex(model.loanAccount.guarantors, function(g){
                                if (g.guaUrnNo == params.customer.urnNo || g.guaCustomerId == params.customer.id)
                                    return true;
                            })
            
                            if (existingGuarantorIndex<0){
                                model.loanAccount.guarantors.push({
                                    'guaCustomerId': params.customer.id,
                                    'guaUrnNo': params.customer.urnNo
                                });
                            } else {
                                if (!model.loanAccount.guarantors[existingGuarantorIndex].guaUrnNo){
                                    model.loanAccount.guarantors[existingGuarantorIndex].guaUrnNo = params.customer.urnNo;
                                }
                            }
            
            
                        },
                        "remove-customer-relation": function(bundleModel, model, enrolmentDetails){
                            $log.info("Inside enrolment-removed");
                            /**
                             * Following should happen
                             *
                             * 1. Remove customer from Loan Customer Relations
                             * 2. Remove custoemr from the placeholders. If Applicant, remove from applicant. If Guarantor, remove from guarantors.
                             */
            
                            // 1.
                            _.remove(model.loanAccount.loanCustomerRelations, function(customer){
                                return (customer.customerId==enrolmentDetails.customerId && customer.relation == getRelationFromClass(enrolmentDetails.customerClass)) ;
                            })
            
                            // 2.
                            switch(enrolmentDetails.customerClass){
                                case 'guarantor':
                                    _.remove(model.loanAccount.guarantors, function(guarantor){
                                        return (guarantor.guaCustomerId == enrolmentDetails.customerId)
                                    })
                                    break;
                                case 'applicant':
            
                                    break;
                                case 'co-applicant':
            
                                    break;
            
                            }
                        },
                        "cb-check-update": function(bundleModel, model, params){
                            $log.info("Inside cb-check-update of LoanRequest");
                            for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                                if (model.loanAccount.loanCustomerRelations[i].customerId == params.customerId) {
                                    if(params.cbType == 'BASE')
                                        model.loanAccount.loanCustomerRelations[i].highmarkCompleted = true;
                                    else if(params.cbType == 'CIBIL')
                                        model.loanAccount.loanCustomerRelations[i].cibilCompleted = true;
                                }
                            }
                        },
                        "financial-summary": function(bundleModel, model, params) {
                            model._scores = params;
                            model._deviationDetails = model._scores[6].data;
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
                    }
                },
                form: [],
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
                    save: function(model, formCtrl, form, $event) {
                        /* Loan SAVE */
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }

                        model.loanAccount.loanMitigants = [];
                        _.forOwn(model.allMitigants, function(v, k) {
                            if (v.selected) {
                                model.loanAccount.loanMitigants.push(v);
                            }
                        });

                        if (!model.loanAccount.id) {
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }
                        PageHelper.showLoader();
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.save()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                             BundleManager.pushEvent('new-loan', model._bundlePageObj, {loanAccount: value.loanAccount});


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

                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);
                            }, function(err) {
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                    },
                    sendBack: function(model, formCtrl, form, $event) {
                        PageHelper.showLoader();

                        if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses) && !model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses[0])
                            delete model.loanAccount.vehicleLoanDetails.vehicleLoanExpenses
                        if (_.isArray(model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes) && !model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes[0])
                            delete model.loanAccount.vehicleLoanDetails.vehicleLoanIncomes

                        if (model.loanProcess.remarks==null || model.loanProcess.remarks =="" || model.review.targetStage1 ==null || model.review.targetStage1 ==""){
                               PageHelper.showProgress("update-loan", "Send to Stage / Remarks is mandatory", 3000);
                               PageHelper.hideLoader();
                               return false;
                        }

                        Utils.confirm("Are You Sure?")
                            .then(
                                function(){
                                    model.loanProcess.sendBack()
                                        .finally(function() {
                                            PageHelper.hideLoader();
                                        })
                                        .subscribe(function(value) {
                                            PageHelper.showProgress('enrolment', 'Done.', 5000);
                                            irfNavigator.goBack();
                                        }, function(err) {
                                            PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                            PageHelper.showErrors(err);
                                            PageHelper.hideLoader();
                                        });
                                })
                    },
                    proceed: function(model, formCtrl, form, $event) {
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }

                        if(model.loanProcess.loanAccount.currentStage == 'Screening' && isVehcileDetailsSaved(model)){
                            return;
                        }

                        if(model.loanProcess.loanAccount.currentStage=='TeleVerification' && (model.loanProcess.loanAccount.loanPurpose1 == 'Purchase - Used Vehicle' || model.loanProcess.loanAccount.loanPurpose1 == 'Refinance') && (!_.hasIn(model.loanProcess.loanAccount.vehicleLoanDetails, 'vehicleValuationDoneAt') || model.loanProcess.loanAccount.vehicleLoanDetails.vehicleValuationDoneAt === null)) {
                            PageHelper.showErrors({"data": {"error":"Vehicle Valuation should be done"}});
                            return false;
                        }

                        model.loanAccount.loanMitigants = [];
                        _.forOwn(model.allMitigants, function(v, k) {
                            if (v.selected) {
                                model.loanAccount.loanMitigants.push(v);
                            }
                        });

                        PageHelper.showLoader();
                        model.loanProcess.proceed()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {

                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function(err) {
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                        // PageHelper.clearErrors();
                        // PageHelper.showLoader();
                        // PageHelper.showProgress('loan-process', 'Updating Loan');

                    },
                    reject: function(model, formCtrl, form, $event) {
                        if (model.loanProcess.remarks==null || model.loanProcess.remarks =="" || model.loanAccount.rejectReason ==null || model.loanAccount.rejectReason ==""){
                               PageHelper.showProgress("update-loan", "Reject Reason / Remarks is mandatory", 3000);
                               PageHelper.hideLoader();
                               return false;
                        }
                        PageHelper.showLoader();
                        model.loanProcess.reject()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function(err) {
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    }
                }
            };

        }
    }
});
