define(["require", "exports"], function (require, exports) {
    "use strict";
    var config = {
        'policies': {
            'default': {
                onNew: {},
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
