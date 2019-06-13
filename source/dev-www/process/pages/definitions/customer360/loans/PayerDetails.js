irf.pageCollection.factory(irf.page("customer360.loans.PayerDetails"),
    ["PagesDefinition", "$log", "GroupProcess", "SessionStore", "LoanAccount", "$state", "$stateParams", "SchemaResource", "PageHelper", "Enrollment", "formHelper", "IndividualLoan", "Utils", "$filter", "$q", "irfProgressMessage", "Queries", "Files", "LoanBookingCommons", "irfSimpleModal", "irfNavigator", "RepaymentReminder", "$httpParamSerializer",
        function (PagesDefinition, $log, GroupProcess, SessionStore, LoanAccount, $state, $stateParams, SchemaResource, PageHelper, Enrollment, formHelper, IndividualLoan, Utils, $filter, $q, irfProgressMessage, Queries, Files, LoanBookingCommons, irfSimpleModal, irfNavigator, RepaymentReminder, $httpParamSerializer) {

        
            return {
                "type": "schema-form",
                "title": " Update Payer Details",
                "subTitle": "",
                initialize: function (model, form, formCtrl) {
                    model.siteCode = SessionStore.getGlobalSetting("siteCode");
                    var loanAccountId = ($stateParams.pageId.split("."))[0];
                  

                    PagesDefinition.getRolePageConfig("Page/Engine/customer360.loans.PayerDetails")
                        .then(function (data) {
                            if (!_.isNull(data)) {
                                model.pageConfig = data;
                            }
                        }, function (error) {
                            PageHelper.showErrors(error)
                        });

                    IndividualLoan.get({
                        id: loanAccountId
                    })
                        .$promise
                        .then(function (res) {
                            model.loanAccount = res;
                                PageHelper.hideLoader();
                        }, function (err) {
                            PageHelper.showErrors(err);
                            PageHelper.hideLoader();
                        });

                },
                form: [

                    {
                        "type": "box",
                        "title": "PAYER_DETAILS",
                        "items": [
                            {
                                "key": "loanAccount.payeeName",
                                "title": "PAYEE_NAME"
                            },
                            {
                                "key": "loanAccount.payeeMobileNumber",
                                "title": "PAYEE_MOBILE_NUMBER",
                                "inputmode": "number",
                                "numberType": "tel"
                            },
                            {
                                "key": "loanAccount.payeeRelationToApplicant",
                                "title": "PAYEE_RELATION",
                                "type": "select",
                                "enumCode": "payerRelation"
                            }
                        ]
                    },
                    {
                        "type": "actionbox",
                        "items": [{
                            "type": "update",
                            "title": "UPDATE",
                            "onClick": "actions.update(model, formCtrl, form, $event)"
                        }]
                    },

                ],
                schema: function () {
                    return SchemaResource.getLoanAccountSchema().$promise;
                },
                actions: {
                    preSave: function (model, form, formName) {
                        var deferred = $q.defer();
                        if (model.loanAccount.urnNo) {
                            deferred.resolve();
                        } else {
                            irfProgressMessage.pop('LoanInput-save', 'urnNo is required', 3000);
                            deferred.reject();
                        }
                        return deferred.promise;
                    },
                    update: function (model, formCtrl, form, $event) {
                        /* 1)This update is used to update the Existing Document section ,
                        2) separate pageConfig is required to enable this button as it is role specific
                        */
                        $log.info(model);
                        PageHelper.clearErrors();
                        var reqData = {
                            loanAccount: null,
                            loanProcessAction: "SAVE"
                        };
                        reqData.loanAccount = _.cloneDeep(model.loanAccount);
    
                        PageHelper.showLoader();
                        IndividualLoan.update(reqData).$promise.then(function (response) {
                            PageHelper.hideLoader();
                            $log.info(response);
                            PageHelper.showProgress("Loan_Document_Upload", "Update Successful", 5000)
                            $state.reload();
                        }, function (errorResponse) {
                            PageHelper.showErrors(errorResponse);
                            PageHelper.showProgress("Loan_Document_Upload", "Oops. An Error Occurred", 5000);
                            PageHelper.hideLoader();
                        }).finally(function () {
                            PageHelper.hideLoader();
                        });

                    },
                    submit: function (model, form, formName) {
                        $log.info(model);
                        PageHelper.clearErrors();
                        // if(model.loanAccount.guarantors){
                        //    delete model.loanAccount.guarantors;
                        // }
                        model.reqData.loanAccount = _.cloneDeep(model.loanAccount);
                        //alert(model.reqData.loanAccount.loanDocuments.length);
                        model.reqData.loanAccount.loanDocuments = model.reqData.loanAccount.loanDocuments || [];
                        model.reqData.loanProcessAction = "PROCEED";
                        model.reqData.stage = null;
                        if (model.loanDocuments.newLoanDocuments) {
                            for (var i = 0; i < model.loanDocuments.newLoanDocuments.length; i++) {
                                model.loanDocuments.newLoanDocuments[i].loanId = model.loanAccount.id;
                                model.loanDocuments.newLoanDocuments[i].accountNumber = model.loanAccount.accountNumber;
                                model.loanDocuments.newLoanDocuments[i].documentStatus = "APPROVED";

                                model.reqData.loanAccount.loanDocuments.push(model.loanDocuments.newLoanDocuments[i]);
                            }
                        }
                        PageHelper.showLoader();
                        IndividualLoan.update(model.reqData).$promise.then(function (response) {
                            PageHelper.hideLoader();
                            $log.info(response);
                            PageHelper.showProgress("loan-create", "Update Successful", 5000)
                            $state.reload();
                        }, function (errorResponse) {
                            PageHelper.showErrors(errorResponse);
                            PageHelper.showProgress("loan-create", "Oops. An Error Occurred", 5000);
                            PageHelper.hideLoader();
                        }).finally(function () {
                            PageHelper.hideLoader();
                        });

                    }
                }
            };
        }
    ]);
