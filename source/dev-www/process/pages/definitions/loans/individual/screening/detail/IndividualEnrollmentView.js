define({
	pageUID: "loans.individual.screening.detail.IndividualEnrollmentView",
	pageType: "Engine",
	dependencies: ["$log", "$state", "Enrollment", "EnrollmentHelper", "SessionStore", "formHelper", "$q","irfProgressMessage","$stateParams","$state",
	"PageHelper", "Utils","PagesDefinition", "Queries", "CustomerBankBranch", "BundleManager", "$filter", "Dedupe","$resource","$httpParamSerializer","BASE_URL","searchResource"],
	$pageFn: function($log, $state, Enrollment, EnrollmentHelper, SessionStore, formHelper, $q,irfProgressMessage,$stateParams,$state,
	 PageHelper, Utils,PagesDefinition, Queries, CustomerBankBranch, BundleManager, $filter, Dedupe,$resource,$httpParamSerializer,BASE_URL, searchResource){
		return {
			"type": "schema-form",
			"title": "INDIVIDUAL_ENROLLMENT",
			"subTitle": "",
			initialize: function(model, form, formCtrl,bundlePageObj, bundleModel) {
				model.bundleModel = bundleModel;
				Enrollment.getCustomerById({id:model.customerId}).$promise.then(function(res) {
					model.customer = res;
					switch (bundlePageObj.pageClass) {
						case 'applicant':
							model.bundleModel.applicant = res;
						break;
						case 'co-applicant':
							model.bundleModel.coApplicants.push(res);
						break;
						case 'guarantors':
							model.bundleModel.guarantors.push(res);
						break;
					};

					model.custom_fields={   'family_fields':{},
										    'liability_fields':{},
										    'household_fields':{},
										    'bank_fields':{}
										};
										
		/*Auto_Custom fields -- START */
		    
			/*Family fields*/
					model.custom_fields.family_fields.family_member_count=model.customer.familyMembers.length;
					model.custom_fields.family_fields.dependent_family_member=0;
					model.custom_fields.family_fields.total_household_income=0;
					_.each(model.customer.familyMembers, function(member){
						if(member.incomes.length==0)
							model.custom_fields.family_fields.dependent_family_member++;
						else{
							_.each(member.incomes,function(income){
									model.custom_fields.family_fields.total_household_income+=income.incomeEarned;
							});
						}
					});
			/*Liability fields*/
				model.custom_fields.liability_fields.active_loans             = model.customer.liabilities.length;
				model.custom_fields.liability_fields.total_monthly_installment= 0;
				model.custom_fields.liability_fields.loan_from_bank           =0;
				model.custom_fields.liability_fields.loan_from_NBFC_MFI       =0;
				model.custom_fields.liability_fields.loan_from_others         =0;
				_.each(model.customer.liabilities, function(liability){
						model.custom_fields.liability_fields.total_monthly_installment          += liability.installmentAmountInPaisa;
						switch(liability.loanSource){
							case "BANK":
										model.custom_fields.liability_fields.loan_from_bank     += liability.loanAmountInPaisa;
										break;
							case "MFI/NBFC":
										model.custom_fields.liability_fields.loan_from_NBFC_MFI += liability.loanAmountInPaisa;
										break;          
							default:
									model.custom_fields.liability_fields.loan_from_others   += liability.loanAmountInPaisa;
									break;
		
					 };
				});

			/*Household Assets field*/
				model.custom_fields.household_fields.total_Assets =model.customer.physicalAssets.length; /* what assets i need to take*/
				model.custom_fields.household_fields.total_Value=0;
				_.each(model.customer.physicalAssets, function(Assets){
						model.custom_fields.household_fields.total_Value += Assets.ownedAssetValue;
				});

			/*Bank fields*/
				model.custom_fields.bank_fields.total_Deposit=0;
				model.custom_fields.bank_fields.total_Withdrawals=0;
				model.custom_fields.bank_fields.avg_deposit=0;
				model.custom_fields.bank_fields.avg_withdrawals=0;
				model.custom_fields.bank_fields.avg_bal_EMI_date;
				model.custom_fields.bank_fields.tot_accounts       =model.customer.customerBankAccounts.length;
				model.custom_fields.bank_fields.tot_checque_bounce =0;
				model.custom_fields.bank_fields.tot_EMI_bounce     =0;
				model.custom_fields.bank_fields.total_bankstatement=0;
				_.each(model.customer.customerBankAccounts, function(account){
						_.each(account.bankStatements, function(bankslips){
								model.custom_fields.bank_fields.total_Deposit      += bankslips.totalDeposits;
								model.custom_fields.bank_fields.total_Withdrawals   += bankslips.totalWithdrawals;
								model.custom_fields.bank_fields.total_bankstatement++;
								model.custom_fields.bank_fields.tot_checque_bounce += bankslips.noOfChequeBounced;
								model.custom_fields.bank_fields.tot_EMI_bounce     += bankslips.noOfEmiChequeBounced;

						});
				});
            if(model.custom_fields.bank_fields.total_bankstatement !=0){
				model.custom_fields.bank_fields.avg_deposit   =(model.custom_fields.bank_fields.total_Deposit/model.custom_fields.bank_fields.total_bankstatement);
				model.custom_fields.bank_fields.avg_withdrawals=(model.custom_fields.bank_fields.total_Withdrawals/model.custom_fields.bank_fields.total_bankstatement);
            }
		/*Cibil/highmark fields*/
			var endpoint = BASE_URL;
			var cibil = $resource(endpoint, null, {
								get:{
										method: 'GET',
										url: endpoint  + '/api/creditbureau/find'
									}                 
						 });

			cibil.get({customerId:model.customerId}).$promise.then(function(res){
				model.cibil_highmark=res;
			});

		/*Household fields */

		/*Reference Check fields*/
		model.custom_fields.REFERENCE_CHECK_RESPONSE='NA';
		var count_neg_response=0;
		  _.each(model.customer.verifications,function(verification){
		  	if (verification.customerResponse !='positive' && verification.customerResponse != null) {
		  		count_neg_response ++;
		  	}
		  })
		  if(count_neg_response>=1){
		  	model.custom_fields.REFERENCE_CHECK_RESPONSE='negative';
		  }
		  else{
		  	model.custom_fields.REFERENCE_CHECK_RESPONSE='positive';
		  }		
			 
	/*Auto_Custom field -- END*/

				});
			},
		
			form: [{
				"type":"box",
				"readonly":true,
				"colClass": "col-sm-12",
				"title":"PERSONAL_DETAILS",
				"overrideType": "default-view",
				"items":[{
					"type": "grid",
				    "orientation":"horizontal",
					"items": [{
						"type": "grid",
					    "orientation": "vertical",
						"items":[{
							"key":"customer.id",
							"title":"CUSTOMER_ID"
						},{
							"key":"customer.firstName",
						    "title":"FULL_NAME"
						},{
							"key":"customer.gender"
						},{
							"key":"customer.dateOfBirth"
						},{
						    "key":"customer.aadhaarNo"
						},{
							"key":"customer.panNo"
						},{
							"key":"customer.language",
					        "title":"PREFERRED_LANGUAGE"
						},{
					        "key":"customer.mobilePhone",
							"title":"Mobile No",
							"inputmode": "number",
                            "numberType": "tel"
						},{
							"key":"customer.email",
							"title":"EMAIL"
						},{
							"key":"",
							"title":"Present Address",
							"html":'<p>{{model.customer.doorNo}}<br>'+
										'{{model.customer.street}}<br>'+
										'{{model.customer.pincode}}<br>'+
										'{{model.customer.district}}<br>'+
										'{{model.customer.state}}<br>'+
								    '</p>'
						}]
			        },{
						"type":"grid",
						"orientation":"vertical",
						"items":[{
							"key":"customer.urnNo",
						    "title":"URN_NO"
						},{
						    "key":"customer.religion"
						},{
							"key":"customer.fatherFirstName",
							"title":"FATHER_FULL_NAME"
						},{
							"key":"customer.motherName",
							"title":"MOTHER_NAME"
					    },{
							"key":"customer.maritalStatus"
						},{
							"key":"customer.spouseFirstName",
							"title":"SPOUSE_FULL_NAME"
						},{
							"key":"customer.spouseDateOfBirth"
						}]
					},{
						"type":"grid",
						"orientation":"vertical",
						"items":[{
						    "key":"customer.photoImageId",
							"type":"file",
							"fileType":"image/*",
							"notitle":true
						}]

					}]
				}]
			},{
				"type":"box",
				"readonly":true,
				"colClass":"col-sm-12",
				"overrideType": "default-view",
				"title":"Family",
				"items":[/*{
					"type":"grid",
					"orientation":"vertical",
					"items":[*/{
						"type":"grid",
						"orientation":"horizontal",
						"items":[{
							"type":"grid",
							"orientation":"vertical",
							"items":[{
								"key":"custom_fields.family_fields.family_member_count",
								"title":"No of Family members"
							},{
								"key":"custom_fields.family_fields.dependent_family_member",
								"title":"no of dependent members"
							}]
						},{
							"type":"grid",
							"orientation":"vertical",
							"items":[{
								"key":"custom_fields.family_fields.total_household_income",
								"type": "amount",
								"title":"Total household income"
							},{
								"key":"customer.financialSummaries[].householdExpenses",
								"type":"amount",
								"title":"Declared Household Expanditure"
							}]
						}]
					}/*]
				}*/,{
					"type":"expandablesection",
					"items":[{
						"type": "tableview",
						"key": "customer.familyMembers",
						"title": "",
						"selectable": false,
						"editable": false,
						"tableConfig": {
							"searching": false,
							"paginate": false,
							"pageLength": 10,
						},
						getColumns: function(){
							return [{
								"title": "FULL_NAME",
								"data": "familyMemberFirstName"
							},{
								"title": "Relationship",
								"data": "relationShip"
							},{
								"title": "Education Status",
								"data": "educationStatus"
							},{
								"title":"Annual Education Fee",
								"data":"anualEducationFee"
							},{
								"title": "Income Source",
								"data": "familyMemberFirstName",
							        render: function(data, type, full, meta) {
											if (full.incomes[0])
											    return full.incomes[0].incomeSource;
											    return "NA";
							         }
							},{
								"title": "INCOME",
								"data": "familyMemberFirstName",
									render: function(data, type, full, meta) {
										if (full.incomes[0])
											return full.incomes[0].incomeEarned;
											return "NA";
													}
							}];
						},
						getActions: function() {
							return [];
						}
					}]
			    }]
		    },{
				"type":"box",
				"readonly":true,
				"colClass":"col-sm-12",
				"overrideType": "default-view",
				"title":"RELATIONSHIP_TO_BUSINESS",
				"items":[{
					"type":"grid",
					"orientation":"vertical",
					"items":[{
						"key":"customer.enterpriseCustomerRelations[].relationshipType",
						"title":"Relationship to Business"
					},{
						"key":"",
						"title":"Experience in Business"

					},
					{
						"key":"customer.enterpriseCustomerRelations[].businessInvolvement",
						"title":"Business Involement"
					},{
						"key":"customer.enterpriseCustomerRelations[].partnerOfAnyOtherCompany",
						"title":"Partner of any other Business"
					}]
				}]
			},{
				"type":"box",
				"readonly":true,
				"colClass":"col-sm-12",
				"overrideType": "default-view",
				"title":"HOUSEHOLD_LIABILITIES",
				"condition":"model.custom_fields.liability_fields.active_loans !=0",
				"items":[{
					"type":"grid",
					"orientation":"vertical",
					"items":[/*{
						"type":"grid",
						"orientation":"horizontal",
						"items":[*/{
							"type":"grid",
							"orientation":"vertical",
							"items":[{
								"key":"custom_fields.liability_fields.active_loans",
								"title":"No of Active Loans"
							},{
								"key":"custom_fields.liability_fields.total_monthly_installment",
								"title":"Total monthly instalments"
							},{
								"key":"",
								"title":"OUTSTANDING_AMOUNT"
							}]

						},{
							"type":"grid",
							"orientation":"vertical",
							"items":[{
								"key":"custom_fields.liability_fields.loan_from_bank",
								"title":"Total loan amount from Banks"

							},{
								"key":"custom_fields.liability_fields.loan_from_NBFC_MFI",
								"title":"Total loan amount from MFI/NBFC"

							},{
								"key":"custom_fields.liability_fields.loan_from_others",
								"title":"Total loan amount from others"

							}]

						}]
					/*}]*/
				},{
					"type":"expandablesection",
					"items":[{
						"type": "tableview",
						"key": "customer.liabilities",
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
								"title": "Loan Type",
								"data": "loanType"
							},{
								"title": "loan_source",
								"data": "loanSource"
							},{
								"title": "loan Amount",
								"data": "loanAmountInPaisa",
								"type":"amount"
							},{
								"title": "Instalment Amount",
								"data": "installmentAmountInPaisa"
							},{
                                "key": "customer.liabilities[].outstandingAmountInPaisa",
                                "type": "amount",
                                "title": "OUTSTANDING_AMOUNT"                                       
							},{
								"title":"START_DATE",
								"type":"date",
								"data":"startDate"
							},{
								"title":"MATURITY_DATE",
								"data":"maturityDate"
							},{
                                "key": "customer.liabilities[].noOfInstalmentPaid",
                                "type": "number",
                                "title": "NO_OF_INSTALLMENT_PAID"
                            },
							{
								"title":"Frequency of Instalments",
								"data":"frequencyOfInstallment"
							},{
                                "title":"Loan_Purpose",
                                "data":"liabilityLoanPurpose"
                                           
                            },{
                                "data":"interestOnly",
                                "title":"INTEREST_ONLY"
                            },{
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
			},
			{
				"type":"box",
				"readonly":true,
				"colClass":"col-sm-12",
				"overrideType": "default-view",
				"title":"HOUSEHOLD ASSETS",
				"condition":"model.custom_fields.household_fields.total_Assets !=0",		
				"items":[{
					"type":"grid",
					"orientation":"vertical",
					"items":[{
						"type":"grid",
						"orientation":"horizontal",
						"items":[{
							"type":"grid",
							"orientation":"vertical",
							"items":[{
								"key":"custom_fields.household_fields.total_Assets",
								"title":"Total_Assets"
							}]
						},{
							"type":"grid",
							"orientation":"vertical",
							"items":[{
								"key":"custom_fields.household_fields.total_Value",
								"title":"Total_Value"
							}]
						}]
					}]
				},{
					"type":"expandablesection",
					"items":[{
						"type": "tableview",
						"key": "customer.physicalAssets",
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
								"title": "ASSET_TYPE",
								"data": "nameOfOwnedAsset"
							},{
								"title":"REGISTERED_OWNER",
								"data":"registeredOwner"

							},{
								"title": "VALUE_OF_THE_ASSET",
								"data": "ownedAssetValue"
							}];
						},
						getActions: function() {
							return [];
						}
					}]
				}]
			},
			{
				"type":"box",
				"readonly":true,
				"colClass": "col-sm-12",
				"overrideType": "default-view",
				"title":"BANK ACCOUNT DETAILS",
				"condition":"model.customer.customerBankAccounts.length != 0",
				"items":[{
					"type":"grid",
					"orientation":"vertical",
					"items":[{
					    "type":"grid",
					    "orientation":"horizontal",
					    "items":[{
						    "type":"grid",
						    "orientation":"vertical",
						    "items":[{
							    "key":"custom_fields.bank_fields.avg_deposit",
							    "title":"Average Monthly Deposit",
							    "type":"amount"
						    },{
							    "key":"custom_fields.bank_fields.avg_withdrawals",
							    "title":"Average Monthly Withdrawals",
							    "type":"amount"
						    },{
							    "key":"",
							    "title":"Average Monthly Balances",
							    "type":"amount"
						    }]
					    },{
						    "type":"grid",
						    "orientation":"vertical",
						    "items":[{
							    "key":"custom_fields.bank_fields.tot_accounts",
							    "title":"Total no of Account"
						    },{
							    "key":"custom_fields.bank_fields.tot_checque_bounce",
							    "title":"Total no of Cheque Bounce"
						    },{
							    "key":"custom_fields.bank_fields.tot_EMI_bounce",
						      	"title":"Total no EMI Bounce"
						    }]
					    }]
				    }]
			    },{
				    "type":"expandablesection",
				    "items":[{
					    "type": "tableview",
					    "key": "customer.customerBankAccounts",
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
							    "title": "Bank Name",
							    "data": "customerBankName"
						    },{
							    "title":"Branch Name",
							    "data":"customerBankBranchName"
						    },{
							    "title": "IFSC Code",
							    "data": "ifscCode"
						    },{
							    "title": "Account Name",
							    "data": "customerNameAsInBank"
						    },{
							    "title": "Account Number",
							    "data": "accountNumber",
							    "type": "password",
                                "inputmode": "number",
                                "numberType": "tel"
						    },{
							    "title": "Account Type",
							    "data": "accountType"
						    },{
							    "title":"BANKING_SINCE",
							    "data":"bankingSince"

						    },{
							    "title":"NET_BANKING_AVAILABLE",
							    "data":"netBankingAvailable"
						    },{
							    "title": "Limit",
							    "data": "limit"
						    },{
                                "data": "bankStatements[].bankStatementPhoto",
                                "type": "file",
                                "required": true,
                                "title": "BANK_STATEMENT_UPLOAD",
                                "fileType":"application/pdf",
                                "category": "CustomerEnrollment",
                                "subCategory": "IDENTITYPROOF",
                                "using": "scanner"
                            }];
					    },
					    getActions: function() {
						    return [];
					    }
				    }]
			    }]
		    },{
			    "type":"box",
			    "colClass":"col-sm-12",
			    "overrideType": "default-view",
			    "title":"CIBIL_HIGHMARK",
			    "readonly":true,
			    "items":[{
					"type":"grid",
					"orientation":"horizontal",
					"items":[{
						"type":"grid",
						"orientation":"vertical",
						"items":[{
							"key":"cibil_highmark.Cibil.cibilScore[].score",
							"title":"CIBIL Score"
						},{
							"key":"",
							"title":"Active Accounts"
						},{
							"key":"cibil_highmark.Cibil.cibilLoanSummaryInfo[].overDueAccounts",
							"title":"Overdue Accounts"
						},{
							"key":"",
							"title":"Sanctioned Amount"
						},{
							"key":"cibil_highmark.Cibil.cibilLoanSummaryInfo[].currentBalance",
							"title":"Current Balance"
						},{
							"key":"cibil_highmark.Cibil.cibilLoanSummaryInfo[].amountOverDue",
							"title":"Overdue Balance"
						},{
							"key":"",
							"title":"Report"
						}]
					},{
					    "type":"grid",
						"orientation":"vertical",
						"items":[{
							"key":"cibil_highmark.highMark.highmarkScore",
							"title":"Highmark Score"
						},{
							"key":"",
							"title":"Active Accounts"
						},{
							"key":"",
							"title":"Overdue Account"
						},{
							"key":"",
							"title":"Total Current Balance"
						},{
							"key":"",
							"title":"Amount Disbursed"
						},{
							"key":"",
							"title":"Report"
						}]
					}]
				}]
		    },
		    {
				"type": "box",
				"colClass": "col-sm-12",
				"title": "Psychometric Scores",
				"condition": "model.currentStage != 'ScreeningReview'",
				"items": [{
					"type": "section",
					"colClass": "col-sm-12",
					"html":
						'<div ng-init="_scores=model.psychometricScores">'+
	                    '<table class="table table-responsive">'+
		                '<tbody style="border:0px;">'+
			            '<tr>'+
				        '<th>Parameter Name</th>'+
				        '<th>Cut Off Score</th>'+
				        '<th colspan="2" ng-repeat="_score in _scores">{{_score.relation_detail}}</th>'+
			            '</tr>'+
			            '<tr ng-repeat=" (key, value) in _scores[0].data" ng-init="parameterIndex=$index">'+
				        '<td >{{key}}</td>'+
				        '<td >{{value["Cut Off Score"]}}</td>' + 
				        '<td ng-repeat-start="_score in _scores"> <span class="square-color-box" style="background:{{_score.data[key].color_hexadecimal}}"> </span></td>'+
			            '<td ng-repeat-end>{{_score.data[key].Score}}</td></tr>'+
			            '<tr ng-repeat=" (key, value) in _scores[0].summary" ng-init="parameterIndex=$index">'+
				        '<td ng-style = "{\'font-weight\': \'bold\'}">{{key}}</td>'+
				        '<td ></td>' + 
				        '<td ng-repeat-start="_score in _scores"></td>' + 
				        '<td ng-repeat-end > {{_score.summary[key]}}</td></tr>'+
		                '</tbody>'+
	                    '</table>'+
                        '</div>'
				}]
		    },{
			    "type": "box",
				"colClass": "col-sm-12",
				"title": "Household P&L Statement",
				"items": [{
					"type": "section",
					"colClass": "col-sm-12",
					"html":/*'<div ng-repeat="i in model.household.length" >'+*/'<div ng-init="household = model.household">' +
						'<table class="table">'+
		                '<colgroup>'+
			            '<col width="30%"> <col width="40%"> <col width="30%">'+
		                '</colgroup>'+
		                '<tbody>'+
			            '<tr class="table-sub-header"> <th>{{"INCOME" | translate}}</th> <th></th> <th>{{household.income | irfCurrency}}</th> </tr>'+
			            '<tr> <td></td> <td>{{"SALARY_FROM_BUSINESS" | translate}}</td> <td>{{household.salaryFromBusiness}}</td> </tr>'+
			            '<tr> <td></td> <td>{{"OTHER_INCOME_SALARIES" | translate}}</td> <td>{{household.otherIncomeSalaries | irfCurrency}}</td> </tr>'+
			            '<tr> <td></td> <td>{{"FAMILY_MEMBER_INCOMES" | translate}}</td> <td>{{household.familyMemberIncomes | irfCurrency}}</td> </tr>'+
			            '<tr class="table-sub-header"> <th>{{"EXPENSES" | translate}}</th> <th></th> <th>{{household.Expenses | irfCurrency}}</th> </tr>'+
			            '<tr> <td></td> <td>{{"DECLARED_EDUCATIONAL_EXPENSE" | translate}}</td> <td>{{household.declaredEducationExpense | irfCurrency}}</td> </tr>'+
			            '<tr> <td></td> <td>{{"EMI_HOUSEHOLD_LIABILITIES" | translate}}</td> <td>{{household.emiHouseholdLiabilities | irfCurrency}}</td> </tr>'+
			            '<tr class="table-bottom-summary"> <td>{{"NET_HOUSEHOLD_INCOME" | translate}}</td> <td></td> <td>{{household.netHouseholdIncome | irfCurrency}}</td> </tr>'+
		                '</tbody>'+
	                    '</table>' +
	                    '</div>' /*+
							'</div>'*/
				}]
		    },
		    {
			    "type":"box",
			    "colClass":"col-sm-12",
			    "overrideType": "default-view",
			    "readonly":true,
			    "title":"Refrrence Check",
		        "items":[{
					"type":"grid",
					"orientation":"vertical",
					"items":[{
						"type":"grid",
						"orientation":"horizontal",
						"items":[{
							"type":"grid",
							"orientation":"vertical",
							"items":[{
								"key":"custom_fields.REFERENCE_CHECK_RESPONSE",
								"title":"Reference Check Responses"
							}]
						},]
					}]
				},
				{
				"type":"expandablesection",
				"items":[{
					"type": "tableview",
					"key": "customer.verifications",
					"title": "",
					"selectable": false,
					"editable": false,
					"tableConfig": {
						"searching": false,
					    "paginate": false,
						"pageLength": 10,
					},
				    getColumns: function(){
					    return [{
							"title": "Contact Person Name",
						    "data": "referenceFirstName"
						},{
							"title": "Contact Number",
							"data": "mobileNo",
						},{
							"title":"Occupation",
							"data":"occupation"
						},{
							"title":"Address",
							"data":"address"
						}];
					},
					getActions: function() {
						return [];
					}
				},{
					"type": "tableview",
					"key": "customer.verifications",
					"title": "Reference Check",
					"selectable": false,
					"editable": false,
					"tableConfig": {
						"searching": false,
						"paginate": false,
						"pageLength": 10,
					},
					getColumns: function(){
						return [{
							"title": "How long have you know the Applicant(years)?",
							"data": "knownSince"
						},{
						    "title": "Relationship with Applicant",
							"data": "relationship"
						},{
							"title": "Opinion on Applicant's Business",
							"data": "opinion"
						},{
							"title": "What is the curent financial status of the Applicant?",
							"data": "financialStatus",
						},{
						    "title":"Referer Response",
							"data":"customerResponse"
						}];
					},
					getActions: function() {
						return [];
					}  
				}]
			}]
		    },{
			    "type":"box",
			    "colClass":"col-sm-12",
			    "overrideType":"default-view",
			    "title":"VIEW_UPLOADS",
			    "items":[{
				    "type":"grid",
				    "orientation":"horizontal",
				    "items":[{
					    "type":"grid",
					    "orientation":"vertical",
					    "items":[{
                            "key":"customer.identityProofImageId",
                            "type":"file",
                            "notitle":true,
                            /*"fileType":"application/pdf",*/
                            "preview":"pdf",
                            "using": "scanner"
                        },{
                            "key":"customer.identityProofNo",
                            "type":"barcode",
                            onCapture: function(result, model, form) {
                                model.customer.identityProofNo = result.text;
                            }
                        }]
				    },{
					    "type":"grid",
					    "orientation":"horizontal",
					    "items":[{
                            "key":"customer.addressProofImageId",
                            "type":"file",
                            "notitle":true,
                            /*fileType:"application/pdf",*/
                            "preview":"pdf",
                            "using": "scanner"
                        },{
                            "key":"customer.addressProofNo",
                            "type":"barcode",
                            onCapture: function(result, model, form) {
                                model.customer.addressProofNo = result.text;
                            }
                        }]
				    },{
					    "type":"grid",
					    "orientation":"horizontal",
					    "items":[{
						    "key":"customer.houseVerificationPhoto",
						    "notitle":true,
                            "type":"file",
                            "fileType":"image/*"
					    }]
				    }]
			    }]
		    }],

		schema: function() {
			return Enrollment.getSchema().$promise;     
		},
		eventListeners: {
				"_scoresApplicant": function(bundleModel, model, params) {
					model._scores = params;
					model.psychometricScores=model._scores[14].sections;
					model.houseHoldPL = model._scores[7].sections;
					model.household=[];

		if(model.houseHoldPL && model.houseHoldPL.length){
			/*for (var i=0; i<model.houseHoldPL.length; i++){*/
				model.household.push({/*
					income : model.houseHoldPL[0].data[0]['Total Incomes'],*/
					salaryFromBusiness  : model.houseHoldPL[0].data[0]['Salary from business'],
					otherIncomeSalaries : model.houseHoldPL[0].data[0]['Other Income/salaries'],
					familyMemberIncomes : model.houseHoldPL[0].data[0]['Family Member Incomes'],/*
					Expenses : model.houseHoldPL[i].data[0]['Total Expenses'],*/
					declaredEducationExpense : model.houseHoldPL[0].data[0]['Expenses Declared or based on the educational expense whichever is higher'],
					emiHouseholdLiabilities : model.houseHoldPL[0].data[0]['EMI\'s of household liabilities'],
					netHouseholdIncome : model.houseHoldPL[0].data[0]['Net Household Income']

				});
				$log.info(model.household)
			/*}*/
		}
				}
		},
		actions: {}
	}
}
})