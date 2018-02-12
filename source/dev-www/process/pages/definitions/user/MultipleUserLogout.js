irf.pageCollection.factory(irf.page('user.MultipleUserLogout'), ["$log", "User", "$q", "$timeout", "SessionStore", "$state", "entityManager", "formHelper", "$stateParams", "Enrollment", "irfProgressMessage", "PageHelper", "irfStorageService", "$filter",
    "Groups", "AccountingUtils", "Enrollment", "Files", "elementsUtils", "Queries", "Utils",
    function($log, User, $q, $timeout, SessionStore, $state, entityManager, formHelper, $stateParams, Enrollment, irfProgressMessage, PageHelper, StorageService, $filter, Groups, AccountingUtils, Enrollment, Files, elementsUtils, Queries, Utils) {

        var _pageGlobals = {};
        var pageData = {};

        return {
            "type": "schema-form",
            "title": "MULTIPLE_USER_LOGOUT",
            "subTitle": "",
            initialize: function(model, form, formCtrl) {
                model.UserLists = model.UserLists || {};
                model.UserLists.loginname = SessionStore.getLoginname()
            },
            offline: false,
            form: [{
                "type": "actionbox",
                "items": [{
                    "type": "submit",
                    "style": "btn-theme",
                    "title": "LOCK_USER"
                }, {
                    "type": "button",
                    "style": "btn-theme",
                    "title": "UNLOCK_USER",
                    "onClick": "actions.save(model, formCtrl, form, $event)"


                }]
            }],
            schema: {
                "$schema": "http://json-schema.org/draft-04/schema#",
                "type": "object",
                "properties": {
                    "UserLists": {
                        "type": "object",
                        "properties": {


                        },

                    },
                },
            },
            actions: {
                submit: function(model, form, formName) {
                    $log.info("Inside submit!!!()");
                    User.lock({
                        userId: model.UserLists.user_id
                    }, {}).$promise.then(
                        function(response) {
                            PageHelper.hideLoader();
                            PageHelper.showProgress("forcelogout", "Locked All the Users .", 2000);
                        },
                        function(errorResponse) {
                            PageHelper.hideLoader();
                            PageHelper.showErrors(errorResponse);
                        }
                    );
                },
                save: function(model, form, formName){
                     $log.info("unlock!!!()");
                     User.unlock({
                            userId: model.UserLists.user_id
                        }, {}).$promise.then(
                            function(response) {
                                PageHelper.hideLoader();
                                PageHelper.showProgress("forcelogout", "Unlocked All the Users.", 2000);
                            },
                            function(errorResponse) {
                                PageHelper.hideLoader();
                                PageHelper.showErrors(errorResponse);
                            }
                        );
                }
        

            }

        }
    }
]);