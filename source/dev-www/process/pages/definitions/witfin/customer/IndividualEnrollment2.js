define([], function() {
    return {
        pageUID: "witfin.customer.IndividualEnrollment2",
        pageType: "Engine",
        dependencies: ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
            "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor", "$injector"],
        
         $pageFn: function($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
                     PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor, $injector) {
                
            var self;
            var branch = SessionStore.getBranch();
            var pageParams = {
                readonly: true
            }

            var preSaveOrProceed = function(reqData){
                if (_.hasIn(reqData, 'customer.familyMembers') && _.isArray(reqData.customer.familyMembers)){
                    var selfExist = false
                    for (var i=0;i<reqData.customer.familyMembers.length; i++){
                        var f = reqData.customer.familyMembers[i];
                        if (_.isString(f.relationShip) && f.relationShip.toUpperCase() == 'SELF'){
                            selfExist = true;
                            break;
                        }
                    }
                    if (selfExist == false){
                        PageHelper.showProgress("pre-save-validation", "Self Relationship is Mandatory",5000);
                        return false;
                    }
                } else {
                    PageHelper.showProgress("pre-save-validation", "Family Members section is missing. Self Relationship is Mandatory",5000);
                    return false;
                }
                return true;
            }

            var configFile = function() {
                return {
                    "currentStage": {
                        "Screening": {
                            "excludes": [
                                "householdeDetails.familyMembers.relationShip",
                                "householdeDetails.familyMembers.familyMemberFirstName",
                                "householdeDetails.familyMembers.anualEducationFee",
                                "householdeDetails.familyMembers.salary",
                                "householdeDetails.familyMembers.incomes",
                                "householdeDetails.expenditures",
                                "reference"
                            ]
                        },
                        "ScreeningReview": {
                            "overrides": {
                                "KYC": {
                                    "readonly": true
                                },
                                "personalInformation": {
                                    "readonly": true
                                },
                                "ContactInformation": {
                                    "readonly": true
                                },
                                "householdeDetails": {
                                    "readonly": true
                                },
                                 "householdLiablities": {
                                    "readonly": true
                                },
                                "householdVerification": {
                                    "readonly": true
                                },
                                "trackDetails": {
                                    "readonly": true
                                }
                            },
                            "excludes": [
                                "householdeDetails.familyMembers.relationShip",
                                "householdeDetails.familyMembers.familyMemberFirstName",
                                "householdeDetails.familyMembers.anualEducationFee",
                                "householdeDetails.familyMembers.salary",
                                "householdeDetails.familyMembers.incomes",
                                "householdeDetails.expenditures",
                                "reference"
                            ]
                        }
                    }
                    
                    
                }
            }
            var getIncludes = function (model) {
                
                return [                       
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
                        "personalInformation.photoImageId",
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
                        "personalInformation.weddingDate",
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
                        "householdeDetails.familyMembers",
                        "householdeDetails.familyMembers.relationShipself",
                        "householdeDetails.familyMembers.relationShip",
                        "householdeDetails.familyMembers.familyMemberFirstName",
                        "householdeDetails.familyMembers.primaryOccupation",
                        "householdeDetails.familyMembers.educationStatus",
                        "householdeDetails.familyMembers.anualEducationFee",
                        "householdeDetails.familyMembers.salary",
                        "householdeDetails.familyMembers.incomes",
                        "householdeDetails.familyMembers.incomes.incomeSource",
                        "householdeDetails.familyMembers.incomes.incomeEarned",
                        "householdeDetails.familyMembers.incomes.frequency",
                        "householdeDetails.expenditures",
                        "householdeDetails.expenditures.expenditureSource",
                        "householdeDetails.expenditures.frequency",
                        "householdLiablities",
                        "householdLiablities.liabilities",
                        "householdLiablities.liabilities.loanSourceCategory",
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
                        "householdLiablities.liabilities.proofDocuments",
                        "householdVerification",
                        "householdVerification.householdDetails",
                        "householdVerification.householdDetails.ownership",
                        "householdVerification.householdDetails.udf29",
                        "householdVerification.householdDetails.distanceFromBranch",
                        "householdVerification.householdDetails.monthlyRent",
                        "householdVerification.householdDetails.previousRentDetails",
                        "trackDetails",
                        "trackDetails.vehiclesOwned",
                        "trackDetails.vehiclesFinanced",
                        "trackDetails.vehiclesFree",
                        "reference",
                        "reference.verifications",
                        "reference.verifications.referenceFirstName",
                        "reference.verifications.mobileNo",
                        "reference.verifications.occupation",
                        "reference.verifications.address",
                        "reference.verifications.referenceCheck",
                        "reference.verifications.referenceCheck.knownSince",
                        "reference.verifications.referenceCheck.relationship",
                        "reference.verifications.referenceCheck.opinion",
                        "reference.verifications.referenceCheck.financialStatus",
                        "reference.verifications.referenceCheck.customerResponse",
                        "actionbox",
                        "actionbox.submit",
                        "actionbox.save",
                ];
                 
            }

            return {
                "type": "schema-form",
                "title": "INDIVIDUAL_ENROLLMENT_2",
                "subTitle": "",
                 initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // $log.info("Inside initialize of IndividualEnrolment2 -SPK " + formCtrl.$name);
                    if (bundlePageObj){
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }

                    var branch1 = formHelper.enum('branch_id').data;
                    var allowedBranch = [];
                    for (var i = 0; i < branch1.length; i++) {
                        if ((branch1[i].name) == SessionStore.getBranch()) {
                            allowedBranch.push(branch1[i]);
                            break;
                        }
                    }
                    var allowedCentres = [];
                    var centres = SessionStore.getCentres();
                    var centreName = [];

                    if(centres && centres.length)
                    {
                        for (var i = 0; i < centres.length; i++) {
                         centreName.push(centres[i].id);
                         allowedCentres.push(centres[i]);
                        }
                    }

                    model.currentStage = bundleModel.currentStage;
                     self = this;
                    var formRequest = {
                        "overrides": "",
                        "includes": getIncludes (model),
                        "excludes": [
                            "KYC.addressProofSameAsIdProof",
                        ]
                    };
                    if (_.hasIn(model, 'loanRelation')){
                        console.log(model.loanRelation);
                        if(model.loanRelation){
                        var custId = model.loanRelation.customerId;
                            Enrollment.getCustomerById({id:custId})
                                    .$promise
                                    .then(function(res){
                                        model.customer = res;
                                        var actualCentre = $filter('filter')(allowedCentres, {id: model.customer.centreId}, true);
                                        model.customer.centreName = actualCentre && actualCentre.length > 0 ? actualCentre[0].centreName : model.customer.centreName;
                                        BundleManager.pushEvent('customer-loaded', model._bundlePageObj, {customer: res})
                                        if (model.customer.stockMaterialManagement) {
                                            model.proxyIndicatorsHasValue = true;
                                            $log.debug('PROXY_INDICATORS already has value');
                                        }
                                        
                                        self.form = IrfFormRequestProcessor.getFormDefinition('IndividualEnrollment2', formRequest, configFile(), model);
                                    }, function(httpRes){
                                        PageHelper.showErrors(httpRes);
                                    })
                                    .finally(function(){
                                        PageHelper.hideLoader();
                                    })
                        }
                    }
                    else {
                        self.form = IrfFormRequestProcessor.getFormDefinition('IndividualEnrollment2', formRequest);
                    }
                    // else {

                        model.customer = model.customer || {};
                        if (!_.hasIn(model.customer, 'enterprise') || model.customer.enterprise==null){
                            model.customer.enterprise = {};
                        }

                        model.customer.customerBranchId = model.customer.customerBranchId || allowedBranch[0].value;

                        model.customer.centreId = centreName[0];
                        model.customer.centreName = (allowedCentres && allowedCentres.length > 0) ? allowedCentres[0].centreName : "";

                        //model.branchId = SessionStore.getBranchId() + '';
                        model.customer.date = model.customer.date || Utils.getCurrentDate();
                        model.customer.nameOfRo = model.customer.nameOfRo || SessionStore.getLoginname();
                        model = Utils.removeNulls(model,true);
                        //model.customer.kgfsName = SessionStore.getBranch();
                        model.customer.identityProof = model.customer.identityProof || "Pan Card";
                        model.customer.addressProof= model.customer.addressProof || "Aadhar Card";
                        model.customer.customerType = 'Individual';
                        BundleManager.pushEvent("on-customer-load", {name: "11"})

                        if(!model.customer.expenditures){
                            model.customer.expenditures = [];
                            model.customer.expenditures.push({
                                "expenditureSource": "Monthly Declared Household expenses",
                                "frequency": "Monthly"
                            });
                        }


                        if(!model.customer.familyMembers){
                            model.customer.familyMembers = [
                                {
                                    'relationShip': 'self'
                                }
                            ]
                        }
                    // }


                    if (!_.hasIn(model.customer, 'enterprise') || model.customer.enterprise==null){
                            model.customer.enterprise = {};
                        }

                    if (_.hasIn(model, 'loanRelation')){
                        console.log(model.loanRelation);
                        if(model.loanRelation){
                            if(model.loanRelation.enterpriseId)
                            {
                                var busId = model.loanRelation.enterpriseId;
                                Enrollment.getCustomerById({id:busId})
                                    .$promise
                                    .then(function(res){
                                        model.customer.enterprise = res.enterprise;
                                    }, function(httpRes){
                                        PageHelper.showErrors(httpRes);
                                    })
                                    .finally(function(){
                                        PageHelper.hideLoader();
                                    })
                            }
                        }
                    }

                    

                },
               
                preDestroy: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                            // console.log("Inside preDestroy");
                            // console.log(arguments);
                            if (bundlePageObj){
                                var enrolmentDetails = {
                                    'customerId': model.customer.id,
                                    'customerClass': bundlePageObj.pageClass,
                                    'firstName': model.customer.firstName
                                }
                                // BundleManager.pushEvent('new-enrolment',  {customer: model.customer})
                                BundleManager.pushEvent("enrolment-removed", model._bundlePageObj, enrolmentDetails)
                            }
                            return $q.resolve();
                        },
                        eventListeners: {
                            "test-listener": function(bundleModel, model, obj){

                            },
                            "lead-loaded": function(bundleModel, model, obj){
                                model.customer.mobilePhone = obj.mobileNo;
                                model.customer.gender = obj.gender;
                                model.customer.firstName = obj.leadName;
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
                                model.customer.gender=obj.gender;
                                model.customer.landLineNo = obj.alternateMobileNo;


                                for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                    $log.info(model.customer.familyMembers[i].relationShip);
                                    model.customer.familyMembers[i].educationStatus=obj.educationStatus;
                                    /*if (model.customer.familyMembers[i].relationShip == "self") {
                                        model.customer.familyMembers[i].educationStatus=obj.educationStatus;
                                        break;
                                    }*/
                                }
                            },
                            "origination-stage": function(bundleModel, model, obj){
                                model.currentStage = obj
                            }
                        },
                        offline: false,
                        getOfflineDisplayItem: function(item, index){
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
                    setProofs:function(model){
                        model.customer.addressProofNo=model.customer.aadhaarNo;
                        model.customer.identityProofNo=model.customer.aadhaarNo;
                        model.customer.identityProof='Aadhar card';
                        model.customer.addressProof='Aadhar card';
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
                            PageHelper.showProgress('enrollment', 'Customer Name is required', 3000);
                            deferred.reject();
                        }
                        return deferred.promise;
                    },
                    reload: function(model, formCtrl, form, $event) {
                        $state.go("Page.Engine", {
                            pageName: 'customer.IndividualEnrollment',
                            pageId: model.customer.id
                        },{
                            reload: true,
                            inherit: false,
                            notify: true
                        });
                    },
                    save: function(model, formCtrl, form, $event){

                        formCtrl.scope.$broadcast('schemaFormValidate');

                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
                            return false;
                        }

                        if (!EnrollmentHelper.validateData(model)) {
                            $log.warn("Invalid Data, returning false");
                            return false;
                        }
                        var reqData = _.cloneDeep(model);
                        EnrollmentHelper.fixData(reqData);
                        var out = reqData.customer.$fingerprint;
                        var fpPromisesArr = [];
                        for (var key in out) {
                            if (out.hasOwnProperty(key) && out[key].data!=null) {
                                (function(obj){
                                    var promise = Files.uploadBase64({file: obj.data, type: 'CustomerEnrollment', subType: 'FINGERPRINT', extn:'iso'}, {}).$promise;
                                    promise.then(function(data){
                                        reqData.customer[obj.table_field] = data.fileId;
                                        delete reqData.customer.$fingerprint[obj.fingerId];
                                    });
                                    fpPromisesArr.push(promise);
                                })(out[key]);
                            } else {
                                if (out[key].data == null){
                                    delete out[key];
                                }
                            }
                        }

                        // $q.all start
                        $q.all(fpPromisesArr).then(function(){
                            try{
                                // var liabilities = reqData['customer']['liabilities'];
                                // if (liabilities && liabilities!=null && typeof liabilities.length == "number" && liabilities.length >0 ){
                                //     for (var i=0; i<liabilities.length;i++){
                                //         var l = liabilities[i];
                                //         l.loanAmountInPaisa = l.loanAmountInPaisa * 100;
                                //         l.installmentAmountInPaisa = l.installmentAmountInPaisa * 100;
                                //     }
                                // }

                                // var financialAssets = reqData['customer']['financialAssets'];
                                // if (financialAssets && financialAssets!=null && typeof financialAssets.length == "number" && financialAssets.length >0 ){
                                //     for (var i=0; i<financialAssets.length;i++){
                                //         var f = financialAssets[i];
                                //         f.amountInPaisa = f.amountInPaisa * 100;
                                //     }
                                // }
                            } catch(e){
                                $log.info("Error trying to change amount info.");
                            }

                            reqData.customer.verified = true;
                            if (reqData.customer.hasOwnProperty('verifications')){
                                var verifications = reqData.customer['verifications'];
                                for (var i=0; i<verifications.length; i++){
                                    if (verifications[i].houseNoIsVerified){
                                        verifications[i].houseNoIsVerified=1;
                                    }
                                    else{
                                        verifications[i].houseNoIsVerified=0;
                                    }
                                }
                            }
                            try{
                                for(var i=0;i<reqData.customer.familyMembers.length;i++){
                                    var incomes = reqData.customer.familyMembers[i].incomes;
                                    if (incomes){
                                        for(var j=0;j<incomes.length;j++){
                                            switch(incomes[i].frequency){
                                                case 'M': incomes[i].monthsPerYear=12; break;
                                                case 'Monthly': incomes[i].monthsPerYear=12; break;
                                                case 'D': incomes[i].monthsPerYear=365; break;
                                                case 'Daily': incomes[i].monthsPerYear=365; break;
                                                case 'W': incomes[i].monthsPerYear=52; break;
                                                case 'Weekly': incomes[i].monthsPerYear=52; break;
                                                case 'F': incomes[i].monthsPerYear=26; break;
                                                case 'Fornightly': incomes[i].monthsPerYear=26; break;
                                                case 'Fortnightly': incomes[i].monthsPerYear=26; break;
                                            }
                                        }
                                    }

                                }
                            }catch(err){
                                console.error(err);
                            }

                            EnrollmentHelper.fixData(reqData);
                            if (reqData.customer.addressProof == 'Aadhar Card' &&
                                !_.isNull(reqData.customer.addressProofNo)){
                                reqData.customer.aadhaarNo = reqData.customer.addressProofNo;
                            }

                            if (preSaveOrProceed(reqData) == false){
                                return;
                            }
                            EnrollmentHelper.saveData(reqData)
                                    .then(
                                            function(res){
                                                formHelper.resetFormValidityState(formCtrl);
                                                PageHelper.showProgress('enrolment', 'Customer Saved.', 5000);
                                                Utils.removeNulls(res.customer, true);
                                                model.customer = res.customer;
                                                if (model._bundlePageObj){
                                                    BundleManager.pushEvent('new-enrolment', model._bundlePageObj, {customer: model.customer})
                                                }
                                            },
                                            function(httpRes){
                                                PageHelper.showProgress('enrolment', 'Oops. Some error', 5000);
                                                PageHelper.showErrors(httpRes);
                                            }
                                    );
                        });
                    },
                    submit: function(model, form, formName){
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
                            if (out.hasOwnProperty(key) && out[key].data!=null) {
                                (function(obj){
                                    var promise = Files.uploadBase64({file: obj.data, type: 'CustomerEnrollment', subType: 'FINGERPRINT', extn:'iso'}, {}).$promise;
                                    promise.then(function(data){
                                        reqData.customer[obj.table_field] = data.fileId;
                                        delete reqData.customer.$fingerprint[obj.fingerId];
                                    });
                                    fpPromisesArr.push(promise);
                                })(out[key]);
                            } else {
                                if (out[key].data == null){
                                    delete out[key];
                                }
                            }
                        }

                        // $q.all start
                        $q.all(fpPromisesArr).then(function(){
                            try{
                                // var liabilities = reqData['customer']['liabilities'];
                                // if (liabilities && liabilities!=null && typeof liabilities.length == "number" && liabilities.length >0 ){
                                //     for (var i=0; i<liabilities.length;i++){
                                //         var l = liabilities[i];
                                //         l.loanAmountInPaisa = l.loanAmountInPaisa * 100;
                                //         l.installmentAmountInPaisa = l.installmentAmountInPaisa * 100;
                                //     }
                                // }

                                // var financialAssets = reqData['customer']['financialAssets'];
                                // if (financialAssets && financialAssets!=null && typeof financialAssets.length == "number" && financialAssets.length >0 ){
                                //     for (var i=0; i<financialAssets.length;i++){
                                //         var f = financialAssets[i];
                                //         f.amountInPaisa = f.amountInPaisa * 100;
                                //     }
                                // }
                            } catch(e){
                                $log.info("Error trying to change amount info.");
                            }

                            reqData['enrollmentAction'] = 'PROCEED';

                            reqData.customer.verified = true;
                            if (reqData.customer.hasOwnProperty('verifications')){
                                var verifications = reqData.customer['verifications'];
                                for (var i=0; i<verifications.length; i++){
                                    if (verifications[i].houseNoIsVerified){
                                        verifications[i].houseNoIsVerified=1;
                                    }
                                    else{
                                        verifications[i].houseNoIsVerified=0;
                                    }
                                }
                            }
                            try{
                                for(var i=0;i<reqData.customer.familyMembers.length;i++){
                                    var incomes = reqData.customer.familyMembers[i].incomes;
                                    if (incomes){
                                        for(var j=0;j<incomes.length;j++){
                                            switch(incomes[i].frequency){
                                                case 'M': incomes[i].monthsPerYear=12; break;
                                                case 'Monthly': incomes[i].monthsPerYear=12; break;
                                                case 'D': incomes[i].monthsPerYear=365; break;
                                                case 'Daily': incomes[i].monthsPerYear=365; break;
                                                case 'W': incomes[i].monthsPerYear=52; break;
                                                case 'Weekly': incomes[i].monthsPerYear=52; break;
                                                case 'F': incomes[i].monthsPerYear=26; break;
                                                case 'Fornightly': incomes[i].monthsPerYear=26; break;
                                                case 'Fortnightly': incomes[i].monthsPerYear=26; break;
                                            }
                                        }
                                    }

                                }
                            }catch(err){
                                console.error(err);
                            }
                            if (preSaveOrProceed(reqData) == false){
                                return;
                            }
                            EnrollmentHelper.fixData(reqData);
                            PageHelper.showProgress('enrolment', 'Updating Customer');
                            EnrollmentHelper.proceedData(reqData).then(function(resp){
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                Utils.removeNulls(resp.customer,true);
                                model.customer = resp.customer;
                            }, function(err) {
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                            });
                        });
                        // $q.all end
                    }
                }
            };
         }
    }
})
// irf.pageCollection.factory(irf.page("witfin.customer.IndividualEnrollment2"),
// ["$log", "$state", "$stateParams", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q",
//             "PageHelper", "Utils", "BiometricService", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "IrfFormRequestProcessor",
//       function($log, $state, $stateParams, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,
//                      PageHelper, Utils, BiometricService, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, IrfFormRequestProcessor) 
//       {
        
//     }
// ]);