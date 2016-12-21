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
    return {
        getAccountType: function(value) {
            var at = accountTypes[value];
            if (at && at.accountType)
                return at.accountType;
            return value;
        }
    };
}]);

irf.pageCollection.factory(irf.page("loans.individual.screening.CreditBureauView"),
["$log", "$q","Enrollment", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch",
"CreditBureau","AuthTokenHelper","irfSimpleModal", "CIBILAppendix",
function($log, $q, Enrollment, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,
    CreditBureau,AuthTokenHelper,showModal, CIBILAppendix){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "",
        "subTitle": "",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            model.currentStage = bundleModel.currentStage;
            model.ScoreDetails = [];
            model.customer = {};
            model.coapplicants = [];
            PageHelper.showLoader();
            if (_.hasIn(model, 'loanAccount')){
                if (model.loanAccount.loanCustomerRelations && model.loanAccount.loanCustomerRelations.length >0){
                    for (var i = 0; i <model.loanAccount.loanCustomerRelations.length; i++) {
                        if(model.loanAccount.loanCustomerRelations[i].relation=='Applicant' || model.loanAccount.loanCustomerRelations[i].relation=='Co-Applicant'){
                            CreditBureau.getCBDetails({
                                customerId:model.loanAccount.loanCustomerRelations[i].customerId,
                                requestType:null,
                                type:null
                            })
                            .$promise
                            .then(function(httpres){
                                // Data processing for UI - starts
                                if (httpres && httpres.cibil && httpres.cibil.cibilLoanDetails && httpres.cibil.cibilLoanDetails.length) {
                                    for (i in httpres.cibil.cibilLoanDetails) {
                                        var cld = httpres.cibil.cibilLoanDetails[i];
                                        cld.accountTypeText = CIBILAppendix.getAccountType(cld.accountType);
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
                                }
                                // Data processing for UI - ends
                                for(j=0; j<model.loanAccount.loanCustomerRelations.length; j++){
                                    if(model.loanAccount.loanCustomerRelations[j].relation=='Applicant' && model.loanAccount.loanCustomerRelations[j].customerId==httpres.customerId)
                                        model.applicant = httpres;
                                    else if(model.loanAccount.loanCustomerRelations[j].relation=='Co-Applicant'){
                                        model.coapplicants.push(httpres);
                                        var index = model.coapplicants.length-1;
                                        Enrollment.getCustomerById({id: model.coapplicants[index].customerId})
                                        .$promise
                                        .then(
                                            function (res) {
                                                model.coapplicants[index].customer = res;
                                            }, function (httpRes) {
                                                PageHelper.showProgress('load-loan', "Error while loading co Applicant details", 2000);
                                            }
                                        )
                                    }
                                }
                                if (model.applicant.customerId){
                                    Enrollment.getCustomerById({id: model.applicant.customerId})
                                    .$promise
                                    .then(
                                        function (res) {
                                            model.applicant.customer = res;
                                        }, function (httpRes) {
                                            PageHelper.showProgress('load-loan', "Error while loading customer details", 2000);
                                        }
                                    )
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
                }
            }
        },
        eventListeners: {
        },
        
        form: [
            {
                "type": "box",
                "colClass": "col-sm-12",
                title:"APPLICANT",
                readonly:true,
                "items": [
                    {
                        type:"fieldset",
                        title:"HighMark",
                        items:[]
                    },
                    {
                        "key":"applicant.highMark.dateOfIssue",
                        "title":"DATE_OF_ISSUE",
                        "type":"date"
                    },
                    {
                        "key":"applicant.highMark.highmarkScore",
                        "title":"SCORE",
                    },
                    {
                        type:"tableview",
                        key:"applicant.highMark.highmarkloanDetails",
                        title:"LOAN_DETAILS",
                        paginate:false,
                        searching:false,
                        selectable: false,
                        getActions:function (){
                            return [{
                                name: "Payment History",
                                desc: "",
                                icon: "fa fa-pencil-square-o",
                                fn: function(item, index) {
                                    var paymentHistory = item.combinedPaymentHistory.split('|').join('<br/>');
                                    showModal("Payment History",
                                        "<dl class='dl-horizontal'><dt>Payment History</dt><dd>" + paymentHistory
                                        + "</dd></dl>"
                                    );
                                },
                                isApplicable: function(item, index) {

                                    return true;
                                }
                            }];

                        },
                        getColumns: function(){
                            return [{
                                title: 'ACCOUNT_TYPE',
                                data: 'accountType'
                            }, {
                                title: 'STATUS',
                                data: 'accountStatus'
                            }, {
                                title: 'DISBURSEMENT_DATE',
                                data: 'disbursedDate'
                            },{
                                title: 'LAST_PAYMENT_DATE',
                                data: 'lastPaymentDate'
                            },{
                                title: 'CLOSED_DATE',
                                data: 'closedDate'
                            },{
                                title: 'WRITE_OFF_AMOUNT',
                                data: 'writeOffAmount'
                            },{
                                title: 'CURRENT_BALANCE',
                                data: 'currentBalance'
                            }]
                        }
                    },
                    {
                        type:"fieldset",
                        title:"CIBIL - Credit Information Bureau (India) Limited",
                        items:[
                            {
                                type: "section",
                                html:
// CIBIL Rendering
'<h4 style="padding:5px" ng-show="model.applicant.cibil.cibilScore.length"><small>APPLICANT</small><span class="pull-right">DATE: {{model.applicant.cibil.dateOfIssue|userDate}}</span></h4>'+
'<h4 ng-show="model.applicant.cibil.cibilScore.length">CIBIL TRANSUNION SCORE(S):</h4>'+
    '<table style="width:100%" ng-show="model.applicant.cibil.cibilScore.length">'+
        '<tr><th style="padding:5px">SCORE NAME</th><th style="padding:5px">SCORE</th><th style="padding:5px">SCORE DATE</th></tr>'+
        '<tr class="bg-tint-theme" ng-repeat="s in model.applicant.cibil.cibilScore">'+
            '<td style="padding-left:15px;font-size:18px">{{s.scoreName=="PLSCORE"?"PERSONAL LOAN SCORE":(s.scoreName=="CIBILTUSCR"?"CIBIL TRANSUNION SCORE":s.scoreName)}}</td>'+
            '<td style="font-size:40px">{{s.score|number}}</td>'+
            '<td style="font-size:18px">{{s.scoreDate|userDate}}</td>'+
        '</tr>'+
    '</table>'+
    '<div>&nbsp;</div>'+
    '<h4 ng-show="model.applicant.cibil.cibilLoanDetails.length">ACCOUNT(S):</h4>'+
    '<table style="width:100%" ng-show="model.applicant.cibil.cibilLoanDetails.length">'+
        '<tr><th style="padding:5px">ACCOUNT</th><th style="padding:5px">DATES</th><th style="padding:5px">AMOUNTS</th><th style="padding:5px">STATUS</th></tr>'+
        '<tr class="" ng-repeat-start="ld in model.applicant.cibil.cibilLoanDetails">'+
            '<td style="padding-left:15px;padding-top:15px"><i style="color:#999">TYPE:</i> {{ld.accountTypeText}}</td>'+
            '<td style="padding-top:15px"><i style="color:#999">OPENED:</i> {{ld.disbursedDate|userDate}}<br><i style="color:#999">LAST PAYMENT:</i> {{ld.lastPaymentDate|userDate}}<br><i style="color:#999">CLOSED:</i> {{ld.closedDate|userDate}}</td>'+
            '<td style="padding-top:15px"><i style="color:#999">WRITEOFF:</i> {{ld.writeOffAmount}}<br><i style="color:#999">CURRENT BALANCE:</i> {{ld.currentBalance}}</td>'+
            '<td style="padding-top:15px">{{ld.accountStatus}}</td>'+
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
            '<td colspan="4"><hr></td>'+
        '</tr>'+
    '</table>'+
'<div ng-hide="model.applicant.cibil.cibilScore.length">'+
'<center>No Scores available</center>'+
'</div>'

                            }
                        ]
                    }]
                },
                {
                "type": "box",
                "colClass": "col-sm-12",
                title:"CO_APPLICANT",
                condition:"model.coapplicants.length>0",
                readonly:true,
                "items": [
                        {
                            "key":"coapplicants",
                            type:"array",
                            title: ".",
                            view: "fixed",
                            notitle:true,
                            "startEmpty": true,
                            "add":null,
                            "remove":null,
                            items:[
                                {
                                    type:"fieldset",
                                    title:"HighMark",
                                    items:[]
                                },
                                {
                                    "key":"coapplicants[].highMark.dateOfIssue",
                                    "title":"DATE_OF_ISSUE",
                                    "type":"date"
                                },
                                {
                                    "key":"coapplicants[].highMark.highmarkScore",
                                    "title":"SCORE",
                                },
                                {
                                    type:"tableview",
                                    key:"coapplicants[].highMark.highmarkloanDetails",
                                    title:"LOAN_DETAILS",
                                    paginate:false,
                                    searching:false,
                                    selectable: false,
                                    getActions:function (){
                                        return [{
                                        name: "Payment History",
                                        desc: "",
                                        icon: "fa fa-pencil-square-o",
                                        fn: function(item, index) {
                                            var paymentHistory = item.combinedPaymentHistory.split('|').join('<br/>');
                                            showModal("Payment History",
                                                "<dl class='dl-horizontal'><dt>Payment History</dt><dd>" + paymentHistory
                                                + "</dd></dl>"
                                            );
                                        },
                                        isApplicable: function(item, index) {

                                            return true;
                                        }
                                    }];

                                    },
                                    getColumns: function(){
                                        return [{
                                            title: 'ACCOUNT_TYPE',
                                            data: 'accountType'
                                        }, {
                                            title: 'STATUS',
                                            data: 'accountStatus'
                                        }, {
                                            title: 'DISBURSEMENT_DATE',
                                            data: 'disbursedDate'
                                        },{
                                            title: 'LAST_PAYMENT_DATE',
                                            data: 'lastPaymentDate'
                                        },{
                                            title: 'CLOSED_DATE',
                                            data: 'closedDate'
                                        },{
                                            title: 'WRITE_OFF_AMOUNT',
                                            data: 'writeOffAmount'
                                        },{
                                            title: 'CURRENT_BALANCE',
                                            data: 'currentBalance'
                                        }]
                                    }
                                },
                                {
                                    type:"fieldset",
                                    title:"CIBIL",
                                    items:[]
                                },
                                {
                                    "key":"coapplicants[].cibil.dateOfIssue",
                                    "title":"DATE_OF_ISSUE",
                                    "type":"date"
                                },
                                {
                                    type:"tableview",
                                    key:"coapplicants[].cibil.cibilScore",
                                    title:"CIBIL_SCORE",
                                    paginate:false,
                                    searching:false,
                                    selectable: false,
                                    getActions:function (){
                                        return [];

                                    },
                                    getColumns: function(){
                                        return [{
                                            title: 'SCORE_NAME',
                                            data: 'scoreName'
                                        }, {
                                            title: 'SCORE_DATE',
                                            data: 'scoreDate'
                                        }, {
                                            title: 'SCORE',
                                            data: 'score'
                                        }]
                                    }
                                },
                                {
                                    type:"tableview",
                                    key:"coapplicants[].cibil.cibilLoanDetails",
                                    title:"LOAN_DETAILS",
                                    paginate:false,
                                    searching:false,
                                    selectable: false,
                                    getActions:function (){
                                        return [{
                                        name: "Payment History1",
                                        desc: "",
                                        icon: "fa fa-pencil-square-o",
                                        fn: function(item, index) {
                                            var paymentHistory = item.paymentHistory1;
                                            showModal("Payment History",
                                                "<dl class='dl-horizontal'><dt>Payment History</dt><dd>" + paymentHistory
                                                + "</dd></dl>"
                                            );
                                        },
                                        isApplicable: function(item, index) {

                                            return true;
                                        }
                                    },
                                    {
                                        name: "Payment History2",
                                        desc: "",
                                        icon: "fa fa-pencil-square-o",
                                        fn: function(item, index) {
                                            var paymentHistory = item.paymentHistory2;
                                            showModal("Payment History",
                                                "<dl class='dl-horizontal'><dt>Payment History</dt><dd>" + paymentHistory
                                                + "</dd></dl>"
                                            );
                                        },
                                        isApplicable: function(item, index) {

                                            return true;
                                        }
                                    }];

                                    },
                                    getColumns: function(){
                                        return [{
                                            title: 'ACCOUNT_TYPE',
                                            data: 'accountType'
                                        }, {
                                            title: 'STATUS',
                                            data: 'accountStatus'
                                        }, {
                                            title: 'DISBURSEMENT_DATE',
                                            data: 'disbursedDate'
                                        },{
                                            title: 'LAST_PAYMENT_DATE',
                                            data: 'lastPaymentDate'
                                        },{
                                            title: 'CLOSED_DATE',
                                            data: 'closedDate'
                                        },{
                                            title: 'WRITE_OFF_AMOUNT',
                                            data: 'writeOffAmount'
                                        },{
                                            title: 'CURRENT_BALANCE',
                                            data: 'currentBalance'
                                        }]
                                    }
                                }
                            ]
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
