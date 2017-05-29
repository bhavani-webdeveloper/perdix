define({
pageUID: "loans.individual.LoanDocument",
pageType: "Engine",
dependencies: ["$log", "BundleManager", "IndividualLoan", "SessionStore", "$state", "$stateParams", "SchemaResource", "PageHelper", "Enrollment", "Utils","Queries"],
$pageFn: function ($log, BundleManager,  IndividualLoan, SessionStore, $state, $stateParams, SchemaResource, PageHelper, Enrollment, Utils,Queries) {


return {
    "type": "schema-form",
    "title": "LOAN_DOCUMENT",
    "subTitle": "",
    initialize: function (model, form, formCtrl) {
        $log.info("Individual Get uploaded Loan document process initialized.. ");
        PageHelper.showProgress('load-loan', 'Getting uploaded loan document...');
        PageHelper.showLoader();
        IndividualLoan.get({id: $stateParams.pageId})
            .$promise
            .then(
                function (res) {
                    $log.info(res);
                    console.log(res);
                    
                    if(_.isArray(res.loanDocuments)&&res.loanDocuments !=undefined){
                        model.loanAccount = res;
                    }
                    PageHelper.hideLoader();
                    
                }, function (httpRes) {
                    PageHelper.showProgress('load-loan', 'Some error while getting uploaded loan document', 2000);
                    PageHelper.hideLoader();
                }
            )
    },
    offline: false,
    getOfflineDisplayItem: function (item, index) {
    },
    form: [{
        "type": "box",
        "title": "LOAN_DOCUMENT", // sample label code
        "colClass": "col-sm-6", // col-sm-6 is default, optional
        //"readonly": false, // default-false, optional, this & everything under items becomes readonly
        "items": [
        {
            "type": "array",
            "key": "loanAccount.loanDocuments",
            "view": "fixed",
            "startEmpty": true,
            "title": "LOAN_DOCUMENT",
            "titleExpr": "model.loanAccount.loanDocuments[arrayIndex].document",
            "items": [
                {
                    "key": "loanAccount.loanDocuments[].document",
                    "title": "DOCUMENT_NAME",
                    "type": "string"
                },
                {
                    title: "Upload",
                    key: "loanAccount.loanDocuments[].documentId",
                    "required": true,
                    type: "file",
                    fileType: "application/pdf",
                    category: "Loan",
                    subCategory: "DOC1",
                    using: "scanner"
                }
            ]
        }
    ]
    },
    {
        "type": "actionbox",
        "condition": "model.loanAccount.customerId && model.currentStage !== 'loanView'",
        "items": [
            {
                "type": "button",
                "icon": "fa fa-circle-o",
                "title": "SAVE",
                "onClick": "actions.save(model, formCtrl, form, $event)"
            }
        ]
    }],
    schema: function () {
        return SchemaResource.getLoanAccountSchema().$promise;
    },
    actions: {
        save: function(model, formCtrl, form, $event){
        $log.info("Inside save()");
        PageHelper.clearErrors();

        Utils.confirm("Are You Sure?")
            .then(
                function(){

                    var reqData = {loanAccount: _.cloneDeep(model.loanAccount)};
                    reqData.loanAccount.status = '';
                    reqData.loanProcessAction = "SAVE";
                    //reqData.loanAccount.portfolioInsurancePremiumCalculated = 'Yes';
                    // reqData.remarks = model.review.remarks;
                    reqData.loanAccount.screeningDate = reqData.loanAccount.screeningDate || Utils.getCurrentDate();
                    reqData.loanAccount.psychometricCompleted = reqData.loanAccount.psychometricCompleted || "N";
                    
                    
                    
                    PageHelper.showLoader();

                    var completeLead = false;
                    if (!_.hasIn(reqData.loanAccount, "id")){
                        completeLead = true;
                    }
                    IndividualLoan.create(reqData)
                        .$promise
                        .then(function(res){
                            model.loanAccount = res.loanAccount;
                            BundleManager.pushEvent('new-loan', model._bundlePageObj, {loanAccount: model.loanAccount});
                            if (completeLead===true && _.hasIn(model, "lead.id")){
                                var reqData = {
                                    lead: _.cloneDeep(model.lead),
                                    stage: "Completed"
                                }

                                reqData.lead.leadStatus = "Complete";
                                LeadHelper.proceedData(reqData)
                            }
                        }, function(httpRes){
                            PageHelper.showErrors(httpRes);
                        })
                        .finally(function(httpRes){
                            PageHelper.hideLoader();
                            // Updating offline record on success submission
                            BundleManager.updateOffline();
                        })
                }
            );
    }
    }
};
}

})