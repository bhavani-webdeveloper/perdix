import { Type } from "class-transformer";

//LiabilityFeeDetailDTOs

class LiabilityFeeDetails {
        feeAmount: number;
        feeName: string;
        feeType: string;
        id: number;
        lenderAccountNumber: string;
        lenderId: number;
        liablityAccountId: number;
        processingFeeInPercentage: number;
        version: number;
}

export = LiabilityFeeDetails;
