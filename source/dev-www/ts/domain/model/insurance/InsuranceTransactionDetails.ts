import { Type } from "class-transformer";

class InsuranceTransactionDetails {
insuranceId: number;
receiptNumber : string;
modeOfTrxn : string;
fpOverridenRemarks : string;
transactionDate : Date;
basicAmount : number;
gstOnBasicPremium : number;
serviceCharge : number;
gstOnServiceChange : number;
totalPremium : number;
isFpOverriden : boolean;


}

export = InsuranceTransactionDetails;