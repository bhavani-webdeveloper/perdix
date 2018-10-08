define(["perdix/domain/model/loan/LoanProcess",
    "perdix/domain/model/loan/LoanProcessFactory",
    'perdix/domain/model/customer/EnrolmentProcess',
    "perdix/domain/model/loan/LoanCustomerRelation",
    ], function(LoanProcess, LoanFactory, EnrolmentProcess, LoanCustomerRelation) {
    var LoanProcess = LoanProcess["LoanProcess"];
    var EnrolmentProcess = EnrolmentProcess["EnrolmentProcess"];
    var LoanCustomerRelationTypes = LoanCustomerRelation["LoanCustomerRelationTypes"];

    return {
        pageUID: "kgfs.loans.individual.booking.Checker1",
        pageType: "Bundle",
        dependencies: ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "LoanAccount", "Lead", "PageHelper", "irfStorageService", "$filter", "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch", "Queries", "Utils", "IndividualLoan", "BundleManager", "irfNavigator"],
        $pageFn: function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, LoanAccount, Lead, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch, Queries, Utils, IndividualLoan, BundleManager, irfNavigator) {
            return {
                "type": "page-bundle",
                "title": "CHECKER_1",
                "subTitle": "",
                "bundleDefinitionPromise": function() {
                    $log.info("inside thee bundle");
                    return $q.resolve([
                        {
                            pageName: 'kgfs.customer.IndividualEnrollment',
                            title: 'APPLICANT',
                            pageClass: 'applicant',
                            minimum: 1,
                            maximum: 1,
                            order:10
                        },
                        {
                            pageName: 'kgfs.customer.IndividualEnrollment',
                            title: 'CO_APPLICANT',
                            pageClass: 'co-applicant',
                            minimum: 0,
                            maximum: 5,
                            order:20
                        },
                        {
                            pageName: 'kgfs.customer.IndividualEnrollment',
                            title: 'GUARANTOR',
                            pageClass: 'guarantor',
                            minimum: 0,
                            maximum: 3,
                            order:30
                        },
                        {
                            pageName: 'kgfs.loans.individual.booking.LoanBooking',
                            title: 'LOAN_BOOKING',
                            pageClass: 'loan-booking',
                            minimum: 1,
                            maximum: 1,
                            order:50
                        },
                        {
                            pageName: 'kgfs.loans.individual.booking.Dsc',
                            title: 'DSC',
                            pageClass: 'dsc-check',
                            minimum: 1,
                            maximum: 1,
                            order:60
                        },
                        {
                            pageName: 'kgfs.customer.CBCheck',
                            title: 'CB_CHECK',
                            pageClass: 'cb-check',
                            minimum: 1,
                            maximum: 1,
                            order:70
                        },
                        {
                            pageName: 'kgfs.loans.individual.booking.DocumentUpload',
                            title: 'DOCUMENT_UPLOAD',
                            pageClass: 'document-upload',
                            minimum: 1,
                            maximum: 1,
                            order:80
                        }
                        
                        
                    ]);
                },
                "bundlePages": [],
                "offline": true,
                "getOfflineDisplayItem": function(value, index){
                    var out = new Array(2);
                    for (var i=0; i<value.bundlePages.length; i++){
                        var page = value.bundlePages[i];
                        if (page.pageClass == "applicant"){
                            out[0] = page.model.customer.firstName;
                        }
                    }
                    return out;
                },
                // "onAddNewTab": function(definition, bundleModel){ 
                //     var deferred = $q.defer();
                //     var model = null;
                //     var loanProcess = bundleModel.loanProcess;


                //     switch (definition.pageClass){
                //         case 'co-applicant':
                //             EnrolmentProcess.createNewProcess()
                //                 .subscribe(function(enrolmentProcess) {
                //                     loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, LoanCustomerRelationTypes.CO_APPLICANT);
                //                     deferred.resolve({
                //                         enrolmentProcess: enrolmentProcess,
                //                         loanProcess: loanProcess
                //                     })
                //                 });
                //             break;
                //         case 'guarantor':
                //             EnrolmentProcess.createNewProcess()
                //                 .subscribe(function(enrolmentProcess) {
                //                     loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, LoanCustomerRelationTypes.GUARANTOR);
                //                     deferred.resolve({
                //                         enrolmentProcess: enrolmentProcess,
                //                         loanProcess: loanProcess
                //                     })
                //                 });
                //             break;
                //     }
                //     deferred.resolve(model);
                //     return deferred.promise;
                // },
                "pre_pages_initialize": function(bundleModel){
                    $log.info("Inside pre_page_initialize");
                    bundleModel.currentStage = "LoanInitiation";
                    var deferred = $q.defer();

                    var $this = this;

                    if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)){
                        PageHelper.showLoader();
                        bundleModel.loanId = $stateParams.pageId;
                        LoanProcess.get(bundleModel.loanId)
                            .subscribe(function(loanProcess){
                                bundleModel.loanProcess = loanProcess;
                                var loanAccount = loanProcess;
                                loanAccount.applicantEnrolmentProcess= [];
                                loanAccount.applicantEnrolmentProcess.customer = [];

                                loanAccount.applicantEnrolmentProcess.customer = loanAccount.loanAccount;
                                    if (_.hasIn($stateParams.pageData, 'lead_id') &&  _.isNumber($stateParams.pageData['lead_id'])){
                                        var _leadId = $stateParams.pageData['lead_id'];
                                        loanProcess.loanAccount.leadId = _leadId;

                                    }
                                if (loanAccount.loanAccount.currentStage != 'LoanInitiation'){
                                    PageHelper.showProgress('load-loan', 'Loan Application is in different Stage', 2000);
                                    irfNavigator.goBack();
                                    return;
                                }

                                $this.bundlePages.push({
                                    pageClass: 'applicant',
                                    model: {
                                        enrolmentProcess: loanProcess.applicantEnrolmentProcess,
                                        loanProcess: loanProcess
                                    }
                                });

                                if(_.hasIn(loanAccount, 'coApplicantsEnrolmentProcesses')) {
                                    console.log("***********");
                                    console.log(loanAccount);
                                    for (var i=0;i<loanAccount.coApplicantsEnrolmentProcesses.length; i++){
                                        $this.bundlePages.push({
                                            pageClass: 'co-applicant',
                                            model: {
                                                loanRelation: loanAccount.coApplicantsEnrolmentProcesses[i]
                                            }
                                        });
                                    }
                                }
                                if(_.hasIn(loanAccount, 'guarantorsEnrolmentProcesses')) {
                                    for (var i=0;i<loanAccount.guarantorsEnrolmentProcesses.length; i++){
                                        $this.bundlePages.push({
                                            pageClass: 'guarantor',
                                            model: {
                                                loanRelation: loanAccount.guarantorsEnrolmentProcesses[i]
                                            }
                                        });
                                    }
                                }

                               $this.bundlePages.push({
                                    pageClass: 'loan-booking',
                                    model:{
                                        loanProcess: loanProcess
                                    }
                                });
                                $this.bundlePages.push({
                                    pageClass: 'document-upload',
                                    model:{
                                        loanProcess: loanProcess
                                    }
                                });
                                $this.bundlePages.push({
                                    pageClass: 'cb-check',
                                    model: {
                                        loanAccount: loanProcess.loanAccount
                                    }
                                });
                                $this.bundlePages.push({
                                    pageClass: 'dsc-check',
                                    model: {
                                        loanAccount: loanProcess
                                    }
                                });
                                
                                deferred.resolve();
                            });

                    } else { }
                    return deferred.promise;

                },
                "post_pages_initialize": function(bundleModel){
                    $log.info("Inside post_page_initialize");
                    BundleManager.broadcastEvent('origination-stage', 'KYC');
                    if (_.hasIn($stateParams.pageData, 'lead_id') &&  _.isNumber($stateParams.pageData['lead_id'])){
                        PageHelper.showLoader();
                        PageHelper.showProgress("KYC-input", 'Loading lead details');
                        var _leadId = $stateParams.pageData['lead_id'];
                        Lead.get({id: _leadId})
                            .$promise
                            .then(function(res){
                                PageHelper.showProgress('KYC-input', 'Done.', 5000);
                                BundleManager.broadcastEvent('lead-loaded', res);
                            }, function(httpRes){
                                PageHelper.showErrors(httpRes);
                            })
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                    }

                    Queries.getCibilHighmarkMandatorySettings()
                        .then(function(settings){
                            BundleManager.broadcastEvent("cibil-highmark-mandatory-settings", settings);
                        })

                },
                eventListeners: {},
                preSave: function(offlineData) {
                    var defer = $q.defer();
                    for (var i=0; i<offlineData.bundlePages.length; i++){
                        var page = offlineData.bundlePages[i];
                        if (page.pageClass == "applicant" && !page.model.customer.firstName){
                            PageHelper.showProgress("KYC", "Applicant first name is required to save offline", 5000);
                            defer.reject();
                        }
                    }
                    defer.resolve();
                    return defer.promise;
                }
            }
        }
    }
})