irf.pageCollection.factory(irf.page("loans.individual.disbursement.MultiTranche"),
["$log", "IndividualLoan", "SessionStore","$state", "$stateParams", function($log, IndividualLoan, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "SUBSEQUENT TRANCHE DISBURSEMENT",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Multi Tranche Page got initialized");
            if (!model._MTQueue)
            {
                $log.info("Screen directly launched hence redirecting to queue screen");
                $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.MultiTrancheQueue', pageId: null});
                return;
            }
            model.tranche = {};
            model.tranche = _.cloneDeep(model._MTQueue);
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "titleExpr":"{{'TRANCHE'|translate}}+' ' + model._MTQueue.trancheNumber + ' | '+{{'DISBURSEMENT_DETAILS'|translate}}+' | '+ model.customerName"
            "items": [
                {
                    "key": "tranche.trancheNumber",
                    "title": "TRANCHE_NUMBER",
                    "type": "textarea"
                },
                {
                    "key": "tranche.scheduledDisbursementDate",
                    "title": "DISBURSEMENT_DATE",
                    "type": "date"
                },
                {
                    "key": "tranche.customerSignatureDate",
                    "title": "CUSTOMER_SIGN_DATE",
                    "type": "date"
                },
                {
                    "key": "tranche.remarks",
                    "title": "REMARKS"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "SUBMIT"
                    }]
                }
            ]
        }],
        schema: function() {
            return IndividualLoan.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'loans.individual.disbursement.MultiTrancheQueue',
                        pageId: null
                    });
            }
        }
    };
}]);