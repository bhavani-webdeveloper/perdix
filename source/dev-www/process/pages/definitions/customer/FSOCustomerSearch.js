irf.pageCollection.factory(irf.page("FSOCustomerSearch"),
["$log", "formHelper", "filterFilter", "Enrollment","Queries","$state", "SessionStore", "Utils", "PagesDefinition", "irfNavigator",
function($log, formHelper, filterFilter , Enrollment,Queries,$state, SessionStore, Utils, PagesDefinition, irfNavigator){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "FSO_CUSTOMER_SEARCH",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branch = SessionStore.getCurrentBranch().branchId;
			// var branch = SessionStore.getCurrentBranch();
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
			PagesDefinition.getPageConfig('Page/Engine/FSOCustomerSearch').then(function(data){
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
                		key: "first_name", 
                	},
                	{
                		key: "lastName",
                		condition: "model.siteCode != 'saija'"
                	},
                	{
                		key: "kyc_no", 
                	},
                	{
                		key: "urnNo"
                	},
                	{
                		key: "bankId",
                		readonly: true, 
                		condition: "model.showBankFilter && !model.fullAccess && model.siteCode.toLowerCase()=='kgfs'"
                	},
                	{
                		key: "bankId",
                		condition: "model.showBankFilter && model.fullAccess"
                	},
                	{
                		key: "branch", 
                		readonly: true, 
                	},
                	{
                		key: "centre", 
                	}
                	]
                }
			],
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
						"type": "string"
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
				"required":["branch", 'bankId']
			},
			getSearchFormHelper: function() {
				return formHelper;
			},
			getResultsPromise: function(searchOptions, pageOpts){      /* Should return the Promise */

				/* GET BRANCH NAME */
				var branches = formHelper.enum('branch').data;
				var branchName = null;
				for (var i=0;i<branches.length; i++){
					var branch = branches[i];
					 if (branch.code == searchOptions.branch){
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
					'urnNo': searchOptions.urnNo
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
					var centres = formHelper.enum('centre').data;
					return [
						{
							title:'NAME',
							data: 'firstName',
							render: function(data, type, full, meta) {
								return (full.customerType==='Individual'?'<i class="fa fa-user">&nbsp;</i> ':'<i class="fa fa-industry"></i> ') + data;
							}
						},
						{
							title:'URN_NO',
							data: 'urnNo'
							// type: 'html',
						},
						{
							title:'CURRENT_STAGE',	
							data: 'currentStage'
						},
						{
							title:'BRANCH',
							data: 'kgfsName'
						},
						{
							title:'CENTRE',
							data: 'centreId',
							render: function(data, type, full, meta) {
	                            if (data) {
	                                var centrevalue = filterFilter(centres, {
	                                    "value": Number(full.centreId)
	                                }, true);
	                                data = (centrevalue.length>0)?centrevalue[0].name:"";
	                            }
	                            return data;
							}	
						},
						{
							title:'FATHER_NAME',
							data: 'fatherFirstName'
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
								if(model.siteCode == 'sambandh') {
									$state.go("Page.Engine",{
										pageName:"customer.IndividualEnrollmentStage2",
										pageId:item.id,
										pageData: {currentStage: item.currentStage}
									});
								} else if(model.siteCode == 'saija') {
									$state.go("Page.Engine",{
										pageName:"customer.IndividualEnrollment3",
										pageId:item.id,
										pageData: {currentStage: item.currentStage}
									});
								} else {
									$state.go("Page.Engine",{
										pageName:"customer.IndividualEnrollment",
										pageId:item.id
									});
								}
							},
							isApplicable: function(item, model){
								if (item.currentStage==='BasicEnrolment' )
									return true;
								return false;
							}
						},
						{
							name: "CUSTOMER_360",
							desc: "",
							icon: "fa fa-user",
							fn: function(item, model){
								$state.go("Page.Customer360",{
									pageId:item.id,
									pageData:model.siteCode
								});
							},
							isApplicable: function(item, model){
								if (item.currentStage==='Completed')
									return true;
								return false;
							}
						},
						{
							name: "Edit Customer",
							desc: "",
							icon: "fa fa-pencil",
							fn: function(item, model){
								if (item.currentStage === 'Stage01') {
									irfNavigator.go({
										state: "Page.Engine",
										pageName: "ProfileInformation",
										pageId: item.id
									});
								}
								else if (item.currentStage === 'Stage02') {
									irfNavigator.go({
										state: "Page.Engine",
										pageName: "AssetsLiabilitiesAndHealth",
										pageId: item.id
									});
								}
								else if (item.currentStage === 'EDF') {
									irfNavigator.go({
										state: "Page.Engine",
										pageName: "EDF",
										pageId: item.id
									});
								}
								else if (item.currentStage === 'Completed') {
									irfNavigator.go({
										state: "Page.Engine",
										pageName: "CustomerRUD",
										pageId: item.id,
										pageData: {
											intent:'EDIT'
										}
									});
								}
							},
							isApplicable: function(item, model){
								return model.siteCode === "KGFS";
							}
						},
						{
							name: "Edit Customer",
							desc: "",
							icon: "fa fa-pencil",
							fn: function(item, model){
								irfNavigator.go({
									state: "Page.Engine",
									pageName: "customer.IndividualEnrollmentStage2",
									pageId: item.id,
									pageData: {currentStage: item.currentStage}
								});
							},
							isApplicable: function(item, model){
								return ((model.siteCode === "saija" || model.siteCode === "sambandh") && item.currentStage === 'Stage02');
							}
						}
					];
				}
			}
		}
	};
}]);
