irf.models.factory('IndividualLoanProcess',[
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
        loadSingleLoanHistory:{
            method:'GET',
            url:endpoint+'/:id'
        },
    });
}]);
