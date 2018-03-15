irf.models.factory('Product', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {

        var endpoint = BASE_URL + '/api/loanproducts';
        var val = '/getProductMappings?branchId=';
        var resource = $resource(endpoint, null, {
            getSchema: {
                method: 'GET',
                url: 'process/schemas/luc.json'
            },
            update: {
                method: 'PUT',
                url: endpoint + '/update'
            },
            search: searchResource({
                method: 'GET',
                url: endpoint + '/find'
            }),
            get: {
                method: 'GET',
                url: endpoint + '/:id'
            },
            createProduct: {
                method: 'POST',
                url: endpoint + '/create',

            },
            getProductTypeMaster :{
                method:'GET',
                url:endpoint + '/findProductTypeMasters',
                isArray:true
            },
            findProductConfiguration:{
                 method:'GET',
                url:endpoint +val+':id',
                // isArray:true

            },
            createProductConfiguration:{
                method:'POST',
                url: endpoint + '/createProductConfigurationList',
               // isArray:true
               // /api/loanproducts/createProductConfigurationList
            }
           


        });

        return resource;
    }
]);