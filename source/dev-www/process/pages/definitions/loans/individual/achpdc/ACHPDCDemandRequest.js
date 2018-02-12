define({
    pageUID: "loans.individual.achpdc.ACHPDCDemandRequest",
    pageType: "Engine",
    dependencies: ["$log", "SessionStore", 'Utils', 'ACH', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q', 'ACHPDCBatchProcess'],
    $pageFn: function($log, SessionStore, Utils, ACH, AuthTokenHelper, PageHelper, formHelper, $filter, $q, ACHPDCBatchProcess) {
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "ACHPDC_DEMANDS_REQUEST_TITLE",
            "subTitle": Utils.getCurrentDate(),

            initialize: function(model, form, formCtrl) {
                model.achPdcCollections = {};
                model.achPdcCollections.demandDate = model.achPdcCollections.demandDate || Utils.getCurrentDate();
                model.achPdcCollections.bankId = 1;
            },
            form: [{
                "type": "box",
                "title": "ACHPDC_DEMANDS_REQUEST",
                "items": [ {
                        "type": "fieldset",
                        "title": "ACHPDC_REQUEST_INPUT",
                        "items": [{
                            "key": "achPdcCollections.demandDate",
                            "title": "INSTALLMENT_DATE",
                            "type": "date"
                        }]
                    }, {
                        "title": "REQUEST",
                        "htmlClass": "btn-block",
                        "icon": "fa fa-download",
                        "type": "button",
                        "notitle": true,
                        "readonly": false,
                        "onClick": function(model, formCtrl, form, $event) {
                            if (!model.achPdcCollections.demandDate) {
                                PageHelper.setError({
                                    'message': 'Installment Date is mandatory.'
                                });
                                return false;
                            }
                            PageHelper.clearErrors();
                            PageHelper.showLoader();

                            ACHPDCBatchProcess.fetchDemandListFromEncore(model.achPdcCollections).$promise.then(
                                function(resp, responseHeaders, status){
                                    PageHelper.showProgress("action-succes", "Batch task for Demand Request has been successfully created. Please check the status in Batch Monitoring screen.", 5000);
                                }, 
                                function(errResp){
                                    PageHelper.showErrors(errResp);
                                }
                            ).finally(function(){
                                PageHelper.hideLoader();
                            });
                        }
                    }
                ]
            }],
            schema: function() {
                return ACH.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {}
            }
        };
    }
});