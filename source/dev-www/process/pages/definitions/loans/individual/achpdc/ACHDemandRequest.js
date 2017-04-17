/*
About ACHClearingCollection.js
------------------------------


Methods
-------


Services
--------

*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHDemandRequest"), ["$log", "SessionStore", 'Utils', 'ACH', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q',
    function($log, SessionStore, Utils, ACH, AuthTokenHelper, PageHelper, formHelper, $filter, $q) {
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "ACH_DEMANDS_REQUEST_TITLE",
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
                "title": "ACH_DEMANDS_REQUEST",
                "items": [{
                    "type": "fieldset",
                    "title": "ACH_REQUEST_INPUT",
                    "items": [{
                        "key": "achCollections.demandDate",
                        "title": "INSTALLMENT_DATE",
                        "type": "date"
                    }, {
                        "title": "REQUEST",
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
                            ACH.demandDownloadStatus({
                                "demandDate": model.achCollections.demandDate,
                                "branchId": branchIDArray.join(",")
                            }).$promise.then(
                                function(response) {
                                    window.open(irf.BI_BASE_URL + "/download.php?user_id=" + model.userLogin + "&auth_token=" + model.authToken + "&report_name=ach_demands&date=" + model.achCollections.demandDate);
                                    PageHelper.showProgress("page-init", "Success", 5000);
                                },
                                function(error) {
                                    PageHelper.showProgress("page-init", error, 5000);
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
                submit: function(model, form, formName) {}
            }
        };
    }
]);