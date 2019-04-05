define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "arohan.dashboard.loans.individual.screening.Verification",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository) {
            
            var configFile = function () {
                return {
                    "loanProcess.loanAccount.currentStage": {
                        "CreditCommitteeReview":
                        {
                            "excludes": [
                            ],
                            "overrides": {
                                "ApplicantTeleverification":{"readonly":true}
                            }
                        },
                        "Sanction":
                        {
                            "excludes": [
                            ],
                            "overrides": {
                                "ApplicantTeleverification":{"readonly":true}
                            }
                        }
                    }
                }
            }
            var overridesFields = function (bundlePageObj) {
                return {
                }
            }
            var getIncludes = function (model) {
                return [
            
                    "CpvFeedback",
                    "CpvFeedback.recommendation",
                    "CpvFeedback.caseStatus",
                    "CpvFeedback.verifierRemarks",
                    "CpvFeedback.supervisorRemarks",

                    "LoanDocuments",
                    "LoanDocuments.loanDocuments",
                    "LoanDocuments.loanDocuments.document",
                    "LoanDocuments.loanDocuments.documentId",



                ];

            }

    var formRequest = function(model) {
                return {
                    "overrides": overridesFields(model),
                    "includes": getIncludes(model),
                    "excludes": [],
                    "options": {
                        "repositoryAdditions": {

                            "CpvFeedback": {
                                "type": "box",
                                "orderNo": 1,
                                "title": "CPV_FEEDBACK",
                                "items": {
                                    "recommendation": {
                                        "key": "",
                                        "title": "RECOMMENDATION",
                                        "required":true,
                                        "type": "text",
                                        "readonly":true
                                    },
                                    "caseStatus": {
                                        "key": "",
                                        "type": "radios",
                                        "title": "CASE_STATUS",
                                        "enumCode": "",
                                        "readonly":true
                                    },
                                    "verifierRemarks": {
                                        "key": "",
                                        "title": "VERIFIER_REMARKS",
                                        "required":true,
                                        "type": "text",
                                        "readonly":true
                                    },
                                    "supervisorRemarks": {
                                        "key": "",
                                        "title": "SUPERVISOR_REMARKS",
                                        "required":true,
                                        "type": "text",
                                        "readonly":true
                                    },  
                                }
                            },
                            "LoanDocuments": {
                                "type": "box",
                                "orderNo": 2,
                                "title": "LOAN_DOCUMENTS",
                                "items": {
                                    "loanDocuments": {
                                        "type": "array",
                                        "key": "loanAccount.loanDocuments",
                                        "view": "fixed",
                                        "startEmpty": true,
                                        "title": "LOAN_DOCUMENT",
                                        "items": {
                                            "document": {
                                                "key": "loanAccount.loanDocuments[].document",
                                                "title": "DOCUMENT_NAME",
                                                "type": "string"
                                            },
                                            "documentId": {
                                                "title": "Upload",
                                                "key": "loanAccount.loanDocuments[].documentId",
                                                "type": "file",
                                                "fileType": "application/pdf",
                                                "category": "Loan",
                                                "subCategory": "DOC1",
                                                "using": "scanner"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "additions": [   
                            {
                                "type": "actionbox",
                                "orderNo": 5,
                                "items": [
                                    {
                                        "type": "button",
                                        "title": "SAVE",
                                        "onClick": "actions.save(model, formCtrl, form, $event)"
                                    }
                                ]
                            }
                        ]
                    }
                };
            }

            return {
                "type": "schema-form",
                "title": "TELEVERIFICATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {

                  
                    model.loanCustomer = {};
                    model.applicant = {};
                    model.coApplicants = [];
                    model.guarantors = [];

                    model.coapplicant = {};
                    model.guarantor = {};
                    model.telecalling = [];
                    model.loanAccount = model.loanProcess.loanAccount;
                    // Setting necessary parties to child arrays.
                    model.applicant.customer = model.loanProcess.applicantEnrolmentProcess.customer;
                    model.loanCustomer.customer = model.loanProcess.loanCustomerEnrolmentProcess.customer;

                    _.forEach(model.loanProcess.coApplicantsEnrolmentProcesses, function(i){
                        model.coApplicants.push({"customer":i.customer});
                    })

                    _.forEach(model.loanProcess.guarantorsEnrolmentProcesses, function(i){
                        model.guarantors.push({"customer":i.customer});
                    })

                    // applicant telecalling details
                    model.telecalling.applicant = _.filter(model.loanAccount.telecallingDetails, {"partyType": "applicant"});
                    // coapplicant telecalling details
                    model.telecalling.coApplicant = _.filter(model.loanAccount.telecallingDetails, {"partyType": "coApplicant"});
                    // guarantor telecalling details
                    model.telecalling.guarantor = _.filter(model.loanAccount.telecallingDetails, {"partyType": "guarantor"});
                    // business telecalling details
                    model.telecalling.loanCustomer = _.filter(model.loanAccount.telecallingDetails, {"partyType": "loanCustomer"});

                    var self = this;
                    Queries.questionnaireDetails('TELECALLING', 'Tele', 'televerification').then(
                        function(res) { 
                            model.applicant.telecallingQuestionnaireList = _.filter(res, function(obj) {
                                return obj.party_type == 'applicant';     
                            });
                            model.loanCustomer.telecallingQuestionnaireList = _.filter(res, function(obj) {
                                return obj.party_type == 'loanCustomer';
                            });
                            model.coapplicantQuestions = _.filter(res, function(obj) {
                                return obj.party_type == 'coApplicant';
                            });
                            model.guarantorQuestions = _.filter(res, function(obj) {
                                return obj.party_type == 'guarantor';
                            });

                            _.forEach(model.coApplicants, function(val, key) {
                                model.coApplicants[key].telecallingQuestionnaireList = model.coapplicantQuestions;
                                if(model.telecalling.coApplicant.length>0) {
                                    var findKey = _.findLastIndex(model.telecalling.coApplicant, ["customerId", val.customer.id]);
                                    if(findKey!=-1) {
                                        model.coApplicants[key].telecallingResponse = model.telecalling.coApplicant[findKey].telecallingResponse;
                                        model.coApplicants[key].noOfCallAttempts = model.telecalling.coApplicant[findKey].noOfCallAttempts;
                                        model.coApplicants[key].followupCallRequired = model.telecalling.coApplicant[findKey].followupCallRequired;
                                        model.coApplicants[key].telecallingRemarks = model.telecalling.coApplicant[findKey].telecallingRemarks;
                                        _.forEach(model.coapplicantQuestions, function(qval, qkey) {
                                            var callingDetails = _.find(model.telecalling.coApplicant[findKey].telecallingQuestionnaireList, {"question": qval.question});
                                            if(!_.isNull(callingDetails)) {
                                               model.coApplicants[key].telecallingQuestionnaireList[qkey].answer = callingDetails.answer;
                                            }
                                        });
                                    }
                                }
                            });

                            _.forEach(model.guarantors, function(val, key) {
                                model.guarantors[key].telecallingQuestionnaireList = model.guarantorQuestions;
                                if(model.telecalling.guarantor.length>0) {
                                    var findKey = _.findLastIndex(model.telecalling.guarantor, ["customerId", val.customer.id]);
                                    if(findKey!=-1) {
                                        model.guarantors[key].telecallingResponse = model.telecalling.guarantor[findKey].telecallingResponse;
                                        model.guarantors[key].noOfCallAttempts = model.telecalling.guarantor[findKey].noOfCallAttempts;
                                        model.guarantors[key].followupCallRequired = model.telecalling.guarantor[findKey].followupCallRequired;
                                        model.guarantors[key].telecallingRemarks = model.telecalling.guarantor[findKey].telecallingRemarks;
                                        _.forEach(model.guarantorQuestions, function(qval, qkey) {
                                            var callingDetails = _.find(model.telecalling.guarantor[findKey].telecallingQuestionnaireList, {"question": qval.question});
                                            if(!_.isNull(callingDetails)) {
                                               model.guarantors[key].telecallingQuestionnaireList[qkey].answer = callingDetails.answer;
                                            }
                                        });
                                    }
                                }
                            });

                            if(model.telecalling.applicant.length>0) {
                                var findKey = model.telecalling.applicant.length-1;
                                model.applicant.telecallingResponse = model.telecalling.applicant[findKey].telecallingResponse;
                                model.applicant.noOfCallAttempts = model.telecalling.applicant[findKey].noOfCallAttempts;
                                model.applicant.followupCallRequired = model.telecalling.applicant[findKey].followupCallRequired;
                                model.applicant.telecallingRemarks = model.telecalling.applicant[findKey].telecallingRemarks;
                                _.forEach(model.applicant.telecallingQuestionnaireList, function(val, key) {
                                    var callingDetails = _.find(model.telecalling.applicant[findKey].telecallingQuestionnaireList, {"question": val.question});
                                    if(!_.isNull(callingDetails)) {
                                       model.applicant.telecallingQuestionnaireList[key].answer = callingDetails.answer;
                                    }
                                });
                            }


                            if(model.telecalling.loanCustomer.length>0) {                            
                                var findKey = model.telecalling.loanCustomer.length-1;
                                model.loanCustomer.telecallingResponse = model.telecalling.loanCustomer[findKey].telecallingResponse;
                                model.loanCustomer.noOfCallAttempts = model.telecalling.loanCustomer[findKey].noOfCallAttempts;
                                model.loanCustomer.followupCallRequired = model.telecalling.loanCustomer[findKey].followupCallRequired;
                                model.loanCustomer.telecallingRemarks = model.telecalling.loanCustomer[findKey].telecallingRemarks;
                                _.forEach(model.loanCustomer.telecallingQuestionnaireList, function(val, key) {
                                    var callingDetails = _.find(model.telecalling.loanCustomer[findKey].telecallingQuestionnaireList, {"question": val.question});
                                    if(!_.isNull(callingDetails)) {
                                       model.loanCustomer.telecallingQuestionnaireList[key].answer = callingDetails.answer;
                                    }
                                });
                            }

                           /* UIRepository.getEnrolmentProcessUIRepository().$promise
                            .then(function(repo){
                                return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest(model), configFile(), model)
                            })
                            .then(function(form){
                                self.form = form;
                            });*/
                        },
                        function(err) {
                            console.log(err);
                        }
                    )
                   /* model.loanProcess = bundleModel.loanProcess;
                    if(_.hasIn(model.loanProcess, 'loanAccount')) {
                        model.loanAccount = model.loanProcess.loanAccount;
                    }*/
                    var self = this;
                    UIRepository.getEnrolmentProcessUIRepository().$promise
                    .then(function(repo){
                        return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest(model), configFile(), model);
                    })
                    .then(function(form){
                        self.form = form;
                    });

                    
                },
                eventListeners: {
                },
                offlineInitialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                    model.loanProcess = bundleModel.loanProcess;
                    if(_.hasIn(model.loanProcess, 'loanAccount')) {
                        model.loanAccount = model.loanProcess.loanAccount;
                    }
                    // var self = this;
                    UIRepository.getEnrolmentProcessUIRepository().$promise
                    .then(function(repo){
                        return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest(model), configFile(), model)
                    })
                    .then(function(form){
                        self.form = form;
                    });
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                    return [
                        item.customer.urnNo,
                        Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                        item.customer.villageName
                    ]
                },
                form: [],
                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {                    
                    save: function(model, formCtrl, form, $event) {
                        model.applicant.customerId = model.applicant.customer.id;
                        model.applicant.partyType = "applicant";
                        model.applicant.customerCalledAt = new Date();
                        model.loanAccount.telecallingDetails.push(model.applicant);

                        model.loanCustomer.customerId = model.loanCustomer.customer.id;
                        model.loanCustomer.partyType = "loanCustomer";
                        model.loanCustomer.customerCalledAt = new Date();
                        model.loanAccount.telecallingDetails.push(model.loanCustomer);



                        //  _.forEach(model.coApplicants, function(val) {
                        //     val.customerId = val.customer.id;
                        //     val.partyType = "coApplicant";
                        //     val.customerCalledAt = new Date();
                        //     model.loanAccount.telecallingDetails.push(val);
                        // });

                        // _.forEach(model.guarantors, function(val) {                            
                        //     val.customerId = val.customer.id;
                        //     val.partyType = "guarantor";
                        //     val.customerCalledAt = new Date();
                        //     model.loanAccount.telecallingDetails.push(val);
                        // });
                        
                        /* Loan SAVE */
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        PageHelper.showLoader();
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.save()
                            .finally(function(data) {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(value) {
                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);
                                BundleManager.broadcastEvent("telecall",{telecallingDetails: model.loanAccount.telecallingDetails,version:model.loanAccount.version});
                            }, function(err) {
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                    }
                }
            };
        }
    }
})