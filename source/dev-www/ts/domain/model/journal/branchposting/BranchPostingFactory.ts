import {Observable} from "@reactivex/rxjs";
import BranchEntry = require("./BranchEntry");
import {IBranchRepository} from "./IBranchRepository";
import RepositoryFactory = require('../../../shared/RepositoryFactory');
import { RepositoryIdentifiers } from '../../../shared/RepositoryIdentifiers';
import {plainToClass} from "class-transformer";
import { BranchPostingProcess } from './BranchPostingProcess';
import {Utils} from "../../../shared/Utils";

/**
 * Created by shahalpk on 21/11/17.
 */


export class BranchPostingFactory {

    static createNew() : Observable<BranchPostingProcess>{
        let branchPostingProcess: BranchPostingProcess = new BranchPostingProcess();
        branchPostingProcess.journal = new BranchEntry();

        return Observable.of(branchPostingProcess);
    }

    static createFromJournal(id: number): Observable<BranchPostingProcess> {
    	let branchRepo: IBranchRepository = RepositoryFactory.createRepositoryObject(RepositoryIdentifiers.BranchPostingProcess);
    	return branchRepo.getJournal(id)
            .map(
                (value: Object) => {
                	let obj:Object = Utils.toJSObj(value);
                    //noinspection TypeScriptValidateTypes
                    let branchEntry:BranchEntry = <BranchEntry>plainToClass<BranchEntry, Object>(BranchEntry, obj);
                    let branchPostingProcess = new BranchPostingProcess();
                    branchPostingProcess.journal = branchEntry;
                    return branchPostingProcess;
                }
            );
    }
}
