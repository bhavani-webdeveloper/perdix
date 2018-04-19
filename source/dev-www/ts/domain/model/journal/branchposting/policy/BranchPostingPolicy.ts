import {IPolicy} from "../../../../shared/IPolicy";
import BranchPostingProcess = require('../BranchPostingProcess');
import {Observable} from "@reactivex/rxjs";
import * as _ from "lodash";

declare let branchProcessConfig:any;

abstract class BranchPostingPolicy<V> extends IPolicy<BranchPostingProcess> {

    abstract run(obj: BranchPostingProcess): Observable<BranchPostingProcess>;

}

export {BranchPostingPolicy}
