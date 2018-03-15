import { Type } from "class-transformer";

import LiabilityComplianceDocument = require("./LiabilityComplianceDocument");
import LiabilityLenderDocument = require("./LiabilityLenderDocument");
import LiabilityFeeDetail = require("./LiabilityFeeDetail");


//LiabilityAccountDTOs

class LiabilityAccounts {
       currentStage: string;
        disbursementDate: string;
        expectedDisbursementDate: string;
        firstInstallmentDate: string;
        id: number;
        installmentAmount: number;
        interestCalculationMethod: string;
        interestRateType: string;
        isPaymentScheduleUploaded: boolean;
        lenderAccountNumber: string;
        lenderId: number;
        loanAccountStatus: string;
        loanAmount: number;
        markUpOrDown: number;
        maturityDate: string;
        netDisbursementAmount: number;
        pendingApproval: string;
        productType: string;
        rateOfInterest: number;
        repaymentFrequency: string;
        repaymentMode: string;
        repaymentTenure: number;
        scheduleStartDate: string;
        securityAmount: number;
        totalDeductions: number;
        version: number;

        @Type(() => LiabilityComplianceDocument)
        liabilityComplianceDocument: LiabilityComplianceDocument[];

        @Type(() => LiabilityFeeDetail)
        iabilityFeeDetail: LiabilityFeeDetail[];

        @Type(() => LiabilityLenderDocument)
        liabilityLenderDocument: LiabilityLenderDocument[];
        
}

export = LiabilityAccounts;
