import LeadInteraction = require("./LeadInteraction");


class Lead {
    addressLine1: string;
    addressLine2: string;
    alternateMobileNo: string;
    altitude: string;
    applicantCustomerId: number;
    area: string;
    bankId: number;
    bankName: string;
    branchId: number;
    branchName: string;
    businessActivity: string;
    businessName: string;
    businessType: string;
    centreId: number;
    centreName: string;
    cityTownVillage: string;
    companyOperatingSince: string;
    companyRegistered: string;
    currentStage: string;
    customerId: number;
    customerType: string;
    leadInteractions: LeadInteraction[];
    district: string;
    dob: string;
    educationStatus: string;
    eligibleForProduct: string;
    followUpDate: string;
    gender: string;
    id: number;
    interestedInProduct: string;
    latitude: string;
    leadCategory: string;
    leadName: string;
    leadSource: string;
    leadStatus: string;
    licenseType: string;
    loanAmountRequested: number;
    loanPurpose1: string;
    loanPurpose2: string;
    loanPurpose3: string;
    location: string;
    longitude: string;
    maritalStatus: string;
    mobileNo: string;
    occupation1: string;
    ownership: string;
    pincode: number;
    productAcceptAdditinalRemarks: string;
    productAcceptReason: string;
    productCategory: string;
    productRejectAdditinalRemarks: string;
    productRejectReason: string;
    productRequiredBy: string;
    productSubCategory: string;
    referredBy: string;
    screeningDate: string;
    state: string;
    udfId: number;
    version: number;

    public getLead() {
        return "Lead Here!";
    }
}

export = Lead;