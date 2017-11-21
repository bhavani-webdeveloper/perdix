
import {Observable} from "@reactivex/rxjs";

export interface ILeadRepository {

	getLead(id: number): Observable<any>;

}
