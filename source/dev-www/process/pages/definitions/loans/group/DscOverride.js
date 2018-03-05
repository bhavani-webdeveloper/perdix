define({
    pageUID: "loans.group.DscOverride",
    pageType: "Engine",
    dependencies: ["$log", "irfSimpleModal", "Groups", "Enrollment", "CreditBureau",
        "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator", "GroupProcess", "$filter",
    ],
    $pageFn: function($log, irfSimpleModal, Groups, Enrollment, CreditBureau,
        Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator, GroupProcess, $filter) {

        var fixData = function(model) {
            model.group.tenure = parseInt(model.group.tenure);
        };

        var doDSCOverride = function(model, dscOverrideAction) {
        	PageHelper.showLoader();
        	PageHelper.clearErrors();
            if (model.group.dscOverrideRemarks) {
                irfProgressMessage.pop("dsc-override", "Performing DSC Override");
                Groups.post({
                    service: "overridedsc",
                    urnNo: model.jlgGroupMember.urnNo,
                    groupCode: model.group.groupCode,
                    productCode: model.group.productCode,
                    remarks: model.group.dscOverrideRemarks,
                    action: dscOverrideAction
                }, {}, function(resp, headers) {
                    $log.info(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("dsc-override", "Override Succeeded", 2000);
                    irfNavigator.goBack();
                }, function(resp) {
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("dsc-override", "An error occurred. Please Try Again", 2000);
                    PageHelper.showErrors(resp);
                });
            } else {
                PageHelper.hideLoader();
            }
        }

        var validateForm = function(formCtrl) {
            formCtrl.scope.$broadcast('schemaFormValidate');
            if (formCtrl && formCtrl.$invalid) {
                PageHelper.showProgress("dsc-override", "Your form have errors. Please fix them.", 5000);
                return false;
            }
            return true;
        }

        var enrichCustomer = function(customer) {
            customer.fullName = Utils.getFullName(customer.firstName, customer.middleName, customer.lastName);
            customer.fatherFullName = Utils.getFullName(customer.fatherFirstName, customer.fatherMiddleName, customer.fatherLastName);
            customer.spouseFullName = Utils.getFullName(customer.spouseFirstName, customer.spouseMiddleName, customer.spouseLastName);

            var addr = [];
            if (customer.street) addr.push(customer.street);
            //if (customer.postOffice) addr.push(customer.postOffice);
            if (customer.locality) addr.push(customer.locality);
            //if (customer.villageName) addr.push(customer.villageName);
            //if (customer.district) addr.push(customer.district);
            //if (customer.pincode) addr.push('Pincode: ' + String(customer.pincode).substr(0, 3) + ' ' + String(customer.pincode).substr(3));
            customer.addressHtml = addr.join(',<br>');
            if (customer.doorNo) customer.addressHtml = customer.doorNo + ', ' + customer.addressHtml;
            customer.addressHtml = '<span><span style="font-size:14px;font-weight:bold">' + customer.addressHtml + '</span></span>';
            return customer;
        };

return {
    "type": "schema-form",
    "title": "DSC_OVERRIDE",
    "subTitle": "",
    initialize: function(model, form, formCtrl) {
        var self = this;
        model.review = model.review || {};
        model.siteCode = SessionStore.getGlobalSetting('siteCode');
        if ($stateParams.pageData && $stateParams.pageData.jlgGroup && $stateParams.pageData.jlgGroupMember) {
            var groupId = $stateParams.pageId;
            PageHelper.showLoader();
            irfProgressMessage.pop("checker1", "Loading, Please Wait...");
            model.jlgGroupMember = $stateParams.pageData.jlgGroupMember || {};
            model.group = $stateParams.pageData.jlgGroup || {};
            var customerPromise = Enrollment.get({"id": model.jlgGroupMember.customerId}).$promise;
            var dscdataPromise = Groups.getDSCData({"dscId": model.jlgGroupMember.dscId}).$promise;
            $q.all([
            	customerPromise.then(function(data) {
	                model.jlgGroupMember.customer = enrichCustomer(data);
	            }, function(errors) {
	                PageHelper.showErrors(errors);
	            }),
	            dscdataPromise.then(function(data) {
	                for (i in data) {
	                    var r = data.responseMessage;
	                    data.responseMessageHtml = '<strong>DSC</strong>' + r.substr(r.indexOf('<br>'));
	                    model.jlgGroupMember.dscData = data;
	                }
	            }, function(errors) {
	                for (i in errors) {
	                    PageHelper.showErrors(errors[i]);
	                }
	            }),
            ]).then(function(){
            	model.group.jlgGroupMembers = [];
                model.group.jlgGroupMembers.push(model.jlgGroupMember)
            }).finally(PageHelper.hideLoader)
        } else {
            irfNavigator.goBack();
        }
    },
    form: [
	    {
	        "type": "box",
	        "title": "DSC_OVERRIDE_REQUESTED_MEMBER_DETAILS",
	        "colClass": "col-sm-12",
	        "items": [ 
	            {
	                "type": "array",
	                "key": "group.jlgGroupMembers",
	                "condition": "model.group && model.group.jlgGroupMembers",
	                "titleExpr": "model.group.jlgGroupMembers[arrayIndex].customer.fullName",
	                "add": null,
	                remove: null,
	                "view": "fixed",
	                "items": [
		                {
		                    "type": "section",
		                    "readonly": true,
		                    "htmlClass": "row",
		                    "items": [
		                        {
		                            "type": "section",
		                            "htmlClass": "col-sm-6",
		                            "items": [
		                            	 {
							                "key": "group.groupName",
							                "title": "GROUP_NAME",
							                readonly: true,
							            }, {
							                "key": "group.branchId",
							                "title": "BRANCH_NAME",
							                "enumCode": "branch_id",
							                "type":"select",
							                readonly: true,
							                "parentEnumCode": "bank",
							                "parentValueExpr": "model.group.bankId",
							            }, {
							                "key": "group.centreCode",
							                "title": "CENTRE_CODE",
							                "type": "select",
							                readonly: true,
							                "enumCode": "centre_code",
							                "parentEnumCode": "branch_id",
							                "parentValueExpr": "model.group.branchId",
							            },
			                            {
			                                "title": "URN",
			                                "key": "group.jlgGroupMembers[].urnNo"
			                            }, {
			                                "title": "FULL_NAME",
			                                "key": "group.jlgGroupMembers[].customer.fullName"
			                            }, {
			                                "title": "DATE_OF_BIRTH",
			                                "key": "group.jlgGroupMembers[].customer.dateOfBirth",
			                                "type": "date"
			                            }, 
			                            // {
			                            //     "title": "AADHAAR_NO",
			                            //     "key": "group.jlgGroupMembers[].customer.aadhaarNo"
			                            // }, 
			                            {
			                                "title": "IDENTITY_PROOF",
			                                "key": "group.jlgGroupMembers[].customer.identityProof",
			                                "type": "select",
			                                "enumCode": "identity_proof"
			                            }, {
			                                "title": "IDENTITY_PROOFNO",
			                                "key": "group.jlgGroupMembers[].customer.identityProofNo"
			                            }, {
			                                "title": "FATHER_FULL_NAME",
			                                "key": "group.jlgGroupMembers[].customer.fatherFullName"
			                            }, {
			                                "title": "SPOUSE_FULL_NAME",
			                                "key": "group.jlgGroupMembers[].customer.spouseFullName"
			                            }, {
			                                "title": "IDENTITY_PROOF_DOCUMENT",
			                                "key": "group.jlgGroupMembers[].customer.identityProofImageId",
			                                type: "file",
			                                fileType:"application/pdf",
			                                using: "scanner",
			                                "category": "CustomerEnrollment",
			                                "subCategory": "IDENTITYPROOF"
			                            }, {
			                                "title": "ADDRESS_PROOF_IMAGE_ID",
			                                "key": "group.jlgGroupMembers[].customer.addressProofImageId",
			                                type: "file",
			                                fileType:"application/pdf",
			                                using: "scanner",
			                                "category": "CustomerEnrollment",
			                                "subCategory": "ADDRESSPROOF"
			                            } 
		                            ]
				                }, {
				                    "type": "section",
				                    "htmlClass": "col-sm-6",
				                    "items": [
					                    {
					                        "title": "CUSTOMER_RESIDENTIAL_ADDRESS",
					                        "key": "group.jlgGroupMembers[].customer.addressHtml",
					                        "type": "html"
					                    },  {
					                        "title": "VILLAGE_NAME",
					                        "key": "group.jlgGroupMembers[].customer.villageName"
					                    },{
					                        "title": "POST_OFFICE",
					                        "key": "group.jlgGroupMembers[].customer.postOffice"
					                    },{
					                        "title": "DISTRICT",
					                        "key": "group.jlgGroupMembers[].customer.district"
					                    },{
					                        "title": "PIN_CODE",
					                        "key": "group.jlgGroupMembers[].customer.pincode"
					                    }, {
					                        "title": "MOBILE_PHONE",
					                        "key": "group.jlgGroupMembers[].customer.mobilePhone"
					                    }, {
					                        "title": "LANDLINE_NO",
					                        "key": "group.jlgGroupMembers[].customer.landLineNo"
					                    }, {
					                        "title": "HOUSE_LOCATION",
					                        "key": "group.jlgGroupMembers[].customer.latitude",
					                        "type": "geotag",
					                        "latitude": "group.jlgGroupMembers[arrayIndex].customer.latitude",
					                        "longitude": "group.jlgGroupMembers[arrayIndex].customer.longitude"
					                    }, {
					                        "title": "ADDRESS_PROOF",
					                        "key": "group.jlgGroupMembers[].customer.addressProof",
					                        "type": "select",
					                        "enumCode": "address_proof"
					                    }, {
					                        "title": "ADDRESS_PROOF_NO",
					                        "key": "group.jlgGroupMembers[].customer.addressProofNo"
					                    }
				                    ]
				                },
			                ]
			            }, 
			            // {
			            //     "type": "section",
			            //      condition: "model.group.jlgGroupMembers[arrayIndex].customer.additionalKYCs && model.group.jlgGroupMembers[arrayIndex].customer.additionalKYCs.length",
			            //     "html": '<hr>'
			            // }, {
		             //            "key": "group.jlgGroupMembers[].customer.additionalKYCs",
		             //            condition: "model.group.jlgGroupMembers[arrayIndex].customer.additionalKYCs && model.group.jlgGroupMembers[arrayIndex].customer.additionalKYCs.length",
		             //            "type": "array",
		             //            "title": 'ADDITIONAL_KYC',
		             //            "notitle": false,
		             //            "readonly": true,
		             //            "items": [
		             //                {
		             //                    "type": "section",
		             //                    "htmlClass": "col-sm-6",
		             //                    "items": [
		             //                        {
		                                        
		             //                            key:"group.jlgGroupMembers[].customer.additionalKYCs[].kyc1ProofType",
		             //                            "title": "KYC1_PROOF_TYPE",
		             //                            type:"select",
		             //                            "enumCode": "identity_proof"
		             //                        },
		                                    
		             //                        {
		             //                            key:"group.jlgGroupMembers[].customer.additionalKYCs[].kyc1ProofNumber",
		             //                            "title": "KYC1_PROOF_NUMBER",
		             //                            type:"barcode",
		             //                            onCapture: function(result, model, form) {
		             //                                $log.info(result);
		             //                                model.customer.identityProofNo = result.text;
		             //                            }
		             //                        }
		             //                    ]
		             //                }, {
		             //                    "type": "section",
		             //                    "htmlClass": "col-sm-6",
		             //                    "items": [
			            //                     {
			            //                         "title": "KYC1_PROOF_DOCUMENT_FRONT_SIDE",
			            //                         key:"group.jlgGroupMembers[].customer.additionalKYCs[].kyc1ImagePath",
			            //                         "type": "file",
			            //                         fileType: "application/pdf",
				           //                      using: "scanner",
			            //                         "category": "CustomerEnrollment",
			            //                         "subCategory": "KYC1"
			            //                     },
		             //                    ]
		             //                }
		             //            ]
		             //    }, 
		                {
		                    "type": "section",
		                    "html": '<hr>'
		                }, 
		                {
		                    "type": "section",
		                    "readonly": true,
		                    "htmlClass": "row",
		                    "items": [{
		                        "type": "section",
		                        "htmlClass": "col-sm-6",
		                        "items": [{
		                            "title": "ACCOUNT_NUMBER",
		                            condition: "model.group.jlgGroupMembers[arrayIndex].loanAccount",
		                            "key": "group.jlgGroupMembers[].loanAccount.accountNumber", // TODO: loan appl. date, loan tenure, loan appl. file, 
		                            "type": "string"
		                        }, {
		                            "title": "PRODUCT",
		                            "key": "group.productCode" // TODO: this should be product name
		                        }, {
									"key": "group.productCode",
									"title": "PRODUCT_CATEGORY",
									"type": "select",
									"enumCode": "jlg_loan_product",
								},{
		                            "title": "LOAN_AMOUNT",
		                            condition: "model.group.jlgGroupMembers[arrayIndex].loanAccount",
		                            "key": "group.jlgGroupMembers[].loanAccount.loanAmount", // TODO: loan appl. date, loan tenure, loan appl. file, 
		                            "type": "amount"
		                        }, {
		                            "title": "TENURE",
		                            condition: "model.group.jlgGroupMembers[arrayIndex].loanAccount",
		                            "key": "group.jlgGroupMembers[].loanAccount.tenure",
		                        }, {
		                            "title": "LOAN_AMOUNT",
		                            condition: "!(model.group.jlgGroupMembers[arrayIndex].loanAccount)",
		                            "key": "group.jlgGroupMembers[].loanAmount", // TODO: loan appl. date, loan tenure, loan appl. file, 
		                            "type": "amount"
		                        }, {
		                            "title": "TENURE",
		                            condition: "!(model.group.jlgGroupMembers[arrayIndex].loanAccount)",
		                            "key": "group.tenure",
		                        }, 
		                        {
		                            "title": "LOAN_APPLICATION_DATE",
		                            condition: "model.group.jlgGroupMembers[arrayIndex].loanAccount",
		                            "key": "group.jlgGroupMembers[].loanAccount.loanApplicationDate",
		                            "type": "date"
		                        },]
		                    }, {
		                        "type": "section",
		                        "htmlClass": "col-sm-6",
		                        "items": [{
		                            "title": "LOAN_PURPOSE_1",
		                            "key": "group.jlgGroupMembers[].loanPurpose1"
		                        }, {
		                            "title": "LOAN_PURPOSE_2",
		                            "key": "group.jlgGroupMembers[].loanPurpose2"
		                        }, {
		                            "title": "LOAN_PURPOSE_3",
		                            "key": "group.jlgGroupMembers[].loanPurpose3"
		                        }]
		                    }]
		                }, {
		                    "type": "section",
		                    "html": '<hr>'
		                }, {
		                    "type": "section",
		                    "htmlClass": "col-sm-6",
		                    "items": [{
		                        "title": "DSC_STATUS",
		                        "readonly":true,
		                        "key": "group.jlgGroupMembers[].dscStatus",
		                        "type": "text"
		                    }, {
		                        "title": "REQUEST_DSC_OVERRIDE_REMARKS",
		                        "readonly":true,
		                        "key": "group.jlgGroupMembers[].dscOverrideRequestRemarks",
		                        "type": "textarea"
		                    }, {
		                        "readonly":true,
		                        "key": "group.jlgGroupMembers[].dscOverrideRequestFileId",
		                        "category": "Group",
                                "subCategory": "DSCREQUESTDOCUMENT",
                                "title": "REQUEST_DSC_OVERRIDE_FILE",
                                "type": "file",
                                "fileType": "application/pdf",
		                    }]
		                }, {
		                    "notitle": true,
		                    "readonly":true,
		                    "key": "group.jlgGroupMembers[].dscData.responseMessageHtml",
		                    "type": "html"
		                }
	                ]
	            }
	        ]
        },
        {
	        "type": "box",
	        "title": "POST_REVIEW",
	        "items": [
		        {
	                key: "action",
	                type: "radios",
	                titleMap: {
	                    "APPROVE": "Approve",
	                    "REJECT": "REJECT",
	                },
	            },
	            {
	                type: "section",
	                condition: "model.action=='REJECT'",
	                items: [{
	                        title: "REMARKS",
	                        key: "group.dscOverrideRemarks",
	                        type: "textarea",
	                        required: true
	                    },
	                    {
	                        "type": "button",
	                        "title": "REJECT",
	                        "onClick": "actions.reject(model,formCtrl, form)"
	                    }
	                ]
	            },
	            {
	                type: "section",
	                condition: "model.action=='APPROVE'",
	                items: [{
	                        title: "REMARKS",
	                        key: "group.dscOverrideRemarks",
	                        type: "textarea",
	                        required: true
	                    }, 
	                    {
	                        "type": "button",
	                        "title": "APPROVE",
	                        "onClick": "actions.approve(model,formCtrl, form)"
	                    }
	                ]
	            }
	        ]
	    }
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
        preSave: function(model, formCtrl, formName) {},
        reject: function(model, formCtrl, form) {
            $log.info("Inside submit()");
            if(!validateForm(formCtrl)) 
                return;
            doDSCOverride(model, "reject");
        },
        approve: function(model, formCtrl, form) {
            if(!validateForm(formCtrl)) 
                return;
            doDSCOverride(model, "approve");
        }
    }
}}});