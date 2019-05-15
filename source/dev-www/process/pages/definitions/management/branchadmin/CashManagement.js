define(['perdix/infra/api/AngularResourceService'], function (AngularResourceService) {
    return {
        pageUID: "management.branchadmin.CashManagement",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository","irfNavigator","Transaction","BranchCreationResource"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository,irfNavigator,Transaction,BranchCreationResource) {

            AngularResourceService.getInstance().setInjector($injector);
            return {
                "type": "schema-form",
                "title": "EOD_CASH_BALANCE",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    };
                    model.cashManagement={};
                    model.cashManagement.eodCashBalanceDto={};
                    model.cashManagement.eodCashDenominationDto={};

                    var cashBal = function(transactionDate){
                        var deferred = $q.defer();
                        Transaction.getCashBalance({"date":transactionDate}).$promise
                        .then(function(resp,header){
                            deferred.resolve(resp)
                        },function(err){
                            deferred.reject(err);
                        })
                        return deferred.promise;
                    }

                    /* Setting data for the form */
                    var userName = SessionStore.getUsername();
                    model.cashManagement.eodCashBalanceDto.confirmedUser = userName;
                    var branchId = SessionStore.getBranchId();
                    if (!model.customer) {

                    }

                    else if (branchId && !model.customer.customerBranchId) {
                        model.customer.customerBranchId = branchId;
                    };

                    var configFile = function () {
                        return {
                            "loanProcess.loanAccount.currentStage": {
                            }
                        }
                    }
                    var overridesFields = function (bundlePageObj) {
                        return {
        
                        }
                    }
                    var getIncludes = function (model) {
        
                        return [
                            "Bank",
                            "Bank.select",
                            "Bank.select1",
                            "Bank.openingBalance",
                            "Bank.cashReceived",
                            "Bank.cashPaid",
                            "Bank.miscCashReceived",
                            "Bank.miscCashPaid",
                            "Bank.cashReceived3rdParty",
                            "Bank.cashPaid3rdParty",
                            "Bank.loanRepayment",
                            "Bank.loanDisbursement",
                            "Bank.remittanceAmount",
                            "Bank.localNEFTAmount",
                            "Bank.sbAMCandCardCharges",
                            "Bank.totalCash",
                            "Bank.loanDisbursementByCheque",
                            "Bank.noOfRevenueStampPapers",
                            "Bank.noOfDOpartnersStampPapers",
                            "Bank.noOfPFSPLStampPapers",
                            "Bank.remarks",

                            // "Denomination",
                            // "Denomination.denominationFieldset",
                            // "Denomination.denominationItems"
                            "Details",
                            "Details.userName",
                            "Details.password",

                            "KeyCustodians",
                            "KeyCustodians.keycustodians",
                            "KeyCustodians.jewelPouchCount",
                            "KeyCustodians.actual",
                            "KeyCustodians.inBranch",
                            "KeyCustodians.inHub",
                            "KeyCustodians.inTransit",
                            "KeyCustodians.cashLimit",
                            "KeyCustodians.jewelInsuranceLimit"

                        ];
        
                    }


                   
                    /* Form rendering starts */
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                            "Bank":{
                                 "type":"box",
                                 "orderNo": 1,
                                 "title":"BRANCH_EOD_CASH_MANAGEMENT",
                                 "items":{
                                        "select":{
                                            "key":"cashManagement.eodCashBalanceDto.transactionDate",
                                            // "key":"cashManagement.date",
                                            "type":"date",
                                            "title": "SELECT",
                                            onChange:function(value, form, model){
                                                if(value != "" ){
                                                    cashBal(model.cashManagement.eodCashBalanceDto.transactionDate).then(function(resp){
                                                        // cashBal(model.cashManagement.date).then(function(resp){
                                                        console.log(resp);
                                                        model.cashManagement=resp.body;
                                                       
                                                        model.cashManagement.openingBal= ((model.cashManagement.eodCashBalanceDto.openingBalInPaisa)/100);
                                                        model.cashManagement.cashReceivedFromCust= ((model.cashManagement.eodCashBalanceDto.cashReceivedFromCustInPaisa)/100);
                                                        model.cashManagement.cashPaidToCust= ((model.cashManagement.eodCashBalanceDto.cashPaidToCustInPaisa)/100);
                                                        model.cashManagement.miscCashReceived= ((model.cashManagement.eodCashBalanceDto.miscCashReceivedInPaisa)/100);
                                                        model.cashManagement.miscCashPaid= ((model.cashManagement.eodCashBalanceDto.miscCashPaidInPaisa)/100);
                                                        model.cashManagement.loanRepayment= ((model.cashManagement.eodCashBalanceDto.loanRepaymentInPaisa)/100);
                                                        model.cashManagement.loanDisbursement= ((model.cashManagement.eodCashBalanceDto.loanDisbursementInPaisa)/100);
                                                        model.cashManagement.remittanceAmt= ((model.cashManagement.eodCashBalanceDto.remittanceAmtInPaisa)/100);
                                                        model.cashManagement.neftAmt= ((model.cashManagement.eodCashBalanceDto.neftAmtInPaisa)/100);
                                                        model.cashManagement.sbAMCAmt= ((model.cashManagement.eodCashBalanceDto.sbAMCAmtInPaisa)/100);
                                                        model.cashManagement.loanDisbursementByCheque= ((model.cashManagement.eodCashBalanceDto.loanDisbursementByChequeInPaisa)/100);
                                                        
                                                        model.cashManagement.cashDeposits = ((model.cashManagement.eodCashBalanceDto.cashDepositsInPaisa)/100);
                                                        model.cashManagement.cashWithdrawl = ((model.cashManagement.eodCashBalanceDto.cashWithdrawlInPaisa)/100);
                                                        model.cashManagement.actual = (model.cashManagement.eodCashBalanceDto.jewelPouchCountInBranch )+ (model.cashManagement.eodCashBalanceDto.jewelPouchCountInHub) + (model.cashManagement.eodCashBalanceDto.jewelPouchCountInTransit);

                                                        var totalCashIn = model.cashManagement.cashDeposits
                                                        + model.cashManagement.miscCashReceived
                                                        + model.cashManagement.cashReceivedFromCust
                                                        + model.cashManagement.loanRepayment + model.cashManagement.sbAMCAmt
                                                        + model.cashManagement.neftAmt;

                                                        var totalCashOut = model.cashManagement.cashWithdrawl
                                                        + model.cashManagement.miscCashPaid + model.cashManagement.remittanceAmt
                                                        + model.cashManagement.loanDisbursement + model.cashManagement.cashPaidToCust; 

                                                        model.cashManagement.totalCashPaid = model.cashManagement.openingBal + totalCashIn - totalCashOut;
                                                    },function(err){
                                                        console.log(err);
                                                        PageHelper.showErrors(err.data);
                                                        model.cashManagement = {};
                                                    })
                                                }

                                            }
                                        },
                                        "select1":{
                                            "key":"cashManagement.eodCashBalanceDto.transactionDate",
                                            "type":"text",
                                            "title": "DATE",
                                            "readonly": true
                                        },
                                        "openingBalance":{
                                            "key":"cashManagement.openingBal",
                                            "type":"amount",
                                            "title": "OPENING_BALANCE",
                                            "readonly": true
                                        },
                                        "cashReceived":{
                                            "key":"cashManagement.cashReceivedFromCust",
                                            "type":"amount",
                                            "title":"CASH_RECEIVED(SB)",
                                            "readonly": true
                                        },
                                        "cashPaid":{
                                            "key": "cashManagement.cashPaidToCust",
                                            "type": "amount",
                                            "title":"CASH_PAID(SB)",
                                            "readonly": true
                                        },
                                        "miscCashReceived":{
                                            "key": "cashManagement.miscCashReceived",
                                            "type": "amount",
                                            "title":"MISC_CASH_RECEIVED",
                                            "readonly": true
                                        },
                                        "miscCashPaid":{
                                            "key": "cashManagement.miscCashPaid",
                                            "type": "amount",
                                            "title": "MISC_CASH_PAID",
                                            "readonly": true
                                        },
                                        // "cashReceived3rdParty":{
                                        //     "key":"cashManagement.eodCashBalanceDto.cashDepositsInPaisa",
                                        //     "type":"text",
                                        //     "title":"CASH_RECEIVED(3RD_PARTY_PROD)",
                                        //     "readonly": true
                                        // },
                                        // "cashPaid3rdParty":{
                                        //     "key": "cashManagement.eodCashBalanceDto.cashWithdrawlInPaisa",
                                        //     "type": "text",
                                        //     "title":"CASH_PAID(3RD_PARTY_PROD)",
                                        //     "readonly": true
                                        // },
                                        "loanRepayment":{
                                            "key":"cashManagement.loanRepayment",
                                            "type":"amount",
                                            "title": "LOAN_REPAYMENT",
                                            "readonly": true
                                        },
                                        "loanDisbursement":{
                                            "key":"cashManagement.loanDisbursement",
                                            "type":"amount",
                                            "title": "LOAN_DISBURSEMENT",
                                            "readonly": true
                                        },
                                        "remittanceAmount":{
                                            "key":"cashManagement.remittanceAmt",
                                            "type":"amount",
                                            "title": "REMITTANCE_AMOUNT",
                                            "readonly": true
                                        },
                                        "localNEFTAmount":{
                                            "key":"cashManagement.neftAmt",
                                            "type":"amount",
                                            "title": "LOCAL_NEFT_AMOUNT",
                                            "readonly": true
                                        },
                                        "sbAMCandCardCharges":{
                                            "key":"cashManagement.sbAMCAmt",
                                            "type":"amount",
                                            "title": "SB_AMC_AND_CARD_CHANGES",
                                            "readonly": true
                                        },
                                        "totalCash":{
                                            "key":"cashManagement.totalCashPaid",
                                            "type":"amount",
                                            "title": "TOTAL_CASH",
                                            "readonly": true
                                        },
                                        "loanDisbursementByCheque":{
                                            "key":"cashManagement.loanDisbursementByCheque",
                                            "type":"amount",
                                            "title": "LOAN_DISBURSEMENT_BY_CHEQUE",
                                            "readonly": true
                                        },
                                        "noOfRevenueStampPapers":{
                                            "key":"cashManagement.eodCashBalanceDto.noOfRevenueStamps",
                                            "type":"number",
                                            "title": "NO_OF_REVENUE_STAMP_PAPERS",
                                            "readonly": true
                                        },
                                        "noOfDOpartnersStampPapers":{
                                            "key":"cashManagement.eodCashBalanceDto.noOfAxisStamps",
                                            "type":"number",
                                            "title": "NO_OF_DO_PARTNERS_STAMP_PAPERS",
                                            "readonly": true
                                        },
                                        "noOfPFSPLStampPapers":{
                                            "key":"cashManagement.eodCashBalanceDto.noOfPFSPLStamps",
                                            "type":"number",
                                            "title": "NO_OF_PFSPL_STAMP_PAPERS",
                                            "readonly": true
                                        },
                                        "remarks":{
                                            "key":"cashManagement.eodCashBalanceDto.remarks",
                                            "type":"text",
                                            "title": "REMARKS",
                                            "readonly": true
                                        },

                                    }
                                },
                            "Details":{
                                "type":"box",
                                 "orderNo": 2,
                                 "title":"USER_DETAILS",
                                 "items":{
                                    "userName":{
                                        "key":"cashManagement.eodCashBalanceDto.confirmedUser",
                                        "type":"text",
                                        "title": "USER_NAME",
                                        "readonly": true
                                    },
                                    "password":{
                                        "key":"cashManagement.eodCashBalanceDto.confirmedUserPassword",
                                        "type":"text",
                                        "title": "PASSWORD",
                                        "required" : true
                                    },
                                    }
                                },
                            "KeyCustodians":{
                                    "type":"box",
                                    "orderNo": 3,
                                    "title":"KEY_CUSTODIANS",
                                    "items":{
                                        //    "keycustodians":{
                                        //        "title": "KEY_CUSTODIANS:",
                                        //        "readonly": true
                                        //    },
                                           "jewelPouchCount":{
                                               "title": "JEWEL_POUCH_COUNT",
                                               "readonly": true
                                           },
                                           "actual":{
                                               "key":"cashManagement.actual",
                                               "type":"text",
                                               "title":"ACTUAL",
                                               "readonly": true
                                           },
                                           "inBranch":{
                                               "key": "cashManagement.eodCashBalanceDto.jewelPouchCountInBranch",
                                               "type": "text",
                                               "title":"IN_BRANCH",
                                               "readonly": true
                                           },
                                           "inHub":{
                                               "key": "cashManagement.eodCashBalanceDto.jewelPouchCountInHub",
                                               "type": "text",
                                               "title":"IN_HUB",
                                               "readonly": true
                                           },
                                           "inTransit":{
                                               "key": "cashManagement.eodCashBalanceDto.jewelPouchCountInTransit",
                                               "type": "text",
                                               "title": "IN_TRANSIT",
                                               "readonly": true
                                           },
                                           "cashLimit":{
                                               "key":"cashManagement.cashLimit",
                                               "type":"text",
                                               "title":"CASH_LIMIT",
                                               "readonly": true
                                           },
                                           "jewelInsuranceLimit":{
                                               "key": "cashManagement.eodCashBalanceDto.jewelInsuranceLimit",
                                               "type": "text",
                                               "title":"JEWEL_INSURANCE_LIMIT",
                                               "readonly": true
                                           },
                                       }
                                }
                            },
                            "additions": [
                                {
                                    "type": "actionbox",
                                    "orderNo": 4,
                                    "items":[
                                        {
                                            "type": "submit",
                                            "title": "SUBMIT",
                                        },
                                    ]
                                }
                            ]
                        }
                    };

                    var denomination=  {"type":"box",
                    "title":"DENOMINATION",
                    "orderNo":2,
                    "items":[
                        {
                            "type": "fieldset",
                            "title": "DENOMINATIONS",
                        
                            "items": [{
                                "type": "section",
                                "htmlClass": "row",
                                "items": [{
                                    "type": "section",
                                    "htmlClass": "col-xs-4",
                                    "items": [{
                                        key:"cashManagement.eodCashDenominationDto.noOf2000",
                                        onChange:"actions.valueOfDenoms(model,form)"
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-xs-4",
                                    "items": [{
                                        key:"cashManagement.eodCashDenominationDto.noOf1000",
                                        onChange:"actions.valueOfDenoms(model,form)"
                                    }]
                                },{
                                    "type": "section",
                                    "htmlClass": "col-xs-4",
                                    "items": [{
                                        key:"cashManagement.eodCashDenominationDto.noOf500",
                                        onChange:"actions.valueOfDenoms(model,form)"
                                    }]
                                },]
                            },{
                                "type": "section",
                                "htmlClass": "row",
                                "items": [{
                                    "type": "section",
                                    "htmlClass": "col-xs-4",
                                    "items": [{
                                        key:"cashManagement.eodCashDenominationDto.noOf200",
                                        onChange:"actions.valueOfDenoms(model,form)"
                                    }]
                                },{
                                    "type": "section",
                                    "htmlClass": "col-xs-4",
                                    "items": [{
                                        key:"cashManagement.eodCashDenominationDto.noOf100",
                                        onChange:"actions.valueOfDenoms(model,form)"
                                    }]
                                },{
                                    "type": "section",
                                    "htmlClass": "col-xs-4",
                                    "items": [{
                                        key:"cashManagement.eodCashDenominationDto.noOf50",
                                        onChange:"actions.valueOfDenoms(model,form)"
                                    }]
                                },]
                            },{
                                "type": "section",
                                "htmlClass": "row",
                                "items": [
                                    {
                                        "type": "section",
                                        "htmlClass": "col-xs-4",
                                        "items": [{
                                            key:"cashManagement.eodCashDenominationDto.noOf20",
                                            onChange:"actions.valueOfDenoms(model,form)"
                                        }]
                                    },
                                    {
                                    "type": "section",
                                    "htmlClass": "col-xs-4",
                                    "items": [{
                                        key:"cashManagement.eodCashDenominationDto.noOf10",
                                        onChange:"actions.valueOfDenoms(model,form)"
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-xs-4",
                                    "items": [{
                                        key:"cashManagement.eodCashDenominationDto.noOf5",
                                        onChange:"actions.valueOfDenoms(model,form)"
                                    }]
                                },{
                                    "type": "section",
                                    "htmlClass": "col-xs-4",
                                    "items": [{
                                        key:"cashManagement.eodCashDenominationDto.noOf2",
                                        onChange:"actions.valueOfDenoms(model,form)"
                                    }]
                                },{
                                    "type": "section",
                                    "htmlClass": "col-xs-4",
                                    "items": [{
                                        key:"cashManagement.eodCashDenominationDto.noOf1",
                                        onChange:"actions.valueOfDenoms(model,form)"
                                    }]
                                }]
                            },
                            {
                                key:"cashManagement.totalCash",
                                title:"TOTAL_RS",
                                "type": "amount",
                                readonly:true
                            }]
                        }
                    ]}


                    UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function (repo) {
                            console.log(model.pageClass);
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function (form) {
                            self.form = form;
                            self.form.splice(1, 0, denomination);
                            // self.form.push(denomination);
                            console.log(form);
                            console.log("_________________Testing form data___________");
                        }); 
                    /* Form rendering ends */
                },

                preDestroy: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    return $q.resolve();
                },
                eventListeners: {
                  
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                },
                form: [],
              
                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    valueOfDenoms : function(model,form){
                        var thousands = 1000*parseInt(model.cashManagement.eodCashDenominationDto.noOf1000,10);
                        var twoTthousands = 2000*parseInt(model.cashManagement.eodCashDenominationDto.noOf2000,10);
                        var fivehundreds = 500*parseInt(model.cashManagement.eodCashDenominationDto.noOf500,10);
                        var twohundreds = 200*parseInt(model.cashManagement.eodCashDenominationDto.noOf200,10);
                        var hundreds = 100*parseInt(model.cashManagement.eodCashDenominationDto.noOf100,10);
        
                        var fifties = 50*parseInt(model.cashManagement.eodCashDenominationDto.noOf50,10);
                        var twenties = 20*parseInt(model.cashManagement.eodCashDenominationDto.noOf20,10);
                        var tens = 10*parseInt(model.cashManagement.eodCashDenominationDto.noOf10,10);
        
                        var fives = 5*parseInt(model.cashManagement.eodCashDenominationDto.noOf5,10);
                        var twos = 2*parseInt(model.cashManagement.eodCashDenominationDto.noOf2,10);
                        var ones = parseInt(model.cashManagement.eodCashDenominationDto.noOf1,10);
        
                        var denominationTotal = 0;
                        if(!isNaN(twoTthousands)) denominationTotal+=twoTthousands;
                        if(!isNaN(thousands)) denominationTotal+=thousands;
                        if(!isNaN(fivehundreds)) denominationTotal+=fivehundreds;
                        if(!isNaN(twohundreds)) denominationTotal+=twohundreds;
                        if(!isNaN(hundreds)) denominationTotal+=hundreds;
        
                        if(!isNaN(fifties)) denominationTotal+=fifties;
                        if(!isNaN(twenties)) denominationTotal+=twenties;
                        if(!isNaN(tens)) denominationTotal+=tens;
        
                        if(!isNaN(fives)) denominationTotal+=fives;
                        if(!isNaN(twos)) denominationTotal+=twos;
                        if(!isNaN(ones)) denominationTotal+=ones;
                        model.cashManagement.totalCash = denominationTotal;
                        return (denominationTotal===model.collected);
                    },
                    save: function (model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }
                        // $q.all start
                      
                    },
                    print: function(model){
                        console.log(model);
                        var groupDemand = model.groupCollectionDemand;
                        var summary = model.cashManagement.eodCashDenominationDto;
                        var printData = [
                            {
                                "bFont": 1,
                                "text": "2000  x" + summary.noOf2000
                            },
                            {
                                "bFont": 1,
                                "text": "1000  x" + summary.noOf1000
                            },
                            {
                                "bFont": 1,
                                "text": "500   x" + summary.noOf500
                            },
                            {
                                "bFont": 1,
                                "text": "200   x" + summary.noOf200
                            },
                            {
                                "bFont": 1,
                                "text": "100   x" + summary.noOf100
                            },
                            {
                                "bFont": 2,
                                "text": "Total Rs. " + summary.totalAmount
                            },
                        ]
                        var printObj = {
                            "data": printData
                        };
                        return;
                    },
                    proceed: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                      
                    },
                    submit: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        model.cashManagement.eodCashBalanceDto.confirmUserAuthenticationType = 'PASSWORD';
                        Transaction.saveCashManagement(model.cashManagement).$promise.then(function(resp){
                            console.log("resp",resp);
                        },function(err){
                            console.log("ERR",err);
                            PageHelper.showErrors(err);
                        })
                    }
                },
                schema: {
                    "type": "object",
                    "properties": {
                        "cashManagement": {
                            "type": "object",
                            "properties": {
                                "type": "object",
                                "eodCashDenominationDto":{
                                    "type": "object",
                                    "properties":{
                                        "noOf2000": {
                                            "type": "integer",
                                            "title": "2000 x"
                                        },
                                        "noOf1000": {
                                            "type": "integer",
                                            "title": "1000 x"
                                        },
                                        "noOf500": {
                                            "type": "integer",
                                            "title": "500 x"
                                        },
                                        "noOf100": {
                                            "type": "integer",
                                            "title": "100 x"
                                        },
                                        "noOf200": {
                                            "type": "integer",
                                            "title": "200 x"
                                        },
                                        "noOf50": {
                                            "type": "integer",
                                            "title": "50 x"
                                        },
                                        "noOf20": {
                                            "type": "integer",
                                            "title": "20 x"
                                        },
                                        "noOf10": {
                                            "type": "integer",
                                            "title": "10 x"
                                        },
                                        "noOf5": {
                                            "type": "integer",
                                            "title": "5 x"
                                        },
                                        "noOf2": {
                                            "type": "integer",
                                            "title": "2 x"
                                        },
                                        "noOf1": {
                                            "type": "integer",
                                            "title": "1 x"
                                        }
                                    }
                                } 
                            }
                        }
                    }
                }
            };
        }
    }
})