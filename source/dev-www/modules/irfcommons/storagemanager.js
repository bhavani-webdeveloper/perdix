irf.commons.value('RefCodeCache',{
	refCodes: null
});

function localStorageAsJSON(key) {
	return JSON.parse(LZString.decompress(localStorage.getItem(key)))
};

irf.commons.factory("irfStorageService",
["$log","$q","ReferenceCodeResource","RefCodeCache", "SessionStore", "$filter", "Utils",
function($log,$q,rcResource,RefCodeCache, SessionStore, $filter, Utils){
	var masterUpdateRegistry = {};

	var retrieveItem = function(key) {
		return LZString.decompress(localStorage.getItem(key));
	};
	var storeItem = function(key, value) {
		localStorage.setItem(key, LZString.compress(value));
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
			var userRole = SessionStore.getUserRole();
			if (!(userRole && userRole.accessLevel && userRole.accessLevel < 10)) {
				var bankName = SessionStore.getBankName();
				var bankId = null;
				try {
					bankId = $filter('filter')(classifiers['bank'].data, {name:bankName}, true)[0].code;
				} catch (e) {}
				if (bankId) {
					classifiers['branch'].data = $filter('filter')(classifiers['branch'].data, {parentCode:bankId}, true);
					classifiers['district'].data = $filter('filter')(classifiers['district'].data, {parentCode:bankId}, true);
				}
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

irf.commons.provider("formHelper", function() {
	var context = {};
	var $this = this;
	var listToTree = function(list, id, parentId) { // credits: https://stackoverflow.com/users/722762/halcyon
		var map = {}, node, roots = [], i;
		for (i = 0; i < list.length; i++) {
			map[list[i][id]] = i; // initialize the map
			list[i].children = []; // initialize the children
		}
		for (i = 0; i < list.length; i++) {
			node = list[i];
			if (node[parentId] && node[parentId] !== "0") {
				// if you have dangling branches check that map[node[parentId]] exists
				list[map[node[parentId]]].children.push(node);
			} else {
				roots.push(node);
			}
		}
		return roots;
	}
	$this.factory = {
		enum: function(key) {
			var r = context.irfStorageService.getMaster(key);
			
			if (r && _.isArray(r.data)) {
				var ret = {parentClassifier:r.parentClassifier,data:[]};
				ret.data = r.data;
				return ret;
			}
			context.$log.error('No record found for enum key: ' + key);
			return null;
		},
		userbranch: function() {
			var branches = $this.factory.enum("branch_id").data;
			var userbranches = context.SessionStore.getItem("UserAllowedBranches").map(x => ''+x.branchId);
			userbranches.unshift(''+context.SessionStore.session.branchId);
			var branchTree = _.cloneDeep(branches);
			var id = "code", parentId = "field2";
			var roots = listToTree(branchTree, id, parentId);
			var userBranchTree = branchTree.filter(branch => userbranches.indexOf(branch[id]) >= 0);
			userBranchTree.branchMap = branches.reduce((map, current) => {map[current[id]] = current; return map}, {});
			return userBranchTree;
		},
		save: function(model, formCtrl, formName, actions) {
			var pageName = formName.substring(6).replace(/\_/g, '.').replace(/\.\./g, '__');
			var promise = true;
			if (angular.isFunction(actions.preSave)) {
				promise = actions.preSave(model, formCtrl, formName);
				if (promise && _.isFunction(promise.then)) {
					promise.then(function(){
						context.irfStorageService.putJSON(pageName, model);
						context.$state.go('Page.EngineOffline', {pageName: pageName});
					}).catch(function(){
						// nothing to do
					});
				}
			} else {
				context.irfStorageService.putJSON(pageName, model);
				context.$state.go('Page.EngineOffline', {pageName: pageName});
			}
		},
		submit: function(model, formCtrl, formName, actions) {
			context.$log.info("on systemSubmit");
			// context.entityManager.setModel(formName, null);
			//context.$log.warn(formCtrl);
			if (formCtrl && formCtrl.$invalid) {
				context.irfProgressMessage.pop('form-error', 'Your form have errors. Please fix them.',5000);
				return false;
			}
			context.$log.warn('Going TO submit');
			actions.submit(model, formCtrl, formName);
			return true;
		},
		validate: function(formCtrl) {
			var deferred = context.$q.defer();
			if (!formCtrl) {
				deferred.reject();
			}else {
				context.$timeout(function(){
					formCtrl.scope.$broadcast('schemaFormValidate');
					if (formCtrl.$valid) {
						deferred.resolve();
					} else {
						context.irfProgressMessage.pop('form-error', 'Your form have errors. Please fix them.',5000);
						deferred.reject();
					}
				});
			}
			return deferred.promise;
		},
		getFileStreamAsDataURL: function(fileId, params,stripDescriptors) {
			return context.Files.getBase64DataFromFileId(fileId, params,stripDescriptors);
		},
		resetFormValidityState: function(formCtrl){
			formCtrl.$setPristine();
		},
		isOffline: function() {
			return context.SessionStore.session.offline;
		},
		getPageData: function() {
			context.$stateParams.pageData = context.$stateParams.pageData || {};
			return context.$stateParams.pageData;
		},
		newOffline: {
			getKey: function(pageName) {
				return "NewOffline_" + pageName.replace(/\./g, '$');
			},
			saveOffline: function(pageName, item) {
				context.irfStorageService.putJSON(this.getKey(pageName), item);
			},
			getOfflineRecords: function(pageName) {
				var items = context.irfStorageService.getMasterJSON(this.getKey(pageName));
				var offlineItems = [], idx = 0;
				_.forOwn(items, function(value, key) {
					offlineItems[idx] = value;
					idx++;
				});
				context.$log.info(offlineItems);
				return offlineItems;
			},
			openOfflineRecord: function(pageName, item) {
				context.entityManager.setModel(pageName, item.model);
				context.$state.go('Page.Engine', {
					pageName: pageName,
					pageId: item.pageId,
					pageData: item.pageData
				});
			},
			deleteOfflineRecord: function(pageName, item) {
				var deferred = context.$q.defer();
				context.Utils.confirm("Are You Sure?").then(function() {
					context.irfStorageService.deleteJSON($this.factory.newOffline.getKey(pageName), item.$$STORAGE_KEY$$);
					deferred.resolve();
				}, deferred.reject);
				return deferred.promise;
			},
			deleteOffline: function(pageName, model) {
				model.$$STORAGE_KEY$$ && context.irfStorageService.deleteJSON($this.factory.newOffline.getKey(pageName), model.$$STORAGE_KEY$$);
			}
		}
	};
	this.$get = ["$log", "$state", "irfStorageService", "SessionStore", "$state", "$stateParams", "entityManager", "irfProgressMessage",
	"Files", "$q", "$timeout", "Utils",
	function($log, $state, irfStorageService, SessionStore, $state, $stateParams, entityManager, irfProgressMessage,
	Files, $q, $timeout, Utils) {
		context.$log = $log;
		context.$state = $state;
		context.irfStorageService = irfStorageService;
		context.SessionStore = SessionStore;
		context.$stateParams = $stateParams;
		context.entityManager = entityManager;
		context.irfProgressMessage = irfProgressMessage;
		context.Files = Files;
		context.$q = $q;
		context.$timeout = $timeout;
		context.Utils = Utils;
		return $this.factory;
	}];
});

irf.commons.run(["irfStorageService", "SessionStore", "$q", "$log", "filterFilter",
	function(irfStorageService, SessionStore, $q, $log, filterFilter) {
		/* Special Handling for custom (derived) enum Codes */

		var createEnum = function(enumCode, copyFrom, converter) {
			var source = irfStorageService.getMaster(copyFrom);
			if (source && _.isArray(source.data)) {
				var output = {parentClassifier:source.parentClassifier,data:[]};
				output.data = _.cloneDeep(source.data);
				converter(source, output);
				irfStorageService.setMaster(enumCode, output);
			}
		};

		irfStorageService.onMasterUpdate(function() {
			var branchId = ""+SessionStore.getBranchId();

			var codeToValue = function(s, o) {
				for (i in o.data) {
					o.data[i].value = o.data[i].code;
				}
			};
			var codeAsNumberToValue = function(s, o) {
			
				for (i in o.data) {
					o.data[i].value = Number(o.data[i].code);
				}
			};

			createEnum("bank", "bank", codeAsNumberToValue);
			createEnum("centre", "centre", codeAsNumberToValue);
			createEnum("hub_master", "hub_master", codeAsNumberToValue);
			createEnum("district_master1", "district_master1", codeAsNumberToValue);
			createEnum("state_master1", "state_master1", codeAsNumberToValue);
			createEnum("branch_id", "branch", codeAsNumberToValue);
			createEnum("mutualFundScheme", "mutualFundScheme", codeAsNumberToValue);
			createEnum("loan_product", "loan_product", function(s, o) {
				for (i in o.data) {
					o.data[i].value = o.data[i].field1.toString().trim();
				}
			});
			createEnum("village", "village", function(s, o) {
				o.data = filterFilter(o.data, {parentCode:branchId}, true);
			});
			createEnum("branch_code", "branch", function(s, o) {
				for (i in o.data) {
					o.data[i].value = o.data[i].field1;
				}
			});
			createEnum("centre_code", "centre", function(s, o) {
				for (i in o.data) {
					o.data[i].value = o.data[i].field3;
				}
			});
			createEnum("usercentre", "centre", function(s, o) {
				var uc = SessionStore.getCentres().reduce(function(map, obj) { map[obj.id] = true; return map }, {});
				o.data = filterFilter(o.data, function(a, p) { return uc[a.value] });
			});
			createEnum("userbranches", "branch_id", function(s, o) {
				var userbranches= SessionStore.getItem("UserAllowedBranches");
				userbranches.push({"branchId":SessionStore.getCurrentBranch().branchId});
				var uc = userbranches.reduce(function(map, obj) { map[obj.branchId] = true; return map }, {});
				o.data = filterFilter(o.data, function(a, p) { return uc[a.value] });
			});
			createEnum("loan_product_frequency", "frequency", function(s, o) {
				for (i in o.data) {
					o.data[i].value = o.data[i].field1;
				}
			});
			createEnum("jlg_loan_product", "loan_product", function(s, o) {
				o.data = filterFilter(o.data, {field2:'JLG'}, true);
				for (i in o.data) {
					o.data[i].value = o.data[i].field1.toString().trim();
				}
			});
			createEnum("groupLoanStages", "groupLoanBackStages", function(s, o) {
				var filterData = [] , names = [];
				for (i in o.data) {
					if(names.indexOf(o.data[i].code) > -1)
						continue;
					o.data[i].value = o.data[i].code;
					filterData.push(o.data[i]);
					names.push(o.data[i].code);
				}
				o.data = filterData;
			});
			createEnum("partner", "partner", codeToValue);
			createEnum("p2p_customer_category", "p2p_customer_category", codeToValue);
			createEnum("creditBureauTypes", "creditBureauTypes", codeToValue);
			createEnum("origination_stage", "origination_stage", codeToValue);
			createEnum("investor_id", "investor_id", codeAsNumberToValue);
			createEnum("lender_product_type", "lender_product_type", codeToValue)


			return $q.resolve();
		});
	}
]);