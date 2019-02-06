import {DataTableElementConfiguration} from "./DataTableElementConfiguration";
import {NGHelper} from "../../../infra/helpers/NGHelper";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {EnrolmentProcess} from '../../../domain/model/customer/EnrolmentProcess';
import * as _ from 'lodash';
export class BusinessBankStatementsDTElementConfiguration extends DataTableElementConfiguration {
    dtlConfig: Object={
        columnsFn: function () {
            let $q = AngularResourceService.getInstance().getNGService("$q");
            return $q.resolve({
                "dtlKeyvalue": "STATEMENT_DETAILS",
                "columns": [{
                        prop: "startMonth",
                        type: "date",
                        name: "START_MONTH"
                    },
                    {
                        prop: "cashDeposits",
                        type: "number",
                        name: "Cash Deposits",
                        "onClick": function(modelValue, form, model, event) {
                            modelValue = modelValue == null ? 0 : modelValue;
                            var nonCashDeposits = 0;
                            if (modelValue != null) {
                                nonCashDeposits = ( model.nonCashDeposits != null) ? model.nonCashDeposits : 0;

                                model.totalDeposits = nonCashDeposits + modelValue;
                                model.cashDeposits = modelValue;
                                model.nonCashDeposits = nonCashDeposits;
                            }
                        }
                    },
                    {
                        prop: "nonCashDeposits",
                        type: "number",
                        name: "Non-cash Deposits",
                        "onClick": function(modelValue, form, model, event) {
                            modelValue = modelValue == null ? 0 : modelValue;
                            var cashDeposits = 0;
                            if (modelValue != null) {
                                cashDeposits = ( model.cashDeposits != null) ? model.cashDeposits : 0;

                                model.totalDeposits = cashDeposits + modelValue;
                                model.cashDeposits = cashDeposits;
                                model.nonCashDeposits = modelValue;
                            }
                        }
                    },
                    {
                        prop: "totalDeposits",
                        type: "number",
                        // calculator: true,
                        // creditDebitBook: true,
                        readOnly : true,
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
}


