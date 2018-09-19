irf.pageCollection.factory(irf.page("workflow.CustomerApprovalApprove"),
    ["$window", "$log", "formHelper", "filterFilter", "Enrollment","Workflow", "Queries", "$q", "$state", "SessionStore", "Utils", "PagesDefinition", "irfNavigator", "User", "SchemaResource", "$stateParams", "PageHelper", "irfProgressMessage",
        function ($window, $log, formHelper, filterFilter, Enrollment,Workflow, Queries, $q, $state, SessionStore, Utils, PagesDefinition, irfNavigator, User, SchemaResource, $stateParams, PageHelper, irfProgressMessage) {
            var branch = SessionStore.getBranch();
            var getCustomer = function (result, model){
                //-------------------------------------------------------------------------------------
                Enrollment.EnrollmentById({ id: result.id }, function (resp, header) {
                    PageHelper.hideLoader();
                    model.customer = _.cloneDeep(resp);
                    model.customer.fullAddress = model.customer.doorNo + " " + model.customer.street + " " + model.customer.locality + " " + model.customer.villageName + " "
                    model.customer.isDateOfBirthChanged = "NO";
                    model.customer.isMobileChanged = "NO";
                    model.customer.isGenderChanged = "NO";
                    model.customer.isOwnershipChanged = "NO";
                    model.customer.isAddressChanged = "NO";
                    //model = fixData(model);

                    $window.scrollTo(0, 0);
                    irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                }, function (resp) {
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);
                    /* $state.go("Page.Engine", {
                         pageName: "CustomerSearch",
                         pageId: null
                     });*/
                });
                //-------------------------------------------------------------------------------------

            }


            var update = function(model, workflowId) {
                Workflow.getByID({ id: workflowId }, function (resp, header) {

                    model.workflow = _.cloneDeep(resp);
                    model.UpdatedWorkflow = JSON.parse(model.workflow.temporary);

                    model.customer = model.workflow.customer;
                    model.customer.fullAddress = model.customer.doorNo + " ," + model.customer.street + "  ," + model.customer.locality + "  ," + model.customer.villageName + " ,"+model.customer.pincode+" ,"+model.customer.district+" ,"+ model.customer.state+" - "+model.customer.pincode
                    //model.customer : NEW
                    //model.workflow.customer : updated
                    if(model.customer.dateOfBirth == model.UpdatedWorkflow.customer.dateOfBirth) {
                        model.customer.isDateOfBirthChanged="NO";
                    }else {
                        model.customer.isDateOfBirthChanged="YES";
                        model.customer.ageProofImageId =model.UpdatedWorkflow.customer.ageProofImageId ;
                        model.customer.newDateOfBirth=model.UpdatedWorkflow.customer.dateOfBirth;
                    }

                    if(model.customer.mobilePhone == model.UpdatedWorkflow.customer.mobilePhone) {
                        model.customer.isMobileChanged="NO";
                    }else {
                        model.customer.isMobileChanged="YES";
                        model.customer.newMobilePhone=model.UpdatedWorkflow.customer.mobilePhone;
                        model.customer.mobileProofImageId=model.UpdatedWorkflow.proof.mobileProofImageId;
                    }

                    if(model.customer.ownership == model.UpdatedWorkflow.customer.ownership) {
                        model.customer.isOwnershipChanged="NO";
                    }else {
                        model.customer.isOwnershipChanged="YES";
                        model.customer.newOwnership=model.UpdatedWorkflow.customer.ownership;
                    }
                    if(model.customer.gender == model.UpdatedWorkflow.customer.gender) {
                        model.customer.isGenderChanged="NO";
                    }else {
                        model.customer.isGenderChanged="YES";
                        model.customer.newGender=model.UpdatedWorkflow.customer.gender;
                    }

                    if(model.customer.doorNo == model.UpdatedWorkflow.customer.doorNo &&
                        model.customer.street == model.UpdatedWorkflow.customer.street &&
                        model.customer.locality == model.UpdatedWorkflow.customer.locality &&
                        model.customer.villageName == model.UpdatedWorkflow.customer.villageName &&
                        model.customer.postOffice == model.UpdatedWorkflow.customer.postOffice &&
                        model.customer.pincode == model.UpdatedWorkflow.customer.pincode &&
                        model.customer.state == model.UpdatedWorkflow.customer.state &&
                        model.customer.district == model.UpdatedWorkflow.customer.district &&
                        model.customer.stdCode == model.UpdatedWorkflow.customer.stdCode &&
                        model.customer.landLineNo == model.UpdatedWorkflow.customer.landLineNo ){
                        model.customer.isAddressChanged="NO";
                    }
                    else {
                        model.customer.isAddressChanged="YES";
                        model.customer.addressProofImageId =model.UpdatedWorkflow.customer.addressProofImageId ;
                        model.customer.doorNo =model.UpdatedWorkflow.customer.doorNo ;
                        model.customer.street = model.UpdatedWorkflow.customer.street ;
                        model.customer.locality = model.UpdatedWorkflow.customer.locality ;
                        model.customer.villageName = model.UpdatedWorkflow.customer.villageName ;
                        model.customer.postOffice = model.UpdatedWorkflow.customer.postOffice;
                        model.customer.pincode = model.UpdatedWorkflow.customer.pincode ;
                        model.customer.state = model.UpdatedWorkflow.customer.state ;
                        model.customer.district = model.UpdatedWorkflow.customer.district ;
                        model.customer.stdCode = model.UpdatedWorkflow.customer.doorNo ;
                        model.customer.landLineNo = model.UpdatedWorkflow.customer.landLineNo ;
                    }

                    irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                    PageHelper.hideLoader();
                }, function (resp) {
                    irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);
                    PageHelper.hideLoader();
                });
            }

            return {
                "name": "APPROVAL_CUSTOMER",
                "type": "schema-form",
                "title": "APPROVAL_CUSTOMER",
                initialize: function (model, form, formCtrl) {
                    $log.info("User Maintanance loaded");
                    var workflowId = $stateParams.pageId;
                    $log.info("Loading data for Cust ID " + workflowId);


                    model._screenMode = 'VIEW';
                    PageHelper.showLoader();
                    irfProgressMessage.pop("cust-load", "Loading Customer Data...");

                    if (workflowId != undefined || workflowId != null) {
                        update(model, workflowId);
                        PageHelper.hideLoader();
                        $window.scrollTo(0, 0);
                    }else {
                        PageHelper.hideLoader();
                    }
                },

                form: [
                    {
                        type: "box",
                        title: "USER_INFORMATION",
                        items: [
                            {
                                key: "customer.firstName",
                                title: "FULL_NAME",
                                readonly: true
                            },
                            {
                                key: "customer.fullAddress",
                                title: "ADDRESS",
                                type : "html",
                                readonly: true
                            },
                            {
                                key: "customer.isAddressChanged",
                                type: "radios",
                                title: "UPDATE",
                                "titleMap": {
                                    "YES": "YES",
                                    "NO": "NO"
                                },
                                readonly: true
                            },
                            {
                                type: "fieldset",
                                title: "DATE_OF_BIRTH",
                                "items": [{
                                    key: "customer.dateOfBirth",
                                    title: "DATE_OF_BIRTH",
                                    type: "date",
                                    readonly: true
                                },
                                    {
                                        key: "customer.isDateOfBirthChanged",
                                        type: "radios",
                                        title: "UPDATE",
                                        "titleMap": {
                                            "YES": "YES",
                                            "NO": "NO"
                                        },
                                        readonly: true
                                    },
                                    {
                                        key: "customer.newDateOfBirth",
                                        type: "date",
                                        title: "UPDATE_DATE_OF_BIRTH",
                                        condition: "model.customer.isDateOfBirthChanged=='YES'",
                                        readonly: true
                                    },
                                    {
                                        key: "customer.ageProofImageId",
                                        type: "file",
                                        title: "AGE_PROOF",
                                        fileType: "file/*",
                                        "category": "Customer",
                                        "subCategory": "AGEPROOF",
                                        "offline": true,
                                        condition: "model.customer.isDateOfBirthChanged=='YES'",
                                        readonly: true
                                    }]
                            },
                            {
                                type: "fieldset",
                                title: "MOBILE_PHONE",
                                "items": [{
                                    key: "customer.mobilePhone",
                                    title: "MOBILE_PHONE",
                                    readonly: true
                                },
                                    {
                                        key: "customer.isMobileChanged",
                                        type: "radios",
                                        title: "UPDTAE",
                                        "titleMap": {
                                            "YES": "YES",
                                            "NO": "NO"
                                        },
                                        readonly: true
                                    },
                                    {
                                        key: "customer.newMobilePhone",
                                        title: "UPDATE_MOBILE_PHONE",
                                        condition: "model.customer.isMobileChanged=='YES'",
                                        readonly: true
                                    },
                                    {
                                        key: "customer.mobileProofImageId",
                                        type: "file",
                                        title: "MOBILE_PROOF",
                                        fileType: "file/*",
                                        "category": "Customer",
                                        "subCategory": "ADDRESSPROOF",
                                        "offline": true,
                                        condition: "model.customer.isMobileChanged=='YES'",
                                        readonly: true
                                    }]
                            },

                            {
                                type: "fieldset",
                                title: "GENDER",
                                "items": [{
                                    key: "customer.gender",
                                    title: "GENDER",
                                    readonly: true
                                },
                                    {
                                        key: "customer.isGenderChanged",
                                        type: "radios",
                                        title: "UPDTAE",
                                        "titleMap": {
                                            "YES": "YES",
                                            "NO": "NO"
                                        },
                                        readonly: true
                                    },
                                    {
                                        key: "customer.newGender",
                                        type: "radios",
                                        title: "UPDATE_GENDER",
                                        "titleMap": {
                                            "MALE": "MALE",
                                            "FEMALE": "FEMALE",
                                            "Un-Specified": "Un-Specified"
                                        },
                                        condition: "model.customer.isGenderChanged=='YES'",
                                        readonly: true

                                    }]
                            },
                            {
                                type: "fieldset",
                                title: "OWNERSHIP",
                                "items": [{
                                    key: "customer.ownership",
                                    title: "OWNERSHIP",
                                    readonly: true
                                }, {
                                    key: "customer.isOwnershipChanged",
                                    type: "radios",
                                    title: "UPDATE",
                                    "titleMap": {
                                        "YES": "YES",
                                        "NO": "NO"
                                    },
                                    readonly: true
                                },
                                    {
                                        key: "customer.newOwnership",
                                        title: "UPDATE_OWNERSHIP",
                                        condition: "model.customer.isOwnershipChanged=='YES'",
                                        readonly: true
                                    }]
                            }
                        ]
                    },
                    {
                        "type": "box",
                        "title": "CONTACT_INFORMATION",
                        condition: "model.customer.isAddressChanged=='YES'",
                        readonly: true,
                        "items": [
                            {
                                type: "fieldset",
                                title: "CUSTOMER_RESIDENTIAL_ADDRESS",
                                items: [
                                    "customer.doorNo",
                                    "customer.street",
                                    "customer.locality",
                                    {
                                        key: "customer.villageName",
                                        type: "select",
                                        filter: {
                                            'parentCode as branch': 'model.customer.kgfsName'
                                        }
                                    },
                                    "customer.postOffice",
                                    {
                                        key: "customer.district",
                                        type: "select"
                                    },
                                    "customer.pincode",
                                    {
                                        key: "customer.state",
                                        type: "select"
                                    },
                                    "customer.landLineNo",
                                ]
                            },
                            {
                                key: "customer.addressProofImageId",
                                type: "file",
                                title: "ADDRESS_PROOF",
                                fileType: "file/*",
                                "category": "Customer",
                                "subCategory": "ADDRESSPROOF",
                                "offline": true,
                                condition: "model.customer.isAddressChanged=='YES'"
                            }
                        ]
                    },
                    {
                        "type": "box",
                        colClass: "col-sm-12",
                        "title": "REVIEW",
                        "items": [
                            {
                                key: "action",
                                type: "radios",
                                title: "UPDATE",
                                "titleMap": {
                                    "PROCEED": "PROCEED",
                                    "REJECT": "REJECT",
                                    "SENDBACK": "SEND_BACK"
                                },
                                required: true
                            },
                            {
                                key: "customer.remark",
                                title: "REMARK"
                            }
                        ]
                    },
                    {
                        "type": "actionbox",
                        "items": [{
                            "type": "submit",
                            "title": "SAVE"
                        }]
                    }
                ],

                schema: {
                    "type": "object",
                    "properties": {
                        "customer": {
                            "type": "object",
                            "properties": {
                                "id": {
                                    "type": "number",
                                    "title": "CUSTOMER_ID"
                                },
                                "urnNo": {
                                    "type": "string",
                                    "title": "URNNO"
                                },
                                "firstName": {
                                    "type": "string",
                                    "title": "FIRST_NAME"
                                },
                                "branchName": {
                                    "type": "string",
                                    "title": "BRANCHNAME"
                                },
                                "customerType": {
                                    "type": "string",
                                    "title": "CUSTOMER_TYPE"
                                },
                                "lastName": {
                                    "type": "string",
                                    "title": "LAST_NAME"
                                },
                                "doorNo": {
                                    "type": ["string","null"],
                                    "title": "DOOR_NO",
                                    "captureStages": ["Init"]
                                },
                                "street": {
                                    "type": ["string","null"],
                                    "title": "STREET",
                                    "captureStages": ["Init"]
                                },
                                "postOffice": {
                                    "type": ["string","null"],
                                    "title": "POST_OFFICE",
                                    "captureStages": ["Init"]
                                },
                                "landmark": {
                                    "type": ["string","null"],
                                    "title": "LANDMARK",
                                    "captureStages": ["Init"]
                                },
                                "pincode": {
                                    "type": ["number","null"],
                                    "title": "PIN_CODE",
                                    "minimum": 100000,
                                    "maximum": 999999,
                                    "captureStages": ["Init"]
                                },
                                "locality": {
                                    "type": ["string","null"],
                                    "title": "LOCALITY",
                                    "captureStages": ["Init"]
                                },
                                "villageName": {
                                    "type": ["string","null"],
                                    "title": "VILLAGE_NAME",
                                    "enumCode": "village",
                                    "captureStages": ["Init"]
                                },
                                "district": {
                                    "type": ["string","null"],
                                    "title": "DISTRICT",
                                    "enumCode": "district",
                                    "captureStages": ["Init"]
                                },
                                "state": {
                                    "type": ["string","null"],
                                    "title": "STATE",
                                    "enumCode": "state_master",
                                    "captureStages": ["Init"]
                                },
                                "mailingDoorNo": {
                                    "type": ["string","null"],
                                    "title": "DOOR_NO",
                                    "captureStages": ["Init"]
                                },
                                "mailingStreet": {
                                    "type": ["string","null"],
                                    "title": "STREET",
                                    "captureStages": ["Init"]
                                },
                                "mailingPostoffice": {
                                    "type": ["string","null"],
                                    "title": "POST_OFFICE",
                                    "captureStages": ["Init"]
                                },
                                "mailingPincode": {
                                    "type": ["string","null"],
                                    "title": "PIN_CODE",
                                    "captureStages": ["Init"]
                                },
                                "mailingLocality": {
                                    "type": ["string","null"],
                                    "title": "LOCALITY",
                                    "captureStages": ["Init"]
                                },
                                "mailingDistrict": {
                                    "type": ["string","null"],
                                    "title": "DISTRICT",
                                    "enumCode": "district",
                                    "captureStages": ["Init"]
                                },
                                "mailingState": {
                                    "type": ["string","null"],
                                    "title": "STATE",
                                    "enumCode": "state_master",
                                    "captureStages": ["Init"]
                                },
                                "dateOfBirth": {
                                    "type": ["string","null"],
                                    "title": "DATE_OF_BIRTH",
                                    "format": "date",
                                    "captureStages": ["Init"]
                                },
                                "mobilePhone": {
                                    "type": ["string","null"],
                                    "title": "MOBILE_PHONE",
                                    "minLength": 10,
                                    "maxLength": 10,
                                    "captureStages": ["Init"]
                                },
                                "landLineNo": {
                                    "type": ["string","null"],
                                    "title": "LANDLINE_NO",
                                    "minLength": 5,
                                    "maxLength": 15,
                                    "captureStages": ["Init"]
                                },
                                "gender": {
                                    "type": ["string","null"],
                                    "title": "GENDER",
                                    "enumCode": "gender",
                                    "captureStages": ["Init"]
                                },
                                "ownership": {
                                    "type": ["string","null"],
                                    "title": "OWNERSHIP",
                                    "enumCode": "ownership",
                                    "captureStages": ["Init"]
                                }
                            }
                        }
                    },
                    "required": [
                        "customer"
                    ]
                },
                actions: {
                    submit: function (model, form, formName) {
                        if (window.confirm("Update - Are You Sure?")) {
                            PageHelper.showLoader();
                            irfProgressMessage.pop('cust-update', 'Working...');

                            var updatedModel= _.cloneDeep(model);

                            updatedModel.workflow.action=updatedModel.action
                            if(updatedModel.action=="SENDBACK")
                                updatedModel.workflow.sendbackStage="Init"

                            Workflow.save(updatedModel.workflow, function (res, headers) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-update', 'Done. Customer Updated, ID : ' + res.customer.id, 2000);
                                irfNavigator.goBack();
                            }, function (res, headers) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-update', 'Oops. Some error.', 2000);
                                $window.scrollTo(0, 0);
                                PageHelper.showErrors(res);
                            })
                        }
                    }
                }
            };

        }]);

