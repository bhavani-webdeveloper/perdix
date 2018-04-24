define(["require", "exports"], function (require, exports) {
    "use strict";
    var config = {
        "policies": {
            "default": {
                "onNew": {
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
                "onLoad": {
                    "defaults": [
                        {
                            "name": "LoadRelatedCustomersPolicy",
                            "arguments": {}
                        }
                    ]
                },
                "beforeSave": {
                    "defaults": [
                        {
                            "name": "MandatoryFieldsPolicy",
                            "arguments": null
                        }
                    ]
                },
                "afterSave": {
                    "overrides": [
                        {
                            "type": "expr",
                            "expr": "this.loanAccount.currentStage=='KYC'",
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
                "beforeProceed": {
                    "overrides": [
                        {
                            "type": "expr",
                            "expr": "this.loanAccount.currentStage=='ManagementCommittee'",
                            "add": [
                                {
                                    "name": "OriginationToBookingPolicy",
                                    "arguments": {
                                        "postStage": "LoanInitiation"
                                    }
                                }
                            ]
                        }
                    ]
                }
            },
            "command": {
                "OverlayLeadData": {}
            }
        }
    };
    return config;
});
