irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHPDCDemandRequest"), ["$log", "SessionStore", 'Utils', 'ACH', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q',
    function($log, SessionStore, Utils, ACH, AuthTokenHelper, PageHelper, formHelper, $filter, $q) {
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "ACH_DEMANDS_REQUEST_TITLE",
            "subTitle": Utils.getCurrentDate(),

            initialize: function(model, form, formCtrl) {
                model.authToken = AuthTokenHelper.getAuthData().access_token;
                model.userLogin = SessionStore.getLoginname();
                model.achPdcCollections = {};
                model.achPdcCollections.repaymentType = "ACH";
                model.achPdcCollections.demandDate = model.achPdcCollections.demandDate || Utils.getCurrentDate();
                // //model.achDemand.updateDemand = model.achDemand.updateDemand || [];
                // for (var i = 0; i < formHelper.enum('branch_id').data.length; i++) {
                //     branchIDArray.push(parseInt(formHelper.enum('branch_id').data[i].code));
                // }

            },
            form: [{
                "type": "box",
                "title": "ACH_PDC_DEMANDS_REQUEST",
                "items": [ {
                        "type": "fieldset",
                        "title": "ACH_PDC_REQUEST_INPUT",
                        "items": [{
                            "key": "achPdcCollections.demandDate",
                            "title": "INSTALLMENT_DATE",
                            "type": "date"
                        }]
                    }, {
                        "title": "REQUEST",
                        "htmlClass": "btn-block",
                        "icon": "fa fa-download",
                        "type": "button",
                        "notitle": true,
                        "readonly": false,
                        "onClick": function(model, formCtrl, form, $event) {
                            if (!model.achPdcCollections.demandDate) {
                                PageHelper.setError({
                                    'message': 'Installment Date is mandatory.'
                                });
                                return false;
                            }
                            PageHelper.clearErrors();
                            PageHelper.showLoader();
                        }
                    }
                ]
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