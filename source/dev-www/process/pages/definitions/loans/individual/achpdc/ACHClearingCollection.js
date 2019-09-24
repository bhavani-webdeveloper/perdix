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
customHandle : To upload ACH files(Excel).Q

Services
--------
ACH.getDemandList : To get all the demands for the entered date. And all the branch ID's are
                    parsed so as to get all the demands for the corresponding date.
ACH.achDemandListUpload : To upload the selected file.
ACH.bulkRepay : To repay all the demands marked. The req. is send as JSON Array.
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.ACHClearingCollection"), ["$log", "SessionStore", 'Utils', 'ACH', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q', '$state', 'Queries', 'ACHPDCBatchProcess',
    function ($log, SessionStore, Utils, ACH, AuthTokenHelper, PageHelper, formHelper, $filter, $q, $state, Queries, ACHPDCBatchProcess) {

        var allUpdateDemands = [];
        var branchIDArray = [];
        var demandAmount;
        var achDemandDate;
        return {
            "type": "schema-form",
            "title": "ACH_COLLECTIONS",
            "subTitle": Utils.getCurrentDate(),

            initialize: function (model, form, formCtrl) {
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
                model.achDemand.reject = model.achDemand.reject || [];
                //model.achDemand.updateDemand = model.achDemand.updateDemand || [];
                model.achCollections.demandDate = model.achCollections.demandDate;
                model.bankAccountNumber = model.bankAccountNumber;
                model.achDemand.repaymentType = 'ACH';
                model.achDemand.demandDate = model.achCollections.demandDate || Utils.getCurrentDate();
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
                        "type": "date",
                        onChange: function (value, form, model) {
                            achDemandDate = model.ach.achDemandListDate;
                            console.log(achDemandDate);
                        }
                    },
                    {
                        "title": "",
                        "type": "section",
                        "html": "<br/><br />"
                    },
                    {
                        "type": "button",
                        "title": "SEARCH_DEMAND",
                        "onClick": function (model, formCtrl, form) {
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
                                submitStatus: 'PENDING',
                                repaymentType: 'ACH',
                                'offset': 1,
                                'limit': 1
                            }).$promise.then(function (res) {
                                    PageHelper.hideLoader();
                                    
                                    if (res.headers['x-total-count']) {
                                        model.showUpdateSection = true;
                                        model.chosenRecordCountText = res.headers['x-total-count'] + ' Record(s) found.';
                                    } else {
                                        model.showUpdateSection = false;
                                        model.chosenRecordCountText = 'No Records found..!';
                                    }
                                    // Clear the existing array whenever the user clicks on download,
                                    // to prevent the value getting appended to the existing
                                },
                                function (httpRes) {
                                    PageHelper.hideLoader();
                                    PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                                    PageHelper.showErrors(httpRes);
                                    $log.info("ACH Search Response : " + httpRes);
                                });
                        }
                    }, {
                        "type": "help",
                        "helpExpr": "model.chosenRecordCountText"
                    }
                ]
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
                            "accountNumber": {
                                "key": "ach.accountNumber",
                                "required": true
                            }
                        },
                        "searchHelper": formHelper,
                        "search": function (model, formCtrl, form) {
                            return ACHPDCBatchProcess.fetchDemandDetails({
                                accountNumber: model.accountNumber,
                                demandDate: achDemandDate,
                                repaymentType: 'ACH',
                                submitStatus: 'PENDING',
                                'offset': 1,
                                'limit': 20
                            }).$promise;
                        },
                        "getListDisplayItem": function (item, index) {
                            return [
                                '{{"ACCOUNT_NUMBER"|translate}}: ' + item.accountNumber,
                                '<i class="fa fa-rupee"></i> ' + item.demandAmount
                                //    '{{"ENTITY_NAME"|translate}}: ' + item.customerName
                            ];
                        },
                        "onSelect": function (result, model, context) {
                            model.searchAccountId = false;
                            if (!model.achDemand.reject) {
                                model.achDemand.reject = [];
                            }
                            for (var i = 0; i < model.achDemand.reject.length; i++) {
                                if (result.accountNumber == model.achDemand.reject[i].accountNumber) {
                                    model.searchAccountId = true;
                                    PageHelper.showProgress("page-init", "ACCOUNT ID exist in Demarked Demand", 5000);
                                }
                            }
                            if (model.searchAccountId == false) {
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
                        "onClick": function (modelValue, form, model) {
                            modelValue.searchDemarkAccountId = false;
                            if (modelValue.achDemand.reject) {
                                for (var i = 0; i < modelValue.achDemand.reject.length; i++) {
                                    if (modelValue.achDemand.chosenToMark.accountNumber == modelValue.achDemand.reject[i].accountNumber) {
                                        modelValue.searchDemarkAccountId = true;
                                    }
                                }
                                if (!modelValue.searchDemarkAccountId) {
                                    modelValue.achDemand.chosenToMark.check = false;
                                    modelValue.achDemand.demarkList = modelValue.achDemand.demarkList || [];
                                    modelValue.achDemand.demarkList.push(modelValue.achDemand.chosenToMark);
                                    modelValue.achDemand.reject.push(modelValue.achDemand.chosenToMark.accountNumber);
                                    modelValue.achDemand.chosenToMark = null;
                                }
                            }

                            // modelValue.achDemand.chosenToMark.accountId = ""


                            // if (!modelValue) {
                            //     if (model.achDemand.reject.length > 0) {
                            //         for (var i = 0; i < model.achDemand.reject.length; i++) {
                            //             if (model.achDemand.reject[i].accountId == model.achDemand.chosenToMark.accountId) {
                            //                 model.achDemand.reject[i].check = model.achDemand.chosenToMark.check;
                            //             } else {
                            //                 model.achDemand.reject.push(model.achDemand.chosenToMark);
                            //             }
                            //         }
                            //     } else {
                            //         model.achDemand.reject.push(model.achDemand.chosenToMark);
                            //     }

                            // } else {
                            //     for (var i = 0; i < model.achDemand.reject.length; i++) {
                            //         if (model.achDemand.reject[i].accountId == model.achDemand.chosenToMark.accountId) {
                            //             model.achDemand.reject.splice(i, 1);
                            //         }
                            //     }
                            // }
                        }
                    }
                ]
            }, {
                "type": "box",
                "condition": "model.showUpdateSection",
                "title": "DEMARKED_DEMANDS",
                "items": [{
                    "type": "array",
                    "key": "achDemand.demarkList",
                    "condition": "!model.achDemand.demarkList[arrayIndex].check",
                    "add": null,
                    "startEmpty": true,
                    "remove": null,
                    "title": "CHEQUE_DETAILS",
                    "titleExpr": "(model.achDemand.demarkList[arrayIndex].check?'⚫ ':'⚪ ') + model.achDemand.demarkList[arrayIndex].accountNumber + ' - ' + model.achDemand.demarkList[arrayIndex].demandAmount",
                    "items": [{
                            "key": "achDemand.reject[].accountNumber",
                            "condition": "!model.achDemand.demarkList[arrayIndex].check",
                            "title": "ACCOUNT_NUMBER",
                            "readonly": true
                        },
                        //  {
                        //     "key": "achDemand.reject[].transactionDate",
                        //     //"condition": "!model.achDemand.reject[arrayIndex].check",
                        //     "title": "TRANSACTION_DATE",
                        //     "type": "date"
                        // }, {
                        //     "key": "achDemand.reject[].repaymentDate",
                        //     //"condition": "!model.achDemand.reject[arrayIndex].check",
                        //     "title": "REPAYMENT_DATE",
                        //     "type": "date"
                        // },
                        // {
                        //     "key": "achDemand.reject[].demandAmount",
                        //     //"condition": "!model.achDemand.reject[arrayIndex].check",
                        //     "title": "LOAN_AMOUNT",
                        //     "type": "number",
                        //     "readonly": true
                        // },
                        {
                            "key": "achDemand.demarkList[].demark",
                            "condition": "!model.achDemand.demarkList[arrayIndex].check",
                            "title": "MARK_AS_PAID",
                            "type": "button",
                            "schema": {
                                "default": false
                            },
                            "onClick": function (modelValue, form, modelIndex) {
                                modelValue.achDemand.demarkList[modelIndex.arrayIndex].check = true;
                                modelValue.achDemand.demarkList.splice(modelIndex.arrayIndex, 1);
                                modelValue.achDemand.reject[modelIndex.arrayIndex] = null;
                                

                            }
                        }
                    ]
                }]
            }, {
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
            schema: function () {
                return ACH.getSchema().$promise;
            },
            actions: {
                submit: function (model, form, formName) {
                    PageHelper.clearErrors();
                    PageHelper.clearErrors();
                    PageHelper.showLoader();
                    model.bankAccountNumber = '';
                    model.achDemand.demandDate = model.ach.achDemandListDate;
                    delete model.achDemand.demarkList;
                    delete model.achDemand.chosenToMark;
                    var accountDetailPromise = Queries.getBankAccountsByPartnerForLoanRepay(
                        SessionStore.getGlobalSetting("mainPartner") || "Kinara").then(function (res) {

                        var records = res.body;

                        if (records && _.isArray(records) && records.length > 0) {

                            var defaultBank = $filter('filter')(records, {
                                default_collection_account: true
                            }, true);

                            if (defaultBank && _.isArray(defaultBank) && defaultBank.length > 0)
                                model.bankAccountNumber = defaultBank[0].account_number;
                            model.achDemand.bankAccountNumber = model.bankAccountNumber;
                        }

                    });

                    accountDetailPromise.then(function () {
                        ACHPDCBatchProcess.submitLoanAndDemandForRepayment(model.achDemand).$promise.then(function (resp) {
                                PageHelper.showProgress("page-init", " Demand Processed Successfully", 2000);
                                $state.reload();
                            },
                            function (errResp) {
                                PageHelper.showErrors(errResp);
                            }).finally(function () {
                            PageHelper.hideLoader();
                        })
                    }, function (errorResponse) {
                        PageHelper.showErrors(errorResponse);
                        PageHelper.hideLoader();
                    });
                }
            }
        };
    }
]);
