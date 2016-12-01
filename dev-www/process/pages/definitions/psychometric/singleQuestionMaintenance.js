irf.pageCollection.factory(irf.page("psychometric.singleQuestionMaintenance"),
["$log", "SessionStore", "PageHelper", "formHelper", "Utils", "Psychometric", "$q", "elementsUtils",
	function($log, SessionStore, PageHelper, formHelper, Utils, Psychometric, $q, elementsUtils) {

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
							key: "psy.id",
							type: "lov",
							lovonly: true,
							fieldType: "number",
							inputMap: {
								"difficulty": {
									key: "psy.difficulty",
									type: "radios"
								},
								"type": {
									key: "psy.type",
									type: "radios"
								},
								"pictorial": {
									key: "psy.pictorial",
									type: "checkbox"
								},
								"active": {
									key: "psy.active",
									type: "checkbox"
								}
							},
							outputMap: {
								"id": "roles.role_id",
								"name": "roles.role_name"
							},
							searchHelper: formHelper,
							search: function(inputModel, form, model) {
								if (!inputModel.active) delete inputModel.active;
								return Psychometric.findSingleQuestion(inputModel).$promise;
							},
							getListDisplayItem: function(item, index) {
								return [
									item.category.categoryName,
									item.questionLang[0].questionText
								];
							}
						}, {
							key: "psy.category.categoryName",
							type: "lov",
							lovonly: true,
							required: true,
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
									item.id + ": " + item.categoryName,
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
						}, {
							key: "psy.pictorial",
							onChange: function(modelValue, form, model) {
								model.psy.questionLang = [];
								model.psy.options = [];
							}
						}, {
							key: "psy.questionLang",
							type: "array",
							startEmpty: true,
							items: [{
								type: "section",
								htmlClass: "row",
								items: [{
									type: "section",
									htmlClass: "col-sm-4",
									items: [{
										key: "psy.questionLang[].langCode",
										type: "select",
										notitle: true,
										titleMap: languagesTitleMap
									}]
								}, {
									type: "section",
									htmlClass: "col-sm-8",
									items: [{
										key: "psy.questionLang[].questionText",
										condition: "!model.psy.pictorial",
										type: "textarea",
										notitle: true
									}, {
										key: "psy.questionLang[].questionText",
										condition: "model.psy.pictorial",
										type: "file",
										fileType: "image/*",
										imageCompressionRatio: 100,
										notitle: true,
										customHandle: function(file, progress, modelValue, form, model) {
											var deferred = $q.defer();
											elementsUtils.fileToBase64(file).then(function(base64File) {
												deferred.resolve("<img src=\"" + base64File[0] + "\">");
											});
											return deferred.promise;
										}
									}]
								}]
							}]
						}, {
							key: "psy.options",
							type: "array",
							startEmpty: true,
							items: [{
								key: "psy.options[].score",
							}, {
								key: "psy.options[].optionlang",
								type: "array",
								startEmpty: true,
								items: [{
									type: "section",
									htmlClass: "row",
									items: [{
										type: "section",
										htmlClass: "col-sm-4",
										items: [{
											key: "psy.options[].optionlang[].langCode",
											type: "select",
											titleMap: languagesTitleMap,
											notitle: true
										}]
									}, {
										type: "section",
										htmlClass: "col-sm-8",
										items: [{
											key: "psy.options[].optionlang[].optionText",
											condition: "!model.psy.pictorial",
											type: "textarea",
											notitle: true
										}, {
											key: "psy.options[].optionlang[].optionText",
											condition: "model.psy.pictorial",
											type: "file",
											fileType: "image/*",
											notitle: true,
											customHandle: function(file, progress, modelValue, form, model) {
												var deferred = $q.defer();
												elementsUtils.fileToBase64(file).then(function(base64File) {
													deferred.resolve("<img src=\"" + base64File[0] + "\">");
												});
												return deferred.promise;
											}
										}]
									}]
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
						"required": ["category", "difficulty", "questionLang", "options"],
						"type": "object",
						"title": "psy",
						"properties": {
							"id": {
								"type": "number",
								"title": "Question ID"
							},
							"category": {
								"type": "object",
								"required": ["id"],
								"properties": {
									"id": {
										"type": "number"
									},
									"categoryName": {
										"type": "string",
										"title": "Category"
									}
								}
							},
							"difficulty": {
								"type": "string",
								"title": "Difficulty",
								"enum": ["LOW", "MEDIUM", "HIGH"]
							},
							"type": {
								"type": "string",
								"title": "Type",
								"enum": ["SINGLE", "PAIRED", "LINKED"]
							},
							"pictorial": {
								"type": "boolean",
								"title": "Pictorial"
							},
							"active": {
								"type": "boolean",
								"title": "Active"
							},
							"questionLang": {
								"type": "array",
								"title": "Question Text",
								"items": {
									"type": "object",
									"required": ["langCode", "questionText"],
									"properties": {
										"langCode": {
											"type": [null, "string"],
											"title": "Language Code"
										},
										"questionText": {
											"type": "string",
											"title": "Question Text"
										}
									}
								}
							},
							"options": {
								"type": "array",
								"title": "Options",
								"items": {
									"type": "object",
									"required": ["score", "optionlang"],
									"properties": {
										"score": {
											"type": "number",
											"title": "Score"
										},
										"optionlang": {
											"type": "array",
											"title": "Option Text",
											"items": {
												"type": "object",
												"required": ["langCode", "optionText"],
												"properties": {
													"langCode": {
														"type": [null, "string"],
														"title": "Language Code"
													},
													"optionText": {
														"type": "string",
														"title": "Option Text"
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
				submit: function(model, formCtrl, formName) {
					$log.info(model);
					Utils.confirm('Are you sure?').then(function() {
						PageHelper.clearErrors();
						PageHelper.showLoader();
						Psychometric.postSingleQuestion(model.psy).$promise.then(function(resp) {
							model.psy = resp;
							PageHelper.showProgress("psychometric", "Question created/updated", 3000);
						}, function(err) {
							PageHelper.showErrors(err);
						}).finally(function() {
							PageHelper.hideLoader();
						});
					});
				}
			}
		};
	}
]);