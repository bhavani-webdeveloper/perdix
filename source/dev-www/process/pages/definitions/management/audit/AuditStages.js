irf.pageCollection.factory(irf.page("management.audit.AuditStage"),
["$log", "SessionStore", "PageHelper", "formHelper", "RolesPages", "Utils",
    function($log, SessionStore, PageHelper, formHelper, RolesPages, Utils) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "User Roles",
            initialize: function(model, form, formCtrl) {},
            form: [{
                "type": "box",
                "title": "User Role Mapping",
                "items": [{
                    key: "userRoles.user_id",
                    type: "lov",
                    lovonly: true,
                    inputMap: {
                        "userId": {
                            "key": "userRoles.user_id"
                        },
                        "userName": {
                            "key": "userRoles.user_name"
                        }
                    },
                    outputMap: {
                        "userId": "userRoles.user_id",
                        "userName": "userRoles.user_name",
                        "roleId": "userRoles.role_id",
                        "roleName": "userRoles.role_name",
                        "userRoleId": "userRoles.user_role_id"
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model) {
                        return RolesPages.searchUsers({
                            userId: inputModel.userId,
                            userName: inputModel.userName
                        }).$promise;
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.userId + ': ' + item.userName,
                            item.roleId ? (item.roleId + ': ' + item.roleName) : ''
                        ];
                    }
                }, {
                    key: "userRoles.user_name",
                    readonly: true
                }, {
                    key: "userRoles.role_id",
                    title: "Role ID",
                    type: "lov",
                    lovonly: true,
                    fieldType: "number",
                    outputMap: {
                        "id": "userRoles.role_id",
                        "name": "userRoles.role_name"
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model) {
                        return RolesPages.allRoles({
                            userid: inputModel.id
                        }).$promise;
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.id,
                            item.name
                        ];
                    }
                }, {
                    key: "userRoles.role_name",
                    title: "Role name",
                    readonly: true
                }]
            }, {
                type: "actionbox",
                condition: "!model.userRoles.user_role_id",
                items: [{
                    type: "submit",
                    title: "Add User Role"
                }]
            }, {
                type: "actionbox",
                condition: "model.userRoles.user_role_id",
                items: [{
                    type: "submit",
                    title: "Update User Role"
                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "userRoles": {
                        "type": "object",
                        "properties": {
                            "user_id": {
                                "type": "string",
                                "title": "User ID"
                            },
                            "user_name": {
                                "type": "string",
                                "title": "User Name"
                            },
                            "role_id": {
                                "type": ["null", "string", "number"],
                                "title": "Role ID"
                            },
                            "role_name": {
                                "type": ["null", "string"],
                                "title": "Role Name"
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
                        RolesPages.updateUserRole(model.userRoles).$promise.then(function(resp) {
                            model.userRoles = resp;
                            PageHelper.showProgress("user-roles", "Role created/updated " + model.userRoles.user_role_id, 3000);
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
