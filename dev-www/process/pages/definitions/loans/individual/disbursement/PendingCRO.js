irf.pageCollection.factory(irf.page("loans.individual.disbursement.PendingCRO"),
["$log", "IndividualLoan", "SessionStore","$state", "$stateParams", function($log, IndividualLoan, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "CRO_APPROVAL",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("CRO Approval Page got initialized");

            if (!model._CROQueue)
            {
                $log.info("Screen directly launched hence redirecting to queue screen");
                $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.PendingCROQueue', pageId: null});
                return;
            }
            model.tranche = {};
            model.tranche = _.cloneDeep(model._CROQueue);
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "titleExpr":"('TRANCHE'|translate)+' ' + model._MTQueue.trancheNumber + ' | '+('DISBURSEMENT_DETAILS'|translate)+' | '+ model.customerName",
            "items": [
                {
                    "key": "tranche.trancheNumber",
                    "title": "TRANCHE_NUMBER"
                },
                {
                    "key": "tranche.remarks1",
                    "title": "FRO_REMARKS"
                },
                {
                    "key": "tranche.assigned_date",
                    "title": "Hub Manager Requested Date",
                    "type": "date"
                },
                {
                    "key": "tranche.cro_status",
                    "title": "Status",
                    "type": "radios",
                    "titleMap": {
                                "1": "Approve",
                                "2": "Reject"
                            }
                },
                 {
                    "key": "tranche.remarks2",
                    "title": "REMARKS"
                },
                {
                    "key": "tranche.latitude",
                    "title": "Location",
                    "type": "geotag",
                    "latitude": "tranche.latitude",
                    "longitude": "tranche.longitude"
                },
                {
                    key:"tranche.photoId",
                    "title":"Photo",
                    "category":"customer",
                    "subCategory":"customer",
                    offline: false,
                    type:"file",
                    fileType:"image/*"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
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
                        pageName: 'loans.individual.disbursement.PendingCROQueue',
                        pageId: null
                    });
            }
        }
    };
}]);