irf.pageCollection.factory(irf.page('loans.LoanRepay'),
    ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan","LoanCollection",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan,LoanCollection) {


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
            }

            return {
                "type": "schema-form",
                "title": "LOAN_REPAYMENT",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {

                    pageInit();

                    var config = {
                        fingerprintEnabled: false
                    };

                    model.additional = {
                        unapprovedAmount: 0,
                        unapprovedTransactionsCount: 0
                    };

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
                        model.repayment.urnNo = data.customerId1;
                        model.repayment.payOffAndDueAmount = Utils.ceil(data.payOffAndDueAmount);
                        model.repayment.totalFeeDue = Utils.roundToDecimal(data.totalFeeDue);
                        model.repayment.recoverableInterest = Utils.roundToDecimal(data.recoverableInterest);
                        model.repayment.principalNotDue = Utils.roundToDecimal(data.principalNotDue);
                        model.repayment.totalNormalInterestDue  = Utils.roundToDecimal(data.totalNormalInterestDue);
                        model.repayment.preclosureFee = Utils.roundToDecimal(data.preclosureFee);
                        model.repayment.payOffAmount = Utils.roundToDecimal(data.payOffAmount);
                        model.repayment.totalDemandDue = Utils.roundToDecimal(data.totalDemandDue);
                        model.repayment.totalDue = Utils.roundToDecimal(data.totalDemandDue + data.totalFeeDue + data.totalSecurityDepositDue);
                        model.repayment.bookedNotDueNormalInterest = Utils.roundToDecimal(data.bookedNotDueNormalInterest);
                        model.repayment.bookedNotDuePenalInterest = Utils.roundToDecimal(data.bookedNotDuePenalInterest);
                        model.repayment.securityDeposit = Utils.roundToDecimal(data.securityDeposit);
                        model.repayment.netPayoffAmount = Utils.roundToDecimal(data.payOffAmount + data.preclosureFee - data.securityDeposit);
                        model.repayment.totalPayoffAmountToBePaid = Utils.roundToDecimal(data.payOffAndDueAmount + data.preclosureFee - data.securityDeposit);
                        model.repayment.totalSecurityDepositDue = Utils.roundToDecimal(data.totalSecurityDepositDue);

                        //_pageGlobals.totalDemandDue = data.totalDemandDue;
                    
                        irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                    }, function (resData) {
                        irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                        PageHelper.showErrors(resData);
                        backToLoansList();
                    });

                    var p3 = LoanCollection.query({"currentStage":"Initiation","accountNumber":loanAccountNo}).$promise
                            .then(function (resp){
                                model.repayment.id = resp.body[0].id;
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



                    $q.all([promise, p3, p4])
                        .finally(
                            function(){
                                PageHelper.hideLoader();
                            }
                        )

                    /* Load loan Information */
                    IndividualLoan.search({
                        'accountNumber': loanAccountNo,
                        'stage' : 'Completed'
                    }).$promise.then(
                        function(res){
                            if (_.isArray(res.body) && res.body.length>0){
                                var item = res.body[0];
                                IndividualLoan.get({id: item.loanId})
                                    .$promise
                                    .then(
                                        function(res){
                                            model.loanAccount = res;
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
                                    "Prepayment":"Prepayment"
                                },
                                onChange: function(value ,form, model){
                                    if ( value == 'Pre-closure'){
                                        model.repayment.amount = model.repayment.totalPayoffAmountToBePaid;
                                    } else if (value == 'Scheduled Demand'){
                                        model.repayment.amount = Utils.ceil(model.repayment.totalDue);
                                    } else {
                                        model.repayment.amount = null;
                                    }
                                    model.repayment.demandAmount = model.repayment.amount || 0;
                                }
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
                            // {
                            //     key: "repayment.totalSecurityDepositDue",
                            //     readonly: true,
                            //     title: "TOTAL_SECURITY_DEPOSIT_DUE",
                            //     condition: "model.repayment.transactionName=='Scheduled Demand' && model.repayment.totalSecurityDepositDue > 0",
                            //     type: "amount"
                            // },
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
                                key: "repayment.amount",
                                type: "number"
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
                                "titleMap": [
                                    {
                                        name: "Cash",
                                        value: "CASH"
                                    },
                                    {
                                        "name":"Cheque",
                                        "value":"CHQ"
                                    },
                                    {
                                        "name":"NEFT",
                                        "value":"NEFT"
                                    },
                                    {
                                        "name":"RTGS",
                                        "value":"RTGS"
                                    }

                                ]
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
                                autolov: true,
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
                                    return Queries.getBankAccountsByPartner("Kinara");
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
                                condition:"model.repayment.instrument=='NEFT' || model.repayment.instrument=='RTGS'"
                            },
                            {
                                key: "repayment.bankAccountNumber",
                                type: "lov",
                                autolov: true,
                                condition:"model.repayment.instrument=='NEFT' || model.repayment.instrument=='RTGS'",
                                title:"REPAYMENT_TO_ACCOUNT",
                                required: true,
                                bindMap: {

                                },
                                outputMap: {
                                    "account_number": "repayment.bankAccountNumber"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form, model) {
                                    return Queries.getBankAccounts();
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
                            }
                        ]
                    },
                    {
                        "type":"actionbox",
                        "items": [
                            {
                                "type":"submit",
                                "style":"btn-theme",
                                "title":"SUBMIT"

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

                        if (model.repayment.transactionName == 'Pre-closure' && model.repayment.totalDemandDue > 0){
                            PageHelper.showProgress("loan-repay", "Preclosure not allowed. Demand of " + model.repayment.totalDemandDue + " is due.", 5000);
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
                        
                        // if (model._screen && model._screen =='BounceQueue'){
                        //     if (model.repayment.amount > model.repayment.totalDue){
                        //         PageHelper.showProgress("loan-repay","Amount paid cannot be more than the Total due",5000);
                        //         return;
                        //     }
                        // }

                        $log.info("Inside submit");
                        if(window.confirm("Are you Sure?")){
                            PageHelper.showLoader();
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
                            var postData = {"loanCollection":{}};
                            postData.loanCollection.accountNumber = model.repayment.accountNumber;
                            postData.loanCollection.bankAccountNumber = model.repayment.bankAccountNumber;
                            
                            if (model.repayment.transactionName == 'Scheduled Demand'){
                                postData.loanCollection.demandAmount = model.repayment.totalDue;    
                            } else if (model.repayment.transactionName == 'Pre-closure') {
                                postData.loanCollection.demandAmount = model.repayment.totalPayoffAmountToBePaid;    
                            } else if (model.repayment.transactionName == 'Fee Payment'){
                                postData.loanCollection.demandAmount = model.repayment.totalFeeDue;    
                            }

                            postData.loanCollection.demandDate = "";
                            postData.loanCollection.feeDue = model.repayment.totalFeeDue;
                            postData.loanCollection.installmentAmount = model.cbsLoanData.equatedInstallment;
                            postData.loanCollection.instrumentDate = model.repayment.instrumentDate;
                            postData.loanCollection.instrumentType = model.repayment.instrument;
                            postData.loanCollection.interestAmount = model.repayment.totalNormalInterestDue;
                            postData.loanCollection.overdueAmount = model.repayment.totalDemandDue;
                            postData.loanCollection.penalInterestDue = model.cbsLoanData.totalPenalInterestDue;
                            postData.loanCollection.principalDue = model.cbsLoanData.totalPrincipalDue;
                            postData.loanCollection.reference = model.repayment.reference;
                            postData.loanCollection.remarks = model.repayment.remarks;
                            postData.loanCollection.repaymentAmount = model.repayment.amount;
                            postData.loanCollection.repaymentDate = model.repayment.repaymentDate;
                            postData.loanCollection.repaymentType = model.repayment.transactionName;
                            postData.loanCollection.transactionName = model.repayment.transactionName;
                            postData.loanCollection.agentTrxn = false;
                            postData.loanCollection.unapprovedAmount = model.additional.unapprovedAmount;

                            if(model.repayment.id){
                                if(postData.loanCollection.instrument == 'CASH')
                                    postData.stage="Deposit";
                                else
                                    postData.stage="CreditValidation";
                                postData.repaymentProcessAction = "PROCEED";
                                postData.loanCollection.id = model.repayment.id;
                                LoanCollection.update(postData,function(resp,header){
                                $log.info(resp);
                                try{
                                    PageHelper.navigateGoBack();
                                }catch(err){

                                }
                            },function(resp){
                                PageHelper.showErrors(resp);
                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });
                            }
                            else{
                                postData.repaymentProcessAction = "SAVE";
                                LoanCollection.save(postData,function(resp,header){
                                    $log.info(resp);
                                    try{
                                        if(postData.loanCollection.instrumentType == 'CASH')
                                            resp.stage="Deposit";
                                        else
                                            resp.stage="CreditValidation";
                                        resp.repaymentProcessAction = "PROCEED";

                                        LoanCollection.update(resp).$promise
                                            .then(function(res,head){
                                                PageHelper.showProgress('action-succes', 'Repayment done succesfully.', 5000);
                                                PageHelper.navigateGoBack();
                                            },function(httpres){

                                            })
                                    }catch(err){

                                    }
                                },function(resp){
                                    PageHelper.showErrors(resp);
                                }).$promise.finally(function(){
                                    PageHelper.hideLoader();
                                });
                            }

                        }
                    }
                }
            }
        }]);
