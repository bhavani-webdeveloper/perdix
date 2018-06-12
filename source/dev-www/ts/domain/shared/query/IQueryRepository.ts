
import {Observable} from "@reactivex/rxjs";
export interface IQueryRepository {

    getAllLoanPurpose1():Observable<any>;
    getAllLoanPurpose2(model: string):Observable<any>;
    getVehicleDetails():Observable<any>; 
}
