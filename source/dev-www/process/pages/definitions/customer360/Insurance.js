irf.pageCollection.factory(irf.page("customer360.Insurance"), ["$log", "Insurance", "$q", "PageHelper", "$stateParams", "UIRepository", "IrfFormRequestProcessor", "Misc", "Utils", "Queries","SessionStore",
    function ($log, Insurance, $q, PageHelper, $stateParams, UIRepository, IrfFormRequestProcessor, Misc, Utils, Queries,SessionStore) {

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
                    readonly: true
                },
                "actionboxAfterSave.print":{
                    "condition":"model.insurancePolicyDetailsDTO.productCode != 'IFTLI'"
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
                "actionbox",
                "actionbox.save",
                "actionboxBeforeSave",
                // "actionboxAfterSave",
            ];
        };
        var getOptions = function () {
            return {
                "repositoryAdditions": {
                    "insuranceDocuments": {
                        "type": "box",
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
                                                "htmlClass": "col-sm-3",
                                                "items": {
                                                    "field": {
                                                        "key": "insurancePolicyDetailsDTO.insuranceDocumentsDTO[].documentCode",
                                                        "notitle": true,
                                                        "titleExpr": "model.insurancePolicyDetailsDTO.insuranceDocumentsDTO[arrayIndex].documentCode",
                                                        "type": "anchor",
                                                        "fieldHtmlClass": "text-bold",
                                                        // "onClick": function (model, form, schemaForm, event) {
                                                        //     var doc = model.insurancePolicyDetailsDTO.insuranceDocumentsDTO[event.arrayIndex];
                                                        //     Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=" + doc.documentCode + "&record_id=" + doc.insuranceId)
                                                        //     // Utils.downloadFile(Misc.allFormsDownload());
                                                        // }   
                                                    }
                                                }
                                            },
                                            "documentFile": {
                                                "type": "section",
                                                "htmlClass": "col-sm-3",
                                                "items": {
                                                    "field": {
                                                        title: "Upload",
                                                        key: "insurancePolicyDetailsDTO.insuranceDocumentsDTO[].documentId",
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
                    "actionboxAfterSave":{
                        "items":{
                            "partnerSpecifiFix":{
                                "condition":"model.insurancePolicyDetailsDTO.productCode == 'IFTLI'",
                                 "type":"button",
                                "title":"Print",
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
                "insuranceDocuments.downloadAll",
                
                // "insuranceDocuments.tempDownloadAll",

                "insuranceDocuments.listOfDocuments",
                "insuranceDocuments.listOfDocuments.section",
                "insuranceDocuments.listOfDocuments.section.documentTitle",
                "insuranceDocuments.listOfDocuments.section.documentTitle.field",
                "insuranceDocuments.listOfDocuments.section.documentField.field",
                
            ]
        };

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
                    Insurance.getById({
                        id: $stateParams.pageId
                    }).$promise.then(function (resp) {
                        model.insurancePolicyDetailsDTO = resp;
                        Queries.getInsuranceDocuments(model.insurancePolicyDetailsDTO.premiumRateCode).then(function(documents){
                            var insuranceDocuments = model.insurancePolicyDetailsDTO.insuranceDocuments;
                            for (var i = 0; i < loanDocuments.length; i++) {
                                availableDocCodes.push(insuranceDocuments[i]);
                            }
                            for (var i = 0; i < documents.length; i++) {
                                if (_.indexOf(availableDocCodes, documents[i].document_code) == -1) {
                                    insuranceDocuments.push(documents[i])
                                }
                            }

                        })
                        PageHelper.hideLoader();
                    });
                };
                UIRepository.getInsuranceProcessDetails().$promise
                    .then(function (repo) {
                        getAllIncludesFromJson("", "", repo);
                        formRequest.includes = globalListkeys.concat(getRepositoryAdditions());
                        return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                    })
                    .then(function (form) {
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
                            'entityName': SessionStore.getBankName(),
                            'benificieryName': requestObj.benificieryName,
                            'insuranceId': requestObj.id,
                            'urnNo': requestObj.urnNo,
                            'sumInsured': requestObj.sumInsured,
                            'premiumCollected': requestObj.insuranceTransactionDetailsDTO[0].totalPremium,
                            'policyNumber': requestObj.policyNumber,
                            'policyType': "PERSONAL ACCIDENT INSURANCE PREMIUM",
                            'company_name': "IFMR Rural Channels and Services Pvt. Ltd.",
                            'cin': 'U74990TN2011PTC081729',
                            'address1': 'IITM Research Park, Phase 1, 10th Floor',
                            'address2': 'Kanagam Village, Taramani',
                            'address3': 'Chennai - 600113, Phone: 91 44 66687000',
                            'website': "http://ruralchannels.ifmr.co.in/",
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
            },

        }
    }
])
