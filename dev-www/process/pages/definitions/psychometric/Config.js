irf.pageCollection.factory(irf.page("psychometric.Config"),
["$log", "SessionStore", "PageHelper", "formHelper", "Utils","Psychometric",
    function($log, SessionStore, PageHelper, formHelper, Utils,Psychometric) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Psychometric",
            initialize: function(model, form, formCtrl) {
                PageHelper.showLoader();
                Psychometric.getAllConfig().$promise.then(function(resp) {
                    model.config = resp;
                }, function(errResp) {}).finally(function() {
                    PageHelper.hideLoader();
                });
            },
            form: [{
                "type": "box",
                "title": "Configuration",
                "items": [{
                    "key": "config",
                    "type": "array",
                    "title": " ",
                    "titleExpr": "model.config[arrayIndex].key",
                    "add": null,
                    "remove": null,
                    "items": [{
                        "key": "config[].value",
                        "title": "Value",
                        "type": "text"
                    }, {
                        "key": "config[].description",
                        "notitle": true,
                        "type": "textarea",
                        "readonly": true
                    }]
                }]
            }, {
                type: "actionbox",
                items:[{
                    type: "submit",
                    title: "Update Configuration"
                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "category": {
                        "type": "object",
                        "title": "Category",
                        "properties": {
                            "cuttoffscore": {
                                "type": "number",
                                "title": "CuttoffScore"
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
                        Psychometric.updateAllConfig(model.config).$promise.then(function(resp){
                            model.config= resp;
                            PageHelper.showProgress("config","Configurations updated", 3000);
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



