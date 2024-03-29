irf.models.factory('Enrollment',function($resource,$q,Upload,$httpParamSerializer,BASE_URL, searchResource){
    var endpoint = BASE_URL + '/api/enrollments';
    var snapshotFrom = '/snapshotDiff?snapshotIdFrom=';
    var snapshotTo  = 'snapshotIdTo=';
    var managementEndPoint= irf.MANAGEMENT_BASE_URL;
    var endpoint1 = BASE_URL +'/api/creditbureau/verification'; 
    var telecallingdetails = BASE_URL + '/api/telecallingdetails';
    var transformResponse = function(customer){
        if (_.hasIn(customer, "customerBankAccounts") && _.isArray(customer.customerBankAccounts)){
            _.forEach(customer.customerBankAccounts, function(bankAccount){
                if (_.hasIn(bankAccount, 'netBankingAvailable') && !_.isNull(bankAccount.netBankingAvailable) && _.isString(bankAccount.netBankingAvailable)){
                    bankAccount.netBankingAvailable = bankAccount.netBankingAvailable.toUpperCase();
                }
            })
        }

        if (_.hasIn(customer, 'buyerDetails') && _.isArray(customer.buyerDetails)){
            _.forEach(customer.buyerDetails, function(buyer){
                if (_.hasIn(buyer, 'customerSince') && !_.isNull(buyer.customerSince) && _.isString(buyer.customerSince)){
                    buyer.customerSince = parseFloat(buyer.customerSince);
                }
            })
        }
    }

    /*
     * $get : /api/enrollments/{blank/withhistory/...}/{id}
     *  eg: /enrollments/definitions -> $get({service:'definition'})
     *      /enrollments/1           -> $get({id:1})
     * $post will send data as form data, save will send it as request payload
     */
    var resource = $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint+'/:service/:id'
        },
        idenCheckVerification :{
            method:'POST',
            url : endpoint1
        },
        query:{
            method:'GET',
            url:endpoint+'/:service/:id',
            isArray:true
        },

        getCustomerSummary:{
            method:'GET',
            url: managementEndPoint + '/server-ext/wm_summary.php'
        },

        getSchema:{
            method:'GET',
            url:'process/schemas/profileInformation.json'
        },
        search: searchResource({
            method: 'GET',
            url: endpoint + '/'
        }),
        put:{
            method:'PUT',
            url:endpoint+'/:service',
            transformResponse:function(data, headersGetter, status){
                data = JSON.parse(data);
                if (status == 200){
                    var customer = data.customer;
                    transformResponse(customer);
                }
                return data;
            }
        },
        update:{
            method:'PUT',
            url:endpoint+'/:service'
        },
        houseHoldLink:{
            method:'POST',
            url:endpoint+'/linkhousehold'
        },
        post:{
            method:'POST',
            url:endpoint+'/:service/:format',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            transformResponse:function(data, headersGetter, status){
                data = JSON.parse(data);
                if (status == 200){
                    var customer = data.customer;
                    transformResponse(customer);
                }
                return data;
            },
            transformRequest: function (data) {
                return $httpParamSerializer(data);
            }
        },
        getSanpshotDiff: {
            method: 'GET',
            url: endpoint + snapshotFrom + ':id1' + "&" + snapshotTo + ':id2'
        },
        postWithFile:{
            method:'POST',
            url:endpoint+'/:service/:format',
            headers: {
                'Content-Type': 'undefined'
            },
            transformRequest: function (data) {
                var fd = new FormData();
                angular.forEach(data, function(value, key) {
                    fd.append(key, value);
                });
                return fd;
            }
        },
        save:{
            method:'POST',
            url:endpoint
        },
        updateEnrollment: {
            method: 'PUT',
            url: endpoint,
            transformResponse:function(data, headersGetter, status){
                data = JSON.parse(data);
                if (status == 200){
                    var customer = data.customer;
                    transformResponse(customer);
                }
                return data;
            },
        },
        getCustomerById: {
            method: 'GET',
            url: endpoint+'/:id',
            transformResponse: function(data, headersGetter, status){
                var customer = JSON.parse(data);
                if (status === 200){
                    transformResponse(customer);
                }
                return customer;
            }
        },

        updateCustomer: {
            method: 'PUT',
            url: endpoint,
            transformRequest: function(data) {
                if (_.has(data, 'customer.expenditures') && _.isArray(data.customer.expenditures)) {
                    for (var i = 0; i < data.customer.expenditures.length; i++) {
                        if (data.customer.expenditures[i].expenditureSource == "Others") {
                            var tempExpenditureSource = data.customer.expenditures[i].expenditureSource + ">" + data.customer.expenditures[i].customExpenditureSource;
                            var tempAnnualExpenses = data.customer.expenditures[i].annualExpenses;
                            var tempFrequency = data.customer.expenditures[i].frequency;
                            data.customer.expenditures[i] = {};
                            data.customer.expenditures[i].annualExpenses = tempAnnualExpenses;
                            data.customer.expenditures[i].expenditureSource = tempExpenditureSource;
                            data.customer.expenditures[i].frequency = tempFrequency;
                        }
                    }
                }
                return JSON.stringify(data);
            }
        },
        EnrollmentById: {
            method: 'GET',
            url: endpoint + '/:id',
            transformResponse: function(data, headersGetter, status) {
                var response = JSON.parse(data);
                if (status == 200) {
                    var customer = response;
                    if (_.has(customer, "expenditures") && _.isArray(customer.expenditures)) {
                        for (var i = 0; i < customer.expenditures.length; i++) {
                            if (/Others/.test(customer.expenditures[i].expenditureSource)) {
                                var expendituresSplitArray = customer.expenditures[i].expenditureSource.split('>');
                                if (expendituresSplitArray.length > 1 && expendituresSplitArray[0] == "Others") {
                                    customer.expenditures[i].expenditureSource = expendituresSplitArray[0];
                                    customer.expenditures[i].customExpenditureSource = expendituresSplitArray[1];
                                }
                            }
                        }
                    }
                }
                return response;
            }
        },
        getWithHistory: {
            method: 'GET',
            url: endpoint+'/withhistory/:id'
        },
        lenderSearch: searchResource({
            method: 'GET',
            url: endpoint + '/findInternal/'
        }),
        modifyBlockedStatus: {
            method:'GET',
            url: endpoint + '/modifyBlockedStatus'
        },
        getTelecallingById: {
            method:'GET',
            url: telecallingdetails + '/:id'
        },
        getTelecallingByProcessType: {
            method:'GET',
            url: telecallingdetails + '/CUSTOMER/:id'
        },
        getTelecallingByProcessTypeInsurance: {
            method:'GET',
            url: telecallingdetails + '/INSURANCETLI/:id'
        },
        createTelecalling: {
            method: 'POST',
            url : telecallingdetails
        },
        updateTelecalling: {
            method:'PUT',
            url: telecallingdetails
        }
    });
    resource.insuranceUpload = function(file, progress) {
        var deferred = $q.defer();
        Upload.upload({
            url: BASE_URL + "/api/feed/insuranceupload",

            data: {
                file: file,
                feedCategory: 'PortfolioInsuranceDetails'
            }
        }).then(function(resp) {
            PageHelper.showProgress("page-init", "successfully uploaded.", 2000);
            deferred.resolve(resp);
        }, function(errResp) {
            PageHelper.showErrors(errResp);
            deferred.reject(errResp);
        }, progress);
        return deferred.promise;
    };

    return resource;
});


irf.pageCollection.factory("EnrollmentHelper",
["$log", "$q","Enrollment",'formHelper', 'PageHelper', 'irfProgressMessage', 'Utils', 'SessionStore',
function($log, $q, Enrollment,formHelper, PageHelper, irfProgressMessage, Utils, SessionStore){

    var validatePanCard = function(str, form){
        const panRegex = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/g;
        if (panRegex.test(panRegex)){

        }else {
            console.log(form);
        }
    }

    var checkBiometricQuality= function(model){
        var myObj = model.customer.$fingerprint;
        var BiometricQuality = SessionStore.getGlobalSetting("BiometricQuality");
        var quality= true;
        for (i = 0; i < 10; i++) {
            var obj = myObj[Object.keys(myObj)[i]];
            if (obj.quality < BiometricQuality) {
                PageHelper.showProgress('validate-error', obj.fingerId +" "+ ' quality is less than the required quality' +" "+ BiometricQuality, 5000);
                quality= false;
                break;
            }
        }
        return quality;
    }

    var fixData = function(model){
        /* TODO Validations */

        /* Fix to make additionalKYCs as an array */
        //reqData['customer']['additionalKYCs'] = [reqData['customer']['additionalKYCs']];

        /* Fix to add atleast one fingerprint */
        //model['customer']['leftHandIndexImageId'] = "232";

        if (model.customer.dateOfBirth) {
            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
        }

        if (model['customer']['mailSameAsResidence'] === true){
            model['customer']['mailingDoorNo'] = model['customer']['doorNo'];
            model['customer']['mailingStreet'] = model['customer']['street'];
            model['customer']['mailingLocality'] = model['customer']['locality'];
            model['customer']['mailingPostoffice'] = model['customer']['postOffice'];
            model['customer']['mailingDistrict'] = model['customer']['district'];
            model['customer']['mailingPincode'] = model['customer']['pincode'];
            model['customer']['mailingState'] = model['customer']['state'];
        }

        if(model.customer.addressProofSameAsIdProof){

            model.customer.addressProof=_.clone(model.customer.identityProof);
            model.customer.addressProofImageId=_.clone(model.customer.identityProofImageId);
            model.customer.addressProofNo=_.clone(model.customer.identityProofNo);
            model.customer.addressProofIssueDate=_.clone(model.customer.idProofIssueDate);
            model.customer.addressProofValidUptoDate=_.clone(model.customer.idProofValidUptoDate);
            model.customer.addressProofReverseImageId = _.clone(model.customer.identityProofReverseImageId);
        }

        if (_.has(model.customer, 'udf.userDefinedFieldValues')) {
            var fields = model.customer.udf.userDefinedFieldValues;
            $log.info(fields);
            if(fields['udf17']){
              fields['udf17'] = Number(fields['udf17']);  
            }
            if(fields['udf10']){
               fields['udf10'] = Number(fields['udf10']); 
            }
            if(fields['udf11']){
                fields['udf11'] = Number(fields['udf11']);
            }
            if(fields['udf28']){
               fields['udf28'] = Number(fields['udf28']); 
            }
            if(fields['udf32']){
                fields['udf32'] = Number(fields['udf32']);
            }
            if(fields['udf1']){
                if(typeof(fields['udf1']) === "boolean"){

                }else{
                   fields['udf1'] = (fields['udf1'] == "true") ? true : false; 
                }   
            }
            if(fields['udf6']){
                if(typeof(fields['udf6']) === "boolean"){

                }else{
                   fields['udf6'] = (fields['udf6'] == "true") ? true : false; 
                }    
            }
            if(fields['udf4']){
                fields['udf4'] = Number(fields['udf4']);
            }
            if(fields['udf26']){
                if(typeof(fields['udf26']) === "boolean"){

                }else{
                   fields['udf26'] = (fields['udf26'] == "true") ? true : false; 
                }  
            }
            
            for (var i = 1; i <= 40; i++) {
                if (!_.has(model.customer.udf.userDefinedFieldValues, 'udf' + i)) {
                    model.customer.udf.userDefinedFieldValues['udf' + i] = '';
                }
            }
        }

/*        if (model.customer.udf && model.customer.udf.userDefinedFieldValues &&
            model.customer.udf.userDefinedFieldValues.udf1) {
            model.customer.udf.userDefinedFieldValues.udf1 =
                model.customer.udf.userDefinedFieldValues.udf1 === true ||
                model.customer.udf.userDefinedFieldValues.udf1 === 'true';
        }*/
        if (model.customer.verifications && model.customer.verifications.length) {
            for (i in model.customer.verifications) {
                if (model.customer.verifications[i].houseNoIsVerified) {
                    model.customer.verifications[i].houseNoIsVerified1= (model.customer.verifications[i].houseNoIsVerified == 1) ? true : false;
                }
            }
        }

      

        if (model.customer.physicalAssets && model.customer.physicalAssets.length && model.customer.physicalAssets.length > 0) {
            for (i = 0; i < model.customer.physicalAssets.length; i++) {
                    if(model.customer.physicalAssets[i].nameOfOwnedAsset && (model.customer.physicalAssets[i].assetType == null)){
                        model.customer.physicalAssets[i].assetType=model.customer.physicalAssets[i].nameOfOwnedAsset;
                    }

                    if (model.customer.physicalAssets[i].assetType) {
                        var ownedAssetDetails1 = formHelper.enum('asset_Details').data;
                        var assetunit1 = formHelper.enum('asset_unit').data;
                        var ownedAssetDetails = [];
                        var assetunit = [];
                        if (ownedAssetDetails1 && ownedAssetDetails1.length) {
                            for (j in ownedAssetDetails1) {
                                if (ownedAssetDetails1[j] && ownedAssetDetails1[j].parentCode && ((ownedAssetDetails1[j].parentCode).toUpperCase() == (model.customer.physicalAssets[i].assetType).toUpperCase())) {
                                    ownedAssetDetails.push({
                                        name: ownedAssetDetails1[j].name,
                                        id: ownedAssetDetails1[j].value
                                    })
                                    break;
                                }
                            }
                        }
                        if (ownedAssetDetails.length && ownedAssetDetails.length > 0) {
                            model.customer.physicalAssets[i].ownedAssetallowed = true;
                            continue;
                        }
                        if (assetunit1 && assetunit1.length) {
                            for (k in assetunit1) {
                                if (assetunit1[k] && assetunit1[k].parentCode && ((assetunit1[k].parentCode).toUpperCase() == (model.customer.physicalAssets[i].assetType).toUpperCase())) {
                                    assetunit.push({
                                        name: assetunit1[k].name,
                                    })
                                    break;
                                }
                            }
                        }
                        if (assetunit.length && assetunit.length > 0) {
                            model.customer.physicalAssets[i].assetunitallowed = true;
                        }
                    }   
            }
        }

        

        if(model.customer.familyMembers && model.customer.familyMembers.length){
            for(i in model.customer.familyMembers){
                if(model.customer.maritalStatus && ((model.customer.familyMembers[i].relationShip).toLowerCase() === 'self')){
                    if(!model.customer.familyMembers[i].maritalStatus){
                       model.customer.familyMembers[i].maritalStatus= model.customer.maritalStatus;
                    }
                }
                if(model.customer.familyMembers[i].dateOfBirth){
                    model.customer.familyMembers[i].age = moment().diff(moment(model.customer.familyMembers[i].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                }
                var family= model.customer.familyMembers[i];
                family.familyMemberFullName=Utils.getFullName(family.familyMemberFirstName,family.familyMemberMiddleName,family.familyMemberLastName);
            }
        }

       
        model.customer.idAndBcCustId = model.customer.id + ' / ' + model.customer.bcCustId;
        model.customer.firstName = Utils.getFullName(model.customer.firstName, model.customer.middleName, model.customer.lastName);
        model.customer.middleName = "";
        model.customer.lastName = "";
        model.customer.fatherFirstName = Utils.getFullName(model.customer.fatherFirstName, model.customer.fatherMiddleName, model.customer.fatherLastName);
        model.customer.fatherMiddleName = "";
        model.customer.fatherLastName = "";
        model.customer.spouseFirstName = Utils.getFullName(model.customer.spouseFirstName, model.customer.spouseMiddleName, model.customer.spouseLastName);
        model.customer.spouseMiddleName = "";
        model.customer.spouseLastName = "";
        

        Utils.removeNulls(model,true);
        model.customer.ownedAssetDetails = [];
        model.customer.assetunit = [];
        return model;
    };

    var validateDate = function(model) {
        var today = moment(new Date()).format("YYYY-MM-DD");
        if (model.customer && model.customer.idProofIssueDate) {
            if (model.customer.idProofIssueDate > today) {
                $log.info("bad date");
                PageHelper.showProgress('validate-error', 'Id Proof Issued Date should not be a Future Date', 5000);
                return false;
            }
        }
        if (model.customer && model.customer.idProofValidUptoDate) {
            if (model.customer.idProofValidUptoDate <= today) {
                $log.info("bad date");
                PageHelper.showProgress('validate-error', 'Id Proof Valid Up to Date must be a Future Date', 5000);
                return false;
            }
        }
        if (model.customer && model.customer.addressProofIssueDate) {
            if (model.customer.addressProofIssueDate > today) {
                $log.info("bad date");
                PageHelper.showProgress('validate-error', 'Address Proof Issued Date should not be a Future Date', 5000);
                return false;
            }
        }
        if (model.customer && model.customer.addressProofValidUptoDate) {
            if (model.customer.addressProofValidUptoDate <= today) {
                $log.info("bad date");
                PageHelper.showProgress('validate-error', 'Address Proof Valid Up to Date must be a Future Date', 5000);
                return false;
            }
        }
        return true;
    }

    var validateData = function(model) {
        PageHelper.clearErrors();
        if (_.hasIn(model.customer, 'udf') && model.customer.udf && model.customer.udf.userDefinedFieldValues) {
            if (model.customer.udf.userDefinedFieldValues.udf36
                || model.customer.udf.userDefinedFieldValues.udf35
                || model.customer.udf.userDefinedFieldValues.udf34) {
                if (!model.customer.udf.userDefinedFieldValues.udf33) {
                    PageHelper.setError({message:'Spouse ID Proof type is mandatory when Spouse ID Details are given'});
                    return false;
                }
            }
        }
        
        if (model.customer.spouseDateOfBirth && !model.customer.spouseFirstName) {
            PageHelper.setError({message:'Spouse Name is required when Spouse Date of birth is entered'});
            return false;
        }
        return true;
    };

    var validateBankAccounts = function(model) {
        PageHelper.clearErrors();
        if (model.customer && model.customer.customerBankAccounts) {
            for (var i=0; i<model.customer.customerBankAccounts.length; i++){
                var bankAccount = model.customer.customerBankAccounts[i];
                if (bankAccount.accountNumber!=bankAccount.confirmedAccountNumber){
                    //PageHelper.showProgress('validate-error', 'Bank Accounts: Account Number doesnt match with Confirmed Account Number', 5000);
                    PageHelper.setError({message:'Bank Accounts: Account Number doesnt match with Confirmed Account Number'});
                    return false;
                }
            }
        }
        return true;
    };
    /*
    * function saveData:
    *
    * if cust id is not set, data is saved and the promise is resolved with SAVE's response
    * if cust id is set, promise is rejected with true (indicates doProceed)
    * if error occurs during save, promise is rejected with false (indicates don't proceed
    * */
    var saveData = function(reqData){

        var deferred = $q.defer();
        $log.info("Attempting Save");
        $log.info(reqData);
        PageHelper.clearErrors();
        $('div.spinner-wrapper.spinner-section-far-wrapper').removeClass('ng-hide').addClass('ng-show');
        if (reqData.customer.currentStage == 'Completed'){ 
            reqData['enrollmentAction'] = 'PROCEED';
        } else {
            reqData['enrollmentAction'] = 'SAVE';    
        }
        /* TODO fix for KYC not saving **/
       /* if (!_.hasIn(reqData.customer, 'additionalKYCs') || _.isNull(reqData.customer.additionalKYCs)){
            reqData.customer.additionalKYCs = [];
            reqData.customer.additionalKYCs.push({});
        }*/
        var action = reqData.customer.id ? 'update' : 'save';
        Enrollment[action](reqData, function (res, headers) {
            $log.info(res);
            $('div.spinner-wrapper.spinner-section-far-wrapper').removeClass('ng-show').addClass('ng-hide');
            deferred.resolve(res);
        }, function (res) {
            $('div.spinner-wrapper.spinner-section-far-wrapper').removeClass('ng-show').addClass('ng-hide');
            PageHelper.showErrors(res);
            deferred.reject(res);
        });
        return deferred.promise;

    };
    /*
    * fn proceedData:
    *
    * if cust id not set, promise rejected with null
    * if cust id set, promise resolved with PROCEED response
    * if error occurs, promise rejected with null.
    * */

    var saveandproceed= function (res){
        var deferred = $q.defer();
        $log.info("Attempting Proceed");
        $log.info(res);
        PageHelper.clearErrors();
            $('div.spinner-wrapper.spinner-section-far-wrapper').removeClass('ng-hide').addClass('ng-show');
            res.enrollmentAction = "PROCEED";
            Enrollment.updateEnrollment(res, function (res, headers) {
                $('div.spinner-wrapper.spinner-section-far-wrapper').removeClass('ng-show').addClass('ng-hide');
                deferred.resolve(res);
            }, function (res, headers) {
                $('div.spinner-wrapper.spinner-section-far-wrapper').removeClass('ng-show').addClass('ng-hide');
                PageHelper.showErrors(res);
                deferred.reject(res);
            });
        return deferred.promise;

    };
    var proceedData = function(res){

        var deferred = $q.defer();
        $log.info("Attempting Proceed");
        $log.info(res);
        if(res.customer.id===undefined || res.customer.id===null){
            $log.info("Customer id null, cannot proceed");
            deferred.reject(null);
        }
        else {
            PageHelper.clearErrors();
            $('div.spinner-wrapper.spinner-section-far-wrapper').removeClass('ng-hide').addClass('ng-show');
            res.enrollmentAction = "PROCEED";
            Enrollment.updateEnrollment(res, function (res, headers) {
                $('div.spinner-wrapper.spinner-section-far-wrapper').removeClass('ng-show').addClass('ng-hide');
                deferred.resolve(res);
            }, function (res, headers) {
                $('div.spinner-wrapper.spinner-section-far-wrapper').removeClass('ng-show').addClass('ng-hide');
                PageHelper.showErrors(res);
                deferred.reject(res);
            });
        }
        return deferred.promise;

    };

    var parseAadhaar = function(aadhaarXml) {
        var aadhaarData = {
            "uid" :null,
            "name":null,
            "gender":null,
            "dob":null,
            "yob":null,
            "co":null,
            "house":null,
            "street":null,
            "lm":null,
            "loc":null,
            "vtc":null,
            "dist":null,
            "state":null,
            "pc":null,
            "po": null,
            'fatherName':null,
        };
        var aadhaarDoc = $.parseXML(aadhaarXml);
        aadhaarXmlData = $(aadhaarDoc).find('PrintLetterBarcodeData');
        if (aadhaarXmlData && aadhaarXmlData.length) {
            angular.forEach(aadhaarXmlData[0].attributes, function(attr, i){
                this[attr.name] = attr.value;
            }, aadhaarData);
            aadhaarData['pc'] = Number(aadhaarData['pc']);
            var g = aadhaarData['gender'].toUpperCase();
            aadhaarData['gender'] = (g === 'M' || g === 'MALE') ? 'MALE' : ((g === 'F' || g === 'FEMALE') ? 'FEMALE' : 'OTHERS');
            var value = aadhaarData['gender'] == 'MALE' ? 'S/O: ' : 'D/O: ';
            if(_.includes(aadhaarData['co'], value))
                aadhaarData['fatherName'] = aadhaarData['co'].replace(value,'');
        }
        return aadhaarData;
    };

    var customerAadhaarOnCapture = function(result, model, form) {
        $log.info(result); // spouse id proof
        // "co":""
        // "lm":"" landmark
        var aadhaarData = parseAadhaar(result.text);
        $log.info(aadhaarData);
        // model.customer.aadhaarNo = aadhaarData.uid;
        model.customer.firstName = aadhaarData.name;
        model.customer.gender = aadhaarData.gender;
        model.customer.doorNo = aadhaarData.house;
        model.customer.street = aadhaarData.street;
        model.customer.locality = aadhaarData.loc;
        model.customer.villageName = aadhaarData.vtc;
        if (aadhaarData.fatherName !=null)
        model.customer.fatherFirstName = aadhaarData.fatherName;
        //model.customer.district = aadhaarData.dist;
        //model.customer.state = aadhaarData.state;
        model.customer.pincode = aadhaarData.pc;
        model.customer.postOffice = aadhaarData.po;
        if (aadhaarData.dob) {
            $log.debug('aadhaarData dob: ' + aadhaarData.dob);
            if (!isNaN(aadhaarData.dob.substring(2, 3))) {
                model.customer.dateOfBirth = aadhaarData.dob;
            } else {
                model.customer.dateOfBirth = moment(aadhaarData.dob, 'DD/MM/YYYY').format(SessionStore.getSystemDateFormat());
            }
            $log.debug('customer dateOfBirth: ' + model.customer.dateOfBirth);
            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
        } else if (aadhaarData.yob) {
            $log.debug('aadhaarData yob: ' + aadhaarData.yob);
            if (model.customer.dateOfBirth) {
                var dateOfBirth = moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat());
                var month = dateOfBirth.format('M');
                var day = dateOfBirth.format('D');
                var year = dateOfBirth.format('YYYY');
                model.customer.dateOfBirth = aadhaarData.yob + '-' + month + '-' + day;
            } else {
                model.customer.dateOfBirth = aadhaarData.yob + '-01-01';
            }
            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
        }
        if (!model.customer.identityProof && !model.customer.identityProofNo
            && !model.customer.addressProof && !model.customer.addressProofNo) {
            model.customer.addressProofSameAsIdProof = true;
        }
        if (!model.customer.identityProof && !model.customer.identityProofNo) {
            model.customer.identityProof = 'Aadhar card';
            model.customer.identityProofNo = aadhaarData.uid;
            model.customer.aadhaarNo = aadhaarData.uid;
        }
        if (!model.customer.addressProof && !model.customer.addressProofNo) {
            model.customer.addressProof = 'Aadhar card';
            model.customer.addressProofNo = aadhaarData.uid;
        }
        return aadhaarData;
    };

    return {
        fixData: fixData,
        saveData: saveData,
        proceedData: proceedData,
        saveandproceed:saveandproceed,
        validateData: validateData,
        validateDate:validateDate,
        validateBankAccounts:validateBankAccounts,
        parseAadhaar: parseAadhaar,
        customerAadhaarOnCapture: customerAadhaarOnCapture,
        validatePanCard: validatePanCard,
        checkBiometricQuality:checkBiometricQuality
    };
}]);
