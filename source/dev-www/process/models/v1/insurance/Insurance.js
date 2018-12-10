irf.models.factory('Insurance',function($resource,$httpParamSerializer,BASE_URL, searchResource){
    var endpoint = BASE_URL + '/api/';    
   
   

    /*
     * $get : /api/enrollments/{blank/withhistory/...}/{id}
     *  eg: /enrollments/definitions -> $get({service:'definition'})
     *      /enrollments/1           -> $get({id:1})
     * $post will send data as form data, save will send it as request payload
     */
    return $resource(endpoint, null, {

      
        getSchema:{
            method:'GET',
            url:'process/schemas/insuranceInformation.json'
        },
       getById: {
        method: 'GET',
        url: endpoint+'getInsurancePolicyDetails'+'/:id'

       },
       create:{
        method:'POST',
        url: endpoint+'insurancePolicy'
       },
       getPremiumAmount:{
        method : 'GET',
        url:endpoint+'insurance/fetchInsurancePremiumDetails',
        isArray : true
       },
        search: searchResource({
            method: 'GET',
            url: endpoint + 'findInsurancePolicyDetails'
        }),
    })
});    


