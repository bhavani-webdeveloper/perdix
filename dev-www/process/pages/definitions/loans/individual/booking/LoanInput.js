irf.pageCollection.factory(irf.page("loans.individual.booking.LoanInput"),
    ["$log","SessionStore","$state", "$stateParams", "SchemaResource","PageHelper","Enrollment","formHelper","IndividualLoan",
        "Utils",
    function($log, SessionStore,$state,$stateParams, SchemaResource,PageHelper,Enrollment,formHelper,IndividualLoan,Utils){

        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Loan Input",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {

                model.loanAccount = {branchId :branchId};
                model.additional = {branchName : branchName};
                model.loanAccount.disbursementSchedules=[];
                model.loanAccount.collateral=[{quantity:1}];
                model.loanAccount.guarantors=[{guaFirstName:""}];
                model.loanAccount.loanApplicationDate = Utils.getCurrentDate();
                model.loanAccount.commercialCibilCharge = 750;
                console.log(model);
            },
            offline: false,
            getOfflineDisplayItem: function(item, index){

            },
            form: [{
                "type": "box",
                "title": "LOAN_INPUT",
                "colClass": "col-sm-6",

                "items":[
                    {
                        "type": "fieldset",
                        "title": "PRODUCT_DETAILS",


                        "items": [
                            {
                                "key": "loanAccount.branchId",
                                "readonly":true
                            },
                            {
                                "key": "additional.branchName",
                                "readonly":true
                            },
                            {
                                "key": "additional.entityId",

                            },
                            {
                                "key": "additional.entityName",

                            },
                            {
                                "key": "loanAccount.partnerCode",
                                "title": "PARTNER",
                                "type": "select"
                            },
                            {
                                "key": "loanAccount.productCode",
                                "title": "PRODUCT",
                                "type": "select"
                            },
                            {
                                key:"loanAccount.loanCentre.centreId",
                                type:"text",
                                title:"CENTRE_ID",
                                filter: {
                                    "parentCode as branch": "model.branchId"
                                },
                                screenFilter: true
                            },

                            {
                                "key": "loanAccount.tenure",
                                "title":"TENURE_IN_MONTHS"
                            },
                            {
                                "key": "loanAccount.frequency",
                                "type":"select"
                            },

                        ]
                    },
                    {
                        "type": "fieldset",
                        "title": "CUSTOMER_DETAILS",
                        "items": [
                            {
                                "key": "loanAccount.urnNo",
                                "title": "URN_NO",
                                "type":"lov",
                                "inputMap": {
                                    "customerId":{
                                        "key":"customer.customerId",
                                        "title":"CUSTOMER_ID"
                                    },
                                    "firstName": {
                                        "key": "customer.firstName",
                                        "title": "CUSTOMER_NAME"
                                    },
                                    "branch": {
                                        "key": "customer.branch",
                                        "type": "select",
                                        "screenFilter": true
                                    },
                                    "centreCode": {
                                        "key": "customer.centreCode",
                                        "type": "select",
                                        "screenFilter": true
                                    }
                                },
                                "outputMap": {
                                    "id": "loanAccount.customerId",
                                    "urnNo": "loanAccount.urnNo",
                                    "firstName":"customer.firstName",
                                    "fatherFirstName":"loanAccount.husbandOrFatherFirstName",
                                    "fatherMiddleName":"loanAccount.husbandOrFatherMiddleName",
                                    "fatherLastName":"loanAccount.husbandOrFatherLastName"
                                },
                                "searchHelper": formHelper,
                                "search": function(inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Enrollment.search({
                                        'customerId':inputModel.customerId,
                                        'branchName': inputModel.branch ||SessionStore.getBranch(),
                                        'firstName': inputModel.first_name,
                                        'centreCode':inputModel.centreCode
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        [data.firstName, data.fatherFirstName].join(' | '),
                                        data.id,
                                        data.urnNo
                                    ];
                                }
                            },
                            {
                                "key":"loanAccount.customerId",
                                "title":"CUSTOMER_ID"
                            },
                            {
                                "key": "customer.firstName",
                                "title": "CUSTOMER_NAME"
                            },

                            {
                                "key": "loanAccount.coBorrowerUrnNo",
                                "title": "CO_APPLICANT_URN_NO",
                                "type":"lov",
                                "inputMap": {
                                    "customerId":{
                                        "key":"customer.customerId",
                                        "title":"CUSTOMER_ID"
                                    },
                                    "firstName": {
                                        "key": "customer.firstName",
                                        "title": "CUSTOMER_NAME"
                                    },
                                    "branch": {
                                        "key": "customer.branch",
                                        "type": "select",
                                        "screenFilter": true
                                    },
                                    "centreCode": {
                                        "key": "customer.centreCode",
                                        "type": "select",
                                        "screenFilter": true
                                    }
                                },
                                "outputMap": {

                                    "urnNo": "loanAccount.coBorrowerUrnNo",
                                    "firstName":"customer.coBorrowerName"
                                },
                                "searchHelper": formHelper,
                                "search": function(inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Enrollment.search({
                                        'customerId':inputModel.customerId,
                                        'branchName': inputModel.branch ||SessionStore.getBranch(),
                                        'firstName': inputModel.first_name,
                                        'centreCode':inputModel.centreCode
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        [data.firstName, data.fatherFirstName].join(' | '),
                                        data.id,
                                        data.urnNo
                                    ];
                                }
                            },
                            {
                                "key":"customer.coBorrowerName",
                                "title":"CO_APPLICANT_NAME"
                            }


                        ]
                    },

                    {
                        "type": "fieldset",
                        "title": "Account Details",
                        "items": [

                            {
                                "key": "loanAccount.loanAmountRequested",
                                "type":"amount",
                                "title":"LOAN_AMOUNT_REQUESTED",
                                "onChange":function(value,form,model){

                                    model.loanAccount.insuranceFee = 0.004*value;


                                }
                            },
                            {
                                key:"additional.processingFeeMultiplier",

                                title:"PROCESSING_FEE_MULTIPLIER",
                                onChange:function(value,form,model){
                                    model.loanAccount.processingFeeInPaisa = value*model.loanAccount.loanAmountRequested*100;



                                }
                            },
                            {
                                key:"loanAccount.processingFeeInPaisa",
                                type:"amount",
                                title:"PROCESSING_FEE_IN_PAISA"
                            },
                            {
                                key:"loanAccount.insuranceFee",
                                type:"amount"
                            },
                            {
                                key:"loanAccount.commercialCibilCharge",
                                type:"amount"
                            },
                            {
                                key:"loanAccount.securityEmi",
                                type:"amount"
                            },
                            {
                                key:"loanAccount.otherFee",
                                type:"amount"
                            },
                            {
                                "key": "loanAccount.loanAmount",
                                "type":"amount",
                                "title":"SANCTIONED_AMOUNT"
                            },
                            {
                                "key":"loanAccount.interestRate"

                            },
                            {
                                "key": "loanAccount.loanApplicationDate",
                                "title": "LOAN_APPLICATION_DATE",
                                "type":"date"
                            },
                            {
                                "key": "loanAccount.loanPurpose1",
                                "title": "LOAN_PURPOSE_1",
                                "type":"select"
                            },
                            {
                                "key": "loanAccount.loanPurpose2",
                                "title": "LOAN_PURPOSE_2",
                                "type":"select",
                                "filter":{
                                    "parentCode as loan_purpose_1":"model.loanAccount.loanPurpose1"
                                }
                            },
                            {
                                "key": "loanAccount.loanPurpose3",
                                "title": "LOAN_PURPOSE_3",
                                "type":"select",
                                "filter":{
                                    "parentCode as loan_purpose_2":"model.loanAccount.loanPurpose2"
                                }

                            }
                        ]
                    }



                ]
            },{
                "type":"box",
                "title":"COLLATERAL",
                "items":[
                    {
                        "key":"loanAccount.collateral",
                        "title":"COLLATERAL",
                        "type":"array",
                        "add":null,
                        "remove":null,
                        "items":[
                            {
                                "key":"loanAccount.collateral[].collateralType",
                                "type":"select"

                                
                            },
                            {
                                "key":"loanAccount.collateral[].collateralDescription"
                            },
                            {
                                "key":"loanAccount.collateral[].manufacturer"
                            },
                            {
                                "key":"loanAccount.collateral[].quantity"
                            },
                            {
                                "key":"loanAccount.collateral[].modelNo"
                            },
                            {
                                "key":"loanAccount.collateral[].machineOld"
                            },
                            {
                                "key":"loanAccount.collateral[].collateralValue",
                                "type":"amount",
                                "title":"COLLATERAL_VALUE"
                            },
                            {
                                "key":"loanAccount.collateral[].totalValue",
                                "type":"amount",
                                "title":"TOTAL_VALUE"
                            },
                            {
                                "key":"loanAccount.collateral[].marginValue",
                                "type":"amount",
                                "title":"PURCHASE_PRICE"
                            },
                            {
                                "key":"loanAccount.collateral[].loanToValue",
                                "type":"amount",
                                "title":"PRESENT_VALUE"
                            },
                            {
                                "key":"loanAccount.collateral[].collateral1FilePath",
                                "type":"file",
                                "title":"DOCUMENT_1"
                            },
                            {
                                "key":"loanAccount.collateral[].collateral2FilePath",
                                "type":"file",
                                "title":"DOCUMENT_2"
                            },
                            {
                                "key":"loanAccount.collateral[].collateral3FilePath",
                                "type":"file",
                                "title":"DOCUMENT_3"
                            },
                            {
                                "key":"loanAccount.collateral[].photoFilePath",
                                "type":"file",
                                "fileType":"image/*",
                                "title":"PHOTO"
                            }
                            
                            
                        ]
                    }
                ]
            },
                {
                "type": "box",
                "title": "",
                "items":[
                    {
                        "type":"fieldset",
                        "title":"GUARANTOR",
                        "items":[
                            {
                                key:"loanAccount.guarantors",
                                title:"GUARANTOR",
                                type:"array",
                                add:null,
                                remove:null,
                                items:[
                                    {
                                        "key": "loanAccount.guarantors[].guaUrnNo",
                                        "title": "URN_NO",
                                        "type":"lov",
                                        "inputMap": {
                                            "customerId":{
                                                "key":"customer.customerId",
                                                "title":"CUSTOMER_ID"
                                            },
                                            "firstName": {
                                                "key": "customer.firstName",
                                                "title": "CUSTOMER_NAME"
                                            },
                                            "branch": {
                                                "key": "customer.branch",
                                                "type": "select",
                                                "screenFilter": true
                                            },
                                            "centreCode": {
                                                "key": "customer.centreCode",
                                                "type": "select",
                                                "screenFilter": true
                                            }
                                        },
                                        "outputMap": {

                                            "urnNo": "loanAccount.guarantors[arrayIndex].guaUrnNo",
                                            "firstName":"loanAccount.guarantors[arrayIndex].guaFirstName"
                                        },
                                        "searchHelper": formHelper,
                                        "search": function(inputModel, form) {
                                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                            var promise = Enrollment.search({
                                                'customerId':inputModel.customerId,
                                                'branchName': inputModel.branch ||SessionStore.getBranch(),
                                                'firstName': inputModel.first_name,
                                                'centreCode':inputModel.centreCode
                                            }).$promise;
                                            return promise;
                                        },
                                        getListDisplayItem: function(data, index) {
                                            return [
                                                [data.firstName, data.fatherFirstName].join(' | '),
                                                data.id,
                                                data.urnNo
                                            ];
                                        }
                                    },

                                    {
                                        key:"loanAccount.guarantors[].guaFirstName",
                                        title:"GUARANTOR_NAME"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type":"fieldset",
                        "title":"PORTFOLIO_URN",
                        "items":[
                            {
                                "key":"additional.portfolioUrnSelector",
                                "type":"select",
                                "titleMap":{
                                    "applicant":"Applicant",
                                    "coapplicant":"Co-Applicant",
                                    "guarantor":"Guarantor"
                                },
                                onChange:function(value,form,model){
                                    switch(value){
                                        case "applicant": model.loanAccount.portfolioInsuranceUrn = model.loanAccount.urnNo; break;
                                        case "coapplicant":model.loanAccount.portfolioInsuranceUrn = model.loanAccount.coBorrowerUrnNo; break;
                                        case "grarantor": model.loanAccount.portfolioInsuranceUrn = model.loanAccount.guarantors[0].guaUrnNo; break;
                                    }
                                }
                                
                            },
                            {
                                key:"loanAccount.portfolioInsuranceUrn"
                                
                            }
                        ]
                        
                    },
                    {
                        "type": "fieldset",
                        "title": "Disbursement Details",
                        "items": [
                            {
                                key:"loanAccount.sanctionDate",
                                type:"date",
                                title:"SANCTION_DATE"
                            },
                            {
                                key:"loanAccount.numberOfDisbursements",
                                title:"NUM_OF_DISBURSEMENTS",
                                onChange:function(value,form,model){
                                    console.log(value);
                                    console.log(model);

                                    model.loanAccount.disbursementSchedules=[];
                                    for(var i=0;i<value;i++){
                                        model.loanAccount.disbursementSchedules.push({
                                            trancheNumber:""+(i+1),
                                            disbursementAmount:0
                                        });
                                    }
                                }
                            },
                            {
                                key:"loanAccount.disbursementSchedules",
                                title:"DISBURSEMENT_SCHEDULES",
                                add:null,
                                remove:null,
                                items:[
                                    {
                                        key:"loanAccount.disbursementSchedules[].trancheNumber",
                                        title:"TRANCHE_NUMBER",
                                        readonly:true
                                    },
                                    {
                                        key:"loanAccount.disbursementSchedules[].disbursementAmount",
                                        title:"DISBURSEMENT_AMOUNT",
                                        type:"amount"
                                    }
                                ]
                            },
                            {
                                key:"loanAccount.disbursementFromBankAccountNumber",
                                title:"DISBURSEMENT_ACCOUNT"
                            },
                            {
                                key:"loanAccount.originalAccountNumber",
                                title:"ORIGINAL_ACCOUNT"
                            }
                        ]
                    }
                ]
            },
                {
                    "type":"box",
                    "title":"Deprecated Items",
                    "items":[
                        {
                            "key": "loanAccount.isRestructure",
                            "title":"IS_RESTRUCTURE"
                        },
                        {
                            "key":"loanAccount.husbandOrFatherFirstName",
                            "title":"HUSBAND_OR_FATHER_NAME"
                        },
                        {
                            "key":"loanAccount.husbandOrFatherMiddleName"

                        },
                        {
                            "key":"loanAccount.husbandOrFatherLastName"

                        },
                        {
                            "key":"loanAccount.relationFirstName",
                            "title":"RELATIVE_NAME"
                        },
                        {
                            "key":"loanAccount.relation",
                            "type":"select",
                            "title":"T_RELATIONSHIP"

                        },
                        {
                            key:"loanAccount.documentTracking",
                            "title":"DOCUMENT_TRACKING"

                        },
                        {
                            key:"loanAccount.customerBankAccountNumber",
                            title:"CUSTOMER_BANK_ACC_NO"

                        },
                        {
                            key:"loanAccount.customerBankIfscCode",
                            title:"CUSTOMER_BANK_IFSC"

                        }



                    ]
                },

                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "SUBMIT"
                    }
                    ]
                }],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName){
                    console.log(model);
                    PageHelper.clearErrors();
                    var reqData = _.cloneDeep(model);
                    reqData.loanProcessAction="SAVE";
                    reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                    if(window.confirm("Are You Sure?")){
                        PageHelper.showLoader();
                        IndividualLoan.create(reqData,function(resp,headers){
                            delete resp.$promise;
                            delete resp.$resolved;
                            console.log(resp);
                            resp.loanProcessAction="PROCEED";
                            //reqData.loanProcessAction="PROCEED";
                            PageHelper.showLoader();
                            IndividualLoan.create(resp,function(resp,headers){
                                console.log(resp);
                                PageHelper.showProgress("loan-create","Loan Created",5000);
                            },function(resp){
                                console.log(resp);
                                PageHelper.showErrors(resp);
                                PageHelper.showProgress("loan-create","Oops. An Error Occurred",5000);

                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });


                        },function(resp){
                            console.log(resp);
                            PageHelper.showErrors(resp);
                            PageHelper.showProgress("loan-create","Oops. An Error Occurred",5000);

                        }).$promise.finally(function(){
                            PageHelper.hideLoader();
                        });
                    }
                }
            }
        };
    }]);
