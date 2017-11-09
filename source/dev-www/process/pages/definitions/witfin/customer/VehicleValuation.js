irf.pageCollection.factory(irf.page("witfin.customer.VehicleValuation"),
["$log", "$q","LoanAccount","LoanProcess", 'Scoring', 'Enrollment','EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
"BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor",
function($log, $q, LoanAccount,LoanProcess, Scoring, Enrollment,EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
    BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor){

    var branch = SessionStore.getBranch();
    var self;
    var validateForm = function(formCtrl){
        formCtrl.scope.$broadcast('schemaFormValidate');
        if (formCtrl && formCtrl.$invalid) {
            PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
            return false;
        }
        return true;
    }

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


    var getIncludes = function (model) {
            
            return [
                "primaryInfo",
                "primaryInfo.registrationNumber",
                "valuationPriliminaryInformation",
                "valuationPriliminaryInformation.valuationPurpose",
                "valuationPriliminaryInformation.valuationDate",
                "valuationPriliminaryInformation.valuationPlace",
                "valuationPriliminaryInformation.registeredOwnerName",
                "valuationPriliminaryInformation.proposedOwnerName",
                "valuationPriliminaryInformation.bankReferenceNumber",
                "InspectionDetails",
                "InspectionDetails.inspectionDate",
                "InspectionDetails.inspectedBy",
                "InspectionDetails.vehicleMoved",
                "InspectionDetails.inspectionLatitude",
                "InspectionDetails.inspectionAltitude",
                "InspectionDetails.engineStarted",
                "VehicleIdentityDetails",
                "VehicleIdentityDetails.make",
                "VehicleIdentityDetails.variant",
                "VehicleIdentityDetails.colour",
                "VehicleIdentityDetails.trailer",
                "VehicleIdentityDetails.chasisNo",
                "VehicleIdentityDetails.engineNo",
                "VehicleIdentityDetails.odometerReading",
                "VehicleIdentityDetails.estimatedReading",
                "VehicleIdentityDetails.transmission",
                "VehicleIdentityDetails.odometer",
                "VehicleIdentityDetails.usedFor",
                "RegistrationDetails",
                "RegistrationDetails.reRegistered",
                "RegistrationDetails.previousRegistrationNumber",
                "RegistrationDetails.registrationAsPerRcbook",
                "RegistrationDetails.registrationAsPerActual",
                "RegistrationDetails.numberPlateCOlour",
                "RegistrationDetails.engineNo",
                "RegistrationDetails.registeredAddress",
                "RegistrationDetails.ownerSerialNo",
                "RegistrationDetails.registrationDate",
                "RegistrationDetails.vehicleClass",
                "RegistrationDetails.bodyType",
                "RegistrationDetails.fuelUsed",
                "RegistrationDetails.cubicCapacity",
                "RegistrationDetails.makersClassification",
                "RegistrationDetails.seatingCapacity",
                "RegistrationDetails.unladenWeight",
                "RegistrationDetails.hypothecatedTo",
                "RegistrationDetails.fitnesscertifiedUpto",
                "permitAndTaxDetails",
                "permitAndTaxDetails.permitStatus",
                "permitAndTaxDetails.permitValidUpto",
                "permitAndTaxDetails.operationroute",
                "permitAndTaxDetails.taxPaid",
                "permitAndTaxDetails.taxValidUpto",
                "InsurenceDetails",
                "InsurenceDetails.insuranceCompany",
                "InsurenceDetails.insurancePolicyNumber",
                "InsurenceDetails.insuranceIdv",
                "InsurenceDetails.taxPaid",
                "InsurenceDetails.insurancevalidfrom",
                "InsurenceDetails.insuranceValidTo",
                "InsurenceDetails.insurancePolicyType",
                "otherRemarks",
                "otherRemarks.modelUnderProduction",
                "otherRemarks.accident",
                "otherRemarks.originalInvoiceValue",
                "otherRemarks.accidentRemarks",
                "otherRemarks.majorRepair",
                "otherRemarks.currentInvoiceValue",
                "otherRemarks.rcbookStatus",
                "pastValuations",
                "pastValuations.financier",
                "pastValuations.valuationDate",
                "pastValuations.valuation",
                "conditionOfAsset",
                "conditionOfAsset.engineCondition",
                "conditionOfAsset.engineRemarks",
                "conditionOfAsset.batteryCondition",
                "conditionOfAsset.batteryRemarks",
                "conditionOfAsset.chasisCondition",
                "conditionOfAsset.chasisRemarks",
                "conditionOfAsset.paintRemarks",
                "conditionOfAsset.upholsteryCondition",
                "conditionOfAsset.upholsteryRemarks",
                "conditionOfAsset.transimissionCondition",
                "conditionOfAsset.engineCondition",
                "conditionOfAsset.transmissionRemarks",
                "conditionOfAsset.electricalPartsCondition",
                "conditionOfAsset.electricalPartsRemarks",
                "conditionOfAsset.bodyCondition",
                "conditionOfAsset.seatingCapacity",
                "conditionOfAsset.suspensionCondition",
                "conditionOfAsset.tyreType",
                "conditionOfAsset.lhFrontMake",
                "conditionOfAsset.lhFrontCondition",
                "conditionOfAsset.rhFrontMake",
                "conditionOfAsset.rhFrontCondition",
                "conditionOfAsset.lhRearMake",
                "conditionOfAsset.lhRearCondition",
                "conditionOfAsset.rhRearMake",
                "conditionOfAsset.rhrearCondition",
                "conditionOfAsset.tyreRemarks",
                "conditionOfAsset.fogLampCondition",
                "conditionOfAsset.fogLampRemarks",
                "conditionOfAsset.gearBoxCondition",
                "conditionOfAsset.gearBoxremarks",
                "conditionOfAsset.steeringCondiiton",
                "conditionOfAsset.steeringRemarks",
                "conditionOfAsset.lightWiringCondition",
                "conditionOfAsset.lightWiringRemarks",
                "Accessories",
                "Accessories.powerWindowFont",
                "Accessories.powerWindowRear",
                "Accessories.powerSteering",
                "Accessories.airbag",
                "Accessories.accessories",
                "Accessories.accessoriesStatus",
                "Valuation",
                "Valuation.valuationRating",
                "Valuation.futureLife",
                "Valuation.currentMarketValue",
                "Valuation.distressValue",
                "photoCapture",
                "photoCapture.Image1",
                "photoCapture.Image1.photoType1",
                "photoCapture.Image1.photoFileId1",
                "photoCapture.Image1.photoRemarks1",
                "photoCapture.Image2",
                "photoCapture.Image2.photoType2",
                "photoCapture.Image2.photoFileId2",
                "photoCapture.Image2.photoRemarks2",
                "photoCapture.Image3",
                "photoCapture.Image3.photoType3",
                "photoCapture.Image3.photoFileId3",
                "photoCapture.Image3.photoRemarks3",
                "photoCapture.Image4",
                "photoCapture.Image4.photoType4",
                "photoCapture.Image4.photoFileId4",
                "photoCapture.Image4.photoRemarks4",
                "Recomendation",
                "Recomendation.recommendationStatus",
                "Recomendation.recommendationDate",
                "Recomendation.recommendationRemarks",
                "actionbox",
                "actionbox.submit",
                "actionbox.save"
            ];    
        }
    return {
        "type": "schema-form",
        "title": "LOAN_REQUEST",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            //model.currentStage = bundleModel.currentStage;
            model.customer=model.customer || {};
            model.review = model.review|| {};
            model.temp=model.temp||{}
            if (_.hasIn(model, 'loanAccount')){
                $log.info('Printing Loan Account');
                $log.info(model.loanAccount);
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
            self = this;
            var formRequest = {
                "overrides": "",
                "includes": getIncludes (model),
                "excludes": [
                    ""
                ]
            };
            self.form = IrfFormRequestProcessor.getFormDefinition('VehicleValuation', formRequest);
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
                model.applicant.id = params.customer.id;
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
                                    if(model.temp.loanCustomerRelations && model.temp.loanCustomerRelations.length){
                                        for(i in model.temp.loanCustomerRelations){
                                            for(j in model.loanAccount.loanCustomerRelations){
                                                if(model.temp.loanCustomerRelations[i].id == model.loanAccount.loanCustomerRelations[i].id ){
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
                $log.info("Inside submit()");
                PageHelper.clearErrors();
                var nextStage = null;
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

                    var p1, mandatoryPromises = [];
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
                    }

                    if(model.loanAccount.currentStage === 'Application'){
                        var psychoPromise = checkPsychometricTestValidity(model);

                        mandatoryPromises.push(psychoPromise);
                    }


                    $q.all(mandatoryPromises).then(function(){
                        $q.all([p1])
                        .finally(function(httpRes){
                            reqData.loanAccount.psychometricCompleted = model.loanAccount.psychometricCompleted;
                            reqData.loanAccount.loanCustomerRelations = _.cloneDeep(model.loanAccount.loanCustomerRelations);
                            if(autoRejected) {
                               reqData.loanAccount.rejectReason = reqData.remarks = "Loan Application Auto-Rejected due to Negative Proxy Indicators";
                            }
                            IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res){

                                if(res.stage = "Rejected" && autoRejected){
                                    Utils.alert("Loan Application Auto-Rejected due to Negative Proxy Indicators");
                                }

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
                    }, function(res) {
                        PageHelper.showErrors(res);
                        PageHelper.hideLoader();
                    });

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
