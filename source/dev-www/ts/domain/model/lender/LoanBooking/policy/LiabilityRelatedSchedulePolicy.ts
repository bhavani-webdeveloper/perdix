import {Observable} from "@reactivex/rxjs";
import * as _ from 'lodash';
import {IPolicy} from "../../../../shared/IPolicy";
import RepositoryFactory = require("../../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../../shared/RepositoryIdentifiers";
import {LiabilityAccount} from "../LiabilityAccount";
import {LiabilityLoanAccountBookingProcess} from "../LiabilityLoanAccountBookingProcess";
import {EnrolmentProcess} from "../../../customer/EnrolmentProcess";

export class LiabilityRelatedSchedulePolicy extends IPolicy<LiabilityLoanAccountBookingProcess> {
	constructor() {
		super();
	}

 	setArguments(args) {
    }

	run(liabilityLoanAccountBookingProcess: LiabilityLoanAccountBookingProcess): Observable<LiabilityLoanAccountBookingProcess> {
		let observables = [];
		if(_.hasIn(liabilityLoanAccountBookingProcess, "liabilityAccount") && _.hasIn(liabilityLoanAccountBookingProcess.liabilityAccount, "lenderId")) {
			if(!_.isNull(liabilityLoanAccountBookingProcess.liabilityAccount.lenderId)) {
				let obs1 = EnrolmentProcess.fromCustomerID(liabilityLoanAccountBookingProcess.liabilityAccount.lenderId)
					.map(
						(lender:EnrolmentProcess) => {
							liabilityLoanAccountBookingProcess.setLender(lender);
							return lender;
						}
					); 
					observables.push(obs1);
			}
		}

		return Observable.merge(observables)
		.concatAll()
		.last()
		.map(
			(value) => {
				return liabilityLoanAccountBookingProcess;
			}
		);
	} 
}