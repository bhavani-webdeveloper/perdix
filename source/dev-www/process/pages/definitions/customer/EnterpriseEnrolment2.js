
irf.pageCollection.factory(irf.page("customer.EnterpriseEnrolment2"),
["$log", "$q","Enrollment", 'EnrollmentHelper', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "Dedupe", "$filter",
function($log, $q, Enrollment, EnrollmentHelper, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, BundleManager, Dedupe, $filter){

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
            var self= this;

            var branch = SessionStore.getBranch();
            var centres = SessionStore.getCentres();
            var centreName = [];
            var allowedCentres = [];
            if (centres && centres.length) {
                for (var i = 0; i < centres.length; i++) {
                    centreName.push(centres[i].id);
                    allowedCentres.push(centres[i]);
                }
            }


            if (_.hasIn(model, 'loanRelation')){
                console.log(model.loanRelation);
                var custId = model.loanRelation.customerId;
                Enrollment.getCustomerById({id:custId})
                    .$promise
                    .then(function(res){
                        model.customer = res;

                        if (model.customer.stockMaterialManagement) {
                        model.proxyIndicatorsHasValue = true;
                        $log.debug('PROXY_INDICATORS already has value');
                        }

                        bundleModel.business = model.customer;

                         if(model.customer.enterprise.isGSTAvailable == null || model.customer.enterprise.isGSTAvailable == undefined){
                                     model.customer.enterprise.isGSTAvailable = "No";
                         }
                         if(model.customer.enterprise.isGSTAvailable == "Yes"){
                             model.customer.enterprise.companyRegistered = "YES";
                         }

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
                        var actualCentre = $filter('filter')(allowedCentres, {id: model.customer.centreId}, true);
                        model.customer.centreName = actualCentre && actualCentre.length > 0 ? actualCentre[0].centreName : model.customer.centreName;
                        BundleManager.broadcastEvent('business-loaded', model.customer);
                    }, function(httpRes){
                        PageHelper.showErrors(httpRes);
                    })
                    .finally(function(){
                        PageHelper.hideLoader();
                    })
            } else {
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
                        model.customer.kgfsName = branch1[i].name;
                    }
                }

                model.customer.centreId = centreName[0];
                model.customer.centreName = (allowedCentres && allowedCentres.length > 0) ? allowedCentres[0].centreName : "";
                model.customer.enterpriseCustomerRelations = model.customer.enterpriseCustomerRelations || [];
                model.customer.enterprise.isGSTAvailable = 'YES';
                model.customer.enterprise.companyRegistered = "YES";
            }
            if (bundlePageObj){
                model._bundlePageObj = bundlePageObj;
            }
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

                var overlayData = function(model, obj){
                    try {
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
                    } catch (e){
                        $log.error("Error while overlay");
                    }

                }

                var lep = null;
                if (obj.customerId != null) {
                    lep = Enrollment.getCustomerById({id: obj.customerId})
                        .$promise;
                    lep.then(function(res){
                        PageHelper.showProgress("customer-load", "Done..", 5000);
                        model.customer = Utils.removeNulls(res, true);
                        overlayData(model, obj);
                        BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                    }, function(httpRes){
                        PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
                    })
                } else {
                    overlayData(model, obj);
                }

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
                         initialize: function(model, form, parentModel, context) {
                                        model.customerBranchId = parentModel.customer.customerBranchId;
                                        model.centreId = parentModel.customer.centreId;
                                        var centreCode = formHelper.enum('centre').data;
                                        var centreName = $filter('filter')(centreCode, {value: parentModel.customer.centreId}, true);
                                        if(centreName && centreName.length > 0) {
                                            model.centreName = centreName[0].name;
                                        }
                                    },
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
                                "readonly": true,
                                "enumCode": "branch_id"
                            },
                            "centreName": {
                                "key": "customer.place",
                                "title":"CENTRE_NAME",
                                "type": "string",
                                "readonly": true,

                            },
                            "centreId":{
                                key: "customer.centreId",
                                type: "lov",
                                autolov: true,
                                lovonly: true,
                                bindMap: {},
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {
                                    var centres = SessionStore.getCentres();
                                    // $log.info("hi");
                                    // $log.info(centres);

                                    var centreCode = formHelper.enum('centre').data;
                                    var out = [];
                                    if (centres && centres.length) {
                                        for (var i = 0; i < centreCode.length; i++) {
                                            for (var j = 0; j < centres.length; j++) {
                                                if (centreCode[i].value == centres[j].id) {

                                                    // if( out.length == 0){
                                                    //     model.customer.centreId = centreCode[i].value;
                                                    // }
                                                    out.push({
                                                        name: centreCode[i].name,
                                                        id:centreCode[i].value
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
                            "firstName":"customer.firstName"
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form) {
                            var branches = formHelper.enum('branch_id').data;
                            var branchName;
                            for (var i=0; i<branches.length;i++){
                                if(branches[i].code==inputModel.customerBranchId)
                                    branchName = branches[i].name;
                            }
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var promise = Enrollment.search({
                                'branchName': branchName ||SessionStore.getBranch(),
                                'firstName': inputModel.firstName,
                                'centreId':inputModel.centreId,
                                'customerType':"enterprise",
                                'urnNo': inputModel.urnNo
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
                    /*{
                        key: "customer.centreName",
                        type: "lov",
                        "title":"SPOKE_NAME",
                        autolov: true,
                        bindMap: {},
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var centres = SessionStore.getCentres();
                            $log.info("hi");
                            $log.info(centres);

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
                            model.customer.centreName = valueObj.name;
                            model.customer.centreId = valueObj.id;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.name
                            ];
                        }
                    },*/
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
                        readonly: true,
                        title:"CENTRE_NAME",
                        filter: {
                         "parentCode": "branch_id"
                         },
                        parentEnumCode:"branch_id",
                        parentValueExpr:"model.customer.customerBranchId",
                    },
                    {
                        key: "customer.centreId",
                        condition: "!model.customer.id",
                        type: "lov",
                        autolov: true,
                        lovonly: true,
                        bindMap: {},
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var centres = SessionStore.getCentres();
                            // $log.info("hi");
                            // $log.info(centres);

                            var centreCode = formHelper.enum('centre').data;
                            var out = [];
                            if (centres && centres.length) {
                                for (var i = 0; i < centreCode.length; i++) {
                                    for (var j = 0; j < centres.length; j++) {
                                        if (centreCode[i].value == centres[j].id) {
                                            out.push({
                                                name: centreCode[i].name,
                                                id:centreCode[i].value
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
                            model.customer.centreId = valueObj.id;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.name
                            ];
                        }
                    },
                    {
                        key: "customer.centreId",
                        condition: "model.customer.id",
                        readonly: true
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
                       required:true,
                       type: "date"
                    },
                    {
                        "type": "email",
                         required:true,
                        "key": "customer.enterprise.companyEmailId",
                        "pattern": "^\\S+@\\S+$",
                        "title": "COMPANY_EMAIL_ID"
                    },
                    {
                        "key": "customer.latitude",
                        "title": "BUSINESS_LOCATION",
                        "type": "geotag",
                        "latitude": "customer.latitude",
                        "longitude": "customer.longitude"
                    },
                    {
                        "key": "customer.photoImageId",
                        "required":true,
                        "title": "BUSINESS_LOCATION_PHOTO",
                        type: "file",
                        fileType: "image/*",
                        "category": "CustomerEnrollment",
                        "subCategory": "PHOTO"
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
                        title: "IS_REGISTERED",
                        required : true
                    },
                    {
                        key: "customer.enterprise.isGSTAvailable",
                        type: "radios",
                        enumCode:"decisionmaker",
                        title: "IS_GST_AVAILABLE",
                        required : true,
                        "onChange": function(modelValue, form, model) {
                                        if (model.customer.enterprise.isGSTAvailable === "YES") {
                                                model.customer.enterprise.companyRegistered = "YES";
                                        }
                                    }
                    },
                    {
                        key: "customer.enterpriseRegistrations",
                        type: "array",
                        title: "REGISTRATION_DETAILS",
                        condition: "model.customer.enterprise.companyRegistered === 'YES' || model.customer.enterprise.isGSTAvailable === 'YES'",
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
                                using: "scanner",
                                offline:true
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
                        required:true,
                        title: "BUSINESS_ACTIVITY",
                        type: "select",
                        enumCode: "businessActivity",
                        parentEnumCode: "businessType",
                        parentValueExpr:"model.customer.enterprise.businessType",
                    },
                    {
                        key: "customer.enterprise.businessSector",
                        required:true,
                        title: "BUSINESS_SECTOR",
                        type: "select",
                        enumCode: "businessSector",
                        parentEnumCode: "businessType",
                        parentValueExpr:"model.customer.enterprise.businessType",
                        onChange: function(modelValue, form, model, formCtrl, event) {
                            model.customer.enterprise.businessSubsector = null;
                        }
                    },
                    {
                        key: "customer.enterprise.businessSubsector",
                        required:true,
                        title: "BUSINESS_SUBSECTOR",
                        type: "lov",
                        "lovonly": true,
                        autolov: true,
                        bindMap: {
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model, context) {
                            var businessSubsectors = formHelper.enum('businessSubSector').data;
                            var businessSectors = formHelper.enum('businessSector').data;

                            var selectedBusinessSector  = null;

                            for (var i=0;i<businessSectors.length;i++){
                                if (businessSectors[i].value == model.customer.enterprise.businessSector && businessSectors[i].parentCode == model.customer.enterprise.businessType){
                                    selectedBusinessSector = businessSectors[i];
                                    break;
                                }
                            }

                            var out = [];
                            for (var i=0;i<businessSubsectors.length; i++){
                                if (businessSubsectors[i].parentCode == selectedBusinessSector.code){
                                    out.push({
                                        name: businessSubsectors[i].name,
                                        value: businessSubsectors[i].value
                                    })
                                }
                            }
                            return $q.resolve({
                                headers: {
                                    "x-total-count": out.length
                                },
                                body: out
                            });
                        },
                        onSelect: function(valueObj, model, context){
                            model.customer.enterprise.businessSubsector = valueObj.value;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.name
                            ];
                        }
                    },
                    {
                        key: "customer.enterprise.itrAvailable",
                        title: "ITR_AVAILABLE",
                        type: "select",
                        enumCode: "decisionmaker"
                    },
                    /*{
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
                    },*/
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
                                enumCode: "relationship_type",
                                required: true
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
                                key: "customer.enterpriseCustomerRelations[].experienceInBusiness",
                                title: "EXPERIENCE_IN_BUSINESS",
                                type:"select",
                                "enumCode": "years_in_current_area",
                                required:true,
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
                       type: "date"
                    },
                    {
                        "type": "email",
                        "key": "customer.enterprise.companyEmailId",
                        "pattern": "^\\S+@\\S+$",
                        "title": "COMPANY_EMAIL_ID",
                    },
                    {
                        "key": "customer.latitude",
                        "title": "BUSINESS_LOCATION",
                        "type": "geotag",
                        "latitude": "customer.latitude",
                        "longitude": "customer.longitude"
                    },
                    {
                        "key": "customer.photoImageId",
                        "title": "BUSINESS_LOCATION_PHOTO",
                        type: "file",
                        fileType: "image/*",
                        "category": "CustomerEnrollment",
                        "subCategory": "PHOTO"
                    },
                    {
                        key: "customer.enterprise.ownership",
                        title: "OWNERSHIP",
                        /*type: "select",
                        enumCode: "ownership"*/
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
                        key: "customer.enterprise.isGSTAvailable",
                        type: "radios",
                        enumCode:"decisionmaker",
                        title: "IS_GST_AVAILABLE",
                        "onChange": function(modelValue, form, model) {
                                        if (model.customer.enterprise.isGSTAvailable === "YES") {
                                                model.customer.enterprise.companyRegistered = "YES";
                                        }
                                    }
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
                                using: "scanner",
                                offline:true
                            }
                        ]
                    },

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
                        key: "customer.enterpriseCustomerRelations",
                        type: "array",
                        title: "RELATIONSHIP_TO_BUSINESS",
                        startEmpty: true,
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
                                key: "customer.enterpriseCustomerRelations[].experienceInBusiness",
                                title: "EXPERIENCE_IN_BUSINESS",
                                type:"select",
                                "enumCode": "years_in_current_area"
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
                    {
                        "key": "customer.mobilePhone",
                        "inputmode": "number",
                        "numberType": "tel"
                    },
                    {
                        "key": "customer.landLineNo",
                        "inputmode": "number",
                        "numberType": "tel"
                    },
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
                    {
                        key: "customer.locality",
                        readonly: true
                    },
                    {
                        key: "customer.villageName",
                        readonly: true
                    },
                    {
                        key: "customer.district",
                        readonly: true
                    },
                    {
                        key: "customer.state",
                        readonly: true,
                    },
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
                       enumCode: "business_in_present_area_since",
                       title: "YEARS_OF_BUSINESS_PRESENT_AREA"
                    },
                    {
                        key: "customer.enterprise.businessInCurrentAddressSince", // customer.enterprise.businessInCurrentAddressSince
                        type: "select",
                        required:true,
                        enumCode: "bsns_in_current_addrss_since",
                        title: "YEARS_OF_BUSINESS_PRESENT_ADDRESS"
                    }
                ]
            },
            {
                "type": "box",
                "title": "CONTACT_INFORMATION",
                "condition":"model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
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
                        onArrayAdd: function(modelValue, form, model, formCtrl, $event) {
                            modelValue.bankStatements = [];
                            var CBSDateMoment = moment(SessionStore.getCBSDate(), SessionStore.getSystemDateFormat());
                            var noOfMonthsToDisplay = 6;
                            var statementStartMoment = CBSDateMoment.subtract(noOfMonthsToDisplay, 'months').startOf('month');
                            for (var i = 0; i < noOfMonthsToDisplay; i++) {
                                modelValue.bankStatements.push({
                                    startMonth: statementStartMoment.format(SessionStore.getSystemDateFormat())
                                });
                                statementStartMoment = statementStartMoment.add(1, 'months').startOf('month');
                            }
                        },
                        items: [
                            {
                                key: "customer.customerBankAccounts[].ifscCode",
                                type: "lov",
                                lovonly: true,
                                required: true,
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
                                required: true,
                                readonly: true
                            },
                            {
                                key: "customer.customerBankAccounts[].customerBankBranchName",
                                required: true,
                                readonly: true
                            },
                            {
                                key: "customer.customerBankAccounts[].customerNameAsInBank"
                            },
                            {
                                key: "customer.customerBankAccounts[].accountNumber",
                                type: "password",
                                inputmode: "number",
                                numberType: "tel"
                            },
                            {
                                key: "customer.customerBankAccounts[].confirmedAccountNumber",
                                inputmode: "number",
                                numberType: "tel"
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
                                title: "OUTSTANDING_BALANCE"
                            },
                            {
                                key: "customer.customerBankAccounts[].limit",
                                type: "amount"
                            },
                            {
                                key: "customer.customerBankAccounts[].bankStatements",
                                type: "array",
                                title: "STATEMENT_DETAILS",
                                titleExpr: "moment(model.customer.customerBankAccounts[arrayIndexes[0]].bankStatements[arrayIndexes[1]].startMonth).format('MMMM YYYY') + ' ' + ('STATEMENT_DETAILS' | translate)",
                                titleExprLocals: {moment: window.moment},
                                startEmpty: true,
                                items: [
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].startMonth",
                                        type: "date",
                                        title: "START_MONTH"
                                    },
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].totalDeposits",
                                        type: "amount",
                                        calculator: true,
                                        creditDebitBook: true,
                                        onDone: function(result, model, context){
                                                model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalDeposits = result.totalCredit;
                                                model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalWithdrawals = result.totalDebit;
                                        },
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
                                        title: "BALENCE_AS_ON_REQUESTED_EMI_DATE"
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
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].bankStatementPhoto",
                                        type: "file",
                                        required: true,
                                        title: "BANK_STATEMENT_UPLOAD",
                                        fileType: "application/pdf",
                                        "category": "CustomerEnrollment",
                                        "subCategory": "IDENTITYPROOF",
                                        using: "scanner",
                                        offline:true
                                    },
                                ]
                            },
                            {
                                key: "customer.customerBankAccounts[].isDisbersementAccount",
                                type: "checkbox"
                            }
                        ]
                    }
                ]
            },
            {
                type: "box",
                title: "BANK_ACCOUNTS",
                "condition":"model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
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
                                title: "OUTSTANDING_BALANCE"
                            },
                            {
                                key: "customer.customerBankAccounts[].limit",
                                type: "amount"
                            },
                            {
                                key:"customer.customerBankAccounts[].bankStatementDocId",
                                type:"file",
                                title:"BANK_STATEMENT_UPLOAD",
                                fileType:"application/pdf",
                                "category": "CustomerEnrollment",
                                "subCategory": "IDENTITYPROOF",
                                using: "scanner",
                                offline:true
                            },
                            {
                                key: "customer.customerBankAccounts[].bankStatements",
                                type: "array",
                                title: "STATEMENT_DETAILS",
                                titleExpr: "moment(model.customer.customerBankAccounts[arrayIndexes[0]].bankStatements[arrayIndexes[1]].startMonth).format('MMMM YYYY') + ' ' + ('STATEMENT_DETAILS' | translate)",
                                titleExprLocals: {moment: window.moment},
                                startEmpty: true,
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
                                        title: "BALENCE_AS_ON_REQUESTED_EMI_DATE"
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
                                    {
                                        key: "customer.customerBankAccounts[].bankStatements[].bankStatementPhoto",
                                        type: "file",
                                        title: "BANK_STATEMENT_UPLOAD",
                                        fileType: "application/pdf",
                                        "category": "CustomerEnrollment",
                                        "subCategory": "IDENTITYPROOF",
                                        using: "scanner",
                                        offline:true
                                    }
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
               title:"BUSINESS_LIABILITIES",
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
                           //"customer.liabilities[].instituteName",
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
                           {
                               key:"customer.liabilities[].interestRate",
                               type:"number",
                               title:"RATE_OF_INTEREST"
                           },
                            {
                                key: "customer.liabilities[].proofDocuments",
                                title: "DOCUMENTS",
                                "category": "Loan",
                                "subCategory": "DOC1",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner",
                                offline:true
                            }

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
               title:"BUSINESS_LIABILITIES",
               "condition":"model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
               readonly:true,
                items:[
                    {
                       key:"customer.liabilities",
                       type:"array",
                       startEmpty: true,
                       title:"COMPANY_LIABILITIES",
                       items:[
                           {
                               key:"customer.liabilities[].loanType"/*,
                                type:"select"*/ //Made as free text till list of values are given by Kinara
                           },
                           {
                               key:"customer.liabilities[].loanSource"/*,
                                type:"select"*/ //Made as free text till list of values are given by Kinara
                           },
                           //"customer.liabilities[].instituteName",
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
                           {
                               key:"customer.liabilities[].interestRate",
                               type:"number",
                               title:"RATE_OF_INTEREST"
                           },
                           {
                                key: "customer.liabilities[].proofDocuments",
                                title: "DOCUMENTS",
                                "category": "Loan",
                                "subCategory": "DOC1",
                                type: "file",
                                fileType: "application/pdf",
                                using: "scanner",
                                offline:true
                            }
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
                                type:"number"
                                /*type: "select",
                                enumCode: "customer_since"*/
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
                "condition":" model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
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
               "condition":" model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
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
               "condition":"model.currentStage=='Application' || model.currentStage=='FieldAppraisal'",
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
                                        lovonly: true,
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
                                        enumCode: "salesincome_income_type"
                                    },
                                    {
                                        key: "customer.incomeThroughSales[].invoiceType",
                                        title: "INVOICE_TYPE",
                                        type: "select",
                                        required: true,
                                        enumCode: "salesincome_invoice_type",
                                        parentValueExpr: "model.customer.enterprise.businessType"
                                    },
                                    {
                                        key: "customer.incomeThroughSales[].amount",
                                        title: "AMOUNT",
                                        type: "amount",
                                        calculator: true,
                                        creditDebitBook: true,
                                    },
                                    {
                                        key: "customer.incomeThroughSales[].incomeSalesDate",
                                        title: "DATE",
                                        type: "date"
                                    },
                                    {
                                        key: "customer.incomeThroughSales[].invoiceDocId",
                                        type: "file",
                                        required: true,
                                        condition: "model.customer.incomeThroughSales[arrayIndex].incomeType != 'Cash'",
                                        title: "INVOICE_DOCUMENT",
                                        fileType: "application/pdf",
                                        "category": "CustomerEnrollment",
                                        "subCategory": "IDENTITYPROOF",
                                        using: "scanner",
                                        offline: true
                                    },
                                    {
                                        key: "customer.incomeThroughSales[].invoiceDocId",
                                        type: "file",
                                        condition: "model.customer.incomeThroughSales[arrayIndex].incomeType =='Cash'",
                                        title: "INVOICE_DOCUMENT",
                                        fileType: "application/pdf",
                                        "category": "CustomerEnrollment",
                                        "subCategory": "IDENTITYPROOF",
                                        using: "scanner",
                                        offline: true
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
                                        key: "customer.expenditures[].expenditureSource",
                                        title: "EXPENDITURE_SOURCE",
                                        type: "select",
                                        enumCode: "business_expense"
                                    },
                                    {
                                        key: "customer.expenditures[].annualExpenses",
                                        title: "AMOUNT",
                                        type: "amount"
                                    },
                                    {
                                        key: "customer.expenditures[].frequency",
                                        title: "FREQUENCY",
                                        type: "select",
                                        enumCode: "frequency"
                                    },
                                    {
                                        key: "customer.expenditures[].billDocId",
                                        type: "file",
                                        title: "BILLS",
                                        fileType: "application/pdf",
                                        "category": "CustomerEnrollment",
                                        "subCategory": "IDENTITYPROOF",
                                        using: "scanner",
                                        offline:true
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
                                        type: "lov",
                                        autolov: true,
                                        required: true,
                                        lovonly: true,
                                        title:"VENDOR_NAME",
                                        bindMap: {
                                        },
                                        searchHelper: formHelper,
                                        search: function(inputModel, form, model, context) {
                                            var out = [];
                                            if (!model.customer.supplierDetails){
                                                return out;
                                            }
                                            for (var i=0; i<model.customer.supplierDetails.length; i++){
                                                out.push({
                                                    name: model.customer.supplierDetails[i].supplierName,
                                                    value: model.customer.supplierDetails[i].supplierName
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
                                            if (_.isUndefined(model.customer.rawMaterialExpenses[context.arrayIndex])) {
                                                model.customer.rawMaterialExpenses[context.arrayIndex] = {};
                                            }

                                            model.customer.rawMaterialExpenses[context.arrayIndex].vendorName = valueObj.value;
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.name
                                            ];
                                        }
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
                                    {
                                        key: "customer.rawMaterialExpenses[].invoiceDocId",
                                        title: "PURCHASE_BILLS",
                                        "required":true,
                                        "condition":"model.customer.rawMaterialExpenses[arrayIndex].rawMaterialType != 'Cash'",
                                        "category": "Loan",
                                        "subCategory": "DOC1",
                                        type: "file",
                                        fileType: "application/pdf",
                                        using: "scanner",
                                        offline:true
                                    },
                                    {
                                        key: "customer.rawMaterialExpenses[].invoiceDocId",
                                        title: "PURCHASE_BILLS",
                                        "condition":"model.customer.rawMaterialExpenses[arrayIndex].rawMaterialType == 'Cash'",
                                        "category": "Loan",
                                        "subCategory": "DOC1",
                                        type: "file",
                                        fileType: "application/pdf",
                                        using: "scanner",
                                        offline:true
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
                            // {
                            //     key: "customer.enterprise.cashAtBank",
                            //     title: "CASH_AT_BANK",
                            //     type: "amount"
                            // },
                            {
                                key: "customer.enterprise.rawMaterial",
                                title: "RAW_MATERIAL",
                                type: "amount",
                                required: true
                            },
                            {
                                key: "customer.enterprise.workInProgress",
                                title: "WIP",
                                type: "amount",
                                required: true
                            },
                            {
                                key: "customer.enterprise.finishedGoods",
                                title: "FINISHED_GOODS",
                                type: "amount",
                                required: true
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
                                        enumCode: "enterprice_asset_types",
                                        required: true
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
                "condition": "model.currentStage=='Screening'",
                items: [{
                        key: "customer.enterprise.monthlyTurnover",
                        title: "MONTHLY_TURNOVER",
                        required:true,
                        type: "amount",

                    },
                    {
                        key: "customer.enterprise.monthlyBusinessExpenses",
                        title: "MONTHLY_BUSINESS_EXPENSES",
                        type: "amount",

                    },
                    {
                        key: "customer.enterprise.avgMonthlyNetIncome",
                        title: "AVERAGE_MONTHLY_NET_INCOME",
                        type: "amount"
                    }]
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
               "condition":"model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
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
                                    type: "string"
                                },
                                {
                                    key: "customer.incomeThroughSales[].invoiceType",
                                    title: "INVOICE_TYPE",
                                    type: "string"
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
                                {
                                    key: "customer.incomeThroughSales[].invoiceDocId",
                                    type: "file",
                                    title: "INVOICE_DOCUMENT",
                                    fileType: "application/pdf",
                                    "category": "CustomerEnrollment",
                                    "subCategory": "IDENTITYPROOF",
                                    using: "scanner",
                                    offline:true
                                }


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
                                        key: "customer.expenditures[].expenditureSource",
                                        title: "EXPENDITURE_SOURCE",
                                        type: "select",
                                        enumCode: "business_expense"
                                    },
                                    {
                                        key: "customer.expenditures[].annualExpenses",
                                        title: "AMOUNT",
                                        type: "amount"
                                    },
                                    {
                                        key: "customer.expenditures[].frequency",
                                        title: "FREQUENCY",
                                        type: "select",
                                        enumCode: "frequency"
                                    },
                                    {
                                        key: "customer.expenditures[].billDocId",
                                        type: "file",
                                        title: "BILLS",
                                        fileType: "application/pdf",
                                        "category": "CustomerEnrollment",
                                        "subCategory": "IDENTITYPROOF",
                                        using: "scanner",
                                        offline:true
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
                                {
                                    key: "customer.rawMaterialExpenses[].invoiceDocId",
                                    title: "PURCHASE_BILLS",
                                    "category": "Loan",
                                    "subCategory": "DOC1",
                                    type: "file",
                                    fileType: "application/pdf",
                                    using: "scanner",
                                    offline:true
                                }
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
               "condition":"model.currentStage=='Screening' || model.currentStage=='Application'|| model.currentStage=='FieldAppraisal'",
                items:[
                    {
                        key: "customer.enterprise.noOfFemaleEmployees",
                        title: "NO_OF_MALE_EMPLOYEES",
                        //required:true,
                        type: "number"
                    },
                    {
                        key: "customer.enterprise.noOfMaleEmployees",
                        //required:true,
                        title: "NO_OF_FEMALE_EMPLOYEES",
                        type: "number"
                    },
                    {
                        key: "customer.enterprise.avgMonthlySalary",
                        condition:"model.customer.enterprise.noOfFemaleEmployees > 0 ||model.customer.enterprise.noOfMaleEmployees > 0 ",
                        //required:true,
                        title: "AVERAGE_MONTHLY_SALARY",
                        type: "amount"
                    }

                ]
            },
            {
               type:"box",
               title:"EMPLOYEE_DETAILS",
               "condition":"model.currentStage=='ScreeningReview' || model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
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
                                type: "amount",
                                required: true
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machinePurchasedYear",
                                title:"MACHINE_PURCHASED_YEAR",
                                type: "number"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].presentValue",
                                title:"PRESSENT_VALUE",
                                type: "amount",
                                required: true
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].isTheMachineNew",
                                title:"IS_THE_MACHINE_NEW",
                                type: "select",
                                enumCode: "decisionmaker"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].fundingSource",
                                title:"FUNDING_SOURCE",
                                type: "select",
                                enumCode: "machinery_funding_source"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].isTheMachineHypothecated",
                                title:"IS_THE_MACHINE_HYPOTHECATED",
                                type: "radios",
                                enumCode: "decisionmaker",
                                onChange: function(modelValue, form, model, formCtrl, event) {
                                    if (modelValue && modelValue.toLowerCase() === 'no')
                                        model.customer.fixedAssetsMachinaries[form.arrayIndex].hypothecatedTo = null;
                                    else if(modelValue && modelValue.toLowerCase() === 'yes')
                                        model.customer.fixedAssetsMachinaries[form.arrayIndex].hypothecatedToUs = null;
                                }
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
                                type: "radios",
                                enumCode: "decisionmaker",
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
                                using: "scanner",
                                offline:true
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machineImage",
                                title:"MACHINE_IMAGE",
                                "category":"Loan",
                                "subCategory":"DOC1",
                                required: true,
                                type: "file",
                                fileType:"application/pdf",
                                using: "scanner",
                                offline:true
                            },
                         ]
                     }
                 ]
            },
            {
               type:"box",
               title:"MACHINERY",
               condition: "model.currentStage == 'ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
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
                                enumCode: "decisionmaker",
                                condition:"model.customer.fixedAssetsMachinaries[arrayIndex].isTheMachineHypothecated=='YES'"
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].hypothecatedToUs",
                                title:"HYPOTHECATED_TO_US",
                                type: "select",
                                enumCode: "decisionmaker",
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
                                using: "scanner",
                                offline:true
                            },
                            {
                                key: "customer.fixedAssetsMachinaries[].machineImage",
                                title:"MACHINE_IMAGE",
                                "category":"Loan",
                                "subCategory":"DOC1",
                                type: "file",
                                fileType:"application/pdf",
                                using: "scanner",
                                offline:true
                            }
                         ]
                     }
                 ]
            },
        {
            type: "box",
            title: "PROXY_INDICATORS",
            condition: "model.currentStage=='FieldAppraisal' && !model.proxyIndicatorsHasValue",
            items: [{
                    key: "customer.properAndMatchingSignboard",
                    title: "PROPER_MATCHING_SIGNBOARD",
                    type: "select",
                    required: "true",
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.bribeOffered",
                    title: "BRIBE_OFFERED",
                    type: "select",
                    required: "true",
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.shopOrganized",
                    title: "SHOP_SHED_ORGANIZED",
                    type: "select",
                    required: "true",
                    enumCode: "status_scale_2"
                }, {
                    key: "customer.isIndustrialArea",
                    title: "IN_INDUSTRIAL_AREA",
                    type: "select",
                    required: "true",
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.customerAttitudeToKinara",
                    title: "CUSTOMER_ATTITUDE_TO_KINARA",
                    type: "select",
                    required: "true",
                    enumCode: "status_scale_2"
                }, {
                    key: "customer.bookKeepingQuality",
                    title: "BOOK_KEEPING_QUALITY",
                    type: "select",
                    required: "true",
                    enumCode: "status_scale_2"
                }, {
                    key: "customer.challengingChequeBounce",
                    title: "CHALLENGING_CHEQUE_BOUNCE/FESS_CHARGE/POLICIES",
                    type: "select",
                    required: "true",
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.allMachinesAreOperational",
                    title: "ALL_MACHINES_OPERATIONAL?",
                    type: "select",
                    required: "true",
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.employeeSatisfaction",
                    title: "EMPLOYEE_SATISFACTION",
                    type: "select",
                    required: "true",
                    enumCode: "status_scale_2"
                }, {
                    key: "customer.politicalOrPoliceConnections",
                    title: "POLITICAL_POLICE_CONNECTIONS",
                    type: "select",
                    required: "true",
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.multipleProducts",
                    title: "MULTIPLE_PRODUCTS_MORE_THAN_3",
                    type: "select",
                    required: "true",
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.multipleBuyers",
                    title: "MULTIPLE_BUYERS_MORE_THAN_3",
                    condition: "model.customer.enterprise.businessType == 'Manufacturing'",
                    type: "select",
                    required: "true",
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.seasonalBusiness",
                    title: "SEASONAL_BUSINESS",
                    type: "select",
                    required: "true",
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.incomeStability",
                    title: "INCOME STABILITY",
                    type: "select",
                    required: "true",
                    enumCode: "income_stability"
                }, {
                    key: "customer.utilisationOfBusinessPremises",
                    title: "UTILIZATION_OF_BUSINESS_PREMISES ",
                    type: "select",
                    required: "true",
                    enumCode: "utilisation_of_business"
                }, {
                    key: "customer.approachForTheBusinessPremises",
                    title: "APPROACH_FOR_THE_BUSINESS_PREMISES",
                    type: "select",
                    required: "true",
                    enumCode: "status_scale_2"
                        //enumCode:"connectivity_status "
                }, {
                    key: "customer.safetyMeasuresForEmployees",
                    title: "SAFETY_MEASURES_FOR_EMPLOYEES",
                    type: "select",
                    required: "true",
                    enumCode: "decisionmaker",
                    //enumCode: "status_scale"
                }, {
                    key: "customer.childLabours",
                    title: "CHILD_LABOURERS",
                    type: "select",
                    required: "true",
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.isBusinessEffectingTheEnvironment",
                    title: "IS_THE_BUSSINESS_IN_EFFECTING_ENVIRONMENT",
                    type: "select",
                    required: "true",
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.stockMaterialManagement",
                    title: "STOCK_MATERIAL_MANAGEMENT",
                    type: "select",
                    required: "true",
                    enumCode: "status_scale_2"
                        //enumCode: "status_scale"
                }, {
                    key: "customer.customerWalkinToBusiness",
                    condition: "model.customer.enterprise.businessType == 'Trading'",
                    title: "CUSTOMER_WALK_IN_TO_THE_BUSINESS",
                    type: "select",
                    required: "true",
                    enumCode: "status_scale"
                        //enumCode: "status_scale"
                },
                {
                    key: "customer.businessSignboardImage",
                    title: "SIGN_BOARD",
                    "category": "Loan",
                    "subCategory": "DOC1",
                    type: "file",
                    fileType: "application/pdf",
                    using: "scanner",
                    offline:true
                }

            ]
        }, {
            type: "box",
            title: "PROXY_INDICATORS",
            condition: "model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView' || ( model.currentStage=='FieldAppraisal' && model.proxyIndicatorsHasValue)",
            readonly: true,
            items: [{
                    key: "customer.properAndMatchingSignboard",
                    title: "PROPER_MATCHING_SIGNBOARD",
                    type: "string",
                    required: false,
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.bribeOffered",
                    title: "BRIBE_OFFERED",
                    type: "string",
                    required: false,
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.shopOrganized",
                    title: "SHOP_SHED_ORGANIZED",
                    type: "string",
                    required: false,
                    enumCode: "status_scale_2"
                }, {
                    key: "customer.isIndustrialArea",
                    title: "IN_INDUSTRIAL_AREA",
                    type: "string",
                    required: false,
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.customerAttitudeToKinara",
                    title: "CUSTOMER_ATTITUDE_TO_KINARA",
                    type: "string",
                    required: false,
                    enumCode: "status_scale_2"
                }, {
                    key: "customer.bookKeepingQuality",
                    title: "BOOK_KEEPING_QUALITY",
                    type: "string",
                    required: false,
                    enumCode: "status_scale_2"
                }, {
                    key: "customer.challengingChequeBounce",
                    title: "CHALLENGING_CHEQUE_BOUNCE/FESS_CHARGE/POLICIES",
                    type: "string",
                    required: false,
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.allMachinesAreOperational",
                    title: "ALL_MACHINES_OPERATIONAL?",
                    type: "string",
                    required: false,
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.employeeSatisfaction",
                    title: "EMPLOYEE_SATISFACTION",
                    type: "string",
                    required: false,
                    enumCode: "status_scale_2"
                }, {
                    key: "customer.politicalOrPoliceConnections",
                    title: "POLITICAL_POLICE_CONNECTIONS",
                    type: "string",
                    required: false,
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.multipleProducts",
                    title: "MULTIPLE_PRODUCTS_MORE_THAN_3",
                    type: "string",
                    required: false,
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.multipleBuyers",
                    title: "MULTIPLE_BUYERS_MORE_THAN_3",
                    condition: "model.customer.enterprise.businessType == 'Manufacturing'",
                    type: "string",
                    required: false,
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.seasonalBusiness",
                    title: "SEASONAL_BUSINESS",
                    type: "string",
                    required: false,
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.incomeStability",
                    title: "INCOME_STABILITY",
                    type: "string",
                    required: false,
                    enumCode: "income_stability"
                }, {
                    key: "customer.utilisationOfBusinessPremises",
                    title: "UTILIZATION_OF_BUSINESS_PREMISES ",
                    type: "string",
                    required: false,
                    enumCode: "utilisation_of_business"
                }, {
                    key: "customer.approachForTheBusinessPremises",
                    title: "APPROACH_FOR_THE_BUSINESS_PREMISES",
                    type: "string",
                    required: false,
                    enumCode: "status_scale_2"
                }, {
                    key: "customer.safetyMeasuresForEmployees",
                    title: "SAFETY_MEASURES_FOR_EMPLOYEES",
                    type: "string",
                    required: false,
                    enumCode: "decisionmaker"
                }, {
                    key: "customer.childLabours",
                    title: "CHILD_LABOURERS",
                    type: "string",
                    required: false,
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.isBusinessEffectingTheEnvironment",
                    title: "IS_THE_BUSSINESS_IN_EFFECTING_ENVIRONMENT",
                    type: "string",
                    required: false,
                    enumCode: "decisionmaker",
                }, {
                    key: "customer.stockMaterialManagement",
                    title: "STOCK_MATERIAL_MANAGEMENT",
                    type: "string",
                    required: false,
                    enumCode: "status_scale_2"
                }, {
                    key: "customer.customerWalkinToBusiness",
                    title: "CUSTOMER_WALK_IN_TO_THE_BUSINESS",
                    condition: "model.customer.enterprise.businessType == 'Trading'",
                    type: "string",
                    required: false,
                    enumCode: "status_scale"
                        //enumCode: "status_scale"
                },
                {
                    key: "customer.businessSignboardImage",
                    title: "SIGN_BOARD",
                    "category": "Loan",
                    "subCategory": "DOC1",
                    type: "file",
                    fileType: "application/pdf",
                    using: "scanner",
                    offline:true
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
                                title:"CONTACT_PERSON_NAME",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].mobileNo",
                                title:"CONTACT_NUMBER",
                                type:"string",
                                inputmode: "number",
                                numberType: "tel"

                            }/*,
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
                            }*/,
                            {
                                key:"customer.verifications[].address",
                                type:"textarea"
                            },
                            {
                            type: "fieldset",
                            title: "REFERENCE_CHECK",
                            "condition": "model.currentStage=='FieldAppraisal'",
                            items: [
                                /*,
                                {
                                    key:"customer.verifications[].remarks",
                                    title:"REMARKS",
                                },*/
                                {
                                    key:"customer.verifications[].knownSince",
                                    required:true
                                },
                                {
                                    key:"customer.verifications[].goodsSold",
                                    "condition": "model.customer.verifications[arrayIndex].relationship=='Business Material Suppliers'"
                                },
                                {
                                    key:"customer.verifications[].goodsBought",
                                    "condition": "model.customer.verifications[arrayIndex].relationship=='Business Buyer'"
                                },
                                {
                                    key:"customer.verifications[].paymentTerms",
                                    type:"select",
                                    "title":"payment_tarms",
                                    enumCode: "payment_terms"
                                },
                                {
                                    key:"customer.verifications[].modeOfPayment",
                                    type:"select",
                                    enumCode: "payment_mode"
                                },
                                {
                                    key:"customer.verifications[].outstandingPayable",
                                    "condition": "model.customer.verifications[arrayIndex].relationship=='Business Material Suppliers'"
                                },
                                {
                                    key:"customer.verifications[].outstandingReceivable",
                                    "condition": "model.customer.verifications[arrayIndex].relationship=='Business Buyer'"
                                },
                                {
                                    key:"customer.verifications[].customerResponse",
                                    title:"CUSTOMER_RESPONSE",
                                    type:"select",
                                    required:true,
                                    titleMap: [{
                                                    value: "positive",
                                                    name: "positive"
                                                },{
                                                    value: "Negative",
                                                    name: "Negative"
                                                }]
                                }
                            ]
                            }
                         ]
                    },
                ]
            },
            {
                "type": "box",
                "title": "REFERENCES",
                "condition": "model.currentStage=='ApplicationReview' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
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
                                title:"CONTACT_PERSON_NAME",
                                type:"string"
                            },
                            {
                                key:"customer.verifications[].mobileNo",
                                title:"CONTACT_NUMBER",
                                type:"string"
                            }/*,
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
                            }*/,
                            {
                                key:"customer.verifications[].address",
                                type:"textarea"
                            },
                            {
                            type: "fieldset",
                            title: "REFERENCE_CHECK",
                            "condition": "model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
                            items: [
                                /*,
                                {
                                    key:"customer.verifications[].remarks",
                                    title:"REMARKS",
                                }*/
                                {
                                    key:"customer.verifications[].knownSince"
                                },
                                {
                                    key:"customer.verifications[].goodsSold",
                                    "condition": "model.customer.verifications[arrayIndex].relationship=='Business Material Suppliers'"
                                },
                                {
                                    key:"customer.verifications[].goodsBought",
                                    "condition": "model.customer.verifications[arrayIndex].relationship=='Business Buyer'"
                                },
                                {
                                    key:"customer.verifications[].paymentTerms",
                                    type:"select",
                                    "title":"payment_tarms",
                                    enumCode: "payment_terms"
                                },
                                {
                                    key:"customer.verifications[].modeOfPayment",
                                    type:"select",
                                    enumCode: "payment_mode"
                                },
                                {
                                    key:"customer.verifications[].outstandingPayable",
                                    "condition": "model.customer.verifications[arrayIndex].relationship=='Business Material Suppliers'"
                                },
                                {
                                    key:"customer.verifications[].outstandingReceivable",
                                    "condition": "model.customer.verifications[arrayIndex].relationship=='Business Buyer'"
                                },
                                {
                                    key:"customer.verifications[].customerResponse",
                                    title:"CUSTOMER_RESPONSE",
                                    type:"string"
                                }
                            ]
                            }

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
                                using: "scanner",
                                offline:true
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
                "condition": "model.currentStage=='ApplicationReview' || model.currentStage == 'Application' || model.currentStage == 'FieldAppraisal' || model.currentStage == 'FieldAppraisalReview' || model.currentStage == 'CentralRiskReview' || model.currentStage == 'CreditCommitteeReview' || model.currentStage=='Sanction'||model.currentStage == 'Rejected'||model.currentStage == 'loanView'",
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
                                using: "scanner",
                                offline:true
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
                        "onClick": "actions.save(model, formCtrl, form, $event)",
                        "buttonType": "submit"
                    }
                ]
            },
            {
                "type": "actionbox",
                "condition": "model.customer.id && !(model.currentStage=='ApplicationReview' || model.currentStage=='CentralRiskReview' || model.currentStage=='CreditCommitteeReview'||model.currentStage == 'Rejected'||model.currentStage == 'loanView')",
                "items": [
                    {
                        "type": "submit",
                        "title": "COMPLETE_ENROLMENT",
                        "buttonType": "submit"

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
                if (model.customer.enterprise.isGSTAvailable === "YES"){
                    try
                    {
                        var count = 0;
                        for (var i = 0; i < model.customer.enterpriseRegistrations.length; i++) {
                            if (model.customer.enterpriseRegistrations[i].registrationType === "GST No"
                                && model.customer.enterpriseRegistrations[i].registrationNumber != ""
                                && model.customer.enterpriseRegistrations[i].registrationNumber != null
                                ) {
                                count++;
                            }
                        }
                        if (count < 1) {
                            PageHelper.showProgress("enrolment","Since GST is applicable so please select Registration type GST No and provide Registration details ",9000);
                            return false;
                        }
                    }
                    catch(err){
                        console.error(err);
                    }
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
                if (model.currentStage == 'ApplicationReview') {
                    PageHelper.showProgress("enrolment","Loan must be saved/updated for psychometric test", 6000);
                }

                PageHelper.showProgress('enrolment','Saving..');
                EnrollmentHelper.saveData(reqData).then(function(resp){
                    formHelper.resetFormValidityState(formCtrl);
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

                if (model.customer.enterprise.isGSTAvailable === "YES"){
                    try
                    {
                        var count = 0;
                        for (var i = 0; i < model.customer.enterpriseRegistrations.length; i++) {
                            if (model.customer.enterpriseRegistrations[i].registrationType === "GST No"
                                && model.customer.enterpriseRegistrations[i].registrationNumber != ""
                                && model.customer.enterpriseRegistrations[i].registrationNumber != null
                                && model.customer.enterpriseRegistrations[i].registeredDate != ""
                                && model.customer.enterpriseRegistrations[i].registeredDate != null) {
                                count++;
                            }
                        }
                        if (count < 1) {
                            PageHelper.showProgress("enrolment","Since GST is applicable so please select Registration type GST No and provide Registration details ",9000);
                            return false;
                        }
                    }
                    catch(err){
                        console.error(err);
                    }
                }

                if (model.currentStage == 'Application') {
                    if (model.customer.verifications.length<2){
                        PageHelper.showProgress("enrolment","minimum two references are mandatory",5000);
                        return false;
                    }
                }
                if (model.currentStage == 'ApplicationReview') {
                    PageHelper.showProgress("enrolment","Loan must be saved/updated for psychometric test", 6000);
                }
                if(model.currentStage=='ScreeningReview'){
                    var commercialCheckFailed = false;
                    if(model.customer.enterpriseBureauDetails && model.customer.enterpriseBureauDetails.length>0){
                        for (var i = model.customer.enterpriseBureauDetails.length - 1; i >= 0; i--) {
                            if(!model.customer.enterpriseBureauDetails[i].fileId
                                || !model.customer.enterpriseBureauDetails[i].bureau
                                || model.customer.enterpriseBureauDetails[i].doubtful==null
                                || model.customer.enterpriseBureauDetails[i].loss==null
                                || model.customer.enterpriseBureauDetails[i].specialMentionAccount==null
                                || model.customer.enterpriseBureauDetails[i].standard==null
                                || model.customer.enterpriseBureauDetails[i].subStandard==null){
                                commercialCheckFailed = true;
                                break;
                            }
                        }
                    }
                    else
                        commercialCheckFailed = true;
                    if(commercialCheckFailed && model.customer.customerBankAccounts && model.customer.customerBankAccounts.length>0){
                        for (var i = model.customer.customerBankAccounts.length - 1; i >= 0; i--) {
                            if(model.customer.customerBankAccounts[i].accountType == 'OD' || model.customer.customerBankAccounts[i].accountType == 'CC'){
                                PageHelper.showProgress("enrolment","Commercial bureau check fields are mandatory",5000);
                                return false;
                            }
                        }
                    }
                }
                var reqData = _.cloneDeep(model);
                EnrollmentHelper.fixData(reqData);

                if (!(validateRequest(reqData))){
                    return;
                }

                PageHelper.showProgress('enrolment','Updating...', 2000);
                EnrollmentHelper.proceedData(reqData).then(function(resp){
                    formHelper.resetFormValidityState(form);
                    PageHelper.showProgress('enrolmet','Done.', 5000);
                    Utils.removeNulls(resp.customer,true);
                    model.customer = resp.customer;
                    if (model._bundlePageObj){
                        BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer});
                        Dedupe.create({
                            "customerId": model.customer.id,
                            "status": "pending"
                            }).$promise;
                    }
                }, function(httpRes){
                    PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                    PageHelper.showErrors(httpRes);
                });
            }
        }
    };
}]);
