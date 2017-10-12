irf.pageCollection.factory(irf.page("audit.detail.FieldVerification"), ["$log", "Utils", "elementsUtils", "formHelper", "PageHelper", "irfNavigator", "$stateParams", "Audit", "SessionStore",
    function($log, Utils, elementsUtils, formHelper, PageHelper, irfNavigator, $stateParams, Audit, SessionStore) {
        var branch = SessionStore.getBranch();
        // var validateFields = function(model) {
        //     for (i in model.field_verification) {
        //         var filedVerifyDate = model.field_verification[i].field_verify_date;
        //         var date = moment(new Date()).format("YYYY-MM-DD");
        //         $log.info(date)
        //         $log.info(filedVerifyDate)
        //         $log.info("filedVerifyDate")
        //         if ((filedVerifyDate - date) >= 0) {
        //             PageHelper.setError({
        //                 message: "Field verification date should not be Future date"
        //             });
        //             return false;
        //         }
        //         return true;
        //     }
        // };

        return {
            "type": "schema-form",
            "title": "FIELD_VERIFICATION",
            initialize: function(model, form, formCtrl) {
                var self = this;
                self.form = [];
                if (!$stateParams.pageId) {
                    irfNavigator.goBack();
                    return;
                }
                $stateParams.pageData = $stateParams.pageData || {};
                if (typeof($stateParams.pageData.readonly) == 'undefined') {
                    $stateParams.pageData.readonly = true;
                }
                model.readonly = $stateParams.pageData.readonly;
                model.audit_id = Number($stateParams.pageId);
                model.field_verification = model.field_verification || [];
                var master = Audit.offline.getAuditMaster() || {};

                var init = function(response) {
                    model.add_fv = {
                        loan_type_id: null,
                        urn: null,
                        book_entity_id: null,
                        field_verify_date: null,
                        amount: null,
                        comments: null
                    };
                    model.master = master;
                    model.field_verification = response || [];
                    for (i in model.field_verification) {
                        model.field_verification[i].fv_newgen_uid = elementsUtils.generateUUID();
                    }
                    var tableColumnsConfig = [{
                        "title": "LOAN_TYPE",
                        "data": "loan_type_id",
                        render: function(data, type, full, meta) {
                            return master.field_verification[data].loan_type;
                        }

                    }, {
                        "title": "URN",
                        "data": "urn"
                    }, {
                        "title": "ENTITY",
                        "data": "book_entity_id",
                        render: function(data, type, full, meta) {
                            return master.book_entity[data].entity_name;
                        }
                    }, {
                        "title": "DATE",
                        "data": "field_verify_date",
                        // "onSelect": function(model, form, schemaForm, event) {
                        //     var date = moment(new Date()).format("YYYY-MM-DD");

                        //     if (true) {

                        //     }

                        // }
                    }, {
                        "title": "AMOUNT",
                        "data": "amount"
                    }, {
                        "title": "COMMENTS",
                        "data": "comments"
                    }];



                    var fieldverificationTitleMap = [];
                    _.forOwn(master.field_verification, function(v, k) {
                        fieldverificationTitleMap.push({
                            "name": v.loan_type,
                            "value": v.loan_type_id
                        });
                    });
                    var bookEntityTitleMap = [];
                    _.forOwn(master.book_entity, function(v, k) {
                        bookEntityTitleMap.push({
                            "name": v.entity_name,
                            "value": v.entity_id
                        });
                    });
                    self.form = [{
                        "type": "box",
                        "colClass": "col-md-12",
                        "items": [{
                            "key": "field_verification",
                            "type": "tableview",
                            "title": "FIELD_VERIFICATION",
                            "selectable": false,
                            "editable": false,
                            "tableConfig": {
                                "searching": true,
                                "paginate": true,
                                "pageLength": 10,
                            },
                            getColumns: function() {
                                return tableColumnsConfig; //its coming from after adding fieldverification
                            },
                            getActions: function() {
                                return [{
                                    name: "EDIT",
                                    fn: function(item, index) {
                                        model.add_fv = item;
                                        // if (model.$isOffline) {
                                        //     Audit.offline.field_verification(auditId, model.processCompliance);
                                        // }
                                    },
                                    isApplicable: function(item, index) {
                                        return !$stateParams.pageData.readonly;
                                    }
                                }, {
                                    name: "DELETE",
                                    fn: function(item, index) {
                                        Utils.confirm("Are you sure to delete the record captured?").then(function() {
                                            var fieldverification = model.field_verification;
                                            for (i in fieldverification) {
                                                if (item.fv_newgen_uid == fieldverification[i].fv_newgen_uid) {
                                                    fieldverification.splice(i, 1);
                                                    break;
                                                }
                                            }
                                            if (model.$isOffline) {
                                                Audit.offline.field_verification(auditId, model.field_verification);
                                            }
                                        });
                                    },
                                    isApplicable: function(item, index) {
                                        return !$stateParams.pageData.readonly;
                                    }
                                }];
                            }
                        }]
                    }, {
                        "type": "box",
                        "htmlClass": "col-sm-12 col-xs-12",
                        "condition": "!model.readonly",
                        "title": "EDIT",
                        "items": [{
                            "key": "add_fv.loan_type_id",
                            "title": "LOAN_TYPE",
                            "type": "select",
                            "titleMap": fieldverificationTitleMap,
                            "required": true

                        }, {
                            "key": "add_fv.urn",
                            "title": "URN",
                            "type": "string",

                        }, {
                            "key": "add_fv.book_entity_id",
                            "title": "BOOK_ENTITY",
                            "type": "select",
                            "titleMap": bookEntityTitleMap,
                            "required": true
                        }, {
                            "key": "add_fv.field_verify_date",
                            "title": "FIELD_VERIFY_DATE",
                            "type": "date"
                        }, {
                            "key": "add_fv.amount",
                            "title": "AMOUNT",
                        }, {
                            "key": "add_fv.comments",
                            "title": "COMMENTS",
                        }, {
                            "type": "actions",
                            "condition": "model.add_fv.fv_newgen_uid",
                            "items": [{
                                "title": "UPDATE",
                                "type": "button",
                                "onClick": "actions.edit(model, formCtrl, form, $event)"
                            }, {
                                "title": "RESET",
                                "type": "button",
                                "style": "btn-default",
                                onClick: function(model) {
                                    model.add_fv = {
                                        loan_type_id: null,
                                        urn: null,
                                        book_entity_id: null,
                                        field_verify_date: null,
                                        amount: null,
                                        comments: null
                                    };
                                }
                            }]

                        }, {
                            "type": "actions",
                            "condition": "!model.add_fv.fv_newgen_uid",
                            "items": [{
                                "title": "ADD",
                                "type": "button",
                                "onClick": "actions.edit(model, formCtrl, form, $event)"
                            }, {
                                "title": "RESET",
                                "type": "button",
                                "style": "btn-default",
                                onClick: function(model) {
                                    model.add_fv = {
                                        loan_type_id: null,
                                        urn: null,
                                        book_entity_id: null,
                                        field_verify_date: null,
                                        amount: null,
                                        comments: null
                                    };
                                }
                            }]

                        }]
                    }]
                }
                model.$isOffline = false;
                if ($stateParams.pageData && $stateParams.pageData.auditData && $stateParams.pageData.auditData.field_verification && $stateParams.pageData.auditData.field_verification.length) {
                    init($stateParams.pageData.auditData.field_verification);
                } else {
                    Audit.offline.getFieldVerification($stateParams.pageId).then(function(res) {
                        init(res);
                        model.$isOffline = true;
                    }, function(errRes) {
                        PageHelper.showErrors(errRes);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                }
            },
            form: [],

            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "add_fv": {
                        "type": "object",
                        "properties": {
                            "urn": {
                                "type": ["string", "null"],
                                "title": "URN",
                                "maxLength": 16,
                                "minLength": 16
                            },
                            "field_verify_date": {
                                "type": ["string", "null"],
                                "title": "FIELD_VERIFY_DATE"
                            },
                            "AMOUNT": {
                                "type": ["string", "null"],
                                "title": "AMOUNT"
                            },
                            "loan_type": {
                                "type": ["string", "null"],
                                "title": "LOAN_TYPE"
                            },

                            "comments": {
                                "type": ["string", "null"],
                                "title": "COMMENTS"
                            },
                        },

                    }
                },
            },
            actions: {
                edit: function(model, formCtrl, form, $event) {
                    PageHelper.clearErrors();
                    formHelper.validate(formCtrl).then(function() {
                        if (!validateFields(model)) return;
                        if (!model.add_fv.fv_newgen_uid) {
                            model.add_fv.fv_newgen_uid = elementsUtils.generateUUID();
                            model.field_verification.push(model.add_fv);
                        }
                        if (model.$isOffline) {
                            Audit.offline.setFieldVerification(model.audit_id, model.field_verification).then(function() {
                                PageHelper.showProgress("auditId", "Audit Updated Successfully.", 3000);
                                model.add_fv = {
                                    loan_type_id: null,
                                    urn: null,
                                    book_entity_id: null,
                                    field_verify_date: null,
                                    amount: null,
                                    comments: null
                                };
                            }, PageHelper.showErrors).finally(PageHelper.hideLoader);
                        } else {
                            $stateParams.pageData.auditData.field_verification = model.field_verification;
                            model.add_fv = {
                                loan_type_id: null,
                                urn: null,
                                book_entity_id: null,
                                field_verify_date: null,
                                amount: null,
                                comments: null
                            };
                        }
                    })
                },
                goBack: function(model, form, formName) {
                    irfNavigator.goBack();
                },
            }
        };
    }
]);