import { Type } from "class-transformer";
import JournalDetail = require('./JournalDetail');
class JournalHeader {
    currentStage: string;
    errorResponse: string;
    id: number;
    noOfCredits: number;
    noOfDebits: number;
    noOfTransaction: number;
    remarks: string;
    status: string;
    totalCreditAmount: number;
    totalDebitAmount: number;
    transactionBranchId: number;
    transactionDate: string;
    transactionId: string;
    valueDate: string;
    version: number;


    @Type(() => JournalDetail)
    journalDetails: JournalDetail[];
}

export = JournalHeader;