irf.pageCollection.factory(irf.page("loans.individual.disbursement.Disbursement"),
    ["$log", "Enrollment", "SessionStore","$state", "$stateParams", "PageHelper", "IndividualLoan", "SchemaResource", "Utils","LoanAccount","formHelper","Queries","LoanAccount",
        function($log, Enrollment, SessionStore,$state,$stateParams, PageHelper, IndividualLoan, SchemaResource, Utils,LoanAccount,formHelper,Queries,LoanAccount){

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
                model.fee=model.fee||{};

                model.additional = {"branchName":branch};

                model.siteCode = SessionStore.getGlobalSetting("siteCode");
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
                        if(model.siteCode == 'KGFS' && resp[0].fees) {
                            model.additional.feeamount = [];
                            for (var i = 0; i < resp[0].fees.length; i++){
                                if(resp[0].fees[i].param1 != "Cibil Charges") {
                                    model.additional.feeamount.push(resp[0].fees[i]);
                                }
                            }
                        } else {
                            model.additional.feeamount=resp[0].fees;
                        }

                        model.additional.netDisbursementAmount = Number(resp[0].netDisbursementAmount);
                        var j=1;
                        if(model.additional.tempfees){
                            for (var i=0;i<model.additional.tempfees.length; i++) {
                                if(model.siteCode == 'KGFS' && model.additional.tempfees[i].param1 == "Cibil Charges")
                                    continue;
                                if(model.additional.tempfees[i].amount1 != "0")
                                    model.additional.fees.push(model.additional.tempfees[i]);
                            }
                        }
                        model.loanAccountDisbursementSchedule = model.loanAccountDisbursementSchedule || {};
                        if (!model._disbursement) {
                            $log.info("Page visited directly");
                            $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.ReadyForDisbursementQueue', pageId: null});
                        } else {
                            model.loanAccountDisbursementSchedule=model._disbursement;
                            $log.info("Printing the loanAccountDisbursementSchedule");
                            $log.info(model.loanAccountDisbursementSchedule);
                        }
                        if(model.additional.netDisbursementAmount >= 200000){
                              model.loanAccountDisbursementSchedule.modeOfDisbursement = "RTGS";
                        }else{
                            model.loanAccountDisbursementSchedule.modeOfDisbursement = "NEFT";
                        }
                       
                        model.loanAccountDisbursementSchedule.overrideStatus = "Requested";
                        model.loanAccountDisbursementSchedule.firstRepaymentDate =model.additional.firstRepaymentDate;

                        model.loanAccountDisbursementSchedule.disbursementAmount = Number(resp[0].amount);


                        Enrollment.getCustomerById({
                                id: model.additional.customerId
                            },
                            function(res) {
                                model.customer = res;

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
                        "key": "loanAccountDisbursementSchedule.firstRepaymentDate",
                        "condition":"model.siteCode=='KGFS'",
                        "title":"FIRST_REPAYMENT_DATE",
                        "type":"date",
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.modeOfDisbursement",
                        "condition":"model.siteCode !=='KGFS'",
                        "title": "MODE_OF_DISBURSEMENT",   
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
                        "enumCode": "mode_of_disbursement",
                    },
                    {
                        key: "loanAccountDisbursementSchedule.disbursementFromBankAccountNumber",
                        type: "lov",
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
                        key: "loanAccountDisbursementSchedule.customerNameInBank",
                        title: "CUSTOMER_NAME_IN_BANK",
                        "readonly":true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.customerAccountNumber",
                        "title": "CUSTOMER_BANK_ACC_NO",
                        "readonly":true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.ifscCode",
                        "title": "CUSTOMER_BANK_IFSC",
                        "readonly":true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.customerBankBranchName",
                        "title":"BRANCH_NAME",
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
                        condition: "!model.loanAccountDisbursementSchedule.overrideRequested && model.siteCode=='KGFS'",
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
            }],
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

                                }).$promise.finally(function(){
                                    PageHelper.hideLoader();
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
