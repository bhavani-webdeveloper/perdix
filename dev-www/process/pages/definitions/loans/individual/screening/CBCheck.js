irf.pageCollection.factory(irf.page("loans.individual.screening.CBCheck"),
["$log", "$q","LoanAccount", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch","CreditBureau","Enrollment","BundleManager",
function($log, $q, LoanAccount, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,CreditBureau,Enrollment,BundleManager){

    var branch = SessionStore.getBranch();

    var fnPost = function(model, customerType, CBType, index){
        var customerId;
        var CBType;
        var loanAmount;
        var loanPurpose;
        if(customerType=='APP'){
            customerId = model.customer.applicantid;
            loanAmount = model.customer.loanAmount;
        }
        else if(customerType == 'CO-APP'){
            customerId = model.customer.coapplicants[index].coapplicantid;
            loanAmount = model.customer.coapplicants[index].loanAmount;
        }

        $log.info("Inside submit()");
        PageHelper.showLoader();
        loanPurpose = 'Business Loan - General';
        CreditBureau.postcreditBureauCheck({
            customerId: customerId,
            type: CBType,
            purpose: loanPurpose,
            loanAmount: loanAmount
        }, function(response){
            if(CBType == 'BASE'){
                if (customerType == 'APP'){
                    model.customer.inqUnqRefNo = response.inqUnqRefNo;
                    model.customer.highmarkStatus = response.status;
                    if(response.status != 'SUCCESS' && response.status != 'PROCESSED')
                        model.customer.applicantHighmarkFailed = true;
                    else
                        model.customer.applicantHighmarkFailed = false;

                }
                else if(customerType == 'CO-APP'){
                    model.customer.coapplicants[index].inqUnqRefNo = response.inqUnqRefNo;
                    model.customer.coapplicants[index].highmarkStatus = response.status;
                    if(response.status != 'SUCCESS' && response.status != 'PROCESSED')
                        model.customer.coapplicants[index].applicantHighmarkFailed = true;
                    else
                        model.customer.coapplicants[index].applicantHighmarkFailed = false;
                }
            }
            if(CBType == 'CIBIL'){
                if (customerType == 'APP')
                    model.customer.cibilStatus = response.status;
                else if(customerType == 'CO-APP'){
                    model.customer.coapplicants[index].cibilStatus = response.status;
                }
            }
            if(response.status == 'SUCCESS' || response.status == 'PROCESSED'){
                PageHelper.showProgress("cb-check", "Credit Bureau Request Placed..", 5000);
                BundleManager.pushEvent('cb-check-done', model._bundlePageObj, {customerId: customerId, cbType:CBType})
            }
            else if(response.status == 'ERROR' || response.status == 'Error'){
                PageHelper.showProgress("cb-check", "Error while placing Credit Bureau Request", 5000);
            }
            PageHelper.hideLoader();
        }, function(errorResponse){
            PageHelper.hideLoader();
            if(errorResponse && errorResponse.data && errorResponse.data.error)
                PageHelper.showProgress("cb-check", errorResponse.data.error, 5000);
            else
                PageHelper.showProgress("cb-check", "Failed while placing Credit Bureau Request", 5000);
        });
    }

    var retry = function(model, customerType, index){
        var inqUnqRefNo;
        var customerId;
        if(customerType=='APP'){
            inqUnqRefNo = model.customer.inqUnqRefNo;
            customerId = model.customer.applicantid;
        }
        else if(customerType == 'CO-APP'){
            inqUnqRefNo = model.customer.coapplicants[index].inqUnqRefNo;
            customerId =  model.customer.coapplicants[index].coapplicantid;
        }

        $log.info("Inside submit()");
        PageHelper.showLoader();
        CreditBureau.reinitiateCBCheck({inqUnqRefNo:inqUnqRefNo}, function(response){
            var retryStatus = response.status;
            if (customerType == 'APP'){
                model.customer.highmarkStatus = response.status;
            }
            else if(customerType == 'CO-APP'){
                model.customer.coapplicants[index].highmarkStatus = response.status;
            }
            if(retryStatus == 'SUCCESS' || retryStatus == 'PROCESSED'){
                PageHelper.showProgress("cb-check", "Credit Bureau Request Placed..", 5000);
                BundleManager.pushEvent('cb-check-done', model._bundlePageObj, {cbcustomer: model.customerId})
            }
            else if(retryStatus == 'ERROR' || retryStatus == 'Error'){
                PageHelper.showProgress("cb-check", "Error while placing retry Request", 5000);
            }
            PageHelper.hideLoader();
        }, function(errorResponse){
            PageHelper.hideLoader();
            if(errorResponse && errorResponse.data && errorResponse.data.error)
                PageHelper.showProgress("cb-check", errorResponse.data.error, 5000);
            else
                PageHelper.showProgress("cb-check", "Failed while placing retry Request", 5000);
        });
    }

    return {
        "type": "schema-form",
        "title": "CB_CHECK",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {

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
                            model.customer.loanPurpose1 = model.loanAccount.loanPurpose1;
                            model.customer.loanSaved = true;
                        }
                        else if(model.loanAccount.loanCustomerRelations[i].relation == 'Co-Applicant'){
                            Enrollment.getCustomerById({id:model.loanAccount.loanCustomerRelations[i].customerId})
                            .$promise
                            .then(function(res){
                                model.customer.coapplicants.push({
                                "coapplicantid":res.id,
                                "coapplicantname":res.firstName,
                                "loanAmount":model.loanAccount.loanAmountRequested,
                                "loanPurpose1":model.loanAccount.loanPurpose1});
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
            if (bundlePageObj){
                model._bundlePageObj = _.cloneDeep(bundlePageObj);
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
                var recordExists = false;
                for (var i = model.customer.coapplicants.length - 1; i >= 0; i--) {
                    if(model.customer.coapplicants[i].coapplicantid == params.customer.id)
                        recordExists = true;
                }
                if(!recordExists){
                    model.customer.coapplicants.push({
                                    "coapplicantid":params.customer.id,
                                    "coapplicantname":params.customer.firstName});
                }
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
                                "onClick": "actions.save(model,'APP','CIBIL', null)"
                            },
                            { 
                                "key":"customer.cibilStatus",
                                "condition":"model.customer.cibilStatus",
                                readonly:true,
                                title: "Status"
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
                                    key:"customer.coapplicants[].cibilbutton",
                                    title: 'Submit for CBCheck',
                                    "condition":"model.customer.loanSaved && model.customer.coapplicants.length",
                                    "onClick": function(model, schemaForm, form, event) {
                                        fnPost(model,'CO-APP','CIBIL',event.arrayIndex);
                                    }
                                },
                                { 
                                    "key":"customer.coapplicants[].cibilStatus",
                                    "condition":"model.customer.coapplicants[arrayIndex].cibilStatus",
                                    readonly:true,
                                    title: "Status"
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
                                "onClick": "actions.save(model,'APP', 'BASE',null)"
                            },
                            { 
                                "key":"customer.highmarkStatus",
                                "condition":"model.customer.highmarkStatus",
                                readonly:true,
                                title: "Status"
                            },
                            { 
                                type: 'button',
                                title: 'Retry',
                                "condition":"model.customer.applicantHighmarkFailed",
                                "onClick": function(model, schemaForm, form, event) {
                                    retry(model,'APP',null);
                                }
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
                                    key:"customer.coapplicants[].highmarkbutton",
                                    title: 'Submit for CBCheck',
                                    "condition":"model.customer.loanSaved && model.customer.coapplicants.length",
                                    "onClick": function(model, schemaForm, form, event) {
                                        fnPost(model,'CO-APP','BASE',event.arrayIndex);
                                    }
                                },
                                { 
                                    "key":"customer.coapplicants[].highmarkStatus",
                                    "condition":"model.customer.coapplicants[arrayIndex].highmarkStatus",
                                    readonly:true,
                                    title: "Status"
                                },
                                { 
                                    type: 'button',
                                    key:"customer.coapplicants[].retrybutton",
                                    title: 'Retry',
                                    "condition":"model.customer.coapplicants[arrayIndex].applicantHighmarkFailed",
                                    "onClick": function(model, schemaForm, form, event) {
                                        retry(model,'CO-APP',event.arrayIndex);
                                    }
                                }]
                            }
                            ]
                        }
                            
            
        ],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            save: function(model,customerType, CBType, index){
                fnPost(model,customerType, CBType, index);
            }
        }

    };
}

]);
