define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    return {
        pageUID: "kgfs.customer.IndividualEnrolment2",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository", "irfProgressMessage"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository,irfProgressMessage) {

            var self;
            AngularResourceService.getInstance().setInjector($injector);
            var branch = SessionStore.getBranch();
            var pageParams = {
                readonly: true
            };
            var configFile = function () {
                
                
                return {
            }
        }

        var getIncludes = function(model) {
            return [
                "IndividualInformation",
                "IndividualInformation.customerBranchId",
                "IndividualInformation.customerId",
                "IndividualInformation.title",
                "IndividualInformation.urnNo",
                "IndividualInformation.firstName",
                "IndividualInformation.photoImageId",
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
                "ContactInformation.mailSameAsResidence",
                "ContactInformation.permanentAddressFieldSet",
                "ContactInformation.mailingDoorNo",
                "ContactInformation.mailingStreet",
                "ContactInformation.mailinglandmark",
                "ContactInformation.mailingLocality",
                "ContactInformation.mailingVillageName",
                "ContactInformation.mailingPostoffice",
                "ContactInformation.mailingDistrict",
                "ContactInformation.mailingPincode",
                "ContactInformation.mailingState",
                "loanInformation",
                "loanInformation.requestedLoanAmount",
                "loanInformation.requestedLoanPurpose",
                "actionbox",
                "actionbox.submit",
                "actionbox.save",
                "FamilyDetails",
                "FamilyDetails.familyMembers",
                "FamilyDetails.familyMembers.familyMemberFirstName",
                "FamilyDetails.familyMembers.relationShip",
                "FamilyDetails.familyMembers.memberIncome",
                "HouseHoldExpenses",
                "HouseHoldExpenses.ExpenseDetails",
                "HouseHoldExpenses.ExpenseDetails.expenseType",
                "HouseHoldExpenses.ExpenseDetails.frequency",
                "HouseHoldExpenses.ExpenseDetails.amount",
                "IndividualReferences",
                "IndividualReferences.verifications",
                "IndividualReferences.verifications.referenceFirstName",
                "IndividualReferences.verifications.relationship",
                "IndividualReferences.verifications.mobileNo",
                "IndividualReferences.verifications.address"
            ];
        } 
            var getOverrides = function(model) {
                    return {
                        "IndividualReferences.verifications.referenceFirstName":{
                            orderNo:10,
                            title:"NAME",
                            required:true,
                            type:"string"
                        },
                        "IndividualReferences.verifications.relationship":{
                            orderNo:20,
                            title:"RELATION",
                            required:true,
                            type:"string"
                        },
                        "IndividualReferences.verifications.mobileNo":{
                            orderNo:30,
                            title:"PHONE_NUMBER",
                            required:true,
                            type:"string"
                        },
                        "IndividualReferences.verifications.address":{
                            required:true
                        },
                        "IndividualFinancials.expenditures.expenditureSource":{
                            "title": "EXPENDITURE_SOURCE",
                            required:true
                        },
                        "HouseVerification.houseDetailsFieldSet":{
                            orderNo:70
                        },
                        "IndividualFinancials.expenditures":{
                            view: "fixed",
                            titleExpr: "model.customer.expenditures[arrayIndex].expenditureSource | translate"
                        },
                        "FamilyDetails": {
                            "condition" : "model.customer.currentStage == 'Stage02' || model.customer.currentStage == 'Completed'"
                        },
                        "HouseVerification":{
                            "condition" : "model.customer.currentStage == 'Stage02' || model.customer.currentStage == 'Completed'"
                        },
                        "Liabilities":{
                            orderNo: 110,
                            "condition" : "model.customer.currentStage == 'Stage02' || model.customer.currentStage == 'Completed'"
                        },
                        "PhysicalAssets":{
                            "orderNo": 90,
                            "title" :"T_ASSETS",
                            "condition" : "model.customer.currentStage == 'Stage02' || model.customer.currentStage == 'Completed'"
                        },                      
                        "IndividualFinancials":{
                            orderNo: 60,
                            "title": "EXPENDITURES",
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
                            orderNo: 20
                        },
                        "IndividualInformation.urnNo" : {
                            orderNo: 30
                        },
                        "IndividualInformation.photoImageId":{
                            "orderNo": 40,
                           "viewParams": function(modelValue, form, model) {
                               return {
                                   customerId: model.customer.id
                               };
                           },
                           "required": true,
                           "readonly": true
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
                            "type": "string",
                            "schema": {
                                "pattern": "^[a-zA-Z\. ]+$",
                            },
                            "validationMessage": {
                                202: "Only alphabets and space are allowed."
                            },
                            "required": false
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
    
                                Enrollment.getCustomerById({id: valueObj.id})
                                    .$promise
                                    .then(function(res){
                                        PageHelper.showProgress("customer-load", "Done..", 5000);
                                        model.customer = Utils.removeNulls(res, true);
                                        model.customer.identityProof = "Pan Card";
                                        model.customer.addressProof= "Aadhar Card";
                                        BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                                    }, function(httpRes){
                                        PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
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
                            "required": true
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
                            title:"LOCALITY"
                        },
                        "ContactInformation.permanentAddressFieldSet": {
                            condition: "!model.customer.mailSameAsResidence"
                        },
                        "ContactInformation.mailingDoorNo":{
                            title:"DOOR/BULIDING",
                            condition: "!model.customer.mailSameAsResidence"
                        },
                        "ContactInformation.mailingStreet":{
                            condition: "!model.customer.mailSameAsResidence"
                        },
                        "ContactInformation.mailingLocality":{
                            title:"LOCALITY",
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
                        "Liabilities.liabilities":{
                            "title" :"FINANCIAL_LIABILITIES"
                        },
                        "PhysicalAssets.physicalAssets.ownedAssetValue":{
                            "title" :"OWNED_ASSET_VALUE"
                        },
                        "FamilyDetails.familyMembers.maritalStatus":{
                            orderNo: 80,
                            condition: "model.customer.familyMembers[arrayIndex].relationShip != 'self'"
                        },
                        "FamilyDetails.familyMembers.educationStatus":{
                            orderNo: 70,
                        },
                        "FamilyDetails.familyMembers.incomes.incomeSource":{
                            title:"OCCUPATION"
                        },
                        "FamilyDetails.familyMembers.incomes.incomeEarned":{
                            title:"CASH_INFLOW",
                            type: "amount",
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
                            onArrayAdd: function(value, form, model, formCtrl, event) {
                                if ((model.customer.familyMembers.length - 1) === 0) {
                                    model.customer.familyMembers[0].relationShip = 'self';
                                    model.customer.familyMembers[0].gender = model.customer.gender;
                                    model.customer.familyMembers[0].dateOfBirth = model.customer.dateOfBirth;
                                    model.customer.familyMembers[0].age = model.customer.age;
                                    model.customer.familyMembers[0].maritalStatus = model.customer.maritalStatus;
                                }
                            }
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
                        "FamilyDetails.familyMembers.incomes.monthsPerYear": {
                            required: true,
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
                        "PhysicalAssets.physicalAssets":{
                            titleExpr: "model.customer.physicalAssets[arrayIndex].ownedAssetDetails | translate",
                            remove:null,
                            add: null
                        },
                        "PhysicalAssets.physicalAssets.assetType":{
                            "type":"string",
                            "readonly":true
                        },
                        "PhysicalAssets.physicalAssets.ownedAssetDetails":{
                            "type":"string",
                            "readonly":true
                        },
                        "PhysicalAssets.financialAssets.instrumentType": {
                            required: false,
                        },
                        "PhysicalAssets.financialAssets.nameOfInstitution": {
                            "title":"NAME_OF_INSTITUTION",
                            required: false,
                        },
                        "PhysicalAssets.financialAssets.instituteType": {
                            required: false,
                        },
                        "PhysicalAssets.financialAssets.amount": {
                            type: "amount",
                            title:"AMOUNT",
                            required: false,
                        },
                        "PhysicalAssets.financialAssets.frequencyOfDeposite": {
                            title:"FREQUENCY_OF_DEPOSIT",
                            required: false,
                        },
                        "Liabilities.liabilities.loanType": {
                            required: false,
                        },
                        "Liabilities.liabilities.loanSource": {
                            required: false,
                        },
                        "Liabilities.liabilities.loanAmountInPaisa": {
                            required: false,
                        },
                        "Liabilities.liabilities.installmentAmountInPaisa": {
                            "type": "amount",
                            title: "INSTALLMENT_AMOUNT",
                            required: false,
                        },
                        "Liabilities.liabilities.frequencyOfInstallment": {
                            required: false,
                        },
                        "Liabilities.liabilities.liabilityLoanPurpose": {
                            "type": "select",
                            enumCode: "liability_loan_purpose",
                            required: false,
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
                        "FamilyDetails.familyMembers.relationShip":{
                            orderNo:20,
                            "title": "T_RELATIONSHIP",
                            "onChange": function (modelValue, form, model, formCtrl, event) {
                                if (model.customer.familyMembers[form.arrayIndex].relationShip == 'self') {
    
                                    for (var index = 0; index < model.customer.familyMembers.length; index++) {
                                        if(index != form.arrayIndex && model.customer.familyMembers[index].relationShip == 'self'){
                                            model.customer.familyMembers[form.arrayIndex].relationShip = undefined;
                                            Utils.alert("self relationship is already selected");
                                            return;
                                        }
                                    }
                                }
                                if (model.customer.familyMembers[form.arrayIndex].relationShip == 'self') {
                                    model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender;
                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.dateOfBirth;
                                    model.customer.familyMembers[form.arrayIndex].age = model.customer.age;
                                    model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                    model.customer.familyMembers[form.arrayIndex].mobilePhone = model.customer.mobilePhone;
                                }
                                else {
                                    if (model.customer.familyMembers[form.arrayIndex].customerId)
                                        return;
    
                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = undefined;
                                    model.customer.familyMembers[form.arrayIndex].age = undefined;
                                    model.customer.familyMembers[form.arrayIndex].maritalStatus = undefined;
                                    model.customer.familyMembers[form.arrayIndex].gender = undefined;
                                    model.customer.familyMembers[form.arrayIndex].mobilePhone = undefined;
                                    if (model.customer.familyMembers[form.arrayIndex].relationShip == 'Father' || model.customer.familyMembers[form.arrayIndex].relationShip == 'Father-In-Law') {
                                        model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.fatherFirstName;
                                    }
                                    else if (model.customer.familyMembers[form.arrayIndex].relationShip == "Husband" || model.customer.familyMembers[form.arrayIndex].relationShip == "Wife") {
                                        model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.spouseFirstName;
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.spouseDateOfBirth;
                                        model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.spouseDateOfBirth), 'years');
                                    }
                                    else {
                                        model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = undefined;
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = undefined;
                                        model.customer.familyMembers[form.arrayIndex].age = undefined;
                                    }
                                }
                            }
                        },
                        "FamilyDetails.familyMembers.age": {
                            "onChange": function (modelValue, form, model, formCtrl, event) {
                            if (model.customer.familyMembers[form.arrayIndex].age > 0) {
                                if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-') + moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                } else {
                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-MM-DD');
                                }
                            }
                        }
                        },
                        "FamilyDetails.familyMembers.dateOfBirth": {
                            "onChange": function (modelValue, form, model, formCtrl, event) {
                                if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                    model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            }
                        },
                        "FamilyDetails.familyMembers.age_readonly": {
                            "onChange": function (modelValue, form, model, formCtrl, event) {
                                if (model.customer.familyMembers[form.arrayIndex].age > 0) {
                                    if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-') + moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                    } else {
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-MM-DD');
                                    }
                                }
                            }
                        },
                        "FamilyDetails.familyMembers.dateOfBirth_readonly": {
                            "onChange": function (modelValue, form, model, formCtrl, event) {
                                if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                    model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            }
                        }

                    }            
            }
            

                var populatePhysicalAssets = function (model) {
                    if (!model.customer.physicalAssets || model.customer.physicalAssets.length == 0) {
                        PageHelper.showLoader();
                        var physicalAssets=[];
                        Queries.getPhysicalAssetsList().then(function(res){
                            $log.info(res);
                            if(res && res.length && res.length>0){
                                for(i in res){
                                    var obj={};
                                    obj.assetType= res[i].asset;
                                    obj.ownedAssetDetails=res[i].asset_details;
                                    obj.numberOfOwnedAsset=1;
                                    physicalAssets.push(obj);   
                                }
                              model.customer.physicalAssets=physicalAssets;
                            }
                            PageHelper.hideLoader();
                        },function(err){
                            $log.info(err);
                            PageHelper.hideLoader();
                        });
                    }
                }
            return {
                "type": "schema-form",
                "title": "INDIVIDUAL_ENROLLMENT_3",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    model.siteCode = SessionStore.getGlobalSetting('siteCode');
                    if($stateParams.pageId) {
                        var customerId = $stateParams.pageId;
                        EnrolmentProcess.fromCustomerID(customerId)
                            .subscribe(function(resp){
                                model.EnrolmentProcess = resp;
                                model.customer = resp.customer;
                                if (_.hasIn($stateParams.pageData, 'currentStage') && $stateParams.pageData.currentStage != model.customer.currentStage) {
                                    irfProgressMessage.pop("enrollment", "Customer data is in different stage", 5000);
                                    $state.go("Page.Engine", {
                                        pageName: "CustomerSearch",
                                        pageId: null
                                    });
                                }
                                if (model.customer.age > 0) {
                                    if (model.customer.dateOfBirth) {
                                        model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-') + moment(model.customer.dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                    } else {
                                        model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-MM-DD');
                                    }
                                }
                                if (model.customer.dateOfBirth) {
                                    model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
            
                                for (var idx = 0; idx < model.customer.familyMembers.length; idx++) {
                                    if (model.customer.familyMembers[idx].dateOfBirth) {
                                        model.customer.familyMembers[idx].age = moment().diff(moment(model.customer.familyMembers[idx].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                    }
                                }
                                if (model.customer.udf && model.customer.udf.userDefinedFieldValues &&
                                    model.customer.udf.userDefinedFieldValues.udf1) {
                                    model.customer.udf.userDefinedFieldValues.udf1 =
                                        model.customer.udf.userDefinedFieldValues.udf1 === true ||
                                        model.customer.udf.userDefinedFieldValues.udf1 === 'true';
                                }
                                populatePhysicalAssets(model);
                        if (model.customer.dateOfBirth) {
                            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
    
                        for (var idx = 0; idx < model.customer.familyMembers.length; idx++) {
                            if (model.customer.familyMembers[idx].dateOfBirth) {
                                model.customer.familyMembers[idx].age = moment().diff(moment(model.customer.familyMembers[idx].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                            }
                        }
                        if (model.customer.udf && model.customer.udf.userDefinedFieldValues &&
                            model.customer.udf.userDefinedFieldValues.udf1) {
                            model.customer.udf.userDefinedFieldValues.udf1 =
                                model.customer.udf.userDefinedFieldValues.udf1 === true ||
                                model.customer.udf.userDefinedFieldValues.udf1 === 'true';
                        }
    
                        if (model.customer.udf && model.customer.udf.userDefinedFieldValues && model.customer.currentStage == "Stage02") {
                                model.customer.udf.userDefinedFieldValues.udf38 = "No";
                                model.customer.udf.userDefinedFieldValues.udf39 = "No";
                                model.customer.udf.userDefinedFieldValues.udf40 = "No";
                                model.customer.udf.userDefinedFieldValues.udf5 = "Good";
                        }
                        else {
                            var customer= {
                                "udf" : {
                                "userDefinedFieldValues": {
                                    
                                }}
                            };
                            customer.udf.userDefinedFieldValues.udf38 = "No";
                            customer.udf.userDefinedFieldValues.udf39 = "No";
                            customer.udf.userDefinedFieldValues.udf40 = "No";
                            customer.udf.userDefinedFieldValues.udf5 = "Good";
                            if(model.customer.udf != null){
                                model.customer.udf.userDefinedFieldValues.udf38 = customer.udf.userDefinedFieldValues.udf38;
                                model.customer.udf.userDefinedFieldValues.udf39 = customer.udf.userDefinedFieldValues.udf39;
                                model.customer.udf.userDefinedFieldValues.udf40 = customer.udf.userDefinedFieldValues.udf40;
                            }
                            else{
                                model.customer.udf = customer.udf
                            }
                        }
                         var expenditures = formHelper.enum('expenditure').data;
                        if (expenditures && expenditures.length != 0) {
                            for (i = 0; i < expenditures.length - 1; i++) {
                                model.customer.expenditures.push({
                                    'expenditureSource': expenditures[i].name,
                                    'frequency': 'Monthly'
                                });
                            }
                        }       


                            });
                    } else {
                        EnrolmentProcess.createNewProcess()
                            .subscribe(function(repo){
                                model.EnrolmentProcess = repo;
                                model.customer = repo.customer;
  
                            });

                    }
                    model.customer = model.customer || {};
                    model.siteCode = SessionStore.getGlobalSetting('siteCode');
                    model.customer.customerBranchId = model.customer.customerBranchId || SessionStore.getCurrentBranch().branchId;
                    model.customer.date = model.customer.date || Utils.getCurrentDate();
                    model.customer.nameOfRo = model.customer.nameOfRo || SessionStore.getLoginname();
                    model = Utils.removeNulls(model, true);
                    model.customer.kgfsName = model.customer.kgfsName || SessionStore.getCurrentBranch().branchName;
                    model.customer.gender = model.customer.gender || 'FEMALE';
                    var centres = SessionStore.getCentres();
                    if (centres && centres.length > 0) {
                        model.customer.centreId = model.customer.centreId || centres[0].id;
                    }
                    var self = this;
                    var formRequest = {
                        "overrides": getOverrides(model),
                        "includes": getIncludes(model),
                        "excludes": [
                            //"KYC.addressProofSameAsIdProof",
                        ],
                        "options": {
                            "repositoryAdditions": {
                                "IndividualInformation":{
                                    "items": {
                                    "area": {
                                        orderNo: 50,
                                        key: "customer.area",
                                        "title": "Area",
                                        "type": "select",
                                        "titleMap": {
                                            "Rural": "Rural",
                                            "Urban": "Urban"
                                        }
                                    },
                                    "spouseAadharNumber":{
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
                                    "mailinglandmark":{
                                        orderNo:180,
                                        title:"LANDMARK"
                                    },
                                    "mailingVillageName":{
                                        title:"VILLAGE_NAME",
                                        orderNo:205
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
                                                "title": "FAMILY_MEMBER_INCOME",
                                                "type":"amount"
                                            }
                                        }
                                    }
                                }
                            },
                            "HouseHoldExpenses": {
                                "type": "box",
                                "title": "HOUSEHOLD_EXPENSES",
                                "orderNo": 50,
                                "items": {
                                    "ExpenseDetails": {
                                        "title":"HOUSEHOLD_EXPENSES",
                                        "type": "array",
                                        "startEmpty": true,
                                        "items": {
                                            "expenseType":{
                                                title:"EXPENSE_TYPE",
                                                type:"select",
                                                required:true
                                            },
                                            "frequency":{
                                                title:"FREQUENCY",
                                                type:"select",
                                                required:true
                                            },
                                            "amount":{
                                                title:"AMOUNT",
                                                type:"amount",
                                                required:true
                                            }
                                        }
                                    }
                                }
                            },
                            "actionbox": {
                                    "type": "actionbox",
                                    "orderNo": 140,
                                    "items": {
                                        "submit": {
                                            "type": "submit",
                                            "title": "SUBMIT"
                                        },
                                        "save": {
                                            "type": "save",
                                            "title": "OFFLINE_SAVE"
                                        }
                                    }
                                }
                            }
                        }
                    };
                    UIRepository.getEnrolmentProcessUIRepository().$promise
                    .then(function(repo){
                        return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest,configFile(), model)
                    })
                    .then(function(form){
                        self.form = form;
                    });
                },

                offline: true,
                getOfflineDisplayItem: function(item, index) {
                    return [
                        item.customer.urnNo,
                        Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                        item.customer.villageName
                    ]
                },
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
                    setProofs: function (model) {
                        model.customer.addressProofNo = model.customer.aadhaarNo;
                        model.customer.identityProofNo = model.customer.aadhaarNo;
                        model.customer.identityProof = 'Aadhar card';
                        model.customer.addressProof = 'Aadhar card';
                        model.customer.addressProofSameAsIdProof = true;
                        if (model.customer.yearOfBirth) {
                            model.customer.dateOfBirth = model.customer.yearOfBirth + '-01-01';
                        }
                    },
                    preSave: function (model, form, formName) {
                        var deferred = $q.defer();
                        if (model.customer.firstName) {
                            deferred.resolve();
                        } else {
                            PageHelper.showProgress('enrollment-save', 'Customer Name is required', 3000);
                            deferred.reject();
                        }
                        return deferred.promise;
                    },
                    reload: function (model, formCtrl, form, $event) {
                        $state.go("Page.Engine", {
                            pageName: 'customer.IndividualEnrollment3',
                            pageId: model.customer.id
                        }, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    },
                    submit: function (model, form, formName) {
                        $log.info("Inside submit()");
                        

                        var reqData = _.cloneDeep(model);


                        if (reqData.customer.id) {
                            if (!model.customer.familyMembers || model.customer.familyMembers.length < 0) {
                                irfProgressMessage.pop('enrollment-submit', 'Please add Family Details information to proceed.', 5000);
                                return false;
                            } else {
                                var selfAvailable = false;
                                for (var idx = 0; idx < model.customer.familyMembers.length; idx++) {
                                    if (model.customer.familyMembers[idx].relationShip == "self") {
                                        selfAvailable = true;
                                        break;
                                    }
                                }
                                if (!selfAvailable) {
                                    irfProgressMessage.pop('enrollment-submit', 'Self information in Family Details section is mandatory to proceed.', 5000);
                                    return false;
                                }
                            }
                            if (model.customer.maritalStatus && model.customer.maritalStatus.toUpperCase() == 'MARRIED') {
                                var spouseInfoReq = true;
                                for (var idx = 0; idx < model.customer.familyMembers.length; idx++) {
                                    if (model.customer.familyMembers[idx].relationShip == "Husband" ||
                                        model.customer.familyMembers[idx].relationShip == "Wife") {
                                        spouseInfoReq = false;
                                        break;
                                    }
                                }
        
                                if (spouseInfoReq) {
                                    irfProgressMessage.pop('enrollment-submit', 'Please add customer Spouse information in Family Details section also to proceed.', 5000);
                                    return false;
                                }
                            }
                            if(!model.customer.expenditures || model.customer.expenditures.length == 0) {
                                irfProgressMessage.pop('enrollment-submit', 'Please add expenditure details in Expenditure section to proceed.', 5000);
                                return false;
                            }
                            PageHelper.showLoader();
                            model.EnrolmentProcess.proceed()
                                .finally(function(){
                                    PageHelper.hideLoader();
                                })
                                .subscribe(function(leadProcess){
                                    PageHelper.showProgress('enrolment', 'Done.', 5000);
                                    $state.go('Page.Adhoc', {
                                        pageName: 'sambandh.customer.EnrollmentDashboard'
                                    });

                                }, function(err) {
                                    PageHelper.showErrors(err);
                                    PageHelper.hideLoader();
                                });
                        } else {
                            
                            try {
                                var liabilities = reqData['customer']['liabilities'];
                                if (liabilities && liabilities != null && typeof liabilities.length == "number" && liabilities.length > 0) {
                                    for (var i = 0; i < liabilities.length; i++) {
                                        var l = liabilities[i];
                                        l.loanAmountInPaisa = l.loanAmountInPaisa * 100;
                                        l.installmentAmountInPaisa = l.installmentAmountInPaisa * 100;
                                    }
                                }
                                var financialAssets = reqData['customer']['financialAssets'];
                                if (financialAssets && financialAssets != null && typeof financialAssets.length == "number" && financialAssets.length > 0) {
                                    for (var i = 0; i < financialAssets.length; i++) {
                                        var f = financialAssets[i];
                                        f.amountInPaisa = f.amountInPaisa * 100;
                                    }
                                }
                            } catch (e) {
                                $log.info("Error trying to change amount info.");
                            }
        
                            reqData['enrollmentAction'] = 'PROCEED';
        
                            irfProgressMessage.pop('enrollment-submit', 'Working... Please wait.', 5000);
                            reqData.customer.verified = true;
                            try {
                                if (reqData.customer.familyMembers) {
                                    for (var i = 0; i < reqData.customer.familyMembers.length; i++) {
                                        var incomes = reqData.customer.familyMembers[i].incomes;
                                        for (var j = 0; j < incomes.length; j++) {
                                            switch (incomes[i].frequency) {
                                                case 'M':
                                                    incomes[i].monthsPerYear = 12;
                                                    break;
                                                case 'Monthly':
                                                    incomes[i].monthsPerYear = 12;
                                                    break;
                                                case 'D':
                                                    incomes[i].monthsPerYear = 365;
                                                    break;
                                                case 'Daily':
                                                    incomes[i].monthsPerYear = 365;
                                                    break;
                                                case 'W':
                                                    incomes[i].monthsPerYear = 52;
                                                    break;
                                                case 'Weekly':
                                                    incomes[i].monthsPerYear = 52;
                                                    break;
                                                case 'F':
                                                    incomes[i].monthsPerYear = 26;
                                                    break;
                                                case 'Fornightly':
                                                    incomes[i].monthsPerYear = 26;
                                                    break;
                                                case 'Fortnightly':
                                                    incomes[i].monthsPerYear = 26;
                                                    break;
                                            }
                                        }
                                    }
                                }
                            } catch (err) {
                                console.error(err);
                            }
                            PageHelper.showLoader();
                        model.EnrolmentProcess.proceed()
                        .finally(function(){
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(EnrolmentProcess){
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                $state.go('Page.Adhoc', {
                                    pageName: 'sambandh.customer.EnrollmentDashboard'
                                });
                            }, function(err) {
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                        } 
                    }
                }
            };
        }
    }
})
