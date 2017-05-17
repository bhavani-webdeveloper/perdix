irf.pageCollection.factory("Pages__CustomerRUD",
    ["$log", "$q", "Enrollment", 'PageHelper', 'irfProgressMessage', '$stateParams', '$state',
        'formHelper', "BASE_URL", "$window", "SessionStore", "Utils",
        function ($log, $q, Enrollment, PageHelper, irfProgressMessage, $stateParams, $state,
                  formHelper, BASE_URL, $window, SessionStore, Utils) {

            var fixData = function (model) {
                $log.info("Before fixData");
                Utils.removeNulls(model, true);
                if (_.has(model.customer, 'udf.userDefinedFieldValues')){
                    var fields = model.customer.udf.userDefinedFieldValues;
                    $log.info(fields);
                    fields['udf17'] = Number(fields['udf17']);
                    fields['udf10'] = Number(fields['udf10']);
                    fields['udf11'] = Number(fields['udf11']);
                    fields['udf28'] = Number(fields['udf28']);
                    fields['udf32'] = Number(fields['udf32']);
                    fields['udf1'] = Boolean(fields['udf1']);
                    fields['udf6'] = Boolean(fields['udf6']);

                    for(var i=1; i<=40; i++){
                        if (!_.has(model.customer.udf.userDefinedFieldValues, 'udf' + i)){
                            model.customer.udf.userDefinedFieldValues['udf'+i] = '';
                        }
                    }
                }

                $log.info("After fixData");
                $log.info(model);

                return model;
            };

            return {
                "id": "CustomerRUD",
                "type": "schema-form",
                "name": "CustomerRUD",
                "title": "Customer Details",
                "subTitle": "",
                "uri": "Profile/Edit Customer",
                initialize: function (model, form, formCtrl) {
                    var custId = $stateParams.pageId;
                    $log.info("Loading data for Cust ID " + custId);

                    if (custId == undefined || custId == null) {
                        $state.go('Page.Engine', {
                            pageName: "CustomerSearch",
                            pageId: null
                        });
                    }
                    model._screenMode = 'VIEW';

                    //try {
                    //    if ($stateParams.pageId !== null) {
                    //        if ($stateParams.pageData.intent !== undefined) {
                    //            model._screenMode = $stateParams.pageData.intent;
                    //        }
                    //        else {
                    //            $state.go('Page.Engine',{
                    //                pageName:"CustomerSearch",
                    //                pageId:null
                    //            });
                    //        }
                    //    }
                    //}catch(err){
                    //    $log.error(err);
                    //    $state.go('Page.Engine',{
                    //        pageName:"CustomerSearch",
                    //        pageId:null
                    //    });
                    //}

                    PageHelper.showLoader();
                    irfProgressMessage.pop("cust-load", "Loading Customer Data...");
                    Enrollment.getCustomerById({id: custId}, function (resp, header) {
                        PageHelper.hideLoader();
                        model.customer = _.cloneDeep(resp);
                        model = fixData(model);
                        $window.scrollTo(0, 0);
                        irfProgressMessage.pop("cust-load", "Load Complete", 2000);
                    }, function (resp) {
                        PageHelper.hideLoader();
                        irfProgressMessage.pop("cust-load", "An Error Occurred. Failed to fetch Data", 5000);
                        $state.go("Page.Engine", {
                            pageName: "CustomerSearch",
                            pageId: null
                        });

                    });

                },
                form: [
                    {
                        "type": "box",
                        "title": "CUSTOMER_INFORMATION",
                        "items": [
                            {
                                "key": "customer.aadhaarNo",
                                "type": "aadhar",
                                "outputMap": {
                                    "uid": "customer.aadhaarNo",
                                    "name": "customer.firstName",
                                    "gender": "customer.gender",
                                    "dob": "customer.dateOfBirth",
                                    "yob": "customer.yearOfBirth",
                                    "co": "",
                                    "house": "customer.doorNo",
                                    "street": "customer.street",
                                    "lm": "",
                                    "loc": "customer.locality",
                                    "vtc": "customer.villageName",
                                    "dist": "customer.district",
                                    "state": "customer.state",
                                    "pc": "customer.pincode"
                                },
                                onChange: "actions.setProofs(model)"
                            },
                            {
                                key:"customer.photoImageId",
                                type:"file",
                                fileType:"image/*",
                                "offline": true
                            },
                            {
                                key: "customer.centreCode",
                                type: "select",
                                filter: {
                                    "parentCode as branch": "model.customer.kgfsName"
                                }
                            },
                            {
                                key: "customer.enrolledAs",
                                type: "radios"
                            },
                            {
                                key: "customer.firstName",
                                title: "FULL_NAME"
                            },


                            {
                                key: "customer.gender",
                                type: "radios"
                            },
                            {
                                key: "customer.dateOfBirth",
                                type: "date"
                            },
                            {
                                key: "customer.fatherFirstName",
                                title: "FATHER_FULL_NAME"
                            },
                            {
                                key: "customer.maritalStatus",
                                type: "select"
                            },
                            {
                                key: "customer.spouseFirstName",
                                title: "SPOUSE_FULL_NAME",
                                condition: "model.customer.maritalStatus==='MARRIED'"
                            },
                            {
                                key: "customer.spouseDateOfBirth",
                                type: "date",
                                condition: "model.customer.maritalStatus==='MARRIED'"
                            },
                            {
                                key: "customer.udf.userDefinedFieldValues.udf1",
                                condition: "model.customer.maritalStatus==='MARRIED'",
                                title: "SPOUSE_LOAN_CONSENT"

                            }

                        ]
                    }, {
                        "type": "box",
                        "title": "CONTACT_INFORMATION",
                        "items": [{
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
                                "customer.stdCode",
                                "customer.landLineNo",
                                "customer.mobilePhone",
                                "customer.mailSameAsResidence"
                            ]
                        }, {
                            type: "fieldset",
                            title: "CUSTOMER_PERMANENT_ADDRESS",
                            condition: "!model.customer.mailSameAsResidence",
                            items: [
                                "customer.mailingDoorNo",
                                "customer.mailingStreet",
                                "customer.mailingLocality",
                                "customer.mailingPostoffice",
                                {
                                    key: "customer.mailingDistrict",
                                    type: "select"
                                },
                                "customer.mailingPincode",
                                {
                                    key: "customer.mailingState",
                                    type: "select"
                                }
                            ]
                        }
                        ]
                    }, {
                        type: "box",
                        title: "KYC",
                        items: [
                            {
                                type: "fieldset",
                                title: "IDENTITY_PROOF",
                                items: [
                                    {
                                        key: "customer.identityProof",
                                        type: "select"
                                    },
                                    {
                                        key:"customer.identityProofImageId",
                                        type:"file",
                                        fileType:"image/*",
                                        "offline": true
                                    },
                                    {
                                        key:"customer.identityProofReverseImageId",
                                        type:"file",
                                        fileType:"image/*",
                                        "offline": true
                                    },
                                    "customer.identityProofNo",
                                    {
                                        key: "customer.idProofIssueDate",
                                        type: "date"
                                    },
                                    {
                                        key: "customer.idProofValidUptoDate",
                                        type: "date"
                                    }
                                ]
                            },
                            {
                                type: "fieldset",
                                title: "ADDRESS_PROOF",
                                condition: "!model.customer.addressProofSameAsIdProof",
                                items: [
                                    {
                                        key: "customer.addressProof",
                                        type: "select"
                                    },
                                    {
                                        key:"customer.addressProofImageId",
                                        type:"file",
                                        fileType:"image/*",
                                        "offline": true
                                    },
                                    {
                                        key:"customer.addressProofReverseImageId",
                                        type:"file",
                                        fileType:"image/*",
                                        "offline": true
                                    },
                                    "customer.addressProofNo",
                                    {
                                        key: "customer.addressProofIssueDate",
                                        type: "date"
                                    },
                                    {
                                        key: "customer.addressProofValidUptoDate",
                                        type: "date"
                                    },
                                ]
                            }

                        ]
                    },
                    {
                        "type": "box",
                        "title": "T_FAMILY_DETAILS",
                        "items": [{
                            key: "customer.familyMembers",
                            type: "array",
                            items: [
                                {
                                    key: "customer.familyMembers[].customerId"
                                },
                                {
                                    key: "customer.familyMembers[].familyMemberFirstName",
                                    title: "FAMILY_MEMBER_FULL_NAME"
                                },
                                {
                                    key: "customer.familyMembers[].relationShip",
                                    title: "T_RELATIONSHIP"
                                },
                                {
                                    key: "customer.familyMembers[].gender",
                                    type: "radios",
                                    title: "T_GENDER"
                                },
                                {
                                    key: "customer.familyMembers[].dateOfBirth",
                                    title: "T_DATEOFBIRTH"
                                },
                                {
                                    key: "customer.familyMembers[].educationStatus",
                                    type: "select",
                                    title: "T_EDUCATION_STATUS"
                                },
                                {
                                    key: "customer.familyMembers[].maritalStatus",
                                    type: "select",
                                    title: "T_MARITAL_STATUS"
                                },
                                "customer.familyMembers[].mobilePhone",
                                {
                                    key: "customer.familyMembers[].healthStatus"
                                },
                                {
                                    key: "customer.familyMembers[].incomes",
                                    type: "array",
                                    items: [
                                        {
                                            key: "customer.familyMembers[].incomes[].incomeSource",
                                            type:"select"
                                        },
                                        "customer.familyMembers[].incomes[].incomeEarned",
                                        {
                                            key: "customer.familyMembers[].incomes[].frequency",
                                            type:"select"
                                        }

                                    ]

                                }
                            ]
                        },
                            {
                                "type": "fieldset",
                                "title": "EXPENDITURES",
                                "items": [{
                                    key: "customer.expenditures",
                                    type: "array",
                                    remove: null,
                                    view: "fixed",
                                    titleExpr: "model.customer.expenditures[arrayIndex].expenditureSource | translate",
                                    items: [
                                        {
                                            key: "customer.expenditures[].expenditureSource",
                                            type: "select"
                                        },
                                        {
                                            key: "customer.expenditures[].customExpenditureSource",
                                            title:"CUSTOM_EXPENDITURE_SOURCE",
                                            condition: "model.customer.expenditures[arrayIndex].expenditureSource=='Others'"
                                        },
                                        {
                                            type: 'section',
                                            htmlClass: 'row',
                                            items: [
                                                {
                                                    type: 'section',
                                                    htmlClass: 'col-xs-6',
                                                    items: [{
                                                        key: "customer.expenditures[].frequency",
                                                        type: "select",
                                                        notitle: true
                                                    }]
                                                }, 
                                                {
                                                    type: 'section',
                                                    htmlClass: 'col-xs-6',
                                                    items: [{
                                                        key: "customer.expenditures[].annualExpenses",
                                                        type: "amount",
                                                        notitle: true
                                                    }]
                                                }
                                            ]
                                        }
                                    ]
                                }]
                            }]
                    },
                    {
                        "type":"box",
                        "title":"BUSINESS_OCCUPATION_DETAILS",
                        "items":[
                            {
                                key:"customer.udf.userDefinedFieldValues.udf13",
                                type:"select"


                            },
                            {
                                type:"fieldset",
                                condition:"model.customer.udf.userDefinedFieldValues.udf13=='Business' || model.customer.udf.userDefinedFieldValues.udf13=='Employed'",
                                items:[
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf14",
                                        type:"select"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf7"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf22"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf8"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf9"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf10"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf11"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf12"
                                    },

                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf23",
                                        type:"radios"
                                    },

                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf17"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf16",
                                        type:"select"
                                    },

                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf18",
                                        type:"select"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf19",
                                        type:"radios"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf20",
                                        type:"select"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf21",
                                        condition:"model.customer.udf.userDefinedFieldValues.udf20=='OTHERS'"
                                    }
                                ]
                            },
                            {
                                type:"fieldset",
                                condition:"model.customer.udf.userDefinedFieldValues.udf13=='Agriculture'",
                                title:"AGRICULTURE_DETAILS",
                                items:[
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf24",
                                        type:"select"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf25",
                                        type:"select"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf15"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf26"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf27",
                                        type:"select"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf28"
                                    }
                                ]
                            }

                        ]
                    },
                    {
                        "type": "box",
                        "title": "T_ASSETS",
                        "items": [{
                            key: "customer.physicalAssets",
                            type: "array",
                            items: [
                               {
                                   key: "customer.physicalAssets[].assetType",
                                   "title": "ASSET_TYPE",
                                   type: "select"
                               }, {
                                   key: "customer.physicalAssets[].ownedAssetDetails",
                                   type:"select",
                                   screenFilter: true,
                                   parentEnumCode:"asset_type",
                                   parentValueExpr:"model.customer.physicalAssets[arrayIndex].assetType",
                               }, {
                                   key: "customer.physicalAssets[].unit",
                                   "title": "UNIT",
                                   type: "select",
                                   screenFilter: true,
                                   parentEnumCode:"asset_type",
                                   parentValueExpr:"model.customer.physicalAssets[arrayIndex].assetType",
                               },
                               "customer.physicalAssets[].numberOfOwnedAsset", 
                               {
                                   key: "customer.physicalAssets[].ownedAssetValue",
                               }
                            ]
                        },
                            {
                                key: "customer.financialAssets",
                                title:"Financial Assets",
                                type: "array",
                                startEmpty: true,
                                items: [
                                    {
                                        key:"customer.financialAssets[].instrumentType",
                                         type:"select"
                                    },
                                    "customer.financialAssets[].nameOfInstitution",
                                    {
                                        key:"customer.financialAssets[].instituteType",
                                        type:"select"
                                    },
                                    {
                                        key: "customer.financialAssets[].amountInPaisa",
                                        type: "amount"
                                    },
                                    {
                                        key:"customer.financialAssets[].frequencyOfDeposite",
                                        type:"select"
                                    },
                                    {
                                        key:"customer.financialAssets[].startDate",
                                        type:"date"
                                    },
                                    {
                                        key:"customer.financialAssets[].maturityDate",
                                        type:"date"
                                    }
                                ]
                            }]

                    },
                    {
                        type:"box",
                        title:"T_LIABILITIES",
                        items:[
                            {
                                key:"customer.liabilities",
                                type:"array",
                                startEmpty: true,
                                title:"Financial Liabilities",
                                items:[
                                    {
                                        key:"customer.liabilities[].loanType",
                                        type:"select"
                                    },
                                    {
                                        key:"customer.liabilities[].loanSource",
                                        type:"select"
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
                                        key: "customer.liabilities[].startDate",
                                        type:"date"
                                    },
                                    {
                                        key:"customer.liabilities[].maturityDate",
                                        type:"date"
                                    },
                                    {
                                        key:"customer.liabilities[].frequencyOfInstallment",
                                        type:"select"
                                    },
                                    {
                                        key:"customer.liabilities[].liabilityLoanPurpose",
                                        type:"select"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "type": "box",
                        "title": "T_HOUSE_VERIFICATION",
                        "items": [
                            {
                                key:"customer.nameInLocalLanguage"
                            },
                            {
                                key:"customer.addressInLocalLanguage"
                            },

                            {
                                key:"customer.religion"
                            },
                            {
                                key:"customer.caste"
                            },
                            {
                                key:"customer.language"
                            },
                            {
                                type:"fieldset",
                                title:"HOUSE_DETAILS",
                                items:[
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf3",
                                        type:"select"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf2",
                                        condition:"model.customer.udf.userDefinedFieldValues.udf3=='RENTED'"
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf4",

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf5",
                                        type:"radios"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf31",
                                        "type":"select",
                                        //"enumCode":"house_build_type",
                                        "titleMap":{
                                            "CONCRETE":"CONCRETE",
                                            "MUD":"MUD",
                                            "BRICK":"BRICK"
                                        }
                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf32"

                                    },
                                    {
                                        key:"customer.udf.userDefinedFieldValues.udf6"
                                    }
                                ]
                            },
                            {
                                "key": "customer.latitude",
                                "title": "House Location",
                                "type": "geotag",
                                "latitude": "customer.latitude",
                                "longitude": "customer.longitude",
                                "onChange": "fillGeolocation(modelValue, form)"
                            },
                            "customer.nameOfRo",
                            {
                                type: 'section',
                                html: '<center><img ng-src="' + BASE_URL + '/api/stream/{{model.customer.houseVerificationPhoto}}" height="200" style="height:200px;max-width:100%" src="" /></center>'
                            },
                            {
                                key: "customer.date",
                                type:"text"
                            },
                            "customer.place"
                        ]
                    },
                    {
                        "type": "actionbox",
                        "items": [{
                            "type": "save",
                            "title": "SAVE_OFFLINE",
                        }, {
                            "type": "submit",
                            "title": "SUBMIT"
                        }]
                    }
                ],
                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    deleteEnrollment: function (model) {
                        if (window.confirm("Delete - Are You Sure, This action is Irreversible?")) {
                            var remarks = window.prompt("Enter Remarks", "Remarks");
                            PageHelper.showLoader();
                            irfProgressMessage.pop('cust-delete', 'Working...');
                            Enrollment.update({service: "close"}, {
                                "customerId": model.customer.id,
                                "remarks": remarks

                            }, function (resp, headers) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-delete', 'Done.', 2000);
                                $state.go('Page.Engine', {
                                    pageName: "CustomerSearch",
                                    pageId: null
                                });

                            }, function (res) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-delete', 'Oops. An Error Occurred. Please Try Again', 5000);

                                var data = res.data;
                                var errors = [];
                                if (data.errors) {
                                    _.forOwn(data.errors, function (keyErrors, key) {
                                        var keyErrorsLength = keyErrors.length;
                                        for (var i = 0; i < keyErrorsLength; i++) {
                                            var error = {"message": "<strong>" + key + "</strong>: " + keyErrors[i]};
                                            errors.push(error);
                                        }
                                    });

                                }
                                if (data.error) {
                                    errors.push({message: data.error});
                                }
                                PageHelper.setErrors(errors);

                            });

                        }
                    },
                    submit: function (model, form, formName) {

                        if (window.confirm("Update - Are You Sure?")) {
                            PageHelper.showLoader();
                            irfProgressMessage.pop('cust-update', 'Working...');
                            model.enrollmentAction = "SAVE";
                            $log.info(model);
                            var reqData = _.cloneDeep(model);

                            Enrollment.updateEnrollment(reqData, function (res, headers) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-update', 'Done. Customer Updated, ID : ' + res.customer.id, 2000);
                                $state.go("Page.Engine", {
                                    pageName: "CustomerRUD",
                                    pageId: model.customer.id,
                                    pageData: {
                                        intent: 'VIEW'
                                    }
                                }, {
                                    reload: true,
                                    inherit: false,
                                    notify: true
                                });
                            }, function (res, headers) {
                                PageHelper.hideLoader();
                                irfProgressMessage.pop('cust-update', 'Oops. Some error.', 2000);
                                $window.scrollTo(0, 0);
                                PageHelper.showErrors(res);
                            })

                        }

                    },
                    doEdit: function (model) {
                        $state.go("Page.Engine", {
                            pageName: "CustomerRUD",
                            pageId: model.customer.id,
                            pageData: {
                                intent: 'EDIT'
                            }
                        }, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    },
                    exitEdit: function (model) {
                        $state.go("Page.Engine", {
                            pageName: "CustomerRUD",
                            pageId: model.customer.id,
                            pageData: {
                                intent: 'VIEW'
                            }
                        }, {
                            reload: true,
                            inherit: false,
                            notify: true
                        });

                    }
                }
            };
        }]);
