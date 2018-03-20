import {IPolicyFactory} from "../../../../shared/IPolicyFactory";
import {IPolicy} from "../../../../shared/IPolicy";

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
        let obj = null;
       

         return obj;
    }

}

