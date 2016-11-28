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
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            model.customer = model.customer || {};
            model.customer.coapplicants = model.customer.coapplicants || [];
            model.customer.loanSaved = false;
        
        },
        eventListeners: {
            "new-applicant": function(bundleModel, model, params){
                $log.info("Inside new-applicant of CBCheck");
                model.customer.applicantname = params.customer.firstName;
                model.customer.applicantid = params.customer.id;
                model.customer.loanAmount = '';
                model.customer.loanPurpose1 = '';
                /* Assign more customer information to show */
            },
            "new-co-applicant": function(bundleModel, model, params){
                $log.info("Insdie new-co-applicant of CBCheck");
                model.customer.coapplicants.push({
                                "coapplicantid":params.customer.id,
                                "coapplicantname":params.customer.firstName});
            },
            "new-loan": function(bundleModel, model, params){
                $log.info("Inside new-loan of CBCheck");
                model.customer.loanSaved = true;
                model.customer.loanAmount = params.loanAccount.loanAmount;
                model.customer.loanPurpose1 = params.loanAccount.loanPurpose1;
                for (var i = model.customer.coapplicants.length - 1; i >= 0; i--) {
                    model.customer.coapplicants[i].loanAmount = params.loanAccount.loanAmount;
                    model.customer.coapplicants[i].loanPurpose1 = params.loanAccount.loanPurpose1;
                }
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
                                "condition":"model.customer.loanSaved",
                                "onClick": "actions.save(model.customer.applicantid,'CIBIL',model.customer.loanAmount, model.customer.loanPurpose1)"
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
                                    "condition":"model.customer.loanSaved && model.customer.coapplicants.length",
                                    "onClick": "actions.save(model.customer.applicantid,'CIBIL',model.customer.coapplicants[arrayIndex].loanAmount, model.customer.coapplicants[arrayIndex].loanPurpose1)"
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
                                "condition":"model.customer.loanSaved",
                                title: 'Submit for CBCheck',
                                "onClick": "actions.save(model.customer.applicantid,'AOR',model.customer.loanAmount, model.customer.loanPurpose1)"
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
                                    "condition":"model.customer.loanSaved && model.customer.coapplicants.length",
                                    "onClick": "actions.save(model.customer.applicantid,'CIBIL',model.customer.coapplicants[arrayIndex].loanAmount, model.customer.coapplicants[arrayIndex].loanPurpose1)"
                                }]
                            }
                            ]
                        }
                            
            
        ],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            save: function(customerId, CBType, loanAmount, loanPurpose){
                $log.info("Inside submit()");
                $log.warn(model);
            }
        }

    };
}

]);
