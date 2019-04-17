
irf.pageCollection.factory(irf.page("customer.Dashboard"),
    ["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "VisualizationCodeResource",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "irfNavigator",
        function ($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage, VisualizationCodeResource,
            PageHelper, Utils, PagesDefinition, Queries, CustomerBankBranch, BundleManager, irfNavigator) {


            var htmlSection = {
                dashboard: `<irf-pv-dashboard><irf-pv-dashboard>`
            }
            return {
                "type": "schema-form",
                "title": "",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    var self = this;

                    self.form = [{

                        "type": "section",
                        "html": htmlSection.dashboard

                    }];
                },

                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                }
            };
        }]);
