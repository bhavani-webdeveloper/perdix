irf.pageCollection.factory(irf.page("management.UserBranches"),
["$log", "SessionStore", "PageHelper", "formHelper", "RolesPages", "Utils", "UserBranch",
    function($log, SessionStore, PageHelper, formHelper, RolesPages, Utils, UserBranch) {

        var branch = SessionStore.getBranch();

        var refreshCurrentBranches = function(user_id, model){
            UserBranch.getUserBranches({user_id: user_id})
                .$promise
                .then(function(resp){
                    var userBranches = resp.body;
                    model.userBranch.branches = userBranches;
                })
        }

        return {
            "type": "schema-form",
            "title": "USER_BRANCHES",
            initialize: function(model, form, formCtrl) {
                model.userBranch = {};
            },
            form: [{
                "type": "box",
                "title": "USER_BRANCH_MAPPING",
                "items": [{
                    key: "userBranch.user_id",
                    type: "lov",
                    lovonly: true,
                    inputMap: {
                        "userId": {
                            "key": "userBranch.user_id",
                            "required": true
                        },
                    },
                    outputMap: {
                        
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model) {
                        return UserBranch.searchUser({user_id: inputModel.userId}).$promise
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.user_id + ': ' + item.user_name,
                            'Home Branch: ' + item.branch_name
                        ];
                    },
                    onSelect: function(value, model, context){
                        model.userBranch.user_id = value.user_id;
                        model.userBranch.user_name = value.user_name;
                        model.userBranch.home_branch = value.branch_name;
                        refreshCurrentBranches(value.user_id, model);
                    }
                }, 
                {
                    key: "userBranch.user_name",
                    readonly: true
                }, 
                {
                    key: "userBranch.branches",
                    type: "array",
                    add:null,
                    remove:null,
                    view: "fixed",
                    items: [
                        {
                            key: "userBranch.branches[].branch.branch_name",
                            title: "BRANCH_NAME",
                            readonly: true,
                        },
                        {
                            key: "userBranch.branches[].branch.branch_code",
                            title: "BRANCH_CODE",
                            readonly: true,
                        },
                        {
                            key: "userBranch.branches[].removeBranchBtn",
                            type: "button",
                            title: "REMOVE",
                            readonly: false,
                            onClick: function(model, formCtrl, form){
                                console.log(arguments);
                            }
                        }
                    ]
                },
                {
                    type: "fieldset",
                    title:  "MAP_NEW_BRANCH",
                    "condition": "model.userBranch.user_name",
                    items: [
                        {
                            key: "newEntry.branch_id",
                            type: "select",
                            "title" : "BRANCH_ID",
                            "enumCode": "branch_id"
                        },
                        {
                            key: "newEntry.submit",
                            type: "button",
                            title: "MAP_BRANCH",
                            onClick: function(model, formCtrl, form){
                                var reqData = {
                                    branch_id : model.newEntry.branch_id,
                                    user_id: model.userBranch.user_id
                                };
                                if (!_.hasIn(reqData, 'branch_id') || reqData.branch_id==null){
                                    PageHelper.showProgress('new-branch', 'Invalid Branch', 5000);
                                    return;
                                }
                                PageHelper.showProgress("new-branch", "Saving...");
                                UserBranch.save(reqData)
                                    .$promise
                                    .then(function(response){
                                        PageHelper.showProgress("new-branch", "Done.", 5000);

                                        refreshCurrentBranches(model.userBranch.user_id, model);
                                    }, function(response){
                                        PageHelper.showProgress("new-branch", "Error", 5000);
                                    })
                            }
                        }
                    ]
                }
                ]
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
                    "userBranch": {
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
