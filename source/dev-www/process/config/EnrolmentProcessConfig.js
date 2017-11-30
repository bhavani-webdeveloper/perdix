define(["require", "exports"], function (require, exports) {
    "use strict";
    var config = {
        'policies': {
            'default': {
                onNew: {
                    "defaults": [
                        {
                            "name": "LoadNewCustomerData",
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
                            "name": "PreSaveCustomerPolicy",
                            "arguments": null
                        }
                    ]
                },
                beforeSave: {
                    "defaults": [
                        {
                            "name": "LoadEnrolmentCustomerDataPolicy",
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
