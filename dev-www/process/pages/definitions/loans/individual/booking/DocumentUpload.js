irf.pageCollection.factory(irf.page("loans.individual.booking.DocumentUpload"),
    ["$log", "Enrollment", "SessionStore", "$state", '$stateParams', 'PageHelper', 'IndividualLoan', 'Queries', 'Utils',
        function ($log, Enrollment, SessionStore, $state, $stateParams, PageHelper, IndividualLoan, Queries, Utils) {


        var getDocument = function(docsArr, docCode){
            var i = 0;
            for (i=0;i <docsArr.length; i++){
                if (docsArr[i].docCode == docCode){
                    return docsArr[i];
                }
            }
            return null;
        }

        return {
            "type": "schema-form",
            "title": "LOAN_DOCUMENT_UPLOAD_QUEUE",
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

                            Queries.getLoanProductDocuments(model.loanAccount.productCode)
                                .then(
                                    function(docs){
                                        var docsForProduct = [];
                                        for (var i=0; i< docs.length;i++){
                                            var doc = docs[i];
                                            docsForProduct.push(
                                                {
                                                    docTitle: doc.document_name,
                                                    docCode: doc.document_code,
                                                    formsKey: doc.forms_key,
                                                    downloadRequired: doc.download_required
                                                }
                                            )
                                        }

                                        var loanDocuments = model.loanAccount.loanDocuments;
                                        var availableDocCodes = [];

                                        for (var i=0; i<loanDocuments.length; i++){
                                            availableDocCodes.push(loanDocuments[i].document);
                                            var documentObj = getDocument(docsForProduct, loanDocuments[i].document);
                                            if (documentObj!=null){
                                                loanDocuments[i].$title = documentObj.docTitle;
                                                loanDocuments[i].$key = documentObj.formsKey;
                                            } else {
                                                loanDocuments[i].$title = "DOCUMENT TITLE NOT MAINTAINED";
                                            }

                                        }

                                        for (var i = 0; i < docsForProduct.length; i++) {
                                            if (_.indexOf(availableDocCodes, docsForProduct[i].docCode)==-1){
                                                loanDocuments.push({
                                                    document: docsForProduct[i].docCode,
                                                    $downloadRequired: docsForProduct[i].downloadRequired,
                                                    $title: docsForProduct[i].docTitle,
                                                    $formsKey: docsForProduct[i].formsKey,
                                                    disbursementId:model.loanAccount.disbursementSchedules[0].id
                                                })
                                            }
                                        }
                                    }, function(httpRes){

                                    }
                                )
                                .finally(function(httpRes){

                                })
                            PageHelper.hideLoader();
                        }, function (httpRes) {
                            PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                            PageHelper.showErrors(httpRes);
                            PageHelper.hideLoader();
                        }
                    )


                /*
                 // Test reject remarks
                 model.loanDocs[4].status = "Rejected";
                 model.loanDocs[4].rejectReason = "Overwriting on Cheque";
                 */
            },

            form: [

                {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "title": "LOAN_DOCUMENT_UPLOAD_QUEUE",
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
                                            "htmlClass": "col-sm-4",
                                            "items": [
                                                {
                                                    "title": "STATUS",
                                                    "titleExpr": "model.loanDocs[arrayIndex].status",
                                                    "key": "loanDocs[].rejectReason",
                                                    "readonly": true
                                                }
                                            ]
                                        },
                                        {
                                            "type": "section",
                                            "htmlClass": "col-sm-3",
                                            "key": "loanDocs[].downloadRequired",
                                            //"condition": "model.loanDocs[arrayIndex].downloadRequired==true",
                                            "items": [
                                                {
                                                    "title": "DOWNLOAD_FORM",
                                                    "htmlClass": "btn-block",
                                                    "icon": "fa fa-download",
                                                    "type": "button",
                                                    "readonly": false,
                                                    "key": "loanAccount.loanDocuments[].$downloadRequired",
                                                    "onClick": function(model, form, schemaForm, event){
                                                        var doc = model.loanAccount.loanDocuments[event.arrayIndex];
                                                        console.log(doc);
                                                        Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name="  + doc.$formsKey +  "&record_id=" + model.loanAccount.id)
                                                    }
                                                }
                                            ]
                                        },
                                        {
                                            "type": "section",
                                            "htmlClass": "col-sm-3",
                                            "items": [
                                                {
                                                    title: "Upload",
                                                    key: "loanAccount.loanDocuments[].documentId",
                                                    type: "file",
                                                    fileType: "*/*",
                                                    category: "Loan",
                                                    subCategory: "DOC1",
                                                    "notitle": true
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
                    "items": [{
                        "type": "submit",
                        "title": "Submit"
                    }]
                }
            ],
            schema: function () {
                return Enrollment.getSchema().$promise;
            },
            actions: {
                submit: function (model, form, formName) {
                    $log.info("Redirecting");
                    var reqData = {
                        'loanAccount': _.cloneDeep(model.loanAccount),
                        'loanProcessAction': 'PROCEED'
                    };
                    PageHelper.showProgress('update-loan', 'Working...');
                    PageHelper.showLoader();
                    return IndividualLoan.update(reqData)
                        .$promise
                        .then(
                            function(res){
                                PageHelper.showProgress('update-loan', 'Done.', 2000);
                                $state.go('Page.Engine', {pageName: 'loans.individual.booking.DocumentUploadQueue'});
                                return;
                            }, function(httpRes){
                                PageHelper.showProgress('update-loan', 'Unable to proceed.', 2000);
                                PageHelper.showErrors(httpRes);
                            }
                        )
                        .finally(function(){
                            PageHelper.hideLoader();
                        })
                    //
                    //$state.go('Page.Engine', {pageName: 'loans.individual.booking.PendingQueue', pageId: ''});
                },
                approve: function (model, form) {
                    alert("Approved");
                },
                reject: function (model, form) {
                    alert("Rejected");
                },
                downloadForm: function(model, form){
                    console.log("asdf");
                }
            }
        };
    }]);
