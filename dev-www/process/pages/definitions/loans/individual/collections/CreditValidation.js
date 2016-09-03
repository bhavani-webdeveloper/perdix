irf.pageCollection.factory(irf.page("loans.individual.collections.CreditValidation"),
["$log","$q", 'Pages_ManagementHelper','LoanProcess', 'PageHelper','formHelper','irfProgressMessage',
'SessionStore',"$state","$stateParams","Masters","authService",
function($log, $q, ManagementHelper, LoanProcess, PageHelper,formHelper,irfProgressMessage,
	SessionStore,$state,$stateParams,Masters,authService){

	return {
		"type": "schema-form",
		"title": "PAYMENT_DETAILS_FOR_LOAN",
		initialize: function (model, form, formCtrl) {
            $log.info("Credit Validation Page got initialized");
            model.creditValidation = model.creditValidation || {};

            if (model._credit) {
                model.creditValidation = model._credit;               
                model.creditValidation.loanRepaymentDetailsId = model._credit.id;
                model.creditValidation.enterprise_name = model._credit.customerName;
                model.creditValidation.applicant_name = model._credit.applicant;
                model.creditValidation.co_applicant_name = model._credit.coApplicant;
                if (model._credit.principalOutstandingAmtInPaisa > 0)
                    model.creditValidation.principal = model._credit.principalOutstandingAmtInPaisa/100;
                if (model._credit.interest > 0)
                    model.creditValidation.interest = model._credit.interest/100;
                if (model._credit.fees > 0)
                    model.creditValidation.fee = model._credit.fees/100;
                if (model._credit.penalInterest > 0)
                    model.creditValidation.penal_interest = model._credit.penalInterest/100;
                if (model._credit.demandAmountInPaisa > 0)
                    model.creditValidation.amountDue = model._credit.demandAmountInPaisa/100;
                if (model._credit.repaymentAmountInPaisa > 0)
                    model.creditValidation.amountCollected = model._credit.repaymentAmountInPaisa/100;
            } else {
                $state.go('Page.Engine', {pageName: 'loans.individual.collections.CreditValidationQueue', pageId: null});
            }
        },
		
		form: [
			{
				"type":"box",
				"title":"Payment",
				"items":[{
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
                            "3":"Not Paid"
                            //"4":"Incorrect Information"
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
                PageHelper.showLoader();
                if(model.creditValidation.status == "1")
                {
                    $log.info("Inside FullPayment()");
                    LoanProcess.approve({"loanRepaymentDetailsId": model.creditValidation.loanRepaymentDetailsId}, null, function(response){
                    PageHelper.hideLoader();

                    }, function(errorResponse){
                    PageHelper.hideLoader();
                    PageHelper.showErrors(errorResponse);
                    });

                }
                else if(model.creditValidation.status == "3")
                {
                    $log.info("Inside NoPayment()");
                    var reqParams = {
                        "loanRepaymentDetailsId":model.creditValidation.loanRepaymentDetailsId,
                        "remarks":model.creditValidation.reject_remarks,
                        "rejectReason":model.creditValidation.reject_reason
                    };
                    LoanProcess.reject(reqParams,null, function(response){
                    PageHelper.hideLoader();
                    $state.go('Page.Engine', {pageName: 'loans.individual.collections.BounceQueue', pageId: null});

                    }, function(errorResponse){
                    PageHelper.hideLoader();
                    PageHelper.showErrors(errorResponse);
                    });

                } else {
                    $log.info("Outside FullPayment()");
                    LoanProcess.repay(model.creditValidation, function(response){
                    PageHelper.hideLoader();

                    }, function(errorResponse){
                    PageHelper.hideLoader();
                    PageHelper.showErrors(errorResponse);
                    });

                }
                
			}
		}
	};
}]);
