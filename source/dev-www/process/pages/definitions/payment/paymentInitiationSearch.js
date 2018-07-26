define({
    pageUID: "payment.paymentInitiationSearch",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager", "Payment", "LoanBookingCommons", "Queries"],
    $pageFn: function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, Payment, LoanBookingCommons, Queries) {
        var branch = SessionStore.getBranch();
        var centres = SessionStore.getCentres();
        var centreId = [];
        if (centres && centres.length) {
            for (var i = 0; i < centres.length; i++) {
                centreId.push(centres[i].centreId);
            }
        }
        return {
            "type": "search-list",
            "title": "PAYMENT_INITIATION_SEARCH",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.branch = branch;
                model.modeOfPayment = 'Manual';
                $log.info("search-list sample got initialized");
                var centres = SessionStore.getCentres();
                if (_.isArray(centres) && centres.length > 0) {
                    model.centre = centres[0].centreName;
                    model.centreCode = centres[0].centreCode;
                }
            },
            definition: {
                title: "PAYMENT_INITIATION_SEARCH",
                searchForm: [
                    {
                        "type": "section",
                        items: [
                            { 
                            key: "paymentDate", 
                            title: "PAYMENT_DATE",
                            type:"date"
                            },
                            { 
                            key: "paymentId", 
                            title: "PAYMENT_ID",
                            },
                            { 
                            key: "debitAccountName", 
                            title: "DEBIT_ACCOUNT_NAME",
                            type:"lov",
                            lovonly:true,
                            searchHelper: formHelper,
                                search: function(inputModel, form, model) {
									return Queries.getBankAccounts();
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                    					item.bank_name,
                    					item.branch_name,
                    					item.account_number
                                    ];
                                },
                                onSelect: function(result, model, context) {									
                                    model.debitAccountName = result.bank_name
                                }							
                            },
                            { 
                            key: "transactionType", 
                            title: "PAYMENT_TYPE",
                            type:"select",
                            enumCode:"payment_type"
                            },
                            { 
                            key: "modeOfPayment", 
                            title: "PAYMENT_MODE",
                            type:"select",
                            enumCode:"mode_of_payment"
                            }, 
                            { 
                            key: "paymentPurpose", 
                            title: "PAYMENT_PURPOSE",
                            type:"select",
                            enumCode:"payment_purpose"
                            },
                            { 
                            key: "beneficiaryName", 
                            title: "BENEFICIARY_NAME",
                            },

                        ]
                    }
				],
				autoSearch: true,
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"paymentDate": {
							"title": "PAYMENT_DATE",
							"type": "string",
						},
						"paymentId": {
							"title": "PAYMENT_ID",
							"type": "string"
						},
						"debitAccountName": {
							"title": "DEBIT_ACCOUNT_NAME",							
                            "type": "string"							
						},
						"modeOfPayment": {
							"title": "PAYMENT_TYPE",
							"type": ["string", "null"]
						},
						"transactionType": {
							"title": "PAYMENT_MODE",
							"type": ["string", "null"]
						},
						"paymentPurpose": {
							"title": "PAYMENT_PURPOSE",
							"type": ["string", "null"]
						},
						"beneficiaryName": {
							"title": "BENEFICIARY_NAME",
							"type": "string"
						}
					}
				},

                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                   
                    var promise = Payment.search({
                        'paymentDate': searchOptions.paymentDate,
                        'paymentId': searchOptions.paymentId,
			'debitAccountName': searchOptions.debitAccountName,
			'paymentMode': searchOptions.transactionType,
                        'paymentType': searchOptions.modeOfPayment,						
			'paymentPurpose': searchOptions.paymentPurpose,
			'beneficiaryName': searchOptions.beneficiaryName,
                        'currentStage':"PaymentInitiation",
                    }).$promise;

                   
                    return promise;
                        
                },
                paginationOptions: {
                    "getItemsPerPage": function(response, headers) {
                        return 100;
                    },
                    "getTotalItemsCount": function(response, headers) {
                        return headers['x-total-count']
                    }
                },
                listOptions: {
                    selectable: true,
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
                        return [item.id, item.debitAccountName, item.transactionType, item.paymentDate, item.modeOfPayment, item.paymentPurpose, item.beneficiaryName];
                    },
                    getTableConfig: function() {
                        return {
                            "serverPaginate": true,
                            "paginate": true,
                            "pageLength": 10
                        };
                    },
                    getColumns: function() {
                        return [{   
                            title: 'PAYMENT_ID',
                            data: 'id'
                        }, {
                            title: 'DEBIT_ACCOUNT_NAME',
                            data: 'debitAccountName'
                        },{
                            title: 'PAYMENT_TYPE',
                            data: 'modeOfPayment'
                        }, {
                            title: 'PAYMENT_MODE',
                            data: 'transactionType'
                        }, {
                            title: 'PAYMENT_DATE',
                            data: 'paymentDate'
                        }, {
                            title: 'BENEFICIARY_NAME',
                            data: 'beneficiaryName'
                        }, {
                            title: 'PAYMENT_PURPOSE',
                            data: 'paymentPurpose'
                        },];
                    },
                    getActions: function() {
                        return [{
                            name: "EDIT_PAYMENT_INITIATION",
                            desc: "",
                            icon: "fa fa-user",
                            fn: function(item, index){
                                $state.go("Page.Engine", {
                                    pageName: "payment.PaymentInitiation",
                                    pageId: item.id,
                                    pageData: item
                                });
                            },
                            isApplicable: function(item, index){
                                    return true;
                            }
                        }];
                    }
                }
            }
        };
    }
});
