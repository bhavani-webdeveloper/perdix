irf.pageCollection.factory(irf.page("psychometric.singleQuestionMaintenance"), ["$log", "SessionStore", "PageHelper", "formHelper", "Utils",
            function($log, SessionStore, PageHelper, formHelper, Utils) {

                var branch = SessionStore.getBranch();

                return {
                    "type": "schema-form",
                    "title": "QUESTION_MAINTENANCE_SINGLE_TYPE",
                    initialize: function(model, form, formCtrl) {
                        model.psy = model.psy || {};
                        model = Utils.removeNulls(model, true);
                        $log.info("question maintenance page got initiated");
                    },
                    form: [{
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
                                    key: "psy.categoryName",
                                    type: "lov",
                                    lovonly: true,
                                    fieldType: "string",
                                }, {
                                    key: "psy.difficulty",
                                    type: "select",
                                    titleMap: {
                                        "LOW": "Low",
                                        "MEDIUM": "Medium",
                                        "HIGH": "High"
                                    }
                                },/* {
                                    key: "psy.type",
                                    type: "hidden",
                                },*/ {
                                    key: "psy.questionLang",
                                    type: "array",
                                    startEmpty: true,
                                    items: [{
                                        key: "psy.questionLang[].langcode",
                                        type:"select"
                                    }, {
                                        key: "psy.questionLang[].questionText",
                                        type:"textarea"
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
                                                    key: "psy.options[].optionlang[].langcode",
                                                    type:"select"  
                                                },{
                                                    key: "psy.options[].optionlang[].optiontext",
                                                    type:"textarea"
                                                }]
                                            }]
                                    },
                                ]
                            },



                            {
                                type: "actionbox",
                                condition: "!model.psy.questionId",
                                items: [{
                                    type: "submit",
                                    title: "Create Question"
                                }]
                            },
                            {
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
                            }
                        ],
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
                                        "categoryId": {
                                            "type": "number",
                                            "title": "CATEGORY_ID"
                                        },
                                        "categoryName": {
                                            "type": "number",
                                            "title": "CATEGORY_NAME"
                                        },
                                        "difficulty": {
                                            "type": "string",
                                            "title": "DIFFICULTY"
                                        },
                                        "type": {
                                            "type": "string",
                                            "title": "TYPE"
                                        },
                                        "questionLang": {
                                            "type": "array",
                                            "title": "QUESTION_LANGUAGE",
                                            "items": {
                                                "type": "object",
                                                "required": [],
                                                "properties": {
                                                    "langcode": {
                                                        "type": "number",
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
                                                                    "type": "number",
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