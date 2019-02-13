feeCharge = (amount * new BigDecimal ("0.02")).setScale(2, BigDecimal.ROUND_HALF_UP);
if(amount > new BigDecimal ("5000")) {
	feeCharge = feeCharge + new BigDecimal ("20");
}
