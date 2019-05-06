define(['perdix/domain/model/insurance/InsuranceProcess'], function (InsuranceProcess) {
    InsuranceProcess = InsuranceProcess['InsuranceProcess'];
    return {
        pageUID: "customer360.Insurance",
        pageType: "Engine",
        dependencies: ["$log", "Insurance", "$q", "PageHelper", "$stateParams", "UIRepository", "IrfFormRequestProcessor", "Misc", "Utils", "Queries", "SessionStore","irfNavigator"],
        $pageFn: function ($log, Insurance, $q, PageHelper, $stateParams, UIRepository, IrfFormRequestProcessor, Misc, Utils, Queries, SessionStore,irfNavigator) {

            var globalListkeys = [];
            var getIncludesFromJson = function (params) {};
            var getInsurancePolicyOverrides = function () {

            };
            var getAllIncludesFromJson = function (parentKey, previousKey, object) {
                var thisParentKey = previousKey + parentKey;
                var keys = Object.keys(object);
                if (keys.length <= 0)
                    return;
                for (var i = 0; i < keys.length; i++) {
                    globalListkeys.push(thisParentKey + keys[i]);
                    if (typeof object[keys[i]].items != "undefined") {
                        previousKey = thisParentKey;
                        getAllIncludesFromJson(keys[i] + ".", previousKey, object[keys[i]].items);
                    }
                }
                return;
            };
            var getOverrides = function () {
                return {
                    "InsurancePolicyInformation": {
                        readonly: true
                    },
                    "InsuranceNomineeDetails": {
                        readonly: true
                    },
                    "InsuranceTransactionDetails": {
                        "orderNo": 40,
                        readonly: true
                    },
                    "actionboxBeforeSave": {
                        "orderNo": 60,
                        condition: true,
                        condition: "model.insurancePolicyDetailsDTO.id"
                    },
                    "actionboxBeforeSave.OnlinePrint": {
                        condition: 2==1
                    }
                };
                var overridesObject = {};
                // overridesObject = Object.assign(getInsurancePolicyOverrides(),overridesObject);
                // overridesObject = Object.assign(getInsurancePolicyOverrides(),overridesObject);
                // overridesObject = Object.assign(getInsurancePolicyOverrides(),overridesObject);
                return overridesObject;
            };
            var getExcludes = function () {
                return [
                    "insurancePolicyDetailsDTO",
                    "insurancePolicyDetailsDTO.accountNumber",
                    "insurancePolicyDetailsDTO.accountType",
                    "actionbox",
                    "actionbox.save",
                    "actionboxAfterSave"

                ];
            };
            var getOptions = function () {
                return {
                    "repositoryAdditions": {
                        "insuranceDocuments": {
                            "type": "box",
                            "orderNo": 50,
                            "title": "INSURANCE_DOCUMENTS",
                            "items": {
                                "listOfDocuments": {
                                    "type": "array",
                                    "key": "insurancePolicyDetailsDTO.insuranceDocumentsDTO",
                                    "notitle": "true",
                                    "view": "fixed",
                                    "add": null,
                                    "remove": null,
                                    "items": {
                                        "section": {
                                            "type": "section",
                                            "htmlClass": "row",
                                            "items": {
                                                "documentTitle": {
                                                    "type": "section",
                                                    "htmlClass": "col-sm-6",
                                                    "items": {
                                                        "field": {
                                                            "key": "insurancePolicyDetailsDTO.insuranceDocumentsDTO[].documentCode",
                                                            "notitle": true,
                                                            "titleExpr": "model.insurancePolicyDetailsDTO.insuranceDocumentsDTO[arrayIndex].documentCode",
                                                            "type": "anchor",
                                                            "fieldHtmlClass": "text-bold",
                                                            "onClick": function (model, form, schemaForm, event) {
                                                                var doc = model.insurancePolicyDetailsDTO.insuranceDocumentsDTO[event.arrayIndex];
                                                                // Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=" + doc.documentCode + "&record_id=" + doc.insuranceId)
                                                                Utils.downloadFile(Misc.formDownload({formName:doc.documentCode,recordId:doc.insuranceId}));
                                                            }   
                                                        }
                                                    }
                                                },
                                                "documentFile": {
                                                    "type": "section",
                                                    "htmlClass": "col-sm-6",
                                                    "items": {
                                                        "field": {
                                                            title: "Upload",
                                                            key: "insurancePolicyDetailsDTO.insuranceDocumentsDTO[].fileId",
                                                            type: "file",
                                                            fileType: "application/pdf",
                                                            category: "Loan",
                                                            subCategory: "DOC1",
                                                            "notitle": true,
                                                            using: "scanner",
                                                            required: false
                                                        }
                                                    }

                                                }
                                            }
                                        }
                                    }
                                },
                                "downloadAll": {
                                    "type": "button",
                                    "title": "DOWNLOAD_FORM",
                                    "condition": "model.insurancePolicyDetailsDTO.productCode",
                                    onClick: function (model, form) {
                                        Queries.getInsuranceFormName(model.insurancePolicyDetailsDTO.premiumRateCode).then(function (resp) {
                                            Utils.downloadFile(Misc.formDownload({
                                                formName: resp,
                                                recordId: model.insurancePolicyDetailsDTO.id
                                            }));
                                        }, function (err) {
                                            console.log(err);
                                        })

                                    }
                                },
                            }
                        },
                        "actionboxBeforeSave": {
                            "items": {
                                "partnerSpecifiFix": {
                                    condition: "model.insurancePolicyDetailsDTO.productCode == 'whatever'",
                                    "type": "button",
                                    "title": "Prints",
                                    onClick: function (model, form) {
                                        Queries.getInsuranceFormName(model.insurancePolicyDetailsDTO.premiumRateCode).then(function (resp) {
                                            Utils.downloadFile(Misc.formDownload({
                                                formName: resp,
                                                recordId: model.insurancePolicyDetailsDTO.id
                                            }));
                                        }, function (err) {
                                            console.log(err);
                                        })

                                    }
                                }
                            }
                        }
                    },
                    "additions": {

                    }
                };
            };
            var configFile = function () {

            };
            var getRepositoryAdditions = function () {
                return [
                    "insuranceDocuments",
                    // "insuranceDocuments.downloadAll",

                    // "insuranceDocuments.tempDownloadAll",

                    "insuranceDocuments.listOfDocuments",
                    "insuranceDocuments.listOfDocuments.section",
                    "insuranceDocuments.listOfDocuments.section.documentTitle",
                    "insuranceDocuments.listOfDocuments.section.documentTitle.field",
                    "insuranceDocuments.listOfDocuments.section.documentFile",
                    "insuranceDocuments.listOfDocuments.section.documentFile.field",
                    // "actionboxBeforeSave.partnerSpecifiFix"

                ]
            };
            var getIncludes = function (model) {

                return [
                    "InsurancePolicyInformation",
                    "InsurancePolicyInformation.annuacomelIn",
                    "InsurancePolicyInformation.assetValue",
                    //"InsurancePolicyInformation.source",
                    "InsurancePolicyInformation.bankId",
                    "InsurancePolicyInformation.benificieryFamilyMemberId",
                    "InsurancePolicyInformation.benificieryName",
                    "InsurancePolicyInformation.benificieryRelationship",
                    "InsurancePolicyInformation.branchId",
                    "InsurancePolicyInformation.centreId",
                    "InsurancePolicyInformation.certificateNo",
                    "InsurancePolicyInformation.contactNumber",
                    "InsurancePolicyInformation.currentStage",
                    "InsurancePolicyInformation.customerId",
                    "InsurancePolicyInformation.dateOfBirth",
                    "InsurancePolicyInformation.district",
                    "InsurancePolicyInformation.dscId",
                    "InsurancePolicyInformation.fullName",
                    "InsurancePolicyInformation.gender",
                    "InsurancePolicyInformation.insuranceType",
                    "InsurancePolicyInformation.leadId",
                    "InsurancePolicyInformation.maturityDate",
                    "InsurancePolicyInformation.occupation",
                    "InsurancePolicyInformation.parentPolicyNumber",
                    "InsurancePolicyInformation.partnerCode",
                    "InsurancePolicyInformation.pincode",
                    "InsurancePolicyInformation.policyNumber",
                    "InsurancePolicyInformation.premiumRateCode",
                    "InsurancePolicyInformation.productCode",
                    "InsurancePolicyInformation.purchaseDate",
                    "InsurancePolicyInformation.recommendationAmount",
                    "InsurancePolicyInformation.recommendationOverride",
                    "InsurancePolicyInformation.recommendationRemarks",
                    "InsurancePolicyInformation.remarks",
                    "InsurancePolicyInformation.startDate",
                    "InsurancePolicyInformation.state",
                    "InsurancePolicyInformation.status",
                    "InsurancePolicyInformation.sumInsured",
                    "InsurancePolicyInformation.tenureInYears",
                    "InsurancePolicyInformation.urnNo",
                    "InsurancePolicyInformation.insuranceRecommendations",
                    "InsurancePolicyInformation.recommendationStatus",
                    "InsurancePolicyInformation.question",




                    "InsuranceNomineeDetails",
                    "InsuranceNomineeDetails.nomineeDetailsDTO",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.nomineeName",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.nomineeRelationship",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.nomineeGender",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.nomineeIsMinor",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.nomineeMinorDob",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.gauridianName",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.gauridianMinorRelationship",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.gauridianGender",
                    "InsuranceNomineeDetails.nomineeDetailsDTO.nomineePercentage",

                    "InsuranceTransactionDetails",
                    "InsuranceTransactionDetails.insuranceTransactionDetailsDTO",
                    "InsuranceTransactionDetails.insuranceTransactionDetailsDTO.totalPremium",
                    "validateBiometric",
                    "validateBiometric.validate",
                    "validateBiometric.fpOverrideRequested",
                    "validateBiometric.fpOverrideRemarks",
                    "validateBiometric.fpOverrideStatus",
                    //"InsuranceTransactionDetails.insuranceTransactionDetailsDTO.transactionDate",

                    "actionboxBeforeSave",
                    "actionboxBeforeSave.save",
                    // "actionboxBeforeSave.OnlinePrint"
                    //    "actionboxAfterSave",
                    //    "actionboxAfterSave.OnlinePrint",
                    //    "actionboxAfterSave.Back"
                ];

            }

            return {
                "type": "schema-form",
                "title": "INSURANCE",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    var self = this;
                    var formRequest = {
                        "overrides": getOverrides(),
                        "excludes": getExcludes(),
                        "options": getOptions(),
                    };
                    PageHelper.showLoader();
                    if ($stateParams.pageId) {
                        PageHelper.showLoader();
                        InsuranceProcess.fromInsurancePolicyID($stateParams.pageId)
                            .subscribe(function (insuranceProcess) {

                                model.insuranceProcess = insuranceProcess;
                                model.insurancePolicyDetailsDTO = model.insuranceProcess.insurancePolicyDetailsDTO;
                                Queries.getInsuranceDocuments(model.insurancePolicyDetailsDTO.premiumRateCode).then(function (documents) {
                                    var insuranceDocuments = model.insurancePolicyDetailsDTO.insuranceDocumentsDTO;

                                    for (var i = 0; i < documents.length; i++) {
                                        if (insuranceDocuments.length>0){
                                            var flag = true
                                            for(var j=0;j<insuranceDocuments.length;j++){
                                                if (insuranceDocuments[j].documentCode == documents[i].documentCode){
                                                    flag = false;
                                                    break;
                                                }
                                            }
                                            if (flag){
                                                insuranceDocuments.push({
                                                    "documentCode":documents[i].documentCode,
                                                    "insuranceId":model.insurancePolicyDetailsDTO.id
                                                })
                                            }
                                        } else{
                                            insuranceDocuments.push({
                                                "documentCode":documents[i].documentCode,
                                                "insuranceId":model.insurancePolicyDetailsDTO.id
                                            })
                                        }
                                    }
                                })
                                PageHelper.hideLoader();
                            });
                    };
                    UIRepository.getInsuranceProcessDetails().$promise
                        .then(function (repo) {
                            getAllIncludesFromJson("", "", repo);
                            formRequest.includes = getIncludes(model).concat(getRepositoryAdditions());
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function (form) {
                            console.log(form);
                            self.form = form;
                        });
                },


                form: [],
                schema: function () {
                    return Insurance.getSchema().$promise;
                },
                actions: {
                    OnlinePrint: function (model, formCtrl, form, $event) {
                        if (model.insurancePolicyDetailsDTO.id) {
                            var requestObj = model.insurancePolicyDetailsDTO;
                            var opts = {
                                'centreId': requestObj.centreId,
                                'bankId': requestObj.bankId,
                                'branchId': requestObj.branchId,
                                'branchName': SessionStore.getBranch(),
                                'entityName': 'Dvara KGFS',
                                'benificieryName': requestObj.benificieryName,
                                'insuranceId': requestObj.id,
                                'urnNo': requestObj.urnNo,
                                'sumInsured': requestObj.sumInsured,
                                'premiumCollected': requestObj.insuranceTransactionDetailsDTO[0].totalPremium,
                                'policyNumber': requestObj.policyNumber,
                                'policyType': "PERSONAL ACCIDENT INSURANCE PREMIUM",
                                'company_name': "DVARA Kshetriya Gramin Financial Services Pvt. Ltd.",
                                'cin': 'U74990TN2011PTC081729',
                                'address1': 'IITM Research Park, Phase 1, 10th Floor',
                                'address2': 'Kanagam Village, Taramani',
                                'address3': 'Chennai - 600113, Phone: 91 44 66687000',
                                'website': "https://www.dvarakgfs.com/",
                                'helpline': '18001029370',
                            };

                            var print = {};
                            print.paperReceipt = Insurance.getWebHeader(opts);
                            print.thermalReceipt = Insurance.getThermalHeader(opts);
                            print.paperReceipt = print.paperReceipt + Insurance.getWebFooter(opts);
                            print.thermalReceipt = Insurance.getThermalFooter(opts, print.thermalReceipt);

                            $log.info(print.paperReceipt);
                            $log.info(print.thermalReceipt);

                            //LoanProcess.PrintReceipt(print.thermalReceipt,print.paperReceipt);

                            Utils.confirm("Please Save the data offline,Page will redirected to Print Preview")
                                .then(function () {
                                    irfNavigator.go({
                                        state: "Page.Engine",
                                        pageName: "management.ReceiptPrint",
                                        pageData: print
                                    });
                                });


                        } else {
                            PM.pop('insurance-registration', 'No data available to Print', 5000);
                        }
                    },
                    save: function (model, formCtrl, form, $event) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(formCtrl)) {
                            return false;
                        }
                        var cbsdate = Utils.getCurrentDate();
                        // if (model.insurancePolicyDetailsDTO.startDate && moment(model.insurancePolicyDetailsDTO.startDate, SessionStore.getSystemDateFormat()).diff(cbsdate, "days") < 0) {
                        //     PageHelper.showProgress("insurance-create", "Start  date should be greater than or equal to system date", 5000);
                        //     return false;
                        // }

                        formCtrl.scope.$broadcast('schemaFormValidate');
                        if (formCtrl && formCtrl.$invalid) {
                            PageHelper.showProgress('Insurance', 'Insurance Registration Failed', 5000);
                            return false;
                        }

                        // $q.all start
                        PageHelper.showLoader();

                        // if (!(model.insurancePolicyDetailsDTO.fpOverrideRequested) && !(model.customer.isBiometricValidated)) {
                        //     PageHelper.hideLoader();
                        //     PageHelper.showErrors({
                        //         data: {
                        //             error: "Bio metric validation is required"
                        //         }
                        //     })
                        //     return false;
                        // }


                        model.insuranceProcess.update()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (value) {
                                model.insurancePolicyDetailsDTO = value.insurancePolicyDetailsDTO[0];
                                model.submissionDone = true;
                                idPresent = true;
                                PageHelper.showProgress('Insurance', 'Insurance Registration Saved', 5000);
                            }, function (err) {
                                PageHelper.showProgress('Insurance', 'Insurance Registration Failed', 5000);
                                PageHelper.showErrors(err);
                                PageHelper.hideLoader();
                            });

                    }
                },

            }
        }
    }
})