define(["require", "exports"], function (require, exports) {
    "use strict";
    var config = {
        'policies': {
            'default': {
                onNew: {
                    "defaults": [{
                            "name": "DefaultRelatedCustomersPolicy",
                            "arguments": {
                                "applicant": true
                            }
                        }]
                },
                onLoad: {
                    "defaults": [
                        {
                            "name": "LoadRelatedCustomersPolicy",
                            "arguments": {}
                        }
                    ]
                },
                beforeProceed: {
                    "defaults": []
                },
                beforeSave: {
                    "defaults": []
                },
            },
            'command': {
                'OverlayLeadData': {}
            }
        }
    };
    return config;
});
