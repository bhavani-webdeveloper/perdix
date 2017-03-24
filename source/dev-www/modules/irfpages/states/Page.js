irf.pages.controller("PageCtrl",
["$log", "$scope", "$stateParams", "$q", "$http", "$uibModal", "authService", "AuthPopup", "PageHelper",
"SessionStore", "$window", "$rootScope",
function ($log, $scope, $stateParams, $q, $http, $uibModal, authService, AuthPopup, PageHelper,
    SessionStore, $window, $rootScope) {
        $log.info("Page.html loaded $uibModal");
        var self = this;

        $rootScope.$broadcast('irf-login-success');

        $scope.loginPipe = AuthPopup.promisePipe;

        $scope.$watch(function (scope) {
            return scope.loginPipe.length;
        }, function (n, o) {
            if (n > o && n == 1) {
                $log.info("Inside LoginPipeProcessor");
                SessionStore.session.offline = true;
                themeswitch.changeTheme('deepteal');

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
        })

        $scope.$on('page-loader', function(event, arg){
            $log.info("Inside listener for show-loader");
            $scope.showSectionFarLoader = arg;
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

        self.loginSuccess = false;
        self.launchRelogin = function () {
            var def = $q.defer();
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
                        if (!username || !password) {
                            return false;
                        }
                        var userData = authService.getUserData();
                        if (username.toLowerCase() !== userData.login.toLowerCase()) {
                            $scope.errorMessage = "Only current user can login";
                            return false;
                        }
                        $scope.errorMessage = null;
                        authService.login(username, password)
                            .then(function (arg) { // Success callback
                                modalWindow.close();
                                // TODO
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

        var clearErrorsFn = function(){
            errors = [];
            $rootScope.$broadcast('server-error', errors);
        }

        /* Add `clearErrors` method on $rootScope */

        $rootScope.clearErrors = clearErrorsFn;

        var blockUiDefaults={message:"<h1>Please wait...</h1>",title:null,draggable:!0,theme:!1,css:{padding:0,margin:0,width:"30%",top:"40%",left:"35%",textAlign:"center",color:"#000",border:"3px solid #aaa",backgroundColor:"#fff",cursor:"wait"},themedCSS:{width:"30%",top:"40%",left:"35%"},overlayCSS:{backgroundColor:"#000",opacity:.6,cursor:"wait"},cursorReset:"default",growlCSS:{width:"350px",top:"10px",left:"",right:"10px",border:"none",padding:"5px",opacity:.6,cursor:"default",color:"#fff",backgroundColor:"#000","-webkit-border-radius":"10px","-moz-border-radius":"10px","border-radius":"10px"},iframeSrc:/^https/i.test(window.location.href||"")?"javascript:false":"about:blank",forceIframe:!1,baseZ:1e3,centerX:!0,centerY:!0,allowBodyStretch:!0,bindEvents:!0,constrainTabKey:!0,fadeIn:200,fadeOut:400,timeout:0,showOverlay:!0,focusInput:!0,focusableElements:":input:enabled:visible",onBlock:null,onUnblock:null,onOverlayClick:null,quirksmodeOffsetHack:4,blockMsgClass:"blockMsg",ignoreIfBlocked:!1};
        var blockUiCss = jQuery.extend({}, blockUiDefaults.css, {});
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
            scrollToTop: function(){
                jQuery('html, body').animate({
                    scrollTop: 0
                }, 500);
            },
            showLoader: function(){
                $log.info("Inside showLoader");
                $rootScope.$broadcast('page-loader', true);
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
                this.clearErrors();
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
            navigateGoBack: function(){
                return window.history.back();
            },
            showBlockingLoader: function(msg){
                var $ = jQuery;
                var opts = $.extend({}, blockUiDefaults, opts || {baseZ: 1050});
                var lyr1, lyr2, lyr3, s;
                var z= opts.baseZ;
                lyr1 = $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+/^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank'+'"></iframe>');
                lyr2 = $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');
                s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>';
                lyr3 = $(s);
                if (msg) {
                    lyr3.css($.extend({},blockUiCss,{color: "white", background: "none", border: "none"}));
                }

                if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/)
                    lyr2.css(opts.overlayCSS);
                lyr2.css('position', 'fixed');
                lyr1.css('opacity',0.0);
                var layers = [lyr1,lyr2,lyr3], $par = $('body');
                $.each(layers, function() {
                    this.appendTo($par);
                });

                if (msg) {
                    if (opts.theme)
                        lyr3.find('.ui-widget-content').append(msg);
                    else
                        lyr3.append(msg);
                    if (msg.jquery || msg.nodeType)
                        $(msg).show();
                }
                
                // lyr1.show();
                if (opts.showOverlay)
					lyr2.show();
				if (msg)
					lyr3.show();
				if (opts.onBlock)
					opts.onBlock.bind(lyr3)();

            },
            hideBlockingLoader: function(){
                $(".blockUI").remove();
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
