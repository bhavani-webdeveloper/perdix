import java.time.*;

        loanAccount = loanAccountRepository.findById(loanId);
        loanProduct = loanProductRepository.findByProductCode(loanAccount.getProductCode());
        customer = customerRepository.findById(loanAccount.getCustomerId());
        customerPortFolioInsurancePremium = new BigDecimal(0);
        customerPortfolioInsuranceServiceCharge = null;
        customerPortfolioInsuranceServiceTax = null;
        spousePortFolioInsurancePremium = new BigDecimal(0);
        spousePortfolioInsuranceServiceCharge = null;
        spousePortfolioInsuranceServiceTax = null;
        portfolioInsurancePremium = new BigDecimal(0);
		expectedPortfolioInsurancePremium = null;
        portfolioInsuranceUrn = (loanAccount.getPortfolioInsuranceUrn() == null || loanAccount.getPortfolioInsuranceUrn() == "") ? customer.getUrnNo() : loanAccount.getPortfolioInsuranceUrn();
        customerData = customerRepository.findByUrnNoAndCustomerStatusAndKgfsBankName(portfolioInsuranceUrn,user.getBankName());
        
       loanAmount = loanAccountFromWeb.getLoanAmount() == null ? loanAccountFromWeb.getLoanAmountRequested() : loanAccountFromWeb.getLoanAmount();	
		if(loanAccountFromWeb.getTenure() == null)
			noOfInstallments =  loanAccountFromWeb.getTenureRequested();
		else
			noOfInstallments = Integer.parseInt(loanAccountFromWeb.getTenure());
		if(loanAccountFromWeb.getFrequency() == null)
			frequency =  loanAccountFromWeb.getFrequencyRequested();
		else
			frequency = loanAccountFromWeb.getFrequency().getDisplayName();
		insuranceRateCode = "DEFAULT";
        
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
        
        if(customerData != null){
            gender = customerData.getGender();
            birthdate = customerData.getDateOfBirth();
            ageOfCustomer = Period.between(birthdate, LocalDate.now()).getYears();
            portfolioInsuranceMaster = portfolioInsuranceMasterRepository.findByAgeAndGenderAndTenureInYearAndSumAssuredAndInsuranceTypeAndInsuranceRateCode(ageOfCustomer, gender, customerTenureInYear, 100000, insuranceType, insuranceRateCode);
            if(portfolioInsuranceMaster != null){
                customerPortFolioInsurancePremium = portfolioInsuranceMaster.getTotalPremium()*loanAmount/100000;
                if(portfolioInsuranceMaster.getServiceTax() != null)
                    customerPortfolioInsuranceServiceTax = portfolioInsuranceMaster.getServiceTax()*loanAmount/100000;
                else
                    customerPortfolioInsuranceServiceTax = new BigDecimal(0);

                if(portfolioInsuranceMaster.getInsuranceServiceCharge() != null){
                    customerPortfolioInsuranceServiceCharge = portfolioInsuranceMaster.getInsuranceServiceCharge()*loanAmount/100000;
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
                sportfolioInsuranceMaster = portfolioInsuranceMasterRepository.findByAgeAndGenderAndTenureInYearAndSumAssuredAndInsuranceTypeAndInsuranceRateCode(ageOfSpouseCustomer, spouseGender, customerTenureInYear, loanAmount, insuranceType, insuranceRateCode);
                if(sportfolioInsuranceMaster != null){
                    spousePortFolioInsurancePremium = sportfolioInsuranceMaster.getTotalPremium()*loanAmount/100000;
                    if(sportfolioInsuranceMaster.getServiceTax() != null)
                        spousePortfolioInsuranceServiceTax = portfolioInsuranceMaster.getServiceTax()*loanAmount/100000;;
                    else
                        spousePortfolioInsuranceServiceTax = new BigDecimal(0);
                    if(sportfolioInsuranceMaster.getInsuranceServiceCharge() != null){
                        spousePortfolioInsuranceServiceCharge = sportfolioInsuranceMaster.getInsuranceServiceCharge()*loanAmount/100000;
                    }else{
                         spousePortfolioInsuranceServiceCharge = new BigDecimal(0);
                    }
                }
            }
        }
expectedPortfolioInsurancePremium = customerPortFolioInsurancePremium.add(spousePortFolioInsurancePremium);
portfolioInsurancePremium = expectedPortfolioInsurancePremium;
