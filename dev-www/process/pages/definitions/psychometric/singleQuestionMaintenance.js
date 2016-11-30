irf.pageCollection.factory(irf.page("psychometric.singleQuestionMaintenance"),
["$log", "SessionStore", "PageHelper", "formHelper", "Utils", "Psychometric", "$q",
    function($log, SessionStore, PageHelper, formHelper, Utils, Psychometric, $q) {

        var branch = SessionStore.getBranch();
        var languagesTitleMap;

        return {
            "type": "schema-form",
            "title": "SINGLE_QUESTION_MAINTAENANCE",
            initialize: function(model, form, formCtrl) {
                model.psy = model.psy || {};
                model = Utils.removeNulls(model, true);
                $log.info("question maintenance page got initiated");
            },
            form: [],
			formFn: function() {
				var deferred = $q.defer();
				Psychometric.getLanguages().$promise.then(function(languages) {
					languagesTitleMap = [];
					for (var l in languages.body) {
						languagesTitleMap.push({
							name: languages.body[l].language,
							value: languages.body[l].langCode
						});
					}
					$log.info(languages);
					deferred.resolve([{
						"type": "box",
						"title": "QUESTION_MAINTENANCE",
						"items": [{
							key: "psy.questionId",
							type: "lov",
							lovonly: true,
							fieldType: "number",
							/*outputMap: {
							    "id": "roles.role_id",
							    "name": "roles.role_name"
							},
							searchHelper: formHelper,
							search: function(inputModel, form, model) {
							    return RolesPages.allRoles().$promise;
							},
							getListDisplayItem: function(item, index) {
							    return [
							        item.id,
							        item.name
							    ];
							}*/
						}, {
							key: "psy.category.categoryName",
							type: "lov",
							lovonly: true,
							outputMap: {
								"id": "psy.category.id",
								"categoryName": "psy.category.categoryName",
								"cutoffScore": "psy.category.cutoffScore"
							},
							searchHelper: formHelper,
							search: function(inputModel, form, model) {
								return Psychometric.findCategories({active:true}).$promise;
							},
							getListDisplayItem: function(item, index) {
								return [
									item.categoryName,
									"Cutoff Score: " + item.cutoffScore
								];
							}
						}, {
							key: "psy.difficulty",
							type: "radios",
							titleMap: {
								"LOW": "Low",
								"MEDIUM": "Medium",
								"HIGH": "High"
							}
						}, "psy.pictorial", {
							key: "psy.questionLang",
							type: "array",
							items: [{
								type: "section",
								htmlClass: "row",
								items: [{
									type: "section",
									htmlClass: "col-sm-4",
									items: [{
										key: "psy.questionLang[].langcode",
									    type: "select",
										notitle: true,
										titleMap: languagesTitleMap
									}]
								}, {
									type: "section",
									htmlClass: "col-sm-8",
									items: [{
										key: "psy.questionLang[].questionText",
										type: "textarea",
										notitle: true
							        }]
								}]
							}]
						}, {
							key: "psy.options",
							type: "array",
							items: [{
							    key: "psy.options[].score",
							}, {
							    key: "psy.options[].optionlang",
								type: "array",
								items: [{
								    key: "psy.options[].optionlang[].langcode",
								    type: "select",
								    titleMap: languagesTitleMap
								}, {
									key: "psy.options[].optionlang[].optiontext",
									type: "textarea"
								}]
							}]
						}]
					}, {
						type: "actionbox",
						condition: "!model.psy.questionId",
						items: [{
						    type: "submit",
						    title: "Create Question"
						}]
					}, {
						type: "actionbox",
						condition: "model.psy.questionId",
						items: [{
						    type: "submit",
						    title: "Update Question"
						}, {
						    type: "button",
							icon: "fa fa-refresh",
							style: "btn-default",
							title: "Reset",
				            onClick: function(model) {
				                model.psy = {};
				            }
				        }]
					}]);
				}, deferred.reject);
				return deferred.promise;
			},
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "psy": {
                        "type": "object",
                        "title": "psy",
                        "properties": {
                            "questionId": {
                                "type": "number",
                                "title": "QUESTION_ID"
                            },
                            "category": {
                                "type": "object",
                                "required": [],
                                "properties": {
                                    "categoryName": {
                                        "type": "string",
                                        "title": "CATEGORY"
                                    }
                                }
                            },
                            "difficulty": {
                                "type": "string",
                                "title": "DIFFICULTY"
                            },
                            "pictorial": {
                                "type": "boolean",
                                "title": "PICTORIAL"
                            },
                            "questionLang": {
                                "type": "array",
                                "title": "QUESTION_LANGUAGE",
                                "items": {
                                    "type": "object",
                                    "required": [],
                                    "properties": {
                                        "langcode": {
                                            "type": "string",
                                            "title": "LANG_CODE"
                                        },
                                        "questionText": {
                                            "type": "string",
                                            "title": "QUESTION_TEXT"
                                        }
                                    }
                                }
                            },
                            "options": {
                                "type": "array",
                                "title": "OPTIONS",
                                "items": {
                                    "type": "object",
                                    "required": [],
                                    "properties": {
                                        "score": {
                                            "type": "number",
                                            "title": "SCORE"
                                        },
                                        "optionlang": {
                                            "type": "array",
                                            "title": "OPTIONS_LANGUAGE",
                                            "items": {
                                                "type": "object",
                                                "required": [],
                                                "properties": {
                                                    "langcode": {
                                                        "type": "string",
                                                        "title": "LANG_CODE"
                                                    },
                                                    "optiontext": {
                                                        "type": "number",
                                                        "title": "OPTION_TEXT"
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            actions: {
                /*submit: function(model, form, formName) {
                    Utils.confirm('Are you sure?').then(function() {
                        PageHelper.clearErrors();
                        PageHelper.showLoader();
                        RolesPages.updateRole(model.roles).$promise.then(function(resp) {
                            model.roles = resp;
                            PageHelper.showProgress("roles-pages", "Role created/updated", 3000);
                        }, function(err) {
                            PageHelper.showErrors(err);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        });
                    });
                }*/
            }
        };
    }
]);