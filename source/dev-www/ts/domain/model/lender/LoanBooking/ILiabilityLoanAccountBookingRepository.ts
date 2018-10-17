
import {Observable} from "@reactivex/rxjs";

export interface ILiabilityLoanAccountBookingRepository {

	saveLiabilityLoanAccount(reqData: Object): Observable<any>;
	proceedLiabilityLoanAccount(reqData: Object): Observable<any>;
	getLenderLoan(id: number): Observable<any>;
    
}
