define({
	pageUID: "loans.group.ViewGroup",
	pageType: "Engine",
	dependencies: ["$log", "$state", "Groups", "GroupProcess", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
		"PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
	],

	$pageFn: function($log, $state, Groups, GroupProcess, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
		PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {


		var nDays = 15;
		var fixData = function(model) {
			model.group.tenure = parseInt(model.group.tenure);
		};

		var fillNames = function(model) {
			var deferred = $q.defer();
			angular.forEach(model.group.jlgGroupMembers, function(member, key) {
				Enrollment.get({
					id: member.customerId
				}, function(resp, headers) {
					model.group.jlgGroupMembers[key].firstName = resp.firstName;
					try {
						if (resp.middleName.length > 0)
							model.group.jlgGroupMembers[key].firstName += " " + resp.middleName;
						if (resp.lastName.length > 0)
							model.group.jlgGroupMembers[key].firstName += " " + resp.lastName;
					} catch (err) {

					}
					if (key >= model.group.jlgGroupMembers.length - 1) {
						deferred.resolve(model);
					}
				}, function(res) {
					deferred.reject(res);
				});
			});
			return deferred.promise;
		};

		return {
			"type": "schema-form",
			"title": "View Group",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				model.group = model.group || {};
				model.group.branchName = SessionStore.getCurrentBranch().branchId;
				$log.info(model.group.branchName);

				if ($stateParams.pageId) {
					var groupId = $stateParams.pageId;
					PageHelper.showLoader();
					irfProgressMessage.pop("group-init", "Loading, Please Wait...");
					GroupProcess.getGroup({
						groupId: groupId
					}, function(response, headersGetter) {
						model.group = _.cloneDeep(response);
						fixData(model);
						if (model.group.jlgGroupMembers.length > 0) {
							fillNames(model).then(function(m) {
								model = m;
								PageHelper.hideLoader();
							}, function(m) {
								PageHelper.showErrors(m);
								PageHelper.hideLoader();
								irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
							});
						} else {
							PageHelper.hideLoader();
							irfProgressMessage.pop("group-init", "Load Complete. No Group Members Found", 2000);
							backToDashboard();
						}
					}, function(resp) {
						PageHelper.hideLoader();
						irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
						backToDashboard();
					});
				}
			},
			offline: true,
			getOfflineDisplayItem: function(item, index) {
				return [
					item.journal.transactionName
				]
			},

			form: [{
					"type": "box",
					"readonly": true,
					"title": "GROUP_DETAILS",
					"items": [{
						"key": "group.groupName",
						"title": "GROUP_NAME",
					}, {
						"key": "group.partnerCode",
						"title": "PARTNER",
						"type": "select",
						"enumCode": "partner"
					}, {
						"key": "group.centreCode",
						"title": "CENTRE_CODE",
						"type": "select",
						"enumCode": "centre_code",
                        "parentEnumCode": "branch_id",
                        "parentValueExpr": "model.group.branchId",
					}, {
						"key": "group.productCode",
						"title": "PRODUCT",
						"type": "select",
						"enumCode": "loan_product",
						"parentEnumCode": "partner",
						"parentValueExpr": "model.group.partnerCode"
					}, {
						"key": "group.frequency",
						"title": "FREQUENCY",
						"type": "select",
						"titleMap": {
							"M": "Monthly",
							"Q": "Quarterly"
						}
					}, {
						"key": "group.tenure",
						"title": "TENURE",
					}]
				}, {
					"type": "box",
					"readonly": true,
					"title": "GROUP_MEMBERS",
					"items": [{
						"key": "group.jlgGroupMembers",
						"type": "array",
						"title": "GROUP_MEMBERS",
						"add": null,
						"remove": null,
						"items": [{
							"key": "group.jlgGroupMembers[].urnNo",
							"title": "URN_NO",
						}, {
							"key": "group.jlgGroupMembers[].firstName",
							"type": "string",
							"title": "GROUP_MEMBER_NAME"
						}, {
							"key": "group.jlgGroupMembers[].husbandOrFatherFirstName",
							"title": "FATHER_NAME"
						}, {
							"key": "group.jlgGroupMembers[].relation",
							"title": "RELATION",
						}, {
							"key": "group.jlgGroupMembers[].loanAmount",
							"title": "LOAN_AMOUNT",
							"type": "amount",
						}, {
							"key": "group.jlgGroupMembers[].loanPurpose1",
							"title": "LOAN_PURPOSE_1",
							"enumCode": "loan_purpose_1",
							"type": "select",
						}, {
							"key": "group.jlgGroupMembers[].loanPurpose2",
							"type": "string",
							"title": "LOAN_PURPOSE_2",
						}, {
							"key": "group.jlgGroupMembers[].loanPurpose3",
							"type": "string",
							"title": "LOAN_PURPOSE3",
						}, {
							"key": "group.jlgGroupMembers[].witnessFirstName",
							"title": "WitnessLastName",
						}, {
							"key": "group.jlgGroupMembers[].witnessRelationship",
							"title": "RELATION",
							"type": "select",
							"enumCode": "relation"
						}]
					}]
				},

				{
					"type": "actionbox",
					"items": [{
						"style": "btn-theme",
						"title": "CLOSE_GROUP",
						"icon": "fa fa-times",
						"onClick": "actions.closeGroup(model,form)"
					}]
				},
			],

			schema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"group": {
						"type": "object",
						"required": [],
						"properties": {
							"status": {
								"title": "STATUS",
								"type": "string"
							},
							"branchName": {
								"title": "BRANCH_NAME",
								"type": "integer"
							},
							"centreId": {
								"title": "CENTRE_CODE",
								"type": "integer"
							}
						}
					}
				}
			},

			actions: {
				preSave: function(model, form, formName) {},
				closeGroup: function(model, form) {
					if(!validateForm(formCtrl)) 
                        return;
                    PageHelper.showLoader();
                    irfProgressMessage.pop('Close-proceed', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";
                    model.group.groupStatus=false;
                    var reqData = _.cloneDeep(model);
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Close-proceed', 'Operation Succeeded.', 5000);
                        irfNavigator.goBack();
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Close-proceed', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });
				},
			}
		}
	}
})