irf.pageCollection.factory(irf.page("loans.individual.screening.CreditBureauView"),
["$log", "$q","Enrollment", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch","CreditBureau","AuthTokenHelper","irfSimpleModal",
function($log, $q, Enrollment, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,CreditBureau,AuthTokenHelper,showModal){

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
                            },function(httpres){
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
                                PageHelper.showErrors(errResp);
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
                        title:"CIBIL",
                        items:[]
                    },
                    {
                        "key":"applicant.cibil.dateOfIssue",
                        "title":"DATE_OF_ISSUE",
                        "type":"date"
                    },
                    {
                        type:"tableview",
                        key:"applicant.cibil.cibilScore",
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
                        key:"applicant.cibil.cibilLoanDetails",
                        title:"LOAN_DETAILS",
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
