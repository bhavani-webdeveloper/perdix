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
irf.pageCollection.factory(irf.page("loans.individual.achpdc.PDCCollections"), ["$log", "SessionStore", 'Utils', 'PDC', 'AuthTokenHelper', 'PageHelper', 'formHelper', '$filter', '$q', '$state',
    function($log, SessionStore, Utils, PDC, AuthTokenHelper, PageHelper, formHelper, $filter, $q, $state) {

        var allDemands = [];
        var branchIDArray = [];
        return {
            "type": "schema-form",
            "title": "PDC_COLLECTIONS",
            "subTitle": Utils.getCurrentDate(),

            initialize: function(model, form, formCtrl) {
                //alert($filter('date')(new Date(), 'dd/MM/yyyy'));
                //alert(moment(new Date()).format("YYYY-MM-DD"));
                //alert(Utils.getCurrentDate());
                allDemands = [];
                model.authToken = AuthTokenHelper.getAuthData().access_token;
                model.userLogin = SessionStore.getLoginname();
                model.pdcSearch = model.pdcSearch || {};
                //model.pdcCollections = model.pdcCollections || {};
                model.showUpdateSection = false;
                model.searchAccountId = false;
                model.searchDemarkAccountId = false;
                model.pdcDemand = model.pdcDemand || {};
                model.pdcDemand.demarkList = model.pdcDemand.demarkList || [];
                model.updateDemand = model.updateDemand || [];
                //model.pdcCollections.demandDate = model.pdcCollections.demandDate || Utils.getCurrentDate();
                console.log(formHelper.enum('branch_id'));
                for (var i = 0; i < formHelper.enum('branch_id').data.length; i++) {
                    branchIDArray.push(parseInt(formHelper.enum('branch_id').data[i].code));
                }
            },
            form: [{
                "type": "box",
                "title": "UPDATE_PDC_DEMANDS",
                "items": [{
                    "key": "pdc.pdcDemandListDate",
                    "title": "INSTALLMENT_DATE",
                    "type": "date"
                }, {
                    "type": "button",
                    "title": "SEARCH_ALL_DEMAND",
                    "onClick": function(model, formCtrl, form) {
                        PageHelper.clearErrors();
                        if (!model.pdc || !model.pdc.pdcDemandListDate) {
                            PageHelper.setError({
                                'message': 'Installment Date is mandatory.'
                            });
                            return false;
                        }
                        model.showUpdateSection = false;
                        PageHelper.showLoader();
                        PDC.getDemandList({
                            demandDate: model.pdc.pdcDemandListDate,
                            branchId: branchIDArray
                        }).$promise.then(function(res) {
                                PageHelper.hideLoader();
                                model.pdcSearch = res;
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
                                    model.pdcSearch[i].repaymentType = "PDC";
                                    // model.pdcSearch[i].accountId = model.pdcSearch[i].accountId;
                                    model.pdcSearch[i].amount = parseInt(model.pdcSearch[i].amount3);
                                    model.pdcSearch[i].repaymentDate = Utils.convertJSONTimestampToDate(model.pdcSearch[i].valueDate);
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
                }, {
                    "type": "help",
                    "helpExpr": "model.chosenRecordCountText"
                }]
            }, {
                "type": "box",
                "condition": "model.showUpdateSection",
                "title": "SEARCH_DAMANDS_TO_DEMARK",
                "items": [{
                        "key": "pdcDemand.chosenToMark.accountId",
                        "title": "ACCOUNT_NUMBER",
                        "type": "lov",
                        "lovonly": true,
                        "inputMap": {
                            "loanAccountNumber": "pdc.loanAccountNumber",
                            "reference": "pdc.reference"
                        },
                        "searchHelper": formHelper,
                        "search": function(model, formCtrl, form) {
                            var filteredDemandList = $filter('filter')(allDemands, {
                                accountId: model.loanAccountNumber,
                                reference: model.reference
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
                                '{{"ACCOUNT_NUMBER"|translate}}: ' + item.accountId + ' <small><i class="fa fa-rupee"></i> ' + item.amount + '</small>',
                                '{{"INSTRUMENT_REFERENCE"|translate}}: ' + item.reference,
                                '{{"ENTITY_NAME"|translate}}: ' + item.customerName
                            ];
                        },
                        "onSelect": function(result, model, context) {
                            model.searchAccountId = false;
                            if (!model.pdcDemand.demarkList) {
                                model.pdcDemand.demarkList = [];
                            }
                            for (var i = 0; i < model.pdcDemand.demarkList.length; i++) {
                                if (result.accountId == model.pdcDemand.demarkList[i].accountId) {
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
                        "key": "pdcDemand.chosenToMark.amount",
                        "title": "LOAN_AMOUNT",
                        "type": "number",
                        "readonly": true
                    }, {
                        "key": "pdcDemand.chosenToMark.demark",
                        "title": "MARK_AS_UNPAID",
                        "condition": "model.pdcDemand.chosenToMark.accountId",
                        "type": "button",
                        "schema": {
                            "default": false
                        },
                        "onClick": function(model, form, formName) {
                            model.searchDemarkAccountId = false;
                            if (model.pdcDemand.demarkList) {
                                for (var i = 0; i < model.pdcDemand.demarkList; i++) {
                                    if (model.pdcDemand.chosenToMark.accountId == model.pdcDemand.demarkList[i].accountId) {
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
                    "titleExpr": "(model.pdcDemand.demarkList[arrayIndex].check?'⚫ ':'⚪ ') + model.pdcDemand.demarkList[arrayIndex].accountId + ' - ' + model.pdcDemand.demarkList[arrayIndex].amount",
                    "items": [{
                            "key": "pdcDemand.demarkList[].accountId",
                            //"condition": "!model.pdcDemand.demarkList[arrayIndex].check",
                            "title": "ACCOUNT_NUMBER",
                            "readonly": true
                        }, {
                            "key": "pdcDemand.demarkList[].amount",
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
                    "type": "button",
                    "notitle": true,
                    "condition": "model.showUpdateSection",
                    "title": "SUBMIT",
                    "onClick": "actions.submit(model, formCtrl)"
                }]
            }],
            schema: function() {
                return PDC.getSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {
                    PageHelper.clearErrors();
                    model.updateDemand = [];
                    for (var i = 0; i < allDemands.length; i++) {
                        var transName = "Scheduled Demand";
                        if (allDemands[i].check == true) {
                            if ((new Date(Utils.getCurrentDate()).getTime()) == (new Date(allDemands[i].repaymentDate).getTime())) {
                                transName = "Scheduled Demand";
                            } else if ((new Date(allDemands[i].transactionDate).getTime()) > (new Date(allDemands[i].repaymentDate).getTime())) {
                                transName = "Scheduled Demand";
                            } else if ((new Date(allDemands[i].transactionDate).getTime()) < (new Date(allDemands[i].repaymentDate).getTime())) {
                                transName = "Scheduled Demand";
                            }
                            model.updateDemand.push({
                                repaymentDate: Utils.convertJSONTimestampToDate(allDemands[i].valueDate),
                                accountNumber: allDemands[i].accountId,
                                amount: parseInt(allDemands[i].amount3),
                                transactionName: transName,
                                productCode: allDemands[i].param1,
                                instrument: "PDC",
                                valueDate: allDemands[i].valueDate,
                                urnNo: allDemands[i].customerName,
                                instrumentDate: Utils.convertJSONTimestampToDate(allDemands[i].valueDate),
                                pdcNo: allDemands[i].sequenceNum,
                                reference: allDemands[i].reference,
                                ifscCode: allDemands[i].responseCode,
                                demandAmount: parseInt(allDemands[i].amount3) 
                            });
                        }
                    }
                    if (model.updateDemand.length > 0) {
                        console.log(model.updateDemand);
                        PageHelper.clearErrors();
                        PageHelper.showLoader();
                        PDC.bulkRepay(model.updateDemand).$promise.then(function(response) {
                            PageHelper.showProgress("page-init", "Done.", 2000);
                            $state.reload();
                            // allDemands = [];
                            // model.showUpdateSection = false;
                        }, function(errorResponse) {
                            PageHelper.showErrors(errorResponse);
                        }).finally(function() {
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