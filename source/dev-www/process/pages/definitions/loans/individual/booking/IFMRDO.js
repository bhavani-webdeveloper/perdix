irf.pageCollection.factory(irf.page("loans.individual.booking.IFMRDO"),
["$log","SessionStore","$state", "$stateParams","irfNavigator", "SchemaResource","PageHelper","Enrollment","formHelper","IndividualLoan","Utils","$filter","$q","irfProgressMessage", "Queries","LoanProducts", "LoanBookingCommons", "BundleManager",
    function($log, SessionStore,$state,$stateParams,irfNavigator, SchemaResource,PageHelper,Enrollment,formHelper,IndividualLoan,Utils,$filter,$q,irfProgressMessage, Queries,LoanProducts, LoanBookingCommons, BundleManager){

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

        var validateForm = function(formCtrl){
            formCtrl.scope.$broadcast('schemaFormValidate');
            if (formCtrl && formCtrl.$invalid) {
                PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                return false;
            }
            return true;
        };

        var preLoanSaveOrProceed = function(model){
            var loanAccount = model.loanAccount;

            if (_.hasIn(loanAccount, 'guarantors') && _.isArray(loanAccount.guarantors)){
                for (var i=0;i<loanAccount.guarantors.length; i++){
                    var guarantor = loanAccount.guarantors[i];
                    if (!_.hasIn(guarantor, 'guaUrnNo') || _.isNull(guarantor, 'guaUrnNo')){
                        PageHelper.showProgress("pre-save-validation", "All guarantors should complete the enrolment before proceed",5000);
                        return false;
                    }

                }
            }

            if (_.hasIn(loanAccount, 'collateral') && _.isArray(loanAccount.collateral)){
                _.forEach(loanAccount.collateral, function(collateral){
                    if (!_.hasIn(collateral, "id") || _.isNull(collateral.id)){
                        /* ITS A NEW COLLATERAL ADDED */
                        collateral.quantity = collateral.quantity || 1;
                        collateral.loanToValue = collateral.collateralValue;
                        collateral.totalValue = collateral.loanToValue * collateral.quantity;
                    }
                })
            }

            // Psychometric Required for applicants & co-applicants
            if (_.isArray(loanAccount.loanCustomerRelations)) {
                var enterpriseCustomerRelations = model._bundleModel.business.enterpriseCustomerRelations;
                for (i in loanAccount.loanCustomerRelations) {
                    if (loanAccount.loanCustomerRelations[i].relation == 'Applicant') {
                        loanAccount.loanCustomerRelations[i].psychometricRequired = 'YES';
                    } else if (loanAccount.loanCustomerRelations[i].relation == 'Co-Applicant') {
                        if (_.isArray(enterpriseCustomerRelations)) {
                            var psychometricRequiredUpdated = false;
                            for (j in enterpriseCustomerRelations) {
                                if (enterpriseCustomerRelations[j].linkedToCustomerId == loanAccount.loanCustomerRelations[i].customerId && _.lowerCase(enterpriseCustomerRelations[j].businessInvolvement) == 'full time') {
                                    loanAccount.loanCustomerRelations[i].psychometricRequired = 'YES';
                                    psychometricRequiredUpdated = true;
                                }
                            }
                            if (!psychometricRequiredUpdated) {
                                loanAccount.loanCustomerRelations[i].psychometricRequired = 'NO';
                            }
                        } else {
                            loanAccount.loanCustomerRelations[i].psychometricRequired = 'NO';
                        }
                    } else {
                        loanAccount.loanCustomerRelations[i].psychometricRequired = 'NO';
                    }
                    if (!loanAccount.loanCustomerRelations[i].psychometricCompleted) {
                        loanAccount.loanCustomerRelations[i].psychometricCompleted = 'NO';
                    }
                }
            }
            
            return true;
        }

        var navigateToQueue = function(model){
            if(model.currentStage=='LoanInitiation')
                $state.go('Page.Engine', {pageName: 'loans.individual.booking.InitiationQueue', pageId:null});
            if(model.currentStage=='PendingForPartner')
                $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingForPartnerQueue', pageId:null});
            if(model.currentStage=='IfmrDO')
                $state.go('Page.Engine', {pageName: 'loans.individual.booking.IFMRDOQueue', pageId:null});
        };

        var populateLoanCustomerRelations = function(model){
            model.loanAccount.loanCustomerRelations = [];
            model.loanAccount.loanCustomerRelations.push({
                customerId: model.loanAccount.applicantId,
                urn: model.loanAccount.applicant,
                relation: 'Applicant'
            });
            if (model.loanAccount.coBorrowers && model.loanAccount.coBorrowers.length) {
                for (var i in model.loanAccount.coBorrowers) {
                    var coB = model.loanAccount.coBorrowers[i];
                    if (coB.urn || coB.customerId) {
                        coB.relation = 'Co-Applicant';
                        coB.urn = coB.coBorrowerUrnNo;
                        coB.customerId = coB.customerId;
                        model.loanAccount.loanCustomerRelations.push(coB);
                    }
                }
            }
            if (model.loanAccount.guarantors && model.loanAccount.guarantors.length) {
                for (var i in model.loanAccount.guarantors) {
                    var gua = model.loanAccount.guarantors[i];
                    if (gua.urn || gua.customerId) {
                        gua.relation = 'Guarantor';
                        gua.urn = gua.guaUrnNo;
                        gua.customerId = gua.customerId;
                        model.loanAccount.loanCustomerRelations.push(gua);
                    }
                }
            }
        }

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
                        model.loanAccount.frequency = model.additional.product.frequency;
                        // if (model.additional.product.frequency == 'M')
                        //     model.loanAccount.frequency = 'Monthly';
                        if(model.loanAccount.loanPurpose1!=null){
                            var purpose1_found = false;
                            Queries.getLoanPurpose1(model.loanAccount.productCode).then(function(resp1){
                                loanPurpose1List = [];
                                loanPurpose1List = resp1.body;
                                if(loanPurpose1List && loanPurpose1List.length>0){
                                    for (var i = loanPurpose1List.length - 1; i >= 0; i--) {
                                        if(model.loanAccount.loanPurpose1 == loanPurpose1List[i].purpose1)
                                            purpose1_found = true;
                                    }
                                    if(!purpose1_found)
                                        model.loanAccount.loanPurpose1 = null;
                                }
                                else
                                    model.loanAccount.loanPurpose1 = null;

                                if(model.loanAccount.loanPurpose2!=null){
                                    var purpose2_found = false;
                                    Queries.getLoanPurpose2(model.loanAccount.productCode, model.loanAccount.loanPurpose1).then(function(resp2){
                                        loanPurpose2List = [];
                                        loanPurpose2List = resp2.body;
                                        if(loanPurpose2List && loanPurpose2List.length>0){
                                            for (var i = loanPurpose2List.length - 1; i >= 0; i--) {
                                                if(model.loanAccount.loanPurpose2 == loanPurpose2List[i].purpose2)
                                                    purpose2_found = true;
                                            }
                                            if(!purpose2_found)
                                                model.loanAccount.loanPurpose2 = null;
                                        }
                                        else
                                            model.loanAccount.loanPurpose2 = null;
                                    },function(err){
                                        $log.info("Error while fetching Loan Purpose 1 by Product");
                                    });
                                }
                            },function(err){
                                $log.info("Error while fetching Loan Purpose 1 by Product");
                            });
                        }
                    },
                    function(httpRes){
                        PageHelper.showProgress('loan-create', 'Failed to load the Product details. Try again.', 4000);
                        PageHelper.showErrors(httpRes);
                        PageHelper.hideLoader();
                    }
                )
        }

        var partnerChange=function (value,model){
            if (value != 'Kinara')
            {
                try
                {
                    delete model.additional.product;
                    model.loanAccount.frequency = null;
                    model.loanAccount.productCode = null;
                }
                catch(err){
                    console.error(err);
                }
            }
        }

        return {
            "type": "schema-form",
            "title": "LOAN_INPUT",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                // TODO default values needs more cleanup
                model.currentStage = 'LoanInitiation';

                // code for existing loan
                $log.info("Loan Number:::" + $stateParams.pageId);
                if ($stateParams.pageId) {
                    PageHelper.showLoader();
                    IndividualLoan.get({id: $stateParams.pageId}).$promise.then(function(resp){
                        if (resp.currentStage != 'LoanInitiation' && resp.currentStage != 'PendingForPartner' && resp.currentStage != 'IfmrDO') {
                            PageHelper.showProgress('load-loan', 'Loan is in different Stage', 2000);
                            $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue', pageId: null});
                            return;
                        }
                        
                        model.loanAccount = resp;

                        $log.info(model.loanAccount);
                        model.currentStage = resp.currentStage;

                        model.additional = model.additional || {};

                        if (model.loanAccount.portfolioInsuranceUrn == model.loanAccount.applicant){
                            model.additional.portfolioUrnSelector = "applicant";
                        }

                        if (model.loanAccount.guarantors && model.loanAccount.guarantors.length > 0 && model.loanAccount.guarantors[0].guaUrnNo == model.loanAccount.portfolioInsuranceUrn){
                            model.additional.portfolioUrnSelector = "guarantor";
                        }

                        if (model.loanAccount.coBorrowers && model.loanAccount.coBorrowers.length > 0 && model.loanAccount.coBorrowers[0].coBorrowerUrnNo == model.loanAccount.portfolioInsuranceUrn){
                            model.additional.portfolioUrnSelector = "coapplicant";
                        }

                        //init(model, form, formCtrl); // init call
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
                // "readonly":true,
                "title": "LOAN_INPUT",
                "colClass": "col-sm-6",

                "items":[
                    {
                            "type": "fieldset",
                            "title": "View Loan Details",
                            "condition":"model.loanAccount.id",
                            "items": [{
                                key: "loanAccount.ViewLoan1",
                                type: "button",
                                title: "View Loan",
                                onClick: "actions.viewLoan(model, formCtrl, form, $event)"
                            }]
                    },
                    {
                    "type":"fieldset",
                    "readonly":true,
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
                            "type": "select",
                            onChange:function(value,form,model){
                                partnerChange(value,model);
                            }
                        }]
                    },
                    {
                        "type": "fieldset",
                        "readonly":true,
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
                                "parentEnumCode": "partner",
                                "parentValueExpr":"model.loanAccount.partnerCode",
                                "condition":"(model.loanAccount.currentStage == 'LoanInitiation' && model.loanAccount.partnerCode == 'Kinara') || model.loanAccount.currentStage != 'LoanInitiation'"
                            },
                            {
                                "key": "loanAccount.tenure",
                                "title":"DURATION_IN_MONTHS"
                            },
                            {
                                "key": "loanAccount.frequency",
                                "type":"string",
                                "readonly":true
                            }
                        ]
                    },
                    {
                        "type": "fieldset",
                        "readonly":true,
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
                                    "firstName":"loanAccount.entityName",
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
                                "key": "loanAccount.entityName",
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
                                    "id": "loanAccount.applicantId",
                                    "urnNo": "loanAccount.applicant",
                                    "firstName":"loanAccount.applicantName"
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
                                "key":"loanAccount.applicantName",
                                "title":"APPLICANT_NAME",
                                "readonly": true
                            },
                            {
                                "type": "fieldset",
                                "readonly":true,
                                "title": "COAPPLICANTS",
                                "items": [
                                    {
                                        "key": "loanAccount.coBorrowers",
                                        "title": "COAPPLICANTS",
                                        "titleExpr": "model.loanAccount.coBorrowers[arrayIndex].customerId + ': ' + model.loanAccount.coBorrowers[arrayIndex].coBorrowerName",
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
                                                    "id": "loanAccount.coBorrowers[arrayIndex].customerId",
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
                        "readonly":true,
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
                                type:"select",
                                enumCode: "decisionmaker"
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
                                    if(model.loanAccount.productCode != null)
                                        return Queries.getLoanPurpose1(model.loanAccount.productCode);
                                    else
                                        return Queries.getAllLoanPurpose1();
                                    
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.purpose1
                                    ];
                                },
                                onSelect: function(result, model, context) {
                                    model.loanAccount.loanPurpose2 = '';
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
                                    if(model.loanAccount.productCode != null)
                                        return Queries.getLoanPurpose2(model.loanAccount.productCode, model.loanAccount.loanPurpose1);
                                    else
                                        return Queries.getAllLoanPurpose2(model.loanAccount.loanPurpose1);
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.purpose2
                                    ];
                                }
                            },
                            /*{
                                title: "BUSINESS_INCOME",
                                //type: "amount",
                                key: "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf3",
                                required: true
                            },
                            {
                                title: "LOAN_PURPOSE_VALUE",
                                //type: "amount",
                                key: "loanAccount.accountUserDefinedFields.userDefinedFieldValues.udf4"
                            }*/
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
                "readonly":true,
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
                "readonly":true,
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
                                            "firstName":"loanAccount.guarantors[arrayIndex].guaFirstName",
                                            "id":"loanAccount.guarantors[arrayIndex].customerId"
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
                        "readonly":true,
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
                                            if(_.isEmpty(model.loanAccount.coBorrowers)){
                                                Utils.alert("Please Select a Co-Applicant");
                                                model.additional.portfolioUrnSelector="";
                                                break;
                                            }
                                            model.loanAccount.portfolioInsuranceUrn = model.loanAccount.coBorrowers[0].coBorrowerUrnNo;
                                            break;
                                        case "guarantor":
                                            if(_.isEmpty(model.loanAccount.guarantors)){
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
                            },
                            {
                                key: "loanAccount.portfolioInsuranceCustomerName",
                                title: "NAME",
                                readonly: true
                            }
                        ]
                    },
                    {
                        "type":"fieldset",
                        "readonly":true,
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
                        "readonly":true,
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
                "readonly":true,
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
                "type": "box",
                "title": "POST_REVIEW",
                "condition": "model.loanAccount.id",
                "items": [
                    {
                        key: "loanAccount.partnerApprovalStatus",
                        condition: "model.currentStage == 'IfmrDO'",
                        type: "radios",
                        titleMap: {
                            "DECLINE": "DECLINE",
                            "ACCEPT": "ACCEPT",
                            "HOLD": "HOLD"
                        }
                    },
                    {
                        type: "section",
                        condition: "model.loanAccount.partnerApprovalStatus=='DECLINE'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "loanAccount.partnerRemarks",
                                required: true
                            },
                            /*{
                                key: "loanAccount.rejectReason",
                                type: "select",
                                title: "REJECT_REASON",
                                titleMap: {
                                "LoanInitiation": "LoanInitiation"
                            },
                            },*/   
                            {
                                key: "review.rejectButton",
                                type: "button",
                                title: "REJECT",
                                required: true,
                                onClick: "actions.reject(model, formCtrl, form, $event)"
                            }
                        ]
                    },
                    {
                        type: "section",
                        condition: "model.loanAccount.partnerApprovalStatus=='HOLD'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "loanAccount.partnerRemarks",
                                type: "textarea",
                                required: true
                            },
                            {
                                key: "review.holdButton",
                                type: "button",
                                title: "HOLD",
                                required: true,
                                onClick: "actions.holdButton(model, formCtrl, form, $event)"
                            }
                        ]
                    },
                    {
                        type: "section",
                        condition: "model.loanAccount.partnerApprovalStatus=='SEND_BACK'",
                        items: [{
                            title: "REMARKS",
                            key: "loanAccount.partnerRemarks",
                            required: true
                        }, {
                            key: "review.targetStage",
                            title: "SEND_BACK_TO_STAGE",
                            type: "select",
                            condition: "model.currentStage == 'IfmrDO'",
                            required: true,
                            titleMap: {
                                "PendingForPartner": "PendingForPartner"
                            },
                        }, {
                            key: "review.sendBackButton",
                            type: "button",
                            title: "SEND_BACK",
                            onClick: "actions.sendBack(model, formCtrl, form, $event)"
                        }]
                    },
                    {
                        type: "section",
                        condition: "model.loanAccount.partnerApprovalStatus=='ACCEPT'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "loanAccount.partnerRemarks",
                                required: true
                            },
                            {
                                key: "review.proceedButton",
                                type: "button",
                                title: "PROCEED",
                                onClick: "actions.proceed(model, formCtrl, form, $event)"
                            }
                        ]
                    }
                ]
            },
            /*{
                "type": "actionbox",
                //"condition": "model.loanAccount.customerId  && !(model.currentStage=='ScreeningReview')",
                "condition": "model.loanAccount.customerId",
                "items": [
                    {
                        "type": "button",
                        "icon": "fa fa-circle-o",
                        "title": "SAVE",
                        "onClick": "actions.save(model, formCtrl, form, $event)"
                    }
                ]
            }*/ /*,
            {
                "type": "actionbox",
                "items": [\*{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                },*\
                {
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }*/],
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
                reject: function(model, formCtrl, form, $event){
                    $log.info("Inside reject()");
                   /* if (!validateForm(formCtrl)){
                        return;
                    }*/
                    Utils.confirm("Are You Sure?").then(function(){

                        var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                        reqData.loanAccount.status = '';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.stage = "LoanInitiation";
                        if(reqData.loanAccount.frequency)
                            reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                        reqData.remarks = model.loanAccount.partnerRemarks;
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res){
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                return navigateToQueue(model);
                            }, function(httpRes){
                                PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                    })
                },
                 viewLoan: function(model, formCtrl, form, $event) {
                    Utils.confirm("Save the data before proceed").then(function() {
                        $log.info("Inside ViewLoan()");
                        irfNavigator.go({
                            state: "Page.Bundle",
                            pageName: "loans.individual.screening.LoanView",
                            pageId: model.loanAccount.id
                        }, {
                            state: "Page.Engine",
                            pageName: "loans.individual.booking.IFMRDO",
                            pageId: model.loanAccount.id
                        });
                    });
                },
                holdButton: function(model, formCtrl, form, $event){
                    $log.info("Inside save()");
                    Utils.confirm("Are You Sure?")
                        .then(
                            function(){
                                var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                                reqData.loanAccount.status = 'HOLD';
                                reqData.loanProcessAction = "SAVE";
                                if(reqData.loanAccount.frequency)
                                    reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                                reqData.remarks = model.loanAccount.partnerRemarks;
                                PageHelper.showLoader();
                                IndividualLoan.create(reqData)
                                    .$promise
                                    .then(function(res){
                                        return navigateToQueue(model);
                                    }, function(httpRes){
                                        PageHelper.showErrors(httpRes);
                                    })
                                    .finally(function(httpRes){
                                        PageHelper.hideLoader();
                                    })
                            }
                        );
                },
                sendBack: function(model, formCtrl, form, $event){
                    $log.info("Inside sendBack()");
                    Utils.confirm("Are You Sure?").then(function(){
                        var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                        reqData.loanAccount.status = '';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.remarks = model.review.remarks;
                        reqData.stage = model.review.targetStage;
                        reqData.remarks = model.review.remarks;
                        if(reqData.loanAccount.frequency)
                            reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                        PageHelper.showLoader();
                        PageHelper.showProgress("update-loan", "Working...");
                        IndividualLoan.update(reqData)
                            .$promise
                            .then(function(res){
                                PageHelper.showProgress("update-loan", "Done.", 3000);
                                return navigateToQueue(model);
                            }, function(httpRes){
                                PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                    })

                },
                save: function(model, formCtrl, form, $event){
                    $log.info("Inside save()");
                    PageHelper.clearErrors();

                    /* TODO Call save service for the loan */

                    Utils.confirm("Are You Sure?")
                        .then(
                            function(){
                                populateLoanCustomerRelations(model);
                                var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                                reqData.loanAccount.status = '';
                                reqData.loanProcessAction = "SAVE";
                                //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                                // reqData.remarks = model.review.remarks;
                                reqData.loanAccount.screeningDate = reqData.loanAccount.screeningDate || Utils.getCurrentDate();
                                reqData.loanAccount.psychometricCompleted = reqData.loanAccount.psychometricCompleted || "N";
                                
                                
                                
                                PageHelper.showLoader();

                                var completeLead = false;
                                if (!_.hasIn(reqData.loanAccount, "id")){
                                    completeLead = true;
                                }
                                IndividualLoan.create(reqData)
                                    .$promise
                                    .then(function(res){
                                        model.loanAccount = res.loanAccount;
                                        $state.go("Page.Engine",{pageName:"loans.individual.booking.LoanInput", pageId: model.loanAccount.id}, {reload:true});
                                    }, function(httpRes){
                                        PageHelper.showErrors(httpRes);
                                    })
                                    .finally(function(httpRes){
                                        PageHelper.hideLoader();
                                    })
                            }
                        );
                },
                // viewLoan: function(model, formCtrl, form, $event){
                //     Utils.confirm("Save the data before proceed").then(function(){
                //     $log.info("Inside ViewLoan()");
                //     $state.go("Page.Bundle", {
                //     pageName: "loans.individual.screening.LoanView",
                //     pageId: model.loanAccount.id
                //     });   
                //     })
                // },
                 viewLoan: function(model, formCtrl, form, $event) {
                    Utils.confirm("Save the data before proceed").then(function() {
                        $log.info("Inside ViewLoan()");
                        irfNavigator.go({
                            state: "Page.Bundle",
                            pageName: "loans.individual.screening.LoanView",
                            pageId: model.loanAccount.id
                        }, {
                             state: "Page.Engine",
                            pageName: "loans.individual.booking.IFMRDO",
                            pageId: model.loanAccount.id
                        });
                    });
                },
                proceed: function(model, form, formName) {
                    $log.info(model);
                    PageHelper.clearErrors();

                    if(model.loanAccount.portfolioInsuranceUrn != ''){
                        model.loanAccount.portfolioInsurancePremiumCalculated = "Yes";
                    }
                    if(model.loanAccount.currentStage == 'LoanInitiation' && model.loanAccount.partnerCode == 'Kinara' && model.loanAccount.productCode == null){
                        PageHelper.showProgress("loan-create","Product Code is mandatory",5000);
                        return false;
                    }
                    if(model.loanAccount.currentStage == 'PendingForPartner' && model.loanAccount.productCode == null){
                        PageHelper.showProgress("loan-create","Product Code is mandatory",5000);
                        return false;
                    }

                    var reqData = _.cloneDeep(model);
                    // if(reqData.loanAccount.frequency)
                    //     reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                    Utils.confirm("Are You Sure?").then(function(){
                        PageHelper.showLoader();
                        if (!$stateParams.pageId && !model.loanAccount.id) {
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
                                IndividualLoan.update(resp,function(resp,headers){
                                    $log.info(resp);
                                    PageHelper.showProgress("loan-create","Loan Created",5000);
                                    $state.go('Page.Engine', {pageName: 'loans.individual.booking.InitiationQueue', pageId: null});
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
                
                                reqData.stage = 'LoanBooking';
                            IndividualLoan.update(reqData,function(resp,headers){
                                model.loanAccount.id = resp.loanAccount.id;
                                $log.info("Loan ID Returned on Proceed:" + model.loanAccount.id);
                                PageHelper.showLoader();
                                // $state.go('Page.Engine', {pageName: 'loans.individual.booking.InitiationQueue', pageId: null});
                                return navigateToQueue(model);
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
