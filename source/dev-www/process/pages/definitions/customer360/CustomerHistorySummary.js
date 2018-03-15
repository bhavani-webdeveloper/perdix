irf.pageCollection.factory(irf.page("customer360.CustomerHistorySummary"), ["$log", "irfNavigator", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "translateFilter", "$stateParams",
    function($log, irfNavigator, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, translateFilter, $stateParams) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "CUSTOMER_HISTORY_SUMMARY",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                var schema = null;
                PageHelper.showLoader();
                var customerId = $stateParams.pageId;
                Enrollment.getWithHistory({
                    id: customerId
                }, function(resp) {
                    model.customerHistory = resp.customerSnapshot;
                    model.customerHistory.reverse();
                    PageHelper.hideLoader();
                });
                 model.myFunc = function(data1, customerHistory, index) {
                    var snapdiffTo = data1.id;
                    var snapdiffFrom = customerHistory[index + 1].id;
                    irfNavigator.go({
                        state: "Page.Engine",
                        pageName: "customer360.CustomerHistory",
                        pageData: {
                            snapdiffFrom: snapdiffFrom,
                            snapdiffTo: snapdiffTo
                        }
                    });
                };
            },
            form: [{
                "type": "box",
                //"title": "CUSTOMER_HISTORY_SUMMARY",
                "colClass": "col-sm-12",
                "items": [{
                    type: "section",
                    htmlClass: "col-sm-12",
                    html: '<div class="table-responsive">' +
                        '<table class="table table-bordered">' +
                        '<thead class="thead-default">' +
                        '<tr>' +
                        '<th class="col-sm-3" style="text-align: center">LastEditedBY</th>' +
                        '<th class="col-sm-3" style="text-align: center">LastEditedByUserName</th>' +
                        '<th class="col-sm-3" style="text-align: center">LastEditAt</th>' +
                        '<th class="col-sm-3" style="text-align: center">ShowChanges</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        '<tr ng-repeat="data1 in model.customerHistory">' +
                        '<td class="col-sm-3" style="text-align: center">{{data1.lastModifiedBy}}</td>' +
                        '<td class="col-sm-3" style="text-align: center">{{data1.lastEditByUserName}}</td>' +
                        '<td class="col-sm-3" style="text-align: center">{{data1.lastModifiedDate}}</td>' +
                        '<td class="col-sm-3" style="text-align: center"><button ng-hide="$index == model.customerHistory.length-1" class="btn btn-primary" ng-click="model.myFunc(data1,model.customerHistory,$index)">ShowChanges</button></td>' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>'
                }]
            }],
            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {},
            }
        };
    }
]);