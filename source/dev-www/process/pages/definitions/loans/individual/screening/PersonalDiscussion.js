irf.pageCollection.factory(irf.page("loans.individual.screening.PersonalDiscussion"),
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

    var filteredData = function filteredData(model.applicantTelecallingQuestionnaireList, telecallingQuestionnaireList) {
        const applicantTelecallingQuestionnaireList = model.applicantTelecallingQuestionnaireList.slice();
        for (let i = 0; i < applicantTelecallingQuestionnaireList.length; i++) {
            const elem = model.applicantTelecallingQuestionnaireList[i];
            for (let j = 0; j < telecallingQuestionnaireList.length - 1; j++) {
                const elem1 = telecallingQuestionnaireList[j];
                if (elem.question == elem1.question) {
                    applicantTelecallingQuestionnaireList.splice(i, 1);
                }
            }
        }
        return applicantTelecallingQuestionnaireList;
    }


    return {
        "type": "schema-form",
        "title": "PERSONAL_DISCUSSION",
        "subTitle": "PERSONAL_DISCUSSION",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            
            var self = this;
            
            model.currentStage = bundleModel.currentStage;
            model.customer=model.customer || {};
            model.review = model.review|| {};
            model.temp=model.temp||{}
            model.linkedAccount={}; 
            if (bundlePageObj){
                model._bundlePageObj = _.cloneDeep(bundlePageObj);
            }
            
            if(model.loanAccount.telecallingDetails.length == 0) {
                if (_.hasIn(model.loanAccount, "loanCustomerRelations") && _.isArray(model.loanAccount.loanCustomerRelations)) {
                    _.forEach(model.loanAccount.loanCustomerRelations, function (val, key) {
                        if (val.relation == 'Applicant') {
                            model.loanAccount.telecallingDetails.push({
                                partyType: 'Applicant',
                                customerId: val.customerId
                            })
                        }
                        if (val.relation == 'Co-Applicant') {
                            model.loanAccount.telecallingDetails.push({
                                partyType: 'coApplicant',
                                customerId: val.customerId
                            })
                        }
                        if (val.relation == 'Guarantor') {
                            model.loanAccount.telecallingDetails.push({
                                partyType: 'guarantor',
                                customerId: val.customerId
                            })
                        }
                    })
                }
                if (_.hasIn(model.loanAccount, "customerId")) {
                    model.loanAccount.telecallingDetails.push({
                        partyType: 'loanCustomer',
                        customerId: model.loanAccount.customerId
                    });
                }
            }
            
            self.form = [];
            var personalDiscussionForm = [];

            Queries.questionnaireDetails('TELECALLING', 'Loan', 'FieldAppraisal')
            .then((res) => {
                console.log(res);
                model.telecallingDetails = res;

                //Applicant
                let applicantIndex = _.findIndex(model.loanAccount.telecallingDetails, function (val) {
                    return val.partyType == 'Applicant'
                });

                if (applicantIndex > -1) {
                    
                    model.applicantTelecallingQuestionnaireList = _.filter(model.telecallingDetails, {
                        "party_type": "applicant"
                    });

                    if (model.loanAccount.telecallingDetails.length == 0)
                        model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList = [];
                    
                    personalDiscussionForm.push(
                        {
                            "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList",
                            "type": "array",
                            "title": "Applicant Question",
                            "items": [
                                {
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].question",
                                    "title": "SELECT_QUESTION",
                                    "type": "lov",
                                    "lovonly": true,
                                    "startEmpty": true,
                                    search: function (inputModel, form, model, context) {

                                        return $q.when(model.applicantTelecallingQuestionnaireList).then((res) => {
                                            var out = [];
                                            if (res && res.length && res.length > 0) {
                                                for (i in res) {
                                                    out.push(res[i]);
                                                }
                                                return {
                                                    headers: {
                                                        "x-total-count": out.length
                                                    },
                                                    body: out
                                                };
                                            } else {
                                                return {
                                                    headers: {
                                                        "x-total-count": res.length
                                                    },
                                                    body: res
                                                }
                                            }
                                        });
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.question,
                                            item.input_type,
                                        ]
                                    },
                                    onSelect: function (result, model, context) {
                                        var out = {
                                            question: result.question,
                                            input_type: result.input_type
                                        };
                                        model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList[context.arrayIndex] = out;
                                    }
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" +applicantIndex+ "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "type": "select",
                                    "required": true,
                                    "condition": "model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" +applicantIndex+ "].telecallingQuestionnaireList[arrayIndex].input_type == 'select'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "condition": "model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + applicantIndex+ "].telecallingQuestionnaireList[arrayIndex].input_type == 'string'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type": "number",
                                    "condition": "model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'number'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type": "date",
                                    "condition": "model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'date'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" +applicantIndex+ "].telecallingQuestionnaireList[].remarks",
                                    "title": "Remarks",
                                    "condition": "model.loanAccount.telecallingDetails[" +applicantIndex+ "].telecallingQuestionnaireList[arrayIndex].question"
                                }
                            ]
                        }
                    )
                }
                
                //LoanCustomer
                let loanCustomerIndex = _.findIndex(model.loanAccount.telecallingDetails, function (val) {
                    return val.partyType == 'loanCustomer'
                })
                
                if (loanCustomerIndex > -1) {
                    model.loanCustomerTelecallingQuestionnaireList = _.filter(model.telecallingDetails, {
                        "party_type": "loanCustomer"
                    });

                    if (model.loanAccount.telecallingDetails.length == 0)
                        model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList = [];

                    personalDiscussionForm.push(
                        {
                            "key": "loanAccount.telecallingDetails[" +loanCustomerIndex+ "].telecallingQuestionnaireList",
                            "type": "array",
                            "title": "LoanCustomer Question",
                            "items": [{
                                    "key": "loanAccount.telecallingDetails[" +loanCustomerIndex+ "].telecallingQuestionnaireList[].question",
                                    "title": "SELECT_QUESTION",
                                    "type": "lov",
                                    lovonly: true,
                                    "startEmpty": true,
                                    search: function (inputModel, form, model, context) {
                                        return $q.when(model.loanCustomerTelecallingQuestionnaireList).then((res) => {
                                            var out = [];
                                            if (res && res.length && res.length > 0) {
                                                for (i in res) {
                                                    out.push(res[i]);
                                                }
                                                return {
                                                    headers: {
                                                        "x-total-count": out.length
                                                    },
                                                    body: out
                                                };
                                            } else {
                                                return {
                                                    headers: {
                                                        "x-total-count": res.length
                                                    },
                                                    body: res
                                                }
                                            }
                                        });
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.question,
                                            item.input_type,
                                        ]
                                    },
                                    onSelect: function (result, model, context) {
                                        console.log(context);
                                        var out = {
                                            question: result.question,
                                            input_type: result.input_type
                                        };
                                        model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList[context.arrayIndex] = out;
                                        }
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" +loanCustomerIndex+ "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "type": "select",
                                    "required": true,
                                    "condition": "model.loanAccount.telecallingDetails[" +loanCustomerIndex+ "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList[arrayIndex].input_type == 'select'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" +loanCustomerIndex+ "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "condition": "model.loanAccount.telecallingDetails[" +loanCustomerIndex+ "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList[arrayIndex].input_type == 'string'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type": "number",
                                    "condition": "model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList[arrayIndex].input_type == 'number'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type": "date",
                                    "condition": "model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList[arrayIndex].input_type == 'date'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" +loanCustomerIndex+ "].telecallingQuestionnaireList[].remarks",
                                    "title": "Remarks",
                                    "condition": "model.loanAccount.telecallingDetails[" +loanCustomerIndex+ "].telecallingQuestionnaireList[arrayIndex].question"
                                }
                            ]
                        }
                    )
                }

                //CoApplicant
                let coApplicantIndexes = [];
                _.forEach(model.loanAccount.telecallingDetails, function (val,key) {
                        if (val.partyType == 'coApplicant') {
                            coApplicantIndexes.push(key);
                        }
                })

                if (coApplicantIndexes.length > 0) { 
                    model.coApplicantTelecallingQuestionnaireList = _.filter(model.telecallingDetails, {
                        "party_type": "coApplicant"
                    });

                    
                    
                    _.forEach(coApplicantIndexes, function (coApplicantIndex) {

                       if (model.loanAccount.telecallingDetails.length == 0)
                            model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList = [];
                       
                        personalDiscussionForm.push({
                           "key": "loanAccount.telecallingDetails[" +coApplicantIndex+ "].telecallingQuestionnaireList",
                           "type": "array",
                           "title": "Co-Applicant Question",
                           "items": [{
                                   "key": "loanAccount.telecallingDetails[" +coApplicantIndex+ "].telecallingQuestionnaireList[].question",
                                   "title": "SELECT_QUESTION",
                                   "type": "lov",
                                   lovonly: true,
                                   "startEmpty": true,
                                   search: function (inputModel, form, model, context) {
                                       return $q.when(model.coApplicantTelecallingQuestionnaireList).then((res) => {
                                           var out = [];
                                           if (res && res.length && res.length > 0) {
                                               for (i in res) {
                                                   out.push(res[i]);
                                               }
                                               return {
                                                   headers: {
                                                       "x-total-count": out.length
                                                   },
                                                   body: out
                                               };
                                           } else {
                                               return {
                                                   headers: {
                                                       "x-total-count": res.length
                                                   },
                                                   body: res
                                               }
                                           }
                                       });
                                   },
                                   getListDisplayItem: function (item, index) {
                                       return [
                                           item.question,
                                           item.input_type,
                                       ]
                                   },
                                   onSelect: function (result, model, context) {
                                       console.log(context);
                                        var out = {
                                            question: result.question,
                                            input_type: result.input_type
                                        };
                                        model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList[context.arrayIndex] = out;
                                   }
                               },
                               {
                                   "key": "loanAccount.telecallingDetails[" +coApplicantIndex+ "].telecallingQuestionnaireList[].answer",
                                   "title": "Answer",
                                   "type": "select",
                                   "required": true,
                                   "condition": "model.loanAccount.telecallingDetails[" +coApplicantIndex+ "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList[arrayIndex].input_type == 'select'"
                               },
                               {
                                   "key": "loanAccount.telecallingDetails[" +coApplicantIndex+ "].telecallingQuestionnaireList[].answer",
                                   "title": "Answer",
                                   "required": true,
                                   "condition": "model.loanAccount.telecallingDetails[" +coApplicantIndex+ "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList[arrayIndex].input_type == 'string'"
                               },
                               {
                                   "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].answer",
                                   "title": "Answer",
                                   "required": true,
                                   "type": "number",
                                   "condition": "model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList[arrayIndex].input_type == 'number'"
                               },
                               {
                                   "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].answer",
                                   "title": "Answer",
                                   "required": true,
                                   "type": "date",
                                   "condition": "model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList[arrayIndex].input_type == 'date'"
                               },
                               {
                                   "key": "loanAccount.telecallingDetails[" +coApplicantIndex+ "].telecallingQuestionnaireList[].remarks",
                                   "title": "Remarks",
                                   "condition": "model.loanAccount.telecallingDetails[" +coApplicantIndex+ "].telecallingQuestionnaireList[arrayIndex].question"
                               }
                           ]
                       })
                    })
                }

                //Guarantor
                let guarantorIndexes = [];
                _.forEach(model.loanAccount.telecallingDetails, function (val, key) {
                    if (val.partyType == 'guarantor') {
                        guarantorIndexes.push(key);
                    }
                })

                if (guarantorIndexes.length > 0) {
                    model.guarantorTelecallingQuestionnaireList = _.filter(model.telecallingDetails, {
                        "party_type": "guarantor"
                    });
                    
                    _.forEach(guarantorIndexes, function (guarantorIndex) {

                        if (model.loanAccount.telecallingDetails.length == 0)
                            model.loanAccount.telecallingDetails[guarantorIndex].telecallingQuestionnaireList = [];
                        
                        personalDiscussionForm.push({
                            "key": "loanAccount.telecallingDetails[" +guarantorIndex+ "].telecallingQuestionnaireList",
                            "type": "array",
                            "title": "Guarantor Question",
                            "items": [{
                                    "key": "loanAccount.telecallingDetails[" +guarantorIndex+ "].telecallingQuestionnaireList[].question",
                                    "title": "SELECT_QUESTION",
                                    "type": "lov",
                                    lovonly: true,
                                    "startEmpty": true,
                                    search: function (inputModel, form, model, context) {
                                        return $q.when(model.guarantorTelecallingQuestionnaireList).then((res) => {
                                            var out = [];
                                            if (res && res.length && res.length > 0) {
                                                for (i in res) {
                                                    out.push(res[i]);
                                                }
                                                return {
                                                    headers: {
                                                        "x-total-count": out.length
                                                    },
                                                    body: out
                                                };
                                            } else {
                                                return {
                                                    headers: {
                                                        "x-total-count": res.length
                                                    },
                                                    body: res
                                                }
                                            }
                                        });
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.question,
                                            item.input_type,
                                        ]
                                    },
                                    onSelect: function (result, model, context) {
                                        console.log(context);
                                        var out = {
                                            question: result.question,
                                            input_type: result.input_type
                                        };
                                        model.loanAccount.telecallingDetails[guarantorIndex].telecallingQuestionnaireList[context.arrayIndex] = out;
                                    }
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" +guarantorIndex+ "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "type": "select",
                                    "required": true,
                                    "condition": "model.loanAccount.telecallingDetails[" +guarantorIndex+ "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[guarantorIndex].telecallingQuestionnaireList[arrayIndex].input_type == 'select'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" +guarantorIndex+ "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "condition": "model.loanAccount.telecallingDetails[" +guarantorIndex+ "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[guarantorIndex].telecallingQuestionnaireList[arrayIndex].input_type == 'string'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type": "number",
                                    "condition": "model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[guarantorIndex].telecallingQuestionnaireList[arrayIndex].input_type == 'number'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type": "date",
                                    "condition": "model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[guarantorIndex].telecallingQuestionnaireList[arrayIndex].input_type == 'date'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" +guarantorIndex+ "].telecallingQuestionnaireList[].remarks",
                                    "title": "Remarks",
                                    "condition": "model.loanAccount.telecallingDetails[" +guarantorIndex+ "].telecallingQuestionnaireList[arrayIndex].question"
                                }
                            ]
                        })
                    })
                } 
            });

            self.form = [{
                    "type": "box",
                    "title": "PERSONAL_DISCUSSION",
                    "condition": "model.currentStage =='FieldAppraisal'",
                    "items": personalDiscussionForm
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "button",
                        "icon": "fa fa-circle-o",
                        "title": "SAVE",
                        "onClick": "actions.submit(model, formCtrl, form, $event)"
                    }]
                }
            ];
        },
        form: [],
        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                item.customer.firstName,
                item.customer.centreCode,
                item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
            ]
        },
        eventListeners: {
        },
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                PageHelper.clearErrors();
                /* TODO Call proceed servcie for the loan account */

                Utils.confirm("Are You Sure?").then(function(){

                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    PageHelper.showProgress("update-loan", "Working...");
                    reqData.loanProcessAction = "SAVE";

                    IndividualLoan.update(reqData)
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress("update-loan", "Done.", 3000);
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
            }
        }
    };
}]);
