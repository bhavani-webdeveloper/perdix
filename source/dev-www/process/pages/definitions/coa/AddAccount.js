define([], function() {
    return {
        pageUID: "coa.AddAccount",
        pageType: "Engine",
        dependencies: ["$log", "$q", 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
            'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Utils",
            "BundleManager", "IrfFormRequestProcessor", "UIRepository", "$injector", "irfNavigator", "ChartOfAccount"
        ],

        $pageFn: function($log, $q, SchemaResource, PageHelper, formHelper, elementsUtils,
            irfProgressMessage, SessionStore, $state, $stateParams, Utils,
            BundleManager, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator, ChartOfAccount) {

            console.log("Inside Add Account");
            return {
                "type": "schema-form",
                "title": "ADD_ACCOUNT",
                "subTitle": "",
                initialize: function(model, form, formCtrl) {
                    $log.info("Add Account got initialized");

                    // var promise1 = ChartOfAccount.list().$promise;
                    // promise1.then((res) => {
                    //     console.log((res));
                    //     model.data1 = res;
                    //     PageHelper.hideLoader();
                    // }, (err) => {
                    //     console.log(err);
                    //     PageHelper.hideLoader();
                    // });

                    model.glAccount = model.glAccount || {};
                    if (!(model && model.glAccount && model.glAccount.id)) {
                        PageHelper.showLoader();
                        PageHelper.showProgress("page-init", "Loading...");
                        var glAccountId = $stateParams.pageId;
                        if (!glAccountId) {
                            PageHelper.hideLoader();
                        } else {
                            var promise = ChartOfAccount.get({
                                id: glAccountId
                            }).$promise;
                            promise.then((res) => {
                                console.log(res);
                                _.assign(model.glAccount, res);
                                PageHelper.hideLoader();
                            }, (err) => {
                                console.log(err);
                                PageHelper.hideLoader();
                            })
                        }
                    }
                },
                offline: false,
                form: [{
                        "type": "box",
                        "title": "",
                        "items": [{
                                "title": "TYPE",
                                "key": "glAccount.glType",
                                "type": "radios",
                                "required": true,
                                "titleMap": {
                                    "GROUP": "GROUP",
                                    "LEDGER": "LEDGER"
                                }
                            }, {
                                "title": "GL_TYPE",
                                "key": "glAccount.category",
                                "type": "select",
                                "enumCode": "gl_category",
                                "required": true
                            }, {
                                "title": "GL_PRODUCT_CODE",
                                "key": "glAccount.productCode",
                                "type": "text",
                                "condition": "model.glAccount.glType == 'LEDGER'",
                                "required": true
                            }, {
                                "title": "GL_NAME",
                                "required": true,
                                "key": "glAccount.glName"
                            },
                            // {
                            //   "title": "TOP_LEVEL_PARENT_GROUP",
                            //   "type" : "radios",
                            //   "enumCode": "decisionmaker",
                            //   "condition": "model.glType == 'Group'",
                            //   "required": "model.glType == 'Group'",
                            //   "key": "parentGl"
                            // },
                            {
                                "key": "glAccount.parentGl",
                                "title": "GL_PARENT_NAME",
                                "type": "lov",
                                "lovonly": true,
                                "autolov": true,
                                "searchHelper": formHelper,
                                inputMap: {
                                    "parentGlName": {
                                        "key": "glAccount.parentGlName"
                                    },
                                    "parentCategory": {
                                        "key": "glAccount.parentCategory"
                                    },
                                    "parentProductCode": {
                                        "key": "glAccount.parentProductCode"
                                    }
                                },
                                search: function(inputModel, form, model, context) {
                                    var promise = ChartOfAccount.search({
                                        'glName': inputModel.parentGlName,
                                        'category': inputModel.parentCategory,
                                        'productCode': inputModel.parentProductCode
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.glName,
                                        item.category,
                                        item.productCode
                                    ];
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.glAccount.parentId = valueObj.id;
                                    model.glAccount.parentGl = valueObj.glName;
                                }
                            }, {
                                "title": "ACTIVE",
                                "type": "checkbox",
                                "required": true,
                                "schema": {
                                    default: false
                                },
                                "key": "glAccount.status"
                            },
                            // {
                            //   "key": "branchSetCode",
                            //   "title": "BRANCH_SET_CODE",
                            //   "type": "lov",
                            //   "autolov": true
                            // },
                            {
                                "title": "EFFECTIVE_DATE",
                                "type": "date",
                                "required": true,
                                "key": "glAccount.dateMin"
                            }, {
                                "title": "EXPIRY_DATE",
                                "type": "date",
                                "required": true,
                                "key": "glAccount.dateMax"
                            }
                            // {
                            //     type: "datatable",
                            //     listStyle: "table",
                            //     key: "data1",
                            //     title: "DATA_TABLE",
                            //     selectable: true,
                            //     editable: true,
                            //     paginate: false,
                            //     searching: false,
                            //     getColumns: function() {
                            //         return [{
                            //             name: 'ID',
                            //             prop: 'id',
                            //             isTreeColumn: true,
                            //             relationProp: "parentId",
                            //             flexGrow: 1
                            //         }, {
                            //             name: 'GL_NAME',
                            //             prop: 'glName',
                            //             flexGrow: 1
                            //         }, {
                            //             name: 'GL_TYPE',
                            //             prop: 'glType',
                            //             flexGrow: 1
                            //         }]
                            //     },
                            //     getActions: function(item) {
                            //         return [];
                            //     }
                            // }
                        ]
                    },

                    {
                        "type": "actionbox",
                        "condition": "!model.glAccount.id",
                        "items": [{
                            "type": "button",
                            "icon": "fa fa-circle-o",
                            "title": "SUBMIT",
                            "onClick": "actions.save(model, formCtrl, form, $event)"
                        }, {
                            "type": "button",
                            "icon": "fa fa-circle-o",
                            "title": "BACK",
                            "onClick": "actions.close(model, formCtrl, form, $event)"
                        }]
                    },

                    {
                        "type": "actionbox",
                        "condition": "model.glAccount.id",
                        "items": [{
                            "type": "button",
                            "title": "UPDATE",
                            "onClick": "actions.update(model, formCtrl, form, $event)"
                        }, {
                            "type": "button",
                            "icon": "fa fa-circle-o",
                            "title": "BACK",
                            "onClick": "actions.close(model, formCtrl, form, $event)"
                        }]
                    }
                ],

                schema: function() {
                    return ChartOfAccount.getSchema().$promise;
                },

                actions: {
                    save: function(model, formCtrl, form, $event) {
                        $log.info("Inside Submit");
                        if (model.glAccount.glType == 'LEDGER' && !model.glAccount.parentId) {
                            PageHelper.showErrors({
                                data: {
                                    error: "Parent ID for gltype Ledger cannot be blank"
                                }
                            });
                            return false;
                        }
                        PageHelper.showLoader();
                        PageHelper.showProgress('request', 'Saving Data', 3000);
                        if (model.glType == 'GROUP' && !model.parentId) {
                            model.parentId = 0;
                        }
                        model.glAccount.branchSetCode = 'ALL';
                        var reqData = model.glAccount;
                        $log.info(reqData);
                        var promise = ChartOfAccount.post(reqData).$promise;
                        promise.then((data) => {
                            console.log(data);
                            PageHelper.showProgress('request', 'Update Done.', 3000);
                            irfNavigator.goBack();
                        }, (err) => {
                            PageHelper.showProgress('', 'Oops. Some error.', 3000);
                            PageHelper.showErrors(err);
                            PageHelper.hideLoader();
                        })
                    },

                    update: function(model, formCtrl, form, $event) {
                        if (model.glAccount.glType == 'LEDGER' && !model.glAccount.parentId) {
                            PageHelper.showErrors({
                                data: {
                                    error: "Parent ID for gltype Ledger cannot be blank"
                                }
                            });
                            return false;
                        }
                        if (model.glAccount.id == model.glAccount.parentId) {
                            PageHelper.showErrors({
                                data: {
                                    error: "Parent and Child cannot be same"
                                }
                            });
                            return false;
                        }
                        $log.info("Inside Submit");
                        PageHelper.showLoader();
                        PageHelper.showProgress('request', 'Updating...');
                        model.glAccount.branchSetCode = 'ALL';
                        model.glAccount.category = 'Asset';
                        model.glAccount.glType = 'LEDGER';
                        var promise = ChartOfAccount.update(model.glAccount).$promise;
                        promise.then((data) => {
                            console.log(data);
                            PageHelper.showProgress('request', 'Update Done.', 5000);
                            irfNavigator.goBack();
                        }, (err) => {
                            console.log(err);
                            PageHelper.showProgress('', 'Oops. Some error.', 5000);
                            PageHelper.showErrors(err);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        })
                    }
                }

            };
        }
    }
})
