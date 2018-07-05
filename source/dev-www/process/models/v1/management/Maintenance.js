irf.models.factory('Maintenance', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/maintenance';
        var biEndPoint= irf.BI_BASE_URL;

        var res = $resource(endpoint, null, {
            updateSpoke: {
                method: 'PUT',
                url: endpoint + '/centreMerger'
            },

            updateBranch: {
                method: 'PUT',
                url: endpoint + '/branchMerger'
            },

            getMasterData1: {
                method: 'GET',
                url: biEndPoint + '/upload_list.php'
            },

             getMasterData: searchResource({
                method: 'GET',
                url: biEndPoint + '/upload_list.php'
            }),

            getSequenceNumber: {
                method: 'GET',
                url: endpoint + '/getSequenceNumber?sequenceName=' + ':sequenceName',
                isNumber:  true
            }

        });

        res.masterDataUpload = function(file, progress, opts) {
            var deferred = $q.defer();
            reqData = {
                "file": file
            };
            Upload.upload({
                url: irf.BI_BASE_URL + "/upload.php?upload_name=" + opts.fileType,
                data: reqData
            }).then(function(resp){
                // TODO handle success
                console.log(resp);
                PageHelper.showProgress("page-init", "Done", 2000);
                deferred.resolve(resp);

            }, function(errResp){
                // TODO handle error
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        };
        res.taggingMasterDataUpload = function(file, progress, opts) {
            var deferred = $q.defer();
            reqData = {
                "file": file
            };
            Upload.upload({
                url: irf.MANAGEMENT_BASE_URL+"/server-ext" + "/generic_upload.php?upload_name=" + opts.fileType,
                data: reqData
            }).then(function(resp){
                // TODO handle success
                console.log(resp);
                PageHelper.showProgress("page-init", "Upload Successfull.", 5000);
                deferred.resolve(resp);

            }, function(errResp){
                // TODO handle error
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        };

        return res;
    }
]);