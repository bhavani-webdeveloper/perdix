irf.models.factory('Groups',
["$resource", "$httpParamSerializer", "BASE_URL", "searchResource", "$q", "irfSimpleModal",
function($resource,$httpParamSerializer,BASE_URL,searchResource, $q, irfSimpleModal){
    var endpoint = BASE_URL + '/api/groups';
    var resource = $resource(endpoint, null, {
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
        overrideDsc:{
            method:'POST',
            url:endpoint+'/overridedsc'
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

    resource.getDSCDataHtml = function(dscId) {
        var deferred = $q.defer();
        resource.getDSCData({
            dscId: dscId
        }, function(resp, headers) {
            var dataHtml = "<table class='table table-striped table-bordered table-responsive'>";
            dataHtml += "<tr><td>Response : </td><td>" + resp.response + "</td></tr>";
            dataHtml += "<tr><td>Response Message: </td><td>" + resp.responseMessage + "</td></tr>";
            dataHtml += "<tr><td>Stop Response: </td><td>" + resp.stopResponse + "</td></tr>";
            dataHtml += "</table>"
            deferred.resolve(dataHtml);
        }, deferred.reject);
        return deferred.promise;
    };

    resource.showDscDataPopup = function(dscId) {
        resource.getDSCDataHtml(dscId).then(function(dataHtml) {
            irfSimpleModal('DSC Check Details', dataHtml);
        });
    };

    return resource;
}]);
