irf.models.factory('Account',
["$resource", "$httpParamSerializer", "BASE_URL", "$q",
function($resource,$httpParamSerializer,BASE_URL, $q){
    var endpoint = BASE_URL + '/api/account';
    var userManagementEndpoint = irf.MANAGEMENT_BASE_URL + "/user-management";
    /*
     * :service can be {change_expired_password,change_password,reset_password}
     * :action can be {init,finish}
     *
     * POST and SAVE are eqvt
     *
     * eg:
     * /api/account/change_expired_password => {service:'change_expired_password'}
     * /api/account/reset_password/init => {service:'reset_password',action:'init'}
     *
     */

    var resource = $resource(endpoint, null, {
        get:{
            method:'GET',
            url:endpoint
        },
        query:{
            method:'GET',
            url:endpoint,
            isArray:true
        },
        post:{
            method:'POST',
            url:endpoint+'/:service/:action'

        },
        save:{
            method:'POST',
            url:endpoint+'/:service/:action'
        },
        getCentresForBranch: {
            method: 'GET',
            url: BASE_URL + '/api/enrollments/centres/:branchId',
            isArray: true
        },
        changeExpiredPassword: {
            method: 'POST',
            url: endpoint + '/change_expired_password',
            headers: {
                $no_auth: true
            }
        },
        getUserRole: {
            method: 'GET',
            url: userManagementEndpoint + 'getRole.php'
        }
    });

    resource.getCentresForUser = function(branchId, userId) {
        var deferred = $q.defer();
        resource.getCentresForBranch({"branchId":branchId}).$promise.then(function(response) {
            if (response && response.length) {
                var centres = [];
                for (var i = 0; i < response.length; i++) {
                    if (response[i].employee == userId) {
                        centres.push(_.clone(response[i]));
                    }
                };
                deferred.resolve(centres);
            } else {
                deferred.reject(response);
            }
        }, deferred.reject);
        return deferred.promise;
    }

    return resource;
}]);
