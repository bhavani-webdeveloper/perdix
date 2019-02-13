
if (bankRepository.findBranchSetBranch("Pudhuaaru", branchCode) != null || bankRepository.findBranchSetBranch("Thenaaru", branchCode) != null) {
   if (amount < 4000)
        feeCharge = "40".toBigDecimal();
   else if (amount < 8000)
        feeCharge = "80".toBigDecimal();
   else if (amount < 20000)
        feeCharge = (amount * new BigDecimal ("0.01")).setScale(2, BigDecimal.ROUND_HALF_UP);
   else
        feeCharge = "200".toBigDecimal();
} else if (bankRepository.findBranchSetBranch("Vellaaru", branchCode) != null) {
   if (amount < 2001)
        feeCharge = "20".toBigDecimal();
   else if (amount < 5001)
        feeCharge = "30".toBigDecimal();
   else
        feeCharge = (amount * new BigDecimal ("0.01")).setScale(2, BigDecimal.ROUND_HALF_UP);
}
else {
   if (amount < 4000)
        feeCharge = "40".toBigDecimal();
   else if (amount < 8000)
        feeCharge = "80".toBigDecimal();
   else
	feeCharge = (amount * new BigDecimal ("0.01")).setScale(2, BigDecimal.ROUND_HALF_UP);
}
if(amount > new BigDecimal ("5000")) {
	feeCharge = feeCharge + new BigDecimal ("20");
}
