irf.pageCollection.factory(irf.page("loans.individual.screening.LoanRequest"),
["$log", "$q","LoanAccount", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch",
function($log, $q, LoanAccount, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "LOAN_REQUEST",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl) {
            model.customer = model.customer || {};
            //model.branchId = SessionStore.getBranchId() + '';
            //model.customer.kgfsName = SessionStore.getBranch();
            model.customer.customerType = "Enterprise";
            model.loanAccount = {};
            model.loanAccount.loanCustomerRelations = [];
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                item.customer.firstName,
                item.customer.centreCode,
                item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
            ]
        },
        eventListeners: {
            "new-applicant": function(bundleModel, model, params){
                $log.info("Inside new-applicant of LoanRequest");
                model.loanAccount.applicant = params.customer.id;
                /* Assign more customer information to show */
            },
            "new-co-applicant": function(bundleModel, model, params){
                $log.info("Insdie new-co-applicant of LoanRequest");
                model.loanAccount.coApplicant = params.customer.id;
            },
            "new-business": function(bundleModel, model, param){
                $log.info("Inside new-business of LoanRequest");
                model.loanAccount.customerId = params.customer.id;
            }
        },
        form: [
            {
                "type": "box",
                "title": "PRELIMINARY_INFORMATION",
                "items": [
                    {
                        key: "loanAccount.loanPurpose1",
                        type: "select",
                        enumCode: "loan_purpose_1"
                    },
                    {
                        key: "loanAccount.loanPurpose2",
                        type: "select",
                        enumCode: "loan_purpose_2",
                        parentEnumCode: "loan_purpose_1"
                    },
                    {
                        key: "loanAccount.assetAvailableForHypothecation",
                        type: "select",
                        enumCode: "decisionmaker",
                        title: "ASSET_AVAILABLE_FOR_HYPOTHECATION"
                    },
                    {
                        key: "loanAccount.estimatedValueOfAssets",
                        type: "amount",
                        condition: "model.loanAccount.assetAvailableForHypothecation=='YES'",
                        title: "ESTIMATED_VALUE_OF_ASSETS"
                    },
                    {
                        key: "loanAccount.loanAmountRequested",
                        type: "amount",
                        title: "LOAN_AMOUNT_REQUESTED"
                    }
                ]
            },
            {
                "type": "actionbox",
                "items": [
                    {
                        "type": "button",
                        "title": "SAVE"
                    },
                    {
                        "type": "submit",
                        "title": "SUBMIT"
                    }
                ]
            }
        ],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            preSave: function(model, form, formName) {
                var deferred = $q.defer();
                if (model.customer.firstName) {
                    deferred.resolve();
                } else {
                    irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                    deferred.reject();
                }
                return deferred.promise;
            },
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                $log.warn(model);
            }
        }
    };
}]);
