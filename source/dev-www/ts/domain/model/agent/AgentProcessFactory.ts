import Agent = require("./Agent");
import {PolicyManager} from "../../shared/PolicyManager";
import {AgentPolicyFactory} from "./policy/AgentPolicyFactory";
import {Observable} from "@reactivex/rxjs";
import {IAgentRepository} from "./IAgentRepository";
import {Customer} from "../customer/Customer";
import RepositoryFactory = require("../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../shared/RepositoryIdentifiers";
import {AgentProcess} from "./AgentProcess";
import {plainToClass} from "class-transformer";
import {Utils} from "../../shared/Utils";
class AgentProcessFactory {

     static agentPolicyFactory:AgentPolicyFactory = AgentPolicyFactory.getInstance();

    static agentRepo:IAgentRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.AgentProcess);

    static createFromAgentId(id: number): Observable<AgentProcess> {
        let lp: AgentProcess = new AgentProcess();
        return AgentProcessFactory.agentRepo.get(id)
            .map(
                (agent:Object) => {
                    lp.agent = <Agent>plainToClass<Agent, Object>(Agent, Utils.toJSObj(agent));
                    return lp;
                }
            )

    }

    static fromCustomer(obj: Customer): Observable<AgentProcess> {
        let ep = new AgentProcess();
        ep.customer = obj;
        let pm: PolicyManager<AgentProcess> = new PolicyManager<AgentProcess>(ep, AgentProcessFactory.agentPolicyFactory, 'onLoad', AgentProcess.getProcessConfig());
        return pm.applyPolicies();
    }

    static createFromCustomerID(id){
        let agentRepo: IAgentRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.Enrolment);
        return agentRepo.getCustomerById(id)
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
     static createNew(): Observable<AgentProcess>{
        return Observable.defer(() => {
            let lp: AgentProcess = new AgentProcess();
            lp.agent = new Agent();
            return Observable.of(lp);
        });
    }

}

export = AgentProcessFactory;




















