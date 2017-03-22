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

/*

{
	"title": "BI_LINK",
	"iconClass": "fa fa-area-chart",
	"linkId": "BI_LINK1",
	"link": "http://www.heromotocorp.com/en-in/reach-us/book-bike-service-appointment.html"
}

*/