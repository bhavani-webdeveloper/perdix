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

                    model.loanSummary = resp;

                    if (_.isArray(model.loanSummary) && model.loanSummary.length > 0){
                        var lastEntry = model.loanSummary[model.loanSummary.length - 1];
                        var aTime = new moment(lastEntry.createdDate);
                        var bTime = new moment();
                        model.minutesInCurrentStage = Utils.millisecondsToStr(bTime.diff(aTime));
                    }
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
                "colClass": "col-sm-12",
                "title": "REMARKS_HISTORY",
                "items": [
                    {
                        "type": "section",
                        "htmlClass": "",
                        "html":"<div class='callout callout-info text-white'><h1>{{ model.minutesInCurrentStage }}</h1> <p>spent in current stage.</p></div>"
                    },
                    {
                        type:"tableview",
                        key:"loanSummary",
                        selectable: false,
                        paginate: false,
                        searching: false,
                        getColumns: function() {
                            return [{
                                title: 'ACTION',
                                data: 'action'
                            }, {
                                title: 'FROM_STAGE',
                                data: 'preStage'
                            }, {
                                title: 'TO_STAGE',
                                data: 'postStage'
                            }, {
                                title: 'CREATED_BY',
                                data: 'createdBy'
                            }, {
                                title: 'CREATED_DATE',
                                data: 'createdDate',
                                render: function(data, type, full, meta) {
                                    return moment(data, "YYYY-MM-DD[T]hh:mm:ss[Z]").format('YYYY-MM-DD hh:mm:ss');
                                }
                            }, {
                                title: 'REMARKS',
                                data: 'remarks'
                            }, {
                                title: 'STATUS',
                                data: 'status'
                            },
                            {
                                title: 'TIME_SPENT',
                                data: 'timeSpent',
                                render: function(data, type, full, meta){
                                    return Utils.millisecondsToStr(data * 60 * 1000);
                                }
                            }]
                        }
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
