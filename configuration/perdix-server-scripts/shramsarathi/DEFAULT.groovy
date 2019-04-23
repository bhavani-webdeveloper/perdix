	import java.time.*;
	import java.math.BigDecimal.RoundingMode.*;
	customerPortFolioInsurancePremium = null;
	customerPortfolioInsuranceServiceCharge = null;
	customerPortfolioInsuranceServiceTax = null;
	outstandingBalanceAfterFirstyear = null;
	outstandingBalanceAfterSecondyear = null;
	outstandingBalanceAfterThirdyear = null;
	outstandingBalanceAfterFourthyear = null;
	customerPortFolioInsurancePremium = null;
    customerPortfolioInsuranceServiceCharge = null;
    customerPortfolioInsuranceServiceTax = null;
    spousePortFolioInsurancePremium = null;
    spousePortfolioInsuranceServiceCharge = null;
    spousePortfolioInsuranceServiceTax = null;
    portfolioInsurancePremium=null;
	expectedPortfolioInsurancePremium = null;
	premiumPerThousandIncludingTax = 9.361;
    
	noOfInstallments = Integer.parseInt(loanAccountFromDB.getTenure());
	noOfInstallmentsWithGracePeriod  = noOfInstallments+1;
    insuranceType = "Individual";


	portfolioInsuranceUrn = (loanAccountFromDB.getPortfolioInsuranceUrn() == null || loanAccountFromDB.getPortfolioInsuranceUrn() == "") ? customer.getUrnNo() : loanAccountFromDB.getPortfolioInsuranceUrn();
	customerData = customerRepository.findByUrnNoAndCustomerStatusAndKgfsBankName(portfolioInsuranceUrn,user.getBankName());
    loanAmount = loanAccountFromDB.getLoanAmount(); 
	
	def noofInstallmentsAndRiskPeriodMap = [6:12,7:12,8:12,9:12,10:12,11:12,12:12,13:18,14:18,15:18,16:18,17:18,18:18,19:24,20:24,21:24,22:24,23:24,24:24,25:30,26:30,27:30,28:30,29:30,30:30,31:36,32:36,33:36,34:36,35:36,36:36,37:42,38:42,39:42,40:42,41:42,42:42];
	             
	 if(customerData != null){
	    
			 if(noOfInstallmentsWithGracePeriod < 13){
				outstandingBalanceAfterFirstyear = new BigDecimal(0);
			}else{
				outstandingBalanceAfterFirstyear = (loanAmount/noOfInstallments)*(noOfInstallmentsWithGracePeriod - 12);
			}


			if(noOfInstallmentsWithGracePeriod < 25 ){	

				outstandingBalanceAfterSecondyear = new BigDecimal(0);
			}else{
				outstandingBalanceAfterSecondyear = (loanAmount/noOfInstallments)*(noOfInstallmentsWithGracePeriod - 24);
			}

			if(noOfInstallmentsWithGracePeriod < 37 )	{ 
				outstandingBalanceAfterThirdyear = new BigDecimal(0);
			}else{
				outstandingBalanceAfterThirdyear = (loanAmount/noOfInstallments)*(noOfInstallmentsWithGracePeriod - 36);
			}


			if(noOfInstallmentsWithGracePeriod < 49 ){		
				outstandingBalanceAfterFourthyear = new BigDecimal(0);

			}else{
				outstandingBalanceAfterFourthyear = (loanAmount/noOfInstallments)*(noOfInstallmentsWithGracePeriod - 48);
			}
				



	firstYearPremium = (loanAmount/1000)*premiumPerThousandIncludingTax;

	if(outstandingBalanceAfterFirstyear != null && outstandingBalanceAfterFirstyear >0 ){
		if(noofInstallmentsAndRiskPeriodMap[noOfInstallmentsWithGracePeriod] <= 18 ){
			secondYearPremium = ((outstandingBalanceAfterFirstyear/1000) * premiumPerThousandIncludingTax)/2; 	
		}else{
			secondYearPremium = (outstandingBalanceAfterFirstyear/1000)*premiumPerThousandIncludingTax; 	
		}	
	}else{
		secondYearPremium = new BigDecimal(0);
	}


	if(outstandingBalanceAfterSecondyear != null && outstandingBalanceAfterSecondyear >0 ){
		if(noofInstallmentsAndRiskPeriodMap[noOfInstallmentsWithGracePeriod] <= 30){
			thirdYearPremium = ((outstandingBalanceAfterSecondyear/1000) * premiumPerThousandIncludingTax)/2; 	
		}else{
			thirdYearPremium = (outstandingBalanceAfterSecondyear/1000)*premiumPerThousandIncludingTax; 	
		}
	}else{
		thirdYearPremium = new BigDecimal(0);
	}

	if(outstandingBalanceAfterThirdyear != null && outstandingBalanceAfterThirdyear >0 ){
		if(noofInstallmentsAndRiskPeriodMap[noOfInstallmentsWithGracePeriod] <= 42){
			forthYearPremium = ((outstandingBalanceAfterThirdyear/1000)*premiumPerThousandIncludingTax)/2; 
		}else{
			forthYearPremium = (outstandingBalanceAfterThirdyear/1000)*premiumPerThousandIncludingTax;
		}
	}else{
		forthYearPremium = new BigDecimal(0);
	}

	if(outstandingBalanceAfterFourthyear != null && outstandingBalanceAfterFourthyear >0 ){
		if(noofInstallmentsAndRiskPeriodMap[noOfInstallmentsWithGracePeriod] <= 54){
			fifthYearPremium = (outstandingBalanceAfterFourthyear/1000)*premiumPerThousandIncludingTax;
		}else {
			fifthYearPremium = ((outstandingBalanceAfterThirdyear/1000)*premiumPerThousandIncludingTax)/2; 	
		}
	}else{
		fifthYearPremium = new BigDecimal(0);
	}
	   
	totalPremium = firstYearPremium + secondYearPremium + thirdYearPremium +forthYearPremium+fifthYearPremium;
    customerPortFolioInsurancePremium = new BigDecimal(Math.ceil(totalPremium));
	expectedPortfolioInsurancePremium = customerPortFolioInsurancePremium;
 }       
	          
	          



