irf.pageCollection.factory(irf.page("demo.Selvanie"),
["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch",
function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch){

    return {
        "type": "schema-form",
        "title": "INDIVIDUAL_ENROLLMENT",
        "subTitle": "",
        "initialize":"actions.titlename(model, form, formCtrl)" ,



        "offline": "true",

        "getOfflineDisplayItem":"actions.offdisitem(item, index)",


        "form": [{
            "type": "box",
            "title": "PERSONAL_INFORMATION",
            "items": [
                {
                    "key": "customer.kgfsName",
                    "title":"BRANCH_NAME",
                    "type": "select"
                },
                {
                    "key":"customer.centreId",
                    "type":"select",
                    "filter": {
                        "parentCode": "model.branchId"
                    },
                    "parentEnumCode":"branch",
                    "screenFilter": "true"
                },
                {
                    "key": "customer.oldCustomerId",
                    "title":"CUSTOMER_ID",
                    "titleExpr":"('CUSTOMER_ID'|translate)+' (Artoo)'",
                    "condition": "model.customer.oldCustomerId",
                    "readonly": "true"
                },
                {
                    "key": "customer.id",
                    "condition": "model.customer.id",
                    "title":"CUSTOMER_ID",
                    "readonly": "true"
                },
                {
                    "key": "customer.urnNo",
                    "condition": "model.customer.urnNo",
                    "title":"URN_NO",
                    "readonly": "true"
                },
                {
                    "key":"customer.photoImageId",
                    "type":"file",
                    "fileType":"image/*"
                },
                {
                    "key": "customer.firstName",
                    "title":"FULL_NAME",
                    "type":"qrcode",
                    "onCapture":"EnrollmentHelper.customerAadhaarOnCapture"
                },
                {
                    "key":"customer.enrolledAs",
                    "type":"radios"
                },
                {
                    "key":"customer.gender",
                    "type":"radios"
                },
                {
                    "key":"customer.dateOfBirth",
                    "type":"date",
                    "onChange":"actions.DOBonchange(modelValue, form, model)"
                    
                },
                {
                    "key":"customer.age",
                    "title": "AGE",
                    "type":"number",
                    "onChange":"actions.customerage(modelValue, form, model)"

                     
                },
                {
                    "key":"customer.religion",
                    "type":"select"
                },
                {
                    "key": "customer.fatherFirstName",
                    "title": "FATHER_FULL_NAME"
                },
                {
                    "key":"customer.maritalStatus",
                    "type":"select"
                },
                {
                    "key": "customer.spouseFirstName",
                    "title": "SPOUSE_FULL_NAME",
                    "condition":"model.customer.maritalStatus==='MARRIED'",
                    "type":"qrcode",
                    "onCapture":"actions.SpoFulName(result, model, form)" 

                },
                {
                    "key":"customer.spouseAge",
                    "title": "SPOUSE_AGE",
                    "type":"number",
                    "condition":"model.customer.maritalStatus==='MARRIED'",
                    "onChange":"actions.spoage(modelValue, form, model)"                   
                },
                {
                    "key":"customer.spouseDateOfBirth",
                    "type":"date",
                    "condition":"model.customer.maritalStatus==='MARRIED'",
                    "onChange":"actions.spodate(modelValue, form, model)"

                    
                },
            ]
        },
        {
            "type": "box",
            "title": "CONTACT_INFORMATION",
            "items": [
                "customer.mobilePhone",
                "customer.landLineNo",
                {
                    "type": "fieldset",
                    "title": "CUSTOMER_RESIDENTIAL_ADDRESS",
                    "items": [
                        "customer.doorNo",
                        "customer.street",
                        "customer.locality",
                        "customer.villageName",
                        "customer.postOffice",
                        "customer.landmark",
                        {
                            "key": "customer.pincode",
                            "type": "lov",
                            "fieldType": "number",
                            "autolov": true,
                            "inputMap": {
                                "pincode": "customer.pincode",
                                "district": {
                                    "key": "customer.district"
                                },
                                "state": {
                                    "key": "customer.state"
                                }
                            },
                            "outputMap": {
                                "division": "customer.locality",
                                "region": "customer.villageName",
                                "pincode": "customer.pincode",
                                "district": "customer.district",
                                "state": "customer.state"
                            },

                            "searchHelper": "formHelper",
                            "initialize":"actions.searchhelp(inputModel)", 


                            "search":"actions.searcha(inputModel, form, model)",


                            "getListDisplayItem":"actions.getListDisplayItema(item, index)", 

                            
                            "onSelect":"actions.os(result, model, context)"
                           
                        },
                        "customer.district",
                        "customer.state",
                        "customer.mailSameAsResidence"
                    ]
                },
                {
                    "type": "fieldset",
                    "title": "CUSTOMER_PERMANENT_ADDRESS",
                    "condition":"!model.customer.mailSameAsResidence",
                    "items": [
                        "customer.mailingDoorNo",
                        "customer.mailingStreet",
                        "customer.mailingLocality",
                        "customer.mailingPostoffice",
                        "customer.mailingDistrict",
                        {
                            "key": "customer.mailingPincode",
                            "type": "lov",
                            "fieldType": "number",
                            "autolov": true,
                            "inputMap": {
                                "pincode": "customer.mailingPincode",
                                "district": {
                                    "key": "customer.mailingDistrict"
                                },
                                "state": {
                                    "key": "customer.mailingState"
                                }
                            },
                            "outputMap": {
                                "pincode": "customer.mailingPincode",
                                "district": "customer.mailingDistrict",
                                "state": "customer.mailingState"
                            },
                            "searchHelper": "formHelper",
                            "search":"actions.Searchhelp2(inputModel, form, model)",

                             
                            "getListDisplayItem":"actions.getListDisplayItem1(item, index)"                             
                        },
                        "customer.mailingState"
                    ]
                }
            ]
        },
        {
            "type":"box",
            "title":"KYC",
            "items":[
                {
                    "key": "customer.aadhaarNo",
                    "type":"qrcode",
                    "onChange":"actions.setProofs(model)",
                    
                    "onCapture":"actions.aadhaarNo1(result, model, form)" 
                },
                {
                    "type":"fieldset",
                    "title":"IDENTITY_PROOF",
                    "items":[
                        {
                            "key":"customer.identityProof",
                            "type":"select"
                        },
                        {
                            "key":"customer.identityProofImageId",
                            "type":"file",
                            "fileType":"image/*"
                        },
                        {
                            "key":"customer.identityProofReverseImageId",
                            "type":"file",
                           "fileType":"image/*"
                        },
                        {
                            "key":"customer.identityProofNo",
                            "type":"barcode",
                            "onCapture":"actions.cusidentityProofNo()",
                           
                        },
                        {
                            "key":"customer.idProofIssueDate",
                            "type":"date"
                        },
                        {
                            "key":"customer.idProofValidUptoDate",
                            "type":"date"
                        },
                        {
                            "key":"customer.addressProofSameAsIdProof"
                        }
                    ]
                },
                {
                    "type":"fieldset",
                    "title":"ADDRESS_PROOF",
                    "condition":"!model.customer.addressProofSameAsIdProof",
                    "items":[
                        {
                            "key":"customer.addressProof",
                            "type":"select"
                        },
                        {
                            "key":"customer.addressProofImageId",
                            "type":"file",
                            "fileType":"image/*"
                        },
                        {
                            "key":"customer.addressProofReverseImageId",
                            "type":"file",
                            "fileType":"image/*"
                        },
                        {
                            "key":"customer.addressProofNo",
                            "type":"barcode",


                            "onCapture": "actions.addressProofNo1(result, model, form)" 


                        },
                        {
                            "key":"customer.addressProofIssueDate",
                            "type":"date"
                        },
                        {
                            "key":"customer.addressProofValidUptoDate",
                            "type":"date"
                        },
                    ]
                },
                {
                    "type":"fieldset",
                    "title":"SPOUSE_IDENTITY_PROOF",
                    "condition":"model.customer.maritalStatus==='MARRIED'",
                    "items":[
                        {
                            "key":"customer.udf.userDefinedFieldValues.udf33",
                            "type":"select",
                            "onChange":"actions.userDefinedFieldValues1(modelValue)",
                        },
                        {
                            "key":"customer.udf.userDefinedFieldValues.udf34",
                            "type":"file",
                            "fileType":"image/*"
                        },
                        {
                            "key":"customer.udf.userDefinedFieldValues.udf35",
                            "type":"file",
                            "fileType":"image/*"
                        },
                        {
                            "key":"customer.udf.userDefinedFieldValues.udf36",
                            "condition": "model.customer.udf.userDefinedFieldValues.udf33 !== 'Aadhar card'",
                            "type":"barcode",
                            "onCapture":"actions.userDefinedFieldValues2(result, model, form)",
                        },
                        {
                            "key":"customer.udf.userDefinedFieldValues.udf36",
                            "condition": "model.customer.udf.userDefinedFieldValues.udf33 === 'Aadhar card'",
                            "type":"qrcode",
                            "onCapture":"actions.userDefinedFieldValues21(result, model, form)",                          


                            
                        }
                    ]
                }

            ]
        },
            //{
            //"type":"box",
            //"title":"ADDITIONAL_KYC",
            //"items":[
            //    {
            //        "key":"customer.additionalKYCs",
            //        "type":"array",
            //        "add":null,
            //        "remove":null,
            //        "title":"ADDITIONAL_KYC",
            //        "items":[
            //            {
            //                key:"customer.additionalKYCs[].kyc1ProofNumber",
            //                type:"barcode",
            //                onCapture: function(result, model, form) {
            //                    $log.info(result);
            //                    model.customer.additionalKYCs[form.arrayIndex].kyc1ProofNumber = result.text;
            //                }
            //
            //            },
            //            {
            //                key:"customer.additionalKYCs[].kyc1ProofType",
            //                type:"select"
            //            },
            //            {
            //                key:"customer.additionalKYCs[].kyc1ImagePath",
            //                type:"file",
            //                fileType:"image/*"
            //            },
            //            {
            //                key:"customer.additionalKYCs[].kyc1IssueDate",
            //                type:"date"
            //            },
            //            {
            //                key:"customer.additionalKYCs[].kyc1ValidUptoDate",
            //                type:"date"
            //            },
            //            {
            //                key:"customer.additionalKYCs[].kyc2ProofNumber",
            //                type:"barcode",
            //                onCapture: function(result, model, form) {
            //                    $log.info(result);
            //                    model.customer.additionalKYCs[form.arrayIndex].kyc2ProofNumber = result.text;
            //                }
            //            },
            //            {
            //                key:"customer.additionalKYCs[].kyc2ProofType",
            //                type:"select"
            //            },
            //            {
            //                key:"customer.additionalKYCs[].kyc2ImagePath",
            //                type:"file",
            //                fileType:"image/*"
            //            },
            //            {
            //                key:"customer.additionalKYCs[].kyc2IssueDate",
            //                type:"date"
            //            },
            //            {
            //                key:"customer.additionalKYCs[].kyc2ValidUptoDate",
            //                type:"date"
            //            }
            //        ]
            //    }
            //]
            //},
        {
                "type": "box",
                "title": "T_FAMILY_DETAILS",
                "items": [{
                    "key":"customer.familyMembers",
                    "type":"array",
                    "startEmpty": "true",
                    "items": [
                        {
                            "key":"customer.familyMembers[].relationShip",
                            "type":"select",
                            "onChange":"actions.familyMembers1(modelValue, form, model, formCtrl, event)",
                            "title": "T_RELATIONSHIP"
                        },
                        {
                            "key":"customer.familyMembers[].customerId",
                            "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                            "type":"lov",
                            "inputMap": {
                                "firstName": {
                                    "key": "customer.firstName",
                                    "title": "CUSTOMER_NAME"
                                },
                                "branchName": {
                                    "key": "customer.kgfsName",
                                    "type": "select"
                                },
                                "centreCode": {
                                    "key": "customer.centreCode",
                                    "type": "select"
                                }
                            },
                            "outputMap": {
                                "id": "customer.familyMembers[arrayIndex].customerId",
                                "firstName": "customer.familyMembers[arrayIndex].familyMemberFirstName"

                            },
                            "searchHelper": "formHelper",
                            "search":"actions.searchfromhelper(inputModel, form)",


                             
                            "getListDisplayItem":"actions.gldi(data, index)"


                            
                        },
                        {
                            "key":"customer.familyMembers[].familyMemberFirstName",
                            "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                            "title":"FAMILY_MEMBER_FULL_NAME"
                        },
                        {
                            "key": "customer.familyMembers[].gender",
                            "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                            "type": "radios",
                            "title": "T_GENDER"
                        },
                        {
                            "key":"customer.familyMembers[].age",
                            "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                            "title": "AGE",
                            "type":"number",
                            "onChange":"actions.fmage(modelValue, form, model, formCtrl, event)"

                           
                        },
                        {
                            "key": "customer.familyMembers[].dateOfBirth",
                            "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                            "type":"date",
                            "title": "T_DATEOFBIRTH",
                            "onChange":"actions.fmdob(modelValue, form, model, formCtrl, event)",


                        },
                        {
                            "key":"customer.familyMembers[].educationStatus",
                            "type":"select",
                            "title": "T_EDUCATION_STATUS"
                        },
                        {
                            "key":"customer.familyMembers[].maritalStatus",
                            "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'",
                            "type":"select",
                            "title": "T_MARITAL_STATUS"
                        },
                        {
                            "key": "customer.familyMembers[].mobilePhone",
                            "condition": "model.customer.familyMembers[arrayIndex].relationShip.toLowerCase() !== 'self'"
                        },
                        {
                            "key":"customer.familyMembers[].healthStatus",
                            "type":"radios",
                            "titleMap":{
                                "GOOD":"GOOD",
                                "BAD":"BAD"
                            },

                        },
                        {
                            "key":"customer.familyMembers[].incomes",
                            "type":"array",
                            "startEmpty": true,
                            "items":[
                                {
                                    "key": "customer.familyMembers[].incomes[].incomeSource",
                                    "type":"select"
                                },
                                "customer.familyMembers[].incomes[].incomeEarned",
                                {
                                    "key": "customer.familyMembers[].incomes[].frequency",
                                    "type": "select"
                                }

                            ]

                        }
                    ]
                }]
            },
            //{
            //    "type": "box",
            //    "title": "EXPENDITURES",
            //    "items": [{
            //        key:"customer.expenditures",
            //        type:"array",
            //        startEmpty: true,
            //        // remove: null,
            //        // view: "fixed",
            //        titleExpr: "model.customer.expenditures[arrayIndex].expenditureSource | translate",
            //        items:[{
            //            type: 'section',
            //            htmlClass: 'row',
            //            items: [{
            //                type: 'section',
            //                htmlClass: 'col-xs-6',
            //                items: [{
            //                    key:"customer.expenditures[].frequency",
            //                    type:"select",
            //                    notitle: true
            //                }]
            //            },{
            //                type: 'section',
            //                htmlClass: 'col-xs-6',
            //                items: [{
            //                    key: "customer.expenditures[].annualExpenses",
            //                    type:"amount",
            //                    notitle: true
            //                }]
            //            }]
            //        }]
            //    }]
            //},
            //{
            //    "type":"box",
            //    "title":"BUSINESS_OCCUPATION_DETAILS",
            //    "items":[
            //        {
            //            key:"customer.udf.userDefinedFieldValues.udf13",
            //            type:"select"
            //
            //
            //        },
            //        {
            //            type:"fieldset",
            //            condition:"model.customer.udf.userDefinedFieldValues.udf13=='Business' || model.customer.udf.userDefinedFieldValues.udf13=='Employed'",
            //            items:[
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf14",
            //                    type:"select"
            //
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf7"
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf22"
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf8"
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf9"
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf10"
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf11"
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf12"
            //                },
            //
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf23",
            //                    type:"radios"
            //                },
            //
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf17"
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf16",
            //                    type:"select"
            //                },
            //
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf18",
            //                    type:"select"
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf19",
            //                    type:"radios"
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf20",
            //                    type:"select"
            //
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf21",
            //                    condition:"model.customer.udf.userDefinedFieldValues.udf20=='OTHERS'"
            //                }
            //            ]
            //        },
            //        {
            //            type:"fieldset",
            //            condition:"model.customer.udf.userDefinedFieldValues.udf13=='Agriculture'",
            //            title:"AGRICULTURE_DETAILS",
            //            items:[
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf24",
            //                    type:"select"
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf25",
            //                    type:"select"
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf15"
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf26"
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf27",
            //                    type:"select"
            //
            //                },
            //                {
            //                    key:"customer.udf.userDefinedFieldValues.udf28"
            //                }
            //            ]
            //        }
            //
            //    ]
            //},
            //{
            //    "type": "box",
            //    "title": "T_ASSETS",
            //    "items": [
            //        {
            //            key: "customer.physicalAssets",
            //            type: "array",
            //            startEmpty: true,
            //            items: [
            //                {
            //                    key:"customer.physicalAssets[].ownedAssetDetails",
            //                    type:"select"
            //
            //                },
            //                "customer.physicalAssets[].numberOfOwnedAsset",
            //                {
            //                    key:"customer.physicalAssets[].ownedAssetValue",
            //                }
            //            ]
            //        },
            //        {
            //            key: "customer.financialAssets",
            //            title:"FINANCIAL_ASSETS",
            //            type: "array",
            //            startEmpty: true,
            //            items: [
            //                {
            //                    key:"customer.financialAssets[].instrumentType",
            //                    type:"select"
            //                },
            //                "customer.financialAssets[].nameOfInstitution",
            //                {
            //                    key:"customer.financialAssets[].instituteType",
            //                    type:"select"
            //                },
            //                {
            //                    key: "customer.financialAssets[].amountInPaisa",
            //                    type: "amount"
            //                },
            //                {
            //                    key:"customer.financialAssets[].frequencyOfDeposite",
            //                    type:"select"
            //                },
            //                {
            //                    key:"customer.financialAssets[].startDate",
            //                    type:"date"
            //                },
            //                {
            //                    key:"customer.financialAssets[].maturityDate",
            //                    type:"date"
            //                }
            //            ]
            //        }]
            //
            //},
            //{
            //    type:"box",
            //    title:"T_LIABILITIES",
            //    items:[
            //        {
            //            key:"customer.liabilities",
            //            type:"array",
            //            startEmpty: true,
            //            title:"FINANCIAL_LIABILITIES",
            //            items:[
            //                {
            //                    key:"customer.liabilities[].loanType",
            //                    type:"select"
            //                },
            //                {
            //                    key:"customer.liabilities[].loanSource",
            //                    type:"select"
            //                },
            //                "customer.liabilities[].instituteName",
            //                {
            //                    key: "customer.liabilities[].loanAmountInPaisa",
            //                    type: "amount"
            //                },
            //                {
            //                    key: "customer.liabilities[].installmentAmountInPaisa",
            //                    type: "amount"
            //                },
            //                {
            //                    key: "customer.liabilities[].startDate",
            //                    type:"date"
            //                },
            //                {
            //                    key:"customer.liabilities[].maturityDate",
            //                    type:"date"
            //                },
            //                {
            //                    key:"customer.liabilities[].frequencyOfInstallment",
            //                    type:"select"
            //                },
            //                {
            //                    key:"customer.liabilities[].liabilityLoanPurpose",
            //                    type:"select"
            //                }
            //
            //            ]
            //        }
            //    ]
            //},
            //{
            //    "type": "box",
            //    "title": "BIOMETRIC",
            //    "items": [
            //        {
            //            type: "button",
            //            title: "CAPTURE_FINGERPRINT",
            //            notitle: true,
            //            fieldHtmlClass: "btn-block",
            //            onClick: function(model, form, formName){
            //                var promise = BiometricService.capture(model);
            //                promise.then(function(data){
            //                    model.customer.$fingerprint = data;
            //                }, function(reason){
            //                    console.log(reason);
            //                })
            //            }
            //        },
            //        {
            //            "type": "section",
            //            "html": '<div class="row"> <div class="col-xs-6">' +
            //            '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftThumb\')"></i> {{ model.getFingerLabel(\'LeftThumb\') }}</span><br>' +
            //            '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftIndex\')"></i> {{ model.getFingerLabel(\'LeftIndex\') }}</span><br>' +
            //            '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftMiddle\')"></i> {{ model.getFingerLabel(\'LeftMiddle\') }}</span><br>' +
            //            '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftRing\')"></i> {{ model.getFingerLabel(\'LeftRing\') }}</span><br>' +
            //            '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftLittle\')"></i> {{ model.getFingerLabel(\'LeftLittle\') }}</span><br>' +
            //            '</div> <div class="col-xs-6">' +
            //            '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightThumb\')"></i> {{ model.getFingerLabel(\'RightThumb\') }}</span><br>' +
            //            '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightIndex\')"></i> {{ model.getFingerLabel(\'RightIndex\') }}</span><br>' +
            //            '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightMiddle\')"></i> {{ model.getFingerLabel(\'RightMiddle\') }}</span><br>' +
            //            '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightRing\')"></i> {{ model.getFingerLabel(\'RightRing\') }}</span><br>' +
            //            '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightLittle\')"></i> {{ model.getFingerLabel(\'RightLittle\') }}</span><br>' +
            //            '</div></div>'
            //        }
            //    ]
            //},
            {
                "type": "box",
                "title": "T_HOUSE_VERIFICATION",
                "items": [
                    //{
                    //    "key": "customer.firstName",
                    //    "title": "CUSTOMER_NAME",
                    //    "readonly": true
                    //},
                    //{
                    //    key:"customer.nameInLocalLanguage"
                    //},
                    //{
                    //    key:"customer.addressInLocalLanguage",
                    //    type:"textarea"
                    //},


                    //{
                    //    key:"customer.caste",
                    //    type:"select"
                    //},
                    //{
                    //    key:"customer.language",
                    //    type:"select"
                    //},
                    {
                        "type":"fieldset",
                        "title":"HOUSE_DETAILS",
                        "items":[
                            {
                                "key":"customer.ownership",
                                "type":"select"
                            },
                            {
                                "key":"customer.udf.userDefinedFieldValues.udf29", // customer.inCurrentAddressSince
                                "type": "select"
                            },
                            {
                                "key":"customer.udf.userDefinedFieldValues.udf30", // customer.inCurrentAreaSince
                                "type":"select"
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
                       "key": "customer.nameOfRo",
                       "readonly": "true"
                    },
                    {
                       "key":"customer.houseVerificationPhoto",
                       "type":"file",
                       "fileType":"image/*"
                    },
                    {
                       "key": "customer.date",
                       "type":"date"
                    },
                    "customer.place"
                ]
            },
            {
                "type": "box",
                "title": "CUSTOMER_BANK_ACCOUNTS",
                "items": [
                    {
                        "key": "customer.customerBankAccounts",
                        "type": "array",
                        "title": "BANK_ACCOUNTS",
                        "startEmpty": "true",
                        "items": [
                            {
                                "key": "customer.customerBankAccounts[].ifscCode",
                                "type": "lov",
                                "lovonly": "true",
                                "inputMap": {
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
                                "outputMap": {
                                    "bankName": "customer.customerBankAccounts[arrayIndex].customerBankName",
                                    "branchName": "customer.customerBankAccounts[arrayIndex].customerBankBranchName",
                                    "ifscCode": "customer.customerBankAccounts[arrayIndex].ifscCode"
                                },
                                "searchHelper": "formHelper",
                                "search":"actions.ser1(inputModel, form)",


                                
                                "getListDisplayItem":"gldi2(data, index)", 


                                
                            },
                            {
                                "key": "customer.customerBankAccounts[].customerBankName",
                                "readonly": "true"
                            },
                            {
                                "key": "customer.customerBankAccounts[].customerBankBranchName",
                                "readonly": "true"
                            },
                            {
                                "key": "customer.customerBankAccounts[].customerName"
                            },
                            {
                                "key": "customer.customerBankAccounts[].accountNumber"
                            },
                            {
                                "key": "customer.customerBankAccounts[].accountType",
                                "type": "select"
                            },
                            {
                                "key": "customer.customerBankAccounts[].isDisbersementAccount",
                                "type": "radios",
                                "titleMap": [{
                                    "value": "true",
                                    "name": "Yes"
                                },{
                                    "value": "false",
                                    "name": "No"
                                }]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "actionbox",
                "condition": "!model.customer.id",
                "items": [{
                    "type": "save",
                    "title": "SAVE"
                },{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            },
            {
                "type": "actionbox",
                "condition": "model.customer.id",
                "items": [{
                    "type": "save",
                    "title": "SAVE"
                },{
                    "type": "submit",
                    "title": "SUBMIT"
                },{
                    "type": "button",
                    "title": "RELOAD",
                    "icon": "fa fa-refresh",
                    "onClick": "actions.reload(model, formCtrl, form, $event)"
                }]
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
            ser1: function(inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = CustomerBankBranch.search({
                                        'bankName': inputModel.bankName,
                                        'ifscCode': inputModel.ifscCode,
                                        'branchName': inputModel.branchName
                                    }).$promise;
                                    return promise;
                                },

            fmdob:function(modelValue, form, model, formCtrl, event)
                            {
                                if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                    model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            },


fmage:function(modelValue, form, model, formCtrl, event) {
                                if (model.customer.familyMembers[form.arrayIndex].age > 0) {
                                    if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-') + moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                    } else {
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-MM-DD');
                                    }
                                }
                            },
gldi:function(data, index) 
                            {
                                return [
                                    [data.firstName, data.fatherFirstName].join(' '),
                                    data.id
                                ];
                            },


            searchfromhelper:function(inputModel, form) {
                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var promise = Enrollment.search({
                                    'branchName': SessionStore.getBranch() || inputModel.branchName,
                                    'firstName': inputModel.first_name,
                                }).$promise;
                                return promise;
                            },

            familyMembers1: function(modelValue, form, model, formCtrl, event)
                            {
                                if (modelValue && modelValue.toLowerCase() === 'self') 
                                {
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
                                } else if (modelValue && modelValue.toLowerCase() === 'spouse')
                                 {
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
            userDefinedFieldValues21:function(result, model, form) 
                            {
                                $log.info(result); // spouse id proof
                                var aadhaarData = EnrollmentHelper.parseAadhaar(result.text);
                                $log.info(aadhaarData);
                                model.customer.udf.userDefinedFieldValues.udf36 = aadhaarData.uid;
                                model.customer.spouseFirstName = aadhaarData.name;
                                if (aadhaarData.yob)
                                 {
                                    model.customer.spouseDateOfBirth = aadhaarData.yob + '-01-01';
                                    model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            },
            userDefinedFieldValues2:function(result, model, form)
                             {
                                $log.info(result); // spouse id proof
                                model.customer.udf.userDefinedFieldValues.udf36 = result.text;
                            },
            userDefinedFieldValues1:function(modelValue)
                            {
                                $log.info(modelValue);
                            },
            addressProofNo1:function(result, model, form) {
                                $log.info(result);
                                model.customer.addressProofNo = result.text;
                            },
            cusidentityProofNo: function(result, model, form) {
                                $log.info(result);
                                model.customer.identityProofNo = result.text;
                            },
            aadhaarNo1:function(result, model, form) {
                        EnrollmentHelper.customerAadhaarOnCapture(result, model, form);
                        this.actions.setProofs(model);
                    },


            getListDisplayItem1:function(item, index) {
                                return [
                                    item.pincode,
                                    item.district + ', ' + item.state
                                ];
                            },
            Searchhelp2:function(inputModel, form, model) 
            {
                                return Queries.searchPincodes(
                                    inputModel.pincode,
                                    inputModel.district,
                                    inputModel.state
                                );
                            },
            os: function(result, model, context) {
                                $log.info(result);
                            },
            getListDisplayItema:function(item, index) 
                            {
                                return [
                                    item.division + ', ' + item.region,
                                    item.pincode,
                                    item.district + ', ' + item.state
                                ];
                            },
            searcha: function(inputModel, form, model)
                            {
                                return Queries.searchPincodes(
                                    inputModel.pincode,
                                    inputModel.district,
                                    inputModel.state
                                );
                            },
            searchhelp:function(inputModel) 
                            {
                                $log.warn('in pincode initialize');
                                $log.info(inputModel);
                            },
            spodate:function(modelValue, form, model)
                    {
                        if (model.customer.spouseDateOfBirth)
                        {
                            model.customer.spouseAge = moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    },
            spoage: function(modelValue, form, model)
                    {
                        if (model.customer.spouseAge > 0) 
                        {
                            if (model.customer.spouseDateOfBirth)
                            {
                                model.customer.spouseDateOfBirth = moment(new Date()).subtract(model.customer.spouseAge, 'years').format('YYYY-') + moment(model.customer.spouseDateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                            } 
                            else
                            {
                                model.customer.spouseDateOfBirth = moment(new Date()).subtract(model.customer.spouseAge, 'years').format('YYYY-MM-DD');
                            }
                        }
                    },
            SpoFulName:function(result, model, form)
                    {
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
                    },
        offdisitem:function(item, index)
        {
            return [
                item.customer.urnNo,
                Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                item.customer.villageName
            ]
        },
        titlename: function (model, form, formCtrl) 
        {
            model.customer = model.customer || {};
            //model.branchId = SessionStore.getBranchId() + '';

            model.customer.date = model.customer.date || Utils.getCurrentDate();
            model.customer.nameOfRo = model.customer.nameOfRo || SessionStore.getLoginname();

            model = Utils.removeNulls(model,true);
            //model.customer.kgfsName = SessionStore.getBranch();
            model.customer.customerType = 'Individual';
        },
            customerage:function(modelValue, form, model) {
                        if (model.customer.age > 0) {
                            if (model.customer.dateOfBirth) {
                                model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-') + moment(model.customer.dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                            } else {
                                model.customer.dateOfBirth = moment(new Date()).subtract(model.customer.age, 'years').format('YYYY-MM-DD');
                            }
                        }
                    },

            DOBonchange: function(modelValue, form, model)
                     {
                        if (model.customer.dateOfBirth)
                        {
                            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    },
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
                        var liabilities = reqData['customer']['liabilities'];
                        if (liabilities && liabilities!=null && typeof liabilities.length == "number" && liabilities.length >0 ){
                            for (var i=0; i<liabilities.length;i++){
                                var l = liabilities[i];
                                l.loanAmountInPaisa = l.loanAmountInPaisa * 100;
                                l.installmentAmountInPaisa = l.installmentAmountInPaisa * 100;
                            }
                        }

                        var financialAssets = reqData['customer']['financialAssets'];
                        if (financialAssets && financialAssets!=null && typeof financialAssets.length == "number" && financialAssets.length >0 ){
                            for (var i=0; i<financialAssets.length;i++){
                                var f = financialAssets[i];
                                f.amountInPaisa = f.amountInPaisa * 100;
                            }
                        }
                    } catch(e){
                        $log.info("Error trying to change amount info.");
                    }

                    reqData['enrollmentAction'] = 'PROCEED';

                    irfProgressMessage.pop('enrollment-submit', 'Working... Please wait.', 5000);

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
                    if (reqData.customer.id) {
                        EnrollmentHelper.proceedData(reqData).then(function(resp){
                            // Utils.removeNulls(resp.customer,true);
                            // model.customer = resp.customer;
                            $state.go('Page.Landing', null);
                        });
                    } else {
                        EnrollmentHelper.saveData(reqData).then(function(res){
                            EnrollmentHelper.proceedData(res).then(function(resp){
                                // Utils.removeNulls(resp.customer,true);
                                // model.customer = resp.customer;
                                $state.go('Page.Landing', null);
                            }, function(err) {
                                Utils.removeNulls(res.customer,true);
                                model.customer = res.customer;
                            });
                        });
                    }
                });
                // $q.all end
            }
        }
    };
}]);
