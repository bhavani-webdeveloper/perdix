irf.pageCollection.factory(irf.page("customer.IndividualEnrolment2"),
        ["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager",
            function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                     PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager){

                var pageParams = { 
                    readonly: true
                }

                return {
                    "type": "schema-form",
                    // "subType": "sub-navigation",
                    "title": "INDIVIDUAL_ENROLLMENT",
                    "subTitle": "",
                    initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                        // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
       
                        model.currentStage = bundleModel.currentStage;
                       
                        if (_.hasIn(model, 'loanRelation')){
                            console.log(model.loanRelation);
                            if(model.loanRelation){
                            var custId = model.loanRelation.customerId;
                                Enrollment.getCustomerById({id:custId}) 
                                        .$promise
                                        .then(function(res){
                                            model.customer = res;
                                            if (model.customer.stockMaterialManagement) {
                                                model.proxyIndicatorsHasValue = true;
                                                $log.debug('PROXY_INDICATORS already has value');
                                            }
                                        }, function(httpRes){
                                            PageHelper.showErrors(httpRes);
                                        })
                                        .finally(function(){
                                            PageHelper.hideLoader();
                                        })

                            }
                        } 
                        // else {

                            model.customer = model.customer || {};
                            if (!_.hasIn(model.customer, 'enterprise') || model.customer.enterprise==null){
                                model.customer.enterprise = {};
                            }
                            var branch1 = formHelper.enum('branch_id').data;
                            for (var i = 0; i < branch1.length; i++) {
                                if ((branch1[i].name) == SessionStore.getBranch()) {
                                 model.customer.customerBranchId = branch1[i].value;
                                }
                            }
                             var centres = SessionStore.getCentres();
                             var centreName = [];
                             for (var i = 0; i < centres.length; i++) {
                                 centreName.push(centres[i].id);
                             }
                             model.customer.centreId = centreName[0];
                            //model.branchId = SessionStore.getBranchId() + '';
                            model.customer.date = model.customer.date || Utils.getCurrentDate();
                            model.customer.nameOfRo = model.customer.nameOfRo || SessionStore.getLoginname();
                            model = Utils.removeNulls(model,true);
                            //model.customer.kgfsName = SessionStore.getBranch();
                            model.customer.identityProof = model.customer.identityProof || "Pan Card";
                            model.customer.addressProof= model.customer.addressProof || "Aadhar Card";
                            model.customer.customerType = 'Individual';
                            BundleManager.pushEvent("on-customer-load", {name: "11"})

                            if(!model.customer.expenditures){
                                model.customer.expenditures = [];
                                model.customer.expenditures.push({
                                    "expenditureSource": "expenditure",
                                    "frequency": "Monthly"
                                });
                            }


                            if(!model.customer.familyMembers){
                                model.customer.familyMembers = [
                                    {
                                        'relationShip': 'self'
                                    }
                                ]
                            }
                        // }
                        if (bundlePageObj){
                            model._bundlePageObj = _.cloneDeep(bundlePageObj);
                        }

                        if (!_.hasIn(model.customer, 'enterprise') || model.customer.enterprise==null){
                                model.customer.enterprise = {};
                            }

                        if (_.hasIn(model, 'loanRelation')){
                            console.log(model.loanRelation);
                            if(model.loanRelation){
                                if(model.loanRelation.enterpriseId)
                                {
                                    var busId = model.loanRelation.enterpriseId;
                                    Enrollment.getCustomerById({id:busId}) 
                                        .$promise
                                        .then(function(res){
                                            model.customer.enterprise = res.enterprise; 
                                        }, function(httpRes){
                                            PageHelper.showErrors(httpRes);
                                        })
                                        .finally(function(){
                                            PageHelper.hideLoader();
                                        })
                                }
                            }
                        }
                    },
                    eventListeners: {
                        "test-listener": function(bundleModel, model, obj){

                        },
                        "lead-loaded": function(bundleModel, model, obj){
                            model.customer.mobilePhone = obj.mobileNo;
                            model.customer.gender = obj.gender;
                            model.customer.firstName = obj.leadName;
                            model.customer.maritalStatus=obj.maritalStatus;
                            model.customer.customerBranchId=obj.branchId;
                            model.customer.centreId=obj.centreId;
                            model.customer.street=obj.addressLine2;
                            model.customer.doorNo=obj.addressLine1;
                            model.customer.pincode=obj.pincode;
                            model.customer.district=obj.district;
                            model.customer.state=obj.state;
                            model.customer.locality=obj.area;
                            model.customer.villageName=obj.cityTownVillage;
                            model.customer.landLineNo=obj.alternateMobileNo;
                            model.customer.dateOfBirth=obj.dob;
                            model.customer.age=obj.age;
                            model.customer.gender=obj.gender;
                            model.customer.landLineNo = obj.alternateMobileNo;


                            for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                $log.info(model.customer.familyMembers[i].relationShip);
                                model.customer.familyMembers[i].educationStatus=obj.educationStatus;
                                /*if (model.customer.familyMembers[i].relationShip == "self") {
                                    model.customer.familyMembers[i].educationStatus=obj.educationStatus;
                                    break;
                                }*/
                            }      
                        },
                        "origination-stage": function(bundleModel, model, obj){
                            model.currentStage = obj
                        }
                    },
                    offline: false,
                    getOfflineDisplayItem: function(item, index){
                        return [
                            item.customer.urnNo,
                            Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                            item.customer.villageName
                        ]
                    },
                    form: [
                        {
                            "type":"box",
                            "title":"KYC",
                            "condition": "model.currentStage=='Screening' || model.currentStage == 'Application' || model.currentStage == 'FieldAppraisal'",
                            "items":[
                                {
                                    "key": "customer.id",
                                    "title": "CUSTOMER_SEARCH",
                                    "type": "lov",
                                    "lovonly": true,
                                    "inputMap": {
                                        "firstName": {
                                            "key": "customer.firstName",
                                            "title": "CUSTOMER_NAME"
                                        },
                                        "customerBranchId": {
                                            "key": "customer.customerBranchId",
                                            "type": "select",
                                            "screenFilter": true
                                        },
                                        "centreId": {
                                            "key": "customer.centreId",
                                            "type": "select",
                                            "screenFilter": true,
                                            "parentEnumCode": "branch_id",
                                        }
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
                                            'customerType':"individual"
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
                                /*{
                                    "key": "customer.aadhaarNo",
                                    "type":"qrcode",
                                    "required": true,
                                    "onChange":"actions.setProofs(model)",
                                    "onCapture": function(result, model, form) {
                                        EnrollmentHelper.customerAadhaarOnCapture(result, model, form);
                                        this.actions.setProofs(model);
                                    }
                                },
                                {
                                    "key": "customer.panNo",
                                    "type": "text",
                                    "required": true
                                },*/
                                {
                                    type:"fieldset",
                                    title:"IDENTITY_PROOF",
                                    items:[
                                        {
                                            key:"customer.identityProof",
                                            readonly:true,
                                            //type:"select"
                                        },
                                        {
                                            key:"customer.identityProofImageId",
                                            type:"file",
                                            required: true,
                                            fileType:"application/pdf",
                                            using: "scanner"
                                        }/*,
                                        {
                                            key:"customer.identityProofReverseImageId",
                                            type:"file",
                                            fileType:"image/*"
                                        }*/,
                                        {
                                            key:"customer.identityProofNo",
                                            type:"barcode",
                                            onCapture: function(result, model, form) {
                                                $log.info(result);
                                                model.customer.identityProofNo = result.text;
                                            }
                                        },
                                        /*{
                                            key:"customer.idProofIssueDate",
                                            type:"date"
                                        },
                                        {
                                            key:"customer.idProofValidUptoDate",
                                            type:"date"
                                        },
                                        {
                                            key:"customer.addressProofSameAsIdProof"
                                        }*/
                                    ]
                                },


                                /*{
                                    type:"fieldset",
                                    title:"IDENTITY_PROOF",
                                    items:[
                                        {
                                            key:"customer.identityProof",
                                            type:"select"
                                        },
                                        {
                                            key:"customer.identityProofImageId",
                                            type:"file",
                                            required: true,
                                            fileType:"image/*"
                                        },
                                        {
                                            key:"customer.identityProofReverseImageId",
                                            type:"file",
                                            fileType:"image/*"
                                        },
                                        {
                                            key:"customer.identityProofNo",
                                            type:"barcode",
                                            onCapture: function(result, model, form) {
                                                $log.info(result);
                                                model.customer.identityProofNo = result.text;
                                            }
                                        },
                                        {
                                            key:"customer.idProofIssueDate",
                                            type:"date"
                                        },
                                        {
                                            key:"customer.idProofValidUptoDate",
                                            type:"date"
                                        },
                                        {
                                            key:"customer.addressProofSameAsIdProof"
                                        }
                                    ]
                                },*/
                                {
                                    type:"fieldset",
                                    title:"ADDRESS_PROOF",
                                    //condition:"!model.customer.addressProofSameAsIdProof",
                                    items:[
                                        {
                                            key:"customer.addressProof",
                                            readonly:true,
                                            //type:"select"
                                        },
                                        {
                                            key:"customer.addressProofImageId",
                                            type:"file",
                                            required: true,
                                            fileType:"application/pdf",
                                            using: "scanner"
                                        }/*,
                                        {
                                            key:"customer.addressProofReverseImageId",
                                            type:"file",
                                            fileType:"image/*"
                                        }*/,
                                        {
                                            key:"customer.addressProofNo",
                                            onCapture: function(result, model, form) {
                                                var aadhaarData = EnrollmentHelper.customerAadhaarOnCapture(result, model, form);
                                                model.customer.addressProofNo = aadhaarData.uid;
                                            },
                                            type:"qrcode"
                                            
                                        },
                                        /*{
                                            key:"customer.addressProofIssueDate",
                                            type:"date"
                                        },
                                        {
                                            key:"customer.addressProofValidUptoDate",
                                            type:"date"
                                        },*/
                                    ]
                                },

                                 {
                                    "key": "customer.additionalKYCs",
                                    "type": "array",
                                    "title": "ADDITIONAL_KYC",
                                    startEmpty: true,
                                    //"add": null,
                                    //"remove": null,
                                    //"view": "fixed",
                                    "items": [
                                        {
                                            
                                            key:"customer.additionalKYCs[].kyc1ProofType",
                                            type:"select",
                                            "enumCode": "identity_proof"
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1ImagePath",
                                            type:"file",
                                            fileType:"image/*"
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1ReverseImagePath",
                                             type:"file",
                                            fileType:"image/*"
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1ProofNumber",
                                            type:"barcode",
                                            onCapture: function(result, model, form) {
                                                $log.info(result);
                                                model.customer.identityProofNo = result.text;
                                            }
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1IssueDate",
                                            type:"date"
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1ValidUptoDate",
                                            type:"date"
                                        }
                                        
                                    ]
                                },
                            /*    {
                                    type:"fieldset",
                                    title:"SPOUSE_IDENTITY_PROOF",
                                    condition:"model.customer.maritalStatus==='MARRIED'",
                                    items:[
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf33",
                                            type:"select",
                                            onChange: function(modelValue) {
                                                $log.info(modelValue);
                                            }
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf34",
                                            type:"file",
                                            fileType:"image/*"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf35",
                                            type:"file",
                                            fileType:"image/*"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf36",
                                            condition: "model.customer.udf.userDefinedFieldValues.udf33 !== 'Aadhar card'",
                                            type:"barcode",
                                            onCapture: function(result, model, form) {
                                                $log.info(result); // spouse id proof
                                                model.customer.udf.userDefinedFieldValues.udf36 = result.text;
                                            }
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf36",
                                            condition: "model.customer.udf.userDefinedFieldValues.udf33 === 'Aadhar card'",
                                            type:"qrcode",
                                            onCapture: function(result, model, form) {
                                                $log.info(result); // spouse id proof
                                                var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                                                $log.info(aadhaarData);
                                                model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                                                model.customer.spouseFirstName = aadhaarData.name;
                                                if (aadhaarData.yob) {
                                                    model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                                    model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                                }
                                            }
                                        }
                                    ]
                                }*/

                            ]
                        },
                        {
                            "type":"box",
                            "title":"KYC",
                            "condition": "model.currentStage == 'ScreeningReview' || model.currentStage == 'ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                            "readonly": true,
                            "items":[
                                {
                                    "key": "customer.firstName",
                                    "title":"CUSTOMER_NAME"
                                },
                                 {
                                    type:"fieldset",
                                    title:"IDENTITY_PROOF",
                                    items:[
                                        {
                                            key:"customer.identityProof",
                                            readonly:true,
                                            //type:"select"
                                        },
                                        {
                                            key:"customer.identityProofImageId",
                                            type:"file",
                                            fileType:"application/pdf",
                                            using: "scanner"
                                        }/*,
                                        {
                                            key:"customer.identityProofReverseImageId",
                                            type:"file",
                                            fileType:"image/*"
                                        }*/,
                                        {
                                            key:"customer.identityProofNo",
                                            type:"barcode",
                                            onCapture: function(result, model, form) {
                                                $log.info(result);
                                                model.customer.identityProofNo = result.text;
                                            }
                                        },
                                        /*{
                                            key:"customer.idProofIssueDate",
                                            type:"date"
                                        },
                                        {
                                            key:"customer.idProofValidUptoDate",
                                            type:"date"
                                        },
                                        {
                                            key:"customer.addressProofSameAsIdProof"
                                        }*/
                                    ]
                                },
                                {
                                    type:"fieldset",
                                    title:"ADDRESS_PROOF",
                                    //condition:"!model.customer.addressProofSameAsIdProof",
                                    items:[
                                        {
                                            key:"customer.addressProof",
                                            readonly:true,
                                            //type:"select"
                                        },
                                        {
                                            key:"customer.addressProofImageId",
                                            type:"file",
                                            fileType:"application/pdf",
                                            using: "scanner"
                                        }/*,
                                        {
                                            key:"customer.addressProofReverseImageId",
                                            type:"file",
                                            fileType:"image/*"
                                        }*/,
                                        {
                                            key:"customer.addressProofNo",
                                            type:"barcode",
                                            onCapture: function(result, model, form) {
                                                $log.info(result);
                                                model.customer.addressProofNo = result.text;
                                            }
                                        },
                                        /*{
                                            key:"customer.addressProofIssueDate",
                                            type:"date"
                                        },
                                        {
                                            key:"customer.addressProofValidUptoDate",
                                            type:"date"
                                        },*/
                                    ]
                                },

                                 {
                                    "key": "customer.additionalKYCs",
                                    "type": "array",
                                    "title": "ADDITIONAL_KYC",
                                    startEmpty: true,
                                    //"add": null,
                                    //"remove": null,
                                    //"view": "fixed",
                                    "items": [
                                        {
                                            
                                            key:"customer.additionalKYCs[].kyc1ProofType",
                                            type:"select",
                                            "enumCode": "identity_proof"
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1ImagePath",
                                            type:"file",
                                            fileType:"image/*"
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1ReverseImagePath",
                                             type:"file",
                                            fileType:"image/*"
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1ProofNumber",
                                            type:"barcode",
                                            onCapture: function(result, model, form) {
                                                $log.info(result);
                                                model.customer.identityProofNo = result.text;
                                            }
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1IssueDate",
                                            type:"date"
                                        },
                                        {
                                            key:"customer.additionalKYCs[].kyc1ValidUptoDate",
                                            type:"date"
                                        }
                                        
                                    ]
                                },
                               /* {
                                    type:"fieldset",
                                    title:"SPOUSE_IDENTITY_PROOF",
                                    condition:"model.customer.maritalStatus==='MARRIED'",
                                    items:[
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf33",
                                            type:"select",
                                            onChange: function(modelValue) {
                                                $log.info(modelValue);
                                            }
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf34",
                                            type:"file",
                                            fileType:"image/*"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf35",
                                            type:"file",
                                            fileType:"image/*"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf36",
                                            condition: "model.customer.udf.userDefinedFieldValues.udf33 !== 'Aadhar card'",
                                            type:"barcode",
                                            onCapture: function(result, model, form) {
                                                $log.info(result); // spouse id proof
                                                model.customer.udf.userDefinedFieldValues.udf36 = result.text;
                                            }
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf36",
                                            condition: "model.customer.udf.userDefinedFieldValues.udf33 === 'Aadhar card'",
                                            type:"qrcode",
                                            onCapture: function(result, model, form) {
                                                $log.info(result); // spouse id proof
                                                var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                                                $log.info(aadhaarData);
                                                model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                                                model.customer.spouseFirstName = aadhaarData.name;
                                                if (aadhaarData.yob) {
                                                    model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                                    model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                                }
                                            }
                                        }
                                    ]
                                }*/

                            ]
                        },
                        {
                            "type": "box",
                            "title": "PERSONAL_INFORMATION",
                            "condition": "model.currentStage=='Screening' || model.currentStage == 'Application' || model.currentStage=='FieldAppraisal'",
                            "items": [
                                {
                                    key: "customer.customerBranchId",
                                    title:"BRANCH_NAME",
                                    readonly:true,
                                    type: "select"
                                },
                                {
                                    key:"customer.centreId",
                                    type:"select",
                                    title:"CENTRE_NAME",
                                    /*filter: {
                                     "parentCode": "branch_id"
                                     },*/
                                    parentEnumCode:"branch_id",
                                    parentValueExpr:"model.customer.customerBranchId",
                                },
                                {
                                    key: "customer.oldCustomerId",
                                    title:"CUSTOMER_ID",
                                    titleExpr:"('CUSTOMER_ID'|translate)+' (Artoo)'",
                                    condition: "model.customer.oldCustomerId",
                                    readonly: true
                                },
                                {
                                    key: "customer.id",
                                    condition: "model.customer.id",
                                    title:"CUSTOMER_ID",
                                    readonly: true
                                },
                                {
                                    key: "customer.urnNo",
                                    condition: "model.customer.urnNo",
                                    title:"URN_NO",
                                    readonly: true
                                },
                                {
                                    key:"customer.photoImageId",
                                    type:"file",
                                    fileType:"image/*"
                                },
                                {
                                    "key": "customer.existingLoan",
                                    "title": "EXISTING_LOAN",
                                    "type": "radios",
                                    required:true,
                                    enumCode:"decisionmaker",
                                    condition:"model._bundlePageObj.pageClass=='applicant'"
                                },
                                {
                                    "key": "customer.title",
                                    "title": "TITLE",
                                    "type": "select",
                                    "enumCode": "title"
                                },
                                {
                                    key: "customer.firstName",
                                    title:"FULL_NAME",
                                    type:"string"
                                },
                                {
                                    key:"customer.enrolledAs",
                                    type:"radios"

                                },
                                {
                                    key:"customer.gender",
                                    type:"radios"
                                },
                                {
                                    key:"customer.dateOfBirth",
                                    required:true,
                                    type:"date",
                                    "onChange": function(modelValue, form, model) {
                                        if (model.customer.dateOfBirth) {
                                            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                        }
                                    }
                                },
                                // {
                                //     key:"customer.age",
                                //     title: "AGE",
                                //     //required:true,
                                //     type:"number",
                                //     "onChange": function(modelValue, form, model) {
                                //         if (model.customer.age > 0) {
                                //             if (model.customer.dateOfBirth) {
                                //                 model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-') + moment(model.customer.dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                //             } else {
                                //                 model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-MM-DD');
                                //             }
                                //         }
                                //     }
                                // },
                                {
                                    key:"customer.religion",
                                    type:"select"
                                },
                                {
                                    key: "customer.language",
                                    title: "PREFERRED_LANGUAGE",
                                    type: "select",
                                    enumCode: "language"
                                },
                                {
                                    key: "customer.fatherFirstName",
                                    title: "FATHER_FULL_NAME"
                                },
                                {
                                    key: "customer.motherName",
                                    title: "MOTHER_NAME"
                                },
                                {
                                    key:"customer.maritalStatus",
                                    required:true,
                                    type:"select"
                                },
                                {
                                    key: "customer.spouseFirstName",
                                    title: "SPOUSE_FULL_NAME",
                                    condition:"model.customer.maritalStatus==='MARRIED'",
                                    type:"qrcode",
                                    onCapture: function(result, model, form) {
                                        $log.info(result); // spouse id proof
                                        var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
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
                                {
                                    key:"customer.spouseDateOfBirth",
                                    type:"date",
                                    condition:"model.customer.maritalStatus==='MARRIED'",
                                    "onChange": function(modelValue, form, model) {
                                        if (model.customer.spouseDateOfBirth) {
                                            model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                        }
                                    }
                                },
                                // {
                                //     key:"customer.spouseAge",
                                //     title: "SPOUSE_AGE",
                                //     type:"number",
                                //     condition:"model.customer.maritalStatus==='MARRIED'",
                                //     "onChange": function(modelValue, form, model) {
                                //         if (model.customer.spouseAge > 0) {
                                //             if (model.customer.spouseDateOfBirth) {
                                //                 model.customer.spouseDateOfBirth = moment(new Date()).subtract(model.customer.spouseAge, 'years').format('YYYY-') + moment(model.customer.spouseDateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                //             } else {
                                //                 model.customer.spouseDateOfBirth = moment(new Date()).subtract(model.customer.spouseAge, 'years').format('YYYY-MM-DD');
                                //             }
                                //         }
                                //     }
                                // }
                            ]
                        },
                        {
                            "type": "box",
                            "title": "PERSONAL_INFORMATION",
                            "condition": "model.currentStage == 'ScreeningReview' || model.currentStage == 'ApplicationReview'  || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                            readonly:true,
                            "items": [
                                {
                                    key: "customer.customerBranchId",
                                    title:"BRANCH_NAME",
                                    type: "select"
                                },
                                {
                                    key:"customer.centreId",
                                    title:"CENTRE_NAME",
                                    parentEnumCode:"branch_id",
                                    parentValueExpr:"model.customer.customerBranchId",
                                    type:"select"
                                },
                                {
                                    key: "customer.oldCustomerId",
                                    title:"CUSTOMER_ID",
                                    titleExpr:"('CUSTOMER_ID'|translate)+' (Artoo)'",
                                    condition: "model.customer.oldCustomerId",
                                    readonly: true
                                },
                                {
                                    key: "customer.id",
                                    condition: "model.customer.id",
                                    title:"CUSTOMER_ID",
                                    readonly: true
                                },
                                {
                                    key: "customer.urnNo",
                                    condition: "model.customer.urnNo",
                                    title:"URN_NO",
                                    readonly: true
                                },
                                {
                                    key:"customer.photoImageId",
                                    type:"file",
                                    fileType:"image/*"
                                },
                                {
                                    "key": "customer.existingLoan",
                                    "title": "EXISTING_LOAN",
                                    "type": "radios",
                                    enumCode:"decisionmaker",
                                    condition:"model._bundlePageObj.pageClass=='applicant'"
                                },
                                {
                                    "key": "customer.title",
                                    "title": "TITLE",
                                    "type": "string"
                                },
                                {
                                    key: "customer.firstName",
                                    title:"FULL_NAME",
                                    type:"qrcode"
                                },
                                {
                                    key:"customer.enrolledAs",
                                    type:"radios"
                                },
                                {
                                    key:"customer.gender",
                                    type:"radios"
                                },
                                {
                                    key:"customer.dateOfBirth",
                                    type:"date"
                                },
                                // {
                                //     key:"customer.age",
                                //     title: "AGE",
                                //     type:"number"
                                // },
                                {
                                    key:"customer.religion",
                                    type:"select"
                                },
                                {
                                    key: "customer.language",
                                    title: "PREFERRED_LANGUAGE",
                                    type: "select",
                                    enumCode: "language"
                                },
                                {
                                    key: "customer.fatherFirstName",
                                    title: "FATHER_FULL_NAME"
                                },
                                {
                                    key: "customer.motherName",
                                    title: "MOTHER_NAME"
                                },
                                {
                                    key:"customer.maritalStatus",
                                    type:"select"
                                },
                                {
                                    key: "customer.spouseFirstName",
                                    title: "SPOUSE_FULL_NAME",
                                    condition:"model.customer.maritalStatus==='MARRIED'",
                                    type:"qrcode"
                                },
                                // {
                                //     key:"customer.spouseAge",
                                //     title: "SPOUSE_AGE",
                                //     type:"number",
                                //     condition:"model.customer.maritalStatus==='MARRIED'"
                                // },
                                {
                                    key:"customer.spouseDateOfBirth",
                                    type:"date",
                                    condition:"model.customer.maritalStatus==='MARRIED'"
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "title": "CONTACT_INFORMATION",
                            "condition": "model.currentStage=='Screening' || model.currentStage == 'Application' || model.currentStage=='FieldAppraisal'",
                            "items": [
                                "customer.mobilePhone",
                                "customer.landLineNo",
                                {
                                    "type": "string",
                                    "key": "customer.whatsAppMobileNoOption",
                                    "condition": "model.currentStage=='Screening'",
                                    "title": "CHOOSE_WHATSAPP_NO",
                                     "type":"radios",
                                     "titleMap": {
                                         1: "Mobile Phone",
                                         2: "Phone 2",
                                         3: "Other"
                                     },
                                     onChange: function(modelValue, form, model, formCtrl, event) {
                                        switch (modelValue){
                                            case "1":
                                                model.customer.whatsAppMobileNo = model.customer.mobilePhone;
                                                break;
                                            case "2":
                                                model.customer.whatsAppMobileNo = model.customer.landLineNo;
                                                break;
                                            case "3":
                                                model.customer.whatsAppMobileNo = "";
                                                break;
                                        }
                                     },
                                },
                                {
                                    "type": "string",
                                    "key": "customer.whatsAppMobileNo",
                                    "title": "WHATSAPP_MOBILE_NO",
                                },
                                {
                                    "type": "string",
                                    "key": "customer.email",
                                    "title": "EMAIL"
                                },
                                {
                                    type: "fieldset",
                                    title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                                    items: [
                                    {
                                      key:"customer.careOf",
                                      //required:true,
                                      title:"C/O",  
                                    },
                                        "customer.doorNo",
                                        "customer.street",
                                        "customer.postOffice",
                                        "customer.landmark",
                                        {
                                            key: "customer.pincode",
                                            type: "lov",
                                            fieldType: "number",
                                            autolov: true,
                                            inputMap: {
                                                "pincode": "customer.pincode",
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
                                            initialize: function(inputModel) {
                                                $log.warn('in pincode initialize');
                                                $log.info(inputModel);
                                            },
                                            search: function(inputModel, form, model) {
                                                if (!inputModel.pincode) {
                                                    return $q.reject();
                                                }
                                                return Queries.searchPincodes(
                                                        inputModel.pincode,
                                                        inputModel.district,
                                                        inputModel.state
                                                );
                                            },
                                            getListDisplayItem: function(item, index) {
                                                return [
                                                    item.division + ', ' + item.region,
                                                    item.pincode,
                                                    item.district + ', ' + item.state,
                                                ];
                                            },
                                            onSelect: function(result, model, context) {
                                                $log.info(result);
                                            }
                                        },
                                        "customer.locality",
                                        "customer.villageName",
                                        "customer.district",
                                        "customer.state",
                                        "customer.mailSameAsResidence"
                                    ]
                                },
                                {
                                    type: "fieldset",
                                    title: "CUSTOMER_PERMANENT_ADDRESS",
                                    condition:"!model.customer.mailSameAsResidence",
                                    items: [
                                        "customer.mailingDoorNo",
                                        "customer.mailingStreet",
                                        "customer.mailingPostoffice",
                                        {
                                            key: "customer.mailingPincode",
                                            type: "lov",
                                            fieldType: "string",
                                            autolov: true,
                                            inputMap: {
                                                "mailingPincode": "customer.mailingPincode",
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
                                                "mailingState": "customer.mailingState"
                                            },
                                            searchHelper: formHelper,
                                            initialize: function(inputModel) {
                                                $log.warn('in pincode initialize');
                                                $log.info(inputModel);
                                            },
                                            search: function(inputModel, form, model) {
                                                if (!inputModel.mailingPincode) {
                                                    return $q.reject();
                                                }
                                                return Queries.searchPincodes(
                                                        inputModel.mailingPincode,
                                                        inputModel.mailingDistrict,
                                                        inputModel.mailingState
                                                );
                                            },
                                            getListDisplayItem: function(item, index) {
                                                return [
                                                    item.division + ', ' + item.region,
                                                    item.pincode,
                                                    item.district + ', ' + item.state
                                                ];
                                            },
                                            onSelect: function(result, model, context) {
                                                model.customer.mailingPincode = (new Number(result.pincode)).toString();
                                                model.customer.mailingLocality = result.division;
                                                model.customer.mailingState = result.state;
                                                model.customer.mailingDistrict = result.district;
                                            }
                                        },
                                        "customer.mailingLocality",
                                        "customer.mailingDistrict",
                                        "customer.mailingState"
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "title": "CONTACT_INFORMATION",
                            "condition": "model.currentStage == 'ScreeningReview' || model.currentStage == 'ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                            readonly:true,
                            "items": [
                                "customer.mobilePhone",
                                "customer.landLineNo",
                                {
                                    "type": "string",
                                    "key": "customer.whatsAppMobileNo",
                                    "title": "WHATSAPP_MOBILE_NO",
                                },
                                {
                                    "type": "string",
                                    "key": "customer.email",
                                    "title": "EMAIL"
                                },
                                {
                                    type: "fieldset",
                                    title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                                    items: [
                                        "customer.careOf",
                                        "customer.doorNo",
                                        "customer.street",
                                        "customer.postOffice",
                                        "customer.landmark",
                                        {
                                            key: "customer.pincode",
                                            fieldType: "number",
                                        },
                                        "customer.locality",
                                        "customer.villageName",
                                        "customer.district",
                                        "customer.state",
                                        "customer.mailSameAsResidence"
                                    ]
                                },
                                {
                                    type: "fieldset",
                                    title: "CUSTOMER_PERMANENT_ADDRESS",
                                    condition:"!model.customer.mailSameAsResidence",
                                    items: [
                                        "customer.mailingDoorNo",
                                        "customer.mailingStreet",
                                        "customer.mailingPostoffice",
                                        {
                                            key: "customer.mailingPincode",
                                            fieldType: "number",
                                        },
                                        "customer.mailingLocality",
                                        "customer.mailingDistrict",
                                        "customer.mailingState"
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "title": "HOUSEHOLD_FINANCIALS",
                            "condition": "model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                            "items": [
                               /* {
                                    "key": "customer.otherBusinessIncomes",
                                    "type": "array",
                                    "title": "OTHER_INCOME_SOURCE",
                                    "view": "fixed",
                                    // "add": null,
                                    // "remove": null,
                                    "items": [
                                        {
                                            "key": "customer.otherBusinessIncomes[].incomeSource",
                                            //"type": "amount",
                                            enumCode:"expenditure",
                                            //"title": "AMOUNT",
                                            "title": "INCOME_SOURCE"
                                        }
                                    ]
                                },*/
                                {
                                    "key": "customer.expenditures",
                                    "type": "array",
                                    "title": "EXPENDITURES",
                                    "view": "fixed",
                                     "add": null,
                                     "remove": null,
                                    "items": [
                                        
                                        {
                                            "key": "customer.expenditures[].expenditureSource",
                                            "type": "select",
                                            "title": "EXPENSE_TYPE"
                                        },
                                        {
                                            "key": "customer.expenditures[].annualExpenses",
                                            "type": "amount",
                                            "title": "AMOUNT"
                                        },
                                        /*{
                                            "key": "customer.expenditures[].frequency",
                                            "type": "string",
                                            "title": "FREQUENCY"
                                        }*/
                                     ]
                                }
                              
                            ]
                        },
                        {
                            "type": "box",
                            "title": "HOUSEHOLD_FINANCIALS",
                            "condition": "model.currentStage =='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                            readonly:true,
                            "items": [
                                /*{
                                    "key": "customer.otherBusinessIncomes",
                                    "type": "array",
                                    "title": "OTHER_INCOME_SOURCE",
                                    "add": null,
                                    "remove": null,
                                    "view": "fixed",
                                    "items": [
                                        {
                                            "key": "customer.otherBusinessIncomes[].incomeSource",
                                            "type": "amount",
                                            "title": "AMOUNT"
                                        }
                                    ]
                                },*/
                                {
                                    "key": "customer.expenditures",
                                    "type": "array",
                                    "title": "EXPENDITURES",
                                    "add": null,
                                    "remove": null,
                                    "view": "fixed",
                                    "items": [
                                        {
                                            "key": "customer.expenditures[].annualExpenses",
                                            "type": "amount",
                                            "title": "MONTHLY_EDUCATION_EXPENSE"
                                        }
                                    ]
                                }

                            ]
                        },
                        {
                            "type": "box",
                            "title": "FAMILY_DETAILS",
                            "condition": "model.currentStage=='Screening'",
                            "items": [
                                {
                                    "key": "customer.familyMembers",
                                    "type": "array",
                                    "add": null,
                                    "remove": null,
                                    "startEmpty": true,
                                    "view":"fixed",
                                    "items": [
                                        {
                                            "key": "customer.familyMembers[].relationShip",
                                            "type": "select"
                                        },
                                        {
                                            "key": "customer.familyMembers[].educationStatus",
                                            "title": "EDUCATION_LEVEL",
                                            "type": "select"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "title": "FAMILY_DETAILS",
                            "condition": "model.currentStage=='ScreeningReview'",
                            readonly:true,
                            "items": [
                                {
                                    "key": "customer.familyMembers",
                                    "type": "array",
                                    "add": null,
                                    "remove": null,
                                    "startEmpty": true,
                                    "view":"fixed",
                                    "items": [
                                        {
                                            "key": "customer.familyMembers[].relationShip",
                                            "type": "select"
                                        },
                                        {
                                            "key": "customer.familyMembers[].educationStatus",
                                            "title": "EDUCATION_LEVEL",
                                            "type": "select"
                                        }
                                    ]
                                }

                            ]
                        },
                        {
                            "type": "box",
                            "title": "FAMILY_SELF_DETAILS",
                            "condition": "model.currentStage == 'Application' || model.currentStage=='FieldAppraisal'",
                            "items": [{
                                key:"customer.familyMembers",
                                type:"array",
                                startEmpty: true,
                                items: [
                                    {
                                        key:"customer.familyMembers[].relationShip",
                                        type:"select",
                                        onChange: function(modelValue, form, model, formCtrl, event) {
                                            if (modelValue && modelValue.toLowerCase() === 'self') {
                                                if (model.customer.id)
                                                    model.customer.familyMembers[form.arrayIndex].customerId = model.customer.id;
                                                if (model.customer.firstName)
                                                    model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.firstName;
                                                if (model.customer.gender)
                                                    model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender;
                                                model.customer.familyMembers[form.arrayIndex].age = model.customer.age;
                                                if (model.customer.dateOfBirth)
                                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.dateOfBirth;
                                                if (model.customer.maritalStatus)
                                                    model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                                if (model.customer.mobilePhone)
                                                    model.customer.familyMembers[form.arrayIndex].mobilePhone = model.customer.mobilePhone;
                                            } else if (modelValue && modelValue.toLowerCase() === 'spouse') {
                                                if (model.customer.spouseFirstName)
                                                    model.customer.familyMembers[form.arrayIndex].familyMemberFirstName = model.customer.spouseFirstName;
                                                if (model.customer.gender)
                                                    model.customer.familyMembers[form.arrayIndex].gender = model.customer.gender == 'MALE' ? 'MALE' :
                                                            (model.customer.gender == 'FEMALE' ? 'FEMALE': model.customer.gender);
                                                model.customer.familyMembers[form.arrayIndex].age = model.customer.spouseAge;
                                                if (model.customer.spouseDateOfBirth)
                                                    model.customer.familyMembers[form.arrayIndex].dateOfBirth = model.customer.spouseDateOfBirth;
                                                if (model.customer.maritalStatus)
                                                    model.customer.familyMembers[form.arrayIndex].maritalStatus = model.customer.maritalStatus;
                                            }
                                        },
                                        title: "T_RELATIONSHIP"
                                    },
                                    // {
                                    //     key:"customer.familyMembers[].customerId",
                                    //     condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                    //     type:"lov",
                                    //     "inputMap": {
                                    //         "firstName": {
                                    //             "key": "customer.firstName",
                                    //             "title": "CUSTOMER_NAME"
                                    //         },
                                    //         "branchName": {
                                    //             "key": "customer.kgfsName",
                                    //             "type": "select"
                                    //         },
                                    //         "centreCode": {
                                    //             "key": "customer.centreCode",
                                    //             "type": "select"
                                    //         }
                                    //     },
                                    //     "outputMap": {
                                    //         "id": "customer.familyMembers[arrayIndex].customerId",
                                    //         "firstName": "customer.familyMembers[arrayIndex].familyMemberFirstName"

                                    //     },
                                    //     "searchHelper": formHelper,
                                    //     "search": function(inputModel, form) {
                                    //         $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    //         var promise = Enrollment.search({
                                    //             'branchName': SessionStore.getBranch() || inputModel.branchName,
                                    //             'firstName': inputModel.first_name,
                                    //         }).$promise;
                                    //         return promise;
                                    //     },
                                    //     getListDisplayItem: function(data, index) {
                                    //         return [
                                    //             [data.firstName, data.fatherFirstName].join(' '),
                                    //             data.id
                                    //         ];
                                    //     }
                                    // },
                                    {
                                        key:"customer.familyMembers[].familyMemberFirstName",
                                        condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                        title:"FAMILY_MEMBER_FULL_NAME"
                                    },
                                    // {
                                    //     key: "customer.familyMembers[].gender",
                                    //     condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                    //     type: "radios",
                                    //     title: "T_GENDER"
                                    // },
                                    // {
                                    //     key:"customer.familyMembers[].age",
                                    //     condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                    //     title: "AGE",
                                    //     type:"number",
                                    //     "onChange": function(modelValue, form, model, formCtrl, event) {
                                    //         if (model.customer.familyMembers[form.arrayIndex].age > 0) {
                                    //             if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                    //                 model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-') + moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                    //             } else {
                                    //                 model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-MM-DD');
                                    //             }
                                    //         }
                                    //     }
                                    // },
                                    // {
                                    //     key: "customer.familyMembers[].dateOfBirth",
                                    //     condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                    //     type:"date",
                                    //     title: "T_DATEOFBIRTH",
                                    //     "onChange": function(modelValue, form, model, formCtrl, event) {
                                    //         if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                    //             model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                    //         }
                                    //     }
                                    // },
                                    // {
                                    //     key:"customer.familyMembers[].educationStatus",
                                    //     type:"select",
                                    //     title: "T_EDUCATION_STATUS"
                                    // },
                                    // {
                                    //     key:"customer.familyMembers[].maritalStatus",
                                    //     condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                    //     type:"select",
                                    //     title: "T_MARITAL_STATUS"
                                    // },
                                    // {
                                    //     key: "customer.familyMembers[].mobilePhone",
                                    //     condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'"
                                    // },
                                    // {
                                    //     key:"customer.familyMembers[].healthStatus",
                                    //     type:"radios",
                                    //     titleMap:{
                                    //         "GOOD":"GOOD",
                                    //         "BAD":"BAD"
                                    //     },

                                    // },
                                    {
                                        key:"customer.familyMembers[].educationStatus",
                                        type:"select",
                                        required:true,
                                        title: "T_EDUCATION_STATUS"
                                    },
                                    {
                                        key: "customer.familyMembers[].anualEducationFee",
                                        type: "amount",
                                        title: "ANNUAL_EDUCATION_FEE"
                                    },
                                    {
                                        key: "customer.familyMembers[].salary",
                                        type: "amount",
                                        title: "SALARY"
                                    },
                                    {
                                        key:"customer.familyMembers[].incomes",
                                        type:"array",
                                        startEmpty: true,
                                        items:[
                                            {
                                                key: "customer.familyMembers[].incomes[].incomeSource",
                                                type:"select"
                                            },
                                            "customer.familyMembers[].incomes[].incomeEarned",
                                            {
                                                key: "customer.familyMembers[].incomes[].frequency",
                                                type: "select"
                                            }

                                        ]

                                    }
                                ]
                            }]
                        },
                        {
                            "type": "box",
                            "title": "FAMILY_DETAILS",
                            "condition": " model.currentStage == 'ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                            readonly:true,
                            "items": [{
                                key:"customer.familyMembers",
                                type:"array",
                                startEmpty: true,
                                view: 'fixed',
                                items: [
                                    {
                                        key:"customer.familyMembers[].relationShip",
                                        type:"select",
                                        title: "T_RELATIONSHIP"
                                    },
                                    {
                                        key:"customer.familyMembers[].familyMemberFirstName",
                                        condition: "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                                        title:"FAMILY_MEMBER_FULL_NAME"
                                    },
                                    {
                                        key:"customer.familyMembers[].educationStatus",
                                        type:"select",
                                        title: "T_EDUCATION_STATUS"
                                    },
                                    {
                                        key: "customer.familyMembers[].anualEducationFee",
                                        type: "amount",
                                        title: "ANNUAL_EDUCATION_FEE"
                                    },
                                    {
                                        key: "customer.familyMembers[].salary",
                                        type: "amount",
                                        title: "SALARY"
                                    },
                                    {
                                        key:"customer.familyMembers[].incomes",
                                        type:"array",
                                        startEmpty: false,
                                        items:[
                                            {
                                                key: "customer.familyMembers[].incomes[].incomeSource",
                                                type:"select"
                                            },
                                            {
                                                Key:"customer.familyMembers[].incomes[].incomeEarned",
                                            },
                                            {
                                                key: "customer.familyMembers[].incomes[].frequency",
                                                type: "select"
                                            }

                                        ]

                                    }
                                ]
                            }]
                        },
                        {
                            type:"box",
                            title:"HOUSEHOLD_LIABILITIES",
                            "condition": "model.currentStage == 'Screening' || model.currentStage == 'Application' || model.currentStage=='FieldAppraisal'",
                            items:[
                                {
                                    key:"customer.liabilities",
                                    type:"array",
                                    startEmpty: true,
                                    title:"HOUSEHOLD_LIABILITIES",
                                    items:[
                                        // {
                                        //     key:"customer.liabilities[].loanType",
                                        //     type:"select"
                                        // },
                                        {
                                            key:"customer.liabilities[].loanSource",
                                            type:"select",
                                            enumCode:"loan_source"
                                        },
                                        // "customer.liabilities[].instituteName",
                                        {
                                            key: "customer.liabilities[].loanAmountInPaisa",
                                            type: "amount"
                                        },
                                        {
                                            key: "customer.liabilities[].installmentAmountInPaisa",
                                            type: "amount",
                                            title:"AVG_INSTALLEMENT_AMOUNT"
                                        },
                                        {
                                            key: "customer.liabilities[].outstandingAmountInPaisa",
                                            type: "amount",
                                            title: "OUTSTANDING_AMOUNT"
                                        },
                                        {
                                            key: "customer.liabilities[].startDate",
                                            type:"date"
                                        },
                                        {
                                            key:"customer.liabilities[].maturityDate",
                                            type:"date"
                                        },
                                        {
                                            key: "customer.liabilities[].noOfInstalmentPaid",
                                            type: "number",
                                            title: "NO_OF_INSTALLMENT_PAID"
                                        },
                                        {
                                            key:"customer.liabilities[].frequencyOfInstallment",
                                            type:"select"
                                        },
                                        {
                                            key:"customer.liabilities[].liabilityLoanPurpose",
                                            /*type:"select",
                                            enumCode: "loan_purpose_1"*/
                                        },
                                        {
                                           key:"customer.liabilities[].interestOnly",
                                           type:"radios",
                                           title:"INTEREST_ONLY",
                                           enumCode:"decisionmaker"
                                        },
                                        {
                                            key: "customer.liabilities[].interestRate",
                                            type: "number",
                                            title: "RATE_OF_INTEREST"
                                        },
                                        /*{
                                           key:"customer.liabilities[].interestExpense",
                                           title:"INTEREST_EXPENSE"
                                        },
                                        {
                                           key:"customer.liabilities[].principalExpense",
                                           title:"PRINCIPAL_EXPENSE"
                                        }
*/
                                    ]
                                }
                            ]
                        },
                        {
                            type:"box",
                            title:"HOUSEHOLD_LIABILITIES",
                            "condition": "model.currentStage == 'ScreeningReview' || model.currentStage == 'ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                            readonly:true,
                            items:[
                                {
                                    key:"customer.liabilities",
                                    type:"array",
                                    startEmpty: true,
                                    title:"HOUSEHOLD_LIABILITIES",
                                    items:[
                                        // {
                                        //     key:"customer.liabilities[].loanType",
                                        //     type:"select"
                                        // },
                                        {
                                            key:"customer.liabilities[].loanSource"/*,
                                            type:"select"*/ //Made as free text till list of values are given by Kinara
                                        },
                                        //"customer.liabilities[].instituteName",
                                        {
                                            key: "customer.liabilities[].loanAmountInPaisa",
                                            type: "amount"
                                        },
                                        {
                                            key: "customer.liabilities[].installmentAmountInPaisa",
                                            type: "amount",
                                            title:"AVG_INSTALLEMENT_AMOUNT"
                                        },
                                        {
                                            key: "customer.liabilities[].outstandingAmountInPaisa",
                                            type: "amount",
                                            title: "OUTSTANDING_AMOUNT"
                                        },
                                        {
                                            key: "customer.liabilities[].startDate",
                                            type:"date"
                                        },
                                        {
                                            key:"customer.liabilities[].maturityDate",
                                            type:"date"
                                        },
                                        {
                                            key: "customer.liabilities[].noOfInstalmentPaid",
                                            type: "number",
                                            title: "NO_OF_INSTALLMENT_PAID"
                                        },
                                        {
                                            key:"customer.liabilities[].frequencyOfInstallment",
                                            type:"select"
                                        },
                                        {
                                            key:"customer.liabilities[].liabilityLoanPurpose",
                                           /* type:"select",
                                            enumCode: "loan_purpose_1"*/
                                        },
                                        {
                                           key:"customer.liabilities[].interestOnly",
                                           type:"radios",
                                           title:"INTEREST_ONLY",
                                           enumCode:"decisionmaker"
                                        },
                                        {
                                            key: "customer.liabilities[].interestRate",
                                            type: "number",
                                            title: "RATE_OF_INTEREST"
                                        },
                                        /*{
                                           key:"customer.liabilities[].interestExpense",
                                           title:"INTEREST_EXPENSE"
                                        },
                                        {
                                           key:"customer.liabilities[].principalExpense",
                                           title:"PRINCIPAL_EXPENSE"
                                        }*/

                                    ]
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "title": "T_HOUSE_VERIFICATION",
                            "condition": "model.currentStage=='Screening'",
                            "items": [
                                {
                                    type:"fieldset",
                                    title:"HOUSE_DETAILS",
                                    items:[
                                        {
                                            key:"customer.ownership",
                                            required:true,
                                            type:"select"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf29", // customer.inCurrentAddressSince
                                            type: "select",
                                            title: "IN_CURRENT_ADDRESS_SINCE"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf30", // customer.inCurrentAreaSince
                                            type:"select",
                                            required:true,
                                            title: "IN_CURRENT_AREA_SINCE"
                                        }
                                    ]
                                },
                                {
                                    "key": "customer.latitude",
                                    "title": "HOUSE_LOCATION",
                                    "type": "geotag",
                                    "latitude": "customer.latitude",
                                    "longitude": "customer.longitude"
                                }
                            ]
                        },
                         {
                            "type": "box",
                            "title": "T_HOUSE_VERIFICATION",
                            "condition": "model.currentStage=='ScreeningReview'",
                            readonly:true,
                            "items": [
                                {
                                    type:"fieldset",
                                    title:"HOUSE_DETAILS",
                                    items:[
                                        {
                                            key:"customer.ownership",
                                            type:"select"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf29", // customer.inCurrentAddressSince
                                            type: "select",
                                            title: "IN_CURRENT_ADDRESS_SINCE"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf30", // customer.inCurrentAreaSince
                                            type:"select",
                                            title: "IN_CURRENT_AREA_SINCE"
                                        }
                                    ]
                                },
                                {
                                    "key": "customer.latitude",
                                    "title": "HOUSE_LOCATION",
                                    "type": "geotag",
                                    "latitude": "customer.latitude",
                                    "longitude": "customer.longitude"
                                }
                            ]
                        },
                        {
                            "type": "box",
                            "title": "T_HOUSE_VERIFICATION",
                            "condition": " model.currentStage == 'Application' || model.currentStage=='FieldAppraisal'",
                            "items": [
                                {
                                    type:"fieldset",
                                    title:"HOUSE_DETAILS",
                                    items:[
                                        {
                                            key:"customer.ownership",
                                            required:true,
                                            type:"select"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf29", // customer.inCurrentAddressSince
                                            type: "select",
                                            title: "IN_CURRENT_ADDRESS_SINCE"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf30", // customer.inCurrentAreaSince
                                            type:"select",
                                            required:true,
                                            title: "IN_CURRENT_AREA_SINCE"
                                        }
                                    ]
                                },
                                {
                                    "key": "customer.latitude",
                                    "title": "HOUSE_LOCATION",
                                    "type": "geotag",
                                    "latitude": "customer.latitude",
                                    "longitude": "customer.longitude"
                                },
                                //{
                                //   key: "customer.nameOfRo",
                                //   readonly: true
                                //},
                                {
                                    key:"customer.houseVerificationPhoto",
                                    type:"file",
                                    fileType:"image/*"
                                },
                                {
                                    key: "customer.date",
                                    type:"date"
                                },
                                "customer.place"
                            ]
                        },
                        {
                            "type": "box",
                            "title": "T_HOUSE_VERIFICATION",
                            "condition": "model.currentStage == 'ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                            readonly:true,
                            "items": [
                                {
                                    type:"fieldset",
                                    title:"HOUSE_DETAILS",
                                    items:[
                                        {
                                            key:"customer.ownership",
                                            type:"select"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf29", // customer.inCurrentAddressSince
                                            type: "select",
                                            title: "IN_CURRENT_ADDRESS_SINCE"
                                        },
                                        {
                                            key:"customer.udf.userDefinedFieldValues.udf30", // customer.inCurrentAreaSince
                                            type:"select",
                                            title: "IN_CURRENT_AREA_SINCE"
                                        }
                                    ]
                                },
                                {
                                    "key": "customer.latitude",
                                    "title": "HOUSE_LOCATION",
                                    "type": "geotag",
                                    "latitude": "customer.latitude",
                                    "longitude": "customer.longitude"
                                },
                                {
                                    key:"customer.houseVerificationPhoto",
                                    type:"file",
                                    fileType:"image/*"
                                },
                                {
                                    key: "customer.date",
                                    type:"date"
                                },
                                "customer.place"
                            ]
                        },
                        {
                            type: "box",
                            title: "BANK_ACCOUNTS",
                            "condition": "model.currentStage=='Screening' || model.currentStage == 'Application'  || model.currentStage=='FieldAppraisal'",
                            items: [
                                {
                                    key: "customer.customerBankAccounts",
                                    type: "array",
                                    title: "BANK_ACCOUNTS",
                                    startEmpty: true,
                                    items: [
                                        {
                                            key: "customer.customerBankAccounts[].ifscCode",
                                            type: "lov",
                                            lovonly: true,
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
                                            search: function(inputModel, form) {
                                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                                var promise = CustomerBankBranch.search({
                                                    'bankName': inputModel.bankName,
                                                    'ifscCode': inputModel.ifscCode,
                                                    'branchName': inputModel.branchName
                                                }).$promise;
                                                return promise;
                                            },
                                            getListDisplayItem: function(data, index) {
                                                return [
                                                    data.ifscCode,
                                                    data.branchName,
                                                    data.bankName
                                                ];
                                            }
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].customerBankName",
                                            readonly: true
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].customerBankBranchName",
                                            readonly: true
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].customerNameAsInBank"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].accountNumber"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].accountType",
                                            type: "select"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].bankingSince",
                                            type: "date",
                                            title: "BANKING_SINCE"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].netBankingAvailable",
                                            type: "select",
                                            title: "NET_BANKING_AVAILABLE",
                                            enumCode: "decisionmaker"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].sanctionedAmount",
                                            type: "amount",
                                            title: "OUTSTANDING_BALANCE",
                                            condition:"model.customer.customerBankAccounts[arrayIndex].accountType=='OD' || model.customer.customerBankAccounts[arrayIndex].accountType=='CC'"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].bankStatements",
                                            type: "array",
                                            title: "STATEMENT_DETAILS",
                                            items: [
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].startMonth",
                                                    type: "date",
                                                    title: "START_MONTH"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].totalDeposits",
                                                    type: "amount",
                                                    required:true,
                                                    title: "TOTAL_DEPOSITS"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].totalWithdrawals",
                                                    type: "amount",
                                                    title: "TOTAL_WITHDRAWALS"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].balanceAsOn15th",
                                                    type: "amount",
                                                    title: "BALANCE_AS_ON_REQUESTED_EMI_DATE"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].noOfChequeBounced",
                                                    type: "amount",
                                                    required:true,
                                                    title: "NO_OF_CHEQUE_BOUNCED"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].noOfEmiChequeBounced",
                                                    type: "amount",
                                                    required:true,
                                                    title: "NO_OF_EMI_CHEQUE_BOUNCED"
                                                },
                                            ]
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].isDisbersementAccount",
                                            type: "radios",
                                            titleMap: [{
                                                value: true,
                                                name: "Yes"
                                            },{
                                                value: false,
                                                name: "No"
                                            }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: "box",
                            title: "BANK_ACCOUNTS",
                            "condition": "model.currentStage=='ScreeningReview' || model.currentStage == 'ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                            readonly:true,
                            items: [
                                {
                                    key: "customer.customerBankAccounts",
                                    type: "array",
                                    title: "BANK_ACCOUNTS",
                                    startEmpty: true,
                                    items: [
                                        {
                                            key: "customer.customerBankAccounts[].ifscCode",
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].customerBankName",
                                            readonly: true
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].customerBankBranchName",
                                            readonly: true
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].customerNameAsInBank"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].accountNumber"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].accountType",
                                            type: "select"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].bankingSince",
                                            type: "date",
                                            title: "BANKING_SINCE"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].netBankingAvailable",
                                            type: "string",
                                            title: "NET_BANKING_AVAILABLE",
                                            //enumCode: "decisionmaker"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].sanctionedAmount",
                                            type: "amount",
                                            title: "OUTSTANDING_BALANCE",
                                            condition:"model.customer.customerBankAccounts[arrayIndex].accountType=='OD' || model.customer.customerBankAccounts[arrayIndex].accountType=='CC'"
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].bankStatements",
                                            type: "array",
                                            title: "STATEMENT_DETAILS",
                                            items: [
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].startMonth",
                                                    type: "date",
                                                    title: "START_MONTH"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].totalDeposits",
                                                    type: "amount",
                                                    title: "TOTAL_DEPOSITS"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].totalWithdrawals",
                                                    type: "amount",
                                                    title: "TOTAL_WITHDRAWALS"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].balanceAsOn15th",
                                                    type: "amount",
                                                    title: "BALANCE_AS_ON_REQUESTED_EMI_DATE"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].noOfChequeBounced",
                                                    type: "amount",
                                                    title: "NO_OF_CHEQUE_BOUNCED"
                                                },
                                                {
                                                    key: "customer.customerBankAccounts[].bankStatements[].noOfEmiChequeBounced",
                                                    type: "amount",
                                                    title: "NO_OF_EMI_CHEQUE_BOUNCED"
                                                },
                                            ]
                                        },
                                        {
                                            key: "customer.customerBankAccounts[].isDisbersementAccount",
                                            type: "radios",
                                            titleMap: [{
                                                value: true,
                                                name: "Yes"
                                            },{
                                                value: false,
                                                name: "No"
                                            }]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                "type": "box",
                "title": "REFERENCES",
                "condition": "model._bundlePageObj.pageClass=='applicant' && model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                "items": [
                    {
                        key:"customer.verifications",
                        title:"REFERENCES",
                        type: "array", 
                        items:[
                            {
                                key:"customer.verifications[].relationship",
                                title:"REFERENCE_TYPE",
                                type:"select",
                                required:"true",
                               titleMap: {
                                        "Neighbour": "Neighbour",
                                        "Relative/friend": "Relative/friend"
                                    }
                            },
                            {
                                key:"customer.verifications[].referenceFirstName",
                                title:"FULL_NAME",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].mobileNo",
                                title:"MOBILE_NO",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].occupation",
                                title:"OCCUPATION",
                                type:"select",
                                "enumCode": "occupation",
                            },
                            {
                                key:"customer.verifications[].selfReportedIncome",
                                title:"SELF_REPORTED_INCOME",
                                type:"number"
                            },
                            {
                            type: "fieldset",
                            title: "REFERENCE_CHECK",
                            "condition": "model.currentStage=='FieldAppraisal'",
                            items: [
                            {
                                key:"customer.verifications[].customerResponse",
                                title:"CUSTOMER_RESPONSE",
                                type:"select",
                                titleMap: [{
                                                value: "positive",
                                                name: "positive"
                                            },{
                                                value: "Negative",
                                                name: "Negative"
                                            }]

                            },
                            {
                                key:"customer.verifications[].remarks",
                                title:"REMARKS",
                            },
                            ]
                            }
                         ] 
                    },
                ]
            },
            {
                "type": "box",
                "title": "REFERENCES",
                "condition": "model._bundlePageObj.pageClass=='applicant' && model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                readonly:true,
                "items": [
                    {
                        key:"customer.verifications",
                        title:"REFERENCES",
                        type: "array", 
                        items:[
                            {
                                key:"customer.verifications[].relationship",
                                title:"REFERENCE_TYPE",
                                type:"select",
                                required:"true",
                                titleMap: {
                                        "Neighbour": "Neighbour",
                                        "Relative/friend": "Relative/friend"
                                    }
                            },
                            {
                                key:"customer.verifications[].referenceFirstName",
                                title:"FULL_NAME",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].mobileNo",
                                title:"MOBILE_NO",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].occupation",
                                title:"OCCUPATION",
                                 type:"select",
                                "enumCode": "occupation",
                            },
                            {
                                key:"customer.verifications[].selfReportedIncome",
                                title:"SELF_REPORTED_INCOME",
                                type:"number"
                            },
                            {
                            type: "fieldset",
                            title: "REFERENCE_CHECK",
                            "condition": "model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                            items: [
                            {
                                key:"customer.verifications[].customerResponse",
                                title:"CUSTOMER_RESPONSE",
                                type:"string",
                            },
                            {
                                key:"customer.verifications[].remarks",
                                title:"REMARKS",
                            }
                            ]
                            }
                            
                         ] 
                    },
                ]
            },
            {
                            type:"box",
                            title:"PHYSICAL_ASSETS",
                            "condition": "model.currentStage == 'Application'  || model.currentStage=='FieldAppraisal'",
                            items:[
                                {
                                    key:"customer.physicalAssets",
                                    type:"array",
                                    startEmpty: true,
                                    title:"PHYSICAL_ASSETS",
                                    items:[
                                        {
                                            key: "customer.physicalAssets[].nameOfOwnedAsset",
                                            title: "ASSET_TYPE",
                                            type: "select",
                                            enumCode: "asset_type"
                                        },
                                        {
                                            key: "customer.physicalAssets[].vehicleModel",
                                            title: "VEHICLE_MAKE_MODEL",
                                            condition: "model.customer.physicalAssets[arrayIndex].assetType=='Two wheeler' || model.customer.physicalAssets[arrayIndex].assetType=='Four wheeler'",
                                            type: "string"
                                        },
                                        {
                                            key: "customer.physicalAssets[].registeredOwner",
                                            title: "REGISTERED_OWNER",
                                            type: "string"
                                        },
                                        {
                                            key: "customer.physicalAssets[].ownedAssetValue",
                                            title: "VALUE_OF_THE_ASSET",
                                            type: "amount"
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            type:"box",
                            title:"PHYSICAL_ASSETS",
                            "condition": "model.currentStage == 'ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                            readonly:true,
                            items:[
                                {
                                    key:"customer.physicalAssets",
                                    type:"array",
                                    startEmpty: true,
                                    title:"PHYSICAL_ASSETS",
                                    items:[
                                        {
                                            key: "customer.physicalAssets[].nameOfOwnedAsset",
                                            title: "ASSET_TYPE",
                                            type: "select",
                                            enumCode: "asset_type"
                                        },
                                        {
                                            key: "customer.physicalAssets[].vehicleModel",
                                            condition: "model.customer.physicalAssets[arrayIndex].assetType=='Two wheeler' || model.customer.physicalAssets[arrayIndex].assetType=='Four wheeler'",
                                            title: "VEHICLE_MAKE_MODEL",
                                            type: "string"
                                        },
                                        {
                                            key: "customer.physicalAssets[].registeredOwner",
                                            title: "REGISTERED_OWNER",
                                            type: "string"
                                        },
                                        {
                                            key: "customer.physicalAssets[].ownedAssetValue",
                                            title: "VALUE_OF_THE_ASSET",
                                            type: "string"
                                        },
                                    ]
                                }
                            ]
                        },
                        {
                            type: "box",
                            title: "PROXY_INDICATORS",
                            condition: "model._bundlePageObj.pageClass=='applicant' && model.currentStage=='FieldAppraisal' && !model.proxyIndicatorsHasValue",
                            items: [
                                {
                                    key:"customer.properAndMatchingSignboard",
                                    title:"PROPER_MATCHING_SIGNBOARD",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.bribeOffered",
                                    title:"BRIBE_OFFERED",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.shopOrganized",
                                    title:"SHOP_SHED_ORGANIZED",
                                    type:"radios",
                                    required:"true",
                                    enumCode: "status_scale_2"
                                },
                                {
                                    key:"customer.isIndustrialArea",
                                    title:"IN_INDUSTRIAL_AREA",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.customerAttitudeToKinara",
                                    title:"CUSTOMER_ATTITUDE_TO_KINARA",
                                    type:"radios",
                                    required:"true",
                                    enumCode: "status_scale_2"
                                },
                                {
                                    key:"customer.bookKeepingQuality",
                                    title:"BOOK_KEEPING_QUALITY",
                                    type:"radios",
                                    required:"true",
                                    enumCode: "status_scale_2"
                                },
                                {
                                    key:"customer.challengingChequeBounce",
                                    title:"CHALLENGING_CHEQUE_BOUNCE/FESS_CHARGE/POLICIES",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.allMachinesAreOperational",
                                    title:"ALL_MACHINES_OPERATIONAL?",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.employeeSatisfaction",
                                    title:"EMPLOYEE_SATISFACTION",
                                    type:"radios",
                                    required:"true",
                                    enumCode: "status_scale_2"
                                },
                                {
                                    key:"customer.politicalOrPoliceConnections",
                                    title:"POLITICAL_POLICE_CONNECTIONS",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.multipleProducts",
                                    title:"MULTIPLE_PRODUCTS_MORE_THAN_3",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.multipleBuyers",
                                    title:"MULTIPLE_BUYERS_MORE_THAN_3",
                                    condition: "model.customer.enterprise.businessType == 'Manufacturing'",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.seasonalBusiness",
                                    title:"SEASONAL_BUSINESS",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.incomeStability",
                                    title:"INCOME STABILITY",
                                    type:"radios",
                                    required:"true",
                                    enumCode: "income_stability"
                                },
                                {
                                    key:"customer.utilisationOfBusinessPremises",
                                    title:"UTILIZATION_OF_BUSINESS_PREMISES ",
                                    type:"radios",
                                    required:"true",
                                    enumCode: "utilisation_of_business"
                                },
                                {
                                    key:"customer.approachForTheBusinessPremises",
                                    title:"APPROACH_FOR_THE_BUSINESS_PREMISES",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"status_scale_2"
                                    //enumCode:"connectivity_status "
                                },
                                {
                                    key:"customer.safetyMeasuresForEmployees",
                                    title:"SAFETY_MEASURES_FOR_EMPLOYEES",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                    //enumCode: "status_scale"
                                },
                                {
                                    key:"customer.childLabours",
                                    title:"CHILD_LABOURERS",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.isBusinessEffectingTheEnvironment",
                                    title:"IS_THE_BUSSINESS_IN_EFFECTING_ENVIRONMENT",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.stockMaterialManagement",
                                    title:"STOCK_MATERIAL_MANAGEMENT",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"status_scale_2"
                                    //enumCode: "status_scale"
                                },
                                {
                                    key:"customer.customerWalkinToBusiness",
                                    condition: "model.customer.enterprise.businessType == 'Trading'",
                                    title:"CUSTOMER_WALK_IN_TO_THE_BUSINESS",
                                    type:"radios",
                                    required:"true",
                                    enumCode:"status_scale"
                                    //enumCode: "status_scale"
                                },

                            ]
                        },
                        {
                            type: "box",
                            title: "PROXY_INDICATORS",
                            condition: "model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction' || (model._bundlePageObj.pageClass=='applicant' && model.currentStage=='FieldAppraisal' && model.proxyIndicatorsHasValue)",
                            readonly:true,
                            items: [
                                {
                                    key:"customer.properAndMatchingSignboard",
                                    title:"PROPER_MATCHING_SIGNBOARD",
                                    type:"string",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.bribeOffered",
                                    title:"BRIBE_OFFERED",
                                    type:"string",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.shopOrganized",
                                    title:"SHOP_SHED_ORGANIZED",
                                    type:"string",
                                    required:"true",
                                    enumCode: "status_scale_2"
                                },
                                {
                                    key:"customer.isIndustrialArea",
                                    title:"IN_INDUSTRIAL_AREA",
                                    type:"string",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.customerAttitudeToKinara",
                                    title:"CUSTOMER_ATTITUDE_TO_KINARA",
                                    type:"string",
                                    required:"true",
                                    enumCode: "status_scale_2"
                                },
                                {
                                    key:"customer.bookKeepingQuality",
                                    title:"BOOK_KEEPING_QUALITY",
                                    type:"string",
                                    required:"true",
                                    enumCode: "status_scale_2"
                                },
                                {
                                    key:"customer.challengingChequeBounce",
                                    title:"CHALLENGING_CHEQUE_BOUNCE/FESS_CHARGE/POLICIES",
                                    type:"string",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.allMachinesAreOperational",
                                    title:"ALL_MACHINES_OPERATIONAL?",
                                    type:"string",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.employeeSatisfaction",
                                    title:"EMPLOYEE_SATISFACTION",
                                    type:"string",
                                    required:"true",
                                    enumCode: "status_scale_2"
                                },
                                {
                                    key:"customer.politicalOrPoliceConnections",
                                    title:"POLITICAL_POLICE_CONNECTIONS",
                                    type:"string",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.multipleProducts",
                                    title:"MULTIPLE_PRODUCTS_MORE_THAN_3",
                                    type:"string",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.multipleBuyers",
                                    title:"MULTIPLE_BUYERS_MORE_THAN_3",
                                    condition: "model.customer.enterprise.businessType == 'Manufacturing'",
                                    type:"string",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.seasonalBusiness",
                                    title:"SEASONAL_BUSINESS",
                                    type:"string",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.incomeStability",
                                    title:"INCOME_STABILITY",
                                    type:"string",
                                    required:"true",
                                    enumCode: "income_stability"
                                },
                                {
                                    key:"customer.utilisationOfBusinessPremises",
                                    title:"UTILIZATION_OF_BUSINESS_PREMISES ",
                                    type:"string",
                                    required:"true",
                                    enumCode: "utilisation_of_business"
                                },
                                {
                                    key:"customer.approachForTheBusinessPremises",
                                    title:"APPROACH_FOR_THE_BUSINESS_PREMISES",
                                    type:"string",
                                    required:"true",
                                    enumCode:"status_scale_2"
                                },
                                {
                                    key:"customer.safetyMeasuresForEmployees",
                                    title:"SAFETY_MEASURES_FOR_EMPLOYEES",
                                    type:"string",
                                    required:"true",
                                    enumCode: "decisionmaker"
                                },
                                {
                                    key:"customer.childLabours",
                                    title:"CHILD_LABOURERS",
                                    type:"string",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.isBusinessEffectingTheEnvironment",
                                    title:"IS_THE_BUSSINESS_IN_EFFECTING_ENVIRONMENT?",
                                    type:"string",
                                    required:"true",
                                    enumCode:"decisionmaker",
                                },
                                {
                                    key:"customer.stockMaterialManagement",
                                    title:"STOCK_MATERIAL_MANAGEMENT",
                                    type:"string",
                                    required:"true",
                                    enumCode: "status_scale_2"
                                },
                                {
                                    key:"customer.customerWalkinToBusiness",
                                    title:"CUSTOMER_WALK_IN_TO_THE_BUSINESS",
                                    condition: "model.customer.enterprise.businessType == 'Trading'",
                                    type:"string",
                                    required:"true",
                                    enumCode:"status_scale"
                                    //enumCode: "status_scale"
                                },

                            ]
                        },
                        

                        {
                            "type": "actionbox",
                            "condition": "(!model.customer.id || model.customer.currentStage=='Completed') && !(model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage=='FieldAppraisalReview' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview')",
                            "items": [/*{
                             "type": "save",
                             "title": "SAVE"
                             },*/
                                {
                                    "type": "button",
                                    "icon": "fa fa-circle-o",
                                    "title": "SUBMIT",
                                    "onClick": "actions.save(model, formCtrl, form, $event)"
                                }]
                        },
                        {
                            "type": "actionbox",
                            "condition": "(model.customer.id && model.customer.currentStage!='Completed') && !(model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage=='FieldAppraisalReview' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview')",
                            "items": [/*{
                             "type": "save",
                             "title": "SAVE"
                             },*/
                                {
                                    "type": "button",
                                    "icon": "fa fa-circle-o",
                                    "title": "SUBMIT",
                                    "onClick": "actions.save(model, formCtrl, form, $event)"
                                },
                                {
                                    "type": "submit",
                                    "title": "FINISH_ENROLMENT"
                                }
                            ]
                        }
                    ],
                    schema: function() {
                        return Enrollment.getSchema().$promise;
                    },
                    actions: {
                        setProofs:function(model){
                            model.customer.addressProofNo=model.customer.aadhaarNo;
                            model.customer.identityProofNo=model.customer.aadhaarNo;
                            model.customer.identityProof='Aadhar card';
                            model.customer.addressProof='Aadhar card';
                            model.customer.addressProofSameAsIdProof = true;
                            if (model.customer.yearOfBirth) {
                                model.customer.dateOfBirth = model.customer.yearOfBirth + '-01-01';
                            }
                        },
                        preSave: function(model, form, formName) {
                            var deferred = $q.defer();
                            if (model.customer.firstName) {
                                deferred.resolve();
                            } else {
                                PageHelper.showProgress('enrollment', 'Customer Name is required', 3000);
                                deferred.reject();
                            }
                            return deferred.promise;
                        },
                        reload: function(model, formCtrl, form, $event) {
                            $state.go("Page.Engine", {
                                pageName: 'customer.IndividualEnrollment',
                                pageId: model.customer.id
                            },{
                                reload: true,
                                inherit: false,
                                notify: true
                            });
                        },
                        save: function(model, formCtrl, form, $event){

                            formCtrl.scope.$broadcast('schemaFormValidate');

                            if (formCtrl && formCtrl.$invalid) {
                                PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                                return false;
                            }

                            if (!EnrollmentHelper.validateData(model)) {
                                $log.warn("Invalid Data, returning false");
                                return false;
                            }
                            var reqData = _.cloneDeep(model);
                            EnrollmentHelper.fixData(reqData);
                            var out = reqData.customer.$fingerprint;
                            var fpPromisesArr = [];
                            for (var key in out) {
                                if (out.hasOwnProperty(key) && out[key].data!=null) {
                                    (function(obj){
                                        var promise = Files.uploadBase64({file: obj.data, type: 'CustomerEnrollment', subType: 'FINGERPRINT', extn:'iso'}, {}).$promise;
                                        promise.then(function(data){
                                            reqData.customer[obj.table_field] = data.fileId;
                                            delete reqData.customer.$fingerprint[obj.fingerId];
                                        });
                                        fpPromisesArr.push(promise);
                                    })(out[key]);
                                } else {
                                    if (out[key].data == null){
                                        delete out[key];
                                    }
                                }
                            }

                            // $q.all start
                            $q.all(fpPromisesArr).then(function(){
                                try{
                                    // var liabilities = reqData['customer']['liabilities'];
                                    // if (liabilities && liabilities!=null && typeof liabilities.length == "number" && liabilities.length >0 ){
                                    //     for (var i=0; i<liabilities.length;i++){
                                    //         var l = liabilities[i];
                                    //         l.loanAmountInPaisa = l.loanAmountInPaisa * 100;
                                    //         l.installmentAmountInPaisa = l.installmentAmountInPaisa * 100;
                                    //     }
                                    // }

                                    // var financialAssets = reqData['customer']['financialAssets'];
                                    // if (financialAssets && financialAssets!=null && typeof financialAssets.length == "number" && financialAssets.length >0 ){
                                    //     for (var i=0; i<financialAssets.length;i++){
                                    //         var f = financialAssets[i];
                                    //         f.amountInPaisa = f.amountInPaisa * 100;
                                    //     }
                                    // }
                                } catch(e){
                                    $log.info("Error trying to change amount info.");
                                }

                                reqData.customer.verified = true;
                                if (reqData.customer.hasOwnProperty('verifications')){
                                    var verifications = reqData.customer['verifications'];
                                    for (var i=0; i<verifications.length; i++){
                                        if (verifications[i].houseNoIsVerified){
                                            verifications[i].houseNoIsVerified=1;
                                        }
                                        else{
                                            verifications[i].houseNoIsVerified=0;
                                        }
                                    }
                                }
                                try{
                                    for(var i=0;i<reqData.customer.familyMembers.length;i++){
                                        var incomes = reqData.customer.familyMembers[i].incomes;

                                        for(var j=0;j<incomes.length;j++){
                                            switch(incomes[i].frequency){
                                                case 'M': incomes[i].monthsPerYear=12; break;
                                                case 'Monthly': incomes[i].monthsPerYear=12; break;
                                                case 'D': incomes[i].monthsPerYear=365; break;
                                                case 'Daily': incomes[i].monthsPerYear=365; break;
                                                case 'W': incomes[i].monthsPerYear=52; break;
                                                case 'Weekly': incomes[i].monthsPerYear=52; break;
                                                case 'F': incomes[i].monthsPerYear=26; break;
                                                case 'Fornightly': incomes[i].monthsPerYear=26; break;
                                                case 'Fortnightly': incomes[i].monthsPerYear=26; break;
                                            }
                                        }
                                    }
                                }catch(err){
                                    console.error(err);
                                }

                                EnrollmentHelper.fixData(reqData);
                                EnrollmentHelper.saveData(reqData)
                                        .then(
                                                function(res){
                                                    PageHelper.showProgress('enrolment', 'Customer Saved.', 5000);
                                                    Utils.removeNulls(res.customer, true);
                                                    model.customer = res.customer;
                                                    if (model._bundlePageObj){
                                                        BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                                                    }
                                                },
                                                function(httpRes){
                                                    PageHelper.showProgress('enrolment', 'Oops. Some error', 5000);
                                                    PageHelper.showErrors(httpRes);
                                                }
                                        );
                            });
                        },
                        submit: function(model, form, formName){
                            var actions = this.actions;
                            $log.info("Inside submit()");
                            $log.warn(model);
                            if (!EnrollmentHelper.validateData(model)) {
                                $log.warn("Invalid Data, returning false");
                                return false;
                            }
                            var reqData = _.cloneDeep(model);
                            EnrollmentHelper.fixData(reqData);

                            var out = reqData.customer.$fingerprint;
                            var fpPromisesArr = [];
                            for (var key in out) {
                                if (out.hasOwnProperty(key) && out[key].data!=null) {
                                    (function(obj){
                                        var promise = Files.uploadBase64({file: obj.data, type: 'CustomerEnrollment', subType: 'FINGERPRINT', extn:'iso'}, {}).$promise;
                                        promise.then(function(data){
                                            reqData.customer[obj.table_field] = data.fileId;
                                            delete reqData.customer.$fingerprint[obj.fingerId];
                                        });
                                        fpPromisesArr.push(promise);
                                    })(out[key]);
                                } else {
                                    if (out[key].data == null){
                                        delete out[key];
                                    }
                                }
                            }

                            // $q.all start
                            $q.all(fpPromisesArr).then(function(){
                                try{
                                    // var liabilities = reqData['customer']['liabilities'];
                                    // if (liabilities && liabilities!=null && typeof liabilities.length == "number" && liabilities.length >0 ){
                                    //     for (var i=0; i<liabilities.length;i++){
                                    //         var l = liabilities[i];
                                    //         l.loanAmountInPaisa = l.loanAmountInPaisa * 100;
                                    //         l.installmentAmountInPaisa = l.installmentAmountInPaisa * 100;
                                    //     }
                                    // }

                                    // var financialAssets = reqData['customer']['financialAssets'];
                                    // if (financialAssets && financialAssets!=null && typeof financialAssets.length == "number" && financialAssets.length >0 ){
                                    //     for (var i=0; i<financialAssets.length;i++){
                                    //         var f = financialAssets[i];
                                    //         f.amountInPaisa = f.amountInPaisa * 100;
                                    //     }
                                    // }
                                } catch(e){
                                    $log.info("Error trying to change amount info.");
                                }

                                reqData['enrollmentAction'] = 'PROCEED';

                                reqData.customer.verified = true;
                                if (reqData.customer.hasOwnProperty('verifications')){
                                    var verifications = reqData.customer['verifications'];
                                    for (var i=0; i<verifications.length; i++){
                                        if (verifications[i].houseNoIsVerified){
                                            verifications[i].houseNoIsVerified=1;
                                        }
                                        else{
                                            verifications[i].houseNoIsVerified=0;
                                        }
                                    }
                                }
                                try{
                                    for(var i=0;i<reqData.customer.familyMembers.length;i++){
                                        var incomes = reqData.customer.familyMembers[i].incomes;

                                        for(var j=0;j<incomes.length;j++){
                                            switch(incomes[i].frequency){
                                                case 'M': incomes[i].monthsPerYear=12; break;
                                                case 'Monthly': incomes[i].monthsPerYear=12; break;
                                                case 'D': incomes[i].monthsPerYear=365; break;
                                                case 'Daily': incomes[i].monthsPerYear=365; break;
                                                case 'W': incomes[i].monthsPerYear=52; break;
                                                case 'Weekly': incomes[i].monthsPerYear=52; break;
                                                case 'F': incomes[i].monthsPerYear=26; break;
                                                case 'Fornightly': incomes[i].monthsPerYear=26; break;
                                                case 'Fortnightly': incomes[i].monthsPerYear=26; break;
                                            }
                                        }
                                    }
                                }catch(err){
                                    console.error(err);
                                }

                                EnrollmentHelper.fixData(reqData);
                                PageHelper.showProgress('enrolment', 'Updating Customer');
                                EnrollmentHelper.proceedData(reqData).then(function(resp){
                                    PageHelper.showProgress('enrolment', 'Done.', 5000);
                                    Utils.removeNulls(resp.customer,true);
                                    model.customer = resp.customer;
                                }, function(err) {
                                    PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                });
                            });
                            // $q.all end
                        }
                    }
                };
            }]);
