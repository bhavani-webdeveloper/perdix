define(['perdix/domain/model/lead/LeadProcess', 'perdix/infra/api/AngularResourceService'], function(LeadProcess, AngularResourceService) {
    LeadProcess = LeadProcess["LeadProcess"];

    return {
        //pageUID: "witfin.lead.leadGeneration",
       pageUID:  "base.dashboard.lead.LeadGeneration",
       pageType: "Engine",
        //pageType: "Adhoc",
        dependencies: ["$log", "$state", "$filter", "$stateParams", "Lead", "LeadHelper","Enrollment", "SessionStore", "formHelper", "entityManager", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "entityManager", "BiometricService", "PagesDefinition", "Queries", "IrfFormRequestProcessor", "$injector", "irfNavigator", "User"],

        $pageFn: function($log, $state, $filter, $stateParams, Lead, LeadHelper,Enrollment, SessionStore, formHelper, entityManager, $q, irfProgressMessage,
            PageHelper, Utils, entityManager, BiometricService, PagesDefinition, Queries, IrfFormRequestProcessor, $injector, irfNavigator, User) {
                console.log("lead zeneration test");
            var branch = SessionStore.getBranch();
            AngularResourceService.getInstance().setInjector($injector);
            // var leadProcessTs = new LeadProcess();

            var getOverrides = function (model) {
                return {
                    "leadProfile.individualDetails.age": {
                        "readonly" : true
                    },
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
                        "required" : true,
                        onChange: function (value, form, model) {
                            model.lead.leadInteractions[form.arrayIndex].customerResponse = '';
                            model.lead.leadInteractions[form.arrayIndex].additionalRemarks = '';
                            if(value === 'Call') {
                                model.lead.leadInteractions[form.arrayIndex].location = '';
                                model.lead.leadInteractions[form.arrayIndex].picture = '';
                            }
                        }
                    },
                    "leadInteractions.leadInteractions.customerResponse":{
                        "required": true
                    },
                    "sourceDetails.agentName": {
                        "condition": "model.lead.leadSource.toUpperCase() == 'BUYING / SELLING AGENT(BROKER)'",
                        "enumCode": "agent"
                    },
                    "sourceDetails.referredBy2": {
                        "condition": "model.lead.leadSource.toUpperCase() == 'DEALER(NEW VEHICLE)'",
                        "enumCode": "dealer"
                    },
                    "productDetails.interestedInProduct": {
                        "orderNo" : 10,
                        "onChange":function(modelValue,form, model, formCtrl, event){
                            model.lead.eligibleForProduct='YES';
                        }
                    },
                    "productDetails.loanAmountRequested": {
                        "orderNo": 60
                    },
                    "productDetails.loanPurpose1": {
                        "orderNo": 20
                    },
                    "productDetails.loanPurpose2": {
                        "orderNo": 30
                    },
                    "productDetails.productRequiredBy": {
                        "orderNo": 50
                    },
                    "productDetails.screeningDate": {
                        "orderNo": 60,
                        "key": "lead.screeningDate",
                        "condition": "(model.lead.interestedInProduct==='YES' && model.lead.productRequiredBy ==='In this week')",
                        "type": "date",
                        "onChange": "actions.changeStatus(modelValue, form, model)"
                    },
                    "productDetails.productRejectionReason":{
                        "condition" : "model.lead.eligibleForProduct === 'NO' "

                    },
                    //  "productDetails.productRejectionReason.productRejectAdditinalRemarks":{
                    //     "condition" : "model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO' "

                    // },
                    "leadProfile.leadDetails.customerTypeString":{
                        "readonly":false,
                        "required":true
                    },
                    "leadInteractions.leadInteractions.customerResponse":{
                        "type":"string"
                    },
                    "productDetails.productRejectionReason.productRejectReason":{
                        "enumCode":"lead_reject_reason_other"
                    },
                    "leadProfile.leadDetails.enterpriseDetails.businessName":{
                        "required":true
                    },
                    "leadProfile.leadDetails.enterpriseDetails.businessType":{
                        "required":true
                    },
                    "leadProfile.leadDetails.enterpriseDetails.businessActivity":{
                        "required":true
                    },

                }
            }
            var getIncludes = function (model) {
                return [
                    "leadProfile",
                    "leadProfile.branchName",
                    "leadProfile.centerName",
                    "leadProfile.leadDetails",
                    "leadProfile.leadDetails.customerTypeString",
                    "leadProfile.leadDetails.enterpriseDetails",
                    "leadProfile.leadDetails.enterpriseDetails.customerId",
                    "leadProfile.leadDetails.enterpriseDetails.businessName",
                    "leadProfile.leadDetails.enterpriseDetails.companyRegistered",
                    "leadProfile.leadDetails.enterpriseDetails.businessType",
                    "leadProfile.leadDetails.enterpriseDetails.businessActivity",
                    "leadProfile.leadDetails.enterpriseDetails.companyOperatingSince",
                    "leadProfile.leadDetails.enterpriseDetails.ownership",
                    // "sourceDetails",
                    // "sourceDetails.leadSource",
                    // "sourceDetails.referredBy",
                    // "sourceDetails.referredBy1",
                    // "sourceDetails.agentName",
                    // "sourceDetails.referredBy2",
                    "leadProfile.individualDetails",
                    "leadProfile.individualDetails.leadName",
                    "leadProfile.individualDetails.existingApplicant",
                    "leadProfile.individualDetails.gender",
                    "leadProfile.individualDetails.dob",
                    "leadProfile.individualDetails.age",
                    "leadProfile.individualDetails.maritalStatus",
                    "leadProfile.individualDetails.educationStatus",
                    //"leadProfile.individualDetails.occupation1",
                    // "leadProfile.individualDetails.leadCategory",
                    // "leadProfile.individualDetails.licenseType",
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
                    // "leadProfile.contactDetails.location",
                    // "leadProfile.contactDetails.postOffice",
                    // "leadProfile.contactDetails.landmark",
                    "productDetails",
                    "productDetails.transactionType",
                    "productDetails.transactionType1",
                    "productDetails.interestedInProduct",
                    "productDetails.loanAmountRequested",
                    "productDetails.loanPurpose1",
                    "productDetails.loanPurpose2",
                    "productDetails.parentLoanAccount",
                    "productDetails.productRequiredBy",
                    "productDetails.followUpDate",
                    "productDetails.screeningDate",
                    "productDetails.vehicleRegistrationNumber",
                    "productDetails.productEligibility",
                    "productDetails.productEligibility.eligibleForProduct",
                    "productDetails.productRejectionReason",
                    "productDetails.productRejectionReason.productRejectReason",
                    "productDetails.productRejectionReason.productRejectAdditinalRemarks",
                    "productDetails.productRejectionReason2",
                    "productDetails.productRejectionReason2.productRejectReason",
                    "productDetails.productRejectionReason2.productRejectAdditinalRemarks",
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
                        ],
                        "options": {
                            "repositoryAdditions": {
                                "productDetails": {
                                    "items": {
                                        "parentLoanAccount": {
                                            "key": "lead.parentLoanAccount",
                                            "title": "PARENT_LOAN_ACCOUNT",
                                            "condition": "model.lead.loanPurpose1==='Insurance Loan'",
                                            "orderNo": 40
                                        },
                                        "vehicleRegistrationNumber": {
                                            "key": "lead.vehicleRegistrationNumber",
                                            "title": "REGN_NO",
                                            "condition": "model.lead.interestedInProduct==='YES' && (model.lead.loanPurpose1 == 'Purchase - Used Vehicle' || model.lead.loanPurpose1 == 'Refinance')",
                                            "orderNo": 45
                                        },
                                        "transactionType": {
                                            "key": "lead.transactionType",
                                            "title": "TRANSACTION_TYPE",
                                            "type": "select",
                                            "orderNo" : 5,
                                            "titleMap":{
                                                "New Loan":"New Loan",
                                                "Renewal":"Renewal",
                                                "Loan Restructure":"Loan Restructure",
                                                "Internal Foreclosure":"Internal Foreclosure"
                                            },
                                            "schema":{
                                                "enumCode":undefined
                                            },
                                            "condition": "model.lead.transactionType.toLowerCase()!='renewal'",
                                            "required":true
                                        },
                                        "transactionType1": {
                                            "key": "lead.transactionType",
                                            "title": "TRANSACTION_TYPE",
                                            "type": "select",
                                            "orderNo" : 5,
                                            "titleMap":{
                                                "New Loan":"New Loan",
                                                "Renewal":"Renewal",
                                                "Loan Restructure":"Loan Restructure",
                                                "Internal Foreclosure":"Internal Foreclosure"
                                            },
                                            "schema":{
                                                "enumCode":undefined
                                            },
                                            "condition": "model.lead.transactionType.toLowerCase()=='renewal'",
                                            "required":true,
                                            "readonly":true
                                        },
                                        "productRejectionReason2": {
                                            type: "fieldset",
                                            title: "PRODUCT_REJECTION_REASON",
                                            condition: "model.lead.interestedInProduct ==='NO'",
                                            items: {
                                                "productRejectReason": {
                                                    key: "lead.productRejectReason",
                                                    type: "select",
                                                    enumCode:"lead_reject_reason",
                                                    
                                                },
                                                "productRejectAdditinalRemarks": {
                                                    key: "lead.productRejectAdditinalRemarks",
                                                    title:"REMARKS"
                                                },
                                            }
                                        },
                                    }
                                },
                                "sourceDetails":{
                                    "items":{
                                        "referredBy2":{
                                            "key": "lead.referredBy",
                                            "type": "select",
                                            "enumCode": "dealer"
                                        }
                                    }
                                },
                                "leadProfile":{
                                    "items":{
                                        "leadDetails":{
                                            "items":{
                                                "enterpriseDetails":{
                                                    "items":{
                                                        "customerId": {
                                                            "key": "lead.customerId",
                                                            "title": "CHOOSE_EXISTING_BUSINESS",
                                                            "type": "lov",
                                                            "lovonly": true,
                                                            "orderNo":1,
                                                            initialize: function (model, form, parentModel, context) {
                                                                model.branchId = parentModel.lead.branchName;
                                                                model.centreName = parentModel.lead.centreName;
                                                            },
                                                            "inputMap": {
                                                                "firstName": {
                                                                    "key": "lead.customerFirstName"
                                                                },
                                                                "urnNo": {
                                                                    "key": "lead.urnNo",
                                                                },
                                                                "branchId": {
                                                                    "key": "lead.branchName",
                                                                    "type": "select",
                                                                    "screenFilter": true,
                                                                    "readonly": true
                                                                },
                                                                "centreName": {
                                                                    "key": "lead.centreName",
                                                                    "type": "string",
                                                                    "readonly": true
                                                                },
                                                            },
                                                            "searchHelper": formHelper,
                                                            "search": function (inputModel, form, model) {
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
                                                                    'centreId': model.lead.centreId,
                                                                    'customerType': "enterprise",
                                                                    'urnNo': inputModel.urnNo
                                                                }).$promise;
                                                                return promise;
                                                            },
                                                            getListDisplayItem: function (data, index) {
                                                                return [
                                                                    [data.firstName, data.fatherFirstName].join(' | '),
                                                                    data.id,
                                                                    data.urnNo
                                                                ];
                                                            },
                                                            onSelect: function (valueObj, model, context) {
                                                                Enrollment.getCustomerById({
                                                                    id: valueObj.id
                                                                })
                                                                    .$promise
                                                                    .then(function (res) {
                                                                        PageHelper.showProgress("customer-load", "Done..", 5000);
                                                                        model.lead.customerId = res.id;
                                                                        model.lead.businessName = res.firstName;
                                                                        model.lead.alternateMobileNo = res.mobilePhone;
                                                                        model.lead.location = res.latitude;
                                                                        model.lead.ownership = res.enterprise.ownership
                                                                        model.lead.companyOperatingSince = res.enterprise.companyOperatingSince;
                                                                        model.lead.companyRegistered = res.enterprise.companyRegistered;
                                                                        model.lead.businessType = res.enterprise.businessType;
                                                                        model.lead.businessActivity = res.enterprise.businessActivity;
                                                                        model.lead.enterpriseCustomerRelations = res.enterpriseCustomerRelations;
                            
                            
                                                                        model.lead.mobileNo = null;
                                                                        model.lead.gender = null;
                                                                        model.lead.leadName = null;
                                                                        model.lead.maritalStatus=null;
                                                                        model.lead.landLineNo=null;
                                                                        model.lead.dob=null;
                                                                        model.lead.addressLine1=null;
                                                                        model.lead.addressLine2=null;
                                                                        model.lead.pincode=null;
                                                                        model.lead.district=null;
                                                                        model.lead.state=null;
                                                                        model.lead.area=null;
                                                                        model.lead.cityTownVillage=null;
                                                                        model.lead.applicantCustomerId = null;
                            
                                                                        model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                                                                        model.lead.educationStatus = null;
                            
                            
                                                                    }, function (httpRes) {
                                                                        PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
                                                                    })
                                                            }
                            
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                
                                
                            }
                        }
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

                                console.log(model.lead.getLead());

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
                offlineInitialize: function(model, form, formCtrl) {
                    if (model.$$STORAGE_KEY$$) {
                        // model.leadProcess = LeadProcess.createFromOfflineData(model.leadProcess);
                        LeadProcess.createFromPlainLeadObject(model.lead)
                            .subscribe(function(leadProcess){
                                model.leadProcess = leadProcess;
                                model.lead = leadProcess.lead;
                                // self.form = IrfFormRequestProcessor.getFormDefinition('LeadGeneration', formRequest);
                            })
                    }
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
                        } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy.toUpperCase() == 'NOW') {
                            model.lead.leadStatus = "Screening";
                        } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy.toUpperCase() == 'LATER' ) {
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

                    submit: function (model, form, formName) {
                        $log.info("Inside submit()");
                        model.lead.productCategory = "Asset";
                        model.lead.productSubCategory = "Loan";
                        $log.warn(model);
                        var sortFn = function (unordered) {
                            var out = {};
                            Object.keys(unordered).sort().forEach(function (key) {
                                out[key] = unordered[key];
                            });
                            return out;
                        };
                        // if (model.siteCode == 'sambandh' || model.siteCode == 'saija' || model.siteCode == 'IREPDhan'|| model.siteCode == 'KGFS') {
                        //     model.lead.customerType = model.lead.customerTypeString;
                        // }
                        var reqData = _.cloneDeep(model);
                        var centres = formHelper.enum('centre').data;
                        for (var i = 0; i < centres.length; i++) {
                            if ((centres[i].code) == reqData.lead.centreId) {
                                reqData.lead.centreName = centres[i].name;
                            }
                        }
                        if (reqData.lead.id) {
    
                            if (reqData.lead.leadStatus == "FollowUp" && model.lead.currentStage == "Inprocess") {
                                LeadHelper.followData(reqData).then(function (resp) {
                                    irfNavigator.go({
                                        state:"Page.Adhoc",
                                        pageName:'base.dashboard.lead.LeadDashboard'
                                    })
                                });
                            } else {
                                /* 1)validating before proceeding that loan amount requested should be greater then or equal
                                    to existing loan amount in case of transaction renewal
                                */
                                if (model.linkedLoanAmount && model.lead.transactionType && model.lead.transactionType.toLowerCase() == 'renewal' && model.lead.loanAmountRequested < model.linkedLoanAmount) {
                                    var res = {
                                        data: {
                                            error: 'RequestedLoanAmount should be greater than or equal to existing loan amount' + "  " + model.linkedLoanAmount 
                                        }
                                    };
                                    PageHelper.showErrors(res)
                                    return false;
                                }
                                LeadHelper.proceedData(reqData).then(function (resp) {
                                    irfNavigator.go({
                                        state:"Page.Adhoc",
                                        pageName:'base.dashboard.lead.LeadDashboard'
                                    })
                                }, function (err) {
                                    PageHelper.showErrors(err);
                                    // Utils.removeNulls(resp.lead, true);
                                    // model.lead = resp.lead;
                                });
    
                            }
                        } else {
                            LeadHelper.saveData(reqData).then(function (res) {
                                LeadHelper.proceedData(res).then(function (resp) {
                                    irfNavigator.go({
                                        state:"Page.Adhoc",
                                        pageName:'base.dashboard.lead.LeadDashboard'
                                    })
                                }, function (err) {
                                    PageHelper.showErrors(err);
                                    // Utils.removeNulls(resp.lead, true);
                                    // model.lead = resp.lead;
                                });
                            });
                        }
                    }
                }
            };
        }
    }
})

