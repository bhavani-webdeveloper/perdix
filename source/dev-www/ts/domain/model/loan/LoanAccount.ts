import { Type } from "class-transformer";

import AccountUserDefinedField = require("./AccountUserDefinedField");
import BcAccount = require("./BcAccount");
import Collateral = require("./Collateral");
import DisbursementSchedule = require("./DisbursementSchedule");
import Guarantor = require("./Guarantor");
import JewelLoanDetails = require("./JewelLoanDetails");
import LoanCentre = require("./LoanCentre");
import LoanCustomerRelation = require("./LoanCustomerRelation");
import LoanDocument = require("./LoanDocument");
import LoanInsurance = require("./LoanInsurance");
import LoanMitigant = require("./LoanMitigant");
import Nominee = require("./Nominee");
import OrnamentsAppraisal = require("./OrnamentsAppraisal");
import TelecallingDetail = require("./TelecallingDetail");
import VehicleLoanDetails = require("./VehicleLoanDetails");
import Customer = require("../customer/Customer");
import * as _ from 'lodash';

//vehicleDTOs

class LoanAccount {

	accountNumber: string;
	annualizedPercentage: number;
	applicant: string;
	applicationFileId: string;
	applicationFileName: string;
	applicationStatus: string;
	applicationStatusUpdatedBy: string;
	applicationStatusUpdatedOn: string;
	assetAvailableForHypothecation: string;
	bankId: number;
	borrowerIlliterate: boolean;
	branchCode: string;
	branchId: number;
	chk1FileUploadId: string;
	chk1UploadFilePath: string;
	closed: boolean;
	coApplicant: string;
	coBorrowerUrnNo: string;
	collectionAccountNumber: string;
    collectionAccountType: string;
    collectionBankBranchName: string;
    collectionBankName: string;
    collectionCustomerNameAsInBank: string;
    collectionIfscCode: string;
    collectionPaymentType: string;
    commercialCibilCharge: number;
    currentStage: string;
    customerBank: string;
    customerBankAccountNumber: string;
    customerBankIfscCode: string;
    customerBranch: string;
    customerId: number;
    customerPortfolioInsurancePremium: number;
    customerSignDateExpected: string;
    dealIrr: number;
    disbursedAmountInPaisa: number;
    disbursementFromBankAccountNumber: string;
	doCustomerLoanAmount: number;
    doCustomerProcessingFee: number;
    dob: string;
    documentTracking: string;
    dsaPayout: number;
    dscIntegrationId: number;
    dscLoanAmount: number;
    dscOverride: boolean;
    dscOverrideRemarks: string;
    emiPaymentDateRequested: string;
    emiRequested: number;
    endTime: Date;
    estimatedDateOfCompletion: string;
    estimatedEmi: number;
    estimatedValueOfAssets: number;
    expectedCommercialCibilCharge: number;
    expectedIncrementalIncome: number;
    expectedInterestRate: number;
    expectedInterestSaving: number;
    expectedJobCreation: number;
    expectedPortfolioInsurancePremium: number;
    expectedProcessingFeePercentage: number;
    fee3: number;
    fee4: number;
    fee5: number;
    fileNumber: number;
    firstRepaymentDate: string;
    frequency: string;
    frequencyRequested: string;
    gstNumber: string;
    husbandOrFatherFirstName: string;
    husbandOrFatherLastName: string;
    husbandOrFatherMiddleName: string;
    id: number;
    insuranceFee: number;
    insuranceRateCode: string;
    insuranceType: string;
    interestRate: number;
    isNpa: boolean;
    isRestructure: boolean;
    lastStageChangedAt: Date;
    leadId: number;
    linkedAccountNumber: string;
    literateWitnessFirstName: string;
    literateWitnessLastName: string;
    literateWitnessMiddleName: string;
    loanAmount: number;
    loanAmountRequested: number;
    loanApplicationDate: string;
    loanClosedAt: Date;
    loanClosedBy: string;
    loanCycle: number;
    loanDisbursementDate: string;
    loanPurpose1: string;
    loanPurpose2: string;
    loanPurpose3: string;
    loanToValue: number;
    loanType: string;
    maxEmi: number;
    numberOfDisbursed: number;
    numberOfDisbursements: number;
    oldAccountNO: string;
    originalAccountNumber: string;
    otherFee: number;
    partnerAccountNumber: string;
    partnerApprovalStatus: string;
    partnerCode: string;
    partnerLoanAmount: number;
    partnerProcessingFee: number;
    partnerRemarks: string;
    pendingApproval: string;
    percentageIncreasedIncome: number;
    percentageInterestSaved: number;
    portfolioInsurancePremium: number;
    portfolioInsurancePremiumCalculated: string;
    portfolioInsuranceServiceCharge: number;
    portfolioInsuranceServiceTax: number;
    portfolioInsuranceUrn: string;
    preEmi: number;
    processType: string;
    processingFeeInPaisa: number;
    processingFeePercentage: number;
    processingFeeServiceTax: number;
    productCategory: string;
    productCode: string;
    productType: string;
    proposedHires: string;
    psychometricCompleted: string;
    rejectReason: string;
    relation: string;
    sanctionDate: string;
    sbAccountNo: string;
    scheduleStartDate: string;
    screeningDate: string;
    securityDepositAllowed: boolean;
    securityEmi: number;
    securityEmiRequired: string;
    spousePortfolioInsurancePremium: number;
    startTime: Date;
    status: string;
    tenure: string;
    tenureInYears: number;
    tenureRequested: number;
    urnNo: string;
    valuator: string;
    version: number;
    witnessFirstName: string;
    witnessLastName: string;
    witnessMiddleName: string;
    witnessRelationship: string;
    wmName: string;

    @Type(() => AccountUserDefinedField)
    accountUserDefinedFields: AccountUserDefinedField;

    @Type(() => BcAccount)
    bcAccount: BcAccount;

    @Type(() => Collateral)
    collateral: Collateral[];

    @Type(() => DisbursementSchedule)
    disbursementSchedules: DisbursementSchedule[];

    @Type(() => Guarantor)
    guarantors: Guarantor[];

    @Type(() => JewelLoanDetails)
    jewelLoanDetails: JewelLoanDetails;

    @Type(() => LoanCentre)
    loanCentre: LoanCentre;

    @Type(() => LoanCustomerRelation)
    loanCustomerRelations: LoanCustomerRelation[];

    @Type(() => LoanDocument)
    loanDocuments: LoanDocument[];

    @Type(() => LoanInsurance)
    loanInsurance: LoanInsurance;

    @Type(() => LoanMitigant)
    loanMitigants: LoanMitigant[];

    @Type(() => OrnamentsAppraisal)
    ornamentsAppraisals: OrnamentsAppraisal[];

    @Type(() => VehicleLoanDetails)
    vehicleLoanDetails: VehicleLoanDetails[];

    @Type(() => TelecallingDetail)
    telecallingDetails: TelecallingDetail[];

    @Type(() => Nominee)
    nominees: Nominee[];


    private _loanCustomer: Customer;

    @Type(() => Customer)
    applicantCustomer: Customer = [];

    @Type(() => Customer)
    coApplicantCustomers: Customer[] = [];

    @Type(() => Customer)
    guarantorCustomers: Customer[] = [];


    get loanCustomer(): Customer {
        return this._loanCustomer;
    }

    set loanCustomer(value: Customer) {
        this._loanCustomer = value;
        this.customerId = value.id;
        this.urnNo = value.urnNo;
    }

    public setRelatedCustomerWithRelation(customer: Customer, relation: string): LoanAccount {
        switch (relation.toUpperCase()) {
            case 'APPLICANT':
                this.applicantCustomer = customer;
                break;

            case 'COAPPLICANT':
            case 'CO-APPLICANT':
                if(!_.isArray(this.coApplicantCustomers)) {
                    this.coApplicantCustomers = [];
                }
                this.coApplicantCustomers.push(customer);
                break;

            case 'GUARANTOR':
                this.guarantorCustomers.push(customer);
                break;

            default:
                break;
        }
        // let lcr = new LoanCustomerRelation();
        // lcr.relation = relation;
        // this.loanCustomerRelations.push(lcr);

        return this;
    }

    public setRelatedCustomer(customer: Customer): LoanAccount{
        let index = _.findIndex(this.loanCustomerRelations, function(lcr){
            return lcr.customerId==customer.id;
        });

        if (index == -1) {return this;}

        let lcr: LoanCustomerRelation = this.loanCustomerRelations[index];
        let relation = lcr.relation.toUpperCase();


        switch (relation){
            case 'APPLICANT':
                this.applicantCustomer = customer;
                break;

            case 'COAPPLICANT':
            case 'CO-APPLICANT':
                this.coApplicantCustomers.push(customer);
                break;

            case 'GUARANTOR':
                this.guarantorCustomers.push(customer);
                break;

            default:
                break;
        }
        return this;
    }

    public static createFromJSON(data:any) {

    }
}

export = LoanAccount;
