irf.models.factory('UserBranch', function($resource, $httpParamSerializer, searchResource) {
    var endpoint = irf.MANAGEMENT_BASE_URL + "/server-ext";

    var res = $resource(endpoint, null, {
        searchUser: searchResource({
            method: "GET",
            url: endpoint + "/user_search.php"
        }),
        getUserBranches: searchResource({
            method: "GET",
            url: endpoint + "/user_branch_list.php"
        }),
        save: {
            method: "POST",
            url: endpoint + "/user_branch_add.php"
        },
        delete: {
            method: "POST",
            url: endpoint + "/user_branch_delete.php"
        }
    });

    return res;
});