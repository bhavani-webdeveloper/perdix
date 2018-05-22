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
                            }
                        ]
                    },
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage=='BranchCreditAppraisal'",
                        "add": [
                            {
                                "name": "CustomerReferencePolicy",
                                "arguments": {}
                            }
                        ]
                    },
                    {
                        "type": "expr",
                        "expr": "this.loanAccount.currentStage == 'Application'",
                        "add": [
                            {
                                "name": "DefaultIncomeTypePolicy",
                                "arguments": {}
                            },
                            {
                                "name": "DefaultExpensePolicy",
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
                ]
            },
            afterSave: {
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
                        "expr": "this.loanAccount.currentStage=='ManagementCommittee'",
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
                        "expr": "this.loanAccount.currentStage=='BranchCreditAppraisal' || this.loanAccount.currentStage=='HOCreditAppraisal' || this.loanAccount.currentStage=='ManagementCommittee'",
                        "add": [{
                            "name": "CollateralFieldPolicy",
                            "arguments": {
                                "postStage": "LoanInitiation"
                            }
                        }]
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
