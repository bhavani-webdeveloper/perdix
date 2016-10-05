irf.pageCollection.factory(irf.page("loans.individual.documentTracking.IncompleteDispatch"), ["$log", "$state", "document", "SessionStore", "formHelper", "$q", "irfProgressMessage",
"PageHelper", "Utils", "PagesDefinition", "Queries",


function($log,$state,document, SessionStore, formHelper, $q, irfProgressMessage,
    PageHelper, Utils, PagesDefinition, Queries) {

    var branch = SessionStore.getBranch();

    return {
        "type": "schema-form",
        "title": "DISPATCH_INCOMPLETE_DOCUMENTS",
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

         form: [{
                "type": "box",
                "title": "DISPATCH_DETAILS",
                "items": [{
                    key: "doc.Dispatch[].CourierSentDate",
                    title: "COURIER_SENT_DATE",
                    type:"date"
                }, {
                    key: "doc.Dispatch[].CourierCompanyName",
                    title: "CourierCompanyName",
                }, {
                    key: "doc.Dispatch[].PodNumber",
                    title: "POD_NUMBER",
                }, {
                    key: "doc.Dispatch[].BatchNumber",
                    title: "BATCHNUMBER",
                    readonly: true
                }, {
                    key: "doc.Dispatch[].Remarks",
                    title: "REMARKS",
                }]


            },


            {
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "title": "Submit"
                }]
            },
        ],

        schema: function() {
            return document.getSchema().$promise;
        },

        actions: {
            preSave: function(model, form, formName) {
                $log.info("Inside save()");
                var deferred = $q.defer();
                if (model.doc) {
                    deferred.resolve();
                } else {
                    irfProgressMessage.pop('Dispatch-save', ' PodNumber is required', 3000);
                    deferred.reject();
                }
                return deferred.promise;
            },

            submit: function(model, form, formName) {
                $log.info("Inside submit()");
                irfProgressMessage.pop('Dispatch-save', 'Dispatch is successfully created', 3000);
                $log.warn(model);
            }
        }
    };

}]);