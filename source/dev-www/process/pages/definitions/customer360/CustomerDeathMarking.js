irf.pageCollection.factory(irf.page("customer360.CustomerDeathMarking"), ["$log", "irfNavigator", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "translateFilter", "$stateParams", "SchemaResource","DeathMarking",
    function($log, irfNavigator, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, translateFilter, $stateParams, SchemaResource, DeathMarking) {
       
            return {
            "type": "schema-form",
            "title": "DEATH_MARKING",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {   
                PageHelper.showLoader();              
                    var defered = $q.defer();                     
                model.deathMarking = {}; 
                 var customerId = $stateParams.pageId.split(':')[0];
                Enrollment.getCustomerById({
                    id: customerId
                }).$promise.then(function(resp) {
                                  
                    model.deathMarking.familyMemberName = resp.firstName;
                    model.deathMarking.familyMembers = resp.familyMembers;
                    model.deathMarking.urnNo = resp.urnNo;
                    if(resp.familyMembers && resp.familyMembers.length) {
                        for(var i=0; i<resp.familyMembers.length; i++){
                            if((resp.familyMembers[i].relationShip).toUpperCase() == "SELF"){                               
                                model.deathMarking.dateOfBirth = resp.familyMembers[i].dateOfBirth;
                                model.deathMarking.familyMemberRelation = resp.familyMembers[i].relationShip;
                                model.deathMarking.familyMemberId = resp.familyMembers[i].familySequenceId;
                                model.deathMarking.customerId = resp.familyMembers[i].customerId;
                                model.deathMarking.enrollmentId = resp.familyMembers[i].enrollmentId;
                                model.deathMarking.familyMemberFirstName = resp.familyMembers[i].familyMemberFirstName;
                                model.deathMarking.dead = resp.familyMembers[i].dead;
                                Queries.deseaseDetails(customerId).then(function(response) {
                                    model.deceaseDetails = response.results;
                                    for(var i=0; i < model.deceaseDetails.length; i++){    
                                       if(model.deathMarking.familyMemberId == model.deceaseDetails[i].family_member_id){ 
                                    model.deathMarking.comments =  model.deceaseDetails[i].comments || {};
                                    model.deathMarking.family_member_id =  model.deceaseDetails[i].family_member_id || {};
                                    model.deathMarking.furtherDetails =  model.deceaseDetails[i].further_details || {};
                                    model.deathMarking.reasonForDeath =  model.deceaseDetails[i].reason_for_death || {};
                                    model.deathMarking.dateOfDeath =  model.deceaseDetails[i].date_of_incident || {};
                                    model.deathMarking.deathMarkingStatus =  model.deceaseDetails[i].admin_confirmation_status || {};
                                    model.deathMarking.fileId =  model.deceaseDetails[i].fileId;
                                    model.deathMarking.id =  model.deceaseDetails[i].id || {};
                                   }
                                    }
                                    PageHelper.hideLoader();
                                }, function(errResp) {
                                    PageHelper.showErrors(errResp);
                                    PageHelper.hideLoader();
                                });                
                            }                           
                        } 
                    }                   
                    PageHelper.hideLoader();         
                }, function(errResp) {
                    PageHelper.showErrors(errResp);
                    PageHelper.hideLoader();
                });                
               
            },
            form: [
                {
                    "type": "box",
                    "title": "DEATH_MARKING_DETAILS",
                    "items": [
                        {
                            key: "deathMarking.familyMemberName",
                            title: "FAMILY_MEMBER_NAME",
                            type: "lov",
                            lovonly: true,
                            searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                return $q.resolve({
                                    headers: {
                                        "x-total-count": model.deathMarking.familyMembers.length
                                    },
                                    body: model.deathMarking.familyMembers
                                });
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.familyMemberFirstName,
                                    item.relationShip
                                ];
                            },
                            onSelect: function(valueObj, model, context) {
                                model.deathMarking.familyMemberName = valueObj.familyMemberFirstName;
                                model.deathMarking.dateOfBirth = valueObj.dateOfBirth;
                                model.deathMarking.familyMemberRelation = valueObj.relationShip;
                                model.deathMarking.familyMemberId = valueObj.familySequenceId;
                                model.deathMarking.customerId = valueObj.customerId;
                                model.deathMarking.enrollmentId = valueObj.enrollmentId;
                                model.deathMarking.familyMemberFirstName = valueObj.familyMemberFirstName;
                                model.deathMarking.dead = valueObj.dead;
                               model.deceaseDetails = model.deceaseDetails || {};
                                    for(var i=0; i<model.deceaseDetails.length; i++){
                                    if(model.deceaseDetails[i].family_member_id == valueObj.familySequenceId){                                                                          
                                    model.deathMarking.comments = model.deceaseDetails[i].comments;
                                    model.deathMarking.family_member_id = model.deceaseDetails[i].family_member_id;
                                    model.deathMarking.furtherDetails = model.deceaseDetails[i].further_details;
                                    model.deathMarking.reasonForDeath = model.deceaseDetails[i].reason_for_death;
                                    model.deathMarking.dateOfDeath = model.deceaseDetails[i].date_of_incident;
                    model.deathMarking.deathMarkingStatus = model.deceaseDetails[i].admin_confirmation_status;
                                    }
                                    else{
                                         delete model.deathMarking.comments;
                                         delete model.deathMarking.family_member_id;
                                         delete model.deathMarking.furtherDetails;
                                         delete model.deathMarking.reasonForDeath;
                                         delete model.deathMarking.dateOfDeath;
                                         delete model.deathMarking.deathMarkingStatus;
                                    }
                                }

                            },
                            required: true
                        },
                        {
                            key: "deathMarking.familyMemberRelation",
                            type: "string",
                            title:"FAMILY_MEMBER_RELATION",
                            readonly:true
                        },
                        {
                            key: "deathMarking.familyMemberId",
                            type: "number",
                            title:"FAMILY_MEMBER_ID",        
                            readonly:true
                        },
                        {
                            key: "deathMarking.urnNo",
                            type: "string",
                            title:"DEATH_MARKING_COLUMN_URN",        
                            readonly:true
                        },
                        {
                            key: "deathMarking.dateOfBirth",
                            title: "DATE_OF_BIRTH",
                            type: "date",
                            readonly:true
                        },
                        {
                            key: "deathMarking.dateOfDeath",
                            title: "DATE_OF_DEATH",
                            condition:"model.deathMarking.deathMarkingStatus && model.deathMarking.deathMarkingStatus != 'REJECT'",                                      
                            type: "date",
                            readonly:true
                        },
                        {
                            key: "deathMarking.dateOfDeath",
                            title: "DATE_OF_DEATH",
                            condition:"!model.deathMarking.deathMarkingStatus || model.deathMarking.deathMarkingStatus == 'REJECT'",                                      
                            type: "date",
                            required: true
                        },
                        {
                            key: "deathMarking.deathMarkingStatus",
                            title: "DEATH_MARKING_STATUS",
                            type: "select",
                            readonly:true,
                            condition:"model.deathMarking.deathMarkingStatus", 
                            titleMap: {
                                "PENDING" : "Submitted - Approval Pending",
                                'APPROVED': "Submitted - Approved",
                                'REJECT': "Rejected"
                            },                                     
                            
                        },
                        {
                            key: "deathMarking.reasonForDeath",
                            title: "REASON_FOR_DEATH",
                            type: "select",
                            required: true,
                            enumCode: "reason_for_death",
                            readonly:true,
                            condition:"model.deathMarking.deathMarkingStatus  && model.deathMarking.deathMarkingStatus != 'REJECT'",                                      
                                
                        },
                        {
                            key: "deathMarking.furtherDetails",
                            title: "FURTHER_DETAILS",
                            type: "select",
                            readonly:true,
                            condition: "model.deathMarking.deathMarkingStatus && model.deathMarking.reasonForDeath != 'SUCIDE' && model.deathMarking.deathMarkingStatus != 'REJECT'",
                            required: true,
                            parentEnumCode:"reason_for_death",
                            parentValueExpr:"model.deathMarking.reasonForDeath",
                            enumCode: "further_details"
                        },
                        {
                            key: "deathMarking.comments",
                            type: "textarea",
                            title:"COMMENTS",
                            readonly:true,
                            condition:"model.deathMarking.deathMarkingStatus  && model.deathMarking.deathMarkingStatus != 'REJECT'",                                      
                            
                        },
                        {
                            key: "deathMarking.reasonForDeath",
                            title: "REASON_FOR_DEATH",
                            condition:"!model.deathMarking.deathMarkingStatus || model.deathMarking.deathMarkingStatus == 'REJECT'",                                      
                            type: "select",
                            required: true,
                            enumCode: "reason_for_death"                          
                           
                        },
                        {
                            key: "deathMarking.furtherDetails",
                            title: "FURTHER_DETAILS",
                            type: "select",
                            condition: "!model.deathMarking.deathMarkingStatus|| model.deathMarking.deathMarkingStatus == 'REJECT' && model.deathMarking.reasonForDeath != 'SUCIDE'",
                            required: true,
                            parentEnumCode:"reason_for_death",
                            parentValueExpr:"model.deathMarking.reasonForDeath",
                            enumCode: "further_details"
                        },
                        {
                            key: "deathMarking.comments",
                            type: "textarea",
                            condition:"!model.deathMarking.deathMarkingStatus || model.deathMarking.deathMarkingStatus == 'REJECT'",
                            title:"COMMENTS",
                            required: true
                        },

                        {
                            key: "deathMarking.fileId",                                            
                            title: "DEATHCERTIFICATE_UPLOAD_FILE",
                            category: "DeathMarking",
                            subCategory: "DEATHCERTIFICATE",
                            type: "file",
                            fileType: "jpeg,jpg,png",  
                            condition:"!model.deathMarking.deathMarkingStatus || model.deathMarking.deathMarkingStatus == 'REJECT'",            
                        },
                    ]
                },
                {
                    type: "actionbox",
                    condition:"!model.deathMarking.deathMarkingStatus || model.deathMarking.deathMarkingStatus == 'REJECT'",
                    items: [
                        {
                            type: "submit",
                            title: "SUBMIT",                           
                        }                    
                    ]
                }                
            ],
            schema: function() {               
                return DeathMarking.getCustomerDeathMarking().$promise;
            },
            actions: {
                submit: function(model, form, formName) { 
                
                    var selecteddate = model.deathMarking.dateOfDeath;
                    var currentdate = moment(new Date()).format("YYYY-MM-DD");
                    var currentstatus = model.deathMarking.deathMarkingStatus;

                    if(selecteddate > currentdate){
                        PageHelper.showProgress("Date Error", "Future Death Date is not allowed" , 5000);
                        return false;
                    }

                    var req = {
                        //adminConfirmationStatus: "1",
                        "comments": model.deathMarking.comments,
                        "customerId": model.deathMarking.customerId,
                        "dateOfBirth": model.deathMarking.dateOfBirth,
                        "dateOfIncident":  model.deathMarking.dateOfDeath,
                        "famillyEnrollmentId": model.deathMarking.enrollmentId,
                        "familyMemberId": model.deathMarking.familyMemberId,
                        "familyMemberRelation": model.deathMarking.familyMemberRelation,
                        "familyMemberName": model.deathMarking.familyMemberName,
                        "furtherDetails": model.deathMarking.furtherDetails,
                        "reasonForDeath": model.deathMarking.reasonForDeath,
                        "fileId": model.deathMarking.fileId,
                        "id": model.deathMarking.id,
                    };
                   // req.parameter.push(parameter_list);
                    Utils.confirm("Are you sure?").then(function() {
                        PageHelper.showLoader();
                        if(currentstatus == "REJECT"){
                            DeathMarking.modifyCustomerDeathMarking(req).$promise.then(function(resp) {
                                PageHelper.showProgress("customerdeathmarking-pages", "Page customer death marking saved", 3000);
                                irfNavigator.goBack();
                            }, function(err) {
                                PageHelper.showErrors(err);
                            }).finally(function() {
                                PageHelper.hideLoader();
                            });
                        }
                        else{
                            DeathMarking.postCustomerDeathMarking(req).$promise.then(function(resp) {
                                PageHelper.showProgress("customerdeathmarking-pages", "Page customer death marking saved", 3000);
                                irfNavigator.goBack();
                            }, function(err) {
                                PageHelper.showErrors(err);
                            }).finally(function() {
                                PageHelper.hideLoader();
                            });

                        }
                    });
                },
            }
        };
    }
]);
