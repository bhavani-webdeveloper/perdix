
irf.commons.value('RefCodeCache',{
	refCodes: null
});

irf.commons.factory("irfStorageService",
["$log","$q","ReferenceCodeResource","RefCodeCache", "SessionStore", "$filter", "Utils",
function($log,$q,rcResource,RefCodeCache, SessionStore, $filter, Utils){
	var masterUpdateRegistry = {};

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
	var processMasters = function(codes) {
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

		/** removing other bank branches, district **/
		var bankId = null;
		try {
			var bankName = SessionStore.getBankName();
			var bankId = null;
			try {
				bankId = $filter('filter')(classifiers['bank'].data, {name:bankName}, true)[0].code;
			} catch (e) {}
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
		return classifiers;
	};
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
		cacheAllMaster: function(isServer, forceFetch) {
			if (!masters || _.isEmpty(masters)) {
				masters = factoryObj.retrieveJSON('irfMasters');
			} else {
				$log.info('masters already in memory');
			}
			if (isServer) {
				$log.info('masters isServer');
				var deferred = $q.defer();
				try {
					var isSameDay = false;
					if (masters && masters._timestamp) {
						isSameDay = moment(masters._timestamp).startOf('day').isSame(moment(new Date().getTime()).startOf('day'));
					}
					if (forceFetch || !isSameDay) {
						rcResource.findAll(null).$promise.then(function(codes) {
							var _start = new Date().getTime();

							masters = processMasters(codes);
							masters._timestamp = new Date().getTime();
							factoryObj.storeJSON('irfMasters', masters);

							$log.info(masters);
							$log.info("Time taken to process masters (ms):" + (new Date().getTime() - _start));
							var masterUpdatePromises = [];
							_.forOwn(masterUpdateRegistry, function(v, k) {
								masterUpdatePromises.push(v.callback());
							});
							$q.all(masterUpdatePromises).then(function() {
								deferred.resolve("masters download complete");
							}, function(err) {
								deferred.reject(err);
							});
						});
					} else {
						deferred.resolve("It's the same day for Masters/ not downloading");
					}
				} catch (e) {
					deferred.reject(e);
				}
				return deferred.promise;
			}
		},
		getMaster: function(classifier) {
			return masters[classifier];
		},
		setMaster: function(classifier, master) {
			if (classifier && master) {
				masters[classifier] = master;
				factoryObj.storeJSON('irfMasters', masters);
			}
		},
		onMasterUpdate: function(callback) {
			var uuid = Utils.generateUUID();
			masterUpdateRegistry[uuid] = {
				"uuid": uuid,
				"callback": callback
			};
			return uuid;
		},
		removeMasterUpdate: function(uuid) {
			var a = !!masterUpdateRegistry[uuid];
			delete masterUpdateRegistry[uuid];
			return a;
		}
	};
	return factoryObj;
}]);

irf.commons.factory("formHelper",
["$log", "$state", "irfStorageService", "SessionStore", "entityManager", "irfProgressMessage",
"$filter", "Files", "$q", "elementsUtils", "$timeout", "Utils",
function($log, $state, irfStorageService, SessionStore, entityManager, irfProgressMessage,
	$filter, Files, $q, elementsUtils, $timeout, Utils){
	var helperObj = {
		enum: function(key) {
			// console.warn(key);
			var r = irfStorageService.getMaster(key);
			

			/* Special Handling for custom (derived) enum Codes */
			// if (r==null){
			// 	switch(key){
			// 		case "branch_code":
			// 			var r= irfStorageService.getMaster('branch');
			// 			break;
			// 		case "centre_code":
			// 			var r= irfStorageService.getMaster('centre');
			// 			break;			
			// 		case "loan_product_frequency":
			// 			var r= irfStorageService.getMaster('frequency');
			// 			break;
			// 		// case "branch_id":
			// 		// 	var r= irfStorageService.getMaster('branch');
			// 		// 	break;
			// 		case "jlg_loan_product":
			// 			var r= irfStorageService.getMaster('loan_product');
			// 			break;
			// 		case "groupLoanStages":
			// 			var r= irfStorageService.getMaster('groupLoanBackStages');
			// 		break;		
			// 	}
			// }

			if (r && _.isArray(r.data)) {
				var ret = {parentClassifier:r.parentClassifier,data:[]};
				ret.data = r.data;
				return ret;
			}
			$log.error('No record found for enum key: ' + key);
			return null;
		},
		save: function(model, formCtrl, formName, actions) {
			var pageName = formName.substring(6).replace(/\_/g, '.').replace(/\.\./g, '__');
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
				irfStorageService.putJSON(pageName, model);
				$state.go('Page.EngineOffline', {pageName: pageName});
			}
		},
		submit: function(model, formCtrl, formName, actions) {
			$log.info("on systemSubmit");
			// entityManager.setModel(formName, null);
			//$log.warn(formCtrl);
			if (formCtrl && formCtrl.$invalid) {
				irfProgressMessage.pop('form-error', 'Your form have errors. Please fix them.',5000);
				return false;
			}
			$log.warn('Going TO submit');
			actions.submit(model, formCtrl, formName);
			return true;
		},
		validate: function(formCtrl) {
			var deferred = $q.defer();
			if (!formCtrl) {
				deferred.reject();
			}else {
				$timeout(function(){
					formCtrl.scope.$broadcast('schemaFormValidate');
					if (formCtrl.$valid) {
						deferred.resolve();
					} else {
						irfProgressMessage.pop('form-error', 'Your form have errors. Please fix them.',5000);
						deferred.reject();
					}
				});
			}
			return deferred.promise;
		},
		getFileStreamAsDataURL: function(fileId, params,stripDescriptors) {
			return Files.getBase64DataFromFileId(fileId, params,stripDescriptors);
		},
		resetFormValidityState: function(formCtrl){
			formCtrl.$setPristine();
		},
		isOffline: function() {
			return SessionStore.session.offline;
		},
		newOffline: {
			getKey: function(pageName) {
				return "NewOffline_" + pageName.replace(/\./g, '$');
			},
			saveOffline: function(pageName, item) {
				irfStorageService.putJSON(this.getKey(pageName), item);
			},
			getOfflineRecords: function(pageName) {
				var items = irfStorageService.getMasterJSON(this.getKey(pageName));
				var offlineItems = [], idx = 0;
				_.forOwn(items, function(value, key) {
					offlineItems[idx] = value;
					idx++;
				});
				$log.info(offlineItems);
				return offlineItems;
			},
			openOfflineRecord: function(pageName, item) {
				entityManager.setModel(pageName, item.model);
				$state.go('Page.Engine', {
					pageName: pageName,
					pageId: item.pageId,
					pageData: item.pageData
				});
			},
			deleteOfflineRecord: function(pageName, item) {
				var deferred = $q.defer();
				Utils.confirm("Are You Sure?").then(function() {
					irfStorageService.deleteJSON(helperObj.newOffline.getKey(pageName), item.$$STORAGE_KEY$$);
					deferred.resolve();
				}, deferred.reject);
				return deferred.promise;
			}
		}
	};
	return helperObj;
}]);


irf.commons.run(["irfStorageService", "SessionStore", "$q", "$log", "$filter",
    function(irfStorageService, SessionStore, $q, $log, $filter) {
    	/* Special Handling for custom (derived) enum Codes */
        irfStorageService.onMasterUpdate(function() {
        	var specialHandleEnumCodes = [
        	'bank', 
        	'loan_product', 
        	'centre',  
        	'village',
        	"branch_id",
        	"branch_code", 
        	"centre_code", 
        	"loan_product_frequency", 
        	"jlg_loan_product", 
        	"groupLoanStages", 
        	'partner', 
        	'p2p_customer_category', 
        	'creditBureauTypes', 
        	"groupLoanStages"
        	]
        	var r;
            var ret;
            var branchId = ""+SessionStore.getBranchId();
        	for (var itr = 0; itr < specialHandleEnumCodes.length; itr++) {
	            switch (specialHandleEnumCodes[itr]) {
		            case 'branch_id':
			            r = irfStorageService.getMaster("branch");
			            break;
		            case 'bank':
		            	r = irfStorageService.getMaster("bank");
						break;
					case 'loan_product':
						r = irfStorageService.getMaster("loan_product");
						break;
					case 'centre':
						r = irfStorageService.getMaster("centre");
						break;
					case 'centre_code':
						r = irfStorageService.getMaster("centre");
						break;		
		            case 'village':
		                console.log("branchid:"+branchId);
		                r = irfStorageService.getMaster("village");
		                break;
					case 'branch_code':
						r = irfStorageService.getMaster("branch");
						break;
					case 'loan_product_frequency':
						r = irfStorageService.getMaster("frequency");
						break;	
					case 'partner':
						r = irfStorageService.getMaster("partner");
						break;
					case 'p2p_customer_category':
						r = irfStorageService.getMaster("p2p_customer_category");
			            break;
			        case "jlg_loan_product":
				        r = irfStorageService.getMaster("loan_product");
			            break;
			        case 'creditBureauTypes':
			        	r = irfStorageService.getMaster("creditBureauTypes");
						break;
					case "groupLoanStages":
						r = irfStorageService.getMaster("groupLoanBackStages");
						break;
					default:
						break;
				}
				if (r && _.isArray(r.data)) {
					ret = {parentClassifier:r.parentClassifier,data:[]};
					switch (specialHandleEnumCodes[itr]) {
			            case 'branch_id':
				            ret.data = _.cloneDeep(r.data);
				            for (var i=0 ;i<ret.data.length; i++){
				                ret.data[i].value = Number(ret.data[i].code);
				            }
				            break;
			            case 'bank':
							ret.data = _.cloneDeep(r.data);
							for(var i = 0; i < ret.data.length; i++) {
								ret.data[i].value = Number(ret.data[i].code);
							}
							break;
						case 'loan_product':
							ret.data = _.cloneDeep(r.data);
							for(var i = 0; i < ret.data.length; i++) {
								ret.data[i].value = ret.data[i].field1.toString().trim();
							}
							break;
						case 'centre':
							ret.data = _.cloneDeep(r.data);
							for(var i = 0; i < ret.data.length; i++) {
			                    ret.data[i].value = Number(ret.data[i].code);
							}
			                // console.warn(ret);
							break;
						case 'centre_code':
							ret.data = _.cloneDeep(r.data);
							for(var i = 0; i < ret.data.length; i++) {
			                    ret.data[i].value = ret.data[i].field3;
							}
			                // console.warn(ret);
							break;		
			            case 'village':
			                console.log("branchid:"+branchId);
							ret.data = r.data = $filter('filter')(r.data, {parentCode:branchId}, true);
							$log.warn('village:'+ret.data.length);
							break;
						case 'branch_code':
							ret.data = _.cloneDeep(r.data);
							for (var i=0; i<ret.data.length; i++){
								ret.data[i].value = ret.data[i].field1;
							}
							break;
						case 'loan_product_frequency':
							ret.data = _.cloneDeep(r.data);
							for (var i=0; i<ret.data.length; i++){
								ret.data[i].value = ret.data[i].field1;
							}
							break;	
						case 'partner':
							ret.data = _.cloneDeep(r.data);
							for(var i = 0; i < ret.data.length; i++) {
								ret.data[i].value = ret.data[i].code;
							}
							// console.warn(ret);
							break;
						case 'p2p_customer_category':
				            ret.data = _.cloneDeep(r.data);
				            for (var i = 0; i< ret.data.length; i++){
				              ret.data[i].value = ret.data[i].code;
				            }
				            break;
				        case "jlg_loan_product":
				        	ret.data = $filter('filter')(r.data, {field2:'JLG'}, true);
				            for (var i = 0; i< ret.data.length; i++){
				              ret.data[i].value = ret.data[i].field1.toString().trim();
				            }
				            break;
				        case 'creditBureauTypes':
							ret.data = _.cloneDeep(r.data);
							for(var i = 0; i < ret.data.length; i++) {
								ret.data[i].value = ret.data[i].code;
							}
							break;
						case "groupLoanStages":
							ret.data = _.cloneDeep(r.data);
							var filterData = [] , names = [];
							for(var i = 0; i < ret.data.length; i++) {
								if(names.indexOf(ret.data[i].code) > -1)
									continue;
								ret.data[i].value = ret.data[i].code;
								filterData.push(ret.data[i]);
								names.push(ret.data[i].code);
								
							}
							ret.data = filterData;
							break;
						default:
							ret.data = r.data;
							break;
					}
				irfStorageService.setMaster(specialHandleEnumCodes[itr], ret);
				}
			}
            return $q.resolve();
        });
    }
]);