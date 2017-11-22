
import {LeadPolicy} from "./LeadPolicy";
import {PopulateLeadInteractionPolicy} from "./PopulateLeadInteractionPolicy";
export class LeadPolicyFactory {

    static fromPolicyName(name: string):LeadPolicy{
        let obj = null;
        switch (name) {
            case 'PopulateLeadInteractionPolicy':
                obj =  new PopulateLeadInteractionPolicy();
                return obj;
            default:
            	return null;

        }

        // return obj;
    }
}
