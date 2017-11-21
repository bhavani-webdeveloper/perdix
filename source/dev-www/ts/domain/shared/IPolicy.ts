import {Observable} from "@reactivex/rxjs";

export abstract class IPolicy<T> {
    abstract run(obj: T): Observable<T>;
}
