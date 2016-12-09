irf.pageCollection.factory(irf.page("loans.individual.screening.CBCheck"),
["$log", "$q","LoanAccount", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch","CreditBureau","Enrollment",
function($log, $q, LoanAccount, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,CreditBureau,Enrollment){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "CB_CHECK",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl) {

            model.customer = model.customer || {};
            model.customer.coapplicants = model.customer.coapplicants || [];
            model.customer.loanSaved = false;

            if (_.hasIn(model, 'loanAccount')){
                if (model.loanAccount.loanCustomerRelations && model.loanAccount.loanCustomerRelations.length >0){

                    for (var i = model.loanAccount.loanCustomerRelations.length - 1; i >= 0; i--) {
                        if(model.loanAccount.loanCustomerRelations[i].relation == 'Applicant'){
                            Enrollment.getCustomerById({id:model.loanAccount.loanCustomerRelations[i].customerId})
                            .$promise
                            .then(function(res){
                                model.customer.applicantname = res.firstName;
                            }, function(httpRes){
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                            model.customer.applicantid = model.loanAccount.loanCustomerRelations[i].customerId;
                            model.customer.loanAmount = model.loanAccount.loanAmountRequested;
                            model.customer.loanPurpose1 = '';
                            model.customer.loanSaved = true;
                        }
                        else if(model.loanAccount.loanCustomerRelations[i].relation == 'Co-Applicant'){
                            Enrollment.getCustomerById({id:model.loanAccount.loanCustomerRelations[i].customerId})
                            .$promise
                            .then(function(res){
                                model.customer.coapplicants.push({
                                "coapplicantid":model.loanAccount.loanCustomerRelations[i].customerId,
                                "coapplicantname":res.firstName,
                                "loanAmount":model.loanAccount.loanAmountRequested,
                                "loanPurpose1":''});
                                model.customer.loanSaved = true;
                            }, function(httpRes){
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                        }
                    }

                }
            }
        
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
                model.customer.loanAmount = params.loanAccount.loanAmountRequested;
                model.customer.loanPurpose1 = params.loanAccount.loanPurpose1;
                for (var i = model.customer.coapplicants.length - 1; i >= 0; i--) {
                    model.customer.coapplicants[i].loanAmount = params.loanAccount.loanAmountRequested;
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
                                "onClick": "actions.save(model.customer.applicantid,'BASE',model.customer.loanAmount, model.customer.loanPurpose1)"
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
                                    "onClick": "actions.save(model.customer.applicantid,'BASE',model.customer.coapplicants[arrayIndex].loanAmount, model.customer.coapplicants[arrayIndex].loanPurpose1)"
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
                PageHelper.showLoader();
                loanPurpose = 'Business Loan - General';
                CreditBureau.postcreditBureauCheck({
                    customerId: customerId,
                    type: CBType,
                    purpose: loanPurpose,
                    loanAmount: loanAmount
                }, function(response){
                    var retryStatus = response.status; 
                    if((response.status == 'Error' || response.status != 'SUCCESS') && response.status != 'PROCESSED'){
                        var retryCount=0;
                        while (retryCount<3 && retryStatus != 'SUCCESS'){
                            CreditBureau.reinitiateCBCheck({inqUnqRefNo:response.inqUnqRefNo},
                                function(httpres){
                                    retryStatus = response.status;
                                }, function (err){
                                    PageHelper.hideLoader();
                                    PageHelper.showProgress("cb-check", "Failed while placing retry Request", 5000);
                                    retryStatus = 'err';
                                });
                            if(retryStatus == 'SUCCESS' || retryStatus == 'err')
                                break;
                            retryCount++;
                        }
                    }
                    if(retryStatus == 'SUCCESS'){
                        PageHelper.hideLoader();
                        PageHelper.showProgress("cb-check", "Credit Bureau Request Placed..", 5000);
                    }
                }, function(errorResponse){
                    PageHelper.hideLoader();
                    if(errorResponse && errorResponse.data && errorResponse.data.error)
                        PageHelper.showProgress("cb-check", errorResponse.data.error, 5000);
                    else
                        PageHelper.showProgress("cb-check", "Failed while placing Credit Bureau Request", 5000);
                });
            }
        }

    };
}

]);
