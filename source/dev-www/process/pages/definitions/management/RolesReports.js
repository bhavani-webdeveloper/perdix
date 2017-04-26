define({
    pageUID: "management.RolesReports",
    pageType: "Engine",
    dependencies: ["$log", "BIReports", "SessionStore", "PageHelper", "formHelper", "RolesPages", "Utils"],

    $pageFn: function($log, BIReports, SessionStore, PageHelper, formHelper, RolesPages, Utils) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "ROLES_AND_REPORTS",
            initialize: function(model, form, formCtrl) {
                model.address = model.address || {};
                model.rolePage = model.rolePage || {};
                PageHelper.showLoader();
                BIReports.reportList().$promise.then(function(resp) {
                    model.rolePage.Reports = resp;
                    $log.info(model.rolePage.Reports);
                }, function(errResp) {
                    PageHelper.showErrors(errResp);
                }).finally(function() {
                    PageHelper.hideLoader();
                });
            },
            form: [{
                "type": "box",
                colClass: "col-sm-12",
                "title": "Role & Report Mapping",
                "items": [{
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
                        model.rolePage.access = [];
                        RolesPages.getReportsByRole({
                            roleId: result.id
                        }).$promise.then(function(response) {
                            for (i in model.rolePage.Reports) {
                                var a = {
                                    id: model.rolePage.Reports[i].value,
                                    uri: model.rolePage.Reports[i].name,
                                    access:false
                                }
                                if (response && response.body && response.body.length) {
                                    for (j in response.body) {
                                        if (model.rolePage.Reports[i].value == response.body[j].report_name) {
                                            a.access = true;
                                            a.page_config = response.body[j].config;
                                        }
                                    }
                                    model.rolePage.access.push(a);
                                } else {
                                    model.rolePage.access.push(a);
                                }
                            }
                        }).finally(function() {
                            PageHelper.hideLoader();
                        });
                    }
                }, {
                    key: "rolePage.currentRoleName",
                    title: "Role Name",
                    readonly: true
                }, {
                    key: "rolePage.access",
                    condition: "model.rolePage.access.length",
                    type: "array",
                    add: null,
                    remove: null,
                    titleExpr: "(model.rolePage.access[arrayIndex].access?'⚫ ':'⚪ ') + model.rolePage.access[arrayIndex].uri",
                    items: [{
                        type: "section",
                        htmlClass: "row",
                        items: [{
                            type: "section",
                            htmlClass: "col-sm-3",
                            items: [{
                                key: "rolePage.access[].access",
                                title: "Allow Access",
                                type: "checkbox",
                                fullwidth: true,
                                schema: {
                                    default: true
                                }
                            }]
                        }, {
                            type: "section",
                            htmlClass: "col-sm-9",
                            items: [{
                                key: "rolePage.access[].page_config",
                                title: "Config",
                                type: "textarea"
                            }]
                        }]
                    }]
                }]
            }, {
                type: "actionbox",
                condition: "model.rolePage.access.length",
                items: [{
                    type: "submit",
                    title: "Update Reports For Role"
                }]
            }],
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
                        reports: []
                    };

                    for (var i = model.rolePage.access.length - 1; i >= 0; i--) {
                        if (model.rolePage.access[i].access) {
                            var a = {
                                report_name: model.rolePage.access[i].id,
                                config: model.rolePage.access[i].page_config
                            };
                            req.reports.push(a);
                        }
                    };
                    Utils.confirm("Are you sure?").then(function() {
                        PageHelper.showLoader();
                        RolesPages.updateRoleReportAccess(req).$promise.then(function(resp) {
                            PageHelper.showProgress("roles-pages", "Page roles updated", 3000);
                        }, function(err) {
                            PageHelper.showErrors(err);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        });
                    });
                }
            }
        }
    }
})