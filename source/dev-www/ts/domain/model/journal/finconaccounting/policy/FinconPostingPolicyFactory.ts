import {FinconPostingPolicy} from "./FinconPostingPolicy";
import {IPolicyFactory} from "../../../../shared/IPolicyFactory";
import {LoadTransactionBranchData} from "./LoadTransactionBranchData";
export class FinconPostingPolicyFactory implements IPolicyFactory {

    private static _instance:FinconPostingPolicyFactory = null;

    private constructor(){}

    public static getInstance(): FinconPostingPolicyFactory{
        if (FinconPostingPolicyFactory._instance == null){
            FinconPostingPolicyFactory._instance = new FinconPostingPolicyFactory();
        }
        return FinconPostingPolicyFactory._instance;
    }

    fromPolicyName(name: string):FinconPostingPolicy<Object> {
         let obj = null;
        switch(name) {
            case 'LoadTransactionBranchData':    
                return new LoadTransactionBranchData();
            default:
                return null;
        }
        return obj;
    }
}