irf.pageCollection.factory(irf.page("customer360.CustomerDeathMarking"), ["$log", "irfNavigator", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "translateFilter", "$stateParams", "SchemaResource",
    function($log, irfNavigator, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, translateFilter, $stateParams, SchemaResource) {
       
            return {
            "type": "schema-form",
            "title": "DEATH_MARKING",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {   
                PageHelper.showLoader();              
                    var defered = $q.defer();                     
                model.deathMarking = {}; 
                 var customerId = $stateParams.pageId.split(':');
                Enrollment.getCustomerById({
                    id: customerId
                }).$promise.then(function(resp) {
                                  
                    model.deathMarking.familyMemberName = resp.firstName;
                    model.deathMarking.familyMembers = resp.familyMembers;                    
                        for(var i=0; i<resp.familyMembers.length; i++){
                            if(resp.familyMembers[i].relationShip == "self"){                               
                                model.deathMarking.dateOfBirth = resp.familyMembers[i].dateOfBirth;
                                model.deathMarking.familyMemberRelation = resp.familyMembers[i].relationShip;
                                model.deathMarking.familyMemberId = resp.familyMembers[i].familySequenceId;
                                model.deathMarking.dead = resp.familyMembers[i].dead;
                                Queries.deseaseDetails(customerId).then(function(response) {
                                    model.deceaseDetails = response.results;
                                    for(var i=0; i < model.deceaseDetails.length; i++){                                   
                                    if( resp.familyMembers[i].relationShip =='self'){
                                    model.deathMarking.comments =  model.deceaseDetails[i].comments || {};
                                    model.deathMarking.family_member_id =  model.deceaseDetails[i].family_member_id || {};
                                    model.deathMarking.furtherDetails =  model.deceaseDetails[i].further_details || {};
                                    model.deathMarking.reasonForDeath =  model.deceaseDetails[i].reason_for_death || {};
                                    model.deathMarking.dateOfDeath =  model.deceaseDetails[i].date_of_incident || {};
                                    model.deathMarking.deathMarkingStatus =  model.deceaseDetails[i].admin_confirmation_status || {};
                                    }
                                    }
                                });
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
                                    else{ model.deathMarking.comments =  "";
                                    model.deathMarking.family_member_id = "";
                                    model.deathMarking.furtherDetails =  "";
                                    model.deathMarking.reasonForDeath = "";
                                    model.deathMarking.dateOfDeath = "";
                                     model.deathMarking.deathMarkingStatus = "";
                                    }
                                }

                            },
                            required: true
                        },
                        {
                            key: "deathMarking.familyMemberRelation",//form element type select( dropdown)
                            type: "string",
                            title:"FAMILY_MEMBER_RELATION",
                            readonly:true
                        },
                        {
                            key: "deathMarking.familyMemberId",//form element type select( dropdown)
                            type: "number",
                            title:"FAMILY_MEMBER_ID",        
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
                            condition:"model.deathMarking.familyMemberId == model.deathMarking.family_member_id",                                      
                            type: "date",
                            readonly:true
                        },
                        {
                            key: "deathMarking.dateOfDeath",
                            title: "DATE_OF_DEATH",
                            condition:"model.deathMarking.family_member_id =='' || model.deathMarking.familyMemberId != model.deathMarking.family_member_id",                                      
                            type: "date"
                        },
                        {
                            key: "deathMarking.deathMarkingStatus",
                            title: "DEATH_MARKING_STATUS",
                            type: "select",
                            readonly:true,
                            condition:"model.deathMarking.familyMemberId == model.deathMarking.family_member_id", 
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
                            condition:"model.deathMarking.familyMemberId == model.deathMarking.family_member_id",                                      
                                
                        },
                        {
                            key: "deathMarking.furtherDetails",
                            title: "FURTHER_DETAILS",
                            type: "select",
                            readonly:true,
                            condition: "model.deathMarking.familyMemberId == model.deathMarking.family_member_id && model.deathMarking.reasonForDeath != 'SUCIDE'",
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
                            condition:"model.deathMarking.familyMemberId == model.deathMarking.family_member_id",                                      
                            
                        },
                        {
                            key: "deathMarking.reasonForDeath",
                            title: "REASON_FOR_DEATH",
                            condition:"model.deathMarking.family_member_id =='' || model.deathMarking.familyMemberId != model.deathMarking.family_member_id",                                      
                            type: "select",
                            required: true,
                            enumCode: "reason_for_death"                          
                           
                        },
                        {
                            key: "deathMarking.furtherDetails",
                            title: "FURTHER_DETAILS",
                            type: "select",
                            condition: "model.deathMarking.familyMemberId != model.deathMarking.family_member_id && model.deathMarking.reasonForDeath != 'SUCIDE'",
                            required: true,
                            parentEnumCode:"reason_for_death",
                            parentValueExpr:"model.deathMarking.reasonForDeath",
                            enumCode: "further_details"
                        },
                        {
                            key: "deathMarking.comments",
                            type: "textarea",
                            condition:"model.deathMarking.family_member_id =='' || model.deathMarking.familyMemberId != model.deathMarking.family_member_id",
                            title:"COMMENTS"
                        },
                    ]
                },
                {
                    type: "actionbox",
                    condition:"model.deathMarking.familyMemberId != model.deathMarking.family_member_id",
                    items: [
                        {
                            type: "submit",
                            title: "SUBMIT",                           
                        }                    
                    ]
                },{
                    type: "actionbox",
                    items: [
                        {
                            type: "button",
                            title: "BACK",
                            onClick: function(model, form, formName) {
                                irfNavigator.goBack();
                            }
                            
                        }                      
                    ]
                }
                
            ],
            schema: function() {               
                return Enrollment.getCustomerDeathMarking().$promise;
            },
            actions: {
                submit: function(model, form, formName) {    
                    
                    
                    for (var i = 0; i < model.deathMarking.familyMembers.length; i++) {
                if(model.deathMarking.familyMemberId == model.deathMarking.familyMembers[i].familySequenceId){
                    model.deathMarking.familyMembers.customerId = model.deathMarking.familyMembers[i].customerId;
                    model.deathMarking.familyMembers.enrollmentId = model.deathMarking.familyMembers[i].enrollmentId;
                    model.deathMarking.familyMembers.familyMemberFirstName = model.deathMarking.familyMembers[i].familyMemberFirstName;
                }
                    }
                    var req = {
                        //adminConfirmationStatus: "1",
                        "comments": model.deathMarking.comments,
                        "customerId": model.deathMarking.familyMembers.customerId,
                        "dateOfBirth": model.deathMarking.dateOfBirth,
                        "dateOfIncident":  model.deathMarking.dateOfDeath,
                        "famillyEnrollmentId": model.deathMarking.familyMembers.enrollmentId,
                        "familyMemberId": model.deathMarking.familyMemberId,
                        "familyMemberRelation": model.deathMarking.familyMemberRelation,
                        "familyMemberName": model.deathMarking.familyMembers.familyMemberFirstName,
                        "furtherDetails": model.deathMarking.furtherDetails,
                        "reasonForDeath": model.deathMarking.reasonForDeath,
                    };
                   // req.parameter.push(parameter_list);
                    Utils.confirm("Are you sure?").then(function() {
                        PageHelper.showLoader();
                        Enrollment.postCustomerDeathMarking(req).$promise.then(function(resp) {
                            PageHelper.showProgress("customerdeathmarking-pages", "Page customer death marking saved", 3000);
                            irfNavigator.goBack();
                        }, function(err) {
                            PageHelper.showErrors(err);
                        }).finally(function() {
                            PageHelper.hideLoader();
                        });
                    });
                },
            }
        };
    }
]);