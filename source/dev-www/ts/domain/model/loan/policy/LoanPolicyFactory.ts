
import {IPolicyFactory} from "../../../shared/IPolicyFactory";
import {IPolicy} from "../../../shared/IPolicy";
import {SampleSimplePolicy} from "./SampleSimplePolicy";
import {SampleMultiPolicy} from "./SampleMultiPolicy";
export class LoanPolicyFactory implements IPolicyFactory{

    private static _instance:LoanPolicyFactory = null;

    private constructor(){}

    public static getInstance(): LoanPolicyFactory{
        if (LoanPolicyFactory._instance == null){
            LoanPolicyFactory._instance = new LoanPolicyFactory();
        }
        return LoanPolicyFactory._instance;
    }

    fromPolicyName(name: string): IPolicy<any> {
        let obj = null;

        switch (name){
            case 'SampleSimplePolicy':
                obj = new SampleSimplePolicy();
                return obj;
            case 'SampleMultiPolicy':
                obj = new SampleMultiPolicy();
                return obj;
            default:
                return null;
        }
    }

}
