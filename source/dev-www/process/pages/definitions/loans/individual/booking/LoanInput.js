irf.pageCollection.factory(irf.page("loans.individual.booking.LoanInput"),
["$log","SessionStore","$state", "$stateParams", "SchemaResource","PageHelper","Enrollment","formHelper","IndividualLoan","Utils","$filter","$q","irfProgressMessage", "Queries","LoanProducts", "LoanBookingCommons", "BundleManager", "irfNavigator","PagesDefinition",
    function($log, SessionStore,$state,$stateParams, SchemaResource,PageHelper,Enrollment,formHelper,IndividualLoan,Utils,$filter,$q,irfProgressMessage, Queries,LoanProducts, LoanBookingCommons, BundleManager,irfNavigator,PagesDefinition){

        var branchId = SessionStore.getBranchId();
        var branchName = SessionStore.getBranch();
        var bankName = SessionStore.getBankName();
        var bankId;
        var showLoanBookingDetails = false;

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
            return true;
        }

        var navigateToQueue = function(model){
            if(model.currentStage=='LoanInitiation')
                $state.go('Page.Engine', {pageName: 'loans.individual.booking.InitiationQueue', pageId:null});
            if(model.currentStage=='PendingForPartner')
                $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingForPartnerQueue', pageId:null});
        };

        var populateLoanCustomerRelations = function(model){
            model.loanAccount.loanCustomerRelations = [];
            model.loanAccount.loanCustomerRelations.push({
                customerId: model.loanAccount.applicantId,
                urn: model.loanAccount.applicant,
                relation: 'Applicant',
                psychometricCompleted: "NO"
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

        var populateDisbursementDate = function(modelValue,form,model){
            if (modelValue){
                modelValue = new Date(modelValue);
                model._currentDisbursement.scheduledDisbursementDate = new Date(modelValue.setDate(modelValue.getDate()+1));
            }
        };


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
                model.loanAccount.disbursementSchedules[0].disbursementAmount = model.loanAccount.loanAmount;
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
            if (value != model.mainPartner)
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

        var clearProduct = function(value, model) {
            model.loanAccount.productCode = '';
        }

        return {
            "type": "schema-form",
            "title": "LOAN_INPUT",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                // TODO default values needs more cleanup
                model.currentStage = 'LoanInitiation';
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                model.loanView = SessionStore.getGlobalSetting("LoanViewPageName");
                model.loanHoldRequired = SessionStore.getGlobalSetting("loanHoldRequired");
                var init = function(model, form, formCtrl) {
                    model.loanAccount = model.loanAccount || {branchId :branchId};
                    model.additional = model.additional || {};
                    model.additional.branchName = branchName;
                    model.loanAccount.bankId = bankId;
                    model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                    model.loanAccount.disbursementSchedules=model.loanAccount.disbursementSchedules || [];
                    model.loanAccount.collateral=model.loanAccount.collateral || [{quantity:1}];
                    PageHelper.showLoader();
                    Queries.getGlobalSettings("mainPartner").then(function(value) {
                        model.loanAccount.partnerCode = model.loanAccount.partnerCode||value;
                        model.mainPartner = value;
                        $log.info("mainPartner:" + model.loanAccount.partnerCode);
                    }, function(err) {
                        $log.info("mainPartner is not available");
                    }).finally(function(){
                        PageHelper.hideLoader();
                    });
                    //model.loanAccount.partnerCode = model.loanAccount.partnerCode || "Kinara";
                    model.loanAccount.loanCustomerRelations = model.loanAccount.loanCustomerRelations || [];
                    model.loanAccount.coBorrowers = [];
                    model.loanAccount.guarantors = [];
                    model.showLoanBookingDetails = showLoanBookingDetails;

                    PagesDefinition.getPageConfig("Page/Engine/loans.individual.booking.LoanInput").then(function(data){
                        $log.info(data);
                        if(data.showLoanBookingDetails != undefined && data.showLoanBookingDetails !== null && data.showLoanBookingDetails !=""){
                            model.showLoanBookingDetails = data.showLoanBookingDetails;
                            model.BackedDatedDisbursement=data.BackedDatedDisbursement;
                            model.allowPreEmiInterest = data.allowPreEmiInterest;
                        }
                        //stateParams
                        console.log(model.BackedDatedDisbursement);
                        console.log(model.showLoanBookingDetails);
                    });
                    //model.loanAccount.guarantors = [];
                    for (var i = 0; i < model.loanAccount.loanCustomerRelations.length; i++) {
                        if (model.loanAccount.loanCustomerRelations[i].relation === 'APPLICANT' ||
                            model.loanAccount.loanCustomerRelations[i].relation === 'Applicant') {
                            model.loanAccount.applicantId = model.loanAccount.loanCustomerRelations[i].customerId;
                        }
                        else if (model.loanAccount.loanCustomerRelations[i].relation === 'COAPPLICANT' ||
                            model.loanAccount.loanCustomerRelations[i].relation === 'Co-Applicant') {
                            model.loanAccount.coBorrowers.push({
                                coBorrowerUrnNo:model.loanAccount.loanCustomerRelations[i].urn,
                                customerId:model.loanAccount.loanCustomerRelations[i].customerId
                            });
                        }
                        else if(model.loanAccount.loanCustomerRelations[i].relation === 'GUARANTOR' ||
                                model.loanAccount.loanCustomerRelations[i].relation === 'Guarantor'){
                            model.loanAccount.guarantors.push({
                                guaUrnNo:model.loanAccount.loanCustomerRelations[i].urn,
                                customerId:model.loanAccount.loanCustomerRelations[i].customerId
                            });
                        }
                    }
                    /*for (var i in model.loanAccount.loanCustomerRelations) {
                        var lcR = model.loanAccount.loanCustomerRelations[i];
                        if (lcR.relation === 'Co-Applicant') {
                            lcR.coBorrowerUrnNo = lcR.urn;
                            model.loanAccount.coBorrowers.push(lcR);
                        } else if (lcR.relation === 'Guarantor' && model.loanAccount.guarantors.length == 0) {
                            lcR.guaUrnNo = lcR.urn;
                            delete lcR.id;
                            model.loanAccount.guarantors.push(lcR);
                        }
                    }*/
                    /*
{
    customerId: null,
    id: 9914,
    loanId: 6140,
    relation: 'Applicant',
    relationShipWithApplicant: null,
    urn: null,
    version: 0
}
                    */

                    model.loanAccount.nominees=model.loanAccount.nominees || [{nomineeFirstName:"",nomineeDoorNo:""}];
                    if (model.loanAccount.nominees.length == 0)
                        model.loanAccount.nominees = [{nomineeFirstName:"",nomineeDoorNo:""}];
                    // if(model.loanAccount.nominees){
                    //     model.loanAccount.nominees[0].nomineeFirstName = model.loanAccount.nominees[0].nomineeFirstName || '';
                    //     model.loanAccount.nominees[0].nomineeDoorNo = model.loanAccount.nominees[0].nomineeDoorNo || '';
                    //     model.loanAccount.nominees[0].nomineeLocality = model.loanAccount.nominees[0].nomineeLocality || '';
                    //     model.loanAccount.nominees[0].nomineeStreet = model.loanAccount.nominees[0].nomineeStreet || '';
                    //     model.loanAccount.nominees[0].nomineePincode = model.loanAccount.nominees[0].nomineePincode || '';
                    //     model.loanAccount.nominees[0].nomineeDistrict = model.loanAccount.nominees[0].nomineeDistrict || '';
                    //     model.loanAccount.nominees[0].nomineeState = model.loanAccount.nominees[0].nomineeState || '';
                    //     model.loanAccount.nominees[0].nomineeRelationship = model.loanAccount.nominees[0].nomineeRelationship || '';
                    // }
                    model.loanAccount.loanApplicationDate = model.loanAccount.loanApplicationDate || Utils.getCurrentDate();
                    // model.loanAccount.commercialCibilCharge = 750; //Hard coded. This value to be changed to pickup from global_settings table
                    model.loanAccount.documentTracking = model.loanAccount.documentTracking || "PENDING";
                    model.loanAccount.isRestructure = false;
                    getSanctionedAmount(model);
                    $log.info(model);

                    // model.additional.minAmountForSecurityEMI = 0;
                    // Queries.getGlobalSettings("loan.individual.booking.minAmountForSecurityEMI").then(function(value){
                    //     model.additional.minAmountForSecurityEMI = Number(value);
                    //     $log.info("minAmountForSecurityEMI:" + model.additional.minAmountForSecurityEMI);
                    // },function(err){
                    //     $log.info("Max Security EMI is not available");
                    // });
                    if(model.loanAccount.productCode)
                        getProductDetails(model.loanAccount.productCode,model);

                    LoanBookingCommons.getLoanAccountRelatedCustomersLegacy(model.loanAccount);
                };
                // code for existing loan
                $log.info("Loan Number:::" + $stateParams.pageId);
                if ($stateParams.pageId) {
                    PageHelper.showLoader();
                    IndividualLoan.get({id: $stateParams.pageId}).$promise.then(function(resp){
                        if (resp.currentStage != 'LoanInitiation' && resp.currentStage != 'PendingForPartner') {
                            PageHelper.showProgress('load-loan', 'Loan is in different Stage', 2000);
                            $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue', pageId: null});
                            return;
                        }
                        $log.info("resp");
                        model.loanAccount = resp;
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
                        
                        if (model.loanAccount.disbursementSchedules.length >= 0 && _.isNumber(model.loanAccount.disbursementSchedules[0].moratoriumPeriodInDays)) {
                            model._currentDisbursement = model.loanAccount.disbursementSchedules[0];
                            model.loanAccount.scheduleStartDate = moment(model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate, "YYYY-MM-DD").add(model.loanAccount.disbursementSchedules[0].moratoriumPeriodInDays, 'days').format("YYYY-MM-DD");
                        }

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
                "condition": "model.siteCode != 'IFMRCapital'",
                "items":[
                    {
                            "type": "fieldset",
                            "title": "View Loan Details",
                            "condition":"model.loanAccount.id",
                            "items": [{
                                key: "loanAccount.ViewLoan",
                                type: "button",
                                title: "View Loan",
                                required: true,
                                onClick: "actions.viewLoan(model, formCtrl, form, $event)"
                            }]
                    },
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
                            "type": "select",
                            onChange:function(value,form,model){
                                partnerChange(value,model);
                                clearProduct(value, model);
                            }
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
                                "key": "loanAccount.productCategory",
                                "type":"select",
                                "title":"PRODUCT_CATEGORY",
                                "enumCode":"loan_product_category",
                                "required": true,
                                onChange: function(value, form, model) {
                                    clearProduct(value, model);
                                }
                            },
                            {
                                "key": "loanAccount.frequency",
                                "type":"select",
                                "enumCode":"loan_product_frequency",
                                "required": true,
                                onChange: function(value, form, model) {
                                    clearProduct(value, model);
                                }
                            },
                            {
                                "key": "loanAccount.productCode",
                                "title": "PRODUCT",
                                //"lovonly": true,
                                "type": "lov",
                                bindMap: {
                                 "Partner": "loanAccount.partnerCode",
                                 "ProductCategory": "loanAccount.productCategory",
                                 "Frequency": "loanAccount.frequency",
                                },
                               // autolov: true,
                                required: true,
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {

                                   return Queries.getLoanProductCode(model.loanAccount.productCategory,model.loanAccount.frequency,model.loanAccount.partnerCode);
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.loanAccount.productCode = valueObj.productCode;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.productCode
                                    ];
                                },
                                onChange: function(value, form, model) {
                                getProductDetails(value, model);
                                },
                                //"parentEnumCode": "partner",
                                //"parentValueExpr":"model.loanAccount.partnerCode"
                            },
                            {
                                "key": "loanAccount.tenure",
                                "title":"DURATION_IN_MONTHS",
                                "required": true
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
                                "key":"loanAccount.applicantId",
                                "title":"APPLICANT_ID",
                                "readonly": true
                            },
                            {
                                "type": "fieldset",
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
                        "title": "LOAN_DETAILS",
                        "items": [
                            {
                                "key": "loanAccount.transactionType",
                                "type":"select",
                                "title":"TRANSACTION_TYPE",
                                "condition": "model.siteCode == 'kinara'"
                            },
                            {
                                "key": "loanAccount.loanAmount",
                                "type":"amount",
                                "title":"LOAN_AMOUNT",
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
                                required: true,
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
                            {
                                "key": "loanAccount.fixedIntrestRate",
                                "title":"FIXED_INTREST_RETE",
                                "type": "number"
                            }
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
            },
            {
                "type": "box",
                "title": "LOAN_INPUT",
                "colClass": "col-sm-6",
                "condition": "model.siteCode == 'IFMRCapital'",
                "readonly": true,
                "items":[
                    {
                            "type": "fieldset",
                            "title": "View Loan Details",
                            "condition":"model.loanAccount.id",
                            "items": [{
                                key: "loanAccount.ViewLoan",
                                type: "button",
                                title: "View Loan",
                                required: true,
                                onClick: "actions.viewLoan(model, formCtrl, form, $event)"
                            }]
                    },
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
                            "type": "select",
                            onChange:function(value,form,model){
                                partnerChange(value,model);
                            }
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
                                "key": "loanAccount.productCategory",
                                "type":"select",
                                "title":"PRODUCT_CATEGORY",
                                "enumCode":"loan_product_category"
                            },
                            {
                                "key": "loanAccount.frequency",
                                "type":"select",
                                "enumCode":"loan_product_frequency"
                            },
                            {
                                "key": "loanAccount.productCode",
                                "title": "PRODUCT",
                                "lovonly": true,
                                "type": "lov",
                                bindMap: {
                                 "Partner": "loanAccount.partnerCode",
                                 "ProductCategory": "loanAccount.productCategory",
                                 "Frequency": "loanAccount.frequency",
                                },
                                autolov: true,
                                required: true,
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {

                                   return Queries.getLoanProductCode(model.loanAccount.productCategory,model.loanAccount.frequency,model.loanAccount.partnerCode);
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.loanAccount.productCode = valueObj.productCode;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.name
                                    ];
                                },
                                onChange: function(value, form, model) {
                                getProductDetails(value, model);
                                },
                                //"parentEnumCode": "partner",
                                //"parentValueExpr":"model.loanAccount.partnerCode"
                            },
                            {
                                "key": "loanAccount.tenure",
                                "title":"DURATION_IN_MONTHS"
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
                                "key":"loanAccount.applicantId",
                                "title":"APPLICANT_ID",
                                "readonly": true
                            },
                            {
                                "type": "fieldset",
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
                        "title": "LOAN_DETAILS",
                        "items": [
                            {
                                "key": "loanAccount.loanAmount",
                                "type":"amount",
                                "title":"LOAN_AMOUNT",
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
                                required: true,
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
                            {
                                "key": "loanAccount.fixedIntrestRate",
                                "title":"FIXED_INTREST_RETE",
                                "type": "number"
                            }
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
            },
            {
                "type": "box",
                "title": "UPDATE_ACCOUNT", // sample label code
                "colClass": "col-sm-6", // col-sm-6 is default, optional
                "condition": "model.showLoanBookingDetails",
                //"readonly": false, // default-false, optional, this & everything under items becomes readonly
                "items": [
                    {
                        "key": "_currentDisbursement.customerSignatureDate",
                        "title": "CUSTOMER_SIGNATURE_DATE",
                        "type": "date",
                        "required": true,
                        "onChange":function(modelValue,form,model){
                            populateDisbursementDate(modelValue,form,model);
                        }
                    },
                    {
                        "key": "_currentDisbursement.scheduledDisbursementDate",
                        "title": "SCHEDULED_DISBURSEMENT_DATE",
                        "type": "date",
                        "required": true,
                        "onChange": function(value ,form ,model, event){
                            if(!model.allowPreEmiInterest)
                                return;
                            var repaymentDate = moment(model.loanAccount.firstRepaymentDate,SessionStore.getSystemDateFormat());
                            var disbursementSchedules = moment(model._currentDisbursement.scheduledDisbursementDate,SessionStore.getSystemDateFormat());
                            if(model.loanAccount.scheduleStartDate == undefined || model.loanAccount.scheduleStartDate == null || model.loanAccount.scheduleStartDate == ""){
                                model._currentDisbursement.scheduledDisbursementDate = null;
                                PageHelper.showProgress("loan-create","Please Enter the Schedule Start Date date",5000);
                            }else{
                                var scheduleStartDate = moment(model.loanAccount.scheduleStartDate,SessionStore.getSystemDateFormat());
                                if(scheduleStartDate < disbursementSchedules){
                                    model._currentDisbursement.scheduledDisbursementDate = null;
                                    PageHelper.showProgress("loan-create","Disbursement date should be lesser than Schedule Start Date date",5000);
                                }
                            } 
                            if(repaymentDate < disbursementSchedules){
                                model._currentDisbursement.scheduledDisbursementDate = null;
                                PageHelper.showProgress("loan-create","Disbursement date should be lesser than Repayment date",5000);
                            }
                           
                        }
                    },
                    {
                        key: "loanAccount.emiPaymentDateRequested",
                        type: "string",
                        title: "EMI_PAYMENT_DATE_REQUESTED",
                        readonly: true
                    },
                    {
                        "key": "loanAccount.firstRepaymentDate",
                        "title": "REPAYMENT_DATE",
                        "type": "date",
                        "required": true,
                        "onChange": function(value ,form ,model, event){
                            if(!model.allowPreEmiInterest)
                                return;
                            var repaymentDate = moment(model.loanAccount.firstRepaymentDate,SessionStore.getSystemDateFormat());
                            var applicationDate = moment(model.loanAccount.loanApplicationDate,SessionStore.getSystemDateFormat());
                            if(repaymentDate < applicationDate){
                                model.loanAccount.firstRepaymentDate = null;
                                PageHelper.showProgress("loan-create","Repayment date should be greater than Application date",5000);
                            }
                        }
                    },
                    {
                        "key": "loanAccount.scheduleStartDate",
                        "title": "SCHEDULE_START_DATE",
                        "condition": "model.allowPreEmiInterest",
                        "type": "date",
                        "required": true
                    },
                ]
            },
            {
                "type":"box",
                "title":"COLLATERAL",
                "condition": "model.siteCode != 'IFMRCapital' && model.siteCode != 'IREPDhan'",
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
                "type":"box",
                "title":"COLLATERAL",
                "condition": "model.siteCode == 'IFMRCapital'",
                "readonly": true,
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
                "type":"box",
                "title":"COLLATERAL",
                "condition": "model.siteCode == 'IREPDhan'",
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
                                "key":"loanAccount.collateral[].propertyType",
                                "type":"select",
                                "enumCode": "collateral_property_type",
                                "required": true,
                            },
                            {
                                "key":"loanAccount.collateral[].extentOfProperty",
                            },
                            {
                                "key":"loanAccount.collateral[].extentOfPropertyUnit",
                                "condition": "model.loanAccount.collateral[arrayIndex].extentOfProperty",
                                "type": "select",
                                "enumCode": "property_extent_unit",
                                "required": true,

                            },
                            {
                                "key":"loanAccount.collateral[].documentType",
                                "type": "select",
                                "enumCode": "collateral_document_type",
                            },
                            {
                                "key":"loanAccount.collateral[].documentNumber"
                            },
                            {
                                "key":"loanAccount.collateral[].dateOfRegistration",
                                "title":"DATE_OF_REGISTRATION",
                                "type":"date",
                            },
                            {
                                "key":"loanAccount.collateral[].subRegistrar",
                            },
                            {
                                key: "loanAccount.collateral[].subRegistrarPincode",
                                type: "lov",
                                "title":"SUB_REGISTRAR_PINCODE",
                                fieldType: "number",
                                autolov: true,
                                inputMap: {
                                    "subRegistrarPincode": {
                                        key: "loanAccount.collateral[].subRegistrarPincode"
                                    },
                                    "subRegistrarVillage": {
                                        key: "loanAccount.collateral[].subRegistrarVillage"
                                    },
                                    "subRegistrarArea": {
                                        key: "loanAccount.collateral[].subRegistrarArea"
                                    },
                                    "subRegistrarDistrict": {
                                        key: "loanAccount.collateral[].subRegistrarDistrict"
                                    },
                                    "subRegistrarState": {
                                        key: "loanAccount.collateral[].subRegistrarState"
                                    }
                                },
                                outputMap: {
                                    "division": "loanAccount.collateral[arrayIndex].subRegistrarArea",
                                    "region": "loanAccount.collateral[arrayIndex].subRegistrarVillage",
                                    "pincode": "loanAccount.collateral[arrayIndex].subRegistrarPincode",
                                    "district": "loanAccount.collateral[arrayIndex].subRegistrarDistrict",
                                    "state": "loanAccount.collateral[arrayIndex].subRegistrarState",
                                },
                                searchHelper: formHelper,
                                initialize: function (inputModel) {
                                    $log.warn('in pincode initialize');
                                    $log.info(inputModel);
                                },
                                search: function (inputModel, form, model) {
                                    if (!inputModel.subRegistrarPincode) {
                                        return $q.reject();
                                    }
                                    return Queries.searchPincodes(
                                        inputModel.subRegistrarPincode,
                                        inputModel.subRegistrarDistrict,
                                        inputModel.subRegistrarState,
                                        inputModel.subRegistrarArea,
                                        inputModel.subRegistrarVillage
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
                            {
                                readonly: true,
                                key: "loanAccount.collateral[].subRegistrarArea",
                            },
                            {
                                readonly: true,
                                key: "loanAccount.collateral[].subRegistrarVillage",
                                screenFilter: true
                            },
                            {
                                readonly: true,
                                key: "loanAccount.collateral[].subRegistrarDistrict",
                                screenFilter: true
                            },
                            {
                                readonly: true,
                                key: "loanAccount.collateral[].subRegistrarState",
                                screenFilter: true
                            },
                            {
                                "key":"loanAccount.collateral[].propertyOwner",
                                "type": "select",
                                "enumCode": "collateral_property_Owner"
                            },
                            {
                                "key":"loanAccount.collateral[].propertyOwnerName",
                                "condition": "model.loanAccount.collateral[arrayIndex].propertyOwner == 'Others'",
                            },
                            {
                                "key":"loanAccount.collateral[].relationWithApplicant",
                                "condition": "model.loanAccount.collateral[arrayIndex].propertyOwner == 'Others'",
                                "type": "select",
                                "enumCode":"relation_with_business_owner"
                            },
                            {
                                "type": "fieldset",
                                "title": "PROPERTY_ADDRESS",
                                "items": [
                                    {
                                        "key":"loanAccount.collateral[].doorNo",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].surveyNo",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].landmark",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].village",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].mandal",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].district",
                                    },
                                    {
                                        "key":"loanAccount.collateral[].state",
                                    },
                                ]
                            }
                            /*,
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
                "condition": "model.siteCode != 'IFMRCapital'",
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
                                                model.loanAccount.portfolioInsuranceUrn = "";
                                                model.loanAccount.portfolioInsuranceCustomerName = "";
                                                break;
                                            }
                                            model.loanAccount.portfolioInsuranceUrn = model.loanAccount.applicant;
                                            model.loanAccount.portfolioInsuranceCustomerName = model.loanAccount.applicantName;
                                            break;
                                        case "coapplicant":
                                            if(_.isEmpty(model.loanAccount.coBorrowers)){
                                                Utils.alert("Co-Applicant is not captured for this Loan");
                                                model.additional.portfolioUrnSelector="";
                                                model.loanAccount.portfolioInsuranceUrn = "";
                                                model.loanAccount.portfolioInsuranceCustomerName = "";
                                                break;
                                            }
                                            model.loanAccount.portfolioInsuranceUrn = model.loanAccount.coBorrowers[0].coBorrowerUrnNo;
                                            model.loanAccount.portfolioInsuranceCustomerName = model.loanAccount.coBorrowers[0].coBorrowerName;
                                            break;
                                        case "guarantor":
                                            if(_.isEmpty(model.loanAccount.guarantors)){
                                                Utils.alert("Guarantor is not captured for this Loan");
                                                model.additional.portfolioUrnSelector="";
                                                model.loanAccount.portfolioInsuranceUrn = "";
                                                model.loanAccount.portfolioInsuranceCustomerName = "";
                                                break;
                                            }
                                            model.loanAccount.portfolioInsuranceUrn = model.loanAccount.guarantors[0].guaUrnNo;
                                            model.loanAccount.portfolioInsuranceCustomerName = model.loanAccount.guarantors[0].guaFirstName;
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
                                        "key": "loanAccount.disbursementSchedules[].moratoriumPeriodInDays",
                                        "condition": "!model.allowPreEmiInterest", 
                                        "title": "MORATORIUM_PERIOD",
                                        "type": "string"
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
                "type": "box",
                "title": "",
                "condition": "model.siteCode == 'IFMRCapital'",
                "readonly": true,
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
                                        "key": "loanAccount.disbursementSchedules[].moratoriumPeriodInDays",
                                        "title": "MORATORIUM_PERIOD",
                                        "type": "string"
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
                "condition": "model.siteCode != 'IFMRCapital' && false",
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
                "type":"box",
                "title":"Deprecated Items",
                "condition": "model.siteCode == 'IFMRCapital' && false",
                "readonly": true,
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
                "type":"box",
                "title":"Partner Remarks",
                "condition": "model.siteCode != 'IFMRCapital' && model.loanAccount.partnerApprovalStatus",
                "items":[
                    {
                        key:"loanAccount.partnerApprovalStatus",
                        title:"PARTNER_APPROVAL_STATUS"
                    },
                    {
                        key:"loanAccount.partnerRemarks",
                        title:"PARTNER_REMARKS"
                    },
                ]
            },
            {
                "type":"box",
                "title":"Partner Remarks",
                "condition": "model.siteCode == 'IFMRCapital' && model.loanAccount.partnerApprovalStatus",
                "readonly": true,
                "items":[
                    {
                        key:"loanAccount.partnerApprovalStatus",
                        title:"PARTNER_APPROVAL_STATUS"
                    },
                    {
                        key:"loanAccount.partnerRemarks",
                        title:"PARTNER_REMARKS"
                    },
                ]
            },
            {
                "type": "box",
                "title": "POST_REVIEW",
                "condition": "model.loanAccount.id",
                "items": [
                    {
                        key: "review.action",
                        condition: "model.currentStage == 'PendingForPartner' && model.loanHoldRequired!='NO'",
                        type: "radios",
                        titleMap: {
                            "REJECT": "REJECT",
                            "SEND_BACK": "SEND_BACK",
                            "PROCEED": "PROCEED",
                            "HOLD": "HOLD"
                        }
                    },
                    {
                        key: "review.action",
                        condition: "model.currentStage == 'LoanInitiation' && model.loanHoldRequired!='NO'",
                        type: "radios",
                        titleMap: {
                            "REJECT": "REJECT",
                            "PROCEED": "PROCEED",
                            "HOLD": "HOLD"
                        }
                    },
                    {
                        key: "review.action",
                        condition: "model.currentStage == 'PendingForPartner' && model.siteCode=='YES'",
                        type: "radios",
                        titleMap: {
                            "REJECT": "REJECT",
                            "SEND_BACK": "SEND_BACK",
                            "PROCEED": "PROCEED"
                        }
                    },
                    {
                        key: "review.action",
                        condition: "model.currentStage == 'LoanInitiation'&& model.siteCode=='YES'",
                        type: "radios",
                        titleMap: {
                            "REJECT": "REJECT",
                            "PROCEED": "PROCEED"
                        }
                    },
                    {
                        type: "section",
                        condition: "model.review.action=='REJECT'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
                                required: true
                            },
                            {
                                key: "loanAccount.rejectReason",
                                type: "lov",
                                autolov: true,
                                title: "REJECT_REASON",
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var stage1 = model.currentStage;

                                    if (model.currentStage == 'Application' || model.currentStage == 'ApplicationReview') {
                                        stage1 = "Application";
                                    }
                                    if (model.currentStage == 'FieldAppraisal' || model.currentStage == 'FieldAppraisalReview') {
                                        stage1 = "FieldAppraisal";
                                    }

                                    var rejectReason = formHelper.enum('application_reject_reason').data;
                                    var out = [];
                                    for (var i = 0; i < rejectReason.length; i++) {
                                        var t = rejectReason[i];
                                        if (t.field1 == stage1) {
                                             out.push({
                                                name: t.name,
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
                                onSelect: function(valueObj, model, context) {
                                    model.loanAccount.rejectReason = valueObj.name;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.name
                                    ];
                                }
                            },

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
                        condition: "model.review.action=='HOLD'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "review.remarks",
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
                        condition: "model.review.action=='SEND_BACK'",
                        items: [{
                            title: "REMARKS",
                            key: "review.remarks",
                            type: "textarea",
                            required: true
                        }, {
                            key: "review.targetStage",
                            title: "SEND_BACK_TO_STAGE",
                            type: "select",
                            condition: "model.currentStage == 'PendingForPartner'",
                            required: true,
                            titleMap: {
                                "LoanInitiation": "LoanInitiation"
                            },
                        }, {
                            key: "review.targetStage",
                            title: "SEND_BACK_TO_STAGE",
                            type: "select",
                            condition: "model.currentStage == 'LoanInitiation'",
                            required: true,
                            titleMap: {
                                "Screening": "Screening",
                                "ScreeningReview": "ScreeningReview",
                                "Application": "Application",
                                "ApplicationReview": "ApplicationReview",
                                "FieldAppraisal": "FieldAppraisal",
                                "FieldAppraisalReview": "FieldAppraisalReview",
                                "CentralRiskReview": "CentralRiskReview",
                                "LoanSanction": "LoanSanction"
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
                        condition: "model.review.action=='PROCEED'",
                        items: [
                            {
                                title: "REMARKS",
                                key: "review.remarks",
                                type: "textarea",
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
            {
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
            },/*,
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
                    if (!validateForm(formCtrl)){
                        return;
                    }
                    Utils.confirm("Are You Sure?").then(function(){
                        populateLoanCustomerRelations(model);
                        var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                        reqData.loanAccount.status = '';
                        reqData.loanProcessAction = "PROCEED";
                        reqData.stage = "Rejected";
                        if(reqData.loanAccount.frequency)
                            reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                        reqData.remarks = model.review.remarks;
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
                viewLoan: function(model, formCtrl, form, $event){
                    Utils.confirm("Save the data before proceed").then(function(){
                    $log.info("Inside ViewLoan()");
                        if(model.loanView) {
                            irfNavigator.go({
                                state: "Page.Bundle",
                                pageName: model.loanView,
                                pageId: model.loanAccount.id,
                                pageData: null
                            },
                            {
                                state : 'Page.Engine',
                                pageName: $stateParams.pageName,
                                pageId: $stateParams.pageId,
                                pageData: $stateParams.pageData
                            });
                        } else {
                            irfNavigator.go({
                                state: "Page.Bundle",
                                pageName: "loans.individual.screening.LoanView",
                                pageId: model.loanAccount.id,
                                pageData: null
                            },
                            {
                                state: "Page.Engine",
                                pageName: $stateParams.pageName,
                                pageId: $stateParams.pageId,
                                pageData: $stateParams.pageData
                            });
                        }
                    });


                },
                holdButton: function(model, formCtrl, form, $event){
                    $log.info("Inside save()");
                    Utils.confirm("Are You Sure?")
                        .then(
                            function(){
                                populateLoanCustomerRelations(model);
                                var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                                reqData.loanAccount.status = 'HOLD';
                                reqData.loanProcessAction = "SAVE";
                                if(reqData.loanAccount.frequency)
                                    reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                                reqData.remarks = model.review.remarks;
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

                    populateLoanCustomerRelations(model);
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
                    if (!_.hasIn(model.loanAccount, 'loanAmountRequested') || _.isNull(model.loanAccount.loanAmountRequested)){
                        model.loanAccount.loanAmountRequested = model.loanAccount.loanAmount;
                    }
                    if (!preLoanSaveOrProceed(model)){
                        return;
                    }
                    populateLoanCustomerRelations(model);
                    Utils.confirm("Are You Sure?")
                        .then(
                            function(){

                                var diffDays = 0;
                                var scheduleStartDate;
                                if (model.allowPreEmiInterest) {
                                    model.loanAccount.disbursementSchedules[0].customerSignatureDate = model._currentDisbursement.customerSignatureDate;
                                    model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate = model._currentDisbursement.scheduledDisbursementDate;
                                    if(model.loanAccount.scheduleStartDate)
                                        scheduleStartDate = moment(model.loanAccount.scheduleStartDate,SessionStore.getSystemDateFormat());
                                    if(model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate)
                                        var DisbursementDate = moment(model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate,SessionStore.getSystemDateFormat());
                                    if(model.loanAccount.scheduleStartDate && model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate)
                                        diffDays = scheduleStartDate.diff(moment(DisbursementDate.format(SessionStore.getSystemDateFormat())), "days");

                                    if (diffDays > 0) {
                                        model.loanAccount.firstRepaymentDate = scheduleStartDate.format("YYYY-MM-DD");
                                    }

                                    for (var i = 0; i < model.loanAccount.disbursementSchedules.length; i++) {
                                        model.loanAccount.disbursementSchedules[i].moratoriumPeriodInDays = diffDays;
                                    }
                                }
                                
                                var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                                 if(!$stateParams.pageId)
                                {
                                    $log.info("hi i am in the if and else no bad");
                                    reqData.loanAccount.currentStage ='LoanInitiation';
                                    reqData.loanAccount.loanAmountRequested =reqData.loanAccount.loanAmount;
                                    $log.info(reqData.loanAccount.currentStage);
                                }
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
                proceed: function(model, form, formName) {
                    $log.info(model);
                    PageHelper.clearErrors();

                    if (!validateForm(form)){
                        return;
                    }

                    model.loanAccount.psychometricCompleted = model.loanAccount.psychometricCompleted || "N";

                    if (model.additional.product && !_.isNull(model.additional.product.numberOfGuarantors) && model.additional.product.numberOfGuarantors>0 ){
                        if (!_.isArray(model.loanAccount.guarantors) || model.loanAccount.guarantors.length == 0){
                            PageHelper.showProgress('loan-product-guarantor-required', 'Guarantor is mandatory for the selected product', 5000);
                            return;
                        }
                    }

                    model.loanAccount.loanPurpose3 = model.loanAccount.loanPurpose2;
                    if (model.loanAccount.coBorrowers && model.loanAccount.coBorrowers.length && model.loanAccount.applicant === model.loanAccount.coBorrowers[0].coBorrowerUrnNo) {
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
                            if (model.loanAccount.coBorrowers && model.loanAccount.coBorrowers.length && model.loanAccount.coBorrowers[0].coBorrowerUrnNo === model.loanAccount.guarantors[i].guaUrnNo) {
                                PageHelper.showProgress("loan-create","Co-Applicant & Guarantor cannot be same",5000);
                                return false;
                            }
                        }
                    }
                    var diffDays = 0;
                    var scheduleStartDate;
                    if (model.allowPreEmiInterest) {
                        model.loanAccount.disbursementSchedules[0].customerSignatureDate = model._currentDisbursement.customerSignatureDate;
                        model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate = model._currentDisbursement.scheduledDisbursementDate;
                        if(model.loanAccount.scheduleStartDate)
                            scheduleStartDate = moment(model.loanAccount.scheduleStartDate,SessionStore.getSystemDateFormat());
                        if(model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate)
                            var DisbursementDate = moment(model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate,SessionStore.getSystemDateFormat());
                        if(model.loanAccount.scheduleStartDate && model.loanAccount.disbursementSchedules[0].scheduledDisbursementDate)
                            diffDays = scheduleStartDate.diff(moment(DisbursementDate.format(SessionStore.getSystemDateFormat())), "days");

                        if (diffDays > 0) {
                            model.loanAccount.firstRepaymentDate = scheduleStartDate.format("YYYY-MM-DD");
                        }

                        for (var i = 0; i < model.loanAccount.disbursementSchedules.length; i++) {
                            model.loanAccount.disbursementSchedules[i].moratoriumPeriodInDays = diffDays;

                        }
                    }

                    /*if (model.additional.product && model.additional.product.productType != 'OD' && model.additional.minAmountForSecurityEMI > 0){
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
                        model.loanAccount.securityEmiRequired = model.loanAccount.securityEmiRequired || 'No';*/
                    model.loanAccount.securityEmiRequired = model.loanAccount.securityEmiRequired || 'NO';

                    var trancheTotalAmount=0;
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
                            if (model.loanAccount.loanAmount < model.additional.product.amountFrom){
                                PageHelper.showProgress("loan-create","Loan Amount requested should be in the range [" + model.additional.product.amountFrom + " - " + model.additional.product.amountTo + "]",5000);
                                return false;
                            }
                            if (model.loanAccount.loanAmount > model.additional.product.amountTo){
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

                    // BUG FIX DO-customer id going null
                    populateLoanCustomerRelations(model);

                    if(model.loanAccount.portfolioInsuranceUrn){
                        model.loanAccount.portfolioInsurancePremiumCalculated = "Yes";
                    }
                    if(model.loanAccount.currentStage == 'LoanInitiation' && model.loanAccount.partnerCode == model.mainPartner && model.loanAccount.productCode == null){
                        PageHelper.showProgress("loan-create","Product Code is mandatory",5000);
                        return false;
                    }
                    if(model.loanAccount.currentStage == 'PendingForPartner' && model.loanAccount.productCode == null){
                        PageHelper.showProgress("loan-create","Product Code is mandatory",5000);
                        return false;
                    }

                    if (!_.hasIn(model.loanAccount, 'loanAmountRequested') || _.isNull(model.loanAccount.loanAmountRequested)){
                        model.loanAccount.loanAmountRequested = model.loanAccount.loanAmount;
                    }

                    if (model.siteCode != 'sambandh') {
                        $log.info("inside sam");
                        var cbsdate=SessionStore.getCBSDate();
                        if( model._currentDisbursement && model._currentDisbursement.scheduledDisbursementDate)
                        {
                            var scheduledDisbursementDate = moment(model._currentDisbursement.scheduledDisbursementDate,SessionStore.getSystemDateFormat());
                            var cbsmonth = ((new Date(cbsdate)).getMonth());
                            var dismonth = ((new Date(scheduledDisbursementDate)).getMonth());

                            if (model.BackedDatedDisbursement && model.BackedDatedDisbursement == "ALL") {
                                if (scheduledDisbursementDate.diff(cbsdate, "days") < 0) {
                                    PageHelper.showProgress("loan-create", "scheduledDisbursementDate date should be greater than CBS date", 5000);
                                    return false;
                                }
                            }
                            if (model.BackedDatedDisbursement && model.BackedDatedDisbursement == "CURRENT_MONTH") {
                                if (scheduledDisbursementDate.diff(cbsdate, "days") < 0 && (cbsmonth !== dismonth)) {
                                    PageHelper.showProgress("loan-create", "scheduledDisbursementDate date should not be a previous month of CBS date", 5000);
                                    return false;
                                }
                            }
                        }
                    }



                    var reqData = _.cloneDeep(model);
                    // if(reqData.loanAccount.frequency)
                    //     reqData.loanAccount.frequency = reqData.loanAccount.frequency[0];
                    Utils.confirm("Are You Sure?").then(function(){
                        PageHelper.showLoader();
                        if (!$stateParams.pageId && !model.loanAccount.id) {
                            reqData.loanProcessAction="SAVE";
                            reqData.remarks = model.review.remarks;
                            IndividualLoan.create(reqData,function(resp,headers){
                                delete resp.$promise;
                                delete resp.$resolved;
                                $log.info(resp);
                                //model.loanAccount.id = resp.loanAccount.id;
                                $log.info("Loan ID Returned on Save:" + model.loanAccount.id);
                                resp.loanProcessAction="PROCEED";
                                if(resp.loanAccount.currentStage == 'LoanInitiation' && resp.loanAccount.partnerCode == model.mainPartner)
                                    resp.stage = 'LoanBooking';

                                if(resp.loanAccount.currentStage == 'PendingForPartner' && resp.loanAccount.partnerCode !== 'DO Partner1-IC')
                                {
                                    resp.stage = 'LoanBooking';
                                     $log.info("printing in if ");
                                    $log.info(model.loanAccount.partnerCode);
                                }
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
                            reqData.remarks = model.review.remarks;
                            if(model.loanAccount.currentStage == 'LoanInitiation' && model.loanAccount.partnerCode == model.mainPartner)
                                reqData.stage = 'LoanBooking';

                            if(model.loanAccount.currentStage == 'PendingForPartner' && model.loanAccount.partnerCode !=='DO Partner1-IC')
                                {
                                    $log.info("printing in else ");
                                    $log.info(model.loanAccount.partnerCode);
                                    reqData.stage = 'LoanBooking';
                                }
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
