
export enum LoanCustomerRelationTypes {
    APPLICANT = 'Applicant',
    CO_APPLICANT = 'Co-Applicant',
    GUARANTOR = 'Guarantor',
    LOAN_CUSTOMER = 'Customer'
}

export class LoanCustomerRelation {
	customerId: number;
    id: number;
    loanId: number;
    psychometricCompleted: string;
    psychometricRequired: string;
    relation: LoanCustomerRelationTypes;
    relationshipWithApplicant: string;
    urn: string;
    name: string;
    version: number;
}
