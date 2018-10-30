irf.models.factory('Commons', [
"$resource","$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
function ($resource,$httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
    var endpoint = BASE_URL + "/api";

    var resource = $resource(endpoint, null, {
        tipOfTheDay: {
            method: "GET",
            url: endpoint + "/tipoftheday/thoughtDate"
        }
    });
    return resource;
}]);