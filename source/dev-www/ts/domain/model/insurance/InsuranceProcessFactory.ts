///<amd-dependency path="perdixConfig/InsuranceProcessConfig" name="insuranceProcessConfig"/>
import {Observable} from "@reactivex/rxjs";
import {IInsuranceRepository} from "./IInsuranceRepository";
import RepositoryFactory = require('../../shared/RepositoryFactory');
import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import {plainToClass} from "class-transformer";
import {PolicyManager} from "../../shared/PolicyManager";


import {InsurancePolicyDetails} from "./InsurancePolicyDetails";
import {InsurancePolicyFactory} from "./policy/InsurancePolicyFactory";
import {InsuranceProcess} from "./InsuranceProcess";
import {Utils} from "../../shared/Utils";

declare var insuranceProcessConfig: Object;
/**
 * Created by shahalpk on 21/11/17.
 */


class InsuranceProcessFactory {

    static insurancePolicyFactory:InsurancePolicyFactory = InsurancePolicyFactory.getInstance();


    static plainToClass(insurancePolicyDetailsDTO:InsurancePolicyDetails): Observable<InsuranceProcess> {
        let ep:InsuranceProcess = new InsuranceProcess();
        ep.InsurancePolicyDetails = <InsurancePolicyDetails>plainToClass<InsurancePolicyDetails, Object>(InsurancePolicyDetails, Utils.toJSObj(insurancePolicyDetailsDTO));
        return Observable.of(ep);
    }

    static createNew(): Observable<InsuranceProcess>{
        return Observable.defer(() => {
            let lp: InsuranceProcess = new InsuranceProcess();
            lp.insurancePolicyDetailsDTO = new InsurancePolicyDetails();
            return Observable.of(lp);
        });
    }

   

     static createFromInsurancePolicyID(id){
        let insuranceRepo: IInsuranceRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Insurance);
        return insuranceRepo.getById(id)
            .map(
                (value: Object) => {
                    let obj: Object = Utils.toJSObj(value);
                    let ep: InsuranceProcess = new InsuranceProcess();
                    let cs: InsurancePolicyDetails = <InsurancePolicyDetails>plainToClass<InsurancePolicyDetails, Object>(InsurancePolicyDetails, obj);
                    ep.insurancePolicyDetailsDTO = cs;
                    return ep;
                }
            )
    }

}


export = InsuranceProcessFactory;
