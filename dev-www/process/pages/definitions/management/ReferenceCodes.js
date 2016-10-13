irf.pageCollection.factory(irf.page("management.ReferenceCodes"), ["$log", "SessionStore", "PageHelper", "formHelper", "ReferenceCode",
    function($log, SessionStore, PageHelper, formHelper, ReferenceCode) {

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Reference Codes",
            initialize: function(model, form, formCtrl) {
                model.reference = model.reference || {};
            },
            form: [{
                "type": "box",
                colClass: "col-sm-6",
                "title": "Reference Codes",
                "items": [{
                    key: "reference.ClassifierName",
                    title: "Classifier Name",
                    type: "lov",
                    outputMap: {
                        "name": "reference.ClassifierName"
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model) {
                        return ReferenceCode.allClassifier().$promise;
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.code
                        ];
                    },
                    onSelect: function(result, model, context) {
                        PageHelper.showLoader();
                        ReferenceCode.allCodes({
                            classifier: result.code
                        }).$promise.then(function(result) {
                            if (result && result.body && result.body.length) {
                                model.reference.codes = result.body;
                                model.reference.parentClassifier = result.body[0].parentClassifier;
                            }
                        }).finally(function() {
                            PageHelper.hideLoader();
                        });
                    }
                }, {
                    key: "reference.parentClassifier",
                    condition: "model.reference.codes.length",
                    title: "Parent Classifier",
                    lovonly: true,
                    type: "lov",
                    outputMap: {
                        "name": "reference.parentClassifier"
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model) {
                        return ReferenceCode.allClassifier().$promise;
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.code,
                            item.displayName,
                            item.name
                        ];
                    },
                    onSelect: function(result, model, context) {
                        PageHelper.showLoader();
                        for (var i = 0; i < model.reference.codes.length; i++) {
                            model.reference.codes[i].parentClassifier = result.code;

                        }
                        PageHelper.hideLoader();
                    }
                }, {
                    key: "reference.codes",
                    condition: "model.reference.codes.length",
                    type: "array",
                    //add: null,
                    //remove: null,
                    items: [{
                        key: "reference.codes[].id",
                        title: "Id",
                        readonly: true
                    }, {
                        key: "reference.codes[].name",
                        title: "Name"
                    }, {
                        key: "reference.codes[].code",
                        title: "Code"
                    }, {
                        key: "reference.codes[].parentReferenceCode",
                        title: "Parent Code",
                        type: "lov",
                        lovonly: true,
                        outputMap: {
                            "code": "reference.codes[arrayIndex].parentReferenceCode"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            var promise = ReferenceCode.allCodes({
                                classifier: model.reference.parentClassifier
                            }).$promise;

                            return promise;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.code,
                                item.name
                            ];
                        },
                    }, {
                        key: "reference.codes[].field1",
                        title: "Field1"
                    }, {
                        key: "reference.codes[].field2",
                        title: "Field2"
                    }, {
                        key: "reference.codes[].field3",
                        title: "Field3"
                    }, {
                        key: "reference.codes[].field4",
                        title: "Field4"
                    }, {
                        key: "reference.codes[].field5",
                        title: "Field5"
                    }]
                }, {
                    type: "actionbox",
                    condition: "model.reference.codes.length",
                    items: [{
                        type: "submit",
                        title: "Update"
                    }]
                }]
            }],

            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "reference": {
                        "type": "object",
                        "properties": {
                            "codes": {
                                "type": "array",
                                "title": "Codes",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "id": {
                                            "type": "number",
                                            "title": "NUMBER"
                                        },
                                        "name": {
                                            "type": "string",
                                            "title": "NUMBER"
                                        },
                                        "parentClassifier": {
                                            "type": "string",
                                            "title": "PARENT_CLASSIFIER"
                                        },
                                        "parentCode": {
                                            "type": "string",
                                            "title": "PARENT_CODE"
                                        },
                                        "field1": {
                                            "type": "string",
                                            "title": "FIELD!"
                                        },
                                        "field2": {
                                            "type": "string",
                                            "title": "FIELD2"
                                        },
                                        "field3": {
                                            "type": "string",
                                            "title": "FIELD3"
                                        },
                                        "field4": {
                                            "type": "string",
                                            "title": "FIELD4"
                                        },
                                        "field5": {
                                            "type": "string",
                                            "title": "FIELD5"
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            },

            actions: {
                submit: function(model, form, formName) {}
            }
        };
    }
]);