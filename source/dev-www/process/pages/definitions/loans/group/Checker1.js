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
            model.group.cgtDate11 = moment(model.group.cgtDate1).format("DD-MM-YYYY HH:mm:ss");
            model.group.cgtEndDate11 = moment(model.group.cgtEndDate1).format("DD-MM-YYYY HH:mm:ss");
            model.group.cgtDate12 = moment(model.group.cgtDate2).format("DD-MM-YYYY HH:mm:ss");
            model.group.cgtEndDate12 = moment(model.group.cgtEndDate2).format("DD-MM-YYYY HH:mm:ss");
            model.group.cgtDate13 = moment(model.group.cgtDate3).format("DD-MM-YYYY HH:mm:ss");
            model.group.cgtEndDate13 = moment(model.group.cgtEndDate3).format("DD-MM-YYYY HH:mm:ss");
            model.group.grtDate1 = moment(model.group.grtDate).format("DD-MM-YYYY HH:mm:ss");
            model.group.grtEndDate1 = moment(model.group.grtEndDate).format("DD-MM-YYYY HH:mm:ss");
            $log.info(model);
        };

        var validateForm = function(formCtrl) {
            formCtrl.scope.$broadcast('schemaFormValidate');
            if (formCtrl && formCtrl.$invalid) {
                PageHelper.showProgress("Checker", "Your form have errors. Please fix them.", 5000);
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
    "title": "Checker 1",
    "subTitle": "",
    initialize: function(model, form, formCtrl) {
        var self = this;
        model.review = model.review || {};
        model.siteCode = SessionStore.getGlobalSetting('siteCode');
        model.additions = {};
        model.additions.isLoadComplete = false;
        model.additions.loaderTitleHtml = "<p><centre>Loading Customer Data...</centre><p>"
        if ($stateParams.pageId) {
            var groupId = $stateParams.pageId;
            PageHelper.showLoader();
            irfProgressMessage.pop("checker1", "Loading, Please Wait...");
            GroupProcess.getGroup({
                groupId: groupId
            }, function(response) {
                model.group = response;
                model.group.groupRemarks = null;                           
                model.group.members=[];
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
                    }).finally(function(){
                        // PageHelper.hideLoader();
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
                    }).finally(function(){
                        
                    // irfProgressMessage.pop("checker1", "Loading Customer Completed...",4000);
                    }),
                    Queries.getGroupLoanRemarksHistoryById(model.group.id).then(function(resp){
                        for(i=0;i<resp.length;i++){
                            $log.info("hi");
                            resp[i].updatedOn=moment(resp[i].updatedOn).format("DD-MM-YYYY");
                            $log.info(resp[i].updatedOn);    
                        }
                        model.group.remarksHistory = resp;
                    })
        
                ]).finally(function(resp){
                    PageHelper.hideLoader()
                    model.additions.isLoadComplete = true;
                    irfProgressMessage.pop("checker1", "Loading Customer Completed...",4000);
                    // model.additions.isLoadComplete = true;
                });
            }, function(error) {
                PageHelper.showErrors(error);
                PageHelper.hideLoader();
                irfProgressMessage.pop("checker1", "Oops. An error occurred", 2000);
            });
            PageHelper.hideLoader();
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
                "title": "CENTRE_NAME",
                "type": "select",
                readonly: true,
                "enumCode": "centre_code",
                "parentEnumCode": "branch_id",
                "parentValueExpr": "model.group.branchId",
                    //readonly: readonly
            },
            {
                type: "section",
                "htmlClass": "row",
                title: "MEMBER_DETAILSS",
                "items": [{
                    "type": "section",
                    "htmlClass": "col-sm-12",
                    "items": [{
                        type: "tableview",
                        htmlClass: "table-striped",
                        listStyle: "table",
                        key: "group.members",
                        title: "MEMBER_DETAILS",
                        selectable: false,
                        expandable: true,
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
                                title:'Spouse Name',
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
                "type":"section",
                "condition":"!model.additions.isLoadComplete",
                "items":[
                    {
                        "type":"html",
                        "key":"model.additions.loaderTitleHtml",
                    },
                    {
                        "type":"section",
                        "html":'<div class="lds-css"><div style="width:100%;height:100%" class="lds-ripple"><div ng-style="{"border-color:#ffffff"}"></div><div ng-style="bc"></div></div><style type="text/css">.lds-css{width:200px;height:150px;margin:auto;transform:scale(.5)}@-webkit-keyframes lds-ripple{0%{top:90px;left:90px;width:0;height:0;opacity:1;}100%{top:15px;left:15px;width:150px;height:150px;opacity:0;}}@keyframes lds-ripple{0%{top:90px;left:90px;width:0;height:0;opacity:1;}100%{top:15px;left:15px;width:150px;height:150px;opacity:0;}}.lds-ripple{position:relative;}.lds-ripple div{box-sizing:content-box;position:absolute;border-width:10px;border-style:solid;opacity:1;border-radius:50%;-webkit-animation:lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;animation:lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;}.lds-ripple div:nth-child(2){-webkit-animation-delay:-0.5s;animation-delay:-0.5s;}</style></div>',
                    }
                ]
                // "html":"model.additions.riperLoaderHtml",
                
            },
            {
                "type": "array",
                "condition": "model.siteCode == 'KGFS' && model.additions.isLoadComplete",
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
                                "subCategory": "PHOTO",
                                "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
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
                                "enumCode": "identity_proof",

                            }, {
                                "title": "IDENTITY_PROOF_DOCUMENT",
                                "key": "group.jlgGroupMembers[].customer.identityProofImageId",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "IDENTITYPROOF",
                                "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
                                "lightboxHtml": '<table class="table" style="margin-bottom:0">' +
                                    '<tbody ng-init="c = model.group.jlgGroupMembers[arrayIndexes[0]].customer">' +
                                    '<tr><td>{{ "aadhaarNo" |translate}}</td> <td>{{c.aadhaarNo}}</td> <td rowspan="11">__IMAGE__</td> </tr>' +
                                    '<tr><td>{{ "IDENTITY_PROOFNO" |translate}}</td> <td>{{c.identityProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF_NO" |translate}}</td> <td>{{c.addressProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "CUSTOMER_RESIDENTIAL_ADDRESS" |translate}}</td> <td>{{c.addressHtml1}}</td> </tr>' +
                                    '<tr><td>{{ "VILLAGE_NAME" |translate}}</td> <td>{{c.villageName}}</td> </tr>' +
                                    '<tr><td>{{ "POST_OFFICE" |translate}}</td> <td>{{c.postOffice}}</td> </tr>' +
                                    '<tr><td>{{ "DISTRICT" |translate}}</td> <td>{{c.district}}</td> </tr>' +
                                    '<tr><td>{{ "PIN_CODE" |translate}}</td> <td>{{c.pincode}}</td> </tr>' +
                                    '<tr><td>{{ "MOBILE_PHONE" |translate}}</td> <td>{{c.mobilePhone}}</td> </tr>' +
                                    '<tr><td>{{ "LANDLINE_NO" |translate}}</td> <td>{{c.landLineNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF" |translate}}</td> <td>{{c.addressProof}}</td> </tr>' +
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
                                "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
                                "category": "CustomerEnrollment",
                                "subCategory": "IDENTITYPROOF",
                                "lightboxHtml": '<table class="table" style="margin-bottom:0">' +
                                    '<tbody ng-init="c = model.group.jlgGroupMembers[arrayIndexes[0]].customer">' +
                                    '<tr><td>{{ "aadhaarNo" |translate}}</td> <td>{{c.aadhaarNo}}</td> <td rowspan="11">__IMAGE__</td> </tr>' +
                                    '<tr><td>{{ "IDENTITY_PROOFNO" |translate}}</td> <td>{{c.identityProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF_NO" |translate}}</td> <td>{{c.addressProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "CUSTOMER_RESIDENTIAL_ADDRESS" |translate}}</td> <td>{{c.addressHtml1}}</td> </tr>' +
                                    '<tr><td>{{ "VILLAGE_NAME" |translate}}</td> <td>{{c.villageName}}</td> </tr>' +
                                    '<tr><td>{{ "POST_OFFICE" |translate}}</td> <td>{{c.postOffice}}</td> </tr>' +
                                    '<tr><td>{{ "DISTRICT" |translate}}</td> <td>{{c.district}}</td> </tr>' +
                                    '<tr><td>{{ "PIN_CODE" |translate}}</td> <td>{{c.pincode}}</td> </tr>' +
                                    '<tr><td>{{ "MOBILE_PHONE" |translate}}</td> <td>{{c.mobilePhone}}</td> </tr>' +
                                    '<tr><td>{{ "LANDLINE_NO" |translate}}</td> <td>{{c.landLineNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF" |translate}}</td> <td>{{c.addressProof}}</td> </tr>' +
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
                                "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
                                "subCategory": "ADDRESSPROOF",
                                "lightboxHtml": '<table class="table" style="margin-bottom:0">' +
                                    '<tbody ng-init="c = model.group.jlgGroupMembers[arrayIndexes[0]].customer">' +
                                    '<tr><td>{{ "aadhaarNo" |translate}}</td> <td>{{c.aadhaarNo}}</td> <td rowspan="11">__IMAGE__</td> </tr>' +
                                    '<tr><td>{{ "IDENTITY_PROOFNO" |translate}}</td> <td>{{c.identityProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF_NO" |translate}}</td> <td>{{c.addressProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "CUSTOMER_RESIDENTIAL_ADDRESS" |translate}}</td> <td>{{c.addressHtml1}}</td> </tr>' +
                                    '<tr><td>{{ "VILLAGE_NAME" |translate}}</td> <td>{{c.villageName}}</td> </tr>' +
                                    '<tr><td>{{ "POST_OFFICE" |translate}}</td> <td>{{c.postOffice}}</td> </tr>' +
                                    '<tr><td>{{ "DISTRICT" |translate}}</td> <td>{{c.district}}</td> </tr>' +
                                    '<tr><td>{{ "PIN_CODE" |translate}}</td> <td>{{c.pincode}}</td> </tr>' +
                                    '<tr><td>{{ "MOBILE_PHONE" |translate}}</td> <td>{{c.mobilePhone}}</td> </tr>' +
                                    '<tr><td>{{ "LANDLINE_NO" |translate}}</td> <td>{{c.landLineNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF" |translate}}</td> <td>{{c.addressProof}}</td> </tr>' +
                                    '</tbody>' +
                                    '</table>',
                            }, {
                                "title": "ADDRESS_PROOF_REVERSE_IMAGE_ID",
                                "key": "group.jlgGroupMembers[].customer.addressProofReverseImageId",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "ADDRESSPROOF",
                                "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
                                "lightboxHtml": '<table class="table" style="margin-bottom:0">' +
                                    '<tbody ng-init="c = model.group.jlgGroupMembers[arrayIndexes[0]].customer">' +
                                    '<tr><td>{{ "aadhaarNo" |translate}}</td> <td>{{c.aadhaarNo}}</td> <td rowspan="11">__IMAGE__</td> </tr>' +
                                    '<tr><td>{{ "IDENTITY_PROOFNO" |translate}}</td> <td>{{c.identityProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF_NO" |translate}}</td> <td>{{c.addressProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "CUSTOMER_RESIDENTIAL_ADDRESS" |translate}}</td> <td>{{c.addressHtml1}}</td> </tr>' +
                                    '<tr><td>{{ "VILLAGE_NAME" |translate}}</td> <td>{{c.villageName}}</td> </tr>' +
                                    '<tr><td>{{ "POST_OFFICE" |translate}}</td> <td>{{c.postOffice}}</td> </tr>' +
                                    '<tr><td>{{ "DISTRICT" |translate}}</td> <td>{{c.district}}</td> </tr>' +
                                    '<tr><td>{{ "PIN_CODE" |translate}}</td> <td>{{c.pincode}}</td> </tr>' +
                                    '<tr><td>{{ "MOBILE_PHONE" |translate}}</td> <td>{{c.mobilePhone}}</td> </tr>' +
                                    '<tr><td>{{ "LANDLINE_NO" |translate}}</td> <td>{{c.landLineNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF" |translate}}</td> <td>{{c.addressProof}}</td> </tr>' +
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
                                "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
                                "lightboxHtml": '<table class="table" style="margin-bottom:0">' +
                                    '<tbody ng-init="c = model.group.jlgGroupMembers[arrayIndexes[0]].customer">' +
                                    '<tr><td>{{ "aadhaarNo" |translate}}</td> <td>{{c.aadhaarNo}}</td> <td rowspan="11">__IMAGE__</td> </tr>' +
                                    '<tr><td>{{ "IDENTITY_PROOFNO" |translate}}</td> <td>{{c.identityProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF_NO" |translate}}</td> <td>{{c.addressProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "CUSTOMER_RESIDENTIAL_ADDRESS" |translate}}</td> <td>{{c.addressHtml1}}</td> </tr>' +
                                    '<tr><td>{{ "VILLAGE_NAME" |translate}}</td> <td>{{c.villageName}}</td> </tr>' +
                                    '<tr><td>{{ "POST_OFFICE" |translate}}</td> <td>{{c.postOffice}}</td> </tr>' +
                                    '<tr><td>{{ "DISTRICT" |translate}}</td> <td>{{c.district}}</td> </tr>' +
                                    '<tr><td>{{ "PIN_CODE" |translate}}</td> <td>{{c.pincode}}</td> </tr>' +
                                    '<tr><td>{{ "MOBILE_PHONE" |translate}}</td> <td>{{c.mobilePhone}}</td> </tr>' +
                                    '<tr><td>{{ "LANDLINE_NO" |translate}}</td> <td>{{c.landLineNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF" |translate}}</td> <td>{{c.addressProof}}</td> </tr>' +
                                    '</tbody>' +
                                    '</table>',
                            }, {
                                key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc1ReverseImagePath",
                                "title": "KYC1_PROOF_DOCUMENT_BACK_SIDE",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "KYC1",
                                "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
                                "lightboxHtml": '<table class="table" style="margin-bottom:0">' +
                                    '<tbody ng-init="c = model.group.jlgGroupMembers[arrayIndexes[0]].customer">' +
                                    '<tr><td>{{ "aadhaarNo" |translate}}</td> <td>{{c.aadhaarNo}}</td> <td rowspan="11">__IMAGE__</td> </tr>' +
                                    '<tr><td>{{ "IDENTITY_PROOFNO" |translate}}</td> <td>{{c.identityProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF_NO" |translate}}</td> <td>{{c.addressProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "CUSTOMER_RESIDENTIAL_ADDRESS" |translate}}</td> <td>{{c.addressHtml1}}</td> </tr>' +
                                    '<tr><td>{{ "VILLAGE_NAME" |translate}}</td> <td>{{c.villageName}}</td> </tr>' +
                                    '<tr><td>{{ "POST_OFFICE" |translate}}</td> <td>{{c.postOffice}}</td> </tr>' +
                                    '<tr><td>{{ "DISTRICT" |translate}}</td> <td>{{c.district}}</td> </tr>' +
                                    '<tr><td>{{ "PIN_CODE" |translate}}</td> <td>{{c.pincode}}</td> </tr>' +
                                    '<tr><td>{{ "MOBILE_PHONE" |translate}}</td> <td>{{c.mobilePhone}}</td> </tr>' +
                                    '<tr><td>{{ "LANDLINE_NO" |translate}}</td> <td>{{c.landLineNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF" |translate}}</td> <td>{{c.addressProof}}</td> </tr>' +
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
                                "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
                                "lightboxHtml": '<table class="table" style="margin-bottom:0">' +
                                    '<tbody ng-init="c = model.group.jlgGroupMembers[arrayIndexes[0]].customer">' +
                                    '<tr><td>{{ "aadhaarNo" |translate}}</td> <td>{{c.aadhaarNo}}</td> <td rowspan="11">__IMAGE__</td> </tr>' +
                                    '<tr><td>{{ "IDENTITY_PROOFNO" |translate}}</td> <td>{{c.identityProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF_NO" |translate}}</td> <td>{{c.addressProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "CUSTOMER_RESIDENTIAL_ADDRESS" |translate}}</td> <td>{{c.addressHtml1}}</td> </tr>' +
                                    '<tr><td>{{ "VILLAGE_NAME" |translate}}</td> <td>{{c.villageName}}</td> </tr>' +
                                    '<tr><td>{{ "POST_OFFICE" |translate}}</td> <td>{{c.postOffice}}</td> </tr>' +
                                    '<tr><td>{{ "DISTRICT" |translate}}</td> <td>{{c.district}}</td> </tr>' +
                                    '<tr><td>{{ "PIN_CODE" |translate}}</td> <td>{{c.pincode}}</td> </tr>' +
                                    '<tr><td>{{ "MOBILE_PHONE" |translate}}</td> <td>{{c.mobilePhone}}</td> </tr>' +
                                    '<tr><td>{{ "LANDLINE_NO" |translate}}</td> <td>{{c.landLineNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF" |translate}}</td> <td>{{c.addressProof}}</td> </tr>' +
                                    '</tbody>' +
                                    '</table>',
                            }, {
                                key: "group.jlgGroupMembers[].customer.additionalKYCs[].kyc2ReverseImagePath",
                                "title": "KYC2_PROOF_DOCUMENT_BACK_SIDE",
                                "type": "file",
                                "fileType": "image/*",
                                "category": "CustomerEnrollment",
                                "subCategory": "KYC1",
                                "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
                                "lightboxHtml": '<table class="table" style="margin-bottom:0">' +
                                    '<tbody ng-init="c = model.group.jlgGroupMembers[arrayIndexes[0]].customer">' +
                                    '<tr><td>{{ "aadhaarNo" |translate}}</td> <td>{{c.aadhaarNo}}</td> <td rowspan="11">__IMAGE__</td> </tr>' +
                                    '<tr><td>{{ "IDENTITY_PROOFNO" |translate}}</td> <td>{{c.identityProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF_NO" |translate}}</td> <td>{{c.addressProofNo}}</td> </tr>' +
                                    '<tr><td>{{ "CUSTOMER_RESIDENTIAL_ADDRESS" |translate}}</td> <td>{{c.addressHtml1}}</td> </tr>' +
                                    '<tr><td>{{ "VILLAGE_NAME" |translate}}</td> <td>{{c.villageName}}</td> </tr>' +
                                    '<tr><td>{{ "POST_OFFICE" |translate}}</td> <td>{{c.postOffice}}</td> </tr>' +
                                    '<tr><td>{{ "DISTRICT" |translate}}</td> <td>{{c.district}}</td> </tr>' +
                                    '<tr><td>{{ "PIN_CODE" |translate}}</td> <td>{{c.pincode}}</td> </tr>' +
                                    '<tr><td>{{ "MOBILE_PHONE" |translate}}</td> <td>{{c.mobilePhone}}</td> </tr>' +
                                    '<tr><td>{{ "LANDLINE_NO" |translate}}</td> <td>{{c.landLineNo}}</td> </tr>' +
                                    '<tr><td>{{ "ADDRESS_PROOF" |translate}}</td> <td>{{c.addressProof}}</td> </tr>' +
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
                        "condition": "model.group.partnerCode=='AXIS'",
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
                                            "titleMap": {
                                                "Yes": "Yes",
                                                "No": "No"
                                            }
                                        },{
                                            "title": "CUSTOMER_CALLED_REMARKS",
                                            "condition": "model.group.jlgGroupMembers[arrayIndex].customerCalled == 'Yes'",
                                            "key": "group.jlgGroupMembers[].customerNotCalledRemarks",
                                            "enumCode": "customerTelecallingDetails",
                                            "type": "select"
                                        },{
                                            "title": "CUSTOMER_NOT_CALLED_REASON",
                                            "key": "group.jlgGroupMembers[].customerNotCalledReason",
                                            "condition": "model.group.jlgGroupMembers[arrayIndex].customerCalled == 'No'"
                                        },{
                                            "title": "Additional Remarks",
                                            "key": "group.jlgGroupMembers[].telecallingRemarks",
                                            "condition": "model.group.jlgGroupMembers[arrayIndex].customerCalled == 'Yes'"
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
                                                reqData.telecallingRemarks = model.group.jlgGroupMembers[event.arrayIndex].telecallingRemarks;
                                                var temp1 = [];
                                                temp1.push(reqData.customerNotCalledRemarks);
                                                temp1.push(reqData.telecallingRemarks);
                                                reqData.customerNotCalledRemarks = temp1.join('<br>');

                                                GroupProcess.telecalling(reqData).$promise.then(function(response) {
                                                    $log.info(response);
                                                    model.group.jlgGroupMembers[event.arrayIndex].teleCallingDetails = JSON.parse(angular.toJson(response));
                                                    model.group.jlgGroupMembers[event.arrayIndex].customerCalled = false;
                                                    model.group.jlgGroupMembers[event.arrayIndex].customerNotCalledReason = undefined;
                                                    model.group.jlgGroupMembers[event.arrayIndex].customerNotCalledRemarks = undefined;

                                                    var arraymember = model.group.jlgGroupMembers[event.arrayIndex];

                                                    for (j in arraymember.teleCallingDetails) {
                                                        var telecal = arraymember.teleCallingDetails[j];
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
                                                }).finally(function() {
                                                    PageHelper.hideLoader();
                                                })
                                            }
                                        }]
                                    }]
                                },
                            {
                                "type": "section",
                                condition: "model.group.jlgGroupMembers[arrayIndex].teleCallingDetails.length",
                                "htmlClass": "col-sm-6",
                                "items": [
                                {
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
                                }
                                ]
                            }]
                        }, {
                            "type": "section",
                            "htmlClass": "col-sm-12",
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
                    }, 
                {
                "type": "array",
                "key": "group.jlgGroupMembers",
                "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
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
                                "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
                                "category": "CustomerEnrollment",
                                "subCategory": "IDENTITYPROOF"
                            }, {
                                "title": "IDENTITY_PROOF_REVERSE_DOCUMENT",
                                "key": "group.jlgGroupMembers[].customer.identityProofReverseImageId",
                                "type": "file",
                                "fileType": "image/*",
                                "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
                                "category": "CustomerEnrollment",
                                "subCategory": "IDENTITYPROOF"
                            }]
                        }]
                    }, 
                    {
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
                                "latitudeExpr": "model.group.jlgGroupMembers[arrayIndexes[0]].customer.latitude",
                                "longitudeExpr": "model.group.jlgGroupMembers[arrayIndexes[0]].customer.longitude"
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
                                "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
                                "category": "CustomerEnrollment",
                                "subCategory": "ADDRESSPROOF"
                            }, {
                                "title": "ADDRESS_PROOF_REVERSE_IMAGE_ID",
                                "key": "group.jlgGroupMembers[].customer.addressProofReverseImageId",
                                "type": "file",
                                "fileType": "image/*",
                                "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
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
                                    "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
                                    "category": "CustomerEnrollment",
                                    "subCategory": "KYC1"
                                },
                                {
                                    key:"group.jlgGroupMembers[].customer.additionalKYCs[].kyc1ReverseImagePath",
                                    "title": "KYC1_PROOF_DOCUMENT_BACK_SIDE",
                                    "type": "file",
                                    "fileType": "image/*",
                                    "viewParams": function(modelValue, form, model,context) {
                                    return {
                                        customerId: model.group.jlgGroupMembers[context.arrayIndexes[0]].customer.id
                                    };
                                },
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
                                condition: "model.group.jlgGroupMembers[arrayIndex].loanAccount",
                                "key": "group.jlgGroupMembers[].loanAccount.accountNumber", // TODO: loan appl. date, loan tenure, loan appl. file, 
                                "type": "string"
                            }, {
                                "title": "PRODUCT",
                                "key": "group.productCode" // TODO: this should be product name
                            }, {
                                "title": "LOAN_AMOUNT",
                                condition: "model.group.jlgGroupMembers[arrayIndex].loanAccount",
                                "key": "group.jlgGroupMembers[].loanAccount.loanAmount", // TODO: loan appl. date, loan tenure, loan appl. file, 
                                //"type": "amount"
                            }, {
                                "title": "TENURE",
                                condition: "model.group.jlgGroupMembers[arrayIndex].loanAccount",
                                "key": "group.jlgGroupMembers[].loanAccount.tenure",
                                "type": "date"
                            },{
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
                                view: "fixed",
                                "items": [
                                    {
                                        "title": "IS_CUSTOMER_CALLED",
                                        "key": "group.jlgGroupMembers[].teleCallingDetails[].customerCalled",
                                        "type":"string",
                                    },
                                    {
                                        "title": "CUSTOMER_CALLED_DATE",
                                        "key": "group.jlgGroupMembers[].teleCallingDetails[].customerCalledAt",
                                        //"type":"date"
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
                "condition": "model.siteCode == 'KGFS'",
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
                    }]
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
        "type": "box",
        "title": "POST_REVIEW",
        "items": [
                {
                    key: "action",
                    type: "radios",
                    titleMap: {
                        "APPROVE": "Approve",
                        "REJECT": "REJECT",
                        "SEND_BACK": "SEND_BACK",
                    },
                    "condition": "model.siteCode != 'KGFS'",
                    onChange: function(modelValue, form, model, formCtrl, event) {
                        if(model.action == 'PROCEED') {
                            return;
                        }
                        var stage1 = model.group.currentStage;
                        var targetstage = formHelper.enum('groupLoanBackStages').data;
                        var out = [];
                        var cnt = 0;
                        for (var i = 0; i < targetstage.length; i++) {
                            var t = targetstage[i];
                            if (t.name == stage1) {
                                if('default' == t.field2) {
                                    model.review.targetStage = t.field1;
                                    cnt++;
                                }
                                if('reject' == t.field2) {
                                    model.review.rejectStage = t.field1;
                                    cnt++;
                                }
                                if(cnt == 2) break;
                            }
                        }
                    }
                },
                {
                    key: "action",
                    type: "radios",
                    titleMap: {
                        "APPROVE": "Approve",
                        "REJECT": "REJECT"
                    },
                    "condition": "model.siteCode == 'KGFS'",
                    onChange: function(modelValue, form, model, formCtrl, event) {
                        if(model.action == 'PROCEED') {
                            return;
                        }
                        var stage1 = model.group.currentStage;
                        var targetstage = formHelper.enum('groupLoanBackStages').data;
                        var out = [];
                        var cnt = 0;
                        for (var i = 0; i < targetstage.length; i++) {
                            var t = targetstage[i];
                            if (t.name == stage1) {
                                if('default' == t.field2) {
                                    model.review.targetStage = t.field1;
                                    cnt++;
                                }
                                if('reject' == t.field2) {
                                    model.review.rejectStage = t.field1;
                                    cnt++;
                                }
                                if(cnt == 2) break;
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
                                var stage1 = model.group.currentStage;
                                var targetstage = formHelper.enum('groupLoanBackStages').data;
                                var out = [];
                                for (var i = 0; i < targetstage.length; i++) {
                                    var t = targetstage[i];
                                    if (t.name == stage1 && 'reject' == t.field2) {
                                        out.push({
                                            name: t.field1,
                                        });
                                        break;
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
    /*{
        "type": "actionbox",
        "items": [{
            "type": "button",
            "title": "SAVE",
            "onClick": "actions.saveGroup(model,formCtrl, form)"
        },]
    }*/],
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
        submit: function(model, formCtrl, formName) {},
        saveGroup: function(model, formCtrl, form) {
            PageHelper.showLoader();
            $log.info("Inside submit()");
            if(!validateForm(formCtrl)) {
                PageHelper.hideLoader();
                return;
            }
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
        viewCustomer: function(model, formCtrl, form, $event) {
            //pageName:"customer360.EnrollmentProfile",
            Utils.confirm("Save the data before proceed").then(function() {
                $log.info("Inside ViewCustomer()");
                irfNavigator.go({
                    state: "Page.Customer360", 
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
        sendBack: function(model, form, formName) {
            PageHelper.showLoader();
            if (!model.review.targetStage){
                PageHelper.hideLoader();
                irfProgressMessage.pop('Send Back', "Send to Stage is mandatory", 2000);
                return false;
            }
            irfProgressMessage.pop('Send Back', 'Working...');
            PageHelper.clearErrors();
            model.groupAction = "PROCEED";  
            model.group.endTime= new Date();                  
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
            PageHelper.showLoader();
            $log.info("Inside submit()");
            if(!validateForm(formCtrl)) {
                PageHelper.hideLoader();
                return;
            }
            model.group.checkerTransactionHistoryDTO.status="REJECT";
            model.group.checkerTransactionHistoryDTO.remarks=model.group.groupRemarks;
            model.group.endTime= new Date();
            var reqData = _.cloneDeep(model);
            reqData.groupAction = 'PROCEED';
            reqData.stage = model.review.rejectStage;
            reqData.group.cgtDate11 = '';
            reqData.group.cgtEndDate11 = '';
            reqData.group.cgtDate12 = '';
            reqData.group.cgtEndDate12 = '';
            reqData.group.cgtDate13 = '';
            reqData.group.cgtEndDate13 = '';
            reqData.group.grtDate1 = '';
            reqData.group.grtEndDate1 = '';
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
            PageHelper.showLoader();
            if(!validateForm(formCtrl)) {
                PageHelper.hideLoader();
                return;
            }
            irfProgressMessage.pop('CHECKER-proceed', 'Working...');
            PageHelper.clearErrors();
            model.groupAction = "PROCEED";
            if(model.siteCode == 'sambandh') {
                var totalAmt = 0;
                for(var itr = 0 ; itr < model.group.jlgGroupMembers.length; itr++) {
                    totalAmt += model.group.jlgGroupMembers[itr].loanAmount;
                }
                if(totalAmt < 250000.00) {
                    model.stage = "CGT1";
                }
            }
            model.group.checkerTransactionHistoryDTO.status="ACCEPT";
            model.group.checkerTransactionHistoryDTO.remarks=model.group.groupRemarks;
            model.group.endTime= new Date();
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
