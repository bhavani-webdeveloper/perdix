let config = {
    'policies': {
        'default' : {
            onNew: {
                "defaults": [
                    {
                        "name": "DefaultRelatedCustomersPolicy",
                        "arguments": {
                            "applicant": true,
                            "coApplicant": false,
                            "guarantor": false,
                            "loanCustomer": true,
                            "loanCustomerType": "Enterprise"
                        }
                    },
                    {
                        "name": "DefaultVehicleDocumentsPolicy",
                        "arguments": {}
                    }
                ]
            },
            onLoad: {
                "defaults": [
                    {
                        "name": "LoadRelatedCustomersPolicy",
                        "arguments": {}
                    },
                    {
                        "name": "CustomerReferencePolicy",
                        "arguments": {}
                    },
                    {
                        "name": "DefaultVehicleDocumentsPolicy",
                        "arguments": {}
                    },
                    {
                        "name": "LoanVirtualFieldsPolicy",
                        "arguments": {}
                    }
                ],
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='ScreeningReview' ||  this.loanAccount.currentStage=='FieldInvestigation1' || this.loanAccount.currentStage=='FieldInvestigation2' || this.loanAccount.currentStage=='FieldInvestigation3' || this.loanAccount.currentStage=='TeleVerification' || this.loanAccount.currentStage=='BusinessApproval1'|| this.loanAccount.currentStage=='BusinessApproval2'||  this.loanAccount.currentStage=='CreditApproval1' || this.loanAccount.currentStage=='CreditApproval2'",                        "add": [
                            {
                                "name": "CalculateVehicleViabilityPolicy",
                                "arguments": {
                                }
                            }
                        ]
                    },
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='VehicleValuation'",
                        "add": [
                            {
                                "name": "DefaultVehicleComponentsPolicy",
                                "arguments": {}
                            },
                            {
                                "name":"DefaultVehicleAccessoriesPolicy",
                                "arguments": {}
                            },

                        ]
                    },
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='FieldInvestigation1' || this.loanAccount.currentStage=='FieldInvestigation2' || this.loanAccount.currentStage=='FieldInvestigation3'",
                        "add": [
                            {
                                "name": "DefaultIndividualReferencePolicy",
                                "arguments": {}
                            }

                        ]
                    }
                ]
            },
            beforeSave: {
                "defaults": [
                    {
                        "name":"MandatoryFieldsPolicy",
                        "arguments": null
                    },
                    {
                        "name":"LoanDerivedFieldsUpdate",
                        "arguments": null
                    }
                ],
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='BusinessApproval1' || this.loanAccount.currentStage=='CreditApproval3' || this.loanAccount.currentStage=='BusinessApproval2'",
                        "add": [{
                            "name": "CollateralFieldPolicy",
                            "arguments": {
                                "postStage": "LoanInitiation"
                            }
                        }]
                    }
                ]
            },
            afterSave: {
                "defaults": [
                    {
                        "name": "DefaultCalculatedVehicleDetailsPolicy",
                        "arguments": {}
                    },
                    {
                        "name": "DefaultVehicleDocumentsPolicy",
                        "arguments": {}
                    },
                    {
                        "name": "LoanVirtualFieldsPolicy",
                        "arguments": {}
                    }
                ],
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='Screening'",
                        "add": [
                            {
                                "name": "CloseLeadonLoanSave",
                                "arguments": {
                                    "stage":"Completed",
                                    "fromStage":"ReadyForScreening"
                                }
                            }
                        ]
                    },
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='FieldInvestigation1' || this.loanAccount.currentStage=='FieldInvestigation2' || this.loanAccount.currentStage=='FieldInvestigation3'",
                        "add": [
                            {
                                "name": "DefaultIndividualReferencePolicy",
                                "arguments": {}
                            }

                        ]
                    }
                ]
            },
            beforeProceed: {
                "defaults": [
                    {
                        "name":"LoanDerivedFieldsUpdation",
                        "arguments": null
                    }, {
                        "name": "CustomerEnrolmentCompletedPolicy",
                        "arguments": {}
                    }
                ],
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='CreditApproval5'",
                        "add": [
                            {
                                "name": "OriginationToBookingPolicy",
                                "arguments": {
                                    "postStage":"LoanInitiation"
                                }
                            }
                        ]
                    },
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='TeleVerification'",
                        "add": [
                            {
                                "name": "VehicleValuationDone",
                                "arguments": {
                                }
                            }
                        ]
                    },
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='BusinessApproval1' || this.loanAccount.currentStage=='CreditApproval3' || this.loanAccount.currentStage=='BusinessApproval2'",
                        "add": [{
                            "name": "CollateralFieldPolicy",
                            "arguments": {
                                "postStage": "LoanInitiation"
                            }
                        }]
                    }
                ]
            },
            afterProceed: {
                "defaults": [
                    {
                        "name": "DefaultCalculatedVehicleDetailsPolicy",
                        "arguments": {}
                    },
                    {
                        "name": "DefaultVehicleDocumentsPolicy",
                        "arguments": {}
                    }
                ],
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='FieldInvestigation1' || this.loanAccount.currentStage=='FieldInvestigation2' || this.loanAccount.currentStage=='FieldInvestigation3'",
                        "add": [
                            {
                                "name": "DefaultIndividualReferencePolicy",
                                "arguments": {}
                            }

                        ]
                    }
                ]
            }
        },
        'command': {
            'OverlayLeadData': {

            }
        }
    }
}

export = config;
