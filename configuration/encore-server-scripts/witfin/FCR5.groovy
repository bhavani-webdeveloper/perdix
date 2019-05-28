import java.time.*

String[] strTenure = tenure.toString().split(" ");
int tenureVal = Integer.parseInt(strTenure[0]);
String tenureUnit = strTenure[1];
LocalDate currentDate = bankRepository.findBank().getCurrentWorkingDate();
Period p = Period.between(currentDate, LocalDate.now());
int periodInMonths = p.getMonths();
int periodInYears = p.getYears();
if (periodInYears == 0 && periodInMonths <= 12) {
	feeCharge = ((amount * new BigDecimal (4))/1000).setScale(2, BigDecimal.ROUND_HALF_UP);
} else {
	feeCharge = ((amount * new BigDecimal (3))/1000).setScale(2, BigDecimal.ROUND_HALF_UP);
}