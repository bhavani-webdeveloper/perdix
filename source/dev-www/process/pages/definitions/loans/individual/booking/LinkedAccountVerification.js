define({
    pageUID: "loans.individual.booking.LinkedAccountVerification",
    pageType: "Engine",
    dependencies: ["$log", "irfNavigator","IndividualLoan", "SessionStore", "$state", "$stateParams", "SchemaResource", "PageHelper","PagesDefinition", "Enrollment", "Utils","Queries", "$q", "formHelper"],
    $pageFn: function($log, irfNavigator, IndividualLoan, SessionStore, $state, $stateParams, SchemaResource, PageHelper,PagesDefinition, Enrollment, Utils,Queries, $q, formHelper) {
           

        var branch = SessionStore.getBranch();
        var pendingDisbursementDays;

        Queries.getGlobalSettings("loan.individual.booking.pendingDisbursementDays").then(function(value){
            pendingDisbursementDays = Number(value);
            $log.info("pendingDisbursementDays:" + pendingDisbursementDays);
        },function(err){
            $log.info("pendingDisbursementDays is not available");
        });

        var isCBCheckValid = function (model) {
            var deferred = $q.defer();
            var customerIdList = [model.loanAccount.customerId];
            var validUrns = [];
            var urns = [model.loanAccount.customer.urnNo], invalidUrns = [];

            Queries.getLatestCBCheckDoneDateByCustomerIds(customerIdList).then(function(resp) {
                if(resp && resp.length > 0){
                    for (var i = 0; i < resp.length; i++) {
                        if (moment().diff(moment(resp[i].created_at, SessionStore.getSystemDateFormat()), 'days') <= 
                            Number(SessionStore.getGlobalSetting('cerditBureauValidDays'))) {
                            validUrns.push(urns[customerIdList.indexOf(resp[i].customer_id)]);
                        }
                    }
                    if(validUrns.length === urns.length) {
                        deferred.resolve();
                    } else {
                        invalidUrns = urns.filter(function(urn){  return (validUrns.indexOf(urn) == -1) })
                        deferred.reject({data: {error: "There is no valid CB check for following customers: " + invalidUrns.join(",")+ ". Please do CBCheck and try again." }});
                    }
                } else {
                    deferred.reject({data: {error: "There is no valid CB check for following customers: " + urns.join(",")+ ". Please do CBCheck and try again." }});
                }
            }, function(res) {
                if(res.data) {
                    res.data.error = res.data.errorMsg;
                }
                deferred.reject(res);
            });
            return deferred.promise;
        }

        var doBasicLoanDedupeCheck = function (model) {
            var deferred = $q.defer();

            Queries.getActiveLoansCountByProduct(model.loanAccount.urnNo, model.loanAccount.applicant,
                model.loanAccount.productCode, model.loanAccount.id).then(function(resp) {
                    try {
                        if(resp && Number(resp) > 0) {
                            deferred.reject({data: {error: "The Entity with URN: " + model.loanAccount.urnNo + 
                                " and Applicant URN: " + model.loanAccount.applicant + " is already having an active loan or loan application for the same product " 
                                + model.loanAccount.productCode + "."}});
                        } else {
                            deferred.resolve();
                        }
                    } catch (e) {
                        console.log(e)
                        deferred.reject({data: {error: "Error"}});
                    }
            }, function(res) {
                if(res.data) {
                    res.data.error = res.data.errorMsg;
                }
                deferred.reject(res);
            });
            return deferred.promise;
        }

        var populateDisbursementDate = function(modelValue,form,model){
            if (modelValue){
                modelValue = new Date(modelValue);
                model._currentDisbursement.scheduledDisbursementDate = new Date(modelValue.setDate(modelValue.getDate()+1));
            }
        };

        var validateDisbursementDate = function(model){
            if(model.siteCode == "IREPDhan" && (moment(model._currentDisbursement.scheduledDisbursementDate).isBefore(model._currentDisbursement.customerSignatureDate))){
                PageHelper.setError({
                    message: "Scheduled Disbursement Date should greater then or equal" + " " + moment(model._currentDisbursement.customerSignatureDate).format(SessionStore.getDateFormat())
                });
                return false;
            }
            if (model.disbursementCutOffTime && model.CutOffdate &&(moment(model._currentDisbursement.scheduledDisbursementDate).isBefore(model.CutOffdate))) {
                PageHelper.setError({
                    message: "Scheduled Disbursement Date should be greater then or equal" + " " + moment(model.CutOffdate).format(SessionStore.getDateFormat())
                });
                return false;
            }
            if (model.disbursementRestrictionDays && model.scheduledDisbursementAllowedDate && (moment(model._currentDisbursement.scheduledDisbursementDate).isAfter(model.scheduledDisbursementAllowedDate))) {
                PageHelper.setError({
                    message: "Scheduled Disbursement Date should not be greater then" + " " + moment(model.scheduledDisbursementAllowedDate).format(SessionStore.getDateFormat())
                });
                return false;
            }
            return true;
        }

        var populateDisbursementScheduledDate = function(model) {
            var now= moment().format('HH:MM');
            var today=SessionStore.getCBSDate();
            var tomorrow= moment(SessionStore.getCBSDate()).add("days", 1).format(SessionStore.getSystemDateFormat());
            model._currentDisbursement.customerSignatureDate = today;
            if(now < model.disbursementCutOffTime){
               model._currentDisbursement.scheduledDisbursementDate = today;
               model.CutOffdate=moment(today);
               model.CutOffTime=false;
               model.scheduledDisbursementAllowedDate= moment(today).add("days", model.disbursementRestrictionDays);
            }else{
               model._currentDisbursement.scheduledDisbursementDate = tomorrow;
               model.CutOffdate=moment(tomorrow);
               model.CutOffTime=true;
               model.scheduledDisbursementAllowedDate= moment(tomorrow).add("days", model.disbursementRestrictionDays);
            }
        };

        var validateWaiverDetails = function(model) {
            PageHelper.clearErrors();
            if(parseFloat(model.loanAccount.disbursementSchedules[0].normalInterestDuePayment)>parseFloat(model.loanAccount.precloseureNormalInterest)){
                PageHelper.clearErrors();
                PageHelper.setError({
                    message: "Normal InterestDue Waiver Payment should not be greater then" +" " + model.loanAccount.precloseureNormalInterest
                });
                return false;
            }else if(parseFloat(model.loanAccount.disbursementSchedules[0].penalInterestDuePayment)>parseFloat(model.loanAccount.precloseurePenalInterest)){
                PageHelper.clearErrors();
                PageHelper.setError({
                    message: "Penal Interest Due Waiver Payment should not be greater then" +" " + model.loanAccount.precloseurePenalInterest
                });
                return false;
            }else if(parseFloat(model.loanAccount.disbursementSchedules[0].feeAmountPayment)>parseFloat(model.loanAccount.precloseureTotalFee)){
                PageHelper.clearErrors();
                PageHelper.setError({
                    message: "Fee Amount Waiver Payment should not be greater then" +" " + model.loanAccount.precloseureTotalFee
                });
                return false;
            }
            return true;
        };

        return {
            "type": "schema-form",
            "title": "INTERNAL_FORECLOSURE_OR_RENEWAL_ACCOUNT_VERIFICATION",
            initialize: function (model, form, formCtrl) {
                $log.info("Individual Loan Booking Page got initialized");
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                model.disbursementCutOffTime=SessionStore.getGlobalSetting("disbursementCutOffTime");
                model.disbursementRestrictionDays= Number(SessionStore.getGlobalSetting("disbursementRestrictionDays") || 0);
                model._currentDisbursement=model._currentDisbursement||{};
                model.loanAccount.precloseuredetails=false;
                PageHelper.showProgress('load-loan', 'Loading loan account...');
                PagesDefinition.getPageConfig("Page/Engine/loans.individual.booking.LoanInput").then(function(data) {
                    $log.info(data);
                    if (data.showLoanBookingDetails != undefined && data.showLoanBookingDetails !== null && data.showLoanBookingDetails != "") {
                        model.showLoanBookingDetails = data.showLoanBookingDetails;
                        model.BackedDatedDisbursement = data.BackedDatedDisbursement;
                        model.allowPreEmiInterest = data.allowPreEmiInterest;
                    }
                }, function(err) {
                    console.log(err);
                });
               
                PagesDefinition.getPageConfig("Page/Engine/loans.individual.booking.LoanBooking").then(function(data){
                    if(data.postDatedTransactionNotAllowed && data.postDatedTransactionNotAllowed != '') {
                        model.postDatedTransactionNotAllowed = data.postDatedTransactionNotAllowed;
                    }
                    if(data.basicLoanDedupe) {
                        model.basicLoanDedupe = data.basicLoanDedupe;
                    }
                }, function(err) {
                    console.log(err);
                });

                IndividualLoan.get({id: $stateParams.pageId})
                    .$promise
                    .then(
                        function (res) {

                            $log.info(res);

                            /* DO BASIC VALIDATION */
                            if (res.currentStage!= 'LinkedAccountVerification'){
                                PageHelper.showProgress('load-loan', 'Loan is in different Stage', 2000);
                                $state.go('Page.Engine', {pageName: 'loans.individual.booking.LinkedAccountVerificationQueue'});
                                return;
                            }

                            if (_.has(res, 'disbursementSchedules') &&
                                _.isArray(res.disbursementSchedules) &&
                                res.disbursementSchedules.length > 0 &&
                                res.numberOfDisbursed < res.disbursementSchedules.length){
                                model._currentDisbursement = res.disbursementSchedules[res.numberOfDisbursed];
                            } else {
                                PageHelper.showProgress('load-loan', 'No disbursement schedules found for the loan', 2000);
                                $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue'});
                                return;
                            }

                            if(model.loanAccount.disbursementSchedules[0].linkedAccountTotalFeeDue && model.loanAccount.disbursementSchedules[0].linkedAccountPreclosureFee){
                                model.loanAccount.disbursementSchedules[0].linkedAccountTotalFeeDue = (model.loanAccount.disbursementSchedules[0].linkedAccountTotalFeeDue - model.loanAccount.disbursementSchedules[0].linkedAccountPreclosureFee);
                            }

                            if (_.has(res, 'disbursementSchedules') &&
                                _.isArray(res.disbursementSchedules) &&
                                res.disbursementSchedules.length > 0 ){
                                    if(res.disbursementSchedules[i].
                                model._currentDisbursement = res.disbursementSchedules[res.numberOfDisbursed];
                                {
                                    "key": "loanAccount.disbursementSchedules[0].linkedAccountTotalFeeDue",
                                    "title": "TOTAL_FEE_DUE",
                                    "readonly": true
                                },{
                                    "key": "loanAccount.disbursementSchedules[0].linkedAccountPreclosureFee",
                                    "title": "TOTAL_PRECLOSURE_FEE_DUE",
                                    "readonly": true
                                }
                            } 

                            model.scheduledDisbursementAllowedDate= moment(SessionStore.getCBSDate()).add("days", model.disbursementRestrictionDays);
                            if (model.disbursementCutOffTime ) {
                                populateDisbursementScheduledDate(model);
                            }

                            model.loanAccount = res;

                            if (model.loanAccount.disbursementSchedules.length >= 0 && _.isNumber(model.loanAccount.disbursementSchedules[0].moratoriumPeriodInDays) && !model.loanAccount.scheduleStartDate && _.isNumber(model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate)) {
                                model.loanAccount.scheduleStartDate = moment(model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate, "YYYY-MM-DD").add(model.loanAccount.disbursementSchedules[0].moratoriumPeriodInDays, 'days').format("YYYY-MM-DD");
                            }
                            var ids = [];
                            var urns = [];
                            if (model.loanAccount.customerId){
                                ids.push(model.loanAccount.customerId);
                            }

                            if (model.loanAccount.applicant){
                                urns.push(model.loanAccount.applicant);
                            }

                            if (model.loanAccount.portfolioInsuranceUrn){
                                urns.push(model.loanAccount.portfolioInsuranceUrn);
                            }

                            
                            model.loanAccount.loanCustomerRelations = model.loanAccount.loanCustomerRelations || [];
                            model.loanAccount.loan_coBorrowers = [];
                            model.loanAccount.loan_guarantors = [];

                            for (var i = 0; i < model.loanAccount.loanCustomerRelations.length; i++) {
                                if (model.loanAccount.loanCustomerRelations[i].relation === 'APPLICANT' ||
                                    model.loanAccount.loanCustomerRelations[i].relation === 'Applicant') {
                                    model.loanAccount.applicantId = model.loanAccount.loanCustomerRelations[i].customerId;
                                }
                                else if (model.loanAccount.loanCustomerRelations[i].relation === 'COAPPLICANT' ||
                                    model.loanAccount.loanCustomerRelations[i].relation === 'Co-Applicant') {
                                    model.loanAccount.loan_coBorrowers.push({
                                        coBorrowerUrnNo:model.loanAccount.loanCustomerRelations[i].urn,
                                        customerId:model.loanAccount.loanCustomerRelations[i].customerId
                                    });
                                    ids.push(model.loanAccount.loanCustomerRelations[i].customerId);
                                }
                                else if(model.loanAccount.loanCustomerRelations[i].relation === 'GUARANTOR' ||
                                        model.loanAccount.loanCustomerRelations[i].relation === 'Guarantor'){
                                        model.loanAccount.loan_guarantors.push({
                                        guaUrnNo:model.loanAccount.loanCustomerRelations[i].urn,
                                        customerId:model.loanAccount.loanCustomerRelations[i].customerId
                                    });
                                    ids.push(model.loanAccount.loanCustomerRelations[i].customerId);
                                }
                            }
                           
                            Queries.getCustomerBasicDetails({
                                urns: urns,
                                ids: ids
                            }).then(
                                function (resQuery) {
                                    if (_.hasIn(resQuery.urns, model.loanAccount.applicant))
                                        model.loanAccount.applicantName = resQuery.urns[model.loanAccount.applicant].first_name;
                                    
                                    if (_.hasIn(resQuery.urns, model.loanAccount.portfolioInsuranceUrn))
                                        model.loanAccount.portfolioInsuranceCustomerName = resQuery.urns[model.loanAccount.portfolioInsuranceUrn].first_name;   
                                    for (var i=0;i<model.loanAccount.loan_coBorrowers.length; i++){
                                        if (_.hasIn(resQuery.ids, model.loanAccount.loan_coBorrowers[i].customerId))
                                             model.loanAccount.loan_coBorrowers[i].coBorrowerName = resQuery.ids[model.loanAccount.loan_coBorrowers[i].customerId].first_name;
                                    }
                                    for (var i=0;i<model.loanAccount.loan_guarantors.length; i++){
                                        if (_.hasIn(resQuery.ids, model.loanAccount.loan_guarantors[i].customerId))
                                             model.loanAccount.loan_guarantors[i].guaFirstName = resQuery.ids[model.loanAccount.loan_guarantors[i].customerId].first_name;
                                    }   
                                },
                                function (errQuery) {
                                }
                            );

                            PageHelper.showProgress('load-loan', 'Almost Done...');

                            if(model.loanAccount.collateral.length > 0){
                                for (var i = model.loanAccount.collateral.length - 1; i >= 0; i--) {
                                    if(model.loanAccount.collateral[i].loanToValue != "" && model.loanAccount.collateral[i].loanToValue != null)
                                        model.loanAccount.collateral[i].loanToValue = Number(model.loanAccount.collateral[i].loanToValue);
                                    else
                                        model.loanAccount.collateral[i].loanToValue = 0;
                                }
                            }

                            /* Now load the customer */
                            Enrollment.getCustomerById({id: model.loanAccount.customerId})
                                .$promise
                                .then(
                                    function (res) {
                                        model.loanAccount.customer = res;
                                        PageHelper.showProgress('load-loan', 'Done.', 2000);
                                    }, function (httpRes) {
                                        PageHelper.showProgress('load-loan', "Error while loading customer details", 2000);
                                    }
                                )
                        }, function (httpRes) {
                            PageHelper.showProgress('load-loan', 'Some error while loading the loan details', 2000)
                        }
                    )

            },
            offline: false,
            getOfflineDisplayItem: function (item, index) {
            },
            form: [{
                "type": "box",
                "title": "UPDATE_ACCOUNT", 
                "colClass": "col-sm-6",
                "readonly":true,
                "items": [
                    {
                        "key": "_currentDisbursement.customerSignatureDate",
                        "title": "CUSTOMER_SIGNATURE_DATE",
                        "condition":"!model.disbursementCutOffTime",
                        "type": "date",
                        "required": true,
                        "onChange":function(modelValue,form,model){
                            populateDisbursementDate(modelValue,form,model);
                        }
                    },
                    {
                        "key": "_currentDisbursement.customerSignatureDate",
                        "title": "CUSTOMER_SIGNATURE_DATE",
                        "condition":"model.disbursementCutOffTime",
                        "type": "date",
                        "required": false,
                        "readonly":true,
                        "onChange":function(modelValue,form,model){
                            populateDisbursementDate(modelValue,form,model);
                        }
                    },
                    {
                        "key": "_currentDisbursement.scheduledDisbursementDate",
                        "title": "SCHEDULED_DISBURSEMENT_DATE",
                        "type": "date",
                        "required": true,
                        "onChange": function(value ,form ,model, event){
                            validateDisbursementDate(model);
                        }
                    },
                    {
                        key: "loanAccount.emiPaymentDateRequested",
                        condition : "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        type: "string",
                        title: "EMI_PAYMENT_DATE_REQUESTED",
                        readonly: true
                    },
                    {
                        "key": "loanAccount.firstRepaymentDate",
                        "title": "REPAYMENT_DATE",
                        "type": "date",
                        "required": true
                    },
                    {
                        "key": "loanAccount.scheduleStartDate",
                        "title": "SCHEDULE_START_DATE",
                        "condition": "model.siteCode == 'IREPDhan'&& model.allowPreEmiInterest",
                        "type": "date",
                        "required": true,
                        "onChange": function(value ,form ,model, event){
                            var repaymentDate = moment(model.loanAccount.firstRepaymentDate,SessionStore.getSystemDateFormat());
                            var disbursementSchedules = moment(model._currentDisbursement.scheduledDisbursementDate,SessionStore.getSystemDateFormat());
                            var scheduleStartDate = moment(model.loanAccount.scheduleStartDate,SessionStore.getSystemDateFormat());
                            if(scheduleStartDate < disbursementSchedules){
                                model._currentDisbursement.scheduledDisbursementDate = null;
                                PageHelper.showProgress("loan-create","Disbursement date should be lesser than Schedule Start Date date",5000);
                            }
                            if(repaymentDate < disbursementSchedules){
                                model._currentDisbursement.scheduledDisbursementDate = null;
                                PageHelper.showProgress("loan-create","Disbursement date should be lesser than Repayment date",5000);
                            }  
                        } 
                    },
                ]
            }, {
                "type": "box",
                "title": "LOAN_DETAILS", 
                "colClass": "col-sm-6",
                "readonly":true,
                "items": [
                    {
                        "key": "loanAccount.partnerCode",
                        "title": "PARTNER_NAME",//add label in translation                        
                        "type": "select",
                        "enumCode":"partner",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.partnerCode",
                        "title": "PARTNER_CODE",                        
                        "readonly": true
                    },                    
                    /*{
                        "key": "loanAccount.loanType",
                        "readonly": true
                    },*/
                    {
                        "key": "loanAccount.frequency",
                        "readonly": true,
                        "type":"select",
                        "enumCode":"loan_product_frequency"
                    },
                    {
                        "key": "loanAccount.applicantName",
                        "title": "CUSTOMER_NAME",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.customer.urnNo",
                        "title": "CUSTOMER_URN",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.tenure",
                        "title": "DURATION_IN_MONTHS",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanAmount",
                        "title": "LOAN_AMOUNT",
                        "type":"amount",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanApplicationDate",
                        "readonly": true,
                        "title": "LOAN_APPLICATION_DATE"
                    },
                    {
                        "key": "loanAccount.loanPurpose1",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanPurpose2",
                        "readonly": true,
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                    },
                    // {
                    //     "key": "loanAccount.loanPurpose3",
                    //     "readonly": true
                    // },
                     {
                        "key": "loanAccount.branchId",
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        "title": "BRANCH",
                        "type": "select",
                        "enumCode": "branch_id",
                        "readonly": true,
                    },
                    {
                        "key": "loanAccount.loanCentre.centreId",
                        "title": "CENTRE",
                        "readonly": true,
                        "type":"select",
                    },
                    {
                        "key": "loanAccount.interestRate",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.processingFeePercentage",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.portfolioInsurancePremium",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        "title": "INSURANCE",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.commercialCibilCharge",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        "title": "CIBIL_CHARGES",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanAmountRequested",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        "title": "LOAN_AMOUNT_REQUESTED",
                        "type":"amount",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.securityEmiRequired",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.sanctionDate",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        "readonly": true
                    },
                    {
                        "key":"additional.portfolioUrnSelector",
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        "type":"string",
                        "readonly": true                     
                    },
                    {
                        key:"loanAccount.portfolioInsuranceUrn",
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        "title":"URN_NO",
                        "readonly": true
                    },
                    {
                        key: "loanAccount.portfolioInsuranceCustomerName",
                        "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        title: "NAME",
                        readonly: true
                                    },
                                    {
                        "type": "fieldset",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija' && model.siteCode != 'IREPDhan'",
                        "notitle": true,
                        "items": [
                            {
                                "key":"loanAccount.collateral",
                                "title":"HYPOTHECATION",
                                "type":"array",
                                "readonly": true,
                                "items":[
                                    {
                                        "key": "loanAccount.collateral[].collateralCategory",
                                        "type": "select",
                                        "enumCode": "hypothecation_type",
                                        "title": "HYPOTHECATION_TYPE"
                                    }, {
                                        "key": "loanAccount.collateral[].collateralType",
                                        "type": "select",
                                        "enumCode": "hypothication_sub_type",
                                        "title": "HYPOTHECATION_SUB_TYPE",
                                        "parentEnumCode": "hypothecation_type",
                                        "parentValueExpr": "model.loanAccount.collateral[arrayIndex].collateralCategory",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].collateralDescription",
                                         "title": "HYPOTHECATION_DESCRIPTION"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].manufacturer"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].quantity",
                                        "onChange": function(value ,form ,model, event){
                                            calculateTotalValue(value, form, model);
                                        }
                                    },
                                    {
                                        "key":"loanAccount.collateral[].modelNo"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].machineOld"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].loanToValue",
                                        "type":"amount",
                                        "title":"PRESENT_VALUE"
                                    },
                                    {
                                        "key":"loanAccount.collateralValueteral[].collateralValue",
                                        "type":"amount",
                                        "title":"PURCHASE_PRICE"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].totalValue",
                                        "type":"amount",
                                        "title":"TOTAL_VALUE"
                                    }
                                ]
                            }
                        ]
                    }, 
                    {
                        "type":"fieldset",
                        "readonly":true,
                        "title":"COLLATERAL",
                        "notitle": true,
                        "condition": "model.siteCode == 'IREPDhan'",
                        "items":[
                            {
                                "key":"loanAccount.collateral",
                                "title":"COLLATERAL",
                                "type":"array",
                                "readonly": true,
                                "items":[
                                    {
                                        "key":"loanAccount.collateral[].collateralType",
                                        "enumCode": "collateral_type_titledeed",
                                        "type":"select"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].propertyType",
                                        "type":"select",
                                        "enumCode": "collateral_property_type",
                                        "required": true,
                                    },
                                    {
                                        "key":"loanAccount.collateral[].extentOfProperty",
                                        "inputmode": "number",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].extentOfPropertyUnit",
                                        "condition": "model.loanAccount.collateral[arrayIndex].extentOfProperty",
                                        "type": "select",
                                        "enumCode": "property_extent_unit",
                                        "required": true,

                                    },
                                    {
                                        "key":"loanAccount.collateral[].documentType",
                                        "type": "select",
                                        "enumCode": "collateral_document_type",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].documentNumber"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].dateOfRegistration",
                                        "title":"DATE_OF_REGISTRATION",
                                        "type":"date",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].subRegistrar",
                                    },
                                    {
                                        key: "loanAccount.collateral[].subRegistrarPincode",
                                        type: "lov",
                                        "title":"SUB_REGISTRAR_PINCODE",
                                        "inputmode": "number",
                                        autolov: true,
                                        inputMap: {
                                            "subRegistrarPincode": {
                                                key: "loanAccount.collateral[].subRegistrarPincode"
                                            },
                                            "subRegistrarVillage": {
                                                key: "loanAccount.collateral[].subRegistrarVillage"
                                            },
                                            "subRegistrarArea": {
                                                key: "loanAccount.collateral[].subRegistrarArea"
                                            },
                                            "subRegistrarDistrict": {
                                                key: "loanAccount.collateral[].subRegistrarDistrict"
                                            },
                                            "subRegistrarState": {
                                                key: "loanAccount.collateral[].subRegistrarState"
                                            }
                                        },
                                        outputMap: {
                                            "division": "loanAccount.collateral[arrayIndex].subRegistrarArea",
                                            "region": "loanAccount.collateral[arrayIndex].subRegistrarVillage",
                                            "pincode": "loanAccount.collateral[arrayIndex].subRegistrarPincode",
                                            "district": "loanAccount.collateral[arrayIndex].subRegistrarDistrict",
                                            "state": "loanAccount.collateral[arrayIndex].subRegistrarState",
                                        },
                                        searchHelper: formHelper,
                                        initialize: function (inputModel) {
                                            $log.warn('in pincode initialize');
                                            $log.info(inputModel);
                                        },
                                        search: function (inputModel, form, model) {
                                            if (!inputModel.subRegistrarPincode) {
                                                return $q.reject();
                                            }
                                            return Queries.searchPincodes(
                                                inputModel.subRegistrarPincode,
                                                inputModel.subRegistrarDistrict,
                                                inputModel.subRegistrarState,
                                                inputModel.subRegistrarArea,
                                                inputModel.subRegistrarVillage
                                            );
                                        },
                                        getListDisplayItem: function (item, index) {
                                            return [
                                                item.division + ', ' + item.region,
                                                item.pincode,
                                                item.district + ', ' + item.state,
                                            ];
                                        },
                                        onSelect: function (result, model, context) {
                                            $log.info(result);
                                        }
                                    },
                                    {
                                        readonly: true,
                                        key: "loanAccount.collateral[].subRegistrarArea",
                                    },
                                    {
                                        readonly: true,
                                        key: "loanAccount.collateral[].subRegistrarVillage",
                                        screenFilter: true
                                    },
                                    {
                                        readonly: true,
                                        key: "loanAccount.collateral[].subRegistrarDistrict",
                                        screenFilter: true
                                    },
                                    {
                                        readonly: true,
                                        key: "loanAccount.collateral[].subRegistrarState",
                                        screenFilter: true
                                    },
                                    {
                                        "key":"loanAccount.collateral[].propertyOwner",
                                        "type": "select",
                                        "enumCode": "collateral_property_Owner"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].propertyOwnerName",
                                        "condition": "model.loanAccount.collateral[arrayIndex].propertyOwner == 'Others'",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].relationWithApplicant",
                                        "condition": "model.loanAccount.collateral[arrayIndex].propertyOwner == 'Others'",
                                        "type": "select",
                                        "enumCode":"relation_with_business_owner"
                                    },
                                    {
                                        "type": "fieldset",
                                        "title": "PROPERTY_ADDRESS",
                                        "items": [
                                            {
                                                "key":"loanAccount.collateral[].doorNo",
                                            },
                                            {
                                                "key":"loanAccount.collateral[].surveyNo",
                                            },
                                            {
                                                "key":"loanAccount.collateral[].landmark",
                                            },
                                            {
                                                "key":"loanAccount.collateral[].village",
                                            },
                                            {
                                                "key":"loanAccount.collateral[].mandal",
                                            },
                                            {
                                                "key":"loanAccount.collateral[].district",
                                            },
                                            {
                                                "key":"loanAccount.collateral[].state",
                                            },
                                        ]
                                    }
                            /*,
                            {
                                "key":"loanAccount.collateral[].collateral1FilePath",
                                "type":"file",
                                "title":"DOCUMENT_1"
                            },
                            {
                                "key":"loanAccount.collateral[].collateral2FilePath",
                                "type":"file",
                                "title":"DOCUMENT_2"
                            },
                            {
                                "key":"loanAccount.collateral[].collateral3FilePath",
                                "type":"file",
                                "title":"DOCUMENT_3"
                            },
                            {
                                "key":"loanAccount.collateral[].photoFilePath",
                                "type":"file",
                                "fileType":"image/*",
                                "title":"PHOTO"
                            }*/
                        ]
                    }
                ]
            }]
            },
            {
            "type": "box",
            "title": "APPLICANT_CO_APPLICANT_DETAILS",
            "readonly": true,
            "items": [{
                    "key": "loanAccount.applicant",
                    "title": "APPLICANT_URN_NO",
                    "type":"text",                    
                },
                {
                    "key":"loanAccount.applicantName",
                    "title":"APPLICANT_NAME",
                    "readonly": true
                },
                {
                    "key":"loanAccount.applicantId",
                    "title":"APPLICANT_ID",
                    "readonly": true
                },
                {
                    "type": "fieldset",
                    "title": "COAPPLICANTS",
                    // condition:"!model.loanAccount.coBorrowers[].length == 0",
                    "readonly": true,
                    "items": [
                        {
                            "key": "loanAccount.loan_coBorrowers",
                            "title": "COAPPLICANTS",
                            "titleExpr": "model.loanAccount.loan_coBorrowers[arrayIndex].customerId + ': ' + model.loanAccount.loan_coBorrowers[arrayIndex].coBorrowerName",
                            "type": "array",
                            "startEmpty": true,
                            "schema": {
                                "maxItems": 4
                            },
                            "items": [
                                {
                                    "key": "loanAccount.loan_coBorrowers[].coBorrowerUrnNo",
                                    "title": "CO_APPLICANT_URN_NO",
                                    "type":"text"                                 
                                },
                                {
                                    key:"loanAccount.loan_coBorrowers[].coBorrowerName",
                                    title:"NAME",
                                    "readonly": true
                                }
            ]
                        }
                    ]
                }, {
                    "type":"fieldset",
                     // condition:"!model.loanAccount.guarantors[].length > 0",
                     "readonly":true,
                    "title":"GUARANTOR",
                    "items":[{
                            key:"loanAccount.loan_guarantors",
                            "titleExpr": "model.loanAccount.loan_guarantors[arrayIndex].customerId + ': ' + model.loanAccount.loan_guarantors[arrayIndex].guaFirstName",
                            startEmpty: true,
                            type:"array",
                            items:[{
                                "key": "loanAccount.loan_guarantors[].guaUrnNo",
                                "title": "URN_NO",
                                "type":"text"                              
            },
            {
                                key:"loanAccount.loan_guarantors[].guaFirstName",
                                title:"NAME",
                                "readonly": true
                            }]
                    }]
                }
            ]},
            {
                "type": "box",
                "readonly":true,
                "title": "INTERNAL_FORE_CLOSURE_DETAILS", 
                "condition": "model.siteCode == 'kinara' && model.loanAccount.linkedAccountNumber",
                "items": [{
                    "key": "loanAccount.transactionType",
                    "required":false,
                    "title":"TRANSACTION_TYPE",
                    "readonly":true,
                },
                {
                    "type": "fieldset",
                    "title": "Linked Account Outstanding Loan Details",
                    "items": [{
                            "key": "loanAccount.linkedAccountNumber",
                            "title": "LINKED_ACCOUNT_NUMBER",
                            "readonly": true
                        }, {
                            "key": "loanAccount.disbursementSchedules[0].linkedAccountTotalPrincipalDue",
                            "title": "TOTAL_PRINCIPAL_DUE",
                            "readonly": true
                        }, {
                            "key": "loanAccount.disbursementSchedules[0].linkedAccountNormalInterestDue",
                            "title": "TOTAL_INTEREST_DUE",
                            "readonly": true
                        }, {
                            "key": "loanAccount.disbursementSchedules[0].linkedAccountPenalInterestDue",
                            "title": "TOTAL_PENAL_INTEREST_DUE",
                            "readonly": true
                        }, {
                            "key": "loanAccount.disbursementSchedules[0].linkedAccountTotalFeeDue",
                            "title": "TOTAL_FEE_DUE",
                            "readonly": true
                        },{
                            "key": "loanAccount.disbursementSchedules[0].linkedAccountPreclosureFee",
                            "title": "TOTAL_PRECLOSURE_FEE_DUE",
                            "readonly": true
                        }
                    ]
                },
                {
                    "type": "fieldset",
                    "readonly":true,
                    "title": "WAIVER_DETAILS",
                    "items": [{
                        "key": "loanAccount.disbursementSchedules[0].normalInterestDuePayment",
                        "title": "TOTAL_INTEREST_DUE",
                        //"type": "amount",
                        "onChange": "actions.validateWaiverAmount(model.loanAccount.disbursementSchedules[0].normalInterestDuePayment,model.loanAccount.precloseureNormalInterest,modelValue)"
                    }, {
                        "key": "loanAccount.disbursementSchedules[0].penalInterestDuePayment",
                        "title": "TOTAL_PENAL_INTEREST_DUE",
                        //"type": "amount",
                        "onChange": "actions.validateWaiverAmount(model.loanAccount.disbursementSchedules[0].penalInterestDuePayment,model.loanAccount.precloseurePenalInterest,modelValue)"
                    }, {
                        "key": "loanAccount.disbursementSchedules[0].feeAmountPayment",
                        "title": "TOTAL_FEE_DUE",
                        //"type": "amount",
                        "onChange": "actions.validateWaiverAmount(model.loanAccount.disbursementSchedules[0].feeAmountPayment,model.loanAccount.precloseureTotalFee,modelValue)"
                    }]
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
                            //"REJECT": "REJECT",
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
                                key: "loanAccount.rejectReason",
                                type: "lov",
                                autolov: true,
                                title: "REJECT_REASON",
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var stage1 = model.currentStage;
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
                        }, {
                            key: "review.targetStage",
                            title: "SEND_BACK_TO_STAGE",
                            type: "select",
                            required: true,
                            titleMap: {
                                "LoanInitiation": "LoanInitiation",
                                "LoanBooking": "LoanBooking"
                            },
                        }, {
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
            }
        ],
            schema: function () {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                reject: function(model, formCtrl, form, $event){
                    $log.info("Inside reject()");
                    Utils.confirm("Are You Sure?").then(function(){
                        var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                        reqData.loanAccount.status = '';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.stage = "Rejected";
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res){
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                irfNavigator.goBack();
                            }, function(httpRes){
                                PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                    })
                },
                holdButton: function(model, formCtrl, form, $event){
                    $log.info("Inside save()");
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
                                        irfNavigator.goBack();
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
                    if(_.isEmpty(model.review.remarks) || _.isEmpty(model.review.targetStage)) {
                        PageHelper.showProgress("update-loan", "Please Enter Remarks and Stage.", 3000);
                        return false;
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
                                irfNavigator.goBack();
                            }, function(httpRes){
                                PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                    })

                },
                proceed: function(model, form, formName) {

                    if (PageHelper.isFormInvalid(form)){
                        return false;
                    }

                    var reqData = {
                        'loanAccount': _.cloneDeep(model.loanAccount),
                        'loanProcessAction': 'PROCEED'
                    };

                    PageHelper.showProgress('update-loan', 'Working...');
                    PageHelper.showLoader();
                    console.log(JSON.stringify(reqData));
                    return IndividualLoan.update(reqData)
                        .$promise
                        .then(
                            function(res) {
                                PageHelper.showProgress('update-loan', 'Done.', 2000);
                                irfNavigator.goBack();
                                return;
                            },
                            function(httpRes) {
                                PageHelper.showProgress('update-loan', 'Unable to proceed.', 2000);
                                PageHelper.showErrors(httpRes);
                            }
                        )
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                },
                goBack: function(model, formCtrl, form, $event) {
                    irfNavigator.goBack();
                }
            }


        };
    }
})
