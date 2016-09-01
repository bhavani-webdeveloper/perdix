
irf.commons.value('RefCodeCache',{
	refCodes: null
});

irf.commons.factory("irfStorageService",
["$log","$q","ReferenceCodeResource","RefCodeCache", "SessionStore", "$filter",
function($log,$q,rcResource,RefCodeCache, SessionStore, $filter){
	var retrieveItem = function(key) {
		return localStorage.getItem(key);
	};
	var storeItem = function(key, value) {
		localStorage.setItem(key, value);
	};
	var removeItem = function(key) {
		localStorage.removeItem(key);
	};
	var masters = {};
	var factoryObj = {
		storeJSON: function(key, value){
			try {
				storeItem(key, JSON.stringify(value));
			} catch (e) {}
		},
		retrieveJSON: function(key){
			try {
				return JSON.parse(retrieveItem(key));
			} catch (e) {}
		},
		removeJSON: function(key){
			removeItem(key);
		},
		getMasterJSON: function(key, cb) {
			var master = retrieveItem(key);
			try {
				master = JSON.parse(master);
			} catch (e) {}
			if (typeof(cb) != 'undefined' && angular.isFunction(cb)) {
				cb(master);
			} else {
				return master;
			}
		},
		removeMasterJSON: function(key, cb) {
			try {
				removeItem(key);
			} catch (e) {}
			if (typeof(cb) != 'undefined' && angular.isFunction(cb)) {
				cb();
			}
		},
		getJSON: function(key, storageKey, cb) {
			var master = retrieveItem(key);
			var value;
			try {
				master = JSON.parse(master);
				value = master[storageKey];
			} catch (e) {}
			if (typeof(cb) != 'undefined' && angular.isFunction(cb)) {
				cb(value);
			} else {
				return value;
			}
		},
		putJSON: function(key, value, cb) {
			var master = retrieveItem(key);
			try {
				master = JSON.parse(master);
			} catch (e) {}
			if (!master)
				master = {};
			master[value.$$STORAGE_KEY$$] = value;
			storeItem(key, JSON.stringify(master));
			if (typeof(cb) != 'undefined' && angular.isFunction(cb)) {
				cb();
			}
		},
		deleteJSON: function(key, storageKey) {
			var master = retrieveItem(key);
			var value;
			try {
				master = JSON.parse(master);
				delete master[storageKey];
				storeItem(key, JSON.stringify(master));
				return true;
			} catch (e) {
				$log.debug("Error occured while deleteJSON");
				$log.debug(e);
				return false;
			}
		},
		cacheAllMaster: function(isServer,forceFetch) {
			if (!masters || _.isEmpty(masters)) {
				var localMasters = retrieveItem('irfMasters');
				try {
					masters = JSON.parse(localMasters);
					$log.info('masters loaded to memory localStorage');
				} catch (e) {
					$log.error(e);
				}
			} else {
				$log.info('NoNeedToLoadMasters');
			}
			if (isServer) {
				$log.info('masters isServer');
				var deferred = $q.defer();
				try {
					var isSameDay = false;
					if (masters && masters._timestamp) {
						isSameDay = moment(masters._timestamp).startOf('day').isSame(moment(new Date().getTime()).startOf('day'));
					}
					(!forceFetch) && isSameDay && deferred.resolve("It's the same day for Masters/ not downloading");
					((!forceFetch) && isSameDay) || rcResource.findAll(null).$promise.then(function(codes) {
						var _start = new Date().getTime();
						var classifiers = {};
						var l = codes.length;
						for (i = 0; i < l; i++) {
							var d = codes[i];
							var c = classifiers[d['classifier']];
							if (!c) {
								c = classifiers[d['classifier']] = {};
								c.data = [];
								if (d['parentClassifier']) {
									c['parentClassifier'] = d['parentClassifier'];
								}
							}
							var _data = {
								code: d['code'],
								name: d['name'],
								value: d['name'],
								id: d['id']
							};
							if (d['parentClassifier'] && d['parentReferenceCode'])
								_data.parentCode = d['parentReferenceCode'].trim();
							if (d['field1']) _data.field1 = d['field1'].trim();
							if (d['field2']) _data.field2 = d['field2'].trim();
							if (d['field3']) _data.field3 = d['field3'].trim();
							if (d['field4']) _data.field4 = d['field4'].trim();
							if (d['field5']) _data.field5 = d['field5'].trim();
							c.data.push(_data);
						}
						$log.info("Time taken to process masters (ms):" + (new Date().getTime() - _start));

						/** removing other bank branches, district **/
						var bankId = null;
						try {
							var bankName = SessionStore.getBankName();
							var bankId = $filter('filter')(classifiers['bank'].data, {name:bankName}, true)[0].code;
							if (bankId) {
								classifiers['branch'].data = $filter('filter')(classifiers['branch'].data, {parentCode:bankId}, true);
								classifiers['district'].data = $filter('filter')(classifiers['district'].data, {parentCode:bankId}, true);
							}
						} catch (e) {
							$log.error('removing other bank branches FAILED after master fetch');
							$log.error(e);
						}
						/** sort branches, centre **/
						try {
							classifiers['branch'].data = _.sortBy(classifiers['branch'].data, 'name');
							classifiers['centre'].data = _.sortBy(classifiers['centre'].data, 'name');
						} catch (e) {
							$log.error('Branch,centre SORT FAILED after master fetch');
						}

						classifiers._timestamp = new Date().getTime();
						masters = classifiers;
						$log.info(masters);
						storeItem('irfMasters', JSON.stringify(classifiers));
						deferred.resolve("masters download complete");
					});
				} catch (e) {
					deferred.reject(e);
				}
				return deferred.promise;
			}
		},
		getMaster: function(classifier) {
			return masters[classifier];
		}
	};
	return factoryObj;
}]);

irf.commons.factory("formHelper",
["$log", "$state", "irfStorageService", "SessionStore", "entityManager", "irfProgressMessage",
"$filter", "Files", "$q", "elementsUtils",
function($log, $state, irfStorageService, SessionStore, entityManager, irfProgressMessage,
	$filter, Files, $q, elementsUtils){
	return {
		enum: function(key) {
			// console.warn(key);
			var r = irfStorageService.getMaster(key);
			var branchId = ""+SessionStore.getBranchId();
			if (r && _.isArray(r.data)) {
				var ret = {parentClassifier:r.parentClassifier,data:[]};
				switch (key.toString().trim()) {
					//Write custom cases for (name,value) pairs in enumCodes
					case 'bank':
						ret.data = _.clone(r.data);
						for(var i = 0; i < ret.data.length; i++) {
							ret.data[i].value = ret.data[i].code;
						}
						break;
					case 'loan_product':
						$log.debug(key);
						ret.data = _.clone(r.data);
						for(var i = 0; i < ret.data.length; i++) {
							ret.data[i].value = ret.data[i].field1.toString().trim();
						}
						break;
					case 'centre':
						r.data = $filter('filter')(r.data, {parentCode:branchId}, true);
						ret.data = _.clone(r.data);
						for(var i = 0; i < ret.data.length; i++) {
							if (ret.data[i].parentCode == branchId)
								ret.data[i].value = ret.data[i].code;
						}
                        // console.warn(ret);
						break;
                    case 'village':
                        console.log("branchid:"+branchId);
						ret.data = r.data = $filter('filter')(r.data, {parentCode:branchId}, true);
						$log.warn('village:'+ret.data.length);
						break;
					case 'partner':
						ret.data = _.clone(r.data);
						for(var i = 0; i < ret.data.length; i++) {
								ret.data[i].value = ret.data[i].code;
						}
						// console.warn(ret);
						break;
					default:
						ret.data = r.data; // value <-- name
				}
				return ret;
			}
			$log.error('No record found for enum key: ' + key);
			return null;
		},
		save: function(model, formCtrl, formName, actions) {
			var pageName = formName.substring(6).replace(/\$/g, '.');
			var promise = true;
			if (angular.isFunction(actions.preSave)) {
				promise = actions.preSave(model, formCtrl, formName);
				if (promise && _.isFunction(promise.then)) {
					promise.then(function(){
						irfStorageService.putJSON(pageName, model);
						$state.go('Page.EngineOffline', {pageName: pageName});
					}).catch(function(){
						// nothing to do
					});
				}
			} else {
				irfStorageService.putJSON(formName, model);
				$state.go('Page.EngineOffline', {pageName: formName});
			}
		},
		submit: function(model, formCtrl, formName, actions) {
			$log.info("on systemSubmit");
			// entityManager.setModel(formName, null);
			$log.warn(formCtrl);
			if (formCtrl && formCtrl.$invalid) {
				irfProgressMessage.pop('form-error', 'Your form have errors. Please fix them.',5000);
				return false;
			}
			$log.warn('Going TO submit');
			actions.submit(model, formCtrl, formName);
			return true;
		},
    	getFileStreamAsDataURL: function(fileId, params,stripDescriptors) {
	        var deferred = $q.defer();
	        Files.getBase64DataFromFileId(fileId, params,stripDescriptors).then(function(fpData){
				deferred.resolve(fpData);
	        }, function(err){
				deferred.reject(err);
			});
	        return deferred.promise;
	    }

	};
}]);
