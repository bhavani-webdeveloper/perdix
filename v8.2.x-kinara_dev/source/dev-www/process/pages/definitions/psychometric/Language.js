irf.pageCollection.factory(irf.page("psychometric.Language"),
["$log", "SessionStore", "PageHelper", "formHelper", "Utils","Psychometric",
    function($log, SessionStore, PageHelper, formHelper, Utils,Psychometric) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Language",
            initialize: function(model, form, formCtrl) {
            },
            form: [
                {
                    "type": "box",
                    "title": "Language Creation/Updation",
                    "items": [
                        {
                            key: "language.id",
                            title: "Language ID",
                            type: "lov",
                            lovonly: true,
                            fieldType: "number",
                            outputMap: {
                                "id": "language.id",
                                "langCode": "language.langCode",
                                "language": "language.language"
                            },
                            searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                return Psychometric.getLanguages().$promise;
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.langCode,
                                    item.language
                                ];
                            }
                        },
                        {
                            key: "language.langCode",
                            title: "Language Code",
                            condition: "model.language.id",
                            readonly: true,
                            required: true
                        },
                        {
                            key: "language.langCode",
                            title: "Language Code",
                            condition: "!model.language.id",
                            required: true
                        },
                        {
                            key:"language.language",
                            title:"Language Name",
                            required: true
                        }
                    ]
                },
                {
                    type: "actionbox",
                    condition: "!model.language.id",
                    items: [
                        {
                            type: "submit",
                            title: "Create language"
                        }
                    ]
                },
                {
                    type: "actionbox",
                    condition: "model.language.id",
                    items:[
                        {
                            type: "submit",
                            title: "Update language"
                        },
                        {
                            type: "button",
                            icon: "fa fa-refresh",
                            style: "btn-default",
                            title: "Reset",
                            onClick: function(model) {
                                model.language = {};
                            }
                        },
                        
                    ]
                }
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "language": {
                        "type": "object",
                        "title": "language",
                        "properties": {
                            "id": {
                                "type": "number",
                                "title": "ID"
                            }
                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    Utils.confirm('Are you sure?').then(function() {
                        PageHelper.clearErrors();
                        PageHelper.showLoader();
                        Psychometric.postLanguage(model.language).$promise.then(function(resp){
                            model.language= resp;
                            PageHelper.showProgress("language-pages","language created/updated", 3000);
                        }, function(err){
                            PageHelper.showErrors(err);
                        }).finally(function(){
                            PageHelper.hideLoader();
                        });
                    });
                }
            }
        };
    }
]);



