define({
pageUID: "loans.group.Checker2",
pageType: "Engine",
dependencies: ["$log", "irfSimpleModal", "Groups", "Enrollment", "CreditBureau",
    "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator", "GroupProcess"
],
$pageFn: function($log, irfSimpleModal, Groups, Enrollment, CreditBureau,
    Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, PagesDefinition, Queries, irfNavigator, GroupProcess) {

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

var enrichCustomer = function(customer) {
    customer.fullName = Utils.getFullName(customer.firstName, customer.middleName, customer.lastName);
    customer.fatherFullName = Utils.getFullName(customer.fatherFirstName, customer.fatherMiddleName, customer.fatherLastName);
    customer.spouseFullName = Utils.getFullName(customer.spouseFirstName, customer.spouseMiddleName, customer.spouseLastName);
    var addr = [];
    if (customer.street) addr.push(customer.street);
    if (customer.postOffice) addr.push(customer.postOffice);
    if (customer.locality) addr.push(customer.locality);
    if (customer.villageName) addr.push(customer.villageName);
    if (customer.district) addr.push(customer.district);
    if (customer.pincode) addr.push('Pincode: ' + String(customer.pincode).substr(0, 3) + ' ' + String(customer.pincode).substr(3));
    customer.addressHtml = addr.join(',<br>');
    if (customer.doorNo) customer.addressHtml = customer.doorNo + ', ' + customer.addressHtml;
    customer.addressHtml = '<span><span style="font-size:14px;font-weight:bold">' + customer.addressHtml + '</span></span>';
    return customer;
};

return {
    "type": "schema-form",
    "title": "Checker 2",
    "subTitle": "",
    initialize: function(model, form, formCtrl) {
        var self = this;

        if ($stateParams.pageId) {
            var groupId = $stateParams.pageId;
            PageHelper.showLoader();
            irfProgressMessage.pop("Checker2", "Loading, Please Wait...");
            GroupProcess.getGroup({
                groupId: groupId
            }, function(response) {
                model.group = response;
                var centreCode = formHelper.enum('centre').data;
                for (var i = 0; i < centreCode.length; i++) {
                    if (centreCode[i].code == model.group.centreCode) {
                        model.group.centreId = centreCode[i].value;
                    }
                }
                fixData(model);
                var customerPromises = [], dscPromises = [];
                for (i in model.group.jlgGroupMembers) {
                    var member = model.group.jlgGroupMembers[i];
                    customerPromises.push(Enrollment.get({"id": member.customerId}).$promise);
                    dscPromises.push(Groups.getDSCData({"dscId": member.dscId}).$promise);
                }
                $q.all([
                    $q.all(customerPromises).then(function(data) {
                        for (i in data) {
                            model.group.jlgGroupMembers[i].customer = enrichCustomer(data[i]);
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
                    })
                ]).finally(PageHelper.hideLoader);
            }, function(error) {
                PageHelper.showErrors(error);
                PageHelper.hideLoader();
                irfProgressMessage.pop("Checker2", "Oops. An error occurred", 2000);
            });
        } else {
            irfNavigator.goBack();
        }
    },
    form: [{
        "type": "box",
        "title": "GROUP_MEMBERS",
        "colClass": "col-sm-12",
        "items": [{
            "type": "array",
            "key": "group.jlgGroupMembers",
            "titleExpr": "model.group.jlgGroupMembers[arrayIndex].customer.fullName",
            "add": null,
            "remove": null,
            "items": [{
                "type": "section",
                "readonly": true,
                "htmlClass": "row",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-sm-6",
                    "items": [{
                        "title": "URN",
                        "key": "group.jlgGroupMembers[].urnNo"
                    }, {
                        "title": "FULL_NAME",
                        "key": "group.jlgGroupMembers[].customer.fullName"
                    }, {
                        "title": "DATE_OF_BIRTH",
                        "key": "group.jlgGroupMembers[].customer.dateOfBirth",
                        "type": "date"
                    }, {
                        "title": "AADHAAR_NO",
                        "key": "group.jlgGroupMembers[].customer.aadhaarNo"
                    }, {
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
                    }]
                }, {
                    "type": "section",
                    "htmlClass": "col-sm-6",
                    "items": [{
                        "title": "IDENTITY_PROOF_DOCUMENT",
                        "key": "group.jlgGroupMembers[].customer.identityProofImageId",
                        "type": "file",
                        "fileType": "image/*",
                        "category": "CustomerEnrollment",
                        "subCategory": "IDENTITYPROOF"
                    }, {
                        "title": "IDENTITY_PROOF_REVERSE_DOCUMENT",
                        "key": "group.jlgGroupMembers[].customer.identityProofReverseImageId",
                        "type": "file",
                        "fileType": "image/*",
                        "category": "CustomerEnrollment",
                        "subCategory": "IDENTITYPROOF"
                    }]
                }]
            }, {
                "type": "section",
                "html": '<hr>'
            }, {
                "type": "section",
                "readonly": true,
                "htmlClass": "row",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-sm-6",
                    "items": [{
                        "title": "CUSTOMER_RESIDENTIAL_ADDRESS",
                        "key": "group.jlgGroupMembers[].customer.addressHtml",
                        "type": "html"
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
                    }]
                }, {
                    "type": "section",
                    "htmlClass": "col-sm-6",
                    "items": [{
                        "title": "ADDRESS_PROOF_IMAGE_ID",
                        "key": "group.jlgGroupMembers[].customer.addressProofImageId",
                        "type": "file",
                        "fileType": "image/*",
                        "category": "CustomerEnrollment",
                        "subCategory": "ADDRESSPROOF"
                    }, {
                        "title": "ADDRESS_PROOF_REVERSE_IMAGE_ID",
                        "key": "group.jlgGroupMembers[].customer.addressProofReverseImageId",
                        "type": "file",
                        "fileType": "image/*",
                        "category": "CustomerEnrollment",
                        "subCategory": "ADDRESSPROOF"
                    }]
                }]
            }, {
                "type": "section",
                "html": '<hr>'
            }, {
                "key": "group.jlgGroupMembers[].customer.additionalKYCs",
                condition: "model.group.jlgGroupMembers[arrayIndex].customer.additionalKYCs && model.group.jlgGroupMembers[arrayIndex].customer.additionalKYCs.length",
                "type": "array",
                "htmlClass": "row",
                "notitle": true,
                "readonly": true,
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "col-sm-6",
                        "items": [
                            {
                                
                                key:"group.jlgGroupMembers[].customer.additionalKYCs[].kyc1ProofType",
                                "title": "KYC1_PROOF_TYPE",
                                type:"select",
                                "enumCode": "identity_proof"
                            },
                            
                            {
                                key:"group.jlgGroupMembers[].customer.additionalKYCs[].kyc1ProofNumber",
                                "title": "KYC1_PROOF_NUMBER",
                                type:"barcode",
                                onCapture: function(result, model, form) {
                                    $log.info(result);
                                    model.customer.identityProofNo = result.text;
                                }
                            }
                        ]
                    }, {
                        "type": "section",
                        "htmlClass": "col-sm-6",
                        "items": [{
                            "title": "KYC1_PROOF_DOCUMENT_FRONT_SIDE",
                            key:"group.jlgGroupMembers[].customer.additionalKYCs[].kyc1ImagePath",
                            "type": "file",
                            "fileType": "image/*",
                            "category": "CustomerEnrollment",
                            "subCategory": "KYC1"
                        },
                        {
                            key:"group.jlgGroupMembers[].customer.additionalKYCs[].kyc1ReverseImagePath",
                            "title": "KYC1_PROOF_DOCUMENT_BACK_SIDE",
                            "type": "file",
                            "fileType": "image/*",
                            "category": "CustomerEnrollment",
                            "subCategory": "KYC1"
                        },
                        ]

                    }
                ]
            }, {
                "type": "section",
                "html": '<hr>'
            }, {
                "type": "section",
                "readonly": true,
                "htmlClass": "row",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-sm-6",
                    "items": [{
                        "title": "ACCOUNT_NUMBER",
                        "key": "group.jlgGroupMembers[].loanAccount.accountNumber", // TODO: loan appl. date, loan tenure, loan appl. file, 
                        "type": "string"
                    }, {
                        "title": "PRODUCT",
                        "key": "group.productCode" // TODO: this should be product name
                    }, {
                        "title": "LOAN_AMOUNT",
                        "key": "group.jlgGroupMembers[].loanAccount.loanAmount", // TODO: loan appl. date, loan tenure, loan appl. file, 
                        "type": "amount"
                    }, {
                        "title": "TENURE",
                        "key": "group.jlgGroupMembers[].loanAccount.tenure",
                        "type": "date"
                    }, {
                        "title": "LOAN_APPLICATION_DATE",
                        "key": "group.jlgGroupMembers[].loanAccount.loanApplicationDate",
                        "type": "date"
                    }, {
                    "title": "APPLICATION_FILE_DOWNLOAD",
                    "key": "group.jlgGroupMembers[].loanAccount.applicationFileId",
                    "type": "file",
                    "fileType": "*/*",
                    "category": "Group",
                    "subCategory": "APPLICATION"
                }]
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
                "condition":"model.group.partnerCode=='AXIS'",
                "htmlClass": "row",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-sm-6",
                    "items": [{
                        type: "fieldset",
                        "title": "TELE_CALLING_INFORMATION_CAPTURE",
                        items:[
                            {
                                "title": "IS_CUSTOMER_CALLED",
                                "key": "group.jlgGroupMembers[].customerCalled",
                                "type":"select",
                                "enumCode":"customerTelecallingDetails"
                            },{
                                "title": "CUSTOMER_NOT_CALLED_REASON",
                                "key": "group.jlgGroupMembers[].customerNotCalledReason",
                                "type":"string"
                            },
                            {
                                "title": "CUSTOMER_CALLED_REMARKS",
                                "key": "group.jlgGroupMembers[].customerNotCalledRemarks",
                                "type":"string"
                            },
                            {
                                "type": "button",
                                "key": "group.jlgGroupMembers[]",
                                "icon": "fa fa-circle-o",
                                "title": "SUBMIT_TELE_CALLING_INFO",
                                "onClick": function(model, formCtrl, form, event) {
                                    if(!model.group.jlgGroupMembers[event.arrayIndex].customerCalled){
                                        irfProgressMessage.pop('CHECKER-save', 'Is Customer Called field is not selected. Please select to proceed.', 3000);
                                        return false;
                                    }
                                    PageHelper.showLoader();
                                    var reqData = {"processType": "JLG"};
                                    reqData.processId = model.group.jlgGroupMembers[event.arrayIndex].groupId;
                                    reqData.customerId = model.group.jlgGroupMembers[event.arrayIndex].customerId;
                                    reqData.customerCalledDate = moment().format("YYYY-MM-DD");
                                    reqData.customerCalledAt = moment().format();
                                    reqData.customerCalled = model.group.jlgGroupMembers[event.arrayIndex].customerCalled;
                                    reqData.customerNotCalledReason = model.group.jlgGroupMembers[event.arrayIndex].customerNotCalledReason;
                                    reqData.customerNotCalledRemarks = model.group.jlgGroupMembers[event.arrayIndex].customerNotCalledRemarks;
                                    reqData.customerCalledBy = SessionStore.getUsername();
                                    GroupProcess.telecalling(reqData).$promise.then(function(response){
                                        model.group.jlgGroupMembers[event.arrayIndex].teleCallingDetails = JSON.parse(angular.toJson(response));
                                        model.group.jlgGroupMembers[event.arrayIndex].customerCalled = false;
                                        model.group.jlgGroupMembers[event.arrayIndex].customerNotCalledReason = undefined;
                                        model.group.jlgGroupMembers[event.arrayIndex].customerNotCalledRemarks = undefined;

                                    }).finally(function(){
                                        PageHelper.hideLoader();
                                    })
                                }
                            }
                        ]
                    }]
                }, {
                    "type": "section",
                    "htmlClass": "col-sm-6",
                    "items": [{
                        "key": "group.jlgGroupMembers[].teleCallingDetails",
                        condition: "model.group.jlgGroupMembers[arrayIndex].teleCallingDetails.length",
                        "title": "TELE_CALLING_HISTORY",
                        "readonly": true,
                        "type": "array",
                        "items": [
                            {
                                "title": "IS_CUSTOMER_CALLED",
                                "key": "group.jlgGroupMembers[].teleCallingDetails[].customerCalled",
                                "type":"string",
                            },
                            {
                                "title": "CUSTOMER_CALLED_DATE",
                                "key": "group.jlgGroupMembers[].teleCallingDetails[].customerCalledAt",
                                "type":"date"
                            },
                            {
                                "title": "CUSTOMER_CALLED_BY",
                                "key": "group.jlgGroupMembers[].teleCallingDetails[].customerCalledBy",
                                "type":"string"
                            },
                            {
                                "title": "CUSTOMER_NOT_CALLED_REASON",
                                "key": "group.jlgGroupMembers[].teleCallingDetails[].customerNotCalledReason",
                                "type":"string"
                            },
                            {
                                "title": "CUSTOMER_CALLED_REMARKS",
                                "key": "group.jlgGroupMembers[].teleCallingDetails[].customerNotCalledRemarks",
                                "type":"string"
                            }
                        ]
                    }]
                }]
            }, {
                "type": "section",
                "htmlClass": "col-sm-6",
                "items": [{
                    "title": "DSC_STATUS",
                    "readonly":true,
                    "key": "group.jlgGroupMembers[].dscStatus",
                    "type": "text"
                }]
            }, {
                "notitle": true,
                "readonly":true,
                "key": "group.jlgGroupMembers[].dscData.responseMessageHtml",
                "type": "html"
            }, {
                "type": "section",
                "key": "group.jlgGroupMembers[]",
                "htmlClass": "row",
                "items": [{
                    "type": "section",
                    "html": '<hr>'
                },{
                    "title": "CHECKER_FILE_UPLOAD",
                    readonly: true,
                    "key": "group.jlgGroupMembers[].loanAccount.chk1FileUploadId",
                    "type": "file",
                    "fileType": "application/pdf,image/*,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "category": "Group",
                    "subCategory": "DOC1"
                },{
                    "type": "section",
                    "html": '<hr>'
                }]
            }]
        }, {
            "type": "section",
            "colClass": "col-sm-6",
            "condition":"model.group.partnerCode=='AXIS'",
            "items": [
                {
                    key:"group.verify.fieldVerificationReq",
                    required: true,
                    "title": "FIELD_VERIFICATION_REQUIRED",
                    type:"select",
                    titleMap: {
                        true: "Yes",
                        false: "No"
                    }
                },
                {
                    key:"group.verify.fieldVerificationDone",
                    required: true,
                    condition: "model.group.verify.fieldVerificationReq == 'true'",
                    "title": "FIELD_VERIFICATION_DONE",
                    type:"select",
                    titleMap: {
                        true: "Yes",
                        false: "No"
                    }
                }
            ]
        }
    ]
    }, 
    {
        "type": "box",
        "title": "POST_REVIEW",
        "items": [{
                    key: "action",
                    type: "radios",
                    titleMap: {
                        "REJECT": "REJECT",
                        "APPROVE": "APPROVE",
                    }
                },
                {
                    type: "section",
                    condition: "model.action=='REJECT'",
                    items: [{
                            title: "REMARKS",
                            key: "remarks",
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
                            key: "remarks",
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
    },
    {
        "type": "actionbox",
        "items": [{
            "type": "button",
            "title": "SAVE",
            "onClick": "actions.saveGroup(model,formCtrl, form)"
        },]
    }],
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
        saveGroup: function(model, formCtrl, form) {
            $log.info("Inside submit()");
            if(!validateForm(formCtrl)) 
                return;
            PageHelper.showLoader();
            var reqData = _.cloneDeep(model);
            reqData.groupAction = 'SAVE';
            PageHelper.clearErrors();
            Utils.removeNulls(reqData, true);
            GroupProcess.updateGroup(reqData, function(res) {
                irfProgressMessage.pop('CHECKER-save', 'Done.', 5000);
                model.group = _.clone(res.group);
                PageHelper.hideLoader();
            }, function(res) {
                PageHelper.hideLoader();
                PageHelper.showErrors(res);
                irfProgressMessage.pop('CHECKER-save', 'Oops. Some error.', 2000);
            });
        },
        reject: function(model, formCtrl, form) {
            $log.info("Inside submit()");
            if(!validateForm(formCtrl)) 
                return;
            PageHelper.showLoader();
            var reqData = _.cloneDeep(model);
            reqData.groupAction = 'PROCEED';
            reqData.stage = 'ApplicationPending';
            PageHelper.clearErrors();
            Utils.removeNulls(reqData, true);
            GroupProcess.updateGroup(reqData, function(res) {
                irfProgressMessage.pop('CHECKER-save', 'Done.', 5000);
                model.group = _.clone(res.group);
                PageHelper.hideLoader();
                irfNavigator.goBack();
            }, function(res) {
                PageHelper.hideLoader();
                PageHelper.showErrors(res);
                irfProgressMessage.pop('CHECKER-save', 'Oops. Some error.', 2000);
            });
        },
        approve: function(model, formCtrl, form) {
            if(!validateForm(formCtrl)) 
                return;
            if(model.group.partnerCode == "AXIS" && model.group.verify.fieldVerificationReq == 'true' && model.group.verify.fieldVerificationDone != 'true')
            {
                irfProgressMessage.pop('CHECKER-proceed', 'Can not proceed further, since field verification is not marked as completed.', 5000);
                return;
            }
            PageHelper.showLoader();
            irfProgressMessage.pop('CHECKER-proceed', 'Working...');
            PageHelper.clearErrors();
            model.groupAction = "PROCEED";
            var reqData = _.cloneDeep(model);
            if(model.group.partnerCode !== "AXIS")
                reqData.stage = 'LoanDisbursement';
            GroupProcess.updateGroup(reqData, function(res) {
                PageHelper.hideLoader();
                irfProgressMessage.pop('CHECKER-proceed', 'Operation Succeeded. Proceeded ', 5000);
                irfNavigator.goBack();
            }, function(res) {
                PageHelper.hideLoader();
                irfProgressMessage.pop('CHECKER-proceed', 'Oops. Some error.', 2000);
                PageHelper.showErrors(res);
            });
        }
    }
}}});