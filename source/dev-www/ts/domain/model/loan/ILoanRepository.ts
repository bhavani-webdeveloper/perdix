import LoanProcess = require('./LoanProcess');

export interface ILoanRepository {

	getIndividualLoan(id: number): LoanProcess;
	searchIndividualLoan(): LoanProcess;
	createIndividualLoan(reqData: any): LoanProcess;
	updateIndividualLoan(reqData: any): LoanProcess;
	closeIndividualLoan(): LoanProcess;
	getLoanDefinition(): LoanProcess;
	loanDisburse(): LoanProcess;
	loanBatchDisburse(): LoanProcess;
	loanBatchDisburseConfirmation(): LoanProcess;
	loanMultiTrancheDisbursement(): LoanProcess;
	loanSearchHead(): LoanProcess;
	loanSearchDisbursement(): LoanProcess;
	loanSearchDisbursementHead(): LoanProcess;
	loanGetDisbursementList(): LoanProcess;
	loanGetDocuments(): LoanProcess;
	loanDownloadAllDocuments(): LoanProcess;
	loanDocumentsHead(): LoanProcess;
	loanUpdateDisbursement(): LoanProcess;
	loanLoadSingleLoanWithHistory(): LoanProcess;
	loanAddTranch(): LoanProcess;
	loanRemarksSummary(): LoanProcess;
	loanGetAllDocumentsUrl(loanId: number): LoanProcess;
	loanConfirmationUpload(file: any, progress: any): LoanProcess;


}