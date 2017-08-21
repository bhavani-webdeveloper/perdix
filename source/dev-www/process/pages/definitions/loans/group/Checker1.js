define({
    pageUID: "loans.group.Checker1",
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

        var validateForm = function(formCtrl) {
            formCtrl.scope.$broadcast('schemaFormValidate');
            if (formCtrl && formCtrl.$invalid) {
                PageHelper.showProgress("Checker", "Your form have errors. Please fix them.", 5000);
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
    "title": "Checker 1",
    "subTitle": "",
    initialize: function(model, form, formCtrl) {
        var self = this;
        model.review = model.review || {};
        model.siteCode = SessionStore.getGlobalSetting('siteCode');
        if ($stateParams.pageId) {
            var groupId = $stateParams.pageId;
            PageHelper.showLoader();
            irfProgressMessage.pop("checker1", "Loading, Please Wait...");
            GroupProcess.getGroup({
                groupId: groupId
            }, function(response) {
                model.group = response;
                model.group.groupRemarks = null;
                fixData(model);
                var customerPromises = [], dscPromises = [];
                for (i in model.group.jlgGroupMembers) {
                    var member = model.group.jlgGroupMembers[i];
                    customerPromises.push(Enrollment.get({"id": member.customerId}).$promise);
                    dscPromises.push(Groups.getDSCData({"dscId": member.dscId}).$promise);
                            model.group.checkerTransactionHistoryDTO = {
                                "branchId": model.group.branchId,
                                "statusUpDatedBy": SessionStore.getUsername(),
                                "statusUpDatedAt": Utils.getCurrentDate(),
                                "typeOfApprover":"Checker1",
                                "product":model.group.productCode,
                                "groupId":model.group.id,
                                "groupCode":model.group.groupCode
                            };
                            for (j in member.teleCallingDetails) {
                                var telecal = member.teleCallingDetails[j];
                                var temp = [];
                                if (telecal.customerNotCalledReason) temp.push(telecal.customerNotCalledReason);
                                if (telecal.customerNotCalledRemarks) temp.push(telecal.customerNotCalledRemarks);
                                telecal.remarks = temp.join('<br>');
                            }
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
                    }),
                    Queries.getGroupLoanRemarksHistoryById(model.group.id).then(function(resp){
                        model.group.remarksHistory = resp;
                    })
                ]).finally(PageHelper.hideLoader);
            }, function(error) {
                PageHelper.showErrors(error);
                PageHelper.hideLoader();
                irfProgressMessage.pop("checker1", "Oops. An error occurred", 2000);
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
                    //readonly: readonly
            }, 
            {
                "type": "array",
                "condition": "model.siteCode !== 'sambandh'",
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
                        }, 
                        {
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
                        },{
                           "title": "MOBILE_PHONE",
                           "key": "group.jlgGroupMembers[].customer.mobilePhone"
                        },
                        {
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
                                        type: "barcode",
                                        onCapture: function(result, model, form) {
                                            $log.info(result);
                                            model.customer.identityProofNo = result.text;
                                        }
                                    },
                                    {
                                        key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc2ProofType",
                                        "title": "KYC2_PROOF_TYPE",
                                        type: "select",
                                        "enumCode": "identity_proof"
                                    },
                                    {
                                        key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc2ProofNumber",
                                        "title": "KYC2_PROOF_NUMBER",
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
                                },{
                                    "title": "KYC1_PROOF_DOCUMENT_FRONT_SIDE",
                                    key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc2ImagePath",
                                    "title": "KYC2_PROOF_DOCUMENT",
                                    "type": "file",
                                    "fileType": "image/*",
                                    "category": "CustomerEnrollment",
                                    "subCategory": "KYC1"
                                }, {
                                    key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc2ReverseImagePath",
                                    "title": "KYC2_PROOF_DOCUMENT_BACK_SIDE",
                                    "type": "file",
                                    "fileType": "image/*",
                                    "category": "CustomerEnrollment",
                                    "subCategory": "KYC1"
                                }, ]
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
                                    "title": "ACCOUNT_NUMBER",
                                    "key": "group.jlgGroupMembers[].loanAccount.accountNumber", // TODO: loan appl. date, loan tenure, loan appl. file, 
                                    "type": "string"
                                }, {
                                    "title": "PRODUCT",
                                    "key": "group.productCode" // TODO: this should be product name
                                },{
                                    "title": "GROUP_CODE",
                                    "key": "group.groupCode" //loanCycle TODO: this should be product name
                                }, {
                                    "title": "LOAN_AMOUNT",
                                    "key": "group.jlgGroupMembers[].loanAccount.loanAmount", // TODO: loan appl. date, loan tenure, loan appl. file, 
                                    "type": "amount"
                                },{
                                    "title": "LOAN_CYCLE",
                                    "key": "group.jlgGroupMembers[].loanCycle" // TODO: loan appl. date, loan tenure, loan appl. file, 
                                }, {
                                    "title": "TENURE",
                                    "key": "group.jlgGroupMembers[].loanAccount.tenure",
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
                                    items: [{
                                        "title": "IS_CUSTOMER_CALLED",
                                        "key": "group.jlgGroupMembers[].customerCalled",
                                        "type": "select",
                                        "titleMap":{
                                            "Yes":"Yes",
                                            "No":"No"
                                        }
                                    }, {
                                        "title": "CUSTOMER_NOT_CALLED_REASON",
                                        "key": "group.jlgGroupMembers[].customerNotCalledReason",
                                        "condition": "model.group.jlgGroupMembers[arrayIndex].customerCalled == 'No'"
                                    }, {
                                        "title": "CUSTOMER_CALLED_REMARKS",
                                        "condition": "model.group.jlgGroupMembers[arrayIndex].customerCalled == 'Yes'",
                                        "key": "group.jlgGroupMembers[].customerNotCalledRemarks",
                                        "enumCode": "customerTelecallingDetails",
                                        "type": "select"
                                    }, {
                                        "type": "button",
                                        "key": "group.jlgGroupMembers[]",
                                        "icon": "fa fa-circle-o",
                                        "title": "SUBMIT_TELE_CALLING_INFO",
                                        "onClick": function(model, formCtrl, form, event) {
                                            if (!model.group.jlgGroupMembers[event.arrayIndex].customerCalled) {
                                                irfProgressMessage.pop('CHECKER-save', 'Is Customer Called field is not selected. Please select to proceed.', 3000);
                                                return false;
                                            }
                                            PageHelper.showLoader();
                                            var reqData = {
                                                "processType": "JLG"
                                            };
                                            reqData.processId = model.group.jlgGroupMembers[event.arrayIndex].groupId;
                                            reqData.customerId = model.group.jlgGroupMembers[event.arrayIndex].customerId;
                                            reqData.customerCalledDate = moment().format("YYYY-MM-DD");
                                            reqData.customerCalledAt = moment().format();
                                            reqData.customerCalled = model.group.jlgGroupMembers[event.arrayIndex].customerCalled;
                                            reqData.customerNotCalledReason = model.group.jlgGroupMembers[event.arrayIndex].customerNotCalledReason;
                                            reqData.customerNotCalledRemarks = model.group.jlgGroupMembers[event.arrayIndex].customerNotCalledRemarks;
                                            reqData.customerCalledBy = SessionStore.getUsername();
                                            GroupProcess.telecalling(reqData).$promise.then(function(response) {
                                                $log.info(response);
                                                model.group.jlgGroupMembers[event.arrayIndex].teleCallingDetails = JSON.parse(angular.toJson(response));
                                                model.group.jlgGroupMembers[event.arrayIndex].customerCalled = false;
                                                model.group.jlgGroupMembers[event.arrayIndex].customerNotCalledReason = undefined;
                                                model.group.jlgGroupMembers[event.arrayIndex].customerNotCalledRemarks = undefined;

                                                var arraymember=model.group.jlgGroupMembers[event.arrayIndex];

                                                for (j in arraymember.teleCallingDetails) {
                                                    $log.info
                                                    var telecal = arraymember.teleCallingDetails[j];
                                                    var temp = [];
                                                    if (telecal.customerNotCalledReason) temp.push(telecal.customerNotCalledReason);
                                                    if (telecal.customerNotCalledRemarks) temp.push(telecal.customerNotCalledRemarks);
                                                    telecal.remarks = temp.join('<br>');
                                                }
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
                                    "items": [{
                                        "title": "IS_CUSTOMER_CALLED",
                                        "key": "group.jlgGroupMembers[].teleCallingDetails[].customerCalled",
                                        "type": "string",
                                    }, {
                                        "title": "CUSTOMER_CALLED_DATE",
                                        "key": "group.jlgGroupMembers[].teleCallingDetails[].customerCalledAt",
                                        "type": "date"
                                    }, {
                                        "title": "CUSTOMER_CALLED_BY",
                                        "key": "group.jlgGroupMembers[].teleCallingDetails[].customerCalledBy",
                                        "type": "string"
                                    }, /*{
                                        "title": "CUSTOMER_NOT_CALLED_REASON",
                                        //"condition": "model.group.jlgGroupMembers[arrayIndex].teleCallingDetails[arrayIndex].customerCalled =='No'",
                                        "key": "group.jlgGroupMembers[].teleCallingDetails[].customerNotCalledReason",
                                    }, {
                                        "title": "CUSTOMER_CALLED_REMARKS",
                                        //"condition": "model.group.jlgGroupMembers[arrayIndex].teleCallingDetails[arrayIndex].customerCalled =='Yes'",
                                        "key": "group.jlgGroupMembers[].teleCallingDetails[].customerNotCalledRemarks",
                                    },*/{
                                        "title": "REMARKS",
                                        "key": "group.jlgGroupMembers[].teleCallingDetails[].remarks",
                                    }]
                                }]
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                "type": "section",
                                "html": '<hr>'
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                "title": "DSC_STATUS",
                                "readonly": true,
                                "key": "group.jlgGroupMembers[].dscStatus",
                                "type": "text"
                            },{
                                "key": "group.jlgGroupMembers[].dscOverrideRemarks",
                                "condition":"model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDDEN'",
                                "title": "DSC_OVERRIDE_REMARKS",
                                "readonly": true
                            }]
                        }, {
                            "notitle": true,
                            "readonly": true,
                            "key": "group.jlgGroupMembers[].dscData.responseMessageHtml",
                            "type": "html"
                        }, {
                            "type": "section",
                            "key": "group.jlgGroupMembers[]",
                            "htmlClass": "row",
                            "items": [{
                                "type": "section",
                                "html": '<hr>'
                            }, {
                                "title": "CHECKER_FILE_UPLOAD",
                                "key": "group.jlgGroupMembers[].loanAccount.chk1FileUploadId",
                                "type": "file",
                                "fileType": "application/pdf,image/*,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                "category": "Group",
                                "subCategory": "DOC1"
                            }, {
                                "type": "section",
                                "html": '<hr>'
                            }]
                        }]
                    }, {
                "type": "array",
                "key": "group.jlgGroupMembers",
                "condition": "model.siteCode == 'sambandh'",
                "titleExpr": "model.group.jlgGroupMembers[arrayIndex].customer.fullName",
                "add": null,
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
                            "key": "group.jlgGroupMembers[].loanAccount.chk1FileUploadId",
                            "type": "file",
                            "fileType": "application/pdf,image/*,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "category": "Group",
                            "subCategory": "DOC1"
                        },{
                            "type": "section",
                            "html": '<hr>'
                        }]
                    }
                ]
            }]
        },
	    {
                "type": "box",
                "title": "CGT And GRT Details",
                "colClass": "col-sm-12",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-sm-6",
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
                    }]
                }, {
                    "type": "section",
                    "htmlClass": "col-sm-6",
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
                    }]
                }, {
                    "type": "section",
                    "htmlClass": "col-sm-6",
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
                    }]
                }, {
                    "type": "section",
                    "htmlClass": "col-sm-6",
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
                    }]
                }]
            }, 
            {
                type: "box",
                title: "CHECKER_REMARKS",
                items: [
                    {
                        key: "group.checkerTransactionHistoryDTO.status",
                        title: "STATUS",
                        "type":"select",
                        titleMap: {
                        "ACCEPT": "ACCEPT",    
                        "REJECT": "REJECT"
                        }
                    },
                    {
                        key: "group.checkerTransactionHistoryDTO.remarks",
                        "required":true,
                        title: "CHECKER_REMARKS",
                    }, {
                        key: "group.checkerTransactionHistoryDTO.typeOfApprover",
                        "readonly":true,
                        title: "APPROVER_TYPE",
                    }
                ]
            },
            {
                type: "box",
                "readonly": true,
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
                    },{
                       key: "group.checkerTransactionHistory[].statusUpDatedBy",
                       title: "APPROVER",
                    },{
                       key: "group.checkerTransactionHistory[].statusUpDatedAt",
                       title: "APPROVED_AT",
                    }]
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
        "items": [{
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
                    condition: "model.action=='REJECT'",
                    items: [{
                            title: "REMARKS",
                            key: "group.groupRemarks",
                            type: "textarea",
                            required: true
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
                    condition: "model.action=='SEND_BACK'",
                    items: [{
                            title: "REMARKS",
                            key: "group.groupRemarks",
                            type: "textarea",
                            required: true
                        }, {
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
                        },
                        {
                            key: "review.sendBackButton",
                            condition:"model.action == 'SEND_BACK'",
                            type: "button",
                            title: "SEND_BACK",
                            onClick: "actions.sendBack(model, formCtrl, form, $event)"
                        }
                    ]
                },
                {
                    type: "section",
                    condition: "model.action=='PROCEED'",
                    items: [{
                            title: "REMARKS",
                            key: "group.groupRemarks",
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
        preSave: function(model, formCtrl, formName) {},
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
        reject: function(model, formCtrl, form) {
            $log.info("Inside submit()");
            if(!validateForm(formCtrl)) 
                return;
            PageHelper.showLoader();
            var reqData = _.cloneDeep(model);
            reqData.groupAction = 'PROCEED';
            reqData.stage = model.review.rejectStage;
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
            PageHelper.showLoader();
            irfProgressMessage.pop('CHECKER-proceed', 'Working...');
            PageHelper.clearErrors();
            model.groupAction = "PROCEED";
            if(model.siteCode == 'sambandh') {
                var totalAmt = 0;
                for(var itr = 0 ; itr <= model.group.jlgGroupMembers.length; itr++) {
                    totalAmt += model.group.jlgGroupMembers[itr].loanAmount;
                }
                if(totalAmt < 250000.00) {
                    model.stage = "CGT1";
                }
            }
            var reqData = _.cloneDeep(model);            
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
