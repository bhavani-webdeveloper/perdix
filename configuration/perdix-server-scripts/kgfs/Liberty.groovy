policyNo=null;
Integer trxId = kgfsSequenceRepository.kgfsSequenceNumber("Liberty");
policyNo=String.format("%08d", trxId);
