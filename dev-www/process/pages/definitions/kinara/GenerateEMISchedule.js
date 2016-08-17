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

            model.customer_sign_date="05-Aug-2016";
            model.expected_disbursement_date="08-Aug-2016";
            model.fro_remarks="New Machinery arrived and verified";
            model.cro_remarks="verified and approved";

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
                    "key": "customer_sign_date",
                    "title": "Customer Sign Date",
                    "type": "date"
                },
                {
                    "key": "expected_disbursement_date",
                    "title": "Expected Disbursement Date",
                    "type": "date"
                },
                {
                    "key": "fro_remarks",
                    "title": "FRO Approve Remarks"
                },
                {
                    "key": "cro_remarks",
                    "title": "CRO Approve Remarks"
                },
                {
                    "title":"EMI Schedule",
                    "htmlClass":"btn-block",
                    "icon":"fa fa-download",
                    "type":"button",
                    "readonly":false

                },
                {
                    title:"Upload",
                    key:"fileid",
                    type:"file",
                    fileType:"*/*",
                    category: "Loan",
                    subCategory: "DOC1"
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