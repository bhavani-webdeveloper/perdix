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
    dateOfBirth: date;
    beneficieryUrn: number;
    benificieryFamilyMemberId: string;
    benificieryName: string;
    benificieryRelationship: string;
    policyNumber: string;
    certificateNo: string;
    purchaseDate: date;
    startDate: date;
    maturityDate: date;
    tenureInYears: number;
    sumInsured: amount;
    recommendationAmount: amount;
    recommendationOverride: string;
    recommendationRemarks: string;
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
