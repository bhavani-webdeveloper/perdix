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

irf.pages.run(["$rootScope","$q", "SessionStore", "PageHelper", "Commons",
    function ($rootScope,$q,SessionStore, PageHelper, Commons) {
        $rootScope.$on("irf-login-success", function () {
            Commons.tipOfTheDay({
                'thoughtDate': SessionStore.getSystemDate(),
                'bankId': SessionStore.getBankId()
            }, {},function (resp) {
                PageHelper.setInfo({message : resp.thoughtOfTheDay});
            }, function (resp) {
                console.log("Errors Please Check");
            });
        })
    }]);