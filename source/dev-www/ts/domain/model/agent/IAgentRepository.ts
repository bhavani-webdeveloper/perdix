
import {Observable} from "@reactivex/rxjs";
import {AgentProcess} from "./AgentProcess";


export interface IAgentRepository {

	get(id: number): Observable<any>;
	save(reqData: Object): Observable<any>;
	update(reqData: Object): Observable<any>;
	create(reqData: any): Observable<any
	getCustomerById(id: number): Observable<AgentProcess>;
    updateEnrollment(reqData: Object): Observable<AgentProcess>;

}
