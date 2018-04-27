define(
    // [
    //     "perdix/domain/model/loan/LoanProcess",
    //     "perdix/infra/helpers/NGHelper",
    // ],
    function(){
        // LoanProcess = LoanProcess["LoanProcess"];
        // NGHelper = NGHelper["NGHelper"];
    return {
        pageUID: "witfin.loans.individual.screening.VehicleDetails",
        pageType: "Engine",
        dependencies: ["$log", "$q","LoanAccount","LoanProcess", 'Scoring', 'Enrollment','EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
            'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor","UIRepository", "$injector", "irfNavigator"],

        $pageFn: function($log, $q, LoanAccount,LoanProcess, Scoring, Enrollment,EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper,formHelper,elementsUtils,
                          irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
                          BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();


            var self;
            // var validateForm = function(formCtrl){
            //     formCtrl.scope.$broadcast('schemaFormValidate');
            //     if (formCtrl && formCtrl.$invalid) {
            //         PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
            //         return false;
            //     }
            //     return true;
            // };

            // var getRelationFromClass = function(relation){
            //     if (relation == 'guarantor'){
            //         return 'Guarantor';
            //     } else if (relation == 'applicant'){
            //         return 'Applicant';
            //     } else if (relation == 'co-applicant'){
            //         return 'Co-Applicant';
            //     }
            // };



            var configFile = function() {
                return {

                }
            }

            var getIncludes = function (model) {

                return [
                    "VehicleLoanIncomesInformation",
                    "VehicleLoanIncomesInformation.VehicleLoanIncomes",
                    "VehicleLoanIncomesInformation.VehicleLoanIncomes.incomeType",
                    "VehicleLoanIncomesInformation.VehicleLoanIncomes.incomeAmount",
                    "VehicleExpensesInformation",
                    "VehicleExpensesInformation.VehicleExpenses",
                    "VehicleExpensesInformation.VehicleExpenses.expenseType",
                    "VehicleExpensesInformation.VehicleExpenses.expenseAmount",
                    "actionbox",
                    "actionbox.save"
                ];

            }

            return {
                "type": "schema-form",
                "title": "VEHICLE_DETAILS",
                "subTitle": "DETAILS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // AngularResourceService.getInstance().setInjector($injector);

                    /* Setting data recieved from Bundle */
                    model.loanAccount = model.loanProcess.loanAccount;

                    self = this;
                    var formRequest = {
                        "overrides": {},
                        "includes": getIncludes (model),
                        "excludes": [],
                        "options": {}
                    };
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;

                    p1.then(function(repo) {
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
                    }, function(err){
                        console.log(err);
                    })
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
                    "lead-loaded": function(bundleModel, model, obj) {
                        model.lead = obj;
                        model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                        model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                        model.loanAccount.loanPurpose2 = obj.loanPurpose2;
                        model.loanAccount.screeningDate = obj.screeningDate || moment().format("YYYY-MM-DD");
                    },
                    "get-vehicle-price": function(bundleModel, model, obj) {
                        $log.info(obj);
                        model.vehiclePriceDetails = obj;
                    }
                },
                form: [],
                schema: function() {
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {
                    // preSave: function(model, form, formName) {
                    //     var deferred = $q.defer();
                    //     if (model.customer.firstName) {
                    //         deferred.resolve();
                    //     } else {
                    //         irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                    //         deferred.reject();
                    //     }
                    //     return deferred.promise;
                    // },
                    save: function(model, formCtrl, form, $event){
                        /* Loan SAVE */
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        // if (!model.loanAccount.id){
                        //     model.loanAccount.isRestructure = false;
                        //     model.loanAccount.documentTracking = "PENDING";
                        //     model.loanAccount.psychometricCompleted = "NO";

                        // }
                        PageHelper.showLoader();
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {

                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);
                            }, function (err) {
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                    },
                    // sendBack: function(model, formCtrl, form, $event){
                    //     PageHelper.showLoader();
                    //     model.loanProcess.sendBack()
                    //         .finally(function () {
                    //             PageHelper.hideLoader();
                    //         })
                    //         .subscribe(function (value) {

                    //             PageHelper.showProgress('enrolment', 'Done.', 5000);
                    //             irfNavigator.goBack();
                    //         }, function (err) {
                    //             PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                    //             PageHelper.showErrors(err);
                    //             PageHelper.hideLoader();
                    //         });

                    // },
                    // proceed: function(model, formCtrl, form, $event){
                    //     if(PageHelper.isFormInvalid(formCtrl)) {
                    //         return false;
                    //     }
                    //     PageHelper.clearErrors();
                    //     PageHelper.showLoader();
                    //     PageHelper.showProgress('enrolment', 'Updating Loan');
                    //     model.loanProcess.proceed()
                    //         .finally(function () {
                    //             PageHelper.hideLoader();
                    //         })
                    //         .subscribe(function (value) {

                    //             Utils.removeNulls(value, true);
                    //             PageHelper.showProgress('enrolment', 'Done.', 5000);
                    //             irfNavigator.goBack();
                    //         }, function (err) {
                    //             PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                    //             PageHelper.showErrors(err);
                    //             PageHelper.hideLoader();
                    //         });
                    // },
                    // reject: function(model, formCtrl, form, $event){
                    //     PageHelper.showLoader();
                    //      model.loanProcess.reject()
                    //         .finally(function () {
                    //             PageHelper.hideLoader();
                    //         })
                    //         .subscribe(function (value) {
                    //             Utils.removeNulls(value, true);
                    //             PageHelper.showProgress('enrolment', 'Done.', 5000);
                    //             irfNavigator.goBack();
                    //         }, function (err) {
                    //             PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                    //             PageHelper.showErrors(err);
                    //             PageHelper.hideLoader();
                    //         });
                    // }
                }
            };

        }
    }
});
