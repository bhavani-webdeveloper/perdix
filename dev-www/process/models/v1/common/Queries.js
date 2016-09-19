irf.models.factory('Queries',[
"$resource", "$httpParamSerializer", "BASE_URL", "$q", "$log",
function($resource,$httpParamSerializer,BASE_URL, $q, $log){
	var endpoint = BASE_URL + '/api';

	var resource =  $resource(endpoint, null, {
		query:{
			method:'POST',
			url:endpoint+'/query'
		}
	});

	resource.getResult = function(id, params, limit, offset) {
		return resource.query({identifier:id, limit:limit || 0, offset:offset || 0, parameters:params}).$promise;
	};

	resource.getPagesDefinition = function(userId, skip_relogin) {
		var deferred = $q.defer();
		resource.query({identifier:'userpages.list', limit: 0, offset: 0, parameters:{user_id:userId}, skip_relogin: skip_relogin || false}).$promise.then(function(records){
			if (records && records.results) {
				var def = {};
				_.each(records.results, function(v, k){
					var d = {
						"uri": v.uri,
						"offline": v.offline,
						"directAccess": v.directAccess,
						"title": v.title,
						"shortTitle": v.shortTitle,
						"iconClass": v.iconClass,
						"state": v.state,
						"stateParams": {
							"pageName": v.pageName,
							"pageId": v.pageId
						},
						"config": v.pageConfig
					};
					if (v.addlParams) {
						try {
							var ap = JSON.parse(v.addlParams);
							angular.extend(d.stateParams, ap);
						} catch (e) {}
					}
					if (v.pageConfig) {
						try {
							var pc = JSON.parse(v.pageConfig);
							d.config = pc;
						} catch (e) {}
					}
					def[v.uri] = d;
				});
				deferred.resolve(def);
			}
		}, deferred.reject);
		return deferred.promise;
	};

	resource.searchPincodes = function(pincode, district, state) {
		var deferred = $q.defer();
		var request = {"pincode":pincode || '', "district":district || '', "state":state || ''};
		resource.getResult("pincode.list", request, 10).then(function(records){
			if (records && records.results) {
				var result = {
					headers: {
						"x-total-count": records.results.length
					},
					body: records.results
				};
				deferred.resolve(result);
			}
		}, deferred.reject);
		return deferred.promise;
	};

	var prepareTranslationJSON = function(arr, langCode) {
		var result = {};
		for (var i = arr.length - 1; i >= 0; i--) {
			result[arr[i].code] = arr[i][langCode];
		};
		return result;
	};
	var translationResult = [];
	var translationLangs = {};
	resource.downloadTranslations = function() {
		var deferred = $q.defer();
		resource.getResult("translations.list", {}).then(function(records){
			if (records && records.results && records.results.length) {
				translationResult = records.results;
				deferred.resolve(translationResult);
			}
		}, deferred.reject);
		return deferred.promise;
	};
	resource.getTranslationJSON = function(translationResult, langCode) {
		if (!translationLangs[langCode] && translationResult && translationResult.length) {
			$log.info('all translation array avilable in memory for ' + langCode);
			translationLangs[langCode] = prepareTranslationJSON(translationResult, langCode);
		}
		return translationLangs[langCode];
	};

    resource.getLoanProductDocuments = function(prodCode, process, stage){
        var deferred = $q.defer();
        resource.getResult('loan_products.list', {product_code: prodCode, process:process, stage:stage}).then(
            function(res){
                if (res && res.results && res.results.length){
                    deferred.resolve(res.results);
                } else {
                    deferred.reject(res);
                }
            }, function(res){
                deferred.reject(res.data);
            }
        )
        return deferred.promise;
    }

    resource.getGlobalSettings = function(name){
        var deferred = $q.defer();
        resource.getResult('globalSettings.list', {name:name}).then(
            function(res){
            	$log.info("checking checking");
            	$log.info(res);
                if (res && res.results && res.results.length){
                    deferred.resolve(res.results[0].value);
                } else {
                    deferred.reject(res);
                }
            }, function(err){
                deferred.reject(err);
            }
        )
        return deferred.promise;
    }

    resource.getCustomerBankAccounts = function(customerId){
        var deferred = $q.defer();
		var request = {"customer_id":customerId};
		resource.getResult("customerBankAccounts.list", request, 10).then(function(records){
			if (records && records.results) {
				var result = {
					headers: {
						"x-total-count": records.results.length
					},
					body: records.results
				};
				deferred.resolve(result);
			}
		}, deferred.reject);
		return deferred.promise;
    }

    resource.getBankAccounts = function(){
        var deferred = $q.defer();
		var request = {};
		resource.getResult("bankAccounts.list", request, 10).then(function(records){
			if (records && records.results) {
				var result = {
					headers: {
						"x-total-count": records.results.length
					},
					body: records.results
				};
				deferred.resolve(result);
			}
		}, deferred.reject);
		return deferred.promise;
    }

    resource.getLatestLoanRepayment = function(accountNumber) {
    	var deferred = $q.defer();
    	resource.getResult("latestLoanRepayments.list", {account_number: accountNumber}, 1).then(function(records){
			if (records && records.results) {
				var result = {
					headers: {
						"x-total-count": records.results.length
					},
					body: records.results
				};
				deferred.resolve(result);
			}
    	}, deferred.reject);
    	return deferred.promise;
    };

    resource.getDepositList = function(depositUser){
        var deferred = $q.defer();
		var request = {"deposit_user":depositUser};
		resource.getResult("depositstage.list", request, 10).then(function(records){
			if (records && records.results) {
				var result = {
					headers: {
						"x-total-count": records.results.length
					},
					body: records.results
				};
				deferred.resolve(result);
			}
		}, deferred.reject);
		return deferred.promise;
    }

	return resource;
}]);
