
import {Observable} from "@reactivex/rxjs";

export interface ILeadRepository {

	getLead(id: number): Observable<any>;
	saveLead(reqData: Object): Observable<any>;
	updateLead(reqData: Object): Observable<any>;
    assignLead(reqData: Object): Observable<any>;

}
