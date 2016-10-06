irf.pageCollection.factory(irf.page("demo.MyDemo"),
["$log", "Enrollment", "SessionStore",
    function($log, Enrollment, SessionStore){

        var branch = SessionStore.getBranch();

        return {
            "type": "schema-form",
            "title": "Demo Page",
            "subTitle": "Demo Page secondary title",
            initialize: function (model, form, formCtrl) {
                $log.info("Demo Customer Page got initialized");
            },
            form: [
            {
                "type" : "box",
                "title" : "My Customer Details Page"
            }
            ],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",        
                "type" : "object"
            },
            actions: {
                submit: function(model, form, formName){
                    $log.info('on submit action .........');
                }
            }
        };
    }
]);