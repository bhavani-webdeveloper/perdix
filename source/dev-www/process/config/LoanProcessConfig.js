define(["require", "exports"], function (require, exports) {
    "use strict";
    var config = {
        'policies': {
            'default': {
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
                                    "name": "DefaultVehicleAccessoriesPolicy",
                                    "arguments": {}
                                },
                            ]
                        }
                    ]
                },
                beforeSave: {
                    "defaults": [
                        {
                            "name": "MandatoryFieldsPolicy",
                            "arguments": null
                        },
                        {
                            "name": "LoanDerivedFieldsUpdate",
                            "arguments": null
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
                                        "stage": "Completed",
                                        "fromStage": "ReadyForScreening"
                                    }
                                }
                            ]
                        }
                    ]
                },
                beforeProceed: {
                    "defaults": [
                        {
                            "name": "LoanDerivedFieldsUpdation",
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
                                        "postStage": "LoanInitiation"
                                    }
                                }
                            ]
                        },
                        {
                            "type": "expr",
                            "expr": "this.loanAccount.currentStage=='CreditApproval5' || this.loanAccount.currentStage=='CreditApproval4' || this.loanAccount.currentStage=='CreditApproval3' || this.loanAccount.currentStage=='CreditApproval2' || this.loanAccount.currentStage=='CreditApproval1' ",
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
                    ]
                }
            },
            'command': {
                'OverlayLeadData': {}
            }
        }
    };
    return config;
});
