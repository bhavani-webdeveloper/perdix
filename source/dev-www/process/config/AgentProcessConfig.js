define(["require", "exports"], function (require, exports) {
    "use strict";
    var config = {
        'policies': {
            'default': {
                onNew: {
                    "defaults": []
                },
                onLoad: {
                    "defaults": []
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
