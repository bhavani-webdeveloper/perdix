
import {ILiabilityLoanBookingRepository} from "./ILiabilityLoanBookingRepository";
import {LiabilityLoanBookingProcess} from "./LiabilityLoanAccountBookingProcess";
import { RxObservable as Ro} from '../../shared/RxObservable';
import {Observable} from "@reactivex/rxjs";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {RxObservable} from "../../shared/RxObservable";
import {plainToClass} from "class-transformer";


export class LiabilityLoanAccountBookingRepository implements ILiabilityLoanAccountBookingRepository {

    liabilityLoanBookingService: any;

    constructor(){
        this.liabilityLoanAccountBookingService = AngularResourceService.getInstance().getNGService('LiabilityAccountProcess');
    }

    saveLiabilityLoanAccount(reqData: Object): Observable<any> {
        return Ro.fromPromise(this.liabilityLoanAccountBookingService.save(reqData).$promise);
    }

}
