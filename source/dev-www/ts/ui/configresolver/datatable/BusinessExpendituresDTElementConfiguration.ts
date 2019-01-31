import {DataTableElementConfiguration} from "./DataTableElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class BusinessExpendituresDTElementConfiguration extends DataTableElementConfiguration {
    dtlConfig: Object= {
        columnsFn: function () {
            let $q = AngularResourceService.getInstance().getNGService("$q");
            let formHelper = AngularResourceService.getInstance().getNGService("formHelper");
            return $q.resolve({
                "dtlKeyvalue": "EXPENSES",
                "columns": [{
                        prop: "expenditureSource",
                        name: "EXPENDITURE_SOURCE",
                        type: "select",
                        getListOptions: function (model) {
                            return $q.when(formHelper.enum("business_expense")).then(function (value) {
                                var options = [];
                                var i=0;
                                for (i = 0; i < value.data.length; i++) {

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
                        getListOptions: function (model) {
                            return $q.when(formHelper.enum("frequency")).then(function (value) {
                                var options = [];
                                var i=0;
                                for (i = 0; i < value.data.length; i++) {
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


