irf.pageCollection.factory(irf.page('loans.LoanRepay'),
    ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams"
        ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan","LoanCollection","PagesDefinition","irfNavigator","Locking","CollectionHelper",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter,
            Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan,LoanCollection,PagesDefinition,irfNavigator,Locking,CollectionHelper) {

            var titleMapConfig = function(config,model){
                var additional = model.additional || {};
                additional.titleMap = additional.titleMap || {};
                for (var i=0; i< config.length; i++){
                    additional.titleMap[config[i][0]] = config[i][1];
                }
                model.additional = additional;
                return;
            }
            var mobileNumberValidation= function(phone){
                if(!phone)
                    return true;
                phone=phone.toString();
                var phoneNum = phone.replace(/[^\d]/g, '');
                if( phoneNum.length == 10) {  
                    return true;  
                }else{
                    return false;  
                }
            }
                function backToLoansList(){
                try {
                    var urnNo = ($stateParams.pageId.split("."))[1];
                    $state.go("Page.Engine", {
                        pageName: "customer360.loans.View",
                        pageId: urnNo
                    });
                }catch(err){
                    console.log(err);
                    //@TODO : Where to redirect if no page params present
                }
            }

            var _pageGlobals = {};
            var pageData = {};

            function defaultPageParams(){
                _pageGlobals = {
                    hideTransactionName: false
                };
                pageData = $stateParams.pageData;
            }

            function pageInit(){
                defaultPageParams();

                $log.info("PageData is ::");
                $log.info(pageData);
                if (!_.isNull(pageData) && pageData.onlyDemandAllowed == true){
                    _pageGlobals.transactionName = "Scheduled Demand";
                    _pageGlobals.hideTransactionName = true;
                }
                //_pageGlobals.transactionName = "Scheduled Demand";
            }

            return {
                "type": "schema-form",
                "title": "LOAN_REPAYMENT",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    pageInit();
                    
                    model.pageConfig = {
                        ShowPayerInfo: false,
                        repaymentDateIsReadonly: false
                    };
                    model.currentStage=model.currentStage || {};
                    PagesDefinition.getPageConfig("Page/Engine/loans.LoanRepay")
                    .then(function(data){
                        _.defaults(data, model.pageConfig);
                        model.pageConfig = data;
                        // if (typeof data.conditionConfig != undefined){
                        //     titleMapConfig(data.conditionConfig,model);
                        // }
                        // else{
                        //     titleMapConfig([
                        //         ["Advance Payment","Advance Payment"]
                        //     ],model)
                        // }
                    });

                    var config = {
                        fingerprintEnabled: false
                    };

                    model.additional = {
                        unapprovedAmount: 0,
                        unapprovedTransactionsCount: 0
                    };
                    model.additional.titleMap = {
                        "Scheduled Demand":"Scheduled Demand",
                        "Fee Payment":"Fee Payment",
                        "Pre-closure":"Pre-closure",
                        "Prepayment":"Prepayment",
                        "PenalInterestPayment":"PenalInterestPayment",
                        "Recovery" : "Writeoff Recovery",
                       "Settlement" : "Partial Settlement",
                        "FullSettlement" : "FullSettlement",
                        "Writeoff_Settlement" : "Writeoff Settlement"

                    }
                    model.siteCode = SessionStore.getGlobalSetting("siteCode");
                    model.additional.suspenseCode = SessionStore.getGlobalSetting("loan.individual.collection.suspenseCollectionAccount");



                    model.$pageConfig = config;
                    model._pageGlobals = _pageGlobals;
                    model.repayment = {};
                   
                    if (_pageGlobals.hideTransactionName == true && !_.isNull(_pageGlobals.transactionName)){
                        model.repayment.transactionName = _pageGlobals.transactionName;
                    }

                    model.workingDate = model.repayment.repaymentDate = SessionStore.getCBSDate();

                    PageHelper.showLoader();
                    irfProgressMessage.pop('loading-loan-details', 'Loading Loan Details');
                    //PageHelper
                    var loanAccountNo = ($stateParams.pageId.split("."))[0];
                    var paramsArray = $stateParams.pageId.split(".");
                    var promise = LoanAccount.get({accountId: loanAccountNo}).$promise;
                    promise.then(function (data) { /* SUCCESS */
                        model.cbsLoanData = data;
                        model.repayment.productCode=data.productCode;
                        model.repayment.urnNo=data.customerId1;
                        model.repayment.instrument='CASH';
                        model.repayment.authorizationUsing='';
                        model.repayment.remarks='';
                        model.repayment.accountNumber = data.accountId;
                        //model.repayment.amount = 0;
                        model.repayment.customerName = data.customer1FirstName;

                        model.repayment.writeOffDate=data.writeOffDate;
                        model.repayment.principalWriteOff=data.principalWriteOff;
                        model.repayment.normalInterestWriteOff=data.normalInterestWriteOff;
                        model.repayment.penalInterestWriteOff=data.penalInterestWriteOff;
                        model.repayment.feeWriteOff=data.feeWriteOff;
                        model.repayment.principalRecovery=data.principalRecovery;
                        model.repayment.normalInterestRecovery=data.normalInterestRecovery;
                        model.repayment.penalInterestRecovery=data.penalInterestRecovery;
                        model.repayment.feeRecovery=data.feeRecovery;

                        model.repayment.productCode = data.productCode;
                        model.repayment.visitedDate=SessionStore.getCBSDate();
                        model.repayment.urnNo = data.customerId1;
                        model.repayment.payOffAndDueAmount = Utils.ceil(data.payOffAndDueAmount);
                        model.repayment.totalFeeDue = Utils.roundToDecimal(data.totalFeeDue);
                        model.repayment.recoverableInterest = Utils.roundToDecimal(data.recoverableInterest);
                        model.repayment.principalNotDue = Utils.roundToDecimal(data.principalNotDue);
                        model.repayment.totalNormalInterestDue  = Utils.roundToDecimal(data.totalNormalInterestDue);
                        model.repayment.preclosureFee = Utils.roundToDecimal(data.preclosureFee);
                        model.repayment.payOffAmount = Utils.roundToDecimal(data.payOffAmount);
                        model.repayment.totalPrincipalDue = Utils.roundToDecimal(data.totalPrincipalDue);
                        model.repayment.totalPenalInterestDue = Utils.roundToDecimal(data.totalPenalInterestDue);
                        model.repayment.totalDemandDue = Utils.roundToDecimal(data.totalDemandDue);
                        model.repayment.totalDue = Utils.roundToDecimal(data.totalDemandDue + data.totalFeeDue + data.totalSecurityDepositDue);
                        model.repayment.bookedNotDueNormalInterest = Utils.roundToDecimal(data.bookedNotDueNormalInterest);
                        model.repayment.bookedNotDuePenalInterest = Utils.roundToDecimal(data.bookedNotDuePenalInterest);
                        model.repayment.securityDeposit = Utils.roundToDecimal(data.securityDeposit);
                        model.repayment.netPayoffAmount = Utils.roundToDecimal(data.payOffAmount + data.preclosureFee - data.securityDeposit);
                        model.repayment.netPayoffAmountDue = Utils.roundToDecimal(model.repayment.netPayoffAmount + model.repayment.totalDemandDue);
                        model.repayment.totalPayoffAmountToBePaid = Utils.roundToDecimal(data.payOffAndDueAmount + data.preclosureFee - data.securityDeposit);
                        model.repayment.totalSecurityDepositDue = Utils.roundToDecimal(data.totalSecurityDepositDue);
                        if (!_.isNull(pageData) && pageData.onlyDemandAllowed == true) {
                            if (model.repayment.bookedNotDuePenalInterest) {
                                model.repayment.totalDueWithPenal = Utils.roundToDecimal(model.repayment.totalDue) + Utils.roundToDecimal(model.repayment.bookedNotDuePenalInterest);
                            }
                        }
                        /** added for defaulting the value of transaction type */
                        if(model.cbsLoanData.operationalStatus =="Write_off"){
                            model.repayment.transactionName="Recovery";
                        }
                        //_pageGlobals.totalDemandDue = data.totalDemandDue;

                        irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                    }, function (resData) {
                        irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                        PageHelper.showErrors(resData);
                        irfNavigator.goBack();
                        //backToLoansList();
                    });

                    var p3 = LoanCollection.query({"currentStage":"Initiation","accountNumber":loanAccountNo}).$promise
                            .then(function (resp){
                                if(resp.body && resp.body.length > 0)
                                    model.repayment.id = resp.body[0].id;
                                    model.repayment.latitude = resp.body[0].latitude;
                                    model.repayment.longitude = resp.body[0].longitude;
                                    model.repayment.delayReasonType = resp.body[0].delayReasonType;
                                    model.repayment.overdueReasons = resp.body[0].overdueReasons;
                            }, function(httperr){});

                    var p4 = Queries.getUnApprovedPaymentsForAccount(loanAccountNo)
                        .then(
                            function(res){
                                var rows = res.body;
                                var totalAmount = 0;
                                var rowsCount = 0;
                                for (var i=0;i<rows.length;i++){
                                    if(rows[i].current_stage!="RejectedProcess"){
                                        rowsCount++;
                                        totalAmount= totalAmount + rows[i].repayment_amount;
                                    }
                                }
                                model.additional.unapprovedAmount = totalAmount;
                                model.additional.unapprovedTransactionsCount = rowsCount;
                            }
                        );


                    var defaultAccountPromise = Queries.getBankAccountsByPartnerForLoanRepay(
                        SessionStore.getGlobalSetting('mainPartner') || "Kinara").then(function(res){
                        var records = res.body;

                        if(records && _.isArray(records) && records.length > 0){

                            var defaultBank = $filter('filter')( records, {default_collection_account : true}, true);
                            if(defaultBank && _.isArray(defaultBank) && defaultBank.length > 0)
                            model.repayment.bankAccountNumber = defaultBank[0].account_number;

                            var suspenseRow = $filter('filter')(records, {account_code: model.additional.suspenseCode}, true);

                            if (suspenseRow && _.isArray(suspenseRow) && suspenseRow.length > 0){
                                model.additional.suspenseBankAccount = suspenseRow[0].account_number;
                            }

                        }
                    });



                    $q.all([promise, p3, p4, defaultAccountPromise])
                        .finally(
                            function(){
                                PageHelper.hideLoader();
                            }
                        )

                    /* Load loan Information */
                    IndividualLoan.search({
                        'accountNumber': loanAccountNo,
                        'stage' : 'Completed'
                    })
                    .$promise
                    .then(
                        function(res){
                            if (_.isArray(res.body) && res.body.length>0){
                                var item = res.body[0];
                                IndividualLoan.get({id: item.loanId})
                                    .$promise
                                    .then(
                                        function(res){
                                            model.loanAccount = res;
                                            model.repayment.payeeName = res.payeeName;
                                            model.repayment.payeeMobileNumber = res.payeeMobileNumber;
                                            model.repayment.payeeRelationToApplicant = res.payeeRelationToApplicant;
                                            var urns = [];
                                            if (!_.isNull(model.loanAccount.applicant)){
                                                urns.push(model.loanAccount.applicant);
                                            }
                                            if (!_.isNull(model.loanAccount.coBorrowerUrnNo)){
                                                urns.push(model.loanAccount.coBorrowerUrnNo)
                                            }
                                            Queries.getCustomerBasicDetails({"urns":urns}).then(
                                                function(resQuery) {
                                                    // console.log(resQuery);
                                                    // console.log(resQuery.urns[model.achIndividualLoanSearch.applicant].first_name);
                                                    if (!_.isNull(model.loanAccount.applicant)){
                                                        model.loanAccount.applicantName = resQuery.urns[model.loanAccount.applicant].first_name
                                                    }
                                                    if (!_.isNull(model.loanAccount.coBorrowerUrnNo)){
                                                        model.loanAccount.coBorrowerUrnNo = resQuery.urns[model.loanAccount.coBorrowerUrnNo].first_name
                                                    }
                                                },
                                                function(errQuery) {
                                                }
                                            )
                                        }
                                    )
                                    .then(function(){
                                        if (SessionStore.getGlobalSetting("lockingRequired") == "true") {
                                            Locking.lock({
                                                "processType": "Loan",
                                                "processName": "Collections",
                                                "recordId": model.loanAccount.id
                                            }).$promise.then(function () {

                                            }, function (err) {
                                                Utils.alert(err.data.error).finally(function () {
                                                    Utils.alert(err.data.error).finally(function () {
                                                        irfNavigator.goBack();
                                                    });
                                                });
                                            });
                                        }
                                    })
                            } else {
                                /* Loan Account not in perdix. Go back to Collections Dashboard */
                            }
                        }
                    )
                },
                offline: false,
                form: [
                    {
                        "type": "box",
                        "title": "REPAY",
                        "items": [
                            {
                                "type": "section",
                                "htmlClass": "alert alert-warning",
                                "condition": "model.additional.unapprovedAmount > 0",
                                "html":"<h4><i class='icon fa fa-warning'></i>{{model.additional.unapprovedTransactionsCount}} Unapproved Payment(s) Found!</h4>Payment(s) of {{ model.additional.unapprovedAmount | currency:'Rs.':2 }} is not yet approved for this account."
                            },
                            {
                                "type": "section",
                                "htmlClass": "alert alert-warning",
                                "condition": "model.cbsLoanData.operationalStatus == 'Settled'",
                                "html":"<h4><i class='icon fa fa-warning'></i>{{model.cbsLoanData.operationalStatus}}  : This Account is Settled </h4>Can't able to do any collections"
                            },
                            {
                                "type": "section",
                                "htmlClass": "alert alert-warning",
                                "condition": "model.cbsLoanData.operationalStatus == 'Closed'",
                                "html":"<h4><i class='icon fa fa-warning'></i>{{model.cbsLoanData.operationalStatus}}  : This Account is Closed </h4>Can't able to do any collections"
                            },
                            
                            {
                                key:"repayment.accountNumber",
                                title: "LOAN_ACCOUNT_NUMBER",
                                readonly:true
                            },
                            {
                                key: "repayment.customerName",
                                title: "CUSTOMER_NAME",
                                readonly: true
                            },
                            {
                                key: "loanAccount.applicantName",
                                condition:"model.siteCode != 'shramsarathi'",
                                title: "APPLICANT_NAME",
                                readonly: true
                            },{
                                key: "repayment.latitude",
                                title: "LOCATION",
                                type: "geotag",
                                latitude: "repayment.latitude",
                                longitude: "repayment.longitude"
                            },
                            {
                                "type": "fieldset",
                                "title": "PAYERS_INFORMATION",
                                "condition" : "model.pageConfig.ShowPayerInfo==true",
                                "items": [{
                                    "key": "repayment.payeeName",
                                    "title": "PAYER_NAME",
                                    "type" :"string"
                                },
                                {
                                    "key": "repayment.payeeMobileNumber",
                                    "title": "PAYER_MOBILE_NUMBER",
                                    "type": "string",
                                    "inputmode": "number",
                                    "numberType": "number",
                                    "schema": {
                                        maxLength:10,
                                        minLength:10
                                    },
                                },
                                {
                                    "key": "repayment.payeeRelationToApplicant",
                                    "title": "RELATIONSHIP_TO_APPLICANT",
                                    "type": "select",
                                    "enumCode": "payerRelation"
                                }]
                            },
                            {
                                "title" : "REPAYMENT_INFORMATION",
                                "type" : "fieldset"
                            },
                            /*{
                                key: "loanAccount.coApplicantName",
                                title: "COAPPLICANT_NAME",
                                readonly: true,
                                condition: "model.loanAccount.coBorrowerUrnNo!=null"
                            },*/
                            {
                                key:"repayment.transactionName",
                                type: "string",
                                readonly: true,
                                condition: "model._pageGlobals.hideTransactionName"
                            },
                            {
                                key:"repayment.transactionName",
                                "type":"select",
                                "required": true,
                                condition: "!model._pageGlobals.hideTransactionName && model.siteCode != 'witfin' && model.siteCode != 'shramsarathi' && model.siteCode != 'kinara'",
                                titleMap: {
                                    "Scheduled Demand":"Scheduled Demand",
                                    "Fee Payment":"Fee Payment",
                                    "Pre-closure":"Pre-closure",
                                    "Prepayment":"Prepayment",
                                    "PenalInterestPayment":"PenalInterestPayment",
                                    "Recovery" : "Writeoff Recovery"
                                },
                                onChange: function(value ,form, model){
                                    if ( value == 'Pre-closure'){
                                        model.repayment.amount = model.repayment.totalPayoffAmountToBePaid;
                                    } else if (value == 'Scheduled Demand'){
                                        model.repayment.amount = Utils.ceil(model.repayment.totalDue);
                                    }else if(value == 'PenalInterestPayment'){
                                        model.repayment.amount = model.repayment.bookedNotDuePenalInterest;
                                    }else if(value == 'Fee Payment'){
                                        model.repayment.amount = model.repayment.feeDue;
                                    } else {
                                        model.repayment.amount = null;
                                    }
                                    model.repayment.demandAmount = model.repayment.amount || 0;
                                }
                            },
                            {
                                key:"repayment.transactionName",
                                "type":"select",
                                "required": true,
                                condition: "(!model._pageGlobals.hideTransactionName) && (model.siteCode == 'witfin' || model.siteCode == 'kinara')  && model.cbsLoanData.operationalStatus=='Active'",
                               // enumCode: "transaction_name",
                                titleMap: {
                                    "Scheduled Demand": "Scheduled Demand",
                                    "Fee Payment": "Fee Payment",
                                    "Pre-closure": "Pre-closure",
                                    "Prepayment": "Prepayment",
                                    "PenalInterestPayment": "PenalInterestPayment",
                                    "Settlement": "Partial Settlement",
                                    "FullSettlement": "FullSettlement",
                                },
                                onChange: function(value ,form, model){
                                    if ( value == 'Pre-closure'){
                                        model.repayment.amount = model.repayment.totalPayoffAmountToBePaid;
                                    } else if (value == 'Scheduled Demand'){
                                        model.repayment.amount = Utils.ceil(model.repayment.totalDue);
                                    }else if(value == 'PenalInterestPayment'){
                                        model.repayment.amount = model.repayment.bookedNotDuePenalInterest;
                                    }else if(value == 'Fee Payment'){
                                        model.repayment.amount = model.repayment.feeDue;
                                    }else if(value == 'FullSettlement'){
                                        model.repayment.amount =  model.repayment.totalPrincipalDue;
                                        model.repayment.amount = model.repayment.amount + model.repayment.totalNormalInterestDue
                                        model.repayment.amount = model.repayment.amount + model.repayment.totalPenalInterestDue

                                    } 
                                    else {
                                        model.repayment.amount = null;
                                    }
                                    model.repayment.demandAmount = model.repayment.amount || 0;
                                }
                            },
                            {
                                key:"repayment.transactionName",
                                "type":"select",
                                "required": true,
                                condition: "(!model._pageGlobals.hideTransactionName) && (model.siteCode == 'witfin' || model.siteCode == 'kinara')  && model.cbsLoanData.operationalStatus=='Write_off'",
                                titleMap: {
                                    "Recovery" : "Writeoff Recovery",
                                    "Writeoff_Settlement": "Writeoff Settlement"
                                },
                                onChange: function(value ,form, model){
                                    if ( value == 'Pre-closure'){
                                        model.repayment.amount = model.repayment.totalPayoffAmountToBePaid;
                                    } else if (value == 'Scheduled Demand'){
                                        model.repayment.amount = Utils.ceil(model.repayment.totalDue);
                                    }else if(value == 'PenalInterestPayment'){
                                        model.repayment.amount = model.repayment.bookedNotDuePenalInterest;
                                    }else if(value == 'Fee Payment'){
                                        model.repayment.amount = model.repayment.feeDue;
                                    } else {
                                        model.repayment.amount = null;
                                    }
                                    model.repayment.demandAmount = model.repayment.amount || 0;
                                }
                            },
                            {
                                key:"repayment.transactionName",
                                "type":"select",
                                "required": true,
                                condition: "(model._pageGlobals.hideTransactionName) && (model.siteCode == 'witfin' || model.siteCode == 'kinara') && model.cbsLoanData.operationalStatus=='Write_off'",
                                titleMap: {
                                    //"Scheduled Demand":"Scheduled Demand",
                                    "Recovery" : "Writeoff Recovery",
                                    "Writeoff_Settlement": "Writeoff Settlement"
                                },
                                onChange: function(value ,form, model){
                                    model.repayment.amount = null;
                                    model.repayment.demandAmount = model.repayment.amount || 0;
                                }
                            },
                            {
                                key:"repayment.transactionName",
                                "type":"select",
                                "required": true,
                                condition: "!model._pageGlobals.hideTransactionName && model.siteCode == 'shramsarathi'",
                                titleMap: {
                                    "Scheduled Demand":"Scheduled Demand",
                                    "Fee Payment":"Fee Payment",
                                    "Pre-closure":"Pre-closure",
                                    "Prepayment":"Prepayment",
                                    "PenalInterestPayment":"PenalInterestPayment",
                                    "Advance Repayment":"Advance Repayment"
                                },
                                onChange: function(value ,form, model){
                                    if ( value == 'Pre-closure'){
                                        model.repayment.amount = model.repayment.totalPayoffAmountToBePaid;
                                    } else if (value == 'Scheduled Demand'){
                                        model.repayment.amount = Utils.ceil(model.repayment.totalDue);
                                    }else if(value == 'PenalInterestPayment'){
                                        model.repayment.amount = model.repayment.bookedNotDuePenalInterest;
                                    }else if(value == 'Fee Payment'){
                                        model.repayment.amount = model.repayment.feeDue;
                                    } else {
                                        model.repayment.amount = null;
                                    }
                                    model.repayment.demandAmount = model.repayment.amount || 0;
                                }
                            },
                            {
                                key: "repayment.bookedNotDuePenalInterest",
                                readonly: true,
                                condition: "model.repayment.transactionName=='PenalInterestPayment'",
                                title: "BOOKED_NOT_DUE_PENAL_INTEREST",
                                type: "amount"
                            },
                            {
                                key: "repayment.totalPenalInterestDue",
                                readonly: true,
                                condition: "model.repayment.transactionName=='Scheduled Demand'",
                                title: "TOTAL_PENAL_INTEREST_DUE",
                                type: "amount"
                            },
                            {
                                type: "fieldset",
                                title: "PRECLOSURE_BREAKUP",
                                condition: "model.repayment.transactionName=='Pre-closure'",
                                items: [
                                    {
                                        key: "repayment.totalPrincipalDue",
                                        readonly: true,
                                        title: "TOTAL_PRINCIPAL_DUE",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.totalNormalInterestDue",
                                        readonly: true,
                                        title: "TOTAL_NORMAL_INTEREST_DUE",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.totalPenalInterestDue",
                                        readonly: true,
                                        title: "TOTAL_PERNAL_INTEREST_DUE",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.totalDemandDue",
                                        readonly: true,
                                        title: "TOTAL_DEMAND_DUE",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.principalNotDue",
                                        readonly: true,
                                        title: "PRINCIPAL_NOT_DUE",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.bookedNotDueNormalInterest",
                                        readonly: true,
                                        title: "BOOKED_NOT_DUE_NORMAL_INTEREST",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.bookedNotDuePenalInterest",
                                        readonly: true,
                                        title: "BOOKED_NOT_DUE_PENAL_INTEREST",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.recoverableInterest",
                                        readonly: true,
                                        title: "RECOVERABLE_INTEREST",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.securityDeposit",
                                        readonly: true,
                                        title: "SECURITY_DEPOSIT",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.preclosureFee",
                                        readonly: true,
                                        title: "PRECLOSURE_FEE",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.totalDue",
                                        readonly: true,
                                        title: "TOTAL_DEMAND_DUE",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.totalFeeDue",
                                        readonly: true,
                                        title: "FEE_DUE",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.netPayoffAmount",
                                        readonly: true,
                                        title: "NET_PAYOFF_AMOUNT",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.amount",
                                        readonly: true,
                                        condition:"model.siteCode == 'witfin'",
                                        title: "Net Payoff Amount(with Due)",
                                        type: "amount"
									},
									{
                                        key: "repayment.netPayoffAmountDue",
                                        readonly: true,
                                        title: "NET_PAYOFF_AMOUNT_DUE",
                                        type: "amount"
                                    },
                                    {
                                        type: "section",
                                        html: "<hr />"
                                    }
                                ]
                            },
                            {
                                type: "fieldset",
                                title: "DETAILS",
                                condition: "model.repayment.transactionName =='Recovery'",
                                items: [
                                    {
                                        key: "repayment.writeOffDate",
                                        readonly: true,
                                        title: "WRITE_OFF_DATE",
                                        type: "date"
                                    },
                                    {
                                        key: "repayment.principalWriteOff",
                                        readonly: true,
                                        title: "PRINCIPAL_WRITE_OFF",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.normalInterestWriteOff",
                                        readonly: true,
                                        title: "NORMAL_INTEREST_WRITE_OFF",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.penalInterestWriteOff",
                                        readonly: true,
                                        title: "PENAL_INTEREST_WRITE_OFF",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.feeWriteOff",
                                        readonly: true,
                                        title: "FEE_WRITE_OFF",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.principalRecovery",
                                        readonly: true,
                                        title: "PRINCIPAL_RECOVERY",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.normalInterestRecovery",
                                        readonly: true,
                                        title: "NORMAL_INTEREST_RECOVERY",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.penalInterestRecovery",
                                        readonly: true,
                                        title: "PENAL_INTEREST_RECOVERY",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.feeRecovery",
                                        readonly: true,
                                        title: "FEE_RECOVERY",
                                        type: "amount"
                                    },
                                    
                                ]
                            },
                            /* new box added for Settlement **/
                            {
                                type: "fieldset",
                                title: "DETAILS",
                                condition: "model.repayment.transactionName =='Settlement' || model.repayment.transactionName =='FullSettlement' || model.repayment.transactionName =='Writeoff_Settlement'",
                                items: [
                                    {
                                        key: "repayment.totalPrincipalDue",
                                        readonly: true,
                                        title: "TOTAL_PRINCIPAL_DUE",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.totalNormalInterestDue",
                                        readonly: true,
                                        title: "TOTAL_NORMAL_INTEREST_DUE",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.totalPenalInterestDue",
                                        readonly: true,
                                        title: "TOTAL_PENAL_INTEREST_DUE",
                                        type: "amount"
                                    },
                                    
                                    
                                ]
                            },
                            //end for settlement

                            {
                                key: "repayment.totalDemandDue",
                                readonly: true,
                                condition: "model.repayment.transactionName=='Scheduled Demand'",
                                title: "TOTAL_DEMAND_DUE",
                                type: "amount"
                            },
                            {
                                key: "repayment.totalFeeDue",
                                readonly: true,
                                condition: "model.repayment.transactionName=='Scheduled Demand' || model.repayment.transactionName=='Fee Payment'",
                                title: "TOTAL_FEE_DUE",
                                type: "amount"
                            },
                            {
                                key: "repayment.totalDue",
                                readonly: true,
                                title: "TOTAL_DUE",
                                condition: "model.repayment.transactionName=='Scheduled Demand' || model.repayment.transactionName == 'Advance Repayment'",
                                type: "amount"
                            },
                            {
                                key: "repayment.totalDueWithPenal",
                                readonly: true,
                                title: "Total Due with Penal Interest",
                                condition: "(model.repayment.transactionName=='Scheduled Demand' || model.repayment.transactionName == 'Advance Repayment') && model.repayment.totalDueWithPenal",
                                type: "amount"
                            },
                            {
                                key: "repayment.amount",
                                "required":true,
                                type: "number",
                                condition:"!model.repayment.chequeNumber"
                            },
                            {
                                key: "repayment.amount",
                                type: "number",
                                "readonly":true,
                                condition:"model.repayment.chequeNumber"
                            },
                            {
                                key: "repayment.chequeNumber",
                                type: "string",
                                "readonly":true,
                                "title":"CHEQUE_NUMBER",
                                condition:"model.repayment.chequeNumber"
                            },
                            {
                                condition: "model.pageConfig.repaymentDateIsReadonly == true",
                                key: "repayment.repaymentDate",
                                type: "date",
                                readonly: true
                            },
                            {
                                condition: "model.pageConfig.repaymentDateIsReadonly == false",
                                key: "repayment.repaymentDate",
                                type: "date"
                            },
                            {
                                "key": "repayment.cashCollectionRemark",
                                "type": "string",
                                "required": true
                            },
                            {
                                "type": "fieldset",
                                "title": "Fingerprint",
                                "condition": "model.$pageConfig.fingerprintEnabled==true",
                                "items": [
                                    {
                                        "key": "additional.override_fp",
                                        "condition": "model.$pageConfig.fingerprintEnabled==true"
                                    },
                                    {
                                        "key": "repayment.authorizationRemark",
                                        "condition": "model.additional.override_fp==true"
                                    }
                                ]
                            },
                            {
                                "key": "repayment.instrument",
                                "type": "select",
                                "required": true,
                                "titleMap": [{
                                    name: "Cash",
                                    value: "CASH"
                                }, {
                                    "name": "Cheque",
                                    "value": "CHQ"
                                }, {
                                    "name": "NEFT",
                                    "value": "NEFT"
                                }, {
                                    "name": "RTGS",
                                    "value": "RTGS"
                                }, {
                                    "name": "ACH",
                                    "value": "ACH"
                                },{
                                    "name": "Suspense",
                                    "value": "Suspense"
                                },
                                {
                                    "name": "Internal",
                                    "value": "INTERNAL"
                                },
                                {
                                    "name": "Security Deposit",
                                    "value": "SECURITY_DEPOSIT"
                                }
                                ],
                             },
                            {
                                "type": "fieldset",
                                "title": "PAYERS_INFORMATION",
                                "condition" : "model.pageConfig.ShowPayerInfo==true && model.repayment.instrument == 'CASH'",
                                "items": [{
                                    "key": "repayment.payeeName",
									"condition" : "model.siteCode != 'kinara'",
                                    "title": "PAYER_NAME",
                                    "type" :"string"
                                },
                                {
                                    "key": "repayment.payeeMobileNumber",
                                    "title": "PAYER_MOBILE_NUMBER",
                                    "type": "number"
                                },
                                {
                                    "key": "repayment.payeeRelationToApplicant",
                                    "title": "RELATIONSHIP_TO_APPLICANT",
                                    "condition" : "model.siteCode != 'kinara'",
                                    "type": "select",
                                    "enumCode": "payerRelation"
                                }]
                            },
                            {
                                key: "repayment.securityDeposit",
                                readonly: true,
                                title: "TOTAL_SECURITY_DEPOSIT_DUE",
                                condition:"model.repayment.instrument=='SECURITY_DEPOSIT'",
                                type: "amount"
                            },
                            {
                                key: "repayment.totalPrincipalDue",
                                readonly: true,
                                title: "TOTAL_PRINCIPAL_DUE",
                                condition:"model.repayment.instrument=='SECURITY_DEPOSIT'",
                                type: "amount"
                            },
                            {
                                key: "repayment.totalNormalInterestDue",
                                readonly: true,
                                title: "TOTAL_INTEREST_DUE",
                                condition:"model.repayment.instrument=='SECURITY_DEPOSIT'",
                                type: "amount"
                            },
                            {
                                key: "repayment.totalPenalInterestDue",
                                readonly: true,
                                title: "TOTAL_PENAL_INTEREST_DUE",
                                condition:"model.repayment.instrument=='SECURITY_DEPOSIT'",
                                type: "amount"
                            },
                            {
                                key: "repayment.totalFeeDue",
                                readonly: true,
                                title: "TOTAL_FEE_DUE",
                                condition:"model.repayment.instrument=='SECURITY_DEPOSIT'",
                                type: "amount"
                            },
                            {
                                key: "repayment.payOffAndDueAmount",
                                readonly: true,
                                title: "TOTAL_OUTSTANDING",
                                condition:"model.repayment.instrument=='SECURITY_DEPOSIT'",
                                type: "amount"
                            },
                            {
                                key:"repayment.reference",
                                title:"CHEQUE_NUMBER",
                                "schema": {
                                    type:"string",
                                    maxLength:6,
                                    minLength:6
                                },
                                required:true,
                                condition:"model.repayment.instrument=='CHQ'"
                            },
                            {
                                key: "repayment.bankAccountNumber",
                                type: "lov",
                                lovonly: true,
                                condition:"model.repayment.instrument=='CHQ'",
                                title:"REPAYMENT_TO_ACCOUNT",
                                required: true,
                                bindMap: {

                                },
                                outputMap: {
                                    "account_number": "repayment.bankAccountNumber"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form, model) {
                                    return Queries.getBankAccountsByPartnerForLoanRepay(
                                        SessionStore.getGlobalSetting('mainPartner') || "Kinara");
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.account_number,
                                        item.ifsc_code + ', ' + item.bank_name,
                                        item.branch_name
                                    ];
                                }
                            },
                            {
                                key:"repayment.instrumentDate",
                                title:"CHEQUE_DATE",
                                type:"date",
                                required:true,
                                condition:"model.repayment.instrument=='CHQ'"
                            },
                            {
                                key: "repayment.photoId",
                                title: "CHEQUE_PHOTO",
                                condition:"model.repayment.instrument=='CHQ'",
                                type: "file",
                                fileType: "image/*",
                                category: "Repayment",
                                subCategory: "Cheque"
                            },
                            {
                                key:"repayment.reference",
                                title:"REFERENCE_NUMBER",
                                type:"string",
                                required: true,
                                condition:"model.repayment.instrument=='NEFT' || model.repayment.instrument=='RTGS' || model.repayment.instrument == 'INTERNAL'"
                            },
                            {
                                key: "repayment.bankAccountNumber",
                                type: "lov",
                                lovonly: true,
                                condition:"model.repayment.instrument=='NEFT' || model.repayment.instrument=='RTGS'|| model.repayment.instrument=='ACH' || model.repayment.instrument == 'INTERNAL'",
                                title:"REPAYMENT_TO_ACCOUNT",
                                required: true,
                                bindMap: {

                                },
                                outputMap: {
                                    "account_number": "repayment.bankAccountNumber"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form, model) {
                                    return Queries.getBankAccountsByPartnerForLoanRepay();
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.account_number,
                                        item.ifsc_code + ', ' + item.bank_name,
                                        item.branch_name
                                    ];
                                }
                            },
                            {
                                key:"repayment.instrumentDate",
                                title:"DATE",
                                type:"date",
                                condition:"model.siteCode != 'witfin' && (modemodel.repayment.instrument=='NEFT' || model.repayment.instrument=='RTGS')"
                            },
                            {
                                key:"repayment.instrumentDate",
                                title:"DATE",
                                type:"date",
                                condition:"model.siteCode == 'witfin' && (model.repayment.instrument=='NEFT' || model.repayment.instrument=='RTGS')",
                                required:true
                            },
                            {
                                key:"repayment.visitedDate",
                                title:"VISITED_DATE",
                                required: true,
                                type:"date"
                            },
                            {
                                key: "repayment.delayReasonType",
                                title: "REASON_FOR_DELAY",
                                condition:"model.siteCode == 'witfin'",
                                type: "select",
                                enumCode:"reason_for_delay"
                            },
                            {
                                key: "repayment.delayReasonType",
                                title: "REASON_FOR_DELAY",
                                required: true,
                                type: "select",
                                condition:"model.siteCode != 'witfin'",
                                titleMap: [{
                                    "name": "Business",
                                    "value": "Business"
                                },
                                {
                                        "name": "Personal",
                                        "value": "Personal"
                                }],

                            },
                            {
                                key: "repayment.delayReasonType",
                                title: "REASON_FOR_DELAY",
                                condition:"model.siteCode == 'witfin'",
                                type: "select",
                                enumCode:"reason_for_delay"
                            },
                            {
                                key: "repayment.delayReasonType",
                                title: "REASON_FOR_DELAY",
                                condition:"model.siteCode == 'shramsarathi'",
                                type: "select",
                                titleMap: {
                                    "Business not running":"Business not running",
                                    "Hardship": "Hardship",
                                    "Wilful default":"Wilful default",
                                    "Can pay":"Can pay",
                                    "Others":"Others"
                                },
                            },
                            {
                                key: "repayment.delayReasonType",
                                title: "REASON_FOR_DELAY",
                                required: true,
                                type: "select",
                                condition:"model.siteCode == 'KGFS' && model.siteCode != 'shramsarathi' && model.siteCode == 'KGFS'",
                                titleMap: {
                                    "Business not running":"Business not running",
                                    "Hardship": "Hardship",
                                    "Wilful default":"Wilful default",
                                    "Can pay":"Can pay",
                                    "Others":"Others"
                                },

                            },
                            {
                                key: "repayment.overdueReasons",
                                title: "REASON",
                                type: "select",
                                required: true,
                                condition: "model.repayment.delayReasonType =='Business' && model.siteCode != 'witfin' && model.siteCode != 'KGFS' ",
                                enumCode: "business_overdue_reasons"
                                // titleMap:[
                                //     {
                                //         "value":"others",
                                //         "name":"Others"
                                // }
                                // ]

                            },
                            {
                                key: "repayment.overdueReasons",
                                title: "REASON",
                                type: "select",
                                required: true,
                                condition: "model.repayment.delayReasonType=='Personal' && model.siteCode != 'witfin' && model.siteCode != 'KGFS'",
                                enumCode: "personal_overdue_reasons",
                                // titleMap:[
                                //     {
                                //         "value":"others",
                                //         "name":"Others"
                                // }
                                // ]
                            },
                            // {
                            //     key: "repayment.overdueReasons",
                            //     title: "REASON",
                            //     type: "select",
                            //     required: true,
                            //     condition: "model.repayment.delayReasonType =='Business'",
                            //     // enumCode: "business_overdue_reasons"
                            //     titleMap:[
                            //         {
                            //             "value":"others",
                            //             "name":"Others"
                            //     }
                            //     ]

                            // },
                            // {
                            //     key: "repayment.overdueReasons",
                            //     title: "REASON",
                            //     type: "select",
                            //     required: true,
                            //     condition: "model.repayment.delayReasonType=='Personal'",
                            //     // enumCode: "personal_overdue_reasons",
                            //     titleMap:[
                            //         {
                            //             "value":"others",
                            //             "name":"Others"
                            //     }
                            //     ]
                            // },
                            {
                                key: "repayment.reasons",
                                title: "OVERDUE_REASON",
                                type: "textarea",
                                required: true,
                                "condition": "model.repayment.overdueReasons=='Others'"

                            },
                        ]

                    },
                    {
                        "type":"actionbox",
                        "items": [
                            {
                                "type":"submit",
                                "style":"btn-theme",
                                "title":"REPAY"
                            }
                        ]
                    }
                ],
                schema: {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "type": "object",
                    "properties": {
                        "repayment": {
                            "type": "object",
                            "properties": {
                                "accountNumber": {
                                    "type": "string",
                                    "title":"ACCOUNT_ID"
                                },
                                "amount": {
                                    "type": "number",
                                    "title":"AMOUNT_PAID"

                                },
                                "authorizationRemark": {
                                    "type": "string",
                                    "title":"AUTHORIZATION_REMARK"
                                },
                                "authorizationUsing": {
                                    "type": "string",
                                    "title":"AUTHORIZATION_USING"
                                },
                                "cashCollectionRemark": {
                                    "type": "string",
                                    "title":"CASH_COLLECTION_REMARK"
                                },
                                "groupCode": {
                                    "type": "string",
                                    "title":"GROUP_CODE"
                                },
                                "instrument": {
                                    "type": "string",
                                    "title": "INSTRUMENT_TYPE",
                                    "required": true
                                },
                                "productCode": {
                                    "type": "string",
                                    "title":"PRODUCT_CODE"
                                },
                                "remarks": {
                                    "type": "string",
                                    "title":"REMARKS"
                                },
                                "ifscCode": {
                                    "type": "string",
                                    "title":"IFSC_CODE"
                                },
                                "customerBankName": {
                                    "type": "string",
                                    "title":"CUSTOMER_BANK_NAME"
                                },
                                "bankBranchDetails": {
                                    "type": "string",
                                    "title":"BANK_BRANCH_DETAILS"
                                },
                                "repaymentDate": {
                                    "type": "string",
                                    "title":"REPAYMENT_DATE",
                                    "x-schema-form": {
                                        "type": "date"
                                    }
                                },
                                "transactionId": {
                                    "type": "string",
                                    "title":"TRANSACTION_ID"
                                },
                                "transactionName": {
                                    "type": "string",
                                    "title":"TRANSACTION_NAME"
                                },
                                "urnNo": {
                                    "type": "string",
                                    "title":"URN_NO"
                                }
                            },
                            required: [
                                'instrument'
                            ]
                        },
                        "additional": {
                            "type": "object",
                            "properties": {
                                "override_fp": {
                                    "type": "boolean",
                                    "title":"OVERRIDE_FINGERPRINT",
                                    "default": false
                                }
                            }
                        }
                    },
                    "required": [
                        "accountNumber",
                        "amount",
                        "authorizationRemark",
                        "authorizationUsing",
                        "cashCollectionRemark",
                        "groupCode",
                        "productCode",
                        "remarks",
                        "repaymentDate",
                        "transactionId",
                        "transactionName",
                        "urnNo"
                    ]
                },
                actions: {
                    preSave: function (model, formCtrl) {
                        var deferred = $q.defer();
                        model._storedData = null;
                        deferred.resolve();
                        return deferred.promise;
                    },
                    submit: function (model, formCtrl, formName) {
                        if(model.cbsLoanData.operationalStatus == 'Settled'){
                            PageHelper.clearErrors();
                            PageHelper.setError({
                                message: "This Account is Settled can't able to do any collections"
                            });
                            
                            return false;
                        }
                        if(model.cbsLoanData.operationalStatus == 'Closed'){
                            PageHelper.clearErrors();
                            PageHelper.setError({
                                message: "This Account is Closed can't able to do any collections"
                            });

                                return false;
                        }
                        if (model.repayment.transactionName == 'Recovery'){
                            model.repayment.bookedNotDuePenalInterest = model.repayment.amount;
                            if(model.cbsLoanData.operationalStatus!="Write_off"){
                                PageHelper.clearErrors();
                            PageHelper.setError({
                                message: "Repayment operation status is not " +"Write_off"
                            });

                                return false;
                            }
                            else{
                                console.log(model.cbsLoanData.operationalStatus);
                            }
                        }
                        if (model.repayment.demandAmount > 0 && model.repayment.transactionName == "Advance Repayment"){
                            PageHelper.showProgress("loan-repay","Advance Repayment is not allowed for an outstanding Loan",5000);
                            return false;
                        }

                        if (model.repayment.transactionName == 'PenalInterestPayment' && Math.round(model.repayment.amount) > Math.round(model.cbsLoanData.bookedNotDuePenalInterest)  ) {
                            PageHelper.clearErrors();
                            PageHelper.setError({
                                message: "Repayment amount should not be greater then " +" " + model.cbsLoanData.bookedNotDuePenalInterest
                            });
                            return false;
                        }

                        if (model.repayment.transactionName == 'PenalInterestPayment'){
                            model.repayment.bookedNotDuePenalInterest = model.repayment.amount;
                        }

                        if(!mobileNumberValidation(model.repayment.payeeMobileNumber)){
                            PageHelper.showProgress("user-validate", "Invalide  Payee Mobile Number", 5000);
                            return;
                        }

                        if (Utils.compareDates(model.repayment.repaymentDate, model.workingDate) == 1){
                            PageHelper.showProgress('validation-error', 'Future dated payments are not allowed. Please check your repayment date', 4000);
                            return false;
                        }

                        if (model.repayment.instrument == 'CHQ'){
                            if(isNaN(parseInt(model.repayment.reference))){
                                PageHelper.showProgress("loan-repay","Not a valid cheque number.",5000);
                                return;
                            } else if (parseInt(model.repayment.reference) == 0){
                                PageHelper.showProgress("loan-repay","Zero is not a valid cheque number.",5000);
                                return;
                            }

                            // var currDate = Utils.getCurrentDate();
                            // var cheqDate = model.repayment.chequeDate;

                            // if (Utils.compareDates(cheqDate, currDate) === -1){
                            //     PageHelper.showProgress("loan-repay","Back dated cheques are not accepted.",5000);
                            //     return;
                            // }
                        }

                        var cashPerDayLimit = new Number(SessionStore.getGlobalSetting("perDayLimit") || "0");
                        if (model.repayment.instrument=='CASH' &&
                                model.repayment.amount>cashPerDayLimit ){
                            PageHelper.showProgress("loan-repay","Cash payments more than " + cashPerDayLimit + " is not allowed",5000);
                            return;
                        }
                        if (model.siteCode == 'witfin' && model.repayment.amount >=199999 && model.repayment.instrument == 'CASH'){
                            PageHelper.clearErrors();
                            PageHelper.setError({
                                message: "please enter amount less than 199999 for cash type"
                            });
                            return false;
                        }

                        // if (model._screen && model._screen =='BounceQueue'){
                        //     if (model.repayment.amount > model.repayment.totalDue){
                        //         PageHelper.showProgress("loan-repay","Amount paid cannot be more than the Total due",5000);
                        //         return;
                        //     }
                        // }

                        $log.info("Inside submit");
                        Utils.confirm("Are you sure?")
                            .then(
                                function() {
                                    PageHelper.showBlockingLoader("Processing...");
                                    /*var postData = _.cloneDeep(model.repayment);
                                    postData.amount = parseInt(Number(postData.amount))+"";
                                    postData.instrument = model.repayment.instrument;
                                    LoanAccount.repay(postData,function(resp,header){
                                        $log.info(resp);
                                        try{
                                            alert(resp.response);
                                            PageHelper.navigateGoBack();
                                        }catch(err){

                                        }
                                    */
                                    var postData = {
                                        "loanCollection": {}
                                    };

                                    if(model.repayment.delayReasonType) {
                                        postData.loanCollection.delayReasonType=model.repayment.delayReasonType;
                                        if(model.repayment.overdueReasons){
                                            if(model.repayment.overdueReasons=='Others')
                                                model.repayment.overdueReasons=model.repayment.reasons;
                                            else
                                                postData.loanCollection.overdueReasons=model.repayment.overdueReasons
                                        }
                                    }

                                    postData.loanCollection.accountNumber = model.repayment.accountNumber;
                                    postData.loanCollection.bankAccountNumber = model.repayment.bankAccountNumber;
                                    postData.loanCollection.normalInterest=0;
                                    if (model.repayment.transactionName == 'Scheduled Demand') {
                                        postData.loanCollection.demandAmount = model.repayment.totalDue;
                                    } else if (model.repayment.transactionName == 'Pre-closure') {
                                        postData.loanCollection.demandAmount = model.repayment.totalPayoffAmountToBePaid;
                                    } else if (model.repayment.transactionName == 'Fee Payment') {
                                        postData.loanCollection.demandAmount = model.repayment.totalFeeDue;
                                        postData.loanCollection.feeAmount = model.repayment.amount;
                                    }

                                    postData.loanCollection.demandDate = "";
                                    postData.loanCollection.feeDue = model.repayment.totalFeeDue;
                                    postData.loanCollection.visitedDate = model.repayment.visitedDate;
                                    postData.loanCollection.installmentAmount = model.cbsLoanData.equatedInstallment;
                                    postData.loanCollection.instrumentDate = model.repayment.instrumentDate;
                                    postData.loanCollection.instrumentType = model.repayment.instrument;
                                    postData.loanCollection.interestAmount = model.repayment.totalNormalInterestDue;
                                    postData.loanCollection.overdueAmount = model.repayment.totalDemandDue;
                                    postData.loanCollection.penalInterestDue = model.cbsLoanData.totalPenalInterestDue;
                                    postData.loanCollection.principalDue = model.cbsLoanData.totalPrincipalDue;
                                    postData.loanCollection.reference = model.repayment.reference;
                                    postData.loanCollection.remarks = model.repayment.remarks;
                                    postData.loanCollection.latitude = model.repayment.latitude;
                                    postData.loanCollection.longitude = model.repayment.longitude;
                                    postData.loanCollection.repaymentAmount = model.repayment.amount;
                                    postData.loanCollection.repaymentDate = model.repayment.repaymentDate;
                                    postData.loanCollection.repaymentType = model.repayment.transactionName;
                                    postData.loanCollection.transactionName = model.repayment.transactionName;
                                    postData.loanCollection.agentTrxn = false;
                                    postData.loanCollection.unapprovedAmount = model.additional.unapprovedAmount;
                                    postData.loanCollection.payeeName = model.repayment.payeeName;
                                    postData.loanCollection.payeeMobileNumber = model.repayment.payeeMobileNumber;
                                    postData.loanCollection.payeeRelationToApplicant = model.repayment.payeeRelationToApplicant;
                                    postData.loanCollection.bookedNotDuePenalInterest=model.repayment.bookedNotDuePenalInterest;
                                    postData.loanCollection.cashCollectionRemarks = model.repayment.cashCollectionRemark;

                                    if (model.repayment.id) {
                                        postData.loanCollection.feeAmount = 0;
                                        //According to new change , if instrument type is cash or cheque , they will go to BranchDeposit stage
                                        if ( model.siteCode == 'kinara' && (postData.loanCollection.instrumentType == 'CASH' || postData.loanCollection.instrumentType=='CHQ')) {
                                            postData.stage = "BranchDeposit";
                                        } else if (model.siteCode != 'kinara' && postData.loanCollection.instrumentType == 'CASH') {
                                            postData.stage = "Deposit";
                                        } else if (postData.loanCollection.instrumentType == 'ACH') {
                                            //postData.loanCollection.instrumentType = "NEFT";
                                            postData.loanCollection.scheduleDemandAmount = model.repayment.amount;
                                            postData.loanCollection.feeWaiverAmount = 0;
                                            postData.loanCollection.penalInterestWaiverAmount = 0;
                                            postData.loanCollection.feeAmount = 0;
                                            postData.loanCollection.securityEmiAmount = 0;
                                            postData.stage = "Completed";
                                        } else if (postData.loanCollection.instrumentType == 'Suspense') {
                                            postData.stage = "CreditValidation";
                                            postData.loanCollection.bankAccountNumber = model.additional.suspenseBankAccount;
                                        } else if(postData.loanCollection.instrumentType == 'SECURITY_DEPOSIT'){
                                            postData.stage = "CreditValidation";
                                        }else {
                                            postData.stage = "BRSValidation";
                                        }


                                        postData.repaymentProcessAction = "PROCEED";
                                        postData.loanCollection.id = model.repayment.id;
                                        LoanCollection.update(postData, function(resp, header) {
                                            $log.info(resp);
                                            try {
                                                PageHelper.navigateGoBack();
                                            } catch (err) {

                                            }
                                        }, function(resp) {
                                            PageHelper.showErrors(resp);
                                        }).$promise.finally(function() {
                                            PageHelper.hideBlockingLoader();
                                        });
                                    } else {
                                        postData.repaymentProcessAction = "SAVE";
                                        if(postData.loanCollection.transactionName=='Recovery'){
                                            CollectionHelper.allocateAmountForWriteOffRecovery(postData.loanCollection,model.cbsLoanData)
                                        }
                                        else if(postData.loanCollection.transactionName=='Settlement'){
                                            CollectionHelper.allocateAmountForSettlement(postData.loanCollection,model.cbsLoanData);
                                        }
                                        LoanCollection.save(postData, function(resp, header) {
                                            $log.info(resp);
                                            try {
                                                 //According to new change , if instrument type is cash or cheque , they will go to BranchDeposit stage
                                                if ( model.siteCode == 'kinara' && (postData.loanCollection.instrumentType == 'CASH' || postData.loanCollection.instrumentType=='CHQ')) {
                                                    postData.stage = "BranchDeposit";
                                                } else if (model.siteCode != 'kinara' && postData.loanCollection.instrumentType == 'CASH') {
                                                    resp.stage = "Deposit";
                                                } else if (postData.loanCollection.instrumentType == 'ACH') {
                                                    // resp.loanCollection.instrumentType = "NEFT";
                                                    resp.loanCollection.scheduleDemandAmount = resp.loanCollection.repaymentAmount;
                                                    resp.loanCollection.feeWaiverAmount = 0;
                                                    resp.loanCollection.penalInterestWaiverAmount = 0;
                                                    resp.loanCollection.feeAmount = 0;
                                                    resp.loanCollection.securityEmiAmount = 0;
                                                    resp.stage = "Completed";
                                                } else if (postData.loanCollection.instrumentType == 'INTERNAL') {
                                                    resp.stage = "CreditValidation";
                                                } else if (postData.loanCollection.instrumentType == 'Suspense'){
                                                    resp.stage = "CreditValidation";
                                                    resp.loanCollection.bankAccountNumber = model.additional.suspenseCode;
                                                } else if (postData.loanCollection.instrumentType == 'SECURITY_DEPOSIT') {
                                                    resp.stage = "CreditValidation";
                                                } else {
                                                    resp.stage = "BRSValidation";
                                                }
                                                resp.repaymentProcessAction = "PROCEED";

                                                LoanCollection.update(resp).$promise
                                                    .then(function(res, head) {
                                                        PageHelper.showProgress('action-succes', 'Repayment done succesfully.', 5000);
                                                        PageHelper.navigateGoBack();
                                                    }, function(httpres) {

                                                    })
                                            } catch (err) {

                                            }
                                        }, function(resp) {
                                            PageHelper.showErrors(resp);
                                        }).$promise.finally(function() {
                                            PageHelper.hideBlockingLoader();
                                        });

                                    }
                                })
                    }
                }
            }
        }]);
