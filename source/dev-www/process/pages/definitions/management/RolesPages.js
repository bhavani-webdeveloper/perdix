irf.pageCollection.factory(irf.page("management.RolesPages"),
["$log", "SessionStore", "PageHelper", "formHelper", "RolesPages", "Utils", "translateFilter",
    function($log, SessionStore, PageHelper, formHelper, RolesPages, Utils, translateFilter) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "ROLES_AND_PAGES",
            initialize: function(model, form, formCtrl) {
                model.address = model.address || {};
            },
            form: [
               
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "address": {
                        "type": "object",
                        "title": "Address",
                        "properties": {
                            "streetAddress": {
                                "type": "string",
                                "title": "Street Address"
                            },
                            "city": {
                                "type": "string",
                                "title": "City"
                            }
                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    var req = {
                        role_id: model.rolePage.currentRoleId,
                        pages: []
                    };

                    for (var i = model.rolePage.access.length - 1; i >= 0; i--) {
                        if (model.rolePage.access[i].$selected) {
                            var a = {
                                page_id: model.rolePage.access[i].id,
                                page_config: model.rolePage.access[i].page_config
                            };
                            req.pages.push(a);
                        }
                    };
                    Utils.confirm("Are you sure?").then(function(){
                        PageHelper.showLoader();
                        RolesPages.updateRolePageAccess(req).$promise.then(function(resp){
                            PageHelper.showProgress("roles-pages","Page roles updated", 3000);
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