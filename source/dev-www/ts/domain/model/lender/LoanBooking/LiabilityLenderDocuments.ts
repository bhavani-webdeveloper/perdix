import { Type } from "class-transformer";

//LiabilityLenderDocumentDTOs

class LiabilityLenderDocuments {
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

export = LiabilityLenderDocuments;
