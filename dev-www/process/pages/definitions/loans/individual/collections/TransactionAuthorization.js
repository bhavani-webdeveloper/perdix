

irf.pageCollection.factory(irf.page("loans.individual.collections.TransactionAuthorization"),
["$log","$q", 'Pages_ManagementHelper','LoanProcess','LoanAccount', 'entityManager','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, ManagementHelper, LoanProcess,LoanAccount,entityManager, PageHelper,formHelper,irfProgressMessage,
    SessionStore,$state,$stateParams,Masters,authService){

    return {
        "type": "schema-form",
        "title": "PAYMENT_DETAILS_FOR_LOAN",
        initialize: function (model, form, formCtrl) {
            $log.info("Transaction Authorization Page got initialized");
             model.transAuth =  model.transAuth || {};

              //PageHelper.showLoader();
                    irfProgressMessage.pop('loading-Transaction Authorization-details', 'Loading Transaction Authorization Details');
                    //PageHelper
                    var loanAccountNo = $stateParams.pageId;
                    var promise = LoanAccount.get({accountId: loanAccountNo}).$promise;
                    promise.then(function (data) { /* SUCCESS */
                        model.loanAccount = data;
                        console.log('sarthak')
                        console.log(data);
                        model.transAuth = model.transAuth || {};
                        model.transAuth.customer_name = data.customer1FirstName;
                        model.transAuth.productCode=data.productCode;
                        model.transAuth.urnNo=data.customerId1;
                        model.transAuth.instrument='CASH_IN'; 
                        model.transAuth.authorizationUsing='Testing-Swapnil';
                        model.transAuth.remarks='collections';
                        model.transAuth.accountNumber = data.accountId;
                        model.transAuth.amountDue = data.totalDemandDue;
                        model.transAuth.principal=data.totalPrincipalDue;
                        model.transAuth.interest=data.totalNormalInterestDue;
                        model.transAuth.applicant_name=data.applicant;
                        model.transAuth.applicant_name=data.coapplicant;
                        model.transAuth.penal_interest=data.totalPenalInterestDue;
                        model.transAuth.fee=data.totalFeeDue;

                        model.transAuth.amountCollected = model._transAuth.repaymentAmountInPaisa/100;

                        var currDate = moment(new Date()).format("YYYY-MM-DD");
                        model.creditValidation.repaymentDate = currDate;
                        irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                    }, function (resData) {
                        irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                        PageHelper.showErrors(resData);
                        backToLoansList();
                    })
                    .finally(function () {
                        PageHelper.hideLoader();
                    })
            /*
            if(model._transAuth)
            {
                model.transAuth = model._transAuth;
                model.transAuth.customer_name = model._transAuth.customerName;
                model.transAuth.applicant_name = model._transAuth.applicantName;
                model.transAuth.co_applicant_name = model._transAuth.coApplicantName;
                model.transAuth.principal = model._transAuth.principalOutstandingAmtInPaisa;
                model.transAuth.interest = model._transAuth.interest;
                model.transAuth.fee = model._transAuth.fee;
                model.transAuth.penal_interest = model._transAuth.penal_interest;
                model.transAuth.amountDue = model._transAuth.demandAmountInPaisa;
                model.transAuth.amountCollected = model._transAuth.repaymentAmountInPaisa;
            } else {
                $state.go('Page.Engine', {pageName: 'loans.individual.collections.TransactionAuthorizationQueue', pageId: null});
            
            }*/
        },
        
        form: [
            {
                "type":"box",
                "title":"PAYMENT",
                "items":[
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"transAuth.customer_name",
                                        title:"ENTERPRISE_NAME",
                                        readonly:true
                                    },
                                    {
                                        key:"transAuth.applicant_name",
                                        title:"APPLICANT",
                                        readonly:true,
                                    },
                                    {
                                        key:"transAuth.co_applicant_name",
                                        title:"CO_APPLICANT",
                                        readonly:true,
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"transAuth.principal",
                                        title:"PRINCIPAL",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"transAuth.interest",
                                        title:"INTEREST",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                /*{
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4",
                                "items": [{
                                        key: "int_waived_off",
                                        title: "WAIVED",
                                        type: "checkbox",
                                        "fullwidth":true,
                                        schema: {
                                            default: false
                                        }
                                    }]
                                }*/]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"transAuth.penal_interest",
                                        title:"PENAL_INTEREST",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4",
                                "items": [{
                                        key: "p_int_waived_off",
                                        title: "WAIVED",
                                        type: "checkbox",
                                        "fullwidth":true,
                                        schema: {
                                            default: false
                                        }
                                    }]
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"transAuth.fee",
                                        title:"FEES_AND_OTHER_CHARGES",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4",
                                "items": [{
                                        key: "fee_waived_off",
                                        title: "WAIVED",
                                        type: "checkbox",
                                        "fullwidth":true,
                                        schema: {
                                            default: false
                                        }
                                    }]
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"transAuth.amountDue",
                                        title:"AMOUNT_DUE",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"transAuth.amountCollected",
                                        title:"AMOUNT_COLLECTED",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"transAuth.status",
                                        title:"",
                                        type:"radios",
                                        titleMap:{
                                            "1":"Approve",
                                            "2":"Reject"
                                        }
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        key:"transAuth.reject_reason",
                        title:"REJECT_REASON",
                        type:"select",
                        titleMap: [{
                            "name":"Amount not creditted in account",
                            "value":"1"
                        }],
                        condition:"model.status=='2'"
                    },
                    {
                        key:"transAuth.reject_remarks",
                        title:"REJECT_REMARKS",
                        readonly:false,
                        condition:"model.status=='2'"
                    }
                ]
            },
            {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
            }]
        }],
        schema: function() {
            return ManagementHelper.getVillageSchemaPromise();
        },
        actions: {
            generateFregCode:function(model,form){
                console.log(model);
                if(model.village.pincode>100000){
                    model.village.fregcode = Number(model.village.pincode+"001");
                }
                else {
                    model.village.fregcode="";
                }

            },
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                console.warn(model);
                LoanProcess.repay(model.repayment, function(response){
                    PageHelper.hideLoader();

                }, function(errorResponse){
                    PageHelper.hideLoader();
                    PageHelper.showErrors(errorResponse);
                });
            }
        }
    };
}]);
