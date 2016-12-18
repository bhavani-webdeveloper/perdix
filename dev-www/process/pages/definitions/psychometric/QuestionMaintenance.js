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
						"title": "Question",
						"items": [{
							key: "psy1.id",
							type: "lov",
							lovonly: true,
							fieldType: "number",
							inputMap: {
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
								return [
									item.category.categoryName,
									item.questionLangs[0].questionText
								];
							},
							onSelect: function(result, model, context) {
								PageHelper.clearErrors();
								if (result.type === 'SINGLE') {
									model.psy1 = result;
								} else if (result.type === 'PAIRED') {
									Psychometric.getPairedQuestions({id:result.id}, function(resp) {
										model.psy1 = resp[0];
										model.psy2 = resp[1];
									});
								} else if (result.type === 'LINKED') {
									Psychometric.getLinkedQuestion({id:result.id}, function(resp) {
										model.psy1 = resp;
									});
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
										customHandle: function(file, progress, modelValue, form, model) {
											var deferred = $q.defer();
											elementsUtils.fileToBase64(file).then(function(base64File) {
												deferred.resolve("<img src=\"" + base64File1 + "\">");
											});
											return deferred.promise;
										}
									}]
								}]
							}]
						}, {
							key: "psy1.options",
							type: "array",
							items: [{
								key: "psy1.options[].optionScore",
							}, {
								key: "psy1.options[].optionLangs",
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
											customHandle: function(file, progress, modelValue, form, model) {
												var deferred = $q.defer();
												elementsUtils.fileToBase64(file).then(function(base64File) {
													deferred.resolve("<img src=\"" + base64File1 + "\">");
												});
												return deferred.promise;
											}
										}]
									}]
								}]
							}, {
								key: "psy1.options[].linkedOptions",
								condition: "model.psy1.type === 'LINKED'",
								type: "array",
								startEmpty: true,
								items: [{
									key: "psy1.options[].linkedOptions[].optionScore",
								}, {
									key: "psy1.options[].linkedOptions[].optionLangs",
									type: "array",
									startEmpty: true,
									items: [{
										type: "section",
										htmlClass: "row",
										items: [{
											type: "section",
											htmlClass: "col-sm-4",
											items: [{
												key: "psy1.options[].linkedOptions[].optionLangs[].langCode",
												type: "select",
												titleMap: languagesTitleMap,
												notitle: true
											}]
										}, {
											type: "section",
											htmlClass: "col-sm-8",
											items: [{
												key: "psy1.options[].linkedOptions[].optionLangs[].optionText",
												condition: "!model.psy1.pictorial",
												type: "textarea",
												notitle: true
											}, {
												key: "psy1.options[].linkedOptions[].optionLangs[].optionText",
												condition: "model.psy1.pictorial",
												type: "file",
												fileType: "image/*",
												notitle: true,
												customHandle: function(file, progress, modelValue, form, model) {
													var deferred = $q.defer();
													elementsUtils.fileToBase64(file).then(function(base64File) {
														deferred.resolve("<img src=\"" + base64File1 + "\">");
													});
													return deferred.promise;
												}
											}]
										}]
									}]
								}]
							}]
						}]
					}, {
						"type": "box",
						"title": "Paired Question",
						"condition": "model.psy1.type === 'PAIRED'",
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
							type: "array",
							items: [{
								key: "psy2.options[].optionScore",
							}, {
								key: "psy2.options[].optionLangs",
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
					}]);
				}, function(errResp) {
					PageHelper.showProgress("psychometric", "Service Unreachable. Contact Administrator", 3000);
					deferred.reject(errResp);
				});
				return deferred.promise;
			},
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
								"title": "Active"
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
									"required": ["optionScore", "optionLangs"],
									"properties": {
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
										},
										"linkedOptions": {
											"type": "array",
											"title": "Linked Option",
											"items": {
												"type": "object",
												"properties": {
													"linkedOptionId": {
														"type": "number",
														"title": "Linked Option ID"
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
													},
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
								"title": "Active"
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
									"required": ["optionScore", "optionLangs"],
									"properties": {
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
							Psychometric.postLinkedQuestion(model.psy1).$promise.then(function(resp) {
								model.psy1 = resp;
								PageHelper.showProgress("psychometric", "Linked Questions created/updated", 3000);
							}, function(errResp) {
								$log.info(errResp);
								var err = errResp.data;
								err.error = err.errorCode || err.error;
								err.message = err.errorMsg || err.message;
								PageHelper.setError({message: err.error + ": " + err.message});
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