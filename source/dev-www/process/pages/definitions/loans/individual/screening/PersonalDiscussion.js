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

    var filteredData = function (questionList, telecallingQuestionList) {
        const questions = questionList.slice();
        for (let i = 0; i < questions.length; i++) {
            const elem = questions[i];
            for (let j = 0; j < telecallingQuestionList.length; j++) {
                const elem1 = telecallingQuestionList[j];
                if(elem1 && elem1.question) {
                    if (elem.question == elem1.question) {
                        questions.splice(i, 1);
                        i=0;
                        break;
                    }
                }
            }
        }
        return questions;
    }

    var getthisObject = function (model, form, formCtrl, bundlePageObj, bundleModel) {
        object.initialize(model, form, formCtrl, bundlePageObj, bundleModel);
    }

    var object = {
        "type": "schema-form",
        "title": "PERSONAL_DISCUSSION",
        "subTitle": "PERSONAL_DISCUSSION",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {

            var self = this;

            model.currentStage = model.currentStage;
            model.customer = model.customer || {};
            model.review = model.review || {};
            model.temp = model.temp || {}
            model.linkedAccount = {};
            if (bundlePageObj) {
                model._bundlePageObj = _.cloneDeep(bundlePageObj);
            }

            if (model.loanAccount.telecallingDetails.length == 0) {
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
            var personalDiscussionReviewForm = [];

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

                        if (model.loanAccount.telecallingDetails.length > 0 && model.loanAccount.telecallingDetails[applicantIndex] && _.isArray(model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList) && model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList.length > 0) {
                            for (var i = 0; i < model.applicantTelecallingQuestionnaireList.length; i++) {
                                var arr1 = model.applicantTelecallingQuestionnaireList[i];
                                for (var j = 0; j < model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList.length; j++) {
                                    var arr2 = model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList[j];
                                    if (arr1.question == arr2.question) {
                                        arr2["input_type"] = arr1.input_type;
                                        arr2["select"] = arr1.select;
                                    }
                                }
                            }
                        }

                        personalDiscussionForm.push({
                            "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList",
                            "type": "array",
                            "condition": "model.applicantTelecallingQuestionnaireList.length > 0",
                            "title": "Applicant Question",
                            "view": "fixed",
                            "startEmpty": true,
                            "items": [{
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].question",
                                    "title": "SELECT_QUESTION",
                                    "type": "lov",
                                    "required": true,
                                    "lovonly": true,
                                    "uiType": "textarea",
                                    search: function (inputModel, form, model, context) {

                                        return $q.when(filteredData(model.applicantTelecallingQuestionnaireList, model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList)).then((res) => {
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
                                        if (result && result.select) {
                                            var out = {
                                                question: result.question,
                                                input_type: result.input_type,
                                                select: result.select
                                            };
                                        } else {
                                            var out = {
                                                question: result.question,
                                                input_type: result.input_type
                                            };
                                        }
                                        model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList[context.arrayIndex] = out;
                                    }
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "condition": "model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'select'",
                                    "type": "lov",
                                    "lovonly": true,
                                    "search": function (inputModel, form, model, context) {
                                        var list = {};
                                        var out = [];
                                        list = model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList[context.arrayIndex].select;
                                        _.forEach(list, function (val) {
                                            out.push({
                                                "name": val
                                            });
                                        });
                                        return $q.resolve({
                                            headers: {
                                                "x-total-count": out.length
                                            },
                                            body: out
                                        });
                                    },
                                    onSelect: function (valueObj, model, context) {
                                        model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList[context.arrayIndex].answer = valueObj.name;
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.name
                                        ];
                                    }
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "type":"textarea",
                                    "required": true,
                                    "condition": "model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'string'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type": ["number","string"],
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
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].remarks",
                                    "title": "Remarks",
                                    "type":"textarea",
                                    "condition": "model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].question"
                                }
                            ]
                        });

                        personalDiscussionReviewForm.push({
                            "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList",
                            "type": "array",
                            "condition": "model.applicantTelecallingQuestionnaireList.length > 0",
                            "title": "Applicant Question",
                            "view": "fixed",
                            "startEmpty": true,
                            "readonly": true,
                            "items": [{
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].question",
                                    "title": "SELECT_QUESTION",
                                    "type": "lov",
                                    "required": true,
                                    "lovonly": true,
                                    "uiType": "textarea",
                                    search: function (inputModel, form, model, context) {

                                        return $q.when(filteredData(model.applicantTelecallingQuestionnaireList, model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList)).then((res) => {
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
                                        if (result && result.select) {
                                            var out = {
                                                question: result.question,
                                                input_type: result.input_type,
                                                select: result.select
                                            };
                                        } else {
                                            var out = {
                                                question: result.question,
                                                input_type: result.input_type
                                            };
                                        }
                                        model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList[context.arrayIndex] = out;
                                    }
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "condition": "model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'select'",
                                    "type": "lov",
                                    "lovonly": true,
                                    "search": function (inputModel, form, model, context) {
                                        var list = {};
                                        var out = [];
                                        list = model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList[context.arrayIndex].select;
                                        _.forEach(list, function (val) {
                                            out.push({
                                                "name": val
                                            });
                                        });
                                        return $q.resolve({
                                            headers: {
                                                "x-total-count": out.length
                                            },
                                            body: out
                                        });
                                    },
                                    onSelect: function (valueObj, model, context) {
                                        model.loanAccount.telecallingDetails[applicantIndex].telecallingQuestionnaireList[context.arrayIndex].answer = valueObj.name;
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.name
                                        ];
                                    }
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type":"textarea",
                                    "condition": "model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'string'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type": ["number","string"],
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
                                    "key": "loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[].remarks",
                                    "title": "Remarks",
                                    "type":"textarea",
                                    "condition": "model.loanAccount.telecallingDetails[" + applicantIndex + "].telecallingQuestionnaireList[arrayIndex].question"
                                }
                            ]
                        });
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

                        if (model.loanAccount.telecallingDetails.length > 0 && model.loanAccount.telecallingDetails[loanCustomerIndex] && _.isArray(model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList) && model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList.length > 0) {
                            for (var i = 0; i < model.loanCustomerTelecallingQuestionnaireList.length; i++) {
                                var arr1 = model.loanCustomerTelecallingQuestionnaireList[i];
                                for (var j = 0; j < model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList.length; j++) {
                                    var arr2 = model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList[j];
                                    if (arr1.question == arr2.question) {
                                        arr2["input_type"] = arr1.input_type;
                                        arr2["select"] = arr1.select;
                                    }
                                }
                            }
                        }

                        personalDiscussionForm.push({
                            "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList",
                            "condition": "model.loanCustomerTelecallingQuestionnaireList.length > 0",
                            "type": "array",
                            "title": "LoanCustomer Question",
                            "view": "fixed",
                            "startEmpty": true,
                            "items": [{
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].question",
                                    "title": "SELECT_QUESTION",
                                    "type": "lov",
                                    lovonly: true,
                                    "required": true,
                                    "uiType": "textarea",
                                    search: function (inputModel, form, model, context) {
                                        return $q.when(filteredData(model.loanCustomerTelecallingQuestionnaireList, model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList)).then((res) => {
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
                                        if (result && result.select) {
                                            var out = {
                                                question: result.question,
                                                input_type: result.input_type,
                                                select: result.select
                                            };
                                        } else {
                                            var out = {
                                                question: result.question,
                                                input_type: result.input_type
                                            };
                                        }
                                        model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList[context.arrayIndex] = out;

                                    }
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "condition": "model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'select'",
                                    "type": "lov",
                                    "lovonly": true,
                                    "search": function (inputModel, form, model, context) {
                                        var list = {};
                                        var out = [];
                                        list = model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList[context.arrayIndex].select;
                                        _.forEach(list, function (val) {
                                            out.push({
                                                "name": val
                                            });
                                        });
                                        return $q.resolve({
                                            headers: {
                                                "x-total-count": out.length
                                            },
                                            body: out
                                        });
                                    },
                                    onSelect: function (valueObj, model, context) {
                                        model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList[context.arrayIndex].answer = valueObj.name;
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.name
                                        ];
                                    }
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type":"textarea",
                                    "condition": "model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'string'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type": ["number","string"],
                                    "condition": "model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'number'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type": "date",
                                    "condition": "model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'date'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].remarks",
                                    "title": "Remarks",
                                    "type":"textarea",
                                    "condition": "model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].question"
                                }
                            ]
                        });

                        personalDiscussionReviewForm.push({
                            "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList",
                            "condition": "model.loanCustomerTelecallingQuestionnaireList.length > 0",
                            "type": "array",
                            "title": "LoanCustomer Question",
                            "view": "fixed",
                            "startEmpty": true,
                            "readonly": true,
                            "items": [{
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].question",
                                    "title": "SELECT_QUESTION",
                                    "type": "lov",
                                    lovonly: true,
                                    "required": true,
                                    "uiType": "textarea",
                                    search: function (inputModel, form, model, context) {
                                        return $q.when(filteredData(model.loanCustomerTelecallingQuestionnaireList, model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList)).then((res) => {
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
                                        if (result && result.select) {
                                            var out = {
                                                question: result.question,
                                                input_type: result.input_type,
                                                select: result.select
                                            };
                                        } else {
                                            var out = {
                                                question: result.question,
                                                input_type: result.input_type
                                            };
                                        }
                                        model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList[context.arrayIndex] = out;

                                    }
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "condition": "model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'select'",
                                    "type": "lov",
                                    "lovonly": true,
                                    "search": function (inputModel, form, model, context) {
                                        var list = {};
                                        var out = [];
                                        list = model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList[context.arrayIndex].select;
                                        _.forEach(list, function (val) {
                                            out.push({
                                                "name": val
                                            });
                                        });
                                        return $q.resolve({
                                            headers: {
                                                "x-total-count": out.length
                                            },
                                            body: out
                                        });
                                    },
                                    onSelect: function (valueObj, model, context) {
                                        model.loanAccount.telecallingDetails[loanCustomerIndex].telecallingQuestionnaireList[context.arrayIndex].answer = valueObj.name;
                                    },
                                    getListDisplayItem: function (item, index) {
                                        return [
                                            item.name
                                        ];
                                    }
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type":"textarea",
                                    "condition": "model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'string'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type": ["number","string"],
                                    "condition": "model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'number'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].answer",
                                    "title": "Answer",
                                    "required": true,
                                    "type": "date",
                                    "condition": "model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'date'"
                                },
                                {
                                    "key": "loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[].remarks",
                                    "title": "Remarks",
                                    "type":"textarea",
                                    "condition": "model.loanAccount.telecallingDetails[" + loanCustomerIndex + "].telecallingQuestionnaireList[arrayIndex].question"
                                }
                            ]
                        })
                    }

                    //CoApplicant
                    let coApplicantIndexes = [];
                    _.forEach(model.loanAccount.telecallingDetails, function (val, key) {
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

                            if (model.loanAccount.telecallingDetails.length > 0 && model.loanAccount.telecallingDetails[coApplicantIndex] && _.isArray(model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList) && model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList.length > 0) {
                                for (var i = 0; i < model.coApplicantTelecallingQuestionnaireList.length; i++) {
                                    var arr1 = model.coApplicantTelecallingQuestionnaireList[i];
                                    for (var j = 0; j < model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList.length; j++) {
                                        var arr2 = model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList[j];
                                        if (arr1.question == arr2.question) {
                                            arr2["input_type"] = arr1.input_type;
                                            arr2["select"] = arr1.select;
                                        }
                                    }
                                }
                            }

                            personalDiscussionForm.push({
                                "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList",
                                "type": "array",
                                "condition": "model.coApplicantTelecallingQuestionnaireList.length > 0",
                                "title": "Co-Applicant Question",
                                "view": "fixed",
                                "startEmpty": true,
                                "items": [{
                                        "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].question",
                                        "title": "SELECT_QUESTION",
                                        "type": "lov",
                                        lovonly: true,
                                        "required": true,
                                        "uiType": "textarea",
                                        search: function (inputModel, form, model, context) {
                                            return $q.when(filteredData(model.coApplicantTelecallingQuestionnaireList, model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList)).then((res) => {
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
                                            if (result && result.select) {
                                                var out = {
                                                    question: result.question,
                                                    input_type: result.input_type,
                                                    select: result.select
                                                };
                                            } else {
                                                var out = {
                                                    question: result.question,
                                                    input_type: result.input_type
                                                };
                                            }
                                            model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList[context.arrayIndex] = out;
                                        }
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "required": true,
                                        "condition": "model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'select'",
                                        "type": "lov",
                                        "lovonly": true,
                                        "search": function (inputModel, form, model, context) {
                                            var list = {};
                                            var out = [];
                                            list = model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList[context.arrayIndex].select;
                                            _.forEach(list, function (val) {
                                                out.push({
                                                    "name": val
                                                });
                                            });
                                            return $q.resolve({
                                                headers: {
                                                    "x-total-count": out.length
                                                },
                                                body: out
                                            });
                                        },
                                        onSelect: function (valueObj, model, context) {
                                            model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList[context.arrayIndex].answer = valueObj.name;
                                        },
                                        getListDisplayItem: function (item, index) {
                                            return [
                                                item.name
                                            ];
                                        }
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "required": true,
                                        "type":"textarea",
                                        "condition": "model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'string'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "required": true,
                                        "type": ["number","string"],
                                        "condition": "model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'number'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "required": true,
                                        "type": "date",
                                        "condition": "model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'date'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].remarks",
                                        "title": "Remarks",
                                        "type":"textarea",
                                        "condition": "model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].question"
                                    }
                                ]
                            })

                            personalDiscussionReviewForm.push({
                                "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList",
                                "type": "array",
                                "condition": "model.coApplicantTelecallingQuestionnaireList.length > 0",
                                "title": "Co-Applicant Question",
                                "view": "fixed",
                                "startEmpty": true,
                                "readonly": true,
                                "items": [{
                                        "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].question",
                                        "title": "SELECT_QUESTION",
                                        "type": "lov",
                                        lovonly: true,
                                        "required": true,
                                        "uiType": "textarea",
                                        search: function (inputModel, form, model, context) {
                                            return $q.when(filteredData(model.coApplicantTelecallingQuestionnaireList, model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList)).then((res) => {
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
                                            if (result && result.select) {
                                                var out = {
                                                    question: result.question,
                                                    input_type: result.input_type,
                                                    select: result.select
                                                };
                                            } else {
                                                var out = {
                                                    question: result.question,
                                                    input_type: result.input_type
                                                };
                                            }
                                            model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList[context.arrayIndex] = out;
                                        }
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "required": true,
                                        "condition": "model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'select'",
                                        "type": "lov",
                                        "lovonly": true,
                                        "search": function (inputModel, form, model, context) {
                                            var list = {};
                                            var out = [];
                                            list = model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList[context.arrayIndex].select;
                                            _.forEach(list, function (val) {
                                                out.push({
                                                    "name": val
                                                });
                                            });
                                            return $q.resolve({
                                                headers: {
                                                    "x-total-count": out.length
                                                },
                                                body: out
                                            });
                                        },
                                        onSelect: function (valueObj, model, context) {
                                            model.loanAccount.telecallingDetails[coApplicantIndex].telecallingQuestionnaireList[context.arrayIndex].answer = valueObj.name;
                                        },
                                        getListDisplayItem: function (item, index) {
                                            return [
                                                item.name
                                            ];
                                        }
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "required": true,
                                        "type":"textarea",
                                        "condition": "model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'string'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "required": true,
                                        "type": ["number","string"],
                                        "condition": "model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'number'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "required": true,
                                        "type": "date",
                                        "condition": "model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'date'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[].remarks",
                                        "title": "Remarks",
                                        "type":"textarea",
                                        "condition": "model.loanAccount.telecallingDetails[" + coApplicantIndex + "].telecallingQuestionnaireList[arrayIndex].question"
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

                            if (model.loanAccount.telecallingDetails.length > 0 && model.loanAccount.telecallingDetails[guarantorIndex] && _.isArray(model.loanAccount.telecallingDetails[guarantorIndex].telecallingQuestionnaireList) && model.loanAccount.telecallingDetails[guarantorIndex].telecallingQuestionnaireList.length > 0) {
                                for (var i = 0; i < model.guarantorTelecallingQuestionnaireList.length; i++) {
                                    var arr1 = model.guarantorTelecallingQuestionnaireList[i];
                                    for (var j = 0; j < model.loanAccount.telecallingDetails[guarantorIndex].telecallingQuestionnaireList.length; j++) {
                                        var arr2 = model.loanAccount.telecallingDetails[guarantorIndex].telecallingQuestionnaireList[j];
                                        if (arr1.question == arr2.question) {
                                            arr2["input_type"] = arr1.input_type;
                                            arr2["select"] = arr1.select;
                                        }
                                    }
                                }
                            }

                            personalDiscussionForm.push({
                                "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList",
                                "type": "array",
                                "condition": "model.guarantorTelecallingQuestionnaireList.length > 0",
                                "title": "Guarantor Question",
                                "view": "fixed",
                                "startEmpty": true,
                                "items": [{
                                        "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].question",
                                        "title": "SELECT_QUESTION",
                                        "type": "lov",
                                        lovonly: true,
                                        "required": true,
                                        "uiType": "textarea",
                                        search: function (inputModel, form, model, context) {
                                            return $q.when(model.guarantorTelecallingQuestionnaireList, model.loanAccount.telecallingDetails[guarantorIndex].telecallingQuestionnaireList).then((res) => {
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
                                        "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "type": "select",
                                        "required": true,
                                        "condition": "model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'select'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "type":"textarea",
                                        "required": true,
                                        "condition": "model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'string'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "required": true,
                                        "type": ["number","string"],
                                        "condition": "model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'number'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "required": true,
                                        "type": "date",
                                        "condition": "model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'date'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].remarks",
                                        "title": "Remarks",
                                        "type":"textarea",
                                        "condition": "model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].question"
                                    }
                                ]
                            })
                            personalDiscussionReviewForm.push({
                                "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList",
                                "type": "array",
                                "condition": "model.guarantorTelecallingQuestionnaireList.length > 0",
                                "title": "Guarantor Question",
                                "view": "fixed",
                                "startEmpty": true,
                                "readonly": true,
                                "items": [{
                                        "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].question",
                                        "title": "SELECT_QUESTION",
                                        "type": "lov",
                                        lovonly: true,
                                        "required": true,
                                        "uiType": "textarea",
                                        search: function (inputModel, form, model, context) {
                                            return $q.when(model.guarantorTelecallingQuestionnaireList, model.loanAccount.telecallingDetails[guarantorIndex].telecallingQuestionnaireList).then((res) => {
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
                                        "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "type": "select",
                                        "required": true,
                                        "condition": "model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'select'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "required": true,
                                        "type":"textarea",
                                        "condition": "model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'string'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "required": true,
                                        "type": ["number","string"],
                                        "condition": "model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'number'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].answer",
                                        "title": "Answer",
                                        "required": true,
                                        "type": "date",
                                        "condition": "model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].question && model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].input_type == 'date'"
                                    },
                                    {
                                        "key": "loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[].remarks",
                                        "title": "Remarks",
                                        "type":"textarea",
                                        "condition": "model.loanAccount.telecallingDetails[" + guarantorIndex + "].telecallingQuestionnaireList[arrayIndex].question"
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
                    "type": "box",
                    "title": "PERSONAL_DISCUSSION",
                    "condition": "model.currentStage !='FieldAppraisal'",
                    "items": personalDiscussionReviewForm
                },
                {
                    "type": "actionbox",
                    "condition": "model.currentStage =='FieldAppraisal'",
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
            "load-personal-discussion": function(form, model, formCtrl, bundlePageObj, bundleModel){
                object.initialize(model, form, formCtrl, bundlePageObj, bundleModel);
            },
        },
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            submit: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                $log.info("Inside submit()");
                PageHelper.clearErrors();
                /* TODO Call proceed servcie for the loan account */

                Utils.confirm("Are You Sure?").then(function(){
                    if (!validateForm(form)) {
                        return;
                    }
                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanProcessAction = "SAVE";
                    PageHelper.showProgress("update-loan", "Working...", 3000);
                    IndividualLoan.update(reqData)
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress("update-loan", "Done.", 3000);  
                            model.loanAccount = res.loanAccount;
                            getthisObject(model, form, formCtrl, bundlePageObj, bundleModel);
                        }, function(httpRes){
                            PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        });
                })
            }
        }
    };
    return object;
}]);
