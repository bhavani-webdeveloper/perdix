import { Type } from "class-transformer";

//LiabilityLenderDocumentDTOs

export class LiabilityLenderDocuments {
	documentName: string;
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
}

//export = LiabilityLenderDocuments;
