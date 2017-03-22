irf.pageCollection.factory(irf.page("loans.UnmarkNPA"),
["$log", "Queries", "SessionStore", "$state","$stateParams", "formHelper", "LoanProcess","LoanAccount", "Utils", "PageHelper", "$q",
function($log, Queries, SessionStore, $state,$stateParams, formHelper, LoanProcess,LoanAccount, Utils, PageHelper, $q) {

    var branch = SessionStore.getBranch();

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
        }


    return {
        "type": "schema-form",
        "title": "UNMARK_NPA",
        initialize: function(model, form, formCtrl) {
            model.customer = model.customer || {};
                var loanAccountNo = ($stateParams.pageId.split("."))[0];
                var promise = LoanAccount.get({
                    accountId: loanAccountNo
                }).$promise;

                promise.then(function(data) {
                    $log.info(data);
                    model.customer.amount = data.amount;
                    model.customer.npa=data.npa;
                    model.customer.accountNumber=data.accountId;
                    //model.customer.valueDate=data.disbursementByDate;
                   model.customer.valueDate=(data.disbursementByDate != null) ? moment(data.disbursementByDate).format("YYYY-MM-DD") : null;
                    PageHelper.showProgress('loading-loan-details', 'Loaded.', 2000);
                }, function(resData) {
                    PageHelper.showProgress('loading-loan-details', 'Error loading Loan details.', 4000);
                    PageHelper.showErrors(resData);
                    backToLoansList();
                });
            $log.info("Unmark NPA Screen got initialized");
        },
        form: [
            {
                "type": "box",
                "title": "UNMARK_NPA",
                "items": [

                    {
                        "key": "customer.accountNumber",
                        "title": "ACCOUNT_NUMBER",
                        "readonly": true
                    },
                    {
                        "key": "customer.npa",
                        "title": "NPA",
                        "readonly": true
                    },
                    {
                        "key": "customer.amount",
                        "title": "AMOUNT",
                        "readonly": true
                    },
                    {
                        "key": "customer.valueDate",
                        "title": "DISBURSEMENT_DATE",
                        "type":"date",
                        "readonly": true
                        //"readonly": true
                    }
                ]
            },
            {
                "type": "actionbox",
                "items": [
                    {
                        "type": "submit",
                        "title": "UNMARK_NPA"
                    }
                ]
            }
        ],
        schema: {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "customer": {
                    "type": "object",
                    "properties": {
                        "accountId": {
                            "type": "string"
                        }
                    }
                }
            }
        },
        actions: {
            submit: function(model, form, formName) {
                PageHelper.clearErrors();
                var reqData = _.cloneDeep(model.customer);
                Utils.confirm("Are you sure?").then(function(){
                    PageHelper.showLoader();
                    PageHelper.showProgress("Unmark NPA","Working",3000);
                    LoanProcess.UnmarkNPA({accountNumber :reqData.accountNumber,valueDate:reqData.valueDate},{}).$promise.then(function(resp) {
                        PageHelper.showProgress("Unmark NPA","npa Unmarked successfully",3000);
                    }, function(errResp) {
                        PageHelper.showErrors(errResp);
                    }).finally(function() {
                        PageHelper.hideLoader();
                    });
                });
            }
        }
    };
}]);


