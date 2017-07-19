define({
	pageUID: "loans.group.AgreementUploadPending",
	pageType: "Engine",
	dependencies: ["$log", "GroupProcess", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
		"PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
	],

	$pageFn: function($log, GroupProcess, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
		PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {


		var nDays = 15;
		var fixData = function(model) {
			model.group.tenure = parseInt(model.group.tenure);
		};

		var validateForm = function(formCtrl){
		    formCtrl.scope.$broadcast('schemaFormValidate');
		    if (formCtrl && formCtrl.$invalid) {
		        PageHelper.showProgress("Checker","Your form have errors. Please fix them.", 5000);
		        return false;
		    }
		    return true;
		}

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
			"title": "AGREEMENT_UPLOAD",
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
						var centreCode = formHelper.enum('centre').data;
						for (var i = 0; i < centreCode.length; i++) {
							if (centreCode[i].code == model.group.centreCode) {
								model.group.centreCode = centreCode[i].value;
							}
						}
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
						"enumCode": "centre"
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
					"title": "GROUP_MEMBERS",
					"items": [{
						"key": "group.jlgGroupMembers",
						"type": "array",
						"title": "GROUP_MEMBERS",
						"add": null,
						"remove": null,
						"items": [{
							"key": "group.jlgGroupMembers[].urnNo",
							"readonly": true,
							"title": "URN_NO",
						}, {
							"key": "group.jlgGroupMembers[].firstName",
							"readonly": true,
							"type": "string",
							"title": "GROUP_MEMBER_NAME"
						}, {
							"key": "group.jlgGroupMembers[].husbandOrFatherFirstName",
							"readonly": true,
							"title": "FATHER_NAME"
						}, {
							"key": "group.jlgGroupMembers[].relation",
							"readonly": true,
							"title": "RELATION",
						}, {
	                        "title": "LOAN_ACCOUNT_NUMBER",
	                        "readonly": true,
	                        "key": "group.jlgGroupMembers[].loanAccount.accountNumber", 
	                        "type": "string"
	                    }, {
	                        "title": "ACCOUNT_NUMBER",
	                        "readonly": true,
	                        "key": "group.jlgGroupMembers[].loanAccount.bcAccount.bcAccountNo", 
	                        "type": "string"
	                    }, {
							"key": "group.jlgGroupMembers[].loanAccount.loanAmount",
							"readonly": true,
							"title": "LOAN_AMOUNT",
							"type": "amount",
						}, {
	                        "title": "TENURE",
	                        "readonly": true,
	                        "key": "group.jlgGroupMembers[].loanAccount.tenure",
	                        "type": "date"
	                    }, {
	                        "title": "LOAN_APPLICATION_DATE",
	                        "readonly": true,
	                        "key": "group.jlgGroupMembers[].loanAccount.loanApplicationDate",
	                        "type": "date"
	                    }, {
	                        "title": "LOAN_STATUS",
	                        "readonly": true,
	                        "key": "group.jlgGroupMembers[].loanAccount.loanApplicationStatus",
	                        "type": "date"
	                    }, {
	                        "key": "group.jlgGroupMembers[].loanAccount.bcAccount.agreementFileId",
	                        required: true,
	                        "title": "AGREEMENT_UPLOAD",
		                    "type": "file",
		                    "fileType": "application/pdf,image/*,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		                    "category": "Group",
		                    "subCategory": "AGREEMENT"
	                    }]
					}]
				},

				{
					"type": "actionbox",
					"items": [{
                        "type": "button",
                        "icon": "fa fa-arrow-right",
                        "title": "PROCEED",
                        "onClick": "actions.proceedAction(model, formCtrl, form)"
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
							"centreCode": {
								"title": "CENTRE_CODE",
								"type": ["integer", "null"]
							}
						}
					}
				}
			},

			actions: {
				preSave: function(model, form, formName) {},
				proceedAction: function(model, formCtrl, form) {
					if(!validateForm(formCtrl)) 
		                return;
                    PageHelper.showLoader();
                    irfProgressMessage.pop('Agreement-proceed', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";
                    var reqData = _.cloneDeep(model);
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Agreement-proceed', 'Operation Succeeded. Proceeded to Checker 3.', 5000);
                        irfNavigator.goBack();
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Agreement-proceed', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });
                }
			}
		}
	}
})