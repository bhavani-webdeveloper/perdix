///<amd-dependency path="perdixConfig/AgentProcessConfig" name="agentProcessConfig"/>
import {Observable} from "@reactivex/rxjs";
import {IAgentRepository} from "./IAgentRepository";
import RepositoryFactory = require('../../shared/RepositoryFactory');
import {RepositoryIdentifiers} from '../../shared/RepositoryIdentifiers';
import {plainToClass} from "class-transformer";
import {PolicyManager} from "../../shared/PolicyManager";
import {AgentPolicyFactory} from "./policy/AgentPolicyFactory";
import {Customer} from "../customer/Customer";
import {AgentProcess} from "./AgentProcess";
import {Utils} from "../../shared/Utils";

declare var enrolmentProcessConfig: Object;
/**
 * Created by shahalpk on 21/11/17.
 */


class AgentProcessFactory {

    static AgentPolicyFactory:AgentPolicyFactory = AgentPolicyFactory.getInstance();
    // static enrolmentProcessConfig:any = EnrolmentProcess.getProcessConfig();

    static fromCustomer(obj: Customer): Observable<AgentProcess> {
        let ep = new AgentProcess();
        ep.customer = obj;
        let pm: PolicyManager<AgentProcess> = new PolicyManager<AgentProcess>(ep, AgentProcessFactory.AgentPolicyFactory, 'onLoad', AgentProcess.getProcessConfig());
        return pm.applyPolicies();
    }

    static beforeProceedCustomer(obj: Customer): Observable<AgentProcess> {
        let ep = new AgentProcess();
        ep.customer = obj;
        let pm: PolicyManager<AgentProcess> = new PolicyManager<AgentProcess>(ep, AgentProcessFactory.AgentPolicyFactory, 'beforeProceed', AgentProcess.getProcessConfig());
        return pm.applyPolicies();
    }

    static beforeSaveEnrolment(obj: Customer): Observable<AgentProcess> {
        let ep = new AgentProcess();
        ep.customer = obj;
        let pm: PolicyManager<AgentProcess> = new PolicyManager<AgentProcess>(ep, AgentProcessFactory.AgentPolicyFactory, 'beforeSave', AgentProcess.getProcessConfig());
        return pm.applyPolicies();
    }

    static createNew(){
        let ep = new AgentProcess();
        ep.customer = new Customer();
        let pm: PolicyManager<AgentProcess> = new PolicyManager<AgentProcess>(ep, AgentProcessFactory.AgentPolicyFactory, 'onNew', AgentProcess.getProcessConfig());
        return pm.applyPolicies();
    }

    static createFromCustomerID(id){
        let agentRepo: IAgentRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.AgentProcess);
        return agentRepo.get(id)
            .map(
                (value: Object) => {
                    let obj: Object = Utils.toJSObj(value);
                    let ep: AgentProcess = new AgentProcess();
                    let cs: Customer = <Customer>plainToClass<Customer, Object>(Customer, obj);
                    ep.customer = cs;
                    return ep;
                }
            )
    }


}


export = AgentProcessFactory;
