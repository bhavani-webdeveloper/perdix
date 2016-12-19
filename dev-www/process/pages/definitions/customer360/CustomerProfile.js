irf.pageCollection.factory(irf.page("customer360.CustomerProfile"),
["$log", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch",
function($log, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch){

    var branch = SessionStore.getBranch();

    var initData = function(model) {
        model.customer.idAndBcCustId = model.customer.id + ' / ' + model.customer.bcCustId;
        model.customer.fullName = Utils.getFullName(model.customer.firstName, model.customer.middleName, model.customer.lastName);
        model.customer.fatherFullName = Utils.getFullName(model.customer.fatherFirstName, model.customer.fatherMiddleName, model.customer.fatherLastName);
        model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
    };

    return {
        "type": "schema-form",
        "title": "PROFILE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            var self = this;
            self.form = [];
            PagesDefinition.setReadOnlyByRole("Page/Engine/customer360.CustomerProfile", self.formSource).then(function(form){
                self.form = form;
            });
            initData(model);
        },
        modelPromise: function(pageId, _model) {
            if (!_model || !_model.customer || _model.customer.id != pageId) {
                $log.info("data not there, loading...");

                var deferred = $q.defer();
                PageHelper.showLoader();
                Enrollment.getCustomerById({id:pageId},function(resp,header){
                    var model = {$$OFFLINE_FILES$$:_model.$$OFFLINE_FILES$$};
                    model.customer = resp;
                    model = EnrollmentHelper.fixData(model);
                    if (model.customer.currentStage==='BasicEnrollment') {
                        irfProgressMessage.pop("enrollment-save","Customer "+model.customer.id+" not enrolled yet", 5000);
                        $state.go("Page.Engine", {pageName:'ProfileInformation', pageId:pageId});
                    } else {
                        irfProgressMessage.pop("enrollment-save","Load Complete", 2000);
                        initData(model);
                        deferred.resolve(model);
                    }
                    PageHelper.hideLoader();
                },function(resp){
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("enrollment-save","An Error Occurred. Failed to fetch Data",5000);
                    $state.go("Page.Engine",{
                        pageName:"CustomerSearch",
                        pageId:null
                    });
                });
                return deferred.promise;
            }
        },
        form: [],
        formSource: [
            {
                "type":"box",
                "title":"KYC",
                "items":[
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
                "type": "box",
                "title": "T_FAMILY_DETAILS",
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
                type:"box",
                title:"HOUSEHOLD_LIABILITIES",
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
                "type": "box",
                "title": "T_HOUSE_VERIFICATION",
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
                type: "box",
                title: "BANK_ACCOUNTS",
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
                                title: "SANCTIONED_AMOUNT",
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
                                        title: "BALANCE_AS_ON_15TH"
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
                "type": "box",
                "title": "REFERENCES",
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
                                enumCode: "business_reference_type"
                            },
                             {
                                key:"customer.verifications[].businessName",
                                title:"BUSINESS_NAME",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].referenceFirstName",
                                title:"FULL_NAME_OF_POC",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].mobileNo",
                                title:"MOBILE_NO",
                                type:"number"
                            },
                            {
                                key:"customer.verifications[].businessSector",
                                title:"BUSINESS_SECTOR",
                                type:"select",
                                enumCode: "businessSector"
                            },
                            {
                                key:"customer.verifications[].businessSubSector",
                                title:"BUSINESS_SUBSECTOR",
                                type:"select",
                                enumCode: "businessSubSector",
                                parentEnumCode: "businessSector"
                            },
                            {
                                key:"customer.verifications[].selfReportedIncome",
                                title:"SELF_REPORTED_INCOME",
                                type:"number"
                            },

                         ] 
                    },
                ]
            },
            {
                type: "box",
                title: "PROXY_INDICATORS",
                readonly: true,
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
                        enumCode: "status_scale"
                    },
                    {
                        key:"customer.approachForTheBusinessPremises",
                        title:"APPROACH_FOR_THE_BUSINESS_PREMISES",
                        type:"radios",
                        required:"true",
                        enumCode:"connectivity_status "
                    },
                    {
                        key:"customer.safetyMeasuresForEmployees",
                        title:"SAFETY_MEASURES_FOR_EMPLOYEES",
                        type:"radios",
                        required:"true",
                        enumCode: "status_scale"
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
                        enumCode: "status_scale"
                    },

                ]
            },
            {
                type:"box",
                title:"PHYSICAL_ASSETS",
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
                "type": "actionbox",
                "readonly": true,
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }
        ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                Utils.confirm("Update - Are You Sure?", "Customer Profile").then(function() {
                    PageHelper.showLoader();
                    irfProgressMessage.pop('PROFILE', 'Working...');
                    model.enrollmentAction = "PROCEED";
                    $log.info(model);
                    var reqData = _.cloneDeep(model);
                    Enrollment.updateEnrollment(reqData, function (res, headers) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('PROFILE', 'Done. Customer Updated, ID : ' + res.customer.id, 2000);
                    }, function (res, headers) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('PROFILE', 'Oops. Some error.', 2000);
                        window.scrollTo(0, 0);
                        PageHelper.showErrors(res);
                    })

                });
            }
        }
    };
}]);
