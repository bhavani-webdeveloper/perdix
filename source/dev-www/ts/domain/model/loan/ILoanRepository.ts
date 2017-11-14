import LoanProcess = require('./LoanProcess');

export interface ILoanRepository{

	getLoanProcess(): LoanProcess;


}