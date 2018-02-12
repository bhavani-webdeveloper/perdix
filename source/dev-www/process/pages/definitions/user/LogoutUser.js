irf.pageCollection.factory(irf.page('user.LogoutUser'), ["$log","User", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
"Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "Queries", "Utils",
function($log,User, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, Queries, Utils) {

    var _pageGlobals = {};
    var pageData = {};

    return {
        "type": "schema-form",
        "title": "FORCE_LOGOUT_USER",
        "subTitle": "",
        initialize: function(model, form, formCtrl) {
            model.UserLists = model.UserLists || {};
            model.UserLists.loginname = SessionStore.getLoginname() 
        },
        offline: false,
        form: [{
            "type": "box",
            "title": "USER_LIST",
            "items": [{
                    key: "UserLists.user_id",
                    title: "USER_LIST",
                    "type": "lov",
                    "lovonly": false,
                    "inputMap": {},
                    "searchHelper": formHelper,
                    "search": function(inputModel, form, model, context) {
                        $log.info("SessionStore.getBranch: " + SessionStore.getBranch());
                        var promise = Queries.UserList(model.UserLists.loginname);
                        return promise;
                    },
                    getListDisplayItem: function(data, index) {
                        return [
                            data.user_id,
                        ];
                    },
                    onSelect: function(valueObj, model, context) {
                        model.UserLists.user_id = valueObj.user_id;
                    },


                },


            ]
        }, {
            "type": "actionbox",
            "items": [{
                "type": "submit",
                "style": "btn-theme",
                "title": "FORCE_LOGOUT"

            }]
        }],
        schema: {
            "$schema": "http://json-schema.org/draft-04/schema#",
            "type": "object",
            "properties": {
                "UserLists": {
                    "type": "object",
                    "properties": {
                        "user_id": {
                            "type": "string",
                            "title": ""
                        },

                    },

                },
            },
        },
        actions: {
            submit: function(model, form, formName) {
                $log.info("Inside submit!!!()");
                User.logout({
                    userId: model.UserLists.user_id 
                },{}).$promise.then(
                    function(response) {
                        PageHelper.hideLoader();
                        PageHelper.showProgress("forcelogout", "Done.", 2000);
                    },
                    function(errorResponse) {
                        PageHelper.hideLoader();
                        PageHelper.showErrors(errorResponse);
                    }
                );
            }

        }
    
}
}]);