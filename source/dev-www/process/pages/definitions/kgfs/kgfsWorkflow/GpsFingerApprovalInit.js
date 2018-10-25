irf.pageCollection.factory(irf.page("kgfs.kgfsWorkflow.GpsFingerApprovalInit"),
    ["$window", "$log", "formHelper", "filterFilter", "Workflow", "Enrollment", "RolesPages", "Queries", "$q", "$state", "SessionStore", "Utils", "PagesDefinition", "irfNavigator", "User", "SchemaResource", "$stateParams", "PageHelper", "irfProgressMessage",
        function ($window, $log, formHelper, filterFilter, Workflow, Enrollment, RolesPages, Queries, $q, $state, SessionStore, Utils, PagesDefinition, irfNavigator, User, SchemaResource, $stateParams, PageHelper, irfProgressMessage) {

            var getCustomer = function (result, model) {
                Enrollment.EnrollmentById({ id: result.id }, function (resp, header) {
                    PageHelper.hideLoader();
                    model.customer = _.cloneDeep(resp);

                    $window.scrollTo(0, 0);
                    irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                }, function (resp) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);
                });
            }

            var update = function (model, workflowId) {
                Workflow.getByID({ id: workflowId }, function (resp, header) {

                    model.workflow = _.cloneDeep(resp);
                    model.UpdatedWorkflow = JSON.parse(model.workflow.temporary);

                    irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                    PageHelper.hideLoader();
                }, function (resp) {
                    irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);
                    PageHelper.hideLoader();
                });
            }

            return {
                "name": "UPDATE_CUSTOMER_INFO",
                "type": "schema-form",
                "title": "UPDATE_CUSTOMER_INFO",
                initialize: function (model, form, formCtrl) {
                    $log.info("User Maintanance loaded");
                    var workflowId = $stateParams.pageId;
                    $log.info("Loading data for Cust ID " + workflowId);

                    model._screenMode = 'VIEW';
                    PageHelper.showLoader();
                    irfProgressMessage.pop("cust-load", "Loading Customer Data...");

                    if (workflowId != undefined || workflowId != null) {
                        update(model, workflowId);
                    } else {
                        PageHelper.hideLoader();
                    }
                },
                form: [
                    {
                        type: "box",
                        title: "USER_INFORMATION",
                        items: [
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

                                }
                            },
                            {
                                type: "fieldset",
                                title: "GPS",
                                items: [
                                    {
                                        key: "customer.latitude",
                                        title: "LATITUDE",
                                        readonly: true
                                    }, {
                                        key: "customer.longitude",
                                        title: "LONGITUDE",
                                        readonly: true
                                    },
                                ]
                            },
                            {
                                type: "fieldset",
                                title: "FINGER_PRINTS",
                                items: [
                                    {
                                        key: "customer.leftHandIndexImageId",
                                        title: "LEFT_HAND_INDEX",
                                        readonly: true
                                    }, {
                                        key: "customer.leftHandMiddleImageId",
                                        title: "LEFT_HAND_MIDDLE",
                                        readonly: true
                                    }, {
                                        key: "customer.leftHandRingImageId",
                                        title: "LEFT_HAND_RING",
                                        readonly: true
                                    }, {
                                        key: "customer.leftHandSmallImageId",
                                        title: "LEFT_HAND_SMALL",
                                        readonly: true
                                    }, {
                                        key: "customer.leftHandThumpImageId",
                                        title: "LEFT_HAND_THUMP",
                                        readonly: true
                                    },
                                    {
                                        key: "customer.rightHandIndexImageId",
                                        title: "RIGHT_HAND_INDEX",
                                        readonly: true
                                    }, {
                                        key: "customer.rightHandMiddleImageId",
                                        title: "RIGHT_HAND_MIDDLE",
                                        readonly: true
                                    }, {
                                        key: "customer.rightHandRingImageId",
                                        title: "RIGHT_HAND_RING",
                                        readonly: true
                                    }, {
                                        key: "customer.rightHandSmallImageId",
                                        title: "RIGHT_HAND_SMALL",
                                        readonly: true
                                    }, {
                                        key: "customer.rightHandThumpImageId",
                                        title: "RIGHT_HAND_THUMP",
                                        readonly: true
                                    }

                                ]

                            }
                        ]
                    },
                    {
                        "type": "actionbox",
                        "items": [
                            {
                                "type": "submit",
                                "title": "SAVE"
                            }
                        ]
                    }
                ],
                actions: {
                }
            };
        }]);