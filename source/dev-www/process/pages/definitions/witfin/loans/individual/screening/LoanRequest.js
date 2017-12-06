define([],function(){

    return {
        pageUID: "witfin.loans.individual.screening.LoanRequest",
        pageType: "Engine",
        dependencies: ["$log", "$q","LoanAccount","LoanProcess", 'Scoring', 'Enrollment','EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
            'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor","UIRepository", "$injector"],

        $pageFn: function($log, $q, LoanAccount,LoanProcess, Scoring, Enrollment,EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper,formHelper,elementsUtils,
                          irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
                          BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector) {
            var branch = SessionStore.getBranch();


            var self;
            var validateForm = function(formCtrl){
                formCtrl.scope.$broadcast('schemaFormValidate');
                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                    return false;
                }
                return true;
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



            var configFile = function() {
                return {
                    "currentStage": {
                        "ScreeningReview": {
                            "overrides": {
                                "LoanRecomendation": {
                                    "readonly": true
                                },
                                "IRR": {
                                    "readonly": true
                                },
                                "postReview": {
                                    "readonly": true
                                }
                            }
                        }
                    }

                }
            }

            var getIncludes = function (model) {

                return [
                    "PreliminaryInformation",
                    "PreliminaryInformation.linkedAccountNumber",
                    "PreliminaryInformation.loan",
                    "PreliminaryInformation.loanPurpose1",
                    "PreliminaryInformation.loanPurpose2",
                    "PreliminaryInformation.loanAmountRequested",
                    "PreliminaryInformation.loanToValue",
                    "PreliminaryInformation.frequencyRequested",
                    "PreliminaryInformation.tenureRequested",
                    "PreliminaryInformation.expectedInterestRate",
                    "PreliminaryInformation.expectedEmi",
                    "DeductionsFromLoan",
                    "DeductionsFromLoan.expectedProcessingFeePercentage",
                    "DeductionsFromLoan.estimatedEmi",
                    "LoanDocuments",
                    "LoanDocuments.loanDocuments",
                    "LoanDocuments.loanDocuments.document",
                    "LoanDocuments.loanDocuments.documentId"

                ];

            }

            return {
                "type": "schema-form",
                "title": "LOAN_REQUEST",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // AngularResourceService.getInstance().setInjector($injector);

                    self = this;
                    var formRequest = {
                        "overrides": "",
                        "includes": getIncludes (model),
                        "excludes": [
                            ""
                        ]
                    };
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;

                    p1.then(function(repo) {
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, configFile(), model);
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
                        model.loanAccount.screeningDate = obj.screeningDate;
                    }
                },
                form: [],
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
                    save: function(model, formCtrl, form, $event){

                    },
                    holdButton: function(model, formCtrl, form, $event){

                    },
                    sendBack: function(model, formCtrl, form, $event){


                    },
                    proceed: function(model, formCtrl, form, $event){

                    },
                    reject: function(model, formCtrl, form, $event){

                    },

                }
            };

        }
    }
});
