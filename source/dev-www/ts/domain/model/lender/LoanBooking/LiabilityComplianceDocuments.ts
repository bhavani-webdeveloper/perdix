import { Type } from "class-transformer";

//LiabilityComplianceDocumentDTOs

class LiabilityComplianceDocuments {
  	documentType: string;
    fileId: string;
    id: number;
    isSignOff: string;
    lenderAccountNumber: string;
    lenderId: number;
    liablityAccountId: number;
    uploadedDate: string;
    version: number;    
    otherDocumentName: string;
    remarks: string;
    documentName: string;
}

export = LiabilityComplianceDocuments;
