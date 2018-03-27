define([], function() {
	return {
		pageUID: "lender.liabilities.LiabilitiesSearch",
		pageType: "Engine",
		dependencies: ["$log", "formHelper", "LiabilityAccountProcess","Queries","$state", "SessionStore", "Utils", "PagesDefinition", "irfNavigator"],
		$pageFn: function($log, formHelper, LiabilityAccountProcess,Queries,$state, SessionStore, Utils, PagesDefinition, irfNavigator) {
			return {
				"type": "search-list",
				"title": "LIABILITY_SEARCH",
				"subTitle": "",
				initialize: function (model, form, formCtrl) {
					model.branch = SessionStore.getCurrentBranch().branchId;
					//"irf-elements": "svn+http://svn.perdix.co/svn/perdix/irf-common-elements#trunk",
					var bankName = SessionStore.getBankName();
					var banks = formHelper.enum('bank').data;
					for (var i = 0; i < banks.length; i++){
						if(banks[i].name == bankName){
							model.bankId = banks[i].value;
							model.bankName = banks[i].name;
							break;
						}
					}
					model.siteCode = SessionStore.getGlobalSetting("siteCode");
					$log.info("siteCode:" + model.siteCode);
					var userRole = SessionStore.getUserRole();
					if(userRole && userRole.accessLevel && userRole.accessLevel === 5){
						model.fullAccess = true;
					}
					PagesDefinition.getPageConfig('Page/Engine/CustomerSearch').then(function(data){
						model.showBankFilter = data.showBankFilter ? data.showBankFilter : false;
						setTimeout(function(){formCtrl.submit();}, 0);	
						$log.info("search-list sample got initialized");
					});
				},
				definition: {
					title: "Search Customers",
					searchForm: [
						{
		                	"type": "section",
		                	items: [
			                	{
			                		key: "lenderId"
			                	},
			                	{
			                		key: "lenderAccountNumber" 
			                	},
			                	{
			                		key: "status"
			                	}
		                	]
		                }
					],
					searchSchema: {
						"type": 'object',
						"title": 'SearchOptions',
						"properties": {
							"lenderId": {
								"title": "LENDER_ID",
								"type": "number"
							},
							"lenderAccountNumber": {
								"title": "LENDER_ACCOUNT_NUMBER",
								"type": "number"
							},
							"status": {
								"title": "STATUS",
								"type": "string"
							}
						}
					},
					getSearchFormHelper: function() {
						return formHelper;
					},
					getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */
						var promise = LiabilityAccountProcess.search({
							'lenderId': searchOptions.lenderId
						}).$promise;

						return promise;
					},
					paginationOptions: {
						"getItemsPerPage": function(response, headers){
							return 100;
						},
						"getTotalItemsCount": function(response, headers){
							return headers['x-total-count']
						}
					},
					listOptions: {
						selectable: false,
						expandable: true,
						listStyle: "table",
						itemCallback: function(item, index) {
						},
						getItems: function(response, headers){
							if (response!=null && response.length && response.length!=0){
								return response;
							}
							return [];
						},
						getListItem: function(item){
							return [
								Utils.getFullName(item.firstName, item.middleName, item.lastName),
								'Customer ID : ' + item.id,
								item.urnNo?('URN : ' + item.urnNo):("{{'CURRENT_STAGE'|translate}} : " + (item.currentStage==='Stage02'?'House verification':
									(item.currentStage==='Stage01'?'Enrollment':item.currentStage))),
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
						getColumns: function(){
							return [
								{
									title:'LENDER_ID',
									data: 'lenderId'
								},
								{
									title:'LENDER_NAME',	
									data: 'lenderId'
								},
								{
									title:'PRODUCT_TYPE',
									data: 'productType'
								},
								{
									title:'LOAN_AMOUNT',
									data: 'loanAmount'
								}
							]
						},
						getActions: function(){
							return [
								{
									name: "Enroll Customer",
									desc: "",
									icon: "fa fa-user-plus",
									fn: function(item, model){
										$state.go("Page.Engine",{
											pageName:"lender.enrolment.Registration",
											pageId:item.id
										});
									},
									isApplicable: function(item, model){
										if (item.currentStage==='BasicEnrolment' )
											return true;
										return false;
									}
								}
							];
						}
					}
				}
			};
		}
	}
})