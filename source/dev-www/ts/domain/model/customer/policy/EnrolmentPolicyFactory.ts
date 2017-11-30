import {IPolicyFactory} from "../../../shared/IPolicyFactory";
import {IPolicy} from "../../../shared/IPolicy";
import {LoadNewCustomerData} from "./LoadNewCustomerData";
import {PreSaveCustomerPolicy} from "./PreSaveCustomerPolicy";
import {LoadEnrolmentCustomerDataPolicy} from "./LoadEnrolmentCustomerDataPolicy";

export class EnrolmentPolicyFactory implements IPolicyFactory{

    private static _instance:EnrolmentPolicyFactory = null;

    private constructor(){}

    public static getInstance(): EnrolmentPolicyFactory{
        if (EnrolmentPolicyFactory._instance == null){
            EnrolmentPolicyFactory._instance = new EnrolmentPolicyFactory();
        }
        return EnrolmentPolicyFactory._instance;
    }

    fromPolicyName(name: string):IPolicy<Object>{
        let obj = null;
        switch (name) {
            case 'LoadNewCustomerData':
                obj =  new LoadNewCustomerData();
                return obj;
            case 'PreSaveCustomerPolicy':
                return new PreSaveCustomerPolicy();
            case 'LoadEnrolmentCustomerDataPolicy':
                return new LoadEnrolmentCustomerDataPolicy();
            default:
                return null;

        }

        // return obj;
    }

}

