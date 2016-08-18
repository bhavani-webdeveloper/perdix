

irf.pageCollection.factory(irf.page("loans.individual.TransactionAuthorization"),
["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, ManagementHelper, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService){

	return {
		"type": "schema-form",
		"title": "Payment Details for Loan : " + $stateParams.pageId,
		initialize: function (model, form, formCtrl) {
            $log.info("Transaction Authorization Page got initialized");

            model.customer_name = "Suresh";
            model.principal = 1000;
            model.interest = 90;
            model.fee = 50;
            model.penal_interest = 15;
            model.amountDue = 1155;
            model.amountCollected = 1140;
        },
		
		form: [
			{
				"type":"box",
				"title":"Payment",
				"items":[
                    {
                        type:"section",
                        "htmlClass": "row",
                        "items": [{
                            "type": "section",
                            "htmlClass": "col-xs-8 col-md-8",
                            "items": [{
                                        key:"customer_name",
                                        title:"Customer Name",
                                        readonly:true
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
                                        title:"Principal",
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
                                        title:"Interest",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4",
                                "items": [{
                                        key: "int_waived_off",
                                        title: "Waived",
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
                                        title:"Penal Interest",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4",
                                "items": [{
                                        key: "p_int_waived_off",
                                        title: "Waived",
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
                                        title:"Fees & Other Charges",
                                        readonly:true,
                                        type:"amount"
                                    }]
                                },
                                {
                                "type": "section",
                                "htmlClass": "col-xs-4 col-md-4",
                                "items": [{
                                        key: "fee_waived_off",
                                        title: "Waived",
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
                                        title:"Amount due",
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
                                        title:"Amount Collected",
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
                        title:"Reject Reason",
                        type:"select",
                        titleMap: [{
                            "name":"Amount not creditted in account",
                            "value":"1"
                        }],
                        condition:"model.status=='2'"
                    },
                    {
                        key:"reject_remarks",
                        title:"Reject Remarks",
                        readonly:false,
                        condition:"model.status=='2'"
                    }
				]
			}
			,
			{
				"type": "actionbox",
				"items": [{
					"type": "submit",
					"title": "SAVE"
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
