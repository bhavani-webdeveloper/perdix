irf.pageCollection.factory(irf.page("audit.AuditDumps"), ["$log", "PageHelper", "$q", "Utils", "Audit", "formHelper", "$state", "$stateParams", "irfNavigator", "SessionStore",
    function($log, PageHelper, $q, Utils, Audit, formHelper, $state, $stateParams, irfNavigator, SessionStore) {
        return {
            "type": "schema-form",
            "title": "AUDIT_DUMPS_VIEW",
            initialize: function(model, form, formCtrl) {
                PageHelper.showLoader();
                model.sampleset = model.sampleset || [];
                model.masters = Audit.offline.getAuditMaster() || {};
                var self = this;
                if (!$stateParams.pageId) {
                    irfNavigator.goBack();
                    return;
                }
                self.form = [];
                Audit.online.getSampleSetList({
                    audit_id: $stateParams.pageId
                }).$promise.then(function(res) {
                    PageHelper.hideLoader();
                    model.sampleset = res;
                    var dumpSampleSetDetails = [];
                    for (var i = 0; i < model.sampleset.length; i++) {
                        var sstid = model.sampleset[i].scoring_sample_type_id;
                        if (model.sampleset[i].data_available=="yes") {
                            dumpSampleSetDetails.push({
                                "key": "sampleset[" + i + "].scoring_sample_type_id",
                                "html": "<i class='fa fa-download'></i> {{model.masters.scoring_sample_sets[" + sstid + "].scoring_sample_type}}",
                                "type": "anchor",
                                "notitle": true,
                                "onClick": function(model, form, schemaForm, event) {
                                    Utils.downloadFile(model.sampleset[event.arrayIndex].download_link);
                                }
                            });
                        } else {
                            dumpSampleSetDetails.push({
                                "type": "help",
                                "helpExpr": "model.masters.scoring_sample_sets[" + sstid + "].scoring_sample_type"
                            });
                        }
                    };
                    self.form = [{
                        "type": "box",
                        "title": "SAMPLE_SETS",
                        "items": dumpSampleSetDetails
                    }]
                }, function(errRes) {
                    PageHelper.showErrors(errRes);
                }).finally(function() {
                    PageHelper.hideLoader();
                });
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