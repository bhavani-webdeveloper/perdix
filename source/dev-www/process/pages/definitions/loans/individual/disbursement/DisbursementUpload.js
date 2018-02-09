irf.pageCollection.factory(irf.page("loans.individual.collections.disbursement.DisbursementUpload"), ["$state", "$stateParams", "$log", "formHelper", "SessionStore", "$q", "IndividualLoan","entityManager","SchemaResource",
    function( $state, $stateParams,$log, formHelper,SessionStore, $q, IndividualLoan,entityManager,SchemaResource) {

        var branch = SessionStore.getBranch();
        return {
            "type": "schema-form",
            "title": "UPLOAD_DISBURSEMENT",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Disbursement confirmation leadBulkUpload  Page got initialized");
            },
            offline: false,
            getOfflineDisplayItem: function(item, index) {},
            form: [{
                "type": "box",
                "title": "UPLOAD_DISBURSEMENT",
                "colClass": "col-sm-6",
                "items": [{
                    "key": "lead.Bulkfile",
                    "notitle": true,
                    "title": "LEAD_UPLOAD",
                    "category": "ACH",
                    "subCategory": "cat2",
                    "type": "file",
                    "fileType": "application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    customHandle: function(file, progress, modelValue, form, model) {
                        IndividualLoan.disbursementUpload(file, progress);
                    }
                }]
            }],
            schema: function() {
            return SchemaResource.getDisbursementSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName) {

                },
                proceed: function(model, formCtrl, form, $event) {}
            }
        };
    }
]);