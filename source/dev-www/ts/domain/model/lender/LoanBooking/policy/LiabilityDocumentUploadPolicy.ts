///<amd-dependency path="moment" name="moment"/>

import {Observable} from "@reactivex/rxjs";
import * as _ from 'lodash';
import {IPolicy} from "../../../../shared/IPolicy";
import RepositoryFactory = require("../../../../shared/RepositoryFactory");
import {RepositoryIdentifiers} from "../../../../shared/RepositoryIdentifiers";
import LiabilityAccount = require("../LiabilityAccount");
import {LiabilityLoanAccountBookingProcess} from "../LiabilityLoanAccountBookingProcess";
import {EnrolmentProcess} from "../../../customer/EnrolmentProcess";
import LiabilityLenderDocuments = require("../LiabilityLenderDocuments");
import LiabilityComplianceDocuments = require("../LiabilityComplianceDocuments");

declare var moment: Function;
export class LiabilityDocumentUploadPolicy extends IPolicy<LiabilityLoanAccountBookingProcess> {
	constructor() {
		super();
	}

 	setArguments(args) {
    }

    run(liabilityLoanAccountBookingProcess: LiabilityLoanAccountBookingProcess): Observable<LiabilityLoanAccountBookingProcess> {

        if (liabilityLoanAccountBookingProcess.liabilityAccount && liabilityLoanAccountBookingProcess.liabilityAccount.liabilityLenderDocuments && liabilityLoanAccountBookingProcess.liabilityAccount.liabilityComplianceDocuments ) {
           // let activeSession:ISession = ObjectFactory.getInstance("Session");
            let i = new LiabilityLenderDocuments();
            let j = new LiabilityComplianceDocuments();
            i.uploadedDate = moment(new Date()).format('YYYY-MM-DD');
            j.uploadedDate = moment(new Date()).format('YYYY-MM-DD');
            liabilityLoanAccountBookingProcess.liabilityAccount.liabilityLenderDocuments.push(i);
            liabilityLoanAccountBookingProcess.liabilityAccount.liabilityComplianceDocuments.push(i);
        }
        return Observable.of(liabilityLoanAccountBookingProcess);
    }
}