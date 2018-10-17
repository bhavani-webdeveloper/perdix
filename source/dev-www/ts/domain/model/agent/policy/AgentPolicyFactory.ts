import {IPolicyFactory} from "../../../shared/IPolicyFactory";
import {IPolicy} from "../../../shared/IPolicy";
import {LoadNewCustomerData} from "../../customer/policy/LoadNewCustomerData";
import {DefaultRelatedCustomersPolicy} from "../policy/DefaultRelatedCustomersPolicy";
import {LoadRelatedCustomersPolicy} from "../policy/LoadRelatedCustomersPolicy";
import {PreSaveCustomerPolicy} from "../../customer/policy/PreSaveCustomerPolicy";
import {LoadEnrolmentCustomerDataPolicy} from "../../customer/policy/LoadEnrolmentCustomerDataPolicy";
import {EnrolmentDerivedPolicy} from "../../customer/policy/EnrolmentDerivedPolicy";
import {VerifyBankAccountNumberPolicy} from "../../customer/policy/VerifyBankAccountNumberPolicy";
import {MandatoryFieldsPolicy} from "../policy/MandatoryFieldsPolicy";

export class AgentPolicyFactory implements IPolicyFactory{

    private static _instance:AgentPolicyFactory = null;

    private constructor(){}

    public static getInstance(): AgentPolicyFactory{
        if (AgentPolicyFactory._instance == null){
            AgentPolicyFactory._instance = new AgentPolicyFactory();
        }
        return AgentPolicyFactory._instance;
    }

    fromPolicyName(name: string):IPolicy<Object>{
        let obj = null;
        switch (name) {
            case 'LoadNewCustomerData':
               obj =  new LoadNewCustomerData();
                return obj;
            case 'LoadRelatedCustomersPolicy':
                obj = new LoadRelatedCustomersPolicy();
                return obj;
            case 'DefaultRelatedCustomersPolicy':
                obj = new DefaultRelatedCustomersPolicy();
                return obj;
            case 'PreSaveCustomerPolicy':
               return new PreSaveCustomerPolicy();
            case 'LoadEnrolmentCustomerDataPolicy':
                return new LoadEnrolmentCustomerDataPolicy();  
            case 'EnrolmentDerivedPolicy':
               return new EnrolmentDerivedPolicy();
            case 'VerifyBankAccountNumberPolicy':
               return new VerifyBankAccountNumberPolicy(); 
            case  'MandatoryFieldsPolicy' :
                 return new  MandatoryFieldsPolicy();     
            default:
                return null;

        }

        // return obj;
    }

}

