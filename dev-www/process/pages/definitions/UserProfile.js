irf.pageCollection.factory(irf.page("UserProfile"),
["$log", "$q", "SessionStore", "languages", "$translate", "irfProgressMessage",
	"irfStorageService", "irfElementsConfig","PageHelper", "irfSimpleModal", "irfTranslateLoader", "Account",
function($log, $q, SessionStore, languages, $translate, PM,
	irfStorageService, irfElementsConfig,PageHelper, irfSimpleModal, irfTranslateLoader, Account) {

	var languageTitleMap = [];
	_.each(languages, function(v, k){
		languageTitleMap.push({value:v.code, name:v.titleEnglish + ' - ' + v.titleLanguage});
	});

	var dateFormats = ["YYYY-DD-MM", "DD-MM-YYYY", "DD-MMM-YYYY", "Do MMM YYYY", "dddd Do MMM YYYY"];
	var dateTitleMap = [];
	var now = moment(new Date());
	_.each(dateFormats, function(v,k){
		dateTitleMap.push({name: now.format(v) + " | " + v, value: v});
	});

	return {
		"id": "UserProfile",
		"type": "schema-form",
		"name": "UserProfile",
		"title": "USER_PROFILE",
		"subTitle": "",
		initialize: function (model, form, formCtrl) {
			$log.info("I got initialized");
			var m = irfStorageService.getJSON(formCtrl.$name, model.profile.login);
			if (m && m.profile && m.settings) {
				model.profile = m.profile;
				model.settings = m.settings;
			}
			model.profile.userName = SessionStore.getUsername();
			model.profile.openChangePassword = false;
		},
		modelPromise: function(pageId) {
			var deferred = $q.defer();
			if (pageId === SessionStore.session.login) {
				deferred.resolve({profile:SessionStore.session});
			} else {
				deferred.reject({error:"Different User"});
			}
			return deferred.promise;
		},
		form: [{
			type: "box",
			title: "PROFILE_INFORMATION",
			items: [
				{
					key: "profile.login",
					readonly: true
				},
				{
					key: "profile.userName",
					readonly: true
				},
				{
					title: "CHANGE_PASSWORD",
					condition: "!model.profile.openChangePassword",
					type: "button",
					onClick: "model.profile.openChangePassword = true"
				},
				{
					key: "profile.oldPassword",
					condition: "model.profile.openChangePassword"
				},
				{
					key: "profile.newPassword",
					condition: "model.profile.openChangePassword"
				},
				{
					key: "profile.newPassword2",
					condition: "model.profile.openChangePassword"
				},
				{
					title: "CHANGE_PASSWORD",
					condition: "model.profile.openChangePassword",
					type: "button",
					onClick: "actions.changePassword(model, formCtrl, form)"
				}
			]
		},{
			type: "box",
			title: "PROFILE_SETTINGS",
			items: [
				"settings.dateFormat",
				"settings.language",
				"settings.loginMode",
				"settings.offlinePin",
				{
					type: "fieldset",
					title: "LOGGING",
					items: [
						{
							key: "settings.consoleLog",
							onChange: function(modelValue, form, model) {
								if (!modelValue) {
									model.settings.consoleLogAutoClear = false;
								}
							}
						},
						{
							key: "settings.consoleLogAutoClear",
							condition: "model.settings.consoleLog"
						},
						{
							key: "settings.consoleLogAutoClearDuration",
							condition: "model.settings.consoleLogAutoClear"
						}
					]
				}
			]
		},{
			type: "actionbox",
			items: [{
				"type": "save",
				"title": "SAVE_PROFILE_SETTINGS"
			},{
				"type":"button",
				"icon":"fa fa-refresh",
				"title":"REFRESH_CACHE",
				"onClick":"actions.refreshMasters()"
			}]
		}],
		actions: {
			refreshMasters:function(){
				PageHelper.showLoader();
				var p = [
					irfStorageService.cacheAllMaster(true,true),
					irfTranslateLoader({forceServer: true})
				];
				$q.all(p).then(function(){
					PM.pop('cache-master',"Synced Successfully.",5000);
				},function(){
					PM.pop('cache-master',"Sync Failed, Please Try Again.",5000);
				}).finally(function(){
					PageHelper.hideLoader();
					window.location.hash = '#/' + irf.HOME_PAGE.url;
					window.location.reload();
				});
			},
			preSave: function(model, formCtrl, formName) {
				var deferred = $q.defer();
				if (formCtrl.$invalid || !model.profile || model.profile.login !== SessionStore.session.login) {
					PM.pop('user-profile', 'Your form have errors. Please fix them.', 5000);
				} else {
					model.$$STORAGE_KEY$$ = model.profile.login;
					irfStorageService.putJSON(formName, model);
					$translate.use(model.settings.language);
					SessionStore.session.language = model.settings.language;
					SessionStore.profile = model.profile;
					SessionStore.settings = model.settings;
					irfElementsConfig.setDateDisplayFormat(model.settings.dateFormat);

					PM.pop('user-profile', 'Profile settings saved.', 3000);
				}
				// deferred.reject();
				return deferred.promise;
			},
			changePassword: function(model, formCtrl, form) {
				PageHelper.clearErrors();
				if (model.profile.newPassword !== model.profile.newPassword2) {
					PageHelper.setError({message:'New password & re-enter password are different.'});
					return false;
				}
				Account.changeExpiredPassword({
					"username": model.profile.login,
					"oldPassword": model.profile.oldPassword,
					"newPassword": model.profile.newPassword
				}).$promise.then(function() {
					PageHelper.showProgress('user-profile', 'Password changed successfully, Pl Relogin to continue..', 5000);
				}, function(err) {
					PageHelper.showErrors(err);
				});
			}
		},
		schema: {
			"type": "object",
			"properties": {
				profile: {
					"type":"object",
					"properties": {
						login: {
							"title": "LOGIN",
							"type": "string"
						},
						userName: {
							"title": "USERNAME",
							"type": "string"
						},
						lastName: {
							"title": "LASTNAME",
							"type": "string"
						},
						oldPassword: {
							"title": "CURRENT_PASSWORD",
							"type": "string",
							"x-schema-form": {
								"type": "password"
							}
						},
						newPassword: {
							"title": "NEW_PASSWORD",
							"type": "string",
							"x-schema-form": {
								"type": "password"
							}
						},
						newPassword2: {
							"title": "REENTER_PASSWORD",
							"type": "string",
							"x-schema-form": {
								"type": "password"
							}
						}
					}
				},
				settings: {
					"type":"object",
					"properties": {
						dateFormat: {
							"title": "DATE_FORMAT",
							"type": "string",
							"default": "YYYY-DD-MM",
							"x-schema-form": {
								"type": "select",
								"titleMap": dateTitleMap
							}
						},
						language: {
							"title": "PREFERRED_LANGUAGE",
							"type": "string",
							"default": "en",
							"x-schema-form": {
								"type": "select",
								"titleMap": languageTitleMap
							}
						},
						loginMode: {
							"title": "PREFERRED_LOGIN_MODE",
							"type": "string",
							"enum": ["online", "offline"],
							"default": "online",
							"x-schema-form": {
								"type": "radios",
								"titleMap": [{
									"value": "online",
									"name": "ONLINE"
								},{
									"value": "offline",
									"name": "OFFLINE"
								}]
							}
						},
						offlinePin: {
							"title": "OFFLINE_PIN",
							"type": "string",
							"minLength": 4,
							"maxLength": 4,
							"x-schema-form": {
								"type": "password"
							}
						},
						consoleLog: {
							"title": "CONSOLE_LOG",
							"type": "boolean"
						},
						consoleLogAutoClear: {
							"title": "CONSOLE_LOG_AUTO_CLEAR",
							"type": "boolean"
						},
						consoleLogAutoClearDuration: {
							"title": "CONSOLE_LOG_AUTO_CLEAR_DURATION",
							"type": "number"
						}
					}
				}
			}
		}
	}
}]);
