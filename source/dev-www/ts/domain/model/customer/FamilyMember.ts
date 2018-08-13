import { Type } from 'class-transformer';

import Income = require("./Income");

class FamilyMember {
        anualEducationFee: number;
        contributionToExpenditure: number;
        customerId: number;
        dateOfBirth: string;
        dead: boolean;
        deathCertificateUploaded: boolean;
        deceaseDetailsCaptured: boolean;
        educationStatus: string;
        enrolled: boolean;
        enrolledUrnNo: string;
        enrollmentId: string;
        familyMemberFirstName: string;
        familyMemberLastName: string;
        familyMemberMiddleName: string;
        familySequenceId: number;
        gender: string;
        healthStatus: string;
        id: number;
        @Type(() => Income)
        incomes: Income[];
        isCoApplicant: string;
        maritalStatus: string;
        mobilePhone: string;
        relationShip: string;
        salary: number;
        udfId1: string;
        udfId2: string;
        udfId3: string;
        udfId4: string;
        udfId5: string;
        version: number;
}

export = FamilyMember;