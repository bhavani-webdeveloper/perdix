irf.pageCollection.factory(irf.page("loans.individual.documentTracking.PendingDispatch"), 
    ["$log", "$state", "SessionStore", "formHelper", "$q", "irfProgressMessage",
    "PageHelper", "Utils","PagesDefinition", "DocumentTracking",


    function($log, $state, SessionStore, formHelper, $q, irfProgressMessage,
        PageHelper, Utils,PagesDefinition, DocumentTracking) {

        var branch = SessionStore.getBranch();

        var LOAN_ACCOUNTS_HTML =
'<div>'+
    '<table style="width:100%" ng-show="model.accountDocumentTracker.length">'+
        '<tr>'+
            '<th>ACCOUNT NUMBER</th>'+
            '<th>APPLICANT NAME</th>'+
            '<th>ENTITY NAME</th>'+
            '<th>DISBURSEMENT DATE</th>'+
        '</tr>'+
        '<tr class="bg-tint-theme" ng-repeat-start="lsi in model.accountDocumentTracker">'+
            '<td>{{lsi.accountNumber}}</td>'+
            '<td>{{lsi.applicantName}}</td>'+
            '<td>{{lsi.customerName}}</td>'+
            '<td>{{lsi.scheduledDisbursementDate}}</td>'+
        '</tr>'+
        '<tr ng-repeat-end>'+
            '<td colspan="5"><hr style="margin-bottom:0;border-top-color:#999"></td>'+
        '</tr>'+
    '</table>'+
'</div>';


        return {
            "type": "schema-form",
            "title": "DISPATCH_PENDING_DOCUMENTS",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                $log.info("Dispatch pending documents is initiated ");

                /*if (!model._Accounts) {
                    $log.info("Screen directly launched hence redirecting to queue screen");
                    $state.go('Page.Engine', {
                        pageName: 'loans.individual.disbursement.MultiDocVerificationQueue',
                        pageId: null
                    });
                    return;
                }*/
                if (model._Accounts) {
                    model.accountDocumentTracker = model.accountDocumentTracker || [];
                    model.accountDocumentTracker = _.cloneDeep(model._Accounts);
                    if(model.accountDocumentTracker && model.accountDocumentTracker.length >0){
                        model._Accounts.CourierSentDate = model.accountDocumentTracker[0].courierDate;
                        model._Accounts.CourierCompanyName = model.accountDocumentTracker[0].courierName;
                        model._Accounts.PodNumber = model.accountDocumentTracker[0].courierNumber;
                        model._Accounts.BatchNumber = model.accountDocumentTracker[0].batchNumber;
                        model._Accounts.Remarks = model.accountDocumentTracker[0].remarks;
                    }
                }
            },

            modelPromise: function(pageId, _model) {

            }, 

            offline: true,
            getOfflineDisplayItem: function(item, index) {
                return []
            },

            form: [{
                    "type": "box",
                    "colClass": "col-sm-12",
                    title:"LOAN_ACCOUNTS",
                    condition:"model.accountDocumentTracker.length>0",
                    readonly:true,
                    "items": [
                        {
                            type: "section",
                            html: LOAN_ACCOUNTS_HTML
                        }
                    ]
                },
                {
                    "type": "box",
                    "title": "DISPATCH_DETAILS",
                    "items": [{
                        key: "_Accounts.CourierSentDate",
                        title: "COURIER_SENT_DATE",
                        type: "date"
                    }, {
                        key: "_Accounts.CourierCompanyName",
                        title: "CourierCompanyName"
                    }, {
                        key: "_Accounts.PodNumber",
                        title: "POD_NUMBER"
                    }, {
                        key: "_Accounts.BatchNumber",
                        title: "BATCHNUMBER",
                        readonly: true
                    }, {
                        key: "_Accounts.Remarks",
                        title: "REMARKS"
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
                return DocumentTracking.getSchema().$promise;
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
                    for(i=0;i<model.accountDocumentTracker.length;i++){
                        model.accountDocumentTracker[i].courierDate = model._Accounts.CourierSentDate;
                        model.accountDocumentTracker[i].courierName = model._Accounts.CourierCompanyName;
                        model.accountDocumentTracker[i].courierNumber = model._Accounts.PodNumber;
                        model.accountDocumentTracker[i].remarks = model._Accounts.Remarks;
                    }
                    var reqData = {accountDocumentTracker: model.accountDocumentTracker};
                    reqData.accountDocumentTrackingAction = "PROCEED";
                    $log.info(reqData);
                    PageHelper.showLoader();
                    PageHelper.showProgress("proceed-batch", "Working...");
                    DocumentTracking.update(reqData)
                        .$promise
                        .then(function(res){
                            PageHelper.showProgress("update-batch", "Done.", 3000);
                            irfProgressMessage.pop('pending-dispatch-save', 'Dispatch details captured successfully', 3000);
                            $state.go("Page.Engine", {pageName: "loans.individual.documentTracking.PendingDispatchQueue",pageId: null});
                        }, function(httpRes){
                            PageHelper.showProgress("create-batch", "Oops. Some error occured.", 3000);
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                }
            }
        };

    }
]);