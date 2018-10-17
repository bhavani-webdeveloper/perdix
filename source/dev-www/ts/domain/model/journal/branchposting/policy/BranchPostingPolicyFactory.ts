import {BranchPostingPolicy} from "./BranchPostingPolicy";
import {IPolicyFactory} from "../../../../shared/IPolicyFactory";
import {LoadBranchData} from "./LoadBranchData";
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
        switch(name) {
            case 'LoadBranchData':
                return new LoadBranchData();
            default:
                return null;
        }
        return obj;
    }
}