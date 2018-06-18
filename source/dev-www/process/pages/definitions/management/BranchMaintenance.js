define({
    pageUID: "management.BranchMaintenance",
    pageType: "Engine",
    dependencies: ["$log","Pages_ManagementHelper","Queries","Lead","Enrollment","BranchCreationResource", "$q",'PageHelper', 'formHelper','irfProgressMessage',
        'SessionStore', "$state", "$stateParams", "Masters", "authService"],
    $pageFn: function($log,Pages_ManagementHelper,Queries,Lead,Enrollment,BranchCreationResource, $q, PageHelper, formHelper, irfProgressMessage,
        SessionStore, $state, $stateParams, Masters, authService) {

        return {
            "name": "Create Branch",
            "type": "schema-form",
            "title": "Create Branch",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Create Branch Page loaded");
                model.branch= model.branch||{};

                if ($stateParams.pageId) {
                    PageHelper.showLoader();
                    PageHelper.showProgress("page-init", "Loading...");
                    BranchCreationResource.getBranchByID({
                            id: $stateParams.pageId
                        },
                        function(res) {
                            _.assign(model.branch, res);
                            $log.info(model.branch);
                            
                            if (model.branch.branchOpenTime && model.branch.branchOpenDate) {
                                model.branch.branchOpenTime = model.branch.branchOpenDate + " " + model.branch.branchOpenTime;
                                model.branch.branchOpenTime = new Date(model.branch.branchOpenTime);
                            }
                            if (model.branch.branchCloseTime && model.branch.branchOpenDate) {
                                model.branch.branchCloseTime = model.branch.branchOpenDate + " " + model.branch.branchCloseTime;
                                model.branch.branchCloseTime = new Date(model.branch.branchCloseTime);
                            }
                            model.branch.kgfsBankName = model.branch.kgfsBankName||SessionStore.getBankName();
                            var banks = formHelper.enum('bank').data;
                            for (var i = 0; i < banks.length; i++) {
                                if (banks[i].name == model.branch.kgfsBankName) {
                                    model.branch.bankId = model.branch.bankId||banks[i].value;
                                    model.branch.bankName = model.branch.bankName||banks[i].name;
                                    break;
                                }
                            }
                            PageHelper.hideLoader();
                        },
                        function(err){
                            $log.info(err);
                        }
                    );
                } else {
                    model.branch.kgfsBankName = SessionStore.getBankName();
                    var banks = formHelper.enum('bank').data;
                    for (var i = 0; i < banks.length; i++) {
                        if (banks[i].name == model.branch.kgfsBankName) {
                            model.branch.bankId = banks[i].value;
                            model.branch.bankName = banks[i].name;
                            break;
                        }
                    }
                }    
            },

            form: [
            {
                "type": "box",
                "title": "BRANCH_DETAILS",
                "items": [
                {
                    "key": "branch.bankId",
                    "required":true,
                    "title": "BANK_NAME",
                    "type": "select",
                    "readonly":true,
                    enumCode: "bank",
                },{
                    "key": "branch.parentBranchId",
                    "type": "select",
                    "enumCode":"branch_id",
                    "title": "PARENT_BRANCH"
                },{
                    "key": "branch.branchName",
                    "required":true,
                    "type": "string",
                    "title": "BRANCH_NAME",
                    "condition":"!model.branch.id"
                },{
                    "key": "branch.branchName",
                    "readonly":true,
                    "type": "string",
                    "title": "BRANCH_NAME",
                    "condition":"model.branch.id"
                },{
                    "key": "branch.branchCode",
                    "readonly":true,
                    "type": "string",
                    "title": "BRANCH_CODE",
                    "condition":"model.branch.id"
                },{
                    "key": "branch.branchMailId",
                    "required":true,
                    "type": "string",
                    "title": "BRANCH_MAIL_ID",
                    "schema":{
                        "pattern": "^\\S+@\\S+$",
                    }
                },{
                    "key": "branch.branchContactNo",
                    "type": "string",
                    "title": "BRANCH_CONTACT_NO",
                    "schema":{
                        "pattern":"^[0-9]{10}$"
                    }
                }, 
                {
                    key: "branch.pinCode",
                    "title": "PIN_CODE",
                    type: "lov",
                    fieldType: "number",
                    autolov: true,
                    inputMap: {
                        "pincode": "lead.pincode",
                        "district": {
                            key: "lead.district"
                        },
                        "state": {
                            key: "lead.state"
                        }
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model) {
                        return Queries.searchPincodeMaster(inputModel.pincode, inputModel.district, inputModel.state);
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.division + ', ' + item.region,
                            item.pincode,
                            item.district + ', ' + item.state
                        ];
                    },
                    onSelect: function (valueObj, model, context) {
                        model.branch.pinCode = parseInt(valueObj.pincode);
                        model.branch.districtId=parseInt(valueObj.district_id);
                        model.branch.stateId=parseInt(valueObj.state_id);
                    },
                },
                {
                    "key": "branch.districtId",
                    "readonly":true,
                    "type": "select",
                    "enumCode":"district_master1",
                    "title": "DISTRICT"
                },{
                    "key": "branch.stateId",
                    "readonly":true,
                    "type":"select",
                    "enumCode": "state_master1",
                    "title": "STATE"
                },{
                    "key": "branch.branchOpenDate",
                    "required":true,
                    "type": "date",
                    "title": "BRANCH_OPEN_DATE"
                },{
                    "key": "branch.branchOpenTime",
                     type: "time",
                    "title": "BRANCH_OPEN_TIME"
                },{
                    "key": "branch.branchCloseTime",
                    type: "time",
                    "title": "BRANCH_CLOSED_TIME"
                },{
                    "key": "branch.bufferTime",
                    type: "number",
                    "title": "BUFFER_TIME_IN_MINS",
                    "schema":{
                        "minimum":0,
                        "maximum":60
                    }
                },{
                    "key": "branch.branchLatitude",
                    "type": "geotag",
                    "latitude": "branch.branchLatitude",
                    "longitude": "branch.branchLongitude",
                    "title": "BRANCH_LOCATION"
                },
                {
                    "key": "branch.branchAddress1",
                    "type": "string",
                    "title": "BRANCH_ADDRESS_1"
                },{
                    "key": "branch.branchAddress2",
                    "type": "string",
                    "title": "BRANCH_ADDRESS_2"
                }]
            },
            {
                "type": "box",
                "title": "ADDITIONAL_DETAILS",
                "items": [{
                    "key": "branch.cashLimit",
                    "required":true,
                    "type": "amount",
                    "title": "BRANCH_CASH_LIMIT"
                },{
                    "key": "branch.jewelInsuranceLimit",
                    "type":"amount",
                    "title": "JEWEL_INSURENCE_LIMIT"
                },{
                    "key": "branch.wuAgentCode",
                    "title": "WU_AGENT_CODE"
                },{
                    "key": "branch.xmAgentCode",
                    "title": "XM_AGENT_CODE"
                },{
                    "key": "branch.nlccCode",
                    "title": "NPS_NLCC_CODE"
                },{
                    "key": "branch.solId",
                    "title": "SOL_ID"
                }, {
                    "key": "branch.fingerPrintDeviceType",
                    "required":true,
                    "type": "select",
                    "titleMap": {
                        "SAGEM": "SAGEM",
                        "SECUGEN": "SECUGEN"
                    },
                    "title": "FINGER_PRINT_DEVICE_TYPE"
                }, {
                    "key": "branch.eodAuthenticationType",
                    "required":true,
                    "type": "select",
                    "titleMap": {
                        "PASSWORD": "PASSWORD",
                        "FINGERPRINT": "FINGERPRINT"
                    },
                    "title": "EOD_AUTHENTICATION_TYPE"
                }]
            },
            {
                "type": "box",
                "title": "PARTNER_DETAILS",
                "items": [{
                    "key": "branch.ankurBranchCode",
                    "title": "ANKUR_BRANCH_CODE",
                }, {
                    "key": "branch.abgBranchCode",
                    "title": "ABG_BRANCH_CODE"
                }, {
                    "key": "branch.edelweissBranchCode",
                    "title": "EDELWEISS_BRANCH_CODE"
                }, {
                    "key": "branch.axisBranchCode",
                    "title": "AXIS_BRANCH_CODE"
                },{
                    "key": "branch.tclBranchCode",
                    "title": "TCL_BRANCH_CODE"
                }, {
                    "key": "branch.tclVendorId",
                    "title": "TCL_VENDOR_ID"
                }]
            },
            {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }],
            schema: function() {
                 return Lead.getLeadSchema().$promise;  
            },
            actions: {
                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    console.warn(model);
                    if (model.branch.branchOpenTime) {
                        model.branch.branchOpenTime = moment(model.branch.branchOpenTime).format("HH:mm:ss");
                    }
                    if (model.branch.branchCloseTime) {
                        model.branch.branchCloseTime = moment(model.branch.branchCloseTime).format("HH:mm:ss");
                    }
                    PageHelper.showLoader();
                    PageHelper.showProgress("Journal Save", "Working...");
                    if (model.branch.id) {
                        BranchCreationResource.branchEdit(model.branch)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("Branch Save", "Branch Updated with id" + '  ' + res.id, 3000);
                                $log.info(res);
                                model.branch = res;
                                $state.go('Page/Adhoc/management.BranchCreationDashboard', null);
                            }, function(httpRes) {
                                PageHelper.showProgress("Branch Save", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            }).finally(function() {
                                PageHelper.hideLoader();
                            })
                    } else {
                        BranchCreationResource.branchCreation(model.branch)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("Branch Save", "Branch Created with id" + '  ' + res.id, 3000);
                                $log.info(res);
                                model.branch = res;
                                $state.go('Page/Adhoc/management.BranchCreationDashboard', null);
                            }, function(httpRes) {
                                PageHelper.showProgress("Branch Save", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            }).finally(function() {
                                PageHelper.hideLoader();
                            })
                    }
                }
            }
        };
    }
})