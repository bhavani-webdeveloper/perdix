import {FinconPostingPolicy} from "./FinconPostingPolicy";
import {IPolicyFactory} from "../../../../shared/IPolicyFactory";

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
        
        return obj;
    }
}