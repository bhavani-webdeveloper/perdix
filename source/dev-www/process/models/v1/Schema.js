irf.models.factory('SchemaResource',function($resource,$httpParamSerializer,BASE_URL){
    var endpoint = BASE_URL + '/api/_refs/referencecodes';
    return $resource(endpoint, null, {
        getLoanAccountSchema: {
            method: 'GET',
            url: 'process/schemas/loanAccount.json'
        },
        getDisbursementSchema:{
            method:'GET',
            url:'process/schemas/disbursement.json'
        },
        getUserSchema: {
            method: "GET",
            url: "process/schemas/user.json"
        },
        getJournalMultiSchema: {
            method: 'GET',
            url: 'process/schemas/JournalMultiPosting.json'
        },

    });
});
