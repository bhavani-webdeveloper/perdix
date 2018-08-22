irf.pageCollection.factory(irf.page("loans.individual.screening.DoPartnerReview"), ["$log", "$q", "$stateParams", "PageHelper", "formHelper", "IndividualLoan", "$state", "SessionStore", "Utils", "irfNavigator",
    function($log, $q, $stateParams, PageHelper, formHelper, IndividualLoan, $state, SessionStore, Utils, irfNavigator) {

        var branch = SessionStore.getBranch();
        var navigateToQueue = function(model) {
            $state.go('Page.Engine', {
                pageName: 'loans.individual.booking.PendingForPartnerQueue',
                pageId: null
            });
        };
        return {
            "type": "schema-form",
            "title": "DO_PARTNER_REVIEW",
            initialize: function(model, form, formCtrl) {
                if (_.hasIn($stateParams.pageData) && $stateParams.pageData.length) {
                    irfProgressMessage.pop("enrollment", "Loan data is not Exist", 5000);
                    $state.go("Page.Engine", {
                        pageName: 'loans.individual.booking.PendingForPartnerQueue',
                        pageId: null
                    });
                }
                $stateParams.pageData = $stateParams.pageData || {};
                model.review = $stateParams.pageData;
            },
            form: [{
                "type": "box",
                colClass: "col-sm-12",
                "title": "Post Review Decision",
                "items": [{
                    key: "review",
                    type: "tableview",
                    "notitle": true,
                    "selectable": false,
                    "editable": false,
                    "tableConfig": {
                        "searching": true,
                        "paginate": true,
                        "pageLength": 10
                    },
                    getColumns: function() {
                        return [{
                            "title": "ACCOUNT_NUMBER",
                            "data": "accountNumber"
                        }, {
                            "title": "ENTITY_NAME",
                            "data": "customerName"
                        }, {
                            "title": "LOAN_AMOUNT",
                            "data": "loanAmount"
                        }, {
                            "title": "LOAN_TYPE",
                            "data": "loanType"
                        }, {
                            "title": "PARTNER_CODE",
                            "data": "partnerCode"
                        }, {
                            "title": "PROCESS_TYPE",
                            "data": "processType"
                        }]
                    },
                    getActions: function() {
                        return [{
                            name: "REVIEW",
                            desc: "",
                            icon: "fa fa-book",
                            fn: function(item, index) {
                                irfNavigator.go({
                                    state: "Page.Bundle",
                                    pageName: "loans.individual.screening.DoPartnerView",
                                    pageId: item.id
                                });
                            },
                            isApplicable: function(item, index) {
                                return true;
                            }
                        }];
                    }
                }]
            }, {
                "type": "box",
                "title": "PROCEED_SECTION",
                "colClass": "col-sm-12",
                "items": [{
                    key: "review.action",
                    type: "radios",
                    titleMap: {
                        "REJECT": "REJECT",
                        "PROCEED": "PROCEED",
                        "SEND_BACK": "SEND_BACK"
                    }
                }, {
                    type: "section",
                    condition: "model.review.action=='PROCEED'",
                    items: [{
                        title: "REMARKS",
                        key: "review.remarks",
                        type: "textarea",
                        required: true
                    }, {
                        key: "review.proceedButton",
                        type: "button",
                        title: "PROCEED",
                        onClick: "actions.proceed(model, formCtrl, form, $event)"
                    }]
                }, {
                    type: "section",
                    condition: "model.review.action == 'REJECT'",
                    items: [{
                        title: "REMARKS",
                        key: "review.remarks",
                        type: "textarea",
                        required: true
                    }, {
                        key: "review.proceedButton",
                        type: "button",
                        title: "REJECT",
                        onClick: "actions.reject(model, formCtrl, form, $event)"
                    }]
                }, {
                    type: "section",
                    condition: "model.review.action=='SEND_BACK'",
                    items: [{
                        title: "REMARKS",
                        key: "review.remarks",
                        type: "textarea",
                        required: true
                    }, {
                        key: "review.proceedButton",
                        type: "button",
                        title: "PROCEED",
                        onClick: "actions.sendBack(model, formCtrl, form, $event)"
                    }]
                }, ]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "address": {
                        "type": "object",
                        "title": "Address",
                        "properties": {
                            "streetAddress": {
                                "type": "string",
                                "title": "Street Address"
                            },
                            "city": {
                                "type": "string",
                                "title": "City"
                            }
                        }
                    }
                }
            },
            actions: {
                proceed: function(model, form, formName) {
                    Utils.confirm("Are you sure?").then(function() {
                        // var loanAccounts = model.review;
                        PageHelper.showLoader();
                        var promise = [];
                        for (let i = 0; i < model.review.length; i++) {
                            promise[i] = IndividualLoan.get({
                                id: model.review[i].loanId
                            }).$promise;
                        }

                        $q.all(promise).then(function(reviewData) {

                            $log.info("All promises resolved. ")

                            var reqData = {
                                loanAccounts: reviewData
                            };
                            reqData.loanProcessAction = "PROCEED";
                            reqData.remarks = model.review.remarks;
                            reqData.stage = "LoanBooking";

                            IndividualLoan.bulkIndividualLoan(reqData)
                                .$promise
                                .then(function(res) {
                                    PageHelper.showProgress("update-loan", "Done.", 3000);
                                    return navigateToQueue(model);
                                }, function(httpRes) {
                                    PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                    PageHelper.showErrors(httpRes);
                                })
                                .finally(function() {
                                    PageHelper.hideLoader();
                                })


                        }, function(res) {
                            PageHelper.hideLoader();
                            PageHelper.showErrors(res);
                        });
                    });
                },
                reject: function(model, formCtrl, form, $event) {
                    $log.info("Inside reject()");
                    Utils.confirm("Are you sure?").then(function() {
                        // var loanAccounts = model.review;
                        PageHelper.showLoader();
                        var promise = [];
                        for (let i = 0; i < model.review.length; i++) {
                            promise[i] = IndividualLoan.get({
                                id: model.review[i].loanId
                            }).$promise;
                        }

                        $q.all(promise).then(function(reviewData) {

                            $log.info("All promises resolved. ")

                            var reqData = {
                                loanAccounts: reviewData
                            };
                            console.log(reqData);
                            console.log("reqData");
                            reqData.loanProcessAction = "PROCEED";
                            reqData.remarks = model.review.remarks;
                            reqData.stage = "Rejected";

                            IndividualLoan.bulkIndividualLoan(reqData)
                                .$promise
                                .then(function(res) {
                                    PageHelper.showProgress("update-loan", "Done.", 3000);
                                    return navigateToQueue(model);
                                }, function(httpRes) {
                                    PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                    PageHelper.showErrors(httpRes);
                                })
                                .finally(function() {
                                    PageHelper.hideLoader();
                                })


                        }, function(res) {
                            PageHelper.hideLoader();
                            PageHelper.showErrors(res);
                        });
                    });
                },
                sendBack: function(model, formCtrl, form, $event) {
                    $log.info("rejecting");
                    Utils.confirm("Are you sure?").then(function() {
                        // var loanAccounts = model.review;
                        PageHelper.showLoader();
                        var promise = [];
                        for (let i = 0; i < model.review.length; i++) {
                            promise[i] = IndividualLoan.get({
                                id: model.review[i].loanId
                            }).$promise;
                        }

                        $q.all(promise).then(function(reviewData) {

                            $log.info("All promises resolved. ")

                            var reqData = {
                                loanAccounts: reviewData
                            };
                            console.log(reqData);
                            console.log("reqData");
                            reqData.loanProcessAction = "PROCEED";
                            reqData.remarks = model.review.remarks;
                            reqData.stage = "LoanInitiation";

                            IndividualLoan.bulkIndividualLoan(reqData)
                                .$promise
                                .then(function(res) {
                                    PageHelper.showProgress("update-loan", "Done.", 3000);
                                    return navigateToQueue(model);
                                }, function(httpRes) {
                                    PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                                    PageHelper.showErrors(httpRes);
                                })
                                .finally(function() {
                                    PageHelper.hideLoader();
                                })


                        }, function(res) {
                            PageHelper.hideLoader();
                            PageHelper.showErrors(res);
                        });
                    });
                }
            }
        };



    }
]);