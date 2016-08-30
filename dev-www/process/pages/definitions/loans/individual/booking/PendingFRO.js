irf.pageCollection.factory("Pages__PendingFRO",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "PendingFRO",
        "type": "schema-form",
        "name": "PendingFRO",
        "title": "FRO Approval",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("FRO Approval Page got initialized");

            model.tranche_no = "3";
            model.fro_requested_date="08-Aug-2016";
        },
        offline: false,
        getOfflineDisplayItem: function(item, index){
            
        },
        form: [{
            "type": "box",
            "title": "Tranche #3 | Disbursement Details | Ravi S | Key Metals Pvt. Ltd.", // sample label code
            "colClass": "col-sm-6", // col-sm-6 is default, optional
            //"readonly": false, // default-false, optional, this & everything under items becomes readonly
            "items": [
                {
                    "key": "tranche_no",
                    "title": "Tranche Details"
                },
                {
                    "key": "FRO_remarks",
                    "title": "Remarks"
                },
                {
                    "key": "fro_requested_date",
                    "title": "Hub Manager Requested Date",
                    "type": "date"
                },
                {
                    "key": "fro_status",
                    "title": "Status",
                    "type": "radios",
                    "titleMap": {
                                "1": "Approve",
                                "2": "Reject"
                            }
                },
                {
                    "key": "fro_reject_reason",
                    "title": "FRO Approve Remarks",
                    "type": "select"
                },
                {
                    "key": "fro_reject_remarks",
                    "title": "FRO Rejection Remarks",
                    "type": "select"
                },
                {
                    "key": "latitude",
                    "title": "Location",
                    "type": "geotag",
                    "latitude": "latitude",
                    "longitude": "longitude"
                },
                {
                    key:"FROVerificationPhoto",
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