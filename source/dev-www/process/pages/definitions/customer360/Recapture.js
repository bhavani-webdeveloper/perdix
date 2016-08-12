irf.pageCollection.factory(irf.page("customer360.Recapture"),
["$log", "$q", "Enrollment", "SessionStore", "$state", "entityManager", "formHelper",
"$stateParams", "irfProgressMessage", "PageHelper", "EnrollmentHelper",
function($log, $q, Enrollment, SessionStore, $state, entityManager, formHelper,
    $stateParams, irfProgressMessage, PageHelper, EnrollmentHelper){
    return {
        "type": "schema-form",
        "title": "RECAPTURE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            var ids = $stateParams.pageId.split(':');
            this.subTitle = model.recaptureType = this.form[0].title = ids[1];
            var customerId = Number(ids[0]);
            if (!model || !model.customer || model.customer.id != customerId) {
                $log.info("data not there, redirecting...");

                irfProgressMessage.pop("RECAPTURE","An Error Occurred. Failed to fetch Data", 5000);
                $state.go("Page.Engine",{
                    pageName:"Customer360",
                    pageId:customerId
                });
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
                    "key": "customer.latitude",
                    "title": "HOUSE_LOCATION",
                    "type": "geotag",
                    "latitude": "customer.latitude",
                    "longitude": "customer.longitude",
                    "condition": "model.recaptureType === 'GPS'"
                },
                {
                    "key":"customer.photoImageId",
                    "type":"file",
                    "fileType":"image/*",
                    "offline": true,
                    "condition": "model.recaptureType === 'PHOTO'"
                },
                {
                    "key":"customer.leftThumpIndexId",
                    "type":"file",
                    "fileType":"biometric/*",
                    "offline": true,
                    "condition": "model.recaptureType === 'FINGERPRINT'"
                }
            ]
        },{
            "type": "actionbox",
            // "condition": "model.requestRecaptureType === 'PHOTO'",
            "items": [{
                "type": "submit",
                "title": "REQUEST_RECAPTURE"
            }]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName) {
                $log.debug("REQUEST_TYPE: " + model.recaptureType);
                PageHelper.showLoader();
                irfProgressMessage.pop('RECAPTURE', 'Working...');
                model.enrollmentAction = "SAVE";
                $log.info(model);
                var reqData = _.cloneDeep(model);
                Enrollment.updateEnrollment(reqData, function (res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('RECAPTURE', 'Done. Customer Updated, ID : ' + res.customer.id, 2000);
                    $state.go("Page.Engine", {
                        pageName: "Customer360",
                        pageId: model.customer.id
                    });
                }, function (res, headers) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop('RECAPTURE', 'Oops. Some error.', 2000);
                    $window.scrollTo(0, 0);
                    PageHelper.showErrors(res);
                })
            }
        }
    };
}]);
