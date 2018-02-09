irf.models.factory('User', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "irfStorageService",
function($resource, $httpParamSerializer, BASE_URL, searchResource, irfStorageService) {
    var endpoint = BASE_URL + '/api/users';
    var resource = $resource(endpoint, null, {
        query: searchResource({
            method: 'GET',
            url: endpoint
        }),
        get: {
            method: "GET",
            url: endpoint + "/:user_id"
        },
        update: {
            method: "PUT",
            url: endpoint
        },
        create: {
            method: "POST",
            url: endpoint
        },
        logout: {
            method: "POST",
            url: BASE_URL + "/api/admin/forceLogout/:userId"
        },
        lock: {
            method: "POST",
            url: BASE_URL + "/api/admin/lock"
        },
        unlock: {
            method: "POST",
            url: BASE_URL + "/api/admin/unlock/"
        }
    });

    resource.offline = {
        getUser: function(userId) {
            var au = irfStorageService.getMaster("ALL_USERS");
            return (au && au[userId])? {
                "userId": userId,
                "userName": au[userId].n,
                "roleId": au[userId].r,
                "branchId": au[userId].b
            }: false;
        },
        getUsername: function(userId) {
            var au = irfStorageService.getMaster("ALL_USERS");
            return (au && au[userId] && au[userId].n)? au[userId].n: userId;
        },
        getDisplayName: function(userId) {
            var au = irfStorageService.getMaster("ALL_USERS");
            return (au && au[userId] && au[userId].n)? au[userId].n + ' (' + userId + ')': userId;
        }
    };

    return resource;
}]);

irf.pageCollection.run(["irfStorageService", "User", "PageHelper", "$q", "$log", "Utils", "SysQueries",
function(irfStorageService, User, PageHelper, $q, $log, Utils, SysQueries) {
    if (irf.appConfig.OFFLINE_USERS && (irf.appConfig.OFFLINE_USERS == "mobile" && Utils.isCordova() || irf.appConfig.OFFLINE_USERS == "all")) {
        irfStorageService.onMasterUpdate(function() {
            var deferred = $q.defer();

            var reject = function(error) {
                PageHelper.showProgress("all-users", "Failed to download all users", 2000);
                $log.error(error);
                deferred.reject();
            }

            SysQueries.query({identifier:'allusers.list', limit: 0, offset: 0, parameters: {}}).$promise.then(function(records){
                if (records && records.results && records.results.length) {
                    var userMap = records.results.reduce(function(map, val, i) {
                        map[val.i] = {
                            n: val.n,
                            r: val.r,
                            b: val.b
                        };
                        return map;
                    }, {});
                    irfStorageService.setMaster("ALL_USERS", userMap);
                    PageHelper.showProgress("all-users", "All users downloaded successfully", 2000);
                    deferred.resolve();
                } else {
                    reject("No records received");
                }
            }, reject);

            return deferred.promise;
        });
    }
}]);
