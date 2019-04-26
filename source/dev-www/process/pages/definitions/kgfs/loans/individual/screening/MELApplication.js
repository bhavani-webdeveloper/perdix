define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/infra/api/AngularResourceService'], function (EnrolmentProcess, AngularResourceService) {
    var EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
            var branchIDArray = [];
    return {
        pageUID: "kgfs.loans.individual.screening.MELApplication",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository","Maintenance","AuthTokenHelper","irfNavigator"],

        $pageFn: function ($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                           PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository,Maintenance,AuthTokenHelper,irfNavigator) {

            AngularResourceService.getInstance().setInjector($injector);
            var branch = SessionStore.getBranch();


            var configFile = function () {
                return {
                }
            }

             function getLoanCustomerRelation(pageClass){
                switch (pageClass){
                    case 'applicant':
                        return 'Applicant';
                        break;
                    case 'co-applicant':
                        return 'Co-Applicant';
                        break;
                    case 'guarantor':
                        return 'Guarantor';
                        break;
                    default:
                        return null;
                }
            }

            var overridesFields = function (model) {

                return {
                    "IndividualInformation":{
                        "title":"CUSTOMER_DETAILS"
                    },
                    "IndividualInformation.firstName":{
                        "title":"CUSTOMER_NAME",
                        "required":false,
                        "orderNo":10,
                        "readonly":true
                    },
                    "IndividualInformation.urnNo":{
                        "title":"URN_NO",
                        "readonly":true
                    },
                    "DownloadMELApplicationForm.downloadMELApplicationFormName":{
                        "required":true
                    }
                }

            }
            var getIncludes = function (model) {

                return [
                    "IndividualInformation",
                    "IndividualInformation.firstName",                    
                    "IndividualInformation.urnNo",
                    "DownloadMELApplicationForm",
                    "DownloadMELApplicationForm.downloadMELApplicationFormFieldSet",
                    "DownloadMELApplicationForm.downloadMELApplicationForm",                    
                    "UploadMELApplicationForm",
                    "UploadMELApplicationForm.uploadMELApplicationFormFieldSet",
                    "UploadMELApplicationForm.uploadMELApplicationForm",
                    "PostReview",
                    "PostReview.action",
                    "PostReview.proceed",
                    "PostReview.proceed.remarks",
                    "PostReview.proceed.proceedButton",
                    "PostReview.sendBack",
                    "PostReview.sendBack.remarks",
                    "PostReview.sendBack.stage",
                    "PostReview.sendBack.sendBackButton",
                    "PostReview.reject",
                    "PostReview.reject.remarks",
                    "PostReview.reject.rejectReason",
                    "PostReview.reject.rejectButton",
                    
                ];

            }

            return {
                "type": "schema-form",
                "title": "MEL_APPLICATION_FORM",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);

                    model.customer = {};
                    model.review = model.review|| {};
                    model.loanAccount = model.loanProcess.loanAccount;

                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    };
                    model.UIUDF = {
                        'family_fields': {}
                    };

                    /* Setting data recieved from Bundle */
                    model.loanCustomerRelationType =getLoanCustomerRelation(bundlePageObj.pageClass);
                    model.pageClass = bundlePageObj.pageClass;
                    model.currentStage = bundleModel.currentStage;
                    model.enrolmentProcess.currentStage =  model.currentStage;
                    /* End of setting data recieved from Bundle */

                    /* Setting data for the form */
                    model.customer = model.enrolmentProcess.customer;
                    var branchId = SessionStore.getBranchId();
                    if(branchId && !model.customer.customerBranchId)
                        {
                            model.customer.customerBranchId = branchId;
                    };

                    /* End of setting data for the form */
                    model.UIUDF.family_fields.dependent_family_member = 0;
                     _.each(model.customer.familyMembers, function(member) {
                        if (member.incomes && member.incomes.length == 0)
                            model.UIUDF.family_fields.dependent_family_member++;
                    });

                    if(model.customer.fcuStatus == 1){
                        model.customer.fcuStatu = true  
                    }
                    else{
                        model.customer.fcuStatu = false
                    }
                    PageHelper.hideLoader();
  
                    /* Setting data for the form */
                    model.customer = model.enrolmentProcess.customer;
                    var branchId = SessionStore.getBranchId();

                    model.authToken = AuthTokenHelper.getAuthData().access_token;
                    model.userLogin = SessionStore.getLoginname();
                    model.master = model.master || {};
                    model.uploadres = model.uploadres || {};

                    var promise = Maintenance.getMasterData().$promise;
                    promise.then(function(res) {
                        $log.info("hi printing");
                        $log.info(res);
                    })

                model.master.demandDate = model.master.demandDate || Utils.getCurrentDate();
                //model.achDemand.updateDemand = model.achDemand.updateDemand || [];
                for (var i = 0; i < formHelper.enum('branch_id').data.length; i++) {
                    branchIDArray.push(parseInt(formHelper.enum('branch_id').data[i].code));
                }
                            
                // model.loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, model.loanCustomerRelationType);

                if (_.hasIn(model, 'loanAccount.loanCustomerRelations') &&
                        model.loanAccount.loanCustomerRelations!=null &&
                        model.loanAccount.loanCustomerRelations.length > 0) {
                        var lcr = model.loanAccount.loanCustomerRelations;
                        var idArr = [];
                    for (var i=0;i<lcr.length;i++){
                        idArr.push(lcr[i].customerId);
                    }
                    Queries.getCustomerBasicDetails({'ids': idArr})
                    .then(function(result){
                        if (result && result.ids){
                             for (var i = 0; i < lcr.length; i++) {
                                var cust = result.ids[lcr[i].customerId];
                            if (cust) {
                                lcr[i].name = cust.first_name;
                             }
                        }
                     }
                     });
                    }

                    BundleManager.broadcastEvent('loan-account-loaded', {loanAccount: model.loanAccount}); 

                    /* End of setting data for the form */
                    model.UIUDF.family_fields.dependent_family_member = 0;
      

                    /* Form rendering starts */
                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [
                            "KYC.addressProofSameAsIdProof",
                        ],
                        "options": {
                            "repositoryAdditions": {
                                "DownloadMELApplicationForm":{
                                    "type":"box",
                                    "orderNo":20,
                                    "title":"DOWNLOAD_MEL_APPLICATION_FORM",
                                    "items":{
                                        "downloadMELApplicationFormFieldSet":{
                                            "type":"fieldset",
                                            "title":"DOWNLOAD_MEL_APPLICATION_FORM",
                                        },
                                        "downloadMELApplicationFormName":{
                                            "key": "master.uploadName",
                                            "title": "NAME",
                                            "type": "lov",
                                            autolov: true,
                                            bindMap: {},
                                            searchHelper: formHelper,
                                            search: function(inputModel, form, model) {
                                                return Maintenance.getMasterData().$promise;
                                            },
                                            getListDisplayItem: function(item, index) {
                                                return [
                                                    item.group,
                                                    item.name,
                                                    item.value,
                                                    item.template_file
                                                ];
                                            },
                                            onSelect: function(result, model, context) {
                                                $log.info(result);
                                                model.master.templateFile = result.template_file;
                                                model.master.uploadName = result.name;
                                                model.master.uploadNameValue = result.value;
                                            }
                                        },
                                        "downloadMELApplicationForm":{
                                            "type": "button",
                                            "title": "DOWNLOAD",
                                            "icon": "fa fa-download",
                                            "notitle": true,
                                            "readonly": false,

                                            "onClick": function(model, form, schemaForm, event) {
                                                Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=" + "applicant_details" + "&record_id=" + model.loanAccount.id+ "&display=content")
                                                // var fileId = irf.BI_BASE_URL + "/upload_template/" + model.master.templateFile;
                                                // Utils.downloadFile(fileId);
                                                //Utils.downloadFile(irf.MANAGEMENT_BASE_URL + "/forms/AllFormsDownload.php?record_id=" + model.loanAccount.id);
                                            }
                                        }
                                    }                                    
                                },
                                "UploadMELApplicationForm":{
                                    "type":"box",
                                    "orderNo":20,
                                    "title":"UPLOAD_MEL_APPLICATION_FORM",
                                    "items":{
                                        "uploadMELApplicationFormFieldSet":{
                                            "type":"fieldset",
                                            "title":"UPLOAD_MEL_APPLICATION_FORM",
                                        },
                                        "uploadMELApplicationForm":{
                                            "key": "loanAccount.documents[].documentId",
                                            type: "file",
                                            fileType: "application/pdf",
                                            category: "Loan",
                                            subCategory: "DOC1",
                                            "notitle": true,
                                            using: "scanner",
                                            required: true
                                        }
                                    }                                    
                                },
                                "PostReview": {
                                        "type": "box",
                                        "title": "POST_REVIEW",
                                        "condition": "model.loanAccount.id && model.loanAccount.isReadOnly!='Yes' && model.loanAccount.currentStage != 'Rejected'",
                                        "orderNo": 600,
                                        "items": {
                                            "action": {
                                                "key": "review.action",
                                                "type": "radios",
                                                "titleMap": {
                                                    "REJECT": "REJECT",
                                                    "SEND_BACK": "SEND_BACK",
                                                    "PROCEED": "PROCEED"
                                                }
                                            }, 
                                            "proceed": {
                                                "type": "section",
                                                "condition": "model.review.action=='PROCEED'",
                                                "items": {
                                                    "remarks": {
                                                        "title": "REMARKS",
                                                        "key": "loanProcess.remarks",
                                                        "type": "textarea",
                                                        "required": true
                                                    }, 
                                                    "proceedButton": {
                                                        "key": "review.proceedButton",
                                                        "type": "button",
                                                        "title": "PROCEED",
                                                        "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                                    }
                                                }
                                            },
                                            "sendBack": {
                                                "type": "section",
                                                "condition": "model.review.action=='SEND_BACK'",
                                                "items": {
                                                    "remarks": {
                                                        "title": "REMARKS",
                                                        "key": "loanProcess.remarks",
                                                        "type": "textarea",
                                                        "required": true
                                                    }, 
                                                   "stage": {
                                                        "key": "loanProcess.stage",
                                                        "required": true,
                                                        "type": "lov",
                                                        "title": "SEND_BACK_TO_STAGE",
                                                        "resolver": "KGFSSendBacktoStageLOVConfiguration"
                                                    }, 
                                                   "sendBackButton": {
                                                        "key": "review.sendBackButton",
                                                        "type": "button",
                                                        "title": "SEND_BACK",
                                                        "onClick": "actions.sendBack(model, formCtrl, form, $event)"
                                                    }
                                                }
                                            },
                                            "reject": {
                                                "type": "section",
                                                "condition": "model.review.action=='REJECT'",
                                                "items": {
                                                    "remarks": {
                                                        "title": "REMARKS",
                                                        "key": "loanProcess.remarks",
                                                        "type": "textarea",
                                                        "required": true
                                                    }, 
                                                    "rejectReason": {
                                                        "key": "loanAccount.rejectReason",
                                                        "type": "lov",
                                                        "autolov": true,
                                                        "required":true,
                                                        "title": "REJECT_REASON",
                                                        "resolver": "KGFSRejectReasonLOVConfiguration"
                                                    },
                                                    "rejectButton": {
                                                        "key": "review.rejectButton",
                                                        "type": "button",
                                                        "title": "REJECT",
                                                        "required": true,
                                                        "onClick": "actions.reject(model, formCtrl, form, $event)"
                                                    }
                                                }
                                            },
                                            "hold": {
                                                "type": "section",
                                                "condition": "model.review.action=='HOLD'",
                                                "items": {
                                                "remarks": {
                                                    "title": "REMARKS",
                                                    "key": "loanProcess.remarks",
                                                    "type": "textarea",
                                                    "required": true
                                                }, 
                                                "holdButton": {
                                                    "key": "review.holdButton",
                                                    "type": "button",
                                                    "title": "HOLD",
                                                    "required": true,
                                                    "onClick": "actions.holdButton(model, formCtrl, form, $event)"
                                                }
                                            }
                                            }
                                        }
                                    }
                            },
                            "additions": [
                                {
                                    "type": "actionbox",
                                    "condition": "!model.customer.currentStage",
                                    "orderNo": 1000,
                                    "items": [
                                        {
                                            "type": "submit",
                                            "title": "SUBMIT"
                                        }
                                    ]
                                },
                                {
                                    "type": "actionbox",
                                    "condition": "model.customer.currentStage && (model.currentStage=='KYC' || model.currentStage=='Appraisal' || (model.currentStage=='GuarantorAddition' && model.pageClass=='guarantor'))",
                                    "orderNo": 1200,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "UPDATE_ENROLMENT",
                                            "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                        }
                                    ]
                                }
                            ]
                        }
                    };

                    UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function(repo){
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function(form){
                            self.form = form;
                        });

                    /* Form rendering ends */
                },

                preDestroy: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // console.log("Inside preDestroy");
                    // console.log(arguments);
                    if (bundlePageObj) {
                        var enrolmentDetails = {
                            'customerId': model.customer.id,
                            'customerClass': bundlePageObj.pageClass,
                            'firstName': model.customer.firstName
                        }
                        // BundleManager.pushEvent('new-enrolment',  {customer: model.customer})
                        BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails);
                        model.loanProcess.removeRelatedEnrolmentProcess(model.enrolmentProcess, model.loanCustomerRelationType);
                    }
                    return $q.resolve();
                },
                eventListeners: {
                    "lead-loaded": function (bundleModel, model, obj) {
              
                        return $q.when()
                            .then(function(){
                                if (obj.applicantCustomerId){
                                    return EnrolmentProcess.fromCustomerID(obj.applicantCustomerId).toPromise();
                                } else {
                                    return null;
                                }
                            })
                            .then(function(enrolmentProcess){
                                if (enrolmentProcess!=null){
                                    model.enrolmentProcess = enrolmentProcess;
                                    model.customer = enrolmentProcess.customer;
                                    model.loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, model.loanCustomerRelationType);
                                    BundleManager.pushEvent(model.pageClass +"-updated", model._bundlePageObj, enrolmentProcess);
                                }
                                if(obj.leadCategory == 'Existing' || obj.leadCategory == 'Return') {
                                    model.customer.existingLoan = 'YES';
                                } else {
                                    model.customer.existingLoan = 'NO';
                                }
                                model.customer.mobilePhone = obj.mobileNo;
                                model.customer.gender = obj.gender;
                                model.customer.firstName = obj.leadName;
                                model.customer.maritalStatus = obj.maritalStatus;
                                model.customer.customerBranchId = obj.branchId;
                                model.customer.centreId = obj.centreId;
                                model.customer.centreName = obj.centreName;
                                model.customer.street = obj.addressLine2;
                                model.customer.doorNo = obj.addressLine1;
                                model.customer.pincode = obj.pincode;
                                model.customer.district = obj.district;
                                model.customer.state = obj.state;
                                model.customer.locality = obj.area;
                                model.customer.villageName = obj.cityTownVillage;
                                model.customer.landLineNo = obj.alternateMobileNo;
                                model.customer.dateOfBirth = obj.dob;
                                model.customer.age = moment().diff(moment(obj.dob, SessionStore.getSystemDateFormat()), 'years');
                                model.customer.gender = obj.gender;
                                model.customer.referredBy = obj.referredBy;
                                model.customer.landLineNo = obj.alternateMobileNo;
                                model.customer.landmark = obj.landmark;
                                model.customer.postOffice = obj.postOffice;

                          
                            })


                    },
                    "origination-stage": function (bundleModel, model, obj) {
                        model.currentStage = obj
                    }
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                    return [
                        item.customer.urnNo,
                        Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                        item.customer.villageName
                    ]
                },
                form: [],

                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    submit: function(model, formCtrl, form){
                        model.loanAccount.customerId=model.loanAccount.loanCustomerRelations[0].customerId;
                        /* Loan SAVE */
                        if (!model.loanAccount.id){
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }

                        if(!(validateCoGuarantor(model.additions.co_borrower_required,model.additions.number_of_guarantors,'validate',model.loanAccount.loanCustomerRelations,model)))
                            return false;
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        if(!savePolicies(model)){
                            PageHelper.showProgress('loan-process','Oops Some Error',2000);
                            return false;}
                        if(!(policyBasedOnLoanType(model.loanAccount.loanType,model))){
                            PageHelper.showProgress('loan-process','Oops Some Error',2000);
                            return false;}
                                                    
                        model.loanProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                BundleManager.pushEvent('new-loan', model._bundlePageObj, {loanAccount: model.loanAccount});                                    
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);

                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);                                
                                PageHelper.hideLoader();
                            });

                    },
                    holdButton: function(model, formCtrl, form, $event){
                        $log.info("Inside save()");
                         if (!model.loanAccount.id){
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }
                        model.loanAccount.status = "HOLD";
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.hold()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan hold.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });

                    },
                    sendBack: function(model, formCtrl, form, $event){                       
                        if ( model.loanProcess.remarks==null ||  model.loanProcess.remarks =="" ||  model.loanProcess.stage==null ||  model.loanProcess.stage==""){
                            PageHelper.showProgress("update-loan", "Send to Stage / Remarks is mandatory");
                            return false;
                        }
                        PageHelper.showLoader();
                        model.loanProcess.sendBack()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });
                    },
                    proceed: function(model, formCtrl, form, $event){
                        var trancheTotalAmount=0;

                        PageHelper.clearErrors();
                        if(PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                            return false;
                        }
                        PageHelper.showLoader();                   
                        PageHelper.showProgress('enrolment', 'Updating Loan');
                        model.loanProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });
                    },
                    reject: function(model, formCtrl, form, $event){
                        // if(PageHelper.isFormInvalid(formCtrl)) {
                        //     return false;
                        // }
                        if ( model.loanProcess.remarks==null ||  model.loanProcess.remarks =="" ||  model.loanAccount.rejectReason==null ||  model.loanAccount.rejectReason==""){
                            PageHelper.showProgress("update-loan", "Reject Reason / Remarks is mandatory");
                            return false;
                        }
                        PageHelper.showLoader();
                         model.loanProcess.reject()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                
                                PageHelper.hideLoader();
                            });
                    },
                    nomineeAddress: function(model, formCtrl, form, $event){
                        PageHelper.showLoader();
                        if(model.loanProcess.applicantEnrolmentProcess){
                            model.loanAccount.nominees[0].nomineeDoorNo=  model.loanProcess.applicantEnrolmentProcess.customer.doorNo;
                            model.loanAccount.nominees[0].nomineeLocality= model.loanProcess.applicantEnrolmentProcess.customer.locality;
                            model.loanAccount.nominees[0].nomineeStreet= model.loanProcess.applicantEnrolmentProcess.customer.street;
                            model.loanAccount.nominees[0].nomineePincode= model.loanProcess.applicantEnrolmentProcess.customer.pincode;
                            model.loanAccount.nominees[0].nomineeDistrict= model.loanProcess.applicantEnrolmentProcess.customer.district;
                            model.loanAccount.nominees[0].nomineeState = model.loanProcess.applicantEnrolmentProcess.customer.state;
                        }else
                        {
                            PageHelper.hideLoader();
                        }
                        PageHelper.hideLoader();
                    }
                }
            };
        }
    }
})
