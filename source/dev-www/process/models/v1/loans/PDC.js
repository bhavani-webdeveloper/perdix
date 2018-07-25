irf.models.factory('PDC', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/ach';
        var endpintManagement = irf.MANAGEMENT_BASE_URL + '/server-ext/pdcdemandlist.php?';
        /*
         * $get : /api/enrollments/{blank/withhistory/...}/{id}
         *  eg: /enrollments/definitions -> $get({service:'definition'})
         *      /enrollments/1           -> $get({id:1})
         * $post will send data as form data, save will send it as request payload
         */

        var resource = $resource(endpoint, null, {
            getSchema: {
                method: 'GET',
                url: 'process/schemas/pdc.json'
            },
            create: {
                method: 'POST',
                url: endpoint + '/createpdcAccount '
            },
            getPDCCheque: searchResource({
                method: 'GET',
                url: endpoint + '/fetchpdcAccount'
            }),
            getSecurityCheque: searchResource({
                method: 'GET',
                url: endpoint + '/securitychequelist'
            }),
            search: searchResource({
                method: 'GET',
                url: endpoint + '/search'
            }),
            update: {
                method: 'PUT',
                url: endpoint + '/editpdcAccount'
            },
            find: {
                method: 'GET',
                url: endpoint + '/findAssignedpdc'
            },
            demandList: {
                method: 'GET',
                url: endpoint + '/pdcdemandList'
            },
            securitycheque: {
                method: 'GET',
                url: endpoint + '/securitychequelist'
            },
            getDemandList: {
                method: 'GET',
                isArray: true,
                url: endpoint + '/pdcdemandList'
            },
            bulkRepay: {
                method: 'POST',
                url: endpoint + '/pdcbulkrepay'
            },
            demandDownloadStatus: searchResource({
                method: 'GET',
                url: endpintManagement + "demandDate=:demandDate&branchId=:branchId"
            }),
            deleteSecurity: searchResource({
                method: 'POST',
                url: endpoint + '/updatePdcSecurityAccount'
            }),
            updateSecurityPDC: {
                method: "POST",
                url: endpoint + "/updatePdcSecurityAccount",
                isArray: true
            },
            deletePDC: {
                method: "POST",
                url: endpoint + "/deletepdc"
            }
        });

        resource.pdcReverseFeedListUpload = function(file, progress) {
            var deferred = $q.defer();
            Upload.upload({
                url: BASE_URL + "/api/batch/achOrPdcRealizationUpload",
                data: {
                    file: file,
                    repaymentMode:'PDC'
                }
            }).then(function(resp) {
                // TODO handle success
                PageHelper.showProgress("page-init", "Done.", 2000);
                deferred.resolve(resp);
            }, function(errResp) {
                // TODO handle error
                PageHelper.showErrors(errResp);
                deferred.reject(errResp);
            }, progress);
            return deferred.promise;
        };

        return resource;
    }
]);