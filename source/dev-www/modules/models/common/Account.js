irf.models.factory('Account',
["$resource", "$httpParamSerializer", "BASE_URL", "$q", "SessionStore", "formHelper", "$filter",
function($resource,$httpParamSerializer,BASE_URL, $q, SessionStore, formHelper, $filter){
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
            url: userManagementEndpoint + '/getRole.php'
        },
        getAnalyticsToken: {
            method: 'GET',
            url: endpoint + '/analyticsToken',
            transformResponse: function(data, headersGetter, status) {
                if (status === 200 && data) {
                    return {'analyticsToken': data};
                }
            }
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
    },

    resource.getHomeBranchForUser = function(){
        var branches = formHelper.enum('branch').data;
        var homeBranchUnit = $filter('filter')(branches, {name : SessionStore.getHomeBranchName()}, true);
        var homeBranchObj = {branchName : "", branchCode : "", branchId : ""};

        if(angular.isDefined(homeBranchUnit) && angular.isArray(homeBranchUnit) && homeBranchUnit.length > 0 )
        {
            homeBranchObj.branchName = homeBranchUnit[0].name;
            homeBranchObj.branchCode = homeBranchUnit[0].field1;
            homeBranchObj.branchId = parseInt(homeBranchUnit[0].code);
        }

        return homeBranchObj;
    }

    return resource;
}]);
