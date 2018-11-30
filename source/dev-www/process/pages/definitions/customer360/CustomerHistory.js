irf.pageCollection.factory(irf.page("customer360.CustomerHistory"), ["$log", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "translateFilter", "$stateParams",
    function($log, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, translateFilter, $stateParams) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "History",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                var schema = null;
                var customerId = $stateParams.pageId;
                if ($stateParams.pageData) {
                    var snapdiffFrom = $stateParams.pageData.snapdiffFrom;
                    var snapdiffTo = $stateParams.pageData.snapdiffTo
                }
                var self = this;
                model.tableData = [{
                    title: "DESCRIPTION",
                    data: "description"
                }, {
                    title: "CHANGED_FROM",
                    data: "changeFrom"
                }, {
                    title: "CHANGED_TO",
                    data: "changeTo"
                }]
                PageHelper.showLoader();
                Enrollment.getSchema().$promise.then(function(resp) {
                        schema = resp;
                        return Enrollment.getSanpshotDiff({
                            id1: snapdiffFrom,
                            id2: snapdiffTo
                        }).$promise
                    })
                    .then(function(resp) {
                        if (resp.customerLogs.length != 0) {
                            model.customerLogs = true;
                            var schemadata = schema.properties.customer;
                            model.customerLogs = true;
                            for (i in resp.customerLogs) {
                                if (schemadata.properties[resp.customerLogs[i].description] && schemadata.properties[resp.customerLogs[i].description].title) {
                                    resp.customerLogs[i].description = translateFilter(schemadata.properties[resp.customerLogs[i].description].title);
                                }
                            }
                            model.customerLog = {
                                "title": "customerInfo",
                                "columns": model.tableData,
                                "data": resp.customerLogs
                            }
                        };
                        if (resp.miscellaneousLogs.length != 0) {
                            model.miscellaneousLogs = true;
                            var schemadata = schema.properties.customer
                            for (i in resp.miscellaneousLogs) {
                                if (schemadata.properties[resp.miscellaneousLogs[i].description] && schemadata.properties[resp.miscellaneousLogs[i].description].title) {
                                    resp.miscellaneousLogs[i].description = translateFilter(schemadata.properties[resp.miscellaneousLogs[i].description].title);
                                }
                            }
                            model.miscellaneousLog = {
                                "title": "customerInfo",
                                "columns": model.tableData,
                                "data": resp.miscellaneousLogs
                            }
                        };
                        if (resp.udfLogs.length != 0) {
                            //model.miscellaneousLogs = true;
                            var schemadata = schema.properties.customer.properties.udf.properties.userDefinedFieldValues.properties;
                            for (i in resp.udfLogs) {
                                resp.udfLogs[i].description = translateFilter(resp.udfLogs[i].description);
                                console.log()
                            };
                            model.udfLogs = true;
                            model.udfLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.udfLogs
                            };
                        };
                        if (resp.enterpriseLogs.length != 0) {
                            model.enterpriseLogs = true;
                            model.enterpriseLog = {
                                "title": "familyMemberLogs",
                                "columns": model.tableData,
                                "data": resp.enterpriseLogs
                            };
                        };
                        if (resp.enterpriseCustomerRelationLogs.length != 0) {
                            model.enterpriseCustomerRelationLogs = true;
                            model.enterpriseCustomerRelationLog = {
                                "title": "familyMemberLogs",
                                "columns": model.tableData,
                                "data": resp.enterpriseCustomerRelationLogs
                            };
                        };
                        if (resp.familyMemberLogs.length != 0) {
                            model.familyMemberLogs = true;
                            model.familyMemberLog = {
                                "title": "familyMemberLogs",
                                "columns": model.tableData,
                                "data": resp.familyMemberLogs
                            };
                        };
                        if (resp.physicalAssetLogs.length != 0) {
                            model.physicalAssetLogs = true;
                            model.physicalAssetLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.physicalAssetLogs
                            };
                        }
                        if (resp.expenditureLogs.length != 0) {
                            model.expenditureLogs = true;
                            model.expenditureLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.expenditureLogs
                            };
                        }
                        if (resp.liabilityLogs.length != 0) {
                            model.liabilityLogs = true;
                            var schemadata = schema.properties.customer.properties
                                // for (i in resp.liabilityLogs) {
                                //     if (schemadata.liabilities.items.properties[resp.liabilityLogs[i].description] && schemadata.liabilities.items.properties[resp.liabilityLogs[i].description].title) {
                                //         resp.liabilityLogs[i].description = translateFilter(schemadata.liabilities.items.properties[resp.liabilityLogs[i].description].title);
                                //     }
                                // }
                            model.liabilityLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.liabilityLogs
                            };
                        }
                        if (resp.customerBankAccountLogs.length != 0) {
                            model.customerBankAccountLogs = true;
                            var schemadata = schema.properties.customer.properties
                                //model.customerLogs = true;
                            for (i in resp.customerBankAccountLogs) {
                                if (schemadata.customerBankAccounts.items.properties[resp.customerBankAccountLogs[i].description] && schemadata.customerBankAccounts.items.properties[resp.customerBankAccountLogs[i].description].title) {
                                    resp.customerBankAccountLogs[i].description = translateFilter(schemadata.customerBankAccounts.items.properties[resp.customerBankAccountLogs[i].description].title);
                                }
                            }
                            model.customerBankAccountLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.customerBankAccountLogs
                            };
                        }
                        if (resp.bankStatementLogs.length != 0) {
                            model.bankStatementLogs = true;
                            var schemadata = schema.properties.customer.properties
                            model.customerLogs = true;
                            for (i in resp.customerBankAccountLogs) {
                                // if (schemadata.customerBankAccounts.items.properties.bankStatements.items.properties[resp.bankStatementLogs[i].description] && schemadata.customerBankAccounts.items.properties.bankStatements.items.properties[resp.bankStatementLogs[i].description].title) {
                                //     resp.customerBankAccountLogs[i].description = translateFilter(schemadata.customerBankAccounts.items.properties.bankStatements.items.properties[resp.bankStatementLogs[i].description].title);
                                // }
                            }
                            model.bankStatementLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.bankStatementLogs
                            };
                        }
                        if (resp.incomeLogs.length != 0) {
                            model.incomeLogs = true;
                            model.incomeLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.incomeLogs
                            };
                        }
                        if (resp.additionalKYCLogs.length != 0) {
                            model.additionalKYCLogs = true;
                            model.additionalKYCLog = {
                                "title": "udfLogs",
                                "columns": model.additionalKYCLogs,
                                "data": resp.udfLogs
                            };
                        };
                        if (resp.financialAssetLogs.length != 0) {
                            model.financialAssetLogs = true;
                            model.financialAssetLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.financialAssetLogs
                            };
                        };
                        if (resp.verificationLogs.length != 0) {
                            model.verificationLogs = true;
                            model.verificationLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.verificationLogs
                            };
                        };
                        if (resp.enterpriseRegistrationLogs.length != 0) {
                            model.enterpriseRegistrationLogs = true;
                            model.enterpriseRegistrationLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.enterpriseRegistrationLogs
                            };
                        };
                        if (resp.enterpriseAssetLogs.length != 0) {
                            model.enterpriseAssetLogs = true;
                            model.enterpriseAssetLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.enterpriseAssetLogs
                            };
                        }
                        if (resp.incomeThroughSaleLogs.length != 0) {
                            model.incomeThroughSaleLogs = true;
                            model.incomeThroughSaleLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.incomeThroughSaleLogs
                            };
                        }
                        if (resp.otherBusinessIncomeLogs.length != 0) {
                            model.otherBusinessIncomeLogs = true;
                            model.otherBusinessIncomeLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.otherBusinessIncomeLogs
                            };
                        }
                        if (resp.rawMaterialExpenseLogs.length != 0) {
                            model.rawMaterialExpenseLogs = true;
                            model.rawMaterialExpenseLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.rawMaterialExpenseLogs
                            };
                        };
                        if (resp.fixedAssetsMachinaryLogs.length != 0) {
                            model.fixedAssetsMachinaryLogs = true;
                            model.fixedAssetsMachinaryLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.fixedAssetsMachinaryLogs
                            };
                        };
                        if (resp.buyerDetailLogs.length != 0) {
                            model.buyerDetailLogs = true;
                            model.buyerDetailLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.buyerDetailLogs
                            };
                        };
                        if (resp.supplierDetailLogs.length != 0) {
                            model.supplierDetailLogs = true;
                            model.supplierDetailLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.supplierDetailLogs
                            };
                        };
                        if (resp.financialSummaryLogs.length != 0) {
                            model.financialSummaryLogs = true;
                            model.financialSummaryLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.financialSummaryLogs
                            };
                        };
                        if (resp.enterpriseBureauDetailLogs.length != 0) {
                            model.enterpriseBureauDetailLogs = true;
                            model.enterpriseBureauDetailLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.enterpriseBureauDetailLogs
                            };
                        };
                        if (resp.customerPartnerLogs.length != 0) {
                            model.customerPartnerLogs = true;
                            model.customerPartnerLog = {
                                "title": "udfLogs",
                                "columns": model.tableData,
                                "data": resp.customerPartnerLogs
                            };
                        }
                        PageHelper.hideLoader();
                    }, function(err) {
                        PageHelper.hideLoader();
                        console.log(err)
                    });
            },
            form: [{
                type: "box",
                colClass: "col-sm-12",
                title: "CUSTOMER_DETAILS",
                items: [{
                    type: "section",
                    condition: 'model.customerLogs',
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.customerLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.udfLogs',
                colClass: "col-sm-12",
                title: "UDF_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.udfLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.familyMemberLogs',
                colClass: "col-sm-12",
                title: "FAMILY_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.familyMemberLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.physicalAssetLogs',
                colClass: "col-sm-12",
                title: "PHYSICAL_ASSET_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.physicalAssetLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.expenditureLogs',
                colClass: "col-sm-12",
                title: "EXPENDITURE_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.expenditureLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.liabilityLogs',
                colClass: "col-sm-12",
                title: "LIABILITY_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.liabilityLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.customerBankAccountLogs',
                colClass: "col-sm-12",
                title: "BANK_ACCOUNT_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.customerBankAccountLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.bankStatementLogs',
                colClass: "col-sm-12",
                title: "BANK_STATEMENT_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.bankStatementLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.miscellaneousLogs',
                colClass: "col-sm-12",
                title: "MISCELLANEOUS_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.miscellaneousLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.enterpriseLogs',
                colClass: "col-sm-12",
                title: "ENTERPRISE_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.enterpriseLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.enterpriseCustomerRelationLogs',
                colClass: "col-sm-12",
                title: "ENTERPRISE_CUSTOMER_RELATION_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.enterpriseCustomerRelationLog'></irf-simple-summary-table>"
                }]
            }, , {
                type: "box",
                condition: 'model.incomeLogs',
                colClass: "col-sm-12",
                title: "INCOME_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.incomeLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.additionalKYCLogs',
                colClass: "col-sm-12",
                title: "ADDITIONAL_KYC_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.additionalKYCLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.incomeLogs',
                colClass: "col-sm-12",
                title: "INCOME_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.incomeLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.financialAssetLogs',
                colClass: "col-sm-12 ",
                title: "FINANCIAL_ASSET_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.finacialAssetLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.verificationLogs',
                colClass: "col-sm-12",
                title: "VERIFICATION_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.verificationLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.enterpriseRegistrationLogs',
                colClass: "col-sm-12 ",
                title: "ENTERPRISE_REGISTRATION_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.enterpriseRegistrationLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.enterpriseAssetLogs',
                colClass: "col-sm-12 ",
                title: "ENTERPRISE_ASSET_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.enterpriseAssetLos'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.incomeThroughSaleLogs',
                colClass: "col-sm-12 ",
                title: "INCOME_THROUGH_SALES_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.incomeThroughSaleLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.otherBusinessIncomeLogs',
                colClass: "col-sm-12",
                title: "OTHER_BUSINESS_INCOME_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.otherBusinessIncomeLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.rawMaterialExpenseLogs',
                colClass: "col-sm-12",
                title: "RAW_MATERIAL_EXPENSES_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.rawMaterialExpenseLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.otherBusinessIncomeLogs',
                colClass: "col-sm-12",
                title: "OTHER_BUSINESS_INCOME_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.otherBusinessIncomeLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.fixedAssetsMachinaryLogs',
                colClass: "col-sm-12",
                title: "FIXED_ASSET_MACHINARY_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.fixedAssetsMachinaryLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.buyerDetailLogs',
                colClass: "col-sm-12 ",
                title: "BUYER_DETAIL_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.BuyerDetailLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.supplierDetailLogs',
                colClass: "col-sm-12",
                title: "SUPPLIER_DETAIL_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.supplierDetailLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.financialSummaryLogs',
                colClass: "col-sm-12",
                title: "FINANCIAL_SUMMARY_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.financialSummaryLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.enterpriseBureauDetailLogs',
                colClass: "col-sm-12",
                title: "ENTERPRISE_BUREAU_DETAIL_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.enterpriseBureauDetailLog'></irf-simple-summary-table>"
                }]
            }, {
                type: "box",
                condition: 'model.customerPartnerLogs',
                colClass: "col-sm-12",
                title: "CUSTOMER_PARTNER_DETAILS",
                items: [{
                    type: "section",
                    colClass: "col-sm-12",
                    html: "<irf-simple-summary-table irf-table-def='model.customerPartnerLog'></irf-simple-summary-table>"
                }]
            }],
            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {}
            }
        };
    }
]);