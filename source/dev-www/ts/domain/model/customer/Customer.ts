import { Type } from "class-transformer";

import AdditionalKYC = require("./AdditionalKYC");
import BuyerDetail = require("./BuyerDetail");
import CbCheckList = require("./CbCheckList");
import CustomerBankAccount = require("./CustomerBankAccount");
import CustomerPartner = require("./CustomerPartner");
import Enterprise = require("./Enterprise");
import EnterpriseAsset = require("./EnterpriseAsset");
import EnterpriseBureauDetail = require("./EnterpriseBureauDetail");
import EnterpriseCustomerRelation = require("./EnterpriseCustomerRelation");
import EnterpriseRegistration = require("./EnterpriseRegistration");
import Expenditure = require("./Expenditure");
import FamilyMember = require("./FamilyMember");
import FinancialAsset = require("./FinancialAsset");
import FinancialSummary = require("./FinancialSummary");
import FixedAssetsMachinary = require("./FixedAssetsMachinary");
import IncomeThroughSale = require("./IncomeThroughSale");
import Liability = require("./Liability");
import MeFamilyMapping = require("./MeFamilyMapping");
import OtherBusinessIncome = require("./OtherBusinessIncome");
import PhysicalAsset = require("./PhysicalAsset");
import Miscellaneous = require("./Miscellaneous");
import RawMaterialExpens = require("./RawMaterialExpens");
import SupplierDetail = require("./SupplierDetail");
import Udf = require("./Udf");
import Verification = require("./Verification");

export enum CustomerTypes {
    INDIVIDUAL = "Individual",
    ENTERPRISE = "Enterprise"
}


export class Customer {
    aadhaarNo: string;
    addressInLocalLanguage: string;
    addressProof: string;
    addressProofImageId: string;
    addressProofIssueDate: string;
    addressProofNo: string;
    addressProofReverseImageId: string;
    addressProofValidUptoDate: string;
    addressRationCardType: string;
    ageProof: string;
    ageProofImageId: string;
    ageRationCardType: string;
    allMachinesAreOperational: string;
    altitude: string;
    approachForTheBusinessPremises: string;
    area: string;
    authenticationRegisterId: number;
    axisCustIdSentStatus: boolean;
    bankStatementPhoto: string;
    bcCustId: string;
    biometricEnrollment: string;
    biometricType: string;
    blockStatusChangedAt: Date;
    blockStatusChangedBy: string;
    blocked: boolean;
    bookKeepingQuality: string;
    branchCode: string;
    bribeOffered: string;
    businessSignboardImage: string;
    careOf: string;
    caste: string;
    centreId: number;
    centreName: string;
    challengingChequeBounce: string;
    childLabours: string;
    cifNo: string;
    citizenOfIndia: boolean;
    coApplicantRelationshipWithApplicant: string;
    country: string;
    currentStage: string;
    customerAttitudeToKinara: string;
    customerBankId: number;
    customerBranchId: number;
    customerStatus: string;
    customerType: CustomerTypes;
    customerWalkinToBusiness: string;
    date: string;
    dateOfBirth: string;
    dateOfBirthLong: number;
    distanceFromBranch: string;
    district: string;
    doorNo: string;
    edfCapturedUserId: string;
    edfCapturedUserName: string;
    edfDoneAt: Date;
    eidDate: string;
    eidNumber: string;
    email: string;
    employeeSatisfaction: string;
    employmentStatus: string;
    enrolledAs: string;
    enrollmentCheckerApprovedDate: Date;
    enrollmentCheckerApprover: number;
    enrollmentCheckerRemarks: string;
    enrollmentCheckerStatus: string;
    enrollmentId: string;
    enterpriseId: number;
    existingLoan: string;
    exserviceman: boolean;
    familyEnrollmentId: string;
    fatherFirstName: string;
    fatherLastName: string;
    fatherMiddleName: string;
    firstName: string;
    gender: string;
    gpsCaptureDate: string;
    houseVerificationPhoto: string;
    id: number;
    idProofIssueDate: string;
    idProofValidUptoDate: string;
    identityProof: string;
    identityProofImageId: string;
    identityProofNo: string;
    identityProofReverseImageId: string;
    identityRationCardType: string;
    inCurrentAddressSince: string;
    inCurrentAreaSince: string;
    incomeStability: string;
    inviteId: string;
    isBusinessEffectingTheEnvironment: string;
    isIndustrialArea: string;
    kgfsBankName: string;
    kgfsName: string;
    kycFurnishedCopyEnclosed: boolean;
    landLineNo: string;
    landmark: string;
    language: string;
    lastName: string;
    latestPanStatus: string;
    latestPanStatusUpdatedOn: Date;
    latitude: string;
    leftHandIndexImageId: string;
    leftHandMiddleImageId: string;
    leftHandRingImageId: string;
    leftHandSmallImageId: string;
    leftHandThumpImageId: string;
    locality: string;
    longitude: string;
    mailSameAsResidence: boolean;
    mailingDistrict: string;
    mailingDoorNo: string;
    mailingLocality: string;
    mailingPincode: string;
    mailingPostoffice: string;
    mailingState: string;
    mailingStreet: string;
    maritalStatus: string;
    middleName: string;
    mobileEnrollment: boolean;
    mobileEnrollmentId: string;
    mobileNumber2: string;
    mobilePhone: string;
    monthlyRent: number;
    motherName: string;
    multipleBuyers: string;
    multipleProducts: string;
    nameInLocalLanguage: string;
    nameOfRo: string;
    occupation1: string;
    occupation2: string;
    occupation3: string;
    occupation4: string;
    offlineUploadedOn: Date;
    oldCustomerId: string;
    ownership: string;
    panCardImageId: string;
    panNo: string;
    parentCustomerId: number;
    partnerCode: string;
    pendingApproval: string;
    photoImageId: string;
    pincode: number;
    place: string;
    politicalOrPoliceConnections: string;
    postOffice: string;
    previousRentDetails: string;
    properAndMatchingSignboard: string;
    referenceNo: string;
    religion: string;
    requestedLoanAmount: number;
    requestedLoanPurpose: string;
    rightHandIndexImageId: string;
    rightHandMiddleImageId: string;
    rightHandRingImageId: string;
    rightHandSmallImageId: string;
    rightHandThumpImageId: string;
    safetyMeasuresForEmployees: string;
    sanctionListBlocked: boolean;
    seasonalBusiness: string;
    selfServicePinNo: string;
    selfServicePinNoUpdatedOn: Date;
    selfServiceRegisteredNo: string;
    shopOrganized: string;
    spouseDateOfBirth: string;
    spouseFirstName: string;
    spouseLastName: string;
    spouseMiddleName: string;
    state: string;
    stdCode: string;
    stockMaterialManagement: string;
    street: string;
    termsAndConditionsExplained: boolean;
    title: string;
    udf29: string;
    udf30: string;
    udf31: string;
    udf32: string;
    urnGeneratedDate: Date;
    urnNo: string;
    utilisationOfBusinessPremises: string;
    vehiclesFinanced: number;
    vehiclesFree: number;
    vehiclesOwned: number;
    verified: boolean;
    verifiedUserId: string;
    version: number;
    villageName: string;
    weddingDate: string;
    whatsAppMobileNo: string;


    @Type(() => AdditionalKYC)
    additionalKYCs: AdditionalKYC[];

    @Type(() => BuyerDetail)
    buyerDetails: BuyerDetail[];

    @Type(() => CbCheckList)
    cbCheckList: CbCheckList[];

    @Type(() => CustomerBankAccount)
    customerBankAccounts: CustomerBankAccount[];

    @Type(() => CustomerPartner)
    customerPartner: CustomerPartner[];

    @Type(() => Enterprise)
    enterprise: Enterprise;

    @Type(() => EnterpriseAsset)
    enterpriseAssets: EnterpriseAsset[];

    @Type(() => EnterpriseBureauDetail)
    enterpriseBureauDetails: EnterpriseBureauDetail[];

    @Type(() => EnterpriseCustomerRelation)
    enterpriseCustomerRelations: EnterpriseCustomerRelation[];

    @Type(() => EnterpriseRegistration)
    enterpriseRegistrations: EnterpriseRegistration[];

    @Type(() => Expenditure)
    expenditures: Expenditure[] = [];

    @Type(() => FamilyMember)
    familyMembers: FamilyMember[] = [];

    @Type(() => FinancialAsset)
    financialAssets: FinancialAsset[];

    @Type(() => FinancialSummary)
    financialSummaries: FinancialSummary[];

    @Type(() => FixedAssetsMachinary)
    fixedAssetsMachinaries: FixedAssetsMachinary[];

    @Type(() => IncomeThroughSale)
    incomeThroughSales: IncomeThroughSale[];

    @Type(() => Liability)
    liabilities: Liability[];

    @Type(() => MeFamilyMapping)
    meFamilyMappings: MeFamilyMapping[];

    @Type(() => OtherBusinessIncome)
    otherBusinessIncomes: OtherBusinessIncome[];

    @Type(() => PhysicalAsset)
    physicalAssets: PhysicalAsset[];

    @Type(() => Miscellaneous)
    miscellaneous: Miscellaneous;

    @Type(() => RawMaterialExpens)
    rawMaterialExpenses: RawMaterialExpens[];

    @Type(() => SupplierDetail)
    supplierDetails: SupplierDetail[];

    @Type(() => Udf)
    udf: Udf;

    @Type(() => Verification)
    verifications: Verification[];


}
