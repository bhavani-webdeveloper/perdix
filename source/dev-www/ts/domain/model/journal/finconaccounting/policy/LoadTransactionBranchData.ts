
import {FinconPostingPolicy} from "./FinconPostingPolicy";
import {Observable} from "@reactivex/rxjs";

import {UserSession, ISession} from "../../../../shared/Session";
import {ObjectFactory} from "../../../../shared/ObjectFactory";
import {FinconPostingProcess} from "../FinconPostingProcess";
import {Utils} from "../../../../shared/Utils";


export interface PopulateLeadBranchArgs {
    
}
export class LoadTransactionBranchData implements FinconPostingPolicy<PopulateLeadBranchArgs> {

    args: PopulateLeadBranchArgs;

    setArguments(args: PopulateLeadBranchArgs ) {
        this.args = args;
    }

    run(finconPostingProcess: FinconPostingProcess): Observable<FinconPostingProcess> {
        let activeSession:ISession = ObjectFactory.getInstance("Session");
       //finconPostingProcess.journalHeader.transactionBranchId = activeSession.getBranchId();

        return Observable.of(finconPostingProcess);
    }

}
