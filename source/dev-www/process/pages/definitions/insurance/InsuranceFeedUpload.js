define({
    pageUID: "insurance.InsuranceFeedUpload",
    pageType: "Engine",
    dependencies: ["$log", "Enrollment", 'PageHelper', 'irfProgressMessage', "irfNavigator", 'Insurance','irfSimpleModal'],
    $pageFn: function($log, Enrollment, PageHelper, irfProgressMessage, irfNavigator, Insurance,showModal) {
        return {
            "id": "MutualFundFeeds",
            "type": "schema-form",
            "title": "INSURANCE_FEED_UPLOAD",
            initialize: function(model, form, formCtrl) {
            },
            form: [
                 {
                "type": "box",
                "title": "INSURANCE_FEED_UPLOAD",
                "colClass": "col-sm-6",
                "items": [{
                    "key": "file",
                    "notitle": true,
                    "title": "NAV_FEED_UPLOAD",
                    "category": "ACH",
                    "subCategory": "cat2",
                    "type": "file",
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/dbf",
                    customHandle: function(file, progress, modelValue, form, model) {
                       
                        PageHelper.clearErrors();
                        PageHelper.showLoader();
                        Insurance.insuranceReverseFeedUpload(file, progress).then(function(res){
                            var message=res.data.message;
                            var totalUpdates=message.substring(0,message.indexOf(","));
	                        var totalCount = message.substring(message.indexOf(",")+1,message.length);
                           PageHelper.hideLoader();
                                irfProgressMessage.pop('InsuranceFeedUpload', 'Feed uploaded successfully', 5000);
                                showModal("Insurance Feed Upload Report",
                                        "<dl class='dl-horizontal'><dt></dt><dd>" + totalUpdates+"<br>"
                                        +"<dl class='dl-horizontal'><dt></dt>" + totalCount
										+ "</dl>"
									);
                            },function(err){
                                PageHelper.hideLoader();
                               PageHelper.showErrors
                            });
                    }
                }]
                },   
            ],
            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            actions: {
            }  
        };
    }
})
