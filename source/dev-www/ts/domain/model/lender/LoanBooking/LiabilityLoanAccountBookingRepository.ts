import {ILiabilityLoanAccountBookingRepository} from "./ILiabilityLoanAccountBookingRepository";
import {LiabilityLoanAccountBookingProcess} from "./LiabilityLoanAccountBookingProcess";
import { RxObservable as Ro} from '../../../shared/RxObservable';
import {Observable} from "@reactivex/rxjs";
import AngularResourceService = require("../../../../infra/api/AngularResourceService");
import {plainToClass} from "class-transformer";


export class LiabilityLoanAccountBookingRepository implements ILiabilityLoanAccountBookingRepository {

    liabilityLoanAccountBookingService: any;

    constructor(){
        this.liabilityLoanAccountBookingService = AngularResourceService.getInstance().getNGService('LiabilityAccountProcess');
    }

    getLenderLoan(id: number):Observable<any> {
		let observable = Ro.fromPromise(this.liabilityLoanAccountBookingService.get({id: id}).$promise);
		return observable;
	}

    saveLiabilityLoanAccount(reqData: Object): Observable<any> {
    	//delete reqData['LiabilityLoanAccountBookingProcessRepo'];
		return Ro.fromPromise(this.liabilityLoanAccountBookingService.save(reqData).$promise);
    }

    proceedLiabilityLoanAccount(reqData: Object): Observable<any> {
        return Ro.fromPromise(this.liabilityLoanAccountBookingService.proceed(reqData).$promise);
    }

}
