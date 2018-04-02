import { Type } from "class-transformer";

import LiabilityComplianceDocuments = require("./LiabilityComplianceDocuments");
import LiabilityLenderDocuments = require("./LiabilityLenderDocuments");
import LiabilityFeeDetails = require("./LiabilityFeeDetails");


//LiabilityAccountDTOs

export class LiabilityAccount {
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

        @Type(() => LiabilityComplianceDocuments)
        liabilityComplianceDocuments: LiabilityComplianceDocuments[];

        @Type(() => LiabilityFeeDetails)
        liabilityFeeDetails: LiabilityFeeDetails[];

        @Type(() => LiabilityLenderDocuments)
        liabilityLenderDocuments: LiabilityLenderDocuments[];
        
}

