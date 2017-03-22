irf.pageCollection.factory(irf.page("loans.individual.disbursement.LOCDisbursement"),
["$log", "IndividualLoan", "SessionStore","$state", "$stateParams","SchemaResource","PageHelper","formHelper","Queries","Utils","CustomerBankBranch","LoanAccount","$q", 
function($log, IndividualLoan, SessionStore,$state,$stateParams,SchemaResource,PageHelper, formHelper,Queries,Utils,CustomerBankBranch,LoanAccount,$q){

    var branch = SessionStore.getBranch();
    var branchId = SessionStore.getBranchId();

    var populateDisbursementDate = function(modelValue,form,model){
        if (modelValue){
            modelValue = new Date(modelValue);
            model.additional.scheduledDisbursementDate = new Date(modelValue.setDate(modelValue.getDate()+1));
        }
    };

    var populateAvailability = function(model){
        LoanAccount.get({accountId:model.loanAccountDisbursementSchedule.accountNumber})
            .$promise
            .then(
                function(res){
                    PageHelper.showProgress('LOC-disbursement', 'Done', 2000);
                    $log.info(res);
                    model.additional.disbursableAmount = res.disbursableAmount;
                }, function(httpRes){
                    PageHelper.showProgress('LOC-disbursement', 'Some error occured while updating the details. Please try again', 2000);
                    PageHelper.showErrors(httpRes);
                }
            );
        Queries.getLoanAccount(model.loanAccountDisbursementSchedule.accountNumber, branchId).then(function(value){
                $log.info("Loan account record received");
                model.loanAccountRec = value;
                $log.info(model.loanAccountRec);
                model.loanAccountDisbursementSchedule.customerId = model.loanAccountRec.customer_id;
                model.loanAccountDisbursementSchedule.loanId = model.loanAccountRec.id;
            },function(err){
                $log.info("Error while fetching Loan Account");
            });
    };

    return {
        "type": "schema-form",
        "title": "CAPTURE_LOC_DETAILS",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("LOC Disbursement Page got initialized");

            /*if (!model._LOCDisbursementQueue)
            {
                $log.info("Screen directly launched hence redirecting to queue screen");
                $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.LOCDisbursementQueue', pageId: null});
                return;
            }*/
            model.loanAccountDisbursementSchedule = {};
            model.additional = {};

            if (!model._LOCDisbursementQueue)
                model.additional.fromPage="Direct";
            else
                model.additional.fromPage="Queue";

            if(model._LOCDisbursementQueue){
                model.loanAccountDisbursementSchedule.loanId = model._LOCDisbursementQueue.loanId;
                model.loanAccountDisbursementSchedule.accountNumber = model._LOCDisbursementQueue.accountNumber;
                populateAvailability(model);
            }
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "titleExpr":"('LOAN'|translate)+' ' + model.loanAccountDisbursementSchedule.accountNumber + ' | '+('DISBURSEMENT_DETAILS'|translate)+' | '+ model.customerName",
            "items": [
                {
                    "type":"box",
                    "title":"LOAN_DETAILS",
                    "colClass":"col-sm-12",
                    "items":[{
                        "type":"fieldset",
                        "notitle":true,
                        "items":[
                            {
                                "key":"loanAccountDisbursementSchedule.accountNumber",
                                "title":"LOAN_ACCOUNT_NUMBER",
                                "readonly":true,
                                "condition":"model.additional.fromPage=='Queue'"
                            },
                            {
                                "key":"loanAccountDisbursementSchedule.accountNumber",
                                "title":"LOAN_ACCOUNT_NUMBER",
                                "condition":"model.additional.fromPage=='Direct'"
                            },
                            {
                                "type": "button",
                                "title": "CHECK_AVAILABILITY",
                                "onClick": function (model, form, schemaForm, event){
                                    populateAvailability(model);
                                }
                            },
                            {
                                "key":"additional.disbursableAmount",
                                "title":"AVAILABLE_LOAN_AMOUNT",
                                "readonly":true
                            },
                            {
                                "key": "loanAccountDisbursementSchedule.remarks1",
                                "title": "FRO_REMARKS",
                                "readonly":true,
                                "condition": "model.loanAccountDisbursementSchedule.remarks1!=''"
                            },
                            {
                                "key": "loanAccountDisbursementSchedule.remarks2",
                                "title": "CRO_REMARKS",
                                "readonly":true,
                                "condition": "model.loanAccountDisbursementSchedule.remarks2!=''"
                            }
                        ]
                    }]
                },
                {
                    "type": "box",
                    "title": "DISBURSEMENT_DETAILS",
                    "colClass": "col-sm-12",
                    "items": [{
                        "type": "fieldset",
                        "title": "DISBURSEMENT_ACCOUNT_DETAILS",
                        "items": [{
                            "key": "loanAccountDisbursementSchedule.party",
                            "type": "radios",
                            "titleMap": [{
                                "name": "Customer",
                                "value": "CUSTOMER"
                            }, {
                                "name": "Vendor",
                                "value": "VENDOR"
                            }],
                            onChange: function(value, form, model) {
                                if (model.loanAccountDisbursementSchedule.party == 'CUSTOMER') {
                                    model.loanAccountDisbursementSchedule.customerAccountNumber = '';
                                    model.loanAccountDisbursementSchedule.ifscCode = '';
                                    model.loanAccountDisbursementSchedule.customerBankName = '';
                                    model.loanAccountDisbursementSchedule.customerBankBranchName = '';
                                    model.loanAccountDisbursementSchedule.customerNameInBank = '';
                                }
                            }
                        }, {
                            key: "loanAccountDisbursementSchedule.customerNameInBank",
                            title: "CUSTOMER_NAME_IN_BANK"
                        }, {
                            key: "loanAccountDisbursementSchedule.customerAccountNumber",
                            type: "lov",
                            autolov: true,
                            title: "CUSTOMER_BANK_ACC_NO",
                            "condition": "model.loanAccountDisbursementSchedule.party=='CUSTOMER'",
                            bindMap: {
                                "customerId": "loanAccountDisbursementSchedule.customerId"
                            },
                            outputMap: {
                                "account_number": "loanAccountDisbursementSchedule.customerAccountNumber",
                                "ifsc_code": "loanAccountDisbursementSchedule.ifscCode",
                                "customer_bank_name": "loanAccountDisbursementSchedule.customerBankName",
                                "customer_bank_branch_name": "loanAccountDisbursementSchedule.customerBankBranchName",
                                "customer_name_as_in_bank":"loanAccountDisbursementSchedule.customerNameInBank"
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
                            key: "loanAccountDisbursementSchedule.customerAccountNumber",
                            title: "CUSTOMER_BANK_ACC_NO",
                            "condition": "model.loanAccountDisbursementSchedule.party=='VENDOR'"
                        }, {
                            key: "loanAccountDisbursementSchedule.ifscCode",
                            title: "CUSTOMER_BANK_IFSC",
                            "condition": "model.loanAccountDisbursementSchedule.party=='CUSTOMER'"
                        }, {
                            key: "loanAccountDisbursementSchedule.ifscCode",
                            type: "lov",
                            lovonly: true,
                            "condition": "model.loanAccountDisbursementSchedule.party=='VENDOR'",
                            inputMap: {
                                "ifscCode": {
                                    "key": "loanAccountDisbursementSchedule.ifscCode"
                                },
                                "bankName": {
                                    "key": "loanAccountDisbursementSchedule.customerBankName"
                                },
                                "branchName": {
                                    "key": "loanAccountDisbursementSchedule.customerBankBranchName"
                                }
                            },
                            outputMap: {
                                "bankName": "loanAccountDisbursementSchedule.customerBankName",
                                "branchName": "loanAccountDisbursementSchedule.customerBankBranchName",
                                "ifscCode": "loanAccountDisbursementSchedule.ifscCode"
                            },
                            searchHelper: formHelper,
                            search: function(inputModel, form) {
                                var promise = CustomerBankBranch.search({
                                    'bankName': inputModel.bankName,
                                    'ifscCode': inputModel.ifscCode,
                                    'branchName': inputModel.branchName
                                }).$promise;
                                return promise;
                            },
                            getListDisplayItem: function(data, index) {
                                return [
                                    data.ifscCode,
                                    data.branchName,
                                    data.bankName
                                ];
                            }
                        }, {
                            key: "loanAccountDisbursementSchedule.customerBankName",
                            title: "CUSTOMER_BANK"
                        }, {
                            key: "loanAccountDisbursementSchedule.customerBankBranchName",
                            title: "BRANCH_NAME"
                        }]
                    }]
                },
                {
                    "key": "loanAccountDisbursementSchedule.disbursementAmount",
                    "title":"DISBURSEMENT_AMOUNT",
                    "type":"amount"
                },
                /*{
                    "key": "loanAccountDisbursementSchedule.tranchCondition",
                    "title": "TRACHE_CONDITION",
                    "type": "textarea"
                },*/
                {
                    key: "loanAccountDisbursementSchedule.tranchCondition",
                    type: "lov",
                    autolov: true,
                    title:"TRANCHE_CONDITION",
                    bindMap: {
                    },
                    searchHelper: formHelper,
                    search: function(inputModel, form, model, context) {
                        
                        var trancheConditions = formHelper.enum('tranche_conditions').data;
                        var out = [];
                        for (var i=0;i<trancheConditions.length; i++){
                            var t = trancheConditions[i];
                            var min = _.hasIn(t, "field1")?parseInt(t.field1) - 1: 0;
                            var max = _.hasIn(t, "field2")?parseInt(t.field2) - 1: 100;

                            if (context.arrayIndex>=min && context.arrayIndex <=max){
                                out.push({
                                    name: trancheConditions[i].name,
                                    value: trancheConditions[i].value
                                })    
                            }
                        }
                        return $q.resolve({
                            headers: {
                                "x-total-count": out.length
                            },
                            body: out
                        });
                    },
                    onSelect: function(valueObj, model, context){
                        model.loanAccountDisbursementSchedule.tranchCondition = valueObj.value;
                    },
                    getListDisplayItem: function(item, index) {
                        return [
                            item.name
                        ];
                    }
                },
                {
                    "key": "loanAccountDisbursementSchedule.customerSignatureDate",
                    "title": "CUSTOMER_SIGNATURE_DATE",
                    "type": "date",
                    "onChange":function(modelValue,form,model){
                            populateDisbursementDate(modelValue,form,model);
                        }
                },
                {
                    "key": "additional.scheduledDisbursementDate",
                    "title": "DISBURSEMENT_DATE",
                    "type": "date"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "SUBMIT"
                    }]
                }
            ]
        }],
        schema: function() {
            return SchemaResource.getDisbursementSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                if (model.loanAccountDisbursementSchedule.disbursementAmount > model.additional.disbursableAmount || model.loanAccountDisbursementSchedule.disbursementAmount <= 0)
                {
                    PageHelper.showProgress("LOC-disbursement","Disbursement Amount cannot be more than the disbursable amount",5000);
                    return false;
                }
                if(window.confirm("Are you sure?")){
                    PageHelper.showLoader();
                    var reqData = _.cloneDeep(model);
                    reqData.loanAccountDisbursementSchedule.scheduledDisbursementDate = model.additional.scheduledDisbursementDate;
                    delete reqData.$promise;
                    delete reqData.$resolved;
                    delete reqData._LOCDisbursementQueue;
                    delete reqData.additional;
                    reqData.disbursementProcessAction = "PROCEED";
                    reqData.loanAccountDisbursementSchedule.currentStage = "LOCDisbursement";
                    reqData.stage = "FROApproval";
                    if (model.additional.fromPage=="Direct"){
                        reqData.loanAccountDisbursementSchedule.udfDate2 = Utils.getCurrentDateTime();
                        IndividualLoan.addTranch(reqData,function(resp,header){
                            delete resp.$promise;
                            delete resp.$resolved;
                            PageHelper.showProgress("upd-disb","Done.","5000");
                            PageHelper.hideLoader();
                            $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.LOCDisbursementQueue', pageId: null});
                        },function(resp){
                            PageHelper.showProgress("upd-disb","Oops. An error occurred","5000");
                            PageHelper.showErrors(resp);

                        }).$promise.finally(function(){
                            PageHelper.hideLoader();
                        });
                    }
                    else
                    {
                        IndividualLoan.updateDisbursement(reqData,function(resp,header){
                            PageHelper.showProgress("upd-disb","Done.","5000");
                            PageHelper.hideLoader();
                            $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.LOCDisbursementQueue', pageId: null});
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