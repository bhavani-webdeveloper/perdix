irf.pages.controller("PageCtrl",
["$log", "$scope", "$stateParams", "$q", "$http", "$uibModal", "authService", "AuthPopup", "PageHelper",
"SessionStore", "$window", "$rootScope", "irfNavigator", "$timeout",
function ($log, $scope, $stateParams, $q, $http, $uibModal, authService, AuthPopup, PageHelper,
    SessionStore, $window, $rootScope, irfNavigator, $timeout) {
        $log.info("Page.html loaded $uibModal");
        var self = this;

        $timeout(function() {
            $rootScope.$broadcast('irf-login-success');
        });

        $scope.loginPipe = AuthPopup.promisePipe;

        $scope.$watch(function (scope) {
            return scope.loginPipe.length;
        }, function (n, o) {
            if (n > o && n == 1) {
                $log.info("Inside LoginPipeProcessor");
                SessionStore.session.offline = true;
                themeswitch.changeTheme('offline');

                self.launchRelogin().then(function(){
                    SessionStore.session.offline = false;
                    themeswitch.changeTheme(themeswitch.getThemeColor(), true);
                    _.each($scope.loginPipe, function(lpo, k){
                        $http(lpo.rejection.config).then(function (data) {
                            lpo.deferred.resolve(data);
                        }, function (data) {
                            lpo.deferred.reject(data);
                        });
                    });
                    $scope.loginPipe.length = 0;
                }).catch(function(){
                    _.each($scope.loginPipe, function(lpo, k){
                        $log.info(lpo);
                        lpo.deferred.reject(lpo.rejection);
                    });
                    $scope.loginPipe.length = 0;
                });
            }
        });

        $scope.$on('server-error', function (event, args) {
            $scope.errors = args;
        });

        $scope.$on('server-warnings', function (event, args) {
            $scope.warnings = args;
        });

        $scope.$on('server-info', function (event, args) {
            $scope.info = args;
        });

        $scope.$on('page-loader', function(event, arg){
            $log.info("Inside listener for show-loader");
            $scope.showSectionFarLoader = !!arg;
            $scope.showLoaderBlocking = (arg && arg.blocking);
            $scope.showLoaderMsg = (arg && arg.message)? arg.message: '';
        })

        $scope.$on('server-connection-error', function(event, arg) {
            $scope.errors = $scope.errors || [];
            if (arg === 408) {
                $scope.errors.push({
                    message: 'Connection timed out'
                });
            } else {
                $scope.errors.push({
                    message: 'Server Unreachable'
                });
            }
        });

        $scope.breadcrumb = {
            callstack: irfNavigator.$callstack(),
            current: irfNavigator.$current,
            goBackTo: function($event, $index) {
                $event.preventDefault();
                irfNavigator.$goBackTo($index);
            }
        };

        self.loginSuccess = false;
        self.launchRelogin = function () {
            var def = $q.defer();
            $scope.username = authService.getUserData().login;
            var modalWindow = $uibModal.open({
                templateUrl: "modules/irfpages/templates/modals/Relogin.html",
                windowTopClass: "relogin-window",
                scope: $scope,
                backdrop: 'static',
                controller: function ($scope) {

                    $scope.cancelRelogin = function () {
                        modalWindow.close();
                        def.reject();
                    };

                    $scope.relogin = function (username, password) {
                        $log.info("Inside onlineLogin");
                        if (!password) {
                            $scope.errorMessage = "Password cannot be empty";
                            return false;
                        }
                        $scope.errorMessage = null;
                        authService.login(username, password)
                            .then(function (arg) { // Success callback
                                modalWindow.close();
                                def.resolve();
                            }, function (arg) { // Error callback
                                $scope.showLoading = false;
                                $log.error(arg);
                                $scope.errorMessage = arg.statusText || arg.status;
                            });
                        return true;
                    };

                }
            });
            modalWindow.rendered.then(function() { $('.relogin #inputPassword3').focus() });
            return def.promise;
        };
    }])
    .factory('PageHelper', ['$rootScope', '$log', '$document', 'irfProgressMessage', function ($rootScope, $log, $document, irfProgressMessage) {

        /**
         * A error object will be like
         * code:
         * message:
         * severity:
         *
         * @type {Array}
         */
        var errors = [];
        var warnings = [];
        var info = [];

        var clearErrorsFn = function(){
            errors = [];
            $rootScope.$broadcast('server-error', errors);
        }

        var clearWarningsFn = function(){
            warnings = [];
            $rootScope.$broadcast('server-warnings', warnings);
        }

        var clearInfoFn = function(){
            info = [];
            $rootScope.$broadcast('server-info', info);
        }

        /* Add `clearErrors` method on $rootScope */

        $rootScope.clearErrors = clearErrorsFn;
        $rootScope.clearWarnings = clearWarningsFn;
        $rootScope.clearInfo = clearInfoFn;

        return {
            clearErrors: clearErrorsFn,
            setError: function (error) {
                $log.info("Inside setError");
                $log.info(error);
                this.setErrors([error]);
            },
            setErrors: function (newErrors) {
                $log.info("Inside setErrors");
                errors = _.concat(errors, newErrors);
                $rootScope.$broadcast('server-error', errors);
                this.scrollToErrors();
            },
            getErrors: function () {
                $log.info("Inside getErrors");
                return errors;
            },
            scrollToErrors: function () {
                jQuery('html, body').animate({
                    scrollTop: $("#errors-wrapper").offset().top - 50
                }, 500);
            },
            clearWarnings: clearWarningsFn,
            setWarning: function (warning) {
                $log.info("Inside setWarning");
                $log.info(warning);
                this.setWarnings([warning]);
            },
            setWarnings: function (newWarnings) {
                $log.info("Inside setWarnings");
                warnings = _.concat(warnings, newWarnings);
                $rootScope.$broadcast('server-warnings', warnings);
                this.scrollToWarnings();
            },
            getWarnings: function () {
                $log.info("Inside getWarnings");
                return warnings;
            },
            scrollToWarnings: function () {
                jQuery('html, body').animate({
                    scrollTop: $("#warnings-wrapper").offset().top - 50
                }, 500);
            },
            clearInfo: clearInfoFn,
            setInfo: function (i) {
                $log.info("Inside setinfo");
                $log.info(i);
                info = [i];
                $rootScope.$broadcast('server-info', info);
                this.scrollToInfo();
            },
            getInfo: function () {
                $log.info("Inside getInfo");
                return errors;
            },
            scrollToInfo: function () {
                jQuery('html, body').animate({
                    scrollTop: $("#info-wrapper").offset().top - 50
                }, 500);
            },
            scrollToTop: function(){
                jQuery('html, body').animate({
                    scrollTop: 0
                }, 500);
            },
            showLoader: function(msg){
                $log.info("Inside showLoader");
                $rootScope.$broadcast('page-loader', { message: msg });
            },
            hideLoader: function(){
                $log.info("Inside hideLoader");
                $rootScope.$broadcast('page-loader', false);
            },
            showProgress: function(id, text, timeSpan, level, title){
                $log.info("Inside progressMessage");
                irfProgressMessage.pop(id, text, timeSpan, level, title);
            },
            gracefulClearProgress: function(){
                irfProgressMessage.gracefulClearAll(2000);
            },
            showErrors: function(res){
                clearErrorsFn();
                try {
                    var data = res.data;
                    var errors = [];
                    if (_.hasIn(data, 'errors')) {
                        _.forOwn(data.errors, function (keyErrors, key) {
                            var keyErrorsLength = keyErrors.length;
                            for (var i = 0; i < keyErrorsLength; i++) {
                                var error = {"message": "<strong>" + key + "</strong>: " + keyErrors[i]};
                                errors.push(error);
                            }
                        });
                    }
                    if (_.hasIn(data, 'error')) {
                        errors.push({message: data.error});
                    }
                    this.setErrors(errors);
                }catch(err){
                    $log.error(err);
                }
            },
            showInfo: function(res){
                clearInfoFn();
                try {
                    var data = res.data;
                    var infos = [];
                    if (_.hasIn(data, 'errors')) {
                        _.forOwn(data.error, function (keyInfo, key) {
                            var keyInfoLength = keyInfo.length;
                            for (var i = 0; i < keyInfoLength; i++) {
                                var error = {"message": "<strong>" + key + "</strong>: " + keyInfo[i]};
                                infos.push(error);
                            }
                        });
                    }
                    if (_.hasIn(data, 'error')) {
                        infos.push(data.error);
                    }
                    this.setInfo(infos);
                }catch(err){
                    $log.error(err);
                }
            },
            showWarnings: function(res){
                this.clearWarnings();
                try {
                    var data = res.data;
                    var warnings = [];
                    if (_.hasIn(data, 'warnings')) {
                        _.forOwn(data.warnings, function (keyWarnings, key) {
                            var keyWarningsLength = keyWarnings.length;
                            for (var i = 0; i < keyWarningsLength; i++) {
                                var error = {"message": "<strong>" + key + "</strong>: " + keyWarnings[i]};
                                warnings.push(error);
                            }
                        });

                    }
                    if (_.hasIn(data, 'warning')) {
                        warnings.push({message: data.warning});
                    }
                    this.setWarnings(warnings);
                }catch(err){
                    $log.error(err);
                }

            },
            navigateGoBack: function(){
                return window.history.back();
            },
            showBlockingLoader: function(msg){
                $log.info("Inside showBlockingLoader");
                $rootScope.$broadcast('page-loader', {
                    blocking: true,
                    message: msg
                });
            },
            hideBlockingLoader: function(){
                $log.info("Inside hideBlockingLoader");
                $rootScope.$broadcast('page-loader', false);
            },
            isFormInvalid: function(formController, showMsg){
                showMsg = showMsg || true;
                formController.scope.$broadcast('schemaFormValidate');
                if (formController && formController.$invalid) {
                    if (showMsg) 
                        this.showProgress("form-validation","Your form have errors. Please check.", 5000);
                    return true;
                }
                return false;
            }
        }
    }]);
