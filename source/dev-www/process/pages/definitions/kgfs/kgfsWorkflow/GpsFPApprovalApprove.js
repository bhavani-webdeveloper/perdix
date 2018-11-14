define({
    pageUID: "kgfs.kgfsWorkflow.GpsFPApprovalApprove",
    pageType: "Engine",
    dependencies: ["$window", "$log", "formHelper", "filterFilter", "Workflow", "Enrollment", "RolesPages", "Queries", "$q", "$state", "SessionStore", "UIRepository", "IrfFormRequestProcessor", "Utils", "PagesDefinition",
        "irfNavigator", "User", "SchemaResource", "$stateParams", "PageHelper", "irfProgressMessage", "BundleManager", "BiometricService", "Files"],
    $pageFn: function ($window, $log, formHelper, filterFilter, Workflow, Enrollment, RolesPages, Queries, $q, $state, SessionStore, UIRepository, IrfFormRequestProcessor,
        Utils, PagesDefinition, irfNavigator, User, SchemaResource, $stateParams, PageHelper, irfProgressMessage, BundleManager, BiometricService, Files) {

        var getCustomer = function (result, model) {
            Enrollment.EnrollmentById({ id: result.id }, function (resp, header) {
                PageHelper.hideLoader();
                model.customer = _.cloneDeep(resp);


                model.customer.isGpsChanged = "NO"; //flag for gps updation
                model.customer.isFingerPrintChanged = "NO"; //flag for updation of finger prints
                model.customer.biometricCaptured = "Captured";
                model.customer.fingerPrintUpdated = "Updated"; //flag for displaying the updated finger prints
                model.customer.biometricNotCaptured = "Not Captured";
                model.customer.isPhotoImageIdChanged = "NO";
                model.customer.newLeftHandThumpImageId = model.customer.leftHandThumpImageId;
                model.customer.newLeftHandIndexImageId = model.customer.leftHandIndexImageId;
                model.customer.newLeftHandMiddleImageId = model.customer.leftHandMiddleImageId;
                model.customer.newLeftHandRingImageId = model.customer.leftHandRingImageId;
                model.customer.newLeftHandSmallImageId = model.customer.leftHandSmallImageId;
                model.customer.newRightHandThumpImageId = model.customer.rightHandThumpImageId;
                model.customer.newRightHandIndexImageId = model.customer.rightHandIndexImageId;
                model.customer.newRightHandMiddleImageId = model.customer.rightHandMiddleImageId;
                model.customer.newRightHandRingImageId = model.customer.rightHandRingImageId;
                model.customer.newRightHandSmallImageId = model.customer.rightHandSmallImageId;
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
                model.customer = model.workflow.customer;
                model.customer.biometricNotCaptured = "Not Captured";
                model.customer.biometricCaptured = "Captured";
                model.customer.fingerPrintUpdated = "Updated"; //flag for displaying the updated finger prints

                if (model.customer.latitude == model.UpdatedWorkflow.customer.latitude && model.customer.longitude == model.UpdatedWorkflow.customer.longitude) {
                    model.customer.isGpsChanged = "NO";
                } else {
                    model.customer.isGpsChanged = "YES";
                    model.customer.newLatitude = model.UpdatedWorkflow.customer.latitude;
                    model.customer.newLongitude = model.UpdatedWorkflow.customer.longitude;
                }
                if(model.customer.photoImageId == model.UpdatedWorkflow.customer.photoImageId ){
                    model.customer.isPhotoImageIdChanged = "NO";
                }
                else{
                    model.customer.isPhotoImageIdChanged = "YES";
                    model.customer.newPhotoImageId = model.UpdatedWorkflow.customer.photoImageId;
                }
                if (model.customer.leftHandThumpImageId == model.UpdatedWorkflow.customer.leftHandThumpImageId &&
                    model.customer.leftHandIndexImageId == model.UpdatedWorkflow.customer.leftHandIndexImageId &&
                    model.customer.leftHandMiddleImageId == model.UpdatedWorkflow.customer.leftHandMiddleImageId &&
                    model.customer.leftHandRingImageId == model.UpdatedWorkflow.customer.leftHandRingImageId &&
                    model.customer.leftHandSmallImageId == model.UpdatedWorkflow.customer.leftHandSmallImageId &&
                    model.customer.rightHandThumpImageId == model.UpdatedWorkflow.customer.rightHandThumpImageId &&
                    model.customer.rightHandIndexImageId == model.UpdatedWorkflow.customer.rightHandIndexImageId &&
                    model.customer.rightHandMiddleImageId == model.UpdatedWorkflow.customer.rightHandMiddleImageId &&
                    model.customer.rightHandRingImageId == model.UpdatedWorkflow.customer.rightHandRingImageId &&
                    model.customer.rightHandSmallImageId == model.UpdatedWorkflow.customer.rightHandSmallImageId) {
                    model.customer.isFingerPrintChanged = "NO";
                }
                else {
                    model.customer.isFingerPrintChanged = "YES";
                    model.customer.newLeftHandThumpImageId = model.UpdatedWorkflow.customer.leftHandThumpImageId;
                    model.customer.newLeftHandIndexImageId = model.UpdatedWorkflow.customer.leftHandIndexImageId;
                    model.customer.newLeftHandMiddleImageId = model.UpdatedWorkflow.customer.leftHandMiddleImageId;
                    model.customer.newLeftHandRingImageId = model.UpdatedWorkflow.customer.leftHandRingImageId;
                    model.customer.newLeftHandSmallImageId = model.UpdatedWorkflow.customer.leftHandSmallImageId;
                    model.customer.newRightHandThumpImageId = model.UpdatedWorkflow.customer.rightHandThumpImageId;
                    model.customer.newRightHandIndexImageId = model.UpdatedWorkflow.customer.rightHandIndexImageId;
                    model.customer.newRightHandMiddleImageId = model.UpdatedWorkflow.customer.rightHandMiddleImageId;
                    model.customer.newRightHandRingImageId = model.UpdatedWorkflow.customer.rightHandRingImageId;
                    model.customer.newRightHandSmallImageId = model.UpdatedWorkflow.customer.rightHandSmallImageId;
                }
                irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                PageHelper.hideLoader();
            }, function (resp) {
                irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);
                PageHelper.hideLoader();
            });
        }
        return {
            "name": "GPS_FINGERPRINT_APPROVAL",
            "type": "schema-form",
            "title": "GPS_FINGERPRINT_APPROVAL",
            initialize: function (model, form, formCtrl) {
                $log.info("User Maintanance loaded");
                var workflowId = $stateParams.pageId;
                $log.info("Loading data for Cust ID " + workflowId);

                model._screenMode = 'VIEW';
                PageHelper.showLoader();
                irfProgressMessage.pop("cust-load", "Loading Customer Data...");

                if (workflowId != undefined || workflowId != null) {
                    update(model, workflowId);
                    PageHelper.hideLoader();


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
                            readonly: true
                        },
                        {
                            key: "customer.firstName",
                            title: "FULL_NAME",
                            readonly: true
                        },
                        {
                            key: "customer.photoImageId",
                            title: "CUSTOMER_PHOTO",
                            readonly: true,
                            type: "file",
                            "fileType": "image/*",
                            "category": "CustomerEnrollment",
                            "subCategory": "PHOTO"
                        }, {
                            key: "customer.isPhotoImageIdChanged",
                            readonly: true,
                            type: "radios",
                            title: "UPDATE_PHOTO",
                            "titleMap": {
                                "YES": "YES",
                                "NO": "NO"
                            }
                        }, {
                            condition: "model.customer.isPhotoImageIdChanged == 'YES'",
                            readonly: true,
                            key: "customer.newPhotoImageId",
                            title: "CUSTOMER_PHOTO",
                            required: true,
                            type: "file",
                            "fileType": "image/*",
                            "category": "CustomerEnrollment",
                            "subCategory": "PHOTO"
                        },
                        {
                            type: "fieldset",
                            title: "GPS",
                            readonly: true,
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
                                    condition: "model.customer.isGpsChanged == 'YES'",
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
                            readonly: true,
                            items: [
                                {
                                    key: "customer.biometricCaptured",
                                    condition: "model.customer.leftHandIndexImageId != null",
                                    title: "LEFT_HAND_INDEX",
                                    readonly: true
                                }, {
                                    key: "customer.biometricNotCaptured",
                                    condition: "model.customer.leftHandIndexImageId == null",
                                    title: "LEFT_HAND_INDEX",
                                    readonly: true
                                },
                                {
                                    key: "customer.biometricCaptured",
                                    condition: "model.customer.leftHandMiddleImageId != null",
                                    title: "LEFT_HAND_MIDDLE",
                                    readonly: true
                                }, {
                                    key: "customer.biometricNotCaptured",
                                    condition: "model.customer.leftHandMiddleImageId == null",
                                    title: "LEFT_HAND_MIDDLE",
                                    readonly: true
                                }, {
                                    key: "customer.biometricCaptured",
                                    condition: "model.customer.leftHandRingImageId != null",
                                    title: "LEFT_HAND_RING",
                                    readonly: true
                                }, {
                                    key: "customer.biometricNotCaptured",
                                    condition: "model.customer.leftHandRingImageId == null",
                                    title: "LEFT_HAND_RING",
                                    readonly: true
                                }, {
                                    key: "customer.biometricCaptured",
                                    condition: "model.customer.leftHandSmallImageId != null",
                                    title: "LEFT_HAND_SMALL",
                                    readonly: true
                                }, {
                                    key: "customer.biometricNotCaptured",
                                    condition: "model.customer.leftHandSmallImageId == null",
                                    title: "LEFT_HAND_SMALL",
                                    readonly: true
                                }, {
                                    key: "customer.biometricCaptured",
                                    condition: "model.customer.leftHandThumpImageId != null",
                                    title: "LEFT_HAND_THUMB",
                                    readonly: true
                                }, {
                                    key: "customer.biometricNotCaptured",
                                    condition: "model.customer.leftHandThumpImageId == null",
                                    title: "LEFT_HAND_THUMB",
                                    readonly: true
                                },
                                {
                                    key: "customer.biometricCaptured",
                                    condition: "model.customer.rightHandIndexImageId != null",
                                    title: "RIGHT_HAND_INDEX",
                                    readonly: true
                                }, {
                                    key: "customer.biometricNotCaptured",
                                    condition: "model.customer.rightHandIndexImageId == null",
                                    title: "RIGHT_HAND_INDEX",
                                    readonly: true
                                }, {
                                    key: "customer.biometricCaptured",
                                    condition: "model.customer.rightHandMiddleImageId != null",
                                    title: "RIGHT_HAND_MIDDLE",
                                    readonly: true
                                }, {
                                    key: "customer.biometricNotCaptured",
                                    condition: "model.customer.rightHandMiddleImageId == null",
                                    title: "RIGHT_HAND_MIDDLE",
                                    readonly: true
                                }, {
                                    key: "customer.biometricCaptured",
                                    condition: "model.customer.rightHandRingImageId != null",
                                    title: "RIGHT_HAND_RING",
                                    readonly: true
                                }, {
                                    key: "customer.biometricNotCaptured",
                                    condition: "model.customer.rightHandRingImageId == null",
                                    title: "RIGHT_HAND_RING",
                                    readonly: true
                                }, {
                                    key: "customer.biometricCaptured",
                                    condition: "model.customer.rightHandSmallImageId != null",
                                    title: "RIGHT_HAND_SMALL",
                                    readonly: true
                                }, {
                                    key: "customer.biometricNotCaptured",
                                    condition: "model.customer.rightHandSmallImageId == null",
                                    title: "RIGHT_HAND_SMALL",
                                    readonly: true
                                }, {
                                    key: "customer.biometricCaptured",
                                    condition: "model.customer.rightHandThumpImageId != null",
                                    title: "RIGHT_HAND_THUMB",
                                    readonly: true
                                }, {
                                    key: "customer.biometricNotCaptured",
                                    condition: "model.customer.rightHandThumpImageId == null",
                                    title: "RIGHT_HAND_THUMB",
                                    readonly: true
                                },

                                {
                                    key: "customer.isFingerPrintChanged",
                                    type: "radios",
                                    title: "UPDATE",
                                    readonly: true,
                                    "titleMap": {
                                        "YES": "YES",
                                        "NO": "NO"
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    title: "UPDATED_FINGER_PRINTS",
                    condition: "model.customer.isFingerPrintChanged == 'YES'",
                    readonly: true,
                    type: "box",
                    items: [
                        {
                            title: "LEFT_HAND_THUMB",
                            condition: "model.customer.leftHandThumpImageId != model.customer.newLeftHandThumpImageId",
                            key: "customer.fingerPrintUpdated",
                            readonly: true
                        },
                        {
                            title: "LEFT_HAND_INDEX",
                            condition: "model.customer.leftHandIndexImageId != model.customer.newLeftHandIndexImageId",
                            key: "customer.fingerPrintUpdated",
                            readonly: true
                        },
                        {
                            title: "LEFT_HAND_MIDDLE",
                            condition: "model.customer.leftHandMiddleImageId != model.customer.newLeftHandMiddleImageId",
                            key: "customer.fingerPrintUpdated",
                            readonly: true
                        },
                        {
                            title: "LEFT_HAND_RING",
                            condition: "model.customer.leftHandRingImageId != model.customer.newLeftHandRingImageId",
                            key: "customer.fingerPrintUpdated",
                            readonly: true
                        },
                        {
                            title: "LEFT_HAND_SMALL",
                            condition: "model.customer.leftHandSmallImageId != model.customer.newLeftHandSmallImageId",
                            key: "customer.fingerPrintUpdated",
                            readonly: true
                        },
                        {
                            title: "RIGHT_HAND_THUMB",
                            condition: "model.customer.rightHandThumpImageId != model.customer.newRightHandThumpImageId",
                            key: "customer.fingerPrintUpdated",
                            readonly: true
                        },
                        {
                            title: "RIGHT_HAND_INDEX",
                            condition: "model.customer.rightHandIndexImageId != model.customer.newRightHandIndexImageId",
                            key: "customer.fingerPrintUpdated",
                            readonly: true
                        },
                        {
                            title: "RIGHT_HAND_MIDDLE",
                            condition: "model.customer.rightHandMiddleImageId != model.customer.newRightHandMiddleImageId",
                            key: "customer.fingerPrintUpdated",
                            readonly: true
                        },
                        {
                            title: "RIGHT_HAND_RING",
                            condition: "model.customer.rightHandRingImageId != model.customer.newRightHandRingImageId",
                            key: "customer.fingerPrintUpdated",
                            readonly: true
                        },
                        {
                            title: "RIGHT_HAND_SMALL",
                            condition: "model.customer.rightHandSmallImageId != model.customer.newRightHandSmallImageId",
                            key: "customer.fingerPrintUpdated",
                            readonly: true
                        }
                    ]

                }, {
                    "type": "box",
                    colClass: "col-sm-12",
                    "title": "REVIEW",
                    "items": [
                        {
                            "title": "COMMENTS",
                            "key": "UpdatedWorkflow.remarks",
                            readonly: true
                        },
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
                            key: "customer.remarks",
                            title: "REMARKS"
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
            schema: {
                "type": "object",
                "properties": {
                    "customer": {
                        "type": "object",
                        "properties": {
                            "id": {
                                "type": ["number","null"],
                                "title": "CUSTOMER_ID",
                                "captureStages": ["Init"]
                            },
                            "urnNo": {
                                "type": ["string","null"],
                                "title": "URN_NO",
                                "captureStages": ["Init"]
                            },
                            "firstName": {
                                "type": ["string","null"],
                                "title": "FIRST_NAME",
                                "captureStages": ["Init"]
                            },
                            "branchName": {
                                "type": ["string","null"],
                                "title": "BRANCH_NAME",
                                "captureStages": ["Init"]
                            },
                            "latitude": {
                                "title": "GPS_LOCATION",
                                "type": ["string","null"],
                                "captureStages": ["Init"]
                            },
                            "photoImageId": {
                                "title": "CUSTOMER_PHOTO",
                                "type": ["string","null"],
                                "category": "CustomerEnrollment",
                                "subCategory": "PHOTO",
                                "captureStages": ["Init"]
                            },
                            "leftHandThumpImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT",
                                "captureStages": ["Init"]
                            },
                            "leftHandIndexImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT",
                                "captureStages": ["Init"]
                            },
                            "leftHandMiddleImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT",
                                "captureStages": ["Init"]
                            },
                            "leftHandRingImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT",
                                "captureStages": ["Init"]
                            },
                            "leftHandSmallImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT",
                                "captureStages": ["Init"]
                            },
                            "rightHandThumpImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT",
                                "captureStages": ["Init"]
                            },
                            "rightHandIndexImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT",
                                "captureStages": ["Init"]
                            },
                            "rightHandMiddleImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT",
                                "captureStages": ["Init"]
                            },
                            "rightHandRingImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT",
                                "captureStages": ["Init"]
                            },
                            "rightHandSmallImageId": {
                                "type": ["string", "null"],
                                "title": "FINGERPRINT",
                                "category": "CustomerEnrollment",
                                "subCategory": "FINGERPRINT",
                                "captureStages": ["Init"]
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
                    if (window.confirm("Update - Are You Sure?")) {
                        PageHelper.showLoader();
                        irfProgressMessage.pop('workflow-update', 'Working...');
                        $log.info(model);
                        var updatedModel = _.cloneDeep(model);
                        if (model.customer.isGpsChanged == "YES") {
                            updatedModel.customer.latitude = updatedModel.customer.newLatitude;
                            updatedModel.customer.longitude = updatedModel.customer.newLongitude;
                        }
                        if(model.customer.isPhotoImageIdChanged == "YES"){
                            updatedModel.customer.photoImageId = updatedModel.customer.newPhotoImageId;
                        }
                        if (model.customer.isFingerPrintChanged == "YES") {
                            updatedModel.customer.leftHandThumpImageId = updatedModel.customer.newLeftHandThumpImageId;
                            updatedModel.customer.leftHandIndexImageId = updatedModel.customer.newLeftHandIndexImageId;
                            updatedModel.customer.leftHandMiddleImageId = updatedModel.customer.newLeftHandMiddleImageId;
                            updatedModel.customer.leftHandRingImageId = updatedModel.customer.newLeftHandRingImageId;
                            updatedModel.customer.leftHandSmallImageId = updatedModel.customer.newLeftHandSmallImageId;
                            updatedModel.customer.rightHandThumpImageId = updatedModel.customer.newRightHandThumpImageId;
                            updatedModel.customer.rightHandIndexImageId = updatedModel.customer.newRightHandIndexImageId;
                            updatedModel.customer.rightHandMiddleImageId = updatedModel.customer.newRightHandMiddleImageId;
                            updatedModel.customer.rightHandRingImageId = updatedModel.customer.newRightHandRingImageId;
                            updatedModel.customer.rightHandSmallImageId = updatedModel.customer.newRightHandSmallImageId;
                        }
                        var reqData = {
                            "id": updatedModel.workflow.id,
                            "version": updatedModel.workflow.version,
                            "processType": updatedModel.workflow.processType,
                            "processName": updatedModel.workflow.processName,
                            "currentStage": updatedModel.workflow.currentStage,
                            "customer": updatedModel.customer,
                            "action": updatedModel.action,
                            "referenceKey": updatedModel.workflow.customer.id,
                        };
                        if (updatedModel.action == "SENDBACK")
                            reqData.sendbackStage = "Init";

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