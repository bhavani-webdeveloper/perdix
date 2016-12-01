irf.pageCollection.factory(irf.page("loans.individual.screening.Review"),
["$log", "$q","LoanAccount", 'SchemaResource', 'PageHelper','formHelper',"elementsUtils",
'irfProgressMessage','SessionStore',"$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "IndividualLoan",
function($log, $q, LoanAccount, SchemaResource, PageHelper,formHelper,elementsUtils,
    irfProgressMessage,SessionStore,$state,$stateParams, Queries, Utils, CustomerBankBranch, IndividualLoan){

    var branch = SessionStore.getBranch();

    var navigateToQueue = function(model){
        if(model.currentStage=='ScreeningReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ScreeningReviewQueue', pageId:null});
        if(model.currentStage=='ApplicationReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ApplicationReviewQueue', pageId:null});
        if(model.currentStage=='Screening')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.ScreeningQueue', pageId:null});
        if(model.currentStage=='Application')
            $state.go('Page.Engine', {pageName: 'loans.individual.booking.ApplicationQueue', pageId:null});
        if (model.currentStage == 'FieldAppraisal')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.FieldAppraisalQueue', pageId:null});
        if (model.currentStage == 'FieldAppraisalReview')
            $state.go('Page.Engine', {pageName: 'loans.individual.screening.FieldAppraisalReviewQueue', pageId:null});
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
            },
            {
                "type": "box",
                "title": "POST_REVIEW",
                "items": [
                    
                ]
            },
            // {
            //     "type": "actionbox",
            //     "condition": "model.loanAccount.id",
            //     "items": [
            //         {
            //             "type": "submit",
            //             "title": "PROCEED"
            //         },
            //         {
            //             "type": "button",
            //             "title": "SENT_BACK",
            //             "onClick": "actions.sentBack(model, formCtrl, form, $event)"
            //         }
            //     ]
            // }
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
            },
            sentBack: function(model, formCtrl, form, $event){
                $log.info("Inside sentBack()");
                Utils.confirm("Are you sure?")
                    .then(
                        function(){
                            var reqData = {loanAccount: _.cloneDeep(model.loanAccount)}
                            reqData.loanProcessAction = 'PROCEED';
                            PageHelper.showLoader();
                            var targetStage = null;
                            switch(model.loanAccount.currentStage){
                                case "ScreeningReview":
                                    targetStage = "Screening";
                                    break;
                                case "Application":
                                    targetStage = "ScreeningReview";
                                    break;
                                case "Psychometric":
                                    targetStage = "Application";
                                    break;
                                case "ApplicationReview":
                                    targetStage = "Psychometric";
                                    break;
                                case "FieldAppraisal":
                                    targetStage = "ApplicationReview";
                                    break;
                                case "FieldAppraisalReview":
                                    targetStage = "FieldAppraisal";
                                    break;
                                case "CentralRiskReview":
                                    targetStage = "FieldAppraisalReview";
                                    break;
                                case "CreditCommitteeReview":
                                    targetStage = "CentralRiskReview";
                                    break;
                                default:
                                    targetStage = null;                                
                            }

                            if (targetStage == null){
                                PageHelper.showProgress("sent-back", "Unable to sent back from current stage.", 5000);
                                return;
                            }
                            reqData.stage = targetStage;
                            PageHelper.showLoader();
                            PageHelper.showProgress('sent-back', 'Working...');
                            IndividualLoan.create(reqData)
                                .$promise
                                .then(function(res){
                                    PageHelper.showProgress('sent-back', 'Sent back successful', 3000);
                                    return navigateToQueue();
                                }, function(httpRes){
                                    PageHelper.showProgress('sent-back', 'Oops. Some error occured.', 3000);
                                    PageHelper.showErrors(httpRes);
                                })
                                .finally(function(httpRes){
                                    PageHelper.hideLoader();
                                })
                        }
                    )
            }
        }
    };
}]);
