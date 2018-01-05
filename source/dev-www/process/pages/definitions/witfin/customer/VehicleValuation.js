define(
    [
        "perdix/domain/model/loan/LoanProcess",
        "perdix/infra/helpers/NGHelper",
    ],
    function (LoanProcess, NGHelper) {
        LoanProcess = LoanProcess["LoanProcess"];
        NGHelper = NGHelper["NGHelper"];
        return {
            pageUID: "witfin.customer.VehicleValuation",
            pageType: "Engine",
            dependencies: ["$log", "$q", "LoanAccount", 'Scoring', 'Enrollment', 'EnrollmentHelper', 'AuthTokenHelper', 'SchemaResource', 'PageHelper', 'formHelper', "elementsUtils",
                'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
                "BundleManager", "PsychometricTestService", "LeadHelper", "Message", "$filter", "Psychometric", "IrfFormRequestProcessor", "UIRepository", "irfNavigator"],

            $pageFn: function ($log, $q, LoanAccount, Scoring, Enrollment, EnrollmentHelper, AuthTokenHelper, SchemaResource, PageHelper, formHelper, elementsUtils,
                               irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan,
                               BundleManager, PsychometricTestService, LeadHelper, Message, $filter, Psychometric, IrfFormRequestProcessor, UIRepository, irfNavigator) {
                var self;
                var getIncludes = function (model) {

                    return [
                        "VehiclePrimaryInfo",
                        "VehiclePrimaryInfo.registrationNumber",
                        "VehiclePrimaryInfo.firstName",
                        "VehiclePrimaryInfo.mobileNo",
                        "VehiclePrimaryInfo.AlternatemobileNo",
                        "VehicleValuationPriliminaryInformation",
                        "VehicleValuationPriliminaryInformation.valuationPurpose",
                        "VehicleValuationPriliminaryInformation.valuationDate",
                        "VehicleValuationPriliminaryInformation.valuationPlace",
                        "VehicleValuationPriliminaryInformation.registeredOwnerName",
                        "VehicleValuationPriliminaryInformation.proposedOwnerName",
                        "VehicleValuationPriliminaryInformation.bankReferenceNumber",
                        "VehicleInspectionDetails",
                        "VehicleInspectionDetails.firstName",
                        "VehicleInspectionDetails.inspectionDate",
                        "VehicleInspectionDetails.inspectedBy",
                        "VehicleInspectionDetails.vehicleMoved",
                        "VehicleInspectionDetails.inspectionLatitude",
                        "VehicleInspectionDetails.inspectionAltitude",
                        "VehicleInspectionDetails.engineStarted",
                        "VehicleIdentityDetails",
                        "VehicleIdentityDetails.make",
                        "VehicleIdentityDetails.variant",
                        "VehicleIdentityDetails.colour",
                        "VehicleIdentityDetails.trailer",
                        "VehicleIdentityDetails.chasisNo",
                        "VehicleIdentityDetails.engineNo",
                        "VehicleIdentityDetails.odometerReading",
                        "VehicleIdentityDetails.estimatedReading",
                        "VehicleIdentityDetails.transmission",
                        "VehicleIdentityDetails.odometer",
                        "VehicleIdentityDetails.usedFor",
                        "VehicleRegistrationDetails",
                        "VehicleRegistrationDetails.reRegistered",
                        "VehicleRegistrationDetails.previousRegistrationNumber",
                        "VehicleRegistrationDetails.registrationAsPerRcbook",
                        "VehicleRegistrationDetails.registrationAsPerActual",
                        "VehicleRegistrationDetails.numberPlateColour",
                        "VehicleRegistrationDetails.registeredownersname",
                        "VehicleRegistrationDetails.engineNo",
                        "VehicleRegistrationDetails.registeredAddress",
                        "VehicleRegistrationDetails.ownerSerialNo",
                        "VehicleRegistrationDetails.registrationDate",
                        "VehicleRegistrationDetails.vehicleClass",
                        "VehicleRegistrationDetails.bodyType",
                        "VehicleRegistrationDetails.fuelUsed",
                        "VehicleRegistrationDetails.cubicCapacity",
                        "VehicleRegistrationDetails.makersClassification",
                        "VehicleRegistrationDetails.seatingCapacity",
                        "VehicleRegistrationDetails.unladenWeight",
                        "VehicleRegistrationDetails.hypothecatedTo",
                        "VehicleRegistrationDetails.fitnesscertifiedUpto",
                        "VehiclePermitAndTaxDetails",
                        "VehiclePermitAndTaxDetails.permitStatus",
                        "VehiclePermitAndTaxDetails.permitValidUpto",
                        "VehiclePermitAndTaxDetails.operationroute",
                        "VehiclePermitAndTaxDetails.taxPaid",
                        "VehiclePermitAndTaxDetails.taxValidUpto",
                        "VehicleInsuranceDetails",
                        "VehicleInsuranceDetails.insuranceCompany",
                        "VehicleInsuranceDetails.insurancePolicyNumber",
                        "VehicleInsuranceDetails.insuranceIdv",
                        "VehicleInsuranceDetails.taxPaid",
                        "VehicleInsuranceDetails.insurancevalidfrom",
                        "VehicleInsuranceDetails.insuranceValidTo",
                        "VehicleInsuranceDetails.insurancePolicyType",
                        "VehicleOtherRemarks",
                        "VehicleOtherRemarks.modelUnderProduction",
                        "VehicleOtherRemarks.accident",
                        "VehicleOtherRemarks.originalInvoiceValue",
                        "VehicleOtherRemarks.accidentRemarks",
                        "VehicleOtherRemarks.majorRepair",
                        "VehicleOtherRemarks.currentInvoiceValue",
                        "VehicleOtherRemarks.rcbookStatus",
                        "VehiclePastValuations",
                        "VehiclePastValuations.vehiclePastValuations",
                        "VehiclePastValuations.vehiclePastValuations.financier",
                        "VehiclePastValuations.vehiclePastValuations.valuationDate",
                        "VehiclePastValuations.vehiclePastValuations.valuation",
                        "VehicleAsset",
                        "VehicleAsset.vehicleAssetConditions",
                        "VehicleAsset.vehicleAssetConditions.componentType",
                        "VehicleAsset.vehicleAssetConditions.componentCondition",
                        "VehicleAsset.vehicleAssetConditions.componentRemarks",
                        "VehicleAccessories",
                        "VehicleAccessories.vehicleAccessories",
                        "VehicleAccessories.vehicleAccessories.accessoryType",
                        "VehicleAccessories.vehicleAccessories.accessoryStatus",
                        "VehicleAccessories.vehicleAccessories.accessoryAvailable",
                        "VehicleValuation",
                        "VehicleValuation.valuationRating",
                        "VehicleValuation.futureLife",
                        "VehicleValuation.currentMarketValue",
                        "VehicleValuation.distressValue",
                        "VehiclePhotoCaptures",
                        "VehiclePhotoCaptures.vehiclePhotoCaptures",
                        "VehiclePhotoCaptures.vehiclePhotoCaptures.photoFileId",
                        "VehiclePhotoCaptures.vehiclePhotoCaptures.photoRemarks",
                        "actionbox",
                        "actionbox.save"
                    ];
                }
                return {
                    "type": "schema-form",
                    "title": "VEHICLE_VALUATION",
                    "subTitle": "BUSINESS",
                    initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {

                        self = this;
                        PageHelper.showLoader();
                        LoanProcess.get($stateParams.pageId)
                        .finally(function() {
                            PageHelper.hideLoader();
                        })
                        .subscribe(function(data) {
                            model.loanProcess = data;
                            model.loanAccount = data.loanAccount;
                                var formRequest = {
                                    "overrides": "",
                                    "includes": getIncludes(model),
                                    "excludes": [
                                        ""
                                    ],
                                    "options": {
                                        "additions": [
                                            {
                                                "targetID": "actionbox",
                                                "items": [
                                                    {
                                                        "type": "button",
                                                        "title": "PROCEED",
                                                        "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                };

                            var p1 = UIRepository.getLoanProcessUIRepository().$promise;;
                            p1.then(function(repo) {
                                self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, null, model);
                                // NGHelper.refreshUI();
                            })
                        }, function(err) {
                            console.log(err);
                            PageHelper.hideLoader();
                        })


                        // LoanProcess.get($stateParams.pageId)
                        //     .toPromise()
                        //     .then(function(loanProcess){
                        //         model.loanProcess = loanProcess;
                        //         model.loanAccount = loanProcess.loanAccount;
                        //         return model;
                        //     }, function(err){

                        //     })
                        //     .then(function(){
                        //         return UIRepository.getLoanProcessUIRepository().$promise;
                        //     })
                        //     .then(function(repo){
                        //         var formRequest = {
                        //             "overrides": "",
                        //             "includes": getIncludes(model),
                        //             "excludes": [
                        //                 ""
                        //             ],
                        //             "options": {
                        //                 "additions": [
                        //                     {
                        //                         "targetID": "actionbox",
                        //                         "items": [
                        //                             {
                        //                                 "type": "button",
                        //                                 "title": "PROCEED",
                        //                                 "onClick": "actions.proceed(model, formCtrl, form, $event)"
                        //                             }
                        //                         ]
                        //                     }
                        //                 ]
                        //             }
                        //         };
                        //         self.form = IrfFormRequestProcessor.getFormDefinition(repo, formRequest, null, model);
                        //         NGHelper.refreshUI();
                        //     });
                    },
                    offline: false,
                    getOfflineDisplayItem: function (item, index) {
                        return [
                            item.customer.firstName,
                            item.customer.centreCode,
                            item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                        ]
                    },
                    eventListeners: {},
                    form: [],
                    schema: function () {
                        return SchemaResource.getLoanAccountSchema().$promise;
                    },
                    actions: {
                        save: function(model, formCtrl, form, $event){
                            if(PageHelper.isFormInvalid(formCtrl)) {
                                return false;
                            }
                            PageHelper.showProgress('loan-process', 'Updating Loan');
                            model.loanProcess.save()
                                .finally(function () {
                                    PageHelper.hideLoader();
                                })
                                .subscribe(function (value) {
                                    // Utils.removeNulls(value, true);
                                    PageHelper.showProgress('loan-process', 'Loan Saved.', 5000);
                                }, function (err) {
                                    PageHelper.showProgress('loan-process', 'Oops. Some error.', 5000);
                                    PageHelper.showErrors(err);
                                    PageHelper.hideLoader();
                                });
                        },
                        proceed: function(model, formCtrl, form, $event){
                            if(PageHelper.isFormInvalid(formCtrl)) {
                                return false;
                            }
                            PageHelper.showLoader();
                            PageHelper.showProgress('loan-process', 'Updating Loan');
                            model.loanProcess.proceed()
                                .finally(function () {
                                    PageHelper.hideLoader();
                                })
                                .subscribe(function (value) {
                                    // Utils.removeNulls(value, true);
                                    PageHelper.showProgress('loan-process', 'Done.', 5000);
                                    irfNavigator.go({
                                        state: "Page.Engine",
                                        pageName: "witfin.lead.ReadyForScreeningQueue"
                                    });
                                }, function (err) {
                                    PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                    PageHelper.showErrors(err);
                                    PageHelper.hideLoader();
                                });

                        }
                    }
                };

            }

        }
    });
