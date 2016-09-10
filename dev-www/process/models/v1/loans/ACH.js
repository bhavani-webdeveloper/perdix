irf.models.factory('ACH', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q) {
        var endpoint = BASE_URL + '/api/ach';
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
            }),
            searchHead: {
                method: 'HEAD',
                url: endpoint + '/search',
                isArray: true
            },
            update: {
                method: 'PUT',
                url: endpoint + '/update'
            }
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
                deferred.resolve(resp);
            }, function(errResp){
                // TODO handle error
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        }

        return resource;
    }
]);