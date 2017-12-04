import {Observable} from "@reactivex/rxjs";
import {IEnrolmentRepository} from "./IEnrolmentRepository";
import RepositoryFactory = require('../../shared/RepositoryFactory');
import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import {plainToClass} from "class-transformer";
import Utils = require("../../shared/Utils");
import {IPolicy} from "../../shared/IPolicy";
// import {LeadPolicy} from "./policy/LeadPolicy";
// import {LeadPolicyFactory} from "./policy/LeadPolicyFactory";
import {PolicyManager} from "../../shared/PolicyManager";
import {EnrolmentProcess} from "./EnrolmentProcess";
import FamilyMember = require("./FamilyMember");
import {EnrolmentPolicyFactory} from "./policy/EnrolmentPolicyFactory";
import {Customer} from "./Customer";


/**
 * Created by shahalpk on 21/11/17.
 */


export class EnrolmentProcessFactory {

    static enrolmentPolicyFactory:EnrolmentPolicyFactory = EnrolmentPolicyFactory.getInstance();
    static enrolmentProcessConfig:any = EnrolmentProcess.getProcessConfig();

    static fromCustomer(obj: Customer): Observable<EnrolmentProcess> {
        let ep = new EnrolmentProcess();
        ep.customer = obj;
        let pm: PolicyManager<EnrolmentProcess> = new PolicyManager<EnrolmentProcess>(ep, EnrolmentProcessFactory.enrolmentPolicyFactory, 'onLoad', EnrolmentProcessFactory.enrolmentProcessConfig);
        return pm.applyPolicies();
    }

    static beforeProceedCustomer(obj: Customer): Observable<EnrolmentProcess> {
        let ep = new EnrolmentProcess();
        ep.customer = obj;
        let pm: PolicyManager<EnrolmentProcess> = new PolicyManager<EnrolmentProcess>(ep, EnrolmentProcessFactory.enrolmentPolicyFactory, 'beforeProceed', EnrolmentProcessFactory.enrolmentProcessConfig);
        return pm.applyPolicies();
    }

    static beforeSaveEnrolment(obj: Customer): Observable<EnrolmentProcess> {
        let ep = new EnrolmentProcess();
        ep.customer = obj;
        let pm: PolicyManager<EnrolmentProcess> = new PolicyManager<EnrolmentProcess>(ep, EnrolmentProcessFactory.enrolmentPolicyFactory, 'beforeSave', EnrolmentProcessFactory.enrolmentProcessConfig);
        return pm.applyPolicies();
    }

    static createNew(){
        let ep = new EnrolmentProcess();
        ep.customer = new Customer();
        let pm: PolicyManager<EnrolmentProcess> = new PolicyManager<EnrolmentProcess>(ep, EnrolmentProcessFactory.enrolmentPolicyFactory, 'onNew', EnrolmentProcessFactory.enrolmentProcessConfig);
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
