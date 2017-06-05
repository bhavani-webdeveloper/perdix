/*
About PDCClearingCollection.js
------------------------------
1. To download the demand list with date criteria
2. To upload the demand list and change the status as "MARK AS PAID"

Methods
-------
Initialize : To decare the required model variables.
onClick : To download the Domand List based on date criteria and to call "PDC.getDemandList" service
onChange : To select/unselect all demands listed in array.
customHandle : To upload PDC files(Excel).

Services
--------
PDC.getDemandList : To get all the demands for the entered date. And all the branch ID's are 
                    parsed so as to get all the demands for the corresponding date.
PDC.pdcDemandListUpload : To upload the selected file.
PDC.bulkRepay : To repay all the demands marked. The req. is send as JSON Array.
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCDemandDownload"), ["$log", "SessionStore", 'Utils', 'PDC', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$q', '$filter', 'ACHPDCBatchProcess',
    function($log, SessionStore, Utils, PDC, AuthTokenHelper, PageHelper, formHelper, $q, $filter, ACHPDCBatchProcess) {
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "PDC_DEMANDS_DOWNLOAD_UPLOAD",
            "subTitle": Utils.getCurrentDate(),
            initialize: function(model, form, formCtrl) {
                model.authToken = AuthTokenHelper.getAuthData().access_token;
                model.userLogin = SessionStore.getLoginname();
                model.pdcCollections = model.pdcCollections || {};
                model.pdcCollections.demandDate = model.pdcCollections.demandDate || Utils.getCurrentDate();
                //model.pdcCollections.demandDate = model.pdcCollections.demandDate || {};
                for (var i = 0; i < formHelper.enum('branch_id').data.length; i++) {
                    branchIDArray.push(parseInt(formHelper.enum('branch_id').data[i].code));
                }

            },
            "form": [{
                "type": "box",
                "title": "PDC_INPUT",
                "items": [{
                    "type": "fieldset",
                    "title": "DOWNLOAD_PDC_INPUT",
                    "items": [{
                        "key": "pdcCollections.demandDate",
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
                            if (!model.pdcCollections.demandDate) {
                                PageHelper.setError({
                                    'message': 'Installment Date is mandatory.'
                                });
                                return false;
                            }
                            PageHelper.clearErrors();
                            PageHelper.showLoader();
                            ACHPDCBatchProcess.getBatchMonitoringTasks({demandDateFrom: model.pdcCollections.demandDate, demandDateTo: model.pdcCollections.demandDate, batchType: 'demand'}).then(
                                function(response) {
                                    var records = $filter('filter')(response.body, {status: 'COMPLETED'}, true);
                                    if(response.body.length > 0 && records.length === response.body.length){
                                        window.open(irf.BI_BASE_URL + "/download.php?user_id=" + model.userLogin + "&auth_token=" + model.authToken + "&report_name=pdc_challan&date=" + model.pdcCollections.demandDate);
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
            }, {
                "type": "box",
                "title": "UPLOAD_PDC_REALIZATION_REPORT",
                "items": [{
                    "type": "fieldset",
                    "title": "UPLOAD_STATUS",
                    "items": [{
                        "key": "pdc.pdcReverseFeedListFileId",
                        "notitle": true,
                        "category": "ACH",
                        "subCategory": "cat2",
                        "type": "file",
                        "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        customHandle: function(file, progress, modelValue, form, model) {
                            PageHelper.showBlockingLoader("Processing...");
                            PDC.pdcReverseFeedListUpload(file, progress)
                                .then(
                                        function(response){
                                            PageHelper.showProgress("pdc-upload", "Upload success!", 5000);
                                        }, function(httpResponse){
                                            PageHelper.showProgress("pdc-upload", "Upload Failed!", 5000);
                                        }
                                    )
                                    .finally(function(){
                                        PageHelper.hideBlockingLoader();
                                    })

                        }
                    }]
                }]
            }],
            schema: function() {
                return PDC.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {}
            }
        };
    }
]);