irf.pageCollection.factory(irf.page('loans.LoanAmend'), ["$log", "$q", "$timeout", "SessionStore", "$state", "LoanProcess", "formHelper", "$stateParams", "LoanAccount", "irfProgressMessage",
    "PageHelper", "irfStorageService", "$filter", "Files", "elementsUtils", "Queries", "Utils", "AuthTokenHelper",
    function($log, $q, $timeout, SessionStore, $state, LoanProcess, formHelper, $stateParams, LoanAccount, irfProgressMessage, PageHelper, StorageService, $filter, Files, elementsUtils, Queries, Utils, AuthTokenHelper ) {

        function backToLoansList() {   
            try { 
                var urnNo = ($stateParams.pageId.split("."))[1];
                $state.go("Page.Engine", {
                    pageName: "customer360.loans.View",
                    pageId: urnNo
                });
            } catch (err) {
                console.log(err); 
            }
        };

    var computeEMI = function(model) {
        if (model.loanAccount.loanAmount == '' || model.loanAccount.interestRate == '' || model.loanAccount.frequencyRequested == '' || model.loanAccount.tenure == '')
            return;

        var principal = model.loanAccount.loanAmount;
        var interest = model.loanAccount.interestRate / 100 / 12;
        var payments;
        if (model.loanAccount.frequencyRequested == 'Yearly')
            payments = model.loanAccount.tenure * 12;
        else if (model.loanAccount.frequencyRequested == 'Monthly')
            payments = model.loanAccount.tenure;

        // Now compute the monthly payment figure, using esoteric math.
        var x = Math.pow(1 + interest, payments);
        var monthly = (principal * x * interest) / (x - 1);

        // Check that the result is a finite number. If so, display the results.
        if (!isNaN(monthly) &&
            (monthly != Number.POSITIVE_INFINITY) &&
            (monthly != Number.NEGATIVE_INFINITY)) {

            model.loanAccount.estimatedEmi = round(monthly);
            //document.loandata.total.value = round(monthly * payments);
            //document.loandata.totalinterest.value = round((monthly * payments) - principal);
        }
        // Otherwise, the user's input was probably invalid, so don't
        // display anything.
        else {
            model.loanAccount.estimatedEmi = "";
            //document.loandata.total.value = "";
            //document.loandata.totalinterest.value = "";
        }

    };
        // This simple method rounds a number to two decimal places.
        function round(x) {
          return Math.ceil(x);
        }

        return {
            "type": "schema-form",
            "title": "LOAN_AMENDMENT",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {

                model.amand = {};
                //model.authToken = AuthTokenHelper.getAuthData().access_token;
                model.amand.amendmentType = "TENURE";
                var loanAccountNo = ($stateParams.pageId.split("."))[0];
                var promise = LoanAccount.get({
                    accountId: loanAccountNo
                }).$promise;

                promise.then(function(data) {
                    $log.info(data);
                    model.amand.accountId = data.accountId;
                    model.amand.frequency = data.tenureUnit;
                    model.amand.currentTenure = data.tenureMagnitude;
                    model.amand.emi = data.equatedInstallment;
                    model.amand.accountBalance = data.accountBalance;
                    model.amand.normalInterestRate = data.normalInterestRate;

                    irfProgressMessage.pop('loading-loan-details', 'Loaded.', 2000);
                }, function(resData) {
                    irfProgressMessage.pop('loading-loan-details', 'Error loading Loan details.', 4000);
                    PageHelper.showErrors(resData);
                    backToLoansList();
                });

            },

            offline: false,
            form: [{
                "type": "box",
                "title": "TENURE_AMENDMENT",
                "items": [{
                    key: "amand.accountId",
                    readonly: true,
                    title: "ACCOUNT_ID",
                },{
                    key: "amand.accountBalance",
                    readonly: true,
                    title: "Account Balance",
                }, {
                    key: "amand.currentTenure",
                    readonly: true,
                    title: "CurrentTenure",
                }, {
                    key: "amand.frequency",
                    readonly: true,
                    title: "Frequency",
                },{
                    key: "amand.normalInterestRate",
                    readonly: true,
                    title: "NORMAL_INTEREST_RATE",
                },{
                    key: "amand.emi",
                    title: "Current EMI",
                    readonly: true,
                },{
                    type: "fieldset",
                    title: "New_TENURE",
                    items: [{
                        key: "amand.tenure",
                        title: "TENURE",
                    },{
                        key: "amand.newemi",
                        readonly:true,
                        title: "Estimated EMI",
                    }]
                }, {
                    key: "amand.submit",
                    title: "SUBMIT",
                    type: "button",
                    onClick: function(model) {
                        $log.info("Inside submit()");
                        var reqData = _.cloneDeep(model.amand);
                        reqData.tenure = reqData.tenure + " " + reqData.frequency;
                        var promise = LoanAccount.updateTenure(reqData).$promise;
                        PageHelper.showProgress("tenure-amendment", "Updating Loan....");
                        promise.then(
                            function(response) {
                                model.amand.tenuredownload = true;
                                PageHelper.showProgress("tenure-amendment", "Done", 5000);
                                PageHelper.showBlockingLoader();
                                LoanProcess.generatedefaultschedule({accountNumber: model.amand.accountId})
                                    .$promise
                                    .then(function(response){
                                            PageHelper.showProgress("tenure-amendment-load-schedule", "Schedule updated", 4000);
                                            Queries.getLoanAccountByAccountNumber(model.amand.accountId)
                                                .then(function(res){
                                                    $log.info(res);
                                                    model.amand.loanId = res.id;
                                                     var promise = LoanAccount.get({
                                                         accountId: res.account_number
                                                     }).$promise;
                                                     promise.then(function(data)
                                                     {
                                                        model.amand.newemi=data.equatedInstallment;
                                                     });

                                                }, function(httpRes){
                                                    PageHelper.showProgress("tenure-amendment-load-schedule", "Failed to Load Loan Details", 4000);
                                                })
                                        }, function(httpRes){
                                            PageHelper.showProgress("tenure-amendment-load-schedule", "Failed to update schedule", 4000);
                                        }
                                    ).finally(function(){
                                        PageHelper.hideBlockingLoader();
                                    })
                            },
                            function(error) {
                                PageHelper.showProgress("tenure-amendment", "Error Updating new tenure details.", 5000);
                                PageHelper.showErrors(error);
                            });
                    }
                }, {
                    type: "fieldset",
                    condition: "model.amand.tenuredownload",
                    title: "DOWNLOAD_NEW_TENURE",
                    items: [{
                        "title": "DOWNLOAD",
                        "htmlClass": "btn-block",
                        "icon": "fa fa-download",
                        "type": "button",
                        "notitle": true,
                        "readonly": false,
                        "onClick": function(model, formCtrl, form, $event) {
                            Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name=installment_schedule_loan&record_id=" + model.amand.loanId)
                        }
                    }]
                }, ]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "amand": {
                        "type": "object",
                        "required": [],
                        "properties": {
                            "accountId": {
                                "type": "string",
                                "title": "ACCOUNT_ID"
                            },
                            "tenure": {
                                "type": "number",
                                "title": "TENURE"
                            }
                        }
                    }
                }
            },
            actions: {
                submit: function(model, form, formName) {
                    $log.info('on submit action ....');
                    $log.warn(model);
                    var sortFn = function(unordered) {
                        var out = {};
                        Object.keys(unordered).sort().forEach(function(key) {
                            out[key] = unordered[key];
                        });
                        return out;
                    };
                    var reqData = _.cloneDeep(model.customer);
                    Maintenance.updateSpoke(reqData, null).$promise.then(
                        function(response) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress("Spoke updated", "Done.", 2000);
                        },
                        function(errorResponse) {
                            PageHelper.hideLoader();
                            PageHelper.showErrors(errorResponse);
                        }
                    );
                },
            }
        };
    }
]);