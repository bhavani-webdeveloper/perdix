define({
    pageUID: "loans.individual.disbursement.DisbursementReversal",
    pageType: "Engine",
    dependencies: ["$log", "Enrollment","GroupProcess","LoanAccount", "SessionStore","$state", "$stateParams", "PageHelper", "IndividualLoan", "SchemaResource","Utils"],
    $pageFn: function ($log, Enrollment,GroupProcess,LoanAccount, SessionStore,$state,$stateParams, PageHelper, IndividualLoan, SchemaResource,Utils) {
        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "DISBURSEMENT_REVERSAL",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                model.loanAccountDisbursementSchedule = $stateParams.pageData;
                model.loanacount=model.loanacount||{};
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                var loanId = model.loanAccountDisbursementSchedule.loanId;
                var disbursementId = model.loanAccountDisbursementSchedule.id;
                 

            },
            offline: false,
            getOfflineDisplayItem: function(item, index){

            },
            form: [{
                "type": "box",
                "title": "DISBURSEMENT_DETAILS",
                "colClass": "col-sm-8",
                "items": [

                    {
                        "key":"loanAccountDisbursementSchedule.udf1",
                        "type": "select",
                        "required":true,
                        "titleMap":[{
                                "name":"Confirmed",
                                "value":"Confirmed"
                                },
                                {
                                "name":"Rejected",
                                "value":"Rejected"
                                }
                        ]
                    },
                    {
                        "key":"loanAccountDisbursementSchedule.actualDisbursementDate",
                        "type":"date",
                        "title":"ACTUAL_DISBURSEMENT_DATE",
                        "readonly":true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.modeOfDisbursement",
                        "title": "MODE_OF_DISBURSEMENT",
                        "readonly":true
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.referenceDate",
                        "title": "DATE",
                        "type":"date",
                        "condition":"model.loanAccountDisbursementSchedule.modeOfDisbursement!='CASH'"
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.referenceNumber",
                        "title": "REFERENCE_NO",
                        "condition":"model.loanAccountDisbursementSchedule.modeOfDisbursement!='CASH'&& model.loanAccountDisbursementSchedule.udf1=='Rejected'"
                    },
                    {
                        "key": "loanAccountDisbursementSchedule.referenceNumber",
                        "title": "REFERENCE_NO",
                        "required":true,
                        "condition":"model.loanAccountDisbursementSchedule.modeOfDisbursement!='CASH'&& model.loanAccountDisbursementSchedule.udf1=='Confirmed'"
                    },
                    {
                        "key":"loanAccountDisbursementSchedule.udf5",
                        "title":"FINANCE_TEAM_REJECTION_REASON",
                        "type": "select",
                        "condition":"model.loanAccountDisbursementSchedule.udf1=='Rejected'"
                    },
                    {
                        "key":"loanAccountDisbursementSchedule.udf4",
                        "title":"FINANCE_TEAM_REJECTION_REMARKS",
                        "condition":"model.loanAccountDisbursementSchedule.udf1=='Rejected'"
                    },
                    {
                        "type": "actionbox",
                        "condition":"model.siteCode=='KGFS'",
                        "items": [{
                            "type": "submit",
                            "title": "REVERSE"
                        },{
                            "title": "Print Receipt",
                            
                            "type": "button",
                            "onClick": function(model, formCtrl, form, $event) {
                                var repaymentInfo = {
                                    'customerURN': model.loanacount.urnNo,
                                    'customerId': model.loanacount.customerId,
                                    'customerName': model.loanacount.customer1FirstName,
                                    'accountNumber': model.loanacount.accountNumber,
                                    'transactionType': "Disbursement",
                                    'transactionID': model.loanacount.transactionId,
                                    'productCode': model.loanacount.productCode,
                                    'loanAmount': model.loanacount.loanAmountRequested,
                                    'disbursedamount': model.loanacount.loanAmount,
                                    'partnerCode': model.loanacount.partnerCode,
                                };

                                var opts = {
                                    'branch': SessionStore.getBranch(),
                                    'entity_name': SessionStore.getBankName() + " KGFS",
                                    'company_name': "IFMR Rural Channels and Services Pvt. Ltd.",
                                    'cin': 'U74990TN2011PTC081729',
                                    'address1': 'IITM Research Park, Phase 1, 10th Floor',
                                    'address2': 'Kanagam Village, Taramani',
                                    'address3': 'Chennai - 600113, Phone: 91 44 66687000',
                                    'website': "http://ruralchannels.kgfs.co.in",
                                    'helpline': '18001029370',
                                    'branch_id': SessionStore.getBranchId(),
                                    'branch_code': SessionStore.getBranchCode()
                                };
                                GroupProcess.getLoanPrint(repaymentInfo,opts);
                            }
                        }]
                    },
                    {
                        "type": "actionbox",
                        
                        "items": [{
                            "type": "submit",
                            "title": "REVERSE"
                        }]
                    }
                ]
            }],
            schema: function() {
                return SchemaResource.getDisbursementSchema().$promise;
            },
            actions: {

                submit: function(model, form, formName){
                    if(PageHelper.isFormInvalid(form)) {
                        return false;
                    }
                    if(window.confirm("Are you sure?")){
                        PageHelper.showLoader();
                        var reqData = _.cloneDeep(model);
                        delete reqData.$promise;
                        delete reqData.$resolved;
                        if(reqData.loanAccountDisbursementSchedule.udf1 == "Rejected"){
                            reqData.disbursementConfirmations =[];
                            var targetStage='ReadyForDisbursement';
                            reqData.disbursementConfirmations.push({
                                                accountNumber: model.loanAccountDisbursementSchedule.accountNumber,
                                                "currentStage": "Completed",
                                                stage: targetStage,
                                                status: "REJECT",
                                                tranchNumber:model.loanAccountDisbursementSchedule.trancheNumber,
                                                transactionId: model.loanAccountDisbursementSchedule.transactionId,
                                                udf1:model.loanAccountDisbursementSchedule.udf1,
                                                udf4:model.loanAccountDisbursementSchedule.udf4,
                                                udf5:model.loanAccountDisbursementSchedule.udf5
                                            });
                            delete reqData.loanAccountDisbursementSchedule;
                            IndividualLoan.batchDisbursementConfirmation(reqData,function(resp,header){
                                PageHelper.showProgress("upd-disb","Done.","5000");
                                backToQueue();
                            },function(resp){
                                PageHelper.showProgress("upd-disb","Oops. An error occurred","5000");
                                PageHelper.showErrors(resp);

                            }).$promise.finally(function(){
                                PageHelper.hideLoader();
                            });
                        }
                        
                    }
                }
            }
        };
        
    }
})