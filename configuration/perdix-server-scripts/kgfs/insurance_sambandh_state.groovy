
import java.time.*;



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
portfolioInsuranceUrn = null;
insuranceType = "Individual";

portfolioInsuranceUrn = (loanAccount.getPortfolioInsuranceUrn() == null || loanAccount.getPortfolioInsuranceUrn() == "") ? customer.getUrnNo() : loanAccount.getPortfolioInsuranceUrn();
customerData = customerRepository.findByUrnNoAndCustomerStatusAndKgfsBankName(portfolioInsuranceUrn,user.getBankName());
amount = loanAccount.getLoanAmount();

Map<String ,BigDecimal> stateMap = new HashMap<String,BigDecimal>();
stateMap.put("ODISHA", 0.269);
stateMap.put("CHATTISGARH", 0.269);
stateMap.put("JHARKHAND", 0.275);

branchMaster = branchMasterRepository.findById(loanAccount.getBranchId());
stateMaster = stateMasterRepository.findById(new Long(branchMaster.getStateId()));

if(customerData != null && customerData.getDateOfBirth() != null){
	birthdate = customer.getDateOfBirth();
	ageOfCustomer = Period.between(birthdate, LocalDate.now()).getYears();
	if( ageOfCustomer >= 18 && ageOfCustomer <= 59 ){
		insuranceAmount = amount*stateMap.get(stateMaster.getStateName())/100;
		customerPortfolioInsuranceServiceTax = insuranceAmount*18/100;
		customerPortFolioInsurancePremium = insuranceAmount + customerPortfolioInsuranceServiceTax;
	}
}

if(loanProduct.getSpouseInsuranceRequired().equals("YES")){
	if(customerData != null){
		ageOfSpouseCustomer = null
		if (loanAccount.getWitnessFirstName() != null) {
			familyMembers = familyRepository.findByCustomerId (customer.getParentCustomerId().equals(0L) ? customer.getId(): customer.getParentCustomerId());
			if(familyMembers != null) {
				for (int i = 0; i < familyMembers.size(); i++) {
					if (loanAccount.getWitnessFirstName() != null  &&  loanAccount.getWitnessFirstName().equals(familyMembers[i].getFamilyMemberFirstName())) {
						dateOfBirth = familyMembers[i].getDateOfBirth();
						ageOfSpouseCustomer = Period.between(dateOfBirth, LocalDate.now()).getYears();
						break;
					}
				}
			}
		}

		if(ageOfSpouseCustomer >= 18 && ageOfSpouseCustomer <= 59 ){
			spouseInsuranceAmount = amount*stateMap.get(stateMaster.getStateName())/100;
			spousePortfolioInsuranceServiceTax = spouseInsuranceAmount*18/100;
			spousePortFolioInsurancePremium = spouseInsuranceAmount + spousePortfolioInsuranceServiceTax;
		}
	}
}
if(spousePortFolioInsurancePremium != null && customerPortFolioInsurancePremium != null){
	portfolioInsurancePremium =   new BigDecimal(Math.round(spousePortFolioInsurancePremium + customerPortFolioInsurancePremium));
}else if (spousePortFolioInsurancePremium != null){
	portfolioInsurancePremium =   new BigDecimal(Math.round(spousePortFolioInsurancePremium));
}else if (customerPortFolioInsurancePremium != null){
	portfolioInsurancePremium =   new BigDecimal(Math.round(customerPortFolioInsurancePremium));
}