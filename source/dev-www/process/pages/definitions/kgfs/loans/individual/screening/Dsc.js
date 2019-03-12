define([], function () {

    return {
        pageUID: "kgfs.loans.individual.screening.Dsc",
        pageType: "Engine",
        dependencies: ["$log", "$q", "LoanAccount", "LoanProcess", 'Scoring', 'Enrollment', 'EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
            'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
            "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor", "UIRepository", "$injector", "irfNavigator","Groups","irfSimpleModal"
        ],

        $pageFn: function ($log, $q, LoanAccount, LoanProcess, Scoring, Enrollment, EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper, formHelper, elementsUtils,
            irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
            BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, $injector, irfNavigator,Groups,irfSimpleModal) {
            var branch = SessionStore.getBranch();
            var podiValue = SessionStore.getGlobalSetting("percentOfDisposableIncome");
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
            var getIncludes = function (model) {
                return [];
            }
            var configFile = function (model) {
                return [
                    
                ]
            }
            var overridesFields = function (model) {
                return {};
            }
            var showDscResponse = function(model,resp){
                if (resp.loanCustomerRelations && resp.loanCustomerRelations.length > 0) {
                    model.loanAccount.loanCustomerRelations = resp.loanCustomerRelations;
                    // model.customer.coapplicants = [];
                    // model.customer.guarantors = [];
                    var i;
                    for (i = 0; i < model.loanAccount.loanCustomerRelations.length; i++) {
                        if (model.loanAccount.loanCustomerRelations[i].relation == 'Applicant') {
                            PageHelper.showLoader();
                            console.log("Model fromDSCCC");
                            console.log(model);
                            (function(index){
                            Enrollment.getCustomerById({ id: model.loanAccount.loanCustomerRelations[i].customerId })
                                .$promise
                                .then(function (res) {
                                    model.customer.applicantname = res.firstName;
                                },
                                    function (httpRes) {
                                        PageHelper.showErrors(httpRes);
                                    })
                                .finally(function () {
                                    PageHelper.hideLoader();
                                })
                            model.customer.applicantid = model.loanAccount.loanCustomerRelations[i].customerId;
                            model.customer.loanAmount = model.loanAccount.loanAmountRequested;
                            model.customer.loanPurpose1 = model.loanAccount.loanPurpose1;
                            model.customer.loanSaved = true;
                            model.customer.dscStatus = model.loanAccount.loanCustomerRelations[index].dscStatus;
                            })(i);
                        }
                        // else if (model.loanAccount.loanCustomerRelations[i].relation == 'Co-Applicant') {
                        //     temp = model.loanAccount.loanCustomerRelations[i].dscStatus;
                        //     (function(index){
                        //     Enrollment.getCustomerById({ id: model.loanAccount.loanCustomerRelations[i].customerId })
                        //         .$promise
                        //         .then(function (res) {
                        //             model.customer.coapplicants.push({
                        //                 "coapplicantid": res.id,
                        //                 "coapplicantname": res.firstName,
                        //                 "loanAmount": model.loanAccount.loanAmountRequested,
                        //                 "loanPurpose1": model.loanAccount.loanPurpose1,
                        //                 "dscStatus": model.loanAccount.loanCustomerRelations[index].dscStatus
                        //             });
                        //             model.customer.loanSaved = true;

                        //         }, function (httpRes) {
                        //             PageHelper.showErrors(httpRes);
                        //         })
                        //         .finally(function () {
                        //             PageHelper.hideLoader();
                        //         })})(i);
                        // }
                        // else if (model.loanAccount.loanCustomerRelations[i].relation == 'Guarantor') {
                        //     (function (index){
                        //     Enrollment.getCustomerById({ id: model.loanAccount.loanCustomerRelations[i].customerId })
                        //         .$promise
                        //         .then(function (res) {
                        //             model.customer.guarantors.push({
                        //                 "guarantorid": res.id,
                        //                 "guarantorname": res.firstName,
                        //                 "loanAmount": model.loanAccount.loanAmountRequested,
                        //                 "loanPurpose1": model.loanAccount.loanPurpose1,
                        //                 "dscStatus": model.loanAccount.loanCustomerRelations[index].dscStatus
                        //             });
                        //             model.customer.loanSaved = true;

                        //         }, function (httpRes) {
                        //             PageHelper.showErrors(httpRes);
                        //         })
                        //         .finally(function () {
                        //             PageHelper.hideLoader();
                        //         })})(i);
                        // }
                    }
                }
                return
            };
            function showDscData(dscId) {
                PageHelper.showLoader();
                Groups.getDSCData({
                    dscId: dscId
                }, function(resp, headers) {
                    PageHelper.hideLoader();
                    var dataHtml = "<table class='table table-striped table-bordered table-responsive'>";
                    // dataHtml += "<tr><td>Response : </td><td>" + resp.response + "</td></tr>";
                    dataHtml += "<tr><td>Response Message: </td><td>" + resp.responseMessage.split('|').slice(1).join('|') + "</td></tr>";
                    // dataHtml += "<tr><td>Stop Response: </td><td>" + resp.stopResponse + "</td></tr>";
                    dataHtml += "</table>"
                    irfSimpleModal('DSC Check Details', dataHtml);
                }, function(res) {
                    PageHelper.showErrors(res);
                    PageHelper.hideLoader();
                });
            };


            return {
                "type": "schema-form",
                "title": "DSC",
                "subTitle": "",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }
                    model.customer = model.customer || {};
                    model.customer.coapplicants = model.customer.coapplicants || [];
                    model.customer.guarantors = model.customer.guarantors || [];
                    model.customer.loanSaved = false;
                    model.customer.cbcheckdone = false;
                    model.customer.dscOverrideRemarks = null;

                    if (_.hasIn(model, "loanProcess")) {
                        var lp = model.loanProcess;
                        model.customer.applicantid = lp.applicantEnrolmentProcess.customer.id;
                        model.customer.applicantname = lp.applicantEnrolmentProcess.customer.firstName;

                        model.coapplicants = [];
                        _.forEach(lp.coApplicantsEnrolmentProcesses, function (ep) {
                            model.coapplicants.push({
                                coapplicantid: ep.customer.id,
                                coapplicantname: ep.customer.firstName
                            });
                        })
                        model.guarantors = [];
                        _.forEach(lp.guarantorsEnrolmentProcesses, function (ep) {
                            model.guarantors.push({
                                guarantorid: ep.customer.id,
                                guarantorname: ep.customer.firstName
                            });
                        })

                        model.customer.loanAmount = lp.loanAccount.loanAmount || lp.loanAccount.loanAmountRequested;
                        model.customer.loanPurpose1 = lp.loanAccount.loanPurpose1;
                        model.customer.loanSaved = true;
                    }

                    if (_.hasIn(model, 'loanAccount')) {
                        if (model.loanAccount.loanCustomerRelations && model.loanAccount.loanCustomerRelations.length > 0) {
                            for (var i = model.loanAccount.loanCustomerRelations.length - 1; i >= 0; i--) {
                                if (model.loanAccount.loanCustomerRelations[i].relation == 'Applicant') {
                                    PageHelper.showLoader();
                                    console.log("Model fromDSCCC");
                                    console.log(model);
                                    Enrollment.getCustomerById({ id: model.loanAccount.loanCustomerRelations[i].customerId })
                                        .$promise
                                        .then(function (res) {
                                            model.customer.applicantname = res.firstName;
                                        },
                                            function (httpRes) {
                                                PageHelper.showErrors(httpRes);
                                            })
                                        .finally(function () {
                                            PageHelper.hideLoader();
                                        })
                                    model.customer.applicantid = model.loanAccount.loanCustomerRelations[i].customerId;
                                    model.customer.loanAmount = model.loanAccount.loanAmountRequested;
                                    model.customer.loanPurpose1 = model.loanAccount.loanPurpose1;
                                    model.customer.loanSaved = true;
                                    model.customer.dscStatus = model.loanAccount.loanCustomerRelations[i].dscStatus;
                                }
                            }
                        }
                    }
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

                    // "new-loan-customer-relation": function(bundleModel,model,params){
                    //     showDscResponse(model,params);
                    // },

                    "new-applicant": function (bundleModel, model, params) {
                        $log.info("Inside new-applicant of DscCheck");
                        model.customer.applicantname = params.customer.firstName;
                        model.customer.applicantid = params.customer.id;
                        model.customer.loanAmount = '';
                        model.customer.loanPurpose1 = '';
                        /* Assign more customer information to show */
                    },
                    "cb-check-done": function(model){
                        $log.info("for cb-check-done");
                    },
                    // "new-co-applicant": function (bundleModel, model, params) {
                    //     $log.info("Insdie new-co-applicant of DscCheck");
                    //     var recordExists = false;
                    //     for (var i = model.customer.coapplicants.length - 1; i >= 0; i--) {
                    //         if (model.customer.coapplicants[i].coapplicantid == params.customer.id)
                    //             recordExists = true;
                    //     }
                    //     if (!recordExists) {
                    //         model.customer.coapplicants.push({
                    //             "coapplicantid": params.customer.id,
                    //             "coapplicantname": params.customer.firstName
                    //         });
                    //     }
                    // },
                    // "new-guarantor": function (bundleModel, model, params) {
                    //     $log.info("Insdie new-guarantor of DscCheck");
                    //     var recordExists = false;
                    //     for (var i = model.customer.guarantors.length - 1; i >= 0; i--) {
                    //         if (model.customer.guarantors[i].guarantorid == params.customer.id)
                    //             recordExists = true;
                    //     }
                    //     if (!recordExists) {
                    //         model.customer.guarantors.push({
                    //             "guarantorid": params.customer.id,
                    //             "guarantorname": params.customer.firstName
                    //         });
                    //     }
                    // },
                    "new-loan": function (bundleModel, model, params) {
                        $log.info("Inside new-loan of DSC handled");
                        model.customer.loanSaved = true;
                        model.customer.loanAmount = params.loanAccount.loanAmountRequested;
                        model.customer.loanPurpose1 = params.loanAccount.loanPurpose1;
                        model.customer.loanId = params.loanAccount.id;
                        for (var i = model.customer.coapplicants.length - 1; i >= 0; i--) {
                            model.customer.coapplicants[i].loanAmount = params.loanAccount.loanAmountRequested;
                            model.customer.coapplicants[i].loanPurpose1 = params.loanAccount.loanPurpose1;
                        }
                        for (var i = model.customer.guarantors.length - 1; i >= 0; i--) {
                            model.customer.guarantors[i].loanAmount = params.loanAccount.loanAmountRequested;
                            model.customer.guarantors[i].loanPurpose1 = params.loanAccount.loanPurpose1;
                        }
                        console.log("model ****from DSCC model2 ");
                        console.log(model);
                    },
                    "remove-customer-relation": function (bundleModel, model, enrolmentDetails) {
                        $log.info("Inside remove-customer-relation of CBCheck");
                        if (enrolmentDetails.customerClass == 'co-applicant') {
                            _.remove(model.customer.coapplicants, function (g) {
                                if (g.coapplicantid == enrolmentDetails.customerId) {
                                    return true;
                                }
                                return false;
                            })
                        } else if (enrolmentDetails.customerClass == 'applicant') {
                            model.customer.applicantname = null;
                            model.customer.applicantid = null;
                        } else if (enrolmentDetails.customerClass == 'guarantor') {
                            _.remove(model.customer.guarantors, function (g) {
                                if (g.guarantorid == enrolmentDetails.customerId) {
                                    return true;
                                }
                                return false;
                            })
                        }
                    }
                },
                form: [
                    {
                        "type": "box",
                        "items": [
                            {
                                "type": "fieldset",
                                "title": "DSC_CHECK",
                                "items": [
                                    {
                                        key: "customer.applicantname",
                                        title: "ApplicantName",
                                        readonly: true,
                                        type: "string",

                                    },{
                                            title: "DSC_STATUS",
                                            key: "customer.dscStatus",
                                            readonly: true,
                                            type: "string",
                                    },
                                    {
                                        key: "customer.coapplicants",
                                        type: "array",
                                        title: ".",
                                        view: "fixed",
                                        notitle: true,
                                        "startEmpty": true,
                                        "add": null,
                                        "remove": null,
                                        items: [{
                                            key: "customer.coapplicants[].coapplicantname",
                                            title: "Co ApplicantName",
                                            readonly: true,
                                            type: "string"
                                        },
                                        {
                                            title: "DSC_STATUS",
                                            key: "customer.coapplicants[].dscStatus",
                                            readonly: true,
                                            type: "string",
                                        },
                                        ]
                                    },
                                    {
                                        key: "customer.guarantors",
                                        type: "array",
                                        title: ".",
                                        view: "fixed",
                                        notitle: true,
                                        "startEmpty": true,
                                        "add": null,
                                        "remove": null,
                                        items: [{
                                            key: "customer.guarantors[].guarantorname",
                                            title: "Guarantor Name",
                                            readonly: true,
                                            type: "string"
                                        },
                                        {
                                            title: "DSC_STATUS",
                                            key: "customer.guarantors[].dscStatus",
                                            readonly: true,
                                            type: "string",
                                        },
                                        ]
                                    },
                                    {
                                        "type": "section",
                                        "condition" : "model.loanAccount.currentStage == 'DSCOverride'",
                                        items: [
                                            {
                                                title: "REMARKS",
                                                key: "customer.dscOverrideRemarks",
                                                type: "textarea",
                                                required: true
                                            },
                                            {
                                                "title": "DSC_OVERRIDE",
                                                "type": "button",
                                                "onClick": "actions.doDscOverride(model,model.loanAccount.id)"
                                            }
                                        ]
                                    },
                                    {
                                        "type": "button",
                                        "condition" : "model.customer.loanSaved && model.loanAccount.currentStage == 'DSCApproval' ",  
                                        "title": "DSC_REQUEST",
                                        "onClick": "actions.getDscDetails(model,model.loanAccount.id)"
                                    },
                                    {
                                        "type": "button",
                                        "title": "VIEW_DSC_RESPONSE",
                                        "icon": "fa fa-eye",
                                        "style": "btn-primary",
                                        "condition":"model.customer.dscStatus && (model.loanAccount.currentStage == 'DSCApproval' || model.loanAccount.currentStage =='RiskReviewAndLoanSanction')",
                                        "onClick": function(model, formCtrl, form, event) {
                                            console.log(form);
                                            console.warn(event);
                                            var i = event['arrayIndex'];
                                            // console.warn("dscid :" + model.group.jlgGroupMembers[i].dscId);
                                            for (var i=0;i<model.loanAccount.loanCustomerRelations.length;i++){
                                                if(model.loanAccount.loanCustomerRelations[i].relation == "Applicant")
                                                    dscId = model.loanAccount.loanCustomerRelations[i].dscId;
                                            }
                                            // var dscId = model.loanAccount.loanCustomerRelations[i].dscId;
                                            showDscData(dscId);
                                        }
                                    }
                                ]
                            }
                        ]
                    },
                ],
                schema: function () {
                    console.log("First thing to excecute I guess");
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {
                    doDscOverride: function (model,loanid) {
                        if (model.customer.dscOverrideRemarks) {
                            irfProgressMessage.pop("dsc-override", "Performing DSC Override");
                            IndividualLoan.overrideAllLCRMemberDsc({
                                customerId: model.loanAccount.customerId,
                                loanId: model.loanAccount.id,
                                remarks: model.customer.dscOverrideRemarks,
                                action: 'approve'
                            }, {}, function (resp, headers) {
                                $log.info(resp);
                                PageHelper.hideLoader();
                                irfProgressMessage.pop("dsc-override", "Override Succeeded", 2000);
                                if(resp && resp.length)
                                {
                                    for(i=0;i<resp.length;i++)
                                    {
                                        model.customer.dscStatus = resp[i].dscStatus;
                                    }
                                }
                                
                                //irfNavigator.goBack();
                            }, function (resp) {
                                $log.error(resp);
                                PageHelper.hideLoader();
                                irfProgressMessage.pop("dsc-override", "An error occurred. Please Try Again", 2000);
                                PageHelper.showErrors(resp);
                            });
                        } else {
                            PageHelper.hideLoader();
                        }
                    },
                    getDscDetails: function (model,loanid) {
                        PageHelper.showLoader();
                        PageHelper.clearErrors();   
                        IndividualLoan.individualLoanDsc({ loanId:loanid
                        },{},function(res) {
                            $log.info(res);
                            PageHelper.hideLoader();       
                            if(res.length > 0){
                                for (i = 0;i<res.length;i++){
                                    if(res[i].dscStatus == "FAILURE"){
                                        irfProgressMessage.pop("dsc-check", "Dsccheck Succeeded", 2000);
                                    }
                                }
                            }
                            irfProgressMessage.pop("dsc-check", "Dsccheck Succeeded", 2000);
                           IndividualLoan.get({id:loanid},{},function(resp){
                               if(resp.loanCustomerRelations && resp.loanCustomerRelations.length > 0){
                                   model.customer.dscStatus = "SUCCESS";
                                   model.loanAccount = resp;
                                    showDscResponse(model,resp);
                                BundleManager.pushEvent('dsc-status',resp.loanCustomerRelations);    
                               }
                           })

                        },function(res) {
                            $log.error(res);
                            PageHelper.hideLoader();
                            irfProgressMessage.pop("dsc-check", "An error occurred. Please Try Again", 2000);
                            PageHelper.showErrors(res);
                        });
                    },
                },
            };

        }
    }
});
