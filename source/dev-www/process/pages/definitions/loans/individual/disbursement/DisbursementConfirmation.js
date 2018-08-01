irf.pageCollection.factory(irf.page("loans.individual.disbursement.DisbursementConfirmation"),
    ["$log", "Enrollment","GroupProcess","LoanAccount", "SessionStore","$state", "$stateParams", "PageHelper", "IndividualLoan", "SchemaResource","Utils","Queries",
        function($log, Enrollment,GroupProcess,LoanAccount, SessionStore,$state,$stateParams, PageHelper, IndividualLoan, SchemaResource,Utils,Queries){

        var branch = SessionStore.getBranch();
        var backToQueue = function(){
            $state.go("Page.Engine",{
                pageName:"loans.individual.disbursement.DisbursementConfirmationQueue",
                pageId:null
            });
        };
        return {
            "type": "schema-form",
            "title": "DISBURSEMENT_CONFIRMATION",
            "subTitle": "",
            initialize: function (model, form, formCtrl) {
                model.loanacount=model.loanacount||{};
                model.emi_schedule =[];
                model.siteCode = SessionStore.getGlobalSetting("siteCode");
                try {
                    var loanId = ($stateParams['pageId'].split('.'))[0];
                    var disbursementId = ($stateParams['pageId'].split('.'))[1];
                    PageHelper.showLoader();
                    PageHelper.showProgress('loan-fetch', 'Fetching Loan Details');


                    if (!model._disbursementConfirmation) {
                        $log.info("Page visited directly");
                        backToQueue();
                    }
                    IndividualLoan.get({id: loanId}, function (resp, head) {
                        model.loanacount=resp;
                        var disbExistFlag = false;
                        for (var i=0;i<resp.disbursementSchedules.length;i++) {
                            var disbSchedule = resp.disbursementSchedules[i];
                            console.log(disbSchedule);
                            if (disbSchedule.id == disbursementId) {
                                model.loanAccountDisbursementSchedule = disbSchedule;
                                Utils.removeNulls(model,true);
                                disbExistFlag = true;
                                break;
                            }
                        }
                        if(!disbExistFlag){
                            PageHelper.showProgress('loan-fetch', 'Failed to load Disbursement', 5000);
                        }
                        else{
                            PageHelper.showProgress('loan-fetch', 'Done.', 5000);
                        }

                        // getting loan Documents details from queries
                       
                       Queries.getLoanProductDocuments(model.loanacount.productCode, "LoanBooking", "DocumentUpload")
                           .then(function (docs) {
                               var details = docs.filter(obj => {
                                   return obj.document_code == "EMI_SCHEDULE";
                               })
                               if(model.loanacount.loanDocuments){
                                model.loanDocuments = _.cloneDeep(model.loanacount.loanDocuments);
                                model.emi_schedule = model.loanDocuments.filter(obj => {
                                    return obj.document == 'EMI_SCHEDULE'
                                })
                               model.emi_schedule.map((obj) => {
                                        obj.$downloadRequired = details[0].download_required,
                                        obj.$formsKey = details[0].forms_key,
                                        obj.disbursementId = details[0].id,
                                        obj.isHidden = false,
                                        obj.newDocumentID = null
                               })
                               }
                               

                           })

                        console.log(model);
                        LoanAccount.get({
                            accountId: model.loanacount.accountNumber
                        }).$promise.then(function(resp) {
                            model.loanacount.customer1FirstName=resp.customer1FirstName;
                            for(i=0;i<resp.transactions.length;i++){
                                if(resp.transactions[i].transactionName=="Disbursement"){
                                    model.loanacount.transactionId=resp.transactions[i].transactionId;
                                    model.loanacount.transactionType=resp.transactions[i].instrument;
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
                    "title": "DISBURSEMENT_DETAILS",
                    "colClass": "col-sm-8",
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
                        }
                    ]
                },
                {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "title": "LOAN_DOCUMENT_UPLOAD_QUEUE",
                    "condition": "model.siteCode != 'sambandh' && model.siteCode != 'saija' && model.emi_schedule[0].document && model.emi_schedule != 'undefined'",
                    "items": [{
                        "key": "emi_schedule",
                        "type": "array",
                        "notitle": true,
                        "view": "fixed",
                        "add": null,
                        "remove": null,
                        "items": [{
                            "type": "section",
                            "htmlClass": "row",
                            "items": [{
                                    "type": "section",
                                    "htmlClass": "col-sm-3",
                                    "items": [{
                                        "key": "emi_schedule[].document",
                                        "notitle": true,
                                        "titleExpr": "model.emi_schedule[arrayIndex].document",
                                        "type": "anchor",
                                        "fieldHtmlClass": "text-bold",
                                        "onClick": function (model, form, schemaForm, event) {
                                            var doc = model.emi_schedule[event.arrayIndex];
                                            console.log(doc);
                                            Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=" + doc.$formsKey + "&record_id=" + model.loanacount.id)
                                        }
                                    }]
                                },
                                {
                                    "type": "section",
                                    "htmlClass": "col-sm-3",
                                    "items": [{
                                        title: "Upload",
                                        key: "emi_schedule[].documentId",
                                        "required": true,
                                        type: "file",
                                        fileType: "application/pdf",
                                        category: "Loan",
                                        subCategory: "DOC1",
                                        "notitle": true,
                                        using: "scanner"
                                    }]
                                },
                                {
                                    "type": "section",
                                    "htmlClass": "col-sm-3",
                                    "items": [{
                                        title: "Upload",
                                        key: "emi_schedule[].newDocumentID",
                                        "required": true,
                                        type: "file",
                                        fileType: "application/pdf",
                                        category: "Loan",
                                        subCategory: "DOC1",
                                        "notitle": true,
                                        using: "scanner"

                                    }]
                                }
                            ]
                        }]

                    }]
                },
                {
                    "type": "actionbox",
                    "condition": "model.siteCode=='KGFS'",
                    "items": [{
                        "type": "submit",
                        "title": "Update"
                    }, {
                        "title": "Print Receipt",

                        "type": "button",
                        "onClick": function (model, formCtrl, form, $event) {
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
                            GroupProcess.getLoanPrint(repaymentInfo, opts);
                        }
                    }]
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Update"
                    }]
                }
            ],
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
                        var emi_schedule_flag =0;
                        reqData.loanacount.loanDocuments.filter(obj =>{
                            if(obj.document == 'EMI_SCEHDULE' && obj.documentId != model.emi_schedule[0].documentId){
                                obj.documentId = model.emi_schedule[0].documentId;
                                emi_schedule_flag =1;
                            };
                        })
                        if (emi_schedule_flag == 1) {
                            var request = {
                                'loanAccount': _.cloneDeep(model.reqData.loanacount),
                                'loanProcessAction': 'PROCEED',
                                'remarks': model.review.remarks
                            };
                            IndividualLoan.update(request)
                                .$promise
                                .then(
                                    function (res) {
                                        $log.info(res)
                                    },
                                    function (httpRes) {
                                        PageHelper.showProgress('update-loan', 'Unable to proceed.', 2000);
                                        PageHelper.showErrors(httpRes);
                                    }
                                )
                        }
                        
                        delete reqData.$promise;
                        delete reqData.$resolved;
                        if(reqData.loanAccountDisbursementSchedule.udf1 == "Rejected"){
                            reqData.disbursementConfirmations =[];
                            var targetStage;
                            if (model.loanAccountDisbursementSchedule.udf5 == 'Internal issue - Wrong bank selection')
                                targetStage = 'ReadyForDisbursement';
                            else
                                targetStage = 'RejectedDisbursement';
                            reqData.disbursementConfirmations.push({
                                                accountNumber: model._disbursementConfirmation.accountNumber,
                                                stage: targetStage,
                                                status: "REJECT",
                                                tranchNumber:model._disbursementConfirmation.trancheNumber,
                                                transactionId: model._disbursementConfirmation.transactionId,
                                                udf1:model.loanAccountDisbursementSchedule.udf1,
                                                udf4:model.loanAccountDisbursementSchedule.udf4,
                                                udf5:model.loanAccountDisbursementSchedule.udf5
                                            });
                            delete reqData._disbursementConfirmation;
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
                        else{
                            reqData.loanAccountDisbursementSchedule.udf4 = "";
                            reqData.loanAccountDisbursementSchedule.udf5 = "";
                            reqData.loanAccountDisbursementSchedule.udfDate1 = "";
                            reqData.disbursementProcessAction = "PROCEED";

                            IndividualLoan.updateDisbursement(reqData,function(resp,header){
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
    }]);
