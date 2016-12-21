
irf.pageCollection.factory(irf.page("loans.individual.collections.MonthlyDemandList"), 
    ["$log", "SessionStore", 'Utils', 'ACH', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q',
    function($log, SessionStore, Utils, ACH, AuthTokenHelper, PageHelper, formHelper, $filter, $q) {
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "MONTHLY_DEMAND_LIST",
            "subTitle": Utils.getCurrentDate(),

            initialize: function(model, form, formCtrl) {
                model.authToken = AuthTokenHelper.getAuthData().access_token;
               
                model.userLogin = SessionStore.getLoginname();
                model.demandlist = model.demandlist || {};
                model.demandlist.demandDate = model.demandlist.demandDate || Utils.getCurrentDate();
                //model.achDemand.updateDemand = model.achDemand.updateDemand || [];
                 var branch1 = formHelper.enum('branch_id').data;
                    for (var i = 0; i < branch1.length; i++) {
                        if ((branch1[i].name) == SessionStore.getBranch()) {
                            model.demandlist.branchId = branch1[i].value;
                            
                        }
                    }

               /* for (var i = 0; i < formHelper.enum('branch_id').data.length; i++) {
                    branchIDArray.push(parseInt(formHelper.enum('branch_id').data[i].code));
                    /download.php?user_id=" + model.userLogin + "&auth_token=" + model.authToken + "&report_name=overall_demand_report&date=" + model.demandlist.demandDate
                    branchIDArray.join(",")
                }*/

            },
            form: [{
                "type": "box",
                "title": "MONTHLY_DEMAND_LIST_DOWNLOAD",
                "items": [{
                    "type": "fieldset",
                    "title": "DOWNLOAD_MONTHLY_DEMAND_LIST",
                    "items": [{
                        "key": "demandlist.demandDate",
                        "title": "INSTALLMENT_MONTH",
                        "type": "date"
                    }, {
                        "title": "DOWNLOAD",
                        "htmlClass": "btn-block",
                        "icon": "fa fa-download",
                        "type": "button",
                        "notitle": true,
                        "readonly": false,
                        "onClick": function(model, formCtrl, form, $event) {
                            if (!model.demandlist.demandDate) {
                                PageHelper.setError({
                                    'message': 'Installment Date is mandatory.'
                                });
                                return false;
                            }
                            PageHelper.clearErrors();
                            PageHelper.showLoader();
                            ACH.demandDownloadStatus({
                                "demandDate": model.demandlist.demandDate,
                                "branchId": model.demandlist.branchId, 
                            }).$promise.then(
                                function(response) {
                                    window.open(irf.BI_BASE_URL + "/download.php?branch_Id=" + model.demandlist.branchId + "&auth_token=" + model.authToken + "&report_name=overall_demand_report&date=" + model.demandlist.demandDate );
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