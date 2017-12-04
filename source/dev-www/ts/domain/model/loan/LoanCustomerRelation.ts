
export enum LoanCustomerRelationTypes {
    APPLICANT = 'Applicant',
    CO_APPLICANT = 'Co-Applicant',
    GUARANTOR = 'Guarantor'
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
    version: number;
}
