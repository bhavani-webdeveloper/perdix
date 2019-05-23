irf.models.factory('Workflow', function ($resource, $httpParamSerializer, BASE_URL, searchResource, $q, SessionStore, BiometricService, $http) {

    var endpoint = BASE_URL + '/api/workflow';

    var ret = $resource(endpoint, null, {

        query: {
            method: 'GET',
            url: endpoint + "/Customer/Approval",
            isArray: true
        },
        search: searchResource({
            method: 'GET',
            url: endpoint + "/Customer/Approval/",
        }),
        getByID: {
            method: 'GET',
            url: endpoint + "/Customer/Approval/:id"
        },
        save: {
            method: 'POST',
            url: endpoint + "/Customer/Approval"
        },
        getSchema: {
            method: 'GET',
            url: endpoint + "/schema/:processType/:processName"
        },
        updateWorkflow: {
            method: 'POST',
            url: endpoint + "/update",
            transformResponse: function (data, headersGetter, status) {
                data = JSON.parse(data);
                if (status == 200) {
                    var customer = data.customer;
                    transformResponse(customer);
                }
                return data;
            },
        },
        allUIDefinition: {
            method: 'GET',
            url: "/source/dev-www/modules/models/common/processBlock.json"

        }
        
    });
    ret.uiDefinition = function() {
        var deferred = $q.defer();
        var process = SessionStore.getItem("WorkflowProcess__" + SessionStore.getLoginname());
        if (process && process.map && SessionStore.session.offline) {
            deferred.resolve(process);
        } else {
            ret.allUIDefinition().$promise.then(function(resp) {
                process = {
                    map: {},
                    list: resp.process
                };
                for (var i = 0; i < resp.process.length; i++) {
                    process.map[resp.process[i].processType+'.'+resp.process[i].processName] = _.cloneDeep(resp.process[i]);
                    var p = process.map[resp.process[i].processType+'.'+resp.process[i].processName];
                    p.stages = {};
                    for (var j = 0; j < resp.process[i].stages.length; j++) {
                        var s = resp.process[i].stages[j];
                        p.stages[s.stageName] = s;
                    }
                }
                SessionStore.setItem("WorkflowProcess__" + SessionStore.getLoginname(), process);
                deferred.resolve(process);
            }, deferred.reject);
        }
        return deferred.promise;
    };
    ret.blocksDefinition = {
        "address": {
            "title": "ADDRESS",
            "readonlyBlock": [{
                key: "fullAddress",
                title: "ADDRESS",
                notitle: true,
                type: "html",
                readonly: true
            }],
            "editableBlock": [
                {
                    "key": "doorNo",
                    "title": "DoorNo"
                },

                {
                    "key": "street",
                    "title": "Street"
                },

                {
                    "key": "postOffice",
                    "title": "Postoffice"
                },
                {
                    "key": "landmark",
                    "title": "Landmark"
                },
                {
                    "key": "pincode",
                    "title": "Pincode"
                },
                {
                    "key": "district",
                    "title": "District"
                },
                {
                    "key": "state",
                    "title": "State"
                }
            ],
            "proofBlock": [{
                key: "addressProofImageId",
                type: "file",
                title: "ADDRESS_PROOF",
                fileType: "file/*",
                "category": "Customer",
                "subCategory": "ADDRESSPROOF",
                "offline": true,
                required: true,
                condition: "!model._isReadonlyEnabled"
            },
            {
                key: "addressProofImageId",
                type: "file",
                title: "ADDRESS_PROOF",
                fileType: "file/*",
                "category": "Customer",
                "subCategory": "ADDRESSPROOF",
                "offline": true,
                condition: "model._isReadonlyEnabled",
                readonly: true
            }],
            "compare": [
                {
                    "key": "doorNo"
                },
                {
                    "key": "street"
                },
                {
                    "key": "postOffice"
                },
                {
                    "key": "landmark"
                },
                {
                    "key": "pincode"
                },
                {
                    "key": "district"
                },
                {
                    "key": "state"
                },
                {
                    "key": "addressProofImageId",
                }],
            "emptyAllowed": "true"
        },
        "date_of_birth": {
            "title": "DATE_OF_BIRTH",
            "readonlyBlock": [{
                key: "dateOfBirth",
                title: "DATE_OF_BIRTH",
                notitle: true,
                type: "date",
                readonly: true
            }],
            "editableBlock": [{
                key: "dateOfBirth",
                type: "date",
                title: "UPDATE_DATE_OF_BIRTH",
                required: true
            }],
            "proofBlock": [{
                key: "ageProofImageId",
                type: "file",
                title: "AGE_PROOF",
                fileType: "file/*",
                "category": "Customer",
                "subCategory": "AGEPROOF",
                "offline": true,
                required: true,
                condition: "!model._isReadonlyEnabled"
            },
            {
                key: "ageProofImageId",
                type: "file",
                title: "AGE_PROOF",
                fileType: "file/*",
                "category": "Customer",
                "subCategory": "AGEPROOF",
                "offline": true,
                condition: "model._isReadonlyEnabled",
                readonly: true
            }],
            "compare": [{
                "key": "dateOfBirth"
            },
            {
                "key": "ageProofImageId",
            }]
        },
        "mobile_phone": {
            title: "MOBILE_PHONE",
            "readonlyBlock": [{
                key: "mobilePhone",
                title: "MOBILE_PHONE",
                notitle: true,
                readonly: true
            }],
            "editableBlock": [{
                key: "mobilePhone",
                title: "UPDATE_MOBILE_PHONE",
                inputmode: "number",
                numberType: "tel",
                required: true,
            }],
            "proofBlock": [{
                key: "mobileProofImageId",
                type: "file",
                title: "MOBILE_PROOF",
                fileType: "file/*",
                "category": "Customer",
                "subCategory": "ADDRESSPROOF",
                "offline": true,
                condition: "!model._isReadonlyEnabled"
            },
            {
                key: "mobileProofImageId",
                type: "file",
                title: "MOBILE_PROOF",
                fileType: "file/*",
                "category": "Customer",
                "subCategory": "ADDRESSPROOF",
                "offline": true,
                required: true,
                condition: "model._isReadonlyEnabled",
                readonly: true
            }],
            "compare": [{
                "key": "mobilePhone"
            },
            {
                "key": "mobileProofImageId"
            }]
        },
        "gender": {
            title: "GENDER",
            "readonlyBlock": [{
                key: "gender",
                title: "GENDER",
                notitle: true,
                readonly: true
            }],
            "editableBlock": [{
                key: "gender",
                type: "radios",
                title: "UPDATE_GENDER",
                required: true,
                "titleMap": {
                    "MALE": "MALE",
                    "FEMALE": "FEMALE",
                    "Un-Specified": "Un-Specified"
                },
            }],
            "compare": "gender"
        },
        "ownership": {
            title: "OWNERSHIP",
            "readonlyBlock": [{
                key: "ownership",
                title: "OWNERSHIP",
                notitle: true,
                readonly: true
            }],
            "editableBlock": [{
                key: "ownership",
                title: "UPDATE_OWNERSHIP",
                "type": "select",
                "screenFilter": true,
                required: true,
                "enumCode": "ownership",
            }],
            "compare": "ownership"
        },
        "enrollment": {
            title: "ENROLLMENT",
            "readonlyBlock": [{
                key: "enrolledAs",
                title: "ENROLLED_AS",
                notitle: true,
                readonly: true
            }],
            "editableBlock": [{
                key: "enrolledAs",
                title: "UPDATE_ENROLLMENT",
                "type": "select",
                "screenFilter": true,
                required: true,
                "enumCode": "enrolled_as",
            }],
            "compare": "enrolledAs",
        },
        "photo_image": {
            "title": "CUSTOMER_PHOTO",
            "readonlyBlock": [{
                key: "photoImageId",
                title: "CUSTOMER_PHOTO",
                type: "file",
                "fileType": "image/*",
                "category": "CustomerEnrollment",
                "subCategory": "PHOTO"
            }],
            "editableBlock": [{
                key: "photoImageId",
                title: "CUSTOMER_PHOTO",
                required: true,
                type: "file",
                "fileType": "image/*",
                "category": "CustomerEnrollment",
                "subCategory": "PHOTO"
            }],
            "compare": [{ "key": "photoImageId" }],
        },
        "gps": {
            title: "GPS",
            "readonlyBlock": [{
                "key": "latitude",
                "title": "GPS_LOCATION",
                "type": "geotag",
                "readonly": true,
                "latitude": "latitude",
                "longitude": "longitude"
            }],
            "editableBlock": [{
                key: "latitude",
                title: "UPDATED_GEO_LOCATION",
                "type": "geotag",
                required: true,
                "latitude": "Newlatitude",
                "longitude": "Newlongitude"
            }],
            "compare": "latitude"
        },
        "finger_prints": {
            title: "FINGER_PRINTS",
            "readonlyBlock": [{
                key: "biometricCaptured",
                condition: "model.old.leftHandIndexImageId != null",
                title: "LEFT_HAND_INDEX",
                readonly: true
            }, {
                key: "biometricNotCaptured",
                condition: "model.old.leftHandIndexImageId == null",
                title: "LEFT_HAND_INDEX",
                readonly: true
            },
            {
                key: "biometricCaptured",
                condition: "model.old.leftHandMiddleImageId != null",
                title: "LEFT_HAND_MIDDLE",
                readonly: true
            }, {
                key: "biometricNotCaptured",
                condition: "model.old.leftHandMiddleImageId == null",
                title: "LEFT_HAND_MIDDLE",
                readonly: true
            }, {
                key: "biometricCaptured",
                condition: "model.old.leftHandRingImageId != null",
                title: "LEFT_HAND_RING",
                readonly: true
            }, {
                key: "biometricNotCaptured",
                condition: "model.old.leftHandRingImageId == null",
                title: "LEFT_HAND_RING",
                readonly: true
            }, {
                key: "biometricCaptured",
                condition: "model.old.leftHandSmallImageId != null",
                title: "LEFT_HAND_SMALL",
                readonly: true
            }, {
                key: "biometricNotCaptured",
                condition: "model.old.leftHandSmallImageId == null",
                title: "LEFT_HAND_SMALL",
                readonly: true
            }, {
                key: "biometricCaptured",
                condition: "model.old.leftHandThumpImageId != null",
                title: "LEFT_HAND_THUMB",
                readonly: true
            }, {
                key: "biometricNotCaptured",
                condition: "model.old.leftHandThumpImageId == null",
                title: "LEFT_HAND_THUMB",
                readonly: true
            },
            {
                key: "biometricCaptured",
                condition: "model.old.rightHandIndexImageId != null",
                title: "RIGHT_HAND_INDEX",
                readonly: true
            }, {
                key: "biometricNotCaptured",
                condition: "model.old.rightHandIndexImageId == null",
                title: "RIGHT_HAND_INDEX",
                readonly: true
            }, {
                key: "biometricCaptured",
                condition: "model.old.rightHandMiddleImageId != null",
                title: "RIGHT_HAND_MIDDLE",
                readonly: true
            }, {
                key: "biometricNotCaptured",
                condition: "model.old.rightHandMiddleImageId == null",
                title: "RIGHT_HAND_MIDDLE",
                readonly: true
            }, {
                key: "biometricCaptured",
                condition: "model.old.rightHandRingImageId != null",
                title: "RIGHT_HAND_RING",
                readonly: true
            }, {
                key: "biometricNotCaptured",
                condition: "model.old.rightHandRingImageId == null",
                title: "RIGHT_HAND_RING",
                readonly: true
            }, {
                key: "biometricCaptured",
                condition: "model.old.rightHandSmallImageId != null",
                title: "RIGHT_HAND_SMALL",
                readonly: true
            }, {
                key: "biometricNotCaptured",
                condition: "model.old.rightHandSmallImageId == null",
                title: "RIGHT_HAND_SMALL",
                readonly: true
            }, {
                key: "biometricCaptured",
                condition: "model.old.rightHandThumpImageId != null",
                title: "RIGHT_HAND_THUMB",
                readonly: true
            }, {
                key: "biometricNotCaptured",
                condition: "model.old.rightHandThumpImageId == null",
                title: "RIGHT_HAND_THUMB",
                readonly: true
            }],
            "editableBlock": [{
                type: "button",
                title: "CAPTURE_FINGERPRINT",
                notitle: true,
                fieldHtmlClass: "btn-block",
                onClick: function (model, form, formName) {
                    var promise = BiometricService.capture(model);
                    promise.then(function (data) {
                        model.old.$fingerprint = data;
                        //model.customer.$fingerprintquality = EnrollmentHelper.checkBiometricQuality(model);
                        // console.log(data[0]);
                        $log.info(data);
                    }, function (reason) {
                        console.log(reason);
                    },
                    )
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
                    '<spa,n><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightMiddle\')"></i> {{ model.getFingerLabel(\'RightMiddle\') }}</span><br>' +
                    '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightRing\')"></i> {{ model.getFingerLabel(\'RightRing\') }}</span><br>' +
                    '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightLittle\')"></i> {{ model.getFingerLabel(\'RightLittle\') }}</span><br>' +
                    '</div></div>'
            }],
            "compare": [{
                "key": "leftHandIndexImageId"
            },
            {
                "key": "leftHandMiddleImageId"
            },
            {
                "key": "leftHandRingImageId"
            }, {
                "key": "leftHandSmallImageId"
            },
            {
                "key": "leftHandThumpImageId"
            },
            {
                "key": "rightHandIndexImageId"
            },
            {
                "key": "rightHandMiddleImageId"
            },
            {
                "key": "rightHandRingImageId"
            },
            {
                "key": "rightHandSmallImageId"
            },
            {
                "key": "rightHandThumpImageId"
            }]
        }
    };
    ret.initializeBlocks = function (data) {
        data.fullAddress = [data.doorNo, data.street, data.postOffice, data.landmark, data.district, data.state, data.pincode].filter(a => a).join(", ");
        data.fullFingerprint = [data.leftHandIndexImageId, data.leftHandMiddleImageId, data.leftHandRingImageId, data.leftHandSmallImageId, data.leftHandThumpImageId, data.rightHandIndexImageId, data.rightHandMiddleImageId, data.rightHandRingImageId, data.rightHandSmallImageId, data.rightHandThumpImageId].filter(a => a).join(", ");

    };
    ret.renderBlocks = function (model, readonly, caConfig) {
        var deferred = $q.defer();
        // var listOfBlocks = ["photo_image", "address", "gps", "date_of_birth", "mobile_phone", "gender", "ownership", "enrollment", "finger_prints"];
        var listOfBlocks = caConfig;
        var form = [];
        // listOfBlocks =this.resource.getSchema();
        model._isUpdated = model._isUpdated || {};
        for (i in listOfBlocks) {
            var k = listOfBlocks[i];
            var v = ret.blocksDefinition[k];
            var rBlock = _.cloneDeep(v.readonlyBlock);
            rBlock.forEach(b => b.key = "old." + b.key);
            var eBlock = null;
            if (readonly) {
                eBlock = _.cloneDeep(v.readonlyBlock);
                eBlock.forEach(b => b.key = "new." + b.key);
            } else {
                eBlock = _.cloneDeep(v.editableBlock);
                eBlock.forEach(b => b.key = "new." + b.key);
            }
            if (v.proofBlock) {
                var pBlock = _.cloneDeep(v.proofBlock);
                pBlock.forEach(b => {
                    b.key = "new." + b.key;
                    b.readonly = readonly;
                });
                eBlock = eBlock.concat(pBlock);
            }
            if (readonly && v.compare) {
                model._isUpdated[k] = false;
                for (i in v.compare) {
                    temp = v.compare[i].key;
                    if (model.old[temp] != model.new[temp]) {
                        model._isUpdated[k] = true;
                    }
                }
            }
            // for loop if one change model._isUpdated[k] = true
            // model._isUpdated[k] = model.old[v.compare] != model.new[v.compare];
            // }
            // if(readonly && v.compare){
            //     model._isUpdated[k] = model.old[v.compare] != model.new[v.compare];
            // }
            form.push({
                type: "fieldset",
                title: v.title,
                "items": [{
                    type: "section",
                    htmlClass: "row",
                    items: [{
                        type: "section",
                        htmlClass: "col-sm-5",
                        items: rBlock
                    },
                    {
                        type: "section",
                        htmlClass: "col-sm-2",
                        items: [{
                            key: "_isUpdated." + k,
                            title: "UPDATE",
                            condition: "model._isUpdateEnabled",
                            type: "checkbox",
                            schema: {
                                default: true

                            }
                        }, {
                            key: "_isUpdated." + k,
                            title: "UPDATE",
                            condition: "!model._isUpdateEnabled",
                            readonly: true,
                            type: "checkbox",
                            schema: {
                                default: true
                            }
                        }]
                    }, {
                        type: "section",
                        htmlClass: "col-sm-5",
                        condition: "model._isUpdated." + k,
                        items: eBlock
                    }]
                }]
            });
        };
        // return form;
        deferred.resolve(form);
        return deferred.promise;

    };
    // ret.copyBlock = function (model)
    //  {
    //     // var listOfBlocks = ["photo_image", "address", "gps", "date_of_birth", "mobile_phone", "gender", "ownership", "enrollment", "finger_prints"];
    //     var listOfBlocks=caConfig
    //     for (i in listOfBlocks) {
    //         var k = listOfBlocks[i];
    //         var v = ret.blocksDefinition[k];
    //         // if (model.new[v.compare]) {
    //         //     model.old[v.compare] = model.new[v.compare];
    //         // }
    //         //if (model.new[v.compare]) {
    //         // titles=v.title;
    //         if (model._isUpdated[k]) {
    //             for (j in v.copy) {
    //                 temp = v.copy[j].key;
    //                 // if(v.emptyAllowed && model.new[temp]==null){
    //                 //     emptyAllowed==true
    //                 // }
    //                 if ((v.emptyAllowed || model.new[temp]) && model.old[temp] !== model.new[temp]) {
    //                     model.old[temp] = model.new[temp];
    //                 }
    //             }
    //         }

    //         //}

    //     };
    // };
    ret.block=$http.get('modules/models/common/processBlock.json').success(function (data) {
        var processBlock = data.process;
        console.log(processBlock);
        return processBlock;
    });
    console.log($http.get('modules/models/common/processBlock.json').success);
    // var resource = $resource("",null,{
    //     allUI:{
    //         method:'GET',
    //         url:"modules/models/common/processBlock.json"
    //     }
    // });
    // var res=this.resource.allUI();
    // console.log(res);
    return ret;
});
