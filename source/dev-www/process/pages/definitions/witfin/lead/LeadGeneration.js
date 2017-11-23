define(['perdix/domain/model/lead/LeadProcessFactory', 'perdix/domain/shared/AngularResourceService'], function(LeadProcessFactory, AngularResourceService) {

    return {
        pageUID: "witfin.lead.LeadGeneration",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$filter", "$stateParams", "Lead", "LeadHelper", "SessionStore", "formHelper", "entityManager", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "entityManager", "BiometricService", "PagesDefinition", "Queries", "IrfFormRequestProcessor", "$injector"],

        $pageFn: function($log, $state, $filter, $stateParams, Lead, LeadHelper, SessionStore, formHelper, entityManager, $q, irfProgressMessage,
            PageHelper, Utils, entityManager, BiometricService, PagesDefinition, Queries, IrfFormRequestProcessor, $injector) {

            var branch = SessionStore.getBranch();
            AngularResourceService.getInstance().setInjector($injector);
            var getOverrides = function (model) {
                return {
                    "leadProfile.leadDetails.individualDetails.gender": {
                        "required": true
                    },
                    "leadProfile.leadDetails.individualDetails.dob": {
                        "required": true
                    }

                }
            }
            var getIncludes = function (model) {
                return [
                    "leadProfile",
                    "leadProfile.branchName",
                    "leadProfile.centerName",
                    "leadProfile.leadDetails",
                    "leadProfile.leadDetails.leadName",
                    "sourceDetails",
                    "sourceDetails.leadSource",
                    "sourceDetails.referredBy",
                    "sourceDetails.agentName",
                    "sourceDetails.dealerName",
                    "leadProfile.leadDetails.individualDetails",
                    "leadProfile.leadDetails.individualDetails.gender",
                    "leadProfile.leadDetails.individualDetails.dob",
                    "leadProfile.leadDetails.individualDetails.age",
                    "leadProfile.leadDetails.individualDetails.maritalStatus",
                    "leadProfile.leadDetails.individualDetails.educationStatus",
                    "leadProfile.leadDetails.individualDetails.occupation1",
                    "leadProfile.leadDetails.individualDetails.leadCategory",
                    "leadProfile.leadDetails.individualDetails.licenseType",
                    "leadProfile.leadDetails.contactDetails",
                    "leadProfile.leadDetails.contactDetails.mobileNo",
                    "leadProfile.leadDetails.contactDetails.alternateMobileNo",
                    "leadProfile.leadDetails.contactDetails.addressLine1",
                    "leadProfile.leadDetails.contactDetails.addressLine2",
                    "leadProfile.leadDetails.contactDetails.pincode",
                    "leadProfile.leadDetails.contactDetails.area",
                    "leadProfile.leadDetails.contactDetails.cityTownVillage",
                    "leadProfile.leadDetails.contactDetails.district",
                    "leadProfile.leadDetails.contactDetails.state",
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

                    LeadProcessFactory.createNew()
                        .subscribe(function(value){
                            model.leadProcess = value;
                            model.lead = model.leadProcess.lead;

                        });

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

                    }
                    else {
                        this.form = IrfFormRequestProcessor.getFormDefinition('LeadGeneration', formRequest);
                        console.log(this.form);
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
                        } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this week') {
                            model.lead.leadStatus = "Screening";
                        } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this month' || model.lead.productRequiredBy == 'Next 2 -3 months' || model.lead.productRequiredBy == 'Next 4-6 months') {
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
                        model.lead.productCategory = "Asset";
                        model.lead.productSubCategory = "Loan";
                        $log.warn(model);
                        var sortFn = function(unordered) {
                            var out = {};
                            Object.keys(unordered).sort().forEach(function(key) {
                                out[key] = unordered[key];
                            });
                            return out;
                        };
                        if(model.siteCode == 'sambandh' || model.siteCode == 'saija') {
                            model.lead.customerType = model.lead.customerTypeString;
                        }
                        var reqData = _.cloneDeep(model);
                        var centres = formHelper.enum('centre').data;
                        for (var i = 0; i < centres.length; i++) {
                            if ((centres[i].code) == reqData.lead.centreId) {
                                reqData.lead.centreName = centres[i].name;
                            }
                        }
                        if (reqData.lead.id) {

                            if (reqData.lead.leadStatus == "FollowUp" && model.lead.currentStage == "Inprocess") {
                                leadProcessTs.followUp(reqData)
                                    .finally(function(){
                                        console.log('INSIDE FINALLY');
                                    })
                                    .subscribe(
                                        function(data){
                                        $state.go('Page.LeadDashboard', null);
                                    },
                                    function(err) {
                                        PageHelper.showErrors(err);
                                        PageHelper.hideLoader();
                                    }
                                )

                            } else {
                                leadProcessTs.update(reqData)
                                    .finally(function(){
                                        console.log('INSIDE FINALLY');
                                    })
                                    .subscribe(
                                        function(data){
                                        $state.go('Page.LeadDashboard', null);
                                    },
                                    function(err) {
                                        PageHelper.showErrors(err);
                                        PageHelper.hideLoader();
                                    }
                                )
                            }
                        } else {
                            leadProcessTs.save(reqData)
                                .finally(function(){
                                    console.log('INSIDE FINALLY');
                                })
                                .subscribe(
                                    function(data){
                                        $state.go('Page.LeadDashboard', null);
                                    },
                                    function(err) {
                                        PageHelper.showErrors(err);
                                        PageHelper.hideLoader();
                                    }
                                )

                        }
                    }
                }
            };
        }
    }
})

