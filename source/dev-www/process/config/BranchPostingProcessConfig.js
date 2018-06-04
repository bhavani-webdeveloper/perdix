define(["require", "exports"], function (require, exports) {
    "use strict";
    var config = {
        'policies': {
            'default': {
                onNew: {
                    "defaults": [
                        {
                            "name": "LoadBranchData",
                            "arguments": null
                        }
                    ]
                },
                onLoad: {},
                beforeProceed: {},
                beforeSave: {},
            },
            'command': {
                'OverlayLeadData': {}
            }
        }
    };
    return config;
});
