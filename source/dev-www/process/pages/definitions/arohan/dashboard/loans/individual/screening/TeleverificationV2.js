define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "arohan.dashboard.loans.individual.screening.TeleverificationV2",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository","irfFormToggler","Telecalling"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository,irfFormToggler,Telecalling) {
            var currentStage;
            var readonlyFlag = true;
            var globalListkeys = [];
            var getAllIncludesFromJson = function (parentKey, previousKey, object,flag) {
                if (flag)
                    globalListkeys = [];
                var thisParentKey = previousKey + parentKey;
                var keys = Object.keys(object);
                if (keys.length <= 0)
                    return;
                for (var i = 0; i < keys.length; i++) {
                    globalListkeys.push(thisParentKey + keys[i]);
                    if (typeof object[keys[i]].items != "undefined") {
                        previousKey = thisParentKey;
                        getAllIncludesFromJson(keys[i] + ".", previousKey, object[keys[i]].items);
                    }
                }
                return;
            };
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
                    "ApplicantInformation",
                    "ApplicantInformation.personalInformationFieldSet",
                    "ApplicantInformation.branchName",
                    "ApplicantInformation.zoneId",
                    "ApplicantInformation.urnNo",
                    "ApplicantInformation.firstName",
                    "ApplicantInformation.dob",
                    "ApplicantInformation.gender",
                    "ApplicantInformation.fatherName",
                    "ApplicantInformation.customerPhoto",
                    "ApplicantInformation.kycFieldSet",
                    "ApplicantInformation.identityProofNo",
                    "ApplicantInformation.identityProof",
                    "ApplicantInformation.addressProof",
                    "ApplicantInformation.contactInformationFieldSet",
                    "ApplicantInformation.mobileNo",
                    "ApplicantInformation.doorNo",
                    "ApplicantInformation.pincode",
                    "ApplicantInformation.locality",
                    "ApplicantInformation.villageName",
                    "ApplicantInformation.district",
                    "ApplicantInformation.state",
                    "ApplicantInformation.bankAccounts",
                    "ApplicantInformation.bankAccounts.ifscCode",
                    "ApplicantInformation.bankAccounts.customerBankBranchName",
                    "ApplicantInformation.bankAccounts.customerNameAsInBank",
                    "ApplicantInformation.bankAccounts.accountNumber",
                    "ApplicantInformation.loanDetailsFieldSet",
                    "ApplicantInformation.loanPurpose1",
                    "ApplicantInformation.amountRequested",
                    "ApplicantInformation.frequency",
                    "ApplicantInformation.tenure",
                    // "ApplicantInformation.remarksFieldSet",
                    // "ApplicantInformation.remarks",
                    // "ApplicantInformation.feedback",


                    "ApplicantTeleverification",
                    "ApplicantTeleverification.callingAttemptsFieldSet",
                    "ApplicantTeleverification.telecallingResponse",
                    "ApplicantTeleverification.noOfCallAttempts",
                    "ApplicantTeleverification.followupCallRequired",
                    "ApplicantTeleverification.telecallingRemarks",
                    "ApplicantTeleverification.questions",
                    "ApplicantTeleverification.telecallingQuestionnaireList",
                    "ApplicantTeleverification.telecallingQuestionnaireList.question",
                    "ApplicantTeleverification.telecallingQuestionnaireList.answer1",
                    "ApplicantTeleverification.telecallingQuestionnaireList.answer2",
                    "ApplicantTeleverification.telecallingQuestionnaireList.answer3",
                    "ApplicantTeleverification.telecallingQuestionnaireList.answer4",


                ];

            }

            var formRequest = function(model) {
                return {
                    "overrides": overridesFields(model),
                    "includes": getIncludes(model),
                    "excludes": [],
                    "options": {
                        "repositoryAdditions": {

                            "ApplicantInformation": {
                                "type": "box",
                                "orderNo": 1,
                                "title": "APPLICANT_INFORMATION",
                                "items": {

                                    "personalInformationFieldSet": {
                                        "type": "fieldset",
                                        "title": "PERSONAL_INFORMATION",
                                        "items": []
                                    },
                                    "branchName": {

                                        "key": "applicant.customer.customerBranchId",
                                        "title": "BRANCH_NAME",
                                        "type": "select",
                                        "enumCode": "branch_id",
                                        "readonly": true

                                    },
                                    "zoneId": {
                                        "key": "applicant.customer.centreId",
                                        "type": "lov",
                                        "title": "ZONE_ID",
                                        "filter": {
                                            "parentCode": "branch_id"
                                        },
                                        "parentEnumCode": "branch_id",
                                        "parentValueExpr": "model.applicant.customer.customerBranchId",
                                        "readonly": true
                                    },
                                    "zoneName": {
                                        "key": "applicant.customer.centreId",
                                        "type": "select",
                                        "enumCode": "centre",
                                        "title": "ZONE_NAME",
                                        "readonly": true
                                    },
                                    "urnNo": {
                                        "key": "applicant.customer.urnNo",
                                        "title": "URN_NO",
                                        "readonly": true
                                    },
                                    "firstName": {
                                        "key": "applicant.customer.firstName",
                                        "title": "FULL_NAME",
                                        "type": "string",
                                        "readonly": true
                                    },
                                    "dob": {
                                        "key": "applicant.customer.dateOfBirth",
                                        "title": "DATE_OF_BIRTH",
                                        "type": "date",
                                        "readonly": true
                                    },
                                    "gender": {
                                        "key": "applicant.customer.gender",
                                        "type": "radios",
                                        "title": "GENDER",
                                        "enumCode": "gender",
                                        "readonly": true
                                    },
                                    "fatherName": {
                                        "key": "applicant.customer.fatherFirstName",
                                        "title": "FATHER_FULL_NAME",
                                        "readonly": true
                                    },
                                    "customerPhoto": {
                                        "key": "applicant.customer.photoImageId",
                                        "type": "file",
                                        "title": "CUSTOMER_PHOTO",
                                        "category": "CustomerEnrollment",
                                        "subCategory": "PHOTO",
                                        "fileType": "image/*",
                                        "readonly": true
                                    },
                                    "kycFieldSet": {
                                        "type": "fieldset",
                                        "title": "KYC",
                                        "items": []
                                    },
                                    "identityProofNo": {
                                        "key": "applicant.customer.identityProofNo",
                                        "title": "IDENTITY_PROOFNO",
                                        "type": "barcode",
                                        "readonly": true
                                    },
                                    "identityProof": {
                                        "key": "applicant.customer.identityProofImageId",
                                        "type": "file",
                                        "fileType": "application/pdf",
                                        "using": "scanner",
                                        "title": "IDENTITY_PROOF_DOCUMENT",
                                        "category": "CustomerEnrollment",
                                        "subCategory": "IDENTITYPROOF",
                                        "readonly": true
                                    },
                                    "addressProof": {
                                        "key": "applicant.customer.addressProofNo",
                                        "type": "qrcode",
                                        "title": "ADDRESS_PROOF_NO",
                                        "readonly": true
                                    },
                                    "addressProof": {
                                        "key": "applicant.customer.addressProofImageId",
                                        "type": "file",
                                        "fileType": "application/pdf",
                                        "using": "scanner",
                                        "title": "ADDRESS_PROOF_IMAGE_ID",
                                        "category": "CustomerEnrollment",
                                        "subCategory": "ADDRESSPROOF",
                                        "readonly": true
                                    },
                                    "contactInformationFieldSet": {
                                        "type": "fieldset",
                                        "title": "CONTACT_INFORMATION",
                                        "items": []
                                    }, "mobileNo": {
                                        "key": "applicant.customer.mobilePhone",
                                        "type": "text",
                                        "title": "MOBILE_PHONE",
                                        "inputmode": "number",
                                        "numberType": "tel",
                                        "readonly": true
                                    }, "doorNo": {
                                        "key": "applicant.customer.doorNo",
                                        "title": "DOOR_NO",
                                        "readonly": true
                                    },
                                    "pincode": {
                                        "key": "applicant.customer.pincode",
                                        "title": "PIN_CODE",
                                        "type": "lov",
                                        "fieldType": "number",
                                        "autolov": true,
                                        "readonly": true
                                    },
                                    "locality": {
                                        "key": "applicant.customer.locality",
                                        "title": "LOCALITY",
                                        "readonly": true
                                    },
                                    "villageName": {
                                        "key": "applicant.customer.villageName",
                                        "title": "VILLAGE_NAME",
                                        "enumCode": "village",
                                        "readonly": true
                                    },
                                    "district": {
                                        "key": "applicant.customer.district",
                                        "title": "DISTRICT",
                                        "enumCode": "district",
                                        "readonly": true
                                    },
                                    "state": {
                                        "key": "applicant.customer.state",
                                        "title": "STATE",
                                        "readonly": true
                                    },
                                    "bankAccounts": {
                                        "type": "array",
                                        "title": "BANK_ACCOUNTS",
                                        "view": "fixed",
                                        "add": null,
                                        "remove": null,
                                        "key": "applicant.customer.customerBankAccounts",
                                        "items": {
                                            "ifscCode": {
                                                "key": "applicant.customer.customerBankAccounts[].ifscCode",
                                                "resolver": "BankIFSCLOVConfiguration",
                                                "type": "lov",
                                                "lovonly": true,
                                                "title": "IFSC_CODE",
                                                "readonly": true
                                            },
                                            "customerBankName": {
                                                "key": "applicant.customer.customerBankAccounts[].customerBankName",
                                                "title": "BANK_NAME",
                                                "readonly": true
                                            },
                                            "customerBankBranchName": {
                                                "key": "applicant.customer.customerBankAccounts[].customerBankBranchName",
                                                "title": "BANK_BRANCH_NAME",
                                                "readonly": true
                                            },
                                            "customerNameAsInBank": {
                                                "key": "applicant.customer.customerBankAccounts[].customerNameAsInBank",
                                                "title": "CUSTOMER_NAME_IN_BANK",
                                                "readonly": true
                                            },
                                            "accountNumber": {
                                                "key": "applicant.customer.customerBankAccounts[].accountNumber",
                                                "title": "ACCOUNT_NUMBER",
                                                "readonly": true
                                            }
                                        }


                                    }, "loanDetailsFieldSet": {
                                        "type": "fieldset",
                                        "title": "LOAN_DETAILS",
                                        "items": []
                                    },
                                    "loanPurpose1": {
                                        "key": "loanAccount.loanPurpose1",
                                        "type": "lov",
                                        "resolver": "LoanPurpose1LOVConfiguration",
                                        "autolov": true,
                                        "title": "LOAN_PURPOSE_LEVEL_1",
                                        "readonly": true
                                    },
                                    "amountRequested": {
                                        "key": "loanAccount.loanAmountRequested",
                                        "type": "amount",
                                        "title": "REQUESTED_LOAN_AMOUNT",
                                        "readonly": true
                                    },
                                    "frequency": {
                                        "key": "loanAccount.frequencyRequested",
                                        "type": "select",
                                        "title": "FREQUENCY_REQUESTED",
                                        "enumCode": "frequency",
                                        "readonly": true
                                    },
                                    "tenure": {
                                        "key": "loanAccount.tenureRequested",
                                        "type": "number",
                                        "title": "TENURE_REQUESETED",
                                        "readonly": true
                                    }, "remarksFieldSet": {
                                        "type": "fieldset",
                                        "title": "Remarks",
                                        "items": []
                                    },
                                    "remarks": {
                                        "title": "REMARKS",
                                        "type": "text"
                                    },
                                    "feedback": {
                                        "title": "FEEDBACK",
                                        "type": "textarea"
                                    }
                                }
                            },
                            "ApplicantTeleverification": {
                                "type": "box",
                                
                                "title": "APPLICANT_TELE_VERIFICATION",
                                "orderNo": 3,
                                "items": {
                                    "callingAttemptsFieldSet": {
                                        "type": "fieldset",
                                        "title": "CALLING_ATTEMPTS",
                                        "items": []
                                    },
                                    "telecallingResponse": {
                                        "key": "applicant.telecallingResponse",
                                        "type": "select",
                                        "title": "TELECALLING_RESPONSE",
                                        "enumCode": "telecalling_response"
                                    },
                                    "noOfCallAttempts": {
                                        "key": "applicant.noOfCallAttempts",
                                        "type": "number",
                                        "title": "NO_OF_CALLATTEMPTS"
                                    },
                                    "followupCallRequired": {
                                        "key": "applicant.followupCallRequired",
                                        "type": "date",
                                        "title": "FOLLOWUP_ON"
                                    },
                                    "telecallingRemarks": {
                                        "key": "applicant.telecallingRemarks",
                                        "type": "textarea",
                                        "title": "TELECALLING_REMARKS"
                                    },
                                    "questions": {
                                        "type": "fieldset",
                                        "title": "QUESTIONS",
                                        "items": []
                                    },
                                    "telecallingQuestionnaireList": {
                                        "key": "applicant.telecallingQuestionnaireList",
                                        "type": "array",
                                        "add": null,
                                        "remove": null,
                                        "view": "fixed",
                                        "items": {
                                            "question":{
                                                "key": "applicant.telecallingQuestionnaireList[].question",
                                                "type": "textarea",
                                                "title": "QUESTION",
                                                "readonly": true
                                            },
                                            "answer1":{
                                                "key": "applicant.telecallingQuestionnaireList[].answer",
                                                "type": "string",
                                                "title": "ANSWER",
                                                "condition": "model.applicant.telecallingQuestionnaireList[arrayIndex].input_type=='string'"
                                            },
                                            "answer2":{
                                                "key": "applicant.telecallingQuestionnaireList[].answer",
                                                "type": "textarea",
                                                "title": "ANSWER",
                                                "condition": "model.applicant.telecallingQuestionnaireList[arrayIndex].input_type=='textarea'"
                                            },
                                            "answer3":{
                                                "key": "applicant.telecallingQuestionnaireList[].answer",
                                                "type": "number",
                                                "title": "ANSWER",
                                                "condition": "model.applicant.telecallingQuestionnaireList[arrayIndex].input_type=='number'"
                                            },
                                            "answer4":{
                                                "key": "applicant.telecallingQuestionnaireList[].answer",
                                                "title": "ANSWER",
                                                "condition": "model.applicant.telecallingQuestionnaireList[arrayIndex].input_type=='select'",
                                                "type": "lov",
                                                "autolov": true,
                                                "lovonly": true,
                                                "bindMap": {},
                                                "searchHelper": formHelper,
                                                "search": function (inputModel, form, model, context) {
                                                    var list = {};
                                                    list = model.applicant.telecallingQuestionnaireList[context.arrayIndex].select;

                                                    var out = [];
                                                    _.forEach(list, function (val) {
                                                        out.push({ "name": val });
                                                    });

                                                    return $q.resolve({
                                                        headers: {
                                                            "x-total-count": out.length
                                                        },
                                                        body: out
                                                    });
                                                },
                                                onSelect: function (valueObj, model, context) {
                                                    model.applicant.telecallingQuestionnaireList[context.arrayIndex].answer = valueObj.name;
                                                },
                                                getListDisplayItem: function (item, index) {
                                                    return [
                                                        item.name
                                                    ];
                                                }
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
            };
            var prepareQuestionarieList = function(capturedData,model,type,parentData){
                var questions = [];
                for(var i=0;i<model.questions.length;i++){
                    if(model.questions[i].party_type == type+'_reference'){
                        questions.push(model.questions[i]);
                    }
                }
                var flag = true;    
                var data = capturedData || {};
                var newQuestionList = [];
                data.telecallingQuestionnaireList = data.telecallingQuestionnaireList || [];
                if (data.telecallingQuestionnaireList.length>0){
                    for(var i=0;i<questions.length;i++){
                        flag = true;
                        for (var j =0;j<data.telecallingQuestionnaireList.length;j++){
                            if (questions[i].question == data.telecallingQuestionnaireList[j].question){
                                newQuestionList.push(data.telecallingQuestionnaireList[j]);
                                flag = false;
                                break;
                            }
                                
                        }
                        if (flag)
                                newQuestionList.push(questions[i]);
                    }
                } 
                else{
                    newQuestionList = questions;
                }
                data.telecallingQuestionnaireList = newQuestionList;
                data.customerId = data.customerId || parentData.customerId;
                data.processId = data.processId || parentData.processId;
                data.processType = 'CUSTOMER_REFERENCE';
                data.telecallingQuestionnaireList = prepareInputType(questions,data.telecallingQuestionnaireList)
                return data;
            };
            var prepareInputType = function(pQ,cQ,partyType){
                if (partyType){
                   var question = [];
                   for(var i=0;i<pQ.length;i++){
                    if(pQ[i].party_type == partyType){
                        question.push(pQ[i]);
                    }
                }
                pQ = question;
                }
                var newQuestionList =[];
                for (var i=0;i<pQ.length;i++){
                    for(var j=0;j<cQ.length;j++){
                        if (pQ[i].question == cQ[j].question){
                            cQ[j].input_type = pQ[i].input_type;
                            if (pQ[i].input_type == 'select'){
                                cQ[j].select = pQ[i].select
                            }
                            newQuestionList.push(cQ[j]);
                            break;
                        }
                    }
                    
                }
                return newQuestionList;
            }
            var dummyData = function(){
                var deferred = $q.defer()
                let dummyDatas = {};
                deferred.resolve(dummyDatas);
                return deferred.promise
            }

            var prepareModel = function(model,customers,flag){
                var deferred = $q.defer();
                var customerPromiseList = model.customers.length;
                var referencePromiseList = 0;
                if (flag){
                    for(var i=0;i<model.customers.length;i++){
                        (function(customerIndex){
                            Enrollment.getCustomerById({id:model.customers[i].customerId}).$promise.then((customer)=>{
                                customerPromiseList -= 1;
                                referencePromiseList = referencePromiseList + customer.verifications.length
                                for ( var j=0;j<customer.verifications.length;j++){
                                   (function(referenceIndex){
                                       var referenceName = customer.verifications[referenceIndex].referenceFirstName;
                                       var referencee = customer.verifications[referenceIndex];
                                        Telecalling.find({processId:customer.verifications[j].id,processType:'CUSTOMER_REFERENCE'}).$promise.then(
                                            (reference) =>{
                                                var key = model.customers[customerIndex].type.toLowerCase()+'_reference_'+referenceIndex;
                                                model.promiseArray[model.customers[customerIndex].type].push(key);
                                                var type = model.customers[customerIndex].type;
                                                var title = referenceName;
                                                var parentData = {
                                                    'customerId':model.customers[customerIndex].customerId,
                                                    'processId':referencee.id,
                                                    'mobileNo': referencee.mobileNo,
                                                    "occupation":referencee.occupation,
                                                    'address':referencee.address
                                                }
                                                model.telecalling[key] = {
                                                    "key": key,
                                                    "fullkey": 'telecalling.'+key,
                                                    'type':type,
                                                    'title':referenceName,
                                                    'referenceDetails':{
                                                        "firstName":referencee.referenceFirstName,
                                                        'mobileNo': referencee.mobileNo,
                                                        "occupation":referencee.occupation,
                                                        'address':referencee.address
                                                    },
                                                    'telecallingDetail':prepareQuestionarieList(reference[0],model,type,parentData),
                                                };
                                                referencePromiseList -= 1;
                                                if (customerPromiseList == 0 && referencePromiseList ==0)
                                                    deferred.resolve()
                                            }
                                        )
                                   })(j)
                                }
                                if (customerPromiseList == 0 && referencePromiseList ==0){
                                    deferred.resolve();
                                }
                            })
                        })(i)
                    }
                }
                // get the customer list
                // get the references
                // get the questions
                // prepare model based on the reference type
                // get the reference based on the id and map accordingly
                // validate all are resolved and resolve the promise
                return deferred.promise;
            }
            var dynamicTelecallingBox = function(config){
                var key = config.key || null;
                var fullkey = config.fullkey || null;
                var title = config.title || '';
                var type = config.type || '';
                return {
                    "telecallingBox":{
                        "title":title,
                        "type":"box",
                        "items":{
                            "referenceDetails":{
                                "type":"fieldset",
                                "title": type.toUpperCase()+'_REFERENCE_DETAILS',
                                "items":{
                                "referenceFirstName":{
                                    "title":"NAME",
                                    "type":"string",
                                    "key":fullkey+".referenceDetails.firstName",
                                    "readonly":true,
                                },
                                "referennceMobileNo":{
                                    "title":"MOBILE_NO",
                                    "type":"string",
                                    "key":fullkey+".referenceDetails.mobileNo",
                                    "readonly":true,
                                },
                                "referenceOccupation":{
                                    "title":"OCCUPATION",
                                    "type":"string",
                                    "key":fullkey+".referenceDetails.occupation",
                                    "readonly":true,
                                },
                                "referenceAddress":{
                                    "title":"ADDRESS",
                                    "type":"string",
                                    "key":fullkey+".referenceDetails.address",
                                    "readonly":true,
                                }
                                }
                            },
                            "telecallingDetail":{
                                "type": "fieldset",
                                "title":'TELECALLING_DETAILS',
                                "items": {
                                    "telecallingResponse": {
                                        "key": fullkey+".telecallingDetail.telecallingResponse",
                                        "type": "select",
                                        "title": "TELECALLING_RESPONSE",
                                        "enumCode": "telecalling_response",
                                        "readonly":readonlyFlag,
                                    },
                                    "noOfCallAttempts": {
                                        "readonly":readonlyFlag,
                                        "key": fullkey+".telecallingDetail.noOfCallAttempts",
                                        "type": "number",
                                        "title": "NO_OF_CALLATTEMPTS"
                                    },
                                    "followupCallRequired": {
                                        "readonly":readonlyFlag,
                                        "key": fullkey+".telecallingDetail.followupCallRequired",
                                        "type": "date",
                                        "title": "FOLLOWUP_ON"
                                    },
                                    "telecallingRemarks": {
                                        "readonly":readonlyFlag,
                                        "key": fullkey+".telecallingDetail.telecallingRemarks",
                                        "type": "textarea",
                                        "title": "TELECALLING_REMARKS"
                                    },
                                    "questions": {
                                        "readonly":readonlyFlag,
                                        "type": "fieldset",
                                        "title": "QUESTIONS",
                                        "items": []
                                    },
                                    "telecallingQuestionnaireList": {
                                        "readonly":readonlyFlag,
                                        "key": fullkey+".telecallingDetail.telecallingQuestionnaireList",
                                        "type": "array",
                                        "add": null,
                                        "remove": null,
                                        "view": "fixed",
                                        "items": {
                                            "question":{
                                                "key": fullkey+".telecallingDetail.telecallingQuestionnaireList[].question",
                                                "type": "textarea",
                                                "title": "QUESTION",
                                                "readonly": true
                                            },
                                            "answer1":{
                                                "readonly":readonlyFlag,
                                                "key": fullkey+".telecallingDetail.telecallingQuestionnaireList[].answer",
                                                "type": "string",
                                                "title": "ANSWER",
                                                "condition": "model."+fullkey+".telecallingDetail.telecallingQuestionnaireList[arrayIndex].input_type=='string'"
                                            },
                                            "answer2":{
                                                "readonly":readonlyFlag,
                                                "key": fullkey+".telecallingDetail.telecallingQuestionnaireList[].answer",
                                                "type": "textarea",
                                                "title": "ANSWER",
                                                "condition": "model."+fullkey+".telecallingDetail.telecallingQuestionnaireList[arrayIndex].input_type=='textarea'"
                                            },
                                            "answer3":{
                                                "readonly":readonlyFlag,
                                                "key": fullkey+".telecallingDetail.telecallingQuestionnaireList[].answer",
                                                "type": "number",
                                                "title": "ANSWER",
                                                "condition": "model."+fullkey+".telecallingDetail.telecallingQuestionnaireList[arrayIndex].input_type=='number'"
                                            },
                                            "answer4":{
                                                "readonly":readonlyFlag,
                                                "key": fullkey+".telecallingDetail.telecallingQuestionnaireList[].answer",
                                                "title": "ANSWER",
                                                "condition": "model."+fullkey+".telecallingDetail.telecallingQuestionnaireList[arrayIndex].input_type=='select'",
                                                "type": "lov",
                                                "autolov": true,
                                                "lovonly": true,
                                                "bindMap": {},
                                                "searchHelper": formHelper,
                                                "search": function (inputModel, form, model, context) {
                                                    var list = {};
                                                    list = model.telecalling[key].telecallingDetail.telecallingQuestionnaireList[context.arrayIndex].select;

                                                    var out = [];
                                                    _.forEach(list, function (val) {
                                                        out.push({ "name": val });
                                                    });

                                                    return $q.resolve({
                                                        headers: {
                                                            "x-total-count": out.length
                                                        },
                                                        body: out
                                                    });
                                                },
                                                onSelect: function (valueObj, model, context) {
                                                    model.telecalling[key].telecallingDetail.telecallingQuestionnaireList[context.arrayIndex].answer = valueObj.name;
                                                },
                                                getListDisplayItem: function (item, index) {
                                                    return [
                                                        item.name
                                                    ];
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };
            var DynamicformRequest = function(config){
                getAllIncludesFromJson('','',dynamicTelecallingBox({}),true);
                var tempIncludes = globalListkeys;
                return {
                                "overrides": {},
                                "includes": tempIncludes,
                                "excludes": [],
                                "options": {
                                    "repositoryAdditions":dynamicTelecallingBox(config)
                                }
                }
            }

            var formaction = function(){
                return [
                    {
                        "type": "actionbox",
                        "condition":"model.readonlyFlag",
                        "items": [
                            {
                                "type": "button",
                                "title": "SAVE",//PROCEED
                                "onClick": "actions.save(model, formCtrl, form, $event)"
                            }
                        ]
                    },
                ]
            }

            return {
                "type": "schema-form",
                "title": "TELEVERIFICATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    model.telecalling = {};
                    currentStage = model.loanProcess.loanAccount.currentStage;
                    if(currentStage == 'Televerification'){
                        readonlyFlag =  false;
                        model.readonlyFlag = !readonlyFlag;
                    }   
                        
                    model.customers = [
                        {
                            'customerId':model.loanProcess.loanAccount.customerId,
                            'type':'business',
                            'title':"BUSINESS",
                        }
                    ]
                    for(var i=0;i<model.loanProcess.loanAccount.loanCustomerRelations.length;i++){
                        if (model.loanProcess.loanAccount.loanCustomerRelations[i].relation.toLowerCase() == 'applicant'){
                            model.customers.push({
                                'customerId': model.loanProcess.loanAccount.loanCustomerRelations[i].customerId,
                                'type':"applicant",
                                "title":'APPLICANT'
                            })
                        }
                    }
                    model.promiseArray = {

                    }
                    for (var i=0;i<model.customers.length;i++){
                        model.promiseArray[model.customers[i].type]=[];
                    }
                    var self = this;
                    Queries.questionnaireDetails('TELECALLING', 'Tele', 'televerification').then(function(questions){
                        model.questions = questions;
                        var outCount = 0;
                        var formPromiseArrray =[];
                        self.childForm = [];
                        self.forms = [];
                        var parentFormArray = [];
                        prepareModel(model,{},true).then(function(){
                            console.log(model.telecalling);
                            Object.keys(model.promiseArray).forEach(function(key,value) {
                                (function(key,count){
                                    formPromiseArrray[count] = [];
                                    self.childForm[count] = [];
                                    var parentKey = model.promiseArray[key];
                                    for (var i=0;i<model.promiseArray[key].length;i++){
                                        (function(index){
                                                formPromiseArrray[count].push(
                                                    IrfFormRequestProcessor.buildFormDefinition({}, DynamicformRequest(model.telecalling[parentKey[i]]), {}, model).then(function(form){
                                                        self.childForm[count] = self.childForm[count].concat(form);
                                                    })
                                                )
                                        })(i);
                                    }
                                    if (formPromiseArrray[count].length>0){
                                        parentFormArray.push($q.all(formPromiseArrray[count]).then(function(){
                                            self.forms.push({
                                                form:self.childForm[count],
                                                
                                                title:key.charAt(0).toUpperCase()+key.slice(1)+' References'
                                            });
                                        }
                                    ))
                                    }
                                outCount = outCount+1;
                                })(key,outCount)
                                
                            });
                            $q.all(parentFormArray).then(function(){
                                form=irfFormToggler.prepareToggleForm('BUSINESS', self.forms, formaction(), model);
                                console.log(form);
                                self.form=form;
                            })
                        });
                    }) 
                    
                    // get the list of boxes
                    // for all the boxed get the list of the references 
                    //      prepare all the boxes for each references
                    // put a promise array for all the refrence and added to form toogels
                    // after form toglerr form generation call the form toggler
                    // 
                //     model.loanCustomer = {};
                //     model.applicant = {};
                //     model.coApplicants = [];
                //     model.guarantors = [];

                //     model.coapplicant = {};
                //     model.guarantor = {};
                //     model.loanAccount = model.loanProcess.loanAccount;
                //     // Setting necessary parties to child arrays.
                //     model.applicant.customer = model.loanProcess.applicantEnrolmentProcess.customer;
                //     model.loanCustomer.customer = model.loanProcess.loanCustomerEnrolmentProcess.customer;

                //     _.forEach(model.loanProcess.coApplicantsEnrolmentProcesses, function(i){
                //         model.coApplicants.push({"customer":i.customer});
                //     })

                //     _.forEach(model.loanProcess.guarantorsEnrolmentProcesses, function(i){
                //         model.guarantors.push({"customer":i.customer});
                //     })

                //     // applicant telecalling details
                //     model.telecalling.applicant = _.filter(model.loanAccount.telecallingDetail, {"partyType": "applicant"});
                //     // coapplicant telecalling details
                //     model.telecalling.coApplicant = _.filter(model.loanAccount.telecallingDetail, {"partyType": "coApplicant"});
                //     // guarantor telecalling details
                //     model.telecalling.guarantor = _.filter(model.loanAccount.telecallingDetail, {"partyType": "guarantor"});
                //     // business telecalling details
                //     model.telecalling.loanCustomer = _.filter(model.loanAccount.telecallingDetail, {"partyType": "loanCustomer"});

                //     var self = this;
                //     Queries.questionnaireDetails('TELECALLING', 'Tele', 'televerification').then(
                //         function(res) { 
                //             model.applicant.telecallingQuestionnaireList = _.filter(res, function(obj) {
                //                 return obj.party_type == 'applicant';     
                //             });
                //             model.loanCustomer.telecallingQuestionnaireList = _.filter(res, function(obj) {
                //                 return obj.party_type == 'loanCustomer';
                //             });
                //             model.coapplicantQuestions = _.filter(res, function(obj) {
                //                 return obj.party_type == 'coApplicant';
                //             });
                //             model.guarantorQuestions = _.filter(res, function(obj) {
                //                 return obj.party_type == 'guarantor';
                //             });

                //             _.forEach(model.coApplicants, function(val, key) {
                //                 model.coApplicants[key].telecallingQuestionnaireList = model.coapplicantQuestions;
                //                 if(model.telecalling.coApplicant.length>0) {
                //                     var findKey = _.findLastIndex(model.telecalling.coApplicant, ["customerId", val.customer.id]);
                //                     if(findKey!=-1) {
                //                         model.coApplicants[key].telecallingResponse = model.telecalling.coApplicant[findKey].telecallingResponse;
                //                         model.coApplicants[key].noOfCallAttempts = model.telecalling.coApplicant[findKey].noOfCallAttempts;
                //                         model.coApplicants[key].followupCallRequired = model.telecalling.coApplicant[findKey].followupCallRequired;
                //                         model.coApplicants[key].telecallingRemarks = model.telecalling.coApplicant[findKey].telecallingRemarks;
                //                         _.forEach(model.coapplicantQuestions, function(qval, qkey) {
                //                             var callingDetails = _.find(model.telecalling.coApplicant[findKey].telecallingQuestionnaireList, {"question": qval.question});
                //                             if(!_.isNull(callingDetails)) {
                //                                model.coApplicants[key].telecallingQuestionnaireList[qkey].answer = callingDetails.answer;
                //                             }
                //                         });
                //                     }
                //                 }
                //             });

                //             _.forEach(model.guarantors, function(val, key) {
                //                 model.guarantors[key].telecallingQuestionnaireList = model.guarantorQuestions;
                //                 if(model.telecalling.guarantor.length>0) {
                //                     var findKey = _.findLastIndex(model.telecalling.guarantor, ["customerId", val.customer.id]);
                //                     if(findKey!=-1) {
                //                         model.guarantors[key].telecallingResponse = model.telecalling.guarantor[findKey].telecallingResponse;
                //                         model.guarantors[key].noOfCallAttempts = model.telecalling.guarantor[findKey].noOfCallAttempts;
                //                         model.guarantors[key].followupCallRequired = model.telecalling.guarantor[findKey].followupCallRequired;
                //                         model.guarantors[key].telecallingRemarks = model.telecalling.guarantor[findKey].telecallingRemarks;
                //                         _.forEach(model.guarantorQuestions, function(qval, qkey) {
                //                             var callingDetails = _.find(model.telecalling.guarantor[findKey].telecallingQuestionnaireList, {"question": qval.question});
                //                             if(!_.isNull(callingDetails)) {
                //                                model.guarantors[key].telecallingQuestionnaireList[qkey].answer = callingDetails.answer;
                //                             }
                //                         });
                //                     }
                //                 }
                //             });

                //             if(model.telecalling.applicant.length>0) {
                //                 var findKey = model.telecalling.applicant.length-1;
                //                 model.applicant.telecallingResponse = model.telecalling.applicant[findKey].telecallingResponse;
                //                 model.applicant.noOfCallAttempts = model.telecalling.applicant[findKey].noOfCallAttempts;
                //                 model.applicant.followupCallRequired = model.telecalling.applicant[findKey].followupCallRequired;
                //                 model.applicant.telecallingRemarks = model.telecalling.applicant[findKey].telecallingRemarks;
                //                 _.forEach(model.applicant.telecallingQuestionnaireList, function(val, key) {
                //                     var callingDetails = _.find(model.telecalling.applicant[findKey].telecallingQuestionnaireList, {"question": val.question});
                //                     if(!_.isNull(callingDetails)) {
                //                        model.applicant.telecallingQuestionnaireList[key].answer = callingDetails.answer;
                //                     }
                //                 });
                //             }


                //             if(model.telecalling.loanCustomer.length>0) {                            
                //                 var findKey = model.telecalling.loanCustomer.length-1;
                //                 model.loanCustomer.telecallingResponse = model.telecalling.loanCustomer[findKey].telecallingResponse;
                //                 model.loanCustomer.noOfCallAttempts = model.telecalling.loanCustomer[findKey].noOfCallAttempts;
                //                 model.loanCustomer.followupCallRequired = model.telecalling.loanCustomer[findKey].followupCallRequired;
                //                 model.loanCustomer.telecallingRemarks = model.telecalling.loanCustomer[findKey].telecallingRemarks;
                //                 _.forEach(model.loanCustomer.telecallingQuestionnaireList, function(val, key) {
                //                     var callingDetails = _.find(model.telecalling.loanCustomer[findKey].telecallingQuestionnaireList, {"question": val.question});
                //                     if(!_.isNull(callingDetails)) {
                //                        model.loanCustomer.telecallingQuestionnaireList[key].answer = callingDetails.answer;
                //                     }
                //                 });
                //             }

                //            /* UIRepository.getEnrolmentProcessUIRepository().$promise
                //             .then(function(repo){
                //                 return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest(model), configFile(), model)
                //             })
                //             .then(function(form){
                //                 self.form = form;
                //             });*/
                //         },
                //         function(err) {
                //             console.log(err);
                //         }
                //     )
                //    /* model.loanProcess = bundleModel.loanProcess;
                //     if(_.hasIn(model.loanProcess, 'loanAccount')) {
                //         model.loanAccount = model.loanProcess.loanAccount;
                //     }*/
                   
                //     UIRepository.getEnrolmentProcessUIRepository().$promise
                //     .then(function(repo){
                //         return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest(model), configFile(), model);
                //     })
                //     .then(function(form){
                //         self.form = form;
                //     });

                    
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
                        PageHelper.showLoader();
                        var reqData = [];
                        var requestMap = {};
                        Object.keys(model.telecalling).forEach(function(key,value){
                            var title = model.telecalling[key].telecallingDetail.customerId + '_' + model.telecalling[key].telecallingDetail.processId;
                            reqData.push(model.telecalling[key]);
                            requestMap[title] = {'key':key};
                        })
                        Telecalling.bulkUpdate(reqData).$promise.then(function(resp){
                            PageHelper.hideLoader();
                            for (var i=0;i<resp.length;i++){
                                var title = resp[i].telecallingDetail.customerId+'_'+resp[i].telecallingDetail.processId;
                                resp[i].telecallingDetail.telecallingQuestionnaireList = prepareInputType(model.questions,resp[i].telecallingDetail.telecallingQuestionnaireList,model.telecalling[requestMap[title].key].type+'_reference')
                                model.telecalling[requestMap[title].key].telecallingDetail = resp[i].telecallingDetail;
                            }
                        },function(err){
                            PageHelper.showErrors(err);
                            PageHelper.hideLoader();
                        })
                    }
                }
            };
        }
    }
})