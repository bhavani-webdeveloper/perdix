define({
    pageUID: "management.ReceiptPrint",
    pageType: "Engine",
    dependencies: ["$log","Pages_ManagementHelper","PagesDefinition","Queries","Lead","Enrollment","BranchCreationResource", "$q",'PageHelper', 'formHelper','irfProgressMessage',
        'SessionStore', "$state", "$stateParams", "Masters", "Utils"],
    $pageFn: function($log,Pages_ManagementHelper,PagesDefinition,Queries,Lead,Enrollment,BranchCreationResource, $q, PageHelper, formHelper, irfProgressMessage,
        SessionStore, $state, $stateParams, Masters, Utils) {

        var webPrintStyle = '<style>@media print { body * { visibility: hidden; } .web-print-wrapper, .web-print-wrapper * { visibility: visible } .web-print-wrapper { position: absolute; top: 0; left: 0;} html, body {height: 100%;}}</style>';
        
        return {
            "name": "",
            "type": "schema-form",
            "title": "Receipt Print",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Create Branch Page loaded");
                model.paperReceipt='<div>'+'No Data Available'+'</div>';
                if($stateParams.pageData){
                   model.thermalReceipt=$stateParams.pageData.thermalReceipt; 
                   model.paperReceipt=$stateParams.pageData.paperReceipt; 
                }
                var self = this;
                self.form = [];
                self.form=[
                    {
                        "type": "box",
                        "title": "",
                        "items": [
                            {
                                "type": "section",
                                "html": '<div class="web-print-wrapper">' + webPrintStyle + model.paperReceipt + '</div>'
                            }
                        ]
                    },
                
                    {
                        "type": "actionbox",
                        "items": [{
                            "type": "submit",
                            "title": "PRINT",
                        }]
                    }

                ]
            },
            form: [],

            schema: function() {
                 return Lead.getLeadSchema().$promise;  
            },
            actions: {
                submit: function(model, form, formName) {
                    if(model.thermalReceipt){
                        model.thermalReceipt.getLines();
                    }
                    try {
                        if (Utils.isCordova && model.thermalReceipt) {
                            cordova.plugins.irfBluetooth.print(function() {
                                console.log("succc callback");
                            }, function(err) {
                                console.error(err);
                                console.log("errr collback");
                            }, model.thermalReceipt.getLines());
                        } else if (model.paperReceipt) {
                            window.print();
                        } else {
                            PageHelper.clearErrors();
                            PageHelper.setError({message: 'No Data To Print'});
                        }
                    } catch (err) {
                        console.log(err);
                        $log.info("pringing web data");
                    }
                }
            }
        };
    }
})