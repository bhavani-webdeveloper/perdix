irf.pageCollection.factory(irf.page("forms.DownloadForm"),
    ["$log", "$q", 'Pages_ManagementHelper', 'PageHelper', 'formHelper', 'Utils',
        'SessionStore', "$state", "$stateParams", "Masters", "authService", "User", "SchemaResource", "Queries", "Account", "FormsMaintenence",
        function ($log, $q, ManagementHelper, PageHelper, formHelper, Utils,
            SessionStore, $state, $stateParams, Masters, authService, User, SchemaResource, Queries, Account, FormsMaintenence) {

            return {
                "name": "FORM_MAINTANENCE",
                "type": "schema-form",
                "title": $stateParams.pageId ? "EDIT_FORM" : "DOWNLOAD_FORM",
                initialize: function (model, form, formCtrl) {
                    $log.info("User Maintanance loaded");
                    var userRole = SessionStore.getUserRole();
                    
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
                                type: "texArea",
                                title: "form_name",
                                key: "user.form_name",
                                required: true
                            },
                            {
                                type: "textarea",
                                title: "Account Number",
                                key: "user.id",
                                required:true
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
                           // http://kinarasit.perdix.co.in:8080/forms/formPrint.jsp?form_name=testtest1&record_id=12
                           Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=" + model.user.form_name + "&record_id=" + model.user.id)
                           PageHelper.hideLoader();
                        }
                        else {
                          
                        }
                    }
                }
            };
        }
    ]
);
