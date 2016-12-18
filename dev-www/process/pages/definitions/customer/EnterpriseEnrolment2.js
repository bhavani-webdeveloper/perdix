irf.pageCollection.factory(irf.page("customer.EnterpriseEnrolment2"),
["$log", "$q","Enrollment", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager",
function($log, $q, Enrollment, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager){

    var branch = SessionStore.getBranch();   

    var validateRequest = function(req){
        if (req.customer && req.customer.customerBankAccounts) {
            for (var i=0; i<req.customer.customerBankAccounts.length; i++){
                var bankAccount = req.customer.customerBankAccounts[i];
                if (bankAccount.accountNumber!=bankAccount.confirmedAccountNumber){
                    PageHelper.showProgress('validate-error', 'Bank Accounts: Account Number doesnt match with Confirmed Account Number', 5000);
                    return false;
                }
            }
        }
        return true;
    }

    return {
        "type": "schema-form",
        "title": "ENTITY_ENROLLMENT",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            model.currentStage = bundleModel.currentStage;
            if (_.hasIn(model, 'loanRelation')){
                console.log(model.loanRelation);
                var custId = model.loanRelation.customerId;
                Enrollment.getCustomerById({id:custId})
                    .$promise
                    .then(function(res){
                        model.customer = res;

                        if(model.customer.enterpriseCustomerRelations)
                        {
                            var linkedIds = [];
                            for(i=0;i<model.customer.enterpriseCustomerRelations.length;i++) {
                                linkedIds.push(model.customer.enterpriseCustomerRelations[i].linkedToCustomerId);
                            };
                            
                            Queries.getCustomerBasicDetails({
                                "ids": linkedIds
                            }).then(function(result) {
                                if (result && result.ids) {
                                    for (var i = 0; i < model.customer.enterpriseCustomerRelations.length; i++) {
                                        var cust = result.ids[model.customer.enterpriseCustomerRelations[i].linkedToCustomerId];
                                        if (cust) {
                                            model.customer.enterpriseCustomerRelations[i].linkedToCustomerName = cust.first_name;
                                        }
                                    }
                                }
                            });
                        }

                    }, function(httpRes){
                        PageHelper.showErrors(httpRes);
                    })
                    .finally(function(){
                        PageHelper.hideLoader();
                    })
            } else {
                if (bundlePageObj){
                    model._bundlePageObj = bundlePageObj;
                }
                model.customer = model.customer || {};
                 if (!_.hasIn(model.customer, 'enterprise') || model.customer.enterprise==null){
                     model.customer.enterprise = {};
                 }
                //model.branchId = SessionStore.getBranchId() + '';
                //model.customer.kgfsName = SessionStore.getBranch();
                model.customer.customerType = "Enterprise";
                var branch1 = formHelper.enum('branch_id').data;
                for (var i = 0; i < branch1.length; i++) {
                    if ((branch1[i].name) == SessionStore.getBranch()) {
                        model.customer.customerBranchId = branch1[i].value;
                    }
                }
                var centres = SessionStore.getCentres();
                var centreName = [];
                for (var i = 0; i < centres.length; i++) {
                    centreName.push(centres[i].id);
                }
                model.customer.centreId = centreName[0];
                model.customer.enterpriseCustomerRelations = model.customer.enterpriseCustomerRelations || [];
            }   
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                item.customer.firstName,
                item.customer.centreCode,
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
            }
        },
        form: [
            {
                "type": "box",
                "title": "ENTITY_INFORMATION",
                "condition": "model.currentStage=='Screening' || model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                "items": [
                    {
                        "key": "customer.id",
                        "title": "LOAD_EXISTING_CUSTOMER",
                        "type": "lov",
                        "lovonly": true,
                        "inputMap": {
                            "firstName": {
                                "key": "customer.firstName",
                                "title": "CUSTOMER_NAME"
                            },
                            "kgfsName": {
                                "key": "customer.kgfsName",
                                "type": "select",
                                "screenFilter": true
                            },
                            "centreId": {
                                "key": "customer.centreId",
                                "type": "select",
                                "screenFilter": true
                            }
                        },
                        "outputMap": {
                            "urnNo": "customer.urnNo",
                            "firstName":"customer.firstName"
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var promise = Enrollment.search({
                                'branchName': inputModel.kgfsName ||SessionStore.getBranch(),
                                'firstName': inputModel.firstName,
                                'centreId':inputModel.centreId,
                                'customerType':"enterprise"
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                [data.firstName, data.fatherFirstName].join(' | '),
                                data.id,
                                data.urnNo
                            ];
                        },
                        onSelect: function(valueObj, model, context){
                            PageHelper.showProgress('customer-load', 'Loading customer...');
                            Enrollment.getCustomerById({id: valueObj.id})
                                .$promise
                                .then(function(res){
                                    PageHelper.showProgress("customer-load", "Done..", 5000);
                                    model.customer = Utils.removeNulls(res, true);
                                    BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                                }, function(httpRes){
                                    PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
                                })
                        }
                    },
                    {
                        key: "customer.customerBranchId",
                        title:"BRANCH_NAME",
                        readonly:true,
                        type: "select"
                    },
                    {
                        key: "customer.id",
                        condition: "model.customer.id",
                        title:"ENTITY_ID",
                        readonly: true
                    },
                    {
                        key: "customer.urnNo",
                        condition: "model.customer.urnNo",
                        title:"URN_NO",
                        readonly: true
                    },
                    {
                        key:"customer.centreId",
                        type:"select",
                        title:"CENTRE_NAME",
                        /*filter: {
                            "parentCode": "model.branch_id"
                        },*/
                        parentValueExpr:"model.customer.customerBranchId",
                        parentEnumCode:"branch_id",
                    },
                    {
                        key: "customer.oldCustomerId",
                        title:"ENTITY_ID",
                        titleExpr:"('ENTITY_ID'|translate)+' (Artoo)'",
                        condition: "model.customer.oldCustomerId",
                        readonly: true
                    },
                    {
                        key: "customer.firstName",
                        title:"ENTITY_NAME"
                    },
                    {
                        key: "customer.enterprise.referredBy",
                        title:"SOURCED",
                        required:true,
                        type: "select",
                        enumCode: "referredBy"
                    },
                    {
                        key: "customer.enterprise.referredName",
                        condition: "model.customer.enterprise.referredBy == 'Channel Partner'||model.customer.enterprise.referredBy =='Peer Referral'||model.customer.enterprise.referredBy =='Known supply chain'",
                        title:"REFERRED_NAME"
                    },/*
                    {
                        key: "customer.enterprise.businessName",
                        title:"COMPANY_NAME"
                    },*/
                    { /*TODO Not working when this is enabled */
                       key: "customer.enterprise.companyOperatingSince",
                       title:"OPERATING_SINCE",
                       type: "date"
                    },
                    {
                        "key": "customer.latitude",
                        "title": "BUSINESS_LOCATION",
                        "type": "geotag",
                        "latitude": "customer.latitude",
                        "longitude": "customer.longitude"
                    },
                    {
                        key: "customer.enterprise.ownership",
                        title: "OWNERSHIP",
                        type: "select",
                        required:true,
                        enumCode: "ownership"
                    },
                    {
                        key: "customer.enterprise.businessConstitution",
                        title: "CONSTITUTION",
                        type: "select",
                        enumCode: "constitution"
                    },
                    {
                        key: "customer.enterprise.businessHistory",
                        title: "BUSINESS_HISTORY",
                        required:true,
                        type: "select",
                        enumCode: "business_history"
                    },
                    {
                        key: "customer.enterprise.noOfPartners",
                        title: "NO_OF_PARTNERS",
                        type: "select",
                        condition: "model.customer.enterprise.businessConstitution=='Partnership'",
                        titleMap: {
                            "2": "2",
                            "3": "3",
                            "4": "4",
                            ">4": ">4",
                        }
                    },
                    {
                        key: "customer.enterprise.anyPartnerOfPresentBusiness",
                        title: "HAS_ANYONE_ELSE_PARTNER",
                        type: "select",
                        enumCode: "decisionmaker"
                    },
                    {
                        key: "customer.enterprise.partnershipDissolvedDate",
                        title: "PREVIOUS_PARTNERSHIP_DISSOLVED_DATE",
                        condition: "model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'",
                        type: "date"
                    },
                    {
                        key: "customer.enterprise.companyRegistered",
                        type: "select",
                        enumCode: "decisionmaker",
                        title: "IS_REGISTERED"
                    },
                    {
                        key: "customer.enterpriseRegistrations",
                        type: "array",
                        title: "REGISTRATION_DETAILS",
                        condition: "model.customer.enterprise.companyRegistered === 'YES'",
                        items: [
                            {
                                key: "customer.enterpriseRegistrations[].registrationType",
                                title: "REGISTRATION_TYPE",
                                type: "select",
                                enumCode: "business_registration_type"
                            },
                            {
                                key: "customer.enterpriseRegistrations[].registrationNumber",
                               title: "REGISTRATION_NUMBER"
                            },
                            {
                                key: "customer.enterpriseRegistrations[].registeredDate",
                                type: "date",
                                title: "REGISTRATION_DATE"
                            },
                            {
                                key: "customer.enterpriseRegistrations[].expiryDate",
                                type: "date",
                                title: "VALID_UPTO"
                            },
                            {
                                key:"customer.enterpriseRegistrations[].documentId",
                                type:"file",
                                required: true,
                                title:"REGISTRATION_DOCUMENT",
                                category:"CustomerEnrollment",
                                subCategory:"REGISTRATIONDOCUMENT",
                                fileType:"application/pdf",
                                using: "scanner"
                            }
                        ]
                    },/*,
                    {
                        key: "customer.enterprise.registrationType",
                        condition: "model.customer.enterprise.companyRegistered === 'YES'",
                        title: "REGISTRATION_TYPE",
                        type: "select",
                        enumCode: "business_registration_type"
                    },
                    {
                        key: "customer.enterprise.registrationNumber",
                        condition: "model.customer.enterprise.companyRegistered === 'YES'",
                        title: "REGISTRATION_NUMBER"
                    },
                    {
                        key: "customer.enterprise.registrationDate",
                        condition: "model.customer.enterprise.companyRegistered === 'YES'",
                        type: "date",
                        title: "REGISTRATION_DATE"
                    }*/
                    {
                        key: "customer.enterprise.businessType",
                        title: "BUSINESS_TYPE",
                        type: "select",
                        enumCode: "businessType"
                    },
                    {
                        key: "customer.enterprise.businessActivity",
                        title: "BUSINESS_ACTIVITY",
                        type: "select",
                        enumCode: "businessActivity",
                        parentEnumCode: "businessType",
                        parentValueExpr:"model.customer.enterprise.businessType",
                    },
                    {
                        key: "customer.enterprise.businessSector",
                        title: "BUSINESS_SECTOR",
                        type: "select",
                        enumCode: "businessSector",
                        parentEnumCode: "businessType",
                        parentValueExpr:"model.customer.enterprise.businessType",
                    },
                    {
                        key: "customer.enterprise.businessSubsector",
                        title: "BUSINESS_SUBSECTOR",
                        type: "select",
                        enumCode: "businessSubSector",
                        parentEnumCode: "businessSector",
                        parentValueExpr:"model.customer.enterprise.businessSector",
                    },
                    {
                        key: "customer.enterprise.itrAvailable",
                        title: "ITR_AVAILABLE",
                        type: "select",
                        enumCode: "decisionmaker"
                    },
                    {
                        key: "customer.enterprise.electricityAvailable",
                        title: "ELECTRICITY_AVAIALBLE",
                        type: "select",
                        enumCode: "decisionmaker",
                        required: true
                    },
                    {
                        key: "customer.enterprise.spaceAvailable",
                        title: "SPACE_AVAILABLE",
                        type: "select",
                        enumCode: "decisionmaker",
                        required: true
                    },
                    {
                        key: "customer.enterpriseCustomerRelations",
                        type: "array",
                        startEmpty: true,
                        title: "RELATIONSHIP_TO_BUSINESS",
                        items: [
                            {
                                key: "customer.enterpriseCustomerRelations[].relationshipType",
                                title: "RELATIONSHIP_TYPE",
                                type: "select",
                                enumCode: "relationship_type"
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].linkedToCustomerId",
                                type: "lov",
                                title: "CUSTOMER_ID",
                                inputMap: {
                                    "firstName": {
                                        "key": "customer.firstName",
                                        "title": "CUSTOMER_NAME"
                                    },
                                    "branchName": {
                                        "key": "customer.kgfsName",
                                        "type": "select"
                                    },
                                    "centreId": {
                                        "key": "customer.centreId",
                                        "type": "select",
                                        title:"CENTRE_NAME"
                                    }
                                },
                                outputMap: {
                                    "id": "customer.enterpriseCustomerRelations[arrayIndex].linkedToCustomerId",
                                    "firstName": "customer.enterpriseCustomerRelations[arrayIndex].linkedToCustomerName"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form, model) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    $log.info("inputModel.centreId: " + inputModel.centreId);
                                    if (!inputModel.branchName)
                                        inputModel.branchName = SessionStore.getBranch();
                                    var promise = Enrollment.search({
                                        'branchName': inputModel.branchName,
                                        'firstName': inputModel.firstName,
                                        'centreId': inputModel.centreId,
                                        'customerType': 'Individual'
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        [data.firstName, data.fatherFirstName].join(' '),
                                        data.id
                                    ];
                                }
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].linkedToCustomerName",
                                readonly: true,
                                title: "CUSTOMER_NAME"
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].businessInvolvement",
                                title: "BUSINESS_INVOLVEMENT",
                                required:true,
                                type: "select",
                                enumCode: "business_involvement"
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].partnerOfAnyOtherCompany",
                                title: "PARTNER_OF_ANY_OTHER_COMPANY",
                                type: "select",
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].otherBusinessClosed",
                                title: "OTHER_BUSINESS_CLOSED",
                                type: "select",
                                enumCode: "decisionmaker",
                                condition:"model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany == 'YES'"
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].otherBusinessClosureDate",
                                type: "date",
                                title: "OTHER_BUSINESS_CLOSE_DATE",
                                condition:"model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "box",
                "title": "ENTITY_INFORMATION",
                "condition": "model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                readonly:true,
                "items": [
                    {
                        "key": "customer.firstName",
                        "title":"CUSTOMER_NAME"
                    },
                    {
                        key: "customer.customerBranchId",
                        title:"BRANCH_NAME",
                        type: "select"
                    },
                    {
                        key: "customer.id",
                        condition: "model.customer.id",
                        title:"ENTITY_ID",
                        parentEnumCode:"branch_id",
                        parentValueExpr:"model.customer.customerBranchId",
                        readonly: true
                    },
                    {
                        key: "customer.urnNo",
                        condition: "model.customer.urnNo",
                        title:"URN_NO",
                        readonly: true
                    },
                    {
                        key:"customer.centreId",
                        type:"select",
                        title:"CENTRE_NAME"
                    },
                    {
                        key: "customer.oldCustomerId",
                        title:"ENTITY_ID",
                        titleExpr:"('ENTITY_ID'|translate)+' (Artoo)'",
                        condition: "model.customer.oldCustomerId",
                        readonly: true
                    },
                    {
                        key: "customer.firstName",
                        title:"ENTITY_NAME"
                    },
                    {
                        key: "customer.enterprise.referredBy",
                        title:"SOURCED",
                        type: "select",
                        enumCode: "referredBy"
                    },
                    {
                        key: "customer.enterprise.referredName",
                        title:"REFERRED_NAME"
                    },
                    {
                       key: "customer.enterprise.companyOperatingSince",
                       title:"OPERATING_SINCE",
                       required:true,
                       type: "date"
                    },
                    {
                        "key": "customer.latitude",
                        "title": "BUSINESS_LOCATION",
                        "type": "geotag",
                        "latitude": "customer.latitude",
                        "longitude": "customer.longitude"
                    },
                    {
                        key: "customer.enterprise.ownership",
                        title: "OWNERSHIP",
                        type: "select",
                        enumCode: "ownership"
                    },
                    {
                        key: "customer.enterprise.businessConstitution",
                        title: "CONSTITUTION",
                        type: "select",
                        enumCode: "constitution"
                    },
                    {
                        key: "customer.enterprise.businessHistory",
                        title: "BUSINESS_HISTORY",
                        type: "select",
                        enumCode: "business_history"
                    },
                    {
                        key: "customer.enterprise.noOfPartners",
                        title: "NO_OF_PARTNERS",
                        type: "select",
                        condition: "model.customer.enterprise.businessConstitution=='Partnership'",
                        titleMap: {
                            "2": "2",
                            "3": "3",
                            "4": "4",
                            ">4": ">4",
                        }
                    },
                    {
                        key: "customer.enterprise.anyPartnerOfPresentBusiness",
                        title: "HAS_ANYONE_ELSE_PARTNER",
                        type: "string"
                    },
                    {
                        key: "customer.enterprise.partnershipDissolvedDate",
                        title: "PREVIOUS_PARTNERSHIP_DISSOLVED_DATE",
                        condition: "model.customer.enterprise.anyPartnerOfPresentBusiness=='Yes' || model.customer.enterprise.anyPartnerOfPresentBusiness=='YES'",
                        type: "date"
                    },
                    {
                        key: "customer.enterprise.companyRegistered",
                        type: "select",
                        titleMap: {
                            "YES": "Yes",
                            "NO": "No"
                        },
                        title: "IS_REGISTERED"
                    },
                    {
                        key: "customer.enterpriseRegistrations",
                        type: "array",
                        title: "REGISTRATION_DETAILS",
                        condition: "model.customer.enterprise.companyRegistered === 'YES'",
                        items: [
                            {
                                key: "customer.enterpriseRegistrations[].registrationType",
                                title: "REGISTRATION_TYPE",
                                type: "select",
                                enumCode: "business_registration_type"
                            },
                            {
                                key: "customer.enterpriseRegistrations[].registrationNumber",
                               title: "REGISTRATION_NUMBER"
                            },
                            {
                                key: "customer.enterpriseRegistrations[].registeredDate",
                                type: "date",
                                title: "REGISTRATION_DATE"
                            },
                            {
                                key: "customer.enterpriseRegistrations[].expiryDate",
                                type: "date",
                                title: "VALID_UPTO"
                            },
                            {
                                key:"customer.enterpriseRegistrations[].documentId",
                                type:"file",
                                required: true,
                                title:"REGISTRATION_DOCUMENT",
                                category:"CustomerEnrollment",
                                subCategory:"REGISTRATIONDOCUMENT",
                                fileType:"application/pdf",
                                using: "scanner"
                            }
                        ]
                    }/*,
                    {
                        key: "customer.enterprise.registrationType",
                        condition: "model.customer.enterprise.companyRegistered === 'YES'",
                        title: "REGISTRATION_TYPE",
                        type: "select",
                        enumCode: "business_registration_type"
                    },
                    {
                        key: "customer.enterprise.registrationNumber",
                        condition: "model.customer.enterprise.companyRegistered === 'YES'",
                        title: "REGISTRATION_NUMBER"
                    },
                    {
                        key: "customer.enterprise.registrationDate",
                        condition: "model.customer.enterprise.companyRegistered === 'YES'",
                        type: "date",
                        title: "REGISTRATION_DATE"
                    }*/,

                    {
                        key: "customer.enterprise.businessType",
                        title: "BUSINESS_TYPE",
                        type: "select",
                        enumCode: "businessType"
                    },
                    {
                        key: "customer.enterprise.businessActivity",
                        title: "BUSINESS_ACTIVITY",
                        type: "select",
                        enumCode: "businessActivity",
                    },
                    {
                        key: "customer.enterprise.businessSector",
                        title: "BUSINESS_SECTOR",
                        type: "select",
                        enumCode: "businessSector",
                        //parentValueExpr:"model.customer.enterprise.businessLine",
                    },
                    {
                        key: "customer.enterprise.businessSubsector",
                        title: "BUSINESS_SUBSECTOR",
                        type: "select",
                        enumCode: "businessSubSector",
                        // parentEnumCode: "businessSector",
                        //parentValueExpr:"model.customer.enterprise.businessSector",
                    },
                    {
                        key: "customer.enterprise.itrAvailable",
                        title: "ITR_AVAILABLE",
                        type: "string",
                        // enumCode: "decisionmaker"
                    },
                    {
                        key: "customer.enterprise.electricityAvailable",
                        title: "ELECTRICITY_AVAIALBLE",
                        type: "select",
                        enumCode: "decisionmaker",
                        required: true
                    },
                    {
                        key: "customer.enterprise.spaceAvailable",
                        title: "SPACE_AVAILABLE",
                        type: "select",
                        enumCode: "decisionmaker",
                        required: true
                    },
                    {
                        key: "customer.enterpriseCustomerRelations",
                        type: "array",
                        title: "RELATIONSHIP_TO_BUSINESS",
                        items: [
                            {
                                key: "customer.enterpriseCustomerRelations[].relationshipType",
                                title: "RELATIONSHIP_TYPE",
                                type: "select",
                                enumCode: "relationship_type"
                            },
                            {
                               key: "customer.enterpriseCustomerRelations[].linkedToCustomerId",
                               title: "CUSTOMER_ID",
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].linkedToCustomerName",
                                readonly: true,
                                title: "CUSTOMER_NAME"
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].businessInvolvement",
                                title: "BUSINESS_INVOLVEMENT",
                                type: "select",
                                enumCode: "business_involvement"
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].partnerOfAnyOtherCompany",
                                title: "PARTNER_OF_ANY_OTHER_COMPANY",
                                type: "select",
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].otherBusinessClosed",
                                title: "OTHER_BUSINESS_CLOSED",
                                type: "select",
                                enumCode: "decisionmaker",
                                condition:"model.customer.enterpriseCustomerRelations[arrayIndex].partnerOfAnyOtherCompany=='YES'"
                            },
                            {
                                key: "customer.enterpriseCustomerRelations[].otherBusinessClosureDate",
                                type: "date",
                                title: "OTHER_BUSINESS_CLOSE_DATE",
                                condition:"model.customer.enterpriseCustomerRelations[arrayIndex].otherBusinessClosed == 'YES'"
                            }
                        ]
                    }
                ]
            },
            {
                "type": "box",
                "title": "CONTACT_INFORMATION",
                "condition":"model.currentStage=='Screening' || model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                "items":[
                    "customer.mobilePhone",
                    "customer.landLineNo",
                    "customer.doorNo",
                    "customer.street",
                    "customer.enterprise.landmark",
                    {
                        key: "customer.pincode",
                        type: "lov",
                        fieldType: "number",
                        autolov: true,
                        inputMap: {
                            "pincode": "customer.pincode",
                            "district": {
                                key: "customer.district"
                            },
                            "state": {
                                key: "customer.state"
                            }
                        },
                        outputMap: {
                            "division": "customer.locality",
                            "region": "customer.villageName",
                            "pincode": "customer.pincode",
                            "district": "customer.district",
                            "state": "customer.state"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            if (!inputModel.pincode) {
                                return $q.reject();
                            }
                            return Queries.searchPincodes(inputModel.pincode, inputModel.district, inputModel.state);
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.division + ', ' + item.region,
                                item.pincode,
                                item.district + ', ' + item.state
                            ];
                        }
                    },
                    "customer.locality",
                    "customer.villageName",
                    "customer.district",
                    "customer.state",
                    {
                       key: "customer.distanceFromBranch",
                       type: "select",
                       enumCode: "distance_from_branch",
                       title: "DISTANCE_FROM_BRANCH"
                    },
                    {
                       key: "customer.enterprise.businessInPresentAreaSince", // customer.enterprise.businessInPresentAreaSince
                       type: "select",
                       required:true,
                       enumCode: "years_in_present_area",
                       title: "YEARS_OF_BUSINESS_PRESENT_AREA"
                    },
                    {
                        key: "customer.enterprise.businessInCurrentAddressSince", // customer.enterprise.businessInCurrentAddressSince
                        type: "select",
                        required:true,
                        enumCode: "years_in_current_address",
                        title: "YEARS_OF_BUSINESS_PRESENT_ADDRESS"
                    }
                ]
            },
            {
                "type": "box",
                "title": "CONTACT_INFORMATION",
                "condition":"model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                readonly:true,
                "items":[
                    "customer.mobilePhone",
                    "customer.landLineNo",
                    "customer.doorNo",
                    "customer.street",
                    "customer.enterprise.landmark",
                    {
                        key: "customer.pincode",
                        fieldType: "number"
                    },
                    "customer.locality",
                    "customer.villageName",
                    "customer.district",
                    "customer.state",
                    {
                       key: "customer.distanceFromBranch",
                       type: "select",
                       enumCode: "distance_from_branch",
                       title: "DISTANCE_FROM_BRANCH"
                    },
                    {
                       key: "customer.enterprise.businessInPresentAreaSince", // customer.enterprise.businessInPresentAreaSince
                       type: "string",
                       // enumCode: "years_in_present_area",
                       title: "YEARS_OF_BUSINESS_PRESENT_AREA"
                    },
                    {
                        key: "customer.enterprise.businessInCurrentAddressSince", // customer.enterprise.businessInCurrentAddressSince
                        type: "string",
                        // enumCode: "years_in_current_address",
                        title: "YEARS_OF_BUSINESS_PRESENT_ADDRESS"
                    }
                ]
            },
            {
                type: "box",
                title: "BANK_ACCOUNTS",
                "condition":"model.currentStage=='Screening' || model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                items: [
                    {
                        key: "customer.customerBankAccounts",
                        type: "array",
                        title: "BANK_ACCOUNTS",
                        startEmpty: true,
                        items: [
                            {
                                key: "customer.customerBankAccounts[].ifscCode",
                                type: "lov",
                                lovonly: true,
                                inputMap: {
                                    "ifscCode": {
                                        "key": "customer.customerBankAccounts[].ifscCode"
                                    },
                                    "bankName": {
                                        "key": "customer.customerBankAccounts[].customerBankName"
                                    },
                                    "branchName": {
                                        "key": "customer.customerBankAccounts[].customerBankBranchName"
                                    }
                                },
                                outputMap: {
                                    "bankName": "customer.customerBankAccounts[arrayIndex].customerBankName",
                                    "branchName": "customer.customerBankAccounts[arrayIndex].customerBankBranchName",
                                    "ifscCode": "customer.customerBankAccounts[arrayIndex].ifscCode"
                                },
                                searchHelper: formHelper,
                                search: function(inputModel, form) {
                                    $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                    var promise = CustomerBankBranch.search({
                                        'bankName': inputModel.bankName,
                                        'ifscCode': inputModel.ifscCode,
                                        'branchName': inputModel.branchName
                                    }).$promise;
                                    return promise;
                                },
                                getListDisplayItem: function(data, index) {
                                    return [
                                        data.ifscCode,
                                        data.branchName,
                                        data.bankName
                                    ];
                                }
                            },
                            {
                                key: "customer.customerBankAccounts[].customerBankName",
                                readonly: true
                            },
                            {
                                key: "customer.customerBankAccounts[].customerBankBranchName",
                                readonly: true
                            },
                            {
                                key: "customer.customerBankAccounts[].customerNameAsInBank"
                            },
                            {
                                key: "customer.customerBankAccounts[].accountNumber",
                                type: "password"
                            },
                            {
                                key: "customer.customerBankAccounts[].confirmedAccountNumber"
                            },
                            {
                                key: "customer.customerBankAccounts[].accountType",
                                type: "select"
                            },
                            {
                                key: "customer.customerBankAccounts[].bankingSince",
                                type: "date",
                                title: "BANKING_SINCE"
                            },
                            {
                                key: "customer.customerBankAccounts[].netBankingAvailable",
                                type: "select",
                                title: "NET_BANKING_AVAILABLE",
                                enumCode:"decisionmaker"
                            },
                            {
                                key: "customer.customerBankAccounts[].sanctionedAmount",
                                condition:"model.customer.customerBankAccounts[arrayIndex].accountType =='OD'||model.customer.customerBankAccounts[arrayIndex].accountType =='CC'",
                                type: "amount",
                                required:true,
                                title: "SANCTIONED_AMOUNT"
                            },
                            {
                                key: "customer.customerBankAccounts[].limit",
                                type: "amount"
                            },
                            {
                                key: "customer.customerBankAccounts[].bankStatements",
                                type: "array",
                                title: "STATEMENT_DETAILS",
                                items: [
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].startMonth",
                                        type: "date",
                                        title: "START_MONTH"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].totalDeposits",
                                        type: "amount",
                                        title: "TOTAL_DEPOSITS"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].totalWithdrawals",
                                        type: "amount",
                                        title: "TOTAL_WITHDRAWALS"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].balanceAsOn15th",
                                        type: "amount",
                                        title: "BALANCE_AS_ON_15TH"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].noOfChequeBounced",
                                        type: "amount",
                                        //maximum:99,
                                        required:true,
                                        title: "NO_OF_CHEQUE_BOUNCED"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].noOfEmiChequeBounced",
                                        type: "amount",
                                        required:true, 
                                        //maximum:99,                                     
                                        title: "NO_OF_EMI_CHEQUE_BOUNCED"
                                    },
                                ]
                            },
                            {
                                key: "customer.customerBankAccounts[].isDisbersementAccount",
                                type: "radios",
                                titleMap: [{
                                    value: true,
                                    name: "Yes"
                                },{
                                    value: false,
                                    name: "No"
                                }]
                            }
                        ]
                    }
                ]
            },
            {
                type: "box",
                title: "BANK_ACCOUNTS",
                "condition":"model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                readonly:true,
                items: [
                    {
                        key: "customer.customerBankAccounts",
                        type: "array",
                        title: "BANK_ACCOUNTS",
                        startEmpty: true,
                        items: [
                            {
                                key: "customer.customerBankAccounts[].ifscCode"
                            },
                            {
                                key: "customer.customerBankAccounts[].customerBankName",
                                readonly: true
                            },
                            {
                                key: "customer.customerBankAccounts[].customerBankBranchName",
                                readonly: true
                            },
                            {
                                key: "customer.customerBankAccounts[].customerNameAsInBank"
                            },
                            {
                                key: "customer.customerBankAccounts[].accountNumber"
                            },
                            {
                                key: "customer.customerBankAccounts[].confirmedAccountNumber"
                            },
                            {
                                key: "customer.customerBankAccounts[].accountType",
                                type: "select"
                            },
                            {
                                key: "customer.customerBankAccounts[].bankingSince",
                                type: "date",
                                title: "BANKING_SINCE"
                            },
                            {
                                key: "customer.customerBankAccounts[].netBankingAvailable",
                                type: "string",
                                title: "NET_BANKING_AVAILABLE",
                                //enumCode:"decisionmaker"
                            },
                            {
                                key: "customer.customerBankAccounts[].sanctionedAmount",
                                condition:"model.customer.customerBankAccounts[arrayIndex].accountType =='OD'||model.customer.customerBankAccounts[arrayIndex].accountType =='CC'",
                                type: "amount",
                                title: "SANCTIONED_AMOUNT"
                            },
                            {
                                key: "customer.customerBankAccounts[].limit",
                                type: "amount"
                            },
                            {
                                key: "customer.customerBankAccounts[].bankStatements",
                                type: "array",
                                title: "STATEMENT_DETAILS",
                                items: [
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].startMonth",
                                        type: "date",
                                        title: "START_MONTH"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].totalDeposits",
                                        type: "amount",
                                        required:true,
                                        title: "TOTAL_DEPOSITS"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].totalWithdrawals",
                                        type: "amount",
                                        title: "TOTAL_WITHDRAWALS"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].balanceAsOn15th",
                                        type: "amount",
                                        title: "BALANCE_AS_ON_15TH"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].noOfChequeBounced",
                                        type: "amount",
                                        title: "NO_OF_CHEQUE_BOUNCED"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].noOfEmiChequeBounced",
                                        type: "amount",
                                        title: "NO_OF_EMI_CHEQUE_BOUNCED"
                                    },
                                ]
                            },
                            {
                                key: "customer.customerBankAccounts[].isDisbersementAccount",
                                type: "radios",
                                titleMap: [{
                                    value: true,
                                    name: "Yes"
                                },{
                                    value: false,
                                    name: "No"
                                }]
                            }
                        ]
                    }
                ]
            },
            {
               type:"box",
               title:"COMPANY_LIABILITIES",
               "condition":"model.currentStage=='Screening' || model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                items:[
                    {
                       key:"customer.liabilities",
                       type:"array",
                       startEmpty: true,
                       title:"LIABILITIES",
                       items:[
                           {
                               key:"customer.liabilities[].loanType",
                               type:"select",
                               enumCode:"liability_loan_type" 
                           },
                           {
                               key:"customer.liabilities[].loanSource",
                                type:"select",
                                enumCode:"loan_source"
                           },
                           "customer.liabilities[].instituteName",
                           {
                               key: "customer.liabilities[].loanAmountInPaisa",
                               type: "amount"
                           },
                           {
                               key: "customer.liabilities[].installmentAmountInPaisa",
                               type: "amount"
                           },
                           {
                                key: "customer.liabilities[].outstandingAmountInPaisa",
                                type: "amount",
                                title: "OUTSTANDING_AMOUNT"
                           },
                           {
                               key: "customer.liabilities[].startDate",
                               type:"date"
                           },
                           {
                               key:"customer.liabilities[].maturityDate",
                               type:"date"
                           },
                           {
                                key: "customer.liabilities[].noOfInstalmentPaid",
                                type: "number",
                                title: "NO_OF_INSTALLMENT_PAID"
                           },
                           {
                               key:"customer.liabilities[].frequencyOfInstallment",
                               type:"select"
                           },
                           {
                               key:"customer.liabilities[].liabilityLoanPurpose",
                               /*type:"select",
                               enumCode: "loan_purpose_1"*/
                           },
                           {
                               key:"customer.liabilities[].interestOnly",
                               type:"radios",
                               title:"INTEREST_ONLY",
                               enumCode:"decisionmaker"
                           },
                           /*{
                               key:"customer.liabilities[].interestExpense",
                               title:"INTEREST_EXPENSE"
                           },
                           {
                               key:"customer.liabilities[].principalExpense",
                               title:"PRINCIPAL_EXPENSE"
                           }*/
                       ]
                    }
                ]
            },
            {
               type:"box",
               title:"HOUSEHOLD_LIABILITIES",
               "condition":"model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
               readonly:true,
                items:[
                    {
                       key:"customer.liabilities",
                       type:"array",
                       startEmpty: true,
                       title:"HOUSEHOLD_LIABILITIES",
                       items:[
                           {
                               key:"customer.liabilities[].loanType"/*,
                                type:"select"*/ //Made as free text till list of values are given by Kinara
                           },
                           {
                               key:"customer.liabilities[].loanSource"/*,
                                type:"select"*/ //Made as free text till list of values are given by Kinara
                           },
                           "customer.liabilities[].instituteName",
                           {
                               key: "customer.liabilities[].loanAmountInPaisa",
                               type: "amount"
                           },
                           {
                               key: "customer.liabilities[].installmentAmountInPaisa",
                               type: "amount"
                           },
                           {
                                key: "customer.liabilities[].outstandingAmountInPaisa",
                                type: "amount",
                                title: "OUTSTANDING_AMOUNT"
                           },
                           {
                               key: "customer.liabilities[].startDate",
                               type:"date"
                           },
                           {
                               key:"customer.liabilities[].maturityDate",
                               type:"date"
                           },
                           {
                                key: "customer.liabilities[].noOfInstalmentPaid",
                                type: "number",
                                title: "NO_OF_INSTALLMENT_PAID"
                           },
                           {
                               key:"customer.liabilities[].frequencyOfInstallment",
                               type:"select"
                           },
                           {
                               key:"customer.liabilities[].liabilityLoanPurpose",
                               /*type:"select",
                               enumCode: "loan_purpose_1"*/
                           },
                           {
                               key:"customer.liabilities[].interestOnly",
                               type:"radios",
                               title:"INTEREST_ONLY",
                               enumCode:"decisionmaker"
                           },
                          /* {
                               key:"customer.liabilities[].interestExpense",
                               title:"INTEREST_EXPENSE"
                           },
                           {
                               key:"customer.liabilities[].principalExpense",
                               title:"PRINCIPAL_EXPENSE"
                           }*/
                       ]
                    }
                ]
            },
            {
                type:"box",
                title:"CUSTOMER_BUYER_DETAILS",
                "condition":"model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                items:[
                    {
                      key:"customer.buyerDetails",
                       type:"array",
                       startEmpty: true,
                       title:"BUYER_DETAILS",
                       items:[
                            {
                                key: "customer.buyerDetails[].buyerName",
                                title: "BUYER_NAME",
                                type: "string"
                            }, 
                            {
                                key: "customer.buyerDetails[].customerSince",
                                title: "CUSTOMER_SINCE",
                                type: "select",
                                enumCode: "customer_since"
                            },
                            {
                                key: "customer.buyerDetails[].paymentDate",
                                title: "PAYMET_DATE",
                                type: "date"
                            },
                            {
                                key: "customer.buyerDetails[].paymentFrequency",
                                title: "PAYMENT_FREQUENCY",
                                type: "select",
                                enumCode: "payment_frequency"
                            },
                            {
                                key: "customer.buyerDetails[].paymentTerms",
                                title: "PAYEMNT_TERMS",
                                type: "select",
                                enumCode: "payment_terms"
                            },
                            {
                                key: "customer.buyerDetails[].product",
                                title:"PRODUCT",
                                type: "string"
                            }, 
                            {
                                key: "customer.buyerDetails[].sector",
                                title: "SECTOR",
                                type: "select",
                                enumCode: "businessSector"
                            },
                            {
                                key: "customer.buyerDetails[].subSector",
                                title: "SUBSECTOR",
                                type: "select",
                                parentEnumCode: "businessSector",
                                enumCode: "businessSubSector"
                            },
                            {
                                key: "customer.buyerDetails[].receivablesOutstanding",
                                title:"RECEIVABLES_OUTSTANDING_CUSTOMER_CREDIT",
                                type: "number"
                            },
                        ]
                    }
                ]
            },
            {
                "type": "box",
                "title": "SUPPLIERS_DEATILS",
                "condition":"model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                "items": [
                    {
                        key:"customer.supplierDetails",
                        title:"SUPPLIERS_DEATILS",
                        type: "array", 
                        items:[
                            {
                                key:"customer.supplierDetails[].supplierName",
                                title:"SUPPLIERS_NAME",
                                required:true,
                                type:"string"
                            },
                            {
                                key:"customer.supplierDetails[].supplierType",
                                title:"TYPE",
                                type:"select",
                                enumCode: "supplier_type"
                            },
                            {
                                key:"customer.supplierDetails[].paymentTerms",
                                title:"PAYMENT_TERMS_IN_DAYS",
                                type: "select",
                                enumCode: "payment_terms"
                            },
                            {
                                key:"customer.supplierDetails[].amount",
                                title:"PAYABLE_OUTSTANDING",
                                type:"amount"
                            },
                         ] 
                     }     
                ] 
            },
            {
                "type": "box",
                "title": "SUPPLIERS_DEATILS",
                "readonly": true,
                "condition":" model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                "items": [
                    {
                        key:"customer.supplierDetails",
                        title:"SUPPLIERS_DEATILS",
                        type: "array", 
                        items:[
                            {
                                key:"customer.supplierDetails[].supplierName",
                                title:"SUPPLIERS_NAME",
                                type:"string"
                            },
                            {
                                key:"customer.supplierDetails[].supplierType",
                                title:"TYPE",
                                type:"select",
                                enumCode: "supplier_type"
                            },
                            {
                                key:"customer.supplierDetails[].paymentTerms",
                                title:"PAYEMNT_TERMS_IN_DAYS",
                                type: "select",
                                enumCode: "payment_terms"
                                //type:" number"
                            },
                            {
                                key:"customer.supplierDetails[].amount",
                                title:"amount",
                                title:"PAYABLE_OUTSTANDING",
                            },
                         ] 
                     }     
                ] 
            },
            {
               type:"box",
               title:"CUSTOMER_BUYER_DETAILS",
               "condition":" model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
               readonly:true,
                items:[
                    {
                      key:"customer.buyerDetails",
                       type:"array",
                       startEmpty: true,
                       title:"BUYER_DETAILS",
                       items:[
                            {
                                key: "customer.buyerDetails[].buyerName",
                                title: "BUYER_NAME",
                                type: "string"
                            }, 
                            {
                                key: "customer.buyerDetails[].customerSince",
                                title: "CUSTOMER_SINCE",
                                type: "date"
                            },
                            
                            {
                                key: "customer.buyerDetails[].paymentDate",
                                title: "PAYMENT_DATE",
                                type: "date"
                            },
                            {
                                key: "customer.buyerDetails[].paymentFrequency",
                                title: "PAYMENT_FREQUENCY",
                                type: "select",
                                enumCode: "payment_frequency"
                            },
                            {
                                key: "customer.buyerDetails[].paymentTerms",
                                title: "PAYEMNT_TERMS",
                                type: "select",
                                enumCode: "payment_terms"
                            },
                            {
                                key: "customer.buyerDetails[].product",
                                title:"PRODUCT",
                                type: "string"
                            }, 
                            {
                                key: "customer.buyerDetails[].sector",
                                title: "SECTOR",
                                type: "select",
                                enumCode: "businessSector"
                            },
                            {
                                key: "customer.buyerDetails[].subSector",
                                title: "SUBSECTOR",
                                type: "string",
                                /*parentEnumCode: "businessSector",
                                enumCode: "businessSubSector"*/
                            },
                            {
                                key: "customer.buyerDetails[].receivablesOutstanding",
                                title:"RECEIVABLES_OUTSTANDING_CUSTOMER_CREDIT",
                                type: "number"
                            },
                        ]
                    }
                ]
            },
            {
               type:"box",
               title:"T_BUSINESS_FINANCIALS",
               "condition":"model.currentStage=='Screening' || model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                items:[
                    {
                        key: "customer.enterprise.monthlyTurnover",
                        title: "MONTHLY_TURNOVER",
                        required:true,
                        type: "amount"
                    },
                    {
                        key: "customer.enterprise.monthlyBusinessExpenses",
                        title: "MONTHLY_BUSINESS_EXPENSES",
                        type: "amount"
                    },
                    {
                        key: "customer.enterprise.avgMonthlyNetIncome",
                        title: "AVERAGE_MONTHLY_NET_INCOME",
                        type: "amount"
                    },
                    {
                        type:"section",
                        title:"INCOME_EXPENSE_INFORMATION",
                        condition: "model.currentStage == 'Application' || model.currentStage == 'FieldAppraisal'",
                        items: [
                            {
                                key:"customer.otherBusinessIncomes",
                                type:"array",
                                startEmpty: true,
                                title:"OTHER_BUSINESS_INCOME",
                                items:[
                                    {
                                        key: "customer.otherBusinessIncomes[].incomeSource",
                                        title: "INCOME_SOURCE",
                                        type: "select",
                                        required: true,
                                        enumCode:"occupation"
                                    },
                                    {
                                        key: "customer.otherBusinessIncomes[].amount",
                                        title: "AMOUNT",
                                        required: true,
                                        type: "amount"
                                    },
                                    {
                                        key: "customer.otherBusinessIncomes[].otherBusinessIncomeDate",
                                        title: "DATE",
                                        type: "date"
                                    },
                                ]
                            },
                            {
                                key:"customer.incomeThroughSales",
                                type:"array",
                                startEmpty: true,
                                title:"INCOMRE_THROUGH_SALES",
                                items:[
                                    {
                                        key: "customer.incomeThroughSales[].buyerName",
                                        type: "lov",
                                        autolov: true,
                                        required: true,
                                        title:"BUYER_NAME",
                                        bindMap: {
                                        },
                                        searchHelper: formHelper,
                                        search: function(inputModel, form, model, context) {
                                            var out = [];
                                            if (!model.customer.buyerDetails){
                                                return out;
                                            }
                                            for (var i=0; i<model.customer.buyerDetails.length; i++){
                                                out.push({
                                                    name: model.customer.buyerDetails[i].buyerName,
                                                    value: model.customer.buyerDetails[i].buyerName
                                                })
                                            }
                                            return $q.resolve({
                                                headers: {
                                                    "x-total-count": out.length
                                                },
                                                body: out
                                            });
                                        },
                                        onSelect: function(valueObj, model, context){
                                            if (_.isUndefined(model.customer.incomeThroughSales[context.arrayIndex])) {
                                                model.customer.incomeThroughSales[context.arrayIndex] = {};
                                            }

                                            model.customer.incomeThroughSales[context.arrayIndex].buyerName = valueObj.value;
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.name
                                            ];
                                        }
                                    },
                                    {
                                        key: "customer.incomeThroughSales[].incomeType",
                                        title: "INCOME_TYPE",
                                        type: "radios",
                                        required: true,
                                        titleMap: {
                                        Cash:"Cash",
                                        Invoice:"Invoice",
                                        Scrap:"Scrap"
                                        }
                                    },
                                    {
                                        key: "customer.incomeThroughSales[].amount",
                                        title: "AMOUNT",
                                        type: "amount"   
                                    },
                                    {
                                        key: "customer.incomeThroughSales[].incomeSalesDate",
                                        title: "DATE",
                                        type: "date"
                                    }
                                ]
                            },
                            {
                                type:"fieldset",
                                title:"EXPENSES",
                                items:[]
                            },
                            {
                                key:"customer.expenditures",
                                type:"array",
                                title:"BUSINESS_EXPENSE",
                                items:[
                                    {
                                        key: "customer.expenditures[].annualExpenses",
                                        title: "AMOUNT",
                                        type: "amount"
                                    },
                                    {
                                        key: "customer.expenditures[].expenditureSource",
                                        title: "EXPENDITURE_SOURCE",
                                        type: "select",
                                        enumCode: "business_expense"
                                    },
                                    {
                                        key: "customer.expenditures[].frequency",
                                        title: "FREQUENCY",
                                        type: "select",
                                        enumCode: "frequency"
                                    }
                                ]
                            },
                            {
                                key:"customer.rawMaterialExpenses",
                                type:"array",
                                startEmpty: true,
                                title:"PURCHASES",
                                items:[
                                    {
                                        key: "customer.rawMaterialExpenses[].vendorName",
                                        title: "VENDOR_NAME",
                                        type: "string"
                                    },
                                    {
                                        key: "customer.rawMaterialExpenses[].rawMaterialType",
                                        title: "TYPE",
                                        type: "radios",
                                        titleMap: {
                                            Cash:"Cash",
                                            Invoice:"Invoice"
                                        }
                                    },
                                    {
                                        key: "customer.rawMaterialExpenses[].amount",
                                        title: "AMOUNT",
                                        type: "amount"
                                    },
                                    {
                                        key: "customer.rawMaterialExpenses[].rawMaterialDate",
                                        title: "DATE",
                                        type: "date"
                                    }

                                ]
                            },
                            ]
                        },
                            {
                                type:"fieldset",
                                title:"ASSETS",
                                items:[]
                            },
                            {
                                key: "customer.enterprise.cashAtBank",
                                title: "CASH_AT_BANK",
                                type: "amount"
                            },
                            {
                                key: "customer.enterprise.rawMaterial",
                                title: "RAW_MATERIAL",
                                type: "amount"
                            },
                            {
                                key: "customer.enterprise.workInProgress",
                                title: "WIP",
                                type: "amount"
                            },
                            {
                                key: "customer.enterprise.finishedGoods",
                                title: "FINISHED_GOODS",
                                type: "amount"
                            },
                            {
                                key: 'customer.enterpriseAssets',
                                type: 'array',
                                startEmpty: true,
                                title: "ENTERPRICE_ASSETS",
                                items: [
                                    {
                                        key: "customer.enterpriseAssets[].assetType",
                                        title: "ASSET_TYPE",
                                        type: "select",
                                        enumCode: "enterprice_asset_types"
                                    },
                                    {
                                        key: "customer.enterpriseAssets[].vehicleMakeModel",
                                        title: "VEHICLE_MAKE_MODEL",
                                        type: "string",
                                        condition:"model.customer.enterpriseAssets[arrayIndex].assetType=='Vehicle'"
                                    },
                                    {
                                        key: "customer.enterpriseAssets[].valueOfAsset",
                                        title: "VALUE_OF_THE_ASSET",
                                        type: "amount"
                                    },
                                ]
                            },
                               
                ]
            },
        {
            type: "box",
            title: "T_BUSINESS_FINANCIALS",
            "condition": "model.currentStage=='ScreeningReview'",
            readonly:true,
            items: [{
                key: "customer.enterprise.monthlyTurnover",
                title: "MONTHLY_TURNOVER",
                required: true,
                type: "amount"
            }, {
                key: "customer.enterprise.monthlyBusinessExpenses",
                title: "MONTHLY_BUSINESS_EXPENSES",
                type: "amount"
            }, {
                key: "customer.enterprise.avgMonthlyNetIncome",
                title: "AVERAGE_MONTHLY_NET_INCOME",
                type: "amount"
            }]
        },
            {
               type:"box",
               title:"T_BUSINESS_FINANCIALS",
               "condition":"model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
               readonly:true,
                items:[
                    {
                        key: "customer.enterprise.monthlyTurnover",
                        title: "MONTHLY_TURNOVER",
                        type: "amount"
                    },
                    {
                        key: "customer.enterprise.monthlyBusinessExpenses",
                        title: "MONTHLY_BUSINESS_EXPENSES",
                        type: "amount"
                    },
                    {
                        key: "customer.enterprise.avgMonthlyNetIncome",
                        title: "AVERAGE_MONTHLY_NET_INCOME",
                        type: "amount"
                    },
                
                        {
                                type:"fieldset",
                                title:"Income",
                                items:[]
                        },
                         {
                            key:"customer.incomeThroughSales",
                            type:"array",
                            startEmpty: true,
                            title:"Through Sales",
                            items:[
                                {
                                    key: "customer.incomeThroughSales[].buyerName",
                                    title:"BUYER_NAME",
                                },
                                {
                                    key: "customer.incomeThroughSales[].incomeType",
                                    title: "INCOME_TYPE",
                                    type: "radios",
                                    titleMap: {
                                    Cash:"Cash",
                                    Invoice:"Invoice",
                                    Scrap:"Scrap"
                                    }
                                },
                                {
                                    key: "customer.incomeThroughSales[].amount",
                                    title: "AMOUNT",
                                    type: "amount"   
                                },
                                {
                                    key: "customer.incomeThroughSales[].incomeSalesDate",
                                    title: "DATE",
                                    type: "date"
                                }, 
                                
                            ]
                        },
                        {
                          key:"customer.otherBusinessIncomes",
                            type:"array",
                            startEmpty: true,
                            title:"OTHER_BUSINESS_INCOME",
                            items:[
                                {
                                    key: "customer.otherBusinessIncomes[].incomeSource",
                                    title: "INCOME_SOURCE",
                                    type: "select",
                                    enumCode:"occupation"
                                },
                                {
                                    key: "customer.otherBusinessIncomes[].amount",
                                    title: "AMOUNT",
                                    type: "amount"
                                },
                                {
                                    key: "customer.otherBusinessIncomes[].otherBusinessIncomeDate",
                                    title: "DATE",
                                    type: "date"
                                }, 
                             ]    
                        }, 
                         {
                                type:"fieldset",
                                title:"EXPENSES",
                                items:[]
                        },
                        {
                                key:"customer.expenditures",
                                type:"array",
                                title:"BUSINESS_EXPENSE",
                                items:[
                                    {
                                        key: "customer.expenditures[].annualExpenses",
                                        title: "AMOUNT",
                                        type: "amount"
                                    },
                                    {
                                        key: "customer.expenditures[].expenditureSource",
                                        title: "EXPENDITURE_SOURCE",
                                        type: "select",
                                        enumCode: "business_expense"
                                    },
                                    {
                                        key: "customer.expenditures[].frequency",
                                        title: "FREQUENCY",
                                        type: "select",
                                        enumCode: "frequency"
                                    }
                                ]
                            },
                         {
                            key:"customer.rawMaterialExpenses",
                            type:"array",
                            startEmpty: true,
                            title:"PURCHASES",
                            items:[
                                {
                                    key: "customer.rawMaterialExpenses[].vendorName",
                                    title: "VENDOR_NAME",
                                    type: "string"
                                },
                                {
                                    key: "customer.rawMaterialExpenses[].rawMaterialType",
                                    title: "TYPE",
                                    type: "radios",
                                        titleMap: {
                                            Cash:"Cash",
                                            Invoice:"Invoice"
                                        }
                                },
                                {
                                    key: "customer.rawMaterialExpenses[].amount",
                                    title: "AMOUNT",
                                    type: "amount"
                                },
                                {
                                    key: "customer.rawMaterialExpenses[].rawMaterialDate",
                                    title: "DATE",
                                    type: "date"
                                },
                                ]
                            },
                                {
                                    type:"fieldset",
                                    title:"ASSETS",
                                    items:[]
                                },
                                {
                                    key: "customer.enterprise.cashAtBank",
                                    title: "CASH_AT_BANK",
                                    type: "amount"
                                },
                                {
                                    key: "customer.enterprise.rawMaterial",
                                    title: "RAW_MATERIAL",
                                    type: "amount"
                                },
                                {
                                    key: "customer.enterprise.workInProgress",
                                    title: "WIP",
                                    type: "amount"
                                },
                                {
                                    key: "customer.enterprise.finishedGoods",
                                    title: "FINISHED_GOODS",
                                    type: "amount"
                                },
                                {
                                    key: 'customer.enterpriseAssets',
                                    type: 'array',
                                    startEmpty: true,
                                    title: "ENTERPRICE_ASSETS",
                                    items: [
                                        {
                                            key: "customer.enterpriseAssets[].assetType",
                                            title: "ASSET_TYPE",
                                            type: "string",
                                            //enumCode: "enterprise_asset_types"
                                        },
                                        {
                                            key: "customer.enterpriseAssets[].vehicleMakeModel",
                                            title: "VEHICLE_MAKE_MODEL",
                                            type: "string",
                                            condition:"model.customer.enterpriseAssets[arrayIndex].assetType=='Vehicle'"
                                        },
                                        {
                                            key: "customer.enterpriseAssets[].valueOfAsset",
                                            title: "VALUE_OF_THE_ASSET",
                                            type: "amount"
                                        },
                                    ]
                                },   
                            
                        
                        
                ]
            },
            {
               type:"box",
               title:"EMPLOYEE_DETAILS",
               "condition":"model.currentStage=='Screening' || model.currentStage=='Application'",
                items:[
                    {
                        key: "customer.enterprise.noOfFemaleEmployees",
                        title: "NO_OF_MALE_EMPLOYEES",
                        required:true,
                        type: "number"
                    },
                    {
                        key: "customer.enterprise.noOfMaleEmployees",
                        required:true,
                        title: "NO_OF_FEMALE_EMPLOYEES",
                        type: "number"
                    },
                    {
                        key: "customer.enterprise.avgMonthlySalary",
                        required:true,
                        title: "AVERAGE_MONTHLY_SALARY",
                        type: "amount"
                    }

                ]
            },
            {
               type:"box",
               title:"EMPLOYEE_DETAILS",
               "condition":"model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
               readonly:true,
                items:[
                    {
                        key: "customer.enterprise.noOfFemaleEmployees",
                        title: "NO_OF_MALE_EMPLOYEES",
                        type: "number"
                    },
                    {
                        key: "customer.enterprise.noOfMaleEmployees",
                        title: "NO_OF_FEMALE_EMPLOYEES",
                        type: "number"
                    },
                    {
                        key: "customer.enterprise.avgMonthlySalary",
                        title: "AVERAGE_MONTHLY_SALARY",
                        type: "amount"
                    }

                ]
            },
            {
               type:"box",
               title:"MACHINERY",
               condition: "model.currentStage == 'Application' || model.currentStage=='FieldAppraisal'",
                items:[
                    {
                      key:"customer.fixedAssetsMachinaries",
                       type:"array",
                       startEmpty: true,
                       title:"MACHINERY_SECTION",
                       items:[
                            {
                                key:"customer.fixedAssetsMachinaries[].machineDescription",
                                title:"MACHINE_DESCRIPTION",
                                required: true,
                                type: "string"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].manufacturerName",
                                title:"MANUFACTURER_NAME",
                                type: "string"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machineType",
                                title:"MACHINE_TYPE",
                                required: true,
                                type: "select",
                                enumCode: "collateral_type"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machineModel",
                                title:"MACHINE_MODEL",
                                type: "string"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].serialNumber",
                                title:"SERIAL_NUMBER",
                                type: "string"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].purchasePrice",
                                title:"PURCHASE_PRICE",
                                type: "number"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machinePurchasedYear",
                                title:"MACHINE_PURCHASED_YEAR",
                                type: "number"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].presentValue",
                                title:"PRESSENT_VALUE",
                                type: "number"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].isTheMachineNew",
                                title:"IS_THE_MACHINE_NEW",
                                type: "radios",
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].fundingSource",
                                title:"FUNDING_SOURCE",
                                type: "select",
                                enumCode: "funding_source"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].isTheMachineHypothecated",
                                title:"IS_THE_MACHINE_HYPOTHECATED",
                                type: "radios",
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].hypothecatedTo",
                                title:"HYPOTHECATED_TO",
                                type: "string",
                                condition:"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='YES'"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].hypothecatedToUs",
                                title:"CAN_BE_HYPOTHECATED_TO_US",
                                type: "string",
                                condition:"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='NO'"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machinePermanentlyFixedToBuilding",
                                title:"MACHINE_PERMANENTLY_FIXED_TO_BUILDING",
                                type: "radios",
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machineBillsDocId",
                                title:"MACHINE_BILLS",
                                "category":"Loan",
                                "subCategory":"DOC1",
                                type: "file",
                                fileType:"application/pdf",
                                using: "scanner"
                            },
                         ]
                     }
                 ]
            },
            {
               type:"box",
               title:"MACHINERY",
               condition: "model.currentStage == 'ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
               readonly:true,
                items:[
                    {
                      key:"customer.fixedAssetsMachinaries",
                       type:"array",
                       startEmpty: true,
                       title:"MACHINERY_SECTION",
                       items:[
                            {
                                key:"customer.fixedAssetsMachinaries[].machineDescription",
                                title:"MACHINE_DESCRIPTION",
                                type: "string"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].manufacturerName",
                                title:"MANUFACTURER_NAME",
                                type: "string"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machineType",
                                title:"MACHINE_TYPE",
                                type: "string"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machineModel",
                                title:"MACHINE_MODEL",
                                type: "string"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].serialNumber",
                                title:"SERIAL_NUMBER",
                                type: "string"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].purchasePrice",
                                title:"PURCHASE_PRICE",
                                type: "number"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machinePurchasedYear",
                                title:"MACHINE_PURCHASED_YEAR",
                                type: "number"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].presentValue",
                                title:"PRESSENT_VALUE",
                                type: "number"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].isTheMachineNew",
                                title:"IS_THE_MACHINE_NEW? ",
                                type: "radios",
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].fundingSource",
                                title:"FUNDING_SOURCE",
                                type: "string",
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].isTheMachineHypothecated",
                                title:"IS_THE_MACHINE_HYPOTHECATED",
                                type: "radios",
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].hypothecatedTo",
                                title:"HYPOTHECATED_TO",
                                type: "string",
                                //enumCode: "decisionmaker",
                                condition:"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='YES'"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].hypothecatedToUs",
                                title:"HYPOTHECATED_TO_US",
                                type: "radios",
                                enumCode: "decisionmaker",
                                condition:"model.customer.fixedAssetsMachinaries[arrayIndex].hypothecatedTo=='NO'"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machinePermanentlyFixedToBuilding",
                                title:"MACHINE_PERMANENTLY_FIXED_TO_BUILDING",
                                type: "radios",
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machineBillsDocId",
                                title:"MACHINE_BILLS",
                                "category":"Loan",
                                "subCategory":"DOC1",
                                type: "file",
                                fileType:"application/pdf",
                                using: "scanner"
                            },
                         ]
                     }
                 ]
            },
            {
                "type": "box",
                "title": "REFERENCES",
                "condition": "model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
                "items": [
                    {
                        key:"customer.verifications",
                        title:"REFERENCES",
                        type: "array", 
                        items:[
                            {
                                key:"customer.verifications[].relationship",
                                title:"REFERENCE_TYPE",
                                type:"select",
                                required:"true",
                                enumCode: "business_reference_type"
                            },
                             {
                                key:"customer.verifications[].businessName",
                                title:"BUSINESS_NAME",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].referenceFirstName",
                                title:"FULL_NAME_OF_POC",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].mobileNo",
                                title:"MOBILE_NO",
                                type:"string",
                                
                            },
                            {
                                key:"customer.verifications[].businessSector",
                                title:"BUSINESS_SECTOR",
                                type:"select",
                                enumCode: "businessSector"
                            },
                            {
                                key:"customer.verifications[].businessSubSector",
                                title:"BUSINESS_SUBSECTOR",
                                type:"select",
                                enumCode: "businessSubSector",
                                parentEnumCode: "businessSector"
                            },
                            {
                                key:"customer.verifications[].selfReportedIncome",
                                title:"SELF_REPORTED_INCOME",
                                type:"number"
                            },

                         ] 
                    },
                ]
            },
            {
                "type": "box",
                "title": "REFERENCES",
                "condition": "model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                readonly:true,
                "items": [
                    {
                        key:"customer.verifications",
                        title:"REFERENCES",
                        type: "array", 
                        items:[
                            {
                                key:"customer.verifications[].relationship",
                                title:"REFERENCE_TYPE",
                                type:"select",
                                required:"true",
                                enumCode: "business_reference_type"
                            },
                             {
                                key:"customer.verifications[].businessName",
                                title:"BUSINESS_NAME",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].referenceFirstName",
                                title:"FULL_NAME_OF_POC",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].mobileNo",
                                title:"MOBILE_NO",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].businessSector",
                                title:"BUSINESS_SECTOR",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].businessSubSector",
                                title:"BUSINESS_SUBSECTOR",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].selfReportedIncome",
                                title:"SELF_REPORTED_INCOME",
                                type:"number"
                            },

                         ] 
                    },
                ]
            },
            {
                "type": "box",
                "title": "COMMERCIAL_CB_CHECK",
                "condition": "model.currentStage=='ScreeningReview'",
                "items": [
                    {
                        key:"customer.enterpriseBureauDetails",
                        title:"CB Check",
                        type: "array", 
                        items:[
                            {
                                key:"customer.enterpriseBureauDetails[].bureau",
                                title:"BUREAU",
                                type:"select",
                                required:"true",
                                titleMap: {
                                      "CIBIL": "CIBIL",
                                      "Highmark": "Highmark"
                                }
                            },
                            {
                                key:"customer.enterpriseBureauDetails[].fileId",
                                title:"FILE",
                                type:"file",
                                fileType:"application/pdf",
                                using: "scanner"
                            },
                            {
                                key:"customer.enterpriseBureauDetails[].doubtful",
                                title:"DOUBTFUL_ACS",
                                type:"number"
                            },
                            {
                                key:"customer.enterpriseBureauDetails[].loss",
                                title:"LOSS_ACS",
                                type:"number"
                            },
                            {
                                key:"customer.enterpriseBureauDetails[].specialMentionAccount",
                                title:"SPECIAL_MENTION_ACS",
                                type:"number"
                            },
                            {
                                key:"customer.enterpriseBureauDetails[].standard",
                                title:"STANDARD_ACS",
                                type:"number"
                            },
                            {
                                key:"customer.enterpriseBureauDetails[].subStandard",
                                title:"SUB_STANDARD_ACS",
                                type:"number"
                            },

                         ] 
                    },
                ]
            },
            {
                "type": "box",
                "title": "COMMERCIAL_CB_CHECK",
                "condition": "model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'",
                readonly:true,
                "items": [
                    {
                        key:"customer.enterpriseBureauDetails",
                        title:"CB Check",
                        type: "array", 
                        items:[
                            {
                                key:"customer.enterpriseBureauDetails[].bureau",
                                title:"BUREAU",
                                type:"select",
                                required:"true",
                                titleMap: {
                                      "CIBIL": "CIBIL",
                                      "Highmark": "Highmark"
                                }
                            },
                            {
                                key:"customer.enterpriseBureauDetails[].fileId",
                                title:"FILE",
                                type:"file",
                                fileType:"application/pdf",
                                using: "scanner"
                            },
                            {
                                key:"customer.enterpriseBureauDetails[].doubtful",
                                title:"DOUBTFUL_ACS",
                                type:"number"
                            },
                            {
                                key:"customer.enterpriseBureauDetails[].loss",
                                title:"LOSS_ACS",
                                type:"number"
                            },
                            {
                                key:"customer.enterpriseBureauDetails[].specialMentionAccount",
                                title:"SPECIAL_MENTION_ACS",
                                type:"number"
                            },
                            {
                                key:"customer.enterpriseBureauDetails[].standard",
                                title:"STANDARD_ACS",
                                type:"number"
                            },
                            {
                                key:"customer.enterpriseBureauDetails[].subStandard",
                                title:"SUB_STANDARD_ACS",
                                type:"number"
                            },

                         ] 
                    },
                ]
            },
            {
                "type": "actionbox",
                "condition": "!model.customer.id && !(model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview')",
                "items": [
                    {
                        "type": "button",
                        "icon": "fa fa-circle-o",
                        "title": "SUBMIT",
                        "onClick": "actions.save(model, formCtrl, form, $event)"
                    }
                ]
            },
            {
                "type": "actionbox",
                "condition": "model.customer.id && !(model.currentStage=='ApplicationReview' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview')",
                "items": [
                    {
                        "type": "submit",
                        "title": "COMPLETE_ENROLMENT"
                    }
                ]
            }
        ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
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
            save: function(model, formCtrl, formName){
                $log.info("Inside save()");
                formCtrl.scope.$broadcast('schemaFormValidate');

                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                    return false;
                }

                if (model.customer.enterprise.companyRegistered != "YES"){
                    try
                    {
                        delete model.customer.enterpriseRegistrations;
                    }
                    catch(err){
                        console.error(err);
                    }
                }

                var reqData = _.cloneDeep(model);
                EnrollmentHelper.fixData(reqData);

                if (!(validateRequest(reqData))){
                    return;
                }

                PageHelper.showProgress('enrolment','Saving..');
                EnrollmentHelper.saveData(reqData).then(function(resp){
                    PageHelper.showProgress('enrolment', 'Done.', 5000);
                    Utils.removeNulls(resp.customer, true);
                    model.customer = resp.customer;
                    if (model._bundlePageObj){
                        BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                    }
                }, function(httpRes){
                    PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                    PageHelper.showErrors(httpRes);
                });
            },
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                $log.warn(model);
                var sortFn = function(unordered){
                    var out = {};
                    Object.keys(unordered).sort().forEach(function(key) {
                        out[key] = unordered[key];
                    });
                    return out;
                };
                if (model.customer.enterprise.companyRegistered != "YES"){
                    try
                    {
                        delete model.customer.enterpriseRegistrations;
                    }
                    catch(err){
                        console.error(err);
                    }
                }
                if(model.currentStage=='Application'){
                    if(model.customer.verifications.length<2){
                        PageHelper.showProgress("enrolment","minimum two references are mandatory",5000);
                        return false;
                    }
                }
                var reqData = _.cloneDeep(model);
                EnrollmentHelper.fixData(reqData);

                if (!(validateRequest(reqData))){
                    return;
                }

                PageHelper.showProgress('enrolment','Updating...', 2000);
                EnrollmentHelper.proceedData(reqData).then(function(resp){
                    PageHelper.showProgress('enrolmet','Done.', 5000);
                    Utils.removeNulls(resp.customer,true);
                    model.customer = resp.customer;
                    if (model._bundlePageObj){
                        BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                    }
                }, function(httpRes){
                    PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                    PageHelper.showErrors(httpRes);
                });
            }
        }
    };
}]);
