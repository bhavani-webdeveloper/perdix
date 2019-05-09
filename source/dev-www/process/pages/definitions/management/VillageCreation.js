define({
    pageUID: "management.VillageCreation",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "PageHelper", "VillageCreationResource", "$state", "SessionStore", "Utils", "irfNavigator", "$stateParams", "RolesPages", "$filter", "Enrollment", "Queries", "$q", "PagesDefinition"],
    $pageFn:
        function ($log, formHelper, PageHelper, VillageCreationResource, $state, SessionStore, Utils, irfNavigator, $stateParams, RolesPages, $filter, Enrollment, Queries, $q, PagesDefinition) {
            return {
                "type": "schema-form",
                "title": "VILLAGE_CREATION",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    model.village = model.village || {};
                    model.village.status = model.village.status || true;
                    PagesDefinition.getPageConfig("Page/Engine/management.VillageCreation")
                        .then(function (data) {
                            model.pageConfig = data;
                            /* Handle Allowed Branches */
                        });
                    if ($stateParams.pageId) {
                        var id = $stateParams.pageId;
                        PageHelper.showLoader();
                        VillageCreationResource.villageGetByID({
                            villageid: id
                        }, function (response, headersGetter) {
                            model.village = _.cloneDeep(response);
                            PageHelper.hideLoader();
                        }, function (resp) {
                            PageHelper.hideLoader();
                        });
                    }

                    $log.info("Village Creation sample got initialized");
                },

                form: [{
                    type: "box",
                    title: "VILLAGE_CREATION",
                    items: [{
                        key: "village.villageName",
                        title: "VILLAGE_NAME",
                        type: "string",
                        required: true
                    },
                    {
                        key: "village.bankId",
                        title: "BANK_NAME",
                        type: "select",
                        enumCode: "bank",
                    },
                    {
                        key: "village.branchName",
                        title: "BRANCH_NAME",
                        type: "select",
                        enumCode: "branch",
                        parentEnumCode: "bank",
                        parentValueExpr: "model.village.bankId",
                        required: true

                    },
                    {
                        key: "village.pincode",
                        title: "Pincode",
                        type: "string",
                        fieldType: "number",
                        required: true

                    },
                    {
                        key: "village.fregcode",
                        title: "Fregcode",
                        type: "string",
                        fieldType: "number"
                    },
                    {
                        key: "village.status",
                        required: true,
                        title: "STATUS",
                        type: "radios",
                        titleMap: [{
                            name: "ACTIVE",
                            value: true
                        }, {
                            name: "INACTIVE",
                            value: false
                        }
                        ]

                    },]
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }]
                }],
                schema: {
                    "type": "object",
                    "properties": {
                        "customer": {
                            "type": "object",
                            "properties": {
                                "villageName": {
                                    "title": "VILLAGE_NAME",
                                    "type": ["string", "null"],
                                    "enumCode": "village",
                                    "x-schema-form": {
                                        "type": "select",
                                        "screenFilter": true,

                                    }
                                },
                                "bankId": {
                                    "title": "BANK_NAME",
                                    "type": ["integer", "null"],
                                    "enumCode": "bank",
                                    "x-schema-form": {
                                        "type": "select",
                                        "screenFilter": true,

                                    }
                                },
                                "branchName": {
                                    "title": "BRANCH_NAME",
                                    "type": ["null", "integer"],
                                    "enumCode": "branch",
                                    "x-schema-form": {
                                        "type": "select",
                                        "screenFilter": true
                                    }
                                },
                                "pincode": {
                                    "title": "PIN_CODE",
                                    "type": ["number", "null"],
                                    "minimum": 100000,
                                    "maximum": 999999,
                                },
                                "fregcode": {
                                    "title": "FREG_CODE",
                                    "type": ["number", "null"],
                                },
                                "status": {
                                    "type": ["boolean", "null"],
                                    "title": "STATUS",
                                    "default": "ACTIVE"
                                },
                            }
                        }
                    },
                    "required": ["villageName", "branchName", "pincode", "status"]

                },
                actions: {
                    submit: function (model, form, formName) {
                        PageHelper.showLoader();
                        PageHelper.clearErrors();
                        PageHelper.showProgress('villageCreationSubmitRequest', 'Processing');
                        var tempModelData = _.clone(model.village);
                        var deferred = {};
                        if ((model.village.id != "") && (model.village.id != undefined)) {
                            deferred = VillageCreationResource.villageEdit(tempModelData).$promise;
                        }
                        else {
                            deferred = VillageCreationResource.villageCreation(tempModelData).$promise;
                        }

                        deferred.then(function (data) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress('villageCreationSubmitRequest', 'Done', 5000);
                            model.village = {};
                            form.$setPristine();
                            $state.go('management.VillageCreationDashboard', null);
                        }, function (data) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress('villageCreationSubmitRequest', 'Oops some error happend', 5000);
                            PageHelper.showErrors(data);
                        });
                    }
                }
            };
        }
})
