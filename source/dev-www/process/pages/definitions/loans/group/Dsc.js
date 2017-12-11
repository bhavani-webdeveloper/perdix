define({
    pageUID: "loans.group.Dsc",
    pageType: "Engine",
    dependencies: ["$log", "irfSimpleModal", "Groups","GroupProcess", "Enrollment", "CreditBureau", "Journal", "$stateParams", "SessionStore", "formHelper", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "irfNavigator"
    ],

    $pageFn: function($log, irfSimpleModal, Groups,GroupProcess, Enrollment, CreditBureau, Journal, $stateParams, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, Queries, irfNavigator) {


        var nDays = 15;

        function showDscData(dscId) {
            PageHelper.showLoader();
            Groups.getDSCData({
                dscId: dscId
            }, function(resp, headers) {
                PageHelper.hideLoader();
                /*var dataHtml = "<table class='table table-striped table-bordered table-responsive'>";
                dataHtml += "<tr><td>Response : </td><td>" + resp.response + "</td></tr>";
                dataHtml += "<tr><td>Response Message: </td><td>" + resp.responseMessage + "</td></tr>";
                dataHtml += "<tr><td>Stop Response: </td><td>" + resp.stopResponse + "</td></tr>";
                dataHtml += "</table>"*/
                irfSimpleModal('DSC Response', resp.responseMessage);
            }, function(res) {
                PageHelper.showErrors(res);
                PageHelper.hideLoader();
            });
        };

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

        var giveDSCOverrideRequest = function(model, formCtrl, form, event) {
            if(!model.group.jlgGroupMembers[form.arrayIndex].dscOverrideRequestRemarks) {
                Utils.alert("DSC Override request remarks is mandatory to Request DSC Oveeride");
                return false;
            }
            console.log(form);
            console.warn(event);
            var i = event['arrayIndex'];
            PageHelper.clearErrors();
            var urnNo = model.group.jlgGroupMembers[i].urnNo;
            PageHelper.showLoader();
            $log.info("Requesting DSC override for ", urnNo);
            irfProgressMessage.pop('group-dsc-override-req', 'Requesting DSC Override');
            Groups.post({
                service: "dscoverriderequest",
                urnNo: urnNo,
                groupCode: model.group.groupCode,
                productCode: model.group.productCode
            }, {}, function(resp, header) {
                $log.warn(resp);
                irfProgressMessage.pop('group-dsc-override-req', 'Almost Done...');
                var screenMode = model.group.screenMode;
                GroupProcess.getGroup({
                    groupId: model.group.id
                }, function(response, headersGetter) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('group-dsc-override-req', 'DSC Override Requested', 2000);
                    model.group = _.cloneDeep(response);
                    fixData(model);
                }, function(resp) {
                    $log.error(resp);
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("group-dsc-override-req", "Oops. An error occurred", 2000);
                    PageHelper.showErrors(resp);
                    fixData(model);
                });
            }, function(resp, header) {
                $log.error(resp);
                PageHelper.hideLoader();
                irfProgressMessage.pop("group-dsc-override-req", "Oops. An error occurred", 2000);
                PageHelper.showErrors(resp);
            });
        }

        return {
            "type": "schema-form",
            "title": "DSC",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.group = model.group || {};
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                model.review = model.review || {};
                var branch1 = formHelper.enum('branch_id').data;
                var centres = SessionStore.getCentres();
                for (var i = 0; i < branch1.length; i++) {
                    if ((branch1[i].value) == model.group.branchId) {
                        model.group.branchName = branch1[i].name;
                    }
                }
                model.group.centreId = model.group.centreId || ((_.isArray(centres) && centres.length > 0) ? centres[0].value : model.group.centreId);
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
                        fixData(model);
                        if (model.group.jlgGroupMembers.length > 0) {
                            fillNames(model).then(function(m) {
                                model = m;
                                Queries.getGroupLoanRemarksHistoryById(model.group.id).then(function(resp){
                                    for (i = 0; i < resp.length; i++) {
                                        $log.info("hi");
                                        resp[i].updatedOn = moment(resp[i].updatedOn).format("DD-MM-YYYY");
                                        $log.info(resp[i].updatedOn);
                                    }
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
                            irfNavigator.goBack();
                        }
                    }, function(resp) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("group-init", "Oops. An error occurred", 2000);
                        irfNavigator.goBack();
                    });
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
                        "key": "group.branchId",
                        "title": "BRANCH_NAME",
                        "type": "select",
                        "required": true,
                        readonly: true,
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
                            //readonly: readonly
                    }, {
                        "key": "group.partnerCode",
                        "title": "PARTNER",
                        "type": "select",
                        "enumCode": "partner"
                            //readonly: readonly
                    }, {
                        "key": "group.productCode",
                        "title": "PRODUCT",
                        "type": "select",
                        "enumCode": "loan_product",
                        "parentEnumCode": "partner",
                        "parentValueExpr": "model.group.partnerCode"
                            //readonly: readonly,
                    }, {
                        "key": "group.frequency",
                        "title": "FREQUENCY",
                        "type": "select",
                        "enumCode": "loan_product_frequency",
                    }, {
                        "key": "group.tenure",
                        "title": "TENURE",
                    }]
                }, {
                    "type": "box",
                    "title": "GROUP_MEMBERS",
                    "condition": "model.siteCode == 'KGFS'",
                    "items": [{
                        "key": "group.jlgGroupMembers",
                        "type": "array",
                        "titleExpr":"model.group.jlgGroupMembers[arrayIndex].urnNo + ' : ' + model.group.jlgGroupMembers[arrayIndex].firstName",
                        "title": "GROUP_MEMBERS",
                        //"condition": "model.group.jlgGroupMembers.length>0",
                        "add": null,
                        "items": [{
                            "key": "group.jlgGroupMembers[].urnNo",
                            "readonly": true,
                            "title": "URN_NO"
                        }, {
                            "key": "group.jlgGroupMembers[].firstName",
                            "readonly": true,
                            "type": "string",
                            //"readonly": true,
                            "title": "GROUP_MEMBER_NAME"
                        }, {
                            "key": "group.jlgGroupMembers[].husbandOrFatherFirstName",
                            "readonly": true,
                            "title": "HUSBAND_OR_FATHER_NAME"
                                //"readonly": readonly
                        }, {
                            "key": "group.jlgGroupMembers[].relation",
                            "readonly": true,
                            "title": "RELATION",
                        }, {
                            "key": "group.jlgGroupMembers[].loanAmount",
                            "readonly": true,
                            "title": "LOAN_AMOUNT",
                            "type": "amount",
                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose1",
                            "readonly": true,
                            "title": "LOAN_PURPOSE_1",
                            "enumCode": "loan_purpose_1",
                            "type": "select",
                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose2",
                            "readonly": true,
                            "type": "string",
                            "title": "LOAN_PURPOSE_2",
                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose3",
                            "readonly": true,
                            "type": "string",
                            "title": "LOAN_PURPOSE3",
                        }, {
                            "key": "group.jlgGroupMembers[].witnessFirstName",
                            "readonly": true,
                            "title": "WITNESS_NAME",
                        }, {
                            "key": "group.jlgGroupMembers[].witnessRelationship",
                            "readonly": true,
                            "title": "RELATION",
                            "type": "select",
                            "enumCode": "relation"
                                //"readonly": readonly
                        }, {
                            type: "fieldset",
                            "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus && model.group.currentStage == 'DSC'",
                            title: "DSC_STATUS",
                            items: [{
                                "key": "group.jlgGroupMembers[].dscStatus",
                                "title": "DSC_STATUS",
                                "readonly": true,
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus"
                            }, {
                                "key": "group.jlgGroupMembers[].dscOverrideRemarks",
                                "condition":"model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDDEN'\
                                 || model.group.jlgGroupMembers[arrayIndex].dscStatus == 'DSC_OVERRIDE_REQUEST_REJECTED'",
                                "title": "DSC_OVERRIDE_REMARKS",
                                "readonly": true,
                            }, {
                                "key": "group.jlgGroupMembers[].requestDSCOverride1",
                                "type": "button",
                                "title": "REQUEST_DSC_OVERRIDE",
                                "icon": "fa fa-reply",
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED' && \
                                !model.group.jlgGroupMembers[arrayIndex].showDSCOverride",
                                "onClick": function(model, formCtrl, form, event) {
                                    model.group.jlgGroupMembers[form.arrayIndex].showDSCOverride = true;                                    
                                },
                            }, {
                                "key": "group.jlgGroupMembers[].dscOverrideRequestRemarks",
                                "type": "textarea",
                                "title": "REQUEST_DSC_OVERRIDE_REMARKS",
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED' && \
                                model.group.jlgGroupMembers[arrayIndex].showDSCOverride",
                            }, {
                                "key": "group.jlgGroupMembers[].dscOverrideRequestFileId",
                                "category": "Group",
                                "subCategory": "DSCREQUESTDOCUMENT",
                                "title": "REQUEST_DSC_OVERRIDE_FILE",
                                "type": "file",
                                "fileType": "application/pdf",
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED' && \
                                model.group.jlgGroupMembers[arrayIndex].showDSCOverride",
                            }, {
                                "key": "group.jlgGroupMembers[].requestDSCOverride",
                                "type": "button",
                                "title": "REQUEST_DSC_OVERRIDE",
                                "icon": "fa fa-reply",
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED' && \
                                model.group.jlgGroupMembers[arrayIndex].showDSCOverride",
                                "onClick": function(model, formCtrl, form, event) {
                                    giveDSCOverrideRequest(model, formCtrl, form, event);
                                },
                            }, {
                                "key": "group.jlgGroupMembers[].getDSCData",
                                "type": "button",
                                "title": "VIEW_DSC_RESPONSE",
                                "icon": "fa fa-eye",
                                "style": "btn-primary",
                                // "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'",
                                "onClick": function(model, formCtrl, form, event) {
                                    console.log(form);
                                    console.warn(event);
                                    var i = event['arrayIndex'];
                                    console.warn("dscid :" + model.group.jlgGroupMembers[i].dscId);
                                    var dscId = model.group.jlgGroupMembers[i].dscId;
                                    showDscData(dscId);
                                }
                            }, /*{
                                "key": "group.jlgGroupMembers[].removeMember",
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'",
                                "type": "button",
                                "title": "REMOVE_MEMBER",
                                "icon": "fa fa-times",
                                "onClick": function(model, formCtrl, form, event) {
                                    console.log(form);
                                    console.warn(event);
                                    var i = event['arrayIndex'];
                                    var urnNo = model.group.jlgGroupMembers[i].urnNo;
                                    $log.warn("Remove member from grp ", urnNo);
                                    if (window.confirm("Are you sure?")) {
                                        PageHelper.showLoader();
                                        PageHelper.clearErrors();
                                        irfProgressMessage.pop('group-dsc-remove-req', 'Removing Group Member...');
                                        Groups.get({
                                                service: "process",
                                                action: "removeMember",
                                                groupCode: model.group.groupCode,
                                                urnNo: urnNo
                                            },
                                            function(resp, headers) {
                                                GroupProcess.getGroup({
                                                    groupId: model.group.id
                                                }, function(response, headersGetter) {
                                                    irfProgressMessage.pop('group-dsc-remove-req', 'Group Member Removed', 2000);
                                                    model.group = _.cloneDeep(response);
                                                    fixData(model);
                                                    PageHelper.hideLoader();

                                                }, function(resp) {
                                                    $log.error(resp);
                                                    PageHelper.hideLoader();
                                                    irfProgressMessage.pop("group-dsc-remove-req", "Oops. An error occurred", 2000);
                                                    fixData(model);
                                                });
                                            },
                                            function(resp) {
                                                $log.error(resp);
                                                PageHelper.hideLoader();
                                                irfProgressMessage.pop("group-dsc-remove-req", "Oops. An error occurred", 2000);
                                                PageHelper.showErrors(resp);
                                                fixData(model);
                                            });
                                    }
                                },
                            }*/]
                        }]
                    }]
                }, 
                {
                    "type": "box",
                    "title": "GROUP_MEMBERS",
                    "condition": "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                    "items": [{
                        "key": "group.jlgGroupMembers",
                        "type": "array",
                        "titleExpr":"model.group.jlgGroupMembers[arrayIndex].urnNo + ' : ' + model.group.jlgGroupMembers[arrayIndex].firstName",
                        "title": "GROUP_MEMBERS",
                        //"condition": "model.group.jlgGroupMembers.length>0",
                        "add": null,
                        "items": [{
                            "key": "group.jlgGroupMembers[].urnNo",
                            "readonly": true,
                            "title": "URN_NO",
                            //"readonly": true
                            "type": "lov",
                            initialize: function(model, form, parentModel, context) {
                                model.branchId = parentModel.group.branchId;
                            },
                            "inputMap": {
                                /*"status": {
                                    "key": "group.status",
                                    "title": "STATUS",
                                    "type": "select",
                                    "titleMap": [{
                                        "name": "All",
                                        "value": ""
                                    }, {
                                        "name": "Processed",
                                        "value": "PROCESSED"
                                    }, {
                                        "name": "Pending",
                                        "value": "PENDING"
                                    }, {
                                        "name": "Error",
                                        "value": "ERROR"
                                    }]
                                },*/
                                "branchId": {
                                    "key": "group.branchId",
                                    "title": "BRANCH_NAME",
                                    "type": "select",
                                    "enumCode": "branch_id"
                                },
                                "centreId": {
                                    "key": "group.centreId",
                                    "title": "CENTRE",
                                    "enumCode": "centre",
                                    "type": "select",
                                    "parentEnumCode": "branch_id",
                                    "parentValueExpr": "model.branchId",
                                }
                            },
                            "outputMap": {
                                "urnNo": "group.jlgGroupMembers[arrayIndex].urnNo",
                                "firstName": "group.jlgGroupMembers[arrayIndex].firstName",
                                "fatherFirstName": "group.jlgGroupMembers[arrayIndex].fatherFirstName",
                            },
                            "searchHelper": formHelper,
                            "search": function(inputModel, form) {
                                /*var today = moment(new Date());
                                var nDaysBack = moment(new Date()).subtract(nDays, 'days');
                                var promise = CreditBureau.listCreditBureauStatus({
                                    'branchId': inputModel.branchId,
                                    'status': inputModel.status,
                                    'centreId': inputModel.centreId,
                                    'fromDate': nDaysBack.format('YYYY-MM-DD'),
                                    'toDate': today.format('YYYY-MM-DD')
                                }).$promise;
                                return promise;*/

                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var branches = formHelper.enum('branch_id').data;
                                var branchName;
                                $log.info(inputModel.branchId);
                                for (var i = 0; i < branches.length; i++) {
                                    if (branches[i].code == inputModel.branchId)
                                        branchName = branches[i].name;
                                }
                                var promise = Enrollment.search({
                                    'branchName': branchName || SessionStore.getBranch(),
                                    'centreId': inputModel.centreId,
                                }).$promise;
                                return promise;
                            },
                            getListDisplayItem: function(data, index) {
                                return [
                                    data.urnNo,
                                    data.firstName
                                ];
                            },
                            onSelect: function(valueObj, model, context) {}
                        }, {
                            "key": "group.jlgGroupMembers[].firstName",
                            "readonly": true,
                            "type": "string",
                            //"readonly": true,
                            "title": "GROUP_MEMBER_NAME"
                        }, {
                            "key": "group.jlgGroupMembers[].husbandOrFatherFirstName",
                            "readonly": true,
                            "title": "HUSBAND_OR_FATHER_NAME"
                                //"readonly": readonly
                        }, {
                            "key": "group.jlgGroupMembers[].relation",
                            "readonly": true,
                            "title": "RELATION",
                            //"readonly": readonly,
                            /*"type": "select",
                            "titleMap": {
                                "Father": "Father",
                                "Husband": "Husband"
                            }*/
                        }, {
                            "key": "group.jlgGroupMembers[].loanAmount",
                            "readonly": true,
                            "title": "LOAN_AMOUNT",
                            "type": "amount",

                            //readonly: readonly

                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose1",
                            "readonly": true,
                            "title": "LOAN_PURPOSE_1",
                            "enumCode": "loan_purpose_1",
                            "type": "select",
                            //readonly: readonly
                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose2",
                            "readonly": true,
                            "type": "string",
                            "title": "LOAN_PURPOSE_2",
                            //"enumCode": "loan_purpose_2",
                            /*"parentEnumCode": "loan_purpose_1",
                            "parentValueExpr": "model.group.jlgGroupMembers[arrayIndex].loanPurpose1"*/
                            //readonly: readonly
                        }, {
                            "key": "group.jlgGroupMembers[].loanPurpose3",
                            "readonly": true,
                            "type": "string",
                            "title": "LOAN_PURPOSE3",
                            //"enumCode": "loan_purpose_2",
                            //"parentEnumCode": "loan_purpose_2",
                            //"parentValueExpr": "model.group.jlgGroupMembers[arrayIndex].loanPurpose2"
                            //readonly: readonly
                        }, {
                            "key": "group.jlgGroupMembers[].witnessFirstName",
                            "readonly": true,
                            "title": "WITNESS_NAME",
                            "type": "lov",
                            initialize: function(model, form, parentModel, context) {
                                model.branchName = parentModel.group.branchName;
                            },
                            "outputMap": {
                                "urnNo": "group.jlgGroupMembers[arrayIndex].urnNo",
                                "firstName": "group.jlgGroupMembers[arrayIndex].firstName",
                                "fatherFirstName": "group.jlgGroupMembers[arrayIndex].fatherFirstName",
                            },
                            "searchHelper": formHelper,
                            "search": function(inputModel, form, model) {
                                var branches = formHelper.enum('branch_id').data;
                                var branchId;
                                $log.info(inputModel.branchName);
                                for (var i = 0; i < branches.length; i++) {
                                    if (branches[i].code == inputModel.branchName)
                                        branchId = branches[i].name;
                                }
                                var promise = Enrollment.search({
                                    'urnNo': model.group.jlgGroupMembers.urnNo,
                                    'branchName': branchId || SessionStore.getBranch()
                                }).$promise;
                                return promise;
                            },
                            getListDisplayItem: function(data, index) {
                                return [
                                    data.urnNo,
                                    data.firstName
                                ];
                            },
                            onSelect: function(valueObj, model, context) {}
                                //"readonly": readonly
                        }, {
                            "key": "group.jlgGroupMembers[].witnessRelationship",
                            "readonly": true,
                            "title": "RELATION",
                            "type": "select",
                            "enumCode": "relation"
                                //"readonly": readonly
                        }, {
                            type: "fieldset",
                            "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus && model.group.currentStage == 'DSC'",
                            title: "DSC_STATUS",
                            items: [{
                                "key": "group.jlgGroupMembers[].dscStatus",
                                "title": "DSC_STATUS",
                                "readonly": true,
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus"
                            }, {
                                "key": "group.jlgGroupMembers[].dscOverrideRemarks",
                                "condition":"model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDDEN'\
                                 || model.group.jlgGroupMembers[arrayIndex].dscStatus == 'DSC_OVERRIDE_REQUEST_REJECTED'",
                                "title": "DSC_OVERRIDE_REMARKS",
                                "readonly": true,
                            }, {
                                "key": "group.jlgGroupMembers[].getDSCData",
                                "type": "button",
                                "title": "VIEW_DSC_RESPONSE",
                                "icon": "fa fa-eye",
                                "style": "btn-primary",
                                // "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'",
                                "onClick": function(model, formCtrl, form, event) {
                                    console.log(form);
                                    console.warn(event);
                                    var i = event['arrayIndex'];
                                    console.warn("dscid :" + model.group.jlgGroupMembers[i].dscId);
                                    var dscId = model.group.jlgGroupMembers[i].dscId;
                                    showDscData(dscId);
                                }
                            }, {
                                "key": "group.jlgGroupMembers[].requestDSCOverride1",
                                "type": "button",
                                "title": "REQUEST_DSC_OVERRIDE",
                                "icon": "fa fa-reply",
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED' && \
                                !model.group.jlgGroupMembers[arrayIndex].showDSCOverride",
                                "onClick": function(model, formCtrl, form, event) {
                                    model.group.jlgGroupMembers[form.arrayIndex].showDSCOverride = true;                                    
                                },
                            }, {
                                "key": "group.jlgGroupMembers[].dscOverrideRequestRemarks",
                                "type": "textarea",
                                "title": "REQUEST_DSC_OVERRIDE_REMARKS",
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED' && \
                                model.group.jlgGroupMembers[arrayIndex].showDSCOverride",
                            }, {
                                "key": "group.jlgGroupMembers[].dscOverrideRequestFileId",
                                "category": "Group",
                                "subCategory": "DSCREQUESTDOCUMENT",
                                "title": "REQUEST_DSC_OVERRIDE_FILE",
                                "type": "file",
                                "fileType": "application/pdf",
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED' && \
                                model.group.jlgGroupMembers[arrayIndex].showDSCOverride",
                            }, {
                                "key": "group.jlgGroupMembers[].requestDSCOverride",
                                "type": "button",
                                "title": "REQUEST_DSC_OVERRIDE",
                                "icon": "fa fa-reply",
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED' && \
                                model.group.jlgGroupMembers[arrayIndex].showDSCOverride",
                                "onClick": function(model, formCtrl, form, event) {
                                    giveDSCOverrideRequest(model, formCtrl, form, event);
                                },
                            }, {
                                "key": "group.jlgGroupMembers[].removeMember",
                                "condition": "model.group.jlgGroupMembers[arrayIndex].dscStatus=='DSC_OVERRIDE_REQUIRED'",
                                "type": "button",
                                "title": "REMOVE_MEMBER",
                                "icon": "fa fa-times",
                                "onClick": function(model, formCtrl, form, event) {
                                    console.log(form);
                                    console.warn(event);
                                    var i = event['arrayIndex'];
                                    var urnNo = model.group.jlgGroupMembers[i].urnNo;
                                    $log.warn("Remove member from grp ", urnNo);
                                    if (window.confirm("Are you sure?")) {
                                        PageHelper.showLoader();
                                        PageHelper.clearErrors();
                                        irfProgressMessage.pop('group-dsc-remove-req', 'Removing Group Member...');
                                        Groups.get({
                                                service: "process",
                                                action: "removeMember",
                                                groupCode: model.group.groupCode,
                                                urnNo: urnNo
                                            },
                                            function(resp, headers) {
                                                GroupProcess.getGroup({
                                                    groupId: model.group.id
                                                }, function(response, headersGetter) {
                                                    irfProgressMessage.pop('group-dsc-remove-req', 'Group Member Removed', 2000);
                                                    model.group = _.cloneDeep(response);
                                                    model.group.screenMode = screenMode;
                                                    fixData(model);
                                                    PageHelper.hideLoader();

                                                }, function(resp) {
                                                    $log.error(resp);
                                                    PageHelper.hideLoader();
                                                    irfProgressMessage.pop("group-dsc-remove-req", "Oops. An error occurred", 2000);
                                                    fixData(model);
                                                });
                                            },
                                            function(resp) {
                                                $log.error(resp);
                                                PageHelper.hideLoader();
                                                irfProgressMessage.pop("group-dsc-remove-req", "Oops. An error occurred", 2000);
                                                PageHelper.showErrors(resp);
                                                fixData(model);
                                            });
                                    }
                                },
                            }]
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
                                condition:"model.action == 'PROCEED'",
                                "title": "PERFORM_DSC_CHECK",
                                "type": "button",
                                "onClick": "actions.doDSCCheck(model,form)"
                            }]
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
                preSave: function(model, form, formName) {},
                doDSCCheck: function(model, form) {
                    PageHelper.clearErrors();
                    if (!model.group.groupRemarks){
                        irfProgressMessage.pop('DSC', "Remarks is mandatory", 2000);
                        return false;
                    }
                    PageHelper.showLoader();
                    irfProgressMessage.pop('group-dsc-check', 'Performing DSC Check');
                    GroupProcess.DSCCheck({
                            groupCode: model.group.groupCode,
                            partnerCode: model.group.partnerCode
                        }, {},
                        function(resp) {
                            $log.warn(resp);
                            irfProgressMessage.pop('group-dsc-check', 'Almost Done...');
                            Groups.getGroup({
                                groupId: model.group.id
                            }, function(response, headersGetter) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('group-dsc-check', 'DSC Check Complete', 2000);
                                response.groupRemarks = model.group.groupRemarks;
                                model.group = _.cloneDeep(response);
                                fixData(model);
                                fillNames(model).then(function(m) {
                                    model = m;
                                    PageHelper.hideLoader();
                                }, function(m) {
                                    PageHelper.hideLoader();
                                    irfProgressMessage.pop("group-dsc-check", "Oops. An error occurred", 2000);
                                });
                                var dscFailedStatuses = ['DSC_OVERRIDE_REQUIRED', 'DSC_OVERRIDE_REQUESTED'];
                                var allOk = true;
                                var failedMsg = Array();
                                angular.forEach(model.group.jlgGroupMembers, function(member) {
                                    if (dscFailedStatuses.indexOf(member.dscStatus) >= 0) {
                                        $log.warn("DSC Failed for", member);
                                        allOk = false;
                                        return;
                                    }
                                });
                                $log.info("DSC Check Status :" + allOk);
                                if (allOk === true) {
                                    if (window.confirm("DSC Check Succeeded for the Group. Proceed to next stage?")) {
                                        model.groupAction = "PROCEED";
                                        PageHelper.showLoader();
                                        irfProgressMessage.pop('dsc-proceed', 'Working...');
                                        PageHelper.clearErrors();
                                        var reqData = _.cloneDeep(model);
                                        //reqData.group.frequency = reqData.group.frequency[0];
                                        GroupProcess.updateGroup(reqData, function(res) {
                                            PageHelper.hideLoader();
                                            irfProgressMessage.pop('dsc-proceed', 'Operation Succeeded. Proceeded to CGT 1.', 5000);
                                            irfNavigator.goBack();
                                        }, function(res) {
                                            PageHelper.hideLoader();
                                            irfProgressMessage.pop('dsc-proceed', 'Oops. Some error.', 2000);
                                            PageHelper.showErrors(res);
                                        });
                                    }
                                } else {
                                    var errors = Array();
                                    PageHelper.hideLoader();
                                    errors.push({
                                        message: "DSC Check Failed for some member(s). Please Take required action"
                                    });
                                    PageHelper.setErrors(errors);
                                }
                            }, function(resp) {
                                $log.error(resp);
                                PageHelper.hideLoader();
                                irfProgressMessage.pop("group-dsc-check", "Oops. An error occurred", 2000);
                            });
                        },
                        function(resp) {
                            PageHelper.showErrors(resp);
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('group-dsc-check', 'Oops... An error occurred. Please try again', 2000);
                        });
                },
                sendBack: function(model, form, formName) {
                    if (!model.review.targetStage){
                        irfProgressMessage.pop('Send Back', "Send to Stage is mandatory", 2000);
                        return false;
                    }
                    if (!model.group.groupRemarks){
                        irfProgressMessage.pop('Reject', "Remarks is mandatory", 2000);
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
                    if (!model.group.groupRemarks){
                        irfProgressMessage.pop('Reject', "Remarks is mandatory", 2000);
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