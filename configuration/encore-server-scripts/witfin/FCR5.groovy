import java.time.*

String[] strTenure = tenure.toString().split(" ");
int tenureVal = Integer.parseInt(strTenure[0]);
String tenureUnit = strTenure[1];
holders = accountRepository.findAccountHoldersByCustomerId(customerId);
accountProfile = accountRepository.findAccountProfile(holders.get(0).getAccountId());
LocalDate openDate = accountProfile.getOpenedOnValueDate();
LocalDate currentDate = bankRepository.findBank().getCurrentWorkingDate();
Period p = Period.between(openDate, currentDate);
int periodInMonths = p.getMonths();
int periodInYears = p.getYears();
if (periodInYears == 0 && periodInMonths <= 12) {
	feeCharge = ((amount * new BigDecimal (4))/100).setScale(2, BigDecimal.ROUND_HALF_UP);
} else {
	feeCharge = ((amount * new BigDecimal (3))/100).setScale(2, BigDecimal.ROUND_HALF_UP);
}