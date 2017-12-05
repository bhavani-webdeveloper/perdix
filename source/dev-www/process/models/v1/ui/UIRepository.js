irf.models.factory('UIRepository', function($resource, $httpParamSerializer, BASE_URL, searchResource, $q) {

    var ret = $resource("modules/ui/", null, {
        getLoanProcessUIRepository: {
            method: 'GET',
            url: 'modules/ui/loan/LoanProcess.json'
        }

    });

    return ret;
});
/**
 * Created by shahalpk on 05/12/17.
 */
