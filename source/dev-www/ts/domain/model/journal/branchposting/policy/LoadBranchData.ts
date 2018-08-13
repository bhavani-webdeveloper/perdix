
import {BranchPostingPolicy} from "./BranchPostingPolicy";
import {Observable} from "@reactivex/rxjs";

import {UserSession, ISession} from "../../../../shared/Session";
import {ObjectFactory} from "../../../../shared/ObjectFactory";
import {BranchPostingProcess} from "../BranchPostingProcess";
import {Utils} from "../../../../shared/Utils";


export interface PopulateLeadBranchArgs {
    
}
export class LoadBranchData implements BranchPostingPolicy<PopulateLeadBranchArgs> {

    args: PopulateLeadBranchArgs;

    setArguments(args: PopulateLeadBranchArgs ) {
        this.args = args;
    }

    run(branchPostingProcess: BranchPostingProcess): Observable<BranchPostingProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
        branchPostingProcess.journalEntryDto.branchId = activeSession.getBranchId();

        return Observable.of(branchPostingProcess);
    }

}
