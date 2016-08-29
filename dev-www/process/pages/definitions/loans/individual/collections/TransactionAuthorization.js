

irf.pageCollection.factory(irf.page("loans.individual.collections.TransactionAuthorization"),
["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, ManagementHelper, PageHelper,formHelper,irfProgressMessage,
    SessionStore,$state,$stateParams,Masters,authService){

    return {
        "type": "schema-form",
        "title": "PAYMENT_DETAILS_FOR_LOAN",
        initialize: function (model, form, formCtrl) {
            $log.info("Transaction Authorization Page got initialized");

            model.customer_name = "GeeKay Industries";
            model.applicant_name = "Kanimozhi";
            model.co_applicant_name = "Raja";
            model.principal = 14872.36;
            model.interest = 4235.64;
            model.fee = 40;
            model.penal_interest = 200;
            model.amountDue = 19548;
            model.amountCollected = 10000;
        },
        
        form: [
            {
                "type":"box",
                "title":"PAYMENT",
                "items":[
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"customer_name",
                                        title:"ENTERPRISE_NAME",
                                        readonly:true
                                    },
                                    {
                                        key:"applicant_name",
                                        title:"APPLICANT",
                                        readonly:true,
                                    },
                                    {
                                        key:"co_applicant_name",
                                        title:"CO_APPLICANT",
                                        readonly:true,
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"principal",
                                        title:"PRINCIPAL",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"interest",
                                        title:"INTEREST",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4",
                                "items": [{
                                        key: "int_waived_off",
                                        title: "WAIVED",
                                        type: "checkbox",
                                        "fullwidth":true,
                                        schema: {
                                            default: false
                                        }
                                    }]
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"penal_interest",
                                        title:"PENAL_INTEREST",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4",
                                "items": [{
                                        key: "p_int_waived_off",
                                        title: "WAIVED",
                                        type: "checkbox",
                                        "fullwidth":true,
                                        schema: {
                                            default: false
                                        }
                                    }]
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"fee",
                                        title:"FEES_AND_OTHER_CHARGES",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4",
                                "items": [{
                                        key: "fee_waived_off",
                                        title: "WAIVED",
                                        type: "checkbox",
                                        "fullwidth":true,
                                        schema: {
                                            default: false
                                        }
                                    }]
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"amountDue",
                                        title:"AMOUNT_DUE",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"amountCollected",
                                        title:"AMOUNT_COLLECTED",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"status",
                                        title:"",
                                        type:"radios",
                                        titleMap:{
                                            "1":"Approve",
                                            "2":"Reject"
                                        }
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4"
                                }]
                    },
                    {
                        key:"reject_reason",
                        title:"REJECT_REASON",
                        type:"select",
                        titleMap: [{
                            "name":"Amount not creditted in account",
                            "value":"1"
                        }],
                        condition:"model.status=='2'"
                    },
                    {
                        key:"reject_remarks",
                        title:"REJECT_REMARKS",
                        readonly:false,
                        condition:"model.status=='2'"
                    }
                ]
            },
            {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "SUBMIT"
            }]
        }],
        schema: function() {
            return ManagementHelper.getVillageSchemaPromise();
        },
        actions: {
            generateFregCode:function(model,form){
                console.log(model);
                if(model.village.pincode>100000){
                    model.village.fregcode = Number(model.village.pincode+"001");
                }
                else {
                    model.village.fregcode="";
                }

            },
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                console.warn(model);
                if (window.confirm("Save?") && model.village) {
                    PageHelper.showLoader();
                    if(isNaN(model.village.version)) model.village.version=0;
                    model.village.version = Number(model.village.version)+1;
                    Masters.post({
                        action:"AddVillage",
                        data:model.village
                    },function(resp,head){
                        PageHelper.hideLoader();
                        PageHelper.showProgress("add-village","Done. Village ID :"+resp.id,2000);
                        console.log(resp);
                        ManagementHelper.backToDashboard();
                    },function(resp){
                        PageHelper.hideLoader();
                        PageHelper.showErrors(resp);
                        ManagementHelper.backToDashboard();
                        PageHelper.showProgress('error',"Oops. An error occurred.",2000);
                    });
                }
            }
        }
    };
}]);
