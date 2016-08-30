irf.pageCollection.factory(irf.page("loans.individual.collections.CreditValidation"),
["$log","$q", 'Pages_ManagementHelper','PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, ManagementHelper, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService){

	return {
		"type": "schema-form",
		"title": "PAYMENT_DETAILS_FOR_LOAN",
		initialize: function (model, form, formCtrl) {
            $log.info("Credit Validation Page got initialized");
            if (model._credit) {
                model.creditValidation = model.creditValidation || {};
                model.creditValidation.enterprise_name = model._credit.customerName;
                model.creditValidation.applicant_name = model._credit.applicant;
                model.creditValidation.co_applicant_name = model._credit.coApplicant;
                model.creditValidation.principal = model._credit.principalOutstandingAmtInPaisa;
                model.creditValidation.interest = model._credit.interest;
                model.creditValidation.fee = model._credit.fees;
                model.creditValidation.penal_interest = model._credit.penalInterest;
                model.creditValidation.amountDue = model._credit.demandAmountInPaisa;
                model.creditValidation.amountCollected = model._credit.repaymentAmountInPaisa;
            } else {
                $state.go('Page.Engine', {pageName: 'loans.individual.collections.CreditValidationQueue', pageId: null});
            }/*
            model.creditValidation.customer_name = "Suresh";
            model.creditValidation.principal = 1000;
            model.creditValidation.interest = 90;
            model.creditValidation.fee = 50;
            model.creditValidation.penal_interest = 15;
            model.creditValidation.amountDue = 1155;
            model.creditValidation.amountCollected = 1155;*/
        },
		
		form: [
			{
				"type":"box",
				"title":"Payment",
				"items":[
                    {
                        key:"creditValidation.enterprise_name",
                        title:"ENTERPRISE_NAME",
                        readonly:true
                    },
                    {
                        key:"creditValidation.applicant_name",
                        title:"APPLICANT",
                        readonly:true,
                    },
                    {
                        key:"creditValidation.co_applicant_name",
                        title:"CO_APPLICANT",
                        readonly:true,
                    },
                    {
                        key:"creditValidation.principal",
                        title:"PRINCIPAL",
                        readonly:true,
                        type:"amount"
                    },
                    {
                        key:"creditValidation.interest",
                        title:"INTEREST",
                        readonly:true,
                        type:"amount"
                    },
                    {
                        key:"creditValidation.penal_interest",
                        title:"PENAL_INTEREST",
                        readonly:true,
                        type:"amount"
                    },
                    {
                        key:"creditValidation.fee",
                        title:"FEES_AND_OTHER_CHARGES",
                        readonly:true,
                        type:"amount"
                    },
                    {
                        key:"creditValidation.amountDue",
                        title:"TOTAL_AMOUNT_DUE",
                        readonly:true,
                        type:"amount"
                    },
                    {
                        key:"creditValidation.amountCollected",
                        title:"AMOUNT_COLLECTED",
                        readonly:true,
                        type:"amount"
                    },
                    {
                        key:"creditValidation.status",
                        title:"",
                        notitle:true,
                        type:"radios",
                        titleMap:{
                            "1":"Fully Paid",
                            "2":"Partially Paid",
                            "3":"Not Paid",
                            "4":"Incorrect Information"
                                                  }
                    },
                    {
                        key:"creditValidation.reject_reason",
                        title:"REJECT_REASON",
                        type:"select",
                        titleMap: [{
                            "name":"Amount not creditted in account",
                            "value":"1"
                        }],
                        condition:"model.creditValidation.status=='3' || model.creditValidation.status=='4'"
                    },
                    {
                        key:"creditValidation.reject_remarks",
                        title:"REJECT_REMARKS",
                        readonly:false,
                        type: "textarea",
                        condition:"model.creditValidation.status=='3' || model.creditValidation.status=='4'"
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
