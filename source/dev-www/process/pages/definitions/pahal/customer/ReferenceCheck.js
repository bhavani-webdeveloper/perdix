define(
    [ "perdix/domain/model/loan/LoanProcess",
        "perdix/infra/helpers/NGHelper"
    ], function (LoanProcess, NGHelper) {
        LoanProcess = LoanProcess["LoanProcess"];
        NGHelper = NGHelper["NGHelper"];
    return {
        pageUID: "pahal.customer.ReferenceCheck",
        pageType: "Engine",
        dependencies: ["$log", "$q","Enrollment","IrfFormRequestProcessor", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "$filter", "UIRepository"],

        $pageFn: function ($log, $q, Enrollment,IrfFormRequestProcessor, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager, $filter, UIRepository) {


            var getIncludes = function (model) {
                    return [
                        "Reference",
                        "Reference.Verifications",
                        "Reference.Verifications",
                        "Reference.Verifications.referenceFirstName",
                        "Reference.Verifications.mobileNo",
                        "Reference.Verifications.occupation",
                        "Reference.Verifications.occupation",
                        "Reference.Verifications.address",
                        "Reference.Verifications.referenceCheck",
                        "Reference.Verifications.referenceCheck.knownSince",
                        "Reference.Verifications.referenceCheck.relationship",
                        "Reference.Verifications.referenceCheck.opinion",
                        "Reference.Verifications.referenceCheck.financialStatus",
                        "Reference.Verifications.referenceCheck.customerResponse",
                        "actionbox",
                        "actionbox.save"
                    ]
            }



            return {
                "type": "schema-form",
                "title": "ENTITY_ENROLLMENT",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {



                    model.pageClass = bundlePageObj.pageClass;
                    model.currentStage = bundleModel.currentStage;
                    /* End of setting data recieved from Bundle */

                    /* Setting data for the form */
                    model.customer = model.enrolmentProcess.customer;
                    /* End of setting data for the form */

                    var self = this;
                    var formRequest = {
                        "overrides": "",
                        "includes": getIncludes(model),
                        "excludes": [
                            "",
                        ]
                    };
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;

                    p1.then(function(repo) {
                        self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, null, model);
                    })


                },
                offline: false,
                getOfflineDisplayItem: function(item, index){
                    return [
                        item.customer.firstName,
                        item.customer.centreId,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "new-applicant": function(bundleModel, model, params){
                        $log.info("Inside new-applicant of EnterpriseEnrollment");

                        var addToRelation = true;
                        for (var i=0;i<model.customer.enterpriseCustomerRelations.length; i++){
                            if (model.customer.enterpriseCustomerRelations[i].linkedToCustomerId == params.customer.id) {
                                addToRelation = false;
                                break;
                            }
                        }
                        if (addToRelation){
                            var newLinkedCustomer = {
                                "linkedToCustomerId": params.customer.id,
                                "linkedToCustomerName": params.customer.firstName
                            };

                            model.customer.enterpriseCustomerRelations.push(newLinkedCustomer);
                        }
                    },
                    "lead-loaded": function(bundleModel, model, obj){
                        $log.info(obj);
                                    model.customer.mobilePhone = obj.mobileNo;
                                    model.customer.gender = obj.gender;
                                    model.customer.firstName = obj.businessName;
                                    model.customer.maritalStatus=obj.maritalStatus;
                                    model.customer.customerBranchId=obj.branchId;
                                    model.customer.centreId=obj.centreId;
                                    model.customer.centreName=obj.centreName;
                                    model.customer.street=obj.addressLine2;
                                    model.customer.doorNo=obj.addressLine1;
                                    model.customer.pincode=obj.pincode;
                                    model.customer.district=obj.district;
                                    model.customer.state=obj.state;
                                    model.customer.locality=obj.area;
                                    model.customer.villageName=obj.cityTownVillage;
                                    model.customer.landLineNo=obj.alternateMobileNo;
                                    model.customer.dateOfBirth=obj.dob;
                                    model.customer.age=obj.age;
                                    model.customer.mobilePhone = obj.mobileNo;
                                    model.customer.latitude =obj.location;
                                    if (!_.hasIn(model.customer, 'enterprise') || model.customer.enterprise==null){
                                        model.customer.enterprise = {};
                                    }
                                    model.customer.enterprise.ownership =obj.ownership;
                                    model.customer.enterprise.companyOperatingSince =obj.companyOperatingSince;
                                    model.customer.enterprise.companyRegistered =obj.companyRegistered;
                                    model.customer.enterprise.businessType =obj.businessType;
                                    model.customer.enterprise.businessActivity=obj.businessActivity;
                                },
                    "new-co-applicant": function(bundleModel, model, params){
                        $log.info("Inside new co-applicant of EnterpriseEnrollment");

                        var addToRelation = true;
                        for (var i=0;i<model.customer.enterpriseCustomerRelations.length; i++){
                            if (model.customer.enterpriseCustomerRelations[i].linkedToCustomerId == params.customer.id) {
                                addToRelation = false;
                                break;
                            }
                        }
                        if (addToRelation){
                            var newLinkedCustomer = {
                                "linkedToCustomerId": params.customer.id,
                                "linkedToCustomerName": params.customer.firstName
                            };

                            model.customer.enterpriseCustomerRelations.push(newLinkedCustomer);
                        }
                    },
                    "new-guarantor": function(bundleModel, model, params){
                        $log.info("Inside new guarantor of EnterpriseEnrollment");

                        var addToRelation = true;
                        for (var i=0;i<model.customer.enterpriseCustomerRelations.length; i++){
                            if (model.customer.enterpriseCustomerRelations[i].linkedToCustomerId == params.customer.id) {
                                addToRelation = false;
                                break;
                            }
                        }
                        if (addToRelation){
                            var newLinkedCustomer = {
                                "linkedToCustomerId": params.customer.id,
                                "linkedToCustomerName": params.customer.firstName
                            };

                            model.customer.enterpriseCustomerRelations.push(newLinkedCustomer);
                        }
                    },
                    "origination-stage": function(bundleModel, model, obj){
                        model.currentStage = obj
                    },
                    "remove-customer-relation": function(bundleModel, model, enrolmentDetails){
                        $log.info("Inside remove-customer-relation of EnterpriseEnrolment2");
                        /**
                         * Following to be Done
                         *
                         * 1. Remove customer from Enterprise Customer Relation if exists.
                         */

                        _.remove(model.customer.enterpriseCustomerRelations, function(relation){
                            return relation.linkedToCustomerId==enrolmentDetails.customerId;
                        })
                    }
                },

                form: [],

                schema: function() {
                    return Enrollment.getSchema().$promise;
                },
                actions: {

                    save: function(model, formCtrl, formName) {
                        PageHelper.showProgress('enrolment', 'Updating Loan');
                        PageHelper.showLoader();
                        model.enrolmentProcess.save()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(val) {
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            })
                    }
                }
            };
        }
    }
});
