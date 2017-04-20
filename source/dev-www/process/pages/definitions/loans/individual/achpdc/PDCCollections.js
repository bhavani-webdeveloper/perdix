/*
About PDCClearingCollection.js
------------------------------
1. To download the demand list with date criteria
2. To upload the demand list and change the status as "MARK AS PAID"

Methods
-------
Initialize : To decare the required model variables.
onClick : To download the Domand List based on date criteria and to call "PDC.getDemandList" service
onChange : To select/unselect all demands listed in array.
customHandle : To upload PDC files(Excel).

Services
--------
PDC.getDemandList : To get all the demands for the entered date. And all the branch ID's are
                    parsed so as to get all the demands for the corresponding date.
PDC.pdcDemandListUpload : To upload the selected file.
PDC.bulkRepay : To repay all the demands marked. The req. is send as JSON Array.
*/
irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCCollections"), ["$log", "SessionStore", 'Utils', 'PDC', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q', '$state', 'Queries', 'ACHPDCBatchProcess',
    function($log, SessionStore, Utils, PDC, AuthTokenHelper, PageHelper, formHelper, $filter, $q, $state, Queries, ACHPDCBatchProcess) {

        var allDemands = [];
        return {
            "type": "schema-form",
            "title": "PDC_COLLECTIONS",
            "subTitle": Utils.getCurrentDate(),

            initialize: function(model, form, formCtrl) {
                //alert($filter('date')(new Date(), 'dd/MM/yyyy'));
                //alert(moment(new Date()).format("YYYY-MM-DD"));
                //alert(Utils.getCurrentDate());
                allDemands = [];
                model.pdcSearch = model.pdcSearch || {};
                //model.pdcCollections = model.pdcCollections || {};
                model.showUpdateSection = false;
                model.searchAccountId = false;
                model.searchDemarkAccountId = false;
                model.pdcDemand = model.pdcDemand || {};
                model.pdcDemand.demarkList = model.pdcDemand.demarkList || [];
                model.updateDemand = model.updateDemand || [];
            },
            form: [{
                "type": "box",
                "title": "UPDATE_PDC_DEMANDS",
                "items": [{
                        "key": "pdc.pdcDemandListDate",
                        "title": "INSTALLMENT_DATE",
                        required: true,
                        "type": "date"
                    },
                    {
                        "key": "pdc.partnerCode",
                        "title": "PARTNER_CODE",
                        "type": "select",
                        "enumCode": "partner",
                        "required": true
                    },
                    {
                        key: "pdc.collectionAccountBank",
                        condition: "model.pdc.partnerCode",
                        type: "lov",
                        autolov: true,
                        title: "COLLECTION_ACCOUNT",
                        required: true,
                        bindMap: {
                        },
                        outputMap: {
                        },
                        searchHelper: formHelper,
                        search: function(inputModel, form, model) {
                            var deferred = $q.defer();
                            Queries.getBankAccountsByPartner(model.pdc.partnerCode).then(
                                function(res) {
                                    $log.info("hi this is sponser!!!");
                                    $log.info(res);
                                    var newBody = [];
                                    for (var i = 0; i < res.body.length; i++) {
                                        if (res.body[i].sponsor_bank_code != null && res.body[i].utility_code != null && res.body[i].sponsor_bank_code!='' && res.body[i].utility_code != '') {
                                            newBody.push(res.body[i])
                                        }
                                    }
                                    res.body = newBody;
                                    deferred.resolve(res);
                                },
                                function(httpRes) {
                                    deferred.reject(res);
                                }
                            );
                            return deferred.promise;
                        },
                        getListDisplayItem: function(item, index) {
                            return [
                                item.account_number,
                                item.sponsor_bank_code + ', ' +
                                item.utility_code
                            ];
                        },
                        onSelect: function(value, model){
                            model.pdc.collectionAccountBank = value.bank_name;
                            model.pdc.collectionAccountCode = value.account_number;
                        }
                    },
                    {
                        "title": "",
                        "type": "section",
                        "html": "<br/><br />"
                    },
                    {
                        "type": "button",
                        "title": "SEARCH_ALL_DEMAND",
                        "onClick": function(model, formCtrl, form) {
                        PageHelper.clearErrors();

                        if (PageHelper.isFormInvalid(formCtrl)){
                            return;
                        }

                        if (!model.pdc || !model.pdc.pdcDemandListDate) {
                            PageHelper.setError({
                                'message': 'Installment Date is mandatory.'
                            });
                            return false;
                        }
                        model.showUpdateSection = false;
                        PageHelper.showLoader();

                        ACHPDCBatchProcess.fetchDemandDetails({
                            demandDate: model.pdc.pdcDemandListDate,
                            repaymentType: 'PDC'
                        }).$promise.then(function(res) {
                                PageHelper.hideLoader();
                                model.pdcSearch = res;
                                model.pdcSearch = $filter('filter')(model.pdcSearch, {submitStatus : 'PENDING'}, true);
                                if (model.pdcSearch.length) {
                                    model.showUpdateSection = true;
                                    model.chosenRecordCountText = model.pdcSearch.length + ' Record(s) found.';
                                } else {
                                    model.showUpdateSection = false;
                                    model.chosenRecordCountText = 'No Records found..!';
                                }
                                // Clear the existing array whenever the user clicks on download,
                                // to prevent the value getting appended to the existing
                                allDemands = [];
                                for (var i = 0; i < model.pdcSearch.length; i++) {
                                    model.pdcSearch[i].check = true;
                                    allDemands.push(model.pdcSearch[i]);
                                }
                            },
                            function(httpRes) {
                                PageHelper.hideLoader();
                                PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                                PageHelper.showErrors(httpRes);
                                $log.info("PDC Search Response : " + httpRes);
                            });
                    }
                    }, 
                    {
                        "type": "help",
                        "helpExpr": "model.chosenRecordCountText"
                    }]
                }, {
                "type": "box",
                "condition": "model.showUpdateSection",
                "title": "SEARCH_DAMANDS_TO_DEMARK",
                "items": [{
                        "key": "pdcDemand.chosenToMark.accountNumber",
                        "title": "ACCOUNT_NUMBER",
                        "type": "lov",
                        "lovonly": true,
                        "inputMap": {
                            "accountNumber": "pdc.accountNumber",
                        },
                        "searchHelper": formHelper,
                        "search": function(model, formCtrl, form) {
                            var filteredDemandList = $filter('filter')(allDemands, {
                                accountId: model.accountNumber,
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
                            if (!model.pdcDemand.demarkList) {
                                model.pdcDemand.demarkList = [];
                            }
                            for (var i = 0; i < model.pdcDemand.demarkList.length; i++) {
                                if (result.accountId == model.pdcDemand.demarkList[i].accountNumber) {
                                    model.searchAccountId = true;
                                    PageHelper.showProgress("page-init", "ACCOUNT ID exist in Demarked Demand", 5000);
                                }
                            }
                            if (model.searchAccountId == false) {
                                model.pdcDemand.chosenToMark = result;
                            }

                        }
                    },

                    {
                        "key": "pdcDemand.chosenToMark.demandAmount",
                        "title": "LOAN_AMOUNT",
                        "type": "number",
                        "readonly": true
                    }, {
                        "key": "pdcDemand.chosenToMark.demark",
                        "title": "MARK_AS_UNPAID",
                        "condition": "model.pdcDemand.chosenToMark.accountNumber",
                        "type": "button",
                        "schema": {
                            "default": false
                        },
                        "onClick": function(model, form, formName) {
                            model.searchDemarkAccountId = false;
                            if (model.pdcDemand.demarkList) {
                                for (var i = 0; i < model.pdcDemand.demarkList; i++) {
                                    if (model.pdcDemand.chosenToMark.accountNumber == model.pdcDemand.demarkList[i].accountNumber) {
                                        model.searchDemarkAccountId = true;
                                    }
                                }
                                if (!model.searchDemarkAccountId) {
                                    model.pdcDemand.chosenToMark.check = false;
                                    model.pdcDemand.demarkList.push(model.pdcDemand.chosenToMark);
                                    model.pdcDemand.chosenToMark = null;
                                }
                            }
                        }
                    }
                ]
            }, {
                "type": "box",
                "condition": "model.showUpdateSection",
                "title": "DEMARKED_DEMANDS",
                "items": [{
                    "type": "array",
                    "key": "pdcDemand.demarkList",
                    //"condition": "!model.pdcDemand.demarkList[arrayIndex].check",
                    "add": null,
                    "startEmpty": true,
                    "remove": null,
                    "title": "CHEQUE_DETAILS",
                    "titleExpr": "(model.pdcDemand.demarkList[arrayIndex].check?'⚫ ':'⚪ ') + model.pdcDemand.demarkList[arrayIndex].accountNumber + ' - ' + model.pdcDemand.demarkList[arrayIndex].demandAmount",
                    "items": [{
                            "key": "pdcDemand.demarkList[].accountNumber",
                            //"condition": "!model.pdcDemand.demarkList[arrayIndex].check",
                            "title": "ACCOUNT_NUMBER",
                            "readonly": true
                        }, {
                            "key": "pdcDemand.demarkList[].demandAmount",
                            //"condition": "!model.pdcDemand.demarkList[arrayIndex].check",
                            "title": "LOAN_AMOUNT",
                            "type": "number",
                            "readonly": true
                        }, {
                            "key": "pdcDemand.demarkList[].demark",
                            //"condition": "!model.pdcDemand.demarkList[arrayIndex].check",
                            "title": "MARK_AS_PAID",
                            "type": "button",
                            "schema": {
                                "default": false
                            },
                            "onClick": function(model, form, formName) {

                                model.pdcDemand.demarkList[formName.arrayIndex].check = true;
                                model.pdcDemand.demarkList.splice(formName.arrayIndex, 1);

                            }
                        }
                    ]
                }]
            }, {
                "type": "actionbox",
                "condition": "model.showUpdateSection",
                "items": [{
                    "type": "submit",
                    "notitle": true,
                    "condition": "model.showUpdateSection",
                    "title": "SUBMIT"
                }]
            }],
            schema: function() {
                return PDC.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                    PageHelper.clearErrors();
                    model.updateDemand = {'achPdcDemandlistDetails' : []};
                    for (var i = 0; i < allDemands.length; i++) {
                        var transName = "Scheduled Demand";
                        if (allDemands[i].check == true) {
                            transName = "Scheduled Demand";
                            model.updateDemand['achPdcDemandlistDetails'].push(allDemands[i]);
                        }
                    }
                    if (model.updateDemand['achPdcDemandlistDetails'].length > 0) {
                        // var reqData = {
                        //     "depositBankAccountNumber": model.pdc.collectionAccountCode,
                        //     "repaymentDtos": model.updateDemand['achPdcDemandlistDetails']
                        // };
                        for(var i = 0; i < model.updateDemand['achPdcDemandlistDetails'].length; i++){
                            model.updateDemand['achPdcDemandlistDetails'][i].submitStatus = 'TO_BE_PROCESSED';
                        }
                        PageHelper.clearErrors();
                        PageHelper.showLoader();
                        ACHPDCBatchProcess.submitDemandForRepayment(model.updateDemand).$promise.then(function(response) {
                            
                            ACHPDCBatchProcess.submitDemandForLoanRepay({type : 'PDC', bankAccountNumber : model.pdc.collectionAccountCode}, model.updateDemand['achPdcDemandlistDetails']).$promise.then(
                                function(resp){
                                    PageHelper.showProgress("page-init", resp + "Check the status in Batch Monitoring screen", 2000);
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
                    } else {
                        PageHelper.showProgress("page-init", "No account seected for repayment", 5000);
                    }
                }
            }
        };
    }
]);
