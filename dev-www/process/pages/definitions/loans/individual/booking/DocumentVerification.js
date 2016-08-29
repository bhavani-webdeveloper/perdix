irf.pageCollection.factory(irf.page("loans.individual.booking.DocumentVerification"),
["$log", "Enrollment", "SessionStore", "$state", "$stateParams", "PageHelper", "IndividualLoan", "LoanBookingCommons",
    function($log, Enrollment, SessionStore, $state, $stateParams, PageHelper, IndividualLoan, LoanBookingCommons){

    return {
        "type": "schema-form",
        "title": "DOCUMENT_VERIFICATION",
        "subTitle": " ",
        initialize: function (model, form, formCtrl) {
            $log.info("Demo Customer Page got initialized");

            var loanId = $stateParams['pageId'];
            PageHelper.showProgress('loan-load', 'Loading loan details...');
            PageHelper.showLoader();
            IndividualLoan.get({id: $stateParams.pageId})
                .$promise
                .then(
                    function (res) {
                        PageHelper.showProgress('loan-load', 'Loading done.', 2000);
                        model.loanAccount = res;
                        var loanDocuments = model.loanAccount.loanDocuments;
                        var availableDocCodes = [];
                        var docsForProduct = LoanBookingCommons.getDocsForProduct(model.loanAccount.productCode);

                        for (var i=0; i<loanDocuments.length; i++){
                            availableDocCodes.push(loanDocuments[i].document);
                            var documentObj = LoanBookingCommons.getDocumentDetails(docsForProduct, loanDocuments[i].document);
                            if (documentObj!=null){
                                loanDocuments[i].$title = documentObj.docTitle;
                            } else {
                                loanDocuments[i].$title = "DOCUMENT TITLE NOT MAINTAINED";
                            }

                        }

                        for (var i = 0; i < docsForProduct.length; i++) {
                            if (_.indexOf(availableDocCodes, docsForProduct[i].docCode)==-1){
                                loanDocuments.push({
                                    document: docsForProduct[i].docCode,
                                    $downloadRequired: docsForProduct[i].downloadRequired,
                                    $title: docsForProduct[i].docTitle
                                })
                            }
                        }

                        PageHelper.hideLoader();
                    }, function (httpRes) {
                        PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                        PageHelper.showErrors(httpRes);
                    }
                )

            /*
            // Test rejection remarks
            model.loanDocs[4].status = "Rejected";
            model.loanDocs[4].rejectReason = "Overwriting on Cheque";
            */
        },

        form: [

                {
                    "type":"box",
                    "colClass": "col-sm-12",
                    "htmlClass": "text-danger",
                    "items":[
                        {
                            "type":"array",
                            "notitle": true,
                            "view": "fixed",
                            "key":"loanDocs",
                            "add":null,
                            "remove":null,
                            "items":[
                                {
                                    "type": "section",
                                    "htmlClass": "row",
                                    "items": [{
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "key": "loanDocs[].title",
                                            "notitle":true,
                                            "title": " ",
                                            "readonly": true
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-2",
                                        "items": [{
                                            "title":"REJECTION_REASON",
                                            "notitle": true,
                                            "type": "select",
                                            "key": "loanDocs[].rejectReason"
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "title":"REMARKS",
                                            "key": "loanDocs[].rejectReason"
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [{
                                            "title":"ACTION",
                                            "notitle": true,
                                            "htmlClass":"btn-block",
                                            "type":"radios",
                                            "readonly":false,
                                            "enumCode": "action_approval",
                                            /*
                                            "titleMap": {
                                                    "1": "Approve",
                                                    "2": "Reject"
                                                },
                                            */
                                            "key": "loanDocs[].docStatus"
                                        }]
                                    },{
                                        "type": "section",
                                        "htmlClass": "col-sm-1",
                                        "items": [{
                                            "title":"View",
                                            "htmlClass":"btn-block",
                                            "icon":"fa fa-download",
                                            "type":"button",
                                            "readonly":false
                                        }]
                                    }]
                                }
                            ]
                        }
                    ]
                },
                {
            "type": "actionbox",
            "items": [{
                    "type": "submit",
                    "title": "Submit"
                }]
            }
            ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                $log.info("Redirecting");
                $state.go('Page.Engine', {pageName: 'PendingDocumentVerification', pageId: ''});
            },
            approve:function(model,form){
                alert("Approved");
            },
            reject:function(model,form){
                alert("Rejected");
            }
        }
    };
}]);
