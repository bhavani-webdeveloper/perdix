import {IPolicyFactory} from "../../../shared/IPolicyFactory";
import {IPolicy} from "../../../shared/IPolicy";




export class InsurancePolicyFactory implements IPolicyFactory{

    private static _instance:InsurancePolicyFactory = null;

    private constructor(){}

    public static getInstance(): InsurancePolicyFactory{
        if (InsurancePolicyFactory._instance == null){
            InsurancePolicyFactory._instance = new InsurancePolicyFactory();
        }
        return InsurancePolicyFactory._instance;
    }

   
}

