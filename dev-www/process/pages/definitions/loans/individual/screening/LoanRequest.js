irf.pageCollection.factory(irf.page("loans.individual.screening.LoanRequest"),
["$log", "$q","LoanAccount", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch",
function($log, $q, LoanAccount, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "LOAN_REQUEST",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl) {
            model.customer = model.customer || {};
            //model.branchId = SessionStore.getBranchId() + '';
            //model.customer.kgfsName = SessionStore.getBranch();
            model.customer.customerType = "Enterprise";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                item.customer.firstName,
                item.customer.centreCode,
                item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
            ]
        },
        form: [
            {
                "type": "box",
                "title": "PRELIMINARY_INFORMATION",
                "items": [
                    {
                        key: "loanAccount.loanPurpose1",
                        type: "select",
                        enumCode: "loan_purpose_1"
                    },
                    {
                        key: "loanAccount.loanPurpose2",
                        type: "select",
                        enumCode: "loan_purpose_2",
                        parentEnumCode: "loan_purpose_1"
                    },
                ]
            },
            {
                "type": "actionbox",
                "items": [/*{
                    "type": "save",
                    "title": "SAVE_OFFLINE",
                },*/{
                    "type": "submit",
                    "title": "SUBMIT"
                }]
            }
        ],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            preSave: function(model, form, formName) {
                var deferred = $q.defer();
                if (model.customer.firstName) {
                    deferred.resolve();
                } else {
                    irfProgressMessage.pop('enrollment-save', 'Customer Name is required', 3000);
                    deferred.reject();
                }
                return deferred.promise;
            },
            submit: function(model, form, formName){
                $log.info("Inside submit()");
                $log.warn(model);
                var sortFn = function(unordered){
                    var out = {};
                    Object.keys(unordered).sort().forEach(function(key) {
                        out[key] = unordered[key];
                    });
                    return out;
                };
                var reqData = _.cloneDeep(model);
                EnrollmentHelper.fixData(reqData);
                if (reqData.customer.id) {
                    EnrollmentHelper.proceedData(reqData).then(function(resp){
                        // Utils.removeNulls(resp.customer,true);
                        // model.customer = resp.customer;
                        $state.go('Page.Landing', null);
                    });
                } else {
                    EnrollmentHelper.saveData(reqData).then(function(res){
                        EnrollmentHelper.proceedData(res).then(function(resp){
                            // Utils.removeNulls(resp.customer,true);
                            // model.customer = resp.customer;
                            $state.go('Page.Landing', null);
                        }, function(err) {
                            Utils.removeNulls(res.customer,true);
                            model.customer = res.customer;
                        });
                    });
                }
            }
        }
    };
}]);
