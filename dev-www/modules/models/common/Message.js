irf.models.factory("Message", [
"$resource", "$httpParamSerializer", "SessionStore",
function($resource, $httpParamSerializer, SessionStore) {
	var endpoint = irf.MANAGEMENT_BASE_URL + '/server-ext/message';

	var resource =  $resource(endpoint, null, {
		getUnreadMessageCount: {
			method:'HEAD',
			url:endpoint+'/getUnreadMessageCount.php',
			transformResponse: function(data, headers){
				response = {
					data: data,
					headers: headers()
				};
				return response;
			}
		},
		createMessage: {
			method: 'POST',
			url: endpoint+'/createMessage.php'
		},
		messageThreadList: {
			method: 'GET',
			url: endpoint+'/messageThreadList.php'
		},
		messageList: {
			method: 'GET',
			url: endpoint+'/MessageList.php'
		},
		messageThreadParticipants: {
			method: 'GET',
			url: endpoint+'/MessageThreadParticipants.php'
		},
		messageRead: {
			method: 'HEAD',
			url: endpoint+'/messageRead.php'
		},
		addMessageParticipant: {
			method: 'POST',
			url: endpoint+'/addMessageParticipant.php'
		},
		addMessage: {
			method: 'POST',
			url: endpoint+'/addMessage.php'
		},
		closeMessage: {
			method: 'HEAD',
			url: endpoint+'/closeMessage.php'
		}
	});

	return resource;
}]);