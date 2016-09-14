irf.pageCollection.factory(irf.page("loans.individual.booking.LoanInput"),
["$log","SessionStore","$state", "$stateParams", "SchemaResource","PageHelper","Enrollment","formHelper","IndividualLoan","Utils","$filter","$q","irfProgressMessage", "Queries","LoanProducts",
    function($log, SessionStore,$state,$stateParams, SchemaResource,PageHelper,Enrollment,formHelper,IndividualLoan,Utils,$filter,$q,irfProgressMessage, Queries,LoanProducts){

        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        var bankName = SessionStore.getBankName();
        var bankId;
        bankId = $filter('filter')(formHelper.enum("bank").data, {name:bankName}, true)[0].code;

        var getSanctionedAmount = function(model){
            var fee = 0;
            if(model.loanAccount.insuranceFee)
                if(!_.isNaN(model.loanAccount.insuranceFee))
                    fee+=model.loanAccount.insuranceFee;
            if(model.loanAccount.commercialCibilCharge)
                if(!_.isNaN(model.loanAccount.commercialCibilCharge))
                    fee+=model.loanAccount.commercialCibilCharge;
            if(model.loanAccount.securityEmi)
                if(!_.isNaN(model.loanAccount.securityEmi))
                    fee+=model.loanAccount.securityEmi;
            $log.info(model.loanAccount.insuranceFee);
            $log.info(model.loanAccount.commercialCibilCharge);
            $log.info(model.loanAccount.securityEmi);

            model.additional.loanAmount = model.loanAccount.loanAmountRequested - fee;

        };

        var calculateTotalValue = function(value, form, model){
            if (_.isNumber(model.loanAccount.collateral[form.arrayIndex].quantity) && _.isNumber(value)){
                model.loanAccount.collateral[form.arrayIndex].totalValue = model.loanAccount.collateral[form.arrayIndex].quantity * model.loanAccount.collateral[form.arrayIndex].loanToValue;
            }
        }

        try{
            var defaultPartner = formHelper.enum("partner").data[0].value;
        }catch(e){}

        var populateDisbursementSchedule=function (value,form,model){
            PageHelper.showProgress("loan-create","Verify Disbursement Schedules",5000);
            model.loanAccount.disbursementSchedules=[];
            for(var i=0;i<value;i++){
                model.loanAccount.disbursementSchedules.push({
                    trancheNumber:""+(i+1),
                    disbursementAmount:0
                });
            }
            if (value ==1){
                model.loanAccount.disbursementSchedules[0].disbursementAmount = model.loanAccount.loanAmountRequested;
            }

        }


        var getProductDetails=function (value,model){
            if (value)
                LoanProducts.getProductData({"productCode":value})
                .$promise
                .then(
                    function(res){
                        try
                        {
                            delete model.additional.product;
                        }
                        catch(err){
                            console.error(err);
                        }
                        model.additional.product = res;
                    },
                    function(httpRes){
                        PageHelper.showProgress('loan-create', 'Failed to load the Product details. Try again.', 4000);
                        PageHelper.showErrors(httpRes);
                        PageHelper.hideLoader();
                    }
                )
        }

        return {
            "type": "schema-form",
            "title": "Loan Input",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {

                model.loanAccount = model.loanAccount || {branchId :branchId};
                model.additional = {branchName : branchName};
                model.loanAccount.bankId = bankId;
                model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                model.loanAccount.disbursementSchedules=model.loanAccount.disbursementSchedules || [];
                model.loanAccount.collateral=model.loanAccount.collateral || [{quantity:1}];
                model.loanAccount.guarantors=model.loanAccount.guarantors || [{guaFirstName:""}];
                model.loanAccount.nominees=model.loanAccount.nominees || [{nomineeFirstName:""}];
                model.loanAccount.loanApplicationDate = model.loanAccount.loanApplicationDate || Utils.getCurrentDate();
                model.loanAccount.commercialCibilCharge = 750;
                model.loanAccount.documentTracking="PENDING";
                model.loanAccount.isRestructure = false;
                model.loanAccount.partnerCode = defaultPartner;
                getSanctionedAmount(model);
                $log.info(model);

                model.additional.minAmountForSecurityEMI=0;
                Queries.getGlobalSettings("loan.individual.booking.minAmountForSecurityEMI").then(function(value){
                    model.additional.minAmountForSecurityEMI = Number(value);
                    $log.info("minAmountForSecurityEMI:" + model.additional.minAmountForSecurityEMI);                    
                },function(err){
                    $log.info("Max Security EMI is not available");
                });
                if(model.loanAccount.productCode!="")
                    getProductDetails(model.loanAccount.productCode,model);
            },
            offline: true,
            getOfflineDisplayItem: function(item, index){
                return [
                    '{{"ENTITY_NAME"|translate}}: ' + item.customer.firstName + (item.loanAccount.urnNo ? ' <small>{{"URN_NO"|translate}}:' + item.loanAccount.urnNo + '</small>' : ''),
                    '{{"PRODUCT_CODE"|translate}}: ' + item.loanAccount.productCode,
                    '{{"CENTRE_ID"|translate}}: ' + item.loanAccount.loanCentre.centreId
                ]
            },
            form: [{
                "type": "box",
                "title": "LOAN_INPUT",
                "colClass": "col-sm-6",

                "items":[
                    {
                    "type":"fieldset",
                    "title":"BRANCH_DETAILS",
                    "items":[
                        {
                            key:"loanAccount.loanCentre.branchId",
                            title:"BRANCH",
                            "type":"select",
                            "enumCode":"branch"
                        },
                        {
                            key:"loanAccount.loanCentre.centreId",
                            title:"CENTRE_NAME",
                            "type":"select",
                            enumCode: "centre",
                            parentEnumCode:"branch"
                        },
                        {
                            "key": "loanAccount.partnerCode",
                            "title": "PARTNER",
                            "type": "select"
                        }]
                    },
                    {
                        "type": "fieldset",
                        "title": "PRODUCT_DETAILS",
                        "items": [
                            {
                                "key": "loanAccount.id",
                                "title": "LOAN_ID",
                                "condition":"model.loanAccount.id",
                                "readonly":true
                            },
                            {
                                "key": "loanAccount.productCode",
                                "title": "PRODUCT",
                                "type": "select",
                                onChange:function(value,form,model){
                                    getProductDetails(value,model);
                                }
                            },
                            {
                                "key": "loanAccount.tenure",
                                "title":"DURATION_IN_MONTHS"
                            },
                            {
                                "key": "loanAccount.frequency",
                                "type":"select"
                            },

                        ]
                    },
                    {
                        "type": "fieldset",
                        "title": "ENTITY_DETAILS",
                        "items": [
                            {
                                "key": "loanAccount.urnNo",
                                "title": "URN_NO",
                                "type":"lov",
                                "lovonly": true,
                                "inputMap": {
                                    "customerType":{
                                        "key":"customer.customerType",
                                        "title":"CUSTOMER_TYPE",
                                        "type":"select",
                                        "titleMap":{
                                            "Individual":"Individual",
                                            "Enterprise":"Enterprise"
                                        }
                                    },
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

                                },
                                "searchHelper": formHelper,
                                initialize: function(inputModel) {
                                    $log.warn('in pincode initialize');
                                    $log.info(inputModel);
                                },
                                "search": function(inputModel, form, model) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Enrollment.search({
                                        'customerId':inputModel.customerId,
                                        'branchName': inputModel.branch ||SessionStore.getBranch(),
                                        'firstName': inputModel.firstName,
                                        'centreCode':inputModel.centreCode,
                                        'customerType':inputModel.customerType,
                                        'stage': "Completed"
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        data.firstName,
                                        data.id,
                                        data.urnNo
                                    ];
                                },
                                onSelect: function(result, model, context) {
                                    $log.info(result);
                                    var promise = Queries.getCustomerBankAccounts(
                                        result.id
                                    ).then(function(response){
                                        if(response && response.body && response.body.length){
                                            for (var i = response.body.length - 1; i >= 0; i--) {
                                                if(response.body[i].is_disbersement_account == 1){
                                                    model.loanAccount.customerBankAccountNumber = response.body[i].account_number;
                                                    model.loanAccount.customerBankIfscCode = response.body[i].ifsc_code;
                                                    model.loanAccount.customerBank = response.body[i].customer_bank_name;
                                                    model.loanAccount.customerBranch = response.body[i].customer_bank_branch_name;
                                                    break;
                                                }
                                            }
                                        }
                                    });
                                }
                            },
                            {
                                "key":"loanAccount.customerId",
                                "title":"ENTITY_ID",
                                "readonly": true
                            },
                            {
                                "key": "customer.firstName",
                                "title": "ENTITY_NAME",
                                "readonly": true
                            },
                            {
                                "key": "loanAccount.applicant",
                                "title": "APPLICANT_URN_NO",
                                "type":"lov",
                                "lovonly": true,
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
                                    "urnNo": "loanAccount.applicant",
                                    "firstName":"customer.applicantName"
                                },
                                "searchHelper": formHelper,
                                "search": function(inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Enrollment.search({
                                        'customerId':inputModel.customerId,
                                        'branchName': inputModel.branch ||SessionStore.getBranch(),
                                        'firstName': inputModel.firstName,
                                        'centreCode':inputModel.centreCode,
                                        'customerType':"individual",
                                        'stage': "Completed"
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
                                "key":"customer.applicantName",
                                "title":"APPLICANT_NAME",
                                "readonly": true
                            },
                            {
                                "key": "loanAccount.coBorrowerUrnNo",
                                "title": "CO_APPLICANT_URN_NO",
                                "type":"lov",
                                "lovonly": true,
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
                                        'firstName': inputModel.firstName,
                                        'centreCode':inputModel.centreCode,
                                        'customerType':"individual",
                                        'stage': "Completed"
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
                                "title":"COAPPLICANT_NAME",
                                "readonly": true
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
                                    getSanctionedAmount(model);
                                }
                            },
                            {
                                key:"loanAccount.insuranceFee",
                                type:"amount",
                                onChange:function(value,form,model){
                                    getSanctionedAmount(model);
                                }
                            },
                            {
                                key:"loanAccount.commercialCibilCharge",
                                type:"amount",
                                onChange:function(value,form,model){
                                    getSanctionedAmount(model);
                                }
                            },
                            {
                                key:"loanAccount.securityEmi",
                                type:"amount",
                                onChange:function(value,form,model){
                                    getSanctionedAmount(model);
                                }
                            },
                            {
                                key:"additional.processingFee",
                                type:"amount",
                                "title":"PROCESSING_FEES"
                            },
                            {
                                key:"loanAccount.otherFee",
                                type:"amount"
                            },
                            {
                                "key": "additional.loanAmount",
                                "type":"amount",
                                "title":"NET_DISBURSEMENT_AMOUNT"
                            },
                            {
                                "key":"loanAccount.interestRate",
                                "type":"number"
                            },
                            {
                                "key": "loanAccount.loanApplicationDate",
                                "title": "LOAN_APPLICATION_DATE",
                                "type":"date"
                            },
                            {
                                "key": "loanAccount.loanPurpose1",
                                "title": "LOAN_PURPOSE",
                                "type":"select"
                            }/*,
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
                            }*/
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
                                "key":"loanAccount.collateral[].quantity",
                                "onChange": function(value ,form ,model, event){
                                    calculateTotalValue(value, form, model);
                                }
                            },
                            {
                                "key":"loanAccount.collateral[].modelNo"
                            },
                            {
                                "key":"loanAccount.collateral[].machineOld"
                            },
                            {
                                "key":"loanAccount.collateral[].loanToValue",
                                "type":"amount",
                                "title":"PRESENT_VALUE",
                                "onChange": function(value ,form ,model, event){
                                    calculateTotalValue(value, form, model);
                                }
                            },
                            {
                                "key":"loanAccount.collateral[].collateralValue",
                                "type":"amount",
                                "title":"PURCHASE_PRICE"
                            },
                            {
                                "key":"loanAccount.collateral[].totalValue",
                                "type":"amount",
                                "title":"TOTAL_VALUE",
                                "readonly":true
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
                                notitle:"true",
                                view:"fixed",
                                type:"array",
                                add:null,
                                remove:null,
                                items:[
                                    {
                                        "key": "loanAccount.guarantors[].guaUrnNo",
                                        "title": "URN_NO",
                                        "type":"lov",
                                        "lovonly": true,
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
                                                'firstName': inputModel.firstName,
                                                'centreCode':inputModel.centreCode,
                                                'customerType': "individual",
                                                'stage': "Completed"
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
                                        title:"NAME",
                                        "readonly": true
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type":"fieldset",
                        "title":"INSURANCE_POLICY",
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
                                        case "applicant":
                                            if(_.isEmpty(model.loanAccount.applicant)){
                                                Utils.alert("Please Select an Applicant");
                                                model.additional.portfolioUrnSelector="";
                                                break;
                                            }
                                            model.loanAccount.portfolioInsuranceUrn = model.loanAccount.applicant;
                                            break;
                                        case "coapplicant":
                                            if(_.isEmpty(model.loanAccount.coBorrowerUrnNo)){
                                                Utils.alert("Please Select a Co-Applicant");
                                                model.additional.portfolioUrnSelector="";
                                                break;
                                            }
                                            model.loanAccount.portfolioInsuranceUrn = model.loanAccount.coBorrowerUrnNo;
                                            break;
                                        case "guarantor":
                                            if(_.isEmpty(model.loanAccount.guarantors[0].guaUrnNo)){
                                                Utils.alert("Please Select a Guarantor");
                                                model.additional.portfolioUrnSelector="";
                                                break;
                                            }
                                            model.loanAccount.portfolioInsuranceUrn = model.loanAccount.guarantors[0].guaUrnNo;
                                            break;
                                    }
                                }
                            },
                            {
                                key:"loanAccount.portfolioInsuranceUrn",
                                "title":"URN_NO"
                            }
                        ]
                    },
                    {
                        "type":"fieldset",
                        "title":"NOMINEE_DETAILS",
                        "items":[
                            {
                                "key":"loanAccount.nominees",
                                "type":"array",
                                notitle:"true",
                                "view":"fixed",
                                "add":null,
                                "remove":null,
                                "items":[
                                    {
                                        key:"loanAccount.nominees[].nomineeFirstName",
                                        "title":"NAME"
                                    },
                                    {
                                        key:"loanAccount.nominees[].nomineeGender",
                                        type:"select",
                                        "title":"GENDER"
                                    },
                                    {
                                        key:"loanAccount.nominees[].nomineeDOB",
                                        type:"date",
                                        "title":"DATE_OF_BIRTH"
                                    },
                                    {
                                        key:"loanAccount.nominees[].nomineeDoorNo",
                                        "title":"DOOR_NO"
                                    },
                                    {
                                        key:"loanAccount.nominees[].nomineeLocality",
                                        "title":"LOCALITY"
                                    },
                                    {
                                        key:"loanAccount.nominees[].nomineeStreet",
                                        "title":"STREET"
                                    },
                                    {
                                        key: "loanAccount.nominees[].nomineePincode",
                                        type: "lov",
                                        fieldType: "number",
                                        autolov: true,
                                        inputMap: {
                                            "pincode": {
                                                key:"loanAccount.nominees[].nomineePincode"
                                            },
                                            "district": {
                                                key: "loanAccount.nominees[].nomineeDistrict"
                                            },
                                            "state": {
                                                key: "loanAccount.nominees[].nomineeState"
                                            }
                                        },
                                        outputMap: {
                                            "pincode": "loanAccount.nominees[arrayIndex].nomineePincode",
                                            "district": "loanAccount.nominees[arrayIndex].nomineeDistrict",
                                            "state": "loanAccount.nominees[arrayIndex].nomineeState"
                                        },
                                        searchHelper: formHelper,
                                        search: function(inputModel, form, model) {
                                            return Queries.searchPincodes(
                                                inputModel.pincode,
                                                inputModel.district,
                                                inputModel.state
                                            );
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.pincode,
                                                item.district + ', ' + item.state
                                            ];
                                        }
                                    },
                                    {
                                        key:"loanAccount.nominees[].nomineeDistrict",
                                        type:"text",
                                        "title":"DISTRICT"
                                    },
                                    {
                                        key:"loanAccount.nominees[].nomineeState",
                                        "title":"STATE"
                                    },
                                    {
                                        key:"loanAccount.nominees[].nomineeRelationship",
                                        type:"select",
                                        "title":"RELATIONSHIP"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "fieldset",
                        "title": "DISBURSEMENT_DETAILS",
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
                                    populateDisbursementSchedule(value,form,model);
                                }
                            },
                            {
                                key: "loanAccount.customerBankAccountNumber",
                                type: "lov",
                                autolov: true,
                                title:"CUSTOMER_BANK_ACC_NO",
                                bindMap: {
                                    "customerId": "loanAccount.customerId"
                                },
                                outputMap: {
                                    "account_number": "loanAccount.customerBankAccountNumber",
                                    "ifsc_code": "loanAccount.customerBankIfscCode",
                                    "customer_bank_name":"loanAccount.customerBank",
                                    "customer_bank_branch_name":"loanAccount.customerBranch"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form, model) {
                                    return Queries.getCustomerBankAccounts(
                                        inputModel.customerId
                                    );
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.account_number + (item.is_disbersement_account==1?'&nbsp;&nbsp;<span class="color-theme"><i class="fa fa-check-square">&nbsp;</i>{{"DEFAULT_DISB_ACCOUNT"|translate}}</span>':''),
                                        item.ifsc_code + ', ' + item.customer_bank_name,
                                        item.customer_bank_branch_name
                                    ];
                                }
                            },
                            {
                                key:"loanAccount.customerBankIfscCode",
                                title:"CUSTOMER_BANK_IFSC",
                                "readonly":true
                            },
                            {
                                key:"loanAccount.customerBank",
                                title:"CUSTOMER_BANK",
                                "readonly":true
                            },
                            {
                                key:"loanAccount.customerBranch",
                                title:"BRANCH_NAME",
                                "readonly":true
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
                            }
                        ]
                    }
                ]
            },
            {
                "type":"box",
                "title":"Deprecated Items",
                "condition":"false",
                "items":[
                    {
                        key:"loanAccount.disbursementFromBankAccountNumber",
                        title:"DISBURSEMENT_ACCOUNT"
                    },
                    {
                        key:"loanAccount.originalAccountNumber",
                        title:"ORIGINAL_ACCOUNT"
                    },
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
                    }
                ]
            },
            {
                "type": "actionbox",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                },
                {
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.loanAccount.urnNo) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('LoanInput-save', 'urnNo is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },
                submit: function(model, form, formName) {
                    $log.info(model);
                    PageHelper.clearErrors();

                    model.loanAccount.loanPurpose3 = model.loanAccount.loanPurpose2 = model.loanAccount.loanPurpose1;
                    if (model.loanAccount.applicant === model.loanAccount.coBorrowerUrnNo) {
                        PageHelper.showProgress("loan-create","Applicant & Co-applicant cannot be same",5000);
                        return false;
                    }

                    if (model.loanAccount.guarantors.length > 0){
                        for (i=0;i<model.loanAccount.guarantors.length;i++){
                            if (model.loanAccount.applicant === model.loanAccount.guarantors[i].guaUrnNo) {
                                PageHelper.showProgress("loan-create","Applicant & Guarantor cannot be same",5000);
                                return false;
                            }
                            if (model.loanAccount.coBorrowerUrnNo === model.loanAccount.guarantors[i].guaUrnNo) {
                                PageHelper.showProgress("loan-create","Co-Applicant & Guarantor cannot be same",5000);
                                return false;
                            }
                        }
                    }

                    if (model.additional.minAmountForSecurityEMI > 0){
                        if (model.loanAccount.loanAmountRequested > model.additional.minAmountForSecurityEMI && (model.loanAccount.securityEmi==0 || model.loanAccount.securityEmi == '')){
                            PageHelper.showProgress("loan-create","Securty EMI is mandatory",5000);
                            return false;
                        }
                    }
                    model.loanAccount.loanAmount = model.loanAccount.loanAmountRequested;
                    if(model.loanAccount.disbursementSchedules && model.loanAccount.disbursementSchedules.length){
                        for (var i = model.loanAccount.disbursementSchedules.length - 1; i >= 0; i--) {
                            model.loanAccount.disbursementSchedules[i].customerAccountNumber = model.loanAccount.customerBankAccountNumber;
                            model.loanAccount.disbursementSchedules[i].ifscCode = model.loanAccount.customerBankIfscCode;
                            model.loanAccount.disbursementSchedules[i].modeOfDisbursement = "CASH";
                        }
                    }

                    if (model.additional.processingFee){
                        if (model.additional.processingFee > 0){
                            model.loanAccount.processingFeeInPaisa = Number(model.additional.processingFee) * 100;
                        }
                    }
                    //Product specific validations
                    if(model.additional.product){
                        if (model.additional.product.collateralRequired && model.loanAccount.collateral.length == 0){
                                PageHelper.showProgress("loan-create","Collateral details are mandatory",5000);
                                return false;
                        }
                    }


                    var reqData = _.cloneDeep(model);
                    reqData.loanProcessAction="SAVE";
                    reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                    Utils.confirm("Are You Sure?").then(function(){
                        PageHelper.showLoader();
                        IndividualLoan.create(reqData,function(resp,headers){
                            delete resp.$promise;
                            delete resp.$resolved;
                            $log.info(resp);
                            model.loanAccount.id = resp.loanAccount.id;
                            $log.info("Loan ID Returned on Save:" + model.loanAccount.id);
                            resp.loanProcessAction="PROCEED";
                            //reqData.loanProcessAction="PROCEED";
                            PageHelper.showLoader();
                            IndividualLoan.create(resp,function(resp,headers){
                                $log.info(resp);
                                PageHelper.showProgress("loan-create","Loan Created",5000);
                                $state.go({pageName: 'loans.individual.booking.PendingQueue'})
                            },function(errresp){
                                $log.info(errresp);
                                PageHelper.showErrors(errresp);
                                PageHelper.showProgress("loan-create","Oops. An Error Occurred",5000);
                                model = resp;

                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });


                        },function(errResp){
                            $log.info(errResp);
                            PageHelper.showErrors(errResp);
                            PageHelper.showProgress("loan-create","Oops. An Error Occurred",5000);

                        }).$promise.finally(function(){
                            PageHelper.hideLoader();
                        });
                    });
                }
            }
        };
    }]);
