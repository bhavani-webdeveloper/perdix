irf.pageCollection.factory(irf.page("loans.individual.booking.LoanBooking"),
    ["$log", "irfNavigator","IndividualLoan", "SessionStore", "$state", "$stateParams", "SchemaResource", "PageHelper","PagesDefinition", "Enrollment", "Utils","Queries", "$q",
    function ($log, irfNavigator, IndividualLoan, SessionStore, $state, $stateParams, SchemaResource, PageHelper,PagesDefinition, Enrollment, Utils,Queries, $q) {

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
            var validUrns = [model.loanAccount.customer.urnNo];
            var urns = [], invalidUrns = [];

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

        var populateDisbursementDate = function(modelValue,form,model){
            if (modelValue){
                modelValue = new Date(modelValue);
                model._currentDisbursement.scheduledDisbursementDate = new Date(modelValue.setDate(modelValue.getDate()+1));
            }
        };

        return {
            "type": "schema-form",
            "title": "CAPTURE_DATES",
            initialize: function (model, form, formCtrl) {
                $log.info("Individual Loan Booking Page got initialized");
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                PageHelper.showProgress('load-loan', 'Loading loan account...');
                PagesDefinition.getPageConfig("Page/Engine/loans.individual.booking.LoanInput").then(function(data) {
                    $log.info(data);
                    if (data.showLoanBookingDetails != undefined && data.showLoanBookingDetails !== null && data.showLoanBookingDetails != "") {
                        model.showLoanBookingDetails = data.showLoanBookingDetails;
                        model.BackedDatedDisbursement = data.BackedDatedDisbursement;
                    }
                    //stateParams
                    console.log(model.BackedDatedDisbursement);
                    console.log(model.showLoanBookingDetails);
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

                            model.loanAccount = res;
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

                            Queries.getCustomerBasicDetails({
                                urns: urns,
                                ids: ids
                            }).then(
                                function (resQuery) {
                                    if (_.hasIn(resQuery.urns, model.loanAccount.applicant))
                                        model.loanAccount.applicantName = resQuery.urns[model.loanAccount.applicant].first_name;
                                    
                                    if (_.hasIn(resQuery.urns, model.loanAccount.portfolioInsuranceUrn))
                                        model.loanAccount.portfolioInsuranceCustomerName = resQuery.urns[model.loanAccount.portfolioInsuranceUrn].first_name;
                                   
                                    
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
                "title": "UPDATE_ACCOUNT", // sample label code
                "colClass": "col-sm-6", // col-sm-6 is default, optional
                //"readonly": false, // default-false, optional, this & everything under items becomes readonly
                "items": [
                    {
                        "key": "_currentDisbursement.customerSignatureDate",
                        "title": "CUSTOMER_SIGNATURE_DATE",
                        "type": "date",
                        "required": true,
                        "onChange":function(modelValue,form,model){
                            populateDisbursementDate(modelValue,form,model);
                        }
                    },
                    {
                        "key": "_currentDisbursement.scheduledDisbursementDate",
                        "title": "SCHEDULED_DISBURSEMENT_DATE",
                        "type": "date",
                        "required": true
                    },
                    {
                        key: "loanAccount.emiPaymentDateRequested",
                        condition : "model.siteCode != 'sambandh'",
                        type: "string",
                        title: "EMI_PAYMENT_DATE_REQUESTED",
                        readonly: true
                    },
                    {
                        "key": "loanAccount.firstRepaymentDate",
                        "title": "REPAYMENT_DATE",
                        "type": "date",
                        "required": true
                    }
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
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.customer.firstName",
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
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanPurpose1",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanPurpose2",
                        "readonly": true,
                        "condition": "model.siteCode == 'sambandh'"
                    },
                    // {
                    //     "key": "loanAccount.loanPurpose3",
                    //     "readonly": true
                    // },
                     {
                        "key": "loanAccount.branch",
                        "condition": "model.siteCode == 'sambandh'",
                        "title": "BRANCH",
                        "type": "string",
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
                        "condition": "model.siteCode != 'sambandh'",
                        "title": "INSURANCE",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.commercialCibilCharge",
                        "condition": "model.siteCode != 'sambandh'",
                        "title": "CIBIL_CHARGES",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanAmountRequested",
                        "condition": "model.siteCode != 'sambandh'",
                        "title": "LOAN_AMOUNT_REQUESTED",
                        "type":"amount",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.securityEmiRequired",
                        "condition": "model.siteCode != 'sambandh'",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.sanctionDate",
                        "condition": "model.siteCode != 'sambandh'",
                        "readonly": true
                    },
                    {
                        "key":"additional.portfolioUrnSelector",
                        "condition": "model.siteCode == 'sambandh'",
                        "type":"string",
                        "readonly": true                     
                    },
                    {
                        key:"loanAccount.portfolioInsuranceUrn",
                        "condition": "model.siteCode == 'sambandh'",
                        "title":"URN_NO",
                        "readonly": true
                    },
                    {
                        key: "loanAccount.portfolioInsuranceCustomerName",
                        "condition": "model.siteCode == 'sambandh'",
                        title: "NAME",
                        readonly: true
                    }
                    /*,
                    {
                        "type": "fieldset",
                        "title": "GUARANTOR_DETAILS",
                        "items": [
                            {
                                "key": "loanAccount.guarantors",
                                "type": "array",
                                "add": null,
                                "remove": null,
                                "items": [
                                    {
                                        "key": "loanAccount.guarantors[].guaUrnNo",

                                        "readonly": true
                                    },
                                    {
                                        "key": "loanAccount.guarantors[].guaFirstName",

                                        "readonly": true
                                    }
                                ]
                            }
                        ]
                    }*/,
                    {
                        "type": "fieldset",
                        "condition": "model.siteCode != 'sambandh'",
                        "notitle": true,
                        "items": [
                            {
                                "key":"loanAccount.collateral",
                                "title":"COLLATERAL",
                                "type":"array",
                                "readonly": true,
                                "items":[
                                    {
                                        "key":"loanAccount.collateral[].collateralType",
                                        "type":"select"
                                    },
                                    {
                                        "key":"loanAccount.collateral[].collateralDescription"
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
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "actionbox",
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
                }]
            }],
            schema: function () {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                submit: function (model, form, formName) {
                    $log.info("submitting");
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
                    if (model.loanAccount.firstRepaymentDate){
                        var date = firstRepaymentDate.get("date");
                        if(date != 5 && date != 10 && date != 15){
                            PageHelper.showProgress("loan-create","First repayment date should be 5, 10 or 15",5000);
                            return false;
                        }
                    }

                    var cbsmonth = ((new Date(cbsdate)).getMonth());
                    var dismonth = ((new Date(scheduledDisbursementDate)).getMonth());

                    //$log.info(BackedDatedDiffmonth);

                    if(model.siteCode != 'sambandh'){

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
                        if (customerSignatureDate.isBefore(sanctionDate)) {
                            PageHelper.showProgress("loan-create", "Customer sign date should be greater than the Loan sanction date", 5000);
                            return false;
                           }
                        if (model.loanAccount.firstRepaymentDate) {
                            if (firstRepaymentDate.diff(scheduledDisbursementDate, "days") <= 0) {
                                PageHelper.showProgress("loan-create", "Repayment date should be greater than sanction date", 5000);
                                return false;
                            }
                        }
                    }
                    
                    if(model.siteCode == 'sambandh' || model.siteCode == 'saija') {
                        if (scheduledDisbursementDate.diff(customerSignatureDate,"days") < 0){
                            PageHelper.showProgress("loan-create","Scheduled disbursement date should be greater than or equal to Customer sign date",5000);
                            return false;
                        }
                    }
                    else  {
                        if (scheduledDisbursementDate.diff(customerSignatureDate,"days") <= 0){
                            PageHelper.showProgress("loan-create","Scheduled disbursement date should be greater than Customer sign date",5000);
                            return false;
                        }
                    }
                    
                    var validatePromise = [];
                    if(model.siteCode == 'sambandh' && SessionStore.getGlobalSetting('individualLoan.cbCheck.required') == "true" && 
                        model.loanAccount.loanAmount >= Number(SessionStore.getGlobalSetting('individualLoan.cbCheck.thresholdAmount'))) {
                        validatePromise.push(isCBCheckValid(model));
                    }

                    $q.all(validatePromise).then(function() {
                        Utils.confirm("Ready to book the loan?")
                        .then(function(){
                            model.loanAccount.disbursementSchedules[model.loanAccount.numberOfDisbursed].customerSignatureDate = model._currentDisbursement.customerSignatureDate;
                            model.loanAccount.disbursementSchedules[model.loanAccount.numberOfDisbursed].scheduledDisbursementDate = model._currentDisbursement.scheduledDisbursementDate;

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
                }
            }
        };
    }]);
