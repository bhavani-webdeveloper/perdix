irf.pageCollection.factory(irf.page("customer360.loans.LoanDetails"), ["$log", "SessionStore", "LoanAccount", "$state", "$stateParams", "SchemaResource", "PageHelper", "Enrollment", "formHelper", "IndividualLoan", "Utils", "$filter", "$q", "irfProgressMessage", "Queries", "Files", "LoanBookingCommons", "irfSimpleModal",
    function($log, SessionStore, LoanAccount, $state, $stateParams, SchemaResource, PageHelper, Enrollment, formHelper, IndividualLoan, Utils, $filter, $q, irfProgressMessage, Queries, Files, LoanBookingCommons, irfSimpleModal) {

        var transactionDetailHtml = "\
        <irf-simple-summary-table irf-table-def='model.orgTransactionDetails' />\
        "

        return {
            "type": "schema-form",
            "title": "Loan Details",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                var loanAccountId = $stateParams.pageId;
                model.loanAccount = model.loanAccount || [];
                model.loanDocuments = model.loanDocuments || {};
                model.loanDocuments.existingDocuments = model.loanDocuments.existingDocuments || [];
                model.loanDocuments = model.loanDocuments || {};
                model.loanDocuments.newLoanDocuments = model.loanDocuments.newLoanDocuments || [];
                model.reqData = model.reqData || {};
                model.reqData.loanAccount = model.reqData.loanAccount || {};
                model.reqData.loanAccount.loanDocuments = model.reqData.loanAccount.loanDocuments || [];
                PageHelper.showLoader();
                IndividualLoan.get({
                        id: loanAccountId
                    })
                    .$promise
                    .then(function(res) {
                        model.loanAccount = res;

                        if (_.hasIn(model.loanAccount, 'accountNumber') && !_.isNull(model.loanAccount.accountNumber)) {
                            LoanAccount.get({
                                    accountId: model.loanAccount.accountNumber
                                })
                                .$promise
                                .then(
                                    function(res) {

                                        model.cbsLoan = res;

                                        /* DATE FIXES */
                                        if(model.cbsLoan.accountOpenDate)
                                        model.cbsLoan.accountOpenDate = Utils.dateToLocalTZ(model.cbsLoan.accountOpenDate).format("D-MMM-YYYY");
                                        if(model.cbsLoan.maturityDate)
                                        model.cbsLoan.maturityDate = Utils.dateToLocalTZ(model.cbsLoan.maturityDate).format("D-MMM-YYYY");
                                        if(model.cbsLoan.firstDisbursementDate)
                                        model.cbsLoan.firstDisbursementDate = Utils.dateToLocalTZ(model.cbsLoan.firstDisbursementDate).format("D-MMM-YYYY");
                                        if(model.cbsLoan.lastDisbursementDate)
                                        model.cbsLoan.lastDisbursementDate = Utils.dateToLocalTZ(model.cbsLoan.lastDisbursementDate).format("D-MMM-YYYY");
                                        if(model.cbsLoan.lastDemandRunDate)
                                        model.cbsLoan.lastDemandRunDate = Utils.dateToLocalTZ(model.cbsLoan.lastDemandRunDate).format("D-MMM-YYYY");
                                        if(model.cbsLoan.nextDemandRunDate)
                                        model.cbsLoan.nextDemandRunDate = Utils.dateToLocalTZ(model.cbsLoan.nextDemandRunDate).format("D-MMM-YYYY");
                                        if(model.cbsLoan.nextDemandScheduledDate)
                                        model.cbsLoan.nextDemandScheduledDate = Utils.dateToLocalTZ(model.cbsLoan.nextDemandScheduledDate).format("D-MMM-YYYY");
                                        if(model.cbsLoan.lastBookingDate)
                                        model.cbsLoan.lastBookingDate = Utils.dateToLocalTZ(model.cbsLoan.lastBookingDate).format("D-MMM-YYYY");
                                        if(model.cbsLoan.firstRepaymentDate)
                                        model.cbsLoan.firstRepaymentDate = Utils.dateToLocalTZ(model.cbsLoan.firstRepaymentDate).format("D-MMM-YYYY");
                                        if(model.cbsLoan.lastRepaymentDate)
                                        model.cbsLoan.lastRepaymentDate = Utils.dateToLocalTZ(model.cbsLoan.lastRepaymentDate).format("D-MMM-YYYY");
                                        if(model.cbsLoan.closedOnValueDate)
                                        model.cbsLoan.closedOnValueDate = Utils.dateToLocalTZ(model.cbsLoan.closedOnValueDate).format("D-MMM-YYYY");
                                        if(model.cbsLoan.nextProvisioningDate)
                                        model.cbsLoan.nextProvisioningDate = Utils.dateToLocalTZ(model.cbsLoan.nextProvisioningDate).format("D-MMM-YYYY");
                                        if(model.cbsLoan.lastProvisioningDate)
                                        model.cbsLoan.lastProvisioningDate = Utils.dateToLocalTZ(model.cbsLoan.lastProvisioningDate).format("D-MMM-YYYY");

                                        

                                        model.cbsLoan.tenureStr = model.cbsLoan.tenureMagnitude + " " + model.cbsLoan.tenureUnit;
                                        var localUtcOffset = moment().utcOffset();

                                        for (var i = 0; i < model.cbsLoan.transactions.length; i++) {
                                            var t = model.cbsLoan.transactions[i];
                                            t.transactionDate = Utils.dateToLocalTZ(t.transactionDate).format("D-MMM-YYYY");
                                            t.valueDate = Utils.dateToLocalTZ(t.valueDate).format("D-MMM-YYYY");
                                            t.systemDateAndTime = Utils.dateToLocalTZ(t.systemDateAndTime).format("D-MMM-YYYY HH:mm:SS");
                                            t.transactionIdName = t.transactionId + " / " + t.transactionName;
                                            t.valueDateTransDate = t.valueDate + " / " + t.transactionDate;
                                            t.principalInterestPenal = t.part2 + " / " + t.part1 + " / " + t.part3;

                                        }
                                        for (var i = 0; i < model.cbsLoan.repaymentSchedule.length; i++) {
                                            model.cbsLoan.repaymentSchedule[i].valueDate = moment.utc(model.cbsLoan.repaymentSchedule[i].valueDate).utcOffset(localUtcOffset).format("D-MMM-YYYY");
                                        }
                                        model.cbsLoan.repaymentScheduleTblFormat = {columns:[], data :[]};
                                        if(model.cbsLoan.repaymentSchedule.length > 0){
                                            var keys = Object.keys(model.cbsLoan.repaymentSchedule[0]);
                                            var title, format;
                                            for(var itr = 0; itr < keys.length; itr++){
                                                format, title = '';
                                                switch(keys[itr]){
                                                    case 'valueDate' : 
                                                        title = "DEMAND_DATE";
                                                        break;
                                                    case 'description':
                                                        title = "TYPE";
                                                        model.cbsLoan.repaymentScheduleTblFormat.columns.splice(1, 0, {"title": title, "data": keys[itr]});
                                                        continue;
                                                    case 'amount1':
                                                        title = "AMOUNT";
                                                        format = "currency";
                                                        break;
                                                    case 'amount3':
                                                        title = "DUE";
                                                        format = "currency";
                                                        break;
                                                    case 'part1':
                                                        title = "NORMAL_INTEREST";
                                                        format = "currency";
                                                        break;
                                                    case 'part2':
                                                        title = "PRINCIPAL";
                                                        format = "currency";
                                                        break;
                                                    case 'amount2':
                                                        title = "BALANCE";
                                                        format = "currency";
                                                        break;
                                                    default:
                                                        continue;
                                                }
                                                model.cbsLoan.repaymentScheduleTblFormat.columns.push({"title": title, "data": keys[itr], format: format});
                                            }
                                            model.cbsLoan.repaymentScheduleTblFormat.data = model.cbsLoan.repaymentSchedule;
                                            model.cbsLoan.orgRepaymentScheduleTblFormat = {columns: model.cbsLoan.repaymentScheduleTblFormat.columns};
                                            model.cbsLoan.orgRepaymentScheduleTblFormat.data = $filter('filter')(model.cbsLoan.repaymentSchedule, {status: 'true'});
                                        }

                                        model.cbsLoan.orgTransactions = {};
                                        model.cbsLoan.invoiceTransactions = {};

                                        if (model.cbsLoan.transactions.length > 0) {
                                            model.cbsLoan.invoiceTransactions.columns = [
                                                {
                                                    "title": "Invoice #",
                                                    "data": "entityId"
                                                },
                                                {
                                                    "title": "Date",
                                                    "data": "valueDateStr"
                                                },
                                                {
                                                    "title": "Amount",
                                                    "data": "amount1"
                                                },
                                                {
                                                    "title": "Type",
                                                    "data": "transactionName"
                                                },
                                                {
                                                    "title": "Download Invoice",
                                                    "data": "downloadText",
                                                    "onClick": function(data){
                                                        var recordStr = data.accountId + "~" + data.sequenceNum;
                                                        if (data.transactionName == 'Demand'){
                                                            if (data.status =="false"){
                                                                // Penal Interest
                                                            } else if (data.status == "true"){
                                                                return Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=bill_of_supply_emi_payment&record_id=" + recordStr);
                                                            }
                                                        } else if (data.transactionName == 'Fee Charge'){
                                                            var formName;
                                                            if (data.param1 == 'Preclosure Charges') {
                                                                formName = 'taxable_invoice_cheque_preclosure_charges';
                                                            } else if (data.param1 = 'CBC') {
                                                                formName = 'taxable_invoice_cheque_bounce_charges';
                                                            } else if (data.param1 = 'AdHoc Fee') {
                                                                formName = 'taxable_invoice_adhoc_charges';
                                                            }
                                                            return Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=" + formName + "&record_id=" + recordStr);
                                                        }
                                                        return Utils.alert("Form not maintained");
                                                    }
                                                }
                                            ];
                                            model.cbsLoan.orgTransactions.columns =  [
                                                {
                                                    "title": "Transaction ID", 
                                                    "data": "transactionId",
                                                    "onClick": function(data){
                                                        PageHelper.showLoader();
                                                        LoanAccount.transactionDetails({'transaction_id':data.transactionId})
                                                        .$promise
                                                        .then(function(data){
                                                            var modalInstance = irfSimpleModal('Details', transactionDetailHtml, {orgTransactionDetails: data}, {size:"lg"});
                                                        })
                                                        .finally(function(){
                                                            PageHelper.hideLoader();
                                                        })
                                                    }
                                                },
                                                {
                                                    "title": "Description",
                                                    "data": "transactionName"
                                                },
                                                {
                                                    "title": "Amount",
                                                    "data": "amount1"
                                                },
                                                {
                                                    "title": "Balance",
                                                    "data": "amount2"
                                                },
                                                {
                                                    "title": "Principal",
                                                    "data": "part1"
                                                },
                                                {
                                                    "title": "Interest",
                                                    "data": "part2"
                                                },
                                                {
                                                    "title": "Penal",
                                                    "data": "part3"
                                                },
                                                {
                                                    "title": "Value Date",
                                                    "data": "valueDateStr"
                                                },
                                                {
                                                    "title": "Transaction Date",
                                                    "data": "transactionDateStr"
                                                }
                                            ];
                                            model.cbsLoan.orgTransactions.data = $filter('filter')(model.cbsLoan.transactions, {transactionName: '!Demand'});
                                            model.cbsLoan.invoiceTransactions.data = $filter('filter')(model.cbsLoan.transactions, function(value, index, array){
                                                return value.transactionName =='Demand' || value.transactionName == 'Fee Charge';
                                            });
                                            _.forEach(model.cbsLoan.invoiceTransactions.data, function(txn){
                                                txn.downloadText = 'Download';
                                            });
                                        }
                                        var loanDocuments = model.loanAccount.loanDocuments;
                                        var availableDocCodes = [];
                                        LoanBookingCommons.getDocsForProduct(model.cbsLoan.productCode, "LoanBooking", "DocumentUpload").then(function(docsForProduct) {
                                                $log.info(docsForProduct);
                                                for (var i = 0; i < loanDocuments.length; i++) {
                                                    availableDocCodes.push(loanDocuments[i].document);
                                                    var documentObj = LoanBookingCommons.getDocumentDetails(docsForProduct, loanDocuments[i].document);
                                                    if (documentObj != null) {
                                                        loanDocuments[i].document = documentObj.document_name;
                                                    } else if(_.isNull(loanDocuments[i].document) || _.isUndefined(loanDocuments[i].document)) {
                                                        loanDocuments[i].document = "DOCUMENT_TITLE_NOT_MAINTAINED";
                                                    }
                                                }
                                                PageHelper.hideLoader();
                                            },
                                            function(httpRes) {
                                                PageHelper.hideLoader();
                                            });
                                    },
                                    function(httpRes) {
                                        PageHelper.showErrors(httpRes);
                                    }

                                )
                                .finally(function() {
                                    PageHelper.hideLoader();
                                })
                        }

                        if (model.loanAccount.loanDocuments) {
                            for (var i = 0; i < model.loanAccount.loanDocuments.length; i++) {

                                model.loanDocuments.existingDocuments.push(model.loanAccount.loanDocuments[i]);
                            }
                        }
                    })

            },
            form: [
            {
                "type": "box",
                "title": "LOAN_BASIC_INFORMATION",
                "condition" : "",
                "readonly": true,
                "items": [
                    {
                        "key": "cbsLoan.accountId",
                        "title": "ACCOUNT_NUMBER",
                        "required":false,
                        "type": "string"
                    },
                    {
                        "key": "cbsLoan.accountName",
                        "required":false,
                        "title": "PRODUCT",
                        "type": "string"
                    },
                    {
                        "key": "cbsLoan.accountBalance",
                        "title": "ACCOUNT_BALANCE",
                        "required":false,
                        "type": "amount"
                    },
                    {
                        "key": "cbsLoan.operationalStatus",
                        "title": "OPERATIONAL_STATUS",
                        "required":false,
                        "type": "string"
                    },
                    {
                        "key": "cbsLoan.accountOpenDate",
                        "title": "ACCOUNT_OPEN_DATE",
                        "required":false,
                        "type": "string"
                    },
                    {
                        "key": "cbsLoan.maturityDate",
                        "title": "MATURITY_DATE",
                        "required":false,
                        "type": "string"
                    },
                    {
                        "key": "cbsLoan.normalInterestRate",
                        "title": "NORMAL_INTEREST_RATE",
                        "required":false,
                        "type": "string"
                    },
                    {
                        "key": "cbsLoan.penalInterestRate",
                        "title": "PENAL_INTEREST_RATE",
                        "required":false,
                        "type": "string"
                    },
                    {
                        "key": "cbsLoan.postMaturityNormalInterestRate",
                        "title": "POST_MATURITY_NORMAL_INTEREST_RATE",
                        "required":false,
                        "type": "string"
                    },
                    {
                        "key": "cbsLoan.tenureStr",
                        "required":false,
                        "title": "TENURE",
                        "type": "string"
                    },
                    {
                        "key": "cbsLoan.equatedInstallment",
                        "required":false,
                        "title": "EMI",
                        "type": "amount"
                    }

                ]
            },
            {
                "type": "box",
                "title": "LOAN_OVERVIEW",
                "condition" : "",
                "readonly": true,
                "items": [
                    {
                        "key": "cbsLoan.firstDisbursementDate",
                        "title": "FIRST_DISBURSEMENT_DAT",
                        "required":false,
                        "type": ["string","null"]
                    },
                    {
                        "key": "cbsLoan.lastDisbursementDate",
                        "title": "LAST_DISBURSEMENT_DATE",
                        "required":false,
                        "type": ["string","null"]
                    },
                    {
                        "key": "cbsLoan.firstRepaymentDate",
                        "title": "FIRST_REPAYMENT_DATE",
                        "required":false,
                        "type": ["string","null"]
                    },
                    {
                        "key": "cbsLoan.lastRepaymentDate",
                        "title": "LAST_REPAYMENT_DATE",
                        "required":false,
                        "type": ["string","null"]
                    },
                    {
                        "key": "cbsLoan.lastDemandRunDate",
                        "title": "LAST_DEMAND_RUN_DATE",
                        "required":false,
                        "type": ["string","null"]
                    },
                    {
                        "key": "cbsLoan.nextDemandRunDate",
                        "title": "NEXT_DEMAND_RUN_DATE",
                        "required":false,
                        "type": ["string","null"]
                    },
                    {
                        "key": "cbsLoan.nextDemandScheduledDate",
                        "title": "NEXT_DEMAND_RUN_DATE",
                        "required":false,
                        "type": ["string","null"]
                    },
                    {
                        "key": "cbsLoan.daysPastDue",
                        "title": "DAYS_PAST_DUE",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.npa",
                        "title": "NPA",
                        "required":false,
                        "type": ["string","null"]
                    },
                    {
                        "key": "cbsLoan.numDisbursements",
                        "title": "NUMBER_OF_DISBURSEMENTS",
                        "required":false,
                        "type": "number"
                    }
                ]
            },
            {
                "type": "box",
                "title": "LOAN_OVERVIEW",
                "condition" : "",
                "readonly": true,
                "items": [
                    {
                        "key": "cbsLoan.totalDisbursed",
                        "title": "TOTAL_DISBURSED",
                        "required":false,
                        "type": "string"
                    },
                    {
                        "key": "cbsLoan.disbursableAmount",
                        "title": "TOTAL_DISBURSABLE",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.numRepayments",
                        "title": "NUMBER_OF_REPAYMENTS",
                        "required":false,
                        "type": "string"
                    },
                    {
                        "key": "cbsLoan.totalPrincipalRaised",
                        "title": "TOTAL_PRINCIPAL_RAISED",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.totalPrincipalRepaid",
                        "title": "TOTAL_PRINCIPAL_REPAID",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.totalPrincipalDue",
                        "title": "TOTAL_PRINCIPAL_DUE",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.totalNormalInterestRaised",
                        "title": "TOTAL_INTEREST_RAISED",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.totalNormalInterestRepaid",
                        "title": "TOTAL_INTEREST_REPAID",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.totalNormalInterestDue",
                        "title": "TOTAL_INTEREST_DUE",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.totalPenalInterestRaised",
                        "title": "TOTAL_INTEREST_RAISED",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.totalPenalInterestRepaid",
                        "title": "TOTAL_INTEREST_REPAID",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.totalPenalInterestDue",
                        "title": "TOTAL_INTEREST_DUE",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.totalFeeRepaid",
                        "title": "TOTAL_FEE_REPAID",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.totalFeeDue",
                        "title": "TOTAL_FEE_DUE",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.totalDemandRaised",
                        "title": "TOTAL_INTEREST_RAISED",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.totalRepaid",
                        "title": "TOTAL_INTEREST_REPAID",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.totalDemandDue",
                        "title": "TOTAL_INTEREST_DUE",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.bookedNormalInterest",
                        "title": "NORMAL_INTEREST_BOOKED",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.bookedNotDueNormalInterest",
                        "title": "NORMAL_INTEREST_BOOKED_NOT_DUE",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.principalNotDue",
                        "title": "PRINCIPAL_NOT_DUE",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.preclosureFee",
                        "title": "PRECLOSURE_FEE",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.payOffAmount",
                        "title": "PAYOFF_AMOUNT",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.payOffAndDueAmount",
                        "title": "PAYOFF_AMOUNT_WITH_DUE",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.demandAdjustment",
                        "title": "DEMAND_ADJUSTMENT",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.securityDeposit",
                        "title": "TOTAL_SECURITY_DEPOSIT",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.nextProvisioningDate",
                        "title": "NEXT_PROVISIONING_DATE",
                        "required":false,
                        "type": "number"
                    },
                    {
                        "key": "cbsLoan.lastProvisioningDate",
                        "title": "LAST_PROVISIONING_DATE",
                        "required":false,
                        "type": "number"
                    }
                ]
            },
            {
                    "type": "box",
                    "title": "LOAN_DETAILS",
                    "colClass": "col-sm-6",
                    "readonly": true,
                    "items": [{
                        "type": "fieldset",
                        "title": "BRANCH_DETAILS",
                        "items": [{
                            key: "loanAccount.loanCentre.centreId",
                            title: "CENTRE_NAME",
                            "type": "select",
                            "required":false,
                            enumCode: "centre"
                        }, {
                            "key": "loanAccount.partnerCode",
                            "title": "PARTNER",
                            "required":false,
                            "type": "select"
                        }]
                    }, {
                        "type": "fieldset",
                        "title": "PRODUCT_DETAILS",
                        "items": [{
                            "key": "loanAccount.id",
                            "title": "LOAN_ID",
                            "condition": "model.loanAccount.id",
                            "required":false,
                            "readonly": true
                        }, {
                            "key": "loanAccount.productCode",
                            "title": "PRODUCT",
                            "required":false,
                            "type": "select"
                        }, {
                            "key": "loanAccount.tenure",
                            "required":false,
                            "title": "DURATION_IN_MONTHS"
                        }, {
                            "key": "loanAccount.frequency",
                            "required":false,
                            "type": "select"
                        },{
                            "key":"loanAccount.expectedInterestRate",
                            title:"Expected Interest Rate",
                            "required":false,
                            "type":"number",
                            "condition": "!model.loanAccount.loanType == 'JLG'"
                        }]
                    }, {
                        "type": "fieldset",
                        "title": "ENTITY_DETAILS",
                        "items": [{
                            "key": "loanAccount.urnNo",
                            "title": "URN_NO",
                            "required":false,
                            "type": "lov",
                            "lovonly": true,
                            "inputMap": {
                                "customerType": {
                                    "key": "customer.customerType",
                                    "title": "CUSTOMER_TYPE",
                                    "type": "select",
                                    "titleMap": {
                                        "Individual": "Individual",
                                        "Enterprise": "Enterprise"
                                    }
                                },
                                "customerId": {
                                    "key": "customer.customerId",
                                    "title": "CUSTOMER_ID"
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
                                "id": "loanAccount.customerId",
                                "urnNo": "loanAccount.urnNo",
                                "firstName": "customer.firstName",

                            },
                            "searchHelper": formHelper,
                            initialize: function(inputModel) {
                                $log.warn('in pincode initialize');
                                $log.info(inputModel);
                            },
                            "search": function(inputModel, form, model) {
                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var promise = Enrollment.search({
                                    'customerId': inputModel.customerId,
                                    'branchName': inputModel.branch || SessionStore.getBranch(),
                                    'firstName': inputModel.firstName,
                                    'centreId': inputModel.centreId,
                                    'customerType': inputModel.customerType,
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
                                ).then(function(response) {
                                    if (response && response.body && response.body.length) {
                                        for (var i = response.body.length - 1; i >= 0; i--) {
                                            if (response.body[i].is_disbersement_account == 1) {
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
                        }, {
                            "key": "loanAccount.customerId",
                            "required":false,
                            "title": "ENTITY_ID",
                            "readonly": true
                        }, {
                            "key": "customer.firstName",
                            "required":false,
                            "title": "ENTITY_NAME",
                            "readonly": true,
                            "condition": "!model.loanAccount.loanType == 'JLG'"
                        }, {
                            "key": "loanAccount.applicant",
                            "required":false,
                            "title": "APPLICANT_URN_NO",
                            "condition": "!model.loanAccount.loanType == 'JLG'",
                            "type": "lov",
                            "lovonly": true,
                            "inputMap": {
                                "customerId": {
                                    "key": "customer.customerId",
                                    "title": "CUSTOMER_ID"
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
                                "firstName": "customer.applicantName"
                            },
                            "searchHelper": formHelper,
                            "search": function(inputModel, form) {
                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var promise = Enrollment.search({
                                    'customerId': inputModel.customerId,
                                    'branchName': inputModel.branch || SessionStore.getBranch(),
                                    'firstName': inputModel.firstName,
                                    'centreId': inputModel.centreId,
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
                        }, {
                            "key": "customer.applicantName",
                            "title": "APPLICANT_NAME",
                            "required":false,
                            "readonly": true,
                            "condition": "!model.loanAccount.loanType == 'JLG'"
                        }, {
                            "key": "loanAccount.coBorrowerUrnNo",
                            "required":false,
                            "title": "CO_APPLICANT_URN_NO",
                            "condition": "!model.loanAccount.loanType == 'JLG'",
                            "type": "lov",
                            "lovonly": true,
                            "inputMap": {
                                "customerId": {
                                    "key": "customer.customerId",
                                    "title": "CUSTOMER_ID"
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
                                "urnNo": "loanAccount.coBorrowerUrnNo",
                                "firstName": "customer.coBorrowerName"
                            },
                            "searchHelper": formHelper,
                            "search": function(inputModel, form) {
                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var promise = Enrollment.search({
                                    'customerId': inputModel.customerId,
                                    'branchName': inputModel.branch || SessionStore.getBranch(),
                                    'firstName': inputModel.firstName,
                                    'centreId': inputModel.centreId,
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
                        }, {
                            "key": "customer.coBorrowerName",
                            "required":false,
                            "title": "COAPPLICANT_NAME",
                            "readonly": true,
                            "condition": "!model.loanAccount.loanType == 'JLG'"
                        }]
                    }, {
                        "type": "fieldset",
                        "title": "Account Details",
                        "items": [{
                                "key": "loanAccount.loanAmount",
                                "type": "amount",
                                "required":false,
                                "title": "LOAN_AMOUNT_REQUESTED",
                                "onChange": function(value, form, model) {
                                    model.loanAccount.insuranceFee = 0.004 * value;
                                    getSanctionedAmount(model);
                                }
                            }, {
                                key: "loanAccount.insuranceFee",
                                "required":false,
                                type: "amount",
                                onChange: function(value, form, model) {
                                    getSanctionedAmount(model);
                                }
                            }, {
                                key: "loanAccount.commercialCibilCharge",
                                "required":false,
                                type: "amount",
                                onChange: function(value, form, model) {
                                    getSanctionedAmount(model);
                                }
                            }, {
                                key: "loanAccount.securityEmi",
                                "required":false,
                                type: "amount",
                                onChange: function(value, form, model) {
                                    getSanctionedAmount(model);
                                }
                            }, {
                                key: "loanAccount.processingFeeInPaisa",
                                "required":false,
                                type: "amount"
                            }, {
                                key: "loanAccount.otherFee",
                                "required":false,
                                type: "amount"
                            }, {
                                "key": "additional.loanAmount",
                                "required":false,
                                "type": "amount",
                                "title": "NET_DISBURSEMENT_AMOUNT"
                            }, {
                                "key": "loanAccount.interestRate",
                                "required":false,
                                "type": "number"
                            }, {
                                "key": "loanAccount.loanApplicationDate",
                                "required":false,
                                "title": "LOAN_APPLICATION_DATE",
                                "type": "date"
                            }, {
                                "key": "loanAccount.loanPurpose1",
                                "required":false,
                                "title": "LOAN_PURPOSE",
                                "type": "select"
                            }
                            /*,
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
                    }]
                }, 
                {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "title": "TRANSACTIONS",
                    "htmlClass": "text-danger",
                    "items": [
                        {
                            "type": "fieldset",
                            "items": [
                                {
                                    "type": "section",
                                    "htmlClass": "row",
                                    "items":[
                                        {
                                            "type": "section",
                                            "htmlClass": "col-sm-2",
                                            "html": "{{ 'TRANSACTION_ID_SLASH_NAME' | translate }}"
                                        },
                                        {
                                            "type": "section",
                                            "htmlClass": "col-sm-2",
                                            "items": [
                                                {
                                                    "title": "AMOUNT",
                                                    "readonly": true
                                                }
                                            ]
                                        },
                                        {
                                            "type": "section",
                                            "htmlClass": "col-sm-2",
                                            "items": [
                                                {
                                                    "title": "BALANCE",
                                                    "readonly": true
                                                }
                                            ]
                                        },
                                        {
                                            "type": "section",
                                            "htmlClass": "col-sm-2",
                                            "html": "{{ 'VALUE_DATE_SLASH_TRANSACTION_DATE' | translate }}"
                                        },
                                        {
                                            "type": "section",
                                            "htmlClass": "col-sm-2",
                                            "html": "{{ 'PRINCIPAL_SL_INTEREST_PENAL' | translate }}"
                                        },
                                        {
                                            "type": "section",
                                            "htmlClass": "col-sm-2",
                                            "items": [
                                                {
                                                    "title": "SYSTEM_DATE_TIME",
                                                    "readonly": true
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "type": "array",
                                    "notitle": true,
                                    "view": "fixed",
                                    "key": "cbsLoan.transactions",
                                    "add": null,
                                    "remove": null,
                                    "items": [
                                        {
                                            "type": "section",
                                            "htmlClass": "row",
                                            "items": [
                                                {
                                                    "type": "section",
                                                    "htmlClass": "col-sm-2",
                                                    "items": [
                                                        {
                                                            "html": "{{ model.cbsLoan.transactions[arrayIndex].transactionId }} / <strong>{{ model.cbsLoan.transactions[arrayIndex].transactionName }}</strong>",
                                                            "type": "section"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "col-sm-2",
                                                    "items": [
                                                        {
                                                            "key": "cbsLoan.transactions[].amount1",
                                                            "type": "string",
                                                            "notitle": true,
                                                            "title": " ",
                                                            "readonly": true
                                                        }
                                                    ]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "col-sm-2",
                                                    "items": [
                                                        {
                                                            "key": "cbsLoan.transactions[].amount2",
                                                            "type": "string",
                                                            "notitle": true,
                                                            "title": " ",
                                                            "readonly": true
                                                        }
                                                    ]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "col-sm-2",
                                                    "items": [
                                                        {
                                                            "html": "<strong>{{ model.cbsLoan.transactions[arrayIndex].valueDate }}</strong> / {{ model.cbsLoan.transactions[arrayIndex].transactionDate }}",
                                                            "type": "section"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "col-sm-2",
                                                    "items": [
                                                        {

                                                            "html": "<strong> <span class='text-navy'> {{ model.cbsLoan.transactions[arrayIndex].part2}} </span> / <span class='text-primary'>{{ model.cbsLoan.transactions[arrayIndex].part1 }}</span> /  <span class='text-red'>{{ model.cbsLoan.transactions[arrayIndex].part3 }}</span></strong>",
                                                            "type": "section"
                                                        }
                                                    ]
                                                },
                                                {
                                                    "type": "section",
                                                    "htmlClass": "col-sm-2",
                                                    "items": [
                                                        {
                                                            "key": "cbsLoan.transactions[].systemDateAndTime",
                                                            "type": "string",
                                                            "notitle": true,
                                                            "title": " ",
                                                            "readonly": true
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "title": "REPAYMENT_SCHEDULE",
                    "htmlClass": "text-danger",
                    "items": [{
                            "type": "fieldset",
                            "title": "ORIGINAL_REPAYMENT_SCHEDULE",
                            "items": [{
                                type: "section",
                                colClass: "col-sm-12",
                                html: "<irf-simple-summary-table irf-table-def='model.cbsLoan.orgRepaymentScheduleTblFormat'></irf-simple-summary-table>"
                            }
                            ]
                        },
                        ] // END of box items
                },
                {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "title": "TRANSACTION_ACCOUNTING_DETAILS",
                    "htmlClass": "text-danger",
                    "items": [
                        {
                            type: "section",
                            colClass: "col-sm-12",
                            html: "<irf-simple-summary-table irf-table-def='model.cbsLoan.orgTransactions'></irf-simple-summary-table>"
                        }
                    ] // END of box items
                },
                {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "title": "INVOICE",
                    "htmlClass": "text-danger",
                    "items": [
                        {
                            type: "section",
                            colClass: "col-sm-12",
                            html: "<irf-simple-summary-table irf-table-def='model.cbsLoan.invoiceTransactions'></irf-simple-summary-table>"
                        }
                    ] // END of box items
                },

                // {
                //     "type": "box",
                //     "title": "REPAYMENT_SCHEDULE",
                //     "readonly": true,
                //     "items": [{
                //         "type": "array",
                //         "titleExpr": "'Date : ' + model.cbsLoan.repaymentSchedule[arrayIndex].valueDate",
                //         "key": "cbsLoan.repaymentSchedule",
                //         "items": [{
                //             "key": "cbsLoan.repaymentSchedule[].transactionDate",
                //             "type": "date"
                //         }, {
                //             "key": "cbsLoan.repaymentSchedule[].amount1",
                //             "type": "string"
                //         }, {
                //             "key": "cbsLoan.repaymentSchedule[].amount2",
                //             "type": "string"
                //         }, {
                //             "key": "cbsLoan.repaymentSchedule[].valueDate",
                //             "type": "date"
                //         }, {
                //             "key": "cbsLoan.repaymentSchedule[].transactionId",
                //             "type": "string"
                //         }, {
                //             "key": "cbsLoan.repaymentSchedule[].status",
                //             "type": "string"
                //         }]
                //     }]
                // }, 
                {
                    "type": "box",
                    "title": "DISBURSEMENT_DETAILS",
                    readonly: true,
                    "items": [{
                        "type": "fieldset",
                        "title": "Disbursement Details",
                        "items": [{
                            key: "loanAccount.sanctionDate",
                            type: "date",
                            "required":false,
                            title: "SANCTION_DATE"
                        }, {
                            key: "loanAccount.numberOfDisbursements",
                            "required":false,
                            title: "NUM_OF_DISBURSEMENTS",
                            onChange: function(value, form, model) {
                                $log.info(value);
                                $log.info(model);

                                model.loanAccount.disbursementSchedules = [];
                                for (var i = 0; i < value; i++) {
                                    model.loanAccount.disbursementSchedules.push({
                                        trancheNumber: "" + (i + 1),
                                        disbursementAmount: 0
                                    });
                                }
                            }
                        }, {
                            key: "loanAccount.customerBankAccountNumber",
                            "required":false,
                            type: "lov",
                            autolov: true,
                            title: "CUSTOMER_BANK_ACC_NO",
                            bindMap: {
                                "customerId": "loanAccount.customerId"
                            },
                            outputMap: {
                                "account_number": "loanAccount.customerBankAccountNumber",
                                "ifsc_code": "loanAccount.customerBankIfscCode",
                                "customer_bank_name": "loanAccount.customerBank",
                                "customer_bank_branch_name": "loanAccount.customerBranch"
                            },
                            searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                return Queries.getCustomerBankAccounts(
                                    inputModel.customerId
                                );
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.account_number + (item.is_disbersement_account == 1 ? '&nbsp;&nbsp;<span class="color-theme"><i class="fa fa-check-square">&nbsp;</i>{{"DEFAULT_DISB_ACCOUNT"|translate}}</span>' : ''),
                                    item.ifsc_code + ', ' + item.customer_bank_name,
                                    item.customer_bank_branch_name
                                ];
                            }
                        }, {
                            key: "loanAccount.customerBankIfscCode",
                            "required":false,
                            title: "CUSTOMER_BANK_IFSC",
                            "readonly": true
                        }, {
                            key: "loanAccount.customerBank",
                            "required":false,
                            title: "CUSTOMER_BANK",
                            "readonly": true
                        }, {
                            key: "loanAccount.customerBranch",
                            "required":false,
                            title: "BRANCH_NAME",
                            "readonly": true
                        }, {
                            key: "loanAccount.disbursementSchedules",
                            "required":false,
                            title: "DISBURSEMENT_SCHEDULES",
                            add: null,
                            remove: null,
                            items: [{
                                key: "loanAccount.disbursementSchedules[].trancheNumber",
                                "required":false,
                                title: "TRANCHE_NUMBER",
                                readonly: true
                            }, {
                                key: "loanAccount.disbursementSchedules[].disbursementAmount",
                                title: "DISBURSEMENT_AMOUNT",
                                "required":false,
                                type: "amount"
                            }]
                        }]
                    }]
                }, {
                    "type": "box",
                    "title": "COLLATERAL",
                    "condition": "model.loanAccount.collateral.length>0",
                    "readonly": true,
                    "items": [{
                        "key": "loanAccount.collateral",
                        "required":false,
                        "title": "COLLATERAL",
                        "condition": "model.loanAccount.collateral.length>0",
                        "type": "array",
                        "items": [{
                            "key": "loanAccount.collateral[].collateralType",
                            "required":false,
                            "type": "select"
                        }, {
                            "key": "loanAccount.collateral[].collateralDescription",
                            "required":false,
                        }, {
                            "key": "loanAccount.collateral[].manufacturer",
                            "required":false,
                        }, {
                            "key": "loanAccount.collateral[].quantity",
                            "required":false,
                            "onChange": function(value, form, model, event) {
                                calculateTotalValue(value, form, model);
                            }
                        }, {
                            "key": "loanAccount.collateral[].modelNo",
                            "required":false,
                        }, {
                            "key": "loanAccount.collateral[].machineOld",
                            "required":false,
                        }, {
                            "key": "loanAccount.collateral[].collateralValue",
                            "required":false,
                            "type": "amount",
                            "title": "COLLATERAL_VALUE",
                            "onChange": function(value, form, model, event) {
                                calculateTotalValue(value, form, model);
                            }
                        }, {
                            "key": "loanAccount.collateral[].totalValue",
                            "required":false,
                            "type": "amount",
                            "title": "TOTAL_VALUE"
                        }, {
                            "key": "loanAccount.collateral[].marginValue",
                            "required":false,
                            "type": "amount",
                            "title": "PURCHASE_PRICE"
                        }, {
                            "key": "loanAccount.collateral[].loanToValue",
                            "required":false,
                            "type": "amount",
                            "title": "PRESENT_VALUE"
                        }, {
                            "key": "loanAccount.collateral[].collateral1FilePath",
                            "required":false,
                            "type": "file",
                            "title": "DOCUMENT_1"
                        }, {
                            "key": "loanAccount.collateral[].collateral2FilePath",
                            "required":false,
                            "type": "file",
                            "title": "DOCUMENT_2"
                        }, {
                            "key": "loanAccount.collateral[].collateral3FilePath",
                            "required":false,
                            "type": "file",
                            "title": "DOCUMENT_3"
                        }, {
                            "key": "loanAccount.collateral[].photoFilePath",
                            "required":false,
                            "type": "file",
                            "fileType": "image/*",
                            "title": "PHOTO"
                        }]
                    }]
                }, {
                    "type": "box",
                    "title": "GUARANTOR_NOMINEE_DETAILS",
                    "condition": "model.loanAccount.guarantors.length>0",
                    readonly: true,
                    "items": [{
                        "type": "fieldset",
                        "title": "GUARANTOR",
                        "items": [{
                            key: "loanAccount.guarantors",
                            "required":false,
                            notitle: "true",
                            view: "fixed",
                            "condition": "model.loanAccount.guarantors.length>0",
                            type: "array",
                            add: null,
                            remove: null,
                            items: [{
                                "key": "loanAccount.guarantors[].guaUrnNo",
                                "title": "URN_NO",
                                "type": "lov",
                                "lovonly": true,
                                "inputMap": {
                                    "customerId": {
                                        "key": "customer.customerId",
                                        "title": "CUSTOMER_ID"
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
                                    "firstName": "loanAccount.guarantors[arrayIndex].guaFirstName"
                                },
                                "searchHelper": formHelper,
                                "search": function(inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = Enrollment.search({
                                        'customerId': inputModel.customerId,
                                        'branchName': inputModel.branch || SessionStore.getBranch(),
                                        'firstName': inputModel.firstName,
                                        'centreId': inputModel.centreId,
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
                            }, {
                                key: "loanAccount.guarantors[].guaFirstName",
                                title: "NAME",
                                "readonly": true
                            }]
                        }]
                    }, {
                        "type": "fieldset",
                        "title": "INSURANCE_POLICY",
                        "items": [{
                            "key": "additional.portfolioUrnSelector",
                            "required":false,
                            "type": "select",
                            "titleMap": {
                                "applicant": "Applicant",
                                "coapplicant": "Co-Applicant",
                                "guarantor": "Guarantor"
                            },
                            onChange: function(value, form, model) {
                                switch (value) {
                                    case "applicant":
                                        if (_.isEmpty(model.loanAccount.applicant)) {
                                            Utils.alert("Please Select an Applicant");
                                            model.additional.portfolioUrnSelector = "";
                                            break;
                                        }
                                        model.loanAccount.portfolioInsuranceUrn = model.loanAccount.applicant;
                                        break;
                                    case "coapplicant":
                                        if (_.isEmpty(model.loanAccount.coBorrowerUrnNo)) {
                                            Utils.alert("Please Select a Co-Applicant");
                                            model.additional.portfolioUrnSelector = "";
                                            break;
                                        }
                                        model.loanAccount.portfolioInsuranceUrn = model.loanAccount.coBorrowerUrnNo;
                                        break;
                                    case "guarantor":
                                        if (_.isEmpty(model.loanAccount.guarantors[0].guaUrnNo)) {
                                            Utils.alert("Please Select a Guarantor");
                                            model.additional.portfolioUrnSelector = "";
                                            break;
                                        }
                                        model.loanAccount.portfolioInsuranceUrn = model.loanAccount.guarantors[0].guaUrnNo;
                                        break;
                                }
                            }
                        }, {
                            key: "loanAccount.portfolioInsuranceUrn",
                            "required":false,
                            "title": "URN_NO"
                        }]
                    }, {
                        "type": "fieldset",
                        "title": "NOMINEE_DETAILS",
                        "items": [{
                            "key": "loanAccount.nominees",
                            "type": "array",
                            notitle: "true",
                            "view": "fixed",
                            "add": null,
                            "remove": null,
                            "items": [{
                                key: "loanAccount.nominees[].nomineeFirstName",
                                "required":false,
                                "title": "NAME"
                            }, {
                                key: "loanAccount.nominees[].nomineeGender",
                                "required":false,
                                type: "select",
                                "title": "GENDER"
                            }, {
                                key: "loanAccount.nominees[].nomineeDOB",
                                "required":false,
                                type: "date",
                                "title": "DATE_OF_BIRTH"
                            }, {
                                key: "loanAccount.nominees[].nomineeDoorNo",
                                "required":false,
                                "title": "DOOR_NO"
                            }, {
                                key: "loanAccount.nominees[].nomineeLocality",
                                "required":false,
                                "title": "LOCALITY"
                            }, {
                                key: "loanAccount.nominees[].nomineeStreet",
                                "required":false,
                                "title": "STREET"
                            }, {
                                key: "loanAccount.nominees[].nomineePincode",
                                "required":false,
                                type: "lov",
                                fieldType: "number",
                                autolov: true,
                                inputMap: {
                                    "pincode": {
                                        key: "loanAccount.nominees[].nomineePincode"
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
                            }, {
                                key: "loanAccount.nominees[].nomineeDistrict",
                                "required":false,
                                type: "text",
                                "title": "DISTRICT"
                            }, {
                                key: "loanAccount.nominees[].nomineeState",
                                "required":false,
                                "title": "STATE"
                            }, {
                                key: "loanAccount.nominees[].nomineeRelationship",
                                "required":false,
                                type: "select",
                                "title": "RELATIONSHIP"
                            }]
                        }]
                    }]
                }, {
                    "type": "box",
                    "title": "LOAN_DOCUMENTS",
                    "items": [{
                        "type": "fieldset",
                        "title": "EXISTING_LOAN_DOCUMENTS",
                        "condition": "!model.loanAccount.loanType == 'JLG'",
                        "items": [{
                            "type": "array",
                            "required":false,
                            "key": "loanDocuments.existingDocuments",
                            "add": null,
                            "startEmpty": true,
                            "remove": null,
                            "titleExpr": "model.loanDocuments.existingDocuments[arrayIndex].document",
                            "items": [{
                                "title": "DOWNLOAD_FORM",
                                "notitle": true,
                                "fieldHtmlClass": "btn-block",
                                "style": "btn-default",
                                "icon": "fa fa-download",
                                "type": "button",
                                "readonly": false,
                                "key": "loanAccount.loanDocs[].documentId",
                                "onClick": function(model, form, schemaForm, event) {
                                    var fileId = model.loanDocuments.existingDocuments[schemaForm.arrayIndex].documentId;
                                    Utils.downloadFile(Files.getFileDownloadURL(fileId));
                                }

                            }]
                        }]
                    }, {
                        "type": "fieldset",
                        "title": "ADD_LOAN_DOCUMENTS",
                        "condition": "!model.loanAccount.loanType == 'JLG'",
                        "items": [{
                            "type": "array",
                            "required":false,
                            "key": "loanDocuments.newLoanDocuments",
                            "title": "ADD_DOCUMENTS",
                            "startEmpty": true,
                            "titleExpr": "model.loanDocuments.newLoanDocuments[arrayIndex].document",
                            "items": [
                                // {
                                //     "key": "loanDocuments.newLoanDocuments[].document",
                                //     "title": "DOCUMENT",
                                //     "type": "string"
                                // },
                                // {
                                //     "key": "loanDocuments.newLoanDocuments[].disbursementId",
                                //     "title": "DISBURSEMENT_ID",
                                //     "type": "string"
                                // },
                                {
                                    "title": "Upload",
                                    "required":false,
                                    "key": "loanDocuments.newLoanDocuments[].documentId",
                                    type: "file",
                                    fileType: "*/*",
                                    category: "Loan",
                                    subCategory: "DOC1",
                                    notitle: true

                                }
                                // ,
                                // {
                                //     "key": "loanDocuments.newLoanDocuments[].documentStatus",
                                //     "type": "string"
                                // }
                            ]
                        }]
                    },{
                        "title": "Loan Doument Download",
                        "key": "loanAccount.applicationFileId",
                        "condition": "model.loanAccount.loanType == 'JLG'",
                        "type": "file",
                        "fileType": "*/*",
                        "category": "Loan",
                        "subCategory": "DOC1"
                    },{
                        "title": "CHK1 File Download",
                        "key": "loanAccount.chk1FileUploadId",
                        "condition": "model.loanAccount.loanType == 'JLG'",
                        "type": "file",
                        "fileType": "*/*",
                        "category": "Loan",
                        "subCategory": "DOC1"
                    },{
                        "title": "Agreement File Download",
                        "key": "loanAccount.bcAccount.agreementFileId",
                        "condition": "model.loanAccount.loanType == 'JLG'",
                        "type": "file",
                        "fileType": "*/*",
                        "category": "Loan",
                        "subCategory": "DOC1"
                    }]
                }, {
                    "type": "actionbox",
                    "condition": "!model.loanAccount.loanType == 'JLG'",
                    "items": [{
                        "type": "button",
                        "title": "DOWNLOAD_ALL_DOCS",
                        "fieldHtmlClass": "pull-right"
                    },{
                        "type": "button",
                        "title": "REPAYMENT_SCHEDULE_REPORT",
                        "fieldHtmlClass": "pull-right"
                    }, {
                        "type": "submit",
                        "title": "SUBMIT"
                    }]
                },{
                    "type": "actionbox",
                    "condition": "model.loanAccount.loanType == 'JLG'",
                    "items": [{
                        "type": "button",
                        "title": "REPAYMENT_SCHEDULE_REPORT",
                        "onClick": function(model, form, schemaForm, event) {
                            var url = LoanAccount.getRepaymentScheduleDownloadURL(model.cbsLoan.accountId);
                            Utils.downloadFile(url);
                            // LoanAccount.downloadScheduleInCSV({accountNumber:model.cbsLoan.accountId}).$promise.then(function(responseData){
                            //     Utils.downloadFile(responseData);
                            // });
                        }
                    }]
                }
            ],
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
                    model.reqData.loanAccount = _.cloneDeep(model.loanAccount);
                    //alert(model.reqData.loanAccount.loanDocuments.length);
                    model.reqData.loanAccount.loanDocuments = model.reqData.loanAccount.loanDocuments || [];
                    model.reqData.loanProcessAction = "PROCEED";
                    model.reqData.stage = null;
                    if (model.loanDocuments.newLoanDocuments) {
                        for (var i = 0; i < model.loanDocuments.newLoanDocuments.length; i++) {
                            model.loanDocuments.newLoanDocuments[i].loanId = model.loanAccount.id;
                            model.loanDocuments.newLoanDocuments[i].accountNumber = model.loanAccount.accountNumber;
                            model.loanDocuments.newLoanDocuments[i].documentStatus = "APPROVED";

                            model.reqData.loanAccount.loanDocuments.push(model.loanDocuments.newLoanDocuments[i]);
                        }

                    }
                    PageHelper.showLoader();
                    IndividualLoan.update(model.reqData).$promise.then(function(response) {
                        PageHelper.hideLoader();
                        $log.info(response);
                        PageHelper.showProgress("loan-create", "Update Successful", 5000)
                        $state.reload();
                    }, function(errorResponse) {
                        PageHelper.showErrors(errorResponse);
                        PageHelper.showProgress("loan-create", "Oops. An Error Occurred", 5000);
                        PageHelper.hideLoader();
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });;

                }
            }
        };
    }
]);