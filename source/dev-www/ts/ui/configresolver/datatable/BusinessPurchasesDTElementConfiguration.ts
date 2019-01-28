import {DataTableElementConfiguration} from "./DataTableElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class BusinessPurchasesDTElementConfiguration extends DataTableElementConfiguration {
    dtlConfig: Object={
        columnsFn: function () {
            let $q = AngularResourceService.getInstance().getNGService("$q");
            let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
            return $q.resolve({
                "dtlKeyvalue": "PURCHASES",
                "columns": [{
                        prop: "vendorName",
                        type: "select-typeahead",
                        isTypeaheadSelect: true,
                        typeaheadExpr: "supplierName",
                        name: "VENDOR_NAME",
                        getListOptions: function (model) {
                            return $q.when(model.customer.supplierDetails).then(function (value) {
                                var options = [];
                                var i=0;
                                for (i = 0; i < value.length; i++) {
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
}


