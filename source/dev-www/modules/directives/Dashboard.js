irf.pageCollection.directive("irfPvDashboard", function () {
    return {
        restrict: 'E',
        scope: {
            visualizationData: '='
          },
        templateUrl: 'modules/directives/templates/irf-pv-dashboard.html',
        controller: 'irfPvDashboardController'
    }
}).controller('irfPvDashboardController', ["$scope", "VisualizationCodeResource", "$q", function ($scope, VisualizationCodeResource, $q) {
    var deferred = $q.defer();
    VisualizationCodeResource.getDashboardData({
        "dashboardName": "los_business_financials_1",
        "parameters": {
            "CustomerId": $scope.visualizationData.customerId,
            "LoanId": $scope.visualizationData.loanId,
            // "CustomerId": 11791,
            // "LoanId": 6396
        }
    }).$promise.then(function (res) {
        $scope.dashboardData = res;
        deferred.resolve();
    }, function (err) {
        Utils.alert(err.data.error).finally(function () {
            deferred.reject();
        });
    });
// $scope.dashboardData = {
//     "sections": [
//         {
//             "displayName": "Grid Data",
//             "sectionName": "cash_flow_summary_grid",
//             "type": "container",
//             "width": "col2",
//             "parent": "",
//             "section": [
//                 {
//                     "sectionName": "invoice_vs_cash_grid",
//                     "parent": "cash_flow_summary_grid",
//                     "type": "grid",
//                     "width": "col2",
//                     "data": [
//                         {
//                             "title": "August-2016",
//                             "data": "530000.00"
//                         },
//                         {
//                             "title": "July-2016",
//                             "data": "435000.00"
//                         },
//                         {
//                             "title": "June-2016",
//                             "data": "395000.00"
//                         },
//                         {
//                             "title": "November-2016",
//                             "data": "525000.00"
//                         },
//                         {
//                             "title": "October-2016",
//                             "data": "541000.00"
//                         },
//                         {
//                             "title": "September-2016",
//                             "data": "435000.00"
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "displayName": "Pie Data",
//             "sectionName": "cash_flow_summary_grid_pie",
//             "type": "container",
//             "width": "col1",
//             "parent": "",
//             "section": [
//                 {
//                     "sectionName": "invoice_vs_cash_pie1",
//                     "parent": "cash_flow_summary_grid_pie",
//                     "subType": "pie",
//                     "type": "chart",
//                     "width": "col3",
//                     "data": {
//                         "XLabels": [
//                             "August-2016",
//                             "July-2016",
//                             "June-2016",
//                             "November-2016",
//                             "October-2016",
//                             "September-2016"
//                         ],
//                         "dataset": [
//                             {
//                                 "backgroundColor": [
//                                     "hsla(3, 75%, 50%, 0.5)",
//                                     "hsla(21, 75%, 50%, 0.5)",
//                                     "hsla(4, 75%, 50%, 0.5)",
//                                     "hsla(307, 75%, 50%, 0.5)",
//                                     "hsla(37, 75%, 50%, 0.5)",
//                                     "hsla(304, 75%, 50%, 0.5)"
//                                 ],
//                                 "label": "Total",
//                                 "data": [
//                                     "530000.00",
//                                     "435000.00",
//                                     "395000.00",
//                                     "525000.00",
//                                     "541000.00",
//                                     "435000.00"
//                                 ]
//                             }
//                         ]
//                     }
//                 }
//             ]
//         },
//         {
//             "subType": "info_box",
//             "sectionName": "invoice_vs_cash_info_box",
//             "parent": "",
//             "displayName": "",
//             "type": "box",
//             "width": "col3",
//             "data": [
//                 {
//                     "bgClass": "blue",
//                     "iconClass": "calendar-items",
//                     "title": "Sanctioned Loan Amount",
//                     "data": "11000",
//                     "total": "7665656.0000"
//                 },
//                 {
//                     "bgClass": "red",
//                     "iconClass": "book",
//                     "title": "Product",
//                     "data": "100",
//                     "total": "120"
//                 },
//                 {
//                     "bgClass": "green",
//                     "iconClass": "calendar",
//                     "title": "Security EMI",
//                     "data": "800",
//                     "total": "1000"
//                 },
//                 {
//                     "bgClass": "yellow",
//                     "iconClass": "arrow-right",
//                     "title": "# of Disbursements",
//                     "data": "200",
//                     "total": "300"
//                 }
//             ]
//         },
//         {
//             "subType": "info_progress_box",
//             "sectionName": "invoice_vs_cash_info_progress_box",
//             "parent": "",
//             "displayName": "",
//             "type": "box",
//             "width": "col3",
//             "data": [
//                 {
//                     "bgClass": "blue",
//                     "iconClass": "calendar-items",
//                     "title": "Sanctioned Loan Amount",
//                     "data": "11000",
//                     "total": "7665656.0000"
//                 },
//                 {
//                     "bgClass": "red",
//                     "iconClass": "book",
//                     "title": "Product",
//                     "data": "100",
//                     "total": "120"
//                 },
//                 {
//                     "bgClass": "green",
//                     "iconClass": "calendar",
//                     "title": "Security EMI",
//                     "data": "800",
//                     "total": "1000"
//                 },
//                 {
//                     "bgClass": "yellow",
//                     "iconClass": "arrow-right",
//                     "title": "# of Disbursements",
//                     "data": "200",
//                     "total": "300"
//                 }
//             ]
//         },
//         {
//             "subType": "small_box",
//             "sectionName": "invoice_vs_cash_small_box",
//             "parent": "",
//             "displayName": "Small Box",
//             "type": "box",
//             "width": "col3",
//             "data": [
//                 {
//                     "bgClass": "blue",
//                     "iconClass": "calendar-items",
//                     "title": "Sanctioned Loan Amount",
//                     "data": "11000",
//                     "total": "7665656.0000"
//                 },
//                 {
//                     "bgClass": "red",
//                     "iconClass": "book",
//                     "title": "Product",
//                     "data": "100",
//                     "total": "120"
//                 },
//                 {
//                     "bgClass": "green",
//                     "iconClass": "calendar",
//                     "title": "Security EMI",
//                     "data": "800",
//                     "total": "1000"
//                 },
//                 {
//                     "bgClass": "yellow",
//                     "iconClass": "arrow-right",
//                     "title": "# of Disbursements",
//                     "data": "200",
//                     "total": "300"
//                 }
//             ]
//         },
//         {
//             "displayName": "Balance Sheet",
//             "sectionName": "balance_sheet",
//             "type": "container",
//             "width": "col3",
//             "parent": "",
//             "section": [
//                 {
//                     "sectionName": "balance_sheet_data",
//                     "parent": "balance_sheet",
//                     "type": "balance_sheet",
//                     "width": "col3",
//                     "data": [
//                         {
//                             "title": "Assets",
//                             "parent": "",
//                             "data": [
//                                 {
//                                     "title": "Current Assets",
//                                     "parent": "Assets",
//                                     "data": [
//                                         {
//                                             "title": "Financial Assets",
//                                             "parent": "Current Assets",
//                                             "data": [
//                                                 {
//                                                     "title": "Saving Account",
//                                                     "parent": "Financial Assets",
//                                                     "data": "15000"
//                                                 },
//                                                 {
//                                                     "title": "Inventory",
//                                                     "parent": "Financial Assets",
//                                                     "data": "5000"
//                                                 },
//                                                 {
//                                                     "title": "Petty Cash",
//                                                     "parent": "Financial Assets",
//                                                     "data": "200"
//                                                 },
//                                                 {
//                                                     "title": "Account Receivable",
//                                                     "parent": "Financial Assets",
//                                                     "data": "10000"
//                                                 }
//                                             ]
//                                         }
//                                     ],
//                                     "total": {
//                                         "title": "Total Current Assets",
//                                         "parent": "Current Assets",
//                                         "data": "32200"
//                                     }
//                                 },
//                                 {
//                                     "title": "Fixed Assets",
//                                     "parent": "Assets",
//                                     "data": [
//                                         {
//                                             "title": "land",
//                                             "parent": "Fixed Assets",
//                                             "data": "60000"
//                                         },
//                                         {
//                                             "title": "Building",
//                                             "parent": "Fixed Assets",
//                                             "data": "45000"
//                                         },
//                                         {
//                                             "title": "Computer and Office Equipments",
//                                             "parent": "Fixed Assets",
//                                             "data": "25000"
//                                         }
//                                     ],
//                                     "total": {
//                                         "title": "Total Fixed Assets",
//                                         "parent": "Fixed Assets",
//                                         "data": "130000"
//                                     }
//                                 }
//                             ],
//                             "total": {
//                                 "title": "Total Assets",
//                                 "parent": "Assets",
//                                 "data": "162200"
//                             }
//                         },
//                         {
//                             "title": "Liabilities",
//                             "parent": "",
//                             "data": [
//                                 {
//                                     "title": "Current Liabilities",
//                                     "parent": "Liabilities",
//                                     "data": [
//                                         {
//                                             "title": "Account Payable",
//                                             "parent": "Current Liabilities",
//                                             "data": "15000"
//                                         },
//                                         {
//                                             "title": "Line of Credit",
//                                             "parent": "Current Liabilities",
//                                             "data": "18000"
//                                         },
//                                         {
//                                             "title": "Payroll",
//                                             "parent": "Current Liabilities",
//                                             "data": "14200"
//                                         }
//                                     ],
//                                     "total": {
//                                         "title": "Total Current Liabilities",
//                                         "parent": "Current Liabilities",
//                                         "data": "47200"
//                                     }
//                                 },
//                                 {
//                                     "title": "Fixed Liabilities",
//                                     "parent": "Liabilities",
//                                     "data": [
//                                         {
//                                             "title": "Loan",
//                                             "parent": "Fixed Liabilities",
//                                             "data": "20000"
//                                         },
//                                         {
//                                             "title": "Retained Credits",
//                                             "parent": "Fixed Liabilities",
//                                             "data": "5000"
//                                         },
//                                         {
//                                             "title": "Capital",
//                                             "parent": "Fixed Liabilities",
//                                             "data": "80000"
//                                         },
//                                         {
//                                             "title": "Drawing",
//                                             "parent": "Fixed Liabilities",
//                                             "data": "10000"
//                                         }
//                                     ],
//                                     "total": {
//                                         "title": "Total Fixed Liabilities",
//                                         "parent": "Fixed Liabilities",
//                                         "data": "115000"
//                                     }
//                                 }
//                             ],
//                             "total": {
//                                 "title": "Total Liabilities",
//                                 "parent": "Liabilities",
//                                 "data": "162200"
//                             }
//                         }
//                     ]
//                 }
//             ]
//         },
//         {
//             "displayName": "Cash Flow Summary",
//             "sectionName": "cash_flow_summary_chart",
//             "type": "container",
//             "width": "col3",
//             "parent": "",
//             "section": [
//                 {
//                     "sectionName": "invoice_vs_cash_bar",
//                     "parent": "cash_flow_summary_chart",
//                     "subType": "bar",
//                     "type": "chart",
//                     "width": "col2",
//                     "data": {
//                         "XLabels": [
//                             "August-2016",
//                             "July-2016",
//                             "June-2016",
//                             "November-2016",
//                             "October-2016",
//                             "September-2016"
//                         ],
//                         "dataset": [
//                             {
//                                 "label": "Invoice",
//                                 "backgroundColor": "hsla(34, 75%, 50%, 0.5)",
//                                 "borderColor": "hsla(34, 75%, 50%, 0.5)"
//                             },
//                             {
//                                 "label": "Cash",
//                                 "backgroundColor": "hsla(356, 75%, 50%, 0.5)",
//                                 "borderColor": "hsla(356, 75%, 50%, 0.5)"
//                             }
//                         ]
//                     }
//                 },
//                 {
//                     "sectionName": "invoice_vs_cash_line",
//                     "parent": "cash_flow_summary_chart",
//                     "subType": "line",
//                     "type": "chart",
//                     "width": "col1",
//                     "data": {
//                         "XLabels": [
//                             "August-2016",
//                             "July-2016",
//                             "June-2016",
//                             "November-2016",
//                             "October-2016",
//                             "September-2016"
//                         ],
//                         "dataset": [
//                             {
//                                 "label": "Invoice",
//                                 "backgroundColor": "hsla(34, 75%, 50%, 0.5)",
//                                 "borderColor": "hsla(34, 75%, 50%, 0.5)"
//                             },
//                             {
//                                 "label": "Cash",
//                                 "backgroundColor": "hsla(356, 75%, 50%, 0.5)",
//                                 "borderColor": "hsla(356, 75%, 50%, 0.5)"
//                             }
//                         ]
//                     }
//                 },
//                 {
//                     "sectionName": "invoice_vs_cash_area",
//                     "parent": "cash_flow_summary_chart",
//                     "subType": "area",
//                     "type": "chart",
//                     "width": "col2",
//                     "data": {
//                         "XLabels": [
//                             "August-2016",
//                             "July-2016",
//                             "June-2016",
//                             "November-2016",
//                             "October-2016",
//                             "September-2016"
//                         ],
//                         "dataset": [
//                             {
//                                 "label": "Invoice",
//                                 "backgroundColor": "hsla(34, 75%, 50%, 0.5)",
//                                 "borderColor": "hsla(34, 75%, 50%, 0.5)"
//                             },
//                             {
//                                 "label": "Cash",
//                                 "backgroundColor": "hsla(356, 75%, 50%, 0.5)",
//                                 "borderColor": "hsla(356, 75%, 50%, 0.5)"
//                             }
//                         ]
//                     }
//                 },
//                 {
//                     "sectionName": "invoice_vs_cash_pie",
//                     "parent": "cash_flow_summary_chart",
//                     "subType": "pie",
//                     "type": "chart",
//                     "width": "col1",
//                     "data": {
//                         "XLabels": [
//                             "August-2016",
//                             "July-2016",
//                             "June-2016",
//                             "November-2016",
//                             "October-2016",
//                             "September-2016"
//                         ],
//                         "dataset": [
//                             {
//                                 "backgroundColor": [
//                                     "hsla(193, 75%, 50%, 0.5)",
//                                     "hsla(312, 75%, 50%, 0.5)",
//                                     "hsla(52, 75%, 50%, 0.5)",
//                                     "hsla(164, 75%, 50%, 0.5)",
//                                     "hsla(40, 75%, 50%, 0.5)",
//                                     "hsla(225, 75%, 50%, 0.5)"
//                                 ],
//                                 "label": "Total",
//                                 "data": [
//                                     "530000.00",
//                                     "435000.00",
//                                     "395000.00",
//                                     "525000.00",
//                                     "541000.00",
//                                     "435000.00"
//                                 ]
//                             }
//                         ]
//                     }
//                 },
//                 {
//                     "sectionName": "invoice_vs_cash_doughnut",
//                     "parent": "cash_flow_summary_chart",
//                     "subType": "doughnut",
//                     "type": "chart",
//                     "width": "col1",
//                     "data": {
//                         "XLabels": [
//                             "August-2016",
//                             "July-2016",
//                             "June-2016",
//                             "November-2016",
//                             "October-2016",
//                             "September-2016"
//                         ],
//                         "dataset": [
//                             {
//                                 "backgroundColor": [
//                                     "hsla(260, 75%, 50%, 0.5)",
//                                     "hsla(220, 75%, 50%, 0.5)",
//                                     "hsla(31, 75%, 50%, 0.5)",
//                                     "hsla(218, 75%, 50%, 0.5)",
//                                     "hsla(335, 75%, 50%, 0.5)",
//                                     "hsla(190, 75%, 50%, 0.5)"
//                                 ],
//                                 "label": "Total",
//                                 "data": [
//                                     "530000.00",
//                                     "435000.00",
//                                     "395000.00",
//                                     "525000.00",
//                                     "541000.00",
//                                     "435000.00"
//                                 ]
//                             }
//                         ]
//                     }
//                 }
//             ]
//         },
//         {
//             "displayName": "Profit and Loss",
//             "sectionName": "cash_flow_summary_pnl",
//             "type": "container",
//             "width": "col3",
//             "parent": "",
//             "section": [
//                 {
//                     "sectionName": "invoice_vs_cash_pnl",
//                     "parent": "cash_flow_summary_pnl",
//                     "type": "pnl",
//                     "width": "col3",
//                     "data": {
//                         "XLabels": [
//                             "2016",
//                             "2017"
//                         ],
//                         "dataset": [
//                             {
//                                 "label": "Income",
//                                 "parent": "",
//                                 "data": [
//                                     {
//                                         "label": "Interest Earned",
//                                         "parent": "Income",
//                                         "data": [
//                                             {
//                                                 "label": "On advances/bills",
//                                                 "parent": "Interest Earned",
//                                                 "data": [
//                                                     "3183308",
//                                                     "3295882"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "On Investment",
//                                                 "parent": "Interest Earned",
//                                                 "data": [
//                                                     "1394698",
//                                                     "1257717"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "On balances with RBI and other inter-bank funds",
//                                                 "parent": "Interest Earned",
//                                                 "data": [
//                                                     "200142",
//                                                     "135420"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "Others",
//                                                 "parent": "Interest Earned",
//                                                 "data": [
//                                                     "21428",
//                                                     "38580"
//                                                 ]
//                                             }
//                                         ],
//                                         "style": {
//                                             "FONTSTYLE": "bold"
//                                         }
//                                     },
//                                     {
//                                         "label": "Other Income",
//                                         "parent": "Income",
//                                         "data": [
//                                             {
//                                                 "label": "Commission, Exchange and Brokerage",
//                                                 "parent": "Other Income",
//                                                 "data": [
//                                                     "279191",
//                                                     "272721"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "Net Profit on sale of Investment",
//                                                 "parent": "Other Income",
//                                                 "data": [
//                                                     "325661",
//                                                     "265432"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "Net Profit on sale land, buildings and other assets",
//                                                 "parent": "Other Income",
//                                                 "data": [
//                                                     "259",
//                                                     "538"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "Net Profit on exchange transactions",
//                                                 "parent": "Other Income",
//                                                 "data": [
//                                                     "80614",
//                                                     "58281"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "Income by way of Dividends etc.",
//                                                 "parent": "Other Income",
//                                                 "data": [
//                                                     "13947",
//                                                     "9585"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "Miscellaneous Income",
//                                                 "parent": "Other Income",
//                                                 "data": [
//                                                     "188415",
//                                                     "288580"
//                                                 ]
//                                             }
//                                         ],
//                                         "style": {
//                                             "FONTSTYLE": "bold"
//                                         }
//                                     },
//                                     {
//                                         "label": "Total Income",
//                                         "parent": "Income",
//                                         "data": [
//                                             "5687663",
//                                             "5622736"
//                                         ],
//                                         "style": {
//                                             "FONTSTYLE": "bold"
//                                         }
//                                     }
//                                 ],
//                                 "style": {
//                                     "FONTSTYLE": "bold"
//                                 }
//                             },
//                             {
//                                 "label": "Expenditure",
//                                 "parent": "",
//                                 "data": [
//                                     {
//                                         "label": "Interest Expended",
//                                         "parent": "Expenditure",
//                                         "data": [
//                                             {
//                                                 "label": "On Deposits",
//                                                 "parent": "Interest Expended",
//                                                 "data": [
//                                                     "3045553",
//                                                     "542072"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "On RBI/Inter-bank borrowing",
//                                                 "parent": "Interest Expended",
//                                                 "data": [
//                                                     "55315",
//                                                     "69222"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "Others",
//                                                 "parent": "Interest Expended",
//                                                 "data": [
//                                                     "206469",
//                                                     "210762"
//                                                 ]
//                                             }
//                                         ],
//                                         "style": {
//                                             "FONTSTYLE": "bold"
//                                         }
//                                     },
//                                     {
//                                         "label": "Operating Expenses",
//                                         "parent": "Expenditure",
//                                         "data": [
//                                             {
//                                                 "label": "Payments to and Provisions for employees",
//                                                 "parent": "Operating Expenses",
//                                                 "data": [
//                                                     "916880",
//                                                     "542072"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "Rent",
//                                                 "parent": "Operating Expenses",
//                                                 "data": [
//                                                     "73886",
//                                                     "69222"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "Printing and Stationery",
//                                                 "parent": "Operating Expenses",
//                                                 "data": [
//                                                     "9099",
//                                                     "9589"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "Advertisement and Publicity",
//                                                 "parent": "Operating Expenses",
//                                                 "data": [
//                                                     "4715",
//                                                     "5536"
//                                                 ]
//                                             },
//                                             {
//                                                 "label": "Others",
//                                                 "parent": "Operating Expenses",
//                                                 "data": [
//                                                     "166409",
//                                                     "157899"
//                                                 ]
//                                             }
//                                         ],
//                                         "style": {
//                                             "FONTSTYLE": "bold"
//                                         }
//                                     },
//                                     {
//                                         "label": "Provisions and contingencies",
//                                         "parent": "Expenditure",
//                                         "data": [
//                                             {
//                                                 "label": "Provisions for depreciation on Investment",
//                                                 "parent": "Provisions and contingencies",
//                                                 "data": [
//                                                     "702712",
//                                                     "702712"
//                                                 ]
//                                             }
//                                         ],
//                                         "style": {
//                                             "FONTSTYLE": "bold"
//                                         }
//                                     },
//                                     {
//                                         "label": "Total Expenditure",
//                                         "parent": "Expenditure",
//                                         "data": [
//                                             "7645171",
//                                             "5421582"
//                                         ],
//                                         "style": {
//                                             "FONTSTYLE": "bold"
//                                         }
//                                     }
//                                 ],
//                                 "style": {
//                                     "FONTSTYLE": "bold"
//                                 }
//                             },
//                             {
//                                 "label": "Provision towards standard assets",
//                                 "parent": "",
//                                 "data": [
//                                     "-150696",
//                                     "-120326"
//                                 ]
//                             },
//                             {
//                                 "label": "Others",
//                                 "parent": "",
//                                 "data": [
//                                     "816829",
//                                     "816829"
//                                 ]
//                             },
//                             {
//                                 "label": "Profit(loass) before tax",
//                                 "parent": "",
//                                 "data": [
//                                     "-1957508",
//                                     "201154"
//                                 ]
//                             },
//                             {
//                                 "label": "Current tax",
//                                 "parent": "",
//                                 "data": [
//                                     "-7115",
//                                     "217030"
//                                 ]
//                             },
//                             {
//                                 "label": "Deferred tax",
//                                 "parent": "",
//                                 "data": [
//                                     "-722111",
//                                     "-148356"
//                                 ]
//                             },
//                             {
//                                 "label": "Profit(loss) ater tax",
//                                 "parent": "",
//                                 "data": [
//                                     "-1228282",
//                                     "132480"
//                                 ]
//                             },
//                             {
//                                 "label": "Profit/Loass brought forward",
//                                 "parent": "",
//                                 "data": [
//                                     "0",
//                                     "0"
//                                 ]
//                             },
//                             {
//                                 "label": "Appropriations",
//                                 "parent": "",
//                                 "data": [
//                                     {
//                                         "label": "Transfer to Capital Reserve",
//                                         "parent": "Appropriations",
//                                         "data": [
//                                             "102493",
//                                             "51370"
//                                         ]
//                                     }
//                                 ],
//                                 "style": {
//                                     "FONTSTYLE": "bold"
//                                 }
//                             }
//                         ]
//                     }
//                 }
//             ]
//         },
//         {
//             "displayName": "Scoring",
//             "sectionName": "cash_flow_summary_scoring",
//             "type": "container",
//             "width": "col3",
//             "parent": "",
//             "section": [
//                 {
//                     "sectionName": "invoice_vs_cash_scoring",
//                     "parent": "cash_flow_summary_scoring",
//                     "type": "scoring",
//                     "width": "col3",
//                     "data": {
//                         "SubscoreDetails": {
//                             "ManagementScore": {
//                                 "12079": {
//                                     "CustomerDetails": {
//                                         "Name": "shivaraj n b",
//                                         "Relation": "Applicant"
//                                     },
//                                     "data": [
//                                         {
//                                             "OverallPassStatus": "PASS",
//                                             "AccountNumber": "",
//                                             "ApplicationId": "6396",
//                                             "CustomerId": "12079",
//                                             "OveralApprovers": "",
//                                             "OverallPassValue": "60",
//                                             "OverallWeightedScore": "84.44",
//                                             "ScoreMagnitude": "84.44",
//                                             "ScoreName": "RiskScore3",
//                                             "IndividualCustomerId": "12079",
//                                             "CustomerName": "shivaraj n b",
//                                             "LoanRelation": "Applicant",
//                                             "SubscoreName": "ManagementScore",
//                                             "Parameter": "Involvement in Business",
//                                             "Actual Value": "Full Time",
//                                             "ParameterScore": "0",
//                                             "color_english": "",
//                                             "color_hexadecimal": ""
//                                         },
//                                         {
//                                             "OverallPassStatus": "PASS",
//                                             "AccountNumber": "",
//                                             "ApplicationId": "6396",
//                                             "CustomerId": "12079",
//                                             "OveralApprovers": "",
//                                             "OverallPassValue": "60",
//                                             "OverallWeightedScore": "84.44",
//                                             "ScoreMagnitude": "84.44",
//                                             "ScoreName": "RiskScore3",
//                                             "IndividualCustomerId": "12079",
//                                             "CustomerName": "shivaraj n b",
//                                             "LoanRelation": "Applicant",
//                                             "SubscoreName": "ManagementScore",
//                                             "Parameter": "Age",
//                                             "Actual Value": "37",
//                                             "ParameterScore": "5",
//                                             "color_english": "green",
//                                             "color_hexadecimal": "#50D050"
//                                         },
//                                         {
//                                             "OverallPassStatus": "PASS",
//                                             "AccountNumber": "",
//                                             "ApplicationId": "6396",
//                                             "CustomerId": "12079",
//                                             "OveralApprovers": "",
//                                             "OverallPassValue": "60",
//                                             "OverallWeightedScore": "84.44",
//                                             "ScoreMagnitude": "84.44",
//                                             "ScoreName": "RiskScore3",
//                                             "IndividualCustomerId": "12079",
//                                             "CustomerName": "shivaraj n b",
//                                             "LoanRelation": "Applicant",
//                                             "SubscoreName": "ManagementScore",
//                                             "Parameter": "Years of Residence in Area/Locality",
//                                             "Actual Value": ">=5",
//                                             "ParameterScore": "0",
//                                             "color_english": "",
//                                             "color_hexadecimal": ""
//                                         },
//                                         {
//                                             "OverallPassStatus": "PASS",
//                                             "AccountNumber": "",
//                                             "ApplicationId": "6396",
//                                             "CustomerId": "12079",
//                                             "OveralApprovers": "",
//                                             "OverallPassValue": "60",
//                                             "OverallWeightedScore": "84.44",
//                                             "ScoreMagnitude": "84.44",
//                                             "ScoreName": "RiskScore3",
//                                             "IndividualCustomerId": "12079",
//                                             "CustomerName": "shivaraj n b",
//                                             "LoanRelation": "Applicant",
//                                             "SubscoreName": "ManagementScore",
//                                             "Parameter": "Marital Status",
//                                             "Actual Value": "MARRIED",
//                                             "ParameterScore": "3",
//                                             "color_english": "green",
//                                             "color_hexadecimal": "#50D050"
//                                         },
//                                         {
//                                             "OverallPassStatus": "PASS",
//                                             "AccountNumber": "",
//                                             "ApplicationId": "6396",
//                                             "CustomerId": "12079",
//                                             "OveralApprovers": "",
//                                             "OverallPassValue": "60",
//                                             "OverallWeightedScore": "84.44",
//                                             "ScoreMagnitude": "84.44",
//                                             "ScoreName": "RiskScore3",
//                                             "IndividualCustomerId": "12079",
//                                             "CustomerName": "shivaraj n b",
//                                             "LoanRelation": "Applicant",
//                                             "SubscoreName": "ManagementScore",
//                                             "Parameter": "CB Score",
//                                             "Actual Value": "0",
//                                             "ParameterScore": "0",
//                                             "color_english": "",
//                                             "color_hexadecimal": ""
//                                         },
//                                         {
//                                             "OverallPassStatus": "PASS",
//                                             "AccountNumber": "",
//                                             "ApplicationId": "6396",
//                                             "CustomerId": "12079",
//                                             "OveralApprovers": "",
//                                             "OverallPassValue": "60",
//                                             "OverallWeightedScore": "84.44",
//                                             "ScoreMagnitude": "84.44",
//                                             "ScoreName": "RiskScore3",
//                                             "IndividualCustomerId": "12079",
//                                             "CustomerName": "shivaraj n b",
//                                             "LoanRelation": "Applicant",
//                                             "SubscoreName": "ManagementScore",
//                                             "Parameter": "Qualification",
//                                             "Actual Value": "ITI/Diploma/Professional Qualification",
//                                             "ParameterScore": "0",
//                                             "color_english": "",
//                                             "color_hexadecimal": ""
//                                         },
//                                         {
//                                             "OverallPassStatus": "PASS",
//                                             "AccountNumber": "",
//                                             "ApplicationId": "6396",
//                                             "CustomerId": "12079",
//                                             "OveralApprovers": "",
//                                             "OverallPassValue": "60",
//                                             "OverallWeightedScore": "84.44",
//                                             "ScoreMagnitude": "84.44",
//                                             "ScoreName": "RiskScore3",
//                                             "IndividualCustomerId": "12079",
//                                             "CustomerName": "shivaraj n b",
//                                             "LoanRelation": "Applicant",
//                                             "SubscoreName": "ManagementScore",
//                                             "Parameter": "Housing Status",
//                                             "Actual Value": "Owned",
//                                             "ParameterScore": "5",
//                                             "color_english": "green",
//                                             "color_hexadecimal": "#50D050"
//                                         }
//                                     ]
//                                 },
//                                 "__isIndividualScore": "YES",
//                                 "CustomerIds": [
//                                     "12079"
//                                 ]
//                             },
//                             "BusinessScore": [
//                                 {
//                                     "OverallPassStatus": "PASS",
//                                     "AccountNumber": "",
//                                     "ApplicationId": "6396",
//                                     "CustomerId": "12079",
//                                     "OveralApprovers": "",
//                                     "OverallPassValue": "60",
//                                     "OverallWeightedScore": "84.44",
//                                     "ScoreMagnitude": "84.44",
//                                     "ScoreName": "RiskScore3",
//                                     "IndividualCustomerId": "12079",
//                                     "CustomerName": "shivaraj n b",
//                                     "LoanRelation": "Applicant",
//                                     "SubscoreName": "BusinessScore",
//                                     "Parameter": "Years of Business presence in Area",
//                                     "Actual Value": ">=3 yrs",
//                                     "ParameterScore": "5",
//                                     "color_english": "green",
//                                     "color_hexadecimal": "#50D050"
//                                 },
//                                 {
//                                     "OverallPassStatus": "PASS",
//                                     "AccountNumber": "",
//                                     "ApplicationId": "6396",
//                                     "CustomerId": "12079",
//                                     "OveralApprovers": "",
//                                     "OverallPassValue": "60",
//                                     "OverallWeightedScore": "84.44",
//                                     "ScoreMagnitude": "84.44",
//                                     "ScoreName": "RiskScore3",
//                                     "IndividualCustomerId": "12079",
//                                     "CustomerName": "shivaraj n b",
//                                     "LoanRelation": "Applicant",
//                                     "SubscoreName": "BusinessScore",
//                                     "Parameter": "Business Vintage",
//                                     "Actual Value": "5.11",
//                                     "ParameterScore": "0",
//                                     "color_english": "",
//                                     "color_hexadecimal": ""
//                                 },
//                                 {
//                                     "OverallPassStatus": "PASS",
//                                     "AccountNumber": "",
//                                     "ApplicationId": "6396",
//                                     "CustomerId": "12079",
//                                     "OveralApprovers": "",
//                                     "OverallPassValue": "60",
//                                     "OverallWeightedScore": "84.44",
//                                     "ScoreMagnitude": "84.44",
//                                     "ScoreName": "RiskScore3",
//                                     "IndividualCustomerId": "12079",
//                                     "CustomerName": "shivaraj n b",
//                                     "LoanRelation": "Applicant",
//                                     "SubscoreName": "BusinessScore",
//                                     "Parameter": "Business History",
//                                     "Actual Value": "Clean - Single owner/structure",
//                                     "ParameterScore": "0",
//                                     "color_english": "",
//                                     "color_hexadecimal": ""
//                                 },
//                                 {
//                                     "OverallPassStatus": "PASS",
//                                     "AccountNumber": "",
//                                     "ApplicationId": "6396",
//                                     "CustomerId": "12079",
//                                     "OveralApprovers": "",
//                                     "OverallPassValue": "60",
//                                     "OverallWeightedScore": "84.44",
//                                     "ScoreMagnitude": "84.44",
//                                     "ScoreName": "RiskScore3",
//                                     "IndividualCustomerId": "12079",
//                                     "CustomerName": "shivaraj n b",
//                                     "LoanRelation": "Applicant",
//                                     "SubscoreName": "BusinessScore",
//                                     "Parameter": "No of EMI Bounces",
//                                     "Actual Value": "0",
//                                     "ParameterScore": "0",
//                                     "color_english": "",
//                                     "color_hexadecimal": ""
//                                 },
//                                 {
//                                     "OverallPassStatus": "PASS",
//                                     "AccountNumber": "",
//                                     "ApplicationId": "6396",
//                                     "CustomerId": "12079",
//                                     "OveralApprovers": "",
//                                     "OverallPassValue": "60",
//                                     "OverallWeightedScore": "84.44",
//                                     "ScoreMagnitude": "84.44",
//                                     "ScoreName": "RiskScore3",
//                                     "IndividualCustomerId": "12079",
//                                     "CustomerName": "shivaraj n b",
//                                     "LoanRelation": "Applicant",
//                                     "SubscoreName": "BusinessScore",
//                                     "Parameter": "Referred By",
//                                     "Actual Value": "Direct (Cold Call)",
//                                     "ParameterScore": "0",
//                                     "color_english": "",
//                                     "color_hexadecimal": ""
//                                 },
//                                 {
//                                     "OverallPassStatus": "PASS",
//                                     "AccountNumber": "",
//                                     "ApplicationId": "6396",
//                                     "CustomerId": "12079",
//                                     "OveralApprovers": "",
//                                     "OverallPassValue": "60",
//                                     "OverallWeightedScore": "84.44",
//                                     "ScoreMagnitude": "84.44",
//                                     "ScoreName": "RiskScore3",
//                                     "IndividualCustomerId": "12079",
//                                     "CustomerName": "shivaraj n b",
//                                     "LoanRelation": "Applicant",
//                                     "SubscoreName": "BusinessScore",
//                                     "Parameter": "Business Premises Status",
//                                     "Actual Value": "Owned",
//                                     "ParameterScore": "0",
//                                     "color_english": "",
//                                     "color_hexadecimal": ""
//                                 },
//                                 {
//                                     "OverallPassStatus": "PASS",
//                                     "AccountNumber": "",
//                                     "ApplicationId": "6396",
//                                     "CustomerId": "12079",
//                                     "OveralApprovers": "",
//                                     "OverallPassValue": "60",
//                                     "OverallWeightedScore": "84.44",
//                                     "ScoreMagnitude": "84.44",
//                                     "ScoreName": "RiskScore3",
//                                     "IndividualCustomerId": "12079",
//                                     "CustomerName": "shivaraj n b",
//                                     "LoanRelation": "Applicant",
//                                     "SubscoreName": "BusinessScore",
//                                     "Parameter": "Total Cheque Bounce",
//                                     "Actual Value": "0",
//                                     "ParameterScore": "2",
//                                     "color_english": "red",
//                                     "color_hexadecimal": "#FF5050"
//                                 }
//                             ]
//                         },
//                         "SubscoreScores": {
//                             "BusinessScore": "30.00/30",
//                             "FinancialScore": "12.00/30",
//                             "ManagementScore": "18.40/20"
//                         },
//                         "ScoreCalculationDetails": [
//                             {
//                                 "id": "12765",
//                                 "OverAllWeightedScore": "84.44",
//                                 "OverAllPassStatus": "PASS",
//                                 "ScoreName": "RiskScore3",
//                                 "CustomerId": "12079",
//                                 "apiVersion": "1"
//                             }
//                         ]
//                     }
//                 }
//             ]
//         },
//         {
//             "displayName": "Operating Expense",
//             "sectionName": "OPEX_table",
//             "type": "container",
//             "width": "col3",
//             "parent": "",
//             "section": [
//                 {
//                     "sectionName": "OPEX_table_detail",
//                     "parent": "OPEX_table",
//                     "type": "table",
//                     "width": "col3",
//                     "data": {
//                         "columns": [
//                             {
//                                 "title": "Expenditure Source",
//                                 "data": "Expenditure Source"
//                             },
//                             {
//                                 "title": "Monthly Expense",
//                                 "data": "Monthly Expense"
//                             },
//                             {
//                                 "title": "% of Avg Monthly Revenue",
//                                 "data": "% of Avg Monthly Revenue"
//                             }
//                         ],
//                         "data": [
//                             {
//                                 "Expenditure Source": "Employee's Salary",
//                                 "Monthly Expense": "35000.0000",
//                                 "% of Avg Monthly Revenue": "7.11623660"
//                             },
//                             {
//                                 "Expenditure Source": "Owner's Salary",
//                                 "Monthly Expense": "3500.0000",
//                                 "% of Avg Monthly Revenue": "0.71162360"
//                             },
//                             {
//                                 "Expenditure Source": "Rent",
//                                 "Monthly Expense": "6000.0000",
//                                 "% of Avg Monthly Revenue": "1.21992620"
//                             },
//                             {
//                                 "Expenditure Source": "Tools & Consumables",
//                                 "Monthly Expense": "1000.0000",
//                                 "% of Avg Monthly Revenue": "0.20332100"
//                             },
//                             {
//                                 "Expenditure Source": "Total Opex",
//                                 "Monthly Expense": "45500.0000",
//                                 "% of Avg Monthly Revenue": "9.25110750"
//                             }
//                         ]
//                     }
//                 }
//             ]
//         }
//     ]
// }
    }]);

