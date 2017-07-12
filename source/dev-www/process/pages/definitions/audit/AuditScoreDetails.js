irf.pageCollection.factory(irf.page("audit.AuditScoreDetails"), ["$log", "PageHelper", "$q", "Audit", "formHelper", "$state", "$stateParams", "irfNavigator", "SessionStore",
    function($log, PageHelper, $q, Audit, formHelper, $state, $stateParams, irfNavigator, SessionStore) {
        return {
            "type": "schema-form",
            "title": "AUDIT_SCORE_DETAILS",
            initialize: function(model, form, formCtrl) {
                var self = this;
                var master = Audit.offline.getAuditMaster();
                if (!$stateParams.pageData || !$stateParams.pageData.auditScoresheet) {
                    irfNavigator.goBack();
                    return;
                }
                model.auditScoresheet = $stateParams.pageData.auditScoresheet;
                model.master = Audit.offline.getAuditMaster();             
                var rate = model.auditScoresheet.audit_score;
                var rate_flow = parseFloat(rate);
                var ratingNumber = Math.round(rate_flow);
                model.auditScoresheet.name = Audit.utils.getRatingByScore(master, ratingNumber);
                detailScoresHtml = '\
                <table class="table table-condensed">\
                  <tr>\
                    <th>{{"MODULE_SUBMODULE"|translate}}</th>\
                    <th>{{"SCORE"|translate}}</th>\
                    <th>{{"WEIGHTED_SCORE"|translate}}</th>\
                  </tr>\
                  <tr ng-repeat-start="ds in model.auditScoresheet.detail_score">\
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
                self.form = [{
                    "type": "box",
                    "colClass": "col-sm-12",
                    "title": "SCORESHEET",
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
                                "key": "auditScoresheet.name",
                                "title": "Rating"
                            }]
                        }]
                    }, {
                        "type": "section",
                        "html": '<hr>'
                    }, {
                        "type": "section",
                        "html": detailScoresHtml
                    }]
                }];
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