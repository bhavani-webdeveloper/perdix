define(["require", "exports"], function (require, exports) {
    "use strict";
    var config = {
        'policies': {
            'default': {
                onNew: {
                    "defaults": [
                        {
                            "name": "SampleSimplePolicy",
                            "arguments": {
                                "name": "sasdf"
                            }
                        },
                        {
                            "name": "SampleMultiPolicy",
                            "arguments": {
                                "testargs": {
                                    "shahal": "tharique"
                                }
                            }
                        }, {
                            "name": "LoadRelatedCustomerData",
                            "arguments": null
                        }
                    ]
                },
                onLoad: {
                    "defaults": [
                        {
                            "name": "LoadRelatedCustomersPolicy",
                            "arguments": null
                        }
                    ]
                },
                beforeProceed: {
                    "defaults": [
                        {
                            "name": "preSaveCustomerPolicy",
                            "arguments": null
                        }
                    ]
                },
            },
            'command': {
                'OverlayLeadData': {}
            }
        }
    };
    return config;
});
