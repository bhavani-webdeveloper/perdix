define([], function () {

    return {
        pageUID: "kgfs.loans.individual.booking.LoanBooking",
        pageType: "Engine",
        dependencies: ["$log", "$q", "LoanAccount", "LoanProcess", 'Scoring', 'Enrollment', 'EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
            'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor", "UIRepository", "$injector", "irfNavigator"
        ],

        $pageFn: function ($log, $q, LoanAccount, LoanProcess, Scoring, Enrollment, EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper, formHelper, elementsUtils,
            irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
            BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();
            var podiValue = SessionStore.getGlobalSetting("percentOfDisposableIncome");
            // Inside Computational functions

            var getGoldRate = function(model){
                var value = Queries.getGoldRate();
                value.then(function(resp){
                    model.additions.goldRate = resp;
                    model.additions.goldRatePerCarat = resp/22;
                })
                
            };
            var setGoldRate = function(weight,carat,model,index){
                var dynamicRate = model.additions.goldRatePerCarat * carat;
                var dynamicMarketValue = dynamicRate * weight;
                model.loanAccount.ornamentsAppraisals[index].ratePerGramInPaisa = parseFloat((dynamicRate/100).toFixed(2));
                model.loanAccount.ornamentsAppraisals[index].marketValueInPaisa = parseFloat((dynamicMarketValue/100).toFixed(2));
            };

            var addressMapCustomertoNominee= function (customer,nominee){
                nominee.nomineeState = customer.state || null;
                nominee.nomineeDistrict = customer.district ||null;
                nominee.nomineePincode = customer.pincode || null;
                nominee.nomineeLocality = customer.locality || null;
                nominee.nomineeStreet = customer.street ||null;
                nominee.nomineeDoorNo = customer.doorNo ||null;
            };

            var addressMapCustomertoGuardian= function (customer,guardian){
                guardian.guardianState = customer.state || null;
                guardian.guardianDistrict = customer.district|| null;
                guardian.guardianPincode = customer.pincode || null;
                guardian.guardianLocality = customer.locality || null;
                guardian.guardianStreet = customer.street || null;
                guardian.guardianDoorNo = customer.doorNo || null;
            }
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
            var policyBasedOnLoanType = function(loanType,model){
                if (loanType == "JEWEL"){
                    if(model.loanAccount.loanAmountRequested >= (parseInt(model.loanAccount.ornamentsAppraisals[0].marketValueInPaisa/100))*75){
                        var errMsg = 'Loan amount should be less then ' + ((parseInt(model.loanAccount.ornamentsAppraisals[0].marketValueInPaisa/100))*75);
                        PageHelper.showErrors({data:{error:errMsg}});
                        return false;
                    }
                }
                else if (loanType == "SECURED"){
                    model.loanAccount.jewelLoanDetails = null;
                    model.loanAccount.ornamentsAppraisals = [];
                }
                else if (loanType == "UNSECURED"){
                    model.loanAccount.jewelLoanDetails = null;
                    model.loanAccount.ornamentsAppraisals = [];
                }
                else if (loanType == "ChangeProduct"){
                    
                }
                return true;
            }
            var savePolicies = function(model){
                var temp = model.loanAccount.loanCustomerRelations;
                if(temp.length>0){
                    var hasharray = [];
                    for(i=0;i<temp.length;i++){
                        hasharray[temp[i].customerId] = temp[i].customerId;    
                    }
                }
                if(hasharray.length<temp.length)
                {
                    var errMsg = 'Applicant , Co-applicant and Gurantor should be different Persons';
                    PageHelper.showErrors({data:{error:errMsg}});
                    return false;
                }
                return true;
            };
            var validateCoGuarantor = function(c,g,type,lcr,model){
                var valueC = c;
                var valueG = g;
                var tempc = 0;
                var tempg = 0;
                for(i=0;i<lcr.length;i++){
                    if(lcr[i].relation == "Applicant")
                        continue;
                    lcr[i].relation == 'Co-Applicant' ? tempc = tempc+1 : tempg = tempg+1;
                }
                if(type=='validate'){
                    if (tempg >= valueG && tempc >=valueC){
                        return true;
                    }
                    else{
                        var errorc = tempc < valueC ? valueC-tempc : 0;
                        var errorg = tempg < valueG ? valueG-tempg : 0;
                        var msgC = errorc != 0 ? errorc + " more Co-Applicant(s) needed ": "";
                        var msgG = errorg != 0 ? errorg + " more Guarantor(s) needed ": "";
                        var finalMsg = (msgC+msgG).length > 3 ? msgC+msgG : false;
                        if(finalMsg){
                            PageHelper.showProgress('c&g',finalMsg,2000);
                            return false;
                        }
                    }
                }
                else{
                    model.additions.co_borrower_required = tempc;
                    model.additions.number_of_guarantors = tempg;
                }
            };
            var defaultConfiguration = function(model,initFlag){
                model.additions = {};
                model.additions.noOfGuarantorCoApplicantHtml = "<p stye=\"font-size:10px !important\"><font color=#FF6347>Number of Co-Applicants : {{model.additions.co_borrower_required}} Number of Guarantors :{{model.additions.number_of_guarantors}}</font><p>";
                model.loanAccount.bcAccount = {};
                model.loanAccount.processType = "1";
                
                if(model.loanAccount.loanAmount){
                    if(model.loanAccount.disbursementSchedules.length > 0){
                        model.loanAccount.disbursementSchedules[0].disbursementAmount = model.loanAccount.loanAmount;
                    }
                    
                }

               if (typeof model.loanAccount.nominees == "undefined" || model.loanAccount.nominees == null){
                    model.loanAccount.nominees = [];
                    model.loanAccount.nominees.push({});
                }
                else {
                    if(!initFlag){
                        model.loanAccount.nominees = [];
                        model.loanAccount.nominees.push({});
                    }
                    }
                if (typeof model.loanAccount.accountUserDefinedFields == "undefined") {
                    model.loanAccount.accountUserDefinedFields = {};
                    model.loanAccount.accountUserDefinedFields.userDefinedFieldValues = {};
                }
                else {
                   if(!initFlag)
                    {
                    model.loanAccount.accountUserDefinedFields = {};
                    model.loanAccount.accountUserDefinedFields.userDefinedFieldValues = {};
                    }
                }
                if (typeof model.loanAccount.loanCentre == "undefined" || model.loanAccount.loanCentre == null){
                    model.loanAccount.loanCentre = {};
                }
                else{
                    if(!initFlag)
                    model.loanAccount.loanCentre = {};
                }
                if(initFlag){
                model.loanAccount.remarksHistory = null;
                if (typeof model.loanAccount.customerId != "undefined") {
                    $q.when(Enrollment.get({
                        'id': model.loanAccount.customerId
                    })).then(function (resp) {
                        model.customer = resp;
                    })
                }

                if (model.loanAccount && model.loanAccount.id) {
                    PageHelper.showLoader();
                    IndividualLoan.loanRemarksSummary({
                        id: model.loanAccount.id
                    }).$promise.then(function (resp) {
                        model.loanAccount.remarksHistory = resp;

                        console.log("resposne for CheckerHistory");
                        console.log(model);
                    }).finally(PageHelper.hideLoader);

                }
                BundleManager.broadcastEvent('loan-account-loaded', {
                    loanAccount: model.loanAccount
                });
            }

                /* Deviations and Mitigations grouping */
                if (_.hasIn(model.loanAccount, 'loanMitigants') && _.isArray(model.loanAccount.loanMitigants)) {
                    var loanMitigantsGrouped = {};
                    for (var i = 0; i < model.loanAccount.loanMitigants.length; i++) {
                        var item = model.loanAccount.loanMitigants[i];
                        if (!_.hasIn(loanMitigantsGrouped, item.parameter)) {
                            loanMitigantsGrouped[item.parameter] = [];
                        }
                        loanMitigantsGrouped[item.parameter].push(item);
                    }
                    model.loanMitigantsByParameter = [];
                    _.forOwn(loanMitigantsGrouped, function (mitigants, key) {
                        var chosenMitigants = "<ul>";

                        for (var i = 0; i < mitigants.length; i++) {
                            chosenMitigants = chosenMitigants + "<li>" + mitigants[i].mitigant + "</li>";
                        }
                        chosenMitigants = chosenMitigants + "</ul>";
                        model.loanMitigantsByParameter.push({
                            'Parameter': key,
                            'Mitigants': chosenMitigants
                        })
                    })
                }
                /* End of Deviations and Mitigations grouping */
                if (typeof model.loanAccount.loanApplicationDate == "undefined" || model.loanAccount.loanApplicationDate == "" || model.loanAccount.loanApplicationDate == null) {
                    model.loanAccount.loanApplicationDate = SessionStore.getCBSDate()
                }
                if (typeof model.loanAccount.sanctionDate == "undefined" || model.loanAccount.sanctionDate == "" || model.loanAccount.sanctionDate == null) {
                    model.loanAccount.sanctionDate = SessionStore.getCBSDate()
                }
                if (typeof model.loanAccount.numberOfDisbursements == "undefined" || model.loanAccount.numberOfDisbursements == "" || model.loanAccount.numberOfDisbursements == null) {
                    model.loanAccount.numberOfDisbursements = 1;
                    model.loanAccount.disbursementSchedules = [];
                    model.loanAccount.disbursementSchedules.push({
                        trancheNumber  : 1
                    })
                    if(model.loanAccount.loanAmount){
                        model.loanAccount.disbursementSchedules[0].disbursementAmount = model.loanAccount.loanAmount;
                    }
                }
                else{
                    if(!initFlag){
                        model.loanAccount.numberOfDisbursements = 1;
                        model.loanAccount.disbursementSchedules = [];
                        model.loanAccount.disbursementSchedules.push({
                        trancheNumber  : 1
                    })
                    }
                }
                // TODO Hard Coded value have to fix this
                model.loanAccount.securityEmiRequired = "No";
                if(!(model.loanAccount.partnerCode)){
                    var partnerList = formHelper.enum('loan_partner').data
                    for (i=0;i<partnerList.length;i++){
                        if(partnerList[i].value = "KGFS"){
                            model.loanAccount.partnerCode = "KGFS";
                            break;
                        }
                        continue;
                 }
                };
                if(model.loanAccount.id && initFlag){
                    validateCoGuarantor(0,0,'map',model.loanAccount.loanCustomerRelations,model);
                }
            }

            var calculateTotalValue = function(value, form, model){
                if (_.isNumber(model.loanAccount.collateral[form.arrayIndex].quantity) && _.isNumber(value)){
                    model.loanAccount.collateral[form.arrayIndex].totalValue = model.loanAccount.collateral[form.arrayIndex].quantity * model.loanAccount.collateral[form.arrayIndex].loanToValue;
                }
            }

            // View Functions
            var getIncludes = function (model) {
                return [
                    "LoanDetails",
                    "LoanDetails.centreName",
                    "LoanDetails.productCategory",
                    "LoanDetails.loanType",
                    "LoanDetails.partner",
                    "LoanDetails.frequency",
                    "LoanDetails.loanProductCode",
                    "LoanDetails.loanProductName",
                    "LoanDetails.loanApplicationDate",
                    "LoanDetails.loanAmountRequested",
                    "LoanDetails.requestedTenure",
                    "LoanDetails.interestRate",
                    "LoanDetails.loanPurpose1",
                    "LoanDetails.loanPurpose2",
                    "LoanDetails.borrowers",
                    "LoanDetails.borrowersFatherName",
                    "LoanDetails.borrowersHusbandName",
                    "LoanDetails.borrowersRelationship",
                    "LoanDetails.witnessDetails",
                    "LoanDetails.witnessDetails.witnessFirstName",
                    "LoanDetails.witnessDetails.witnessDOB",
                    "LoanDetails.witnessDetails.witnessRelationship",
                    "LoanDetails.numberOfGuarantorsCoApplicants",
                    "LoanDetails.collectionPaymentType",


                    "NomineeDetails",
                    "NomineeDetails.nominees",
                    "NomineeDetails.nominees.nomineeFirstName",
                    "NomineeDetails.nominees.nomineeGender",
                    "NomineeDetails.nominees.nomineeDOB",
                    "NomineeDetails.nominees.nomineeButton",
                    "NomineeDetails.nominees.nomineeAddressSameasBorrower",
                    "NomineeDetails.nominees.nomineeDoorNo",
                    "NomineeDetails.nominees.nomineeLocality",
                    "NomineeDetails.nominees.nomineeStreet",
                    "NomineeDetails.nominees.nomineePincode",
                    "NomineeDetails.nominees.nomineeDistrict",
                    "NomineeDetails.nominees.nomineeState",
                    "NomineeDetails.nominees.nomineeRelationship",
                    "NomineeDetails.nominees.nomineeMinor",
                    "NomineeDetails.nominees.nomineeGuardian",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianFirstName",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianGender",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianDOB",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianAddressSameAsBorrower",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianDoorNo",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianLocality",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianStreet",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianPincode",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianDistrict",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianState",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianRelationship",

                    "UDFFields",
                    "UDFFields.boomBoxReferenceNumber",

                    "JewelDetails",
                    "JewelDetails.jewelPouchNo",
                    "JewelDetails.ornamentDetails",
                    "JewelDetails.ornamentDetails.ornamentDescription",
                    "JewelDetails.ornamentDetails.stonDescription",
                    "JewelDetails.ornamentDetails.jewelDefects",
                    "JewelDetails.ornamentDetails.noOfArticles",
                    "JewelDetails.ornamentDetails.grossWeight",
                    "JewelDetails.ornamentDetails.netWeight",
                    "JewelDetails.ornamentDetails.carat",
                    "JewelDetails.ornamentDetails.rate",
                    "JewelDetails.ornamentDetails.marketValue",

                    "CollateralInformation",
                    "CollateralInformation.collateral",
                    "CollateralInformation.collateral.collateralCategory",
                    "CollateralInformation.collateral.collateralType",
                    "CollateralInformation.collateral.electricityAvailable",
                    "CollateralInformation.collateral.collateralDescription",
                    "CollateralInformation.collateral.manufacturer",
                    "CollateralInformation.collateral.modelNo",
                    "CollateralInformation.collateral.quantity",
                    "CollateralInformation.collateral.udf1",
                    "CollateralInformation.collateral.machineOld",
                    "CollateralInformation.collateral.loanToValue",
                    "CollateralInformation.collateral.collateralValue",
                    "CollateralInformation.collateral.totalValue",

                    "LoanSanction",
                    "LoanSanction.sanctionDate",
                    "LoanSanction.scheduleDisbursementDate",
                    "LoanSanction.firstRepaymentDate",
                    "LoanSanction.customerSignatureDate",
                    "LoanSanction.disbursementSchedules",
                    "LoanSanction.disbursementSchedules.trancheNumber",
                    "LoanSanction.disbursementSchedules.disbursementAmount",
                    "LoanSanction.disbursementSchedules.moratoriumPeriodInDays",

                ]
            };
            var configFile = function (model) {
                return {
                    "loanProcess.loanAccount.currentStage": {
                        "LoanInitiation": {
                            "excludes": [],
                            "overrides": {}
                        },
                        "DSCOverride": {
                            "excludes": [],
                            "overrides": {
                                "LoanDetails": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanSanction":{
                                    "readonly":true,
                                },
                                "NomineeDetails": {
                                    "orderNo": 3,
                                    "readonly": true
                                },
                                "JewelDetails": {
                                    "orderNo": 2,
                                    "readonly": true,
                                    condition: "model.loanAccount.loanType == 'JEWEL'"
                                }
                            }
                        },
                        "DocumentUpload": {
                            "excludes": [],
                            "overrides": {
                                "LoanDetails": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanSanction":{
                                    "readonly":true,
                                },
                                "NomineeDetails": {
                                    "orderNo": 3,
                                    "readonly": true
                                },
                                "JewelDetails": {
                                    "orderNo": 2,
                                    "readonly": true,
                                    condition: "model.loanAccount.loanType == 'JEWEL'"
                                },
                                "UDFFields" : {
                                    "readonly":true,
                                },
                                "CollateralInformation" : {
                                    "readonly":true,
                                }
                            }
                        },
                        "Checker1": {
                            "excludes": [],
                            "overrides": {
                                "LoanDetails": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanSanction":{
                                    "readonly":true,
                                },
                                "NomineeDetails": {
                                    "orderNo": 3,
                                    "readonly": true
                                },
                                "JewelDetails": {
                                    "orderNo": 2,
                                    "readonly": true,
                                    condition: "model.loanAccount.loanType == 'JEWEL'"
                                },
                                "UDFFields" : {
                                    "readonly":true,
                                },
                                "CollateralInformation" : {
                                    "readonly":true,
                                }
                            }
                        },
                        "Checker2": {
                            "excludes": [],
                            "overrides": {
                                "LoanDetails": {
                                    "orderNo": 1,
                                    "readonly": true
                                },
                                "LoanSanction":{
                                    "readonly":true,
                                },
                                "NomineeDetails": {
                                    "orderNo": 3,
                                    "readonly": true
                                },
                                "JewelDetails": {
                                    "orderNo": 2,
                                    "readonly": true,
                                    condition: "model.loanAccount.loanType == 'JEWEL'"
                                },
                                "UDFFields" : {
                                    "readonly":true,
                                },
                                "CollateralInformation" : {
                                    "readonly":true,
                                }
                            }
                        }
                    }
                }
            };
            var overridesFields = function (model) {
                return {
                   
                    "LoanDetails": {
                        "orderNo": 1
                    },
                    "LoanDetails.centreName": {
                        "orderNo": 1,
                        "type": "select",
                        "readonly": true,
                        "enumCode": "centre"
                    },
                    "LoanDetails.loanType": {
                        "orderNo": 2,
                        "required": true,
                        "readonly": true,
                        "enumCode": "booking_loan_type",
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
                    "LoanDetails.partner": {
                        "orderNo": 3,
                        "enumCode": "loan_partner",
                        "onChange": function(valueObj,context,model){
                            clearAll('loanAccount',['frequency','productCode',"loanAmount","tenure","interestRate","loanPurpose1","loanPurpose2","loanPurpose3"],model);
                            model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = null;
                            clearAll('additions',['tenurePlaceHolder','interestPlaceHolder','amountPlaceHolder'],model)
                        },
                    },
                    "LoanDetails.frequency": {
                        "required":true,
                        "enumCode": "loan_product_frequency",
                        "onChange": function(valueObj,context,model){
                            clearAll('loanAccount',['productCode',"loanAmount","tenure","interestRate","loanPurpose1","loanPurpose2","loanPurpose3"],model);
                            model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = null;
                            clearAll('additions',['tenurePlaceHolder','interestPlaceHolder','amountPlaceHolder'],model)
                        }
                    },
                    "LoanDetails.loanProductCode": {
                        "orderNo": 4,
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
                            model.additions.tenurePlaceHolder = valueObj.tenure_from == valueObj.tenure_to ? valueObj.tenure_from : valueObj.tenure_from + '-' + valueObj.tenure_to;
                            model.additions.amountPlaceHolder = valueObj.amount_from == valueObj.amount_to ? valueObj.amount_from : valueObj.amount_from + '-' + valueObj.amount_to;
                            model.additions.interestPlaceHolder = valueObj.min_interest_rate == valueObj.max_interest_rate ? valueObj.min_interest_rate : valueObj.min_interest_rate + '-' + valueObj.max_interest_rate;
                            if(valueObj.tenure_from == valueObj.tenure_to){
                                model.additions.tenurePlaceHolder = valueObj.tenure_from
                            }
                            if(valueObj.amount_from == valueObj.amount_to){
                                model.additions.amountPlaceHolder = valueObj.amount_from;
                            }
                            model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = valueObj.product_name;
                            model.additions.number_of_guarantors = valueObj.number_of_guarantors ? valueObj.number_of_guarantors : 0;
                            model.additions.co_borrower_required = valueObj.co_borrower_required ? 1 : 0;
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
                    "LoanDetails.loanProductName":{
                        "orderNo":4
                    },
                    "LoanDetails.interestRate":{
                        "orderNo":6,
                        required:false,
                        "placeholderExpr": "model.additions.interestPlaceHolder",
                    },
                    "LoanDetails.loanPurpose1": {
                        "orderNo": 6,
                        "type": "lov",
                        "autolov": true,
                        "lovonly":true,
                        "title": "LOAN_PURPOSE_1",
                        bindMap: {},
                        outputMap: {
                            "purpose1": "loanAccount.loanPurpose1"
                        },
                        searchHelper: formHelper,
                        search: function (inputModel, form, model) {
                            if (model.loanAccount.productCode != null && model.siteCode != 'witfin')
                                return Queries.getLoanPurpose1(model.loanAccount.productCode);
                            else
                                return Queries.getAllLoanPurpose1();
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.purpose1
                            ];
                        },
                        onSelect: function (result, model, context) {
                            model.loanAccount.loanPurpose2 = '';
                            model.loanAccount.loanPurpose3 = '';
                        }
                    },
                    "LoanDetails.loanPurpose2": {
                        "orderNo": 7,
                        "title": "LOAN_PURPOSE_2",
                        "type": "lov",
                        "lovonly":true,
                        bindMap: {},
                        outputMap: {
                            "purpose2": "loanAccount.loanPurpose2"
                        },
                        searchHelper: formHelper,
                        search: function (inputModel, form, model) {
                            if (model.loanAccount.productCode != null)
                                return Queries.getLoanPurpose2(model.loanAccount.productCode, model.loanAccount.loanPurpose1);
                            else
                                return Queries.getAllLoanPurpose2(model.loanAccount.loanPurpose1);
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.purpose2
                            ];
                        },
                        onSelect: function (result, model, context) {
                            model.loanAccount.loanPurpose3 = '';
                        }

                    },
                    "LoanDetails.loanPurpose3": {
                        "orderNo": 8,
                        "type": "lov",
                        "lovonly":true,
                        bindMap: {},
                        outputMap: {
                            "loan_purpose": "loanAccount.loanPurpose3"
                        },
                        searchHelper: formHelper,
                        search: function (inputModel, form, model) {
                            if (model.loanAccount.productCode != null)
                                return Queries.getLoanPurpose3(model.loanAccount.loanPurpose1, model.loanAccount.loanPurpose2);
                            else
                                return Queries.getAllLoanPurpose3(model.loanAccount.loanPurpose1);
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.loan_purpose
                            ];
                        }
                    },
                    "LoanDetails.loanAmountRequested": {
                        "orderNo": 5,
                        "placeholderExpr": "model.additions.amountPlaceHolder",
                        onChange: function (value, form, model) {
                            model.loanAccount.disbursementSchedules[0].disbursementAmount = value;
                        }
                    },
                    "LoanDetails.loanApplicationDate": {
                        "orderNo": 9,
                        "readonly": true,
                    },
                    "LoanDetails.requestedTenure": {
                        "orderNo": 6,
                        required: true,
                        "placeholderExpr": "model.additions.tenurePlaceHolder",
                    },
                    "LoanDetials.witnessDetails": {
                        "type": "array",
                        "view": "fixed"
                    },
                    "LoanDetails.witnessDetails.witnessFirstName": {
                        "type": "lov",
                        // "key": "model.LoanAccounts.witnessDetails[].witnessFirstName",
                        searchHelper: formHelper,
                        search: function (inputModel, form, model, context) {
                            var out = [];
                            var applicantCustomer = [];
                            if (typeof model.loanProcess == "undefined" || typeof model.loanProcess.applicantEnrolmentProcess == "undefined" || typeof model.loanProcess.applicantEnrolmentProcess.customer == "undefined") {
                                return out;
                            }
                            applicantCustomer = model.loanProcess.applicantEnrolmentProcess.customer;
                            if (!applicantCustomer) {
                                return out;
                            }

                            for (var i = 0; i < applicantCustomer.familyMembers.length; i++) {
                                if(!(applicantCustomer.urnNo == applicantCustomer.familyMembers[i].enrolledUrnNo)){
                                    out.push({
                                        name: applicantCustomer.familyMembers[i].familyMemberFirstName,
                                        dob: applicantCustomer.familyMembers[i].dateOfBirth,
                                        relationship: applicantCustomer.familyMembers[i].relationShip
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
                        onSelect: function (valueObj, model, context) {
                            //add to the witnees array.
                            model.loanAccount.witnessFirstName = valueObj.name;
                            model.loanAccount.witnessRelationship = valueObj.relationship;
                            model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf3 = valueObj.dob;
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.name
                            ];
                        }
                    },
                    "LoanDetails.witnessDetails.witnessDOB": {
                        "type": "date",
                        "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf3",
                        "readonly":true
                    },
                    "LoanDetails.witnessDetails.witnessRelationship": {
                        "readonly": true,
                        "require": false
                    },
                    "NomineeDetails": {
                        "orderNo": 3
                    },
                    "JewelDetails": {
                        "orderNo": 2,
                        "condition": "model.loanAccount.loanType == 'JEWEL'"
                    },
                    "JewelDetails.ornamentDetails.netWeight":{ 
                        onChange:function(valueObj,context,model){
                            var carat = model.loanAccount.ornamentsAppraisals[context.arrayIndex].qualityInCarats;
                            if(carat){
                                setGoldRate(valueObj,carat,model,context.arrayIndex);
                            }
                        }
                    },
                    "JewelDetails.ornamentDetails.carat":{
                        "type":"select",
                        "titleMap": [{
                                value: 18,
                                name: "18"
                            },
                            {
                                value: 20,
                                name: "20"
                            },
                            {
                                value: 22,
                                name: "22"
                            }
                        ],
                        onChange:function(valueObj,context,model){
                            var netWeight = model.loanAccount.ornamentsAppraisals[context.arrayIndex].netWeightInGrams;
                            if(netWeight){
                                setGoldRate(netWeight,valueObj,model,context.arrayIndex);
                            }
                        }
                    },
                    "JewelDetails.ornamentDetails.rate":{
                        readonly : true
                    },
                    "JewelDetails.ornamentDetails.marketValue":{
                        readonly : true
                    },
                    "NomineeDetails.nominees.nomineeFirstName": {
                        "orderNo": 1,
                        "type": "lov",
                        "title": "NAME",
                        required:true,
                        searchHelper: formHelper,
                        search: function (inputModel, form, model, context) {
                            var out = [];
                            var applicantCustomer = [];
                            if (typeof model.loanProcess == "undefined" || typeof model.loanProcess.applicantEnrolmentProcess == "undefined" || typeof model.loanProcess.applicantEnrolmentProcess.customer == "undefined") {
                                return out;
                            }
                            applicantCustomer = model.loanProcess.applicantEnrolmentProcess.customer;
                            if (!applicantCustomer) {
                                return out;
                            }

                            for (var i = 0; i < applicantCustomer.familyMembers.length; i++) {
                                if(!(applicantCustomer.urnNo == applicantCustomer.familyMembers[i].enrolledUrnNo)){
                                    out.push({
                                        name: applicantCustomer.familyMembers[i].familyMemberFirstName,
                                        dob: applicantCustomer.familyMembers[i].dateOfBirth,
                                        relationship: applicantCustomer.familyMembers[i].relationShip,
                                        gender: applicantCustomer.familyMembers[i].gender
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
                        onSelect: function (valueObj, model, context) {
                            //add to the witnees array.
                            if (_.isUndefined(model.loanAccount.nominees[context.arrayIndex])) {
                                model.loanAccount.nominees[context.arrayIndex] = [];
                            }
                            model.loanAccount.nominees[context.arrayIndex].nomineeFirstName = valueObj.name;
                            model.loanAccount.nominees[context.arrayIndex].nomineeRelationship = valueObj.relationship;
                            model.loanAccount.nominees[context.arrayIndex].nomineeGender = valueObj.gender;
                            model.loanAccount.nominees[context.arrayIndex].nomineeDOB = valueObj.dob
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.name
                            ];
                        }

                    },
                    "NomineeDetails.nominees.nomineeDOB": {
                        "orderNo": 2,
                        required:true,
                    },
                    // "NomineeDetails.nominees.nomineeRelationship": {
                    //     "readonly": true,
                    //     "type": "text",
                    // },
                    "NomineeDetails.nominees.nomineeGender": {
                        "orderNo": 3,
                        //"readonly": true,
                        required:true,
                       // "type": "text"
                    },
                    "NomineeDetails.nominees.nomineePincode": {
                        "orderNo": 6,
                        fieldType: "number",    
                        autolov: true,
                        required:true,
                        inputMap: {
                            "district": {
                                key: "loanAccount.nominees[].nomineeDistrict"
                            },
                            "state": {
                                key: "loanAccount.nominees[].nomineeState"
                            },
                            "pincode": {
                                key: "loanAccount.nominees[].nomineePincode"
                            }
                        },
                        outputMap: {
                            "division": "loanAccount.nominees[arrayIndex].nomineeLocality",
                            "pincode": "loanAccount.nominees[arrayIndex].nomineePincode",
                            "district": "loanAccount.nominees[arrayIndex].nomineeDistrict",
                            "state": "loanAccount.nominees[arrayIndex].nomineeState"
                        },
                        searchHelper: formHelper,
                        // initialize: function(inputModel, form, model, context) {
                        //     inputModel.pincode = model.loanAccount.nominees[context.arrayIndex].nomineePincode;
                        // },
                        search: function (inputModel, form, model, context) {
                            return Queries.searchPincodes(
                                inputModel.pincode || model.loanAccount.nominees[context.arrayIndex].nomineePincode,
                                inputModel.district,
                                inputModel.state
                            );
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.division + ', ' + item.region,
                                item.pincode,
                                item.district + ', ' + item.state
                            ];
                        }
                    },
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianFirstName": {
                        "type": "lov",
                        "title": "NAME",
                        required:true,
                        searchHelper: formHelper,
                        search: function (inputModel, form, model, context) {
                            var out = [];
                            var applicantCustomer = [];
                            if (typeof model.loanProcess == "undefined" || typeof model.loanProcess.applicantEnrolmentProcess == "undefined" || typeof model.loanProcess.applicantEnrolmentProcess.customer == "undefined") {
                                return out;
                            }
                            applicantCustomer = model.loanProcess.applicantEnrolmentProcess.customer;
                            if (!applicantCustomer) {
                                return out;
                            }

                            for (var i = 0; i < applicantCustomer.familyMembers.length; i++) {
                                if(!(applicantCustomer.urnNo == applicantCustomer.familyMembers[i].enrolledUrnNo)){
                                    out.push({
                                        name: applicantCustomer.familyMembers[i].familyMemberFirstName,
                                        dob: applicantCustomer.familyMembers[i].dateOfBirth,
                                        relationship: applicantCustomer.familyMembers[i].relationShip,
                                        gender: applicantCustomer.familyMembers[i].gender
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
                        onSelect: function (valueObj, model, context) {
                            //add to the witnees array.
                            if (_.isUndefined(model.loanAccount.nominees[context.arrayIndex])) {
                                model.loanAccount.nominees[context.arrayIndex] = [];
                            }
                            model.loanAccount.nominees[context.arrayIndex].guardianFirstName = valueObj.name;
                            model.loanAccount.nominees[context.arrayIndex].guardianRelationship = valueObj.relationship;
                            model.loanAccount.nominees[context.arrayIndex].guardianGender = valueObj.gender;
                            model.loanAccount.nominees[context.arrayIndex].guardianDOB = valueObj.dob
                        },

                        getListDisplayItem: function (item, index) {
                            return [
                                item.name
                            ];
                        }
                    },
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianGender": {
                        // "readonly": true,
                        // "type": "text",
                        "enumCode":"gender",
                        required:true
                    },
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianRelationship": {
                        // "readonly": true,
                        // "type": "text",
                        //"enumCode":"relation",
                        "titleMap": [{
                            value: "Relative",
                            name: "Relative"
                            },
                            {
                                value: "Neighbour",
                                name: "Neighbour"
                            },
                        ],
                        required:true
                    },
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianPincode": {
                        autolov: true,
                        required:true,
                        inputMap: {
                            "district": {
                                key: "loanAccount.nominees[].guardianDistrict"
                            },
                            "state": {
                                key: "loanAccount.nominees[].guardianState"
                            },
                            "pincode": {
                                key: "loanAccount.nominees[].guardianPincode"
                            }
                        },
                        searchHelper: formHelper,
                        // initialize: function(inputModel, form, model, context) {
                        //     inputModel.pincode = model.loanAccount.nominees[context.arrayIndex].guardianPincode;
                        // },
                        search: function (inputModel, form, model, context) {
                            return Queries.searchPincodes(
                                inputModel.pincode || model.loanAccount.nominees[context.arrayIndex].guardianPincode,
                                inputModel.district,
                                inputModel.state
                            );
                        },
                        onSelect : function(valueObj,model,context){
                            model.loanAccount.nominees[context.arrayIndex].guardianLocality = valueObj.region, 
                            model.loanAccount.nominees[context.arrayIndex].guardianPincode =  valueObj.pincode.toString(),
                            model.loanAccount.nominees[context.arrayIndex].guardianDistrict = valueObj.district,
                            model.loanAccount.nominees[context.arrayIndex].guardianState = valueObj.state
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.division + ', ' + item.region,
                                item.pincode,
                                item.district + ', ' + item.state
                            ];
                        }
                    },
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianAddressSameAsBorrower": {
                        onChange: function(valueObj,form,model){
                            if(valueObj == true)
                                addressMapCustomertoGuardian(model.customer,model.loanAccount.nominees[0]);
                            else
                                addressMapCustomertoGuardian({},model.loanAccount.nominees[0]);
                        }
                    },
                    "NomineeDetails.nominees.nomineeMinor":{
                        onChange:function(valueObj,form,mode){
                            clearAll("0",["guardianFirstName","guardianGender","guardianDOB","guardianDoorNo","guardianLocality","guardianDistrict","guardianStreet","guardianPincode","guardianState","guardianRelationWithMinor","guardianAddressSameAsCustomer"],model.loanAccount.nominees);
                        }
                    },

                    "LoanSanction":{
                        "condition": "model.loanAccount.id"
                    },
                    "LoanSanction.numberOfDisbursements": {
                        orderNo:1,
                    },
                    "LoanSanction.disbursementSchedules":{
                        orderNo:2,
                    },
                    //"LoanSanction.disbursementSchedules.disbursementAmount",
                    "LoanSanction.disbursementSchedules.trancheNumber":{
                        readonly : true,
                    },
                    "LoanSanction.disbursementSchedules.disbursementAmount":{
                        readonly : true,
                    },
                    "LoanSanction.disbursementSchedules.mordisbursementAmount":{
                    },
                    "LoanSanction.customerSignatureDate": {
                        orderNo :3,
                        required : true,
                        onChange: function (modelValue, form, model) {
                            if (modelValue) {
                                model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate = modelValue;
                            }
                        }
                    },
                    "LoanSanction.firstRepaymentDate": {
                        orderNo : 5,
                        required : true,
                        onChange: function (value, form, model, event) {
                            var repaymentDate = moment(model.loanAccount.firstRepaymentDate, SessionStore.getSystemDateFormat());
                            var applicationDate = moment(model.loanAccount.loanApplicationDate, SessionStore.getSystemDateFormat());
                            if (repaymentDate < applicationDate) {
                                model.loanAccount.firstRepaymentDate = null;
                                PageHelper.showProgress("loan-create", "Repayment date should be greater than Application date", 5000);
                            }
                        }

                    },
                    "LoanSanction.scheduleDisbursementDate": {
                        orderNo : 4,
                        required: true,
                        onChange: function (value, form, model) {
                            var repaymentDate = moment(model.loanAccount.firstRepaymentDate, SessionStore.getSystemDateFormat());
                            var disbursementSchedules = moment(model.loanAccount.disbursementSchedules[form.arrayIndex].scheduledDisbursementDate, SessionStore.getSystemDateFormat());
                            if (repaymentDate < disbursementSchedules) {
                                // model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate = null;
                                PageHelper.showProgress("loan-create", "Disbursement date should be lesser than Repayment date", 5000);
                            }
                        }
                    },
                    "CollateralInformation": {
                        "title":"COLLATERAL",
                        "orderNo":20,
                        "condition": "model.loanAccount.loanType=='SECURED'",
                    },
                     "CollateralInformation.collateral": {
                        "title":"COLLATERAL",
                       // "titleExpr": "('COLLATERAL'| translate) + ': ' + model.loanAccount.collateral[arrayIndex].collateralCategory + ' - ' + model.loanAccount.collateral[arrayIndex].collateralType",
                        onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
                            model.loanAccount.collateral[model.loanAccount.collateral.length-1].quantity = 1;
                        }
                    },
                    "CollateralInformation.collateral.collateralType" : {
                        "type":"select",
                        "title":"Collateral Sub Type",
                        "enumCode":"hypothication_sub_type",
                        "parentEnumCode":"hypothecation_type",
                        "orderNo": 150,
                        "parentValueExpr":"model.loanAccount.collateral[arrayIndex].collateralCategory"
                    },
                    "CollateralInformation.collateral.electricityAvailable" : {
                        "condition": "model.pageConfig.CollateralUDFs.electricityAvailable",
                        "title":"SEGMENT",
                        "orderNo": 200,
                    },
                    "CollateralInformation.collateral.collateralDescription" : {
                        "orderNo": 155,
                        "title":"Collateral Description"
                    },
                    "CollateralInformation.collateral.collateralValue" : {
                        "type":"amount",
                        "orderNo": 185,
                        "title":"PURCHASE_PRICE"
                    },
                    "CollateralInformation.collateral.manufacturer" : {
                        "orderNo": 160,
                        "title":"Manufacturer"
                    },
                    "CollateralInformation.collateral.modelNo" : {
                        "orderNo": 170,
                        "title":"Model Number"
                    },
                }
            };
            var self;

            return {
                "type": "schema-form",
                "title": "LOAN_REQUEST",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    model.customer = {};
                    model.loanAccount = model.loanProcess.loanAccount;
                    defaultConfiguration(model,true);
                    if(model.loanAccount.loanType == 'JEWEL' && model.loanAccount.currentStage == 'LoanInitiation'){
                        getGoldRate(model);
                    }
                    
                    self = this;
                    model.loanAccount.disbursementSchedules[0].moratoriumPeriodInDays = 0;
                   // "LoanSanction.disbursementSchedules.moratoriumPeriodInDays",

                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;
                    p1.then(function (repo) {
                        var formRequest = {
                                "overrides": overridesFields(model),
                                "includes": getIncludes(model),
                                "excludes": [],
                                "options": {
                                    "repositoryAdditions": {
                                        "UDFFields":{
                                            "type":"box",
                                            "title":"UDF Fields",
                                            "orderNo":"10",
                                            "items":{
                                                "boomBoxReferenceNumber":{
                                                    "title":"BOOM_BOX_REFERENCE_NUMBER",
                                                    "type":"string",
                                                    "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf10"

                                                }
                                            }
                                        },
                                        "LoanDetails": {
                                            "orderNo": 7,
                                            "items": {
                                                "productCategory":{
                                                    "key":"loanAccount.productCategory",
                                                    "title": "PRODUCT_CATEGORY",
                                                    "type": "text",
                                                    "readonly":true,
                                                    "orderNo": 2
                                                },
                                                "loanProductName":{
                                                    "title": "PRODUCT_NAME",
                                                    "readonly": true,
                                                    "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6"
                                            
                                                },
                                                "borrowers": {
                                                    "title": "BORROWERS",
                                                    "type": "radios",
                                                    "orderNo": 8,
                                                    "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4",
                                                    "titleMap": [{
                                                            value: "Father",
                                                            name: "Father"
                                                        },
                                                        {
                                                            value: "Husband",
                                                            name: "Husband"
                                                        }
                                                    ],
                                                    onChange: function (valueObj, form, model) {
                                                        if (typeof model.customer.familyMembers != "undefined") {
                                                            if (model.customer.familyMembers.length > 0) {
                                                                for (i = 0; i < model.customer.familyMembers.length; i++) {
                                                                    if (model.customer.familyMembers[i].relationShip == valueObj) {
                                                                        model.loanAccount.husbandOrFatherFirstName = model.customer.familyMembers[i].familyMemberFirstName;
                                                                    } else {
                                                                        model.loanAccount.husbandOrFatherFirstName = null;
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                "borrowersHusbandName": {
                                                    "orderNo": 8,
                                                    "title": "HUSBAND_NAME",
                                                    "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4 == 'Husband'",
                                                    "type": "text",
                                                    "key": "loanAccount.husbandOrFatherFirstName",
                                                },
                                                "borrowersFatherName": {
                                                    "orderNo": 8,
                                                    "title": "FATHER_NAME",
                                                    "condition": "model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4 == 'Father'",
                                                    "type": "text",
                                                    "key": "loanAccount.husbandOrFatherFirstName"
                                                },
                                                "borrowersRealtionship": {
                                                    "title": "RELATIONSHIP",

                                                    "type": "text",
                                                    "readonly": true,
                                                    "key": "yet to decide",
                                                },
                                                "numberOfGuarantorsCoApplicants":{
                                                    "title":"REQUIRED",
                                                    orderNo:4,
                                                    "type":"html",
                                                    "condition":"model.loanAccount.productCode",
                                                    "key":"additions.noOfGuarantorCoApplicantHtml"
                                                },
                                                "processingFeePercentage" : {
                                                    "key" : "loanAccount.processingFeePercentage",
                                                    "orderNo":10,
                                                    "readonly": true
                                                },
                                                "collectionPaymentType":{
                                                    "key": "loanAccount.collectionPaymentType",
                                                    "title": "Mode Of Repayment",
                                                    "type": "select",
                                                    titleMap:{
                                                        "ACH":"ACH",
                                                        "PDC":"PDC",
                                                        "CASH":"CASH"
                                                    },
                                                    "orderNo": 120
                                                }

                                            }
                                        },
                                        "LoanSanction": {
                                            "key": "loanAccount.disbursementSchedules",
                                            "items": {
                                                "scheduleDisbursementDate": {
                                                    "key": "loanAccount.disbursementSchedules[0].scheduledDisbursementDate",
                                                    "title": "SCHEDULE_DISBURSMENT_DATE",
                                                    "type": "date"
                                                },
                                                "firstRepaymentDate": {
                                                    "key": "loanAccount.firstRepaymentDate",
                                                    "type": "date",
                                                    "title": "FIRST_REPAYMENT_DATE"
                                                },
                                                "customerSignatureDate": {
                                                    "key": "loanAccount.disbursementSchedules[0].customerSignatureDate",
                                                    "type": "date",
                                                    "title": "CUSTOMER_SIGNATURE_DATE"
                                                },
                                                "disbursementSchedules": {
                                                    "key": "loanAccount.disbursementSchedules",
                                                    "title": "DISBURSEMENT_SCHEDULES",
                                                    "add": null,
                                                    "remove": null,
                                                    "items": {
                                                    "moratoriumPeriodInDays":{
                                                        "key": "loanAccount.disbursementSchedules[0].moratoriumPeriodInDays",
                                                        "title": "MORATORIUM_PERIOD",
                                                        "type": "string"
                                                    }}
                                                }
                                            }
                                        },
                                        "NomineeDetails": {
                                            "items": {
                                                "nominees": {
                                                    "items": {
                                                        "nomineeAddressSameasBorrower": {
                                                            "key": "loanAccount.nominees[].nomineeAddressSameAsCustomer",                        
                                                            "type": "checkbox",
                                                            "title": "ADDRESS_SAME_AS_BORROWER",
                                                            "schema": {
                                                                "type": ["boolean", "null"]
                                                            },
                                                            onChange: function(valueObj,form,model){
                                                                if (valueObj == true)
                                                                    addressMapCustomertoNominee(model.customer,model.loanAccount.nominees[0]);
                                                                else
                                                                    addressMapCustomertoNominee({},model.loanAccount.nominees[0]);
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        
                                        "CollateralInformation" : {
                                            "items":
                                            {
                                                "collateral" : {
                                                "items":{
                                                        "collateralCategory" : {
                                                            "key":"loanAccount.collateral[].collateralCategory",
                                                            "type":"select",
                                                             "orderNo": 145,
                                                            "enumCode":"hypothecation_type",
                                                            "title":"Collateral Type",
                                                            "required":true
                                                        },
                                                        "quantity" : {
                                                            "key":"loanAccount.collateral[].quantity",
                                                            "orderNo": 165,
                                                            "onChange": function(value ,form ,model, event){
                                                                calculateTotalValue(value, form, model);
                                                            }
                                                        },
                                                        "udf1" : {
                                                            "key":"loanAccount.collateral[].udf1",
                                                            "orderNo": 195,
                                                            "condition": "model.pageConfig.CollateralUDFs.udf1",
                                                            "type": "string",
                                                            "title": "YEAR_OF_MANUFACTURE"
                                                        },
                                                        "machineOld" : {
                                                            "key":"loanAccount.collateral[].machineOld",
                                                            "orderNo": 175,
                                                            "type":"checkbox",
                                                            "title":"IS_MACHINE_OLD"
                                                        },
                                                        "loanToValue" : {
                                                            "key":"loanAccount.collateral[].loanToValue",
                                                            "type":"amount",
                                                            "orderNo": 180,
                                                            "title":"PRESENT_VALUE",
                                                            "onChange": function(value ,form ,model, event){
                                                                calculateTotalValue(value, form, model);
                                                            }
                                                        },
                                                       
                                                        "totalValue" : {
                                                            "key":"loanAccount.collateral[].totalValue",
                                                            "type":"amount",
                                                            "orderNo": 190,
                                                            "title":"TOTAL_VALUE",
                                                            "readonly":true
                                                        },
                                                    }
                                                }
                                            }
                                            
                                        }
                                      
                                        
                                    },
                                    "additions": [
                                        // Remarks History
                                        {
                                            "title": "REMARKS_HISTORY",
                                            "type": "box",
                                            "orderNo": 10,
                                            condition: "model.loanAccount.remarksHistory && model.loanAccount.remarksHistory.length > 0 && (model.loanAccount.currentStage == 'Checker1' || model.loanAccount.currentStage == 'Checker2')",
                                            "items": [{
                                                "key": "loanAccount.remarksHistory",
                                                "type": "array",
                                                "view": "fixed",
                                                add: null,
                                                remove: null,
                                                "items": [{
                                                    "type": "section",
                                                    "htmlClass": "",
                                                    "html": '<i class="fa fa-user text-gray">&nbsp;</i> {{model.loanAccount.remarksHistory[arrayIndex].userId}}\
                                                    <br><i class="fa fa-clock-o text-gray">&nbsp;</i> {{model.loanAccount.remarksHistory[arrayIndex].createdDate}}\
                                                    <br><i class="fa fa-commenting text-gray">&nbsp;</i> <strong>{{model.loanAccount.remarksHistory[arrayIndex].remarks}}</strong>\
                                                    <br><i class="fa fa-pencil-square-o text-gray">&nbsp;</i>{{model.loanAccount.remarksHistory[arrayIndex].stage}}-{{model.loanAccount.remarksHistory[arrayIndex].action}}<br>'
                                                }]
                                            }]
                                        },
                                        // Post review
                                        {
                                            "type": "box",
                                            "title": "POST_REVIEW",
                                            condition: "model.loanAccount.currentStage != 'DocumentUpload' && model.loanAccount.id && model.loanAccount.currentStage != 'Checker1' && model.loanAccount.currentStage != 'Checker2'",
                                            "items": [{
                                                    key: "review.action",
                                                    condition: "model.currentStage == 'PendingForPartner' && model.loanHoldRequired!='NO'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "SEND_BACK": "SEND_BACK",
                                                        "PROCEED": "PROCEED",
                                                        "HOLD": "HOLD"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.currentStage == 'LoanInitiation' && model.loanHoldRequired!='NO'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "PROCEED": "PROCEED",
                                                        "HOLD": "HOLD"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.currentStage == 'PendingForPartner' && model.siteCode=='YES'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "SEND_BACK": "SEND_BACK",
                                                        "PROCEED": "PROCEED"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.currentStage == 'LoanInitiation'&& model.siteCode=='YES'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "PROCEED": "PROCEED"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.loanAccount.currentStage == 'LoanInitiation'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "PROCEED": "PROCEED"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.loanAccount.currentStage != 'DocumentUplaod' && model.loanAccount.currentStage !='LoanInitiation'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "PROCEED": "PROCEED",
                                                        "SEND_BACK": "SEND_BACK",
                                                    }
                                                },
                                                {
                                                    type: "section",
                                                    condition: "model.review.action=='REJECT'",
                                                    items: [{
                                                            title: "REMARKS",
                                                            key: "review.remarks",
                                                            type: "textarea",
                                                            required: true
                                                        },
                                                        {
                                                            key: "loanAccount.rejectReason",
                                                            type: "lov",
                                                            autolov: true,
                                                            title: "REJECT_REASON",
                                                            bindMap: {},
                                                            searchHelper: formHelper,
                                                            search: function (inputModel, form, model, context) {
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
                                                            onSelect: function (valueObj, model, context) {
                                                                model.loanAccount.rejectReason = valueObj.name;
                                                            },
                                                            getListDisplayItem: function (item, index) {
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
                                                },
                                                {
                                                    type: "section",
                                                    condition: "model.review.action=='HOLD'",
                                                    items: [{
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
                                                    items: [{
                                                            title: "REMARKS",
                                                            key: "review.remarks",
                                                            type: "textarea",
                                                            required: true
                                                        },
                                                        {
                                                            key: "review.targetStage",
                                                            required: true,
                                                            type: "lov",
                                                            autolov: true,
                                                            lovonly: true,
                                                            title: "SEND_BACK_TO_STAGE",
                                                            bindMap: {},
                                                            searchHelper: formHelper,
                                                            search: function (inputModel, form, model, context) {
                                                                var stage1 = model.loanAccount.currentStage;
                                                                var booking_target_stage = formHelper.enum('booking_target_stage').data;
                                                                var out = [];
                                                                for (var i = 0; i < booking_target_stage.length; i++) {
                                                                    var t = booking_target_stage[i];
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
                                                            onSelect: function (valueObj, model, context) {
                                                                model.review.targetStage = valueObj.name;
                                                                model.loanProcess.stage = valueObj.value;
                                                            },
                                                            getListDisplayItem: function (item, index) {
                                                                return [
                                                                    item.name
                                                                ];
                                                            }
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
                                                    items: [{
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
                                        },
                                        // Save button
                                        {
                                            "type": "actionbox",
                                            condition: "model.loanAccount.currentStage == 'LoanInitiation'",
                                            "items": [{
                                                "type": "submit",
                                                "title": "SAVE"
                                            }, ]
                                        }
                                    ]
                                }
                            };
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model);
                        })
                        .then(function (form) {
                            self.form = form;
                        });
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                    return [
                        item.customer.firstName,
                        item.customer.centreCode,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "new-applicant": function (bundleModel, model, obj) {
                        model.customer = obj.customer;
                        clearAll('loanAccount',['loanType','partner','frequency','productCode',"loanAmount","tenure","interestRate","loanPurpose1","loanPurpose2","loanPurpose3","witnessFirstName","witnessRelationship","firstRepaymentDate"],model);
                        clearAll('additions',['tenurePlaceHolder','interestPlaceHolder','amountPlaceHolder'],model);
                        model.loanAccount.customerId = model.customer.id;
                        model.loanAccount.urnNo = model.customer.urnNo;
                        defaultConfiguration(model,false);
                        model.loanAccount.loanCentre.centreId = obj.customer.centreId;
                    },
                    "dsc-response": function(bundleModel,model,obj){
                        model.loanAccount.loanCustomerRelations = obj;
                    },
                    "lead-loaded": function (bundleModel, model, obj) {
                        model.lead = obj;
                        model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                        model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                        model.loanAccount.screeningDate = obj.screeningDate;
                    },
                    "new-business": function (bundleModel, model, params) {
                        $log.info("Inside new-business of LoanRequest");
                        model.loanAccount.customerId = params.customer.id;
                        model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                        model.loanAccount.loanCentre.branchId = params.customer.customerBranchId;
                        model.loanAccount.loanCentre.centreId = params.customer.centreId;
                        model.enterprise = params.customer;
                    },
                    "load-deviation": function (bundleModel, model, params) {
                        $log.info("Inside Deviation List");
                        model.deviations = {};
                        model.deviations.deviationParameter = [];
                        model.deviations.deviationParameter = params.deviations.deviationParameter;
                        model.deviations.scoreName = params.deviations.scoreName;

                        if (_.isArray(model.deviations.deviationParameter)) {
                            _.forEach(model.deviations.deviationParameter, function (deviation) {
                                if (_.hasIn(deviation, 'ChosenMitigants') && _.isArray(deviation.ChosenMitigants)) {
                                    _.forEach(deviation.ChosenMitigants, function (mitigantChosen) {
                                        for (var i = 0; i < deviation.mitigants.length; i++) {
                                            if (deviation.mitigants[i].mitigantName == mitigantChosen) {
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
                schema: function () {
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {
                    submit: function (model, formCtrl, form) {
                        /* Loan SAVE */
                        if (typeof model.loanAccount.loanAmount != "undefined") {
                            model.loanAccount.loanAmountRequested = model.loanAccount.loanAmount;
                        }
                        if (typeof model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4 != "undefined") {
                            if (typeof model.loanAccount.husbandOrFatherFirstName == "undefined" || model.loanAccount.husbandOrFatherFirstName == null) {
                                model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4 = null;
                            }
                        }
                        if (!model.loanAccount.id) {
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";
                        }
                        if(!(validateCoGuarantor(model.additions.co_borrower_required,model.additions.number_of_guarantors,'validate',model.loanAccount.loanCustomerRelations,model)))
                            return false;
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        if(!savePolicies(model)){
                            PageHelper.showProgress('loan-process','Oops Some Error',2000);
                            return false;}
                        if(!(policyBasedOnLoanType(model.loanAccount.loanType,model))){
                            PageHelper.showProgress('loan-process','Oops Some Error',2000);
                            return false;}
                        model.loanProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                BundleManager.pushEvent('new-loan', model._bundlePageObj, {
                                    loanAccount: model.loanAccount
                                });
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);

                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.hideLoader();
                            });

                    },
                    holdButton: function (model, formCtrl, form, $event) {
                        $log.info("Inside save()");
                        if (!model.loanAccount.id) {
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
                    sendBack: function (model, formCtrl, form, $event) {
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
                    proceed: function (model, formCtrl, form, $event) {
                        if (_.hasIn(model, 'review.targetStage'))
                        {
                            model.review.targetStage='';
                            model.loanProcess.stage='';
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');
					    if(!formCtrl.$valid){
                            PageHelper.showProgress('form-error', 'Your form have errors. Please fix them.',5000);
                            return
                        }
                        PageHelper.showProgress('enrolment', 'Updating Loan');
                        if (model.loanAccount.id){
                            model.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                            model.loanAccount.portfolioInsuranceUrn = model.loanAccount.loanCustomerRelations[0].urn;
                        }
                        
                        if(!(policyBasedOnLoanType(model.loanAccount.loanType,model)))
                            return false;

                        var toStage=model.loanProcess.stage||null;
                        model.loanProcess.proceed(toStage)
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
                    reject: function (model, formCtrl, form, $event) {
                        if (PageHelper.isFormInvalid(formCtrl)) {
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
                }
            };

        }
    }
});
