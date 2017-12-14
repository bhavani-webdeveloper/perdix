define({
	pageUID: "loans.individual.screening.detail.IndividualEnrollmentView",
	pageType: "Engine",
	dependencies: ["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q", "irfProgressMessage", "$stateParams", "$state",
		"PageHelper", "Utils", "PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe", "$resource", "$httpParamSerializer", "BASE_URL", "searchResource","filterFilter", "irfCurrencyFilter"
	],
	$pageFn: function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q, irfProgressMessage, $stateParams, $state,
		PageHelper, Utils, PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, Dedupe, $resource, $httpParamSerializer, BASE_URL, searchResource,filterFilter, irfCurrencyFilter) {
		return {
			"type": "schema-form",
			"title": "INDIVIDUAL_ENROLLMENT",
			"subTitle": "",
			initialize: function(model, form, formCtrl, bundlePageObj, bundleModel) {
				model.bundlePageObj = bundlePageObj;
				model.bundleModel = bundleModel;
				Enrollment.getCustomerById({
					id: model.customerId
				}).$promise.then(function(res) {
					model.customer = res;
					model.firstName = res.firstName;
					switch (bundlePageObj.pageClass) {
						case 'applicant':
							model.bundleModel.applicant = res;
							break;
						case 'co-applicant':
							model.bundleModel.coApplicants.push(res);
							break;
						case 'guarantor':
							model.bundleModel.guarantors.push(res);
							break;
					};

					model.custom_fields = {
						'family_fields': {},
						'liability_fields': {},
						'household_fields': {},
						'bank_fields': {},
						'cibil': {}
					};



					/*Auto_Custom fields -- START */
					/*Present Address*/
					model.customer_address_html = model.customer.doorNo.concat('\n', model.customer.street, '\n', model.customer.pincode, '\n ', model.customer.district, ' \n', model.customer.state);
					/*VIEW UPLOADS SECTION*/
					model.addressProof = 'KYC-' + model.customer.addressProof;
					model.identityProof = 'KYC-' + model.customer.identityProof;
					/*Family fields*/
					model.custom_fields.family_fields.family_member_count = model.customer.familyMembers.length;
					model.custom_fields.family_fields.dependent_family_member = 0;
					model.custom_fields.family_fields.total_household_income = 0;
					_.each(model.customer.familyMembers, function(member) {
						if (member.incomes.length == 0)
							model.custom_fields.family_fields.dependent_family_member++;
						else {
							_.each(member.incomes, function(income) {
								model.custom_fields.family_fields.total_household_income += income.incomeEarned;
							});
						}
					});
					/*Liability fields*/
					BundleManager.pushEvent('liability_summary', model._bundlePageObj, model.customer.liabilities);
					model.custom_fields.liability_fields.active_loans = model.customer.liabilities.length;
					model.custom_fields.liability_fields.total_monthly_installment = 0;
					model.custom_fields.liability_fields.outstandingAmount = 0;
					model.custom_fields.liability_fields.loan_from_bank = 0;
					model.custom_fields.liability_fields.loan_from_NBFC_MFI = 0;
					model.custom_fields.liability_fields.loan_from_others = 0;
					_.each(model.customer.liabilities, function(liability) {
						model.custom_fields.liability_fields.total_monthly_installment += liability.installmentAmountInPaisa;
						model.custom_fields.liability_fields.outstandingAmount += liability.outstandingAmountInPaisa;
						switch (liability.loanSource) {
							case "BANK":
								model.custom_fields.liability_fields.loan_from_bank += liability.loanAmountInPaisa;
								break;
							case "MFI/NBFC":
								model.custom_fields.liability_fields.loan_from_NBFC_MFI += liability.loanAmountInPaisa;
								break;
							default:
								model.custom_fields.liability_fields.loan_from_others += liability.loanAmountInPaisa;
								break;

						};
					});

					/*Household Assets field*/
					model.custom_fields.household_fields.total_Assets = model.customer.physicalAssets.length; /* what assets i need to take*/
					model.custom_fields.household_fields.total_Value = 0;
					_.each(model.customer.physicalAssets, function(Assets) {
						model.custom_fields.household_fields.total_Value += Assets.ownedAssetValue;
					});

					/*Bank fields*/
					model.custom_fields.bank_fields.bankStatements = [];
					model.custom_fields.bank_fields.total_Deposit = 0;
					model.custom_fields.bank_fields.total_Withdrawals = 0;
					model.custom_fields.bank_fields.avg_deposit = 0;
					model.custom_fields.bank_fields.avg_withdrawals = 0;
					model.custom_fields.bank_fields.avg_bal_EMI_date;
					model.custom_fields.bank_fields.tot_accounts = model.customer.customerBankAccounts.length;
					model.custom_fields.bank_fields.tot_checque_bounce = 0;
					model.custom_fields.bank_fields.tot_EMI_bounce = 0;
					model.custom_fields.bank_fields.total_bankstatement = 0;
					_.each(model.customer.customerBankAccounts, function(account) {
						_.each(account.bankStatements, function(bankslips) {
							model.custom_fields.bank_fields.bankStatements.push(bankslips);
							model.custom_fields.bank_fields.total_Deposit += bankslips.totalDeposits;
							model.custom_fields.bank_fields.total_Withdrawals += bankslips.totalWithdrawals;
							model.custom_fields.bank_fields.total_bankstatement++;
							model.custom_fields.bank_fields.tot_checque_bounce += bankslips.noOfChequeBounced;
							model.custom_fields.bank_fields.tot_EMI_bounce += bankslips.noOfEmiChequeBounced;

						});
					});
					if (model.custom_fields.bank_fields.total_bankstatement != 0) {
						model.custom_fields.bank_fields.avg_deposit = (model.custom_fields.bank_fields.total_Deposit / model.custom_fields.bank_fields.total_bankstatement);
						model.custom_fields.bank_fields.avg_withdrawals = (model.custom_fields.bank_fields.total_Withdrawals / model.custom_fields.bank_fields.total_bankstatement);
					}
					/*Cibil/highmark fields*/
					var endpoint = BASE_URL;
					var cibil = $resource(endpoint, null, {
						get: {
							method: 'GET',
							url: endpoint + '/api/creditbureau/find'
						}
					});

					cibil.get({
						customerId: model.customerId
					}).$promise.then(function(res) {
						model.cibil_highmark = res;
						model.custom_fields.cibil.cibil_score = model.cibil_highmark.cibil.cibilScore[0].score;
						model.custom_fields.cibil.active_accounts = model.cibil_highmark.cibil.cibilLoanSummaryInfo[0].totalAccounts;
						model.custom_fields.cibil.overdue_accounts = model.cibil_highmark.cibil.cibilLoanSummaryInfo[0].overDueAccounts;
						model.custom_fields.cibil.sanctioned_Amount = model.cibil_highmark.cibil.cibilLoanDetails[0].highCreditOrSanctionedAmount;
						model.custom_fields.cibil.current_balance = model.cibil_highmark.cibil.cibilLoanSummaryInfo[0].currentBalance;
						model.custom_fields.cibil.amount_overdue = model.cibil_highmark.cibil.cibilLoanSummaryInfo[0].amountOverDue;
						/*for(i=0;i<=model.cibil_highmark.cibil.cibilScore.length;i++){
							model.custom_fields.cibil.cibil_score += model.cibil_highmark.cibil.cibilScore[i].score;
						}*/
					});

					/*Household fields */

					/*Reference Check fields*/
					model.custom_fields.REFERENCE_CHECK_RESPONSE = 'NA';
					var count_neg_response = 0;
					_.each(model.customer.verifications, function(verification) {
						if (verification.customerResponse != 'positive' && verification.customerResponse != null) {
							count_neg_response++;
						}
					})
					if (count_neg_response >= 1) {
						model.custom_fields.REFERENCE_CHECK_RESPONSE = 'negative';
					} else {
						model.custom_fields.REFERENCE_CHECK_RESPONSE = 'positive';
					}

					/*Auto_Custom field -- END*/
					/*if (self.form[self.form.length - 1].title != "VIEW_UPLOADS") {
						var fileForms = [{
							"key": "customer.rawMaterialExpenses[].invoiceDocId",
							"notitle": true,
							"category": "Loan",
							"subCategory": "DOC1",
							"type": "file",
							"preview": "pdf",
							"using": "scanner"
						}];
						//
						self.form.push({
							"type": "box",
							"colClass": "col-sm-12",
							"readonly": true,
							"overrideType": "default-view",
							"title": "VIEW_UPLOADS",
							"items": [{
								"type": "section",
								"html": '<sf-decorator style="float:left" ng-repeat="item in form.items" form="item"></sf-decorator>',
								"items": fileForms
							}]
						});
					}*/

				});
			},

			form: [{
                "type": "section",
                "html": `
<div class="col-sm-6"><i class="fa fa-check-circle text-green" style="font-size:x-large">&nbsp;</i><em class="text-darkgray">Existing Customer</em><br>&nbsp;</div>
<div class="col-sm-3">{{'BRANCH'|translate}}: <strong>{{model.business.kgfsName}}</strong></div>
<div class="col-sm-3">{{'CENTRE'|translate}}: <strong>{{model.business.centreName}}</strong></div>
`
            },{
				"type": "box",
				"readonly": true,
				"colClass": "col-sm-12",
				"title": "PERSONAL_DETAILS",
				"overrideType": "default-view",
				"items": [{
					"type": "grid",
					"orientation": "horizontal",
					"items": [{
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "customer.id",
							"title": "CUSTOMER_ID"
						}, {
							"key": "customer.firstName",
							"title": "FULL_NAME"
						}, {
							"key": "customer.gender"
						}, {
							"key": "customer.dateOfBirth"
						}, {
							"key": "customer.aadhaarNo"
						}, {
							"key": "customer.panNo"
						}, {
							"key": "customer.language",
							"title": "PREFERRED_LANGUAGE"
						}, {
							"key": "customer.mobilePhone",
							"title": "MOBILE_NO",
							"inputmode": "number",
							"numberType": "tel"
						}, {
							"key": "customer.email",
							"title": "EMAIL"
						}, {
							"key": "customer_address_html",
							"title": "Present Address"
						}]
					}, {
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "customer.urnNo",
							"title": "URN_NO"
						}, {
							"key": "customer.religion"
						}, {
							"key": "customer.fatherFirstName",
							"title": "FATHER_FULL_NAME",
						}, {
							"key": "customer.motherName",
							"title": "MOTHER'S FULL NAME"
						}, {
							"key": "customer.maritalStatus"
						}, {
							"key": "customer.spouseFirstName",
							"title": "SPOUSE_FULL_NAME",
							"condition": "model.customer.maritalStatus && model.customer.maritalStatus.toUpperCase() == 'MARRIED'"
						}, {
							"key": "customer.spouseDateOfBirth",
							"condition": "model.customer.maritalStatus && model.customer.maritalStatus.toUpperCase() == 'MARRIED' "
						}]
					}, {
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "customer.photoImageId",
							"type": "file",
							"fileType": "image/*",
							"notitle": true
						}]

					}]
				}]
			}, {
				"type": "box",
				"readonly": true,
				"colClass": "col-sm-12",
				"overrideType": "default-view",
				"title": "Family",
				"items": [{
					"type": "grid",
					"orientation": "horizontal",
					"items": [{
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "custom_fields.family_fields.family_member_count",
							"title": "No. Of Family Member's"
						}, {
							"key": "custom_fields.family_fields.dependent_family_member",
							"title": "No. Of Dependent Family Member's"
						}]
					}, {
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "custom_fields.family_fields.total_household_income",
							"type": "amount",
							"title": "Total Household Income"
						}, {
							"key": "customer.financialSummaries[].householdExpenses",
							"type": "amount",
							"title": "Declared Household Expenditure"
						}]
					}]
				}, {
					"type": "expandablesection",
					"items": [{
						"type": "tableview",
						"key": "customer.familyMembers",
						"transpose": true,
						"title": "",
						"selectable": false,
						"editable": false,
						"tableConfig": {
							"searching": false,
							"paginate": false,
							"pageLength": 10,
						},
						getColumns: function() {
							return [{
								"title": "FULL_NAME",
								"data": "",
								render: function(data, type, full, meta) {
									/*if (full.relationShip=="self")
										return customer.firstName;*/
									return full.familyMemberFirstName;
								}
							}, {
								"title": "RELATIONSHIP",
								"data": "relationShip",
								render: function(data, type, full, meta) {
									if (full.relationShip != null)
										return full.relationShip;
									return "NA";
								}
							}, {
								"title": "T_EDUCATION_STATUS",
								"data": "educationStatus",
								render: function(data, type, full, meta) {
									if (full.educationStatus != null)
										return full.educationStatus;
									return "NA";
								}
							}, {
								"title": "ANNUAL_EDUCATION_FEE",
								"data": "anualEducationFee",
								render: function(data, type, full, meta) {
									if (full.anualEducationFee != null)
										return irfCurrencyFilter(full.anualEducationFee);
									return "NA";
								}
							}, {
								"title": "INCOME_SOURCE",
								"data": "",
								render: function(data, type, full, meta) {
									if (full.incomes[0])
										return full.incomes[0].incomeSource;
									return "NA";
								}
							}, {
								"title": "INCOME",
								"data": "",
								render: function(data, type, full, meta) {
									if (full.incomes[0])
										return irfCurrencyFilter(full.incomes[0].incomeEarned);
									return "NA";
								}
							}];
						},
						getActions: function() {
							return [];
						}
					}]
				}]
			}, {
				"type": "box",
				"readonly": true,
				"colClass": "col-sm-12",
				"overrideType": "default-view",
				"title": "RELATIONSHIP_TO_BUSINESS",
				"condition": "model.enterpriseCustomerRelations.length!=0",
				"items": [{
					"type": "tableview",
					"key": "enterpriseCustomerRelations",
					"transpose": true,
					"title": "",
					"selectable": false,
					"editable": false,
					"tableConfig": {
						"searching": false,
						"paginate": false,
						"pageLength": 10,
					},
					getColumns: function() {
						return [{
							"title": "RELATIONSHIP_TO_BUSINESS",
							"data": "relationshipType"
						}, {
							"title": "EXPERIENCE_IN_BUSINESS",
							"data": "experienceInBusiness"

						}, {
							"title": "BUSINESS_INVOLVEMENT",
							"data": "businessInvolvement"
						}, {
							"title": "PARTNER_OF_ANY_OTHER_COMPANY",
							"data": "partnerOfAnyOtherCompany"
						}];
					},
					getActions: function() {
						return [];
					}
				}]

			}, {
				"type": "box",
				"readonly": true,
				"colClass": "col-sm-12",
				"overrideType": "default-view",
				"title": "HOUSEHOLD_LIABILITIES",
				"condition": "model.custom_fields.liability_fields.active_loans !=0",
				"items": [{
					"type": "grid",
					"orientation": "horizontal",
					"items": [{
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "custom_fields.liability_fields.active_loans",
							"title": "No of Active Loans"
						}, {
							"key": "custom_fields.liability_fields.total_monthly_installment",
							"title": "Total monthly instalments"
						}, {
							"key": "custom_fields.liability_fields.outstandingAmount",
							"title": "OUTSTANDING_AMOUNT"
						}]

					}, {
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "custom_fields.liability_fields.loan_from_bank",
							"title": "Total loan amount from Banks"

						}, {
							"key": "custom_fields.liability_fields.loan_from_NBFC_MFI",
							"title": "Total loan amount from MFI/NBFC"

						}, {
							"key": "custom_fields.liability_fields.loan_from_others",
							"title": "Total loan amount from others"

						}]

					}]
				}, {
					"type": "expandablesection",
					"items": [{
						"type": "tableview",
						"key": "customer.liabilities",
						"notitle": true,
						"transpose": true,
						"selectable": false,
						"editable": false,
						"tableConfig": {
							"searching": false,
							"paginate": false,
							"pageLength": 10,
						},
						getColumns: function() {
							return [{
								"title": "Loan Type",
								"data": "loanType"
							}, {
								"title": "loan_source",
								"data": "loanSource"
							}, {
								"title": "loan Amount",
								"data": "loanAmountInPaisa",
								render:function(data,type,full,meta){
									return irfCurrencyFilter(full.loanAmountInPaisa)
								}
							}, {
								"title": "Instalment Amount",
								"data": "installmentAmountInPaisa",
								render:function(data,type,full,meta){
									return irfCurrencyFilter(full.installmentAmountInPaisa)
								}
							}, {
								"data": "outstandingAmountInPaisa",
								"title": "OUTSTANDING_AMOUNT",
								render:function(data,type,full,meta){
									return irfCurrencyFilter(full.outstandingAmountInPaisa)
								}
							}, {
								"title": "Loan_Purpose",
								"data": "liabilityLoanPurpose"

							}, {
								"title": "START_DATE",
								"data": "startDate"
							}, {
								"title": "MATURITY_DATE",
								"data": "maturityDate"
							}, {
								"data": "noOfInstalmentPaid",
								"type": "number",
								"title": "NO_OF_INSTALLMENT_PAID"
							}, {
								"title": "Frequency of Instalments",
								"data": "frequencyOfInstallment"
							}, {
								"data": "interestOnly",
								"title": "INTEREST_ONLY"
							}, {
								"data": "interestRate",
								"type": "number",
								"title": "RATE_OF_INTEREST"
							}];
						},
						getActions: function() {
							return [];
						}
					}]
				}]
			}, {
				"type": "box",
				"readonly": true,
				"colClass": "col-sm-12",
				"overrideType": "default-view",
				"title": "HOUSEHOLD ASSETS",
				"condition": "model.custom_fields.household_fields.total_Assets !=0",
				"items": [{
					"type": "grid",
					"orientation": "horizontal",
					"items": [{
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "custom_fields.household_fields.total_Assets",
							"title": "Total_Assets"
						}]
					}, {
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "custom_fields.household_fields.total_Value",
							"title": "Total_Value"
						}]
					}]
				}, {
					"type": "expandablesection",
					"items": [{
						"type": "tableview",
						"key": "customer.physicalAssets",
						"title": "",
						"transpose": true,
						"selectable": false,
						"editable": false,
						"tableConfig": {
							"searching": false,
							"paginate": false,
							"pageLength": 10,
						},
						getColumns: function() {
							return [{
								"title": "ASSET_TYPE",
								"data": "nameOfOwnedAsset"
							}, {
								"title": "REGISTERED_OWNER",
								"data": "registeredOwner"

							}, {
								"title": "VALUE_OF_THE_ASSET",
								"data": "ownedAssetValue"
							}];
						},
						getActions: function() {
							return [];
						}
					}]
				}]
			}, {
				"type": "box",
				"readonly": true,
				"colClass": "col-sm-12",
				"overrideType": "default-view",
				"title": "BANK ACCOUNT DETAILS",
				"condition": "model.customer.customerBankAccounts.length != 0",
				"items": [{
					"type": "grid",
					"orientation": "horizontal",
					"items": [{
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "custom_fields.bank_fields.avg_deposit",
							"title": "Average Monthly Deposit",
							"type": "amount"
						}, {
							"key": "custom_fields.bank_fields.avg_withdrawals",
							"title": "Average Monthly Withdrawals",
							"type": "amount"
						}, {
							"key": "",
							"title": "Average Monthly Balances",
							"type": "amount"
						}]
					}, {
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "custom_fields.bank_fields.tot_accounts",
							"title": "Total no of Account"
						}, {
							"key": "custom_fields.bank_fields.tot_checque_bounce",
							"title": "Total no of Cheque Bounce"
						}, {
							"key": "custom_fields.bank_fields.tot_EMI_bounce",
							"title": "Total no EMI Bounce"
						}]
					}]
				}, {
					"type": "expandablesection",
					"items": [{
						"type": "tableview",
						"key": "customer.customerBankAccounts",
						"notitle": true,
						"transpose": true,
						"selectable": false,
						"editable": false,
						"tableConfig": {
							"searching": false,
							"paginate": false,
							"pageLength": 10,
						},
						getColumns: function() {
							return [{
								"title": "Bank Name",
								"data": "customerBankName"
							}, {
								"title": "Branch Name",
								"data": "customerBankBranchName"
							}, {
								"title": "IFSC Code",
								"data": "ifscCode"
							}, {
								"title": "Account Number",
								"data": "accountNumber",
								"type": "password",
								"inputmode": "number",
								"numberType": "tel"
							}, {
								"title": "Average Bank Balance",
								"data": ""
							}, {
								"title": "Average Bank Deposit",
								"data": ""
							}, {
								"title": "Account Name",
								"data": "customerNameAsInBank"
							}, {
								"title": "Account Type",
								"data": "accountType"
							}, {
								"title": "BANKING_SINCE",
								"data": "bankingSince"

							}, {
								"title": "NET_BANKING_AVAILABLE",
								"data": "netBankingAvailable"
							}, {
								"title": "Limit",
								"data": "limit"
							}, {

								"title": "Bank Statement's",
								"data": "",
								render: function(data, type, full, meta) {
									var title = [];
									var url = [];
									for (i = 0; i < full.bankStatements.length; i++) {
										url.push(irf.BASE_URL + "/" + full.bankStatements[i].bankStatementPhoto);
										title.push(moment(full.bankStatements[i].startMonth).format('MMMM YYYY'));
									}
									//return '<div  ng-repeat = "i in ' + full.bankStatements + 'track by $index"  ><p><a  href="' + url + '[$index] ">' + title + '[$index]</a></p></div>'
									return '<div >' +
										'<table class="table table-responsive">' +
										'<tbody >' +
										'<tr>' +
										'<td><a  href="' + url[0] + '">' + title[0] + '</a></td>' +
										'</tr>' +
										'<tr>' +
										'<td><a  href="' + url[1] + '">' + title[1] + '</a></td>' +
										'</tr>' +
										'<tr>' +
										'<td><a  href="' + url[2] + '">' + title[2] + '</a></td>' +
										'</tr>' +
										'<tr>' +
										'<td><a  href="' + url[3] + '">' + title[3] + '</a></td>' +
										'</tr>' +
										'<tr>' +
										'<td><a  href="' + url[4] + '">' + title[4] + '</a></td>' +
										'</tr>' +
										'<tr>' +
										'<td><a  href="' + url[5] + '">' + title[5] + '</a></td>' +
										'</tr>' +
										'</tbody>' +
										'</table>' +
										'</div>'
								}
							}];
						},
						getActions: function() {
							return [];
						}
					}]
				}]
			}, {
				"type": "box",
				"colClass": "col-sm-12",
				"overrideType": "default-view",
				"title": "CIBIL_HIGHMARK",
				"readonly": true,
				"items": [{
					"type": "grid",
					"orientation": "horizontal",
					"items": [{
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "custom_fields.cibil.cibil_score",
							"title": "CIBIL Score"
						}, {
							"key": "custom_fields.cibil.active_accounts",
							"title": "Active Accounts"
						}, {
							"key": "custom_fields.cibil.overdue_accounts",
							"title": "Overdue Accounts"
						}, {
							"key": "custom_fields.cibil.sanctioned_Amount",
							"title": "Sanctioned Amount"
						}, {
							"key": "custom_fields.cibil.current_balance",
							"title": "Current Balance"
						}, {
							"key": "custom_fields.cibil.amount_overdue",
							"title": "Overdue Balance"
						}, {
							"key": "",
							"title": "Report"
						}]
					}, {
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "cibil_highmark.highMark.highmarkScore",
							"title": "Highmark Score"
						}, {
							"key": "",
							"title": "Active Accounts"
						}, {
							"key": "",
							"title": "Overdue Account"
						}, {
							"key": "",
							"title": "Total Current Balance"
						}, {
							"key": "",
							"title": "Amount Disbursed"
						}, {
							"key": "",
							"title": "Report"
						}]
					}]
				}]
			}, {
				"type": "box",
				"colClass": "col-sm-12",
				"title": "Psychometric Scores",
				"readonly": true,
				"condition": "model.bundlePageObj.pageClass != 'guarantor' ",
				"items": [{
					"type":"section",
					"html":'<table class="table table-responsive">' +
							'<colgroup>' +
							'<col width="30%"> <col width="30%"> <col width="30%">' +
							'</colgroup>' +
							'<tbody>'+
							'<tr><td>Psychometric Score</td>'+
							'<td>Passed {{model.psy_data.passOutOf}} out of {{model.psy_data.psyTotalPara}} parameters</td>'+
							'<td>{{model.psy_data.summary["Total Score"]}}</td></tr></tbody></table>'
				}, {
					"type": "expandablesection",
					"items": [{
						"type": "section",
						"colClass": "col-sm-12",
						"html": '<div ng-init="_scores=model.psy_data">' +
							'<table class="table table-responsive">' +
							'<colgroup>' +
							'<col width="20%"> <col width="10%"> <col width="10%"><col width="20%">' +
							'</colgroup>' +
							'<tbody style="border:0px;">' +
							'<tr>' +
							'<th>Parameter Name</th>' +
							'<th>Cut Off </th>' +
							'<th></th>' +
							'<th>Score</th>' +
							'</tr>' +
							'<tr ng-repeat=" (key, value) in _scores.data" ng-init="parameterIndex=$index">' +
							'<td >{{key}}</td>' +
							'<td >{{value["Cut Off Score"]}}</td>' +
							'<td ><span class="square-color-box" style="background:{{_scores.data[key].color_hexadecimal}}"> </span></td>' +
							'<td>{{value["Score"]}}</td></tr>' +
							'<tr ng-repeat=" (key, value) in _scores.summary" ng-init="parameterIndex=$index">' +
							'<td ng-style = "{\'font-weight\': \'bold\'}">{{key}}</td>' +
							'<td ></td>' +
							'<td ></td>' +
							'<td > {{_scores.summary[key]}}</td></tr>' +
							'</tbody>' +
							'</table>' +
							'</div>'
					}]
				}]
			}, {
				"type": "box",
				"colClass": "col-sm-12",
				"readonly": true,
				"title": "Household P&L Statement",
				"condition": "model.bundlePageObj.pageClass !='guarantor'",
				"overrideType": "default-view",
				"items": [{
					"type": "grid",
					"orientation": "horizontal",
					"items": [{
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "household_new.income",
							"title": "Income",
							"type": "amount"
						}, {
							"key": "household_new.Expenses",
							"title": "Expenses",
							"type": "amount"
						}, {
							"key": "household_new.netHouseholdIncome",
							"title": "Net Household Income",
							"type": "amount"

						}]
					}]
				}, {
					"type": "expandablesection",
					"items": [{
						"type": "grid",
						"orientation": "horizontal",
						"items": [{
							"type": "grid",
							"orientation": "vertical",
							"items": [{
								"title": "Income"
							}]
						}, {
							"type": "grid",
							"orientation": "vertical",
							"items": [{
								"notitle": true,
								"key": "household_new.income"
							}]
						}]
					}, {
						"type": "grid",
						"orientation": "horizontal",
						"items": [{
							"type": "grid",
							"orientation": "vertical",
							"items": [{
								"key": "household_new.salaryFromBusiness",
								"title": "Income from Business"

							}, {
								"key": "household_new.otherIncomeSalaries",
								"title": "Other Income/Salary"

							}, {
								"key": "houseHoldPL.familyMemberIncomes",
								"title": "Household Income"

							}]

						}]
					}, {
						"type": "grid",
						"orientation": "horizontal",
						"items": [{
							"type": "grid",
							"orientation": "vertical",
							"items": [{
								"title": "Expenses"
							}]
						}, {
							"type": "grid",
							"orientation": "vertical",
							"items": [{
								"notitle": true,
								"key": "household_new.Expenses"
							}]
						}]
					}, {
						"type": "grid",
						"orientation": "horizontal",
						"items": [{
							"type": "grid",
							"orientation": "vertical",
							"items": [{
								"key": "household_new.declaredEducationExpense",
								"title": "Household Expenses"

							}, {
								"key": "household_new.emiHouseholdLiabilities",
								"title": "EMI Expenses"

							}]
						}]
					}, {
						"type": "grid",
						"orientation": "horizontal",
						"items": [{
							"type": "grid",
							"orientation": "vertical",
							"items": [{
								"title": "Net Household Income"
							}]
						}, {
							"type": "grid",
							"orientation": "vertical",
							"items": [{
								"notitle": true,
								"key": "household_new.netHouseholdIncome"
							}]
						}]
					}]
				}]


			}, {
				"type": "box",
				"colClass": "col-sm-12",
				"overrideType": "default-view",
				"readonly": true,
				"title": "Reference Check",
				"condition": "model.bundlePageObj.pageClass != 'guarantor' && model.customer.verifications.length !=0",
				"items": [{
					"type": "grid",
					"orientation": "horizontal",
					"items": [{
						"type": "grid",
						"orientation": "vertical",
						"items": [{
							"key": "custom_fields.REFERENCE_CHECK_RESPONSE",
							"title": "Reference Check Responses",
						}]
					}]
				}, {
					"type": "expandablesection",
					"items": [{
						"type": "tableview",
						"key": "customer.verifications",
						"title": "",
						"transpose": true,
						"selectable": false,
						"editable": false,
						"tableConfig": {
							"searching": false,
							"paginate": false,
							"pageLength": 10,
						},
						getColumns: function() {
							return [{
								"title": "Contact Person Name",
								"data": "referenceFirstName"
							}, {
								"title": "Contact Number",
								"data": "mobileNo",
							}, {
								"title": "Occupation",
								"data": "occupation"
							}, {
								"title": "Address",
								"data": "address"
							}];
						},
						getActions: function() {
							return [];
						}
					}, {
						"type": "tableview",
						"key": "customer.verifications",
						"title": "Reference Check",
						"transpose": true,
						"selectable": false,
						"editable": false,
						"tableConfig": {
							"searching": false,
							"paginate": false,
							"pageLength": 10,
						},
						getColumns: function() {
							return [{
								"title": "How long have you know the Applicant(years)?",
								"data": "knownSince"
							}, {
								"title": "Relationship with Applicant",
								"data": "relationship"
							}, {
								"title": "Opinion on Applicant's Business",
								"data": "opinion"
							}, {
								"title": "What is the curent financial status of the Applicant?",
								"data": "financialStatus",
							}, {
								"title": "Referer Response",
								"data": "customerResponse"
							}];
						},
						getActions: function() {
							return [];
						}
					}]
				}]
			}, {
				"type": "box",
				"readonly": true,
				"colClass": "col-sm-12",
				"title": "VIEW_UPLOADS",
				"items": [{
					"type": "section",
					"html": '<div style="overflow-x:scroll"><sf-decorator style="float:left" ng-repeat="item in form.items" form="item"></sf-decorator></div>',
					"items": [{
							"type": "grid",
							"orientation": "vertical",
							"items": [{
								"key": "customer.identityProofImageId",
								"type": "file",
								"notitle": true,
								"preview": "pdf",
								"using": "scanner"
							}, {
								"type": "section",
								"html": '<div style="text-align:center">KYC - PAN Card</div>'
							}]
						}, {
							"type": "grid",
							"orientation": "vertical",
							"items": [{
								"key": "customer.addressProofImageId",
								"type": "file",
								"notitle": true,
								"preview": "pdf",
								"using": "scanner"
							}, {
								"type": "section",
								"html": '<div style="text-align:center">KYC - Aadhar</div>'
							}]
						}, {
							"type": "grid",
							"orientation": "vertical",
							"items": [{
								"key": "customer.houseVerificationPhoto",
								"notitle": true,
								"type": "file",
								"fileType": "image/*"
							}, {
								"type": "section",
								"html": '<div style="text-align:center">House</div>'
							}]
						}
						/*, {
												"type": "grid",
												"orientation": "vertical",
												"items": [{
													"key": "customer.latitude",
													"notitle": true,
													"type": "geotag",
													"latitude": "customer.latitude",
													"longitude": "customer.longitude"
												}, {
													"type": "section",
													"html": '<div style="text-align:center">House Location</div>'
												}]
											}*/
					]
				}]
			}],

			schema: function() {
				return Enrollment.getSchema().$promise;
			},
			eventListeners: {
				"_scoresApplicant": function(bundleModel, model, params) {
					model._scores = params;
					model.psychometricScores = model._scores[14].sections;
					model.houseHoldPL = model._scores[7].sections;
					model.coapp_count = 0;
					model.psy_coapp_count = 1;
					switch (model.bundlePageObj.pageClass) {
						case 'applicant':
							model.household_data = model.houseHoldPL[model.houseHoldPL.length - 1];
							model.psy_data = model.psychometricScores[0];
							break;
						case 'co-applicant':
							model.household_data = model.houseHoldPL[model.coapp_count];
							model.coapp_count++;
							model.psy_data = model.psychometricScores[model.psy_coapp_count];
							model.psy_coapp_count++
								break;
					};
					model.psy_data.passOutOf=0;
					model.psy_data.psyTotalPara=0;
                     _.forEach(model.psy_data.data, function(data){
                          model.psy_data.psyTotalPara++;
                     	if(data.color_hexadecimal =="#50D050"){
                            model.psy_data.passOutOf++;
                     	}
             });

					if (model.bundlePageObj.pageClass == 'applicant' || model.bundlePageObj.pageClass == 'co-applicant') {
						model.household_data.data[0]['Total Incomes'] = model.household_data.data[0]['Salary from business'] + model.household_data.data[0]['Other Income/salaries'] + model.household_data.data[0]['Family Member Incomes'];
						model.household_data.data[0]['Total Expenses'] = model.household_data.data[0]['Expenses Declared or based on the educational expense whichever is higher'] + model.household_data.data[0]['EMI\'s of household liabilities'];
						model.household = [];
						model.household.push({
							income: model.household_data.data[0]['Total Incomes'],
							salaryFromBusiness: model.household_data.data[0]['Salary from business'],
							otherIncomeSalaries: model.household_data.data[0]['Other Income/salaries'],
							familyMemberIncomes: model.household_data.data[0]['Family Member Incomes'],
							Expenses: model.household_data.data[0]['Total Expenses'],
							declaredEducationExpense: model.household_data.data[0]['Expenses Declared or based on the educational expense whichever is higher'],
							emiHouseholdLiabilities: model.household_data.data[0]['EMI\'s of household liabilities'],
							netHouseholdIncome: model.household_data.data[0]['Net Household Income']
						});
						model.household_new = model.household[0];
					}



				},
				"business_customer": function(bundleModel, model, params) {
					model.enterpriseCustomerRelations = [];
					model.coApp_cnt = 1
					model.gua_cnt = 3;
					switch (model.bundlePageObj.pageClass) {
						case 'applicant':
							model.enterpriseCustomerRelations.push(params.enterpriseCustomerRelations[0]);
							break;
						case 'co-applicant':
							if (params.enterpriseCustomerRelations[model.coApp_cnt]) {
								model.enterpriseCustomerRelations.push(params.enterpriseCustomerRelations[model.coApp_cnt]);
								model.coApp_cnt++
							}
							break;
						case 'guarantor':
							if (params.enterpriseCustomerRelations[model.gua_cnt]) {
								model.enterpriseCustomerRelations.push(params.enterpriseCustomerRelations[model.gua_cnt]);
								model.gua_cnt++;
							}
							break;
					};
					model.business = params;
                    model.business.centreName = filterFilter(formHelper.enum('centre').data, {
                        value: model.business.centreId
                    })[0].name;

				}			},
			actions: {}
		}
	}
})