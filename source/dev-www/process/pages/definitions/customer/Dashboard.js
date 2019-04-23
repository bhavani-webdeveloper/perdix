
irf.pageCollection.factory(irf.page("customer.Dashboard"),
    ["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "VisualizationCodeResource",
        "PageHelper", "Utils", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "irfNavigator",
        function ($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage, VisualizationCodeResource,
            PageHelper, Utils, PagesDefinition, Queries, CustomerBankBranch, BundleManager, irfNavigator) {


            // var htmlSection = {
            //     dashboard: `<irf-pv-dashboard ><irf-pv-dashboard>`
            // }
            return {
                "type": "schema-form",
                "title": "",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    var self = this;
                    model.queryData={
                        loanId: model.customerId.loanCentre.loanId,
                        customerId:model.customerId.customerId
                    }
                    self.form = [{

                        "type": "section",
                        "html": `<irf-pv-dashboard visualization-data="model.queryData"><irf-pv-dashboard>` 
                        // "html": htmlSection.dashboard

                    }];
                },

                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                }
            };
        }]);
