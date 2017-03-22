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
irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHMandateDownload"), ["$log", "Enrollment", "ACH", "SessionStore", "$state", "$stateParams", "AuthTokenHelper", "PageHelper", "$httpParamSerializer",
    function($log, Enrollment, ACH, SessionStore, $state, $stateParams, AuthTokenHelper, PageHelper, $httpParamSerializer) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "ACH_MANDATE",
            "subTitle": "",

            initialize: function(model, form, formCtrl) {
                $log.info("ACH Mandate Download Page got initialized");
                model.authToken = AuthTokenHelper.getAuthData().access_token;
                model.userLogin = SessionStore.getLoginname();
                model.achSearch = model.achSearch || {};
                model.achUpdate = model.achUpdate || [];

                model.flag = false;
                model.achMandate = model.achMandate || {};
                model.achMandate.changeMandateStatus = model.achMandate.changeMandateStatus || [];
                //Search for existance of Loan account Number
                model.bi = {};
                model.bi.report_name = "ach_registration_mandate";
                //model.bi.from_date = "2016-09-24";
                //model.bi.to_date = "2016-09-24";
            },
            offline: false,

            getOfflineDisplayItem: function(item, index) {},

            form: [{
                "type": "box",
                "title": "DOWNLOAD_UPLOAD_ACH_MANDATES",
                "colClass": "col-sm-6",
                "items": [{
                    "type": "fieldset",
                    "title": "DOWNLOAD_STATUS",
                    "items": [{
                        "key": "ach.achMandateStatus",
                        "title": "MANDATE_STATUS",
                        "required": true,
                        "type": "select",
                        "titleMap": {
                            "PENDING": "PENDING",
                            "SUBMITTED": "SUBMITTED"
                        }
                    }, {
                        "title": "DOWNLOAD",
                        "key": "ach.achMandateDownload",
                        "htmlClass": "btn-block",
                        "condition": "model.ach.achMandateStatus",
                        "icon": "fa fa-download",
                        "type": "button",
                        "readonly": false,
                        "onClick": function(model, formCtrl, form, event) {
                            if (model.ach.achMandateStatus) {
                                model.achMandate.changeMandateStatus = [];
                                //window.open(irf.BI_BASE_URL+"/download.php?user_id="+model.userLogin+"&auth_token="+model.authToken+"&report_name=ach_registration_mandate");
                                var biDownloadUrl = irf.BI_BASE_URL + '/download.php?auth_token=' + AuthTokenHelper.getAuthData().access_token + '&' + $httpParamSerializer(model.bi) + '&mandate_status=' + model.ach.achMandateStatus;
                                window.open(biDownloadUrl);
                                PageHelper.clearErrors();
                                PageHelper.showLoader();
                                ACH.search({
                                    mandateStatus: model.ach.achMandateStatus
                                }).$promise.then(
                                    function(res) {
                                        $log.info("response: " + res);
                                        model.achSearch = res;
                                        if (model.achSearch.body.length > 0) {
                                            model.flag = true;
                                        }
                                        for (var i = 0; i < model.achSearch.body.length; i++) {
                                            model.achSearch.body[i].maximumAmount = parseInt(model.achSearch.body[i].maximumAmount);
                                            model.achSearch.body[i].maximumAmount = model.achSearch.body[i].maximumAmount.toString();
                                            model.achMandate.changeMandateStatus.push(model.achSearch.body[i]);
                                            model.achMandate.changeMandateStatus[i].check = false;
                                        }
                                    },
                                    function(httpRes) {
                                        PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                                        PageHelper.showErrors(httpRes);
                                        $log.info("ACH Search Response : " + httpRes);
                                    }
                                ).finally(function() {
                                    PageHelper.hideLoader();
                                });

                            }

                            // PageHelper.clearErrors();
                            // PageHelper.showLoader();
                            // ACH.update(model.achSearch.body).$promise.then( 
                            //     function(response) {
                            //         PageHelper.hideLoader();
                            //         PageHelper.showProgress("page-init", "Done.", 2000);
                            //         model.flag = true;
                            //     },
                            //     function(errorResponse) {
                            //         PageHelper.hideLoader();
                            //         PageHelper.showErrors(errorResponse);
                            //     }
                            // ).finally(function(){
                            //     PageHelper.hideLoader();
                            // }
                            // );
                        }
                    }]
                }
                // , {
                //     "type": "fieldset",
                //     "title": "UPLOAD_STATUS",
                //     "items": [{
                //             "key": "ach.achMandateReverseFileId",
                //             "notitle": true,
                //             "category": "ACH",
                //             "subCategory": "cat2",
                //             "type": "file",
                //             "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                //             customHandle: function(file, progress, modelValue, form, model) {
                //                 ACH.achMandateUpload(file, progress);
                //             }
                //         }
                //         //,
                //         // {
                //         //     "type": "button",
                //         //     "icon": "fa fa-user-plus",
                //         //     "title": "UPLOAD",
                //         //     "onClick": "actions.proceed(model, formCtrl, form, $event)"
                //         // }
                //     ]
                // }
                ]
            }, {
                "type": "box",
                "notitle": true,
                "items": [{
                    "type": "fieldset",
                    "title": "UPLOAD_ACH_MANDATE_STATUS",
                    "items": [{
                        "key": "ach.achMandateReverseFileId",
                        "notitle": true,
                        "category": "ACH",
                        "subCategory": "cat2",
                        "type": "file",
                        "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        customHandle: function(file, progress, modelValue, form, model) {
                            ACH.achMandateUpload(file, progress);
                        }
                    }]
                }]
            }
            // , {
            //     "type": "box",
            //     "notitle": true,
            //     "items": [{
            //         "type": "fieldset",
            //         "title": "UPDATE_ACH_MANDATE_STATUS",
            //         "items": [{
            //             "key": "achMandate.checkbox",
            //             "condition": "model.flag",
            //             "type": "checkbox",
            //             "title": "SELECT_ALL",
            //             "schema": {
            //                 "default": false
            //             },
            //             "onChange": function(modelValue, form, model) {

            //                 if (modelValue) {
            //                     for (var i = 0; i < model.achSearch.body.length; i++) {
            //                         model.achMandate.changeMandateStatus[i].check = true;
            //                     }
            //                 } else {
            //                     for (var i = 0; i < model.achSearch.body.length; i++) {
            //                         model.achMandate.changeMandateStatus[i].check = false;
            //                     }
            //                 }
            //             }
            //         }, {
            //             "type": "array",
            //             "key": "achMandate.changeMandateStatus",
            //             "condition": "model.flag",
            //             "add": null,
            //             "startEmpty": true,
            //             "remove": null,
            //             "title": "PENDING_MANDATE_LIST",
            //             "titleExpr": "(model.achMandate.changeMandateStatus[arrayIndex].check?'⚫ ':'⚪ ') + model.achMandate.changeMandateStatus[arrayIndex].mandateStatus + ' - ' + model.achMandate.changeMandateStatus[arrayIndex].accountId",
            //             "items": [{
            //                 "key": "achMandate.changeMandateStatus[].accountId",
            //                 "title": "ACCOUNT_NUMBER",
            //                 "readonly": true
            //             }, {
            //                 "key": "achMandate.changeMandateStatus[].accountHolderName",
            //                 "title": "CUSTOMER_NAME",
            //                 "readonly": true
            //             }, {
            //                 "key": "achMandate.changeMandateStatus[].mandateStatus",
            //                 "title": "MANDATE_STATUS",
            //                 "readonly": true
            //             }, {
            //                 "key": "achMandate.changeMandateStatus[].check",
            //                 "title": "MARK_AS_SUBMITTED",
            //                 "type": "checkbox",
            //                 "schema": {
            //                     "default": false
            //                 }
            //             }, ]
            //         }]
            //     }, {
            //         "type": "actionbox",
            //         "condition": "model.flag",
            //         "items": [{
            //             "type": "submit",
            //             "title": "SUBMIT"
            //         }]
            //     }]
            // }
            ],

            schema: function() {
                return ACH.getSchema().$promise;
            },

            actions: {
                submit: function(model, form, formName) {
                    model.achUpdate = [];
                    for (var i = 0; i < model.achSearch.body.length; i++) {
                        if (model.ach.achMandateStatus == "PENDING") {
                            if (model.achMandate.changeMandateStatus[i].check) {
                                model.achMandate.changeMandateStatus[i].mandateStatus = "SUBMITTED";
                                model.achUpdate.push(model.achMandate.changeMandateStatus[i]);
                            } else {
                                model.achSearch.body[i].mandateStatus = "PENDING"
                            }
                        } else if (model.ach.achMandateStatus == "SUBMITTED") {
                            if (model.achMandate.changeMandateStatus[i].check) {
                                model.achMandate.changeMandateStatus[i].mandateStatus = "ACCEPTED";
                                model.achUpdate.push(model.achMandate.changeMandateStatus[i]);
                            } else {
                                model.achSearch.body[i].mandateStatus = "SUBMITTED"
                            }
                        }

                    }
                    PageHelper.clearErrors();
                    PageHelper.showLoader();
                    ACH.updateMandateStatus(model.achUpdate).$promise.then(
                        function(response) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress("page-init", "Done.", 2000);
                            model.achMandate.changeMandateStatus = [];
                            model.achSearch.body = [];
                            model.flag = false;
                        },
                        function(errorResponse) {
                            PageHelper.hideLoader();
                            PageHelper.showErrors(errorResponse);
                        }
                    ).finally(function() {
                        PageHelper.hideLoader();
                    });
                }
            }
        };
    }
]);