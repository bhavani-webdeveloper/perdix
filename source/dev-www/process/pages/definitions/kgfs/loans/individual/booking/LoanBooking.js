define([], function () {

    return {
        pageUID: "kgfs.loans.individual.booking.LoanBooking",
        pageType: "Engine",
        dependencies: ["$log", "$q", "LoanAccount", "LoanProcess", 'Scoring', 'Enrollment', 'EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
            'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor", "UIRepository", "$injector", "irfNavigator"
        ],

        $pageFn: function ($log, $q, LoanAccount, LoanProcess, Scoring, Enrollment, EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper, formHelper, elementsUtils,
            irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
            BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator) {
            var branch = SessionStore.getBranch();
            var podiValue = SessionStore.getGlobalSetting("percentOfDisposableIncome");
            //PMT calculation
            var pmt = function (rate, nper, pv, fv, type) {
                if (!fv) fv = 0;
                if (!type) type = 0;

                if (rate == 0) return -(pv + fv) / nper;

                var pvif = Math.pow(1 + rate, nper);
                var pmt = rate / (pvif - 1) * -(pv * pvif + fv);

                if (type == 1) {
                    pmt /= (1 + rate);
                };

                return pmt;
            }
            //pmt function completed

            var self;
            var validateForm = function (formCtrl) {
                formCtrl.scope.$broadcast('schemaFormValidate');
                if (formCtrl && formCtrl.$invalid) {
                    PageHelper.showProgress("enrolment", "Your form have errors. Please fix them.", 5000);
                    return false;
                }
                return true;
            };

            var getRelationFromClass = function (relation) {
                if (relation == 'guarantor') {
                    return 'Guarantor';
                } else if (relation == 'applicant') {
                    return 'Applicant';
                } else if (relation == 'co-applicant') {
                    return 'Co-Applicant';
                }
            };



            

           

            var getIncludes = function (model) {
                return [
                    "LoanDetails",
                    "LoanDetails.loanType",
                    "LoanDetails.partner",
                    "LoanDetails.frequency",
                    "LoanDetails.loanProductCategory",
                    "LoanDetails.loanProductCode",
                    "LoanDetails.loanApplicationDate",
                    "LoanDetails.loanAmountRequested",
                    "LoanDetails.requestedTenure",
                    "LoanDetails.loanPurpose1",
                    "LoanDetails.loanPurpose2",
                    "LoanDetails.loanPurpose3",
                    "LoanDetails.centreName",
                    "LoanDetails.borrowers.borrowers",
                    "LoanDetails.borrowers.borrowersFullName",
                    "LoanDetails.borrowers.borrowersRelationship",
                    "LoanDetails.witnessDetails",
                    "LoanDetails.witnessDetails.witnessFirstName",
                    "LoanDetails.witnessDetails.witnessRelationship",
                   

                    "NomineeDetails",
                    "NomineeDetails.nominees",
                    "NomineeDetails.nominees.nomineeFirstName",
                    "NomineeDetails.nominees.nomineeGender",
                    "NomineeDetails.nominees.nomineeDOB",
                    "NomineeDetails.nominees.nomineeButton",
                    "NomineeDetails.nominees.nomineeAddressSameasBorrower",
                    "NomineeDetails.nominees.nomineeDoorNo",
                    "NomineeDetails.nominees.nomineeLocality",
                    "NomineeDetails.nominees.nomineeStreet",
                    "NomineeDetails.nominees.nomineePincode",
                    "NomineeDetails.nominees.nomineeDistrict",
                    "NomineeDetails.nominees.nomineeState",
                    "NomineeDetails.nominees.nomineeRelationship",
                    "NomineeDetails.nominees.nomineeMinor",
                    "NomineeDetails.nominees.nomineeGuardian",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianFirstName",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianGender",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianDOB",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianDoorNo",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianLocality",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianStreet",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianPincode",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianDistrict",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianState",
                    "NomineeDetails.nominees.nomineeGuardian.nomineeGuardianRelationship",

                    "JewelDetails",
                    "JewelDetails.jewelPouchNo",
                    "JewelDetails.ornamentDetails",
                    "JewelDetails.ornamentDetails.ornamentDescription",
                    "JewelDetails.ornamentDetails.stonDescription",
                    "JewelDetails.ornamentDetails.jewelDefects",
                    "JewelDetails.ornamentDetails.noOfArticles",
                    "JewelDetails.ornamentDetails.grossWeight",
                    "JewelDetails.ornamentDetails.netWeight",
                    "JewelDetails.ornamentDetails.carat",
                    "JewelDetails.ornamentDetails.rate",
                    "JewelDetails.ornamentDetails.marketValue",









                ]
            }
            var configFile = function (model) {
                return []
            }
            var overridesFields = function (model) {
                return {
                    "LoanDetails": {
                        "orderNo": 1
                    },
                    "LoanDetails.loanType": {
                        "orderNo": 1,
                        "titleMap":[
                            {
                                value: "JLG",
                                name: "Jewel Loan"
                            },
                            {
                                value: "consumerLoan",
                                name: "Consumer Loan"
                            },
                            {
                                value: "individualLoan",
                                name: "Individual Loan"
                            }
                        ]
                    },
                    "LoanDetails.partner": {
                        "orderNo": 2,
                        "enumCode": "partner"
                    },
                    "LoanDetails.frequency": {
                        "orderNo": 3,
                        "enumCode": "loan_product_frequency"
                    },
                    "LoanDetails.loanProductCategory": {
                        "orderNo": 4,
                        "enumCode": "loan_product_category",
                        onChange: function (valueObj, model, context) {
                            console.log("Its time for place Holder");
                            console.log(valueObj);
                            console.log(model);
                            console.log(context);
                        }

                    },
                    "LoanDetails.loanProductCode":{
                        required: true,
                                searchHelper: formHelper,
                                search: function(inputModel, form, model, context) {

                                   return Queries.getLoanProductCode(model.loanAccount.productCategory,model.loanAccount.frequency,model.loanAccount.partnerCode);
                                },
                                onSelect: function(valueObj, model, context) {
                                    model.loanAccount.productCode = valueObj.productCode;
                                },
                                getListDisplayItem: function(item, index) {
                                    return [
                                        item.productCode
                                    ];
                                },
                                onChange: function(value, form, model) {
                                getProductDetails(value, model);
                                },
                    },
                    "LoanDetails.loanPurpose1": {
                        "orderNo": 6,
                        "enumCode": "loan_purpose_1"
                    },
                    "LoanDetails.loanPurpose2": {
                        "orderNo": 7,
                        "enumCode": "loan_purpose_2",
                        "parentEnumCode": "loan_purpose_1"
                    },
                    "LoanDetails.loanPurpose3": {
                        "orderNo": 8,
                        "enumCode": "loan_purpose_3",
                        "parentEnumCode": "loan_purpose_2"
                    },
                    "LoanDetails.loanAmountRequested": {
                        "orderNo": 5,
                    },
                    "LoanDetials.witnessDetails": {
                        "type": "array",
                        "view": "fixed"
                    },
                    "LoanDetails.witnessDetails.witnessFirstName": {
                        "type": "lov",
                        // "key": "model.LoanAccounts.witnessDetails[].witnessFirstName",
                        searchHelper: formHelper,
                        search: function (inputModel, form, model, context) {
                            var out = [];
                            if (!model.customer.familyMembers) {
                                return out;
                            }

                            for (var i = 0; i < model.customer.familyMembers.length; i++) {
                                out.push({
                                    name: model.customer.familyMembers[i].familyMemberFirstName,
                                    // value: model.customer.familyDetails[i].value,
                                    relationship: model.customer.familyMembers[i].relationShip
                                })
                            }
                            return $q.resolve({
                                headers: {
                                    "x-total-count": out.length
                                },
                                body: out
                            });
                        },
                        onSelect: function (valueObj, model, context) {
                            //add to the witnees array.
                            if (_.isUndefined(model.loanAccount.witnessDetails[0])) {
                                 model.loanAccount.witnessDetails[0] = [];
                             }
                            model.loanAccount.witnessDetails[0].witnessFirstName = valueObj.name;
                            model.loanAccount.witnessDetails[0].witnessRelationship = valueObj.relationship;
                        },
                        getListDisplayItem: function (item, index) {
                            return [
                                item.name
                            ];
                        }
                    },
                    "NomineeDetails": {
                        "orderNo": 3
                    },
                    "JewelDetails":{
                        "orderNo": 2,
                        "condition": "model.loanAccount.loanType == 'JLG'"
                    },
                    "NomineeDetails.nominees.nomineeFirstName":{
                    },
                    "NomineeDetails.nominees.nomineeGuardian": {

                    }
                }
            }

            return {
                "type": "schema-form",
                "title": "LOAN_REQUEST",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    // AngularResourceService.getInstance().setInjector($injector);
                    console.log("test");
                    console.log(model);
                    var familyDetails = [];
                    model.customer = {};
                    model.loanAccount = model.loanProcess.loanAccount;
                    model.loanAccount.bcAccount = {};
                    model.loanAccount.processType = "1";
                    // model.loanAccount.nominees = [];
                    // model.loanAccount.nominees[0] ={};
                    // model.loanAccount.nominees[0].nomineeFirstName = "Harish";
                    // model.loanAccount.nominees[0].nomineeMiddleName = "Harish";
                    // $q.when(Enrollment.get({
                    //     'id': model.loanAccount.customerId
                    // })).then(function (resp) {
                    //     model.customer.familyDetails = resp;
                    // });

                    // model.loanAccount.witnessFirstName="Harish";
                    // model.loanAccount.witnessRelationship="Tester";


                    // model.customer.familyDetails=[
                    //     {
                    //         name:"Mahesh",
                    //         value:"Mahesh",
                    //         relationshipWithApplicant:"Brother"
                    //     },
                    //     {
                    //         name:"Satya",
                    //         value:"Satya",
                    //         relationshipWithApplicant:"Friend"
                    //     }
                    // ];

                    // if (_.hasIn(model, 'loanAccount.loanCustomerRelations') &&
                    //     model.loanAccount.loanCustomerRelations != null &&
                    //     model.loanAccount.loanCustomerRelations.length > 0) {
                    //     var lcr = model.loanAccount.loanCustomerRelations;
                    //     var idArr = [];
                    //     for (var i = 0; i < lcr.length; i++) {
                    //         idArr.push(lcr[i].customerId);
                    //     }
                    //     Queries.getCustomerBasicDetails({
                    //             'ids': idArr
                    //         })
                    //         .then(function (result) {
                    //             if (result && result.ids) {
                    //                 for (var i = 0; i < lcr.length; i++) {
                    //                     var cust = result.ids[lcr[i].customerId];
                    //                     if (cust) {
                    //                         lcr[i].name = cust.first_name;
                    //                     }
                    //                 }
                    //             }
                    //         });
                    // }

                    BundleManager.broadcastEvent('loan-account-loaded', {
                        loanAccount: model.loanAccount
                    });

                    /* Deviations and Mitigations grouping */
                    if (_.hasIn(model.loanAccount, 'loanMitigants') && _.isArray(model.loanAccount.loanMitigants)) {
                        var loanMitigantsGrouped = {};
                        for (var i = 0; i < model.loanAccount.loanMitigants.length; i++) {
                            var item = model.loanAccount.loanMitigants[i];
                            if (!_.hasIn(loanMitigantsGrouped, item.parameter)) {
                                loanMitigantsGrouped[item.parameter] = [];
                            }
                            loanMitigantsGrouped[item.parameter].push(item);
                        }
                        model.loanMitigantsByParameter = [];
                        _.forOwn(loanMitigantsGrouped, function (mitigants, key) {
                            var chosenMitigants = "<ul>";

                            for (var i = 0; i < mitigants.length; i++) {
                                chosenMitigants = chosenMitigants + "<li>" + mitigants[i].mitigant + "</li>";
                            }
                            chosenMitigants = chosenMitigants + "</ul>";
                            model.loanMitigantsByParameter.push({
                                'Parameter': key,
                                'Mitigants': chosenMitigants
                            })
                        })
                    }
                    /* End of Deviations and Mitigations grouping */

                    self = this;
                    var p1 = UIRepository.getLoanProcessUIRepository().$promise;
                    p1.then(function (repo) {
                            console.log("Text");
                            // console.log(repo);                       
                            var formRequest = {
                                "overrides": overridesFields(model),
                                "includes": getIncludes(model),
                                "excludes": [],
                                "options": {
                                    "repositoryAdditions": {
                                        "LoanDetails": {
                                            "items": {
                                                "borrowers": {
                                                    "items": {
                                                        "borrowers":{
                                                            "title": "BORROWERS",
                                                            "type": "radios",
                                                            "orderNo": 8,
                                                            "key": "yet to decided",
                                                            "titleMap": [{
                                                                    value: "Father",
                                                                    name: "Father"
                                                                },
                                                                {
                                                                    value: "Husband",
                                                                    name: "Husband"
                                                                }
                                                            ]
                                                        },
                                                        "borrowersFirstName":{
                                                            "title":"FULL_NAME",
                                                            "type": "text",
                                                            "readonly":true,
                                                            "key":"yet to decide",
                                                        },
                                                        "borrowersRealtionship":{
                                                            "title":"RELATIONSHIP",
                                                            "type":"text",
                                                            "readonly":true,
                                                            "key":"yet to decide",
                                                        }

                                                    }

                                                },
                                                "NomineeDetails":{
                                                    "items":{
                                                        "nominees":{
                                                            "items":{
                                                                "nomineeAddressSameasBorrower":{
                                                                    "type":"checkbox",
                                                                    "title": "ADDRESS_SAME_AS_BORROWER",
                                                                    "schema":{
                                                                        "type": ["boolean", "null"]
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }

                                            }

                                        }
                                    },
                                    "additions": [
                                        {
                                            "type": "box",
                                            "title": "POST_REVIEW",
                                            "condition": "model.loanAccount.id",
                                            "items": [
                                                {
                                                    key: "review.action",
                                                    condition: "model.currentStage == 'PendingForPartner' && model.loanHoldRequired!='NO'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "SEND_BACK": "SEND_BACK",
                                                        "PROCEED": "PROCEED",
                                                        "HOLD": "HOLD"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.currentStage == 'LoanInitiation' && model.loanHoldRequired!='NO'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "PROCEED": "PROCEED",
                                                        "HOLD": "HOLD"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.currentStage == 'PendingForPartner' && model.siteCode=='YES'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "SEND_BACK": "SEND_BACK",
                                                        "PROCEED": "PROCEED"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.currentStage == 'LoanInitiation'&& model.siteCode=='YES'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "PROCEED": "PROCEED"
                                                    }
                                                },
                                                {
                                                    key: "review.action",
                                                    condition: "model.loanAccount.currentStage == 'LoanInitiation'",
                                                    type: "radios",
                                                    titleMap: {
                                                        "REJECT": "REJECT",
                                                        "PROCEED": "PROCEED"
                                                    }
                                                },
                                                {
                                                    type: "section",
                                                    condition: "model.review.action=='REJECT'",
                                                    items: [
                                                        {
                                                            title: "REMARKS",
                                                            key: "review.remarks",
                                                            type: "textarea",
                                                            required: true
                                                        },
                                                        {
                                                            key: "loanAccount.rejectReason",
                                                            type: "lov",
                                                            autolov: true,
                                                            title: "REJECT_REASON",
                                                            bindMap: {},
                                                            searchHelper: formHelper,
                                                            search: function(inputModel, form, model, context) {
                                                                var stage1 = model.currentStage;
                            
                                                                if (model.currentStage == 'Application' || model.currentStage == 'ApplicationReview') {
                                                                    stage1 = "Application";
                                                                }
                                                                if (model.currentStage == 'FieldAppraisal' || model.currentStage == 'FieldAppraisalReview') {
                                                                    stage1 = "FieldAppraisal";
                                                                }
                            
                                                                var rejectReason = formHelper.enum('application_reject_reason').data;
                                                                var out = [];
                                                                for (var i = 0; i < rejectReason.length; i++) {
                                                                    var t = rejectReason[i];
                                                                    if (t.field1 == stage1) {
                                                                         out.push({
                                                                            name: t.name,
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
                                                            onSelect: function(valueObj, model, context) {
                                                                model.loanAccount.rejectReason = valueObj.name;
                                                            },
                                                            getListDisplayItem: function(item, index) {
                                                                return [
                                                                    item.name
                                                                ];
                                                            }
                                                        },
                            
                                                        {
                                                            key: "review.rejectButton",
                                                            type: "button",
                                                            title: "REJECT",
                                                            required: true,
                                                            onClick: "actions.reject(model, formCtrl, form, $event)"
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: "section",
                                                    condition: "model.review.action=='HOLD'",
                                                    items: [
                                                        {
                                                            title: "REMARKS",
                                                            key: "review.remarks",
                                                            type: "textarea",
                                                            required: true
                                                        },
                                                        {
                                                            key: "review.holdButton",
                                                            type: "button",
                                                            title: "HOLD",
                                                            required: true,
                                                            onClick: "actions.holdButton(model, formCtrl, form, $event)"
                                                        }
                                                    ]
                                                },
                                                {
                                                    type: "section",
                                                    condition: "model.review.action=='SEND_BACK'",
                                                    items: [{
                                                        title: "REMARKS",
                                                        key: "review.remarks",
                                                        type: "textarea",
                                                        required: true
                                                    }, {
                                                        key: "review.targetStage",
                                                        title: "SEND_BACK_TO_STAGE",
                                                        type: "select",
                                                        condition: "model.currentStage == 'PendingForPartner'",
                                                        required: true,
                                                        titleMap: {
                                                            "LoanInitiation": "LoanInitiation"
                                                        },
                                                    }, {
                                                        key: "review.targetStage",
                                                        title: "SEND_BACK_TO_STAGE",
                                                        type: "select",
                                                        condition: "model.currentStage == 'LoanInitiation'",
                                                        required: true,
                                                        titleMap: {
                                                            "Screening": "Screening",
                                                            "ScreeningReview": "ScreeningReview",
                                                            "Application": "Application",
                                                            "ApplicationReview": "ApplicationReview",
                                                            "FieldAppraisal": "FieldAppraisal",
                                                            "FieldAppraisalReview": "FieldAppraisalReview",
                                                            "CentralRiskReview": "CentralRiskReview",
                                                            "LoanSanction": "LoanSanction"
                                                        },
                                                    }, {
                                                        key: "review.sendBackButton",
                                                        type: "button",
                                                        title: "SEND_BACK",
                                                        onClick: "actions.sendBack(model, formCtrl, form, $event)"
                                                    }]
                                                },
                                                {
                                                    type: "section",
                                                    condition: "model.review.action=='PROCEED'",
                                                    items: [
                                                        {
                                                            title: "REMARKS",
                                                            key: "review.remarks",
                                                            type: "textarea",
                                                            required: true
                                                        },
                                                        {
                                                            key: "review.proceedButton",
                                                            type: "button",
                                                            title: "PROCEED",
                                                            onClick: "actions.proceed(model, formCtrl, form, $event)"
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                        "type": "actionbox",
                                        "items": [{
                                            "type": "submit",
                                            "title": "SAVE"
                                        }, ]
                                    }]
                                }
                            };
                            var result = IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model);
                            console.log(result);
                            console.log("test");
                            return result;
                        })
                        .then(function (form) {
                            self.form = form;
                        });
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                    return [
                        item.customer.firstName,
                        item.customer.centreCode,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "new-applicant": function (bundleModel, model, obj) {
                        model.customer = obj.customer;
                        model.loanAccount.customerId = model.customer.id;
                        // $q.when(Enrollment.get({
                        //     'id': model.loanAccount.customerId
                        // })).then(function (resp) {
                        //     model.customer = resp;
                        // })
                    },
                    "lead-loaded": function (bundleModel, model, obj) {
                        model.lead = obj;
                        model.loanAccount.loanAmountRequested = obj.loanAmountRequested;
                        model.loanAccount.loanPurpose1 = obj.loanPurpose1;
                        model.loanAccount.screeningDate = obj.screeningDate;
                    },
                    "new-business": function (bundleModel, model, params) {
                        $log.info("Inside new-business of LoanRequest");
                        model.loanAccount.customerId = params.customer.id;
                        model.loanAccount.loanCentre = model.loanAccount.loanCentre || {};
                        model.loanAccount.loanCentre.branchId = params.customer.customerBranchId;
                        model.loanAccount.loanCentre.centreId = params.customer.centreId;
                        model.enterprise = params.customer;
                    },
                    "load-deviation": function (bundleModel, model, params) {
                        $log.info("Inside Deviation List");
                        model.deviations = {};
                        model.deviations.deviationParameter = [];
                        model.deviations.deviationParameter = params.deviations.deviationParameter;
                        model.deviations.scoreName = params.deviations.scoreName;

                        if (_.isArray(model.deviations.deviationParameter)) {
                            _.forEach(model.deviations.deviationParameter, function (deviation) {
                                if (_.hasIn(deviation, 'ChosenMitigants') && _.isArray(deviation.ChosenMitigants)) {
                                    _.forEach(deviation.ChosenMitigants, function (mitigantChosen) {
                                        for (var i = 0; i < deviation.mitigants.length; i++) {
                                            if (deviation.mitigants[i].mitigantName == mitigantChosen) {
                                                deviation.mitigants[i].selected = true;
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                },
                form: [],
                schema: function () {
                    console.log("First thing to excecute I guess");
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {
                    submit: function (model, formCtrl, form) {
                        /* Loan SAVE */
                        if (!model.loanAccount.id) {
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                BundleManager.pushEvent('new-loan', model._bundlePageObj, {
                                    loanAccount: model.loanAccount
                                });
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);

                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                PageHelper.hideLoader();
                            });

                    },
                    holdButton: function (model, formCtrl, form, $event) {
                        $log.info("Inside save()");
                        if (!model.loanAccount.id) {
                            model.loanAccount.isRestructure = false;
                            model.loanAccount.documentTracking = "PENDING";
                            model.loanAccount.psychometricCompleted = "NO";

                        }
                        model.loanAccount.status = "HOLD";
                        PageHelper.showProgress('loan-process', 'Updating Loan');
                        model.loanProcess.hold()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('loan-process', 'Loan hold.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);

                                PageHelper.hideLoader();
                            });

                    },
                    sendBack: function (model, formCtrl, form, $event) {
                        PageHelper.showLoader();
                        model.loanProcess.sendBack()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);

                                PageHelper.hideLoader();
                            });
                    },
                    proceed: function (model, formCtrl, form, $event) {
                        PageHelper.showProgress('enrolment', 'Updating Loan');
                        model.loanProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);

                                PageHelper.hideLoader();
                            });
                    },
                    reject: function (model, formCtrl, form, $event) {
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        PageHelper.showLoader();
                        model.loanProcess.reject()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                Utils.removeNulls(value, true);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                irfNavigator.goBack();
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);

                                PageHelper.hideLoader();
                            });
                    },
                    // nomineeAddress: function (model, formCtrl, form, $event) {
                    //     PageHelper.showLoader();
                    //     if (model.loanProcess.applicantEnrolmentProcess) {
                    //         model.loanAccount.nominees[0].nomineeDoorNo = model.loanProcess.applicantEnrolmentProcess.customer.doorNo;
                    //         model.loanAccount.nominees[0].nomineeLocality = model.loanProcess.applicantEnrolmentProcess.customer.locality;
                    //         model.loanAccount.nominees[0].nomineeStreet = model.loanProcess.applicantEnrolmentProcess.customer.street;
                    //         model.loanAccount.nominees[0].nomineePincode = model.loanProcess.applicantEnrolmentProcess.customer.pincode;
                    //         model.loanAccount.nominees[0].nomineeDistrict = model.loanProcess.applicantEnrolmentProcess.customer.district;
                    //         model.loanAccount.nominees[0].nomineeState = model.loanProcess.applicantEnrolmentProcess.customer.state;
                    //     } else {
                    //         PageHelper.hideLoader();
                    //     }
                    //     PageHelper.hideLoader();
                    // }
                }
            };

        }
    }
});
