irf.pageCollection.factory(irf.page("AssetsLiabilitiesAndHealth"),
["$log","formHelper","Enrollment", '$state','$stateParams', '$q', 'irfProgressMessage', 'PageHelper',
    'SessionStore','Utils','authService', 'BiometricService', 'Files',
function($log,formHelper,Enrollment,$state, $stateParams, $q, irfProgressMessage, PageHelper,
         SessionStore,Utils,authService, BiometricService, Files) {
    return {
        "id": "AssetsAndLiabilities",
        "type": "schema-form",
        "name": "Stage2",
        "title": "HOUSE_VERIFICATION",
        "subTitle": "Enrollment Stage 2",
        "uri": "Profile/Stage 2",
        initialize: function (model, form, formCtrl) {
            $log.info("I got initialized");
            $log.info($stateParams);

            if (!(model && model.customer && model.customer.id && model.$$STORAGE_KEY$$)) {

                PageHelper.showLoader();
                PageHelper.showProgress("page-init","Loading...");
                var expenditureSourcesTitlemap = formHelper.enum('expenditure').data;
                var customerId = $stateParams.pageId;
                if (!customerId) {
                    PageHelper.hideLoader();
                    $state.go("Page.Engine",{
                        pageName:"EnrollmentHouseVerificationQueue",
                        pageId:null
                    });
                    return;
                }
                Enrollment.get({id: customerId},
                    function(res){
                        _.assign(model.customer, res);

                        model.customer.expenditures = [];
                        model.customer.date = model.customer.date || Utils.getCurrentDate();

                        _.forEach(expenditureSourcesTitlemap, function(v){
                            if (v.value !== 'Other')
                                model.customer.expenditures.push({expenditureSource:v.value,frequency:'Monthly',annualExpenses:0});
                        });

                        model.customer.familyMembers = model.customer.familyMembers || [];
                        var self = null;
                        var spouse = null;
                        _.each(model.customer.familyMembers, function(v){
                            if (v.relationShip === 'Self') {
                                self = v;
                            } else if (v.relationShip === 'Husband' || v.relationShip === 'Wife') {
                                spouse = v;
                            }
                        });
                        if (!self) {
                            self = {
                                customerId: model.customer.id,
                                familyMemberFirstName: model.customer.firstName,
                                relationShip: 'Self',
                                gender: model.customer.gender,
                                dateOfBirth: model.customer.dateOfBirth,
                                maritalStatus: model.customer.maritalStatus,
                                mobilePhone: model.customer.mobilePhone || '',
                                age: moment().diff(moment(model.customer.dateOfBirth, SessionStore.getSystemDateFormat()), 'years')
                            };
                            model.customer.familyMembers.push(self);
                        } else {
                            // TODO already self available, can verify here
                        }
                        if (!spouse) {
                            spouse = {
                                familyMemberFirstName: model.customer.spouseFirstName,
                                relationShip: model.customer.gender === 'MALE' ? 'Wife':'Husband',
                                gender: model.customer.gender === 'MALE' ? 'FEMALE':'MALE',
                                dateOfBirth: model.customer.spouseDateOfBirth,
                                maritalStatus: model.customer.maritalStatus,
                                age: moment().diff(moment(model.customer.spouseDateOfBirth, SessionStore.getSystemDateFormat()), 'years')
                            };
                            model.customer.familyMembers.push(spouse);
                        } else {
                            // TODO already spouse available, can verify here
                        }

                        model.customer.nameOfRo = model.customer.nameOfRo || SessionStore.getLoginname();
                        try {
                            if (model.customer.verifications.length < 1) {
                                model.customer.verifications = [
                                    {
                                        "relationship": "Neighbour"
                                    },
                                    {
                                        "relationship": "Neighbour"
                                    }
                                ];
                            }
                        }catch(err){
                            model.customer.verifications = [
                                {
                                    "relationship": "Neighbour"
                                },
                                {
                                    "relationship": "Neighbour"
                                }
                            ];
                        }
                        model = Utils.removeNulls(model,true);

                        PageHelper.hideLoader();
                        PageHelper.showProgress("page-init","Done.",2000);

                    },
                    function(res){
                        PageHelper.hideLoader();
                        PageHelper.showProgress("page-init","Error in loading customer.",2000);
                        PageHelper.showErrors(res);
                        $state.go("Page.Engine", {
                            pageName: 'EnrollmentHouseVerificationQueue',
                            pageId: null
                        });
                    }
                );
            }

            model.isFPEnrolled = function(fingerId){
                //$log.info("Inside isFPEnrolled: " + BiometricService.getFingerTF(fingerId) + " :"  + fingerId);
                if (model.customer[BiometricService.getFingerTF(fingerId)]!=null || (typeof(model.customer.$fingerprint)!='undefined' && typeof(model.customer.$fingerprint[fingerId])!='undefined' && model.customer.$fingerprint[fingerId].data!=null )) {
                    //$log.info("Inside isFPEnrolled: :true");
                    return "fa-check text-success";
                }
                //$log.info("Inside isFPEnrolled: false");
                return "fa-close text-danger";
            }

            model.getFingerLabel = function(fingerId){
                return BiometricService.getLabel(fingerId);
            }

        },
        offline: true,
        getOfflineDisplayItem: function(item, index){
            return [
                item["customer"]["urnNo"],
                item["customer"]["firstName"]
            ]
        },
        //modelPromise: function(pageId) {
        //    var deferred = $q.defer();
        //    Enrollment.get({id:pageId}).$promise.then(function(data){
        //        deferred.resolve({customer:data});
        //    });
        //    return deferred.promise;
        //},
        form: [
            {
                "type": "box",
                "title": "T_FAMILY_DETAILS",
                "items": [{
                    key:"customer.familyMembers",
                    type:"array",
                    startEmpty: true,
                    items: [
                        {
                            key:"customer.familyMembers[].customerId",
                            type:"lov",
                            "inputMap": {
                                "firstName": {
                                    "key": "customer.firstName",
                                    "title": "CUSTOMER_NAME"
                                },
                                "branchName": {
                                    "key": "customer.kgfsName",
                                    "type": "select"
                                },
                                "centreCode": {
                                    "key": "customer.centreCode",
                                    "type": "select"
                                }
                            },
                            "outputMap": {
                                "id": "customer.familyMembers[arrayIndex].customerId",
                                "firstName": "customer.familyMembers[arrayIndex].familyMemberFirstName"

                            },
                            "searchHelper": formHelper,
                            "search": function(inputModel, form) {
                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var promise = Enrollment.search({
                                    'branchName': SessionStore.getBranch() || inputModel.branchName,
                                    'firstName': inputModel.first_name,
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
                            key:"customer.familyMembers[].familyMemberFirstName",
                            title:"FAMILY_MEMBER_FULL_NAME"
                        },
                        {
                            key:"customer.familyMembers[].relationShip",
                            type:"select",
                            title: "T_RELATIONSHIP"
                        },
                        {
                            key: "customer.familyMembers[].gender",
                            type: "radios",
                            title: "T_GENDER"
                        },
                        {
                            key:"customer.familyMembers[].age",
                            title: "AGE",
                            type:"number",
                            "onChange": function(modelValue, form, model, formCtrl, event) {
                                if (model.customer.familyMembers[form.arrayIndex].age > 0) {
                                    if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-') + moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, 'YYYY-MM-DD').format('MM-DD');
                                    } else {
                                        model.customer.familyMembers[form.arrayIndex].dateOfBirth = moment(new Date()).subtract(model.customer.familyMembers[form.arrayIndex].age, 'years').format('YYYY-MM-DD');
                                    }
                                }
                            }
                        },
                        {
                            key: "customer.familyMembers[].dateOfBirth",
                            type:"date",
                            title: "T_DATEOFBIRTH",
                            "onChange": function(modelValue, form, model, formCtrl, event) {
                                if (model.customer.familyMembers[form.arrayIndex].dateOfBirth) {
                                    model.customer.familyMembers[form.arrayIndex].age = moment().diff(moment(model.customer.familyMembers[form.arrayIndex].dateOfBirth, SessionStore.getSystemDateFormat()), 'years');
                                }
                            }
                        },
                        {
                            key:"customer.familyMembers[].educationStatus",
                            type:"select",
                            title: "T_EDUCATION_STATUS"
                        },
                        {
                            key:"customer.familyMembers[].maritalStatus",
                            type:"select",
                            title: "T_MARITAL_STATUS"
                        },

                        "customer.familyMembers[].mobilePhone",
                        {
                            key:"customer.familyMembers[].healthStatus",
                            type:"radios",
                            titleMap:{
                                "GOOD":"GOOD",
                                "BAD":"BAD"
                            },

                        },
                        {
                            key:"customer.familyMembers[].incomes",
                            type:"array",
                            startEmpty: true,
                            items:[
                                {
                                    key: "customer.familyMembers[].incomes[].incomeSource",
                                    type:"select"
                                },
                                "customer.familyMembers[].incomes[].incomeEarned",
                                {
                                    key: "customer.familyMembers[].incomes[].frequency",
                                    type: "select"
                                }

                            ]

                        }
                    ]
                },
                    {
                        "type": "fieldset",
                        "title": "EXPENDITURES",
                        "items": [{
                            key:"customer.expenditures",
                            type:"array",
                            remove: null,
                            view: "fixed",
                            titleExpr: "model.customer.expenditures[arrayIndex].expenditureSource | translate",
                            items:[{
                                type: 'section',
                                htmlClass: 'row',
                                items: [{
                                    type: 'section',
                                    htmlClass: 'col-xs-6',
                                    items: [{
                                        key:"customer.expenditures[].frequency",
                                        type:"select",
                                        notitle: true
                                    }]
                                },{
                                    type: 'section',
                                    htmlClass: 'col-xs-6',
                                    items: [{
                                        key: "customer.expenditures[].annualExpenses",
                                        type:"amount",
                                        notitle: true
                                    }]
                                }]
                            }]
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
                "items": [
                    {
                        key: "customer.physicalAssets",
                        type: "array",
                        startEmpty: true,
                        items: [
                            {
                                key:"customer.physicalAssets[].ownedAssetDetails",
                                type:"select"

                            },
                            "customer.physicalAssets[].numberOfOwnedAsset",
                            {
                                key:"customer.physicalAssets[].ownedAssetValue",
                            }
                        ]
                    },
                    {
                        key: "customer.financialAssets",
                        title:"FINANCIAL_ASSETS",
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
                        title:"FINANCIAL_LIABILITIES",
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
                "title": "BIOMETRIC",
                "items": [
                    {
                        type: "button",
                        title: "CAPTURE_FINGERPRINT",
                        notitle: true,
                        fieldHtmlClass: "btn-block",
                        onClick: function(model, form, formName){
                            var promise = BiometricService.capture(model);
                            promise.then(function(data){
                                model.customer.$fingerprint = data;
                            }, function(reason){
                                console.log(reason);
                            })
                        }
                    },
                    {
                        "type": "section",
                        "html": '<div class="row"> <div class="col-xs-6">' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftThumb\')"></i> {{ model.getFingerLabel(\'LeftThumb\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftIndex\')"></i> {{ model.getFingerLabel(\'LeftIndex\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftMiddle\')"></i> {{ model.getFingerLabel(\'LeftMiddle\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftRing\')"></i> {{ model.getFingerLabel(\'LeftRing\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'LeftLittle\')"></i> {{ model.getFingerLabel(\'LeftLittle\') }}</span><br>' +
                        '</div> <div class="col-xs-6">' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightThumb\')"></i> {{ model.getFingerLabel(\'RightThumb\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightIndex\')"></i> {{ model.getFingerLabel(\'RightIndex\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightMiddle\')"></i> {{ model.getFingerLabel(\'RightMiddle\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightRing\')"></i> {{ model.getFingerLabel(\'RightRing\') }}</span><br>' +
                        '<span><i class="fa fa-fw" ng-class="model.isFPEnrolled(\'RightLittle\')"></i> {{ model.getFingerLabel(\'RightLittle\') }}</span><br>' +
                        '</div></div>'
                    }
                ]
            },
            {
                "type": "box",
                "title": "T_HOUSE_VERIFICATION",
                "items": [
                    {
                        "key": "customer.firstName",
                        "title": "CUSTOMER_NAME",
                        "readonly": true
                    },
                    {
                        key:"customer.nameInLocalLanguage"
                    },
                    {
                        key:"customer.addressInLocalLanguage",
                        type:"textarea"
                    },

                    {
                        key:"customer.religion",
                        type:"select"
                    },
                    {
                        key:"customer.caste",
                        type:"select"
                    },
                    {
                        key:"customer.language",
                        type:"select"
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
                                "type":"select"

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
                        "title": "HOUSE_LOCATION",
                        "type": "geotag",
                        "latitude": "customer.latitude",
                        "longitude": "customer.longitude"
                    },
                    "customer.nameOfRo",
                    {
                        key:"customer.houseVerificationPhoto",
                        offline: true,
                        type:"file",
                        fileType:"image/*"
                    },
                    {
                        "key":"customer.verifications",
                        "title":"VERIFICATION",
                        "add":null,
                        "remove":null,
                        "items":[
                            {
                                key:"customer.verifications[].houseNo"
                            },
                            {
                                key:"customer.verifications[].houseNoIsVerified"
                            },
                            {
                                key:"customer.verifications[].referenceFirstName"
                            },
                            {
                                key:"customer.verifications[].relationship",
                                type:"select"
                            }

                        ]
                    },
                    {
                        key: "customer.date",
                        type:"date"
                    },
                    "customer.place"
                ]
            },
            {
                "type": "actionbox",
                "items": [{
                    "type": "save",
                    "title": "Save Offline",
                },{
                    "type": "submit",
                    "title": "Submit"
                }]
            }

        ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                $log.info(model);
                PageHelper.clearErrors();
                PageHelper.showLoader();

                var out = model.customer.$fingerprint;
                var fpPromisesArr = [];
                for (var key in out) {
                    if (out.hasOwnProperty(key) && out[key].data!=null) {
                        (function(obj){
                            var promise = Files.uploadBase64({file: obj.data, type: 'CustomerEnrollment', subType: 'FINGERPRINT', extn:'iso'}, {}).$promise;
                            promise.then(function(data){
                                model.customer[obj.table_field] = data.fileId;
                                delete model.customer.$fingerprint[obj.fingerId];
                            });
                            fpPromisesArr.push(promise);
                        })(out[key]);
                    } else {
                        if (out[key].data == null){
                            delete out[key];
                        }

                    }
                }
                $q.all(fpPromisesArr).then(function(){

                    var reqData = _.cloneDeep(model);

                    if (reqData['customer']['miscellaneous']){
                        var misc = reqData['customer']['miscellaneous'];
                        if (misc['alcoholConsumption']){
                            misc['alcoholConsumption'] = "Yes"
                        } else {
                            misc['alcoholConsumption'] = "No"
                        }

                        if (misc['narcoticsConsumption']){
                            misc['narcoticsConsumption'] = "Yes"
                        } else {
                            misc['narcoticsConsumption'] = "No"
                        }

                        if (misc['tobaccoConsumption']){
                            misc['tobaccoConsumption'] = "Yes"
                        } else {
                            misc['tobaccoConsumption'] = "No"
                        }
                    }

                    try{
                        var liabilities = reqData['customer']['liabilities'];
                        if (liabilities && liabilities!=null && typeof liabilities.length == "number" && liabilities.length >0 ){
                            for (var i=0; i<liabilities.length;i++){
                                var l = liabilities[i];
                                l.loanAmountInPaisa = l.loanAmountInPaisa * 100;
                                l.installmentAmountInPaisa = l.installmentAmountInPaisa * 100;
                            }
                        }

                        var financialAssets = reqData['customer']['financialAssets'];
                        if (financialAssets && financialAssets!=null && typeof financialAssets.length == "number" && financialAssets.length >0 ){
                            for (var i=0; i<financialAssets.length;i++){
                                var f = financialAssets[i];
                                f.amountInPaisa = f.amountInPaisa * 100;
                            }
                        }
                    } catch(e){
                        $log.info("Error trying to change amount info.");
                    }

                    reqData['enrollmentAction'] = 'PROCEED';

                    irfProgressMessage.pop('enrollment-submit', 'Working... Please wait.');

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

                    }catch(err){
                        console.error(err);
                    }
                    Utils.removeNulls(reqData,true);
                    $log.info(reqData);
                    Enrollment.updateEnrollment(reqData,
                        function(res, headers){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('enrollment-submit', 'Done. Customer URN created : ' + res.customer.urnNo, 5000);
                            $log.info("Inside updateEnrollment Success!");
                            $state.go("Page.Landing");
                        },
                        function(res, headers){
                            PageHelper.hideLoader();
                            irfProgressMessage.pop('enrollment-submit', 'Oops. Some error.', 2000);
                            PageHelper.showErrors(res);
                        })
                    $log.info(reqData);
                })

            }

        }
    }
}]);
