///<amd-dependency path="perdixConfig/CustomerApprovalConfig" name="customerApproveConfig"/>
define(["perdixConfig/CustomerApprovalConfig"], function (customerApproveConfig) {
    caConfig = customerApproveConfig;
    return {
        pageUID: "workflow.CustomerInfoUpdateApprove",
        pageType: "Engine",
        dependencies: ["$window", "$log", "Workflow", "$stateParams", "PageHelper", "irfProgressMessage", "Enrollment"],
        $pageFn: function ($window, $log, Workflow, $stateParams, PageHelper, irfProgressMessage, Enrollment) {
            var getCustomer = function (result, model) {
                Enrollment.EnrollmentById({ id: result.id }, function (resp, header) {
                    PageHelper.hideLoader();
                    model.old = _.cloneDeep(resp);
                    model.old.biometricCaptured = "Captured";
                    model.old.biometricNotCaptured = "Not Captured";

                    $window.scrollTo(0, 0);
                    irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                }, function (resp) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);
                });
            }
            var update = function (model, workflowId, self) {
                Workflow.getByID({ id: workflowId }, function (resp, header) {
                    model.workflow = _.cloneDeep(resp);
                    model.UpdatedWorkflow = JSON.parse(model.workflow.temporary);
                    model.new = model.UpdatedWorkflow.customer;
                    model.old = model.workflow.customer;
                    Workflow.initializeBlocks(model.old);
                    Workflow.initializeBlocks(model.new);
                    model.old.biometricNotCaptured = "Not Captured";
                    model.old.biometricCaptured = "Captured";

                    // var blocksForm = Workflow.renderBlocks(model, true);
                    Workflow.renderBlocks(model, true,caConfig).then(function (value) {
                        self.form = value;
                        self.customerForm = [{
                            key: "old.firstName",
                            title: "FULL_NAME",
                            readonly: true
                        }]
                        var remarkBox = {
                            "type": "box",
                            colClass: "col-sm-12",
                            "title": "REVIEW",
                            "items": [
                                {
                                    key: "action",
                                    type: "radios",
                                    title: "UPDATE",
                                    "titleMap": {
                                        "PROCEED": "PROCEED",
                                        "REJECT": "REJECT",
                                        "SENDBACK": "SEND_BACK"
                                    },
                                    required: true
                                },
                                {
                                    key: "customer.remark",
                                    title: "REMARK"
                                }
                            ]
                        }
                        var actionBox = {
                            "type": "actionbox",
                            "items": [{
                                "type": "submit",
                                "title": "SUBMIT"
                            }]
                        };
                        self.finalForm = self.customerForm.concat(self.form);
                        self.form = [{
                            type: "box",
                            colClass: "col-sm-12",
                            title: "USER_INFORMATION",
                            items: self.finalForm
                        },
                            remarkBox,
                            actionBox
                        ];
                    }).finally(PageHelper.hideLoader);
                }, PageHelper.hideLoader);
            }
            return {
                "name": "APPROVAL_CUSTOMER",
                "type": "schema-form",
                "title": "APPROVAL_CUSTOMER",
                initialize: function (model, form, formCtrl) {
                    console.log(caConfig);
                    $log.info("User Maintanance loaded");
                    var workflowId = $stateParams.pageId;
                    $log.info("Loading data for Cust ID " + workflowId);
                    model._screenMode = 'VIEW';
                    PageHelper.showLoader();
                    irfProgressMessage.pop("cust-load", "Loading Customer Data...");

                    if (workflowId != undefined || workflowId != null) {
                        update(model, workflowId, this);
                        $window.scrollTo(0, 0);
                    } else {
                        PageHelper.hideLoader();
                    }
                },
                form: [],
                schema: function() {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    submit: function (model, form, formName) {
                        if (window.confirm("Update - Are You Sure?")) {
                            PageHelper.showLoader();
                            irfProgressMessage.pop('cust-update', 'Working...');

                            var updatedModel = _.cloneDeep(model);
                            var proof = {};
                            // if (model.customer.isAddressChanged == 'YES') {
                            // proof["addressProofImageId"] = model.customer.addressProofImageId;
                            //     if (model.customer.customerType == "Enterprise") {
                            //         updatedModel.customer.enterprise.landmark = updatedModel.customer.landmark;
                            //     }
                            // }
                            // if (model.customer.isDateOfBirthChanged == 'YES') {
                            //     updatedModel.customer.dateOfBirth = updatedModel.customer.newDateOfBirth;
                            // proof["ageProofImageId"] = model.customer.ageProofImageId;
                            // }
                            // if (model.customer.isMobileChanged == 'YES') {
                            //     updatedModel.customer.mobilePhone = updatedModel.customer.newMobilePhone;
                            // proof["mobileProofImageId"] = model.customer.mobileProofImageId;
                            // }
                            // if (model.customer.isGenderChanged == 'YES') {
                            //     updatedModel.customer.gender = updatedModel.customer.newGender;
                            // }
                            // if (model.customer.isOwnershipChanged == 'YES') {
                            //     updatedModel.customer.ownership = updatedModel.customer.newOwnership;
                            //     if (model.customer.customerType == "Enterprise") {
                            //         updatedModel.customer.enterprise.ownership = updatedModel.customer.newOwnership;
                            //     }
                            // }

                            var requestData = {
                                "id": updatedModel.workflow.id,
                                "version": updatedModel.workflow.version,
                                "processType": updatedModel.workflow.processType,
                                "processName": updatedModel.workflow.processName,
                                "currentStage": updatedModel.workflow.currentStage,
                                "customer": updatedModel.new,
                                "proof": proof,
                                "action": updatedModel.action,
                                "referenceKey": updatedModel.workflow.customer.id,

                            };

                            if (updatedModel.action == "SENDBACK")
                                requestData.sendbackStage = "Init"

                            Workflow.save(requestData, function (res, headers) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-update', 'Done. Customer Updated, ID : ' + res.customer.id, 2000);
                                irfNavigator.goBack();
                            }, function (res, headers) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-update', 'Oops. Some error.', 2000);
                                $window.scrollTo(0, 0);
                                PageHelper.showErrors(res);
                            })
                        }
                    }
                }
            };
        }
    }
});