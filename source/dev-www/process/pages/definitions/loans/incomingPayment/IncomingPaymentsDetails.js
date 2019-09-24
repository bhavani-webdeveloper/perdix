
define({
    pageUID: "loans.incomingPayment.IncomingPaymentsDetails",
    pageType: "Engine",
    dependencies: ["$log", "SessionStore", "$state", "$stateParams", "Lead", "irfNavigator", "Utils","formHelper","IncomingPayment","PageHelper"],

    $pageFn: function($log, SessionStore, $state, $stateParams, Lead, irfNavigator, Utils,formHelper,IncomingPayment,PageHelper) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "INCOMING_PAYMENTS_DETAILS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("IncomingPaymentsDetails  Page got initialized");
                console.log("loans.incomingPayment.IncomingPaymentsDetails");
                var incomingPaymentsId = $stateParams['pageId'];
                $log.info("incomingPaymentsId ::" + incomingPaymentsId);
                PageHelper.showLoader();
                PageHelper.showProgress('loan-fetch', 'Fetching Loan Details');
                model.incomingPayments= model.incomingPayments||{};
                
                IncomingPayment.get({
                    id: incomingPaymentsId
                }, function(response, headersGetter) {
                    model.incomingPayments= response.incomingPayments;
                    model.paymentGatewayIntegration= response.paymentGatewayIntegration;
                    console.log(model.incomingPayments.id);
                    PageHelper.hideLoader();
                }, function(resp) {
                    PageHelper.hideLoader();
                });


            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {},
            form: [
                {
                    "type": "box",
                    "title": "INCOMING_PAYMENTS_DETAILS",
                    "items": [
                        {
                            "key": "incomingPayments.loanAccountNo",
                            "required":true,
                            "title": "LOAN_ACCOUNT",
                            "readonly":true
                        },
                        {
                            "key": "incomingPayments.customerId",
                            "required":true,
                            "title": "CUSTOMER_ID",
                            "readonly":true
                        },
                        // {
                        //     key: "incomingPayments.customerId",
                        //     type: "button",
                        //     title: "VIEW_CUSTOMER",
                        //     onClick: "actions.viewCustomer(model, formCtrl, form, $event)"
                        // },
                        {
                            "key": "paymentGatewayIntegration.amount",
                            "title": "AMOUNT",
                            "readonly":true
                        },
                        {
                            "key": "incomingPayments.paymentDate",
                            "required":true,
                            "title": "PAYMENT_DATE",
                            "readonly":true
                        },
                        {
                            "key": "incomingPayments.channel",
                            "required":true,
                            "title": "CHANNEL",
                            "readonly":true
                        },
                        {
                            "key": "incomingPayments.channelIntegrationId",
                            "required":true,
                            "title": "CHANNEL_INTEGRATION_ID",
                            "readonly":true
                        },
                        {
                            "key": "incomingPayments.transactionId",
                            "required":true,
                            "title": "TRANSACTION_ID",
                            "readonly":true
                        },
                        {
                            "key": "incomingPayments.paymentStatus",
                            "required":true,
                            "title": "PAYMENT_STATUS",
                            "readonly":true
                        },
                        {
                            "key": "incomingPayments.repaymentStatus",
                            "required":true,
                            "title": "REPAYMENT_STATUS",
                            "readonly":true
                        },
                        {
                            "key": "incomingPayments.repaymentId",
                            "required":true,
                            "title": "REPAYMENT_ID",
                            "readonly":true
                        },
                        {
                            "key": "incomingPayments.repaymentType",
                            "required":true,
                            "title": "REPAYMENT_TYPE",
                            "readonly":true
                        }
                    ]
                },
                {
                    "type": "box",
                    "title": "ADDITIONAL_DETAILS",
                    "items": [
                        {
                            "key": "paymentGatewayIntegration.orderId",
                            "required":true,
                            "title": "ORDER_ID",
                            "readonly":true
                        },
                        {
                            "key": "paymentGatewayIntegration.amount",
                            "title": "AMOUNT",
                            "readonly":true
                        },
                        {
                            "key": "paymentGatewayIntegration.currency",
                            "title": "CURRENCY",
                            "readonly":true
                        },{
                            "key": "paymentGatewayIntegration.receipt",
                            "title": "RECEIPT",
                            "readonly":true
                        },
                        {
                            "key": "paymentGatewayIntegration.paymentId",
                            "title": "PAYMENT_ID",
                            "readonly":true
                        },{
                            "key": "paymentGatewayIntegration.status",
                            "title": "PAYMENT_STATUS",
                            "readonly":true
                        },{
                            "key": "paymentGatewayIntegration.paymentMethod",
                            "title": "PAYMENT_METHOD",
                            "readonly":true
                        },{
                            "key": "paymentGatewayIntegration.fee",
                            "title": "FEE",
                            "readonly":true
                        },
                        {
                            "key": "paymentGatewayIntegration.tax",
                            "title": "TAX",
                            "readonly":true
                        },
                        {
                            "key": "paymentGatewayIntegration.errorCode",
                            "title": "ERROR_CODE",
                            "readonly":true
                        },{
                            "key": "paymentGatewayIntegration.errorDescription",
                            "title": "ERROR_DESCRIPTION",
                            "readonly":true
                        }]
                },
                {
                    "type": "box",
                    "title": "REFUND_DETAILS",
                    "condition" : "model.paymentGatewayIntegration.refundStatus",
                    "items": [{
                        "key": "paymentGatewayIntegration.refundStatus",
                        "title": "REFUND_STATUS",
                        "readonly":true
                    }]
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "button",
                        "title": "BACK",
                        onClick: "actions.back()"
                    }]
                }
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "sample_info": {
                        "type": "object",
                        "properties": {}
                    }
                }
            },
            actions: {
                back : function(){
                    //PageHelper.showProgress('update-loan', 'Done', 2000);
                    // $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue'});
                    irfNavigator.goBack();
                },
                submit: function(model, form, formName) {

                },
                viewCustomer: function(model, formCtrl, form, $event) {
                    $state.go("Page.Engine",{
                        pageName:"customer.IndividualEnrollment",
                        pageId:model.incomingPayments.customerId
                    });
                },
                proceed: function(model, formCtrl, form, $event) {}
            }
        };
    }
})
