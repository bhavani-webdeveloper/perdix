
import {Observable} from "@reactivex/rxjs";
// import {AgentProcess} from "./AgentProcess";
import AgentProcess = require('./AgentProcess');


export interface IAgentRepository {

	get(id: number): Observable<any>;
	save(reqData: Object): Observable<any>;
	update(reqData: Object): Observable<any>;
	// create(reqData: any): Observable<any>;
	getCustomerById(id: number): Observable<any>;
    // updateEnrollment(reqData: Object): Observable<any>;

}
