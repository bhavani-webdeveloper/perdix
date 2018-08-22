
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
import {CalculateVehicleViabilityPolicy} from './CalculateVehicleViabilityPolicy';
import {LoanDerivedFieldsUpdate} from "./LoanDerivedFieldsUpdate";
import {CustomerEnrolmentCompletedPolicy} from './CustomerEnrolmentCompletedPolicy';
import {CustomerReferencePolicy} from './CustomerReferencePolicy';
import {CollateralFieldPolicy} from './CollateralFieldPolicy';
import {DefaultExpensePolicy} from './DefaultExpensePolicy';
import {DefaultIncomeTypePolicy} from './DefaultIncomeTypePolicy';
import {DefaultVehicleDocumentsPolicy} from './DefaultVehicleDocumentsPolicy';
import {DefaultCalculatedVehicleDetailsPolicy} from './DefaultCalculatedVehicleDetailsPolicy';
import {DefaultIndividualReferencePolicy} from './DefaultIndividualReferencePolicy';

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
            case 'CalculateVehicleViabilityPolicy':
                return new CalculateVehicleViabilityPolicy();
            case 'LoanDerivedFieldsUpdate':
                return new LoanDerivedFieldsUpdate();
            case 'CustomerEnrolmentCompletedPolicy':
                return new CustomerEnrolmentCompletedPolicy();
            case 'CustomerReferencePolicy':
                return new CustomerReferencePolicy();
            case 'CollateralFieldPolicy':
                return new CollateralFieldPolicy();
            case 'DefaultExpensePolicy':
                return new DefaultExpensePolicy();
            case 'DefaultIncomeTypePolicy':
                return new DefaultIncomeTypePolicy();
            case 'DefaultVehicleDocumentsPolicy':
                return new DefaultVehicleDocumentsPolicy();
            case 'DefaultCalculatedVehicleDetailsPolicy':
                return new DefaultCalculatedVehicleDetailsPolicy();
            case 'DefaultIndividualReferencePolicy':
                return new DefaultIndividualReferencePolicy();
            default:
                return null;
        }
    }

}
