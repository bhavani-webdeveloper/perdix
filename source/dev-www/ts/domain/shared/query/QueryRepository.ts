import {IQueryRepository} from "./IQueryRepository";
import {Observable} from "@reactivex/rxjs";
import AngularResourceService = require("../../../infra/api/AngularResourceService");
import {RxObservable} from "../RxObservable";

export class QueryRepository implements IQueryRepository{

    private queryService: any;

    constructor() {
        this.queryService = AngularResourceService.getInstance().getNGService('Queries');
    }

    getAllLoanPurpose1(): Observable<any> {
        return RxObservable.fromPromise(this.queryService.getAllLoanPurpose1());
    }

}
