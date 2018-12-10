import { Type } from "class-transformer";

export class InsuranceTransactionDetails {
insuranceId: number;
receiptNumber : string;
modeOfTrxn : string;
fpOverridenRemarks : string;
transactionDate : date;
basicAmount : amount;
gstOnBasicPremium : amount;
serviceCharge : amount;
gstOnServiceChange : amount;
totalPremium : amount;
isFpOverriden : boolean;


}