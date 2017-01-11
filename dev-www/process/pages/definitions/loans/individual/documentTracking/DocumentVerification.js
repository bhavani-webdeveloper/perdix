irf.pageCollection.factory(irf.page("loans.individual.documentTracking.DocumentVerification"),
 ["$log", "$state", "document", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils", "PagesDefinition", "Queries",


   function($log, $state, document, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, PagesDefinition, Queries) {

    var branch = SessionStore.getBranch(); 

    return {
        "type": "schema-form",
        "title": "DOCUMENT_VERIFICATION",
        "subTitle": "",
        initialize: function(model, form, formCtrl) {
            model.doc = model.doc || {};
            $log.info("Dispatch Incomplete documents is initiated ");
        },

        modelPromise: function(pageId, _model) {

        },

        offline: true,
        getOfflineDisplayItem: function(item, index) {
            return []
        },

         form: [
         {
                "type": "box",
                "title": "Document_DETAILS",
                "items": [{
                    key: "doc.CustomerName",
                    title: "CUSTOMER_NAME"
                }, {
                    key: "doc.BusinessName",
                    title: "BUSINESS_NAME"
                }, {
                    key: "doc.LoanId",
                    title: "LOAN_ID"
                }, {
                    key: "doc.DocumentName",
                    title: "DOCUMENT_NAME"
                }, {
                    key: "doc.hubName",
                    title: "HUB_NAME"
                },
                {
                    key: "doc.spokeName",
                    title: "SPOKE_NAME"
                },
                {
                    key: "doc.Disbursementdate",
                    title: "DISBURSEMENT_DATE",
                    type:"date"
                },
                ]


            },
            {
                "type": "box",
                "title": "DISPATCH_DETAILS",
                "items": [{
                    key: "doc.Dispatch[].CourierSentDate",
                    title: "COURIER_SENT_DATE"
                }, {
                    key: "doc.Dispatch[].CourierCompanyName",
                    title: "COURIER_COMPANY_NAME"
                }, {
                    key: "doc.Dispatch[].PodNumber",
                    title: "POD_NUMBER"
                }, {
                    key: "doc.Dispatch[].BatchNumber",
                    title: "BATCHNUMBER",
                    readonly: true
                }, 
                {
                    key: "doc.ReceivedDate",
                    title: "RECEIVED_DATE",
                    type:"date"
                },
                {
                    key: "doc.VerificationDate",
                    title: "VERIFIED_DATE",
                    type:"date"
                },
                {
                    key: "doc.Dispatch[].Remarks",
                    title: "REMARKS",
                }
                ]
            },


            {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "Accept"
                },
                {
                    "type": "submit",
                    "title": "Reject"
                }]
            },
        ],

        /*schema: function() {
            return document.getSchema().$promise;
        },*/

         schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "address": {
                        "type": "object",
                        "title":"Address",
                        "properties": {
                            "streetAddress": {
                                "type": "string",
                                "title":"Street Address"
                            },
                            "city": {
                                "type": "string",
                                "title":"City"
                            }
                        },
                        "required": [
                            "streetAddress",
                            "city"
                        ]
                    },
                    "phoneNumber": {
                        "type": "array",
                        "title":"Phone Numbers",
                        "items": {
                            "type": "object",
                            "title":"Phone#",
                            "properties": {
                                "location": {
                                    "type": "string",
                                    "title":"Location"
                                },
                                "code": {
                                    "type": "integer",
                                    "title":"Code"
                                },
                                "number":{
                                    "type":"integer",
                                    "title":"Number"
                                },
                                "boo": {
                                    "type": "boolean",
                                    "title": "Check Done?"
                                }
                            },
                            "required": [
                                "code",
                                "number"
                            ]
                        }
                    }
                },
                "required": [
                    "address",
                    "phoneNumber"
                ]
            },

        actions: {
            preSave: function(model, form, formName) {
                $log.info("Inside save()");
                var deferred = $q.defer();
                if (model.doc) {
                    deferred.resolve();
                } else {
                    irfProgressMessage.pop('LeadGeneration-save', 'Applicant Name is required', 3000);
                    deferred.reject();
                }
                return deferred.promise;
            },

            submit: function(model, form, formName) {
                $log.info("Inside submit()");
                irfProgressMessage.pop('LeadGeneration-save', 'Lead is successfully created', 3000);
                $log.warn(model);
            }
        }
    };

}]);