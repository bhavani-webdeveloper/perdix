define({
pageUID: "loans.group.Checker4",
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
    obj.accountNumber=jlgMembers.loanAccount.accountNumber;
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
    "title": "Checker 4",
    "subTitle": "",
    initialize: function(model, form, formCtrl) {
        var self = this;
        model.review = model.review || {};
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
        "title": "GROUP_MEMBERS",
        "colClass": "col-sm-12",
        "items": [{
                "key": "group.groupName",
                "title": "GROUP_NAME",
                readonly: true,
            },{
                "key": "group.groupCode",
                "title": "GROUP_CODE",
                readonly: true,
            },
            {
                type: "section",
                "htmlClass": "row",
                title: "MEMBER_DETAILS",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-sm-12",
                    "items": [{
                        type: "tableview",
                        listStyle: "table",
                        key: "group.members",
                        title: "MEMBER_DETAILS",
                        selectable: false,
                        expandable: false,
                        paginate: false,
                        searching: false,
                        getColumns: function() {
                            return [{
                                title: 'ACCOUNT_NUMBER',
                                data: 'accountNumber'
                            }, {
                                title: 'URN_NO',
                                data: 'urnNo'
                            }, {
                                title: 'CUSTOMER_NAME',
                                data: 'firstName'
                            }, {
                                title: 'FATHER_NAME',
                                data: 'fatherFirstName'
                            }, {
                                title: 'Spouse Name',
                                data: 'spouseFirstName'
                            }, {
                                title: 'MOBILE_PHONE',
                                data: 'mobilePhone'
                            }]
                        },
                        getActions: function(item) {
                            return [];
                        }
                    }]
                }]
            },
            {
            "type": "array",
            "key": "group.jlgGroupMembers",
            "titleExpr": "model.group.jlgGroupMembers[arrayIndex].loanAccount.accountNumber",
            "add": null,
            "remove": null,
            "items": [
                    {
                        "type": "section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                "key": "group.jlgGroupMembers[].ViewCustomer",
                                "type": "button",
                                "title": "View Customer",
                                "required": true,
                                "readonly": false,
                                "onClick": "actions.viewCustomer(model, formCtrl, form, $event)"
                            }, {
                                "title": "URN",
                                "readonly": true,
                                "key": "group.jlgGroupMembers[].urnNo"
                            }, {
                                "title": "FULL_NAME",
                                "readonly": true,
                                "key": "group.jlgGroupMembers[].customer.fullName"
                            }, {
                                "title": "DATE_OF_BIRTH",
                                "readonly": true,
                                "key": "group.jlgGroupMembers[].customer.dateOfBirth",
                                "type": "date"
                            }, {
                                "title": "FATHER_FULL_NAME",
                                "readonly": true,
                                "key": "group.jlgGroupMembers[].customer.fatherFullName"
                            }, {
                                "title": "Spouse Name",
                                "readonly": true,
                                "key": "group.jlgGroupMembers[].customer.spouseFullName"
                            }]
                        }, {
                            "type": "section",
                            "readonly": true,
                            "htmlClass": "col-sm-6",
                            "items": [{
                                "title": "CUSTOMER_PHOTO",
                                "readonly": true,
                                "key": "group.jlgGroupMembers[].customer.photo",
                                type: "file",
                                fileType: "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "PHOTO"
                            }]
                        }]
                    }, {
                        "type": "section",
                        "htmlClass": "col-sm-12",
                        "items": [{
                            "type": "section",
                            "html": '<hr>'
                        }, {
                            "type": "section",
                            "html": '<hr>'
                        }]
                    }, {
                        "type": "section",
                        "readonly": true,
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                "title": "AADHAAR_NO",
                                "readonly": true,
                                "key": "group.jlgGroupMembers[].customer.aadhaarNo"
                            }, {
                                "title": "IDENTITY_PROOF",
                                "readonly": true,
                                "key": "group.jlgGroupMembers[].customer.identityProof",
                                "type": "select",
                                "enumCode": "identity_proof"
                            }, {
                                "title": "IDENTITY_PROOF_DOCUMENT",
                                "key": "group.jlgGroupMembers[].customer.identityProofImageId",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "IDENTITYPROOF",
                                "section": '<table class="table" id="lightbox-text" style="display: inline;">' +
                                            '<tbody>' +
                                            '<tr> <td></td> <td>'+"{{ 'aadhaarNo' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.aadhaarNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'IDENTITY_PROOFNO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.identityProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'CUSTOMER_RESIDENTIAL_ADDRESS' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressHtml1}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'VILLAGE_NAME' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.villageName}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'POST_OFFICE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.postOffice}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'DISTRICT' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.district}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'PIN_CODE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.pincode}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'MOBILE_PHONE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.mobilePhone}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'LANDLINE_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.landLineNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProof}}" + '</td> </tr>' +
                                            '</tbody>' +
                                            '</table>',
                            }, ]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                "title": "IDENTITY_PROOFNO",
                                "readonly": true,
                                "key": "group.jlgGroupMembers[].customer.identityProofNo"
                            }, {
                                "title": "IDENTITY_PROOF_REVERSE_DOCUMENT",
                                "key": "group.jlgGroupMembers[].customer.identityProofReverseImageId",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "IDENTITYPROOF",
                                "section": '<table class="table" id="lightbox-text" style="display: inline;">' +
                                            '<tbody>' +
                                            '<tr> <td></td> <td>'+"{{ 'aadhaarNo' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.aadhaarNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'IDENTITY_PROOFNO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.identityProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'CUSTOMER_RESIDENTIAL_ADDRESS' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressHtml1}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'VILLAGE_NAME' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.villageName}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'POST_OFFICE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.postOffice}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'DISTRICT' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.district}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'PIN_CODE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.pincode}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'MOBILE_PHONE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.mobilePhone}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'LANDLINE_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.landLineNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProof}}" + '</td> </tr>' +
                                            '</tbody>' +
                                            '</table>',
                            }]
                        }, ]
                    }, {
                        "type": "section",
                        "htmlClass": "col-sm-12",
                        "items": [{
                            "type": "section",
                            "html": '<hr>'
                        }, {
                            "type": "section",
                            "html": '<hr>'
                        }]
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
                            }, {
                                "title": "POST_OFFICE",
                                "key": "group.jlgGroupMembers[].customer.postOffice"
                            }, {
                                "title": "DISTRICT",
                                "key": "group.jlgGroupMembers[].customer.district"
                            }, {
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
                                "latitudeExpr": "model.group.jlgGroupMembers[arrayIndexes[0]].customer.latitude",
                                "longitudeExpr": "model.group.jlgGroupMembers[arrayIndexes[0]].customer.longitude"
                            }, {
                                "title": "ADDRESS_PROOF",
                                "key": "group.jlgGroupMembers[].customer.addressProof",
                                "type": "select",
                                "enumCode": "address_proof"
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                "title": "ADDRESS_PROOF_NO",
                                "key": "group.jlgGroupMembers[].customer.addressProofNo"
                            }, {
                                "title": "ADDRESS_PROOF_IMAGE_ID",
                                "key": "group.jlgGroupMembers[].customer.addressProofImageId",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "ADDRESSPROOF",
                                "section": '<table class="table" id="lightbox-text" style="display: inline;">' +
                                            '<tbody>' +
                                            '<tr> <td></td> <td>'+"{{ 'aadhaarNo' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.aadhaarNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'IDENTITY_PROOFNO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.identityProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'CUSTOMER_RESIDENTIAL_ADDRESS' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressHtml1}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'VILLAGE_NAME' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.villageName}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'POST_OFFICE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.postOffice}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'DISTRICT' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.district}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'PIN_CODE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.pincode}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'MOBILE_PHONE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.mobilePhone}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'LANDLINE_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.landLineNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProof}}" + '</td> </tr>' +
                                            '</tbody>' +
                                            '</table>',
                            }, {
                                "title": "ADDRESS_PROOF_REVERSE_IMAGE_ID",
                                "key": "group.jlgGroupMembers[].customer.addressProofReverseImageId",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "ADDRESSPROOF",
                                "section": '<table class="table" id="lightbox-text" style="display: inline;">' +
                                            '<tbody>' +
                                            '<tr> <td></td> <td>'+"{{ 'aadhaarNo' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.aadhaarNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'IDENTITY_PROOFNO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.identityProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'CUSTOMER_RESIDENTIAL_ADDRESS' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressHtml1}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'VILLAGE_NAME' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.villageName}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'POST_OFFICE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.postOffice}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'DISTRICT' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.district}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'PIN_CODE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.pincode}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'MOBILE_PHONE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.mobilePhone}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'LANDLINE_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.landLineNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProof}}" + '</td> </tr>' +
                                            '</tbody>' +
                                            '</table>',
                            }]
                        }]
                    }, {
                        "type": "section",
                        "htmlClass": "col-sm-12",
                        "items": [{
                            "type": "section",
                            "html": '<hr>'
                        }, {
                            "type": "section",
                            "html": '<hr>'
                        }]
                    }, {
                        "key": "group.jlgGroupMembers[].customer.additionalKYCs",
                        condition: "model.group.jlgGroupMembers[arrayIndex].customer.additionalKYCs && model.group.jlgGroupMembers[arrayIndex].customer.additionalKYCs.length",
                        "type": "array",
                        "htmlClass": "row",
                        "notitle": true,
                        "readonly": true,
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc1ProofType",
                                "title": "KYC1_PROOF_TYPE",
                                type: "select",
                                "enumCode": "identity_proof"
                            }, {
                                key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc1ProofNumber",
                                "title": "KYC1_PROOF_NUMBER",
                                type: "barcode",
                                onCapture: function(result, model, form) {
                                    $log.info(result);
                                    model.customer.identityProofNo = result.text;
                                }
                            }, {
                                "title": "KYC1_PROOF_DOCUMENT_FRONT_SIDE",
                                key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc1ImagePath",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "KYC1",
                                "section": '<table class="table" id="lightbox-text" style="display: inline;">' +
                                            '<tbody>' +
                                            '<tr> <td></td> <td>'+"{{ 'aadhaarNo' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.aadhaarNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'IDENTITY_PROOFNO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.identityProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'CUSTOMER_RESIDENTIAL_ADDRESS' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressHtml1}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'VILLAGE_NAME' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.villageName}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'POST_OFFICE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.postOffice}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'DISTRICT' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.district}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'PIN_CODE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.pincode}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'MOBILE_PHONE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.mobilePhone}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'LANDLINE_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.landLineNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProof}}" + '</td> </tr>' +
                                            '</tbody>' +
                                            '</table>',
                            }, {
                                key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc1ReverseImagePath",
                                "title": "KYC1_PROOF_DOCUMENT_BACK_SIDE",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "KYC1",
                                "section": '<table class="table" id="lightbox-text" style="display: inline;">' +
                                            '<tbody>' +
                                            '<tr> <td></td> <td>'+"{{ 'aadhaarNo' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.aadhaarNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'IDENTITY_PROOFNO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.identityProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'CUSTOMER_RESIDENTIAL_ADDRESS' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressHtml1}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'VILLAGE_NAME' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.villageName}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'POST_OFFICE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.postOffice}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'DISTRICT' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.district}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'PIN_CODE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.pincode}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'MOBILE_PHONE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.mobilePhone}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'LANDLINE_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.landLineNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProof}}" + '</td> </tr>' +
                                            '</tbody>' +
                                            '</table>',
                            }, ]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc2ProofType",
                                "title": "KYC2_PROOF_TYPE",
                                type: "select",
                                "enumCode": "identity_proof"
                            }, {
                                key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc2ProofNumber",
                                "title": "KYC2_PROOF_NUMBER",
                                type: "barcode",
                                onCapture: function(result, model, form) {
                                    $log.info(result);
                                    model.customer.identityProofNo = result.text;
                                }
                            }, {
                                "title": "KYC1_PROOF_DOCUMENT_FRONT_SIDE",
                                key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc2ImagePath",
                                "title": "KYC2_PROOF_DOCUMENT",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "KYC1",
                                "section": '<table class="table" id="lightbox-text" style="display: inline;">' +
                                            '<tbody>' +
                                            '<tr> <td></td> <td>'+"{{ 'aadhaarNo' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.aadhaarNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'IDENTITY_PROOFNO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.identityProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'CUSTOMER_RESIDENTIAL_ADDRESS' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressHtml1}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'VILLAGE_NAME' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.villageName}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'POST_OFFICE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.postOffice}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'DISTRICT' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.district}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'PIN_CODE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.pincode}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'MOBILE_PHONE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.mobilePhone}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'LANDLINE_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.landLineNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProof}}" + '</td> </tr>' +
                                            '</tbody>' +
                                            '</table>',
                            }, {
                                key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc2ReverseImagePath",
                                "title": "KYC2_PROOF_DOCUMENT_BACK_SIDE",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "KYC1",
                                "section": '<table class="table" id="lightbox-text" style="display: inline;">' +
                                            '<tbody>' +
                                            '<tr> <td></td> <td>'+"{{ 'aadhaarNo' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.aadhaarNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'IDENTITY_PROOFNO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.identityProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProofNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'CUSTOMER_RESIDENTIAL_ADDRESS' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressHtml1}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'VILLAGE_NAME' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.villageName}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'POST_OFFICE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.postOffice}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'DISTRICT' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.district}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'PIN_CODE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.pincode}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'MOBILE_PHONE' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.mobilePhone}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'LANDLINE_NO' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.landLineNo}}" + '</td> </tr>' +
                                            '<tr> <td></td> <td>'+"{{ 'ADDRESS_PROOF' |translate}}"+'</td> <td>' + "{{model.group.jlgGroupMembers[arrayIndexes[0]].customer.addressProof}}" + '</td> </tr>' +
                                            '</tbody>' +
                                            '</table>',
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
                                "title": "ACCOUNT_NUMBER",
                                "key": "group.jlgGroupMembers[].loanAccount.accountNumber", // TODO: loan appl. date, loan tenure, loan appl. file, 
                                "type": "string"
                            }, {
                                "title": "PRODUCT",
                                "key": "group.productCode" // TODO: this should be product name
                            }, {
                                "title": "GROUP_CODE",
                                "key": "group.groupCode" //loanCycle TODO: this should be product name
                            }, {
                                "title": "LOAN_AMOUNT",
                                "key": "group.jlgGroupMembers[].loanAccount.loanAmount", // TODO: loan appl. date, loan tenure, loan appl. file, 
                                //"type": "amount"
                            }, {
                                "title": "LOAN_CYCLE",
                                "key": "group.jlgGroupMembers[].loanCycle" // TODO: loan appl. date, loan tenure, loan appl. file, 
                            }, {
                                "title": "TENURE",
                                "key": "group.jlgGroupMembers[].loanAccount.tenure",
                            }, {
                                "key": "group.jlgGroupMembers[].loanAccount.frequency",
                                "type": "select",
                                "title": "FREQUENCY",
                                "enumCode": "loan_product_frequency"
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
                        }]
                    }, {
                        "type": "section",
                        "html": '<hr>'
                    },
                    {
                        "type": "section",
                        //"condition":"model.group.partnerCode=='AXIS'",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            condition: "model.group.jlgGroupMembers[arrayIndex].teleCallingDetails.length",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                type: "tableview",
                                listStyle: "table",
                                key: "group.jlgGroupMembers[].teleCallingDetails",
                                "title": "TELE_CALLING_HISTORY",
                                selectable: false,
                                expandable: true,
                                paginate: false,
                                searching: false,
                                getColumns: function() {
                                    return [{
                                        title: 'IS_CUSTOMER_CALLED',
                                        data: 'customerCalled'
                                    }, {
                                        title: 'CUSTOMER_CALLED_DATE',
                                        data: 'customerCalledAt1'
                                    }, {
                                        title: 'CUSTOMER_CALLED_BY',
                                        data: 'customerCalledBy'
                                    }, {
                                        title: 'REMARKS',
                                        data: 'remarks'
                                    },
                                    {
                                        title: 'Additional Remarks',
                                        data: 'telecallingRemarks'
                                    }
                                    ]
                                },
                                getActions: function(item) {
                                    return [];
                                }
                            }]
                        }]
                    },
                    {
                        "type": "section",
                        "htmlClass": "col-sm-12",
                        "items": [{
                            "type": "section",
                            "html": '<hr>'
                        },{
                            "type": "section",
                            "html": '<hr>'
                        }]
                    }, 
                    {
                        "type": "section",
                        "htmlClass": "col-sm-12",
                        "items": [{
                            "title": "DSC_STATUS",
                            "readonly": true,
                            "key": "group.jlgGroupMembers[].dscStatus",
                            "type": "text"
                        }, {
                            "key": "group.jlgGroupMembers[].dscOverrideRemarks",
                            "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDDEN'",
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
                            "title": "CHECKER_FILE_DOWNLOAD",
                            readonly: true,
                            "key": "group.jlgGroupMembers[].loanAccount.chk1FileUploadId",
                            "type": "file",
                            "fileType": "application/pdf,image/*,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "category": "Group",
                            "subCategory": "DOC1"
                        }, {
                            "type": "section",
                            "html": '<hr>'
                        }, {
                            "key": "group.jlgGroupMembers[].loanAccount.bcAccount.agreementFileId",
                            readonly: true,
                            "title": "AGREEMENT_DOWNLOAD",
                            "type": "file",
                            "fileType": "application/pdf,image/*,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "category": "Group",
                            "subCategory": "AGREEMENT"
                        }, {
                            "type": "section",
                            "html": '<hr>'
                        }]
                    }]
                }]
            },
	/*{
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
            },*/
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
        "type": "box",
        "title": "POST_REVIEW",
        "items": [{
                key: "action",
                type: "radios",
                titleMap: {
                    "APPROVE": "Approve",
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
                    }, /*{
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
                    },*/
                    {
                        "type": "button",
                        "title": "REJECT",
                        "onClick": "actions.reject(model,formCtrl, form)"
                    }
                ]
            },
            {
                type: "section",
                condition: "model.action=='SEND_BACK'&& model.siteCode == 'sambandh'",
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
                                if (t.name == stage1 && 'reject' != t.field2) {
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
                condition: "model.action=='APPROVE'",
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
        viewCustomer: function(model, formCtrl, form, $event) {
            Utils.confirm("Save the data before proceed").then(function() {
                $log.info("Inside ViewCustomer()");
                irfNavigator.go({
                    state: "Page.Engine",
                    pageName:"customer360.EnrollmentProfile",
                    pageId: model.group.jlgGroupMembers[form.arrayIndex].customer.id,
                    pageData: {
                        "siteCode":model.siteCode,
                        "enabletrue":true
                    }
                }, {
                    state: "Page.Engine",
                    pageName: $stateParams.pageName,
                    pageId: $stateParams.pageId,
                    pageData: $stateParams.pageData
                });
            })
        },
        saveGroup: function(model, formCtrl, form) {
            $log.info("Inside submit()");
            if(!validateForm(formCtrl)) 
                return;
            PageHelper.showLoader();
            model.group.endTime= new Date();
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
            model.group.checkerTransactionHistoryDTO.status="REJECT";
            model.group.checkerTransactionHistoryDTO.remarks=model.group.groupRemarks;
            model.group.endTime= new Date();
            var reqData = _.cloneDeep(model);
            reqData.groupAction = 'PROCEED';
            reqData.stage = "AgreementUploadPending";
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
            model.group.checkerTransactionHistoryDTO.status="ACCEPT";
            model.group.checkerTransactionHistoryDTO.remarks=model.group.groupRemarks;
            model.group.endTime= new Date();
            model.groupAction = "PROCEED";
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