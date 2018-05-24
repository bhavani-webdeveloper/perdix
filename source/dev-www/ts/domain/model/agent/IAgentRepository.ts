
import {Observable} from "@reactivex/rxjs";

export interface IAgentRepository {

	getAgent(id: number): Observable<any>;
	saveAgent(reqData: Object): Observable<any>;
	updateAgent(reqData: Object): Observable<any>;

}
