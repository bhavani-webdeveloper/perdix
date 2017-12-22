irf.models.factory('Enrollment',function($resource,$httpParamSerializer,BASE_URL, searchResource){
    var endpoint = BASE_URL + '/api/enrollments';

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
    return $resource(endpoint, null, {

        get:{
            method:'GET',
            url:endpoint+'/:service/:id'
        },
        query:{
            method:'GET',
            url:endpoint+'/:service/:id',
            isArray:true
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
        }
    });
});


irf.pageCollection.factory("EnrollmentHelper",
["$log", "$q","Enrollment", 'PageHelper', 'irfProgressMessage', 'Utils', 'SessionStore',
function($log, $q, Enrollment, PageHelper, irfProgressMessage, Utils, SessionStore){

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
        model['customer']['leftHandIndexImageId'] = "232";

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

        if(model.customer.physicalAssets && model.customer.physicalAssets.length){
            for(i in model.customer.physicalAssets){
                if(model.customer.physicalAssets[i].nameOfOwnedAsset && (model.customer.physicalAssets[i].assetType == null)){
                     model.customer.physicalAssets[i].assetType=model.customer.physicalAssets[i].nameOfOwnedAsset;
                }
            }
        }

        if(model.customer.familyMembers && model.customer.familyMembers.length){
            for(i in model.customer.familyMembers){
                if(model.customer.familyMembers[i].dateOfBirth){
                    model.customer.familyMembers[i].age = moment().diff(moment(model.customer.familyMembers[i].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                }
            }

        }



        Utils.removeNulls(model,true);
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
        PageHelper.showLoader();
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
            PageHelper.hideLoader();
            deferred.resolve(res);
        }, function (res) {
            PageHelper.hideLoader();
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
            PageHelper.showLoader();
            res.enrollmentAction = "PROCEED";
            Enrollment.updateEnrollment(res, function (res, headers) {
                PageHelper.hideLoader();
                deferred.resolve(res);
            }, function (res, headers) {
                PageHelper.hideLoader();
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
            "po": null
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
        model.customer.district = aadhaarData.dist;
        model.customer.state = aadhaarData.state;
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
            model.customer.dateOfBirth = aadhaarData.yob + '-01-01';
            model.customer.age = moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
        }
        if (!model.customer.identityProof && !model.customer.identityProofNo
            && !model.customer.addressProof && !model.customer.addressProofNo) {
            model.customer.addressProofSameAsIdProof = true;
        }
        if (!model.customer.identityProof && !model.customer.identityProofNo) {
            model.customer.identityProof = 'Aadhar card';
            model.customer.identityProofNo = aadhaarData.uid;
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
        validateData: validateData,
        validateDate:validateDate,
        parseAadhaar: parseAadhaar,
        customerAadhaarOnCapture: customerAadhaarOnCapture,
        validatePanCard: validatePanCard
    };
}]);
