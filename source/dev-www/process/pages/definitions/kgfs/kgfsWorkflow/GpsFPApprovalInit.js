define({
    pageUID: "kgfs.kgfsWorkflow.GpsFPApprovalInit",
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
                            condition: "model.workflow",
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
                            key: "customer.firstName",
                            title: "FULL_NAME",
                            readonly: true,
                        },
                        {
                            key: "customer.photoImageId",
                            title: "CUSTOMER_PHOTO",
                            type : "file",
                            "fileType": "image/*",
                            "category": "CustomerEnrollment",
                            "subCategory": "PHOTO"                        
                        },{
                            key: "customer.isPhotoImageIdChanged",
                            type: "radios",
                            title: "UPDATE_PHOTO",
                            "titleMap": {
                                "YES": "YES",
                                "NO": "NO"
                            }
                        },{
                            condition: "model.customer.isPhotoImageIdChanged == 'YES'",
                            key: "customer.newPhotoImageId",
                            title: "CUSTOMER_PHOTO",
                            required : true,
                            type : "file",
                            "fileType": "image/*",
                            "category": "CustomerEnrollment",
                            "subCategory": "PHOTO"                        
                        },
                        {
                            type: "fieldset",
                            title: "GPS",
                            items: [
                                {
                                    "key": "customer.latitude",
                                    "title": "GPS_LOCATION",
                                    "type": "geotag",
                                    "readonly": true,
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
                                    "titleMap": {
                                        "YES": "YES",
                                        "NO": "NO"
                                    }
                                },
                                {
                                    title: "Comments",
                                    key: "customer.remarks",
                                    type: "textarea",
                                    required: true
                                },
                            ]
                        }
                    ]
                },
                {
                    "type": "box",
                    condition: "model.customer.isFingerPrintChanged == 'YES'",
                    "title": "UPDATE_FINGER_PRINTS",
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
                        },
                    ]
                },
                {
                    type: "fieldset",
                    title: "VALIDATE_BIOMETRIC",
                    condition: "model.customer.isFingerPrintChanged == 'YES'",
                    items: [{
                        key: "customer.isBiometricValidated",
                        //required:true,
                        "title": "CHOOSE_A_FINGER_TO_VALIDATE",
                        type: "validatebiometric",
                        category: 'CustomerEnrollment',
                        subCategory: 'FINGERPRINT',
                        helper: formHelper,
                        biometricMap: {
                            leftThumb: "model.customer.newLeftHandThumpImageId",
                            leftIndex: "model.customer.newLeftHandIndexImageId",
                            leftMiddle: "model.customer.newLeftHandMiddleImageId",
                            leftRing: "model.customer.newLeftHandRingImageId",
                            leftLittle: "model.customer.newLeftHandSmallImageId",
                            rightThumb: "model.customer.newRightHandThumpImageId",
                            rightIndex: "model.customer.newRightHandIndexImageId",
                            rightMiddle: "model.customer.newRightHandMiddleImageId",
                            rightRing: "model.customer.newRightHandRingImageId",
                            rightLittle: "model.customer.newRightHandSmallImageId"
                        },
                        viewParams: function (modelValue, form, model) {
                            return {
                                customerId: model.customer.id
                            };
                        },
                    }, {
                        "key": "customer.biometricEnrollment",
                        title: "BIOMETRIC_AUTHENTICATION",
                        type: "select",
                        titleMap: {
                            "NOT-ENABLE": "NOT-ENABLE",
                            "PENDING": "PENDING",
                            "AUTHENTICATED": "AUTHENTICATED"
                        }
                    },
                    ]
                },
                {
                    "type": "actionbox",
                    "items": [

                        {
                            "type": "submit",
                            "title": "SUBMIT"
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
                                "type": ["string", "null"],
                                "title": "URN_NO",
                                "captureStages": ["Init"]
                            },
                            "firstName": {
                                "type": ["string", "null"],
                                "title": "FIRST_NAME",
                                "captureStages": ["Init"]
                            },
                            "branchName": {
                                "type": ["string", "null"],
                                "title": "BRANCH_NAME",
                                "captureStages": ["Init"]
                            },
                            "latitude": {
                                "title": "GPS_LOCATION",
                                "type": ["string","null"],
                                "captureStages": ["Init"]
                            },
                            "photoImageId": {
                                "title" : "CUSTOMER_PHOTO",
                                "type":["string","null"],
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
                captureBiometric: function (model, form, formName) {

                },
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
                            "processType": "Customer",
                            "processName": "Approval",
                            "currentStage": "Init",
                            "customer": updatedModel.customer,
                            "action": 'PROCEED',
                            "remarks": updatedModel.customer.remarks,
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
                                        reqData.customer[obj.table_field] = data.fileId;
                                        delete reqData.customer.$fingerprint[obj.fingerId];
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

                            /** Valid check whether the user have enrolled or fingerprints or not **/
                            if (!(_.has(reqData['customer'], 'newLeftHandThumpImageId') && !_.isNull(reqData['customer']['newLeftHandThumpImageId']) &&
                                _.has(reqData['customer'], 'newLeftHandIndexImageId') && !_.isNull(reqData['customer']['newLeftHandIndexImageId']) &&
                                _.has(reqData['customer'], 'newLeftHandMiddleImageId') && !_.isNull(reqData['customer']['newLeftHandMiddleImageId']) &&
                                _.has(reqData['customer'], 'newLeftHandRingImageId') && !_.isNull(reqData['customer']['newLeftHandRingImageId']) &&
                                _.has(reqData['customer'], 'newLeftHandSmallImageId') && !_.isNull(reqData['customer']['newLeftHandSmallImageId']) &&
                                _.has(reqData['customer'], 'newRightHandThumpImageId') && !_.isNull(reqData['customer']['newRightHandThumpImageId']) &&
                                _.has(reqData['customer'], 'newRightHandIndexImageId') && !_.isNull(reqData['customer']['newRightHandIndexImageId']) &&
                                _.has(reqData['customer'], 'newRightHandMiddleImageId') && !_.isNull(reqData['customer']['newRightHandMiddleImageId']) &&
                                _.has(reqData['customer'], 'newRightHandRingImageId') && !_.isNull(reqData['customer']['newRightHandRingImageId']) &&
                                _.has(reqData['customer'], 'newRightHandSmallImageId') && !_.isNull(reqData['customer']['newRightHandSmallImageId'])
                            )) {
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