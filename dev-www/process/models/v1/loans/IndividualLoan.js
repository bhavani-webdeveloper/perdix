irf.models.factory('IndividualLoan',[
"$resource","$httpParamSerializer","BASE_URL","searchResource",
function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/individualLoan';
  

    return $resource(endpoint, null, {
        create:{
            method:'POST',
            url:endpoint
        },
        update:{
            method:'PUT',
            url:endpoint
        },
        close:{
            method:'PUT',
            url:endpoint+'/close'
        },
        getDefiniftion: {
            method: "GET",
            url: endpoint + '/definition'
        },
        disburse:{
            method:'PUT',
            url:endpoint+'/disburse'
        },
        batchDisburse:{
            method:'PUT',
            url:endpoint+'/batchDisbursement'
        },
        batchDisbursementConfirmation:{
            method:'POST',
            url:endpoint+'/batchDisbursementConfirmation'
        },
        multiTrancheDisbursement:{
            method:'GET',
            url:endpoint+'/disbursementProcess/:loanId'
        },
        search:searchResource({
            method:'GET',
            url:endpoint+'/find'
        }),
        searchHead:{
            method:'HEAD',
            url:endpoint+'/find',
            isArray:true
        },
        searchDisbursement:searchResource({
            method:'GET',
            url:endpoint+'/findDisbursement'
        }),
        searchDisbursementHead:{
            method:'HEAD',
            url:endpoint+'/findDisbursement',
            isArray:true
        },
        getDisbursementList:{
            method:'GET',
            url:endpoint+'/getDisbursementList',
            isArray:true
        },
        getDocuments:{
            method:'GET',
            url:endpoint+'/getIndividualLoanDocuments'
        },  
        documentsHead:{
            method:'HEAD',
            url:endpoint+'/getIndividualLoanDocuments',
            isArray:true
        },
        updateDisbursement:{
            method:'PUT',
            url:endpoint+'/updateDisbursement'
        },       
         loadSingleLoanWithHistory:{
            method:'GET',
            url:endpoint+'/withhistory/:id'
        },
        get:{
            method:'GET',
            url:endpoint+'/:id',
            transformResponse: function(data, headersGetter, status){
                if (status === 200 && data){
                    data = JSON.parse(data);
                    if (!_.isUndefined(data.nominees) && !_.isNull(data.nominees) && _.isArray(data.nominees) && data.nominees.length>0){
                        for (var i=0;i<data.nominees.length; i++){
                            var n = data.nominees[i];
                            if (!_.isUndefined(n.nomineePincode)){
                                data.nominees[i].nomineePincode = parseInt(n.nomineePincode);
                            }
                        }
                    }
                }

                return data;

            }
        },
        addTranch:{
            method:'PUT',
            url:endpoint+'/addTranch'
        },
        close: {
            method: 'PUT',
            url: endpoint + "/close"
        }
    });
}]);
