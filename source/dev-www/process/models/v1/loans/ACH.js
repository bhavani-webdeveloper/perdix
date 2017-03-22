irf.models.factory('ACH', 
["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/ach';
        var endpintManagement = irf.MANAGEMENT_BASE_URL + '/server-ext/achdemandlist.php?';
        var endpintManagementACHPDC = irf.MANAGEMENT_BASE_URL + '/server-ext/achpdcdemandlist.php?';
        /*
         * $get : /api/enrollments/{blank/withhistory/...}/{id}
         *  eg: /enrollments/definitions -> $get({service:'definition'})
         *      /enrollments/1           -> $get({id:1})
         * $post will send data as form data, save will send it as request payload
         */
        var resource = $resource(endpoint, null, {
            getSchema: {
                method: 'GET',
                url: 'process/schemas/ach.json'
            },
            create: {
                method: 'POST',
                url: endpoint + '/create'
            },
            search: searchResource({
                method: 'GET',
                url: endpoint + '/search'
                // transformResponse: function(data, headersGetter, status){
                //     var deferred = $q.defer();
                //     data = JSON.parse(data);
                //     if (status === 200){
                //         if (_.hasIn(data, 'maximumAmount') && _.isString(data['maximumAmount'])){
                //             data.maximumAmount = parseInt(data['maximumAmount']);
                //             alert(data.maximumAmount);
                //         }
                //     }
                //     return data;
                // }
            }),
            searchHead: {
                method: 'HEAD',
                url: endpoint + '/search',
                isArray: true
            },
            updateMandateStatus: {
                method: 'PUT',
                isArray:true,
                url: endpoint + '/statusupdate'
            },
            ACHClose: {
                method: 'PUT',
                url: endpoint + '/closeACHMandate'
            },
            getDemandList: searchResource({
                method: 'GET',
                url: endpoint + '/achdemandList'
            }),
            bulkRepay:  searchResource({
                method: 'POST',
                url: endpoint + '/achbulkrepay'
            }),
            demandDownloadStatus: searchResource({
                method: 'GET',
                url: endpintManagement + "demandDate=:demandDate&branchId=:branchId"
            }),
            achpdcDemandDownload: searchResource({
                method: 'GET',
                url: endpintManagementACHPDC + "demandDate=:demandDate&branchId=:branchId"
            })
        });

        resource.achMandateUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: BASE_URL + "/api/feed/achmandateupload",
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

         resource.monthlyDemandUpload = function(file, progress, opts) {
            var deferred = $q.defer();
            opts=opts || {};
            opts.file=file;
            Upload.upload({
                url: "http://devkinara.perdix.in:8081/testphp/upload.php",
                data: opts
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

        resource.achDemandListUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: BASE_URL + "/api/feed/achreversefeedupload",
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