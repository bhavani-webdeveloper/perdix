irf.pageCollection.factory(irf.page('loans.groups.GroupLoanRepay'),
    ["$log","SessionStore", "$state",  "formHelper",
        "$stateParams", "LoanAccount", "LoanProcess", "PageHelper",
        "Groups", "Utils","elementsUtils",
        function ($log,SessionStore, $state, formHelper, $stateParams,
                  LoanAccount, LoanProcess,  PageHelper,
                  Groups, Utils) {

            function backToQueue(){
                $state.go("Page.Engine",{
                    pageName:"loans.groups.GroupLoanRepaymentQueue",
                    pageId:null
                });
            }

            var cashCollectionRemarks = {
                "Cash received at the branch":"Cash received at the branch",
                "Cash collected at field by WM":"Cash collected at field by WM",
                "Cash collected at field through CSP":"Cash collected at field through CSP",
                "Receipt Number":"Receipt Number"
            };

            return {
                "type": "schema-form",
                "title": "LOAN_REPAYMENT",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    PageHelper.showLoader();

                    //pageId = PartnerCode.GroupCode.isLegacy
                    var groupParams = $stateParams.pageId.toString().split(".");
                    var isLegacy = false;
                    try{
                        isLegacy = groupParams[2]=="true";
                    }
                    catch (err){
                        isLegacy = false;
                    }

                    var promise = LoanAccount.getGroupRepaymentDetails({
                        partnerCode: groupParams[0],
                        groupCode:groupParams[1],
                        isLegacy:isLegacy
                    }).$promise;
                    promise.then(function (data) { /* SUCCESS */
                        delete data.$promise;
                        delete data.$resolved;

                        console.warn(data);
                        model.ui = { submissionDone: false};

                        model.repayments = Array();
                        model.total=0;
                        model.groupCode = groupParams[1];
                        for(var i=0;i<data.length;i++){

                            var repData = data[i];

                            var totalDemandDue = Number(repData.totalDemandDue);
                            var txName = (totalDemandDue==0)?"Advance Repayment":"Scheduled Demand";
                            model.repayments.push({

                                accountId:repData.accountId,
                                amount:parseInt(Number(repData.equatedInstallment)),
                                demandAmount: parseInt(Number(repData.equatedInstallment)),
                                payOffAmount: repData.payOffAmount,
                                accountName: repData.accountName,
                                numSatisifiedDemands: repData.numSatisifiedDemands,
                                numDemands: repData.numDemands,
                                groupCode:repData.groupCode,
                                productCode:repData.productCode,
                                urnNo:repData.urnNo,
                                transactionName:txName,
                                repaymentDate:Utils.getCurrentDate(),
                                additional:{
                                    name:Utils.getFullName(repData.firstName,repData.middleName,repData.lastName),
                                    accountBalance:Number(repData.accountBalance)
                                }

                            });
                            model.total += parseInt(Number(repData.equatedInstallment));


                        }
                        if(model.repayments.length<1){
                            PageHelper.showProgress("group-repayment","No Records",3000);
                            backToQueue();
                        }


                        }, function (resData) {
                            PageHelper.showProgress("group-repayment","No Records",3000);
                            backToQueue();
                        })
                        .finally(function () {
                            PageHelper.hideLoader();
                        });

                },
                offline: false,
                form: [
                    {
                        "type": "box",
                        "title": "GROUP_LOAN_REPAYMENT",
                        "items": [
                            {
                                "key":"groupCode",
                                "title":"GROUP_CODE",
                                "readonly":true

                            },
                            {
                                "key":"_cashCollectionRemark",
                                "title":"CASH_COLLECTION_REMARK",
                                "titleMap":cashCollectionRemarks,
                                "type":"select",
                                "onChange":function(value,form,model){
                                    for(var i=0;i<model.repayments.length;i++){
                                        var repayment = model.repayments[i];
                                        repayment.cashCollectionRemark  = value;
                                    }
                                }
                            },
                            {
                                "key":"_remarks",
                                "title":"REMARKS",
                                "onChange":function(value,form,model){
                                    console.warn(model);
                                    console.warn(value);
                                    for(var i=0;i<model.repayments.length;i++){
                                        var repayment = model.repayments[i];
                                        repayment.remarks  = value;
                                    }
                                }
                            },
                            {
                                key:"repayments",
                                add:null,
                                remove:null,
                                titleExpr:"model.repayments[arrayIndex].urnNo + ' : ' + model.repayments[arrayIndex].name",
                                items:[
                                    {
                                        key:"repayments[].accountId",
                                        readonly:true

                                    },
                                    {
                                        key:"repayments[].additional.name",
                                        readonly:true,
                                        title:"NAME",
                                        condition:"model.repayments[arrayIndex].name!=null"

                                    },
                                    {
                                        key:"repayments[].urnNo",
                                        readonly:true

                                    },
                                    {
                                        key:"repayments[].additional.accountBalance",
                                        title:"ACCOUNT_BALANCE",
                                        type:"amount",
                                        readonly:true

                                    },
                                    {
                                        key:"repayments[].amount",
                                        type:"amount",
                                        validationMessage: {
                                            'invalidAmount': 'Should be Less than Account Balance'
                                        },
                                        onChange:function(value,form,model,schemaForm){

                                            try {
                                                var i = form["arrayIndex"];
                                                if (value > model.repayments[i].additional.accountBalance) {
                                                    Utils.alert("Amount should be Less than Account Balance");
                                                }
                                                model.total=0;
                                                for(var i=0;i<model.repayments.length;i++){
                                                    model.total +=  model.repayments[i].amount;
                                                }

                                            }catch(err){
                                                console.error(err);
                                            }

                                        }


                                    },
                                    {
                                        key:"repayments[].cashCollectionRemark",
                                        "type":"select",
                                        "titleMap":cashCollectionRemarks

                                    },
                                    "repayments[].remarks",
                                    {
                                        key:"repayments[].repaymentDate",
                                        type:"date"
                                    },
                                    {
                                        key:"repayments[].transactionName",
                                        "type":"select",
                                        "titleMap":{
                                            "Advance Repayment":"Advance Repayment",
                                            "Scheduled Demand":"Scheduled Demand",
                                            "Fee Payment":"Fee Payment",
                                            "Pre-closure":"Pre-closure",
                                            "Prepayment":"Prepayment"
                                        }
                                    }


                                ]
                            },
                            {
                                "key":"total",
                                "type":"amount",
                                "title":"TOTAL",
                                readonly:true
                            }

                        ]
                    },
                    {
                        "type":"actionbox",
                        "condition": "model.ui.submissionDone==false",
                        "items": [
                            {
                                "type":"submit",
                                "style":"btn-theme",
                                "title":"SUBMIT"
                            }
                        ]
                    },
                    {
                        "type": "actionbox",
                        "condition": "model.ui.submissionDone==true",
                        "items": [
                            {
                                "type": "button",
                                "style": "btn-theme",
                                "title": "BACK",
                                "onClick": function(model, formCtrl, formName){
                                    backToQueue();
                                }
                            },
                            {
                                "type": "button",
                                "style": "btn-theme",
                                "title": "PRINT",
                                "onClick": function(model, formCtrl, formName){
                                    function PrinterConstants(){

                                    }
                                    PrinterConstants.FONT_LARGE_BOLD = 2;
                                    PrinterConstants.FONT_LARGE_NORMAL = 1;
                                    PrinterConstants.FONT_SMALL_NORMAL = 3;
                                    PrinterConstants.FONT_SMALL_BOLD = 4;

                                    function PrinterData(){
                                        this.lines = [];
                                    }

                                    PrinterData.prototype.getLineLength = function(font){
                                        if (font == PrinterConstants.FONT_LARGE_BOLD || font == PrinterConstants.FONT_LARGE_NORMAL){
                                            return 24;
                                        } else {
                                            return 42;
                                        }
                                    }

                                    PrinterData.prototype.addLine = function(text, opts){
                                        opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
                                        opts['center'] = _.has(opts,'center') && _.isBoolean(opts['center'])? opts['center']: false;
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

                                    PrinterData.prototype.addKeyValueLine = function(key, value, opts){
                                        opts['font'] = opts['font'] || PrinterConstants.FONT_SMALL_NORMAL;
                                        var keyLength = parseInt(this.getLineLength(opts['font'])/2)-1;
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

                                    PrinterData.prototype.addStrRepeatingLine = function(str, opts){
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



                                    PrinterData.prototype.addLines = function(lines){
                                        this.lines = this.lines.concat(lines);
                                    }

                                    PrinterData.prototype.getLines = function(){
                                        return this.lines;
                                    }

                                    var getPrintReceipt = function(repaymentInfo, opts){
                                        opts['duplicate'] = opts['duplicate'] || false;
                                        var pData = new PrinterData();
                                        if(opts['duplicate']){
                                            pData.addLine('DUPLICATE', {'center': true, font: PrinterConstants.FONT_SMALL_BOLD});
                                        } else {
                                            pData.addLine('RECEIPT', {'center': true, font: PrinterConstants.FONT_SMALL_BOLD});
                                        }

                                        var curTime = moment();
                                        var curTimeStr = curTime.local().format("DD-MM-YYYY HH:MM:SS");
                                        pData.addLine(opts['entity_name'], {'center': true, font: PrinterConstants.FONT_SMALL_BOLD})
                                            .addLine(opts['branch'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("Date : " + curTimeStr, {'center': false, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            //.addLine("Customer ID : " + repaymentInfo['customerId'], {'center': false, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("LOAN REPAYMENT", {'center': true, font: PrinterConstants.FONT_LARGE_BOLD})
                                            .addLine("", {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine(repaymentInfo['accountName'], {'center': true, font: PrinterConstants.FONT_SMALL_BOLD})
                                            .addKeyValueLine("Customer URN", repaymentInfo['customerURN'], {font:PrinterConstants.FONT_SMALL_NORMAL})
                                            //.addKeyValueLine("Customer Name", repaymentInfo['customerName'], {font:PrinterConstants.FONT_SMALL_NORMAL})
                                            .addKeyValueLine("Loan A/C No", repaymentInfo['accountNumber'], {font:PrinterConstants.FONT_SMALL_NORMAL})
                                            .addKeyValueLine("Transaction Type", repaymentInfo['transactionType'], {font:PrinterConstants.FONT_SMALL_NORMAL})
                                            .addKeyValueLine("Transaction ID", repaymentInfo['transactionID'], {font:PrinterConstants.FONT_SMALL_NORMAL})
                                            .addKeyValueLine("Demand Amount", repaymentInfo['demandAmount'], {font:PrinterConstants.FONT_SMALL_BOLD})
                                            .addKeyValueLine("Amount Paid", repaymentInfo['amountPaid'], {font:PrinterConstants.FONT_SMALL_BOLD})
                                            .addKeyValueLine("Total Payoff Amount", repaymentInfo['payOffAmount'], {font:PrinterConstants.FONT_SMALL_BOLD})
                                            .addKeyValueLine("Demand Amount", repaymentInfo['demandAmount'], {font:PrinterConstants.FONT_SMALL_BOLD})
                                            .addKeyValueLine("Demands Paid/Pending", repaymentInfo['demandsPaidAndPending'], {font:PrinterConstants.FONT_SMALL_BOLD})
                                            .addStrRepeatingLine("-", {font: PrinterConstants.FONT_LARGE_BOLD})
                                            .addLine(opts['company_name'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("CIN :" + opts['cin'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine(opts['address1'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine(opts['address2'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine(opts['address3'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("Website :" + opts['website'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("Helpline No :" + opts['helpline'], {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("", {})
                                            .addLine("", {})
                                            .addLine("Signature not required as this is an", {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL})
                                            .addLine("electronically generated receipt.", {'center': true, font: PrinterConstants.FONT_SMALL_NORMAL});

                                        return pData;
                                    }

                                    var fullPrintData = new PrinterData();

                                    for (var i=0; i<model.repayments.length; i++){
                                        var r = model.repayments[i];
                                        var repaymentInfo = {
                                            'repaymentDate': r.repaymentDate,
                                            'customerURN': r.urnNo,
                                            'accountNumber': r.accountId,
                                            'transactionType': r.transactionName,
                                            'transactionID': 1,
                                            'demandAmount': r.demandAmount,
                                            'amountPaid': r.demandAmount,
                                            'payOffAmount': r.payOffAmount,
                                            'accountName': r.accountName,
                                            'demandsPaidAndPending': (1 + r.numSatisifiedDemands) + " / " + parseInt(r.numDemands - r.numSatisifiedDemands)
                                        };
                                        var opts = {
                                            'entity_name': "Pudhuaaru KGFS",
                                            'company_name': "IFMR Rural Channels and Services Pvt. Ltd.",
                                            'cin': 'U74990TN2011PTC081729',
                                            'address1': 'IITM Research Park, Phase 1, 10th Floor',
                                            'address2': 'Kanagam Village, Taramani',
                                            'address3': 'Chennai - 600113, Phone: 91 44 66687000',
                                            'website': "http://ruralchannels.kgfs.co.in",
                                            'helpline': '18001029370'
                                        }

                                        var pData = getPrintReceipt(repaymentInfo, opts);
                                        pData.addLine("", {});
                                        pData.addLine("", {});
                                        fullPrintData.addLines(pData.getLines());
                                    }

                                    cordova.plugins.irfBluetooth.print(function(){
                                        console.log("succc callback");
                                    }, function(err){
                                        console.error(err);
                                        console.log("errr collback");
                                    }, fullPrintData.getLines());
                                }
                            }
                        ]
                    }
                ],
                schema: {
                    "$schema": "http://json-schema.org/draft-04/schema#",
                    "type": "object",
                    "properties": {
                        "advanceRepayment": {
                            "title":"ADVANCE_REPAYMENT",
                            "type": "boolean"
                        },
                        "repayments": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {

                                    "accountId": {
                                        "type": "string",
                                        "title":"ACCOUNT_ID"
                                    },
                                    "amount": {
                                        "type": "integer",
                                        "title":"AMOUNT"
                                    },
                                    "authorizationRemark": {
                                        "type": "string",
                                        "title":"AUTHORIZATION_REMARK"
                                    },
                                    "authorizationUsing": {
                                        "type": "string",
                                        "title":"AUTHORIZATION_USING"
                                    },
                                    "cashCollectionRemark": {
                                        "type": "string",
                                        "title":"CASH_COLLECTION_REMARK"
                                    },
                                    "groupCode": {
                                        "type": "string",
                                        "title":"GROUP_CODE"
                                    },
                                    "productCode": {
                                        "type": "string",
                                        "title":"PRODUCT_CODE"
                                    },
                                    "remarks": {
                                        "type": "string",
                                        "title":"REMARKS"
                                    },
                                    "repaymentDate": {
                                        "type": "string",
                                        "title":"REPAYMENT_DATE"
                                    },
                                    "transactionId": {
                                        "type": "string",
                                        "title":"TRANSACTION_ID"
                                    },
                                    "transactionName": {
                                        "type": "string",
                                        "title":"TRANSACTION_NAME"


                                    },
                                    "urnNo": {
                                        "type": "string",
                                        "title":"URN_NO"
                                    }
                                },
                                "required": [
                                    "accountId",
                                    "amount",
                                    "cashCollectionRemark",
                                    "groupCode",
                                    "productCode",
                                    "repaymentDate",
                                    "transactionName",
                                    "urnNo"
                                ]
                            }
                        }
                    },
                    "required": [
                        "repayments"
                    ]
                },
                actions: {
                    preSave: function (model, formCtrl) {
                        var deferred = $q.defer();
                        model._storedData = null;
                        deferred.resolve();
                        return deferred.promise;
                    },
                    submit: function (model, formCtrl, formName) {
                        $log.info("Inside submit");
                        console.log(formCtrl);
                        var reqData = _.cloneDeep(model);
                        var msg="";
                        for(var i=0;i<reqData.repayments.length;i++) {

                            //Check for advance repayments
                            if(reqData.repayments[i].transactionName=="Advance Repayment") {
                                reqData.advanceRepayment = true;
                                msg = "There are Advance Repayments - ";
                            }

                            //check for larger amounts
                            if(Number(reqData.repayments[i].amount)>reqData.repayments[i].additional.accountBalance) {
                                msg = "For URN "+reqData.repayments[i].urnNo;
                                msg+=" Payable amount is larger than account balance."
                                Utils.alert(msg);
                                return;
                            }
                        }

                        if(window.confirm(msg+"Are you Sure?")){
                            PageHelper.showLoader();


                            LoanAccount.groupRepayment(reqData, function(resp, headers){
                                console.log(resp);
                                try {
                                    alert(resp.response);
                                    model.repaymentResponse = resp;
                                    model.ui.submissionDone = true;
                                }catch(err){
                                    console.error(err);
                                    PageHelper.showProgress("group-repay","Oops. An Error Occurred",3000);
                                }

                            },function(resp){
                                console.error(resp);
                                try{
                                    PageHelper.showErrors(resp);
                                }catch(err){
                                    console.error(err);
                                }

                                PageHelper.showProgress("group-repay","Oops. An Error Occurred",3000);
                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });
                        }
                    }
                }
            }
        }]);
