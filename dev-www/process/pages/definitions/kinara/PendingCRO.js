irf.pageCollection.factory("Pages__PendingCRO",
["$log", "Enrollment", "SessionStore","$state", "$stateParams", function($log, Enrollment, SessionStore,$state,$stateParams){

    var branch = SessionStore.getBranch();

    return {
        "id": "PendingCRO",
        "type": "schema-form",
        "name": "PendingCRO",
        "title": "CRO Approval",
        "subTitle": "",
        initialize: function (model, form, formCtrl) {
            $log.info("CRO Approval Page got initialized");

            model.tranche_no = "3";
            model.cro_requested_date="08-Aug-2016";
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
                    "key": "CRO_remarks",
                    "title": "Remarks"
                },
                {
                    "key": "cro_requested_date",
                    "title": "Hub Manager Requested Date",
                    "type": "date"
                },
                {
                    "key": "cro_status",
                    "title": "Status",
                    "type": "radios",
                    "titleMap": {
                                "1": "Approve",
                                "2": "Reject"
                            }
                },
                {
                    "key": "cro_reject_reason",
                    "title": "CRO Approve Remarks",
                    "type": "select"
                },
                {
                    "key": "cro_reject_remarks",
                    "title": "CRO Rejection Remarks",
                    "type": "select"
                },
                {
                    "key": "latitude",
                    "title": "Location",
                    "type": "geotag",
                    "latitude": "fro.latitude",
                    "longitude": "fro.longitude"
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