import {IPolicy} from "../../../../shared/IPolicy";
import FinconPostingProcess = require('../FinconPostingProcess');
import {Observable} from "@reactivex/rxjs";
import * as _ from "lodash";

declare let finconProcessConfig:any;

abstract class FinconPostingPolicy<V> extends IPolicy<FinconPostingProcess> {

    abstract run(obj: FinconPostingProcess): Observable<FinconPostingProcess>;

}

export {FinconPostingPolicy}
