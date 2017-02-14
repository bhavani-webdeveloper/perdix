irf.pageCollection.factory(irf.page("loans.individual.screening.LoanRequest"),
["$log", "$q","LoanAccount","LoanProcess", 'Scoring', 'Enrollment', 'AuthTokenHelper', 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
"BundleManager", "PsychometricTestService", "LeadHelper",
function($log, $q, LoanAccount,LoanProcess, Scoring, Enrollment, AuthTokenHelper, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
    BundleManager, PsychometricTestService, LeadHelper){

    var branch = SessionStore.getBranch();

    var validateForm = function(formCtrl){
        formCtrl.scope.$broadcast('schemaFormValidate');
        if (formCtrl && formCtrl.$invalid) {
            PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
            return false;
        }
        return true;
    }

    var getRelationFromClass = function(relation){
        if (relation == 'guarantor'){
            return 'Guarantor';
        } else if (relation == 'applicant'){
            return 'Applicant';
        } else if (relation == 'co-applicant'){
            return 'Co-Applicant';
        }
    }

    var preLoanSaveOrProceed = function(model){
        var loanAccount = model.loanAccount;

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
            var enterpriseCustomerRelations = model.enterprise.enterpriseCustomerRelations;
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
            }
        }
        
        return true;
    }

    var validateAndPopulateMitigants = function(model){
        delete model.loanAccount.loanMitigants;
        model.loanAccount.loanMitigants = [];
        if (model.deviations && model.deviations.deviationParameter && model.deviations.deviationParameter.length>0){
            for (i=0; i<model.deviations.deviationParameter.length; i++){
                if(model.deviations.deviationParameter[i].mitigants && model.deviations.deviationParameter[i].mitigants.length>0){
                    for (k=0;k<model.deviations.deviationParameter[i].mitigants.length; k++){
                        if(model.deviations.deviationParameter[i].mitigants[k].selected){
                            model.loanAccount.loanMitigants.push({
                                parameter:model.deviations.deviationParameter[i].Parameter,
                                riskScore:model.deviations.scoreName,
                                mitigant:model.deviations.deviationParameter[i].mitigants[k].mitigantName
                            });
                        }
                    }
                }
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

    var navigateToQueue = function(model){
        if(model.currentStage=='Screening')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ScreeningQueue', pageId:null});
        if(model.currentStage=='ScreeningReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ScreeningReviewQueue', pageId:null});
        if(model.currentStage=='Application')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ApplicationQueue', pageId:null});
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
        if (model.currentStage == 'Rejected')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.RejectedQueue', pageId:null});
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
            model.review = model.review|| {};
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

            if (_.hasIn(model, 'loanAccount')){
                $log.info('Printing Loan Account');
                IndividualLoan.loanRemarksSummary({id: model.loanAccount.id})
                .$promise
                .then(function (resp){
                    model.loanSummary = resp;
                    if(model.loanSummary && model.loanSummary.length)
                    {
                        for(i=0;i<model.loanSummary.length;i++)
                        {
                            if(model.loanSummary[i].postStage=="Rejected")
                            {
                                if(model.currentStage=='Rejected')
                                {
                                    model.review.targetStage = model.loanSummary[i].preStage;
                                }
                            }
                        }

                    }
                },function (errResp){

                });
            }


            BundleManager.broadcastEvent('loan-account-loaded', {loanAccount: model.loanAccount});
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
            },
            "lead-loaded": function(bundleModel, model, obj) {
                model.lead = obj;
                model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                model.loanAccount.screeningDate = obj.screeningDate;
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
                model.enterprise = params.customer;
            },
            "business-loaded": function(bundleModel, model, params){
                $log.info("Inside updated Enterprise of LoanRequest");
                model.enterprise = params;
                if(model.enterprise.urnNo)
                {
                 $log.info("printing loan urn of the customer");
                 $log.info(model.enterprise.urnNo);
                }
            },
            "applicant-updated": function(bundleModel, model, param){
                $log.info("INside updated Applicant of LoanRequest");
                model.applicant = param;
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
                        'relation': "Guarantor",
                        'urn': params.customer.urnNo
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
            "cibil-highmark-mandatory-settings": function(bundleModel, model, settings){
                $log.info("Inside cibil-highmark-mandatory-settings");
                model.cibilHighmarkMandatorySettings = settings;
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

                // if(model.deviations.deviationParameter && model.deviations.deviationParameter.length==0)
                //    delete model.loanAccount.loanMitigants; 
                // else
                // {
                //     if(model.loanAccount.loanMitigants && model.loanAccount.loanMitigants.length > 0){
                //         for (i=0; i<model.deviations.deviationParameter.length; i++){
                //             for (j=0; j<model.loanAccount.loanMitigants.length; j++){
                //                 if(model.deviations.deviationParameter[i].Parameter == model.loanAccount.loanMitigants[j].parameter && model.loanAccount.loanMitigants[j].riskScore == model.deviations.scoreName){
                //                     if(model.deviations.deviationParameter[i].mitigants && model.deviations.deviationParameter[i].mitigants.length>0){
                //                         for (k=0; k<model.deviations.deviationParameter[i].mitigants.length; k++){
                //                             if(model.deviations.deviationParameter[i].mitigants[k].mitigantName == model.loanAccount.loanMitigants[j].mitigant){
                //                                 model.deviations.deviationParameter[i].mitigants[k].selected = true;
                //                                 break;
                //                             }
                //                         }
                //                     }
                //                 }
                //             }
                //         }
                //     }
                // }
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
            }
        },
        form: [
            {
                "type": "box",
                "title": "PRELIMINARY_INFORMATION",
                "condition":"model.currentStage=='Screening' || model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                "items": [
                    {
                        key:"loanAccount.linkedAccountNumber",
                        title:"LINKED_ACCOUNT_NUMBER",
                        type:"lov",
                        autolov: true,
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var promise = LoanProcess.viewLoanaccount(
                            {
                                urn: model.enterprise.urnNo
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(item, index) {
                            $log.info(item);
                            return [
                                item.accountId,
                                item.glSubHead,
                                item.amount,
                                item.npa,
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            model.loanAccount.npa = valueObj.npa;
                            model.loanAccount.linkedAccountNumber = valueObj.accountId;
                        }
                        
                    },
                    {
                        key: "loanAccount.npa",
                        title: "IS_NPA",
                    },
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
                    // {
                    //     key: "loanAccount.assetAvailableForHypothecation",
                    //     type: "select",
                    //     required:true,
                    //     enumCode: "decisionmaker",
                    //     title: "ASSET_AVAILABLE_FOR_HYPOTHECATION"
                    // },
                    // {
                    //     key: "loanAccount.estimatedValueOfAssets",
                    //     type: "amount",
                    //     required:true,
                    //     condition: "model.loanAccount.assetAvailableForHypothecation=='YES'",
                    //     title: "ESTIMATED_VALUE_OF_ASSETS"
                    // },
                    {
                        key: "loanAccount.loanAmountRequested",
                        type: "amount",
                        required:true,
                        title: "REQUESTED_LOAN_AMOUNT",
                        onChange:function(value,form,model){
                            computeEstimatedEMI(model);
                        }
                    },
                    {
                        key: "loanAccount.frequencyRequested",
                        type: "select",
                        title: "FREQUENCY_REQUESTED",
                        enumCode: "frequency",
                        onChange:function(value,form,model){
                            computeEstimatedEMI(model);
                        }
                    },
                    {
                        key: "loanAccount.tenureRequested",
                        required:true,
                        type: "number",
                        title: "TENURE_REQUESETED",
                        onChange:function(value,form,model){
                            computeEstimatedEMI(model);
                        }
                    },
                    {
                        key: "loanAccount.expectedInterestRate",
                        type: "number",
                        title: "EXPECTED_INTEREST_RATE",
                        onChange:function(value,form,model){
                            computeEstimatedEMI(model);
                        }
                    },
                    {
                        key: "loanAccount.estimatedEmi",
                        type: "amount",
                        title: "ESTIMATED_KINARA_EMI",
                        readonly:true
                    },
                    {
                        key: "loanAccount.emiRequested",
                        required:true,
                        type: "amount",
                        title: "EMI_REQUESTED"
                    },
                    {
                        key: "loanAccount.emiPaymentDateRequested",
                        type: "select",
                        titleMap: {
                                        "5th": "5th",
                                        "10th": "10th",
                                        "15th": "15th",
                                    },
                        title: "EMI_PAYMENT_DATE_REQUESTED"
                    },
                    {
                        key: "loanAccount.expectedPortfolioInsurancePremium",
                        title: "EXPECTED_PORTFOLIO_INSURANCE_PREMIUM",
                        readonly:true
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
                "title": "PRELIMINARY_INFORMATION",
                "condition": "model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
                
                "items": [
                    {
                        key:"loanAccount.linkedAccountNumber",
                        title:"LINKED_ACCOUNT_NUMBER",
                        type:"lov",
                        autolov: true,
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var promise = LoanProcess.viewLoanaccount(
                            {
                                urn: model.enterprise.urnNo
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(item, index) {
                            $log.info(item);
                            return [
                                item.accountId,
                                item.glSubHead,
                                item.amount,
                                item.npa,
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            model.loanAccount.npa = valueObj.npa;
                            model.loanAccount.linkedAccountNumber = valueObj.accountId;
                        }
                        
                    },
                    {
                        key: "loanAccount.npa",
                        title: "IS_NPA",
                    },
                    {
                        key: "loanAccount.loanPurpose1",
                        type: "lov",
                        readonly:true,
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
                        readonly:true,
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
                    // {
                    //     key: "loanAccount.assetAvailableForHypothecation",
                    //     type: "string",
                    //     title: "ASSET_AVAILABLE_FOR_HYPOTHECATION"
                    // },
                    // {
                    //     key: "loanAccount.estimatedValueOfAssets",
                    //     type: "amount",
                    //     condition: "model.loanAccount.assetAvailableForHypothecation=='YES'",
                    //     title: "ESTIMATED_VALUE_OF_ASSETS"
                    // },
                    {
                        key: "loanAccount.loanAmountRequested",
                        type: "amount",
                        readonly:true,
                        title: "REQUESTED_LOAN_AMOUNT"
                    },
                    {
                        key: "loanAccount.frequencyRequested",
                        type: "select",
                        readonly:true,
                        title: "FREQUENCY_REQUESTED",
                        enumCode: "frequency"
                    },
                    {
                        key: "loanAccount.tenureRequested",
                        type: "number",
                        readonly:true,
                        title: "TENURE_REQUESETED"
                    },
                    {
                        key: "loanAccount.expectedInterestRate",
                        type: "number",
                        readonly:true,
                        title: "EXPECTED_INTEREST_RATE"
                    },
                    {
                        key: "loanAccount.estimatedEmi",
                        type: "amount",
                        title: "ESTIMATED_KINARA_EMI",
                        readonly:true
                    },
                    {
                        key: "loanAccount.emiRequested",
                        type: "string",
                        readonly:true,
                        title: "EMI_REQUESTED"
                    },
                    {
                        key: "loanAccount.emiPaymentDateRequested",
                        type: "string",
                        readonly:true,
                        title: "EMI_PAYMENT_DATE_REQUESTED"
                    },
                    {
                        key: "loanAccount.expectedPortfolioInsurancePremium",
                        title: "EXPECTED_PORTFOLIO_INSURANCE_PREMIUM",
                        readonly:true
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
                "title": "DEDUCTIONS_FROM_LOANAMOUNT",
                "condition": "model.currentStage=='Screening' || model.currentStage=='Application'",
                "items": [
                    {
                        key: "loanAccount.expectedProcessingFeePercentage",
                        "type": "number",
                        "title": "EXPECTED_PROCESSING_FEES_IN_PERCENTAGE"
                    },
                    {
                       key: "loanAccount.expectedCommercialCibilCharge",
                       "type": "amount",
                        "title": "EXPECTED_COMMERCIAL_CIBIL_CHARGE"
                    },
                    {
                       key: "loanAccount.estimatedEmi",
                       "type": "amount",
                        "title": "EXPECTED_SECURITY_EMI",
                        readonly:true
                    }
                ]
            },
            {
                "type": "box",
                "title": "DEDUCTIONS_FROM_LOANAMOUNT",
                "condition": "model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage=='FieldAppraisal' || model.currentStage=='FieldAppraisalReview' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
                readonly:true,
                "items": [
                    {
                        key: "loanAccount.expectedProcessingFeePercentage",
                        "type": "number",
                        "title": "EXPECTED_PROCESSING_FEES_IN_PERCENTAGE"
                    },
                    {
                       key: "loanAccount.expectedCommercialCibilCharge",
                       "type": "amount",
                        "title": "EXPECTED_COMMERCIAL_CIBIL_CHARGE"
                    },
                    {
                       key: "loanAccount.estimatedEmi",
                       "type": "amount",
                        "title": "EXPECTED_SECURITY_EMI",
                        readonly:true
                    }
                ]
            },

        /*{
            "type": "box",
            "title": "LOAN_MITIGANTS",
            "condition": "model.currentStage=='Screening' || model.currentStage=='Application'||model.currentStage=='FieldAppraisal'",
            readonly:true,
            "items": [{
                key: "loanAccount.loanMitigants",
                type: "array",
                startEmpty: true,
                title: "LOAN_MITIGANTS",
                items: [{
                    key: "loanAccount.loanMitigants[].parameter",
                    title:"PARAMETER_NAME"
                }, 
                {
                    key: "loanAccount.loanMitigants[].mitigant",
                    title:"MITIGANT"
                }]
            }]
        },*/
        {
            "type": "box",
            "title": "LOAN_MITIGANTS",
            "condition": "model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview'||model.currentStage=='FieldAppraisalReview'",
            "items": [{
                key: "deviations.deviationParameter",
                type: "array",
                startEmpty: true,
                add:null,
                remove:null,
                "view":"fixed",
                "titleExpr": "model.deviations.deviationParameter[arrayIndex].Parameter",
                items: [{
                    key: "deviations.deviationParameter[].mitigants",
                    type: "array",
                    startEmpty: true,
                    add:null,
                    remove:null,
                    notitle:true,
                    "view":"fixed",
                    items: [{
                        "type":"section",
                        "htmlClass": "row",
                        "items":[{
                            "type": "section",
                            "htmlClass": "col-xs-2 col-md-2",
                            "items": [{
                                key:"deviations.deviationParameter[].mitigants[].selected",
                                type: "checkbox",
                                schema: {
                                    default:false
                                }
                            }]
                        },
                        {
                            "type": "section",
                            "htmlClass": "col-xs-10 col-md-10",
                            "items": [{
                                key: "deviations.deviationParameter[].mitigants[].mitigantName",
                                type:"textarea",
                                readonly:true
                            }]
                        }]
                    }]
                }]
            }]
        },
        // {
        //     "type": "box",
        //     "title": "LOAN_MITIGANTS",
        //     "condition": "model.currentStage=='Screening' || model.currentStage=='Application'||model.currentStage=='FieldAppraisal'",
        //     readonly:true,
        //     "items": [{
        //         key: "loanAccount.loanMitigants",
        //         type: "array",
        //         startEmpty: true,
        //         add:null,
        //         remove:null,
        //         "view":"fixed",
        //         "titleExpr": "model.loanAccount.loanMitigants[arrayIndex].parameter",
        //         items: [{
        //             key: "loanAccount.loanMitigants[].mitigant",
        //             "type":"textarea"
        //         }]
        //     }]
        // },
        {
            "type": "box",
            "title": "LOAN_MITIGANTS",
            "condition": "model.currentStage=='Screening' || model.currentStage=='Application'||model.currentStage=='FieldAppraisal'",
            readonly:true,
            "items": [{
                key: "loanMitigantsByParameter",
                type: "array",
                startEmpty: true,
                add:null,
                remove:null,
                "view":"fixed",
                "titleExpr": "model.loanMitigantsByParameter[arrayIndex].Parameter",
                items: [{
                    key: "loanMitigantsByParameter[].Mitigants",
                    "type":"section",
                    "html": "<div ng-bind-html='model.loanMitigantsByParameter[arrayIndex].Mitigants'></div>    "
                }]
            }]
        },
        {
            "type": "box",
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
                }
            ]
            
        },

            {
                "type": "box",
                "title": "ADDITIONAL_LOAN_INFORMATION",
                "condition": "model.currentStage=='Application' || model.currentStage=='FieldAppraisal' || model.currentStage == 'SanctionInput'",
                "items": [
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
                       required:true,
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
                        type: "string",
                        required:true,
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
                "title": "ADDITIONAL_LOAN_INFORMATION",
                readonly:true,
                "condition": "model.currentStage=='ApplicationReview' || model.currentStage=='FieldAppraisalReview' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
                "items": [
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
                       required:true,
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
                        type: "string",
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
                "title": "ADDITIONAL_LOAN_INFORMATION",
                readonly:true,
                "condition": "model.currentStage=='Sanction' ",
                "items": [
                    {
                        key: "loanAccount.estimatedDateOfCompletion",
                        type: "date",
                        title: "ESTIMATED_DATE_OF_COMPLETION"
                    },
                    {
                        key: "loanAccount.customerSignDateExpected",
                        type: "date",
                        title: "CUSTOMER_SIGN_DATE_EXPECTED"
                    },
                    {
                        key: "loanAccount.proposedHires",
                        type: "string",
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
                "condition": "model.loanAccount.loanPurpose1=='Asset Purchase' && (model.currentStage=='Application' || model.currentStage=='FieldAppraisal')",
                "items": [
                    {
                      key:"loanAccount.collateral",
                       type:"array",
                       startEmpty: true,
                       title:"ASSET_DETAILS",
                       items:[
                            {
                                key: "loanAccount.collateral[].collateralDescription",
                                title:"MACHINE",
                                required:true,
                                type: "string"
                            },
                            {
                                key: "loanAccount.collateral[].collateralValue",
                                title:"PURCHASE_PRICE",
                                required:true,
                                type: "number",
                            },
                            // {
                            //     key: "loanAccount.collateral[].quantity",
                            //     title:"QUANTITY",
                            //     required:true,
                            //     readonly: true,
                            //     type: "number",
                            // },
                            {
                                key: "loanAccount.collateral[].expectedIncome",
                                title:"EXPECTED_INCOME",
                                required:true,
                                type: "number",
                            },
                            {
                                key: "loanAccount.collateral[].collateralType",
                                title:"MACHINE_TYPE",
                                required:true,
                                type: "select",
                                enumCode: "collateral_type"
                            },
                            {
                                key: "loanAccount.collateral[].manufacturer",
                                title:"MANFACTURE_NAME",
                                required:true,
                                type: "string",
                            },
                            {
                                key: "loanAccount.collateral[].modelNo",
                                title:"MACHINE_MODEL",
                                required:true,
                                type: "string",
                            },
                            {
                                key: "loanAccount.collateral[].serialNo",
                                title:"SERIAL_NO",
                                type: "string",
                            },
                            {
                                key: "loanAccount.collateral[].expectedPurchaseDate",
                                title:"EXPECTED_PURCHASE_DATE",
                                required:true,
                                "type": "date",
                                //"format": 'dd-mm-yyyy',
                                "minDate": SessionStore.getCBSDate(),
                            },
                            {
                                key: "loanAccount.collateral[].machineAttachedToBuilding",
                                title:"MACHINE_PERMANENTLY_FIXED_TO_BUILDING",
                                type: "select",
                                required:true,
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "loanAccount.collateral[].hypothecatedToBank",
                                title:"HYPOTHECATED_TO_KINARA",
                                required:true,
                                enumCode: "decisionmaker",
                                type: "select",
                            },
                            {
                             key: "loanAccount.collateral[].electricityAvailable",
                             title: "ELECTRICITY_AVAIALBLE",
                             type: "select",
                             enumCode: "decisionmaker",
                             required: true
                            }, 
                            {
                             key: "loanAccount.collateral[].spaceAvailable",
                             title: "SPACE_AVAILABLE",
                             type: "select",
                             enumCode: "decisionmaker",
                             required: true
                            }

                         ]
                     }
                ]
            },
            {
                "type": "box",
                "title": "NEW_ASSET_DETAILS",
                "readonly": true,
                "condition": "model.loanAccount.loanPurpose1=='Asset Purchase' && (model.currentStage=='ApplicationReview' || model.currentStage=='FieldAppraisalReview' || model.currentStage=='Sanction'  || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview'||model.currentStage == 'Rejected'||model.currentStage == 'loanView')",
                "items": [
                    {
                      key:"loanAccount.collateral",
                       type:"array",
                       startEmpty: true,
                       title:"ASSET_DETAILS",
                       items:[
                            {
                                key: "loanAccount.collateral[].collateralDescription",
                                title:"MACHINE",
                               
                                type: "string"
                            },
                            {
                                key: "loanAccount.collateral[].collateralValue",
                                title:"PURCHASE_PRICE",
                                type: "number",
                            },
                            // {
                            //     key: "loanAccount.collateral[].quantity",
                            //     title:"QUANTITY",
                            //     type: "number",
                            // },
                            {
                                key: "loanAccount.collateral[].expectedIncome",
                                title:"EXPECTED_INCOME",
                               
                                type: "number",
                            },
                            {
                                key: "loanAccount.collateral[].collateralType",
                                title:"MACHINE_TYPE",
                                
                                type: "select",
                                enumCode: "collateral_type"
                            },
                            {
                                key: "loanAccount.collateral[].manufacturer",
                                title:"MANFACTURE_NAME",
                             
                                type: "string",
                            },
                            {
                                key: "loanAccount.collateral[].modelNo",
                                title:"MACHINE_MODEL",
                               
                                type: "string",
                            },
                            {
                                key: "loanAccount.collateral[].serialNo",
                                title:"SERIAL_NO",
                                type: "string",
                            },
                            {
                                key: "loanAccount.collateral[].expectedPurchaseDate",
                                title:"EXPECTED_PURCHASE_DATE",
                                type: "date",
                            },
                            {
                                key: "loanAccount.collateral[].machineAttachedToBuilding",
                                title:"MACHINE_PERMANENTLY_FIXED_TO_BUILDING",
                                type: "string",
                            },
                            {
                                key: "loanAccount.collateral[].hypothecatedToBank",
                                title:"HYPOTHECATED_TO_KINARA",
                                type: "string",
                            },
                            {
                             key: "loanAccount.collateral[].electricityAvailable",
                             title: "ELECTRICITY_AVAIALBLE",
                             type: "string",
                            }, 
                            {
                             key: "loanAccount.collateral[].spaceAvailable",
                             title: "SPACE_AVAILABLE",
                             type: "string",
                            
                            }
                         ]
                     }
                ]
            },
            {
                "type": "box",
                "title": "NOMINEE_DETAILS",
                "condition": "model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                "items": [
                    {
                        "key":"loanAccount.nominees",
                        "type":"array",
                        notitle:"true",
                        "view":"fixed",
                        "add":null,
                        "remove":null,
                        "items":[
                            {
                                key:"loanAccount.nominees[].nomineeFirstName",
                                "title":"NAME",
                                "type":"lov",
                                "lovonly": false,
                                "inputMap": {
                                },
                                "outputMap": {
                                    "nomineeFirstName": "loanAccount.nominees[arrayIndex].nomineeFirstName",
                                    "nomineeGender":"loanAccount.nominees[arrayIndex].nomineeGender",
                                    "nomineeDOB":"loanAccount.nominees[arrayIndex].nomineeDOB"
                                },
                                "searchHelper": formHelper,
                                "search": function(inputModel, form, model, context) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Queries.getFamilyRelations({'loanId':model.loanAccount.id}).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        data.nomineeFirstName,
                                        data.nomineeGender,
                                        data.nomineeDOB
                                    ];
                                }
                            },
                            {
                                key:"loanAccount.nominees[].nomineeGender",
                                type:"select",
                                "title":"GENDER"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeDOB",
                                type:"date",
                                "title":"DATE_OF_BIRTH"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeDoorNo",
                                "title":"DOOR_NO"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeLocality",
                                "title":"LOCALITY"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeStreet",
                                "title":"STREET"
                            },
                            {
                                key: "loanAccount.nominees[].nomineePincode",
                                type: "lov",
                                "title":"PIN_CODE",
                                fieldType: "number",
                                autolov: true,
                                inputMap: {
                                    "pincode": {
                                        key:"loanAccount.nominees[].nomineePincode"
                                    },
                                    "district": {
                                        key: "loanAccount.nominees[].nomineeDistrict"
                                    },
                                    "state": {
                                        key: "loanAccount.nominees[].nomineeState"
                                    }
                                },
                                outputMap: {
                                    "division": "loanAccount.nominees[arrayIndex].nomineeLocality",
                                    "pincode": "loanAccount.nominees[arrayIndex].nomineePincode",
                                    "district": "loanAccount.nominees[arrayIndex].nomineeDistrict",
                                    "state": "loanAccount.nominees[arrayIndex].nomineeState"
                                },
                                searchHelper: formHelper,
                                initialize: function(inputModel, form, model, context) {
                                    inputModel.pincode = model.loanAccount.nominees[context.arrayIndex].nomineePincode;
                                },
                                search: function(inputModel, form, model, context) {
                                    return Queries.searchPincodes(
                                        inputModel.pincode || model.loanAccount.nominees[context.arrayIndex].nomineePincode,
                                        inputModel.district,
                                        inputModel.state
                                    );
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.division + ', ' + item.region,
                                        item.pincode,
                                        item.district + ', ' + item.state
                                    ];
                                }
                            },
                            {
                                key:"loanAccount.nominees[].nomineeDistrict",
                                type:"text",
                                "title":"DISTRICT"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeState",
                                "title":"STATE"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeRelationship",
                                type:"select",
                                "title":"RELATIONSHIP"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "box",
                "title": "NOMINEE_DETAILS",
                "condition": "model.currentStage=='ApplicationReview' || model.currentStage=='FieldAppraisalReview' || model.currentStage=='Sanction'  || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
                readonly:true,
                "items": [
                    {
                        "key":"loanAccount.nominees",
                        "type":"array",
                        notitle:"true",
                        "view":"fixed",
                        "add":null,
                        "remove":null,
                        "items":[
                            {
                                key:"loanAccount.nominees[].nomineeFirstName",
                                "title":"NAME",
                                "type":"lov",
                                "lovonly": false,
                                "inputMap": {
                                },
                                "outputMap": {
                                    "nomineeFirstName": "loanAccount.nominees[arrayIndex].nomineeFirstName",
                                    "nomineeGender":"loanAccount.nominees[arrayIndex].nomineeGender",
                                    "nomineeDOB":"loanAccount.nominees[arrayIndex].nomineeDOB"
                                },
                                "searchHelper": formHelper,
                                "search": function(inputModel, form, model, context) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Queries.getFamilyRelations({'loanId':model.loanAccount.id}).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        data.nomineeFirstName,
                                        data.nomineeGender,
                                        data.nomineeDOB
                                    ];
                                }
                            },
                            {
                                key:"loanAccount.nominees[].nomineeGender",
                                type:"select",
                                "title":"GENDER"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeDOB",
                                type:"date",
                                "title":"DATE_OF_BIRTH"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeDoorNo",
                                "title":"DOOR_NO"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeLocality",
                                "title":"LOCALITY"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeStreet",
                                "title":"STREET"
                            },
                            {
                                key: "loanAccount.nominees[].nomineePincode",
                                type: "lov",
                                "title":"PIN_CODE",
                                fieldType: "number",
                                autolov: true,
                                inputMap: {
                                    "pincode": {
                                        key:"loanAccount.nominees[].nomineePincode"
                                    },
                                    "district": {
                                        key: "loanAccount.nominees[].nomineeDistrict"
                                    },
                                    "state": {
                                        key: "loanAccount.nominees[].nomineeState"
                                    }
                                },
                                outputMap: {
                                    "division": "loanAccount.nominees[arrayIndex].nomineeLocality",
                                    "pincode": "loanAccount.nominees[arrayIndex].nomineePincode",
                                    "district": "loanAccount.nominees[arrayIndex].nomineeDistrict",
                                    "state": "loanAccount.nominees[arrayIndex].nomineeState"
                                },
                                searchHelper: formHelper,
                                initialize: function(inputModel, form, model, context) {
                                    inputModel.pincode = model.loanAccount.nominees[context.arrayIndex].nomineePincode;
                                },
                                search: function(inputModel, form, model, context) {
                                    return Queries.searchPincodes(
                                        inputModel.pincode || model.loanAccount.nominees[context.arrayIndex].nomineePincode,
                                        inputModel.district,
                                        inputModel.state
                                    );
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.division + ', ' + item.region,
                                        item.pincode,
                                        item.district + ', ' + item.state
                                    ];
                                }
                            },
                            {
                                key:"loanAccount.nominees[].nomineeDistrict",
                                type:"text",
                                "title":"DISTRICT"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeState",
                                "title":"STATE"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeRelationship",
                                type:"select",
                                "title":"RELATIONSHIP"
                            }
                        ]
                    }
                ]
            }
            /*,
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
                "type": "box",
                "title": "LOAN_RECOMMENDATION",
                "condition": "model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview'||model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview'",
                "items": [
                {
                    "key": "loanAccount.loanAmount",
                    "type": "amount",
                    required:true,
                    "title": "LOAN_AMOUNT",
                    onChange:function(value,form,model){
                        computeEMI(model);
                    }
                },
                {
                    "key": "loanAccount.tenure",
                    "title":"DURATION_IN_MONTHS",
                    required:true,
                    onChange:function(value,form,model){
                        computeEMI(model);
                    }
                },
                {
                    "key": "loanAccount.interestRate",
                    "type": "number",
                    required:true,
                    "title": "INTEREST_RATE",
                    onChange:function(value,form,model){
                        computeEMI(model);
                    }
                },
                {
                    key: "loanAccount.estimatedEmi",
                    type: "amount",
                    title: "ESTIMATED_KINARA_EMI",
                    readonly:true
                },
                {
                    "key": "loanAccount.processingFeePercentage",
                    "type": "number",
                    required:true,
                    "title": "PROCESSING_FEES_IN_PERCENTAGE"
                },
                {
                   key: "loanAccount.estimatedEmi",
                   "type": "amount",
                    "title": "EXPECTED_SECURITY_EMI",
                    readonly:true
                },
                {
                    "key": "loanAccount.securityEmiRequired",
                    "condition": "model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
                    'enumCode': "decisionmaker",
                    'type': "select",
                    "title": "SECURITY_EMI_REQUIRED",
                    // readonly:true,
                    required: true
                },
                {
                    "key": "loanAccount.commercialCibilCharge",
                    "type": "amount",
                    "title": "COMMERCIAL_CIBIL_CHARGE"
                }]
            },
            {
                "type": "box",
                "title": "LOAN_RECOMMENDATION",
                "condition": "model.currentStage=='Sanction'",
                "readonly": true,
                "items": [
                {
                    "key": "loanAccount.loanAmount",
                    "type": "amount",
                    required:true,
                    "title": "LOAN_AMOUNT",
                    onChange:function(value,form,model){
                        computeEMI(model);
                    }
                },
                {
                    "key": "loanAccount.tenure",
                    "title":"DURATION_IN_MONTHS",
                    required:true,
                    onChange:function(value,form,model){
                        computeEMI(model);
                    }
                },
                {
                    "key": "loanAccount.interestRate",
                    "type": "number",
                    required:true,
                    "title": "INTEREST_RATE",
                    onChange:function(value,form,model){
                        computeEMI(model);
                    }
                },
                {
                    key: "loanAccount.estimatedEmi",
                    type: "amount",
                    title: "ESTIMATED_KINARA_EMI",
                    readonly:true
                },
                {
                    "key": "loanAccount.processingFeePercentage",
                    "type": "number",
                    required:true,
                    "title": "PROCESSING_FEES_IN_PERCENTAGE"
                },
                {
                   key: "loanAccount.estimatedEmi",
                   "type": "amount",
                    "title": "EXPECTED_SECURITY_EMI",
                    readonly:true
                },
                {
                    "key": "loanAccount.securityEmiRequired",
                    'enumCode': "decisionmaker",
                    'type': "select",
                    "title": "SECURITY_EMI_REQUIRED",
                    // readonly:true,
                    required: true
                },
                {
                    "key": "loanAccount.commercialCibilCharge",
                    "type": "amount",
                    "title": "COMMERCIAL_CIBIL_CHARGE"
                }]
            },
            {
                "type": "box",
                "title": "LOAN_SANCTION",
                "condition": "model.currentStage == 'Sanction'",
                "items": [
                    
                    // {
                    //     "key": "loanAccount.loanAmount",
                    //     "type": "amount",
                    //     "title": "LOAN_AMOUNT",
                    //     readonly:true
                    // },
                    // {
                    //     "key": "loanAccount.processingFeePercentage",
                    //     "type": "number",
                    //     "title": "PROCESSING_FEES_IN_PERCENTAGE",
                    //     readonly:true
                    // },
                    // {
                    //     "key": "loanAccount.commercialCibilCharge",
                    //     "type": "amount",
                    //     "title": "COMMERCIAL_CIBIL_CHARGE",
                    //     readonly:true
                    // },
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
                    // {
                    //     "key": "loanAccount.tenure",
                    //     "title":"DURATION_IN_MONTHS",
                    //     readonly:true
                    // },
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
                "condition": "model.loanAccount.id && model.currentStage !== 'Rejected'&& model.currentStage !== 'loanView'",
                "items": [
                    {
                        key: "review.action",
                        condition: "model.currentStage !== 'Screening'",
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
                        condition: "model.currentStage == 'Screening'",
                        type: "radios",
                        titleMap: {
                            "REJECT": "REJECT",
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
                                key: "loanAccount.rejectReason",
                                type: "lov",
                                autolov: true,
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
                items: [{
                    title: "REMARKS",
                    key: "review.remarks",
                    type: "textarea",
                    required: true
                    }, 
                    { 
                    key: "review.targetStage",
                    type: "lov",
                    autolov: true,
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
                        model.review.targetStage = valueObj.name;
                    },
                    getListDisplayItem: function(item, index) {
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
                }]
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
            },

        {
            "type": "box",
            "title": "REJECT_REASON",
            "condition": "model.currentStage=='loanView'",
            "items": [{
                type: "section",
                items: [{
                    title: "Reject Reason",
                    key: "loanAccount.rejectReason",
                    readonly: true,
                    type: "textarea",
                }]
            }]
        },

            {
                "type": "box",
                "title": "REVERT_REJECT",
                "condition": "model.currentStage=='Rejected'", 
                "items": [
                {
                type: "section",
                items: [{
                    title: "REMARKS",
                    key: "review.remarks",
                    type: "textarea",
                    required: true
                },
                {
                    title: "Reject Reason",
                    key: "loanAccount.rejectReason",
                    readonly:true,
                    type: "textarea",
                },
                 {
                    key: "review.targetStage",
                    title: "SEND_BACK_TO_STAGE",
                    type: "lov",
                    autolov: true,
                    required: true,
                    searchHelper: formHelper,
                    search: function(inputModel, form, model, context) {
                        var stage1 = model.review.targetStage;
                        var targetstage = formHelper.enum('targetstage').data;
                        var out = [];
                        for (var i = 0; i < targetstage.length; i++) {
                            var t = targetstage[i];
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
                        model.review.targetStage = valueObj.name;
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
            },
            {
                "type": "actionbox",
                //"condition": "model.loanAccount.customerId  && !(model.currentStage=='ScreeningReview')",
                "condition": "model.loanAccount.customerId && model.currentStage !== 'loanView'",
                "items": [
                    {
                        "type": "button",
                        "icon": "fa fa-circle-o",
                        "title": "SAVE",
                        "onClick": "actions.save(model, formCtrl, form, $event)"
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
                PageHelper.clearErrors();
                /* TODO Call proceed servcie for the loan account */

                Utils.confirm("Are You Sure?").then(function(){

                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanAccount.status = '';
                    //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                    reqData.loanProcessAction = "PROCEED";
                    reqData.remarks = model.review.remarks;
                    PageHelper.showLoader();
                    if (model.currentStage == 'Sanction') {
                        reqData.stage = 'LoanInitiation';
                    }
                    PageHelper.showProgress("update-loan", "Working...");

                    // 
                   
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
                PageHelper.clearErrors();

                /* TODO Call save service for the loan */
                if(!validateAndPopulateMitigants(model)){
                    return;
                }
                if (!preLoanSaveOrProceed(model)){
                    return;
                }
                Utils.confirm("Are You Sure?")
                    .then(
                        function(){

                            var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                            reqData.loanAccount.status = '';
                            reqData.loanProcessAction = "SAVE";
                            //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                            // reqData.remarks = model.review.remarks;
                            reqData.loanAccount.screeningDate = reqData.loanAccount.screeningDate || Utils.getCurrentDate();
                            reqData.loanAccount.psychometricCompleted = reqData.loanAccount.psychometricCompleted || "N";
                            
                            
                            
                            PageHelper.showLoader();

                            var completeLead = false;
                            if (!_.hasIn(reqData.loanAccount, "id")){
                                completeLead = true;
                            }
                            IndividualLoan.create(reqData)
                                .$promise
                                .then(function(res){
                                    model.loanAccount = res.loanAccount;
                                    BundleManager.pushEvent('new-loan', model._bundlePageObj, {loanAccount: model.loanAccount});
                                    if (completeLead===true && _.hasIn(model, "lead.id")){
                                        var reqData = {
                                            lead: _.cloneDeep(model.lead),
                                            stage: "Completed"
                                        }

                                        reqData.lead.leadStatus = "Complete";
                                        LeadHelper.proceedData(reqData)
                                    }
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
                PageHelper.clearErrors();
                /* TODO Call save service for the loan */

                if (!preLoanSaveOrProceed(model)){
                    return;
                }

                if (model.review.remarks==null || model.review.remarks ==""){
                    PageHelper.showProgress("update-loan", "Remarks is mandatory");
                    return false;
                }
                
                Utils.confirm("Are You Sure?")
                    .then(
                        function(){

                            

                            var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                            reqData.loanAccount.status = 'HOLD';
                            reqData.loanProcessAction = "SAVE";
                            //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
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
                PageHelper.clearErrors();
                
                if (model.review.remarks==null || model.review.remarks =="" || model.review.targetStage==null || model.review.targetStage==""){
                    PageHelper.showProgress("update-loan", "Send to Stage / Remarks is mandatory");
                    return false;
                }

                if (!preLoanSaveOrProceed(model)){
                    return;
                }
                Utils.confirm("Are You Sure?").then(function(){
                    
                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanAccount.status = '';
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
                PageHelper.clearErrors();
                /* TODO Call proceed servcie for the loan account */

                if (!validateForm(formCtrl)){
                    return;
                }
                if(!validateAndPopulateMitigants(model)){
                    return;
                }

                if(model.currentStage=='Screening'){
                    if(!validateCibilHighmark(model)){
                        return;
                    }
                }


                if (model.loanAccount.currentStage === 'Application' && model.loanAccount.psychometricCompleted != 'Completed') {
                    PageHelper.setError({message: "Psychometric Test is not completed. Cannot proceed"});
                    return;
                }

                if (model.currentStage == 'FieldAppraisal'){
                    if (!_.hasIn(model.applicant, 'stockMaterialManagement') || _.isNull(model.applicant.stockMaterialManagement)) {
                        PageHelper.showProgress('enrolment', 'Proxy Indicators are not input. Please check.')
                        return;
                    }
                }

                if(model.currentStage=='ScreeningReview'){
                    var commercialCheckFailed = false;
                    if(model.enterprise.enterpriseBureauDetails && model.enterprise.enterpriseBureauDetails.length>0){
                        for (var i = model.enterprise.enterpriseBureauDetails.length - 1; i >= 0; i--) {
                            if(!model.enterprise.enterpriseBureauDetails[i].fileId
                                || !model.enterprise.enterpriseBureauDetails[i].bureau
                                || model.enterprise.enterpriseBureauDetails[i].doubtful==null 
                                || model.enterprise.enterpriseBureauDetails[i].loss==null 
                                || model.enterprise.enterpriseBureauDetails[i].specialMentionAccount==null 
                                || model.enterprise.enterpriseBureauDetails[i].standard==null 
                                || model.enterprise.enterpriseBureauDetails[i].subStandard==null){
                                commercialCheckFailed = true;
                                break;
                            }
                        }
                    }
                    else
                        commercialCheckFailed = true;
                    if(commercialCheckFailed && model.enterprise.customerBankAccounts && model.enterprise.customerBankAccounts.length>0){
                        for (var i = model.enterprise.customerBankAccounts.length - 1; i >= 0; i--) {
                            if(model.enterprise.customerBankAccounts[i].accountType == 'OD' || model.enterprise.customerBankAccounts[i].accountType == 'CC'){
                                PageHelper.showProgress("enrolment","Commercial bureau check fields are mandatory",5000);
                                return false;
                            }
                        }
                    }
                }

                if (!preLoanSaveOrProceed(model)){
                    return;
                }

                Utils.confirm("Are You Sure?").then(function(){

                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanAccount.status = '';
                    //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                    reqData.loanProcessAction = "PROCEED";
                    reqData.remarks = model.review.remarks;
                    PageHelper.showLoader();
                    if (model.currentStage == 'Sanction') {
                        reqData.stage = 'LoanInitiation';
                    }
                    PageHelper.showProgress("update-loan", "Working...");

                    if (reqData.loanAccount.currentStage == 'Screening'){
                        return Scoring.get({
                            auth_token:AuthTokenHelper.getAuthData().access_token,
                            LoanId:reqData.loanAccount.id,
                            ScoreName: "RiskScore1"
                        })
                            .$promise
                            .finally(function(){
                                Queries.getQueryForScore1(reqData.loanAccount.id)
                                    .then(function(result){
                                        reqData.loanAccount.literateWitnessFirstName = result.cbScore;
                                        reqData.loanAccount.literateWitnessMiddleName = result.businessInvolvement;
                                    }, function(response){
                                            
                                    })
                                    .finally(function(){
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
                            })
                    }

                    var p1;
                    if (reqData.loanAccount.currentStage == 'Sanction'){
                        /* Auto population of Loan Collateral */
                        p1 = Enrollment.getCustomerById({id:model.loanAccount.customerId})
                            .$promise
                            .then(function(enterpriseCustomer){
                                model.availableMachines = [];
                                if (_.isArray(enterpriseCustomer.fixedAssetsMachinaries)){
                                    reqData.loanAccount.collateral = reqData.loanAccount.collateral || [];
                                    for (var i=0;i<enterpriseCustomer.fixedAssetsMachinaries.length; i++){
                                        var machine = enterpriseCustomer.fixedAssetsMachinaries[i];
                                        if (machine.hypothecatedToUs == "YES" || machine.hypothecatedToUs == "Yes"){
                                            var c = {
                                                collateralDescription: machine.machineDescription,
                                                collateralType: machine.machineType,
                                                manufacturer: machine.manufacturerName,
                                                modelNo: machine.machineModel,
                                                serialNo: machine.serialNumber,
                                                collateralValue: machine.purchasePrice,
                                                loanToValue: machine.presentValue,
                                                machineOld: !_.isNull(machine.isTheMachineNew)?!machine.isTheMachineNew:null,
                                                quantity: machine.quantity || 1
                                            }; 
                                            c.totalValue = c.quantity * c.loanToValue;
                                            reqData.loanAccount.collateral.push(c)
                                        }
                                    }    
                                }
                                
                            }, function(httpResponse){

                            });
                    }

                    $q.all([p1])
                        .finally(function(httpRes){
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
                    
                })
            },
            reject: function(model, formCtrl, form, $event){
                $log.info("Inside reject()");
                if (model.review.remarks==null || model.review.remarks ==""){
                    PageHelper.showProgress("update-loan", "Remarks is mandatory");
                    return false;
                }
                Utils.confirm("Are You Sure?").then(function(){

                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanAccount.status = 'REJECTED';
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
                            reqData.loanAccount.status = '';
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
