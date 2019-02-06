define(['perdix/domain/model/customer/EnrolmentProcess', "perdix/domain/model/loan/LoanProcess"], function (EnrolmentProcess, LoanProcess) {
    EnrolmentProcess = EnrolmentProcess['EnrolmentProcess'];
    LoanProcess = LoanProcess['LoanProcess']
    return {
        pageUID: "kgfs.customer.EnterpriseEnrolment2",
        pageType: "Engine",
        dependencies: ["$log", "$q", "Enrollment", "IrfFormRequestProcessor", 'EnrollmentHelper', 'PageHelper', 'formHelper', "elementsUtils",
            'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "$filter", "$injector", "UIRepository", "LoanAccount"],

        $pageFn: function ($log, $q, Enrollment, IrfFormRequestProcessor, EnrollmentHelper, PageHelper, formHelper, elementsUtils,
            irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, BundleManager, $filter, $injector, UIRepository, LoanAccount) {

            var getDialySalesDetails = function (value, model, row, day) {
                model.customer.enterprise.weeklySale = 0;
                for (i in model.customer.enterpriseDailySale) {
                    dailysales = model.customer.enterpriseDailySale[i];
                    if (dailysales.seasonType != row.seasonType && dailysales[day]) {
                        delete dailysales[day]
                    }
                    dailysales.total = (dailysales.mon ? dailysales.mon : 0) + (dailysales.tue ? dailysales.tue : 0) + (dailysales.wed ? dailysales.wed : 0) + (dailysales.thu ? dailysales.thu : 0) +
                        (dailysales.fri ? dailysales.fri : 0) + (dailysales.sat ? dailysales.sat : 0) + (dailysales.sun ? dailysales.sun : 0)
                    model.customer.enterprise.weeklySale = model.customer.enterprise.weeklySale + dailysales.total;
                    model.customer.enterprise.monthlySale = model.customer.enterprise.weeklySale * 4;
                }
                averageMonthlySale(model);
            }
            var getEnterpriseProductDetails = function (model) {
                model.customer.enterprise.totalDailySales = 0
                model.customer.enterprise.totalDailyCost = 0
                for (i in model.customer.enterpriseProductSales) {
                    productSale = model.customer.enterpriseProductSales[i];
                    if (productSale.salePrice && productSale.quantity) {
                        productSale.totalSale = productSale.salePrice * productSale.quantity
                    }
                    if (productSale.costPrice && productSale.quantity) {
                        productSale.totalCost = productSale.costPrice * productSale.quantity
                    }
                    if (productSale.totalSale) {
                        model.customer.enterprise.totalDailySales = productSale.totalSale + model.customer.enterprise.totalDailySales
                        model.customer.enterprise.totalWeeklySales = model.customer.enterprise.totalDailySales * 4;
                        model.customer.enterprise.totalMonthlySales = model.customer.enterprise.totalDailySales * 30;
                        grossmargin = ((model.customer.enterprise.totalDailySales - model.customer.enterprise.totalDailyCost) / model.customer.enterprise.totalDailySales);
                        model.customer.enterprise.grossMarginSales = grossmargin;
                    }
                    if (productSale.totalCost) {
                        model.customer.enterprise.totalDailyCost = productSale.totalCost + model.customer.enterprise.totalDailyCost
                        model.customer.enterprise.totalWeeklyCost = model.customer.enterprise.totalDailyCost * 4;
                        model.customer.enterprise.totalMonthlyCost = model.customer.enterprise.totalDailyCost * 30;
                        grossmargin = ((model.customer.enterprise.totalDailySales - model.customer.enterprise.totalDailyCost) / model.customer.enterprise.totalDailySales);
                        model.customer.enterprise.grossMarginCost = grossmargin;
                    }
                }
                averageMonthlySale(model);
            }

            var getAnnualSales = function (value, model, row, month) {
                model.customer.enterprise.avgMonthlySales = 0;
                for (i in model.customer.monthlySale) {
                    monthlySales = model.customer.monthlySale[i];
                    if (monthlySales.seasonType != row.seasonType && monthlySales[month]) {
                        delete monthlySales[month]
                    }
                    monthlySales.total = (monthlySales.January ? monthlySales.January : 0) + (monthlySales.Feburary ? monthlySales.Feburary : 0) + (monthlySales.March ? monthlySales.March : 0) + (monthlySales.April ? monthlySales.April : 0) +
                        (monthlySales.May ? monthlySales.May : 0) + (monthlySales.June ? monthlySales.June : 0) + (monthlySales.July ? monthlySales.July : 0) + (monthlySales.August ? monthlySales.August : 0) + (monthlySales.September ? monthlySales.September : 0) + (monthlySales.October ? monthlySales.October : 0) + (monthlySales.November ? monthlySales.November : 0) + (monthlySales.December ? monthlySales.December : 0);
                    model.customer.enterprise.avgMonthlySales = model.customer.enterprise.avgMonthlySales + monthlySales.total;
                    model.customer.enterprise.avgAnnualSales = model.customer.enterprise.avgMonthlySales * 4;
                }
                averageMonthlySale(model);
            }

            var averageMonthlySale = function (model) {
                data = model.customer.enterprise;
                data.monthlySalesCal = ((data.initialEstimateMonthlySale ? data.initialEstimateMonthlySale : 0) + (data.monthlySale ? data.monthlySale : 0) + (data.totalMonthlySales ? data.totalMonthlySales : 0) + (data.avgMonthlySales ? data.avgMonthlySales : 0)) / 4;
                data.costOfGoodsSold = data.monthlySalesCal * (data.grossMarginCost ? data.grossMarginCost : 0)
                data.grossProfit = data.monthlySalesCal - data.costOfGoodsSold;
                // data.netBusinessIncome = 
            }
            var monthlySurpluse = function (model) {
                model.customer.enterprise.totalMonthlySurplus = ((model.customer.enterprise.netBusinessIncome ? model.customer.enterprise.netBusinessIncome : 0) + (model.customer.enterprise.additionalIncomeConsidered ? model.customer.enterprise.additionalIncomeConsidered : 0) - (model.customer.enterprise.totalPersonalExpense ? model.customer.enterprise.totalPersonalExpense : 0) - (model.customer.enterprise.totalEmiAmount ? model.customer.enterprise.totalEmiAmount : 0))
                model.customer.enterprise.emiEligibility = (model.customer.enterprise.totalMonthlySurplus * (model.customer.enterprise.enterdebtServiceRatio ? model.customer.enterprise.enterdebtServiceRatio : 0));
                model.customer.enterprise.finalEMi = Math.min((model.customer.enterprise.emiEligibility ? model.customer.enterprise.emiEligibility : 0), (model.customer.enterprise.affordableEMi ? model.customer.enterprise.affordableEMi : 0));
                var x = (((Math.pow((model.customer.enterprise.proposedROI / 12), model.customer.enterprise.loanTenureInMonths)) + 1) * (model.customer.enterprise.finalEMi) + 1)
                var y = ((Math.pow((model.customer.enterprise.proposedROI / 12), model.customer.enterprise.loanTenureInMonths)) + 1)
                model.customer.enterprise.eligibleLoanAmount =
                    "TotalMonthlySurplus.sanctionedLoanAmount"
            }
            var computeEstimatedEmi = function (model) {
                if (model.loanAccount.loanAmountRequested == '' || model.loanAccount.interestRate == '' || model.loanAccount.frequencyRequested == '' || model.loanAccount.tenure == '')
                    return;
                var principal = model.loanAccount.loanAmount;
                var interest = model.loanAccount.interestRate / 100 / 12;
                var payments = model.loanAccount.tenure;
                var x = Math.pow(1 + interest, payments);
                var monthly = (principal * x * interest) / (x - 1);
                if (!isNaN(monthly) &&
                    (monthly != Number.POSITIVE_INFINITY) &&
                    (monthly != Number.NEGATIVE_INFINITY)) {
                    model.loanAccount.estimatedEmi = Math.ceil(monthly);
                }
                else {
                    model.loanAccount.estimatedEmi = "";
                }
            }
            var computeTotalMonthlySurpluse = function (value, form, model) {
                var businessIncome = 0;
                var businessExpense = 0;
                if (model.customer.incomeThroughSales) {
                    for (i in model.customer.incomeThroughSales) {
                        businessIncome = businessIncome + (model.customer.incomeThroughSales[i].amount ? model.customer.incomeThroughSales[i].amount : 0);
                    }
                }
                if (model.customer.rawMaterialExpenses) {
                    for (i in model.customer.rawMaterialExpenses) {
                        businessExpense = businessExpense + (model.customer.rawMaterialExpenses[i].amount ? model.customer.rawMaterialExpenses[i].amount : 0);
                    }
                }
                model.customer.totalMonthlySurplus = businessIncome - businessExpense;
                model.customer.debtServiceRatio = (businessExpense / businessIncome) * 100;
                monthlySurpluse(model);
            }

            var getBusinessExpenseData = function (value, model, row) {
                model.customer.enterprise.totalBusinessExpenses = 0;
                monthlyBusinessExpense = model.customer.monthlyBusinessExpense;
                total = 0;
                for (i in monthlyBusinessExpense) {
                    model.customer.enterprise.totalBusinessExpenses = model.customer.enterprise.totalBusinessExpenses + (monthlyBusinessExpense[i].annualExpenses ? monthlyBusinessExpense[i].annualExpenses : 0);
                }
                model.customer.enterprise.netBusinessIncome = model.customer.enterprise.monthlySalesCal - model.customer.enterprise.totalBusinessExpenses;
                model.customer.enterprise.netBusinessIncomeGrossMargin = model.customer.enterprise.netBusinessIncome / model.customer.enterprise.grossMarginSales;
                monthlySurpluse(model);
            }

            var getPersonalExpenses = function (value, model, row) {
                model.customer.enterprise.totalPersonalExpense = 0;
                personalExpense = model.customer.personalExpenses;
                total = 0;
                for (i in personalExpense) {
                    model.customer.enterprise.totalPersonalExpense = model.customer.enterprise.totalPersonalExpense + (personalExpense[i].annualExpenses ? personalExpense[i].annualExpenses : 0);
                }
                monthlySurpluse(model);
            }
            var getOtherBusinessIncomeDet = function (value, model, row) {
                model.customer.enterprise.totalMonthlyAdditionIncome = 0;
                otherExpenses = model.customer.otherBusinessIncomes;
                for (i in otherExpenses) {
                    model.customer.enterprise.totalMonthlyAdditionIncome = model.customer.enterprise.totalMonthlyAdditionIncome + (otherExpenses[i].amount ? otherExpenses[i].amount : 0);
                }
                model.customer.enterprise.additionalIncomeConsidered = Math.min(model.customer.enterprise.totalMonthlyAdditionIncome, model.customer.enterprise.netBusinessIncome);
                monthlySurpluse(model);
            }
            var overridesFields = function (bundlePageObj) {
                return {
                    "ContactInformation.pincode": {
                        "title": "pincode",
                        "required": true,
                        "resolver": "PincodeLOVConfiguration"
                    },
                    "EnterpriseInformation.branchName": {
                        "readonly": true,
                        "required": true,
                        "orderNo": 10
                    },
                    "EnterpriseInformation.centreId": {
                        "type": "text",
                        "title": "CENTRE_ID",
                        "readonly": true,
                        "required": true,
                        "orderNo": 30
                    },
                    "EnterpriseInformation.centreName": {
                        "type": "text",
                        "title": "CENTRE_Name",
                        "readonly": true,
                        "required": true,
                        "orderNo": 20
                    },
                    "EnterpriseInformation.urnNo": {
                        "condition": true,
                        "required": true,
                        "type": "text",
                        "orderNo": 40
                    },
                    "EnterpriseInformation.firstName": {
                        "required": true,
                        "title": "NAME_OF_BUSINESS",
                        "orderNo": 50
                    },
                    "EnterpriseInformation.companyOperatingSince": {
                        "required": true,
                        "orderNo": 60
                    },
                    "EnterpriseInformation.latitude": {
                        "readonly": true,
                        "required": true,
                        "orderNo": 70
                    },
                    "EnterpriseInformation.distanceFromBranch": {
                        //"readonly":true,
                        "required": true,
                        "orderNo": 80
                    },
                    "EnterpriseInformation.ownership": {
                        "required": true,
                        "orderNo": 90,
                        "enumCode": "business_in_present_area_since",
                    },
                    "EnterpriseInformation.businessConstitution": {
                        "orderNo": 100
                    },
                    "EnterpriseInformation.gstNumber": {
                        "orderNo": 110
                    },
                    "EnterpriseInformation.noOfPartners": {
                        "orderNo": 120
                    },
                    "EnterpriseInformation.companyRegistered": {
                        "required": true,
                        "orderNo": 130,
                        "type": "radios"
                    },
                    "EnterpriseInformation.enterpriseRegistrations": {
                        "required": true,
                        "orderNo": 140
                    },
                    "EnterpriseInformation.enterpriseDocuments": {
                        "orderNo": 150
                    },
                    "ContactInformation.mobilePhone": {
                        "required": true,
                        "orderNo": 160
                    },
                    "ContactInformation.landLineNo": {
                        "orderNo": 170
                    },
                    "ContactInformation.doorNo": {
                        "required": true,
                        "orderNo": 180
                    },
                    "ContactInformation.street": {
                        "orderNo": 190
                    },
                    "ContactInformation.landmark": {
                        "orderNo": 200
                    },
                    "ContactInformation.pincode": {
                        "required": true,
                        "orderNo": 210
                    },
                    "ContactInformation.locality": {
                        "orderNo": 220
                    },
                    "ContactInformation.villageName": {
                        "orderNo": 230
                    },
                    "ContactInformation.district": {
                        "orderNo": 240
                    },
                    "ContactInformation.state": {
                        "orderNo": 250
                    },
                    "BankAccounts.customerBankAccounts.ifscCode": {
                        "required": true,
                        "orderNo": 260
                    },
                    "BankAccounts.customerBankAccounts.customerBankName": {
                        "required": true,
                        "orderNo": 270
                    },
                    "BankAccounts.customerBankAccounts.customerBankBranchName": {
                        "required": true,
                        "orderNo": 280
                    },
                    "BankAccounts.customerBankAccounts.customerNameAsInBank": {
                        "required": true,
                        "orderNo": 290
                    },
                    "BankAccounts.customerBankAccounts.accountNumber": {
                        "required": true,
                        "orderNo": 300
                    },
                    "BankAccounts.customerBankAccounts.confirmedAccountNumber": {
                        "required": true,
                        "orderNo": 310,
                        "title": "CONFIRMED_ACCOUNT_NUMBER"
                    },
                    "BankAccounts.customerBankAccounts.accountType": {
                        "required": true,
                        "orderNo": 320
                    },
                    "BankAccounts.customerBankAccounts.bankingSince": {
                        "orderNo": 340
                    },
                    "BankAccounts.customerBankAccounts.bankStatementDocId": {
                        "orderNo": 330
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.startMonth": {
                        "orderNo": 340,
                        "required": false
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits": {
                        "title": "CUMULATIVE_DEPOSITE_AS_ON_MONTH_END",
                        "orderNo": 350
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.totalWithdrawals": {
                        "title": "CUMULATIVE_WITHDRAWALS_AS_ON_MONTH_END",
                        "orderNo": 360
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.closingBalance": {
                        "orderNo": 370,
                        "title": "BALANCE_AS_ON_MONTH_END"
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced": {
                        "orderNo": 380,
                        type: 'number'
                    },
                    "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced": {
                        "orderNo": 390
                    },
                    "Liabilities": {
                        "orderNo": 400
                    },
                    "Liabilities.liabilities.installmentAmountInPaisa": {
                        "required": true,
                        "orderNo": 430
                    },
                    "Liabilities.liabilities.loanSource": {
                        "orderNo": 410
                    },
                    "Liabilities.liabilities.loanAmountInPaisa": {
                        "orderNo": 420
                    },
                    "Liabilities.liabilities.startDate": {
                        "orderNo": 440
                    },
                    "Liabilities.liabilities.tenure": {
                        "orderNo": 450
                    }, // add in repo  
                    "Liabilities.liabilities.interestRate": {
                        "orderNo": 460,
                        "required": true
                    },
                    "Liabilities.liabilities.frequencyOfInstallment": {
                        "orderNo": 470,
                        "required": true
                    },
                    "Liabilities.liabilities.outstandingAmountInPaisa": {
                        "orderNo": 480
                    },
                    "Liabilities.liabilities.noOfInstalmentPaid": {
                        "orderNo": 490
                    },
                    "EnterpriseFinancials": {
                        "orderNo": 500,
                        "title": "OTHER_BUSINESS_INCOME_AND_EXPENSES"
                    },
                    "EnterpriseFinancials.incomeThroughSales": {
                        "orderNo": 510,
                        "title": "BUSINESS_INCOME",
                    },
                    "EnterpriseFinancials.incomeThroughSales.incomeType": {
                        "type": "select",
                        "enumcode": "businessIncomeType"
                    },
                    "EnterpriseFinancials.incomeThroughSales.amount": {
                        onChange: function (value, form, model) {
                            computeTotalMonthlySurpluse(value, form, model);
                        }
                    },
                    "EnterpriseFinancials.incomeThroughSales.frequency": {
                    },
                    "EnterpriseFinancials.incomeThroughSales.invoiceDocId": {

                    },
                    "EnterpriseFinancials.rawMaterialExpenses": {
                        "orderNo": 520,
                        "title": "BUSINESS_EXPENSE",
                    },
                    "EnterpriseFinancials.rawMaterialExpenses.rawMaterialType": {
                        "type": "select",
                        "enumcode": "businessExpenseType"
                    },
                    "EnterpriseFinancials.rawMaterialExpenses.amount": {
                        onChange: function (value, form, model) {
                            computeTotalMonthlySurpluse(value, form, model);
                        }
                    },
                    "EnterpriseFinancials.totalMonthlySurplus": {
                        "orderNo": 524,

                    },
                    "EnterpriseFinancials.debtServiceRatio": {
                        "orderNo": 528,
                    },
                    "PreliminaryInformation": {
                        "orderNo": 530
                    },
                    "PreliminaryInformation.loanAmountRequested": {
                        "orderNo": 540,
                        onChange: function (value, form, model) {
                            if (model.loanAccount.loanAmountRequested == '' || model.loanAccount.interestRate == '' || model.loanAccount.frequencyRequested == '' || model.loanAccount.tenure == '')

                                return;
                            var principal = model.loanAccount.loanAmount;
                            var interest = model.loanAccount.interestRate / 100 / 12;
                            //var payments;
                            var payments = model.loanAccount.tenure;

                            // Now compute the monthly payment figure, using esoteric math.
                            var x = Math.pow(1 + interest, payments);
                            var monthly = (principal * x * interest) / (x - 1);

                            // Check that the result is a finite number. If so, display the results.
                            if (!isNaN(monthly) &&
                                (monthly != Number.POSITIVE_INFINITY) &&
                                (monthly != Number.NEGATIVE_INFINITY)) {
                                model.loanAccount.estimatedEmi = round(monthly);
                            }
                            // Otherwise, the user's input was probably invalid, so don't
                            // display anything.
                            else {
                                model.loanAccount.estimatedEmi = "";
                            }
                        }
                    },
                    "PreliminaryInformation.tenure": {
                        "orderNo": 550
                    },
                    "PreliminaryInformation.interestRate": {
                        "orderNo": 560
                    },
                    "PreliminaryInformation.estimatedEmi": {
                        "orderNo": 570
                    },
                    "EstimatedSales": {
                        "orderNo": 590
                    },
                    "EstimatedSales.initialEstimateWeeklySale": {
                        "orderNo": 600,
                        onChange: function (value, form, model) {
                            model.customer.enterprise.initialEstimateMonthlySale = model.customer.enterprise.initialEstimateWeeklySale * 4;
                            averageMonthlySale(model);
                        }
                    },
                    "EstimatedSales.initialEstimateMonthlySale": {
                        "orderNo": 605
                    },
                    "BuyerDetails": {
                        "orderNo": 800
                    },
                    "BuyerDetails.buyerDetails.paymentFrequency": {
                        "type": "text"
                    },
                    "SuppliersDeatils": {
                        "orderNo": 820
                    }
                }
            }
            var repositoryAdditions = function (bundlePageObj) {
                return {
                    "EnterpriseInformation": {
                        "items": {
                            "distanceFromBranch": {
                                "key": "customer.distanceFromBranch",
                                "type": "select",
                                "enumCode": "loan_distance_from_branch",
                                "title": "DISTANCE_FROM_BRANCH",
                            },
                            "centreName": {
                                "key": "customer.centreName",
                                "type": "text",
                                "title": "CENTRE_NAME"
                            },
                            "branchName": {
                                "key": "customer.branchName",
                                "type": "text",
                                "title": "BRANCH_NAME",
                            },
                            "gstNumber": {
                                "key": "loanAccount.gstNumber",
                                "type": "text",
                                "title": "GST_NUMBER",
                            },
                            "enterpriseDocuments": {
                                "type": "array",
                                "title": "BUSINESS_DOCUMENT",
                                "key": "customer.enterpriseDocuments",
                                "startEmpty": true,
                                "items": {
                                    "udf1": {
                                        "title": "BUSINESS_TYPE",
                                        "type": "select",
                                        "enumCode": "businessType",
                                        "title": "BUSINESS_TYPE",
                                        "key": "customer.enterpriseDocuments[].udf1",
                                        "required": true
                                    },
                                    "udf2": {
                                        "key": "customer.enterpriseDocuments[].udf2",
                                        "title": "BUSINESS_ACTIVITY",
                                        "required": true,
                                        type: "select",
                                        enumCode: "businessActivity",
                                    },
                                    "udf3": {
                                        "key": "customer.enterpriseDocuments[].udf3",
                                        "title": "BUSINESS_SECTOR",
                                        "required": true,
                                        "title": "BUSINESS_SECTOR",
                                        "type": "select",
                                        "enumCode": "businessSector",
                                    },
                                    "udf4": {
                                        "title": "ITR_AVAILABLE",
                                        "type": "radios",
                                        "enumCode": "decisionmaker",
                                        "key": "customer.enterpriseDocuments[].udf4",
                                        "title": "INCOME_TAX_RETURN_AVAILABLE",
                                        "required": true
                                    }
                                }
                            }
                        }

                    },
                    "PreliminaryInformation": {
                        "type": "box",
                        "title": "PRELIMINARY_INFORMATION",
                        "items": {
                            "loanAmountRequested": {
                                "key": "loanAccount.loanAmountRequested",
                                "type": "amount",
                                "title": "REQUESTED_LOAN_AMOUNT"
                            },
                            "tenure": {
                                "key": "loanAccount.tenure",
                                "title": "DURATION_IN_MONTHS",
                                "required": true
                            },
                            "interestRate": {
                                "key": "loanAccount.interestRate",
                                "type": "number",
                                "required": true,
                                "title": "INTEREST_RATE"
                            },
                            "estimatedEmi": {
                                "key": "loanAccount.estimatedEmi",
                                "type": "amount",
                                "title": "ESTIMATED_EMI",
                            },
                        }
                    },
                    "EnterpriseFinancials": {
                        "items": {
                            "totalMonthlySurplus": {
                                "key": "customer.totalMonthlySurplus",
                                "type": "text",
                                "title": "TOTAL_MONTHLY_SURPLUS",
                            },
                            "debtServiceRatio": {
                                "key": "customer.debtServiceRatio",
                                "type": "text",
                                "title": "DEBT_SERVICE_RATIO",
                            }
                        }
                    },
                    "EstimatedSales": {
                        "type": "box",
                        "title": "Intial Estimate Weekly Sales",
                        "items": {
                            'initialEstimateWeeklySale': {
                                key: "customer.enterprise.initialEstimateWeeklySale",
                                title: "EstimatedWeeklySales",
                                "type": "number"
                            },
                            'initialEstimateMonthlySale': {
                                key: "customer.enterprise.initialEstimateMonthlySale",
                                title: "EstimmatedMonthlySales",
                                "type": "number"
                            }
                        }
                    },
                    "DailySales": {
                        "type": "box",
                        "orderNo": 620,
                        colClass: "col-sm-12",
                        "title": "DDaily_Sales",
                        "items": {
                            "enterpriseDailySale": {
                                key: "customer.enterpriseDailySale",
                                type: "datatable",
                                title: "Daily_Sales",
                                startEmpty: true,
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "columns": [
                                                {
                                                    prop: "seasonType",
                                                    type: "string",
                                                    name: "CYCLE"
                                                },
                                                {
                                                    prop: "mon",
                                                    type: "number",
                                                    name: "MON",
                                                    "readonly": true,
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'mon')
                                                    },
                                                },
                                                {
                                                    prop: "tue",
                                                    type: "number",
                                                    name: "TUE",
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'tue')
                                                    }
                                                },
                                                {
                                                    prop: "wed",
                                                    type: "number",
                                                    name: "WED",
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'wed')
                                                    }
                                                },
                                                {
                                                    prop: "thu",
                                                    type: "number",
                                                    name: "THU",
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'thu')
                                                    }
                                                },
                                                {
                                                    prop: "fri",
                                                    type: "number",
                                                    name: "FRI",
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'fri')
                                                    }
                                                },
                                                {
                                                    prop: "sat",
                                                    type: "number",
                                                    name: "SAT",
                                                    "readonly": true,
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'sat')
                                                    }
                                                },
                                                {
                                                    prop: "sun",
                                                    type: "number",
                                                    name: "SUN",
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'sun')
                                                    }
                                                },
                                                {
                                                    prop: "total",
                                                    type: "number",
                                                    name: "TOTAL",
                                                    "readonly": true
                                                }
                                            ],

                                        })
                                    }
                                }
                            },
                            'weeklySale': {
                                key: "customer.enterprise.weeklySale",
                                title: "WeeklySales",
                                "type": "number",
                                required: true,
                                readonly: true
                            },
                            'monthlySale': {
                                key: "customer.enterprise.monthlySale",
                                title: "MonthlySales",
                                "type": "number",
                                required: true,
                                readonly: true
                            }
                        }
                    },
                    "EnterpriseProductSale": {
                        "type": "box",
                        colClass: "col-sm-12",
                        "title": "ENTERPRISE_PRODUCT_SALES",
                        "orderNo": 640,
                        "items": {
                            "enterpriseProductSales": {
                                key: "customer.enterpriseProductSales",
                                type: "datatable",
                                title: "EnterpriseProductSale",
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "columns": [
                                                {
                                                    prop: "productName",
                                                    type: "text",
                                                    name: "PRODUCT_NAME"
                                                },
                                                {
                                                    prop: "salePrice",
                                                    type: "number",
                                                    name: "SALE_PRICE",
                                                    onClick: function (value, model, row) {
                                                        getEnterpriseProductDetails(model);

                                                    }
                                                },
                                                {
                                                    prop: "costPrice",
                                                    type: "number",
                                                    name: "COST_PRICE",
                                                    onClick: function (value, model, row) {
                                                        getEnterpriseProductDetails(model);

                                                    }
                                                },
                                                {
                                                    prop: "quantity",
                                                    type: "number",
                                                    name: "QUANTITY",
                                                    onClick: function (value, model, row) {
                                                        getEnterpriseProductDetails(model);
                                                    }
                                                },
                                                {
                                                    prop: "totalSale",
                                                    type: "number",
                                                    name: "TOTAL_SALE",
                                                    "readonly": true
                                                },
                                                {
                                                    prop: "totalCost",
                                                    type: "number",
                                                    name: "TOTAL_COST",
                                                    "readonly": true
                                                },

                                            ],

                                        })
                                    }
                                }
                            },
                            'totalDailySales': {
                                key: "customer.enterprise.totalDailySales",
                                title: "TOTAL_DAILY_Sales",
                                "type": "number",
                                required: true,
                                readonly: true
                            },
                            'totalDailyCost': {
                                key: "customer.enterprise.totalDailyCost",
                                title: "TOTAL_DAILY_COST",
                                "type": "number",
                                required: true,
                                readonly: true
                            },
                            'totalWeeklySales': {
                                key: "customer.enterprise.totalWeeklySales",
                                title: "TOTAL_WEEKLY_SALES",
                                "type": "number",
                                required: true,
                                readonly: true
                            },
                            'totalWeeklyCost': {
                                key: "customer.enterprise.totalWeeklyCost",
                                title: "TOTAL_WEEKLY_COST",
                                "type": "number",
                                required: true,
                                readonly: true
                            },
                            'totalMonthlySales': {
                                key: "customer.enterprise.totalMonthlySales",
                                title: "TOTAL_MONTHLY_SALE",
                                "type": "number",
                                required: true,
                                readonly: true
                            },
                            'totalMonthlyCost': {
                                key: "customer.enterprise.totalMonthlyCost",
                                title: "TOTAL_MONTHLY_COST",
                                "type": "number",
                                required: true,
                                readonly: true
                            },
                            'grossMarginSales': {
                                key: "customer.enterprise.grossMarginSales",
                                title: "GROSS_MARGIN_SALE",
                                "type": "number",
                                required: true,
                                readonly: true
                            },
                            'grossMarginCost': {
                                key: "customer.enterprise.grossMarginCost",
                                title: "GROSS_MARGIN_COST",
                                "type": "number",
                                required: true,
                                readonly: true
                            }
                        }
                    },
                    "AnnualSales": {
                        "type": "box",
                        colClass: "col-sm-12",
                        "title": "ANNUAL_BUSINESS_CYCLE",
                        "orderNo": 650,
                        "items": {
                            "monthlySale": {
                                key: "customer.monthlySale",
                                type: "datatable",
                                title: "ANNUAL_BUSINESS_CYCLE",
                                startEmpty: true,
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "columns": [
                                                {
                                                    prop: "seasonType",
                                                    type: "string",
                                                    name: "CYCLE"
                                                },
                                                {
                                                    prop: "January",
                                                    type: "number",
                                                    name: "Jan",
                                                    "readonly": true,
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'January');
                                                    },
                                                },

                                                {
                                                    prop: "Feburary",
                                                    type: "number",
                                                    name: "Feb",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Feburary')
                                                    }

                                                },
                                                {
                                                    prop: "March",
                                                    type: "number",
                                                    name: "Mar",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'March')
                                                    }
                                                },
                                                {
                                                    prop: "April",
                                                    type: "number",
                                                    name: "Apr",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'April')
                                                    }
                                                },
                                                {
                                                    prop: "May",
                                                    type: "number",
                                                    name: "May",
                                                    "readonly": true,
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'May')
                                                    }
                                                },
                                                {
                                                    prop: "June",
                                                    type: "number",
                                                    name: "Jun",
                                                    "readonly": true,
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'June')
                                                    }
                                                },
                                                {
                                                    prop: "July",
                                                    type: "number",
                                                    name: "Jul",
                                                    "readonly": true,
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'July')
                                                    }
                                                },
                                                {
                                                    prop: "August",
                                                    type: "number",
                                                    name: "Aug",
                                                    "readonly": true,
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'August')
                                                    }
                                                },
                                                {
                                                    prop: "September",
                                                    type: "number",
                                                    name: "Sep",
                                                    "readonly": true,
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'September')
                                                    }
                                                },
                                                {
                                                    prop: "October",
                                                    type: "number",
                                                    name: "Oct",
                                                    "readonly": true,
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'October')
                                                    }
                                                },
                                                {
                                                    prop: "November",
                                                    type: "number",
                                                    name: "Nov",
                                                    "readonly": true,
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'November')
                                                    }
                                                },
                                                {
                                                    prop: "December",
                                                    type: "number",
                                                    name: "Dec",
                                                    "readonly": true,
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'December')
                                                    }
                                                },
                                                {
                                                    prop: "total",
                                                    type: "number",
                                                    name: "Total",
                                                    "readonly": true
                                                }
                                            ],

                                        })
                                    }
                                }
                            },
                            'avgMonthlySales': {
                                key: "customer.enterprise.avgMonthlySales",
                                title: "MonthlySales",
                                "type": "number",
                                required: true,
                                readonly: true
                            },
                            'avgAnnualSales': {
                                key: "customer.enterprise.avgAnnualSales",
                                title: "AnnualSale",
                                "type": "number",
                                required: true,
                                readonly: true
                            }

                        }
                    },
                    "MonthlySalesCalculate": {
                        "type": "box",
                        colClass: "col-sm-12",
                        "title": "MONTHLY_SALES_CALCULATE",
                        "orderNo": 660,
                        "items": {
                            'monthlySalesCal': {
                                key: "customer.enterprise.monthlySalesCal",
                                title: "MonthlySalesCal",
                                "type": "number",
                                "readonly": true
                            },
                            'costOfGoodsSold': {
                                key: "customer.enterprise.costOfGoodsSold",
                                title: "CostOfGoodsSold",
                                "type": "number",
                                "readonly": true
                            },
                            'grossProfit': {
                                key: "customer.enterprise.grossProfit",
                                title: "GrossProfit",
                                "type": "number",
                                "readonly": true
                            }
                        }
                    },
                    "MonthlyBusinessExpense": {
                        "type": "box",
                        colClass: "col-sm-12",
                        "title": "BUSINESS_EXPENSE_MONTHLY",
                        "orderNo": 670,
                        "items": {
                            "monthlyBusinessExpense": {
                                key: "customer.monthlyBusinessExpense",
                                type: "datatable",
                                title: "BUSINESS_EXPENSE_MONTHLY",
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "columns": [
                                                {
                                                    prop: "expenditureSource",
                                                    type: "text",
                                                    name: "ITEM"
                                                },
                                                {
                                                    prop: "expenseType",
                                                    type: "number",
                                                    name: "ADDITIONAL_DETAILS",

                                                },

                                                {
                                                    prop: "annualExpenses",
                                                    type: "number",
                                                    name: "AMOUNT",
                                                    onClick: function (value, model, row) {
                                                        getBusinessExpenseData(value, model, row)
                                                    },
                                                    "readonly": true
                                                }
                                            ],

                                        })
                                    }
                                }
                            },
                            'totalBusinessExpenses': {
                                key: "customer.enterprise.totalBusinessExpenses",
                                title: "TotalBusinessExpenses",
                                "type": "number",
                                required: true,
                                readonly: true
                            },
                            'netBusinessIncome': {
                                key: "customer.enterprise.netBusinessIncome",
                                title: "NetBusinessIncome",
                                "type": "number",
                                required: true,
                                readonly: true
                            }
                        }
                    },
                    "NetBusinessIncome": {
                        "type": "box",
                        "title": "NET_BUSINESS_INCOME",
                        "orderNo": 680,
                        "items": {
                            'netBusinessIncomeGrossMargin': {
                                key: "customer.enterprise.netBusinessIncomeGrossMargin",
                                title: "NET_BUSINESS_INCOME_AS_GROSS_SALE_OR_PROFIT",
                                "type": "number",
                                readonly: true
                            },
                        }
                    },
                    "OtherBusinessIncomes": {
                        "type": "box",
                        colClass: "col-sm-12",
                        "title": "OtherBusinessIncomes",
                        "orderNo": 690,
                        "items": {
                            "otherBusinessIncomes": {
                                key: "customer.otherBusinessIncomes",
                                type: "datatable",
                                title: "OtherBusinessIncomes",
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "columns": [
                                                {
                                                    prop: "incomeSource",
                                                    type: "text",
                                                    name: "ITEM"
                                                },
                                                {
                                                    prop: "additionDetails",
                                                    type: "number",
                                                    name: "ADDITIONAL_DETAILS",

                                                },

                                                {
                                                    prop: "amount",
                                                    type: "number",
                                                    name: "AMOUNT",
                                                    onClick: function (value, model, row) {
                                                        getOtherBusinessIncomeDet(value, model, row);
                                                    },
                                                    "readonly": true
                                                }

                                            ],

                                        })
                                    }
                                }
                            },
                            'totalMonthlyAdditionIncome': {
                                key: "customer.enterprise.totalMonthlyAdditionIncome",
                                title: "TotalMonthlyAdditionIncome",
                                "type": "number",
                                required: true,
                                readonly: true
                            },
                            'additionalIncomeConsidered': {
                                key: "customer.enterprise.additionalIncomeConsidered",
                                title: "AdditionalIncomeConsidered",
                                "type": "number",
                                required: true,
                                readonly: true
                            }
                        }
                    },
                    "PersonalExpenses": {
                        "type": "box",
                        colClass: "col-sm-12",
                        "title": "PersonalExpenses",
                        "orderNo": 710,
                        "items": {
                            "personalExpenses": {
                                key: "customer.personalExpenses",
                                type: "datatable",
                                title: "MonthlyBusinessExpense",
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "columns": [
                                                {
                                                    prop: "expenditureSource",
                                                    type: "text",
                                                    name: "ITEM"
                                                },
                                                {
                                                    prop: "expenseType",
                                                    type: "number",
                                                    name: "ADDITIONAL_DETAILS",

                                                },

                                                {
                                                    prop: "annualExpenses",
                                                    type: "number",
                                                    name: "AMOUNT",
                                                    onClick: function (value, model, row) {
                                                        getPersonalExpenses(value, model, row);
                                                        //model.customer.enterprise.totalBusinessExpenses = total;

                                                    },
                                                    "readonly": true
                                                }

                                            ],

                                        })
                                    }
                                }
                            },
                            'totalPersonalExpense': {
                                key: "customer.enterprise.totalPersonalExpense",
                                title: "TotalPersonalExpense",
                                "type": "number",
                                required: true,
                                readonly: true
                            }
                        }
                    },
                    "LiabilityRepayment": {
                        "type": "box",
                        colClass: "col-sm-12",
                        "title": "LIABILITY_REPAYMENT",
                        "orderNo": 730,
                        "items": {
                            "liabilities": {
                                "key": "customer.liabilities[]",
                                "type": "array",
                                "items": {
                                    "customerLiabilityRepayments": {
                                        key: "customer.liabilities[].customerLiabilityRepayments",
                                        type: "datatable",
                                        title: "LIABILITY_REPAYMENT",
                                        dtlConfig: {
                                            columnsFn: function () {
                                                return $q.resolve({
                                                    "dtlKeyvalue": "ADD_PARAMETER",
                                                    "columns": [
                                                        {
                                                            prop: "udf2",
                                                            type: "text",
                                                            name: "ITEM"
                                                        },
                                                        {
                                                            prop: "udf1",
                                                            type: "text",
                                                            name: "number",
                                                            // onClick : function(value , model , row){
                                                            // //    model.customer.enterprise.totalLoanAmount = 0;

                                                            // //    var liabilities =  model.customer.liabilities;
                                                            // //    for(i in liabilities){
                                                            // //     model.customer.enterprise.totalLoanAmount = model.customer.enterprise.totalLoanAmount + liabilities[i].loanAmount;
                                                            // //    }
                                                            // }
                                                        },
                                                        {
                                                            prop: "emiAmount",
                                                            type: "number",
                                                            name: "EMI"
                                                            // onClick : function(value , model , row){
                                                            //     model.customer.enterprise.totalEmiAmount = 0;
                                                            //     var liabilities =  model.customer.liabilities;
                                                            //    for(i in liabilities){
                                                            //     model.customer.enterprise.totalEmiAmount = model.customer.enterprise.totalEmiAmount + liabilities[i].emiAmount;
                                                            //    }
                                                            // }
                                                        }

                                                    ],

                                                })
                                            }
                                        }
                                    }
                                }
                            },
                            'totalEmiAmount': {

                                key: "customer.enterprise.totalEmiAmount",
                                title: "TOTAL_EMI_AMOUNT",
                                "type": "number",
                                //required: true,
                                readonly: true
                            },
                            'totalLoanAmount': {
                                key: "customer.enterprise.totalLoanAmount",
                                title: "TOTAL_LOAN_AMOUNT",
                                "type": "number",
                                //required: true,
                                readonly: true
                            }
                        }
                    },
                    // "LiabilityRepayment": {
                    //     "type": "box",
                    //     colClass: "col-sm-12",
                    //     "title": "LIABILITY_REPAYMENT",
                    //     "orderNo": 730,
                    //     "items": {
                    //         "liabilities":{
                    //             "key": "customer.liabilities",
                    //             "type": "array",
                    //             //"startEmpty": true,
                    //             "items":{
                    //                 "customerLiabilityRepayments": {
                    //                     key: "customer.liabilities[].customerLiabilityRepayments",
                    //                     type: "datatable",
                    //                     title: "LIABILITY_REPAYMENT",
                    //                     dtlConfig: {
                    //                         columnsFn: function () {
                    //                             return $q.resolve({
                    //                                 "dtlKeyvalue": "ADD_PARAMETER",
                    //                                 "columns": [
                    //                                     {
                    //                                         prop: "udf2",
                    //                                         type: "text",
                    //                                         name: "ITEM"
                    //                                     },
                    //                                     {
                    //                                         prop: "udf1",
                    //                                         type: "text",
                    //                                         name: "LOAN_AMOUNT",
                    //                                         onClick : function(value , model , row){
                    //                                         //    model.customer.enterprise.totalLoanAmount = 0;

                    //                                         //    var liabilities =  model.customer.liabilities;
                    //                                         //    for(i in liabilities){
                    //                                         //     model.customer.enterprise.totalLoanAmount = model.customer.enterprise.totalLoanAmount + liabilities[i].loanAmount;
                    //                                         //    }
                    //                                         }
                    //                                     },
                    //                                     {
                    //                                         prop: "emiAmount",
                    //                                         type: "number",
                    //                                         name: "EMI"
                    //                                         // onClick : function(value , model , row){
                    //                                         //     model.customer.enterprise.totalEmiAmount = 0;
                    //                                         //     var liabilities =  model.customer.liabilities;
                    //                                         //    for(i in liabilities){
                    //                                         //     model.customer.enterprise.totalEmiAmount = model.customer.enterprise.totalEmiAmount + liabilities[i].emiAmount;
                    //                                         //    }
                    //                                         // }
                    //                                     }

                    //                                 ],

                    //                             })
                    //                         }
                    //                     }
                    //                 },
                    //             }
                    //         },
                    //         'totalEmiAmount':{

                    //                 key: "customer.enterprise.totalEmiAmount",
                    //                 title:"TOTAL_EMI_AMOUNT",
                    //                 "type":"number",
                    //                 //required: true,
                    //                 readonly: true
                    //             },
                    //         'totalLoanAmount':{ 
                    //             key: "customer.enterprise.totalLoanAmount",
                    //             title:"TOTAL_LOAN_AMOUNT",
                    //             "type":"number",
                    //             //required: true,
                    //             readonly: true
                    //         }

                    // }},
                    "TotalMonthlySurplus": {
                        "type": "box",
                        // colClass: "col-sm-12",
                        "title": 'TotalMonthlySurplus',
                        "orderNo": 750,
                        "items": {
                            'totalMonthlySurplus': {
                                key: "customer.enterprise.totalMonthlySurplus",
                                title: "TotalMonthlySurplus",
                                "type": "number",
                                "readonly": true
                            },
                            'enterdebtServiceRatio': {
                                key: "customer.enterprise.enterdebtServiceRatio",
                                title: "DebtServiceRation",
                                "type": "number",
                                "onChange": function (value, form, model) {
                                    monthlySurpluse(model);
                                }
                            },
                            'emiEligibility': {
                                key: "customer.enterprise.emiEligibility",
                                title: "Emi_Eligibility",
                                "type": "number",
                                "readonly": true
                            },
                            'affordableEMi': {
                                key: "customer.enterprise.affordableEMi",
                                title: "Affordable_EMi",
                                "type": "number",
                                "onChange": function (value, form, model) {
                                    monthlySurpluse(model);
                                }
                            },
                            'finalEMi': {
                                key: "customer.enterprise.finalEMi",
                                title: "Final_EMi",
                                "type": "number",
                                "readonly": true
                            },
                            'actualEmiOffered': {
                                key: "customer.enterprise.actualEmiOffered",
                                title: "Actual Emi Offered",
                                "type": "number",
                                "onChange": function (value, form, model) {
                                    monthlySurpluse(model);
                                }
                            },
                            'eligibleLoanAmount': {
                                key: "customer.enterprise.eligibleLoanAmount",
                                title: "Eligible_Loan_Amount",
                                "type": "number",
                                "readonly": true
                            },
                            'sanctionedLoanAmount': {
                                key: "customer.enterprise.sanctionedLoanAmount",
                                title: "Sanctioned_LoanAmount",
                                "type": "number"
                            }
                        }
                    },

                }

            }
            var getIncludes = function (model) {
                return [

                    "PreliminaryInformation",
                    "PreliminaryInformation.loanAmountRequested",
                    "PreliminaryInformation.tenure",
                    "PreliminaryInformation.interestRate",
                    "PreliminaryInformation.estimatedEmi",

                    "EnterpriseInformation",
                    // "EnterpriseInformation.customerId",
                    "EnterpriseInformation.branchName",
                    "EnterpriseInformation.centreName",
                    "EnterpriseInformation.centreId",
                    "EnterpriseInformation.urnNo",  // check
                    "EnterpriseInformation.firstName",
                    "EnterpriseInformation.companyOperatingSince",
                    "EnterpriseInformation.latitude",
                    "EnterpriseInformation.distanceFromBranch",
                    "EnterpriseInformation.ownership",
                    "EnterpriseInformation.businessConstitution",
                    "EnterpriseInformation.gstNumber",
                    "EnterpriseInformation.noOfPartners",
                    "EnterpriseInformation.companyRegistered",
                    "EnterpriseInformation.enterpriseRegistrations",
                    "EnterpriseInformation.enterpriseRegistrations.registrationType",
                    "EnterpriseInformation.enterpriseRegistrations.registrationNumber",
                    "EnterpriseInformation.enterpriseRegistrations.registeredDate",
                    "EnterpriseInformation.enterpriseRegistrations.expiryDate",
                    "EnterpriseInformation.enterpriseRegistrations.documentId",
                    "EnterpriseInformation.enterpriseDocuments",
                    "EnterpriseInformation.enterpriseDocuments.udf1",
                    "EnterpriseInformation.enterpriseDocuments.udf2",
                    "EnterpriseInformation.enterpriseDocuments.udf3",
                    "EnterpriseInformation.enterpriseDocuments.udf4",

                    "ContactInformation",
                    "ContactInformation.mobilePhone",
                    "ContactInformation.landLineNo",
                    "ContactInformation.doorNo",
                    "ContactInformation.street",
                    "ContactInformation.landmark",
                    "ContactInformation.pincode",
                    "ContactInformation.locality",
                    "ContactInformation.villageName",
                    "ContactInformation.district",
                    "ContactInformation.state",


                    "BankAccounts",
                    "BankAccounts.customerBankAccounts",
                    "BankAccounts.customerBankAccounts.ifscCode",
                    "BankAccounts.customerBankAccounts.customerBankName",
                    "BankAccounts.customerBankAccounts.customerBankBranchName",
                    "BankAccounts.customerBankAccounts.customerNameAsInBank",
                    "BankAccounts.customerBankAccounts.accountNumber",
                    "BankAccounts.customerBankAccounts.confirmedAccountNumber",
                    "BankAccounts.customerBankAccounts.accountType",
                    "BankAccounts.customerBankAccounts.bankingSince",
                    "BankAccounts.customerBankAccounts.bankStatementDocId",
                    "BankAccounts.customerBankAccounts.bankStatements",
                    "BankAccounts.customerBankAccounts.bankStatements.startMonth",
                    "BankAccounts.customerBankAccounts.bankStatements.totalDeposits",
                    "BankAccounts.customerBankAccounts.bankStatements.totalWithdrawals",
                    "BankAccounts.customerBankAccounts.bankStatements.closingBalance",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfChequeBounced",
                    "BankAccounts.customerBankAccounts.bankStatements.noOfEmiChequeBounced",

                    "Liabilities",
                    "Liabilities.liabilities",
                    "Liabilities.liabilities.loanSource",
                    "Liabilities.liabilities.loanAmountInPaisa",
                    "Liabilities.liabilities.installmentAmountInPaisa",
                    "Liabilities.liabilities.startDate",
                    "Liabilities.liabilities.tenure", // add in repo  
                    "Liabilities.liabilities.interestRate",
                    "Liabilities.liabilities.frequencyOfInstallment",
                    "Liabilities.liabilities.outstandingAmountInPaisa",
                    "Liabilities.liabilities.noOfInstalmentPaid",

                    "EnterpriseFinancials",
                    "EnterpriseFinancials.incomeThroughSales",
                    "EnterpriseFinancials.incomeThroughSales.incomeType",
                    "EnterpriseFinancials.incomeThroughSales.amount",
                    "EnterpriseFinancials.incomeThroughSales.frequency",
                    "EnterpriseFinancials.incomeThroughSales.invoiceDocId",

                    "EnterpriseFinancials",
                    "EnterpriseFinancials.rawMaterialExpenses",
                    "EnterpriseFinancials.rawMaterialExpenses.rawMaterialType",
                    "EnterpriseFinancials.rawMaterialExpenses.amount",
                    "EnterpriseFinancials.rawMaterialExpenses.frequency",
                    "EnterpriseFinancials.rawMaterialExpenses.invoiceDocId",

                    "EnterpriseFinancials",
                    "EnterpriseFinancials.totalMonthlySurplus",
                    "EnterpriseFinancials.debtServiceRatio",

                    "BuyerDetails",
                    "BuyerDetails.buyerDetails",
                    "BuyerDetails.buyerDetails.buyerName",
                    "BuyerDetails.buyerDetails.customerSince",
                    "BuyerDetails.buyerDetails.paymentFrequency",
                    "BuyerDetails.buyerDetails.product",
                    "BuyerDetails.buyerDetails.receivablesOutstanding",
                    "BuyerDetails.buyerDetails.contactNumber",

                    "SuppliersDeatils",
                    "SuppliersDeatils.supplierDetails",
                    "SuppliersDeatils.supplierDetails.supplierName",
                    "SuppliersDeatils.supplierDetails.customerSince",//paymentFrequency
                    "SuppliersDeatils.supplierDetails.paymentFrequency",//
                    "SuppliersDeatils.supplierDetails.product",//
                    "SuppliersDeatils.supplierDetails.receivablesOutstanding",
                    "SuppliersDeatils.supplierDetails.contactNumber",


                    "EstimatedSales",
                    "EstimatedSales.initialEstimateWeeklySale",
                    "EstimatedSales.initialEstimateMonthlySale",


                    "DailySales",
                    "DailySales.enterpriseDailySale",
                    "DailySales.weeklySale",
                    "DailySales.monthlySale",

                    "AnnualSales",
                    "AnnualSales.monthlySale",
                    "AnnualSales.avgMonthlySales",
                    "AnnualSales.avgAnnualSales",

                    "MonthlySalesCalculate",
                    "MonthlySalesCalculate.monthlySalesCal",
                    "MonthlySalesCalculate.costOfGoodsSold",
                    "MonthlySalesCalculate.grossProfit",

                    "NetBusinessIncome",
                    "NetBusinessIncome.netBusinessIncomeGrossMargin",

                    "EnterpriseProductSale",
                    "EnterpriseProductSale.enterpriseProductSales",
                    "EnterpriseProductSale.totalDailySales",
                    "EnterpriseProductSale.totalDailyCost",
                    "EnterpriseProductSale.totalWeeklySales",
                    "EnterpriseProductSale.totalWeeklyCost",
                    "EnterpriseProductSale.totalMonthlySales",
                    "EnterpriseProductSale.totalMonthlyCost",
                    "EnterpriseProductSale.grossMarginSales",
                    "EnterpriseProductSale.grossMarginCost",

                    "MonthlyBusinessExpense",
                    "MonthlyBusinessExpense.monthlyBusinessExpense",
                    "MonthlyBusinessExpense.totalBusinessExpenses",
                    "MonthlyBusinessExpense.netBusinessIncome",

                    "OtherBusinessIncomes",
                    "OtherBusinessIncomes.otherBusinessIncomes",
                    "OtherBusinessIncomes.totalMonthlyAdditionIncome",
                    "OtherBusinessIncomes.additionalDetails",

                    "PersonalExpenses",
                    "PersonalExpenses.personalExpenses",
                    "PersonalExpenses.totalPersonalExpense",

                    "LiabilityRepayment",
                    "LiabilityRepayment.liabilities.customerLiabilityRepayments",
                    "LiabilityRepayment.totalEmiAmount",
                    "LiabilityRepayment.totalLoanAmount",

                    "TotalMonthlySurplus",
                    "TotalMonthlySurplus.totalMonthlySurplus",
                    "TotalMonthlySurplus.enterdebtServiceRatio",
                    "TotalMonthlySurplus.emiEligibility",
                    "TotalMonthlySurplus.affordableEMi",
                    "TotalMonthlySurplus.finalEMi",
                    "TotalMonthlySurplus.actualEmiOffered",
                    "TotalMonthlySurplus.eligibleLoanAmount",
                    "TotalMonthlySurplus.sanctionedLoanAmount"
                ]
            }

            var configFile = function () {
                return {



                }
            }

            return {
                "type": "schema-form",
                "title": "ENTITY_ENROLLMENT",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }

                    /* Setting data recieved from Bundle */
                    model.loanCustomerRelationType = "Customer";
                    model.currentStage = bundleModel.currentStage;
                    /* End of setting data recieved from Bundle */

                    /* Setting data for the form */
                    model.loanAccount = model.loanProcess.loanAccount;
                    model.customer = model.enrolmentProcess.customer;
                    computeEstimatedEmi(model);
                    model.customer.customerBranchId = SessionStore.getCurrentBranch().branchId;
                    model.customer.branchName = SessionStore.getCurrentBranch().branchName;
                    var centre = SessionStore.getCentres();
                    model.customer.centreId = centre[0].centreCode;
                    model.customer.centreName = centre[0].centreName;
                    var branchId = SessionStore.getBranchId();
                    if (branchId && !model.customer.customerBranchId) {
                        model.customer.customerBranchId = branchId;
                    };
                    model.customer['enterpriseDailySale'] = []
                    model.customer['enterpriseDailySale1'] = []
                    // model.customer['enterpriseMonthlySales'] = []
                    model.customer['monthlySale'] = []
                    model.customer['enterpriseProductSales'] = []
                    model.customer['monthlyBusinessExpense'] = []
                    model.customer['otherBusinessIncomes'] = [];
                    model.customer['personalExpenses'] = []
                    model.customer['totalMonthlySurplus'] = '';
                    model.customer['debtServiceRatio'] = '';

                    if (model.customer.expenditures.length != 0) {
                        _.forEach(model.customer.expenditures, function (expenditure, index) {
                            if (index < 8) {
                                model.customer.monthlyBusinessExpense.push(expenditure)
                            }
                            else {
                                model.customer.personalExpenses.push(expenditure)
                            }
                            getBusinessExpenseData('value', model, 'row');
                            getPersonalExpenses('value', model, 'row');
                        })
                    }
                    else {
                        var busineeExpenseMonthly = ['Raw materials Consumed', 'Rent for Shop', 'Lab our / Wages', 'Electricity', 'Conveyance- Fuel & Maintenance', 'Transport Expenses', 'Depreciation/Development Rebate Reserve', 'Admin & Operating Expenses'];
                        for (i in busineeExpenseMonthly) {
                            model.customer.monthlyBusinessExpense.push({ 'expenditureSource': busineeExpenseMonthly[i] });
                        }

                        var personalExpense = ['Living Expenses (Food, Clothing, etc.)', 'Education', 'Rent & Electricity', 'Mobile / Telephone', 'Medical expenses'];
                        for (i in personalExpense) {
                            model.customer.personalExpenses.push({ 'expenditureSource': personalExpense[i] });
                        }
                    }

                    // var  otherBusinessIncome  = ['Monthly Rental Income','Avg. Monthly Agricultural Income','Income of the Spouse on Monthly basis','Other Income per month PENSION'];// get invalid error
                    var otherBusinessIncome = ['Dairy', 'Shop Owner', 'Unemployed', 'Fishing'];
                    for (i in otherBusinessIncome) {
                        model.customer.otherBusinessIncomes.push({ 'incomeSource': otherBusinessIncome[i], 'otherBusinessIncomeDate': "2017-11-01", 'amount': 0 });
                    }

                    var seasonTypes = ['High', 'Medium', 'Low']
                    for (i in seasonTypes) {
                        model.customer.enterpriseDailySale.push({ seasonType: seasonTypes[i], 'total': 0 })
                    }
                    model.customer.monthlySale = [];
                    for (i in seasonTypes) {
                        model.customer.monthlySale.push({ seasonType: seasonTypes[i], 'total': 0 })
                    }

                    if (model.customer.enterpriseDailySale1.length != 0) {
                        _.forEach(model.customer.enterpriseDailySale, function (dailysales) {
                            var sales = dailysales;
                            if (dailysales.seasonType == 'High' ? (i = 1) : (dailysales.seasonType == 'Medium' ? (i = 2) : (i = 3))) {
                                for (var key of Object.keys(dailysales)) {
                                    if (dailysales[key] != 'undefined' && key != 'seasonType' && key != 'totalSales') {
                                        day = dailysales[key]
                                        model.customer.enterpriseDailySale[i - 1][day] = sales.totalSales;
                                        model.customer.enterpriseDailySale[i - 1]["total"] += sales.totalSales;
                                    }
                                }
                            }
                        })
                    }
                    if (model.customer.enterpriseMonthlySales.length != 0) {
                        _.forEach(model.customer.enterpriseMonthlySales, function (monthlySales) {
                            var sales = monthlySales;
                            if (monthlySales.seasonType == 'High' ? (i = 1) : (monthlySales.seasonType == 'Medium' ? (i = 2) : (i = 3))) {
                                for (var key of Object.keys(monthlySales)) {
                                    if (key == 'month') {
                                        month = monthlySales[key]
                                        model.customer.monthlySale[i - 1][month] = sales.totalSales;
                                        model.customer.monthlySale[i - 1]["total"] += sales.totalSales;
                                    }
                                }
                            }
                        })
                        getAnnualSales(' ', model, ' ', " ");
                    }
                    if (model.customer.enterpriseProductSales.length != 0) {
                        getEnterpriseProductDetails(model)
                    }

                    /* End of setting data for the form */
                    console.log("model information");
                    console.log(model);

                    var self = this;
                    var formRequest = {
                        "overrides": overridesFields(model),
                        "includes": getIncludes(model),
                        "excludes": [],
                        "options": {
                            "repositoryAdditions": repositoryAdditions(model),
                            "additions": [
                                {
                                    "type": "actionbox",
                                    "condition": "!model.customer.currentStage",
                                    "orderNo": 1000,
                                    "items": [
                                        {
                                            "type": "submit",
                                            "title": "SUBMIT"
                                        }
                                    ]
                                },
                                {
                                    "type": "actionbox",
                                    "condition": "model.customer.currentStage",
                                    "orderNo": 1000,
                                    "items": [
                                        {
                                            "type": "button",
                                            "title": "UPDATE",
                                            "onClick": "actions.proceed(model, formCtrl, form, $event)"
                                        }
                                    ]
                                }
                            ]
                        }
                    };
                    UIRepository.getEnrolmentProcessUIRepository().$promise
                        .then(function (repo) {
                            return IrfFormRequestProcessor.buildFormDefinition(repo, formRequest, configFile(), model)
                        })
                        .then(function (form) {
                            self.form = form;
                        });
                },
                offline: false,
                getOfflineDisplayItem: function (item, index) {
                    return [
                        item.customer.firstName,
                        item.customer.centreId,
                        item.customer.id ? '{{"CUSTOMER_ID"|translate}} :' + item.customer.id : ''
                    ]
                },
                eventListeners: {
                    "applicant-updated": function (bundleModel, model, params) {
                        $log.info("inside applicant-updated of EnterpriseEnrolment2");
                        /* Load an existing customer associated with applicant, if exists. Otherwise default details*/
                        Queries.getEnterpriseCustomerId(params.customer.id)
                            .then(function (response) {
                                if (!response || !response.customer_id) {
                                    return false;
                                }

                                if (response.customer_id == model.customer.id) {
                                    return false;
                                }

                                return EnrolmentProcess.fromCustomerID(response.customer_id).toPromise();
                            })
                            .then(function (enrolmentProcess) {
                                if (!enrolmentProcess) {
                                    /* IF no enrolment present, reset to applicant */
                                    model.customer.enterpriseCustomerRelations[0].linkedToCustomerId = params.customer.id;
                                    model.customer.enterpriseCustomerRelations[0].linkedToCustomerName = params.customer.firstName;
                                    //model.customer.firstName = params.customer.firstName;
                                    model.customer.villageName = params.customer.villageName;
                                    model.customer.pincode = params.customer.pincode;
                                    model.customer.area = params.customer.area;
                                    return;
                                }
                                $log.info("Inside customer loaded of applicant-updated");
                                if (model.customer.id) {
                                    model.loanProcess.removeRelatedEnrolmentProcess(enrolmentProcess, 'Customer');
                                }
                                model.loanProcess.setRelatedCustomerWithRelation(enrolmentProcess, model.loanCustomerRelationType);

                                /* Setting for the current page */
                                model.enrolmentProcess = enrolmentProcess;
                                model.customer = enrolmentProcess.customer;

                                /* Setting enterprise customer relation on the enterprise customer */
                                model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                            })
                    },
                    "co-applicant-updated": function (bundleModel, model, params) {
                        model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                    },
                    "guarantor-updated": function (bundleModel, model, params) {
                        model.enrolmentProcess.refreshEnterpriseCustomerRelations(model.loanProcess);
                    },
                    "load-address-business": function (bundleModel, model, params) {
                        model.customer.mobilePhone = params.customer.mobilePhone;
                        model.customer.landLineNo = params.customer.landLineNo;
                        model.customer.doorNo = params.customer.doorNo;
                        model.customer.street = params.customer.street;
                        model.customer.postOffice = params.customer.postOffice;
                        model.customer.landmark = params.customer.landmark;
                        model.customer.locality = params.customer.locality;
                        model.customer.villageName = params.customer.villageName;
                        model.customer.district = params.customer.district;
                        model.customer.state = params.customer.state;
                    }
                },
                form: [

                ],
                schema: function () {
                    return Enrollment.getSchema().$promise;
                },
                actions: {
                    preSave: function (model, form, formName) {
                        var deferred = $q.defer();
                        if (model.customer.firstName) {
                            deferred.resolve();
                        } else {
                            PageHelper.showProgress('enrollment', 'Customer Name is required', 3000);
                            deferred.reject();
                        }
                        return deferred.promise;
                    },
                    save: function (model, formCtrl, formName) {

                    },
                    submit: function (model, form, formName) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.enrolmentProcess.save()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function () {
                                model.loanProcess.refreshRelatedCustomers();
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                model.enrolmentProcess.proceed()
                                    .subscribe(function (enrolmentProcess) {
                                        PageHelper.showProgress('enrolment', 'Done.', 5000);
                                    }, function (err) {
                                        PageHelper.showErrors(err);
                                        PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                        PageHelper.hideLoader();
                                    })
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', 'Oops. Some error.', 5000);
                                PageHelper.hideLoader();
                            });

                    },
                    proceed: function (model, form) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        PageHelper.showProgress('enrolment', 'Updating Customer');
                        PageHelper.showLoader();
                        model.customer.expenditures = [];

                        model.customer.enterpriseMonthlySales = []
                        _.forEach(model.customer.monthlySale, function (monthlysale) {
                            for (const key of Object.keys(monthlysale)) {
                                monthlysales = {}
                                if (monthlysale[key] != 'undefined' && key != 'seasonType' && key != 'total') {
                                    monthlysales['seasonType'] = monthlysale['seasonType'];
                                    monthlysales['month'] = key;
                                    monthlysales['totalSales'] = monthlysale[key]
                                }
                                if (!_.isEmpty(monthlysales)) {
                                    model.customer.enterpriseMonthlySales.push(monthlysales);
                                }
                            }
                        })

                        model.customer.enterpriseDailySales = []
                        _.forEach(model.customer.enterpriseDailySale, function (dailySale) {
                            for (const key of Object.keys(dailySale)) {
                                dailySales = {}
                                if (dailySale[key] != 'undefined' && key != 'seasonType' && dailySale[key] != 'total') {
                                    dailySales['seasonType'] = dailySale['seasonType'];
                                    dailySales['day'] = key;
                                    dailySales['totalSales'] = dailySale[key]
                                }
                                if (!_.isEmpty(dailySales)) {
                                    model.customer.enterpriseDailySales.push(dailySales);
                                }
                            }
                        })
                        _.forEach(model.customer.monthlyBusinessExpense, function (expenses) {
                            if (expenses.annualExpenses) {
                                model.customer.expenditures.push(expenses)
                            }

                        })
                        _.forEach(model.customer.personalExpenses, function (expenses) {

                            if (expenses.annualExpenses) {
                                model.customer.expenditures.push(expenses)
                            }
                        })
                        // model.customer.expenditures.push( model.customer.monthlyBusinessExpense);
                        // model.customer.expenditures.push( model.customer.personalExpenses)
                        model.enrolmentProcess.customer = model.customer;
                        model.enrolmentProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                            })
                            .subscribe(function (enrolmentProcess) {
                                LoanAccount.update(model.loanAccount).$promise.then(function (res) {
                                    PageHelper.showProgress('LoanAccount', 'Updated.', 5000);
                                }, function (err) {
                                    PageHelper.showErrors(err.message);
                                });
                                formHelper.resetFormValidityState(form);
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                BundleManager.pushEvent(model._bundlePageObj.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                            }, function (err) {
                                PageHelper.showErrors(err.message);
                                PageHelper.showProgress('enrolment', err.message, 5000);
                                PageHelper.hideLoader();
                            });
                    }

                }
            };
        }
    }
});
