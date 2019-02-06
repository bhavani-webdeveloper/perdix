define({
    pageUID: "kgfs.loans.individual.screening.Input",
    pageType: "Engine",
    dependencies: ["$log", "formHelper", "Product", "PageHelper", "$state", "SessionStore", "Utils", "irfNavigator", "$stateParams", "RolesPages", "$filter", "Enrollment", "Queries", "$q", "$timeout", "irfProgressMessage","BundleManager"],
    $pageFn: function($log, formHelper, Product, PageHelper, $state, SessionStore, Utils, irfNavigator, $stateParams, RolesPages, $filter, Enrollment, Queries, $q, $timeout, irfProgressMessage,BundleManager) {
        return {
            "type": "schema-form",
            "title": "PRODUCT_CATEGORY",
            initialize: function(model, form, formCtrl) {
                model.product = model.product || {};
            },
            form: [{
                "type": "box",
                "title": "PRODUCT_CATEGORY",
                "items": [
                    {
                        "key": "product.productCategory",
                        "type": "select",
                        "enumCode": "loan_product_category_master",
                        "required": true,
                        "title": "PRODUCT_CATEGORY",
                       
                    },
                    {
                        "type": "actionbox",
                        //"condition": "!model.product.id",
                        "items": [{
                            "type": "submit",
                            "title": "Submit"
                        }]
                    },
                ]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "productCategory": {
                        "type": "text",
                        "title": "PRODUCT_CATEGORY"
                    }
                },
                "required": [
                   // "branch"
                ]
            },
            actions: {
                submit: function(model, form, formName) {
                    irfNavigator.go({
                        state: "Page.Bundle",
                        pageName: "kgfs.loans.individual.screening.ScreeningInput",
                        pageData: {
                            "productCategory": model.product.productCategory
                        }
                    })
                }
            }
        }
    }
})