define({
    pageUID: "MutualFund.MutualFundDownload",
    pageType: "Engine",
    dependencies: ["$log", "SessionStore", 'Utils', 'ACH', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q', 'ACHPDCBatchProcess'],

    $pageFn: function($log, SessionStore, Utils, ACH, AuthTokenHelper, PageHelper, formHelper, $filter, $q, ACHPDCBatchProcess) {

        var branchIDArray = [];

        return {
            "type": "schema-form",
            "title": "MUTUAL_FUND_DOWNLOAD",
            "subTitle": Utils.getCurrentDate(),

            initialize: function(model, form, formCtrl) {
                model.authToken = AuthTokenHelper.getAuthData().access_token;
                model.userLogin = SessionStore.getLoginname();
                model.achCollections = model.achCollections || {};
                model.achCollections.demandDate = model.achCollections.demandDate || Utils.getCurrentDate();
                //model.achDemand.updateDemand = model.achDemand.updateDemand || [];
                for (var i = 0; i < formHelper.enum('branch_id').data.length; i++) {
                    branchIDArray.push(parseInt(formHelper.enum('branch_id').data[i].code));
                }

            },
            form: [{
                "type": "box",
                "title": "MUTUAL_FUND_DOWNLOAD",
                "items": [{
                    "type": "fieldset",
                    "title": "DOWNLOAD",
                    "items": [
                    /*{
                        "key": "achCollections.demandDate",
                        "title": "INSTALLMENT_DATE",
                        "type": "date"
                    },*/ 
                    {
                        "title": "DOWNLOAD",
                        "htmlClass": "btn-block",
                        "icon": "fa fa-download",
                        "type": "button",
                        "notitle": true,
                        "readonly": false,
                        "onClick": function(model, formCtrl, form, $event) {
                            if (!model.achCollections.demandDate) {
                                PageHelper.setError({
                                    'message': 'Installment Date is mandatory.'
                                });
                                return false;
                            }
                            PageHelper.clearErrors();
                            PageHelper.showLoader();
                            ACHPDCBatchProcess.getBatchMonitoringTasks({demandDateFrom: model.achCollections.demandDate, demandDateTo: model.achCollections.demandDate, batchType: 'demand'}).then(
                                function(response) {
                                    var records = $filter('filter')(response.body, {status: 'COMPLETED'}, true);
                                    if(response.body.length > 0 && records.length === response.body.length){
                                        window.open(irf.BI_BASE_URL + "/download.php?user_id=" + model.userLogin + "&auth_token=" + model.authToken + "&report_name=ach_demands&date=" + model.achCollections.demandDate);
                                        PageHelper.showProgress("page-init", "Success", 5000);
                                    } else{
                                        PageHelper.showErrors({data: {error: "Demand report for the selected date can be downloaded only when the Batch Request placed for Demand download is completed . If demand download request is not already available, please place a request from ACH / PDC Demand Request screen"}});
                                    }
                                },
                                function(error) {
                                    PageHelper.showErrors(error);
                                }).finally(function() {
                                PageHelper.hideLoader();
                            });
                        }
                    }]
                }]
            }],
            schema: function() {
                return ACH.getSchema().$promise;
            },
            actions: {
                
            }
        };
    }
})