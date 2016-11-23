irf.pageCollection.factory(irf.page("loans.individual.screening.CBCheck"),
["$log", "$q","LoanAccount", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch",
function($log, $q, LoanAccount, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "CB_CHECK",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl) {
            model.customer = model.customer || {};
            //model.branchId = SessionStore.getBranchId() + '';
            //model.customer.kgfsName = SessionStore.getBranch();
        
        },
        
        form: [
            {
                "type": "box",
                "items": [
                           {
                           type:"fieldset",
                                title:"CIBIL",
                                items:[
                                    {
                                        key:"customer.applicantname",
                                        title:"ApplicantName",
                                        type:"string",
                                    },
                                    { 
                                        type: 'button',  
                                        title: 'Submit for CBCheck',  
                                    },
                                    {
                                        key:"customer.coapplicantname",
                                        title:"Co-ApplicantName",
                                        type:"string",
                                    },
                                    { 
                                        type: 'button',  
                                        title: 'Submit for CBCheck',  
                                    },
                                ] 
                            },
                            {
                             type:"fieldset",
                                title:"HighMark",
                                items:[
                                    {
                                        key:"customer.applicantname",
                                        title:"ApplicantName",
                                        type:"string",

                                    },
                                    { 
                                        type: 'button',  
                                        title: 'Submit for CBCheck',  
                                    },
                                    {
                                        key:"customer.coapplicantname",
                                        title:"Co-ApplicantName",
                                        type:"string"
                                    },
                                    { 
                                        type: 'button', 
                                        title: 'Submit for CBCheck',  
                                    },
                                ] 
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
}

]);
