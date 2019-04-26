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
                if(value){
                    model.customer.enterprise.weeklySale = 0;
                    for (i in model.customer.enterpriseDailySale) {
                        dailysales = model.customer.enterpriseDailySale[i];
                        if (dailysales.salesType != row.salesType && dailysales[day]) {
                            delete dailysales[day]
                        }
                        dailysales.total = (dailysales.mon ? dailysales.mon : 0) + (dailysales.tue ? dailysales.tue : 0) + (dailysales.wed ? dailysales.wed : 0) + (dailysales.thu ? dailysales.thu : 0) +
                            (dailysales.fri ?dailysales.fri : 0) + (dailysales.sat ? dailysales.sat : 0) + (dailysales.sun ? dailysales.sun : 0)
                        model.customer.enterprise.weeklySale =Math.round( model.customer.enterprise.weeklySale + dailysales.total);
                        model.customer.enterprise.monthlySale =Math.round(model.customer.enterprise.weeklySale * 4);
                    }
                    averageMonthlySale(model);
                    getBusinessExpenseData('value', model, 'row');
                    monthlySurpluse(model);
                }
               
            }

            var clearAll = function(baseKey,listOfKeys,model){
                if(listOfKeys != null && listOfKeys.length > 0){
                    for(var i =0 ;i<listOfKeys.length;i++){
                        if(typeof model[baseKey][listOfKeys[i]] !="undefined"){
                                model[baseKey][listOfKeys[i]] = null;
                        }
                    }
                }
                else{
                    model[baseKey] = {};
                }
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
                        model.customer.enterprise.totalDailySales = Math.round(productSale.totalSale + model.customer.enterprise.totalDailySales);
                        model.customer.enterprise.totalWeeklySales = model.customer.enterprise.totalDailySales * 4;
                        model.customer.enterprise.totalMonthlySales = model.customer.enterprise.totalDailySales * 30;
                    }
                    if (productSale.totalCost) {
                        model.customer.enterprise.totalDailyCost = Math.round(productSale.totalCost + model.customer.enterprise.totalDailyCost);
                        model.customer.enterprise.totalWeeklyCost = model.customer.enterprise.totalDailyCost * 4;
                        model.customer.enterprise.totalMonthlyCost = model.customer.enterprise.totalDailyCost * 30;
                        grossmargin = Math.round(((model.customer.enterprise.totalDailySales - model.customer.enterprise.totalDailyCost) / model.customer.enterprise.totalDailySales));
                        model.customer.enterprise.grossMarginSales = grossmargin;
                        grossmarginCost = Math.round(((model.customer.enterprise.totalDailySales - model.customer.enterprise.totalDailyCost) / model.customer.enterprise.totalDailySales));
                        model.customer.enterprise.grossMarginCost = Math.round((grossmarginCost/100));
                    }
                }
                averageMonthlySale(model);
                getBusinessExpenseData('value', model, 'row');
                monthlySurpluse(model);
            }

            var validateRequest = function(req) {
                if (req.customer && req.customer.customerBankAccounts) {
                    for (var i = 0; i < req.customer.customerBankAccounts.length; i++) {
                        var bankAccount = req.customer.customerBankAccounts[i];
                        if (bankAccount.accountNumber != bankAccount.confirmedAccountNumber) {
                            PageHelper.showErrors({data:{error:"Bank Accounts: Account Number doesnt match with Confirmed Account Number"}});
                            return false;
                        }
                    }
                }
                return true;
            }

            var getAnnualSales = function (value, model, row, month) {
                if(value){
                model.customer.enterprise.avgAnnualSales = 0;
                for (i in model.customer.monthlySale) {
                    monthlySales = model.customer.monthlySale[i];
                    if (monthlySales.seasonType != row.seasonType && monthlySales[month]) {
                        delete monthlySales[month]
                    }
                    monthlySales.total = (monthlySales.Jan ? monthlySales.Jan : 0) + (monthlySales.Feb ? monthlySales.Feb : 0) + (monthlySales.Mar ? monthlySales.Mar : 0) + (monthlySales.Apr ? monthlySales.Apr : 0) +
                        (monthlySales.May ? monthlySales.May : 0) + (monthlySales.June ? monthlySales.June : 0) + (monthlySales.July ? monthlySales.July : 0) + (monthlySales.Aug ? monthlySales.Aug : 0) + (monthlySales.Sep ? monthlySales.Sep : 0) + (monthlySales.Oct ? monthlySales.Oct : 0) + (monthlySales.Nov ? monthlySales.Nov : 0) + (monthlySales.Dec ? monthlySales.Dec : 0);
                    model.customer.enterprise.avgAnnualSales = model.customer.enterprise.avgAnnualSales + monthlySales.total;
                    model.customer.enterprise.avgMonthlySales = Math.round((model.customer.enterprise.avgAnnualSales/12));
                }
                    averageMonthlySale(model);
                    getBusinessExpenseData('value', model, 'row');
                    monthlySurpluse(model);
                }
            }

            var averageMonthlySale = function (model) {
                data = model.customer.enterprise;
                data.monthlySalesCal = Math.round(((data.initialEstimateMonthlySale ? data.initialEstimateMonthlySale : 0) + (data.monthlySale ? data.monthlySale : 0) + (data.totalMonthlySales ? data.totalMonthlySales : 0) + (data.avgMonthlySales ? data.avgMonthlySales : 0)) / 4);
                data.costOfGoodsSold = data.monthlySalesCal * (data.grossMarginCost ? data.grossMarginCost : 0)
                data.grossProfit = data.monthlySalesCal - data.costOfGoodsSold;
               // data.netBusinessIncome = 
            }
            var monthlySurpluse = function (model) {
                model.customer.enterprise.avgDailySaleAmount = ((model.customer.enterprise.netBusinessIncome ? model.customer.enterprise.netBusinessIncome : 0) + (model.customer.enterprise.additionalIncomeConsidered ? model.customer.enterprise.additionalIncomeConsidered : 0) - (model.customer.enterprise.totalPersonalExpense ? model.customer.enterprise.totalPersonalExpense : 0) - (model.customer.enterprise.totalEmiAmount ? model.customer.enterprise.totalEmiAmount : 0))
                model.customer.enterprise.avgMonthlyNetIncome = Math.round((model.customer.enterprise.avgDailySaleAmount * (0.67)));
                model.customer.enterprise.workingDaysInMonth = Math.min((model.customer.enterprise.avgMonthlyNetIncome ? model.customer.enterprise.avgMonthlyNetIncome : 0), (model.loanAccount.estimatedEmi? model.loanAccount.estimatedEmi: 0));
                var x = (((Math.pow(((model.loanAccount.interestRate / 12)), model.loanAccount.tenure) +1) * (model.customer.enterprise.workingDaysInMonth)) - 1)
                var y = ((Math.pow(((model.loanAccount.interestRate/ 12)), model.loanAccount.tenure)+1) * ((model.loanAccount.interestRate/ 12))) + model.loanAccount.loanAmountRequested
                // model.customer.enterprise.employeeSalary = Math.round((x/y));
                model.customer.enterprise.employeeSalary = 111;
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
                    model.loanAccount.emiEstimated = Math.round(Math.ceil(monthly));
                }
                else {
                    model.loanAccount.emiEstimated = "";
                }
            }
            var computeTotalMonthlySurpluse = function (value,form,model) {
                var businessIncome = 0;
                var businessExpense = 0;
                if (model.customer.incomeThroughSales) {
                    for (i in model.customer.incomeThroughSales) {
                        if(model.customer.incomeThroughSales[i].amount && model.customer.incomeThroughSales[i].frequency == 'Monthly'){
                            businessIncome = businessIncome +  (model.customer.incomeThroughSales[i].amount * 12);
                        }
                        else if(model.customer.incomeThroughSales[i].amount && model.customer.incomeThroughSales[i].frequency == 'Quarterly'){
                            businessIncome = businessIncome +  (model.customer.incomeThroughSales[i].amount * 4);
                        }
                        else if(model.customer.incomeThroughSales[i].amount && model.customer.incomeThroughSales[i].frequency == "Half yearly"){
                            businessIncome = businessIncome +  (model.customer.incomeThroughSales[i].amount * 2);
                        }
                        else if(model.customer.incomeThroughSales[i].amount && model.customer.incomeThroughSales[i].frequency == 'Annually'){
                            businessIncome = businessIncome +  (model.customer.incomeThroughSales[i].amount * 1);
                        }
                    }
                }
                if (model.customer.rawMaterialExpenses) {
                    for (i in model.customer.rawMaterialExpenses) {
                        if(model.customer.rawMaterialExpenses[i].amount  && model.customer.rawMaterialExpenses[i].frequency == 'Monthly'){
                            businessExpense = businessExpense +  (model.customer.rawMaterialExpenses[i].amount * 12);
                        }
                        else if(model.customer.rawMaterialExpenses[i].amount  && model.customer.rawMaterialExpenses[i].frequency == 'Quarterly'){
                            businessExpense = businessExpense +  (model.customer.rawMaterialExpenses[i].amount * 4);
                        }
                        else if(model.customer.rawMaterialExpenses[i].amount  && model.customer.rawMaterialExpenses[i].frequency == 'Half yearly'){
                            businessExpense = businessExpense +  (model.customer.rawMaterialExpenses[i].amount * 2);
                        }
                        else if(model.customer.rawMaterialExpenses[i].amount  && model.customer.rawMaterialExpenses[i].frequency == 'Annually'){
                            businessExpense = businessExpense +  (model.customer.rawMaterialExpenses[i].amount * 1);
                        }
                        
                    }
                }
                model.customer.totalMonthlySurplus = Math.round((businessIncome - businessExpense)/12);
                model.customer.debtServiceRatio = Math.round((businessExpense / businessIncome) * 100);
                monthlySurpluse(model);
            }

            var getBusinessExpenseData = function (value, model, row) {
                model.customer.enterprise.totalBusinessExpenses = 0;
                monthlyBusinessExpense = model.customer.monthlyBusinessExpense;
                total = 0;
                for (i in monthlyBusinessExpense) {
                    model.customer.enterprise.totalBusinessExpenses = model.customer.enterprise.totalBusinessExpenses + (monthlyBusinessExpense[i].annualExpenses ? monthlyBusinessExpense[i].annualExpenses : 0);
                }
                model.customer.enterprise.netBusinessIncome = Math.round(model.customer.enterprise.monthlySalesCal - model.customer.enterprise.totalBusinessExpenses);
                model.customer.enterprise.netBusinessIncomeGrossMargin = Math.round(model.customer.enterprise.netBusinessIncome / model.customer.enterprise.grossMarginSales);
                monthlySurpluse(model);
            }

            var getPersonalExpenses = function (value, model, row) {
                model.customer.enterprise.totalPersonalExpense = 0;
                personalExpense = model.customer.personalExpenses;
                total = 0;
                for (i in personalExpense) {
                    model.customer.enterprise.totalPersonalExpense = Math.round(model.customer.enterprise.totalPersonalExpense + (personalExpense[i].annualExpenses ? personalExpense[i].annualExpenses : 0));
                }
                monthlySurpluse(model);
            }
            var getOtherBusinessIncomeDet = function (value, model, row) {
                model.customer.enterprise.totalMonthlyAdditionIncome = 0;
                otherExpenses = model.customer.otherBusinessIncomes;
                for (i in otherExpenses) {
                    model.customer.enterprise.totalMonthlyAdditionIncome = model.customer.enterprise.totalMonthlyAdditionIncome + (otherExpenses[i].amount ? otherExpenses[i].amount : 0);
                }
                model.customer.enterprise.additionalIncomeConsidered = Math.round(Math.min(model.customer.enterprise.totalMonthlyAdditionIncome, model.customer.enterprise.netBusinessIncome));
                monthlySurpluse(model);
            }
            var overridesFields = function (bundlePageObj) {
                return {
                    "ContactInformation.pincode": {
                        "title": "Pincode",
                        "required": true,
                        "resolver": "PincodeLOVConfiguration",
                        "searchHelper": formHelper,
                        "orderNo": 210
                    },
                    "EnterpriseInformation.branchName": {
                        "readonly": true,
                        "orderNo": 10,
                        "required":true,
                    },
                    "EnterpriseInformation.centreId": {
                        "type": "text",
                        "title": "CENTREID",
                        "readonly": true,
                        "required": true,
                        "orderNo": 30
                    },
                    "EnterpriseInformation.centreName": {
                        "type": "text",
                        "title": "CENTRE_NAME",
                        "readonly": true,
                        "required": true,
                        "orderNo": 20
                    },
                    "EnterpriseInformation.urnNo": {
                        "condition": "model.customer.urnNo",
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
                        "orderNo": 100,
                        "required": false
                    },
                    "EnterpriseInformation.serviceTaxNumber": {
                        "orderNo": 110
                    },
                    "EnterpriseInformation.noOfPartners": {
                        "orderNo": 120
                    },
                    "EnterpriseInformation.companyRegistered": {
                        "required": true,
                        "orderNo": 130,
                        "type": "radios",
                        "enumCode": "decisionmakers"
                    },
                    "EnterpriseInformation.enterpriseRegistrations": {
                        "required": true,
                        "orderNo": 140,
                        "condition":"model.customer.enterprise.companyRegistered == 'YES'",
                        "add": null,
                        "remove": null,
                        "view": "fixed",
                        "startEmpty":false
                    },
                    "EnterpriseInformation.enterpriseDocuments": {
                        "orderNo": 150,
                        "startEmpty":false,
                        "add": null,
                        "remove": null,
                        "view": "fixed",
                    },
                    "ContactInformation.mobilePhone": {
                        "required": true,
                        "orderNo": 160
                    },
                    "ContactInformation.landLineNo": {
                        "orderNo": 170,
                        title:"Phone 2"
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
                    "ContactInformation.locality": {
                        "orderNo": 220,
                        "title":"Locality"
                    },
                    "ContactInformation.villageName": {
                        "orderNo": 230,
                        "required": true
                    },
                    "ContactInformation.district": {
                        "orderNo": 240,
                        "required":false
                    },
                    "ContactInformation.state": {
                        "orderNo": 250,
                         "required":false
                    },
                    "BankAccounts.customerBankAccounts": {
                        "required": true,
                        "orderNo": 255
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
                        "orderNo": 325
                    },
                    "BankAccounts.customerBankAccounts.bankStatementDocId": {
                        "orderNo": 330
                    },
                    "BankAccounts.customerBankAccounts.bankStatements":{
                        "orderNo": 335
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
                        onRemove: function (form, index, model) {
                            console.log(model)
                            computeTotalMonthlySurpluse("value","form",model);
                        },
                        "startEmpty":false,
                        offline:false
                    },
                    "EnterpriseFinancials.incomeThroughSales.incomeType": {
                        "type": "select",
                        "enumCode": "businessIncomeType",
                        "orderNo": 511,
                        "required":true
                    },
                    "EnterpriseFinancials.incomeThroughSales.amount": {
                        "orderNo": 512,
                        "required":true,
                        onChange: function (value, form, model) {
                            computeTotalMonthlySurpluse("value","form", model);
                        }
                    },
                    "EnterpriseFinancials.incomeThroughSales.frequency": {
                        "orderNo": 511,
                        "required":true,
                        onChange: function (value, form, model) {
                            computeTotalMonthlySurpluse("value","form", model);
                        }
                    },
                    "EnterpriseFinancials.incomeThroughSales.invoiceDocId": {
                        "orderNo": 514,
                        offline:false

                    },
                    "EnterpriseFinancials.incomeThroughSales.buyerName":{
                        "orderNo": 513,
                        "title": "OTHER_INCOME",
                        "type":"text"
                    },
                    "EnterpriseFinancials.rawMaterialExpenses": {
                        "orderNo": 520,
                        "title": "BUSINESS_EXPENSE",
                        onRemove: function (form, index, model) {
                            console.log(model)
                            computeTotalMonthlySurpluse("value","form", model);
                        },
                        "startEmpty":false
                    },
                    "EnterpriseFinancials.rawMaterialExpenses.vendorName": {
                        "type": "select",
                        "title":"EXPENSE_TYPE",
                        "enumCode": "businessExpenseType",
                        "orderNo": 521,
                        "required":true
                    },
                    "EnterpriseFinancials.rawMaterialExpenses.amount": {
                        "orderNo": 523,
                        "required":true,
                        onChange: function (value, form, model) {
                            computeTotalMonthlySurpluse(value, form, model);
                        }
                    },
                    "EnterpriseFinancials.rawMaterialExpenses.frequency":{
                        "orderNo": 522,
                        "required":true,
                        onChange: function (value, form, model) {
                            computeTotalMonthlySurpluse("value","form", model);
                        }
                    },
                    "EnterpriseFinancials.monthlySurplus.totalMonthlySurplus": {
                        "orderNo": 524,
                        readonly: true
                    },
                    "EnterpriseFinancials.monthlySurplus.debtServiceRatio": {
                        "orderNo": 528,
                        readonly: true
                    },
                    "PreliminaryInformation": {
                        "orderNo": 540
                    },
                    "PreliminaryInformation.loanAmountRequested": {
                        "orderNo": 540,
                        "readonly":true,
                        // onChange: function (value, form, model) {
                        //     if (model.loanAccount.loanAmountRequested == '' || model.loanAccount.interestRate == '' || model.loanAccount.frequencyRequested == '' || model.loanAccount.tenure == '')

                        //         return;
                        //     var principal = model.loanAccount.loanAmount;
                        //     var interest = model.loanAccount.interestRate / 100 / 12;
                        //     //var payments;
                        //     var payments = model.loanAccount.tenure;

                        //     // Now compute the monthly payment figure, using esoteric math.
                        //     var x = Math.pow(1 + interest, payments);
                        //     var monthly = (principal * x * interest) / (x - 1);

                        //     // Check that the result is a finite number. If so, display the results.
                        //     if (!isNaN(monthly) &&
                        //         (monthly != Number.POSITIVE_INFINITY) &&
                        //         (monthly != Number.NEGATIVE_INFINITY)) {
                        //         model.loanAccount.emiEstimated = round(monthly);
                        //     }
                        //     // Otherwise, the user's input was probably invalid, so don't
                        //     // display anything.
                        //     else {
                        //         model.loanAccount.emiEstimated = "";
                        //     }
                        // }
                    },
                    "PreliminaryInformation.tenure": {
                        "orderNo": 550,
                        "readonly":true
                    },
                    "PreliminaryInformation.interestRate": {
                        "orderNo": 560,
                        "readonly":true
                    },
                    "PreliminaryInformation.emiEstimated": {
                        "orderNo": 570,
                        "readonly":true
                    },
                    "EstimatedSales": {
                        "orderNo": 590
                    },
                    "EstimatedSales.monthlyBusinessExpenses": {
                        "orderNo": 600,
                        onChange: function (value, form, model) {
                            model.customer.enterprise.initialEstimateMonthlySale = model.customer.enterprise.monthlyBusinessExpenses * 4;
                            averageMonthlySale(model);
                        }
                    },
                    "EstimatedSales.initialEstimateMonthlySale": {
                        "orderNo": 605,
                        "readonly":true
                    },
                    "BuyerDetails": {
                        "orderNo": 530,
                        "condition":"model.currentStage == 'CreditAppraisal' || model.currentStage == 'DSCApproval' || model.currentStage == 'DSCOverride' || model.currentStage == 'KYCCheck'  || model.currentStage == 'RiskReviewAndLoanSanction' || model.currentStage == 'BusinessTeamReview' || model.currentStage == 'CreditOfficerReview' || model.currentStage == 'CreditManagerReview' || model.currentStage == 'CBOCreditHeadReview' || model.currentStage == 'CEOMDReview'",
                    },
                    "BuyerDetails.buyerDetails.paymentFrequency": {
                        "type": "select",
                        "enumCode": "payment_frequency"
                    },
                    "SuppliersDeatils.supplierDetails.paymentFrequency" : {
                        "type": "select",
                        "enumCode": "payment_frequency"
                    },
                    "SuppliersDeatils": {
                        "orderNo": 535,
                        "condition":"model.currentStage == 'CreditAppraisal' || model.currentStage == 'DSCApproval' || model.currentStage == 'DSCOverride' || model.currentStage == 'KYCCheck'  || model.currentStage == 'RiskReviewAndLoanSanction' || model.currentStage == 'BusinessTeamReview' || model.currentStage == 'CreditOfficerReview' || model.currentStage == 'CreditManagerReview' || model.currentStage == 'CBOCreditHeadReview' || model.currentStage == 'CEOMDReview'",
                    },
                    "MonthlySalesCalculate":{
                        "orderNo": 740
                    },
                    "OtherExpenseDetails":{
                        "orderNo": 745
                    },
                    "BuyerDetails.buyerDetails.receivablesOutstanding":{
                        "title":"AMOUNT_TRANSACTION_PER_FREQUENCY"
                    },
                    "BuyerDetails.buyerDetails.contactNumber":{
                        "type":"string",
                        "inputmode": "number",
                        "numberType": "tel"
                    },
                    "SuppliersDeatils.supplierDetails.contactNumber":{
                        "type":"string",
                        "inputmode": "number",
                        "numberType": "tel"
                    }
                    // "ContactInformation.locality":{
                    //     title:"LOCALITY"
                    // },
                    
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
                                "required": true
                            },
                            "centreName": {
                                "key": "customer.centreName",
                                "type": "text",
                                "title": "CENTRE_NAME",
                                "required": true
                            },
                            "branchName": {
                                "key": "customer.branchName",
                                "type": "text",
                                "title": "BRANCH_NAME",
                                "required":true
                            },
                            "serviceTaxNumber": {
                                "key": "customer.enterprise.serviceTaxNumber",
                                "type": "text",
                                "title": "GST_NUMBER",
                                schema: {
                                    "pattern": "^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}Z[a-zA-Z0-9]{1}$",
                                    "type": ["string", "null"],
                                }
                            },
                            "enterpriseDocuments": {
                                "type": "array",
                                "title": "BUSINESS_DOCUMENT",
                                "key": "customer.enterpriseDocuments",
                                "startEmpty": true,
                                "items": {
                                    "udf1": {
                                        "type": "select",
                                        "enumCode": "businessType",
                                        "title": "BUSINESS_TYPE",
                                        "key": "customer.enterpriseDocuments[].udf1",
                                        "required":true
                                    },
                                    "udf2": {
                                        "key": "customer.enterpriseDocuments[].udf2",
                                        "title": "BUSINESS_ACTIVITY",
                                        "required":true,
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
                        "condition":"model.currentStage == 'CreditAppraisal' || model.currentStage == 'DSCOverride' || model.currentStage == 'KYCCheck'  || model.currentStage == 'RiskReviewAndLoanSanction' || model.currentStage == 'BusinessTeamReview' || model.currentStage == 'CreditOfficerReview' || model.currentStage == 'CreditManagerReview' || model.currentStage == 'CBOCreditHeadReview' || model.currentStage == 'CEOMDReview'",
                        "title": "PRELIMINARY_INFORMATION",
                        "items": {
                            "loanAmountRequested": {
                                "key": "loanAccount.loanAmountRequested",
                                "type": "amount",
                                "title": "REQUESTED_LOAN_AMOUNT",
                                "onChange": function (value, form, model) {
                                    computeEstimatedEmi(model);
                                }
                            },
                            "tenure": {
                                "key": "loanAccount.tenure",
                                "title": "DURATION_IN_MONTHS",
                                "required": true,
                                "onChange": function (value, form, model) {
                                    computeEstimatedEmi(model);
                                }
                            },
                            "interestRate": {
                                "key": "loanAccount.interestRate",
                                "type": "number",
                                "required": true,
                                "title": "INTEREST_RATE",
                                "onChange": function (value, form, model) {
                                    computeEstimatedEmi(model);
                                }
                            },
                            "emiEstimated": {
                                "key": "loanAccount.emiEstimated",
                                "type": "amount",
                                "title": "ESTIMATED_EMI",
                            },
                        }
                    },
                    "EnterpriseFinancials": {
                        "items":{
                           "monthlySurplus":{
                                "type": "fieldset",
                                "title": "TOTAL_MONTHLY_SURPLUS",
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
                           }
                        }
                        // "items": {
                        //     "totalMonthlySurplus": {
                        //         "key": "customer.totalMonthlySurplus",
                        //         "type": "text",
                        //         "title": "TOTAL_MONTHLY_SURPLUS",
                        //     },
                        //     "debtServiceRatio": {
                        //         "key": "customer.debtServiceRatio",
                        //         "type": "text",
                        //         "title": "DEBT_SERVICE_RATIO",
                        //     }
                        // }
                    },
                    "EstimatedSales": {
                        "type": "box",
                        "condition":"model.currentStage == 'CreditAppraisal' || model.currentStage == 'DSCApproval' || model.currentStage == 'DSCOverride' || model.currentStage == 'KYCCheck'  || model.currentStage == 'RiskReviewAndLoanSanction' || model.currentStage == 'BusinessTeamReview' || model.currentStage == 'CreditOfficerReview' || model.currentStage == 'CreditManagerReview' || model.currentStage == 'CBOCreditHeadReview' || model.currentStage == 'CEOMDReview'",
                        "title": "INITIALISE_ESTIMATE_OF_SALES",
                        "items": {
                            'monthlyBusinessExpenses': {
                                key: "customer.enterprise.monthlyBusinessExpenses",
                                title: "WEEKLY_SALES",
                                "type": "number"
                            },
                            'initialEstimateMonthlySale': {
                                key: "customer.enterprise.initialEstimateMonthlySale",
                                title: "MONTHLY_SALES",
                                "type": "number"
                            }
                        }
                    },
                    "DailySales": {
                        "type": "box",
                        // "condition":"model.currentStage == 'CreditAppraisal'",
                        "orderNo": 620,
                        colClass: "col-sm-12",
                        readonly:true,
                        "title": "DAILY_SALES",
                        "items": {
                            "enterpriseDailySale": {
                                key: "customer.enterpriseDailySale",
                                type: "datatable",
                                title: "DAILY_SALES",
                                startEmpty: true,
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "isStaticTable":true,
                                            "canAddRow":false,
                                            "columns": [
                                                {
                                                    prop: "salesType",
                                                    type: "string",
                                                    name: "CYCLE"
                                                },
                                                {
                                                    prop: "mon",
                                                    type: "number",
                                                    name: "MON",
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
                                                    "readOnly":true
                                                }
                                            ],

                                        })
                                    }
                                }
                            }
                        }
                    },
                    "ReviewDailySales": {
                        "type": "box",
                        "orderNo": 620,
                        colClass: "col-sm-12",
                        "title": "DAILY_SALES",
                        "items": {
                            "enterpriseDailySale": {
                                key: "customer.enterpriseDailySale",
                                type: "datatable",
                                title: "DAILY_SALES",
                                startEmpty: true,
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "isStaticTable":true,
                                            "canAddRow":false,
                                            "columns": [
                                                {
                                                    prop: "salesType",
                                                    type: "string",
                                                    name: "CYCLE",
                                                    "readOnly":true
                                                },
                                                {
                                                    prop: "mon",
                                                    type: "number",
                                                    name: "MON",
                                                    "readOnly": true,
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'mon')
                                                    },
                                                },
                                                {
                                                    prop: "tue",
                                                    type: "number",
                                                    name: "TUE",
                                                    "readOnly": true,
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'tue')
                                                    }
                                                },
                                                {
                                                    prop: "wed",
                                                    type: "number",
                                                    name: "WED",
                                                    "readOnly": true,
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'wed')
                                                    }
                                                },
                                                {
                                                    prop: "thu",
                                                    type: "number",
                                                    name: "THU",
                                                    "readOnly": true,
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'thu')
                                                    }
                                                },
                                                {
                                                    prop: "fri",
                                                    type: "number",
                                                    name: "FRI",
                                                    "readOnly": true,
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'fri')
                                                    }
                                                },
                                                {
                                                    prop: "sat",
                                                    type: "number",
                                                    name: "SAT",
                                                    "readOnly": true,
                                                    "readonly": true,
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'sat')
                                                    }
                                                },
                                                {
                                                    prop: "sun",
                                                    type: "number",
                                                    name: "SUN",
                                                    "readOnly": true,
                                                    onClick: function (value, model, row) {
                                                        getDialySalesDetails(value, model, row, 'sun')
                                                    }
                                                },
                                                {
                                                    prop: "total",
                                                    type: "number",
                                                    name: "TOTAL",
                                                    "readOnly": true
                                                }
                                            ],

                                        })
                                    }
                                }
                            },
                            'weeklySale': {
                                key: "cueustomer.enterprise.weeklySale",
                                title: "WEEKLY_SALES",
                                "type": "number",
                                required: true,
                                readonly: true
                            },
                            'monthlySale': {
                                key: "customer.enterprise.monthlySale",
                                title: "MONTHLY_SALES",
                                "type": "number",
                                required: true,
                                readonly: true
                            }
                        }
                    },
                    "EnterpriseProductSale": {
                        "type": "box",
                        "readonly":true,
                        //"condition":"model.currentStage == 'CreditAppraisal'",
                        "title": "Sales per Product & Gross Margin",
                        "orderNo": 640,
                        colClass: "col-sm-12",
                        "items": {
                            "enterpriseProductSales": {
                                key: "customer.enterpriseProductSales",
                                type: "datatable",
                                title: "Sales per Product & Gross Margin",
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "canAddRow":true,
                                            "columns": [
                                                {
                                                    prop: "productName",
                                                    type: "text",
                                                    name: "Product"
                                                },
                                                {
                                                    prop: "salePrice",
                                                    type: "number",
                                                    name: "sales Price Per Unit",
                                                    onClick: function (value, model, row) {
                                                        getEnterpriseProductDetails(model);

                                                    }
                                                },
                                                {
                                                    prop: "costPrice",
                                                    type: "number",
                                                    name: "Cost Price Per Unit",
                                                    onClick: function (value, model, row) {
                                                        getEnterpriseProductDetails(model);

                                                    }
                                                },
                                                {
                                                    prop: "quantity",
                                                    type: "number",
                                                    name: "Quantity",
                                                    onClick: function (value, model, row) {
                                                        getEnterpriseProductDetails(model);
                                                    }
                                                },
                                                {
                                                    prop: "totalSale",
                                                    type: "number",
                                                    name: "TOTAL_SALE",
                                                    "readOnly": true,
                                                    "disabled": true
                                                },
                                                {
                                                    prop: "totalCost",
                                                    type: "number",
                                                    name: "TOTAL_COST",
                                                    "readOnly": true
                                                },

                                            ],

                                        })
                                    }
                                }
                            }
                        }
                    },
                    "ReviewEnterpriseProductSale": {
                        "type": "box",
                        "readonly":true,
                        "title": "Sales per Product & Gross Margin",
                        "orderNo": 640,
                        colClass: "col-sm-12",
                        "items": {
                            "enterpriseProductSales": {
                                key: "customer.enterpriseProductSales",
                                type: "datatable",
                                title: "Sales per Product & Gross Margin",
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "isStaticTable":true,
                                            "canAddRow":false,
                                            "columns": [
                                                {
                                                    prop: "productName",
                                                    type: "text",
                                                    name: "Product",
                                                    "readOnly": true,
                                                },
                                                {
                                                    prop: "salePrice",
                                                    type: "number",
                                                    name: "sales Price Per Unit",
                                                    onClick: function (value, model, row) {
                                                        getEnterpriseProductDetails(model);
                                                    },
                                                    "readOnly": true,
                                                },
                                                {
                                                    prop: "costPrice",
                                                    type: "number",
                                                    name: "Cost Price Per Unit",
                                                    onClick: function (value, model, row) {
                                                        getEnterpriseProductDetails(model);
                                                    },
                                                    "readOnly": true,
                                                },
                                                {
                                                    prop: "quantity",
                                                    type: "number",
                                                    name: "Quantity",
                                                    onClick: function (value, model, row) {
                                                        getEnterpriseProductDetails(model);
                                                    },
                                                    "readOnly": true,
                                                },
                                                {
                                                    prop: "totalSale",
                                                    type: "number",
                                                    name: "TOTAL_SALE",
                                                    "readOnly": true,
                                                },
                                                {
                                                    prop: "totalCost",
                                                    type: "number",
                                                    name: "TOTAL_COST",
                                                    "readOnly": true
                                                },

                                            ],

                                        })
                                    }
                                }
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
                                            "isStaticTable":true,
                                            "canAddRow":false,
                                            "columns": [
                                                {
                                                    prop: "seasonType",
                                                    type: "string",
                                                    name: "CYCLE",
                                                },
                                                {
                                                    prop: "Jan",
                                                    type: "number",
                                                    name: "Jan",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Jan');
                                                    },
                                                },

                                                {
                                                    prop: "Feb",
                                                    type: "number",
                                                    name: "Feb",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Feb')
                                                    }

                                                },
                                                {
                                                    prop: "Mar",
                                                    type: "number",
                                                    name: "Mar",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Mar')
                                                    }
                                                },
                                                {
                                                    prop: "Apr",
                                                    type: "number",
                                                    name: "Apr",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Apr')
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
                                                    name: "June",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'June')
                                                    }
                                                },
                                                {
                                                    prop: "July",
                                                    type: "number",
                                                    name: "Jul",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'July')
                                                    }
                                                },
                                                {
                                                    prop: "Aug",
                                                    type: "number",
                                                    name: "Aug",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Aug')
                                                    }
                                                },
                                                {
                                                    prop: "Sep",
                                                    type: "number",
                                                    name: "Sep",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Sep')
                                                    }
                                                },
                                                {
                                                    prop: "Oct",
                                                    type: "number",
                                                    name: "Oct",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Oct')
                                                    }
                                                },
                                                {
                                                    prop: "Nov",
                                                    type: "number",
                                                    name: "Nov",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Nov')
                                                    }
                                                },
                                                {
                                                    prop: "Dec",
                                                    type: "number",
                                                    name: "Dec",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Dec')
                                                    }
                                                },
                                                {
                                                    prop: "total",
                                                    type: "number",
                                                    name: "Total",
                                                    "readOnly": true
                                                }
                                            ],

                                        })
                                    }
                                }
                            }
                        }
                    },
                    "ReviewAnnualSales": {
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
                                            "isStaticTable":true,
                                            "canAddRow":false,
                                            "columns": [
                                                {
                                                    prop: "seasonType",
                                                    type: "string",
                                                    name: "CYCLE",
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "Jan",
                                                    type: "number",
                                                    name: "Jan",
                                                    "readOnly": true,
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Jan');
                                                    },
                                                },

                                                {
                                                    prop: "Feb",
                                                    type: "number",
                                                    name: "Feb",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Feb')
                                                    },
                                                    "readOnly": true

                                                },
                                                {
                                                    prop: "Mar",
                                                    type: "number",
                                                    name: "Mar",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Mar')
                                                    },
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "Apr",
                                                    type: "number",
                                                    name: "Apr",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Apr')
                                                    },
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "May",
                                                    type: "number",
                                                    name: "May",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'May')
                                                    },
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "June",
                                                    type: "number",
                                                    name: "June",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'June')
                                                    },
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "July",
                                                    type: "number",
                                                    name: "Jul",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'July')
                                                    },
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "Aug",
                                                    type: "number",
                                                    name: "Aug",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Aug')
                                                    },
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "Sep",
                                                    type: "number",
                                                    name: "Sep",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Sep')
                                                    },
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "Oct",
                                                    type: "number",
                                                    name: "Oct",
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Oct')
                                                    },
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "Nov",
                                                    type: "number",
                                                    name: "Nov",
                                                    "readOnly": true,
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Nov')
                                                    }
                                                },
                                                {
                                                    prop: "Dec",
                                                    type: "number",
                                                    name: "Dec",
                                                    "readOnly": true,
                                                    onClick: function (value, model, row) {
                                                        getAnnualSales(value, model, row, 'Dec')
                                                    }
                                                },
                                                {
                                                    prop: "total",
                                                    type: "number",
                                                    name: "Total",
                                                    "readOnly": true
                                                }
                                            ],

                                        })
                                    }
                                }
                            }
                        }
                    },
                    "MonthlySalesCalculate": {
                        "type": "box",
                        //"condition":"model.currentStage == 'CreditAppraisal' || model.currentStage == 'DSCApproval' || model.currentStage == 'DSCOverride' || model.currentStage == 'KYCCheck'  || model.currentStage == 'RiskReviewAndLoanSanction'",
                        "title": "MONTHLY_SALES_CALCULATE",
                        "orderNo": 660,
                        "items": {
                            "dailySales":{
                                "type": "fieldset",
                                "title": "DAILY_SALES_MONTHLY_CALCULATION",
                                "items": {
                                    "weeklySale":{
                                        key: "customer.enterprise.weeklySale",
                                        title: "WEEKLY_SALES",
                                        "type": "number",
                                        required: true,
                                        readonly: true
                                    },
                                    "monthlySale":{
                                        key: "customer.enterprise.monthlySale",
                                        title: "MONTHLY_SALES",
                                        "type": "number",
                                        required: true,
                                        readonly: true
                                    }
                            }},
                            "productSales":{
                                "type":"fieldset",
                                "title":"SALE_PER_PRODUCT_MONTHLY_CALCULATION",
                                "items":{
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
                            "monthlySales":{
                                "type": "fieldset",
                                "title": "ANNUAL_SALES_MONTHLY_CALCULATION",
                                "items": {
                                    "avgMonthlySales":{
                                        key: "customer.enterprise.avgMonthlySales",
                                        title: "TOTAL_MONTHLY_SALE",
                                        "type": "number",
                                        required: true,
                                        readonly: true
                                    },
                                    "avgAnnualSales":{
                                        key: "customer.enterprise.avgAnnualSales",
                                        title: "TOTAL_ANNUAL_SALE",
                                        "type": "number",
                                        required: true,
                                        readonly: true
                                    }
                            }},
                            "monthlySaleCalculation":{
                                "type":"fieldset",
                                "title":"TOTAL_MONTHLY_SALE_CALCULATION",
                                "items":{
                                    'monthlySalesCal': {
                                        key: "customer.enterprise.monthlySalesCal",
                                        title: "MONTHLY_SALES",
                                        "type": "number",
                                        "readonly": true
                                    },
                                    'costOfGoodsSold': {
                                        key: "customer.enterprise.costOfGoodsSold",
                                        title: "COST_OF_GOODS_SOLD",
                                        "type": "number",
                                        "readonly": true
                                    },
                                    'grossProfit': {
                                        key: "customer.enterprise.grossProfit",
                                        title: "GROSS_PROFIT",
                                        "type": "number",
                                        "readonly": true
                                    }
                                }
                            },
                            // "monthlyBusinessExpense":{
                            //     "type": "fieldset",
                            //     "title": "BUSINESS_EXPENSE_MONTHLY_CALCULATION",
                            //     "items": {
                            //         'totalBusinessExpenses': {
                            //             key: "customer.enterprise.totalBusinessExpenses",
                            //             title: "TotalBusinessExpenses",
                            //             "type": "number",
                            //             required: true,
                            //             readonly: true
                            //         },
                            //         'netBusinessIncome': {
                            //             key: "customer.enterprise.netBusinessIncome",
                            //             title: "NetBusinessIncome",
                            //             "type": "number",
                            //             required: true,
                            //             readonly: true
                            //         }
                            //     }
                            // },
                            // "otherBusinessIncome":{
                            //     "type": "fieldset",
                            //     "title": "ADDITIONAL_INCOME_MONTHLY_CALCULATION",
                            //     "items": {
                            //         'totalMonthlyAdditionIncome': {
                            //             key: "customer.enterprise.totalMonthlyAdditionIncome",
                            //             title: "TotalMonthlyAdditionlIncome",
                            //             "type": "number",
                            //             required: true,
                            //             readonly: true
                            //         },
                            //         'additionalIncomeConsidered': {
                            //             key: "customer.enterprise.additionalIncomeConsidered",
                            //             title: "AdditionalIncomeConsidered",
                            //             "type": "number",
                            //             required: true,
                            //             readonly: true
                            //         }
                            //     }
                            // },
                            // "personalExpense":{
                            //     "type":"fieldset",
                            //     "title":"TOTAL_PERSONAL_EXPENSE",
                            //     "items":{
                            //         'totalPersonalExpense': {
                            //             key: "customer.enterprise.totalPersonalExpense",
                            //             title: "TotalPersonalExpense",
                            //             "type": "number",
                            //             required: true,
                            //             readonly: true
                            //         }
                            //     }
                            // },
                            // "liability":{
                            //     "type":"fieldset",
                            //     "title":"TOTAL_LIABILITY_CALCULATION",
                            //     items:{
                            //         'totalEmiAmount': {
                            //             key: "customer.enterprise.totalEmiAmount",
                            //             title: "TOTAL_EMI_AMOUNT",
                            //             "type": "number",
                            //             //required: true,
                            //             readonly: true
                            //         },
                            //         'totalLoanAmount': {
                            //             key: "customer.enterprise.totalLoanAmount",
                            //             title: "TOTAL_LOAN_AMOUNT",
                            //             "type": "number",
                            //             //required: true,
                            //             readonly: true
                            //         }
                            //     }
                            // }
                        }
                    },
                    "OtherExpenseDetails": {
                        "type": "box",
                       // "condition":"model.currentStage == 'CreditAppraisal' || model.currentStage == 'DSCApproval' || model.currentStage == 'DSCOverride' || model.currentStage == 'KYCCheck'  || model.currentStage == 'RiskReviewAndLoanSanction'",
                        "title": "OTHER_EXPENSE_CALCULATION",
                        "orderNo": 660,
                        "items": {
                            "monthlyBusinessExpense":{
                                "type": "fieldset",
                                "title": "BUSINESS_EXPENSE_CALCULATION",
                                "items": {
                                    'totalBusinessExpenses': {
                                        key: "customer.enterprise.totalBusinessExpenses",
                                        title: "TOTAL_BUSINESS_EXPENSES",
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
                            "otherBusinessIncome":{
                                "type": "fieldset",
                                "title": "ADDITIONAL_INCOME_CALCULATION",
                                "items": {
                                    'totalMonthlyAdditionIncome': {
                                        key: "customer.enterprise.totalMonthlyAdditionIncome",
                                        title: "TOTAL_MONTHLY_ADDITIONAL_INCOME",
                                        "type": "number",
                                        required: true,
                                        readonly: true
                                    },
                                    'additionalIncomeConsidered': {
                                        key: "customer.enterprise.additionalIncomeConsidered",
                                        title: "ADDITIONAL_INCOME_CONSIDERED",
                                        "type": "number",
                                        required: true,
                                        readonly: true
                                    }
                                }
                            },
                            "personalExpense":{
                                "type":"fieldset",
                                "title":"TOTAL_PERSONAL_EXPENSE",
                                "items":{
                                    'totalPersonalExpense': {
                                        key: "customer.enterprise.totalPersonalExpense",
                                        title: "TOTAL_PERSONAL_EXPENSE",
                                        "type": "number",
                                        required: true,
                                        readonly: true
                                    }
                                }
                            },
                            "liability":{
                                "type":"fieldset",
                                "title":"TOTAL_LIABILITY_CALCULATION",
                                items:{
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
                            }
                        }
                    },
                    "MonthlyBusinessExpense": {
                        "type": "box",
                        colClass: "col-sm-6",
                       // "condition":"model.currentStage == 'CreditAppraisal'",
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
                                            "isStaticTable":true,
                                            "canAddRow":false,
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
                                                    }
                                                }
                                            ],

                                        })
                                    }
                                }
                            },
                            'totalBusinessExpenses': {
                                key: "customer.enterprise.totalBusinessExpenses",
                                title: "TOTAL_BUSINESS_EXPENSES",
                                "type": "number",
                                required: true,
                                readonly: true
                            },
                            'netBusinessIncome': {
                                key: "customer.enterprise.netBusinessIncome",
                                title: "NET_BUSINEE_INCOME",
                                "type": "number",
                                required: true,
                                readonly: true
                            }
                        }
                    },
                    "ReviewMonthlyBusinessExpense": {
                        "type": "box",
                        colClass: "col-sm-6",
                       // "condition":"model.currentStage == 'DSCApproval' || model.currentStage == 'DSCOverride' || model.currentStage == 'KYCCheck'  || model.currentStage == 'RiskReviewAndLoanSanction'",
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
                                            "isStaticTable":true,
                                            "canAddRow":false,
                                            "columns": [
                                                {
                                                    prop: "expenditureSource",
                                                    type: "text",
                                                    name: "ITEM",
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "expenseType",
                                                    type: "number",
                                                    name: "ADDITIONAL_DETAILS",
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "annualExpenses",
                                                    type: "number",
                                                    name: "AMOUNT",
                                                    onClick: function (value, model, row) {
                                                        getBusinessExpenseData(value, model, row)
                                                    },
                                                    "readOnly": true
                                                }
                                            ],

                                        })
                                    }
                                }
                            }
                        }
                    },
                    "NetBusinessIncome": {
                        "type": "box",
                        "title": "NET_BUSINESS_INCOME",
                       // "condition":"model.currentStage == 'CreditAppraisal' || model.currentStage == 'DSCApproval' || model.currentStage == 'DSCOverride' || model.currentStage == 'KYCCheck'  || model.currentStage == 'RiskReviewAndLoanSanction'",
                        "orderNo": 690,
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
                        colClass: "col-sm-6",
                        "title": "ADDITIONAL_INCOME",
                        //"condition":"model.currentStage == 'CreditAppraisal'",
                        "orderNo": 680,
                        "items": {
                            "otherBusinessIncomes": {
                                key: "customer.otherBusinessIncomes",
                                type: "datatable",
                                title: "OtherBusinessIncomes",
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "isStaticTable":true,
                                            "canAddRow":false,
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
                            }
                        }
                    },
                    "ReviewOtherBusinessIncomes": {
                        "type": "box",
                        colClass: "col-sm-6",
                        "title": "ADDITIONAL_INCOME",
                       // "condition":"model.currentStage == 'DSCApproval' || model.currentStage == 'DSCOverride' || model.currentStage == 'KYCCheck'  || model.currentStage == 'RiskReviewAndLoanSanction'",
                        "orderNo": 680,
                        "items": {
                            "otherBusinessIncomes": {
                                key: "customer.otherBusinessIncomes",
                                type: "datatable",
                                title: "OtherBusinessIncomes",
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "isStaticTable":true,
                                            "canAddRow":false,
                                            "columns": [
                                                {
                                                    prop: "incomeSource",
                                                    type: "text",
                                                    name: "ITEM",
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "additionDetails",
                                                    type: "number",
                                                    name: "ADDITIONAL_DETAILS",
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "amount",
                                                    type: "number",
                                                    name: "AMOUNT",
                                                    onClick: function (value, model, row) {
                                                        getOtherBusinessIncomeDet(value, model, row);
                                                    },
                                                    "readOnly": true
                                                }

                                            ],

                                        })
                                    }
                                }
                            }
                        }
                    },
                    "PersonalExpenses": {
                        "type": "box",
                        colClass: "col-sm-6",
                        "title": "PERSONAL_EXPENSES",
                        "orderNo": 710,
                       // "condition":"model.currentStage == 'CreditAppraisal'",
                        "items": {
                            "personalExpenses": {
                                key: "customer.personalExpenses",
                                type: "datatable",
                                title: "MonthlyBusinessExpense",
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "isStaticTable":true,
                                            "canAddRow":false,
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
                    "ReviewPersonalExpenses": {
                        "type": "box",
                        colClass: "col-sm-6",
                        "title": "PERSONAL_EXPENSES",
                        "orderNo": 710,
                        //"condition":"model.currentStage == 'DSCApproval' || model.currentStage == 'DSCOverride' || model.currentStage == 'KYCCheck'  || model.currentStage == 'RiskReviewAndLoanSanction'",
                        "items": {
                            "personalExpenses": {
                                key: "customer.personalExpenses",
                                type: "datatable",
                                title: "MonthlyBusinessExpense",
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "isStaticTable":true,
                                            "canAddRow":false,
                                            "columns": [
                                                {
                                                    prop: "expenditureSource",
                                                    type: "text",
                                                    name: "ITEM",
                                                    "readOnly": true
                                                },
                                                {
                                                    prop: "expenseType",
                                                    type: "number",
                                                    name: "ADDITIONAL_DETAILS",
                                                    "readOnly": true
                                                },

                                                {
                                                    prop: "annualExpenses",
                                                    type: "number",
                                                    name: "AMOUNT",
                                                    onClick: function (value, model, row) {
                                                        getPersonalExpenses(value, model, row);
                                                        //model.customer.enterprise.totalBusinessExpenses = total;
                                                    },
                                                    "readOnly": true
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
                        colClass: "col-sm-6",
                        "title": "LIABILITY_REPAYMENT",
                        //"condition":"model.currentStage == 'CreditAppraisal'",
                        "orderNo": 730,
                        "items": {
                            "liabilityRepayment": {
                                key: "customer.liabilityRepayment",
                                type: "datatable",
                                title: "LIABILITY_REPAYMENT",
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "canAddRow":true,
                                            "columns": [
                                                {
                                                    prop: "udf2",
                                                    type: "text",
                                                    name: "ITEM"
                                                },
                                                {
                                                    prop: "udf1",
                                                    type: "number",
                                                    name: "LOAN_AMOUNT",
                                                    onClick : function(value , model , row){
                                                        model.customer.enterprise.totalLoanAmount = 0;
                                                        var liabilities =  model.customer.liabilityRepayment;
                                                        for(i in liabilities){
                                                        model.customer.enterprise.totalLoanAmount = model.customer.enterprise.totalLoanAmount + Number(liabilities[i].udf1);
                                                        }
                                                    }
                                                },
                                                {
                                                    prop: "emiAmount",
                                                    type: "number",
                                                    name: "EMI",
                                                    onClick : function(value , model , row){
                                                        model.customer.enterprise.totalEmiAmount = 0;
                                                        var liabilities =  model.customer.liabilityRepayment;
                                                        for(i in liabilities){
                                                        model.customer.enterprise.totalEmiAmount = model.customer.enterprise.totalEmiAmount + liabilities[i].emiAmount;
                                                        }
                                                    }
                                                }

                                            ],

                                        })
                                    }
                                }
                            }
                            
                        }
                    },
                    "ReviewLiabilityRepayment": {
                        "type": "box",
                        colClass: "col-sm-6",
                        "title": "LIABILITY_REPAYMENT",
                       // "condition":"model.currentStage == 'DSCApproval' || model.currentStage == 'DSCOverride' || model.currentStage == 'KYCCheck'  || model.currentStage == 'RiskReviewAndLoanSanction'",
                        "orderNo": 730,
                        "items": {
                            "liabilityRepayment": {
                                key: "customer.liabilityRepayment",
                                type: "datatable",
                                title: "LIABILITY_REPAYMENT",
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "ADD_PARAMETER",
                                            "canAddRow":false,
                                            "isStaticTable":true,
                                            "columns": [
                                                {
                                                    prop: "udf2",
                                                    type: "text",
                                                    name: "ITEM",
                                                    "readOnly":true
                                                },
                                                {
                                                    prop: "udf1",
                                                    type: "number",
                                                    name: "LOAN_AMOUNT",
                                                    "readOnly":true,
                                                    onClick : function(value , model , row){
                                                        model.customer.enterprise.totalLoanAmount = 0;
                                                        var liabilities =  model.customer.liabilityRepayment;
                                                        for(i in liabilities){
                                                        model.customer.enterprise.totalLoanAmount = model.customer.enterprise.totalLoanAmount + Number(liabilities[i].udf1);
                                                        }
                                                    }
                                                },
                                                {
                                                    prop: "emiAmount",
                                                    type: "number",
                                                    name: "EMI",
                                                    "readOnly":true,
                                                    onClick : function(value , model , row){
                                                        model.customer.enterprise.totalEmiAmount = 0;
                                                        var liabilities =  model.customer.liabilityRepayment;
                                                        for(i in liabilities){
                                                        model.customer.enterprise.totalEmiAmount = model.customer.enterprise.totalEmiAmount + liabilities[i].emiAmount;
                                                        }
                                                    }
                                                }

                                            ],

                                        })
                                    }
                                }
                            }
                            
                        }
                    },
                    "TotalMonthlySurplus": {
                        "type": "box",
                        // colClass: "col-sm-12",
                        "title": 'TOTAL_MONTHLY_SURPLUS',
                       // readOnly : "model.TableReadonlyFlag"
                      // "condition":"model.currentStage == 'CreditAppraisal' || model.currentStage == 'DSCApproval' || model.currentStage == 'DSCOverride' || model.currentStage == 'KYCCheck'  || model.currentStage == 'RiskReviewAndLoanSanction'",
                        "orderNo": 750,
                        "items": {
                            'avgDailySaleAmount': {
                                key: "customer.enterprise.avgDailySaleAmount",
                                title: "TOTAL_MONTHLY_SURPLUS",
                                "type": "number",
                                "readonly": true
                            },
                            'ownerSalary': {
                                key: "customer.enterprise.ownerSalary",
                                title: "DEBT_SERVICE_RATIO",
                                "readonly":true,
                                "type": "text",
                                "onChange": function (value, form, model) {
                                    monthlySurpluse(model);
                                }
                            },
                            'avgMonthlyNetIncome': {
                                key: "customer.enterprise.avgMonthlyNetIncome",
                                title: "EMI Eligibility as per Net Business Surplus",
                                "type": "number",
                                "readonly": true
                            },
                            'estimatedEmi': {
                                key: "loanAccount.estimatedEmi",
                                title: "Affordable EMI as stated by the Customer",
                                "readonly":true,
                                "type": "number",
                                "onChange": function (value, form, model) {
                                    monthlySurpluse(model);
                                }
                            },
                            'workingDaysInMonth': {
                                key: "customer.enterprise.workingDaysInMonth",
                                title: "Final EMI Eligibility",
                                "type": "number",
                                "readonly": true
                            },
                            'coOwnerSalary': {
                                key: "customer.enterprise.coOwnerSalary",
                                title: "Actual EMI offered to the Borrower",
                                "type": "number",
                                "onChange": function (value, form, model) {
                                    monthlySurpluse(model);
                                }
                            },
                            'employeeSalary': {  
                                key: "customer.enterprise.employeeSalary",
                                title: "Loan Amount Eligible for the Customer",
                                "type": "number",
                                "readonly": true
                            },
                            'insurancePremiumAmount': {
                                key: "customer.enterprise.insurancePremiumAmount",
                                title: "Final Loan Amount Sanctioned ",
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
                    "PreliminaryInformation.emiEstimated",

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
                    "EnterpriseInformation.serviceTaxNumber",
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
                    "EstimatedSales.monthlyBusinessExpenses",
                    "EstimatedSales.initialEstimateMonthlySale",

                    "DailySales",
                    "DailySales.enterpriseDailySale",

                    "ReviewDailySales",
                    "ReviewDailySales.enterpriseDailySale",
    
                    "AnnualSales",
                    "AnnualSales.monthlySale",

                    "ReviewAnnualSales",
                    "ReviewAnnualSales.monthlySale",

                    "EnterpriseProductSale",
                    "EnterpriseProductSale.enterpriseProductSales",

                    "ReviewEnterpriseProductSale",
                    "ReviewEnterpriseProductSale.enterpriseProductSales",
                    
                    "MonthlyBusinessExpense",
                    "MonthlyBusinessExpense.monthlyBusinessExpense",

                    "ReviewMonthlyBusinessExpense",
                    "ReviewMonthlyBusinessExpense.monthlyBusinessExpense",

                    "OtherBusinessIncomes",
                    "OtherBusinessIncomes.otherBusinessIncomes",

                    "ReviewOtherBusinessIncomes",
                    "ReviewOtherBusinessIncomes.otherBusinessIncomes",

                    "PersonalExpenses",
                    "PersonalExpenses.personalExpenses",

                    "ReviewPersonalExpenses",
                    "ReviewPersonalExpenses.personalExpenses",

                    "LiabilityRepayment",
                    "LiabilityRepayment.liabilityRepayment",
                    //"LiabilityRepayment.liabilities.customerLiabilityRepayments",

                    "ReviewLiabilityRepayment",
                    "ReviewLiabilityRepayment.liabilityRepayment",
                    
                    "MonthlySalesCalculate",
                    "MonthlySalesCalculate.dailySales",
                    "MonthlySalesCalculate.dailySales.weeklySale",
                    "MonthlySalesCalculate.dailySales.monthlySale",
                    "MonthlySalesCalculate.productSales",
                    "MonthlySalesCalculate.productSales.totalMonthlySales",
                    "MonthlySalesCalculate.productSales.totalMonthlyCost",
                    "MonthlySalesCalculate.productSales.grossMarginSales",
                    "MonthlySalesCalculate.productSales.grossMarginCost",
                    "MonthlySalesCalculate.monthlySales",
                    "MonthlySalesCalculate.monthlySales.avgMonthlySales",
                    "MonthlySalesCalculate.monthlySales.avgAnnualSales",
                    "MonthlySalesCalculate.monthlySaleCalculation",
                    "MonthlySalesCalculate.monthlySaleCalculation.monthlySalesCal",
                    "MonthlySalesCalculate.monthlySaleCalculation.costOfGoodsSold",
                    "MonthlySalesCalculate.monthlySaleCalculation.grossProfit",

                    "OtherExpenseDetails",
                    "OtherExpenseDetails.monthlyBusinessExpense",
                    "OtherExpenseDetails.monthlyBusinessExpense.totalBusinessExpenses",
                    "OtherExpenseDetails.monthlyBusinessExpense.netBusinessIncome",
                    "OtherExpenseDetails.otherBusinessIncome",
                    "OtherExpenseDetails.otherBusinessIncome.totalMonthlyAdditionIncome",
                    "OtherExpenseDetails.otherBusinessIncome.additionalIncomeConsidered",
                    "OtherExpenseDetails.personalExpense",
                    "OtherExpenseDetails.personalExpense.totalPersonalExpense",
                    "OtherExpenseDetails.liability",
                    "OtherExpenseDetails.liability.totalEmiAmount",
                    "OtherExpenseDetails.liability.totalLoanAmount",

                    "NetBusinessIncome",
                    "NetBusinessIncome.netBusinessIncomeGrossMargin",
                    
                    "TotalMonthlySurplus",
                    "TotalMonthlySurplus.avgDailySaleAmount",
                    "TotalMonthlySurplus.ownerSalary",
                    "TotalMonthlySurplus.avgMonthlyNetIncome",
                    "TotalMonthlySurplus.estimatedEmi",
                    "TotalMonthlySurplus.workingDaysInMonth",
                    "TotalMonthlySurplus.coOwnerSalary",
                    "TotalMonthlySurplus.employeeSalary",
                ]
            }
            
            var configFile = function () {
                return {
                    "currentStage": {
                        "Screening":{
                            "excludes": [
                                "DailySales",
                                "AnnualSales",
                                "EnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "PersonalExpenses",
                                "LiabilityRepayment",
                                "ReviewAnnualSales",
                                "ReviewDailySales",
                                "ReviewEnterpriseProductSale",
                                "ReviewMonthlyBusinessExpense",
                                "ReviewOtherBusinessIncomes",
                                "ReviewPersonalExpenses",
                                "ReviewLiabilityRepayment",
                                "TotalMonthlySurplus",
                                "OtherExpenseDetails",
                                "MonthlySalesCalculate",
                                "NetBusinessIncome"
                            ],
                            "overrides":{

                            } 
                        },
                        "Application":{
                            "excludes": [
                                "DailySales",
                                "AnnualSales",
                                "EnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "PersonalExpenses",
                                "LiabilityRepayment",
                                "ReviewAnnualSales",
                                "ReviewDailySales",
                                "ReviewEnterpriseProductSale",
                                "ReviewMonthlyBusinessExpense",
                                "ReviewOtherBusinessIncomes",
                                "ReviewPersonalExpenses",
                                "ReviewLiabilityRepayment",
                                "TotalMonthlySurplus",
                                "OtherExpenseDetails",
                                "MonthlySalesCalculate",
                                "NetBusinessIncome"
                            ],
                            "overrides":{

                            } 
                        },
                        "CreditAppraisal": {
                            "excludes": [
                                "ReviewAnnualSales",
                                "ReviewDailySales",
                                "ReviewEnterpriseProductSale",
                                "ReviewMonthlyBusinessExpense",
                                "ReviewOtherBusinessIncomes",
                                "ReviewPersonalExpenses",
                                "ReviewLiabilityRepayment"
                            ],
                            "overrides":{
                            }
                        },
                        "DSCApproval": {
                            "excludes": [
                                "DailySales",
                                "AnnualSales",
                                "EnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "PersonalExpenses",
                                "LiabilityRepayment"
                            ],
                            "overrides": {
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "BankAccounts":{
                                    "readonly": true
                                },
                                "Liabilities":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                                "MonthlyBusinessExpense":{
                                    "readonly": true
                                },
                                "OtherBusinessIncomes":{
                                    "readonly": true
                                },
                                "PersonalExpenses":{
                                    "readonly": true
                                },
                                "LiabilityRepayment":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                }
                            }
                        },
                        "DSCOverride": {
                            "excludes": [
                                "DailySales",
                                "AnnualSales",
                                "EnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "PersonalExpenses",
                                "LiabilityRepayment"
                            ],
                            "overrides": {
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "BankAccounts":{
                                    "readonly": true
                                },
                                "Liabilities":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                                "MonthlyBusinessExpense":{
                                    "readonly": true
                                },
                                "OtherBusinessIncomes":{
                                    "readonly": true
                                },
                                "PersonalExpenses":{
                                    "readonly": true
                                },
                                "LiabilityRepayment":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                }
                            }
                        },
                        "KYCCheck": {
                            "excludes": [
                                "DailySales",
                                "AnnualSales",
                                "EnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "PersonalExpenses",
                                "LiabilityRepayment"
                            ],
                            "overrides": {
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "BankAccounts":{
                                    "readonly": true
                                },
                                "Liabilities":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                                "MonthlyBusinessExpense":{
                                    "readonly": true
                                },
                                "OtherBusinessIncomes":{
                                    "readonly": true
                                },
                                "PersonalExpenses":{
                                    "readonly": true
                                },
                                "LiabilityRepayment":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                }
                            }
                        },
                        "RiskReviewAndLoanSanction": {
                            "excludes": [
                                "DailySales",
                                "AnnualSales",
                                "EnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "PersonalExpenses",
                                "LiabilityRepayment"
                            ],
                            "overrides": {
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "BankAccounts":{
                                    "readonly": true
                                },
                                "Liabilities":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                                "MonthlyBusinessExpense":{
                                    "readonly": true
                                },
                                "OtherBusinessIncomes":{
                                    "readonly": true
                                },
                                "PersonalExpenses":{
                                    "readonly": true
                                },
                                "LiabilityRepayment":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                }
                            }
                        },
                        "BusinessTeamReview": {
                            "excludes": [
                                "DailySales",
                                "AnnualSales",
                                "EnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "PersonalExpenses",
                                "LiabilityRepayment"
                            ],
                            "overrides": {
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "BankAccounts":{
                                    "readonly": true
                                },
                                "Liabilities":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                                "MonthlyBusinessExpense":{
                                    "readonly": true
                                },
                                "OtherBusinessIncomes":{
                                    "readonly": true
                                },
                                "PersonalExpenses":{
                                    "readonly": true
                                },
                                "LiabilityRepayment":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                }
                            }
                        },
                        "CreditOfficerReview": {
                            "excludes": [
                                "DailySales",
                                "AnnualSales",
                                "EnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "PersonalExpenses",
                                "LiabilityRepayment"
                            ],
                            "overrides": {
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "BankAccounts":{
                                    "readonly": true
                                },
                                "Liabilities":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                                "MonthlyBusinessExpense":{
                                    "readonly": true
                                },
                                "OtherBusinessIncomes":{
                                    "readonly": true
                                },
                                "PersonalExpenses":{
                                    "readonly": true
                                },
                                "LiabilityRepayment":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                }
                            }
                        },
                        "CreditManagerReview": {
                            "excludes": [
                                "DailySales",
                                "AnnualSales",
                                "EnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "PersonalExpenses",
                                "LiabilityRepayment"
                            ],
                            "overrides": {
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "BankAccounts":{
                                    "readonly": true
                                },
                                "Liabilities":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                                "MonthlyBusinessExpense":{
                                    "readonly": true
                                },
                                "OtherBusinessIncomes":{
                                    "readonly": true
                                },
                                "PersonalExpenses":{
                                    "readonly": true
                                },
                                "LiabilityRepayment":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                }
                            }
                        },
                        "CBOCreditHeadReview": {
                            "excludes": [
                                "DailySales",
                                "AnnualSales",
                                "EnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "PersonalExpenses",
                                "LiabilityRepayment"
                            ],
                            "overrides": {
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "BankAccounts":{
                                    "readonly": true
                                },
                                "Liabilities":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                                "MonthlyBusinessExpense":{
                                    "readonly": true
                                },
                                "OtherBusinessIncomes":{
                                    "readonly": true
                                },
                                "PersonalExpenses":{
                                    "readonly": true
                                },
                                "LiabilityRepayment":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                }
                            }
                        },
                        "CEOMDReview": {
                            "excludes": [
                                "DailySales",
                                "AnnualSales",
                                "EnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "PersonalExpenses",
                                "LiabilityRepayment"
                            ],
                            "overrides": {
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "BankAccounts":{
                                    "readonly": true
                                },
                                "Liabilities":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                                "MonthlyBusinessExpense":{
                                    "readonly": true
                                },
                                "OtherBusinessIncomes":{
                                    "readonly": true
                                },
                                "PersonalExpenses":{
                                    "readonly": true
                                },
                                "LiabilityRepayment":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                }
                            }
                        },
                        "LoanInitiation": {
                            "excludes": [
                                "BankAccounts",
                                "Liabilities",
                                "BuyerDetails",
                                "SuppliersDeatils",
                                "PreliminaryInformation",
                                "EstimatedSales",
                                "DailySales",
                                "ReviewDailySales",
                                "AnnualSales",
                                "ReviewAnnualSales",
                                "EnterpriseProductSale",
                                "ReviewEnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "ReviewMonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "ReviewOtherBusinessIncomes",
                                "PersonalExpenses",
                                "ReviewPersonalExpenses",
                                "LiabilityRepayment",
                                "ReviewLiabilityRepayment",
                                "NetBusinessIncome"
                            ],
                            "overrides": {
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                                "MonthlyBusinessExpense":{
                                    "readonly": true
                                },
                                "OtherBusinessIncomes":{
                                    "readonly": true
                                },
                                "PersonalExpenses":{
                                    "readonly": true
                                },
                                "LiabilityRepayment":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                }
                            }
                        },
                        "DocumentUpload": {
                            "excludes": [
                                "BankAccounts",
                                "Liabilities",
                                "BuyerDetails",
                                "SuppliersDeatils",
                                "PreliminaryInformation",
                                "EstimatedSales",
                                "DailySales",
                                "ReviewDailySales",
                                "AnnualSales",
                                "ReviewAnnualSales",
                                "EnterpriseProductSale",
                                "ReviewEnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "ReviewMonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "ReviewOtherBusinessIncomes",
                                "PersonalExpenses",
                                "ReviewPersonalExpenses",
                                "LiabilityRepayment",
                                "ReviewLiabilityRepayment",
                                "NetBusinessIncome"
                            ],
                            "overrides": {
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                                "MonthlyBusinessExpense":{
                                    "readonly": true
                                },
                                "OtherBusinessIncomes":{
                                    "readonly": true
                                },
                                "PersonalExpenses":{
                                    "readonly": true
                                },
                                "LiabilityRepayment":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                }
                            }
                        },
                        "Checker1": {
                            "excludes": [
                                "BankAccounts",
                                "Liabilities",
                                "BuyerDetails",
                                "SuppliersDeatils",
                                "PreliminaryInformation",
                                "EstimatedSales",
                                "DailySales",
                                "ReviewDailySales",
                                "AnnualSales",
                                "ReviewAnnualSales",
                                "EnterpriseProductSale",
                                "ReviewEnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "ReviewMonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "ReviewOtherBusinessIncomes",
                                "PersonalExpenses",
                                "ReviewPersonalExpenses",
                                "LiabilityRepayment",
                                "ReviewLiabilityRepayment",
                                "NetBusinessIncome"
                            ],
                            "overrides": {
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                                "MonthlyBusinessExpense":{
                                    "readonly": true
                                },
                                "OtherBusinessIncomes":{
                                    "readonly": true
                                },
                                "PersonalExpenses":{
                                    "readonly": true
                                },
                                "LiabilityRepayment":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                }
                            }
                        },
                        "Checker2": {
                            "excludes": [
                                "BankAccounts",
                                "Liabilities",
                                "BuyerDetails",
                                "SuppliersDeatils",
                                "PreliminaryInformation",
                                "EstimatedSales",
                                "DailySales",
                                "ReviewDailySales",
                                "AnnualSales",
                                "ReviewAnnualSales",
                                "EnterpriseProductSale",
                                "ReviewEnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "ReviewMonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "ReviewOtherBusinessIncomes",
                                "PersonalExpenses",
                                "ReviewPersonalExpenses",
                                "LiabilityRepayment",
                                "ReviewLiabilityRepayment",
                                "NetBusinessIncome"
                            ],
                            "overrides": {
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                                "MonthlyBusinessExpense":{
                                    "readonly": true
                                },
                                "OtherBusinessIncomes":{
                                    "readonly": true
                                },
                                "PersonalExpenses":{
                                    "readonly": true
                                },
                                "LiabilityRepayment":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                }
                            }
                        },
                        "Rejected" : {
                            "excludes": [
                                "DailySales",
                                "AnnualSales",
                                "EnterpriseProductSale",
                                "MonthlyBusinessExpense",
                                "OtherBusinessIncomes",
                                "PersonalExpenses",
                                "LiabilityRepayment"
                            ],
                            "overrides": {
                                "PreliminaryInformation":{
                                    "readonly": true
                                },
                                "EnterpriseInformation": {
                                    "readonly": true
                                },
                                "ContactInformation":{
                                    "readonly": true
                                },
                                "BankAccounts":{
                                    "readonly": true
                                },
                                "Liabilities":{
                                    "readonly": true
                                },
                                "EnterpriseFinancials":{
                                    "readonly": true
                                },
                                "BuyerDetails":{
                                    "readonly": true
                                },
                                "SuppliersDeatils":{
                                    "readonly": true
                                },
                                "EstimatedSales":{
                                    "readonly": true
                                },
                                "MonthlySalesCalculate":{
                                    "readonly": true
                                },
                                "OtherExpenseDetails":{
                                    "readonly": true
                                },
                                "NetBusinessIncome":{
                                    "readonly": true
                                },
                                "TotalMonthlySurplus":{
                                    "readonly": true
                                },
                            }
                        }
                    }
                }
            }

            var getthisObject = function (model, form, formCtrl, bundlePageObj, bundleModel) {
                object.initialize(model, form, formCtrl, bundlePageObj, bundleModel);
            }


            var object = {
                "type": "schema-form",
                "title": "ENTITY_ENROLLMENT",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                    if (bundlePageObj) {
                        model._bundlePageObj = _.cloneDeep(bundlePageObj);
                    }
                    /* Setting data recieved from Bundle */
                    model.loanCustomerRelationType = "Customer";
                    model.currentStage = (bundleModel) ?  bundleModel.currentStage : model.currentStage ;  
                    // model.currentStage =  'KYCCheck';
                    /* End of setting data recieved from Bundle */

                    /* Setting data for the form */
                    model.loanAccount = model.loanProcess.loanAccount;
                    model.customer = model.enrolmentProcess.customer;
                  //  model.customer.isCaptured = false ;
                    model.customer.isCreditAppraisal = false;
                    model.customer.customerType = "Enterprise";         
                    computeEstimatedEmi(model);
                    model.customer.customerBranchId = SessionStore.getCurrentBranch().branchId;
                    model.customer.branchName = SessionStore.getCurrentBranch().branchName;
                    var centre = SessionStore.getCentres();
                    if(centre.length > 0)
                    {
                        model.customer.centreId = centre[0].centreCode;
                        model.customer.centreName = centre[0].centreName;                        
                    }
                    model.centreName = model.customer.centreName ;
                    var branchId = SessionStore.getBranchId();
                    if (branchId && !model.customer.customerBranchId) {
                        model.customer.customerBranchId = branchId;
                    };
                    model.customer['enterpriseDailySale'] = []
                   // model.customer['enterpriseDailySales'] = []
                   // model.customer['enterpriseMonthlySales'] = []
                    model.customer['monthlySale'] = []
                   // model.customer['enterpriseProductSales'] = []
                    model.customer['monthlyBusinessExpense'] = []
                    model.customer['liabilityRepayment'] = [];
                    model.customer['personalExpenses'] = []
                    model.customer['totalMonthlySurplus'] = '';
                    model.customer['debtServiceRatio'] = '';
                    // model.customer.enterprise = {
                        
                    // }
                   
                    if (model.loanAccount.currentStage == 'Screening' && _.hasIn(model, 'loanProcess.applicantEnrolmentProcess') && model.loanProcess.applicantEnrolmentProcess !=null){
                        model.applicantEnrolmentProcessDetails = {}; 
                        model.applicantEnrolmentProcessDetails=model.loanProcess.applicantEnrolmentProcess.customer;
                        model.customer.customerBankAccounts=model.applicantEnrolmentProcessDetails.customerBankAccounts;
                    }

                    if(model.customer.enterprise == null){
                        model.customer.enterprise = {}; 
                    }
                    model.customer.enterprise.businessType  = "Services";
                    computeTotalMonthlySurpluse("value","form",model);
                    if(model.currentStage != 'Screening' && model.currentStage != 'Application' && model.currentStage != 'CreditAppraisal'){
                        model.customer.enterprise.ownerSalary = "67%";
                        model.customer.enterprise.initialEstimateMonthlySale = (model.customer.enterprise.monthlyBusinessExpenses) ? Number(model.customer.enterprise.monthlyBusinessExpenses * 4):0;
                        if(model.customer.enterprise){
                            model.customer.enterprise.serviceTaxNumber = model.customer.enterprise.serviceTaxNumber? model.customer.enterprise.serviceTaxNumber:null;
                            model.customer.enterprise.monthlyBusinessExpenses = model.customer.enterprise.monthlyBusinessExpenses? Number(model.customer.enterprise.monthlyBusinessExpenses):0;
                            model.customer.enterprise.insurancePremiumAmount = model.customer.enterprise.insurancePremiumAmount? Number(model.customer.enterprise.insurancePremiumAmount):0;
                            model.customer.enterprise.coOwnerSalary = model.customer.enterprise.coOwnerSalary? Number(model.customer.enterprise.coOwnerSalary):0;
                        }
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
                                model.customer.monthlyBusinessExpense.push({ 'expenditureSource': busineeExpenseMonthly[i] ,'annualExpenses':0});
                            }
    
                            var personalExpense = ['Living Expenses (Food, Clothing, etc.)', 'Education', 'Rent & Electricity', 'Mobile / Telephone', 'Medical expenses'];
                            for (i in personalExpense) {
                                model.customer.personalExpenses.push({ 'expenditureSource': personalExpense[i],'annualExpenses':0});
                            }
                        }
    
                        // var  otherBusinessIncome  = ['Monthly Rental Income','Avg. Monthly Agricultural Income','Income of the Spouse on Monthly basis','Other Income per month PENSION'];// get invalid error
                      //  model.customer.otherBusinessIncomes=[]
                        if (model.customer.otherBusinessIncomes.length == 0){
                            var otherBusinessIncome = ['Dairy', 'Shop Owner', 'Unemployed', 'Fishing'];
                            for (i in otherBusinessIncome) {
                                model.customer.otherBusinessIncomes.push({ 'incomeSource': otherBusinessIncome[i], 'otherBusinessIncomeDate': "2017-11-01", 'amount': 0 });
                            }
                        }
                       var sales = ['High', 'Medium', 'Low']
                        for (i in sales) {
                            model.customer.enterpriseDailySale.push({ salesType: sales[i], 'total': 0 })
                        }
                      //  model.customer.monthlySale = [];
                        for (i in sales) {
                            model.customer.monthlySale.push({ seasonType: sales[i], 'total': 0 })
                        }
    
                        if (model.customer.enterpriseDailySales.length != 0) {
                            _.forEach(model.customer.enterpriseDailySales, function (dailysales) {
                                var sales = dailysales;
                                if (dailysales.salesType == 'High' ? (i = 1) : (dailysales.salesType == 'Medium' ? (i = 2) : (i = 3))) {
                                    for (var key of Object.keys(dailysales)) {
                                        if(key == 'day' && dailysales[key] != 'undefined'){
                                       // if (dailysales[key] != 'undefined' && key != 'salesType' && key != 'totalSales') {
                                            day = dailysales[key]
                                            model.customer.enterpriseDailySale[i - 1][day] = sales.totalSales;
                                            model.customer.enterpriseDailySale[i - 1]["total"] += sales.totalSales;
                                        }
                                    }
                                }
                            })
                            getDialySalesDetails(' ', model, ' ', " ");
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
                        if(model.customer.liabilities.length >  0 && model.customer.liabilities[0].customerLiabilityRepayments){
                            model.customer.enterprise.totalLoanAmount = 0;
                            model.customer.enterprise.totalEmiAmount = 0;
                            _.forEach(model.customer.liabilities[0].customerLiabilityRepayments,function(liability){
                                liability.udf1 = Number(liability.udf1);
                                model.customer.liabilityRepayment.push(liability)
                                model.customer.enterprise.totalLoanAmount = model.customer.enterprise.totalLoanAmount + Number(liability.udf1);
                                model.customer.enterprise.totalEmiAmount = model.customer.enterprise.totalEmiAmount + liability.emiAmount;
                            })
                        }
                        if(model.customer.otherBusinessIncomes.length !=0){
                            getBusinessExpenseData('value', model, 'row');
                            getPersonalExpenses('value', model, 'row');
                            getOtherBusinessIncomeDet('', model, '') ;
                        }
                        monthlySurpluse(model)
                        if(model.customer.enterprise.employeeSalary && model.customer.enterprise.employeeSalary>0){
                            model.customer.isCreditAppraisal = true
                            // BundleManager.pushEvent('business-capture', model._bundlePageObj, {customer: model.customer});
                        }
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
                                    "condition": "model.customer.currentStage && (model.currentStage=='Screening' || model.currentStage=='Application' || model.currentStage=='CreditAppraisal' || (model.currentStage=='GuarantorAddition' && model.pageClass=='guarantor'))",
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
                                    if (_.hasIn(model, 'customer.enterpriseCustomerRelations') && model.customer.enterpriseCustomerRelations !=null){
                                    model.customer.enterpriseCustomerRelations[0].linkedToCustomerId = params.customer.id;
                                    model.customer.enterpriseCustomerRelations[0].linkedToCustomerName = params.customer.firstName;
                                    }
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
                                // model.enrolmentProcess = enrolmentProcess;
                                // model.customer = enrolmentProcess.customer;

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
                        if(params.customer.fcuStatus){
                            model.customer.mobilePhone = params.customer.mobilePhone;
                            model.customer.landLineNo = params.customer.landLineNo;
                            model.customer.doorNo = params.customer.doorNo;
                            model.customer.street = params.customer.street;
                            model.customer.postOffice = params.customer.postOffice;
                            model.customer.landmark = params.customer.landmark;
                            model.customer.locality = params.customer.locality;
                            model.customer.pincode = params.customer.pincode;
                            model.customer.villageName = params.customer.villageName;
                            model.customer.district = params.customer.district;
                            model.customer.state = params.customer.state;
                        }
                        else{
                            model.customer.mobilePhone = null;
                            model.customer.landLineNo = null;
                            model.customer.doorNo = null;
                            model.customer.street = null;
                            model.customer.postOffice = null;
                            model.customer.landmark = null;
                            model.customer.locality = null;
                            model.customer.pincode = null;
                            model.customer.villageName = null;
                            model.customer.district =null;
                            model.customer.state = null;
                        }
                    
                    },
                    "load-bank-details-business": function (bundleModel, model, params) {
                        if (_.hasIn(model, 'loanProcess.applicantEnrolmentProcess') && model.loanProcess.applicantEnrolmentProcess !=null){
                            model.applicantEnrolmentProcessDetails = {}; 
                            model.applicantEnrolmentProcessDetails=model.loanProcess.applicantEnrolmentProcess.customer;
                            model.customer.customerBankAccounts=model.applicantEnrolmentProcessDetails.customerBankAccounts;
                        }
                    },
                    "refresh-all-tabs-customer": function (bundleModel, model, params) {
                        clearAll('customer',['firstName',"distanceFromBranch","mobilePhone","landLineNo","doorNo","street","landmark","pincode","locality","villageName","district","state"],model);
                        model.customer.enterprise.companyOperatingSince=null;
                        model.customer.enterprise.ownership=null;
                        model.customer.enterprise.businessConstitution=null;
                        model.customer.enterprise.serviceTaxNumber=null;
                        model.customer.enterprise.noOfPartners=null;
                        model.customer.enterprise.companyRegistered=null;
                        model.customer.customerBankAccounts=[];
                        model.customer.enterpriseDocuments=[];                        
                        model.customer.liabilities=[];
                        model.customer.enterpriseRegistrations=[];   
                                             
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
                         var reqData = _.cloneDeep(model);

                        if (!(validateRequest(reqData))) {
                            return;
                        }
                        model.customer.enterprise.ownerSalary = 67;
                        // for (i in model.customer.enterpriseRegistrations){
                        //     if(model.customer.enterpriseRegistrations[i].registeredDate > model.customer.enterpriseRegistrations[i].expiryDate){
                        //         PageHelper.showErrors({data:{error:"Registration date cant be greater than valid upto date...."}});
                        //         return false;
                        //     } 
                        // }
                        var dateFlag;     
                        if (model.customer.enterpriseRegistrations != 'undefined' && model.customer.enterpriseRegistrations != null)
                        {                            
                            model.customer.enterpriseRegistrations.map((epReg => {
                                if(epReg.registeredDate > epReg.expiryDate){
                                    dateFlag = true;
                                }
                            }))
                        }               
                        if(dateFlag){
                            PageHelper.showErrors({data:{error:"Registration date cant be greater than valid upto date...."}});   
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
                                        model.loanProcess.loanAccount.customerId = enrolmentProcess.customer.id;
                                        model.enrolmentProcess.customer.centreName =  model.centreName
                                        model.customer.centreName =  model.centreName
                                        
                                        model.customer.isCaptured = true
                                        BundleManager.pushEvent('business-capture', model._bundlePageObj, {customer: model.customer}); 
                                        
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
                    proceed: function (model, form, formCtrl, bundlePageObj, bundleModel) {
                        PageHelper.clearErrors();
                        if (PageHelper.isFormInvalid(form)) {
                            return false;
                        }
                        model.customer.expenditures = [];
                        model.customer.enterpriseMonthlySales = []

                        if (model.currentStage && model.currentStage == "CreditAppraisal" && model.loanAccount.productCategory == 'MEL' && model.customer.enterprise.employeeSalary<=0){
                            PageHelper.showProgress("loan-enrolment","Loan Amount Eligible for customer should be more than zero amount",5000);
                                return false;    
                        }

                         var reqData = _.cloneDeep(model);

                        if (!(validateRequest(reqData))) {
                            return;
                        }
                        model.customer.enterprise.ownerSalary = 67;
                        PageHelper.showProgress('enrolment', 'Updating Customer',5000);
                        PageHelper.showLoader();
                        _.forEach(model.customer.monthlySale, function (monthlysale) {
                            for (const key of Object.keys(monthlysale)) {
                                monthlysales = {}
                                if (monthlysale[key] != 'undefined' && monthlysale[key] != null  && key != 'seasonType' && key != 'total') {
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
                                if (dailySale[key] != 'undefined' && dailySale[key] != null && key != 'salesType' && key != 'total') {
                                    dailySales['salesType'] = dailySale['salesType'];
                                    dailySales['day'] = key;
                                    dailySales['totalSales'] = dailySale[key]
                                }
                                if (!_.isEmpty(dailySales)) {
                                    model.customer.enterpriseDailySales.push(dailySales);
                                }
                            }
                        })
                        _.forEach(model.customer.monthlyBusinessExpense, function (expenses) {
                                model.customer.expenditures.push(expenses)
                        })
                        _.forEach(model.customer.personalExpenses, function (expenses) {
                                model.customer.expenditures.push(expenses)
                        })
                        var customerLiabilityRepayment = []
                        _.forEach(model.customer.liabilityRepayment, function (liability) {
                            customerLiabilityRepayment.push(liability)
                        })
                        if(customerLiabilityRepayment.length > 0 && model.customer.liabilities.length > 0){
                            model.customer.liabilities[0]['customerLiabilityRepayments']=customerLiabilityRepayment;
                        }
                        else if(customerLiabilityRepayment.length > 0 && model.customer.liabilities.length == 0){
                            model.customer.liabilities.push({'customerLiabilityRepayments':customerLiabilityRepayment})
                        }
                        
                        model.enrolmentProcess.customer = model.customer;
                        model.enrolmentProcess.proceed()
                            .finally(function () {
                                PageHelper.hideLoader();
                                model.customer.centreName = model.centreName
                            })
                            .subscribe(function (enrolmentProcess) {
                                model.customer.centreName =  model.customer.centreName
                                PageHelper.showProgress('enrolment', 'Done.', 5000);
                                PageHelper.clearErrors();
                                
                                model.customer.isCaptured = true
                                BundleManager.pushEvent('business-capture', model._bundlePageObj, {customer: model.customer});
                                if(model.currentStage == 'CreditAppraisal'){   
                                    model.customer.isCreditAppraisal = true
                                    BundleManager.pushEvent('business-capture', model._bundlePageObj, {customer: model.customer});
                                    getthisObject(model, form, formCtrl, bundlePageObj, bundleModel);
                                }

                                BundleManager.pushEvent(model._bundlePageObj.pageClass + "-updated", model._bundlePageObj, enrolmentProcess);
                            }, function (err) {
                                PageHelper.showErrors(err);
                                PageHelper.showProgress('enrolment', err, 5000);
                                PageHelper.hideLoader();
                            });
                    }

                }
            }

            return object;
        }
    }
});

