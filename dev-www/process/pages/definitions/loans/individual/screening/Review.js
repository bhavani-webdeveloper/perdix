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
                PageHelper.showLoader();
                IndividualLoan.loanRemarksSummary({id: model.loanAccount.id})
                .$promise
                .then(function (resp){


                },function (errResp){

                })
                .finally(function(){
                    PageHelper.hideLoader();
                })
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
                "items": [
                    {
                        type:"fieldset",
                        title:"SCREENING_SCORE_REVIEW",
                        items:[]
                    },
                    {
                        "type": "section",
                        "htmlClass": "row",
                        "items": [
                        {
                            "type": "section",
                            "htmlClass": "col-sm-3",
                            "items": [{
                                "title": "STATUS",
                                "readonly": true
                            }]
                        },
                        {
                            "type": "section",
                            "htmlClass": "col-sm-6",
                            "items": [{
                                "title": "REMARKS",
                                "readonly": true
                            }]
                        }]
                    },
                    {
                        "type":"array",
                        title: "REMARKS",
                        "view": "fixed",
                        "key": "loanSummary",
                        "add": null,
                        "remove": null,
                        "items": [
                        {
                            "type": "section",
                            "htmlClass": "row",
                            "items": [
                            {
                                "type": "section",
                                "htmlClass": "col-sm-3",
                                "items": [{
                                    "key": "loanSummary[].status",
                                    "notitle": true,
                                    "readonly": true
                                }]
                            },
                            {
                                "type": "section",
                                "htmlClass": "col-sm-6",
                                "items": [{
                                    "key": "loanSummary[].remarks",
                                    "notitle": true,
                                    "readonly": true
                                }]
                            }]
                        }]
                    }
                ]
            }
        ],
        schema: function() {
            return SchemaResource.getLoanAccountSchema().$promise;
        },
        actions: {
            
        }
    };
}]);
