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
                {
                    "type": "box",
                    colClass: "col-sm-12",
                    "title": "Role & Page Mapping",
                    "items": [
                        {
                            key: "rolePage.currentRoleId",
                            title: "Role ID",
                            type: "lov",
                            lovonly: true,
                            fieldType: "number",
                            outputMap: {
                                "id": "rolePage.currentRoleId",
                                "name": "rolePage.currentRoleName"
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
                            },
                            onSelect: function(result, model, context) {
                                PageHelper.showLoader();
                                RolesPages.allPages({roleId:result.id}).$promise.then(function(result){
                                    if (result && result.body && result.body.length) {
                                        model.rolePage.access = [];
                                        for (var i = 0; i < result.body.length; i++) {
                                            var a = {
                                                id: result.body[i].id, // page_id
                                                uri: result.body[i].uri,
                                                rpa_id: result.body[i].rpa_id,
                                                page_config: result.body[i].page_config,
                                                title: result.body[i].title,
                                                icon_class: result.body[i].icon_class,
                                                state: result.body[i].state,
                                                page_name: result.body[i].page_name,
                                                $selected: !!result.body[i].rpa_id
                                            };
                                            model.rolePage.access.push(a);
                                        };
                                    }
                                }).finally(function(){
                                    PageHelper.hideLoader();
                                });
                            }
                        },
                        {
                            key: "rolePage.currentRoleName",
                            title: "Role Name",
                            readonly: true
                        },
                        {
                            key: "rolePage.access",
                            condition: "model.rolePage.access.length",
                            type: "tableview",
                            "notitle": true,
                            "selectable": true,
                            "editable": true,
                            "tableConfig": {
                                "searching": true,
                                "paginate": true,
                                "pageLength": 10
                            },
                            getColumns: function(){
                                return [{
                                    "title": "Page Title",
                                    "data": "title",
                                    render: function(data, type, full, meta) {
                                        return '<i class="' + full.icon_class + '">&nbsp;</i>' + translateFilter(data);
                                    },
                                    editable: false
                                }, {
                                    "title": "State",
                                    "data": "state",
                                    editable: false
                                }, {
                                    "title": "Page Name",
                                    "data": "page_name",
                                    editable: false
                                }, {
                                    "title": "Page Config",
                                    "data": "page_config",
                                    edit: function(data, type, full, meta) {
                                        // future implementation
                                    }
                                }]
                            }
                        }
                    ]
                },
                {
                    type: "actionbox",
                    condition: "model.rolePage.access.length",
                    items: [
                        {
                            type: "submit",
                            title: "Update Pages For Role"
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