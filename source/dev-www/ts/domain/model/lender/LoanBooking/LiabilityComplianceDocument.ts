import { Type } from "class-transformer";

//LiabilityComplianceDocumentDTOs

class LiabilityComplianceDocument {
      documentType: string;
        fileId: string;
        id: number;
        isSignOff: string;
        lenderAccountNumber: string;
        lenderId: number;
        liablityAccountId: number;
        uploadedDate: string;
        version: number;
}

export = LiabilityComplianceDocument;
