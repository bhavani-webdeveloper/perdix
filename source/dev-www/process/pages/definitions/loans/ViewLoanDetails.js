irf.pageCollection.factory(irf.page('loans.ViewLoanDetails'), ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter", "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils",
    function($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils) {
        return {
            // "id": "GroupDisbursement",
            "type": "schema-form",
            // "name": "GroupDisbursement",
            // "title": "GROUP_LOAN_DISBURSEMENT",
            // "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("I got initialized");
                // PageHelper.showLoader();
                // irfProgressMessage.pop('loading-loan-details', 'Loading Loan Details');
                // //PageHelper
                // var loanAccountNo = $stateParams.pageId;
                // var promise = LoanAccount.get({
                //     accountId: loanAccountNo
                // }).$promise;
                // promise.then(function(data) { /* SUCCESS */
                //         model.loanAccount = data;
                //         irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                //     }, function(resData) {
                //         irfProgressMessage.pop('group-disbursement', 'Error loading disbursement details.', 2000);
                //     })
                //     .finally(function() {
                //         PageHelper.hideLoader();
                //     })

                model.tableview = model.tableview || {};
                model.tableview.account_num = 977621588854;
                model.tableview.bc_ac = "IR/977621588854";
                model.tableview.product_code = "T115";
                model.tableview.product_type = "";
                model.tableview.loan_type = "UNSECURED";
                model.tableview.frequency = "Monthly";
                model.tableview.tenure = "12";
                model.tableview.status = "ACTIVE";
                model.tableview.preclosure = 30022;



            },
            offline: false,
            form: [{
                "type": "box",
                "title": "LOAN DETAILS",
                "items": [{
                    key: "tableview.account_num",
                    type: "number",
                    readonly: true
                }, {
                    key: "tableview.bc_ac",
                    type: "string",
                    readonly: true

                }, {
                    key: "tableview.product_code",
                    type: "string",
                    readonly: true

                }, {
                    key: "tableview.product_type",
                    type: "string",
                    readonly: true

                }, {
                    key: "tableview.loan_type",
                    type: "string",
                    readonly: true

                }, {
                    key: "tableview.frequency",
                    type: "string",
                    readonly: true

                }, {
                    key: "tableview.tenure",
                    type: "string",
                    readonly: true

                }, {
                    key: "tableview.status",
                    type: "string",
                    readonly: true

                }]
            }, {
                "type": "box",
                "title": "LOAN DOCUMENTS",
                "items": []

            }, {
                "type": "box",
                "title": "COLLATERAL DOCUMENTS",
                "items": []

            }, {
                "type": "box",
                "title": "PRECLOSURE AMOUNT",
                "items": [{
                    key: "tableview.preclosure",
                    type: "number"

                },
                {
                    type: "actionbox",
                    items: [{
                            type: "submit",
                            title: "Authenticate for Closure"
                        }, {
                            type: "submit",
                            title: "Close Loan"
                        }

                    ]
                }]

            }, {
                "type": "box",
                "title": "ARTIFACTS AND ACTIONS",
                "items": [{
                    key: "tableview.table_details",
                    type: "array",
                    title: "Table Items",
                    items: [{
                        key: "tableview.table_details[].artifact",
                        type: "string"

                    }, {
                        key: "tableview.table_details[].status",
                        type: "string"

                    }, {
                        key: "tableview.table_details[].download",
                        type: "string"

                    }, {
                        key: "tableview.table_details[].upload",
                        type: "string"

                    }, {
                        key: "tableview.table_details[].view",
                        type: "string"


                    }]

                }],
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "tableview": {
                        "type": "object",
                        "title": "tableview",
                        "properties": {
                            "preclosure": {
                                "type": "number",
                                "title": "Preclosure Amount"
                            },
                            "account_num": {
                                "type": "number",
                                "title": "Account Number"
                            },
                            "bc_ac": {
                                "type": "string",
                                "title": "BC A/c #"
                            },

                            "product_code": {
                                "type": "string",
                                "title": "Product Code"
                            },
                            "product_type": {
                                "type": "string",
                                "title": "Product Type"
                            },
                            "loan_type": {
                                "type": "string",
                                "title": "Loan Type"
                            },
                            "frequency": {
                                "type": "string",
                                "title": "Frequency"
                            },
                            "tenure": {
                                "type": "string",
                                "title": "Tenure"
                            },

                            "status": {
                                "type": "string",
                                "title": "Status"
                            },
                            "table_details": {
                                "type": "array",
                                "title": "Array Items",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "artifact": {
                                            "type": "string",
                                            "title": "Artifact"
                                        },
                                        "status": {
                                            "type": "string",
                                            "title": "Status"
                                        },
                                        "download": {
                                            "type": "string",
                                            "title": "Download"
                                        },
                                        "upload": {
                                            "type": "string",
                                            "title": "Upload "
                                        },
                                        "view": {
                                            "type": "string",
                                            "title": "View"
                                        },
                                        "excess_quantity": {
                                            "type": "string",
                                            "title": "EXCESS"
                                        },
                                        "description": {
                                            "type": "string",
                                            "title": "DESCRIPTION"
                                        },
                                        "description1": {
                                            "type": "string",
                                            "title": "COMMENTS"
                                        }

                                    }
                                }
                            }



                        },


                    }
                },
            },
            actions: {
                preSave: function(model, formCtrl) {
                    var deferred = $q.defer();
                    model._storedData = null;
                    deferred.resolve();
                    return deferred.promise;
                },
                submit: function(model, formCtrl, formName) {
                    $log.info("Inside submit");
                }
            }
        }
    }
]);




// irf.pageCollection.factory(irf.page('loans.ViewLoanDetails'),
//     ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter","Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils",
//         function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils) {
//             return {
//                 "id": "GroupDisbursement",
//                 "type": "schema-form",
//                 "name": "GroupDisbursement",
//                 "title": "GROUP_LOAN_DISBURSEMENT",
//                 "subTitle": "",
//                 initialize: function (model, form, formCtrl) {
//                     $log.info("I got initialized");
//                     PageHelper.showLoader();
//                     irfProgressMessage.pop('loading-loan-details', 'Loading Loan Details');
//                     //PageHelper
//                     var loanAccountNo = $stateParams.pageId;
//                     var promise = LoanAccount.get({accountId: loanAccountNo}).$promise;
//                     promise.then(function (data) { /* SUCCESS */
//                         model.loanAccount = data;
//                         irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
//                     }, function (resData) {
//                         irfProgressMessage.pop('group-disbursement', 'Error loading disbursement details.', 2000);
//                     })
//                         .finally(function(){
//                             PageHelper.hideLoader();
//                         })

//                 },
//                 offline: false,
//                 form: [
//                     {
//                         "type":"box",
//                         "title":"ACCOUNTS",
//                         "items":[

//                         ]
//                     }
//                 ],
//                 actions: {
//                     preSave: function (model, formCtrl) {
//                         var deferred = $q.defer();
//                         model._storedData = null;
//                         deferred.resolve();
//                         return deferred.promise;
//                     },
//                     submit: function (model, formCtrl, formName) {
//                         $log.info("Inside submit");
//                     }
//                 }
//             }
//         }]);{
// "type": "box",
// "title":"ARTIFACTS AND ACTIONS",
// "colClass": "col-sm-12",
//     "items": [
//         {
//             type: "tableview",
//             listStyle: "table",
//             key: "accountDocumentTracker",
//             title: "ACCOUNT_DETAILS",
//             selectable: true,
//             expandable: true,
//             paginate: false,
//             searching: false,
//             getColumns: function(){
//                 return [{
//                     title: 'SPOKE_NAME',
//                     data: 'centreName'
//                 }, {
//                     title: 'APPLICANT_NAME',
//                     data: 'applicantName'
//                 }, {
//                     title: 'ENTITY_NAME',
//                     data: 'customerName'
//                 }, {
//                     title: 'ACCOUNT_NUMBER',
//                     data: 'accountNumber'
//                 }, {
//                     title: 'DISBURSEMENT_DATE',
//                     data: 'scheduledDisbursementDate'
//                 }, {
//                     title: 'STATUS',
//                     data: 'status'
//                 }]
//             },
//             getActions: function(item) {

//                 return [{
//                     name:"View Details",
//                     desc:"",
//                     icon:"fa fa-registered",
//                     fn: function(item){
//                         $timeout(function() {
//                             localModel.$tempAccountDocTracker = item;
//                             if(item.currentStage!="PendingVerification")
//                                 localModel.$tempAccountDocTrackerDetails = item.accountDocTrackerDetails;
//                             localModel.$tempAccountDocumentTrackingHistory = item.accountDocumentTrackingHistory;
//                         });
//                     },
//                     isApplicable: function(item, index) {
//                         return true;
//                     }
//                 }];
//             }
//         },
//         {
//             "type":"section",
//             "htmlClass":"row",
//             "items":[
//             {
//                 "type":"section",
//                 "htmlClass":"col-sm-1",
//                 "items":[
//                     { 
//                         type: 'button',  
//                         key:"btnAcceptButton",
//                         title: 'Accept',
//                         "onClick": function(model, formCtrl, form, event) {
//                             var selectOne=false;
//                             for(i=0;i<model.accountDocumentTracker.length;i++){
//                                 if(model.accountDocumentTracker[i].$selected){
//                                     model.accountDocumentTracker[i].status = "Accept";
//                                     selectOne = true;
//                                 }
//                                 model.accountDocumentTracker[i].$selected = false;
//                             }
//                             formCtrl.redraw();
//                             if(!selectOne)
//                                 PageHelper.showProgress("view-account","Please select atleast one row",3000);
//                         }
//                     }
//                 ]
//             },
//             {
//                 "type":"section",
//                 "htmlClass":"col-sm-1",
//                 "items":[
//                     { 
//                         type: 'button',  
//                         key:"btnRejectButton",
//                         title: 'Reject',
//                         "onClick": function(model, formCtrl, form, event) {
//                             var selectOne=false;
//                             for(i=0;i<model.accountDocumentTracker.length;i++){
//                                 if(model.accountDocumentTracker[i].$selected){
//                                     model.accountDocumentTracker[i].status = "Reject";
//                                     selectOne = true;
//                                 }
//                                 model.accountDocumentTracker[i].$selected = false;
//                             }
//                             formCtrl.redraw();
//                             if(!selectOne)
//                                 PageHelper.showProgress("view-account","Please select atleast one row",3000);
//                         }
//                     }
//                 ]
//             }
//             ]
//         }
//     ]
// }