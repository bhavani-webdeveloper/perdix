import java.time.*;
import java.util.Date;

			policyNo =null;
			firstPartSequenceNo=null;
			bankMaster = bankMasterRepository.findById(customer.getCustomerBankId().longValue());
			Date date = Date.from(insurancePolicyDetailsDTO.getPurchaseDate().atStartOfDay(ZoneId.systemDefault()).toInstant());
			master = pAISequenceMasterRepository.findById(bankMaster.getId());
			int days = (int)((date.getTime() - master.getResetDate().getTime()) / (1000 * 60 * 60 * 24));
			int value = 8-bankMaster.getPaiCoiCode().length();
			firstPartSequenceNo = stringLPad(master.getSequenceStartValue()+days+"", value, '0');
			policyNo = new Date().getYear()+1900+"/"+bankMaster.getPaiCoiCode()+firstPartSequenceNo+"/"+"FGP";



			String stringLPad(String input, int lengthOfString, String padChar) {
				String retVal = input;
				if(retVal==null)
				    retVal="";

				int numStringLength = retVal.length();
				if(numStringLength > lengthOfString){
				    retVal=retVal.substring(0, lengthOfString);
				}else{
				    for(int i=0;i<(lengthOfString - numStringLength);i++)
					retVal = padChar+retVal;
				}
				return retVal;
			    }













