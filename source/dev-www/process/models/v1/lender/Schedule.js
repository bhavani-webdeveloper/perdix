irf.models.factory('Schedule', 
["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/liablitySchedule';
        var lenderAccountNumb = '/find?lenderAccountNumber='
        /*
         * $get : /api/enrollments/{blank/withhistory/...}/{id}
         *  eg: /enrollments/definitions -> $get({service:'definition'})
         *      /enrollments/1           -> $get({id:1})
         * $post will send data as form data, save will send it as request payload
         */
        var resource = $resource(endpoint, null, {
            scheduleUploads: {
                method: 'POST',
                //url: 'endpoint' + '/uploadLiablityScheduleDetails'
            },
            getLiabilitySchedule :{
                method:'GET',
                url: endpoint + lenderAccountNumb + ':id',
                isArray:true
            }
        });
        resource.scheduleUpload = function(file, progress, id) {
            var deferred = $q.defer();
            Upload.upload({
                url: endpoint + '/uploadLiablityScheduleDetails?lenderAccountNumber='+id,
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