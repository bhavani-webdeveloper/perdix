///<amd-dependency path="perdixConfig/EnrolmentProcessConfig" name="enrolmentProcessConfig"/>
import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "./IEnrolmentRepository";
import RepositoryFactory = require('../../shared/RepositoryFactory');
import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import {plainToClass} from "class-transformer";
import {PolicyManager} from "../../shared/PolicyManager";
import FamilyMember = require("./FamilyMember");
import {EnrolmentPolicyFactory} from "./policy/EnrolmentPolicyFactory";
import {Customer} from "./Customer";
import {EnrolmentProcess} from "./EnrolmentProcess";
import {Utils} from "../../shared/Utils";

declare var enrolmentProcessConfig: Object;
/**
 * Created by shahalpk on 21/11/17.
 */


class EnrolmentProcessFactory {

    static enrolmentPolicyFactory:EnrolmentPolicyFactory = EnrolmentPolicyFactory.getInstance();
    // static enrolmentProcessConfig:any = EnrolmentProcess.getProcessConfig();

    static fromCustomer(obj: Customer): Observable<EnrolmentProcess> {
        let ep = new EnrolmentProcess();
        ep.customer = obj;
        let pm: PolicyManager<EnrolmentProcess> = new PolicyManager<EnrolmentProcess>(ep, EnrolmentProcessFactory.enrolmentPolicyFactory, 'onLoad', EnrolmentProcess.getProcessConfig());
        return pm.applyPolicies();
    }

    static beforeProceedCustomer(obj: Customer): Observable<EnrolmentProcess> {
        let ep = new EnrolmentProcess();
        ep.customer = obj;
        let pm: PolicyManager<EnrolmentProcess> = new PolicyManager<EnrolmentProcess>(ep, EnrolmentProcessFactory.enrolmentPolicyFactory, 'beforeProceed', EnrolmentProcess.getProcessConfig());
        return pm.applyPolicies();
    }

    static beforeSaveEnrolment(obj: Customer): Observable<EnrolmentProcess> {
        let ep = new EnrolmentProcess();
        ep.customer = obj;
        let pm: PolicyManager<EnrolmentProcess> = new PolicyManager<EnrolmentProcess>(ep, EnrolmentProcessFactory.enrolmentPolicyFactory, 'beforeSave', EnrolmentProcess.getProcessConfig());
        return pm.applyPolicies();
    }

    static createNew(){
        let ep = new EnrolmentProcess();
        ep.customer = new Customer();
        let pm: PolicyManager<EnrolmentProcess> = new PolicyManager<EnrolmentProcess>(ep, EnrolmentProcessFactory.enrolmentPolicyFactory, 'onNew', EnrolmentProcess.getProcessConfig());
        return pm.applyPolicies();
    }

    static createFromCustomerID(id){
        let enrolmentRepo: IEnrolmentRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
        return enrolmentRepo.getCustomerById(id)
            .map(
                (value: Object) => {
                    let obj: Object = Utils.toJSObj(value);
                    let ep: EnrolmentProcess = new EnrolmentProcess();
                    let cs: Customer = <Customer>plainToClass<Customer, Object>(Customer, obj);
                    ep.customer = cs;
                    return ep;
                }
            )
    }


}


export = EnrolmentProcessFactory;
