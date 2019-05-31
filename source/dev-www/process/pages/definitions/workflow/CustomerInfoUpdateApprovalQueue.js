
irf.pageCollection.factory(irf.page("workflow.CustomerInfoUpdateApprovalQueue"),
["$log","$stateParams", "formHelper","filterFilter", "Enrollment","Workflow","Queries","$q","$state", "SessionStore", "Utils", "PagesDefinition", "irfNavigator",
function($log,$stateParams, formHelper,filterFilter, Enrollment,Workflow,Queries,$q,$state, SessionStore, Utils, PagesDefinition, irfNavigator){
	var branch = SessionStore.getBranch();
	return {
		"type": "search-list",
		"title": "WORKFLOW_SEARCH",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			model.branch = SessionStore.getCurrentBranch().branchId;
			model.centres = formHelper.enum('centre').data;
			//"irf-elements": "svn+http://svn.perdix.co/svn/perdix/irf-common-elements#trunk",
			var bankName = SessionStore.getBankName();
			var banks = formHelper.enum('bank').data;
			for (var i = 0; i < banks.length; i++){
				if(banks[i].name == bankName){
					model.bankId = banks[i].value;
					model.bankName = banks[i].name;
					break ;
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
			title: "WORKFLOW_SEARCH",
			searchForm: [
				{
                	"type": "section",
                	items: [
                	{
                		key: "firstName",
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
                		condition: "model.siteCode!='sambandh'"
                	},
                	{
                		key: "branch",
                		enumCode:"userbranches",
                		condition: "model.siteCode=='sambandh'"
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
					"firstName": {
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
				/*var branches = formHelper.enum('branch').data;
				var branchName = null;
				for (var i=0;i<branches.length; i++){
					var branch = branches[i];
					 if (branch.code == searchOptions.branch){
					 	branchName = branch.name;
					 }
				}*/
                var currentStage = $stateParams.pageId;
                console.log("currentStage - "+ currentStage);

				var promise = Workflow.search({
                    "currentStage": currentStage
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
							title:'ID',
							data: 'id'
						},
						{
							title:'FIRST_NAME',
							data: 'firstName'
							// type: 'html',
						},
						{
							title:'PROCESS_NAME',
							data: 'processName'
						},
						{
							title:'PROCESS_TYPE',
							data: 'processType'
						},
                        {
                            title:'CURRENT_STAGE',
                            data: 'currentStage'
                        },


					]
				},
				getActions: function(){
					return [
                        {
                            name: "EDIT_CUSTOMER",
                            desc: "",
                            icon: "fa fa-pencil",
                            fn: function(item, model){
                                irfNavigator.go({
                                    state: "Page.Engine",
                                    "pageName": 'workflow.CustomerInfoUpdateInit',
                                    "pageId": item.id
                                });
                            },
                            isApplicable: function(item, model){
                                return item.currentStage=="Init"
                            }

                        },
                        {
                            name: "APPROVE_CUSTOMER",
                            desc: "",
                            icon: "fa fa-pencil",
                            fn: function(item, model){
                                irfNavigator.go({
                                    state: "Page.Engine",
                                    "pageName": 'workflow.CustomerInfoUpdateApprove',
                                    "pageId": item.id
                                });
                            },
                            isApplicable: function(item, model){
                                return item.currentStage=="Approve";
                            }

                        }

					];
				}
			}
		}
	};
}]);

