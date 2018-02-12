
irf.pageCollection.factory(irf.page("loans.individual.achpdc.DemandDownloads"), ["$log", "SessionStore", 'Utils', 'ACH', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q', 'ACHPDCBatchProcess',
    function($log, SessionStore, Utils, ACH, AuthTokenHelper, PageHelper, formHelper, $filter, $q, ACHPDCBatchProcess) {
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "ACH_PDC_DEMANDS",
            "subTitle": Utils.getCurrentDate(),

            initialize: function(model, form, formCtrl) {
                model.authToken = AuthTokenHelper.getAuthData().access_token;
                model.userLogin = SessionStore.getLoginname();
                model.achpdcCollections = model.achpdcCollections || {};
                model.achpdcCollections.demandDate = model.achpdcCollections.demandDate || Utils.getCurrentDate();
                //model.achDemand.updateDemand = model.achDemand.updateDemand || [];
                for (var i = 0; i < formHelper.enum('branch_id').data.length; i++) {
                    branchIDArray.push(parseInt(formHelper.enum('branch_id').data[i].code));
                }

            },
            form: [{
                "type": "box",
                "title": "ACH_PDC_DEMANDS",
                "items": [{
                    "type": "fieldset",
                    "title": "DOWNLOAD_DEMANDS",
                    "items": [{
                        "key": "achpdcCollections.demandDate",
                        "title": "INSTALLMENT_DATE",
                        "type": "date"
                    }, {
                        "title": "DOWNLOAD",
                        "htmlClass": "btn-block",
                        "icon": "fa fa-download",
                        "type": "button",
                        "notitle": true,
                        "readonly": false,
                        "onClick": function(model, formCtrl, form, $event) {
                            if (!model.achpdcCollections.demandDate) {
                                PageHelper.setError({
                                    'message': 'Installment Date is mandatory.'
                                });
                                return false;
                            }
                            PageHelper.clearErrors();
                            PageHelper.showLoader();
                            ACHPDCBatchProcess.getBatchMonitoringTasks({demandDateFrom: model.achpdcCollections.demandDate, demandDateTo: model.achpdcCollections.demandDate, batchType: 'demand'}).then(
                                function(response) {
                                    var records = $filter('filter')(response.body, {status: 'COMPLETED'}, true);
                                    if(response.body.length > 0 && records.length === response.body.length){
                                        window.open(irf.BI_BASE_URL + "/download.php?user_id=" + model.userLogin + "&auth_token=" + model.authToken + "&report_name=ach_pdc_demands&date=" + model.achpdcCollections.demandDate);
                                        PageHelper.showProgress("page-init", "Success", 5000);
                                    } else {
                                        PageHelper.showErrors({data: {error: "Demand report for the selected date can be downloaded only when the Batch Request placed for Demand download is completed . If demand download request is not already available, please place a request from ACH / PDC Demand Request screen"}});
                                    }
                                },
                                function(error) {
                                    PageHelper.showErrors(error);
                                }).finally(function() {
                                PageHelper.hideLoader();
                            });



                            //window.open(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=ach_demands");    
                        }
                    }]
                }]
            }],
            schema: function() {
                return ACH.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {}
            }
        };
    }
]);