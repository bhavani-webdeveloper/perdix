irf.pageCollection.factory(irf.page("loans.individual.disbursement.GenerateEMISchedule"),
    ["$log", "SchemaResource", "SessionStore", "$state", '$stateParams', 'PageHelper', 'IndividualLoan', 'Queries', 'Utils',
        function ($log, SchemaResource, SessionStore, $state, $stateParams, PageHelper, IndividualLoan, Queries, Utils) {


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
            "title": "UPLOAD_DOCUMENT",
            "subTitle": " ",
            initialize: function (model, form, formCtrl) {
                $log.info("Multi Tranche Upload Document Page got initialized");

                if (!model._EMIScheduleGenQueue)
                {
                    $log.info("Screen directly launched hence redirecting to queue screen");
                    $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.EMIScheduleGenQueue', pageId: null});
                    return;
                }
                model.loanAccountDisbursementSchedule = {};
                model.loanAccountDisbursementSchedule = _.cloneDeep(model._EMIScheduleGenQueue);

                PageHelper.showProgress('loan-load', 'Loading details...');
                PageHelper.showLoader();
                IndividualLoan.get({id: model.loanAccountDisbursementSchedule.loanId})
                    .$promise
                    .then(
                        function (res) {
                            PageHelper.showProgress('loan-load', 'Loading done.', 2000);
                            model.loanAccount = res;
                            $log.info("Loan account fetched");
                            $log.info(res);

                            Queries.getLoanProductDocuments(model.loanAccount.productCode,"MultiTranche","DocumentUpload")
                                .then(
                                    function(docs){
                                        $log.info("document fetched");
                                        $log.info(docs);
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

                                        model.individualLoanDocuments = model.individualLoanDocuments || [];
                                        $log.info("printing");
                                        $log.info(model.individualLoanDocuments);

                                        var loanDocuments = model.individualLoanDocuments;
                                        var availableDocCodes = [];
                                        $log.info("Number of documents: " + loanDocuments.length);
                                        $log.info("docsForProduct length: " + docsForProduct.length);
                                        $log.info("availableDocCodes length: " + availableDocCodes.length);

                                        for (var i=0; i<loanDocuments.length; i++){
                                            availableDocCodes.push(loanDocuments[i].document_code);
                                            $log.info(loanDocuments[i]);
                                            var documentObj = getDocument(docsForProduct, loanDocuments[i].document_code);
                                            if (_.isObject(documentObj)){
                                                $log.info("going to set value");
                                                loanDocuments[i].$title = documentObj.docTitle;
                                                loanDocuments[i].$key = documentObj.formsKey;
                                            } else {
                                                $log.info("in else");
                                                $log.info(loanDocuments);
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
                                                    disbursementId:model.loanAccountDisbursementSchedule.id,
                                                    loanId:model.loanAccountDisbursementSchedule.loanId,
                                                    documentStatus:"PENDING"
                                                })
                                            }
                                        }
                                        $log.info("Number of documents finally: " + loanDocuments.length);
                                    }, function(httpRes){
                                        PageHelper.showProgress('loan-load', 'Failed to load the loan details. Try again.', 4000);
                                        PageHelper.showErrors(httpRes);
                                        PageHelper.hideLoader();
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
            },

            form: [

                {
                    "type": "box",
                    "colClass": "col-sm-12",
                    "titleExpr":"('TRANCHE'|translate)+' ' + model._MTQueue.trancheNumber + ' | '+('DISBURSEMENT_DETAILS'|translate)+' | '+ model.customerName",
                    "htmlClass": "text-danger",
                    "items": [
                        {
                            "key": "loanAccountDisbursementSchedule.scheduledDisbursementDate",
                            "title": "DISBURSEMENT_DATE",
                            "type": "date"
                        },
                        {
                            "key": "loanAccountDisbursementSchedule.customerSignatureDate",
                            "title": "CUSTOMER_SIGNATURE_DATE",
                            "type": "date"
                        },
                        {
                            "key": "loanAccountDisbursementSchedule.remarks1",
                            "title": "FRO_REMARKS",
                            "readonly":true
                        },
                        {
                            "key": "loanAccountDisbursementSchedule.remarks2",
                            "title": "CRO_REMARKS",
                            "readonly":true
                        },
                        {
                            "type": "array",
                            "notitle": true,
                            "view": "fixed",
                            "key": "individualLoanDocuments",
                            "startEmpty":true,
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
                                                    "key": "individualLoanDocuments[].$title",
                                                    "notitle": true,
                                                    "title": " ",
                                                    "readonly": true
                                                }
                                            ]
                                        },
                                        {
                                            "type": "section",
                                            "htmlClass": "col-sm-3",
                                            "key": "individualLoanDocuments[].downloadRequired",
                                            "items": [
                                                {
                                                    "title": "DOWNLOAD_FORM",
                                                    "htmlClass": "btn-block",
                                                    "icon": "fa fa-download",
                                                    "type": "button",
                                                    "readonly": false,
                                                    "key": "individualLoanDocuments[].$downloadRequired",
                                                    "onClick": function(model, form, schemaForm, event){
                                                        var doc = model.individualLoanDocuments[event.arrayIndex];
                                                        console.log(doc);
                                                        Utils.downloadFile(irf.FORM_DOWNLOAD_URL + "?form_name="  + doc.$formsKey +  "&record_id=" + model.loanAccountDisbursementSchedule.loanId)
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
                                                    key: "individualLoanDocuments[].documentId",
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
                return SchemaResource.getDisbursementSchema().$promise;
            },
            actions: {
                submit: function(model, form, formName){
                    if(window.confirm("Are you sure?")){
                        PageHelper.showLoader();
                        var reqData = _.cloneDeep(model);
                        delete reqData.$promise;
                        delete reqData.$resolved;
                        delete reqData.loanAccount;
                        delete reqData._EMIScheduleGenQueue;
                        reqData.disbursementProcessAction = "PROCEED";
                        IndividualLoan.updateDisbursement(reqData,function(resp,header){
                            PageHelper.showProgress("upd-disb","Done.","5000");
                            PageHelper.hideLoader();
                            $state.go('Page.Engine', {pageName: 'loans.individual.disbursement.MultiTrancheQueue', pageId: null});
                        },function(resp){
                            PageHelper.showProgress("upd-disb","Oops. An error occurred","5000");
                            PageHelper.showErrors(resp);

                        }).$promise.finally(function(){
                            PageHelper.hideLoader();
                        });
                    }
                }
            }
        };
    }]);
