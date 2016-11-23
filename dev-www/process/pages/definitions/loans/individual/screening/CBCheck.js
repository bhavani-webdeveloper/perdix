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
            model.customer.coapplicants = model.customer.coapplicants || [];
        
        },
        eventListeners: {
            "new-applicant": function(bundleModel, model, params){
                $log.info("Inside new-applicant of CBCheck");
                model.customer.applicantname = params.customer.firstName;
                model.customer.applicantid = params.customer.id;
                /* Assign more customer information to show */
            },
            "new-co-applicant": function(bundleModel, model, params){
                $log.info("Insdie new-co-applicant of CBCheck");
                model.customer.coapplicants.push({
                                "coapplicantid":params.customer.id,
                                "coapplicantname":params.customer.firstName});
            }
        },
        
        form: [
            {
                "type": "box",
                "items": [
                           {
                                type:"fieldset",
                                title:"CIBIL",
                                items:[]
                            },
                            {
                                key:"customer.applicantname",
                                title:"ApplicantName",
                                readonly:true,
                                type:"string",
                            },
                            { 
                                type: 'button',  
                                title: 'Submit for CBCheck',  
                            },
                            {
                                key:"customer.coapplicants",
                                type:"array",
                                title: ".",
                                view: "fixed",
                                notitle:true,
                                 "startEmpty": true,
                                 "add":null,
                                 "remove":null,
                                items:[{
                                    key:"customer.coapplicants[].coapplicantname",
                                    title:"Co ApplicantName",
                                    readonly:true,
                                    type:"string"
                                },
                                { 
                                    type: 'button',  
                                    title: 'Submit for CBCheck',
                                    condition:"model.customer.coapplicants.length"
                                }]
                            },
                            {
                                type:"fieldset",
                                title:"HighMark",
                                items:[]
                            },
                            {
                                key:"customer.applicantname",
                                title:"ApplicantName",
                                readonly:true,
                                type:"string",

                            },
                            { 
                                type: 'button',  
                                title: 'Submit for CBCheck',  
                            },
                            {
                                key:"customer.coapplicants",
                                type:"array",
                                title: ".",
                                view: "fixed",
                                notitle:true,
                                 "startEmpty": true,
                                 "add":null,
                                 "remove":null,
                                items:[{
                                    key:"customer.coapplicants[].coapplicantname",
                                    title:"Co ApplicantName",
                                    readonly:true,
                                    type:"string"
                                },
                                { 
                                    type: 'button',  
                                    title: 'Submit for CBCheck',
                                    condition:"model.customer.coapplicants.length"
                                }]
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
