irf.models.factory('ExcelUpload', [
   "$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL;
        var managementUrl= irf.MANAGEMENT_BASE_URL;

        var resource = $resource(endpoint, null, {
            getLeadSchema: {
                method: 'GET',
                url: 'process/schemas/Leadgeneration.json'
            }
        });

        resource.ExcelFileUpload = function(file, progress, key) {
            var deferred = $q.defer();
            Upload.upload({
                url: managementUrl + "/server-ext/generic_excel_upload.php?key=" + key,
                data: {
                    "file": file
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


        return resource;
    }
]);