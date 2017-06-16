irf.models.factory('Groups',function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/groups';
    return $resource(endpoint, null, {
        get:{
            method:'GET',
            url:endpoint+"/:service/:action"
        },
        query:{
            method:'GET',
            url:endpoint,
            isArray:true
        },
        getDSCData:{
            method:'GET',
            url:BASE_URL+"/api/dsc/{id}"
        },
        getGroup:{
            method:'GET',
            url:endpoint+'/:groupId'
        },
        searchHeaders:{
            method:'HEAD',  //@TODO : Should be HEAD, waiting for Serverside fix
            url:endpoint+'/search',
            isArray:true
        },
        getSchema:{
            method:'GET',
            url:'process/schemas/groups.json'
        },
        search:searchResource({
            method:'GET',
            url:endpoint+'/search'
        }),
        getDscOverrideList:searchResource({
            method:'GET',
            url:endpoint+"/dscoverridelist"
        }),
        getDscOverrideListHead:{
            method:'HEAD', //@TODO : Should be HEAD, waiting for Serverside fix
            url:endpoint+"/dscoverridelist",
            isArray:true
        },
        post:{
            method:'POST',
            url:endpoint+'/:service/:action'
        },
        dscQuery:{
            method:'POST',
            url:endpoint+'/grouploandsc',
            isArray:true
        },
        update:{
            method:'PUT',
            url:endpoint+'/:service/:action'
        },
        save:{
            method:'POST',
            url:endpoint+'/:service/:action'
        },
        getDisbursementDetails:searchResource( {
            method: 'GET',
            url: BASE_URL + '/api/loanaccounts/groupdisbursement/:partnerCode/:groupCode',
        }),
    });
});
