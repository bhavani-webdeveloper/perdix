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
                                "applicant": true
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
                    "defaults": []
                },
                "afterSave": {
                    "overrides": []
                },
                "beforeProceed": {
                    "overrides": []
                }
            },
            "command": {
                "OverlayLeadData": {}
            }
        }
    };
    return config;
});
