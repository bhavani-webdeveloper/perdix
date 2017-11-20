import {Observable} from "@reactivex/rxjs";

interface IPolicy {
    run(): Observable<any>
}
