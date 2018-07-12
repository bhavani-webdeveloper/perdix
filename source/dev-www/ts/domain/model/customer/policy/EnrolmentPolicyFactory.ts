import {IPolicyFactory} from "../../../shared/IPolicyFactory";
import {IPolicy} from "../../../shared/IPolicy";
import {LoadNewCustomerData} from "./LoadNewCustomerData";
import {PreSaveCustomerPolicy} from "./PreSaveCustomerPolicy";
import {LoadEnrolmentCustomerDataPolicy} from "./LoadEnrolmentCustomerDataPolicy";
import {EnrolmentDerivedPolicy} from "./EnrolmentDerivedPolicy";
import {EnrolmentDerivedPolicyforAge} from "./EnrolmentDerivedPolicyforAge";
import {SelfRelationshipRequiredPolicy} from "./SelfRelationshipRequiredPolicy";
import {CommercialCBCheckPolicy} from "./CommercialCBCheckPolicy";
import {MinimumReferencesPolicy} from "./MinimumReferencesPolicy";
import {GSTApplicablePolicy} from "./GSTApplicablePolicy";
import {VerifyBankAccountNumberPolicy} from "./VerifyBankAccountNumberPolicy";
import {VerifyIndividualReferencePolicy} from "./VerifyIndividualReferencePolicy";
import {VerifyTrackDetailsPolicy} from "./VerifyTrackDetailsPolicy"; 
import {MandatoryTangibleWorthPolicy} from "./MandatoryTangibleWorthPolicy";

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
            case 'EnrolmentDerivedPolicy':
                return new EnrolmentDerivedPolicy();
            case 'SelfRelationshipRequiredPolicy':
                return new SelfRelationshipRequiredPolicy();
            case 'CommercialCBCheckPolicy':
                return new CommercialCBCheckPolicy();
            case 'MinimumReferencesPolicy':
                return new MinimumReferencesPolicy();
            case 'GSTApplicablePolicy':
                return new GSTApplicablePolicy();
            case 'VerifyBankAccountNumberPolicy':
                return new VerifyBankAccountNumberPolicy();
            case 'MandatoryTangibleWorthPolicy':
                return new MandatoryTangibleWorthPolicy();
            case 'EnrolmentDerivedPolicyforAge':
                return new EnrolmentDerivedPolicyforAge();
            case 'VerifyTrackDetailsPolicy':
                return new VerifyTrackDetailsPolicy();
            case 'VerifyIndividualReferencePolicy':
                return new VerifyIndividualReferencePolicy();
            default:
                return null;

        }

        // return obj;
    }

}

