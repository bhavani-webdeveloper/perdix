define({
    pageUID: "MutualFund.MutualFundUploadFeed",
    pageType: "Engine",
    dependencies: ["$log", "Enrollment", 'PageHelper', 'irfProgressMessage', "irfNavigator", 'MutualFund'],
    $pageFn: function($log, Enrollment, PageHelper, irfProgressMessage, irfNavigator, MutualFund) {

        return {
            "id": "MutualFundFeeds",
            "type": "schema-form",
            "title": "MUTUAL_FUND_FEEDS",
            initialize: function(model, form, formCtrl) {
            },
            form: [
                 {
                "type": "box",
                "title": "NAV_FEED_UPLOAD",
                "colClass": "col-sm-6",
                "items": [{
                    "key": "MutualFundFeed.NAVFeedUpload",
                    "notitle": true,
                    "title": "NAV_FEED_UPLOAD",
                    "category": "ACH",
                    "subCategory": "cat2",
                    "type": "file",
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/dbf",
                    customHandle: function(file, progress, modelValue, form, model) {
                        MutualFund.navFileUpload(file, progress).then(function(res){
                            irfProgressMessage.pop('MutualFundUploadFeed', 'NAV uploaded successfully', 5000);
                        }, PageHelper.showErrors);
                    }
                }]
                },   
                {
                "type": "box",
                "title": "REVERSE_FEED_UPLOAD",
                "colClass": "col-sm-6",
                "items": [{
                    "key": "MutualFundFeed.ReverseFeedUpload",
                    "notitle": true,
                    "title": "REVERSE_FEED_UPLOAD",
                    "category": "ACH",
                    "subCategory": "cat2",
                    "type": "file",
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/dbf",
                    customHandle: function(file, progress, modelValue, form, model) {
                        MutualFund.reverseFeedUpload(file, progress).then(function(res) {
                            irfProgressMessage.pop('MutualFundUploadFeed', 'Reverse feed uploaded successfully', 5000);
                        }, PageHelper.showErrors);
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