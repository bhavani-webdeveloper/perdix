define({
    pageUID: "MutualFund.MutualFundUploadFeed",
    pageType: "Engine",
    dependencies: ["$log", "$q", "Enrollment", 'EnrollmentHelper', 'PageHelper', 'formHelper', "elementsUtils","Files",

        'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "irfNavigator", "CustomerBankBranch",'MutualFund',"Utils","BASE_URL"
    ],

    $pageFn: function($log, $q, Enrollment, EnrollmentHelper, PageHelper, formHelper, elementsUtils,Files,
        irfProgressMessage, SessionStore, $state, $stateParams, irfNavigator, CustomerBankBranch,MutualFund,Utils,BASE_URL) {

        var endpoint = BASE_URL + '/api/mutualFund';
        return {
            "id": "MutualFundFeeds",
            "type": "schema-form",
            "title": "MUTUAL_FUND_FEEDS",
            initialize: function(model, form, formCtrl) {
                model.customer = model.customer || {};               
                var customerId = $stateParams.pageId;                         
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
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    customHandle: function(file, progress, modelValue, form, model) {
                        MutualFund.navFileUpload(file, progress).then(function(res){
                            $state.go('Page.MutualFund.MutualFundSummary', null);
                        });
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
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    customHandle: function(file, progress, modelValue, form, model) {
                        MutualFund.reverseFeedUpload(file, progress).then(function(res){
                            $state.go('Page.MutualFund.MutualFundSummary', null);
                        });
                    }
                }]
                },
            ],
            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            actions: {
                downloadFeed: function(model){
                $log.info("Inside download()");                
                PageHelper.clearErrors();
                PageHelper.showLoader();
                var reqData = _.cloneDeep(model); 
                PageHelper.hideLoader();
                MutualFund.getFileId({
                    transactionType : model.customer.transactionType,
                    fromDate : model.customer.fromDate,
                    toDate : model.customer.toDate
                    },function(res) {
                        console.log( res);
                        var fileId = res.fileId;
                        Utils.downloadFile(Files.getFileDownloadURL(fileId));            
                        }
                )                       
                }
            }  
        };
    }
})