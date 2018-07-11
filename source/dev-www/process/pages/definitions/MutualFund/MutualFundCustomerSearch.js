define({
	pageUID: "MutualFund.MutualFundCustomerSearch",
	pageType: "Engine",
	dependencies: ["$log", "formHelper", "Enrollment", "Queries", "$state", "SessionStore", "Utils", "PagesDefinition", "irfNavigator","PageHelper"],

	$pageFn: function($log, formHelper, Enrollment, Queries, $state, SessionStore, Utils, PagesDefinition, irfNavigator,PageHelper) {

		var branch = SessionStore.getBranch();
		return {
			"type": "search-list",
			"title": "MUTUAL_FUND_CUSTOMER_SEARCH",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.branch = SessionStore.getCurrentBranch().branchId;
				var bankName = SessionStore.getBankName();
				var banks = formHelper.enum('bank').data;
				for (var i = 0; i < banks.length; i++) {
					if (banks[i].name == bankName) {
						model.bankId = banks[i].value;
						model.bankName = banks[i].name;
						break;
					}
				}
				model.siteCode = SessionStore.getGlobalSetting("siteCode");
				var userRole = SessionStore.getUserRole();
				if (userRole && userRole.accessLevel && userRole.accessLevel === 5) {
					model.fullAccess = true;
				}
				PagesDefinition.getPageConfig('Page/Engine/CustomerSearch').then(function(data) {
					model.showBankFilter = data.showBankFilter ? data.showBankFilter : false;
				});
			},
			definition: {
				title: "Search Customers",
				searchForm: [{
					"type": "section",
					items: [{
						key: "first_name",
					}, {
						key: "lastName",
						condition: "model.siteCode != 'saija'"
					}, {
						key: "kyc_no",
					}, {
						key: "urnNo"
					}, {
						key: "bankId",
						readonly: true,
						condition: "model.showBankFilter && !model.fullAccess"
					}, {
						key: "bankId",
						condition: "model.showBankFilter && model.fullAccess"
					}, {
						key: "branch",
					}, {
						key: "centre",
					}]
				}],
				searchSchema: {
					"type": 'object',
					"title": 'SearchOptions',
					"properties": {
						"first_name": {
							"title": "CUSTOMER_NAME",
							"type": "string"
						},
						"lastName": {
							"title": "LASTNAME",
							"type": "string"
						},
						"kyc_no": {
							"title": "KYC_NO",
							"type": "string"
						},
						"urnNo": {
							"title": "URN_NO",
							"type": "number"
						},
						"bankId": {
							"title": "BANK_NAME",
							"type": ["integer", "null"],
							enumCode: "bank",
							"x-schema-form": {
								"type": "select",
								"screenFilter": true,

							}
						},
						"branch": {
							"title": "BRANCH_NAME",
							"type": ["integer", "null"],
							"enumCode": "branch_id",
							"parentEnumCode": "bank",
							"parentValueExpr": "model.bankId",
							"x-schema-form": {
								"type": "select",
								"screenFilter": true,
							}
						},
						"centre": {
							"title": "CENTRE",
							"type": ["integer", "null"],
							"enumCode": "centre",
							"x-schema-form": {
								"type": "select",
								"parentEnumCode": "branch_id",
								"parentValueExpr": "model.branch",
								"screenFilter": true
							}
						}

					},
					"required": ["branch", 'bankId']
				},
				getSearchFormHelper: function() {
					return formHelper;
				},
				getResultsPromise: function(searchOptions, pageOpts) { /* Should return the Promise */

					/* GET BRANCH NAME */
					var branches = formHelper.enum('branch').data;
					var branchName = null;
					for (var i = 0; i < branches.length; i++) {
						var branch = branches[i];
						if (branch.code == searchOptions.branch) {
							branchName = branch.name;
						}
					}

					var promise = Enrollment.search({
						'bankId': searchOptions.bankId,
						'branchName': branchName,
						'firstName': searchOptions.first_name,
						'centreId': searchOptions.centre,
						'page': pageOpts.pageNo,
						'per_page': pageOpts.itemsPerPage,
						'kycNumber': searchOptions.kyc_no,
						'lastName': searchOptions.lastName,
						'urnNo': searchOptions.urnNo,
						'stage': "Completed",
						'customerType': "Individual"
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
							Utils.getFullName(item.firstName, item.middleName, item.lastName),
							'Customer ID : ' + item.id,
							item.urnNo ? ('URN : ' + item.urnNo) : ("{{'CURRENT_STAGE'|translate}} : " + (item.currentStage === 'Stage02' ? 'House verification' :
								(item.currentStage === 'Stage01' ? 'Enrollment' : item.currentStage))),
							"{{'BRANCH'|translate}} : " + item.kgfsName,
							"{{'CENTRE_CODE'|translate}} : " + item.centreId,
							"{{'FATHERS_NAME'|translate}} : " + Utils.getFullName(item.fatherFirstName, item.fatherMiddleName, item.fatherLastName)
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
							title: 'NAME',
							data: 'firstName'
						}, {
							title: 'URN_NO',
							data: 'urnNo'
							// type: 'html',
						}, /*{
							title: 'CURRENT_STAGE',
							data: 'currentStage'
						},*/ {
							title: 'BRANCH',
							data: 'kgfsName'
						}, {
							title: 'CENTRE',
							data: 'centreId'
						}, {
							title: 'FATHER_NAME',
							data: 'fatherFirstName'
						}]
					},
					getActions: function() {
						return [
						{
							name: "EKYC",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, model) {
								 irfNavigator.go({
                                    state: "Page.Adhoc",

                                    pageName: "MutualFund.MutualFundEKYC",
                                    pageId: item.id,
                                }
                                );
							},

							isApplicable: function(item, model) {
								if (item.currentStage === 'Completed')
									return true;
								return false;
							}
						},
						{
							name: "FIRST_PURCHASE",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, model) {
								 irfNavigator.go({								 	
                                    state: "Page.Engine", 
                                    pageName: "MutualFund.MutualFundApplication",
                                    pageId: item.id,
                                });
							},

							isApplicable: function(item, model) {
								if (item.currentStage === 'Completed')
									return true;
								return false;
								
							}
						},
						{	name: "ADDITIONAL_PURCHASE",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, model) {
								 irfNavigator.go({
                                    state: "Page.Engine", 
                                    pageName: "MutualFund.MutualFundTransaction",
                                    pageData: {type: "additional"},
                                    pageId: item.id,
                                });
							},

							isApplicable: function(item, model) {
								if (item.currentStage === 'Completed')
									return true;
								return false;
							}
						},
						
						
						{	name: "REDEMPTION",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, model) {
								 irfNavigator.go({
                                    state: "Page.Engine", 
                                    pageName: "MutualFund.MutualFundTransaction",
                                    pageData: {type: "redemption"},
                                    pageId: item.id,
                                });
							},



							isApplicable: function(item, model) {
								if (item.currentStage === 'Completed')
									return true;
								return false;
							}
						},

						/*{	name: "MUTUALFUND_UPLOAD_FEED",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, model) {
								 irfNavigator.go({
                                    state: "Page.Engine", 
                                    pageName: "MutualFund.MutualFundUploadFeed",
                                    pageData: {type: "Page.Engine"},
                                    pageId: item.id,
                                });
							},

							

							isApplicable: function(item, model) {
								if (item.currentStage === 'Completed')
									return true;
								return false;
							}
						},
*/
						{	name: "SUMMARY",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, model) {
								 irfNavigator.go({
                                    state: "Page.Engine", 
                                    pageName: "MutualFund.MutualFundSummary",
                                    pageData: {type: "summary"},
                                    pageId: item.id,
                                });
							},

							

							isApplicable: function(item, model) {
								if (item.currentStage === 'Completed')
									return true;
								return false;
							}
						}

						/*{	name: "DOWNLOAD_FEED",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, model) {
								 irfNavigator.go({
                                    state: "Page.Engine", 
                                    pageName: "MutualFund.MutualFundDownloadFeed",
                                   // pageData: {type: "Page.Engine"},
                                    pageId: item.id,
                                });
							},

							

							isApplicable: function(item, model) {
								if (item.currentStage === 'Completed')
									return true;
								return false;
							}
						}
*/



						];
					}
				}
			}
		};
	}
})