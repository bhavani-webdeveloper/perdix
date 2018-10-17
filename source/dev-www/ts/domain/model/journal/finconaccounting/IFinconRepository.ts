
import {Observable} from "@reactivex/rxjs";

export interface IFinconRepository {

	getJournal(id: number): Observable<any>;
	createJournal(reqData: Object): Observable<any>;
	updateJournal(reqData: Object): Observable<any>;
}
