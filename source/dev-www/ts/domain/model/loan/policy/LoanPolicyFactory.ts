
import {IPolicyFactory} from "../../../shared/IPolicyFactory";
import {IPolicy} from "../../../shared/IPolicy";
import {SampleSimplePolicy} from "./SampleSimplePolicy";
import {SampleMultiPolicy} from "./SampleMultiPolicy";

import {LoadRelatedCustomersPolicy} from "./LoadRelatedCustomersPolicy";
import {DefaultRelatedCustomersPolicy} from "./DefaultRelatedCustomersPolicy";

import {MandatoryFieldsPolicy} from './MandatoryFieldsPolicy';
import {OriginationToBookingPolicy} from './OriginationToBookingPolicy';
import {DefaultVehicleComponentsPolicy} from './DefaultVehicleComponentsPolicy';
import {DefaultVehicleAccessoriesPolicy} from './DefaultVehicleAccessoriesPolicy';
import {CloseLeadonLoanSave} from './CloseLeadonLoanSave';
import {LoanDerivedFieldsUpdate} from "./LoanDerivedFieldsUpdate";

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
            case 'LoadRelatedCustomersPolicy':
                obj = new LoadRelatedCustomersPolicy();
                return obj;
            case 'DefaultRelatedCustomersPolicy':
                obj = new DefaultRelatedCustomersPolicy();
                return obj;
            case 'MandatoryFieldsPolicy':
                return new MandatoryFieldsPolicy();
            case 'OriginationToBookingPolicy':
                return new OriginationToBookingPolicy();
            case 'DefaultVehicleComponentsPolicy':
                return new DefaultVehicleComponentsPolicy();
            case 'DefaultVehicleAccessoriesPolicy':
                return new DefaultVehicleAccessoriesPolicy();
            case 'CloseLeadonLoanSave':
                return new CloseLeadonLoanSave();
            case 'LoanDerivedFieldsUpdate':
                return new LoanDerivedFieldsUpdate();
            default:
                return null;
        }
    }

}
