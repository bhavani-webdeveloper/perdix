irf.pageCollection.factory(irf.page("forms.FormsMaintanence"),
    ["$log", "$q", 'Pages_ManagementHelper', 'PageHelper', 'formHelper', 'Utils',
        'SessionStore', "$state", "$stateParams", "Masters", "authService", "User", "SchemaResource", "Queries", "Account", "FormsMaintenence",
        function ($log, $q, ManagementHelper, PageHelper, formHelper, Utils,
            SessionStore, $state, $stateParams, Masters, authService, User, SchemaResource, Queries, Account, FormsMaintenence) {

            return {
                "name": "FORM_MAINTANENCE",
                "type": "schema-form",
                "title": $stateParams.pageId ? "EDIT_FORM" : "NEW_FORM",
                initialize: function (model, form, formCtrl) {
                    $log.info("User Maintanance loaded");
                    var userRole = SessionStore.getUserRole();
                    if (userRole && userRole.accessLevel && userRole.accessLevel === 5) {
                        model.fullAccess = true;
                    }
                    var data = $stateParams.pageData;
                    if (!$stateParams.pageId) {
                        model.create = true;
                        model.user = {
                        };
                    }

                    else {
                        var data = $stateParams.pageData;
                        model.user = data;

                    }
                },

                form: [
                    {
                        type: "box",
                        title: "FORM_INFORMATION",
                        htmlClass: 'col-sm-12 col-md-12 col-lg-12',
                        items: [
                            {
                                key: "user.Output",
                                type: "select",
                                title: "Output",
                                titleMap: {
                                    "HTML": "HTML",
                                    "PDF": "PDF"
                                },
                                required: true
                            },
                            {
                                key: "user.pdf_renderer",
                                type: "select",
                                title: "Pdf renderer",
                                titleMap: {
                                    "CYAHP": "CYAHP",
                                    "NODE": "NODE"
                                },
                                required: true
                            },
                            {
                                type: "textarea",
                                title: "Table query",
                                key: "user.table_query",
                            },
                            {
                                type: "textarea",
                                title: "query",
                                key: "user.query"
                            },
                            {
                                type: "texArea",
                                title: "form_name",
                                key: "user.form_name",
                                required: true
                            },
                            {
                                type: "texArea",
                                title: "perdix_form_name",
                                key: "user.perdix_form_name",
                                required: true
                            },
                            {
                                type: "texArea",
                                title: "table_investor_id",
                                key: "user.table_investor_id",
                                required: true
                            },
                            {
                                type: "texArea",
                                title: "table_product_id",
                                key: "user.table_product_id",
                                required: true
                            },
                            {
                                type: "texArea",
                                title: "section_name",
                                key: "user.section_name",
                                required: true
                            },
                            {
                                type: "textarea",
                                title: "section_html",
                                key: "user.section_html",
                                required: true
                            },
                            {
                                type: "texArea",
                                title: "footer",
                                key: "user.footer"
                            },
                            {
                                type: "date",
                                title: "effective_date",
                                key: "user.effective_date",
                                required: true
                            },
                            {
                                type: "textArea",
                                title: "form_language",
                                key: "user.form_language",
                                required: true
                            },
                            {
                                type: "textArea",
                                title: "override_language",
                                key: "user.override_language"
                            },
                            {
                                type: "textArea",
                                title: "status",
                                key: "user.status",
                                required: true
                            },
                            {
                                type: "textarea",
                                title: "Notes",
                                key: "user.Notes"
                            }
                        ]
                    },
                    {
                        "type": "actionbox",
                        condition: "!model.create",
                        "items": [{
                            "type": "submit",
                            "title": "SAVE"
                        },

                        ]
                    },
                    {
                        "type": "actionbox",
                        condition: "model.create",
                        "items": [{
                            "type": "submit",
                            "title": "SAVE"
                        },
                        {
                            type: "button",
                            icon: "fa fa-refresh",
                            style: "btn-default",
                            title: "Reset",
                            onClick: function (model) {
                                model.user = {
                                    "pdf_renderer": "CYAHP",
                                    "Output": "HTML",
                                };
                            }
                        }]
                    }
                ],
                schema: function () {
                    return SchemaResource.getUserSchema().$promise;
                },
                actions: {
                    submit: function (model, form, formName) {
                        if (model.user.id) {
                            var form_id=model.user.id;
                            PageHelper.showLoader();
                           var req_data= _.cloneDeep(model.user);
                            FormsMaintenence.update(req_data)
                                .$promise
                                .then(function (response) {
                                    PageHelper.showProgress("user-update", 'Done', 5000);
                                    //model.user = response;    
                                    // console.log(response);
                                    // console.log(response['Notes']);
                                    // var values = Object.keys(response)
                                    // console.log(values) // [28, 17, 54]
                                    if(!model.user.id){

                                        model.user.id=form_id;
                                    }
                                }, function (httpResponse) {
                                    PageHelper.showProgress("user-update", 'Failed.', 5000);
                                    PageHelper.showErrors(httpResponse);
                                })
                                .finally(function () {
                                    PageHelper.hideLoader();
                                })
                        }
                        else {
                            PageHelper.showLoader();
                            var req_data= _.cloneDeep(model.user);
                            FormsMaintenence.create(req_data)
                                .$promise
                                .then(function (response) {
                                    PageHelper.showProgress("form-create", 'Done', 5000);
                                    model.user.id = response.id;
                                }, function (httpResponse) {
                                    PageHelper.showProgress("form-update", 'Failed.', 5000);
                                    PageHelper.showErrors(httpResponse);
                                })
                                .finally(function () {
                                    PageHelper.hideLoader();
                                })
                        }
                    }
                }
            };
        }
    ]
);
