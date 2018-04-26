irf.pageCollection.factory(irf.page("audit.AuditScoreDetails"), ["$log", "$filter", "PageHelper", "$q", "Audit", "formHelper", "$state", "$stateParams", "irfNavigator", "SessionStore",
    function($log, $filter, PageHelper, $q, Audit, formHelper, $state, $stateParams, irfNavigator, SessionStore) {
        return {
            "type": "schema-form",
            "title": "AUDIT_SCORE_DETAILS",
            initialize: function(model, form, formCtrl) {
                var self = this;
                var master = Audit.offline.getAuditMaster();
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                $stateParams.pageData = $stateParams.pageData || {};
                if (typeof($stateParams.pageData.readonly) == 'undefined') {
                    $stateParams.pageData.readonly = true;
                }

                HubScoresHtml = '\
<table class="table table-condensed">\
  <tr>\
    <th>{{"MODULE_SUBMODULE"|translate}}</th>\
    <th>{{"SCORE"|translate}}</th>\
    <th>{{"WEIGHTED_SCORE"|translate}}</th>\
  </tr>\
  <tr ng-repeat-start="ds in detail_score">\
    <td><strong>{{ds.module_name}}</strong></td>\
    <td><strong>{{ds.module_score}}</strong></td>\
    <td>&nbsp;</td>\
  </tr>\
  <tr ng-repeat-end ng-repeat="sms in ds.sub_module_score">\
    <td>&nbsp;&nbsp;<i class="fa fa-caret-right">&nbsp;</i>&nbsp;&nbsp; {{sms.sub_module_name}}</td>\
    <td>{{sms.awarded_score}}</td>\
    <td>{{sms.weighted_score}} </td>\
  </tr>\
</table>';

                detailScoresHtml = '\
<table class="table table-condensed">\
  <tr>\
    <th>{{"MODULE_SUBMODULE"|translate}}</th>\
    <th>{{"SCORE"|translate}}</th>\
    <th>{{"MAXSCORE"|translate}}</th>\
    <th>{{"WEIGHTED_SCORE"|translate}}</th>\
  </tr>\
  <tr ng-repeat-start="ds in detail_score">\
    <td><strong>{{ds.module_name}}</strong></td>\
    <td><strong>{{ds.module_score}}</strong></td>\
    <td>&nbsp;</td>\
    <td>&nbsp;</td>\
  </tr>\
  <tr ng-repeat-end ng-repeat="sms in ds.sub_module_score">\
    <td>&nbsp;&nbsp;<i class="fa fa-caret-right">&nbsp;</i>&nbsp;&nbsp; {{sms.sub_module_name}}</td>\
    <td>{{sms.awarded_score}}</td>\
    <td>{{sms.max_score}}</td>\
    <td>{{sms.weighted_score}} </td>\
  </tr>\
</table>';



                var init = function(response) {
                    model.auditScoresheet = response;
                    model.auditScoresheet.rating_name = Audit.utils.getRatingByScore(master, Math.round(parseFloat(model.auditScoresheet.audit_score)));
                    model.auditScoresheet.final_rating = Audit.utils.getRatingByScore(master, Math.round(parseFloat(model.auditScoresheet.final_score)));
                    model.auditScoresheet.final_rating_name = model.auditScoresheet.final_score + "     " + model.auditScoresheet.final_rating;
                    var nodeForms = [];
                    for (i in model.auditScoresheet.node_scores) {
                        var nodeSheet = model.auditScoresheet.node_scores[i];
                        nodeSheet.rating_name = Audit.utils.getRatingByScore(master, Math.round(parseFloat(nodeSheet.audit_score)));
                        var nodeForm = {
                            "type": "box",
                            "colClass": "col-sm-12",
                            "condition": "model.siteCode == 'kinara'",
                            "title": nodeSheet.node_type == 1 ? "Hub Scoresheet" : "Spoke Scoresheet",
                            "readonly": true,
                            "items": [{
                                "type": "section",
                                "htmlClass": "row",
                                "items": [{
                                    "type": "section",
                                    "htmlClass": "col-sm-6",
                                    "items": [{
                                        "key": "auditScoresheet.node_scores[" + i + "].node_id",
                                        "title": nodeSheet.node_type == 1 ? "BRANCH_NAME" : "CENTRE_NAME"
                                    }]
                                }, {
                                    "type": "section",
                                    "htmlClass": "col-sm-6",
                                    "items": [{
                                        "key": "auditScoresheet.node_scores[" + i + "].audit_score",
                                        "title": nodeSheet.node_type == 1 ? "Hub Score" : "Spoke Score",
                                    }, {
                                        "key": "auditScoresheet.node_scores[" + i + "].rating_name",
                                        "title": "Rating"
                                    }]
                                }]
                            }, {
                                "type": "section",
                                "html": '<hr><div ng-init="detail_score = model.auditScoresheet.node_scores[' + i + '].detail_score">' + HubScoresHtml + '</div>'
                            }]
                        };
                        nodeForms.push(nodeForm);
                    }
                    self.form = [{
                        "type": "box",
                        "condition": "model.siteCode == 'kinara'",
                        "title": "Hub Rating Board",
                        "items": [{
                            key: "auditScoresheet.hub_score",
                            title: "Hub Rating",
                            type: "string",
                            "readonly": true
                        }, {
                            key: "auditScoresheet.spoke_score",
                            title: "Spoke Rating",
                            type: "string",
                            "readonly": true
                        }, {
                            key: "auditScoresheet.final_rating_name",
                            title: "Final Hub Rating",
                            type: "string",
                            "readonly": true
                        }]
                    }, {
                        "type": "box",
                        "colClass": "col-sm-12",
                        "condition": "model.siteCode == 'KGFS'",
                        "title": "AUDIT_SCORESHEET",
                        "readonly": true,
                        "items": [{
                            "type": "section",
                            "htmlClass": "row",
                            "items": [{
                                "type": "section",
                                "htmlClass": "col-sm-6",
                                "items": [{
                                    "key": "auditScoresheet.audit_id",
                                    "title": "AUDIT_ID"
                                }, {
                                    "key": "auditScoresheet.branch_name",
                                    "title": "BRANCH_NAME"
                                }, {
                                    "key": "auditScoresheet.start_date",
                                    "title": "START_DATE"
                                }]
                            }, {
                                "type": "section",
                                "htmlClass": "col-sm-6",
                                "items": [{
                                    "key": "auditScoresheet.audit_score",
                                    "title": "AUDIT_SCORE"
                                }, {
                                    "key": "auditScoresheet.rating_name",
                                    "title": "Rating"
                                }]
                            }]
                        }, {
                            "type": "section",
                            "html": '<hr><div ng-init="detail_score = model.auditScoresheet.detail_score">' + detailScoresHtml + '</div>'
                        }]
                    }];
                    self.form.push.apply(self.form, nodeForms);
                };

                model.auditScoresheet = model.auditScoresheet || {};
                if ($stateParams.pageId) {
                    PageHelper.showLoader();
                    Audit.online.getAuditScore({
                        audit_id: $stateParams.pageId
                    }).$promise.then(function(res) {
                        init(res);
                    }, function(errRes) {
                        PageHelper.showErrors(errRes);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                } else {
                    irfNavigator.goBack();
                    return;
                };

            },
            form: [],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "sample_info": {
                        "type": "object",
                        "properties": {}
                    }
                }
            }
        };
    }
]);