define({
    pageUID: "pahal.loans.individual.screening.detail.Scoring",
    pageType: "Engine",
    dependencies: ["$log", "$q", "Enrollment", 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
        'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "Scoring", "AuthTokenHelper", "BundleManager", "filterFilter", "irfCurrencyFilter"
    ],
    $pageFn: function($log, $q, Enrollment, SchemaResource, PageHelper, formHelper, elementsUtils,
        irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, Scoring, AuthTokenHelper, BundleManager, filterFilter, irfCurrencyFilter) {
       var branch = SessionStore.getBranch();
        var prepareData = function(res, model) {
            if (res[0].data[0]['Existing Customer'] == 'No') {
                model.existingCustomerStr = "New Customer";
            } else {
                model.existingCustomerStr = "Existing Customer";
            }

            model.enterpriseDetails = res[0];
            model.secName = res[0].data[0]['Sector'];
            model.subSecName = res[0].data[0]['Sub-Sector'];
            model.scoreDetails = [res[1], res[2], res[3], res[4]];
            model.totalScores = res[6];
            model.deviationDetails = res[7];



            var managementScore = model.scoreDetails[0];
            if (_.isArray(managementScore.sections)) {
                var count = managementScore.sections.length;
                var spacePct = 75 / count;

                managementScore.values = [];
                for (var i = 0; i < managementScore.sections.length; i++) managementScore.values[i] = i;
                managementScore.colorPct = spacePct / 5;
                managementScore.valuePct = spacePct * 4 / 5;
            }

            for (var i=0;i< model.deviationDetails.data.length; i++){
                var d = model.deviationDetails.data[i];
                if (d.Mitigant && d.Mitigant.length!=0){
                    if (d.Mitigant && d.Mitigant!=null){
                        d.ListOfMitigants = d.Mitigant.split("|");
                    }

                    if (d.ChosenMitigant && d.ChosenMitigant!=null){
                        d.ChosenMitigants = d.ChosenMitigant.split("|")
                    }

                }
            }

        };

        var prepareForms = function(model) {
           var form = [];
           form.push({
                "type": "section",
                "html": `
                    <div class="col-sm-6">
                    <i class="fa fa-check-circle text-green" style="font-size:x-large">&nbsp;</i><em class="text-darkgray">{{model.existingCustomerStr}}</em><br>&nbsp;
                    </div>
                    <div class="col-sm-3">{{'BRANCH'|translate}}: <strong>{{model.business.kgfsName}}</strong></div>
                    <div class="col-sm-3">{{'CENTRE'|translate}}: <strong>{{model.business.centreName}}</strong></div>
                    `
            });

            form.push({
                type: "box",
                colClass: "col-sm-12",
                title: "SCORES",
                items: [{
                        type: "section",
                        htmlClass: "row",
                        html: '<div class="col-sm-3"><div class="stat-container" ><dd class="stat-key"> Total Score</dd><dt class="stat-value"> {{ model.ScoreDetails[0].OverallWeightedScore }}</dt></div></div><div class="col-sm-3"><div class="stat-container" ><dd class="stat-key"> Status</dd><dt class="stat-value" ng-class="{\'text-a-green\': model.ScoreDetails[0].OverallPassStatus==\'PASS\', \'text-a-red\': model.ScoreDetails[0].OverallPassStatus==\'FAIL\'}"> {{ model.ScoreDetails[0].OverallPassStatus }}</dt></div></div><div class="clearfix"></div><hr>'
                    }, {
                        type: "section",
                        htmlClass: "row",
                        items: [{
                                type: "section",
                                htmlClass: "col-sm-12",
                                title: model.scoreDetails[0].title,
                                html: '<div ng-init="_score=model.scoreDetails[0]">' +
                                    '<h3 ng-if="model.currentStage!=\'ScreeningReview\'">{{_score.title}} ({{model.totalScores.data[0][_score.title]}})</h3>' +
                                    '<table class="table">' +
                                    '<colgroup>' +
                                    '<col width="25%">' +
                                    '<col width="{{_score.colorPct}}%" ng-repeat-start="i in _score.values">' +
                                    '<col width="{{_score.valuePct}}%" ng-repeat-end>' +
                                    '</colgroup>' +
                                    '<tbody>' +
                                    '<tr>' +
                                    '<th>Parameter Name</th>' +
                                    '<th colspan="2" ng-repeat="j in _score.values">{{_score.sections[j].relation_detail}}</th>' +
                                    '</tr>' +
                                    '<tr ng-repeat="data in _score.sections[0].data" ng-init="parameterIndex=$index">' +
                                    '<td >{{data.Parameter}}</td>' +
                                    '<td ng-repeat-start="k in _score.values"> <span class="square-color-box" style="background:{{_score.sections[k].data[parameterIndex].color_hexadecimal}}"> </span></td>' +
                                    '<td ng-repeat-end>{{_score.sections[k].data[parameterIndex].Applicant}}</td></tr>' +
                                    '</tbody>' +
                                    '</table>' +
                                    '</div>'
                            }
                        ]
                    },
                    {
                        type: "section",
                        htmlClass: "row",
                        items: [
                            {
                                type: "section",
                                htmlClass: "col-sm-6",
                                title: model.scoreDetails[1].title,
                                html: '<h3>{{ model.scoreDetails[1].title }} ({{ model.totalScores.data[0][model.scoreDetails[1].title] }})</h3><table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup><tbody><tr><th>Parameter</th><th></th><th>Actual Value</th></tr><tr ng-repeat="data in model.scoreDetails[1].data"><td>{{ data.Parameter }}</td><td> <span class="square-color-box" style="background: {{ data.color_hexadecimal }}"> </span></td><td>{{ data["Actual Value"] }}</td></tr></tbody></table>'
                            },
                            {
                                type: "section",
                                htmlClass: "col-sm-6",
                                title: model.scoreDetails[2].title,
                                html: '<h3>{{ model.scoreDetails[2].title }} ({{ model.totalScores.data[0][model.scoreDetails[2].title] }})</h3><table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup><tbody><tr><th>Parameter</th><th></th><th>Actual Value</th></tr><tr ng-repeat="data in model.scoreDetails[2].data"><td>{{ data.Parameter }}</td><td> <span class="square-color-box" style="background: {{ data.color_hexadecimal }}"> </span></td><td>{{ data["Actual Value"] }}</td></tr></tbody></table>'
                            }
                        ]
                    },
                    {
                        type: "section",
                        htmlClass: "row",
                        items: [
                            {
                                type: "section",
                                htmlClass: "col-sm-6",
                                title: model.scoreDetails[3].title,
                                html: '<h3>{{ model.scoreDetails[3].title }} ({{ model.totalScores.data[0][model.scoreDetails[3].title] }})</h3><table class="table"><colgroup><col width="50%"><col width="10%"><col width="40%"></colgroup><tbody><tr><th>Parameter</th><th></th><th>Actual Value</th></tr><tr ng-repeat="data in model.scoreDetails[3].data"><td>{{ data.Parameter }}</td><td> <span class="square-color-box" style="background: {{ data.color_hexadecimal }}"> </span></td><td>{{ data["Actual Value"] }}</td></tr></tbody></table>'
                            }
                        ]
                    }
                ]
            });

             form.push({
                type: "box",
                colClass: "col-sm-12 table-box",
                title: "DEVIATION_AND_MITIGATIONS",
                items: [
                    {
                        type: "section",
                        colClass: "col-sm-12",
                        html: '<table class="table"><colgroup><col width="20%"><col width="5%"><col width="20%"><col width="30%"><col width="30"></colgroup><thead><tr><th>Parameter Name</th><th></th><th>Actual Value</th><th>Mitigant</th><th>Chosen Mitigant</th></tr></thead><tbody><tr ng-repeat="rowData in model.deviationDetails.data"><td>{{ rowData["Parameter"] }}</td><td> <span class="square-color-box" style="background: {{ rowData.color_hexadecimal }}"> </span></td><td>{{ rowData["Deviation"] }}</td><td><ol><li ng-repeat="m in rowData.ListOfMitigants"> {{ m }}</li></ol></td><td><ol><li ng-repeat="m in rowData.ChosenMitigants"> {{ m }}</li></ol></td></tr></tbody></table>'
                    }
                ]
            });
            return form;
        }

        var prepareDataDeferred;
        var prepareDataPromise;
        return {
            "type": "schema-form",
            "title": "",
            "subTitle": "",
            initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                prepareDataDeferred = $q.defer();
                prepareDataPromise = prepareDataDeferred.promise;
                model.bundleModel = bundleModel;
                model.currentStage = bundleModel.currentStage;
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                model.ScoreDetails = [];
                model.customer = {};

                /*Business Summary*/
                model.customer_detail = bundleModel.customer_detail;
                model.loanAccount = bundleModel.loanAccount;
                var $this = this;
                var deferred = $q.defer();

                scoreName = "ConsolidatedScore";

                if (bundlePageObj) {
                    model._bundlePageObj = _.cloneDeep(bundlePageObj);
                }

                if (_.hasIn(model, 'cbModel')) {
                    Scoring.get({
                        auth_token: AuthTokenHelper.getAuthData().access_token,
                        LoanId: model.cbModel.loanId,
                        ScoreName: scoreName
                    }).$promise.then(function(response) {
                        model.ScoreDetails = response.ScoreDetails;
                    }).finally(function() {
                        var onSuccessPromise = Scoring.financialSummary({
                            loan_id: model.cbModel.loanId,
                            score_name: scoreName
                        }).$promise;
                        onSuccessPromise.then(function(res) {
                            /* var financialData = [model.ScoreDetails,res];*/
                            BundleManager.pushEvent('financialSummary', model._bundlePageObj, res);
                            prepareData(res, model);
                            model.$prepared = true;
                            prepareDataDeferred.resolve();
                        });

                        $q.all([onSuccessPromise]).finally(function() {
                            deferred.resolve();
                        });
                    });
                } else {
                    deferred.resolve();
                }
                return deferred.promise;
            },
            eventListeners: {},
            form: [{
                type: 'section',
                html: '<br><br><br><center>Loading...</center>'
            }],
            initializeUI: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                PageHelper.showLoader();
                var $this = this;
                if (model.$prepared) {
                    $this.form = prepareForms(model);
                    PageHelper.hideLoader();
                } else {
                    prepareDataPromise.then(function() {
                        $this.form = prepareForms(model);
                        formCtrl.redraw();
                        PageHelper.hideLoader();
                    });
                }
                return $q.resolve();
            },
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            eventListeners: {
                 "business-customer": function(bundleModel, model, params) {
                    model.business = params;
                      if (model.business.centreId) {
                        model.business.centreName = filterFilter(formHelper.enum('centre').data, {
                            value: model.business.centreId
                        })[0].name;
                    }
                }
            },
            actions: {
            }
        };
    }
});
