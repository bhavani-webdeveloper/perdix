import {ILiabilityRepaymentRepository} from "./ILiabilityRepaymentRepository";
import { RxObservable as Ro} from '../../../shared/RxObservable';
import {Observable} from "@reactivex/rxjs";
import AngularResourceService = require("../../../../infra/api/AngularResourceService");
import {plainToClass} from "class-transformer";


export class LiabilityRepaymentRepository implements ILiabilityRepaymentRepository {

    liabilityRepaymentService: any;

    constructor(){
        this.liabilityRepaymentService = AngularResourceService.getInstance().getNGService('LiabilityAccountProcess');
    }

    repay(reqData: Object): Observable<any> {
    	//delete reqData['LiabilityLoanAccountBookingProcessRepo'];
		return Ro.fromPromise(this.liabilityRepaymentService.liabilityRepay(reqData.liabilityRepay).$promise);
    }
}