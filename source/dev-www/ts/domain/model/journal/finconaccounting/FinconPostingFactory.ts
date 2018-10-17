import {Observable} from "@reactivex/rxjs";
import JournalHeader = require("./JournalHeader");
import JournalDetail = require("./JournalDetail");
import {IFinconRepository} from "./IFinconRepository";
import RepositoryFactory = require('../../../shared/RepositoryFactory');
import { RepositoryIdentifiers } from '../../../shared/RepositoryIdentifiers';
import {plainToClass} from "class-transformer";
import { FinconPostingProcess } from './FinconPostingProcess';
import {Utils} from "../../../shared/Utils";


export class FinconPostingFactory {

    static createNew() : Observable<FinconPostingProcess>{
        let finconPostingProcess: FinconPostingProcess = new FinconPostingProcess();
        finconPostingProcess.journalHeader = new JournalHeader();
        let journalDetail = new JournalDetail();
        finconPostingProcess.journalHeader.journalDetails = [];
        finconPostingProcess.journalHeader.journalDetails.push(journalDetail);
        return Observable.of(finconPostingProcess);
    }

    static createFromJournal(id: number): Observable<FinconPostingProcess> {
    	let finconRepo: IFinconRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.FinconPostingProcess);
    	return finconRepo.getJournal(id)
            .map(
                (value: Object) => {
                	let obj:Object = Utils.toJSObj(value);
                    //noinspection TypeScriptValidateTypes
                    let journalHeader:JournalHeader = <JournalHeader>plainToClass<JournalHeader, Object>(JournalHeader, obj);
                    let finconPostingProcess = new FinconPostingProcess();
                    finconPostingProcess.journalHeader = journalHeader;
                    return finconPostingProcess;
                }
            );
    }
}
