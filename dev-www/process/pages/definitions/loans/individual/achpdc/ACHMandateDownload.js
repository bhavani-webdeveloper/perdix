/*
About ACHMandateDownload.js
-------------------------
1. To Download the ACH Mandate Registration from the system(Status will be PENDING).
2. Once the file is downloaded, The Mandate Status is changed to "SUBMITTED"

Methods
-------
Initialize : To decare the required model variables.
onClick : To download the ACH Mandate List whose status are "PENDING" based on date criteria and to call "ACH.getDemandList" service
customHandle : To upload ACH Mandate Reverse Feed files(Excel).

Services
--------
ACH.search({mandateStatus: "PENDING"}) : To get all the ACH Accounts whose status are "PENDING".
ACH.update : Mandate Status is Updated as to "SUBMITTED".
ACH.achMandateUpload(file, progress) : To Upload the Mandate Reverse Feed.
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHMandateDownload"),
["$log", "Enrollment", "ACH", "SessionStore","$state", "$stateParams", "AuthTokenHelper","PageHelper",
function($log, Enrollment, ACH, SessionStore,$state,$stateParams, AuthTokenHelper,PageHelper){

    var branch = SessionStore.getBranch();
    return {
        "type": "schema-form",
        "title": "ACH_MANDATE_DOWNLOAD",
        "subTitle": "",

        initialize: function (model, form, formCtrl) {
            $log.info("ACH Mandate Download Page got initialized");
            model.authToken = AuthTokenHelper.getAuthData().access_token;
            model.userLogin = SessionStore.getLoginname();
            model.achSearch = model.achSearch || {};
            //Search for existance of Loan account Number
            ACH.search({mandateStatus: "PENDING"}).$promise.then(function(res) {
                    $log.info("response: " + res);
                    model.achSearch = res;
                },
                function(httpRes) {
                    PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                    PageHelper.showErrors(httpRes);
                    $log.info("ACH Search Response : " + httpRes);
                }
            );
        },
        offline: false,
        
        getOfflineDisplayItem: function(item, index){  
        },

        form: [
            {
                "type": "box",
                "title": "DOWNLOAD_ACH_MANDATES" ,
                "colClass":"col-sm-6",
                "items": [
                    {
                        "type":"fieldset",
                        "title":"DOWNLOAD_STATUS",
                        "items":[
                            {
                                "title": "DOWNLOAD",
                                "key":"ach.achMandateDownload",
                                "htmlClass": "btn-block",
                                "icon": "fa fa-download",
                                "type": "button",
                                "readonly": false,
                                "onClick": function(model, formCtrl, form, event){
                                    window.open(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=ach_registration_mandate");
                                
                                    for (var i = 0; i < model.achSearch.body.length; i++) {
                                        model.achSearch.body[i].mandateStatus = "SUBMITTED";
                                        model.achSearch.body[i].maximumAmount = parseInt(model.achSearch.body[i].maximumAmount);
                                        model.achSearch.body[i].maximumAmount = model.achSearch.body[i].maximumAmount.toString();
                                    }

                                    PageHelper.showLoader();
                                    ACH.update(model.achSearch.body, function(response) {
                                        PageHelper.hideLoader();
                                        PageHelper.showProgress("page-init", "Done.", 2000);
                                        model.flag = true;
                                    }, function(errorResponse) {
                                        PageHelper.hideLoader();
                                        PageHelper.showErrors(errorResponse);
                                    });
                                }
                            }
                        ]
                    },
                    {
                        "type":"fieldset",
                        "title":"UPLOAD_STATUS",
                        "items":[
                            {
                                "key": "ach.achMandateReverseFileId",
                                "notitle":true,
                                "category":"ACH",
                                "subCategory":"cat2",
                                "type": "file",
                                "fileType":"application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                customHandle: function(file, progress, modelValue, form, model) {
                                    ACH.achMandateUpload(file, progress);
                                }
                            }
                            //,
                            // {
                            //     "type": "button",
                            //     "icon": "fa fa-user-plus",
                            //     "title": "UPLOAD",
                            //     "onClick": "actions.proceed(model, formCtrl, form, $event)"
                            // }
                        ]
                    }
                ]
            }
        ],

        schema: function() {
            return Enrollment.getSchema().$promise;
        },

        actions: {
            submit: function(model, form, formName){
                $state.go("Page.Engine", {
                    pageName: 'loans.individual.achpdc.ACHMandateUpload',
                    pageId: model.customer.id
                });
            }
        }
    };
}]);