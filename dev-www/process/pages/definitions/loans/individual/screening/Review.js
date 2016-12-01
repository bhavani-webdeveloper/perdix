irf.pageCollection.factory(irf.page("loans.individual.screening.Review"),
["$log", "$q","LoanAccount", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
function($log, $q, LoanAccount, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan){

    var branch = SessionStore.getBranch();

    var validateForm = function(formCtrl){
        formCtrl.scope.$broadcast('schemaFormValidate');
        if (formCtrl && formCtrl.$invalid) {
            PageHelper.showProgress("enrolment","Your form have errors. Please fix them.", 5000);
            return false;
        }
        return true;
    }

    var navigateToQueue = function(model){
        if(model.currentStage=='Screening')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ScreeningQueue', pageId:null});
        if(model.currentStage=='ScreeningReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ScreeningReviewQueue', pageId:null});
        if(model.currentStage=='Application')
            $state.go('Page.Engine', {pageName: 'loans.individual.booking.ApplicationQueue', pageId:null});
        if(model.currentStage=='ApplicationReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ApplicationReviewQueue', pageId:null});
        if (model.currentStage == 'FieldAppraisal')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.FieldAppraisalQueue', pageId:null});
        if (model.currentStage == 'FieldAppraisalReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.FieldAppraisalReviewQueue', pageId:null});
        if (model.currentStage == 'CreditCommitteeReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.CreditCommitteeReviewQueue', pageId:null});
        if (model.currentStage == 'CentralRiskReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.CentralRiskReviewQueue', pageId:null});
    }

    return {
        "type": "schema-form",
        "title": "REVIEW",
        "subTitle": "BUSINESS",
        initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
            model.currentStage = bundleModel.currentStage;
            if (_.hasIn(model, 'loanAccount')){
                $log.info('Printing Loan Account');
                $log.info(model.loanAccount);
            } else {
                model.customer = model.customer || {};
                //model.branchId = SessionStore.getBranchId() + '';
                //model.customer.kgfsName = SessionStore.getBranch();
                model.customer.customerType = "Enterprise";

                model.loanAccount = {};
                model.loanAccount.loanCustomerRelations = [];

                /* TODO REMOVE THIS CODE.. TEMP CODE ONLY */
                //model.loanAccount.productCode = 'TLAPS';
                //model.loanAccount.tenure = 12;
                model.loanAccount.frequency = 'M';
                model.loanAccount.isRestructure = false;
                model.loanAccount.documentTracking = "PENDING";    
                /* END OF TEMP CODE */
            }
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            return [
                item.customer.firstName,
                item.customer.centreCode,
                item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
            ]
        },
        eventListeners: {
            
        },
        form: [
            {
                "type": "box",
                "title": "HISTORY_REVIEWS",
                "items": [
                ]
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
                /* TODO Call proceed servcie for the loan account */
                
                Utils.confirm("Are You Sure?").then(function(){

                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanProcessAction = "PROCEED";
                    PageHelper.showLoader();
                    PageHelper.showProgress("update-loan", "Working...");
                    IndividualLoan.update(reqData)
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress("update-loan", "Done.", 3000);
                            return navigateToQueue(model);
                        }, function(httpRes){
                            PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                })
            },
            sendBack: function(model, formCtrl, form, $event){
                $log.info("Inside sendBack()");
                if (!validateForm(formCtrl)){
                    return;
                }
                Utils.confirm("Are You Sure?").then(function(){
                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanProcessAction = "PROCEED";
                    reqData.stage = model.review.targetStage;
                    reqData.remarks = model.review.remarks;
                    PageHelper.showLoader();
                    PageHelper.showProgress("update-loan", "Working...");
                    IndividualLoan.update(reqData)
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress("update-loan", "Done.", 3000);
                            return navigateToQueue(model);
                        }, function(httpRes){
                            PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                })

            },
            reject: function(model, formCtrl, form, $event){
                $log.info("Inside reject()");
                if (!validateForm(formCtrl)){
                    return;
                }
                Utils.confirm("Are You Sure?").then(function(){

                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanProcessAction = "PROCEED";
                    reqData.stage = "Rejected";
                    reqData.remarks = model.review.remarks;
                    PageHelper.showLoader();
                    PageHelper.showProgress("update-loan", "Working...");
                    IndividualLoan.update(reqData)
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress("update-loan", "Done.", 3000);
                            return navigateToQueue(model);
                        }, function(httpRes){
                            PageHelper.showProgress("update-loan", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                })
            },
            save: function(model, formCtrl, form, $event){
                $log.info("Inside save()");
                /* TODO Call save service for the loan */
                Utils.confirm("Are You Sure?")
                    .then(
                        function(){
                            
                            var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                            reqData.loanProcessAction = "SAVE";
                            PageHelper.showLoader();
                            IndividualLoan.create(reqData)
                                .$promise
                                .then(function(res){
                                    model.loanAccount = res.loanAccount;    
                                }, function(httpRes){
                                    PageHelper.showErrors(httpRes);
                                })
                                .finally(function(httpRes){
                                    PageHelper.hideLoader();
                                })
                        }
                    );
            }
        }
    };
}]);
