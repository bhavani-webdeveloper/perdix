loanAccount = loanAccountRepository.findById(loanId);
loanProduct = loanProductRepository.findByProductCode(loanAccount.getProductCode());
feeMaster = feeMasterRepository.findByFeeCode(loanProduct.getProcessingFeeCode());
if(feeMaster != null){
    if(feeMaster.getFlatOrPercentage().equals("F")){
         processingfeeAmount = feeMaster.getFlatAmount()*100;
    }else{
        processingfeeAmount = loanAccount.getLoanAmount()*feeMaster.getPercentage();
   }
}