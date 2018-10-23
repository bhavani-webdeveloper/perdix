irf.models.factory('Commons', [
    "$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function ($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
    var endpoint  = BASE_URL + "/api";

        var resource = $resource(endpoint, null, {
            tipOfTheDay: {
                method : "GET",
                url : endpoint + "/tipoftheday/thoughtDate",
                isArray : true
            }
        });
        return resource;
    }]);

    irf.pages.run([ "$rootScope", "SessionStore","PageHelper","Commons", 
    function( $rootScope, SessionStore,PageHelper,Commons) {
        $rootScope.$on("irf-login-success", function() {
        Commons.tipOfTheDay({
            'thoughtDate':SessionStore.getSystemDate(), 
            'bankId': 1
            }, {}, function (resp) {
                PageHelper.setInfo(resp);
                //irfNavigator.goBack();
            }, function (resp) {
                PageHelper.showInfo(resp);
            });
            // Commons.tipOfTheDay({'thoughtDate':SessionStore.getSystemDate(), 'bankId': SessionStore.getBankId()}).$promise
            // .then(function(res){
            //     PageHelper.setInfo(res);
            // },function(err){
            //     PageHelper.setInfo('hi');
            // });
            
        })
    }]);