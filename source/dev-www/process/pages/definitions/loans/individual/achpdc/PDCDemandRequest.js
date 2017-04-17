irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCDemandRequest"), ["$log", "SessionStore", 'Utils', 'PDC', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$q', '$filter',
    function($log, SessionStore, Utils, PDC, AuthTokenHelper, PageHelper, formHelper, $q, $filter) {
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "PDC_DEMANDS_REQUEST_TITLE",
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
                "title": "PDC_DEMANDS_REQUEST",
                "items": [{
                    "type": "fieldset",
                    "title": "ACH_REQUEST_INPUT",
                    "items": [{
                        "key": "pdcCollections.demandDate",
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
                            if (!model.pdcCollections.demandDate) {
                                PageHelper.setError({
                                    'message': 'Installment Date is mandatory.'
                                });
                                return false;
                            }
                            PageHelper.clearErrors();
                            PageHelper.showLoader();
                            PDC.demandDownloadStatus({
                                "demandDate": model.pdcCollections.demandDate,
                                "branchId": branchIDArray.join(",")
                            }).$promise.then(
                                function(response) {
                                    window.open(irf.BI_BASE_URL + "/download.php?user_id=" + model.userLogin + "&auth_token=" + model.authToken + "&report_name=pdc_challan&date=" + model.pdcCollections.demandDate);
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
                return PDC.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {}
            }
        };
    }
]);