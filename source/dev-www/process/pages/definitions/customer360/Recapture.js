irf.pageCollection.factory(irf.page("customer360.Recapture"),
["$log", "$q", "Enrollment", "SessionStore", "$state", "entityManager", "formHelper",
"$stateParams", "irfProgressMessage", "PageHelper", "EnrollmentHelper", "BiometricService", "Files","$window","Utils","BranchCreationResource",
function($log, $q, Enrollment, SessionStore, $state, entityManager, formHelper,
    $stateParams, irfProgressMessage, PageHelper, EnrollmentHelper, BiometricService, Files,$window,Utils,BranchCreationResource){

        
    var submit = function (model) {
        $log.debug("REQUEST_TYPE: " + model.recaptureType);
        var param = {};
        var reqData = _.cloneDeep(model);
        param.customer = reqData.customer;
        param.enrollmentAction = "PROCEED";
        PageHelper.showLoader();
        irfProgressMessage.pop('RECAPTURE', 'Working...');
        Enrollment.updateEnrollment(param, function (res, headers) {
            PageHelper.hideLoader();
            irfProgressMessage.pop('RECAPTURE', 'Done. Customer Updated, ID : ' + res.customer.id, 2000);
            $state.go("Page.Customer360", {
                pageId: model.customer.id
            });
        }, function (res, headers) {
            PageHelper.hideLoader();
            irfProgressMessage.pop('RECAPTURE', 'Oops. Some error.', 2000);
            $window.scrollTo(0, 0);
            PageHelper.showErrors(res);
        })
    };

    return {
        "type": "schema-form",
        "title": "RECAPTURE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            var ids = $stateParams.pageId.split(':');
            this.subTitle = model.recaptureType = this.form[0].title = ids[1];
            var customerId = Number(ids[0]);
             //start
             var branchId = SessionStore.getBranchId();
             if (!Utils.isCordova) {
                 BranchCreationResource.getBranchByID({
                         id: branchId
                     },
                     function (branchDetails) {
                         if (branchDetails.fingerPrintDeviceType) {
                             if (branchDetails.fingerPrintDeviceType == "MANTRA") {
                                 model.fingerPrintDeviceType = branchDetails.fingerPrintDeviceType;
                             }
                         }

                         PageHelper.hideLoader();
                     },
                     function (err) {
                         $log.info(err);
                     }
                 );
             }
             //end
            if (!model || !model.customer || model.customer.id != customerId) {
                $log.info("data not there, redirecting...");

                irfProgressMessage.pop("RECAPTURE","An Error Occurred. Failed to fetch Data", 5000);
                $state.go("Page.Customer360",{
                    pageId:customerId
                });
            } else {
                if (model.recaptureType === 'FINGERPRINT') {
                    /* TODO to be removed */
                    model.isFPEnrolled = function(fingerId){
                        //$log.info("Inside isFPEnrolled: " + BiometricService.getFingerTF(fingerId) + " :"  + fingerId);
                        if (model.customer[BiometricService.getFingerTF(fingerId)]!=null || (typeof(model.customer.$fingerprint)!='undefined' && typeof(model.customer.$fingerprint[fingerId])!='undefined' && model.customer.$fingerprint[fingerId].data!=null )) {
                            //$log.info("Inside isFPEnrolled: :true");
                            return "fa-check text-success";
                        }
                        //$log.info("Inside isFPEnrolled: false");
                        return "fa-close text-danger";
                    }

                    model.getFingerLabel = function(fingerId){
                        return BiometricService.getLabel(fingerId);
                    }
                }
            }
            $log.info("I got initialized");
        },
        form: [{
            "type": "box",
            "title": "",
            "items": [
                {
                    "key": "customer.firstName",
                    "title": "FULL_NAME",
                    "readonly": "true"
                },
                {
                    type: "button",
                    title: "CAPTURE_FINGERPRINT",
                    notitle: true,
                    fieldHtmlClass: "btn-block",
                    onClick: function(model, form, formName){
                        var promise = BiometricService.capture(model);
                        promise.then(function(data){
                            model.customer.$fingerprint = data;
                        }, function(reason){
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
        },{
            "type": "actionbox",
            "items": [{
                "type": "submit",
                "title": "Update"
            }]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName) {
                if (model.recaptureType === 'FINGERPRINT') {
                    PageHelper.showLoader();
                    var out = model.customer.$fingerprint;
                    var fpPromisesArr = [];
                    for (var key in out) {
                        if (out.hasOwnProperty(key) && out[key].data!=null) {
                            (function(obj){
                                var promise = Files.uploadBase64({file: obj.data, type: 'CustomerEnrollment', subType: 'FINGERPRINT', extn:'iso'}, {}).$promise;
                                promise.then(function(data){
                                    model.customer[obj.table_field] = data.fileId;
                                    delete model.customer.$fingerprint[obj.fingerId];
                                });
                                fpPromisesArr.push(promise);
                            })(out[key]);
                        } else {
                            if (out[key].data == null){
                                delete out[key];
                            }
                        }
                    }
                    $q.all(fpPromisesArr).then(function(){
                        submit(model);
                    });
                } else {
                    submit(model);
                }
            }
        }
    };
}]);
