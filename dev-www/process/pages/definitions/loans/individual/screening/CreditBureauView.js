irf.pageCollection.factory("CIBILAppendix", [function(){
    var accountTypes = {
        "01": {
            "acronym": "-",
            "accountType": "Auto Loan (Personal)"
        },"02": {
            "acronym": "-",
            "accountType": "Housing Loan"
        },"03": {
            "acronym": "-",
            "accountType": "Property Loan"
        },"04": {
            "acronym": "-",
            "accountType": "Loan Against Shares/Securities"
        },"05": {
            "acronym": "-",
            "accountType": "Personal Loan"
        },"06": {
            "acronym": "-",
            "accountType": "Consumer Loan"
        },"07": {
            "acronym": "-",
            "accountType": "Gold Loan"
        },"08": {
            "acronym": "-",
            "accountType": "Education Loan"
        },"09": {
            "acronym": "-",
            "accountType": "Loan to Professional"
        },"10": {
            "acronym": "-",
            "accountType": "Credit Card"
        },
        "11": {
            "acronym": "-",
            "accountType": "Leasing"
        },"12": {
            "acronym": "-",
            "accountType": "Overdraft"
        },"13": {
            "acronym": "-",
            "accountType": "Two-wheeler Loan"
        },"14": {
            "acronym": "NFCF",
            "accountType": "Non-Funded Credit Facility"
        },"15": {
            "acronym": "LABD",
            "accountType": "Loan Against Bank Deposits"
        },"16": {
            "acronym": "-",
            "accountType": "Fleet Card"
        },"17": {
            "acronym": "-",
            "accountType": "Commercial Vehicle Loan"
        },"18": {
            "acronym": "-",
            "accountType": "Telco – Wireless"
        },"19": {
            "acronym": "-",
            "accountType": "Telco – Broadband"
        },"20": {
            "acronym": "-",
            "accountType": "Telco – Landline"
        },

        "40": {
            "acronym": "-",
            "accountType": "Microfinance – Business Loan"
        },
        "41": {
            "acronym": "-",
            "accountType": "Microfinance – Personal Loan"
        },"42": {
            "acronym": "-",
            "accountType": "Microfinance – Housing Loan"
        },"43": {
            "acronym": "-",
            "accountType": "Microfinance – Other"
        },

        "51": {
            "acronym": "-",
            "accountType": "Business Loan – General"
        },"52": {
            "acronym": "BLPS-SB",
            "accountType": "Business Loan – Priority Sector – Small Business"
        },"53": {
            "acronym": "BLPS-AGR",
            "accountType": "Business Loan – Priority Sector – Agriculture"
        },"54": {
            "acronym": "BLPS-OTH",
            "accountType": "Business Loan – Priority Sector – Others"
        },"55": {
            "acronym": "BNFCF-GEN",
            "accountType": "Business Non-Funded Credit Facility – General"
        },"56": {
            "acronym": "BNFCF-PS-SB",
            "accountType": "Business Non-Funded Credit Facility – Priority Sector – Small Business"
        },"57": {
            "acronym": "BNFCF-PS-AGR",
            "accountType": "Business Non-Funded Credit Facility – Priority Sector – Agriculture"
        },"58": {
            "acronym": "BNFCF-PS-OTH",
            "accountType": "Business Non-Funded Credit Facility – Priority Sector-Others"
        },"59": {
            "acronym": "BLABD",
            "accountType": "Business Loan Against Bank Deposits"
        },

        "88": {
            "acronym": "-",
            "accountType": "Locate Plus for Insurance (Applicable to Enquiry Purpose only)"
        },

        "90": {
            "acronym": "-",
            "accountType": "Account Review (Applicable to Enquiry Purpose only)"
        },
        "91": {
            "acronym": "-",
            "accountType": "Retro Enquiry (Applicable to Enquiry Purpose only)"
        },"92": {
            "acronym": "-",
            "accountType": "Locate Plus (Applicable to Enquiry Purpose only)"
        },"93": {
            "acronym": "-",
            "accountType": "For Individual (Applicable to Enquiry Purpose only)"
        },

        "95": {
            "acronym": "-",
            "accountType": "Consumer Disclosure Report (Applicable to Enquiry Purpose only)"
        },

        "97": {
            "acronym": "-",
            "accountType": "Adviser Liability (Applicable to Enquiry Purpose only)"
        },"98": {
            "acronym": "-",
            "accountType": "Secured (Account Group for Portfolio Review response)"
        },"99": {
            "acronym": "-",
            "accountType": "Unsecured (Account Group for Portfolio Review response)"
        },"00": {
            "acronym": "-",
            "accountType": "Other"
        }
    };
    var ownershipIndicators = {
        "1":"INDIVIDUAL",
        "2":"AUTHORIZED USER",
        "3":"GUARANTOR",
        "4":"JOINT"
    };
    var enquiryPurposes = {
        "01":"Auto Loan (Personal)",
        "02":"Housing Loan",
        "03":"Property Loan",
        "04":"Loan Against Shares/Securities",
        "05":"Personal Loan",
        "06":"Consumer Loan",
        "07":"Gold Loan",
        "08":"Education Loan",
        "09":"Loan to Professional",
        "10":"Credit Card",
        "11":"Leasing",
        "12":"Overdraft",
        "13":"Two-wheeler Loan",
        "14":"Non-Funded Credit Facility",
        "15":"Loan Against Bank Deposits",
        "16":"Fleet Card",
        "17":"Commercial Vehicle Loan",
        "18":"Telco – Wireless",
        "19":"Telco – Broadband",
        "20":"Telco – Landline",
        "40":"Microfinance – Business Loan",
        "41":"Microfinance – Personal Loan",
        "42":"Microfinance – Housing Loan",
        "43":"Microfinance – Other",
        "51":"Business Loan – General",
        "52":"Business Loan – Priority Sector – Small Business",
        "53":"Business Loan – Priority Sector – Agriculture",
        "54":"Business Loan – Priority Sector – Others",
        "55":"Business Non-Funded Credit Facility – General",
        "56":"Business Non-Funded Credit Facility – Priority Sector – Small Business",
        "57":"Business Non-Funded Credit Facility – Priority Sector – Agriculture",
        "58":"Business Non-Funded Credit Facility – Priority Sector-Others",
        "59":"Business Loan Against Bank Deposits",
        "80":"Microfinance Detailed Report (Applicable to Enquiry Purpose only)",
        "81":"Summary Report (Applicable to Enquiry Purpose only)",
        "88":"Locate Plus for Insurance (Applicable to Enquiry Purpose only)",
        "89":"VB OLM Retrieval Service (Applicable to Enquiry Purpose for VB OLM Request only)",
        "90":"Account Review (Applicable to Enquiry Purpose only)",
        "91":"Retro Enquiry (Applicable to Enquiry Purpose only)",
        "92":"Locate Plus (Applicable to Enquiry Purpose only)",
        "93":"For Individual (Applicable to Enquiry Purpose only)",
        "94":"Indicative Report (Applicable to Enquiry Purpose for CRS Request only)",
        "95":"Consumer Disclosure Report (Applicable to Enquiry Purpose only)",
        "96":"Bank OLM Retrieval Service (Applicable to Enquiry Purpose for CRS Request only)",
        "97":"Adviser Liability (Applicable to Enquiry Purpose only)",
        "00":"Other",
        "98":"Secured (Account Group for Portfolio Review response)",
        "99":"Unsecured (Account Group for Portfolio Review response)"
    };
    return {
        getAccountType: function(value) {
            var at = accountTypes[value];
            if (at && at.accountType)
                return at.accountType;
            return value;
        },
        getOwnershipIndicator: function(value) {
            return ownershipIndicators[value];
        },
        getEnquiryPurpose: function(value) {
            return enquiryPurposes[value];
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.screening.CreditBureauView"),
["$log", "$q", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch",
"CreditBureau","AuthTokenHelper","irfSimpleModal", "CIBILAppendix","$timeout",
function($log, $q, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,
    CreditBureau,AuthTokenHelper,showModal, CIBILAppendix, $timeout){

    var branch = SessionStore.getBranch();

    /*var HIGHMARK_HTML = 
'<div>'+
    '<h3 ng-show="CBDATA.highMark.highmarkScore" style="font-weight:bold;color:#ccc;">HIGHMARK REPORT</h3>'+
    '<h4 style="padding:5px" ng-show="CBDATA.highMark.highmarkScore"><span style="font-weight:bold">{{CBDATA.customer.first_name||CBDATA.customerId}}</span><span class="pull-right">Date of Issue: <b>{{CBDATA.highMark.dateOfIssue}}</b></span></h4>'+
    '<h4 ng-show="CBDATA.highMark.highmarkScore">CRIF HIGHMARK SCORE(S): <span style="font-size:50px;font-weight:bold">{{CBDATA.highMark.highmarkScore}}</span></h4>'+
    '<div ng-show="CBDATA.highMark.highmarkloanDetails.length">&nbsp;</div>'+
    '<table style="width:100%" ng-show="CBDATA.highMark.highmarkloanDetails.length">'+
        '<tr><th style="padding:5px">ACCOUNT</th><th style="padding:5px">DATES</th><th style="padding:5px">AMOUNTS</th><th style="padding:5px">STATUS</th></tr>'+
        '<tr class="" ng-repeat-start="ld in CBDATA.highMark.highmarkloanDetails">'+
            '<td style="padding-left:15px;padding-top:15px"><i style="color:#999">TYPE:</i> {{ld.accountType}}</td>'+
            '<td style="padding-top:15px"><i style="color:#999">Disbursed Date:</i> {{ld.disbursedDate}}<br><i style="color:#999">Last Payment Date:</i> {{ld.lastPaymentDate}}<br><i style="color:#999">Closed Date:</i> {{ld.closedDate}}</td>'+
            '<td style="padding-top:15px"><i style="color:#999">Total Writeoff Amt:</i> {{ld.writeOffAmount}}<br><i style="color:#999">Current balance:</i> {{ld.currentBalance}}</td>'+
            '<td style="padding-top:15px">{{ld.accountStatus}}</td>'+
        '</tr>'+
        '<tr class="bg-tint-theme" ng-show="ld.combinedPaymentHistoryList.length">'+
            '<td colspan="4"><span style="font-weight:bold;font-size:12px;padding-left:5px">Payment History/Asset Classification:</span></td>'+
        '</tr>'+
        '<tr class="bg-tint-theme" ng-show="ld.combinedPaymentHistoryList.length">'+
            '<td colspan="4" style="padding:5px">'+
                '<table style="width:100%">'+
                    '<tr class="bg-tint-theme">'+
                        '<td ng-repeat="phl in ld.combinedPaymentHistoryList track by $index" style="padding-top:5px">'+
                            '<div style="font-family:monospace">{{phl[1]}}</div>'+
                        '</td>'+
                    '</tr>'+
                    '<tr class="bg-tint-theme">'+
                        '<td ng-repeat="ph1 in ld.combinedPaymentHistoryList track by $index">'+
                            '<div style="font-size:12px">{{ph1[0]}}</div>'+
                        '</td>'+
                    '</tr>'+
                    '<tr class="bg-tint-theme" ng-show="ld.combinedPaymentHistoryList2.length">'+
                        '<td ng-repeat="ph2 in ld.combinedPaymentHistoryList2 track by $index" style="padding-top:15px">'+
                            '<div style="font-family:monospace">{{ph2[1]}}</div>'+
                        '</td>'+
                    '</tr>'+
                    '<tr class="bg-tint-theme">'+
                        '<td ng-repeat="ph2 in ld.combinedPaymentHistoryList2 track by $index">'+
                            '<div style="font-size:12px">{{ph2[0]}}</div>'+
                        '</td>'+
                    '</tr>'+
                    '<tr class="bg-tint-theme" ng-show="ld.combinedPaymentHistoryList3.length">'+
                        '<td ng-repeat="ph3 in ld.combinedPaymentHistoryList3 track by $index" style="padding-top:15px">'+
                            '<div style="font-family:monospace">{{ph3[1]}}</div>'+
                        '</td>'+
                    '</tr>'+
                    '<tr class="bg-tint-theme">'+
                        '<td ng-repeat="ph3 in ld.combinedPaymentHistoryList3 track by $index">'+
                            '<div style="font-size:12px">{{ph3[0]}}</div>'+
                        '</td>'+
                    '</tr>'+
                '</table>'+
            '</td>'+
        '</tr>'+
        '<tr ng-repeat-end>'+
            '<td colspan="4"><hr></td>'+
        '</tr>'+
    '</table>'+
    '<div ng-hide="CBDATA.highMark.highmarkloanDetails.length">'+
        '<center><b style="color:tomato">{{CBDATA.customer.first_name||CBDATA.customerId}} - HighMark Scores NOT available</b></center>'+
    '</div>'+
    '<div ng-show="CBDATA.highMark.highmarkloanDetails.length" style="text-align:center;border-bottom:1px dashed #999;line-height:0.1em;margin:10px 0 20px;">'+
        '<span style="background:#fff;padding:0 10px;color:#999;font-size:14px;">END OF HIGHMARK REPORT</span>'+
    '</div>'+
    '<br>'+
'</div>';*/
    var HIGHMARK_HTML =
'<div>'+
    '<h3 ng-show="CBDATA.highMark.highmarkScore" style="font-weight:bold;color:#ccc;">HIGHMARK REPORT</h3>'+
    '<iframe ng-show="CBDATA.highMark.reportHtml" id="{{CBDATA._highmarkId}}" style="border:0;width:100%;height:500px;"></iframe>'+
    '<div ng-hide="CBDATA.highMark.reportHtml">'+
        '<center><b style="color:tomato">{{CBDATA.customer.first_name||CBDATA.customerId}} - HighMark Scores NOT available</b></center>'+
    '</div>'+
'</div>';

    var CIBIL_HTML =
'<div>'+
    '<h3 ng-show="CBDATA.cibil.cibilScore.length" style="font-weight:bold;color:#ccc;">CIBIL REPORT</h3>'+
    '<h4 style="padding:5px" ng-show="CBDATA.cibil.cibilScore.length"><span style="font-weight:bold">{{CBDATA.customer.first_name||CBDATA.customerId}}</span><span class="pull-right">DATE: <b>{{CBDATA.cibil.dateOfIssue|userDate}}</b></span></h4>'+

    '<h4 ng-show="CBDATA.cibil.cibilScore.length">CIBIL TRANSUNION SCORE(S):</h4>'+
    '<table style="width:100%" ng-show="CBDATA.cibil.cibilScore.length">'+
        '<tr><th style="padding:5px">SCORE NAME</th><th style="padding:5px">SCORE</th><th style="padding:5px">SCORE DATE</th></tr>'+
        '<tr class="bg-tint-theme" ng-repeat="s in CBDATA.cibil.cibilScore">'+
            '<td style="padding-left:15px;font-size:18px">{{s.scoreName=="PLSCORE"?"PERSONAL LOAN SCORE":(s.scoreName=="CIBILTUSCR"?"CIBIL TRANSUNION SCORE":s.scoreName)}}</td>'+
            '<td style="font-size:40px">{{s.score}}</td>'+
            '<td style="font-size:18px">{{s.scoreDate|userDate}}</td>'+
        '</tr>'+
    '</table>'+

    '<div ng-show="CBDATA.cibil.cibilScore.length">&nbsp;</div>'+
    '<h4 ng-show="CBDATA.cibil.cibilLoanSummaryInfo.length">SUMMARY:</h4>'+
    '<table style="width:100%" ng-show="CBDATA.cibil.cibilLoanSummaryInfo.length">'+
        '<tr>'+
            '<th colspan="5" style="padding:5px">ACCOUNT(S)</th>'+
        '</tr>'+
        '<tr>'+
            '<th style="padding:5px">ACCOUNT TYPE</th>'+
            '<th style="padding:5px;text-align:right">ACCOUNTS</th>'+
            '<th style="padding:5px;text-align:right">ADVANCES</th>'+
            '<th style="padding:5px;text-align:right">BALANCES</th>'+
            '<th style="padding:5px;text-align:right">DATE OPENED</th>'+
        '</tr>'+
        '<tr class="bg-tint-theme" ng-repeat-start="lsi in CBDATA.cibil.cibilLoanSummaryInfo">'+
            '<td style="padding-left:10px;border-top:1px solid #666;vertical-align:top"><b>{{lsi.accountType}}</b></td>'+
            '<td style="border-top:1px solid #666;text-align:right;vertical-align:top">'+
                '<i style="color:#666">TOTAL:</i> <b>{{lsi.totalAccounts}}</b><hr style="margin-bottom:0;border-top-color:#999">'+
                '<i style="color:#666">OVERDUE:</i> <b>{{lsi.overDueAccounts}}</b><hr style="margin-bottom:0;border-top-color:#999">'+
                '<i style="color:#666">ZERO-BALANCE:</i> <b>{{lsi.zeroBalanceAccounts}}</b>'+
            '</td>'+
            '<td style="border-top:1px solid #666;text-align:right;vertical-align:top">'+
                '<i style="color:#666">HIGH CR/SANC. AMT:</i> <b>{{lsi.advances}}</b>'+
            '</td>'+
            '<td style="border-top:1px solid #666;text-align:right;vertical-align:top">'+
                '<i style="color:#666">CURRENT:</i> <b>{{lsi.currentBalance}}</b><hr style="margin-bottom:0;border-top-color:#999">'+
                '<i style="color:#666">OVERDUE:</i> <b>{{lsi.amountOverDue}}</b>'+
            '</td>'+
            '<td style="border-top:1px solid #666;text-align:right;vertical-align:top">'+
                '<i style="color:#666">RECENT:</i> <b>{{lsi.recentOpenDate|userDate}}</b><hr style="margin-bottom:0;border-top-color:#999">'+
                '<i style="color:#666">OLDEST:</i> <b>{{lsi.oldestOpenDate|userDate}}</b>'+
            '</td>'+
        '</tr>'+
        '<tr ng-repeat-end>'+
            '<td colspan="5"><hr style="margin-bottom:0;border-top-color:#999"></td>'+
        '</tr>'+
    '</table>'+

    '<div ng-show="CBDATA.cibil.cibilScore.length">&nbsp;</div>'+
    '<h4 ng-show="CBDATA.cibil.cibilLoanDetails.length">ACCOUNT(S):</h4>'+
    '<table style="width:100%" ng-show="CBDATA.cibil.cibilLoanDetails.length">'+
        '<tr>'+
            '<th style="padding:5px;width:30%">ACCOUNT</th>'+
            '<th style="padding:5px;width:30%">DATES</th>'+
            '<th style="padding:5px;width:20%;text-align:right">AMOUNTS</th>'+
            '<th style="padding:5px">STATUS</th>'+
        '</tr>'+
        '<tr class="" ng-repeat-start="ld in CBDATA.cibil.cibilLoanDetails">'+
            '<td style="padding-top:15px;vertical-align:top">'+
                '<i style="color:#999">TYPE:</i> <b>{{ld.accountTypeText}}</b><br>'+
                '<i style="color:#999">OWNERSHIP:</i> <b>{{ld.ownershipIndicatorText}}</b>'+
            '</td>'+
            '<td style="padding-top:15px;vertical-align:top">'+
                '<i style="color:#999">OPENED:</i> <b>{{ld.disbursedDate|userDate}}</b><br>'+
                '<i style="color:#999">LAST PAYMENT:</i> <b>{{ld.lastPaymentDate|userDate}}</b><br>'+
                '<i style="color:#999">CLOSED:</i> <b>{{ld.closedDate|userDate}}</b>'+
            '</td>'+
            '<td style="padding-top:15px;vertical-align:top;text-align:right">'+
                '<i style="color:#999">HIGH CR/SANC:</i> <b>{{ld.highCreditOrSanctionedAmount}}</b><br>'+
                '<i style="color:#999">WRITEOFF:</i> <b>{{ld.writeOffAmount}}</b><br>'+
                '<i style="color:#999">CURRENT BALANCE:</i> <b>{{ld.currentBalance}}</b><br>'+
                '<i style="color:#999">OVERDUE:</i> <b>{{ld.amountOverdue}}</b>'+
            '</td>'+
            '<td style="padding-top:15px;vertical-align:top"><b>{{ld.accountStatus}}</b></td>'+
        '</tr>'+
        '<tr class="bg-tint-theme" ng-show="ld.paymentHistory1List.length">'+
            '<td colspan="4"><span style="font-weight:bold;font-size:12px;padding-left:5px">DAYS PAST DUE/ASSET CLASSIFICATION (UP TO 36 MONTHS; LEFT TO RIGHT)</span></td>'+
        '</tr>'+
        '<tr class="bg-tint-theme" ng-show="ld.paymentHistory1List.length">'+
            '<td colspan="4" style="padding:5px">'+
                '<table style="width:100%">'+
                    '<tr class="bg-tint-theme">'+
                        '<td ng-repeat="ph1 in ld.paymentHistory1List track by $index" style="padding-top:5px">'+
                            '<div style="font-family:monospace">{{ph1}}</div>'+
                        '</td>'+
                    '</tr>'+
                    '<tr class="bg-tint-theme">'+
                        '<td ng-repeat="ph1m in ld.paymentHistory1Months track by $index">'+
                            '<div style="font-size:12px">{{ph1m}}</div>'+
                        '</td>'+
                    '</tr>'+
                    '<tr class="bg-tint-theme" ng-show="ld.paymentHistory2List.length">'+
                        '<td ng-repeat="ph2 in ld.paymentHistory2List track by $index" style="padding-top:15px">'+
                            '<div style="font-family:monospace">{{ph2}}</div>'+
                        '</td>'+
                    '</tr>'+
                    '<tr class="bg-tint-theme">'+
                        '<td ng-repeat="ph2m in ld.paymentHistory2Months track by $index">'+
                            '<div style="font-size:12px">{{ph2m}}</div>'+
                        '</td>'+
                    '</tr>'+
                '</table>'+
            '</td>'+
        '</tr>'+
        '<tr ng-repeat-end>'+
            '<td colspan="4"><hr style="margin-bottom:0;border-top-color:#999"></td>'+
        '</tr>'+
    '</table>'+

    '<div ng-show="CBDATA.cibil.enquirySegment.length">&nbsp;</div>'+
    '<h4 ng-show="CBDATA.cibil.enquirySegment.length">ENQUIRIES:</h4>'+
    '<table style="width:100%" ng-show="CBDATA.cibil.enquirySegment.length">'+
        '<tr>'+
            '<th style="padding:5px">MEMBER</th>'+
            '<th style="padding:5px">ENQUIRY DATE</th>'+
            '<th style="padding:5px">ENQUIRY PURPOSE</th>'+
            '<th style="padding:5px;text-align:right">ENQUIRY AMOUNT</th>'+
        '</tr>'+
        '<tr class="{{$even?\'bg-tint-theme\':\'\'}}" ng-repeat="es in CBDATA.cibil.enquirySegment">'+
            '<td style="padding:5px">{{es.enquiringMemberShortName}}</td>'+
            '<td style="padding:5px">{{es.dateOfEnquiry|userDate}}</td>'+
            '<td style="padding:5px">{{es.enquiryPurposeText|uppercase}}</td>'+
            '<td style="padding:5px;text-align:right">{{es.enquiryAmount}}</td>'+
        '</tr>'+
    '</table>'+

    '<div ng-hide="CBDATA.cibil.cibilScore.length">'+
        '<center><b style="color:tomato">{{CBDATA.customer.first_name||CBDATA.customerId}} - CIBIL Scores NOT available</b></center>'+
    '</div>'+

    '<div ng-show="CBDATA.cibil.cibilScore.length" style="text-align:center;border-bottom:1px dashed #999;line-height:0.1em;margin:10px 0 20px;">'+
        '<span style="background:#fff;padding:0 10px;color:#999;font-size:14px;">END OF CIBIL REPORT</span>'+
    '</div>'+
    '<br>'+
'</div>';

    var objectifiedBureaus = {};

    var refreshCB = function(model) {
        model.ScoreDetails = [];
        model.customer = {};
        model.applicant = {};
        model.coapplicants = [];
        model.guarantors = [];
        if (_.hasIn(model, 'loanAccount')) {
            if (model.loanAccount.loanCustomerRelations && model.loanAccount.loanCustomerRelations.length) {
                PageHelper.showLoader();
                var bureauPromises = [];
                for (i in model.loanAccount.loanCustomerRelations) {
                    var lcRelation = model.loanAccount.loanCustomerRelations[i];
                    if (lcRelation.relation == 'Applicant' || lcRelation.relation == 'Co-Applicant' || lcRelation.relation == 'Guarantor'){
                        var bureauPromise = CreditBureau.getCBDetails({customerId: lcRelation.customerId, requestType: null, type: null}).$promise;
                        bureauPromises.push(bureauPromise);

                        bureauPromise.then(function(httpres) {
                            // Data processing for UI - starts
                            // CIBIL
                            if (httpres && httpres.cibil && httpres.cibil.cibilLoanDetails && httpres.cibil.cibilLoanDetails.length) {
                                for (i in httpres.cibil.cibilLoanDetails) {
                                    var cld = httpres.cibil.cibilLoanDetails[i];
                                    cld.accountTypeText = CIBILAppendix.getAccountType(cld.accountType);
                                    cld.ownershipIndicatorText = CIBILAppendix.getOwnershipIndicator(cld.ownershipIndicator);
                                    $log.info(cld.accountType + ": " + cld.accountTypeText);
                                    if (cld.paymentHistory1) {
                                        cld.paymentHistory1List = cld.paymentHistory1.match(/.{1,3}/g);
                                        var reqLen = 18 - cld.paymentHistory1List.length;
                                        for(j=0;j<reqLen;j++) cld.paymentHistory1List.push('\u00A0\u00A0\u00A0');
                                    }
                                    if (cld.paymentHistory2) {
                                        cld.paymentHistory2List = cld.paymentHistory2.match(/.{1,3}/g);
                                        var reqLen = 18 - cld.paymentHistory2List.length;
                                        for(j=0;j<reqLen;j++) cld.paymentHistory2List.push('\u00A0\u00A0\u00A0');
                                    }
                                    if (cld.paymentHistoryStartDate && cld.paymentHistory1List) {
                                        var dt = moment(cld.paymentHistoryStartDate, SessionStore.getSystemDateFormat());
                                        cld.paymentHistory1Months = new Array(18);
                                        for(j in cld.paymentHistory1List) {
                                            if (cld.paymentHistory1List[j] != '\u00A0\u00A0\u00A0') {
                                                cld.paymentHistory1Months[j] = dt.format('MM-YY');
                                                dt = dt.subtract(1, 'months');
                                            }
                                        }
                                        if (cld.paymentHistory2List) {
                                            cld.paymentHistory2Months = new Array(18);
                                            for(j in cld.paymentHistory2List) {
                                                if (cld.paymentHistory2List[j] != '\u00A0\u00A0\u00A0') {
                                                    cld.paymentHistory2Months[j] = dt.format('MM-YY');
                                                    dt = dt.subtract(1, 'months');
                                                }
                                            }
                                        }
                                    }
                                }
                            } else
                            // HIGHMARK
                            if (httpres && httpres.highMark && httpres.highMark.highmarkloanDetails && httpres.highMark.highmarkloanDetails.length) {
                                for (i in httpres.highMark.highmarkloanDetails) {
                                    var hmld = httpres.highMark.highmarkloanDetails[i];
                                    if (hmld.combinedPaymentHistory) {
                                        hmld.combinedPaymentHistoryList = hmld.combinedPaymentHistory.split('|');
                                        for (var j = 0; j < hmld.combinedPaymentHistoryList.length; j++) {
                                            hmld.combinedPaymentHistoryList[j] = hmld.combinedPaymentHistoryList[j].split(',');
                                            hmld.combinedPaymentHistoryList[j][0] = hmld.combinedPaymentHistoryList[j][0].replace(':', '-');
                                        }
                                        if (hmld.combinedPaymentHistoryList.length > 12) {
                                            var ln = hmld.combinedPaymentHistoryList.length;
                                            var a1 = hmld.combinedPaymentHistoryList.slice(0, 12);
                                            var a2 = hmld.combinedPaymentHistoryList.slice(12, ln);
                                            hmld.combinedPaymentHistoryList2 = a2;
                                            hmld.combinedPaymentHistoryList = a1;
                                            ln = ln - 12;
                                            if (ln > 12) {
                                                a1 = hmld.combinedPaymentHistoryList2.slice(0, 12);
                                                a2 = hmld.combinedPaymentHistoryList2.slice(12, ln);
                                                hmld.combinedPaymentHistoryList2 = a1;
                                                hmld.combinedPaymentHistoryList3 = a2;
                                            }
                                        }
                                    }
                                }
                            }
                            if (httpres && httpres.cibil && httpres.cibil.enquirySegment && httpres.cibil.enquirySegment.length) {
                                for (i in httpres.cibil.enquirySegment) {
                                    var ces = httpres.cibil.enquirySegment[i];
                                    ces.enquiryPurposeText = CIBILAppendix.getEnquiryPurpose(ces.enquiryPurpose);
                                }
                            }
                            // Data processing for UI - ends

                            for (j in model.loanAccount.loanCustomerRelations) {
                                var relationGuy = model.loanAccount.loanCustomerRelations[j];
                                if (relationGuy.customerId == httpres.customerId) {
                                    if (relationGuy.relation == 'Applicant') {
                                        model.applicant = httpres;
                                    } else if (relationGuy.relation == 'Co-Applicant') {
                                        model.coapplicants.push(httpres);
                                    } else if (relationGuy.relation == 'Guarantor') {
                                        model.guarantors.push(httpres);
                                    }
                                }
                            }
                        },function (errResp){
                            $log.info("error while processing CB get request");
                            //PageHelper.showErrors(errResp);
                            PageHelper.showProgress('load-loan', "CB Details not available", 2000);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        });
                    }
                }
                $q.all(bureauPromises).finally(function() {
                    objectifiedBureaus = {};
                    objectifiedBureaus[model.applicant.customerId] = model.applicant;
                    var customerIds = [model.applicant.customerId];
                    for (k in model.coapplicants) {
                        objectifiedBureaus[model.coapplicants[k].customerId] = model.coapplicants[k];
                        customerIds.push(model.coapplicants[k].customerId);
                    }
                    for (k in model.guarantors) {
                        objectifiedBureaus[model.guarantors[k].customerId] = model.guarantors[k];
                        customerIds.push(model.guarantors[k].customerId);
                    }

                    Queries.getCustomerBasicDetails({ids: customerIds}).then(function (res) {
                        _.forOwn(res.ids, function(v, k) {
                            objectifiedBureaus[k].customer = v;
                        });
                    });

                    for (i in customerIds) {
                        objectifiedBureaus[customerIds[i]]._highmarkId = 'highmark_' + customerIds[i];
                    }
                });
            }
        }
    };

    var refreshUI = function() {
        _.forOwn(objectifiedBureaus, function(v, k) {
            if (v.highMark && v.highMark.reportHtml) {
                $('#highmark_'+k)[0].contentWindow.document.write(v.highMark.reportHtml);
            }
        });
    };

    return {
        "type": "schema-form",
        "title": "",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            model.currentStage = bundleModel.currentStage;
            refreshCB(model);
        },
        initializeUI: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            refreshUI();
        },
        eventListeners: {
        },
        form: [
            {
                type: "button",
                title: "REFRESH",
                notitle: true,
                onClick: function(model) {
                    refreshCB(model);
                    refreshUI();
                }
            },
            {
                type: "section",
                html: '&nbsp;'
            },
            {
                "type": "box",
                "colClass": "col-sm-12",
                title:"APPLICANT",
                readonly:true,
                "items": [
                    {
                        type: "section",
                        html: '<div ng-init="CBDATA=model.applicant">' + HIGHMARK_HTML + CIBIL_HTML + '</div>'
                    }
                ]
            },
            {
                "type": "box",
                "colClass": "col-sm-12",
                title:"CO_APPLICANT",
                condition:"model.coapplicants.length>0",
                readonly:true,
                "items": [
                    {
                        type: "section",
                        html: '<div ng-repeat="CBDATA in model.coapplicants">' + HIGHMARK_HTML + CIBIL_HTML + '<hr><hr></div>'
                    }
                ]
            },
            {
                "type": "box",
                "colClass": "col-sm-12",
                title:"GUARANTOR",
                condition:"model.guarantors.length>0",
                readonly:true,
                "items": [
                    {
                        type: "section",
                        html: '<div ng-repeat="CBDATA in model.guarantors">' + HIGHMARK_HTML + CIBIL_HTML + '<hr><hr></div>'
                    }
                ]
            }
        ],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            save: function(customerId, CBType, loanAmount, loanPurpose){
                $log.info("Inside submit()");
                $log.warn(model);
            }
        }

    };
}

]);
