irf.pageCollection.factory(irf.page("bank.Survey"), 
    ["$log", "SessionStore", "$state", "formHelper", "$q", "irfProgressMessage", "PageHelper", "SurveyInformation",
    function($log, SessionStore, $state, formHelper, $q, irfProgressMessage, PageHelper, SurveyInformation) {
        return {
            "type": "schema-form",
            "title": "SURVEY",
            initialize: function(model, form, formCtrl) {
                PageHelper.hideLoader();
                model.bank_survey = model.bank_survey || {};
                model.branchName = SessionStore.getBranch();
            },
            form: [{
                "type": "box",
                "title": "GENERAL",
                "items": [
                    "bank_survey.date",
                    "bank_survey.branchName",
                    "bank_survey.fso_name",
                    "bank_survey.village",
                    "bank_survey.block",
                    "bank_survey.population",
                    "bank_survey.region",
                    "bank_survey.house_hold",
                    "bank_survey.area_type",
                    "bank_survey.migration",
                    "bank_survey.poverty_level",
                    "bank_survey.communities"
                ]
            }, {
                "type": "box",
                "title": "DISTANCE(IN_KMS)_FROM",
                "items": [
                    "bank_survey.unit",
                    "bank_survey.market",
                    "bank_survey.main_road",
                    "bank_survey.highway",
                    "bank_survey.block_hq",
                    "bank_survey.bank_one",
                    "bank_survey.post_office",
                    "bank_survey.school",
                    "bank_survey.phc",
                    "bank_survey.qualified_doctor"
                ]
            }, {
                "type": "box",
                "title": "INFRASTRUCTURE/SOCIAL_ORDER",
                "items": [
                    "bank_survey.electricity",
                    "bank_survey.drinking_water",
                    "bank_survey.irrigation_source",
                    "bank_survey.raod_quality",
                    "bank_survey.public_transport",
                    "bank_survey.irrigation_available",
                    "bank_survey.kinara_shop",
                    "bank_survey.tea_shops",
                    "bank_survey.well",
                    "bank_survey.hand_pumps",
                    "bank_survey.business_location",
                    "bank_survey.sarpanch_councillor_name",
                    "bank_survey.workBy_panchayat",
                    "bank_survey.law_order",
                    "bank_survey.social_relation",
                    "bank_survey.political_climate"
                ]
            }, {
                "type": "box",
                "title": "ECONOMIC_ACTIVITIES/LIVELYHOOD_OF_THE_DWELLERS",
                "items": [
                    "bank_survey.activity"
                ]
            }, {
                "type": "box",
                "title": "SOURCE_OF_CREDIT_IN_THE_VILLAGE/SLUM",
                "items": [
                    "bank_survey.source",
                    "bank_survey.institute_name",
                    "bank_survey.difficult_source",
                    "bank_survey.minimum_loan_size",
                    "bank_survey.maximum_loan_size",
                    "bank_survey.interest_rates",
                    "bank_survey.repayment_period",
                    "bank_survey.repayment_frequency",
                    "bank_survey.collateral",
                    "bank_survey.penalty_action",
                    "bank_survey.client_base",
                    "bank_survey.operation_since"
                ]
            }, {
                "type": "box",
                "title": "SOURCE_OF_SAVING,INSURENCE,MONEY_TRANSFER",
                "items": [
                    "bank_survey.bank",
                    "bank_survey.mfi",
                    "bank_survey.money_leader",
                    "bank_survey.whole_saler",
                    "bank_survey.post_office1"
                ]
            }, {
                "type": "box",
                "title": "MICROFINANCE_DEMAND",
                "items": [
                    "bank_survey.microfinance_village",
                    "bank_survey.potential_village",
                    "bank_survey.member_profile",
                    "bank_survey.motivation_required",
                    "bank_survey.comment"
                ]
            }, {
                "type": "box",
                "title": "MAP_INCLUDE",
                "items": [
                    "bank_survey.geo_tag"
                ]
            }, {
                "type": "box",
                "title": "DETAILS_OF_PERSONS_CONTACTED",
                "items": [
                    "bank_survey.name",
                    "bank_survey.contact"
                ]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "save",
                    "title": "Offline Save"
                }, {
                    "type": "submit",
                    "title": "Submit"
                }]
            }],
            schema: function() {
                return $q.resolve(SurveyInformation.getSchema());
            },
            actions: {
                changeStatus: function(modelValue, form, model) {

                    if (model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO') {
                        model.lead.leadStatus = "Reject";
                    } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this week') {
                        model.lead.leadStatus = "Screening";
                    } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this month' || model.lead.productRequiredBy == 'Next 2 -3 months' || model.lead.productRequiredBy == 'Next 4-6 months') {
                        model.lead.leadStatus = "FollowUp";
                    } else {
                        model.lead.leadStatus = "Incomplete";
                    }
                },
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.lead.leadName) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('lead-save', 'Applicant Name is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },

                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    model.lead.productCategory = "Asset";
                    model.lead.productSubCategory = "Loan";
                    $log.warn(model);
                    var sortFn = function(unordered) {
                        var out = {};
                        Object.keys(unordered).sort().forEach(function(key) {
                            out[key] = unordered[key];
                        });
                        return out;
                    };
                    var reqData = _.cloneDeep(model);
                    var centres = formHelper.enum('centre').data;
                    for (var i = 0; i < centres.length; i++) {
                        if ((centres[i].code) == reqData.lead.centreId) {
                            reqData.lead.centreName = centres[i].name;
                        }
                    }
                    if (reqData.lead.id) {

                        if (reqData.lead.leadStatus == "FollowUp" && model.lead.currentStage == "Inprocess") {
                            LeadHelper.followData(reqData).then(function(resp) {
                                $state.go('Page.LeadDashboard', null);
                            });
                        } else {
                            LeadHelper.proceedData(reqData).then(function(resp) {
                                $state.go('Page.LeadDashboard', null);
                            }, function(err) {
                                Utils.removeNulls(resp.lead, true);
                                model.lead = resp.lead;
                            });
                        }
                    } else {
                        LeadHelper.saveData(reqData).then(function(res) {
                            LeadHelper.proceedData(res).then(function(resp) {
                                $state.go('Page.LeadDashboard', null);
                            }, function(err) {
                                Utils.removeNulls(resp.lead, true);
                                model.lead = resp.lead;
                            });
                        });
                    }
                }
            }

        };
    }
]);