certificateNo=null;
policyNo=null;
Integer trxId = kgfsSequenceRepository.kgfsSequenceNumber("TLI-IndiaFirst-ProposalNo");
certificateNo=String.format("%08d", trxId);
