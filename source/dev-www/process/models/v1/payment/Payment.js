    irf.models.factory('Payment', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
    	var endpoint = BASE_URL + '/api/payments';
    	var resource = $resource(endpoint, null, {
    		get: {
                method: 'GET',
                url: endpoint+"/:id"
            },
            create: {
                method: 'POST',
                url: endpoint
            },
            update: {
                method: 'PUT',
                url: endpoint
            },
            search: searchResource({
                method: 'GET',
                url: endpoint
            }),
            createBatch: {
            	method: 'PUT',
            	url: endpoint + '/dispatchment'
            },
            paymentConformation:{
                method:'POST',
                url: endpoint + 'uploadDepositResponseFile'
            },
            getSchema:{
                method:'GET',
                url:'process/schemas/:name'
            },
        });
        resource.paymentConformation = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: endpoint + '/uploadDepositResponseFile',
                data: {
                    file: file
                }
            }).then(function(resp){
                // TODO handle success
                PageHelper.showProgress("page-init", "Done.", 2000);
                deferred.resolve(resp);
            }, function(errResp){
                // TODO handle error
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        };
        return resource;
    }
	]);