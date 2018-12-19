define({
	pageUID: "loans.group.ViewGroup",
	pageType: "Engine",
	dependencies: ["$log", "$state", "Groups", "GroupProcess", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
		"PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
	],

	$pageFn: function($log, $state, Groups, GroupProcess, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
		PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {


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
				if (model.group.jlgGroupMembers[key].loanAccount) {
                    if (model.group.jlgGroupMembers[key].loanAccount.closed == true) {
                        model.group.jlgGroupMembers[key].closed1 = "Inactive";
                    } else {
                        model.group.jlgGroupMembers[key].closed1 = "Active";
                    }
                }
			});
			return deferred.promise;
		};
		
		var enrichCustomer = function(customer,jlgMembers) {
			customer.fullName = Utils.getFullName(customer.firstName, customer.middleName, customer.lastName);
			customer.fatherFullName = Utils.getFullName(customer.fatherFirstName, customer.fatherMiddleName, customer.fatherLastName);
			customer.spouseFullName = Utils.getFullName(customer.spouseFirstName, customer.spouseMiddleName, customer.spouseLastName);
			customer.photo = customer.photoImageId;
			var addr = [];
			var addr1 = [];
			var obj = {};
			obj.urnNo=customer.urnNo;
			obj.firstName=customer.firstName;
			obj.fatherFirstName=customer.fatherFirstName;
			obj.spouseFirstName=customer.spouseFirstName;
			obj.mobilePhone=customer.mobilePhone;
			if(jlgMembers.loanAccount){
				obj.accountNumber=jlgMembers.loanAccount.accountNumber;
			}
			customer.member=obj;
			if (customer.street) addr.push(customer.street);
			if (customer.locality) addr.push(customer.locality);
			customer.addressHtml = addr.join(',<br>');
		
			if (customer.doorNo) addr1.push(customer.doorNo);
			if (customer.street) addr1.push(customer.street);
			if (customer.locality) addr1.push(customer.locality);
			customer.addressHtml1 = addr1.join(',');
		
			if (customer.doorNo) customer.addressHtml = customer.doorNo + ', ' + customer.addressHtml;
			customer.addressHtml = '<span><span style="font-size:14px;font-weight:bold">' + customer.addressHtml + '</span></span>';
			return customer;
		};

		return {
			"type": "schema-form",
			"title": "View Group",
			"subTitle": "",
			initialize: function(model, form, formCtrl) {
				var self = this;
				model.review = model.review || {};
				model.close=true;
				model.group = model.group || {};
				model.group.branchName = SessionStore.getCurrentBranch().branchId;
				$log.info(model.group.branchName);
                model.close=true;
				if($stateParams.pageData){
					model.close= $stateParams.pageData.view;
				}
				if ($stateParams.pageId) {
					var groupId = $stateParams.pageId;
					PageHelper.showLoader();
					irfProgressMessage.pop("Checker4", "Loading, Please Wait...");
					GroupProcess.getGroup({
						groupId: groupId
					}, function(response) {
						model.group = response;
						model.group.groupRemarks = null;
						model.group.members=[];
						var centreCode = formHelper.enum('centre').data;
						for (var i = 0; i < centreCode.length; i++) {
							if (centreCode[i].code == model.group.centreCode) {
								model.group.centreId = centreCode[i].value;
							}
						}
						fixData(model);
						var customerPromises = [], dscPromises = [];
						for (i in model.group.jlgGroupMembers) {
							fillNames(model).then(function(m) {
								model = m;
								PageHelper.hideLoader();
							}, function(m) {
								PageHelper.showErrors(m);
								PageHelper.hideLoader();
								irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
							});
							var member = model.group.jlgGroupMembers[i];
							customerPromises.push(Enrollment.get({"id": member.customerId}).$promise);
							dscPromises.push(Groups.getDSCData({"dscId": member.dscId}).$promise);
							model.group.checkerTransactionHistoryDTO = {
								"branchId": model.group.branchId,
								"statusUpDatedBy": SessionStore.getUsername(),
								"statusUpDatedAt": Utils.getCurrentDate(),
								"typeOfApprover":"Checker4",
								"product":model.group.productCode,
								"groupId":model.group.id,
								"groupCode":model.group.groupCode
							};
							for (j in member.teleCallingDetails) {
								var telecal = member.teleCallingDetails[j];
								if (telecal.customerCalledAt) {
									telecal.customerCalledAt1 = moment(telecal.customerCalledAt).format("DD-MM-YYYY HH:mm:ss");
								}
								if (telecal.customerNotCalledRemarks) {
									var telecalSplitArray = telecal.customerNotCalledRemarks.split('<br>');
									if (telecalSplitArray && telecalSplitArray.length > 1) {
										telecal.customerNotCalledRemarks = telecalSplitArray[0];
										telecal.telecallingRemarks = telecalSplitArray[1];
									} else {
										telecal.telecallingRemarks = "";
									}
								} else {
									telecal.telecallingRemarks = "";
								}
								var temp = [];
								if (telecal.customerNotCalledReason) temp.push(telecal.customerNotCalledReason);
								if (telecal.customerNotCalledRemarks) temp.push(telecal.customerNotCalledRemarks);
								telecal.remarks = temp.join('<br>');
							}
						}
						$q.all([
							$q.all(customerPromises).then(function(data) {
								for (i in data) {
									var customer = enrichCustomer(data[i],model.group.jlgGroupMembers[i]);
									model.group.members.push(customer.member);
									model.group.jlgGroupMembers[i].customer = customer;
									model.group.jlgGroupMembers[i].customerCalledDate = model.group.jlgGroupMembers[i].customerCalledDate || moment().format(SessionStore.getSystemDateFormat());
								}
							}, function(errors) {
								for (i in errors) {
									PageHelper.showErrors(errors[i]);
								}
							}),
							$q.all(dscPromises).then(function(data) {
								for (i in data) {
									var r = data[i].responseMessage;
									data[i].responseMessageHtml = '<strong>DSC</strong>' + r.substr(r.indexOf('<br>'));
									model.group.jlgGroupMembers[i].dscData = data[i];
								}
							}, function(errors) {
								for (i in errors) {
									PageHelper.showErrors(errors[i]);
								}
							}),
							Queries.getGroupLoanRemarksHistoryById(model.group.id).then(function(resp){
									for (i = 0; i < resp.length; i++) {
										$log.info("hi");
										resp[i].updatedOn = moment(resp[i].updatedOn).format("DD-MM-YYYY");
										$log.info(resp[i].updatedOn);
									}
									model.group.remarksHistory = resp;
							})
						]).finally(PageHelper.hideLoader);
					}, function(error) {
						PageHelper.showErrors(error);
						PageHelper.hideLoader();
						irfProgressMessage.pop("Checker4", "Oops. An error occurred", 2000);
					});
				} else {
					irfNavigator.goBack();
				}
			},
			form: [{
					"type": "box",
					"readonly": true,
					"title": "GROUP_DETAILS",
					"items": [{
						"key": "group.groupName",
						"title": "GROUP_NAME",
					}, {
						"key": "group.currentStage",
						"title": "CURRENT_STAGE",
					}, {
	                    "key": "group.groupCode",
	                    "readonly":true,
	                    "title": "GROUP_CODE",
	                }, {
						"key": "group.partnerCode",
						"title": "PARTNER",
						"type": "select",
						"enumCode": "partner"
					}, {
	                    "key": "group.branchId",
	                    "title": "BRANCH_NAME",
	                    readonly: true,
	                    "type": "select",
	                    "enumCode": "branch_id",
	                    "parentEnumCode": "bank",
	                    "parentValueExpr": "model.group.bankId",
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
				}, 
				{
					"type": "box",
					"title": "GROUP_MEMBERS",
					"items": [{
							"type": "actionbox",
							"items": [{
								"key": "group.jlgGroupMembers[].customerId",
								"type": "button",
								"title": "VIEW_CUSTOMER",
								"onClick": function(model, form, schemaForm, event) {
									irfNavigator.go({
										state: "Page.Engine",
										pageName: "sambandh.customer.IndividualEnrollment2",
										pageId: model.group.jlgGroupMembers[schemaForm.arrayIndex].customerId
									});
								},
								"condition": "model.siteCode == 'sambandh'"
							}]
						},
						{
							"type":"fieldset",
							"readonly": true,
							"items":[
								{
									"key": "group.jlgGroupMembers",
									"type": "array",
									"titleExpr":"model.group.jlgGroupMembers[arrayIndex].urnNo + ' : ' + model.group.jlgGroupMembers[arrayIndex].customer.fullName",
									"title": "GROUP_MEMBERS",
									"add": null,
									"remove": null,
									"items": [
									{
										"type":"fieldset",
										"items":[
											{
												"key": "group.jlgGroupMembers[].urnNo",
												"title": "URN_NO",
											}, {
												"key": "group.jlgGroupMembers[].firstName",
												"type": "string",
												"title": "GROUP_MEMBER_NAME"
											}, {
												"key": "group.jlgGroupMembers[].husbandOrFatherFirstName",
												"title": "HUSBAND_OR_FATHER_NAME"
											}, {
												"key": "group.jlgGroupMembers[].relation",
												"title": "RELATION",
											}, {
												"key": "group.jlgGroupMembers[].isHouseVerificationDone",
												"title": "IS_HOUSE_VERIFIED",
												"type": "checkbox",
												 schema: { default:true }
											}, {
												"key": "group.jlgGroupMembers[].latitude",
												"condition": "model.group.jlgGroupMembers[arrayIndex].isHouseVerificationDone==true",
												"title": "HOUSE_LOCATION",
												"type": "geotag",
												"latitude": "group.jlgGroupMembers[].latitude",
												"longitude":"group.jlgGroupMembers[].longitude"
											}, {
												"key": "group.jlgGroupMembers[].photoImageId1",
												"condition": "model.group.jlgGroupMembers[arrayIndex].isHouseVerificationDone==true",
												"title": "HOUSE_PHOTO",
												"type": "file",
												"offline": true,
												"category": "Group",
												"subCategory": "GRTPHOTO",
												"fileType": "image/*",
											}, {
												"key": "group.jlgGroupMembers[].loanAmount",
												"title": "LOAN_AMOUNT",
												"type": "amount",
											}, {
												"title": "LOAN_CYCLE",
												"key": "group.jlgGroupMembers[].loanCycle" // TODO: loan appl. date, loan tenure, loan appl. file, 
											},{
												"title": "ACCOUNT_NUMBER",
												"key": "group.jlgGroupMembers[].loanAccount.accountNumber", // TODO: loan appl. date, loan tenure, loan appl. file, 
												"type": "string"
											},{
												"title": "TENURE",
												"key": "group.jlgGroupMembers[].loanAccount.tenure",
											}, {
												"key": "group.jlgGroupMembers[].loanAccount.frequency",
												"type": "select",
												"title": "FREQUENCY",
												"enumCode": "loan_product_frequency"
											},{
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
											},{
												"title": "LOAN_APPLICATION_DATE",
												"key": "group.jlgGroupMembers[].loanAccount.loanApplicationDate",
												"type": "date"
											},{
												"title": "APPLICATION_FILE_DOWNLOAD",
												"key": "group.jlgGroupMembers[].loanAccount.applicationFileId",
												"type": "file",
												"fileType": "*/*",
												"category": "Group",
												"subCategory": "APPLICATION"
											},{
												"title": "CHK1 File Download",
												"key": "group.jlgGroupMembers[].loanAccount.chk1FileUploadId",
												"type": "file",
												"fileType": "*/*",
												"category": "Loan",
												"subCategory": "DOC1"
											},{
												"title": "Agreement File Download",
												"key": "group.jlgGroupMembers[].loanAccount.bcAccount.agreementFileId",
												 condition: "model.group.partnerCode === 'AXIS'",
												"type": "file",
												"fileType": "*/*",
												"category": "Loan",
												"subCategory": "DOC1"
											}
										]
									},
									{
										"type":"fieldset",
										"title":"DSC Details",
										"items":[
											{
												"title": "DSC_STATUS",
												"readonly": true,
												"key": "group.jlgGroupMembers[].dscStatus",
												"type": "text"
											}, {
												"key": "group.jlgGroupMembers[].dscOverrideRemarks",
												"condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDDEN'",
												"title": "DSC_OVERRIDE_REMARKS",
												"readonly": true
											},{
												"notitle": true,
												"readonly": true,
												"key": "group.jlgGroupMembers[].dscData.responseMessageHtml",
												"type": "html"
											},
										]
									}
							]
						}]
					}]
				},

				{
					"type": "box",
					//"condition": "model.siteCode == 'KGFS'",
					"title": "CGT And GRT Details",
					"items": [{
						"type": "fieldset",
						"title":"CGT1 Deatils",
						"items": [{
							"title": "CGT_1_PHOTO",
							readonly: true,
							"key": "group.cgt1Photo",
							"category": "Group",
							"subCategory": "CGT1PHOTO",
							"type": "file",
							"fileType": "image/*",
						}, {
							readonly: true,
							"key": "group.cgt1EndPhoto",
							"title": "CGT_1_PHOTO",
							"category": "Group",
							"subCategory": "CGT1PHOTO",
							"type": "file",
							"fileType": "image/*"
						}, {
							"key": "group.cgt1Latitude",
							"title": "CGT_1_LOCATION",
							"type": "geotag",
							"latitude": "group.cgt1Latitude",
							"longitude": "group.cgt1Longitude",
							"readonly": true
						},{
							"key": "group.cgtDate11",
							"title": "CGT_1_START_DATE",
							//"type": "date",
							"readonly": true
						},{
							"key": "group.cgtEndDate11",
							"title": "CGT_1_END_DATE",
							//"type": "date",
							"readonly": true
						}]
					}, {
						"type": "fieldset",
						"title":"CGT 2 Deatils",
						"items": [{
							"title": "CGT_2_PHOTO",
							readonly: true,
							"key": "group.cgt2Photo",
							"category": "Group",
							"subCategory": "CGT1PHOTO",
							"type": "file",
							"fileType": "image/*",
						}, {
							"title": "CGT_2_PHOTO",
							readonly: true,
							"key": "group.cgt2EndPhoto",
							"category": "Group",
							"subCategory": "CGT1PHOTO",
							"type": "file",
							"fileType": "image/*"
						}, {
							"key": "group.cgt2Latitude",
							"title": "CGT_2_LOCATION",
							"type": "geotag",
							"latitude": "group.cgt2Latitude",
							"longitude": "group.cgt2Longitude",
							"readonly": true
						},{
							"key": "group.cgtDate12",
							"title": "CGT_2_START_DATE",
							//"type": "date",
							"readonly": true
						},{
							"key": "group.cgtEndDate12",
							"title": "CGT_2_END_DATE",
							//"type": "date",
							"readonly": true
						}]
					}, {
						"type": "fieldset",
						"title":"CGT3 Details",
						"items": [{
							"title": "CGT_3_PHOTO",
							readonly: true,
							"key": "group.cgt3Photo",
							"category": "Group",
							"subCategory": "CGT1PHOTO",
							"type": "file",
							"fileType": "image/*",
						}, {
							readonly: true,
							"key": "group.cgt3EndPhoto",
							"title": "CGT_3_PHOTO",
							"category": "Group",
							"subCategory": "CGT1PHOTO",
							"type": "file",
							"fileType": "image/*"
						}, {
							"key": "group.cgt1Latitude",
							"title": "CGT_3_LOCATION",
							"type": "geotag",
							"latitude": "group.cgt3Latitude",
							"longitude": "group.cgt3Longitude",
							"readonly": true
						},{
							"key": "group.cgtDate13",
							"title": "CGT_3_START_DATE",
							//"type": "date",
							"readonly": true
						},{
							"key": "group.cgtEndDate13",
							"title": "CGT_3_END_DATE",
							//"type": "date",
							"readonly": true
						}]
					}]
				},
				{
					"type": "box",
					"readonly":true,
					"title":"GRT Details",
					"items": [{

						"key": "group.grtPhoto",
						"title": "GRT_PHOTO",
						"category": "Group",
						"subCategory": "GRTPHOTO",
						"fileType": "image/*",
						"type": "file",
						readonly: true,
					}, {
						"key": "group.grtEndPhoto",
						"title": "GRT_PHOTO",
						"category": "Group",
						"subCategory": "GRTPHOTO",
						"fileType": "image/*",
						"type": "file",
						readonly: true,
					}, {
						"key": "group.grtLatitude",
						"title": "GRT_LOCATION",
						"type": "geotag",
						"latitude": "group.grtLatitude",
						"longitude": "group.grtLongitude",
						"readonly": true
					},{
						"key": "group.grtDate1",
						"title": "GRT_START_DATE",
						//"type": "date",
						"readonly": true
					},{
						"key": "group.grtEndDate1",
						"title": "GRT_END_DATE",
						//"type": "date",
						"readonly": true
					},{
						"key": "group.udf1",
						"type":"checkbox",
						"schema":{
							"default":false
						},
						"title": "QUESTION_1"
					}, {
						"key": "group.udf2",
						"type":"checkbox",
						"schema":{
							"default":false
						},
						"title": "QUESTION_2"
					}, {
						"key": "group.udf3",
						"type":"checkbox",
						"schema":{
							"default":false
						},
						"title": "QUESTION_3"
					}, {
						"key": "group.udf4",
						"type":"checkbox",
						"schema":{
							"default":false
						},
						"title": "QUESTION_4"
					}, {
						"key": "group.udf5",
						"type":"checkbox",
						"schema":{
							"default":false
						},
						"title": "QUESTION_5"
					}, {
						"key": "group.udf6",
						"type":"checkbox",
						"schema":{
							"default":false
						},
						"title": "QUESTION_6"
					}]
				},

				{
					"type": "box",
					"condition":"model.group.checkerTransactionHistory.length",
					title: "CHECKER_HISTORY",
					"items": [{
							type: "tableview",
							listStyle: "table",
							key: "group.checkerTransactionHistory",
							title: "CHECKER_HISTORY",
							selectable: false,
							expandable: true,
							paginate: false,
							searching: false,
							getColumns: function() {
								return [{
									title: 'CHECKER_REMARKS',
									data: 'remarks'
								}, {
									title: 'STATUS',
									data: 'status'
								}, {
									title: 'APPROVER_TYPE',
									data: 'typeOfApprover'
								}, {
									title: 'APPROVER',
									data: 'statusUpDatedBy'
								}, {
									title: 'APPROVED_AT',
									data: 'statusUpDatedAt'
								}]
							},
							getActions: function(item) {
								return [];
							}
						}
					]
				},
				{
					"type": "box",
					condition: "model.group.remarksHistory && model.group.remarksHistory.length > 0",
					"title": "REMARKS_HISTORY",
					"items": [{
							type: "tableview",
							listStyle: "table",
							key: "group.remarksHistory",
							"title": "REMARKS_HISTORY",
							selectable: false,
							expandable: true,
							paginate: false,
							searching: false,
							getColumns: function() {
								return [{
									title: 'Approved By',
									data: 'updatedBy',
									render: function(data, type, full, meta) {
										return  '<i class="fa fa-user text-gray">&nbsp;</i> ' + data;
									}
								}, {
									title: 'Approved On',
									data: 'updatedOn',
									render: function(data, type, full, meta) {
										return  '<i class="fa fa-clock-o text-gray">&nbsp;</i> ' + data;
									}
								}, {
									title: 'REMARKS',
									data: 'remarks',
									render: function(data, type, full, meta) {
										return  '<i class="fa fa-commenting text-gray">&nbsp;</i> ' + data;
									}
								}, {
									title: 'Action',
									data: 'action',
									render: function(data, type, full, meta) {
										return  full.stage +"-" +data;
									}
								}]
							},
							getActions: function(item) {
								return [];
							}
						}
					]
				},

				{
					"type": "actionbox",
					"condition":"model.close",
					"items": [{
						"style": "btn-theme",
						"title": "CLOSE_GROUP",
						"icon": "fa fa-times",
						"onClick": "actions.closeGroup(model,form)"
					}]
				},
				{
					"type": "actionbox",
					"condition":"!model.close",
					"items": [{
						"style": "btn-theme",
						"title": "Back",
						"onClick": "actions.goBack(model,form)"
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
                    PageHelper.showLoader();
                    irfProgressMessage.pop('Close-proceed', 'Working...');
                    PageHelper.clearErrors();
                    model.groupAction = "SAVE";
                    model.group.groupStatus=false;
                    	var reqData={};
						var reqData = _.cloneDeep(model);
                    	GroupProcess.closeGroup(reqData,function(res){
                    		PageHelper.hideLoader();
	                        irfProgressMessage.pop('Close-proceed', 'Operation Succeeded.', 5000);
	                        irfNavigator.goBack();
                    	},function(res) {
	                        PageHelper.hideLoader();
	                        irfProgressMessage.pop('Close-proceed', 'Oops. Some error.', 2000);
	                        PageHelper.showErrors(res);
	                    });
				},
				goBack: function(model, form) {
					irfNavigator.goBack();
				}
			}
		}
	}
})