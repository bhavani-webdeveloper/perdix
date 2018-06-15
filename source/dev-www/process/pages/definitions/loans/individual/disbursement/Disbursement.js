irf.pageCollection.factory(irf.page("loans.individual.disbursement.Disbursement"),
    ["$log", "Enrollment","BiometricService","elementsUtils", "SessionStore","$state", "$stateParams", "PageHelper", "IndividualLoan", "SchemaResource", "Utils","LoanAccount","formHelper","Queries","LoanAccount",
        function($log, Enrollment,BiometricService,elementsUtils, SessionStore,$state,$stateParams, PageHelper, IndividualLoan, SchemaResource, Utils,LoanAccount,formHelper,Queries,LoanAccount){

        var branch = SessionStore.getBranch();
        var backToQueue = function(){
            $state.go("Page.Engine",{
                pageName:"loans.individual.disbursement.ReadyForDisbursementQueue",
                pageId:null
            });
        };
        return {
            "type": "schema-form",
            "title": "DISBURSE_LOAN",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                $log.info("Disbursement Page got initialized");
                model.customer=model.customer||{};
                model.loanAccountDisbursementSchedule = model.loanAccountDisbursementSchedule || {};
                model.fee=model.fee||{};
                model.additional = {"branchName":branch};
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                if (!model._disbursement) {
                    $log.info("Page visited directly");
                    $state.go('Page.Engine', {
                        pageName: 'loans.individual.disbursement.ReadyForDisbursementQueue',
                        pageId: null
                    });
                } else {
                    model.loanAccountDisbursementSchedule = model._disbursement;
                    $log.info("Printing the loanAccountDisbursementSchedule");
                    $log.info(model.loanAccountDisbursementSchedule);
                }
                try {
                    var loanId = ($stateParams['pageId'].split('.'))[0];
                    var disbursementId = ($stateParams['pageId'].split('.'))[1];
                    $log.info("loanId ::" + loanId);
                    PageHelper.showLoader();
                    PageHelper.showProgress('loan-fetch', 'Fetching Loan Details');
                    IndividualLoan.getDisbursementList({"loanIdlist":loanId}, function (resp, head) {
                        model.additional.accountNumber = resp[0].accountId;
                        model.additional.customerId = resp[0].customerId;
                        model.additional.numberOfDisbursements = resp[0].numDisbursements;
                        model.additional.productCode = resp[0].productCode;
                        model.additional.urnNo = resp[0].urnNo;
                        model.additional.fees=[];
                        model.additional.tempfees = resp[0].fees;
                        model.additional.firstRepaymentDate = resp[0].firstRepaymentDate;
                        model.additional.loanamount=resp[0].amount;
                        model.additional.feeamount=resp[0].fees;
                        model.additional.transactionType = resp[0].transactionType;
                        model.loanAccountDisbursementSchedule.feeAmountPayment= resp[0].feeAmountPayment;
                        model.loanAccountDisbursementSchedule.penalInterestDuePayment= resp[0].penalInterestDuePayment;
                        model.loanAccountDisbursementSchedule.normalInterestDuePayment= resp[0].normalInterestDuePayment;
                        model.loanAccountDisbursementSchedule.principalDuePayment= resp[0].principalDuePayment;
                        model.loanAccountDisbursementSchedule.linkedAccountNumber= resp[0].linkedAccountNumber;

                        model.loanAccountDisbursementSchedule.linkedAccountTotalFeeDue= resp[0].linkedAccountTotalFeeDue;
                        model.loanAccountDisbursementSchedule.linkedAccountPenalInterestDue= resp[0].linkedAccountPenalInterestDue;
                        model.loanAccountDisbursementSchedule.linkedAccountNormalInterestDue= resp[0].linkedAccountNormalInterestDue;
                        model.loanAccountDisbursementSchedule.linkedAccountTotalPrincipalDue= resp[0].linkedAccountTotalPrincipalDue;




                        /*if(model.siteCode == 'KGFS' && resp[0].fees) {
                            model.additional.feeamount = [];
                            for (var i = 0; i < resp[0].fees.length; i++){
                                if(resp[0].fees[i].param1 != "Cibil Charges") {
                                    model.additional.feeamount.push(resp[0].fees[i]);
                                }
                            }
                        } else {
                            model.additional.feeamount=resp[0].fees;
                        }
*/

                        model.additional.netDisbursementAmount = Number(resp[0].netDisbursementAmount);
                        var j=1;
                        if(model.additional.tempfees){
                            for (var i=0;i<model.additional.tempfees.length; i++) {
                                if(model.additional.tempfees[i].amount1 != "0")
                                    model.additional.fees.push(model.additional.tempfees[i]);
                            }
                        }

                        if(model.additional.netDisbursementAmount >= 200000){
                              model.loanAccountDisbursementSchedule.modeOfDisbursement = "RTGS";
                        }else{
                            model.loanAccountDisbursementSchedule.modeOfDisbursement = "NEFT";
                        }

                        model.loanAccountDisbursementSchedule.overrideStatus = "Requested";
                        model.loanAccountDisbursementSchedule.firstRepaymentDate =model.additional.firstRepaymentDate;

                        model.loanAccountDisbursementSchedule.disbursementAmount = Number(resp[0].amount);

                        if(model.siteCode == 'sambandh') {
                            model.additional.netDisbursementAmount = Number(resp[0].amount);
                            model.loanAccountDisbursementSchedule.modeOfDisbursement = "CASH";
                        }


                        Enrollment.getCustomerById({
                                id: model.additional.customerId
                            },
                            function(res) {
                                model.customer = res;
                                if (typeof(cordova)!=='undefined' && cordova && cordova.plugins && cordova.plugins.irfBluetooth && _.isFunction(cordova.plugins.irfBluetooth.enroll)) {
                                model.customer.iscordova=true;
                                }else{
                                model.customer.iscordova=false;
                                }
                            });
                        $log.info(model.customer);
                    },
                    function (resp) {
                        PageHelper.showProgress('loan-fetch', 'Oops. An Error Occurred', 5000);
                        PageHelper.showErrors(resp);


                    }).$promise.finally(function () {
                        PageHelper.hideLoader();
                    });
                }
                catch(err){
                    console.error(err);
                    PageHelper.showProgress('loan-fetch', 'Oops. An Error Occurred', 5000);
                }


            },
            offline: false,
            getOfflineDisplayItem: function(item, index){

            },
            form: [{
                "type": "box",
                "title": "DISBURSEMENT_DETAILS", // sample label code
                //"readonly": false, // default-false, optional, this & everything under items becomes readonly
                "items": [
                    {
                        "key": "additional.transactionType",
                        "condition": "model.additional.transactionType",
                        "type":"string",
                        "title":"TRANSACTION_TYPE",
                        "readonly":true
                    },
                    {
                        "key": "additional.accountNumber",
                        "title":"ACCOUNT_NUMBER",
                        "readonly":true
                    },
                    /*{
                        "key": "loanAccountDisbursementSchedule.disbursementAmount",
                        "title":"DISBURSEMENT_AMOUNT",
                        "type":"amount",
                        "readonly":true
                    },*/
                    {
                        "key": "additional.netDisbursementAmount",
                        "title":"NET_DISBURSEMENT_AMOUNT",
                        "type":"amount",
                        "readonly":true
                    },
                    {
                        "key": "additional.loanamount",
                        "condition":"model.siteCode=='KGFS'",
                        "title":"LOAN_AMOUNT_REQUESTED",
                        "readonly":true
                    },
                    {
                        key: "additional.feeamount",
                        "condition":"model.siteCode=='KGFS'",
                        type: "array",
                        add:null,
                        title: "FEES",
                        "titleExpr":"model.additional.feeamount[arrayIndex].param1",
                        items: [{
                            "key": "additional.feeamount[].param1",
                            "readonly":true,
                            "title": "FEE_TYPE",
                        }, {
                            "key": "additional.feeamount[].amount1",
                            "readonly":true,
                            "title": "AMOUNT",
                        }]
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.firstRepaymentDate",
                        "condition":"model.siteCode=='KGFS'",
                        "title":"FIRST_REPAYMENT_DATE",
                        "type":"date",
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.modeOfDisbursement",
                        "condition":"!model.siteCode || model.siteCode == 'kinara'",
                        "title": "MODE_OF_DISBURSEMENT",
                        "required": true,
                        "type": "select",
                        "titleMap": [{
                            value: "NEFT",
                            name: "NEFT"
                        },{
                            value: "RTGS",
                            name: "RTGS"
                        }]
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.modeOfDisbursement",
						"condition":"model.siteCode =='KGFS'",
                        "title": "MODE_OF_DISBURSEMENT",
                        "type": "select",
                        "enumCode": "mode_of_disbursement"
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.modeOfDisbursement",
                        "condition":"model.siteCode == 'witfin'",
                        "title": "MODE_OF_DISBURSEMENT",
                        "type": "select",
                        "enumCode": "disbursement_mode"
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.modeOfDisbursement",
                        "condition":"model.siteCode =='sambandh' || model.siteCode =='saija'",
                        "required": true,
                        "title": "MODE_OF_DISBURSEMENT",
                        "type": "select",
                        "enumCode": "mode_of_disbursement",
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.referenceNumber",
                        "title": "CHEQUE_NO",
                        "condition":"model.siteCode=='witfin'&& model.loanAccountDisbursementSchedule.modeOfDisbursement=='Cheque'"
                    },
                    {
                        key: "loanAccountDisbursementSchedule.disbursementFromBankAccountNumber",
                        type: "lov",
                        condition: "model.loanAccountDisbursementSchedule.modeOfDisbursement !== 'CASH'",
                        "schema":{
                            "type":["string","null"]
                        },
                        autolov: true,
                        //"required":true,
                        title:"DISBURSEMENT_FROM_ACCOUNT",
                        bindMap: {

                        },
                        outputMap: {
                            "account_number": "loanAccountDisbursementSchedule.disbursementFromBankAccountNumber"
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            //return Queries.getBankAccountsByProduct(model.additional.productCode,true,false);
                            return Queries.getBankAccountsByProduct(model.additional.productCode,true,false);
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.account_number,
                                item.ifsc_code + ', ' + item.bank_name,
                                item.branch_name
                            ];
                        }
                    },
                    {
                        "key":"customer.firstName",
                        "title":"APPLICANT_NAME",
                        "readonly": true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.productCode",
                        "title": "PRODUCT",
                        "type": "select",
                        "enumCode": "loan_product",
                        "readonly": true
                    },
                    {
                        key: "loanAccountDisbursementSchedule.customerNameInBank",
                        title: "CUSTOMER_NAME_IN_BANK",
                        condition: "model.loanAccountDisbursementSchedule.modeOfDisbursement !== 'CASH'",
                        "readonly":true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.customerAccountNumber",
                        "title": "CUSTOMER_BANK_ACC_NO",
                        condition: "model.loanAccountDisbursementSchedule.modeOfDisbursement !== 'CASH'",
                        "readonly":true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.ifscCode",
                        "title": "CUSTOMER_BANK_IFSC",
                        condition: "model.loanAccountDisbursementSchedule.modeOfDisbursement !== 'CASH'",
                        "readonly":true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.customerBankBranchName",
                        "title":"BRANCH_NAME",
                        condition: "model.loanAccountDisbursementSchedule.modeOfDisbursement !== 'CASH'",
                        readonly:true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.overrideRequested",
                        "condition":"model.siteCode=='KGFS'",
                        "type": "checkbox",
                        "title": "OVERRIDE_FINGERPRINT",
                        "schema":{
                            "default": false
                        }
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.overrideRequestRemarks",
                        "type":"textarea",
                        required:true,
                        "title": "OVERRIDE_REMARKS",
                        "condition": "model.loanAccountDisbursementSchedule.overrideRequested && model.siteCode=='KGFS'"
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.overrideStatus",
                        "type":"select",
                        required:true,
                        readonly:true,
                        "titleMap":{
                            "Requested":"Requested",
                            "Approved":"Approved"
                        },
                        "title": "OVERRIDE_STATUS",
                        "condition": "model.loanAccountDisbursementSchedule.overrideRequested && model.siteCode=='KGFS'"
                    },
                    {
                        type: "fieldset",
                        condition: "(!model.loanAccountDisbursementSchedule.overrideRequested && model.siteCode=='KGFS')&& model.customer.iscordova",
                        title: "VALIDATE_BIOMETRIC",
                        items: [{
                            key: "loanAccountDisbursementSchedule.fpVerified",
                            required:true,
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
                    {
                        type: "button",
                        condition: "(!model.loanAccountDisbursementSchedule.overrideRequested && model.siteCode=='KGFS') && !model.customer.iscordova",
                        title: "VALIDATE_BIOMETRIC",
                        notitle: true,
                        fieldHtmlClass: "btn-block",
                        onClick: function(model, form, formName) {
                            var fingerprintObj = {
                                'LeftThumb': model.customer.leftHandThumpImageId,
                                'LeftIndex': model.customer.leftHandIndexImageId,
                                'LeftMiddle': model.customer.leftHandMiddleImageId,
                                'LeftRing': model.customer.leftHandRingImageId,
                                'LeftLittle': model.customer.leftHandSmallImageId,
                                'RightThumb': model.customer.rightHandThumpImageId,
                                'RightIndex': model.customer.rightHandIndexImageId,
                                'RightMiddle': model.customer.rightHandMiddleImageId,
                                'RightRing': model.customer.rightHandRingImageId,
                                'RightLittle': model.customer.rightHandSmallImageId
                            };

                            BiometricService.validate(fingerprintObj).then(function(data) {
                                model.customer.isBiometricMatched = data;
                                if (data == "Match found") {
                                    model.loanAccountDisbursementSchedule.fpVerified = true;
                                } else {
                                    model.loanAccountDisbursementSchedule.fpVerified = false;
                                }
                            }, function(reason) {
                                console.log(reason);
                            });
                        }
                    }, {
                        "key": "customer.isBiometricMatched",
                        condition: "(!model.loanAccountDisbursementSchedule.overrideRequested && model.siteCode=='KGFS') && !model.customer.iscordova",
                        "title": "Is Biometric Matched",
                        "readonly": true
                    },
                    {
                        "type":"actions",
                        "items":[
                            {
                                "type": "button",
                                "title": "BACK",
                                "onClick": "actions.goBack(model, formCtrl, form, $event)"
                            },
                            {
                                "type":"button",
                                "condition":"model.loanAccountDisbursementSchedule.overrideRequested",
                                "title":"DISBURSE",
                                "icon":"fa fa-money",
                                "onClick":"actions.disburseLoan(model,formCtrl,form)"
                            }/*,
                            {
                                "type":"button",
                                "title":"REJECT",
                                "onClick":"actions.rejectLoan(model,formCtrl,form)"
                            }*/
                        ]
                    }
                ]
            },
            {
                "type": "box",
                "title": "Internal ForeClosure Details",
                "condition": "model.siteCode == 'kinara' && model.loanAccountDisbursementSchedule.linkedAccountNumber",
                "items": [{
                        "type": "fieldset",
                        "title": "Linked Account Outstanding Loan Details",
                        "items": [{
                                "key": "loanAccountDisbursementSchedule.linkedAccountNumber",
                                "title": "LINKED_ACCOUNT_NUMBER",
                                "readonly": true
                            }, {
                                "key": "loanAccountDisbursementSchedule.linkedAccountTotalPrincipalDue",
                                "title": "TOTAL_PRINCIPAL_DUE",
                                "readonly": true
                            }, {
                                "key": "loanAccountDisbursementSchedule.linkedAccountNormalInterestDue",
                                "title": "TOTAL_INTEREST_DUE",
                                "readonly": true
                            }, {
                                "key": "loanAccountDisbursementSchedule.linkedAccountPenalInterestDue",
                                "title": "TOTAL_PENAL_INTEREST_DUE",
                                "readonly": true
                            }, {
                                "key": "loanAccountDisbursementSchedule.linkedAccountTotalFeeDue",
                                "title": "TOTAL_FEE_DUE",
                                "readonly": true
                            }
                        ]
                    }, {
                        "type": "fieldset",
                        "title": "WAIVER_DETAILS",
                        "items": [{
                                "key": "loanAccountDisbursementSchedule.normalInterestDuePayment",
                                "type": "amount",
                                "title": "TOTAL_INTEREST_DUE",
                                "readonly": true
                            }, {
                                "key": "loanAccountDisbursementSchedule.penalInterestDuePayment",
                                "type": "amount",
                                "title": "TOTAL_PENAL_INTEREST_DUE",
                                "readonly": true
                            }, {
                                "key": "loanAccountDisbursementSchedule.feeAmountPayment",
                                "type": "amount",
                                "title": "TOTAL_FEE_DUE",
                                "readonly": true
                            }
                        ]
                    }
                ]
            }
            


            ],
            schema: function() {
                return SchemaResource.getDisbursementSchema().$promise;
            },
            actions: {
                goBack: function (model, formCtrl, form, $event) {
                    backToQueue();
                },
                disburseLoan:function(model, formCtrl, form){
                    formCtrl.scope.$broadcast("schemaFormValidate");
                    if(!formCtrl.$valid){
                        PageHelper.showProgress('disbursement', "Errors found in the form. Please fix to continue",3000);
                        return;
                    }

                    if (!model.loanAccountDisbursementSchedule.overrideRequested && model.loanAccountDisbursementSchedule.fpVerified!= true && model.siteCode == 'KGFS') {
                        elementsUtils.alert('Fingerprint not verified.');
                        return;
                    }

                    if(window.confirm("Perform Disbursement?")){

                        PageHelper.showLoader();
                        var accountNumber = model.additional.accountNumber;
                        var accountId = model.loanAccountDisbursementSchedule.loanId;

                        model.loanAccountDisbursementSchedule.udf1 = "Sent to Bank";
                        PageHelper.showProgress('disbursement', 'Disbursing ' + accountId + '. Please wait.');

                        LoanAccount.activateLoan({"accountId": accountNumber},
                            function(data){
                                $log.info("Inside success of activateLoan");
                                var currDate = moment(new Date()).format("YYYY-MM-DD");
                                model.loanAccountDisbursementSchedule.accountNumber = accountNumber;

                                var reqUpdateDisbData = _.cloneDeep(model);
                                delete reqUpdateDisbData.$promise;
                                delete reqUpdateDisbData.$resolved;
                                delete reqUpdateDisbData._disbursement;
                                delete reqUpdateDisbData.additional;
                                delete reqUpdateDisbData.arrayIndex;
                                reqUpdateDisbData.disbursementProcessAction = "SAVE";
                                IndividualLoan.updateDisbursement(reqUpdateDisbData,function(resp,header){
                                    var toSendData = [];
                                    toSendData.push(model.loanAccountDisbursementSchedule);
                                    var reqData = {};

                                    reqData.stage = "DisbursementConfirmation";
                                    reqData.loanAccountDisbursementSchedules = toSendData;
                                    $log.info(reqData);

                                    IndividualLoan.batchDisburse(reqData,
                                        function(data){
                                            PageHelper.showProgress('disbursement', 'Disbursement done', 2000);
                                            model.additional.disbursementDone=true;
                                            PageHelper.hideLoader();
                                            $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.ReadyForDisbursementQueue', pageId: null});

                                        },
                                        function(res){
                                            PageHelper.showErrors(res);
                                            PageHelper.showProgress('disbursement', 'Disbursement failed', 2000);
                                        }).$promise.finally(function() {
                                            PageHelper.hideLoader();
                                        }
                                    );
                                },function(resp){
                                    PageHelper.showProgress("upd-disb","Oops. An error occurred","5000");
                                    PageHelper.showErrors(resp);
                                    PageHelper.hideLoader();
                                }).$promise.finally(function(){
                                });
                            },
                            function(res){
                                PageHelper.hideLoader();
                                PageHelper.showErrors(res);
                                PageHelper.showProgress('disbursement', 'Error while activating loan.', 2000);
                            });
                    }

                },
                submit: function(model, form, formName){
                    if(window.confirm("Are you sure?")){
                        PageHelper.showLoader();
                        var reqData = _.cloneDeep(model);
                        reqData.disbursementProcessAction = "SAVE";
                        model.loanAccountDisbursementSchedule.udf1 = "";
                        reqData.stage = "DisbursementConfirmation";

                        IndividualLoan.updateDisbursement(reqData,function(resp,header){

                            reqData = _.cloneDeep(resp);
                            delete reqData.$promise;
                            delete reqData.$resolved;
                            reqData.disbursementProcessAction = "PROCEED";
                            reqData.stage = "DisbursementConfirmation";
                            IndividualLoan.updateDisbursement(reqData,function(resp,header){
                                PageHelper.showProgress("upd-disb","Done.","5000");
                                backToQueue();
                            },function(resp){
                                PageHelper.showProgress("upd-disb","Oops. An error occurred","5000");
                                PageHelper.showErrors(resp);

                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });

                        },function(resp){
                            PageHelper.showErrors(resp);
                            PageHelper.showProgress("upd-disb","Oops. An error occurred","5000");
                            PageHelper.hideLoader();
                        });
                    }
                }
            }
        };
    }]);
