import LoanProcess = require('./LoanProcess');
import {Observable} from "@reactivex/rxjs";

export interface ILoanRepository {


	getIndividualLoan(id: number): Observable<any>;

	searchIndividualLoan(): Observable<any>;
	createIndividualLoan(reqData: any): Observable<any>;
	updateIndividualLoan(reqData: any): Observable<any>;
	closeIndividualLoan(): Observable<any>;
	getLoanDefinition(): Observable<any>;
	loanDisburse(): Observable<any>;
	loanBatchDisburse(): Observable<any>;
	loanBatchDisburseConfirmation(): Observable<any>;
	loanMultiTrancheDisbursement(): Observable<any>;
	loanSearchHead(): Observable<any>;
	loanSearchDisbursement(): Observable<any>;
	loanSearchDisbursementHead(): Observable<any>;
	loanGetDisbursementList(): Observable<any>;
	loanGetDocuments(): Observable<any>;
	loanDownloadAllDocuments(): Observable<any>;
	loanDocumentsHead(): Observable<any>;
	loanUpdateDisbursement(): Observable<any>;
	loanLoadSingleLoanWithHistory(): Observable<any>;
	loanAddTranch(): Observable<any>;
	loanRemarksSummary(): Observable<any>;
	loanGetAllDocumentsUrl(loanId: number): Observable<any>;
	loanConfirmationUpload(file: any, progress: any): Observable<any>;


}
