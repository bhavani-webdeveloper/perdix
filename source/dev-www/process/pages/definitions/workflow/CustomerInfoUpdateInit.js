///<amd-dependency path="perdixConfig/CustomerApprovalConfig" name="customerApproveConfig"/>
define(["perdixConfig/CustomerApprovalConfig"], function (customerApproveConfig) {
    caConfig = customerApproveConfig;
    return {
        pageUID: "workflow.CustomerInfoUpdateInit",
        pageType: "Engine",
        dependencies: ["$window", "$log", "formHelper", "Enrollment", "Workflow", "SessionStore", "$stateParams", "PageHelper", "irfProgressMessage", "Workflow", "BiometricService", "irfNavigator"],
        $pageFn: function ($window, $log, formHelper, Enrollment, Workflow, SessionStore, $stateParams, PageHelper, irfProgressMessage, Workflow, BiometricService, irfNavigator) {

            var getCustomer = function (result, model) {
                Enrollment.EnrollmentById({ id: result.id }, function (resp, header) {
                    PageHelper.hideLoader();
                    model.old = _.cloneDeep(resp);
                    model.new=_.cloneDeep(resp);
                    Workflow.initializeBlocks(model.old);
                    model.old.biometricCaptured = "Captured";
                    model.old.biometricNotCaptured = "Not Captured";

                    $window.scrollTo(0, 0);
                    irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                }, function (resp) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);
                });
            }
            var update = function (model, workflowId) {
                irfProgressMessage.pop("cust-load", "Loading Customer Data...");
                Workflow.getByID({ id: workflowId }, function (resp, header) {
                    model.workflow = _.cloneDeep(resp);
                    model.UpdatedWorkflow = JSON.parse(model.workflow.temporary);
                    model.old = model.workflow.customer;
                    model.old.biometricCaptured = "Captured";
                    model.old.biometricNotCaptured = "Not Captured";
                    irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                }, function (resp) {
                    irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);
                }).finally(function() {
                    irfProgressMessage.pop("cust-load", "Loading Customer Data...", 10);
                    PageHelper.hideLoader();
                });
            }
            var self;
            return {
                "name": "UPDATE_CUSTOMER_INFO",
                "type": "schema-form",
                "title": "UPDATE_CUSTOMER_INFO",
                initialize: function (model, form, formCtrl) {
                    self = this;
                    var workflowId = $stateParams.pageId;
                    if (workflowId != undefined || workflowId != null) {
                        PageHelper.showLoader();
                        update(model, workflowId);
                        PageHelper.hideLoader();
                    }
                    model.isFPEnrolled = function (fingerId) {
                        if (model.old[BiometricService.getFingerTF(fingerId)] != null || (typeof (model.old.$fingerprint) != 'undefined' && typeof (model.old.$fingerprint[fingerId]) != 'undefined' && model.old.$fingerprint[fingerId].data != null)) {
                            return "fa-check text-success";
                        }
                        return "fa-close text-danger";
                    }
                    model.getFingerLabel = function (fingerId) {
                        return BiometricService.getLabel(fingerId);
                    }
                    model._isUpdateEnabled = false;
                    Workflow.renderBlocks(model, false,caConfig).then(function (value) {
                        console.log(value);
                        self.form = value;
                        this.customerForm = [
                            {
                                key: "customer.id",
                                title: "CUSTOMER_ID",
                                readonly: true,
                                condition: "model.workflow"
                            },
                            {
                                key: "customer.id",
                                type: "lov",
                                lovonly: true,
                                title: "CUSTOMER_ID",
                                condition: "!model.workflow",
                                inputMap: {
                                    "firstName": {
                                        "key": "customer.firstName"
                                    },
                                    "urnNo": {
                                        "key": "customer.urnNo"
                                    },
                                    "customerBranchId": {
                                        "key": "customer.customerBranchId",
                                        "type": "select",
                                        "screenFilter": true,
                                    },
                                    "customerType": {
                                        "key": "customer.customerType",
                                        "type": "select",
                                        "screenFilter": true,
                                        "titleMap": {
                                            "Individual": "Individual",
                                            "Enterprise": "Enterprise"
                                        }
                                    }
                                },
                                outputMap: {
                                    "id": "customer.id",
                                    "urnNo": "customer.urnNo",
                                    "firstName": "customer.firstName",
                                    "mobilePhone": "customer.mobilePhone",
                                    "customerType": "customer.customerType",
                                    "processType": "customer.processType"
                                },
                                searchHelper: formHelper,
                                search: function (inputModel, form, model) {
                                    var branches = formHelper.enum('branch_id').data;
                                    var branchName;
                                    for (var i = 0; i < branches.length; i++) {
                                        if (branches[i].code == inputModel.customerBranchId)
                                            branchName = branches[i].name;
                                    }
                                    return Enrollment.search({
                                        branchName: branchName || SessionStore.getBranch(),
                                        urnNo: inputModel.urnNo,
                                        firstName: inputModel.firstName,
                                        customerType: inputModel.customerType
                                    }).$promise;
                                },
                                getListDisplayItem: function (item, index) {
                                    return [
                                        'ID : ' + item.id,
                                        'Name : ' + item.firstName
                                    ];
                                },
                                onSelect: function (result, model, context) {
                                    $log.info(result);
                                    getCustomer(result, model);
                                    model._isUpdateEnabled = true;
                                }
                            },
                            {
                                key: "customer.firstName",
                                title: "FULL_NAME",
                                readonly: true,
                                type: "input"
                            },
                        ];
                        var commentBox = {
                            "type": "textarea",
                            "title": "Remarks",
                            "required": true
                        }
                        var actionbox = {
                            "type": "actionbox",
                            "items": [{
                                "type": "submit",
                                "title": "SUBMIT"
                            }]
                        }
                        this.customerForm = this.customerForm.concat(self.form);
                        this.customerForm = this.customerForm.concat(commentBox);
                        self.form = [{
                            type: "box",
                            colClass: "col-sm-12",
                            title: "USER_INFORMATION",
                            items: this.customerForm
                        },
                            actionbox
                        ];
                    });
                },
                form: [],
                schema: function() {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    submit: function (model, form, formName) {
                        if (window.confirm("Update - Are You Sure?")) {
                            PageHelper.showLoader();
                            irfProgressMessage.pop('workflow-update', 'Working...');
                            model.customer.title = String(model.customer.addressProofSameAsIdProof);
                            $log.info(model);
                            var updatedModel = _.cloneDeep(model);
                            var proof = {};
                            proof["addressProofImageId"]=model.new.addressProofImageId;
                            proof["ageProofImageId"] = model.new.ageProofImageId;
                            proof["mobileProofImageId"] = model.new.mobileProofImageId;
                            var requestData = {
                                "processType": "Customer",
                                "processName": "Approval",
                                "currentStage": "Init",
                                "customer": updatedModel.new,
                                "proof": proof,
                                "action": 'PROCEED',
                                "referenceKey": updatedModel.old.id
                            };

                            if (updatedModel.currentStage) {
                                requestData.currentStage = updatedModel.currentStage;
                            }
                            if (updatedModel.workflow) {
                                requestData.id = updatedModel.workflow.id;
                                requestData.version = updatedModel.workflow.version;
                            }

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