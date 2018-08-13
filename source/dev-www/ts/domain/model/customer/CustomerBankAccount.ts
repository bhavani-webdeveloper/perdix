import { Type } from 'class-transformer';

import BankStatement = require("./BankStatement");

class CustomerBankAccount {
    accountName: string;
    accountNumber: string;
    accountType: string;
    bankStatementDocId: string;
    @Type(() => BankStatement)
    bankStatements: BankStatement[];
    bankingSince: string;
    confirmedAccountNumber: string;
    customerBankBranchName: string;
    customerBankName: string;
    customerId: number;
    customerNameAsInBank: string;
    defaultCollectionAccount: boolean;
    id: number;
    ifscCode: string;
    isDisbersementAccount: boolean;
    limit: number;
    netBankingAvailable: string;
    sanctionedAmount: number;
    version: number;
}
export = CustomerBankAccount;