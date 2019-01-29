import java.time.*;
import java.util.Date;

			policyNo =null;
			certificateNo=null;
			firstPartSequenceNo=null;
			String secondPartSequenceNo =null;
			String insurer="Future Generali India";
			bankMaster = bankMasterRepository.findById(customer.getCustomerBankId().longValue());
			Date date = Date.from(insurancePolicyDetailsDTO.getPurchaseDate().atStartOfDay(ZoneId.systemDefault()).toInstant());
			master = pAISequenceMasterRepository.findById(bankMaster.getId());
			int days = (int)((date.getTime() - master.getResetDate().getTime()) / (1000 * 60 * 60 * 24));
			
insuranceSequenceList = insuranceSequenceDetailsRepository.findByBankIdAndDateAndInsurer(bankMaster.getId().intValue(),insurancePolicyDetailsDTO.getPurchaseDate(),"PAI-"+insurer);

            if(!insuranceSequenceList.isEmpty()){
                insuranceSequenceDetails = insuranceSequenceList.get(0);
                insuranceSequenceDetails.setCounter(insuranceSequenceList.get(0).getCounter()+1);
            }else{
                insuranceSequenceDetails = sequenceDetailsCreateObj;
                insuranceSequenceDetails.setBankId(bankMaster.getId().intValue());
                insuranceSequenceDetails.setDate(insurancePolicyDetailsDTO.getPurchaseDate());
                insuranceSequenceDetails.setInsuranceType("PAI");
                insuranceSequenceDetails.setInsurer("PAI-"+insurer);
                insuranceSequenceDetails.setCounter(1);
            }
			insuranceSequenceDetailsRepository.saveAndFlush(insuranceSequenceDetails);
			
			int value = 8-bankMaster.getPaiCoiCode().length();
			firstPartSequenceNo = stringLPad(master.getSequenceStartValue()+days+"", value, '0');
			secondPartSequenceNo = stringLPad(insuranceSequenceDetails.getCounter()+"", 5, '0');
			policyNo = new Date().getYear()+1900+"/"+bankMaster.getPaiCoiCode()+firstPartSequenceNo+"/"+"FGP";
			certificateNo = bankMaster.getPaiCoiCode()+firstPartSequenceNo+"/"+secondPartSequenceNo;



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













