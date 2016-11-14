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
            if(model.loanAccount.commercialCibilCharge)
                if(!_.isNaN(model.loanAccount.commercialCibilCharge))
                    fee+=model.loanAccount.commercialCibilCharge;
            $log.info(model.loanAccount.commercialCibilCharge);

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
                        model.additional.product.interestBracket = res.minInterestRate + '% - ' + res.maxInterestRate + '%';
                        model.additional.product.amountBracket = model.additional.product.amountFrom + ' - ' + model.additional.product.amountTo;
                        $log.info(model.additional.product.interestBracket);
                        if (model.additional.product.frequency == 'M')
                            model.loanAccount.frequency = 'Monthly';
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
            "title": "LOAN_INPUT",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                // TODO default values needs more cleanup
                var init = function(model, form, formCtrl) {
                    model.loanAccount = model.loanAccount || {branchId :branchId};
                    model.additional = {branchName : branchName};
                    model.loanAccount.bankId = bankId;
                    model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                    model.loanAccount.disbursementSchedules=model.loanAccount.disbursementSchedules || [];
                    model.loanAccount.collateral=model.loanAccount.collateral || [{quantity:1}];
                    //model.loanAccount.guarantors=model.loanAccount.guarantors || [{guaFirstName:""}];
                    model.loanAccount.loanCustomerRelations = model.loanAccount.loanCustomerRelations || [];
                    model.loanAccount.coBorrowers = [];
                    for (var i = 0; i < model.loanAccount.loanCustomerRelations.length; i++) {
                        if (model.loanAccount.loanCustomerRelations[i].relation === 'COAPPLICANT') {
                            model.loanAccount.coBorrowers.push({
                                coBorrowerUrnNo:model.loanAccount.loanCustomerRelations[i].urn
                            });
                        }
                    }

                    model.loanAccount.nominees=model.loanAccount.nominees || [{nomineeFirstName:"",nomineeDoorNo:""}];
                    model.loanAccount.nominees[0].nomineeFirstName = model.loanAccount.nominees[0].nomineeFirstName || '';
                    model.loanAccount.nominees[0].nomineeDoorNo = model.loanAccount.nominees[0].nomineeDoorNo || '';
                    model.loanAccount.nominees[0].nomineeLocality = model.loanAccount.nominees[0].nomineeLocality || '';
                    model.loanAccount.nominees[0].nomineeStreet = model.loanAccount.nominees[0].nomineeStreet || '';
                    model.loanAccount.nominees[0].nomineePincode = model.loanAccount.nominees[0].nomineePincode || '';
                    model.loanAccount.nominees[0].nomineeDistrict = model.loanAccount.nominees[0].nomineeDistrict || '';
                    model.loanAccount.nominees[0].nomineeState = model.loanAccount.nominees[0].nomineeState || '';
                    model.loanAccount.nominees[0].nomineeRelationship = model.loanAccount.nominees[0].nomineeRelationship || '';
                    model.loanAccount.loanApplicationDate = model.loanAccount.loanApplicationDate || Utils.getCurrentDate();
                    model.loanAccount.commercialCibilCharge = 750; //Hard coded. This value to be changed to pickup from global_settings table
                    model.loanAccount.documentTracking = model.loanAccount.documentTracking || "PENDING";
                    model.loanAccount.isRestructure = false;
                    getSanctionedAmount(model);
                    $log.info(model);

                    model.additional.minAmountForSecurityEMI = 0;
                    Queries.getGlobalSettings("loan.individual.booking.minAmountForSecurityEMI").then(function(value){
                        model.additional.minAmountForSecurityEMI = Number(value);
                        $log.info("minAmountForSecurityEMI:" + model.additional.minAmountForSecurityEMI);
                    },function(err){
                        $log.info("Max Security EMI is not available");
                    });
                    if(model.loanAccount.productCode)
                        getProductDetails(model.loanAccount.productCode,model);
                };
                // code for existing loan
                $log.info("Loan Number:::" + $stateParams.pageId);
                if ($stateParams.pageId) {
                    PageHelper.showLoader();
                    IndividualLoan.get({id: $stateParams.pageId}).$promise.then(function(resp){
                        if (resp.currentStage != 'LoanInitiation') {
                            PageHelper.showProgress('load-loan', 'Loan is in different Stage', 2000);
                            $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue', pageId: null});
                            return;
                        }
                        model.loanAccount = resp;
                        init(model, form, formCtrl); // init call
                    }, function(errResp){
                        PageHelper.showErrors(errResp);
                    }).finally(function(){
                        PageHelper.hideLoader();
                    });
                } else {
                    init(model, form, formCtrl); // init call
                }

            },
            offline: false,
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
                        /*{
                            key:"loanAccount.loanCentre.branchId",
                            title:"BRANCH",
                            "type":"select",
                            "enumCode":"branch_id"
                        },
                        {
                            key:"loanAccount.loanCentre.centreId",
                            title:"CENTRE_NAME",
                            "type":"select",
                            enumCode: "centre",
                            parentEnumCode:"branch_id"
                        },*/
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
                                },
                                "parentEnumCode": "partner"
                            },
                            {
                                "key": "loanAccount.tenure",
                                "title":"DURATION_IN_MONTHS"
                            },
                            {
                                "key": "loanAccount.frequency",
                                "type":"select",
                                "readonly":true
                            }
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
                                    "centreId": {
                                        "key": "customer.centreId",
                                        "type": "select",
                                        "screenFilter": true,
                                        "parentEnumCode": "branch"
                                    }
                                },
                                "outputMap": {
                                    "id": "loanAccount.customerId",
                                    "urnNo": "loanAccount.urnNo",
                                    "firstName":"customer.firstName",
                                    "customerBranchId":"loanAccount.loanCentre.branchId",
                                    "centreId":"loanAccount.loanCentre.centreId"
                                },
                                "searchHelper": formHelper,
                                initialize: function(inputModel) {
                                    $log.warn('in loanAccount.urnNo initialize');
                                    $log.info(inputModel);
                                },
                                "search": function(inputModel, form, model) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    $log.info(inputModel);
                                    var promise = Enrollment.search({
                                        'customerId':inputModel.customerId,
                                        'branchName': inputModel.branch ||SessionStore.getBranch(),
                                        'firstName': inputModel.firstName,
                                        'centreId':inputModel.centreId,
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
                                                    model.loanAccount.customerNameAsInBank =  response.body[i].customer_name_as_in_bank;
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
                                    "centreId": {
                                        "key": "customer.centreId",
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
                                        'centreId':inputModel.centreId,
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
                                "type": "fieldset",
                                "title": "COAPPLICANTS",
                                "items": [
                                    {
                                        "key": "loanAccount.coBorrowers",
                                        "title": "COAPPLICANTS",
                                        "titleExpr": "model.loanAccount.coBorrowers[arrayIndex].coBorrowerName",
                                        "type": "array",
                                        "startEmpty": true,
                                        "schema": {
                                            "maxItems": 4
                                        },
                                        "items": [
                                            {
                                                "key": "loanAccount.coBorrowers[].coBorrowerUrnNo",
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
                                                    "centreId": {
                                                        "key": "customer.centreId",
                                                        "type": "select",
                                                        "screenFilter": true
                                                    }
                                                },
                                                "outputMap": {
                                                    "urnNo": "loanAccount.coBorrowers[arrayIndex].coBorrowerUrnNo",
                                                    "firstName":"loanAccount.coBorrowers[arrayIndex].coBorrowerName"
                                                },
                                                "searchHelper": formHelper,
                                                "search": function(inputModel, form) {
                                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                                    var promise = Enrollment.search({
                                                        'customerId':inputModel.customerId,
                                                        'branchName': inputModel.branch ||SessionStore.getBranch(),
                                                        'firstName': inputModel.firstName,
                                                        'centreId':inputModel.centreId,
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
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "fieldset",
                        "title": "LOAN_DETAILS",
                        "items": [
                            {
                                "key": "loanAccount.loanAmountRequested",
                                "type":"amount",
                                "title":"LOAN_AMOUNT_REQUESTED",
                                "placeholderExpr":"model.additional.product.amountBracket"
                            },
                            {
                                key:"loanAccount.commercialCibilCharge",
                                type:"amount",
                                onChange:function(value,form,model){
                                    getSanctionedAmount(model);
                                }
                            },
                            {
                                key:"loanAccount.securityEmiRequired",
                                required: true
                            },
                            {
                                key:"loanAccount.processingFeePercentage",
                                type:"number",
                                "title":"PROCESSING_FEES_IN_PERCENTAGE"
                            },
                            {
                                key:"loanAccount.otherFee",
                                type:"amount"
                            },
                            {
                                "key":"loanAccount.interestRate",
                                "type":"number",
                                "placeholderExpr":"model.additional.product.interestBracket"
                            },
                            {
                                "key": "loanAccount.loanApplicationDate",
                                "title": "LOAN_APPLICATION_DATE",
                                "type":"date"
                            },
                            {
                                key: "loanAccount.loanPurpose1",
                                type: "lov",
                                autolov: true,
                                title:"LOAN_PURPOSE_1",
                                bindMap: {
                                },
                                outputMap: {
                                    "purpose1": "loanAccount.loanPurpose1"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form, model) {
                                    return Queries.getLoanPurpose1(model.loanAccount.productCode);
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.purpose1
                                    ];
                                }
                            },
                            {
                                key: "loanAccount.loanPurpose2",
                                type: "lov",
                                autolov: true,
                                title:"LOAN_PURPOSE_2",
                                bindMap: {
                                },
                                outputMap: {
                                    "purpose2": "loanAccount.loanPurpose2"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form, model) {
                                    return Queries.getLoanPurpose2(model.loanAccount.productCode, model.loanAccount.loanPurpose1);
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.purpose2
                                    ];
                                }
                            },
                            {
                                title: "BUSINESS_INCOME",
                                type: "amount",
                                key: "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf3",
                                required: true
                            },
                            {
                                title: "LOAN_PURPOSE_VALUE",
                                type: "amount",
                                key: "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4"
                            }
                            /*,
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
                            }/*,
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
                            }*/
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
                                startEmpty: true,
                                type:"array",
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
                                            "centreId": {
                                                "key": "customer.centreId",
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
                                                'centreId':inputModel.centreId,
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
                                        "title":"PIN_CODE",
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
                                            "division": "loanAccount.nominees[arrayIndex].nomineeLocality",
                                            "pincode": "loanAccount.nominees[arrayIndex].nomineePincode",
                                            "district": "loanAccount.nominees[arrayIndex].nomineeDistrict",
                                            "state": "loanAccount.nominees[arrayIndex].nomineeState"
                                        },
                                        searchHelper: formHelper,
                                        initialize: function(inputModel, form, model, context) {
                                            inputModel.pincode = model.loanAccount.nominees[context.arrayIndex].nomineePincode;
                                        },
                                        search: function(inputModel, form, model, context) {
                                            return Queries.searchPincodes(
                                                inputModel.pincode || model.loanAccount.nominees[context.arrayIndex].nomineePincode,
                                                inputModel.district,
                                                inputModel.state
                                            );
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.division + ', ' + item.region,
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
                                    },
                                    {
                                        key: "loanAccount.disbursementSchedules[].tranchCondition",
                                        type: "lov",
                                        autolov: true,
                                        title:"TRANCHE_CONDITION",
                                        bindMap: {
                                        },
                                        searchHelper: formHelper,
                                        search: function(inputModel, form, model, context) {
                                            
                                            var trancheConditions = formHelper.enum('tranche_conditions').data;
                                            var out = [];
                                            for (var i=0;i<trancheConditions.length; i++){
                                                var t = trancheConditions[i];
                                                var min = _.hasIn(t, "field1")?parseInt(t.field1) - 1: 0;
                                                var max = _.hasIn(t, "field2")?parseInt(t.field2) - 1: 100;

                                                if (context.arrayIndex>=min && context.arrayIndex <=max){
                                                    out.push({
                                                        name: trancheConditions[i].name,
                                                        value: trancheConditions[i].value
                                                    })    
                                                }
                                            }
                                            return $q.resolve({
                                                headers: {
                                                    "x-total-count": out.length
                                                },
                                                body: out
                                            });
                                        },
                                        onSelect: function(valueObj, model, context){
                                            model.loanAccount.disbursementSchedules[context.arrayIndex].tranchCondition = valueObj.value;
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.name
                                            ];
                                        }
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
                "items": [/*{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                },*/
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

                    if (!_.isNull(model.additional.product.numberOfGuarantors) && model.additional.product.numberOfGuarantors>0 ){
                        if (!_.isArray(model.loanAccount.guarantors) || model.loanAccount.guarantors.length == 0){
                            PageHelper.showProgress('loan-product-guarantor-required', 'Guarantor is mandatory for the selected product', 5000);
                            return;    
                        }
                    }

                    model.loanAccount.loanPurpose3 = model.loanAccount.loanPurpose2;
                    if (model.loanAccount.applicant === model.loanAccount.coBorrowerUrnNo) {
                        PageHelper.showProgress("loan-create","Applicant & Co-applicant cannot be same",5000);
                        return false;
                    }

                    if (model.loanAccount.guarantors && model.loanAccount.guarantors.length > 0){
                        for (i=0;i<model.loanAccount.guarantors.length;i++){
                            if(!model.loanAccount.guarantors[i].guaUrnNo){
                                PageHelper.showProgress("loan-create","Guarantor Urn is not selected",5000);
                                return false;
                            }
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

                    if (model.additional.product && model.additional.product.productType != 'OD' && model.additional.minAmountForSecurityEMI > 0){
                        //if (model.additional.minAmountForSecurityEMI>model.loanAccount.loanAmount && model.loanAccount.securityEmiRequired == 'Yes'){
                        //    PageHelper.showProgress("loan-create","Securty EMI is required for loan amount greater than " + model.additional.minAmountForSecurityEMI,5000);
                        //    return false;
                        //}
                        if (model.loanAccount.securityEmiRequired && model.loanAccount.loanAmount>=model.additional.minAmountForSecurityEMI && model.loanAccount.securityEmiRequired == 'No'){
                            PageHelper.showProgress("loan-create","Securty EMI is mandatory",5000);
                            return false;
                        }
                    }
                    else
                        model.loanAccount.securityEmiRequired = model.loanAccount.securityEmiRequired || 'No';

                    var trancheTotalAmount=0;
                    model.loanAccount.loanAmount = model.loanAccount.loanAmountRequested;
                    if(model.loanAccount.disbursementSchedules && model.loanAccount.disbursementSchedules.length){
                        model.loanAccount.disbursementSchedules[0].customerAccountNumber = model.loanAccount.customerBankAccountNumber;
                        model.loanAccount.disbursementSchedules[0].ifscCode = model.loanAccount.customerBankIfscCode;
                        model.loanAccount.disbursementSchedules[0].customerBankName = model.loanAccount.customerBank;
                        model.loanAccount.disbursementSchedules[0].customerBankBranchName = model.loanAccount.customerBranch;
                        model.loanAccount.disbursementSchedules[0].party = 'CUSTOMER';
                        model.loanAccount.disbursementSchedules[0].customerNameInBank = model.loanAccount.customerNameAsInBank;
                        for (var i = model.loanAccount.disbursementSchedules.length - 1; i >= 0; i--) {
                            model.loanAccount.disbursementSchedules[i].modeOfDisbursement = "CASH";
                            trancheTotalAmount+=(model.loanAccount.disbursementSchedules[i].disbursementAmount || 0);
                        }
                    }
                    if (model.additional.product && model.additional.product.productType != 'OD' && trancheTotalAmount > model.loanAccount.loanAmount){
                        PageHelper.showProgress("loan-create","Total tranche amount is more than the Loan amount",5000);
                        return false;
                    }
                    if (model.additional.product && model.additional.product.productType != 'OD' && trancheTotalAmount < model.loanAccount.loanAmount){
                        PageHelper.showProgress("loan-create","Total tranche amount should match with the Loan amount",5000);
                        return false;
                    }
                    if (model.additional.product && model.additional.product.productType == 'OD' && model.loanAccount.numberOfDisbursements > 1){
                        PageHelper.showProgress("loan-create","For LOC type product, number of disbursement cannot be more than one during loan booking",5000);
                        return false;
                    }

                    //Product specific validations
                    if(model.additional.product){
                        if (model.additional.product.collateralRequired && model.loanAccount.collateral.length == 0){
                                PageHelper.showProgress("loan-create","Collateral details are mandatory",5000);
                                return false;
                        }
                        if (!_.isNaN(model.additional.product.amountFrom) && model.additional.product.amountFrom > 0){
                            if (model.loanAccount.loanAmountRequested < model.additional.product.amountFrom){
                                PageHelper.showProgress("loan-create","Loan Amount requested should be in the range [" + model.additional.product.amountFrom + " - " + model.additional.product.amountTo + "]",5000);
                                return false;
                            }
                            if (model.loanAccount.loanAmountRequested > model.additional.product.amountTo){
                                PageHelper.showProgress("loan-create","Loan Amount requested should be in the range [" + model.additional.product.amountFrom + " - " + model.additional.product.amountTo + "]",5000);
                                return false;
                            }
                        }
                        if (!_.isNaN(model.additional.product.tenureFrom) && model.additional.product.tenureFrom > 0){
                            if (model.loanAccount.tenure < model.additional.product.tenureFrom){
                                PageHelper.showProgress("loan-create","Loan Tenure requested should be in the range [" + model.additional.product.tenureFrom + " - " + model.additional.product.tenureTo + "]",5000);
                                return false;
                            }
                            if (model.loanAccount.tenure > model.additional.product.tenureTo){
                                PageHelper.showProgress("loan-create","Loan Tenure requested should be in the range [" + model.additional.product.tenureFrom + " - " + model.additional.product.tenureTo + "]",5000);
                                return false;
                            }
                        }
                        if (!_.isNaN(model.additional.product.minInterestRate) && model.additional.product.minInterestRate > 0){
                            if (model.loanAccount.interestRate < model.additional.product.minInterestRate){
                                PageHelper.showProgress("loan-create","Interest Rate should be in the range [" + model.additional.product.minInterestRate + "% - " + model.additional.product.maxInterestRate + "%]",5000);
                                return false;
                            }
                            if (model.loanAccount.interestRate > model.additional.product.maxInterestRate){
                                PageHelper.showProgress("loan-create","Loan Amount requested should be in the range [" + model.additional.product.minInterestRate + "% - " + model.additional.product.maxInterestRate + "%]",5000);
                                return false;
                            }
                        }
                    }

                    model.loanAccount.loanCustomerRelations = [];
                    model.loanAccount.loanCustomerRelations.push({
                        urn:model.loanAccount.applicant,
                        relation:'APPLICANT'
                    });
                    if(model.loanAccount.coBorrowers && model.loanAccount.coBorrowers.length){
                        for (var i = 0; i < model.loanAccount.coBorrowers.length; i++) {
                            model.loanAccount.loanCustomerRelations.push({
                                urn:model.loanAccount.coBorrowers[i].coBorrowerUrnNo,
                                relation:'COAPPLICANT'
                            });
                        }
                    }
                    if(model.loanAccount.guarantors && model.loanAccount.guarantors.length > 0){
                        for (var i = model.loanAccount.guarantors.length - 1; i >= 0; i--) {
                            if(model.loanAccount.guarantors.guaUrnNo){
                                model.loanAccount.loanCustomerRelations.push({
                                    urn:model.loanAccount.guarantors[i].guaUrnNo,
                                    relation:'GUARANTOR'
                                });
                            }
                        }
                    }

                    if(model.loanAccount.portfolioInsuranceUrn != ''){
                        model.loanAccount.portfolioInsurancePremiumCalculated = "Yes";
                    }

                    var reqData = _.cloneDeep(model);
                    reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                    Utils.confirm("Are You Sure?").then(function(){
                        PageHelper.showLoader();
                        if (!$stateParams.pageId) {
                            reqData.loanProcessAction="SAVE";
                            IndividualLoan.create(reqData,function(resp,headers){
                                delete resp.$promise;
                                delete resp.$resolved;
                                $log.info(resp);
                                //model.loanAccount.id = resp.loanAccount.id;
                                $log.info("Loan ID Returned on Save:" + model.loanAccount.id);
                                resp.loanProcessAction="PROCEED";
                                //reqData.loanProcessAction="PROCEED";
                                PageHelper.showLoader();
                                IndividualLoan.create(resp,function(resp,headers){
                                    $log.info(resp);
                                    PageHelper.showProgress("loan-create","Loan Created",5000);
                                    $state.go('Page.Landing', null);
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
                        }else{
                            reqData.loanProcessAction="PROCEED";
                            IndividualLoan.create(reqData,function(resp,headers){
                                model.loanAccount.id = resp.loanAccount.id;
                                $log.info("Loan ID Returned on Proceed:" + model.loanAccount.id);
                                PageHelper.showLoader();
                                $state.go('Page.Engine', {pageName: 'loans.individual.Queue', pageId: null});
                            },function(errResp){
                                $log.info(errResp);
                                PageHelper.showErrors(errResp);
                                PageHelper.showProgress("loan-create","Oops. An Error Occurred",5000);

                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });
                        }
                    });
                }
            }
        };
    }]);
