irf.pageCollection.factory(irf.page("loans.individual.booking.LoanBooking"),
    ["$log", "IndividualLoan", "SessionStore", "$state", "$stateParams", "SchemaResource", "PageHelper", "Enrollment", "Utils", function ($log, IndividualLoan, SessionStore, $state, $stateParams, SchemaResource, PageHelper, Enrollment, Utils) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "CONFIRM_LOAN_BOOKING",
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
                "title": "LOAN BOOKING DETAILS", // sample label code
                "colClass": "col-sm-6", // col-sm-6 is default, optional
                //"readonly": false, // default-false, optional, this & everything under items becomes readonly
                "items": [
                    {
                        "key": "_currentDisbursement.customerSignatureDate",
                        "title": "CUSTOMER_SIGNATURE_DATE",
                        "type": "date",
                        "required": true
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
                        }, {
                            "type": "submit",
                            "title": "CONFIRM_LOAN_CREATION"
                        }]
                    }
                ]
            }, {
                "type": "box",
                "title": "LOAN ACCOUNT DETAILS", // sample label code
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
                        "key": "loanAccount.repayment",
                        "title": "REPAYMENT_TENURE",
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
                    {
                        "key": "loanAccount.loanPurpose2",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.loanPurpose3",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.customer.centreCode",
                        "title": "CENTRE",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.interestRate",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.processingFeeInPaisa",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.cibilCharges",
                        "title": "CIBIL_CHARGES",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.repayment",
                        "title": "REPAYMENT_MODE",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.sanction_amount",
                        "title": "SANCTION_AMOUNT",
                        "readonly": true
                    },
                    {
                        "key": "loanAccount.sanctionDate",
                        "readonly": true
                    },
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
                                    },
                                    {
                                        "key": "loanAccount.guarantors[].guaDob",

                                        "readonly": true
                                    },
                                    {
                                        "key": "loanAccount.guarantors[].address",

                                        "readonly": true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "fieldset",
                        "title": "COLLATERAL DETAILS",
                        "items": [
                            {
                                "key": "loanAccount.collateral.collateralType",
                                "readonly": true
                            },
                            {
                                "key": "loanAccount.collateral.collateralDescription",
                                "readonly": true
                            },
                            {
                                "key": "loanAccount.collateral.collateralValue",
                                "readonly": true
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
                reenter: function (model, formCtrl, form, $event) {
                    $state.go("Page.Engine", {
                        pageName: 'IndividualLoanBooking',
                        pageId: model.customer.id
                    });
                }
            }
        };
    }]);
