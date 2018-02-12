irf.models.factory('RolesPages', function($resource, $httpParamSerializer, searchResource) {
    var endpoint = irf.MANAGEMENT_BASE_URL + "/user-management";

    var res = $resource(endpoint, null, {
        allRoles: searchResource({
            method: 'GET',
            url: endpoint + '/allRoles.php'
        }),
        allPages: searchResource({
            method: 'GET',
            url: endpoint + '/allPages.php'
        }),
        updateRolePageAccess: {
            method: 'PUT',
            url: endpoint + '/updateRolePageAccess.php'
        },
        updateRoleReportAccess: {
            method: 'PUT',
            url: endpoint + '/updateRoleReports.php'
        },
        updateRole: {
            method: 'PUT',
            url: endpoint + '/updateRole.php'
        },
        getPage: {
            method: 'GET',
            url: endpoint + '/getPage.php'
        },
        getReportsByRole: searchResource({
            method: 'GET',
            url: endpoint + '/getReportsByRole.php'
        }),
        searchUsers: searchResource({
            method: 'GET',
            url: endpoint + '/findUsers.php'
        }),
        updateUserRole: {
            method: 'PUT',
            url: endpoint + '/updateUserRole.php'
        }
    });

    return res;
});

irf.pageCollection.run(["irfStorageService", "$q", "RolesPages",
function(irfStorageService, $q, RolesPages) {
    irfStorageService.onMasterUpdate(function() {
        var deferred = $q.defer();
        RolesPages.allRoles().$promise.then(function(res) {
            var rolesTitleMap = [];
            for (i in res.body) {
                rolesTitleMap.push({
                    "name": res.body[i].name,
                    "value": res.body[i].id,
                    "accessLevel": res.body[i].accessLevel
                });
            }
            irfStorageService.setMaster("roles", {"data":rolesTitleMap});
            deferred.resolve();
        }, deferred.reject);
        return deferred.promise;
    });
}]);