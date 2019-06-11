    define({
    pageUID: "kgfs.loans.individual.screening.DscOverrideQueue",
    pageType: "Engine",
    dependencies: ["$log", "irfNavigator", "formHelper", "entityManager", "IndividualLoan", "$state", "SessionStore", "Utils"],
    $pageFn: function ($log, irfNavigator, formHelper, EntityManager, IndividualLoan, $state, SessionStore, Utils) {
        var branch = SessionStore.getBranch();
        return {
            "type": "search-list",
            "title": "DSC_OVERRIDE_SEARCH",
            "subTitle": "",

            initialize: function(model, form, formCtrl) {
				model.branchId = SessionStore.getCurrentBranch().branchId;
				var bankName = SessionStore.getBankName();
				var banks = formHelper.enum('bank').data;
				for (var i = 0; i < banks.length; i++){
					if(banks[i].name == bankName){
						model.bankId = banks[i].value;
						model.bankName = banks[i].name;
					}
				}
				var userRole = SessionStore.getUserRole();
				if(userRole && userRole.accessLevel && userRole.accessLevel === 5){
					model.fullAccess = true;
				}
				model.partner = "AXIS";
				model.isPartnerChangeAllowed = false;
				$log.info("Checker1 Queue got initialized");
			},
               
            definition: {
                title: "SEARCH_LOANS",
                autoSearch: true,
                searchForm: [{
					"type": "section",
					"items": [ 
					{
						"key": "bankId",
						"type": "select",
					}, {
						"key": "branchId",
						"type": "select",
						"parentEnumCode": "bank",
						"parentValueExpr": "model.bankId",
                    },
                    {
						"key": "centre",
                        "type": "select",
                        "parentEnumCode": "branch_id",
                        "parentValueExpr": "model.branchId",
					},
                    {
						"key": "customerUrnNo",
						"type": "number"
                    }, 
                ]
				}],
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"bankId": {
							"title": "BANK_NAME",
							"type": ["integer", "null"],
							enumCode: "bank"
						},
						"branchId": {
							"title": "BRANCH_NAME",
							"type": ["integer", "null"],
							"enumCode": "branch_id"
                        },
                        "centre":{
                            "title": "CENTRE",
                            "type": ["integer", "null"],
                            "enumCode": "centre",
                        },
                        "customerUrnNo": {
                            "title": "CUSTOMER_URN_NO",
                            "type": "number"
                        }
					}},

                getSearchFormHelper: function () {
                    return formHelper;
                },

                getResultsPromise: function (searchOptions, pageOpts) {
                    var promise = IndividualLoan.search({
                        'stage': 'DSCOverride',
                        'bankId': searchOptions.bankId,
                        'branchId': searchOptions.branchId,
                        'centre': searchOptions.centre,
                        'urn': searchOptions.customerUrnNo,
                        'accountNumber': searchOptions.accountNumber,
                        'page': pageOpts.pageNo
                    }).$promise;
                    return promise;
                },

                paginationOptions: {
                    "getItemsPerPage": function (response, headers) {
                        return 20;
                    },
                    "getTotalItemsCount": function (response, headers) {
                        return headers['x-total-count']
                    }
                },

                listOptions: {
                    expandable: true,
                    listStyle: "table",
                    itemCallback: function (item, index) {},
                    getItems: function (response, headers) {
                        if (response != null && response.length && response.length != 0) {
                            return response;
                        }
                        return [];
                    },
                    getListItem: function (item) {
                        return [

                            "{{'ENTITY_NAME'|translate}} : " + item.customerName,
                             "{{'CENTRE_NAME'|translate}} : " + item.centreName,
                            "{{'URN_NO'|translate}} : " + item.urn,
                            "{{'LOAN_AMOUNT'|translate}} : " + item.loanAmount,
                            "{{'LOAN_TYPE'|translate}} : " + item.loanType,
                            "{{'PARTNER_CODE'|translate}} : " + item.partnerCode,
                            "{{'PROCESS_TYPE'|translate}} : " + item.processType

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
							title: 'LOAN_ID',
							data: 'id'
                        }, {
							title: 'URN_NO',
							data: 'urn'
                        }, 
                        {
                            title: 'CUSTOMER_NAME',
                            data: 'applicantName'
                        }, 
                        {
                            title: 'CENTRE_NAME',
                            data: 'centreName'
                        }, {
							title: 'LOAN_AMOUNT',
							data: 'loanAmount'
                        },{
							title: 'LOAN_TYPE',
							data: 'loanType'
                        },
                        {
							title: 'PARTNER_CODE',
							data: 'partnerCode'
                        },
                    ]
					},
                    getActions: function () {
                        return [
                        {
                            name: "Do DSC Override",
                            desc: "",
                            icon: "fa fa-book",
                            fn: function (item, index) {
                                irfNavigator.go({
                                    'state': 'Page.Bundle',
                                    'pageName': 'kgfs.loans.individual.screening.DscOverride',
                                    'pageId': item.loanId,
                                    'pageData': item
                                },{
                                    state: 'Page.Engine',
                                    pageName: "kgfs.loans.individual.screening.DscOverrideQueue"
                                });
                            },
                            isApplicable: function (item, model) {
                                return true;
                            }
                        }];
                    }
                }
            }
        };
    }

})
