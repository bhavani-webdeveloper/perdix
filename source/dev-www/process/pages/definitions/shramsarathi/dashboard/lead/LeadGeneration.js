define(['perdix/domain/model/lead/LeadProcess', 'perdix/infra/api/AngularResourceService'], 
function(LeadProcess, AngularResourceService) {
    LeadProcess = LeadProcess["LeadProcess"];

    return {

       pageUID:  "shramsarathi.dashboard.lead.LeadGeneration",
       pageType: "Engine",
        //pageType: "Adhoc",
        dependencies: ["$log", "$state", "$filter", "$stateParams", "Lead", "LeadHelper", "SessionStore", "formHelper", "entityManager", "$q", "irfProgressMessage",
        "PageHelper", "Utils", "entityManager", "BiometricService", "PagesDefinition", "Queries", "IrfFormRequestProcessor", "$injector", "irfNavigator", "User"],

        $pageFn: function($log, $state, $filter, $stateParams, Lead, LeadHelper, SessionStore, formHelper, entityManager, $q, irfProgressMessage,
            PageHelper, Utils, entityManager, BiometricService, PagesDefinition, Queries, IrfFormRequestProcessor, $injector, irfNavigator, User) {
                console.log("lead generation test");

            var branch = SessionStore.getBranch();

            AngularResourceService.getInstance().setInjector($injector);
            // var leadProcessTs = new LeadProcess();

            var getOverrides = function (model) {
                return {
                    "leadProfile.individualDetails.maritalStatus":{
                        "required":true
                    },
                    "leadProfile.individualDetails.lastName":{
                        "required": false
                    },
                    "leadProfile.individualDetails.dob":{
                        "required": true
                    },
                    "leadProfile.individualDetails.nickName":{
                        "required": false
                    },
                    "leadProfile.individualDetails.educationStatus":{
                        "required":true
                    },
                    "leadProfile.individualDetails.age":{
                        "required":true
                    },
                    "leadProfile.leadDetails.customerTypeString":{
                        "readonly":true,
                        "required":true,
                        "title": "LEAD_TYPE"
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
                    "leadProfile.individualDetails": {
                        "orderNo" : 20
                    },
                    "leadProfile.leadDetails": {
                        "orderNo" : 15,
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
                        "required" : false,
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
                        "required": false,
                        "type": "text"
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
                        "required":false,
                        // enumCode: "decisionmaker",
                        // "onChange": function(modelValue, form, model) {
                        //         if (model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO') {
                        //             model.lead.leadStatus = "Reject";
                        //         } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this week') {
                        //             model.lead.leadStatus = "Screening";
                        //         } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this month' || model.lead.productRequiredBy == 'In Next months') {
                        //             model.lead.leadStatus = "FollowUp";
                        //         } else {
                        //             model.lead.leadStatus = "Incomplete";
                        //         }
                               
                        //     }
                    },
                    "productDetails.loanAmountRequested": {
                        "orderNo": 60,
                        "required":false
                    },
                    "productDetails.loanPurpose1": {
                        "orderNo": 20,
                        "required":false
                    },
                    // "productDetails.loanPurpose2": {
                    //     "orderNo": 30
                    // },
                    "productDetails.productRequiredBy": {
                        "orderNo": 50,
                        "title":"PRODUCT_REQUIRED_BY_DATE",
                        // "titleMap":{
                        //     "thisWeek":"This Week",
                        //     "thisMonth":"This Month",
                        //     "nextMonth":"Next Month"
                        // }
                    },
                    "productDetails.screeningDate": {
                        "orderNo": 60,
                        //"condition":"model.lead.productRequiredBy=='thisWeek'"
                    },
                    "productDetails.productRejectionReason":{
                        "condition" : "model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO' "

                    },
                    "productDetails.productRejectionReason.productRejectReason":{
                        "condition" : "model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO' "

                    },
                     "productDetails.productRejectionReason.productRejectAdditinalRemarks":{
                        "condition" : "model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO' "

                    },
                    "leadProfile.branchName":{
                        "title":"BRANCH",
                        "readonly" :true,
                        "orderNo" : 0
                    },
                    "leadProfile.centerName":{
                        "title":"ZONE",
                        "orderNo" : 5
                    },
                    "leadProfile.individualDetails.leadName":{
                        "title":"APPLICANT_FIRST_NAME"
                    },
                    "leadProfile.contactDetails":{
                        "title":"SOURCE_ADDRESS",
                        "orderNo" : 40 
                    },
                    "leadProfile.contactDetails.area":{
                        "title":"PANCHAYAT",
                        "required":true
                        //"orderNo":20
                    },
                    // "leadProfile.contactDetails.mobileNo":{
                    //     "type" : "number"
                    // },
                    "leadProfile.contactDetails.cityTownVillage":{
                        "title":"VILLAGE",
                        required:true
                        //"orderNo":30
                    },
                    "leadProfile.contactDetails.district":{
                       // "orderNo":40
                    },
                    "leadProfile.contactDetails.subDistrict":{
                        "orderNo":50,
                    },
                    "leadProfile.contactDetails.addressLine1":{
                        "title":"HAMLET_FALA",
                        //"orderNo":5
                    },
                    "leadProfile.contactDetails.alternateMobileNo":{
                        orderNo: 8
                    },
                    "leadProfile.contactDetails.pincode": {
                        key: "lead.pincode",
                        type: "lov",
                        fieldType: "number",
                        orderNo: 10,
                        inputMap: {
                            "pincode": "lead.pincode",
                            "division": {
                                key: "lead.area",
                                title:"PANCHAYAT",
                            },
                            "district": {
                                key: "lead.district",
                            },
                            "state": {
                                key: "lead.state",
                            }
                        },
                        outputMap: {
                            "division": "lead.area",
                            "region": "lead.cityTownVillage",
                            "pincode": "lead.pincode",
                            "district": "lead.district",
                            "state": "lead.state"

                        },
                        searchHelper: formHelper,
                        search: function (inputModel, form, model) {
                            return Queries.searchPincodes(inputModel.pincode, inputModel.district, inputModel.state);
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.division + ', ' + item.region,
                                item.pincode,
                                item.district + ', ' + item.state
                            ];
                        }
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
                    "leadProfile.individualDetails.middleName",
                    "leadProfile.individualDetails.lastName",
                    "leadProfile.individualDetails.nickName",
                    "leadProfile.individualDetails.existingApplicant",
                    "leadProfile.individualDetails.gender",
                    "leadProfile.individualDetails.dob",
                    "leadProfile.individualDetails.age",
                    "leadProfile.individualDetails.maritalStatus",
                    "leadProfile.individualDetails.educationStatus",
                    // "leadProfile.individualDetails.occupation1",
                    // "leadProfile.individualDetails.leadCategory",
                    // "leadProfile.individualDetails.licenseType",
                  
                    "leadProfile.contactDetails",
                    "leadProfile.contactDetails.subDistrict",
                    "leadProfile.contactDetails.mobileNo",
                    "leadProfile.contactDetails.alternateMobileNo",
                    "leadProfile.contactDetails.addressLine1",
                    //"leadProfile.contactDetails.addressLine2",
                    "leadProfile.contactDetails.pincode",
                    "leadProfile.contactDetails.area",
                    "leadProfile.contactDetails.taluk",
                    "leadProfile.contactDetails.cityTownVillage",
                    "leadProfile.contactDetails.district",
                    "leadProfile.contactDetails.state",
                    // "leadProfile.contactDetails.location",
                    // "leadProfile.contactDetails.postOffice",
                    // "leadProfile.contactDetails.landmark",
                    "leadProfile.migrantDetails",
                    "leadProfile.migrantDetails.migrantDependantLabourFamily",
                    "productDetails",
                    "productDetails.interestedInProduct",
                    "productDetails.loanAmountRequested",
                    "productDetails.loanPurpose1",
                    //"productDetails.loanPurpose2",
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
                                        }
                                    }
                                },
                               
                                "leadProfile":{
                                   "items": {  
                                    "individualDetails": {
                                        items: {
                                            "middleName": {
                                                key: "lead.middleName",
                                                title: "MIDDLE_NAME",
                                                schema: {
                                                    pattern: "^[a-zA-Z\. ]+$",
                                                },
                                                validationMessage: {202: "Only alphabets and space are allowed."},
                                                "orderNo": 50
                                            },
                                            "lastName": {
                                                key: "lead.lastName",
                                                title: "LAST_NAME",
                                                required:true,
                                                schema: {
                                                    pattern: "^[a-zA-Z\. ]+$",
                                                },
                                                validationMessage: {202: "Only alphabets and space are allowed."},
                                                "orderNo": 55
                                            },
                                            "nickName": {
                                                key: "lead.nickName",
                                                title: "NICK_NAME",
                                                schema: {
                                                    pattern: "^[a-zA-Z\. ]+$",
                                                },
                                                validationMessage: {202: "Only alphabets and space are allowed."},
                                                "orderNo": 60,
                                                required:true
                                            }
                                            
                                    },
                                    
                                    
                                    },
                                    "contactDetails":{
                                        "items":{
                                             "subDistrict": {
                                                     "key":"lead.cityTownVillage",
                                                     "title":"SUBDISTRICT",
                                                     "readonly":true,
                                                     "required":true
                                                 }
                                        } 
                                     },
                                    "migrantDetails": {
                                        "type": "fieldset",
                                        "title": "MIGRANT_DETAILS",
                                        "orderNo": 30,
                                        "items": {
                                            "migrantDependantLabourFamily": {
                                                key: "lead.userDefinedFieldValues.udf2",
                                                title: "MIGRANT_DEPENDENT_LABOUR_FAMILY",
                                                required:true,
                                                type:"radios",
                                                titleMap:[
                                                    {
                                                        "name":"yes",
                                                        "value":true
                                                    },
                                                    {
                                                        "name":"no",
                                                        "value":false
                                                    }
                                                ],
                                                schema:{
                                                }                                    
            
                                                 },
                                            }
                                        }
                                    },
                                    // "contactDetails":{
                                    //     "items":{
                                    //         "subDistrict":{
                                    //             "key": "lead.subDistrict",
                                    //             "type": "String",
                                    //             "title":"SUB-DISTRICT",
                                    //              "readonly": true,
                                    //             "orderNo":100,
                                    //         }
                                    //     }
                                    // },
                                    
                                },
                                // "productDetails":{
                                //     items: {
                                //                 "interestedInProduct":{
                                //                     key: "lead.interestedInProduct",
                                //                     title: "INTERESTED_IN_LOAN_PRODUCT",
                                //                     type: "select",
                                //                     required: false,
                                //                     enumCode: "decisionmaker",
                                //                     "onChange": function(modelValue, form, model) {
                                //                             if (model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO') {
                                //                                 model.lead.leadStatus = "Reject";
                                //                             } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this week') {
                                //                                 model.lead.leadStatus = "Screening";
                                //                             } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this month' || model.lead.productRequiredBy == 'In Next months') {
                                //                                 model.lead.leadStatus = "FollowUp";
                                //                             } else {
                                //                                 model.lead.leadStatus = "Incomplete";
                                //                             }
                                                           
                                //                         }
                                                       
                                //                 }
                                //     }
                                // }


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

                                +
                                console.log(model.lead.getLead());

                                promise.then(function(resp) {
                                    var tempForm = IrfFormRequestProcessor.getFormDefinition('LeadGeneration', formRequest, resp, model);
                                    console.log("Form:");
                                console.log(tempForm);
                                self.form = tempForm;
                                    PageHelper.hideLoader();
                                })

                            });
                    } else {
                        LeadProcess.createNewProcess()
                            .subscribe(function(value){
                                model.leadProcess = value;
                                model.lead = model.leadProcess.lead;

                                var tempForm = IrfFormRequestProcessor.getFormDefinition('LeadGeneration', formRequest);
                                console.log("Form:");
                                console.log(tempForm);
                                self.form = tempForm;
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
                        } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy.toUpperCase() == 'IN THIS WEEK') {
                            model.lead.leadStatus = "Screening";
                        } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy.toUpperCase() == 'IN THIS MONTH' ) {
                            model.lead.leadStatus = "FollowUp";
                        }else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy.toUpperCase() == 'NEXT 2 -3 MONTHS' ) {
                            model.lead.leadStatus = "FollowUp";
                        }else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy.toUpperCase() == 'NEXT 4-6 MONTHS' ) {
                            model.lead.leadStatus = "FollowUp";
                        }    
                        else {
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
                                        pageName: "shramsarathi.dashboard.lead.LeadDashboard"
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
                                            pageName: "shramsarathi.dashboard.lead.LeadDashboard"
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

