define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "kgfs.customer.IndividualEnrolment2",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository) {

            AngularResourceService.getInstance().setInjector($injector);
            var branch = SessionStore.getBranch();
           /* var pageParams = {
                readonly: true
            };*/

            var preSaveOrProceed = function (reqData) {
                if (_.hasIn(reqData, 'customer.familyMembers') && _.isArray(reqData.customer.familyMembers)) {
                    var selfExist = false
                    for (var i = 0; i < reqData.customer.familyMembers.length; i++) {
                        var f = reqData.customer.familyMembers[i];
                        if (_.isString(f.relationShip) && f.relationShip.toUpperCase() == 'SELF') {
                            selfExist = true;
                            break;
                        }
                    }
                    if (selfExist == false) {
                        PageHelper.showProgress("pre-save-validation", "Self Relationship is Mandatory", 5000);
                        return false;
                    }
                } else {
                    PageHelper.showProgress("pre-save-validation", "Family Members section is missing. Self Relationship is Mandatory", 5000);
                    return false;
                }
                return true;
            }

            var configFile = function () {
                return{
                    "loanProcess.loanAccount.currentStage":{
                        "KYCCheck":{
                            "overrides":{
                                "IndividualInformation":{
                                    "readonly":true
                                },
                                "KYC":{
                                    "readonly":true
                                },
                                "ContactInformation":{
                                    "readonly":true
                                },
                                "loanInformation":{
                                    "readonly":true
                                },
                                "FamilyDetails":{
                                    "readonly":true
                                },
                                "IndividualFinancials":{
                                    "readonly":true
                                },
                                "IndividualReferences":{
                                    "readonly":true
                                }

                            }
                        },
                        "Rejected":{
                            "overrides":{
                                "IndividualInformation":{
                                    "readonly":true
                                },
                                "KYC":{
                                    "readonly":true
                                },
                                "ContactInformation":{
                                    "readonly":true
                                },
                                "loanInformation":{
                                    "readonly":true
                                },
                                "FamilyDetails":{
                                    "readonly":true
                                },
                                "IndividualFinancials":{
                                    "readonly":true
                                },
                                "IndividualReferences":{
                                    "readonly":true
                                }

                            }
                        },
                        "DSCApproval":{
                            "overrides":{
                                "IndividualInformation":{
                                    "readonly":true
                                },
                                "KYC":{
                                    "readonly":true
                                },
                                "ContactInformation":{
                                    "readonly":true
                                },
                                "loanInformation":{
                                    "readonly":true
                                },
                                "FamilyDetails":{
                                    "readonly":true
                                },
                                "IndividualFinancials":{
                                    "readonly":true
                                },
                                "IndividualReferences":{
                                    "readonly":true
                                }

                            }
                        },
                        "LosDSCOverride":{
                            "overrides":{
                                "IndividualInformation":{
                                    "readonly":true
                                },
                                "KYC":{
                                    "readonly":true
                                },
                                "ContactInformation":{
                                    "readonly":true
                                },
                                "loanInformation":{
                                    "readonly":true
                                },
                                "FamilyDetails":{
                                    "readonly":true
                                },
                                "IndividualFinancials":{
                                    "readonly":true
                                },
                                "IndividualReferences":{
                                    "readonly":true
                                }

                            }
                        },
                        "RiskReviewAndLoanSanction":{
                            "overrides":{
                                "IndividualInformation":{
                                    "readonly":true
                                },
                                "KYC":{
                                    "readonly":true
                                },
                                "ContactInformation":{
                                    "readonly":true
                                },
                                "loanInformation":{
                                    "readonly":true
                                },
                                "FamilyDetails":{
                                    "readonly":true
                                },
                                "IndividualFinancials":{
                                    "readonly":true
                                },
                                "IndividualReferences":{
                                    "readonly":true
                                }

                            }
                        }    
                    }
                }
                    
            }
            var overridesFields = function (bundlePageObj) {
               return {
                        "IndividualReferences":{
                            title:"REFERENCE"
                        },
                        "IndividualReferences.verifications":{
                            title:"REFERENCE"
                        },
                        "IndividualReferences.verifications.referenceFirstName":{
                            orderNo:10,
                            title:"NAME",
                            required:true,
                            type:"string"
                        },
                        "IndividualReferences.verifications.relationship":{
                            orderNo:20,
                            title:"RELATION1",
                            required:true,
                            type:"select"
                        },
                        "IndividualReferences.verifications.mobileNo":{
                            orderNo:30,
                            title:"PHONE_NUMBER",
                            required:true,
                            "type": "number"                            
                        },
                        "IndividualReferences.verifications.address":{
                            required:true
                        },
                        "HouseVerification.houseDetailsFieldSet":{
                            orderNo:70
                        },
                        "HouseVerification":{
                            "condition" : "model.customer.currentStage == 'Stage02' || model.customer.currentStage == 'Completed'"
                        },
                        "BusinessOccupationDetails":{
                            "required": true,
                            "condition" : "model.customer.currentStage == 'Stage02' || model.customer.currentStage == 'Completed'"
                        },
                        "BankAccounts":{
                            orderNo: 100,
                            "condition" : "model.customer.currentStage == 'Stage02' || model.customer.currentStage == 'Completed'"
                        },
                        "IndividualInformation.customerBranchId": {
                            "title":"BRANCH",
                            orderNo: 10,
                            "required": true,
                            "readonly": true,
                            enumCode: "userbranches"
                        }, 
                        "IndividualInformation.customerId": {
                            orderNo: 20,
                            "readonly":true

                        },
                        "IndividualInformation.urnNo" : {
                            orderNo: 30,
                            "readonly":true

                        },
                        "IndividualInformation.photoImageId":{
                            "orderNo": 40,
                           "viewParams": function(modelValue, form, model) {
                               return {
                                   customerId: model.customer.id
                               };
                           },
                           "required": true,
                         //  "readonly": true
                       },
                       "IndividualInformation.existingLoan":{
                        "required":true,
                        "title":"EXISTING_LOAN_FROM_BANK",
                        "orderNo": 41
                       },
                       "IndividualInformation.title":{
                        "orderNo": 50
                       },
                        "IndividualInformation.firstName": {
                            "orderNo": 60,
                            "type": "string",
                            "schema": {
                                "pattern": "^[a-zA-Z\. ]+$",
                            },
                            "validationMessage": {
                                202: "Only alphabets and space are allowed."
                            },
                            "onCapture": EnrollmentHelper.customerAadhaarOnCapture
                        },

                        "IndividualInformation.gender":{
                            orderNo: 60
                        },
                        "IndividualInformation.age": {
                            orderNo:70,
                            "onChange": function (modelValue, form, model) {
                                if (model.customer.age > 0) {
                                    if (model.customer.dateOfBirth) {
                                        model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-') + moment(model.customer.dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                    } else {
                                        model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-MM-DD');
                                    }
                                }
                            }
                        },
                        "IndividualInformation.dateOfBirth":{
                            orderNo:80,
                            "onChange": function (modelValue, form, model) {
                                if (model.customer.dateOfBirth) {
                                    model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            }
                        },
                        "IndividualInformation.religion":{
                            orderNo: 90,
                            "type": "string",
                            "required": false
                        },
                        "IndividualInformation.language":{
                            "type": "string",
                            "required": false
                        },
                        "IndividualInformation.area":{
                            "required": true
                        },
                        "IndividualInformation.fatherFirstName": {
                            "title":"FATHERS_FULL_NAME",
                            "type": "string",
                            "schema": {
                                "pattern": "^[a-zA-Z\. ]+$",
                            },
                            "validationMessage": {
                                202: "Only alphabets and space are allowed."
                            },
                            "required": false
                        },
                        "IndividualInformation.motherName":{
                            "title":"MOTHERS_NAME"
                        },
                        "IndividualInformation.spouseDateOfBirth": {
                            "title":"SPOUSE_DOB",
                            "required": true,
                            condition: "model.customer.maritalStatus==='MARRIED'",
                            "onChange": function (modelValue, form, model) {
                                if (model.customer.spouseDateOfBirth) {
                                    model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            }
                        },
                        "IndividualInformation.spouseFirstName": {
                            key: "customer.spouseFirstName",
                            condition: "model.customer.maritalStatus==='MARRIED' || model.customer.maritalStatus === 'WIDOWER'",
                            "required": true,
                            "type": "string",
                            "schema": {
                                "pattern": "^[a-zA-Z\. ]+$",
                            },
                            "validationMessage": {
                                202: "Only alphabets and space are allowed."
                            },
                            "onCapture": function (result, model, form) {
                                $log.info(result); // spouse id proof
                                var aadharData = EnrollmentHelper.parseAadhaar(result.text);
                                $log.info(aadhaarData);
                                model.customer.udf.userDefinedFieldValues.udf33 = 'Aadhar card';
                                model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                                model.customer.spouseFirstName = aadhaarData.name;
                                if (aadhaarData.yob) {
                                    model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                    model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            }
                        },
                        "KYC.additionalKYCs":{
                            title:"ADDRESS_PROOFS"
                        },
                        "KYC.customerId":{
                            orderNo:10,
                            required:true,
                            condition:"!model.customer.customerId",
                            initialize: function(model, form, parentModel, context) {
                                model.customerBranchId = parentModel.customer.customerBranchId;
                                model.centreId = parentModel.customer.centreId;
                                var centreCode = formHelper.enum('centre').data;
    
                                var centreName = $filter('filter')(centreCode, {value: parentModel.customer.centreId}, true);
                                if(centreName && centreName.length > 0) {
                                    model.centreName = centreName[0].name;
                                }
    
                            },
                            "inputMap": {
                                "firstName": {
                                    "key": "customer.firstName",
                                    "title": "CUSTOMER_NAME"
                                },
                                "urnNo": {
                                    "key": "customer.urnNo",
                                    "title": "URN_NO",
                                    "type": "string"
                                },
                                "customerBranchId": {
                                    "key": "customer.customerBranchId",
                                    "type": "select",
                                    "screenFilter": true,
                                    "readonly": true
                                },
                                "centreName": {
                                    "key": "customer.place",
                                    "title":"CENTRE_NAME",
                                    "type": "string",
                                    "readonly": true,
    
                                },
                                "centreId":{
                                    key: "customer.centreId",
                                    "title":"CENTRE_CODE1",
                                    type: "lov",
                                    autolov: true,
                                    lovonly: true,
                                    bindMap: {},
                                    searchHelper: formHelper,
                                    search: function(inputModel, form, model, context) {
                                        var centres = SessionStore.getCentres();
                                        // $log.info("hi");
                                        // $log.info(centres);
    
                                        var centreCode = formHelper.enum('centre').data;
                                        var out = [];
                                        if (centres && centres.length) {
                                            for (var i = 0; i < centreCode.length; i++) {
                                                for (var j = 0; j < centres.length; j++) {
                                                    if (centreCode[i].value == centres[j].id) {
    
                                                        out.push({
                                                            name: centreCode[i].name,
                                                            id:centreCode[i].value
                                                        })
                                                    }
                                                }
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
                                        model.centreId = valueObj.id;
                                        model.centreName = valueObj.name;
                                    },
                                    getListDisplayItem: function(item, index) {
                                        return [
                                            item.name
                                        ];
                                    }
                                },
                            },
                            "outputMap": {
                                "urnNo": "customer.urnNo",
                                "firstName":"customer.firstName"
                            },
                            "searchHelper": formHelper,
                            "search": function(inputModel, form) {
                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var branches = formHelper.enum('branch_id').data;
                                var branchName;
                                for (var i=0; i<branches.length;i++){
                                    if(branches[i].code==inputModel.customerBranchId)
                                        branchName = branches[i].name;
                                }
                                var promise = Enrollment.search({
                                    'branchName': branchName ||SessionStore.getBranch(),
                                    'firstName': inputModel.firstName,
                                    'centreId':inputModel.centreId,
                                    'customerType':"individual",
                                    'urnNo': inputModel.urnNo
                                }).$promise;
                                return promise;
                            },
                            getListDisplayItem: function(data, index) {
                                return [
                                    [data.firstName, data.fatherFirstName].join(' | '),
                                    data.id,
                                    data.urnNo
                                ];
                            },
                            onSelect: function(valueObj, model, context){
                                PageHelper.showProgress('customer-load', 'Loading customer...');
    
                                var enrolmentDetails = {
                                    'customerId': model.customer.id,
                                    'customerClass': model._bundlePageObj.pageClass,
                                    'firstName': model.customer.firstName
                                };
    
                                if (_.hasIn(model, 'customer.id')){
                                    BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails)
                                }
                                
                                EnrolmentProcess.fromCustomerID(valueObj.id)
                                    .finally(function(){
                                        PageHelper.showProgress('customer-load', 'Done.', 5000);
                                    })
                                    .subscribe(function(enrolmentProcess){
                                        /* Updating the loan process */
                                        model.loanProcess.removeRelatedEnrolmentProcess(model.enrolmentProcess, model.loanCustomerRelationType);
                                        model.loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, model.loanCustomerRelationType);
    
                                        /* Setting on the current page */
                                        model.enrolmentProcess = enrolmentProcess;
                                        model.customer = enrolmentProcess.customer;
    
                                        BundleManager.pushEvent(model.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                                        BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                                    })
                            }
                        },
                        "KYC.identityProofFieldSet":{
                            orderNo: 20
                        },
                        "KYC.identityProof": {
                            "key": "customer.identityProof",
                            orderNo: 30,
                            "type": "select"
                        },
                        "KYC.identityProofImageId": {
                            orderNo: 40
                        },
                        "KYC.identityProofNo": {
                            "key": "customer.identityProofNo",
                            orderNo: 50,
                            "type": "barcode"
                        },
                        "KYC.idProofIssueDate": {
                            "key" : "customer.idProofIssueDate",
                            orderNo: 60,
                            "type" : "date"
                        },
                        "KYC.idProofValidUptoDate": {
                            "key" : "customer.idProofValidUptoDate",
                            orderNo: 70,
                            "type" : "date"
                        },
                        "KYC.addressProofFieldSet":{
                            orderNo: 90,
                            condition: "!model.customer.addressProofSameAsIdProof",
                        },
                        "KYC.addressProof": {
                            "key": "customer.addressProof",
                            orderNo: 100,
                            condition: "!model.customer.addressProofSameAsIdProof",
                            "type": "select",
                            required:false
                        },
                        "KYC.addressProofImageId": {
                            orderNo: 110,
                            required:false
                        },
                        "KYC.addressProofNo": {
                            "key": "customer.addressProofNo",
                            orderNo: 140,
                            "type": "qrcode",
                            condition: "!model.customer.addressProofSameAsIdProof",
                            "onCapture": function (result, model, form) {
                                $log.info(result);
                                model.customer.addressProofNo = result.text;
                            }
                        },
                        "KYC.addressProofIssueDate": {
                            "title":"ISSUE_DATE",
                            "key": "customer.addressProofIssueDate",
                            orderNo: 120,
                            condition: "!model.customer.addressProofSameAsIdProof",
                            "type": "date"
                        },
                        "KYC.addressProofValidUptoDate": {
                            "title":"VALID_UPTO",
                            "key": "customer.addressProofValidUptoDate",
                            orderNo: 130,
                            condition: "!model.customer.addressProofSameAsIdProof",
                            "type": "date"
                        },
                        "ContactInformation.mobilePhone":{
                            "required": true,
                            "title":"MOBILE_NO"

                        },
                        "ContactInformation.landLineNo":{
                            "key":"customer.landLineNo",
                            "title":"ALTERNATE_MOBILE_NO"

                        },
                        "ContactInformation.email":{
                            "title":"EMAIL_ID"
                        },
                        "ContactInformation.doorNo":{
                            "title":"DOOR_BUILDING"
                        },
                        "ContactInformation.mailingDoorNo":{
                            "title":"DOOR_BUILDING"
                        },
                        "ContactInformation.mailingPincode": {
                            condition: "!model.customer.mailSameAsResidence",
                            type: "lov",
                            fieldType: "string",
                            autolov: true,
                            inputMap: {
                                "mailingPincode": "customer.mailingPincode",
                                "mailingDivision": "customer.mailingLocality",
                                "mailingtaluk": "customer.mailingtaluk",
                                "region": "customer.villageName",
                                "mailingDistrict": {
                                    key: "customer.mailingDistrict"
                                },
                                "mailingState": {
                                    key: "customer.mailingState"
                                }
                            },
                            outputMap: {
                                "mailingDivision": "customer.mailingLocality",
                                "mailingPincode": "customer.mailingPincode",
                                "mailingDistrict": "customer.mailingDistrict",
                                "mailingState": "customer.mailingDivision"
                            },
                            searchHelper: formHelper,
                            initialize: function (inputModel) {
                                $log.warn('in pincode initialize');
                                $log.info(inputModel);
                                inputModel.region = undefined;
                            },
                            search: function (inputModel, form, model) {
                                if (!inputModel.mailingPincode) {
                                    return $q.reject();
                                }
                                return Queries.searchPincodes(
                                    inputModel.mailingPincode,
                                    inputModel.mailingDistrict,
                                    inputModel.mailingState,
                                    inputModel.mailingDivision,
                                    inputModel.region,
                                    inputModel.mailingtaluk
                                );
                            },
                            getListDisplayItem: function (item, index) {
                                return [
                                    item.division + ', ' + item.region,
                                    item.pincode,
                                    item.district + ', ' + item.state
                                ];
                            },
                            onSelect: function (result, model, context) {
                                model.customer.mailingPincode = (new Number(result.pincode)).toString();
                                model.customer.mailingLocality = result.division;
                                model.customer.mailingState = result.state;
                                model.customer.mailingDistrict = result.district;
                            }
                        },
                        "ContactInformation.pincode": {
                            "type": "lov",
                            "title": "PIN_CODE",
                            fieldType: "number",
                            autolov: true,
                            inputMap: {
                                "pincode": {
                                    key:  "customer.pincode"
                                },
                                "division": {
                                    key: "customer.locality"
                                },
                                "region": {
                                    key: "customer.villageName"
                                },
                                "taluk": {
                                    key: "customer.taluk"
                                },
                                "district": {
                                    key: "customer.district"
                                },
                                "state": {
                                    key: "customer.state"
                                }
                            },
                            outputMap: {
                                "division": "customer.locality",
                                "region": "customer.villageName",
                                "pincode": "customer.pincode",
                                "district": "customer.district",
                                "state": "customer.state",
                            },
                            searchHelper: formHelper,
                            initialize: function (inputModel) {
                                $log.warn('in pincode initialize');
                                $log.info(inputModel);
                            },
                            search: function (inputModel, form, model) {
                                if (!inputModel.pincode) {
                                    return $q.reject();
                                }
                                return Queries.searchPincodes(
                                    inputModel.pincode,
                                    inputModel.district,
                                    inputModel.state,
                                    inputModel.division,
                                    inputModel.region,
                                    inputModel.taluk
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
                        "ContactInformation.locality":{
                            title:"LOCALITY1"
                        },
                        "ContactInformation.permanentAddressFieldSet": {
                            condition: "!model.customer.residentialAddressAlsoBusinessAddress",
                        },
                        "ContactInformation.permanentAddressFieldSet": {
                            condition: "!model.customer.mailSameAsResidence",
                        },
                        "ContactInformation.mailSameAsResidence":{
                            "onChange": function (modelValue, form, model) {
                                BundleManager.pushEvent('load-address', model._bundlePageObj,{customer: model.customer});
                            }
                        },
                        "ContactInformation.residentialAddressAlsoBusinessAddress":{
                            "onChange": function (modelValue, form, model) {
                                if(model.customer.fcuStatu){
                                    model.customer.fcuStatus = 1;  
                                }
                                else{
                                    model.customer.fcuStatus = 0; 
                                }
                                BundleManager.pushEvent('load-address', model._bundlePageObj,{customer: model.customer});
                            }
                        },
                        "ContactInformation.mailingDoorNo":{
                            title:"DOOR_BUILDING",
                            condition: "!model.customer.mailSameAsResidence"
                        },
                        "ContactInformation.mailingStreet":{
                            condition: "!model.customer.mailSameAsResidence"
                        },
                        "ContactInformation.mailingLocality":{
                            title:"LOCALITY1",
                            condition: "!model.customer.mailSameAsResidence"
                        },
                        "ContactInformation.mailingVillageName":{
                            condition: "!model.customer.mailSameAsResidence"
                        },
                        "ContactInformation.mailinglandmark":{
                            condition: "!model.customer.mailSameAsResidence"
                        },
                        "ContactInformation.mailingPostoffice":{
                            condition: "!model.customer.mailSameAsResidence"
                        },
                        "ContactInformation.mailingDistrict":{
                            condition: "!model.customer.mailSameAsResidence"
                        },
                        "ContactInformation.mailingState":{
                            condition: "!model.customer.mailSameAsResidence"
                        },
                        "BankAccounts.customerBankAccounts": {
                            "onArrayAdd": function (modelValue, form, model, formCtrl, $event) {
                                modelValue.bankStatements = [];
                                var CBSDateMoment = moment(SessionStore.getCBSDate(), SessionStore.getSystemDateFormat());
                                var noOfMonthsToDisplay = 6;
                                var statementStartMoment = CBSDateMoment.subtract(noOfMonthsToDisplay, 'months').startOf('month');
                                for (var i = 0; i < noOfMonthsToDisplay; i++) {
                                    modelValue.bankStatements.push({
                                        startMonth: statementStartMoment.format(SessionStore.getSystemDateFormat())
                                    });
                                    statementStartMoment = statementStartMoment.add(1, 'months').startOf('month');
                                }
                        }
                        },
                        "BankAccounts.customerBankAccounts.ifscCode": {
                            "key": "customer.customerBankAccounts[].ifscCode",
                            "type": "lov",
                                "lovonly": true,
                                "required": true,
                                inputMap: {
                                    "ifscCode": {
                                        "key": "customer.customerBankAccounts[].ifscCode"
                                    },
                                    "bankName": {
                                        "key": "customer.customerBankAccounts[].customerBankName"
                                    },
                                    "branchName": {
                                        "key": "customer.customerBankAccounts[].customerBankBranchName"
                                    }
                                },
                                outputMap: {
                                    "bankName": "customer.customerBankAccounts[arrayIndex].customerBankName",
                                    "branchName": "customer.customerBankAccounts[arrayIndex].customerBankBranchName",
                                    "ifscCode": "customer.customerBankAccounts[arrayIndex].ifscCode"
                                },
                                searchHelper: formHelper,
                                search: function (inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = CustomerBankBranch.search({
                                        'bankName': inputModel.bankName,
                                        'ifscCode': inputModel.ifscCode,
                                        'branchName': inputModel.branchName
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function (data, index) {
                                    return [
                                        data.ifscCode,
                                        data.branchName,
                                        data.bankName
                                    ];
                                }
                        },
                        "BankAccounts.customerBankAccounts.bankStatements": {
                            "title": "STATEMENT_DETAILS",
                            "titleExpr": "moment(model.customer.customerBankAccounts[arrayIndexes[0]].bankStatements[arrayIndexes[1]].startMonth).format('MMMM YYYY') + ' ' + ('STATEMENT_DETAILS' | translate)",
                            "titleExprLocals": {moment: window.moment},
                            "startEmpty": true,
                            "items": {
                                "startMonth": {
                                    "key": "customer.customerBankAccounts[].bankStatements[].startMonth",
                                    "type": "date",
                                    "title": "START_MONTH"
                                },
                                "totalDeposits": {
                                    "key": "customer.customerBankAccounts[].bankStatements[].totalDeposits",
                                    "type": "amount",
                                    "calculator": true,
                                    "creditDebitBook": true,
                                    onDone: function (result, model, context) {
                                        model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalDeposits = result.totalCredit;
                                        model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalWithdrawals = result.totalDebit;
                                    },
                                    "title": "TOTAL_DEPOSITS"
                                },
                                "totalWithdrawals": {
                                    "key": "customer.customerBankAccounts[].bankStatements[].totalWithdrawals",
                                    "type": "amount",
                                    "title": "TOTAL_WITHDRAWALS"
                                },
                                "balanceAsOn15th": {
                                    "key": "customer.customerBankAccounts[].bankStatements[].balanceAsOn15th",
                                    "type": "amount",
                                    "title": "BALENCE_AS_ON_REQUESTED_EMI_DATE"
                                },
                                "noOfChequeBounced": {
                                    "key": "customer.customerBankAccounts[].bankStatements[].noOfChequeBounced",
                                    "type": "amount",
                                    //maximum:99,
                                    "required": true,
                                    "title": "NO_OF_CHEQUE_BOUNCED"
                                },
                                "noOfEmiChequeBounced": {
                                    "key": "customer.customerBankAccounts[].bankStatements[].noOfEmiChequeBounced",
                                    "type": "amount",
                                    "required": true,
                                    //maximum:99,
                                    "title": "NO_OF_EMI_CHEQUE_BOUNCED"
                                },
                                "bankStatementPhoto": {
                                    "key": "customer.customerBankAccounts[].bankStatements[].bankStatementPhoto",
                                    "type": "file",
                                    "required": true,
                                    "title": "BANK_STATEMENT_UPLOAD",
                                    "fileType": "application/pdf",
                                    "category": "CustomerEnrollment",
                                    "subCategory": "IDENTITYPROOF",
                                    "using": "scanner"
                                },
                            }
                        },
                        "IndividualInformation":{
                            "title": "PERSONAL_INFORMATION",
                            "orderNo":20
                        },
                        "ContactInformation":{
                            "orderNo":30
                        },
                        "KYC":{
                            "orderNo": 10,
                        },                       
                        "AdditionalKYC.additionalKYCs": {
                            add: true,
                            remove: true,
                            startEmpty: true,
                        },
                        "AdditionalKYC.additionalKYCs.kyc1ImagePath": {
                            required: true,
                            fileType: "image/*",
                            "using":"",
                            "viewParams": function(modelValue, form, model) {
                                return {
                                    customerId: model.customer.id
                                };
                            },
                        },
                        "AdditionalKYC.additionalKYCs.kyc1ProofNumber":{
                            "onCapture": function (result, model, form) {
                                $log.info(result);
                                model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                            }
                        },
                        "AdditionalKYC.additionalKYCs.kyc1ProofNumber3":{
                            "onCapture": function (result, model, form) {
                                $log.info(result);
                                model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                            }
                        },
                        "AdditionalKYC.additionalKYCs.kyc1ProofNumber2":{
                            "onCapture": function (result, model, form) {
                                $log.info(result);
                                model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                            }
                        },
                        "AdditionalKYC.additionalKYCs.kyc1ProofNumber1":{
                            "onCapture": function (result, model, form) {
                                $log.info(result);
                                model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
                            }
                        },
                        "BusinessOccupationDetails.businessDetails.ageOfEnterprise": {
                            "enumCode": "years_of_business",
                            "title": "AGE_OF_ENTERPRISE"
                        },
                        "BusinessOccupationDetails.businessDetails.businessVillage": {
                            key:"customer.enterprise.noOfRegularEmployees",
                            title: "NO_OF_WORKERS_EMPLOYED_NON_FAMILY",
                            type: "select",
                            enumCode: "noOfNonFamilyWorker"
                        },
                        "BusinessOccupationDetails.businessDetails.businessLandmark": {
                            title: "KIND_OF_EMPLOYEES",
                            type: "select",
                            titleMap: {
                                "Female": "Female",
                                "Male": "Male",
                                "Both": "Both"
                            }
                        },
                        "BusinessOccupationDetails.businessDetails.businessPincode": {
                            key:"enterprise.involvedInMarketTransactions",
                            title: "INVOLVEMENT_MARKET_RELATED_TRANSACTIONS",
                            type: "select",
                            titleMap: {
                                "YES": "Yes",
                                "NO": "NO",
                            },
                            schema: {
                                "type": ["string", "null"],
                            }
                        },
                        "BusinessOccupationDetails.businessDetails.workPlaceBuildType": {
                            "titleMap": {
                                "Concrete": "CONCRETE",
                                "MUD": "MUD",
                                "BRICK": "BRICK"
                            }
                        },
                        "BusinessOccupationDetails.businessDetails.businessPhone": {
                            title: "INCHARGE_WHEN_YOU_ARE_NOT_AVAILABLE",
                            type: "select",
                            titleMap: {
                                "Family Member": "Family Member",
                                "Employee": "Employee",
                                "Business Is Closed": "Business Is Closed"
                            },
                            schema: {
                                "type": ["string", "null"],
                            }
                        },
                        "BusinessOccupationDetails.agricultureDetails.nonIrrigated": {
                            title: "NON_IRRIGATED_LAND",
                            "type": "string",
                            inputmode: "number",
                            numberType: "tel",
                            schema: {
                                "type": ["string", "null"],
                            }
                        },
                        "BusinessOccupationDetails.agricultureDetails.irrigated": {
                            title: "IRRIGATED_LAND",
                            "type": "string",
                            inputmode: "number",
                            numberType: "tel",
                            schema: {
                                "type": ["string", "null"],
                            }
                        },
                        "BusinessOccupationDetails.agricultureDetails.harvestMonth": {
                            title: "TOTAL_LAND",
                            inputmode: "number",
                            numberType: "tel",
                            "type": "string",
                            schema: {
                                "type": ["string", "null"],
                            }
                        },
                        "BusinessOccupationDetails.agricultureDetails.landOwnership": {
                            titleMap: {
                                "Self": "Self",
                                "Others": "Others",
                            }
                        },
                        "HouseVerification.houseDetailsFieldSet.HouseOwnership": {
                            required: true,
                            enumCode: "house_ownership",
                        },
                        "FamilyDetails.familyMembers": {
                            "title":"FAMILY_DETAILS"
                        },
                        "FamilyDetails.familyMembers.familyMemberFirstName": {
                            schema: {
                                pattern: "^[a-zA-Z\. ]+$",
                                type: ["string", "null"],
                            },
                            validationMessage: {
                                202: "Only alphabets and space are allowed."
                            },
                        },
                        "HouseVerification.houseDetailsFieldSet.buildType": {
                            required: true,
                        },
                        "HouseVerification.houseDetailsFieldSet.landLordName": {
                            key:"customer.verifications.drinkingWater",
                            title: "DRINKING_WATER",
                            required: true,
                            "type": "select",
                            "titleMap": {
                                "Public/Shared": "Public/Shared",
                                "Own": "Own",
                                "NA": "NA"
                            }
                        },
                        "HouseVerification.houseDetailsFieldSet.HouseVerification": {
                            key:"customer.verifications.waterFilter",
                            title: "WATER_FILTER",
                            required: true,
                            "type": "select",
                            "titleMap": {
                                "Yes": "Yes",
                                "No": "No",
                            }
                        },
                        "HouseVerification.houseDetailsFieldSet.durationOfStay": {
                            key:"customer.verifications.toiletFacility",
                            title: "TYPE_OF_TOILET_FAMILY_USE",
                            required: true,
                            "type": "select",
                            order: 100,
                            "titleMap": {
                                "Own toilet": "Own toilet",
                                "Shared/public": "Shared/public",
                                "None/open space": "None/open space",
                            },
                            schema: {
                                "type": ["string", "null"],
                            }
                        },
                        "HouseVerification.houseDetailsFieldSet.diaryAnimals":{
                            inputmode: "number",
                            numberType: "tel"
                        },
                        "FamilyDetails.familyMembers.customerId": {
                            key: "customer.familyMembers[].customerId",
                            orderNo: 20,
                            condition: "model.customer.familyMembers[arrayIndex].relationShip !== 'self'",
                            type: "lov",
                            "inputMap": {
                                "firstName": {
                                    "key": "customer.firstName",
                                    "title": "CUSTOMER_NAME"
                                },
                                "branchName": {
                                    "key": "customer.kgfsName",
                                    "type": "select"
                                }
                            },
                            "outputMap": {
                                "id": "customer.familyMembers[arrayIndex].customerId",
                                "firstName": "customer.familyMembers[arrayIndex].familyMemberFirstName"
                            },
                            "searchHelper": formHelper,
                            "search": function (inputModel, form) {
                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var promise = Enrollment.search({
                                    'branchName': inputModel.branchName || SessionStore.getBranch(),
                                    'firstName': inputModel.firstName,
                                }).$promise;
                                return promise;
                            },
                            onSelect: function (valueObj, model, context) {
                                var rowIndex = context.arrayIndex;
                                PageHelper.showLoader();
                                Enrollment.getCustomerById({
                                    id: valueObj.id
                                }, function (resp, header) {

                                    model.customer.familyMembers[rowIndex].gender = resp.gender;
                                    model.customer.familyMembers[rowIndex].dateOfBirth = resp.dateOfBirth;
                                    model.customer.familyMembers[rowIndex].maritalStatus = resp.maritalStatus;
                                    model.customer.familyMembers[rowIndex].age = moment().diff(moment(resp.dateOfBirth), 'years');
                                    model.customer.familyMembers[rowIndex].mobilePhone = resp.mobilePhone;
                                    model.customer.familyMembers[rowIndex].relationShip = "";

                                    var selfIndex = _.findIndex(resp.familyMembers, function (o) {
                                        return o.relationShip.toUpperCase() == 'SELF'
                                    });

                                    if (selfIndex != -1) {
                                        model.customer.familyMembers[rowIndex].healthStatus = resp.familyMembers[selfIndex].healthStatus;
                                        model.customer.familyMembers[rowIndex].educationStatus = resp.familyMembers[selfIndex].educationStatus;
                                    }
                                    PageHelper.hideLoader();
                                    irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                                }, function (resp) {
                                    PageHelper.hideLoader();
                                    irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);

                                });

                            },
                            getListDisplayItem: function (data, index) {
                                return [
                                    [data.firstName, data.fatherFirstName].join(' '),
                                    data.id
                                ];
                            }
                        },
                        "FamilyDetails.familyMembers.familyMemberFirstName":{
                            orderNo:10,
                            title:"FAMILY_MEMBER_NAME"
                        },                       
                        "IndividualFinancials":{
                            "title":"HOUSEHOLD_EXPENSES"
                        },
                        "IndividualFinancials.expenditures":{
                            "title":"ADD_HOUSEHOLD_EXPENSES"
                        },                        
                        "IndividualFinancials.expenditures.expenditureSource":{
                            "required":true,
                            "orderNo":10
                        },                        
                        "IndividualFinancials.expenditures.frequency":{
                            "required":true,
                            "orderNo":20
                        },                        
                        "IndividualFinancials.expenditures.annualExpenses":{
                            "required":true,
                            "orderNo":30
                        }
                }
            }
            var getIncludes = function (model) {            

                return [
                "IndividualInformation",
                "IndividualInformation.customerBranchId",
                "IndividualInformation.customerId",
                "IndividualInformation.title",
                "IndividualInformation.urnNo",
                "IndividualInformation.firstName",
                "IndividualInformation.photoImageId",
                "IndividualInformation.existingLoan",
                "IndividualInformation.gender",
                "IndividualInformation.dateOfBirth",
                "IndividualInformation.religion",
                "IndividualInformation.language",
                "IndividualInformation.maritalStatus",
                "IndividualInformation.fatherFirstName",
                "IndividualInformation.motherName",
                "IndividualInformation.spouseFirstName",
                "IndividualInformation.spouseDateOfBirth",
                "IndividualInformation.spouseAadharNumber",
                
                "KYC",
                "KYC.customerId",
                "KYC.identityProofFieldSet",
                "KYC.identityProof",
                "KYC.identityProofImageId",
                "KYC.identityProofNo",
                "KYC.addressProofFieldSet",
                "KYC.addressProof",
                "KYC.addressProofImageId",
                "KYC.addressProofIssueDate",
                "KYC.addressProofValidUptoDate",
                "KYC.addressProofNo",
                "KYC.additionalKYCs",
                "KYC.additionalKYCs.kyc1ProofType",
                "KYC.additionalKYCs.kyc1ProofNumber",
                "KYC.additionalKYCs.kyc1ImagePath",
                "KYC.additionalKYCs.kyc1IssueDate",
                "KYC.additionalKYCs.kyc1ValidUptoDate",
               
                "ContactInformation",
                "ContactInformation.residentialAddressFieldSet",
                "ContactInformation.doorNo",
                "ContactInformation.street",
                "ContactInformation.locality",
                "ContactInformation.villageName",
                "ContactInformation.postOffice",
                "ContactInformation.district",
                "ContactInformation.landmark",
                "ContactInformation.pincode",
                "ContactInformation.state",
                "ContactInformation.landLineNo",
                "ContactInformation.mobilePhone",
                "ContactInformation.email",
                "ContactInformation.residentialAddressAlsoBusinessAddress",
                "ContactInformation.mailSameAsResidence",
                "ContactInformation.permanentAddressFieldSet",
                "ContactInformation.mailingDoorNo",
                "ContactInformation.mailingStreet",
                "ContactInformation.mailingLocality",
                "ContactInformation.mailingPostoffice",
                "ContactInformation.mailingDistrict",
                "ContactInformation.mailingPincode",
                "ContactInformation.mailingState",
                
                "loanInformation",
                "loanInformation.requestedLoanAmount",
                "loanInformation.requestedLoanPurpose",
                
                "FamilyDetails",
                "FamilyDetails.familyMembers",
                "FamilyDetails.familyMembers.familyMemberFirstName",
                "FamilyDetails.familyMembers.relationShip",
                "FamilyDetails.familyMembers.memberIncome",
                "FamilyDetails.familyMembers.occupation",
                "FamilyDetails.familyMembers.educationLevel",
                "FamilyDetails.familyMembers.incomeDetails",
                
                "IndividualFinancials",
                "IndividualFinancials.expenditures",
                "IndividualFinancials.expenditures.expenditureSource",
                "IndividualFinancials.expenditures.frequency",
                "IndividualFinancials.expenditures.annualExpenses",
                
                "IndividualReferences",
                "IndividualReferences.verifications",
                "IndividualReferences.verifications.referenceFirstName",
                "IndividualReferences.verifications.relationship",
                "IndividualReferences.verifications.mobileNo",
                "IndividualReferences.verifications.address"
                ];
            }

            function getLoanCustomerRelation(pageClass){
                switch (pageClass){
                    case 'applicant':
                        return 'Applicant';
                        break;
                    case 'co-applicant':
                        return 'Co-Applicant';
                        break;
                    case 'guarantor':
                        return 'Guarantor';
                        break;
                    default:
                        return null;
                }
            }

            return {
                "type": "schema-form",
                "title": "INDIVIDUAL_ENROLLMENT_2",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    };
                    model.UIUDF = {
                        'family_fields': {}
                    };

                    /* Setting data recieved from Bundle */
                    model.loanCustomerRelationType =getLoanCustomerRelation(bundlePageObj.pageClass);
                    model.pageClass = bundlePageObj.pageClass;
                    model.currentStage = bundleModel.currentStage;
                    model.enrolmentProcess.currentStage =  model.currentStage;
                    /* End of setting data recieved from Bundle */

                    /* Setting data for the form */
                    model.customer = model.enrolmentProcess.customer;
                    var branchId = SessionStore.getBranchId();
                    if(branchId && !model.customer.customerBranchId)
                        {
                            model.customer.customerBranchId = branchId;
                    };

                    /* End of setting data for the form */
                    model.UIUDF.family_fields.dependent_family_member = 0;
                     _.each(model.customer.familyMembers, function(member) {
                        if (member.incomes && member.incomes.length == 0)
                            model.UIUDF.family_fields.dependent_family_member++;
                    });

                    if(model.customer.fcuStatus == 1){
                        model.customer.fcuStatu = true  
                    }
                    else{
                        model.customer.fcuStatu = false
                    }

                    /* Form rendering starts */
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [
                            "KYC.addressProofSameAsIdProof",
                        ],
                        "options": {
                            "repositoryAdditions": {
                                "IndividualInformation":{
                                    "items": {
                                        "area": {
                                            orderNo: 50,
                                            key: "customer.area",
                                            "title": "LOCALITY1",
                                            "type": "select",
                                            "titleMap": {
                                                "Rural": "Rural",
                                                "Urban": "Urban"
                                            }
                                        },
                                        "spouseAadharNumber":{
                                            "key":"customer.aadhaarNo",
                                            "title": "SPOUSE_AADHAR_NUMBER",
                                            condition: "model.customer.maritalStatus==='MARRIED'",
                                            "type": "string",
                                        }
                                    }
                                },
                                "ContactInformation":{
                                    "title":"CONTACT_DETAILS",
                                    "items": {
                                        "stdCode":{
                                            orderNo: 145,
                                            key: "customer.stdCode",
                                            title:"STD_CODE"
                                        },
                                        "contactDetailsAlsoBusinessContactDetails":{
                                            title:"CONTACT_DETAILS_ALSO_BUSINESS_CONTACT_DETAILS",
                                            type:"checkbox",
                                            orderNo:50,
                                            "schema":{  
                                               "default":false
                                            }
                                        },
                                        "residentialAddressAlsoBusinessAddress":{
                                            "key":"customer.fcuStatu",
                                            title:"RESIDENTIAL_ADDRESS_ALSO_BUSINESS_ADDRESS",
                                            type:"checkbox",
                                            orderNo:149,
                                            "schema":{  
                                               "default":false
                                            }
                                        }
                                    }
                                },
                                "KYC":{
                                        "items":{
                                            "addressProofSameAsIdProof": {
                                                orderNo: 80,
                                                key: "customer.addressProofSameAsIdProof",
                                                title:"ADDRESS_PROOF_SAME_AS_ID",
                                                condition: "model.customer.identityProof != 'Pan Card'"
                                            }
                                        }
                                },
                                "FamilyDetails":{
                                    "items":{
                                        "familyMembers":{
                                            "items":{
                                                "memberIncome":{
                                                    "key": "customer.familyMembers[].salary",
                                                    "title": "MEMBER_INCOME",
                                                    "type":"amount"
                                                },
                                                "occupation":{
                                                    "key": "customer.familyMembers[].udfId1",
                                                    "title":"OCCUPATION",
                                                    "type":"string"
                                                },
                                                "educationLevel":{
                                                    "key": "customer.familyMembers[].educationStatus",
                                                    "title":"EDUCATION_LEVEL",
                                                    "type":"string"
                                                },
                                                "incomeDetails":{
                                                    "key": "customer.familyMembers[].udfId2",
                                                    "title":"INCOME_DETAILS",
                                                    "type":"string",

                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            "additions": [
                                {
                                    "type": "actionbox",
                                    "condition": "!model.customer.currentStage",
                                    "orderNo": 1000,
                                    "items": [
                                        {
                                            "type": "submit",
                                            "title": "SUBMIT"
                                        }
                                    ]
                                },
                                {
                                    "type": "actionbox",
                                    "condition": "model.customer.currentStage && (model.currentStage=='Screening' || model.currentStage=='Appraisal' || model.currentStage=='Application' || model.currentStage=='CreditAppraisal' || (model.currentStage=='GuarantorAddition' && model.pageClass=='guarantor'))",
                                    "orderNo": 1200,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "UPDATE",
                                            "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                        }
                                    ]
                                }
                            ]
                        }
                    };
                    UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function(repo){
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form){
                            self.form = form;
                        });

                    /* Form rendering ends */
                },

                preDestroy: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // console.log("Inside preDestroy");
                    // console.log(arguments);
                    if (bundlePageObj) {
                        var enrolmentDetails = {
                            'customerId': model.customer.id,
                            'customerClass': bundlePageObj.pageClass,
                            'firstName': model.customer.firstName
                        }
                        // BundleManager.pushEvent('new-enrolment',  {customer: model.customer})
                        BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails);
                        model.loanProcess.removeRelatedEnrolmentProcess(model.enrolmentProcess, model.loanCustomerRelationType);
                    }
                    return $q.resolve();
                },
                eventListeners: {
                    "lead-loaded": function (bundleModel, model, obj) {
              
                        return $q.when()
                            .then(function(){
                                if (obj.applicantCustomerId){
                                    return EnrolmentProcess.fromCustomerID(obj.applicantCustomerId).toPromise();
                                } else {
                                    return null;
                                }
                            })
                            .then(function(enrolmentProcess){
                                if (enrolmentProcess!=null){
                                    model.enrolmentProcess = enrolmentProcess;
                                    model.customer = enrolmentProcess.customer;
                                    model.loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, model.loanCustomerRelationType);
                                    BundleManager.pushEvent(model.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                                }
                                if(obj.leadCategory == 'Existing' || obj.leadCategory == 'Return') {
                                    model.customer.existingLoan = 'YES';
                                } else {
                                    model.customer.existingLoan = 'NO';
                                }
                                model.customer.mobilePhone = obj.mobileNo;
                                model.customer.gender = obj.gender;
                                model.customer.firstName = obj.leadName;
                                model.customer.maritalStatus = obj.maritalStatus;
                                model.customer.customerBranchId = obj.branchId;
                                model.customer.centreId = obj.centreId;
                                model.customer.centreName = obj.centreName;
                                model.customer.street = obj.addressLine2;
                                model.customer.doorNo = obj.addressLine1;
                                model.customer.pincode = obj.pincode;
                                model.customer.district = obj.district;
                                model.customer.state = obj.state;
                                model.customer.locality = obj.area;
                                model.customer.villageName = obj.cityTownVillage;
                                model.customer.landLineNo = obj.alternateMobileNo;
                                model.customer.dateOfBirth = obj.dob;
                                model.customer.age = moment().diff(moment(obj.dob, SessionStore.getSystemDateFormat()), 'years');
                                model.customer.gender = obj.gender;
                                model.customer.referredBy = obj.referredBy;
                                model.customer.landLineNo = obj.alternateMobileNo;
                                model.customer.landmark = obj.landmark;
                                model.customer.postOffice = obj.postOffice;

                                for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                    // $log.info(model.customer.familyMembers[i].relationShip);
                                    // model.customer.familyMembers[i].educationStatus = obj.educationStatus;
                                    if (model.customer.familyMembers[i].relationShip.toUpperCase() == "SELF") {
                                        model.customer.familyMembers[i].educationStatus=obj.educationStatus;
                                     }
                                }
                            })








                    },
                    "origination-stage": function (bundleModel, model, obj) {
                        model.currentStage = obj
                    }
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
                    save: function (model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }

                        // $q.all start
                        model.enrolmentProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                formHelper.resetFormValidityState(formCtrl);
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Customer Saved.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent()
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });
                    },
                    proceed: function(model, form, formName){
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.enrolmentProcess.proceed()
                            .finally(function () {
                                console.log("Inside hideLoader call");
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (enrolmentProcess) {
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer});

                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
                            });
                    },
                    submit: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.enrolmentProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (enrolmentProcess) {
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                                BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer});

                                model.enrolmentProcess.proceed()
                                .subscribe(function(enrolmentProcess) {
                                    PageHelper.showProgress('enrolment', 'Done.', 5000);
                                }, function(err) {
                                    PageHelper.showErrors(err);
                                    PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                })
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);                                
                                PageHelper.hideLoader();
                            });
                    }
                }
            };
        }
    }
})
