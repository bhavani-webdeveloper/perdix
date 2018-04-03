import {IPolicyFactory} from "../../../../shared/IPolicyFactory";
import {IPolicy} from "../../../../shared/IPolicy";
import {LiabilityRelatedLenderPolicy} from "./LiabilityRelatedLenderPolicy";

export class LiabilityLoanAccountBookingPolicyFactory implements IPolicyFactory{

    static liabilityLoanFactory:LiabilityLoanAccountBookingPolicyFactory = null;
    private constructor(){}

    public static getInstance(): LiabilityLoanAccountBookingPolicyFactory{
        if (LiabilityLoanAccountBookingPolicyFactory.liabilityLoanFactory== null){
            LiabilityLoanAccountBookingPolicyFactory.liabilityLoanFactory = new LiabilityLoanAccountBookingPolicyFactory();
        }
        return LiabilityLoanAccountBookingPolicyFactory.liabilityLoanFactory;
    }

    fromPolicyName(name: string):IPolicy<Object>{
        switch (name) {
            case "LiabilityRelatedLenderPolicy":
                return new LiabilityRelatedLenderPolicy();
            
            default:
                return null;
        }
    }

}

