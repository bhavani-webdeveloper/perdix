irf.models.factory('Audit', ["$resource", "$log", "SessionStore", "$httpParamSerializer", "BASE_URL",
    "irfStorageService", "OfflineManager", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $log, SessionStore, $httpParamSerializer, BASE_URL,
        irfStorageService, OfflineManager, searchResource, Upload, $q, PageHelper) {

        var endpoint = irf.AUDIT_API_URL;
        var masterJson = {};
        var ret = {};

        ret.utils = {
            auditStatusHtml: function(auditInfo, withText) {
                var audit_flag_html = '';
                if (auditInfo._sync === false) {
                    audit_flag_html = '<i class="fa fa-warning text-yellow">&nbsp;</i>' + (withText ? 'Non sync ' : '');
                } else if (auditInfo._dirty) {
                    audit_flag_html = '<i class="fa fa-pencil text-blue">&nbsp;</i>' + (withText ? 'Dirty ' : '');
                } else if (auditInfo._online && auditInfo._offline) {
                    audit_flag_html = '<i class="fa fa-check text-green">&nbsp;</i>' + (withText ? 'In Sync ' : '');
                } else if (auditInfo._offline) {
                    audit_flag_html = '<i class="fa fa-recycle text-darkgray">&nbsp;</i>' + (withText ? 'Trash ' : '');
                } else {
                    audit_flag_html = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
                }
                return audit_flag_html;
            },
            downloadSampleSet: function(auditId, sampleSetId) {
                Utils.downloadFile(endpoint + "/downloadSampleSet");
            },
            getRatingByScore: function(master, score) {
                $log.info(master)
                $log.info("master")
                var rating;
                _.forOwn(master.summary_rating, function(v, k) {
                    if (master.summary_rating[k].from <= score && score <= master.summary_rating[k].to) {
                        rating = master.summary_rating[k].name;
                    }
                });
                return rating;
            },
            processDisplayRecords: function(onlineAudits, audit_type) {
                var deferred = $q.defer();
                var displayAudits = {
                    headers: {
                        'x-total-count': 0
                    },
                    body: []
                };
                ret.offline.getAllAuditInfo().then(function(offlineAudits) {
                    if (onlineAudits) {
                        for (i in onlineAudits) {
                            var onlineAuditInfo = _.cloneDeep(onlineAudits[i]);
                            var offlineAuditInfo = offlineAudits[onlineAuditInfo.audit_id];
                            if (offlineAuditInfo) {
                                if (onlineAuditInfo.last_edited_on == offlineAuditInfo.last_edited_on) {
                                    offlineAuditInfo._sync = true;
                                } else {
                                    offlineAuditInfo._sync = false;
                                }
                                offlineAuditInfo.$picked = true;
                                onlineAuditInfo = offlineAuditInfo;
                            }
                            onlineAuditInfo._online = true;
                            displayAudits.body.push(onlineAuditInfo);
                            displayAudits.headers['x-total-count']++;
                        }
                    }
                    angular.forEach(offlineAudits, function(v, k) {
                        if (!v.$picked && (_.isNil(audit_type) || audit_type == v.audit_type)) {
                            displayAudits.body.push(v);
                            displayAudits.headers['x-total-count']++;
                        }
                    });
                    deferred.resolve(displayAudits);
                }, function() {
                    if (onlineAudits) {
                        for (i in onlineAudits) {
                            onlineAudits[i]._online = true;
                        }
                        displayAudits.body = onlineAudits;
                        displayAudits.headers['x-total-count'] = onlineAudits.length;
                        deferred.resolve(displayAudits);
                    } else {
                        deferred.reject();
                    }
                });
                return deferred.promise;
            }
        };

        // ret.online = $resource(endpoint, null, {
        //     getAuditMaster: {
        //         method: 'GET',
        //         url: endpoint + '/getAuditMaster'
        //     },
        //     getAuditList: searchResource({
        //         method: 'GET',
        //         url: endpoint + '/findAuditInfo'
        //     }),
        //     getAuditInfo: {
        //         method: 'GET',
        //         url: endpoint + '/getAuditInfo'
        //     },
        //     updateAuditInfo: {
        //         method: 'POST',
        //         url: endpoint + '/updateAuditInfo'
        //     },
        //     getAuditFull: {
        //         method: 'GET',
        //         url: endpoint + '/getAuditData'
        //     },
        //     updateAuditFull: {
        //         method: 'POST',
        //         url: endpoint + '/updateAuditData'
        //     },
        //     getSampleSetList: {
        //         method: 'GET',
        //         url: endpoint + '/getSampleSets',
        //         isArray: true
        //     },
        //     findAuditScores: searchResource({
        //         method: 'GET',
        //         url: endpoint + '/findAuditScores'
        //     }),
        //     findIssues: searchResource({
        //         method: 'GET',
        //         url: endpoint + '/findIssues'
        //     }),
        //     getIssueDetails: {
        //         method: 'GET',
        //         url: endpoint + '/getIssue'
        //     },
        //     updateIssueDetails: {
        //         method: 'POST',
        //         url: endpoint + '/updateIssue'
        //     },
        //     getAvailableAuditorList: searchResource({
        //         method: 'GET',
        //         url: endpoint + '/findAvailableAuditors'
        //     }),
        //     getSnapAuditMaster: {
        //         method: 'GET',
        //         url: endpoint + '/getSnapAuditMaster'
        //     },
        //     createSnapAudit: {
        //         method: 'POST',
        //         url: endpoint + '/createSnapAudit'
        //     },
        //     updateSnapAudit: {
        //         method: 'POST',
        //         url: endpoint + '/updateSnapAudit'
        //     },
        //     publishSnapAudit: {
        //         method: 'POST',
        //         url: endpoint + '/publishSnapAudit'
        //     },
        //     getSnapAuditData: {
        //         method: 'GET',
        //         url: endpoint + '/getSnapAudit'
        //     },
        //     getSnapAuditMaster: {
        //         method: 'GET',
        //         url: endpoint + '/getSnapAuditMaster'
        //     },
        //     getAuditScoreSheet: {
        //         method: 'GET',
        //         url: endpoint + '/getAuditScoreSheet'
        //     },
        //     findStage: {
        //         method: 'GET',
        //         url: endpoint + '/findStage'
        //     },
        //     getStageActivities: {
        //         method: 'GET',
        //         url: endpoint + '/getStageActivities'
        //     },
        //     updateStage: {
        //         method: 'POST',
        //         url: endpoint + '/updateStage'
        //     },
        //     getAuditScore: {
        //         method: 'GET',
        //         url: endpoint + '/getAuditScore'
        //     },
        //     updateStageActivities: {
        //         method: 'POST',
        //         url: endpoint + '/updateStageActivities'
        //     },
        //     findDumpSamples: searchResource({
        //         method: 'GET',
        //         url: endpoint + '/findDumpSamples'
        //     }),
        // });
        // url: 'process/schemas/audit/getAuditMaster.json'

        ret.online = $resource(endpoint, null, {
            getAuditMaster: {
                method: 'GET',
                url: 'process/schemas/audit/getAuditMaster.json'
            },
            getAuditList: searchResource({
                method: 'GET',
                url: 'process/schemas/audit/getAuditList.JSON'
            }),
            getAuditInfo: {
                method: 'GET',
                url: endpoint + '/getAuditInfo'
            },
            updateAuditInfo: {
                method: 'POST',
                url: endpoint + '/updateAuditInfo'
            },
            getAuditFull: {
                method: 'GET',
                url: 'process/schemas/audit/getAuditFull.json'
            },
            updateAuditFull: {
                method: 'POST',
                url: endpoint + '/updateAuditData'
            },
            getSampleSetList: {
                method: 'GET',
                url: endpoint + '/getSampleSets',
                isArray: true
            },
            findAuditScores: searchResource({
                method: 'GET',
                url: 'process/schemas/audit/findAuditScores.json'
            }),
            getAuditScore: {
                method: 'GET',
                url: 'process/schemas/audit/getAuditScore.json'
            },
            // findIssues: searchResource({
            //     method: 'GET',
            //     url: endpoint + '/findIssues'
            // }),
            findIssues: searchResource({
                method: 'GET',
                url: 'process/schemas/audit/findIssues.json'
            }),
            getIssueDetails: {
                method: 'GET',
                url: 'process/schemas/audit/getIssueDetails.json'
            },
            updateIssueDetails: {
                method: 'POST',
                url: endpoint + '/updateIssue'
            },
            getAvailableAuditorList: searchResource({
                method: 'GET',
                url: endpoint + '/findAvailableAuditors'
            }),
            getSnapAuditMaster: {
                method: 'GET',
                url: endpoint + '/getSnapAuditMaster'
            },
            createSnapAudit: {
                method: 'POST',
                url: endpoint + '/createSnapAudit'
            },
            updateSnapAudit: {
                method: 'POST',
                url: endpoint + '/updateSnapAudit'
            },
            publishSnapAudit: {
                method: 'POST',
                url: endpoint + '/publishSnapAudit'
            },
            getSnapAuditData: {
                method: 'GET',
                url: endpoint + '/getSnapAudit'
            },
            findSample: searchResource({
                method: 'GET',
                url: endpoint + '/findSample'
            }),
            getAuditScoreSheet: {
                method: 'GET',
                url: endpoint + '/getAuditScoreSheet'
            },
            findStage: {
                method: 'GET',
                url: endpoint + '/findStage'
            },
            updateStaging: {
                method: 'POST',
                url: endpoint + '/updateStaging'
            },
            getStageActivities: {
                method: 'GET',
                url: endpoint + '/getStageActivities'
            },
            updateStageActivities: {
                method: 'POST',
                url: endpoint + '/updateStageActivities'
            },
            findDumpSamples: searchResource({
                method: 'GET',
                url: 'process/schemas/audit/findDumpSamples.json'
            }),
            // getDumpSample: {
            //     method: 'POST',
            //     url: endpoint + '/getDumpSample'
            // },
        });

        ret.offline = {
            setAuditInfo: function(auditId, audit_info) {
                if (!auditId || !audit_info) return $q.reject();
                audit_info._offline = true;
                return OfflineManager.insert("audit_data.audit_info", auditId, audit_info);
            },
            setAuditDirty: function(auditId, dirty) {
                ret.offline.getAuditInfo(auditId).then(function(audit_info) {
                    if (audit_info) {
                        audit_info._dirty = dirty;
                        ret.offline.setAuditInfo(auditId, audit_info);
                    }
                });
            },
            getAuditInfo: function(auditId) {
                return OfflineManager.select("audit_data.audit_info", auditId);
            },
            getAllAuditInfo: function() {
                return OfflineManager.selectAll("audit_data.audit_info");
            },
            setGeneralObservation: function(auditId, general_observations, isClean) {
                if (!auditId) return $q.reject();
                isClean || ret.offline.setAuditDirty(auditId, true);
                return OfflineManager.insert("audit_data.general_observations", auditId, general_observations);
            },
            getGeneralObservation: function(auditId) {
                return OfflineManager.select("audit_data.general_observations", auditId); // change others as same
            },
            setPortfolioStats: function(auditId, portfolio_stats, isClean) {
                if (!auditId) return $q.reject();
                isClean || ret.offline.setAuditDirty(auditId, true);
                return OfflineManager.insert("audit_data.portfolio_stats", auditId, portfolio_stats);
            },
            getPortfolioStats: function(auditId) {
                return OfflineManager.select("audit_data.portfolio_stats", auditId);
            },
            setJewelAppraisal: function(auditId, jewel_appraisal, isClean) {
                if (!auditId) return $q.reject();
                isClean || ret.offline.setAuditDirty(auditId, true);
                return OfflineManager.insert("audit_data.jewel_appraisal", auditId, jewel_appraisal);
            },
            getJewelAppraisal: function(auditId) {
                return OfflineManager.select("audit_data.jewel_appraisal", auditId);
            },
            setFixedAssets: function(auditId, fixed_assets, isClean) {
                if (!auditId) return $q.reject();
                isClean || ret.offline.setAuditDirty(auditId, true);
                return OfflineManager.insert("audit_data.fixed_assets", auditId, fixed_assets);
            },
            getFixedAssets: function(auditId) {
                return OfflineManager.select("audit_data.fixed_assets", auditId);
            },
            setFieldVerification: function(auditId, field_verification, isClean) {
                if (!auditId) return $q.reject();
                isClean || ret.offline.setAuditDirty(auditId, true);
                return OfflineManager.insert("audit_data.field_verification", auditId, field_verification);
            },
            getFieldVerification: function(auditId) {
                return OfflineManager.select("audit_data.field_verification", auditId);
            },
            setProcessCompliance: function(auditId, process_compliance, isClean) {
                if (!auditId) return $q.reject();
                isClean || ret.offline.setAuditDirty(auditId, true);
                return OfflineManager.insert("audit_data.process_compliance", auditId, process_compliance);
            },
            getProcessCompliance: function(auditId) {
                return OfflineManager.select("audit_data.process_compliance", auditId);
            },
            setAuditScoreSheet: function(auditId, audit_scoresheet_data, isClean) {
                if (!auditId) return $q.reject();
                isClean || ret.offline.setAuditDirty(auditId, true);
                return OfflineManager.insert("audit_data.audit_scoresheet_data", auditId, audit_scoresheet_data);
            },
            getAuditScoreSheet: function(auditId) {
                return OfflineManager.select("audit_data.audit_scoresheet_data", auditId);
            },
            setAuditSummary: function(auditId, audit_summary, isClean) {
                if (!auditId) return $q.reject();
                isClean || ret.offline.setAuditDirty(auditId, true);
                return OfflineManager.insert("audit_data.audit_summary", auditId, audit_summary);
            },
            getAuditSummary: function(auditId) {
                return OfflineManager.select("audit_data.audit_summary", auditId);
            },
            setAuditScoreBoard: function(auditId, summary_scoreboard, isClean) {
                if (!auditId) return $q.reject();
                isClean || ret.offline.setAuditDirty(auditId, true);
                return OfflineManager.insert("audit_data.summary_scoreboard", auditId, summary_scoreboard);
            },
            getAuditScoreBoard: function(auditId) {
                return OfflineManager.select("audit_data.summary_scoreboard", auditId);
            },
            setAudit: function(auditId, auditData) {
                if (!auditId) return $q.reject();
                var deferred = $q.defer();
                var allSetPromises = [];
                auditData.audit_info && allSetPromises.push(ret.offline.setAuditInfo(auditId, auditData.audit_info));
                auditData.general_observations && allSetPromises.push(ret.offline.setGeneralObservation(auditId, auditData.general_observations, true));
                auditData.portfolio_stats && allSetPromises.push(ret.offline.setPortfolioStats(auditId, auditData.portfolio_stats, true));
                auditData.jewel_appraisal && allSetPromises.push(ret.offline.setJewelAppraisal(auditId, auditData.jewel_appraisal, true));
                auditData.fixed_assets && allSetPromises.push(ret.offline.setFixedAssets(auditId, auditData.fixed_assets, true));
                auditData.field_verification && allSetPromises.push(ret.offline.setFieldVerification(auditId, auditData.field_verification, true));
                auditData.process_compliance && allSetPromises.push(ret.offline.setProcessCompliance(auditId, auditData.process_compliance, true));
                auditData.audit_scoresheet_data && allSetPromises.push(ret.offline.setAuditScoreSheet(auditId, auditData.audit_scoresheet_data, true));
                auditData.audit_summary && allSetPromises.push(ret.offline.setAuditSummary(auditId, auditData.audit_summary, true));
                auditData.summary_scoreboard && allSetPromises.push(ret.offline.setAuditScoreBoard(auditId, auditData.summary_scoreboard, true));
                $q.all(allSetPromises).finally(deferred.resolve);
                return deferred.promise;
            },
            getAudit: function(auditId) {
                var deferred = $q.defer();
                var auditData = {};
                ret.offline.getAuditInfo(auditId).then(function(response) {
                    auditData.audit_info = response;
                    var allDataPromises = [];
                    allDataPromises.push(ret.offline.getGeneralObservation(auditId).then(function(resp) {
                        auditData.general_observations = resp;
                    }));
                    allDataPromises.push(ret.offline.getPortfolioStats(auditId).then(function(resp) {
                        auditData.portfolio_stats = resp;
                    }));
                    allDataPromises.push(ret.offline.getJewelAppraisal(auditId).then(function(resp) {
                        auditData.jewel_appraisal = resp;
                    }));
                    allDataPromises.push(ret.offline.getFixedAssets(auditId).then(function(resp) {
                        auditData.fixed_assets = resp;
                    }));
                    allDataPromises.push(ret.offline.getFieldVerification(auditId).then(function(resp) {
                        auditData.field_verification = resp;
                    }));
                    allDataPromises.push(ret.offline.getAuditScoreSheet(auditId).then(function(resp) {
                        auditData.audit_scoresheet_data = resp;
                    }));
                    allDataPromises.push(ret.offline.getAuditSummary(auditId).then(function(resp) {
                        auditData.audit_summary = resp;
                    }));
                    allDataPromises.push(ret.offline.getAuditScoreBoard(auditId).then(function(resp) {
                        auditData.summary_scoreboard = resp;
                    }));
                    $q.all(allDataPromises).finally(function() {
                        deferred.resolve(auditData);
                    });
                }, deferred.reject);
                ret.offline.getProcessCompliance(auditId).then(function(resp) {
                    auditData.process_compliance = resp;
                }, deferred.reject);
                return deferred.promise;
            },
            deleteAudit: function(auditId) {
                if (!auditId) return $q.reject();
                var deferred = $q.defer();
                var allSetPromises = [];
                allSetPromises.push(OfflineManager.delete("audit_data.audit_info", auditId));
                allSetPromises.push(OfflineManager.delete("audit_data.general_observations", auditId));
                allSetPromises.push(OfflineManager.delete("audit_data.portfolio_stats", auditId));
                allSetPromises.push(OfflineManager.delete("audit_data.jewel_appraisal", auditId));
                allSetPromises.push(OfflineManager.delete("audit_data.fixed_assets", auditId));
                allSetPromises.push(OfflineManager.delete("audit_data.field_verification", auditId));
                allSetPromises.push(OfflineManager.delete("audit_data.process_compliance", auditId));
                allSetPromises.push(OfflineManager.delete("audit_data.audit_scoresheet_data", auditId));
                allSetPromises.push(OfflineManager.delete("audit_data.audit_summary", auditId));
                allSetPromises.push(OfflineManager.delete("audit_data.summary_scoreboard", auditId));
                $q.all(allSetPromises).finally(deferred.resolve);
                return deferred.promise;
            },
            setAuditMaster: function(auditMaster) {
                if (!auditMaster) return;
                irfStorageService.setMaster("auditMaster", auditMaster);
            },
            getAuditMaster: function() {
                var auditMaster = irfStorageService.getMaster("auditMaster");
                $log.info(auditMaster);
                $log.info("auditMaster");
                if (!auditMaster) PageHelper.setError({
                    message: "Audit master unavailable. Refresh cache & retry"
                });
                return auditMaster;
            }
        };
        return ret;
    }
]);
irf.pageCollection.run(["irfStorageService", "OfflineManager", "SessionStore", "Audit", "PageHelper", "$q", "$log",
    function(irfStorageService, OfflineManager, SessionStore, Audit, PageHelper, $q, $log) {
        if (!irf.appConfig.AMS_ENABLED) return;

        irfStorageService.onMasterUpdate(function() {
            var deferred = $q.defer();
            Audit.online.getAuditMaster().$promise.then(function(response) {
                $log.info(response);
                $log.info("response");
                var auditTypeObj = {};
                var audit_type_enum = {
                    data: []
                };
                for (i in response.audit_type) {
                    var rec = response.audit_type[i];
                    // if (rec.status == 1) {
                    audit_type_enum.data.push({
                        code: rec.audit_type,
                        name: rec.audit_type,
                        value: rec.audit_type_id
                    });
                    // }
                    auditTypeObj[rec.audit_type_id] = rec;
                }
                response.audit_type = auditTypeObj;
                irfStorageService.setMaster("audit_type", audit_type_enum);

                var process = {};
                for (i in response.process) {
                    process[response.process[i].process_id] = response.process[i];
                }
                response.process = process;

                var subprocess = {};
                for (i in response.subprocess) {
                    subprocess[response.subprocess[i].sub_process_id] = response.subprocess[i];
                }
                response.subprocess = subprocess;

                var modules = {};
                for (i in response.modules) {
                    modules[response.modules[i].module_id] = response.modules[i];
                }
                response.modules = modules;

                var sub_modules = {};
                for (i in response.sub_modules) {
                    sub_modules[response.sub_modules[i].sub_module_id] = response.sub_modules[i];
                }
                response.sub_modules = sub_modules;

                var process_tabs = {};
                for (i in response.process_tabs) {
                    process_tabs[response.process_tabs[i].scoring_process_type_id] = response.process_tabs[i];
                }
                response.process_tabs = process_tabs;

                var scoring_sample_sets = {};
                for (i in response.scoring_sample_sets) {
                    scoring_sample_sets[response.scoring_sample_sets[i].scoring_sample_type_id] = response.scoring_sample_sets[i];
                }
                response.scoring_sample_sets = scoring_sample_sets;

                var typeofissues = {};
                for (i in response.typeofissues) {
                    typeofissues[response.typeofissues[i].type_of_issue_id] = response.typeofissues[i];
                }
                response.typeofissues = typeofissues;
                var typeofissues = {};

                var branches = irfStorageService.getMaster("branch").data;
                var branch_name = {};
                for (i in branches) {
                    branch_name[branches[i].code] = {
                        "node_code": branches[i].value,
                        "node_id": branches[i].code,
                        "id": branches[i].id,
                        "parent_code": branches[i].parentCode,
                        "status": 1
                    };
                }
                response.branch_name = branch_name;

                var asssts = {};
                var astois = {};
                _.forOwn(response.autosampling_typeofissue_sets, function(v, k) {
                    for (i in v) {
                        asssts[v[i].scoring_sample_type_id] = asssts[v[i].scoring_sample_type_id] || [];
                        asssts[v[i].scoring_sample_type_id].push(v[i]);
                        astois[v[i].type_of_issue_id] = v[i];
                    }
                });
                response.autosampling_scoring_sample_type_sets = asssts;
                response.autosampling_typeofissue_sets = astois;

                var non_autosampling_typeofissue_sets = {};
                for (i in response.non_autosampling_typeofissue_sets) {
                    non_autosampling_typeofissue_sets[response.non_autosampling_typeofissue_sets[i].type_of_issue_id] = response.non_autosampling_typeofissue_sets[i];
                }
                response.non_autosampling_typeofissue_sets = non_autosampling_typeofissue_sets;

                var non_mapped_typeofissue_sets = {};
                for (i in response.non_mapped_typeofissue_sets) {
                    non_mapped_typeofissue_sets[response.non_mapped_typeofissue_sets[i].type_of_issue_id] = response.non_mapped_typeofissue_sets[i];
                }
                response.non_mapped_typeofissue_sets = non_mapped_typeofissue_sets;

                var summary_observation_status = {};
                for (i in response.summary_observation_status) {
                    summary_observation_status[response.summary_observation_status[i].id] = response.summary_observation_status[i];
                }
                response.summary_observation_status = summary_observation_status;

                var summary_rating = {};
                for (i in response.summary_rating) {
                    summary_rating[response.summary_rating[i].id] = response.summary_rating[i];
                }
                response.summary_rating = summary_rating;

                var summary_weightage = {};
                for (i in response.summary_weightage) {
                    summary_weightage[response.summary_weightage[i].id] = response.summary_weightage[i];
                }
                response.summary_weightage = summary_weightage;

                var observation_classification = {};
                for (i in response.observation_classification) {
                    observation_classification[response.observation_classification[i].id] = response.observation_classification[i];
                }
                response.observation_classification = observation_classification;

                var field_verification = {};
                for (i in response.field_verification) {
                    field_verification[response.field_verification[i].loan_type_id] = response.field_verification[i];
                }
                response.field_verification = field_verification;

                var book_entity = {};
                for (i in response.book_entity) {
                    book_entity[response.book_entity[i].entity_id] = response.book_entity[i];
                }
                response.book_entity = book_entity;

                var particulars = {};
                for (i in response.general_observation.particulars) {
                    particulars[response.general_observation.particulars[i].particular_id] = response.general_observation.particulars[i];
                }
                response.general_observation.particulars = particulars;

                var particular_options = {};
                for (i in response.general_observation.particular_options) {
                    var gopo = response.general_observation.particular_options[i];
                    particular_options[gopo.particular_id] = particular_options[gopo.particular_id] || [];
                    particular_options[gopo.particular_id].push(gopo);
                }
                response.general_observation.particular_options = particular_options;

                var fixed_assets = {};
                for (i in response.fixed_assets) {
                    fixed_assets[response.fixed_assets[i].asset_type_id] = response.fixed_assets[i];
                }
                response.fixed_assets = fixed_assets;

                var components = {};
                for (i in response.components) {
                    components[response.components[i].component_id] = response.components[i];
                }
                response.components = components;

                PageHelper.showProgress("page-init", "Audit master loaded successfully", 2000);
                Audit.offline.setAuditMaster(response);
                deferred.resolve();
            }, function(error) {
                PageHelper.showProgress("page-init", "Failed to load audit master", 5000);
                deferred.reject();
            });
            return deferred.promise;
        });
    }
]);