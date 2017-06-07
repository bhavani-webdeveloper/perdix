/**
 * Created by Sachin.M on 22-07-2016.
 */
irf.pageCollection.factory(irf.page('loans.groups.GroupLoanRepaymentQueue'), ["$log", "formHelper", "LoanAccount",
    "$state","groupCommons","searchResource",
    function($log, formHelper, LoanAccount,$state,groupCommons,searchResource){
        //isLegacy :: single loan prdt (true) or others (false)

        return {
            "id": "GroupRepaymentQueue",
            "type": "schema-form",
            "name": "GroupRepaymentQueue",
            "title": "GROUP_LOAN_REPAYMENT_QUEUE",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                $log.info("GroupRepaymentQueue got initialized");
            },
            form:[
                {
                    "type":"box",
                    "title":"SEARCH",
                    "items":[
                        {
                            key:"isLegacy",
                            "type":"radios",
                            "titleMap":{
                                "false":"Single Loan Product",
                                "true":"Others"
                            }
                        },
                        {
                            key:"partner"
                        },
                        {
                            key:"groupCode",
                            type:"string"
                        }
                    ]
                },
                {
                    "type":"actionbox",
                    "items": [
                        {
                            "type":"submit",
                            "style":"btn-theme",
                            "title":"SEARCH"
                        }
                    ]
                }
            ],
            schema:{
                "type": "object",
                "title": "SearchOptions",
                "properties": {
                    "isLegacy":{
                        "title":"PRODUCT_TYPE",
                        "type":"boolean",
                        "default":"false"

                    },
                    "partner": {
                        "title": "PARTNER",
                        "type": "string",
                        "enumCode":"partner",
                        "x-schema-form":{
                            "type":"select"

                        }
                    },
                    "groupCode":{
                        "title":"GROUP_CODE",
                        "type":"string"
                    }
                },
                "required":["partner","groupCode","isLegacy"]
            },
            actions:{
                submit:function(model, formCtrl, formName){
                    console.log(model);
                    $state.go("Page.Engine",{
                        pageName:'loans.groups.GroupLoanRepay',
                        pageId:[model.partner,model.groupCode,model.isLegacy].join(".")
                    });
                }
            }
        };
    }]);

