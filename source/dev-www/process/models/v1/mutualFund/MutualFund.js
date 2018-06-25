irf.models.factory('MutualFund', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {



        var endpoint = BASE_URL + '/api/mutualFund';
        var camsendpoint = irf.CAMS_EKYC_INTEG_URL;
        var resource = $resource(endpoint, null, {

            createApplication: {
                method: 'POST',
                url: endpoint + '/application'
            },
            purchaseOrRedemption: {
                method: 'POST',
                url: endpoint + '/purchaseOrRedemption'
            },
            logRecords: {
                method: 'GET',
                url: endpoint + '/mutualFundFileExchangeLog',
                isArray: true
            },
            /*navFileUpload: {
            	method: 'POST',
            	url: endpoint+ '/navFileUpload'
            },*/
            download: {
                method: 'GET',
                url: endpoint + '/purchaseOrRedemptionForwardFeedDownload'

            },
            /*reverseFeedUpload: {
            	method: 'POST',
            	url: endpoint + '/reverseFeedUpload'
			
            },*/
            schemeDetails: {
                method: 'GET',
                url: endpoint + '/schemeMaster'

            },
            summary: {
                method: 'GET',
                url: endpoint + '/summary/:id',
                isArray: true
            },
            transaction: {
                method: 'GET',
                url: endpoint + '/transaction'
            },
            getFileId: {
                method: 'GET',
                url: endpoint + '/mutualFundFileExchangeLog',
                isArray: true
            },
            camsInteg: {
                method: 'POST',
                url: camsendpoint
            }

        });

        resource.navFileUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: BASE_URL + "/api/mutualFund/navFileUpload",
                data: {
                    file: file
                }
            }).then(function(resp) {
                // TODO handle success
                PageHelper.showProgress("page-init", "successfully uploaded.", 2000);
                deferred.resolve(resp);
            }, function(errResp) {
                // TODO handle error
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        };

        resource.reverseFeedUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: endpoint + "/reverseFeedUpload",
                data: {
                    file: file
                }
            }).then(function(resp) {
                // TODO handle success
                PageHelper.showProgress("page-init", "successfully uploaded.", 2000);
                deferred.resolve(resp);
            }, function(errResp) {
                // TODO handle error
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        }

        return resource;
    }


]);