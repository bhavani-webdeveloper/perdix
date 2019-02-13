irf.pageCollection.factory(irf.page('loans.individual.screening.FieldAppraisal'),
	["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager","formHelper", "$stateParams", "Enrollment"
        ,"IndividualLoan", "Lead", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
        "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch","Queries", "Utils", "IndividualLoan", "BundleManager", "Message", "irfNavigator",
        function ($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment,IndividualLoan, Lead, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch,Queries, Utils, IndividualLoan, BundleManager, Message, irfNavigator) {
        	$log.info("Inside LoanBookingBundle");

        	return {
        		"type": "page-bundle",
        		"title": "FIELD_APPRAISAL",
        		"subTitle": "",
                "readonly": true,
                "bundleDefinition": [
                    {
                        pageName: 'loans.individual.screening.Summary',
                        title: 'SUMMARY',
                        pageClass: 'summary',
                        minimum: 1,
                        maximum: 1,
                        order:5
                    },
                    {
                        pageName: 'customer.IndividualEnrolment2',
                        title: 'APPLICANT',
                        pageClass: 'applicant',
                        minimum: 1,
                        maximum: 0,
                        order:10
                    },
                    {
                        pageName: 'customer.IndividualEnrolment2',
                        title: 'CO_APPLICANT',
                        pageClass: 'co-applicant',
                        minimum: 5,
                        maximum: 0,
                        order:20
                    },
                    {
                        pageName: 'customer.IndividualEnrolment2',
                        title: 'GUARANTOR',
                        pageClass: 'guarantor',
                        minimum: 5,
                        maximum: 0,
                        order:30
                    },
                    {
                        pageName: 'customer.EnterpriseEnrolment2',
                        title: 'BUSINESS',
                        pageClass: 'business',
                        minimum: 1,
                        maximum: 1,
                        order:40
                    },
                    {
                        pageName: 'customer.EnterpriseEnrolment2BusinessFinancial',
                        title: 'BUSINESS_FINANCIALS',
                        pageClass: 'business-financials',
                        minimum: 1,
                        maximum: 1,
                        order:41
                    },
                    {
                        pageName: 'loans.individual.screening.PersonalDiscussion',
                        title: 'PERSONAL_DISCUSSION',
                        pageClass: 'personal-discussion',
                        minimum: 1,
                        maximum: 1,
                        order:42
                    },
                    {
                        pageName: 'loans.individual.screening.LoanRequest',
                        title: 'LOAN_REQUEST',
                        pageClass: 'loan-request',
                        minimum: 1,
                        maximum: 1,
                        order:45
                    },
                    {
                        pageName: 'loans.individual.screening.CreditBureauView',
                        title: 'CREDIT_BUREAU',
                        pageClass: 'cbview',
                        minimum: 1,
                        maximum: 1,
                        order:50
                    }, {
                        pageName: 'loans.individual.screening.detail.PortfolioAnalysis',
                        title: 'CUSTOMER_HISTORY',
                        pageClass: 'portfolio-analysis',
                        minimum: 1,
                        maximum: 1,
                        order: 52
                    },
                    {
                        pageName: 'loans.individual.screening.Review',
                        title: 'REVIEW',
                        pageClass: 'loan-review',
                        minimum: 1,
                        maximum: 1,
                        order:60
                    }, 
                    {
                        pageName: 'loans.individual.screening.detail.SummaryView',
                        title: 'SummaryView',
                        pageClass: 'summaryView',
                        minimum: 1,
                        maximum: 1,
                        order: 5
                    }
                ],
                "bundlePages": [],
                "offline": true,
                "getOfflineDisplayItem": function(value, index){
                    var out = new Array(2);
                    for (var i=0; i<value.bundlePages.length; i++){
                        var page = value.bundlePages[i];
                        if (page.pageClass == "applicant"){
                            out[0] = page.model.customer.firstName;
                        } else if (page.pageClass == "business"){
                            out[1] = page.model.customer.firstName;
                        }
                    }
                    return out;
                },

                bundleActions: [{
                    name: "Conversation",
                    desc: "",
                    icon: "fa fa-comment",
                    fn: function(bundleModel) {
                        Message.openOrCreateConversation("Loan", $stateParams.pageId);
                    },
                    isApplicable: function(bundleModel) {
                        return true;
                    }
                }],

                "pre_pages_initialize": function(bundleModel){
                    $log.info("Inside pre_page_initialize");
                    var deferred = $q.defer();
                    bundleModel.currentStage = "FieldAppraisal";

                    var $this = this;
                    if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)){
                        PageHelper.showLoader();
                        bundleModel.loanId = $stateParams.pageId;
                        IndividualLoan.get({id: bundleModel.loanId})
                            .$promise
                            .then(
                                function(res){
                                    var applicant;
                                    var coApplicants = [];
                                    var guarantors = [];
                                    var urnNos = [];
                                    var loanCustomerId = res.customerId;

                                    if (res.currentStage!= 'FieldAppraisal'){
                                        PageHelper.showProgress('load-loan', 'Loan Application is in different Stage', 2000);
                                        irfNavigator.goBack();
                                        return;
                                    }

                                    for (var i=0; i<res.loanCustomerRelations.length; i++){
                                        var cust = res.loanCustomerRelations[i];
                                        if (cust.relation == 'APPLICANT' || cust.relation == 'Applicant' || cust.relation =='Sole Proprieter'){
                                            applicant = cust;
                                            applicant.enterpriseId=res.customerId;
                                            urnNos.push(cust.urn);
                                        } else if (cust.relation == 'COAPPLICANT' || cust.relation == 'Co-Applicant') {
                                            coApplicants.push(cust);
                                            urnNos.push(cust.urn);
                                        } else if (cust.relation == 'GUARANTOR' || cust.relation == 'Guarantor') {
                                            guarantors.push(cust);
                                        }
                                    }

                                    $this.bundlePages.push({
                                        pageClass: 'summary',
                                        model: {
                                            cbModel: {customerId:res.customerId,loanId:bundleModel.loanId, scoreName:'RiskScore2'}
                                        }
                                    });

                                    if(SessionStore.getGlobalSetting('siteCode') != 'IREPDhan' || SessionStore.getGlobalSetting('siteCode') == 'IREPDhan') {
                                        $this.bundlePages.push({
                                            pageClass: 'summaryView',
                                            model: {
                                                cbModel: {
                                                    customerId: res.customerId,
                                                    loanId: bundleModel.loanId,
                                                    scoreName: 'RiskScore3',
                                                    customerDetail: bundleModel.customer_detail
                                                }
                                            }
                                        });
                                    }

                                    $this.bundlePages.push({
                                        pageClass: 'cbview',
                                        model: {
                                            loanAccount: res
                                        }
                                    });

                                    $this.bundlePages.push({
                                        pageClass: 'applicant',
                                        model: {
                                            loanRelation: applicant
                                        }
                                    });

                                    for (var i=0;i<coApplicants.length; i++){
                                        $this.bundlePages.push({
                                            pageClass: 'co-applicant',
                                            model: {
                                                loanRelation: coApplicants[i]
                                            }
                                        });
                                    }

                                    for (var i=0;i<guarantors.length; i++){
                                        $this.bundlePages.push({
                                            pageClass: 'guarantor',
                                            model: {
                                                loanRelation: guarantors[i]
                                            }
                                        });
                                    }
                                    var businessModel = {loanRelation:{customerId: loanCustomerId}};
                                    $this.bundlePages.push({
                                        pageClass: 'business',
                                        model: businessModel
                                    })
                                    $this.bundlePages.push({
                                        pageClass: 'business-financials',
                                        model: businessModel
                                    })

                                    $this.bundlePages.push({
                                        pageClass: 'portfolio-analysis',
                                        model: {
                                            customerUrn: res.urnNo,
                                            cbModel: {
                                                customerId: res.customerId,
                                                loanId: bundleModel.loanId,
                                                scoreName: 'RiskScore3',
                                                customerDetail: bundleModel.customer_detail
                                            }
                                            
                                        }
                                    });

                                    var temp_model = {
                                        loanAccount:res
                                    }
                                    $this.bundlePages.push({
                                        pageClass: 'personal-discussion',
                                        model: temp_model 
                                    });

                                    $this.bundlePages.push({
                                        pageClass: 'loan-request',
                                        model: temp_model
                                    });

                                    $this.bundlePages.push({
                                        pageClass: 'loan-review',
                                        model: {
                                            loanAccount: res
                                        }
                                    });

                                    deferred.resolve();

                                }, function(httpRes){
                                    deferred.reject();
                                    PageHelper.showErrors(httpRes);
                                }
                            )
                            .finally(function(){
                                PageHelper.hideLoader();
                            })
                    }
                    return deferred.promise;
                },
                "post_pages_initialize": function(bundleModel){
                    $log.info("Inside post_page_initialize");
                    BundleManager.broadcastEvent('origination-stage', 'FieldAppraisal');
                },
        		eventListeners: {
        			"on-customer-load": function(pageObj, bundleModel, params){

        			},
                    "customer-loaded": function(pageObj, bundleModel, params){
                        switch (pageObj.pageClass){
                            case 'applicant':
                                $log.info("Applicant loaded");
                                BundleManager.broadcastEvent("applicant-updated", params.customer);
                                break;
                        }
                    },
                    "new-enrolment": function(pageObj, bundleModel, params){
                        switch (pageObj.pageClass){
                            case 'applicant':
                                $log.info("New applicant");
                                bundleModel.applicant = params.customer;
                                BundleManager.broadcastEvent("new-applicant", params);
                                BundleManager.broadcastEvent("applicant-updated", params.customer);
                                break;
                            case 'co-applicant':
                                $log.info("New co-applicant");
                                if (!_.hasIn(bundleModel, 'coApplicants')) {
                                    bundleModel.coApplicants = [];
                                }
                                BundleManager.broadcastEvent("new-co-applicant", params);
                                bundleModel.coApplicants.push(params.customer);
                                break;
                            case 'guarantor':
                                $log.info("New guarantor");
                                if (!_.hasIn(bundleModel, 'guarantors')){
                                    bundleModel.guarantors = [];
                                }
                                bundleModel.guarantors.push(params.guarantor);
                                break;
                            case 'business':
                                $log.info("New Business Enrolment");
                                bundleModel.business = params.customer;
                                BundleManager.broadcastEvent("new-business", params);
                                break;
                            default:
                                $log.info("Unknown page class");
                                break;

                        }
                    },
                    "enrolment-removed": function(pageObj, bundlePageObj, enrolmentDetails){
                        if (enrolmentDetails.customerId){
                            BundleManager.broadcastEvent('remove-customer-relation', enrolmentDetails);
                        }
                    },
                    "load-personal-discussion-object": function(form, formCtrl, model, bundlePageObj,bundleModel){
                        BundleManager.broadcastEvent('load-personal-discussion', form, formCtrl, model,bundlePageObj, bundleModel);
                        //object.initialize(model, form, formCtrl, bundlePageObj, bundleModel);
                    },
                    "financialSummary": function(pageObj, bundleModel, params) {
                        BundleManager.broadcastEvent("financial-summary", params);
                    },
                    "customer-history-data": function(pageObj, bundleModel, params){
                        BundleManager.broadcastEvent("customer-history-fin-snap", params);
                    },
                    "business": function(pageObj, bundleModel, params) {
                        BundleManager.broadcastEvent("business-customer", params);
                    }
        		}
        	}
        }
    ]
)
