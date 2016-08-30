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
                "type": "box",
                "colClass": "col-sm-12",
                "title": "DOCUMENT_EXECUTION",
                "htmlClass": "text-danger",
                "items": [
                    {
                        "type": "array",
                        "notitle": true,
                        "view": "fixed",
                        "key": "loanAccount.loanDocuments",
                        "add": null,
                        "remove": null,
                        "items": [
                            {
                                "type": "section",
                                "htmlClass": "row",
                                "required": [
                                    "status"
                                ],
                                "items": [
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-2",
                                        "items": [
                                            {
                                                "key": "loanAccount.loanDocuments[].$title",
                                                "notitle": true,
                                                "title": " ",
                                                "readonly": true
                                            }
                                        ]
                                    },
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-2",
                                        "key": "loanDocs[].downloadRequired",
                                        //"condition": "model.loanDocs[arrayIndex].downloadRequired==true",
                                        "items": [
                                            {
                                                "title": "DOWNLOAD",
                                                "htmlClass": "btn-block",
                                                "icon": "fa fa-download",
                                                "type": "button",
                                                "readonly": false,
                                                "onClick": function(model, form, schemaForm, event){
                                                    console.log(model);
                                                    console.log(form);
                                                    console.log(event);
                                                    //window.location =
                                                }
                                            }
                                        ]
                                    },
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [
                                            {
                                                "key": "loanAccount.loanDocuments[].documentStatus",
                                                "title": "Status",
                                                "type": "select",
                                                "titleMap": [
                                                    {
                                                        value: "REJECTED",
                                                        name: "Rejected"
                                                    },
                                                    {
                                                        value: "APPROVED",
                                                        name: "Approved"
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "type": "section",
                                        "htmlClass": "col-sm-3",
                                        "items": [
                                            {
                                                title: "Remarks",
                                                key: "loanAccount.loanDocuments[].remarks"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "type": "actionbox",
                "items": [
                    {
                        "type": "submit",
                        "title": "Submit"
                    }
                ]
            }
            ],
        schema: function() {
            return Enrollment.getSchema().$promise;
        },
        actions: {
            submit: function(model, form, formName){
                var reqData = {
                    'loanAccount': _.cloneDeep(model.loanAccount),
                    'loanProcessAction': 'PROCEED'
                };
                var docStatuses = [];
                var allowedStatues = ['APPROVED', 'REJECTED'];
                var redirectToUploadFlag = false;
                for (var i=0; i<reqData.loanAccount.loanDocuments.length; i++){
                    var doc = reqData.loanAccount.loanDocuments[i];
                    if (_.indexOf(allowedStatues, doc.documentStatus) == -1){
                        PageHelper.showProgress('update-loan', 'Invalid document status selected. Only Approved or Rejected are allowed.');
                        return;
                    }

                    if (doc.documentStatus == 'REJECTED'){
                        redirectToUploadFlag = true;
                    }
                }

                if (redirectToUploadFlag == true){
                    reqData['stage'] = 'DocumentUpload';
                }

                PageHelper.showProgress('update-loan', 'Working...');
                PageHelper.showLoader();
                console.log(JSON.stringify(reqData));
                return IndividualLoan.update(reqData)
                    .$promise
                    .then(
                        function(res){
                            PageHelper.showProgress('update-loan', 'Done.', 2000);
                            $state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingVerificationQueue'});
                            return;
                        }, function(httpRes){
                            PageHelper.showProgress('update-loan', 'Unable to proceed.', 2000);
                            PageHelper.showErrors(httpRes);
                        }
                    )
                    .finally(function(){
                        PageHelper.hideLoader();
                    })
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
