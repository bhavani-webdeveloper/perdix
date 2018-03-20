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

    saveLiabilityLoanAccount(reqData: Object): Observable<any> {
    	console.log("LiabilityLoanAccountBookingRepository");
    	delete reqData['LiabilityLoanAccountBookingProcessRepo'];
    	console.log(reqData);
		return Ro.fromPromise(this.liabilityLoanAccountBookingService.save(reqData).$promise);
    }

}
