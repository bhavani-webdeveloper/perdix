

irf.pageCollection.factory(irf.page("customer360.Idencheck"),
["$log", "$q","LoanAccount", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch","CreditBureau","Enrollment","BundleManager",
function($log, $q, LoanAccount, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch,CreditBureau,Enrollment,BundleManager){

    var branch = SessionStore.getBranch();

    var fnPost = function(model, CBType){
        

        $log.info("Inside submit()");
        PageHelper.showLoader();
        loanPurpose = 'Business Loan - General';
        //loanPurpose = 'Agriculture';
        PageHelper.clearErrors();
            model.idenCheck.customerId =  $stateParams.pageId;
            model.idenCheck.type = CBType;
            Enrollment.idenCheckVerification(model.idenCheck).$promise.
            then(function(response) {
                checkResponse(response, model, CBType);
            }, function(error) {
                PageHelper.showErrors(error);
                PageHelper.hideLoader();
            })   
    }
    var checkResponse = function(response,model, CBType){
            if(CBType == 'CHMHUB'){
                    model.customer.inqUnqRefNo = response.inqUnqRefNo;
                    model.customer.idenCheckStatus = response.status;
                    if(response.status != 'SUCCESS' && response.status != 'PROCESSED')
                        model.customer.applicantIdenCheckFailed = true;
                    else
                        model.customer.applicantIdenCheckFailed = false;

            }
            if(response.status == 'SUCCESS' || response.status == 'PROCESSED'){
                PageHelper.showProgress("cb-check", "Idencheck Request Placed..", 5000);
               // BundleManager.pushEvent('cb-check-done', model._bundlePageObj, {customerId: $stateParams.pageId, cbType:CBType})
            }
            else if(response.status == 'ERROR' || response.status == 'Error'){
                PageHelper.showProgress("Idencheck", "Error while placing Idencheck Resuest Request", 5000);
            }
            PageHelper.hideLoader();
    }

    var retry = function(model, customerType, index){
        var inqUnqRefNo;
        var customerId;
     
            inqUnqRefNo = model.customer.inqUnqRefNo;
            customerId = model.customer.applicantid;
        $log.info("Inside submit()");
        PageHelper.showLoader();
        PageHelper.clearErrors();
        CreditBureau.reinitiateCBCheck({inqUnqRefNo:inqUnqRefNo}, function(response){
            var retryStatus = response.status;
                model.customer.highmarkStatus = response.status;
                if(response.status != 'SUCCESS' && response.status != 'PROCESSED')
                    model.customer.applicantHighmarkFailed = true;
                else
                    model.customer.applicantHighmarkFailed = false;
            
            if(retryStatus == 'SUCCESS' || retryStatus == 'PROCESSED'){
                PageHelper.showProgress("cb-check", "Credit Bureau Request Placed..", 5000);
                BundleManager.pushEvent('cb-check-done', model._bundlePageObj, {customerId: customerId, cbType:'BASE'})
            }
            else if(retryStatus == 'ERROR' || retryStatus == 'Error'){
                PageHelper.showProgress("cb-check", "Error while placing retry Request", 5000);
            }
            PageHelper.hideLoader();
        }, function(errorResponse){
            PageHelper.hideLoader();
            PageHelper.showErrors(errorResponse);
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

            if (bundlePageObj){
                model._bundlePageObj = _.cloneDeep(bundlePageObj);
            }
            Enrollment.getCustomerById({
                    id: $stateParams.pageId
                })
                .$promise
                .then(function(res) {
                    model.customer.applicantname = res.firstName;
                }, function(httpRes) {
                    PageHelper.showErrors(httpRes);
                })
                .finally(function() {
                    PageHelper.hideLoader();
                })

            model.customer = model.customer || {};
            model.customer.loanSaved = false;
            model.idenCheckParam = SessionStore.getGlobalSetting("IdentCheckSettings");
            model.idenCheck = {};
            model.idenCheck.reqServiceType = model.idenCheckParam.split('~')[0];
            model.idenCheck.dobSegmentRequired = Boolean(model.idenCheckParam.split('~')[1]);
            model.idenCheck.addressSegmentReqired = Boolean(model.idenCheckParam.split('~')[2]);
            model.CHMHUB = true;

            model.CBType= SessionStore.getGlobalSetting("CBCheckType");
            if(model.CBType){
                model.CBType=JSON.parse((model.CBType).replace(/'/g, '"'));
            }
            //model.CBType = JSON.parse(SessionStore.getGlobalSetting("CBCheckType").replace(/'/g, '"'));
            // if (model.CBType && model.CBType.length) {
            //     for (i in model.CBType) {
            //         (model.CBType[i] == "CIBIL")?model.CIBIL = true:(model.CBType[i] == "BASE"?model.BASE = true:(model.CBType[i] == "EQUIFAX"?model.EQUIFAX = true:(model.CBType[i] == "CHMHUB"?model.CHMHUB=true:false)));
            //     }
            // } else {
            //     model.CHMHUB = true;
            //     model.BASE = true;
            // }

            // if (_.hasIn(model, 'loanAccount')){
            //     if (model.loanAccount.loanCustomerRelations && model.loanAccount.loanCustomerRelations.length >0){

            //         for (var i = model.loanAccount.loanCustomerRelations.length - 1; i >= 0; i--) {
            //             if(model.loanAccount.loanCustomerRelations[i].relation == 'Applicant'){
            //                 PageHelper.showLoader();
            //                 Enrollment.getCustomerById({id:model.loanAccount.loanCustomerRelations[i].customerId})
            //                 .$promise
            //                 .then(function(res){
            //                     model.customer.applicantname = res.firstName;
            //                     if(res && res.cbCheckList && res.cbCheckList.length >0){
            //                         for(x=0;x<res.cbCheckList.length;x++){
            //                             if(res.cbCheckList[x].cbCheckValid){
            //                                 BundleManager.pushEvent('cb-check-done', model._bundlePageObj, {customerId: res.cbCheckList[x].customerId, cbType:res.cbCheckList[x].reportType});
            //                                 if(res.cbCheckList[x].reportType=='BASE' 
            //                                     || res.cbCheckList[x].reportType=='AOR'
            //                                     || res.cbCheckList[x].reportType=='INDIVIDUAL')
            //                                     model.customer.highmarkStatus = 'PROCESSED';
            //                                 else if(res.cbCheckList[x].reportType=='CIBIL')
            //                                     model.customer.cibilStatus = 'PROCESSED';
            //                             }
            //                         }
            //                     }
            //                 }, function(httpRes){
            //                     PageHelper.showErrors(httpRes);
            //                 })
            //                 .finally(function(){
            //                     PageHelper.hideLoader();
            //                 })
            //                 model.customer.applicantid = model.loanAccount.loanCustomerRelations[i].customerId;
            //                 model.customer.loanAmount = model.loanAccount.loanAmountRequested;
            //                 model.customer.loanPurpose1 = model.loanAccount.loanPurpose1;
            //                 model.customer.loanSaved = true;
            //             }
                        
            //         }

            //     }
            // }
        },
        // eventListeners: {
        //     "new-applicant": function(bundleModel, model, params){
        //         $log.info("Inside new-applicant of CBCheck");
        //         model.customer.applicantname = params.customer.firstName;
        //         model.customer.applicantid = params.customer.id;
        //         model.customer.loanAmount = '';
        //         model.customer.loanPurpose1 = '';
        //         /* Assign more customer information to show */
        //     },
        //     "new-co-applicant": function(bundleModel, model, params){
        //         $log.info("Insdie new-co-applicant of CBCheck");
        //         var recordExists = false;
        //         for (var i = model.customer.coapplicants.length - 1; i >= 0; i--) {
        //             if(model.customer.coapplicants[i].coapplicantid == params.customer.id)
        //                 recordExists = true;
        //         }
        //         if(!recordExists){
        //             model.customer.coapplicants.push({
        //                             "coapplicantid":params.customer.id,
        //                             "coapplicantname":params.customer.firstName});
        //         }
        //     },
        //     "new-guarantor": function(bundleModel, model, params){
        //         $log.info("Insdie new-new-guarantor of CBCheck");
        //         var recordExists = false;
        //         for (var i = model.customer.guarantors.length - 1; i >= 0; i--) {
        //             if(model.customer.guarantors[i].guarantorid == params.customer.id)
        //                 recordExists = true;
        //         }
        //         if(!recordExists){
        //             model.customer.guarantors.push({
        //                             "guarantorid":params.customer.id,
        //                             "guarantorname":params.customer.firstName});
        //         }
        //     },
        //     "new-loan": function(bundleModel, model, params){
        //         $log.info("Inside new-loan of CBCheck");
        //         model.customer.loanSaved = true;
        //         model.customer.loanAmount = params.loanAccount.loanAmountRequested;
        //         model.customer.loanPurpose1 = params.loanAccount.loanPurpose1;
        //         for (var i = model.customer.coapplicants.length - 1; i >= 0; i--) {
        //             model.customer.coapplicants[i].loanAmount = params.loanAccount.loanAmountRequested;
        //             model.customer.coapplicants[i].loanPurpose1 = params.loanAccount.loanPurpose1;
        //         }
        //         for (var i = model.customer.guarantors.length - 1; i >= 0; i--) {
        //             model.customer.guarantors[i].loanAmount = params.loanAccount.loanAmountRequested;
        //             model.customer.guarantors[i].loanPurpose1 = params.loanAccount.loanPurpose1;
        //         }
        //     },
        //     "remove-customer-relation": function(bundleModel, model, enrolmentDetails){
        //         $log.info("Inside remove-customer-relation of CBCheck");
        //         if (enrolmentDetails.customerClass == 'co-applicant'){
        //             _.remove(model.customer.coapplicants, function(g){
        //                 if (g.coapplicantid == enrolmentDetails.customerId){
        //                     return true;
        //                 }
        //                 return false;
        //             })
        //         } else if (enrolmentDetails.customerClass == 'applicant'){
        //             model.customer.applicantname = null;
        //             model.customer.applicantid = null;
        //         } else if (enrolmentDetails.customerClass == 'guarantor'){
        //             _.remove(model.customer.guarantors, function(g){
        //                 if (g.guarantorid == enrolmentDetails.customerId){
        //                     return true;
        //                 }
        //                 return false;
        //             })
        //         }
        //     }
        // },
        
        form: [
            {
                "type": "box",
                "items": [
                            {
                                type: "fieldset",
                                title: "IDENCHECK",
                                items: [{
                                        key: "customer.applicantname",
                                        title: "ApplicantName",
                                        readonly: true,
                                        type: "string",
                                    }, {
                                        type: 'button',
                                        title: 'Submit for CBCheck',
                                        "onClick":"actions.save(model,'CHMHUB')"
                                       
                                    }, {
                                        "key": "customer.idenCheckStatus",
                                        "condition": "model.customer.idenCheckStatus",
                                        readonly: true,
                                        title: "Status"
                                    }, {
                                        type: 'button',
                                        title: 'Retry',
                                        "condition": "model.customer.applicantIdenCheckFailed",
                                        "onClick": function(model, schemaForm, form, event) {
                                            retry(model, 'APP', null);
                                        }
                                    } 
                                ]
                            },   
                        ]
            }   
        ],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            save: function(model, CBType) {

                fnPost(model, CBType);
            }
        }

    };
}

]);
    