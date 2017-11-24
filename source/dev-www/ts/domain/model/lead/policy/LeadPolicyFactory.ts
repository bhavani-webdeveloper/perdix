
import {LeadPolicy} from "./LeadPolicy";
import {PopulateLeadInteractionPolicy} from "./PopulateLeadInteractionPolicy";
import {PopulateBasicLeadDataPolicy} from "./PopulateBasicLeadDataPolicy";
import {IPolicyFactory} from "../../../shared/IPolicyFactory";
export class LeadPolicyFactory implements IPolicyFactory{

    private static _instance:LeadPolicyFactory = null;

    private constructor(){}

    public static getInstance(): LeadPolicyFactory{
        if (LeadPolicyFactory._instance == null){
            LeadPolicyFactory._instance = new LeadPolicyFactory();
        }
        return LeadPolicyFactory._instance;
    }

    fromPolicyName(name: string):LeadPolicy<Object>{
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
