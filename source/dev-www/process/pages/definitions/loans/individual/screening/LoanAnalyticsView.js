irf.pageCollection.factory(irf.page('loans.individual.screening.LoanAnalyticsView'), ["$log", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "LoanAccount", "LoanProcess", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
	"Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "CustomerBankBranch", "Queries", "Utils", "IndividualLoan", "BundleManager", "Message", "irfNavigator",
	function($log, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, LoanAccount, LoanProcess, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, CustomerBankBranch, Queries, Utils, IndividualLoan, BundleManager, Message, irfNavigator) {
		$log.info("Inside LoanAnalyticsView");
		return {
			"type": "page-bundle",
			"title": "VIEW_LOAN",
			"subTitle": "",
			"readonly": true,
			"bundleDefinition": [{
				pageName: 'loans.individual.screening.detail.IndividualEnrollmentView',
				title: 'APPLICANT',
				pageClass: 'applicant',
				minimum: 1,
				maximum: 1
			}, {
				pageName: 'loans.individual.screening.detail.IndividualEnrollmentView',
				title: 'CO_APPLICANT',
				pageClass: 'co-applicant',
				minimum: 1,
				maximum: 1
			}, {
				pageName: 'loans.individual.screening.detail.IndividualEnrollmentView',
				title: 'GUARANTOR',
				pageClass: 'guarantor',
				minimum: 1,
				maximum: 1
			}, {
				pageName: 'loans.individual.screening.detail.EnterpriseEnrollmentView',
				title: 'BUSINESS',
				pageClass: 'business',
				minimum: 1,
				maximum: 1
			}, {
				pageName: 'loans.individual.screening.detail.EnterpriseFinancialView',
				title: 'Business Financials',
				pageClass: 'business-finance',
				minimum: 1,
				maximum: 1
			}, {
				pageName: 'loans.individual.screening.detail.LoanApplicationView',
				title: 'Loan Recommendation',
				pageClass: 'loan_recommendation',
				minimum: 1,
				maximum: 1
			}, {
				pageName: 'loans.individual.screening.detail.ScoringView',
				title: 'SCORING',
				pageClass: 'scoring_view',
				minimum: 1,
				maximum: 1
			}],
			"bundlePages": [],
			"offline": false,

			bundleActions: [{
				name: "Go Back",
				desc: "",
				icon: "fa fa-angle-left",
				fn: function(bundleModel) {
					$log.info("back button pressed");
					$log.info($stateParams.pageId);
					if (_.hasIn($stateParams, 'pageId') && !_.isNull($stateParams.pageId)) {
						var loanId = $stateParams.pageId;
						irfNavigator.goBack();
					}
				},
				isApplicable: function(bundleModel) {
					return true;
				}
			}],
			"pre_pages_initialize": function(bundleModel) {
				$log.info("Inside pre_page_initialize");
				var deferred = $q.defer();

				var $this = this;
				if ($stateParams.pageId) {
					bundleModel.loanId = $stateParams.pageId;
					PageHelper.showLoader();
					IndividualLoan.get({
						id: bundleModel.loanId
					}).$promise.then(function(res) {
						bundleModel.loanAccount = res;

						bundleModel.applicant = {};
						bundleModel.coApplicants = [];
						bundleModel.guarantors = [];
						bundleModel.business = {};
						bundleModel.urnNos = [];
						var customerIds = {
							coApplicants: [],
							guarantors: []
						};

						for (var i = 0; i < res.loanCustomerRelations.length; i++) {
							var cust = res.loanCustomerRelations[i];
							if (cust.relation == 'APPLICANT' || cust.relation == 'Applicant' || cust.relation == 'Sole Proprieter') {
								bundleModel.urnNos.push(cust.urn);
								customerIds.applicant = cust.customerId;
							} else if (cust.relation == 'COAPPLICANT' || cust.relation == 'Co-Applicant') {
								bundleModel.urnNos.push(cust.urn);
								customerIds.coApplicants.push(cust.customerId);
							} else if (cust.relation == 'GUARANTOR' || cust.relation == 'Guarantor') {
								customerIds.guarantors.push(cust.customerId);
							}
						}

						$this.bundlePages.push({
							pageClass: 'applicant',
							model: {
								customerId: customerIds.applicant
							}
						});

						for (i in customerIds.coApplicants) {
							$this.bundlePages.push({
								pageClass: 'co-applicant',
								model: {
									customerId: customerIds.coApplicants[i]
								}
							});
						}

						for (i in customerIds.guarantors) {
							$this.bundlePages.push({
								pageClass: 'guarantor',
								model: {
									customerId: customerIds.guarantors[i]
								}
							});
						}

						$this.bundlePages.push({
							pageClass: 'business',
							model: {
								customerId: res.customerId
							}
						});

						$this.bundlePages.push({
							pageClass: 'business-finance',
							model: {
								customerId: res.customerId
							}
						});

						$this.bundlePages.push({
							pageClass: 'loan_recommendation',
							model: {
								customerId: res.customerId
							}
						});

						$this.bundlePages.push({
							pageClass: 'scoring_view',
							model: {
								cbModel: {
									customerId: res.customerId,
									loanId: bundleModel.loanId,
									scoreName: 'RiskScore3'
								}
							}
						});

						deferred.resolve();
					}, function(httpRes) {
						deferred.reject();
						PageHelper.showErrors(httpRes);
					}).finally(PageHelper.hideLoader)
				}
				return deferred.promise;
			},
			eventListeners: {
				"scoring-loaded": function(pageObj, bundleModel, params) {
					BundleManager.broadcastEvent("_scoresApplicant", params);
					BundleManager.broadcastEvent("financial-summary", params);
				},
				"rel_to_business": function(pageObj, bundleModel, params) {
					BundleManager.broadcastEvent("business_customer", params);
				},
				"liability_summary": function(pageObj, bundleModel, params) {
					BundleManager.broadcastEvent("_liability", params);
				}

			}
		}

	}
]);