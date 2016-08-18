irf.models.factory('PagesConfig', ["$resource", "$log", "BASE_URL", "$q", "PagesDefinition",
    function($resource, $log, BASE_URL, $q, PagesDefinition){
    var endpoint = BASE_URL + '/api';

    var pDef = $resource(endpoint, null, {
        getPagesJson: {
            method:'GET',
            url:'process/pages.json'
        },
    });

    pDef.loadPagesConfig = function(userId) {
        return PagesDefinition.getRoleAllowedPageList(userId);
    };

    pDef.getPagesConfig = function(pageId) {
        return PagesDefinition.getRoleAllowedPageList(userid);
    };

    var userAllowedPages = null;

    return pDef;
}]);
