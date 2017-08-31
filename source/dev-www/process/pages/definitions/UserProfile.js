irf.pageCollection.factory(irf.page("UserProfile"),
["$log", "$q", "SessionStore", "languages", "dateFormats", "$translate", "irfProgressMessage",
	"irfStorageService", "irfElementsConfig","PageHelper", "formHelper", "irfTranslateLoader", "Account", "PagesDefinition", "translateFilter",
function($log, $q, SessionStore, languages, dateFormats, $translate, PM,
	irfStorageService, irfElementsConfig,PageHelper, formHelper, irfTranslateLoader, Account, PagesDefinition, translateFilter) {

	var languageTitleMap = []; var systemAllowedLanguages = SessionStore.getSystemAllowedLanguages();
	_.each(languages, function(v, k){
		if (systemAllowedLanguages.indexOf(k) !== -1)
			languageTitleMap.push({value:v.code, name:v.titleEnglish + ' - ' + v.titleLanguage});
	});

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
			if(model.settings) {
				model.settings.language = SessionStore.getLanguage();
			}
			if (m && m.profile && m.settings) {
				model.profile = m.profile;
				model.settings = m.settings;
			}
			model.profile.userName = SessionStore.getUsername();
			model.profile.openChangePassword = false;

			model.landing = irf.HOME_PAGE;
			model.settings.landingHtml = '<i class="{{model.landing.iconClass}}">&nbsp;</i>{{model.landing.title|translate}}<button irf-lov irf-model-value="model.landing" irf-form="form" irf-model="model" class="pull-right btn btn-default btn-xs">Change</button>';
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
					key: "settings.landingHtml",
					title: "Home Page",
					type: "html",
					searchHelper: formHelper,
					search: function(inputModel, form, model, context) {
						var deferred = $q.defer();
						PagesDefinition.getUserAllowedPages().then(function(resp) {
							var pagesArray = [];
							_.forOwn(_.cloneDeep(resp), function(v, k) {
								if (v.directAccess) pagesArray.push(v)
							});
							deferred.resolve({
								headers: {
									"x-total-count": pagesArray.length
								},
								body: pagesArray
							});
						}, deferred.reject);
						return deferred.promise;
					},
					onSelect: function(valueObj, model, context) {
						model.landing = valueObj;
						irf.HOME_PAGE = {
							"url": valueObj.uri,
							"to": valueObj.state,
							"params": valueObj.stateParams,
							"iconClass": valueObj.iconClass,
							"title": valueObj.title
						};
						localStorage.setItem("UserHomePage", JSON.stringify(irf.HOME_PAGE));
					},
					getListDisplayItem: function(item, index) {
						return ['<span><i class="'+item.iconClass+'">&nbsp;</i>'+translateFilter(item.title)+'<span class="pull-right">'+irf.pageNameHtml(item.stateParams.pageName&&item.stateParams.pageName.match('(^.+)[.]')&&item.stateParams.pageName.match('(^.+)[.]')[1]||item.stateParams.pageName||item.state)+'</span></span>'];
					}
				},
				{
					type: "fieldset",
					title: "LOGGING",
					items: [
						{
							key: "settings.consoleLog",
							fullwidth: true,
							onChange: function(modelValue, form, model) {
								if (!modelValue) {
									model.settings.consoleLogAutoClear = false;
								}
							}
						},
						{
							key: "settings.consoleLogAutoClear",
							fullwidth: true,
							condition: "model.settings.consoleLog"
						},
						{
							key: "settings.consoleLogAutoClearDuration",
							fullwidth: true,
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
				"fieldHtmlClass": "pull-right",
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
							//"default": "en",
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
