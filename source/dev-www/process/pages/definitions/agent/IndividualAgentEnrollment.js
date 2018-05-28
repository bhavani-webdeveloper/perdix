define(['perdix/domain/model/customer/EnrolmentProcess', 'perdix/domain/model/agent/AgentProcess'], function(EnrolmentProcess, AgentProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    AgentProcess = AgentProcess['AgentProcess'];

    return {
        pageUID: "agent.IndividualAgentEnrollment",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector", "UIRepository"
        ],

        $pageFn: function($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
            PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector, UIRepository) {

            var self;
            var branch = SessionStore.getBranch();
            var pageParams = {
                readonly: true
            };

             var overridesFields = function(bundlePageObj) {
                return {                   
                    "AgentInformation.customerId": {
                        type: "lov",
                        lovonly: true,
                        bindMap: {},
                        key: "customer.id",
                        "inputMap": {
                            "firstName": {
                                "key": "customer.firstName",
                                "title": "CUSTOMER_NAME"
                            },
                            "urnNo": {
                                "key": "customer.urnNo",
                                "title": "URN_NO",
                                "type": "string"
                            },
                            "customerBranchId": {
                                "key": "customer.customerBranchId",
                                "type": "select",
                                "screenFilter": true,
                                "readonly": true
                            },
                            "centreName": {
                                "key": "customer.place",
                                "title": "CENTRE_NAME",
                                "type": "string",
                                "readonly": true,

                            },
                            "centreId": {
                                key: "customer.centreId",
                                type: "lov",
                                autolov: false,
                                lovonly: true,
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var centres = SessionStore.getCentres();
                                    var centreCode = formHelper.enum('centre').data;
                                    var out = [];
                                    if (centres && centres.length) {
                                        for (var i = 0; i < centreCode.length; i++) {
                                            for (var j = 0; j < centres.length; j++) {
                                                if (centreCode[i].value == centres[j].id) {

                                                    out.push({
                                                        name: centreCode[i].name,
                                                        id: centreCode[i].value
                                                    })
                                                }
                                            }
                                        }
                                    }
                                    return $q.resolve({
                                        headers: {
                                            "x-total-count": out.length
                                        },
                                        body: out
                                    });
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.centreId = valueObj.id;
                                    model.centreName = valueObj.name;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.name
                                    ];
                                }
                            },
                        },
                        "outputMap": {
                            "urnNo": "customer.urnNo",
                            "firstName": "customer.firstName"
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var branches = formHelper.enum('branch_id').data;
                            var branchName;
                            for (var i = 0; i < branches.length; i++) {
                                if (branches[i].code == inputModel.customerBranchId)
                                    branchName = branches[i].name;
                            }
                            var promise = Enrollment.search({
                                'branchName': branchName || SessionStore.getBranch(),
                                'firstName': inputModel.firstName,
                                'centreId': inputModel.centreId,
                                'customerType': "individual",
                                'urnNo': inputModel.urnNo
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                [data.firstName, data.fatherFirstName].join(' | '),
                                data.firstName,
                                data.urnNo
                            ];
                        },
                        onSelect: function(valueObj, model, context) {
                            PageHelper.showProgress('customer-load', 'Loading customer...');
                            EnrolmentProcess.fromCustomerID(valueObj.id)
                                .finally(function() {
                                    PageHelper.showProgress('customer-load', 'Done.', 5000);
                                })
                                .subscribe(function(enrolmentProcess) {
                                    /* Setting on the current page */
                                     model.enrolmentProcess = enrolmentProcess;
                                    model.customer = enrolmentProcess.customer;

                                    BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                                })
                        }
                    }
                }
            }

            var getIncludes = function(model) {

                return [
                    "AgentInformation",
                    "AgentInformation.agentId",
                    "AgentInformation.customerId",
                    "AgentInformation.agentCompanyId",
                    "AgentInformation.agentRegistrationNumber",
                    "AgentInformation.agentType",
                    "AgentInformation.companyName",

                    "AgentFeeDetails",
                    "AgentFeeDetails.agentFeeDetails",
                    "AgentFeeDetails.agentFeeDetails.feeAmount",
                    "AgentFeeDetails.agentFeeDetails.feeName",
                    "AgentFeeDetails.agentFeeDetails.feeType",
                    "AgentFeeDetails.agentFeeDetails.frequency",
                    "AgentFeeDetails.agentFeeDetails.dateOfIncorporation"
                ];

            }

            function getLoanCustomerRelation(pageClass) {

            }

            return {
                "type": "schema-form",
                "title": "INDIVIDUAL_ENROLLMENT",
                "subTitle": "",
                initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }
                    /* Setting data recieved from Bundle */
                    model.pageClass = bundlePageObj.pageClass;
                    // model.currentStage = bundleModel.currentStage;
                    /* End of setting data recieved from Bundle */

                    /* Setting data for the form */
                    model.customer = model.agentProcess.customer;
                    /* End of setting data for the form */


                    $log.info(model.customer);
                    $log.info("model.customer");


                    /* Form rendering starts */
                    self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": {
                                "AgentInformation": {
                                    "type": "box",
                                    "title": "PERSIONAL_INFORMATION",
                                    "orderNo": 10,
                                    "items": {
                                        "customerId": {
                                            "key": "customer.id",
                                            "title": "CUSTOMER_ID",
                                            "type": "lov",
                                            "lovonly": false
                                        }
                                    }
                                }
                            },
                            "additions": [{
                                "type": "actionbox",
                                // "condition": "model.customer.id",
                                "orderNo": 1200,
                                "items": [{
                                    "type": "submit",
                                    "title": "SUBMIT"
                                }]
                            }, {
                                "type": "actionbox",
                                // "condition": "model.customer.currentStage && model.customer.id",
                                "orderNo": 1200,
                                "items": [{
                                    "type": "button",
                                    "title": "PROCEED",
                                    "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                }]
                            }]
                        }
                    }

                    UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function(repo) {
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, null, model)
                        })
                        .then(function(form) {
                            self.form = form;
                        });

                    /* Form rendering ends */
                },

                preDestroy: function(model, form, formCtrl, bundlePageObj, bundleModel) {
                    // console.log("Inside preDestroy");
                    // console.log(arguments);
                    if (bundlePageObj) {
                        var enrolmentDetails = {
                                'customerId': model.customer.id,
                                'customerClass': bundlePageObj.pageClass,
                                'firstName': model.customer.firstName
                            }
                            // BundleManager.pushEvent('new-enrolment',  {customer: model.customer})
                        BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails)
                    }
                    return $q.resolve();
                },
                eventListeners: {
                    "test-listener": function(bundleModel, model, obj) {

                    },
                    // "lead-loaded": function(bundleModel, model, obj) {

                    //     return $q.when()
                    //         .then(function() {
                    //             if (obj.applicantCustomerId) {
                    //                 return AgentProcess.fromCustomerID(obj.applicantCustomerId).toPromise();
                    //             } else {
                    //                 return null;
                    //             }
                    //         })
                    //         .then(function(agentProcess) {
                    //             if (agentProcess != null) {
                    //                 model.agentProcess = agentProcess;
                    //                 model.customer = agentProcess.customer;
                    //                 model.loanProcess.setRelatedCustomerWithRelation(agentProcess, model.loanCustomerRelationType);
                    //                 BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, agentProcess);
                    //             }
                    //             if (obj.leadCategory == 'Existing' || obj.leadCategory == 'Return') {
                    //                 model.customer.existingLoan = 'YES';
                    //             } else {
                    //                 model.customer.existingLoan = 'NO';
                    //             }
                    //             model.customer.mobilePhone = obj.mobileNo;
                    //             model.customer.gender = obj.gender;
                    //             model.customer.firstName = obj.leadName;
                    //             model.customer.maritalStatus = obj.maritalStatus;
                    //             model.customer.customerBranchId = obj.branchId;
                    //             model.customer.centreId = obj.centreId;
                    //             model.customer.centreName = obj.centreName;
                    //             model.customer.street = obj.addressLine2;
                    //             model.customer.doorNo = obj.addressLine1;
                    //             model.customer.pincode = obj.pincode;
                    //             model.customer.district = obj.district;
                    //             model.customer.state = obj.state;
                    //             model.customer.locality = obj.area;
                    //             model.customer.villageName = obj.cityTownVillage;
                    //             model.customer.landLineNo = obj.alternateMobileNo;
                    //             model.customer.dateOfBirth = obj.dob;
                    //             model.customer.age = moment().diff(moment(obj.dob, SessionStore.getSystemDateFormat()), 'years');
                    //             model.customer.gender = obj.gender;
                    //             model.customer.referredBy = obj.referredBy;
                    //             model.customer.landLineNo = obj.alternateMobileNo;
                    //             model.customer.landmark = obj.landmark;
                    //             model.customer.postOffice = obj.postOffice;


                    //         })

                    // },
                    "origination-stage": function(bundleModel, model, obj) {
                        model.currentStage = obj
                    }
                },
                offline: false,
                getOfflineDisplayItem: function(item, index) {
                    return [
                        item.customer.urnNo,
                        Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                        item.customer.villageName
                    ]
                },
                form: [],
                schema: function() {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    setProofs: function(model) {
                        model.customer.addressProofNo = model.customer.aadhaarNo;
                        model.customer.identityProofNo = model.customer.aadhaarNo;
                        model.customer.identityProof = 'Aadhar card';
                        model.customer.addressProof = 'Aadhar card';
                        model.customer.addressProofSameAsIdProof = true;
                        if (model.customer.yearOfBirth) {
                            model.customer.dateOfBirth = model.customer.yearOfBirth + '-01-01';
                        }
                    },
                    preSave: function(model, form, formName) {
                        var deferred = $q.defer();
                        if (model.customer.firstName) {
                            deferred.resolve();
                        } else {
                            PageHelper.showProgress('enrollment', 'Customer Name is required', 3000);
                            deferred.reject();
                        }
                        return deferred.promise;
                    },
                    reload: function(model, formCtrl, form, $event) {
                        $state.go("Page.Engine", {
                            pageName: 'customer.IndividualEnrollment',
                            pageId: model.customer.id
                        }, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    },
                    proceed: function(model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.agentProcess.proceed()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(agentProcess) {
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, agentProcess);
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    },
                    submit: function(model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.agentProcess.save()
                            .finally(function() {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function(agentProcess) {
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model.pageClass + "-updated", model._bundlePageObj, agentProcess);
                                model.agentProcess.proceed()
                                    .subscribe(function(agentProcess) {
                                        PageHelper.showProgress('enrolment', 'Done.', 5000);
                                    }, function(err) {
                                        PageHelper.showErrors(err);
                                        PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                    })
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });
                    }
                }
            }
        }
    }
});