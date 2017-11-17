import LoanRepository = require('./LoanRepository');
export enum LoanType
{
    LoanProcess
}

export class ILoanFactory {
 
    public static createLoanObject(type: LoanType)  {
        if (type === LoanType.LoanProcess) {
            return new LoanRepository();
        }

        return null;
    }
}