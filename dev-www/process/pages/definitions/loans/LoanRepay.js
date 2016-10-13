irf.pageCollection.factory(irf.page('loans.LoanRepay'),
    ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan) {


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

                    model.$pageConfig = config;
                    model._pageGlobals = _pageGlobals;
                    model.repayment = {};

                    if (_pageGlobals.hideTransactionName == true && !_.isNull(_pageGlobals.transactionName)){
                        model.repayment.transactionName = _pageGlobals.transactionName;
                    }

                    PageHelper.showLoader();
                    irfProgressMessage.pop('loading-loan-details', 'Loading Loan Details');
                    //PageHelper
                    var loanAccountNo = ($stateParams.pageId.split("."))[0];
                    var promise = LoanAccount.get({accountId: loanAccountNo}).$promise;
                    promise.then(function (data) { /* SUCCESS */
                        model.loanAccount = data;
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
                        model.repayment.demandAmount = Utils.ceil(data.totalDemandDue);
                        model.repayment.payOffAndDueAmount = Utils.ceil(data.payOffAndDueAmount);
                        model.repayment.totalFeeDue = Utils.ceil(data.totalFeeDue);
                        model.repayment.recoverableInterest = data.recoverableInterest;
                        model.repayment.principalNotDue = data.principalNotDue;
                        model.repayment.totalNormalInterestDue  = data.totalNormalInterestDue ;
                        model.repayment.preclosureFee = data.preclosureFee;
                        model.repayment.payOffAmount = data.payOffAmount;
                        model.repayment.totalDemandDue = data.totalDemandDue;
                        model.repayment.bookedNotDueNormalInterest = data.bookedNotDueNormalInterest;
                        model.repayment.bookedNotDuePenalInterest = data.bookedNotDuePenalInterest;

                        model.repayment.totalPayoffAmountToBePaid = Utils.ceil(data.payOffAndDueAmount + data.preclosureFee);

                        //_pageGlobals.totalDemandDue = data.totalDemandDue;

                        var currDate = moment(new Date()).format("YYYY-MM-DD");
                        model.repayment.repaymentDate = currDate;
                        irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                    }, function (resData) {
                        irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                        PageHelper.showErrors(resData);
                        backToLoansList();
                    })
                    .finally(function () {
                        PageHelper.hideLoader();
                    })

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
                            {
                                key: "loanAccount.coApplicantName",
                                title: "COAPPLICANT_NAME",
                                readonly: true,
                                condition: "model.loanAccount.coBorrowerUrnNo!=null"
                            },
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
                                        model.repayment.amount = model.repayment.totalPayoffAmountToBePaid
                                    } else if (value == 'Scheduled Demand'){
                                        model.repayment.amount = Utils.ceil(model.repayment.totalDemandDue);
                                    } else {
                                        model.repayment.amount = null;
                                    }
                                }
                            },
                            {
                                key: "repayment.demandAmount",
                                readonly: true,
                                title: "TOTAL_DEMAND_DUE",
                                condition: "model.repayment.transactionName=='Scheduled Demand' || model.repayment.transactionName == 'Advance Repayment'",
                                type: "amount"
                            },
                            {
                                key: "repayment.totalNormalInterestDue",
                                readonly: true,
                                condition: "model.repayment.transactionName=='Pre-closure'",
                                title: "NORMAL_INTEREST",
                                type: "amount"
                            },
                            {
                                key: "repayment.recoverableInterest",
                                readonly: true,
                                condition: "model.repayment.transactionName=='Pre-closure'",
                                title: "RECOVERABLE_INTEREST",
                                type: "amount"
                            },
                            {
                                key: "repayment.principalNotDue",
                                readonly: true,
                                condition: "model.repayment.transactionName=='Pre-closure'",
                                title: "PRINCIPAL",
                                type: "amount"
                            },
                            {
                                key: "repayment.bookedNotDueNormalInterest",
                                readonly: true,
                                condition: "model.repayment.transactionName=='Pre-closure'",
                                title: "BOOKED_NOT_DUE_NORMAL_INTEREST",
                                type: "amount"
                            },
                            {
                                key: "repayment.bookedNotDuePenalInterest",
                                readonly: true,
                                condition: "model.repayment.transactionName=='Pre-closure'",
                                title: "BOOKED_NOT_DUE_PENAL_INTEREST",
                                type: "amount"
                            },
                            {
                                key: "repayment.totalDemandDue",
                                readonly: true,
                                condition: "model.repayment.transactionName=='Pre-closure'",
                                title: "TOTAL_DEMAND_DUE",
                                type: "amount"
                            },
                            {
                                key: "repayment.totalFeeDue",
                                readonly: true,
                                condition: "model.repayment.transactionName=='Pre-closure'",
                                title: "TOTAL_FEE_DUE",
                                type: "amount"
                            },
                            {
                                key: "repayment.preclosureFee",
                                readonly: true,
                                condition: "model.repayment.transactionName=='Pre-closure'",
                                title: "PRECLOSURE_FEE",
                                type: "amount"
                            },
                            {
                                key: "repayment.payOffAmount",
                                readonly: true,
                                condition: "model.repayment.transactionName=='Pre-closure'",
                                title: "PAYOFF_AMOUNT",
                                type: "amount"
                            },
                            {
                                key: "repayment.totalFeeDue",
                                readonly: true,
                                condition: "model.repayment.transactionName=='Fee Payment'",
                                title: "TOTAL_FEE_AMOUNT",
                                type: "amount"
                            },
                            {
                                key: "repayment.amount",
                                type: "amount"
                            },
                            "repayment.repaymentDate",
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
                                key:"repayment.chequeDate",
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
                                type:"number",
                                required: true,
                                condition:"model.repayment.instrument=='NEFT'"
                            },
                            {
                                key: "repayment.bankAccountNumber",
                                type: "lov",
                                autolov: true,
                                condition:"model.repayment.instrument=='NEFT'",
                                title:"REPAYMENT_TO_ACCOUNT",
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
                                key:"repayment.NEFTDate",
                                title:"DATE",
                                type:"date",
                                condition:"model.repayment.instrument=='NEFT'"
                            },
                            {
                                key:"repayment.reference",
                                title:"REFERENCE_NUMBER",
                                type:"text",
                                condition:"model.repayment.instrument=='RTGS'"
                            },
                            {
                                key: "repayment.bankAccountNumber",
                                type: "lov",
                                autolov: true,
                                condition:"model.repayment.instrument=='RTGS'",
                                title:"DISBURSEMENT_FROM_ACCOUNT",
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
                                key:"repayment.RTGSDate",
                                title:"DATE",
                                type:"text",
                                condition:"model.repayment.instrument=='RTGS'"
                            },
                           /* {
                                key:"repayment.RTGSBankDetails",
                                title:"BANK_DETAILS",
                                type:"text",
                                condition:"model.repayment.instrument=='RTGS'"
                            },
                            {
                                key:"repayment.RTGSBranchDetails",
                                title:"BRANCH_DETAILS",
                                type:"text",
                                condition:"model.repayment.instrument=='RTGS'"
                            }*/
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
                        if (model._screen && model._screen =='BounceQueue'){
                            if (model.repayment.amount > model.repayment.demandAmount){
                                PageHelper.showProgress("loan-repay","Amount paid cannot be more than the Total demand due",5000);
                                return;
                            }
                        }
                        $log.info("Inside submit");
                        if(window.confirm("Are you Sure?")){
                            PageHelper.showLoader();
                            var postData = _.cloneDeep(model.repayment);
                            postData.amount = parseInt(Number(postData.amount))+"";
                            postData.instrument = model.repayment.instrument;
                            LoanAccount.repay(postData,function(resp,header){
                                $log.info(resp);
                                try{
                                    alert(resp.response);
                                    PageHelper.navigateGoBack();
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
        }]);
