irf.models.factory('MantraFingrePrintService', function($resource, $httpParamSerializer, BASE_URL, searchResource, $q) {
    var mantraEndPoint="https://localhost:9999/";
    var ret = $resource(mantraEndPoint, null, {

        captureFingerPrintMantra: {
                method: 'GET',
                url: mantraEndPoint+'capturefingerprint'
            },
            verifyFingerPrintMantra: {
                method: 'POST',
                url: mantraEndPoint+'verify'
            }
    });

    return ret;
});