import {BranchPostingPolicy} from "./BranchPostingPolicy";
import {IPolicyFactory} from "../../../../shared/IPolicyFactory";

export class BranchPostingPolicyFactory implements IPolicyFactory {

    private static _instance:BranchPostingPolicyFactory = null;

    private constructor(){}

    public static getInstance(): BranchPostingPolicyFactory{
        if (BranchPostingPolicyFactory._instance == null){
            BranchPostingPolicyFactory._instance = new BranchPostingPolicyFactory();
        }
        return BranchPostingPolicyFactory._instance;
    }

    fromPolicyName(name: string):BranchPostingPolicy<Object> {
        let obj = null;
        return obj;
    }
}