import LeadProcess = require("./LeadProcess");
import {Observable} from "@reactivex/rxjs";
import Lead = require("./Lead");
import {ILeadRepository} from "./ILeadRepository";
import RepositoryFactory = require('../../shared/RepositoryFactory');
import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import {plainToClass} from "class-transformer";
import Utils = require("../../shared/Utils");
import {IPolicy} from "../../shared/IPolicy";
import {LeadPolicy} from "./policy/LeadPolicy";
import {LeadPolicyFactory} from "./policy/LeadPolicyFactory";
import {PolicyManager} from "../../shared/PolicyManager";

/**
 * Created by shahalpk on 21/11/17.
 */


export = class LeadProcessFactory {



    static createNew() : Observable<LeadProcess>{
        let leadProcess: LeadProcess = new LeadProcess();
        leadProcess.lead = new Lead();
        let pm: PolicyManager<LeadProcess> = new PolicyManager<LeadProcess>(leadProcess, LeadPolicyFactory.getInstance(), 'onNew', LeadProcess.getProcessConfig());
        return pm.applyPolicies();
    }

    static createFromLeadId(id: number): Observable<LeadProcess> {
    	let leadRepo: ILeadRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LeadProcess);
    	return leadRepo.getLead(id)
            .map(
                (value: Object) => {
                	let obj:Object = Utils.toJSObj(value);
                    let lead:Lead = <Lead>plainToClass<Lead, Object>(Lead, obj);
                    let leadProcess = new LeadProcess();
                    leadProcess.lead = lead;
                    let pm: PolicyManager<LeadProcess> = new PolicyManager<LeadProcess>(leadProcess, LeadPolicyFactory.getInstance(), 'onLoad', LeadProcess.getProcessConfig());
                    return pm.applyPolicies();

                }
            ).concatAll();
    }


}
