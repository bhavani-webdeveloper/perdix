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
                        "name": "DefaultCalculatedVehicleDetailsPolicy",
                        "arguments": {}
                    },
                    {
                        "name": "ProcessingFeeInRupees",
                        "arguments": {}
                    }
                ],
                "overrides": [
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
                        "expr": "this.loanAccount.currentStage== 'Application' || 'FieldInvestigation1' || this.loanAccount.currentStage=='FieldInvestigation2' || this.loanAccount.currentStage=='FieldInvestigation3'",
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
                    },
                    {
                        "name": "ProcessingFeeInPaisa",
                        "arguments": {}
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
                        "name": "ProcessingFeeInRupees",
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
                        "expr": "this.loanAccount.currentStage== 'Application' || 'FieldInvestigation1' || this.loanAccount.currentStage=='FieldInvestigation2' || this.loanAccount.currentStage=='FieldInvestigation3'",
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
                    },
                    {
                        "name": "ProcessingFeeInPaisa",
                        "arguments": {}
                    }
                ],
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='CreditApproval'",
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
                        "expr": "this.loanAccount.currentStage=='CreditApproval' || this.loanAccount.currentStage=='CreditApproval' ",
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
                    },
                    {
                        "name": "ProcessingFeeInRupees",
                        "arguments": {}
                    }
                ],
                "overrides": [
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage== 'Application' || 'FieldInvestigation1' || this.loanAccount.currentStage=='FieldInvestigation2' || this.loanAccount.currentStage=='FieldInvestigation3'",
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
