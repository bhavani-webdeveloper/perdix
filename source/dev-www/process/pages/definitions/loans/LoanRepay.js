irf.pageCollection.factory(irf.page('loans.LoanRepay'),
    ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan","LoanCollection","PagesDefinition","irfNavigator","Locking",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, 
            Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan,LoanCollection,PagesDefinition,irfNavigator,Locking) {

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

                    PagesDefinition.getPageConfig("Page/Engine/loans.LoanRepay")
                    .then(function(data){
                        // defaulting
                        var defaultConfig = {
                            ShowPayerInfo: false
                        };
                        _.defaults(data, defaultConfig);
                        model.pageConfig = data;
                    });

                    var config = {
                        fingerprintEnabled: false
                    };

                    model.additional = {
                        unapprovedAmount: 0,
                        unapprovedTransactionsCount: 0
                    };
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
                        model.repayment.totalPayoffAmountToBePaid = Utils.roundToDecimal(data.payOffAndDueAmount + data.preclosureFee - data.securityDeposit);
                        model.repayment.totalSecurityDepositDue = Utils.roundToDecimal(data.totalSecurityDepositDue);
                        if (!_.isNull(pageData) && pageData.onlyDemandAllowed == true) {
                            if (model.repayment.bookedNotDuePenalInterest) {
                                model.repayment.totalDueWithPenal = Utils.roundToDecimal(model.repayment.totalDue) + Utils.roundToDecimal(model.repayment.bookedNotDuePenalInterest);
                            }
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
                                var rowsCount = rows.length;
                                var totalAmount = 0;
                                for (var i=0;i<rowsCount;i++){
                                    totalAmount= totalAmount + rows[i].repayment_amount;
                                }
                                model.additional.unapprovedAmount = totalAmount;
                                model.additional.unapprovedTransactionsCount = rowsCount;
                            }
                        )

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
                                        Locking.lock({
                                            "processType": "Loan",
                                            "processName": "Collections",
                                            "recordId": model.loanAccount.id
                                        }).$promise.then(function() {

                                        }, function(err) {
                                            irfProgressMessage.pop("Locking",err.data.error, 6000);
                                            irfNavigator.goBack();
                                        });
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
                                    "type": "string"
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
                                condition: "!model._pageGlobals.hideTransactionName",
                                titleMap: {
                                    "Scheduled Demand":"Scheduled Demand",
                                    "Fee Payment":"Fee Payment",
                                    "Pre-closure":"Pre-closure",
                                    "Prepayment":"Prepayment",
                                    "PenalInterestPayment":"PenalInterestPayment"
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
                                        key: "repayment.totalFeeDue",
                                        readonly: true,
                                        title: "TOTAL_FEE_DUE",
                                        type: "amount"
                                    },
                                    {
                                        key: "repayment.netPayoffAmount",
                                        readonly: true,
                                        title: "NET_PAYOFF_AMOUNT",
                                        type: "amount"
                                    },
                                    {
                                        type: "section",
                                        html: "<hr />"
                                    }
                                ]
                            },
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
                                key: "repayment.repaymentDate",
                                type: "date"
                            },
                            "repayment.cashCollectionRemark",
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
                                /*onChange: function(value, form, model) {
                                    if (value == 'PDC') {
                                        PageHelper.showLoader();
                                        Queries.getPDCDemands({
                                            "accountNumber": model.repayment.accountNumber
                                        }).then(
                                            function(resQuery) {
                                                $log.info(resQuery);
                                                if (resQuery && resQuery.length && resQuery.length > 0) {
                                                    model.repayment.amount = resQuery[0].repayment_amount;
                                                    model.repayment.chequeNumber = resQuery[0].cheque_number;
                                                }
                                                PageHelper.hideLoader();
                                            },
                                            function(errQuery) {
                                                PageHelper.hideLoader();
                                            }
                                        )
                                    }
                                    else {
                                        model.repayment.chequeNumber = "";
                                        model.repayment.amount = "";
                                        if (model.repayment.transactionName) {
                                            if (model.repayment.transactionName == 'Pre-closure') {
                                                if(model.repayment.totalPayoffAmountToBePaid){
                                                    model.repayment.amount = model.repayment.totalPayoffAmountToBePaid;
                                                }
                                            } else if (model.repayment.transactionName == 'Scheduled Demand') {
                                                if(model.repayment.totalDue){
                                                    model.repayment.amount = Utils.ceil(model.repayment.totalDue);
                                                }
                                            } else {
                                                model.repayment.amount = null;
                                            }
                                            model.repayment.demandAmount = model.repayment.amount || 0;
                                        }

                                    }
                                }*/
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
                                condition:"model.repayment.instrument=='NEFT' || model.repayment.instrument=='RTGS'||model.repayment.instrument=='ACH' || model.repayment.instrument == 'INTERNAL'",
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
                                condition:"model.repayment.instrument=='NEFT' || model.repayment.instrument=='RTGS'"
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
                                required: true,
                                type: "select",
                                titleMap: {
                                    "Business not running":"Business not running",
                                    "Hardship": "Hardship",
                                    "Wilful default":"Wilful default",
                                    "Can pay":"Can pay",
                                    "Others":"Others"
                                },

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
                        if (model.repayment.demandAmount > 0 && model.repayment.transactionName == "Advance Repayment"){
                            PageHelper.showProgress("loan-repay","Advance Repayment is not allowed for an outstanding Loan",5000);
                            return false;
                        }

                        if (model.repayment.transactionName == 'Pre-closure' && Math.round(model.repayment.netPayoffAmount) > Math.round(model.repayment.amount)) {
                            PageHelper.showProgress("loan-repay", "Preclosure not allowed. Still " + model.repayment.netPayoffAmount - model.repayment.amount + " due is there", 5000);
                            return false;
                        }

                        if (model.repayment.transactionName == 'Pre-closure' && Math.round(model.repayment.netPayoffAmount) < Math.round(model.repayment.amount)) {
                            PageHelper.showProgress("loan-repay", "Preclosure not allowed. Execess of " + model.repayment.amount - model.repayment.netPayoffAmount + " amount paying", 5000);
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
                                        LoanCollection.save(postData, function(resp, header) {
                                            $log.info(resp);
                                            try {
                                                 //According to new change , if instrument type is cash or cheque , they will go to BranchDeposit stage
                                                if ( model.siteCode == 'kinara' && (postData.loanCollection.instrumentType == 'CASH' || postData.loanCollection.instrumentType=='CHQ')) {
                                                    postData.stage = "BranchDeposit";
                                                } else if (model.siteCode != 'kinara' && postData.loanCollection.instrumentType == 'CASH') {
                                                    postData.stage = "Deposit";
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
