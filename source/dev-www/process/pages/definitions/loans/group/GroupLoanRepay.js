irf.pageCollection.factory(irf.page('loans.groups.GroupLoanRepay'),
["$log", "$q", "SessionStore", "$state", "formHelper",
"$stateParams", "LoanAccount", "LoanProcess", "PageHelper",
"Groups","GroupProcess", "Utils", "elementsUtils", '$filter', 'LoanProducts', 'irfNavigator',
function($log, $q, SessionStore, $state, formHelper, $stateParams, LoanAccount, LoanProcess, PageHelper,
    Groups,GroupProcess, Utils, elementsUtils, $filter, LoanProducts, irfNavigator) {

    function backToQueue() {
        irfNavigator.goBack();
    }

    function deriveAmount(txnType, repaymentObj) {
        var amount = 0;
        switch (txnType) {
            case 'Pre-closure':
                amount = parseFloat(repaymentObj.payOffAndDueAmount);
                break;
            case 'Scheduled Demand':
                amount = parseFloat(repaymentObj.demandAmount);
                break;
            case 'Advance Repayment':
                amount = parseFloat(repaymentObj.equatedInstallment);
                break;
            default:
                amount = 0;
                break;
        }
        return amount;
    }

    function formatAmount(amount) {
        if (typeof(amount) == "string") {
            amount = parseFloat(amount);
        }
        return $filter('currency')(amount, "Rs.", 2);
    }

    function updateTotal(model) {
        try {
            model.total = 0;
            if (model.partnerCode != "AXIS") {
                for (var i = 0; i < model.repayments.length; i++) {
                    model.total += model.repayments[i].amount;
                }
            } else {
                for (var i = 0; i < model.loanDemandScheduleDto.length; i++) {
                    model.total += model.loanDemandScheduleDto[i].amount;
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    var cashCollectionRemarks = {
        "Cash received at the branch": "Cash received at the branch",
        "Cash collected at field by WM": "Cash collected at field by WM",
        "Cash collected at field through CSP": "Cash collected at field through CSP",
        "Receipt Number": "Receipt Number"
    };

    return {
        "type": "schema-form",
        "title": "LOAN_REPAYMENT",
        "subTitle": "",
        initialize: function(model, form, formCtrl) {
            PageHelper.showLoader();
            model.bankName = SessionStore.getBankName();
            model.branch = SessionStore.getBranch();
            model.branchId = SessionStore.getBranchId();
            model.branchCode = SessionStore.getBranchCode();
            var groupParams = $stateParams.pageId.toString().split(".");
            model.siteCode = SessionStore.getGlobalSetting('siteCode');
            model.partnerCode = groupParams[0];
            var axisRepayment = (model.partnerCode == "AXIS");
            model.groupCode = groupParams[1];
            var isLegacy = false;
            try {
                isLegacy = groupParams[2] == "true";
            } catch (err) {
                isLegacy = false;
            }

            $q.all([
                GroupProcess.search({
                    'groupCode': model.groupCode
                }).$promise,
                LoanAccount.getGroupRepaymentDetails({
                    partnerCode: model.partnerCode,
                    groupCode: model.groupCode,
                    isLegacy: isLegacy
                }).$promise
            ]).then(function(resps) {
                var groupData = resps[0].body[0];
                model.groupName = groupData.groupName;
                model.centreCode = groupData.centreCode || "";
                var centres = formHelper.enum('centre').data;
                for (var i = 0; i < centres.length; i++) {
                    var centre = centres[i];
                    if (centre.field3 == model.centreCode) {
                        model.centreName = centre.name || "";
                    }
                }
                model.centreName = model.centreName || "";

                var repaymentData = resps[1];
                delete repaymentData.$promise;
                delete repaymentData.$resolved;

                model.total = 0;
                model.ui = {
                    submissionDone: false
                };

                if (!axisRepayment) {
                    model.repayments = _.cloneDeep(repaymentData.summaries);
                    for (var i = 0; i < model.repayments.length; i++) {
                        var repData = model.repayments[i];
                        repData.demandAmount = parseInt(Number(repData.totalDemandDue));
                        repData.transactionName = (repData.totalDemandDue == 0) ? "Advance Repayment" : "Scheduled Demand";
                        repData.repaymentDate = Utils.getCurrentDate();
                        repData.equatedInstallment = Number(repData.equatedInstallment);
                        repData.amount = repData.equatedInstallment;
                        repData.additional = {};
                        repData.additional.accountBalance = Number(repData.accountBalance);
                        repData.additional.name = repData.customerName || repData.firstName;
                        repData.amount = deriveAmount(repData.transactionName, repData);
                        model.total += repData.amount;
                    }
                    if (!model.repayments.length) {
                        PageHelper.showProgress("group-repayment", "No Records", 3000);
                        irfNavigator.goBack();
                    }
                } else {
                    model.loanDemandScheduleDto = _.cloneDeep(repaymentData.loanDemandScheduleDto);
                    model.total = 0;
                    for (var i = 0; i < model.loanDemandScheduleDto.length; i++) {
                        var accountNumber = model.loanDemandScheduleDto[i].accountNumber;
                        model.loanDemandScheduleDto[i].isAdvanceDemand = false;
                        model.loanDemandScheduleDto[i].installmentAmountInPaisa = model.loanDemandScheduleDto[i].installmentAmountInPaisa / 100;
                        model.loanDemandScheduleDto[i].pendingAmountInPaisa = model.loanDemandScheduleDto[i].pendingAmountInPaisa / 100;
                        model.loanDemandScheduleDto[i].amount = model.loanDemandScheduleDto[i].pendingAmountInPaisa;
                        model.total += model.loanDemandScheduleDto[i].amount;
                    }
                    if (!model.loanDemandScheduleDto.length) {
                        PageHelper.showProgress("group-repayment", "No Records", 3000);
                        irfNavigator.goBack();
                    }
                }
            }, function(fails) {
                PageHelper.showProgress("group-repayment", "No Records", 3000);
            }).finally(function() {
                PageHelper.hideLoader();
            });
        },
        offline: false,
        form: [{
            "type": "box",
            "title": "GROUP_LOAN_REPAYMENT",
            "items": [{
                    "key": "groupCode",
                    "title": "GROUP_CODE",
                    "readonly": true

                }, {
                    "key": "advanceRepayment",
                    "condition": "model.partnerCode=='AXIS'",
                    onChange: function(value, form, model) {
                        if (value) {
                            model.total =0;
                            for (var i = 0; i < model.loanDemandScheduleDto.length; i++) {
                                model.loanDemandScheduleDto[i].isAdvanceDemand = true;
                                model.loanDemandScheduleDto[i].amount =model.loanDemandScheduleDto[i].installmentAmountInPaisa;
                                model.total += model.loanDemandScheduleDto[i].amount;
                            }
                        } else {
                            model.total = 0;
                            for (var i = 0; i < model.loanDemandScheduleDto.length; i++) {
                                model.loanDemandScheduleDto[i].isAdvanceDemand = false;
                                model.loanDemandScheduleDto[i].amount =model.loanDemandScheduleDto[i].pendingAmountInPaisa;
                                model.total += model.loanDemandScheduleDto[i].amount;
                            }
                        }
                    }
                }, {
                    "key": "_cashCollectionRemark",
                    condition: "model.partnerCode!='AXIS'",
                    "title": "CASH_COLLECTION_REMARK",
                    "titleMap": cashCollectionRemarks,
                    "type": "select",
                    "onChange": function(value, form, model) {
                        for (var i = 0; i < model.repayments.length; i++) {
                            var repayment = model.repayments[i];
                            repayment.cashCollectionRemark = value;
                        }
                    }
                }, {
                    "key": "_remarks",
                    condition: "model.partnerCode!='AXIS'",
                    "title": "REMARKS",
                    "onChange": function(value, form, model) {
                        console.warn(model);
                        console.warn(value);
                        for (var i = 0; i < model.repayments.length; i++) {
                            var repayment = model.repayments[i];
                            repayment.remarks = value;
                        }
                    }
                }, {
                    key: "repayments",
                    condition: "model.partnerCode!='AXIS'",
                    add: null,
                    titleExpr: "model.repayments[arrayIndex].urnNo + ' : ' + model.repayments[arrayIndex].additional.name",
                    items: [{
                            key: "repayments[].accountId",
                            readonly: true
                        }, {
                            key: "repayments[].customerName",
                            readonly: true
                        }, {
                            key: "repayments[].additional.name",
                            readonly: true,
                            title: "NAME",
                            condition: "model.repayments[arrayIndex].name!=null"

                        }, {
                            key: "repayments[].urnNo",
                            readonly: true
                        }, {
                            key: "repayments[].additional.accountBalance",
                            title: "ACCOUNT_BALANCE",
                            type: "amount",
                            readonly: true

                        }, {
                            key: "repayments[].transactionName",
                            "type": "select",
                            "titleMap": {
                                "Advance Repayment": "Advance Repayment",
                                "Scheduled Demand": "Scheduled Demand",
                                "Fee Payment": "Fee Payment",
                                "Pre-closure": "Pre-closure"
                            },
                            onChange: function(value, form, model) {
                                var ai = form.arrayIndex;
                                model.repayments[ai].amount = deriveAmount(value, model.repayments[ai]);
                                if(model.repayments[ai].transactionName== "Scheduled Demand"){
                                   model.repayments[ai].amount = 0;
                                }
                                if(model.repayments[ai].transactionName=="Advance Repayment"){
                                   model.repayments[ai].amount = model.repayments[ai].equatedInstallment;
                                }
                                
                                updateTotal(model);
                            }
                        }, {
                            key: "repayments[].amount",
                            type: "amount",
                            validationMessage: {
                                'invalidAmount': 'Should be Less than Account Balance'
                            },
                            onChange: function(value, form, model, schemaForm) {
                                updateTotal(model);
                            }
                        }, {
                            key: "repayments[].cashCollectionRemark",
                            "condition": "model.siteCode == 'KGFS'",
                            "type": "select",
                            "titleMap": cashCollectionRemarks
                        },

                        {
                        key: "repayments[].receiptNumber",
                        "title":"Receipt Number",
                        condition:"model.repayments[arrayIndex].cashCollectionRemark=='Receipt Number'",
                       },

                        "repayments[].remarks", 
                        {
                            key: "repayments[].repaymentDate",
                            type: "date"
                        }
                    ]
                }, {
                    "key": "loanDemandScheduleDto",
                    "condition": "model.partnerCode=='AXIS'",
                    "add": null,
                    "titleExpr": "model.loanDemandScheduleDto[arrayIndex].urnNo + ' : ' + model.loanDemandScheduleDto[arrayIndex].firstName",
                    "items": [{
                            "key": "loanDemandScheduleDto[].accountNumber",
                            readonly: true
                        }, {
                            "key": "loanDemandScheduleDto[].urnNo",
                            readonly: true
                        }, {
                            "key": "loanDemandScheduleDto[].firstName",
                            readonly: true
                        },
                        {
                            "key": "loanDemandScheduleDto[].scheduleDate",
                            "title":"Schedule Date",
                            readonly: true
                        },
                        {
                            "key": "loanDemandScheduleDto[].installmentAmountInPaisa",
                            "title":"Installment Amount",
                            readonly: true
                        },
                        {
                            "key": "loanDemandScheduleDto[].pendingAmountInPaisa",
                            "title":"Pending Amount",
                            readonly: true
                        },
                        {
                            "key": "loanDemandScheduleDto[].amount",
                            "type": "amount",
                            onChange: function(value, form, model, schemaForm) {
                                updateTotal(model);
                            }

                        }, {
                            "key": "loanDemandScheduleDto[].isAdvanceDemand",
                            onChange: function(value, form, model) {
                                model.total = 0;
                            for (var i = 0; i < model.loanDemandScheduleDto.length; i++) {

                                if(model.loanDemandScheduleDto[i].isAdvanceDemand){
                                        model.loanDemandScheduleDto[i].amount =model.loanDemandScheduleDto[i].installmentAmountInPaisa;
                                        model.total += model.loanDemandScheduleDto[i].amount;
                                }
                                else{
                                    model.loanDemandScheduleDto[i].amount =model.loanDemandScheduleDto[i].pendingAmountInPaisa;
                                    model.total += model.loanDemandScheduleDto[i].amount;
                                }
                               
                            }    
                    }

                        }


                    ]

                }, {
                    "key": "total",
                    "type": "amount",
                    "title": "TOTAL",
                    readonly: true
                }

            ]
        }, {
            "type": "actionbox",
            "condition": "model.ui.submissionDone==false",
            "items": [{
                "type": "submit",
                "style": "btn-theme",
                "title": "SUBMIT"
            }]
        }, {
            "type": "actionbox",
            "condition": "model.ui.submissionDone==true",
            "items": [{
                "type": "button",
                "style": "btn-theme",
                "title": "BACK",
                "onClick": function(model, formCtrl, formName) {
                    backToQueue();
                }
            }, {
                "type": "button",
                "style": "btn-theme",
                "condition": "model.siteCode == 'KGFS'",
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

                    var pData = new PrinterData();

                    var getPrintHeader = function(opts) {
                        opts['duplicate'] = opts['duplicate'] || false;

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

                        //var curTime = moment();
                        var today = moment(new Date()).format("DD-MM-YYYY HH:mm:ss");
                        //var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
                        pData.addLine(opts['entity_name'], {
                                'center': true,
                                font: PrinterConstants.FONT_SMALL_BOLD
                            })
                            .addLine(opts['branch'], {
                                'center': true,
                                font: PrinterConstants.FONT_SMALL_NORMAL
                            })
                            .addLine("Centre Code : " + opts['centre_code'], {
                                'center': true, 
                                font: PrinterConstants.FONT_SMALL_NORMAL
                            })
                            .addLine("Centre Name : " + opts['centre_name'], {
                                'center': true, 
                                font: PrinterConstants.FONT_SMALL_NORMAL
                            })
                            .addLine("Date : " + today, {
                                'center': true,
                                font: PrinterConstants.FONT_SMALL_NORMAL
                            })
                            .addLine("LOAN REPAYMENT", {
                                'center': true,
                                font: PrinterConstants.FONT_LARGE_BOLD
                            })
                            .addLine("", {
                                'center': true,
                                font: PrinterConstants.FONT_SMALL_NORMAL
                            })
                            .addLine(opts['accountName'] + "-" + opts["productCode"], {
                                'center': true,
                                font: PrinterConstants.FONT_SMALL_BOLD
                            })
                            .addKeyValueLine("Branch Code", opts['branch_code'], {
                                font: PrinterConstants.FONT_SMALL_NORMAL
                            })
                            .addLine("", {})
                            .addKeyValueLine("Group Code", opts['group_code'], {
                                font: PrinterConstants.FONT_SMALL_NORMAL
                            })
                            .addKeyValueLine("Group Name", opts['group_name'], {
                                font: PrinterConstants.FONT_SMALL_NORMAL
                            })
                            .addLine("", {})
                        return pData;
                    }

                    var getPrintReceipt = function(repaymentInfo, opts) {
                        //var pData = {};
                        pData.addKeyValueLine("Customer URN", repaymentInfo['customerURN'], {
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
                            .addKeyValueLine("Total Payoff Amount", formatAmount(parseFloat(repaymentInfo['payOffAmount'])), {
                                font: PrinterConstants.FONT_SMALL_BOLD
                            })
                            // .addKeyValueLine("Demand Amount", repaymentInfo['demandAmount'], {font:PrinterConstants.FONT_SMALL_BOLD})
                            .addKeyValueLine("Demands Paid/Pending", repaymentInfo['demandsPaidAndPending'], {
                                font: PrinterConstants.FONT_SMALL_BOLD
                            })
                            return pData;

                    }

                    var getPrintFooter = function(opts) {
                        //var pData = {};
                        pData.addStrRepeatingLine("-", {
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
                        'branch_code': model.branchCode,
                        'group_name':model.groupName,
                        'group_code':model.groupCode,
                        'centre_code':model.centreCode,
                        'centre_name':model.centreName
                    };

                    if (model.partnerCode != "AXIS") {
                        var promise = [];
                        var pData;

                        for (var i = 0; i < model.repaymentResponse.repayments.length; i++) {
                            promise[i] = LoanAccount.get({
                                accountId: model.repaymentResponse.repayments[i].accountNumber
                            }).$promise;
                        }

                        $q.all(promise).then(function(respArray) {
                            for (respIdx = 0; respIdx < respArray.length; respIdx++) {
                                var resp = respArray[respIdx];
                                var r = model.repaymentResponse.repayments[respIdx];
                                $log.info(resp);
                                var totalSatisfiedDemands = 0;
                                var pendingInstallment = 0;
                                if (resp.repaymentSchedule && resp.repaymentSchedule.length) {
                                    for (i = 0; i < resp.repaymentSchedule.length; i++) {
                                        if (resp.repaymentSchedule[i].status == 'true') {
                                            if (resp.repaymentSchedule[i].description == 'Satisfied' || resp.repaymentSchedule[i].description == 'Advance') {
                                                totalSatisfiedDemands++;
                                                $log.info("inc s");
                                            } else if (resp.repaymentSchedule[i].description == 'Projected' || resp.repaymentSchedule[i].description == 'true' || resp.repaymentSchedule[i].description == 'Due') {
                                                pendingInstallment++;
                                                $log.info("inc p");
                                            }
                                        }
                                    }
                                }
                                $log.info(totalSatisfiedDemands);
                                $log.info(pendingInstallment);
                                r.totalSatisfiedDemands = totalSatisfiedDemands;
                                r.pendingInstallment = pendingInstallment;
                                r.pendingInstallment = pendingInstallment;
                                r.accountName = resp.accountName;
                                r.customerName = Utils.getFullName(resp.customer1FirstName, resp.customer1MiddleName, resp.customer1LastName);
                                r.payOffAmount = resp.payOffAmount;
                            }
                        })

                        $q.all(promise).finally(function() {

                            opts.accountName= model.repaymentResponse.repayments[0].accountName;
                            opts.productCode=model.repaymentResponse.repayments[0].productCode;
                            getPrintHeader(opts);
                            for (var i = 0; i < model.repaymentResponse.repayments.length; i++) {
                                if (model.repaymentResponse.repayments[i].amount != 0) {
                                    var r = model.repaymentResponse.repayments[i];
                                    var repaymentInfo = {};
                                    repaymentInfo.repaymentDate=r.repaymentDate;
                                    repaymentInfo.customerURN=r.urnNo;
                                    repaymentInfo.customerName = r.customerName;
                                    repaymentInfo.accountNumber=r.accountNumber;
                                    repaymentInfo.transactionType= r.transactionName;
                                    repaymentInfo.customerName=r.customerName;
                                    repaymentInfo.demandAmount=r.demandAmount;
                                    repaymentInfo.amountPaid=r.amount;
                                    repaymentInfo.payOffAmount= r.payOffAmount;
                                    repaymentInfo.accountName=r.accountName;
                                    repaymentInfo.demandsPaidAndPending=r.totalSatisfiedDemands + " / " + r.pendingInstallment;
                                    repaymentInfo.productCode=r.productCode;
                                    repaymentInfo.transactionID=r.transactionId;
                                    $log.info(repaymentInfo);
                                    getPrintReceipt(repaymentInfo, opts);
                                    pData.addLine("", {});
                                    pData.addLine("", {});
                                }
                            }

                            getPrintFooter(opts);
                            $log.info(pData);
                            $log.info("outside print");
                            cordova.plugins.irfBluetooth.print(function() {
                                console.log("succc callback");
                            }, function(err) {
                                console.error(err);
                                $log.info("cordova not there");
                                console.log("errr collback");
                            }, pData.getLines());

                        });
                    } else
                    {
                        var promise = [];
                        var pData;

                        for (var i = 0; i < model.repaymentResponse.loanDemandScheduleDto.length; i++) {
                            promise[i] = LoanAccount.get({
                                accountId: model.repaymentResponse.loanDemandScheduleDto[i].encoreAccountNo
                            }).$promise;
                        }

                        $q.all(promise).then(function(respArray) {
                            for (respIdx = 0; respIdx < respArray.length; respIdx++) {
                                var resp = respArray[respIdx];
                                var r = model.repaymentResponse.loanDemandScheduleDto[respIdx];
                                $log.info(resp);
                                var totalSatisfiedDemands = 0;
                                var pendingInstallment = 0;
                                if (resp.repaymentSchedule && resp.repaymentSchedule.length) {
                                    for (i = 0; i < resp.repaymentSchedule.length; i++) {
                                        if (resp.repaymentSchedule[i].status == 'true') {
                                            if (resp.repaymentSchedule[i].description == 'Satisfied' || resp.repaymentSchedule[i].description == 'Advance') {
                                                totalSatisfiedDemands++;
                                                $log.info("inc s");
                                            } else if (resp.repaymentSchedule[i].description == 'Projected' || resp.repaymentSchedule[i].description == 'true' || resp.repaymentSchedule[i].description == 'Due') {
                                                pendingInstallment++;
                                                $log.info("inc p");
                                            }
                                        }
                                    }
                                }

                                if (resp.transactions && resp.transactions.length) {
                                    for (i = 0; i < resp.transactions.length; i++) {
                                        if (resp.transactions[i].transactionId == r.transactionId) {
                                            r.transactionType = resp.transactions[i].transactionName
                                        }
                                    }
                                }

                                $log.info(totalSatisfiedDemands);
                                $log.info(pendingInstallment);
                                r.totalSatisfiedDemands = totalSatisfiedDemands || 0;
                                r.pendingInstallment = pendingInstallment || 0;
                                r.accountName = resp.accountName;
                                r.payOffAmount = resp.payOffAmount;
                                r.demandAmount = resp.equatedInstallment;
                            }
                        })

                        $q.all(promise).finally(function() {
                            opts.accountName= model.repaymentResponse.loanDemandScheduleDto[0].accountName;
                            opts.productCode=model.repaymentResponse.loanDemandScheduleDto[0].product;
                            getPrintHeader(opts);
                            for (var i = 0; i < model.repaymentResponse.loanDemandScheduleDto.length; i++) {
                                var r = model.repaymentResponse.loanDemandScheduleDto[i];
                                $log.info(r);
                                var repaymentInfo = {
                                    'repaymentDate': Utils.getCurrentDate(),
                                    'customerURN': r.urnNo,
                                    'accountNumber': r.accountNumber,
                                    'customerName': Utils.getFullName(r.firstName, r.middleName, r.lastName),
                                    'transactionID': r.transactionId,
                                    'demandAmount': r.demandAmount,
                                    'transactionType':r.transactionType,
                                    'amountPaid': r.amount,
                                    'payOffAmount': r.payOffAmount,
                                    'accountName': r.accountName,
                                    'demandsPaidAndPending': r.totalSatisfiedDemands + " / " + r.pendingInstallment,
                                    'productCode': r.productCode
                                };
                                $log.info(repaymentInfo);
                                getPrintReceipt(repaymentInfo, opts);
                                pData.addLine("", {});
                                pData.addLine("", {});
                            }
                            getPrintFooter(opts);
                            $log.info(pData);

                            cordova.plugins.irfBluetooth.print(function() {
                                console.log("succc callback");
                            }, function(err) {
                                console.error(err);
                                console.log("errr collback");
                            }, pData.getLines());
                        });
                    }
                }
            }]
        }],

        schema: function() {
            return Groups.getSchema().$promise;
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
                console.log(formCtrl);
                var reqData = _.cloneDeep(model);
                var repaymentsData = [];
                var loanDemandScheduleDtoData = [];

                if (reqData.repayments && reqData.repayments.length) {
                    for (var i = 0; i < reqData.repayments.length; i++) {
                        reqData.repayments[i].accountNumber=reqData.repayments[i].accountId;
                        
                        if (reqData.repayments[i].amount != 0) {
                            repaymentsData.push(reqData.repayments[i]);
                        }
                    }
                    reqData.repayments = repaymentsData;
                }
                if (reqData.loanDemandScheduleDto && reqData.loanDemandScheduleDto.length) {
                    for (var i = 0; i < reqData.loanDemandScheduleDto.length; i++) {
                        reqData.loanDemandScheduleDto[i].repaymentDate=SessionStore.getCBSDate();
                        if (reqData.loanDemandScheduleDto[i].amount != 0) {
                            loanDemandScheduleDtoData.push(reqData.loanDemandScheduleDto[i]);
                        }
                    }
                    reqData.loanDemandScheduleDto = loanDemandScheduleDtoData;
                }
                
                var msg = "";
                if (model.partnerCode != "AXIS") {
                    reqData.advanceRepayment = false;
                    for (var i = 0; i < reqData.repayments.length; i++) {
                        reqData.repayments[i].cashCollectionRemark= reqData.repayments[i].cashCollectionRemark + reqData.repayments[i].receiptNumber;
                        if (reqData.repayments[i].transactionName == "Advance Repayment" || reqData.repayments[i].transactionName == "Scheduled Demand") {
                            //Check for advance repayments, if any
                            if (reqData.repayments[i].transactionName == "Advance Repayment") {
                                reqData.advanceRepayment = true;
                                msg = "There are Advance Repayments - ";
                            }
                            //check for larger amounts
                            try {
                                if (typeof reqData.repayments[i].additional.accountBalance !== "undefined") {
                                    if (Number(reqData.repayments[i].amount) > reqData.repayments[i].additional.accountBalance) {
                                        msg = "For URN " + reqData.repayments[i].urnNo;
                                        msg += " Payable amount is larger than account balance."
                                        Utils.alert(msg);
                                        return;
                                    }
                                }
                            } catch (err) {

                            }
                        }
                    }
                }

                if (window.confirm(msg + "Are you Sure?")) {
                    PageHelper.showLoader();
                    LoanAccount.groupRepayment(reqData, function(resp, headers) {
                            model.repaymentResponse = resp;
                            model.ui.submissionDone = true;
                            //delete model.repayments;
                            //delete model.loanDemandScheduleDto;
                            PageHelper.showProgress("group-repay", "Done.", 3000);
                            if(model.siteCode == 'sambandh' || model.siteCode == 'saija') {
                                irfNavigator.goBack();
                            }
                    }, function(resp) {
                        console.error(resp);
                        PageHelper.showProgress("group-repay", "Oops. An Error Occurred", 3000);
                    }).$promise.finally(function() {
                        PageHelper.hideLoader();
                    });
                }
            }
        }
    }
}
]);