
import {Observable} from "@reactivex/rxjs";


export interface ILiabilityLoanAccountBookingRepository {

	saveLiabilityLoanAccount(reqData: Object): Observable<any>;
    
}
