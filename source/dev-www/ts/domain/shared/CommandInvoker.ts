import {Observable} from "@reactivex/rxjs";
import {EmptyObservable} from "@reactivex/rxjs/dist/cjs/observable/EmptyObservable";
export class CommandInvoker {
    private history: Array<ICommand>;

    public execute(cmd: ICommand): Observable<any> {
        this.history.push(cmd);
        return cmd.execute();
    }
}

export interface ICommand<T> {
    readonly name: string;
    execute(): Observable<T>;
}
