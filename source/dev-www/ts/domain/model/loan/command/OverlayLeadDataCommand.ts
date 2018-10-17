import LoanProcess = require("./LoanProcess");
import {Observable} from "@reactivex/rxjs";
import Lead = require("../lead/Lead");
import {ICommand} from "../../../shared/CommandInvoker";
/**
 * Created by shahalpk on 26/11/17.
 */

class OverlayLeadDataCommand implements ICommand<LoanProcess> {

    name: string = 'OverlayLeadData';

    leadData: Lead;
    private _loanProcess: LoanProcess;

    get loanProcess(): LoanProcess {
        return this._loanProcess;
    }

    set loanProcess(value: LoanProcess) {
        this._loanProcess = value;
    }

    constructor(loanProcess: LoanProcess){
        this._loanProcess = loanProcess;
    }

    execute(): Observable<LoanProcess> {
        return Observable.defer(function(){

        })
    }
}
