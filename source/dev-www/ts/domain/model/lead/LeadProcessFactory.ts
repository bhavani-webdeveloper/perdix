import LeadProcess = require("./LeadProcess");
import {Observable} from "@reactivex/rxjs";
import Lead = require("./Lead");
import {ILeadRepository} from "./ILeadRepository";
import RepositoryFactory = require('../../shared/RepositoryFactory');
import { RepositoryIdentifiers } from '../../shared/RepositoryIdentifiers';
import {plainToClass} from "class-transformer";
import Utils = require("../../shared/Utils");

/**
 * Created by shahalpk on 21/11/17.
 */


export = class LeadProcessFactory {

	

    static createNew() : Observable<LeadProcess>{
        let leadPro: LeadProcess = new LeadProcess();
        leadPro.lead = new Lead();
        return leadPro.applyPolicies('onNew');
    }

    static createFromLeadId(id: number): Observable<LeadProcess> {
    	let leadRepo: ILeadRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.LeadProcess);
    	return leadRepo.getLead(id)
            .map(
                (value: Object) => {
                	let obj:Object = Utils.toJSObj(value);
                    let lead:Lead = <Lead>plainToClass(Lead, obj );
                    let leadProcess = new LeadProcess();
                    leadProcess.lead = lead;
                    return leadProcess.applyPolicies('onLoad');
                    
                }
            ).concatAll();
    }


}
