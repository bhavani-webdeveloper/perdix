/*
About ACHClearingCollection.js
------------------------------
1. To download the demand list with date criteria
2. To upload the demand list and change the status as "MARK AS PAID"

Methods
-------
Initialize : To decare the required model variables.
onClick : To download the Domand List based on date criteria and to call "ACH.getDemandList" service
onChange : To select/unselect all demands listed in array.
customHandle : To upload ACH files(Excel).

Services
--------
ACH.getDemandList : To get all the demands for the entered date. And all the branch ID's are
                    parsed so as to get all the demands for the corresponding date.
ACH.achDemandListUpload : To upload the selected file.
ACH.bulkRepay : To repay all the demands marked. The req. is send as JSON Array.
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHClearingCollection"), ["$log", "SessionStore", 'Utils', 'ACH', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q', '$state', 'Queries', 'ACHPDCBatchProcess',
    function($log, SessionStore, Utils, ACH, AuthTokenHelper, PageHelper, formHelper, $filter, $q, $state, Queries, ACHPDCBatchProcess) {

        var allUpdateDemands = [];
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "ACH_COLLECTIONS",
            "subTitle": Utils.getCurrentDate(),

            initialize: function(model, form, formCtrl) {
                //alert($filter('date')(new Date(), 'dd/MM/yyyy'));
                //alert(moment(new Date()).format("YYYY-MM-DD"));
                //alert(Utils.getCurrentDate());
                allUpdateDemands = [];
                model.achSearch = model.achSearch || {};
                model.authToken = AuthTokenHelper.getAuthData().access_token;
                model.userLogin = SessionStore.getLoginname();
                model.achCollections = model.achCollections || {};
                model.showUpdateSection = false;
                model.searchAccountId = false;
                model.searchDemarkAccountId = false;
                model.achDemand = model.achDemand || {};
                model.achDemand.demarkList = model.achDemand.demarkList || [];
                model.achDemand.updateDemand = model.achDemand.updateDemand || [];
                model.achCollections.demandDate = model.achCollections.demandDate || Utils.getCurrentDate();
                console.log(formHelper.enum('branch_id'));
                for (var i = 0; i < formHelper.enum('branch_id').data.length; i++) {
                    branchIDArray.push(parseInt(formHelper.enum('branch_id').data[i].code));
                }
            },
            form: [{
                "type": "box",
                "title": "UPDATE_ACH_DEMANDS",
                "items": [{
                        "key": "ach.achDemandListDate",
                        "title": "INSTALLMENT_DATE",
                        "type": "date"
                    },
                    {
                        "title": "",
                        "type": "section",
                        "html": "<br/><br />"
                    },
                    {
                    "type": "button",
                    "title": "SEARCH_DEMAND",
                    "onClick": function(model, formCtrl, form) {
                        PageHelper.clearErrors();
                        if (!model.ach || !model.ach.achDemandListDate) {
                            PageHelper.setError({
                                'message': 'Installment Date is mandatory.'
                            });
                            return false;
                        }
                        model.showUpdateSection = false;
                        PageHelper.showLoader();
                        ACHPDCBatchProcess.fetchDemandDetails({
                            demandDate: model.ach.achDemandListDate,
                            repaymentType: 'ACH'
                        }).$promise.then(function(res) {
                                PageHelper.hideLoader();
                                model.achSearch = res;
                                model.achSearch = $filter('filter')(model.achSearch, {submitStatus : 'PENDING'}, true);
                                if (model.achSearch.length) {
                                    model.showUpdateSection = true;
                                    model.chosenRecordCountText = model.achSearch.length + ' Record(s) found.';
                                } else {
                                    model.showUpdateSection = false;
                                    model.chosenRecordCountText = 'No Records found..!';
                                }
                                // Clear the existing array whenever the user clicks on download,
                                // to prevent the value getting appended to the existing
                                allUpdateDemands = [];
                                for (var i = 0; i < model.achSearch.length; i++) {
                                    allUpdateDemands.push(model.achSearch[i]);
                                    allUpdateDemands[i].check = true;
                                }
                            },
                            function(httpRes) {
                                PageHelper.hideLoader();
                                PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                                PageHelper.showErrors(httpRes);
                                $log.info("ACH Search Response : " + httpRes);
                            });
                    }
                }, {
                    "type": "help",
                    "helpExpr": "model.chosenRecordCountText"
                }]
            }, {
                "type": "box",
                "condition": "model.showUpdateSection",
                "title": "SEARCH_DEMANDS_TO_DEMARK",
                "items": [{
                    "key": "achDemand.chosenToMark.accountNumber",
                    "title": "ACCOUNT_NUMBER",
                    "type": "lov",
                    "lovonly": true,
                    "inputMap": {
                        "accountNumber": "ach.accountNumber"
                    },
                    "searchHelper": formHelper,
                    "search": function(model, formCtrl, form) {
                        var filteredDemandList = $filter('filter')(allUpdateDemands, {
                                    accountNumber: model.accountNumber
                                });
                                return $q.resolve({
                                    "header": {
                                        "x-total-count": filteredDemandList.length
                                    },
                                    "body": filteredDemandList
                                });
                    },
                    "getListDisplayItem": function(item, index) {
                        return [
                            '{{"ACCOUNT_NUMBER"|translate}}: ' + item.accountNumber,
                            '<i class="fa fa-rupee"></i> ' + item.demandAmount,
                            '{{"ENTITY_NAME"|translate}}: ' + item.customerName
                        ];
                    },
                    "onSelect": function(result, model, context) {
                        model.searchAccountId = false;
                        if (!model.achDemand.demarkList){
                            model.achDemand.demarkList = [];
                        }
                        for(var i = 0; i < model.achDemand.demarkList.length; i++)
                        {
                            if(result.accountNumber == model.achDemand.demarkList[i].accountNumber)
                            {
                                model.searchAccountId = true;
                                PageHelper.showProgress("page-init", "ACCOUNT ID exist in Demarked Demand", 5000);
                            }
                        }
                        if(model.searchAccountId == false) {
                            model.achDemand.chosenToMark = result;
                        }
                    }
                },
                //  {
                //     "key": "achDemand.chosenToMark.transactionDate",
                //     "title": "TRANSACTION_DATE",
                //     "type": "date"
                // }, {
                //     "key": "achDemand.chosenToMark.repaymentDate",
                //     "title": "REPAYMENT_DATE",
                //     "type": "date"
                // },
                {
                    "key": "achDemand.chosenToMark.demandAmount",
                    "title": "LOAN_AMOUNT",
                    "type": "number",
                    "readonly": true
                }, {
                    "key": "achDemand.chosenToMark.demark",
                    "title": "MARK_AS_UNPAID",
                    "condition": "model.achDemand.chosenToMark.accountNumber",
                    "type": "button",
                    "schema": {
                        "default": false
                    },
                    "onClick": function(modelValue, form, model) {
                        modelValue.searchDemarkAccountId = false;
                        if(modelValue.achDemand.demarkList)
                        {
                            for (var i = 0; i < modelValue.achDemand.demarkList.length; i++) {
                                    if(modelValue.achDemand.chosenToMark.accountNumber == modelValue.achDemand.demarkList[i].accountNumber)
                                    {
                                        modelValue.searchDemarkAccountId = true;
                                    }
                                }
                            if(!modelValue.searchDemarkAccountId)
                            {
                                modelValue.achDemand.chosenToMark.check = false;
                                modelValue.achDemand.demarkList.push(modelValue.achDemand.chosenToMark);
                                modelValue.achDemand.chosenToMark = null;
                            }
                        }

                        // modelValue.achDemand.chosenToMark.accountId = ""


                        // if (!modelValue) {
                        //     if (model.achDemand.demarkList.length > 0) {
                        //         for (var i = 0; i < model.achDemand.demarkList.length; i++) {
                        //             if (model.achDemand.demarkList[i].accountId == model.achDemand.chosenToMark.accountId) {
                        //                 model.achDemand.demarkList[i].check = model.achDemand.chosenToMark.check;
                        //             } else {
                        //                 model.achDemand.demarkList.push(model.achDemand.chosenToMark);
                        //             }
                        //         }
                        //     } else {
                        //         model.achDemand.demarkList.push(model.achDemand.chosenToMark);
                        //     }

                        // } else {
                        //     for (var i = 0; i < model.achDemand.demarkList.length; i++) {
                        //         if (model.achDemand.demarkList[i].accountId == model.achDemand.chosenToMark.accountId) {
                        //             model.achDemand.demarkList.splice(i, 1);
                        //         }
                        //     }
                        // }
                    }
                }]
            }, {
                "type": "box",
                "condition": "model.showUpdateSection",
                "title": "DEMARKED_DEMANDS",
                "items": [{
                    "type": "array",
                    "key": "achDemand.demarkList",
                    //"condition": "!model.achDemand.demarkList[arrayIndex].check",
                    "add": null,
                    "startEmpty": true,
                    "remove": null,
                    "title": "CHEQUE_DETAILS",
                    "titleExpr": "(model.achDemand.demarkList[arrayIndex].check?'⚫ ':'⚪ ') + model.achDemand.demarkList[arrayIndex].accountNumber + ' - ' + model.achDemand.demarkList[arrayIndex].demandAmount",
                    "items": [{
                        "key": "achDemand.demarkList[].accountNumber",
                        //"condition": "!model.achDemand.demarkList[arrayIndex].check",
                        "title": "ACCOUNT_NUMBER",
                        "readonly": true
                    },
                    //  {
                    //     "key": "achDemand.demarkList[].transactionDate",
                    //     //"condition": "!model.achDemand.demarkList[arrayIndex].check",
                    //     "title": "TRANSACTION_DATE",
                    //     "type": "date"
                    // }, {
                    //     "key": "achDemand.demarkList[].repaymentDate",
                    //     //"condition": "!model.achDemand.demarkList[arrayIndex].check",
                    //     "title": "REPAYMENT_DATE",
                    //     "type": "date"
                    // },
                    {
                        "key": "achDemand.demarkList[].demandAmount",
                        //"condition": "!model.achDemand.demarkList[arrayIndex].check",
                        "title": "LOAN_AMOUNT",
                        "type": "number",
                        "readonly": true
                    }, {
                        "key": "achDemand.demarkList[].demark",
                        //"condition": "!model.achDemand.demarkList[arrayIndex].check",
                        "title": "MARK_AS_PAID",
                        "type": "button",
                        "schema": {
                            "default": false
                        },
                        "onClick": function(modelValue, form, modelIndex) {
                            modelValue.achDemand.demarkList[modelIndex.arrayIndex].check = true;
                            modelValue.achDemand.demarkList.splice(modelIndex.arrayIndex, 1);

                        }
                    }]
                }]
            },{
                "type": "actionbox",
                "condition": "model.showUpdateSection",
                "items": [{
                    "type": "button",
                    "notitle": true,
                    "condition": "model.showUpdateSection",
                    "title": "SUBMIT_TO_MARK",
                    "onClick": "actions.submit(model, formCtrl)"
                }]
            }],
            schema: function() {
                return ACH.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                    PageHelper.clearErrors();
                    model.achDemand.updateDemand = {'achPdcDemandlistDetails' : []};
                    for (var i = 0; i < allUpdateDemands.length; i++) {
                        var transName = "Scheduled Demand";
                        if (allUpdateDemands[i].check == true) {
                            transName = "Scheduled Demand";
                            model.achDemand.updateDemand['achPdcDemandlistDetails'].push(allUpdateDemands[i]);
                        }
                    }
                    if(model.achDemand.updateDemand['achPdcDemandlistDetails'].length > 0)
                    {
                        for(var i = 0; i < model.achDemand.updateDemand['achPdcDemandlistDetails'].length; i++){
                            model.achDemand.updateDemand['achPdcDemandlistDetails'][i].submitStatus = 'TO_BE_PROCESSED';
                        }
                        PageHelper.clearErrors();
                        PageHelper.showLoader();
                        model.bankAccountNumber = '';
                        var accountDetailPromise = Queries.getBankAccountsByPartnerForLoanRepay(
                            SessionStore.getGlobalSetting("mainPartner") || "Kinara").then(function(res){

                            var records = res.body;

                            if(records && _.isArray(records) && records.length > 0){

                                var defaultBank = $filter('filter')( records, {default_collection_account : true}, true);
                                
                                if(defaultBank && _.isArray(defaultBank) && defaultBank.length > 0)
                                    model.bankAccountNumber = defaultBank[0].account_number;
                            }

                        });
                        accountDetailPromise.then(function(){
                            ACHPDCBatchProcess.submitDemandForRepayment(model.achDemand.updateDemand).$promise.then(function(response) {
                                
                                ACHPDCBatchProcess.submitDemandForLoanRepay({type : 'ACH', bankAccountNumber : model.bankAccountNumber}, model.achDemand.updateDemand['achPdcDemandlistDetails']).$promise.then(
                                    function(resp){
                                        PageHelper.showProgress("page-init", resp.message + "Check the status in Batch Monitoring screen", 2000);
                                        $state.reload();
                                    },
                                    function(errResp){
                                        PageHelper.showErrors(errResp);
                                    }).finally(function() {
                                        PageHelper.hideLoader();
                                    })
                            }, function(errorResponse) {
                                PageHelper.showErrors(errorResponse);
                                PageHelper.hideLoader();
                            });
                        },
                         function(errorResponse){
                            PageHelper.hideLoader();
                            PageHelper.showErrors(errorResponse);
                        });

                    } else {
                        PageHelper.showProgress("page-init", "No account seected for repayment", 5000);
                    }
                }
            }
        };
    }
]);
