import {DataTableElementConfiguration} from "./DataTableElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class BusinessIncomeThroughSalesDTElementConfiguration extends DataTableElementConfiguration {

    dtlConfig: Object={
        columnsFn: function () {
            let $q = AngularResourceService.getInstance().getNGService("$q");
            let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
            return $q.resolve({
                "dtlKeyvalue": "INCOME_THROUGH_SALES",
                "columns": [{
                        name: "BUYER_NAME",
                        prop: "buyerName",
                        type: "select-typeahead",
                        isTypeaheadSelect: true,
                        exprValue: "buyerName",
                        typeaheadEditable: true,
                        getListOptions: function (model) {
                            return $q.when(model.customer.buyerDetails).then(function (value) {
                                var options = [];
                                var i=0;
                                for (i = 0; i < value.length; i++) {
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
                            return $q.when(formHelper.enum("salesincome_income_type")).then(function (value) {
                                var options = [];
                                var i=0;
                                for (i = 0; i < value.data.length; i++) {
                                    options.push(value.data[i].value);
                                }
                                return options;
                            });
                        },
                    },
                    {
                        prop: "invoiceType",
                        name: "INVOICE_TYPE",
                        exprValue: "value",
                        type: "select",
                        enumCode: "salesincome_invoice_type",
                        getListOptions: function (model) {
                            return $q.when(formHelper.enum("salesincome_invoice_type")).then(function (value) {
                                var options = [];
                                var i=0;
                                console.log(value);
                                for (i = 0; i < value.data.length; i++) {
                                    if (value.data[i].parentCode == model.customer.enterprise.businessType) {
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
}


