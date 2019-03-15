define({
    pageUID: "management.ApproveDeathDetails",
    pageType: "Engine",
    dependencies:  ["$log", "irfNavigator", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "PagesDefinition", "$stateParams", "Queries", "DeathMarking"],
    $pageFn:function($log, irfNavigator, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, PagesDefinition, $stateParams, Queries, DeathMarking) {
            return {
            "type": "schema-form",
            "title": "APPROVE_DEATH_DETAILS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.approveDeathDetails = {};
                model.approveDeathDetails.id = $stateParams.pageId;
                model.approveDeathDetails.name = $stateParams.pageData.familyMemberName;
                model.approveDeathDetails.urnNo = $stateParams.pageData.urnNo;
                model.approveDeathDetails.customer = $stateParams.pageData.customerId;
                if($stateParams.pageData.customerId == null || $stateParams.pageData.customerId == 0){
                    model.approveDeathDetails.customer = $stateParams.pageData.familyMemberId;
                }
                model.approveDeathDetails.natureOfDeath = $stateParams.pageData.reasonForDeath;
                model.approveDeathDetails.dateOfIncident = $stateParams.pageData.dateOfIncident;
                model.approveDeathDetails.details = $stateParams.pageData.furtherDetails;
                model.approveDeathDetails.comments = $stateParams.pageData.comments;
                model.approveDeathDetails.fileId = $stateParams.pageData.fileId;                
            },
            form: [
                {
                    "type": "box",
                    colClass: "col-sm-12",
                    "title": "DETAILS",
                    "items": [
                        {  
                            "key": "approveDeathDetails.name",
                            "type": "string",
                            "title": "APPROVE_DEATH_NAME",
                            readonly:true
                        },
                        {
                            "key": "approveDeathDetails.urnNo",
                            "type": "string",
                            "title": "APPROVE_DEATH_URN",
                            readonly:true
                        },
                        {
                            "key": "approveDeathDetails.customer",
                            "type": "string",
                            "title": "APPROVE_DEATH_CUSTOMER_OR_MEMBER",
                            readonly:true
                        },
                        {
                            "key": "approveDeathDetails.natureOfDeath",
                            "type": "string",
                            "title": "APPROVE_DEATH_NATURE_OF_DEATH",
                            readonly:true
                        },
                        {
                            "key": "approveDeathDetails.details",
                            "type": "string",
                            "title": "APPROVE_DETAILS",
                            readonly:true
                        },
                        {
                            "key": "approveDeathDetails.dateOfIncident",
                            "type": "string",
                            "title": "APPROVE_DEATH_DATE_OF_INCIDENT",
                            readonly:true
                        },
                        {
                            "key": "approveDeathDetails.comments",
                            "type": "string",
                            "title": "APPROVE_DEATH_COMMENTS",
                            readonly: true
                        },
                        {
                            key: "approveDeathDetails.fileId",                                            
                            title: "DEATHCERTIFICATE_UPLOAD_FILE",
                            category: "DeathMarking",
                            subCategory: "DEATHCERTIFICATE",
                            type: "file",
                            fileType: "jpeg,jpg,png",  
                            readonly : true
                        },
                    ]
                },
                {
                    type: "actionbox",
                    items: [
                        {
                            type: "button",
                            title: "APPROVE",
                            onClick: function(model, form, formName) {
                                req = { "deseasedDetailsStatusUpdateDtos":[
                                        {
                                            "id": model.approveDeathDetails.id,
                                            "status" : 'APPROVED'
                                        }
                                    ],
                                    "message": "Death marking approved"     
                                };
                                PageHelper.clearErrors();
                                PageHelper.showLoader();
                                DeathMarking.updateDeadMarkingStatus(req).$promise.then(function(resp) {
                                    PageHelper.showProgress("ApproveDeathDetails-pages", "Death Marking Approved Successfully", 3000);
                                    irfNavigator.goBack();
                                }, function(err) {
                                    PageHelper.showErrors(err);
                                }).finally(function() {
                                    PageHelper.hideLoader();
                                });
                            }                          
                        },
                        {
                            type: "button",
                            title: "REJECT",
                            onClick: function(model, form, formName) {
                                req = { "deseasedDetailsStatusUpdateDtos":[
                                        {
                                            "id": model.approveDeathDetails.id,
                                            "status" : 'REJECT'
                                        }
                                    ],
                                    "message": "Death marking rejected"     
                                };
                                PageHelper.clearErrors();
                                PageHelper.showLoader();
                                DeathMarking.updateDeadMarkingStatus(req).$promise.then(function(resp) {
                                    Utils.alert("Death Marking Rejected Successfully");
                                    irfNavigator.goBack();
                                }, function(err) {
                                    PageHelper.showErrors(err);
                                }).finally(function() {
                                    PageHelper.hideLoader();
                                });
                            }                          
                        }                      
                    ]
                },
                
            ],
            schema: function() {               
                return DeathMarking.deathMarkingSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                },
            }
        };
    }
});