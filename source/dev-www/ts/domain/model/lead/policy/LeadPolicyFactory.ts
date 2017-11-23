
import {LeadPolicy} from "./LeadPolicy";
import {PopulateLeadInteractionPolicy} from "./PopulateLeadInteractionPolicy";
import {PopulateBasicLeadDataPolicy} from "./PopulateBasicLeadDataPolicy";
export class LeadPolicyFactory {

    static fromPolicyName(name: string):LeadPolicy<Object>{
        let obj = null;
        switch (name) {
            case 'PopulateLeadInteractionPolicy':
                obj =  new PopulateLeadInteractionPolicy();
                return obj;
            case 'PopulateBasicLeadDataPolicy':
                obj = new PopulateBasicLeadDataPolicy();
                return obj;
            default:
            	return null;

        }

        // return obj;
    }
}
