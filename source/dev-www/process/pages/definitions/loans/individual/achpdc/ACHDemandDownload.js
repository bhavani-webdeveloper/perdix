/*
About ACHClearingCollection.js
------------------------------
1. To download the demand list with date criteria
2. To upload the demand list and change the status as "MARK AS PAID"

Methods
-------
Initialize : To decare the required model variables.
onClick : To download the Domand List based on date criteria and to call "ACH.getDemandList" service
onChange : To select/unselect all demands listed in array.
customHandle : To upload ACH files(Excel).

Services
--------
ACH.getDemandList : To get all the demands for the entered date. And all the branch ID's are 
                    parsed so as to get all the demands for the corresponding date.
ACH.achDemandListUpload : To upload the selected file.
ACH.bulkRepay : To repay all the demands marked. The req. is send as JSON Array.
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHDemandDownload"), ["$log", "SessionStore", 'Utils', 'ACH', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q', 'ACHPDCBatchProcess',
    function($log, SessionStore, Utils, ACH, AuthTokenHelper, PageHelper, formHelper, $filter, $q, ACHPDCBatchProcess) {
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "ACH_DEMANDS_DOWNLOAD_UPLOAD",
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
                "title": "ACH_INPUT",
                "items": [{
                    "type": "fieldset",
                    "title": "DOWNLOAD_ACH_INPUT",
                    "items": [{
                        "key": "achCollections.demandDate",
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
            }, {
                "type": "box",
                "title": "UPLOAD_COLLECTION_DEMAND_",
                "items": [{
                    "type": "fieldset",
                    "title": "UPLOAD_STATUS",
                    "items": [{
                            "key": "ach.collectionDemandFileId",
                            "notitle": true,
                            "type": "file",
                            "category": "Collection",
                            "subCategory": "offline",
                            "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            customHandle: function(file, progress, modelValue, form, model) {
                                PageHelper.showBlockingLoader("Processing...");
                                ACH.achDemandListUpload(file, progress)
                                    .then(
                                        function(response){
                                            PageHelper.showProgress("action-succes", "Batch task for collection-demand-upload has been successfully created. Please check the status in ACH Realization Batch Monitoring screen.", 5000);
                                        }, function(httpResponse){
                                            PageHelper.showProgress("collection-demand-upload", "Upload Failed!", 5000);
                                        }
                                    )
                                    .finally(function(){
                                        PageHelper.hideBlockingLoader();
                                    })
                                    ;
                            }
                        }
                    ]
                }]
            }],
            schema: function() {
                return ACH.getSchema().$promise;
            },
            actions: {
                
            }
        };
    }
]);