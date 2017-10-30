define({
    pageUID: "witfin.customer.IndividualEnrollment2",
    pageType: "Engine",
    dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor"],

    $pageFn: function($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                     PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor) {

        var branch = SessionStore.getBranch();
        var getIncludes = function (model) {
            
            return [
                    // "CustomerInformation",
                    // "CustomerInformation.customerBranchId",
                    // "CustomerInformation.centreId",
                    // "CustomerInformation.area",
                    // //"CustomerInformation.groupName",
                    // //"CustomerInformation.loanCycle",
                    // "CustomerInformation.firstName",
                    // "CustomerInformation.photoImageId",
                    // "CustomerInformation.gender",
                    // "CustomerInformation.age",
                    // "CustomerInformation.dateOfBirth",
                    // "CustomerInformation.maritalStatus",
                    // "CustomerInformation.fatherFirstName",
                    // "CustomerInformation.spouseFirstName",
                    // "CustomerInformation.spouseDateOfBirth",
                    // "CustomerInformation.religion",
                    // "CustomerInformation.caste",
                    // "CustomerInformation.dateOfBirth",                       
                    "KYC",
                    "KYC.customerSearch",
                    "KYC.IdentityProof1",
                    "KYC.IdentityProof1.identityProof",
                    "KYC.IdentityProof1.identityProofImageId",
                    // "KYC.IdentityProof1.identityProofReverseImageId",
                    "KYC.IdentityProof1.identityProofNo",
                    "KYC.IdentityProof1.identityProofNo1",
                    "KYC.IdentityProof1.identityProofNo2",
                    "KYC.IdentityProof1.identityProofNo3",
                    // "KYC.IdentityProof1.idProofIssueDate",
                    // "KYC.IdentityProof1.idProofValidUptoDate",
                    "KYC.IdentityProof1.addressProofSameAsIdProof",
                    "KYC.addressProof1",
                    "KYC.addressProof1.addressProof",
                    "KYC.addressProof1.addressProofImageId",
                    // "KYC.addressProof1.addressProofReverseImageId",
                    "KYC.addressProof1.addressProofNo",
                    "KYC.addressProof1.addressProofNo1",
                    "KYC.addressProof1.addressProofNo2",
                    // "KYC.addressProof1.addressProofIssueDate",
                    "KYC.addressProof1.addressProofValidUptoDate",
                    "KYC.AdditionalKYC",
                    "KYC.AdditionalKYC.additionalKYCs",
                    "KYC.AdditionalKYC.kyc1ProofNumber",
                    "KYC.AdditionalKYC.kyc1ProofNumber1",
                    "KYC.AdditionalKYC.kyc1ProofNumber2",
                    "KYC.AdditionalKYC.kyc1ProofNumber3",
                    "KYC.AdditionalKYC.kyc1ProofType",
                    "KYC.AdditionalKYC.kyc1ImagePath",
                    // "AdditionalKYC.additionalKYCs.kyc1IssueDate",
                    "KYC.AdditionalKYC.kyc1ValidUptoDate",
                    "personalInformation",
                    "personalInformation.customerBranchId",
                    "personalInformation.centerId",
                    "personalInformation.centerId1",
                    "personalInformation.centerId2",
                    "personalInformation.title",
                    "personalInformation.firstName",
                    // "personalInformation.enrolledAs",
                    "personalInformation.gender",
                    "personalInformation.dateOfBirth",
                    "personalInformation.age",
                    "personalInformation.language",
                    "personalInformation.fatherFirstName",
                    "personalInformation.motherName",
                    "personalInformation.maritalStatus",
                    "personalInformation.spouseFirstName",
                    "personalInformation.spouseDateOfBirth",
                    "personalInformation.weddingAnniversery",
                    "ContactInformation",
                    "ContactInformation.contracInfo",
                    "ContactInformation.contracInfo.mobilePhone",
                    "ContactInformation.contracInfo.landLineNo",
                    "ContactInformation.contracInfo.whatsAppMobileNoOption",
                    "ContactInformation.contracInfo.whatsAppMobileNo",
                    "ContactInformation.contracInfo.email",
                    "ContactInformation.residentAddress",
                    "ContactInformation.residentAddress.careOf",
                    "ContactInformation.residentAddress.doorNo",
                    "ContactInformation.residentAddress.street",
                    "ContactInformation.residentAddress.postOffice",
                    "ContactInformation.residentAddress.landmark",
                    "ContactInformation.residentAddress.pincode",
                    "ContactInformation.residentAddress.locality",
                    "ContactInformation.residentAddress.villageName",
                    "ContactInformation.residentAddress.district",
                    "ContactInformation.residentAddress.state",
                    "ContactInformation.residentAddress.mailSameAsResidence",
                    "ContactInformation.permanentResidentAddress",
                    "ContactInformation.permanentResidentAddress.mailingDoorNo",
                    "ContactInformation.permanentResidentAddress.mailingStreet",
                    "ContactInformation.permanentResidentAddress.mailingPostoffice",
                    "ContactInformation.permanentResidentAddress.mailingPincode",
                    "ContactInformation.permanentResidentAddress.mailingLocality",
                    "ContactInformation.permanentResidentAddress.mailingDistrict",
                    "ContactInformation.permanentResidentAddress.mailingState",
                    "householdeDetails",
                    "householdeDetails.relationShip",
                    "householdeDetails.educationStatus",
                    "householdLiablities",
                    "householdLiablities.liabilities",
                    "householdLiablities.liabilities.loanSource",
                    "householdLiablities.liabilities.loanAmountInPaisa",
                    "householdLiablities.liabilities.installmentAmountInPaisa",
                    "householdLiablities.liabilities.outstandingAmountInPaisa",
                    "householdLiablities.liabilities.startDate",
                    "householdLiablities.liabilities.maturityDate",
                    "householdLiablities.liabilities.noOfInstalmentPaid",
                    "householdLiablities.liabilities.frequencyOfInstallment",
                    "householdLiablities.liabilities.liabilityLoanPurpose",
                    "householdLiablities.liabilities.interestOnly",
                    "householdLiablities.liabilities.interestRate",
                    "householdVerification",
                    "householdVerification.householdDetails",
                    "householdVerification.householdDetails.ownership",
                    "householdVerification.householdDetails.udf29",
                    // "ContactInformation.CustomerResidentialAddress",
                    // "ContactInformation.CustomerResidentialAddress.doorNo",
                    // "ContactInformation.CustomerResidentialAddress.street",
                    // "ContactInformation.CustomerResidentialAddress.locality",
                    // "ContactInformation.CustomerResidentialAddress.villageName",
                    // "ContactInformation.CustomerResidentialAddress.postOffice",
                    // "ContactInformation.CustomerResidentialAddress.district",
                    // "ContactInformation.CustomerResidentialAddress.pincode",
                    // "ContactInformation.CustomerResidentialAddress.state",
                    // "ContactInformation.CustomerResidentialAddress.stdCode",
                    // "ContactInformation.CustomerResidentialAddress.landLineNo",
                    // "ContactInformation.CustomerResidentialAddress.mobilePhone",
                    // "ContactInformation.CustomerResidentialAddress.mailSameAsResidence",
                    // "ContactInformation.CustomerPermanentAddress",
                    // "ContactInformation.CustomerPermanentAddress.mailingDoorNo",
                    // "ContactInformation.CustomerPermanentAddress.mailingStreet",
                    // "ContactInformation.CustomerPermanentAddress.mailingLocality",
                    // "ContactInformation.CustomerPermanentAddress.mailingPostoffice",
                    // "ContactInformation.CustomerPermanentAddress.mailingDistrict",
                    // "ContactInformation.CustomerPermanentAddress.mailingPincode",
                    // "ContactInformation.CustomerPermanentAddress.mailingState",
                    // "familyDetails",
                    // "familyDetails.familyMembers",
                    // "familyDetails.familyMembers.customerId",
                    // "familyDetails.familyMembers.familyMemberFirstName",
                    // "familyDetails.familyMembers.relationShip",
                    // "familyDetails.familyMembers.gender",
                    // "familyDetails.familyMembers.age",
                    // "familyDetails.familyMembers.dateOfBirth",
                    // "familyDetails.familyMembers.educationStatus",
                    // "familyDetails.familyMembers.maritalStatus",
                    // "familyDetails.familyMembers.mobilePhone",
                    // "familyDetails.familyMembers.healthStatus",
                    // "familyDetails.familyMembers.incomes",
                    // "familyDetails.familyMembers.incomes.incomeSource",
                    // "familyDetails.familyMembers.incomes.incomeEarned",
                    // "familyDetails.familyMembers.incomes.frequency",
                    // "familyDetails.familyMembers.incomes.monthsPerYear",
                    // "familyDetails.additionalDetails",
                    // "familyDetails.additionalDetails.medicalCondition",
                    // "familyDetails.additionalDetails.privateHospitalTreatment",
                    // "familyDetails.additionalDetails.householdFinanceRelatedDecision",
                    // "HouseVerification",
                    // "HouseVerification.HouseDetails",
                    // "HouseVerification.HouseDetails.HouseOwnership",
                    // "HouseVerification.HouseDetails.landLordName",//drinkingwater
                    // "HouseVerification.HouseDetails.HouseVerification",//waterfilter
                    // //"HouseVerification.HouseDetails.Toilet",//is toilet available
                    // "HouseVerification.HouseDetails.durationOfStay",//toilet facility
                    // "HouseVerification.HouseDetails.buildType",
                    // "HouseVerification.latitude",
                    // "Liabilities1",
                    // "Liabilities1.liabilities",
                    // "Liabilities1.liabilities.loanType",
                    // "Liabilities1.liabilities.loanSource",
                    // "Liabilities1.liabilities.instituteName",
                    // "Liabilities1.liabilities.loanAmountInPaisa",
                    // "Liabilities1.liabilities.installmentAmountInPaisa",
                    // "Liabilities1.liabilities.startDate",
                    // "Liabilities1.liabilities.maturityDate",
                    // "Liabilities1.liabilities.frequencyOfInstallment",
                    // "Liabilities1.liabilities.liabilityLoanPurpose",
                    // "assets",
                    // "assets.physicalAssets",
                    // "assets.physicalAssets.assetType",
                    // "assets.physicalAssets.ownedAssetDetails",
                    // "assets.physicalAssets.numberOfOwnedAsset",
                    // "assets.physicalAssets.ownedAssetValue",
                    // "assets.financialAssets",
                    // "assets.financialAssets.instrumentType",
                    // "assets.financialAssets.nameOfInstitution",
                    // "assets.financialAssets.ownedBy",
                    // "assets.financialAssets.insuranceType",
                    // "assets.financialAssets.instituteType",
                    // "assets.financialAssets.amountInPaisa",
                    // "assets.financialAssets.frequencyOfDeposite",
                    // "assets.financialAssets.startDate",
                    // "assets.financialAssets.maturityDate",
                    // "Expenditures1",
                    // "Expenditures1.expenditures",
                    // "Expenditures1.expenditures.expendituresSection",
                    // "Expenditures1.expenditures.expendituresSection.expenditureSource",
                    // "Expenditures1.expenditures.expendituresSection.customExpenditureSource",
                    // "Expenditures1.expenditures.expendituresSection.frequencySection",
                    // "Expenditures1.expenditures.expendituresSection.frequencySection.frequency",
                    // "Expenditures1.expenditures.expendituresSection.annualExpensesSection",
                    // "Expenditures1.expenditures.expendituresSection.annualExpensesSection.annualExpenses",
                    // "BusinessOccupationDetails",
                    // "BusinessOccupationDetails.customerOccupationType",
                    // "BusinessOccupationDetails.businessDetails",
                    // "BusinessOccupationDetails.businessDetails.relationshipWithBusinessOwner",
                    // "BusinessOccupationDetails.businessDetails.business/employerName",
                    // //"BusinessOccupationDetails.businessDetails.businessRegNo",
                    // "BusinessOccupationDetails.businessDetails.businessVillage",
                    // "BusinessOccupationDetails.businessDetails.businessLandmark",
                    // "BusinessOccupationDetails.businessDetails.businessPincode",
                    // "BusinessOccupationDetails.businessDetails.businessPhone",
                    // "BusinessOccupationDetails.businessDetails.ageOfEnterprise",
                    // // "BusinessOccupationDetails.businessDetails.workPeriod",
                    // "BusinessOccupationDetails.businessDetails.workPlaceType",
                    // // "BusinessOccupationDetails.businessDetails.WorkPlace",
                    // // "BusinessOccupationDetails.businessDetails.WorkPlaceOthers",
                    // "BusinessOccupationDetails.agricultureDetails",
                    // "BusinessOccupationDetails.agricultureDetails.relationwithFarmer",
                    // "BusinessOccupationDetails.agricultureDetails.landOwnership",
                    // "BusinessOccupationDetails.agricultureDetails.cropName",
                    // "BusinessOccupationDetails.agricultureDetails.irrigated",
                    // "BusinessOccupationDetails.agricultureDetails.harvestMonth",
                    // //"BusinessOccupationDetails.agricultureDetails.landArea",
                    // "loanInformation",
                    // "loanInformation.requestedLoanAmount",
                    // "loanInformation.requestedLoanPurpose",
                    // "actionbox",
                    // "actionbox.submit",
                    // "actionbox.save",
            ];
             
        }

        return {
            "type": "schema-form",
            "title": "INDIVIDUAL_ENROLLMENT_2",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.customer = model.customer || {};
                model.siteCode = SessionStore.getGlobalSetting('siteCode');
                model.customer.customerBranchId = model.customer.customerBranchId || SessionStore.getCurrentBranch().branchId;
                model.customer.date = model.customer.date || Utils.getCurrentDate();
                model.customer.nameOfRo = model.customer.nameOfRo || SessionStore.getLoginname();
                model = Utils.removeNulls(model, true);
                model.customer.kgfsName = model.customer.kgfsName || SessionStore.getCurrentBranch().branchName;
                model.customer.customerType = model.customer.customerType || 'Individual';
                var centres = SessionStore.getCentres();
                if(centres && centres.length > 0){
                    model.customer.centreId = model.customer.centreId || centres[0].id;
                }
                var self = this;
                var formRequest = {
                    "overrides": "",
                    "includes": getIncludes (model),
                    "excludes": [
                        "KYC.addressProofSameAsIdProof",
                    ]
                };

                if (_.hasIn($stateParams.pageData, 'lead_id') &&  _.isNumber($stateParams.pageData['lead_id'])){
                    PageHelper.showLoader();
                    PageHelper.showProgress("Enrollment-input", 'Loading lead details');
                    var _leadId = $stateParams.pageData['lead_id'];
                    Lead.get({id: _leadId})
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress('Enrollment-input', 'Done.', 5000);
                            model.customer.mobilePhone = res.mobileNo;
                            model.customer.gender = res.gender;
                            model.customer.firstName = res.leadName;
                            model.customer.maritalStatus=res.maritalStatus;
                            model.customer.customerBranchId=res.branchId;
                            model.customer.centreId=res.centreId;
                            model.customer.centreName=res.centreName;
                            model.customer.street=res.addressLine2;
                            model.customer.doorNo=res.addressLine1;
                            model.customer.pincode=res.pincode;
                            model.customer.district=res.district;
                            model.customer.state=res.state;
                            model.customer.locality=res.area;
                            model.customer.villageName=res.cityTownVillage;
                            model.customer.landLineNo=res.alternateMobileNo;
                            model.customer.dateOfBirth=res.dob;
                            model.customer.age=res.age;
                            model.customer.gender=res.gender;
                            model.customer.landLineNo = res.alternateMobileNo;


                            for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                $log.info(model.customer.familyMembers[i].relationShip);
                                model.customer.familyMembers[i].educationStatus=obj.educationStatus;
                            } 
                        }, function(httpRes){
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                }

                this.form = IrfFormRequestProcessor.getFormDefinition('IndividualEnrollment2', formRequest);
                //this.form.push(actionbox);
                console.log(this.form);
            },
            modelPromise: function(pageId, _model) {
                var deferred = $q.defer();
                PageHelper.showLoader();
                irfProgressMessage.pop("enrollment","Loading Customer Data...");
                Enrollment.getCustomerById({id:pageId},function(resp,header){
                    var model = {$$OFFLINE_FILES$$:_model.$$OFFLINE_FILES$$};
                    model.customer = resp;
                    if (model.customer.dateOfBirth) {
                        model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                    }

                    for (var idx = 0; idx < model.customer.familyMembers.length; idx++) {
                        if (model.customer.familyMembers[idx].dateOfBirth) {
                            model.customer.familyMembers[idx].age = moment().diff(moment(model.customer.familyMembers[idx].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                        }
                    }
                    if (model.customer.udf && model.customer.udf.userDefinedFieldValues
                        && model.customer.udf.userDefinedFieldValues.udf1) {
                        model.customer.udf.userDefinedFieldValues.udf1 =
                            model.customer.udf.userDefinedFieldValues.udf1 === true
                            || model.customer.udf.userDefinedFieldValues.udf1 === 'true';
                    }
                    deferred.resolve(model);
                    PageHelper.hideLoader();
                },function(resp){
                    PageHelper.hideLoader();
                    irfProgressMessage.pop("enrollment","An Error Occurred. Failed to fetch Data",5000);
                    $stateParams.confirmExit = false;
                    $state.go("Page.Engine",{
                        pageName:"CustomerSearch",
                        pageId:null
                    });
                    deferred.reject();
                });
                return deferred.promise;
            },
            offline: true,
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
                        pageName: 'customer.IndividualEnrollment3',
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
                    model.siteCode = SessionStore.getGlobalSetting('siteCode');
                    var reqData = _.cloneDeep(model);
                    EnrollmentHelper.fixData(reqData);

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
                            PageHelper.showProgress('enrolment', 'Done.', 5000);
                            $state.go('Page.Landing', null);
                        });
                    } else {
                        EnrollmentHelper.saveData(reqData).then(function(res) {
                            EnrollmentHelper.proceedData(res).then(function(resp) {
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                $state.go('Page.Landing', null);
                            }, function(err) {
                                Utils.removeNulls(res.customer, true);
                                model.customer = res.customer;
                            });
                        });
                    }
                }
            }
        };
    }
});