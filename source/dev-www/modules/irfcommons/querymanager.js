irf.commons.factory("irfSearchService", ["$log", "Enrollment", function($log, Enrollment) {
	return {
		searchCustomer: function(id, params) {
			var output;
			switch(id) {
				case 'URN':
					output = Enrollment.search(params);
					break;
			}
			return output;
		}
	};
}]);