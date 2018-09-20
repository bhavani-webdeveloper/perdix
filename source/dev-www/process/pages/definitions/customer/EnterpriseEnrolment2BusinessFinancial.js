irf.pageCollection.factory(irf.page("customer.EnterpriseEnrolment2BusinessFinancial"),
    ["$log", "$q", "Enrollment", 'EnrollmentHelper', 'PageHelper', 'formHelper', "elementsUtils",
        'irfProgressMessage', 'SessionStore', "$state", "$stateParams", "Queries", "Utils", "CustomerBankBranch", "BundleManager", "Dedupe", "$filter",
        function ($log, $q, Enrollment, EnrollmentHelper, PageHelper, formHelper, elementsUtils,
            irfProgressMessage, SessionStore, $state, $stateParams, Queries, Utils, CustomerBankBranch, BundleManager, Dedupe, $filter) {
            return {
                "type": "schema-form",
                "title": "ENTITY_ENROLLMENT",
                "subTitle": "BUSINESS",
                initialize: function (model, form, formCtrl, bundlePageObj, bundleModel) {

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

                },
                form: [{
                        type: "box",
                        colClass: "col-sm-12",
                        title: "BANK_ACCOUNTS",
                        items: [{
                            key: "customer.customerBankAccounts",
                            type: "array",
                            title: "BANK_ACCOUNTS",
                            startEmpty: true,
                            onArrayAdd: function (modelValue, form, model, formCtrl, $event) {
                                modelValue.bankStatements = [];
                                var CBSDateMoment = moment(SessionStore.getCBSDate(), SessionStore.getSystemDateFormat());
                                var noOfMonthsToDisplay = 6;
                                var statementStartMoment = CBSDateMoment.subtract(noOfMonthsToDisplay, 'months').startOf('month');
                                for (var i = 0; i < noOfMonthsToDisplay; i++) {
                                    modelValue.bankStatements.push({
                                        startMonth: statementStartMoment.format(SessionStore.getSystemDateFormat())
                                    });
                                    statementStartMoment = statementStartMoment.add(1, 'months').startOf('month');
                                }
                            },
                            items: [{
                                    key: "customer.customerBankAccounts[].ifscCode",
                                    type: "lov",
                                    lovonly: true,
                                    required: true,
                                    inputMap: {
                                        "ifscCode": {
                                            "key": "customer.customerBankAccounts[].ifscCode"
                                        },
                                        "bankName": {
                                            "key": "customer.customerBankAccounts[].customerBankName"
                                        },
                                        "branchName": {
                                            "key": "customer.customerBankAccounts[].customerBankBranchName"
                                        }
                                    },
                                    outputMap: {
                                        "bankName": "customer.customerBankAccounts[arrayIndex].customerBankName",
                                        "branchName": "customer.customerBankAccounts[arrayIndex].customerBankBranchName",
                                        "ifscCode": "customer.customerBankAccounts[arrayIndex].ifscCode"
                                    },
                                    searchHelper: formHelper,
                                    search: function (inputModel, form) {
                                        $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                                        var promise = CustomerBankBranch.search({
                                            'bankName': inputModel.bankName,
                                            'ifscCode': inputModel.ifscCode,
                                            'branchName': inputModel.branchName
                                        }).$promise;
                                        return promise;
                                    },
                                    getListDisplayItem: function (data, index) {
                                        return [
                                            data.ifscCode,
                                            data.branchName,
                                            data.bankName
                                        ];
                                    }
                                },
                                {
                                    key: "customer.customerBankAccounts[].customerBankName",
                                    required: true,
                                    readonly: true
                                },
                                {
                                    key: "customer.customerBankAccounts[].customerBankBranchName",
                                    required: true,
                                    readonly: true
                                },
                                {
                                    key: "customer.customerBankAccounts[].customerNameAsInBank"
                                },
                                {
                                    key: "customer.customerBankAccounts[].accountNumber",
                                    type: "password",
                                    inputmode: "number",
                                    numberType: "tel"
                                },
                                {
                                    key: "customer.customerBankAccounts[].confirmedAccountNumber",
                                    "title": "CONFIRMED_ACCOUNT_NUMBER",
                                    inputmode: "number",
                                    numberType: "tel"
                                },
                                {
                                    key: "customer.customerBankAccounts[].accountType",
                                    type: "select"
                                },
                                {
                                    key: "customer.customerBankAccounts[].bankingSince",
                                    type: "date",
                                    title: "BANKING_SINCE"
                                },
                                {
                                    key: "customer.customerBankAccounts[].netBankingAvailable",
                                    type: "select",
                                    title: "NET_BANKING_AVAILABLE",
                                    enumCode: "decisionmaker"
                                },
                                {
                                    key: "customer.customerBankAccounts[].sanctionedAmount",
                                    condition: "model.customer.customerBankAccounts[arrayIndex].accountType =='OD'||model.customer.customerBankAccounts[arrayIndex].accountType =='CC'",
                                    type: "amount",
                                    required: true,
                                    title: "OUTSTANDING_BALANCE"
                                },
                                {
                                    key: "customer.customerBankAccounts[].limit",
                                    type: "amount"
                                },
                                {
                                    key: "customer.customerBankAccounts[].bankStatements",
                                    type: "datatable",
                                    title: "STATEMENT_DETAILS",
                                    // titleExpr: "moment(model.customer.customerBankAccounts[arrayIndexes[0]].bankStatements[arrayIndexes[1]].startMonth).format('MMMM YYYY') + ' ' + ('STATEMENT_DETAILS' | translate)",
                                    // titleExprLocals: {moment: window.moment},
                                    startEmpty: true,
                                    dtlConfig: {
                                        columnsFn: function () {
                                            return $q.resolve({
                                                "dtlKeyvalue": "STATEMENT_DETAILS",
                                                "columns": [{
                                                        prop: "startMonth",
                                                        type: "date",
                                                        name: "START_MONTH"
                                                    },
                                                    {
                                                        prop: "totalDeposits",
                                                        type: "number",
                                                        calculator: true,
                                                        creditDebitBook: true,
                                                        // onDone: function(result, model, context){
                                                        //         model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalDeposits = result.totalCredit;
                                                        //         model.customer.customerBankAccounts[context.arrayIndexes[0]].bankStatements[context.arrayIndexes[1]].totalWithdrawals = result.totalDebit;
                                                        // },
                                                        name: "TOTAL_DEPOSITS"
                                                    },
                                                    {
                                                        prop: "totalWithdrawals",
                                                        type: "number",
                                                        name: "TOTAL_WITHDRAWALS"
                                                    },
                                                    {
                                                        prop: "balanceAsOn15th",
                                                        type: "number",
                                                        name: "BALENCE_AS_ON_REQUESTED_EMI_DATE"
                                                    },
                                                    {
                                                        prop: "noOfChequeBounced",
                                                        type: "number",
                                                        //maximum:99,
                                                        required: true,
                                                        name: "NO_OF_CHEQUE_BOUNCED"
                                                    },
                                                    {
                                                        prop: "noOfEmiChequeBounced",
                                                        type: "number",
                                                        required: true,
                                                        //maximum:99,
                                                        name: "NO_OF_EMI_CHEQUE_BOUNCED"
                                                    },
                                                    {
                                                        prop: "bankStatementPhoto",
                                                        type: "file",
                                                        required: true,
                                                        name: "BANK_STATEMENT_UPLOAD",
                                                        fileType: "application/pdf",
                                                        "category": "CustomerEnrollment",
                                                        "subCategory": "IDENTITYPROOF",
                                                        using: "scanner",
                                                        offline: true
                                                    },
                                                ]
                                            })
                                        }
                                    }
                                },
                                {
                                    key: "customer.customerBankAccounts[].isDisbersementAccount",
                                    type: "checkbox"
                                }
                            ]
                        }]
                    },
                    {
                        type: "box",
                        colClass: "col-sm-12",
                        title: "T_BUSINESS_FINANCIALS",
                        items: [{
                                key: "customer.enterprise.monthlyTurnover",
                                title: "MONTHLY_TURNOVER",
                                required: true,
                                type: "amount"
                            },
                            {
                                key: "customer.enterprise.monthlyBusinessExpenses",
                                title: "MONTHLY_BUSINESS_EXPENSES",
                                type: "amount"
                            },
                            {
                                key: "customer.enterprise.avgMonthlyNetIncome",
                                title: "AVERAGE_MONTHLY_NET_INCOME",
                                type: "amount"
                            },
                            {
                                type: "section",
                                title: "INCOME_EXPENSE_INFORMATION",
                                items: [{
                                    key: "customer.otherBusinessIncomes",
                                    type: "array",
                                    startEmpty: true,
                                    title: "OTHER_BUSINESS_INCOME",
                                    items: [{
                                            key: "customer.otherBusinessIncomes[].incomeSource",
                                            title: "INCOME_SOURCE",
                                            type: "select",
                                            required: true,
                                            enumCode: "occupation"
                                        },
                                        {
                                            key: "customer.otherBusinessIncomes[].amount",
                                            title: "AMOUNT",
                                            required: true,
                                            type: "amount"
                                        },
                                        {
                                            key: "customer.otherBusinessIncomes[].otherBusinessIncomeDate",
                                            title: "DATE",
                                            type: "date"
                                        },
                                    ]
                                }]
                            }
                            
                        ]
                    },
                    {
                        type: "box",
                        colClass: "col-sm-12",
                        title: "INCOME_THROUGH_SALES",
                        items: [{
                            key: "customer.incomeThroughSales",
                            type: "datatable",
                            dtlConfig: {
                                columnsFn: function () {
                                    return $q.resolve({
                                        "dtlKeyvalue": "INCOME_THROUGH_SALES",
                                        "columns": [{
                                                name: "BUYER_NAME",
                                                prop: "buyerName",
                                                type: "select-typeahead",
                                                isTypeaheadSelect: true,
                                                exprValue: "buyerName",
                                                typeaheadEditable: true,
                                                getListOptions: function(model){
                                                    return $q.when(model.customer.buyerDetails).then(function(value){
                                                        var options = [];
                                                        for(i=0;i<value.length;i++){
                                                            options.push(value[i].buyerName);
                                                        }
                                                        return options;
                                                    });
                                                }
                                            },
                                            {
                                                prop: "incomeType",
                                                name: "INCOME_TYPE",
                                                type: "select",
                                                exprValue: "value",
                                                enumCode: "salesincome_income_type",
                                                getListOptions: function (model) {
                                                    return $q.when(formHelper.enum("salesincome_income_type")).then(function(value){
                                                        var options= [];
                                                        for(i=0;i<value.data.length;i++){
                                                            options.push(value.data[i].value);
                                                        }
                                                        return options;
                                                    });
                                               },
                                            },
                                            {
                                                prop: "invoiceType",
                                                name: "INVOICE_TYPE",
                                                exprValue:"value",
                                                type: "select",
                                                enumCode: "salesincome_invoice_type",
                                                getListOptions: function(model){
                                                    return $q.when(formHelper.enum("salesincome_invoice_type")).then(function(value){
                                                        var options = [];
                                                        console.log(value);
                                                        for(i=0;i<value.data.length;i++){
                                                            if(value.data[i].parentCode == model.customer.enterprise.businessType){
                                                                options.push(value.data[i].value);
                                                            }
                                                        }
                                                        return options;
                                                    });
                                                }
                                                // parentValueExpr: "model.customer.enterprise.businessType"
                                            },
                                            {
                                                prop: "amount",
                                                name: "AMOUNT",
                                                type: "number",
                                                calculator: true,
                                                creditDebitBook: true,
                                            },
                                            {
                                                prop: "incomeSalesDate",
                                                name: "DATE",
                                                type: "date",

                                            },
                                            {
                                                prop: "invoiceDocId",
                                                type: "file",
                                                // condition: "model.customer.incomeThroughSales[arrayIndex].incomeType =='Cash'",
                                                name: "INVOICE_DOCUMENT",
                                                fileType: "application/pdf",
                                                "category": "CustomerEnrollment",
                                                "subCategory": "IDENTITYPROOF",
                                                using: "scanner",
                                                offline: true
                                            },
                                            // {   
                                            //     type: 'actions',
                                            //     prop: 'delete',
                                            //     name: 'Delete',
                                            //     buttonName: 'Delete',
                                            //     doAction : function(cell,row,col,model,parentModel){
                                            //         alert("Don't press me I am Row Number "+ model.indexOf(row));

                                            //     }
                                            // }
                                        ]
                                    })
                                }
                            }
                        }]
                    },
                    {
                        type: "box",
                        colClass: "col-sm-12",
                        title: "EXPENSES",
                        items: [{
                                key: "customer.expenditures",
                                type: "datatable",
                                dtlConfig: {
                                    columnsFn: function () {
                                        return $q.resolve({
                                            "dtlKeyvalue": "EXPENSES",
                                            "columns": [{
                                                    prop: "expenditureSource",
                                                    name: "EXPENDITURE_SOURCE",
                                                    type: "select",
                                                    getListOptions: function(model){
                                                        return $q.when(formHelper.enum("business_expense")).then(function(value){
                                                            var options = [];
                                                            for(i=0;i<value.data.length;i++){
                                                            
                                                                options.push(value.data[i].value);
                                                            }
                                                            return options;
                                                        });
                                                    },
                                                    enumCode: "business_expense"
                                                },
                                                {
                                                    prop: "annualExpenses",
                                                    name: "AMOUNT",
                                                    type: "number"
                                                },
                                                {
                                                    prop: "frequency",
                                                    name: "FREQUENCY",
                                                    type: "select",
                                                    getListOptions: function(model){
                                                        return $q.when(formHelper.enum("frequency")).then(function(value){
                                                            var options = [];
                                                            for(i=0;i<value.data.length;i++){
                                                                options.push(value.data[i].value);
                                                            }
                                                            return options;
                                                        });
                                                    },
                                                    enumCode: "frequency"
                                                },
                                                {
                                                    prop: "billDocId",
                                                    type: "file",
                                                    name: "BILLS",
                                                    fileType: "application/pdf",
                                                    "category": "CustomerEnrollment",
                                                    "subCategory": "IDENTITYPROOF",
                                                    using: "scanner",
                                                    offline: true
                                                }
                                            ]
                                        })
                                    }
                                }
                            }

                        ]
                    },
                    {
                        type: "box",
                        colClass: "col-sm-12",
                        title: "PURCHASES",
                        items: [{
                            key: "customer.rawMaterialExpenses",
                            type: "datatable",
                            dtlConfig: {
                                columnsFn: function () {
                                    return $q.resolve({
                                        "dtlKeyvalue": "PURCHASES",
                                        "columns": [{
                                                prop: "vendorName",
                                                type: "select-typeahead",
                                                isTypeaheadSelect: true,
                                                typeaheadExpr:"supplierName",
                                                name: "VENDOR_NAME",
                                                getListOptions: function(model){
                                                    return $q.when(model.customer.supplierDetails).then(function(value){
                                                        var options = [];
                                                        for(i=0;i<value.length;i++){
                                                            options.push(value[i].supplierName);
                                                        }
                                                        return options;
                                                    });
                                                }
                                            },
                                            {
                                                prop: "rawMaterialType",
                                                name: "TYPE",
                                                type: "select",
                                                getListOptions: function(model){
                                                    return $q.when(formHelper.enum("salesincome_income_type")).then(function(value){
                                                        var options = [];
                                                        for(i=0;i<value.data.length;i++){
                                                            options.push(value.data[i].value);
                                                        }
                                                        return options;
                                                    });
                                                },
                                                enumCode: "salesincome_income_type",
                                            },
                                            {
                                                prop: "amount",
                                                name: "AMOUNT",
                                                type: "number"
                                            },
                                            {
                                                prop: "rawMaterialDate",
                                                name: "DATE",
                                                type: "date"
                                            },
                                            {
                                                prop: "invoiceDocId",
                                                name: "PURCHASE_BILLS",
                                                "condition": "model.customer.rawMaterialExpenses[arrayIndex].rawMaterialType != 'Cash'",
                                                "category": "Loan",
                                                "subCategory": "DOC1",
                                                type: "file",
                                                fileType: "application/pdf",
                                                using: "scanner",
                                                offline: true
                                            }
                                        ]
                                    })
                                }
                            }
                        }]
                    },
                    {
                        "type": "actionbox",
                        "condition": "!model.customer.id",
                        "items": [{
                            "type": "button",
                            "icon": "fa fa-circle-o",
                            "title": "SUBMIT",
                            "onClick": "actions.save(model,formCtrl,form,$event)",
                            "buttonType": "submit"
                        }]
                    },
                    {
                        "type": "actionbox",
                        "condition": "model.customer.id",
                        "items": [{
                            "type": "submit",
                            "title": "COMPLETE_ENROLMENT"
                        }]
                    }
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
                    save: function (model, formCtrl, form, $event) {
                        var financialModelObject = {
                            $customerId: model.customer.id,
                            model: model,
                            formCtrl: formCtrl,
                            form: form,
                            $event: $event
                        }
                        BundleManager.broadcastEvent('new-financial', financialModelObject);
                    },
                    submit: function (model, form, formName) {
                        var financialModelObject = {
                            'customerId': model.customer.id,
                            model: model,
                            form: form,
                            formName: formName
                        }
                        BundleManager.broadcastEvent('new-financial', financialModelObject);
                    }
                }
            };
        }
    ]);