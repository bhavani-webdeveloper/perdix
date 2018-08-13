import {IPolicyFactory} from "../../../../shared/IPolicyFactory";
import {IPolicy} from "../../../../shared/IPolicy";

export class LiabilityRepaymentPolicyFactory implements IPolicyFactory{

    static liabilityRepayment:LiabilityRepaymentPolicyFactory = null;
    private constructor(){}

    public static getInstance(): LiabilityRepaymentPolicyFactory{
        if (LiabilityRepaymentPolicyFactory.liabilityRepayment== null){
            LiabilityRepaymentPolicyFactory.liabilityRepayment = new LiabilityRepaymentPolicyFactory();
        }
        return LiabilityRepaymentPolicyFactory.liabilityRepayment;
    }

    fromPolicyName(name: string):IPolicy<Object>{
        let obj = null;
       

         return obj;
    }

}

