define({
    pageUID: "payment.paymentRejected",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "$state", "$q", "SessionStore", "Utils", "entityManager", "Payment", "LoanBookingCommons"],
    $pageFn: function($log, formHelper, $state, $q, SessionStore, Utils, entityManager, Payment, LoanBookingCommons) {
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
            "title": "PAYMENT_REJECTED_SEARCH",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.branch = branch;
                $log.info("search-list sample got initialized");
                var centres = SessionStore.getCentres();
                if (_.isArray(centres) && centres.length > 0) {
                    model.centre = centres[0].centreName;
                    model.centreCode = centres[0].centreCode;
                }
            },
            definition: {
                title: "SEARCH",
                searchForm: [
                    "*"
                ],
                autoSearch: true,
                searchSchema: {
                    "type": 'object',
                    "title": 'SEARCH_OPTIONS',
                    "properties": {
                        "debitAccountName": {
                            "title": "DEBIT_ACCOUNT_NAME",
                            "type": "string",
                            "x-schema-form": {
                                type: "lov",
                                autolov: true,
                                bindMap: {},
                                searchHelper: formHelper,
                                lovonly: true,
                                search: function(inputModel, form, model, context) {
                                    var centres = SessionStore.getCentres();
                                    var centreCode = formHelper.enum('centre').data;
                                    var out = [];
                                    if (centres && centres.length) {
                                        for (var i = 0; i < centreCode.length; i++) {
                                            for (var j = 0; j < centres.length; j++) {
                                                if (centreCode[i].value == centres[j].id) {
                                                    out.push({
                                                        name: centreCode[i].name,
                                                        value: centreCode[i].code
                                                    })
                                                }
                                            }
                                        }
                                    }
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.centre = valueObj.name;
                                    model.centreCode = valueObj.value;
                                },
                                getListDisplayItem: function(item, index) {

                                }
                            }
                        },
                        "paymentDate": {
                            "title": "PAYMENT_DATE",
							"type": "string",
							"x-schema-form": {
								"type": "date"
							}
                        },
                        "branchName": {
                            "title": "BRANCH_NAME",
                            "type": "string"
                        },
                        "spokeName": {
                            "title": "SPOKE_NAME",
                            "type": "string"
                        },
                        "beneficiaryName": {
                            "title": "BENEFICIARY_NAME",
                            "type": "string"
                        },
                        "paymentType": {
                            "type": "string",
                            "title": "PAYMENT_TYPE",
                            "x-schema-form": {
                                "type": "select",
                                "enumCode":"payment_type"
                                
                            }
                        },
                        "paymentMode": {
                            "type": "string",
                            "title": "PAYMENT_MODE",
                            "x-schema-form": {
                                "type": "select",
                                "enumCode":"mode_of_payment"
                            }
                        },
                        "paymentPurpose": {
                            "type": "string",
                            "title": "PAYMENT_PURPOSE",
                            "x-schema-form": {
                                "type": "select",
                                "enumCode":"payment_purpose"
                            }
                        },
                    },
                    "required": []
                },
                getSearchFormHelper: function() {
                    return formHelper;
                },
                getResultsPromise: function(searchOptions, pageOpts) {
                    return Payment.search({
						'paymentDate': searchOptions.paymentDate,
						'transactionType': searchOptions.transactionType,
						'modeOfPayment': searchOptions.modeOfPayment,
						'beneficiaryBankBranch': searchOptions.beneficiaryBankBranch,
						'debitAccountName': searchOptions.debitAccountName,
						'paymentPurpose': searchOptions.paymentPurpose,
                        'beneficiaryName': searchOptions.beneficiaryName,
                        'currentStage':"PaymentRejected",
                    }).$promise;
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
                            item.paymentDate,
                            item.beneficiaryBankBranch,
                            item.transactionType,
                            item.transactionType,
                            item.modeOfPayment,
                            item.paymentPurpose,
                            item.debitAccountName,
                            item.beneficiaryName,
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
                        return [{
                            title: 'PAYMENT_DATE',
                            data: 'paymentDate'
                        }, {
                            title: 'BRANCH',
                            data: 'beneficiaryBankBranch'
                        }, {
                            title: 'SPOKE',
                            data: 'transactionType'
                        }, {
                            title: 'PAYMENT_TYPE',
                            data: 'transactionType'
                        }, {
                            title: 'PAYMENT_MODE',
                            data: 'modeOfPayment'
                        }, {
                            title: 'PAYMENT_PURPOSE',
                            data: 'paymentPurpose'
                        }, {
                            title: 'DEBIT_ACCOUNT_NAME',
                            data: 'debitAccountName'
                        }, {
                            title: 'BENEFICIARY_NAME',
                            data: 'beneficiaryName'
                        }]
                    },
					getActions: function() {
						return [{
							name: "VIEW_DETAILS",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								$state.go("Page.Engine", {
									pageName: "payment.PaymentRejectedQueue",
									pageId: item.id
								});
							},
							isApplicable: function(item, index) {

								return true;
							}
						},{
							name: "PAYMENT_REINITIATION",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								$state.go("Page.Engine", {
									pageName: "payment.PaymentInitiation",
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
});
