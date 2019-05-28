import java.time.*;
import java.math.*;

        loanAccount = loanAccountRepository.findById(loanId);
        loanProduct = loanProductRepository.findByProductCode(loanAccount.getProductCode());
        customer = customerRepository.findById(loanAccount.getCustomerId());
        customerPortFolioInsurancePremium = null;
        customerPortfolioInsuranceServiceCharge = null;
        customerPortfolioInsuranceServiceTax = null;
        spousePortFolioInsurancePremium = null;
        spousePortfolioInsuranceServiceCharge = null;
        spousePortfolioInsuranceServiceTax = null;
	portfolioInsurancePremium = null;
        portfolioInsuranceUrn = (loanAccount.getPortfolioInsuranceUrn() == null || loanAccount.getPortfolioInsuranceUrn() == "") ? customer.getUrnNo() : loanAccount.getPortfolioInsuranceUrn();
        customerData = customerRepository.findByUrnNoAndCustomerStatusAndKgfsBankName(portfolioInsuranceUrn,user.getBankName());
        
        loanAmount = loanAccount.getLoanAmount();    
        insuranceRateCode = "DEFAULT";        
        if(loanProduct !=null && loanProduct.getInsuranceRateCode() !=null){
            insuranceRateCode = loanProduct.getInsuranceRateCode();
        }
        frequency = loanProduct.getFrequency().getDisplayName();
        noOfInstallments = Integer.parseInt(loanAccount.getTenure());
        
        factor=0;
        if(frequency.equals("daily")){
            factor=applicationProperties.getFactor().getDailyFactor();
        }else if(frequency.equals("Weekly") || frequency.equals("EWI") ||
                frequency.equals("Weeks") || frequency.equals("Week") || frequency.equals("W")){
            factor=applicationProperties.getFactor().getWeeklyFactor();
        }else if(frequency.equals("Fortnightly") || frequency.equals("Fortnight") || frequency.equals("F") ){
            factor=applicationProperties.getFactor().getFortnightlyFactor();
        }else if(frequency.equals("Monthly") || frequency.equals("EMI")
                || frequency.equals("Months") || frequency.equals("Month") || frequency.equals("M")){
            factor=applicationProperties.getFactor().getMonthlyFactor();
        }else if(frequency.equals("quarterly")){
            factor=applicationProperties.getFactor().getQuarterlyFactor();
        }else if(frequency.equals("halfyearly") || frequency.equals("H")){
            factor=applicationProperties.getFactor().getHalfyearlyFactor();
        }else if(frequency.equals("annual") || frequency.equals("Year") || frequency.equals("Years") || frequency.equals("Y") || frequency.equals("Yearly")){
            factor=applicationProperties.getFactor().getAnnualFactor();
        }else if(frequency.equals("bullet")){
            factor=applicationProperties.getFactor().getBulletFactor();
        }
        
        double customerTenureInYear = (int)(noOfInstallments/factor);
        if (noOfInstallments%factor != 0) {
            customerTenureInYear++;
        }
        if(customerTenureInYear < 2){
            customerTenureInYear  = 2;
        }
    
        int cutOffInstallment = 0;
        if(frequency.equals("daily")){
            cutOffInstallment=applicationProperties.getCutOffInstallment().getDailyCutOffInstallmentNumber();
        }else if(frequency.equals("Weekly") || frequency.equals("EWI") ||
                frequency.equals("Weeks") || frequency.equals("Week") || frequency.equals("W")){
            cutOffInstallment = applicationProperties.getCutOffInstallment().getWeelkyCutOffInstallmentNumber();
        }else if(frequency.equals("Fortnightly") || frequency.equals("Fortnight") || frequency.equals("F") ){
            cutOffInstallment = applicationProperties.getCutOffInstallment().getFornightlyCutOffInstallmanrNumber();
        }else if(frequency.equals("monthly") || frequency.equals("EMI")
                || frequency.equals("Months") || frequency.equals("Month") || frequency.equals("M")){
            cutOffInstallment = applicationProperties.getCutOffInstallment().getMonthlyCutOffInstallmentNumber();
        }else if(frequency.equals("quarterly")){
            cutOffInstallment = applicationProperties.getCutOffInstallment().getQuarterlyCutoffInstallmentNumber();
        }else if(frequency.equals("halfyearly") || frequency.equals("H")){
            cutOffInstallment = applicationProperties.getCutOffInstallment().getHalfYearlyCutOffInstallmentNumber();
        }else if(frequency.equals("annual") || frequency.equals("Year") ||            frequency.equals("Years") || frequency.equals("Y")){
            cutOffInstallment = applicationProperties.getCutOffInstallment().getYearlyCutOffInstallmentNumber();
        }        
        
   
		insuranceType = "Individual";
        if(customerData != null && loanAmount>1000){
            gender = customerData.getGender();
            birthdate = customerData.getDateOfBirth();
            ageOfCustomer = Period.between(birthdate, LocalDate.now()).getYears();
            portfolioInsuranceMaster = portfolioInsuranceMasterRepository.findByAgeAndGenderAndTenureInYearAndInsuranceRateCode(ageOfCustomer, null, customerTenureInYear,insuranceRateCode);
            if(portfolioInsuranceMaster != null){
                customerPortFolioInsurancePremium =  portfolioInsuranceMaster.getPremium().multiply(loanAmount).divide(new BigDecimal(1000), 2, RoundingMode.CEILING);
		customerPortFolioInsurancePremium  =  customerPortFolioInsurancePremium.add(customerPortFolioInsurancePremium.multiply(new BigDecimal(0.18)));
                if(portfolioInsuranceMaster.getServiceTax() != null)
                    customerPortfolioInsuranceServiceTax = portfolioInsuranceMaster.getServiceTax();
                else
                    customerPortfolioInsuranceServiceTax = new BigDecimal(0);

                if(portfolioInsuranceMaster.getInsuranceServiceCharge() != null){
                    customerPortfolioInsuranceServiceCharge = portfolioInsuranceMaster.getInsuranceServiceCharge();
                }else{
                     customerPortfolioInsuranceServiceCharge = new BigDecimal(0);
                }
            }
        }        
        if(loanProduct.getSpouseInsuranceRequired().equals("YES")){
            if(customerData != null){
                spouseGender = null;
                ageOfSpouseCustomer = null
                if (loanAccount.getWitnessFirstName() != null) {
                    familyMembers = familyRepository.findByCustomerId (customer.getParentCustomerId().equals(0L) ? customer.getId(): customer.getParentCustomerId());
                    if(familyMembers != null) {
                        for (int i = 0; i < familyMembers.size(); i++) {
                            if (loanAccount.getWitnessFirstName() != null &&  loanAccount.getWitnessFirstName().equals(familyMembers[i].getFamilyMemberFirstName())) {
            
                                spouseGender = familyMembers[i].getGender();
                                dateOfBirth = familyMembers[i].getDateOfBirth();
                                ageOfSpouseCustomer = Period.between(dateOfBirth, LocalDate.now()).getYears();
                                break;
                            }
                        }
                    }

                }
                sportfolioInsuranceMaster = portfolioInsuranceMasterRepository.findByAgeAndGenderAndTenureInYearAndInsuranceRateCode(ageOfSpouseCustomer, spouseGender, customerTenureInYear, insuranceRateCode);
                if(sportfolioInsuranceMaster != null){
                    spousePortFolioInsurancePremium =portfolioInsuranceMaster.getPremium().multiply(loanAmount).divide(new BigDecimal(1000), 2, RoundingMode.CEILING);
			spousePortFolioInsurancePremium =  spousePortFolioInsurancePremium.add(spousePortFolioInsurancePremium.multiply(new BigDecimal(0.18)));
                    if(sportfolioInsuranceMaster.getServiceTax() != null)
                        spousePortfolioInsuranceServiceTax = portfolioInsuranceMaster.getServiceTax();
                    else
                        spousePortfolioInsuranceServiceTax = new BigDecimal(0);
                    if(sportfolioInsuranceMaster.getInsuranceServiceCharge() != null){
                        spousePortfolioInsuranceServiceCharge = sportfolioInsuranceMaster.getInsuranceServiceCharge();
                    }else{
                         spousePortfolioInsuranceServiceCharge = new BigDecimal(0);
                    }
                }
            }
        }
