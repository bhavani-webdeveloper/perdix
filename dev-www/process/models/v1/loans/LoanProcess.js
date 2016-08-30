irf.models.factory('LoanProcess',[
"$resource","$httpParamSerializer","BASE_URL","searchResource",
function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/loanaccounts';
    /*
    * GET /api/loanaccounts/reverse/{transactionId}/{transactionName} will translate into
    * {action:'reverse',param1:'<tid>',param2:'<tname>'}
    *
    * */

    return $resource(endpoint, null, {
        get:{
            method:'GET',
            url:endpoint+'/:action/:param1/:param2'
        },
        query:{
            method:'GET',
            url:endpoint+'/:action/:param1/:param2',
            isArray:true
        },
        post:{
            method:'POST',
            url:endpoint+'/:action',
        },
        save:{
            method:'POST',
            url:endpoint+'/:action',
        },
        collectionDemandSearch: searchResource({
            method: "GET",
            url: endpoint + '/collectiondemand'
        }),
        collectionDemandUpdate:{
            method:'PUT',
            url:endpoint+'/collectiondemand/update',
        },
        getPldcSchema:{
            method:'GET',
            url:'process/schemas/pldc.json'
        },
        /*bounceCollectionDemand will show all the loans which has some overdue amount*/
        bounceCollectionDemand:searchResource({
            method:'GET',
            url:BASE_URL + '/api/scheduledemandlist'
        }),
        repaymentList:searchResource({
            method:'GET',
            url:endpoint+'/repaymentlist'
        }),
        postArray:{
            method:'POST',
            url:endpoint+'/:action',
            isArray:true
        },
        p2pKGFSList:searchResource({
            method:'GET',
            url:BASE_URL + '/api/promisetopaykgfslist'
        })

    });
}]);
