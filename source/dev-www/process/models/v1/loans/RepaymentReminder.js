irf.models.factory('RepaymentReminder',[
"$resource","$httpParamSerializer","BASE_URL","searchResource",
function($resource,$httpParamSerializer,BASE_URL,searchResource){
    var endpoint = BASE_URL + '/api/repaymentreminder';
    var endpoint1 = BASE_URL + '/api/getRepaymentAndRemindersByLoanAccount';
    

    return $resource(endpoint, null, {
    	get: {
    		method:'GET',
    		url:endpoint+'/:id'
    	},
        query: searchResource({
            method: "GET",
            url: endpoint + '/'  
        }),
        update: {
            method: 'PUT',
            url: endpoint+ '/update'
        },
        getAccountDetails: {
            method: 'GET',
            url: endpoint1 + '/:accountNumber',
            isArray: true
        }
    });
}]);
