irf.pageCollection.factory(irf.page("loans.individual.booking.LoanBooking"),
    ["$log", "irfNavigator","IndividualLoan", "SessionStore", "$state", "$stateParams", "SchemaResource", "PageHelper","PagesDefinition", "Enrollment", "Utils","Queries", "$q", "formHelper","LoanAccount", "kinara.IndividualLoanHelper", 
    function ($log, irfNavigator, IndividualLoan, SessionStore, $state, $stateParams, SchemaResource, PageHelper,PagesDefinition, Enrollment, Utils,Queries, $q, formHelper,LoanAccount, KinaraIndividualLoanHelper) {

        var branch = SessionStore.getBranch();
        var pendingDisbursementDays;
        
       var showNetDisbursmentDetails = 'N';
       if (SessionStore.getGlobalSetting("loans.preOpenSummary.showNetDisbursmentDetails") == "Y") {
           showNetDisbursmentDetails = 'Y';
       }
        Queries.getGlobalSettings("loan.individual.booking.pendingDisbursementDays").then(function(value){
            pendingDisbursementDays = Number(value);
            $log.info("pendingDisbursementDays:" + pendingDisbursementDays);
        },function(err){
            $log.info("pendingDisbursementDays is not available");
        });

        Queries.getGlobalSettings("loan.collection.repaymentDays").then(function (value) {
            repaymentDaysValidationExist = true;
            repaymentDates = value.split(',').map(Number);
        }, function (err) {
            repaymentDaysValidationExist = false;
            $log.info(err);
        });
        var preLoanAccountSave=false;
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
            }else if(parseFloat(model.loanAccount.disbursementSchedules[0].feeAmountPayment)>parseFloat(model.loanAccount.preTotalFee)){
                PageHelper.clearErrors();
                PageHelper.setError({
                    message: "Fee Amount Waiver Payment should not be greater then" +" " + model.loanAccount.preTotalFee
                });
                return false;
            }
            return true;
        };

        var iswaiverApplicable= function(model){
            if((model.loanAccount.disbursementSchedules[0].normalInterestDuePayment && model.loanAccount.disbursementSchedules[0].normalInterestDuePayment>0)||
            (model.loanAccount.disbursementSchedules[0].penalInterestDuePayment && model.loanAccount.disbursementSchedules[0].penalInterestDuePayment>0)||
            (model.loanAccount.disbursementSchedules[0].feeAmountPayment && model.loanAccount.disbursementSchedules[0].feeAmountPayment >0)){
                model.iswaiverApplicable=true;
            }else{
                model.iswaiverApplicable=false;
            }
            model.loanAccount.disbursementSchedules[0].normalInterestDuePayment =model.loanAccount.disbursementSchedules[0].normalInterestDuePayment||0;
            model.loanAccount.disbursementSchedules[0].penalInterestDuePayment = model.loanAccount.disbursementSchedules[0].penalInterestDuePayment||0;
            model.loanAccount.disbursementSchedules[0].feeAmountPayment = model.loanAccount.disbursementSchedules[0].feeAmountPayment||0;
        }
        
        var computeEMI = function(model){
            var estimatedEmi  = "";
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

                estimatedEmi = round(monthly);
            }
            return estimatedEmi;
        };

        // This simple method rounds a number to two decimal places.
        function round(x) {
          return Math.ceil(x);
        }

        return {
            "type": "schema-form",
            "title": "CAPTURE_DATES",
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
                        model.additional = model.additional || {};
                        model.additional.config = {};
                        if(data.conditionConfig){
                            for (var i=0;i<data.conditionConfig.length;i++){
                                model.additional.config[data.conditionConfig[i].split('.').join('_')] = true;
                            }
                        }
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
                    // if(!data.validateRepaymentDate){
                    //     model.validateRepaymentDate = data.validateRepaymentDate;
                    // }
                }, function(err) {
                    console.log(err);
                });

                IndividualLoan.get({id: $stateParams.pageId})
                    .$promise
                    .then(
                        function (res) {

                            $log.info(res);

                            /* DO BASIC VALIDATION */
                            if (res.currentStage!= 'LoanBooking'){
                                PageHelper.showProgress('load-loan', 'Loan is in different Stage', 2000);
                                $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue'});
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
                            /*to remove duplicate waiwerapproval documents */
                                var waiverDocs=[];
                            /** */
                            if(model.loanAccount.loanDocuments && model.loanAccount.loanDocuments.length>0){
                                for(documents of model.loanAccount.loanDocuments){
                                  if(documents.document=='WAIVERAPPROVAL'){
                                        model.loanAccount.waiverdocumentId= documents.documentId;
                                        model.loanAccount.waiverdocumentstatus= documents.documentStatus;
                                        model.loanAccount.waiverdocumentrejectReason=documents.rejectReason;
                                        model.loanAccount.waiverdocumentremarks=documents.remarks;
                                       
                                    }
                                }
                               
                            }

                            
                            
                            
                            var objTest=null;
                            for(var i = 0; i < model.loanAccount.loanDocuments.length; i++){
                                   
                                model.loanAccount.loanDocuments = model.loanAccount.loanDocuments.filter(function(obj, index, arr){

                                    if(obj.document=='WAIVERAPPROVAL'){
                                        objTest=obj;
                                       
                                    }
                                    return obj.document !='WAIVERAPPROVAL';
                                
                                });

                            }
                            
                            model.waiverDocumentPreviousId=null;
                            if (objTest) {
                                model.loanAccount.waiverdocumentId = objTest.documentId;
                                model.loanAccount.waiverdocumentstatus = objTest.documentStatus;
                                model.loanAccount.waiverdocumentrejectReason = objTest.rejectReason;
                                model.loanAccount.waiverdocumentremarks = objTest.remarks;
                                model.waiverDocumentPreviousId = objTest.documentId;
                                //model.loanAccount.loanDocuments.push(objTest);
                            } else {
                                model.loanAccount.waiverdocumentId = null;
                                model.loanAccount.waiverdocumentstatus = null;
                                model.loanAccount.waiverdocumentrejectReason = null;
                                model.loanAccount.waiverdocumentremarks = null;
                            }
                            
                        
                            iswaiverApplicable(model);

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
                            // if (showNetDisbursmentDetails == "Y") {
                            //     KinaraIndividualLoanHelper.computePreOpenFeeData(model);
                            // }

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
                "title": "UPDATE_ACCOUNT", // sample label code
                "colClass": "col-sm-6", // col-sm-6 is default, optional
                //"readonly": false, // default-false, optional, this & everything under items becomes readonly
                "items": [
                    {
                        "key": "_currentDisbursement.customerSignatureDate",
                        "title": "CUSTOMER_SIGNATURE_DATE",
                        "condition":"!model.disbursementCutOffTime && model.siteCode != 'witfin'",
                        "type": "date",
                        "required": true,
                        "onChange":function(modelValue,form,model){
                            populateDisbursementDate(modelValue,form,model);
                        }
                    },
                    {
                        "key": "_currentDisbursement.customerSignatureDate",
                        "title": "CUSTOMER_SIGNATURE_DATE",
                        "condition":"model.disbursementCutOffTime && model.siteCode != 'witfin'",
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
                        condition : "model.siteCode != 'sambandh' && model.siteCode != 'saija' && model.siteCode != 'witfin'",
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
                        "condition": "(model.siteCode == 'IREPDhan' || model.siteCode == 'shramsarathi' || model.siteCode == 'maitreya') && model.allowPreEmiInterest",
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
                "title": "LOAN_DETAILS", // sample label code
                "colClass": "col-sm-6", // col-sm-6 is default, optional
                //"readonly": false, // default-false, optional, this & everything under items becomes readonly
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
                        "key": "loanAccount.loanAmountRequested",
                        "title": "REQUESTED_LOAN_AMOUNT",
                        "type":"amount",
                        "readonly": true,
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                    },
                    {
                        "key": "loanAccount.loanApplicationDate",
                        "readonly": true,
                        "title": "LOAN_APPLICATION_DATE"
                    },
                    {
                        "key": "loanAccount.loanPurpose1",
                        "required":false,
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanPurpose2",
                        "required":false,
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
                        key:"loanAccount.expectedPortfolioInsurancePremium",
                        condition:'model.additional.config.portfolioInsurancePremium && model.loanAccount.id',
                        readonly:true,
                        required:false,
                        "title":"EXPECTED_PORTFOLIO_INSURANCE_PREMIUM",
                        type:'amount',
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
                        "title": "PORTFOLIO_INSURANCE_PREMIUM",
                        "readonly": true,
                        type:'amount'
                    },
                    {
                        "key": "loanAccount.commercialCibilCharge",
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija' && model.siteCode != 'witfin'",
                        "title": "CIBIL_CHARGES",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanAmount",
                        "title": "SANCTIONED_AMOUNT",
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
                        "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija' && model.siteCode != 'IREPDhan'&& model.siteCode != 'shramsarathi'",
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
                                        "key":"loanAccount.collateral[].collateralType",
                                        "condition": "model.loanAccount.collateral[arrayIndex].collateralCategory != 'Machinery'",
                                        "type":"select",
                                        "enumCode":"hypothication_sub_type",
                                        "title":"HYPOTHECATION_SUB_TYPE",
                                        "parentEnumCode":"hypothecation_type",
                                        "parentValueExpr":"model.loanAccount.collateral[arrayIndex].collateralCategory"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].collateralType",
                                        "type":"lov",
                                        "condition": "model.loanAccount.collateral[arrayIndex].collateralCategory == 'Machinery'",
                                        autolov: true,
                                        lovonly:true,
                                        searchHelper: formHelper,
                                        outputMap: {
                                             "collateralType": "loanAccount.collateral[arrayIndex].collateralType"
                                         },
                                        search: function(inputModel, form, model, locals) {
                                            return Queries.searchCollateralType();
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.collateralType
                                            ];
                                        },
                                        onSelect: function(result, model, context) {
                                        }
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
                                        "key":"loanAccount.collateral[].collateralValue",
                                        "type":"amount",
                                        "title":"PURCHASE_PRICE"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].totalValue",
                                        "type":"amount",
                                        "title":"TOTAL_VALUE"
                                    },
                                    // {
                                    //     "key":"loanAccount.collateral[].collateral1FilePath",
                                    //     "type":"file",
                                    //     "title":"DOCUMENT_1"
                                    // },
                                    // {
                                    //     "key":"loanAccount.collateral[].collateral2FilePath",
                                    //     "type":"file",
                                    //     "title":"DOCUMENT_2"
                                    // },
                                    // {
                                    //     "key":"loanAccount.collateral[].collateral3FilePath",
                                    //     "type":"file",
                                    //     "title":"DOCUMENT_3"
                                    // },
                                    // {
                                    //     "key":"loanAccount.collateral[].photoFilePath",
                                    //     "type":"file",
                                    //     "fileType":"image/*",
                                    //     "title":"PHOTO"
                                    // }
                                ]
                            }
                        ]
                    }, 
                    {
                        "type":"fieldset",
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
            //here for new
            /** removed for temporal fix
            {
                "type": "box",
                "title": "ACTUAL_NET_DISBURSEMENT",
                "condition": "!model.showPreOpenData && model.siteCode == 'kinara'",
                "items": [
                    {
                        key:"preOpenFeeData.loanAmount",
                        "type": "amount",
                        "title": "LOAN_AMOUNT",
                        readonly: true,
                    },
                    {
                        key: "preOpenFeeData.expectedCommercialCibilCharges",
                        "type": "amount",
                        "title": "ACTUAL_CIBIL_CHARGES",
                        readonly: true,
                    },
                    {
                        key: "preOpenFeeData.expectedProcessingFee",
                        "type": "amount",
                        "title": "ACTUAL_PROCESSSING_FEE",
                        readonly: true
                    },
                    {
                        key: "preOpenFeeData.expectedSecurityEMI",
                        "type": "amount",
                        "title": "ACTUAL_SECURITY_EMI",
                        readonly: true
                    }, {
                        key: "preOpenFeeData.expectedPortfolioInsuranceAmount",
                        "type": "amount",
                        "title": "ACTUAL_PORTFOLIO_INSURANCE_WITH_GST",
                        readonly: true
                    }, {
                        key: "preOpenFeeData.payoffAmountForLinkedAccount",
                        "type": "amount",
                        "title": "ACTUAL_PAYOFF_FOR_LINKED_ACCOUNT",
                        readonly: true
                    }, {
                        key: "preOpenFeeData.documentCharges",
                        "type": "amount",
                        "title": "ACTUAL_DOCUMENTATION_CHARGES",
                        readonly: true
                    }, {
                        key: "preOpenFeeData.netDisbursementAmount",
                        "type": "amount",
                        "title": "ACTUAL_DISBURSABLE_AMOUNT",
                        readonly: true
                    }
                ]
            },
            **/
            //end
            {
            "type": "box",
            "title": "Applicant & Co-Applicant Details",
            "readonly": true,
            "items": [
                {
                    "type": "fieldset",
                    "title": "Applicants",
                    // condition:"!model.loanAccount.coBorrowers[].length == 0",
                    "readonly": true,
                    "items": [
                        {
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
                    ]
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
                },
                {
                    "type":"fieldset",
                     // condition:"!model.loanAccount.guarantors[].length > 0",

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
                "title": "INTERNAL_FORE_CLOSURE_DETAILS", 
                "condition": "(model.siteCode == 'kinara' ||model.siteCode == 'maitreya') && model.loanAccount.linkedAccountNumber && model.loanAccount.transactionType != 'Loan Transfer'",
                "items": [{
                    "key": "loanAccount.linkedAccountNumber",
                    "title":"LINKED_ACCOUNT_NUMBER",
                    "readonly":true
                }, 
                {
                    "key":"loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf6",
                    "title":"OTHER_LINKED_ACCOUNTS",
                    "readonly":true,
                    //"required": false,
                    "condition": "model.siteCode == 'kinara'"
                }, 
                {
                    "key": "loanAccount.transactionType",
                    "required":false,
                    "title":"TRANSACTION_TYPE",
                    "readonly":true,
                },{
                    "key": "loanAccount.button",
                    "required":true,
                    "title":"SUBMIT",
                    "type":"button",
                    "onClick": "actions.getPreClosureDetails(model, formCtrl, form, $event)"
                },{
                    "type":"fieldset",
                    "condition":"model.loanAccount.precloseuredetails",
                    "items":[
                    /*{
                        "key": "loanAccount.precloseurePayOffAmount",
                        "title": "PAYOFF_AMOUNT",
                        "readonly": true
                    },*/ {
                        "key": "loanAccount.precloseurePayOffAmountWithDue",
                        "title": "PAYOFF_AMOUNT_WITH_DUE",
                        "readonly": true,
                    },{
                        "key": "loanAccount.precloseurePrincipal",
                        "title": "TOTAL_PRINCIPAL_DUE",
                        "readonly": true
                    }, {
                        "key": "loanAccount.precloseureNormalInterest",
                        "title": "TOTAL_INTEREST_DUE",
                        "readonly": true,
                    },{
                        "key": "loanAccount.precloseurePenalInterest",
                        "title": "TOTAL_PENAL_INTEREST_DUE",
                        "readonly": true
                    }, {
                        "key": "loanAccount.precloseureTotalFee",
                        "title": "FEE_DUE",
                        "readonly": true,
                    },{
                        "key": "loanAccount.precloseureTotalPreclosureFee",
                        "title": "PRECLOSURE_FEE_DUE",
                        "readonly": true,
                    },
                    {
                        "key": "linkedAccountCbsData.securityDeposit",
                        "title": "SECURITY_DEPOSIT",
                        "readonly": true,   
                    }
                    
                    ]
                },
                {
                    "type": "fieldset",
                    "title": "WAIVER_DETAILS",
                    "condition": "model.loanAccount.precloseuredetails",
                    "items": [{
                        "key": "loanAccount.disbursementSchedules[0].normalInterestDuePayment",
                        "title": "TOTAL_INTEREST_DUE",
                        "onChange": "actions.validateWaiverAmount(model.loanAccount.disbursementSchedules[0].normalInterestDuePayment,model.loanAccount.precloseureNormalInterest,model,modelvalue)"
                    }, {
                        "key": "loanAccount.disbursementSchedules[0].penalInterestDuePayment",
                        "title": "TOTAL_PENAL_INTEREST_DUE",
                        "onChange": "actions.validateWaiverAmount(model.loanAccount.disbursementSchedules[0].penalInterestDuePayment,model.loanAccount.precloseurePenalInterest,model,modelvalue)"
                    }, {
                        "key": "loanAccount.disbursementSchedules[0].feeAmountPayment",
                        "title": "TOTAL_FEE_DUE",
                        "onChange": "actions.validateWaiverAmount(model.loanAccount.disbursementSchedules[0].feeAmountPayment,model.loanAccount.preTotalFee,model,modelvalue)"
                    }]
                },
                {
                    "type": "fieldset",
                    "condition": "model.loanAccount.precloseuredetails && model.iswaiverApplicable",
                    "title": "WAIVER_APPROVAL_DOCUMENT",
                    "items":[
                        {
                            title: "Upload",
                            "required":true,
                            "key": "loanAccount.waiverdocumentId",
                            type: "file",
                            fileType: "application/pdf",
                            category: "Loan",
                            subCategory: "DOC1",
                            title:"WAIVER_APPROVAL_DOCUMENT",
                            using: "scanner"
                        },
                        {
                            "type": "fieldset",
                            "readonly":true,
                            "condition": "model.loanAccount.waiverdocumentstatus =='APPROVED'||model.loanAccount.waiverdocumentstatus =='REJECTED'",
                            "items":[
                                {
                                    "key": "loanAccount.waiverdocumentstatus",
                                    title:"WAIVER_APPROVAL_STATUS",
                                    "required":true,
                                    "type": "select",
                                    "titleMap": [{
                                        value: "REJECTED",
                                        name: "Rejected"
                                    }, {
                                        value: "APPROVED",
                                        name: "Approved"
                                    }]
                                },
                                {
                                    "key": "loanAccount.waiverdocumentrejectReason",
                                    "required":true,
                                    "condition":"model.loanAccount.waiverdocumentstatus=='REJECTED'",
                                    title: "Reason"
                                },
                                {
                                    "key": "loanAccount.waiverdocumentremarks",
                                    "required":true,
                                    title: "Remarks"
                                }
                            ]
                        }
                        
                    ]
                },
                ]
            },
            {
                "type": "box",
                "title": "LOAN_TRANSFER_DETAILS", 
                    "key": "loanAccount.transactionType",
                "condition": "(model.siteCode == 'kinara' ||model.siteCode == 'maitreya') && model.loanAccount.linkedAccountNumber && model.loanAccount.transactionType == 'Loan Transfer'",
                "items": [{
                    "key": "loanAccount.linkedAccountNumber",
                    "title":"LINKED_ACCOUNT_NUMBER",
                    "readonly":true
                }, {
                    "key": "loanAccount.transactionType",
                    "required":false,
                    "title":"TRANSACTION_TYPE",
                    "readonly":true,
                },{
                    "key": "loanAccount.button",
                    "required":true,
                    "title":"SUBMIT",
                    "type":"button",
                    "onClick": "actions.getPreClosureDetails(model, formCtrl, form, $event)"
                },{
                    "type":"fieldset",
                    "condition":"model.loanAccount.precloseuredetails",
                    "items":[
                    /*{
                        "key": "loanAccount.precloseurePayOffAmount",
                        "title": "PAYOFF_AMOUNT",
                        "readonly": true
                    },*/ {
                        "key": "loanAccount.precloseurePayOffAmountWithDue",
                        "title": "PAYOFF_AMOUNT_WITH_DUE",
                        "readonly": true,
                    },{
                        "key": "loanAccount.precloseurePrincipal",
                        "title": "TOTAL_PRINCIPAL_DUE",
                        "readonly": true
                    }, {
                        "key": "loanAccount.precloseureNormalInterest",
                        "title": "TOTAL_INTEREST_DUE",
                        "readonly": true,
                    },{
                        "key": "loanAccount.precloseurePenalInterest",
                        "title": "TOTAL_PENAL_INTEREST_DUE",
                        "readonly": true
                    }, {
                        "key": "loanAccount.precloseureTotalFee",
                        "title": "FEE_DUE",
                        "readonly": true,
                    },{
                        "key": "loanAccount.precloseureTotalPreclosureFee",
                        "title": "PRECLOSURE_FEE_DUE",
                        "readonly": true,
                    },
                    {
                        "key": "linkedAccountCbsData.securityDeposit",
                        "title": "SECURITY_DEPOSIT",
                        "readonly": true,   
                    }
                    ]
                },
                {
                    "type": "fieldset",
                    "title": "WAIVER_DETAILS",
                    "condition": "model.loanAccount.precloseuredetails",
                    "items": [{
                        "key": "loanAccount.disbursementSchedules[0].normalInterestDuePayment",
                        "title": "TOTAL_INTEREST_DUE",
                        "onChange": "actions.validateWaiverAmount(model.loanAccount.disbursementSchedules[0].normalInterestDuePayment,model.loanAccount.precloseureNormalInterest,model,modelvalue)"
                    }, {
                        "key": "loanAccount.disbursementSchedules[0].penalInterestDuePayment",
                        "title": "TOTAL_PENAL_INTEREST_DUE",
                        "onChange": "actions.validateWaiverAmount(model.loanAccount.disbursementSchedules[0].penalInterestDuePayment,model.loanAccount.precloseurePenalInterest,model,modelvalue)"
                    }, {
                        "key": "loanAccount.disbursementSchedules[0].feeAmountPayment",
                        "title": "TOTAL_FEE_DUE",
                        "onChange": "actions.validateWaiverAmount(model.loanAccount.disbursementSchedules[0].feeAmountPayment,model.loanAccount.preTotalFee,model,modelvalue)"
                    }]
                },
                {
                    "type": "fieldset",
                    "condition": "model.loanAccount.precloseuredetails && model.iswaiverApplicable",
                    "title": "WAIVER_APPROVAL_DOCUMENT",
                    "items":[
                        {
                            title: "Upload",
                            "required":true,
                            "key": "loanAccount.waiverdocumentId",
                            type: "file",
                            fileType: "application/pdf",
                            category: "Loan",
                            subCategory: "DOC1",
                            title:"WAIVER_APPROVAL_DOCUMENT",
                            using: "scanner"
                        },
                        {
                            "type": "fieldset",
                            "readonly":true,
                            "condition": "model.loanAccount.waiverdocumentstatus =='APPROVED'||model.loanAccount.waiverdocumentstatus =='REJECTED'",
                            "items":[
                                {
                                    "key": "loanAccount.waiverdocumentstatus",
                                    title:"WAIVER_APPROVAL_STATUS",
                                    "required":true,
                                    "type": "select",
                                    "titleMap": [{
                                        value: "REJECTED",
                                        name: "Rejected"
                                    }, {
                                        value: "APPROVED",
                                        name: "Approved"
                                    }]
                                },
                                {
                                    "key": "loanAccount.waiverdocumentrejectReason",
                                    "required":true,
                                    "condition":"model.loanAccount.waiverdocumentstatus=='REJECTED'",
                                    title: "Reason"
                                },
                                {
                                    "key": "loanAccount.waiverdocumentremarks",
                                    "required":true,
                                    title: "Remarks"
                                }
                            ]
                        }
                        
                    ]
                },
                ]
            },
            {
                "type": "actionbox",
                "condition": "model.siteCode != 'maitreya'",
                "items": [{
                    "type": "button",
                    "title": "BACK",
                    "onClick": "actions.reenter(model, formCtrl, form, $event)"
                },
                {
                    "type": "button",
                    "title": "SEND_BACK",
                    "onClick": "actions.reject(model, formCtrl, form, $event)"
                },
                {
                    "type": "submit",
                    "title": "CONFIRM_LOAN_CREATION"
                },
                {
                     "condition": "model.loanAccount.customerId && model.siteCode == 'kinara'",
                        "type": "button",
                        "icon": "fa fa-circle-o",
                       "title": "SAVE",
                        "onClick": "actions.save(model, formCtrl, form, $event)"  
                }]
            },
            {
                "type": "box",
                "title": "POST_REVIEW",
                "condition": "model.loanAccount.id && model.siteCode == 'maitreya'",
                "items": [
                    {
                        key: "review.action",
                        type: "radios",
                        condition: "model.siteCode != 'sambandh' && model.siteCode != 'saija'",
                        titleMap: {
                            "REJECT": "REJECT",
                            "SEND_BACK": "SEND_BACK",
                            "PROCEED": "PROCEED",
                            "HOLD": "HOLD"
                        }
                    },
                    {
                        key: "review.action",
                        type: "radios",
                        condition: "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                        titleMap: {
                            "SEND_BACK": "SEND_BACK",
                            "PROCEED": "PROCEED",
                        }
                    },
                    {
                        type: "section",
                        condition: "model.review.action=='REJECT'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                condition: "model.siteCode != 'sambandh'",
                                type: "textarea",
                                required: true
                            }, 
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                condition: "model.siteCode == 'sambandh'"
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
                                    if(typeof stage1 === 'undefined'){
                                        stage1=model.loanAccount.currentStage;
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
                                        else{
                                            console.log(t.field1);
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
                                condition: "model.siteCode != 'sambandh'",
                                type: "textarea",
                                required: true
                            },
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                condition: "model.siteCode == 'sambandh'"
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
                            condition: "model.siteCode != 'sambandh'",
                            type: "textarea",
                            required: true
                        },
                        {
                            title: "REMARKS",
                            key: "review.remarks",
                            type: "textarea",
                            condition: "model.siteCode == 'sambandh'"
                        }, {
                            key: "review.targetStage",
                            title: "SEND_BACK_TO_STAGE",
                            type: "select",
                            required: true,
                            titleMap: {
                                "LoanInitiation": "LoanInitiation"

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
                                condition: "model.siteCode != 'sambandh'",
                                type: "textarea",
                                required: true
                            },
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                condition: "model.siteCode == 'sambandh'"
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
                "type": "actionbox",
                condition: "model.siteCode == 'maitreya'",
                "items": [{
                    "type": "button",
                    "title": "BACK",
                    "onClick": "actions.reenter(model, formCtrl, form, $event)"
                }/*, {
                    "type": "submit",
                    "title": "Submit"
                }*/]
            },
            
        ],
            
            schema: function () {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                submit: function (model, form, formName) {
                    $log.info("submitting");
                    if(showNetDisbursmentDetails =="Y"){
                        if(!preLoanAccountSave){
                            PageHelper.setError({
                                message: "Please save account before proceeding"
                            });
                            PageHelper.hideLoader();
                            return false;
                        }
                       /* removed for temporal fix for kinara 
                       if(model.preOpenFeeData.netDisbursementAmount<0){
                            PageHelper.setError({
                                message: "disubrsement amount can not be less than : 0" 
                            });
                           return;
                          
                        }*/
                        model.loanAccount.estimatedEmi=computeEMI(model);	                        
                        
                    }
                    var cbsdate=SessionStore.getCBSDate();
                    if(model._currentDisbursement.scheduledDisbursementDate)
                        var scheduledDisbursementDate = moment(model._currentDisbursement.scheduledDisbursementDate,SessionStore.getSystemDateFormat());
                    if(model._currentDisbursement.scheduledDisbursementDate && cbsdate)
                        var BackedDatedDiffDays = scheduledDisbursementDate.diff(cbsdate, "days");
                        var BackedDatedDiffmonth = scheduledDisbursementDate.diff(cbsdate, "month");
                    if(model.loanAccount.sanctionDate)
                        var sanctionDate = moment(model.loanAccount.sanctionDate,SessionStore.getSystemDateFormat());
                    if(model._currentDisbursement.customerSignatureDate)
                        var customerSignatureDate = moment(model._currentDisbursement.customerSignatureDate,SessionStore.getSystemDateFormat());
                    if(model._currentDisbursement.scheduledDisbursementDate && model.loanAccount.sanctionDate)
                        var diffDays = scheduledDisbursementDate.diff(sanctionDate, "days");
                    if(model.loanAccount.firstRepaymentDate)
                        var firstRepaymentDate = moment(model.loanAccount.firstRepaymentDate,SessionStore.getSystemDateFormat());
                    if (model.loanAccount.firstRepaymentDate && repaymentDaysValidationExist) {
                        if (_.isArray(repaymentDates)) {
                            var date = firstRepaymentDate.get("date");
                            if (!_.includes(repaymentDates, date)) {
                                PageHelper.showProgress("loan-create", "First repayment date should be " + repaymentDates, 10000);
                                return false;
                            }
                        }
                    }

                    if (model.allowPreEmiInterest && (model.siteCode == 'IREPDhan' || model.siteCode == 'maitreya')) {
                        var diffDay = 0;
                        var scheduleStartDate;
                        if(model.loanAccount.scheduleStartDate){
                            scheduleStartDate = moment(model.loanAccount.scheduleStartDate, SessionStore.getSystemDateFormat());
                        }
                        if(scheduleStartDate && scheduledDisbursementDate){
                            diffDay = scheduleStartDate.diff(scheduledDisbursementDate, "days");
                        }
                        if (diffDay > 0) {
                            model.loanAccount.firstRepaymentDate = scheduleStartDate.format("YYYY-MM-DD");
                        }
                        for (var i = 0; i < model.loanAccount.disbursementSchedules.length; i++) {
                            model.loanAccount.disbursementSchedules[i].moratoriumPeriodInDays = diffDay;
                        }
                    }

                    var cbsmonth = ((new Date(cbsdate)).getMonth());
                    var dismonth = ((new Date(scheduledDisbursementDate)).getMonth());

                    //$log.info(BackedDatedDiffmonth);
                    /* 1) Loc-Renewal chnage includes default processing fee to 0.2 ans calculation of process amount 
                    */
                    if (!validateWaiverDetails(model)){
                        return;
                    }
                    if(!validateDisbursementDate(model)){
                        return;
                    };

                    if(model.loanAccount.transactionType && model.loanAccount.transactionType !='New Loan'){
                         if(!model.loanAccount.precloseuredetails){
                            PageHelper.setError({
                                message: "Please Generate Linked Account Details by clicking Submit" 
                            });
                            return;
                         }
                    }

                    if(model.loanAccount.linkedAccountNumber && model.siteCode == 'kinara'){
                        if(model.loanAccount.transactionType && model.loanAccount.transactionType.toLowerCase()=='renewal'){
                            model.loanAccount.processingFeePercentage=0.2;
                            model.loanAccount.processingFeeInPaisa=(2*model.loanAccount.loanAmount);
                        }
                        var loanfee = parseInt(model.loanAccount.processingFeeInPaisa / 100) + model.loanAccount.commercialCibilCharge + model.loanAccount.portfolioInsurancePremium + parseInt(model.loanAccount.portfolioInsuranceServiceCharge - model.loanAccount.portfolioInsuranceServiceTax) + model.loanAccount.fee3 + model.loanAccount.fee4 + model.loanAccount.fee5 + model.loanAccount.securityEmi;
                        if (loanfee) {
                            var netdisbursementamount = model.loanAccount.disbursementSchedules[0].disbursementAmount - loanfee;
                        }
                        var linkedaccountoutstanding = (parseInt(model.loanAccount.precloseurePrincipal) + parseInt(model.loanAccount.precloseureNormalInterest) + parseInt(model.loanAccount.precloseurePenalInterest) + parseInt(model.loanAccount.precloseureTotalFee)) -
                            (
                                parseInt(model.loanAccount.disbursementSchedules[0].normalInterestDuePayment) +
                                parseInt(model.loanAccount.disbursementSchedules[0].penalInterestDuePayment) +
                                parseInt(model.loanAccount.disbursementSchedules[0].feeAmountPayment)
                            );
                        
                        
                            if(parseInt(netdisbursementamount) < parseInt(linkedaccountoutstanding)){
                            PageHelper.setError({
                                message: "New loan First schedule disbursement amount with fees" + " " +netdisbursementamount+ " "+ "should  be greater then Linked Account Balence with Waiver amount" +"  " + linkedaccountoutstanding
                            });
                           return;
                        }

                            if(model.loanAccount.waiverdocumentstatus){
                                if(model.loanAccount.loanDocuments && model.loanAccount.loanDocuments.length>0){
                                    for(documents of model.loanAccount.loanDocuments){
                                        if(documents.document=='WAIVERAPPROVAL'){
                                            documents.documentId=model.loanAccount.waiverdocumentId;
                                            documents.documentStatus=model.loanAccount.waiverdocumentstatus;
                                            documents.rejectReason=model.loanAccount.waiverdocumentrejectReason;
                                            documents.remarks=model.loanAccount.waiverdocumentremarks; 
                                        }
                                    }
                                }
                            }else{
                                model.loanAccount.loanDocuments.push({
                                    loanId:model.loanAccount.id,
                                    documentId:model.loanAccount.waiverdocumentId,
                                    document:"WAIVERAPPROVAL",
                                    accountNumber:model.loanAccount.accountNumber,
                                    documentStatus:"PENDING",
                                });
                            }
                         
                    }

                    if(model.siteCode != 'sambandh' && model.siteCode != 'saija'){

                        if(model.siteCode != 'witfin' && model.siteCode != 'maitreya') {
                            if(model.postDatedTransactionNotAllowed) {
                                if (customerSignatureDate.diff(cbsdate, "days") <0) {
                                    PageHelper.showProgress("loan-create", "Customer signature date should be greater than or equal to system date", 5000);
                                    return false;
                                }
                            }
                        }

                        if(model.BackedDatedDisbursement && model.BackedDatedDisbursement=="ALL"){
                            if (scheduledDisbursementDate.diff(cbsdate, "days") <0) {
                                PageHelper.showProgress("loan-create", "scheduledDisbursementDate date should be greater than CBS date", 5000);
                                return false;
                            }
                        }

                        if(model.BackedDatedDisbursement && model.BackedDatedDisbursement=="CURRENT_MONTH"){
                            if (scheduledDisbursementDate.diff(cbsdate, "days") <0 && (cbsmonth !== dismonth)) {
                                PageHelper.showProgress("loan-create", "scheduledDisbursementDate date should not be a previous month of CBS date", 5000);
                                return false;
                            }
                        }
                        if (diffDays > pendingDisbursementDays) {
                            PageHelper.showProgress("loan-create", "Difference between Loan sanction date and disbursement date is greater than " + pendingDisbursementDays + " days", 5000);
                            return false;
                        }
                        
                        if(model.siteCode != 'witfin'){
                            if (customerSignatureDate.isBefore(sanctionDate)) {
                                PageHelper.showProgress("loan-create", "Customer sign date should be greater than the Loan sanction date", 5000);
                                return false;
                            }
                        }

                        if (model.loanAccount.firstRepaymentDate) {
                            if (firstRepaymentDate.diff(scheduledDisbursementDate, "days") <= 0) {
                                PageHelper.showProgress("loan-create", "Repayment date should be greater than sanction date", 5000);
                                return false;
                            }
                        }
                    }
                    
                    if(model.siteCode == 'sambandh' || model.siteCode == 'saija'||model.siteCode == 'kinara' || model.siteCode == 'IREPDhan') {
                        if (scheduledDisbursementDate.diff(customerSignatureDate,"days") < 0){
                            PageHelper.showProgress("loan-create","Scheduled disbursement date should be greater than or equal to Customer sign date",5000);
                            return false;
                        }
                    }
                    else  {
                        if(model.siteCode != 'witfin' && model.siteCode != 'maitreya'){
                            if (scheduledDisbursementDate.diff(customerSignatureDate,"days") <= 0){
                                PageHelper.showProgress("loan-create","Scheduled disbursement date should be greater than Customer sign date",5000);
                                return false;
                            }
                        }
                    }
                    
                    var validatePromise = [];
                    if(model.siteCode == 'sambandh' && SessionStore.getGlobalSetting('individualLoan.cbCheck.required') == "true" && 
                        model.loanAccount.loanAmount >= Number(SessionStore.getGlobalSetting('individualLoan.cbCheck.thresholdAmount'))) {
                        validatePromise.push(isCBCheckValid(model));
                    }

                    if(model.basicLoanDedupe) {
                        validatePromise.push(doBasicLoanDedupeCheck(model));
                    }

                    $q.all(validatePromise).then(function() {
                        Utils.confirm("Ready to book the loan?")
                        .then(function(){
                            model.loanAccount.disbursementSchedules[model.loanAccount.numberOfDisbursed].customerSignatureDate = model._currentDisbursement.customerSignatureDate;
                            model.loanAccount.disbursementSchedules[model.loanAccount.numberOfDisbursed].scheduledDisbursementDate = model._currentDisbursement.scheduledDisbursementDate;
                            if(model.linkedAccountCbsData)
                                model.loanAccount.disbursementSchedules[model.loanAccount.numberOfDisbursed].linkedAccountSecurityDeposit=model.linkedAccountCbsData.securityDeposit;    
                            var reqData = { 'loanAccount': _.cloneDeep(model.loanAccount), 'loanProcessAction': 'PROCEED'};
                            PageHelper.showProgress('update-loan', 'Working...');
                            return IndividualLoan.update(reqData)
                                .$promise
                                .then(
                                    function(res){
                                        PageHelper.showProgress('update-loan', 'Done', 2000);
                                        // $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue'});
                                        irfNavigator.goBack();
                                        return;
                                    }, function(httpRes){
                                        PageHelper.showProgress('update-loan', 'Some error occured while updating the details. Please try again', 2000);
                                        PageHelper.showErrors(httpRes);
                                    }
                                )
                        }, function(){
                            $log.info("User selected No");
                        })
                    }, function(httpRes){
                        PageHelper.showProgress('update-loan', 'Some error occured while updating the details. Please try again', 2000);
                        PageHelper.showErrors(httpRes);
                    });
                },
                getPreClosureDetails:function(model,form,formname){
                    PageHelper.showLoader();
                    //PageHelper.showProgress('preclosure', 'Getting PreClosure Details', 2000);
                    if(model._currentDisbursement.scheduledDisbursementDate==null){
                        PageHelper.hideLoader();
                        PageHelper.showProgress('preclosure', 'Scheduled Disbursement Date is mandatory', 2000);
                        return false
                    }
                    var reqData={
                        linkedAccountId:model.loanAccount.linkedAccountNumber,
                        valueDate:moment(model._currentDisbursement.scheduledDisbursementDate).format("YYYY-MM-DD")
                    };
                    IndividualLoan.getPreClosureDetails(reqData).$promise.then(function(response){
                        PageHelper.hideLoader();
                        PageHelper.showProgress('preclosure', 'Preclosure loan details are generated', 2000);
                        model.loanAccount.precloseuredetails=true;
                        model.loanAccount.precloseurePayOffAmount=response.part1;
                        model.loanAccount.precloseurePayOffAmountWithDue=(response.amount1?accounting.unformat(response.amount1): 0) +  (response.part7?accounting.unformat(response.part7):0);
                        model.loanAccount.precloseurePrincipal=model.loanAccount.disbursementSchedules[0].linkedAccountTotalPrincipalDue= response.part3?accounting.unformat(response.part3):0;
                        model.loanAccount.precloseureNormalInterest=model.loanAccount.disbursementSchedules[0].linkedAccountNormalInterestDue=response.part4?accounting.unformat(response.part4):0;
                        model.loanAccount.precloseurePenalInterest=model.loanAccount.disbursementSchedules[0].linkedAccountPenalInterestDue=response.part5?accounting.unformat(response.part5):0;
                        model.loanAccount.precloseureTotalPreclosureFee=(response.part7?accounting.unformat(response.part7):0); 
                        model.loanAccount.precloseureTotalFee=((response.part6?accounting.unformat(response.part6):0) - (response.part7?accounting.unformat(response.part7):0));
                        model.loanAccount.precloseureTotalPreclosureFee=model.loanAccount.disbursementSchedules[0].linkedAccountPreclosureFee=(response.part7?accounting.unformat(response.part7):0);
                        model.loanAccount.preTotalFee=model.loanAccount.disbursementSchedules[0].linkedAccountTotalFeeDue= (model.loanAccount.precloseureTotalFee + model.loanAccount.precloseureTotalPreclosureFee);
                        model.loanAccount.disbursementSchedules[0].linkedAccountPayOffAmountWithDue=model.loanAccount.precloseurePayOffAmountWithDue;
                        model.linkedAccountCbsData={};
                        
                        if (!(_.isNull(model.loanAccount.transactionType))) {
                            LoanAccount.get({
                               accountId: model.loanAccount.linkedAccountNumber
                           })
                           .$promise.then(function(res){
                               model.linkedAccountCbsData=res;
                           },function(err){
                               $log.info("loan request Individual/find api failure" + err);
                           });
                        }
                    },function(error){
                        model.loanAccount.precloseuredetails=false;
                        PageHelper.showProgress('preclosure', 'Error Getting Preclosure loan details', 2000);
                        $log.info(error);
                        PageHelper.hideLoader();
                    });
                },
                validateWaiverAmount: function(amount1,amount2,model) {
                    model.loanAccount.waiverdocumentId='';
                    iswaiverApplicable(model);
                    PageHelper.clearErrors();
                    amount2= parseFloat(amount2);
                    if (amount1> parseFloat(amount2)) {
                        PageHelper.clearErrors();
                        PageHelper.setError({
                            message: "Amount should not be greater then" +" " + amount2
                        });
                        return
                    }
                },
                reject: function (model, form, formName) {
                    $log.info("rejecting");

                    Utils.confirm("Are you sure you want to send back to Loan Input?")
                        .then(function(){
                            var reqData = { 'loanAccount': _.cloneDeep(model.loanAccount), 'loanProcessAction': 'PROCEED', 'stage':'LoanInitiation'};
                            PageHelper.showProgress('update-loan', 'Working...');
                            return IndividualLoan.update(reqData)
                                .$promise
                                .then(
                                    function(res){
                                        PageHelper.showProgress('update-loan', 'Done', 2000);
                                        // $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue'});
                                        irfNavigator.goBack();
                                        return;
                                    }, function(httpRes){
                                        PageHelper.showProgress('update-loan', 'Some error occured while updating the details. Please try again', 2000);
                                        PageHelper.showErrors(httpRes);
                                    }
                                )
                        }, function(){
                            $log.info("User selected No");
                        })
                },
                reenter: function (model, formCtrl, form, $event) {
                    $state.go("Page.Engine", {
                        pageName: 'loans.individual.booking.PendingQueue',
                        pageId: null
                    });
                },
                sendBack: function(model, formCtrl, form, $event){
                    $log.info("Inside sendBack()");
                    if (_.isEmpty(model.review.remarks) || _.isEmpty(model.review.targetStage)) {
                        PageHelper.showProgress("update-loan", "Please Enter Remarks and Stage.", 3000);
                        return false;
                    }
                    Utils.confirm("Are You Sure?").then(function () {
                        model.loanAccount.loanDocuments = [];
                        if (model.allExistingDocs) {
                            for (var i = 0; i < model.allExistingDocs.length; i++) {
                                if(model.allExistingDocs[i].documentId){
                                    model.loanAccount.loanDocuments.push(model.allExistingDocs[i]);
                                }
                            }
                        }
                        if (model.remainingDocsArray) {
                            for (var i = 0; i < model.remainingDocsArray.length; i++) {
                                if (model.remainingDocsArray[i].documentId) {
                                    model.loanAccount.loanDocuments.push(model.remainingDocsArray[i]);
                                }
                            }
                        }
                        var reqData = { loanAccount: _.cloneDeep(model.loanAccount) };
                        reqData.loanAccount.status = '';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.remarks = model.review.remarks;
                        reqData.stage = model.review.targetStage;
                        reqData.remarks = model.review.remarks;
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function (res) {
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                // $state.go('Page.Engine', {
                                //     pageName: 'loans.individual.booking.DocumentUploadQueue'
                                // });
                                irfNavigator.goBack();
                            }, function (httpRes) {
                                PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                    })

                },
                proceed: function (model, form, formName) {
                    $log.info("submitting");
                    PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                    }
                    if(showNetDisbursmentDetails =="Y"){
                        /* removed for temporal fix for kinara 
                        if(model.preOpenFeeData.netDisbursementAmount<0){
                            PageHelper.setError({
                                message: "disubrsement amount can not be less than : 0" 
                            });
                           return;
                          
                        }*/
                        if(!preLoanAccountSave){
                            PageHelper.setError({
                                message: "Please save account before proceeding"
                            });
                            PageHelper.hideLoader();
                            return false;
                        }
                        model.loanAccount.estimatedEmi=computeEMI(model);	                        

                    }
                    var cbsdate=SessionStore.getCBSDate();
                    if(model._currentDisbursement.scheduledDisbursementDate)
                        var scheduledDisbursementDate = moment(model._currentDisbursement.scheduledDisbursementDate,SessionStore.getSystemDateFormat());
                    if(model._currentDisbursement.scheduledDisbursementDate && cbsdate)
                        var BackedDatedDiffDays = scheduledDisbursementDate.diff(cbsdate, "days");
                        var BackedDatedDiffmonth = scheduledDisbursementDate.diff(cbsdate, "month");
                    if(model.loanAccount.sanctionDate)
                        var sanctionDate = moment(model.loanAccount.sanctionDate,SessionStore.getSystemDateFormat());
                    if(model._currentDisbursement.customerSignatureDate)
                        var customerSignatureDate = moment(model._currentDisbursement.customerSignatureDate,SessionStore.getSystemDateFormat());
                    if(model._currentDisbursement.scheduledDisbursementDate && model.loanAccount.sanctionDate)
                        var diffDays = scheduledDisbursementDate.diff(sanctionDate, "days");
                    if(model.loanAccount.firstRepaymentDate)
                        var firstRepaymentDate = moment(model.loanAccount.firstRepaymentDate,SessionStore.getSystemDateFormat());
                    if (model.loanAccount.firstRepaymentDate && repaymentDaysValidationExist){
                        if(_.isArray(repaymentDates)){
                            var date = firstRepaymentDate.get("date");
                            if(!_.includes(repaymentDates, date)){
                                PageHelper.showProgress("loan-create","First repayment date should be " + repaymentDates ,10000);
                                return false;
                            }
                        }
                    }

                    if (model.allowPreEmiInterest && (model.siteCode == 'IREPDhan' || model.siteCode == 'maitreya')) {
                        var diffDay = 0;
                        var scheduleStartDate;
                        if(model.loanAccount.scheduleStartDate){
                            scheduleStartDate = moment(model.loanAccount.scheduleStartDate, SessionStore.getSystemDateFormat());
                        }
                        if(scheduleStartDate && scheduledDisbursementDate){
                            diffDay = scheduleStartDate.diff(scheduledDisbursementDate, "days");
                        }
                        if (diffDay > 0) {
                            model.loanAccount.firstRepaymentDate = scheduleStartDate.format("YYYY-MM-DD");
                        }
                        for (var i = 0; i < model.loanAccount.disbursementSchedules.length; i++) {
                            model.loanAccount.disbursementSchedules[i].moratoriumPeriodInDays = diffDay;
                        }
                    }

                    var cbsmonth = ((new Date(cbsdate)).getMonth());
                    var dismonth = ((new Date(scheduledDisbursementDate)).getMonth());

                    //$log.info(BackedDatedDiffmonth);
                    /* 1) Loc-Renewal chnage includes default processing fee to 0.2 ans calculation of process amount 
                    */
                    if (!validateWaiverDetails(model)){
                        return;
                    }
                    if(!validateDisbursementDate(model)){
                        return;
                    };

                    if(model.loanAccount.transactionType && model.loanAccount.transactionType !='New Loan'){
                         if(!model.loanAccount.precloseuredetails){
                            PageHelper.setError({
                                message: "Please Generate Linked Account Details by clicking Submit" 
                            });
                            return;
                         }
                    }

                    if(model.loanAccount.linkedAccountNumber && model.siteCode == 'kinara'){
                        if(model.loanAccount.transactionType && model.loanAccount.transactionType.toLowerCase()=='renewal'){
                            model.loanAccount.processingFeePercentage=0.2;
                            model.loanAccount.processingFeeInPaisa=(2*model.loanAccount.loanAmount);
                        }
                        var loanfee = parseInt(model.loanAccount.processingFeeInPaisa / 100) + model.loanAccount.commercialCibilCharge + model.loanAccount.portfolioInsurancePremium + parseInt(model.loanAccount.portfolioInsuranceServiceCharge - model.loanAccount.portfolioInsuranceServiceTax) + model.loanAccount.fee3 + model.loanAccount.fee4 + model.loanAccount.fee5 + model.loanAccount.securityEmi;
                        if (loanfee) {
                            var netdisbursementamount = model.loanAccount.disbursementSchedules[0].disbursementAmount - loanfee;
                        }
                        var linkedaccountoutstanding = (parseInt(model.loanAccount.precloseurePrincipal) + parseInt(model.loanAccount.precloseureNormalInterest) + parseInt(model.loanAccount.precloseurePenalInterest) + parseInt(model.loanAccount.precloseureTotalFee)) -
                            (
                                parseInt(model.loanAccount.disbursementSchedules[0].normalInterestDuePayment) +
                                parseInt(model.loanAccount.disbursementSchedules[0].penalInterestDuePayment) +
                                parseInt(model.loanAccount.disbursementSchedules[0].feeAmountPayment)
                            );
                        if(parseInt(netdisbursementamount) < parseInt(linkedaccountoutstanding)){
                            PageHelper.setError({
                                message: "New loan First schedule disbursement amount with fees" + " " +netdisbursementamount+ " "+ "should  be greater then Linked Account Balence with Waiver amount" +"  " + linkedaccountoutstanding
                            });
                           return;
                        }
            
                            if(model.loanAccount.waiverdocumentstatus){
                                if(model.loanAccount.loanDocuments && model.loanAccount.loanDocuments.length>0){
                                    for(documents of model.loanAccount.loanDocuments){
                                        if(documents.document=='WAIVERAPPROVAL'){
                                            documents.documentId=model.loanAccount.waiverdocumentId;
                                            documents.documentStatus=model.loanAccount.waiverdocumentstatus;
                                            documents.rejectReason=model.loanAccount.waiverdocumentrejectReason;
                                            documents.remarks=model.loanAccount.waiverdocumentremarks; 
                                        }
                                    }
                                }
                            }else{
                                model.loanAccount.loanDocuments.push({
                                    loanId:model.loanAccount.id,
                                    documentId:model.loanAccount.waiverdocumentId,
                                    document:"WAIVERAPPROVAL",
                                    accountNumber:model.loanAccount.accountNumber,
                                    documentStatus:"PENDING",
                                });
                            }
                         
                    }

                    if(model.siteCode != 'sambandh' && model.siteCode != 'saija'){

                        if(model.siteCode != 'witfin' && model.siteCode != 'maitreya') {
                            if(model.postDatedTransactionNotAllowed) {
                                if (customerSignatureDate.diff(cbsdate, "days") <0) {
                                    PageHelper.showProgress("loan-create", "Customer signature date should be greater than or equal to system date", 5000);
                                    return false;
                                }
                            }
                        }

                        if(model.BackedDatedDisbursement && model.BackedDatedDisbursement=="ALL"){
                            if (scheduledDisbursementDate.diff(cbsdate, "days") <0) {
                                PageHelper.showProgress("loan-create", "scheduledDisbursementDate date should be greater than CBS date", 5000);
                                return false;
                            }
                        }

                        if(model.BackedDatedDisbursement && model.BackedDatedDisbursement=="CURRENT_MONTH"){
                            if (scheduledDisbursementDate.diff(cbsdate, "days") <0 && (cbsmonth !== dismonth)) {
                                PageHelper.showProgress("loan-create", "scheduledDisbursementDate date should not be a previous month of CBS date", 5000);
                                return false;
                            }
                        }
                        if (diffDays > pendingDisbursementDays) {
                            PageHelper.showProgress("loan-create", "Difference between Loan sanction date and disbursement date is greater than " + pendingDisbursementDays + " days", 5000);
                            return false;
                        }
                
                        if(model.siteCode != 'witfin'){
                            if (customerSignatureDate.isBefore(sanctionDate)) {
                                PageHelper.showProgress("loan-create", "Customer sign date should be greater than the Loan sanction date", 5000);
                                return false;
                            }
                        }

                        if (model.loanAccount.firstRepaymentDate) {
                            if (firstRepaymentDate.diff(scheduledDisbursementDate, "days") <= 0) {
                                PageHelper.showProgress("loan-create", "Repayment date should be greater than sanction date", 5000);
                                return false;
                            }
                        }
                    }
                    
                    if(model.siteCode == 'sambandh' || model.siteCode == 'saija'||model.siteCode == 'kinara' || model.siteCode == 'IREPDhan') {
                        if (scheduledDisbursementDate.diff(customerSignatureDate,"days") < 0){
                            PageHelper.showProgress("loan-create","Scheduled disbursement date should be greater than or equal to Customer sign date",5000);
                            return false;
                        }
                    }
                    else  {
                        if(model.siteCode != 'witfin' && model.siteCode != 'maitreya'){
                            if (scheduledDisbursementDate.diff(customerSignatureDate,"days") <= 0){
                                PageHelper.showProgress("loan-create","Scheduled disbursement date should be greater than Customer sign date",5000);
                                return false;
                            }
                        }
                    }
                    
                    var validatePromise = [];
                    if(model.siteCode == 'sambandh' && SessionStore.getGlobalSetting('individualLoan.cbCheck.required') == "true" && 
                        model.loanAccount.loanAmount >= Number(SessionStore.getGlobalSetting('individualLoan.cbCheck.thresholdAmount'))) {
                        validatePromise.push(isCBCheckValid(model));
                    }

                    if(model.basicLoanDedupe) {
                        validatePromise.push(doBasicLoanDedupeCheck(model));
                    }

                    $q.all(validatePromise).then(function() {
                        Utils.confirm("Ready to book the loan?")
                        .then(function(){
                            model.loanAccount.disbursementSchedules[model.loanAccount.numberOfDisbursed].customerSignatureDate = model._currentDisbursement.customerSignatureDate;
                            model.loanAccount.disbursementSchedules[model.loanAccount.numberOfDisbursed].scheduledDisbursementDate = model._currentDisbursement.scheduledDisbursementDate;
                            model.loanAccount.disbursementSchedules[model.loanAccount.numberOfDisbursed].linkedAccountSecurityDeposit=model.loanAccount.totalSecurityDepositDue;
                            var reqData = { 'loanAccount': _.cloneDeep(model.loanAccount), 'loanProcessAction': 'PROCEED'};
                            PageHelper.showProgress('update-loan', 'Working...');
                            return IndividualLoan.update(reqData)
                                .$promise
                                .then(
                                    function(res){
                                        PageHelper.showProgress('update-loan', 'Done', 2000);
                                        // $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue'});
                                        irfNavigator.goBack();
                                        return;
                                    }, function(httpRes){
                                        PageHelper.showProgress('update-loan', 'Some error occured while updating the details. Please try again', 2000);
                                        PageHelper.showErrors(httpRes);
                                    }
                                )
                        }, function(){
                            $log.info("User selected No");
                        })
                    }, function(httpRes){
                        PageHelper.showProgress('update-loan', 'Some error occured while updating the details. Please try again', 2000);
                        PageHelper.showErrors(httpRes);
                    });
                },
                save: function(model, formCtrl, form, $event){

                    
                    if (model.loanAccount.precloseuredetails) {
                        /**checking the waiver document details */
                        if(!model.loanAccount.waiverdocumentId && model.iswaiverApplicable){
                            PageHelper.clearErrors();
                            PageHelper.setError({
                                message: "Upload the waiver document"
                            });
                            return;
                        }
                        /**checking the waiver details amount adjustment is correct or wrong */
                        if (model.loanAccount.disbursementSchedules[0].normalInterestDuePayment && model.loanAccount.disbursementSchedules[0].normalInterestDuePayment > 0) {
                            if (model.loanAccount.precloseureNormalInterest < model.loanAccount.disbursementSchedules[0].normalInterestDuePayment) {
                                PageHelper.clearErrors();
                                PageHelper.setError({
                                    message: "Amount should not be greater then" + " " + model.loanAccount.precloseureNormalInterest
                                });
                                return;
                            }
                        }
                        if (model.loanAccount.disbursementSchedules[0].penalInterestDuePayment && model.loanAccount.disbursementSchedules[0].penalInterestDuePayment > 0) {
                            if (model.loanAccount.precloseurePenalInterest < model.loanAccount.disbursementSchedules[0].penalInterestDuePayment) {
                                PageHelper.clearErrors();
                                PageHelper.setError({
                                    message: "Waiver Details: Total Penal Interest due Amount should not be greater then" + " " + model.loanAccount.precloseurePenalInterest
                                });
                                return;
                            }
                        }
                        if (model.loanAccount.disbursementSchedules[0].feeAmountPayment && model.loanAccount.disbursementSchedules[0].feeAmountPayment > 0)
                            if ((model.loanAccount.precloseureTotalFee + model.loanAccount.precloseureTotalPreclosureFee) < model.loanAccount.disbursementSchedules[0].feeAmountPayment) {
                                PageHelper.clearErrors();
                                PageHelper.setError({
                                    message: "Waiver Details: Total Fee due Amount should not be greater then" + " " + model.loanAccount.precloseureTotalFee + loanAccount.precloseureTotalPreclosureFee
                                });
                                return;
                            }
                    }

                    if(model.loanAccount.waiverdocumentstatus){
                        if(model.loanAccount.loanDocuments && model.loanAccount.loanDocuments.length>0){
                            for(documents of model.loanAccount.loanDocuments){
                                if(documents.document=='WAIVERAPPROVAL'){
                                    documents.documentId=model.loanAccount.waiverdocumentId;
                                    documents.documentStatus=model.loanAccount.waiverdocumentstatus;
                                    documents.rejectReason=model.loanAccount.waiverdocumentrejectReason;
                                    documents.remarks=model.loanAccount.waiverdocumentremarks; 
                                }
                            }
                    }else{
                        model.loanAccount.loanDocuments.push({
                            loanId:model.loanAccount.id,
                            documentId:model.loanAccount.waiverdocumentId,
                            document:"WAIVERAPPROVAL",
                            accountNumber:model.loanAccount.accountNumber,
                            documentStatus:"PENDING",
                        });
                    }
                }

                    if(model.loanAccount.waiverdocumentId){
                        model.loanAccount.loanDocuments.push({
                            loanId:model.loanAccount.id,
                            documentId:model.loanAccount.waiverdocumentId,
                            document:"WAIVERAPPROVAL",
                            accountNumber:model.loanAccount.accountNumber,
                            documentStatus:"PENDING",
                        });
                    }
        
                    if(model.loanAccount.firstRepaymentDate)
                        var firstRepaymentDate = moment(model.loanAccount.firstRepaymentDate,SessionStore.getSystemDateFormat());
                    if (model.loanAccount.firstRepaymentDate && repaymentDaysValidationExist){
                        if(_.isArray(repaymentDates)){
                            var date = firstRepaymentDate.get("date");
                            if(!_.includes(repaymentDates, date)){
                                PageHelper.showProgress("loan-create","First repayment date should be " + repaymentDates ,10000);
                                return false;
                            }
                        }
                    }

                    var reqData = { 'loanAccount': _.cloneDeep(model.loanAccount), 'loanProcessAction': 'SAVE'};
                    PageHelper.showProgress('update-loan', 'Working...');
                    return IndividualLoan.update(reqData)
                        .$promise
                        .then(
                            function(res){
                                PageHelper.showProgress('update-loan', 'Done', 2000);
                                model.loanAccount.version=res.loanAccount.version;
                                var objTest1=null;
                                model.loanAccount.loanDocuments=res.loanAccount.loanDocuments;
                                model.loanAccount.loanDocuments = model.loanAccount.loanDocuments.filter(function(obj, index, arr){
                                   
                                    if(obj.document=='WAIVERAPPROVAL'){
                                        objTest1=obj;
                                       
                                    }
                                    return obj.document !='WAIVERAPPROVAL';
                                
                                });
                                if(objTest1){
                                    model.loanAccount.loanDocuments.push(objTest1);
                                }
                                if(model.loanAccount.loanDocuments && model.loanAccount.loanDocuments.length>0){
                                    for(documents of model.loanAccount.loanDocuments){
                                      if(documents.document=='WAIVERAPPROVAL'){
                                            model.loanAccount.waiverdocumentId= documents.documentId;
                                            model.loanAccount.waiverdocumentstatus= documents.documentStatus;
                                            model.loanAccount.waiverdocumentrejectReason=documents.rejectReason;
                                            model.loanAccount.waiverdocumentremarks=documents.remarks;
                                        }
                                    }
                                }
                                if(showNetDisbursmentDetails =="Y"){
                                    KinaraIndividualLoanHelper.computePreOpenFeeData(model);
                                }
                                preLoanAccountSave=true;
                              
                            }, function(httpRes){
                                PageHelper.showProgress('update-loan', 'Some error occured while updating the details. Please try again', 2000);
                                PageHelper.showErrors(httpRes);
                            }
                    )
                },
            }
        };
    }]);
