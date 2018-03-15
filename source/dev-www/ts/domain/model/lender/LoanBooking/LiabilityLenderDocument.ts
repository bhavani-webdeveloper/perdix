import { Type } from "class-transformer";

//LiabilityLenderDocumentDTOs

class LiabilityLenderDocument {
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

export = LiabilityLenderDocument;
