define(['perdix/domain/model/lead/LeadProcess', 'perdix/infra/api/AngularResourceService'], function(LeadProcess, AngularResourceService) {
    LeadProcess = LeadProcess["LeadProcess"];

    return {
        pageUID: "witfin.lead.LeadGeneration",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$filter", "$stateParams", "Lead", "LeadHelper", "SessionStore", "formHelper", "entityManager", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "entityManager", "BiometricService", "PagesDefinition", "Queries", "IrfFormRequestProcessor", "$injector", "irfNavigator", "User"],

        $pageFn: function($log, $state, $filter, $stateParams, Lead, LeadHelper, SessionStore, formHelper, entityManager, $q, irfProgressMessage,
            PageHelper, Utils, entityManager, BiometricService, PagesDefinition, Queries, IrfFormRequestProcessor, $injector, irfNavigator, User) {

            var branch = SessionStore.getBranch();
            AngularResourceService.getInstance().setInjector($injector);
            // var leadProcessTs = new LeadProcess();

            var getOverrides = function (model) {
                return {
                    "leadProfile.leadDetails.individualDetails.gender": {
                        "required": true
                    },
                    "leadProfile.leadDetails.individualDetails.dob": {
                        "required": true
                    },
                    "leadProfile.centerName": {
                        "lovonly": true
                    },
                    "productDetails.screeningDate": {
                        "condition": "(model.lead.interestedInProduct==='YES' && model.lead.leadStatus ==='Screening')",
                    },
                    "productDetails.followUpDate": {
                        "condition": "(model.lead.interestedInProduct==='YES' && model.lead.leadStatus ==='FollowUp')",
                    },
                    "leadInteractions.leadInteractions.typeOfInteraction": {
                        onChange: function (value, form, model) {
                            model.lead.leadInteractions[form.arrayIndex].customerResponse = '';
                            model.lead.leadInteractions[form.arrayIndex].additionalRemarks = '';
                            if(value === 'Call') {
                                model.lead.leadInteractions[form.arrayIndex].location = '';
                                model.lead.leadInteractions[form.arrayIndex].picture = '';
                            }
                        }
                    },
                    "sourceDetails.agentName": {
                        "condition": "model.lead.leadSource=='Buying/Selling Agent'"
                    },
                    "sourceDetails.dealerName": {
                        "condition": "model.lead.leadSource=='Dealer'"
                    }

                }
            }
            var getIncludes = function (model) {
                return [
                    "leadProfile",
                    "leadProfile.branchName",
                    "leadProfile.centerName",
                    "sourceDetails",
                    "sourceDetails.leadSource",
                    "sourceDetails.referredBy",
                    "sourceDetails.agentName",
                    "sourceDetails.dealerName",
                    "leadProfile.individualDetails",
                    "leadProfile.individualDetails.leadName",
                    "leadProfile.individualDetails.existingApplicant",
                    "leadProfile.individualDetails.gender",
                    "leadProfile.individualDetails.dob",
                    "leadProfile.individualDetails.age",
                    "leadProfile.individualDetails.maritalStatus",
                    "leadProfile.individualDetails.educationStatus",
                    "leadProfile.individualDetails.occupation1",
                    "leadProfile.individualDetails.leadCategory",
                    "leadProfile.individualDetails.licenseType",
                    "leadProfile.contactDetails",
                    "leadProfile.contactDetails.mobileNo",
                    "leadProfile.contactDetails.alternateMobileNo",
                    "leadProfile.contactDetails.addressLine1",
                    "leadProfile.contactDetails.addressLine2",
                    "leadProfile.contactDetails.pincode",
                    "leadProfile.contactDetails.area",
                    "leadProfile.contactDetails.cityTownVillage",
                    "leadProfile.contactDetails.district",
                    "leadProfile.contactDetails.state",
                    "leadProfile.contactDetails.location",
                    "leadProfile.contactDetails.postOffice",
                    "leadProfile.contactDetails.landmark",
                    "productDetails",
                    "productDetails.interestedInProduct",
                    "productDetails.loanAmountRequested",
                    "productDetails.loanPurpose1",
                    "productDetails.loanPurpose2",
                    "productDetails.productRequiredBy",
                    "productDetails.followUpDate",
                    "productDetails.screeningDate",
                    "productDetails.productEligibility",
                    "productDetails.productEligibility.eligibleForProduct",
                    "productDetails.productRejectionReason",
                    "productDetails.productRejectionReason.productRejectReason",
                    "productDetails.productRejectionReason.additionalRemarks",
                    "productDetails.leadStatus",
                    "productDetails.leadStatus.leadStatus",
                    "previousInteractions",
                    "previousInteractions.leadInteractions1",
                    "previousInteractions.leadInteractions1.interactionDate",
                    "previousInteractions.leadInteractions1.loanOfficerId",
                    "previousInteractions.leadInteractions1.typeOfInteraction",
                    "previousInteractions.leadInteractions1.customerResponse",
                    "previousInteractions.leadInteractions1.additionalRemarks",
                    "previousInteractions.leadInteractions1.location",
                    "previousInteractions.leadInteractions1.picture",
                    "leadInteractions",
                    "leadInteractions.leadInteractions",
                    "leadInteractions.leadInteractions.interactionDate",
                    "leadInteractions.leadInteractions.loanOfficerId",
                    "leadInteractions.leadInteractions.typeOfInteraction",
                    "leadInteractions.leadInteractions.customerResponse",
                    "leadInteractions.leadInteractions.additionalRemarks",
                    "leadInteractions.leadInteractions.location",
                    "leadInteractions.leadInteractions.picture",
                    "actionbox",
                    "actionbox.save",
                    "actionbox.submit"
                ];
            }
            return {
                "type": "schema-form",
                "title": "LEAD_GENERATION",
                "subTitle": "Lead",
                initialize: function(model, form, formCtrl) {

                    model.siteCode = SessionStore.getGlobalSetting('siteCode');

                    var self = this;
                    var formRequest = {
                        "overrides": getOverrides (model),
                        "includes": getIncludes (model),
                        "excludes": [
                            "",
                        ]
                    };
                    if (!(model && model.lead && model.lead.id && model.$$STORAGE_KEY$$) && $stateParams.pageId) {
                        var leadId = $stateParams.pageId;
                        LeadProcess.get(leadId)
                            .subscribe(function(value){
                                model.leadProcess = value;
                                model.lead = model.leadProcess.lead;
                                var deferred = $q.defer();
                                var promise = deferred.promise;
                                deferred.resolve(Lead.getConfigFile())

                                promise.then(function(resp) {
                                    self.form = IrfFormRequestProcessor.getFormDefinition('LeadGeneration', formRequest, resp, model);
                                    PageHelper.hideLoader();
                                })

                            });
                    } else {
                        LeadProcess.createNewProcess()
                            .subscribe(function(value){
                                model.leadProcess = value;
                                model.lead = model.leadProcess.lead;
                                self.form = IrfFormRequestProcessor.getFormDefinition('LeadGeneration', formRequest);
                            });

                    }
                    //this.form.push(actionbox);

                },
                offline: true,
                getOfflineDisplayItem: function(item, index) {
                    return [
                        item.lead.leadName
                    ]
                },

                form: [],

                schema: function() {
                    return Lead.getLeadSchema().$promise;
                },

                actions: {
                    changeStatus: function(modelValue, form, model) {

                         if (model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO') {
                            model.lead.leadStatus = "Reject";
                        } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == '< 1 month') {
                            model.lead.leadStatus = "Screening";
                        } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == '> 1 month' ) {
                            model.lead.leadStatus = "FollowUp";
                        } else {
                            model.lead.leadStatus = "Incomplete";
                        }
                    },
                    preSave: function(model, form, formName) {
                        var deferred = $q.defer();
                        if (model.lead.leadName) {
                            deferred.resolve();
                        } else {
                            irfProgressMessage.pop('lead-save', 'Applicant Name is required', 3000);
                            deferred.reject();
                        }
                        return deferred.promise;
                    },

                    submit: function(model, form, formName) {
                        $log.info("Inside submit()");
                        PageHelper.showLoader();

                        var reqData = _.cloneDeep(model);
                        var centres = formHelper.enum('centre').data;
                        for (var i = 0; i < centres.length; i++) {
                            if ((centres[i].code) == reqData.lead.centreId) {
                                reqData.lead.centreName = centres[i].name;
                            }
                        }
                        if (reqData.lead.id) {
                            model.leadProcess.proceed()
                                .finally(function(){
                                    PageHelper.hideLoader();
                                })
                                .subscribe(function(leadProcess){
                                    irfNavigator.go({
                                        state: "Page.Adhoc",
                                        pageName: "witfin.loans.LoanOriginationDashboard"
                                    });

                                }, function(err) {
                                    PageHelper.showErrors(err);
                                    PageHelper.hideLoader();
                                });
                        } else {
                            model.leadProcess.proceed()
                                .finally(function(){
                                        PageHelper.hideLoader();
                                    })
                                    .subscribe(function(leadProcess){
                                        irfNavigator.go({
                                            state: "Page.Adhoc",
                                            pageName: "witfin.loans.LoanOriginationDashboard"
                                        });

                                    }, function(err) {
                                        PageHelper.showErrors(err);
                                        PageHelper.hideLoader();
                                    });

                        }
                    }
                }
            };
        }
    }
})

