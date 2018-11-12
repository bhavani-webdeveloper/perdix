irf.models.factory('Locking', [
"$resource", "BASE_URL", "searchResource",
function($resource, BASE_URL, searchResource) {
    var endpoint = BASE_URL + '/api/workflow';
    return $resource(endpoint, null, {
        lock: {
            method: 'POST',
            url: endpoint + "/Lock"
        },
        unlock: {
            method: 'GET',
            url: endpoint + "/Unlock"
        },
        findlocks: searchResource({
            method: 'GET',
            url: endpoint + "/findLocks"
        }),
        clearlocks: {
            method: 'GET',
            url: endpoint + "/ClearLocks"
        },
    });
}]);