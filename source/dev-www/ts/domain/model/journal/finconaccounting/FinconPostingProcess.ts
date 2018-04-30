///<amd-dependency path="perdixConfig/FinconPostingProcessConfig" name="finconPostingProcessConfig"/>

import { RepositoryIdentifiers } from '../../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../../shared/RepositoryFactory');
import JournalHeader = require("./JournalHeader");
import {IFinconRepository} from "./IFinconRepository";
import {Observable} from "@reactivex/rxjs";
import {FinconPostingPolicyFactory} from "./policy/FinconPostingPolicyFactory";
import {CanApplyPolicy} from "../../../shared/IPolicy";
import {PolicyManager} from "../../../shared/PolicyManager";
import {FinconPostingFactory} from "./FinconPostingFactory";


declare var finconPostingProcessConfig: Object;

export class FinconPostingProcess implements CanApplyPolicy {
    
    journalHeader: JournalHeader;
    stage: string;
    private journalEntryProcessAction: string;

    finconRepo: IFinconRepository;
    constructor() {
        this.finconRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.FinconPostingProcess);
    }

    static createNewProcess() : Observable<FinconPostingProcess> {
        let obs1 = FinconPostingFactory.createNew();
        return obs1.flatMap(
            (finconProcess) => {
                let pm: PolicyManager<FinconPostingProcess> = new PolicyManager<FinconPostingProcess>(finconProcess, FinconPostingPolicyFactory.getInstance(), 'onNew', FinconPostingProcess.getProcessConfig());
                return pm.applyPolicies();
            }
        )
    }

    static getJournal(id: number): Observable<FinconPostingProcess> {
        let obs1 = FinconPostingFactory.createFromJournal(id);
        return obs1.flatMap(
            (finconProcess) => {
                let pm: PolicyManager<FinconPostingProcess> = new PolicyManager<FinconPostingProcess>(finconProcess, FinconPostingPolicyFactory.getInstance(), 'onLoad', FinconPostingProcess.getProcessConfig());
                return pm.applyPolicies();
            }
        )
    }

    save(): any{
        this.journalEntryProcessAction = 'SAVE';
        let pmBeforeUpdate:PolicyManager<FinconPostingProcess>  = new PolicyManager(this, FinconPostingPolicyFactory.getInstance(), 'beforeSave', FinconPostingProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = null;
        if (this.journalHeader.id){
            obs2 = this.finconRepo.updateJournal(this);
        } else {
            obs2 = this.finconRepo.createJournal(this);
        }

        let pmAfterUpdate:PolicyManager<FinconPostingProcess>  = new PolicyManager(this, FinconPostingPolicyFactory.getInstance(), 'afterSave', FinconPostingProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    proceed(toStage?: any): Observable<FinconPostingProcess>{
        this.stage = toStage;
        this.journalEntryProcessAction = 'PROCEED';
        let pmBeforeUpdate:PolicyManager<FinconPostingProcess>  = new PolicyManager(this, FinconPostingPolicyFactory.getInstance(), 'beforeProceed', FinconPostingProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.finconRepo.updateJournal(this);
        let pmAfterUpdate:PolicyManager<FinconPostingProcess>  = new PolicyManager(this, FinconPostingPolicyFactory.getInstance(), 'afterProceed', FinconPostingProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

   reject(): Observable<FinconPostingProcess>{
        // this.stage = toStage;
        this.journalEntryProcessAction = 'PROCEED';
        this.stage = 'Rejected';
        let pmBeforeUpdate:PolicyManager<FinconPostingProcess>  = new PolicyManager(this, FinconPostingPolicyFactory.getInstance(), 'beforeReject', FinconPostingProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.finconRepo.updateJournal(this);
        let pmAfterUpdate:PolicyManager<FinconPostingProcess>  = new PolicyManager(this, FinconPostingPolicyFactory.getInstance(), 'afterReject', FinconPostingProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    sendBack(): Observable<FinconPostingProcess>{
        // this.stage = toStage;
        this.journalEntryProcessAction = 'PROCEED';
        let pmBeforeUpdate:PolicyManager<FinconPostingProcess>  = new PolicyManager(this, FinconPostingPolicyFactory.getInstance(), 'beforeSendBack', FinconPostingProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.finconRepo.updateJournal(this);
        let pmAfterUpdate:PolicyManager<FinconPostingProcess>  = new PolicyManager(this, FinconPostingPolicyFactory.getInstance(), 'afterSendBack', FinconPostingProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }



    static getProcessConfig(){
        return finconPostingProcessConfig;
    }

}
