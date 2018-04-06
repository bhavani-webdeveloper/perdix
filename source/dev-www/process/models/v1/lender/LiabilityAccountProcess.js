irf.models.factory('LiabilityAccountProcess', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {
        var endpoint = BASE_URL + '/api/liabilityAccount';
        var endpoint2 = BASE_URL + '/api/liabilityRepayment/create';
        var resource = $resource(endpoint, null, {
           getLenderSchema: {
                method: 'GET',
                url: 'modules/ui/lender/LenderLiabilitiesLoanAccountBookingProcess.json',
                //isArray:true
            },
            get: {
                method: 'GET',
                url: endpoint+"/:id"
            },
            save: {
                method: 'POST',
                url: endpoint
            },
            proceed: {
                method: 'PUT',
                url: endpoint
            },
            search: searchResource({
                method: 'GET',
                url: endpoint
            }),
            getLiabilityAccount:{
                method:'GET',
                url:endpoint +':id',
                isArray:true
            },
            getLiabilityAccountSearch:searchResource({
                method:'GET',
                url:endpoint +':id'
                //isArray:true
            }),
            liabilityRepay:{
                method: 'POST',
                url: endpoint2
            }
        });
        resource.documentDownload = function(loanId){
            return endpoint + '/documents?liabilityAccountId='+loanId;

        };
        return resource;
    }
]);