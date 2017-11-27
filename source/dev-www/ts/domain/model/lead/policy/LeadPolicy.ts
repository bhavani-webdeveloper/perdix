import {IPolicy} from "../../../shared/IPolicy";
import LeadProcess = require("../LeadProcess");
import {Observable} from "@reactivex/rxjs";
import Utils = require("../../../shared/Utils");
import * as _ from "lodash";

declare let leadProcessConfig:any;

abstract class LeadPolicy<V> extends IPolicy<LeadProcess> {

    abstract run(obj: LeadProcess): Observable<LeadProcess>;

}

export {LeadPolicy}
