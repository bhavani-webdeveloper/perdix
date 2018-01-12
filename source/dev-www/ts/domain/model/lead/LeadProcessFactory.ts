import {Observable} from "@reactivex/rxjs";
import Lead = require("./Lead");
import {ILeadRepository} from "./ILeadRepository";
import RepositoryFactory = require('../../shared/RepositoryFactory');
import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import {plainToClass} from "class-transformer";
import {LeadProcess} from "./LeadProcess";
import {Utils} from "../../shared/Utils";

/**
 * Created by shahalpk on 21/11/17.
 */


export class LeadProcessFactory {

    static createNew() : Observable<LeadProcess>{
        let leadProcess: LeadProcess = new LeadProcess();
        leadProcess.lead = new Lead();
        leadProcess.lead.leadInteractions = [];
        return Observable.of(leadProcess);
    }

    static createFromLeadId(id: number): Observable<LeadProcess> {
    	let leadRepo: ILeadRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LeadProcess);
    	return leadRepo.getLead(id)
            .map(
                (value: Object) => {
                	let obj:Object = Utils.toJSObj(value);
                    //noinspection TypeScriptValidateTypes
                    let lead:Lead = <Lead>plainToClass<Lead, Object>(Lead, obj);
                    let leadProcess = new LeadProcess();
                    leadProcess.lead = lead;
                    return leadProcess;
                }
            );
    }
}
