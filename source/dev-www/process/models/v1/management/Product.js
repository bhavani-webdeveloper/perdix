irf.models.factory('Product', ["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "Upload", "$q", "PageHelper",
    function($resource, $httpParamSerializer, BASE_URL, searchResource, Upload, $q, PageHelper) {

        var endpoint = BASE_URL + '/api/loanproducts';
        var endpoint2 = BASE_URL + '/api/loanproduct';
        var branchId = '/getProductMappings?branchId=';
        var productId = '/getBranchMappings?productCode=';
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
                url: endpoint2 + '/:id'
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
                url:endpoint +branchId+':id',
                // isArray:true

            },
            createProductConfiguration:{
                method:'POST',
                url: endpoint + '/createProductConfigurationList',
               // isArray:true
               // /api/loanproducts/createProductConfigurationList
            },
            getBranchMappings:{
                method:'GET',
                url:endpoint + productId+ ':id'
            },
            createProductCodeConfiList:{
                method:'POST',
                url:endpoint+'/createProductCodeConfigurationList'
            }
           


        });

        return resource;
    }
]);