irf.pageCollection.factory(irf.page("psychometric.QuestionMaintenance"),
["$log", "SessionStore", "PageHelper", "formHelper", "Utils", "Psychometric", "$q", "elementsUtils",
	function($log, SessionStore, PageHelper, formHelper, Utils, Psychometric, $q, elementsUtils) {

		var branch = SessionStore.getBranch();
		var languagesTitleMap;

		return {
			"type": "schema-form",
			"title": "Question Maintenance",
			initialize: function(model, form, formCtrl) {
				model.psy1 = model.psy1 || {};
				model.psy2 = model.psy2 || {};
				model.psy1.type = "SINGLE";
				$log.info("question maintenance page got initiated");
				var $this = this;
				PageHelper.showLoader();
				Psychometric.getLanguages().$promise.then(function(languages) {
					languagesTitleMap = {};
					for (var l in languages.body) {
						languagesTitleMap[languages.body[l].langCode] = languages.body[l].language;
					}
					model.languagesTitleMap = languagesTitleMap;
					$log.info(model.languagesTitleMap);
					$this.form = [{
						"type": "box",
						"title": "Question",
						"items": [{
							key: "psy1.id",
							type: "lov",
							lovonly: true,
							fieldType: "number",
							inputMap: {
								"id": "psy1.id",
								"difficulty": {
									key: "psy1.difficulty",
									type: "radios"
								},
								"type": {
									key: "psy1.type",
									type: "radios"
								},
								"pictorial": {
									key: "psy1.pictorial",
									type: "checkbox"
								},
								"active": {
									key: "psy1.active",
									type: "checkbox"
								}
							},
							searchHelper: formHelper,
							search: function(inputModel, form, model) {
								if (!inputModel.active) delete inputModel.active;
								return Psychometric.findQuestions(inputModel).$promise;
							},
							getListDisplayItem: function(item, index) {
								if (item[2]) {
									item[4] = '<img height="100px"' + item[4].substr(4);
								}
								return [
									item[0] + ': ' + item[1],
									item[3],
									item[4]
								];
							},
							onSelect: function(result, model, context) {
								PageHelper.clearErrors();
								PageHelper.showLoader();
								if (result[1] === 'SINGLE') {
									Psychometric.getSingleQuestion({id:result[0]}, function(resp) {
										model.psy1 = resp;
									}).$promise.finally(function() {
										PageHelper.hideLoader();
									});
								} else if (result[1] === 'PAIRED') {
									Psychometric.getPairedQuestions({id:result[0]}, function(resp) {
										model.psy1 = resp[0];
										model.psy2 = resp[1];
									}).$promise.finally(function() {
										PageHelper.hideLoader();
									});
								} else if (result[1] === 'LINKED') {
									Psychometric.getLinkedQuestion({id:result[0]}, function(resp) {
										model.psy1 = resp[0];
										model.psy2 = resp[1];
									}).$promise.finally(function() {
										PageHelper.hideLoader();
									});
								} else {
									PageHelper.hideLoader();
								}
							}
						}, {
							key: "psy1.category.categoryName",
							type: "lov",
							lovonly: true,
							required: true,
							outputMap: {
								"id": "psy1.category.id",
								"categoryName": "psy1.category.categoryName",
								"cutoffScore": "psy1.category.cutoffScore"
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
							},
							onSelect: function(result, model, context) {
								model.psy1.category = result;
								model.psy2.category = _.clone(result);
							}
						}, {
							key: "psy1.type",
							condition: "!model.psy1.id",
							type: "radios",
							onChange: function(modelValue, form, model) {
								model.psy1.pictorial = false;
								model.psy2.pictorial = false;
								model.psy2.category = _.clone(model.psy1.category);
								model.psy2.type = model.psy1.type;
								model.psy2.difficulty = model.psy1.difficulty;
							}
						}, {
							key: "psy1.type",
							condition: "model.psy1.id",
							type: "radios",
							readonly: true
						}, {
							key: "psy1.difficulty",
							type: "radios",
							titleMap: {
								"LOW": "Low",
								"MEDIUM": "Medium",
								"HIGH": "High"
							},
							onChange: function(modelValue, form, model) {
								model.psy2.difficulty = model.psy1.difficulty;
							}
						}, {
							key: "psy1.pictorial",
							condition: "model.psy1.type === 'SINGLE'",
							onChange: function(modelValue, form, model) {
								model.psy1.questionLangs = [];
								model.psy1.options = [];
							}
						}, {
							key: "psy1.active",
							type: "checkbox",
							onChange: function(modelValue, form, model) {
								model.psy2.active = model.psy1.active;
							}
						}, {
							key: "psy1.questionLangs",
							titleExpr: "model.languagesTitleMap[model.psy1.questionLangs[arrayIndex].langCode]+' question'",
							type: "array",
							items: [{
								type: "section",
								htmlClass: "row",
								items: [{
									type: "section",
									htmlClass: "col-sm-4",
									items: [{
										key: "psy1.questionLangs[].langCode",
										type: "select",
										notitle: true,
										titleMap: languagesTitleMap
									}]
								}, {
									type: "section",
									htmlClass: "col-sm-8",
									items: [{
										key: "psy1.questionLangs[].questionText",
										condition: "!model.psy1.pictorial",
										type: "textarea",
										notitle: true
									}, {
										key: "psy1.questionLangs[].questionText",
										condition: "model.psy1.pictorial",
										type: "file",
										fileType: "image/*",
										imageCompressionRatio: 100,
										notitle: true,
				                        getDataUrl: function(modelValue) {
				                        	var dataUrl = modelValue;
				                        	if (modelValue) {
				                        		dataUrl = modelValue.replace("<img src=\"", "").replace("\">", "");
				                        	}
				                            return dataUrl;
				                        },
										customHandle: function(file, progress, modelValue, form, model) {
											var deferred = $q.defer();
											elementsUtils.fileToBase64(file).then(function(base64File) {
												deferred.resolve("<img src=\"" + base64File + "\">");
											});
											return deferred.promise;
										}
									}]
								}]
							}]
						}, {
							key: "psy1.options",
							titleExpr: "'Option ['+model.psy1.options[arrayIndex].optionKey+']'",
							type: "array",
							items: [{
								key: "psy1.options[].optionKey",
								type: "select"
							}, {
								key: "psy1.options[].optionScore",
								type: "select",
								titleMap: [{
									name: "0.0",
									value: 0.0
								}, {
									name: "0.25",
									value: 0.25
								}, {
									name: "0.5",
									value: 0.5
								}, {
									name: "0.75",
									value: 0.75
								}, {
									name: "1.0",
									value: 1.0
								}]
							}, {
								key: "psy1.options[].optionLangs",
								titleExpr: "model.languagesTitleMap[model.psy1.options[arrayIndexes[0]].optionLangs[arrayIndexes[1]].langCode]+' option'",
								type: "array",
								startEmpty: true,
								items: [{
									type: "section",
									htmlClass: "row",
									items: [{
										type: "section",
										htmlClass: "col-sm-4",
										items: [{
											key: "psy1.options[].optionLangs[].langCode",
											type: "select",
											titleMap: languagesTitleMap,
											notitle: true
										}]
									}, {
										type: "section",
										htmlClass: "col-sm-8",
										items: [{
											key: "psy1.options[].optionLangs[].optionText",
											condition: "!model.psy1.pictorial",
											type: "textarea",
											notitle: true
										}, {
											key: "psy1.options[].optionLangs[].optionText",
											condition: "model.psy1.pictorial",
											type: "file",
											fileType: "image/*",
											notitle: true,
					                        getDataUrl: function(modelValue) {
					                        	var dataUrl = modelValue;
					                        	if (modelValue) {
					                        		dataUrl = modelValue.replace("<img src=\"", "").replace("\">", "");
					                        	}
					                            return dataUrl;
					                        },
											customHandle: function(file, progress, modelValue, form, model) {
												var deferred = $q.defer();
												elementsUtils.fileToBase64(file).then(function(base64File) {
													deferred.resolve("<img src=\"" + base64File + "\">");
												});
												return deferred.promise;
											}
										}]
									}]
								}]
							}]
						}]
					}, {
						"type": "box",
						"titleExpr": "model.psy1.type === 'PAIRED' ? 'Paired Question' : 'Linked Question'",
						"condition": "model.psy1.type && model.psy1.type !== 'SINGLE'",
						"items": [{
							key: "psy2.id",
							type: "number",
							readonly: true
						}, {
							key: "psy2.category.categoryName",
							readonly: true
						}, {
							key: "psy2.type",
							type: "radios",
							readonly: true
						}, {
							key: "psy2.difficulty",
							type: "radios",
							readonly: true
						}, {
							key: "psy2.active",
							type: "checkbox",
							readonly: true
						}, {
							key: "psy2.questionLangs",
							titleExpr: "model.languagesTitleMap[model.psy2.questionLangs[arrayIndex].langCode]+' question'",
							type: "array",
							items: [{
								type: "section",
								htmlClass: "row",
								items: [{
									type: "section",
									htmlClass: "col-sm-4",
									items: [{
										key: "psy2.questionLangs[].langCode",
										type: "select",
										notitle: true,
										titleMap: languagesTitleMap
									}]
								}, {
									type: "section",
									htmlClass: "col-sm-8",
									items: [{
										key: "psy2.questionLangs[].questionText",
										type: "textarea",
										notitle: true
									}]
								}]
							}]
						}, {
							key: "psy2.options",
							titleExpr: "'Option ['+model.psy2.options[arrayIndex].optionKey+']' + (model.psy2.type==='LINKED'?' linked to ['+model.psy2.options[arrayIndex].linkedOptionKey+']':'')",
							type: "array",
							items: [{
								key: "psy2.options[].optionKey",
								type: "select"
							}, {
								key: "psy2.options[].linkedOptionKey",
								type: "select"
							}, {
								key: "psy2.options[].optionScore",
								type: "select",
								titleMap: [{
									name: "0.0",
									value: 0.0
								}, {
									name: "0.25",
									value: 0.25
								}, {
									name: "0.5",
									value: 0.5
								}, {
									name: "0.75",
									value: 0.75
								}, {
									name: "1.0",
									value: 1.0
								}]
							}, {
								key: "psy2.options[].optionLangs",
								titleExpr: "model.languagesTitleMap[model.psy2.options[arrayIndexes[0]].optionLangs[arrayIndexes[1]].langCode]+' option'",
								type: "array",
								startEmpty: true,
								items: [{
									type: "section",
									htmlClass: "row",
									items: [{
										type: "section",
										htmlClass: "col-sm-4",
										items: [{
											key: "psy2.options[].optionLangs[].langCode",
											type: "select",
											titleMap: languagesTitleMap,
											notitle: true
										}]
									}, {
										type: "section",
										htmlClass: "col-sm-8",
										items: [{
											key: "psy2.options[].optionLangs[].optionText",
											type: "textarea",
											notitle: true
										}]
									}]
								}]
							}]
						}]
					}, {
						type: "actionbox",
						condition: "!model.psy1.id",
						items: [{
							type: "submit",
							title: "Create Question"
						}]
					}, {
						type: "actionbox",
						condition: "model.psy1.id",
						items: [{
							type: "submit",
							title: "Update Question"
						}, {
							type: "button",
							icon: "fa fa-refresh",
							style: "btn-default",
							title: "Reset",
							onClick: function(model) {
								model.psy1 = {};
								model.psy2 = {};
							}
						}]
					}];
				}, function(errResp) {
					PageHelper.showProgress("psychometric", "Service Unreachable. Contact Administrator", 3000);
				}).finally(function() {
					PageHelper.hideLoader();
				});
			},
			form: [],
			schema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"psy1": {
						"required": ["category", "type", "difficulty", "questionLangs", "options"],
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
								"title": "Active",
								"default": true
							},
							"questionLangs": {
								"type": "array",
								"title": "Question",
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
								"title": "Option",
								"items": {
									"type": "object",
									"required": ["optionKey", "optionScore", "optionLangs"],
									"properties": {
										"optionKey": {
											"type": "string",
											"title": "Option",
											"enum": ['A','B','C','D','E','F','G','H','I','J']
										},
										"optionScore": {
											"type": "number",
											"title": "Score"
										},
										"optionLangs": {
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
					},
					"psy2": {
						"required": ["category", "type", "difficulty", "questionLangs", "options"],
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
								"title": "Active",
								"default": true
							},
							"questionLangs": {
								"type": "array",
								"title": "Question",
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
									"required": ["optionKey", "optionScore", "optionLangs"],
									"properties": {
										"optionKey": {
											"type": "string",
											"title": "Option",
											"enum": ['A','B','C','D','E','F','G','H','I','J']
										},
										"linkedOptionKey": {
											"type": "string",
											"title": "Linked Option",
											"enum": ['A','B','C','D','E','F','G','H','I','J']
										},
										"optionScore": {
											"type": "number",
											"title": "Score"
										},
										"optionLangs": {
											"type": "array",
											"title": "Text",
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
						if (model.psy1.type==='SINGLE') {
							Psychometric.postSingleQuestion(model.psy1).$promise.then(function(resp) {
								model.psy1 = resp;
								PageHelper.showProgress("psychometric", "Single Question created/updated", 3000);
							}, function(errResp) {
								$log.info(errResp);
								var err = errResp.data;
								err.error = err.errorCode || err.error;
								err.message = err.errorMsg || err.message;
								PageHelper.setError({message: err.error + ": " + err.message});
							}).finally(function() {
								PageHelper.hideLoader();
							});
						} else if (model.psy1.type==='LINKED') {
							Psychometric.postLinkedQuestion([model.psy1, model.psy2]).$promise.then(function(resp) {
								model.psy1 = resp[0];
								model.psy2 = resp[1];
								PageHelper.showProgress("psychometric", "Linked Questions created/updated", 3000);
							}, function(errResp) {
								$log.info(errResp);
								var err = errResp.data;
								PageHelper.setError({message: (err.errorCode || err.error) + ": " + (err.errorMsg || err.message)});
							}).finally(function() {
								PageHelper.hideLoader();
							});
						} else if (model.psy1.type==='PAIRED') {
							Psychometric.postPairedQuestions([model.psy1, model.psy2]).$promise.then(function(resp) {
								model.psy1 = resp[0];
								model.psy2 = resp[1];
								PageHelper.showProgress("psychometric", "Paired Questions created/updated", 3000);
							}, function(errResp) {
								$log.info(errResp);
								var err = errResp.data;
								PageHelper.setError({message: (err.errorCode || err.error) + ": " + (err.errorMsg || err.message)});
							}).finally(function() {
								PageHelper.hideLoader();
							});
						}
					});
				}
			}
		};
	}
]);