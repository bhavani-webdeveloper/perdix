import { Type } from "class-transformer";
import InsuranceTransactionDetails = require("./InsuranceTransactionDetails");
import InsuranceDocuments = require("./InsuranceDocuments");
import NomineeDetails = require("./NomineeDetails");

export class InsurancePolicyDetails {
    productCode: string;
    partnerCode: string;
    InsuranceType: string;
    premiumRateCode: string;
    bankId: number;
    branchId: number;
    productId: number;
    centreId: number;
    customerId: number;
    urnNo: string;
    fullName: string;
    dateOfBirth: Date;
    beneficieryUrn: number;
    benificieryFamilyMemberId: string;
    benificieryName: string;
    benificieryRelationship: string;
    policyNumber: string;
    certificateNo: string;
    purchaseDate: Date;
    startDate: Date;
    maturityDate: Date;
    tenureInYears: number;
    sumInsured: number;
    recommendationAmount: number;
    recommendationOverride: string;
    recommendationRemarks: string;
    recommendationResponseMessage:string;
    dscId: number;
    status: string;
    parentPolicyNumber: string;
    remarks: string;
    state: string;
    district: string;
    pincode: number;
    gender: number;
    age: number;
    occupation: string;
    customerAddress: string;
    contactNumber: string;
    id: number;

    @Type(() => InsuranceTransactionDetails)
    insuranceTransactionDetailsDTO: InsuranceTransactionDetails[];

    @Type(() => InsuranceDocuments)
    insuranceDocumentsDTO: InsuranceDocuments[];

    @Type(() => NomineeDetails)
    nomineeDetailsDTO: NomineeDetails[];
}
