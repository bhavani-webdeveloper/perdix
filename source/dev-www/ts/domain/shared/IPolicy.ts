import {Observable} from "@reactivex/rxjs";

export abstract class IPolicy<T> {

    abstract setArguments(args);
    abstract run(obj: T): Observable<T>;
}

export interface CanApplyPolicy {

}

export interface PolicyDefinition {
    name: string;
    arguments: Object;
}
