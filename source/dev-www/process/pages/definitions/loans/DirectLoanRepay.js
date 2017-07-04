irf.pageCollection.factory(irf.page('loans.DirectLoanRepay'), ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
    "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "Utils",
    function($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, Utils) {

        function backToLoansList() {
            try {
                var urnNo = ($stateParams.pageId.split("."))[1];
                $state.go("Page.Engine", {
                    pageName: "customer360.loans.View",
                    pageId: urnNo
                });
            } catch (err) {
                console.log(err);
                // @TODO : Where to redirect if no page params present
            }
        }

        function formatAmount(amount) {
            if (typeof(amount) == "string") {
                amount = parseFloat(amount);
            }
            return $filter('currency')(amount, "Rs.", 2);
        }

        function deriveAmount(txnType, repaymentObj) {
            var amount = 0;
            switch (txnType) {
                case 'Pre-closure':
                    amount = parseFloat(repaymentObj.payOffAndDueAmount);
                    break;
                case 'Scheduled Demand':
                    amount = parseFloat(repaymentObj.totalDemandDue);
                    break;
                default:
                    amount = 0;
                    break;
            }
            return amount;
        }

        return {
            "id": "LoanRepay",
            "type": "schema-form",
            "name": "LoanRepay",
            "title": "LOAN_REPAYMENT",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                PageHelper.showLoader();
                irfProgressMessage.pop('loading-loan-details', 'Loading Loan Details');

                model.bankName = SessionStore.getBankName();
                model.branch = SessionStore.getBranch();
                model.branchId = SessionStore.getBranchId();
                model.branchCode = SessionStore.getBranchCode();
                //PageHelper
                var loanAccountNo = ($stateParams.pageId.split("."))[0];
                var customerId = ($stateParams.pageId.split("."))[2];
                var bcaccountnumber = ($stateParams.pageId.split("."))[3];
                var partner = ($stateParams.pageId.split("."))[4];

                $log.info(bcaccountnumber);

                $log.info(customerId);
                model.customer = {};
                model.loanAccount = {};
                model.repay = {};
                Enrollment.get({
                        id: customerId,
                    },
                    function(res) {
                        _.assign(model.customer, res);
                        $log.info(model.customer);
                        model = Utils.removeNulls(model, true);
                        PageHelper.hideLoader();
                        PageHelper.showProgress("page-init", "Done.", 2000);
                    },
                    function(res) {
                        PageHelper.hideLoader();
                        PageHelper.showProgress("page-init", "Error in loading customer.", 2000);
                        PageHelper.showErrors(res);
                    }
                );

                var promise = LoanAccount.get({
                    accountId: loanAccountNo
                }).$promise;

                promise.then(function(data) {
                        model.loanAccount = data;
                        console.log(data);
                        model.repayment = {
                            'accountId': data.accountId,
                            'totalDemandDue': data.totalDemandDue,
                            'payOffAndDueAmount': data.payOffAndDueAmount,
                            'urnNo': data.customerId1,
                            'productCode': data.productCode,
                        };
                        if(partner=="AXIS")
                        {
                          model.repayment.accountId =bcaccountnumber;
                        }

                        var txName = (data.totalDemandDue == 0) ? "Advance Repayment" : "Scheduled Demand";

                        model.repayment.transactionName=txName;

                        if(model.repayment.transactionName=='Scheduled Demand')
                        {
                            model.repayment.amount= parseFloat(data.totalDemandDue + data.totalFeeDue);

                        }
                        model.repayment.accountNumber =loanAccountNo;

                        var currDate = moment(new Date()).format("YYYY-MM-DD");
                        model.repayment.repaymentDate = currDate;
                        irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                    }, function(resData) {
                        irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                        PageHelper.showErrors(resData);
                        //backToLoansList();
                    })
                    .finally(function() {
                        PageHelper.hideLoader();
                    })

            },
            offline: false,
            form: [{
                    "type": "box",
                    "title": "REPAY",
                    "items": [{
                            key: "repayment.accountId",
                            readonly: true
                        }, {
                            key: "repayment.transactionName",
                            required:true,
                            "type": "select",
                            "titleMap": {
                                "Advance Repayment": "Advance Repayment",
                                "Scheduled Demand": "Scheduled Demand",
                                "Fee Payment": "Fee Payment",
                                "Pre-closure": "Pre-closure",
                                "Prepayment": "Prepayment"
                            },
                            onChange: function(value, form, model) {
                                model.repayment.amount = deriveAmount(value, model.repayment);
                            }
                        },
                        {
                            key:"repayment.amount",
                            required:true,
                        },
                        "repayment.repaymentDate",
                        {
                            key: "repayment.cashCollectionRemark",
                            type:"select",
                            required:true,
                            enumCode:"Cash_collection_remarks"
                        },
                        {
                            key: "repayment.receiptNumber",
                            "title":"Receipt Number",
                            condition:"model.repayment.cashCollectionRemark=='Receipt Number'",
                        },
                        "additional.override_fp", 
                        {
                            "key": "repayment.authorizationRemark",
                            "condition": "model.additional.override_fp==true"
                        },
                         
                        {
                            type: "fieldset",
                            condition: "!model.additional.override_fp",
                            title: "VALIDATE_BIOMETRIC",
                            items: [{
                                key: "customer.isBiometricValidated",
                                "title": "CHOOSE_A_FINGER_TO_VALIDATE",
                                type: "validatebiometric",
                                category: 'CustomerEnrollment',
                                subCategory: 'FINGERPRINT',
                                helper: formHelper,
                                biometricMap: {
                                    leftThumb: "model.customer.leftHandThumpImageId",
                                    leftIndex: "model.customer.leftHandIndexImageId",
                                    leftMiddle: "model.customer.leftHandMiddleImageId",
                                    leftRing: "model.customer.leftHandRingImageId",
                                    leftLittle: "model.customer.leftHandSmallImageId",
                                    rightThumb: "model.customer.rightHandThumpImageId",
                                    rightIndex: "model.customer.rightHandIndexImageId",
                                    rightMiddle: "model.customer.rightHandMiddleImageId",
                                    rightRing: "model.customer.rightHandRingImageId",
                                    rightLittle: "model.customer.rightHandSmallImageId"
                                },
                                viewParams: function(modelValue, form, model) {
                                    return {
                                        customerId: model.customer.id
                                    };
                                },
                            }]
                        },
                    ]
                },

                {
                    "type": "actionbox",
                    "condition": "model.customer.isBiometricValidated ||model.additional.override_fp",
                    "items": [{
                        "type": "submit",
                        "style": "btn-theme",
                        "title": "SUBMIT"
                    }]
                },

                {
                    "type": "actionbox",
                    "condition": "model.repay.submissionDone",
                    "items": [{
                        "type": "button",
                        "style": "btn-theme",
                        "title": "PRINT",
                        "onClick": function(model, formCtrl, formName) {
                            function PrinterConstants() {

                            }
                            PrinterConstants.FONT_LARGE_BOLD = 2;
                            PrinterConstants.FONT_LARGE_NORMAL = 1;
                            PrinterConstants.FONT_SMALL_NORMAL = 3;
                            PrinterConstants.FONT_SMALL_BOLD = 4;

                            function PrinterData() {
                                this.lines = [];
                            }

                            PrinterData.prototype.getLineLength = function(font) {
                                if (font == PrinterConstants.FONT_LARGE_BOLD || font == PrinterConstants.FONT_LARGE_NORMAL) {
                                    return 24;
                                } else {
                                    return 42;
                                }
                            }

                            PrinterData.prototype.addLine = function(text, opts) {
                                opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
                                opts['center'] = _.has(opts, 'center') && _.isBoolean(opts['center']) ? opts['center'] : false;
                                var obj = {
                                    "bFont": opts['font'],
                                    "text": text,
                                    "style": {
                                        "center": opts['center']
                                    }
                                };
                                this.lines.push(obj);
                                return this;
                            }

                            PrinterData.prototype.addKeyValueLine = function(key, value, opts) {
                                opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
                                var keyLength = parseInt(this.getLineLength(opts['font']) / 2) - 1;
                                var line = _.padEnd(key, keyLength, ' ') + ': ' + value;
                                var obj = {
                                    "bFont": opts['font'],
                                    "text": line,
                                    "style": {
                                        "center": false
                                    }
                                };
                                this.lines.push(obj);
                                return this;
                            }

                            PrinterData.prototype.addStrRepeatingLine = function(str, opts) {
                                opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
                                var lineLength = this.getLineLength(opts['font']);
                                var line = _.padEnd("", lineLength, '-')
                                var obj = {
                                    "bFont": opts['font'],
                                    "text": line,
                                    "style": {
                                        "center": false
                                    }
                                };
                                this.lines.push(obj);
                                return this;
                            }

                            PrinterData.prototype.addLines = function(lines) {
                                this.lines = this.lines.concat(lines);
                            }

                            PrinterData.prototype.getLines = function() {
                                return this.lines;
                            }

                            var getPrintReceipt = function(repaymentInfo, opts) {
                                opts['duplicate'] = opts['duplicate'] || false;
                                var pData = new PrinterData();
                                if (opts['duplicate']) {
                                    pData.addLine('DUPLICATE', {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_BOLD
                                    });
                                } else {
                                    pData.addLine('RECEIPT', {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_BOLD
                                    });
                                }

                                var curTime = moment();
                                var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
                                pData.addLine(opts['entity_name'], {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_BOLD
                                    })
                                    .addLine(opts['branch'], {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    }).addLine("Date : " + curTimeStr, {
                                        'center': false,
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    //.addLine("Customer ID : " + repaymentInfo['customerId'], {'center': false, font: PrinterConstants.FONT_SMALL_NORMAL})
                                    .addLine("LOAN REPAYMENT", {
                                        'center': true,
                                        font: PrinterConstants.FONT_LARGE_BOLD
                                    })
                                    .addLine("", {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addLine(repaymentInfo['accountName'] + "-" + repaymentInfo["productCode"], {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_BOLD
                                    })
                                    .addKeyValueLine("Branch Code", opts['branch_code'], {
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addKeyValueLine("Customer URN", repaymentInfo['customerURN'], {
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addKeyValueLine("Customer Name", repaymentInfo['customerName'], {
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addKeyValueLine("Loan A/C No", repaymentInfo['accountNumber'], {
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addKeyValueLine("Transaction Type", repaymentInfo['transactionType'], {
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addKeyValueLine("Transaction ID", repaymentInfo['transactionID'], {
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addKeyValueLine("Demand Amount", parseFloat(repaymentInfo['demandAmount']) == 0 ? "Nil" : formatAmount(repaymentInfo["demandAmount"]), {
                                        font: PrinterConstants.FONT_SMALL_BOLD
                                    })
                                    .addKeyValueLine("Amount Paid", formatAmount(repaymentInfo['amountPaid']), {
                                        font: PrinterConstants.FONT_SMALL_BOLD
                                    })
                                    .addKeyValueLine("Total Payoff Amount", formatAmount(parseFloat(repaymentInfo['payOffAmount']) - parseFloat(repaymentInfo['amountPaid'])), {
                                        font: PrinterConstants.FONT_SMALL_BOLD
                                    })
                                    // .addKeyValueLine("Demand Amount", repaymentInfo['demandAmount'], {font:PrinterConstants.FONT_SMALL_BOLD})
                                    .addKeyValueLine("Demands Paid/Pending", repaymentInfo['demandsPaidAndPending'], {
                                        font: PrinterConstants.FONT_SMALL_BOLD
                                    })
                                    .addStrRepeatingLine("-", {
                                        font: PrinterConstants.FONT_LARGE_BOLD
                                    })
                                    .addLine(opts['company_name'], {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addLine("CIN :" + opts['cin'], {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addLine(opts['address1'], {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addLine(opts['address2'], {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addLine(opts['address3'], {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addLine("Website :" + opts['website'], {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addLine("Helpline No :" + opts['helpline'], {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addLine("", {})
                                    .addLine("", {})
                                    .addLine("Signature not required as this is an", {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    })
                                    .addLine("electronically generated receipt.", {
                                        'center': true,
                                        font: PrinterConstants.FONT_SMALL_NORMAL
                                    });
                                return pData;
                            }

                            var fullPrintData = new PrinterData();

                            var opts = {
                                'branch': model.branch,
                                'entity_name': model.bankName + " KGFS",
                                'company_name': "IFMR Rural Channels and Services Pvt. Ltd.",
                                'cin': 'U74990TN2011PTC081729',
                                'address1': 'IITM Research Park, Phase 1, 10th Floor',
                                'address2': 'Kanagam Village, Taramani',
                                'address3': 'Chennai - 600113, Phone: 91 44 66687000',
                                'website': "http://ruralchannels.kgfs.co.in",
                                'helpline': '18001029370',
                                'branch_id': model.branchId,
                                'branch_code': model.branchCode
                            };

                            var r = model.repay;
                            var s=model.loanAccount;
                            var totalSatisfiedDemands = 0;
                            var pendingInstallment= 0;
                            //r.accountId

                            LoanAccount.get({
                                accountId: r.accountNumber
                            }).$promise.then(function(resp) {
                                $log.info(resp);
                                if (resp.repaymentSchedule && resp.repaymentSchedule.length) {
                                    for (i = 0; i < resp.repaymentSchedule.length; i++) {
                                        if (resp.repaymentSchedule[i].description == 'Satisfied' || resp.repaymentSchedule[i].description == 'Advance') {
                                            totalSatisfiedDemands++;
                                            $log.info("inc s");
                                        } else if (resp.repaymentSchedule[i].description == 'Projected' || resp.repaymentSchedule[i].description == 'true' || resp.repaymentSchedule[i].description == 'Due') {
                                            pendingInstallment++;
                                            $log.info("inc p");
                                        }
                                    }
                                }
                                $log.info(totalSatisfiedDemands);
                                $log.info(pendingInstallment);
                                r.totalSatisfiedDemands = totalSatisfiedDemands;
                                r.pendingInstallment = pendingInstallment;
                                r.accountName = resp.accountName;
                                r.payOffAndDueAmount = resp.payOffAndDueAmount;
                                r.totalDemandDue = resp.equatedInstallment;
                                r.customerName1 = resp.customer1FirstName;
                                r.customerName2 = resp.customer1LastName;

                                    var repaymentInfo = {
                                        'repaymentDate': r.repaymentDate,
                                        'customerURN': r.urnNo,
                                        'accountNumber': r.accountId,
                                        'transactionType': r.transactionName,
                                        'customerName': r.customerName1 + r.customerName2,
                                        'transactionID': r.transactionId,
                                        'demandAmount': r.totalDemandDue,
                                        'amountPaid': r.amount,
                                        'payOffAmount': r.payOffAndDueAmount,
                                        'accountName': r.accountName,
                                        'demandsPaidAndPending': r.totalSatisfiedDemands + " / " + r.pendingInstallment,
                                        'productCode': r.productCode,
                                    };

                                $log.info(repaymentInfo);
                                $log.info(opts);

                                var pData = getPrintReceipt(repaymentInfo, opts);
                                pData.addLine("", {});
                                pData.addLine("", {});
                                fullPrintData.addLines(pData.getLines());

                                $log.info(fullPrintData);

                                cordova.plugins.irfBluetooth.print(function() {
                                    console.log("succc callback");
                                }, function(err) {
                                    console.error(err);
                                    console.log("errr collback");
                                }, fullPrintData.getLines());
                            });
                        }
                    }]
                }
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "repayment": {
                        "type": "object",
                        "properties": {
                            "accountId": {
                                "type": "string",
                                "title": "ACCOUNT_ID"
                            },
                            "amount": {
                                "type": "string",
                                "title": "AMOUNT"
                            },
                            "authorizationRemark": {
                                "type": "string",
                                "title": "AUTHORIZATION_REMARK"
                            },
                            "authorizationUsing": {
                                "type": "string",
                                "title": "AUTHORIZATION_USING"
                            },
                            "cashCollectionRemark": {
                                "type": "string",
                                "title": "CASH_COLLECTION_REMARK"
                            },
                            "groupCode": {
                                "type": "string",
                                "title": "GROUP_CODE"
                            },
                            "productCode": {
                                "type": "string",
                                "title": "PRODUCT_CODE"
                            },
                            "remarks": {
                                "type": "string",
                                "title": "REMARKS"
                            },
                            "repaymentDate": {
                                "type": "string",
                                "title": "REPAYMENT_DATE",
                                "x-schema-form": {
                                    "type": "date"
                                }
                            },
                            "transactionId": {
                                "type": "string",
                                "title": "TRANSACTION_ID"
                            },
                            "transactionName": {
                                "type": "string",
                                "title": "TRANSACTION_NAME"

                            },
                            "urnNo": {
                                "type": "string",
                                "title": "URN_NO"
                            }
                        },
                    },
                    "additional": {
                        "type": "object",
                        "properties": {
                            "override_fp": {
                                "type": "boolean",
                                "title": "OVERRIDE_FINGERPRINT",
                                "default": false
                            }
                        }
                    }
                },
                "required": [
                    "accountId",
                    "amount",
                    "authorizationRemark",
                    "authorizationUsing",
                    "cashCollectionRemark",
                    "groupCode",
                    "productCode",
                    "remarks",
                    "repaymentDate",
                    "transactionId",
                    "transactionName",
                    "urnNo"
                ]
            },
            actions: {
                preSave: function(model, formCtrl) {
                    var deferred = $q.defer();
                    model._storedData = null;
                    deferred.resolve();
                    return deferred.promise;
                },
                submit: function(model, formCtrl, formName) {
                    $log.info("Inside submit");
                    if (window.confirm("Are you Sure?")) {
                        PageHelper.showLoader();
                        model.repayment.cashCollectionRemark= model.repayment.cashCollectionRemark + model.repayment.receiptNumber;
                        var postData = _.cloneDeep(model.repayment);
                        postData.amount = parseInt(Number(postData.amount)) + "";
                        LoanAccount.repay(postData, function(resp, header) {
                            $log.info(resp);
                            try {
                                alert(resp.response);
                                $log.info(resp);
                                model.repay = resp;
                                model.repay.submissionDone = "yes";
                                model.repay.accountNumber=model.repayment.accountNumber;
                            } catch (err) {

                            }
                        }, function(resp) {
                            try {
                                PageHelper.showErrors(resp);
                            } catch (err) {
                                console.error(err);
                            }
                        }).$promise.finally(function() {
                            PageHelper.hideLoader();
                        });

                    }
                }
            }
        }
    }
]);