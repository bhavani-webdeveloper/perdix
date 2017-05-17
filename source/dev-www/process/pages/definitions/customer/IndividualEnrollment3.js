irf.pageCollection.factory(irf.page("customer.IndividualEnrollment3"), ["$log", "$state", "Enrollment", "IrfFormRequestProcessor", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager",
    function($log, $state, Enrollment, IrfFormRequestProcessor, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "INDIVIDUAL_ENROLLMENT_3",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.customer = model.customer || {};
                model.branchId = SessionStore.getBranchId() + '';
                model.customer.date = model.customer.date || Utils.getCurrentDate();
                model.customer.nameOfRo = model.customer.nameOfRo || SessionStore.getLoginname();
                model = Utils.removeNulls(model, true);
                model.customer.kgfsName = SessionStore.getBranch();
                model.customer.customerType = 'Individual';
                var self = this;

                var formRequest = {
                    "overRides": {
                        "KYC.additionalKYCs.kyc1ProofType": {
                            title: "MY CUSTOM TITLE"
                        },
                        "BusinessOccupationDetails.businessDetails.businessVillage": {
                            title: "NO_OF_WORKERS_EMPLOYED"
                        },
                        "BusinessOccupationDetails.businessDetails.businessLandmark": {
                            title: "WHO_MANAGES_THE_BUSINESS",
                            type: "select",
                            titleMap: {
                                "Female": "Female",
                                "Male": "Male",
                                "Both": "Both"
                            }
                        },
                        "BusinessOccupationDetails.businessDetails.businessPincode": {
                            title: "ARE_YOU_INVOLVED_IN_MARKET_RELATED_BUSINESS_TRANSACTIONS",
                            type: "select",
                            titleMap: {
                                "YES": "Yes",
                                "NO": "NO",
                            }
                        },
                        "BusinessOccupationDetails.businessDetails.businessPhone": {
                            title: "WHO_TAKE_CARE_OF_THE_BUSINESS_WHEN_YOU_ARE_NOT_AVAILABLE",
                            type: "select",
                            titleMap: {
                                "Family Member": "Family Member",
                                "Employee": "Employee",
                                "Business Is Closed": "Business Is Closed"
                            }
                        },
                        "BusinessOccupationDetails.agricultureDetails.cropName": {
                            title: "IRRIGATED_LAND",
                            "type": "string"
                        },
                        "BusinessOccupationDetails.agricultureDetails.irrigated": {
                            title: "NON_IRRIGATED_LAND",
                            "type": "string"
                        },
                        "BusinessOccupationDetails.agricultureDetails.harvestMonth": {
                            title: "TOTAL_LAND",
                            "type": "string"
                        },
                        "BusinessOccupationDetails.agricultureDetails.landArea": {
                            title: "DAIRY_ANIMALS",
                            "type": "select"
                        },
                    },
                    "includes": [
                        "CustomerInformation",
                        "CustomerInformation.branchId",
                        "CustomerInformation.centreCode",
                        "CustomerInformation.area",
                        "CustomerInformation.groupName",
                        "CustomerInformation.loanCycle",
                        "CustomerInformation.firstName",
                        "CustomerInformation.gender",
                        "CustomerInformation.age",
                        "CustomerInformation.dateOfBirth",
                        "CustomerInformation.maritalStatus",
                        "CustomerInformation.fatherFirstName",
                        "CustomerInformation.spouseFirstName",
                        "CustomerInformation.religion",
                        "CustomerInformation.caste",
                        "CustomerInformation.dateOfBirth",
                        "KYC",
                        "KYC.IdentityProof1",
                        "KYC.IdentityProof1.identityProof",
                        "KYC.IdentityProof1.identityProofImageId",
                        "KYC.IdentityProof1.udf30",
                        "KYC.IdentityProof1.identityProofNo",
                        "KYC.IdentityProof1.idProofIssueDate",
                        "KYC.IdentityProof1.idProofValidUptoDate",
                        "KYC.IdentityProof1.addressProofSameAsIdProof",
                        "KYC.addressProof1",
                        "KYC.addressProof1.addressProof",
                        "KYC.addressProof1.addressProofImageId",
                        "KYC.addressProof1.udf29",
                        "KYC.addressProof1.addressProofNo",
                        "KYC.addressProof1.addressProofIssueDate",
                        "KYC.addressProof1.addressProofValidUptoDate",
                        "ContactInformation",
                        "ContactInformation.CustomerResidentialAddress",
                        "ContactInformation.CustomerResidentialAddress.doorNo",
                        "ContactInformation.CustomerResidentialAddress.street",
                        "ContactInformation.CustomerResidentialAddress.locality",
                        "ContactInformation.CustomerResidentialAddress.villageName",
                        "ContactInformation.CustomerResidentialAddress.postOffice",
                        "ContactInformation.CustomerResidentialAddress.district",
                        "ContactInformation.CustomerResidentialAddress.pincode",
                        "ContactInformation.CustomerResidentialAddress.state",
                        "ContactInformation.CustomerResidentialAddress.stdCode",
                        "ContactInformation.CustomerResidentialAddress.landLineNo",
                        "ContactInformation.CustomerResidentialAddress.mobilePhone",
                        "ContactInformation.CustomerResidentialAddress.mailSameAsResidence",
                        "ContactInformation.CustomerPermanentAddress",
                        "ContactInformation.CustomerPermanentAddress.mailingDoorNo",
                        "ContactInformation.CustomerPermanentAddress.mailingStreet",
                        "ContactInformation.CustomerPermanentAddress.mailingLocality",
                        "ContactInformation.CustomerPermanentAddress.mailingPostoffice",
                        "ContactInformation.CustomerPermanentAddress.mailingDistrict",
                        "ContactInformation.CustomerPermanentAddress.mailingPincode",
                        "ContactInformation.CustomerPermanentAddress.mailingState",
                        "familyDetails",
                        "familyDetails.familyMembers",
                        "familyDetails.familyMembers.customerId",
                        "familyDetails.familyMembers.familyMemberFirstName",
                        "familyDetails.familyMembers.relationShip",
                        "familyDetails.familyMembers.gender",
                        "familyDetails.familyMembers.age",
                        "familyDetails.familyMembers.dateOfBirth",
                        "familyDetails.familyMembers.educationStatus",
                        "familyDetails.familyMembers.maritalStatus",
                        "familyDetails.familyMembers.mobilePhone",
                        "familyDetails.familyMembers.healthStatus",
                        "familyDetails.familyMembers.incomes",
                        "familyDetails.familyMembers.incomes.incomeSource",
                        "familyDetails.familyMembers.incomes.incomeEarned",
                        "familyDetails.familyMembers.incomes.frequency",
                        "familyDetails.familyMembers.incomes.monthsPerYear",
                        "HouseVerification",
                        "HouseVerification.HouseDetails",
                        "HouseVerification.HouseDetails.HouseOwnership",
                        "HouseVerification.HouseDetails.Toilet",
                        "Liabilities1",
                        "Liabilities1.liabilities",
                        "Liabilities1.liabilities.loanType",
                        "Liabilities1.liabilities.loanSource",
                        "Liabilities1.liabilities.instituteName",
                        "Liabilities1.liabilities.loanAmountInPaisa",
                        "Liabilities1.liabilities.installmentAmountInPaisa",
                        "Liabilities1.liabilities.startDate",
                        "Liabilities1.liabilities.maturityDate",
                        "Liabilities1.liabilities.frequencyOfInstallment",
                        "Liabilities1.liabilities.liabilityLoanPurpose",
                        "assets",
                        "assets.physicalAssets",
                        "assets.physicalAssets.assetType",
                        "assets.physicalAssets.ownedAssetDetails",
                        "assets.physicalAssets.unit",
                        "assets.physicalAssets.numberOfOwnedAsset",
                        "assets.physicalAssets.ownedAssetValue",
                        "assets.financialAssets",
                        "assets.financialAssets.instrumentType",
                        "assets.financialAssets.nameOfInstitution",
                        "assets.financialAssets.instituteType",
                        "assets.financialAssets.amountInPaisa",
                        "assets.financialAssets.frequencyOfDeposite",
                        "assets.financialAssets.startDate",
                        "assets.financialAssets.maturityDate",
                        "Expenditures1",
                        "Expenditures1.expenditures",
                        "Expenditures1.expenditures.expendituresSection",
                        "Expenditures1.expenditures.expendituresSection.expenditureSource",
                        "Expenditures1.expenditures.expendituresSection.customExpenditureSource",
                        "Expenditures1.expenditures.expendituresSection.frequencySection",
                        "Expenditures1.expenditures.expendituresSection.frequencySection.frequency",
                        "Expenditures1.expenditures.expendituresSection.annualExpensesSection",
                        "Expenditures1.expenditures.expendituresSection.annualExpensesSection.annualExpenses",
                        "BusinessOccupationDetails",
                        "BusinessOccupationDetails.customerOccupationType",
                        "BusinessOccupationDetails.businessDetails",
                        "BusinessOccupationDetails.businessDetails.relationshipWithBusinessOwner",
                        "BusinessOccupationDetails.businessDetails.business/employerName",
                        "BusinessOccupationDetails.businessDetails.businessRegNo",
                        "BusinessOccupationDetails.businessDetails.businessVillage",
                        "BusinessOccupationDetails.businessDetails.businessLandmark",
                        "BusinessOccupationDetails.businessDetails.businessPincode",
                        "BusinessOccupationDetails.businessDetails.businessPhone",
                        "BusinessOccupationDetails.businessDetails.workPeriod",
                        "BusinessOccupationDetails.businessDetails.workPlaceType",
                        "BusinessOccupationDetails.businessDetails.WorkPlace",
                        "BusinessOccupationDetails.businessDetails.WorkPlaceOthers",
                        "BusinessOccupationDetails.agricultureDetails",
                        "BusinessOccupationDetails.agricultureDetails.relationwithFarmer",
                        "BusinessOccupationDetails.agricultureDetails.landOwnership",
                        "BusinessOccupationDetails.agricultureDetails.cropName",
                        "BusinessOccupationDetails.agricultureDetails.irrigated",
                        "BusinessOccupationDetails.agricultureDetails.harvestMonth",
                        "BusinessOccupationDetails.agricultureDetails.landArea",
                        "actionbox",
                        "actionbox.submit",
                        "actionbox.save",
                    ],
                    "excludes": [
                        "KYC.addressProofSameAsIdProof",
                    ]
                };

                

                this.form = IrfFormRequestProcessor.getFormDefinition('IndividualEnrollment', formRequest);
                //this.form.push(actionbox);
                console.log(this.form);
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {
                return [
                    item.customer.urnNo,
                    Utils.getFullName(item.customer.firstName, item.customer.middleName, item.customer.lastName),
                    item.customer.villageName
                ]
            },
            form: [],

            schema: function() {
                return Enrollment.getSchema().$promise;
            },
            actions: {
                setProofs: function(model) {
                    model.customer.addressProofNo = model.customer.aadhaarNo;
                    model.customer.identityProofNo = model.customer.aadhaarNo;
                    model.customer.identityProof = 'Aadhar card';
                    model.customer.addressProof = 'Aadhar card';
                    model.customer.addressProofSameAsIdProof = true;
                    if (model.customer.yearOfBirth) {
                        model.customer.dateOfBirth = model.customer.yearOfBirth + '-01-01';
                    }
                },
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.customer.firstName) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },
                reload: function(model, formCtrl, form, $event) {
                    $state.go("Page.Engine", {
                        pageName: 'customer.IndividualEnrollment',
                        pageId: model.customer.id
                    }, {
                        reload: true,
                        inherit: false,
                        notify: true
                    });
                },
                submit: function(model, form, formName) {
                    var actions = this.actions;
                    $log.info("Inside submit()");
                    $log.warn(model);
                    if (!EnrollmentHelper.validateData(model)) {
                        $log.warn("Invalid Data, returning false");
                        return false;
                    }
                    var reqData = _.cloneDeep(model);
                    EnrollmentHelper.fixData(reqData);

                    var out = reqData.customer.$fingerprint;
                    var fpPromisesArr = [];
                    for (var key in out) {
                        if (out.hasOwnProperty(key) && out[key].data != null) {
                            (function(obj) {
                                var promise = Files.uploadBase64({
                                    file: obj.data,
                                    type: 'CustomerEnrollment',
                                    subType: 'FINGERPRINT',
                                    extn: 'iso'
                                }, {}).$promise;
                                promise.then(function(data) {
                                    reqData.customer[obj.table_field] = data.fileId;
                                    delete reqData.customer.$fingerprint[obj.fingerId];
                                });
                                fpPromisesArr.push(promise);
                            })(out[key]);
                        } else {
                            if (out[key].data == null) {
                                delete out[key];
                            }
                        }
                    }

                    // $q.all start
                    $q.all(fpPromisesArr).then(function() {
                        try {
                            var liabilities = reqData['customer']['liabilities'];
                            if (liabilities && liabilities != null && typeof liabilities.length == "number" && liabilities.length > 0) {
                                for (var i = 0; i < liabilities.length; i++) {
                                    var l = liabilities[i];
                                    l.loanAmountInPaisa = l.loanAmountInPaisa * 100;
                                    l.installmentAmountInPaisa = l.installmentAmountInPaisa * 100;
                                }
                            }

                            var financialAssets = reqData['customer']['financialAssets'];
                            if (financialAssets && financialAssets != null && typeof financialAssets.length == "number" && financialAssets.length > 0) {
                                for (var i = 0; i < financialAssets.length; i++) {
                                    var f = financialAssets[i];
                                    f.amountInPaisa = f.amountInPaisa * 100;
                                }
                            }
                        } catch (e) {
                            $log.info("Error trying to change amount info.");
                        }

                        reqData['enrollmentAction'] = 'PROCEED';

                        irfProgressMessage.pop('enrollment-submit', 'Working... Please wait.', 5000);

                        reqData.customer.verified = true;
                        if (reqData.customer.hasOwnProperty('verifications')) {
                            var verifications = reqData.customer['verifications'];
                            for (var i = 0; i < verifications.length; i++) {
                                if (verifications[i].houseNoIsVerified) {
                                    verifications[i].houseNoIsVerified = 1;
                                } else {
                                    verifications[i].houseNoIsVerified = 0;
                                }
                            }
                        }
                        try {
                            for (var i = 0; i < reqData.customer.familyMembers.length; i++) {
                                var incomes = reqData.customer.familyMembers[i].incomes;

                                for (var j = 0; j < incomes.length; j++) {
                                    switch (incomes[i].frequency) {
                                        case 'M':
                                            incomes[i].monthsPerYear = 12;
                                            break;
                                        case 'Monthly':
                                            incomes[i].monthsPerYear = 12;
                                            break;
                                        case 'D':
                                            incomes[i].monthsPerYear = 365;
                                            break;
                                        case 'Daily':
                                            incomes[i].monthsPerYear = 365;
                                            break;
                                        case 'W':
                                            incomes[i].monthsPerYear = 52;
                                            break;
                                        case 'Weekly':
                                            incomes[i].monthsPerYear = 52;
                                            break;
                                        case 'F':
                                            incomes[i].monthsPerYear = 26;
                                            break;
                                        case 'Fornightly':
                                            incomes[i].monthsPerYear = 26;
                                            break;
                                        case 'Fortnightly':
                                            incomes[i].monthsPerYear = 26;
                                            break;
                                    }
                                }
                            }
                        } catch (err) {
                            console.error(err);
                        }

                        EnrollmentHelper.fixData(reqData);
                        if (reqData.customer.id) {
                            EnrollmentHelper.proceedData(reqData).then(function(resp) {
                                // Utils.removeNulls(resp.customer,true);
                                // model.customer = resp.customer;
                                $state.go('Page.Landing', null);
                            });
                        } else {
                            EnrollmentHelper.saveData(reqData).then(function(res) {
                                EnrollmentHelper.proceedData(res).then(function(resp) {
                                    // Utils.removeNulls(resp.customer,true);
                                    // model.customer = resp.customer;
                                    $state.go('Page.Landing', null);
                                }, function(err) {
                                    Utils.removeNulls(res.customer, true);
                                    model.customer = res.customer;
                                });
                            });
                        }
                    });
                }
            }
        };
    }
]);