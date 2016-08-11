irf.models.factory('Files',function($resource,$httpParamSerializer,BASE_URL, $q, $http){
    var endpoint = BASE_URL + '/api';

    var resource =  $resource(endpoint, null, {
        uploadBase64:{
            method:'POST',
            url:endpoint+'/files/upload/base64'
            /* file, type, subType, extn */
        }/*,
        stream:{
            method:'GET',
            url:endpoint+'/stream/:fileId'
        }*/
    });

    var getDataUrl = function(fileId, params) {
        if ((fileId+'').indexOf('-') != -1) {
            return endpoint+'/stream/' + fileId;
        } else if (_.isNumber(fileId)) {
            return endpoint+'/stream/' + '?' + $httpParamSerializer(params);
        }
        return null;
    };

    resource.stream = function(fileId, params) {
        var deferred = $q.defer();
        $http.get(getDataUrl(fileId, params)).then(deferred.resolve, deferred.reject);
        return deferred.promise;
    };
    
    resource.getBase64DataFromFileId = function(fileId,params,stripDesctiptors){
        stripDesctiptors = stripDesctiptors || false;
        var url = getDataUrl(fileId,params);
        var deferred = $q.defer();
        $http({
            method:'GET',
            url:url,
            responseType: "blob"
        }).then(function(resp){

            var reader = new window.FileReader();
            reader.readAsDataURL(resp.data);
            reader.onloadend = function(){
                console.log(reader.result);
                if(stripDesctiptors){
                    deferred.resolve(reader.result.split(",")[1]);
                }
                else{
                    deferred.resolve(reader.result);
                }
            };

        },function(resp){
            deferred.reject(resp);
        });

        return deferred.promise;

    };

    return resource;
});
