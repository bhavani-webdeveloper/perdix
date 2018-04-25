
import {Observable} from "@reactivex/rxjs";

export interface ILiabilityRepaymentRepository {

	repay(reqData: Object): Observable<any>;

	partialRepay(reqData: Object): Observable<any>;
	// proceedLiabilityLoanAccount(reqData: Object): Observable<any>;
	// getLenderLoan(id: number): Observable<any>;
    
}