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
            var bankName = SessionStore.getBankName();
            var podiValue = SessionStore.getGlobalSetting("percentOfDisposableIncome");
            var bankNameKarnataka = SessionStore.getGlobalSetting("bankNameKarnataka");
            var bankNameKeonjar = SessionStore.getGlobalSetting("bankNameKeonjar");
            var loanAmountRequestedLoanLimit = SessionStore.getGlobalSetting("loanAmountRequestedLoanLimit");
            
            
            //PMT calculation
            var setDeviation = function(model){
                if(model.loanAccount.loanMitigants){
                    _.forEach(model.loanAccount.loanMitigants,function(mitigation){
                        if(!(mitigation.currentMitigation)){
                            mitigation.currentMitigation = true
                        }
                    })
                }
            }

            // var setDeviation = function(model){
            //           /* Deviations and Mitigations grouping */
            //             // var checkMitigants = true;
            //             // if(_.isArray(model.loanAccount.loanMitigants) && model.loanAccount.loanMitigants)
            //             // {
            //             //     if(_.hasIn(model.deviationMitigants[0], 'id'))
            //             //         checkMitigants=false;                            
            //             // }
            //             if (model.deviationMitigants && model.loanAccount.loanMitigants && _.isArray(model.loanAccount.loanMitigants)){
            //                 for (var i=0; i<model.deviationMitigants.length; i++){
            //                     model.loanAccount.loanMitigants.push(model.deviationMitigants[i]);
            //                 }
            //             }
            //             else
            //             {
            //                 if(_.isNull(model.loanAccount.loanMitigants))
            //                 model.loanAccount.loanMitigants=[];
            //                 if (model.deviationMitigants){
            //                     for (var i=0; i<model.deviationMitigants.length; i++){
            //                         model.loanAccount.loanMitigants.push(model.deviationMitigants[i]);
            //                     }                            
            //                 }
            //             }
            //         /* End of Deviations and Mitigations grouping */
            // }
            var setLoanMitigantsGroup = function(model) {
                if (_.hasIn(model.loanAccount, 'loanMitigants') && _.isArray(model.loanAccount.loanMitigants)){
                    var loanMitigantsGrouped = {};
                    for (var i=0; i<model.loanAccount.loanMitigants.length; i++){
                        var item = model.loanAccount.loanMitigants[i];
                        if (item.currentMitigation && !_.hasIn(loanMitigantsGrouped, item.parameter)){
                            loanMitigantsGrouped[item.parameter] = [];
                            loanMitigantsGrouped[item.parameter].push(item);
                        }
                    }
                    model.loanMitigantsGrouped=loanMitigantsGrouped;
                    model.deviationMitigants  = model.loanAccount.loanMitigants;
                    model.loanAccount.loanMitigants = [];                        

                }
            }
            var getGoldRate = function(model){
                var value = Queries.getGoldRate();
                value.then(function(resp){
                    if(model.additions) {
                        model.additions.goldRate = resp;
                        model.additions.goldRatePerCarat = resp/22;
                    }
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
            var nomineeDetails = function(customerId,valueObj, model, context){
                Queries.getCustomerInfo(customerId).then(function(res){
                    model.loanAccount.nominees[context.arrayIndex].nomineePincode = res[0].pincode;
                    model.loanAccount.nominees[context.arrayIndex].nomineeDistrict = res[0].district;
                    model.loanAccount.nominees[context.arrayIndex].nomineeState = res[0].state;
                    model.loanAccount.nominees[context.arrayIndex].nomineeLocality = res[0].locality;
                }
                ,function(res){
                    
                })
            };

            var validateDeviation=[];            
            var validateDeviationForm = function(model){
                validateDeviation=[];
                if (_.hasIn(model, 'loanAccount.loanMitigants') && _.isArray(model.loanAccount.loanMitigants) && model.loanAccount.loanMitigants !=null) {
                    _.forEach(model.loanAccount.loanMitigants, function(mitigantStatus,item){
                        if(mitigantStatus.mitigatedStatus || (!_.hasIn(mitigantStatus, 'id')))
                            delete  validateDeviation[item];
                        else
                            validateDeviation[item]=mitigantStatus.mitigatedStatus;
                    })
                }
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
                
                model.loanAccount.cbCheckCompletedFlag=true;
                if(model.loanAccount.commercialCibilCharge)
                    if(!_.isNaN(model.loanAccount.commercialCibilCharge))
                        fee+=model.loanAccount.commercialCibilCharge;
                $log.info(model.loanAccount.commercialCibilCharge);
                
                // Get the user's input from the form. Assume it is all valid.
                // Convert interest from a percentage to a decimal, and convert from
                // an annual rate to a monthly rate. Convert payment period in years
                // to the number of monthly payments.

                if(model.loanAccount.loanAmountRequested == '' || model.loanAccount.expectedInterestRate == '' || model.loanAccount.frequency == '' || model.loanAccount.tenureRequested == '')
                    return;

                var principal = model.loanAccount.loanAmountRequested;
                var interest = model.loanAccount.expectedInterestRate / 100 / 12;
                var payments;
                if (model.loanAccount.frequency == 'Y')
                    payments = model.loanAccount.tenureRequested * 12;
                else if (model.loanAccount.frequency == 'M')
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
                model.loanAccount.cbCheckCompletedFlag=true;
                // Get the user's input from the form. Assume it is all valid.
                // Convert interest from a percentage to a decimal, and convert from
                // an annual rate to a monthly rate. Convert payment period in years
                // to the number of monthly payments.
                if(model.loanAccount.loanAmount == '' || model.loanAccount.interestRate == '' || model.loanAccount.frequency == '' || model.loanAccount.tenure == '')
                    return;
                var principal = model.loanAccount.loanAmount;
                var interest = model.loanAccount.interestRate / 100 / 12;
                var payments;
                if (model.loanAccount.frequency == 'Y')
                    payments = model.loanAccount.tenure * 12;
                else if (model.loanAccount.frequency == 'M')
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
            

            var policyBasedOnLoanType = function(loanType,model){
                var totalMarketValueInPaisa = 0;
                if (loanType == "JEWEL"){

                    for (var i = model.loanAccount.ornamentsAppraisals.length - 1; i >= 0; i--) {
                        totalMarketValueInPaisa +=(model.loanAccount.ornamentsAppraisals[i].marketValueInPaisa || 0);
                    }

                    if(model.loanAccount.loanAmountRequested >= ((totalMarketValueInPaisa/100))*75){
                        var errMsg = 'Loan amount should be less then ' + parseFloat((totalMarketValueInPaisa/100)*75).toFixed(2);
                        PageHelper.showErrors({data:{error:errMsg}});
                        return false;
                    }
                    if(model.loanAccount.loanAmount >= ((totalMarketValueInPaisa/100))*75){
                        var errMsg = 'RecommendedLoan amount should be less then ' + parseFloat((totalMarketValueInPaisa/100)*75).toFixed(2);
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
               
                if (typeof model.loanAccount.accountUserDefinedFields == "undefined") {
                    model.loanAccount.accountUserDefinedFields = {};
                    model.loanAccount.accountUserDefinedFields.userDefinedFieldValues = {};
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
                         if(model.loanAccount.remarksHistory && model.loanAccount.remarksHistory.length)
                            {
                                for(i=0;i<model.loanAccount.remarksHistory.length;i++)
                                {
                                    if(model.loanAccount.remarksHistory[i].postStage=="Rejected" &&
                                        model.loanAccount.remarksHistory[i].preStage != "Rejected")
                                    {
                                        if(model.loanAccount.currentStage=='Rejected')
                                        {
                                            model.review.preStage = model.loanAccount.remarksHistory[i].preStage;
                                            model.review.targetStage = model.loanAccount.remarksHistory[i].preStage;
                                            //model.loanProcess.stage = model.loanAccount.remarksHistory[i].preStage;
                                        }
                                    }
                                }
                            }

                        console.log("resposne for CheckerHistory");
                        console.log(model);
                    }).finally(PageHelper.hideLoader);

                }
                BundleManager.broadcastEvent('loan-account-loaded', {
                    loanAccount: model.loanAccount
                });
                }

                if(model.loanAccount.id && initFlag){
                    validateCoGuarantor(0,0,'map',model.loanAccount.loanCustomerRelations,model);
                }
            }

             var mapNomineeAddress = function(model){
                /** Here guardianTitle column is used as flag to capture AddressSameasBorrower due to no other column exists in nominee_details table*/
                if (model.loanAccount.nominees[0].isnomineeAddressSameasBorrower)
                    model.loanAccount.nominees[0].guardianTitle = "YES";
                else
                    model.loanAccount.nominees[0].guardianTitle = "NO";     
                }  

           
                function round(x) {
                  return Math.ceil(x);
                }

            var configFile = function() {
                return{
                    "loanProcess.loanAccount.currentStage":{
                        "KYCCheck":{
                            "overrides":{
                                "PreliminaryInformation":{
                                    "readonly":true
                                },
                                "CollateralInformation":{
                                    "readonly":true
                                },
                                "LoanDocuments":{
                                    "readonly":true
                                },
                                "LoanRecommendation":{
                                    "readonly":true
                                },
                                "LoanMitigants":{
                                    "readonly":true
                                },
                                "JewelDetails":{
                                    "readonly":true
                                },
                                "NomineeDetails":{
                                    "readonly":true
                                }
                            }

                        },
                        "Rejected":{
                            "overrides":{
                                "PreliminaryInformation":{
                                    "readonly":true
                                },
                                "CollateralInformation":{
                                    "readonly":true
                                },
                                "LoanDocuments":{
                                    "readonly":true
                                },
                                "LoanRecommendation":{
                                    "readonly":true
                                },
                                "LoanMitigants":{
                                    "readonly":true
                                },
                                "JewelDetails":{
                                    "readonly":true
                                },
                                "NomineeDetails":{
                                    "readonly":true
                                }
                            }

                        },
                        "DSCApproval":{
                            "overrides":{
                                "PreliminaryInformation":{
                                    "readonly":true
                                },
                                "CollateralInformation":{
                                    "readonly":true
                                },
                                "LoanDocuments":{
                                    "readonly":true
                                },
                                "LoanRecommendation":{
                                    "readonly":true
                                },
                                "LoanMitigants":{
                                    "readonly":true
                                },
                                "JewelDetails":{
                                    "readonly":true
                                },
                                "NomineeDetails":{
                                    "readonly":true
                                }
                            }

                        },
                        "DSCOverride":{
                            "overrides":{
                                "PreliminaryInformation":{
                                    "readonly":true
                                },
                                "CollateralInformation":{
                                    "readonly":true
                                },
                                "LoanDocuments":{
                                    "readonly":true
                                },
                                "LoanRecommendation":{
                                    "readonly":true
                                },
                                "LoanMitigants":{
                                    "readonly":true
                                },
                                "JewelDetails":{
                                    "readonly":true
                                },
                                "NomineeDetails":{
                                    "readonly":true
                                }
                            }

                        },
                        "BusinessTeamReview":{
                            "overrides":{
                                "PreliminaryInformation":{
                                    "readonly":true
                                },
                                "CollateralInformation":{
                                    "readonly":true
                                },
                                "LoanDocuments":{
                                    "readonly":true
                                },
                                "LoanRecommendation":{
                                    "readonly":true
                                },
                                "LoanMitigants":{
                                    "readonly":true
                                },
                                "JewelDetails":{
                                    "readonly":true
                                },
                                "NomineeDetails":{
                                    "readonly":true
                                }
                            }

                        },
                        "CreditOfficerReview":{
                            "overrides":{
                                "PreliminaryInformation":{
                                    "readonly":true
                                },
                                "CollateralInformation":{
                                    "readonly":true
                                },
                                "LoanDocuments":{
                                    "readonly":true
                                },
                                "LoanRecommendation":{
                                    "readonly":true
                                },
                                "LoanMitigants":{
                                    "readonly":true
                                },
                                "JewelDetails":{
                                    "readonly":true
                                },
                                "NomineeDetails":{
                                    "readonly":true
                                }
                            }

                        },
                        "CreditManagerReview":{
                            "overrides":{
                                "PreliminaryInformation":{
                                    "readonly":true
                                },
                                "CollateralInformation":{
                                    "readonly":true
                                },
                                "LoanDocuments":{
                                    "readonly":true
                                },
                                "LoanRecommendation":{
                                    "readonly":true
                                },
                                "LoanMitigants":{
                                    "readonly":true
                                },
                                "JewelDetails":{
                                    "readonly":true
                                },
                                "NomineeDetails":{
                                    "readonly":true
                                }
                            }

                        },
                        "CBOCreditHeadReview":{
                            "overrides":{
                                "PreliminaryInformation":{
                                    "readonly":true
                                },
                                "CollateralInformation":{
                                    "readonly":true
                                },
                                "LoanDocuments":{
                                    "readonly":true
                                },
                                "LoanRecommendation":{
                                    "readonly":true
                                },
                                "LoanMitigants":{
                                    "readonly":true
                                },
                                "JewelDetails":{
                                    "readonly":true
                                },
                                "NomineeDetails":{
                                    "readonly":true
                                }
                            }

                        },
                        "CEOMDReview":{
                            "overrides":{
                                "PreliminaryInformation":{
                                    "readonly":true
                                },
                                "CollateralInformation":{
                                    "readonly":true
                                },
                                "LoanDocuments":{
                                    "readonly":true
                                },
                                "LoanRecommendation":{
                                    "readonly":true
                                },
                                "LoanMitigants":{
                                    "readonly":true
                                },
                                "JewelDetails":{
                                    "readonly":true
                                },
                                "NomineeDetails":{
                                    "readonly":true
                                }
                            }

                        },
                    },
                    "loanProcess.loanAccount.loanType":{
                        "SECURED":{
                            "overrides":{
                                "PreliminaryInformation.productType":{
                                    "readonly":true
                                }
                            }
                        }
                    }
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
                            condition : "model.loanAccount.productCategory != 'MEL'",
                            onChange:function(value,form,model){    
                                computeEMI(model);
                            }
                        },
                        "LoanRecommendation.interestRate": {
                            "title":"INTEREST_RATE1",
                            condition:"model.flag",
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
                        "PreliminaryInformation.loanAmountRequested": {
                            onChange:function(value,form,model){
                                computeEstimatedEMI(model);
                            }
                        },
                        "PreliminaryInformation.tenureRequested": {
                            "required": true,
                            condition : "model.loanAccount.productCategory != 'MEL'",
                            onChange:function(value,form,model){
                                computeEstimatedEMI(model);
                            }
                        },
                        "PreliminaryInformation.loanPurpose2":{
                            
                            onChange:function(value,form,model){
                                model.loanAccount.loanPurpose3=model.loanAccount.loanPurpose2;
                            }

                        },
                        "PreliminaryInformation.expectedInterestRate": {
                            "required": true,
                            "orderNo":139,
                            "title":"INTEREST_RATE",
                            condition:"model.flag",
                            onChange:function(value,form,model){
                                computeEstimatedEMI(model);
                            }
                        },                        
                        "PreliminaryInformation.productType": {
                        "required": true,
                        "enumCode":"booking_loan_type",
                        "onChange": function(valueObj,context,model){
                                clearAll('loanAccount',['productCode',"loanAmount","tenure","loanPurpose1","loanPurpose2","loanPurpose3","expectedInterestRate","psychometricCompleted"],model);
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
                                clearAll('loanAccount',['productCode',"loanAmount","tenure","loanPurpose1","loanPurpose2","loanPurpose3","expectedInterestRate","psychometricCompleted"],model);
                                model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6 = null;
                                model.loanAccount.cbCheckCompletedFlag=true;
                                //clearAll('additions',['tenurePlaceHolder','interestPlaceHolder','amountPlaceHolder'],model)
                            },
                        },
                        "PreliminaryInformation.frequency": {
                            "required":true,
                            "title":"FREQUENCY_REQUESTED",
                            "enumCode": "loan_product_frequency",
                            "onChange": function(valueObj,context,model){
                                computeEstimatedEMI(model);                                                             
                                clearAll('loanAccount',['productCode',"loanAmount","tenure","loanPurpose1","loanPurpose2","loanPurpose3","expectedInterestRate","psychometricCompleted"],model);
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
                                        if((model.loanAccount.productCategory == 'MEL') && !(['T516', 'T515','T585','T586','T903','T963'].indexOf(resp.body[i].productCode) >= 0)){
                                            resp.body.splice(i,1);
                                        }



                                        // _.filter(resp.body, function (item) {
                                        //     if(['T516', 'T515','T585','T586','T903','T963'].indexOf(item.productCode) >= 0){

                                        //     }
                                        //     else{

                                        //     }
                                        //   })
                                          
                                    }
                                    deferred.resolve(resp);
                                }),function(err){
                                    deferred.reject(err);
                                };
                                return deferred.promise;
                            },
                            onSelect: function (valueObj, model, context) {
                                clearAll("loanAccount",["loanAmount","tenure","loanPurpose1","loanPurpose2","loanPurpose3","expectedInterestRate","loanAmountRequested","tenureRequested","interestRate","estimatedEmi","emiRequested","psychometricCompleted"],model);
                                model.loanAccount.productCode = valueObj.productCode;
                                model.loanAccount.cbCheckCompletedFlag=true;
                                if(model.loanAccount.loanType == 'JEWEL')
                                    getGoldRate(model); 
                                model.additions.tenurePlaceHolder = valueObj.tenure_from == valueObj.tenure_to ? valueObj.tenure_from : valueObj.tenure_from + '-' + valueObj.tenure_to;
                                model.additions.amountPlaceHolder = valueObj.amount_from == valueObj.amount_to ? valueObj.amount_from : valueObj.amount_from + '-' + valueObj.amount_to;
                                model.additions.interestPlaceHolder = valueObj.min_interest_rate == valueObj.max_interest_rate ? valueObj.min_interest_rate : valueObj.min_interest_rate + '-' + valueObj.max_interest_rate;
                                if(valueObj.tenure_from == valueObj.tenure_to){
                                    model.additions.tenurePlaceHolder = valueObj.tenure_from
                                }
                                if(valueObj.amount_from == valueObj.amount_to){
                                    model.additions.amountPlaceHolder = valueObj.amount_from;
                                }
                                if(valueObj.max_interest_rate != 0 && valueObj.max_interest_rate != 0 && valueObj.max_interest_rate == valueObj.min_interest_rate){
                                    model.loanAccount.expectedInterestRate = valueObj.max_interest_rate;
                                    model.loanAccount.interestRate = valueObj.max_interest_rate
                                    model.flag = false
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
                        "PreliminaryInformation.comfortableEMI": {
                            "required": true,
                            "readonly":true,
                        },
                        "PreliminaryInformation.modeOfDisbursement": {
                            "required": true
                        },
                        "PreliminaryInformation.collectionPaymentType": {
                            orderNo:160,
                            "enumCode": "mode_of_repayment",
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
                            "title":"LOAN_DOCUMENT"
                        },
                        "CollateralInformation": {
                            "title":"COLLATERAL",
                            "orderNo":20,
                            "condition": "model.loanAccount.loanType=='SECURED'",                          
                        },
                        "CollateralInformation.collateral": {
                            "title":"COLLATERAL",
                            "required":true,
                            "startEmpty":false,
                            "view": "fixed",
                        },
                        "CollateralInformation.collateral.collateralType": {
                            "title":"COLLATERAL_TYPE",
                            "required":true
                        },
                        "CollateralInformation.collateral.nameOfOwner": {
                            "required":true
                        },
                        "CollateralInformation.collateral.marketValueOfAsset": {
                             "required":true
                        },
                        "CollateralInformation.collateral.collateralDocuments": {
                             "required":true
                        },
                        "JewelDetails": {
                            "orderNo": 20,
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
                        "NomineeDetails":{
                            "orderNo": 19
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
                            model.selfCustomerId = applicantCustomer.id;
                            if (!applicantCustomer) {
                                return out;
                            }
                            for (var i = 0; i < applicantCustomer.familyMembers.length; i++) {
                                if(!(applicantCustomer.urnNo == applicantCustomer.familyMembers[i].enrolledUrnNo)){
                                    out.push({
                                        customrId:applicantCustomer.familyMembers[i].customerId,
                                        enrolledUrnNo:applicantCustomer.familyMembers[i].enrolledUrnNo,
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
                            if (_.isUndefined(model.loanAccount.nominees[context.arrayIndex])) {
                                model.loanAccount.nominees[context.arrayIndex] = [];
                            }
                            if(valueObj.enrolledUrnNo){
                                nomineeDetails(valueObj.customrId,valueObj, model, context);
                            }
                            else{
                                nomineeDetails(model.selfCustomerId,valueObj, model, context);
                            }
                            //add to the witnees array
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
                    }
                    }
                }

            var getIncludes = function (model) {

                return [
                    "PreliminaryInformation",
                    "PreliminaryInformation.partner",
                    "PreliminaryInformation.productType",
                    "PreliminaryInformation.productCategory",
                    "PreliminaryInformation.frequency",
                    "PreliminaryInformation.melFrequency",
                    "PreliminaryInformation.loanProduct",
                    "PreliminaryInformation.productName",
                    "PreliminaryInformation.numberOfGuarantorsCoApplicants",                    
                    "PreliminaryInformation.loanPurpose1",
                    "PreliminaryInformation.loanPurpose2",
                    "PreliminaryInformation.loanAmountRequested",
                    "PreliminaryInformation.tenureRequested",
                    "PreliminaryInformation.tenureRequested1",
                    "PreliminaryInformation.comfortableEMI",
                    "PreliminaryInformation.expectedInterestRate",
                    "PreliminaryInformation.expectedInterestRate1",
                    "PreliminaryInformation.modeOfDisbursement",
                    "PreliminaryInformation.collectionPaymentType",        

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
                    "CollateralInformation.collateral.collateralType",
                    "CollateralInformation.collateral.nameOfOwner",
                    "CollateralInformation.collateral.collateralName",
                    "CollateralInformation.collateral.dateOfRegistration",
                    "CollateralInformation.collateral.relationWithApplicant",
                    "CollateralInformation.collateral.marketValueOfAsset",
                    "CollateralInformation.collateral.timeSinceTheAssetIsOwned",
                    "CollateralInformation.collateral.collateralDocuments",

                    "LoanDocuments",
                    "LoanDocuments.loanDocuments",
                    "LoanDocuments.loanDocuments.document",
                    "LoanDocuments.loanDocuments.documentId",

                    "LoanRecommendation",
                    "LoanRecommendation.loanAmountRecommended",
                    "LoanRecommendation.tenure",
                    "LoanRecommendation.tenure1",
                    "LoanRecommendation.interestRate",
                    "LoanRecommendation.interestRate1",
                    "LoanRecommendation.expectedEmi",

                    "LoanMitigants",
                    "LoanMitigants.deviationDetails",
                    "LoanMitigants.loanMitigants",
                    "LoanMitigants.loanMitigants.parameter",
                    "LoanMitigants.loanMitigants.mitigant",

                    "PostReview",
                    "PostReview.action",
                    "PostReview.actionExcludesSendBack",
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

                    "RevertReject",
                    "RevertReject.sendBack",
                    "RevertReject.sendBack.remarks",
                    "RevertReject.sendBack.rejectReason",                    
                    "RevertReject.sendBack.stage",
                    "RevertReject.sendBack.sendBackButton",                   

               ];

            }

            return {
                "type": "schema-form",
                "title": "LOAN_DETAILS",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // AngularResourceService.getInstance().setInjector($injector);
                    model.customer = {};
                    model.review = model.review|| {};
                    model.customerId = null;
                    model.flag = true;
                    model.loanAccount = model.loanProcess.loanAccount;
                    if(model.loanAccount.currentStage == 'Screening' && !_.hasIn(model.loanAccount, 'id')){
                        model.loanAccount.isBusinessCaptured = false;
                    }
                    if(model.loanAccount.loanType == 'JEWEL' && model.loanAccount.currentStage == 'Screening'){
                        getGoldRate(model);
                        if (model.loanAccount.jewelLoanDetails ==undefined)
                            model.loanAccount.jewelLoanDetails = {};

                        if(model.loanAccount.jewelLoanDetails) {
                            model.loanAccount.jewelLoanDetails.encoreClosed = false;
                            model.loanAccount.jewelLoanDetails.jewelPouchLocationType = "BRANCH";
                        }
                    }
                    if(model.loanAccount.loanType == 'JEWEL')
                        if(model.loanAccount.jewelLoanDetails) {
                            model.loanAccount.jewelLoanDetails.jewelPouchNo=Number(model.loanAccount.jewelLoanDetails.jewelPouchNo);
                        }

                    if (_.hasIn(model, 'loanAccount.loanPurpose2') && model.loanAccount.loanPurpose2 !=null && model.loanAccount.loanPurpose2.length > 0)
                    model.loanAccount.loanPurpose3=model.loanAccount.loanPurpose2;
                    model.loanAccount.interestRateEstimatedEMI={};
                    if (_.hasIn(model, 'loanAccount.expectedInterestRate') && model.loanAccount.expectedInterestRate !=null && model.loanAccount.expectedInterestRate.length > 0)
                    model.loanAccount.interestRate=model.loanAccount.expectedInterestRate;
                    var postReviewActionArray = {
                        "REJECT": "REJECT",
                        "SEND_BACK": "SEND_BACK",
                        "PROCEED": "PROCEED"
                    }

                    /* ornamentsAppraisals */
                    if (_.hasIn(model.loanAccount, 'ornamentsAppraisals') && _.isArray(model.loanAccount.ornamentsAppraisals)){
                        for (var i=0; i<model.loanAccount.ornamentsAppraisals.length; i++){
                            model.loanAccount.ornamentsAppraisals[i].ratePerGramInPaisa=model.loanAccount.ornamentsAppraisals[i].ratePerGramInPaisa/100;
                            model.loanAccount.ornamentsAppraisals[i].marketValueInPaisa=model.loanAccount.ornamentsAppraisals[i].marketValueInPaisa/100;                      
                        }
                    }
                    /* ornamentsAppraisals */

                    model.loanAccount.cbCheckCompletedFlag=false;
                    model.loanAccount.dataCheckChanges=[];
                    // model.loanAccount.dataCheckChanges=false;

                    
                    //var postReviewActionArray = {};
                    // if(model.loanAccount.currentStage == 'BusinessTeamReview' || model.loanAccount.currentStage == 'CreditOfficerReview' || model.loanAccount.currentStage == 'CreditManagerReview' || model.loanAccount.currentStage == 'CBOCreditHeadReview' || model.loanAccount.currentStage == 'CEOMDReview') {
                    //     postReviewActionArray = {
                    //         "SEND_BACK": "SEND_BACK",
                    //         "PROCEED": "PROCEED"
                    //     }
                    // } else {
                    //     postReviewActionArray = {
                    //         "REJECT": "REJECT",
                    //         "SEND_BACK": "SEND_BACK",
                    //         "PROCEED": "PROCEED"
                    //     }
                    // }
                    
                    defaultConfiguration(model,true);


                        if(model.loanAccount.estimatedEmi){
                            model.loanAccount.estimatedEmi = model.loanAccount.estimatedEmi;
                        } else {
                                computeEstimatedEMI(model);
                        }

                        if(model.loanAccount.emiRequested){
                            model.loanAccount.emiRequested = model.loanAccount.emiRequested;
                        } else {
                                computeEMI(model);
                        }
                        if (_.hasIn(model, 'loanAccount.loanType') && model.loanAccount.loanType !=null && model.loanAccount.loanType.length > 0) {
                            if(model.loanAccount.loanType == 'JEWEL')
                                getGoldRate(model);
                        }

                    /* Setting data recieved from Bundle */
                    model.loanAccount.partnerCode='KGFS';
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
                     setLoanMitigantsGroup(model);
                    // if (_.hasIn(model.loanAccount, 'loanMitigants') && _.isArray(model.loanAccount.loanMitigants)){
                    //     var loanMitigantsGrouped = {};
                    //     for (var i=0; i<model.loanAccount.loanMitigants.length; i++){
                    //         var item = model.loanAccount.loanMitigants[i];
                    //         if (!_.hasIn(loanMitigantsGrouped, item.parameter)){
                    //             loanMitigantsGrouped[item.parameter] = [];
                    //         }
                    //         loanMitigantsGrouped[item.parameter].push(item);
                    //     }
                    //     model.loanMitigantsGrouped=loanMitigantsGrouped;
                    //     model.deviationMitigants  = model.loanAccount.loanMitigants;
                    //     model.loanAccount.loanMitigants = null;                        

                    // }
                    /* End of Deviations and Mitigations grouping */
                     /* Collateral */
                    if (_.hasIn(model.loanAccount, 'collateral') && _.isArray(model.loanAccount.collateral)){
                        for (var i=0; i<model.loanAccount.collateral.length; i++){
                          model.loanAccount.collateral[i].udf3 = Number(model.loanAccount.collateral[i].udf3);
                          if(model.loanAccount.collateral[i].udf3 == 0)
                             model.loanAccount.collateral[i].udf3=null;  
                        }
                    }
                    /* Collateral */

                    // added for frequency to be locked monthly
                    if(model.loanAccount.currentStage == "Screening"){
                       if(model.loanAccount.frequency == undefined || model.loanAccount.frequency == null){
                        model.loanAccount.frequency="M";
                       }
                    }
                    model.tempLoanAmountRequested=model.loanAccount.loanAmountRequested;
                    model.tempLoanAmount=model.loanAccount.loanAmount;


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
                                                "title": "LOAN_TYPE",
                                                "readonly":true,
                                                "type": "select",
                                                "orderNo": 9
                                            },
                                            "productCategory":{
                                                "key":"loanAccount.productCategory",
                                                "title": "PRODUCT_CATEGORY",
                                                "type": "text",
                                                "readonly":true,
                                                "orderNo": 9
                                            },
                                            "frequency": {
                                                "key":"loanAccount.frequency",
                                                "title": "FREQUENCY",
                                                "type": "select",
                                                "orderNo": 9,
                                                "readonly":false,
                                                "condition":"(model.loanAccount.productCategory != 'MEL')"
                                            },
                                            "melFrequency": {
                                                "key":"loanAccount.frequency",
                                                "title": "FREQUENCY",
                                                "type": "select",
                                                "orderNo": 9,
                                                "enumCode":"loan_product_frequency",
                                                "readonly":true,
                                                "condition":"(model.loanAccount.productCategory == 'MEL')"
                                            },
                                            "loanProduct": {
                                                "key":"loanAccount.productCode",
                                                "title": "LOAN_PRODUCT",
                                                "type": "lov",
                                                "enumCode":"loan_product",
                                                onChange:function(value,form,model){
                                                    LoanProducts.getProductData({"productCode":value})
                                                    .$promise
                                                    .then(function(res){
                                                        console.log(res)
                                                    },function(res){

                                                    })
                                                },
                                                "orderNo": 10
                                            },
                                            "loanPurpose1":{
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
                                                    if(model.loanAccount.productCode != null)
                                                        return Queries.getLoanPurpose1(model.loanAccount.productCode);
                                                    else
                                                        return Queries.getAllLoanPurpose1();
                
                                                },
                                                getListDisplayItem: function(item, index) {
                                                    return [
                                                        item.purpose1
                                                    ];
                                                },
                                                onSelect: function(result, model, context) {
                                                    model.loanAccount.loanPurpose2 = '';
                                                }
                                            },
                                            "loanPurpose2":{
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
                                                    if(model.loanAccount.productCode != null)
                                                        return Queries.getLoanPurpose2(model.loanAccount.productCode, model.loanAccount.loanPurpose1);
                                                    else
                                                        return Queries.getAllLoanPurpose2(model.loanAccount.loanPurpose1);
                                                },
                                                getListDisplayItem: function(item, index) {
                                                    return [
                                                        item.purpose2
                                                    ];
                                                }
                                            },
                                            "loanPurpose3": {
                                                "key":"loanAccount.loanPurpose3",
                                                "title": "LOAN_PURPOSE_3",
                                                "type": "lov",
                                                "orderNo": 41,
                                                "resolver": "LoanPurpose3LOVConfiguration"
                                            },
                                            "productName":{
                                                "title": "PRODUCT_NAME",
                                                "readonly": true,
                                                "key": "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6",
                                                "orderNo": 11
                                                    
                                            },
                                            "numberOfGuarantorsCoApplicants":{
                                                "title":"Required",
                                                orderNo:12,
                                                "type":"html",
                                                "condition":"model.loanAccount.productCode",
                                                "key":"additions.noOfGuarantorCoApplicantHtml"
                                            },
                                            "comfortableEMI": {
                                                "key":"loanAccount.estimatedEmi",
                                                "title": "EMI",
                                                "type": "string",
                                                "orderNo": 140
                                            },
                                            "modeOfDisbursement": {
                                                "key":"loanAccount.psychometricCompleted",
                                                "title": "MODE_OF_DISBURSEMENT",
                                                "type": "select",
                                                "enumCode":"mode_of_disbursement",
                                                "orderNo": 150
                                            },
                                            "expectedInterestRate1":{
                                                "required": true,
                                                "key":"loanAccount.expectedInterestRate",
                                                "orderNo":139,
                                                "readonly":true,
                                                "title":"INTEREST_RATE",
                                                "condition":"!model.flag" ,
                                                onChange:function(value,form,model){
                                                    computeEstimatedEMI(model);
                                                }
                                            },
                                            "tenureRequested1":{
                                                "key":"loanAccount.tenureRequested",
                                                "title": "TENURE_REQUESETED",
                                                "type": "select",
                                                "enumCode":"tenure",
                                                condition : "model.loanAccount.productCategory == 'MEL'",
                                                onChange:function(value,form,model){
                                                    computeEstimatedEMI(model);
                                                },
                                                "orderNo": 70
                                            },
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
                                    "interestRate1":{
                                        "key":"loanAccount.interestRate",
                                        "title":"INTEREST_RATE",
                                        "readonly":true,
                                        condition:"!model.flag",
                                    },
                                    "tenure1":{
                                        "key":"loanAccount.tenure",
                                        "title":"DURATION_IN_MONTHS",
                                        "enumCode":"tenure",
                                        "type": "select",
                                        condition : "model.loanAccount.productCategory == 'MEL'",
                                        onChange:function(value,form,model){
                                            computeEMI(model);
                                        }
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
                                                "type":"lov",
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
                                                       // if(!(applicantCustomer.urnNo == applicantCustomer.familyMembers[i].enrolledUrnNo)){
                                                            out.push({
                                                                name: applicantCustomer.familyMembers[i].familyMemberFirstName,
                                                                dob: applicantCustomer.familyMembers[i].dateOfBirth,
                                                                relationship: applicantCustomer.familyMembers[i].relationShip,
                                                            })
                                                       // }
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
                                                    if (_.isUndefined(model.loanAccount.collateral[context.arrayIndex])) {
                                                        model.loanAccount.collateral[context.arrayIndex] = [];
                                                    }
                                                    model.loanAccount.collateral[context.arrayIndex].propertyOwnerName = valueObj.name;
                                                    model.loanAccount.collateral[context.arrayIndex].udf1 = valueObj.name;
                                                    model.loanAccount.collateral[context.arrayIndex].dateOfRegistration = valueObj.dob;
                                                    model.loanAccount.collateral[context.arrayIndex].relationWithApplicant = valueObj.relationship;
                                                    
                                                },
                                                getListDisplayItem: function (item, index) {
                                                    return [
                                                        item.name
                                                    ];
                                                }
                                            },
                                            "collateralName":{
                                                "key": "loanAccount.collateral[].udf1",
                                                "title":"COLLATERAL_NAME",
                                                "type":"string"
                                            },
                                            "dateOfRegistration":{
                                                "key": "loanAccount.collateral[].dateOfRegistration",
                                                "title":"DATE",
                                                "type":"date"
                                            },
                                            "relationWithApplicant":{
                                                "key": "loanAccount.collateral[].relationWithApplicant",
                                                "title":"RELATION",
                                                "type":"string"
                                            },
                                            "marketValueOfAsset":{
                                                "key": "loanAccount.collateral[].udf2",
                                                "title":"MARKET_VALUE_OF_ASSET",
                                                "type":"string",
                                            },
                                            "timeSinceTheAssetIsOwned":{
                                                "key": "loanAccount.collateral[].udf3",
                                                "title":"TIME_SINCE_THE_ASSET_IS_OWNED",
                                                "type":"number"
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
                                        "html": '<table class="table"><colgroup><col width="20%"><col width="20%"></colgroup><thead><tr><th>Deviation</th><th>Mitigation</th></tr></thead><tbody>' +
                                            '<tr ng-repeat="(parameter,item) in model.loanMitigantsGrouped">' +
                                            '<td>{{ parameter }}</td>' +
                                            '<td><ul class="list-unstyled">' +
                                            '<li ng-repeat="m in item" id="{{m.mitigant}}">' +
                                            '<input type="checkbox" ng-checked="m.mitigatedStatus"  ng-model="m.mitigatedStatus"> {{ m.mitigant }}' +
                                            '</li></ul></td></tr></tbody></table>'
                                    },                                    
                                    "loanMitigants":{
                                        "key":"loanAccount.loanMitigants",
                                        "title":"ADD",
                                        "titleExpr":"('DEVIATION_AND_MITIGATION'|translate)",
                                        "type":"array",
                                        "startEmpty": true,
                                        "items":{
                                            "parameter":{
                                               "key":"loanAccount.loanMitigants[].parameter",
                                               "title":"Deviation",
                                               "type":"string",
                                               schema: {
                                                    "pattern": "^[a-zA-Z: ]{0,250}$",
                                                    "type": ["string", "null"],
                                                }
                                               
                                            },
                                            "mitigant":{
                                               "key":"loanAccount.loanMitigants[].mitigant",
                                               "title":"Mitigation",
                                               "type":"string"
                                            }
                                        }
                                    }
                                }
                            },
                            "PostReview": {
                                        "type": "box",
                                        "title": "POST_REVIEW",
                                        "condition": "model.loanAccount.id && model.loanAccount.isReadOnly!='Yes' && model.loanAccount.currentStage != 'Rejected'",
                                        "orderNo": 600,
                                        "items": {
                                            "action": {
                                                "key": "review.action",
                                                "condition": "model.loanAccount.currentStage != 'Screening'",
                                                "type": "radios",
                                                "titleMap": postReviewActionArray
                                            },
                                            "actionExcludesSendBack": {
                                                "key": "review.action",
                                                "type": "radios",
                                                "condition": "model.loanAccount.currentStage == 'Screening'",
                                                "titleMap": {
                                                    "REJECT": "REJECT",
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
                                                "condition": "model.review.action=='SEND_BACK' && model.loanAccount.currentStage !='Screening'",
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
                                                        "resolver": "KGFSSendBacktoStageLOVConfiguration"
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
                                                        "resolver": "KGFSRejectReasonLOVConfiguration"
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
                                    },
                                    "RevertReject": {
                                        "type": "box",
                                        "title": "REVERT_REJECT",
                                        "condition": "model.loanAccount.currentStage =='Rejected'",
                                        "orderNo": 600,
                                        "items": {
                                            "sendBack": {
                                                "type": "section",
                                                "items": {
                                                    "remarks": {
                                                        "title": "REMARKS",
                                                        "key": "loanProcess.remarks",
                                                        "type": "textarea",
                                                        "required": true
                                                    },
                                                    "rejectReason":{
                                                        "title":"REJECT_REASON",
                                                        "key":"loanAccount.rejectReason",
                                                        "readonly":true,
                                                        "type":"textarea"
                                                    }, 
                                                   "stage": {
                                                        "key": "loanProcess.stage",
                                                        "required": true,
                                                        "type": "lov",
                                                        "title": "SEND_BACK_TO_STAGE",
                                                        "resolver": "KGFSSendBacktoStageLOVConfiguration"
                                                    }, 
                                                   "sendBackButton": {
                                                        "key": "review.sendBackButton",
                                                        "type": "button",
                                                        "title": "SEND_BACK",
                                                        "onClick": "actions.sendBack(model, formCtrl, form, $event)"
                                                    }
                                                }
                                            }            
                                        }
                                    }
                                },
                                "additions": [
                                    {
                                        "type": "actionbox",
                                        "condition": "model.loanAccount.currentStage !='Rejected' && model.loanAccount.currentStage !='KYCCheck' && model.loanAccount.currentStage !='DSCApproval' && model.loanAccount.currentStage !='DSCOverride' ",
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
                    "new-applicant": function (bundleModel, model, obj) {
                        model.customer = obj.customer;
                      //  clearAll('loanAccount',[productCode',"loanAmount","tenure","loanPurpose1","loanPurpose2","loanPurpose3","expectedInterestRate"],model);
                        model.loanAccount.customerId = model.customer.id;
                        model.loanAccount.urnNo = model.customer.urnNo;
                        defaultConfiguration(model,false);
                        model.loanAccount.loanCentre.centreId = obj.customer.centreId;
                    },
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
                    "business-captures": function(bundleModel, model, params){
                        model.loanAccount.isBusinessCaptured = typeof params.customer.isCaptured  != undefined ? (params.customer.isCaptured?true:false):false;
                        model.loanAccount.isCreditAppraisal = typeof params.customer.isCreditAppraisal  != undefined ? (params.customer.isCreditAppraisal?true:false):false; 
                        model.loanAccount.urnNo = model.customer.urnNo;    
                        model.customerId=  params.customer.id;
                    },
                    "business-customer-bank-accounts": function(bundleModel, model, params){
                        model.customer.customerBankAccounts=params.customer.customerBankAccounts;    
                    },
                    "dsc-response": function(bundleModel,model,obj){
                        model.loanAccount.loanCustomerRelations = obj;
                    },                    
                    "cb-check-update": function(bundleModel, model, params){
                    $log.info("Inside cb-check-update of LoanRequest");
                    for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                            if (model.loanAccount.loanCustomerRelations[i].customerId == params.customerId) {
                            model.loanAccount.dataCheckChanges[i]=true;
                                model.loanAccount.loanCustomerRelations[i].cbCheckCompleted=false;
                                if(params.cbType == 'BASE')
                                    model.loanAccount.loanCustomerRelations[i].highmarkCompleted = true;
                                else if(params.cbType == 'INDIVIDUAL')
                                    {   
                                    model.loanAccount.dataCheckChanges[i]=false;
                                    model.loanAccount.loanCustomerRelations[i].cbCheckCompleted = true;
                                }
                            }
                        }
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
                    },
                    "refresh-all-tabs-customer": function (bundleModel, model, params) {                        
                        clearAll('loanAccount',['productCode',"loanAmount","tenure","loanPurpose1","loanPurpose2","loanPurpose3","expectedInterestRate","loanAmountRequested","tenureRequested","estimatedEmi","psychometricCompleted","interestRate","emiRequested"],model);                                     
                        model.loanAccount.collateral=[];
                        model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6=null;
                        model.loanAccount.loanDocuments=[];
                        model.loanAccount.loanMitigants=[];                      
                    },
                    "new-co-applicant": function(bundleModel, model, params){
                        for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                            if (model.loanAccount.loanCustomerRelations[i].customerId == params.customer.id) {
                                model.loanAccount.dataCheckChanges[i]=true;
                                model.loanAccount.loanCustomerRelations[i].cbCheckCompleted = false;
                            }
                        }
                    },
                    "new-guarantor": function(bundleModel, model, params){
                        $log.info("Insdie guarantor of LoanRequest");
                        // model.loanAccount.coApplicant = params.customer.id;
                        var addToRelation = true;
                        for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                            if (model.loanAccount.loanCustomerRelations[i].customerId == params.customer.id) {
                                addToRelation = false;
                                model.loanAccount.dataCheckChanges[i]=true;
                                model.loanAccount.loanCustomerRelations[i].cbCheckCompleted = false;
                                if (params.customer.urnNo)
                                    //model.loanAccount.loanCustomerRelations[i].urn =params.customer.urnNo;
                                    //model.loanAccount.loanCustomerRelations[i].name =params.customer.firstName;
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
                            if (_.hasIn(model, 'loanAccount.guarantors') && _.isArray(model.loanAccount.guarantors)){
                                if(model.loanAccount.guarantors.length > 1){
                                    for (var i=0;i<model.loanAccount.guarantors.length; i++){
                                        if(model.loanAccount.guarantors[i].guaUrnNo == model.loanAccount.applicant)
                                            model.loanAccount.guarantors.splice(i, 1);
                                    }          
                                }
                            }


                        } else {
                            if (!model.loanAccount.guarantors[existingGuarantorIndex].guaUrnNo){
                                model.loanAccount.guarantors[existingGuarantorIndex].guaUrnNo = params.customer.urnNo;
                            }
                        }
        
        
                    },
                },
                form: [],
                schema: function() {
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {
                    
                    submit: function(model, formCtrl, form){  
                        if(model.loanAccount.productCategory  != 'MEL'){
                            model.loanAccount.customerId=model.loanAccount.loanCustomerRelations[0].customerId;
                            model.loanAccount.urnNo=model.loanAccount.loanCustomerRelations[0].urn; 
                        }

                        if(_.hasIn(model.loanProcess, 'applicantEnrolmentProcess'))
                            if(model.loanProcess.applicantEnrolmentProcess.customer.fcuStatus)
                                model.loanProcess.applicantEnrolmentProcess.customer.fcuStatus="true";
                            else
                                model.loanProcess.applicantEnrolmentProcess.customer.fcuStatus="false";

                        if(model.loanAccount.productCategory  == 'MEL' && model.customerId !=null && model.loanAccount.customerId != model.customerId)
                        model.loanProcess.loanAccount.customerId = model.customerId;

                        if(model.loanAccount.currentStage && model.loanAccount.currentStage == "Screening" && model.loanAccount.productCategory == 'MEL' && !model.loanAccount.isBusinessCaptured){
                            PageHelper.showProgress("loan-enrolment","Business Details are not captured",5000);
                                return false;
                        }
                        if(model.loanAccount.loanAmount > model.loanAccount.loanAmountRequested)
                        {
                            PageHelper.showErrors({data:{error:"Loan Amount Recommended should not be more than loan Amount requested"}});
                            return false;
                        }
                        if(model.loanAccount.productCategory  == 'MEL')
                        {
                            if(model.loanAccount.loanAmount >= loanAmountRequestedLoanLimit)
                            {
                                if((_.hasIn(model.customer, 'customerBankAccounts')) && _.isArray(model.customer.customerBankAccounts) && model.customer.customerBankAccounts.length == 0) {
                                    PageHelper.showErrors({data:{error:"Business Tab - Bank accounts details should be mandatory"}});
                                    return false;
                                } 
                            }

                            if(bankName == bankNameKarnataka || bankName ==bankNameKeonjar)
                            {
                                if((_.hasIn(model.customer, 'customerBankAccounts')) && _.isArray(model.customer.customerBankAccounts) && model.customer.customerBankAccounts.length == 0) {
                                    PageHelper.showErrors({data:{error:"Business Tab - Bank accounts details should be mandatory"}});
                                    return false;
                                } 
                            }                             
                        }

                        if(model.loanAccount.currentStage == 'Application'){
                          if(model.loanAccount.loanAmountRequested > model.tempLoanAmountRequested){
                            PageHelper.showErrors({data:{error:"Loan Amount Requested should not be more than "+model.tempLoanAmountRequested}});
                            return false;
                          }
                          if(model.loanAccount.loanAmount > model.tempLoanAmount){
                            PageHelper.showErrors({data:{error:"Loan Amount Recommended should not be more than "+model.tempLoanAmount}});
                            return false;
                          }
                        }

                        // model.loanAccount.customerId=model.loanAccount.loanCustomerRelations[0].customerId;
                        /* Loan SAVE */
                        if (!model.loanAccount.id){
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                        }
                        if(model.loanAccount.cbCheckCompletedFlag)
                        {
                            for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                                model.loanAccount.dataCheckChanges[i]=true;
                                model.loanAccount.loanCustomerRelations[i].cbCheckCompleted=false;
                            }                            
                            model.loanAccount.cbCheckCompletedFlag=false;
                        }


                         if(!(policyBasedOnLoanType(model.loanAccount.loanType,model))){
                            PageHelper.showProgress('loan-process','Oops Some Error',2000);
                            return false;}

                         /* ornamentsAppraisals */
                        if (_.hasIn(model.loanAccount, 'ornamentsAppraisals') && _.isArray(model.loanAccount.ornamentsAppraisals)){
                            for (var i=0; i<model.loanAccount.ornamentsAppraisals.length; i++){
                               model.loanAccount.ornamentsAppraisals[i].ratePerGramInPaisa=model.loanAccount.ornamentsAppraisals[i].ratePerGramInPaisa*100;
                               model.loanAccount.ornamentsAppraisals[i].marketValueInPaisa=model.loanAccount.ornamentsAppraisals[i].marketValueInPaisa*100;                      
                            }
                        }
                        /* ornamentsAppraisals */

                        if(!(validateCoGuarantor(model.additions.co_borrower_required,model.additions.number_of_guarantors,'validate',model.loanAccount.loanCustomerRelations,model)))
                            return false;
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        if(!savePolicies(model)){
                            PageHelper.showProgress('loan-process','Oops Some Error',2000);
                            return false;}
                       
                       // setDeviation(model);                                                    
                        model.loanProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                /* Collateral */
                                    if (_.hasIn(model.loanAccount, 'collateral') && _.isArray(model.loanAccount.collateral)){
                                        for (var i=0; i<model.loanAccount.collateral.length; i++){
                                          model.loanAccount.collateral[i].udf3 = Number(model.loanAccount.collateral[i].udf3);
                                          if(model.loanAccount.collateral[i].udf3 == 0)
                                             model.loanAccount.collateral[i].udf3=null;       
                                        }
                                    }
                                /* Collateral */
                                /* ornamentsAppraisals */
                                if (_.hasIn(model.loanAccount, 'ornamentsAppraisals') && _.isArray(model.loanAccount.ornamentsAppraisals)){
                                    for (var i=0; i<model.loanAccount.ornamentsAppraisals.length; i++){
                                       model.loanAccount.ornamentsAppraisals[i].ratePerGramInPaisa=model.loanAccount.ornamentsAppraisals[i].ratePerGramInPaisa/100;
                                       model.loanAccount.ornamentsAppraisals[i].marketValueInPaisa=model.loanAccount.ornamentsAppraisals[i].marketValueInPaisa/100;                      
                                    }
                                }
                                /* ornamentsAppraisals */
                               // setLoanMitigantsGroup(model);
                                BundleManager.pushEvent('new-loan', model._bundlePageObj, {loanAccount: model.loanAccount}); 
                                BundleManager.pushEvent('new-loanAccount-id', model._bundlePageObj, {loanId: model.loanAccount.id});                                    
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);                                

                            }, function (err) {
                               // setLoanMitigantsGroup(model);
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
                        
                        if(model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5){
                            model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5  = "false"
                        }
                       if (model.loanProcess.remarks==null || model.loanProcess.remarks =="" || model.review.targetStage ==null || model.review.targetStage ==""){
                               PageHelper.showProgress("update-loan", "Send to Stage / Remarks is mandatory", 3000);
                               PageHelper.hideLoader();
                               return false;
                        }
                        PageHelper.showLoader();
                         if (model.loanProcess.stage==null || model.loanProcess.stage ==""){
                               PageHelper.showProgress("update-loan", "Send to Stage is mandatory", 3000);
                               PageHelper.hideLoader();
                               return false;
                        }
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
                    if (_.hasIn(model, 'review.targetStage'))
                    {
                        model.review.targetStage='';
                        model.loanProcess.stage='';
                    } 

                         if(_.hasIn(model.loanProcess, 'applicantEnrolmentProcess'))
                            if(model.loanProcess.applicantEnrolmentProcess.customer.fcuStatus)
                                model.loanProcess.applicantEnrolmentProcess.customer.fcuStatus="true";
                            else
                                model.loanProcess.applicantEnrolmentProcess.customer.fcuStatus="false";

                        if(model.loanAccount.currentStage && model.loanAccount.currentStage == "CreditAppraisal" && model.loanAccount.productCategory == 'MEL' && !model.loanAccount.isBusinessCaptured){
                            PageHelper.showProgress("loan-enrolment","Business Details are not captured",5000);
                                return false;
                        } 
                        // if(_.isNull(model.loanAccount.loanMitigants) || (model.loanAccount.loanMitigants == undefined))   {
                        //     model.loanAccount.loanMitigants = [];
                        // }                        
                       // setDeviation(model);
                       // validateDeviationForm(model);
                        // if(_.isArray(validateDeviation) && validateDeviation.length > 0 && model.loanAccount.currentStage != 'Screening') {
                        //     model.loanAccount.loanMitigants=[];
                        //     PageHelper.showErrors({data:{error:"Mitigation checkbox, Please check this box if you want to proceed"}});
                        //     return false;
                        // }
                      
                         if (model.loanProcess.remarks==null || model.loanProcess.remarks ==""){
                               model.loanAccount.loanMitigants=[];
                               PageHelper.showProgress("update-loan", "Remarks is mandatory", 3000);
                               PageHelper.hideLoader();
                               return false;
                        }
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
                        if(model.loanAccount.loanAmount > model.loanAccount.loanAmountRequested)
                        {
                            PageHelper.showErrors({data:{error:"Loan Amount Recommended should not be more than loan Amount requested"}});
                            return false;
                        }

                         if(model.loanAccount.productCategory  == 'MEL')
                        {
                            if(model.loanAccount.loanAmount >= loanAmountRequestedLoanLimit)
                            {
                                if((_.hasIn(model.customer, 'customerBankAccounts')) && _.isArray(model.customer.customerBankAccounts) && model.customer.customerBankAccounts.length == 0) {
                                    PageHelper.showErrors({data:{error:"Business Tab - Bank accounts details should be mandatory"}});
                                    return false;
                                } 
                            }

                            if(bankName == bankNameKeonjar || bankName ==bankNameKarnataka)
                            {
                                if((_.hasIn(model.customer, 'customerBankAccounts')) && _.isArray(model.customer.customerBankAccounts) && model.customer.customerBankAccounts.length == 0) {
                                    PageHelper.showErrors({data:{error:"Business Tab - Bank accounts details should be mandatory"}});
                                    return false;
                                } 
                            }                            
                        }

                        if(model.loanAccount.currentStage == 'Application'){
                            if(model.loanAccount.loanAmountRequested > model.tempLoanAmountRequested){
                              PageHelper.showErrors({data:{error:"Loan Amount Requested should not be more than "+model.tempLoanAmountRequested}});
                              return false;
                            }
                            if(model.loanAccount.loanAmount > model.tempLoanAmount){
                              PageHelper.showErrors({data:{error:"Loan Amount Recommended should not be more than "+model.tempLoanAmount}});
                              return false;
                            }
                          }

                        if(model.loanAccount.cbCheckCompletedFlag)
                        {
                            for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                                model.loanAccount.dataCheckChanges[i]=true;
                                model.loanAccount.loanCustomerRelations[i].cbCheckCompleted=false;
                            }
                            model.loanAccount.cbCheckCompletedFlag=false;
                        }

                        if(model.loanAccount.currentStage && model.loanAccount.currentStage == 'Screening' && model.loanAccount.loanType != 'JEWEL'){
                            for (var i=0;i<model.loanAccount.loanCustomerRelations.length; i++){
                                if (model.loanAccount.loanCustomerRelations[i].customerId) {
                                    if(!model.loanAccount.loanCustomerRelations[i].cbCheckCompleted){
                                       // model.loanAccount.loanMitigants=[];
                                        if(model.loanAccount.dataCheckChanges[i])
                                        {
                                            PageHelper.showProgress("loan-create","CB Check pending. Please do a CB check and then proceed",5000);
                                            return false;                                            
                                        }

                                    }
                                    // else if(model.loanAccount.dataCheckChanges)
                                    // {
                                    //     PageHelper.showProgress("loan-create","CB Check pending. Please do a CB check and then proceed",5000);
                                    //     return false;                                            
                                    // }                          
                                }
                            }
                        }
                        if (model.loanAccount.id && model.loanAccount.currentStage == 'DSCApproval'){
                            if(model.loanAccount.loanCustomerRelations && model.loanAccount.loanCustomerRelations.length > 0){
                                for(i = 0; i< model.loanAccount.loanCustomerRelations.length;i++){
                                    if(model.loanAccount.loanCustomerRelations[i].relation != "Applicant")
                                        continue;
                                    if(typeof model.loanAccount.loanCustomerRelations[i].dscStatus == "undefined" || model.loanAccount.loanCustomerRelations[i].dscStatus == null){
                                        model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5  = null
                                        break;
                                    }
                                    if(model.loanAccount.loanCustomerRelations[i].dscStatus == "FAILURE" || model.loanAccount.loanCustomerRelations[i].dscStatus == "DSC_OVERRIDE_REQUIRED"){
                                        model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5  = "true"
                                        break;
                                    }
                                    else{
                                        model.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5  = "false"
                                    }                                    
                                }
                            }
                        }
                        if (model.loanAccount.id && model.loanAccount.currentStage == 'DSCApproval'){
                            if(model.loanAccount.loanCustomerRelations && model.loanAccount.loanCustomerRelations.length > 0){
                                for(i = 0; i< model.loanAccount.loanCustomerRelations.length;i++){
                                    if((typeof model.loanAccount.loanCustomerRelations[i].dscStatus == "undefined" || model.loanAccount.loanCustomerRelations[i].dscStatus == null) && model.loanAccount.loanCustomerRelations[i].relation == "Applicant"){
                                        model.loanAccount.loanMitigants=[];
                                        PageHelper.showErrors({data:{error:"DSC Tab, Please click DSC Request button if you want to proceed"}});
                                        return false;
                                    }
                                }
                            }
                        }
                        if (model.loanAccount.id && model.loanAccount.currentStage == 'DSCOverride'){
                            if(model.loanAccount.loanCustomerRelations && model.loanAccount.loanCustomerRelations.length > 0){
                                for(i = 0; i< model.loanAccount.loanCustomerRelations.length;i++){
                                    if(typeof model.loanAccount.loanCustomerRelations[i].dscStatus != "undefined" && model.loanAccount.loanCustomerRelations[i].relation == "Applicant" && model.loanAccount.loanCustomerRelations[i].dscStatus == "DSC_OVERRIDE_REQUIRED"){
                                        model.loanAccount.loanMitigants=[];
                                        PageHelper.showErrors({data:{error:"DSC Tab, Please click DSC Override button if you want to proceed"}});
                                        return false;
                                    }
                                }
                            }
                        }
                        if((model.loanAccount.currentStage == 'DSCApproval') && (typeof model.loanProcess.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5 =="undefined" || model.loanProcess.loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf5 == null)){
                            model.loanAccount.loanMitigants=[];
                            PageHelper.showErrors({data:{error:"DSC STATUS IS REQUIRED...."}});
                                PageHelper.showProgress('enrolment','Oops. Some error.', 5000);
                                PageHelper.hideLoader();
                                return false;
                        }
                        if(model.loanAccount.currentStage=='DSCOverride'){
                            model.loanProcess.stage='DSCApproval';
                        }
                        /* ornamentsAppraisals */
                        if (_.hasIn(model.loanAccount, 'ornamentsAppraisals') && _.isArray(model.loanAccount.ornamentsAppraisals)){
                            for (var i=0; i<model.loanAccount.ornamentsAppraisals.length; i++){
                               model.loanAccount.ornamentsAppraisals[i].ratePerGramInPaisa=model.loanAccount.ornamentsAppraisals[i].ratePerGramInPaisa*100;
                               model.loanAccount.ornamentsAppraisals[i].marketValueInPaisa=model.loanAccount.ornamentsAppraisals[i].marketValueInPaisa*100;                      
                            }
                        }
                        model.mitigationCheked = false
                        if(model.deviationMitigants){
                            _.forEach(model.deviationMitigants,function(mitigation){
                                if(mitigation.currentMitigation && !mitigation.mitigatedStatus){
                                    model.mitigationCheked = true
                                    //return false;  
                                }
                            })
                        }
                        if(model.mitigationCheked){
                            PageHelper.showErrors({data:{error:"Mitigation checkbox, Please check this box if you want to proceed"}});
                            return false;
                        }
                        if(model.deviationMitigants){
                            _.forEach(model.deviationMitigants,function(mitigation){
                                if (!_.hasIn(model.loanAccount.loanMitigants, mitigation.id))
                                {
                                    model.loanAccount.loanMitigants.push(mitigation)
                                } 
                            })
                        }
                        setDeviation(model);
                        /* ornamentsAppraisals */
                        PageHelper.showLoader();
                        PageHelper.showProgress('enrolment', 'Updating Loan');
                        model.loanProcess.proceed(model.loanProcess.stage)
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                model.loanAccount.loanMitigants=[];
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });
                    },
                    reject: function(model, formCtrl, form, $event){
                        if ( model.loanProcess.remarks==null ||  model.loanProcess.remarks =="" ||  model.loanAccount.rejectReason==null ||  model.loanAccount.rejectReason==""){
                            PageHelper.showProgress("update-loan", "Reject Reason / Remarks is mandatory");
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
