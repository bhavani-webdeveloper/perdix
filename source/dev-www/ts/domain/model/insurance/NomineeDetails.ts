import { Type } from "class-transformer";

class NomineeDetails {
    nomineeIsMinor: boolean;
    nomineeMinorDob : Date;
    policyId : number;
    nomineePercentage :  number;
    nomineeName : string;
    nomineeGender : string;
    nomineeRelationship : string;
    gauridianTitle : string;
    gauridianName : string;
    gauridianMinorRelationship : string;
    gauridianGender : string;
    nomineeDoor : string;
}
export = NomineeDetails;