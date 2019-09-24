define({
    pageUID: "loans.incomingPayment.IncomingPaymentQueue",
    pageType: "Engine",
    dependencies: ["$log", "SessionStore","irfNavigator", "$state", "formHelper", "$q", "irfProgressMessage", "PageHelper", "SurveyInformation","IncomingPayment"],
    $pageFn: function($log, SessionStore,irfNavigator, $state, formHelper, $q, irfProgressMessage, PageHelper, SurveyInformation,IncomingPayment) {

        return {
            "type": "search-list",
            "title": "INCOMING_PAYMENTS_SEARCH",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.branchId = SessionStore.getCurrentBranch().branchId;
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                $log.info("Incoming Payments Queue got initialized");
            },
            definition: {
                title: "INCOMING_PAYMENTS_SEARCH",
                searchForm: [
                {
                    "key":"customerName",
                },
                {
                    "key":"loanAccountNo",
                },
                {
                    "key":"transactionId",
                },
                {
                    "key":"status",
                },
                {
                    "key":"paymentsDate",
                },
                {
                    "key":"channel",
                },
                {
                    "key":"channelIntegrationId",
                },
                {
                    "key":"urn",
                },
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SearchOptions',
                    "properties": {
                        "customerName": {
                            "title": "CUSTOMER_NAME",
                            "type": "string"
                        },
                        "loanAccountNo": {
                            "title": "LOAN_ACCOUNT_NO",
                            "type": "string"
                        },
                        "transactionId": {
                            "title": "TRANSACTION_ID",
                            "type": "string"
                        },
                        "status": {
                            "title": "STATUS",
                            "type": ["string","null"],
                            "x-schema-form": {
                                "type": "select",
                                "titleMap": [{
                                    "name": "PENDING",
                                    "value": "PENDING"
                                },
                                {
                                    "name": "SUCCESS",
                                    "value": "SUCCESS"
                                },
                                {
                                    "name": "FAILED",
                                    "value": "FAILED"
                                }]
                            }
                        },
                        "paymentsDate": {
                            "title": "PAYMENT_DATE",
                            "type": "string",
                            "x-schema-form": {
                                "type": "date"
                            }
                        },
                        "channel": {
                            "title": "CHANNEL_TYPE",
                            "type": ["string","null"],
                            "x-schema-form": {
                                "type": "select",
                                "titleMap": [{
                                    "name": "RAZORPAY",
                                    "value": "RAZORPAY"
                                }]
                            }
                           
                        },
                        "channelIntegrationId": {
                            "title": "CHANNEL_REFRENCE_ID",
                            "type": "string"
                        },
                        "urn": {
                            "title": "URN",
                            "type": "string"
                        }
                    },
                    "required": []
                },
                
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) { 
                    var promise = IncomingPayment.IncomingPaymentSearch({
                        'customerName': searchOptions.customerName,
                        'loanAccountNo':searchOptions.loanAccountNo,
                        'transactionId': searchOptions.transactionId,
                        'status': searchOptions.status,
                        'paymentsDate':searchOptions.paymentsDate,
                        'channel': searchOptions.channel,
                        'channelIntegrationId': searchOptions.channelIntegrationId,
                        'page': pageOpts.pageNo,
                        'per_page': pageOpts.itemsPerPage,
                    }).$promise;

                    return promise;
                },
                paginationOptions: {
                    "getItemsPerPage": function(response, headers) {
                        return 10;
                    },
                    "getTotalItemsCount": function(response, headers) {
                        return headers['x-total-count']
                    }
                },
                listOptions: {
                    selectable: false,
                    expandable: true,
                    listStyle: "table",
                    itemCallback: function(item, index) {},
                    getItems: function(response, headers) {
                        if (response != null && response.length && response.length != 0) {
                            return response;
                        }
                        return [];
                    },
                    getListItem: function(item) {
                        return [
                            item.customerName,
                            item.urn,
                            item.amount,
                            item.paymentStatus,
                            item.paymentDate,
                            item.loanAccountNo,
                            item.channel,
                            item.channelIntegrationId
                        ]
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function() {
                        return [
                        {
                            title: 'CUSTOMER_NAME',
                            data: 'customerName'
                        },
                         {
                            title: 'URN',
                            data: 'urn'
                        },
                        {
                            title: 'AMOUNT',
                            data: 'amount'
                        },
                        {
                            title: 'STATUS',
                            data: 'paymentStatus'
                        }, {
                            title: 'PAYMENT_DATE',
                            data: 'paymentDate'
                        },
                        {
                            title: 'LOAN_ACCOUNT_NO',
                            data: 'loanAccountNo'
                        },
                        {
                            title: 'CHANNEL_TYPE',
                            data: 'channel'
                        },
                        {
                            title: 'CHANNEL_REFRENCE_ID',
                            data: 'channelIntegrationId'
                        }]                         
                    },
                    getActions: function() {
                        return [{
                            name: "VIEW_PAYMENTS",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                //entityManager.setModel('loans.incomingPayment.IncomingPaymentsDetails', {_disbursement:item});
                                $state.go("Page.Engine",{
                                    pageName:"loans.incomingPayment.IncomingPaymentsDetails",
                                    pageId: item.id
                                });
                            },
                            isApplicable: function(item, index) {

                                return true;
                            }
                        }];
                    }
                }
            }
        };
    }
})