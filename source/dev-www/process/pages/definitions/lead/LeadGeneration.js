irf.pageCollection.factory(irf.page("lead.LeadGeneration"), ["$log", "Enrollment", "$state", "$filter", "$stateParams", "Lead", "LeadHelper", "SessionStore", "formHelper", "entityManager", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "entityManager", "BiometricService", "PagesDefinition", "Queries",

    function($log, Enrollment, $state, $filter, $stateParams, Lead, LeadHelper, SessionStore, formHelper, entityManager, $q, irfProgressMessage,
        PageHelper, Utils, entityManager, BiometricService, PagesDefinition, Queries) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "LEAD_GENERATION",
            "subTitle": "Lead",
            initialize: function(model, form, formCtrl) {
                model.lead = model.lead || {};
                model.siteCode = SessionStore.getGlobalSetting('siteCode');

                if (!(model.$$STORAGE_KEY$$)) {
                    model.lead.customerType = "Enterprise";
                    model.lead.leadStatus = "Incomplete";
                    model.lead.leadInteractions = [{
                        "interactionDate": Utils.getCurrentDate(),
                        "loanOfficerId": SessionStore.getUsername() + ''
                    }];

                    model.lead.branchId = SessionStore.getBranchId();
                    model.lead.branchName = SessionStore.getBranch();
                }
                model = Utils.removeNulls(model, true);

                if (!(model && model.lead && model.lead.id && model.$$STORAGE_KEY$$) && $stateParams.pageId) {

                    PageHelper.showLoader();
                    PageHelper.showProgress("page-init", "Loading...");
                    var leadId = $stateParams.pageId;
                    if (!leadId) {
                        PageHelper.hideLoader();
                    }
                    Lead.get({
                            id: leadId
                        },
                        function(res) {
                            _.assign(model.lead, res);
                            if (model.siteCode == 'sambandh' || model.siteCode == 'saija') {
                                model.lead.customerTypeString = model.lead.customerType;
                            }
                            if (model.lead.currentStage == 'Incomplete') {
                                model.lead.customerType = "Enterprise";
                                model.lead.leadStatus = "Incomplete";
                                model.lead.leadInteractions = [{
                                    "interactionDate": Utils.getCurrentDate(),
                                    "loanOfficerId": SessionStore.getUsername() + ''
                                }];
                            }
                            if (model.lead.currentStage == 'Inprocess') {
                                model.lead.leadInteractions1 = model.lead.leadInteractions;
                                model.lead.leadInteractions = [{
                                    "interactionDate": Utils.getCurrentDate(),
                                    "loanOfficerId": SessionStore.getUsername() + ''
                                }];
                            }
                            model = Utils.removeNulls(model, true);
                            PageHelper.hideLoader();
                        }
                    );
                }
            },
            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return [
                    item.lead.leadName
                ]
            },

            form: [{
                    "type": "box",
                    "title": "LEAD_PROFILE",
                    "items": [{
                            key: "lead.branchName",
                            type: "select",
                            "readonly": true
                        }, {
                            key: "lead.centreName",
                            type: "lov",
                            autolov: true,
                            bindMap: {},
                            required: true,
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
                                model.lead.centreName = valueObj.name;
                                model.lead.centreId = valueObj.id;
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.name
                                ];
                            }
                        },
                        /*{
                                                   key: "lead.centreId",
                                                   type: "select",
                                                   parentEnumCode: "branch_id",
                                                   parentValueExpr: "model.lead.branchId",
                                                   screenFilter: true
                                               },*/
                        {
                            key: "lead.id",
                            condition: "model.lead.id",
                            readonly: true
                        }, {
                            key: "lead.urnNo",
                            condition: "model.lead.urnNo",
                            readonly: true
                        },

                        {
                            type: "fieldset",
                            condition: "model.siteCode !== 'sambandh' && model.siteCode !== 'saija'",
                            title: "LEAD_DETAILS",
                            items: [{
                                    key: "lead.customerType",
                                    type: "select",
                                    titleMap: {
                                        "Individual": "Individual",
                                        "Enterprise": "Individual and Enterprise"
                                    }
                                }, {
                                    "key": "lead.applicantCustomerId",
                                    "title": "CHOOSE_EXISTING_APPLICANT",
                                    "type": "lov",
                                    // "autolov": true,
                                    "lovonly": true,
                                    initialize: function(model, form, parentModel, context) {
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
                                            "readonly": true,
                                        },
                                    },
                                    "outputMap": {
                                        "id": "lead.applicantCustomerId",
                                        "firstName": "lead.firstName"
                                    },
                                    "searchHelper": formHelper,
                                    "search": function(inputModel, form,model) {
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
                                            'customerType': "individual",
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
                                    onSelect: function(valueObj, model, context) {
                                        Enrollment.getCustomerById({id: valueObj.id})
                                            .$promise
                                            .then(function(res){
                                                PageHelper.showProgress("customer-load", "Done..", 5000);
                                                model.lead.mobileNo = res.mobilePhone;
                                                model.lead.gender = res.gender;
                                                model.lead.leadName = res.firstName;
                                                model.lead.maritalStatus=res.maritalStatus;
                                                model.lead.landLineNo=res.landLineNo;
                                                model.lead.dob=res.dateOfBirth;
                                                model.lead.age=res.age;
                                                model.lead.addressLine1=res.doorNo;
                                                model.lead.addressLine2=res.street;
                                                model.lead.pincode=res.pincode;
                                                model.lead.district=res.district;
                                                model.lead.state=res.state;
                                                model.lead.area=res.locality;
                                                model.lead.cityTownVillage=res.villageName;
                                                model.lead.applicantCustomerId = res.id;

                                            }, function(httpRes){
                                                PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
                                        })

                                     }

                                }, {
                                    key: "lead.leadName",
                                    title: "APPLICANT_NAME",
                                    "condition": "model.lead.applicantCustomerId",
                                    "readonly": true,
                                }, {
                                    key: "lead.leadName",
                                    title: "APPLICANT_NAME",
                                    "condition": "!model.lead.applicantCustomerId"
                                }, {
                                    type: "fieldset",
                                    title: "ENTERPRISE_DETAILS",
                                    condition: "model.lead.customerType === 'Enterprise'",
                                    items: [{
                                        "key": "lead.customerId",
                                        "title": "CHOOSE_EXISTING_BUSINESS",
                                        "type": "lov",
                                        "lovonly": true,
                                        initialize: function(model, form, parentModel, context) {
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
                                        "outputMap": {
                                            "id": "lead.customerId",
                                            "firstName": "lead.firstName",
                                        },
                                        "searchHelper": formHelper,
                                        "search": function(inputModel, form, model) {
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
                                        getListDisplayItem: function(data, index) {
                                            return [
                                                [data.firstName, data.fatherFirstName].join(' | '),
                                                data.id,
                                                data.urnNo
                                            ];
                                        },
                                        onSelect: function(valueObj, model, context) {
                                              Enrollment.getCustomerById({id: valueObj.id})
                                            .$promise
                                            .then(function(res){
                                                PageHelper.showProgress("customer-load", "Done..", 5000);
                                                model.lead.businessName = res.firstName;
                                                model.lead.alternateMobileNo=res.mobilePhone;
                                                model.lead.location =res.latitude;
                                                model.lead.ownership =res.enterprise.ownership
                                                model.lead.companyOperatingSince =res.enterprise.companyOperatingSince;
                                                model.lead.companyRegistered =res.enterprise.companyRegistered;
                                                model.lead.businessType =res.enterprise.businessType;
                                                model.lead.businessActivity=res.enterprise.businessActivity;

                                            }, function(httpRes){
                                                PageHelper.showProgress("customer-load", 'Unable to load customer', 5000);
                                        })
                                        }

                                    }, {
                                        key: "lead.businessName",
                                        "condition":"model.lead.customerId",
                                        "readonly": true
                                    }, {
                                        key: "lead.businessName",
                                        "condition":"!model.lead.customerId",
                                        // "readonly": true
                                    }, {
                                        key: "lead.companyRegistered",
                                        type: "radios",
                                        enumCode: "decisionmaker"
                                    }, {
                                        key: "lead.businessType",
                                        type: "select",
                                        enumCode: "businessType"
                                    }, {
                                        key: "lead.businessActivity",
                                        //title:"BUSINESS_LINE",
                                        type: "select",
                                        enumCode: "businessActivity",
                                        parentEnumCode: "businessType"
                                    }, {
                                        key: "lead.companyOperatingSince",
                                        type: "date"
                                    }, {
                                        key: "lead.ownership",
                                        type: "select",
                                        enumCode: "ownership",

                                        /*titleMap: {
                                            "Owned": "Owned",
                                            "Own house without registration": "Own house without registration",
                                            "Family Property": "Family Property",
                                            "Leased": "Leased",
                                            "Rental": "Rental",
                                        }*/

                                    }, {
                                        type: "fieldset",
                                        title: "INDIVIDUAL_DETAILS",
                                        items: [{
                                            key: "lead.gender",
                                            type: "radios"
                                        }, {
                                            key: "lead.dob",
                                            type: "date",
                                            "onChange": function(modelValue, form, model) {
                                                if (model.lead.dob) {
                                                    model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                                                }
                                            }
                                        }, {
                                            key: "lead.age",
                                            type: "number",
                                            "onChange": function(modelValue, form, model) {
                                                if (model.lead.age > 0) {
                                                    if (model.lead.dob) {
                                                        model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-') + moment(model.lead.dob, 'YYYY-MM-DD').format('MM-DD');
                                                    } else {
                                                        model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-MM-DD');
                                                    }
                                                }
                                            }
                                        }, {
                                            key: "lead.maritalStatus",
                                            type: "select",
                                            enumCode: "marital_status",
                                            /*titleMap: {
                                                "MARRIED": "MARRIED",
                                                "UNMARRIED": "UNMARRIED",
                                                "DIVORCED": "DIVORCED",
                                                "SEPARATED": "SEPARATED",
                                                "WIDOW(ER)": "WIDOW(ER)",
                                            }*/
                                        }, {
                                            key: "lead.educationStatus",
                                            type: "select",
                                            enumCode: "education",
                                            /* titleMap: {
                                                 "Below SSLC": "Below SSLC",
                                                 "ITI/Diploma/Professional Qualification": "ITI/Diploma/ProfessionalQualification",
                                                 "Graduate/Equivalent to graduate": "Graduate/Equivalent",
                                                 "Post graduate&equivalent": "PostGraduate & Equivalent",
                                                 "More than post graduation": "MoreThanPostGraduation",
                                             }*/
                                        }]
                                    }]
                                },

                                {
                                    type: "fieldset",
                                    title: "INDIVIDUAL_DETAILS",
                                    condition: "model.lead.customerType === 'Individual'",
                                    items: [{
                                        key: "lead.gender",
                                        type: "radios"
                                    }, {
                                        key: "lead.dob",
                                        type: "date",
                                        "onChange": function(modelValue, form, model) {
                                            if (model.lead.dob) {
                                                model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                                            }
                                        }
                                    }, {
                                        key: "lead.age",
                                        type: "number",
                                        "onChange": function(modelValue, form, model) {
                                            if (model.lead.age > 0) {
                                                if (model.lead.dob) {
                                                    model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-') + moment(model.lead.dob, 'YYYY-MM-DD').format('MM-DD');
                                                } else {
                                                    model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-MM-DD');
                                                }
                                            }
                                        }
                                    }, {
                                        key: "lead.maritalStatus",
                                        type: "select",
                                        enumCode: "marital_status",
                                        /*titleMap: {
                                            "MARRIED": "MARRIED",
                                            "UNMARRIED": "UNMARRIED",
                                            "DIVORCED": "DIVORCED",
                                            "SEPARATED": "SEPARATED",
                                            "WIDOW(ER)": "WIDOW(ER)",
                                        }*/
                                    }, {
                                        key: "lead.educationStatus",
                                        type: "select",
                                        enumCode: "education",
                                        /* titleMap: {
                                             "Below SSLC": "Below SSLC",
                                             "ITI/Diploma/Professional Qualification": "ITI/Diploma/ProfessionalQualification",
                                             "Graduate/Equivalent to graduate": "Graduate/Equivalent",
                                             "Post graduate&equivalent": "PostGraduate & Equivalent",
                                             "More than post graduation": "MoreThanPostGraduation",
                                         }*/
                                    }]
                                },

                                {
                                    type: "fieldset",
                                    title: "CONTACT_DETAILS",
                                    condition: "model.lead.customerType === 'Individual'||model.lead.customerType === 'Enterprise'",
                                    items: [{
                                        key: "lead.mobileNo",
                                    }, {
                                        key: "lead.alternateMobileNo",
                                    }, {
                                        key: "lead.addressLine1",
                                        "title": "DOOR_NO"
                                    }, {
                                        key: "lead.addressLine2",
                                        "title": "STREET"
                                    }, {
                                        key: "lead.pincode",
                                        type: "lov",
                                        fieldType: "number",
                                        autolov: true,
                                        inputMap: {
                                            "pincode": "lead.pincode",
                                            "district": {
                                                key: "lead.district"
                                            },
                                            "state": {
                                                key: "lead.state"
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
                                        search: function(inputModel, form, model) {
                                            return Queries.searchPincodes(inputModel.pincode, inputModel.district, inputModel.state);
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.division + ', ' + item.region,
                                                item.pincode,
                                                item.district + ', ' + item.state
                                            ];
                                        }
                                    }, {
                                        "key": "lead.area",
                                        "readonly": true
                                    }, {
                                        "key": "lead.cityTownVillage",
                                        "readonly": true
                                    }, {
                                        "key": "lead.district",
                                        "readonly": true
                                    }, {
                                        "key": "lead.state",
                                        "readonly": true
                                    }]
                                },
                            ]
                        }, {
                            type: "fieldset",
                            condition: "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                            title: "LEAD_DETAILS",
                            items: [{
                                    key: "lead.leadName",
                                    title: "APPLICANT_NAME",
                                    schema: {
                                        pattern: "^[a-zA-Z\. ]+$",
                                    },
                                    validationMessage: {
                                        202: "Only alphabets and space are allowed."
                                    },
                                }, {
                                    key: "lead.customerTypeString",
                                    type: "select",
                                    titleMap: {
                                        "Individual": "Individual",
                                        "Enterprise": "Individual and Enterprise"
                                    },
                                    readonly: true

                                }, {
                                    type: "fieldset",
                                    title: "ENTERPRISE_DETAILS",
                                    condition: "model.lead.customerTypeString === 'Enterprise'",
                                    items: [{
                                        key: "lead.businessName",
                                        required: false,
                                    }, {
                                        key: "lead.companyRegistered",
                                        type: "radios",
                                        enumCode: "decisionmaker"
                                    }, {
                                        key: "lead.businessType",
                                        required: false,
                                        type: "select",
                                        enumCode: "businessType"
                                    }, {
                                        key: "lead.businessActivity",
                                        //title:"BUSINESS_LINE",
                                        required: false,
                                        type: "select",
                                        enumCode: "businessActivity",
                                        parentEnumCode: "businessType"
                                    }, {
                                        key: "lead.companyOperatingSince",
                                        type: "date"
                                    }, {
                                        key: "lead.ownership",
                                        type: "select",
                                        enumCode: "ownership",

                                        /*titleMap: {
                                            "Owned": "Owned",
                                            "Own house without registration": "Own house without registration",
                                            "Family Property": "Family Property",
                                            "Leased": "Leased",
                                            "Rental": "Rental",
                                        }*/

                                    }, {
                                        type: "fieldset",
                                        title: "INDIVIDUAL_DETAILS",
                                        items: [{
                                            key: "lead.gender",
                                            type: "radios"
                                        }, {
                                            key: "lead.dob",
                                            type: "date",
                                            "onChange": function(modelValue, form, model) {
                                                if (model.lead.dob) {
                                                    model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                                                }
                                            }
                                        }, {
                                            key: "lead.age",
                                            type: "number",
                                            "onChange": function(modelValue, form, model) {
                                                if (model.lead.age > 0) {
                                                    if (model.lead.dob) {
                                                        model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-') + moment(model.lead.dob, 'YYYY-MM-DD').format('MM-DD');
                                                    } else {
                                                        model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-MM-DD');
                                                    }
                                                }
                                            }
                                        }, {
                                            key: "lead.maritalStatus",
                                            type: "select",
                                            enumCode: "marital_status",
                                            /*titleMap: {
                                                "MARRIED": "MARRIED",
                                                "UNMARRIED": "UNMARRIED",
                                                "DIVORCED": "DIVORCED",
                                                "SEPARATED": "SEPARATED",
                                                "WIDOW(ER)": "WIDOW(ER)",
                                            }*/
                                        }, {
                                            key: "lead.educationStatus",
                                            type: "select",
                                            enumCode: "education",
                                            /* titleMap: {
                                                 "Below SSLC": "Below SSLC",
                                                 "ITI/Diploma/Professional Qualification": "ITI/Diploma/ProfessionalQualification",
                                                 "Graduate/Equivalent to graduate": "Graduate/Equivalent",
                                                 "Post graduate&equivalent": "PostGraduate & Equivalent",
                                                 "More than post graduation": "MoreThanPostGraduation",
                                             }*/
                                        }]
                                    }]
                                },

                                {
                                    type: "fieldset",
                                    title: "INDIVIDUAL_DETAILS",
                                    condition: "model.lead.customerTypeString === 'Individual'",
                                    items: [{
                                        key: "lead.gender",
                                        type: "radios"
                                    }, {
                                        key: "lead.dob",
                                        type: "date",
                                        "onChange": function(modelValue, form, model) {
                                            if (model.lead.dob) {
                                                model.lead.age = moment().diff(moment(model.lead.dob, SessionStore.getSystemDateFormat()), 'years');
                                            }
                                        }
                                    }, {
                                        key: "lead.age",
                                        type: "number",
                                        "onChange": function(modelValue, form, model) {
                                            if (model.lead.age > 0) {
                                                if (model.lead.dob) {
                                                    model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-') + moment(model.lead.dob, 'YYYY-MM-DD').format('MM-DD');
                                                } else {
                                                    model.lead.dob = moment(new Date()).subtract(model.lead.age, 'years').format('YYYY-MM-DD');
                                                }
                                            }
                                        }
                                    }, {
                                        key: "lead.maritalStatus",
                                        type: "select",
                                        enumCode: "marital_status",
                                        /*titleMap: {
                                            "MARRIED": "MARRIED",
                                            "UNMARRIED": "UNMARRIED",
                                            "DIVORCED": "DIVORCED",
                                            "SEPARATED": "SEPARATED",
                                            "WIDOW(ER)": "WIDOW(ER)",
                                        }*/
                                    }, {
                                        key: "lead.educationStatus",
                                        type: "select",
                                        enumCode: "education",
                                        /* titleMap: {
                                             "Below SSLC": "Below SSLC",
                                             "ITI/Diploma/Professional Qualification": "ITI/Diploma/ProfessionalQualification",
                                             "Graduate/Equivalent to graduate": "Graduate/Equivalent",
                                             "Post graduate&equivalent": "PostGraduate & Equivalent",
                                             "More than post graduation": "MoreThanPostGraduation",
                                         }*/
                                    }]
                                },

                                {
                                    type: "fieldset",
                                    title: "CONTACT_DETAILS",
                                    condition: "model.lead.customerTypeString === 'Individual'||model.lead.customerTypeString === 'Enterprise'",
                                    items: [{
                                        key: "lead.mobileNo",
                                    }, {
                                        key: "lead.alternateMobileNo",
                                    }, {
                                        key: "lead.addressLine1",
                                        "title": "DOOR_NO"
                                    }, {
                                        key: "lead.addressLine2",
                                        "title": "STREET"
                                    }, {
                                        key: "lead.pincode",
                                        type: "lov",
                                        fieldType: "number",
                                        autolov: true,
                                        inputMap: {
                                            "pincode": "lead.pincode",
                                            "district": {
                                                key: "lead.district"
                                            },
                                            "state": {
                                                key: "lead.state"
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
                                        search: function(inputModel, form, model) {
                                            return Queries.searchPincodes(inputModel.pincode, inputModel.district, inputModel.state);
                                        },
                                        getListDisplayItem: function(item, index) {
                                            return [
                                                item.division + ', ' + item.region,
                                                item.pincode,
                                                item.district + ', ' + item.state
                                            ];
                                        }
                                    }, {
                                        "key": "lead.area",
                                        "readonly": true
                                    }, {
                                        "key": "lead.cityTownVillage",
                                        "readonly": true
                                    }, {
                                        "key": "lead.district",
                                        "readonly": true
                                    }, {
                                        "key": "lead.state",
                                        "readonly": true
                                    }]
                                },
                            ]
                        }
                    ]
                },

                {
                    type: "box",
                    title: "PRODUCT_DETAILS",
                    condition: "model.siteCode !== 'sambandh' && model.siteCode !== 'saija'",
                    items: [{
                            key: "lead.interestedInProduct",
                            title: "INTERESTED_IN_LOAN_PRODUCT",
                            type: "select",
                            required: true,
                            enumCode: "decisionmaker",
                            "onChange": function(modelValue, form, model) {
                                    if (model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO') {
                                        model.lead.leadStatus = "Reject";
                                    } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this week') {
                                        model.lead.leadStatus = "Screening";
                                    } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this month' || model.lead.productRequiredBy == 'Next 2 -3 months' || model.lead.productRequiredBy == 'Next 4-6 months') {
                                        model.lead.leadStatus = "FollowUp";
                                    } else {
                                        model.lead.leadStatus = "Incomplete";
                                    }
                                    /* if (model.lead.interestedInProduct === 'YES') {
                                         model.lead.productCategory = "Asset";
                                         model.lead.productSubCategory = "Loan";
                                     }*/
                                }
                                //onChange: "actions.changeStatus(modelValue, form, model)",
                        },
                        /*{
                                               key: "lead.productCategory",
                                               condition: "model.lead.interestedInProduct==='YES'",
                                               readonly: true,
                                                type: "select",

                                                "Liability": "Liability",
                                                    "others": "others"
                                                    "investment": "investment"
                                                titleMap: {
                                                    "Asset": "Asset",
                                                }
                                           }, {
                                               key: "lead.productSubCategory",
                                               condition: "model.lead.interestedInProduct==='YES'",
                                               readonly: true,
                                               /* type: "select",
                                                titleMap: {
                                                    "Loan": "Loan",
                                                }
                                           },*/
                        {
                            key: "lead.loanAmountRequested",
                            type: "amount",
                            condition: "model.lead.interestedInProduct==='YES'&& model.lead.productSubCategory !== 'investment'",
                        }, {
                            key: "lead.loanPurpose1",
                            condition: "model.lead.interestedInProduct==='YES'&& model.lead.productSubCategory !== 'investment'",
                            type: "select",
                            enumCode: "loan_purpose_1"
                                /*titleMap: {
                                    "AssetPurchase": "AssetPurchase",
                                    "WorkingCapital": "WorkingCapital",
                                    "BusinessDevelopment": "BusinessDevelopment",
                                    "LineOfCredit": "LineOfCredit",

                                }*/
                        }, {
                            key: "lead.productRequiredBy",
                            type: "select",
                            condition: "model.lead.interestedInProduct==='YES'",
                            titleMap: {
                                "In this week": "In this week",
                                "In this month": "In this month",
                                "Next 2 -3 months": "Next 2 -3 months",
                                "Next 4-6 months": "Next 4-6 months",

                            },
                            onChange: "actions.changeStatus(modelValue, form, model)"
                        }, {
                            key: "lead.screeningDate",
                            condition: "(model.lead.interestedInProduct==='YES' && model.lead.productRequiredBy ==='In this week')",
                            type: "date",
                            onChange: "actions.changeStatus(modelValue, form, model)"
                        }, {
                            key: "lead.followUpDate",
                            condition: "(model.lead.interestedInProduct==='YES' && model.lead.productRequiredBy =='In this month'||model.lead.productRequiredBy =='Next 2 -3 months'||model.lead.productRequiredBy =='Next 4-6 months')",
                            type: "date",
                            onChange: "actions.changeStatus(modelValue, form, model)"
                        }, {
                            type: "fieldset",
                            condition: "model.lead.interestedInProduct==='YES'",
                            title: "PRODUCT_ELIGIBILITY",
                            items: [{
                                key: "lead.eligibleForProduct",
                                type: "radios",
                                enumCode: "decisionmaker",
                                onChange: "actions.changeStatus(modelValue, form, model)",
                            }]
                        }, {
                            type: "fieldset",
                            title: "PRODUCT_REJECTION_REASON",
                            condition: "model.lead.interestedInProduct==='NO'||model.lead.eligibleForProduct ==='NO'",
                            items: [{
                                key: "lead.productRejectReason",
                                type: "select",
                                condition: "model.lead.interestedInProduct==='NO'",
                                titleMap: {
                                    "Has many running loans": "Has many running loans",
                                    "Available from banks": "Available from banks",
                                    "Not planned for now": "Not planned for now",
                                    "Available from banks": "Available from banks",
                                    "Interest rate is not satisfactory": "Interest rate is not satisfactory",
                                    "Too many documents": "Too many documents",
                                    "Interested only for cash collection": "Interested only for cash collection"
                                }
                            }, {
                                key: "lead.productRejectReason",
                                type: "select",
                                condition: "model.lead.eligibleForProduct ==='NO'",
                                titleMap: {
                                    "High Interest rate": "High Interest rate",
                                    "Negative": "Negative",
                                    "Not Kinara's target segment": "Not Kinara's target segment",
                                    "Not having proper documents": "Not having proper documents",
                                }
                            }, {
                                key: "lead.additionalRemarks",
                            }, ]
                        }, {
                            type: "fieldset",
                            title: "LEAD_STATUS",
                            items: [{
                                key: "lead.leadStatus",
                                //type: "select",
                                readonly: true,
                                /*titleMap: {
                                    "Screening": "Screening",
                                    "FollowUp": "FollowUp",
                                    "Incomplete": "Incomplete",
                                    "Reject": "Reject"
                                },*/
                                onChange: "actions.changeStatus(modelValue, form, model)"
                            }]
                        }
                    ]
                }, {
                    type: "box",
                    title: "PRODUCT_DETAILS",
                    condition: "model.siteCode == 'sambandh' || model.siteCode == 'saija'",
                    items: [{
                            key: "lead.interestedInProduct",
                            title: "INTERESTED_IN_LOAN_PRODUCT",
                            type: "select",
                            required: false,
                            enumCode: "decisionmaker",
                            "onChange": function(modelValue, form, model) {
                                    if (model.lead.interestedInProduct == 'NO' || model.lead.eligibleForProduct == 'NO') {
                                        model.lead.leadStatus = "Reject";
                                    } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this week') {
                                        model.lead.leadStatus = "Screening";
                                    } else if (model.lead.interestedInProduct == 'YES' && model.lead.productRequiredBy == 'In this month' || model.lead.productRequiredBy == 'Next 2 -3 months' || model.lead.productRequiredBy == 'Next 4-6 months') {
                                        model.lead.leadStatus = "FollowUp";
                                    } else {
                                        model.lead.leadStatus = "Incomplete";
                                    }
                                    /* if (model.lead.interestedInProduct === 'YES') {
                                         model.lead.productCategory = "Asset";
                                         model.lead.productSubCategory = "Loan";
                                     }*/
                                }
                                //onChange: "actions.changeStatus(modelValue, form, model)",
                        },
                        /*{
                                               key: "lead.productCategory",
                                               condition: "model.lead.interestedInProduct==='YES'",
                                               readonly: true,
                                                type: "select",

                                                "Liability": "Liability",
                                                    "others": "others"
                                                    "investment": "investment"
                                                titleMap: {
                                                    "Asset": "Asset",
                                                }
                                           }, {
                                               key: "lead.productSubCategory",
                                               condition: "model.lead.interestedInProduct==='YES'",
                                               readonly: true,
                                               /* type: "select",
                                                titleMap: {
                                                    "Loan": "Loan",
                                                }
                                           },*/
                        {
                            key: "lead.loanAmountRequested",
                            type: "amount",
                            required: false,
                            condition: "model.lead.interestedInProduct==='YES'&& model.lead.productSubCategory !== 'investment'",
                        }, {
                            key: "lead.loanPurpose1",
                            condition: "model.lead.interestedInProduct==='YES'&& model.lead.productSubCategory !== 'investment'",
                            type: "select",
                            required: false,
                            enumCode: "loan_purpose_1"
                                /*titleMap: {
                                    "AssetPurchase": "AssetPurchase",
                                    "WorkingCapital": "WorkingCapital",
                                    "BusinessDevelopment": "BusinessDevelopment",
                                    "LineOfCredit": "LineOfCredit",

                                }*/
                        }, {
                            key: "lead.productRequiredBy",
                            type: "select",
                            required: false,
                            condition: "model.lead.interestedInProduct==='YES'",
                            titleMap: {
                                "In this week": "In this week",
                                "In this month": "In this month",
                                "Next 2 -3 months": "Next 2 -3 months",
                                "Next 4-6 months": "Next 4-6 months",

                            },
                            onChange: "actions.changeStatus(modelValue, form, model)"
                        }, {
                            key: "lead.screeningDate",
                            condition: "(model.lead.interestedInProduct==='YES' && model.lead.productRequiredBy ==='In this week')",
                            type: "date",
                            onChange: "actions.changeStatus(modelValue, form, model)"
                        }, {
                            key: "lead.followUpDate",
                            condition: "(model.lead.interestedInProduct==='YES' && model.lead.productRequiredBy =='In this month'||model.lead.productRequiredBy =='Next 2 -3 months'||model.lead.productRequiredBy =='Next 4-6 months')",
                            type: "date",
                            onChange: "actions.changeStatus(modelValue, form, model)"
                        }, {
                            type: "fieldset",
                            condition: "model.lead.interestedInProduct==='YES'",
                            title: "PRODUCT_ELIGIBILITY",
                            items: [{
                                key: "lead.eligibleForProduct",
                                type: "radios",
                                enumCode: "decisionmaker",
                                onChange: "actions.changeStatus(modelValue, form, model)",
                            }]
                        }, {
                            type: "fieldset",
                            title: "PRODUCT_REJECTION_REASON",
                            condition: "model.lead.interestedInProduct==='NO'||model.lead.eligibleForProduct ==='NO'",
                            items: [{
                                key: "lead.productRejectReason",
                                type: "select",
                                condition: "model.lead.interestedInProduct==='NO'",
                                enumCode: "leadRejectReasonOfCustomer",
                            }, {
                                key: "lead.productRejectReason",
                                type: "select",
                                condition: "model.lead.eligibleForProduct ==='NO'",
                                enumCode: "leadRejectReasonByFieldOfficer",
                            }, {
                                key: "lead.additionalRemarks",
                            }, ]
                        }, {
                            type: "fieldset",
                            title: "LEAD_STATUS",
                            items: [{
                                key: "lead.leadStatus",
                                //type: "select",
                                readonly: true,
                                /*titleMap: {
                                    "Screening": "Screening",
                                    "FollowUp": "FollowUp",
                                    "Incomplete": "Incomplete",
                                    "Reject": "Reject"
                                },*/
                                onChange: "actions.changeStatus(modelValue, form, model)"
                            }]
                        }
                    ]
                },

                {
                    type: "box",
                    title: "PREVIOUS_INTERACTIONS",
                    condition: "model.lead.id && model.lead.currentStage == 'Inprocess'",
                    items: [{
                        key: "lead.leadInteractions1",
                        type: "array",
                        add: null,
                        remove: null,
                        title: "Interaction History",
                        items: [{
                            key: "lead.leadInteractions1[].interactionDate",
                            type: "date",
                            readonly: true,
                        }, {
                            key: "lead.leadInteractions1[].loanOfficerId",
                            readonly: true,
                        }, {
                            key: "lead.leadInteractions1[].typeOfInteraction",
                            type: "select",
                            readonly: true,
                            titleMap: {
                                "Call": "Call",
                                "Visit": "Visit",
                            },
                        }, {
                            key: "lead.leadInteractions1[].customerResponse",
                            readonly: true,
                        }, {
                            key: "lead.leadInteractions1[].additionalRemarks",
                            readonly: true,
                        }, {
                            "key": "lead.leadInteractions1[].location",
                            readonly: true,
                            "type": "geotag",
                            "latitude": "latitude",
                            "longitude": "longitude",
                            "condition": "model.lead.leadInteractions1[arrayIndex].typeOfInteraction == 'Visit'",
                        }, {
                            "key": "lead.leadInteractions1[].picture",
                            readonly: true,
                            "type": "file",
                            "fileType": "image/*",
                            "condition": "model.lead.leadInteractions1[arrayIndex].typeOfInteraction === 'Visit'",
                        }, ]
                    }]
                },


                {
                    type: "box",
                    title: "LEAD_INTERACTIONS",
                    items: [{
                        key: "lead.leadInteractions",
                        type: "array",
                        add: null,
                        remove: null,
                        startEmpty: true,
                        view: "fixed",
                        title: "LEAD_INTERACTIONS",
                        items: [{
                            key: "lead.leadInteractions[].interactionDate",
                            type: "date",
                            readonly: true,
                        }, {
                            key: "lead.leadInteractions[].loanOfficerId",
                            readonly: true,
                        }, {
                            key: "lead.leadInteractions[].typeOfInteraction",
                            type: "select",
                            titleMap: {
                                "Call": "Call",
                                "Visit": "Visit",
                            },
                        }, {
                            key: "lead.leadInteractions[].customerResponse",
                        }, {
                            key: "lead.leadInteractions[].additionalRemarks",
                        }, {
                            "key": "lead.leadInteractions[].location",
                            "type": "geotag",
                            "latitude": "latitude",
                            "longitude": "longitude",
                            "condition": "model.lead.leadInteractions[arrayIndex].typeOfInteraction == 'Visit'",
                        }, {
                            "key": "lead.leadInteractions[].picture",
                            "type": "file",
                            "fileType": "image/*",
                            "condition": "model.lead.leadInteractions[arrayIndex].typeOfInteraction === 'Visit'",
                        }, ]
                    }]
                },


                {
                    "type": "actionbox",
                    "items": [{
                        "type": "save",
                        "title": "Offline Save"
                    }, {
                        "type": "submit",
                        "title": "Submit"
                    }]
                },
            ],

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
                    if (model.siteCode == 'sambandh' || model.siteCode == 'saija') {
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
                            LeadHelper.followData(reqData).then(function(resp) {
                                $state.go('Page.LeadDashboard', null);
                            });
                        } else {
                            LeadHelper.proceedData(reqData).then(function(resp) {
                                $state.go('Page.LeadDashboard', null);
                            }, function(err) {
                                PageHelper.showErrors(err);
                                // Utils.removeNulls(resp.lead, true);
                                // model.lead = resp.lead;
                            });
                        }
                    } else {
                        LeadHelper.saveData(reqData).then(function(res) {
                            LeadHelper.proceedData(res).then(function(resp) {
                                $state.go('Page.LeadDashboard', null);
                            }, function(err) {
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
]);
