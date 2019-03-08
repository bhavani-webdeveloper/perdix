
define({
    pageUID: "shramsarathi.dashboard.lead.LeadBulkUpload",
    pageType: "Engine",
    dependencies: ["$log", "SessionStore", "$state", "$stateParams", "Lead", "irfNavigator", "Utils","PageHelper"],

    $pageFn: function($log, SessionStore, $state, $stateParams, Lead, irfNavigator, Utils,PageHelper) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "LEAD_DATA_BULK_UPLOAD",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("LeadBulkUpload  Page got initialized");
                console.log("shramsarathi.dashboard.lead.LeadBulkUpload");
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {},
            form: [{
                "type": "box",
                "title": "LEAD_UPLOAD",
                "colClass": "col-sm-6",
                "items": [{
                    "key": "lead.Bulkfile",
                    "notitle": true,
                    "title": "LEAD_UPLOAD",
                    "category": "ACH",
                    "subCategory": "cat2",
                    "type": "file",
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    customHandle: function(file, progress, modelValue, form, model) {
                        Lead.leadBulkUploadbyType(file,"Individual",progress).then(function(resp){
                            
                            //  PageHelper.showErrors({data:{error:resp.data[0].errorMessage}});
                        if (resp.data.length>0){
                              var errorArray=[];
                            angular.forEach(resp.data, function(message, key) {
                                errorArray.push(message.errorMessage); 
                            });
                           var send={data:{errors:{bulkupload:errorArray}}};
                            PageHelper.showErrors(send);
                            }
                            irfNavigator.go({
                                state: "Page.Adhoc",
                                pageName: "shramsarathi.dashboard.lead.LeadDashboard"
                            },function(err){
                               
                            });
                        });
                    }
                }]
            }
            // {
            //     "type": "box",
            //     "title": "LEAD_DOWNLOAD",
            //     "colClass": "col-sm-6",
            //     "items": [{
            //         "type": "button",
            //         "title":"DOWNLOAD",
            //         "icon": "fa fa-download",
            //         "notitle": true,
            //         "readonly": false,
            //          onClick: function(model, form, schemaForm, event) {
            //             var file = irf.MANAGEMENT_BASE_URL + "/server-ext/template/LeadBulkUpload.xlsx";
            //             Utils.downloadFile(file);
            //             //Utils.downloadFile(irf.MANAGEMENT_BASE_URL + "/forms/AllFormsDownload.php?record_id=" + model.loanAccount.id);
            //         }
            //     }]
            // }
        ],
            schema: function() {
                return Lead.getLeadSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {

                },
                proceed: function(model, formCtrl, form, $event) {}
            }
        };
    }
})
