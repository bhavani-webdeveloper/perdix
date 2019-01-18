irf.pageCollection.factory(irf.page("loans.individual.luc.LucReviewQueue"), 
["$log", "formHelper", "LUC", "$state", "SessionStore", "Utils","irfNavigator",
	function($log, formHelper, LUC, $state, SessionStore, Utils,irfNavigator) {

		return {
			"type": "search-list",
			"title": "LUC_REVIEW_QUEUE",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				$log.info("luc Review Queue got initialized");
				model.siteCode = SessionStore.getGlobalSetting("siteCode");
			},
			definition: {
				title: "SEARCH LUC",
				searchForm: [
					"*"
				],
				autoSearch: true,
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"applicantName": {
							"title": "APPLICANT_NAME",
							"type": "string"
						},
						"businessName": {
							"title": "BUSINESS_NAME",
							"type": "number"
						},
						"lucRescheduledDate": {
							"title": "LUC_RESCHEDULED_DATE",
							"type": "string",
							"x-schema-form": {
								"type": "date"
							}
						},
						"accountNumber": {
							"title": "LOAN_ACCOUNT_NUMBER",
							"type": "number"
						},
					},
					"required": []
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) {
					var branch = SessionStore.getCurrentBranch();
					var centres = SessionStore.getCentres();
					var centreId = [];
					if (centres && centres.length) {
						for (var i = 0; i < centres.length; i++) {
							centreId.push(centres[i].id);
						}
					}

					var promise = LUC.search({
						'accountNumber': searchOptions.accountNumber,
						'currentStage': "LUCReview",
						'centreId': centreId[0],
						'branchName': branch.branchName,
						'monitoringType':"LUC",
						'lucRescheduledDate': searchOptions.lucRescheduledDate,
						'page': pageOpts.pageNo,
						'per_page': pageOpts.itemsPerPage,
						'applicantName': searchOptions.applicantName,
						'bussinessName': searchOptions.businessName,
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
							item.applicantName,
							item.businessName,
							item.accountNumber,
							item.loanId,
							item.disbursementDate,
							item.lucDate
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
							title: 'Applicant Name',
							data: 'customerName'
						}, {
							title: 'Business Name',
							data: 'bussinessName'
						}, {
							title: 'Account Number',
							data: 'accountNumber'
						}, {
							title: 'Loan Id',
							data: 'loanId'
						}, {
							title: 'Disbursement Date',
							data: 'disbursementDate',
							render: function(data, type, full, meta) {
								return (moment(data).format("DD-MM-YYYY"));
							}
						}, {
							title: 'LUC Date',
							data: 'lucDate',
							render: function(data, type, full, meta) {
								return (moment(data).format("DD-MM-YYYY"));
							}
						} ]
					},
					getActions: function() {
						return [{
							name: "Capture LUC Data",
							desc: "",
							icon: "fa fa-pencil-square-o",
							fn: function(item, index) {
								$state.go("Page.Engine", {
									pageName: "loans.individual.luc.LucData",
									pageId: item.id
								});
							},
							isApplicable: function(item, model) {
                                return (model.siteCode != "KGFS");
                            }
                        },{
                            name: "Capture LUC Data",
                            desc: "",
                            icon: "fa fa-pencil-square-o",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Engine", 
                                    pageName: "loans.individual.luc.LucVerification",
                                    pageId: item.id,
                                    pageData: {_lucCompleted : true}
                                });
                            },
                            isApplicable: function(item, model) {
                                return (model.siteCode == "KGFS");
                            }
                        }];
					}
				}
			}
		};
	}
]);