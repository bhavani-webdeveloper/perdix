irf.pageCollection.factory(irf.page("loans.individual.screening.LoanRequest"),
["$log", "$q","LoanAccount","LoanProcess", 'Scoring', 'Enrollment','EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
"BundleManager", "PsychometricTestService", "LeadHelper", "$filter", "Psychometric", "Messaging",
function($log, $q, LoanAccount,LoanProcess, Scoring, Enrollment,EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
    BundleManager, PsychometricTestService, LeadHelper, $filter, Psychometric, Messaging){

    var branch = SessionStore.getBranch();

    var validateForm = function(formCtrl){
        formCtrl.scope.$broadcast('schemaFormValidate');
        if (formCtrl && formCtrl.$invalid) {
            PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
            return false;
        }
        return true;
    }

    var getStageNameByStageCode = function(stageCode) {
        var stageName;
        switch(stageCode) {
            case 'Screening':
                stageName = $filter('translate')('SCREENING');
                break;
            case 'Dedupe':
                stageName = $filter('translate')('DEDUPE');
                break;
            case 'ScreeningReview':
                stageName = $filter('translate')('SCREENING_REVIEW');
                break;
            case 'Application':
                stageName = $filter('translate')('APPLICATION');
                break;
            case 'ApplicationReview':
                stageName = $filter('translate')('APPLICATION_REVIEW');
                break;
            case 'FieldAppraisal':
                stageName = $filter('translate')('FIELD_APPRAISAL');
                break;
            case 'FieldAppraisalReview':
                stageName = $filter('translate')('REGIONAL_RISK_REVIEW');
                break;
            case 'ZonalRiskReview':
                stageName = $filter('translate')('ZONAL_RISK_REVIEW');
                break;
            case 'CentralRiskReview':
                stageName = $filter('translate')('VP_CREDIT_RISK_REVIEW');
                break;
            case 'CreditCommitteeReview':
                stageName = $filter('translate')('CREDIT_COMITTEE_REVIEW');
                break;
            case 'Sanction':
                stageName = $filter('translate')('SANCTION');
                break;
            case 'Rejected':
                stageName = $filter('translate')('REJECTED');
                break;
            default:
                stageName = stageCode;
                break;
        }
        return stageName;
    };

    var checkPsychometricTestValidity = function(model){
        var deferred = $q.defer();
        Queries.getGlobalSettings('psychometricTestValidDays', true).then(function(resp) {
            var participantIds = [];
            var psychometricTestValidDays = angular.isDefined(resp) ? resp : 0;
            if (_.isArray(model.loanAccount.loanCustomerRelations)) {
                for (i in model.loanAccount.loanCustomerRelations) {
                    if ('YES' == model.loanAccount.loanCustomerRelations[i].psychometricRequired) {
                        participantIds.push(model.loanAccount.loanCustomerRelations[i].customerId);
                    }
                }
            }
            var setPsychometricForCustomerRelation = function(customerId, psychometricCompleted){
                for(var i=0; i < model.loanAccount.loanCustomerRelations.length; i++) {
                    if(model.loanAccount.loanCustomerRelations[i].customerId === customerId) {
                        model.loanAccount.loanCustomerRelations[i].psychometricCompleted = psychometricCompleted;
                    }
                }
            }
            if(participantIds.length > 0){
                Psychometric.findTests({'participantIds': participantIds}).$promise.then(function(resp){
                    var tests = resp;
                    var validParticipantsCount = 0;
                    var _testOfTheParticipant, testDate, diff;
                    if(tests.length === 0){
                        for(var idx = 0; idx < participantIds.length; idx++) {
                            setPsychometricForCustomerRelation(participantIds[idx], 'NO');
                        }
                    } else {
                        for(var idx = 0; idx < participantIds.length; idx++){
                            testCompleted = false;
                            _testOfTheParticipant = $filter('filter')(tests, {participantId: participantIds[idx]}, true);

                            if(_testOfTheParticipant.length === 0) {
                                setPsychometricForCustomerRelation(participantIds[idx], 'NO');
                            } else {
                                var hasValidTast = false;
                                for (var i = 0; i < _testOfTheParticipant.length; i++ ) {
                                    if (_testOfTheParticipant[i].submittedAt && moment().diff(moment(_testOfTheParticipant[i].submittedAt, SessionStore.getSystemDateFormat()), 'days') <= psychometricTestValidDays){
                                        hasValidTast = true;
                                        break;
                                    }
                                }
                                if (hasValidTast) {
                                    validParticipantsCount++;
                                    setPsychometricForCustomerRelation(participantIds[idx], 'YES');
                                } else {
                                    setPsychometricForCustomerRelation(participantIds[idx], 'NO');
                                }
                            }
                        }
                    }
                    if(validParticipantsCount == participantIds.length) {
                        model.loanAccount.psychometricCompleted = 'Completed';
                        deferred.resolve();
                    } else {
                        model.loanAccount.psychometricCompleted = 'N';
                        deferred.reject({data: {error: "Psychometric Test not completed. Cannot proceed"}});
                    }
                }, function(res) {
                    if(res.data) {
                        res.data.error = res.data.errorMsg;
                    }
                    PageHelper.showErrors(res);
                    deferred.reject();
                });
            }
        }, function(res, status){
            PageHelper.showErrors(res);
            deferred.reject();
        });
        return deferred.promise;
    }

    var isEnrollmentsSubmitPending = function(model){

        if(model.currentStage !=='Screening' && model.currentStage !== 'Application' && model.currentStage !== 'FieldAppraisal'){
            return false;
        }

        var pageClassList = ['applicant', 'guarantor', 'co-applicant', 'business'];

        var failed = false;

        var enrollmentsvalidityState = BundleManager.getBundlePagesFormValidity(pageClassList);
        var keys = Object.keys(enrollmentsvalidityState);
        for(var idx = 0; idx < keys.length; idx++) {
            if(_.isEmpty(enrollmentsvalidityState[keys[idx]])){
                PageHelper.showProgress("LoanRequest","Please visit all the " + pageClassList.join(", ") + " tabs atleast once before proceeding with current action.", 5000);
                failed =  true;
                break;
            }

            if(enrollmentsvalidityState[keys[idx]].dirty){

                PageHelper.showProgress("LoanRequest","Please submit all the " + $filter('translate')(keys[idx].split("@")[0]) + " information before proceeding with current action." , 5000);
                failed = true;
                break;
            }
        }

        if(failed) {
            return failed;
        }

        BundleManager.broadcastSchemaFormValidate(pageClassList);
        enrollmentsvalidityState = BundleManager.getBundlePagesFormValidity(pageClassList);
        keys = Object.keys(enrollmentsvalidityState);
        for(var idx = 0; idx < keys.length; idx++) {

            if(enrollmentsvalidityState[keys[idx]].invalid){

                PageHelper.showProgress("LoanRequest","Some of the mandatory information of " + $filter('translate')(keys[idx].split("@")[0]) + " is not filled and submitted." , 5000);
                failed = true;
                break;
            }
        }
        BundleManager.resetBundlePagesFormState(pageClassList);
        return failed;
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

                model.loanAccount.expectedEmi = round(monthly);
                //document.loandata.total.value = round(monthly * payments);
                //document.loandata.totalinterest.value = round((monthly * payments) - principal);
            }
            // Otherwise, the user's input was probably invalid, so don't
            // display anything.
            else {
                model.loanAccount.expectedEmi  = "";
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
        // Considering this as the success callback
        // Deleting offline record on success submission
        BundleManager.deleteOffline().then(function(){
            PageHelper.showProgress("loan-offline", "Offline record cleared", 5000);
        });

        if(model.currentStage=='Screening')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ScreeningQueue', pageId:null});
        if (model.currentStage == 'Dedupe')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.DedupeQueue', pageId:null});
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
        if (model.currentStage == 'ZonalRiskReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ZonalRiskReviewQueue', pageId:null});
        if (model.currentStage == 'Sanction')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.LoanSanctionQueue', pageId:null});
        if (model.currentStage == 'Rejected')
            $state.go( 'Page.LoanOriginationDashboard',null);
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
            model.loanAccount.disbursementSchedules[0].disbursementAmount = model.loanAccount.loanAmount;
        }

    }

    return {
        "type": "schema-form",
        "title": "LOAN_REQUEST",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            model.currentStage = bundleModel.currentStage;
            model.customer=model.customer || {};
            model.review = model.review|| {};
            model.temp=model.temp||{}
            if (_.hasIn(model, 'loanAccount')){
                $log.info('Printing Loan Account');
                $log.info(model.loanAccount);
                if(model.currentStage=='Screening' || model.currentStage=='ScreeningReview'|| model.currentStage=='Application') {
                    if(model.loanAccount.estimatedEmi){
                        model.loanAccount.expectedEmi = model.loanAccount.estimatedEmi;
                    } else {
                        if(model.currentStage=='ScreeningReview') {
                            computeEMI(model);
                        } else {
                            computeEstimatedEMI(model);
                        }
                    }
                }
            } else {
                model.customer = model.customer || {};
                model.customer.customerType = "Enterprise";
                model.loanAccount = {};
                model.loanAccount.loanCustomerRelations = [];
                // model.loanAccount.frequency = 'M';
                model.loanAccount.isRestructure = false;
                model.loanAccount.documentTracking = "PENDING";
                model.loanAccount.collectionPaymentType=model.loanAccount.collectionPaymentType||"Others";
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

            if (_.hasIn(model, 'loanAccount.id') && _.isNumber(model.loanAccount.id)){
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
                                    model.review.preStage = model.loanSummary[i].preStage;
                                    model.review.targetStage = model.loanSummary[i].preStage;
                                }
                            }
                        }
                    }
                },function (errResp){

                });
            }

            if (_.hasIn(model, 'loanAccount')){
                Enrollment.getCustomerById({id:model.loanAccount.customerId})
                    .$promise
                    .then(function(res){
                        model.customer = res;

                    });
            }

            if (model.loanAccount.applicantId){
                $log.info(model.loanAccount.applicantId);
                Enrollment.getCustomerById({id:model.loanAccount.applicantId})
                    .$promise
                    .then(function(res){
                        model.applicant = res;
                        model.applicant.age1 = moment().diff(moment(model.applicant.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                    });
            }

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
                model.loanAccount.screeningDate = obj.screeningDate;
                model.loanAccount.leadId  = obj.id;
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
                "condition":"model.currentStage=='Screening' || model.currentStage=='Application'",
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
                        key: "loanAccount.expectedEmi",
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
                        key: "loanAccount.collectionPaymentType",
                        required:true,
                        title: "MODE_OF_REPAYMENT",
                        type: "select",
                        titleMap:{
                            "ACH":"ACH",
                            "PDC":"PDC",
                            "Others":"Others"
                        }
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
                    },
                    {
                        "type": "section",
                        "htmlClass": "alert alert-warning",
                        "condition": "model.applicant.age1 >= 41 && model.applicant.age1 <= 60 && model.loanAccount.loanAmountRequested >= 2000001 && model.loanAccount.loanAmountRequested <= 3000000 || model.applicant.age1 >= 61 && model.applicant.age1 <= 65 && model.loanAccount.loanAmountRequested < 3000000",
                        "html":"<h4><i class='icon fa fa-warning'></i>Medical Test is Mandatory</h4>"
                    }
                ]
            },
              {
                "type": "box",
                "title": "PRELIMINARY_INFORMATION",
                "condition": "model.currentStage=='ScreeningReview' || model.currentStage == 'Dedupe' || model.currentStage=='ApplicationReview' || model.currentStage=='FieldAppraisal'|| model.currentStage == 'FieldAppraisalReview' ||model.currentStage == 'ZonalRiskReview'|| model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",

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
                        key: "loanAccount.collectionPaymentType",
                        readonly:true,
                        title: "MODE_OF_REPAYMENT",
                        type: "select",
                        titleMap:{
                            "ACH":"ACH",
                            "PDC":"PDC",
                            "Others":"Others"
                        }
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
                type: "box",
                title: "LOAN_CUSTOMER_RELATIONS",
                "condition": "model.currentStage=='Screening' || model.currentStage=='Application'",
                items: [{
                    key: "loanAccount.loanCustomerRelations",
                    type: "array",
                    add: null,
                    remove: null,
                    startEmpty: true,
                    title: "LOAN_CUSTOMER_RELATIONS",
                    items: [{
                        key: "loanAccount.loanCustomerRelations[].customerId",
                        title: "CUSTOMER_ID",
                        readonly: true,
                    }, {
                        key: "loanAccount.loanCustomerRelations[].urn",
                        title: "URN_NO",
                        readonly: true,
                    }, {
                        key: "loanAccount.loanCustomerRelations[].name",
                        "title": "NAME",
                        readonly: true,
                    }, {
                        key: "loanAccount.loanCustomerRelations[].relation",
                        readonly: true,
                        title: "RELATIONSHIP"
                    }, {
                        key: "loanAccount.loanCustomerRelations[].relationshipWithApplicant",
                        title: "RELATIONSHIP_WITH_APPLICATION",
                        condition:"model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                        required:true,
                        type:"select",
                        enumCode:"relation"
                    }]
                }]
            },
            {
                type: "box",
                title: "LOAN_CUSTOMER_RELATIONS",
                "readonly":true,
                "condition": "model.currentStage=='ScreeningReview' || model.currentStage == 'Dedupe' || model.currentStage=='ApplicationReview' || model.currentStage=='FieldAppraisal' || model.currentStage=='FieldAppraisalReview' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'||model.currentStage == 'ZonalRiskReview'",
                items: [{
                    key: "loanAccount.loanCustomerRelations",
                    type: "array",
                    add: null,
                    remove: null,
                    title: "LOAN_CUSTOMER_RELATIONS",
                    items: [{
                        key: "loanAccount.loanCustomerRelations[].customerId",
                        title: "CUSTOMER_ID",
                        readonly: true,
                    }, {
                        key: "loanAccount.loanCustomerRelations[].urn",
                        title: "URN_NO",
                        readonly: true,
                    }, {
                        key: "loanAccount.loanCustomerRelations[].name",
                        "title": "NAME",
                        readonly: true,
                    }, {
                        key: "loanAccount.loanCustomerRelations[].relation",
                        readonly: true,
                        title: "RELATIONSHIP"
                    }, {
                        key: "loanAccount.loanCustomerRelations[].relationshipWithApplicant",
                        title: "RELATIONSHIP_WITH_APPLICATION",
                        condition:"model.loanAccount.loanCustomerRelations[arrayIndex].relation !== 'Applicant'",
                        type:"select",
                        enumCode:"relation"
                    }]
                }]
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
                "condition": "model.currentStage=='ScreeningReview' || model.currentStage == 'Dedupe' || model.currentStage=='ApplicationReview' || model.currentStage=='FieldAppraisal' || model.currentStage=='FieldAppraisalReview' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'||model.currentStage == 'ZonalRiskReview'",
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
            "condition": "model.currentStage=='ScreeningReview' || model.currentStage == 'Dedupe' || model.currentStage=='ApplicationReview'||model.currentStage=='FieldAppraisalReview'||model.currentStage == 'ZonalRiskReview'",
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
            "title": "LOAN_DOCUMENTS",
            "condition":"model.currentStage == 'loanView'" ,
            readonly:true,
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
                "condition": "model.currentStage=='Application' || model.currentStage=='FieldAppraisal' || model.currentStage == 'SanctionInput'||model.currentStage == 'ZonalRiskReview'",
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
                       condition:"model.currentStage!='Application' && model.currentStage!='FieldAppraisal'"
                    },
                    {
                       key: "loanAccount.productCategory",
                       title:"PRODUCT_TYPE",
                       required:true,
                       type:"select",
                       enumCode:"loan_product_category",
                       condition:"model.currentStage=='Application' || model.currentStage=='FieldAppraisal'"
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
                "condition": "model.currentStage=='ApplicationReview' || model.currentStage=='FieldAppraisalReview' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'||model.currentStage == 'ZonalRiskReview'",
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
                       enumCode:"loan_product_category",
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
                            },
                            {
                                key: "loanAccount.collateral[].collateral1FilePath",
                                title: "MACHINE_QUOTATION",
                                "category": "Loan",
                                "required":true,
                                "subCategory": "DOC1",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner"
                            }

                         ]
                     }
                ]
            },
            {
                "type": "box",
                "title": "NEW_ASSET_DETAILS",
                "readonly": true,
                "condition": "model.loanAccount.loanPurpose1=='Asset Purchase' && (model.currentStage=='ApplicationReview' || model.currentStage=='FieldAppraisalReview' || model.currentStage=='Sanction'  || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'||model.currentStage == 'ZonalRiskReview')",
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

                            },
                            {
                                key: "loanAccount.collateral[].collateral1FilePath",
                                title: "MACHINE_QUOTATION",
                                "category": "Loan",
                                "subCategory": "DOC1",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner"
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
                                required: true,
                                "type":"lov",
                                "lovonly": false,
                                "inputMap": {
                                },
                                "outputMap": {
                                    "nomineeFirstName": "loanAccount.nominees[arrayIndex].nomineeFirstName",
                                    "nomineeGender":"loanAccount.nominees[arrayIndex].nomineeGender",
                                    "nomineeDOB":"loanAccount.nominees[arrayIndex].nomineeDOB",
                                    "nomineeRelationship": "loanAccount.nominees[arrayIndex].nomineeRelationship"
                                },
                                "searchHelper": formHelper,
                                "search": function(inputModel, form, model, context) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Queries.getFamilyRelations(model.loanAccount.id);
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
                                required: true,
                                "title":"GENDER"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeDOB",
                                type:"date",
                                required: true,
                                "title":"DATE_OF_BIRTH"
                            },
                            {
                                key:"loanAccount.nominees[].nomineeDoorNo",
                                required: true,
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
                                fieldType: "text",
                                "inputmode": "number",
                                required: true,
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
                                required: true,
                                "title":"RELATIONSHIP"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "box",
                "title": "NOMINEE_DETAILS",
                "condition": "model.currentStage=='ApplicationReview' || model.currentStage=='FieldAppraisalReview' || model.currentStage=='Sanction'  || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview'||model.currentStage == 'loanView'||model.currentStage == 'ZonalRiskReview'",
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
                                    var promise = Queries.getFamilyRelations(model.loanAccount.id);
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
                "condition": "model.currentStage=='ScreeningReview' || model.currentStage == 'Dedupe' || model.currentStage=='ApplicationReview'||model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='FieldAppraisal'||model.currentStage == 'ZonalRiskReview'",
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
                    // required: true
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
            "items": [{
                    key: "review.action",
                    condition: "model.currentStage !== 'Screening'",
                    type: "radios",
                    titleMap: {
                        "REJECT": "REJECT",
                        "SEND_BACK": "SEND_BACK",
                        "PROCEED": "PROCEED",
                        "HOLD": "HOLD"
                    }
                }, {
                    key: "review.action",
                    condition: "model.currentStage == 'Screening'",
                    type: "radios",
                    titleMap: {
                        "REJECT": "REJECT",
                        "PROCEED": "PROCEED",
                        "HOLD": "HOLD"
                    }
                }, {
                    type: "section",
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
                            required:true,
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
                }, {
                    type: "section",
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
                        onClick: "actions.holdButton(model, formCtrl, form, $event)"
                    }]
                },

                {
                    type: "section",
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
            "items": [{
                    type: "section",
                    items: [{
                        title: "REMARKS",
                        key: "review.remarks",
                        type: "textarea",
                        required: true
                    }, {
                        title: "Reject Reason",
                        key: "loanAccount.rejectReason",
                        readonly: true,
                        type: "textarea",
                    }, {
                        key: "review.targetStage",
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
                "condition": "model.loanAccount.customerId && model.currentStage !== 'loanView'",
                "items": [
                    {
                        "type": "button",
                        "icon": "fa fa-circle-o",
                        "title": "SAVE",
                        "onClick": "actions.save(model, formCtrl, form, $event)"
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
                PageHelper.clearErrors();
                /* TODO Call proceed servcie for the loan account */

                Utils.confirm("Are You Sure?").then(function(){

                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanAccount.status = null;
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
                // if(isEnrollmentsSubmitPending(model)){
                //     return;
                // }
                if (!preLoanSaveOrProceed(model)){
                    return;
                }
                Utils.confirm("Are You Sure?")
                    .then(
                        function(){
                            model.temp.loanCustomerRelations = model.loanAccount.loanCustomerRelations;
                            var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
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
                                    if(model.currentStage=='Screening' || model.currentStage=='ScreeningReview'|| model.currentStage=='Application') {
                                        if(model.loanAccount.estimatedEmi){
                                            model.loanAccount.expectedEmi = model.loanAccount.estimatedEmi;
                                        } else {
                                            computeEstimatedEMI(model);
                                        }
                                    }
                                    if(model.temp.loanCustomerRelations && model.temp.loanCustomerRelations.length){
                                        for(i in model.temp.loanCustomerRelations){
                                            for(j in model.loanAccount.loanCustomerRelations){
                                                if(model.temp.loanCustomerRelations[i].customerId == model.loanAccount.loanCustomerRelations[i].customerId ){
                                                    model.loanAccount.loanCustomerRelations[i].name = model.temp.loanCustomerRelations[i].name;
                                                }
                                            }
                                        }
                                    }

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
                                    // Updating offline record on success submission
                                    BundleManager.updateOffline();
                                })
                        }
                    );
            },
            holdButton: function(model, formCtrl, form, $event){
                $log.info("Inside save()");
                PageHelper.clearErrors();
                /* TODO Call save service for the loan */
                // if(isEnrollmentsSubmitPending(model)){
                //     return;
                // }
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
                        .then(function(res){
                            PageHelper.showProgress("update-loan", "Done.", 3000);
                            return res;
                        }, function(httpRes){
                            PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);

                        })
                        .then(function(res){
                            console.log("S1");
                            console.log(res);
                            return Messaging.closeConversation({process_id: res.loanAccount.id})
                        })
                        .then(function(res){
                            console.log("S2");
                            console.log(res);
                            return navigateToQueue(model);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                })

            },
            goBack: function(model, formCtrl, form, $event) {
                if(model.loanAccount.currentStage =="LoanInitiation")
                {
                    $state.go("Page.Engine", {
                        pageName: 'loans.individual.booking.LoanInput',
                        pageId: model.loanAccount.id
                    });
                }
                if(model.loanAccount.currentStage =="DocumentVerification")
                {
                    $state.go("Page.Engine", {
                        pageName: 'loans.individual.booking.DocumentVerification',
                        pageId: model.loanAccount.id
                    });
                }
                if(model.loanAccount.currentStage =="IfmrDO")
                {
                    $state.go("Page.Engine", {
                        pageName: 'loans.individual.booking.IFMRDO',
                        pageId: model.loanAccount.id
                    });
                }
                if(model.loanAccount.currentStage =="DocumentUpload")
                {
                    $state.go("Page.Engine", {
                        pageName: 'loans.individual.booking.DocumentUpload',
                        pageId: model.loanAccount.id
                    });
                }
            },

            proceed: function(model, formCtrl, form, $event){
                var DedupeEnabled = SessionStore.getGlobalSetting("DedupeEnabled") || 'N';
                $log.info(DedupeEnabled);

                $log.info("Inside submit()");
                PageHelper.clearErrors();
                var nextStage = null;
                var dedupeCustomerIdArray = [];
                /* TODO Call proceed servcie for the loan account */
                // if(isEnrollmentsSubmitPending(model)){
                //     return;
                // }

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

                    angular.forEach(model.loanAccount.loanCustomerRelations, function(item, index) {
                                dedupeCustomerIdArray.push(item.customerId);
                    });
                    dedupeCustomerIdArray.push(model.loanAccount.customerId);
                }


                var autoRejected = false;

                if (model.currentStage == 'FieldAppraisal'){
                    if (!_.hasIn(model.enterprise, 'stockMaterialManagement') || _.isNull(model.enterprise.stockMaterialManagement)) {
                        PageHelper.showProgress('enrolment', 'Proxy Indicators are not input. Please check.')
                        return;
                    }

                    /**
                     * Move to Rejected if some proxy indicators are set as YES
                     */
                    if (_.hasIn(model.enterprise, "bribeOffered") &&
                        _.hasIn(model.enterprise, "challengingChequeBounce") &&
                        _.hasIn(model.enterprise, "politicalOrPoliceConnections") &&
                        _.isString(model.enterprise.bribeOffered) &&
                        _.isString(model.enterprise.challengingChequeBounce) &&
                        _.isString(model.enterprise.politicalOrPoliceConnections) &&
                        (
                            _.upperCase(model.enterprise.bribeOffered) === 'YES' ||
                            _.upperCase(model.enterprise.challengingChequeBounce) === 'YES' ||
                            _.upperCase(model.enterprise.politicalOrPoliceConnections) === 'YES'
                        )){
                        nextStage = 'Rejected';
                        autoRejected = true;

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

                    if (commercialCheckFailed){
                        if(model.enterprise.customerBankAccounts && model.enterprise.customerBankAccounts.length>0){
                            for (var i = model.enterprise.customerBankAccounts.length - 1; i >= 0; i--) {
                                if(model.enterprise.customerBankAccounts[i].accountType == 'OD' || model.enterprise.customerBankAccounts[i].accountType == 'CC' ){
                                    PageHelper.showProgress("enrolment","Commercial bureau check fields are mandatory",5000);
                                    return false;
                                }
                            }
                        }
                        if(model.loanAccount.loanAmountRequested > parseInt(SessionStore.getGlobalSetting("MinLoanAmountForCommercialCB")) || model.enterprise.enterprise.businessConstitution == 'Private'){
                                PageHelper.showProgress("enrolment","Commercial bureau check fields are mandatory",5000);
                                return false;
                        }

                        if(model.enterprise.enterpriseCustomerRelations && model.enterprise.enterpriseCustomerRelations.length > 0){
                            for (var i = model.enterprise.enterpriseCustomerRelations.length - 1; i >= 0; i--) {
                                if(((model.enterprise.enterpriseCustomerRelations[i].partnerOfAnyOtherCompany !=null && model.enterprise.enterpriseCustomerRelations[i].partnerOfAnyOtherCompany != undefined)
                                    &&model.enterprise.enterpriseCustomerRelations[i].partnerOfAnyOtherCompany == 'YES')
                                    && model.enterprise.enterpriseCustomerRelations[i].linkedToCustomerId ==model.applicant.id){
                                    PageHelper.showProgress("enrolment","Commercial bureau check fields are mandatory",5000);
                                    return false;
                                }
                            }
                        }
                    }
                }

                if (model.currentStage == 'CreditCommitteeReview') {
                    model.loanAccount.status = 'APPROVED';
                }

                if (!preLoanSaveOrProceed(model)){
                    return;
                }

                Utils.confirm("Are You Sure?").then(function(){
                    var mandatoryPromises = [];
                    var mandatoryToProceedLoan = {
                        "Dedupe": true
                    };

                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                    if (nextStage!=null){
                        reqData.stage = nextStage;
                    }
                    reqData.loanProcessAction = "PROCEED";
                    reqData.remarks = model.review.remarks;
                    PageHelper.showLoader();
                    if (model.currentStage == 'Sanction') {
                        reqData.stage = 'LoanInitiation';
                    }
                    PageHelper.showProgress("update-loan", "Working...");

                    if (reqData.loanAccount.currentStage == 'Screening'){


                        var p2 = $q.when()
                        .then(function(){
                            $log.info("p2_1 is resolved");
                            var p2_1 = Scoring.get({
                                auth_token:AuthTokenHelper.getAuthData().access_token,
                                LoanId:reqData.loanAccount.id,
                                ScoreName: "RiskScore1"
                            }).$promise;
                            return p2_1;
                        })
                        .then(function(){
                            var p2_2 = Queries.getQueryForScore1(reqData.loanAccount.id);
                            p2_2.then(function(result){
                                $log.info("p2_2 is resolved");
                                reqData.loanAccount.literateWitnessFirstName = result.cbScore;
                                reqData.loanAccount.literateWitnessMiddleName = result.businessInvolvement;
                            }, function(response){

                            });
                            return p2_2;
                        })

                        mandatoryPromises.push(p2);

                        // Dedupe call
                        if (DedupeEnabled == 'Y') {
                                var p3 =Queries.getDedupeDetails({
                                "ids" : dedupeCustomerIdArray
                            }).then(function(d){
                                console.log(d);

                                if (d.length != dedupeCustomerIdArray.length) {
                                    PageHelper.showProgress("dedupe-status", "Not all customers have done dedupe", 5000);
                                    mandatoryToProceedLoan['Dedupe'] = false;
                                    return;
                                }

                                for (var i=0;i<d.length;i++){
                                    var item = d[i];
                                    if (item.status != 'finished'){
                                        if (item.status == 'failed') {
                                            PageHelper.showProgress("dedupe-status", "Dedupe has failed. Please Contact IT", 5000);
                                        } else {
                                            PageHelper.showProgress("dedupe-status", "Dedupe process is not completed for all the customers. Please save & try after some time", 5000);
                                        }
                                        mandatoryToProceedLoan['Dedupe'] = false;
                                        break;
                                    }
                                }

                                for (var i=0; i< d.length; i++){
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

                    if (reqData.loanAccount.currentStage == 'Sanction'){
                        /* Auto population of Loan Collateral */
                        var p1 = Enrollment.getCustomerById({id:model.loanAccount.customerId})
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
                                                machineOld: !_.isNull(machine.isTheMachineNew)?(machine.isTheMachineNew.toUpperCase() == "YES"?false:true):null,
                                                quantity: machine.quantity || 1
                                            };
                                            c.totalValue = c.quantity * c.loanToValue;
                                            reqData.loanAccount.collateral.push(c)
                                        }
                                    }
                                }

                            }, function(httpResponse){

                            });

                        mandatoryPromises.push(p1);
                    }

                    if(model.loanAccount.currentStage === 'Application' && SessionStore.getGlobalSetting('siteCode') !== 'IREPDhan'){
                        var psychoPromise = checkPsychometricTestValidity(model);
                        mandatoryPromises.push(psychoPromise);
                    }


                    $q.all(mandatoryPromises)
                        .then(function(){
                            try{
                                $log.info("All promises resolved. ")
                                if (mandatoryToProceedLoan["Dedupe"] == false){
                                    throw new Error("Dedupe is preventing Loan proceed");
                                }

                                reqData.loanAccount.psychometricCompleted = model.loanAccount.psychometricCompleted;
                                reqData.loanAccount.loanCustomerRelations = _.cloneDeep(model.loanAccount.loanCustomerRelations);
                                if (autoRejected) {
                                   reqData.loanAccount.rejectReason = reqData.remarks = "Loan Application Auto-Rejected due to Negative Proxy Indicators";
                                }

                                IndividualLoan.update(reqData)
                                .$promise
                                .then(function(res){

                                    if(res.stage = "Rejected" && autoRejected){
                                        Utils.alert("Loan Application Auto-Rejected due to Negative Proxy Indicators");
                                    }

                                    PageHelper.showProgress("update-loan", "Done.", 3000);
                                    return res;
                                }, function(httpRes){
                                    PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                    PageHelper.showErrors(httpRes);
                                })
                                .then(function(res){
                                    console.log("S1");
                                    console.log(res);
                                    return Messaging.closeConversation({process_id: res.loanAccount.id})
                                })
                                .then(function(res){
                                    console.log(res);
                                    return navigateToQueue(model);
                                })
                                .finally(function(){
                                    PageHelper.hideLoader();
                                })
                            } catch (e){
                                PageHelper.hideLoader();
                                PageHelper.showProgress("update-loan", "Unable to proceed Loan.", 3000);
                            }

                        }, function(res) {
                            PageHelper.hideLoader();
                            PageHelper.showErrors(res);
                        }
                    );

                })
            },
            reject: function(model, formCtrl, form, $event){
                $log.info("Inside reject()");
                if (model.review.remarks==null || model.review.remarks ==""){
                    PageHelper.showProgress("update-loan", "Remarks is mandatory");
                    return false;
                }
                if (model.loanAccount.rejectReason==null || model.loanAccount.rejectReason ==""){
                    PageHelper.showProgress("update-loan", "Reject Reason is mandatory");
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
                            reqData.loanAccount.status = null;
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
