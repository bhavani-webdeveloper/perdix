define({
    pageUID: "kgfs.kgfsWorkflow.GpsFingerApprovalInit",
    pageType: "Engine",
    dependencies: ["$window", "$log", "formHelper", "filterFilter", "Workflow", "Enrollment", "RolesPages", "Queries", "$q", "$state", "SessionStore", "UIRepository", "IrfFormRequestProcessor", "Utils", "PagesDefinition",
        "irfNavigator", "User", "SchemaResource", "$stateParams", "PageHelper", "irfProgressMessage", "BundleManager", "BiometricService", "Files"],
    $pageFn: function ($window, $log, formHelper, filterFilter, Workflow, Enrollment, RolesPages, Queries, $q, $state, SessionStore, UIRepository, IrfFormRequestProcessor,
        Utils, PagesDefinition, irfNavigator, User, SchemaResource, $stateParams, PageHelper, irfProgressMessage, BundleManager, BiometricService, Files) {

        var getCustomer = function (result, model) {
            Enrollment.EnrollmentById({ id: result.id }, function (resp, header) {
                PageHelper.hideLoader();
                model.customer = _.cloneDeep(resp);
                console.log("Here are the result for GPS");
                console.log(model);

                model.customer.isGpsChanged = "NO";
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

                if (model.workflow.isGpsChanged == model.UpdatedWorkflow.customer.isGpsChanged) {
                    model.customer.isGpsChanged = "NO";
                } else {
                    model.customer.isGpsChanged = "YES";
                    model.customer.newLatitude = model.UpdatedWorkflow.customer.latitude;
                    model.customer.newLongitude = model.UpdatedWorkflow.customer.longitude;
                }
                irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                PageHelper.hideLoader();
            }, function (resp) {
                irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);
                PageHelper.hideLoader();
            });
        }

        var overridesFields = function (bundlePageObj) {
            return {};
        }

        var getIncludes = function (model) {
            return [
            ];
        }
        var configFile = function () {
            return {};
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
                model.isFPEnrolled = function (fingerId) {
                    if (model.customer[BiometricService.getFingerTF(fingerId)] != null || (typeof (model.customer.$fingerprint) != 'undefined' && typeof (model.customer.$fingerprint[fingerId]) != 'undefined' && model.customer.$fingerprint[fingerId].data != null)) {
                        return "fa-check text-success";
                    }
                    return "fa-close text-danger";
                }

                model.getFingerLabel = function (fingerId) {
                    return BiometricService.getLabel(fingerId);
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
                            },
                            outputMap: {
                                "id": "customer.id",
                                "urnNo": "customer.urnNo",
                                "firstName": "customer.firstName",

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
                                    "key": "customer.latitude",
                                    "title": "GPS_LOCATION",
                                    "type": "geotag",
                                    "latitude": "customer.latitude",
                                    "longitude": "customer.longitude"
                                },
                                {
                                    key: "customer.isGpsChanged",
                                    type: "radios",
                                    title: "UPDATE",
                                    "titleMap": {
                                        "YES": "YES",
                                        "NO": "NO"
                                    }
                                },
                                {
                                    condition: "model.customer.isGpsUpdated == 'YES'",
                                    key: "customer.newLatitude",
                                    title: "UPDATED_GEO_LOCATION",
                                    "type": "geotag",
                                    required: true,
                                    "latitude": "customer.newLatitude",
                                    "longitude": "customer.newLongitude"
                                }
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
                    "type": "box",
                    "title": "BIOMETRIC",
                    "items": [
                        {
                            type: "button",
                            title: "CAPTURE_FINGERPRINT",
                            notitle: true,
                            fieldHtmlClass: "btn-block",
                            onClick: function (model, form, formName) {
                                var promise = BiometricService.capture(model);
                                promise.then(function (data) {
                                    model.customer.$fingerprint = data;
                                    //model.customer.$fingerprintquality = EnrollmentHelper.checkBiometricQuality(model);
                                    // console.log(data[0]);
                                    $log.info(data);
                                }, function (reason) {
                                    console.log(reason);
                                })
                            }
                        },
                        {
                            "type": "section",
                            "html": '<div class="row"> <div class="col-xs-6">' +
                                '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftThumb\')"></i> {{ model.getFingerLabel(\'LeftThumb\') }}</span><br>' +
                                '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftIndex\')"></i> {{ model.getFingerLabel(\'LeftIndex\') }}</span><br>' +
                                '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftMiddle\')"></i> {{ model.getFingerLabel(\'LeftMiddle\') }}</span><br>' +
                                '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftRing\')"></i> {{ model.getFingerLabel(\'LeftRing\') }}</span><br>' +
                                '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftLittle\')"></i> {{ model.getFingerLabel(\'LeftLittle\') }}</span><br>' +
                                '</div> <div class="col-xs-6">' +
                                '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightThumb\')"></i> {{ model.getFingerLabel(\'RightThumb\') }}</span><br>' +
                                '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightIndex\')"></i> {{ model.getFingerLabel(\'RightIndex\') }}</span><br>' +
                                '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightMiddle\')"></i> {{ model.getFingerLabel(\'RightMiddle\') }}</span><br>' +
                                '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightRing\')"></i> {{ model.getFingerLabel(\'RightRing\') }}</span><br>' +
                                '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightLittle\')"></i> {{ model.getFingerLabel(\'RightLittle\') }}</span><br>' +
                                '</div></div>'
                        }
                    ]
                },
                {
                    type: "fieldset",
                    title: "VALIDATE_BIOMETRIC",
                    items: [{
                        key: "customer.isBiometricValidated",
                        //required:true,
                        "title": "CHOOSE_A_FINGER_TO_VALIDATE",
                        type: "validatebiometric",
                        category: 'CustomerEnrollment',
                        subCategory: 'FINGERPRINT',
                        helper: formHelper,
                        biometricMap: {
                            leftThumb: "model.customer.leftHandThumpImageId",
                            leftIndex: "model.customer.leftHandIndexImageId",
                            leftMiddle: "model.customer.leftHandMiddleImageId",
                            leftRing: "model.customer.leftHandRingImageId",
                            leftLittle: "model.customer.leftHandSmallImageId",
                            rightThumb: "model.customer.rightHandThumpImageId",
                            rightIndex: "model.customer.rightHandIndexImageId",
                            rightMiddle: "model.customer.rightHandMiddleImageId",
                            rightRing: "model.customer.rightHandRingImageId",
                            rightLittle: "model.customer.rightHandSmallImageId"
                        },
                        viewParams: function (modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                    }, {
                        "key": "customer.biometricEnrollment",
                        readonly: true,
                        title: "BIOMETRIC_AUTHENTICATION",
                        type: "select",
                        titleMap: {
                            "NOT-ENABLE": "NOT-ENABLE",
                            "PENDING": "PENDING",
                            "AUTHENTICATED": "AUTHENTICATED"
                        }
                    },]
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
            schema: {
                "type": "object",
                "properties": {
                    "customer": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": "number",
                                "title": "CUSTOMER_ID"
                            },
                            "urnNo": {
                                "type": "string",
                                "title": "URNNO"
                            },
                            "firstName": {
                                "type": "string",
                                "title": "FIRST_NAME"
                            },
                            "branchName": {
                                "type": "string",
                                "title": "BRANCH_NAME"
                            },
                            "latitude": {
                                "title": "GPS_LOCATION",
                                "type": "geotag",
                            },
                            "leftHandThumpImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT"
                            },
                            "leftHandIndexImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT"
                            },
                            "leftHandMiddleImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT"
                            },
                            "leftHandRingImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT"
                            },
                            "leftHandSmallImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT"
                            },
                            "rightHandThumpImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT"
                            },
                            "rightHandIndexImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT"
                            },
                            "rightHandMiddleImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT"
                            },
                            "rightHandRingImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT"
                            },
                            "rightHandSmallImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT"
                            },

                        }

                    }
                },
                "required": [
                    "customer"
                ]

            },
            actions: {
                submit: function (model, form, formName) {
                    var out = model.customer.$fingerprint;

                    if (window.confirm("Update - Are You Sure?")) {
                        PageHelper.showLoader();
                        irfProgressMessage.pop('workflow-update', 'Working...');
                        $log.info(model);
                        var updatedModel = _.cloneDeep(model);
                        if (model.customer.isGpsChanged == "YES") {
                            updatedModel.customer.latitude = updatedModel.customer.newLatitude;
                            updatedModel.customer.longitude = updatedModel.customer.newLongitude;
                        }
                        var reqData = {
                            "processType": "Customer",
                            "processName": "Approval",
                            "currentStage": "Init",
                            "customer": updatedModel.customer,
                            "action": 'PROCEED',
                            "referenceKey": updatedModel.customer.id
                        };
                        if (updatedModel.currentStage)
                            reqData.currentStage = updatedModel.currentStage;

                        if (updatedModel.workflow) {
                            reqData.id = updatedModel.workflow.id;
                            reqData.version = updatedModel.workflow.version;
                        }
                        var fpPromisesArr = [];
                        for (var key in out) {
                            if (out[key].data != null) {
                                (function (obj) {
                                    var promise = Files.uploadBase64({ file: obj.data, type: 'CustomerEnrollment', subType: 'FINGERPRINT', extn: 'iso' }, {}).$promise;
                                    promise.then(function (data) {
                                        model.customer[obj.table_field] = data.fileId;
                                        delete model.customer.$fingerprint[obj.fingerId];
                                    });
                                    fpPromisesArr.push(promise);
                                })(out[key]);
                            } else {
                                if (out[key].data == null) {
                                    delete out[key];
                                }

                            }
                        }
                        $q.all(fpPromisesArr).then(function () {

                            var reqData = _.cloneDeep(model);
                            /** Valid check whether the user have enrolled or fingerprints or not **/
                            if (!(_.has(reqData['customer'], 'leftHandThumpImageId') && !_.isNull(reqData['customer']['leftHandThumpImageId']) &&
                                _.has(reqData['customer'], 'leftHandIndexImageId') && !_.isNull(reqData['customer']['leftHandIndexImageId']) &&
                                _.has(reqData['customer'], 'leftHandMiddleImageId') && !_.isNull(reqData['customer']['leftHandMiddleImageId']) &&
                                _.has(reqData['customer'], 'leftHandRingImageId') && !_.isNull(reqData['customer']['leftHandRingImageId']) &&
                                _.has(reqData['customer'], 'leftHandSmallImageId') && !_.isNull(reqData['customer']['leftHandSmallImageId']) &&
                                _.has(reqData['customer'], 'rightHandThumpImageId') && !_.isNull(reqData['customer']['rightHandThumpImageId']) &&
                                _.has(reqData['customer'], 'rightHandIndexImageId') && !_.isNull(reqData['customer']['rightHandIndexImageId']) &&
                                _.has(reqData['customer'], 'rightHandMiddleImageId') && !_.isNull(reqData['customer']['rightHandMiddleImageId']) &&
                                _.has(reqData['customer'], 'rightHandRingImageId') && !_.isNull(reqData['customer']['rightHandRingImageId']) &&
                                _.has(reqData['customer'], 'rightHandSmallImageId') && !_.isNull(reqData['customer']['rightHandSmallImageId'])
                            )) {
                                PageHelper.showErrors({
                                    "data": {
                                        "error": "Fingerprints are not enrolled. Please check"
                                    }
                                });
                                PageHelper.hideLoader();

                                return;
                            }
                        })
                        Workflow.save(reqData, function (res, headers) {
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
});