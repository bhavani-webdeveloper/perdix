define({
pageUID: "loans.group.Checker1",
pageType: "Engine",
dependencies: ["$log", "$state", "irfSimpleModal", "Groups", "Enrollment", "CreditBureau",
    "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator", "GroupProcess"
],
$pageFn: function($log, $state, irfSimpleModal, Groups, Enrollment, CreditBureau,
    Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, PagesDefinition, Queries, irfNavigator, GroupProcess) {

var fixData = function(model) {
    model.group.tenure = parseInt(model.group.tenure);
};

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
    "title": "Checker 1",
    "subTitle": "",
    initialize: function(model, form, formCtrl) {
        var self = this;

        if ($stateParams.pageId) {
            var groupId = $stateParams.pageId;
            PageHelper.showLoader();
            irfProgressMessage.pop("checker1", "Loading, Please Wait...");
            Groups.getGroup({
                groupId: groupId
            }, function(response) {
                model.group = response;
                var centreCode = formHelper.enum('centre').data;
                for (var i = 0; i < centreCode.length; i++) {
                    if (centreCode[i].code == model.group.centreCode) {
                        model.group.centreCode = centreCode[i].value;
                    }
                }
                fixData(model);
                var promises = [];
                for (i in model.group.jlgGroupMembers) {
                    var member = model.group.jlgGroupMembers[i];
                    promises.push(Enrollment.get({"id": member.customerId}).$promise);
                }
                $q.all(promises).then(function(data) {
                    for (i in data) {
                        model.group.jlgGroupMembers[i].customer = enrichCustomer(data[i]);
                    }
                }, function(errors) {
                    for (i in errors) {
                        PageHelper.showErrors(errors[i]);
                    }
                }).finally(PageHelper.hideLoader);
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
            "type": "array",
            "readonly": true,
            "key": "group.jlgGroupMembers",
            "titleExpr": "model.group.jlgGroupMembers[arrayIndex].customer.fullName",
            "add": null,
            "remove": null,
            "items": [{
                "type": "section",
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
                "type": "section",
                "htmlClass": "row",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-sm-6",
                    "items": [{
                        "title": "KYC1_PROOF_TYPE",
                        "key": "group.jlgGroupMembers[].customer.kyc1ProofType",
                        "type": "select",
                        "enumCode": "kyc"
                    }, {
                        "title": "KYC1_PROOF_NUMBER",
                        "key": "group.jlgGroupMembers[].customer.kyc1ProofNumber"
                    }]
                }, {
                    "type": "section",
                    "htmlClass": "col-sm-6",
                    "items": [{
                        "title": "KYC1_PROOF_DOCUMENT_FRONT_SIDE",
                        "key": "group.jlgGroupMembers[].customer.kyc1ImagePath",
                        "type": "file",
                        "fileType": "image/*",
                        "category": "CustomerEnrollment",
                        "subCategory": "KYC1"
                    }]
                }]
            }, {
                "type": "section",
                "html": '<hr>'
            }, {
                "type": "section",
                "htmlClass": "row",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-sm-6",
                    "items": [{
                        "title": "PRODUCT_CODE",
                        "key": "group.productCode" // TODO: this should be product name
                    }, {
                        "title": "LOAN_AMOUNT",
                        "key": "group.jlgGroupMembers[].loanAmount", // TODO: loan appl. date, loan tenure, loan appl. file, 
                        "type": "amount"
                    }, {
                        "title": "LOAN_PURPOSE1",
                        "key": "group.jlgGroupMembers[].loanPurpose1"
                    }, {
                        "title": "LOAN_PURPOSE2",
                        "key": "group.jlgGroupMembers[].loanPurpose2"
                    }, {
                        "title": "LOAN_PURPOSE3",
                        "key": "group.jlgGroupMembers[].loanPurpose3"
                    }]
                }, {
                    "type": "section",
                    "htmlClass": "col-sm-6",
                    "items": []
                }]
            }]
        }, {
            "type": "section",
            "htmlClass": "row",
            "items": [{
                "type": "section",
                "htmlClass": "col-sm-6",
                "items": [{
                    "title": "CHECKER_FILE_UPLOAD",
                    "key": "group.checker1FileId",
                    "type": "file",
                    "fileType": "*/*",
                    "category": "Group",
                    "subCategory": "DOC1"
                }]
            }, {
                "type": "section",
                "htmlClass": "col-sm-6",
                "items": []
            }]
        }]
    }, {
        "type": "actionbox",
        "items": [{
            "type": "button",
            "title": "APPROVE",
            "onClick": "actions.approve(model,form)"
        }, {
            "type": "button",
            "title": "REJECT",
            "onClick": "actions.reject(model,form)"
        }]
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
                    "centreCode": {
                        "title": "CENTRE_CODE",
                        "type": "integer"
                    }
                }
            }
        }
    },
    actions: {
        preSave: function(model, form, formName) {},
        reject: function(model, form) {
            $log.info("Inside submit()");
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
        approve: function(model, form, formName) {
            PageHelper.showLoader();
            irfProgressMessage.pop('CHECKER-proceed', 'Working...');
            PageHelper.clearErrors();
            model.groupAction = "PROCEED";
            model.group.grtDoneBy = SessionStore.getLoginname() + '-' + model.group.grtDoneBy;
            var reqData = _.cloneDeep(model);
            GroupProcess.updateGroup(reqData, function(res) {
                PageHelper.hideLoader();
                irfProgressMessage.pop('CHECKER-proceed', 'Operation Succeeded. Proceeded ', 5000);
                $state.go('Page.GroupDashboard', null);
            }, function(res) {
                PageHelper.hideLoader();
                irfProgressMessage.pop('CHECKER-proceed', 'Oops. Some error.', 2000);
                PageHelper.showErrors(res);
            });
        }
    }
}}});
