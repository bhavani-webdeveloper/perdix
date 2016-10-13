irf.pageCollection.factory(irf.page("customer360.loans.LoanDetails"), ["$log", "SessionStore", "LoanAccount", "$state", "$stateParams", "SchemaResource", "PageHelper", "Enrollment", "formHelper", "IndividualLoan", "Utils", "$filter", "$q", "irfProgressMessage", "Queries", "Files", "LoanBookingCommons",
    function($log, SessionStore, LoanAccount, $state, $stateParams, SchemaResource, PageHelper, Enrollment, formHelper, IndividualLoan, Utils, $filter, $q, irfProgressMessage, Queries, Files, LoanBookingCommons) {

        return {
            "type": "schema-form",
            "title": "Loan Details",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                var loanAccountId = $stateParams.pageId;
                model.loanAccount = model.loanAccount || [];
                model.loanDocuments = model.loanDocuments || {};
                model.loanDocuments.existingDocuments = model.loanDocuments.existingDocuments || [];
                model.loanDocuments = model.loanDocuments || {};
                model.loanDocuments.newLoanDocuments = model.loanDocuments.newLoanDocuments || [];
                model.reqData = model.reqData || {};
                model.reqData.loanAccount = model.reqData.loanAccount || {};
                model.reqData.loanAccount.loanDocuments = model.reqData.loanAccount.loanDocuments || [];
                PageHelper.showLoader();
                IndividualLoan.get({
                        id: loanAccountId
                    })
                    .$promise
                    .then(function(res) {
                        model.loanAccount = res;

                        if (_.hasIn(model.loanAccount, 'accountNumber') && !_.isNull(model.loanAccount.accountNumber)) {
                            LoanAccount.get({
                                    accountId: model.loanAccount.accountNumber
                                })
                                .$promise
                                .then(
                                    function(res) {
                                        model.encoreLoan = res;

                                        for (var i = 0; i < model.encoreLoan.transactions.length; i++) {
                                            model.encoreLoan.transactions[i].transactionDate = Utils.convertJSONTimestampToDate(model.encoreLoan.transactions[i].transactionDate);
                                        }
                                        for (var i = 0; i < model.encoreLoan.repaymentSchedule.length; i++) {
                                            model.encoreLoan.repaymentSchedule[i].valueDate = Utils.convertJSONTimestampToDate(model.encoreLoan.repaymentSchedule[i].valueDate);
                                        }
                                        var loanDocuments = model.loanAccount.loanDocuments;
                                        var availableDocCodes = [];
                                        LoanBookingCommons.getDocsForProduct(model.encoreLoan.productCode, "LoanBooking", "DocumentUpload").then(function(docsForProduct) {
                                        $log.info(docsForProduct);
                                        for (var i = 0; i < loanDocuments.length; i++) {
                                            availableDocCodes.push(loanDocuments[i].document);
                                            var documentObj = LoanBookingCommons.getDocumentDetails(docsForProduct, loanDocuments[i].document);
                                            if (documentObj != null) {
                                                loanDocuments[i].document = documentObj.document_name;
                                            } else {
                                                loanDocuments[i].document = "DOCUMENT_TITLE_NOT_MAINTAINED";
                                            }
                                        }
                                        PageHelper.hideLoader();
                                        },
                                        function(httpRes) {
                                            PageHelper.hideLoader();
                                        });
                                    },
                                    function(httpRes) {
                                        PageHelper.showErrors(httpRes);
                                    }

                                )
                                .finally(function() {
                                    PageHelper.hideLoader();
                                })
                        }
                        
                        if (model.loanAccount.loanDocuments) {
                            for (var i = 0; i < model.loanAccount.loanDocuments.length; i++) {

                                model.loanDocuments.existingDocuments.push(model.loanAccount.loanDocuments[i]);
                            }
                        }
                    })

            },
            form: [{
                "type": "box",
                "title": "LOAN_DETAILS",
                "colClass": "col-sm-6",
                "readonly": true,
                "items": [{
                    "type": "fieldset",
                    "title": "BRANCH_DETAILS",
                    "items": [{
                        key: "loanAccount.loanCentre.centreId",
                        title: "CENTRE_NAME",
                        "type": "select",
                        enumCode: "centre"
                    }, {
                        "key": "loanAccount.partnerCode",
                        "title": "PARTNER",
                        "type": "select"
                    }]
                }, {
                    "type": "fieldset",
                    "title": "PRODUCT_DETAILS",
                    "items": [{
                        "key": "loanAccount.id",
                        "title": "LOAN_ID",
                        "condition": "model.loanAccount.id",
                        "readonly": true
                    }, {
                        "key": "loanAccount.productCode",
                        "title": "PRODUCT",
                        "type": "select"
                    }, {
                        "key": "loanAccount.tenure",
                        "title": "DURATION_IN_MONTHS"
                    }, {
                        "key": "loanAccount.frequency",
                        "type": "select"
                    }]
                }, {
                    "type": "fieldset",
                    "title": "ENTITY_DETAILS",
                    "items": [{
                        "key": "loanAccount.urnNo",
                        "title": "URN_NO",
                        "type": "lov",
                        "lovonly": true,
                        "inputMap": {
                            "customerType": {
                                "key": "customer.customerType",
                                "title": "CUSTOMER_TYPE",
                                "type": "select",
                                "titleMap": {
                                    "Individual": "Individual",
                                    "Enterprise": "Enterprise"
                                }
                            },
                            "customerId": {
                                "key": "customer.customerId",
                                "title": "CUSTOMER_ID"
                            },
                            "firstName": {
                                "key": "customer.firstName",
                                "title": "CUSTOMER_NAME"
                            },
                            "branch": {
                                "key": "customer.branch",
                                "type": "select",
                                "screenFilter": true
                            },
                            "centreCode": {
                                "key": "customer.centreCode",
                                "type": "select",
                                "screenFilter": true
                            }
                        },
                        "outputMap": {
                            "id": "loanAccount.customerId",
                            "urnNo": "loanAccount.urnNo",
                            "firstName": "customer.firstName",

                        },
                        "searchHelper": formHelper,
                        initialize: function(inputModel) {
                            $log.warn('in pincode initialize');
                            $log.info(inputModel);
                        },
                        "search": function(inputModel, form, model) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var promise = Enrollment.search({
                                'customerId': inputModel.customerId,
                                'branchName': inputModel.branch || SessionStore.getBranch(),
                                'firstName': inputModel.firstName,
                                'centreCode': inputModel.centreCode,
                                'customerType': inputModel.customerType,
                                'stage': "Completed"
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                data.firstName,
                                data.id,
                                data.urnNo
                            ];
                        },
                        onSelect: function(result, model, context) {
                            $log.info(result);
                            var promise = Queries.getCustomerBankAccounts(
                                result.id
                            ).then(function(response) {
                                if (response && response.body && response.body.length) {
                                    for (var i = response.body.length - 1; i >= 0; i--) {
                                        if (response.body[i].is_disbersement_account == 1) {
                                            model.loanAccount.customerBankAccountNumber = response.body[i].account_number;
                                            model.loanAccount.customerBankIfscCode = response.body[i].ifsc_code;
                                            model.loanAccount.customerBank = response.body[i].customer_bank_name;
                                            model.loanAccount.customerBranch = response.body[i].customer_bank_branch_name;
                                            break;
                                        }
                                    }
                                }
                            });
                        }
                    }, {
                        "key": "loanAccount.customerId",
                        "title": "ENTITY_ID",
                        "readonly": true
                    }, {
                        "key": "customer.firstName",
                        "title": "ENTITY_NAME",
                        "readonly": true
                    }, {
                        "key": "loanAccount.applicant",
                        "title": "APPLICANT_URN_NO",
                        "type": "lov",
                        "lovonly": true,
                        "inputMap": {
                            "customerId": {
                                "key": "customer.customerId",
                                "title": "CUSTOMER_ID"
                            },
                            "firstName": {
                                "key": "customer.firstName",
                                "title": "CUSTOMER_NAME"
                            },
                            "branch": {
                                "key": "customer.branch",
                                "type": "select",
                                "screenFilter": true
                            },
                            "centreCode": {
                                "key": "customer.centreCode",
                                "type": "select",
                                "screenFilter": true
                            }
                        },
                        "outputMap": {
                            "urnNo": "loanAccount.applicant",
                            "firstName": "customer.applicantName"
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var promise = Enrollment.search({
                                'customerId': inputModel.customerId,
                                'branchName': inputModel.branch || SessionStore.getBranch(),
                                'firstName': inputModel.firstName,
                                'centreCode': inputModel.centreCode,
                                'customerType': "individual",
                                'stage': "Completed"
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                [data.firstName, data.fatherFirstName].join(' | '),
                                data.id,
                                data.urnNo
                            ];
                        }
                    }, {
                        "key": "customer.applicantName",
                        "title": "APPLICANT_NAME",
                        "readonly": true
                    }, {
                        "key": "loanAccount.coBorrowerUrnNo",
                        "title": "CO_APPLICANT_URN_NO",
                        "type": "lov",
                        "lovonly": true,
                        "inputMap": {
                            "customerId": {
                                "key": "customer.customerId",
                                "title": "CUSTOMER_ID"
                            },
                            "firstName": {
                                "key": "customer.firstName",
                                "title": "CUSTOMER_NAME"
                            },
                            "branch": {
                                "key": "customer.branch",
                                "type": "select",
                                "screenFilter": true
                            },
                            "centreCode": {
                                "key": "customer.centreCode",
                                "type": "select",
                                "screenFilter": true
                            }
                        },
                        "outputMap": {
                            "urnNo": "loanAccount.coBorrowerUrnNo",
                            "firstName": "customer.coBorrowerName"
                        },
                        "searchHelper": formHelper,
                        "search": function(inputModel, form) {
                            $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                            var promise = Enrollment.search({
                                'customerId': inputModel.customerId,
                                'branchName': inputModel.branch || SessionStore.getBranch(),
                                'firstName': inputModel.firstName,
                                'centreCode': inputModel.centreCode,
                                'customerType': "individual",
                                'stage': "Completed"
                            }).$promise;
                            return promise;
                        },
                        getListDisplayItem: function(data, index) {
                            return [
                                [data.firstName, data.fatherFirstName].join(' | '),
                                data.id,
                                data.urnNo
                            ];
                        }
                    }, {
                        "key": "customer.coBorrowerName",
                        "title": "COAPPLICANT_NAME",
                        "readonly": true
                    }]
                }, {
                    "type": "fieldset",
                    "title": "Account Details",
                    "items": [{
                            "key": "loanAccount.loanAmountRequested",
                            "type": "amount",
                            "title": "LOAN_AMOUNT_REQUESTED",
                            "onChange": function(value, form, model) {
                                model.loanAccount.insuranceFee = 0.004 * value;
                                getSanctionedAmount(model);
                            }
                        }, {
                            key: "loanAccount.insuranceFee",
                            type: "amount",
                            onChange: function(value, form, model) {
                                getSanctionedAmount(model);
                            }
                        }, {
                            key: "loanAccount.commercialCibilCharge",
                            type: "amount",
                            onChange: function(value, form, model) {
                                getSanctionedAmount(model);
                            }
                        }, {
                            key: "loanAccount.securityEmi",
                            type: "amount",
                            onChange: function(value, form, model) {
                                getSanctionedAmount(model);
                            }
                        }, {
                            key: "loanAccount.processingFeeInPaisa",
                            type: "amount"
                        }, {
                            key: "loanAccount.otherFee",
                            type: "amount"
                        }, {
                            "key": "additional.loanAmount",
                            "type": "amount",
                            "title": "NET_DISBURSEMENT_AMOUNT"
                        }, {
                            "key": "loanAccount.interestRate",
                            "type": "number"
                        }, {
                            "key": "loanAccount.loanApplicationDate",
                            "title": "LOAN_APPLICATION_DATE",
                            "type": "date"
                        }, {
                            "key": "loanAccount.loanPurpose1",
                            "title": "LOAN_PURPOSE",
                            "type": "select"
                        }
                        /*,
                                                             {
                                                             "key": "loanAccount.loanPurpose2",
                                                             "title": "LOAN_PURPOSE_2",
                                                             "type":"select",
                                                             "filter":{
                                                             "parentCode as loan_purpose_1":"model.loanAccount.loanPurpose1"
                                                             }
                                                             },
                                                             {
                                                             "key": "loanAccount.loanPurpose3",
                                                             "title": "LOAN_PURPOSE_3",
                                                             "type":"select",
                                                             "filter":{
                                                             "parentCode as loan_purpose_2":"model.loanAccount.loanPurpose2"
                                                             }
                                                             }*/
                    ]
                }]
            }, {
                "type": "box",
                "title": "TRANSACTIONS",
                "readonly": true,
                "items": [{
                    "type": "array",
                    "title": "Disbursement Details",
                    "titleExpr": "'Transaction on ' + model.encoreLoan.transactions[arrayIndex].transactionDate",
                    "key": "encoreLoan.transactions",
                    "items": [{
                        "key": "encoreLoan.accountId",
                        "type": "string"
                    }, {
                        "key": "encoreLoan.transactions[].transactionDate",
                        "type": "date"
                    }, {
                        "key": "encoreLoan.transactions[].valueDate",
                        "type": "date"
                    }, {
                        "key": "encoreLoan.transactions[].amount1",
                        "type": "string"
                    }, {
                        "key": "encoreLoan.transactions[].part1",
                        "type": "string"
                    }, {
                        "key": "encoreLoan.transactions[].part2",
                        "type": "string"
                    }, {
                        "key": "encoreLoan.transactions[].part3",
                        "type": "string"
                    }, {
                        "key": "encoreLoan.transactions[].transactionId",
                        "type": "string"
                    }]
                }]
            }, {
                "type": "box",
                "title": "REPAYMENT_SCHEDULE",
                "readonly": true,
                "items": [{
                    "type": "array",
                    "titleExpr": "'Date : ' + model.encoreLoan.repaymentSchedule[arrayIndex].valueDate",
                    "key": "encoreLoan.repaymentSchedule",
                    "items": [{
                        "key": "encoreLoan.repaymentSchedule[].transactionDate",
                        "type": "date"
                    }, {
                        "key": "encoreLoan.repaymentSchedule[].amount1",
                        "type": "string"
                    }, {
                        "key": "encoreLoan.repaymentSchedule[].amount2",
                        "type": "string"
                    }, {
                        "key": "encoreLoan.repaymentSchedule[].valueDate",
                        "type": "date"
                    }, {
                        "key": "encoreLoan.repaymentSchedule[].transactionId",
                        "type": "string"
                    }, {
                        "key": "encoreLoan.repaymentSchedule[].status",
                        "type": "string"
                    }]
                }]
            }, {
                "type": "box",
                "title": "DISBURSEMENT_DETAILS",
                readonly: true,
                "items": [{
                    "type": "fieldset",
                    "title": "Disbursement Details",
                    "items": [{
                        key: "loanAccount.sanctionDate",
                        type: "date",
                        title: "SANCTION_DATE"
                    }, {
                        key: "loanAccount.numberOfDisbursements",
                        title: "NUM_OF_DISBURSEMENTS",
                        onChange: function(value, form, model) {
                            $log.info(value);
                            $log.info(model);

                            model.loanAccount.disbursementSchedules = [];
                            for (var i = 0; i < value; i++) {
                                model.loanAccount.disbursementSchedules.push({
                                    trancheNumber: "" + (i + 1),
                                    disbursementAmount: 0
                                });
                            }
                        }
                    }, {
                        key: "loanAccount.customerBankAccountNumber",
                        type: "lov",
                        autolov: true,
                        title: "CUSTOMER_BANK_ACC_NO",
                        bindMap: {
                            "customerId": "loanAccount.customerId"
                        },
                        outputMap: {
                            "account_number": "loanAccount.customerBankAccountNumber",
                            "ifsc_code": "loanAccount.customerBankIfscCode",
                            "customer_bank_name": "loanAccount.customerBank",
                            "customer_bank_branch_name": "loanAccount.customerBranch"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            return Queries.getCustomerBankAccounts(
                                inputModel.customerId
                            );
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.account_number + (item.is_disbersement_account == 1 ? '&nbsp;&nbsp;<span class="color-theme"><i class="fa fa-check-square">&nbsp;</i>{{"DEFAULT_DISB_ACCOUNT"|translate}}</span>' : ''),
                                item.ifsc_code + ', ' + item.customer_bank_name,
                                item.customer_bank_branch_name
                            ];
                        }
                    }, {
                        key: "loanAccount.customerBankIfscCode",
                        title: "CUSTOMER_BANK_IFSC",
                        "readonly": true
                    }, {
                        key: "loanAccount.customerBank",
                        title: "CUSTOMER_BANK",
                        "readonly": true
                    }, {
                        key: "loanAccount.customerBranch",
                        title: "BRANCH_NAME",
                        "readonly": true
                    }, {
                        key: "loanAccount.disbursementSchedules",
                        title: "DISBURSEMENT_SCHEDULES",
                        add: null,
                        remove: null,
                        items: [{
                            key: "loanAccount.disbursementSchedules[].trancheNumber",
                            title: "TRANCHE_NUMBER",
                            readonly: true
                        }, {
                            key: "loanAccount.disbursementSchedules[].disbursementAmount",
                            title: "DISBURSEMENT_AMOUNT",
                            type: "amount"
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "title": "COLLATERAL",
                "readonly": true,
                "items": [{
                    "key": "loanAccount.collateral",
                    "title": "COLLATERAL",
                    "type": "array",
                    "items": [{
                        "key": "loanAccount.collateral[].collateralType",
                        "type": "select"
                    }, {
                        "key": "loanAccount.collateral[].collateralDescription"
                    }, {
                        "key": "loanAccount.collateral[].manufacturer"
                    }, {
                        "key": "loanAccount.collateral[].quantity",
                        "onChange": function(value, form, model, event) {
                            calculateTotalValue(value, form, model);
                        }
                    }, {
                        "key": "loanAccount.collateral[].modelNo"
                    }, {
                        "key": "loanAccount.collateral[].machineOld"
                    }, {
                        "key": "loanAccount.collateral[].collateralValue",
                        "type": "amount",
                        "title": "COLLATERAL_VALUE",
                        "onChange": function(value, form, model, event) {
                            calculateTotalValue(value, form, model);
                        }
                    }, {
                        "key": "loanAccount.collateral[].totalValue",
                        "type": "amount",
                        "title": "TOTAL_VALUE"
                    }, {
                        "key": "loanAccount.collateral[].marginValue",
                        "type": "amount",
                        "title": "PURCHASE_PRICE"
                    }, {
                        "key": "loanAccount.collateral[].loanToValue",
                        "type": "amount",
                        "title": "PRESENT_VALUE"
                    }, {
                        "key": "loanAccount.collateral[].collateral1FilePath",
                        "type": "file",
                        "title": "DOCUMENT_1"
                    }, {
                        "key": "loanAccount.collateral[].collateral2FilePath",
                        "type": "file",
                        "title": "DOCUMENT_2"
                    }, {
                        "key": "loanAccount.collateral[].collateral3FilePath",
                        "type": "file",
                        "title": "DOCUMENT_3"
                    }, {
                        "key": "loanAccount.collateral[].photoFilePath",
                        "type": "file",
                        "fileType": "image/*",
                        "title": "PHOTO"
                    }]
                }]
            }, {
                "type": "box",
                "title": "GUARANTOR_NOMINEE_DETAILS",
                readonly: true,
                "items": [{
                    "type": "fieldset",
                    "title": "GUARANTOR",
                    "items": [{
                        key: "loanAccount.guarantors",
                        notitle: "true",
                        view: "fixed",
                        type: "array",
                        add: null,
                        remove: null,
                        items: [{
                            "key": "loanAccount.guarantors[].guaUrnNo",
                            "title": "URN_NO",
                            "type": "lov",
                            "lovonly": true,
                            "inputMap": {
                                "customerId": {
                                    "key": "customer.customerId",
                                    "title": "CUSTOMER_ID"
                                },
                                "firstName": {
                                    "key": "customer.firstName",
                                    "title": "CUSTOMER_NAME"
                                },
                                "branch": {
                                    "key": "customer.branch",
                                    "type": "select",
                                    "screenFilter": true
                                },
                                "centreCode": {
                                    "key": "customer.centreCode",
                                    "type": "select",
                                    "screenFilter": true
                                }
                            },
                            "outputMap": {
                                "urnNo": "loanAccount.guarantors[arrayIndex].guaUrnNo",
                                "firstName": "loanAccount.guarantors[arrayIndex].guaFirstName"
                            },
                            "searchHelper": formHelper,
                            "search": function(inputModel, form) {
                                $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                var promise = Enrollment.search({
                                    'customerId': inputModel.customerId,
                                    'branchName': inputModel.branch || SessionStore.getBranch(),
                                    'firstName': inputModel.firstName,
                                    'centreCode': inputModel.centreCode,
                                    'customerType': "individual",
                                    'stage': "Completed"
                                }).$promise;
                                return promise;
                            },
                            getListDisplayItem: function(data, index) {
                                return [
                                    [data.firstName, data.fatherFirstName].join(' | '),
                                    data.id,
                                    data.urnNo
                                ];
                            }
                        }, {
                            key: "loanAccount.guarantors[].guaFirstName",
                            title: "NAME",
                            "readonly": true
                        }]
                    }]
                }, {
                    "type": "fieldset",
                    "title": "INSURANCE_POLICY",
                    "items": [{
                        "key": "additional.portfolioUrnSelector",
                        "type": "select",
                        "titleMap": {
                            "applicant": "Applicant",
                            "coapplicant": "Co-Applicant",
                            "guarantor": "Guarantor"
                        },
                        onChange: function(value, form, model) {
                            switch (value) {
                                case "applicant":
                                    if (_.isEmpty(model.loanAccount.applicant)) {
                                        Utils.alert("Please Select an Applicant");
                                        model.additional.portfolioUrnSelector = "";
                                        break;
                                    }
                                    model.loanAccount.portfolioInsuranceUrn = model.loanAccount.applicant;
                                    break;
                                case "coapplicant":
                                    if (_.isEmpty(model.loanAccount.coBorrowerUrnNo)) {
                                        Utils.alert("Please Select a Co-Applicant");
                                        model.additional.portfolioUrnSelector = "";
                                        break;
                                    }
                                    model.loanAccount.portfolioInsuranceUrn = model.loanAccount.coBorrowerUrnNo;
                                    break;
                                case "guarantor":
                                    if (_.isEmpty(model.loanAccount.guarantors[0].guaUrnNo)) {
                                        Utils.alert("Please Select a Guarantor");
                                        model.additional.portfolioUrnSelector = "";
                                        break;
                                    }
                                    model.loanAccount.portfolioInsuranceUrn = model.loanAccount.guarantors[0].guaUrnNo;
                                    break;
                            }
                        }
                    }, {
                        key: "loanAccount.portfolioInsuranceUrn",
                        "title": "URN_NO"
                    }]
                }, {
                    "type": "fieldset",
                    "title": "NOMINEE_DETAILS",
                    "items": [{
                        "key": "loanAccount.nominees",
                        "type": "array",
                        notitle: "true",
                        "view": "fixed",
                        "add": null,
                        "remove": null,
                        "items": [{
                            key: "loanAccount.nominees[].nomineeFirstName",
                            "title": "NAME"
                        }, {
                            key: "loanAccount.nominees[].nomineeGender",
                            type: "select",
                            "title": "GENDER"
                        }, {
                            key: "loanAccount.nominees[].nomineeDOB",
                            type: "date",
                            "title": "DATE_OF_BIRTH"
                        }, {
                            key: "loanAccount.nominees[].nomineeDoorNo",
                            "title": "DOOR_NO"
                        }, {
                            key: "loanAccount.nominees[].nomineeLocality",
                            "title": "LOCALITY"
                        }, {
                            key: "loanAccount.nominees[].nomineeStreet",
                            "title": "STREET"
                        }, {
                            key: "loanAccount.nominees[].nomineePincode",
                            type: "lov",
                            fieldType: "number",
                            autolov: true,
                            inputMap: {
                                "pincode": {
                                    key: "loanAccount.nominees[].nomineePincode"
                                },
                                "district": {
                                    key: "loanAccount.nominees[].nomineeDistrict"
                                },
                                "state": {
                                    key: "loanAccount.nominees[].nomineeState"
                                }
                            },
                            outputMap: {
                                "pincode": "loanAccount.nominees[arrayIndex].nomineePincode",
                                "district": "loanAccount.nominees[arrayIndex].nomineeDistrict",
                                "state": "loanAccount.nominees[arrayIndex].nomineeState"
                            },
                            searchHelper: formHelper,
                            search: function(inputModel, form, model) {
                                return Queries.searchPincodes(
                                    inputModel.pincode,
                                    inputModel.district,
                                    inputModel.state
                                );
                            },
                            getListDisplayItem: function(item, index) {
                                return [
                                    item.pincode,
                                    item.district + ', ' + item.state
                                ];
                            }
                        }, {
                            key: "loanAccount.nominees[].nomineeDistrict",
                            type: "text",
                            "title": "DISTRICT"
                        }, {
                            key: "loanAccount.nominees[].nomineeState",
                            "title": "STATE"
                        }, {
                            key: "loanAccount.nominees[].nomineeRelationship",
                            type: "select",
                            "title": "RELATIONSHIP"
                        }]
                    }]
                }]
            }, {
                "type": "box",
                "title": "LOAN_DOCUMENTS",
                "items": [{
                    "type": "fieldset",
                    "title": "EXISTING_LOAN_DOCUMENTS",
                    "items": [{
                        "type": "array",
                        "key": "loanDocuments.existingDocuments",
                        "add": null,
                        "startEmpty": true,
                        "remove": null,
                        "titleExpr": "model.loanDocuments.existingDocuments[arrayIndex].document",
                        "items": [{
                            "title": "DOWNLOAD_FORM",
                            "notitle": true,
                            "fieldHtmlClass": "btn-block",
                            "style": "btn-default",
                            "icon": "fa fa-download",
                            "type": "button",
                            "readonly": false,
                            "key": "loanAccount.loanDocs[].documentId",
                            "onClick": function(model, form, schemaForm, event) {
                                var fileId = model.loanDocuments.existingDocuments[schemaForm.arrayIndex].documentId;
                                Utils.downloadFile(Files.getFileDownloadURL(fileId));
                            }

                        }]
                    }]
                }, {
                    "type": "fieldset",
                    "title": "ADD_LOAN_DOCUMENTS",
                    "items": [{
                        "type": "array",
                        "key": "loanDocuments.newLoanDocuments",
                        "title": "ADD_DOCUMENTS",
                        "startEmpty": true,
                        "titleExpr": "model.loanDocuments.newLoanDocuments[arrayIndex].document",
                        "items": [
                            // {
                            //     "key": "loanDocuments.newLoanDocuments[].document",
                            //     "title": "DOCUMENT",
                            //     "type": "string"
                            // },
                            // {
                            //     "key": "loanDocuments.newLoanDocuments[].disbursementId",
                            //     "title": "DISBURSEMENT_ID",
                            //     "type": "string"
                            // },
                            {
                                "title": "Upload",
                                "key": "loanDocuments.newLoanDocuments[].documentId",
                                type: "file",
                                fileType: "*/*",
                                category: "Loan",
                                subCategory: "DOC1",
                                notitle: true

                            }
                            // ,
                            // {
                            //     "key": "loanDocuments.newLoanDocuments[].documentStatus",
                            //     "type": "string"
                            // }
                        ]
                    }]
                }]
            }, {
                "type": "actionbox",
                "items": [{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                }, {
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }],
            schema: function() {
                return SchemaResource.getLoanAccountSchema().$promise;
            },
            actions: {
                preSave: function(model, form, formName) {
                    var deferred = $q.defer();
                    if (model.loanAccount.urnNo) {
                        deferred.resolve();
                    } else {
                        irfProgressMessage.pop('LoanInput-save', 'urnNo is required', 3000);
                        deferred.reject();
                    }
                    return deferred.promise;
                },
                submit: function(model, form, formName) {
                    $log.info(model);
                    PageHelper.clearErrors();
                    model.reqData.loanAccount = _.cloneDeep(model.loanAccount);
                    //alert(model.reqData.loanAccount.loanDocuments.length);
                    model.reqData.loanAccount.loanDocuments = model.reqData.loanAccount.loanDocuments || [];
                    model.reqData.loanProcessAction = "SAVE";
                    model.reqData.stage = null;
                    if (model.loanDocuments.newLoanDocuments) {
                        for (var i = 0; i < model.loanDocuments.newLoanDocuments.length; i++) {
                            model.loanDocuments.newLoanDocuments[i].loanId = model.loanAccount.id;
                            model.loanDocuments.newLoanDocuments[i].accountNumber = model.loanAccount.accountNumber;
                            model.loanDocuments.newLoanDocuments[i].documentStatus = "APPROVED";

                            model.reqData.loanAccount.loanDocuments.push(model.loanDocuments.newLoanDocuments[i]);
                        }

                    }
                    PageHelper.showLoader();
                    IndividualLoan.update(model.reqData).$promise.then(function(response) {
                        PageHelper.hideLoader();
                        $log.info(response);
                        PageHelper.showProgress("loan-create", "Update Successful", 5000)


                    }, function(errorResponse) {
                        PageHelper.showErrors(errresp);
                        PageHelper.showProgress("loan-create", "Oops. An Error Occurred", 5000);
                        PageHelper.hideLoader();
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });;

                }
            }
        };
    }
]);
