BigDecimal tax1 = BigDecimal.ZERO, tax2 = BigDecimal.ZERO, tax3 = BigDecimal.ZERO, tax4 = BigDecimal.ZERO;
String bankStateCode = "";
String branchStateCode = "";
bank = bankRepository.findBank();
branch = bankRepository.findBranch(branchCode);
if (bank.getAddress() != null)
    bankStateCode = bank.getAddress().getStateCode();
if (branch.getAddress() != null)
    branchStateCode = branch.getAddress().getStateCode();
customer = customerRepository.findCustomer(customerId);
if (customer != null) {
	if (customerStateCode == null)
		customerStateCode = ""; 
	if (customerStateCode.isEmpty() && customer.getContact() != null)
	    customerStateCode = customer.getContact().getStateCode();
	if (productCode.equalsIgnoreCase("TESTLOCALPRODUCT")) {
	    // Localized processing
		if (customerStateCode.equals(branchStateCode)) {
			tax2 = tax/2;
			tax3 = tax/2;
		} else {
			tax1 = tax;
		}
	} else {
	    // Centralized processing
		if (customerStateCode.equals(bankStateCode)) {
			tax2 = tax/2;
			tax3 = tax/2;
		} else {
			tax1 = tax;
		}
	}
} else {
	tax1 = tax;
}
taxAmount = new BigDecimal[4];
taxAmount[0] = tax1;
taxAmount[1] = tax2;
taxAmount[2] = tax3;
taxAmount[3] = tax4;
if (tax == (new BigDecimal("0.01"))) {
	taxAmount[0] = BigDecimal.ZERO;
	taxAmount[1] = BigDecimal.ZERO;
	taxAmount[2] = BigDecimal.ZERO;
	taxAmount[3] = BigDecimal.ZERO;
}

