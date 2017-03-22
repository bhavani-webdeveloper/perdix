irf.pageCollection.factory(irf.page("management.Roles"),
["$log", "SessionStore", "PageHelper", "formHelper", "RolesPages", "Utils",
    function($log, SessionStore, PageHelper, formHelper, RolesPages, Utils) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Roles",
            initialize: function(model, form, formCtrl) {
            },
            form: [
                {
                    "type": "box",
                    "title": "Role Creation/Updation",
                    "items": [
                        {
                            key: "roles.role_id",
                            title: "Role ID",
                            type: "lov",
                            lovonly: true,
                            fieldType: "number",
                            outputMap: {
                                "id": "roles.role_id",
                                "name": "roles.role_name",
                                "accessLevel": "roles.role_access_level"
                            },
                            searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                return RolesPages.allRoles().$promise;
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.id,
                                    item.name,
                                    "Access Level: " + item.accessLevel
                                ];
                            }
                        },
                        {
                            key: "roles.role_name",
                            title: "Role Name",
                            required: true
                        },
                        {
                            key: "roles.role_access_level",
                            title: "Access Level",
                            type: "number",
                            required: true
                        }
                    ]
                },
                {
                    type: "actionbox",
                    condition: "!model.roles.role_id",
                    items: [
                        {
                            type: "submit",
                            title: "Create Role"
                        }
                    ]
                },
                {
                    type: "actionbox",
                    condition: "model.roles.role_id",
                    items: [
                        {
                            type: "submit",
                            title: "Update Role"
                        },
                        {
                            type: "button",
                            icon: "fa fa-refresh",
                            style: "btn-default",
                            title: "Reset",
                            onClick: function(model) {
                                model.roles = {};
                            }
                        }
                    ]
                }
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "address": {
                        "type": "object",
                        "title": "Address",
                        "properties": {
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
                    Utils.confirm('Are you sure?').then(function() {
                        PageHelper.clearErrors();
                        PageHelper.showLoader();
                        RolesPages.updateRole(model.roles).$promise.then(function(resp){
                            model.roles = resp;
                            PageHelper.showProgress("roles-pages","Role created/updated", 3000);
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