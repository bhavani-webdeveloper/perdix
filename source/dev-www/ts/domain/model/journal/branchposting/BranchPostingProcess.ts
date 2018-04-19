///<amd-dependency path="perdixConfig/BranchPostingProcessConfig" name="branchPostingProcessConfig"/>

import { RepositoryIdentifiers } from '../../../shared/RepositoryIdentifiers';
import RepositoryFactory = require('../../../shared/RepositoryFactory');
import BranchEntry = require("./BranchEntry");
import {IBranchRepository} from "./IBranchRepository";
import {Observable} from "@reactivex/rxjs";
import {BranchPostingPolicyFactory} from "./policy/BranchPostingPolicyFactory";
import {CanApplyPolicy} from "../../../shared/IPolicy";
import {PolicyManager} from "../../../shared/PolicyManager";
import {BranchPostingFactory} from "./BranchPostingFactory";


declare var branchPostingProcessConfig: Object;

export class BranchPostingProcess implements CanApplyPolicy {
    branchRepo: IBranchRepository;
    journal: BranchEntry;
    private journalAction: string;
    constructor() {
        this.branchRepo = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.BranchPostingProcess);
    }

    static createNewProcess() : Observable<BranchPostingProcess> {
        let obs1 = BranchPostingFactory.createNew();
        return obs1.flatMap(
            (leadProcess) => {
                let pm: PolicyManager<BranchPostingProcess> = new PolicyManager<BranchPostingProcess>(leadProcess, BranchPostingPolicyFactory.getInstance(), 'onNew', BranchPostingProcess.getProcessConfig());
                return pm.applyPolicies();
            }
        )
    }

    static getJournal(id: number): Observable<BranchPostingProcess> {
        let obs1 = BranchPostingFactory.createFromJournal(id);
        return obs1.flatMap(
            (leadProcess) => {
                let pm: PolicyManager<BranchPostingProcess> = new PolicyManager<BranchPostingProcess>(leadProcess, BranchPostingPolicyFactory.getInstance(), 'onLoad', BranchPostingProcess.getProcessConfig());
                return pm.applyPolicies();
            }
        )
    }

    save(): Observable<BranchPostingProcess> {
        this.journalAction = 'SAVE';
        let pmBeforeUpdate:PolicyManager<BranchPostingProcess>  = new PolicyManager(this, BranchPostingPolicyFactory.getInstance(), 'beforeSave', BranchPostingProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.branchRepo.updateJournal(this);
        let pmAfterUpdate:PolicyManager<BranchPostingProcess>  = new PolicyManager(this, BranchPostingPolicyFactory.getInstance(), 'afterSave', BranchPostingProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }

    proceed(): Observable<BranchPostingProcess>{
        // this.stage = toStage;
        this.journalAction = 'PROCEED';
        let pmBeforeUpdate:PolicyManager<BranchPostingProcess>  = new PolicyManager(this, BranchPostingPolicyFactory.getInstance(), 'beforeProceed', BranchPostingProcess.getProcessConfig());
        let obs1 = pmBeforeUpdate.applyPolicies();
        let obs2 = this.branchRepo.updateJournal(this);
        let pmAfterUpdate:PolicyManager<BranchPostingProcess>  = new PolicyManager(this, BranchPostingPolicyFactory.getInstance(), 'afterProceed', BranchPostingProcess.getProcessConfig());
        let obs3 = pmAfterUpdate.applyPolicies();
        return Observable.concat(obs1, obs2, obs3).last();
    }


    static getProcessConfig(){
        return branchPostingProcessConfig;
    }

}
