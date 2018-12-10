
import {Observable} from "@reactivex/rxjs";
import {InsuranceProcess} from "./InsuranceProcess";

export interface IInsuranceRepository {

	getInsurancePolicyById(id: number): Observable<InsuranceProcess>;
    saveInsurancePolicy(reqData: Object): Observable<InsuranceProcess>;
}
