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
					if (model.group.jlgGroupMembers[key].loanAccount) {
						if (model.group.jlgGroupMembers[key].loanAccount.closed == true) {
							model.group.jlgGroupMembers[key].closed1 = "Inactive";
						} else {
							model.group.jlgGroupMembers[key].closed1 = "Active";
						}
						model.group.jlgGroupMembers[key].loanAccount.applicationStatus="OPEN";
                        if(model.group.jlgGroupMembers[key].loanAccount.bcAccount){
                            model.group.jlgGroupMembers[key].loanAccount.bcAccount.agreementStatus="OPEN";
                        }
					}
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
				model.review = model.review || {};
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
				model.group.branchId = model.group.branchId || SessionStore.getCurrentBranch().branchId;
				model.group.branchName = model.group.branchId || SessionStore.getCurrentBranch().branchName
				$log.info(model.group.branchName);

				if ($stateParams.pageId) {
					var groupId = $stateParams.pageId;
					PageHelper.showLoader();
					irfProgressMessage.pop("group-init", "Loading, Please Wait...");
					GroupProcess.getGroup({
						groupId: groupId
					}, function(response, headersGetter) {
						model.group = _.cloneDeep(response);
						model.group.groupRemarks = null;
						var centreCode = formHelper.enum('centre').data;
						for (var i = 0; i < centreCode.length; i++) {
							if (centreCode[i].code == model.group.centreCode) {
								model.group.centreId = centreCode[i].value;
							}
						}
						fixData(model);
						if (model.group.jlgGroupMembers.length > 0) {
							fillNames(model).then(function(m) {
								model = m;
								Queries.getGroupLoanRemarksHistoryById(model.group.id).then(function(resp){
                                    model.group.remarksHistory = resp;
                                }).finally(function(){
                                    PageHelper.hideLoader();
                                });
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
						"parentValueExpr": "model.group.branchId"
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
							"title": "HUSBAND_OR_FATHER_NAME"
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
	                        "key": "group.jlgGroupMembers[].loanAccount.tenure"
	                    }, {
	                        "title": "LOAN_APPLICATION_DATE",
	                        "readonly": true,
	                        "key": "group.jlgGroupMembers[].loanAccount.loanApplicationDate",
	                        "type": "date"
	                    }, {
	                        "title": "LOAN_STATUS",
	                        "readonly": true,
	                        "key": "group.jlgGroupMembers[].closed1"
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
                    type: "box",
                    "readonly":true,
                    "condition":"model.group.checkerTransactionHistory.length",
                    title: "CHECKER_HISTORY",
                    items: [{
                        key: "group.checkerTransactionHistory",
                        "titleExpr":"model.group.checkerTransactionHistory[arrayIndex].typeOfApprover + ' : ' + model.group.checkerTransactionHistory[arrayIndex].status",
                        type: "array",
                        "add": null,
                        "remove": null,
                        title: "CHECKER_HISTORY",
                        items: [{
                            key: "group.checkerTransactionHistory[].remarks",
                            title: "CHECKER_REMARKS",
                        }, {
                            key: "group.checkerTransactionHistory[].status",
                            title: "STATUS",
                        }, {
                            key: "group.checkerTransactionHistory[].typeOfApprover",
                            title: "APPROVER_TYPE",
                        },
						{
							key: "group.checkerTransactionHistory[].statusUpDatedBy",
							title: "APPROVER",
						}, {
							key: "group.checkerTransactionHistory[].statusUpDatedAt",
							title: "APPROVED_AT",
						}
                        ]
                    }]
                },
{
	                "title": "REMARKS_HISTORY",
	                "type": "box",
	                condition: "model.group.remarksHistory && model.group.remarksHistory.length > 0",
	                "items": [{
	                    "key": "group.remarksHistory",
	                    "type": "array",
	                    "view": "fixed",
	                    add: null,
	                    remove: null,
	                    "items": [{
	                        "type": "section",
	                        "htmlClass": "",
	                        "html": '<i class="fa fa-user text-gray">&nbsp;</i> {{model.group.remarksHistory[arrayIndex].updatedBy}}\
	                        <br><i class="fa fa-clock-o text-gray">&nbsp;</i> {{model.group.remarksHistory[arrayIndex].updatedOn}}\
	                        <br><i class="fa fa-commenting text-gray">&nbsp;</i> <strong>{{model.group.remarksHistory[arrayIndex].remarks}}</strong>\
	                        <br><i class="fa fa-pencil-square-o text-gray">&nbsp;</i>{{model.group.remarksHistory[arrayIndex].stage}}-{{model.group.remarksHistory[arrayIndex].action}}<br>'
	                    }]
	                }]
	            }, 
				{
	                "type": "box",
	                "title": "POST_REVIEW",
	                "items": [
	                    {
	                        key: "action",
	                        type: "radios",
	                        titleMap: {
	                        	"PROCEED": "PROCEED",
	                        	"REJECT": "REJECT",
	                            "SEND_BACK": "SEND_BACK",
	                        },
                            onChange: function(modelValue, form, model, formCtrl, event) {
                                if(model.action == 'PROCEED') {
                                    return;
                                }
                                var stage1 = model.group.currentStage;
                                var targetstage = formHelper.enum('groupLoanBackStages').data;
                                var out = [];
                                for (var i = 0; i < targetstage.length; i++) {
                                    var t = targetstage[i];
                                    if (t.name == stage1 && 'default' == t.field2) {
                                        model.review.targetStage = t.field1;
                                        model.review.rejectStage = "Rejected";
                                        break;
                                    }
                                }
                            }
	                    },	                    
	                    {
	                        type: "section",
	                        condition:"model.action",
	                        items: [
	                        {
	                            title: "REMARKS",
	                            key: "group.groupRemarks",
	                            type: "textarea",
	                            required: true
	                        }, 
	                        {
	                            key: "review.targetStage",
	                            required: true,
	                            condition:"model.action == 'SEND_BACK'",
	                            type: "lov",
	                            autolov: true,
	                            lovonly: true,
	                            title: "SEND_BACK_TO_STAGE",
	                            bindMap: {},
	                            searchHelper: formHelper,
	                            search: function(inputModel, form, model, context) {
	                                var stage1 = model.group.currentStage;
	                                var targetstage = formHelper.enum('groupLoanBackStages').data;
	                                var out = [];
	                                for (var i = 0; i < targetstage.length; i++) {
	                                    var t = targetstage[i];
	                                    if (t.name == stage1) {
	                                        out.push({
	                                            name: t.field1,
	                                        })
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
	                                model.review.targetStage = valueObj.name;
	                            },
	                            getListDisplayItem: function(item, index) {
	                                return [
	                                    item.name
	                                ];
	                            }
	                        }, {
	                            key: "review.sendBackButton",
	                            condition:"model.action == 'SEND_BACK'",
	                            type: "button",
	                            title: "SEND_BACK",
	                            onClick: "actions.sendBack(model, formCtrl, form, $event)"
	                        }, {
                                key: "review.rejectStage",
                                condition:"model.action == 'REJECT'",
                                type: "lov",
                                autolov: true,
                                lovonly: true,
                                title: "SEND_BACK_TO_STAGE",
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    // var stage1 = model.group.currentStage;
                                    // var targetstage = formHelper.enum('groupLoanBackStages').data;
                                    var out = [{name: "Rejected"}];
                                    // for (var i = 0; i < targetstage.length; i++) {
                                    //     var t = targetstage[i];
                                    //     if (t.name == stage1 && 'default' == t.field2) {
                                    //         out.push({
                                    //             name: t.field1,
                                    //         });
                                    //         break;
                                    //     }
                                    // }
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.review.rejectStage = valueObj.name;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.name
                                    ];
                                }
                            }, {
                                key: "review.reject",
                                condition:"model.action == 'REJECT'",
                                type: "button",
                                title: "REJECT",
                                onClick: "actions.reject(model, formCtrl, form, $event)"
                            }, {
	                            "type": "button",
	                            condition:"model.action == 'PROCEED'",
	                            "title": "PROCEED",
	                            "onClick": "actions.proceedAction(model, formCtrl, form)"
	                        }]
	                    }
	                ]
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
                    model.group.endTime= new Date();
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
                },
                sendBack: function(model, form, formName) {
                	if (!model.review.targetStage){
                        irfProgressMessage.pop('Send Back', "Send to Stage is mandatory", 2000);
                        return false;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('Send Back', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";                    
                    var reqData = _.cloneDeep(model);
                    reqData.stage = model.review.targetStage;
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Send back', 'Operation Succeeded. Done', 5000);
                        irfNavigator.goBack();
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Send back', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });   
                },
                reject: function(model, form, formName) {
                	if (!model.review.rejectStage){
                        irfProgressMessage.pop('Reject', "Send to Stage is mandatory", 2000);
                        return false;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('Reject', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "PROCEED";
                    var reqData = _.cloneDeep(model);
                    reqData.stage = model.review.rejectStage;
                    GroupProcess.updateGroup(reqData, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Reject', 'Operation Succeeded. Done', 5000);
                        irfNavigator.goBack();
                    }, function(res) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop('Reject', 'Oops. Some error.', 2000);
                        PageHelper.showErrors(res);
                    });   
                }
			}
		}
	}
})