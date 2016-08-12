irf.pageCollection.factory("Pages__GenerateEMISchedule",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "GenerateEMISchedule",
        "type": "schema-form",
        "name": "GenerateEMISchedule",
        "title": "Generate EMI Schedule",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("Individual Loan Booking Page got initialized");

            model.rejected_reason="PDC errors";
            model.rejected_remarks="Overwritten on cheques";
            model.remarks_hub_manager="Getting new PDC";

        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "GENERATE EMI SCHEDULE - TRANCHE 2 | Ravi S | Key Metals Pvt. Ltd.", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                
                {
                    "key": "rejected_reason",
                    "title": "Tranche details",
                    "type": "textarea"
                },
                {
                    "key": "rejected_remarks",
                    "title": "Customer Sign Date",
                    "type": "date"
                },
                {
                    "key": "remarks_hub_manager",
                    "title": "Expected Disbursement Date",
                    "type": "date"
                },
                {
                    "type": "actionbox",
                    "items": [{
                        "type": "submit",
                        "title": "Generate EMI Schedule"
                    },{
                        "type": "button",
                        "icon": "fa fa-upload",
                        "title": "Upload EMI Schedule"
                    }]
                }
            ]
        }],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                    $state.go("Page.Engine", {
                        pageName: 'IndividualLoanBookingConfirmation',
                        pageId: model.customer.id
                    });
            }
        }
    };
}]);