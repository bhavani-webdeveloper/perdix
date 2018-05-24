import {IPolicyFactory} from "../../../shared/IPolicyFactory";
import {IPolicy} from "../../../shared/IPolicy";
//import {LoadNewCustomerData} from "./LoadNewCustomerData";
import {PreSaveCustomerPolicy} from "./PreSaveCustomerPolicy";
import {LoadEnrolmentCustomerDataPolicy} from "./LoadEnrolmentCustomerDataPolicy";
import {EnrolmentDerivedPolicy} from "./EnrolmentDerivedPolicy";
import {SelfRelationshipRequiredPolicy} from "./SelfRelationshipRequiredPolicy";
import {CommercialCBCheckPolicy} from "./CommercialCBCheckPolicy";
import {MinimumReferencesPolicy} from "./MinimumReferencesPolicy";
import {GSTApplicablePolicy} from "./GSTApplicablePolicy";
import {VerifyBankAccountNumberPolicy} from "./VerifyBankAccountNumberPolicy";
import {DefaultIndividualReferencePolicy} from "./DefaultIndividualReferencePolicy";
import {VerifyIndividualReferencePolicy} from "./VerifyIndividualReferencePolicy";

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
               // obj =  new LoadNewCustomerData();
                //return obj;
           // case 'PreSaveCustomerPolicy':
            //    return new PreSaveCustomerPolicy();
            //case 'LoadEnrolmentCustomerDataPolicy':
                //return new LoadEnrolmentCustomerDataPolicy();
            //case 'EnrolmentDerivedPolicy':
               // return new EnrolmentDerivedPolicy();
            //case 'SelfRelationshipRequiredPolicy':
                //return new SelfRelationshipRequiredPolicy();
           // case 'CommercialCBCheckPolicy':
               // return new CommercialCBCheckPolicy();
            //case 'MinimumReferencesPolicy':
                //return new MinimumReferencesPolicy();
            //case 'GSTApplicablePolicy':
                //return new GSTApplicablePolicy();
           // case 'VerifyBankAccountNumberPolicy':
               // return new VerifyBankAccountNumberPolicy();
            //case 'DefaultIndividualReferencePolicy':
                //return new DefaultIndividualReferencePolicy();
            //case 'VerifyIndividualReferencePolicy':
                //return new VerifyIndividualReferencePolicy();
            default:
                return null;

        }

        // return obj;
    }

}

