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

irf.pageCollection.factory(irf.page("customer360.CreditBureauResults"),
["$log", "$q", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch",
"CreditBureau","AuthTokenHelper","irfSimpleModal", "CIBILAppendix","$timeout",
function($log, $q, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,
    CreditBureau,AuthTokenHelper,showModal, CIBILAppendix, $timeout){

    var branch = SessionStore.getBranch();
    var HIGHMARK_HTML =
'<div>'+
    '<h3 ng-show="CBDATA.highMark.highmarkScore" style="font-weight:bold;color:#ccc;">HIGHMARK REPORT</h3>'+
    '<iframe ng-show="CBDATA.highMark.reportHtml" id="{{CBDATA._highmarkId}}" style="border:0;width:100%;height:500px;"></iframe>'+
    '<div ng-hide="CBDATA.highMark.reportHtml">'+
        '<center><b style="color:tomato">{{CBDATA.customer.first_name||CBDATA.customerId}} - HighMark Scores NOT available</b></center>'+
    '</div>'+
'</div>';

var EQUIFAX_HTML =
'<div>'+
    '<h3 ng-show="CBDATA.equifax.equifaxScore" style="font-weight:bold;color:#ccc;">EQUIFAX REPORT</h3>'+
    '<iframe ng-show="CBDATA.equifax.reportHtml" id="{{CBDATA._equifaxId}}" style="border:0;width:100%;height:500px;"></iframe>'+
    '<div ng-hide="CBDATA.equifax.reportHtml">'+
        '<center><b style="color:tomato">{{CBDATA.customer.first_name||CBDATA.customerId}} - Equifax Scores NOT available</b></center>'+
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

   var IDENCHECK_HTML =
'<div>'+
    '<div ng-show="CBDATA.idenCheckResponseDTO != null && CBDATA.idenCheckResponseDTO.highmarkScores.length != 0" class= "row" style="margin:0px;margin-top:10px;">'+
    '<div class= "row" style="margin-top:10px;">'+
        '<div class = "col-sm-3" style="color: #204064;">'+
            '<span class="col-sm-4" style="FONT-SIZE: 45PX;font-weight: bold;MARGIN-LEFT: 10PX;FONT-STYLE: ITALIC;padding: 10px;">CRIF</span>'+
            '<span class="col-sm-6" style="margin-top: 10px;"><span class="col-sm-12" style="FONT-SIZE: 15PX;font-weight: bold;FONT-STYLE: ITALIC;padding-top: 15px;padding-left: 4px;">HIGH</span><span class="col-sm-12" style="    FONT-SIZE: 16PX;font-weight: bold;FONT-STYLE: ITALIC;padding-left: 0px;margin-left: 0px;margin-top: -5px;">MARK</span></span>'+
        '</div>'+
        '<div class = "col-sm-4 text-center"><h3 style="font-weight:bold;color:#ccc;">VERIFICATION REPORT</h3></div>'+
        '<div class = "col-sm-5 pull-right" style="margin-top:10px;"><p class= "col-sm-12" style="margin: 0px;"><span class= "col-sm-6">CHM Ref#</span><span class="col-sm-6">{{CBDATA.idenCheckResponseDTO.reportId}}</span</p><p class= "col-sm-12" style="margin: 0px;"><span class="col-sm-6">Prepared For</span><span class="col-sm-6">{{CBDATA.idenCheckResponseDTO.preparedFor}}</span></p><p class= "col-sm-12" style="margin: 0px;"><span class="col-sm-6">Date of Request</span><span class="col-sm-6"> {{CBDATA.idenCheckResponseDTO.dateOfRequest}}</span></p><p class= "col-sm-12" style="margin: 0px;"><span class="col-sm-6">Date of Issue</span><span class="col-sm-6"> {{CBDATA.idenCheckResponseDTO.dateOfIssue}}</span></p></div>'+
    '</div>'+
    '<div class= "row" style="margin:10px 0px 0px 0px;border-bottom: 2px solid #ccc;"></div>'+
    '<div class= "row" style="margin:10px 0px 0px 0px;color: white;background-color: #0F3F6B;">Inquiry Details</div>'+
    '<div class= "row" style = "margin:10px 0px 0px 0px;">'+
        '<div class ="col-sm-4" >'+
            '<span class ="col-sm-12"><span class = "col-sm-6" style = "color:#0F3F6B;">NAME:</span><span class = "col-sm-6">{{CBDATA.idenCheckResponseDTO.name}}</span></span>'+
            '<span class ="col-sm-12"><span class = "col-sm-6" style = "color:#0F3F6B;">FATHER:</span><span class = "col-sm-6"></span></span>'+
            '<span class ="col-sm-12"><span class = "col-sm-6" style = "color:#0F3F6B;">PHONE NUMBER:</span><span class = "col-sm-6">{{CBDATA.idenCheckResponseDTO.personalInfoVariations[1].variationValue}}</span></span>'+
        '</div>'+
        '<div class ="col-sm-4">'+
            '<span class ="col-sm-12"><span class = "col-sm-4" style = "color:#0F3F6B;">DOB/AGE:</span><span class = "col-sm-8">{{CBDATA.idenCheckResponseDTO.dob}}</span></span>'+
            '<span class ="col-sm-12"><span class = "col-sm-4" style = "color:#0F3F6B;">SPOUSE:</span><span class = "col-sm-8">{{CBDATA.idenCheckResponseDTO.spouse}}</span></span>'+
            '<span class ="col-sm-12"><span class = "col-sm-4" style = "color:#0F3F6B;">ID(S):</span><span class = "col-sm-8"></span></span>'+
        '</div>'+
        '<div class ="col-sm-4" >'+
            '<span class ="col-sm-12"><span class = "col-sm-4" style = "color:#0F3F6B;">GENDER:</span><span class = "col-sm-6">{{CBDATA.idenCheckResponseDTO.gender}}</span></span>'+
            '<span class ="col-sm-12"><span class = "col-sm-4" style = "color:#0F3F6B;">MOTHER:</span><span class = "col-sm-6"></span></span>'+
            '<span class ="col-sm-12"><span class = "col-sm-4" style = "color:#0F3F6B;">EMAIL ID:</span><span class = "col-sm-6"></span></span>'+
        '</div>'+
        '</div>'+
        '<p class= "row" style = "margin-top:10px;"><span class="col-sm-2" style = "color:#0F3F6B;"> CURRENT ADDRESS</span><span class = "col-sm-10">{{CBDATA.idenCheckResponseDTO.personalInfoVariations[0].variationValue}}</span> </p>'+
        '<div class= "row" style="margin:10px 0px 0px 0px;color: white;background-color: #0F3F6B;">Verification Response</div>'+
        '<div class= "row" style="margin:0px;border-bottom: 2px solid #ccc;">'+
            '<span class= "col-sm-1 col-sm-offset-8" style = "color:#2A557C;padding-left: 35px;">Status</span>'+
            '<span class="col-sm-2" style="padding: 0px; margin-left: 50px;">'+
                '<span class ="col-sm-12" style = "color:#2A557C;">Score</span><span class ="col-sm-12" style = "color:#2A557C;">(Score range 0-100)</span></span>'+
        '</div>'+
        '<div class= "row" style="margin:10px 0px 0px 0px; background-color: #E6E6FF"; ng-repeat="idenCheckResponse in CBDATA.idenCheckResponseDTO.idenCheckResponses">'+
            '<p class = "col-sm-1" style="background-color: #0F3F6B;width: 1%;padding-bottom: 2.5%;margin-bottom: 0px;color: white;padding-top: 2.5%;">{{$index + 1}}</p>'+
            '<span class = "col-sm-8">'+
                '<span class= "col-sm-12"><span class = "col-sm-4" style = "color:#41658D;"> Verification for:</span><span class = "col-sm-8" style = "color:#B84D05;"> {{idenCheckResponse.requestServiceType}}</span></span>'+
                '<span class= "col-sm-12"><span class = "col-sm-2" style = "color:#41658D;"> Description:</span><span class = "col-sm-10" style = "color:#9B9BA2;"> {{idenCheckResponse.description}}</span></span>'+
                '<span class= "col-sm-12"><span class = "col-sm-2" style = "color:#41658D;"> Remark:</span><span class = "col-sm-10" style = "color:#9B9BA2;"> {{idenCheckResponse.remarks}}</span></span>'+
            '</span>'+
            '<span class = "col-sm-1" ng-show = "{{idenCheckResponse.status}}" style = "color: #06D456; margin-top: 22px;background-color: #06D456;padding: 8px;width: 5%;"></span>'+
            '<span class = "col-sm-1" ng-hide = "{{idenCheckResponse.status}}" style = "color: #0F3F6B; margin-top: 22px;background-color: #FE403F;padding: 8px;width: 5%;"></span>'+
            '<span class = "col-sm-2" style=" margin-left: 50px; margin-top: 10px;">'+
                '<span class= "col-sm-12" style = "color:#2A557C;margin-top: 12px;"> {{idenCheckResponse.scoreValue}}</span>'+
            '</span>'+
        '</div>'+
        '</div>'+
    '<div ng-show="CBDATA.idenCheckResponseDTO == null">'+
        '<center><b style="color:tomato">{{CBDATA.customer.first_name||CBDATA.customerId}} - IDENCHECK Scores NOT available</b></center>'+
    '</div>'
'</div>';

    var objectifiedBureaus = {};

    var refreshCB = function(model) {
        var deferred = $q.defer();
        model.ScoreDetails = [];
        model.customer = {};
        model.applicant = {};
        if ($stateParams.pageId) {
            PageHelper.showLoader();
            var bureauPromises = [];

                    var bureauPromise = CreditBureau.getCBDetails({customerId: $stateParams.pageId, requestType: null, type: null}).$promise;
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
                        var idencheckMethod = function(httpres){
                           if( httpres.idenCheckResponseDTO != null &&  httpres.idenCheckResponseDTO.length != 0){
                                    for(i in httpres.idenCheckResponseDTO.idenCheckResponses){
                                       if(httpres.idenCheckResponseDTO.idenCheckResponses[i].status != 'Y'){
                                            httpres.idenCheckResponseDTO.idenCheckResponses[i].status = false
                                       }
                                       else{
                                            httpres.idenCheckResponseDTO.idenCheckResponses[i].status = true
                                       }
                                       httpres.idenCheckResponseDTO.idenCheckResponses[i].scoreValue =  httpres.idenCheckResponseDTO.highmarkScores[i].scoreValue
                                    }
                           }
                        }

                        if(httpres){
                            idencheckMethod(httpres);
                             model.applicant = httpres; 
                        }
                    },function (errResp){
                        $log.info("error while processing CB get request");
                        //PageHelper.showErrors(errResp);
                        PageHelper.showProgress('load-loan', "CB Details not available", 2000);
                    })
                    .finally(function(){
                        PageHelper.hideLoader();
                    });
                
            
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
                    objectifiedBureaus[customerIds[i]]._equifaxId = 'equifax_' + customerIds[i];
                }
                deferred.resolve();
            });
        } else {
            deferred.reject();
        }
        return deferred.promise;
    };

    var refreshUI = function() {
        _.forOwn(objectifiedBureaus, function(v, k) {
            if (v.highMark && v.highMark.reportHtml) {
                $('#highmark_'+k)[0].contentWindow.document.write(v.highMark.reportHtml);
            }

            if (v.equifax && v.equifax.reportHtml) {
                $('#equifax_'+k)[0].contentWindow.document.write(v.equifax.reportHtml);
            }
        });
    };

    return {
        "type": "schema-form",
        "title": "",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
           // model.currentStage = bundleModel.currentStage;
            model.CBType= SessionStore.getGlobalSetting("CBCheckType");
            if(model.CBType){
                model.CBType=JSON.parse((model.CBType).replace(/'/g, '"'));
            }
            //model.CBType = JSON.parse(SessionStore.getGlobalSetting("CBCheckType").replace(/'/g, '"'));
            if (model.CBType && model.CBType.length) {
                for (i in model.CBType) {
                    (model.CBType[i] == "CIBIL")?model.CIBIL = true:(model.CBType[i] == "BASE"?model.BASE = true:(model.CBType[i] == "EQUIFAX"?model.EQUIFAX = true:(model.CBType[i] == "CHMHUB"?model.CHMHUB=true:false)));
                }
            } else {
                model.CIBIL = true;
                model.BASE = true;
            }
            return refreshCB(model).then(function(){
                formCtrl.redraw();
                $timeout(function() {
                    refreshUI();
                });
            });
        },
        initializeUI: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            refreshUI();
        },
        form: [
            {
                type: "button",
                title: "REFRESH",
                notitle: true,
                onClick: function(model, formCtrl) {
                    refreshCB(model).then(function() {
                        formCtrl.redraw();
                        $timeout(function() {
                            refreshUI();
                        });
                    });
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
                        html: '<div ng-init="CBDATA=model.applicant">' + '<div ng-show="model.BASE">'+HIGHMARK_HTML+'</div>'+'<div ng-show="model.CIBIL">'+ CIBIL_HTML +'</div>'+ '<div ng-show="model.EQUIFAX">'+EQUIFAX_HTML+'</div>'+'<div ng-show="model.CHMHUB">'+IDENCHECK_HTML+'</div>'+ '</div>'
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
