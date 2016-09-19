irf.pageCollection.factory(irf.page("loans.individual.booking.LoanBooking"),
    ["$log", "IndividualLoan", "SessionStore", "$state", "$stateParams", "SchemaResource", "PageHelper", "Enrollment", "Utils","Queries",
    function ($log, IndividualLoan, SessionStore, $state, $stateParams, SchemaResource, PageHelper, Enrollment, Utils,Queries) {

        var branch = SessionStore.getBranch();
        var pendingDisbursementDays;

        Queries.getGlobalSettings("loan.individual.booking.pendingDisbursementDays").then(function(value){
            pendingDisbursementDays = Number(value);
            $log.info("pendingDisbursementDays:" + pendingDisbursementDays);
        },function(err){
            $log.info("pendingDisbursementDays is not available");
        });

        var populateDisbursementDate = function(modelValue,form,model){
            if (modelValue){
                modelValue = new Date(modelValue);
                model._currentDisbursement.scheduledDisbursementDate = new Date(modelValue.setDate(modelValue.getDate()+1));
            }
        };

        return {
            "type": "schema-form",
            "title": "CAPTURE_DATES",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                $log.info("Individual Loan Booking Page got initialized");
                PageHelper.showProgress('load-loan', 'Loading loan account...');
                IndividualLoan.get({id: $stateParams.pageId})
                    .$promise
                    .then(
                        function (res) {


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
                        "title": "PARTNER_NAME",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanType",
                        "readonly": true
                    },
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
                        "key": "loanAccount.customer.firstName",
                        "title": "LOAN_AMOUNT",
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
                    /*{
                        "key": "loanAccount.loanPurpose2",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanPurpose3",
                        "readonly": true
                    },*/
                    {
                        "key": "loanAccount.loanCentre.centreId",
                        "title": "CENTRE",
                        "readonly": true,
                        "type":"select"
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
                        "key": "loanAccount.commercialCibilCharge",
                        "title": "CIBIL_CHARGES",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanAmountRequested",
                        "title": "LOAN_AMOUNT_REQUESTED",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.sanctionDate",
                        "readonly": true
                    }/*,
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
            }],
            schema: function () {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                submit: function (model, form, formName) {

                    $log.info("submitting");

                    var scheduledDisbursementDate = new Date(model._currentDisbursement.scheduledDisbursementDate);
                    var sanctionDate = new Date(model.loanAccount.sanctionDate);
                    var customerSignatureDate = new Date(model._currentDisbursement.customerSignatureDate);
                    var diffDays = scheduledDisbursementDate.getDate() - sanctionDate.getDate();

                    if (diffDays > pendingDisbursementDays){
                        PageHelper.showProgress("loan-create","Difference between Loan sanction date and disbursement date is greater than " + pendingDisbursementDays + " days",5000);
                        return false;
                    }
                    if (customerSignatureDate<=sanctionDate){
                        PageHelper.showProgress("loan-create","Customer sign date should be greater than the Loan sanction date",5000);
                        return false;
                    }

                    if (scheduledDisbursementDate<=customerSignatureDate){
                        PageHelper.showProgress("loan-create","Scheduled disbursement date should be greater than Customer sign date",5000);
                        return false;
                    }

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
                                        $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue'});
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
                                        $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue'});
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
