irf.pageCollection.factory(irf.page("bank.Survey"),
 ["$log", "SessionStore","irfNavigator", "$state","$stateParams","Utils", "formHelper", "$q", "irfProgressMessage", "PageHelper", "SurveyInformation", "$filter",
    function($log, SessionStore,irfNavigator, $state,$stateParams,Utils, formHelper, $q, irfProgressMessage, PageHelper, SurveyInformation, $filter) { 
        var fixData = function(model) {
            $log.info("data fixed");
            if (model.bank_survey.udf6) model.bank_survey.udf6 = Number(model.bank_survey.udf6);
            if (model.bank_survey.udf7) model.bank_survey.udf7 = Number(model.bank_survey.udf7);
            if (model.bank_survey.udf8) model.bank_survey.udf8 = Number(model.bank_survey.udf8);
            if (model.bank_survey.udf9) model.bank_survey.udf9 = Number(model.bank_survey.udf9);
            if (model.bank_survey.udf14) model.bank_survey.udf14 = Number(model.bank_survey.udf14);

            if (model.bank_survey.udf15) model.bank_survey.udf15 = Number(model.bank_survey.udf15);
            if (model.bank_survey.udf16) model.bank_survey.udf16 = Number(model.bank_survey.udf16);
            if (model.bank_survey.udf17) model.bank_survey.udf17 = Number(model.bank_survey.udf17);
            if (model.bank_survey.udf18) model.bank_survey.udf18 = Number(model.bank_survey.udf18);

            return model;
        }

        return {
            "type": "schema-form",
            "title": "SURVEY",
            initialize: function(model, form, formCtrl) {
                model.bank_survey = model.bank_survey || {};

                if (!(model && model.bank_survey && model.bank_survey.id && model.$$STORAGE_KEY$$)) {
                    PageHelper.showLoader();
                    PageHelper.showProgress("page-init", "Loading...");
                    model.bank_survey.branchId = model.bank_survey.branchId||SessionStore.getCurrentBranch().branchId;
                    model.bank_survey.surveyDate = model.bank_survey.surveyDate||Utils.getCurrentDate();
                    model.bank_survey.surveyOfficerName= model.bank_survey.surveyOfficerName||SessionStore.getUsername();
                    var surveyId = $stateParams.pageId;
                    if (!surveyId) {
                        PageHelper.hideLoader();
                    } else {
                        SurveyInformation.get({
                                id: surveyId
                            },
                            function(res) {
                                _.assign(model.bank_survey, res);
                                $log.info(model.bank_survey);
                                model = Utils.removeNulls(model, true);
                                model=fixData(model);
                                PageHelper.hideLoader();
                            }
                        );
                    }
                    $log.info("Capture survey page  is initiated ");
                }
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return [
                    item.bank_survey.date
                ]
            },
            form: [{
                "type": "box",
                "title": "GENERAL",
                "items": [
                    "bank_survey.surveyDate",
                    "bank_survey.surveyOfficerName",
                    "bank_survey.branchId",
                    "bank_survey.surveyVillage",
                    "bank_survey.surveyBlock",
                    "bank_survey.population",
                    "bank_survey.region",
                    "bank_survey.household",
                    "bank_survey.areaType",
                    "bank_survey.migration",
                    "bank_survey.udf20",
                    "bank_survey.povertyLevel",
                    //"bank_survey.communities",
                    {
                        type: "fieldset",
                        title: "COMMUNITIES",
                        items: [
                            "bank_survey.udf15",
                            "bank_survey.udf16",
                            "bank_survey.udf17",
                            "bank_survey.udf18",
                        ]
                    },
                ]
            }, /*{
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
            },*/
            {
                type: "box",
                title: "DISTANCE(IN_KMS)_FROM",
                items: [{
                    key: "bank_survey.surveyFacilityDistance",
                    type: "array",
                    items: [
                        "bank_survey.surveyFacilityDistance[].facilityName",
                        "bank_survey.surveyFacilityDistance[].facilityDistance",
                    ]
                }]
            },{
                "type": "box",
                "title": "INFRASTRUCTURE/SOCIAL_ORDER",
                "items": [
                    "bank_survey.electricity",
                    "bank_survey.drinkingWater",
                    "bank_survey.irrigationSource",
                    "bank_survey.roadQuality",
                    "bank_survey.publicTransport",
                    "bank_survey.irrigationAvailable",
                    "bank_survey.udf19",
                    "bank_survey.noOfKiranaShop",
                    "bank_survey.noOfTeaShops",
                    "bank_survey.noOfWell",
                    "bank_survey.noOfHandPumps",
                    "bank_survey.businessAtmosphere",
                    "bank_survey.councillorName",
                    "bank_survey.workDone",
                    "bank_survey.lawAndOrder",
                    "bank_survey.socialRelation",
                    "bank_survey.politicalClimate"
                ]
            }, {
                "type": "box",
                "title": "ECONOMIC_ACTIVITIES/LIVELYHOOD_OF_THE_DWELLERS",
                "items": [
                    {
                        key: "bank_survey.surveyEconomicDetailsList",
                        type: "array",
                        "titleExpr" : "(model.bank_survey.surveyEconomicDetailsList[arrayIndex].economicActivity ?  model.bank_survey.surveyEconomicDetailsList[arrayIndex].economicActivity : '" + $filter('translate')('ACTIVITY') + "')",
                        items: [
                            "bank_survey.surveyEconomicDetailsList[].economicActivity",
                        ]
                    }
                ]
            }, {
                "type": "box",
                "title": "SOURCE_OF_CREDIT_IN_THE_VILLAGE/SLUM",
                "items": [
                    {
                        key: "bank_survey.surveyCreditSourceList",
                        type: "array",
                        "titleExpr" : "(model.bank_survey.surveyCreditSourceList[arrayIndex].source ?  model.bank_survey.surveyCreditSourceList[arrayIndex].source : '') + (model.bank_survey.surveyCreditSourceList[arrayIndex].instituteName ?  ' - ' + model.bank_survey.surveyCreditSourceList[arrayIndex].instituteName : '')",
                        items: [
                            "bank_survey.surveyCreditSourceList[].source",
                            "bank_survey.surveyCreditSourceList[].instituteName",
                            "bank_survey.surveyCreditSourceList[].sourcingDifficulty",
                            "bank_survey.surveyCreditSourceList[].minimumLoanSize",
                            "bank_survey.surveyCreditSourceList[].maximumLoanSize",
                            "bank_survey.surveyCreditSourceList[].interestRate",
                            "bank_survey.surveyCreditSourceList[].repaymentPeriod",
                            "bank_survey.surveyCreditSourceList[].repaymentFrequency",
                            "bank_survey.surveyCreditSourceList[].collateral",
                            "bank_survey.surveyCreditSourceList[].pernaltyAction",
                            "bank_survey.surveyCreditSourceList[].clientBase",
                            "bank_survey.surveyCreditSourceList[].operationSince",
                        ]
                    }
                ]
            }, {
                "type": "box",
                "title": "SOURCE_OF_SAVING,INSURENCE,MONEY_TRANSFER",
                "items": [
                    "bank_survey.bankAvailable",
                    "bank_survey.mfiAvailable",
                    "bank_survey.moneylenderAvailable",
                    "bank_survey.wholeSalerAvailable",
                    "bank_survey.postOfficeAvailable"
                ]
            }, {
                "type": "box",
                "title": "MICROFINANCE_DEMAND",
                "items": [
                    "bank_survey.microfinanceRequired",
                    "bank_survey.noOfPotentialMember",
                    "bank_survey.memberProfile",
                    "bank_survey.motivationRequired",
                    "bank_survey.udf2"
                ]
            }, {
                "type": "box",
                "title": "MAP_INCLUDE",
                "items": [
                    "bank_survey.latitude"  
                ]
            },
            {
                type: "box",
                title: "DETAILS_OF_PERSONS_CONTACTED",
                items: [{
                    key: "bank_survey.surveyContacts",
                    type: "array",
                    items: [
                        "bank_survey.surveyContacts[].contactName",
                        "bank_survey.surveyContacts[].mobileNo",
                    ]
                }]
            },
            {
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
               
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.bank_survey.date) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('save', 'date is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },

                submit: function(model, form, formName) {
                    $log.info("Inside submit()");
                    PageHelper.showLoader();
                    PageHelper.showProgress("Survey Save", "Working...");
                    if (model.bank_survey.id) {
                            SurveyInformation.update(model.bank_survey)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("Survey Save", "Survey Updated with id" +" "+ res.id, 3000);
                                $log.info(res);
                                model.bank_survey = res;
                                model=fixData(model);
                                irfNavigator.goBack();
                                
                            }, function(httpRes) {
                                PageHelper.showProgress("Survey Save", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            }).finally(function() {
                                PageHelper.hideLoader();
                            })
                    } else {  
                        SurveyInformation.save(model.bank_survey)
                            .$promise
                            .then(function(res) {
                                PageHelper.showProgress("Survey Save", "Survey Updated with id"+" "+ res.id, 3000);
                                $log.info(res);
                                model.bank_survey = res;
                                model=fixData(model);
                                irfNavigator.goBack();
                               
                            }, function(httpRes) {
                                PageHelper.showProgress("Survey Save", "Oops. Some error occured.", 3000);
                                PageHelper.showErrors(httpRes);
                            }).finally(function() {
                                PageHelper.hideLoader();
                            })
                    }
                }
            }

        };
    }
]);