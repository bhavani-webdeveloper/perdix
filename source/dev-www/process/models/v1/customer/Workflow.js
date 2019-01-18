irf.models.factory('Workflow', function($resource, $httpParamSerializer, BASE_URL, searchResource, $q) {
    var endpoint = BASE_URL + '/api/workflow';

    var ret = $resource(endpoint, null, {

        query: {
            method: 'GET',
            url: endpoint+"/Customer/Approval",
            isArray:true
        },
        search: searchResource({
            method: 'GET',
            url: endpoint+"/Customer/Approval/",
        }),
        getByID: {
            method: 'GET',
            url: endpoint+"/Customer/Approval/:id"
        },
        save: {
            method: 'POST',
            url: endpoint+"/Customer/Approval"
        },
        getSchema:{
            method: 'GET',
            url: endpoint+"/schema/:processType/:processName"
        },
        updateWorkflow: {
            method: 'POST',
            url: endpoint+"/update",
            transformResponse:function(data, headersGetter, status){
                data = JSON.parse(data);
                if (status == 200){
                    var customer = data.customer;
                    transformResponse(customer);
                }
                return data;
            },
        },
    });

    return ret;
});
