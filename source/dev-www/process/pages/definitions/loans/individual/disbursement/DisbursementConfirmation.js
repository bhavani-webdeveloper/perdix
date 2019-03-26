irf.pageCollection.factory(irf.page("loans.individual.disbursement.DisbursementConfirmation"),
    ["$log", "$q", "Enrollment", "GroupProcess", "LoanAccount", "SessionStore", "$state", "$stateParams", "PageHelper", "IndividualLoan", "SchemaResource", "Utils", "Locking",
        function ($log, $q, Enrollment, GroupProcess, LoanAccount, SessionStore, $state, $stateParams, PageHelper, IndividualLoan, SchemaResource, Utils, Locking) {

            var branch = SessionStore.getBranch();
            var backToQueue = function () {
                $state.go("Page.Engine", {
                    pageName: "loans.individual.disbursement.DisbursementConfirmationQueue",
                    pageId: null
                });
            };

            return {
                "type": "schema-form",
                "title": "DISBURSEMENT_CONFIRMATION",
                "subTitle": "",
                "processType": "Loan",
                "processName": "Disbursement",
                "lockingRequired": true,
                initialize: function (model, form, formCtrl) {
                    model.loanacount = model.loanacount || {};
                    model.siteCode = SessionStore.getGlobalSetting("siteCode");
                    try {
                        var loanId = ($stateParams['pageId'].split('.'))[0];
                        var disbursementId = ($stateParams['pageId'].split('.'))[1];
                        PageHelper.showLoader();
                        PageHelper.showProgress('loan-fetch', 'Fetching Loan Details');


                        if (!model._disbursementConfirmation) {
                            $log.info("Page visited directly");
                            backToQueue();
                            return;
                        }
                        IndividualLoan.get({ id: loanId }, function (resp, head) {
                            model.loanacount = resp;
                            var disbExistFlag = false;
                            for (var i = 0; i < resp.disbursementSchedules.length; i++) {
                                var disbSchedule = resp.disbursementSchedules[i];
                                console.log(disbSchedule);
                                if (disbSchedule.id == disbursementId) {
                                    model.loanAccountDisbursementSchedule = disbSchedule;
                                    model.loanAccountDisbursementSchedule.udf1 = null;
                                    Utils.removeNulls(model, true);
                                    disbExistFlag = true;
                                    break;
                                }
                            }
                            if (!disbExistFlag) {
                                PageHelper.showProgress('loan-fetch', 'Failed to load Disbursement', 5000);
                            }
                            else {
                                PageHelper.showProgress('loan-fetch', 'Done.', 5000);
                            }
                            model.additional = {
                                applicant : [],
                                coapplicant : [],
                                guarantor : [],
                                isEntity : false
                            }
                            model.additional.globalCount = 0;
                            Enrollment.getCustomerById({id: model.loanacount.customerId}).$promise.then(data => {
                                model.additional.customer = data;
                                PageHelper.showLoader();
                                model.additional.isEntity = data.customerType == "Individual" ? false : true;
                                for (var i=0;i<model.loanacount.loanCustomerRelations.length;i++){
                                    if (!model.additional.isEntity && model.loanacount.loanCustomerRelations[i].relation == "Applicant"){
                                        model.additional.globalCount += 1;
                                        if(model.additional.globalCount == model.loanacount.loanCustomerRelations.length){
                                            PageHelper.hideLoader();
                                        }
                                        continue;
                                    }
                                    (function(index){
                                        Enrollment.getCustomerById({id:model.loanacount.loanCustomerRelations[index].customerId}).$promise.then(customer =>{
                                            var type = ((model.loanacount.loanCustomerRelations[index].relation).replace('-','')).toLowerCase();
                                            model.additional[type].push(customer);
                                            model.additional.globalCount += 1;
                                            if(model.additional.globalCount == model.loanacount.loanCustomerRelations.length){
                                                PageHelper.hideLoader();
                                            }
                                        },function(err){
                                            model.additional.globalCount += 1;
                                            if(model.additional.globalCount == model.loanacount.loanCustomerRelations.length){
                                                PageHelper.hideLoader();
                                            }
                                        })
                                    })(i)
                                }
                                    
                            })                            
                            console.log(model);
                            LoanAccount.get({
                                accountId: model.loanacount.accountNumber
                            }).$promise.then(function (resp) {
                                model.loanacount.customer1FirstName = resp.customer1FirstName;
                                for (i = 0; i < resp.transactions.length; i++) {
                                    if (resp.transactions[i].transactionName == "Disbursement") {
                                        model.loanacount.transactionId = resp.transactions[i].transactionId;
                                        model.loanacount.transactionType = resp.transactions[i].instrument;
                                    }
                                }
                            });

                        },
                            function (resp) {
                                PageHelper.showProgress('loan-fetch', 'Oops. An Error Occurred', 5000);
                                PageHelper.showErrors(resp);

                            }).$promise.finally(function () {
                                PageHelper.hideLoader();
                            });
                    }
                    catch (err) {
                        console.error(err);
                        PageHelper.showProgress('loan-fetch', 'Oops. An Error Occurred', 5000);
                    }

                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {

                },
                form: [
                    {
                    "type": "box",
                    "title": "DISBURSEMENT_DETAILS",
                    "items": [

                        {
                            "key": "loanAccountDisbursementSchedule.udf1",
                            "type": "select",
                            "required": true,
                            "titleMap": [{
                                "name": "Confirmed",
                                "value": "Confirmed"
                            },
                            {
                                "name": "Rejected",
                                "value": "Rejected"
                            }
                            ]
                        },
                        {
                            "key": "loanAccountDisbursementSchedule.actualDisbursementDate",
                            "type": "date",
                            "title": "ACTUAL_DISBURSEMENT_DATE",
                            "readonly": true
                        },
                        {
                            "key": "loanAccountDisbursementSchedule.modeOfDisbursement",
                            "title": "MODE_OF_DISBURSEMENT",
                            "readonly": true
                        },
                        {
                            "key": "loanAccountDisbursementSchedule.referenceDate",
                            "title": "DATE",
                            "type": "date",
                            "condition": "model.loanAccountDisbursementSchedule.modeOfDisbursement!='CASH'"
                        },
                        {
                            "key": "loanAccountDisbursementSchedule.referenceNumber",
                            "title": "REFERENCE_NO",
                            "condition": "model.loanAccountDisbursementSchedule.modeOfDisbursement!='CASH'&& model.loanAccountDisbursementSchedule.udf1=='Rejected'"
                        },
                        {
                            "key": "loanAccountDisbursementSchedule.referenceNumber",
                            "title": "REFERENCE_NO",
                            "required": true,
                            "condition": "model.loanAccountDisbursementSchedule.modeOfDisbursement!='CASH'&& model.loanAccountDisbursementSchedule.udf1=='Confirmed'"
                        },
                        {
                            "key": "loanAccountDisbursementSchedule.udf5",
                            "title": "FINANCE_TEAM_REJECTION_REASON",
                            "type": "select",
                            "condition": "model.loanAccountDisbursementSchedule.udf1=='Rejected'"
                        },
                        {
                            "key": "loanAccountDisbursementSchedule.udf4",
                            "title": "FINANCE_TEAM_REJECTION_REMARKS",
                            "condition": "model.loanAccountDisbursementSchedule.udf1=='Rejected'"
                        },
                        // {
                        //     "type": "actionbox",
                        //     "condition": "model.siteCode=='KGFS'",
                        //     "items": [{
                        //         "type": "submit",
                        //         "title": "Update"
                        //     }, {
                        //         "title": "Print Receipt",

                        //         "type": "button",
                        //         "onClick": function (model, formCtrl, form, $event) {
                        //             var repaymentInfo = {
                        //                 'customerURN': model.loanacount.urnNo,
                        //                 'customerId': model.loanacount.customerId,
                        //                 'customerName': model.loanacount.customer1FirstName,
                        //                 'accountNumber': model.loanacount.accountNumber,
                        //                 'transactionType': "Disbursement",
                        //                 'transactionID': model.loanacount.transactionId,
                        //                 'productCode': model.loanacount.productCode,
                        //                 'loanAmount': model.loanacount.loanAmountRequested,
                        //                 'disbursedamount': model.loanacount.loanAmount,
                        //                 'partnerCode': model.loanacount.partnerCode,
                        //             };

                        //             var opts = {
                        //                 'branch': SessionStore.getBranch(),
                        //                 'entity_name': SessionStore.getBankName() + " KGFS",
                        //                 'company_name': "IFMR Rural Channels and Services Pvt. Ltd.",
                        //                 'cin': 'U74990TN2011PTC081729',
                        //                 'address1': 'IITM Research Park, Phase 1, 10th Floor',
                        //                 'address2': 'Kanagam Village, Taramani',
                        //                 'address3': 'Chennai - 600113, Phone: 91 44 66687000',
                        //                 'website': "http://ruralchannels.kgfs.co.in",
                        //                 'helpline': '18001029370',
                        //                 'branch_id': SessionStore.getBranchId(),
                        //                 'branch_code': SessionStore.getBranchCode()
                        //             };
                        //             GroupProcess.getLoanPrint(repaymentInfo, opts);
                        //         }
                        //     }]
                        // },
                        {
                            "type": "actionbox",
                            "items": [{
                                "type": "submit",
                                "title": "Update"
                            }]
                        }
                    ]
                    },
                    {
                        "type":"box",
                        "title":"LOAN_DETAILS",
                        "readonly":true,
                        "items":[
                            {
                                "key":"loanacount.accountNumber",
                                "title":"LOAN_ACCOUNT_NUMBER",
                            },
                            // {
                            //     "key":"loanacount.disbursedAmountInPaisa",
                            //     "title":"DISBURSEMENT_AMOUNT",
                            // },
                            {
                                "type":"fieldset",
                                "title":"ENTITY_DETAILS",
                                "condition":"model.additional.isEntity",
                            },
                            {
                                "type":"string",
                                "title":"ENTITY_NAME",
                                "key":"additional.customer.firstName",
                                "condition":"model.additional.isEntity",

                            },
                            {
                                "type":"string",
                                "title":"ENTITY_ID",
                                "key":"additional.customer.id",
                                "condition":"model.additional.isEntity",
                            },
                            {
                                "type":"string",
                                "title":"ENTITY_URN_NO",
                                "key":"additional.customer.urnNo",
                                "condition":"model.additional.isEntity",
                            },
                            {
                                "type":"fieldset",
                                "title":"APPLICANT_DETAILS",
                                "condition":"model.additional.isEntity",
                            },
                            {
                                "type":"array",
                                "condition":"model.additional.isEntity && model.additional.applicant.length >= 1",
                                "key":"additional.applicant",
                                "add":null,
                                "remove":null,
                                "view": "fixed",
                                "title":"APPLICANT",
                                "items":[
                                    {
                                        "type":"string",
                                        "title":"APPLICANT_NAME",
                                        "key":"additional.applicant[].firstName"
                                    },
                                    {
                                        "type":"string",
                                        "title":"APPLICANT_ID",
                                        "key":"additional.applicant[].id"
                                    },
                                    {
                                        "type":"string",
                                        "title":"APPLICANT_URN_NO",
                                        "key":"additional.applicant[].urnNo"
                                    }
                                ]
                            },
                            {
                                "type":"string",
                                "title":"APPLICANT_NAME",
                                "key":"additional.customer.firstName",
                                "condition":"!model.additional.isEntity",

                            },
                            {
                                "type":"string",
                                "title":"APPLICANT_ID",
                                "key":"additional.customer.id",
                                "condition":"!model.additional.isEntity",
                            },
                            {
                                "type":"string",
                                "title":"APPLICANT_URN_NO",
                                "key":"additional.customer.urnNo",
                                "condition":"!model.additional.isEntity",
                            },
                            {
                                "type":"fieldset",
                                "title":"CO_APPLICANT_DETAILS",
                                "condition":"model.additional.coapplicant.length >= 1"
                            },
                            {
                                "type":"array",
                                "key":"additional.coapplicant",
                                "condition":"model.additional.coapplicant.length >= 1",
                                "add":null,
                                "remove":null,
                                "view": "fixed",
                                "title":"CO_APPLICANT",
                                "items":[
                                    {
                                        "type":"string",
                                        "title":"CO_APPLICANT_NAME",
                                        "key":"additional.coapplicant[].firstName"
                                    },
                                    {
                                        "type":"string",
                                        "title":"CO_APPLICANT_ID",
                                        "key":"additional.coapplicant[].id"
                                    },
                                    {
                                        "type":"string",
                                        "title":"CO_APPLICANT_URN_NO",
                                        "key":"additional.coapplicant[].urnNo"
                                    }
                                ]
                            },
                            {
                                "type":"fieldset",
                                "title":"GUARANTOR_DETAILS",
                                "condition":"model.additional.guarantor.length >= 1"
                            },
                            {
                                "type":"array",
                                "key":"additional.guarantor",
                                "condition":"model.additional.guarantor.length >= 1",
                                "add":null,
                                "remove":null,
                                "view": "fixed",
                                "title":"GUARANTOR",
                                "items":[
                                    {
                                        "type":"string",
                                        "title":"GUARANTOR_NAME",
                                        "key":"additional.guarantor[].firstName"
                                    },
                                    {
                                        "type":"string",
                                        "title":"GUARANTOR_ID",
                                        "key":"additional.guarantor[].id"
                                    },
                                    {
                                        "type":"string",
                                        "title":"GUARANTOR_URN_NO",
                                        "key":"additional.guarantor[].urnNo"
                                    }
                                ]
                            }

                            
                        ]
                    }
                ],
                schema: function () {
                    return SchemaResource.getDisbursementSchema().$promise;
                },
                actions: {

                    submit: function (model, form, formName) {
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        if (window.confirm("Are you sure?")) {
                            PageHelper.showLoader();
                            var reqData = _.cloneDeep(model);
                            delete reqData.$promise;
                            delete reqData.$resolved;
                            if (reqData.loanAccountDisbursementSchedule.udf1 == "Rejected") {
                                reqData.disbursementConfirmations = [];
                                var targetStage;
                                if (model.loanAccountDisbursementSchedule.udf5 == 'Internal issue - Wrong bank selection')
                                    targetStage = 'ReadyForDisbursement';
                                else
                                    targetStage = 'RejectedDisbursement';
                                reqData.disbursementConfirmations.push({
                                    accountNumber: model._disbursementConfirmation.accountNumber,
                                    stage: targetStage,
                                    status: "REJECT",
                                    tranchNumber: model._disbursementConfirmation.trancheNumber,
                                    transactionId: model._disbursementConfirmation.transactionId,
                                    udf1: model.loanAccountDisbursementSchedule.udf1,
                                    udf4: model.loanAccountDisbursementSchedule.udf4,
                                    udf5: model.loanAccountDisbursementSchedule.udf5
                                });
                                delete reqData._disbursementConfirmation;
                                delete reqData.loanAccountDisbursementSchedule;
                                IndividualLoan.batchDisbursementConfirmation(reqData, function (resp, header) {
                                    PageHelper.showProgress("upd-disb", "Done.", "5000");
                                    backToQueue();
                                }, function (resp) {
                                    PageHelper.showProgress("upd-disb", "Oops. An error occurred", "5000");
                                    PageHelper.showErrors(resp);

                                }).$promise.finally(function () {
                                    PageHelper.hideLoader();
                                });
                            }
                            else {
                                reqData.loanAccountDisbursementSchedule.udf4 = "";
                                reqData.loanAccountDisbursementSchedule.udf5 = "";
                                reqData.loanAccountDisbursementSchedule.udfDate1 = "";
                                reqData.disbursementProcessAction = "PROCEED";

                                IndividualLoan.updateDisbursement(reqData, function (resp, header) {
                                    PageHelper.showProgress("upd-disb", "Done.", "5000");
                                    backToQueue();
                                }, function (resp) {
                                    PageHelper.showProgress("upd-disb", "Oops. An error occurred", "5000");
                                    PageHelper.showErrors(resp);

                                }).$promise.finally(function () {
                                    PageHelper.hideLoader();
                                });
                            }

                        }
                    }
                }
            };
        }]);
