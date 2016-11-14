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
        bounceCollectionDemand: searchResource({
            method:'GET',
            url:BASE_URL + '/api/scheduledemandlist',
            transformResponse: function(data, headersGetter, status){
                data = JSON.parse(data);
                if (status === 200 && data){
                    var demandLength = data.length;
                    for (var i=0; i<demandLength; i++){
                        var demand = data[i];
                        if (_.hasIn(demand, 'amount1') && _.isString(demand['amount1'])){
                            demand.amount1 = parseFloat(demand['amount1']);
                        }

                        if (_.hasIn(demand, 'amount2') && _.isString(demand['amount2'])){
                            demand.amount2 = parseFloat(demand['amount2']);
                        }
                    }
                }

                var headers = headersGetter();
                var response = {
                    body: data,
                    headers: headers
                }
                return response;
            }
        }),/*
        bounceCollectionDemandHead: {
            method:'HEAD',
            url:BASE_URL + '/api/scheduledemandlist'
        },*/
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
        }),
        repay:{
            method:'POST',
            url:endpoint+'/repay'
        },
        p2pUpdate:{
            method:'POST',
            url:BASE_URL+ "/api/promisetopaykgfs"
        },
        approve:{
            method:'POST',
            url:endpoint+ "/approverepayment"
        },
        partialPayment:{
            method:'PUT',
            url:endpoint+ "/partialpayment"
        },
        waiver:{
            method:'POST',
            url:endpoint+ "/waiver"
        },
        reject:{
            method:'POST',
            url:endpoint+ "/rejectrepayment"
        },
        processCashDeposit:{
            method:'POST',
            url:endpoint+ "/processCashDeposite",
            isArray:true
        },
        generatedefaultschedule:{
            method:'GET',
            url:endpoint+'/generatedefaultschedule',
            isArray:true
        },
        generateScheduleForSpecifiedDate:{
            method:'GET',
            url:endpoint+'/generateScheduleForSpecifiedDate',
            isArray:true
        }
    });
}]);
