
import {LeadPolicy} from "./LeadPolicy";
import {PopulateLeadInteractionPolicy} from "./PopulateLeadInteractionPolicy";
export class LeadPolicyFactory {

    static fromPolicyName(name: string):LeadPolicy{
        let obj = null;
        switch (name) {
            case 'PopulateLeadInteraction':
                obj =  new PopulateLeadInteractionPolicy();

        }

        return obj;
    }
}
