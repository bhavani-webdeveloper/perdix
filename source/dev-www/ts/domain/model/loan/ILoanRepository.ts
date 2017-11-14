import LoanProcess = require('./LoanProcess');

export interface ILoanRepository{

	getLoanProcess(id: number): LoanProcess;


}