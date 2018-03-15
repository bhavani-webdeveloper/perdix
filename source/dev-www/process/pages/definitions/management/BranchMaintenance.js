define({
    pageUID: "management.BranchMaintenance",
    pageType: "Engine",
    dependencies: ["$log","Pages_ManagementHelper","Enrollment","BranchCreationResource", "$q",'PageHelper', 'formHelper','irfProgressMessage',
        'SessionStore', "$state", "$stateParams", "Masters", "authService"],
    $pageFn: function($log,Pages_ManagementHelper,Enrollment,BranchCreationResource, $q, PageHelper, formHelper, irfProgressMessage,
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
                    "key": "branch.hubId",
                    "required":true,
                    "type": "number",
                    "title": "BRANCH_HUB_NAME",
                    "condition":"!model.branch.id"
                },{
                    "key": "branch.hubId",
                    "readonly":true,
                    "type": "number",
                    "title": "BRANCH_HUB_NAME",
                    "condition":"model.branch.id"
                }, {
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
                }, {
                    "key": "branch.branchCode",
                    "required":true,
                    "type": "string",
                    "title": "BRANCH_CODE",
                    "condition":"!model.branch.id"
                }, {
                    "key": "branch.branchCode",
                    "readonly":true,
                    "type": "string",
                    "title": "BRANCH_CODE",
                    "condition":"model.branch.id"
                },{
                    "key": "branch.branchMailId",
                    "required":true,
                    "type": "string",
                    "title": "BRANCH_MAIL_ID"
                },{
                    "key": "branch.branchContactNo",
                    "type": "string",
                    "title": "BRANCH_CONTACT_NO"
                }, {
                    "key": "branch.pinCode",
                    "required":true,
                    "type": "number",
                    "title": "PIN_CODE"
                }, {
                    "key": "branch.districtId",
                    //"required":true,
                    "type": "select",
                    // "enumCode":"district_master",
                    // parentEnumCode: "bankname",
                    // parentValueExpr: "model.branch.kgfsBankName",
                    "title": "DISTRICT"
                },{
                    "key": "branch.stateId",
                    //"required":true,
                    "type":"select",
                    // "enumCode": "state_master",
                    // parentEnumCode: "bankname",
                    // parentValueExpr: "model.branch.kgfsBankName",
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
                // {
                //     "key": "branch.branchLongitude",
                //     "type": "number",
                //     "title": "BRANCH_LONGITUDE"
                // },{
                //     "key": "branch.branchAltitude",
                //     "type": "number",
                //     "title": "BRANCH_ALTITUDE"
                // },
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
                return Pages_ManagementHelper.getCentreSchemaPromise();
               
            },
            actions: {
                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    console.warn(model);
                    PageHelper.showLoader();
                    PageHelper.showProgress("Journal Save", "Working...");
                    if (model.branch.id) {
                        BranchCreationResource.branchEdit(model.branch)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("Branch Save", "Branch Updated with id" + '  ' + res.id, 3000);
                                $log.info(res);
                                model.branch = res;
                                //$state.go('Page.JournalMaintenanceDashboard', null);
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
                                //$state.go('Page.JournalMaintenanceDashboard', null);
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