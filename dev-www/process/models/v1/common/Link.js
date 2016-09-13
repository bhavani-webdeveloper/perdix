irf.models.factory('Link', [
    "$resource", "$httpParamSerializer", "BASE_URL", "SessionStore",
    function($resource, $httpParamSerializer, BASE_URL, SessionStore) {
        var endpoint = BASE_URL + '/api';

        var links = $resource(endpoint, null, {});

        links.BI_LINK1 = function(event, menu, link) {
            window.open(link);
        }

        return links;
    }
]);