class LeadInteraction {
    additionalRemarks: string;
    altitude: string;
    customerResponse: string;
    id: number;
    interactionDate: string;
    latitude: string;
    leadId: number;
    loanOfficerId: string;
    location: string;
    longitude: string;
    photo1Id: string;
    picture: string;
    typeOfInteraction: string;
    version: number;

    public getLeadInteractions() {
        return "Hello! LeadInteractions!"
    }
}

export = LeadInteraction;