import java.time.*

String[] strTenure = tenure.toString().split(" ");
int tenureVal = Integer.parseInt(strTenure[0]);
String tenureUnit = strTenure[1];
customer = customerRepository.findCustomer(customerId);
feeCharge = "0".toBigDecimal();
if(customer == null || customer.getDateOfBirth() == null) {
        feeCharge = "0".toBigDecimal();
} else if(amount <= new BigDecimal ("5000")) {
        feeCharge = "0".toBigDecimal();
}  else {
        LocalDate birthdate = customer.getDateOfBirth();
        long age = java.time.temporal.ChronoUnit.YEARS.between(birthdate, LocalDate.now());
        List<String> feeRate1 = new ArrayList<String>();
		feeRate1.add("1.2851");
		feeRate1.add("1.3276");
		feeRate1.add("1.3614");
		feeRate1.add("1.3884");
		feeRate1.add("1.4085");
		feeRate1.add("1.4231");
		feeRate1.add("1.4347");
		feeRate1.add("1.4445");
		feeRate1.add("1.4544");
		feeRate1.add("1.4655");
		feeRate1.add("1.4806");
		feeRate1.add("1.5006");
		feeRate1.add("1.5256");
		feeRate1.add("1.5567");
		feeRate1.add("1.8251");
		feeRate1.add("1.6464");
		feeRate1.add("1.7051");
		feeRate1.add("1.7747");
		feeRate1.add("1.8563");
		feeRate1.add("1.9515");
		feeRate1.add("2.0607");
		feeRate1.add("2.1868");
		feeRate1.add("2.3318");
		feeRate1.add("2.4996");
		feeRate1.add("2.6932");
		feeRate1.add("2.9178");
		feeRate1.add("3.1779");
		feeRate1.add("3.4776");
		feeRate1.add("3.8215");
		feeRate1.add("4.2106");
		feeRate1.add("4.6437");
		feeRate1.add("5.1194");
		feeRate1.add("5.6373");
		feeRate1.add("6.2638");
		feeRate1.add("6.9326");
		feeRate1.add("7.6401");
		feeRate1.add("8.3862");
		feeRate1.add("9.1713");
		feeRate1.add("10.0024");
		feeRate1.add("10.8866");
		feeRate1.add("11.8372");
		feeRate1.add("12.8686");
	List<String> feeRate2 = new ArrayList<String>();
		feeRate2.add("1.4631");
		feeRate2.add("1.51");
		feeRate2.add("1.5474");
		feeRate2.add("1.5768");
		feeRate2.add("1.5986");
		feeRate2.add("1.6147");
		feeRate2.add("1.6276");
		feeRate2.add("1.639");
		feeRate2.add("1.6507");
		feeRate2.add("1.6645");
		feeRate2.add("1.6833");
		feeRate2.add("1.7077");
		feeRate2.add("1.7381");
		feeRate2.add("1.7763");
		feeRate2.add("1.8251");
		feeRate2.add("1.885");
		feeRate2.add("1.9557");
		feeRate2.add("2.0392");
		feeRate2.add("2.1371");
		feeRate2.add("2.2509");
		feeRate2.add("2.3815");
		feeRate2.add("2.5321");
		feeRate2.add("2.7056");
		feeRate2.add("2.9063");
		feeRate2.add("3.1381");
		feeRate2.add("3.4068");
		feeRate2.add("3.7177");
		feeRate2.add("4.0756");
		feeRate2.add("4.4849");
		feeRate2.add("4.9459");
		feeRate2.add("5.4576");
		feeRate2.add("6.017");
		feeRate2.add("6.6424");
		feeRate2.add("7.3704");
		feeRate2.add("8.1449");
		feeRate2.add("8.9624");
		feeRate2.add("9.8229");
		feeRate2.add("10.7285");
		feeRate2.add("11.6871");
		feeRate2.add("12.7083");
		feeRate2.add("13.8076");
		feeRate2.add("15.0071");
	List<String> feeRate3 = new ArrayList<String>();
		feeRate3.add("2.0275");
		feeRate3.add("2.0919");
		feeRate3.add("2.1429");
		feeRate3.add("2.1826");
		feeRate3.add("2.212");
		feeRate3.add("2.2341");
		feeRate3.add("2.2524");
		feeRate3.add("2.2692");
		feeRate3.add("2.2874");
		feeRate3.add("2.3098");
		feeRate3.add("2.3397");
		feeRate3.add("2.378");
		feeRate3.add("2.4261");
		feeRate3.add("2.4866");
		feeRate3.add("2.5626");
		feeRate3.add("2.6549");
		feeRate3.add("2.7638");
		feeRate3.add("2.8921");
		feeRate3.add("3.0419");
		feeRate3.add("3.2155");
		feeRate3.add("3.415");
		feeRate3.add("3.6451");
		feeRate3.add("3.9103");
		feeRate3.add("4.2171");
		feeRate3.add("4.5717");
		feeRate3.add("4.9824");
		feeRate3.add("5.4567");
		feeRate3.add("6.0011");
		feeRate3.add("6.6203");
		feeRate3.add("7.3144");
		feeRate3.add("8.0802");
		feeRate3.add("8.9284");
		feeRate3.add("9.88");
		feeRate3.add("10.9594");
		feeRate3.add("12.1048");
		feeRate3.add("13.3121");
		feeRate3.add("14.583");
		feeRate3.add("15.9221");
		feeRate3.add("17.3422");
		feeRate3.add("18.8592");
		feeRate3.add("20.4962");
		feeRate3.add("22.5896");
	for(int i=0; i<=41; i++){
		if(age == i+18 ) {
			if((tenureUnit.equals("WEEK") && tenureVal <= 56) || (tenureUnit.equals("MONTH") && tenureVal <= 13) || (tenureUnit.equals("YEAR") && tenureVal <= 1) || (tenureUnit.equals("QUARTER") && tenureVal <= 4))
				feeCharge = ((amount * new BigDecimal (feeRate1.get(i)))/1000).setScale(2, BigDecimal.ROUND_HALF_UP);
			else if((tenureUnit.equals("WEEK") && tenureVal <= 108) || (tenureUnit.equals("MONTH") && tenureVal <= 25) || (tenureUnit.equals("YEAR") && tenureVal <= 2) || (tenureUnit.equals("QUARTER") && tenureVal <= 8))
				feeCharge = ((amount * new BigDecimal (feeRate2.get(i)))/1000).setScale(2, BigDecimal.ROUND_HALF_UP);
			else if((tenureUnit.equals("WEEK") && tenureVal <= 156) || (tenureUnit.equals("MONTH") && tenureVal <= 36) || (tenureUnit.equals("YEAR") && tenureVal <= 3) || (tenureUnit.equals("QUARTER") && tenureVal <= 12))
				feeCharge = ((amount * new BigDecimal (feeRate3.get(i)))/1000).setScale(2, BigDecimal.ROUND_HALF_UP);
		}
	}
}