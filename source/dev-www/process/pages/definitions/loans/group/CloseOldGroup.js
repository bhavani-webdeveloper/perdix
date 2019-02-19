define({
	pageUID: "loans.group.CloseOldGroup",
	pageType: "Engine",
	dependencies: ["$log", "$state", "GroupProcess","filterFilter","SchemaResource", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
		"PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
	],
	$pageFn: function($log, $state, GroupProcess,filterFilter,SchemaResource, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
		PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {

			return {
				"type": "schema-form",
				"title": "CLOSE_OLD_GROUP",
				initialize: function(model, form, formCtrl) {
					$log.info("Demo Customer Page got initialized");
					model.activateLoan = model.activateLoan || {};
					model.activateLoan.accountNumber = $stateParams.pageId;
					
					
				},
				form: [{
					"type": "box",
					"title": "CLOSE_OLD_GROUP",
					"items": [{
						"key": "partner",
						"title": "PARTNER",
						"type" : "select",
						"enumCode": "old_partners",
						"required":"true"
					},
				{
					"key":"groupCode",
					"title":"GROUP_CODE",
					"required":"true"
				}]
				}, {
					type: "actionbox",				
					items: [{
						type: "submit",
						title: "CloseGroup"
					}]
				}],
				schema: function() {
					return SchemaResource.getDisbursementSchema().$promise;
				},
				actions: {
					submit: function(model, form, formName) {
						reqData = {};
						reqData.partnerCode = model.partner;
						reqData.groupCode = model.groupCode;
						$log.info("on submit action ....");
						GroupProcess.closeOldGroup(reqData, function(res) {
							irfProgressMessage.pop('group-close', 'Done.', 5000);
							deferred.resolve(res);
							$state.go("Page.Engine", {
								"pageName": "loans.group.GroupDashboard",
								"pageId": null
							});
							
						}, function(res) {
							PageHelper.hideLoader();
							PageHelper.showErrors(res);
							irfProgressMessage.pop('group-close', 'Oops. Some error.', 2000);
							deferred.reject(false);
						});
					}
				}
			};
		}
	}
	
	);