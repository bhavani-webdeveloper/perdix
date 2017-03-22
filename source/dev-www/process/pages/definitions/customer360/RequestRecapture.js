irf.pageCollection.factory(irf.page("customer360.RequestRecapture"),
["$log", "$q", "Enrollment", "SessionStore", "$state", "entityManager", "formHelper",
"$stateParams", "irfProgressMessage", "PageHelper", "EnrollmentHelper",
function($log, $q, Enrollment, SessionStore, $state, entityManager, formHelper,
    $stateParams, irfProgressMessage, PageHelper, EnrollmentHelper){
    return {
        "type": "schema-form",
        "title": "REQUEST_RECAPTURE",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            var ids = $stateParams.pageId.split(':');
            this.subTitle = model.requestRecaptureType = this.form[0].title = ids[1];
            var customerId = Number(ids[0]);
            if (!model || !model.customer || model.customer.id != customerId) {
                $log.info("data not there, loading...");

                PageHelper.showLoader();
                Enrollment.getCustomerById({id:customerId},function(resp,header){
                    model.customer = resp;
                    model = EnrollmentHelper.fixData(model);
                    model._mode = 'EDIT';
                    if (model.customer.currentStage==='Stage01') {
                        irfProgressMessage.pop("enrollment-save","Customer "+model.customer.id+" not enrolled yet", 5000);
                        $state.go("Page.Engine", {pageName:'ProfileInformation', pageId:customerId});
                    } else {
                        irfProgressMessage.pop("enrollment-save","Load Complete", 2000);
                    }
                    PageHelper.hideLoader();
                },function(resp){
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("enrollment-save","An Error Occurred. Failed to fetch Data", 5000);
                    $state.go("Page.Engine",{
                        pageName:"CustomerSearch",
                        pageId:null
                    });
                });
            }
            $log.info("I got initialized");
        },
        form: [{
            "type": "box",
            "title": "",
            "items": [
                {
                    key: "customer.firstName",
                    title: "FULL_NAME",
                    readonly: "true"
                },
                {
                    "key":"requestRemarks",
                    "title": "REQUEST_REMARKS",
                    "type": "textarea"
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
                $log.debug("REQUEST_TYPE: " + model.requestRecaptureType);
            }
        }
    };
}]);
